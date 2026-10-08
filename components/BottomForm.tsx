'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import PrivacyModal, { type ConsentResult } from './PrivacyModal';
import { validateForm, parsePhone, isUnder14, SPECIAL_CHAR_REG, cleanMobile2 } from '@/lib/validate';
import { REGIONS } from '@/data/constants';
import { CONSENT_VERSION } from '@/lib/site';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * 입력 초기값 — 본문 폼(FormSection)의 initial 과 키·기본값이 같다.
 * 지역 기본값만 본문 폼의 defaultRegion(지역 페이지 전용)이 없어 빈 값으로 둔다.
 */
const INITIAL = {
  customer_name: '',
  customer_birth: '',
  mobile1: '010',
  mobile2: '',
  customer_sex: '2',
  region: '',
  has_license: 'N',
  guardian_name: '',
  guardian_phone: '',
};

/**
 * ★ 화면 하단 고정 바텀폼 — app/layout.tsx 에서 전역 마운트되어 모든 페이지에 노출된다.
 *
 * 받는 항목은 본문 폼(components/FormSection.tsx)과 1:1 로 같다.
 *   성함 · 성별 · 생년월일 · 연락처(앞자리+번호) · 희망 지역 · 자격증 보유 여부
 *   (+ 만 14세 미만일 때만 보호자 성함 · 보호자 연락처)
 * 본문 폼에 없는 항목은 만들지 않고, 사용자가 입력하지 않은 값을 빈 문자열로
 * 채워 보내지도 않는다. 모든 칸은 접지 않고 처음부터 화면에 보인다.
 *
 * 검증은 본문 폼과 같은 함수를 그대로 쓴다 (validateForm · parsePhone · isUnder14).
 * 만 14세 미만 판정도 본문 폼과 같이 생년월일(isUnder14)로 하며, 보호자 정보와
 * 법정대리인 동의(PrivacyModal isMinor)를 같은 조건에서 받는다.
 * 안내 문구만 alert 대신 바 안의 상태 영역(aria-live="polite")에 띄운다.
 *
 * 전송 경로·필드 이름·환경변수는 본문 폼과 완전히 동일하다.
 *   POST ${NEXT_PUBLIC_DB_SUBMIT_URL}?api_key=${NEXT_PUBLIC_DB_API_KEY}
 * source_page 만 어느 쪽에서 들어온 리드인지 DB 에서 갈리도록
 * 'bottom-form' + 경로 로 남긴다 (project29 와 같은 규칙).
 *
 * 레이아웃은 globals.css 의 .bottom-form* 규칙이 담당한다
 * (z-index 45, 모바일 2열 격자 / 900px 이상 한 줄, body 하단 여백).
 */
/** 이 거리(px) 이상 스크롤해야 바텀폼이 올라온다 */
const SHOW_AFTER = 300;

export default function BottomForm() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [form, setForm] = useState(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const minor = isUnder14(form.customer_birth);
  const sending = status === 'sending';

  /**
   * 바가 본문 마지막 내용을 가리지 않도록 실제 바 높이를 body 하단 여백으로 돌려준다.
   * 화면 폭에 따라 줄 수가 바뀌고 보호자 줄·상태 문구가 늘면 높이가 변하므로
   * ResizeObserver 로 추적한다. (하이드레이션 전에는 globals.css 의 fallback 값이 쓰인다)
   */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty('--bottom-form-h', `${Math.ceil(el.offsetHeight) + 16}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      document.documentElement.style.removeProperty('--bottom-form-h');
    };
  }, []);

  // 처음엔 화면 아래에 숨겨 두고, SHOW_AFTER(px) 이상 스크롤하면 올라온다. 맨 위로 돌아가면 다시 내려간다.
  // 단, 한 번이라도 바 안에 입력을 시작했으면 계속 띄워 둔다(입력·동의 모달·전송 결과 확인 중 사라지지 않게).
  // 스크롤할 거리가 SHOW_AFTER 보다 짧은 페이지는 처음부터 보여준다.
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return;
    let pinned = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setShown(pinned || scrollable < SHOW_AFTER || window.scrollY > SHOW_AFTER);
    };
    const pin = () => { pinned = true; update(); };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    bar.addEventListener('focusin', pin);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      bar.removeEventListener('focusin', pin);
    };
  }, []);

  const fail = (msg: string) => {
    setStatus('error');
    setMessage(msg);
  };

  /** 입력이 바뀌면 직전 안내 문구를 지운다 (전송 중에는 건드리지 않는다) */
  const set = (key: keyof typeof INITIAL, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (status !== 'sending') {
      setStatus('idle');
      setMessage('');
    }
  };

  /** 본문 폼과 같은 특수문자 규칙 — 입력된 문자를 되돌리고 안내한다 */
  const handleNameChange = (value: string) => {
    if (SPECIAL_CHAR_REG.test(value)) {
      setForm((p) => ({ ...p, customer_name: value.slice(0, -1) }));
      fail('이름에 특수문자는 입력하실 수 없습니다.');
      return;
    }
    set('customer_name', value);
  };

  /** 본문 폼 handleSubmitClick 과 같은 순서·같은 규칙으로 검증한 뒤 동의 모달을 띄운다 */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const error = validateForm({ ...form, privacy: true });
    if (error) { fail(error); return; }
    if (!form.region) { fail('희망 지역을 선택해 주세요.'); return; }
    if (minor && !form.guardian_name) { fail('만 14세 미만은 보호자 성함을 입력해 주세요.'); return; }
    if (minor && !/^\d{10,11}$/.test(form.guardian_phone)) { fail('만 14세 미만은 보호자 연락처(숫자만)를 입력해 주세요.'); return; }
    // 번호 형식(앞자리 조합)도 동의를 받기 전에 미리 걸러 둔다 — 규칙은 본문 폼과 같다
    const parsed = parsePhone(form.mobile1, form.mobile2);
    if (typeof parsed === 'string') { fail(parsed); return; }

    setStatus('idle');
    setMessage('');
    setShowModal(true);
  };

  // 광고성 수신 동의 UI 를 화면에서 내렸으므로 동의 결과에서 읽을 값이 없다.
  // 되살릴 때: (consent: ConsentResult) 로 되돌리고 아래 consent_marketing 을 consent.marketing 으로.
  const handleConfirm = async (_consent: ConsentResult) => {
    const parsed = parsePhone(form.mobile1, form.mobile2);
    if (typeof parsed === 'string') { fail(parsed); return; }

    const payload = {
      customer_name: form.customer_name,
      customer_birth: form.customer_birth,
      mobile1: parsed.mobile1,
      mobile2: parsed.mobile2,
      mobile3: '',
      customer_sex: form.customer_sex,
      region: form.region,
      has_license: form.has_license,
      category: '메이크업학원',
      // 본문 폼과 구분해야 어느 쪽에서 들어온 리드인지 DB 에서 갈린다 (project29 와 같은 규칙)
      source_page: `bottom-form${pathname || '/'}`,

      // ── 동의 이력 ── 본문 폼과 같은 키·같은 버전으로 남긴다
      consent_privacy: true,                 // [필수] 수집·이용
      consent_third_party: true,             // [필수] 제3자 제공
      // 광고성 정보 수신 동의는 화면에서 제외했으므로 false 고정 (필드는 스키마 유지를 위해 남긴다)
      consent_marketing: false,              // [제외] 광고성 정보 수신 — 동의 UI 없음
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,

      ...(minor
        ? { guardian_name: form.guardian_name, guardian_phone: form.guardian_phone, consent_guardian: true }
        : {}),
    };

    const url = process.env.NEXT_PUBLIC_DB_SUBMIT_URL;
    const key = process.env.NEXT_PUBLIC_DB_API_KEY;
    if (!url || !key) { fail('전송 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.'); return; }

    setStatus('sending');
    setMessage('전송 중입니다...');
    try {
      const res = await fetch(`${url}?api_key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        fail(`전송 실패: ${(err as { error?: string }).error ?? res.status}`);
        return;
      }
      setForm({ ...INITIAL });
      setStatus('done');
      setMessage('상담 신청이 접수되었습니다. 영업일 기준 1일 이내에 연락드리겠습니다.');
    } catch {
      fail('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const statusColor =
    status === 'error' ? '#B45309' : status === 'done' ? 'var(--success)' : 'var(--text-secondary)';

  return (
    <div className={`bottom-form${shown ? ' is-shown' : ''}`} ref={barRef}>
      {showModal && (
        <PrivacyModal onConfirm={handleConfirm} onClose={() => setShowModal(false)} isMinor={minor} />
      )}

      <div className="bottom-form__inner">
        {status === 'done' ? (
          <div className="bottom-form__done">
            <p className="bottom-form__done-text">상담 신청이 접수되었습니다</p>
            <button
              type="button"
              className="btn btn--ghost bottom-form__reset"
              onClick={() => { setStatus('idle'); setMessage(''); }}
            >
              다른 조건으로 다시 신청하기
            </button>
          </div>
        ) : (
          <form
            className={`bottom-form__grid${minor ? ' bottom-form__grid--minor' : ''}`}
            onSubmit={handleSubmit}
            aria-label="메이크업학원 빠른 상담 신청"
            noValidate
          >

            {/* 성함 · 성별 */}
            <div className="bottom-form__cell bottom-form__cell--name">
              <label htmlFor="bf-name" className="bottom-form__sr">성함</label>
              <div className="bottom-form__box">
                <input
                  id="bf-name"
                  className="bottom-form__input"
                  type="text"
                  value={form.customer_name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  maxLength={8}
                  placeholder="예) 홍길동"
                  autoComplete="name"
                />
                <span className="bottom-form__sex" role="group" aria-label="성별">
                  {[{ label: '남', val: '1' }, { label: '여', val: '2' }].map(({ label, val }) => (
                    <button
                      key={val}
                      type="button"
                      className="bottom-form__sexbtn"
                      onClick={() => set('customer_sex', val)}
                      aria-pressed={form.customer_sex === val}
                      aria-label={`성별 ${label}`}
                    >
                      {label}
                    </button>
                  ))}
                </span>
              </div>
            </div>

            {/* 생년월일 — 만 14세 미만 판정 기준 (본문 폼과 같은 isUnder14) */}
            <div className="bottom-form__cell bottom-form__cell--birth">
              <label htmlFor="bf-birth" className="bottom-form__sr">생년월일 6자리</label>
              <div className="bottom-form__box">
                <input
                  id="bf-birth"
                  className="bottom-form__input"
                  type="text"
                  inputMode="numeric"
                  value={form.customer_birth}
                  onChange={(e) => set('customer_birth', e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="예) 990101"
                  autoComplete="bday"
                />
              </div>
            </div>

            {/* 연락처 — 앞자리 선택 + 번호 (본문 폼과 같은 목록·같은 parsePhone 규칙) */}
            <div className="bottom-form__cell bottom-form__cell--phone">
              <div className="bottom-form__phonewrap">
                <div className="bottom-form__box bottom-form__box--sel bottom-form__box--prefix">
                  <label htmlFor="bf-mobile1" className="bottom-form__sr">전화번호 앞자리</label>
                  <select
                    id="bf-mobile1"
                    className="bottom-form__select"
                    value={form.mobile1}
                    onChange={(e) => set('mobile1', e.target.value)}
                  >
                    {['010', '011', '016', '017', '019'].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <span className="bottom-form__caret" aria-hidden="true">▼</span>
                </div>
                <div className="bottom-form__box bottom-form__box--num">
                  <label htmlFor="bf-mobile2" className="bottom-form__sr">전화번호</label>
                  <input
                    id="bf-mobile2"
                    className="bottom-form__input"
                    type="tel"
                    inputMode="numeric"
                    value={form.mobile2}
                    onChange={(e) => set('mobile2', cleanMobile2(e.target.value))}
                    placeholder="예) 12345678"
                    autoComplete="tel-national"
                  />
                </div>
              </div>
            </div>

            {/* 희망 지역 — 본문 폼과 같은 데이터 소스(data/constants REGIONS) */}
            <div className="bottom-form__cell bottom-form__cell--region">
              <label htmlFor="bf-region" className="bottom-form__sr">희망 지역</label>
              <div className="bottom-form__box bottom-form__box--sel">
                <select
                  id="bf-region"
                  className={`bottom-form__select${form.region ? '' : ' bottom-form__select--empty'}`}
                  value={form.region}
                  onChange={(e) => set('region', e.target.value)}
                >
                  <option value="" disabled hidden>지역 선택</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="bottom-form__caret" aria-hidden="true">▼</span>
              </div>
            </div>

            {/* 자격증 보유 여부 — 본문 폼과 같은 'Y' / 'N' 값 */}
            <div className="bottom-form__cell bottom-form__cell--license">
              <div className="bottom-form__box">
                <span className="bottom-form__boxlabel" aria-hidden="true">자격증</span>
                <button
                  type="button"
                  className="bottom-form__switch"
                  onClick={() => set('has_license', form.has_license === 'Y' ? 'N' : 'Y')}
                  aria-pressed={form.has_license === 'Y'}
                  aria-label="미용사(메이크업) 자격증 보유 여부"
                >
                  <span className="bottom-form__switch-text">{form.has_license === 'Y' ? '보유' : '없음'}</span>
                  <span className="bottom-form__track" aria-hidden="true">
                    <span className="bottom-form__knob" />
                  </span>
                </button>
              </div>
            </div>

            {/* 만 14세 미만 보호자 정보 — 본문 폼과 같은 조건에서만 나타난다 */}
            {minor && (
              <div className="bottom-form__guardian">
                <p className="bottom-form__guardian-note">
                  만 14세 미만으로 확인됩니다 — 보호자(법정대리인) 정보를 함께 입력해 주세요.
                </p>
                <div className="bottom-form__cell">
                  <label htmlFor="bf-gname" className="bottom-form__sr">보호자 성함</label>
                  <div className="bottom-form__box">
                    <input
                      id="bf-gname"
                      className="bottom-form__input"
                      type="text"
                      value={form.guardian_name}
                      onChange={(e) => set('guardian_name', e.target.value)}
                      maxLength={8}
                      placeholder="예) 홍길동"
                    />
                  </div>
                </div>
                <div className="bottom-form__cell">
                  <label htmlFor="bf-gphone" className="bottom-form__sr">보호자 연락처</label>
                  <div className="bottom-form__box">
                    <input
                      id="bf-gphone"
                      className="bottom-form__input"
                      type="tel"
                      inputMode="numeric"
                      value={form.guardian_phone}
                      onChange={(e) => set('guardian_phone', e.target.value.replace(/\D/g, ''))}
                      maxLength={11}
                      placeholder="예) 01012345678"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 제출 — 본문 폼과 같이 동의 모달을 거쳐 전송된다 */}
            <div className="bottom-form__cell bottom-form__cell--submit">
              <button
                type="submit"
                className="btn btn--primary bottom-form__submit"
                disabled={sending}
                style={{ opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
              >
                {sending ? '전송 중...' : '무료 상담 신청'}
              </button>
            </div>
          </form>
        )}

        {/* 동의 체크 줄은 숨겼다. 제출 버튼을 누르면 동의 모달(handleConfirm 경로)이 뜬다. */}
        <p
          className="bottom-form__status"
          aria-live="polite"
          style={{ color: statusColor, lineHeight: message ? 1.5 : 0 }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

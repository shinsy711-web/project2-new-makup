'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { parsePhone } from '@/lib/validate';
import { CONSENT_VERSION } from '@/lib/site';

type Status = 'idle' | 'sending' | 'done' | 'error';

/**
 * ★ 화면 하단 고정 바텀폼 — app/layout.tsx 에서 전역 마운트되어 모든 페이지에 노출된다.
 *
 * 긴 폼(FormSection)까지 스크롤하지 않은 이탈 직전 방문자를 번호 한 줄로 받는 용도다.
 * 전송 경로·필드 이름·환경변수는 FormSection 과 완전히 동일하게 맞춘다.
 *   POST ${NEXT_PUBLIC_DB_SUBMIT_URL}?api_key=${NEXT_PUBLIC_DB_API_KEY}
 * 번호만 받으므로 성함·생년월일·성별·지역·자격증 필드는 빈 문자열로 보낸다.
 * (어느 페이지에서 들어왔는지는 FormSection 과 같이 source_page 로 남긴다)
 *
 * 동의 구성은 FormSection → PrivacyModal 의 필수 항목과 같다.
 *   [필수] 개인정보 수집 및 이용 동의 / 개인정보 제3자 제공 동의 / 만 14세 이상 확인
 * 생년월일을 받지 않아 만 14세 미만을 판정할 수 없으므로, 법정대리인 동의 대신
 * '만 14세 이상 확인'을 필수로 받는다. 미만 이용자는 본문 폼(FormSection)으로 보내
 * 보호자 정보를 받는다. 선택 항목(광고성 정보 수신)은 받지 않으므로 false 로 보낸다.
 *
 * 레이아웃은 globals.css 의 .bottom-form* 규칙이 담당한다 (z-index 45, body 하단 여백).
 */
export default function BottomForm() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  /**
   * 바가 본문 마지막 내용을 가리지 않도록 실제 바 높이를 body 하단 여백으로 돌려준다.
   * 좁은 화면에서 두 줄로 접히거나 상태 문구가 늘면 높이가 바뀌므로 ResizeObserver 로 추적한다.
   * (하이드레이션 전에는 globals.css 의 fallback 값이 쓰인다)
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

  const fail = (msg: string) => {
    setStatus('error');
    setMessage(msg);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    if (!phone) { fail('휴대폰 번호를 입력해 주세요.'); return; }
    // FormSection 과 같은 검증 함수를 쓴다. 앞자리 선택이 없으므로 기본값 '010' 을 넘기고,
    // 11자리(01012345678)로 입력하면 parsePhone 이 앞 3자리를 떼어 mobile1 으로 잡는다.
    const parsed = parsePhone('010', phone);
    if (typeof parsed === 'string') { fail(parsed); return; }
    if (!agreed) { fail('필수 동의 항목에 동의해 주세요.'); return; }

    const url = process.env.NEXT_PUBLIC_DB_SUBMIT_URL;
    const key = process.env.NEXT_PUBLIC_DB_API_KEY;
    if (!url || !key) { fail('전송 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.'); return; }

    const payload = {
      customer_name: '',
      customer_birth: '',
      mobile1: parsed.mobile1,
      mobile2: parsed.mobile2,
      mobile3: '',
      customer_sex: '',
      region: '',
      has_license: '',
      category: '메이크업학원',
      source_page: pathname || '/',

      // ── 동의 이력 ── FormSection 과 같은 키·같은 버전으로 남긴다
      consent_privacy: true,
      consent_third_party: true,
      consent_marketing: false,
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,
    };

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
      setPhone('');
      setAgreed(false);
      setStatus('done');
      setMessage('상담 신청이 접수되었습니다. 영업일 기준 1일 이내에 연락드리겠습니다.');
    } catch {
      fail('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const sending = status === 'sending';
  const statusColor =
    status === 'error' ? '#B45309' : status === 'done' ? 'var(--success)' : 'var(--text-secondary)';

  return (
    <div className="bottom-form" ref={barRef}>
      <form className="bottom-form__inner" onSubmit={handleSubmit} aria-label="빠른 상담 신청" noValidate>

        {/* 필수 동의 — 항목 이름은 PrivacyModal 의 문구를 그대로 쓰고, 상세는 처리방침으로 연결한다 */}
        <div className="bottom-form__consent">
          <label className="bottom-form__agree" htmlFor="bottom-form-agree">
            <input
              id="bottom-form-agree"
              className="bottom-form__cb"
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (status !== 'sending') { setStatus('idle'); setMessage(''); }
              }}
            />
            <span className="bottom-form__cbbox" aria-hidden="true">
              {agreed && (
                <svg width="11" height="9" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="bottom-form__agree-text">
              모두 동의 <span style={{ color: 'var(--primary)' }}>(필수)</span>
            </span>
          </label>
          <p className="bottom-form__items">
            개인정보 수집 및 이용 동의 · 개인정보 제3자 제공 동의 · 만 14세 이상 확인{' '}
            <Link href="/privacy-policy/" className="bottom-form__detail">전문 보기</Link>
          </p>
        </div>

        {/* 휴대폰 번호 + 전송 */}
        <div className="bottom-form__fields">
          <label htmlFor="bottom-form-phone" className="bottom-form__sr">휴대폰 번호</label>
          <input
            id="bottom-form-phone"
            className="bottom-form__phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={11}
            placeholder="휴대폰 번호 ('-' 없이 입력)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ''));
              if (status !== 'sending') { setStatus('idle'); setMessage(''); }
            }}
          />
          <button
            type="submit"
            className="btn btn--primary bottom-form__submit"
            disabled={sending}
            style={{ opacity: sending ? 0.6 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}
          >
            {sending ? '전송 중...' : '무료 상담 신청'}
          </button>
        </div>

        <p
          className="bottom-form__status"
          aria-live="polite"
          style={{ color: statusColor, lineHeight: message ? 1.5 : 0 }}
        >
          {message}
        </p>
      </form>
    </div>
  );
}

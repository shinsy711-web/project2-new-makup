"use client";

import { useState } from "react";
import PrivacyModal, { type ConsentResult } from "./PrivacyModal";
import { validateForm, parsePhone, isUnder14, SPECIAL_CHAR_REG } from "@/lib/validate";
import { REGIONS } from "@/data/constants";
import { CONSENT_VERSION } from "@/lib/site";

type Props = {
  /** 버튼 문구 — 레지스트리의 페이지별 CTA */
  cta?: string;
  /** DB에 남길 유입 페이지 식별자 */
  sourcePage?: string;
  /** 지역 페이지에서 기본 선택되는 희망 지역 */
  defaultRegion?: string;
  heading?: string;
  subheading?: string;
  /** 앵커 id (기본 'form') */
  id?: string;
  /** 다크 배경 위에 올릴 때 (히어로 내부) */
  onDark?: boolean;
};

/**
 * ★ DB 수집 폼 — 모든 페이지 최상단(H1 바로 아래)에 배치되는 핵심 컴포넌트.
 *
 * 입력 항목은 project23 과 동일한 5가지로 유지한다.
 *   성함(+성별) · 생년월일 · 연락처 · 희망 지역 · 자격증 보유 여부
 * 항목이 늘수록 전환율이 떨어지므로, 어떤 과정에 관심이 있는지는 입력받지 않고
 * `source_page`(유입 페이지)로 갈음한다. 예: /field/semi-permanent/ 유입 = 반영구 관심.
 *
 * 흐름: 신청 클릭 → 입력 검증 → PrivacyModal(수집·이용 / 제3자 제공 / 광고성 / 법정대리인)
 *      → POST(NEXT_PUBLIC_DB_SUBMIT_URL?api_key=...) → 완료 안내
 */
export default function FormSection({
  cta = "내 조건으로 수강료 견적 받기 (무료)",
  sourcePage = "home",
  defaultRegion,
  heading,
  subheading,
  id = "form",
  onDark = false,
}: Props) {
  const initial = {
    customer_name: "",
    customer_birth: "",
    mobile1: "010",
    mobile2: "",
    customer_sex: "2",
    region: defaultRegion ?? "",
    has_license: "N",
    guardian_name: "",
    guardian_phone: "",
  };

  const [form, setForm] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));
  const minor = isUnder14(form.customer_birth);

  const handleNameChange = (value: string) => {
    if (SPECIAL_CHAR_REG.test(value)) {
      alert("특수문자는 입력하실 수 없습니다.");
      set("customer_name", value.slice(0, -1));
      return;
    }
    set("customer_name", value);
  };

  const handleSubmitClick = () => {
    const error = validateForm({ ...form, privacy: true });
    if (error) { alert(error); return; }
    if (!form.region) { alert("희망 지역을 선택해 주세요."); return; }
    if (minor && !form.guardian_name) { alert("만 14세 미만은 보호자 성함을 입력해 주세요."); return; }
    if (minor && !/^\d{10,11}$/.test(form.guardian_phone)) { alert("만 14세 미만은 보호자 연락처(숫자만)를 입력해 주세요."); return; }
    setShowModal(true);
  };

  const handleConfirm = async (consent: ConsentResult) => {
    const phoneResult = parsePhone(form.mobile1, form.mobile2);
    if (typeof phoneResult === "string") { alert(phoneResult); return; }

    const payload = {
      customer_name: form.customer_name,
      customer_birth: form.customer_birth,
      mobile1: phoneResult.mobile1,
      mobile2: phoneResult.mobile2,
      mobile3: "",
      customer_sex: form.customer_sex,
      region: form.region,
      has_license: form.has_license,
      category: "메이크업학원",
      source_page: sourcePage,

      // ── 동의 이력 ──────────────────────────────────────────
      // 분쟁 시 "언제 · 어떤 문구에 · 무엇을 동의했는지" 입증하는 근거.
      // 플래그만 남기면 동의 문구가 바뀐 뒤에는 무엇에 동의했는지 특정할 수 없다.
      consent_privacy: true,                 // [필수] 수집·이용
      consent_third_party: true,             // [필수] 제3자 제공
      consent_marketing: consent.marketing,  // [선택] 광고성 정보 수신
      consent_at: new Date().toISOString(),
      consent_version: CONSENT_VERSION,

      ...(minor
        ? { guardian_name: form.guardian_name, guardian_phone: form.guardian_phone, consent_guardian: true }
        : {}),
    };

    setSending(true);
    try {
      const url = process.env.NEXT_PUBLIC_DB_SUBMIT_URL;
      const key = process.env.NEXT_PUBLIC_DB_API_KEY;
      if (!url || !key) {
        alert("전송 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        setSending(false);
        return;
      }
      const res = await fetch(`${url}?api_key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`전송 실패: ${(err as { error?: string }).error ?? res.status}`);
        setSending(false);
        return;
      }
      setForm({ ...initial });
      setDone(true);
    } catch {
      alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
    setSending(false);
  };

  // ── 스타일 ───────────────────────────────────────────────
  const groupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8, width: "100%" };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 800, color: "var(--primary)", letterSpacing: "0.04em", paddingLeft: 4, textAlign: "left" };
  const wrapStyle = (name: string): React.CSSProperties => ({
    background: "var(--bg-card)",
    border: `1.5px solid ${focused === name ? "var(--primary)" : "var(--border-color)"}`,
    borderRadius: 14,
    padding: "12px 18px",
    display: "flex",
    alignItems: "center",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: focused === name ? "0 4px 20px rgba(168,58,98,0.12)" : "none",
  });
  const inputStyle: React.CSSProperties = { flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", width: "100%" };
  const caret = (right: number) => (
    <span aria-hidden="true" style={{ position: "absolute", right, pointerEvents: "none", color: "var(--text-muted)", fontSize: 10 }}>▼</span>
  );
  const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 };

  if (done) {
    return (
      <div id={id} style={{ scrollMarginTop: 90 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 28, padding: "clamp(32px, 5vw, 52px)", textAlign: "center", boxShadow: "var(--shadow-md)" }}>
          <div style={{ width: 64, height: 64, background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--primary)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <p style={{ fontSize: 21, fontWeight: 900, marginBottom: 10 }}>상담 신청이 접수되었습니다</p>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 24 }}>
            입력해 주신 조건으로 수강료와 개강 일정을 정리해<br />
            영업일 기준 1일 이내에 연락드리겠습니다.
          </p>
          <button type="button" onClick={() => setDone(false)} className="btn btn--ghost" style={{ fontSize: 14 }}>
            다른 조건으로 다시 신청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <PrivacyModal onConfirm={handleConfirm} onClose={() => setShowModal(false)} isMinor={minor} />
      )}

      <div id={id} style={{ scrollMarginTop: 90 }}>
        {(heading || subheading) && (
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            {heading && (
              <p style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.02em", color: onDark ? "white" : "var(--text-primary)" }}>{heading}</p>
            )}
            {subheading && (
              <p style={{ fontSize: 14, color: onDark ? "rgba(255,255,255,0.7)" : "var(--text-secondary)", lineHeight: 1.7 }}>{subheading}</p>
            )}
          </div>
        )}

        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 28, padding: "clamp(22px, 4vw, 36px)", boxShadow: "var(--shadow-md)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }} role="group" aria-label="메이크업학원 상담 신청 폼">

            {/* 성함 · 성별 / 생년월일 */}
            <div style={rowStyle}>
              <div style={groupStyle}>
                <label htmlFor={`${id}-name`} style={labelStyle}>성함 · 성별</label>
                <div style={wrapStyle("name")}>
                  <input
                    id={`${id}-name`} type="text" value={form.customer_name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    maxLength={8} placeholder="성함 입력" autoComplete="name" style={inputStyle}
                  />
                  <span style={{ display: "flex", gap: 4, marginLeft: 12, paddingLeft: 12, borderLeft: "1px solid var(--border-color)", flexShrink: 0 }} role="group" aria-label="성별">
                    {[{ label: "남", val: "1" }, { label: "여", val: "2" }].map(({ label, val }) => (
                      <button
                        key={val} type="button" onClick={() => set("customer_sex", val)}
                        aria-pressed={form.customer_sex === val}
                        style={{
                          width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer",
                          fontWeight: 900, fontSize: 11, transition: "all 0.2s",
                          background: form.customer_sex === val ? "var(--primary)" : "var(--bg-main)",
                          color: form.customer_sex === val ? "white" : "var(--text-muted)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </span>
                </div>
              </div>

              <div style={groupStyle}>
                <label htmlFor={`${id}-birth`} style={labelStyle}>생년월일 (6자리)</label>
                <div style={wrapStyle("birth")}>
                  <input
                    id={`${id}-birth`} type="text" inputMode="numeric" value={form.customer_birth}
                    onChange={(e) => set("customer_birth", e.target.value.replace(/\D/g, ""))}
                    onFocus={() => setFocused("birth")} onBlur={() => setFocused(null)}
                    maxLength={6} placeholder="예) 990315" autoComplete="bday" style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* 연락처 / 희망 지역 */}
            <div style={rowStyle}>
              <div style={groupStyle}>
                <label htmlFor={`${id}-mobile2`} style={labelStyle}>연락처</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ ...wrapStyle("mobile1"), width: 92, flexShrink: 0, padding: "12px 12px 12px 16px", position: "relative" }}>
                    <select
                      aria-label="전화번호 앞자리" value={form.mobile1}
                      onChange={(e) => set("mobile1", e.target.value)}
                      onFocus={() => setFocused("mobile1")} onBlur={() => setFocused(null)}
                      style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    >
                      {["010", "011", "016", "017", "019"].map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    {caret(12)}
                  </div>
                  <div style={{ ...wrapStyle("mobile2"), flex: 1 }}>
                    <input
                      id={`${id}-mobile2`} type="tel" inputMode="numeric" value={form.mobile2}
                      onChange={(e) => set("mobile2", e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setFocused("mobile2")} onBlur={() => setFocused(null)}
                      maxLength={11} placeholder="'-' 없이 입력" autoComplete="tel-national" style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div style={groupStyle}>
                <label htmlFor={`${id}-region`} style={labelStyle}>희망 지역</label>
                <div style={{ ...wrapStyle("region"), position: "relative" }}>
                  <select
                    id={`${id}-region`} value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                    onFocus={() => setFocused("region")} onBlur={() => setFocused(null)}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: form.region ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    <option value="" disabled hidden>지역 선택</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {caret(18)}
                </div>
              </div>
            </div>

            {/* 자격증 보유 여부 — 토글 */}
            <div style={groupStyle}>
              <span style={labelStyle}>자격증 보유 여부</span>
              <div style={wrapStyle("license")}>
                <span style={{ flex: 1, color: "var(--text-secondary)", fontSize: 15 }}>
                  미용사(메이크업) 자격증 보유 여부
                </span>
                <button
                  type="button"
                  onClick={() => set("has_license", form.has_license === "Y" ? "N" : "Y")}
                  aria-pressed={form.has_license === "Y"}
                  aria-label="미용사(메이크업) 자격증 보유 여부"
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, width: 32, textAlign: "right", transition: "color 0.2s", color: form.has_license === "Y" ? "var(--primary)" : "var(--text-muted)" }}>
                    {form.has_license === "Y" ? "보유" : "없음"}
                  </span>
                  <span style={{ position: "relative", width: 44, height: 24, borderRadius: 12, transition: "background 0.3s", background: form.has_license === "Y" ? "var(--primary)" : "var(--border-color)", display: "block" }}>
                    <span style={{
                      position: "absolute", top: 3, left: 3, width: 18, height: 18, borderRadius: "50%", background: "white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "transform 0.3s ease", display: "block",
                      transform: form.has_license === "Y" ? "translateX(20px)" : "translateX(0)",
                    }} />
                  </span>
                </button>
              </div>
            </div>

            {/* 만 14세 미만 보호자 정보 */}
            {minor && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="callout callout--warn" style={{ fontSize: 13 }}>
                  <strong>만 14세 미만으로 확인됩니다.</strong> 개인정보보호법에 따라 보호자(법정대리인) 정보를 함께 입력해 주세요.
                </div>
                <div style={rowStyle}>
                  <div style={groupStyle}>
                    <label htmlFor={`${id}-gname`} style={labelStyle}>보호자 성함</label>
                    <div style={wrapStyle("gname")}>
                      <input id={`${id}-gname`} type="text" value={form.guardian_name} onChange={(e) => set("guardian_name", e.target.value)} onFocus={() => setFocused("gname")} onBlur={() => setFocused(null)} maxLength={8} placeholder="보호자 성함" style={inputStyle} />
                    </div>
                  </div>
                  <div style={groupStyle}>
                    <label htmlFor={`${id}-gphone`} style={labelStyle}>보호자 연락처</label>
                    <div style={wrapStyle("gphone")}>
                      <input id={`${id}-gphone`} type="tel" inputMode="numeric" value={form.guardian_phone} onChange={(e) => set("guardian_phone", e.target.value.replace(/\D/g, ""))} onFocus={() => setFocused("gphone")} onBlur={() => setFocused(null)} maxLength={11} placeholder="숫자만 입력" style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 제출 */}
            <div style={{ marginTop: 2 }}>
              <button
                type="button"
                onClick={handleSubmitClick}
                disabled={sending}
                style={{
                  width: "100%", padding: 19, background: "var(--primary)", color: "white",
                  border: "none", borderRadius: 16, fontSize: 16, fontWeight: 900,
                  cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1,
                  boxShadow: "0 8px 28px rgba(168,58,98,0.28)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", letterSpacing: "-0.01em",
                }}
              >
                {sending ? "전송 중..." : cta}
              </button>
              <p style={{ marginTop: 13, fontSize: 12, color: "var(--text-muted)", textAlign: "center", fontWeight: 500, lineHeight: 1.7 }}>
                100% 무료 · 상담 멘토가 1:1로 안내합니다 · 정보는 암호화되어 전송됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

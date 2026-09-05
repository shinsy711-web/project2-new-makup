"use client";

import { useState } from "react";
import { OPERATOR } from "@/lib/site";

/** 동의 결과 — 선택 항목은 값이 그대로 전송 페이로드에 실린다 */
export type ConsentResult = {
  marketing: boolean;
};

type Props = {
  onConfirm: (consent: ConsentResult) => void;
  onClose: () => void;
  isMinor?: boolean;
};

/**
 * 폼 제출 시 뜨는 개인정보 동의 모달.
 *   [필수] ① 수집·이용  ② 제3자 제공  ③ (만 14세 미만) 법정대리인 동의
 *   [선택] ④ 광고성 정보 수신 (정보통신망법 제50조 — 제휴 상담처의 전화·문자 발신 근거)
 * 흐름: 신청 버튼 → 입력검증 → 이 모달 → "동의하고 신청" → onConfirm(전송) → onClose
 */
export default function PrivacyModal({ onConfirm, onClose, isMinor = false }: Props) {
  const [priAgree, setPriAgree] = useState(false);
  const [thirdAgree, setThirdAgree] = useState(false);
  const [guardianAgree, setGuardianAgree] = useState(false);
  const [adAgree, setAdAgree] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const allRequired = priAgree && thirdAgree && (!isMinor || guardianAgree);
  const allChecked = allRequired && adAgree;
  const primary = "var(--primary)";

  const handleAllAgree = () => {
    const next = !allChecked;
    setPriAgree(next);
    setThirdAgree(next);
    setAdAgree(next);
    if (isMinor) setGuardianAgree(next);
  };

  const handleConfirm = () => {
    if (!priAgree) { alert("개인정보 수집 및 이용에 동의해 주세요."); return; }
    if (!thirdAgree) { alert("개인정보 제3자 제공에 동의해 주세요."); return; }
    if (isMinor && !guardianAgree) { alert("만 14세 미만은 보호자(법정대리인) 동의가 필요합니다."); return; }
    onConfirm({ marketing: adAgree });
    onClose();
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="개인정보 동의"
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      >
        <div style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 580, maxHeight: "85dvh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", position: "relative" }}>

          {/* 헤더 */}
          <div style={{ padding: "32px 32px 20px", position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowAlert(true)}
              aria-label="닫기"
              style={{ position: "absolute", top: 24, right: 24, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f4f5", border: "none", borderRadius: "50%", cursor: "pointer", color: "#71717a", fontSize: 18 }}
            >
              ✕
            </button>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8, lineHeight: 1.3 }}>
              안전한 상담을 위한<br />
              <span style={{ color: primary }}>개인정보 동의</span>
            </h2>
            <p style={{ fontSize: 13, color: "#71717a", lineHeight: 1.7, margin: 0 }}>
              입력하신 정보는 메이크업학원 상담 목적 외에는 사용되지 않으며, 암호화되어 전송됩니다.
            </p>
          </div>

          {/* 스크롤 영역 */}
          <div style={{ overflowY: "auto", padding: "0 32px 120px", flex: 1 }}>

            {/* 전체 동의 */}
            <button
              type="button"
              onClick={handleAllAgree}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "16px 20px", borderRadius: 16, marginBottom: 20,
                border: allChecked ? `2px solid ${primary}` : "2px solid #e4e4e7",
                background: allChecked ? "var(--primary-light)" : "#fafafa",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: allChecked ? primary : "#d4d4d8", flexShrink: 0 }}>
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 700, color: allChecked ? primary : "#3f3f46" }}>약관 전체 동의하기 <span style={{ fontSize: 12, fontWeight: 600, color: "#a1a1aa" }}>(선택 항목 포함)</span></span>
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ContentBox checked={priAgree} onChange={setPriAgree} label="개인정보 수집 및 이용 동의" primary={primary}>
                수집 주체 : {OPERATOR.company}<br />
                수집 목적 : 메이크업학원 수강료 안내, 과정 추천 및 1:1 상담 제공<br />
                수집 항목 : 성명, 휴대폰 번호, 생년월일, 성별, 희망 지역, 미용사(메이크업) 자격증 보유 여부 (만 14세 미만: 보호자 성명·연락처)<br />
                보유 기간 : 수집일로부터 1년 (또는 요청 시 즉시 파기)<br />
                동의 거부 권리 : 동의를 거부하실 권리가 있으나, 거부 시 상담 신청이 제한될 수 있습니다.
              </ContentBox>

              <ContentBox checked={thirdAgree} onChange={setThirdAgree} label="개인정보 제3자 제공 동의" primary={primary}>
                제공받는 자 : {OPERATOR.recipients}<br />
                {/* 제공 시점에 상호를 특정한다는 고지가 이 항목의 핵심이므로 스크롤 없이 보이는 위치에 둔다 */}
                <b style={{ color: '#3f3f46' }}>※ {OPERATOR.recipientsSpecify}</b><br />
                제공 목적 : 수강료 견적 안내, 과정 상담 및 개강 일정 안내<br />
                제공 항목 : 성명, 휴대폰 번호, 생년월일, 성별, 희망 지역, 미용사(메이크업) 자격증 보유 여부<br />
                보유 기간 : 제공받는 자의 상담 목적 달성 시 즉시 파기<br />
                동의 거부 권리 : 거부하실 수 있으며, 거부 시 상담 연결이 제한될 수 있습니다.<br />
                <br />
                ※ {OPERATOR.recipientsScope}<br />
                ※ {OPERATOR.recipientsListNote}
              </ContentBox>

              <ContentBox checked={adAgree} onChange={setAdAgree} label="광고성 정보 수신 동의" primary={primary} optional>
                전송자 : {OPERATOR.adSender}<br />
                전송 방법 : {OPERATOR.adChannels}<br />
                전송 내용 : {OPERATOR.adContents}<br />
                <br />
                ※ <b style={{ color: '#3f3f46' }}>선택 항목입니다.</b> 동의하지 않으셔도 상담 신청은 정상적으로 접수됩니다.<br />
                ※ 수신 동의는 언제든지 철회하실 수 있으며, 철회 시 광고성 정보 발송이 즉시 중단됩니다.
              </ContentBox>

              {isMinor && (
                <ContentBox checked={guardianAgree} onChange={setGuardianAgree} label="만 14세 미만 법정대리인(보호자) 동의" primary={primary}>
                  개인정보보호법 제22조의2에 따라 만 14세 미만 아동의 개인정보를 수집할 때에는 법정대리인(부모님 또는 법적 보호자)의 동의가 필요합니다.<br /><br />
                  본 항목에 체크하심으로써 법정대리인이 본 서비스 이용 및 개인정보 수집·제공에 동의하였음을 확인합니다.<br /><br />
                  법정대리인은 언제든지 동의를 철회하고 개인정보 삭제를 요청할 수 있습니다.
                </ContentBox>
              )}
            </div>

            <div style={{ marginTop: 20, background: "#fafafa", borderRadius: 12, padding: 16, fontSize: 12, color: "#a1a1aa", lineHeight: 1.8 }}>
              <p>• 입력하신 정보는 상담 응대를 위한 필수 항목이며, 동의를 거부하실 경우 상담이 제한될 수 있습니다.</p>
              <p>• 수집된 정보는 상담 목적 외 다른 용도로 사용되지 않습니다.</p>
              <p>• 정보주체는 언제든지 동의를 철회할 수 있으며, 이 경우 수집된 개인정보는 지체 없이 파기됩니다.</p>
              <p>• 개인정보 보호책임자 : {OPERATOR.privacyOfficer} ({OPERATOR.email})</p>
              {isMinor && <p>• 만 14세 미만인 경우 법정대리인이 동의를 대신하거나 확인해 주셔야 합니다.</p>}
            </div>
          </div>

          {/* 하단 고정 버튼 */}
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", padding: "0 32px 32px", background: "linear-gradient(to top, white 70%, transparent)", paddingTop: 48, boxSizing: "border-box" }}>
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                width: "100%", padding: 18, fontSize: 16, fontWeight: 800,
                borderRadius: 16, border: "none", cursor: allRequired ? "pointer" : "not-allowed",
                background: allRequired ? primary : "#d4d4d8",
                color: allRequired ? "white" : "#a1a1aa",
                transition: "all 0.2s",
              }}
            >
              동의하고 상담 신청하기
            </button>
          </div>
        </div>
      </div>

      {/* 이탈 경고 */}
      {showAlert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 340, padding: 36, textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 64, height: 64, background: "var(--primary-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: primary }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p style={{ fontSize: 20, fontWeight: 900, color: "#111", marginBottom: 8 }}>정말 나가시겠어요?</p>
            <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.7, marginBottom: 28 }}>지금 나가시면 작성하신 내용이<br />모두 사라집니다.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => { setShowAlert(false); onClose(); }} style={{ flex: 1, padding: 14, background: "#f4f4f5", color: "#3f3f46", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>나가기</button>
              <button type="button" onClick={() => setShowAlert(false)} style={{ flex: 1, padding: 14, background: primary, color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>계속 쓰기</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ContentBox({ checked, onChange, label, primary, optional = false, children }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  primary: string;
  /** 선택 동의 항목이면 true — 뱃지가 '선택'으로 바뀌고 미체크여도 제출 가능 */
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: "white", border: checked ? `1.5px solid ${primary}` : "1.5px solid #e4e4e7", borderRadius: 16, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        style={{ display: "flex", alignItems: "center", padding: "14px 16px", cursor: "pointer", background: "#fafafa", width: "100%", border: "none", textAlign: "left" }}
      >
        <span style={{ width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, background: checked ? primary : "white", border: checked ? "none" : "2px solid #d4d4d8", flexShrink: 0 }}>
          {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#111", flex: 1 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 50, color: optional ? "#71717a" : primary, background: optional ? "#f4f4f5" : "var(--primary-light)" }}>
          {optional ? "선택" : "필수"}
        </span>
      </button>
      <div style={{ padding: "12px 16px", borderTop: "1px solid #f4f4f5" }}>
        {/* 제3자 제공처가 복수라는 고지가 스크롤 없이도 보이도록 높이를 확보한다 */}
        <div style={{ height: 108, overflowY: "auto", fontSize: 12, color: "#71717a", lineHeight: 1.8 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

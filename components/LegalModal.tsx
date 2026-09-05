"use client";

import { useState } from "react";

type Props = {
  trigger: string;
  title: string;
  maxWidth?: number;
  children: React.ReactNode;
};

/** 푸터 법률 모달 공용 셸 */
export default function LegalModal({ trigger, title, maxWidth = 680, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ color: "inherit", textDecoration: "none", fontWeight: "inherit", background: "none", border: "none", cursor: "pointer", fontSize: "inherit", padding: 0 }}
      >
        {trigger}
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={title} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "1rem", width: "100%", maxWidth, maxHeight: "85dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: "1px solid #e5e7eb" }}>
              <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#111" }}>{title}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="닫기" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", color: "#6b7280", lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ overflowY: "auto", padding: "1.5rem" }}>{children}</div>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e5e7eb" }}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{ width: "100%", padding: "0.75rem", backgroundColor: "var(--accent)", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

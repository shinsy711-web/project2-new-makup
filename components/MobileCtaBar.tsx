"use client";

import Link from 'next/link';

/** 모바일 하단 고정 CTA — 현재 페이지 상단 폼(#form)으로 되돌린다 */
export default function MobileCtaBar() {
  return (
    <div className="mobile-cta-bar" role="complementary" aria-label="빠른 상담">
      <Link href="/cost/" className="btn btn--ghost" style={{ flex: 1, padding: '13px 10px', fontSize: 14, borderRadius: 12 }}>수강료 표 보기</Link>
      <a href="#form" className="btn btn--primary" style={{ flex: 1.4, padding: '13px 10px', fontSize: 14, borderRadius: 12 }}>무료 견적 받기 →</a>
    </div>
  );
}

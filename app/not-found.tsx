import type { Metadata } from 'next';
import Link from 'next/link';
import { childrenOf } from '@/lib/site';

/**
 * 404 는 실체가 있는 URL 이 아니므로 캐노니컬을 지운다(null).
 * 지우지 않으면 레이아웃의 '/' 를 상속받아 "이 페이지는 홈페이지"라고 선언하게 된다.
 */
export const metadata: Metadata = {
  title: { absolute: '페이지를 찾을 수 없습니다 (404)' },
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  const top = childrenOf('/');
  return (
    <main className="container-narrow" style={{ paddingTop: 80, paddingBottom: 120, textAlign: 'center' }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 950, letterSpacing: '-0.02em', marginBottom: 14 }}>
        찾으시는 페이지가 없습니다
      </h1>
      <p className="lead" style={{ marginBottom: 32 }}>
        주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 원하시는 정보를 찾아보세요.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
        {top.map((p) => (
          <Link key={p.path} href={p.path} className="chip" style={{ fontSize: 13, padding: '9px 16px' }}>{p.nav} →</Link>
        ))}
      </div>
      <Link href="/" className="btn btn--dark">홈으로 돌아가기</Link>
    </main>
  );
}

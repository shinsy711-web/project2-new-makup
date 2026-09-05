import type { Metadata } from 'next';
import TermsContent from '@/components/legal/TermsContent';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: '이용약관' },
  description: '서비스의 성격, 정보의 정확성, 이용자의 의무, 책임의 제한 등 이용약관 전문입니다.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/terms-of-service/' },
  openGraph: { url: '/terms-of-service/', title: '이용약관', type: 'article' },
};

export default function TermsPage() {
  return (
    <main className="container-narrow" style={{ paddingTop: 48, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 'clamp(23px, 3.5vw, 32px)', fontWeight: 950, letterSpacing: '-0.02em', marginBottom: 10 }}>
        이용약관
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36 }}>{SITE_NAME}</p>
      <div className="card" style={{ padding: 'clamp(22px, 4vw, 36px)' }}>
        <TermsContent />
      </div>
    </main>
  );
}

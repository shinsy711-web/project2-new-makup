import type { Metadata } from 'next';
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent';
import { OPERATOR } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: '개인정보처리방침' },
  description: '개인정보의 처리 목적, 보유 기간, 제3자 제공, 파기 절차 등 개인정보처리방침 전문입니다.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/privacy-policy/' },
  // og:url 이 레이아웃의 홈 URL 을 상속하지 않도록 자기 경로로 덮어쓴다
  openGraph: { url: '/privacy-policy/', title: '개인정보처리방침', type: 'article' },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container-narrow" style={{ paddingTop: 48, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 'clamp(23px, 3.5vw, 32px)', fontWeight: 950, letterSpacing: '-0.02em', marginBottom: 10 }}>
        개인정보처리방침
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 36 }}>{OPERATOR.company}</p>
      <div className="card" style={{ padding: 'clamp(22px, 4vw, 36px)' }}>
        <PrivacyPolicyContent />
      </div>
    </main>
  );
}

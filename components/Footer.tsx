import Link from 'next/link';
import { PAGES, OPERATOR, SITE_NAME, type Section } from '@/lib/site';
import Logo from './Logo';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsModal from './TermsModal';
import LegalNoticeModal from './LegalNoticeModal';

const COLUMNS: { title: string; sections: Section[] }[] = [
  { title: '수강료 · 학원 과정', sections: ['수강료', '학원과정'] },
  { title: '자격증', sections: ['자격증'] },
  { title: '분야 · 국비지원', sections: ['분야', '국비지원'] },
  { title: '지역', sections: ['지역'] },
  { title: '진로 · 학과', sections: ['진로', '학과'] },
];

/** 푸터: 전체 페이지 링크(크롤 분배) + 법률 모달 3종 + 운영주체 고지 */
export default function Footer() {
  return (
    <footer style={{ background: 'var(--accent)', color: 'white', padding: '64px 1.5rem 40px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 30, marginBottom: 44 }}>
          <div>
            <div style={{ marginBottom: 12 }}><Logo size={36} onDark /></div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 14 }}>
              메이크업을 배우려는 분들이 수강료·커리큘럼·자격증·국비지원을 한자리에서 비교하고 결정할 수 있도록 정보를 정리합니다.
            </p>
            <address style={{ fontStyle: 'normal', fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
              운영: {OPERATOR.company}<br />
              상담 연결: 제휴 상담처(메이크업·뷰티 교육기관)<br />
              문의: <a href={`mailto:${OPERATOR.email}`} style={{ textDecoration: 'underline' }}>{OPERATOR.email}</a><br />
              상담 시간: {OPERATOR.hours}
            </address>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`푸터 ${col.title}`}>
              <p style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.06em', marginBottom: 12 }}>{col.title}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {PAGES.filter((p) => col.sections.includes(p.section) && p.path !== '/').map((p) => (
                  <li key={p.path}>
                    <Link href={p.path} title={p.title} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                      {p.parent && p.parent !== '/' ? `· ${p.nav}` : p.nav}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}><PrivacyPolicyModal /></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}><TermsModal /></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}><LegalNoticeModal /></span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', lineHeight: 1.8, maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
            본 사이트는 정보 제공 및 상담 연결을 목적으로 운영되며, 게재된 수강료·기간·시험 일정은 학원 운영 방침과 공고에 따라 실제와 다를 수 있습니다.<br />
            정확한 금액은 상담으로, 자격시험 정보는 한국산업인력공단(q-net.or.kr), 국비지원 요건은 HRD-Net(hrd.go.kr)에서 반드시 확인하시기 바랍니다.<br />
            © 2026 {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

type Props = {
  title: string;
  desc: string;
  /** 기본은 현재 페이지 상단 폼으로 되돌린다 */
  href?: string;
  label?: string;
};

/** 본문 하단 CTA — 스크롤을 끝까지 내린 사람을 상단 폼으로 되돌리는 장치 */
export default function CtaBanner({ title, desc, href = '#form', label = '무료로 수강료 견적 받기 →' }: Props) {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--gold-light) 100%)',
        borderRadius: 28,
        padding: 'clamp(30px, 4vw, 46px) clamp(20px, 4vw, 40px)',
        textAlign: 'center',
        marginBottom: 40,
      }}
    >
      <p style={{ fontSize: 'clamp(19px, 3vw, 24px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{title}</p>
      <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 26px' }}>{desc}</p>
      <a href={href} className="btn btn--dark">{label}</a>
    </section>
  );
}

import { getPage, UPDATED } from '@/lib/site';
import FormSection from './FormSection';

type Props = {
  path: string;
  /** 히어로 상단 작은 라벨 (기본: 섹션명 + 갱신월) */
  eyebrow?: string;
  /** H1 아래 요약 — 없으면 레지스트리 description 을 쓴다 */
  lead?: string;
  chips?: string[];
  /** 폼 기본 선택값 */
  region?: string;
};

/**
 * 서브페이지 히어로.
 * ★ 구조 고정: H1 → 요약 → 칩 → **DB 폼**. 폼이 항상 첫 화면 안에 들어오도록 한다.
 */
export default function PageHero({ path, eyebrow, lead, chips, region }: Props) {
  const p = getPage(path);
  const month = UPDATED.slice(0, 7).replace('-', '년 ') + '월';

  return (
    <header
      style={{
        background: 'var(--accent)',
        borderRadius: 32,
        padding: 'clamp(30px, 5vw, 52px) clamp(20px, 4vw, 44px)',
        marginBottom: 48,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ color: 'var(--primary)', fontWeight: 900, fontSize: 12, letterSpacing: '0.08em', marginBottom: 16 }}>
          {eyebrow ?? `${p.section} · ${month} 기준`}
        </p>

        <h1 style={{ fontSize: 'clamp(25px, 4.5vw, 40px)', fontWeight: 950, lineHeight: 1.18, letterSpacing: '-0.03em', marginBottom: 16 }}>
          {p.h1}
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15.5, lineHeight: 1.8, maxWidth: 660, marginBottom: chips?.length ? 24 : 32 }}>
          {lead ?? p.description}
        </p>

        {chips && chips.length > 0 && (
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 32 }}>
            {chips.map((t) => (
              <span key={t} className="chip chip--dark" style={{ fontSize: 13, padding: '9px 15px', borderRadius: 12 }}>{t}</span>
            ))}
          </div>
        )}

        {/* ★ DB 수집 폼 — 페이지 최상단 고정 배치 */}
        <FormSection
          cta={p.cta}
          sourcePage={p.path}
          defaultRegion={region}
          id="form"
        />
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', right: -70, top: -70, width: 260, height: 260, background: 'var(--primary)', opacity: 0.1, borderRadius: '50%' }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: -50, bottom: -90, width: 200, height: 200, background: 'var(--gold)', opacity: 0.07, borderRadius: '50%' }} />
    </header>
  );
}

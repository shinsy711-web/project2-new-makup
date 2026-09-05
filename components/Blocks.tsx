import Link from 'next/link';
import DataTable from './DataTable';
import FormSection from './FormSection';
import { findPage } from '@/lib/site';

// ── 콘텐츠 블록 스키마 ─────────────────────────────────────
// data/content/*.ts 가 이 타입으로 본문을 기술하고, 여기서 렌더링한다.
// 새 페이지를 추가할 때 JSX 를 새로 짜지 않아도 되도록 만든 구조.

export type Block =
  | { t: 'h2'; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string; align?: ('left' | 'center')[] }
  | { t: 'callout'; kind?: 'tip' | 'warn' | 'info'; title?: string; text: string }
  | { t: 'steps'; items: { title: string; desc: string; period?: string }[] }
  | { t: 'stats'; items: { label: string; value: string; sub?: string }[] }
  | { t: 'cards'; items: { title: string; desc: string; chip?: string }[] }
  | { t: 'form'; cta?: string; heading?: string; sub?: string }
  | { t: 'links'; paths: string[]; title?: string };

/**
 * 본문 텍스트의 인라인 문법을 렌더링한다.
 *   [라벨](/경로/)  → 내부 링크
 *   **강조**        → <strong>
 * 레지스트리에 없는 경로는 링크로 만들지 않고 라벨만 남겨 오타로 인한 죽은 링크를 막는다.
 */
function renderText(text: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));

    if (m[3] !== undefined) {
      parts.push(<strong key={`${keyPrefix}-b${i++}`}>{m[3]}</strong>);
    } else {
      const label = m[1];
      const href = m[2];
      if (href.startsWith('/') && !findPage(href)) {
        parts.push(label);
      } else {
        parts.push(<Link key={`${keyPrefix}-l${i++}`} href={href}>{label}</Link>);
      }
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** h2 를 제외한 개별 블록 1개를 렌더링 */
function renderBlock(b: Block, k: string, headingId: string | undefined, sourcePage: string, formSeq: number) {
  switch (b.t) {
    case 'h2':
      return <h2 key={k} id={headingId}>{b.text}</h2>;

    case 'h3':
      return <h3 key={k}>{b.text}</h3>;

    case 'p':
      return <p key={k}>{renderText(b.text, k)}</p>;

    case 'ul':
      return (
        <ul key={k}>
          {b.items.map((it, j) => <li key={j}>{renderText(it, `${k}-${j}`)}</li>)}
        </ul>
      );

    case 'ol':
      return (
        <ol key={k}>
          {b.items.map((it, j) => <li key={j}>{renderText(it, `${k}-${j}`)}</li>)}
        </ol>
      );

    case 'table':
      return (
        <div key={k} style={{ margin: '24px 0' }}>
          <DataTable
            head={b.head}
            rows={b.rows.map((r, ri) => r.map((c, ci) => renderText(c, `${k}-${ri}-${ci}`)))}
            caption={b.caption ? renderText(b.caption, `${k}-cap`) : undefined}
            align={b.align}
          />
        </div>
      );

    case 'callout': {
      const cls = b.kind === 'warn' ? 'callout callout--warn' : b.kind === 'info' ? 'callout callout--info' : 'callout';
      return (
        <aside key={k} className={cls} style={{ margin: '24px 0' }}>
          {b.title && <strong style={{ display: 'block', marginBottom: 6 }}>{b.title}</strong>}
          {renderText(b.text, k)}
        </aside>
      );
    }

    case 'steps':
      return (
        <ol key={k} className="steps" style={{ display: 'flex', flexDirection: 'column', margin: '26px 0', padding: 0, listStyle: 'none' }}>
          {b.items.map((s, j) => {
            const last = j === b.items.length - 1;
            return (
              <li key={j} style={{ display: 'flex', gap: 18, paddingBottom: last ? 0 : 24, marginBottom: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                    {String(j + 1).padStart(2, '0')}
                  </span>
                  {!last && <span style={{ width: 2, flex: 1, background: 'var(--border-color)', marginTop: 8 }} />}
                </div>
                <div style={{ paddingTop: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{s.title}</h3>
                    {s.period && <span className="chip chip--outline" style={{ fontSize: 11 }}>{s.period}</span>}
                  </div>
                  <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{renderText(s.desc, `${k}-${j}`)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      );

    case 'stats':
      return (
        <dl key={k} className="grid-auto grid-auto--sm" style={{ margin: '26px 0' }}>
          {b.items.map((s, j) => (
            <div key={j} className="card" style={{ padding: 22 }}>
              <dt style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{s.label}</dt>
              <dd style={{ margin: 0 }}>
                <span style={{ display: 'block', fontSize: 22, fontWeight: 950, letterSpacing: '-0.02em', marginBottom: 4, lineHeight: 1.2, color: 'var(--text-primary)' }}>{s.value}</span>
                {s.sub && <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>{s.sub}</span>}
              </dd>
            </div>
          ))}
        </dl>
      );

    case 'cards':
      return (
        <div key={k} className="grid-auto" style={{ margin: '26px 0' }}>
          {b.items.map((c, j) => (
            <article key={j} className="card" style={{ padding: 24 }}>
              {c.chip && <span className="chip" style={{ marginBottom: 12 }}>{c.chip}</span>}
              <h3 style={{ fontSize: 17, fontWeight: 850, marginTop: 0, marginBottom: 8, color: 'var(--text-primary)', lineHeight: 1.4 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{renderText(c.desc, `${k}-${j}`)}</p>
            </article>
          ))}
        </div>
      );

    case 'form':
      return (
        <div key={k} style={{ margin: '40px 0' }}>
          <FormSection
            id={`form-${formSeq}`}
            cta={b.cta}
            heading={b.heading}
            subheading={b.sub}
            sourcePage={`${sourcePage}-inline`}
          />
        </div>
      );

    case 'links': {
      const pages = b.paths.map(findPage).filter((p): p is NonNullable<typeof p> => Boolean(p));
      if (pages.length === 0) return null;
      return (
        <nav key={k} className="card card--soft" style={{ margin: '28px 0', padding: '22px 26px' }} aria-label={b.title ?? '이어서 보기'}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>{b.title ?? '이어서 보기'}</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 9, listStyle: 'none', padding: 0, margin: 0 }}>
            {pages.map((p) => (
              <li key={p.path} style={{ margin: 0 }}>
                <Link href={p.path} title={p.title} className="chip chip--outline" style={{ fontSize: 13, padding: '8px 14px' }}>
                  {p.nav} →
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      );
    }

    default:
      return null;
  }
}

type Group = {
  /** h2 블록 (첫 섹션 앞 도입부는 없음) */
  heading?: Extract<Block, { t: 'h2' }>;
  /** h2 직후에 붙는 리드 문단 — 헤드 컨테이너로 함께 묶는다 */
  lead: Block[];
  /** 그 이후 본문 */
  body: Block[];
  /** 원본 인덱스 (key·id 안정성 유지) */
  startIndex: number;
};

/**
 * 평면 블록 배열을 h2 기준으로 잘라 섹션 단위로 묶는다.
 * 결과 마크업: <section> → <div class="section-head">(h2 + 리드 p) → 나머지 콘텐츠
 */
function groupIntoSections(blocks: Block[]): Group[] {
  const groups: Group[] = [];
  let cur: Group = { lead: [], body: [], startIndex: 0 };

  blocks.forEach((b, i) => {
    if (b.t === 'h2') {
      if (cur.heading || cur.lead.length || cur.body.length) groups.push(cur);
      cur = { heading: b, lead: [], body: [], startIndex: i };
      return;
    }
    // h2 바로 뒤에 오는 연속 문단만 헤드로 올린다
    if (cur.heading && cur.body.length === 0 && b.t === 'p') cur.lead.push(b);
    else cur.body.push(b);
  });
  if (cur.heading || cur.lead.length || cur.body.length) groups.push(cur);

  return groups;
}

export default function Blocks({ blocks, sourcePage }: { blocks: Block[]; sourcePage: string }) {
  const groups = groupIntoSections(blocks);
  let formSeq = 0;

  return (
    <>
      {groups.map((g, gi) => {
        const headingId = g.heading ? `s${g.startIndex}` : undefined;

        const renderList = (list: Block[], offset: number) =>
          list.map((b, j) => {
            if (b.t === 'form') formSeq += 1;
            return renderBlock(b, `g${gi}-${offset}-${j}`, undefined, sourcePage, formSeq);
          });

        // 첫 h2 이전 도입부 — 섹션으로 감쌀 제목이 없으므로 그대로 둔다
        if (!g.heading) {
          return <div key={`g${gi}`} className="section-intro">{renderList(g.body, 0)}</div>;
        }

        return (
          <section key={`g${gi}`} className="content-section" aria-labelledby={headingId}>
            <div className="section-head">
              <h2 id={headingId}>{g.heading.text}</h2>
              {g.lead.map((b, j) => renderBlock(b, `g${gi}-lead-${j}`, undefined, sourcePage, formSeq))}
            </div>
            {renderList(g.body, 1)}
          </section>
        );
      })}
    </>
  );
}

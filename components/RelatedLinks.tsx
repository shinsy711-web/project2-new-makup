import Link from 'next/link';
import { findPage } from '@/lib/site';

type Props = {
  paths: string[];
  title?: string;
};

/** 내부링크 허브 칩 — 모든 페이지 하단에 배치해 링크를 순환시킨다 */
export default function RelatedLinks({ paths, title = '함께 보면 좋은 정보' }: Props) {
  const pages = paths.map(findPage).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (pages.length === 0) return null;

  return (
    <section className="card" style={{ marginBottom: 40, padding: '26px 30px' }}>
      <p className="eyebrow" style={{ marginBottom: 14 }}>{title}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {pages.map((p) => (
          <Link key={p.path} href={p.path} title={p.title} className="chip" style={{ fontSize: 13, padding: '9px 16px' }}>
            {p.nav} →
          </Link>
        ))}
      </div>
    </section>
  );
}

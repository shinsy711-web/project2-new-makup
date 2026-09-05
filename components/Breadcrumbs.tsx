import Link from 'next/link';
import { breadcrumbChain, absUrl } from '@/lib/site';
import JsonLd from './JsonLd';

/** 가시 브레드크럼 + BreadcrumbList JSON-LD (레지스트리 기반) */
export default function Breadcrumbs({ path }: { path: string }) {
  const chain = breadcrumbChain(path);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: chain.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: i === 0 ? '홈' : p.nav,
      item: absUrl(p.path),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="브레드크럼" style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 26 }}>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 6, listStyle: 'none', padding: 0, margin: 0 }}>
          {chain.map((p, i) => {
            const last = i === chain.length - 1;
            return (
              <li key={p.path} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {last ? (
                  <span aria-current="page" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{p.nav}</span>
                ) : (
                  <Link href={p.path} style={{ fontWeight: 600 }}>{i === 0 ? '홈' : p.nav}</Link>
                )}
                {!last && <span aria-hidden="true">›</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

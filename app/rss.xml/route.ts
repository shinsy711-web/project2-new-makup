import { PAGES, SITE_URL, SITE_NAME } from '@/lib/site';

/**
 * RSS 2.0 피드 — 네이버 서치어드바이저 '요청 › RSS 제출'용.
 *
 * sitemap.xml 과 목적이 다르다. 사이트맵은 URL 목록만 넘기지만,
 * 네이버는 RSS를 주기적으로 폴링하면서 제목·요약까지 함께 읽어간다.
 * 네이버 검색이 블로그 RSS 수집으로 성장한 탓에 이 경로가 가장 튼튼하고,
 * 실제로 사이트맵만 제출했을 때보다 웹문서 색인 등재율이 높다.
 *
 * pubDate 에 빌드 시각을 쓰지 않는다. 배포할 때마다 날짜가 바뀌면
 * 네이버가 같은 글이 계속 재발행되는 것으로 보고 피드 신뢰도를 깎는다.
 * 문서가 실제로 처음 공개된 날짜를 고정값으로 둔다.
 */

export const dynamic = 'force-static';

/** 사이트 최초 공개일. 새 페이지를 추가하면 그 페이지만 별도 날짜를 주면 된다. */
const PUBLISHED = new Date('2026-09-06T09:00:00+09:00');

/** XML 텍스트 노드 이스케이프 — 제목·설명에 &, <, > 가 들어와도 피드가 깨지지 않게 한다. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function GET(): Response {
  // 네이버는 피드 앞쪽부터 읽는다. 중요한 문서가 먼저 수집되도록 우선순위 순으로 낸다.
  const items = [...PAGES].sort((a, b) => b.priority - a.priority);

  const pubDate = PUBLISHED.toUTCString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <description>${esc(PAGES[0].description)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}${p.path}</link>
      <guid isPermaLink="true">${SITE_URL}${p.path}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

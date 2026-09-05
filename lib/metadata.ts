import type { Metadata } from 'next';
import { getPage, SITE_NAME, OG_IMAGE } from './site';

/**
 * 레지스트리 기반 페이지 메타데이터.
 * title 은 레이아웃 템플릿(`%s | 메이크업학원 비교`)을 타지 않도록 absolute 로 넣는다.
 * — 레지스트리 title 이 이미 브랜드 꼬리표까지 포함해 60자 안에 설계돼 있기 때문.
 */
export function pageMetadata(path: string, overrides: Metadata = {}): Metadata {
  const p = getPage(path);
  return {
    title: { absolute: p.title },
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: p.title,
      description: p.description,
      url: path,
      siteName: SITE_NAME,
      locale: 'ko_KR',
      type: path === '/' ? 'website' : 'article',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: p.h1, type: 'image/jpeg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
      images: [OG_IMAGE],
    },
    ...overrides,
  };
}

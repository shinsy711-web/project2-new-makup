import type { MetadataRoute } from 'next';
import { PAGES, SITE_URL } from '@/lib/site';

/** 레지스트리 전체 등록 (정책 페이지는 noindex라 제외) */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.path === '/' || p.grade === 'S' ? 'weekly' : 'monthly',
    priority: p.priority,
  }));
}

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/privacy-policy/', '/terms-of-service/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

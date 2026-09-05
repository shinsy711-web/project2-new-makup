import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * AI 검색·답변 엔진 크롤러.
 * 이들을 막으면 ChatGPT·Claude·Perplexity 답변에 인용되지 않는다.
 * 정보 비교 사이트는 답변에 인용되는 것 자체가 유입·브랜드로 이어지므로 전부 허용한다.
 *
 * robots.txt 규칙: 봇은 자기 이름이 적힌 그룹 하나만 따르고 '*' 그룹은 무시한다.
 * 그래서 이 목록은 별도 그룹으로 두되 '*' 와 동일하게 전체 허용으로 맞춘다.
 */
const AI_CRAWLERS = [
  'GPTBot',              // OpenAI 학습·검색
  'OAI-SearchBot',       // ChatGPT 검색
  'ChatGPT-User',        // ChatGPT 브라우징
  'ClaudeBot',           // Anthropic
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',       // Perplexity
  'Google-Extended',     // Gemini 학습 (차단해도 구글 검색 색인에는 영향 없음)
  'Applebot-Extended',   // Apple Intelligence
  'meta-externalagent',  // Meta AI
  'Bytespider',          // ByteDance
  'Amazonbot',
  'CCBot',               // Common Crawl
];

/**
 * Disallow 는 두지 않는다.
 *
 * /privacy-policy/ · /terms-of-service/ 는 메타 태그로 noindex 를 걸어 뒀다.
 * 여기서 크롤까지 막으면 크롤러가 페이지에 들어오지 못해 그 noindex 를 읽지 못하고,
 * 외부 링크를 타고 URL 만 색인되는 역효과가 난다. 색인에서 빼려면 크롤은 허용해야 한다.
 *
 * /_next/ 같은 정적 자산도 막지 않는다. CSS·JS 를 못 읽으면 구글이 페이지를
 * 제대로 렌더링하지 못해 모바일 사용성 평가에서 불리해진다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

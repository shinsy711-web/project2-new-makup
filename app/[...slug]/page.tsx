import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/metadata';
import { PAGES, pathToSlug, slugToPath, findPage, UPDATED } from '@/lib/site';
import { getContent } from '@/data/content';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageHero from '@/components/PageHero';
import Blocks from '@/components/Blocks';
import FaqSection from '@/components/FaqSection';
import RelatedLinks from '@/components/RelatedLinks';
import CtaBanner from '@/components/CtaBanner';
import ArticleJsonLd from '@/components/ArticleJsonLd';

type Params = { slug: string[] };

/**
 * 레지스트리에 등록된 모든 서브페이지를 빌드 타임에 정적 생성한다.
 * (홈 '/' 은 app/page.tsx 가 따로 담당)
 */
export function generateStaticParams(): Params[] {
  return PAGES.filter((p) => p.path !== '/').map((p) => ({ slug: pathToSlug(p.path) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = slugToPath(slug);
  if (!findPage(path)) return {};
  return pageMetadata(path);
}

export default async function RegistryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = slugToPath(slug);

  const page = findPage(path);
  const content = getContent(path);
  if (!page || !content) notFound();

  return (
    <main className="container-narrow" style={{ paddingTop: 32, paddingBottom: 100 }}>
      <ArticleJsonLd path={path} />
      <Breadcrumbs path={path} />

      {/* ★ H1 + DB 폼 — 페이지 최상단 */}
      <PageHero
        path={path}
        lead={content.lead}
        chips={content.chips}
        region={content.region}
      />

      <article className="prose">
        <Blocks blocks={content.blocks} sourcePage={path} />
      </article>

      <div style={{ marginTop: 64 }}>
        <FaqSection items={content.faq} />
      </div>

      <CtaBanner
        title={`${page.nav} 상담, 지금 무료로 받아보세요`}
        desc="입력하신 조건으로 수강료 범위와 개강 일정을 정리해 영업일 기준 1일 이내에 연락드립니다."
        label={page.cta + ' →'}
      />

      <RelatedLinks paths={content.related.filter((r) => r !== path)} />

      <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, marginTop: 8 }}>
        최종 업데이트 {UPDATED} · 본 페이지의 수강료·기간·시험 정보는 공개 자료를 정리한 참고 범위이며 실제와 다를 수 있습니다.
        자격시험 정보는 한국산업인력공단(q-net.or.kr), 국비지원 요건은 HRD-Net(hrd.go.kr)에서 확인하시기 바랍니다.
      </p>
    </main>
  );
}

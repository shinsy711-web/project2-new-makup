import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';
import { getPage, childrenOf, UPDATED, SITE_URL } from '@/lib/site';
import { COURSE_COSTS } from '@/data/constants';
import { REGION_DATA } from '@/data/regions';
import FormSection from '@/components/FormSection';
import DataTable from '@/components/DataTable';
import FaqSection from '@/components/FaqSection';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata('/');

const HOME = getPage('/');

const PURPOSE_PATHS = [
  {
    chip: '취미 · 셀프',
    title: '내 얼굴 화장만 잘하고 싶어요',
    desc: '원데이 1회로 감을 잡고, 맞으면 4주 취미반으로. 총예산 15~50만원이면 충분합니다.',
    links: [{ href: '/class/one-day/', label: '원데이클래스' }, { href: '/class/hobby/', label: '취미반' }, { href: '/class/beginner/', label: '기초 입문' }],
  },
  {
    chip: '자격증',
    title: '미용사(메이크업)를 따고 싶어요',
    desc: '자격증반 90~180만원 + 재료 25~45만원 + 응시료 약 4만원. 3~6개월이면 응시할 수 있습니다.',
    links: [{ href: '/license/national/', label: '국가자격증' }, { href: '/license/practical/', label: '실기 4과제' }, { href: '/license/written/', label: '필기 공부법' }],
  },
  {
    chip: '취업',
    title: '메이크업으로 취업하고 싶어요',
    desc: '자격증 + 포트폴리오까지 6~12개월. 웨딩·방송 중 분야를 먼저 정해야 커리큘럼이 갈립니다.',
    links: [{ href: '/career/jobs/', label: '취업 준비' }, { href: '/field/wedding/', label: '웨딩' }, { href: '/career/salary/', label: '연봉 현실' }],
  },
  {
    chip: '창업 · 부업',
    title: '내 가게나 부업을 하고 싶어요',
    desc: '메이크업 본과정보다 반영구·속눈썹·왁싱이 회수 기간이 짧습니다. 2~12주면 시작할 수 있습니다.',
    links: [{ href: '/field/semi-permanent/', label: '반영구' }, { href: '/field/eyelash/', label: '속눈썹' }, { href: '/field/waxing/', label: '왁싱' }],
  },
];

const HOME_FAQ = [
  { q: '메이크업학원 수강료는 얼마인가요?', a: '목적에 따라 다릅니다. 원데이클래스 3~15만원, 취미반 월 12~25만원, 미용사(메이크업) 자격증반 90~180만원, 취업까지 준비하는 전문가반 250~400만원이 일반적인 범위입니다. 여기에 재료비가 25~45만원 별도로 듭니다.' },
  { q: '메이크업을 배우는 데 얼마나 걸리나요?', a: '내 얼굴 화장만 목표라면 4~8주, 국가자격증까지는 3~6개월, 취업 준비까지 포함하면 6~12개월을 잡으시면 됩니다.' },
  { q: '완전 초보도 시작할 수 있나요?', a: '네. 기초·취미반은 화장을 한 번도 해보지 않은 사람 기준으로 설계돼 있습니다. 미용사(메이크업) 자격증도 학력·연령·전공 제한 없이 누구나 응시할 수 있습니다.' },
  { q: '국비지원으로 배울 수 있나요?', a: '고용노동부 지정 훈련기관의 승인된 과정이라면 가능합니다. 국민내일배움카드를 발급받아 사용하며, 훈련 유형과 개인 상황에 따라 자부담률이 0~45%로 달라집니다. 재료비와 응시료는 지원 대상이 아닙니다.' },
  { q: '나이가 많은데 늦지 않았을까요?', a: '늦지 않았습니다. 자격증에 연령 제한이 없고 30~50대 수강생 비중도 상당합니다. 다만 웨딩·방송처럼 체력 소모가 큰 분야보다 반영구·속눈썹·피부관리처럼 예약제로 운영되는 분야가 현실적으로 유리한 경우가 많습니다.' },
  { q: '자격증만 있으면 취업이 되나요?', a: '자격증은 지원 자격을 충족시키는 기본 요건이고, 실제 채용에서는 포트폴리오와 실기 테스트를 먼저 봅니다. 자격 취득 후 결과물 사진을 모으는 단계가 필요합니다.' },
];

export default function HomePage() {
  const classPages = childrenOf('/class/');
  const licensePages = childrenOf('/license/');
  const fieldPages = childrenOf('/field/');
  const fundingPages = childrenOf('/funding/');

  // FAQPage 구조화 데이터는 <FaqSection> 이 직접 emit 한다 — 여기서 또 넣으면 한 페이지에 2개가 된다.
  // 홈 전용 WebPage 노드 (레이아웃에 두면 전 페이지가 "나는 홈페이지다"라고 선언하게 됨)
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: HOME.title,
    inLanguage: 'ko-KR',
    description: HOME.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: ['메이크업학원', '메이크업학원 수강료', '메이크업 자격증', '국비지원 메이크업학원', '반영구 학원', '메이크업 배우기'],
    mainEntity: { '@id': `${SITE_URL}/#service` },
  };

  return (
    <main style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: 100 }}>
      <JsonLd data={webPageJsonLd} />

      {/* ══ 히어로 — H1 + DB 폼 (최상단) ══ */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--accent) 0%, #3A2540 55%, #58304A 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', right: -120, top: -120, width: 420, height: 420, background: 'var(--primary)', opacity: 0.16, borderRadius: '50%' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: -100, bottom: -160, width: 340, height: 340, background: 'var(--gold)', opacity: 0.1, borderRadius: '50%' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
            <span className="chip chip--dark" style={{ fontSize: 11, fontWeight: 900, padding: '7px 18px', letterSpacing: '0.14em', marginBottom: 20 }}>
              2026년 9월 전국 기준
            </span>

            <h1 style={{ fontSize: 'clamp(27px, 5vw, 48px)', fontWeight: 950, lineHeight: 1.16, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
              {HOME.h1}
            </h1>

            <p style={{ color: '#F0B7CE', fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: 700, marginBottom: 16, letterSpacing: '-0.01em' }}>
              원데이 3만원부터 자격증반 180만원까지 — 가격을 먼저 공개합니다
            </p>

            <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: 'clamp(13px, 1.6vw, 15.5px)', lineHeight: 1.85, maxWidth: 660, margin: '0 auto 34px' }}>
              메이크업학원은 목적에 따라 기간도 비용도 10배 넘게 차이 납니다.
              취미인지 자격증인지 취업인지만 알려주시면, 그에 맞는 과정과 실제 수강료 범위를 무료로 정리해 드립니다.
            </p>
          </div>

          {/* ★ DB 수집 폼 */}
          <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'left' }}>
            <FormSection cta={HOME.cta} sourcePage="/" id="form" />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 28 }}>
            {['수강료 범위 공개', '국비지원 대상 확인', '지역별 학원 비교', '개강 일정 안내'].map((t) => (
              <span key={t} className="chip chip--dark" style={{ fontSize: 12.5, padding: '8px 14px', borderRadius: 12 }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 76 }}>

        {/* ══ 서비스 정의 — 히어로 바로 아래. 이 사이트가 뭐하는 곳인지 먼저 밝힌다.
             수익 구조(제휴 상담처 연결)를 여기서 공개해 두면 폼의 제3자 제공 동의와
             맥락이 이어지고, 신뢰·E-E-A-T 측면에서도 유리하다. ══ */}
        <section className="section" aria-labelledby="about-title">
          <p className="eyebrow">서비스 소개</p>
          <h2 className="h2" id="about-title">메이크업학원 수강료 비교란?</h2>
          <p className="lead" style={{ maxWidth: 760, marginBottom: 30 }}>
            전국 메이크업·뷰티 학원의 <strong style={{ color: 'var(--text-primary)' }}>수강료와 과정 정보를 한자리에 모아 비교</strong>하고,
            조건에 맞는 학원 상담을 무료로 연결해 드리는 정보 서비스입니다.
            저희는 학원을 직접 운영하지 않습니다. 그래서 특정 학원을 밀어줄 이유도, 가격을 숨길 이유도 없습니다.
          </p>

          <div className="grid-auto" style={{ gap: 20, marginBottom: 28 }}>
            {[
              {
                chip: '가격 공개',
                title: '상담 전에 금액부터 알려드립니다',
                desc: '원데이 3만원, 취미반 월 12~25만원, 자격증반 90~180만원. 학원이 잘 알려주지 않는 범위를 과정별로 먼저 공개합니다.',
              },
              {
                chip: '조건별 정리',
                title: '내 조건에 맞는 것만 골라 드립니다',
                desc: '지역·목적·가능한 시간대를 알려주시면 통학 가능한 학원의 수강료와 개강 일정, 국비지원 대상 여부를 정리해 안내합니다.',
              },
              {
                chip: '68개 페이지',
                title: '자격증부터 지역까지 다 정리했습니다',
                desc: '미용사(메이크업) 자격증, 국비지원 제도, 반영구·속눈썹·왁싱 등 분야, 전국 17개 지역 시세를 페이지별로 나눠 담았습니다.',
              },
            ].map((c) => (
              <article key={c.chip} className="card" style={{ padding: 26 }}>
                <span className="chip" style={{ marginBottom: 12 }}>{c.chip}</span>
                <h3 style={{ fontSize: 17, fontWeight: 850, marginBottom: 8, lineHeight: 1.45, letterSpacing: '-0.02em' }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>{c.desc}</p>
              </article>
            ))}
          </div>

          <div className="card card--soft" style={{ padding: '24px 28px' }}>
            <p style={{ fontSize: 15, fontWeight: 850, marginBottom: 8, color: 'var(--primary-dark)' }}>
              그럼 이 서비스는 어떻게 운영되나요?
            </p>
            <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.85, margin: 0 }}>
              이용자에게는 어떤 비용도 받지 않습니다. 상담을 신청하시면 조건에 맞는 <strong style={{ color: 'var(--text-primary)' }}>제휴 상담처(메이크업·뷰티 교육기관)</strong>에
              연결해 드리고, 저희는 그 과정에서 수익을 얻습니다. 그래서 연결하기 전에 <strong style={{ color: 'var(--text-primary)' }}>어느 곳으로 연결되는지 먼저 알려드리고</strong>,
              원하지 않으시면 제공하지 않습니다. 자세한 내용은{' '}
              <Link href="/privacy-policy/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>개인정보처리방침</Link>에서 확인하실 수 있습니다.
            </p>
          </div>
        </section>

        {/* ══ 목적별 갈래 ══ */}
        <section className="section">
          <p className="eyebrow" style={{ textAlign: 'center' }}>먼저 목적부터</p>
          <h2 className="h2" style={{ textAlign: 'center' }}>같은 &ldquo;메이크업학원&rdquo;라도 목적에 따라 완전히 다릅니다</h2>
          <p className="lead" style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 40px' }}>
            내 얼굴만 하면 되는 사람과 남의 얼굴을 만져야 하는 사람은 필요한 시간이 3배 이상 차이 납니다.
            여기서 방향을 잘못 잡으면 돈과 시간을 같이 잃습니다.
          </p>

          <div className="grid-auto" style={{ gap: 22 }}>
            {PURPOSE_PATHS.map((p) => (
              <article key={p.chip} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
                <span className="chip" style={{ alignSelf: 'flex-start' }}>{p.chip}</span>
                <h3 style={{ fontSize: 18.5, fontWeight: 900, margin: '14px 0 10px', letterSpacing: '-0.02em', lineHeight: 1.4 }}>{p.title}</h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 18 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
                  {p.links.map((l) => (
                    <Link key={l.href} href={l.href} className="chip chip--outline" style={{ fontSize: 12.5 }}>{l.label} →</Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ══ 수강료 ══ */}
        <section className="section">
          <p className="eyebrow">수강료</p>
          <h2 className="h2">메이크업학원 수강료, 숨기지 않고 공개합니다</h2>
          <p className="lead" style={{ marginBottom: 28, maxWidth: 720 }}>
            상담 전에 어느 구간인지는 알고 시작해야 합니다. 아래는 2026년 9월 기준 전국 학원의 공개 수강료를 과정별로 정리한 범위입니다.
            재료비·응시료까지 포함한 총비용은{' '}
            <Link href="/cost/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>수강료 총정리</Link>에 표로 정리했습니다.
          </p>

          <DataTable
            head={['과정', '기간', '수강료', '재료비(별도)', '주 대상']}
            align={['left', 'center', 'center', 'center', 'left']}
            rows={COURSE_COSTS.map((c) => [c.name, c.period, c.tuition, c.material, c.target])}
            caption="2026년 9월 기준 전국 평균 범위입니다. 서울 강남권은 상단, 지방 중소도시는 하단에 가깝습니다. 학원별 실제 금액은 상담으로 확인이 필요합니다."
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 6 }}>
            <Link href="/cost/" className="btn btn--dark" style={{ fontSize: 14, padding: '12px 22px' }}>수강료 총정리 보기</Link>
            <Link href="/cost/compare/" className="btn btn--ghost" style={{ fontSize: 14, padding: '12px 22px' }}>학원 고르는 법 7가지</Link>
            <Link href="/funding/" className="btn btn--ghost" style={{ fontSize: 14, padding: '12px 22px' }}>국비지원 대상 확인</Link>
          </div>
        </section>

        {/* ══ 자격증 ══ */}
        <section className="section">
          <p className="eyebrow">자격증</p>
          <h2 className="h2">메이크업 자격증은 사실상 하나입니다</h2>
          <p className="lead" style={{ marginBottom: 28, maxWidth: 720 }}>
            검색하면 수십 개가 나오지만, 미용업 영업신고와 채용 요건에 실제로 쓰이는 것은 국가기술자격{' '}
            <Link href="/license/national/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>미용사(메이크업)</Link>와
            그에 따른 <Link href="/license/beauty-license/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>미용사 면허증</Link>입니다.
            나머지는 그 위에 얹는 부가 자격입니다.
          </p>

          <div className="grid-auto grid-auto--sm" style={{ marginBottom: 22 }}>
            {[
              { label: '응시 자격', value: '제한 없음', sub: '학력·연령·전공 무관' },
              { label: '필기 응시료', value: '14,500원', sub: '60문항 60분' },
              { label: '실기 응시료', value: '26,900원', sub: '4과제 약 2시간 35분' },
              { label: '평균 취득', value: '3~6개월', sub: '학원 병행 기준' },
            ].map((s) => (
              <div key={s.label} className="card" style={{ padding: 22 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 950, letterSpacing: '-0.02em', marginBottom: 4, lineHeight: 1.2 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {licensePages.map((p) => (
              <Link key={p.path} href={p.path} title={p.title} className="chip" style={{ fontSize: 13, padding: '9px 15px' }}>{p.nav} →</Link>
            ))}
          </div>
        </section>

        {/* ══ 분야 ══ */}
        <section className="section">
          <p className="eyebrow">전문 분야</p>
          <h2 className="h2">메이크업 안에 성격이 다른 직업이 여러 개 있습니다</h2>
          <p className="lead" style={{ marginBottom: 28, maxWidth: 720 }}>
            웨딩은 새벽 출근·주말 근무·팀 작업이고, 반영구는 예약제·1인 운영·평일 중심입니다.
            배우기 전에 어느 쪽이 내 생활과 맞는지부터 판단하세요. →{' '}
            <Link href="/field/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>분야 전체 비교</Link>
          </p>

          <div className="grid-auto" style={{ gap: 18 }}>
            {[
              { path: '/field/semi-permanent/', title: '반영구 · 눈썹문신', meta: '4~12주 · 150~450만원', desc: '시술 단가가 가장 높은 분야. 예약제 1인 운영이 가능합니다.', tone: 'var(--primary-light)' },
              { path: '/field/eyelash/', title: '속눈썹 연장 · 펌', meta: '2~6주 · 80~250만원', desc: '가장 빨리 실전에 나갈 수 있고, 3~4주 재방문 주기가 있습니다.', tone: 'var(--gold-light)' },
              { path: '/field/skincare/', title: '피부관리 · 피부미용', meta: '6~12개월 · 200~400만원', desc: '국가자격이 있어 채용 자리가 가장 넓은 분야입니다.', tone: 'var(--accent-light)' },
              { path: '/field/sfx/', title: '특수분장', meta: '3~9개월 · 200~500만원', desc: '영화·드라마·테마파크. 재료비 비중이 큽니다.', tone: 'var(--primary-light)' },
              { path: '/field/wedding/', title: '웨딩 메이크업', meta: '6~12개월 · 250~400만원', desc: '채용 자리가 가장 많지만 새벽·주말 근무가 기본입니다.', tone: 'var(--gold-light)' },
              { path: '/field/waxing/', title: '왁싱', meta: '2~8주 · 80~300만원', desc: '단기 진입 가능. 재방문 주기 3~5주로 안정적입니다.', tone: 'var(--accent-light)' },
            ].map((f) => (
              <article key={f.path} className="card" style={{ background: f.tone, borderColor: 'transparent', padding: 26 }}>
                <p style={{ fontSize: 11.5, fontWeight: 900, color: 'var(--primary-dark)', marginBottom: 8 }}>{f.meta}</p>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.02em' }}>
                  <Link href={f.path}>{f.title}</Link>
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </article>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 20 }}>
            {fieldPages.filter((p) => !['/field/semi-permanent/', '/field/eyelash/', '/field/skincare/', '/field/sfx/', '/field/wedding/', '/field/waxing/'].includes(p.path)).map((p) => (
              <Link key={p.path} href={p.path} title={p.title} className="chip chip--outline" style={{ fontSize: 13, padding: '8px 14px' }}>{p.nav} →</Link>
            ))}
          </div>
        </section>

        {/* ══ 국비지원 ══ */}
        <section className="section">
          <div className="card card--dark" style={{ padding: 'clamp(28px, 4vw, 44px)' }}>
            <p className="eyebrow" style={{ color: '#F0B7CE' }}>국비지원</p>
            <h2 className="h2" style={{ color: 'white' }}>국비로 배우려면 두 조건이 모두 맞아야 합니다</h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, maxWidth: 700, marginBottom: 26 }}>
              ① 내가 국민내일배움카드 발급 대상일 것 ② 다니려는 학원이 고용노동부 지정 기관이고 그 과정이 승인돼 있을 것.
              둘 중 하나만 빠져도 지원이 되지 않습니다. 학원 광고의 &ldquo;국비지원 가능&rdquo;은 기관 지정 여부만 뜻하는 경우가 많습니다.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
              {fundingPages.map((p) => (
                <Link key={p.path} href={p.path} title={p.title} className="chip chip--dark" style={{ fontSize: 13, padding: '9px 15px' }}>{p.nav} →</Link>
              ))}
              <Link href="/funding/" className="chip chip--dark" style={{ fontSize: 13, padding: '9px 15px' }}>국비지원 전체 →</Link>
            </div>
          </div>
        </section>

        {/* ══ 학원 과정 유형 ══ */}
        <section className="section">
          <p className="eyebrow">학원 과정</p>
          <h2 className="h2">시간표부터 맞추세요. 완주 못 하는 이유는 커리큘럼이 아닙니다</h2>
          <p className="lead" style={{ marginBottom: 26, maxWidth: 720 }}>
            중도 포기의 가장 큰 원인은 시간표입니다. 앞으로 3~6개월 동안 확보 가능한 요일과 시간을 먼저 계산하고 과정을 고르세요. →{' '}
            <Link href="/class/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>학원 과정 종류 총정리</Link>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {classPages.map((p) => (
              <Link key={p.path} href={p.path} title={p.title} className="chip" style={{ fontSize: 13, padding: '9px 15px' }}>{p.nav} →</Link>
            ))}
          </div>
        </section>

        {/* ══ 지역 ══ */}
        <section className="section">
          <p className="eyebrow">지역</p>
          <h2 className="h2">수강료는 지역에 따라 최대 40% 차이 납니다</h2>
          <p className="lead" style={{ marginBottom: 26, maxWidth: 720 }}>
            다만 수강료가 낮은 지역일수록 개강 주기가 길어지는 경향이 있습니다. 통학 30분을 넘기면 완주율이 크게 떨어지므로 가격보다 동선을 먼저 보세요. →{' '}
            <Link href="/region/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>지역별 수강료 비교</Link>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {REGION_DATA.map((r) => (
              <Link key={r.path} href={r.path} className="chip chip--outline" style={{ fontSize: 13, padding: '8px 14px' }}>
                {r.name} {r.tuition}
              </Link>
            ))}
          </div>
        </section>

        {/* ══ FAQ ══ */}
        <FaqSection items={HOME_FAQ} title="메이크업학원, 자주 묻는 질문" />

        {/* ══ 하단 CTA ══ */}
        <section
          style={{
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--gold-light) 100%)',
            borderRadius: 28,
            padding: 'clamp(32px, 4vw, 48px) clamp(22px, 4vw, 40px)',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 25px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>
            내 조건이면 얼마인지, 3분이면 확인됩니다
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto 26px' }}>
            목적과 지역, 가능한 시간대만 알려주시면 그에 맞는 과정과 실제 수강료 범위, 국비 적용 가능 여부까지 정리해 드립니다. 100% 무료입니다.
          </p>
          <a href="#form" className="btn btn--dark">무료로 수강료 견적 받기 →</a>
        </section>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, marginTop: 32, textAlign: 'center' }}>
          최종 업데이트 {UPDATED} · 게재된 수강료·기간은 공개 자료를 정리한 참고 범위이며 학원별 실제 금액과 다를 수 있습니다.
          자격시험 정보는 한국산업인력공단(q-net.or.kr), 국비지원 요건은 HRD-Net(hrd.go.kr)에서 확인하시기 바랍니다.
        </p>
      </div>
    </main>
  );
}

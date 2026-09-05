# project30 — 메이크업학원 수강료 비교 (DB 수집)

**도메인**: `makeuphagwon.kr`

메이크업 교육 키워드로 검색 유입을 받아 **상담 DB를 수집**하는 사이트입니다.
구조는 `project16_nail`(허브-스포크 SEO) + `project29_beauty_ipsi`(페이지 레지스트리·DB 폼)를 계승했습니다.

- **키워드 근거**: 「네일·메이크업 학원 키워드 통합 리서치」 스프레드시트 > **메이크업 탭(151개)** + 공통·국비지원 탭 + 신규발굴 DB 탭
  (네이버 검색광고 API / Google Keyword Planner, 기준일 2026-09-04)
- **페이지 수**: 68 (홈 1 + 서브 67)
- **스택**: Next.js 16 (App Router) · React 19 · Tailwind 4 · TypeScript

---

## 1. 핵심 설계

### 페이지 레지스트리 — `lib/site.ts`
title / h1 / description / keywords / cta / 우선순위를 **한 파일**에서 관리합니다.
여기서 nav · sitemap · breadcrumb · 내부링크 · JSON-LD 가 전부 파생됩니다.

```
PAGES[] → NAV_TREE, childrenOf(), breadcrumbChain(), sitemap.ts, PageHero(h1), pageMetadata(title)
```

**title·h1 규칙**
1. `h1` 은 타겟 키워드를 질문형·구어체로 (CTR)
2. `title` 은 [핵심키워드] + 구분자 + [숫자·연도·차별점], 60자 이내
3. title 과 h1 을 의도적으로 다르게 — 검색결과와 진입 후 기대를 각각 충족

### DB 수집 폼 — 모든 페이지 최상단
`components/FormSection.tsx` 가 **H1 바로 아래**에 고정 배치됩니다.

- 서브페이지: `components/PageHero.tsx` 안에 폼이 내장 → 구조상 위치가 어긋날 수 없음
- 홈: 히어로 안 (`app/page.tsx`)
- 본문 중간: 콘텐츠 블록 `{ t: 'form' }` 으로 1~2회 추가 배치

**동의 모달** `components/PrivacyModal.tsx` — 필수 3종
1. 개인정보 수집 및 이용 동의
2. **개인정보 제3자 제공 동의**
3. 만 14세 미만 법정대리인 동의 (생년월일로 자동 판별)

전송: `POST {NEXT_PUBLIC_DB_SUBMIT_URL}?api_key={NEXT_PUBLIC_DB_API_KEY}`
→ `project21_db` 의 `app/api/submit/route.ts` 스키마에 맞춘 필드 사용
(`customer_name`, `customer_birth`, `mobile1/2`, `customer_sex`, `region`, `has_license`, `category`, `purpose` + `raw_data`)

### 콘텐츠 블록 — `data/content/*.ts`
페이지 본문을 JSX 대신 블록 배열로 기술합니다. 페이지를 늘릴 때 새 컴포넌트를 짤 필요가 없습니다.

```ts
{ t: 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'table' | 'callout'
    | 'steps' | 'stats' | 'cards' | 'form' | 'links' }
```

인라인 문법: `[라벨](/경로/)` → 내부 링크, `**강조**` → `<strong>`
레지스트리에 없는 경로는 링크로 만들지 않아 **죽은 링크가 생기지 않습니다**.

---

## 2. 디렉터리

```
app/
  layout.tsx              사이트 공통 메타·JSON-LD(@graph)
  page.tsx                홈 (커스텀 · 히어로에 폼)
  [...slug]/page.tsx      레지스트리 67페이지 정적 생성
  icon.tsx                파비콘 (빌드 타임 생성)
  opengraph-image.tsx     OG 이미지 1200×630 (빌드 타임 생성)
  sitemap.ts / robots.ts
  privacy-policy/ terms-of-service/   (noindex)
components/
  FormSection.tsx  PrivacyModal.tsx          ★ DB 수집
  PageHero.tsx  Blocks.tsx  Breadcrumbs.tsx  ArticleJsonLd.tsx  FaqSection.tsx …
  legal/PrivacyPolicyContent.tsx  legal/TermsContent.tsx
lib/
  site.ts       ★ 페이지 레지스트리 (68p)
  metadata.ts   레지스트리 → Next Metadata
  validate.ts   폼 검증 · 만14세 판별
data/
  constants.ts  폼 옵션(지역·과정·목적·시간대) · 수강료 기준표
  regions.ts    지역 17개 원천 데이터
  content/      cost · class · license · field · funding · region · career
```

---

## 3. 섹션 구성 (68p)

| 섹션 | 페이지 | 주 타겟 키워드(월 검색량) |
|---|---|---|
| 수강료 | 4 | 메이크업학원 수강료·가격·비용, 학원 추천/순위/후기, 환불 |
| 학원과정 | 11 | 메이크업학원(3,310), 원데이클래스(1,790), 배우기(470) |
| 자격증 | 11 | 메이크업 자격증(1,570), 국가자격증(1,180), **퍼스널컬러 자격증(1,150)**, 미용사 면허증 |
| 분야 | 12 | **반영구 학원(1,780·점수 1위)**, 피부관리, 속눈썹, 왁싱, 특수분장(440) |
| 국비지원 | 5 | 국비지원 메이크업학원, 내일배움카드, 훈련장려금, 학점은행제 |
| 지역 | 18 | 대구(370)·부산(280)·광주(220)·수원(200)·대전(200)·천안 등 17개 |
| 진로 | 5 | 메이크업아티스트(2,390), 연봉(250), 취업, 프리랜서 |
| 학과 | 2 | 메이크업학과(710), 화장품학과(1,060) |

---

## 4. 배포 전 남은 작업 ⚠️

1. **도메인 연결** → `makeuphagwon.kr` 을 배포처(Vercel 등)에 연결하고 DNS 설정
   `.env.local` 의 `NEXT_PUBLIC_SITE_URL` 은 이미 `https://makeuphagwon.kr` 로 설정돼 있습니다
2. **DB API 키 발급** → `project21_db` 관리자에서 project30 사이트 등록 후
   `NEXT_PUBLIC_DB_API_KEY` 에 입력 (현재 `REPLACE_WITH_PROJECT30_KEY`)
   → **키를 넣기 전까지 폼 전송은 동작하지 않습니다**
3. **운영주체 확인** — `lib/site.ts` 의 `OPERATOR` (회사명·상담 파트너·보호책임자)
4. GA4 측정 ID → `NEXT_PUBLIC_GA_ID`
5. 네이버 서치어드바이저 인증코드 → `NEXT_PUBLIC_NAVER_VERIFICATION`
6. 배포 후 GSC·네이버 서치어드바이저에 `sitemap.xml` 제출

### 용어 원칙 (2026-09-05 확정)
사이트 전체에서 **"클래스"를 쓰지 않고 "학원"/"과정"으로 통일**합니다.
예외는 `원데이클래스` 하나 — 그 자체가 월 1,790 검색어이고 "원데이학원"이라는 말은 없기 때문입니다.
`Section` 타입의 `'학원과정'` 값과 `/class/` 경로(URL)는 유지합니다. URL 변경은 색인 리셋 비용이 커서 별도 판단이 필요합니다.

### 수치 표기 원칙
게재된 수강료·기간은 **공개 정보를 정리한 참고 범위**로 표기하며, 모든 페이지 하단과
푸터·필수안내사항 모달에 "실제와 다를 수 있음 / 자격시험은 q-net, 국비는 HRD-Net 확인" 고지를 넣었습니다.
숫자를 수정할 때는 `data/constants.ts` 의 `COURSE_COSTS` 와 각 콘텐츠 파일을 함께 맞춰 주세요.

---

## 5. 명령어

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 생성 (68 페이지)
npm start
```

## 6. 페이지 추가하는 법

1. `lib/site.ts` `PAGES[]` 에 항목 추가 (path · parent · title · h1 · description · cta · keywords)
2. `data/content/<섹션>.ts` 에 같은 `path` 로 `PageContent` 추가
3. 끝 — 라우트·sitemap·nav·breadcrumb·내부링크가 자동 생성됩니다

지역 페이지는 `data/regions.ts` 에 항목을 추가하면 본문까지 자동 생성됩니다.

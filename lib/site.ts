// ─────────────────────────────────────────────────────────────
// 사이트 단일 소스 — 브랜드 · 운영주체 · 페이지 레지스트리(68p)
//
// 키워드 근거: "네일·메이크업 학원 키워드 통합 리서치" 스프레드시트 > 메이크업 탭(151개)
//              + 공통·국비지원 탭 + 신규발굴 DB 탭 (네이버 검색광고 API / GKP, 기준일 2026-09-04)
//
// 이 파일 하나가 title / h1 / description / keywords / nav / sitemap / breadcrumb /
// 내부링크 / JSON-LD 를 전부 만든다. 페이지를 늘릴 때도 여기부터 추가한다.
//
// ★ title·h1 규칙 (project5 전략 계승)
//   1) h1 에는 타겟 키워드를 "질문형·구어체"로 자연스럽게 넣는다 (CTR)
//   2) title 은 [핵심키워드] + [구분자] + [숫자·연도·차별점] 60자 이내
//   3) title 과 h1 을 의도적으로 다르게 쓴다 — 검색결과와 페이지 진입 후 기대를 각각 충족
// ─────────────────────────────────────────────────────────────

export const SITE_NAME = '메이크업학원 수강료 비교';
export const SITE_SHORT = '메이크업학원 비교';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://makeuphagwon.kr').replace(/\/$/, '');
/**
 * OG · 썸네일 이미지 (public/og.jpg).
 * 원본 사진 public/img/thumb.webp 을 1200x630 JPEG 로 합성한 것.
 * 카카오·네이버 미리보기가 WebP 를 제대로 못 읽는 경우가 있어 JPEG 로 둔다.
 * 사진을 바꾸면 og.jpg 도 다시 만들어야 한다.
 */
export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
/** 구글 애드센스 퍼블리셔 ID — 사이트 소유 확인용 메타 태그에 사용 */
export const ADSENSE_PUB = 'ca-pub-5378247298190063';
/** 네이버 서치어드바이저 사이트 소유확인 코드 (환경변수로 덮어쓸 수 있음) */
export const NAVER_VERIFICATION =
  process.env.NEXT_PUBLIC_NAVER_VERIFICATION || '53b3ef529aa5c9054534cb9695c2641a371dcdc3';

export const UPDATED = '2026-09-05';

/** 운영 주체(사업자) 정보 — 개인정보처리방침·이용약관·푸터에 그대로 노출된다 */
const OWNER = {
  company: '주식회사 와야미디어',
  email: 'shinsy711@gmail.com',
  privacyOfficer: '신승윤',
  hours: '월~토 10:00 ~ 19:00 (일요일·공휴일 휴무)',
};

/**
 * 동의 문구 버전. 문구를 고치면 반드시 올릴 것.
 * 전송 페이로드에 함께 실려 "언제, 어떤 문구에 동의했는지"를 입증하는 근거가 된다.
 */
export const CONSENT_VERSION = 'v1.1-20260905';

/** 운영 주체 + 개인정보 고지 문구 (동의 모달 · 처리방침 · 필수안내사항이 공유) */
export const OPERATOR = {
  company: OWNER.company,
  email: OWNER.email,
  hours: OWNER.hours,
  privacyOfficer: OWNER.privacyOfficer,

  // ── 개인정보 제3자 제공 고지 ──────────────────────────────
  // 동의 시점에는 제공받는 자를 특정할 수 없으므로(구매처가 그때그때 정해짐),
  // ① 범주를 구체적으로 적고 ② 실제 제공 시 상호를 특정해 재확인한다는 사실을 함께 고지한다.
  // ②가 빠지면 개인정보보호법 제17조의 '제공받는 자 특정' 요건을 충족했다고 보기 어렵다.
  // ⚠️ ②는 문구로만 두면 안 되고 실제 운영 절차로 지켜야 효력이 있다.

  /** 제공받는 자 (범주) */
  recipients: "메이크업·뷰티 교육기관(학원·아카데미) 및 해당 기관의 상담 위탁사 — 이하 '제휴 상담처'",
  /** 제공 범위가 고정되지 않는다는 고지 */
  recipientsScope: '제휴 상담처는 이용자가 선택한 지역·관심 과정에 따라 정해지며, 한 곳이 아닌 복수의 상담처에 제공될 수 있습니다.',
  /** ★ 제공 시점에 상호를 특정해 재확인한다는 고지 — 이 문장이 핵심 */
  recipientsSpecify: '실제 제공 시에는 제공받는 상담처의 상호를 특정하여 사전에 안내드리며, 원하지 않으실 경우 제공하지 않습니다.',
  /** 목록 열람 방법 */
  recipientsListNote: `현재 제휴 상담처 목록은 ${OWNER.email} 으로 요청하시면 회신해 드립니다.`,

  // ── 광고성 정보 수신 (정보통신망법 제50조) ────────────────
  adSender: `${OWNER.company} 및 제휴 상담처`,
  adChannels: '전화, 문자메시지(SMS/LMS), 카카오 알림톡',
  adContents: '수강료 안내, 개강 일정, 할인·이벤트 정보',
};

export type Section = '수강료' | '학원과정' | '자격증' | '분야' | '국비지원' | '지역' | '진로' | '학과';
export type Grade = 'S' | 'A' | 'B' | 'C';

export type PageDef = {
  /** 트레일링 슬래시 포함 경로 */
  path: string;
  /** 브레드크럼 상위 (홈은 null) */
  parent: string | null;
  section: Section;
  /** 우선순위 등급 — 시트의 등급 컬럼 기준 */
  grade: Grade;
  /** 타겟 키워드군 네이버 월 검색량 합 */
  volume: number;
  /** 짧은 메뉴명 */
  nav: string;
  /** <title> — 검색결과에 그대로 노출 */
  title: string;
  /** 페이지 H1 — 페이지당 정확히 1개 */
  h1: string;
  /** meta description */
  description: string;
  /** 폼 CTA 버튼 문구 */
  cta: string;
  /** 타겟 키워드 (첫 번째가 주 키워드) */
  keywords: string[];
  /** sitemap priority */
  priority: number;
};

export const PAGES: PageDef[] = [
  // ══════════════════════════════════════════════════════════
  // ① 수강료 · 전환 — 문의 직전 인텐트
  // ══════════════════════════════════════════════════════════
  {
    path: '/', parent: null, section: '수강료', grade: 'S', volume: 11430, nav: '홈',
    title: '메이크업학원 수강료 비교 2026 | 과정별 비용·국비지원 총정리',
    h1: '메이크업학원 수강료, 비교부터 하고 시작하세요',
    description: '메이크업학원 수강료를 원데이·취미·자격증·취업 과정별로 비교합니다. 국비지원 여부와 지역별 시세까지 무료로 안내합니다.',
    cta: '내 조건으로 수강료 견적 받기 (무료)',
    keywords: ['메이크업학원', '메이크업 학원 수강료', '메이크업학원 비용', '메이크업 배우기', '메이크업 원데이클래스', '메이크업 자격증'],
    priority: 1.0,
  },
  {
    path: '/cost/', parent: '/', section: '수강료', grade: 'S', volume: 470, nav: '수강료',
    title: '메이크업학원 수강료 총정리 | 과정별 학원비·재료비 2026',
    h1: '메이크업학원 수강료, 과정별로 얼마인가요?',
    description: '메이크업학원 수강료는 취미반 월 12~25만원, 자격증반 90~180만원입니다. 재료비·응시료까지 포함한 총비용을 표로 공개합니다.',
    cta: '내 과정 수강료 정확히 받아보기',
    keywords: ['메이크업 학원 가격', '메이크업 학원 수강료', '메이크업학원 수강료', '메이크업 학원 비용', '메이크업 학원비', '메이크업 배우는 비용', '메이크업 자격증 비용'],
    priority: 0.95,
  },
  {
    path: '/cost/compare/', parent: '/cost/', section: '수강료', grade: 'B', volume: 160, nav: '학원 고르는 법',
    title: '메이크업학원 고르는 법 7가지 | 후기·순위에 속지 않으려면',
    h1: '메이크업학원, 이 7가지만 확인하면 실패하지 않습니다',
    description: '메이크업학원 추천·순위는 대부분 광고입니다. 강사당 인원, 실습 모델, 재료비, 환불 규정 등 계약 전 확인할 7가지를 정리했습니다.',
    cta: '내 조건 맞는 학원 3곳 추천받기',
    keywords: ['메이크업 학원 추천', '메이크업 학원 순위', '메이크업 학원 후기', '메이크업 학원 고르는법', '메이크업 학원 잘하는곳', '메이크업 학원 비교', '메이크업 학원 유명한곳'],
    priority: 0.85,
  },
  {
    path: '/cost/refund/', parent: '/cost/', section: '수강료', grade: 'C', volume: 100, nav: '환불·재료비',
    title: '메이크업학원 환불 규정·교재비·재료비 | 계약 전 체크리스트',
    h1: '메이크업학원 환불, 언제 얼마나 돌려받을 수 있나요?',
    description: '학원법 시행령 기준 메이크업학원 환불 규정입니다. 수강 기간별 반환 비율과 재료비·교재비가 제외되는 이유를 정리했습니다.',
    cta: '계약 전 무료 상담받기',
    keywords: ['메이크업 학원 환불', '메이크업 학원 교재비', '메이크업 재료비', '메이크업 학원 준비물'],
    priority: 0.7,
  },

  // ══════════════════════════════════════════════════════════
  // ② 학원 과정 · 커리큘럼 — 최대 볼륨군
  // ══════════════════════════════════════════════════════════
  {
    path: '/class/', parent: '/', section: '학원과정', grade: 'S', volume: 8330, nav: '학원 과정',
    title: '메이크업학원 과정 종류 총정리 | 원데이·정규·취미반 한눈에',
    h1: '메이크업학원, 어떤 과정을 들어야 할까요?',
    description: '메이크업학원 과정은 원데이·취미반·자격증반·전문가반 4가지입니다. 목적별로 기간과 수강료가 얼마나 다른지 비교했습니다.',
    cta: '내 목적에 맞는 과정 추천받기',
    keywords: ['메이크업학원', '메이크업 강좌', '메이크업 배우기', '메이크업 수업', '메이크업 스쿨'],
    priority: 0.98,
  },
  {
    path: '/class/one-day/', parent: '/class/', section: '학원과정', grade: 'A', volume: 1790, nav: '원데이클래스',
    title: '메이크업 원데이클래스 가격·커리큘럼 | 하루 3시간 완성',
    h1: '메이크업 원데이클래스, 하루에 뭘 배우나요?',
    description: '메이크업 원데이클래스 가격은 3~15만원, 2~4시간입니다. 주제별 커리큘럼과 재료 제공 여부, 원데이로 충분한 경우를 정리했습니다.',
    cta: '원데이클래스 일정·가격 안내받기',
    keywords: ['메이크업 원데이클래스', '메이크업학원', '원데이 메이크업', '셀프메이크업학원'],
    priority: 0.92,
  },
  {
    path: '/class/beginner/', parent: '/class/', section: '학원과정', grade: 'B', volume: 530, nav: '기초·입문',
    title: '메이크업 배우기 첫걸음 | 기초반 4주 커리큘럼',
    h1: '메이크업 처음 배우는데, 뭐부터 해야 하나요?',
    description: '메이크업 배우기는 베이스·아이브로우·아이섀도·립 순서입니다. 기초반 4주 커리큘럼과 독학·학원의 실제 차이를 정리했습니다.',
    cta: '기초반 커리큘럼·수강료 받아보기',
    keywords: ['메이크업 배우기', '메이크업 기초 배우기', '메이크업 초보 학원', '메이크업 독학', '메이크업 과외'],
    priority: 0.85,
  },
  {
    path: '/class/3month/', parent: '/class/', section: '학원과정', grade: 'C', volume: 70, nav: '3개월 과정',
    title: '메이크업 3개월 속성 과정 | 자격증까지 되는 커리큘럼',
    h1: '메이크업 3개월, 어디까지 배울 수 있나요?',
    description: '메이크업 3개월 과정은 주 3회·36~48시간으로 실기 4과제를 커버합니다. 월별 커리큘럼과 가능한 범위를 정리했습니다.',
    cta: '3개월 속성반 시간표 받기',
    keywords: ['메이크업 3개월 과정', '메이크업 속성반', '메이크업 학원 기간', '메이크업 단기속성'],
    priority: 0.7,
  },
  {
    path: '/class/6month/', parent: '/class/', section: '학원과정', grade: 'C', volume: 60, nav: '6개월 정규',
    title: '메이크업 6개월 정규 과정 | 주차별 커리큘럼·시간표',
    h1: '메이크업 6개월 과정, 주차별로 이렇게 배웁니다',
    description: '메이크업 6개월 정규 과정 24주 커리큘럼을 주차별로 공개합니다. 시간표 유형과 3개월 속성반과의 차이를 비교했습니다.',
    cta: '6개월 정규반 상담 신청',
    keywords: ['메이크업 6개월 과정', '메이크업 학원 커리큘럼', '메이크업 학원 시간표', '메이크업 정규과정'],
    priority: 0.7,
  },
  {
    path: '/class/weekend/', parent: '/class/', section: '학원과정', grade: 'C', volume: 60, nav: '주말·야간반',
    title: '메이크업 주말반·야간반 | 직장인 수강 시간표 총정리',
    h1: '직장 다니면서 메이크업 배우려면 주말반? 야간반?',
    description: '메이크업 주말반은 토 4~6시간, 야간반은 평일 19시 이후입니다. 직장인 완주율이 높은 쪽과 총 소요 기간을 비교했습니다.',
    cta: '주말·야간반 개강 일정 받기',
    keywords: ['메이크업 주말반', '메이크업 야간반', '메이크업 직장인 학원', '메이크업 학원 시간표'],
    priority: 0.72,
  },
  {
    path: '/class/private/', parent: '/class/', section: '학원과정', grade: 'C', volume: 40, nav: '1:1·소수정예',
    title: '메이크업 1:1 수업·소수정예 | 수강료 차이와 실제 효과',
    h1: '메이크업 1:1 수업, 그룹반보다 얼마나 비쌀까요?',
    description: '메이크업 1:1 수업은 그룹반의 1.8~2.5배입니다. 소수정예와의 차이, 1:1이 반드시 유리한 경우를 구분해 정리했습니다.',
    cta: '1:1 수업 가능 여부 확인하기',
    keywords: ['메이크업 1:1 수업', '메이크업 소수정예 학원', '메이크업 개인레슨', '메이크업 과외'],
    priority: 0.7,
  },
  {
    path: '/class/online/', parent: '/class/', section: '학원과정', grade: 'C', volume: 40, nav: '온라인·인강',
    title: '메이크업 온라인 강의·인강 | 실습은 어떻게 하나요?',
    h1: '메이크업 인강으로 정말 배울 수 있을까요?',
    description: '메이크업 인강은 필기에는 통하지만 실기는 다릅니다. 온라인이 되는 영역과 안 되는 영역, 병행 구성법을 정리했습니다.',
    cta: '온·오프 병행 과정 문의하기',
    keywords: ['메이크업 온라인 강의', '메이크업 인강', '메이크업 독학', '메이크업 원격강의'],
    priority: 0.7,
  },
  {
    path: '/class/hobby/', parent: '/class/', section: '학원과정', grade: 'C', volume: 140, nav: '취미·셀프',
    title: '셀프 메이크업 취미반 | 내 얼굴 화장 배우기 4주',
    h1: '내 얼굴 하나만 잘 하고 싶다면 취미반부터',
    description: '셀프 메이크업 취미반은 자격증·취업이 목적이 아닌 과정입니다. 4주 커리큘럼과 월 12~25만원 수강료를 안내합니다.',
    cta: '취미반 개강일·수강료 받기',
    keywords: ['메이크업 취미반', '셀프메이크업 배우기', '화장 배우기', '메이크업학원'],
    priority: 0.75,
  },
  {
    path: '/class/adult/', parent: '/class/', section: '학원과정', grade: 'C', volume: 80, nav: '40대·비전공자',
    title: '40대·주부 메이크업 배우기 | 비전공자 나이 걱정 없이',
    h1: '메이크업 배우기에 늦은 나이는 없습니다',
    description: '메이크업학원 수강생의 상당수는 30~50대 비전공자입니다. 나이대별 진입 경로와 40대 이후 유리한 분야를 정리했습니다.',
    cta: '내 나이·경력으로 가능한 과정 상담',
    keywords: ['40대 메이크업 배우기', '메이크업 학원 나이', '메이크업 비전공자', '메이크업 주부', '30대 메이크업아티스트'],
    priority: 0.72,
  },
  {
    path: '/class/academy/', parent: '/class/', section: '학원과정', grade: 'C', volume: 130, nav: '아카데미·전문학교',
    title: '메이크업 아카데미·전문학교 차이 | 학원과 뭐가 다른가요?',
    h1: '메이크업 아카데미, 학원, 전문학교 뭐가 다른가요?',
    description: '메이크업 아카데미·학원·전문학교는 인가 형태와 국비지원 여부가 다릅니다. 등록 학원인지 확인하는 법을 정리했습니다.',
    cta: '인가 학원 여부 확인 요청하기',
    keywords: ['메이크업 아카데미', '메이크업 전문학교', '메이크업 스쿨', '메이크업 강좌', '뷰티학원'],
    priority: 0.72,
  },

  // ══════════════════════════════════════════════════════════
  // ③ 자격증
  // ══════════════════════════════════════════════════════════
  {
    path: '/license/', parent: '/', section: '자격증', grade: 'A', volume: 1570, nav: '자격증',
    title: '메이크업 자격증 총정리 | 국가·민간 종류와 취득 순서 2026',
    h1: '메이크업 자격증, 어떤 걸 먼저 따야 하나요?',
    description: '메이크업 자격증은 국가기술자격 미용사(메이크업)가 기준입니다. 민간자격과의 차이와 취득 순서를 우선순위로 정리했습니다.',
    cta: '자격증 취득 로드맵 무료 상담',
    keywords: ['메이크업 자격증', '메이크업 국가자격증', '메이크업 자격증 학원', '메이크업 자격증반', '미용사 메이크업'],
    priority: 0.95,
  },
  {
    path: '/license/national/', parent: '/license/', section: '자격증', grade: 'B', volume: 1180, nav: '국가자격증',
    title: '미용사(메이크업) 국가자격증 | 응시자격·과정·비용 2026',
    h1: '미용사(메이크업) 국가자격증, 이렇게 취득합니다',
    description: '미용사(메이크업)는 응시자격 제한이 없습니다. 필기 14,500원, 실기 26,900원, 평균 3~6개월. 취득 절차를 단계별로 안내합니다.',
    cta: '자격증반 개강 일정 받기',
    keywords: ['메이크업 국가자격증', '미용사 메이크업', '메이크업 자격증', '메이크업 국가자격증 실기', '메이크업 자격증 학원'],
    priority: 0.9,
  },
  {
    path: '/license/written/', parent: '/license/', section: '자격증', grade: 'C', volume: 300, nav: '필기시험',
    title: '메이크업 필기시험 기출·과목 | 합격 공부법 4주',
    h1: '메이크업 필기, 4주면 붙습니다',
    description: '미용사(메이크업) 필기는 60문항 60분, 60점이면 합격입니다. 과목별 출제 비중과 기출 위주 4주 학습 플랜을 정리했습니다.',
    cta: '필기 대비반 문의하기',
    keywords: ['메이크업 필기 기출', '미용사 메이크업 필기', '메이크업 자격증 필기', '메이크업 필기 공부법'],
    priority: 0.78,
  },
  {
    path: '/license/practical/', parent: '/license/', section: '자격증', grade: 'C', volume: 290, nav: '실기시험',
    title: '메이크업 실기 과제 4종 | 시간 배분·감점 포인트',
    h1: '메이크업 실기, 이 4가지 과제가 나옵니다',
    description: '미용사(메이크업) 실기는 4과제 총 2시간 35분입니다. 과제별 배점과 시간 배분, 자주 깎이는 감점 포인트를 정리했습니다.',
    cta: '실기 첨삭 수업 신청하기',
    keywords: ['메이크업 실기 과제', '미용사 메이크업 실기', '메이크업 국가자격증 실기', '메이크업 실기 시험'],
    priority: 0.8,
  },
  {
    path: '/license/supplies/', parent: '/license/', section: '자격증', grade: 'C', volume: 60, nav: '실기 준비물',
    title: '메이크업 실기 준비물 전체 목록 | 비용·구입처',
    h1: '메이크업 실기 준비물, 빠뜨리면 실격입니다',
    description: '미용사(메이크업) 실기 준비물 전체 목록입니다. 위생 필수 지참물과 반입 금지 품목, 25~45만원인 비용 줄이는 법까지.',
    cta: '준비물 리스트 받아보기',
    keywords: ['메이크업 실기 준비물', '메이크업 자격증 준비물', '메이크업 학원 준비물'],
    priority: 0.7,
  },
  {
    path: '/license/schedule/', parent: '/license/', section: '자격증', grade: 'C', volume: 80, nav: '일정·합격률',
    title: '메이크업 자격증 시험일정·합격률·취득기간 2026',
    h1: '메이크업 자격증, 신청부터 취득까지 몇 달 걸릴까요?',
    description: '미용사(메이크업)는 상시 시행이라 연중 응시가 가능합니다. 접수부터 취득까지 소요 기간과 재응시 간격을 정리했습니다.',
    cta: '내 일정에 맞는 개강반 찾기',
    keywords: ['메이크업 자격증 시험일정', '메이크업 자격증 합격률', '메이크업 자격증 취득기간', '메이크업 자격증 난이도'],
    priority: 0.72,
  },
  {
    path: '/license/private/', parent: '/license/', section: '자격증', grade: 'C', volume: 150, nav: '민간자격증',
    title: '메이크업 민간자격증 종류 | 강사·지도사 자격 실효성',
    h1: '메이크업 민간자격증, 따도 쓸모 있나요?',
    description: '메이크업 민간자격증은 등록 여부부터 확인해야 합니다. 강사·지도사 자격이 실제로 인정받는 경우를 구분해 정리했습니다.',
    cta: '필요한 자격증만 골라 상담받기',
    keywords: ['메이크업 민간자격증', '메이크업 강사 자격증', '메이크업 지도사 자격증', '메이크업 자격증 종류'],
    priority: 0.72,
  },
  {
    path: '/license/personal-color/', parent: '/license/', section: '자격증', grade: 'B', volume: 1150, nav: '퍼스널컬러 자격증',
    title: '퍼스널컬러 자격증 총정리 | 급수·비용·활용처 2026',
    h1: '퍼스널컬러 자격증, 어디까지 쓸 수 있나요?',
    description: '퍼스널컬러 자격증은 전부 민간자격입니다. 기관별 급수와 15~80만원 취득 비용, 실제 활용처를 정리했습니다.',
    cta: '퍼스널컬러 과정 상담 신청',
    keywords: ['퍼스널컬러 자격증', '퍼스널컬러 학원', '퍼스널컬러 강사 과정', '퍼스널컬러 컨설턴트'],
    priority: 0.9,
  },
  {
    path: '/license/face-painting/', parent: '/license/', section: '자격증', grade: 'C', volume: 90, nav: '페이스페인팅',
    title: '페이스페인팅 자격증 | 취득 과정과 활동 분야',
    h1: '페이스페인팅 자격증, 어디에 쓰이나요?',
    description: '페이스페인팅 자격증은 축제·키즈카페 출강과 특수분장 입문에 쓰입니다. 취득 과정과 비용, 확장 경로를 정리했습니다.',
    cta: '페이스페인팅 과정 문의하기',
    keywords: ['페이스페인팅 자격증', '페이스페인팅 학원', '바디페인팅 학원'],
    priority: 0.68,
  },
  {
    path: '/license/self-study/', parent: '/license/', section: '자격증', grade: 'C', volume: 50, nav: '독학 가능성',
    title: '메이크업 자격증 독학 가능할까 | 실기 합격률로 본 현실',
    h1: '메이크업 자격증 독학, 실기에서 갈립니다',
    description: '메이크업 자격증 필기는 독학이 되지만 실기는 다릅니다. 모델 확보와 위생 감점 등 독학이 막히는 지점을 정리했습니다.',
    cta: '실기만 단기로 배우기 문의',
    keywords: ['메이크업 자격증 독학', '메이크업 독학', '메이크업 자격증반'],
    priority: 0.68,
  },
  {
    path: '/license/beauty-license/', parent: '/license/', section: '자격증', grade: 'A', volume: 2360, nav: '미용사 면허증',
    title: '미용사 면허증 발급 방법 | 종합미용면허 취득 순서',
    h1: '미용사 면허증, 자격증 딴 다음 이렇게 발급받습니다',
    description: '미용사 면허증은 자격증 취득 후 시·군·구청에 따로 신청해야 나옵니다. 필요 서류와 종합미용면허 순서를 정리했습니다.',
    cta: '면허 취득 순서 상담받기',
    keywords: ['미용사 면허증', '미용사면허증 발급', '종합미용면허증', '미용사 자격증', '미용 국가자격증'],
    priority: 0.9,
  },

  // ══════════════════════════════════════════════════════════
  // ④ 전문 분야
  // ══════════════════════════════════════════════════════════
  {
    path: '/field/', parent: '/', section: '분야', grade: 'B', volume: 300, nav: '분야',
    title: '메이크업 전문 분야 10가지 | 배울 분야 고르는 법',
    h1: '메이크업, 어떤 분야로 갈지부터 정하세요',
    description: '메이크업은 웨딩·방송·특수분장·반영구·속눈썹 등으로 갈립니다. 분야별 기간, 교육비, 근무 형태를 한 표로 비교했습니다.',
    cta: '내게 맞는 분야 진단받기',
    keywords: ['메이크업 분야', '뷰티학원', '메이크업 전문가 학원', '메이크업 종류'],
    priority: 0.85,
  },
  {
    path: '/field/semi-permanent/', parent: '/field/', section: '분야', grade: 'S', volume: 2320, nav: '반영구·눈썹문신',
    title: '반영구 학원 총정리 | 눈썹문신 배우기 수강료·자격증',
    h1: '반영구 학원, 눈썹문신 배우려면 얼마나 걸리나요?',
    description: '반영구 학원 과정은 4~12주, 수강료 150~450만원입니다. 눈썹·아이라인 커리큘럼과 창업 초기 비용을 정리했습니다.',
    cta: '반영구 과정 커리큘럼·수강료 받기',
    keywords: ['반영구 학원', '눈썹문신 배우기', '눈썹문신 자격증', '반영구 자격증 학원', '반영구화장 학원'],
    priority: 0.95,
  },
  {
    path: '/field/sfx/', parent: '/field/', section: '분야', grade: 'B', volume: 480, nav: '특수분장',
    title: '특수분장 학원 | 배우는 과정·수강료·취업처',
    h1: '특수분장 학원, 어디까지 배우고 어디로 취업하나요?',
    description: '특수분장 학원에서는 상처·노인분장부터 실리콘 조형까지 배웁니다. 3~9개월 커리큘럼과 실제 취업처를 정리했습니다.',
    cta: '특수분장 과정 상담 신청',
    keywords: ['특수분장 학원', '특수분장 배우기', '특수분장 취업', '무대분장 학원'],
    priority: 0.85,
  },
  {
    path: '/field/wedding/', parent: '/field/', section: '분야', grade: 'C', volume: 60, nav: '웨딩메이크업',
    title: '웨딩메이크업 배우기 | 웨딩샵 취업까지 로드맵',
    h1: '웨딩메이크업, 배워서 웨딩샵 들어가려면',
    description: '웨딩메이크업은 자격증보다 포트폴리오와 스텝 경력이 먼저입니다. 웨딩샵 입사 조건과 초봉, 연차를 정리했습니다.',
    cta: '웨딩 과정 + 취업 연계 문의',
    keywords: ['웨딩메이크업 학원', '웨딩메이크업 배우기', '웨딩샵 취업', '메이크업 스텝'],
    priority: 0.7,
  },
  {
    path: '/field/broadcast/', parent: '/field/', section: '분야', grade: 'C', volume: 20, nav: '방송메이크업',
    title: '방송 메이크업 학원 | 연예인·방송국 현장 입문',
    h1: '방송 메이크업, 어떻게 시작하나요?',
    description: '방송 메이크업은 조명·카메라 기준의 별도 기술입니다. HD 메이크업 커리큘럼과 현장에 들어가는 경로를 정리했습니다.',
    cta: '미디어 메이크업 과정 문의',
    keywords: ['방송 메이크업 학원', '연예인 메이크업', '미디어 메이크업', '메이크업 스텝'],
    priority: 0.65,
  },
  {
    path: '/field/stage/', parent: '/field/', section: '분야', grade: 'C', volume: 40, nav: '무대·바디페인팅',
    title: '무대분장·바디페인팅 학원 | 공연 메이크업 입문',
    h1: '무대분장과 바디페인팅, 어디서 배우나요?',
    description: '무대분장은 조명을 계산한 과장 표현, 바디페인팅은 대면적 채색입니다. 두 과정의 기간·수강료·활동 경로를 정리했습니다.',
    cta: '무대·바디페인팅 과정 상담',
    keywords: ['무대분장 학원', '바디페인팅 학원', '특수분장 학원', '페이스페인팅'],
    priority: 0.65,
  },
  {
    path: '/field/eyelash/', parent: '/field/', section: '분야', grade: 'B', volume: 1260, nav: '속눈썹',
    title: '속눈썹 연장·펌 학원 | 수강료·자격증·창업까지',
    h1: '속눈썹 연장, 배워서 바로 일할 수 있나요?',
    description: '속눈썹 연장은 2~6주면 실전 투입이 가능합니다. 수강료 80~250만원, 자격증, 1인숍 창업 비용까지 정리했습니다.',
    cta: '속눈썹 과정 수강료 받아보기',
    keywords: ['속눈썹 학원', '속눈썹 연장 학원', '속눈썹펌 자격증', '속눈썹 자격증'],
    priority: 0.88,
  },
  {
    path: '/field/waxing/', parent: '/field/', section: '분야', grade: 'B', volume: 1010, nav: '왁싱',
    title: '왁싱 학원 총정리 | 왁싱 자격증·수강료·창업 비용',
    h1: '왁싱 학원, 얼마나 배우면 실전에 나가나요?',
    description: '왁싱 학원 과정은 2~8주, 수강료 80~300만원입니다. 브라질리언 포함 여부와 1인숍 창업 비용을 정리했습니다.',
    cta: '왁싱 과정 상담 신청하기',
    keywords: ['왁싱 학원', '왁싱 자격증', '브라질리언 왁싱 학원', '왁싱 창업'],
    priority: 0.85,
  },
  {
    path: '/field/skincare/', parent: '/field/', section: '분야', grade: 'A', volume: 6960, nav: '피부관리',
    title: '피부관리 학원·피부미용사 자격증 | 과정과 비용 총정리',
    h1: '피부관리 배우려면 학원부터? 자격증부터?',
    description: '피부관리는 국가기술자격 미용사(피부)가 사실상 필수입니다. 학원 과정과 수강료, 에스테틱 취업 경로를 정리했습니다.',
    cta: '피부 과정 + 자격증 상담받기',
    keywords: ['피부관리 학원', '피부미용사 자격증', '피부미용학원', '피부관리사 자격증', '피부미용 필기'],
    priority: 0.9,
  },
  {
    path: '/field/personal-color/', parent: '/field/', section: '분야', grade: 'C', volume: 60, nav: '퍼스널컬러',
    title: '퍼스널컬러 학원·강사 과정 | 컨설턴트로 일하려면',
    h1: '퍼스널컬러 컨설턴트, 이렇게 시작합니다',
    description: '퍼스널컬러 학원은 진단 이론·드레이핑·상담 순으로 배웁니다. 컨설턴트와 강사 과정 차이, 실제 수입을 정리했습니다.',
    cta: '퍼스널컬러 과정 문의하기',
    keywords: ['퍼스널컬러 학원', '퍼스널컬러 강사 과정', '퍼스널컬러 자격증', '퍼스널컬러 컨설턴트'],
    priority: 0.7,
  },
  {
    path: '/field/creator/', parent: '/field/', section: '분야', grade: 'C', volume: 20, nav: '뷰티크리에이터',
    title: '뷰티크리에이터 학원 | 촬영·편집까지 배우는 과정',
    h1: '뷰티크리에이터, 메이크업만 잘하면 될까요?',
    description: '뷰티크리에이터는 메이크업에 촬영·편집·기획을 더한 형태입니다. 배우는 범위와 수익화까지 걸리는 기간을 정리했습니다.',
    cta: '크리에이터 과정 상담 신청',
    keywords: ['뷰티크리에이터 학원', '뷰티 유튜버 학원', '메이크업 콘텐츠'],
    priority: 0.62,
  },
  {
    path: '/field/hair-makeup/', parent: '/field/', section: '분야', grade: 'C', volume: 580, nav: '헤어+메이크업',
    title: '헤어 메이크업 학원 | 헤어까지 같이 배워야 할까',
    h1: '메이크업만? 헤어까지? 현장이 원하는 조합',
    description: '웨딩·방송은 헤어와 메이크업을 함께 하는 인력을 원합니다. 병행 과정의 기간·수강료와 취업 폭 차이를 정리했습니다.',
    cta: '헤어+메이크업 병행 과정 문의',
    keywords: ['헤어 메이크업 학원', '헤어미용학원', '종합미용면허증', '미용학원'],
    priority: 0.75,
  },

  // ══════════════════════════════════════════════════════════
  // ⑤ 국비지원
  // ══════════════════════════════════════════════════════════
  {
    path: '/funding/', parent: '/', section: '국비지원', grade: 'B', volume: 1330, nav: '국비지원',
    title: '국비지원 메이크업학원 | 자부담 20%로 배우는 법 2026',
    h1: '국비지원으로 메이크업학원 다닐 수 있나요?',
    description: '국비지원 메이크업학원은 고용노동부 지정 기관만 가능합니다. 지원 대상과 자부담 비율, 지정 학원 확인법을 정리했습니다.',
    cta: '국비 대상 여부 무료 확인하기',
    keywords: ['국비지원 메이크업학원', '메이크업 국비지원', '국비지원 미용학원', '국비 미용학원'],
    priority: 0.9,
  },
  {
    path: '/funding/hrd-card/', parent: '/funding/', section: '국비지원', grade: 'A', volume: 60, nav: '내일배움카드',
    title: '내일배움카드 메이크업 과정 | 신청 방법·한도·사용처',
    h1: '내일배움카드로 메이크업 배우기, 신청부터 등록까지',
    description: '국민내일배움카드는 5년간 300~500만원 한도로 발급됩니다. HRD-Net 신청 절차와 소요 기간, 제외 대상을 정리했습니다.',
    cta: '내일배움카드 사용 가능 과정 찾기',
    keywords: ['내일배움카드 메이크업', '국민내일배움카드 미용학원', '내일배움카드 신청', '내일배움카드 사용처'],
    priority: 0.88,
  },
  {
    path: '/funding/allowance/', parent: '/funding/', section: '국비지원', grade: 'C', volume: 60, nav: '훈련장려금·자부담',
    title: '훈련장려금·자부담금 | 국비 메이크업 과정 실제 부담액',
    h1: '국비 메이크업 과정, 실제로 내 돈은 얼마 드나요?',
    description: '국비 과정 자부담률은 훈련 유형에 따라 0~45%입니다. 훈련장려금 지급 조건과 재료비가 제외되는 이유를 정리했습니다.',
    cta: '내 자부담액 계산 상담받기',
    keywords: ['메이크업 훈련장려금', '메이크업 국비지원 자부담', '메이크업 학원 지원금', '훈련장려금'],
    priority: 0.7,
  },
  {
    path: '/funding/credit-bank/', parent: '/funding/', section: '국비지원', grade: 'C', volume: 40, nav: '학점은행제',
    title: '메이크업 학점은행제·평생교육원 | 학위까지 가는 길',
    h1: '메이크업으로 학위까지 받으려면 학점은행제',
    description: '학점은행제로 미용 전공 전문학사·학사를 취득할 수 있습니다. 필요 학점과 기간, 자격증 학점 인정을 정리했습니다.',
    cta: '학점은행제 과정 안내받기',
    keywords: ['메이크업 학점은행제', '메이크업 평생교육원', '학점은행제 미용학', '종합미용면허증 학점은행제'],
    priority: 0.7,
  },
  {
    path: '/funding/free-edu/', parent: '/funding/', section: '국비지원', grade: 'C', volume: 40, nav: '무료교육 조건',
    title: '무료 메이크업 교육 | 국비지원 자격 조건 체크리스트',
    h1: '메이크업 교육, 정말 무료로 들을 수 있나요?',
    description: '무료로 보이는 메이크업 교육에도 재료비·응시료는 남습니다. 자부담 0%가 되는 조건과 확인할 항목을 정리했습니다.',
    cta: '무료 대상 여부 확인 요청',
    keywords: ['메이크업 학원 국비지원 조건', '무료 교육', '메이크업 훈련수당', '국민취업지원제도'],
    priority: 0.68,
  },

  // ══════════════════════════════════════════════════════════
  // ⑥ 지역
  // ══════════════════════════════════════════════════════════
  {
    path: '/region/', parent: '/', section: '지역', grade: 'B', volume: 2520, nav: '지역별 학원',
    title: '지역별 메이크업학원 | 전국 17개 지역 수강료 비교',
    h1: '우리 동네 메이크업학원, 수강료는 얼마일까요?',
    description: '메이크업학원 수강료는 지역에 따라 최대 40% 차이 납니다. 전국 17개 지역의 시세와 상권 특징을 비교했습니다.',
    cta: '우리 지역 학원 견적 받기',
    keywords: ['지역별 메이크업학원', '메이크업학원', '미용학원', '메이크업 배우기'],
    priority: 0.88,
  },
  {
    path: '/region/gangnam/', parent: '/region/', section: '지역', grade: 'B', volume: 700, nav: '강남',
    title: '강남 메이크업학원 | 수강료·통학·취업 연계 총정리',
    h1: '강남 메이크업학원, 비싼 만큼 값어치 할까요?',
    description: '강남 메이크업학원은 전국 평균보다 15~30% 비쌉니다. 강남·논현·신사 상권 시세와 취업 연계 이점을 정리했습니다.',
    cta: '강남권 학원 견적 비교하기',
    keywords: ['강남 메이크업학원', '강남 미용학원', '논현 메이크업학원', '신사동 메이크업학원'],
    priority: 0.85,
  },
  {
    path: '/region/seoul/', parent: '/region/', section: '지역', grade: 'C', volume: 320, nav: '서울(그 외)',
    title: '서울 메이크업학원 | 홍대·신촌·건대·노원 상권 비교',
    h1: '서울 메이크업학원, 어느 상권으로 갈까요?',
    description: '서울 메이크업학원은 홍대·신촌·건대·노원에 몰려 있습니다. 상권별 수강료와 주말·야간반 개설 빈도를 비교했습니다.',
    cta: '서울권 학원 3곳 추천받기',
    keywords: ['서울 메이크업학원', '홍대 메이크업학원', '신촌 메이크업학원', '건대 메이크업학원', '노원 메이크업학원'],
    priority: 0.82,
  },
  {
    path: '/region/suwon/', parent: '/region/', section: '지역', grade: 'B', volume: 200, nav: '수원',
    title: '수원 메이크업학원 | 경기 남부 수강료·통학 정리',
    h1: '수원 메이크업학원, 서울까지 안 가도 될까요?',
    description: '수원 메이크업학원은 서울보다 10~20% 저렴합니다. 수원·용인·화성 통학권 시세와 서울 원정과의 차이를 비교했습니다.',
    cta: '수원권 학원 수강료 받아보기',
    keywords: ['수원 메이크업학원', '수원 미용학원', '경기 메이크업학원', '용인 메이크업학원'],
    priority: 0.8,
  },
  {
    path: '/region/bundang/', parent: '/region/', section: '지역', grade: 'B', volume: 100, nav: '분당·성남',
    title: '분당 메이크업학원 | 성남·판교 수강료와 주말반',
    h1: '분당 메이크업학원, 직장인 주말반이 강합니다',
    description: '분당 메이크업학원은 판교 직장인 수요로 주말·야간반이 많습니다. 성남·판교 상권 시세와 개강 주기를 정리했습니다.',
    cta: '분당권 주말반 일정 받기',
    keywords: ['분당 메이크업학원', '성남 메이크업학원', '판교 메이크업학원', '경기 메이크업학원'],
    priority: 0.75,
  },
  {
    path: '/region/ilsan/', parent: '/region/', section: '지역', grade: 'B', volume: 180, nav: '일산·고양',
    title: '일산 메이크업학원 | 고양·파주 수강료·국비 과정',
    h1: '일산 메이크업학원, 국비 과정이 잘 열립니다',
    description: '일산 메이크업학원은 국비지원 지정 기관 비율이 높은 편입니다. 고양·파주 통학권 시세와 개설 주기를 정리했습니다.',
    cta: '일산권 국비 과정 확인하기',
    keywords: ['일산 메이크업학원', '고양 메이크업학원', '일산 미용학원', '파주 메이크업학원'],
    priority: 0.75,
  },
  {
    path: '/region/bucheon/', parent: '/region/', section: '지역', grade: 'C', volume: 60, nav: '부천',
    title: '부천 메이크업학원 | 광명·시흥 통학권 수강료',
    h1: '부천 메이크업학원, 서울 서남권에서 가장 가깝습니다',
    description: '부천 메이크업학원은 서울 서남권과 인천 사이 통학 요지입니다. 광명·시흥 통학권 시세와 선택 기준을 정리했습니다.',
    cta: '부천권 학원 견적 요청하기',
    keywords: ['부천 메이크업학원', '광명 메이크업학원', '시흥 메이크업학원', '경기 미용학원'],
    priority: 0.72,
  },
  {
    path: '/region/incheon/', parent: '/region/', section: '지역', grade: 'B', volume: 1150, nav: '인천',
    title: '인천 메이크업학원 | 부평·구월 수강료와 국비 과정',
    h1: '인천 메이크업학원, 부평이냐 구월이냐',
    description: '인천 메이크업학원은 부평과 구월동 두 축입니다. 상권별 시세와 국비 과정, 서울 통학 대비 실익을 비교했습니다.',
    cta: '인천권 학원 수강료 비교하기',
    keywords: ['인천 메이크업학원', '인천 미용학원', '부평 미용학원', '구월동 메이크업학원'],
    priority: 0.85,
  },
  {
    path: '/region/daejeon/', parent: '/region/', section: '지역', grade: 'B', volume: 930, nav: '대전',
    title: '대전 메이크업학원 | 둔산·은행동 학원과 수강료',
    h1: '대전 메이크업학원, 충청권에서 선택지가 가장 넓습니다',
    description: '대전 메이크업학원은 둔산·은행동 중심이고 원데이 수요가 많습니다. 지역 시세와 세종·청주 통학권을 정리했습니다.',
    cta: '대전권 학원 일정 받기',
    keywords: ['대전 메이크업학원', '둔산 메이크업학원', '대전 미용학원', '세종 메이크업학원'],
    priority: 0.82,
  },
  {
    path: '/region/cheonan/', parent: '/region/', section: '지역', grade: 'A', volume: 2190, nav: '천안',
    title: '천안 메이크업학원 | 아산·평택 통학권 수강료 비교',
    h1: '천안 메이크업학원, 충남에서 여기가 중심입니다',
    description: '천안은 충남권 미용학원이 가장 밀집한 지역입니다. 아산·평택 통학권 시세와 국비 과정 개설 현황을 정리했습니다.',
    cta: '천안권 학원 견적 받아보기',
    keywords: ['천안 메이크업학원', '천안 미용학원', '아산 메이크업학원', '충남 메이크업학원'],
    priority: 0.85,
  },
  {
    path: '/region/cheongju/', parent: '/region/', section: '지역', grade: 'C', volume: 70, nav: '청주',
    title: '청주 메이크업학원 | 충북 수강료와 개강 주기',
    h1: '청주 메이크업학원, 개강 주기부터 확인하세요',
    description: '청주 메이크업학원은 수가 적어 개강 주기가 수강 시점을 좌우합니다. 지역 시세와 대전권 통학 비교를 정리했습니다.',
    cta: '청주권 개강 일정 문의하기',
    keywords: ['청주 메이크업학원', '충북 메이크업학원', '청주 미용학원'],
    priority: 0.7,
  },
  {
    path: '/region/daegu/', parent: '/region/', section: '지역', grade: 'B', volume: 370, nav: '대구',
    title: '대구 메이크업학원 | 동성로·수성구 수강료 비교',
    h1: '대구 메이크업학원, 지방에서 검색량 1위인 이유',
    description: '대구는 지역 메이크업학원 검색량 1위입니다. 동성로·수성구 상권 시세와 자격증반 개강 주기를 정리했습니다.',
    cta: '대구권 학원 수강료 받기',
    keywords: ['대구 메이크업학원', '대구 미용학원', '동성로 메이크업학원', '경북 메이크업학원'],
    priority: 0.85,
  },
  {
    path: '/region/busan/', parent: '/region/', section: '지역', grade: 'B', volume: 280, nav: '부산',
    title: '부산 메이크업학원 | 서면·해운대 수강료와 취업',
    h1: '부산 메이크업학원, 서면이 기준입니다',
    description: '부산 메이크업학원은 서면을 축으로 해운대까지 퍼져 있습니다. 상권별 시세와 김해·양산 통학권을 정리했습니다.',
    cta: '부산권 학원 견적 비교하기',
    keywords: ['부산 메이크업학원', '부산 미용학원', '서면 메이크업학원', '해운대 메이크업학원'],
    priority: 0.82,
  },
  {
    path: '/region/gwangju/', parent: '/region/', section: '지역', grade: 'B', volume: 220, nav: '광주',
    title: '광주 메이크업학원 | 상무지구·충장로 수강료',
    h1: '광주 메이크업학원, 호남권 수요가 모이는 곳',
    description: '광주 메이크업학원은 상무지구와 충장로에 집중돼 있습니다. 지역 시세와 국비 과정, 전남권 수요를 정리했습니다.',
    cta: '광주권 학원 수강료 받기',
    keywords: ['광주 메이크업학원', '광주 미용학원', '전남 메이크업학원', '상무지구 메이크업학원'],
    priority: 0.8,
  },
  {
    path: '/region/ulsan/', parent: '/region/', section: '지역', grade: 'C', volume: 90, nav: '울산',
    title: '울산 메이크업학원 | 삼산동 수강료와 통학권',
    h1: '울산 메이크업학원, 삼산동에 몰려 있습니다',
    description: '울산 메이크업학원은 삼산동에 몰려 있고 수가 적습니다. 지역 시세와 개강 주기, 부산 통학과의 손익을 비교했습니다.',
    cta: '울산권 개강 일정 문의',
    keywords: ['울산 메이크업학원', '울산 미용학원', '삼산동 메이크업학원'],
    priority: 0.72,
  },
  {
    path: '/region/changwon/', parent: '/region/', section: '지역', grade: 'C', volume: 70, nav: '창원',
    title: '창원 메이크업학원 | 상남동 수강료·경남 통학권',
    h1: '창원 메이크업학원, 경남에서 여기가 중심입니다',
    description: '창원 메이크업학원은 상남동을 축으로 마산·진해 수요를 받습니다. 지역 시세와 부산 통학 대비 실익을 정리했습니다.',
    cta: '창원권 학원 견적 요청',
    keywords: ['창원 메이크업학원', '경남 메이크업학원', '마산 메이크업학원', '김해 미용학원'],
    priority: 0.72,
  },
  {
    path: '/region/jeonju/', parent: '/region/', section: '지역', grade: 'C', volume: 100, nav: '전주',
    title: '전주 메이크업학원 | 객사·신시가지 수강료',
    h1: '전주 메이크업학원, 전북권 수요를 다 받습니다',
    description: '전주 메이크업학원은 객사와 신시가지 두 축입니다. 지역 시세와 국비 과정, 익산·군산 통학권을 정리했습니다.',
    cta: '전주권 학원 수강료 받기',
    keywords: ['전주 메이크업학원', '전북 메이크업학원', '전주 미용학원', '익산 메이크업학원'],
    priority: 0.72,
  },
  {
    path: '/region/jeju/', parent: '/region/', section: '지역', grade: 'C', volume: 40, nav: '제주',
    title: '제주 메이크업학원 | 제주시 수강료와 개강 현실',
    h1: '제주 메이크업학원, 개강까지 기다려야 할 수 있습니다',
    description: '제주 메이크업학원은 수가 적어 개강 대기가 길 수 있습니다. 지역 시세와 단기 집중·육지 원정 수강을 비교했습니다.',
    cta: '제주권 개강 일정 확인하기',
    keywords: ['제주 메이크업학원', '제주 미용학원', '제주시 메이크업학원'],
    priority: 0.68,
  },

  // ══════════════════════════════════════════════════════════
  // ⑦ 진로 · 취업
  // ══════════════════════════════════════════════════════════
  {
    path: '/career/', parent: '/', section: '진로', grade: 'C', volume: 2450, nav: '진로',
    title: '메이크업아티스트 되는 법 | 학원부터 현장까지 5단계',
    h1: '메이크업아티스트, 이 순서대로 되면 됩니다',
    description: '메이크업아티스트는 학원·자격증·포트폴리오·스텝·독립 5단계를 거칩니다. 단계별 기간과 비용을 정리했습니다.',
    cta: '내 상황에 맞는 진입 경로 상담',
    keywords: ['메이크업아티스트', '메이크업아티스트 되는법', '메이크업 취업', '메이크업 진로'],
    priority: 0.82,
  },
  {
    path: '/career/salary/', parent: '/career/', section: '진로', grade: 'C', volume: 270, nav: '연봉',
    title: '메이크업아티스트 연봉·초봉 | 분야별 실수령 현실',
    h1: '메이크업아티스트 연봉, 솔직하게 말하면',
    description: '메이크업아티스트 초봉은 스텝 기준 월 180~220만원입니다. 분야별 수입 구조와 연차별 차이를 정리했습니다.',
    cta: '분야별 수입 구조 상담받기',
    keywords: ['메이크업아티스트 연봉', '메이크업아티스트 초봉', '메이크업 월급', '메이크업아티스트 수입'],
    priority: 0.75,
  },
  {
    path: '/career/outlook/', parent: '/career/', section: '진로', grade: 'C', volume: 40, nav: '전망·현실',
    title: '메이크업아티스트 전망·현실 | 그만두는 이유 5가지',
    h1: '메이크업아티스트 현실, 알고 시작해야 버팁니다',
    description: '메이크업아티스트가 초기에 그만두는 이유는 다섯 가지로 모입니다. 각각의 완화법과 전환 경로를 정리했습니다.',
    cta: '현실 상담 요청하기',
    keywords: ['메이크업아티스트 현실', '메이크업아티스트 전망', '메이크업 진로', '뷰티 직업 전망'],
    priority: 0.68,
  },
  {
    path: '/career/jobs/', parent: '/career/', section: '진로', grade: 'C', volume: 130, nav: '취업',
    title: '메이크업샵 취업 | 이력서·포트폴리오·취업연계반',
    h1: '메이크업샵 취업, 학원이 연결해주나요?',
    description: '메이크업샵 취업은 자격증보다 포트폴리오가 먼저 평가됩니다. 이력서 구성법과 취업연계반 확인 항목을 정리했습니다.',
    cta: '취업연계 과정 상담 신청',
    keywords: ['메이크업샵 취업', '메이크업 취업', '메이크업 취업반', '메이크업 학원 취업연계', '메이크업 학원 취업률'],
    priority: 0.75,
  },
  {
    path: '/career/freelance/', parent: '/career/', section: '진로', grade: 'C', volume: 60, nav: '프리랜서',
    title: '메이크업 프리랜서·스텝 | 수입 구조와 독립 시점',
    h1: '메이크업 프리랜서, 언제 독립하면 될까요?',
    description: '메이크업 프리랜서 전환의 기준은 실력이 아니라 고정 거래처입니다. 독립 전 갖출 조건과 수입 구조를 정리했습니다.',
    cta: '독립 준비 상담받기',
    keywords: ['메이크업 프리랜서', '메이크업 스텝', '메이크업 독립', '메이크업 창업'],
    priority: 0.7,
  },

  // ══════════════════════════════════════════════════════════
  // ⑧ 학과 · 진학
  // ══════════════════════════════════════════════════════════
  {
    path: '/major/', parent: '/', section: '학과', grade: 'A', volume: 1550, nav: '메이크업학과',
    title: '메이크업학과·뷰티학과 | 대학 진학 vs 학원, 뭐가 나을까',
    h1: '메이크업학과 갈까, 학원 다닐까?',
    description: '메이크업학과 진학과 학원은 비용·기간·취업에서 결과가 다릅니다. 총비용과 학력이 실제로 필요한 경우를 비교했습니다.',
    cta: '진학 vs 학원 진단받기',
    keywords: ['메이크업학과', '뷰티학과', '메이크업아티스트 학과', '메이크업디자인학과', '미용학과'],
    priority: 0.85,
  },
  {
    path: '/major/cosmetic/', parent: '/major/', section: '학과', grade: 'C', volume: 1060, nav: '화장품학과',
    title: '화장품학과 총정리 | 실기 없이 가는 뷰티 전공',
    h1: '화장품학과, 실기 없이 뷰티 전공하는 길',
    description: '화장품학과는 실기 없이 학생부·수능으로 지원하는 뷰티 전공입니다. 유사 학과 차이와 졸업 후 진로를 정리했습니다.',
    cta: '화장품학과 진학 상담받기',
    keywords: ['화장품학과', '향장학과', '화장품과학과', '뷰티학과', '화장품 연구원'],
    priority: 0.75,
  },
];

// ── 조회 헬퍼 ────────────────────────────────────────────────

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]));

export function findPage(path: string): PageDef | undefined {
  return BY_PATH.get(path);
}

export function getPage(path: string): PageDef {
  const p = BY_PATH.get(path);
  if (!p) throw new Error(`[site] 레지스트리에 없는 경로: ${path}`);
  return p;
}

export function childrenOf(path: string): PageDef[] {
  return PAGES.filter((p) => p.parent === path);
}

export function sectionPages(section: Section): PageDef[] {
  return PAGES.filter((p) => p.section === section && p.path !== '/');
}

/** 브레드크럼 체인 (홈 → … → 현재) */
export function breadcrumbChain(path: string): PageDef[] {
  const chain: PageDef[] = [];
  let cur: PageDef | undefined = getPage(path);
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent ? getPage(cur.parent) : undefined;
  }
  return chain;
}

export function absUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** '/class/one-day/' → ['class','one-day'] (catch-all 라우트 파라미터) */
export function pathToSlug(path: string): string[] {
  return path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
}

/** ['class','one-day'] → '/class/one-day/' */
export function slugToPath(slug: string[]): string {
  return `/${slug.join('/')}/`;
}

export type NavNode = { label: string; path: string; children: { label: string; path: string }[] };

/** 헤더/모바일 드로어 공용 네비 트리 — 홈의 직속 자식이 1차 메뉴 */
export const NAV_TREE: NavNode[] = childrenOf('/').map((p) => ({
  label: p.nav,
  path: p.path,
  children: childrenOf(p.path).map((c) => ({ label: c.nav, path: c.path })),
}));

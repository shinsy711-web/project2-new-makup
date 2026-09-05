// 폼 옵션 · 공통 수치 — 수정은 이 파일만 건드린다.

export const REGIONS = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종',
  '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
] as const;

/** 사이트 전역에서 재사용하는 수강료 기준표 (2026-09 전국 평균 범위) */
export const COURSE_COSTS = [
  { name: '원데이클래스', period: '1일 (2~4시간)', tuition: '3~15만원', material: '재료 제공', target: '셀프 메이크업 · 체험' },
  { name: '취미반', period: '4~8주', tuition: '월 12~25만원', material: '5~15만원', target: '내 얼굴 화장 · 데일리' },
  { name: '자격증반', period: '3~6개월', tuition: '90~180만원', material: '25~45만원', target: '미용사(메이크업) 취득' },
  { name: '전문가 · 취업반', period: '6~12개월', tuition: '250~400만원', material: '40~80만원', target: '웨딩 · 미디어 취업' },
  { name: '반영구 과정', period: '4~12주', tuition: '150~450만원', material: '기기·재료 별도', target: '눈썹문신 · 창업' },
  { name: '속눈썹 과정', period: '2~6주', tuition: '80~250만원', material: '20~50만원', target: '연장 · 펌 실무' },
] as const;

/** 자격증 응시료 등 고정 수치 (한국산업인력공단 국가기술자격 기준) */
export const EXAM_FEES = {
  written: '14,500원',
  practical: '26,900원',
  licenseIssue: '5,000원 내외 (지자체별 상이)',
} as const;

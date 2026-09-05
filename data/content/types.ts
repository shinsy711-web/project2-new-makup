import type { Block } from '@/components/Blocks';
import type { FaqItem } from '@/components/FaqSection';

export type { Block, FaqItem };

export type PageContent = {
  /** 레지스트리 path 와 1:1 대응 */
  path: string;
  /** 히어로 요약 — 생략 시 레지스트리 description 사용 */
  lead?: string;
  /** 히어로 칩 (핵심 수치·요약) */
  chips?: string[];
  /** 상단 폼에 기본 선택될 희망 지역 */
  region?: string;
  blocks: Block[];
  faq: FaqItem[];
  /** 하단 관련 링크 */
  related: string[];
};

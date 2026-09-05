import type { PageContent } from './types';
import { COST_CONTENT } from './cost';
import { CLASS_CONTENT } from './class';
import { LICENSE_CONTENT } from './license';
import { FIELD_CONTENT } from './field';
import { FUNDING_CONTENT } from './funding';
import { REGION_CONTENT } from './region';
import { CAREER_CONTENT } from './career';

export type { PageContent };

/** 홈(/)을 제외한 모든 레지스트리 페이지의 본문 */
export const ALL_CONTENT: PageContent[] = [
  ...COST_CONTENT,
  ...CLASS_CONTENT,
  ...LICENSE_CONTENT,
  ...FIELD_CONTENT,
  ...FUNDING_CONTENT,
  ...REGION_CONTENT,
  ...CAREER_CONTENT,
];

const BY_PATH = new Map(ALL_CONTENT.map((c) => [c.path, c]));

export function getContent(path: string): PageContent | undefined {
  return BY_PATH.get(path);
}

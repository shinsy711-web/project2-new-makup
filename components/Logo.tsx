import { SITE_NAME } from '@/lib/site';

type Props = {
  /** 마크 한 변 크기(px) */
  size?: number;
  /** 워드마크 노출 여부 — false 면 마크만 (모바일·파비콘 대체용) */
  withText?: boolean;
  /** 어두운 배경 위에 올릴 때 (푸터) */
  onDark?: boolean;
};

/**
 * 사이트 로고.
 *
 * 마크는 인라인 SVG — 어느 크기에서도 선명하고, 파일 요청이 없어 헤더가 즉시 그려진다.
 * 워드마크는 SVG 패스가 아니라 HTML 텍스트로 둔다. 한글을 패스로 만들면 글자가 깨지거나
 * 폰트 로딩 전후로 모양이 달라지기 때문.
 *
 * 도형: 라운드 스퀘어(브랜드 그라디언트) + 메이크업 브러시.
 * 16~24px 로 줄여도 브러시 실루엣이 남도록 획을 굵게 잡았다.
 */
export default function Logo({ size = 34, withText = true, onDark = false }: Props) {
  const gid = 'logo-grad';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        role="img"
        aria-label={SITE_NAME}
        style={{ flexShrink: 0, display: 'block' }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C24C76" />
            <stop offset="1" stopColor="#7F2748" />
          </linearGradient>
        </defs>

        {/* 배경 라운드 스퀘어 */}
        <rect width="40" height="40" rx="11" fill={`url(#${gid})`} />

        {/* 브러시 손잡이 — 좌하단에서 우상단으로 */}
        <path
          d="M11 29.5 L21.5 19"
          stroke="white"
          strokeWidth="3.4"
          strokeLinecap="round"
          opacity="0.95"
        />
        {/* 페룰(금속 밴드) */}
        <path
          d="M20.6 18.1 L24.4 21.9"
          stroke="#F3D9A6"
          strokeWidth="4.6"
          strokeLinecap="round"
        />
        {/* 브러시 모(毛) — 부채꼴 팁 */}
        <path
          d="M24.2 21.7 C26.6 19.3 28.2 17 29.6 14.3 C30.1 13.3 29.1 12.3 28.1 12.8 C25.4 14.2 23.1 15.8 20.7 18.2 Z"
          fill="white"
        />

        {/* 반짝임 */}
        <circle cx="30.5" cy="26.5" r="1.9" fill="white" opacity="0.9" />
        <circle cx="26" cy="30.5" r="1.15" fill="white" opacity="0.55" />
      </svg>

      {withText && (
        <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.12, whiteSpace: 'nowrap' }}>
          <strong style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.03em', color: onDark ? '#F0B7CE' : 'var(--primary)' }}>
            메이크업학원
          </strong>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '-0.01em', color: onDark ? 'rgba(255,255,255,0.62)' : 'var(--text-muted)' }}>
            수강료 비교
          </span>
        </span>
      )}
    </span>
  );
}

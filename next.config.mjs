/** @type {import('next').NextConfig} */
const nextConfig = {
  // 레지스트리 경로가 모두 트레일링 슬래시(/class/one-day/) 기준이므로 라우팅도 맞춘다.
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;

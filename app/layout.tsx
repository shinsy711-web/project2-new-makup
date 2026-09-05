import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileCtaBar from '@/components/MobileCtaBar';
import {
  SITE_NAME, SITE_SHORT, SITE_URL, OG_IMAGE, GA_ID, NAVER_VERIFICATION, ADSENSE_PUB,
  OPERATOR, getPage, PAGES,
} from '@/lib/site';

const HOME = getPage('/');
const TITLE = HOME.title;
const DESC = HOME.description;

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: `%s | ${SITE_SHORT}`,
  },
  description: DESC,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  keywords: Array.from(new Set(PAGES.flatMap((p) => p.keywords))).slice(0, 40),
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'ko_KR',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME, type: 'image/jpeg' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_NAME,
    title: TITLE,
    description: DESC,
    images: [OG_IMAGE],
  },
  authors: [{ name: SITE_NAME }],
  publisher: SITE_NAME,
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  formatDetection: { telephone: false, date: false, address: false, email: false },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  ...(NAVER_VERIFICATION ? { verification: { other: { 'naver-site-verification': NAVER_VERIFICATION } } } : {}),
  other: {
    'google-adsense-account': ADSENSE_PUB,
    NaverBot: 'all',
    Yeti: 'all',
    googlebot: 'all',
    subject: SITE_NAME,
    title: TITLE,
    publisher: SITE_NAME,
    author: SITE_NAME,
    location: 'South Korea',
    distribution: 'global',
    rating: 'general',
    'format-detection': 'telephone=no, date=no, address=no, email=no',
    'itemprop:name': TITLE,
    'itemprop:description': DESC,
    'itemprop:image': OG_IMAGE,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: 'ko-KR',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: OPERATOR.company,
        alternateName: SITE_NAME,
        url: `${SITE_URL}/`,
        description: '메이크업학원 수강료, 커리큘럼, 자격증, 국비지원 정보를 비교 제공하고 상담을 연결하는 정보 사이트입니다.',
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          width: 256,
          height: 256,
          caption: SITE_NAME,
        },
        image: { '@id': `${SITE_URL}/#logo` },
        contactPoint: {
          '@type': 'ContactPoint',
          email: OPERATOR.email,
          contactType: 'customer support',
          areaServed: 'KR',
          availableLanguage: 'Korean',
        },
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/#service`,
        name: '메이크업학원 수강료 비교 및 과정 상담',
        serviceType: '메이크업 교육 상담 서비스',
        areaServed: { '@type': 'Country', name: 'KR' },
        provider: { '@id': `${SITE_URL}/#organization` },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW', description: '무료 수강료 견적·과정 상담' },
      },
      {
        '@type': 'SiteNavigationElement',
        '@id': `${SITE_URL}/#nav`,
        name: PAGES.filter((p) => p.parent === '/').map((p) => p.nav),
        url: PAGES.filter((p) => p.parent === '/').map((p) => `${SITE_URL}${p.path}`),
      },
    ],
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          id="json-ld-site"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <meta itemProp="name" content={TITLE} />
        <meta itemProp="description" content={DESC} />
        <meta itemProp="image" content={OG_IMAGE} />

        <meta httpEquiv="content-language" content="ko-KR" />
        <meta name="geo.region" content="KR" />
        <meta name="geo.country" content="KR" />
        <meta name="geo.placename" content="South Korea" />

        <meta name="classification" content="교육, 뷰티, 메이크업, 학원" />
        <meta name="category" content="메이크업 교육" />
        <meta name="copyright" content={SITE_NAME} />
        <meta name="revisit-after" content="7 days" />

        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />

        {GA_ID && (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        <MobileCtaBar />
      </body>
    </html>
  );
}

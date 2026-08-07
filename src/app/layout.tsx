import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import LenisScroll from '@/components/LenisScroll';
import CursorGlow from '@/components/CursorGlow';
import { LangProvider } from '@/context/LangContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://creu.vn'),
  title: 'CREU Studio: Creative Studio & Digital Experiences tại TP.HCM',
  description: 'CREU Studio: creative studio tại Thủ Đức, TP.HCM. Chuyên Video Production, Photography, Brand Identity, Graphic Design và Marketing Content. Small Prints, Big Waves.',
  keywords: ['CREU Studio', 'creu vn', 'creu', 'creative studio tphcm', 'video production thủ đức', 'thiết kế brand identity tphcm', 'nhiếp ảnh doanh nghiệp'],
  alternates: {
    canonical: 'https://creu.vn',
  },
  openGraph: {
    title: 'CREU Studio: Creative Studio tại TP.HCM',
    description: 'CREU Studio: creative studio tại Thủ Đức, TP.HCM. Video Production, Photography, Brand Identity, Graphic Design, Marketing Content.',
    url: 'https://creu.vn',
    siteName: 'CREU Studio',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: 'https://creu.vn/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CREU Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CREU Studio: Creative Studio tại TP.HCM',
    description: 'Video Production, Photography, Brand Identity, Graphic Design, Marketing Content tại Thủ Đức, TP.HCM.',
    images: ['https://creu.vn/og-image.jpg'],
  },
  other: {
    'geo.region': 'VN-SG',
    'geo.placename': 'Thủ Đức, TP. Hồ Chí Minh',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'CREU Studio',
    alternateName: 'CREU',
    description: 'Creative studio tại Thủ Đức, TP.HCM. Chuyên Video Production, Photography, Brand Identity, Graphic Design và Marketing Content.',
    url: 'https://creu.vn',
    logo: 'https://creu.vn/creu-logo.png',
    image: 'https://creu.vn/og-image.jpg',
    email: 'hello@creu.vn',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Thủ Đức',
      addressRegion: 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
    areaServed: 'TP. Hồ Chí Minh',
    slogan: 'Small Prints, Big Waves',
    foundingDate: '2024',
    sameAs: [
      'https://www.facebook.com/CreU.VN',
      'https://www.instagram.com/creu.studio',
      'https://www.behance.net/creustudio',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dịch vụ CREU Studio',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Video Production' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Photography' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Brand Identity' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic Design' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Marketing Content' } },
      ],
    },
  };

  const fbPageId = process.env.NEXT_PUBLIC_FB_PAGE_ID || 'CreU.VN';

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <LangProvider>
          <div className="bg" />
          <CursorGlow />
          <LenisScroll />
          {children}
        </LangProvider>

        {/* Facebook Messenger Chat Bubble */}
        <div id="fb-root"></div>
        <div
          className="fb-customerchat"
          data-attribution="setup_tool"
          data-page_id={fbPageId}
          data-theme_color="#7C3AED"
          data-logged_in_greeting="Xin chào! CREU Studio có thể giúp gì cho bạn? 👋"
          data-logged_out_greeting="Xin chào! Nhắn tin để được tư vấn miễn phí nhé!"
        ></div>

        <Script id="fb-messenger" strategy="lazyOnload">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v18.0'
              });
            };
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import LenisScroll from '@/components/LenisScroll';
import CursorGlow from '@/components/CursorGlow';
import { LangProvider } from '@/context/LangContext';

export const metadata: Metadata = {
  title: 'CREU Studio — Creative Studio & Digital Experiences',
  description: 'Every brand has a story. We shape it through design, motion and digital experiences that leave a lasting impression.',
  openGraph: {
    title: 'CREU Studio — Creative Studio & Digital Experiences',
    description: 'Every brand has a story. We shape it through design, motion and digital experiences that leave a lasting impression.',
    url: 'https://creu.vn',
    siteName: 'CREU Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CREU Studio — Creative Studio & Digital Experiences',
    description: 'Every brand has a story. We shape it through design, motion and digital experiences that leave a lasting impression.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>
          <div className="bg" />
          <CursorGlow />
          <LenisScroll />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}

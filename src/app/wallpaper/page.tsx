import type { Metadata } from 'next';
import WallpaperPageClient from '@/components/WallpaperPageClient';

export const metadata: Metadata = {
  title: 'Hình Nền Điện Thoại Đẹp Miễn Phí 2026 | CREU Studio',
  description:
    'Tải hình nền điện thoại đẹp miễn phí từ CREU Studio. Hàng trăm wallpaper chất lượng cao theo tone màu: dark, pastel, minimal, aesthetic. Cập nhật liên tục.',
  keywords: [
    'hình nền điện thoại đẹp',
    'wallpaper aesthetic phone',
    'hinh nen dark mode',
    'hinh nen pastel',
    'tai hinh nen mien phi',
    'CREU Studio wallpaper',
  ],
  openGraph: {
    title: 'Hình Nền Điện Thoại Đẹp Miễn Phí 2026 | CREU Studio',
    description:
      'Kho hình nền điện thoại 4K sắc nét miễn phí từ CREU Studio. Lọc theo tone màu: Dark, Minimal, Pastel, Aesthetic.',
    url: 'https://creu.vn/wallpaper',
    siteName: 'CREU Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Hình Nền Điện Thoại Đẹp Miễn Phí CREU Studio',
      },
    ],
    type: 'website',
  },
  other: {
    'pinterest-rich-pin': 'true',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: 'Hình Nền Điện Thoại Đẹp Miễn Phí',
  description: 'Kho hình nền điện thoại chất lượng cao từ CREU Studio',
  url: 'https://creu.vn/wallpaper',
  provider: {
    '@type': 'Organization',
    name: 'CREU Studio',
    url: 'https://creu.vn',
  },
};

export default function WallpaperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      <WallpaperPageClient />
    </>
  );
}

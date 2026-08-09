import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache 1 hour

export interface WallpaperItem {
  id: string;
  title: string;
  titleEn?: string;
  slug: string;
  category: string;
  previewUrl: string;
  downloadUrl: string;
  width: number;
  height: number;
  downloads?: number;
}

const TONE_CATEGORIES: Record<string, { nameVi: string; nameEn: string; icon: string }> = {
  'dark-moody': { nameVi: 'Dark Moody', nameEn: 'Dark Moody', icon: '🖤' },
  'minimal-white': { nameVi: 'Minimal White', nameEn: 'Minimal White', icon: '🤍' },
  'purple-aesthetic': { nameVi: 'Purple Aesthetic', nameEn: 'Purple Aesthetic', icon: '💜' },
  'pastel-pink': { nameVi: 'Pastel Pink', nameEn: 'Pastel Pink', icon: '🩷' },
  'blue-ocean': { nameVi: 'Blue Ocean', nameEn: 'Blue Ocean', icon: '💙' },
  'nature-green': { nameVi: 'Nature Green', nameEn: 'Nature Green', icon: '🌿' },
  'warm-amber': { nameVi: 'Warm Amber', nameEn: 'Warm Amber', icon: '🧡' },
  'black-gold': { nameVi: 'Black & Gold', nameEn: 'Black & Gold', icon: '✨' },
};

// Curated default wallpaper collection (Unsplash High-Res + Drive Fallbacks)
const DEFAULT_WALLPAPERS: WallpaperItem[] = [
  {
    id: 'dark-moody-01',
    title: 'Cyberpunk Neon Cyber City 4K',
    titleEn: 'Cyberpunk Neon Cyber City 4K',
    slug: 'dark-moody-01',
    category: 'dark-moody',
    previewUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1420,
  },
  {
    id: 'dark-moody-02',
    title: 'Midnight Urban Abstract Geometry',
    titleEn: 'Midnight Urban Abstract Geometry',
    slug: 'dark-moody-02',
    category: 'dark-moody',
    previewUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 980,
  },
  {
    id: 'minimal-white-01',
    title: 'Architectural Minimal Light Shadow',
    titleEn: 'Architectural Minimal Light Shadow',
    slug: 'minimal-white-01',
    category: 'minimal-white',
    previewUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 2150,
  },
  {
    id: 'minimal-white-02',
    title: 'Clean Nordic Line Art Balance',
    titleEn: 'Clean Nordic Line Art Balance',
    slug: 'minimal-white-02',
    category: 'minimal-white',
    previewUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1670,
  },
  {
    id: 'purple-aesthetic-01',
    title: 'Cosmic Violet Nebula Horizon',
    titleEn: 'Cosmic Violet Nebula Horizon',
    slug: 'purple-aesthetic-01',
    category: 'purple-aesthetic',
    previewUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 3400,
  },
  {
    id: 'purple-aesthetic-02',
    title: 'Neon Purple Cyber Dreamscape',
    titleEn: 'Neon Purple Cyber Dreamscape',
    slug: 'purple-aesthetic-02',
    category: 'purple-aesthetic',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1890,
  },
  {
    id: 'pastel-pink-01',
    title: 'Soft Pastel Sunset Gradient',
    titleEn: 'Soft Pastel Sunset Gradient',
    slug: 'pastel-pink-01',
    category: 'pastel-pink',
    previewUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 2890,
  },
  {
    id: 'pastel-pink-02',
    title: 'Blush Cloud Dreamland 4K',
    titleEn: 'Blush Cloud Dreamland 4K',
    slug: 'pastel-pink-02',
    category: 'pastel-pink',
    previewUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 2100,
  },
  {
    id: 'blue-ocean-01',
    title: 'Deep Ocean Ripple Minimal',
    titleEn: 'Deep Ocean Ripple Minimal',
    slug: 'blue-ocean-01',
    category: 'blue-ocean',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1750,
  },
  {
    id: 'nature-green-01',
    title: 'Emerald Forest Mist Atmosphere',
    titleEn: 'Emerald Forest Mist Atmosphere',
    slug: 'nature-green-01',
    category: 'nature-green',
    previewUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1980,
  },
  {
    id: 'warm-amber-01',
    title: 'Golden Hour Autumn Amber Rays',
    titleEn: 'Golden Hour Autumn Amber Rays',
    slug: 'warm-amber-01',
    category: 'warm-amber',
    previewUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 1540,
  },
  {
    id: 'black-gold-01',
    title: 'Luxurious Obsidian & Gold Foil Wave',
    titleEn: 'Luxurious Obsidian & Gold Foil Wave',
    slug: 'black-gold-01',
    category: 'black-gold',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1080&q=85',
    downloadUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2160&q=100',
    width: 1080,
    height: 1920,
    downloads: 2450,
  },
];

export async function GET(request: NextRequest) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || (globalThis as any).GOOGLE_DRIVE_FOLDER_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || (globalThis as any).GOOGLE_DRIVE_API_KEY;

  if (folderId && apiKey) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id,name,mimeType,thumbnailLink,webContentLink)&key=${apiKey}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.files)) {
          const driveWallpapers: WallpaperItem[] = data.files
            .filter((f: any) => f.mimeType?.startsWith('image/'))
            .map((f: any) => {
              const nameClean = f.name.replace(/\.[^/.]+$/, '');
              const matchedTone = Object.keys(TONE_CATEGORIES).find((tone) => nameClean.toLowerCase().includes(tone)) || 'dark-moody';
              return {
                id: f.id,
                title: nameClean.replace(/[-_]/g, ' '),
                slug: nameClean.toLowerCase(),
                category: matchedTone,
                previewUrl: f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+/, '=s1080') : `https://lh3.googleusercontent.com/d/${f.id}=w1080`,
                downloadUrl: f.webContentLink || `https://drive.google.com/uc?export=download&id=${f.id}`,
                width: 1080,
                height: 1920,
                downloads: Math.floor(Math.random() * 500) + 100,
              };
            });

          if (driveWallpapers.length > 0) {
            return NextResponse.json({ success: true, provider: 'Google Drive API', data: driveWallpapers, categories: TONE_CATEGORIES });
          }
        }
      }
    } catch (err) {
      console.error('Google Drive API fetch error:', err);
    }
  }

  return NextResponse.json({
    success: true,
    provider: 'Curated Collection',
    data: DEFAULT_WALLPAPERS,
    categories: TONE_CATEGORIES,
  });
}

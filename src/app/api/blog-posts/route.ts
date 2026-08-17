import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';

export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || (globalThis as any).UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || (globalThis as any).UPSTASH_REDIS_REST_TOKEN;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const postsMap = new Map<string, any>();

    // 1. Get static MDX posts
    const staticPosts = getAllPosts();
    staticPosts.forEach((p, idx) => {
      postsMap.set(p.slug, {
        id: (p as any).id || (1000 + idx),
        slug: p.slug,
        title: p.title,
        titleEn: p.titleEn || (p as any).title_en || '',
        date: p.date,
        description: p.description,
        descriptionEn: p.descriptionEn || (p as any).description_en || '',
        thumbnail: p.thumbnail || '/creu-logo.png',
        category: p.category || 'GENERAL',
        author: p.author || 'CREU Studio',
        content_vi: p.content_vi || p.content || '',
        content_en: p.content_en || (p as any).contentEn || '',
        content: p.content_vi || p.content || '',
      });
    });

    // 2. Fetch from Upstash Redis if credentials exist (check blog:posts, site_data, posts keys)
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const keysToTry = ['blog:posts', 'posts', 'site_data'];
      for (const key of keysToTry) {
        try {
          const res = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}/get/${key}`, {
            headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
            cache: 'no-store',
          });
          if (res.ok) {
            const json = await res.json();
            if (json.result) {
              let parsed = json.result;
              if (typeof parsed === 'string') {
                try {
                  parsed = JSON.parse(parsed);
                  if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                } catch (e) {}
              }
              
              const blogList = Array.isArray(parsed)
                ? parsed
                : (parsed && Array.isArray(parsed.blogPosts) ? parsed.blogPosts : []);

              blogList.forEach((p: any, idx: number) => {
                if (p && p.slug) {
                  const existing = postsMap.get(p.slug);
                  const staticThumbnail = existing?.thumbnail;
                  const staticContentVi = existing?.content_vi || existing?.content;

                  const useStaticThumb = staticThumbnail && (staticThumbnail.startsWith('/images/') || !p.thumbnail);
                  const useStaticContent = staticContentVi && (staticContentVi.includes('![') || !p.content_vi);

                  postsMap.set(p.slug, {
                    id: p.id || existing?.id || (2000 + idx),
                    slug: p.slug,
                    title: p.title || existing?.title || 'Untitled Post',
                    titleEn: p.titleEn || p.title_en || existing?.titleEn || '',
                    date: p.date || existing?.date || new Date().toISOString().split('T')[0],
                    description: p.description || existing?.description || '',
                    descriptionEn: p.descriptionEn || p.description_en || existing?.descriptionEn || '',
                    thumbnail: useStaticThumb ? staticThumbnail : (p.thumbnail || staticThumbnail || '/creu-logo.png'),
                    category: p.category || existing?.category || 'GENERAL',
                    author: p.author || existing?.author || 'CREU Studio',
                    content_vi: useStaticContent ? staticContentVi : (p.content_vi || p.content || staticContentVi || ''),
                    content_en: p.content_en || p.contentEn || existing?.content_en || '',
                    content: useStaticContent ? staticContentVi : (p.content_vi || p.content || staticContentVi || ''),
                  });
                }
              });
            }
          }
        } catch (e) {}
      }
    }

    const allPosts = Array.from(postsMap.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
    return NextResponse.json(allPosts, { headers: noCacheHeaders });
  } catch (error) {
    const fallback = getAllPosts();
    return NextResponse.json(fallback, { headers: noCacheHeaders });
  }
}

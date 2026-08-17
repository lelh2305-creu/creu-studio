import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteDataFallback from '@/data/siteData.json';
import { getAllPosts } from '@/lib/posts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// Upstash REST API credentials
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || (globalThis as any).UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || (globalThis as any).UPSTASH_REDIS_REST_TOKEN;

// Cloudflare KV fallback
function getKV(req?: any): any {
  if (req && req.env && req.env.CREU_KV) return req.env.CREU_KV;
  return (
    (process.env as any).CREU_KV ||
    (globalThis as any).CREU_KV ||
    null
  );
}

function mergeStaticPosts(parsed: any) {
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.blogPosts)) return parsed;
  try {
    const staticPosts = getAllPosts();
    const staticMap = new Map(staticPosts.map((p) => [p.slug, p]));

    const thumbCountMap = new Map<string, number>();
    parsed.blogPosts.forEach((p: any) => {
      if (p && p.thumbnail) {
        thumbCountMap.set(p.thumbnail, (thumbCountMap.get(p.thumbnail) || 0) + 1);
      }
    });

    parsed.blogPosts = parsed.blogPosts.map((p: any) => {
      if (!p || !p.slug) return p;
      const staticP = staticMap.get(p.slug);
      const isCorruptedThumb = p.thumbnail && (thumbCountMap.get(p.thumbnail) || 0) > 2;
      const isStaleQuayChup = p.slug === 'quay-chup-noi-that-hcm' && (p.content_vi || p.content || '').includes('vr6yot.png');

      return {
        ...staticP,
        ...p,
        thumbnail: (isCorruptedThumb ? staticP?.thumbnail : p.thumbnail) || staticP?.thumbnail || '/creu-logo.png',
        content_vi: isStaleQuayChup ? staticP?.content_vi : (p.content_vi || staticP?.content_vi),
        content: isStaleQuayChup ? staticP?.content : (p.content || staticP?.content),
      };
    });

    staticPosts.forEach((sp) => {
      if (!parsed.blogPosts.some((bp: any) => bp && bp.slug === sp.slug)) {
        parsed.blogPosts.push(sp);
      }
    });
  } catch (e) {}
  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Try Upstash Redis if REST URL and Token exist
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const res = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}/get/site_data`, {
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
              if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
              }
            } catch (e) {}
          }
          if (parsed && typeof parsed === 'object' && parsed.siteConfig) {
            const merged = mergeStaticPosts(parsed);
            return NextResponse.json(merged, { headers: noCacheHeaders });
          }
        }
      }
    }

    // 2. Try Cloudflare KV fallback
    const kv = getKV(request);
    if (kv) {
      const stored = await kv.get('site_data');
      if (stored) {
        let parsed = stored;
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
            if (typeof parsed === 'string') {
              parsed = JSON.parse(parsed);
            }
          } catch (e) {}
        }
        if (parsed && typeof parsed === 'object' && parsed.siteConfig) {
          const merged = mergeStaticPosts(parsed);
          return NextResponse.json(merged, { headers: noCacheHeaders });
        }
      }
    }

    const mergedFallback = mergeStaticPosts(siteDataFallback);
    return NextResponse.json(mergedFallback, { headers: noCacheHeaders });
  } catch (error) {
    const mergedFallback = mergeStaticPosts(siteDataFallback);
    return NextResponse.json(mergedFallback, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.siteConfig) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400, headers: noCacheHeaders });
    }

    // 1. Try Upstash Redis if REST URL and Token exist
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const res = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}/set/site_data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      if (res.ok) {
        return NextResponse.json({ success: true, kvAvailable: true, provider: 'Upstash Redis', message: 'Synced to Upstash Redis' }, { headers: noCacheHeaders });
      }
    }

    // 2. Try Cloudflare KV fallback
    const kv = getKV(request);
    if (kv) {
      await kv.put('site_data', JSON.stringify(body));
      return NextResponse.json({ success: true, kvAvailable: true, provider: 'Cloudflare KV', message: 'Synced to KV' }, { headers: noCacheHeaders });
    }

    return NextResponse.json({ success: true, kvAvailable: false, message: 'Dev mode' }, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: noCacheHeaders });
  }
}

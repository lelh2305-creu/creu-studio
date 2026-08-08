import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || (globalThis as any).UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || (globalThis as any).UPSTASH_REDIS_REST_TOKEN;

function getKV(req?: any): any {
  if (req && req.env && req.env.CREU_KV) return req.env.CREU_KV;
  return (
    (process.env as any).CREU_KV ||
    (globalThis as any).CREU_KV ||
    null
  );
}

export const defaultPromotionConfig = {
  announcementBar: {
    enabled: true,
    text: '🎉 MIỄN PHÍ 2 tháng thiết kế Poster & Banner — Ưu đãi đến hết tháng 9/2026',
    textEn: '🎉 FREE 2 months of Poster & Banner design — Offer ends September 2026',
    bgColor: '#7C3AED',
    textColor: '#ffffff',
    ctaText: 'Đăng ký ngay',
    ctaTextEn: 'Register now',
    ctaLink: '/?tab=contact',
    backgroundImage: '',
    height: 'auto',
  },
  heroBanner: {
    enabled: true,
    tag: 'KHUYẾN MÃI ĐẶC BIỆT',
    tagEn: 'SPECIAL OFFER',
    title: 'Miễn Phí 2 Tháng Thiết Kế Poster & Banner',
    titleEn: '2 Months Free Poster & Banner Design',
    description: 'Dành cho doanh nghiệp, startup, và đơn vị nhỏ tại TP.HCM. Không giới hạn số lượng. Ưu đãi kết thúc 30/09/2026.',
    descriptionEn: 'For businesses, startups, and small organizations in HCMC. No quantity limit. Offer ends 30/09/2026.',
    ctaText: 'Nhận ưu đãi ngay',
    ctaTextEn: 'Claim offer now',
    ctaLink: '/?tab=contact',
    deadline: '30/09/2026',
    bgGradient: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
    thumbnail: '',
    backgroundImage: '',
  },
};

export async function GET(request: NextRequest) {
  try {
    // 1. Upstash Redis
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const res = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}/get/promotion_config`, {
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
          if (parsed && typeof parsed === 'object') {
            return NextResponse.json(parsed, { headers: noCacheHeaders });
          }
        }
      }
    }

    // 2. Cloudflare KV
    const kv = getKV(request);
    if (kv) {
      const stored = await kv.get('promotion_config');
      if (stored) {
        let parsed = stored;
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          } catch (e) {}
        }
        if (parsed && typeof parsed === 'object') {
          return NextResponse.json(parsed, { headers: noCacheHeaders });
        }
      }
    }

    return NextResponse.json(defaultPromotionConfig, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json(defaultPromotionConfig, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400, headers: noCacheHeaders });
    }

    // 1. Upstash Redis
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const res = await fetch(`${UPSTASH_URL.replace(/\/$/, '')}/set/promotion_config`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${UPSTASH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      });
      if (res.ok) {
        return NextResponse.json({ success: true, provider: 'Upstash Redis' }, { headers: noCacheHeaders });
      }
    }

    // 2. Cloudflare KV
    const kv = getKV(request);
    if (kv) {
      await kv.put('promotion_config', JSON.stringify(body));
      return NextResponse.json({ success: true, provider: 'Cloudflare KV' }, { headers: noCacheHeaders });
    }

    return NextResponse.json({ success: true, provider: 'Local' }, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: noCacheHeaders });
  }
}

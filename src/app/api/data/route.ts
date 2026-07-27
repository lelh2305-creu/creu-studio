import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteDataFallback from '@/data/siteData.json';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

function getKV(req?: any): any {
  if (req && req.env && req.env.CREU_KV) return req.env.CREU_KV;
  return (
    (process.env as any).CREU_KV ||
    (globalThis as any).CREU_KV ||
    (globalThis as any).__env__?.CREU_KV ||
    (globalThis as any).env?.CREU_KV ||
    null
  );
}

export async function GET(request: NextRequest) {
  try {
    const kv = getKV(request);
    if (kv) {
      const stored = await kv.get('site_data');
      if (stored) {
        return NextResponse.json(JSON.parse(stored), { headers: noCacheHeaders });
      }
    }
    return NextResponse.json(siteDataFallback, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json(siteDataFallback, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.siteConfig) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400, headers: noCacheHeaders });
    }
    const kv = getKV(request);
    if (kv) {
      await kv.put('site_data', JSON.stringify(body));
      return NextResponse.json({ success: true, kvAvailable: true, message: 'Synced to KV' }, { headers: noCacheHeaders });
    }
    return NextResponse.json({ success: true, kvAvailable: false, message: 'Dev mode' }, { headers: noCacheHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500, headers: noCacheHeaders });
  }
}

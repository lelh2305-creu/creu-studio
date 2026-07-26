import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import siteDataFallback from '@/data/siteData.json';

export const runtime = 'edge';

function getKV(): any {
  return (globalThis as any).CREU_KV || (process.env as any).CREU_KV || null;
}

export async function GET() {
  try {
    const kv = getKV();

    if (kv) {
      const stored = await kv.get('site_data');
      if (stored) {
        return NextResponse.json(JSON.parse(stored));
      }
    }

    return NextResponse.json(siteDataFallback);
  } catch (error) {
    console.error('[GET /api/data] error:', error);
    return NextResponse.json(siteDataFallback);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.siteConfig) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: missing siteConfig' },
        { status: 400 }
      );
    }

    const kv = getKV();

    if (kv) {
      await kv.put('site_data', JSON.stringify(body));
      return NextResponse.json({
        success: true,
        message: 'Data synced globally via KV',
        data: body,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Data saved (local dev mode — KV not available)',
      data: body,
    });
  } catch (error) {
    console.error('[POST /api/data] error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

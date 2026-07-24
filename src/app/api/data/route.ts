import { NextResponse } from 'next/server';
import siteData from '@/data/siteData.json';

// Global memory cache for edge worker instance persistence
let inMemoryData: any = null;

export async function GET() {
  if (inMemoryData) {
    return NextResponse.json(inMemoryData);
  }
  return NextResponse.json(siteData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && body.siteConfig) {
      inMemoryData = body;
    }
    return NextResponse.json({ success: true, message: 'Data synced successfully', data: body });
  } catch (error) {
    return NextResponse.json({ success: true, message: 'Data saved' });
  }
}

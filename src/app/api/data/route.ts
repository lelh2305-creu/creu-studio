import { NextResponse } from 'next/server';
import siteData from '@/data/siteData.json';

export async function GET() {
  return NextResponse.json(siteData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, message: 'Data saved successfully', data: body });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}

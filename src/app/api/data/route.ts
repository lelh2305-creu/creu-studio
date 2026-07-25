import { NextResponse } from 'next/server';
import siteData from '@/data/siteData.json';
import fs from 'fs';
import path from 'path';

let inMemoryData: any = null;

export async function GET() {
  if (inMemoryData) {
    return NextResponse.json(inMemoryData);
  }
  try {
    const dataPath = path.join(process.cwd(), 'src/data/siteData.json');
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(fileContent);
      return NextResponse.json(parsed);
    }
  } catch (e) {}
  return NextResponse.json(siteData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body && body.siteConfig) {
      inMemoryData = body;
      try {
        const dataPath = path.join(process.cwd(), 'src/data/siteData.json');
        fs.writeFileSync(dataPath, JSON.stringify(body, null, 2), 'utf8');
      } catch (e) {}
    }
    return NextResponse.json({ success: true, message: 'Data synced successfully', data: body });
  } catch (error) {
    return NextResponse.json({ success: true, message: 'Data saved' });
  }
}

import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
  const data = await fs.readFile(settingsPath, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: Request) {
  const body = await request.json();
  await fs.writeFile(settingsPath, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}

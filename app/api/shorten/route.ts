import { NextRequest, NextResponse } from 'next/server';
import { tablesDB } from '@/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);
    await tablesDB.createRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.URLS_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        orignal_url: url,
        short_code: shortCode,
        clicks: 0,
      }
    });

    return NextResponse.json({ shortUrl: `${request.nextUrl.origin}/s/${shortCode}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to shorten URL' }, { status: 500 });
  }
}
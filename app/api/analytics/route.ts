import { NextRequest, NextResponse } from 'next/server';
import { tablesDB } from '../../../lib/appwrite';
import { Query } from 'appwrite';

export async function POST(request: NextRequest) {
  try {
    const { shortUrl } = await request.json();
    if (!shortUrl) return NextResponse.json({ error: 'Short URL required' }, { status: 400 });

    const shortCode = shortUrl.split('/').pop();
    const urlResponse = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.URLS_TABLE_ID!,
      queries: [Query.equal('short_code', shortCode)]
    });
    if (urlResponse.rows.length === 0) {
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    const urlData = urlResponse.rows[0];
    const clicksResponse = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.CLICKS_TABLE_ID!,
      queries: [Query.equal('url_id', urlData.$id)]
    });

    const getTop = (items: string[]) => {
      const counts: Record<string, number> = {};
      items.forEach(item => {
        if (item) counts[item] = (counts[item] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([item, count]) => ({ item, count }));
    };

    const referrers = getTop(clicksResponse.rows.map(c => c.referrer));
    const browsers = getTop(clicksResponse.rows.map(c => c.browser));
    const os = getTop(clicksResponse.rows.map(c => c.os));

    return NextResponse.json({
      totalClicks: urlData.clicks,
      referrers,
      browsers,
      os,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
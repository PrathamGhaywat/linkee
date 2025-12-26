import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { tablesDB } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

function parseUserAgent(ua: string) {
  let browser = 'Unknown';
  let os = 'Unknown';

  // Simple browser detection
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';

  // Simple OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return { browser, os };
}

export default async function RedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { code } = await params;
  const sp = await searchParams;

  let urlData;

  try {
    const urlResponse = await tablesDB.listRows({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.URLS_TABLE_ID!,
      queries: [Query.equal('short_code', code)],
    });

    if (urlResponse.rows.length === 0) {
      notFound();
    }

    urlData = urlResponse.rows[0];

    await tablesDB.updateRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.URLS_TABLE_ID!,
      rowId: urlData.$id,
      data: {
        clicks: urlData.clicks + 1,
      },
    });

    // Get headers
    const headersList = await headers();
    const httpReferrer = headersList.get('referer') || '';
    const customRef = sp.ref || '';
    const referrer = customRef || httpReferrer;
    const userAgent = headersList.get('user-agent') || '';
    const { browser, os } = parseUserAgent(userAgent);

    await tablesDB.createRow({
      databaseId: process.env.APPWRITE_DATABASE_ID!,
      tableId: process.env.CLICKS_TABLE_ID!,
      rowId: ID.unique(),
      data: {
        url_id: urlData.$id,
        referrer,
        browser,
        os,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  redirect(urlData.orignal_url);
}

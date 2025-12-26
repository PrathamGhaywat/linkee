'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AnalyticsData {
  totalClicks: number;
  referrers: { item: string; count: number }[];
  browsers: { item: string; count: number }[];
  os: { item: string; count: number }[];
}

export default function Analytics() {
  const [url, setUrl] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortUrl: url }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnalytics(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-foreground text-center mb-8">Link Analytics</h1>
        
        <div className="flex gap-4 mb-8">
          <Input
            type="url"
            placeholder="Enter your short URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button className="px-4 bg-lime-500 text-black hover:bg-lime-600" onClick={fetchAnalytics} disabled={loading}>
            {loading ? 'Loading...' : 'Get Analytics'}
          </Button>
        </div>

        {analytics && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Total Clicks</h2>
              <p className="text-2xl font-bold text-primary">{analytics.totalClicks}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Top Referrers</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {analytics.referrers.map((ref, index) => (
                  <li key={index}>{ref.item} ({ref.count})</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Top Browsers</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {analytics.browsers.map((browser, index) => (
                  <li key={index}>{browser.item} ({browser.count})</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-foreground">Top Operating Systems</h2>
              <ul className="list-disc list-inside text-muted-foreground">
                {analytics.os.map((os, index) => (
                  <li key={index}>{os.item} ({os.count})</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
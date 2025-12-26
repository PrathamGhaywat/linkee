'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AnalyticsData {
  totalClicks: number;
  referrers: string[];
  browsers: string[];
  os: string[];
}

export default function Analytics() {
    const [url, setUrl] = useState('');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

    const fetchAnalytics = () => {
        //placeholder
        setAnalytics({
            totalClicks: 67,
            referrers: ['google.com', 'x.com', 'bing.com'],
            browsers: ['Chrome', 'Safari', 'Firefox'],
            os: ['Windows', 'macOS', 'Linux']
        });
    }

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
                    <Button className="px-4 bg-lime-500 text-black hover:bg-lime-600 sm:w-auto" onClick={fetchAnalytics}>Get Analytics</Button>
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
                                    <li key={index}>{ref}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Browsers</h2>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {analytics.browsers.map((browser, index) => (
                                    <li key={index}>{browser}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Operating Systems</h2>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {analytics.os.map((os, index) => (
                                    <li key={index}>{os}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
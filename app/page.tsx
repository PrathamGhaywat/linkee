'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setShortUrl(data.shortUrl);
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
    <div className="relative min-h-screen bg-background px-4 py-8">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-3">
            <Image
              src="/linkee.svg"
              width={40}
              height={40}
              alt="Linkee Logo"
              className="text-foreground"
            />
            <h1 className="text-6xl font-bold text-foreground">Linkee</h1>
          </div>

          <p className="text-lg text-muted-foreground">A simple and authless URL shortner</p>

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
            <Input
              type="url"
              placeholder="https://superlongurl.link"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-100 max-w-xs h-10 text-base mx-auto sm:mx-0"
            />
            <Button
              className="px-6 bg-lime-500 text-black hover:bg-lime-600 sm:w-auto"
              onClick={handleShorten}
              disabled={loading}
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </Button>
          </div>

          {shortUrl && (
            <p className="text-sm text-muted-foreground">
              Shortened URL: <Link href={shortUrl} className="text-primary">{shortUrl}</Link>
            </p>
          )}
        </main>
      </div>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <Link href="./analytics">
          <Button className="px-6 bg-lime-500 text-black hover:bg-lime-600">Get Link Analytics</Button>
        </Link>
      </div>
    </div>
  );
}
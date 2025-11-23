'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface LinkData {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [link, setLink] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || '';

  useEffect(() => {
    const fetchLink = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/links/${code}`);
        
        if (!response.ok) {
          setError('Link not found');
          return;
        }

        const data = await response.json();
        setLink(data);
      } catch {
        setError('Failed to load link data');
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  const copyToClipboard = () => {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading stats...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Link Not Found</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const shortUrl = `${baseUrl}/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
              <p className="text-gray-600 mt-1">Link Statistics</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <code className="text-3xl font-bold font-mono">{link.code}</code>
              <button
                onClick={copyToClipboard}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
                title="Copy short URL"
              >
                {copiedUrl ? '✓ Copied!' : 'Copy URL'}
              </button>
            </div>
            <p className="text-blue-100 text-sm font-mono break-all">{shortUrl}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Clicks</h3>
              <p className="text-4xl font-bold text-gray-900">{link.totalClicks}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Last Clicked</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(link.lastClicked)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Created</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(link.createdAt)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Last Updated</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(link.updatedAt)}
              </p>
            </div>
          </div>

          {/* Target URL */}
          <div className="border-t px-6 py-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Target URL</h3>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium break-all"
            >
              {link.targetUrl}
            </a>
          </div>

          {/* QR Code Placeholder */}
          <div className="border-t px-6 py-6 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Quick Actions</h3>
            <div className="flex gap-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Test Redirect
              </a>
              <button
                onClick={copyToClipboard}
                className="border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Copy Short URL
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
          <p>TinyLink - URL Shortener © 2025</p>
        </div>
      </footer>
    </div>
  );
}

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
    <div className="min-h-screen gradient-bg">
      <header className="glass shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TinyLink</h1>
                <p className="text-gray-600 mt-1">Link Statistics</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
                  <code className="text-4xl font-bold font-mono">{link.code}</code>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="bg-white/30 hover:bg-white/40 backdrop-blur-sm px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  title="Copy short URL"
                >
                  {copiedUrl ? '✓ Copied!' : '📋 Copy URL'}
                </button>
              </div>
              <p className="text-white/90 text-base font-mono break-all bg-black/20 px-4 py-3 rounded-xl backdrop-blur-sm">{shortUrl}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 shadow-md hover-lift border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">👆</span>
                <h3 className="text-sm font-bold text-green-700 uppercase">Total Clicks</h3>
              </div>
              <p className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{link.totalClicks}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 shadow-md hover-lift border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⏰</span>
                <h3 className="text-sm font-bold text-blue-700 uppercase">Last Clicked</h3>
              </div>
              <p className="text-lg font-bold text-blue-900">
                {formatDate(link.lastClicked)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 shadow-md hover-lift border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎂</span>
                <h3 className="text-sm font-bold text-purple-700 uppercase">Created</h3>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {formatDate(link.createdAt)}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-100 rounded-2xl p-6 shadow-md hover-lift border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔄</span>
                <h3 className="text-sm font-bold text-orange-700 uppercase">Last Updated</h3>
              </div>
              <p className="text-lg font-bold text-orange-900">
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

          {/* Quick Actions */}
          <div className="border-t-2 px-8 py-8 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-sm font-bold text-gray-700 uppercase mb-5 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-4">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
              >
                🚀 Test Redirect
              </a>
              <button
                onClick={copyToClipboard}
                className="flex-1 min-w-[200px] border-3 border-purple-300 bg-white px-6 py-4 rounded-xl font-bold text-purple-600 hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📋 Copy Short URL
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="glass mt-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-700 font-medium">
            Made with <span className="text-red-500 animate-pulse-slow">❤️</span> by TinyLink
          </p>
          <p className="text-gray-500 text-sm mt-1">© 2025 - Shorten URLs with Style</p>
        </div>
      </footer>
    </div>
  );
}

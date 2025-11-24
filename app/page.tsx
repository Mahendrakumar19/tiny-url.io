'use client';

import { useState, useEffect } from 'react';
import { AddLinkForm } from '@/components/AddLinkForm';
import { LinksTable } from '@/components/LinksTable';

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleLinkAdded = () => {
    fetchLinks();
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchLinks();
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen gradient-bg">
      <header className="glass shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TinyLink</h1>
              <p className="text-gray-600 mt-1">Shorten, Share, Track</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Add Link Form */}
          <div className="glass rounded-2xl shadow-xl p-8 hover-lift animate-slide-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">✨</span>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Create New Short Link</h2>
            </div>
            <AddLinkForm onSuccess={handleLinkAdded} />
          </div>

          {/* Links Table */}
          <div className="glass rounded-2xl shadow-xl p-8 hover-lift animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🔗</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Your Links</h2>
              </div>
              <input
                type="text"
                placeholder="🔍 Search by code or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-80 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-2">Loading links...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No links found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try a different search term' : 'Get started by creating a new short link'}
                </p>
              </div>
            ) : (
              <LinksTable links={filteredLinks} onDelete={handleDelete} />
            )}
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

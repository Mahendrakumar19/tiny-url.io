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
    <div className="min-h-screen gradient-bg flex flex-col">
      <header className="glass shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">TinyLink</h1>
              <p className="text-sm text-gray-500">Shorten, Share, Track</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
          {/* Add Link Form */}
          <div className="glass rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">✨ Create New Short Link</h2>
            <AddLinkForm onSuccess={handleLinkAdded} />
          </div>

          {/* Links Table */}
          <div className="glass rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <h2 className="text-xl font-semibold text-gray-900">🔗 Your Links</h2>
              <input
                type="text"
                placeholder="Search by code or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 text-sm"
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
        </div>
      </main>

      <footer className="glass mt-auto flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-gray-600 text-sm">
            Made with ❤️ by TinyLink
          </p>
          <p className="text-gray-400 text-xs mt-1">© 2025 - Shorten URLs with Style</p>
        </div>
      </footer>
    </div>
  );
}

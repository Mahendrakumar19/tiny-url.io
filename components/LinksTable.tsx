'use client';

import { useState } from 'react';

interface Link {
  id: string;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClicked: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface LinksTableProps {
  links: Link[];
  onDelete: (code: string) => void;
}

export function LinksTable({ links, onDelete }: LinksTableProps) {
  const [sortField, setSortField] = useState<'createdAt' | 'totalClicks'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_BASE_URL || '';

  const handleSort = (field: 'createdAt' | 'totalClicks') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedLinks = [...links].sort((a, b) => {
    const aValue = sortField === 'createdAt' ? new Date(a.createdAt).getTime() : a.totalClicks;
    const bValue = sortField === 'createdAt' ? new Date(b.createdAt).getTime() : b.totalClicks;

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const copyToClipboard = (code: string) => {
    const url = `${baseUrl}/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Target URL
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('totalClicks')}
            >
              <div className="flex items-center gap-1">
                Total Clicks
                {sortField === 'totalClicks' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('createdAt')}
            >
              <div className="flex items-center gap-1">
                Last Clicked
                {sortField === 'createdAt' && (
                  <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedLinks.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-medium text-blue-600">
                    {link.code}
                  </code>
                  <button
                    onClick={() => copyToClipboard(link.code)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy short URL"
                  >
                    {copiedCode === link.code ? (
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <a
                  href={link.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-900 hover:text-blue-600"
                  title={link.targetUrl}
                >
                  {truncateUrl(link.targetUrl)}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {link.totalClicks}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(link.lastClicked)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <a
                  href={`/code/${link.code}`}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Stats
                </a>
                <button
                  onClick={() => onDelete(link.code)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

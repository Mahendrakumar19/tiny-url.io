'use client';

import { useState } from 'react';

interface AddLinkFormProps {
  onSuccess: () => void;
}

export function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [targetUrl, setTargetUrl] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateCode = (code: string): boolean => {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!targetUrl) {
      setError('URL is required');
      return;
    }

    if (!validateUrl(targetUrl)) {
      setError('Invalid URL format');
      return;
    }

    if (code && !validateCode(code)) {
      setError('Code must be 6-8 alphanumeric characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUrl,
          code: code || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      setSuccess(true);
      setTargetUrl('');
      setCode('');
      onSuccess();

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Target URL <span className="text-red-500">*</span>
        </label>
        <input
          id="targetUrl"
          type="text"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com/your-long-url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Code (optional)
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="mycode (6-8 alphanumeric characters)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          maxLength={8}
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to generate a random code
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Link created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating...' : 'Create Short Link'}
      </button>
    </form>
  );
}

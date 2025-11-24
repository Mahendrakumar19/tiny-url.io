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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label htmlFor="targetUrl" className="block text-sm font-semibold text-gray-700 mb-2">
          🌐 Target URL <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="targetUrl"
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/your-long-url"
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md disabled:bg-gray-50"
            disabled={loading}
          />
          {targetUrl && validateUrl(targetUrl) && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">✓</span>
          )}
        </div>
      </div>

      <div className="relative">
        <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
          🎯 Custom Code (optional)
        </label>
        <div className="relative">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="mycode"
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md disabled:bg-gray-50 font-mono"
            disabled={loading}
            maxLength={8}
          />
          {code && validateCode(code) && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-xl">✓</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <span>💡</span>
          <span>6-8 alphanumeric characters or leave empty for auto-generation</span>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3 animate-slide-in shadow-sm">
          <span className="text-2xl">⚠️</span>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-5 py-4 rounded-xl flex items-center gap-3 animate-slide-in shadow-sm">
          <span className="text-2xl">🎉</span>
          <span className="font-medium">Link created successfully!</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] btn-shine text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Creating Magic...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ Create Short Link
          </span>
        )}
      </button>
    </form>
  );
}

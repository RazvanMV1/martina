'use client';

import { useState } from 'react';

export default function UnsubscribeForm({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async () => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid link. Please use the unsubscribe link from your email.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center" role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-7 h-7 text-emerald-400"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2">You&apos;re unsubscribed.</p>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          You won&apos;t receive any more emails from us.{' '}
          <span className="text-gray-500">
            If you change your mind, you&apos;re always welcome back.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-4">
      <button
        onClick={handleUnsubscribe}
        disabled={status === 'loading'}
        className="
          w-full px-8 py-4
          bg-gray-800 hover:bg-gray-700 active:scale-[0.97]
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white font-bold text-sm tracking-wider uppercase
          rounded-xl
          transition-all duration-200
          border border-gray-700 hover:border-gray-600
          flex items-center justify-center gap-2
        "
        aria-label="Confirm unsubscribe"
      >
        {status === 'loading' ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4zm2 6.93A8.003 8.003 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          'Confirm Unsubscribe'
        )}
      </button>

      {status === 'error' && (
        <p className="text-red-400 text-xs text-center" role="alert">
          {message}
        </p>
      )}

      <p className="text-xs text-gray-700 text-center">
        This action is immediate and cannot be undone.
      </p>
    </div>
  );
}

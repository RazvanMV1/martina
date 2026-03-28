// components/SubscribeForm.tsx
'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';

interface SubscribeFormProps {
  onSuccess: () => void;
}

export default function SubscribeForm({ onSuccess }: SubscribeFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState({
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'none',
      utm_campaign: params.get('utm_campaign') || 'none',
    });
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), ...utmParams }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      onSuccess();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, utmParams, onSuccess]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
        aria-label="Email capture form"
      >
        <label htmlFor="email-input" className="sr-only">Your email address</label>
        <input
          id="email-input"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Your email address"
          className="
            flex-1 px-4 py-3 rounded-xl
            bg-white/5 backdrop-blur-md
            border border-white/10
            text-white placeholder-gray-600 text-sm
            outline-none
            focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30
            transition-all duration-200
          "
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? 'form-error' : undefined}
        />
        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="
            px-5 py-3 rounded-xl
            bg-rose-600 hover:bg-rose-500 active:scale-[0.97]
            disabled:opacity-40 disabled:cursor-not-allowed
            text-white font-bold text-sm tracking-wider uppercase
            transition-all duration-200
            shadow-lg shadow-rose-900/40
            whitespace-nowrap cursor-pointer
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400
          "
        >
          {isLoading ? <Spinner /> : 'Request Access'}
        </button>
      </form>

      {error && (
        <p id="form-error" className="mt-2 text-sm text-rose-400 font-medium" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2" aria-label="Loading">
      <svg
        className="animate-spin w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Sending...
    </span>
  );
}

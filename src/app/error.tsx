'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external service or console
    console.error('Next.js Caught Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A1628] text-white p-6 text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-4">React Crash Detected</h2>
      <p className="text-gray-400 mb-4">We intercepted the following fatal runtime error:</p>
      
      <div className="bg-gray-900 border border-red-500/30 p-4 rounded-xl text-left font-mono text-sm text-red-400 overflow-auto w-full max-w-2xl break-all">
        <p className="font-bold mb-2">{error.name}: {error.message}</p>
        <pre className="text-xs opacity-70 whitespace-pre-wrap">{error.stack}</pre>
        {error.digest && <p className="mt-2 text-xs opacity-50">Digest: {error.digest}</p>}
      </div>

      <button
        className="mt-8 bg-[#34D1BF] text-[#0A1628] px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#34D1BF]/20 transition-all"
        onClick={() => reset()}
      >
        Attempt Recovery
      </button>
    </div>
  );
}

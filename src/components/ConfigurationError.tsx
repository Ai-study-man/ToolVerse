'use client';

interface ConfigurationErrorProps {
  title: string;
  message: string;
}

export default function ConfigurationError({ title, message }: ConfigurationErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-8 text-red-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        
        {/* Error Message */}
        <p className="text-xl text-white/80 mb-8">{message}</p>

        {/* Setup Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-8 text-left">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Setup Guide
          </h2>
          <ol className="text-white/90 space-y-3 list-decimal list-inside">
            <li>
              <strong>Get Supabase credentials:</strong>
              <div className="ml-6 mt-1 text-sm text-white/70">
                Login to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">supabase.com</a> → Your Project → Settings → API
              </div>
            </li>
            <li>
              <strong>Set environment variables in Vercel:</strong>
              <div className="ml-6 mt-1 text-sm text-white/70">
                Vercel Dashboard → Your Project → Settings → Environment Variables
              </div>
            </li>
            <li>
              <strong>Add these variables:</strong>
              <div className="ml-6 mt-2 space-y-2">
                <div className="bg-black/20 rounded p-3 font-mono text-sm">
                  <div className="text-green-400">NEXT_PUBLIC_SUPABASE_URL</div>
                  <div className="text-gray-400">https://your-project-id.supabase.co</div>
                </div>
                <div className="bg-black/20 rounded p-3 font-mono text-sm">
                  <div className="text-green-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                  <div className="text-gray-400">your-anon-public-key</div>
                </div>
              </div>
            </li>
            <li>
              <strong>Redeploy your application</strong>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 22.525H0l12-21.05 12 21.05z"/>
              </svg>
              Open Vercel Dashboard
            </a>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.362 9.354H12c-.696 0-1.26-.564-1.26-1.26V.637c0-.696.564-1.26 1.26-1.26h9.362c.696 0 1.26.564 1.26 1.26v7.457c0 .696-.564 1.26-1.26 1.26z"/>
                <path d="M.638 14.646H10c.696 0 1.26.564 1.26 1.26v7.457c0 .696-.564 1.26-1.26 1.26H.638c-.696 0-1.26-.564-1.26-1.26v-7.457c0-.696.564-1.26 1.26-1.26z"/>
              </svg>
              Open Supabase Dashboard
            </a>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Page
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-white/60">
            Need more help? Check our{' '}
            <a href="/docs/SUPABASE_RLS_GUIDE.md" className="text-blue-400 hover:text-blue-300">
              setup documentation
            </a>{' '}
            or{' '}
            <a href="/debug" className="text-blue-400 hover:text-blue-300">
              debug page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <section className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center my-16">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Welcome to the community!</h3>
          <p className="text-green-100">
            Thank you for subscribing. You&apos;ll receive our latest AI tools insights in your inbox.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-500 rounded-2xl p-8 text-white my-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-4">
            Never Miss an AI Breakthrough
          </h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join 25,000+ professionals getting weekly AI tools insights, tutorials, and exclusive reviews delivered to their inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Subscribing...
                </div>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Weekly AI insights</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Exclusive tutorials</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>No spam, ever</span>
          </div>
        </div>

        <p className="text-xs text-blue-200 mt-4">
          Join professionals from Google, Microsoft, OpenAI, and 500+ other companies.
          Unsubscribe at any time with one click.
        </p>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-8 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
      </div>
    </section>
  );
}

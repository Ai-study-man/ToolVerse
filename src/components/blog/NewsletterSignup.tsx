export default function NewsletterSignup() {
  return (
    <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white my-16 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-4">
            Never Miss an AI Breakthrough
          </h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            Subscribe to our newsletter for the latest AI tools reviews, tutorials, and industry
            insights delivered to your inbox.
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex flex-col sm:flex-row gap-3 opacity-60 pointer-events-none">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200"
                disabled
              />
            </div>
            <button
              className="px-6 py-3 bg-white/50 text-blue-600 font-semibold rounded-lg cursor-not-allowed"
              disabled
            >
              Subscribe
            </button>
          </div>
          
          {/* Coming Soon Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full px-4 py-2 text-orange-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-blue-100 opacity-75">
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

        <p className="text-xs text-blue-200 mt-4 opacity-75">
          We&apos;re working hard to bring you an amazing newsletter experience. Stay tuned!
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

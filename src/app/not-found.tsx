'use client';

import Header from '../components/Header';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            Perhaps you&apos;ve mistyped the URL? Be sure to check your spelling.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Go Home
            </a>
            <a
              href="/tools"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse Tools
            </a>
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
              <a href="/" className="text-primary-600 hover:text-primary-700">
                Home
              </a>
              <a href="/tools" className="text-primary-600 hover:text-primary-700">
                All Tools
              </a>
              <a href="#submit" className="text-primary-600 hover:text-primary-700">
                Submit Tool
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

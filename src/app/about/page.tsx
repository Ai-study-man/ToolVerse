'use client';

import Header from '../../components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About ToolVerse</h1>
        <div className="prose max-w-4xl">
          <p className="text-lg text-gray-600 mb-6">
            ToolVerse is your ultimate destination for discovering and exploring the best AI tools available today.
          </p>
          <p className="text-gray-600 mb-6">
            We curate and review AI tools across various categories to help you find the perfect solution for your needs.
          </p>
        </div>
      </div>
    </div>
  );
}

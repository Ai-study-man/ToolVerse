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

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-lg p-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about AI tools and our directory
            </p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What are the best free AI tools available?
              </h3>
              <p className="text-gray-600">
                Some of the best free AI tools include ChatGPT (free tier), Claude, Google Gemini, 
                Canva AI, and numerous open-source alternatives. Our directory features over 200+ 
                free AI tools across different categories including writing, image generation, 
                coding, and productivity.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I choose the right AI tool for my business?
              </h3>
              <p className="text-gray-600">
                Consider your specific needs, budget, team size, and technical requirements. 
                Use our category filters to browse AI tools by function (e.g., customer service, 
                content creation, data analysis). Read user reviews and compare features to make 
                an informed decision.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are there good alternatives to ChatGPT?
              </h3>
              <p className="text-gray-600">
                Yes! Popular ChatGPT alternatives include Claude (Anthropic), Google Gemini, 
                Microsoft Copilot, Perplexity AI, and many specialized AI assistants. Each has 
                unique strengths - browse our conversational AI category to compare features and pricing.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What&apos;s the difference between free and paid AI tools?
              </h3>
              <p className="text-gray-600">
                Free AI tools typically have usage limits, fewer features, or basic functionality. 
                Paid versions offer unlimited usage, advanced features, priority support, and often 
                better performance. Many tools offer freemium models with free trials to test before upgrading.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How often is the AI tools directory updated?
              </h3>
              <p className="text-gray-600">
                We update our directory daily with new AI tools, reviews, and pricing information. 
                Our team continuously monitors the AI landscape to ensure you have access to the 
                latest and most innovative AI solutions for your needs.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

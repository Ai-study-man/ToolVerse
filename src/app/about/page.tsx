'use client';

import Header from '../../components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">About ToolVerse</h1>
          
          <div className="text-center mb-12">
            <p className="text-xl text-white/90 mb-8">
              ToolVerse is your gateway to the ever-expanding universe of AI tools.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              We built ToolVerse to solve a common problem: finding the right AI tool shouldn't feel overwhelming. 
              With new apps launching every day, it's easy to get lost. That's why we created a smarter way to 
              explore, compare, and choose the tools that truly matter.
            </p>
            
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">On ToolVerse, you'll find:</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌍</div>
                  <div>
                    <p className="text-white font-medium">Curated AI tools</p>
                    <p className="text-white/70">— organized by use case, not just buzz.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <p className="text-white font-medium">Real insights</p>
                    <p className="text-white/70">— reviews, benchmarks, and practical tips.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📈</div>
                  <div>
                    <p className="text-white font-medium">Smarter discovery</p>
                    <p className="text-white/70">— AI-powered recommendations tailored to your needs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              Our mission is simple: make AI accessible, practical, and valuable for everyone.
            </p>
            
            <p className="text-white/90 text-lg leading-relaxed mb-6">
              Whether you're a creator, developer, or business leader, ToolVerse helps you stay ahead 
              of the curve — discovering tools that save time, spark ideas, and unlock new possibilities.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-accent-600/20 backdrop-blur-sm border border-accent-400/30 rounded-xl px-8 py-4">
              <div className="text-3xl">🚀</div>
              <p className="text-white font-medium text-lg">
                Join us as we map the AI universe, one tool at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

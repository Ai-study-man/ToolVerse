'use client';

import Header from '../../components/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h1>
          <p className="text-lg text-white/90 mb-8 text-center">
            Have questions or want to suggest a tool? We&apos;d love to hear from you!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent" 
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent" 
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea 
                  rows={5} 
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent resize-none" 
                  placeholder="Tell us about your question, suggestion, or feedback..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-accent-600 hover:bg-accent-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

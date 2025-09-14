'use client';

import Header from '../../components/Header';

export default function SubmitToolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Submit Your AI Tool
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Help the community discover amazing AI tools! Submit your tool for review and inclusion in our directory.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="toolName" className="block text-sm font-medium text-white mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="toolName"
                  name="toolName"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                  placeholder="Enter tool name"
                />
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-white mb-2">
                Short Description *
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                required
                maxLength={100}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="Brief description in one sentence (max 100 characters)"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Full Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="Detailed description of your AI tool, its features, and benefits"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>Select a category</option>
                  <option value="Writing & Content" style={{ backgroundColor: '#1e293b', color: 'white' }}>Writing & Content</option>
                  <option value="Design & Art" style={{ backgroundColor: '#1e293b', color: 'white' }}>Design & Art</option>
                  <option value="Development" style={{ backgroundColor: '#1e293b', color: 'white' }}>Development</option>
                  <option value="Business & Analytics" style={{ backgroundColor: '#1e293b', color: 'white' }}>Business & Analytics</option>
                  <option value="Marketing & SEO" style={{ backgroundColor: '#1e293b', color: 'white' }}>Marketing & SEO</option>
                  <option value="Video & Audio" style={{ backgroundColor: '#1e293b', color: 'white' }}>Video & Audio</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="pricingModel" className="block text-sm font-medium text-white mb-2">
                  Pricing Model *
                </label>
                <select
                  id="pricingModel"
                  name="pricingModel"
                  required
                  className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1e293b', color: 'white' }}>Select pricing model</option>
                  <option value="free" style={{ backgroundColor: '#1e293b', color: 'white' }}>Free</option>
                  <option value="freemium" style={{ backgroundColor: '#1e293b', color: 'white' }}>Freemium</option>
                  <option value="paid" style={{ backgroundColor: '#1e293b', color: 'white' }}>Paid</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="pricing" className="block text-sm font-medium text-white mb-2">
                Pricing Details
              </label>
              <input
                type="text"
                id="pricing"
                name="pricing"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="e.g., Free / $10/month, $29-59/month"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="Enter tags separated by commas (e.g., AI, Writing, Productivity)"
              />
            </div>

            <div>
              <label htmlFor="features" className="block text-sm font-medium text-white mb-2">
                Key Features
              </label>
              <textarea
                id="features"
                name="features"
                rows={3}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="List key features, one per line"
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-white mb-2">
                Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="Link to your tool's logo (optional)"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Your Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30"
                placeholder="your@email.com"
              />
            </div>

            <div className="bg-white/10 border border-white/20 rounded-md p-4">
              <h3 className="text-sm font-medium text-white mb-2">Review Process</h3>
              <p className="text-sm text-white/80">
                All submissions are manually reviewed by our team. We&apos;ll contact you within 3-5 business days 
                with the status of your submission. Tools that meet our quality standards will be added to the directory.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-3 border border-white/20 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-white/90 transition-colors font-semibold"
              >
                Submit Tool
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

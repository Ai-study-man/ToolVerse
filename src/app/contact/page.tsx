'use client';

import Header from '../../components/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="max-w-2xl">
          <p className="text-lg text-gray-600 mb-8">
            Have questions or want to suggest a tool? We&apos;d love to hear from you!
          </p>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows={5} className="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
              </div>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Header from '../../components/Header';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using ToolVerse, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-4">
                ToolVerse is a platform that provides information about AI tools, including descriptions, features, pricing, 
                and user reviews. We aim to help users discover and evaluate AI tools that best suit their needs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Account and Registration</h2>
              <p className="text-gray-600 mb-4">
                To access certain features of our service, you may be required to register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-600 mb-4">
                You agree not to use ToolVerse to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the service</li>
                <li>Use automated scripts or bots to scrape or harvest data</li>
                <li>Submit false or misleading information about AI tools</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Content and Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                ToolVerse respects intellectual property rights. The content on our platform, including but not limited to 
                text, graphics, logos, and software, is owned by ToolVerse or our content suppliers and is protected by 
                copyright and other intellectual property laws.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">User-Generated Content</h3>
              <p className="text-gray-600 mb-4">
                By submitting content to ToolVerse, you grant us a non-exclusive, worldwide, royalty-free license to use, 
                modify, and display such content in connection with our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-600 mb-4">
                ToolVerse may contain links to third-party websites or services. We are not responsible for the content, 
                privacy policies, or practices of any third-party sites or services. You acknowledge and agree that we shall 
                not be responsible for any damage or loss caused by your use of any third-party content or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Disclaimers and Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                ToolVerse is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, 
                and hereby disclaim all other warranties including implied warranties of merchantability, fitness for a 
                particular purpose, or non-infringement.
              </p>
              <p className="text-gray-600 mb-4">
                In no event shall ToolVerse be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Indemnification</h2>
              <p className="text-gray-600 mb-4">
                You agree to defend, indemnify, and hold harmless ToolVerse and its affiliates from and against any claims, 
                damages, obligations, losses, liabilities, costs, or debt arising from your use of the service or violation 
                of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Termination</h2>
              <p className="text-gray-600 mb-4">
                We may terminate or suspend your account and access to the service immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try 
                to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which ToolVerse operates, 
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-800 font-medium">ToolVerse Legal Team</p>
                <p className="text-gray-600">Email: jiayuanliu24@gmail.com</p>
                <p className="text-gray-600">Website: https://www.toolsverse.tools/</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

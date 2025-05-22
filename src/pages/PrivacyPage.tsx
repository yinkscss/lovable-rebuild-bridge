
import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>IMPORTANT:</strong> This is a demo site created for practice purposes only. No actual services are provided, and we strongly advise against submitting real personal information or making payments through this platform.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              For demonstration purposes, this website may collect personal information such as:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">Name and contact information</li>
              <li className="mb-2">Financial details (for demonstration only)</li>
              <li className="mb-2">Account information</li>
              <li className="mb-2">Log data and usage information</li>
            </ul>
            <p className="text-gray-700 mb-4">
              As this is a demo site, we strongly recommend not providing real personal information. Any information submitted is used solely for demonstrating the website's functionality.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              In a real-world scenario, collected information would typically be used to:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">Provide and maintain our service</li>
              <li className="mb-2">Improve user experience</li>
              <li className="mb-2">Communicate with you</li>
              <li className="mb-2">Comply with legal obligations</li>
            </ul>
            <p className="text-gray-700 mb-4">
              However, as this is a demonstration site, any information submitted is not actually processed for these purposes.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information. However, as this is a demonstration site, we strongly advise against submitting sensitive personal information.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">5. Third-Party Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your information to outside parties. This is a demonstration site and any information submitted is not shared with third parties.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              In accordance with data protection laws, you would typically have rights regarding your personal information, including:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">Right to access your data</li>
              <li className="mb-2">Right to rectification</li>
              <li className="mb-2">Right to erasure</li>
              <li className="mb-2">Right to restrict processing</li>
              <li className="mb-2">Right to data portability</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">7. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              This website is created for demonstration purposes only. The developer built this site as a portfolio project and does not collect or process real user data for commercial purposes. Do not make payments or submit sensitive personal information through this platform.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at demo@example.com.
            </p>
            
            <p className="text-gray-500 italic mt-8">Last updated: May 22, 2025</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;

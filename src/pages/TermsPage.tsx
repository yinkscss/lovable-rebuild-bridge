
import React from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to National Debt Relief. These Terms of Service govern your use of our website and the services we provide. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the website.
            </p>
            <p className="text-gray-700 mb-4">
              This website is a demonstration project created for educational and portfolio purposes only. No actual debt relief services are offered through this platform.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">2. Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              This is a demo site created for practice purposes only. No actual payments should be made through this site. The developer built this site as a personal project and does not take responsibility for any actions taken by individuals who might clone or replicate this site.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>IMPORTANT:</strong> Do not make any payments to anyone claiming to represent the National Debt Relief team through this website. This is not a legitimate debt relief service.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">3. Use License</h2>
            <p className="text-gray-700 mb-4">
              Permission is granted to temporarily view the materials on this website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700">
              <li className="mb-2">Modify or copy the materials;</li>
              <li className="mb-2">Use the materials for any commercial purpose or for any public display;</li>
              <li className="mb-2">Attempt to reverse engineer any software contained on the website;</li>
              <li className="mb-2">Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">4. Limitations</h2>
            <p className="text-gray-700 mb-4">
              In no event shall this website or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website, even if the website or a representative has been notified orally or in writing of the possibility of such damage.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">5. Revisions and Errata</h2>
            <p className="text-gray-700 mb-4">
              The materials appearing on this website could include technical, typographical, or photographic errors. This website does not warrant that any of the materials on its website are accurate, complete, or current. The website may make changes to the materials contained on its website at any time without notice.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">6. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
            
            <h2 className="text-xl font-semibold mb-4 mt-8">7. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms, please contact us at demo@example.com.
            </p>
            
            <p className="text-gray-500 italic mt-8">Last updated: May 22, 2025</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;

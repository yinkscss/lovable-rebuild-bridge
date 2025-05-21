import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const ApplicationSuccessPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for applying to National Debt Relief. Our team will review your application and contact you shortly to discuss the next steps.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">What happens next?</h2>
              <ol className="text-left list-decimal list-inside space-y-2">
                <li>A debt relief specialist will call you within 24 hours to review your application</li>
                <li>We'll create a personalized debt relief plan based on your financial situation</li>
                <li>Once approved, you'll start making deposits into your dedicated account</li>
                <li>We'll begin negotiating with your creditors to reduce your debt</li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/">
                <Button variant="outline" size="lg">
                  Return to Home
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="primary" size="lg">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationSuccessPage;
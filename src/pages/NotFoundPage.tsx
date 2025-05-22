
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-[70vh] flex items-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
            <div className="h-1 w-16 bg-blue-600 mx-auto mb-6"></div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              We're sorry, but the page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" size="lg" icon={<Home className="h-5 w-5" />}>
                  Back to Home
                </Button>
              </Link>
              <Link to="/apply">
                <Button variant="outline" size="lg">
                  Apply for Debt Relief
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

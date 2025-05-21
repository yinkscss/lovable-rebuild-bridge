import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Book, Calculator, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResourcesPage: React.FC = () => {
  const { category } = useParams();

  const categories = {
    guides: {
      title: 'Debt Relief Guides',
      icon: <Book className="h-8 w-8" />,
      items: [
        { title: 'Understanding Debt Settlement', link: '/resources/guides/debt-settlement' },
        { title: 'Credit Card Debt Relief', link: '/resources/guides/credit-card-debt' },
        { title: 'Medical Debt Solutions', link: '/resources/guides/medical-debt' },
        { title: 'Personal Loan Options', link: '/resources/guides/personal-loans' }
      ]
    },
    calculator: {
      title: 'Debt Calculator',
      icon: <Calculator className="h-8 w-8" />,
      items: [
        { title: 'Debt Payoff Calculator', link: '/resources/calculator/payoff' },
        { title: 'Debt Consolidation Calculator', link: '/resources/calculator/consolidation' },
        { title: 'Interest Savings Calculator', link: '/resources/calculator/interest' }
      ]
    },
    faqs: {
      title: 'Frequently Asked Questions',
      icon: <HelpCircle className="h-8 w-8" />,
      items: [
        { title: 'Program Questions', link: '/resources/faqs/program' },
        { title: 'Payment Questions', link: '/resources/faqs/payments' },
        { title: 'Credit Impact', link: '/resources/faqs/credit' },
        { title: 'Legal Questions', link: '/resources/faqs/legal' }
      ]
    },
    forms: {
      title: 'Forms & Documents',
      icon: <FileText className="h-8 w-8" />,
      items: [
        { title: 'Program Agreement', link: '/resources/forms/agreement' },
        { title: 'Authorization Forms', link: '/resources/forms/authorization' },
        { title: 'Privacy Policy', link: '/resources/forms/privacy' }
      ]
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Resources</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categories).map(([key, section]) => (
              <div key={key} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-3">{section.icon}</div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="text-gray-600 hover:text-blue-600 block py-1"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Debt Relief Guide</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive guide to understanding debt relief options and choosing the right solution.
                </p>
                <Link
                  to="/resources/guides/debt-relief"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Read More →
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Debt Calculator</h3>
                <p className="text-gray-600 mb-4">
                  Calculate your potential savings and see how long it will take to become debt-free.
                </p>
                <Link
                  to="/resources/calculator"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Try Calculator →
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">FAQ Center</h3>
                <p className="text-gray-600 mb-4">
                  Find answers to common questions about our debt relief program.
                </p>
                <Link
                  to="/resources/faqs"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View FAQs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
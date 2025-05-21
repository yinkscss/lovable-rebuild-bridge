import React from 'react';
import Layout from '../components/layout/Layout';
import { FileText, CircleDollarSign, CheckCircle, PhoneCall } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <PhoneCall className="h-12 w-12 text-blue-500" />,
    title: 'Free Consultation',
    description: 'Our debt specialists evaluate your situation and determine if our program is right for you.',
    details: [
      'Review your current debt situation',
      'Explain how debt relief works',
      'Answer all your questions',
      'Create a preliminary savings estimate'
    ]
  },
  {
    icon: <FileText className="h-12 w-12 text-blue-500" />,
    title: 'Enroll & Start Saving',
    description: 'Begin making monthly deposits into your dedicated FDIC-insured account.',
    details: [
      'Set up your secure account',
      'Choose affordable monthly payment',
      'Start building your settlement fund',
      'Track your progress online'
    ]
  },
  {
    icon: <CircleDollarSign className="h-12 w-12 text-blue-500" />,
    title: 'We Negotiate',
    description: 'Our expert negotiators work with your creditors to reduce what you owe.',
    details: [
      'Professional debt negotiation',
      'Creditor communication handled for you',
      'Settlements documented in writing',
      'Regular progress updates'
    ]
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-blue-500" />,
    title: 'Debt Freedom',
    description: 'Watch your debts get resolved one by one until you\'re debt-free.',
    details: [
      'Debts settled individually',
      'Typically 24-48 months',
      'Save significantly vs. paying in full',
      'Graduate debt-free'
    ]
  }
];

const HowItWorksPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How National Debt Relief Works
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Our proven process has helped over 500,000 Americans become debt-free
            </p>
            <Link to="/apply">
              <Button variant="primary" size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-50 rounded-full p-4 mr-4">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold">
                    Step {index + 1}: {step.title}
                  </h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: 'How much does the program cost?',
                answer: 'There are no upfront fees. We only get paid when we successfully negotiate your debt. Our fee is a percentage of the amount we save you and is only charged after a settlement is reached.'
              },
              {
                question: 'How long does the program take?',
                answer: 'Most clients complete the program in 24-48 months, depending on their debt amount and how much they can save each month.'
              },
              {
                question: 'Will this affect my credit?',
                answer: 'Debt settlement may impact your credit score initially, but many clients find that resolving their debt puts them in a better position to rebuild their credit over time.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Debt-Free Journey?
          </h2>
          <p className="text-xl mb-8">
            Take the first step towards financial freedom today.
          </p>
          <Link to="/apply">
            <Button variant="primary" size="lg">
              Get Your Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorksPage;
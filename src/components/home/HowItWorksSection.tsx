import React from 'react';
import { PhoneCall, FileText, CircleDollarSign, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <PhoneCall className="h-12 w-12 text-blue-500" />,
    title: 'Free Consultation',
    description: 'Speak with a debt relief specialist who will evaluate your situation and determine if our program can help you.'
  },
  {
    icon: <FileText className="h-12 w-12 text-blue-500" />,
    title: 'Enroll In The Program',
    description: 'If you qualify, you\'ll begin making monthly deposits into an FDIC-insured account you control.'
  },
  {
    icon: <CircleDollarSign className="h-12 w-12 text-blue-500" />,
    title: 'We Negotiate Your Debt',
    description: 'Our experienced negotiators work with your creditors to reduce the total amount you owe.'
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-blue-500" />,
    title: 'Become Debt-Free',
    description: 'Once your debts are settled, you\'ll be on your way to a fresh financial start.'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How National Debt Relief Works
          </h2>
          <p className="text-lg text-gray-600">
            Our proven process has helped hundreds of thousands of Americans resolve their debt
            and regain financial control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-1/2 w-full h-[2px] bg-gray-200">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-200 rotate-45"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Step {index + 1}: {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="mr-4">
              Learn More
            </Button>
          </Link>
          <Link to="/apply">
            <Button variant="primary" size="lg">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
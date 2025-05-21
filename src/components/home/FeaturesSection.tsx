import React from 'react';
import { ShieldCheck, Clock, PiggyBank, Award } from 'lucide-react';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
    title: 'No Upfront Fees',
    description: 'You don\'t pay National Debt Relief until your debt is resolved.'
  },
  {
    icon: <Clock className="h-10 w-10 text-blue-500" />,
    title: 'Quicker Than Paying Minimums',
    description: 'Become debt-free faster than making minimum payments on your own.'
  },
  {
    icon: <PiggyBank className="h-10 w-10 text-blue-500" />,
    title: 'One Low Monthly Program Payment',
    description: 'Consolidate multiple debt payments into one affordable monthly program payment.'
  },
  {
    icon: <Award className="h-10 w-10 text-blue-500" />,
    title: 'Rated A+ by the BBB',
    description: 'We maintain the highest standards of customer satisfaction and results.'
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose National Debt Relief?
          </h2>
          <p className="text-lg text-gray-600">
            Over 600,000 Americans have trusted us to help them become debt-free.
            Here's what makes our program different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
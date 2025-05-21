import React from 'react';
import Layout from '../components/layout/Layout';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../lib/constants';
import { formatCurrency } from '../utils/formatters';

const ClientStoriesPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Stories from Real Clients
            </h1>
            <p className="text-xl text-blue-100">
              See how we've helped thousands of people overcome their debt and achieve financial freedom
            </p>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start mb-4">
                    <Quote className="h-8 w-8 text-blue-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-600 italic">{testimonial.quote}</p>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Total Debt</p>
                        <p className="text-lg font-semibold">{formatCurrency(testimonial.totalDebt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Payment</p>
                        <p className="text-lg font-semibold">{formatCurrency(testimonial.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Program Length</p>
                        <p className="text-lg font-semibold">{testimonial.programLength} Months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Savings</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(testimonial.totalSavings)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stats */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Success by the Numbers</h2>
            <p className="text-xl text-gray-600">
              We've helped thousands of clients achieve financial freedom
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Clients Helped', value: '500,000+' },
              { label: 'Total Debt Resolved', value: '$10 Billion+' },
              { label: 'Average Savings', value: '30-50%' },
              { label: 'Client Satisfaction', value: '4.8/5' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

  
    </Layout>
  );
};

export default ClientStoriesPage;
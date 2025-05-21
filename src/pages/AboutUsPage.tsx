import React from 'react';
import Layout from '../components/layout/Layout';
import { Shield, Users, Award, Clock } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative bg-blue-900 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About National Debt Relief
              </h1>
              <p className="text-xl text-blue-100">
                We've helped over 500,000 Americans resolve their debt and regain financial stability.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                At National Debt Relief, our mission is to help hardworking Americans overcome their financial challenges and work toward a debt-free future. We believe everyone deserves a second chance at financial success.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust & Integrity</h3>
                <p className="text-gray-600">
                  We maintain the highest standards of honesty and transparency in all our dealings.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Client First</h3>
                <p className="text-gray-600">
                  Your success is our success. We're dedicated to finding the best solution for your needs.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service and results.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <Clock className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Commitment</h3>
                <p className="text-gray-600">
                  We're committed to helping you achieve long-term financial stability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Stats */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
                <p className="text-gray-600">Clients Helped</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$10B+</div>
                <p className="text-gray-600">Debt Resolved</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <p className="text-gray-600">Years of Experience</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">A+</div>
                <p className="text-gray-600">BBB Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Certifications</h2>
            <div className="flex justify-center space-x-8">
              <img src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg" alt="BBB A+ Rating" className="h-20 object-contain" />
              <img src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg" alt="AFCC Member" className="h-20 object-contain" />
              <img src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg" alt="IAPDA Certified" className="h-20 object-contain" />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Leadership Team</h2>
              <p className="text-lg text-gray-600">
                Meet the experienced professionals dedicated to helping you achieve financial freedom.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <div key={index} className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                    <img
                      src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400`}
                      alt={`Team Member ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">John Smith</h3>
                  <p className="text-gray-600">Chief Executive Officer</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUsPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NAV_ITEMS, COMPANY_PHONE } from '../../lib/constants';
import Logo from './Logo';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Lock } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

const Footer: React.FC = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div>
            <Logo className="h-12 w-auto mb-4" />
            <p className="text-gray-300 mb-4">
              National Debt Relief helps consumers address overwhelming debt with a proven debt relief program that can help you resolve your debt for less than you owe.
            </p>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <a href={`tel:${COMPANY_PHONE.replace(/-/g, '')}`} className="text-gray-300 hover:text-white">
                {COMPANY_PHONE}
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <a href="mailto:info@nationaldebtrelief.com" className="text-gray-300 hover:text-white">
                info@nationaldebtrelief.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-gray-300 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/resources/guides" className="text-gray-300 hover:text-white">
                  Debt Relief Guides
                </Link>
              </li>
              <li>
                <Link to="/resources/faqs" className="text-gray-300 hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/resources/calculator" className="text-gray-300 hover:text-white">
                  Debt Calculator
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-300 hover:text-white">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Trust Indicators */}
          <div>
            <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Certifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg"
                alt="Forbes Advisor"
                className="h-12 object-contain bg-white rounded p-2"
              />
              <img
                src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg"
                alt="Bankrate"
                className="h-12 object-contain bg-white rounded p-2"
              />
              <img
                src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg"
                alt="BBB A+ Rating"
                className="h-12 object-contain bg-white rounded p-2"
              />
              <img
                src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg"
                alt="AFCC Member"
                className="h-12 object-contain bg-white rounded p-2"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} National Debt Relief. All Rights Reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-white text-sm">
                Disclaimer
              </Link>
              <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm">
                Accessibility
              </Link>
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-gray-400 hover:text-white text-sm flex items-center"
              >
                <Lock className="h-3 w-3 mr-1" />
                Admin
              </button>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            National Debt Relief does not assume debt, make monthly payments to creditors or provide tax, bankruptcy, accounting or legal advice. Our service is not available in all states and our fees may vary from state to state. Please contact a tax professional to discuss potential tax consequences of less than full balance debt resolution. Read and understand all program materials prior to enrollment. National Debt Relief is BBB Accredited.
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        defaultMode="signin"
      />
    </footer>
  );
};

export default Footer;
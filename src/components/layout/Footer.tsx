import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, COMPANY_PHONE } from '../../lib/constants';
import Logo from './Logo';
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Lock } from 'lucide-react';
const Footer: React.FC = () => {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    navigate('/admin/auth');
  };
  return <footer className="bg-gray-900 text-white">
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
              {NAV_ITEMS.map(item => <li key={item.label}>
                  <Link to={item.path} className="text-gray-300 hover:text-white">
                    {item.label}
                  </Link>
                </li>)}
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
              <img alt="Forbes Advisor" className="h-12 bg-white rounded p-2 object-fill" src="/lovable-uploads/92916aa2-358b-4c1e-a9ac-b389b6316169.png" />
              <img alt="Bankrate" src="https://images.ctfassets.net/5xdc9rzhmhnq/2w76p4cNJtyPzBIB2ksKPF/aa2c8cde64b9ab878b081a8103a2f987/Wall_street_journal_logo.svg" className="h-12 bg-white rounded p-2 object-fill" />
              <img alt="BBB A+ Rating" className="h-12 bg-white rounded p-2 object-fill" src="https://start.nationaldebtrelief.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F5xdc9rzhmhnq%2F5tJzAk64KVtKPW0nJifBB0%2Feec2e8a4260d5e08b7dafa41e80b06eb%2Fimage__9_.png%3Fw%3D120%26fm%3Dwebp%26fit%3Dfill&w=256&q=75" />
              <img alt="AFCC Member" src="https://images.ctfassets.net/5xdc9rzhmhnq/5Lu8G1TwoxMc3Qu8cXSeV/c0b2d4eeeb3c79e961ef13aeb776c353/NDR-Badge-2025__1_-99-__3_.svg" className="h-12 bg-white rounded p-2 object-fill" />
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
              <button onClick={handleAdminClick} className="text-gray-400 hover:text-white text-sm flex items-center">
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
    </footer>;
};
export default Footer;
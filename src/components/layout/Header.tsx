import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, LogOut } from 'lucide-react';
import { NAV_ITEMS, COMPANY_PHONE } from '../../lib/constants';
import Button from '../ui/Button';
import Logo from './Logo';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/account');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative group">
                {item.dropdownItems ? (
                  <>
                    <button
                      className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => toggleDropdown(item.label)}
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute z-10 left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                        <div className="py-1">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setActiveDropdown(null)}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section with Account and Phone */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={handleAccountClick}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {user ? 'My Account' : 'Sign In'}
            </button>
            {user && (
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            )}
            <a 
              href={`tel:${COMPANY_PHONE.replace(/-/g, '')}`} 
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <Phone className="h-4 w-4 mr-1" />
              <span>{COMPANY_PHONE}</span>
            </a>
            <Link to="/apply">
              <Button variant="primary">Apply Now</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 lg:hidden">
            <div className="flex flex-col space-y-4 pb-4">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.dropdownItems ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => toggleDropdown(item.label)}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        } transition-transform`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="mt-2 ml-4 space-y-2">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              to={dropdownItem.path}
                              className="block text-gray-600 hover:text-blue-600"
                              onClick={() => {
                                setActiveDropdown(null);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleAccountClick();
                    setMobileMenuOpen(false);
                  }}
                  className="block text-blue-600 hover:text-blue-700 font-medium mb-2"
                >
                  {user ? 'My Account' : 'Sign In'}
                </button>
                {user && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-gray-600 hover:text-gray-800 font-medium mb-2 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </button>
                )}
                <a 
                  href={`tel:${COMPANY_PHONE.replace(/-/g, '')}`} 
                  className="flex items-center text-gray-700 hover:text-blue-600 mb-4"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{COMPANY_PHONE}</span>
                </a>
                <Link to="/apply" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" fullWidth>Apply Now</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileText, CreditCard, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import Logo from '../layout/Logo';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const sidebarItems = [
    { 
      path: '/admin/applications', 
      label: 'Applications', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      path: '/admin/payments', 
      label: 'Payment Methods', 
      icon: <CreditCard className="h-5 w-5" /> 
    },
    { 
      path: '/admin/users', 
      label: 'User Management', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-blue-900 text-white">
          <div className="flex items-center h-16 px-4 bg-blue-800">
            <Link to="/" className="flex items-center">
              <Logo className="text-white" />
            </Link>
          </div>
          <div className="h-0 flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md
                    ${isActive(item.path) 
                      ? 'bg-blue-800 text-white' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="px-2 py-4 border-t border-blue-800">
              <Link
                to="/logout"
                className="flex items-center px-4 py-3 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-800 hover:text-white"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col z-50 md:hidden w-64 bg-blue-900 text-white transition-transform transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 bg-blue-800">
          <Link to="/" className="flex items-center">
            <Logo className="text-white" />
          </Link>
          <button
            onClick={closeSidebar}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-md
                  ${isActive(item.path) 
                    ? 'bg-blue-800 text-white' 
                    : 'text-blue-100 hover:bg-blue-800 hover:text-white'}
                `}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="px-2 py-4 border-t border-blue-800">
            <Link
              to="/logout"
              onClick={closeSidebar}
              className="flex items-center px-4 py-3 text-sm font-medium text-blue-100 rounded-md hover:bg-blue-800 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={toggleSidebar}
            className="md:hidden px-4 text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <div className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none">
                  <span className="hidden md:inline-block">
                    <span className="text-gray-700 mr-2">Admin User</span>
                  </span>
                  <span className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs font-medium leading-none text-white">AU</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
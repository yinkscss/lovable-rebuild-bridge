
import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import Layout from '../components/layout/Layout';
import ApplicationStatus from '../components/dashboard/ApplicationStatus';
import UserProfileForm from '../components/dashboard/UserProfileForm';
import SupportForm from '../components/dashboard/SupportForm';
import UserApplicationsList from '../components/dashboard/UserApplicationsList';
import AccountDetailsFormComponent from '../components/dashboard/AccountDetailsForm';
import FinancialSummary from '../components/dashboard/FinancialSummary';
import { User, FileText, MessageSquare, Settings } from 'lucide-react';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'details' | 'profile' | 'support'>('applications');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | undefined>();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
            <p className="text-gray-600">You need to be signed in to access your dashboard.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'details', label: 'Account Details', icon: User },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'support', label: 'Support', icon: MessageSquare },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user.email}! Manage your applications and account settings.
            </p>
          </div>

          {/* Financial Summary - Always visible at the top */}
          <div className="mb-8">
            <FinancialSummary />
          </div>

          {/* Simplified Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap justify-center sm:justify-start space-x-4 sm:space-x-8 px-4 sm:px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content - Simplified Layout */}
          <div className="space-y-6">
            {activeTab === 'applications' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <UserApplicationsList
                    onSelectApplication={setSelectedApplicationId}
                    selectedApplicationId={selectedApplicationId}
                  />
                </div>
                <div className="lg:col-span-2">
                  {selectedApplicationId ? (
                    <ApplicationStatus applicationId={selectedApplicationId} />
                  ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
                      <p className="text-gray-500">Choose an application from the list to view its details and progress.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="max-w-4xl mx-auto">
                {selectedApplicationId ? (
                  <AccountDetailsFormComponent applicationId={selectedApplicationId} />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Application Selected</h3>
                    <p className="text-gray-500 mb-4">
                      Please select an application from the Applications tab to view account details.
                    </p>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Go to Applications →
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <UserProfileForm />
              </div>
            )}

            {activeTab === 'support' && (
              <div className="max-w-2xl mx-auto">
                <SupportForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;

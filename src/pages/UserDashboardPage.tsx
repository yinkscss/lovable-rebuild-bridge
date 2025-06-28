
import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import Layout from '../components/layout/Layout';
import ApplicationStatus from '../components/dashboard/ApplicationStatus';
import UserProfileForm from '../components/dashboard/UserProfileForm';
import SupportForm from '../components/dashboard/SupportForm';
import UserApplicationsList from '../components/dashboard/UserApplicationsList';
import AccountDetailsFormComponent from '../components/dashboard/AccountDetailsForm';
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user.email}! Manage your applications and account settings.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
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
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Select an application to view its details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div>
                {selectedApplicationId ? (
                  <AccountDetailsFormComponent applicationId={selectedApplicationId} />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Please select an application from the Applications tab to view account details
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <UserProfileForm />
            )}

            {activeTab === 'support' && (
              <SupportForm />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;

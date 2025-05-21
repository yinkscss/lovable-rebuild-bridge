
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Check, Clock, Edit, MessageSquare } from 'lucide-react';
import UserProfileForm from '../components/dashboard/UserProfileForm';
import SupportForm from '../components/dashboard/SupportForm';
import ApplicationStatus from '../components/dashboard/ApplicationStatus';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'support'>('overview');
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch the user's application
        const { data: applicationData, error: applicationError } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (applicationError) throw applicationError;
        setApplication(applicationData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to changes in the application status
    const channel = supabase
      .channel('public:applications')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'applications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Application updated:', payload);
          // Update the application status
          setApplication(payload.new);
          
          // Show notification on status change
          if (payload.old.status !== payload.new.status) {
            if (payload.new.status === 'approved') {
              toast.success('Your application has been approved!');
            } else if (payload.new.status === 'declined') {
              toast.error('Your application has been declined.');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <span className="ml-3">Loading dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {user?.user_metadata.first_name || 'User'}! Here's an overview of your account.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`py-4 px-1 ${
                  activeTab === 'support'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Customer Support
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              {application ? (
                <>
                  {/* Application Status Card */}
                  <Card className="mb-6 p-6">
                    <h2 className="text-xl font-semibold mb-4">Application Status</h2>
                    <ApplicationStatus application={application} />
                  </Card>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="p-6">
                      <h3 className="font-medium mb-2">Need Help?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Questions about your application? Contact our support team.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('support')}
                        icon={<MessageSquare className="h-4 w-4 mr-2" />}
                      >
                        Contact Support
                      </Button>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="font-medium mb-2">Update Information</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Need to update your personal information? Edit your profile.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('profile')}
                        icon={<Edit className="h-4 w-4 mr-2" />}
                      >
                        Edit Profile
                      </Button>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="font-medium mb-2">Application Details</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Debt Amount: ${application.debt_amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">No Application Found</h2>
                  <p className="text-gray-600 mb-6">
                    You haven't submitted an application yet. Start your debt relief journey today.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/apply')}
                  >
                    Apply Now
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
              <UserProfileForm />
            </Card>
          )}

          {activeTab === 'support' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
              <SupportForm />
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;

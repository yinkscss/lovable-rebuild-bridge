
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { 
  Edit, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Phone,
  Mail,
  FileText,
  CreditCard
} from 'lucide-react';
import UserProfileForm from '../components/dashboard/UserProfileForm';
import SupportForm from '../components/dashboard/SupportForm';
import ApplicationStatus from '../components/dashboard/ApplicationStatus';

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'support'>('overview');
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any | null>(null);
  const [debtAccounts, setDebtAccounts] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

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

        // Fetch debt accounts if application exists
        if (applicationData) {
          const { data: debtData, error: debtError } = await supabase
            .from('debt_accounts')
            .select('*')
            .eq('application_id', applicationData.id);

          if (debtError) throw debtError;
          setDebtAccounts(debtData || []);
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        setUserProfile(profileData);
        
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
          setApplication(payload.new);
          
          if (payload.old.status !== payload.new.status) {
            if (payload.new.status === 'approved') {
              toast.success('Congratulations! Your application has been approved!');
            } else if (payload.new.status === 'declined') {
              toast.error('Your application has been declined. Please contact support.');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);

  const calculateTotalDebt = () => {
    return debtAccounts.reduce((total, account) => total + (account.current_balance || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'declined': return 'text-red-600 bg-red-50 border-red-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5" />;
      case 'declined': return <AlertCircle className="h-5 w-5" />;
      case 'pending': return <Clock className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-lg">Loading your dashboard...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {userProfile?.first_name || user?.user_metadata?.first_name || 'Valued Client'}!
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Your personalized debt relief dashboard
                  </p>
                </div>
                {application && (
                  <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full border flex items-center ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="ml-2 font-semibold capitalize">{application.status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard Overview
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('support')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === 'support'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Customer Support
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {application ? (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      <div className="flex items-center">
                        <DollarSign className="h-8 w-8 mb-2" />
                        <div className="ml-4">
                          <p className="text-blue-100 text-sm">Total Debt</p>
                          <p className="text-2xl font-bold">${application.debt_amount?.toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <div className="flex items-center">
                        <TrendingDown className="h-8 w-8 mb-2" />
                        <div className="ml-4">
                          <p className="text-green-100 text-sm">Potential Savings</p>
                          <p className="text-2xl font-bold">${Math.round(application.debt_amount * 0.4)?.toLocaleString()}</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 mb-2" />
                        <div className="ml-4">
                          <p className="text-purple-100 text-sm">Application Date</p>
                          <p className="text-lg font-bold">{new Date(application.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <div className="flex items-center">
                        <CreditCard className="h-8 w-8 mb-2" />
                        <div className="ml-4">
                          <p className="text-orange-100 text-sm">Accounts</p>
                          <p className="text-2xl font-bold">{debtAccounts.length}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Application Status Section */}
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-blue-600" />
                      Application Progress
                    </h2>
                    <ApplicationStatus application={application} />
                  </Card>

                  {/* Debt Accounts Overview */}
                  {debtAccounts.length > 0 && (
                    <Card className="p-8">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                        Your Debt Accounts
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Creditor
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Account Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Balance
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {debtAccounts.map((account) => (
                              <tr key={account.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {account.original_creditor}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {account.account_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                  ${account.current_balance?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    account.status === 'Active' ? 'bg-red-100 text-red-800' :
                                    account.status === 'Settled' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {account.status || 'Active'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-8 w-8 text-blue-600" />
                        <h3 className="ml-3 text-lg font-semibold">Need Assistance?</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Our debt relief specialists are here to help you every step of the way.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('support')}
                        className="w-full"
                      >
                        Contact Support
                      </Button>
                    </Card>
                    
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <Edit className="h-8 w-8 text-green-600" />
                        <h3 className="ml-3 text-lg font-semibold">Update Profile</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Keep your personal information current for the best service experience.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('profile')}
                        className="w-full"
                      >
                        Edit Profile
                      </Button>
                    </Card>
                    
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <Phone className="h-8 w-8 text-purple-600" />
                        <h3 className="ml-3 text-lg font-semibold">Emergency Contact</h3>
                      </div>
                      <p className="text-gray-600 mb-4">
                        Urgent questions? Call our 24/7 hotline for immediate assistance.
                      </p>
                      <Button 
                        variant="outline"
                        className="w-full"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        (555) 123-DEBT
                      </Button>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="p-12 text-center">
                  <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No Application Found</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Take the first step towards financial freedom. Our debt relief program can help you reduce your debt by up to 60%.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/apply')}
                    className="px-8 py-3"
                  >
                    Start Your Application
                  </Button>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Edit className="h-6 w-6 mr-3 text-blue-600" />
                Profile Settings
              </h2>
              <UserProfileForm />
            </Card>
          )}

          {activeTab === 'support' && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
                Customer Support
              </h2>
              <SupportForm />
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboardPage;

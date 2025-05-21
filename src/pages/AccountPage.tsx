
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Layout from '../components/layout/Layout';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/formatters';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { User, LogOut, CreditCard, FileText } from 'lucide-react';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Application {
  id: string;
  status: string;
  debt_amount: number;
  created_at: string;
}

const AccountPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
        });
        
        // Fetch user applications
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (applicationsError) throw applicationsError;
        
        setApplications(applicationsData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...(profile as UserProfile),
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="animate-pulse">Loading...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              icon={<LogOut className="h-4 w-4 mr-2" />}
            >
              Sign Out
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="md:col-span-1">
              <Card className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-gray-900">Profile</h2>
                </div>
                
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <Input
                      label="First Name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    <div className="flex space-x-2">
                      <Button type="submit" variant="primary">
                        Save
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1">{profile?.first_name} {profile?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{profile?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="mt-1">{profile?.phone}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}
              </Card>
            </div>
            
            {/* Applications Section */}
            <div className="md:col-span-2">
              <Card className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-gray-900">My Applications</h2>
                </div>
                
                {applications.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">You haven't submitted any applications yet.</p>
                    <div className="mt-4">
                      <Button variant="primary" onClick={() => navigate('/apply')}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Debt Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((application) => (
                          <tr key={application.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(application.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(application.debt_amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                  application.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="text" size="sm" onClick={() => navigate(`/application/${application.id}`)}>
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;

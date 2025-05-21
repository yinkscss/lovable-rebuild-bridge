import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Bell, Key, User, Clock, Shield, Check, X, MessageSquare, Phone, FileText, Settings } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatters';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  message: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  debt_amount: number;
  created_at: string;
}

function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'support' | 'settings'>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    loadUserData();
    loadApplications();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile exists yet, create one
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                first_name: '',
                last_name: '',
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating user profile:', createError);
            return;
          }

          if (newProfile) {
            reset({
              firstName: newProfile.first_name || '',
              lastName: newProfile.last_name || '',
              phone: newProfile.phone || ''
            });
          }
        } else {
          console.error('Error loading user data:', error);
        }
        return;
      }

      if (data) {
        reset({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
    }
  };

  const loadApplications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
    setLoading(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      loadUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const submitSupportMessage = async (data: ProfileFormData) => {
    if (!data.message) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          user_id: user?.id,
          message: data.message
        });

      if (error) throw error;
      reset({ message: '' });
    } catch (error) {
      console.error('Error sending support message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-4 py-2 text-sm rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">Recent Application</h3>
                      {applications[0] ? (
                        <div>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applications[0].status)}`}>
                            {applications[0].status.charAt(0).toUpperCase() + applications[0].status.slice(1)}
                          </div>
                          <p className="mt-2">Amount: {formatCurrency(applications[0].debt_amount)}</p>
                          <p className="text-sm text-gray-500">Submitted on {formatDate(applications[0].created_at)}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">No applications yet</p>
                      )}
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4">Support</h3>
                      <div className="space-y-4">
                        <p className="text-gray-600">Need assistance? Our support team is here to help.</p>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            onClick={() => setActiveTab('support')}
                            icon={<MessageSquare className="h-4 w-4" />}
                          >
                            Contact Support
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => window.location.href = 'tel:1-800-123-4567'}
                            icon={<Phone className="h-4 w-4" />}
                          >
                            Call Us
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">My Applications</h2>
                  {loading ? (
                    <p>Loading applications...</p>
                  ) : applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <div key={application.id} className="bg-white p-6 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </div>
                              <p className="mt-2 font-medium">Amount: {formatCurrency(application.debt_amount)}</p>
                              <p className="text-sm text-gray-500">Submitted on {formatDate(application.created_at)}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {/* View details */}}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No applications found</p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/apply')}
                      >
                        Apply Now
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'support' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Customer Support</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Contact Information</h3>
                      <p className="text-blue-700">
                        Phone: 1-800-123-4567 (Mon-Fri, 9AM-5PM EST)<br />
                        Email: support@nationaldebtrelief.com
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Send us a message</h3>
                      <form onSubmit={handleSubmit(submitSupportMessage)} className="space-y-4">
                        <textarea
                          {...register('message')}
                          className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="How can we help you?"
                        />
                        <Button type="submit" variant="primary">
                          Send Message
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                      />
                      <Input
                        label="Last Name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                      />
                      <Input
                        label="Email"
                        value={user?.email}
                        disabled
                        className="col-span-2"
                      />
                      <Input
                        label="Phone"
                        {...register('phone')}
                        error={errors.phone?.message}
                      />
                    </div>
                    <Button type="submit" variant="primary">
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AccountPage;
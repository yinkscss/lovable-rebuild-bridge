
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, User, DollarSign, Calendar } from 'lucide-react';
import AccountDetailsForm from './AccountDetailsForm';

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  ssn_last_four?: string;
  debt_amount: number;
  monthly_income?: number;
  employment_status?: string;
  completion_percentage: number;
  is_complete: boolean;
  completed_at: string | null;
  enrollment_status?: 'pending' | 'approved' | 'declined';
  negotiations_status?: 'pending' | 'approved' | 'declined';
  created_at: string;
  updated_at: string;
}

interface ApplicationStatusProps {
  applicationId: string;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'account'>('overview');

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    if (!user || !applicationId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getProgressSteps = () => {
    if (!application) return [];

    const steps = [
      {
        name: 'Application Submitted',
        status: 'completed',
        date: application.created_at,
        icon: FileText
      },
      {
        name: 'Application Review',
        status: application.status === 'pending' ? 'current' : 
                application.status === 'approved' ? 'completed' : 'declined',
        date: application.status !== 'pending' ? application.updated_at : null,
        icon: User
      }
    ];

    if (application.status === 'approved') {
      steps.push(
        {
          name: 'Enrollment Process',
          status: application.enrollment_status === 'pending' ? 'current' :
                  application.enrollment_status === 'approved' ? 'completed' : 'declined',
          date: application.enrollment_status === 'approved' ? application.updated_at : null,
          icon: CheckCircle
        }
      );

      if (application.enrollment_status === 'approved') {
        steps.push({
          name: 'Negotiations',
          status: application.negotiations_status === 'pending' ? 'current' :
                  application.negotiations_status === 'approved' ? 'completed' : 'declined',
          date: application.negotiations_status === 'approved' ? application.updated_at : null,
          icon: DollarSign
        });
      }
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Application not found</p>
      </div>
    );
  }

  const progressSteps = getProgressSteps();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Application #{application.id.slice(-8)}
            </h2>
            <p className="text-gray-600">
              Submitted on {formatDate(application.created_at)}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(application.status)}
              <span className="ml-2 font-medium capitalize">{application.status}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="text-gray-600">{application.completion_percentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${application.completion_percentage || 0}%` }}
            ></div>
          </div>
        </div>

        {application.is_complete && (
          <div className="flex items-center text-sm text-green-600 mb-4">
            <CheckCircle className="h-4 w-4 mr-1" />
            Application Complete - Completed on {formatDate(application.completed_at!)}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'details', label: 'Application Details', icon: User },
              { id: 'account', label: 'Account Details', icon: DollarSign }
            ].map((tab) => {
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

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Progress Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {progressSteps.map((step, stepIdx) => {
                      const Icon = step.icon;
                      return (
                        <li key={step.name}>
                          <div className="relative pb-8">
                            {stepIdx !== progressSteps.length - 1 ? (
                              <span
                                className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                                  step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    step.status === 'completed'
                                      ? 'bg-green-500'
                                      : step.status === 'current'
                                      ? 'bg-blue-500'
                                      : step.status === 'declined'
                                      ? 'bg-red-500'
                                      : 'bg-gray-300'
                                  }`}
                                >
                                  <Icon className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900 font-medium">{step.name}</p>
                                  <p className="text-sm text-gray-500 capitalize">
                                    {step.status === 'completed' ? 'Completed' : 
                                     step.status === 'current' ? 'In Progress' :
                                     step.status === 'declined' ? 'Declined' : 'Pending'}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {step.date && formatDate(step.date)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Debt Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(application.debt_amount)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Monthly Income</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {application.monthly_income ? formatCurrency(application.monthly_income) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Employment</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {application.employment_status || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-sm text-gray-900">{application.first_name} {application.last_name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{application.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{application.phone}</p>
                    </div>
                    {application.address && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <p className="mt-1 text-sm text-gray-900">{application.address}</p>
                      </div>
                    )}
                    {application.date_of_birth && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(application.date_of_birth)}</p>
                      </div>
                    )}
                    {application.ssn_last_four && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">SSN (Last 4)</label>
                        <p className="mt-1 text-sm text-gray-900">***-**-{application.ssn_last_four}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Debt Amount</label>
                      <p className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(application.debt_amount)}</p>
                    </div>
                    {application.monthly_income && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Income</label>
                        <p className="mt-1 text-sm text-gray-900">{formatCurrency(application.monthly_income)}</p>
                      </div>
                    )}
                    {application.employment_status && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">{application.employment_status}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <AccountDetailsForm applicationId={application.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;

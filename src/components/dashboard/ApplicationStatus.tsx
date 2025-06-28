
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle, Clock, XCircle, AlertCircle, FileText, User, DollarSign } from 'lucide-react';

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  debt_amount: number;
  address?: string;
  date_of_birth?: string;
  ssn_last_four?: string;
  employment_status?: string;
  monthly_income?: number;
  completion_percentage: number;
  is_complete: boolean;
  completed_at?: string;
  enrollment_status?: 'pending' | 'approved' | 'declined';
  enrollment_approved_at?: string;
  negotiations_status?: 'pending' | 'approved' | 'declined';
  negotiations_approved_at?: string;
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

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('user_id', user?.id)
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
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'declined':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'declined':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-yellow-700 bg-yellow-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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

  const progressSteps = [
    {
      name: 'Application Submitted',
      status: 'completed',
      icon: FileText,
      date: formatDate(application.created_at),
    },
    {
      name: 'Application Review',
      status: application.status === 'pending' ? 'current' : application.status === 'approved' ? 'completed' : 'failed',
      icon: User,
      date: application.status !== 'pending' ? formatDate(application.updated_at) : undefined,
    },
    {
      name: 'Program Enrollment',
      status: !application.enrollment_status || application.enrollment_status === 'pending' 
        ? (application.status === 'approved' ? 'current' : 'upcoming')
        : application.enrollment_status === 'approved' ? 'completed' : 'failed',
      icon: CheckCircle,
      date: application.enrollment_approved_at ? formatDate(application.enrollment_approved_at) : undefined,
    },
    {
      name: 'Creditor Negotiations',
      status: !application.negotiations_status || application.negotiations_status === 'pending'
        ? (application.enrollment_status === 'approved' ? 'current' : 'upcoming')
        : application.negotiations_status === 'approved' ? 'completed' : 'failed',
      icon: DollarSign,
      date: application.negotiations_approved_at ? formatDate(application.negotiations_approved_at) : undefined,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Application #{application.id.slice(-8)}
          </h2>
          <div className="flex items-center space-x-2">
            {getStatusIcon(application.status)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="text-gray-600">{application.completion_percentage || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${application.completion_percentage || 0}%` }}
            ></div>
          </div>
          {application.is_complete && (
            <p className="text-sm text-green-600 mt-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Application completed on {formatDate(application.completed_at!)}
            </p>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{application.first_name} {application.last_name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{application.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="ml-2 text-gray-900">{application.phone}</span>
            </div>
            {application.address && (
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <span className="ml-2 text-gray-900">{application.address}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Financial Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total Debt:</span>
              <span className="ml-2 text-gray-900 font-semibold">{formatCurrency(application.debt_amount)}</span>
            </div>
            {application.monthly_income && (
              <div>
                <span className="font-medium text-gray-700">Monthly Income:</span>
                <span className="ml-2 text-gray-900">{formatCurrency(application.monthly_income)}</span>
              </div>
            )}
            {application.employment_status && (
              <div>
                <span className="font-medium text-gray-700">Employment:</span>
                <span className="ml-2 text-gray-900 capitalize">{application.employment_status.replace('-', ' ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Progress</h3>
        <div className="space-y-4">
          {progressSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.name} className="flex items-start">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : step.status === 'current'
                      ? 'bg-blue-100 text-blue-600'
                      : step.status === 'failed'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <p className={`font-medium ${
                      step.status === 'completed' || step.status === 'current'
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                    {step.date && (
                      <span className="text-sm text-gray-500">{step.date}</span>
                    )}
                  </div>
                  <p className={`text-sm ${
                    step.status === 'completed'
                      ? 'text-green-600'
                      : step.status === 'current'
                      ? 'text-blue-600'
                      : step.status === 'failed'
                      ? 'text-red-600'
                      : 'text-gray-400'
                  }`}>
                    {step.status === 'completed' 
                      ? 'Completed' 
                      : step.status === 'current'
                      ? 'In Progress'
                      : step.status === 'failed'
                      ? 'Declined'
                      : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;

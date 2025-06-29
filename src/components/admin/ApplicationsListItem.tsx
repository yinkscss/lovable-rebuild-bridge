
import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, UserCheck, HandCoins, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import DebtAccountsManager from './DebtAccountsManager';
import AccountDetailsFormManager from './AccountDetailsFormManager';

interface DebtAccount {
  id: string;
  application_id: string;
  original_creditor: string;
  account_sold: boolean;
  account_type: string;
  date_opened?: string;
  open_closed?: string;
  status?: string;
  current_balance: number;
  last_payment_date?: string;
  paid_off: boolean;
  payment_frequency?: string;
  payment_amount?: number;
  original_balance?: number;
  term?: string;
  created_at: string;
  updated_at: string;
}

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
  credit_score?: string;
  completion_percentage?: number;
  is_complete?: boolean;
  completed_at?: string;
  enrollment_status?: 'pending' | 'approved' | 'declined';
  enrollment_approved_at?: string;
  negotiations_status?: 'pending' | 'approved' | 'declined';
  negotiations_approved_at?: string;
  created_at: string;
  updated_at: string;
  debt_accounts?: DebtAccount[];
}

interface ApplicationsListItemProps {
  application: Application;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  handleApprove: (id: string) => void;
  handleDecline: (id: string) => void;
  handleApproveEnrollment: (id: string) => void;
  handleDeclineEnrollment: (id: string) => void;
  handleApproveNegotiations: (id: string) => void;
  handleDeclineNegotiations: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const ApplicationsListItem: React.FC<ApplicationsListItemProps> = ({
  application,
  expandedId,
  toggleExpand,
  handleApprove,
  handleDecline,
  handleApproveEnrollment,
  handleDeclineEnrollment,
  handleApproveNegotiations,
  handleDeclineNegotiations,
  formatDate
}) => {
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCompleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          completion_percentage: 100,
          is_complete: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Application marked as complete successfully');
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error completing application:', error);
      toast.error('Failed to complete application');
    }
  };

  const canApproveEnrollment = application.status === 'approved' && application.enrollment_status === 'pending';
  const canApproveNegotiations = application.enrollment_status === 'approved' && application.negotiations_status === 'pending';
  const canCompleteApplication = application.completion_percentage < 100 && 
    application.status === 'approved' && 
    application.enrollment_status === 'approved' && 
    application.negotiations_status === 'approved';

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {application.first_name} {application.last_name}
              </div>
              <div className="text-sm text-gray-500">{application.email}</div>
              <div className="text-sm text-gray-500">{application.phone}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatDate(application.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              {getStatusIcon(application.status)}
              <span className={`ml-2 ${getStatusBadge(application.status)}`}>
                App: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            {application.status === 'approved' && (
              <div className="flex items-center">
                {getStatusIcon(application.enrollment_status || 'pending')}
                <span className={`ml-2 ${getStatusBadge(application.enrollment_status || 'pending')}`}>
                  Enroll: {(application.enrollment_status || 'pending').charAt(0).toUpperCase() + (application.enrollment_status || 'pending').slice(1)}
                </span>
              </div>
            )}
            {application.enrollment_status === 'approved' && (
              <div className="flex items-center">
                {getStatusIcon(application.negotiations_status || 'pending')}
                <span className={`ml-2 ${getStatusBadge(application.negotiations_status || 'pending')}`}>
                  Negotiate: {(application.negotiations_status || 'pending').charAt(0).toUpperCase() + (application.negotiations_status || 'pending').slice(1)}
                </span>
              </div>
            )}
            {/* Progress indicator */}
            {application.completion_percentage !== undefined && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <div className="w-16 bg-gray-200 rounded-full h-1.5 mr-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${application.completion_percentage}%` }}
                  ></div>
                </div>
                <span>{application.completion_percentage}%</span>
                {application.is_complete && (
                  <CheckCircle className="h-3 w-3 text-green-500 ml-1" />
                )}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex flex-col space-y-2">
            {application.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(application.id)}
                  className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                >
                  Approve App
                </button>
                <button
                  onClick={() => handleDecline(application.id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                >
                  Decline App
                </button>
              </div>
            )}
            {canApproveEnrollment && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproveEnrollment(application.id)}
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors flex items-center"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Approve Enrollment
                </button>
                <button
                  onClick={() => handleDeclineEnrollment(application.id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
            {canApproveNegotiations && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApproveNegotiations(application.id)}
                  className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md transition-colors flex items-center"
                >
                  <HandCoins className="h-4 w-4 mr-1" />
                  Approve Negotiations
                </button>
                <button
                  onClick={() => handleDeclineNegotiations(application.id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
            {canCompleteApplication && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCompleteApplication(application.id)}
                  className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors flex items-center"
                >
                  <Award className="h-4 w-4 mr-1" />
                  Mark as Complete
                </button>
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => toggleExpand(application.id)}
            className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
          >
            {expandedId === application.id ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View Details
              </>
            )}
          </button>
        </td>
      </tr>
      {expandedId === application.id && (
        <tr>
          <td colSpan={5} className="px-6 py-6 bg-gray-50">
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{application.first_name} {application.last_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{application.phone}</p>
                  </div>
                  {application.address && (
                    <div>
                      <span className="font-medium text-gray-700">Address:</span>
                      <p className="text-gray-900">{application.address}</p>
                    </div>
                  )}
                  {application.date_of_birth && (
                    <div>
                      <span className="font-medium text-gray-700">Date of Birth:</span>
                      <p className="text-gray-900">{new Date(application.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  )}
                  {application.ssn_last_four && (
                    <div>
                      <span className="font-medium text-gray-700">SSN (Last 4):</span>
                      <p className="text-gray-900">***-**-{application.ssn_last_four}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Total Debt Amount:</span>
                    <p className="text-gray-900 text-xl font-semibold">{formatCurrency(application.debt_amount)}</p>
                  </div>
                  {application.monthly_income && (
                    <div>
                      <span className="font-medium text-gray-700">Monthly Income:</span>
                      <p className="text-gray-900">{formatCurrency(application.monthly_income)}</p>
                    </div>
                  )}
                  {application.employment_status && (
                    <div>
                      <span className="font-medium text-gray-700">Employment Status:</span>
                      <p className="text-gray-900 capitalize">{application.employment_status.replace('-', ' ')}</p>
                    </div>
                  )}
                  {application.credit_score && (
                    <div>
                      <span className="font-medium text-gray-700">Credit Score Range:</span>
                      <p className="text-gray-900">{application.credit_score}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* User-Submitted Debt Accounts */}
              {application.debt_accounts && application.debt_accounts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
                    <h4 className="text-lg font-semibold text-blue-900">User-Submitted Debt Accounts</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      These are the debt accounts originally provided by the applicant during their application.
                    </p>
                  </div>
                  <div className="p-6">
                    <DebtAccountsManager 
                      applicationId={application.id} 
                      readonly={true}
                    />
                  </div>
                </div>
              )}

              {/* Account Details Form - only show if application is complete or has form */}
              {(application.is_complete || application.completion_percentage === 100) && (
                <AccountDetailsFormManager applicationId={application.id} />
              )}

              {/* Application Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Submitted:</span>
                    <span className="text-gray-900">{formatDate(application.created_at)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Last Updated:</span>
                    <span className="text-gray-900">{formatDate(application.updated_at)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Current Status:</span>
                    <span className={getStatusBadge(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-700 w-32">Progress:</span>
                    <span className="text-gray-900">{application.completion_percentage || 0}%</span>
                    {application.is_complete && (
                      <span className="ml-2 text-green-600 text-xs">✓ Complete</span>
                    )}
                  </div>
                  {application.enrollment_approved_at && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 w-32">Enrollment:</span>
                      <span className="text-gray-900">{formatDate(application.enrollment_approved_at)} - {application.enrollment_status}</span>
                    </div>
                  )}
                  {application.negotiations_approved_at && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 w-32">Negotiations:</span>
                      <span className="text-gray-900">{formatDate(application.negotiations_approved_at)} - {application.negotiations_status}</span>
                    </div>
                  )}
                  {application.completed_at && (
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 w-32">Completed:</span>
                      <span className="text-gray-900">{formatDate(application.completed_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ApplicationsListItem;

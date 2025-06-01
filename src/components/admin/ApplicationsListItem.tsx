
import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import DebtAccountsManager from './DebtAccountsManager';

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
  created_at: string;
  updated_at: string;
}

interface ApplicationsListItemProps {
  application: Application;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  handleApprove: (id: string) => void;
  handleDecline: (id: string) => void;
  formatDate: (dateString: string) => string;
}

const ApplicationsListItem: React.FC<ApplicationsListItemProps> = ({
  application,
  expandedId,
  toggleExpand,
  handleApprove,
  handleDecline,
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
          <div className="flex items-center">
            {getStatusIcon(application.status)}
            <span className={`ml-2 ${getStatusBadge(application.status)}`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex space-x-2">
            {application.status === 'pending' && (
              <>
                <button
                  onClick={() => handleApprove(application.id)}
                  className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(application.id)}
                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                >
                  Decline
                </button>
              </>
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

              {/* Debt Accounts */}
              <DebtAccountsManager applicationId={application.id} />

              {/* Application Timeline */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h4>
                <div className="space-y-2">
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


import React from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';

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
  created_at: string;
  updated_at: string;
}

interface ApplicationsListItemProps {
  application: Application;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  handleApprove: (id: string) => Promise<void>;
  handleDecline: (id: string) => Promise<void>;
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
  return (
    <React.Fragment>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900">
                {application.first_name} {application.last_name}
              </div>
              <div className="text-sm text-gray-500">
                {application.email}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(application.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
              application.status === 'approved' ? 'bg-green-100 text-green-800' : 
              'bg-red-100 text-red-800'}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          {application.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="mr-2 text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => handleApprove(application.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => handleDecline(application.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <button 
            onClick={() => toggleExpand(application.id)}
            className="flex items-center text-blue-600 hover:text-blue-800"
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
          <td colSpan={5} className="px-6 py-4 bg-gray-50">
            <div className="text-sm">
              <h4 className="font-medium mb-2">Application Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-medium">First Name:</span> {application.first_name}</p>
                  <p><span className="font-medium">Last Name:</span> {application.last_name}</p>
                  <p><span className="font-medium">Email:</span> {application.email}</p>
                  <p><span className="font-medium">Phone:</span> {application.phone}</p>
                  <p><span className="font-medium">Address:</span> {application.address || 'N/A'}</p>
                </div>
                <div>
                  <p><span className="font-medium">Debt Amount:</span> ${application.debt_amount}</p>
                  <p><span className="font-medium">Employment Status:</span> {application.employment_status || 'N/A'}</p>
                  <p><span className="font-medium">Monthly Income:</span> ${application.monthly_income || 'N/A'}</p>
                  <p><span className="font-medium">Date Submitted:</span> {formatDate(application.created_at)}</p>
                  <p><span className="font-medium">Last Updated:</span> {formatDate(application.updated_at)}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

export default ApplicationsListItem;

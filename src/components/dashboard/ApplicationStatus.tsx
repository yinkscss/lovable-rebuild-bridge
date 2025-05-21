
import React from 'react';
import { Check, Clock, X } from 'lucide-react';

interface ApplicationStatusProps {
  application: {
    status: 'pending' | 'approved' | 'declined';
    created_at: string;
    updated_at: string;
  };
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ application }) => {
  const stages = [
    { 
      id: 'submitted', 
      label: 'Application Submitted', 
      completed: true,
      date: new Date(application.created_at).toLocaleDateString()
    },
    { 
      id: 'review', 
      label: 'Under Review', 
      completed: true,
      date: ''
    },
    { 
      id: 'approved', 
      label: 'Application Approved', 
      completed: application.status === 'approved',
      date: application.status === 'approved' ? new Date(application.updated_at).toLocaleDateString() : ''
    },
    { 
      id: 'onboarding', 
      label: 'Onboarding', 
      completed: false,
      date: ''
    },
    { 
      id: 'negotiations', 
      label: 'Negotiations with Creditors', 
      completed: false,
      date: ''
    }
  ];

  const statusColor = 
    application.status === 'approved' ? 'bg-green-100 text-green-800' : 
    application.status === 'declined' ? 'bg-red-100 text-red-800' : 
    'bg-yellow-100 text-yellow-800';

  const statusIcon = 
    application.status === 'approved' ? <Check className="h-5 w-5" /> : 
    application.status === 'declined' ? <X className="h-5 w-5" /> : 
    <Clock className="h-5 w-5" />;

  return (
    <div>
      {/* Current Status Badge */}
      <div className="mb-6 flex items-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor} flex items-center`}>
          {statusIcon}
          <span className="ml-2">
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </span>
        {application.status === 'pending' && (
          <span className="ml-3 text-sm text-gray-600">
            We're currently reviewing your application
          </span>
        )}
      </div>

      {application.status === 'declined' ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Application Declined
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  We're sorry, but we couldn't approve your application at this time. 
                  Please contact customer support for more information.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Steps */}
          <div className="overflow-hidden">
            <ul className="-mb-8">
              {stages.map((stage, idx) => (
                <li key={stage.id} className={idx === stages.length - 1 ? '' : 'pb-10'}>
                  <div className="relative flex items-start space-x-4">
                    <div className="relative">
                      <div className={`h-9 flex items-center ${idx !== stages.length - 1 && 'after:absolute after:top-9 after:left-4 after:bottom-0 after:w-0.5 after:-ml-px after:bg-gray-200'}`}>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                          ${stage.completed 
                            ? 'bg-blue-500 text-white'
                            : application.status === 'declined' && idx > 1
                            ? 'bg-gray-200 text-gray-500'
                            : 'bg-gray-200 text-gray-500'
                          }`}>
                          {stage.completed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            idx + 1
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm font-medium text-gray-900">
                        {stage.label}
                      </div>
                      {stage.date && (
                        <span className="text-sm text-gray-500">{stage.date}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;

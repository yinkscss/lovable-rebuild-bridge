
import React from 'react';
import { Check, Clock, X, AlertTriangle, FileText, Users, DollarSign } from 'lucide-react';

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
      description: 'Your application has been received and is in our system',
      completed: true,
      date: new Date(application.created_at).toLocaleDateString(),
      estimatedDays: 0
    },
    { 
      id: 'review', 
      label: 'Document Review', 
      description: 'Our specialists are reviewing your financial documents',
      completed: application.status !== 'pending' || new Date().getTime() - new Date(application.created_at).getTime() > 86400000, // 1 day
      date: application.status !== 'pending' ? new Date(application.updated_at).toLocaleDateString() : '',
      estimatedDays: 1
    },
    { 
      id: 'qualification', 
      label: 'Qualification Assessment', 
      description: 'Determining your eligibility for our debt relief program',
      completed: application.status === 'approved',
      date: application.status === 'approved' ? new Date(application.updated_at).toLocaleDateString() : '',
      estimatedDays: 3
    },
    { 
      id: 'approval', 
      label: 'Final Approval', 
      description: 'Application approved and ready for enrollment',
      completed: application.status === 'approved',
      date: application.status === 'approved' ? new Date(application.updated_at).toLocaleDateString() : '',
      estimatedDays: 5
    },
    { 
      id: 'enrollment', 
      label: 'Program Enrollment', 
      description: 'Welcome call and program setup',
      completed: false,
      date: '',
      estimatedDays: 7
    },
    { 
      id: 'negotiations', 
      label: 'Creditor Negotiations', 
      description: 'Active negotiations with your creditors begin',
      completed: false,
      date: '',
      estimatedDays: 30
    }
  ];

  const statusColor = 
    application.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 
    application.status === 'declined' ? 'bg-red-100 text-red-800 border-red-200' : 
    'bg-yellow-100 text-yellow-800 border-yellow-200';

  const statusIcon = 
    application.status === 'approved' ? <Check className="h-5 w-5" /> : 
    application.status === 'declined' ? <X className="h-5 w-5" /> : 
    <Clock className="h-5 w-5" />;

  const getNextSteps = () => {
    if (application.status === 'approved') {
      return [
        'Expect a welcome call from your dedicated specialist within 24-48 hours',
        'Prepare any additional financial documents if requested',
        'Review and sign your enrollment agreements'
      ];
    } else if (application.status === 'pending') {
      return [
        'Our team is reviewing your application (typically 1-3 business days)',
        'Ensure your phone is available for potential verification calls',
        'Check your email regularly for updates'
      ];
    }
    return [];
  };

  const currentStage = stages.findIndex(stage => !stage.completed);
  const progressPercentage = ((stages.filter(stage => stage.completed).length) / stages.length) * 100;

  return (
    <div className="space-y-6">
      {/* Current Status Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2 rounded-full border flex items-center ${statusColor}`}>
              {statusIcon}
              <span className="ml-2 font-semibold capitalize">{application.status}</span>
            </div>
            <div className="text-sm text-gray-600">
              Applied on {new Date(application.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {application.status === 'pending' && (
          <div className="flex items-center text-sm text-blue-700 bg-blue-50 rounded-md p-3 border border-blue-200">
            <Clock className="h-4 w-4 mr-2" />
            <span>Estimated completion: {stages[currentStage]?.estimatedDays || 1}-{(stages[currentStage]?.estimatedDays || 1) + 2} business days</span>
          </div>
        )}
      </div>

      {application.status === 'declined' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <X className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Application Not Approved
              </h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>Unfortunately, we're unable to approve your application at this time. This could be due to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Debt amount below our minimum threshold</li>
                  <li>Income requirements not met</li>
                  <li>Incomplete application information</li>
                </ul>
                <div className="mt-4 p-3 bg-red-100 rounded-md">
                  <p className="font-medium">Need help? Contact our support team:</p>
                  <p>Email: info@nationaldebtsrelief.org</p>
                  <p>Phone: (410) 258-4893</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Detailed Progress Steps */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Application Timeline
            </h3>
            
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {stages.map((stage, idx) => (
                <div key={stage.id} className="relative flex items-start pb-8 last:pb-0">
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      stage.completed 
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : idx === currentStage
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}>
                      {stage.completed ? (
                        <Check className="h-5 w-5" />
                      ) : idx === currentStage ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{idx + 1}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-semibold ${
                        stage.completed ? 'text-gray-900' : 
                        idx === currentStage ? 'text-yellow-700' : 'text-gray-500'
                      }`}>
                        {stage.label}
                      </h4>
                      {stage.date && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {stage.date}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                    
                    {!stage.completed && idx === currentStage && (
                      <div className="mt-2 text-xs text-yellow-600 font-medium">
                        Currently in progress • Est. {stage.estimatedDays} business days
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          {getNextSteps().length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                What's Next?
              </h3>
              <ul className="space-y-2">
                {getNextSteps().map((step, idx) => (
                  <li key={idx} className="flex items-start text-sm text-blue-800">
                    <div className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-xs font-medium text-blue-700">{idx + 1}</span>
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Industry Standards Compliance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-800 text-sm">Certified Specialists</h4>
              <p className="text-xs text-green-700 mt-1">IAPDA Certified Debt Consultants</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-800 text-sm">Transparent Process</h4>
              <p className="text-xs text-blue-700 mt-1">Clear timeline and expectations</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-800 text-sm">No Upfront Fees</h4>
              <p className="text-xs text-purple-700 mt-1">You only pay when we settle</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;

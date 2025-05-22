
import React from 'react';
import { Shield } from 'lucide-react';

const SecurityNotice: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <div className="flex items-start">
        <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
        <div>
          <h4 className="text-sm font-medium text-blue-900">Secure Application</h4>
          <p className="text-sm text-blue-700">
            Your information is protected with bank-level security and encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;

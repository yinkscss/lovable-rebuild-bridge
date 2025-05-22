
import React from 'react';

const ApplicationsLoading: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Applications Management</h2>
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading applications...</span>
      </div>
    </div>
  );
};

export default ApplicationsLoading;

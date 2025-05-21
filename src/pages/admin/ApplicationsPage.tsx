import React from 'react';
import ApplicationsList from '../../components/admin/ApplicationsList';

const ApplicationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Application Management</h1>
      <ApplicationsList />
    </div>
  );
};

export default ApplicationsPage;
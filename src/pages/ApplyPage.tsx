import React from 'react';
import Layout from '../components/layout/Layout';
import ApplicationForm from '../components/apply/ApplicationForm';

const ApplyPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-8 bg-gray-50">
        <ApplicationForm />
      </div>
    </Layout>
  );
};

export default ApplyPage;
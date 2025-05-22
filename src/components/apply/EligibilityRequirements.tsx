
import React from 'react';

const EligibilityRequirements: React.FC = () => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
      <h3 className="font-medium mb-2">Eligibility Requirements</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Minimum $7,500 in unsecured debt</li>
        <li>• Regular source of income</li>
        <li>• US resident aged 18 or older</li>
        <li>• Ability to make monthly program payments</li>
      </ul>
    </div>
  );
};

export default EligibilityRequirements;

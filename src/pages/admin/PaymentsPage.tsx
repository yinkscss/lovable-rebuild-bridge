import React from 'react';
import PaymentMethodsList from '../../components/admin/PaymentMethodsList';

const PaymentsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>
      <PaymentMethodsList />
    </div>
  );
};

export default PaymentsPage;
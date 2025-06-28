
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { FileText, Calendar, DollarSign, Building, CreditCard } from 'lucide-react';

interface AccountDetailsForm {
  id: string;
  application_id: string;
  original_creditor: string;
  account_sold: boolean;
  current_company?: string;
  account_type: string;
  date_opened?: string;
  open_closed?: string;
  status?: string;
  current_balance: number;
  last_payment_date?: string;
  paid_off: boolean;
  payment_frequency?: string;
  payment_amount?: number;
  original_balance?: number;
  term?: string;
  completed_at?: string;
  filled_by_admin_id?: string;
}

interface AccountDetailsFormProps {
  applicationId: string;
}

const AccountDetailsForm: React.FC<AccountDetailsFormProps> = ({ applicationId }) => {
  const [formData, setFormData] = useState<AccountDetailsForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccountDetailsForm();
  }, [applicationId]);

  const fetchAccountDetailsForm = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_details_forms')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setFormData(data);
    } catch (error) {
      console.error('Error fetching account details form:', error);
      toast.error('Failed to load account details form');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData || !formData.completed_at) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          Your account details form will be available once your application is processed by our team.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Creditor Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Original Creditor</label>
            <p className="mt-1 text-sm text-gray-900">{formData.original_creditor}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <p className="mt-1 text-sm text-gray-900">{formData.account_type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 text-sm text-gray-900">{formData.status || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <p className="mt-1 text-sm text-gray-900">{formData.open_closed || 'N/A'}</p>
          </div>
          {formData.account_sold && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Company</label>
              <p className="mt-1 text-sm text-gray-900">{formData.current_company || 'N/A'}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Financial Details
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Balance</label>
            <p className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(formData.current_balance)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Original Balance</label>
            <p className="mt-1 text-sm text-gray-900">{formatCurrency(formData.original_balance)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Amount</label>
            <p className="mt-1 text-sm text-gray-900">{formatCurrency(formData.payment_amount)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Frequency</label>
            <p className="mt-1 text-sm text-gray-900">{formData.payment_frequency || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Term</label>
            <p className="mt-1 text-sm text-gray-900">{formData.term || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Important Dates
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date Opened</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(formData.date_opened)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Payment Date</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(formData.last_payment_date)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Form Completed</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(formData.completed_at)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex space-x-6">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              formData.account_sold ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {formData.account_sold ? 'Account Sold' : 'Original Creditor'}
            </span>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              formData.paid_off ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {formData.paid_off ? 'Paid Off' : 'Outstanding'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsForm;

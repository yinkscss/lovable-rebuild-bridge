
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
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

const AccountDetailsFormComponent: React.FC<AccountDetailsFormProps> = ({ applicationId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<AccountDetailsForm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchAccountDetailsForm();
    }
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
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Account Details Available</h3>
          <p className="text-gray-500">
            Account details will be available once your application is complete and processed by our team.
          </p>
        </div>
      </div>
    );
  }

  const isFormCompleted = formData.completed_at && formData.filled_by_admin_id;

  if (!isFormCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Account Details Pending</h3>
          <p className="text-gray-500">
            Your account details are being prepared by our team. You'll be notified once they're ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-blue-600 mr-3" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
          <p className="text-sm text-gray-600">
            Completed on {formatDate(formData.completed_at!)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creditor Information */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <Building className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Creditor Information</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Original Creditor</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.original_creditor}</p>
          </div>

          {formData.account_sold && formData.current_company && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.current_company}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.account_type}</p>
          </div>

          <div className="flex items-center space-x-4">
            {formData.account_sold && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Account Sold
              </span>
            )}
            {formData.paid_off && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Paid Off
              </span>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
          </div>

          {formData.date_opened && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Opened</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formatDate(formData.date_opened)}</p>
            </div>
          )}

          {formData.open_closed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.open_closed}</p>
            </div>
          )}

          {formData.status && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.status}</p>
            </div>
          )}

          {formData.term && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.term}</p>
            </div>
          )}
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md font-semibold">
              {formatCurrency(formData.current_balance)}
            </p>
          </div>

          {formData.original_balance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Balance</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {formatCurrency(formData.original_balance)}
              </p>
            </div>
          )}

          {formData.payment_amount && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {formatCurrency(formData.payment_amount)}
              </p>
            </div>
          )}

          {formData.payment_frequency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Frequency</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formData.payment_frequency}</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="space-y-4">
          <div className="flex items-center mb-3">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          </div>

          {formData.last_payment_date && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Payment Date</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                {formatDate(formData.last_payment_date)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsFormComponent;

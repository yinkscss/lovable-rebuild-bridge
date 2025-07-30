
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Save, X, Edit, FileText, CheckCircle } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface AccountDetailsForm {
  id: string;
  application_id: string;
  original_creditor: string;
  account_sold: boolean;
  account_type: string;
  open_closed?: string;
  status?: string;
  current_balance: number;
  paid_off: boolean;
  payment_frequency?: string;
  payment_amount?: number;
  original_balance?: number;
  term?: string;
  completed_at?: string;
  filled_by_admin_id?: string;
}

interface AccountDetailsFormManagerProps {
  applicationId: string;
}

const ACCOUNT_TYPES = [
  'Credit Card', 'Personal Loan', 'Medical Debt', 'Store Card', 
  'Auto Loan', 'Student Loan', 'Line of Credit', 'Other'
];

const OPEN_CLOSED_OPTIONS = ['Open', 'Closed'];
const STATUS_OPTIONS = ['Current', 'Late', 'Charged Off', 'Collection', 'Settled', 'Paid'];
const PAYMENT_FREQUENCY_OPTIONS = ['Monthly', 'Weekly', 'Bi-Weekly', 'Quarterly'];

const AccountDetailsFormManager: React.FC<AccountDetailsFormManagerProps> = ({ applicationId }) => {
  const [formData, setFormData] = useState<AccountDetailsForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

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

  const handleSave = async () => {
    if (!formData) return;

    try {
      setSaving(true);
      
      const updateData = {
        original_creditor: formData.original_creditor,
        account_sold: formData.account_sold,
        account_type: formData.account_type,
        open_closed: formData.open_closed || null,
        status: formData.status || null,
        current_balance: formData.current_balance,
        paid_off: formData.paid_off,
        payment_frequency: formData.payment_frequency || null,
        payment_amount: formData.payment_amount || null,
        original_balance: formData.original_balance || null,
        term: formData.term || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('account_details_forms')
        .update(updateData)
        .eq('id', formData.id);

      if (error) throw error;

      toast.success('Account details form saved successfully');
      setEditing(false);
      fetchAccountDetailsForm();
    } catch (error) {
      console.error('Error saving account details form:', error);
      toast.error('Failed to save account details form');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteForm = async () => {
    if (!formData) return;

    try {
      setCompleting(true);
      
      const updateData = {
        completed_at: new Date().toISOString(),
        filled_by_admin_id: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('account_details_forms')
        .update(updateData)
        .eq('id', formData.id);

      if (error) throw error;

      // Get application details for email
      const { data: applicationData, error: appError } = await supabase
        .from('applications')
        .select('email, first_name, last_name')
        .eq('id', applicationId)
        .single();

      if (!appError && applicationData) {
        // Send debt account creation email
        try {
          await supabase.functions.invoke('send-debt-account-email', {
            body: {
              email: applicationData.email,
              firstName: applicationData.first_name,
              lastName: applicationData.last_name,
              applicationId: applicationId,
              debtAccountDetails: {
                originalCreditor: formData.original_creditor,
                accountType: formData.account_type,
                currentBalance: formData.current_balance
              }
            }
          });
          console.log('Debt account creation email sent successfully');
        } catch (emailError) {
          console.error('Error sending debt account creation email:', emailError);
          // Don't show error to user as the main action succeeded
        }
      }

      toast.success('Account details form completed successfully');
      fetchAccountDetailsForm();
    } catch (error) {
      console.error('Error completing account details form:', error);
      toast.error('Failed to complete account details form');
    } finally {
      setCompleting(false);
    }
  };

  const handleInputChange = (field: keyof AccountDetailsForm) => (
    value: string | number | boolean | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!formData) return;

    let newValue: any;
    if (typeof value === 'object' && 'target' in value) {
      if (value.target.type === 'checkbox') {
        newValue = value.target.checked;
      } else {
        newValue = value.target.value;
      }
    } else {
      newValue = value;
    }

    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const handleSelectChange = (field: keyof AccountDetailsForm) => (value: string | React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData) return;
    
    let newValue: string;
    if (typeof value === 'string') {
      newValue = value;
    } else {
      newValue = value.target.value;
    }
    
    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
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

  if (!formData) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No account details form available for this application.</p>
      </div>
    );
  }

  const isCompleted = formData.completed_at && formData.filled_by_admin_id;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Account Details Form</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isCompleted ? `Completed on ${new Date(formData.completed_at!).toLocaleDateString()}` : 'Pending completion'}
            </p>
          </div>
          <div className="flex space-x-2">
            {editing ? (
              <>
                <Button onClick={handleSave} variant="primary" size="sm" disabled={saving}>
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={() => setEditing(false)} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                {!isCompleted && (
                  <Button onClick={handleCompleteForm} variant="primary" size="sm" disabled={completing}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {completing ? 'Completing...' : 'Complete Form'}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Creditor"
            value={formData.original_creditor || ''}
            onChange={handleInputChange('original_creditor')}
            disabled={!editing}
          />
          
          <Select
            label="Account Type"
            options={ACCOUNT_TYPES.map(type => ({ value: type, label: type }))}
            value={formData.account_type || ''}
            onChange={handleSelectChange('account_type')}
            disabled={!editing}
          />
          
          <Input
            label="Current Balance"
            type="number"
            step="0.01"
            value={formData.current_balance || ''}
            onChange={handleInputChange('current_balance')}
            disabled={!editing}
          />
          
          <Input
            label="Original Balance"
            type="number"
            step="0.01"
            value={formData.original_balance || ''}
            onChange={handleInputChange('original_balance')}
            disabled={!editing}
          />
          
          <Select
            label="Status"
            options={STATUS_OPTIONS.map(status => ({ value: status, label: status }))}
            value={formData.status || ''}
            onChange={handleSelectChange('status')}
            disabled={!editing}
          />
          
          <Select
            label="Open/Closed"
            options={OPEN_CLOSED_OPTIONS.map(option => ({ value: option, label: option }))}
            value={formData.open_closed || ''}
            onChange={handleSelectChange('open_closed')}
            disabled={!editing}
          />

          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            value={formData.payment_amount || ''}
            onChange={handleInputChange('payment_amount')}
            disabled={!editing}
          />

          <Select
            label="Payment Frequency"
            options={PAYMENT_FREQUENCY_OPTIONS.map(freq => ({ value: freq, label: freq }))}
            value={formData.payment_frequency || ''}
            onChange={handleSelectChange('payment_frequency')}
            disabled={!editing}
          />

          <Input
            label="Term"
            value={formData.term || ''}
            onChange={handleInputChange('term')}
            disabled={!editing}
          />
        </div>

        <div className="mt-6 flex space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.account_sold || false}
              onChange={handleInputChange('account_sold')}
              disabled={!editing}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Account Sold</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.paid_off || false}
              onChange={handleInputChange('paid_off')}
              disabled={!editing}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Paid Off</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsFormManager;

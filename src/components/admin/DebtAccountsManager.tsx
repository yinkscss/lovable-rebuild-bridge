
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface DebtAccount {
  id: string;
  application_id: string;
  original_creditor: string;
  account_sold: boolean;
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
}

interface DebtAccountsManagerProps {
  applicationId: string;
  readonly?: boolean;
}

const ACCOUNT_TYPES = [
  'Credit Card', 'Personal Loan', 'Medical Debt', 'Store Card', 
  'Auto Loan', 'Student Loan', 'Line of Credit', 'Other'
];

const OPEN_CLOSED_OPTIONS = ['Open', 'Closed'];
const STATUS_OPTIONS = ['Current', 'Late', 'Charged Off', 'Collection', 'Settled', 'Paid'];
const PAYMENT_FREQUENCY_OPTIONS = ['Monthly', 'Weekly', 'Bi-Weekly', 'Quarterly'];

const DebtAccountsManager: React.FC<DebtAccountsManagerProps> = ({ applicationId, readonly = false }) => {
  const [debtAccounts, setDebtAccounts] = useState<DebtAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DebtAccount>>({});

  useEffect(() => {
    fetchDebtAccounts();
  }, [applicationId]);

  const fetchDebtAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('debt_accounts')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDebtAccounts(data || []);
    } catch (error) {
      console.error('Error fetching debt accounts:', error);
      toast.error('Failed to load debt accounts');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (account: DebtAccount) => {
    setEditingId(account.id);
    setEditForm(account);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    try {
      const { error } = await supabase
        .from('debt_accounts')
        .update({
          original_creditor: editForm.original_creditor,
          account_sold: editForm.account_sold,
          account_type: editForm.account_type,
          date_opened: editForm.date_opened || null,
          open_closed: editForm.open_closed || null,
          status: editForm.status || null,
          current_balance: editForm.current_balance,
          last_payment_date: editForm.last_payment_date || null,
          paid_off: editForm.paid_off,
          payment_frequency: editForm.payment_frequency || null,
          payment_amount: editForm.payment_amount || null,
          original_balance: editForm.original_balance || null,
          term: editForm.term || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) throw error;

      toast.success('Debt account updated successfully');
      setEditingId(null);
      setEditForm({});
      fetchDebtAccounts();
    } catch (error) {
      console.error('Error updating debt account:', error);
      toast.error('Failed to update debt account');
    }
  };

  const deleteAccount = async (id: string) => {
    if (!confirm('Are you sure you want to delete this debt account?')) return;

    try {
      const { error } = await supabase
        .from('debt_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Debt account deleted successfully');
      fetchDebtAccounts();
    } catch (error) {
      console.error('Error deleting debt account:', error);
      toast.error('Failed to delete debt account');
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Debt Accounts</h3>
        <p className="text-sm text-gray-600 mt-1">
          {debtAccounts.length} account{debtAccounts.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {debtAccounts.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No debt accounts found for this application.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {debtAccounts.map((account) => (
            <div key={account.id} className="p-6">
              {editingId === account.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Edit Debt Account</h4>
                    <div className="flex space-x-2">
                      <Button onClick={saveEdit} variant="primary" size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      label="Original Creditor"
                      value={editForm.original_creditor || ''}
                      onChange={(e) => setEditForm({...editForm, original_creditor: e.target.value})}
                    />
                    
                    <Select
                      label="Account Type"
                      options={ACCOUNT_TYPES.map(type => ({ value: type, label: type }))}
                      value={editForm.account_type || ''}
                      onChange={(value) => setEditForm({...editForm, account_type: value})}
                    />
                    
                    <Input
                      label="Current Balance"
                      type="number"
                      step="0.01"
                      value={editForm.current_balance || ''}
                      onChange={(e) => setEditForm({...editForm, current_balance: parseFloat(e.target.value)})}
                    />
                    
                    <Input
                      label="Original Balance"
                      type="number"
                      step="0.01"
                      value={editForm.original_balance || ''}
                      onChange={(e) => setEditForm({...editForm, original_balance: parseFloat(e.target.value)})}
                    />
                    
                    <Select
                      label="Status"
                      options={STATUS_OPTIONS.map(status => ({ value: status, label: status }))}
                      value={editForm.status || ''}
                      onChange={(value) => setEditForm({...editForm, status: value})}
                    />
                    
                    <Select
                      label="Open/Closed"
                      options={OPEN_CLOSED_OPTIONS.map(option => ({ value: option, label: option }))}
                      value={editForm.open_closed || ''}
                      onChange={(value) => setEditForm({...editForm, open_closed: value})}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.account_sold || false}
                        onChange={(e) => setEditForm({...editForm, account_sold: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Account Sold</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editForm.paid_off || false}
                        onChange={(e) => setEditForm({...editForm, paid_off: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Paid Off</span>
                    </label>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{account.original_creditor}</h4>
                      <p className="text-sm text-gray-600">{account.account_type}</p>
                    </div>
                    {!readonly && (
                      <div className="flex space-x-2">
                        <Button onClick={() => startEdit(account)} variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          onClick={() => deleteAccount(account.id)} 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Current Balance:</span>
                      <p className="text-gray-900">{formatCurrency(account.current_balance)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Original Balance:</span>
                      <p className="text-gray-900">{formatCurrency(account.original_balance)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className="text-gray-900">{account.status || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Open/Closed:</span>
                      <p className="text-gray-900">{account.open_closed || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date Opened:</span>
                      <p className="text-gray-900">{formatDate(account.date_opened)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Payment:</span>
                      <p className="text-gray-900">{formatDate(account.last_payment_date)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Amount:</span>
                      <p className="text-gray-900">{formatCurrency(account.payment_amount)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Payment Frequency:</span>
                      <p className="text-gray-900">{account.payment_frequency || 'N/A'}</p>
                    </div>
                  </div>

                  {(account.account_sold || account.paid_off) && (
                    <div className="mt-3 flex space-x-4">
                      {account.account_sold && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Account Sold
                        </span>
                      )}
                      {account.paid_off && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid Off
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtAccountsManager;

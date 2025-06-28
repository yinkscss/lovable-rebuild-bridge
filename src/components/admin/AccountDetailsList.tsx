import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Search, FileText, Edit, CheckCircle, Clock, User } from 'lucide-react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import AccountDetailsFormManager from './AccountDetailsFormManager';

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
  created_at: string;
  updated_at: string;
  // Application details
  application?: {
    first_name: string;
    last_name: string;
    email: string;
    debt_amount: number;
    status: string;
  };
}

const AccountDetailsList: React.FC = () => {
  const [forms, setForms] = useState<AccountDetailsForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    fetchAccountDetailsForms();
  }, []);

  const fetchAccountDetailsForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('account_details_forms')
        .select(`
          *,
          application:applications(
            first_name,
            last_name,
            email,
            debt_amount,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error('Error fetching account details forms:', error);
      toast.error('Failed to load account details forms');
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = 
      form.original_creditor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.application?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.application?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.application?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !form.completed_at) ||
      (statusFilter === 'completed' && form.completed_at);

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (form: AccountDetailsForm) => {
    if (form.completed_at) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading account details forms...</span>
      </div>
    );
  }

  if (selectedFormId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Account Details Form</h2>
          <Button 
            onClick={() => setSelectedFormId(null)} 
            variant="outline"
          >
            ← Back to List
          </Button>
        </div>
        <AccountDetailsFormManager 
          applicationId={forms.find(f => f.id === selectedFormId)?.application_id || ''} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            Account Details Forms
          </h2>
          <p className="mt-1 text-gray-600">Manage post-completion account detail forms</p>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-gray-500">
          {filteredForms.length} of {forms.length} forms
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by creditor, applicant name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            label=""
            options={[
              { value: 'all', label: 'All Forms' },
              { value: 'pending', label: 'Pending Completion' },
              { value: 'completed', label: 'Completed Forms' }
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as any)}
          />
          
          <div className="flex items-center justify-end">
            <Button onClick={fetchAccountDetailsForms} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Forms List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredForms.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Account details forms will appear here when applications reach 100% completion.'}
            </p>
          </Card>
        ) : (
          filteredForms.map((form) => (
            <Card key={form.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {form.application?.first_name} {form.application?.last_name}
                      </h3>
                    </div>
                    {getStatusBadge(form)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Original Creditor:</span>
                      <p className="text-sm text-gray-900">{form.original_creditor}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Account Type:</span>
                      <p className="text-sm text-gray-900">{form.account_type}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Current Balance:</span>
                      <p className="text-sm text-gray-900 font-semibold">
                        {formatCurrency(form.current_balance)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Application Debt:</span>
                      <p className="text-sm text-gray-900">
                        {form.application?.debt_amount ? formatCurrency(form.application.debt_amount) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Email:</span> {form.application?.email}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {formatDate(form.created_at)}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {formatDate(form.updated_at)}
                    </div>
                  </div>

                  {form.completed_at && (
                    <div className="mt-2 text-sm text-green-600">
                      <span className="font-medium">Completed:</span> {formatDate(form.completed_at)}
                    </div>
                  )}
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Button
                    onClick={() => setSelectedFormId(form.id)}
                    variant="primary"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Form
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AccountDetailsList;
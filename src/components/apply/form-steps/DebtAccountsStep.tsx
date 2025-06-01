
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Building2 } from 'lucide-react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

interface DebtAccountsStepProps {
  control: any;
  errors: any;
  register: any;
}

const ACCOUNT_TYPES = [
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Personal Loan', label: 'Personal Loan' },
  { value: 'Medical Debt', label: 'Medical Debt' },
  { value: 'Store Card', label: 'Store Card' },
  { value: 'Auto Loan', label: 'Auto Loan' },
  { value: 'Student Loan', label: 'Student Loan' },
  { value: 'Line of Credit', label: 'Line of Credit' },
  { value: 'Other', label: 'Other' },
];

const OPEN_CLOSED_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
];

const STATUS_OPTIONS = [
  { value: 'Current', label: 'Current' },
  { value: 'Late', label: 'Late' },
  { value: 'Charged Off', label: 'Charged Off' },
  { value: 'Collection', label: 'Collection' },
  { value: 'Settled', label: 'Settled' },
  { value: 'Paid', label: 'Paid' },
];

const PAYMENT_FREQUENCY_OPTIONS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bi-Weekly', label: 'Bi-Weekly' },
  { value: 'Quarterly', label: 'Quarterly' },
];

const DebtAccountsStep: React.FC<DebtAccountsStepProps> = ({ control, errors, register }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'debtAccounts'
  });

  const addDebtAccount = () => {
    append({
      originalCreditor: '',
      accountSold: false,
      accountType: '',
      dateOpened: '',
      openClosed: '',
      status: '',
      currentBalance: '',
      lastPaymentDate: '',
      paidOff: false,
      paymentFrequency: '',
      paymentAmount: '',
      originalBalance: '',
      term: ''
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center mb-3">
          <Building2 className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-blue-800">Debt Account Details</h3>
        </div>
        <p className="text-gray-700 mb-4">
          Please provide detailed information about each of your debt accounts. This helps us create the most effective debt relief strategy for your situation.
        </p>
        <div className="bg-white p-4 rounded border-l-4 border-blue-400">
          <p className="text-sm text-gray-600">
            <strong>Why we need this:</strong> Detailed account information allows us to negotiate directly with your creditors and create a personalized payment plan that fits your budget.
          </p>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No debt accounts added yet</p>
          <Button onClick={addDebtAccount} variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Debt Account
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-800">
                Debt Account #{index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  onClick={() => remove(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Account Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Original Creditor*"
                placeholder="e.g., Chase Bank, Capital One"
                {...register(`debtAccounts.${index}.originalCreditor`)}
                error={errors?.debtAccounts?.[index]?.originalCreditor}
              />
              
              <Controller
                name={`debtAccounts.${index}.accountType`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Account Type*"
                    options={ACCOUNT_TYPES}
                    placeholder="Select account type"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.debtAccounts?.[index]?.accountType}
                  />
                )}
              />
            </div>

            {/* Account Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name={`debtAccounts.${index}.openClosed`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Account Status"
                    options={OPEN_CLOSED_OPTIONS}
                    placeholder="Open/Closed"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.debtAccounts?.[index]?.openClosed}
                  />
                )}
              />
              
              <Controller
                name={`debtAccounts.${index}.status`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Payment Status"
                    options={STATUS_OPTIONS}
                    placeholder="Select status"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.debtAccounts?.[index]?.status}
                  />
                )}
              />

              <Input
                label="Date Opened"
                type="date"
                {...register(`debtAccounts.${index}.dateOpened`)}
                error={errors?.debtAccounts?.[index]?.dateOpened}
              />
            </div>

            {/* Balance Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Current Balance*"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register(`debtAccounts.${index}.currentBalance`)}
                error={errors?.debtAccounts?.[index]?.currentBalance}
              />
              
              <Input
                label="Original Balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register(`debtAccounts.${index}.originalBalance`)}
                error={errors?.debtAccounts?.[index]?.originalBalance}
              />
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name={`debtAccounts.${index}.paymentFrequency`}
                control={control}
                render={({ field }) => (
                  <Select
                    label="Payment Frequency"
                    options={PAYMENT_FREQUENCY_OPTIONS}
                    placeholder="Select frequency"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors?.debtAccounts?.[index]?.paymentFrequency}
                  />
                )}
              />
              
              <Input
                label="Payment Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register(`debtAccounts.${index}.paymentAmount`)}
                error={errors?.debtAccounts?.[index]?.paymentAmount}
              />
              
              <Input
                label="Last Payment Date"
                type="date"
                {...register(`debtAccounts.${index}.lastPaymentDate`)}
                error={errors?.debtAccounts?.[index]?.lastPaymentDate}
              />
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Term (if applicable)"
                placeholder="e.g., 36 months, 5 years"
                {...register(`debtAccounts.${index}.term`)}
                error={errors?.debtAccounts?.[index]?.term}
              />
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`debtAccounts.${index}.accountSold`)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Account has been sold to collection agency</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`debtAccounts.${index}.paidOff`)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Account is paid off</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}

      {fields.length > 0 && (
        <div className="text-center">
          <Button onClick={addDebtAccount} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Debt Account
          </Button>
        </div>
      )}
    </div>
  );
};

export default DebtAccountsStep;

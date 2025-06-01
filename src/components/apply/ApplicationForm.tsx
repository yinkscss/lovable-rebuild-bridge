
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { DEBT_RANGES } from '../../lib/constants';
import FormProgress from './FormProgress';
import SecurityNotice from './SecurityNotice';
import BasicInfoStep from './form-steps/BasicInfoStep';
import FinancialInfoStep from './form-steps/FinancialInfoStep';
import DebtSelectionStep from './form-steps/DebtSelectionStep';
import DebtAccountsStep from './form-steps/DebtAccountsStep';
import CreditScoreStep from './form-steps/CreditScoreStep';
import AdditionalDetailsStep from './form-steps/AdditionalDetailsStep';
import ReviewSubmitStep from './form-steps/ReviewSubmitStep';
import TrustIndicators from './TrustIndicators';
import EligibilityRequirements from './EligibilityRequirements';

const debtAccountSchema = z.object({
  originalCreditor: z.string().min(1, 'Original creditor is required'),
  accountSold: z.boolean().default(false),
  accountType: z.string().min(1, 'Account type is required'),
  dateOpened: z.string().optional(),
  openClosed: z.string().optional(),
  status: z.string().optional(),
  currentBalance: z.string().min(1, 'Current balance is required'),
  lastPaymentDate: z.string().optional(),
  paidOff: z.boolean().default(false),
  paymentFrequency: z.string().optional(),
  paymentAmount: z.string().optional(),
  originalBalance: z.string().optional(),
  term: z.string().optional()
});

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  address: z.string().min(1, 'Address is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ssnLastFour: z.string().regex(/^\d{4}$/, 'Please enter the last 4 digits of your SSN'),
  debtAmount: z.string().min(1, 'Debt amount is required'),
  debtRange: z.string().min(1, 'Debt range is required'),
  debtAccounts: z.array(debtAccountSchema).min(1, 'At least one debt account is required'),
  creditScore: z.string().min(1, 'Credit score selection is required'),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'retired']),
  monthlyIncome: z.string().min(1, 'Monthly income is required'),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const ApplicationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    trigger,
    setValue
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      debtAmount: searchParams.get('debt') || '',
      debtRange: searchParams.get('debt') || '',
      creditScore: '',
      debtAccounts: [{
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
      }],
      agreeToTerms: false
    }
  });
  
  const steps = [
    {
      title: 'Basic Information',
      description: 'Let\'s start with your basic details',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      title: 'Credit Score',
      description: 'What\'s your current credit score?',
      fields: ['creditScore']
    },
    {
      title: 'Financial Information',
      description: 'Tell us about your financial situation',
      fields: ['employmentStatus', 'monthlyIncome']
    },
    {
      title: 'Debt Selection',
      description: 'Select your debt amount range',
      fields: ['debtRange']
    },
    {
      title: 'Debt Account Details',
      description: 'Provide detailed information about your debt accounts',
      fields: ['debtAccounts']
    },
    {
      title: 'Additional Details',
      description: 'We need some additional information to process your application',
      fields: ['address', 'dateOfBirth', 'ssnLastFour', 'debtAmount']
    },
    {
      title: 'Review & Submit',
      description: 'Please review your information and submit your application',
      fields: ['agreeToTerms']
    }
  ];

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setSubmitting(true);
      console.log("Submitting application data:", data);
      
      if (!user) {
        toast.error('You need to be logged in to submit an application');
        setSubmitting(false);
        return;
      }
      
      const debtAmount = parseFloat(data.debtAmount.replace(/,/g, '')) || 0;
      const monthlyIncome = parseFloat(data.monthlyIncome.replace(/,/g, '')) || 0;
      
      if (isNaN(debtAmount) || debtAmount <= 0) {
        toast.error('Invalid debt amount');
        setSubmitting(false);
        return;
      }
      
      if (isNaN(monthlyIncome) || monthlyIncome < 0) {
        toast.error('Invalid monthly income');
        setSubmitting(false);
        return;
      }

      const selectedDebtRange = data.debtRange ? 
        DEBT_RANGES.find((range) => range.id === data.debtRange) : null;
      
      // Insert application first
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          status: 'pending',
          debt_amount: debtAmount,
          debt_range: selectedDebtRange?.label || null,
          credit_score: data.creditScore,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          date_of_birth: data.dateOfBirth,
          ssn_last_four: data.ssnLastFour,
          employment_status: data.employmentStatus,
          monthly_income: monthlyIncome,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (applicationError) {
        console.error('Error submitting application:', applicationError);
        toast.error('Error submitting application: ' + applicationError.message);
        setSubmitting(false);
        throw applicationError;
      }

      // Insert debt accounts
      const debtAccountsData = data.debtAccounts.map(account => ({
        application_id: applicationData.id,
        original_creditor: account.originalCreditor,
        account_sold: account.accountSold,
        account_type: account.accountType,
        date_opened: account.dateOpened || null,
        open_closed: account.openClosed || null,
        status: account.status || null,
        current_balance: parseFloat(account.currentBalance.replace(/,/g, '')) || 0,
        last_payment_date: account.lastPaymentDate || null,
        paid_off: account.paidOff,
        payment_frequency: account.paymentFrequency || null,
        payment_amount: account.paymentAmount ? parseFloat(account.paymentAmount.replace(/,/g, '')) : null,
        original_balance: account.originalBalance ? parseFloat(account.originalBalance.replace(/,/g, '')) : null,
        term: account.term || null
      }));

      const { error: debtAccountsError } = await supabase
        .from('debt_accounts')
        .insert(debtAccountsData);

      if (debtAccountsError) {
        console.error('Error submitting debt accounts:', debtAccountsError);
        toast.error('Error submitting debt accounts: ' + debtAccountsError.message);
        setSubmitting(false);
        throw debtAccountsError;
      }

      toast.success('Application submitted successfully!');
      console.log("Application submitted successfully, navigating to success page");
      navigate('/apply/success');
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error('There was an error submitting your application. Please try again.');
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    const currentFields = steps[currentStep].fields;
    
    const isValid = await trigger(currentFields as any);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    } else {
      toast.error('Please fill out all required fields correctly.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  React.useEffect(() => {
    const debtParam = searchParams.get('debt');
    if (debtParam) {
      setValue('debtRange', debtParam);
      const selectedRange = DEBT_RANGES.find((range) => range.id === debtParam);
      if (selectedRange) {
        console.log(`Selected debt range: ${selectedRange.label}`);
      }
    }
  }, [searchParams, setValue]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <FormProgress steps={steps} currentStep={currentStep} />
      
      <SecurityNotice />
      
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            {steps[currentStep].title}
          </h1>
          <p className="text-blue-100 text-lg">
            {steps[currentStep].description}
          </p>
        </div>

        {currentStep === 0 && <EligibilityRequirements />}

        <form className="p-8" onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <BasicInfoStep register={register} errors={errors} />
          )}

          {currentStep === 1 && (
            <CreditScoreStep 
              control={control}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <FinancialInfoStep 
              register={register} 
              control={control} 
              errors={errors} 
            />
          )}

          {currentStep === 3 && (
            <DebtSelectionStep 
              control={control}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <DebtAccountsStep 
              control={control}
              errors={errors}
              register={register}
            />
          )}

          {currentStep === 5 && (
            <AdditionalDetailsStep register={register} errors={errors} />
          )}

          {currentStep === 6 && (
            <ReviewSubmitStep 
              watch={watch} 
              register={register} 
              errors={errors} 
            />
          )}

          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            {currentStep > 0 && (
              <button 
                type="button" 
                onClick={handlePrevious} 
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                disabled={submitting}
              >
                ← Previous
              </button>
            )}
            
            <button 
              type="button" 
              onClick={handleNext} 
              className={`px-8 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors ${currentStep > 0 ? 'ml-auto' : ''} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : currentStep < steps.length - 1 ? 'Continue →' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <TrustIndicators />
    </div>
  );
};

export default ApplicationForm;

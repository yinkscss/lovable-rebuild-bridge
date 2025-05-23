
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
import CreditScoreStep from './form-steps/CreditScoreStep';
import AdditionalDetailsStep from './form-steps/AdditionalDetailsStep';
import ReviewSubmitStep from './form-steps/ReviewSubmitStep';
import TrustIndicators from './TrustIndicators';
import EligibilityRequirements from './EligibilityRequirements';

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
      
      // Check if user is authenticated
      if (!user) {
        toast.error('You need to be logged in to submit an application');
        setSubmitting(false);
        return;
      }
      
      // Parse number values safely
      const debtAmount = parseFloat(data.debtAmount.replace(/,/g, '')) || 0;
      const monthlyIncome = parseFloat(data.monthlyIncome.replace(/,/g, '')) || 0;
      
      // Validate parsed values
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

      // Find the selected debt range
      const selectedDebtRange = data.debtRange ? 
        DEBT_RANGES.find((range) => range.id === data.debtRange) : null;
      
      const { error } = await supabase.from('applications').insert({
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
      });

      if (error) {
        console.error('Error submitting application:', error);
        toast.error('Error submitting application: ' + error.message);
        setSubmitting(false);
        throw error;
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
    
    // Validate the current step fields
    const isValid = await trigger(currentFields as any);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Submit the form
        handleSubmit(onSubmit)();
      }
    } else {
      // Show form validation errors
      toast.error('Please fill out all required fields correctly.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Set debtRange based on debt amount from URL parameters
  React.useEffect(() => {
    const debtParam = searchParams.get('debt');
    if (debtParam) {
      setValue('debtRange', debtParam);
      // Update related fields if needed
      const selectedRange = DEBT_RANGES.find((range) => range.id === debtParam);
      if (selectedRange) {
        // You can update other fields based on the selected range if needed
        console.log(`Selected debt range: ${selectedRange.label}`);
      }
    }
  }, [searchParams, setValue]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <FormProgress steps={steps} currentStep={currentStep} />
      
      <SecurityNotice />
      
      {/* Form Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {steps[currentStep].title}
        </h1>
        <p className="text-gray-600">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Eligibility Requirements - only shown on first step */}
      {currentStep === 0 && <EligibilityRequirements />}

      {/* Form Fields */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          <AdditionalDetailsStep register={register} errors={errors} />
        )}

        {currentStep === 5 && (
          <ReviewSubmitStep 
            watch={watch} 
            register={register} 
            errors={errors} 
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={handlePrevious} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              Previous
            </button>
          )}
          
          <button 
            type="button" 
            onClick={handleNext} 
            className={`px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentStep > 0 ? 'ml-auto' : ''}`}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : currentStep < steps.length - 1 ? 'Continue' : 'Submit Application'}
          </button>
        </div>
      </form>

      {/* Trust Indicators */}
      <TrustIndicators />
    </div>
  );
};

export default ApplicationForm;

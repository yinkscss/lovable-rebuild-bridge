
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import FormProgress from './FormProgress';
import SecurityNotice from './SecurityNotice';
import BasicInfoStep from './form-steps/BasicInfoStep';
import FinancialInfoStep from './form-steps/FinancialInfoStep';
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
    control
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      debtAmount: searchParams.get('debt') || '',
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
      title: 'Financial Information',
      description: 'Tell us about your financial situation',
      fields: ['debtAmount', 'employmentStatus', 'monthlyIncome']
    },
    {
      title: 'Additional Details',
      description: 'We need some additional information to process your application',
      fields: ['address', 'dateOfBirth', 'ssnLastFour']
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
      const { error } = await supabase.from('applications').insert({
        user_id: user?.id,
        status: 'pending',
        debt_amount: parseFloat(data.debtAmount),
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        date_of_birth: data.dateOfBirth,
        ssn_last_four: data.ssnLastFour,
        employment_status: data.employmentStatus,
        monthly_income: parseFloat(data.monthlyIncome),
        created_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error submitting application:', error);
        toast.error('Error submitting application: ' + error.message);
        throw error;
      }

      toast.success('Application submitted successfully!');
      console.log("Application submitted successfully, navigating to success page");
      navigate('/apply/success');
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error('There was an error submitting your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const currentFields = steps[currentStep].fields;
    let isValid = true;

    // Check if current step fields have errors
    for (const field of currentFields) {
      if (errors[field as keyof ApplicationFormData]) {
        isValid = false;
        break;
      }

      // Also check if required fields are filled
      if (currentFields.includes(field) && field !== 'agreeToTerms') {
        const value = watch(field as keyof ApplicationFormData);
        if (!value || typeof value === 'string' && value.trim() === '') {
          isValid = false;
          break;
        }
      }
    }
    
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
          <FinancialInfoStep 
            register={register} 
            control={control} 
            errors={errors} 
          />
        )}

        {currentStep === 2 && (
          <AdditionalDetailsStep register={register} errors={errors} />
        )}

        {currentStep === 3 && (
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
            {currentStep < steps.length - 1 ? 'Continue' : 'Submit Application'}
          </button>
        </div>
      </form>

      {/* Trust Indicators */}
      <TrustIndicators />
    </div>
  );
};

export default ApplicationForm;

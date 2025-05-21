import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, AlertCircle } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
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
  const {
    user
  } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    watch,
    control
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      debtAmount: searchParams.get('debt') || '',
      agreeToTerms: false
    }
  });
  const steps = [{
    title: 'Basic Information',
    description: 'Let\'s start with your basic details',
    fields: ['firstName', 'lastName', 'email', 'phone']
  }, {
    title: 'Financial Information',
    description: 'Tell us about your financial situation',
    fields: ['debtAmount', 'employmentStatus', 'monthlyIncome']
  }, {
    title: 'Additional Details',
    description: 'We need some additional information to process your application',
    fields: ['address', 'dateOfBirth', 'ssnLastFour']
  }, {
    title: 'Review & Submit',
    description: 'Please review your information and submit your application',
    fields: ['agreeToTerms']
  }];
  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setSubmitting(true);
      console.log("Submitting application data:", data);
      const {
        error
      } = await supabase.from('applications').insert({
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
  return <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => <div key={index} className={`flex-1 ${index < steps.length - 1 ? 'mr-2' : ''}`}>
              <div className={`h-2 rounded-full ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
            </div>)}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          {steps.map((_, index) => <div key={index} className={`${index === currentStep ? 'text-blue-600 font-medium' : ''}`}>
              Step {index + 1}
            </div>)}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Secure Application</h4>
            <p className="text-sm text-blue-700">
              Your information is protected with bank-level security and encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Form Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {steps[currentStep].title}
        </h1>
        <p className="text-gray-600">
          {steps[currentStep].description}
        </p>
      </div>

      {/* Eligibility Requirements */}
      {currentStep === 0 && <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium mb-2">Eligibility Requirements</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Minimum $7,500 in unsecured debt</li>
            <li>• Regular source of income</li>
            <li>• US resident aged 18 or older</li>
            <li>• Ability to make monthly program payments</li>
          </ul>
        </div>}

      {/* Form Fields */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 && <>
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
          </>}

        {currentStep === 1 && <>
            <Input label="Total Debt Amount" type="number" {...register('debtAmount')} error={errors.debtAmount?.message} />
            <Controller name="employmentStatus" control={control} render={({
          field
        }) => <Select label="Employment Status" options={[{
          value: 'employed',
          label: 'Employed'
        }, {
          value: 'self-employed',
          label: 'Self-Employed'
        }, {
          value: 'unemployed',
          label: 'Unemployed'
        }, {
          value: 'retired',
          label: 'Retired'
        }]} value={field.value} onChange={valueOrEvent => {
          if (typeof valueOrEvent === 'string') {
            field.onChange(valueOrEvent);
          } else {
            field.onChange(valueOrEvent.target.value);
          }
        }} error={errors.employmentStatus?.message} />} />
            <Input label="Monthly Income" type="number" {...register('monthlyIncome')} error={errors.monthlyIncome?.message} />
          </>}

        {currentStep === 2 && <>
            <Input label="Address" {...register('address')} error={errors.address?.message} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
            <div className="relative">
              <Input label="Last 4 Digits of SSN" type="password" {...register('ssnLastFour')} error={errors.ssnLastFour?.message} />
              <div className="absolute right-0 top-0 mt-8 mr-3">
                <AlertCircle className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </>}

        {currentStep === 3 && <>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium mb-4">Application Summary</h3>
              <dl className="space-y-3">
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Name:</dt>
                  <dd>{watch('firstName')} {watch('lastName')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Email:</dt>
                  <dd>{watch('email')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Phone:</dt>
                  <dd>{watch('phone')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Debt Amount:</dt>
                  <dd>${watch('debtAmount')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Employment Status:</dt>
                  <dd>{watch('employmentStatus')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Monthly Income:</dt>
                  <dd>${watch('monthlyIncome')}</dd>
                </div>
                <div className="grid grid-cols-2">
                  <dt className="text-gray-600">Address:</dt>
                  <dd>{watch('address')}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input type="checkbox" {...register('agreeToTerms')} className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label className="ml-2 block text-sm text-gray-600">
                  I agree to the terms and conditions and acknowledge that my information
                  will be used in accordance with the privacy policy.
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-600 text-sm">{errors.agreeToTerms.message}</p>}
            </div>
          </>}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {currentStep > 0 && <Button type="button" variant="outline" onClick={handlePrevious} disabled={submitting}>
              Previous
            </Button>}
          
          <Button type="button" variant="primary" onClick={handleNext} className={`${currentStep > 0 ? 'ml-auto' : ''}`} disabled={submitting}>
            {currentStep < steps.length - 1 ? 'Continue' : 'Submit Application'}
          </Button>
        </div>
      </form>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-center space-x-8">
          <img alt="Forbes Advisor Badge" className="h-12 object-contain" src="https://images.ctfassets.net/5xdc9rzhmhnq/2w76p4cNJtyPzBIB2ksKPF/aa2c8cde64b9ab878b081a8103a2f987/Wall_street_journal_logo.svg" />
          <img src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg" alt="Bankrate Certification" className="h-12 object-contain" />
          <img src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg" alt="BBB Accredited" className="h-12 object-contain" />
        </div>
      </div>
    </div>;
};
export default ApplicationForm;

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Check } from 'lucide-react';

interface ReviewSubmitStepProps {
  watch: any;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ 
  watch, 
  register, 
  errors 
}) => {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
        <h3 className="font-medium mb-4 text-blue-800 border-b border-blue-100 pb-2">Application Summary</h3>
        <dl className="space-y-3">
          {[
            { label: 'Name', value: `${watch('firstName')} ${watch('lastName')}` },
            { label: 'Email', value: watch('email') },
            { label: 'Phone', value: watch('phone') },
            { label: 'Debt Amount', value: `$${watch('debtAmount')}` },
            { label: 'Employment Status', value: watch('employmentStatus') },
            { label: 'Monthly Income', value: `$${watch('monthlyIncome')}` },
            { label: 'Address', value: watch('address') },
            { label: 'Date of Birth', value: watch('dateOfBirth') },
            { label: 'SSN (Last 4)', value: watch('ssnLastFour') }
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-2 py-2 border-b border-gray-100 last:border-0">
              <dt className="text-gray-600 font-medium">{item.label}:</dt>
              <dd className="text-gray-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input 
                type="checkbox" 
                id="agreeToTerms"
                {...register('agreeToTerms')} 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="agreeToTerms" className="text-gray-700">
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">terms and conditions</a> and acknowledge that my information
                will be used in accordance with the <a href="/privacy" className="text-blue-600 hover:underline">privacy policy</a>.
              </label>
            </div>
          </div>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-600 text-sm flex items-center">
            <span className="mr-1">⚠️</span>
            {typeof errors.agreeToTerms === 'object' && errors.agreeToTerms !== null && 'message' in errors.agreeToTerms 
              ? String(errors.agreeToTerms.message) 
              : 'You must agree to the terms and conditions'}
          </p>
        )}
      </div>
    </>
  );
};

export default ReviewSubmitStep;

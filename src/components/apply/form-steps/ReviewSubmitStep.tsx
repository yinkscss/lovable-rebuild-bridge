
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

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
          <input 
            type="checkbox" 
            {...register('agreeToTerms')} 
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
          />
          <label className="ml-2 block text-sm text-gray-600">
            I agree to the terms and conditions and acknowledge that my information
            will be used in accordance with the privacy policy.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-red-600 text-sm">{errors.agreeToTerms.message?.toString()}</p>
        )}
      </div>
    </>
  );
};

export default ReviewSubmitStep;

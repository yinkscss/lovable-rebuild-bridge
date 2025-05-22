
import React from 'react';
import { UseFormRegister, FieldErrors, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import Input from '../../ui/Input';
import { AlertCircle } from 'lucide-react';

interface AdditionalDetailsStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AdditionalDetailsStep: React.FC<AdditionalDetailsStepProps> = ({ 
  register, 
  errors 
}) => {
  return (
    <>
      <Input 
        label="Address" 
        {...register('address')} 
        error={errors.address} 
      />
      <Input 
        label="Date of Birth" 
        type="date" 
        {...register('dateOfBirth')} 
        error={errors.dateOfBirth} 
      />
      <div className="relative">
        <Input 
          label="Last 4 Digits of SSN" 
          type="password" 
          {...register('ssnLastFour')} 
          error={errors.ssnLastFour} 
        />
        <div className="absolute right-0 top-0 mt-8 mr-3">
          <AlertCircle className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </>
  );
};

export default AdditionalDetailsStep;

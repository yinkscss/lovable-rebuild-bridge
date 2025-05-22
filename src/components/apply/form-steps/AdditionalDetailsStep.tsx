
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../../ui/Input';

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
        placeholder="Enter your full address"
        {...register('address')} 
        error={errors.address} 
      />
      <Input 
        label="Date of Birth" 
        type="date" 
        placeholder="MM/DD/YYYY"
        {...register('dateOfBirth')} 
        error={errors.dateOfBirth} 
      />
      <Input 
        label="Last 4 Digits of SSN" 
        type="password" 
        placeholder="Enter last 4 digits"
        maxLength={4}
        {...register('ssnLastFour')} 
        error={errors.ssnLastFour} 
      />
      <Input 
        label="Specific Debt Amount" 
        type="number" 
        placeholder="Enterdebt amount(no symbols or commas)"
        {...register('debtAmount')} 
        error={errors.debtAmount} 
      />
    </>
  );
};

export default AdditionalDetailsStep;

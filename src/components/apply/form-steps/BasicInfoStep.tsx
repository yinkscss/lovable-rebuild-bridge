
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../../ui/Input';

interface BasicInfoStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  register, 
  errors 
}) => {
  return (
    <>
      <Input 
        label="First Name" 
        placeholder="Enter your first name"
        {...register('firstName')} 
        error={errors.firstName}
      />
      <Input 
        label="Last Name" 
        placeholder="Enter your last name"
        {...register('lastName')} 
        error={errors.lastName} 
      />
      <Input 
        label="Email" 
        type="email" 
        placeholder="Enter your email address"
        {...register('email')} 
        error={errors.email} 
      />
      <Input 
        label="Phone Number" 
        type="tel" 
        placeholder="Enter your 10-digit phone number"
        {...register('phone')} 
        error={errors.phone} 
      />
    </>
  );
};

export default BasicInfoStep;

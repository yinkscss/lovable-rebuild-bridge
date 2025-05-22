
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../../ui/Input';

interface BasicInfoStepProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ register, errors }) => {
  return (
    <>
      <Input label="First Name" {...register('firstName')} error={errors.firstName} />
      <Input label="Last Name" {...register('lastName')} error={errors.lastName} />
      <Input label="Email" type="email" {...register('email')} error={errors.email} />
      <Input label="Phone" type="tel" {...register('phone')} error={errors.phone} />
    </>
  );
};

export default BasicInfoStep;

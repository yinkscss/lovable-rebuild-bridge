
import React from 'react';
import { UseFormRegister, FieldErrors, Control, Controller } from 'react-hook-form';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

interface FinancialInfoStepProps {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
}

const FinancialInfoStep: React.FC<FinancialInfoStepProps> = ({ 
  register, 
  control, 
  errors 
}) => {
  return (
    <>
      <Controller 
        name="employmentStatus" 
        control={control} 
        render={({ field }) => (
          <Select 
            label="Employment Status" 
            options={[
              { value: 'employed', label: 'Employed' },
              { value: 'self-employed', label: 'Self-Employed' },
              { value: 'unemployed', label: 'Unemployed' },
              { value: 'retired', label: 'Retired' }
            ]} 
            placeholder="Select your employment status"
            value={field.value} 
            onChange={valueOrEvent => {
              if (typeof valueOrEvent === 'string') {
                field.onChange(valueOrEvent);
              } else {
                field.onChange(valueOrEvent.target.value);
              }
            }} 
            error={errors.employmentStatus} 
          />
        )} 
      />
      <Input 
        label="Monthly Income" 
        type="number" 
        placeholder="Enter your monthly income"
        {...register('monthlyIncome')} 
        error={errors.monthlyIncome} 
      />
    </>
  );
};

export default FinancialInfoStep;

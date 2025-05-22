
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
      <Input 
        label="Total Debt Amount" 
        type="number" 
        {...register('debtAmount')} 
        error={errors.debtAmount?.message} 
      />
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
            value={field.value} 
            onChange={valueOrEvent => {
              if (typeof valueOrEvent === 'string') {
                field.onChange(valueOrEvent);
              } else {
                field.onChange(valueOrEvent.target.value);
              }
            }} 
            error={errors.employmentStatus?.message} 
          />
        )} 
      />
      <Input 
        label="Monthly Income" 
        type="number" 
        {...register('monthlyIncome')} 
        error={errors.monthlyIncome?.message} 
      />
    </>
  );
};

export default FinancialInfoStep;

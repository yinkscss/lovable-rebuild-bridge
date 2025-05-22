
import React from 'react';
import { Controller } from 'react-hook-form';
import { DEBT_RANGES } from '../../../lib/constants';
import Select from '../../ui/Select';

interface DebtSelectionStepProps {
  control: any;
  errors: any;
}

const DebtSelectionStep: React.FC<DebtSelectionStepProps> = ({ control, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Debt Selection</h3>
        <p className="text-gray-600">
          Please select your debt amount range to help us better understand your financial situation.
        </p>
      </div>

      <Controller
        name="debtRange"
        control={control}
        render={({ field }) => (
          <Select
            label="Debt Amount Range"
            options={DEBT_RANGES.map(range => ({
              value: range.id,
              label: range.label
            }))}
            placeholder="Select your debt amount range"
            value={field.value}
            onChange={valueOrEvent => {
              if (typeof valueOrEvent === 'string') {
                field.onChange(valueOrEvent);
              } else {
                field.onChange(valueOrEvent.target.value);
              }
            }}
            error={errors.debtRange}
          />
        )}
      />
    </div>
  );
};

export default DebtSelectionStep;

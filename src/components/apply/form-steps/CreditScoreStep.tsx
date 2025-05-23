import React from 'react';
import { Controller } from 'react-hook-form';
import { Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const creditScoreRanges = [
  { 
    id: 'excellent', 
    label: 'Excellent', 
    value: 'excellent', 
    range: '720-850',
    description: 'Best rates and terms'
  },
  { 
    id: 'good', 
    label: 'Good', 
    value: 'good', 
    range: '690-719',
    description: 'Favorable rates and terms'
  },
  { 
    id: 'fair', 
    label: 'Fair', 
    value: 'fair', 
    range: '630-689',
    description: 'Average rates and terms'
  },
  { 
    id: 'poor', 
    label: 'Poor', 
    value: 'poor', 
    range: '300-629',
    description: 'Limited options, higher rates'
  }
];

interface CreditScoreStepProps {
  control: any;
  errors: any;
}

const CreditScoreStep: React.FC<CreditScoreStepProps> = ({ control, errors }) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">What's your current credit score?</h3>
        <p className="text-gray-600">Select the range that best represents your credit score</p>
      </div>
      
      <Controller
        name="creditScore"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditScoreRanges.map((range) => (
              <Card
                key={range.id}
                className={`p-4 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md ${
                  field.value === range.value ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'
                }`}
                onClick={() => field.onChange(range.value)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{range.label}</h4>
                    <div className="text-sm text-gray-500">Score: {range.range}</div>
                    <p className="text-sm mt-2">{range.description}</p>
                  </div>
                  {field.value === range.value && (
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      />
      {errors.creditScore && (
        <p className="mt-2 text-sm text-red-600">{errors.creditScore.message}</p>
      )}
    </div>
  );
};

export default CreditScoreStep;

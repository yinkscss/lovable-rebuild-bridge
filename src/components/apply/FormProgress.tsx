
import React from 'react';

interface Step {
  title: string;
  description: string;
  fields: string[];
}

interface FormProgressProps {
  steps: Step[];
  currentStep: number;
}

const FormProgress: React.FC<FormProgressProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((_, index) => (
          <div key={index} className={`flex-1 ${index < steps.length - 1 ? 'mr-2' : ''}`}>
            <div className={`h-2 rounded-full ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        {steps.map((_, index) => (
          <div key={index} className={`${index === currentStep ? 'text-blue-600 font-medium' : ''}`}>
            Step {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;

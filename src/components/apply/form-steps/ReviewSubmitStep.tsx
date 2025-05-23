
import React from 'react';
import { UseFormWatch } from 'react-hook-form';

interface ReviewSubmitStepProps {
  watch: UseFormWatch<any>;
  register: any;
  errors: any;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ watch, register, errors }) => {
  const watchedValues = watch();
  
  const formatCreditScore = (score: string) => {
    if (!score) return 'Not provided';
    // Map the technical value to a user-friendly label
    const scoreMap: {[key: string]: string} = {
      'excellent': 'Excellent (720-850)',
      'good': 'Good (690-719)',
      'fair': 'Fair (630-689)',
      'poor': 'Poor (300-629)'
    };
    return scoreMap[score] || score;
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg mb-4">Review Your Information</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{watchedValues.firstName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{watchedValues.lastName || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{watchedValues.email || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{watchedValues.phone || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Credit Score</p>
            <p className="font-medium">{formatCreditScore(watchedValues.creditScore)}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employment Status</p>
              <p className="font-medium capitalize">{watchedValues.employmentStatus || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Income</p>
              <p className="font-medium">${watchedValues.monthlyIncome || 'Not provided'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Debt Amount</p>
            <p className="font-medium">${watchedValues.debtAmount || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium">{watchedValues.address || 'Not provided'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{watchedValues.dateOfBirth || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last 4 Digits of SSN</p>
              <p className="font-medium">{watchedValues.ssnLastFour ? '••••' : 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...register('agreeToTerms')}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="terms" className="text-gray-700">
            I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;

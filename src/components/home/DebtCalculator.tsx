import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { DEBT_RANGES, VALUE_PROPS } from '../../lib/constants';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
const DebtCalculator: React.FC = () => {
  const [debtAmount, setDebtAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtAmount) {
      setError('Please select your debt amount');
      return;
    }

    // Navigate to application page with selected debt amount
    navigate(`/apply?debt=${debtAmount}`);
  };
  const handleDebtAmountChange = (valueOrEvent: string | React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof valueOrEvent === 'string') {
      setDebtAmount(valueOrEvent);
    } else {
      setDebtAmount(valueOrEvent.target.value);
    }
  };
  return <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            See If You Qualify For Debt Relief
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {VALUE_PROPS.map((prop, index) => <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-blue-500" />
                </div>
                <p className="ml-2 text-lg">{prop}</p>
              </div>)}
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <Select options={DEBT_RANGES.map(range => ({
            value: range.id,
            label: range.label
          }))} value={debtAmount} onChange={handleDebtAmountChange} label="Select Debt Amount" placeholder="Select Debt Amount" error={error} required className="mb-4" />
            
            <Button type="submit" variant="primary" size="lg" fullWidth className="bg-blue-500 hover:bg-blue-600 mt-2" icon={<ArrowRight className="h-5 w-5" />}>
              Let's Go
            </Button>
          </form>
          
          <div className="flex justify-center mt-12 space-x-6">
            <img alt="Wall Street Journal" className="h-14 object-contain" src="https://images.ctfassets.net/5xdc9rzhmhnq/5Lu8G1TwoxMc3Qu8cXSeV/c0b2d4eeeb3c79e961ef13aeb776c353/NDR-Badge-2025__1_-99-__3_.svg" />
            <img src="https://via.placeholder.com/140x70" alt="Forbes Advisor" className="h-14 object-contain" />
            <img src="https://via.placeholder.com/140x70" alt="Bankrate" className="h-14 object-contain" />
          </div>
        </div>
      </div>
    </section>;
};
export default DebtCalculator;
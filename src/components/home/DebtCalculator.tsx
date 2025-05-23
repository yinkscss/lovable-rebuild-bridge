
import React, { useState } from 'react';
import { ArrowRight, Check, CreditCard, Shield, Home, Briefcase, GraduationCap } from 'lucide-react';
import { DEBT_RANGES, VALUE_PROPS } from '../../lib/constants';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';

const DebtCalculator: React.FC = () => {
  const [debtAmount, setDebtAmount] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('credit-cards');
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

  const navItems = [
    { id: 'credit-cards', label: 'Credit Cards', icon: <CreditCard className="h-5 w-5 mb-1" /> },
    { id: 'insurance', label: 'Insurance', icon: <Shield className="h-5 w-5 mb-1" /> },
    { id: 'mortgages', label: 'Mortgages', icon: <Home className="h-5 w-5 mb-1" /> },
    { id: 'personal-loans', label: 'Personal Loans', icon: <Briefcase className="h-5 w-5 mb-1" /> },
    { id: 'student-loans', label: 'Student Loans', icon: <GraduationCap className="h-5 w-5 mb-1" /> },
  ];

  return <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <nav className="max-w-4xl mx-auto mb-10 overflow-x-auto">
          <ul className="flex justify-between min-w-full border-b">
            {navItems.map((item) => (
              <li key={item.id} className="flex-1 text-center">
                <Link 
                  to={`/apply?category=${item.id}`} 
                  className={`
                    flex flex-col items-center justify-center py-3 px-4 
                    transition-all duration-200 
                    ${activeCategory === item.id 
                      ? 'text-blue-600 border-b-2 border-blue-500 font-medium' 
                      : 'text-gray-600 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50'
                    }
                    rounded-t-md text-sm
                  `}
                  onClick={() => setActiveCategory(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
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
            <img alt="Wall Street Journal" src="https://images.ctfassets.net/5xdc9rzhmhnq/5Lu8G1TwoxMc3Qu8cXSeV/c0b2d4eeeb3c79e961ef13aeb776c353/NDR-Badge-2025__1_-99-__3_.svg" className="h-20 object-contain" />
            <img alt="Forbes Advisor" src="https://images.ctfassets.net/5xdc9rzhmhnq/2w76p4cNJtyPzBIB2ksKPF/aa2c8cde64b9ab878b081a8103a2f987/Wall_street_journal_logo.svg" className="h-20 object-contain" />
            <img alt="Bankrate" src="https://start.nationaldebtrelief.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F5xdc9rzhmhnq%2F5tJzAk64KVtKPW0nJifBB0%2Feec2e8a4260d5e08b7dafa41e80b06eb%2Fimage__9_.png%3Fw%3D120%26fm%3Dwebp%26fit%3Dfill&w=256&q=75" className="h-20 object-contain" />
          </div>
        </div>
      </div>
    </section>;
};

export default DebtCalculator;

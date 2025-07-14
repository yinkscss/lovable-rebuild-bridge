
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import { DollarSign, TrendingUp, Calculator, Target } from 'lucide-react';

interface Application {
  id: string;
  debt_amount: number;
  status: string;
}

const FinancialSummary: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('id, debt_amount, status')
        .eq('user_id', user.id);

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load financial summary');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    // Only include applications that are not declined or cancelled
    const activeApplications = applications.filter(app => 
      app.status !== 'declined' && app.status !== 'cancelled'
    );
    
    const totalDebt = activeApplications.reduce((sum, app) => sum + (app.debt_amount || 0), 0);
    const savingsPercentage = 0.4; // 40% average savings
    const totalPotentialSavings = totalDebt * savingsPercentage;
    
    return {
      totalDebt,
      totalPotentialSavings,
      applicationCount: activeApplications.length
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { totalDebt, totalPotentialSavings, applicationCount } = calculateTotals();

  if (applicationCount === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No applications found to calculate financial summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Financial Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Debt</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt)}</p>
              <p className="text-red-100 text-xs mt-1">{applicationCount} application{applicationCount !== 1 ? 's' : ''}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Potential Savings</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPotentialSavings)}</p>
              <p className="text-green-100 text-xs mt-1">Est. 40% average</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Net Result</p>
              <p className="text-2xl font-bold">{formatCurrency(totalDebt - totalPotentialSavings)}</p>
              <p className="text-blue-100 text-xs mt-1">After settlement</p>
            </div>
            <Target className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Potential savings are estimates based on typical debt settlement outcomes. 
          Actual results may vary based on individual circumstances and creditor negotiations.
          Only active applications (pending/approved) are included in calculations.
        </p>
      </div>
    </div>
  );
};

export default FinancialSummary;

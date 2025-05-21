import React from 'react';
import { Card } from '../../components/ui/Card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { Users, DollarSign, TrendingUp, Clock } from 'lucide-react';

function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const [
        { data: applications },
        { data: users },
        { data: totalDebt }
      ] = await Promise.all([
        supabase.from('applications').select('status, debt_amount, created_at').throwOnError(),
        supabase.from('users').select('count').throwOnError(),
        supabase.from('applications').select('debt_amount').throwOnError()
      ]);

      const counts = applications?.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const totalDebtAmount = totalDebt?.reduce((sum, app) => sum + (Number(app.debt_amount) || 0), 0) || 0;

      // Calculate monthly applications for chart
      const monthlyData = applications?.reduce((acc, app) => {
        const month = new Date(app.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) acc[month] = { name: month, count: 0, amount: 0 };
        acc[month].count++;
        acc[month].amount += Number(app.debt_amount) || 0;
        return acc;
      }, {} as Record<string, { name: string; count: number; amount: number }>);

      return {
        totalUsers: users?.[0]?.count || 0,
        totalDebt: totalDebtAmount,
        applications: {
          total: applications?.length || 0,
          pending: counts['pending'] || 0,
          approved: counts['approved'] || 0,
          rejected: counts['rejected'] || 0
        },
        monthlyData: Object.values(monthlyData || {}).slice(-6)
      };
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Debt</p>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalDebt || 0)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold">{stats?.applications.pending || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold">
                {stats?.applications.total
                  ? Math.round((stats.applications.approved / stats.applications.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Applications</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Debt Amount</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
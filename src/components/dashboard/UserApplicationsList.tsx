
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { toast } from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Clock, CheckCircle, XCircle, Plus, FileText } from 'lucide-react';
import Button from '../ui/Button';

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  debt_amount: number;
  completion_percentage: number;
  is_complete: boolean;
  completed_at: string | null;
  enrollment_status?: 'pending' | 'approved' | 'declined';
  negotiations_status?: 'pending' | 'approved' | 'declined';
  created_at: string;
  updated_at: string;
}

interface UserApplicationsListProps {
  onSelectApplication: (applicationId: string) => void;
  selectedApplicationId?: string;
}

const UserApplicationsList: React.FC<UserApplicationsListProps> = ({
  onSelectApplication,
  selectedApplicationId
}) => {
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
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);

      // Auto-select the first application if none selected
      if (data && data.length > 0 && !selectedApplicationId) {
        onSelectApplication(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'declined':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const createNewApplication = () => {
    // Navigate to apply page
    window.location.href = '/apply';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
        <Button onClick={createNewApplication} variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You haven't submitted any applications yet.</p>
          <Button onClick={createNewApplication} variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Application
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedApplicationId === app.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectApplication(app.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Application #{app.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {app.first_name} {app.last_name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(app.status)}
                  <span className={getStatusBadge(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="font-medium text-gray-700">Debt Amount:</span>
                  <p className="text-gray-900">{formatCurrency(app.debt_amount)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <p className="text-gray-900">{formatDate(app.created_at)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="text-gray-600">{app.completion_percentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${app.completion_percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Status indicators */}
              {app.status === 'approved' && (
                <div className="flex space-x-4 text-xs">
                  <div className="flex items-center">
                    {getStatusIcon(app.enrollment_status || 'pending')}
                    <span className="ml-1">
                      Enrollment: {(app.enrollment_status || 'pending').charAt(0).toUpperCase() + (app.enrollment_status || 'pending').slice(1)}
                    </span>
                  </div>
                  {app.enrollment_status === 'approved' && (
                    <div className="flex items-center">
                      {getStatusIcon(app.negotiations_status || 'pending')}
                      <span className="ml-1">
                        Negotiations: {(app.negotiations_status || 'pending').charAt(0).toUpperCase() + (app.negotiations_status || 'pending').slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {app.is_complete && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Application Complete
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserApplicationsList;

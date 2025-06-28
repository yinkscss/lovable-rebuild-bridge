import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import ApplicationsListItem from './ApplicationsListItem';
import ApplicationsFilterBar from './ApplicationsFilterBar';
import ApplicationsLoading from './ApplicationsLoading';

interface Application {
  id: string;
  status: 'pending' | 'approved' | 'declined';
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  debt_amount: number;
  address?: string;
  date_of_birth?: string;
  ssn_last_four?: string;
  employment_status?: string;
  monthly_income?: number;
  completion_percentage?: number;
  is_complete?: boolean;
  completed_at?: string;
  enrollment_status?: 'pending' | 'approved' | 'declined';
  enrollment_approved_at?: string;
  negotiations_status?: 'pending' | 'approved' | 'declined';
  negotiations_approved_at?: string;
  created_at: string;
  updated_at: string;
}

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  // Load applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setApplications(data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, (payload) => {
        console.log('Change received!', payload);
        // Refresh the applications list
        fetchApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'approved', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { ...app, status: 'approved', updated_at: new Date().toISOString() } 
          : app
      ));
      
      toast.success('Application approved successfully');
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: 'declined', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { ...app, status: 'declined', updated_at: new Date().toISOString() } 
          : app
      ));
      
      toast.success('Application declined');
    } catch (error) {
      console.error('Error declining application:', error);
      toast.error('Failed to decline application');
    }
  };

  const handleApproveEnrollment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          enrollment_status: 'approved',
          enrollment_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { 
              ...app, 
              enrollment_status: 'approved',
              enrollment_approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            } 
          : app
      ));
      
      toast.success('Program enrollment approved successfully');
    } catch (error) {
      console.error('Error approving enrollment:', error);
      toast.error('Failed to approve enrollment');
    }
  };

  const handleDeclineEnrollment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          enrollment_status: 'declined',
          enrollment_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { 
              ...app, 
              enrollment_status: 'declined',
              enrollment_approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            } 
          : app
      ));
      
      toast.success('Program enrollment declined');
    } catch (error) {
      console.error('Error declining enrollment:', error);
      toast.error('Failed to decline enrollment');
    }
  };

  const handleApproveNegotiations = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          negotiations_status: 'approved',
          negotiations_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { 
              ...app, 
              negotiations_status: 'approved',
              negotiations_approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            } 
          : app
      ));
      
      toast.success('Creditor negotiations approved successfully');
    } catch (error) {
      console.error('Error approving negotiations:', error);
      toast.error('Failed to approve negotiations');
    }
  };

  const handleDeclineNegotiations = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          negotiations_status: 'declined',
          negotiations_approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === id 
          ? { 
              ...app, 
              negotiations_status: 'declined',
              negotiations_approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString() 
            } 
          : app
      ));
      
      toast.success('Creditor negotiations declined');
    } catch (error) {
      console.error('Error declining negotiations:', error);
      toast.error('Failed to decline negotiations');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      `${app.first_name} ${app.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <ApplicationsLoading />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Applications Management</h2>
      
      <ApplicationsFilterBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      
      {/* Applications Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Progress
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationsListItem
                  key={application.id}
                  application={application}
                  expandedId={expandedId}
                  toggleExpand={toggleExpand}
                  handleApprove={handleApprove}
                  handleDecline={handleDecline}
                  handleApproveEnrollment={handleApproveEnrollment}
                  handleDeclineEnrollment={handleDeclineEnrollment}
                  handleApproveNegotiations={handleApproveNegotiations}
                  handleDeclineNegotiations={handleDeclineNegotiations}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No applications found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsList;

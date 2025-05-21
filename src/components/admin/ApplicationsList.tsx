
import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

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
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Applications Management</h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3">Loading applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Applications Management</h2>
      
      <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter */}
        <div className="flex space-x-2">
          <span className="py-2">Filter:</span>
          <button 
            className={`px-4 py-1 rounded-md ${filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-1 rounded-md ${filterStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-4 py-1 rounded-md ${filterStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}
            onClick={() => setFilterStatus('approved')}
          >
            Approved
          </button>
          <button 
            className={`px-4 py-1 rounded-md ${filterStatus === 'declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}
            onClick={() => setFilterStatus('declined')}
          >
            Declined
          </button>
        </div>
      </div>
      
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
                Status
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
                <React.Fragment key={application.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.first_name} {application.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          application.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {application.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mr-2 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(application.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDecline(application.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => toggleExpand(application.id)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        {expandedId === application.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View Details
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedId === application.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="text-sm">
                          <h4 className="font-medium mb-2">Application Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p><span className="font-medium">First Name:</span> {application.first_name}</p>
                              <p><span className="font-medium">Last Name:</span> {application.last_name}</p>
                              <p><span className="font-medium">Email:</span> {application.email}</p>
                              <p><span className="font-medium">Phone:</span> {application.phone}</p>
                              <p><span className="font-medium">Address:</span> {application.address || 'N/A'}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Debt Amount:</span> ${application.debt_amount}</p>
                              <p><span className="font-medium">Employment Status:</span> {application.employment_status || 'N/A'}</p>
                              <p><span className="font-medium">Monthly Income:</span> ${application.monthly_income || 'N/A'}</p>
                              <p><span className="font-medium">Date Submitted:</span> {formatDate(application.created_at)}</p>
                              <p><span className="font-medium">Last Updated:</span> {formatDate(application.updated_at)}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

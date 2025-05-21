import React, { useState } from 'react';
import { Check, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import Button from '../ui/Button';
import { ApplicationStatus } from '../../types';

// Mock data for demonstration
const mockApplications: ApplicationStatus[] = [
  {
    id: '1',
    status: 'pending',
    applicationData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '555-123-4567',
      debtAmount: '3',
    },
    createdAt: '2023-06-15T10:30:00Z',
    updatedAt: '2023-06-15T10:30:00Z',
  },
  {
    id: '2',
    status: 'approved',
    applicationData: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '555-987-6543',
      debtAmount: '4',
    },
    createdAt: '2023-06-14T14:45:00Z',
    updatedAt: '2023-06-14T15:20:00Z',
  },
  {
    id: '3',
    status: 'declined',
    applicationData: {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      phone: '555-456-7890',
      debtAmount: '2',
    },
    createdAt: '2023-06-13T09:15:00Z',
    updatedAt: '2023-06-13T10:00:00Z',
  },
];

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationStatus[]>(mockApplications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'declined'>('all');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApprove = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id 
        ? { ...app, status: 'approved', updatedAt: new Date().toISOString() } 
        : app
    ));
  };

  const handleDecline = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id 
        ? { ...app, status: 'declined', updatedAt: new Date().toISOString() } 
        : app
    ));
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicationData.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.applicationData.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationData.email.toLowerCase().includes(searchTerm.toLowerCase());
    
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
                            {application.applicationData.firstName} {application.applicationData.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.applicationData.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
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
                            icon={<Check className="h-4 w-4" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDecline(application.id)}
                            icon={<X className="h-4 w-4" />}
                          >
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
                              <p><span className="font-medium">First Name:</span> {application.applicationData.firstName}</p>
                              <p><span className="font-medium">Last Name:</span> {application.applicationData.lastName}</p>
                              <p><span className="font-medium">Email:</span> {application.applicationData.email}</p>
                              <p><span className="font-medium">Phone:</span> {application.applicationData.phone}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Debt Amount Range:</span> {application.applicationData.debtAmount}</p>
                              <p><span className="font-medium">Date Submitted:</span> {formatDate(application.createdAt)}</p>
                              <p><span className="font-medium">Last Updated:</span> {formatDate(application.updatedAt)}</p>
                              <p><span className="font-medium">Status:</span> {application.status}</p>
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
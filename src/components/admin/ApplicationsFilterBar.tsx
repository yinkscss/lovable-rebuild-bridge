
import React from 'react';
import { Search } from 'lucide-react';

interface ApplicationsFilterBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filterStatus: 'all' | 'pending' | 'approved' | 'declined' | 'cancelled';
  setFilterStatus: React.Dispatch<React.SetStateAction<'all' | 'pending' | 'approved' | 'declined' | 'cancelled'>>;
}

const ApplicationsFilterBar: React.FC<ApplicationsFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus
}) => {
  return (
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
        <button 
          className={`px-4 py-1 rounded-md ${filterStatus === 'cancelled' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100'}`}
          onClick={() => setFilterStatus('cancelled')}
        >
          Cancelled
        </button>
      </div>
    </div>
  );
};

export default ApplicationsFilterBar;

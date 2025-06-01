
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Trash2, 
  Eye,
  MoreHorizontal,
  Download
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

interface Application {
  id: string;
  status: string;
  debt_amount: number;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<{ [key: string]: Application }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'approved' | 'declined'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchApplications();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users from auth.users via the admin API
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Fetch additional profile data from public.users
      const { data: profileUsers, error: profileError } = await supabase
        .from('users')
        .select('*');

      if (profileError) throw profileError;

      // Merge auth data with profile data
      const mergedUsers = authUsers.users.map(authUser => {
        const profile = profileUsers.find(p => p.id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || '',
          first_name: profile?.first_name || authUser.user_metadata?.first_name || '',
          last_name: profile?.last_name || authUser.user_metadata?.last_name || '',
          phone: profile?.phone || authUser.user_metadata?.phone || '',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          last_sign_in_at: authUser.last_sign_in_at,
          email_confirmed_at: authUser.email_confirmed_at
        };
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*');

      if (error) throw error;

      // Create a map of user_id to application
      const appMap: { [key: string]: Application } = {};
      data?.forEach(app => {
        if (app.user_id) {
          appMap[app.user_id] = app;
        }
      });

      setApplications(appMap);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (profileError) throw profileError;

      // Update auth user if email changed
      if (editForm.email !== selectedUser.email) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          selectedUser.id,
          {
            email: editForm.email,
            user_metadata: {
              first_name: editForm.first_name,
              last_name: editForm.last_name
            }
          }
        );

        if (authError) throw authError;
      }

      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Registration Date', 'Last Sign In', 'Application Status', 'Debt Amount'].join(','),
      ...filteredUsers.map(user => [
        `"${user.first_name} ${user.last_name}"`,
        user.email,
        user.phone,
        new Date(user.created_at).toLocaleDateString(),
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never',
        applications[user.id]?.status || 'No Application',
        applications[user.id]?.debt_amount || '0'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const userApplication = applications[user.id];
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && user.last_sign_in_at) ||
      (filterStatus === 'pending' && !user.email_confirmed_at) ||
      (userApplication && userApplication.status === filterStatus);

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (user: User) => {
    const application = applications[user.id];
    
    if (!user.email_confirmed_at) {
      return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Unverified</span>;
    }
    
    if (application) {
      const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        declined: 'bg-red-100 text-red-800'
      };
      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[application.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
          {application.status}
        </span>
      );
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Active</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="mt-1 text-gray-600">Manage user accounts and monitor application status</p>
        </div>
        <Button onClick={exportUsers} variant="outline" className="mt-4 md:mt-0">
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            label=""
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'active', label: 'Active Users' },
              { value: 'pending', label: 'Pending Verification' },
              { value: 'approved', label: 'Approved Applications' },
              { value: 'declined', label: 'Declined Applications' }
            ]}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value as any)}
          />
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const application = applications[user.id];
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      {user.last_sign_in_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          Last: {new Date(user.last_sign_in_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application ? (
                        <div>
                          <div className="font-medium">${application.debt_amount.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(application.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No application</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit User: {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="First Name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                />
                
                <Input
                  label="Last Name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
                
                <Input
                  label="Phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleUpdateUser}
                >
                  Update User
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

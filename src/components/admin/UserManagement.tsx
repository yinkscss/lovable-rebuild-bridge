import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Edit, 
  Trash2, 
  Download,
  Shield,
  ShieldOff,
  Users
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
  is_admin?: boolean;
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'admin' | 'regular'>('all');
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
      
      // Fetch users with admin status
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          admin_users!left(id)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Transform data to include admin status
      const formattedUsers = (usersData || []).map(user => ({
        id: user.id,
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        is_admin: user.admin_users && user.admin_users.length > 0
      }));

      setUsers(formattedUsers);
      
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
      const { error } = await supabase
        .from('users')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_name: 'user_updated',
        target_user: selectedUser.id,
        action_details: { updated_fields: Object.keys(editForm) }
      });

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
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_name: 'user_deleted',
        target_user: userId,
        action_details: { user_name: userName }
      });

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handlePromoteToAdmin = async (userId: string, userName: string) => {
    try {
      const { data, error } = await supabase.rpc('promote_to_admin', {
        target_user_id: userId
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`${userName} promoted to admin successfully`);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user to admin');
    }
  };

  const handleDemoteFromAdmin = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove admin privileges from "${userName}"?`)) {
      return;
    }

    try {
      const { data, error } = await supabase.rpc('demote_from_admin', {
        target_user_id: userId
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Admin privileges removed from ${userName}`);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error demoting user:', error);
      toast.error('Failed to remove admin privileges');
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Registration Date', 'Admin Status', 'Application Status', 'Debt Amount'].join(','),
      ...filteredUsers.map(user => [
        `"${user.first_name} ${user.last_name}"`,
        user.email,
        user.phone,
        new Date(user.created_at).toLocaleDateString(),
        user.is_admin ? 'Admin' : 'Regular User',
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
      (filterStatus === 'admin' && user.is_admin) ||
      (filterStatus === 'regular' && !user.is_admin) ||
      (filterStatus === 'active' && userApplication);

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (user: User) => {
    if (user.is_admin) {
      return <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">Admin</span>;
    }
    
    const application = applications[user.id];
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
    
    return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Regular User</span>;
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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-3 text-blue-600" />
            User Management
          </h2>
          <p className="mt-1 text-gray-600">Manage user accounts and admin privileges</p>
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
              { value: 'admin', label: 'Admin Users' },
              { value: 'regular', label: 'Regular Users' },
              { value: 'active', label: 'Users with Applications' }
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
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          user.is_admin ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
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
                        
                        {user.is_admin ? (
                          <button
                            onClick={() => handleDemoteFromAdmin(user.id, `${user.first_name} ${user.last_name}`)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Remove admin privileges"
                          >
                            <ShieldOff className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePromoteToAdmin(user.id, `${user.first_name} ${user.last_name}`)}
                            className="text-green-600 hover:text-green-900"
                            title="Promote to admin"
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                        )}
                        
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

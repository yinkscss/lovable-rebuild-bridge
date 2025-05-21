
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const UserProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get user profile data
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || user.email || '');
          setPhone(data.phone || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setUpdating(true);

      // Update the user profile
      const { error: profileError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update the auth user metadata if email has changed
      if (email !== user.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          email: email,
          data: {
            first_name: firstName,
            last_name: lastName
          }
        });
        
        if (authUpdateError) throw authUpdateError;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-6">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label="Last Name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  );
};

export default UserProfileForm;

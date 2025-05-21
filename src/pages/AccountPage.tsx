
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { UserCog, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AccountPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        if (!user) {
          navigate('/auth');
          return;
        }

        // Try to get user profile from the users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (profile) {
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setEmail(profile.email || '');
          setPhone(profile.phone || '');
        } else {
          // If no profile exists, create one
          const userData = user.user_metadata || {};
          
          // Create a new profile with data from auth if available
          await supabase.from('users').insert({
            id: user.id,
            email: user.email,
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            phone: userData.phone || ''
          });
          
          setFirstName(userData.first_name || '');
          setLastName(userData.last_name || '');
          setEmail(user.email || '');
          setPhone(userData.phone || '');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update email in auth if it changed
      if (email !== user.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({ 
          email: email 
        });
        
        if (authUpdateError) {
          throw authUpdateError;
        }
      }

      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return <Layout><div className="py-12 bg-gray-50 flex justify-center">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden md:max-w-2xl">
          <div className="md:flex">
            <div className="w-full p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <UserCog className="mr-2 h-6 w-6" />
                  Account Settings
                </h2>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              
              {error && (
                <div className="mb-4 p-2 bg-red-50 border border-red-100 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                <Button type="submit" variant="primary" fullWidth disabled={loading}>
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;

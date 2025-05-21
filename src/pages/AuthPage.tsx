
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Shield, Mail, Lock, User, Phone } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminAuth = location.pathname === '/admin/auth';

  useEffect(() => {
    if (user) {
      if (isAdminAuth && isAdmin) {
        navigate('/admin/dashboard');
      } else if (!isAdminAuth) {
        navigate('/account');
      }
    }
  }, [user, isAdmin, isAdminAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, firstName, lastName, phone);
        // Show success message or redirect
        if (isAdminAuth) {
          navigate('/admin/dashboard');
        } else {
          navigate('/account');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isAdminAuth ? 'Admin Access' : (mode === 'signin' ? 'Sign in to your account' : 'Create your account')}
          </h2>
          {!isAdminAuth && (
            <p className="mt-2 text-center text-sm text-gray-600">
              {mode === 'signin' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'signup' && (
                <>
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    required
                  />
                </>
              )}

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
              >
                {mode === 'signin' ? 'Sign in' : 'Sign up'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;

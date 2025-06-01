
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { Lock, Shield, Key, AlertCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return { label: 'Very Weak', color: 'text-red-600' };
      case 2: return { label: 'Weak', color: 'text-orange-600' };
      case 3: return { label: 'Fair', color: 'text-yellow-600' };
      case 4: return { label: 'Good', color: 'text-blue-600' };
      case 5: return { label: 'Strong', color: 'text-green-600' };
      default: return { label: '', color: '' };
    }
  };

  const strength = passwordStrength(passwordForm.newPassword);
  const strengthInfo = getStrengthLabel(strength);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
        <p className="mt-1 text-gray-600">Manage your admin account security settings</p>
      </div>

      {/* Security Overview */}
      <Card className="p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Account Secured</p>
                <p className="text-xs text-green-600">Admin access active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Key className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Password Protected</p>
                <p className="text-xs text-blue-600">Last changed recently</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Regular Updates</p>
                <p className="text-xs text-yellow-600">Keep security current</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Lock className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
            placeholder="Enter your current password"
            required
          />

          <div>
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              placeholder="Enter your new password"
              required
            />
            
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Password Strength:</span>
                  <span className={`text-sm font-medium ${strengthInfo.color}`}>
                    {strengthInfo.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength === 1 ? 'bg-red-500 w-1/5' :
                      strength === 2 ? 'bg-orange-500 w-2/5' :
                      strength === 3 ? 'bg-yellow-500 w-3/5' :
                      strength === 4 ? 'bg-blue-500 w-4/5' :
                      strength === 5 ? 'bg-green-500 w-full' :
                      'bg-gray-300 w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
            placeholder="Confirm your new password"
            required
          />

          {/* Password Requirements */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className={`flex items-center ${passwordForm.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                <span className="mr-2">{passwordForm.newPassword.length >= 8 ? '✓' : '○'}</span>
                At least 8 characters long
              </li>
              <li className={`flex items-center ${/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[A-Z]/.test(passwordForm.newPassword) ? '✓' : '○'}</span>
                Contains uppercase letter
              </li>
              <li className={`flex items-center ${/[a-z]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[a-z]/.test(passwordForm.newPassword) ? '✓' : '○'}</span>
                Contains lowercase letter
              </li>
              <li className={`flex items-center ${/[0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[0-9]/.test(passwordForm.newPassword) ? '✓' : '○'}</span>
                Contains number
              </li>
              <li className={`flex items-center ${/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? '✓' : '○'}</span>
                Contains special character
              </li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading || passwordForm.newPassword !== passwordForm.confirmPassword || strength < 3}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Security Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Change your password regularly (at least every 90 days)
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Use a unique password that you don't use for other accounts
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Consider using a password manager to generate and store secure passwords
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Always log out when using shared or public computers
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;

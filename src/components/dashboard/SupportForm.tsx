import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { COMPANY_PHONE } from '../../lib/constants';
// Removed unused supabase import
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const SupportForm: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSubmitting(true);

      // In a real app, you would create a support_requests table
      // For now, we'll just log it and show a success message
      console.log('Support request:', { userId: user.id, subject, message });
      
      // Clear the form
      setSubject('');
      setMessage('');
      
      // Show success message
      toast.success('Your support request has been submitted. We will get back to you shortly.');
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast.error('Failed to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Subject"
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="What can we help you with?"
        required
      />
      <div className="space-y-1">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your issue in detail"
          required
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium">Contact Information</h3>
        <p className="mt-2 text-sm text-gray-600">
          If you need immediate assistance, please call our customer support team at:
        </p>
        <p className="mt-1 text-base font-medium">{COMPANY_PHONE}</p>
        <p className="mt-4 text-sm text-gray-600">
          Business hours: Monday-Friday, 9am-6pm EST
        </p>
      </div>
    </form>
  );
};

export default SupportForm;

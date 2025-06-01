
import React, { useState } from 'react';
import { useAuth } from '../../lib/auth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import { Mail, MessageSquare } from 'lucide-react';

const SupportForm: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const supportEmail = 'info@nationaldebtsrelief.org';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSubmitting(true);

      // Create mailto link with pre-filled information
      const emailBody = `
Subject: ${subject}

Message:
${message}

---
Customer Information:
User ID: ${user.id}
Email: ${user.email}
Name: ${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}
      `;

      const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      // Clear the form
      setSubject('');
      setMessage('');
      
      // Show success message
      toast.success('Your email client has been opened with the support request. Please send the email to complete your request.');
    } catch (error) {
      console.error('Error preparing support request:', error);
      toast.error('Failed to prepare support request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectEmail = () => {
    const mailtoLink = `mailto:${supportEmail}?subject=Customer Support Request`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="space-y-6">
      {/* Primary Contact Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Mail className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-blue-900">Customer Support Email</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200">
            <div>
              <p className="font-medium text-gray-900">{supportEmail}</p>
              <p className="text-sm text-gray-600">Primary support for all customer inquiries</p>
            </div>
            <Button 
              onClick={handleDirectEmail}
              variant="outline"
              className="shrink-0"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
          
          <div className="text-sm text-blue-700 bg-blue-100 rounded-md p-3">
            <p className="font-medium mb-1">Email Response Times:</p>
            <ul className="space-y-1 text-xs">
              <li>• General inquiries: 24-48 hours</li>
              <li>• Account questions: 12-24 hours</li>
              <li>• Urgent matters: Same business day</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support Request Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <MessageSquare className="h-6 w-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Quick Support Request</h3>
        </div>
        
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
              placeholder="Please describe your issue or question in detail"
              required
            />
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Preparing Email...' : 'Open Email Client'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            This will open your default email application with your message pre-filled
          </div>
        </form>
      </div>

      {/* Additional Support Options */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Get Help</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <span className="font-medium">Account Questions:</span> Email us directly at {supportEmail} with your account details
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <span className="font-medium">Document Submission:</span> Reply to any of our previous emails with attachments
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <div>
              <span className="font-medium">Program Updates:</span> Check your dashboard regularly for status changes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportForm;

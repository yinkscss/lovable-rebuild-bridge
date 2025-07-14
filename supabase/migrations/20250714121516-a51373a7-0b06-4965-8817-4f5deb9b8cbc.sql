
-- Add 'cancelled' as a valid status for applications
ALTER TABLE applications 
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'declined', 'cancelled'));

-- Add email_sent flag to track approval email delivery
ALTER TABLE applications 
ADD COLUMN approval_email_sent BOOLEAN DEFAULT FALSE;

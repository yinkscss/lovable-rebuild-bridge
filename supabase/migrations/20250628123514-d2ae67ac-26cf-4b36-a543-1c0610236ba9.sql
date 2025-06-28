
-- Create account_details_forms table for post-completion forms
CREATE TABLE public.account_details_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  original_creditor TEXT NOT NULL,
  account_sold BOOLEAN DEFAULT false,
  current_company TEXT,
  account_type TEXT NOT NULL,
  date_opened DATE,
  open_closed TEXT,
  status TEXT,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  last_payment_date DATE,
  paid_off BOOLEAN DEFAULT false,
  payment_frequency TEXT,
  payment_amount NUMERIC,
  original_balance NUMERIC,
  term TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  filled_by_admin_id UUID,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(application_id)
);

-- Enable RLS on account_details_forms
ALTER TABLE public.account_details_forms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for account_details_forms
CREATE POLICY "Users can view their own account details forms"
  ON public.account_details_forms
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications 
      WHERE applications.id = account_details_forms.application_id 
      AND applications.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all account details forms"
  ON public.account_details_forms
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_account_details_forms_application_id ON public.account_details_forms(application_id);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_account_details_forms_updated_at
  BEFORE UPDATE ON public.account_details_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add completion tracking fields to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Function to calculate application completion percentage
CREATE OR REPLACE FUNCTION public.calculate_application_completion(app_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  completion_score INTEGER := 0;
  total_possible INTEGER := 100;
  app_record RECORD;
BEGIN
  -- Get application record
  SELECT * INTO app_record FROM public.applications WHERE id = app_id;
  
  IF app_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Basic info (30 points)
  IF app_record.first_name IS NOT NULL AND app_record.last_name IS NOT NULL 
     AND app_record.email IS NOT NULL AND app_record.phone IS NOT NULL THEN
    completion_score := completion_score + 30;
  END IF;
  
  -- Financial info (25 points)
  IF app_record.debt_amount IS NOT NULL AND app_record.monthly_income IS NOT NULL 
     AND app_record.employment_status IS NOT NULL THEN
    completion_score := completion_score + 25;
  END IF;
  
  -- Personal details (20 points)
  IF app_record.address IS NOT NULL AND app_record.date_of_birth IS NOT NULL 
     AND app_record.ssn_last_four IS NOT NULL THEN
    completion_score := completion_score + 20;
  END IF;
  
  -- Status progression (25 points)
  IF app_record.status = 'approved' THEN
    completion_score := completion_score + 10;
    IF app_record.enrollment_status = 'approved' THEN
      completion_score := completion_score + 10;
      IF app_record.negotiations_status = 'approved' THEN
        completion_score := completion_score + 5;
      END IF;
    END IF;
  END IF;
  
  RETURN completion_score;
END;
$$;

-- Function to update application completion status
CREATE OR REPLACE FUNCTION public.update_application_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  completion_pct INTEGER;
BEGIN
  -- Calculate completion percentage
  completion_pct := public.calculate_application_completion(NEW.id);
  
  -- Update completion fields
  NEW.completion_percentage := completion_pct;
  NEW.is_complete := (completion_pct >= 100);
  
  -- Set completed_at timestamp if just completed
  IF NEW.is_complete = true AND OLD.is_complete = false THEN
    NEW.completed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update completion status
CREATE TRIGGER update_application_completion_trigger
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_application_completion();

-- Function to trigger account details form creation when application completes
CREATE OR REPLACE FUNCTION public.handle_application_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If application just became complete, create account details form entry
  IF NEW.is_complete = true AND (OLD.is_complete = false OR OLD.is_complete IS NULL) THEN
    -- Create account details form placeholder
    INSERT INTO public.account_details_forms (
      application_id,
      original_creditor,
      account_type,
      current_balance
    ) VALUES (
      NEW.id,
      'Pending Admin Input',
      'Pending Admin Input',
      0
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for account details form creation
CREATE TRIGGER create_account_details_form_trigger
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_completion();

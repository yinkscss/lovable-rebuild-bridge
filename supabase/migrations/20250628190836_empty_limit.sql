/*
  # Fix Application Progress Calculation and Account Details Forms

  1. Changes
    - Fix calculate_application_completion function to properly reach 100%
    - Ensure triggers fire on all relevant status changes
    - Create account details forms table with proper constraints
    - Add admin form management capabilities

  2. Security
    - Enable RLS on account_details_forms
    - Add policies for users and admins
*/

-- Create account_details_forms table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.account_details_forms (
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
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'account_details_forms_application_id_key' 
    AND table_name = 'account_details_forms'
  ) THEN
    ALTER TABLE public.account_details_forms ADD CONSTRAINT account_details_forms_application_id_key UNIQUE (application_id);
  END IF;
END $$;

-- Enable RLS on account_details_forms
ALTER TABLE public.account_details_forms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own account details forms" ON public.account_details_forms;
  DROP POLICY IF EXISTS "Admins can manage all account details forms" ON public.account_details_forms;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- RLS Policies for account_details_forms
CREATE POLICY "Users can view their own account details forms"
  ON public.account_details_forms
  FOR SELECT
  TO public
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
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid()
    )
  );

-- Add indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_account_details_forms_application_id ON public.account_details_forms(application_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_account_details_forms_updated_at'
    AND event_object_table = 'account_details_forms'
  ) THEN
    CREATE TRIGGER update_account_details_forms_updated_at
      BEFORE UPDATE ON public.account_details_forms
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Add completion tracking fields to applications table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'completion_percentage'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN completion_percentage INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'is_complete'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN is_complete BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'enrollment_status'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN enrollment_status TEXT DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'enrollment_approved_at'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN enrollment_approved_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'negotiations_status'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN negotiations_status TEXT DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'negotiations_approved_at'
  ) THEN
    ALTER TABLE public.applications ADD COLUMN negotiations_approved_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add constraints for enrollment and negotiations status if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'applications_enrollment_status_check'
  ) THEN
    ALTER TABLE public.applications 
    ADD CONSTRAINT applications_enrollment_status_check 
    CHECK (enrollment_status IN ('pending', 'approved', 'declined'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'applications_negotiations_status_check'
  ) THEN
    ALTER TABLE public.applications 
    ADD CONSTRAINT applications_negotiations_status_check 
    CHECK (negotiations_status IN ('pending', 'approved', 'declined'));
  END IF;
END $$;

-- FIXED: Function to calculate application completion percentage
CREATE OR REPLACE FUNCTION public.calculate_application_completion(app_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  completion_score INTEGER := 0;
  app_record RECORD;
BEGIN
  -- Get application record
  SELECT * INTO app_record FROM public.applications WHERE id = app_id;
  
  IF app_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Basic info (25 points)
  IF app_record.first_name IS NOT NULL AND app_record.last_name IS NOT NULL 
     AND app_record.email IS NOT NULL AND app_record.phone IS NOT NULL THEN
    completion_score := completion_score + 25;
  END IF;
  
  -- Financial info (25 points)
  IF app_record.debt_amount IS NOT NULL AND app_record.monthly_income IS NOT NULL 
     AND app_record.employment_status IS NOT NULL THEN
    completion_score := completion_score + 25;
  END IF;
  
  -- Personal details (25 points)
  IF app_record.address IS NOT NULL AND app_record.date_of_birth IS NOT NULL 
     AND app_record.ssn_last_four IS NOT NULL THEN
    completion_score := completion_score + 25;
  END IF;
  
  -- Status progression (25 points total)
  IF app_record.status = 'approved' THEN
    completion_score := completion_score + 8;
    IF app_record.enrollment_status = 'approved' THEN
      completion_score := completion_score + 8;
      IF app_record.negotiations_status = 'approved' THEN
        completion_score := completion_score + 9;
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
  IF NEW.is_complete = true AND (OLD.is_complete = false OR OLD.is_complete IS NULL) THEN
    NEW.completed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger and recreate to ensure it works properly
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_application_completion_trigger ON public.applications;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

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
    -- Check if account details form already exists
    IF NOT EXISTS (
      SELECT 1 FROM public.account_details_forms 
      WHERE application_id = NEW.id
    ) THEN
      -- Create account details form placeholder
      INSERT INTO public.account_details_forms (
        application_id,
        original_creditor,
        account_type,
        current_balance
      ) VALUES (
        NEW.id,
        'Pending Admin Input',
        'Credit Card',
        0
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger and recreate
DO $$
BEGIN
  DROP TRIGGER IF EXISTS create_account_details_form_trigger ON public.applications;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create trigger for account details form creation
CREATE TRIGGER create_account_details_form_trigger
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_completion();

-- Update existing applications to recalculate completion percentage
UPDATE public.applications 
SET completion_percentage = public.calculate_application_completion(id),
    is_complete = (public.calculate_application_completion(id) >= 100)
WHERE completion_percentage IS NULL OR completion_percentage = 0;
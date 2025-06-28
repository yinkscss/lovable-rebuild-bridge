/*
  # Fix Application Completion Calculation

  1. Changes
    - Update calculate_application_completion function to properly reach 100%
    - Ensure all existing applications get recalculated with correct percentages
    - Fix the point distribution to sum exactly to 100

  2. Point Distribution (Total: 100)
    - Basic info: 25 points (first_name, last_name, email, phone)
    - Financial info: 25 points (debt_amount, monthly_income, employment_status)
    - Personal details: 25 points (address, date_of_birth, ssn_last_four)
    - Application approved: 8 points
    - Enrollment approved: 8 points  
    - Negotiations approved: 9 points
    Total: 25 + 25 + 25 + 8 + 8 + 9 = 100 points
*/

-- CORRECTED: Function to calculate application completion percentage
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
  
  -- Status progression (25 points total: 8 + 8 + 9 = 25)
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

-- Update all existing applications to recalculate their completion percentage
UPDATE public.applications 
SET 
  completion_percentage = public.calculate_application_completion(id),
  is_complete = (public.calculate_application_completion(id) >= 100),
  updated_at = now()
WHERE id IS NOT NULL;

-- For applications that just reached 100%, set completed_at if not already set
UPDATE public.applications 
SET completed_at = now()
WHERE completion_percentage >= 100 
  AND is_complete = true 
  AND completed_at IS NULL;
/*
  # Fix Admin RLS Policies

  1. Changes
    - Drop and recreate admin RLS policies
    - Ensure admin users have full access to all tables
    - Fix is_admin function

  2. Security
    - Enable RLS on all tables
    - Grant full access to admin users
*/

-- Update the is_admin function to be more reliable
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing admin policies to avoid conflicts
DROP POLICY IF EXISTS "Admins have full access to users" ON users;
DROP POLICY IF EXISTS "Admins have full access to applications" ON applications;
DROP POLICY IF EXISTS "Admins have full access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admins have full access to admin_audit_log" ON admin_audit_log;

-- Create new admin policies with full access
CREATE POLICY "Admins have full access to users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins have full access to applications"
  ON public.applications
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins have full access to admin_users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins have full access to admin_audit_log"
  ON public.admin_audit_log
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
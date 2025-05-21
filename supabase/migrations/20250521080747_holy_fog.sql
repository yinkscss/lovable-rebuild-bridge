/*
  # Fix Applications RLS Policies

  1. Changes
    - Update RLS policies for applications table
    - Add proper insert and select policies for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own applications" ON applications;
DROP POLICY IF EXISTS "Users can insert applications" ON applications;
DROP POLICY IF EXISTS "Admins can read all applications" ON applications;

-- Recreate policies with proper permissions
CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.email LIKE '%@nationaldebtrelief.com'
  ));
/*
  # Add user activity logs

  1. New Tables
    - user_activity_logs
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - event (text)
      - timestamp (timestamptz)
      - details (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for user access
*/

CREATE TABLE user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  details text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity logs"
  ON user_activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all activity logs"
  ON user_activity_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users
    WHERE admin_users.id = auth.uid()
  ));
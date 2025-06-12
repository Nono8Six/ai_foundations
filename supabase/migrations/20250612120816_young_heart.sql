/*
  # Create RGPD request tables

  1. New Tables
    - `rgpd_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `type` (rgpd_request_type)
      - `status` (rgpd_request_status)
      - `details` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `completed_at` (timestamptz)
  2. Security
    - Enable RLS on `rgpd_requests` table
    - Add policies for users to create and view their own requests
    - Add policies for admins to manage all requests
*/

-- Create enum types if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rgpd_request_type') THEN
    CREATE TYPE rgpd_request_type AS ENUM ('access', 'deletion', 'rectification');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rgpd_request_status') THEN
    CREATE TYPE rgpd_request_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
  END IF;
END $$;

-- Create RGPD requests table
CREATE TABLE IF NOT EXISTS rgpd_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type rgpd_request_type NOT NULL,
  status rgpd_request_status NOT NULL DEFAULT 'pending',
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS
ALTER TABLE rgpd_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Check if policy exists before creating it
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'rgpd_requests' AND policyname = 'Users can create their own requests'
  ) THEN
    CREATE POLICY "Users can create their own requests" 
      ON rgpd_requests FOR INSERT 
      TO authenticated 
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'rgpd_requests' AND policyname = 'Users can view their own requests'
  ) THEN
    CREATE POLICY "Users can view their own requests" 
      ON rgpd_requests FOR SELECT 
      TO authenticated 
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'rgpd_requests' AND policyname = 'Admins can manage all requests'
  ) THEN
    CREATE POLICY "Admins can manage all requests" 
      ON rgpd_requests FOR ALL 
      TO authenticated 
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
      );
  END IF;
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'rgpd_requests_updated_at' 
  ) THEN
    CREATE TRIGGER rgpd_requests_updated_at
    BEFORE UPDATE ON rgpd_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_user_id ON rgpd_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_status ON rgpd_requests(status);
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_created_at ON rgpd_requests(created_at);
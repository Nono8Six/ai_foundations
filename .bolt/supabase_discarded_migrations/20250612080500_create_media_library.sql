-- Create media_files table for user uploads
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  filename text NOT NULL,
  original_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL,
  storage_path text NOT NULL UNIQUE,
  metadata jsonb DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_files_user_id_idx ON media_files(user_id);
CREATE INDEX IF NOT EXISTS media_files_created_at_idx ON media_files(created_at);

ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public or owner read" ON media_files
  FOR SELECT USING (is_public OR user_id = auth.uid());

CREATE POLICY "owner insert" ON media_files
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "owner update" ON media_files
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "owner delete" ON media_files
  FOR DELETE USING (user_id = auth.uid());

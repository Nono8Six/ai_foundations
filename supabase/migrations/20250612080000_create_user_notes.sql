-- Create user_notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  content text NOT NULL,
  selected_text text,
  position jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_notes_user_id_idx ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS user_notes_lesson_id_idx ON user_notes(lesson_id);
CREATE INDEX IF NOT EXISTS user_notes_created_at_idx ON user_notes(created_at);

ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow note owner read" ON user_notes
  FOR SELECT USING (user_id = auth.uid() OR is_private = false);

CREATE POLICY "allow note owner insert" ON user_notes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "allow note owner update" ON user_notes
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "allow note owner delete" ON user_notes
  FOR DELETE USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_user_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_notes_updated_at BEFORE UPDATE ON user_notes
FOR EACH ROW EXECUTE FUNCTION public.handle_user_notes_updated_at();

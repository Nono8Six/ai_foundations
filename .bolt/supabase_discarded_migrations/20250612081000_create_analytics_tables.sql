-- Create tables for analytics
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_minutes integer,
  pages_visited text[],
  device_info jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_started_at_idx ON user_sessions(started_at);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session owner manage" ON user_sessions
  FOR SELECT, UPDATE, DELETE USING (user_id = auth.uid());
CREATE POLICY "session owner insert" ON user_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS lesson_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  time_spent_minutes integer,
  completion_percentage integer DEFAULT 0,
  interactions jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS lesson_analytics_lesson_user_idx ON lesson_analytics(lesson_id, user_id);
CREATE INDEX IF NOT EXISTS lesson_analytics_started_at_idx ON lesson_analytics(started_at);

ALTER TABLE lesson_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analytics owner manage" ON lesson_analytics
  FOR SELECT, UPDATE, DELETE USING (user_id = auth.uid());
CREATE POLICY "analytics owner insert" ON lesson_analytics
  FOR INSERT WITH CHECK (user_id = auth.uid());

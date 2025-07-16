-- =============================================
-- Migration: Add Achievement CamelCase View
-- =============================================
-- Date: 2025-07-16
-- Description: Create a view for achievements with camelCase properties

-- Step 1: Create the camelCase view for achievements
CREATE OR REPLACE VIEW achievement_row_camel AS
SELECT 
  id,
  title,
  description,
  icon,
  rarity,
  earned,
  user_id as "userId",
  xp_reward as "xpReward",
  created_at as "createdAt"
FROM achievements;

-- Step 2: Grant necessary permissions
GRANT SELECT ON achievement_row_camel TO authenticated;
GRANT SELECT ON achievement_row_camel TO anon;

-- Step 3: Add comment for documentation
COMMENT ON VIEW achievement_row_camel IS 'CamelCase view of achievements table for frontend compatibility';

-- Step 4: Alternative function for camelCase achievements
CREATE OR REPLACE FUNCTION get_achievements_camel(user_id_param UUID DEFAULT auth.uid())
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  icon TEXT,
  rarity TEXT,
  earned BOOLEAN,
  "userId" UUID,
  "xpReward" INTEGER,
  "createdAt" TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.description,
    a.icon,
    a.rarity,
    a.earned,
    a.user_id,
    a.xp_reward,
    a.created_at
  FROM achievements a
  WHERE a.user_id = user_id_param OR user_id_param IS NULL;
END;
$$;

-- Step 5: Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_achievements_camel TO authenticated;
GRANT EXECUTE ON FUNCTION get_achievements_camel TO anon;
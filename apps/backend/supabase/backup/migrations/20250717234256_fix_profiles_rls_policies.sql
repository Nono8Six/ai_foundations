-- Fix profiles RLS policies to ensure proper authentication
-- This migration resolves 500 errors when accessing profiles table

-- Drop existing duplicate/problematic policies
DROP POLICY IF EXISTS "Les utilisateurs peuvent gérer leur propre profil." ON profiles;
DROP POLICY IF EXISTS "Les admins ont un accès complet aux profils." ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create clean, comprehensive RLS policies
CREATE POLICY "users_can_view_own_profile" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_can_manage_all_profiles" ON profiles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() AND p.is_admin = true
        )
    );

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO anon;
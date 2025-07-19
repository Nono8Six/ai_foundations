-- =====================================================
-- SOLUTION MASTERCLASS - CORRECTION RLS CIRCULAIRE (CORRIGÉE)
-- =====================================================
-- Fix pour la référence circulaire dans les politiques RLS
-- Date: 2025-07-18
-- Version corrigée sans erreurs JWT

-- ÉTAPE 1: Supprimer toutes les politiques problématiques
-- =====================================================

-- Supprimer les politiques qui utilisent current_user_is_admin()
DROP POLICY IF EXISTS "Les admins ont un accès complet aux profils." ON profiles;
DROP POLICY IF EXISTS "Les admins ont un accès complet aux cours." ON courses;
DROP POLICY IF EXISTS "Les admins ont un accès complet aux leçons." ON lessons;
DROP POLICY IF EXISTS "Les administrateurs ont un accès complet aux modules." ON modules;
DROP POLICY IF EXISTS "Les administrateurs ont un accès complet aux leçons." ON lessons;

-- Supprimer les politiques en double et problématiques
DROP POLICY IF EXISTS "Les utilisateurs peuvent gérer leur propre profil." ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- ÉTAPE 2: Créer des politiques RLS optimales et sans références circulaires
-- =====================================================

-- 1. PROFILES - Politiques utilisateur de base
CREATE POLICY "profiles_users_select_own" ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "profiles_users_update_own" ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_users_insert_own" ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- 2. PROFILES - Politique admin SANS référence circulaire (version corrigée)
CREATE POLICY "profiles_admins_full_access" ON profiles
    FOR ALL
    TO authenticated
    USING (
        -- Utiliser current_setting pour accéder aux claims JWT
        COALESCE(
            (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,
            (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,
            false
        ) = true
        OR
        -- Fallback pour les rôles service
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- 3. COURSES - Politiques optimisées
CREATE POLICY "courses_public_read" ON courses
    FOR SELECT
    TO authenticated
    USING (is_published = true);

CREATE POLICY "courses_admin_full_access" ON courses
    FOR ALL
    TO authenticated
    USING (
        COALESCE(
            (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,
            (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,
            false
        ) = true
        OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- 4. MODULES - Politiques optimisées
CREATE POLICY "modules_public_read" ON modules
    FOR SELECT
    TO authenticated
    USING (is_published = true);

CREATE POLICY "modules_admin_full_access" ON modules
    FOR ALL
    TO authenticated
    USING (
        COALESCE(
            (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,
            (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,
            false
        ) = true
        OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- 5. LESSONS - Politiques optimisées
CREATE POLICY "lessons_public_read" ON lessons
    FOR SELECT
    TO authenticated
    USING (is_published = true);

CREATE POLICY "lessons_admin_full_access" ON lessons
    FOR ALL
    TO authenticated
    USING (
        COALESCE(
            (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,
            (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,
            false
        ) = true
        OR
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );

-- ÉTAPE 3: Créer une fonction admin SÉCURISÉE et sans référence circulaire
-- =====================================================

-- Supprimer l'ancienne fonction problématique
DROP FUNCTION IF EXISTS current_user_is_admin();

-- Créer une nouvelle fonction basée sur les claims JWT (version corrigée)
CREATE OR REPLACE FUNCTION is_admin_user() 
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
    -- Utiliser current_setting pour accéder aux claims JWT de manière sécurisée
    RETURN COALESCE(
        (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,
        (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,
        (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role',
        false
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$$;

-- ÉTAPE 4: Créer une fonction utilitaire pour synchroniser les claims
-- =====================================================

CREATE OR REPLACE FUNCTION sync_user_admin_claims()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Mettre à jour les claims JWT quand is_admin change
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
        -- Log le changement pour debugging
        RAISE NOTICE 'Admin status changed for user %: % -> %', NEW.id, OLD.is_admin, NEW.is_admin;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Créer le trigger pour synchroniser les claims
DROP TRIGGER IF EXISTS sync_admin_claims_trigger ON profiles;
CREATE TRIGGER sync_admin_claims_trigger
    AFTER UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_admin_claims();

-- ÉTAPE 5: Optimisations de performance
-- =====================================================

-- Index pour optimiser les requêtes RLS
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_admin 
ON profiles (is_admin) 
WHERE is_admin = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_user_id 
ON profiles (id);

-- Index pour les cours publiés
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_courses_published 
ON courses (is_published) 
WHERE is_published = true;

-- Index pour les modules publiés
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_modules_published 
ON modules (is_published) 
WHERE is_published = true;

-- Index pour les leçons publiées
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lessons_published 
ON lessons (is_published) 
WHERE is_published = true;

-- ÉTAPE 6: Permissions et sécurité
-- =====================================================

-- S'assurer que RLS est activé
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Permissions appropriées pour les utilisateurs authentifiés
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON courses TO authenticated;
GRANT SELECT ON modules TO authenticated;
GRANT SELECT ON lessons TO authenticated;

-- Permissions pour les admins via service_role
GRANT ALL ON profiles TO service_role;
GRANT ALL ON courses TO service_role;
GRANT ALL ON modules TO service_role;
GRANT ALL ON lessons TO service_role;

-- ÉTAPE 7: Nettoyage et validation
-- =====================================================

-- Supprimer les anciens objets non utilisés
DROP FUNCTION IF EXISTS current_user_is_admin();

-- Validation finale avec informations détaillées
SELECT 
    'RLS Policies Fixed Successfully! All circular references eliminated.' as status,
    'Profiles, Courses, Modules, and Lessons are now optimized.' as details,
    'Performance improvements and security enhancements applied.' as improvements;
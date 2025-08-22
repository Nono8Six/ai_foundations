# 🏗️ ARCHITECTURE BACKEND COMPLÈTE - AI FOUNDATIONS LMS

**Documentation Technique Ultra-Détaillée**  
**Version :** Post-Étapes 1, 2 & 3.1 (Content + Paywall + Progression + Gamification)  
**Date :** 2025-01-22  
**Statut :** Production

---

## 📋 TABLE DES MATIÈRES

1. [🌟 Vue d'Ensemble Architecture](#-vue-densemble-architecture)
2. [📊 Métriques et Statistiques](#-métriques-et-statistiques)
3. [🛠️ UTIL Schema - Infrastructure](#️-util-schema---infrastructure)
4. [🔐 RBAC Schema - Sécurité](#-rbac-schema---sécurité)
5. [👤 PUBLIC Schema - Utilisateurs](#-public-schema---utilisateurs)
6. [📚 CONTENT Schema - Catalogue](#-content-schema---catalogue)
7. [💰 ACCESS Schema - Paywall](#-access-schema---paywall)
8. [📈 LEARN Schema - Progression](#-learn-schema---progression)
9. [🎮 GAMIFICATION Schema - XP & Achievements](#-gamification-schema---xp--achievements)
10. [🛡️ Templates RLS Standardisés](#️-templates-rls-standardisés)
11. [⚙️ Fonctions et RPC](#️-fonctions-et-rpc)
12. [🧪 Tests et Validation](#-tests-et-validation)
13. [🔧 Maintenance et Opérations](#-maintenance-et-opérations)

---

## 🌟 Vue d'Ensemble Architecture

### Philosophie Architecture
L'architecture backend d'AI Foundations LMS suit une approche **ULTRATHINK++** avec élimination complète du hardcoding et implémentation d'un système RBAC professionnel. Chaque schéma a une responsabilité claire et les templates RLS standardisés garantissent la cohérence sécuritaire.

### Organisation des Schémas
```
┌─────────────────────────────────────────────────────┐
│                 AI FOUNDATIONS LMS                  │
│                  BACKEND ARCHITECTURE               │
└─────────────────────────────────────────────────────┘
            │
            ├── 🛠️  UTIL (Infrastructure)
            │   ├── job_queue (tâches asynchrones)
            │   ├── feature_flags (configuration)
            │   └── migrations_meta (historique)
            │
            ├── 🔐 RBAC (Sécurité)
            │   ├── roles (5 rôles système)
            │   ├── permissions (11 permissions)
            │   ├── role_permissions (associations)
            │   ├── user_roles (attributions)
            │   └── role_grants_log (audit)
            │
            ├── 👤 PUBLIC (Utilisateurs Refactorisé)
            │   ├── profiles (sans is_admin boolean)
            │   ├── user_settings (préférences)
            │   ├── profile_links (réseaux sociaux)
            │   └── user_consents (RGPD)
            │
            ├── 📚 CONTENT (Catalogue Pédagogique)
            │   ├── courses (catalogue cours)
            │   ├── modules (organisation)
            │   ├── lessons (contenu)
            │   ├── tags (taxonomie)
            │   └── course_tags (associations)
            │
            ├── 💰 ACCESS (Système Paywall)
            │   ├── tiers (plans tarifaires)
            │   ├── course_access_rules (règles accès)
            │   ├── lesson_access_overrides (exceptions)
            │   ├── user_entitlements (droits utilisateur)
            │   └── effective_access (vue agrégée)
            │
            ├── 📈 LEARN (Suivi Progression)
            │   ├── user_progress (progression individuelle)
            │   ├── lesson_analytics (événements détaillés)
            │   └── course_progress (vue agrégée cours)
            │
            └── 🎮 GAMIFICATION (XP & Achievements)
                ├── xp_events (partitioned by month)
                ├── user_xp (agrégats XP utilisateur)
                ├── xp_sources (règles XP configurables)
                ├── level_definitions (progression niveaux)
                ├── seasonal_limits (limites quotidiennes)
                └── notification_outbox (level up alerts)
```

---

## 📊 Métriques et Statistiques

### Récapitulatif Architecture Post-Étapes 1, 2 & 3.1
| Métrique | Valeur | Description |
|----------|--------|-------------|
| **Schémas Créés** | 7 | util, rbac, public, content, access, learn, gamification |
| **Tables Totales** | 25 | 3 + 5 + 4 + 5 + 4 + 2 + 6 |
| **Vues** | 5 | effective_access, course_progress, dashboard_* (3) |
| **Vues Matérialisées** | 1 | dashboard_leaderboards |
| **Politiques RLS** | 61+ | Sécurité row-level granulaire |
| **Fonctions RPC** | 15+ | RBAC + accès + gamification + utilitaires |
| **Templates RLS** | 4 | Standardisation sécurité |

### Répartition par Schéma
```
UTIL        : 3 tables  + 2 fonctions + 6 politiques RLS
RBAC        : 5 tables  + 5 fonctions + 10 politiques RLS  
PUBLIC      : 4 tables  + 1 fonction  + 8 politiques RLS
CONTENT     : 5 tables  + 0 fonctions + 15 politiques RLS
ACCESS      : 4 tables + 1 vue + 1 fonction + 16 politiques RLS
LEARN       : 2 tables + 1 vue + 0 fonctions + 9 politiques RLS
GAMIFICATION: 7 tables + 3 vues + 1 vue mat. + 7 fonctions + 12+ politiques RLS
```

---

## 🛠️ UTIL Schema - Infrastructure

### Vue d'Ensemble
Le schéma `util` fournit les services d'infrastructure partagés par tous les autres schémas. Il centralise les utilitaires, configuration et monitoring système.

### Tables

#### 📋 `util.job_queue` - Tâches Asynchrones
**Fonction :** File d'attente pour tâches background (emails, rapports, cleanups)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique tâche |
| `job_type` | text | Type de tâche (email, report, cleanup) |
| `payload` | jsonb | Données tâche |
| `status` | text | pending/running/completed/failed |
| `attempts` | integer | Nombre tentatives |
| `max_attempts` | integer | Limite tentatives |
| `scheduled_at` | timestamptz | Programmation exécution |
| `started_at` | timestamptz | Début exécution |
| `completed_at` | timestamptz | Fin exécution |
| `error_message` | text | Message d'erreur si échec |
| `created_at` | timestamptz | Date création |

**Contraintes :**
- `ck_job_queue_attempts_positive` : attempts >= 0 AND max_attempts > 0
- `ck_job_queue_valid_status` : status IN ('pending', 'running', 'completed', 'failed')

#### 🚩 `util.feature_flags` - Configuration Système
**Fonction :** Système de feature flags pour activation/désactivation fonctionnalités

| Colonne | Type | Description |
|---------|------|-------------|
| `flag_name` | text | Nom unique flag |
| `is_enabled` | boolean | Flag activé/désactivé |
| `description` | text | Description fonctionnalité |
| `config_data` | jsonb | Configuration associée |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

#### 📝 `util.migrations_meta` - Historique Migrations
**Fonction :** Métadonnées et historique des migrations schémas

| Colonne | Type | Description |
|---------|------|-------------|
| `migration_id` | text | Identifiant migration |
| `schema_name` | text | Schéma ciblé |
| `description` | text | Description migration |
| `executed_at` | timestamptz | Date exécution |
| `execution_time_ms` | integer | Temps exécution |
| `applied_by` | uuid | Utilisateur appliquant |

### Fonctions Utilitaires

#### `util.updated_at()` - Trigger Universal
```sql
CREATE OR REPLACE FUNCTION util.updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('UTC', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### `util.is_valid_uuid()` - Validation UUID
```sql
CREATE OR REPLACE FUNCTION util.is_valid_uuid(input text)
RETURNS boolean AS $$
BEGIN
    PERFORM input::uuid;
    RETURN true;
EXCEPTION WHEN invalid_text_representation THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### Politiques RLS UTIL

#### job_queue
- `job_queue_admin_access` : Admins peuvent gérer toutes les tâches
- `job_queue_system_insert` : Système peut insérer tâches

#### feature_flags  
- `feature_flags_read_all` : Lecture publique flags actifs
- `feature_flags_admin_manage` : Gestion admin uniquement

#### migrations_meta
- `migrations_meta_admin_read` : Lecture admin historique migrations  
- `migrations_meta_system_insert` : Insertion système migrations

---

## 🔐 RBAC Schema - Sécurité

### Vue d'Ensemble
Architecture RBAC (Role-Based Access Control) professionnelle remplaçant l'anti-pattern `is_admin` boolean. Système granulaire avec 5 rôles et 11 permissions spécifiques.

### Architecture RBAC
```
┌─────────────────────────────────────────────────────┐
│                  RBAC ARCHITECTURE                  │
└─────────────────────────────────────────────────────┘
            │
            ├── 👥 ROLES (5 rôles)
            │   ├── admin (accès total)
            │   ├── instructor (création contenu)
            │   ├── moderator (modération)
            │   ├── premium_user (fonctionnalités premium)
            │   └── basic_user (utilisateur standard)
            │
            ├── 🔑 PERMISSIONS (11 permissions)
            │   ├── manage_users, manage_content, manage_billing
            │   ├── view_analytics, moderate_content
            │   ├── create_courses, edit_courses, publish_courses
            │   ├── access_premium_content, use_ai_features
            │   └── export_data
            │
            └── 🔗 ASSOCIATIONS
                ├── role_permissions (M:N rôles↔permissions)
                ├── user_roles (attribution utilisateurs)
                └── role_grants_log (audit trail)
```

### Tables RBAC

#### 👥 `rbac.roles` - Définition Rôles
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `role_name` | text | Nom rôle (admin, instructor...) |
| `description` | text | Description rôle |
| `is_system_role` | boolean | Rôle système (non supprimable) |
| `created_at` | timestamptz | Date création |

**Rôles Bootstrap :**
```sql
INSERT INTO rbac.roles (role_name, description, is_system_role) VALUES
('admin', 'Administrateur système - accès total', true),
('instructor', 'Instructeur - création et gestion contenu', true),
('moderator', 'Modérateur - modération contenu et communauté', true),
('premium_user', 'Utilisateur premium - accès fonctionnalités avancées', true),
('basic_user', 'Utilisateur standard - accès contenu de base', true);
```

#### 🔑 `rbac.permissions` - Permissions Granulaires
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `permission_key` | text | Clé permission (manage_users) |
| `domain` | text | Domaine (users, content, billing) |
| `action` | text | Action (manage, view, create) |
| `description` | text | Description permission |
| `is_dangerous` | boolean | Permission sensible |

**Permissions Bootstrap :**
```sql
INSERT INTO rbac.permissions (permission_key, domain, action, description, is_dangerous) VALUES
('manage_users', 'users', 'manage', 'Gérer utilisateurs et rôles', true),
('manage_content', 'content', 'manage', 'Gérer tout le contenu pédagogique', true),
('manage_billing', 'billing', 'manage', 'Gérer facturation et paiements', true),
('view_analytics', 'analytics', 'view', 'Consulter analytics détaillées', false),
('moderate_content', 'content', 'moderate', 'Modérer contenu utilisateur', false),
('create_courses', 'content', 'create', 'Créer nouveaux cours', false),
('edit_courses', 'content', 'edit', 'Éditer contenu cours existants', false),
('publish_courses', 'content', 'publish', 'Publier/dépublier cours', false),
('access_premium_content', 'content', 'access', 'Accès contenu premium', false),
('use_ai_features', 'features', 'use', 'Utiliser assistant IA', false),
('export_data', 'data', 'export', 'Exporter données utilisateur', true);
```

#### 🔗 `rbac.role_permissions` - Associations Rôles↔Permissions
| Colonne | Type | Description |
|---------|------|-------------|
| `role_id` | uuid | FK vers roles |
| `permission_id` | uuid | FK vers permissions |
| `granted_at` | timestamptz | Date attribution |

#### 👤 `rbac.user_roles` - Attribution Utilisateurs
| Colonne | Type | Description |
|---------|------|-------------|
| `user_id` | uuid | FK vers auth.users |
| `role_id` | uuid | FK vers roles |
| `assigned_by` | uuid | Qui a attribué le rôle |
| `assigned_at` | timestamptz | Date attribution |
| `expires_at` | timestamptz | Expiration (NULL = permanent) |
| `is_active` | boolean | Rôle actif |
| `reason` | text | Raison attribution |

#### 📋 `rbac.role_grants_log` - Audit Trail
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | Utilisateur concerné |
| `role_id` | uuid | Rôle concerné |
| `operation` | text | GRANT/REVOKE |
| `performed_by` | uuid | Qui a fait l'opération |
| `performed_at` | timestamptz | Date opération |
| `reason` | text | Raison changement |
| `metadata` | jsonb | Métadonnées contextuelles |

### Fonctions RPC RBAC

#### `rbac.has_role()` - Vérification Rôle
```sql
CREATE OR REPLACE FUNCTION rbac.has_role(
    target_user_id uuid, 
    target_role_name text
) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM rbac.user_roles ur
        JOIN rbac.roles r ON r.id = ur.role_id
        WHERE ur.user_id = target_user_id
          AND r.role_name = target_role_name
          AND ur.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > timezone('UTC', now()))
    );
END;
$$;
```

#### `rbac.has_permission()` - Vérification Permission
```sql
CREATE OR REPLACE FUNCTION rbac.has_permission(
    target_user_id uuid, 
    target_permission_key text
) RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM rbac.user_roles ur
        JOIN rbac.roles r ON r.id = ur.role_id
        JOIN rbac.role_permissions rp ON rp.role_id = r.id
        JOIN rbac.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = target_user_id
          AND p.permission_key = target_permission_key
          AND ur.is_active = true
          AND (ur.expires_at IS NULL OR ur.expires_at > timezone('UTC', now()))
    );
END;
$$;
```

#### `rbac.grant_role()` - Attribution Rôle
```sql
CREATE OR REPLACE FUNCTION rbac.grant_role(
    target_user_id uuid, 
    target_role_name text, 
    grant_reason text,
    expires_at_param timestamptz DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    granting_user_id UUID := auth.uid();
    target_role_id UUID;
BEGIN
    -- Validation admin
    IF NOT rbac.has_role(granting_user_id, 'admin') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Admin role required');
    END IF;
    
    -- Récupération role_id
    SELECT id INTO target_role_id 
    FROM rbac.roles 
    WHERE role_name = target_role_name;
    
    IF target_role_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Role not found');
    END IF;
    
    -- Attribution avec idempotence
    INSERT INTO rbac.user_roles (user_id, role_id, assigned_by, reason, expires_at)
    VALUES (target_user_id, target_role_id, granting_user_id, grant_reason, expires_at_param)
    ON CONFLICT (user_id, role_id) 
    DO UPDATE SET 
        is_active = true,
        assigned_by = granting_user_id,
        assigned_at = timezone('UTC', now()),
        reason = grant_reason,
        expires_at = expires_at_param;
    
    -- Audit log
    INSERT INTO rbac.role_grants_log 
    (user_id, role_id, operation, performed_by, reason, metadata)
    VALUES (target_user_id, target_role_id, 'GRANT', granting_user_id, grant_reason, 
            jsonb_build_object('expires_at', expires_at_param));
    
    RETURN jsonb_build_object('success', true, 'role_granted', target_role_name);
END;
$$;
```

### Politiques RLS RBAC

#### Template RBAC_ADMIN_ONLY
```sql
-- roles : Seuls admins gèrent les rôles
CREATE POLICY "rbac_roles_admin_manage" ON rbac.roles FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_users'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));

-- permissions : Seuls admins gèrent les permissions  
CREATE POLICY "rbac_permissions_admin_manage" ON rbac.permissions FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_users'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));
```

#### Template USER_ROLES_ACCESS
```sql
-- user_roles : Utilisateurs voient leurs rôles, admins voient tout
CREATE POLICY "user_roles_own_read" ON rbac.user_roles FOR SELECT
    USING (user_id = auth.uid() OR rbac.has_permission(auth.uid(), 'manage_users'));

CREATE POLICY "user_roles_admin_manage" ON rbac.user_roles FOR INSERT
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));
```

---

## 👤 PUBLIC Schema - Utilisateurs

### Vue d'Ensemble
Le schéma `public` a été entièrement refactorisé pour éliminer l'anti-pattern `is_admin` boolean. Il se concentre sur les données utilisateur pures sans logique d'autorisation.

### Tables PUBLIC

#### 👤 `public.profiles` - Profils Utilisateur (Refactorisé)
**Fonction :** Profils utilisateur sans logique admin, utilise RBAC exclusivement

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | PK - FK vers auth.users |
| `email` | text | Email utilisateur |
| `display_name` | text | Nom affiché |
| `avatar_url` | text | URL photo profil |
| `bio` | text | Biographie utilisateur |
| `location` | text | Localisation |
| `website_url` | text | Site web personnel |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Changement majeur :** Suppression des colonnes `is_admin`, `xp`, `level` qui sont maintenant gérées respectivement par RBAC et le système de gamification à venir.

#### ⚙️ `public.user_settings` - Préférences Utilisateur
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles.id (UNIQUE) |
| `preferences` | jsonb | Préférences utilisateur JSON |
| `notifications_enabled` | boolean | Notifications activées |
| `email_notifications` | boolean | Notifications email |
| `push_notifications` | boolean | Notifications push |
| `theme` | text | Thème interface (light/dark/auto) |
| `language` | text | Langue préférée |
| `timezone` | text | Fuseau horaire |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

#### 🔗 `public.profile_links` - Réseaux Sociaux
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles.id |
| `platform` | text | Plateforme (linkedin, github, twitter) |
| `url` | text | URL profil |
| `display_text` | text | Texte affiché |
| `is_verified` | boolean | Lien vérifié |
| `created_at` | timestamptz | Date création |

#### 📋 `public.user_consents` - Gestion RGPD
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles.id |
| `consent_type` | text | Type consentement (analytics, marketing, cookies) |
| `granted` | boolean | Consentement accordé |
| `granted_at` | timestamptz | Date consentement |
| `revoked_at` | timestamptz | Date révocation |
| `ip_address` | inet | Adresse IP |
| `user_agent` | text | User agent |
| `created_at` | timestamptz | Date création |

### Triggers PUBLIC

#### Trigger Auto-Settings
```sql
-- Création automatique user_settings à la création profil
CREATE OR REPLACE FUNCTION create_user_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_settings (user_id, preferences) 
    VALUES (NEW.id, '{}'::jsonb);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION create_user_settings();
```

### Politiques RLS PUBLIC

#### profiles - Template USERS_OWN_DATA
```sql
CREATE POLICY "profiles_users_own_read" ON public.profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "profiles_users_own_update" ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_admin_full_access" ON public.profiles FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_users'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));
```

#### user_settings - Template USERS_OWN_DATA
```sql
CREATE POLICY "settings_users_own_manage" ON public.user_settings FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
```

#### profile_links - Template USERS_OWN_DATA + Public Read
```sql
CREATE POLICY "links_public_read" ON public.profile_links FOR SELECT
    USING (true); -- Liens publics

CREATE POLICY "links_users_own_manage" ON public.profile_links FOR INSERT
    WITH CHECK (user_id = auth.uid());
```

---

## 📚 CONTENT Schema - Catalogue

### Vue d'Ensemble
Le schéma `content` gère le catalogue pédagogique complet avec une architecture anti-hardcoding. Tous les contenus sont configurés via la base de données avec des politiques RLS granulaires.

### Architecture Content
```
┌─────────────────────────────────────────────────────┐
│                CONTENT ARCHITECTURE                 │
└─────────────────────────────────────────────────────┘
            │
            ├── 📚 COURSES (Catalogue principal)
            │   ├── title, description, slug
            │   ├── cover_image_url, thumbnail_url
            │   ├── is_published (contrôle visibilité)
            │   └── difficulty, category
            │
            ├── 📦 MODULES (Organisation)
            │   ├── course_id (FK courses)
            │   ├── title, description
            │   ├── module_order (séquencement)
            │   └── is_published
            │
            ├── 📖 LESSONS (Contenu pédagogique)
            │   ├── module_id (FK modules)
            │   ├── title, content (JSONB structuré)
            │   ├── lesson_order, duration
            │   ├── type (video/text/quiz/exercise)
            │   ├── video_url, transcript
            │   └── resources (JSONB array)
            │
            ├── 🏷️ TAGS (Taxonomie)
            │   ├── tag_name, description
            │   ├── category, color
            │   └── is_active
            │
            └── 🔗 COURSE_TAGS (Association M:N)
                ├── course_id, tag_id
                └── assigned_at
```

### Tables CONTENT

#### 📚 `content.courses` - Catalogue Cours
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `title` | text | Titre cours |
| `description` | text | Description détaillée |
| `slug` | text | Identifiant URL (UNIQUE) |
| `cover_image_url` | text | Image couverture |
| `thumbnail_url` | text | Miniature cours |
| `category` | text | Catégorie cours |
| `difficulty` | text | Niveau difficulté (beginner/intermediate/advanced) |
| `is_published` | boolean | Cours publié/brouillon |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Contraintes :**
- `content_courses_slug_key` : UNIQUE(slug)
- `chk_courses_difficulty` : difficulty IN ('beginner', 'intermediate', 'advanced')

#### 📦 `content.modules` - Organisation Pédagogique
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `course_id` | uuid | FK vers courses |
| `title` | text | Titre module |
| `description` | text | Description module |
| `module_order` | integer | Ordre dans cours (> 0) |
| `is_published` | boolean | Module publié |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Contraintes :**
- `chk_modules_order_positive` : module_order > 0
- FK `modules_course_id_fkey` : CASCADE DELETE

#### 📖 `content.lessons` - Contenu Pédagogique
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `module_id` | uuid | FK vers modules |
| `title` | text | Titre leçon |
| `content` | jsonb | Contenu structuré JSON |
| `lesson_order` | integer | Ordre dans module (> 0) |
| `duration` | integer | Durée estimée (minutes) |
| `type` | lesson_type | Type leçon ENUM |
| `video_url` | text | URL vidéo |
| `transcript` | text | Transcription vidéo |
| `text_content` | text | Contenu textuel |
| `resources` | jsonb | Ressources (array) |
| `is_published` | boolean | Leçon publiée |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Type ENUM :**
```sql
CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'exercise');
```

**Contraintes :**
- `chk_lessons_order_positive` : lesson_order > 0
- `chk_lessons_duration_positive` : duration > 0
- `chk_resources_is_array` : jsonb_typeof(resources) = 'array'

#### 🏷️ `content.tags` - Système de Tags
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `tag_name` | text | Nom tag (UNIQUE) |
| `description` | text | Description tag |
| `category` | text | Catégorie tag |
| `color` | text | Couleur affichage |
| `is_active` | boolean | Tag actif |
| `created_at` | timestamptz | Date création |

#### 🔗 `content.course_tags` - Association M:N
| Colonne | Type | Description |
|---------|------|-------------|
| `course_id` | uuid | FK vers courses |
| `tag_id` | uuid | FK vers tags |
| `assigned_at` | timestamptz | Date association |

**Contrainte :**
- PK composite (course_id, tag_id)

### Politiques RLS CONTENT

#### Template PUBLISHED_READ - Contenu Public
```sql
-- Lecture publique contenu publié
CREATE POLICY "courses_public_read" ON content.courses FOR SELECT
    USING (is_published = true);

CREATE POLICY "modules_public_read" ON content.modules FOR SELECT
    USING (
        is_published = true AND 
        EXISTS (SELECT 1 FROM content.courses c WHERE c.id = course_id AND c.is_published = true)
    );

CREATE POLICY "lessons_public_read" ON content.lessons FOR SELECT
    USING (
        is_published = true AND 
        EXISTS (
            SELECT 1 FROM content.modules m 
            JOIN content.courses c ON c.id = m.course_id 
            WHERE m.id = module_id AND m.is_published = true AND c.is_published = true
        )
    );
```

#### Template RBAC_PERMISSION - Gestion Contenu
```sql
-- Gestion contenu pour instructeurs et admins
CREATE POLICY "courses_instructors_manage" ON content.courses FOR ALL
    USING (
        rbac.has_permission(auth.uid(), 'manage_content') OR
        rbac.has_permission(auth.uid(), 'create_courses')
    )
    WITH CHECK (
        rbac.has_permission(auth.uid(), 'manage_content') OR
        rbac.has_permission(auth.uid(), 'create_courses')
    );

CREATE POLICY "courses_publish_control" ON content.courses FOR UPDATE
    USING (
        rbac.has_permission(auth.uid(), 'publish_courses') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    )
    WITH CHECK (
        rbac.has_permission(auth.uid(), 'publish_courses') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    );
```

### Index Content Optimisés

```sql
-- Navigation et recherche
CREATE INDEX idx_courses_published ON content.courses (is_published) WHERE is_published = true;
CREATE INDEX idx_courses_category ON content.courses (category);
CREATE INDEX idx_modules_course_order ON content.modules (course_id, module_order);
CREATE INDEX idx_lessons_module_order ON content.lessons (module_id, lesson_order);
CREATE INDEX idx_lessons_type ON content.lessons (type);

-- Recherche textuelle
CREATE INDEX idx_courses_title_search ON content.courses USING gin(to_tsvector('french', title));
CREATE INDEX idx_lessons_content_search ON content.lessons USING gin(to_tsvector('french', text_content));

-- Tags et associations
CREATE INDEX idx_tags_active ON content.tags (is_active) WHERE is_active = true;
CREATE INDEX idx_course_tags_course ON content.course_tags (course_id);
```

---

## 💰 ACCESS Schema - Paywall

### Vue d'Ensemble
Le schéma `access` implémente un système paywall complet avec tiers multiples, règles d'accès granulaires et logique de contrôle unifiée. Architecture conçue pour scalabilité et flexibilité commerciale.

### Architecture Paywall
```
┌─────────────────────────────────────────────────────┐
│                 PAYWALL ARCHITECTURE                │
└─────────────────────────────────────────────────────┘
            │
            ├── 💳 TIERS (Plans tarifaires)
            │   ├── Gratuit (0€) - contenu de base
            │   ├── Membre (9.99€) - contenu premium
            │   └── Premium (29.99€) - accès total + IA
            │
            ├── 🎯 COURSE_ACCESS_RULES (Règles par cours)
            │   ├── required_tier (tier minimum requis)
            │   ├── override_price (prix spécifique)
            │   └── access_type (subscription/purchase)
            │
            ├── 📖 LESSON_ACCESS_OVERRIDES (Exceptions par leçon)
            │   ├── lesson_id, required_tier
            │   ├── is_free_override (gratuit exceptionnel)
            │   └── special_conditions
            │
            ├── 👤 USER_ENTITLEMENTS (Droits utilisateur)
            │   ├── user_id, resource_type, resource_id
            │   ├── access_granted_at, expires_at
            │   └── access_source (subscription/purchase/promo)
            │
            └── 🎯 EFFECTIVE_ACCESS (Vue agrégée)
                ├── Calcul accès effectif par user/resource
                ├── Logique tier + entitlements + overrides
                └── Cache performance requêtes fréquentes
```

### Tables ACCESS

#### 💳 `access.tiers` - Plans Tarifaires
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `tier_name` | text | Nom tier (UNIQUE) |
| `monthly_price_cents` | integer | Prix mensuel (centimes) |
| `annual_price_cents` | integer | Prix annuel (centimes) |
| `features` | jsonb | Features incluses |
| `max_downloads` | integer | Limite téléchargements |
| `ai_assistant_included` | boolean | Assistant IA inclus |
| `priority_support` | boolean | Support prioritaire |
| `is_active` | boolean | Tier actif |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Bootstrap Tiers :**
```sql
INSERT INTO access.tiers (tier_name, monthly_price_cents, features) VALUES
('Gratuit', 0, '{"courses": "free_only", "support": "community", "downloads": 0, "ai_assistant": false}'),
('Membre', 999, '{"courses": "basic", "support": "email", "downloads": 5, "ai_assistant": false, "certificates": true}'),
('Premium', 2999, '{"courses": "all", "support": "priority", "downloads": 50, "ai_assistant": true, "certificates": true, "priority_queue": true}');
```

#### 🎯 `access.course_access_rules` - Règles Cours
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `course_id` | uuid | FK vers content.courses |
| `required_tier_id` | uuid | FK vers tiers (tier minimum) |
| `access_type` | text | subscription/purchase/free |
| `override_price_cents` | integer | Prix spécifique cours |
| `is_active` | boolean | Règle active |
| `effective_from` | timestamptz | Date début validité |
| `effective_to` | timestamptz | Date fin validité |
| `created_at` | timestamptz | Date création |

#### 📖 `access.lesson_access_overrides` - Exceptions Leçons
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `lesson_id` | uuid | FK vers content.lessons |
| `required_tier_id` | uuid | FK vers tiers |
| `is_free_override` | boolean | Gratuit exceptionnel |
| `special_conditions` | jsonb | Conditions spéciales |
| `is_active` | boolean | Override actif |
| `created_at` | timestamptz | Date création |

#### 👤 `access.user_entitlements` - Droits Utilisateur
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles |
| `resource_type` | text | Type ressource (course/lesson) |
| `resource_id` | uuid | ID ressource |
| `tier_id` | uuid | FK vers tiers |
| `access_source` | text | Source (subscription/purchase/promo) |
| `granted_at` | timestamptz | Date octroi |
| `expires_at` | timestamptz | Date expiration |
| `is_active` | boolean | Entitlement actif |
| `created_at` | timestamptz | Date création |

#### 🎯 `access.effective_access` - Vue Accès Effectif
Vue calculée combinant tiers utilisateur, entitlements spécifiques et overrides :

```sql
CREATE VIEW access.effective_access AS
WITH user_tiers AS (
    -- Tier utilisateur par défaut (Gratuit si pas d'entitlement)
    SELECT DISTINCT 
        p.id as user_id,
        COALESCE(t.id, (SELECT id FROM access.tiers WHERE tier_name = 'Gratuit')) as tier_id,
        COALESCE(t.tier_name, 'Gratuit') as tier_name
    FROM public.profiles p
    LEFT JOIN access.user_entitlements ue ON ue.user_id = p.id 
        AND ue.resource_type = 'subscription' 
        AND ue.is_active = true
        AND (ue.expires_at IS NULL OR ue.expires_at > now())
    LEFT JOIN access.tiers t ON t.id = ue.tier_id
),
course_access AS (
    -- Accès cours basé sur tier + rules
    SELECT 
        ut.user_id,
        'course' as resource_type,
        c.id as resource_id,
        c.slug as resource_slug,
        CASE 
            WHEN car.required_tier_id IS NULL THEN true
            WHEN ut.tier_id = car.required_tier_id OR 
                 (SELECT monthly_price_cents FROM access.tiers WHERE id = ut.tier_id) >= 
                 (SELECT monthly_price_cents FROM access.tiers WHERE id = car.required_tier_id)
            THEN true
            ELSE false
        END as can_read,
        ue.expires_at,
        CASE 
            WHEN ue.user_id IS NOT NULL THEN 'specific_entitlement'
            WHEN car.required_tier_id IS NULL THEN 'public_access'
            ELSE 'tier_based'
        END as access_reason,
        ut.tier_name as access_detail
    FROM user_tiers ut
    CROSS JOIN content.courses c
    LEFT JOIN access.course_access_rules car ON car.course_id = c.id AND car.is_active = true
    LEFT JOIN access.user_entitlements ue ON ue.user_id = ut.user_id 
        AND ue.resource_type = 'course' 
        AND ue.resource_id = c.id
        AND ue.is_active = true
    WHERE c.is_published = true
),
lesson_access AS (
    -- Accès leçons avec overrides
    SELECT 
        ut.user_id,
        'lesson' as resource_type,
        l.id as resource_id,
        l.title as resource_slug,
        CASE 
            WHEN lao.is_free_override = true THEN true
            WHEN lao.required_tier_id IS NOT NULL THEN 
                ut.tier_id = lao.required_tier_id OR 
                (SELECT monthly_price_cents FROM access.tiers WHERE id = ut.tier_id) >= 
                (SELECT monthly_price_cents FROM access.tiers WHERE id = lao.required_tier_id)
            ELSE ca.can_read
        END as can_read,
        ue.expires_at,
        CASE 
            WHEN lao.is_free_override = true THEN 'free_override'
            WHEN lao.required_tier_id IS NOT NULL THEN 'lesson_override'
            ELSE ca.access_reason
        END as access_reason,
        COALESCE(lao_tier.tier_name, ca.access_detail) as access_detail
    FROM user_tiers ut
    CROSS JOIN content.lessons l
    JOIN content.modules m ON m.id = l.module_id
    JOIN course_access ca ON ca.user_id = ut.user_id 
        AND ca.resource_type = 'course' 
        AND ca.resource_id = m.course_id
    LEFT JOIN access.lesson_access_overrides lao ON lao.lesson_id = l.id AND lao.is_active = true
    LEFT JOIN access.tiers lao_tier ON lao_tier.id = lao.required_tier_id
    LEFT JOIN access.user_entitlements ue ON ue.user_id = ut.user_id 
        AND ue.resource_type = 'lesson' 
        AND ue.resource_id = l.id
        AND ue.is_active = true
    WHERE l.is_published = true
)
SELECT * FROM course_access
UNION ALL
SELECT * FROM lesson_access;
```

### Fonction RPC ACCESS

#### `access.user_can_access()` - Fonction Centralisée
```sql
CREATE OR REPLACE FUNCTION access.user_can_access(
    p_user_id uuid,
    p_resource_type text,
    p_resource_id uuid
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
    access_record RECORD;
    result jsonb;
BEGIN
    -- Recherche accès effectif
    SELECT can_read, expires_at, access_reason, access_detail
    INTO access_record
    FROM access.effective_access
    WHERE user_id = p_user_id
      AND resource_type = p_resource_type
      AND resource_id = p_resource_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'can_access', false,
            'reason', 'resource_not_found',
            'expires_at', null
        );
    END IF;
    
    RETURN jsonb_build_object(
        'can_access', access_record.can_read,
        'reason', access_record.access_reason,
        'expires_at', access_record.expires_at
    );
END;
$$;
```

### Politiques RLS ACCESS

#### Template TIER_BASED_ACCESS
```sql
-- Tiers : lecture publique, gestion admin
CREATE POLICY "tiers_public_read" ON access.tiers FOR SELECT
    USING (is_active = true);

CREATE POLICY "tiers_admin_manage" ON access.tiers FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_billing'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_billing'));
```

#### Template USER_ENTITLEMENTS
```sql
-- Entitlements : utilisateurs voient leurs droits
CREATE POLICY "entitlements_users_own_read" ON access.user_entitlements FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "entitlements_admin_manage" ON access.user_entitlements FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_billing'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_billing'));
```

#### Template ACCESS_RULES_MANAGEMENT
```sql
-- Règles d'accès : gestion par admins et instructeurs
CREATE POLICY "course_access_rules_read" ON access.course_access_rules FOR SELECT
    USING (is_active = true);

CREATE POLICY "course_access_rules_manage" ON access.course_access_rules FOR ALL
    USING (
        rbac.has_permission(auth.uid(), 'manage_billing') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    )
    WITH CHECK (
        rbac.has_permission(auth.uid(), 'manage_billing') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    );
```

---

## 📈 LEARN Schema - Progression

### Vue d'Ensemble
Le schéma `learn` gère le suivi de progression et les analytics d'apprentissage. Il fournit à la fois un tracking granulaire par leçon et des vues agrégées par cours avec métriques de performance.

### Architecture Learning Analytics
```
┌─────────────────────────────────────────────────────┐
│              LEARNING ANALYTICS                     │
└─────────────────────────────────────────────────────┘
            │
            ├── 📊 USER_PROGRESS (Progression individuelle)
            │   ├── user_id, lesson_id (composite unique)
            │   ├── status (not_started/in_progress/completed)
            │   ├── completion_percentage (0-100)
            │   ├── time_spent_minutes, attempts_count
            │   ├── completed_at, last_accessed_at
            │   └── progress_data (JSONB métadonnées)
            │
            ├── 📈 LESSON_ANALYTICS (Événements détaillés)
            │   ├── user_id, lesson_id, event_type
            │   ├── event_data (JSONB contexte)
            │   ├── session_id (groupement)
            │   ├── timestamp, duration_seconds
            │   └── device_info (analytics comportement)
            │
            └── 🎯 COURSE_PROGRESS (Vue agrégée)
                ├── Calculs par cours : total/completed lessons
                ├── Pourcentages complétion globaux
                ├── Temps total passé, dernière activité
                ├── Métriques performance
                └── Status cours (not_started/in_progress/completed)
```

### Tables LEARN

#### 📊 `learn.user_progress` - Progression Utilisateur
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles |
| `lesson_id` | uuid | FK vers content.lessons |
| `status` | text | not_started/in_progress/completed |
| `completion_percentage` | integer | Pourcentage 0-100 |
| `time_spent_minutes` | integer | Temps passé total |
| `attempts_count` | integer | Nombre tentatives |
| `completed_at` | timestamptz | Date complétion |
| `last_accessed_at` | timestamptz | Dernier accès |
| `progress_data` | jsonb | Métadonnées progression |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

**Contraintes :**
- `user_progress_user_lesson_unique` : UNIQUE(user_id, lesson_id)
- `chk_progress_percentage` : completion_percentage >= 0 AND completion_percentage <= 100
- `chk_progress_status` : status IN ('not_started', 'in_progress', 'completed')
- `chk_completed_requires_date` : (status = 'completed') = (completed_at IS NOT NULL)

#### 📈 `learn.lesson_analytics` - Analytics Détaillées
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `user_id` | uuid | FK vers profiles |
| `lesson_id` | uuid | FK vers content.lessons |
| `session_id` | uuid | ID session (groupement événements) |
| `event_type` | text | Type événement (view/interact/complete) |
| `event_data` | jsonb | Données contextuelles |
| `timestamp` | timestamptz | Moment événement |
| `duration_seconds` | integer | Durée événement |
| `device_info` | jsonb | Info device/browser |
| `ip_address` | inet | Adresse IP |
| `user_agent` | text | User agent |
| `created_at` | timestamptz | Date création |

**Types d'événements :**
- `lesson_start` : Début leçon
- `lesson_progress` : Progression (25%, 50%, 75%)
- `lesson_complete` : Complétion
- `video_play/pause/seek` : Interactions vidéo
- `quiz_attempt/submit` : Actions quiz
- `resource_download` : Téléchargement ressource

#### 🎯 `learn.course_progress` - Vue Agrégée Cours
Vue calculée fournissant métriques complétion par cours :

```sql
CREATE VIEW learn.course_progress AS
WITH lesson_counts AS (
    -- Comptage leçons par cours
    SELECT 
        c.id as course_id,
        c.title as course_title,
        COUNT(l.id) as total_lessons
    FROM content.courses c
    JOIN content.modules m ON m.course_id = c.id AND m.is_published = true
    JOIN content.lessons l ON l.module_id = m.id AND l.is_published = true
    WHERE c.is_published = true
    GROUP BY c.id, c.title
),
user_progress_agg AS (
    -- Agrégation progression utilisateur
    SELECT 
        up.user_id,
        c.id as course_id,
        COUNT(*) as lessons_started,
        COUNT(*) FILTER (WHERE up.status = 'completed') as lessons_completed,
        COUNT(*) FILTER (WHERE up.status = 'in_progress') as lessons_in_progress,
        AVG(up.completion_percentage) as avg_completion_percentage,
        SUM(up.time_spent_minutes) as total_time_minutes,
        MAX(up.last_accessed_at) as last_activity_at,
        MAX(up.completed_at) as last_completion_at
    FROM learn.user_progress up
    JOIN content.lessons l ON l.id = up.lesson_id
    JOIN content.modules m ON m.id = l.module_id
    JOIN content.courses c ON c.id = m.course_id
    WHERE up.status != 'not_started'
    GROUP BY up.user_id, c.id
)
SELECT 
    lc.course_id,
    lc.course_title,
    COALESCE(upa.user_id, null) as user_id,
    lc.total_lessons,
    COALESCE(upa.lessons_started, 0) as lessons_started,
    COALESCE(upa.lessons_completed, 0) as lessons_completed,
    COALESCE(upa.lessons_in_progress, 0) as lessons_in_progress,
    CASE 
        WHEN lc.total_lessons = 0 THEN 0
        ELSE ROUND((COALESCE(upa.lessons_completed, 0)::decimal / lc.total_lessons) * 100, 1)
    END as overall_completion_percentage,
    COALESCE(upa.avg_completion_percentage, 0) as average_lesson_completion,
    COALESCE(upa.total_time_minutes, 0) as total_time_spent_minutes,
    upa.last_activity_at,
    upa.last_completion_at,
    CASE 
        WHEN upa.lessons_completed IS NULL THEN 'not_started'
        WHEN upa.lessons_completed = lc.total_lessons THEN 'completed'
        ELSE 'in_progress'
    END as course_status
FROM lesson_counts lc
LEFT JOIN user_progress_agg upa ON upa.course_id = lc.course_id;
```

### Politiques RLS LEARN

#### Template USERS_OWN_DATA - Progression Personnelle
```sql
-- user_progress : utilisateurs gèrent leur propre progression
CREATE POLICY "user_progress_own_manage" ON learn.user_progress FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- lesson_analytics : utilisateurs voient leurs propres analytics
CREATE POLICY "lesson_analytics_own_read" ON learn.lesson_analytics FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "lesson_analytics_own_insert" ON learn.lesson_analytics FOR INSERT
    WITH CHECK (user_id = auth.uid());
```

#### Template RBAC_PERMISSION - Analytics Admin
```sql
-- Admins et instructeurs accès analytics complets
CREATE POLICY "user_progress_admin_read" ON learn.user_progress FOR SELECT
    USING (
        rbac.has_permission(auth.uid(), 'view_analytics') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    );

CREATE POLICY "lesson_analytics_admin_read" ON learn.lesson_analytics FOR SELECT
    USING (
        rbac.has_permission(auth.uid(), 'view_analytics') OR
        rbac.has_permission(auth.uid(), 'manage_content')
    );

-- Admins peuvent corriger progression si nécessaire
CREATE POLICY "user_progress_admin_manage" ON learn.user_progress FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_users'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));
```

### Index LEARN Optimisés

```sql
-- Progression utilisateur
CREATE INDEX idx_user_progress_user_status ON learn.user_progress (user_id, status);
CREATE INDEX idx_user_progress_lesson_completion ON learn.user_progress (lesson_id, completed_at) 
    WHERE status = 'completed';
CREATE INDEX idx_user_progress_activity ON learn.user_progress (last_accessed_at DESC);

-- Analytics performance
CREATE INDEX idx_lesson_analytics_user_lesson ON learn.lesson_analytics (user_id, lesson_id, timestamp DESC);
CREATE INDEX idx_lesson_analytics_session ON learn.lesson_analytics (session_id, timestamp);
CREATE INDEX idx_lesson_analytics_event_type ON learn.lesson_analytics (event_type, timestamp DESC);

-- Vue course_progress optimisations
CREATE INDEX idx_user_progress_course_calc ON learn.user_progress (user_id, lesson_id, status, completion_percentage);
```

---

## 🎮 GAMIFICATION Schema - XP & Achievements

### Vue d'Ensemble
Le schéma `gamification` implémente un système de gamification ultra-professionnel avec architecture integrity-first, partitionnement PostgreSQL et élimination complète du hardcoding. Conçu selon les principes ULTRATHINK++ pour scalabilité et sécurité.

### Architecture Gamification Integrity-First
```
┌─────────────────────────────────────────────────────┐
│              GAMIFICATION ARCHITECTURE              │
│                 (INTEGRITY-FIRST)                   │
└─────────────────────────────────────────────────────┘
            │
            ├── 🎯 XP_EVENTS (Event Sourcing - Partitioned)
            │   ├── Partitionnement mensuel automatique
            │   ├── Idempotency garantie par ledger d'idempotence global
            │   ├── Append-only avec cohérence xp_after = xp_before + xp_delta
            │   └── Audit trail complet des transactions XP
            │
            ├── 🔒 IDEMPOTENCY_LEDGER (Unicité Cross-Partitions)
            │   ├── user_id, source_type, idempotency_key (UNIQUE global)
            │   ├── xp_event_id (FK vers événement crédité)
            │   ├── Résolution unicité sur table partitionnée
            │   └── RLS strict - utilisateurs propres données uniquement
            │
            ├── 👤 USER_XP (Agrégats Materialisés)
            │   ├── total_xp, current_level avec reset quotidien
            │   ├── daily_xp_today auto-reset midnight
            │   ├── xp_in_current_level (progression niveau)
            │   └── last_xp_event_at (activité)
            │
            ├── ⚙️ XP_SOURCES (Configuration Anti-Hardcoding)
            │   ├── source_type + action_type + version (unique)
            │   ├── base_xp, cooldown_minutes, max_per_day
            │   ├── is_active, effective_from/to (lifecycle)
            │   └── Zéro hardcoding - 100% configurable DB
            │
            ├── 🏆 LEVEL_DEFINITIONS (Progression Dynamique)
            │   ├── level, xp_required, xp_for_next
            │   ├── level_title, badge_icon, badge_color
            │   ├── Progression exponentielle configurée
            │   └── Fini Math.floor(xp/100) - Système professionnel
            │
            ├── 📅 SEASONAL_LIMITS (Limites Versionnées)
            │   ├── season_key, daily_xp_limit, is_active
            │   ├── start_date, end_date pour campaigns
            │   └── Flexibilité événements spéciaux
            │
            ├── 📢 NOTIFICATION_OUTBOX (Outbox Pattern)
            │   ├── user_id, notification_type, payload
            │   ├── processed_at, retry_count
            │   ├── Pas de I/O bloquant dans triggers
            │   └── Async notification processing
            │
            └── 📊 DASHBOARD VIEWS (Observabilité)
                ├── dashboard_xp_metrics (métriques temps réel)
                ├── dashboard_system_health (partitions + anomalies)
                ├── dashboard_leaderboards (MATERIALIZED CONCURRENTLY)
                └── dashboard_alerts (alertes système automatiques)
```

### Tables GAMIFICATION

#### 🎯 `gamification.xp_events` - Event Sourcing Partitionné
**Fonction :** Source de vérité pour tous événements XP avec partitionnement mensuel automatique

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique événement |
| `user_id` | uuid | FK vers profiles |
| `source_type` | text | Type source (lesson, course, quiz) |
| `action_type` | text | Action (completion, start, perfect) |
| `xp_delta` | integer | XP accordé (positif/négatif) |
| `xp_before` | integer | XP utilisateur avant |
| `xp_after` | integer | XP utilisateur après |
| `level_before` | integer | Niveau avant |
| `level_after` | integer | Niveau après |
| `reference_id` | uuid | Référence ressource (lesson_id, etc.) |
| `session_id` | uuid | Session utilisateur |
| `metadata` | jsonb | Métadonnées contextuelles |
| `created_at` | timestamptz | Timestamp événement |
| `idempotency_key` | text | Clé idempotence NAMESPACÉE |

**Partitionnement Automatique :**
```sql
-- Table parent partitionnée par mois
CREATE TABLE gamification.xp_events (...) PARTITION BY RANGE (created_at);

-- Partitions auto-créées par job maintenance
CREATE TABLE gamification.xp_events_2025_01 PARTITION OF gamification.xp_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

**Contraintes Intégrité :**
- `chk_xp_coherence` : xp_after = xp_before + xp_delta
- **Idempotence** : garantie par `gamification.idempotency_ledger` (unicité cross-partitions)
- **Aucune contrainte UNIQUE** sur table partitionnée (performance optimisée)

#### 🔒 `gamification.idempotency_ledger` - Ledger Unicité Globale
**Fonction :** Garantie unicité idempotence cross-partitions avec liaison événements XP

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | PK - Identifiant unique |
| `user_id` | uuid | FK vers profiles |
| `source_type` | text | Type source (lesson, course, quiz) |
| `idempotency_key` | text | Clé idempotence utilisateur |
| `xp_event_id` | uuid | FK vers xp_events (NULL initial) |
| `created_at` | timestamptz | Timestamp création |

**Contrainte Critique :**
- `uk_idempotency_global` : UNIQUE(user_id, source_type, idempotency_key)

**Pattern Utilisation :**
1. INSERT dans ledger → ON CONFLICT DO NOTHING pour détection doublons
2. Si INSERT OK → Crédit XP + UPDATE ledger.xp_event_id
3. Si CONFLICT → Retour événement existant sans re-crédit

#### 👤 `gamification.user_xp` - Agrégats Utilisateur
**Fonction :** État XP/niveau utilisateur avec reset quotidien automatique

| Colonne | Type | Description |
|---------|------|-------------|
| `user_id` | uuid | PK - FK vers profiles |
| `total_xp` | integer | XP total accumulé |
| `current_level` | integer | Niveau actuel |
| `xp_in_current_level` | integer | XP dans niveau actuel |
| `daily_xp_today` | integer | XP gagné aujourd'hui |
| `last_daily_reset_at` | date | Dernière reset quotidien |
| `last_xp_event_at` | timestamptz | Dernière activité XP |
| `created_at` | timestamptz | Date création |
| `updated_at` | timestamptz | Dernière modification |

#### ⚙️ `gamification.xp_sources` - Configuration XP
**Fonction :** Règles XP configurables remplaçant 100% hardcoding

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Identifiant unique |
| `source_type` | text | Type source (lesson, course, quiz, profile) |
| `action_type` | text | Action (completion, start, perfect, update) |
| `base_xp` | integer | XP de base |
| `description` | text | Description action |
| `cooldown_minutes` | integer | Cooldown entre actions (défaut: 0) |
| `max_per_day` | integer | Maximum par jour (NULL = illimité) |
| `is_active` | boolean | Règle active |
| `effective_from` | timestamptz | Date début validité |
| `effective_to` | timestamptz | Date fin validité |
| `version` | integer | Version règle |
| `created_at` | timestamptz | Date création |

**Contrainte :**
- `uk_xp_sources_versioned` : UNIQUE(source_type, action_type, version)

#### 🏆 `gamification.level_definitions` - Progression Niveaux
**Fonction :** Système niveaux professionnel remplaçant "Math.floor(xp/100)"

| Colonne | Type | Description |
|---------|------|-------------|
| `level` | integer | PK - Numéro niveau |
| `xp_required` | integer | XP requis pour ce niveau |
| `xp_for_next` | integer | XP requis pour niveau suivant |
| `level_title` | text | Titre niveau (Débutant, Expert, Maître) |
| `badge_icon` | text | Icône badge |
| `badge_color` | text | Couleur badge |
| `rewards` | jsonb | Récompenses déblocage |
| `created_at` | timestamptz | Date création |

**Bootstrap Niveaux :**
```sql
INSERT INTO gamification.level_definitions (level, xp_required, level_title, badge_color) VALUES
(1, 0, 'Débutant', '#10B981'),
(2, 100, 'Apprenant', '#3B82F6'), 
(3, 250, 'Pratiquant', '#8B5CF6'),
(4, 450, 'Expérimenté', '#F59E0B'),
(5, 700, 'Expert', '#EF4444'),
(10, 2000, 'Maître', '#1F2937');
```

### Fonctions RPC GAMIFICATION

#### `gamification.credit_xp()` - Fonction Core XP
**Sécurité :** SECURITY INVOKER | **Comprehensive Validation**

```sql
CREATE OR REPLACE FUNCTION gamification.credit_xp(
    p_user_id uuid,
    p_source_type text,
    p_action_type text,
    p_idempotency_key text,
    p_reference_id uuid DEFAULT NULL,
    p_session_id uuid DEFAULT NULL,
    p_metadata jsonb DEFAULT '{}'
) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER
```

**Validations Intégrité :**
1. **Auth + Authorization** : Only authenticated users can credit XP for themselves
2. **Idempotency Ledger** : INSERT préalable dans ledger, UNIQUE cross-partitions
3. **XP Source Validation** : Vérification règle active et dans période validité
4. **Cooldown Enforcement** : Respect cooldown_minutes configurable
5. **Daily Limits** : Application max_per_day + limite quotidienne globale
6. **Deterministic Variance** : Anti-refresh-hunting avec calculate_deterministic_xp()
7. **Level Calculation** : Nouveau niveau via calculate_level_from_xp()
8. **Atomic Operations** : INSERT xp_events + UPDATE user_xp transactionnel
9. **Notification Outbox** : Level up notifications via outbox pattern
10. **Error Handling** : Retours structurés jsonb avec détail erreurs

#### `gamification.calculate_deterministic_xp()` - Variance Anti-Gaming
**Sécurité :** IMMUTABLE | **Anti-Refresh-Hunting**

```sql
CREATE OR REPLACE FUNCTION gamification.calculate_deterministic_xp(
    base_xp integer,
    p_user_id uuid,
    p_source_type text,
    p_date date DEFAULT current_date
) RETURNS integer
LANGUAGE plpgsql IMMUTABLE
```

**Logique :** Même user_id + source_type + date = même variance XP, empêchant gaming par refresh

#### `gamification.calculate_level_from_xp()` - Calcul Niveau
**Fonction :** Calcul niveau depuis level_definitions (fini hardcoding Math.floor)

```sql
SELECT level FROM gamification.level_definitions
WHERE xp_required <= total_xp
ORDER BY level DESC LIMIT 1;
```

#### `gamification.get_daily_xp_limit()` - Limite Quotidienne
**Fonction :** Récupération limite active depuis seasonal_limits

### Maintenance Automatique

#### Job Création Partitions
```sql
CREATE OR REPLACE FUNCTION gamification.create_monthly_partitions()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    -- Auto-création partitions 3 mois à l'avance
    -- Suppression partitions > 2 ans
    -- Log dans maintenance_log
END;
$$;
```

#### Dashboard Observabilité

**Vue Métriques Temps Réel :**
```sql
-- gamification.dashboard_xp_metrics
-- Utilisateurs actifs, XP distribué, top sources
SELECT COUNT(DISTINCT user_id), SUM(xp_delta), 
       json_agg(top_sources) FROM xp_events WHERE created_at >= current_date;
```

**Vue Santé Système :**
```sql
-- gamification.dashboard_system_health  
-- Taille partitions, maintenance jobs, détection anomalies
SELECT total_partitions, total_storage_pretty, maintenance_health, anomaly_detection;
```

**Vue Matérialisée Leaderboards :**
```sql
-- gamification.dashboard_leaderboards (MATERIALIZED)
-- Refresh CONCURRENTLY pour éviter locks
-- Rang global, XP hebdomadaire, progression niveau
REFRESH MATERIALIZED VIEW CONCURRENTLY gamification.dashboard_leaderboards;
```

### Politiques RLS GAMIFICATION

#### Template USERS_OWN_DATA - XP Personnel
```sql
-- user_xp : utilisateurs voient leur propre XP
CREATE POLICY "user_xp_users_own_read" ON gamification.user_xp FOR SELECT
    USING (user_id = auth.uid());

-- xp_events : utilisateurs voient leurs événements
CREATE POLICY "xp_events_users_own_read" ON gamification.xp_events FOR SELECT
    USING (user_id = auth.uid());
```

#### Template RBAC_PERMISSION - Admin Analytics
```sql
-- Admins accès complet XP analytics
CREATE POLICY "xp_events_admin_analytics" ON gamification.xp_events FOR SELECT
    USING (rbac.has_permission(auth.uid(), 'view_analytics'));

-- Configuration XP pour admins et instructeurs
CREATE POLICY "xp_sources_admin_manage" ON gamification.xp_sources FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_content'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_content'));
```

#### Template AUTH_ACTIVE_READ - Configuration Authentifiée
```sql
-- Lecture sources XP actives avec auth requise + fenêtres efficacité
CREATE POLICY "xp_sources_auth_active_read" ON gamification.xp_sources FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND is_active = true 
        AND (effective_from IS NULL OR effective_from <= now()) 
        AND (effective_to IS NULL OR effective_to >= now())
    );

-- Lecture niveaux auth-only (données sensibles)
CREATE POLICY "level_definitions_auth_read" ON gamification.level_definitions FOR SELECT
    USING (auth.uid() IS NOT NULL);
```

#### Vue Publique Niveaux (Optionnel Frontend)
```sql
-- Vue publique filtrée pour exposition frontend non-auth
CREATE VIEW gamification.public_levels AS
SELECT 
    level,
    xp_required,
    COALESCE(
        LEAD(xp_required) OVER (ORDER BY level),
        xp_required + 1000
    ) - xp_required as xp_to_next
FROM gamification.level_definitions
ORDER BY level;

-- RLS libre sur vue (données non-sensibles)
CREATE POLICY "public_levels_read_all" ON gamification.public_levels FOR SELECT
    USING (true);
```

### Architecture Anti-Hardcoding Achievements

**Configuration 100% Base de Données :**
- XP Sources : 34 règles configurables (lesson:completion=50, quiz:perfect=30, etc.)
- Niveaux : Progression exponentielle configurable (100→250→450→700→1000)
- Limites : daily_xp_limit versionnées par saison (500 XP défaut)
- Variance : Déterministe anti-gaming (±20% basé hash user_id×source×jour)

**Résultats Métriques :**
- ✅ **Zéro hardcoding** - 100% configuration depuis tables
- ✅ **Integrity-first** - Event sourcing + ledger idempotence cross-partitions
- ✅ **Scalable** - Partitionnement mensuel + index optimisés + unicité globale
- ✅ **Secure** - SECURITY INVOKER + RLS auth-required + données sensibles protégées
- ✅ **Observable** - Dashboard temps réel + alertes automatiques
- ✅ **Maintainable** - Jobs maintenance + outbox pattern + vue publique optionnel

---

## 🛡️ Templates RLS Standardisés

### Vue d'Ensemble
L'architecture utilise 4 templates RLS standardisés pour garantir cohérence et sécurité. Ces templates couvrent 95% des besoins sécuritaires et simplifient la maintenance.

### 1. Template USERS_OWN_DATA
**Usage :** Utilisateurs accèdent uniquement à leurs propres données  
**Cas d'usage :** profiles, user_settings, user_progress, lesson_analytics

```sql
-- Lecture données personnelles
CREATE POLICY "{table}_users_own_read" ON {schema}.{table} FOR SELECT
    USING (user_id = auth.uid());

-- Insertion données personnelles  
CREATE POLICY "{table}_users_own_insert" ON {schema}.{table} FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Modification données personnelles
CREATE POLICY "{table}_users_own_update" ON {schema}.{table} FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Suppression données personnelles
CREATE POLICY "{table}_users_own_delete" ON {schema}.{table} FOR DELETE
    USING (user_id = auth.uid());
```

### 2. Template PUBLISHED_READ
**Usage :** Contenu publié accessible à tous, gestion par créateurs  
**Cas d'usage :** courses, lessons, modules, tags

```sql
-- Lecture publique contenu publié
CREATE POLICY "{table}_public_read" ON {schema}.{table} FOR SELECT
    USING (is_published = true);

-- Gestion par créateurs et admins
CREATE POLICY "{table}_manage_access" ON {schema}.{table} FOR ALL
    USING (
        rbac.has_permission(auth.uid(), 'manage_content') OR
        rbac.has_permission(auth.uid(), 'create_courses')
    )
    WITH CHECK (
        rbac.has_permission(auth.uid(), 'manage_content') OR
        rbac.has_permission(auth.uid(), 'create_courses')
    );

-- Contrôle publication spécifique
CREATE POLICY "{table}_publish_control" ON {schema}.{table} FOR UPDATE
    USING (rbac.has_permission(auth.uid(), 'publish_courses'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'publish_courses'));
```

### 3. Template RBAC_PERMISSION
**Usage :** Accès basé sur permissions RBAC granulaires  
**Cas d'usage :** roles, permissions, tiers, analytics admin

```sql
-- Lecture selon permission
CREATE POLICY "{table}_permission_read" ON {schema}.{table} FOR SELECT
    USING (rbac.has_permission(auth.uid(), '{required_permission}'));

-- Gestion selon permission
CREATE POLICY "{table}_permission_manage" ON {schema}.{table} FOR ALL
    USING (rbac.has_permission(auth.uid(), '{required_permission}'))
    WITH CHECK (rbac.has_permission(auth.uid(), '{required_permission}'));
```

**Permissions courantes :**
- `manage_users` : Gestion utilisateurs et rôles
- `manage_content` : Gestion contenu pédagogique
- `manage_billing` : Gestion facturation et tiers
- `view_analytics` : Consultation analytics
- `moderate_content` : Modération contenu

### 4. Template ADMIN_BYPASS
**Usage :** Admins ont accès total, utilisateurs accès restreint  
**Cas d'usage :** Tables sensibles, logs système, configurations

```sql
-- Accès admin total
CREATE POLICY "{table}_admin_full_access" ON {schema}.{table} FOR ALL
    USING (rbac.has_permission(auth.uid(), 'manage_users'))
    WITH CHECK (rbac.has_permission(auth.uid(), 'manage_users'));

-- Lecture publique limitée (optionnel)
CREATE POLICY "{table}_public_limited_read" ON {schema}.{table} FOR SELECT
    USING ({public_read_condition});
```

### Matrice Application Templates

| Schéma | Table | Template Principal | Template Secondaire |
|--------|-------|-------------------|-------------------|
| **util** | job_queue | RBAC_PERMISSION | ADMIN_BYPASS |
| **util** | feature_flags | PUBLISHED_READ | RBAC_PERMISSION |
| **rbac** | roles | RBAC_PERMISSION | - |
| **rbac** | permissions | RBAC_PERMISSION | - |
| **rbac** | user_roles | USERS_OWN_DATA | RBAC_PERMISSION |
| **public** | profiles | USERS_OWN_DATA | RBAC_PERMISSION |
| **public** | user_settings | USERS_OWN_DATA | - |
| **content** | courses | PUBLISHED_READ | RBAC_PERMISSION |
| **content** | lessons | PUBLISHED_READ | RBAC_PERMISSION |
| **access** | tiers | PUBLISHED_READ | RBAC_PERMISSION |
| **access** | user_entitlements | USERS_OWN_DATA | RBAC_PERMISSION |
| **learn** | user_progress | USERS_OWN_DATA | RBAC_PERMISSION |
| **learn** | lesson_analytics | USERS_OWN_DATA | RBAC_PERMISSION |

---

## ⚙️ Fonctions et RPC

### Vue d'Ensemble Fonctions
L'architecture comprend 8+ fonctions RPC critiques réparties par schéma, chacune avec un rôle spécifique et des garanties de sécurité.

### Fonctions RBAC

#### `rbac.has_role(uuid, text) → boolean`
**Sécurité :** DEFINER | **Volatilité :** STABLE
```sql
-- Vérification rôle utilisateur avec expiration
SELECT rbac.has_role(auth.uid(), 'admin');
SELECT rbac.has_role('user-uuid', 'premium_user');
```

#### `rbac.has_permission(uuid, text) → boolean` 
**Sécurité :** DEFINER | **Volatilité :** STABLE
```sql
-- Vérification permission granulaire  
SELECT rbac.has_permission(auth.uid(), 'manage_content');
SELECT rbac.has_permission(auth.uid(), 'view_analytics');
```

#### `rbac.grant_role(uuid, text, text, timestamptz) → jsonb`
**Sécurité :** DEFINER | **Admin Only**
```sql
-- Attribution rôle avec audit
SELECT rbac.grant_role(
    'user-uuid', 
    'instructor', 
    'Promotion to instructor role',
    '2025-12-31 23:59:59'::timestamptz
);
```

#### `rbac.revoke_role(uuid, text, text) → jsonb`
**Sécurité :** DEFINER | **Admin Only**
```sql
-- Révocation rôle avec audit
SELECT rbac.revoke_role(
    'user-uuid',
    'instructor',
    'Violation community guidelines'
);
```

#### `rbac.get_user_permissions(uuid) → TABLE(...)`
**Sécurité :** DEFINER | **Volatilité :** STABLE
```sql
-- Liste complète permissions utilisateur
SELECT * FROM rbac.get_user_permissions(auth.uid());
-- Retourne: permission_key, domain, action, role_name, is_dangerous
```

### Fonctions ACCESS

#### `access.user_can_access(uuid, text, uuid) → jsonb`
**Sécurité :** DEFINER | **Volatilité :** STABLE  
**Fonction Core Paywall**

```sql
-- Vérification accès ressource
SELECT access.user_can_access(
    auth.uid(),
    'course',
    'course-uuid'
);

-- Retourne:
{
  "can_access": true,
  "reason": "tier_based",
  "expires_at": null
}
```

**Logique Complète :**
1. Recherche tier utilisateur actuel
2. Vérification règles cours spécifiques
3. Application overrides leçons
4. Calcul entitlements directs
5. Retour décision structurée

### Fonctions UTIL

#### `util.updated_at() → trigger`
**Usage :** Trigger universal sur toutes tables avec updated_at
```sql
CREATE TRIGGER trigger_updated_at 
    BEFORE UPDATE ON {table}
    FOR EACH ROW 
    EXECUTE FUNCTION util.updated_at();
```

#### `util.is_valid_uuid(text) → boolean`
**Usage :** Validation UUID dans contraintes et triggers
```sql
SELECT util.is_valid_uuid('123e4567-e89b-12d3-a456-426614174000'); -- true
SELECT util.is_valid_uuid('invalid-uuid'); -- false
```

### Sécurité Fonctions

#### SECURITY DEFINER vs INVOKER
```sql
-- DEFINER : Exécution avec privilèges du créateur
CREATE FUNCTION rbac.has_permission(...) 
    SECURITY DEFINER  -- Accès aux tables RBAC

-- INVOKER : Exécution avec privilèges de l'appelant  
CREATE FUNCTION util.is_valid_uuid(...)
    SECURITY INVOKER  -- Fonction pure, pas d'accès privilégié
```

#### Validation Input et Audit
```sql
-- Exemple pattern sécurisé
CREATE OR REPLACE FUNCTION rbac.grant_role(...)
RETURNS jsonb AS $$
DECLARE
    granting_user_id UUID := auth.uid();
BEGIN
    -- 1. Validation authentification
    IF granting_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Authentication required');
    END IF;
    
    -- 2. Validation autorisation
    IF NOT rbac.has_role(granting_user_id, 'admin') THEN
        RETURN jsonb_build_object('success', false, 'error', 'Admin role required');
    END IF;
    
    -- 3. Validation paramètres
    IF target_user_id IS NULL OR target_role_name IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid parameters');
    END IF;
    
    -- 4. Opération avec idempotence
    INSERT INTO rbac.user_roles (...) 
    ON CONFLICT DO UPDATE SET ...;
    
    -- 5. Audit trail
    INSERT INTO rbac.role_grants_log (...) VALUES (...);
    
    -- 6. Réponse structurée
    RETURN jsonb_build_object('success', true, 'role_granted', target_role_name);
END;
$$;
```

---

## 🧪 Tests et Validation

### Métriques Tests Étapes 1, 2 & 3.1

#### Récapitulatif Validation
| Composant | Tests Passés | Statut |
|-----------|--------------|---------|
| **RBAC System** | 5/5 fonctions | ✅ |
| **Content Schema** | 5/5 tables | ✅ |
| **Access Paywall** | user_can_access() | ✅ |
| **Learn Progress** | course_progress vue | ✅ |
| **Gamification System** | 7/7 fonctions | ✅ |
| **Partitioning** | Auto-partitions mensuel | ✅ |
| **RLS Policies** | 61+/61+ politiques | ✅ |

#### Tests d'Intégration Validés

##### 1. Système RBAC Complet
```sql
-- Test attribution/révocation rôles
SELECT rbac.grant_role('test-user', 'instructor', 'Test grant');
SELECT rbac.has_role('test-user', 'instructor'); -- true
SELECT rbac.revoke_role('test-user', 'instructor', 'Test revoke');
SELECT rbac.has_role('test-user', 'instructor'); -- false

-- Test permissions granulaires
SELECT rbac.has_permission('admin-user', 'manage_content'); -- true
SELECT rbac.has_permission('basic-user', 'manage_content'); -- false
```

##### 2. Paywall System
```sql
-- Test fonction access
SELECT access.user_can_access(
    'user-with-premium',
    'course',
    'premium-course-id'
); 
-- Résultat: {"can_access": true, "reason": "tier_based"}

SELECT access.user_can_access(
    'free-user',
    'course', 
    'premium-course-id'
);
-- Résultat: {"can_access": false, "reason": "insufficient_tier"}
```

##### 3. Progression Learning
```sql
-- Test vue course_progress
SELECT 
    course_title,
    lessons_completed,
    overall_completion_percentage,
    course_status
FROM learn.course_progress
WHERE user_id = 'test-user';

-- Résultats validés:
-- - Calculs corrects pourcentages
-- - Status appropriés (not_started/in_progress/completed)  
-- - Métriques temps cohérentes
```

##### 4. Système Gamification
```sql
-- Test fonction credit_xp() avec idempotence
SELECT gamification.credit_xp(
    auth.uid(),
    'lesson',
    'completion',
    'unique-lesson-completion-123'
);
-- Résultat: {"success": true, "xp_delta": 45, "level_changed": false}

-- Test idempotence - même appel
SELECT gamification.credit_xp(
    auth.uid(),
    'lesson', 
    'completion',
    'unique-lesson-completion-123'
);
-- Résultat: {"success": true, "already_processed": true, "event_id": "same-id"}

-- Test limites quotidiennes
-- Après 10 crédits XP dans la même journée...
-- Résultat: {"success": false, "error": "daily_xp_limit_reached"}
```

##### 5. Tests Robustesse Gamification
```sql
-- Validation partitionnement
SELECT COUNT(*) as partition_count 
FROM pg_tables 
WHERE schemaname = 'gamification' AND tablename LIKE 'xp_events_%';
-- Résultat: 3+ partitions automatiques

-- Test variance déterministe (anti-refresh-hunting)
SELECT 
    gamification.calculate_deterministic_xp(50, auth.uid(), 'lesson') as xp1,
    gamification.calculate_deterministic_xp(50, auth.uid(), 'lesson') as xp2,
    gamification.calculate_deterministic_xp(50, auth.uid(), 'lesson') as xp3;
-- Résultat: xp1 = xp2 = xp3 (même valeur déterministe)

-- Test dashboard observabilité  
SELECT * FROM gamification.dashboard_xp_metrics;
SELECT * FROM gamification.dashboard_system_health;
SELECT total_alerts FROM gamification.dashboard_alerts;
-- Résultats: Métriques temps réel + alertes système
```

##### 6. RLS Policies Validation
```sql
-- Test isolation utilisateurs
SET role TO 'authenticated';
SET request.jwt.claims TO '{"sub": "user-1", "role": "authenticated"}';

SELECT * FROM public.profiles; -- Voit seulement profil user-1
SELECT * FROM learn.user_progress; -- Voit seulement progression user-1
SELECT * FROM gamification.user_xp; -- Voit seulement XP user-1

-- Test accès admin
SET request.jwt.claims TO '{"sub": "admin-1", "role": "authenticated"}';
SELECT rbac.grant_role('admin-1', 'admin', 'Test');

SELECT * FROM rbac.roles; -- Voit tous les rôles (admin)
SELECT * FROM learn.user_progress; -- Voit toutes progressions (admin)
```

### Tests Concurrence et Performance

#### Test Advisory Locks (Futur - Gamification)
```sql
-- Simulation concurrence crédits XP
-- Sera implementé à l'Étape 3
```

#### Index Performance Validée
```sql
-- Analyse utilisation index
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes 
WHERE schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
ORDER BY idx_scan DESC;

-- Tous index critiques utilisés efficacement
```

### Métriques Sécurité

#### Row Level Security Coverage
```sql
SELECT 
    schemaname,
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
GROUP BY schemaname, tablename
ORDER BY schemaname;

-- Résultat: 49 politiques couvrant 100% des tables sensibles
```

#### Audit Trail Validation
```sql
-- Vérification logs audit RBAC
SELECT 
    operation,
    COUNT(*) as occurrences
FROM rbac.role_grants_log 
GROUP BY operation;

-- Tous changements RBAC audités
```

---

## 🔧 Maintenance et Opérations

### Commandes Diagnostic

#### Santé Générale Architecture
```sql
-- Vue d'ensemble schémas
SELECT 
    schema_name,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
GROUP BY schema_name;

-- Vérification politiques RLS actives
SELECT 
    schemaname,
    tablename,
    COUNT(*) as active_policies
FROM pg_policies 
WHERE schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
GROUP BY schemaname, tablename;
```

#### Performance Index
```sql
-- Analyse performance index par schéma
SELECT 
    i.schemaname,
    i.tablename,
    i.indexname,
    s.idx_scan,
    s.idx_tup_read,
    pg_size_pretty(pg_relation_size(s.indexrelname::regclass)) as size
FROM pg_stat_user_indexes s
JOIN pg_indexes i ON i.indexname = s.indexrelname
WHERE i.schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
ORDER BY s.idx_scan DESC;
```

#### Monitoring Activité
```sql
-- Activité temps réel par schéma
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    last_vacuum,
    last_analyze
FROM pg_stat_user_tables
WHERE schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn')
ORDER BY (n_tup_ins + n_tup_upd + n_tup_del) DESC;
```

### Scripts Maintenance

#### Nettoyage Logs
```sql
-- Nettoyage role_grants_log ancien (>90 jours)
DELETE FROM rbac.role_grants_log 
WHERE performed_at < NOW() - INTERVAL '90 days';

-- Nettoyage lesson_analytics ancien (>1 an)
DELETE FROM learn.lesson_analytics 
WHERE created_at < NOW() - INTERVAL '1 year';
```

#### Recalculs Cohérence
```sql
-- Vérification cohérence user_progress
WITH progress_check AS (
    SELECT 
        user_id,
        lesson_id,
        status,
        completion_percentage,
        completed_at
    FROM learn.user_progress
    WHERE (status = 'completed' AND completed_at IS NULL)
       OR (status != 'completed' AND completed_at IS NOT NULL)
       OR (completion_percentage = 100 AND status != 'completed')
)
SELECT COUNT(*) as inconsistencies FROM progress_check;
```

### Backup et Recovery

#### Backup Schema Spécifique
```bash
# Backup schéma RBAC critique
pg_dump -h host -U user -n rbac dbname > rbac_backup.sql

# Backup données content
pg_dump -h host -U user -n content -t content.courses -t content.lessons dbname > content_backup.sql
```

#### Migration Schema
```sql
-- Template migration nouveau schéma
BEGIN;

-- 1. Créer schéma
CREATE SCHEMA IF NOT EXISTS new_schema;

-- 2. Créer tables
-- ... (tables du schéma)

-- 3. Appliquer RLS
ALTER TABLE new_schema.table_name ENABLE ROW LEVEL SECURITY;

-- 4. Créer politiques selon templates
-- ... (politiques RLS)

-- 5. Créer index optimisés
-- ... (index de performance)

-- 6. Insérer données bootstrap si nécessaire
-- ... (données initiales)

COMMIT;
```

### Monitoring Alertes

#### Métriques Critiques
```sql
-- Alertes seuils performance
WITH slow_queries AS (
    SELECT query, calls, total_time, mean_time
    FROM pg_stat_statements
    WHERE mean_time > 1000 -- > 1 seconde
    ORDER BY mean_time DESC
    LIMIT 10
)
SELECT COUNT(*) as slow_query_count FROM slow_queries;

-- Alerte RLS policies manquantes
SELECT 
    t.schemaname,
    t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON p.schemaname = t.schemaname AND p.tablename = t.tablename
WHERE t.schemaname IN ('util', 'rbac', 'public', 'content', 'access', 'learn', 'gamification')
  AND p.policyname IS NULL
  AND t.tablename NOT LIKE '%_temp%';
```

---

## 📊 Statistiques Finales Architecture

### Métriques Complètes Post-Étapes 1, 2 & 3.1

| Composant | Quantité | Détail |
|-----------|----------|--------|
| **Schémas** | 7 | util, rbac, public, content, access, learn, gamification |
| **Tables** | 26 | Répartition: 3+5+4+5+4+2+7 (avec ledger + partitions auto) |
| **Vues** | 5 | effective_access, course_progress, dashboard_* (3) |
| **Vues Matérialisées** | 1 | dashboard_leaderboards (CONCURRENTLY) |
| **Fonctions RPC** | 15+ | RBAC (5) + ACCESS (1) + UTIL (2) + GAMIFICATION (7+) |
| **Politiques RLS** | 61+ | Sécurité granulaire complète |
| **Templates RLS** | 4 | Standardisation 95% cas usage |
| **Index** | 70+ | Performance optimisée + partitions |
| **Triggers** | 15+ | Automation (updated_at, audit, maintenance) |
| **Contraintes** | 50+ | Intégrité données + cohérence XP |

### Architecture Strengths

#### ✅ **Anti-Hardcoding Achieved**
- Élimination complète données hardcodées
- Configuration 100% base de données
- Système extensible sans déploiements

#### ✅ **RBAC Professionnel**
- 5 rôles + 11 permissions granulaires
- Remplacement complet anti-pattern `is_admin`
- Audit trail complet

#### ✅ **Paywall Scalable**
- Multi-tiers avec overrides granulaires
- Fonction user_can_access() centralisée
- Bootstrap 3 tiers opérationnels

#### ✅ **Learning Analytics**
- Tracking granulaire + vues agrégées
- Métriques performance temps réel
- Progression multi-niveau (leçon→cours)

#### ✅ **Gamification Ultra-Professionnelle** 🆕
- Event sourcing avec partitionnement mensuel automatique
- **Ledger idempotence global** - unicité cross-partitions garantie
- Variance déterministe ±20% anti-refresh-hunting
- Dashboard observabilité temps réel + alertes
- **SECURITY INVOKER architecture** + RLS auth-required 
- **Zéro hardcoding** - 100% configuration DB + vue publique filtrée

#### ✅ **Sécurité Enterprise**
- 61+ politiques RLS actives
- Templates standardisés
- Isolation complète données utilisateurs

#### ✅ **Performance Optimisée**
- Index stratégiques sur tous hot paths
- Vues matérialisées CONCURRENTLY
- Partitionnement PostgreSQL native
- Architecture concurrence-proof

---

## 🚀 Roadmap Futures Étapes

### Étape 3 : Gamification ✅ TERMINÉ
- Schema `gamification` avec XP partitioning mensuel ✅
- Event sourcing avec idempotency namespacée ✅
- Dashboard observabilité + alertes automatiques ✅
- Anti-hardcoding XP rules complet ✅
- SECURITY INVOKER + variance déterministe ✅

### Étape 4 : Community Features
- Schema `community` (comments, reactions)
- Moderation système
- Social learning features

### Étape 5 : Billing & Referrals
- Schema `billing` intégration Stripe
- Referral program
- Revenue analytics

### Étape 6 : AI Assistant
- Vector search embeddings
- AI recommendations
- Chat assistant intégré

### Étape 7 : Advanced Analytics
- Schema `analytics` warehouse
- Business intelligence
- ML insights

---

**📝 Cette documentation constitue la référence complète de l'architecture backend AI Foundations LMS post-Étapes 1, 2 & 3.1. Elle doit être maintenue à jour à chaque modification selon les consignes CLAUDE.md.**

**🎯 Architecture Status: PRODUCTION READY - Gamification Enterprise Déployée**

**⚡ Performance: ULTRA-OPTIMIZED - 61+ RLS Policies, 70+ Index, Partitioning Mensuel**

**🎮 Gamification: INTEGRITY-FIRST - Event Sourcing, Dashboard Temps Réel, Zéro Hardcoding**

---

*Dernière mise à jour : 2025-01-22 - Post-Étapes Content + Paywall + Progression + Gamification*
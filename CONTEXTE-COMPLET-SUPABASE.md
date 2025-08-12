# Contexte Complet de la Base de Données Supabase

**Date de génération :** `12 août 2025`

Ce document détaille l'intégralité de la configuration de la base de données du projet. Il inclut les tables, les colonnes, les relations, les permissions, les policies de sécurité (RLS), les fonctions personnalisées (RPC), les triggers et les index.

## 1. Rôles et Permissions Générales

[
  {
    "role_name": "PUBLIC",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "privileges": "SELECT"
  },
  {
    "role_name": "PUBLIC",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements_info",
    "privileges": "SELECT"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "achievement_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "activity_log",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "admin_xp_management",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "coupons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "courses",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "lessons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "level_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "modules",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "profiles",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_achievements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_course_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_login_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_notes",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_profiles_with_xp",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "user_settings",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "xp_events",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "public",
    "table_name": "xp_sources",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "supabase_functions",
    "table_name": "hooks",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "anon",
    "table_schema": "supabase_functions",
    "table_name": "migrations",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "achievement_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "activity_log",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "admin_xp_management",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "coupons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "courses",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "lessons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "level_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "modules",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "profiles",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_achievements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_course_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_login_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_notes",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_profiles_with_xp",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "user_settings",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "xp_events",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "public",
    "table_name": "xp_sources",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "supabase_functions",
    "table_name": "hooks",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "authenticated",
    "table_schema": "supabase_functions",
    "table_name": "migrations",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "dashboard_user",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "dashboard_user",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements_info",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "audit_log_entries",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "flow_state",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "identities",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "instances",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "mfa_amr_claims",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "mfa_challenges",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "mfa_factors",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "one_time_tokens",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "refresh_tokens",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "saml_providers",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "saml_relay_states",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "schema_migrations",
    "privileges": "SELECT"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "sso_domains",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "sso_providers",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "auth",
    "table_name": "users",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "extensions",
    "table_name": "pg_stat_statements_info",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "achievement_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "activity_log",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "admin_xp_management",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "coupons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "courses",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "lessons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "level_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "modules",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "profiles",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_achievements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_course_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_login_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_notes",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_profiles_with_xp",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "user_settings",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "xp_events",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "public",
    "table_name": "xp_sources",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "supabase_functions",
    "table_name": "hooks",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "supabase_functions",
    "table_name": "migrations",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "supabase_migrations",
    "table_name": "schema_migrations",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "postgres",
    "table_schema": "supabase_migrations",
    "table_name": "seed_files",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "achievement_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "activity_log",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "admin_xp_management",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "coupons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "courses",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "lessons",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "level_definitions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "modules",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "profiles",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "user_achievements",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "user_course_progress",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "user_login_sessions",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  },
  {
    "role_name": "service_role",
    "table_schema": "public",
    "table_name": "user_notes",
    "privileges": "DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE"
  }
]

## 2. Tables, Colonnes, Contraintes et Logique Métier

[
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 2,
    "column_name": "achievement_key",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 3,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 4,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 5,
    "column_name": "icon",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 6,
    "column_name": "category",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'general'::text",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 7,
    "column_name": "xp_reward",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 8,
    "column_name": "condition_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 9,
    "column_name": "condition_params",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 10,
    "column_name": "is_repeatable",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 11,
    "column_name": "cooldown_hours",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 12,
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 13,
    "column_name": "sort_order",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 14,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "achievement_definitions",
    "ordinal_position": 15,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 3,
    "column_name": "type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 4,
    "column_name": "action",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 5,
    "column_name": "details",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "activity_log",
    "ordinal_position": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 1,
    "column_name": "type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 2,
    "column_name": "source_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 3,
    "column_name": "action_type",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 4,
    "column_name": "full_key",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 5,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 6,
    "column_name": "xp_value",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 7,
    "column_name": "is_repeatable",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 8,
    "column_name": "cooldown_minutes",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 9,
    "column_name": "max_per_day",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 10,
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 11,
    "column_name": "usage_count",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "admin_xp_management",
    "ordinal_position": 12,
    "column_name": "last_used_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 2,
    "column_name": "code",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 3,
    "column_name": "discount_percent",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 4,
    "column_name": "valid_from",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 5,
    "column_name": "valid_to",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 6,
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 7,
    "column_name": "max_uses",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 8,
    "column_name": "current_uses",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "coupons",
    "ordinal_position": 9,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 2,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 3,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 4,
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 5,
    "column_name": "cover_image_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 6,
    "column_name": "is_published",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 9,
    "column_name": "category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 10,
    "column_name": "thumbnail_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "courses",
    "ordinal_position": 11,
    "column_name": "difficulty",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 2,
    "column_name": "module_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 3,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 4,
    "column_name": "content",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 5,
    "column_name": "lesson_order",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 6,
    "column_name": "is_published",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 9,
    "column_name": "duration",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "lessons",
    "ordinal_position": 10,
    "column_name": "type",
    "data_type": "USER-DEFINED",
    "is_nullable": "YES",
    "column_default": "'video'::lesson_type",
    "column_comment": "Type of lesson: video, text, quiz, or exercise"
  },
  {
    "table_name": "lessons",
    "ordinal_position": 11,
    "column_name": "video_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": "URL to video file for video lessons"
  },
  {
    "table_name": "lessons",
    "ordinal_position": 12,
    "column_name": "transcript",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": "Video transcript or text content"
  },
  {
    "table_name": "lessons",
    "ordinal_position": 13,
    "column_name": "text_content",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": "Rich text content for text lessons"
  },
  {
    "table_name": "lessons",
    "ordinal_position": 14,
    "column_name": "resources",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'[]'::jsonb",
    "column_comment": "JSON array of lesson resources (files, links, etc.)"
  },
  {
    "table_name": "lessons",
    "ordinal_position": 15,
    "column_name": "xp_reward",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": "XP points awarded for completing this lesson"
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 1,
    "column_name": "level",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 2,
    "column_name": "xp_required",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": "XP total requis pour atteindre ce niveau"
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 3,
    "column_name": "xp_for_next",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": "XP nécessaire pour passer au niveau suivant"
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 4,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": "'Nouveau niveau'::text",
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 5,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 6,
    "column_name": "rewards",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": "Récompenses débloquées à ce niveau (badges, features, etc.)"
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 7,
    "column_name": "badge_icon",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 8,
    "column_name": "badge_color",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 9,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "level_definitions",
    "ordinal_position": 10,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 2,
    "column_name": "course_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 3,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 4,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 5,
    "column_name": "module_order",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 6,
    "column_name": "is_published",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 7,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "modules",
    "ordinal_position": 8,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 2,
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 3,
    "column_name": "avatar_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 4,
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 7,
    "column_name": "current_streak",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 8,
    "column_name": "last_completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 9,
    "column_name": "is_admin",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 11,
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 12,
    "column_name": "profession",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 13,
    "column_name": "company",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 14,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 15,
    "column_name": "profile_completion_history",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "profiles",
    "ordinal_position": 22,
    "column_name": "xp",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "0",
    "column_comment": "Total XP utilisateur - source unique de vérité"
  },
  {
    "table_name": "profiles",
    "ordinal_position": 23,
    "column_name": "level",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "1",
    "column_comment": "Niveau utilisateur calculé depuis level_definitions"
  },
  {
    "table_name": "profiles",
    "ordinal_position": 24,
    "column_name": "last_xp_event_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": "Dernier événement XP pour tracking"
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 3,
    "column_name": "achievement_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 4,
    "column_name": "achievement_name",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 5,
    "column_name": "xp_reward",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 6,
    "column_name": "unlocked_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_achievements",
    "ordinal_position": 7,
    "column_name": "details",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 2,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 3,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 4,
    "column_name": "slug",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 5,
    "column_name": "cover_image_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 6,
    "column_name": "thumbnail_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 7,
    "column_name": "category",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 8,
    "column_name": "difficulty",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 9,
    "column_name": "is_published",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 11,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 12,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 13,
    "column_name": "total_lessons",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 14,
    "column_name": "completed_lessons",
    "data_type": "bigint",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 15,
    "column_name": "completion_percentage",
    "data_type": "double precision",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 16,
    "column_name": "last_activity_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_course_progress",
    "ordinal_position": 17,
    "column_name": "progress",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 3,
    "column_name": "session_start",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 4,
    "column_name": "session_end",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 5,
    "column_name": "ip_address",
    "data_type": "inet",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 6,
    "column_name": "user_agent",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 7,
    "column_name": "device_info",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 8,
    "column_name": "pages_visited",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": "'{}'::text[]",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 9,
    "column_name": "actions_performed",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 10,
    "column_name": "xp_gained_in_session",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 11,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_login_sessions",
    "ordinal_position": 12,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 3,
    "column_name": "lesson_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 4,
    "column_name": "content",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 5,
    "column_name": "selected_text",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 6,
    "column_name": "position",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 7,
    "column_name": "tags",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": "'{}'::text[]",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 8,
    "column_name": "is_private",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 9,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_notes",
    "ordinal_position": 10,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 2,
    "column_name": "full_name",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 3,
    "column_name": "avatar_url",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 4,
    "column_name": "email",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 5,
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 6,
    "column_name": "profession",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 7,
    "column_name": "company",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 8,
    "column_name": "is_admin",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 9,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 10,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 11,
    "column_name": "current_streak",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 12,
    "column_name": "last_completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 13,
    "column_name": "profile_completion_history",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 14,
    "column_name": "xp",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 15,
    "column_name": "level",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 16,
    "column_name": "xp_for_next_level",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 17,
    "column_name": "last_xp_event_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_profiles_with_xp",
    "ordinal_position": 18,
    "column_name": "level_title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 3,
    "column_name": "lesson_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 4,
    "column_name": "status",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": "'not_started'::text",
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 5,
    "column_name": "completed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "user_progress",
    "ordinal_position": 7,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 3,
    "column_name": "started_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 4,
    "column_name": "ended_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 5,
    "column_name": "duration_minutes",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 6,
    "column_name": "pages_visited",
    "data_type": "ARRAY",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_sessions",
    "ordinal_position": 7,
    "column_name": "device_info",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 3,
    "column_name": "notification_settings",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{\"weeklyReport\": true, \"achievementAlerts\": true, \"pushNotifications\": false, \"emailNotifications\": true, \"reminderNotifications\": true}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 4,
    "column_name": "privacy_settings",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{\"showProgress\": false, \"allowMessages\": false, \"showAchievements\": true, \"profileVisibility\": \"private\"}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 5,
    "column_name": "learning_preferences",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{\"autoplay\": true, \"language\": \"fr\", \"dailyGoal\": 30, \"preferredDuration\": \"medium\", \"difficultyProgression\": \"adaptive\"}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 6,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 7,
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "CURRENT_TIMESTAMP",
    "column_comment": null
  },
  {
    "table_name": "user_settings",
    "ordinal_position": 8,
    "column_name": "cookie_preferences",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{\"analytics\": false, \"essential\": true, \"marketing\": false, \"acceptedAt\": null, \"functional\": false, \"lastUpdated\": null}'::jsonb",
    "column_comment": "Préférences de cookies de l'utilisateur (essential, analytics, marketing, functional)"
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 2,
    "column_name": "user_id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 3,
    "column_name": "source_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 4,
    "column_name": "action_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 5,
    "column_name": "xp_delta",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 6,
    "column_name": "xp_before",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 7,
    "column_name": "xp_after",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 8,
    "column_name": "level_before",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 9,
    "column_name": "level_after",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 10,
    "column_name": "reference_id",
    "data_type": "uuid",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 11,
    "column_name": "metadata",
    "data_type": "jsonb",
    "is_nullable": "YES",
    "column_default": "'{}'::jsonb",
    "column_comment": null
  },
  {
    "table_name": "xp_events",
    "ordinal_position": 12,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 1,
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO",
    "column_default": "gen_random_uuid()",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 2,
    "column_name": "source_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 3,
    "column_name": "action_type",
    "data_type": "text",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 4,
    "column_name": "xp_value",
    "data_type": "integer",
    "is_nullable": "NO",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 5,
    "column_name": "is_repeatable",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "false",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 6,
    "column_name": "cooldown_minutes",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": "0",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 7,
    "column_name": "max_per_day",
    "data_type": "integer",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 8,
    "column_name": "description",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 9,
    "column_name": "is_active",
    "data_type": "boolean",
    "is_nullable": "YES",
    "column_default": "true",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 10,
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES",
    "column_default": "now()",
    "column_comment": null
  },
  {
    "table_name": "xp_sources",
    "ordinal_position": 11,
    "column_name": "title",
    "data_type": "text",
    "is_nullable": "YES",
    "column_default": null,
    "column_comment": null
  }
]

## 3. Contraintes et Index

[
  {
    "constraint_name": "achievement_definitions_pkey",
    "constraint_type": "p",
    "table_name": "achievement_definitions",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_settings_pkey",
    "constraint_type": "p",
    "table_name": "user_settings",
    "definition": "(id)"
  },
  {
    "constraint_name": "activity_log_pkey",
    "constraint_type": "p",
    "table_name": "activity_log",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_settings_user_id_key",
    "constraint_type": "u",
    "table_name": "user_settings",
    "definition": "(user_id)"
  },
  {
    "constraint_name": "activity_log_user_id_fkey",
    "constraint_type": "f",
    "table_name": "activity_log",
    "definition": "FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_settings_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_settings",
    "definition": "FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "achievement_definitions_achievement_key_key",
    "constraint_type": "u",
    "table_name": "achievement_definitions",
    "definition": "(achievement_key)"
  },
  {
    "constraint_name": "user_login_sessions_pkey",
    "constraint_type": "p",
    "table_name": "user_login_sessions",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_login_sessions_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_login_sessions",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "xp_events_pkey",
    "constraint_type": "p",
    "table_name": "xp_events",
    "definition": "(id)"
  },
  {
    "constraint_name": "xp_events_user_id_fkey",
    "constraint_type": "f",
    "table_name": "xp_events",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "level_definitions_pkey",
    "constraint_type": "p",
    "table_name": "level_definitions",
    "definition": "(level)"
  },
  {
    "constraint_name": "user_notes_pkey",
    "constraint_type": "p",
    "table_name": "user_notes",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_notes_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_notes",
    "definition": "FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_notes_lesson_id_fkey",
    "constraint_type": "f",
    "table_name": "user_notes",
    "definition": "FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "lessons_xp_reward_positive",
    "constraint_type": "c",
    "table_name": "lessons",
    "definition": "CHECK ((xp_reward >= 0))"
  },
  {
    "constraint_name": "lessons_resources_valid_json",
    "constraint_type": "c",
    "table_name": "lessons",
    "definition": "CHECK ((jsonb_typeof(resources) = 'array'::text))"
  },
  {
    "constraint_name": "fk_user_progress_user_id",
    "constraint_type": "f",
    "table_name": "user_progress",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "fk_user_settings_user_id",
    "constraint_type": "f",
    "table_name": "user_settings",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "fk_activity_log_user_id",
    "constraint_type": "f",
    "table_name": "activity_log",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "profiles_pkey",
    "constraint_type": "p",
    "table_name": "profiles",
    "definition": "(id)"
  },
  {
    "constraint_name": "profiles_email_key",
    "constraint_type": "u",
    "table_name": "profiles",
    "definition": "(email)"
  },
  {
    "constraint_name": "profiles_id_fkey",
    "constraint_type": "f",
    "table_name": "profiles",
    "definition": "FOREIGN KEY (id) REFERENCES auth.users(id)"
  },
  {
    "constraint_name": "lessons_lesson_order_positive",
    "constraint_type": "c",
    "table_name": "lessons",
    "definition": "CHECK ((lesson_order > 0))"
  },
  {
    "constraint_name": "modules_module_order_positive",
    "constraint_type": "c",
    "table_name": "modules",
    "definition": "CHECK ((module_order > 0))"
  },
  {
    "constraint_name": "courses_slug_unique",
    "constraint_type": "u",
    "table_name": "courses",
    "definition": "(slug)"
  },
  {
    "constraint_name": "user_progress_user_lesson_unique",
    "constraint_type": "u",
    "table_name": "user_progress",
    "definition": "(user_id, lesson_id)"
  },
  {
    "constraint_name": "check_xp_event_structure",
    "constraint_type": "c",
    "table_name": "activity_log",
    "definition": "CHECK ((((details ? 'xp_delta'::text) AND (((details ->> 'xp_delta'::text))::integer IS NOT NULL)) OR (NOT (details ? 'xp_delta'::text))))"
  },
  {
    "constraint_name": "xp_sources_pkey",
    "constraint_type": "p",
    "table_name": "xp_sources",
    "definition": "(id)"
  },
  {
    "constraint_name": "xp_sources_source_type_action_type_key",
    "constraint_type": "u",
    "table_name": "xp_sources",
    "definition": "(source_type, action_type)"
  },
  {
    "constraint_name": "user_achievements_pkey",
    "constraint_type": "p",
    "table_name": "user_achievements",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_achievements_user_id_achievement_type_achievement_name_key",
    "constraint_type": "u",
    "table_name": "user_achievements",
    "definition": "(user_id, achievement_type, achievement_name)"
  },
  {
    "constraint_name": "courses_pkey",
    "constraint_type": "p",
    "table_name": "courses",
    "definition": "(id)"
  },
  {
    "constraint_name": "courses_slug_key",
    "constraint_type": "u",
    "table_name": "courses",
    "definition": "(slug)"
  },
  {
    "constraint_name": "modules_pkey",
    "constraint_type": "p",
    "table_name": "modules",
    "definition": "(id)"
  },
  {
    "constraint_name": "modules_course_id_fkey",
    "constraint_type": "f",
    "table_name": "modules",
    "definition": "FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "lessons_pkey",
    "constraint_type": "p",
    "table_name": "lessons",
    "definition": "(id)"
  },
  {
    "constraint_name": "lessons_module_id_fkey",
    "constraint_type": "f",
    "table_name": "lessons",
    "definition": "FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_progress_status_check",
    "constraint_type": "c",
    "table_name": "user_progress",
    "definition": "CHECK ((status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'completed'::text])))"
  },
  {
    "constraint_name": "user_progress_pkey",
    "constraint_type": "p",
    "table_name": "user_progress",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_progress_user_id_lesson_id_key",
    "constraint_type": "u",
    "table_name": "user_progress",
    "definition": "(user_id, lesson_id)"
  },
  {
    "constraint_name": "user_progress_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_progress",
    "definition": "FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_progress_lesson_id_fkey",
    "constraint_type": "f",
    "table_name": "user_progress",
    "definition": "FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "coupons_pkey",
    "constraint_type": "p",
    "table_name": "coupons",
    "definition": "(id)"
  },
  {
    "constraint_name": "coupons_code_key",
    "constraint_type": "u",
    "table_name": "coupons",
    "definition": "(code)"
  },
  {
    "constraint_name": "user_sessions_pkey",
    "constraint_type": "p",
    "table_name": "user_sessions",
    "definition": "(id)"
  },
  {
    "constraint_name": "user_sessions_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_sessions",
    "definition": "FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_achievements_user_id_fkey",
    "constraint_type": "f",
    "table_name": "user_achievements",
    "definition": "FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE"
  },
  {
    "constraint_name": "user_notes_pkey",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE UNIQUE INDEX user_notes_pkey ON public.user_notes USING btree (id)"
  },
  {
    "constraint_name": "user_notes_user_id_idx",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX user_notes_user_id_idx ON public.user_notes USING btree (user_id)"
  },
  {
    "constraint_name": "user_notes_lesson_id_idx",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX user_notes_lesson_id_idx ON public.user_notes USING btree (lesson_id)"
  },
  {
    "constraint_name": "user_notes_created_at_idx",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX user_notes_created_at_idx ON public.user_notes USING btree (created_at)"
  },
  {
    "constraint_name": "idx_user_notes_user_id",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX idx_user_notes_user_id ON public.user_notes USING btree (user_id)"
  },
  {
    "constraint_name": "idx_user_notes_lesson_id",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX idx_user_notes_lesson_id ON public.user_notes USING btree (lesson_id)"
  },
  {
    "constraint_name": "idx_user_notes_is_private",
    "constraint_type": "I",
    "table_name": "user_notes",
    "definition": "CREATE INDEX idx_user_notes_is_private ON public.user_notes USING btree (is_private)"
  },
  {
    "constraint_name": "idx_courses_category",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE INDEX idx_courses_category ON public.courses USING btree (category)"
  },
  {
    "constraint_name": "idx_courses_is_published",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE INDEX idx_courses_is_published ON public.courses USING btree (is_published)"
  },
  {
    "constraint_name": "courses_pkey",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE UNIQUE INDEX courses_pkey ON public.courses USING btree (id)"
  },
  {
    "constraint_name": "courses_slug_key",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE UNIQUE INDEX courses_slug_key ON public.courses USING btree (slug)"
  },
  {
    "constraint_name": "idx_courses_difficulty",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE INDEX idx_courses_difficulty ON public.courses USING btree (difficulty)"
  },
  {
    "constraint_name": "idx_courses_slug",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE INDEX idx_courses_slug ON public.courses USING btree (slug)"
  },
  {
    "constraint_name": "courses_slug_unique",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE UNIQUE INDEX courses_slug_unique ON public.courses USING btree (slug)"
  },
  {
    "constraint_name": "idx_courses_published",
    "constraint_type": "I",
    "table_name": "courses",
    "definition": "CREATE INDEX idx_courses_published ON public.courses USING btree (is_published) WHERE (is_published = true)"
  },
  {
    "constraint_name": "modules_pkey",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE UNIQUE INDEX modules_pkey ON public.modules USING btree (id)"
  },
  {
    "constraint_name": "idx_modules_course_id",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE INDEX idx_modules_course_id ON public.modules USING btree (course_id)"
  },
  {
    "constraint_name": "idx_modules_is_published",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE INDEX idx_modules_is_published ON public.modules USING btree (is_published)"
  },
  {
    "constraint_name": "idx_modules_order",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE INDEX idx_modules_order ON public.modules USING btree (module_order)"
  },
  {
    "constraint_name": "idx_modules_course_order",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE INDEX idx_modules_course_order ON public.modules USING btree (course_id, module_order)"
  },
  {
    "constraint_name": "idx_modules_published",
    "constraint_type": "I",
    "table_name": "modules",
    "definition": "CREATE INDEX idx_modules_published ON public.modules USING btree (is_published) WHERE (is_published = true)"
  },
  {
    "constraint_name": "idx_lessons_is_published",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_is_published ON public.lessons USING btree (is_published)"
  },
  {
    "constraint_name": "lessons_pkey",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id)"
  },
  {
    "constraint_name": "idx_lessons_module_id",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_module_id ON public.lessons USING btree (module_id)"
  },
  {
    "constraint_name": "idx_lessons_type",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_type ON public.lessons USING btree (type)"
  },
  {
    "constraint_name": "idx_lessons_xp_reward",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_xp_reward ON public.lessons USING btree (xp_reward)"
  },
  {
    "constraint_name": "idx_lessons_order",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_order ON public.lessons USING btree (lesson_order)"
  },
  {
    "constraint_name": "idx_lessons_module_order",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_module_order ON public.lessons USING btree (module_id, lesson_order)"
  },
  {
    "constraint_name": "idx_lessons_published",
    "constraint_type": "I",
    "table_name": "lessons",
    "definition": "CREATE INDEX idx_lessons_published ON public.lessons USING btree (is_published) WHERE (is_published = true)"
  },
  {
    "constraint_name": "user_sessions_pkey",
    "constraint_type": "I",
    "table_name": "user_sessions",
    "definition": "CREATE UNIQUE INDEX user_sessions_pkey ON public.user_sessions USING btree (id)"
  },
  {
    "constraint_name": "user_sessions_user_id_idx",
    "constraint_type": "I",
    "table_name": "user_sessions",
    "definition": "CREATE INDEX user_sessions_user_id_idx ON public.user_sessions USING btree (user_id)"
  },
  {
    "constraint_name": "user_sessions_started_at_idx",
    "constraint_type": "I",
    "table_name": "user_sessions",
    "definition": "CREATE INDEX user_sessions_started_at_idx ON public.user_sessions USING btree (started_at)"
  },
  {
    "constraint_name": "idx_activity_log_user_xp_tracking",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_user_xp_tracking ON public.activity_log USING btree (user_id, created_at DESC, type, action) WHERE (details ? 'xp_delta'::text)"
  },
  {
    "constraint_name": "idx_activity_log_xp_source",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_xp_source ON public.activity_log USING btree (user_id, type, action, created_at) WHERE (details ? 'xp_delta'::text)"
  },
  {
    "constraint_name": "activity_log_pkey",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE UNIQUE INDEX activity_log_pkey ON public.activity_log USING btree (id)"
  },
  {
    "constraint_name": "idx_activity_log_user_id",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_user_id ON public.activity_log USING btree (user_id)"
  },
  {
    "constraint_name": "idx_activity_log_created_at",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_created_at ON public.activity_log USING btree (created_at DESC)"
  },
  {
    "constraint_name": "idx_activity_log_type",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_type ON public.activity_log USING btree (type)"
  },
  {
    "constraint_name": "idx_activity_log_user_created",
    "constraint_type": "I",
    "table_name": "activity_log",
    "definition": "CREATE INDEX idx_activity_log_user_created ON public.activity_log USING btree (user_id, created_at DESC)"
  },
  {
    "constraint_name": "profiles_pkey",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id)"
  },
  {
    "constraint_name": "profiles_email_key",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)"
  },
  {
    "constraint_name": "idx_profiles_email",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE INDEX idx_profiles_email ON public.profiles USING btree (email)"
  },
  {
    "constraint_name": "idx_profiles_created_at",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE INDEX idx_profiles_created_at ON public.profiles USING btree (created_at)"
  },
  {
    "constraint_name": "idx_profiles_xp_level",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE INDEX idx_profiles_xp_level ON public.profiles USING btree (xp, level) WHERE (xp >= 0)"
  },
  {
    "constraint_name": "idx_profiles_admin",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE INDEX idx_profiles_admin ON public.profiles USING btree (is_admin) WHERE (is_admin = true)"
  },
  {
    "constraint_name": "idx_profiles_user_id",
    "constraint_type": "I",
    "table_name": "profiles",
    "definition": "CREATE INDEX idx_profiles_user_id ON public.profiles USING btree (id)"
  },
  {
    "constraint_name": "coupons_pkey",
    "constraint_type": "I",
    "table_name": "coupons",
    "definition": "CREATE UNIQUE INDEX coupons_pkey ON public.coupons USING btree (id)"
  },
  {
    "constraint_name": "coupons_code_key",
    "constraint_type": "I",
    "table_name": "coupons",
    "definition": "CREATE UNIQUE INDEX coupons_code_key ON public.coupons USING btree (code)"
  },
  {
    "constraint_name": "user_achievements_pkey",
    "constraint_type": "I",
    "table_name": "user_achievements",
    "definition": "CREATE UNIQUE INDEX user_achievements_pkey ON public.user_achievements USING btree (id)"
  },
  {
    "constraint_name": "user_achievements_user_id_achievement_type_achievement_name_key",
    "constraint_type": "I",
    "table_name": "user_achievements",
    "definition": "CREATE UNIQUE INDEX user_achievements_user_id_achievement_type_achievement_name_key ON public.user_achievements USING btree (user_id, achievement_type, achievement_name)"
  },
  {
    "constraint_name": "idx_user_achievements_user_id",
    "constraint_type": "I",
    "table_name": "user_achievements",
    "definition": "CREATE INDEX idx_user_achievements_user_id ON public.user_achievements USING btree (user_id)"
  },
  {
    "constraint_name": "idx_user_achievements_type",
    "constraint_type": "I",
    "table_name": "user_achievements",
    "definition": "CREATE INDEX idx_user_achievements_type ON public.user_achievements USING btree (achievement_type)"
  },
  {
    "constraint_name": "idx_user_achievements_user_type",
    "constraint_type": "I",
    "table_name": "user_achievements",
    "definition": "CREATE INDEX idx_user_achievements_user_type ON public.user_achievements USING btree (user_id, achievement_type)"
  },
  {
    "constraint_name": "xp_sources_pkey",
    "constraint_type": "I",
    "table_name": "xp_sources",
    "definition": "CREATE UNIQUE INDEX xp_sources_pkey ON public.xp_sources USING btree (id)"
  },
  {
    "constraint_name": "xp_sources_source_type_action_type_key",
    "constraint_type": "I",
    "table_name": "xp_sources",
    "definition": "CREATE UNIQUE INDEX xp_sources_source_type_action_type_key ON public.xp_sources USING btree (source_type, action_type)"
  },
  {
    "constraint_name": "idx_xp_sources_active",
    "constraint_type": "I",
    "table_name": "xp_sources",
    "definition": "CREATE INDEX idx_xp_sources_active ON public.xp_sources USING btree (source_type, action_type) WHERE (is_active = true)"
  },
  {
    "constraint_name": "idx_xp_sources_active_type",
    "constraint_type": "I",
    "table_name": "xp_sources",
    "definition": "CREATE INDEX idx_xp_sources_active_type ON public.xp_sources USING btree (is_active, source_type, action_type) WHERE (is_active = true)"
  },
  {
    "constraint_name": "user_login_sessions_pkey",
    "constraint_type": "I",
    "table_name": "user_login_sessions",
    "definition": "CREATE UNIQUE INDEX user_login_sessions_pkey ON public.user_login_sessions USING btree (id)"
  },
  {
    "constraint_name": "achievement_definitions_pkey",
    "constraint_type": "I",
    "table_name": "achievement_definitions",
    "definition": "CREATE UNIQUE INDEX achievement_definitions_pkey ON public.achievement_definitions USING btree (id)"
  },
  {
    "constraint_name": "achievement_definitions_achievement_key_key",
    "constraint_type": "I",
    "table_name": "achievement_definitions",
    "definition": "CREATE UNIQUE INDEX achievement_definitions_achievement_key_key ON public.achievement_definitions USING btree (achievement_key)"
  },
  {
    "constraint_name": "level_definitions_pkey",
    "constraint_type": "I",
    "table_name": "level_definitions",
    "definition": "CREATE UNIQUE INDEX level_definitions_pkey ON public.level_definitions USING btree (level)"
  },
  {
    "constraint_name": "idx_level_definitions_xp_required",
    "constraint_type": "I",
    "table_name": "level_definitions",
    "definition": "CREATE INDEX idx_level_definitions_xp_required ON public.level_definitions USING btree (xp_required) WHERE (xp_required >= 0)"
  },
  {
    "constraint_name": "idx_xp_events_user_created",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_user_created ON public.xp_events USING btree (user_id, created_at DESC)"
  },
  {
    "constraint_name": "idx_xp_events_source_type",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_source_type ON public.xp_events USING btree (source_type, action_type) WHERE (source_type IS NOT NULL)"
  },
  {
    "constraint_name": "xp_events_pkey",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE UNIQUE INDEX xp_events_pkey ON public.xp_events USING btree (id)"
  },
  {
    "constraint_name": "idx_xp_events_user_timeline",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_user_timeline ON public.xp_events USING btree (user_id, created_at DESC)"
  },
  {
    "constraint_name": "idx_xp_events_source_stats",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_source_stats ON public.xp_events USING btree (source_type, action_type, created_at DESC)"
  },
  {
    "constraint_name": "idx_xp_events_created_at",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_created_at ON public.xp_events USING btree (created_at DESC)"
  },
  {
    "constraint_name": "idx_xp_events_user_aggregates",
    "constraint_type": "I",
    "table_name": "xp_events",
    "definition": "CREATE INDEX idx_xp_events_user_aggregates ON public.xp_events USING btree (user_id, source_type, action_type)"
  },
  {
    "constraint_name": "user_settings_pkey",
    "constraint_type": "I",
    "table_name": "user_settings",
    "definition": "CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (id)"
  },
  {
    "constraint_name": "user_settings_user_id_key",
    "constraint_type": "I",
    "table_name": "user_settings",
    "definition": "CREATE UNIQUE INDEX user_settings_user_id_key ON public.user_settings USING btree (user_id)"
  },
  {
    "constraint_name": "idx_user_settings_user_id",
    "constraint_type": "I",
    "table_name": "user_settings",
    "definition": "CREATE INDEX idx_user_settings_user_id ON public.user_settings USING btree (user_id)"
  },
  {
    "constraint_name": "user_progress_pkey",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE UNIQUE INDEX user_progress_pkey ON public.user_progress USING btree (id)"
  },
  {
    "constraint_name": "user_progress_user_id_lesson_id_key",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE UNIQUE INDEX user_progress_user_id_lesson_id_key ON public.user_progress USING btree (user_id, lesson_id)"
  },
  {
    "constraint_name": "idx_user_progress_user_id",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_user_id ON public.user_progress USING btree (user_id)"
  },
  {
    "constraint_name": "idx_user_progress_lesson_id",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_lesson_id ON public.user_progress USING btree (lesson_id)"
  },
  {
    "constraint_name": "idx_user_progress_status",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_status ON public.user_progress USING btree (status)"
  },
  {
    "constraint_name": "idx_user_progress_completed_at",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_completed_at ON public.user_progress USING btree (completed_at)"
  },
  {
    "constraint_name": "idx_user_progress_user_lesson",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_user_lesson ON public.user_progress USING btree (user_id, lesson_id)"
  },
  {
    "constraint_name": "idx_user_progress_status_updated",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE INDEX idx_user_progress_status_updated ON public.user_progress USING btree (status, updated_at)"
  },
  {
    "constraint_name": "user_progress_user_lesson_unique",
    "constraint_type": "I",
    "table_name": "user_progress",
    "definition": "CREATE UNIQUE INDEX user_progress_user_lesson_unique ON public.user_progress USING btree (user_id, lesson_id)"
  }
]

## 4. Tables avec RLS activé

[
  {
    "table_name": "user_notes",
    "rls_is_enabled": true
  },
  {
    "table_name": "courses",
    "rls_is_enabled": true
  },
  {
    "table_name": "modules",
    "rls_is_enabled": true
  },
  {
    "table_name": "lessons",
    "rls_is_enabled": true
  },
  {
    "table_name": "user_sessions",
    "rls_is_enabled": true
  },
  {
    "table_name": "activity_log",
    "rls_is_enabled": true
  },
  {
    "table_name": "profiles",
    "rls_is_enabled": true
  },
  {
    "table_name": "coupons",
    "rls_is_enabled": true
  },
  {
    "table_name": "user_achievements",
    "rls_is_enabled": true
  },
  {
    "table_name": "xp_sources",
    "rls_is_enabled": true
  },
  {
    "table_name": "user_login_sessions",
    "rls_is_enabled": true
  },
  {
    "table_name": "achievement_definitions",
    "rls_is_enabled": false
  },
  {
    "table_name": "level_definitions",
    "rls_is_enabled": false
  },
  {
    "table_name": "xp_events",
    "rls_is_enabled": true
  },
  {
    "table_name": "user_settings",
    "rls_is_enabled": true
  },
  {
    "table_name": "user_progress",
    "rls_is_enabled": true
  }
]

## 5. RLS

[
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can view their own settings",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can update their own settings",
    "command": "UPDATE",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": "(auth.uid() = user_id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can insert their own settings",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = user_id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Admins can view all settings",
    "command": "SELECT",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "profiles_users_select_own",
    "command": "SELECT",
    "using_expression": "(auth.uid() = id)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "profiles_users_update_own",
    "command": "UPDATE",
    "using_expression": "(auth.uid() = id)",
    "check_expression": "(auth.uid() = id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "profiles_users_insert_own",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "profiles_admins_full_access",
    "command": "ALL",
    "using_expression": "((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "courses",
    "policy_name": "courses_public_read",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "courses",
    "policy_name": "courses_admin_full_access",
    "command": "ALL",
    "using_expression": "((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "modules_public_read",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "modules_admin_full_access",
    "command": "ALL",
    "using_expression": "((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "lessons_public_read",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "coupons",
    "policy_name": "Admins can manage coupons",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "lessons_admin_full_access",
    "command": "ALL",
    "using_expression": "((COALESCE((((current_setting('request.jwt.claims'::text, true))::json ->> 'is_admin'::text))::boolean, ((((current_setting('request.jwt.claims'::text, true))::json -> 'user_metadata'::text) ->> 'is_admin'::text))::boolean, false) = true) OR (((current_setting('request.jwt.claims'::text, true))::json ->> 'role'::text) = 'service_role'::text))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_achievements",
    "policy_name": "Users can view their own achievements",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_achievements",
    "policy_name": "Users can insert their own achievements",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = user_id)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_achievements",
    "policy_name": "Admins can manage all achievements",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_login_sessions",
    "policy_name": "Users can view their own sessions",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "Les modules des cours publiés sont visibles par tous.",
    "command": "SELECT",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM courses\n  WHERE ((courses.id = modules.course_id) AND (courses.is_published = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "xp_events",
    "policy_name": "Users can view their own XP events",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "allow note owner read",
    "command": "SELECT",
    "using_expression": "((user_id = auth.uid()) OR (is_private = false))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "allow note owner insert",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(user_id = auth.uid())",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "allow note owner update",
    "command": "UPDATE",
    "using_expression": "(user_id = auth.uid())",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "allow note owner delete",
    "command": "DELETE",
    "using_expression": "(user_id = auth.uid())",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "xp_events",
    "policy_name": "Users can insert their own XP events",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = user_id)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "xp_events",
    "policy_name": "Admins can view all XP events",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "Les leçons des cours publiés sont visibles par tous.",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "activity_log",
    "policy_name": "Users can insert own activity records",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = user_id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "users_can_insert_own_profile",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_login_sessions",
    "policy_name": "Users can insert their own sessions",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(auth.uid() = user_id)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_login_sessions",
    "policy_name": "Users can update their own sessions",
    "command": "UPDATE",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_login_sessions",
    "policy_name": "Admins can view all sessions",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "xp_sources",
    "policy_name": "Anyone can view active XP sources",
    "command": "SELECT",
    "using_expression": "(is_active = true)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "xp_sources",
    "policy_name": "Admins can manage XP sources",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "session_owner_select",
    "command": "SELECT",
    "using_expression": "(user_id = auth.uid())",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "session_owner_update",
    "command": "UPDATE",
    "using_expression": "(user_id = auth.uid())",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "session_owner_delete",
    "command": "DELETE",
    "using_expression": "(user_id = auth.uid())",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "session_owner_insert",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "(user_id = auth.uid())",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "courses",
    "policy_name": "Les cours publiés sont visibles par tous.",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "Les leçons publiées sont visibles par tous.",
    "command": "SELECT",
    "using_expression": "(is_published = true)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Users can view their own progress",
    "command": "SELECT",
    "using_expression": "(((auth.uid())::text = (user_id)::text) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Users can insert their own progress",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "((auth.uid())::text = (user_id)::text)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Users can update their own progress",
    "command": "UPDATE",
    "using_expression": "((auth.uid())::text = (user_id)::text)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "Users can read modules",
    "command": "SELECT",
    "using_expression": "true",
    "check_expression": null,
    "roles": "authenticated, anon"
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "Enable read access for modules",
    "command": "SELECT",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM courses c\n  WHERE ((c.id = modules.course_id) AND (c.is_published = true))))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Users can manage their own progress",
    "command": "ALL",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": "(auth.uid() = user_id)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Admins can view all user progress",
    "command": "SELECT",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "coupons",
    "policy_name": "Anyone can view active coupons",
    "command": "SELECT",
    "using_expression": "(is_active = true)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "coupons",
    "policy_name": "Only admins can manage coupons",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "activity_log",
    "policy_name": "Users can read own activity records",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "activity_log",
    "policy_name": "Admins can view all activity records",
    "command": "SELECT",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "activity_log",
    "policy_name": "Admins can manage all activity records",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can read own settings",
    "command": "SELECT",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can update own settings",
    "command": "UPDATE",
    "using_expression": "(auth.uid() = user_id)",
    "check_expression": "(auth.uid() = user_id)",
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_progress",
    "policy_name": "Admins can manage all progress",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "Users can manage their own notes",
    "command": "ALL",
    "using_expression": "((auth.uid())::text = (user_id)::text)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "users_can_view_own_profile",
    "command": "SELECT",
    "using_expression": "(auth.uid() = id)",
    "check_expression": null,
    "roles": "authenticated"
  },
  {
    "schema_name": "public",
    "table_name": "user_notes",
    "policy_name": "Users can view public notes",
    "command": "SELECT",
    "using_expression": "((is_private = false) OR ((auth.uid())::text = (user_id)::text) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "Users can view their own sessions",
    "command": "SELECT",
    "using_expression": "(((auth.uid())::text = (user_id)::text) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "Users can insert their own sessions",
    "command": "INSERT",
    "using_expression": null,
    "check_expression": "((auth.uid())::text = (user_id)::text)",
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_sessions",
    "policy_name": "Users can update their own sessions",
    "command": "UPDATE",
    "using_expression": "((auth.uid())::text = (user_id)::text)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "user_settings",
    "policy_name": "Users can manage their own settings",
    "command": "ALL",
    "using_expression": "((auth.uid())::text = (user_id)::text)",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "courses",
    "policy_name": "Published courses are viewable by everyone",
    "command": "SELECT",
    "using_expression": "((is_published = true) OR (is_published IS NULL))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "Published modules are viewable by everyone",
    "command": "SELECT",
    "using_expression": "((is_published = true) OR (is_published IS NULL) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "Published lessons are viewable by everyone",
    "command": "SELECT",
    "using_expression": "((is_published = true) OR (is_published IS NULL) OR (EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true)))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "courses",
    "policy_name": "Admins can manage courses",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "modules",
    "policy_name": "Admins can manage modules",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "lessons",
    "policy_name": "Admins can manage lessons",
    "command": "ALL",
    "using_expression": "(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND (profiles.is_admin = true))))",
    "check_expression": null,
    "roles": ""
  },
  {
    "schema_name": "public",
    "table_name": "profiles",
    "policy_name": "users_can_update_own_profile",
    "command": "UPDATE",
    "using_expression": "(auth.uid() = id)",
    "check_expression": "(auth.uid() = id)",
    "roles": "authenticated"
  }
]

## 6. Fonctions Personnalisées (RPC)

[
  {
    "schema_name": "public",
    "function_name": "create_profile_completion_achievements",
    "arguments": "",
    "function_definition": "CREATE OR REPLACE FUNCTION public.create_profile_completion_achievements()\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  -- Achievement pour Avatar personnalisé\r\n  INSERT INTO achievements (\r\n    title,\r\n    description,\r\n    icon,\r\n    rarity,\r\n    xp_reward,\r\n    user_id,\r\n    earned\r\n  )\r\n  SELECT \r\n    'Portrait Parfait',\r\n    'Ajoutez une photo de profil personnalisée',\r\n    'Camera',\r\n    'common',\r\n    15,\r\n    p.id,\r\n    (p.avatar_url IS NOT NULL AND p.avatar_url NOT LIKE '%ui-avatars.com%')\r\n  FROM profiles p\r\n  WHERE NOT EXISTS (\r\n    SELECT 1 FROM achievements a \r\n    WHERE a.user_id = p.id AND a.title = 'Portrait Parfait'\r\n  );\r\n\r\n  -- Achievement pour Téléphone\r\n  INSERT INTO achievements (\r\n    title,\r\n    description,\r\n    icon,\r\n    rarity,\r\n    xp_reward,\r\n    user_id,\r\n    earned\r\n  )\r\n  SELECT \r\n    'Toujours Joignable',\r\n    'Renseignez votre numéro de téléphone',\r\n    'Phone',\r\n    'common',\r\n    10,\r\n    p.id,\r\n    (p.phone IS NOT NULL AND LENGTH(p.phone) >= 10)\r\n  FROM profiles p\r\n  WHERE NOT EXISTS (\r\n    SELECT 1 FROM achievements a \r\n    WHERE a.user_id = p.id AND a.title = 'Toujours Joignable'\r\n  );\r\n\r\n  -- Achievement pour Profession\r\n  INSERT INTO achievements (\r\n    title,\r\n    description,\r\n    icon,\r\n    rarity,\r\n    xp_reward,\r\n    user_id,\r\n    earned\r\n  )\r\n  SELECT \r\n    'Expert Professionnel',\r\n    'Indiquez votre profession',\r\n    'Briefcase',\r\n    'common',\r\n    10,\r\n    p.id,\r\n    (p.profession IS NOT NULL AND LENGTH(p.profession) >= 2)\r\n  FROM profiles p\r\n  WHERE NOT EXISTS (\r\n    SELECT 1 FROM achievements a \r\n    WHERE a.user_id = p.id AND a.title = 'Expert Professionnel'\r\n  );\r\n\r\n  -- Achievement pour Entreprise\r\n  INSERT INTO achievements (\r\n    title,\r\n    description,\r\n    icon,\r\n    rarity,\r\n    xp_reward,\r\n    user_id,\r\n    earned\r\n  )\r\n  SELECT \r\n    'Entrepreneur',\r\n    'Précisez votre entreprise',\r\n    'Building',\r\n    'common',\r\n    5,\r\n    p.id,\r\n    (p.company IS NOT NULL AND LENGTH(p.company) >= 2)\r\n  FROM profiles p\r\n  WHERE NOT EXISTS (\r\n    SELECT 1 FROM achievements a \r\n    WHERE a.user_id = p.id AND a.title = 'Entrepreneur'\r\n  );\r\n\r\n  -- Achievement pour Profil Complet (100%)\r\n  INSERT INTO achievements (\r\n    title,\r\n    description,\r\n    icon,\r\n    rarity,\r\n    xp_reward,\r\n    user_id,\r\n    earned\r\n  )\r\n  SELECT \r\n    'Profil Légendaire',\r\n    'Complétez votre profil à 100%',\r\n    'Trophy',\r\n    'legendary',\r\n    50,\r\n    p.id,\r\n    (\r\n      p.avatar_url IS NOT NULL AND p.avatar_url NOT LIKE '%ui-avatars.com%' AND\r\n      p.phone IS NOT NULL AND LENGTH(p.phone) >= 10 AND\r\n      p.profession IS NOT NULL AND LENGTH(p.profession) >= 2 AND\r\n      p.company IS NOT NULL AND LENGTH(p.company) >= 2\r\n    )\r\n  FROM profiles p\r\n  WHERE NOT EXISTS (\r\n    SELECT 1 FROM achievements a \r\n    WHERE a.user_id = p.id AND a.title = 'Profil Légendaire'\r\n  );\r\n\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "sync_achievement_xp",
    "arguments": "target_user_id uuid DEFAULT NULL::uuid",
    "function_definition": "CREATE OR REPLACE FUNCTION public.sync_achievement_xp(target_user_id uuid DEFAULT NULL::uuid)\n RETURNS TABLE(user_id uuid, achievement_key text, xp_corrected integer, sync_status text)\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  user_record RECORD;\n  achievement_record RECORD;\n  missing_xp INTEGER;\n  user_current_xp INTEGER;\n  new_user_xp INTEGER;\nBEGIN\n  -- Si aucun user spécifié, traiter tous les users\n  FOR user_record IN \n    SELECT DISTINCT ua.user_id\n    FROM user_achievements ua\n    WHERE (target_user_id IS NULL OR ua.user_id = target_user_id)\n  LOOP\n    -- Pour chaque user, vérifier ses achievements vs ses XP events\n    FOR achievement_record IN\n      SELECT \n        ua.user_id,\n        ua.achievement_type,\n        ua.unlocked_at,\n        ad.xp_reward,\n        ad.title,\n        CASE \n          WHEN EXISTS (\n            SELECT 1 FROM xp_events xe \n            WHERE xe.user_id = ua.user_id \n              AND xe.source_type = 'achievement' \n              AND xe.action_type = 'unlock'\n              AND xe.metadata->>'achievement_key' = ua.achievement_type\n          ) THEN FALSE\n          ELSE TRUE\n        END as missing_xp_event\n      FROM user_achievements ua\n      JOIN achievement_definitions ad ON ua.achievement_type = ad.achievement_key\n      WHERE ua.user_id = user_record.user_id\n        AND ad.is_active = true\n    LOOP\n      \n      -- Si l'événement XP manque, le créer\n      IF achievement_record.missing_xp_event THEN\n        -- Récupérer les XP actuels de l'utilisateur\n        SELECT p.xp INTO user_current_xp \n        FROM profiles p \n        WHERE p.id = achievement_record.user_id;\n        \n        new_user_xp := user_current_xp + achievement_record.xp_reward;\n        \n        -- Créer l'événement XP manquant\n        INSERT INTO xp_events (\n          user_id,\n          source_type,\n          action_type,\n          xp_delta,\n          xp_before,\n          xp_after,\n          level_before,\n          level_after,\n          metadata,\n          created_at\n        ) VALUES (\n          achievement_record.user_id,\n          'achievement',\n          'unlock',\n          achievement_record.xp_reward,\n          user_current_xp,\n          new_user_xp,\n          (SELECT level FROM profiles WHERE id = achievement_record.user_id),\n          (SELECT level FROM level_definitions WHERE xp_required <= new_user_xp ORDER BY level DESC LIMIT 1),\n          jsonb_build_object(\n            'source', 'achievement:unlock',\n            'achievement_key', achievement_record.achievement_type,\n            'achievement_name', achievement_record.title,\n            'auto_sync', true,\n            'sync_date', NOW()\n          ),\n          achievement_record.unlocked_at\n        );\n        \n        -- Mettre à jour les XP du profil\n        UPDATE profiles \n        SET xp = new_user_xp,\n            level = (SELECT level FROM level_definitions WHERE xp_required <= new_user_xp ORDER BY level DESC LIMIT 1)\n        WHERE id = achievement_record.user_id;\n        \n        -- Retourner le résultat\n        user_id := achievement_record.user_id;\n        achievement_key := achievement_record.achievement_type;\n        xp_corrected := achievement_record.xp_reward;\n        sync_status := 'XP_ADDED';\n        RETURN NEXT;\n      END IF;\n      \n    END LOOP;\n  END LOOP;\n  \n  RETURN;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "trigger_achievement_check",
    "arguments": "",
    "function_definition": "CREATE OR REPLACE FUNCTION public.trigger_achievement_check()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  result RECORD;\nBEGIN\n  -- Vérifier les achievements après toute modification XP/streak/level\n  IF TG_TABLE_NAME = 'xp_events' AND TG_OP = 'INSERT' THEN\n    SELECT * FROM check_and_unlock_achievements(NEW.user_id) INTO result;\n  ELSIF TG_TABLE_NAME = 'profiles' AND TG_OP = 'UPDATE' THEN\n    SELECT * FROM check_and_unlock_achievements(NEW.id) INTO result;\n  ELSIF TG_TABLE_NAME = 'user_xp_balance' AND TG_OP IN ('INSERT', 'UPDATE') THEN\n    SELECT * FROM check_and_unlock_achievements(NEW.user_id) INTO result;\n  END IF;\n  \n  -- Log si des achievements ont été débloqués\n  IF result.unlocked_count > 0 THEN\n    RAISE NOTICE 'Unlocked % achievements for user %', result.unlocked_count, COALESCE(NEW.user_id, NEW.id);\n  END IF;\n  \n  RETURN COALESCE(NEW, OLD);\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "update_profile_achievements",
    "arguments": "",
    "function_definition": "CREATE OR REPLACE FUNCTION public.update_profile_achievements()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nDECLARE\r\n  has_custom_avatar boolean;\r\n  has_phone boolean;\r\n  has_profession boolean;\r\n  has_company boolean;\r\n  profile_complete boolean;\r\nBEGIN\r\n  -- Vérifier les conditions\r\n  has_custom_avatar := NEW.avatar_url IS NOT NULL AND NEW.avatar_url NOT LIKE '%ui-avatars.com%';\r\n  has_phone := NEW.phone IS NOT NULL AND LENGTH(NEW.phone) >= 10;\r\n  has_profession := NEW.profession IS NOT NULL AND LENGTH(NEW.profession) >= 2;\r\n  has_company := NEW.company IS NOT NULL AND LENGTH(NEW.company) >= 2;\r\n  profile_complete := has_custom_avatar AND has_phone AND has_profession AND has_company;\r\n\r\n  -- Mettre à jour Achievement Avatar\r\n  UPDATE achievements \r\n  SET earned = has_custom_avatar\r\n  WHERE user_id = NEW.id AND title = 'Portrait Parfait';\r\n\r\n  -- Mettre à jour Achievement Phone\r\n  UPDATE achievements \r\n  SET earned = has_phone\r\n  WHERE user_id = NEW.id AND title = 'Toujours Joignable';\r\n\r\n  -- Mettre à jour Achievement Profession\r\n  UPDATE achievements \r\n  SET earned = has_profession\r\n  WHERE user_id = NEW.id AND title = 'Expert Professionnel';\r\n\r\n  -- Mettre à jour Achievement Company\r\n  UPDATE achievements \r\n  SET earned = has_company\r\n  WHERE user_id = NEW.id AND title = 'Entrepreneur';\r\n\r\n  -- Mettre à jour Achievement Profil Complet\r\n  UPDATE achievements \r\n  SET earned = profile_complete\r\n  WHERE user_id = NEW.id AND title = 'Profil Légendaire';\r\n\r\n  -- Si un nouveau achievement est débloqué, ajouter XP\r\n  IF TG_OP = 'UPDATE' THEN\r\n    -- Calculer XP à ajouter basé sur les nouveaux achievements\r\n    UPDATE profiles\r\n    SET xp = xp + (\r\n      SELECT COALESCE(SUM(\r\n        CASE \r\n          WHEN a.earned = true AND (\r\n            (a.title = 'Portrait Parfait' AND (OLD.avatar_url IS NULL OR OLD.avatar_url LIKE '%ui-avatars.com%')) OR\r\n            (a.title = 'Toujours Joignable' AND (OLD.phone IS NULL OR LENGTH(OLD.phone) < 10)) OR\r\n            (a.title = 'Expert Professionnel' AND (OLD.profession IS NULL OR LENGTH(OLD.profession) < 2)) OR\r\n            (a.title = 'Entrepreneur' AND (OLD.company IS NULL OR LENGTH(OLD.company) < 2)) OR\r\n            (a.title = 'Profil Légendaire' AND NOT (\r\n              OLD.avatar_url IS NOT NULL AND OLD.avatar_url NOT LIKE '%ui-avatars.com%' AND\r\n              OLD.phone IS NOT NULL AND LENGTH(OLD.phone) >= 10 AND\r\n              OLD.profession IS NOT NULL AND LENGTH(OLD.profession) >= 2 AND\r\n              OLD.company IS NOT NULL AND LENGTH(OLD.company) >= 2\r\n            ))\r\n          ) THEN a.xp_reward\r\n          ELSE 0\r\n        END\r\n      ), 0)\r\n      FROM achievements a\r\n      WHERE a.user_id = NEW.id AND a.title IN (\r\n        'Portrait Parfait', 'Toujours Joignable', 'Expert Professionnel', 'Entrepreneur', 'Profil Légendaire'\r\n      )\r\n    )\r\n    WHERE id = NEW.id;\r\n  END IF;\r\n\r\n  RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "start_user_session",
    "arguments": "target_user_id uuid, session_ip inet DEFAULT NULL::inet, session_user_agent text DEFAULT NULL::text",
    "function_definition": "CREATE OR REPLACE FUNCTION public.start_user_session(target_user_id uuid, session_ip inet DEFAULT NULL::inet, session_user_agent text DEFAULT NULL::text)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  session_id UUID;\n  last_session RECORD;\nBEGIN\n  -- Vérifier la dernière session pour calculer les streaks\n  SELECT * FROM user_login_sessions \n  WHERE user_id = target_user_id \n  ORDER BY session_start DESC \n  LIMIT 1 INTO last_session;\n  \n  -- Créer une nouvelle session\n  INSERT INTO user_login_sessions (user_id, ip_address, user_agent)\n  VALUES (target_user_id, session_ip, session_user_agent)\n  RETURNING id INTO session_id;\n  \n  -- Mettre à jour le streak si nécessaire (via StreakService)\n  -- Cela déclenchera automatiquement la vérification des achievements\n  \n  RETURN session_id;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "end_user_session",
    "arguments": "session_id uuid",
    "function_definition": "CREATE OR REPLACE FUNCTION public.end_user_session(session_id uuid)\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  session_record RECORD;\n  xp_gained INTEGER;\nBEGIN\n  -- Récupérer la session\n  SELECT * FROM user_login_sessions WHERE id = session_id INTO session_record;\n  \n  IF NOT FOUND THEN\n    RETURN false;\n  END IF;\n  \n  -- Calculer l'XP gagné pendant cette session\n  SELECT COALESCE(SUM(xp_delta), 0) FROM xp_events \n  WHERE user_id = session_record.user_id \n    AND created_at >= session_record.session_start\n  INTO xp_gained;\n  \n  -- Mettre à jour la session\n  UPDATE user_login_sessions \n  SET \n    session_end = NOW(),\n    xp_gained_in_session = xp_gained,\n    updated_at = NOW()\n  WHERE id = session_id;\n  \n  RETURN true;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "recalculate_user_xp_after_source_removal",
    "arguments": "p_source_type text, p_action_type text, p_reason text DEFAULT 'Source removed'::text",
    "function_definition": "CREATE OR REPLACE FUNCTION public.recalculate_user_xp_after_source_removal(p_source_type text, p_action_type text, p_reason text DEFAULT 'Source removed'::text)\n RETURNS TABLE(user_id uuid, xp_removed integer, new_total_xp integer, new_level integer)\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  user_record RECORD;\n  user_current_xp INTEGER;\n  xp_to_remove INTEGER;\n  new_xp INTEGER;\n  new_level INTEGER;\nBEGIN\n  -- Pour chaque utilisateur qui a des événements XP de cette source\n  FOR user_record IN\n    SELECT \n      xe.user_id,\n      SUM(xe.xp_delta) as total_xp_to_remove\n    FROM xp_events xe\n    WHERE xe.source_type = p_source_type \n      AND xe.action_type = p_action_type\n      AND xe.xp_delta > 0  -- Seulement les gains XP positifs\n    GROUP BY xe.user_id\n  LOOP\n    -- Récupérer les XP actuels de l'utilisateur\n    SELECT p.xp INTO user_current_xp \n    FROM profiles p \n    WHERE p.id = user_record.user_id;\n    \n    xp_to_remove := user_record.total_xp_to_remove;\n    new_xp := GREATEST(0, user_current_xp - xp_to_remove); -- Ne pas descendre sous 0\n    \n    -- Calculer le nouveau niveau\n    SELECT COALESCE(ld.level, 1)\n    INTO new_level\n    FROM level_definitions ld\n    WHERE ld.xp_required <= new_xp \n    ORDER BY ld.level DESC \n    LIMIT 1;\n    \n    -- Mettre à jour le profil utilisateur\n    UPDATE profiles \n    SET \n      xp = new_xp,\n      level = new_level,\n      updated_at = NOW()\n    WHERE id = user_record.user_id;\n    \n    -- Créer un événement de correction pour traçabilité\n    INSERT INTO xp_events (\n      user_id,\n      source_type,\n      action_type,\n      xp_delta,\n      xp_before,\n      xp_after,\n      level_before,\n      level_after,\n      metadata\n    ) VALUES (\n      user_record.user_id,\n      'admin',\n      'source_removal',\n      -xp_to_remove,\n      user_current_xp,\n      new_xp,\n      (SELECT level FROM profiles WHERE id = user_record.user_id),\n      new_level,\n      jsonb_build_object(\n        'reason', p_reason,\n        'removed_source', p_source_type || ':' || p_action_type,\n        'original_xp_events_removed', xp_to_remove,\n        'auto_correction', true,\n        'removal_date', NOW()\n      )\n    );\n    \n    -- Retourner les informations pour le log\n    user_id := user_record.user_id;\n    xp_removed := xp_to_remove;\n    new_total_xp := new_xp;\n    new_level := new_level;\n    RETURN NEXT;\n    \n    RAISE NOTICE 'XP corrected for user %: -% XP (% -> %), level %', \n      user_record.user_id, xp_to_remove, user_current_xp, new_xp, new_level;\n      \n  END LOOP;\n  \n  RETURN;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "recalculate_user_xp_after_achievement_removal",
    "arguments": "p_achievement_key text, p_reason text DEFAULT 'Achievement removed'::text",
    "function_definition": "CREATE OR REPLACE FUNCTION public.recalculate_user_xp_after_achievement_removal(p_achievement_key text, p_reason text DEFAULT 'Achievement removed'::text)\n RETURNS TABLE(user_id uuid, xp_removed integer, new_total_xp integer, new_level integer)\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  user_record RECORD;\n  user_current_xp INTEGER;\n  user_current_level INTEGER;\n  xp_to_remove INTEGER;\n  new_xp INTEGER;\n  new_level INTEGER;\nBEGIN\n  -- Pour chaque utilisateur qui a des événements XP de cet achievement\n  FOR user_record IN\n    SELECT \n      xe.user_id,\n      SUM(xe.xp_delta) as total_xp_to_remove\n    FROM xp_events xe\n    WHERE xe.source_type = 'achievement' \n      AND xe.action_type = 'unlock'\n      AND xe.metadata->>'achievement_key' = p_achievement_key\n      AND xe.xp_delta > 0  -- Seulement les gains XP positifs\n    GROUP BY xe.user_id\n  LOOP\n    -- Récupérer les XP et niveau actuels de l'utilisateur\n    SELECT p.xp, p.level INTO user_current_xp, user_current_level \n    FROM profiles p \n    WHERE p.id = user_record.user_id;\n    \n    xp_to_remove := user_record.total_xp_to_remove;\n    new_xp := GREATEST(0, user_current_xp - xp_to_remove); -- Ne pas descendre sous 0\n    \n    -- Calculer le nouveau niveau\n    SELECT COALESCE(ld.level, 1)\n    INTO new_level\n    FROM level_definitions ld\n    WHERE ld.xp_required <= new_xp \n    ORDER BY ld.level DESC \n    LIMIT 1;\n    \n    -- Mettre à jour le profil utilisateur\n    UPDATE profiles \n    SET \n      xp = new_xp,\n      level = new_level,\n      updated_at = NOW()\n    WHERE id = user_record.user_id;\n    \n    -- Supprimer l'achievement de l'utilisateur (car l'achievement n'existe plus)\n    DELETE FROM user_achievements \n    WHERE user_id = user_record.user_id \n      AND achievement_type = p_achievement_key;\n    \n    -- Créer un événement de correction pour traçabilité\n    INSERT INTO xp_events (\n      user_id,\n      source_type,\n      action_type,\n      xp_delta,\n      xp_before,\n      xp_after,\n      level_before,\n      level_after,\n      metadata\n    ) VALUES (\n      user_record.user_id,\n      'admin',\n      'achievement_removal',\n      -xp_to_remove,\n      user_current_xp,\n      new_xp,\n      user_current_level,\n      new_level,\n      jsonb_build_object(\n        'reason', p_reason,\n        'removed_achievement', p_achievement_key,\n        'original_xp_reward', xp_to_remove,\n        'auto_correction', true,\n        'removal_date', NOW()\n      )\n    );\n    \n    -- Retourner les informations pour le log\n    user_id := user_record.user_id;\n    xp_removed := xp_to_remove;\n    new_total_xp := new_xp;\n    new_level := new_level;\n    RETURN NEXT;\n    \n    RAISE NOTICE 'Achievement XP corrected for user %: -% XP (% -> %), level % -> %', \n      user_record.user_id, xp_to_remove, user_current_xp, new_xp, user_current_level, new_level;\n      \n  END LOOP;\n  \n  RETURN;\nEND;\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_user_course_progress",
    "arguments": "user_id_param uuid, course_id_param uuid",
    "function_definition": "CREATE OR REPLACE FUNCTION public.get_user_course_progress(user_id_param uuid, course_id_param uuid)\n RETURNS TABLE(course_id uuid, total_lessons integer, completed_lessons integer, completion_percentage numeric)\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public', 'auth'\nAS $function$\r\nBEGIN\r\n  RETURN QUERY\r\n  SELECT \r\n    c.id,\r\n    COUNT(l.id)::INTEGER as total_lessons,\r\n    COUNT(CASE WHEN up.status = 'completed' THEN 1 END)::INTEGER as completed_lessons,\r\n    ROUND(\r\n      (COUNT(CASE WHEN up.status = 'completed' THEN 1 END) * 100.0 / \r\n       NULLIF(COUNT(l.id), 0))::DECIMAL, 2\r\n    ) as completion_percentage\r\n  FROM courses c\r\n  JOIN modules m ON m.course_id = c.id\r\n  JOIN lessons l ON l.module_id = m.id\r\n  LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = user_id_param\r\n  WHERE c.id = course_id_param\r\n  GROUP BY c.id;\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "update_user_profile",
    "arguments": "p_user_id uuid, p_profile_data jsonb",
    "function_definition": "CREATE OR REPLACE FUNCTION public.update_user_profile(p_user_id uuid, p_profile_data jsonb)\n RETURNS TABLE(id uuid, email character varying, full_name text, avatar_url text, phone text, profession text, company text, level integer, xp integer, current_streak integer, is_admin boolean, last_completed_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone)\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\r\n  BEGIN\r\n    -- Mettre à jour le profil\r\n    UPDATE profiles\r\n    SET\r\n      full_name = COALESCE(p_profile_data->>'full_name', profiles.full_name),\r\n      avatar_url = COALESCE(p_profile_data->>'avatar_url', profiles.avatar_url),\r\n      phone = COALESCE(p_profile_data->>'phone', profiles.phone),\r\n      profession = COALESCE(p_profile_data->>'profession', profiles.profession),\r\n      company = COALESCE(p_profile_data->>'company', profiles.company),\r\n      updated_at = CURRENT_TIMESTAMP\r\n    WHERE profiles.id = p_user_id;\r\n\r\n    -- Retourner le profil mis à jour\r\n    RETURN QUERY\r\n    SELECT\r\n      prof.id,\r\n      u.email,\r\n      prof.full_name,\r\n      prof.avatar_url,\r\n      prof.phone,\r\n      prof.profession,\r\n      prof.company,\r\n      prof.level,\r\n      prof.xp,\r\n      prof.current_streak,\r\n      prof.is_admin,\r\n      prof.last_completed_at,\r\n      prof.created_at,\r\n      prof.updated_at\r\n    FROM profiles prof\r\n    JOIN auth.users u ON u.id = prof.id\r\n    WHERE prof.id = p_user_id;\r\n  END;\r\n  $function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "is_admin_user",
    "arguments": "",
    "function_definition": "CREATE OR REPLACE FUNCTION public.is_admin_user()\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public', 'auth'\nAS $function$\r\nBEGIN\r\n    -- Utiliser current_setting pour accéder aux claims JWT de manière sécurisée\r\n    RETURN COALESCE(\r\n        (current_setting('request.jwt.claims', true)::json->>'is_admin')::boolean,\r\n        (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'is_admin')::boolean,\r\n        (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role',\r\n        false\r\n    );\r\nEXCEPTION\r\n    WHEN OTHERS THEN\r\n        RETURN false;\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "email_exists",
    "arguments": "search_email text",
    "function_definition": "CREATE OR REPLACE FUNCTION public.email_exists(search_email text)\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\r\nBEGIN\r\n  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = search_email);\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "update_user_settings",
    "arguments": "settings_data jsonb, user_id uuid DEFAULT auth.uid()",
    "function_definition": "CREATE OR REPLACE FUNCTION public.update_user_settings(settings_data jsonb, user_id uuid DEFAULT auth.uid())\n RETURNS TABLE(notification_settings jsonb, privacy_settings jsonb, learning_preferences jsonb)\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  RETURN QUERY\r\n  INSERT INTO user_settings(user_id, notification_settings, privacy_settings, learning_preferences)\r\n  VALUES (\r\n    user_id,\r\n    COALESCE(settings_data->'notification_settings', '{}'::jsonb),\r\n    COALESCE(settings_data->'privacy_settings', '{}'::jsonb),\r\n    COALESCE(settings_data->'learning_preferences', '{}'::jsonb)\r\n  )\r\n  ON CONFLICT (user_id) DO UPDATE\r\n    SET notification_settings = COALESCE(settings_data->'notification_settings', user_settings.notification_settings),\r\n        privacy_settings = COALESCE(settings_data->'privacy_settings', user_settings.privacy_settings),\r\n        learning_preferences = COALESCE(settings_data->'learning_preferences', user_settings.learning_preferences),\r\n        updated_at = CURRENT_TIMESTAMP\r\n  RETURNING\r\n    user_settings.notification_settings AS notification_settings,\r\n    user_settings.privacy_settings AS privacy_settings,\r\n    user_settings.learning_preferences AS learning_preferences;\r\nEND;\r\n$function$\n"
  },
  {
    "schema_name": "public",
    "function_name": "get_user_settings",
    "arguments": "user_id uuid DEFAULT auth.uid()",
    "function_definition": "CREATE OR REPLACE FUNCTION public.get_user_settings(user_id uuid DEFAULT auth.uid())\n RETURNS TABLE(notification_settings jsonb, privacy_settings jsonb, learning_preferences jsonb)\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  RETURN QUERY\r\n  SELECT\r\n    us.notification_settings AS notification_settings,\r\n    us.privacy_settings AS privacy_settings,\r\n    us.learning_preferences AS learning_preferences\r\n    FROM user_settings AS us\r\n    WHERE us.user_id = get_user_settings.user_id;\r\nEND;\r\n$function$\n"
  }
]

## 7. Types Personnalisés (ENUMs)

[
  {
    "schema_name": "public",
    "enum_name": "lesson_type",
    "enum_values": "{video,text,quiz,exercise}"
  },
  {
    "schema_name": "public",
    "enum_name": "progress_status",
    "enum_values": "{not_started,in_progress,completed}"
  },
  {
    "schema_name": "public",
    "enum_name": "rgpd_request_status",
    "enum_values": "{pending,processing,completed,rejected}"
  },
  {
    "schema_name": "public",
    "enum_name": "rgpd_request_type",
    "enum_values": "{access,deletion,rectification}"
  },
  {
    "schema_name": "public",
    "enum_name": "user_role_type",
    "enum_values": "{admin,instructor,student}"
  }
]

## 8. Déclencheurs (Triggers)

[
  {
    "trigger_name": "on_profile_created",
    "table_name": "profiles",
    "event": "INSERT",
    "timing": "AFTER",
    "action": "EXECUTE FUNCTION create_user_settings()"
  },
  {
    "trigger_name": "profiles_updated_at",
    "table_name": "profiles",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "user_settings_updated_at",
    "table_name": "user_settings",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "courses_updated_at",
    "table_name": "courses",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "modules_updated_at",
    "table_name": "modules",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "lessons_updated_at",
    "table_name": "lessons",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "user_progress_updated_at",
    "table_name": "user_progress",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION handle_updated_at()"
  },
  {
    "trigger_name": "update_courses_updated_at",
    "table_name": "courses",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_modules_updated_at",
    "table_name": "modules",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_user_notes_updated_at",
    "table_name": "user_notes",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_lessons_updated_at",
    "table_name": "lessons",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "update_user_progress_updated_at",
    "table_name": "user_progress",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "sync_admin_claims_trigger",
    "table_name": "profiles",
    "event": "UPDATE",
    "timing": "AFTER",
    "action": "EXECUTE FUNCTION sync_user_admin_claims()"
  },
  {
    "trigger_name": "update_level_definitions_updated_at",
    "table_name": "level_definitions",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "trigger_name": "achievement_xp_auto_trigger",
    "table_name": "user_achievements",
    "event": "INSERT",
    "timing": "AFTER",
    "action": "EXECUTE FUNCTION trigger_achievement_xp()"
  },
  {
    "trigger_name": "xp_source_removal_trigger",
    "table_name": "xp_sources",
    "event": "DELETE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION trigger_xp_source_removal()"
  },
  {
    "trigger_name": "xp_source_removal_trigger",
    "table_name": "xp_sources",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION trigger_xp_source_removal()"
  },
  {
    "trigger_name": "trigger_user_progress_xp",
    "table_name": "user_progress",
    "event": "INSERT",
    "timing": "AFTER",
    "action": "EXECUTE FUNCTION trigger_lesson_completion_xp()"
  },
  {
    "trigger_name": "trigger_user_progress_xp",
    "table_name": "user_progress",
    "event": "UPDATE",
    "timing": "AFTER",
    "action": "EXECUTE FUNCTION trigger_lesson_completion_xp()"
  },
  {
    "trigger_name": "achievement_removal_trigger",
    "table_name": "achievement_definitions",
    "event": "DELETE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION trigger_achievement_removal()"
  },
  {
    "trigger_name": "achievement_removal_trigger",
    "table_name": "achievement_definitions",
    "event": "UPDATE",
    "timing": "BEFORE",
    "action": "EXECUTE FUNCTION trigger_achievement_removal()"
  }
]
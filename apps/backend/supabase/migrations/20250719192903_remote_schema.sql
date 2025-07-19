

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."achievement_rarity" AS ENUM (
    'common',
    'uncommon',
    'rare',
    'epic',
    'legendary'
);


ALTER TYPE "public"."achievement_rarity" OWNER TO "postgres";


CREATE TYPE "public"."lesson_type" AS ENUM (
    'video',
    'text',
    'quiz',
    'exercise'
);


ALTER TYPE "public"."lesson_type" OWNER TO "postgres";


CREATE TYPE "public"."progress_status" AS ENUM (
    'not_started',
    'in_progress',
    'completed'
);


ALTER TYPE "public"."progress_status" OWNER TO "postgres";


CREATE TYPE "public"."rgpd_request_status" AS ENUM (
    'pending',
    'processing',
    'completed',
    'rejected'
);


ALTER TYPE "public"."rgpd_request_status" OWNER TO "postgres";


CREATE TYPE "public"."rgpd_request_type" AS ENUM (
    'access',
    'deletion',
    'rectification'
);


ALTER TYPE "public"."rgpd_request_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role_type" AS ENUM (
    'admin',
    'instructor',
    'student'
);


ALTER TYPE "public"."user_role_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_default_profile"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  default_name text;
BEGIN
  -- Extract full name from user metadata or use email as fallback
  default_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert the new profile
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    level,
    xp,
    current_streak,
    is_admin,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    default_name,
    1,
    0,
    0,
    false,
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_default_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_user_settings"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  INSERT INTO public.user_settings (
    user_id,
    notification_settings,
    privacy_settings,
    learning_preferences,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    '{"weeklyReport": true, "achievementAlerts": true, "pushNotifications": false, "emailNotifications": true, "reminderNotifications": true}'::jsonb,
    '{"showProgress": false, "allowMessages": false, "showAchievements": true, "profileVisibility": "private"}'::jsonb,
    '{"autoplay": true, "language": "fr", "dailyGoal": 30, "preferredDuration": "medium", "difficultyProgression": "adaptive"}'::jsonb,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the profile creation
    RAISE LOG 'Error creating user settings for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."create_user_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."email_exists"("search_email" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE email = search_email);
END;
$$;


ALTER FUNCTION "public"."email_exists"("search_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_achievement_row_camel_type"() RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "icon" "text", "rarity" "text", "earned" boolean, "userId" "uuid", "xpReward" integer, "createdAt" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- This function is never called, it's just for type generation
  RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN, NULL::UUID, NULL::INTEGER, NULL::TIMESTAMPTZ WHERE FALSE;
END;
$$;


ALTER FUNCTION "public"."get_achievement_row_camel_type"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_achievements_camel"("user_id_param" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("id" "uuid", "title" "text", "description" "text", "icon" "text", "rarity" "text", "earned" boolean, "userId" "uuid", "xpReward" integer, "createdAt" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
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


ALTER FUNCTION "public"."get_achievements_camel"("user_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_course_progress"("user_id_param" "uuid", "course_id_param" "uuid") RETURNS TABLE("course_id" "uuid", "total_lessons" integer, "completed_lessons" integer, "completion_percentage" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    COUNT(l.id)::INTEGER as total_lessons,
    COUNT(CASE WHEN up.status = 'completed' THEN 1 END)::INTEGER as completed_lessons,
    ROUND(
      (COUNT(CASE WHEN up.status = 'completed' THEN 1 END) * 100.0 / 
       NULLIF(COUNT(l.id), 0))::DECIMAL, 2
    ) as completion_percentage
  FROM courses c
  JOIN modules m ON m.course_id = c.id
  JOIN lessons l ON l.module_id = m.id
  LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = user_id_param
  WHERE c.id = course_id_param
  GROUP BY c.id;
END;
$$;


ALTER FUNCTION "public"."get_user_course_progress"("user_id_param" "uuid", "course_id_param" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_settings"("user_id" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("notification_settings" "jsonb", "privacy_settings" "jsonb", "learning_preferences" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    us.notification_settings AS notification_settings,
    us.privacy_settings AS privacy_settings,
    us.learning_preferences AS learning_preferences
    FROM user_settings AS us
    WHERE us.user_id = get_user_settings.user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_settings"("user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin_user"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
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


ALTER FUNCTION "public"."is_admin_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_user_admin_claims"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
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


ALTER FUNCTION "public"."sync_user_admin_claims"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_profile"("profile_data" "jsonb", "user_id" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("id" "uuid", "updated_at" timestamp with time zone, "full_name" "text", "avatar_url" "text", "phone" "text", "profession" "text", "company" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  UPDATE profiles
    SET full_name  = COALESCE(profile_data->>'full_name', full_name),
        avatar_url = COALESCE(profile_data->>'avatar_url', avatar_url),
        phone      = COALESCE(profile_data->>'phone', phone),
        profession = COALESCE(profile_data->>'profession', profession),
        company    = COALESCE(profile_data->>'company', company),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = user_id
    RETURNING profiles.* INTO id, updated_at, full_name, avatar_url, phone, profession, company;
END;
$$;


ALTER FUNCTION "public"."update_user_profile"("profile_data" "jsonb", "user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_settings"("settings_data" "jsonb", "user_id" "uuid" DEFAULT "auth"."uid"()) RETURNS TABLE("notification_settings" "jsonb", "privacy_settings" "jsonb", "learning_preferences" "jsonb")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  INSERT INTO user_settings(user_id, notification_settings, privacy_settings, learning_preferences)
  VALUES (
    user_id,
    COALESCE(settings_data->'notification_settings', '{}'::jsonb),
    COALESCE(settings_data->'privacy_settings', '{}'::jsonb),
    COALESCE(settings_data->'learning_preferences', '{}'::jsonb)
  )
  ON CONFLICT (user_id) DO UPDATE
    SET notification_settings = COALESCE(settings_data->'notification_settings', user_settings.notification_settings),
        privacy_settings = COALESCE(settings_data->'privacy_settings', user_settings.privacy_settings),
        learning_preferences = COALESCE(settings_data->'learning_preferences', user_settings.learning_preferences),
        updated_at = CURRENT_TIMESTAMP
  RETURNING
    user_settings.notification_settings AS notification_settings,
    user_settings.privacy_settings AS privacy_settings,
    user_settings.learning_preferences AS learning_preferences;
END;
$$;


ALTER FUNCTION "public"."update_user_settings"("settings_data" "jsonb", "user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "rarity" "text" DEFAULT 'common'::"text",
    "xp_reward" integer DEFAULT 0,
    "earned" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "achievements_rarity_check" CHECK (("rarity" = ANY (ARRAY['common'::"text", 'uncommon'::"text", 'rare'::"text", 'epic'::"text", 'legendary'::"text"]))),
    CONSTRAINT "achievements_xp_positive" CHECK (("xp_reward" >= 0))
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."achievement_row_camel" AS
 SELECT "id",
    "title",
    "description",
    "icon",
    "rarity",
    "earned",
    "user_id" AS "userId",
    "xp_reward" AS "xpReward",
    "created_at" AS "createdAt"
   FROM "public"."achievements";


ALTER VIEW "public"."achievement_row_camel" OWNER TO "postgres";


COMMENT ON VIEW "public"."achievement_row_camel" IS 'CamelCase view of achievements table for frontend compatibility';



CREATE TABLE IF NOT EXISTS "public"."achievement_row_camel_type" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "rarity" "text",
    "earned" boolean DEFAULT false,
    "userId" "uuid",
    "xpReward" integer DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."achievement_row_camel_type" OWNER TO "postgres";


COMMENT ON TABLE "public"."achievement_row_camel_type" IS 'Type template for AchievementRowCamel - used for TypeScript generation only';



CREATE TABLE IF NOT EXISTS "public"."activity_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "action" "text" NOT NULL,
    "details" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."activity_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coupons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "discount_percent" integer NOT NULL,
    "valid_from" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "valid_to" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "max_uses" integer,
    "current_uses" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."coupons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "slug" "text" NOT NULL,
    "cover_image_url" "text",
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "category" "text",
    "thumbnail_url" "text",
    "difficulty" "text"
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lesson_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lesson_id" "uuid",
    "user_id" "uuid",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "time_spent_minutes" integer,
    "completion_percentage" integer DEFAULT 0,
    "interactions" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."lesson_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "module_id" "uuid",
    "title" "text" NOT NULL,
    "content" "jsonb",
    "lesson_order" integer NOT NULL,
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "duration" integer,
    "type" "public"."lesson_type" DEFAULT 'video'::"public"."lesson_type",
    "video_url" "text",
    "transcript" "text",
    "text_content" "text",
    "resources" "jsonb" DEFAULT '[]'::"jsonb",
    "xp_reward" integer DEFAULT 0,
    CONSTRAINT "lessons_lesson_order_positive" CHECK (("lesson_order" > 0)),
    CONSTRAINT "lessons_resources_valid_json" CHECK (("jsonb_typeof"("resources") = 'array'::"text")),
    CONSTRAINT "lessons_xp_reward_positive" CHECK (("xp_reward" >= 0))
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


COMMENT ON COLUMN "public"."lessons"."type" IS 'Type of lesson: video, text, quiz, or exercise';



COMMENT ON COLUMN "public"."lessons"."video_url" IS 'URL to video file for video lessons';



COMMENT ON COLUMN "public"."lessons"."transcript" IS 'Video transcript or text content';



COMMENT ON COLUMN "public"."lessons"."text_content" IS 'Rich text content for text lessons';



COMMENT ON COLUMN "public"."lessons"."resources" IS 'JSON array of lesson resources (files, links, etc.)';



COMMENT ON COLUMN "public"."lessons"."xp_reward" IS 'XP points awarded for completing this lesson';



CREATE TABLE IF NOT EXISTS "public"."media_files" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "filename" "text" NOT NULL,
    "original_name" "text" NOT NULL,
    "file_type" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "storage_path" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."media_files" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."modules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "course_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "module_order" integer NOT NULL,
    "is_published" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "modules_module_order_positive" CHECK (("module_order" > 0))
);


ALTER TABLE "public"."modules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "email" "text" NOT NULL,
    "level" integer DEFAULT 1,
    "xp" integer DEFAULT 0,
    "current_streak" integer DEFAULT 0,
    "last_completed_at" timestamp with time zone,
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "phone" "text",
    "profession" "text",
    "company" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rgpd_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."rgpd_request_type" NOT NULL,
    "status" "public"."rgpd_request_status" DEFAULT 'pending'::"public"."rgpd_request_status" NOT NULL,
    "details" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone
);


ALTER TABLE "public"."rgpd_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "lesson_id" "uuid",
    "status" "text" DEFAULT 'not_started'::"text",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_progress_status_check" CHECK (("status" = ANY (ARRAY['not_started'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."user_progress" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."user_course_progress" AS
 SELECT "c"."id",
    "c"."title",
    "c"."description",
    "c"."slug",
    "c"."cover_image_url",
    "c"."thumbnail_url",
    "c"."category",
    "c"."difficulty",
    "c"."is_published",
    "c"."created_at",
    "c"."updated_at",
    COALESCE("progress_data"."user_id", "auth"."uid"()) AS "user_id",
    COALESCE("progress_data"."total_lessons", (0)::bigint) AS "total_lessons",
    COALESCE("progress_data"."completed_lessons", (0)::bigint) AS "completed_lessons",
    COALESCE("progress_data"."completion_percentage", (0)::double precision) AS "completion_percentage",
    "progress_data"."last_activity_at",
    "jsonb_build_object"('completed', COALESCE("progress_data"."completed_lessons", (0)::bigint), 'total', COALESCE("progress_data"."total_lessons", (0)::bigint), 'percentage', COALESCE("progress_data"."completion_percentage", (0)::double precision), 'lastActivityAt', "progress_data"."last_activity_at", 'status', COALESCE("progress_data"."status", 'not_started'::"text")) AS "progress"
   FROM ("public"."courses" "c"
     LEFT JOIN ( SELECT "m"."course_id",
            "count"("l"."id") AS "total_lessons",
            "count"(
                CASE
                    WHEN ("up"."status" = 'completed'::"text") THEN 1
                    ELSE NULL::integer
                END) AS "completed_lessons",
            "round"(
                CASE
                    WHEN ("count"("l"."id") > 0) THEN ((("count"(
                    CASE
                        WHEN ("up"."status" = 'completed'::"text") THEN 1
                        ELSE NULL::integer
                    END))::double precision / ("count"("l"."id"))::double precision) * (100)::double precision)
                    ELSE (0)::double precision
                END) AS "completion_percentage",
            "max"("up"."updated_at") AS "last_activity_at",
            "up"."user_id",
                CASE
                    WHEN ("count"(
                    CASE
                        WHEN ("up"."status" = 'completed'::"text") THEN 1
                        ELSE NULL::integer
                    END) = 0) THEN 'not_started'::"text"
                    WHEN ("count"(
                    CASE
                        WHEN ("up"."status" = 'completed'::"text") THEN 1
                        ELSE NULL::integer
                    END) = "count"("l"."id")) THEN 'completed'::"text"
                    ELSE 'in_progress'::"text"
                END AS "status"
           FROM (("public"."modules" "m"
             JOIN "public"."lessons" "l" ON (("l"."module_id" = "m"."id")))
             LEFT JOIN "public"."user_progress" "up" ON ((("up"."lesson_id" = "l"."id") AND ("up"."user_id" = "auth"."uid"()))))
          WHERE (("m"."is_published" = true) AND ("l"."is_published" = true))
          GROUP BY "m"."course_id", "up"."user_id") "progress_data" ON (("progress_data"."course_id" = "c"."id")))
  WHERE ("c"."is_published" = true);


ALTER VIEW "public"."user_course_progress" OWNER TO "postgres";


COMMENT ON VIEW "public"."user_course_progress" IS 'Provides courses with user-specific progress data. Shows completion percentage, total/completed lessons, and last activity for the authenticated user.';



CREATE TABLE IF NOT EXISTS "public"."user_notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lesson_id" "uuid",
    "content" "text" NOT NULL,
    "selected_text" "text",
    "position" "jsonb" DEFAULT '{}'::"jsonb",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "is_private" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "ended_at" timestamp with time zone,
    "duration_minutes" integer,
    "pages_visited" "text"[],
    "device_info" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notification_settings" "jsonb" DEFAULT '{"weeklyReport": true, "achievementAlerts": true, "pushNotifications": false, "emailNotifications": true, "reminderNotifications": true}'::"jsonb",
    "privacy_settings" "jsonb" DEFAULT '{"showProgress": false, "allowMessages": false, "showAchievements": true, "profileVisibility": "private"}'::"jsonb",
    "learning_preferences" "jsonb" DEFAULT '{"autoplay": true, "language": "fr", "dailyGoal": 30, "preferredDuration": "medium", "difficultyProgression": "adaptive"}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievement_row_camel_type"
    ADD CONSTRAINT "achievement_row_camel_type_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."lesson_analytics"
    ADD CONSTRAINT "lesson_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media_files"
    ADD CONSTRAINT "media_files_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."media_files"
    ADD CONSTRAINT "media_files_storage_path_key" UNIQUE ("storage_path");



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rgpd_requests"
    ADD CONSTRAINT "rgpd_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_notes"
    ADD CONSTRAINT "user_notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_lesson_id_key" UNIQUE ("user_id", "lesson_id");



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_lesson_unique" UNIQUE ("user_id", "lesson_id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_achievements_earned" ON "public"."achievements" USING "btree" ("earned");



CREATE INDEX "idx_achievements_rarity" ON "public"."achievements" USING "btree" ("rarity");



CREATE INDEX "idx_achievements_user_id" ON "public"."achievements" USING "btree" ("user_id");



CREATE INDEX "idx_activity_log_created_at" ON "public"."activity_log" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_activity_log_type" ON "public"."activity_log" USING "btree" ("type");



CREATE INDEX "idx_activity_log_user_id" ON "public"."activity_log" USING "btree" ("user_id");



CREATE INDEX "idx_courses_category" ON "public"."courses" USING "btree" ("category");



CREATE INDEX "idx_courses_difficulty" ON "public"."courses" USING "btree" ("difficulty");



CREATE INDEX "idx_courses_is_published" ON "public"."courses" USING "btree" ("is_published");



CREATE INDEX "idx_courses_published" ON "public"."courses" USING "btree" ("is_published") WHERE ("is_published" = true);



CREATE INDEX "idx_courses_slug" ON "public"."courses" USING "btree" ("slug");



CREATE INDEX "idx_lesson_analytics_completed_at" ON "public"."lesson_analytics" USING "btree" ("completed_at");



CREATE INDEX "idx_lesson_analytics_lesson_id" ON "public"."lesson_analytics" USING "btree" ("lesson_id");



CREATE INDEX "idx_lesson_analytics_user_id" ON "public"."lesson_analytics" USING "btree" ("user_id");



CREATE INDEX "idx_lessons_is_published" ON "public"."lessons" USING "btree" ("is_published");



CREATE INDEX "idx_lessons_module_id" ON "public"."lessons" USING "btree" ("module_id");



CREATE INDEX "idx_lessons_module_order" ON "public"."lessons" USING "btree" ("module_id", "lesson_order");



CREATE INDEX "idx_lessons_order" ON "public"."lessons" USING "btree" ("lesson_order");



CREATE INDEX "idx_lessons_published" ON "public"."lessons" USING "btree" ("is_published") WHERE ("is_published" = true);



CREATE INDEX "idx_lessons_type" ON "public"."lessons" USING "btree" ("type");



CREATE INDEX "idx_lessons_xp_reward" ON "public"."lessons" USING "btree" ("xp_reward");



CREATE INDEX "idx_modules_course_id" ON "public"."modules" USING "btree" ("course_id");



CREATE INDEX "idx_modules_course_order" ON "public"."modules" USING "btree" ("course_id", "module_order");



CREATE INDEX "idx_modules_is_published" ON "public"."modules" USING "btree" ("is_published");



CREATE INDEX "idx_modules_order" ON "public"."modules" USING "btree" ("module_order");



CREATE INDEX "idx_modules_published" ON "public"."modules" USING "btree" ("is_published") WHERE ("is_published" = true);



CREATE INDEX "idx_profiles_admin" ON "public"."profiles" USING "btree" ("is_admin") WHERE ("is_admin" = true);



CREATE INDEX "idx_profiles_created_at" ON "public"."profiles" USING "btree" ("created_at");



CREATE INDEX "idx_profiles_email" ON "public"."profiles" USING "btree" ("email");



CREATE INDEX "idx_profiles_user_id" ON "public"."profiles" USING "btree" ("id");



CREATE INDEX "idx_rgpd_requests_created_at" ON "public"."rgpd_requests" USING "btree" ("created_at");



CREATE INDEX "idx_rgpd_requests_status" ON "public"."rgpd_requests" USING "btree" ("status");



CREATE INDEX "idx_rgpd_requests_user_id" ON "public"."rgpd_requests" USING "btree" ("user_id");



CREATE INDEX "idx_user_notes_is_private" ON "public"."user_notes" USING "btree" ("is_private");



CREATE INDEX "idx_user_notes_lesson_id" ON "public"."user_notes" USING "btree" ("lesson_id");



CREATE INDEX "idx_user_notes_user_id" ON "public"."user_notes" USING "btree" ("user_id");



CREATE INDEX "idx_user_progress_completed_at" ON "public"."user_progress" USING "btree" ("completed_at");



CREATE INDEX "idx_user_progress_lesson_id" ON "public"."user_progress" USING "btree" ("lesson_id");



CREATE INDEX "idx_user_progress_status" ON "public"."user_progress" USING "btree" ("status");



CREATE INDEX "idx_user_progress_status_updated" ON "public"."user_progress" USING "btree" ("status", "updated_at");



CREATE INDEX "idx_user_progress_user_id" ON "public"."user_progress" USING "btree" ("user_id");



CREATE INDEX "idx_user_progress_user_lesson" ON "public"."user_progress" USING "btree" ("user_id", "lesson_id");



CREATE INDEX "idx_user_settings_user_id" ON "public"."user_settings" USING "btree" ("user_id");



CREATE INDEX "lesson_analytics_lesson_user_idx" ON "public"."lesson_analytics" USING "btree" ("lesson_id", "user_id");



CREATE INDEX "lesson_analytics_started_at_idx" ON "public"."lesson_analytics" USING "btree" ("started_at");



CREATE INDEX "media_files_created_at_idx" ON "public"."media_files" USING "btree" ("created_at");



CREATE INDEX "media_files_user_id_idx" ON "public"."media_files" USING "btree" ("user_id");



CREATE INDEX "user_notes_created_at_idx" ON "public"."user_notes" USING "btree" ("created_at");



CREATE INDEX "user_notes_lesson_id_idx" ON "public"."user_notes" USING "btree" ("lesson_id");



CREATE INDEX "user_notes_user_id_idx" ON "public"."user_notes" USING "btree" ("user_id");



CREATE INDEX "user_sessions_started_at_idx" ON "public"."user_sessions" USING "btree" ("started_at");



CREATE INDEX "user_sessions_user_id_idx" ON "public"."user_sessions" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "achievements_updated_at" BEFORE UPDATE ON "public"."achievements" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "courses_updated_at" BEFORE UPDATE ON "public"."courses" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "lessons_updated_at" BEFORE UPDATE ON "public"."lessons" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "modules_updated_at" BEFORE UPDATE ON "public"."modules" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "on_profile_created" AFTER INSERT ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."create_user_settings"();



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "rgpd_requests_updated_at" BEFORE UPDATE ON "public"."rgpd_requests" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "sync_admin_claims_trigger" AFTER UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."sync_user_admin_claims"();



CREATE OR REPLACE TRIGGER "update_courses_updated_at" BEFORE UPDATE ON "public"."courses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_lessons_updated_at" BEFORE UPDATE ON "public"."lessons" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_modules_updated_at" BEFORE UPDATE ON "public"."modules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_notes_updated_at" BEFORE UPDATE ON "public"."user_notes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_progress_updated_at" BEFORE UPDATE ON "public"."user_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_settings_updated_at" BEFORE UPDATE ON "public"."user_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "user_progress_updated_at" BEFORE UPDATE ON "public"."user_progress" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "user_settings_updated_at" BEFORE UPDATE ON "public"."user_settings" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "achievements_user_id_fkey" ON "public"."achievements" IS 'Ensures achievements belong to valid users and are deleted when user is deleted';



ALTER TABLE ONLY "public"."activity_log"
    ADD CONSTRAINT "activity_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "activity_log_user_id_fkey" ON "public"."activity_log" IS 'Ensures activity logs belong to valid users and are deleted when user is deleted';



ALTER TABLE ONLY "public"."lesson_analytics"
    ADD CONSTRAINT "lesson_analytics_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "lesson_analytics_lesson_id_fkey" ON "public"."lesson_analytics" IS 'Ensures lesson analytics reference valid lessons and are deleted when lesson is deleted';



ALTER TABLE ONLY "public"."lesson_analytics"
    ADD CONSTRAINT "lesson_analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "lesson_analytics_user_id_fkey" ON "public"."lesson_analytics" IS 'Ensures lesson analytics belong to valid users and are deleted when user is deleted';



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."media_files"
    ADD CONSTRAINT "media_files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



COMMENT ON CONSTRAINT "media_files_user_id_fkey" ON "public"."media_files" IS 'Ensures media files belong to valid users and are deleted when user is deleted';



ALTER TABLE ONLY "public"."modules"
    ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."rgpd_requests"
    ADD CONSTRAINT "rgpd_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notes"
    ADD CONSTRAINT "user_notes_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_notes"
    ADD CONSTRAINT "user_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_progress"
    ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all achievements" ON "public"."achievements" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage all activity records" ON "public"."activity_log" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage all media" ON "public"."media_files" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage all progress" ON "public"."user_progress" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage all requests" ON "public"."rgpd_requests" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage coupons" ON "public"."coupons" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage courses" ON "public"."courses" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage lessons" ON "public"."lessons" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can manage modules" ON "public"."modules" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can view all activity records" ON "public"."activity_log" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can view all analytics" ON "public"."lesson_analytics" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can view all settings" ON "public"."user_settings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Admins can view all user progress" ON "public"."user_progress" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Anyone can view active coupons" ON "public"."coupons" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Enable read access for modules" ON "public"."modules" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."courses" "c"
  WHERE (("c"."id" = "modules"."course_id") AND ("c"."is_published" = true)))));



CREATE POLICY "Les cours publiés sont visibles par tous." ON "public"."courses" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Les leçons des cours publiés sont visibles par tous." ON "public"."lessons" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Les leçons publiées sont visibles par tous." ON "public"."lessons" FOR SELECT USING (("is_published" = true));



CREATE POLICY "Les modules des cours publiés sont visibles par tous." ON "public"."modules" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."courses"
  WHERE (("courses"."id" = "modules"."course_id") AND ("courses"."is_published" = true)))));



CREATE POLICY "Only admins can manage coupons" ON "public"."coupons" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true)))));



CREATE POLICY "Published courses are viewable by everyone" ON "public"."courses" FOR SELECT USING ((("is_published" = true) OR ("is_published" IS NULL)));



CREATE POLICY "Published lessons are viewable by everyone" ON "public"."lessons" FOR SELECT USING ((("is_published" = true) OR ("is_published" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Published modules are viewable by everyone" ON "public"."modules" FOR SELECT USING ((("is_published" = true) OR ("is_published" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can create their own requests" ON "public"."rgpd_requests" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own activity records" ON "public"."activity_log" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own achievements" ON "public"."achievements" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own analytics" ON "public"."lesson_analytics" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can insert their own progress" ON "public"."user_progress" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can insert their own sessions" ON "public"."user_sessions" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can insert their own settings" ON "public"."user_settings" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own notes" ON "public"."user_notes" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage their own progress" ON "public"."user_progress" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own settings" ON "public"."user_settings" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can read modules" ON "public"."modules" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Users can read own activity records" ON "public"."activity_log" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own settings" ON "public"."user_settings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own settings" ON "public"."user_settings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own achievements" ON "public"."achievements" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own analytics" ON "public"."lesson_analytics" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own media" ON "public"."media_files" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own progress" ON "public"."user_progress" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own sessions" ON "public"."user_sessions" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own settings" ON "public"."user_settings" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can upload their own media" ON "public"."media_files" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can view public media" ON "public"."media_files" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Users can view public notes" ON "public"."user_notes" FOR SELECT USING ((("is_private" = false) OR (("auth"."uid"())::"text" = ("user_id")::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can view their own achievements" ON "public"."achievements" FOR SELECT USING (((("auth"."uid"())::"text" = ("user_id")::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can view their own analytics" ON "public"."lesson_analytics" FOR SELECT USING (((("auth"."uid"())::"text" = ("user_id")::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can view their own media" ON "public"."media_files" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can view their own progress" ON "public"."user_progress" FOR SELECT USING (((("auth"."uid"())::"text" = ("user_id")::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can view their own requests" ON "public"."rgpd_requests" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own sessions" ON "public"."user_sessions" FOR SELECT USING (((("auth"."uid"())::"text" = ("user_id")::"text") OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."is_admin" = true))))));



CREATE POLICY "Users can view their own settings" ON "public"."user_settings" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."activity_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "allow note owner delete" ON "public"."user_notes" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "allow note owner insert" ON "public"."user_notes" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "allow note owner read" ON "public"."user_notes" FOR SELECT USING ((("user_id" = "auth"."uid"()) OR ("is_private" = false)));



CREATE POLICY "allow note owner update" ON "public"."user_notes" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "analytics_owner_delete" ON "public"."lesson_analytics" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "analytics_owner_insert" ON "public"."lesson_analytics" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "analytics_owner_select" ON "public"."lesson_analytics" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "analytics_owner_update" ON "public"."lesson_analytics" FOR UPDATE USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."coupons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "courses_admin_full_access" ON "public"."courses" TO "authenticated" USING (((COALESCE(((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'is_admin'::"text"))::boolean, (((("current_setting"('request.jwt.claims'::"text", true))::json -> 'user_metadata'::"text") ->> 'is_admin'::"text"))::boolean, false) = true) OR ((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "courses_public_read" ON "public"."courses" FOR SELECT TO "authenticated" USING (("is_published" = true));



ALTER TABLE "public"."lesson_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "lessons_admin_full_access" ON "public"."lessons" TO "authenticated" USING (((COALESCE(((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'is_admin'::"text"))::boolean, (((("current_setting"('request.jwt.claims'::"text", true))::json -> 'user_metadata'::"text") ->> 'is_admin'::"text"))::boolean, false) = true) OR ((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "lessons_public_read" ON "public"."lessons" FOR SELECT TO "authenticated" USING (("is_published" = true));



ALTER TABLE "public"."media_files" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."modules" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "modules_admin_full_access" ON "public"."modules" TO "authenticated" USING (((COALESCE(((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'is_admin'::"text"))::boolean, (((("current_setting"('request.jwt.claims'::"text", true))::json -> 'user_metadata'::"text") ->> 'is_admin'::"text"))::boolean, false) = true) OR ((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "modules_public_read" ON "public"."modules" FOR SELECT TO "authenticated" USING (("is_published" = true));



CREATE POLICY "owner delete" ON "public"."media_files" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "owner insert" ON "public"."media_files" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "owner update" ON "public"."media_files" FOR UPDATE USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_admins_full_access" ON "public"."profiles" TO "authenticated" USING (((COALESCE(((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'is_admin'::"text"))::boolean, (((("current_setting"('request.jwt.claims'::"text", true))::json -> 'user_metadata'::"text") ->> 'is_admin'::"text"))::boolean, false) = true) OR ((("current_setting"('request.jwt.claims'::"text", true))::json ->> 'role'::"text") = 'service_role'::"text")));



CREATE POLICY "profiles_users_insert_own" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_users_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_users_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "public or owner read" ON "public"."media_files" FOR SELECT USING (("is_public" OR ("user_id" = "auth"."uid"())));



ALTER TABLE "public"."rgpd_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "session_owner_delete" ON "public"."user_sessions" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "session_owner_insert" ON "public"."user_sessions" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "session_owner_select" ON "public"."user_sessions" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "session_owner_update" ON "public"."user_sessions" FOR UPDATE USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."user_notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_insert_own_profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users_can_update_own_profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "users_can_view_own_profile" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "id"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."create_default_profile"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_default_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_default_profile"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user_settings"() TO "service_role";



GRANT ALL ON FUNCTION "public"."email_exists"("search_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_achievement_row_camel_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_achievement_row_camel_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_achievement_row_camel_type"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_achievements_camel"("user_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_achievements_camel"("user_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_achievements_camel"("user_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_course_progress"("user_id_param" "uuid", "course_id_param" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_course_progress"("user_id_param" "uuid", "course_id_param" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_course_progress"("user_id_param" "uuid", "course_id_param" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_settings"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_settings"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_settings"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user_admin_claims"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user_admin_claims"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user_admin_claims"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_profile"("profile_data" "jsonb", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_profile"("profile_data" "jsonb", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_profile"("profile_data" "jsonb", "user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_settings"("settings_data" "jsonb", "user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_settings"("settings_data" "jsonb", "user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_settings"("settings_data" "jsonb", "user_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."achievement_row_camel" TO "anon";
GRANT ALL ON TABLE "public"."achievement_row_camel" TO "authenticated";
GRANT ALL ON TABLE "public"."achievement_row_camel" TO "service_role";



GRANT ALL ON TABLE "public"."achievement_row_camel_type" TO "anon";
GRANT ALL ON TABLE "public"."achievement_row_camel_type" TO "authenticated";
GRANT ALL ON TABLE "public"."achievement_row_camel_type" TO "service_role";



GRANT ALL ON TABLE "public"."activity_log" TO "anon";
GRANT ALL ON TABLE "public"."activity_log" TO "authenticated";
GRANT ALL ON TABLE "public"."activity_log" TO "service_role";



GRANT ALL ON TABLE "public"."coupons" TO "anon";
GRANT ALL ON TABLE "public"."coupons" TO "authenticated";
GRANT ALL ON TABLE "public"."coupons" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."lesson_analytics" TO "anon";
GRANT ALL ON TABLE "public"."lesson_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."lesson_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."media_files" TO "anon";
GRANT ALL ON TABLE "public"."media_files" TO "authenticated";
GRANT ALL ON TABLE "public"."media_files" TO "service_role";



GRANT ALL ON TABLE "public"."modules" TO "anon";
GRANT ALL ON TABLE "public"."modules" TO "authenticated";
GRANT ALL ON TABLE "public"."modules" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."rgpd_requests" TO "anon";
GRANT ALL ON TABLE "public"."rgpd_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."rgpd_requests" TO "service_role";



GRANT ALL ON TABLE "public"."user_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_course_progress" TO "anon";
GRANT ALL ON TABLE "public"."user_course_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."user_course_progress" TO "service_role";



GRANT ALL ON TABLE "public"."user_notes" TO "anon";
GRANT ALL ON TABLE "public"."user_notes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_notes" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;

# AI Foundations — Schéma Backend par Domaines (LMS + IA + Gamification)
_Last updated: 2025-08-22 • Scope: modèle cible prêt à scaler (1M+ users) • Supabase/Postgres 16_

> Objectif : fondations propres, normalisées, sans doublons, RLS stricte, RBAC fin (aucun `is_admin`), gamification avancée, IA/assistant, communauté (posts/commentaires/likes), monétisation, analytics, conformité.

---

## Conventions globales (non négociables)
- **PK**: `id UUID DEFAULT gen_random_uuid()` • **Horodatage UTC**: `created_at timestamptz DEFAULT timezone('UTC', now())`, `updated_at timestamptz` + trigger `util.set_updated_at()`.
- **Noms**: tables/colonnes `snake_case` pluriel • FK: `<ref>_id` • Contraintes: `ck_*`, `uq_*`, `fk_*` • Index: `idx_*` • Triggers: `trg_<table>_<action>`.
- **RLS**: activée partout. Lecture/écriture par l’utilisateur sur ses lignes (`user_id = auth.uid()`), anonymes lecture limitée contenu **publié**, surcouche RBAC via `rbac.has_permission()`.
- **Partitions mensuelles** pour gros journaux: `gamification.xp_events_*`, `analytics.*`, `ai.assistant_messages_*`.
- **Zéro hardcoding** métier en SQL: règles dans tables de config (XP, accès, IA policies).

---

## 1) `public` — Identité & Profil
- **profiles** — fiche user (UUID=auth.users.id), `username` unique, `email`, `display_name`, `avatar_url`, `locale`, `time_zone`. _Pas d’XP/level ici._
- **user_settings** — préférences (`notification_settings`, `privacy_settings`, `learning_preferences` JSONB).
- **profile_links** — liens publics (site, X, LinkedIn) par user.
- **user_consents** — consentements (clé, bool, horodatage, source).

> Vue: **public.user_stats** (joint `gamification.user_xp`) → `total_xp`, `current_level`, `xp_to_next`, `last_xp_event_at`.

---

## 2) `rbac` — Rôles & Permissions fines (aucun `is_admin`)
- **roles** — rôles globaux: `admin`, `moderator`, `premium_member`, `member`, `visitor`, … (extensible).
- **permissions** — granularités (ex: `course.create`, `lesson.publish`, `comment.moderate`, `ai.use_assistant`).
- **role_permissions** — M:N rôle→permission (versionnable).
- **user_roles** — M:N user→rôle (global), avec `assigned_by`, `reason`.
- **role_grants_log** — audit trail (qui, quoi, quand, pourquoi).
- **fn**: `has_role(user_id, role_name)`, `has_permission(user_id, perm_name)` (SECURITY DEFINER).

---

## 3) `content` — Catalogue pédagogique
- **courses** — `slug` UNIQUE, titre, description, catégorie, difficulté (`beginner|intermediate|advanced`), `is_published`, `access_tier` (`free|member|premium|paid_oneoff`), `published_at`, `created_by`.
- **modules** — FK `course_id`, `module_order` > 0, `title`, `is_published`, UQ(`course_id`,`module_order`).
- **lessons** — FK `module_id`, `lesson_order` > 0, `type` (`video|article|quiz|project`), `duration_sec`, `content` JSONB, `resources` JSONB, `transcript`, `is_published`, UQ(`module_id`,`lesson_order`).
- **prerequisites** — prérequis (course↔course, lesson↔lesson) via `(source_type, source_id) -> (target_type, target_id)`.
- **tags**, **course_tags** — taxonomie.
- **attachments** — pièces jointes liées (FK `media.files`).

---

## 4) `learn` — Progression & Pédagogie
- **user_progress** — UNIQUE(`user_id`,`lesson_id`), `status` (`not_started|in_progress|completed`), `completed_at`, CK(`completed_at` non NULL si `completed`).
- **lesson_analytics** — temps cumulé, `last_position_sec`, interactions JSONB (événements player/quiz).
- **assessments** — évaluations (scope: lesson/course), barèmes.
- **assessment_items** — questions (QCM/texte/codage).
- **user_assessment_attempts** — tentatives, score, feedback.
- **certificates** — délivrance, métadonnées, `verify_hash`.

> Vue: **learn.course_progress** (`user_id`, `course_id`) → total/completed/percent/last_activity_at.

---

## 5) `access` — Règles d’accès & Entitlements
- **tiers** — définitions: `free`, `member`, `premium_member`, `paid_oneoff`.
- **course_access_rules** — exigence par cours (tier requis ou produit Stripe).
- **lesson_access_overrides** — exceptions (p.ex. 1–2 leçons gratuites dans un cours payant).
- **user_entitlements** — droits effectifs consolidés (projections billing/referrals/tests).
- **(vue)** `effective_access` — “peut-il voir/faire X ?” (user×course/lesson).

---

## 6) `billing` — Monétisation & Payouts
- **products**, **prices** — miroir Stripe (idempotent).
- **subscriptions** — status, `current_period_end`, cancel policy.
- **one_off_purchases** — achats à vie (cours/bundles).
- **coupons**, **promo_redemptions** — promotions.
- **webhook_events** — outbox Stripe signée (rejouable).
- **payout_accounts** — comptes ambassadeurs (Stripe Connect).
- **payout_ledger**, **payouts** — écritures/versements commissions.

---

## 7) `referrals` — Parrainage/Ambassadeurs
- **programs** — règles: commission %, lock windows, cooldown, cap mensuel.
- **links** — liens/code de parrainage, UTM.
- **invites** — invitations envoyées (email/device/fingerprint).
- **conversions** — attribution (signup/achat/1er paiement), délai de validation.
- **rewards** — droits générés (vers `billing.payout_ledger`).
- **fraud_flags** — signaux (IP, device, multi-comptes) + décisions.

---

## 8) `gamification` — XP, Niveaux, Quêtes, Social
- **level_definitions** — XP requis croissant, CK de monotonie.
- **xp_sources** — règles (source_type, action_type, version, `xp_value`, `cooldown_sec`, période `valid_from/valid_to`, `metadata`).
- **xp_events_YYYYMM** — **partition mensuelle**, append-only, `idempotency_key` UNIQUE, CK `xp_after = xp_before + xp_delta` et `xp_after >= 0`.
- **user_xp** — agrégat par user (`total_xp`, `current_level`, `current_xp_in_level`), MAJ via RPC uniquement.
- **achievement_definitions** — catalogue (key UNIQUE, rarity, `xp_reward`, conditions JSONB).
- **user_achievements** — UNIQUE(`user_id`,`achievement_id`), `unlocked_at`, `details`.
- **seasons** — saisons, récompenses cosmétiques, resets classements.
- **quests**, **quest_steps**, **user_quests** — quêtes J/H, paliers, progression.
- **friend_links**, **friend_streaks** — social/streaks de groupe.
- **RPC** (SECURITY DEFINER): `credit_xp()`, `unlock_achievement()`, `compute_level_info()`, `ensure_xp_partition()`.

---

## 9) `community` — Forum, Commentaires, Likes, Modération
- **topics** — fils de discussion (ex: cours, thèmes).
- **posts** — messages dans topics (hiérarchie parentale optionnelle).
- **comments** — **polymorphe**: commentaires attachés à `course|lesson|post` via `(target_type, target_id)`, threads possibles via `parent_id`.
- **reactions** — **likes/upvotes/emoji** polymorphes sur `course|lesson|post|comment` (UNIQUE par user/target/reaction_type).
- **ratings** — notes/reviews sur cours/lessons (1-5 + texte).
- **votes** — up/down sur posts (façon Q&A).
- **flags** — signalements (raison, statut).
- **moderation_actions** — décisions (masquage, ban, lock).
- **trust_levels** — paliers de réputation/droits communautaires.

---

## 10) `ai` — Assistant, Outils, Coûts, A/B, Evals
> RAG détaillé plus tard (voir `vector`), on pose seulement l’ossature assistant/coûts.

- **providers** — vendors (OpenAI/Anthropic/Local), quotas, refs Vault.
- **models** — catalogue (nom, `ctx_len`, prix input/output/1K tokens, tags policy).
- **assistant_sessions** — fils de conversation utilisateur.
- **assistant_messages_YYYYMM** — **partition mensuelle**, `role` (`user|assistant|system|tool`), `content` JSON (text/parts), `latency_ms`, `tokens_in/out`, `cost_micro`.
- **tool_invocations** — appels outils (nom, args, result, durée, status).
- **policies** — garde-fous (temp caps, max tokens, safety modes), scoping par rôle/tier.
- **prompt_templates**, **prompt_variants** — prompts versionnés (A/B).
- **ab_tests**, **ab_assignments** — expérimentation prompt/model.
- **eval_runs**, **eval_metrics** — évaluations offline (rubriques, scores).
- **rate_limits** — quotas/role/user (fenêtre, compteurs).
- **RPC**: `run_assistant()`, `append_message()`, `enqueue_tool()` (RLS + quotas).

---

## 11) `vector` — RAG & Indexation (simplifié pour V1)
> Tu “ne connais pas grand-chose” au RAG aujourd’hui : on garde minimal et sûr.

- **collections** — espaces logiques (docs cours, docs internes).
- **documents** — métadonnées (source, langue, droits, checksum).
- **chunks** — texte chunké + `embedding` (pgvector), offsets, ref doc.
- **ingestions** — jobs (status, errors, tokenizer, chunk_size).
- **retrieval_logs** — requêtes RAG (top-k, scores, latence).
- **Index**: HNSW/IVFFlat sur `embedding` (activable plus tard).

---

## 12) `media` — Fichiers & Dérivés
- **files** — owner, `path`, `is_public`, `metadata` (taille, mime, sha256).
- **derivatives** — thumbnails, captions, transcripts générés.
- **transcode_jobs** — pipeline vidéo/audio (status, logs).

---

## 13) `notify` — Notifications & Templates
- **channels** — `email`, `in_app`, `push`.
- **templates** — versions localisées (clé, langue, version, body).
- **outbox** — file d’envoi, retries, provider_response.
- **user_subscriptions** — opt-in/out par type/canal.

---

## 14) `analytics` — Journaux & KPIs
- **activity_log_YYYYMM** — **partition mensuelle** événements produit (type, action, details JSONB).
- **user_sessions_YYYYMM** — parcours, device_info, pages_visited[].
- **kpis_daily** — agrégats (DAU/WAU/MAU, conv, retention).
- **ai_costs_daily** — coûts IA agrégés par provider/model.

---

## 15) `compliance` — RGPD & Export
- **rgpd_requests** — `access|deletion|export`, statut, horodatages.
- **data_exports** — jobs d’export (format, lien temporaire).
- **legal_docs** — CGU/CGV versionnées, consent mappings.

---

## 16) `util` — Outils & Jobs
- **job_queue**, **job_runs** — tâches async (webhooks, recalculs, emails).
- **migrations_meta** — versionnage interne (safety checks).
- **feature_flags** — toggles (rollout, cohortes).
- **fn**: `util.set_updated_at()` (trigger générique BEFORE UPDATE).

---

## RLS — Patrons (exemples)
- **Données user-scopées** (ex: `user_progress`, `user_xp`, `assistant_sessions`):  
  `USERS_CAN_SELECT`: `user_id = auth.uid()` • `USERS_CAN_UPSERT`: `user_id = auth.uid()` • `ADMINS_BYPASS`: `rbac.has_role(auth.uid(),'admin')`.
- **Contenu publié** (`courses`, `lessons`):  
  `ANON_READ_PUBLISHED`: `is_published = true` • `STAFF_WRITE`: `rbac.has_permission(auth.uid(),'lesson.publish')`.
- **Config sensible** (`xp_sources`, `level_definitions`, `ai.policies`):  
  `READ_ALL` (optionnel) • `ADMIN_WRITE` strict.

---

## Réactions & Commentaires (détails)
- **community.comments** cible `course|lesson|post` via `(target_type, target_id)` + threads (`parent_id`).  
- **community.reactions** universalise les likes/emoji/upvotes sur **toutes** les entités clés (`course|lesson|post|comment`) avec UQ(`user_id`,`target_type`,`target_id`,`reaction_type`).  
- **RLS**: commenter/réagir nécessite `effective_access=read` sur la cible; édition/suppression limitée à l’auteur ou modérateur.

---

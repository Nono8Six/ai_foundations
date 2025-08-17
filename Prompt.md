                # P1 — Durcissement `xp_events` (idempotence, invariants, index) — Plan→Exec

                Contexte court
                Le ledger XP n’a pas d’idempotence ni de CHECKs garantissant `xp_after = xp_before + xp_delta` et `xp_after >= 0`. Risque de double crédit, corruption d’état, analyses lentes.

                Objectif
                Proposer et, si approuvé, appliquer une migration SQL idempotente qui :
                • ajoute `idempotency_key` (TEXT NOT NULL) et une contrainte UNIQUE robuste (au choix: UNIQUE(idempotency_key) OU UNIQUE(user_id, source_type, action_type, reference_id, date_bucket)) ;
                • ajoute CHECKs `xp_after = xp_before + xp_delta` et `xp_after >= 0` ;
                • ajoute colonnes de traçabilité si manquantes: `source_id`, `source_version` ;
                • crée index de requêtage `(user_id, created_at DESC)` et index par filtres analytiques clés ;
                • n’altère pas les données existantes (migration en 2 temps si nécessaire: colonnes NULLABLE → backfill → SET NOT NULL).

                Étapes (Plan Mode, ultrathink)
                1. Lire le schéma actuel de `xp_events` et lister colonnes/contraintes/index existants.
                2. Générer un patch SQL strictement idempotent (IF NOT EXISTS + guards) nommé `apps/backend/supabase/migrations/<timestamp>_xp_events_hardening.sql`.
                3. Inclure une section “Backfill plan” pour colonnes nouvelles si besoin.
                4. Produire un plan de validation (SELECT de contrôle, tentative d’insertion dupliquée en mode dry-run) et un plan de rollback.

                Sortie attendue
                Un diff SQL complet prêt à exécuter + un protocole de tests. Aucun write tant que je n’écris pas “APPROUVE: P1”.

                Après approbation
                Exécuter la migration via MCP Supabase, afficher les résultats et exécuter les tests de validation. S’arrêter au moindre échec.

                # P2 — RPC atomique `credit_xp` + advisory lock — Plan→Exec

                Contexte court
                Les crédits XP se font sans transaction unifiée ni verrou par utilisateur. Risque de conditions de course et doubles crédits.

                Objectif
                Spécifier puis implémenter une RPC/SQL unique `credit_xp(user_id, source_ref, xp_delta, idempotency_key, reference_id)` qui :
                • ouvre advisory lock par `(user_id)` ;
                • insère dans `xp_events` avec idempotence (ON CONFLICT DO NOTHING/UPDATE selon design) ;
                • recalcule `profiles.xp` et `level` dans la même transaction ;
                • retourne `{event_id, xp_before, xp_after, level_before, level_after}`.

                Étapes (Plan Mode, ultrathink)
                1. Décrire signature exacte, validations d’entrée et codes d’erreur.
                2. Générer squelette SQL/PLpgSQL transactionnel et tests de concurrence (deux appels parallèles, même idempotency_key).
                3. Préparer migration pour créer la fonction et les index complémentaires éventuels.

                Sortie attendue
                Spécification + patch SQL complet, plus script de tests. Aucun write tant que je n’écris pas “APPROUVE: P2”.

                Après approbation
                Créer la fonction, lancer les tests de concurrence et afficher les résultats. S’arrêter au moindre échec.

                # P3 — Niveaux: `compute_level(xp_total)` + contraintes `level_definitions` — Plan→Exec

                Contexte court
                Pas de fonction canonique de niveau ni garantie de monotonie sur `level_definitions.xp_required`.

                Objectif
                • Créer la fonction pure `compute_level(xp_total)` renvoyant `{level, xp_threshold, xp_to_next}` ;
                • Forcer `level_definitions.xp_required` strictement croissant (contrainte ou trigger de validation) ;
                • Intégrer `compute_level` à `credit_xp` ;
                • Ajouter tests: montée/descente de niveau, grands volumes.

                Étapes (Plan Mode, ultrathink)
                1. Auditer `level_definitions`.
                2. Proposer DDL de contrainte + code SQL de `compute_level`.
                3. Décrire tests de non-régression et cas limites (xp=0, très gros XP).

                Sortie attendue
                Patch SQL + protocole de tests. Exécution seulement après “APPROUVE: P3”.

                # P4 — `xp_sources` versionnées, zéro hardcode front — Plan→Exec

                Contexte court
                Valeurs XP hardcodées côté front, pas de versionnement/temporalité des règles.

                Objectif
                • Ajouter `version`, `effective_from`, `effective_to`, `is_active`, `deprecated_reason` ;
                • Contrainte UNIQUE `(source_type, action_type, version)` ;
                • RPC lecture `get_active_xp_sources(now)` pour le front ;
                • RLS: lecture contrôlée, écriture admins only (WITH CHECK).

                Étapes (Plan Mode, ultrathink)
                1. Proposer migration idempotente + index temporels.
                2. Spécifier la RPC et sa sémantique.
                3. Lister précisément où le front lit aujourd’hui des valeurs hardcodées et concevoir la bascule vers la RPC.

                Sortie attendue
                Patch SQL + spec RPC + plan de migration front. Exécution après “APPROUVE: P4”.

                # P5 — Achievements: templates vs instances + compensation — Plan→Exec

                Contexte court
                Risque de suppression d’historique et de non-idempotence lors des dépréciations.

                Objectif
                • Séparer définitions versionnées (`achievement_definitions`) et instances (`user_achievements`) ;
                • Contrainte UNIQUE `(user_id, achievement_id, achievement_version[, scope])` ;
                • Attribution XP via `credit_xp` uniquement ;
                • RPC admin `admin_compensate_source(source_id, source_version, reason, idempotency_key)` pour émettre des événements négatifs plafonnés sans jamais supprimer.

                Étapes (Plan Mode, ultrathink)
                1. Proposer DDL/contraintes + indexes.
                2. Définir signatures RPC et logique de dry-run vs apply.
                3. Définir tests: double compensation, large batch, annulation partielle.

                Sortie attendue
                Patchs SQL + specs RPC + tests. Exécution après “APPROUVE: P5”.

# P6 — `profiles` agrégat: invariants + writes via RPC only — Plan→Exec (Plan Mode)

But
1) Verrouiller `profiles` pour que TOUT write passe uniquement via `credit_xp` (déjà en P2).
2) Conserver les invariants (CHECKs déjà posés), forcer RLS, retirer privilèges direct-write, et ajouter un trigger de garde piloté par un GUC.
3) Patch minimal dans `credit_xp` pour définir ce GUC juste avant l’UPDATE.

Pré-flight (lecture seule)
– Liste des CHECKs sur `profiles`.
– État RLS (enabled/forced), policies existantes, privilèges `INSERT/UPDATE/DELETE` des rôles `anon`/`authenticated`.
– Contenu actuel de `credit_xp` autour de l’UPDATE `profiles`.

Patch SQL proposé (ne pas exécuter tant que je n’envoie pas “APPROUVE: P6”)
```sql
-- 1) Invariants (déjà posés en P2 : vérifier/valider)
ALTER TABLE public.profiles
  ADD CONSTRAINT IF NOT EXISTS chk_profiles_xp_ge0 CHECK (xp >= 0) NOT VALID,
  ADD CONSTRAINT IF NOT EXISTS chk_profiles_level_ge1 CHECK (level >= 1) NOT VALID;
ALTER TABLE public.profiles VALIDATE CONSTRAINT chk_profiles_xp_ge0;
ALTER TABLE public.profiles VALIDATE CONSTRAINT chk_profiles_level_ge1;

-- 2) RLS: activer + FORCER
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- 3) Policies: lecture seulement (self + admin). Aucune policy d’écriture côté clients.
DROP POLICY IF EXISTS profiles_select_self ON public.profiles;
CREATE POLICY profiles_select_self ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS profiles_select_admin ON public.profiles;
CREATE POLICY profiles_select_admin ON public.profiles
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- 4) Privilèges: supprimer tout INSERT/UPDATE/DELETE pour les rôles front
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM authenticated;

-- 5) Trigger de garde: write interdit hors RPC 'credit_xp'
CREATE OR REPLACE FUNCTION public.profiles_guard_write()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE ctx text := current_setting('app.allow_profiles_write', true);
BEGIN
  IF ctx IS DISTINCT FROM 'credit_xp' THEN
    RAISE EXCEPTION 'profiles writes must go through credit_xp (ctx=%)', COALESCE(ctx,'NULL');
  END IF;
  RETURN CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN NEW ELSE OLD END;
END$$;

DROP TRIGGER IF EXISTS t_profiles_guard_ins ON public.profiles;
DROP TRIGGER IF EXISTS t_profiles_guard_upd ON public.profiles;
DROP TRIGGER IF EXISTS t_profiles_guard_del ON public.profiles;

CREATE TRIGGER t_profiles_guard_ins BEFORE INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_guard_write();
CREATE TRIGGER t_profiles_guard_upd BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_guard_write();
CREATE TRIGGER t_profiles_guard_del BEFORE DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.profiles_guard_write();

-- 6) Patch minimal à faire dans credit_xp() (diff conceptuelle, non exécutée ici)
-- Avant l'UPDATE profiles, ajouter:
--   PERFORM set_config('app.allow_profiles_write','credit_xp', true);
-- et conserver l'UPDATE existant (xp, level, last_xp_event_at) dans la même transaction.
Tests d’accès (Plan Mode)
– UPDATE direct doit échouer (exception du trigger).
– INSERT/DELETE directs idem.
– Appel credit_xp doit réussir et mettre à jour profiles (vérifier last_xp_event_at).
– Les CHECKs restent validés.

Sortie attendue
– Script SQL final + snippet à insérer dans credit_xp.
– Script des tests.
– Attente “APPROUVE: P6”.


# P7 — `user_progress` → XP transactionnel + audit `reference_id` — Plan→Exec (Plan Mode)

But
1) Unicité `(user_id, lesson_id)`.  
2) RPC atomique/idempotente qui fait l’upsert de progression puis **crédite exactement une fois** via `credit_xp`.  
3) Traçabilité: `xp_events.reference_id = user_progress.id`.

Pré-flight (lecture seule)
– Schéma actuel de `user_progress` + RLS.  
– Existence de la règle `xp_sources` active `(source_type='lesson', action_type='complete')`.

Patch SQL proposé (ne pas exécuter tant que je n’envoie pas “APPROUVE: P7”)
```sql
-- Table et contraintes
CREATE TABLE IF NOT EXISTS public.user_progress(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('not_started','in_progress','completed')),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS: self RW ; admin full
DROP POLICY IF EXISTS up_user_rw ON public.user_progress;
CREATE POLICY up_user_rw ON public.user_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS up_admin_all ON public.user_progress;
CREATE POLICY up_admin_all ON public.user_progress
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

-- Helper lock 2 clés (user, lesson)
CREATE OR REPLACE FUNCTION public.get_user_lesson_lock_keys(p_user_id uuid, p_lesson_id uuid)
RETURNS TABLE(h1 int, h2 int) LANGUAGE sql IMMUTABLE AS $$
  SELECT
    ('x'||substr(md5(p_user_id::text),1,8))::bit(32)::int,
    ('x'||substr(md5(p_lesson_id::text),1,8))::bit(32)::int;
$$;

-- RPC principale
CREATE OR REPLACE FUNCTION public.mark_lesson_progress(
  p_user_id uuid,
  p_lesson_id uuid,
  p_new_status text,
  p_idempotency_key text
)
RETURNS TABLE(progress_id uuid, status text, event_id uuid, xp_before int, xp_after int, level_before int, level_after int)
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public, pg_temp AS $$
DECLARE h1 int; h2 int; now_ts timestamptz := now(); pr_id uuid; st text; rule record; res record;
BEGIN
  IF p_user_id <> auth.uid() AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id=auth.uid() AND is_admin) THEN
    RAISE EXCEPTION 'unauthorized_user_access';
  END IF;
  IF p_new_status NOT IN ('not_started','in_progress','completed') THEN RAISE EXCEPTION 'invalid_status'; END IF;
  IF p_idempotency_key IS NULL OR length(p_idempotency_key) < 8 THEN RAISE EXCEPTION 'invalid_idempotency_key'; END IF;

  SELECT h1,h2 INTO h1,h2 FROM public.get_user_lesson_lock_keys(p_user_id, p_lesson_id);
  IF NOT pg_try_advisory_xact_lock(h1,h2) THEN RAISE EXCEPTION 'lock_not_acquired'; END IF;

  INSERT INTO public.user_progress(user_id, lesson_id, status, started_at, completed_at, updated_at)
  VALUES (p_user_id, p_lesson_id,
          CASE WHEN p_new_status='not_started' THEN 'not_started'
               WHEN p_new_status='in_progress' THEN 'in_progress'
               ELSE 'completed' END,
          CASE WHEN p_new_status<>'not_started' THEN now_ts ELSE NULL END,
          CASE WHEN p_new_status='completed' THEN now_ts ELSE NULL END,
          now_ts)
  ON CONFLICT (user_id, lesson_id) DO UPDATE
    SET status = EXCLUDED.status,
        started_at = COALESCE(public.user_progress.started_at, EXCLUDED.started_at),
        completed_at = CASE WHEN EXCLUDED.status='completed' AND public.user_progress.completed_at IS NULL THEN now_ts ELSE public.user_progress.completed_at END,
        updated_at = now_ts
  RETURNING id, status INTO pr_id, st;

  IF st = 'completed' THEN
    SELECT * INTO rule FROM public.get_active_xp_sources(now())
      WHERE source_type='lesson' AND action_type='complete' LIMIT 1;
    IF NOT FOUND THEN RAISE EXCEPTION 'xp_rule_missing'; END IF;

    SELECT * INTO res FROM public.credit_xp(
      p_user_id        := p_user_id,
      p_source_ref     := rule.source_type||':'||rule.action_type,
      p_xp_delta       := rule.xp_value,
      p_idempotency_key:= p_idempotency_key,
      p_reference_id   := p_lesson_id,
      p_source_version := rule.version::text
    );

    RETURN QUERY SELECT pr_id, st, res.event_id, res.xp_before, res.xp_after, res.level_before, res.level_after;
  ELSE
    RETURN QUERY SELECT pr_id, st, NULL::uuid, NULL::int, NULL::int, NULL::int, NULL::int;
  END IF;
END$$;
Tests (Plan Mode)
– Deux appels parallèles completed même (user,lesson) + même clé → 1 seul event.
– Rejouer completed avec clé différente → zéro second crédit (idempotence assurée côté progression).
– RLS: impossible d’écrire/lire la progression d’un autre.

Sortie attendue
– Patch SQL + script de tests. Attente “APPROUVE: P7”.

# P8 — RLS complet par table/opération — Plan→Exec (Plan Mode)

But
Vérifier et compléter les policies (SELECT/INSERT/UPDATE/DELETE) pour: `xp_events`, `xp_sources`, `level_definitions`, `achievement_definitions`, `user_achievements`, `profiles`, `user_progress`.

Pré-flight
– Dump exhaustif des policies par table (USING / WITH CHECK).
– Repérage de toute policy écriture trop large (USING true / WITH CHECK permissif).

Patch (proposé)
– `xp_events`: SELECT self (user_id=auth.uid()), SELECT admin full; **aucun write direct** (writes via RPC).  
– `xp_sources`: SELECT public active; admin write only (déjà fait P4).  
– `level_definitions`: SELECT public; admin write only (P3).  
– `achievement_definitions`: SELECT public active; admin write only (P5).  
– `user_achievements`: user RW self; admin read.  
– `profiles`: lecture self + admin; **aucune** policy d’écriture (P6).  
– `user_progress`: user RW self; admin full (P7).

Sortie attendue
– Script `CREATE/ALTER POLICY` idempotent + script de tests (rôles anon/auth/admin/service). Attente “APPROUVE: P8”.

# P9 — Frontend: RPC-only, idempotency_key, anti double-submit, UI XP cohérente — Plan→Exec (Plan Mode)

But
– Remplacer tout hardcode et tout write direct par RPC (`credit_xp`, `get_active_xp_sources`, `compute_level_info`, `mark_lesson_progress`).  
– Générer des `idempotency_key` déterministes par contexte (ex: `lesson:{lessonId}:{userId}`; `ach:{code}:{ver}:{userId}`; `src:{stype}:{atype}:{userId}:{ref?}`).
– Anti double-submit: lock UI jusqu’au retour serveur; état dérivé de `{xp_after, level_after}`.

Livrables
– Liste fichiers à modifier (chemins exacts), diff ciblés before/after, types TS alignés avec RPC.  
– Tests E2E: double-clic, offline retry, erreurs RPC.  
Attente “APPROUVE: P9”.

# P10 — Tests & Mise en prod: charge, concurrence, rollback — Plan→Exec (Plan Mode)

But
– Suites SQL unitaires (CHECK/constraints), tests de concurrence (advisory lock), scénarios de compensation (admin), et E2E front.  
– Orchestration: contraintes/RLS → RPC → refactor front.  
– Plan de rollback.

Livrables
– Scripts de tests charge (ex: 1k events/min/user), seuils d’acceptation (latence p95, zéro double crédit, RLS étanche).  
– Checklist “go-live” et rollback (DROP CONCURRENTLY d’index non utilisés, désactivation policies si besoin).  
Attente “APPROUVE: P10”.
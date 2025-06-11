# 🚀 Plan de Refactorisation Complet - AI Foundations

## 📋 Vue d'ensemble

Ce plan détaille toutes les tâches nécessaires pour transformer le projet AI Foundations d'un prototype avec des données mockées vers une application production-ready entièrement intégrée avec Supabase.

**Estimation totale : 120-150 heures de développement**

---

## 🎯 Phase 1: Nettoyage et Optimisation de Base (15-20h)

### 1.1 Audit et nettoyage des dépendances (3h)
- [ ] **Analyser `@dhiwise/component-tagger`** (1h)
  - [ ] Rechercher toutes les occurrences dans le code (`grep -r "dhiwise" src/`)
  - [ ] Vérifier si utilisé dans `src/index.jsx` ou autres fichiers
  - [ ] Si non utilisé, supprimer de `package.json`
  - [ ] Exécuter `npm install` pour nettoyer `package-lock.json`
  - [ ] Tester que l'application démarre sans erreur

- [ ] **Audit des dépendances inutilisées** (2h)
  - [ ] Utiliser `npx depcheck` pour identifier les dépendances non utilisées
  - [ ] Vérifier manuellement chaque dépendance identifiée
  - [ ] Supprimer les dépendances confirmées comme inutilisées
  - [ ] Mettre à jour les dépendances obsolètes vers leurs dernières versions
  - [ ] Tester l'application après chaque suppression

### 1.2 Consolidation et optimisation des styles (4h)
- [ ] **Audit des couleurs et variables CSS** (2h)
  - [ ] Comparer `tailwind.config.js` vs `src/styles/tailwind.css`
  - [ ] Identifier les doublons de définitions de couleurs
  - [ ] Lister toutes les variables CSS custom utilisées
  - [ ] Décider d'une source unique (recommandé: `tailwind.config.js`)

- [ ] **Refactorisation des couleurs** (2h)
  - [ ] Supprimer les variables CSS redondantes dans `tailwind.css`
  - [ ] Garder uniquement les variables CSS nécessaires pour les changements dynamiques
  - [ ] Mettre à jour tous les composants utilisant `var(--color-*)` vers les classes Tailwind
  - [ ] Rechercher et remplacer dans tout le projet : `grep -r "var(--color" src/`
  - [ ] Tester l'affichage sur toutes les pages principales
  - [ ] Vérifier les thèmes sombre/clair si implémentés

### 1.3 Optimisation du code et suppression des redondances (8h)
- [ ] **Simplification des blocs try-catch inutiles** (2h)
  - [ ] Auditer `src/components/Header.jsx` lignes 45-65
  - [ ] Supprimer les try-catch pour `userProfile?.full_name.split(' ')` et similaires
  - [ ] Garder uniquement les try-catch pour les opérations async/await
  - [ ] Remplacer par des vérifications conditionnelles simples
  - [ ] Tester la navigation et l'affichage du header

- [ ] **Amélioration de `AppImage.jsx`** (2h)
  - [ ] Simplifier la fonction `getValidImageUrl`
  - [ ] Supprimer les vérifications de domaines spécifiques hardcodées
  - [ ] Implémenter une détection de protocole plus générique
  - [ ] Ajouter un fallback plus robuste pour les images cassées
  - [ ] Tester avec différents types d'URLs (relative, absolute, data:, etc.)

- [ ] **Consolidation des composants similaires** (4h)
  - [ ] Identifier les composants avec du code dupliqué
  - [ ] Créer des composants de base réutilisables (ex: `BaseCard`, `BaseButton`)
  - [ ] Refactoriser les composants similaires pour utiliser les bases communes
  - [ ] Créer un système de design cohérent dans `src/components/ui/`
  - [ ] Documenter les composants de base avec des exemples

### 1.4 Nettoyage des fichiers et dossiers inutiles (2h)
- [ ] **Suppression des fichiers obsolètes** (1h)
  - [ ] Supprimer `src/setupTests.ts` (déjà supprimé)
  - [ ] Supprimer `src/hooks/useUserSettings.js` (déjà supprimé)
  - [ ] Supprimer `src/pages/public-homepage/components/Header.jsx` (déjà supprimé)
  - [ ] Vérifier s'il y a d'autres fichiers non référencés
  - [ ] Utiliser `find src -name "*.jsx" -o -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs grep -L "export"` pour trouver les fichiers sans exports

- [ ] **Nettoyage des imports inutilisés** (1h)
  - [ ] Utiliser ESLint pour identifier les imports non utilisés
  - [ ] Supprimer manuellement les imports inutilisés dans chaque fichier
  - [ ] Configurer ESLint pour détecter automatiquement ces problèmes à l'avenir
  - [ ] Tester que l'application fonctionne après le nettoyage

---

## 🗄️ Phase 2: Migration Supabase et Suppression des Données Mockées (40-50h)

### 2.1 Création des migrations Supabase manquantes (12h)

#### 2.1.1 Migration pour les paramètres utilisateur étendus (3h)
- [ ] **Créer `supabase/migrations/add_user_profile_fields.sql`** (2h)
  ```sql
  -- Ajouter les champs manquants à la table profiles
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profession text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth date;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'Europe/Paris';
  
  -- Mettre à jour les politiques RLS
  -- Permettre aux utilisateurs de modifier leurs propres champs étendus
  ```
  - [ ] Ajouter les colonnes : `phone`, `profession`, `company`, `bio`, `location`, `date_of_birth`, `timezone`
  - [ ] Mettre à jour les politiques RLS pour permettre la modification
  - [ ] Ajouter des contraintes de validation (ex: format téléphone, longueur bio)
  - [ ] Tester la migration sur un environnement de développement

- [ ] **Tester et valider la migration** (1h)
  - [ ] Exécuter la migration : `supabase db push`
  - [ ] Vérifier que les colonnes sont créées correctement
  - [ ] Tester les politiques RLS avec différents utilisateurs
  - [ ] Vérifier que les contraintes fonctionnent

#### 2.1.2 Migration pour les notes utilisateur (4h)
- [ ] **Créer `supabase/migrations/create_user_notes.sql`** (3h)
  ```sql
  -- Table pour les notes des utilisateurs sur les leçons
  CREATE TABLE IF NOT EXISTS user_notes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    content text NOT NULL,
    selected_text text,
    position jsonb DEFAULT '{}',
    tags text[] DEFAULT '{}',
    is_private boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
  ```
  - [ ] Créer la table `user_notes` avec toutes les colonnes nécessaires
  - [ ] Ajouter les index sur `user_id`, `lesson_id`, et `created_at`
  - [ ] Créer les politiques RLS pour la sécurité des notes
  - [ ] Ajouter un trigger pour `updated_at`
  - [ ] Créer une fonction pour la recherche full-text dans les notes

- [ ] **Tester la table des notes** (1h)
  - [ ] Insérer des notes de test
  - [ ] Vérifier les politiques RLS
  - [ ] Tester les requêtes de recherche
  - [ ] Valider les performances avec de gros volumes

#### 2.1.3 Migration pour les médias et fichiers (3h)
- [ ] **Créer `supabase/migrations/create_media_library.sql`** (2h)
  ```sql
  -- Table pour la bibliothèque multimédia
  CREATE TABLE IF NOT EXISTS media_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    filename text NOT NULL,
    original_name text NOT NULL,
    file_type text NOT NULL,
    file_size bigint NOT NULL,
    storage_path text NOT NULL UNIQUE,
    metadata jsonb DEFAULT '{}',
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
  );
  ```
  - [ ] Créer la table `media_files`
  - [ ] Configurer Supabase Storage avec les buckets appropriés
  - [ ] Créer les politiques RLS pour l'accès aux fichiers
  - [ ] Ajouter des contraintes sur les types de fichiers autorisés

- [ ] **Configuration Supabase Storage** (1h)
  - [ ] Créer les buckets : `avatars`, `course-images`, `lesson-videos`, `documents`
  - [ ] Configurer les politiques de storage
  - [ ] Tester l'upload et la récupération de fichiers
  - [ ] Configurer la compression automatique d'images

#### 2.1.4 Migration pour les statistiques et analytics (2h)
- [ ] **Créer `supabase/migrations/create_analytics_tables.sql`** (1.5h)
  ```sql
  -- Tables pour les analytics et statistiques
  CREATE TABLE IF NOT EXISTS user_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz,
    duration_minutes integer,
    pages_visited text[],
    device_info jsonb DEFAULT '{}'
  );
  
  CREATE TABLE IF NOT EXISTS lesson_analytics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    started_at timestamptz DEFAULT now(),
    completed_at timestamptz,
    time_spent_minutes integer,
    completion_percentage integer DEFAULT 0,
    interactions jsonb DEFAULT '{}'
  );
  ```
  - [ ] Créer les tables pour le tracking des sessions et interactions
  - [ ] Ajouter des vues pour les rapports agrégés
  - [ ] Créer des fonctions pour calculer les métriques
  - [ ] Configurer les politiques RLS

- [ ] **Tester les analytics** (0.5h)
  - [ ] Insérer des données de test
  - [ ] Vérifier les calculs de métriques
  - [ ] Tester les vues agrégées

### 2.2 Refactorisation du Dashboard Utilisateur (8h)

#### 2.2.1 Remplacement des données mockées dans ProgressChart (4h)
- [ ] **Analyser et mapper les données** (1h)
  - [ ] Identifier toutes les données mockées dans `user-dashboard/components/ProgressChart.jsx`
  - [ ] Mapper chaque donnée mockée vers sa source Supabase équivalente
  - [ ] Documenter les requêtes nécessaires

- [ ] **Implémentation des vraies données** (3h)
  - [ ] Créer `calculateWeeklyProgress()` utilisant `lesson_analytics`
  - [ ] Créer `calculateMonthlyProgress()` utilisant les données de progression
  - [ ] Calculer la distribution des sujets depuis les cours inscrits réels
  - [ ] Remplacer toute la logique de génération de données mockées
  - [ ] Ajouter la gestion des états de chargement et d'erreur
  - [ ] Implémenter un cache local pour les performances
  - [ ] Tester avec des utilisateurs ayant différents niveaux de progression

#### 2.2.2 Amélioration des Actions Rapides (2h)
- [ ] **Analyser `user-dashboard/components/QuickActions.jsx`** (0.5h)
  - [ ] Vérifier l'intégration actuelle avec les données réelles
  - [ ] Identifier les liens cassés ou les actions non fonctionnelles

- [ ] **Corrections et améliorations** (1.5h)
  - [ ] Corriger les liens vers les leçons suivantes en utilisant `getNextLesson`
  - [ ] Ajouter des actions conditionnelles basées sur le progrès réel
  - [ ] Implémenter des actions personnalisées selon le niveau de l'utilisateur
  - [ ] Ajouter des actions pour les cours recommandés
  - [ ] Tester toute la navigation et les redirections

#### 2.2.3 Optimisation des performances du dashboard (2h)
- [ ] **Mise en cache des données** (1h)
  - [ ] Implémenter un cache React Query ou SWR pour les données du dashboard
  - [ ] Configurer les intervalles de rafraîchissement appropriés
  - [ ] Ajouter l'invalidation de cache lors des actions utilisateur

- [ ] **Optimisation des requêtes** (1h)
  - [ ] Combiner les requêtes multiples en une seule où possible
  - [ ] Utiliser des vues Supabase pour les données complexes
  - [ ] Implémenter la pagination pour les listes longues
  - [ ] Tester les performances avec de gros volumes de données

### 2.3 Refactorisation du Dashboard Admin (10h)

#### 2.3.1 PerformanceMetrics avec vraies données (2h)
- [ ] **Créer les requêtes pour les métriques système** (1h)
  - [ ] Requête pour le temps de réponse API moyen
  - [ ] Requête pour les statistiques de disponibilité
  - [ ] Requête pour les métriques de performance serveur
  - [ ] Créer des vues Supabase pour les calculs complexes

- [ ] **Intégration dans le composant** (1h)
  - [ ] Remplacer toutes les données hardcodées
  - [ ] Ajouter la gestion des erreurs et du chargement
  - [ ] Implémenter le rafraîchissement automatique
  - [ ] Tester l'affichage des métriques réelles

#### 2.3.2 RecentActivity avec données réelles (2h)
- [ ] **Adapter useRecentActivity pour l'admin** (1h)
  - [ ] Modifier le hook pour accepter un paramètre "admin mode"
  - [ ] Créer des requêtes pour toutes les activités (pas seulement l'utilisateur connecté)
  - [ ] Ajouter des filtres par type d'activité et utilisateur

- [ ] **Mise à jour du composant** (1h)
  - [ ] Supprimer toutes les données mockées
  - [ ] Utiliser le hook modifié
  - [ ] Ajouter la pagination pour les grandes listes
  - [ ] Implémenter des filtres et la recherche
  - [ ] Tester avec de gros volumes d'activités

#### 2.3.3 PopularCoursesChart avec statistiques réelles (2h)
- [ ] **Créer les requêtes de statistiques** (1h)
  - [ ] Requête pour les inscriptions par cours
  - [ ] Requête pour les taux de completion par cours
  - [ ] Requête pour les notes moyennes par cours
  - [ ] Créer une vue Supabase pour les statistiques de cours

- [ ] **Intégration dans le composant** (1h)
  - [ ] Remplacer toutes les données hardcodées
  - [ ] Ajouter des filtres par période (semaine, mois, année)
  - [ ] Implémenter le tri par différentes métriques
  - [ ] Tester l'affichage des graphiques avec vraies données

#### 2.3.4 GeographicDistribution avec données utilisateur (2h)
- [ ] **Ajouter le champ géographique** (0.5h)
  - [ ] Ajouter `country` et `region` dans la table profiles
  - [ ] Mettre à jour les formulaires d'inscription pour collecter ces données
  - [ ] Créer une migration pour ajouter ces champs

- [ ] **Créer les requêtes géographiques** (1h)
  - [ ] Requête pour la distribution par pays
  - [ ] Requête pour la distribution par région
  - [ ] Calculer les pourcentages et croissance

- [ ] **Mise à jour du composant** (0.5h)
  - [ ] Remplacer les données mockées
  - [ ] Ajouter des cartes interactives si nécessaire
  - [ ] Tester l'affichage géographique

#### 2.3.5 UserEngagementChart avec métriques réelles (2h)
- [ ] **Créer les requêtes d'engagement** (1h)
  - [ ] Utiliser la table `user_sessions` pour les données d'engagement
  - [ ] Calculer les utilisateurs actifs par période
  - [ ] Calculer le temps moyen passé sur la plateforme
  - [ ] Créer des vues pour les métriques d'engagement

- [ ] **Intégration dans le composant** (1h)
  - [ ] Remplacer toutes les données hardcodées
  - [ ] Ajouter des options de filtrage temporel
  - [ ] Implémenter des comparaisons période sur période
  - [ ] Tester avec différentes plages de dates

### 2.4 Refactorisation du CMS (12h)

#### 2.4.1 Intégration complète avec Supabase (4h)
- [ ] **Mise à jour de `cms/index.jsx`** (2h)
  - [ ] Supprimer complètement `mockContentData`
  - [ ] Utiliser exclusivement les données depuis CourseContext
  - [ ] Implémenter la recherche côté serveur avec Supabase
  - [ ] Ajouter le filtrage avancé (statut, type, date, auteur)
  - [ ] Implémenter la pagination côté serveur

- [ ] **Gestion des permissions admin** (2h)
  - [ ] Vérifier les permissions admin avant chaque opération
  - [ ] Ajouter des vérifications côté client et serveur
  - [ ] Implémenter des messages d'erreur appropriés
  - [ ] Tester avec des utilisateurs non-admin
  - [ ] Ajouter des logs d'audit pour les actions admin

#### 2.4.2 CourseEditor avec fonctionnalités complètes (3h)
- [ ] **Intégration Supabase Storage** (1.5h)
  - [ ] Implémenter l'upload d'images de couverture
  - [ ] Ajouter la compression automatique d'images
  - [ ] Gérer les différents formats d'image
  - [ ] Implémenter la suppression d'anciennes images

- [ ] **Opérations CRUD réelles** (1.5h)
  - [ ] Connecter aux vraies fonctions du CourseContext
  - [ ] Ajouter la validation côté client et serveur
  - [ ] Implémenter l'auto-sauvegarde (draft)
  - [ ] Ajouter l'historique des modifications
  - [ ] Tester la création, modification et suppression de cours

#### 2.4.3 ModuleEditor et LessonEditor (3h)
- [ ] **ModuleEditor** (1.5h)
  - [ ] Connecter aux opérations CRUD réelles
  - [ ] Implémenter la réorganisation des leçons par drag & drop
  - [ ] Ajouter la validation des données
  - [ ] Implémenter la duplication de modules
  - [ ] Tester toutes les fonctionnalités

- [ ] **LessonEditor** (1.5h)
  - [ ] Intégrer l'upload de vidéos avec Supabase Storage
  - [ ] Implémenter un éditeur de contenu riche (markdown ou WYSIWYG)
  - [ ] Ajouter la prévisualisation en temps réel
  - [ ] Implémenter l'auto-sauvegarde
  - [ ] Tester la création et modification de leçons

#### 2.4.4 MediaLibrary fonctionnelle (2h)
- [ ] **Intégration Storage complète** (1h)
  - [ ] Connecter à la table `media_files` et Supabase Storage
  - [ ] Implémenter l'upload réel avec progress bars
  - [ ] Ajouter la gestion des métadonnées (dimensions, durée, etc.)
  - [ ] Implémenter la compression automatique

- [ ] **Fonctionnalités avancées** (1h)
  - [ ] Ajouter la recherche et le filtrage par type/date
  - [ ] Implémenter l'organisation en dossiers
  - [ ] Ajouter la sélection multiple et les actions groupées
  - [ ] Tester avec différents types et tailles de fichiers

### 2.5 Refactorisation de la Visionneuse de Leçons (8h)

#### 2.5.1 Données de leçons réelles (3h)
- [ ] **Mise à jour de `lesson-viewer/index.jsx`** (2h)
  - [ ] Supprimer `mockLessonData` et `mockModuleStructure`
  - [ ] Utiliser les données réelles depuis CourseContext
  - [ ] Implémenter la navigation entre leçons basée sur l'ordre réel
  - [ ] Ajouter le tracking de progression réel avec analytics
  - [ ] Gérer les différents types de contenu (vidéo, texte, interactif)

- [ ] **Optimisation des performances** (1h)
  - [ ] Implémenter le préchargement de la leçon suivante
  - [ ] Ajouter la mise en cache des données de leçon
  - [ ] Optimiser le chargement des vidéos
  - [ ] Tester avec différents types de contenu

#### 2.5.2 Système de notes fonctionnel (3h)
- [ ] **Mise à jour de `NoteTaking.jsx`** (2h)
  - [ ] Connecter à la table `user_notes` Supabase
  - [ ] Implémenter la sauvegarde automatique (debounced)
  - [ ] Ajouter la synchronisation en temps réel entre onglets
  - [ ] Implémenter la recherche dans les notes
  - [ ] Ajouter le système de tags pour les notes

- [ ] **Fonctionnalités avancées** (1h)
  - [ ] Implémenter l'export des notes (PDF, markdown)
  - [ ] Ajouter la possibilité de partager des notes
  - [ ] Implémenter les notes collaboratives (optionnel)
  - [ ] Tester la persistance et la synchronisation

#### 2.5.3 Tracking et analytics (2h)
- [ ] **Implémentation du tracking** (1h)
  - [ ] Tracker le temps passé sur chaque leçon
  - [ ] Enregistrer les interactions utilisateur
  - [ ] Tracker la progression de lecture/visionnage
  - [ ] Implémenter les points de contrôle de progression

- [ ] **Analytics et rapports** (1h)
  - [ ] Créer des métriques de performance d'apprentissage
  - [ ] Implémenter des recommandations basées sur les analytics
  - [ ] Ajouter des insights pour l'utilisateur
  - [ ] Tester le tracking avec différents scénarios

### 2.6 Refactorisation de la Gestion des Utilisateurs (8h)

#### 2.6.1 Données utilisateur réelles (3h)
- [ ] **Mise à jour de `user-management-admin/index.jsx`** (2h)
  - [ ] Supprimer complètement `mockUsers`
  - [ ] Créer des requêtes optimisées pour les vrais utilisateurs
  - [ ] Implémenter la pagination côté serveur (50 utilisateurs par page)
  - [ ] Ajouter la recherche full-text sur nom, email, etc.
  - [ ] Implémenter des filtres avancés (rôle, statut, date d'inscription, activité)

- [ ] **Optimisation des performances** (1h)
  - [ ] Utiliser des index appropriés pour les requêtes
  - [ ] Implémenter la virtualisation pour les grandes listes
  - [ ] Ajouter la mise en cache des résultats de recherche
  - [ ] Tester avec de gros volumes d'utilisateurs (1000+)

#### 2.6.2 Création et gestion d'utilisateurs (3h)
- [ ] **Mise à jour de `CreateUserModal.jsx`** (2h)
  - [ ] Intégrer avec l'API d'authentification Supabase réelle
  - [ ] Implémenter la création d'utilisateurs avec validation
  - [ ] Ajouter la gestion des erreurs détaillée
  - [ ] Implémenter l'envoi d'emails d'invitation
  - [ ] Ajouter la possibilité de créer des utilisateurs en lot

- [ ] **Fonctionnalités avancées** (1h)
  - [ ] Implémenter la modification en ligne des utilisateurs
  - [ ] Ajouter l'historique des modifications
  - [ ] Implémenter la suspension/réactivation de comptes
  - [ ] Tester avec différents types d'utilisateurs et rôles

#### 2.6.3 Actions groupées fonctionnelles (2h)
- [ ] **Mise à jour de `BulkActionsBar.jsx`** (1h)
  - [ ] Implémenter les vraies actions groupées sur Supabase
  - [ ] Ajouter la gestion des erreurs par lot
  - [ ] Implémenter des confirmations de sécurité
  - [ ] Ajouter des logs d'audit pour les actions groupées

- [ ] **Tests et validation** (1h)
  - [ ] Tester avec de gros volumes d'utilisateurs sélectionnés
  - [ ] Vérifier les permissions pour chaque action
  - [ ] Tester la gestion d'erreurs partielles
  - [ ] Valider les logs d'audit

---

## 🔧 Phase 3: Amélioration de l'Architecture et Séparation des Préoccupations (25-30h)

### 3.1 Refactorisation du CourseContext (8h)

#### 3.1.1 Séparation des préoccupations admin (4h)
- [ ] **Créer `AdminCourseContext`** (2h)
  - [ ] Extraire toutes les opérations CRUD admin du CourseContext
  - [ ] Créer `src/context/AdminCourseContext.jsx`
  - [ ] Déplacer : `createCourse`, `updateCourse`, `deleteCourse`, `createModule`, etc.
  - [ ] Maintenir CourseContext pour les données utilisateur uniquement
  - [ ] Créer des hooks séparés : `useAdminCourses()` et `useCourses()`

- [ ] **Migration des composants** (2h)
  - [ ] Mettre à jour tous les composants admin pour utiliser `AdminCourseContext`
  - [ ] Mettre à jour les composants utilisateur pour utiliser `CourseContext`
  - [ ] Vérifier que les permissions sont correctement appliquées
  - [ ] Tester la séparation avec différents types d'utilisateurs

#### 3.1.2 Optimisation des performances (4h)
- [ ] **Mise en cache intelligente** (2h)
  - [ ] Implémenter React Query ou SWR pour la gestion du cache
  - [ ] Configurer des stratégies de cache différentes par type de données
  - [ ] Implémenter l'invalidation de cache appropriée
  - [ ] Ajouter la synchronisation en temps réel pour les données critiques

- [ ] **Optimisation des requêtes** (2h)
  - [ ] Analyser et optimiser les requêtes Supabase lentes
  - [ ] Ajouter des index appropriés dans la base de données
  - [ ] Implémenter la pagination pour toutes les listes
  - [ ] Créer des vues Supabase pour les requêtes complexes
  - [ ] Tester les performances avec de gros volumes de données

### 3.2 Amélioration de la gestion des paramètres utilisateur (4h)

#### 3.2.1 Refactorisation complète des paramètres (4h)
- [ ] **Simplification de la logique** (2h)
  - [ ] Supprimer complètement la logique localStorage redondante
  - [ ] Utiliser Supabase comme source unique de vérité
  - [ ] Créer un hook `useUserSettings` optimisé
  - [ ] Implémenter la mise en cache côté client
  - [ ] Ajouter la synchronisation en temps réel entre onglets

- [ ] **Mise à jour des composants** (2h)
  - [ ] Mettre à jour `SettingsTab.jsx` pour utiliser le nouveau hook
  - [ ] Implémenter la validation des paramètres
  - [ ] Ajouter des feedback visuels pour les changements
  - [ ] Implémenter l'auto-sauvegarde (debounced)
  - [ ] Tester la cohérence des paramètres entre sessions

### 3.3 Centralisation des données d'activité (4h)

#### 3.3.1 Unification des sources d'activité (4h)
- [ ] **Refactorisation de `useRecentActivity`** (2h)
  - [ ] Améliorer le hook pour accepter des paramètres de filtrage
  - [ ] Ajouter des options pour le mode admin vs utilisateur
  - [ ] Implémenter la pagination et le tri
  - [ ] Ajouter des types d'activités standardisés

- [ ] **Mise à jour des composants** (2h)
  - [ ] Mettre à jour `RecentActivity.jsx` dans le dashboard utilisateur
  - [ ] Mettre à jour `RecentActivity.jsx` dans le dashboard admin
  - [ ] Supprimer toutes les données d'activité mockées
  - [ ] Implémenter des filtres par type d'activité
  - [ ] Tester la cohérence entre les vues

### 3.4 Amélioration de la gestion des erreurs (5h)

#### 3.4.1 Système de gestion d'erreurs global (3h)
- [ ] **Créer un contexte d'erreurs** (1.5h)
  - [ ] Implémenter `src/context/ErrorContext.jsx`
  - [ ] Ajouter des méthodes pour capturer et afficher les erreurs
  - [ ] Créer un composant `ErrorBoundary` amélioré
  - [ ] Implémenter la journalisation des erreurs côté serveur

- [ ] **Intégration dans l'application** (1.5h)
  - [ ] Envelopper l'application avec le contexte d'erreurs
  - [ ] Mettre à jour les composants pour utiliser le contexte
  - [ ] Ajouter des messages d'erreur personnalisés
  - [ ] Implémenter des stratégies de récupération

#### 3.4.2 Amélioration des messages d'erreur (2h)
- [ ] **Standardisation des messages** (1h)
  - [ ] Créer un fichier `src/utils/errorMessages.js`
  - [ ] Définir des messages d'erreur clairs et utiles
  - [ ] Ajouter des suggestions de résolution
  - [ ] Traduire les messages en français

- [ ] **Mise à jour des composants** (1h)
  - [ ] Remplacer tous les messages d'erreur hardcodés
  - [ ] Ajouter des composants d'erreur visuels
  - [ ] Implémenter des toasts pour les erreurs non bloquantes
  - [ ] Tester différents scénarios d'erreur

### 3.5 Amélioration de l'architecture des hooks (4h)

#### 3.5.1 Standardisation et optimisation (4h)
- [ ] **Audit des hooks existants** (1h)
  - [ ] Analyser tous les hooks personnalisés
  - [ ] Identifier les patterns communs
  - [ ] Documenter les dépendances et effets secondaires

- [ ] **Refactorisation** (3h)
  - [ ] Standardiser les signatures et retours des hooks
  - [ ] Optimiser les dépendances des `useEffect`
  - [ ] Ajouter la mémoisation avec `useMemo` et `useCallback`
  - [ ] Implémenter des hooks composables
  - [ ] Ajouter des tests unitaires pour les hooks critiques

---

## 🛡️ Phase 4: Sécurité et Robustesse (15-20h)

### 4.1 Audit de sécurité (6h)

#### 4.1.1 Politiques RLS (3h)
- [ ] **Audit complet des politiques** (2h)
  - [ ] Vérifier toutes les politiques RLS existantes
  - [ ] Identifier les failles de sécurité potentielles
  - [ ] Documenter les permissions par table et rôle
  - [ ] Créer une matrice de permissions

- [ ] **Mise à jour des politiques** (1h)
  - [ ] Ajouter les politiques manquantes
  - [ ] Renforcer les politiques existantes
  - [ ] Créer une migration pour les mises à jour
  - [ ] Tester les permissions avec différents rôles

#### 4.1.2 Validation des données (3h)
- [ ] **Validation côté client** (1.5h)
  - [ ] Standardiser la validation avec Zod ou Yup
  - [ ] Implémenter la validation dans tous les formulaires
  - [ ] Ajouter des messages d'erreur clairs et précis
  - [ ] Implémenter la validation en temps réel

- [ ] **Validation côté serveur** (1.5h)
  - [ ] Ajouter des contraintes dans la base de données
  - [ ] Créer des fonctions RPC pour la validation complexe
  - [ ] Implémenter des hooks de validation avant insertion
  - [ ] Tester avec des données invalides

### 4.2 Gestion des sessions et authentification (4h)

#### 4.2.1 Amélioration de l'authentification (2h)
- [ ] **Refactorisation de `AuthContext`** (1h)
  - [ ] Optimiser la gestion des sessions
  - [ ] Ajouter la détection de session expirée
  - [ ] Implémenter le rafraîchissement automatique des tokens
  - [ ] Ajouter la déconnexion sur inactivité

- [ ] **Sécurité renforcée** (1h)
  - [ ] Implémenter la vérification d'adresse email
  - [ ] Ajouter la détection de connexions suspectes
  - [ ] Implémenter la limitation de tentatives de connexion
  - [ ] Ajouter des logs d'audit pour les actions d'authentification

#### 4.2.2 Protection des routes (2h)
- [ ] **Amélioration de `ProtectedRoute`** (1h)
  - [ ] Ajouter la vérification de permissions granulaires
  - [ ] Implémenter la redirection intelligente
  - [ ] Ajouter la mémorisation de la page demandée
  - [ ] Gérer les sessions expirées

- [ ] **Mise à jour des routes** (1h)
  - [ ] Revoir toutes les routes protégées
  - [ ] Ajouter des vérifications de permissions spécifiques
  - [ ] Implémenter des routes avec permissions dynamiques
  - [ ] Tester avec différents types d'utilisateurs

### 4.3 Gestion des erreurs et robustesse (5h)

#### 4.3.1 Amélioration de la gestion des erreurs Supabase (3h)
- [ ] **Standardisation des erreurs** (1.5h)
  - [ ] Créer un wrapper pour les appels Supabase
  - [ ] Standardiser la gestion des erreurs
  - [ ] Ajouter des codes d'erreur spécifiques
  - [ ] Implémenter des stratégies de retry

- [ ] **Feedback utilisateur** (1.5h)
  - [ ] Créer des composants d'erreur réutilisables
  - [ ] Implémenter des messages d'erreur contextuels
  - [ ] Ajouter des suggestions de résolution
  - [ ] Implémenter un système de reporting d'erreurs

#### 4.3.2 Tests de robustesse (2h)
- [ ] **Tests de scénarios d'erreur** (1h)
  - [ ] Tester les déconnexions réseau
  - [ ] Tester les erreurs de serveur Supabase
  - [ ] Tester les conflits de concurrence
  - [ ] Vérifier la récupération après erreur

- [ ] **Tests de charge** (1h)
  - [ ] Tester les performances avec de gros volumes de données
  - [ ] Vérifier les limites de requêtes Supabase
  - [ ] Tester les scénarios d'utilisation intensive
  - [ ] Documenter les limites et recommandations

---

## 🚀 Phase 5: Optimisation des Performances et Expérience Utilisateur (15-20h)

### 5.1 Optimisation du chargement initial (4h)

#### 5.1.1 Amélioration du code splitting (2h)
- [ ] **Audit du code splitting actuel** (0.5h)
  - [ ] Analyser la taille des chunks générés
  - [ ] Identifier les opportunités d'amélioration
  - [ ] Mesurer les temps de chargement initiaux

- [ ] **Optimisation** (1.5h)
  - [ ] Affiner les imports dynamiques
  - [ ] Implémenter le préchargement des routes probables
  - [ ] Optimiser les dépendances communes
  - [ ] Tester les temps de chargement après optimisation

#### 5.1.2 Optimisation des assets (2h)
- [ ] **Audit des assets** (0.5h)
  - [ ] Identifier les images et médias lourds
  - [ ] Analyser les polices et icônes
  - [ ] Mesurer l'impact sur le chargement

- [ ] **Optimisation** (1.5h)
  - [ ] Implémenter le chargement lazy des images
  - [ ] Configurer des tailles d'images responsives
  - [ ] Optimiser les formats d'image (WebP, AVIF)
  - [ ] Implémenter le préchargement des assets critiques
  - [ ] Tester sur différentes connexions réseau

### 5.2 Amélioration de l'expérience utilisateur (6h)

#### 5.2.1 États de chargement et transitions (3h)
- [ ] **Audit des états de chargement** (1h)
  - [ ] Identifier les actions longues sans feedback
  - [ ] Analyser les transitions entre pages
  - [ ] Documenter les points d'amélioration

- [ ] **Implémentation** (2h)
  - [ ] Créer des composants de skeleton loading
  - [ ] Ajouter des animations de transition entre pages
  - [ ] Implémenter des indicateurs de progression
  - [ ] Ajouter des transitions pour les actions CRUD
  - [ ] Tester sur différents appareils et vitesses

#### 5.2.2 Feedback et notifications (3h)
- [ ] **Système de notifications** (2h)
  - [ ] Créer un contexte de notifications
  - [ ] Implémenter des composants de toast
  - [ ] Ajouter des notifications pour les actions importantes
  - [ ] Implémenter des notifications en temps réel

- [ ] **Feedback interactif** (1h)
  - [ ] Améliorer les animations de boutons
  - [ ] Ajouter des micro-interactions
  - [ ] Implémenter des confirmations visuelles
  - [ ] Tester l'expérience utilisateur globale

### 5.3 Optimisation des performances globales (5h)

#### 5.3.1 Audit de performance (2h)
- [ ] **Analyse des performances** (1h)
  - [ ] Exécuter Lighthouse sur toutes les pages principales
  - [ ] Identifier les goulots d'étranglement
  - [ ] Analyser les métriques Web Vitals
  - [ ] Documenter les problèmes trouvés

- [ ] **Plan d'optimisation** (1h)
  - [ ] Prioriser les problèmes par impact
  - [ ] Créer un plan d'action
  - [ ] Définir des métriques de succès
  - [ ] Établir une baseline de performance

#### 5.3.2 Optimisations React (3h)
- [ ] **Réduction des re-renders** (1.5h)
  - [ ] Utiliser React DevTools pour identifier les re-renders inutiles
  - [ ] Implémenter `React.memo` pour les composants coûteux
  - [ ] Optimiser les dépendances des hooks
  - [ ] Utiliser `useCallback` et `useMemo` stratégiquement

- [ ] **Optimisation du state management** (1.5h)
  - [ ] Revoir la structure du state global
  - [ ] Implémenter des sélecteurs memoized
  - [ ] Optimiser les mises à jour de state
  - [ ] Tester les performances après optimisation

---

## 🧪 Phase 6: Tests et Qualité du Code (10-15h)

### 6.1 Tests unitaires (5h)

#### 6.1.1 Tests des hooks et utilitaires (3h)
- [ ] **Configuration de l'environnement de test** (1h)
  - [ ] Configurer Vitest pour les tests unitaires
  - [ ] Mettre en place les mocks pour Supabase
  - [ ] Créer des helpers de test réutilisables

- [ ] **Implémentation des tests** (2h)
  - [ ] Tester les hooks personnalisés
  - [ ] Tester les fonctions utilitaires
  - [ ] Tester les transformations de données
  - [ ] Atteindre une couverture de code de 70%+

#### 6.1.2 Tests des composants (2h)
- [ ] **Tests des composants UI** (1h)
  - [ ] Tester les composants de base
  - [ ] Vérifier les rendus conditionnels
  - [ ] Tester les interactions utilisateur

- [ ] **Tests des formulaires** (1h)
  - [ ] Tester la validation des formulaires
  - [ ] Vérifier les soumissions de formulaires
  - [ ] Tester les messages d'erreur
  - [ ] Vérifier les états de chargement

### 6.2 Tests d'intégration (3h)

#### 6.2.1 Tests des flux utilisateur (3h)
- [ ] **Configuration** (1h)
  - [ ] Configurer les tests d'intégration
  - [ ] Mettre en place les mocks pour l'API
  - [ ] Créer des fixtures de test

- [ ] **Implémentation** (2h)
  - [ ] Tester le flux d'authentification
  - [ ] Tester le flux d'inscription à un cours
  - [ ] Tester le flux de progression dans une leçon
  - [ ] Tester les opérations CRUD admin
  - [ ] Vérifier les redirections et la navigation

### 6.3 Amélioration de la qualité du code (2h)

#### 6.3.1 Linting et formatage (1h)
- [ ] **Configuration** (0.5h)
  - [ ] Configurer ESLint avec des règles strictes
  - [ ] Configurer Prettier pour le formatage
  - [ ] Ajouter des hooks pre-commit

- [ ] **Application** (0.5h)
  - [ ] Exécuter le linting sur tout le code
  - [ ] Corriger les erreurs et warnings
  - [ ] Standardiser le style de code

#### 6.3.2 Documentation (1h)
- [ ] **Documentation du code** (0.5h)
  - [ ] Ajouter des commentaires JSDoc aux fonctions importantes
  - [ ] Documenter les hooks personnalisés
  - [ ] Ajouter des exemples d'utilisation

- [ ] **Documentation utilisateur** (0.5h)
  - [ ] Créer/mettre à jour le README
  - [ ] Ajouter des guides d'utilisation
  - [ ] Documenter l'architecture du projet

---

## 📱 Phase 7: Responsive Design et Accessibilité (10-15h)

### 7.1 Audit et amélioration du responsive design (6h)

#### 7.1.1 Audit complet (2h)
- [ ] **Analyse des pages** (1h)
  - [ ] Tester toutes les pages sur différentes tailles d'écran
  - [ ] Identifier les problèmes de mise en page
  - [ ] Documenter les points d'amélioration

- [ ] **Plan d'action** (1h)
  - [ ] Prioriser les problèmes par importance
  - [ ] Créer un plan de correction
  - [ ] Définir des standards de responsive design

#### 7.1.2 Corrections et améliorations (4h)
- [ ] **Composants problématiques** (2h)
  - [ ] Corriger les tableaux non responsives
  - [ ] Améliorer les formulaires sur mobile
  - [ ] Optimiser les graphiques pour petits écrans
  - [ ] Adapter les menus et navigation

- [ ] **Optimisation globale** (2h)
  - [ ] Revoir les grilles et flexbox
  - [ ] Optimiser les tailles de police et espacement
  - [ ] Améliorer les interactions tactiles
  - [ ] Tester sur différents appareils

### 7.2 Amélioration de l'accessibilité (4h)

#### 7.2.1 Audit d'accessibilité (1h)
- [ ] **Analyse** (1h)
  - [ ] Exécuter des tests automatisés (Axe, WAVE)
  - [ ] Vérifier le contraste des couleurs
  - [ ] Tester la navigation au clavier
  - [ ] Vérifier les attributs ARIA

#### 7.2.2 Corrections et améliorations (3h)
- [ ] **Corrections de base** (1.5h)
  - [ ] Ajouter des attributs alt aux images
  - [ ] Améliorer la structure des headings
  - [ ] Corriger les contrastes insuffisants
  - [ ] Ajouter des labels aux formulaires

- [ ] **Améliorations avancées** (1.5h)
  - [ ] Implémenter des skip links
  - [ ] Améliorer les messages d'erreur pour lecteurs d'écran
  - [ ] Ajouter des descriptions pour les graphiques
  - [ ] Tester avec des lecteurs d'écran

---

## 🔍 Phase 8: Déploiement et Monitoring (5-10h)

### 8.1 Préparation au déploiement (3h)

#### 8.1.1 Optimisation de la build (2h)
- [ ] **Analyse de la build** (1h)
  - [ ] Exécuter `npm run build` avec source maps
  - [ ] Analyser la taille des bundles
  - [ ] Identifier les opportunités d'optimisation

- [ ] **Optimisations** (1h)
  - [ ] Configurer la compression des assets
  - [ ] Optimiser les dépendances externes
  - [ ] Configurer le tree shaking
  - [ ] Tester les performances de la build

#### 8.1.2 Configuration des environnements (1h)
- [ ] **Gestion des variables d'environnement** (1h)
  - [ ] Créer des fichiers d'environnement pour dev/prod
  - [ ] Documenter toutes les variables requises
  - [ ] Sécuriser les secrets
  - [ ] Tester la configuration multi-environnement

### 8.2 Monitoring et analytics (2h)

#### 8.2.1 Mise en place du monitoring (2h)
- [ ] **Configuration** (1h)
  - [ ] Mettre en place la capture d'erreurs frontend
  - [ ] Configurer les logs d'application
  - [ ] Mettre en place des alertes

- [ ] **Implémentation des analytics** (1h)
  - [ ] Configurer le tracking des événements utilisateur
  - [ ] Mettre en place des funnel d'analyse
  - [ ] Implémenter des métriques de performance
  - [ ] Tester la collecte de données

---

## 📝 Notes et Recommandations

### Priorités d'implémentation
1. Commencer par les migrations Supabase pour établir la structure de données
2. Refactoriser les contextes pour utiliser les vraies données
3. Remplacer les données mockées dans les composants
4. Optimiser les performances et l'expérience utilisateur
5. Ajouter les tests et améliorer la qualité du code

### Points d'attention
- Maintenir la rétrocompatibilité pendant la refactorisation
- Tester régulièrement avec différents types d'utilisateurs
- Documenter les changements d'API et de structure
- Prioriser la sécurité et la validation des données
- Optimiser les performances dès le début

### Estimation des gains
- **Performance** : Amélioration de 40-60% des temps de chargement
- **Maintenabilité** : Réduction de 70% du code dupliqué
- **Sécurité** : Élimination des failles potentielles liées aux données mockées
- **Expérience utilisateur** : Amélioration significative avec des données réelles et des transitions fluides
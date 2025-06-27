# Guide du Workflow Supabase pour AI Foundations

Ce document détaille le workflow recommandé pour gérer votre schéma de base de données Supabase, en utilisant une approche "Cloud-First" où l'interface web de Supabase Cloud est la source principale de modifications, et votre dépôt local sert de miroir synchronisé et versionné.

## philosophie : Cloud-First → Local Mirror

1.  **Source de Vérité = Supabase Cloud UI** : Toutes les modifications de schéma (tables, colonnes, policies RLS, fonctions SQL, etc.) sont effectuées **directement dans l'interface web de votre projet Supabase Cloud** (par exemple, via l'éditeur de tables ou l'éditeur SQL).
2.  **Local = Miroir Synchronisé** : Votre code local, en particulier le dossier `apps/backend/supabase/migrations`, doit refléter l'état exact de votre schéma Cloud. Ceci est réalisé en "tirant" (pulling) les changements du Cloud vers votre local.
3.  **Versioning via Git** : Les fichiers de migration générés localement par `pnpm db:pull` sont commités sur Git. Cela assure un historique des versions de votre schéma et permet aux autres développeurs (ou à vous-même sur d'autres machines) de se mettre à jour.
4.  **Types TypeScript à Jour** : Après chaque synchronisation du schéma, les types TypeScript pour votre frontend doivent être régénérés pour correspondre.

## Diagramme du Workflow

```mermaid
graph LR;
    A[Supabase Cloud UI] --1. Modifications du Schéma (via Editeur SQL, etc.)--> B(Base de Données Supabase Cloud);
    B --2. `pnpm db:pull`--> C{Dépôt Local: apps/backend/supabase/migrations};
    C --3. `git commit -m "feat: mise à jour schéma XYZ"`--> D(Répertoire GitHub);
    C --4. `pnpm gen:types`--> E{Dépôt Local: apps/frontend/src/types/supabase.ts};
    E --`git commit`--> D;
    F[Autre Développeur / CI] --`git pull`--> G{Dépôt Local (autre)};
    G --`pnpm db:reset` (pour instance locale) / Déploiement--> H(Instance Supabase Locale / Staging / Prod);

    style A fill:#D5F5E3,stroke:#2ECC71,stroke-width:2px
    style B fill:#EBF5FB,stroke:#3498DB,stroke-width:2px
    style C fill:#FCF3CF,stroke:#F1C40F,stroke-width:2px
    style E fill:#FCF3CF,stroke:#F1C40F,stroke-width:2px
    style D fill:# رسمی,stroke:#9B59B6,stroke-width:2px
```

## Commandes PNPM Essentielles (depuis la racine du projet)

*   **`pnpm db:pull`**:
    *   **Action** : Se connecte à votre projet Supabase Cloud lié (via `SUPABASE_ACCESS_TOKEN` et `SUPABASE_PROJECT_REF` dans `.env`) et compare le schéma distant avec vos migrations locales. Il génère ensuite de nouveaux fichiers de migration dans `apps/backend/supabase/migrations/` pour refléter les changements détectés sur le cloud.
    *   **Quand l'utiliser** : **Après chaque modification de schéma effectuée sur l'interface web de Supabase Cloud.**
    *   **Important** : Assurez-vous d'avoir exécuté `pnpm --filter backend exec supabase link` une fois pour lier votre projet local.

*   **`pnpm gen:types`**:
    *   **Action** : Génère le fichier `apps/frontend/src/types/supabase.ts` basé sur le schéma actuel de votre base de données (celle définie par `SUPABASE_PROJECT_REF` dans `.env`, donc votre instance Cloud).
    *   **Quand l'utiliser** : **Toujours après un `pnpm db:pull` réussi** qui a modifié la structure de la base, ou si vous avez modifié des fonctions/types SQL qui impactent l'introspection du schéma.

*   **`pnpm db:start`**:
    *   **Action** : Démarre une instance Supabase locale complète en utilisant Docker. Cette instance est construite à partir des fichiers de migration présents dans `apps/backend/supabase/migrations/`. Elle est donc un reflet de votre schéma (qui lui-même est un reflet du Cloud après un `db:pull`).
    *   **Quand l'utiliser** : Optionnel. Utile pour :
        *   Tester les migrations localement avant de les considérer comme "finales" (bien que dans ce workflow, elles proviennent du cloud).
        *   Développer ou tester des fonctionnalités en mode déconnecté du cloud.
        *   Explorer la base de données locale via Supabase Studio local (`http://localhost:54323` par défaut).
    *   Les données de cette instance locale sont persistantes grâce à un volume Docker (géré automatiquement par la CLI Supabase).

*   **`pnpm db:stop`**:
    *   **Action** : Arrête l'instance Supabase locale démarrée avec `pnpm db:start`.

*   **`pnpm --filter backend exec supabase db reset`** (Exécuté depuis la racine, ou `pnpm exec supabase db reset` depuis `apps/backend/`)
    *   **Action** : Réinitialise la base de données de votre instance Supabase *locale* (celle démarrée par `pnpm db:start`). Elle supprime toutes les données, applique toutes les migrations depuis le début, puis exécute le script `apps/backend/supabase/seeds.sql` (s'il existe).
    *   **Quand l'utiliser** : Pour repartir d'un état propre sur votre instance locale, ou pour tester le script `seeds.sql`. **Attention : ne JAMAIS exécuter cette commande sur votre instance de production Cloud.**

## Workflow de Développement Quotidien

1.  **Avant de commencer à coder** :
    *   `git pull` pour récupérer les derniers changements du dépôt (y compris les migrations d'autres développeurs).
    *   Si des nouvelles migrations ont été tirées :
        *   `pnpm gen:types` pour mettre à jour vos types frontend.
        *   Si vous utilisez l'instance Supabase locale : `pnpm db:reset` pour appliquer les nouvelles migrations à votre base locale.

2.  **Pendant le développement (Frontend se connecte au Cloud)** :
    *   Votre frontend (`pnpm dev:frontend` ou via `docker-compose up frontend`) se connecte à l'instance Supabase Cloud définie dans votre `.env`.
    *   **Si vous avez besoin de modifier le schéma** :
        1.  Allez sur l'interface web de votre projet Supabase Cloud.
        2.  Effectuez vos modifications (créer une table, ajouter une colonne, écrire une fonction SQL, définir une policy RLS).
        3.  Une fois terminé et testé sur le cloud :
            *   Retournez à votre terminal local, à la racine du projet.
            *   Exécutez `pnpm db:pull`. La CLI Supabase va détecter les changements et créer un ou plusieurs nouveaux fichiers de migration dans `apps/backend/supabase/migrations/`.
            *   Exécutez `pnpm gen:types` pour mettre à jour `apps/frontend/src/types/supabase.ts`.
            *   Vérifiez les fichiers générés.
            *   Commitez les nouveaux fichiers de migration et le fichier `supabase.ts` mis à jour :
                ```bash
                git add apps/backend/supabase/migrations apps/frontend/src/types/supabase.ts
                git commit -m "feat(schema): ajout de la table X et mise à jour des types"
                git push
                ```

3.  **Données de Test (Seeding)** :
    *   Le fichier `apps/backend/supabase/seeds.sql` est utilisé pour peupler votre base de données Supabase *locale* après un `pnpm db:reset`.
    *   Il n'affecte **pas** directement votre base de données Cloud. Pour peupler votre base Cloud, utilisez l'interface web ou des scripts personnalisés.
    *   Ce fichier doit contenir des instructions SQL `INSERT` pour vos données de test.

## Gestion des Conflits de Migration

Étant donné que la source de vérité est le Cloud et que les modifications de schéma sont faites de manière centralisée (via l'UI du Cloud), les conflits de migration au sens traditionnel (où plusieurs développeurs créent des migrations en parallèle localement) devraient être rares.

Le principal "conflit" pourrait survenir si `pnpm db:pull` ne parvient pas à interpréter correctement un changement complexe fait sur le Cloud ou si l'état local des migrations a divergé (ce qui ne devrait pas arriver si on suit le workflow).

En cas de problèmes avec `db:pull` :
1.  Assurez-vous que votre CLI Supabase est à jour.
2.  Vérifiez les logs de la commande.
3.  Consultez la documentation Supabase ou leur support.
4.  En dernier recours, vous pourriez avoir besoin de sauvegarder vos migrations locales, de réinitialiser le dossier `apps/backend/supabase/migrations` (après avoir sauvegardé le contenu important) et de refaire un `db:pull` propre, mais cela doit être fait avec une extrême prudence.

## Variables d'Environnement Clés

Assurez-vous que votre fichier `.env` (copié depuis `.env.example`) est correctement configuré :

*   `VITE_SUPABASE_URL`: URL de votre projet Supabase Cloud.
*   `VITE_SUPABASE_ANON_KEY`: Clé anonyme publique de votre projet Supabase Cloud.
*   `SUPABASE_ACCESS_TOKEN`: Votre token d'accès personnel Supabase (pour la CLI).
*   `SUPABASE_PROJECT_REF`: La référence de votre projet Supabase Cloud.

Ces variables sont cruciales pour que le frontend se connecte à la bonne instance et pour que la CLI Supabase puisse interagir avec votre projet Cloud pour `db:pull` et `gen:types`.

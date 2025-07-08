# Instructions Post-Setup pour AI Foundations

Ce fichier vous guide à travers les étapes finales nécessaires après avoir cloné le dépôt et que les modifications de la "Refonte du Setup" y ont été intégrées. Suivez ces étapes pour vous assurer que votre environnement de développement est correctement configuré et prêt à l'emploi.

## 1. Configuration Initiale (si pas déjà fait)

Si vous partez d'un clone frais ou si c'est la première fois que vous utilisez ce projet avec pnpm :

```bash
# Activez corepack (gestionnaire de versions pour pnpm/yarn)
corepack enable

# Préparez pnpm à la version spécifiée dans package.json (actuellement pnpm@10.12.2)
# Cette commande s'assure que vous utilisez la bonne version de pnpm pour ce projet.
# Note: Ajustez la version si package.json -> packageManager change.
corepack prepare pnpm@10.12.2 --activate

# Installez toutes les dépendances du projet (cela exécutera aussi `husky install`)
pnpm install
```

## 2. Configuration des Variables d'Environnement

1.  **Copiez le fichier d'exemple `.env.example` en `.env`** à la racine du projet :

    ```bash
    cp .env.example .env
    ```

2.  **Éditez le fichier `.env`** avec vos propres informations :
    - **`VITE_SUPABASE_URL`**: L'URL de votre projet Supabase Cloud (ex: `https://<votre-project-ref>.supabase.co`).
    - **`VITE_SUPABASE_ANON_KEY`**: La clé anonyme (publique) de votre projet Supabase Cloud.
    - **`SUPABASE_ACCESS_TOKEN`**: Votre token d'accès personnel Supabase. Vous pouvez le générer depuis votre compte Supabase sur [app.supabase.com/account/tokens](https://app.supabase.com/account/tokens). Ce token est nécessaire pour que la CLI Supabase puisse interagir avec votre projet Cloud (notamment pour `pnpm db:pull`).
    - **`SUPABASE_PROJECT_REF`**: La référence de votre projet Supabase Cloud (la partie `<votre-project-ref>` de l'URL).

3.  **Validez votre configuration d'environnement** :
    ```bash
    pnpm validate:env # lance scripts/validate-env.mjs
    ```
    Ce script vérifiera que toutes les variables requises sont présentes et non vides dans votre fichier `.env`.

## 3. Liaison à Supabase Cloud et Génération des Types

1.  **Connectez-vous à la CLI Supabase** (si ce n'est pas déjà fait) :

    ```bash
    pnpm --filter backend exec supabase login
    ```

    Suivez les instructions pour vous authentifier dans votre navigateur.

2.  **Liez votre projet local à votre projet Supabase Cloud** :
    La CLI devrait automatiquement utiliser `SUPABASE_PROJECT_REF` de votre `.env`.

    ```bash
    pnpm --filter backend exec supabase link
    ```

    Si cela ne fonctionne pas, vous pouvez spécifier le project-ref manuellement :

    ```bash
    # pnpm --filter backend exec supabase link --project-ref <votre_project_ref_ici>
    ```

    Cette étape est cruciale pour que `db:pull` et `gen:types` ciblent le bon projet.

3.  **Récupérez le schéma de votre base de données Cloud** :
    Cette commande va créer/mettre à jour les fichiers de migration dans `apps/backend/supabase/migrations/` pour qu'ils correspondent à votre schéma Cloud.

    ```bash
    pnpm db:pull
    ```

4.  **Générez les types TypeScript pour le Frontend** :
    Cette commande introspecte votre schéma (via le projet lié) et crée/met à jour `apps/frontend/src/types/database.types.ts`.
    ```bash
    pnpm gen:types
    ```
    **Vérifiez que le fichier `apps/frontend/src/types/database.types.ts` a bien été créé ou mis à jour.**

## 4. Démarrage de l'Environnement de Développement

Vous avez deux options principales pour lancer les services :

### Option A : Environnement Supabase Local (pour tests/exploration hors ligne)

Si vous souhaitez travailler avec une instance Supabase tournant entièrement sur votre machine (isolée du cloud) :

1.  **Démarrez l'instance Supabase locale** :

    ```bash
    pnpm db:start
    ```

    Cela lancera plusieurs conteneurs Docker (PostgreSQL, Supabase Studio, etc.).
    - Supabase Studio local sera accessible à `http://localhost:54323` (par défaut).
    - Votre base de données locale sera construite à partir des migrations présentes dans `apps/backend/supabase/migrations/` (qui devraient être le reflet de votre Cloud après `pnpm db:pull`).
    - Pour cette option, votre frontend devrait être configuré pour pointer vers l'API Supabase locale (ex: `VITE_SUPABASE_URL=http://localhost:54321` et la clé anon locale correspondante dans `.env`). **Attention : le `.env.example` actuel est configuré pour le Cloud.** Adaptez votre `.env` si vous utilisez cette option.

2.  **Démarrez vos applications** (Frontend et éventuelle API Node.js) :

    ```bash
    # Lancement standard connecté au Supabase Cloud
    docker compose up --build

    # OU avec une instance Supabase locale en plus
    docker compose --profile supabase-local up --build

    # Pour lancer le frontend sans Docker
    # pnpm dev:frontend
    ```

### Option B : Développement contre Supabase Cloud (Workflow principal)

C'est le workflow recommandé. Votre frontend se connecte directement à votre instance Supabase Cloud.

1.  **Assurez-vous que votre `.env` est configuré avec les URL et clés de VOTRE PROJET SUPABASE CLOUD.** (C'est la configuration par défaut de `.env.example`).

2.  **Démarrez vos applications** :

    ```bash
    # Pour un lancement standard
    docker compose up --build

    # Avec l'instance Supabase locale
    docker compose --profile supabase-local up --build

    # Ou en local sans Docker pour le frontend
    # pnpm dev:frontend
    ```

## 5. Accès à l'Application

- Frontend : `http://localhost:5173` (hot reload actif).

---

Vous devriez maintenant avoir un environnement de développement fonctionnel !
N'oubliez pas de consulter `README.md` pour une liste des commandes `pnpm` utiles et `docs/guides/supabase-workflow.md` pour comprendre comment gérer les modifications de schéma.

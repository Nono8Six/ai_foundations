# Workflow de Synchronisation Supabase (Cloud-First)

Ce guide explique comment mettre à jour votre environnement de développement local après avoir effectué des modifications directement sur le tableau de bord Supabase Cloud (par exemple, en modifiant une table ou en ajoutant une policy RLS).

## 🎯 Principe Fondamental : Le Cloud est la Source de Vérité

Dans notre configuration, **Supabase Cloud est la source de vérité unique** pour le schéma de la base de données. Votre environnement local doit toujours se synchroniser _depuis_ le cloud, et non l'inverse, pour éviter les conflits.

## 🔄 Comment Mettre à Jour Votre Environnement Local

Si vous n'avez pas travaillé sur le projet depuis un certain temps ou si des modifications ont été apportées sur le cloud, suivez ces étapes pour resynchroniser votre environnement local.

### Étape 1 : Prérequis

1.  **Assurez-vous que Docker Desktop est en cours d'exécution.** (Nécessaire pour que la CLI Supabase fonctionne correctement, même si vous n'utilisez pas la base de données locale).
2.  **Vérifiez que vous êtes connecté à la CLI Supabase.** Si ce n'est pas le cas, ou en cas de doute, exécutez :
    ```bash
    pnpm supabase login
    ```

### Étape 2 : Récupérer le Schéma de la Base de Données (`db:pull`)

Cette commande va inspecter votre base de données distante sur le cloud et générer un nouveau fichier de migration SQL dans `apps/backend/supabase/migrations/`. Ce fichier contient les différences entre votre dernière migration locale et l'état actuel du cloud.

```bash
pnpm db:pull
```

### Étape 3 : Mettre à Jour les Types TypeScript (`gen:types`)

C'est l'étape la plus importante pour votre code frontend. Après avoir récupéré le nouveau schéma, vous devez mettre à jour les types TypeScript pour que votre application (et votre autocomplétion) soit au courant des nouvelles tables, colonnes ou fonctions.

```bash
pnpm gen:types
```

### Étape 4 (Optionnel) : Appliquer les Changements à votre Base de Données Locale

Si vous utilisez également l'instance Supabase locale (via `pnpm db:start`) pour le développement, vous devez appliquer la nouvelle migration que vous venez de récupérer. La manière la plus sûre de garantir une synchronisation parfaite est de réinitialiser votre base de données locale.

**Attention : cette commande efface toutes les données de votre base de données locale.**

```bash
pnpm db:reset
```

---

## ✨ Le Raccourci : Le Script `sync:from-cloud`

Pour simplifier ce processus, un script `sync:from-cloud` a été ajouté. Il enchaîne les étapes 2 et 3 pour vous.

La prochaine fois que vous aurez besoin de vous synchroniser, vous pourrez simplement exécuter :

```bash
pnpm sync:from-cloud
```

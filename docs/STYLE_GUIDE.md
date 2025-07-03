# Style Guide

Ce projet utilise TypeScript avec ESLint et Prettier pour garantir une base de code cohérente.

## Bonnes pratiques

- Utilisez **ESLint** pour repérer les erreurs et respecter les conventions.
- Formatez automatiquement le code avec **Prettier** (`pnpm format`).
- Favorisez les fonctions pures et documentez les modules avec des commentaires JSDoc.
- Organisez les composants React dans des dossiers thématiques.

### TypeScript

- Évitez l'utilisation du type `any` et privilégiez les types explicites ou génériques.
- Activez le mode **strict** et des options comme `noUncheckedIndexedAccess` pour déceler les accès non sécurisés.
- Structurez les modules en séparant les types (`*.d.ts`) et le code fonctionnel.

### Gestion des erreurs

- Capturez toujours les erreurs des appels asynchrones (`try/catch` sur les `async/await`).
- Utilisez des classes d'erreur personnalisées pour fournir un contexte métier clair.
- Retournez des `Result<T>` ou objets similaires pour signaler explicitement l'échec ou le succès d'une opération.
- Consultez le document [supabase-error-handling.md](./supabase-error-handling.md) pour connaître les règles d'usage de `safeQuery` et des exceptions avec Supabase.

### Options de compilation recommandées

- `strict: true` : enforcement du typage pour réduire les bugs.
- `noImplicitOverride: true` : évite les surcharges involontaires de méthodes.
- `exactOptionalPropertyTypes: true` : différencie les propriétés manquantes de celles à `undefined`.

Pour plus de détails sur la configuration, consultez les fichiers `eslint.config.js` et `tsconfig.json` dans le dépôt.

### Hooks vs Services

Les appels Supabase qui gèrent un **état local** (chargement, erreur, actualisation) doivent vivre dans des hooks React dédiés. Le hook `useAchievements` illustre cette approche : il interroge Supabase dans un `useEffect` et expose `loading`/`error`.

À l'inverse, les opérations **pures** qui ne font que récupérer des données sont placées dans le dossier `services/`. La fonction `fetchCourses` de `src/services/courseService.ts` renvoie la liste des cours sans gérer d'état.

Les hooks peuvent s'appuyer sur ces fonctions de service pour séparer la logique d'accès aux données de la gestion d'interface.

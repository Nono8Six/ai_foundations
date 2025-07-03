# Gestion des erreurs Supabase

Ce projet utilise deux approches pour interroger la base de données :

- `safeQuery` qui renvoie toujours `{ data, error }` et journalise les erreurs.
- Les appels qui lèvent directement une exception à gérer avec `try/catch`.

## Quand utiliser `safeQuery`

- Dans les hooks ou les composants React qui gèrent un état local de chargement
  et d'erreur.
- Lorsque l'échec de la requête ne doit pas interrompre le flux de contrôle mais
  uniquement être renvoyé à l'UI.
- `safeQuery` journalise déjà les erreurs via `logError`, il n'est donc pas
  nécessaire d'ajouter un `try/catch` supplémentaire autour de la requête.

```ts
const { data, error } = await safeQuery(() => supabase.from('courses').select('*'));
if (error) {
  setError(error);
} else {
  setCourses(data ?? []);
}
```

## Quand lever des erreurs

- Dans les services ou la logique métier où l'appelant est censé gérer
  l'exception lui‑même.
- Les services peuvent utiliser `safeQuery` pour bénéficier de la journalisation
  automatique, puis lever l'erreur retournée.

```ts
export async function fetchCourses() {
  const { data, error } = await safeQuery(() => supabase.from('courses').select('*'));
  if (error) throw error;
  return data ?? [];
}
```

## Journalisation obligatoire

Chaque appel Supabase doit au minimum être journalisé avec `logError` ou
`log.error`. `safeQuery` s'en charge par défaut. Si vous n'utilisez pas
`safeQuery`, pensez à envelopper l'appel dans un `try/catch` et à y appeler
`logError`.

```ts
try {
  await supabase.from('courses').insert({ title: 'AI Basics' });
} catch (err) {
  logError(err as Error);
  throw err;
}
```

## Exemple combiné hooks et services

```ts
// service.ts
export async function uploadFile(bucket: string, file: File) {
  const { error } = await safeQuery(() => supabase.storage.from(bucket).upload(file.name, file));
  if (error) throw error;
}

// useFileUpload.ts
export function useFileUpload(bucket: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      await uploadFile(bucket, file);
      setError(null);
    } catch (err) {
      setError(err as PostgrestError);
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
```

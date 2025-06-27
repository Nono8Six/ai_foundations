-- Exemple de fichier seeds.sql
-- Ces commandes seront exécutées après les migrations lors d'un `supabase db reset` sur l'instance locale.
-- Vous pouvez y insérer des données de test ou de configuration initiales.

-- Exemple : Insertion dans une table hypothétique 'public.settings'
-- Assurez-vous que la table 'settings' et ses colonnes 'key' et 'value' existent
-- via vos fichiers de migration.

/*
INSERT INTO public.settings (key, value)
VALUES
  ('site_name', 'AI Foundations Platform'),
  ('admin_email', 'admin@example.com')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value;

INSERT INTO public.users (id, email, username, role)
VALUES
  ('8d899389-8d9c-403d-9daa-9f3a8c330503', 'user@example.com', 'testuser', 'user'),
  ('f91a843a-78f0-4cb9-906c-b580505a7805', 'admin@example.com', 'testadmin', 'admin')
ON CONFLICT (id) DO NOTHING;

*/

-- Pour l'instant, ce fichier est un placeholder.
-- Ajoutez vos propres instructions SQL de seeding ici.
SELECT 'seeds.sql exécuté avec succès (placeholder)' AS message;

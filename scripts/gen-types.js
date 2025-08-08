import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin du fichier de sortie
const outputPath = join(__dirname, '..', 'apps', 'frontend', 'src', 'types', 'database.types.ts');
const outputDir = dirname(outputPath);

// Créer le répertoire s'il n'existe pas
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

try {
  // Récupérer le project-ref depuis les variables d'environnement
  const projectRef = process.env.SUPABASE_PROJECT_REF || 'oqmllypaarqvabuvbqga';
  
  // Exécuter la commande Supabase
  const command = `supabase gen types typescript --project-id ${projectRef}`;
  
  // Utiliser console.warn pour les messages de log
  console.warn(`Exécution de : ${command}`);
  
  const types = execSync(command).toString();
  
  // Écrire les types dans le fichier
  writeFileSync(outputPath, types);
  
  console.warn(`Types générés avec succès dans : ${outputPath}`);
  process.exit(0);
} catch (error) {
  console.error('Erreur lors de la génération des types :', error.message);
  process.exit(1);
}

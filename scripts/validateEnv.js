/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

console.log('🔍 Vérification des variables d\'environnement...');

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_PROJECT_REF',
];

const envFilePath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envFilePath)) {
  console.error(`❌ ERREUR: Le fichier .env est introuvable à la racine du projet.`);
  console.error('   Veuillez copier .env.example en .env et le configurer.');
  process.exit(1);
}

const envFileContent = fs.readFileSync(envFilePath, 'utf-8');
const missingVars = [];

for (const varName of requiredEnvVars) {
  if (!envFileContent.includes(`${varName}=`)) {
    missingVars.push(varName);
  } else {
    // Vérifier si la variable a une valeur (non vide après le '=')
    const regex = new RegExp(`^${varName}=(.*)`, 'm');
    const match = envFileContent.match(regex);
    if (match && match[1].trim() === '') {
      missingVars.push(`${varName} (vide)`);
    }
  }
}

if (missingVars.length > 0) {
  console.error(`❌ ERREUR: Variables d'environnement manquantes ou vides dans le fichier .env:`);
  missingVars.forEach(mv => console.error(`   - ${mv}`));
  console.error('   Veuillez les configurer pour continuer.');
  process.exit(1);
}

console.log('✅ Toutes les variables d\'environnement requises sont présentes et configurées.');

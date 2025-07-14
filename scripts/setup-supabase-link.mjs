#!/usr/bin/env node

// scripts/setup-supabase-link.mjs
// Configure la liaison entre le projet local et Supabase cloud

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis .env
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function error(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function setupSupabaseLink() {
  console.log('🔗 Configuration de la liaison Supabase Cloud\n');

  try {
    // 0. Charger le fichier .env
    loadEnvFile();
    
    // 1. Vérifier les variables d'environnement
    log('🔍', 'Vérification des variables d\'environnement...');
    
    if (!process.env.SUPABASE_PROJECT_REF) {
      error('SUPABASE_PROJECT_REF manquant dans .env');
    }
    
    if (!process.env.SUPABASE_DB_PASSWORD) {
      error('SUPABASE_DB_PASSWORD manquant dans .env');
    }

    const projectRef = process.env.SUPABASE_PROJECT_REF;
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;
    
    log('✅', `Projet Supabase: ${projectRef}`);

    // 2. Vérifier si déjà lié
    log('🔍', 'Vérification de la liaison existante...');
    
    const workdir = 'apps/backend';
    const configFile = path.join(workdir, '.supabase', 'config.toml');
    
    if (fs.existsSync(configFile)) {
      log('⚠️', 'Projet déjà lié. Suppression de la liaison existante...');
      try {
        execSync(`supabase unlink --workdir ${workdir}`, { 
          stdio: 'pipe' 
        });
      } catch (e) {
        // Ignorer les erreurs de unlink
      }
    }

    // 3. Créer la liaison
    log('🔗', 'Création de la liaison avec Supabase cloud...');
    
    try {
      const linkCommand = `supabase link --project-ref ${projectRef} --password ${dbPassword} --workdir ${workdir}`;
      execSync(linkCommand, { 
        stdio: 'pipe' 
      });
      log('✅', 'Liaison créée avec succès');
    } catch (e) {
      error(`Échec de la liaison: ${e.message}`);
    }

    // 4. Vérifier la liaison
    log('🧪', 'Test de la liaison...');
    
    try {
      execSync(`supabase migration list --workdir ${workdir}`, { 
        stdio: 'pipe' 
      });
      log('✅', 'Liaison fonctionnelle');
    } catch (e) {
      error(`Test de liaison échoué: ${e.message}`);
    }

    // 5. Succès
    console.log();
    log('🎉', 'Configuration terminée avec succès !');
    log('💡', 'Vous pouvez maintenant utiliser:');
    log('▶️', '  pnpm db:status     - Vérifier le statut');
    log('▶️', '  pnpm db:check      - Vérifier la synchronisation');
    log('▶️', '  pnpm sync:check    - Diagnostic complet');
    
  } catch (error) {
    console.error(`❌ Erreur lors de la configuration: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la configuration
setupSupabaseLink().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
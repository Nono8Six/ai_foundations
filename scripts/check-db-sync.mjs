#!/usr/bin/env node

// scripts/check-db-sync.mjs
// Vérifie la synchronisation entre les migrations locales et le cloud Supabase

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function error(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function checkDatabaseSync() {
  log('🔍', 'Vérification de la synchronisation base de données...');
  console.log();

  try {
    // 1. Vérifier la connexion Supabase
    log('🔗', 'Test de connexion Supabase...');
    try {
      execSync('supabase status --linked', { 
        encoding: 'utf8', 
        stdio: 'pipe' 
      });
      log('✅', 'Connexion Supabase active');
    } catch (e) {
      error('Impossible de se connecter à Supabase. Vérifiez votre configuration.');
    }

    // 2. Comparer les migrations locales vs cloud
    log('📂', 'Analyse des migrations...');
    
    const migrationsDir = path.join(process.cwd(), 'apps', 'backend', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      error(`Dossier migrations introuvable: ${migrationsDir}`);
    }

    const localMigrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    log('📄', `Migrations locales trouvées: ${localMigrations.length}`);

    // 3. Obtenir le statut des migrations cloud
    try {
      const remoteMigrations = execSync('supabase migration list --linked', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const appliedCount = remoteMigrations
        .split('\n')
        .filter(line => line.includes('Applied') || line.includes('✓'))
        .length;
      
      log('☁️', `Migrations appliquées dans le cloud: ${appliedCount}`);
      
      // Comparer les comptes
      if (localMigrations.length === appliedCount) {
        log('✅', 'Migrations synchronisées');
      } else if (localMigrations.length > appliedCount) {
        log('⚠️', `${localMigrations.length - appliedCount} migration(s) locale(s) non appliquée(s)`);
        log('💡', 'Exécutez: pnpm db:push');
      } else {
        log('⚠️', `${appliedCount - localMigrations.length} migration(s) cloud non récupérée(s)`);
        log('💡', 'Exécutez: pnpm db:pull');
      }
    } catch (e) {
      log('⚠️', 'Impossible de récupérer le statut des migrations cloud');
    }

    // 4. Vérifier la fraîcheur des types TypeScript
    log('🔧', 'Vérification des types TypeScript...');
    
    const typesFile = path.join(process.cwd(), 'apps', 'frontend', 'src', 'types', 'database.types.ts');
    
    if (!fs.existsSync(typesFile)) {
      log('❌', 'Fichier de types TypeScript manquant');
      log('💡', 'Exécutez: pnpm types:gen');
    } else {
      const typesStats = fs.statSync(typesFile);
      const hoursOld = (Date.now() - typesStats.mtime.getTime()) / (1000 * 60 * 60);
      
      if (hoursOld > 24) {
        log('⚠️', `Types TypeScript datent de ${Math.round(hoursOld)}h`);
        log('💡', 'Considérez: pnpm types:gen');
      } else if (hoursOld > 1) {
        log('⏰', `Types générés il y a ${Math.round(hoursOld)}h`);
      } else {
        log('✅', 'Types TypeScript récents');
      }
    }

    // 5. Résumé final
    console.log();
    log('📊', 'Résumé de synchronisation:');
    log('🕐', `Dernière vérification: ${new Date().toLocaleString()}`);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la vérification
checkDatabaseSync().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
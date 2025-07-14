#!/usr/bin/env node

// scripts/migration-status.mjs
// Affiche le statut détaillé de chaque migration

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function getMigrationStatus() {
  console.log('📋 Statut détaillé des migrations\n');
  
  try {
    // 1. Lister les migrations locales
    const migrationsDir = path.join(process.cwd(), 'apps', 'backend', 'supabase', 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      log('❌', `Dossier migrations introuvable: ${migrationsDir}`);
      return;
    }

    const localFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (localFiles.length === 0) {
      log('📝', 'Aucune migration trouvée localement');
      return;
    }

    // 2. Obtenir le statut depuis Supabase
    let appliedMigrations = [];
    
    try {
      const remoteStatus = execSync('supabase migration list --workdir apps/backend', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      // Parser la sortie pour extraire les migrations appliquées
      appliedMigrations = remoteStatus
        .split('\n')
        .filter(line => line.includes('Applied') || line.includes('✓'))
        .map(line => {
          // Extraire le nom du fichier de migration
          const match = line.match(/(\d{8,}_.*?)(?:\s|$)/);
          return match ? match[1] : null;
        })
        .filter(Boolean);
        
    } catch (e) {
      log('⚠️', 'Impossible de récupérer le statut des migrations cloud');
      log('💡', 'Vérifiez votre connexion Supabase avec: pnpm db:status');
    }

    // 3. Afficher le statut de chaque migration
    console.log('┌─────────────────────────────────────────────────────────────┬──────────────┐');
    console.log('│ Migration                                                   │ Statut       │');
    console.log('├─────────────────────────────────────────────────────────────┼──────────────┤');

    localFiles.forEach(file => {
      const fileName = path.parse(file).name;
      const isApplied = appliedMigrations.some(applied => 
        applied && (applied.includes(fileName) || fileName.includes(applied))
      );
      
      const status = isApplied ? '✅ Appliquée' : '⏳ En attente';
      const paddedFile = file.padEnd(59);
      
      console.log(`│ ${paddedFile} │ ${status.padEnd(12)} │`);
    });

    console.log('└─────────────────────────────────────────────────────────────┴──────────────┘');

    // 4. Résumé
    const appliedCount = localFiles.filter(file => {
      const fileName = path.parse(file).name;
      return appliedMigrations.some(applied => 
        applied && (applied.includes(fileName) || fileName.includes(applied))
      );
    }).length;

    const pendingCount = localFiles.length - appliedCount;

    console.log();
    log('📊', `Total: ${localFiles.length} migrations`);
    log('✅', `Appliquées: ${appliedCount}`);
    
    if (pendingCount > 0) {
      log('⏳', `En attente: ${pendingCount}`);
      log('💡', 'Pour appliquer les migrations en attente: pnpm db:push');
    } else {
      log('🎉', 'Toutes les migrations sont appliquées !');
    }

    // 5. Afficher les migrations les plus récentes
    if (localFiles.length > 0) {
      console.log();
      const latestMigration = localFiles[localFiles.length - 1];
      const migrationPath = path.join(migrationsDir, latestMigration);
      const stats = fs.statSync(migrationPath);
      
      log('🕐', `Dernière migration: ${latestMigration}`);
      log('📅', `Créée le: ${stats.birthtime.toLocaleString()}`);
    }
    
  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter l'analyse
getMigrationStatus();
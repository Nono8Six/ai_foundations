#!/usr/bin/env node

// scripts/check-types-sync.mjs  
// Vérifie la validité et la fraîcheur des types TypeScript générés depuis Supabase

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(emoji, message) {
  console.log(`${emoji} ${message}`);
}

function checkTypesSync() {
  console.log('🔍 Vérification des types TypeScript\n');
  
  try {
    const typesFile = path.join(process.cwd(), 'apps', 'frontend', 'src', 'types', 'database.types.ts');
    
    // 1. Vérifier l'existence du fichier
    if (!fs.existsSync(typesFile)) {
      log('❌', 'Fichier de types manquant');
      log('📁', `Chemin attendu: ${typesFile}`);
      log('💡', 'Exécutez: pnpm types:gen');
      return;
    }

    // 2. Analyser le contenu
    const content = fs.readFileSync(typesFile, 'utf8');
    const stats = fs.statSync(typesFile);
    
    // Vérifications de validité du contenu
    const checks = {
      hasExportDatabase: content.includes('export type Database'),
      hasTables: content.includes('Tables:'),
      hasViews: content.includes('Views:'),
      hasFunctions: content.includes('Functions:'),
      hasEnums: content.includes('Enums:'),
      hasSupabaseMetadata: content.includes('__InternalSupabase'),
      isNotEmpty: content.trim().length > 100,
      noSyntaxErrors: !content.includes('SyntaxError') && !content.includes('undefined')
    };

    // 3. Rapport de validité
    log('📋', 'Analyse du contenu:');
    
    Object.entries(checks).forEach(([check, isValid]) => {
      const checkNames = {
        hasExportDatabase: 'Export type Database',
        hasTables: 'Tables définies',
        hasViews: 'Views définies', 
        hasFunctions: 'Functions définies',
        hasEnums: 'Enums définies',
        hasSupabaseMetadata: 'Métadonnées Supabase',
        isNotEmpty: 'Contenu suffisant',
        noSyntaxErrors: 'Pas d\'erreurs syntaxe'
      };
      
      const status = isValid ? '✅' : '❌';
      log(status, checkNames[check]);
    });

    // 4. Analyser la fraîcheur
    const now = Date.now();
    const ageMs = now - stats.mtime.getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    const ageDays = ageHours / 24;

    console.log();
    log('🕐', 'Analyse temporelle:');
    log('📅', `Dernière modification: ${stats.mtime.toLocaleString()}`);
    
    if (ageHours < 1) {
      log('🟢', `Généré il y a ${Math.round(ageMs / (1000 * 60))} minutes`);
    } else if (ageHours < 24) {
      log('🟡', `Généré il y a ${Math.round(ageHours)} heures`);
    } else {
      log('🔴', `Généré il y a ${Math.round(ageDays)} jours`);
    }

    // 5. Recommandations
    console.log();
    log('💡', 'Recommandations:');

    const allChecksPass = Object.values(checks).every(check => check);
    
    if (!allChecksPass) {
      log('🔧', 'Types corrompus ou invalides détectés');
      log('▶️', 'Action: pnpm types:gen');
    } else if (ageHours > 24) {
      log('⏰', 'Types datent de plus de 24h');
      log('▶️', 'Action recommandée: pnpm types:gen');
    } else if (ageHours > 4) {
      log('⏳', 'Types peuvent être obsolètes');
      log('▶️', 'Action optionnelle: pnpm types:gen');
    } else {
      log('✅', 'Types à jour et valides');
      log('🎉', 'Aucune action requise');
    }

    // 6. Statistiques du fichier
    console.log();
    log('📊', 'Statistiques:');
    const lines = content.split('\n').length;
    const sizeKB = Math.round(stats.size / 1024);
    const tables = (content.match(/\w+: \{$/gm) || []).length;
    
    log('📄', `${lines} lignes, ${sizeKB}KB`);
    log('🗂️', `~${tables} tables/types détectés`);

    // 7. Test de syntaxe basique
    const hasValidSyntax = !content.includes('SyntaxError') && 
                          !content.includes('undefined') &&
                          content.includes('export type Database');
    
    if (hasValidSyntax) {
      log('✅', 'Syntaxe TypeScript semble valide');
    } else {
      log('❌', 'Erreurs de syntaxe possibles détectées');
      log('🔧', 'Régénération recommandée: pnpm types:gen');
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter la vérification
checkTypesSync();
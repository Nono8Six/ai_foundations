#!/usr/bin/env node
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { log } from '../libs/logger/index.js';

log.info("🔍 Vérification des variables d'environnement...");

const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_PROJECT_REF',
];

const envFilePath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envFilePath)) {
  log.error('❌ Fichier .env introuvable. Copiez .env.example vers .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envFilePath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=')];
    }),
);

const missingVars = requiredEnvVars.filter(
  name => !env[name] || env[name].trim() === '',
);

if (missingVars.length > 0) {
  log.error(`❌ Variables manquantes: ${missingVars.join(', ')}`);
  process.exit(1);
}

log.info('✅ Toutes les variables requises sont présentes');

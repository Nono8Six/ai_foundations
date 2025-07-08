#!/usr/bin/env node
/* eslint-env node */
import fs from 'node:fs';
import path from 'node:path';
import { log } from '../libs/logger/index.js';

log.info("\uD83D\uDD0D Validation du fichier .env...");

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_PROJECT_REF',
];

const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  log.error('❌ Fichier .env introuvable. Copiez .env.example vers .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [key, ...val] = line.split('=');
      return [key.trim(), val.join('=')];
    }),
);

const missing = requiredVars.filter(key => !env[key] || env[key].trim() === '');
if (missing.length > 0) {
  log.error(`❌ Variables manquantes: ${missing.join(', ')}`);
  process.exit(1);
}

log.info('✅ .env valide');

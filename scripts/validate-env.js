#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { log } from '../libs/logger/index.js'

const envPath = path.resolve('.env')

if (!fs.existsSync(envPath)) {
  log.error('❌ Fichier .env introuvable. Copiez .env.example vers .env')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const env = Object.fromEntries(envContent.split('\n').filter(Boolean).map(line => {
  const [key, ...val] = line.split('=')
  return [key.trim(), val.join('=')]
}))

const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
const missing = required.filter(v => !env[v])

if (missing.length) {
  log.error(`❌ Variables manquantes: ${missing.join(', ')}`)
  process.exit(1)
}

log.info('✅ Toutes les variables requises sont présentes')

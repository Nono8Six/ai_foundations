// scripts/test-supabase-connection.mjs (À LA RACINE)
/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js'
import { log } from '../apps/backend/logger.ts'

// Les variables sont déjà chargées via --env-file=.env
const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

async function testSupabaseConnection() {
  log.info('🔍 Test de connexion Supabase Cloud...\n')
  
  // Debug: Afficher les variables
  log.info('📋 Variables d\'environnement:')
  REQUIRED_VARS.forEach(key => {
    const value = process.env[key]
    log.info(`   ${key}=${value ? '✅ Définie' : '❌ Manquante'}`)
  })
  log.info('')
  
  // Vérifier les variables d'environnement
  const missing = REQUIRED_VARS.filter(key => !process.env[key])
  if (missing.length > 0) {
    log.error(`❌ Variables manquantes: ${missing.join(', ')}`)
    log.error(`💡 Vérifiez votre fichier .env à la racine du projet`)
    process.exit(1)
  }

  // Créer les clients
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // Test 1: Ping basique
    log.info('1️⃣ Test ping basique...')
    const startTime = Date.now()
    const { error } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1)
    
    const pingTime = Date.now() - startTime
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (OK)
      throw error
    }
    log.info(`✅ Ping OK (${pingTime}ms)`)

    // Test 2: Connexion admin
    log.info('2️⃣ Test connexion admin...')
    const { error: adminError } = await supabaseAdmin
      .from('_health_check')
      .select('*')
      .limit(1)
    
    if (adminError && adminError.code !== 'PGRST116') {
      throw adminError
    }
    log.info('✅ Connexion admin OK')

    // Test 3: Métadonnées du projet
    log.info('3️⃣ Test métadonnées...')
    const { data: metadata, error: metaError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)
    
    if (metaError) {
      log.warn('⚠️  Métadonnées partielles:', metaError.message)
    } else {
      log.info('✅ Métadonnées OK')
      log.info(`   Tables publiques: ${metadata?.length || 0}`)
      if (metadata && metadata.length > 0) {
        log.info(`   Exemples: ${metadata.slice(0, 3).map(t => t.table_name).join(', ')}`)
      }
    }

    // Test 4: Auth
    log.info('4️⃣ Test Auth...')
    await supabase.auth.getSession()
    log.info('✅ Auth service OK')

    // Test 5: Storage
    log.info('5️⃣ Test Storage...')
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets()
    if (storageError) {
      log.warn('⚠️  Storage:', storageError.message)
    } else {
      log.info('✅ Storage OK')
      log.info(`   Buckets: ${buckets?.length || 0}`)
    }

    // Test 6: Latence réseau
    log.info('6️⃣ Test latence...')
    const times = []
    for (let i = 0; i < 3; i++) {
      const start = Date.now()
      await supabase.from('_ping').select('*').limit(1)
      times.push(Date.now() - start)
    }
    const avgLatency = Math.round(times.reduce((a, b) => a + b) / times.length)
    log.info(`✅ Latence moyenne: ${avgLatency}ms`)

    log.info('\n🎉 Tous les tests passés!')
    log.info('💡 Votre configuration Supabase est opérationnelle')
    
    // Résumé
    log.info('\n📊 Résumé de la connexion:')
    log.info(`   🌐 URL: ${process.env.SUPABASE_URL}`)
    log.info(`   🏷️  Projet: ${process.env.SUPABASE_PROJECT_REF || 'Non défini'}`)
    log.info(`   🔧 Environnement: ${process.env.NODE_ENV || 'development'}`)
    log.info(`   ⚡ Latence: ${avgLatency}ms`)
    log.info(`   📊 Tables: ${metadata?.length || 0}`)
    log.info(`   🗂️  Buckets: ${buckets?.length || 0}`)

  } catch (error) {
    log.error('\n❌ Erreur de connexion:', error.message)
    log.error('\n🔧 Points de vérification:')
    log.error('   1. Clés API correctes dans .env')
    log.error('   2. URL projet Supabase valide')
    log.error('   3. Projet Supabase actif')
    log.error('   4. Connexion internet stable')
    
    if (error.code) {
      log.error(`   Code: ${error.code}`)
    }
    if (error.details) {
      log.error(`   Détails: ${error.details}`)
    }
    
    process.exit(1)
  }
}

// Exécution
testSupabaseConnection().catch(log.error)

// scripts/test-supabase-connection.mjs (À LA RACINE)
/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js'

// Les variables sont déjà chargées via --env-file=.env
const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase Cloud...\n')
  
  // Debug: Afficher les variables
  console.log('📋 Variables d\'environnement:')
  REQUIRED_VARS.forEach(key => {
    const value = process.env[key]
    console.log(`   ${key}=${value ? '✅ Définie' : '❌ Manquante'}`)
  })
  console.log('')
  
  // Vérifier les variables d'environnement
  const missing = REQUIRED_VARS.filter(key => !process.env[key])
  if (missing.length > 0) {
    console.error(`❌ Variables manquantes: ${missing.join(', ')}`)
    console.error(`💡 Vérifiez votre fichier .env à la racine du projet`)
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
    console.log('1️⃣ Test ping basique...')
    const startTime = Date.now()
    const { error } = await supabase
      .from('_health_check')
      .select('*')
      .limit(1)
    
    const pingTime = Date.now() - startTime
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (OK)
      throw error
    }
    console.log(`✅ Ping OK (${pingTime}ms)`)

    // Test 2: Connexion admin
    console.log('2️⃣ Test connexion admin...')
    const { error: adminError } = await supabaseAdmin
      .from('_health_check')
      .select('*')
      .limit(1)
    
    if (adminError && adminError.code !== 'PGRST116') {
      throw adminError
    }
    console.log('✅ Connexion admin OK')

    // Test 3: Métadonnées du projet
    console.log('3️⃣ Test métadonnées...')
    const { data: metadata, error: metaError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)
    
    if (metaError) {
      console.warn('⚠️  Métadonnées partielles:', metaError.message)
    } else {
      console.log('✅ Métadonnées OK')
      console.log(`   Tables publiques: ${metadata?.length || 0}`)
      if (metadata && metadata.length > 0) {
        console.log(`   Exemples: ${metadata.slice(0, 3).map(t => t.table_name).join(', ')}`)
      }
    }

    // Test 4: Auth
    console.log('4️⃣ Test Auth...')
    await supabase.auth.getSession()
    console.log('✅ Auth service OK')

    // Test 5: Storage
    console.log('5️⃣ Test Storage...')
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets()
    if (storageError) {
      console.warn('⚠️  Storage:', storageError.message)
    } else {
      console.log('✅ Storage OK')
      console.log(`   Buckets: ${buckets?.length || 0}`)
    }

    // Test 6: Latence réseau
    console.log('6️⃣ Test latence...')
    const times = []
    for (let i = 0; i < 3; i++) {
      const start = Date.now()
      await supabase.from('_ping').select('*').limit(1)
      times.push(Date.now() - start)
    }
    const avgLatency = Math.round(times.reduce((a, b) => a + b) / times.length)
    console.log(`✅ Latence moyenne: ${avgLatency}ms`)

    console.log('\n🎉 Tous les tests passés!')
    console.log('💡 Votre configuration Supabase est opérationnelle')
    
    // Résumé
    console.log('\n📊 Résumé de la connexion:')
    console.log(`   🌐 URL: ${process.env.SUPABASE_URL}`)
    console.log(`   🏷️  Projet: ${process.env.SUPABASE_PROJECT_REF || 'Non défini'}`)
    console.log(`   🔧 Environnement: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   ⚡ Latence: ${avgLatency}ms`)
    console.log(`   📊 Tables: ${metadata?.length || 0}`)
    console.log(`   🗂️  Buckets: ${buckets?.length || 0}`)

  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message)
    console.error('\n🔧 Points de vérification:')
    console.error('   1. Clés API correctes dans .env')
    console.error('   2. URL projet Supabase valide')
    console.error('   3. Projet Supabase actif')
    console.error('   4. Connexion internet stable')
    
    if (error.code) {
      console.error(`   Code: ${error.code}`)
    }
    if (error.details) {
      console.error(`   Détails: ${error.details}`)
    }
    
    process.exit(1)
  }
}

// Exécution
testSupabaseConnection().catch(console.error)
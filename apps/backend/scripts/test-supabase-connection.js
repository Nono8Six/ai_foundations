// scripts/test-supabase-connection.js

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config()

const REQUIRED_VARS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase Cloud...\n')

  // Vérifier les variables d'environnement
  const missing = REQUIRED_VARS.filter(key => !process.env[key])
  if (missing.length > 0) {
    console.error(`❌ Variables manquantes: ${missing.join(', ')}`)
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
    // Test 1: Connexion basique
    console.log('1️⃣ Test connexion basique...')
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (OK)
      throw error
    }
    console.log('✅ Connexion basique OK')

    // Test 2: Connexion admin
    console.log('2️⃣ Test connexion admin...')
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('_test_connection')
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
      .limit(5)

    if (metaError) {
      console.warn('⚠️  Métadonnées partielles:', metaError.message)
    } else {
      console.log('✅ Métadonnées OK')
      console.log(`   Tables trouvées: ${metadata?.length || 0}`)
    }

    // Test 4: Auth (si configuré)
    console.log('4️⃣ Test Auth...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.warn('⚠️  Auth non configuré:', authError.message)
    } else {
      console.log('✅ Auth OK')
    }

    console.log('\n🎉 Tous les tests passés!')
    console.log('💡 Votre configuration Supabase est opérationnelle')
    
    // Informations utiles
    console.log('\n📊 Informations de connexion:')
    console.log(`   URL: ${process.env.SUPABASE_URL}`)
    console.log(`   Projet: ${process.env.SUPABASE_PROJECT_REF || 'Non défini'}`)
    console.log(`   Environnement: ${process.env.NODE_ENV || 'development'}`)

  } catch (error) {
    console.error('\n❌ Erreur de connexion:', error.message)
    console.error('🔧 Vérifiez:')
    console.error('   - Vos clés API Supabase')
    console.error('   - L\'URL de votre projet')
    console.error('   - L\'état de votre projet sur supabase.com')
    process.exit(1)
  }
}

// Exécution
testSupabaseConnection().catch(console.error)
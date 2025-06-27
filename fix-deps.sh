#!/bin/sh
set -e

echo "🔧 Correction des dépendances obsolètes..."

# Supprimer les modules obsolètes s'ils existent
echo "🗑️ Suppression des packages obsolètes..."

# Dans le package.json racine, remplacer/supprimer les packages obsolètes
if [ -f "package.json" ]; then
  echo "📝 Mise à jour du package.json racine..."
  
  # Créer une version temporaire sans les packages obsolètes
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Supprimer les packages obsolètes des devDependencies
    if (pkg.devDependencies) {
      delete pkg.devDependencies['inflight'];
      delete pkg.devDependencies['glob'];
      delete pkg.devDependencies['rimraf'];
      delete pkg.devDependencies['@humanwhocodes/object-schema'];
      delete pkg.devDependencies['@humanwhocodes/config-array'];
    }
    
    fs.writeFileSync('package.json.tmp', JSON.stringify(pkg, null, 2));
  " && mv package.json.tmp package.json
fi

# Faire de même pour les sous-projets
if [ -d "apps/frontend" ]; then
  cd apps/frontend
  if [ -f "package.json" ]; then
    echo "📝 Mise à jour du package.json frontend..."
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (pkg.devDependencies) {
        delete pkg.devDependencies['inflight'];
        delete pkg.devDependencies['glob'];
        delete pkg.devDependencies['rimraf'];
        delete pkg.devDependencies['@humanwhocodes/object-schema'];
        delete pkg.devDependencies['@humanwhocodes/config-array'];
      }
      
      fs.writeFileSync('package.json.tmp', JSON.stringify(pkg, null, 2));
    " && mv package.json.tmp package.json
  fi
  cd ../..
fi

if [ -d "apps/backend" ]; then
  cd apps/backend
  if [ -f "package.json" ]; then
    echo "📝 Mise à jour du package.json backend..."
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (pkg.devDependencies) {
        delete pkg.devDependencies['inflight'];
        delete pkg.devDependencies['glob'];
        delete pkg.devDependencies['rimraf'];
        delete pkg.devDependencies['@humanwhocodes/object-schema'];
        delete pkg.devDependencies['@humanwhocodes/config-array'];
      }
      
      fs.writeFileSync('package.json.tmp', JSON.stringify(pkg, null, 2));
    " && mv package.json.tmp package.json
  fi
  cd ../..
fi

echo "✅ Nettoyage des dépendances terminé"

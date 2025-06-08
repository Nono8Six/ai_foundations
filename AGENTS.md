# Guide pour Codex - IA Foundations LMS

## 📁 Structure du Projet
- `/src` - Code source principal
  - `/components` - Composants React réutilisables
  - `/pages` - Pages de l'application
  - `/services` - Appels API et logique métier
  - `/styles` - Fichiers de style globaux
  - `/utils` - Utilitaires et helpers
- `/public` - Fichiers statiques
- `vite.config.js` - Configuration Vite
- `tailwind.config.js` - Configuration Tailwind CSS

## 🛠️ Configuration de l'Environnement
- Node.js 18+
- pnpm (recommandé) ou npm
- PostgreSQL (pour la base de données en développement)

## 🚀 Commandes Utiles
```bash
# Installation des dépendances
pnpm install

# Démarrer en mode développement
pnpm dev

# Construire pour la production
pnpm build

# Lancer les tests
pnpm test
```

## 🧪 Tests
- Utilisez Vitest pour les tests unitaires
- Les tests doivent être placés dans le dossier `__tests__` à côté des fichiers testés
- Exécutez `pnpm test` pour lancer les tests

## 🧹 Linting & Formatage
- ESLint pour le linting
- Prettier pour le formatage
- Exécutez `pnpm lint` pour vérifier le code

## 📦 Gestion des Dépendances
- Utilisez pnpm pour une meilleure gestion des dépendances
- Mettez à jour régulièrement les dépendances avec `pnpm update`

## 🔒 Sécurité
- Ne committez jamais de données sensibles dans le code
- Utilisez des variables d'environnement pour les secrets
- Vérifiez les vulnérabilités avec `pnpm audit`

## 🚀 Déploiement
- Le déploiement se fait via Vercel/Netlify
- La branche `main` est déployée automatiquement

## 📝 Bonnes Pratiques
- Écrivez des composants réutilisables
- Documentez les props avec PropTypes ou TypeScript
- Suivez les conventions de nommage React
- Gardez les composants petits et ciblés

## 🐛 Débogage
- Utilisez les React DevTools pour inspecter les composants
- Les logs de développement sont disponibles dans la console du navigateur
- Activez le mode strict dans React pour détecter les problèmes potentiels

## 🤖 Pour Codex
- Ce projet utilise Vite + React + TypeScript + Tailwind CSS
- Les composants principaux sont dans `/src/components`
- Les styles sont gérés avec Tailwind CSS et des fichiers CSS personnalisés
- Les requêtes API utilisent Axios et sont définies dans `/src/services`

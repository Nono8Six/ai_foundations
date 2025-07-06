// commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Permet les commits sans type (ex: "correction supabase")
    'type-empty': [0, 'always'],
    // Désactivé car le parseur échoue sans type, rendant le sujet nul
    'subject-empty': [0, 'always'],
    // Assure que le message de commit n'est pas vide (au moins 3 caractères)
    'header-min-length': [2, 'always', 3],
  },
};

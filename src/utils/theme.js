import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

// Exporter les couleurs résolues pour les utiliser dans les composants JS (par exemple, les graphiques)
export const colors = fullConfig.theme.colors;

// Exporter le thème complet si d'autres valeurs sont nécessaires plus tard
export const theme = fullConfig.theme;

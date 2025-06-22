import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

// Exporter les couleurs résolues pour les utiliser dans les composants JS (par exemple, les graphiques)
export const colors: Record<string, unknown> =
  fullConfig.theme.colors as Record<string, unknown>;

// Exporter le thème complet si d'autres valeurs sont nécessaires plus tard
export const theme: Record<string, unknown> = fullConfig.theme as Record<
  string,
  unknown
>;

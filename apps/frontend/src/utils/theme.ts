import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

// Export the resolved colors so they can be used in JS/TS components (for example charts)
export const colors: Record<string, string> = fullConfig.theme.colors as Record<string, string>;

// Exporter le thème complet si d'autres valeurs sont nécessaires plus tard
export const theme: Record<string, unknown> = fullConfig.theme as Record<string, unknown>;

/**
 * Logger pour le frontend
 * Fournit des méthodes de logging avec différents niveaux de sévérité
 */

// Niveaux de log
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

// Configuration du logger
const config = {
  // Niveau de log minimum (tous les logs de niveau inférieur seront ignorés)
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,

  // Préfixe pour les logs
  prefix: '[Frontend]',
};

// Fonction utilitaire pour formater les messages de log
const formatMessage = (level: string, message: string, ...args: any[]): string => {
  const timestamp = new Date().toISOString();
  return `${timestamp} ${config.prefix} [${level}] ${message} ${
    args.length > 0 ? JSON.stringify(args, null, 2) : ''
  }`;
};

// Implémentation des méthodes de log
export const log = {
  debug: (message: string, ...args: any[]): void => {
    if (config.level <= LogLevel.DEBUG) {
      console.debug(formatMessage('DEBUG', message, ...args));
    }
  },

  info: (message: string, ...args: any[]): void => {
    if (config.level <= LogLevel.INFO) {
      console.info(formatMessage('INFO', message, ...args));
    }
  },

  warn: (message: string, ...args: any[]): void => {
    if (config.level <= LogLevel.WARN) {
      console.warn(formatMessage('WARN', message, ...args));
    }
  },

  error: (message: string, ...args: any[]): void => {
    if (config.level <= LogLevel.ERROR) {
      console.error(formatMessage('ERROR', message, ...args));
    }
  },
};

// Exporter une fonction de log par défaut pour la compatibilité avec le code existant
const defaultLog = log.info;
export default defaultLog;

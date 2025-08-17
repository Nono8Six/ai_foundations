/**
 * useIdempotentAction Hook - Anti Double-Submit
 * 
 * Features:
 * - SSR-safe (guards window/sessionStorage, fallback Map in-memory)
 * - Re-entry returns same Promise (no duplicate calls)
 * - Auto-cleanup on settle (success/error)
 * - Optional abort() capability
 * - Type-safe with generics
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import { log } from '@libs/logger';

// Storage abstraction pour SSR safety
interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

// SessionStorage wrapper avec fallback
class SafeSessionStorage implements StorageAdapter {
  private fallbackMap = new Map<string, string>();
  private isSupported = false;

  constructor() {
    // Test SSR-safe pour sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const testKey = '__test_storage__';
        window.sessionStorage.setItem(testKey, 'test');
        window.sessionStorage.removeItem(testKey);
        this.isSupported = true;
      }
    } catch (error) {
      // sessionStorage non disponible (SSR, incognito, etc.)
      this.isSupported = false;
    }
  }

  get(key: string): string | null {
    if (this.isSupported) {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        // Fallback en cas d'erreur
      }
    }
    return this.fallbackMap.get(key) || null;
  }

  set(key: string, value: string): void {
    if (this.isSupported) {
      try {
        window.sessionStorage.setItem(key, value);
        return;
      } catch {
        // Fallback en cas d'erreur
      }
    }
    this.fallbackMap.set(key, value);
  }

  remove(key: string): void {
    if (this.isSupported) {
      try {
        window.sessionStorage.removeItem(key);
      } catch {
        // Fallback en cas d'erreur
      }
    }
    this.fallbackMap.delete(key);
  }
}

// Instance globale du storage adapter
const safeStorage = new SafeSessionStorage();

// Cache global des promises en cours (par clé d'idempotence)
const activePromises = new Map<string, Promise<any>>();

// Contrôleurs d'abort par clé
const abortControllers = new Map<string, AbortController>();

/**
 * Interface de retour du hook
 */
export interface IdempotentActionResult<T> {
  /** Exécute l'action de manière idempotente */
  run: () => Promise<T>;
  
  /** Indique si une action est en cours pour cette clé */
  pending: boolean;
  
  /** Réinitialise l'état (clear cache et pending) */
  reset: () => void;
  
  /** Annule l'action en cours (optionnel) */
  abort: () => void;
  
  /** Dernière erreur rencontrée */
  error: Error | null;
  
  /** Dernier résultat réussi */
  lastResult: T | null;
}

/**
 * Options pour configurer le comportement du hook
 */
export interface IdempotentActionOptions {
  /** Timeout en ms pour l'action (défaut: 30000) */
  timeoutMs?: number;
  
  /** Si true, garde le résultat en cache après succès */
  cacheResult?: boolean;
  
  /** Si true, log les actions pour debug */
  debug?: boolean;
  
  /** Fonction appelée en cas d'erreur */
  onError?: (error: Error) => void;
  
  /** Fonction appelée en cas de succès */
  onSuccess?: (result: T) => void;
}

/**
 * Hook pour actions idempotentes avec protection anti double-submit
 * 
 * @param key - Clé d'idempotence unique (utiliser makeIdempotencyKey)
 * @param fn - Fonction async à exécuter
 * @param options - Options de configuration
 * @returns Objet avec run, pending, reset, abort, etc.
 * 
 * @example
 * ```typescript
 * const { run, pending, reset, abort } = useIdempotentAction(
 *   makeIdempotencyKey({
 *     kind: 'lesson',
 *     userId: user.id,
 *     identifier: lesson.id
 *   }),
 *   () => XPRpc.creditXp({
 *     userId: user.id,
 *     sourceRef: 'lesson:completion',
 *     xpDelta: 50,
 *     idempotencyKey: key
 *   }),
 *   { debug: true }
 * );
 * 
 * // Dans le composant
 * <button 
 *   onClick={run} 
 *   disabled={pending}
 * >
 *   {pending ? 'En cours...' : 'Terminer la leçon'}
 * </button>
 * ```
 */
export function useIdempotentAction<T>(
  key: string,
  fn: (signal?: AbortSignal) => Promise<T>,
  options: IdempotentActionOptions = {}
): IdempotentActionResult<T> {
  const {
    timeoutMs = 30000,
    cacheResult = false,
    debug = false,
    onError,
    onSuccess
  } = options;

  // État local du hook
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResult, setLastResult] = useState<T | null>(null);

  // Refs pour éviter les stale closures
  const fnRef = useRef(fn);
  const optionsRef = useRef(options);
  
  // Mise à jour des refs
  useEffect(() => {
    fnRef.current = fn;
    optionsRef.current = options;
  }, [fn, options]);

  // Cleanup au démontage du composant
  useEffect(() => {
    return () => {
      // Nettoyer les ressources pour cette clé si le composant se démonte
      if (abortControllers.has(key)) {
        abortControllers.get(key)?.abort();
        abortControllers.delete(key);
      }
    };
  }, [key]);

  /**
   * Exécute l'action de manière idempotente
   */
  const run = useCallback(async (): Promise<T> => {
    if (debug) {
      log.debug(`[IdempotentAction] Starting action for key: ${key}`);
    }

    // Vérifier si une action est déjà en cours pour cette clé
    const existingPromise = activePromises.get(key);
    if (existingPromise) {
      if (debug) {
        log.debug(`[IdempotentAction] Returning existing promise for key: ${key}`);
      }
      setPending(true);
      return existingPromise;
    }

    // Vérifier le cache si activé
    if (cacheResult) {
      const cachedResult = safeStorage.get(`idempotent_result_${key}`);
      if (cachedResult) {
        try {
          const parsed = JSON.parse(cachedResult);
          if (debug) {
            log.debug(`[IdempotentAction] Returning cached result for key: ${key}`);
          }
          setLastResult(parsed);
          return parsed;
        } catch {
          // Cache corrompu, continuer
          safeStorage.remove(`idempotent_result_${key}`);
        }
      }
    }

    // Créer un nouveau AbortController pour cette action
    const abortController = new AbortController();
    abortControllers.set(key, abortController);

    // Timeout automatique
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    setPending(true);
    setError(null);

    // Créer et stocker la nouvelle promise
    const actionPromise = (async (): Promise<T> => {
      try {
        const result = await fnRef.current(abortController.signal);
        
        // Succès
        if (debug) {
          log.debug(`[IdempotentAction] Action succeeded for key: ${key}`, result);
        }
        
        setLastResult(result);
        setError(null);
        
        // Cache le résultat si demandé
        if (cacheResult) {
          try {
            safeStorage.set(`idempotent_result_${key}`, JSON.stringify(result));
          } catch {
            // Ignore cache errors
          }
        }
        
        // Callback de succès
        if (optionsRef.current.onSuccess) {
          optionsRef.current.onSuccess(result);
        }
        
        return result;
        
      } catch (error) {
        const actionError = error instanceof Error ? error : new Error(String(error));
        
        if (debug) {
          log.error(`[IdempotentAction] Action failed for key: ${key}`, actionError);
        }
        
        setError(actionError);
        setLastResult(null);
        
        // Callback d'erreur
        if (optionsRef.current.onError) {
          optionsRef.current.onError(actionError);
        }
        
        throw actionError;
        
      } finally {
        // Cleanup dans tous les cas
        clearTimeout(timeoutId);
        setPending(false);
        activePromises.delete(key);
        abortControllers.delete(key);
        
        if (debug) {
          log.debug(`[IdempotentAction] Cleanup completed for key: ${key}`);
        }
      }
    })();

    // Stocker la promise pour éviter les doublons
    activePromises.set(key, actionPromise);

    return actionPromise;
  }, [key, timeoutMs, cacheResult, debug]);

  /**
   * Réinitialise l'état (cache et pending)
   */
  const reset = useCallback(() => {
    if (debug) {
      log.debug(`[IdempotentAction] Resetting state for key: ${key}`);
    }
    
    // Annuler l'action en cours si elle existe
    const controller = abortControllers.get(key);
    if (controller) {
      controller.abort();
      abortControllers.delete(key);
    }
    
    // Nettoyer le cache
    activePromises.delete(key);
    if (cacheResult) {
      safeStorage.remove(`idempotent_result_${key}`);
    }
    
    // Reset état local
    setPending(false);
    setError(null);
    setLastResult(null);
  }, [key, cacheResult, debug]);

  /**
   * Annule l'action en cours
   */
  const abort = useCallback(() => {
    if (debug) {
      log.debug(`[IdempotentAction] Aborting action for key: ${key}`);
    }
    
    const controller = abortControllers.get(key);
    if (controller) {
      controller.abort();
    }
  }, [key, debug]);

  return {
    run,
    pending,
    reset,
    abort,
    error,
    lastResult
  };
}

/**
 * Hook simplifié pour les cas d'usage courants
 */
export function useIdempotentXPAction<T>(
  actionKey: string,
  xpAction: () => Promise<T>,
  options?: Omit<IdempotentActionOptions, 'debug'>
): IdempotentActionResult<T> {
  return useIdempotentAction(
    actionKey,
    xpAction,
    { 
      ...options, 
      debug: process.env.NODE_ENV === 'development'
    }
  );
}

/**
 * Utilitaires pour nettoyage global (tests, dev tools)
 */
export const IdempotentActionUtils = {
  /**
   * Nettoie toutes les promises actives (pour tests)
   */
  clearAll(): void {
    for (const controller of abortControllers.values()) {
      controller.abort();
    }
    activePromises.clear();
    abortControllers.clear();
  },

  /**
   * Retourne les clés actives (pour debug)
   */
  getActiveKeys(): string[] {
    return Array.from(activePromises.keys());
  },

  /**
   * Nettoie le cache pour une clé spécifique
   */
  clearCache(key: string): void {
    safeStorage.remove(`idempotent_result_${key}`);
  },

  /**
   * Nettoie tout le cache
   */
  clearAllCache(): void {
    // Pas de méthode pour lister toutes les clés sessionStorage
    // Les développeurs devront appeler clearCache() individuellement
    // ou compter sur l'expiration naturelle du sessionStorage
  }
};
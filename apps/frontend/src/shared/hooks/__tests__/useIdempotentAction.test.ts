/**
 * Tests useIdempotentAction Hook - Anti Double-Submit
 * 
 * Vérifie:
 * - Double clic → même Promise
 * - Pending bloque re-entrée  
 * - Cleanup OK
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdempotentAction, IdempotentActionUtils } from '../useIdempotentAction';

// Mock du logger
vi.mock('@libs/logger', () => ({
  log: {
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

describe('useIdempotentAction Hook', () => {
  
  beforeEach(() => {
    // Clean state before each test
    IdempotentActionUtils.clearAll();
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean state after each test
    IdempotentActionUtils.clearAll();
  });

  it('double clic → même Promise', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const key = 'test-key-double-click';
    
    const { result } = renderHook(() => 
      useIdempotentAction(key, mockFn, { debug: true })
    );

    let promise1: Promise<any>;
    let promise2: Promise<any>;

    // Premier clic
    await act(async () => {
      promise1 = result.current.run();
    });

    // Deuxième clic immédiat (pendant que le premier est en cours)
    await act(async () => {
      promise2 = result.current.run();
    });

    // Les deux promises doivent être identiques
    expect(promise1).toBe(promise2);
    
    // La fonction ne doit être appelée qu'une seule fois
    await promise1;
    expect(mockFn).toHaveBeenCalledTimes(1);
    
    const result1 = await promise1;
    const result2 = await promise2;
    expect(result1).toBe(result2);
    expect(result1).toBe('success');
  });

  it('pending bloque re-entrée', async () => {
    let resolvePromise: (value: string) => void;
    const slowMockFn = vi.fn(() => 
      new Promise<string>(resolve => {
        resolvePromise = resolve;
      })
    );
    
    const key = 'test-key-pending';
    
    const { result } = renderHook(() => 
      useIdempotentAction(key, slowMockFn, { debug: true })
    );

    // État initial
    expect(result.current.pending).toBe(false);

    let promise1: Promise<any>;
    
    // Premier appel
    await act(async () => {
      promise1 = result.current.run();
    });

    // Vérifier que pending est true
    expect(result.current.pending).toBe(true);

    // Deuxième appel pendant que pending = true
    let promise2: Promise<any>;
    await act(async () => {
      promise2 = result.current.run();
    });

    // Les deux promises sont identiques (pas de nouvel appel)
    expect(promise1).toBe(promise2);
    expect(slowMockFn).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBe(true);

    // Résoudre la promise
    await act(async () => {
      resolvePromise!('completed');
      await promise1;
    });

    // Pending revient à false
    expect(result.current.pending).toBe(false);
    expect(result.current.lastResult).toBe('completed');
  });

  it('cleanup OK', async () => {
    const mockFn = vi.fn().mockResolvedValue('cleanup-test');
    const key = 'test-key-cleanup';
    
    const { result } = renderHook(() => 
      useIdempotentAction(key, mockFn, { debug: true })
    );

    // Vérifier que la clé n'est pas encore active
    expect(IdempotentActionUtils.getActiveKeys()).not.toContain(key);

    let promise: Promise<any>;
    
    // Exécuter l'action
    await act(async () => {
      promise = result.current.run();
    });

    // Pendant l'exécution, la clé devrait être active
    // (Note: dans un vrai test, on vérifierait cela avant la résolution)
    
    // Attendre la completion
    await act(async () => {
      await promise;
    });

    // Après completion, la clé ne devrait plus être active
    expect(IdempotentActionUtils.getActiveKeys()).not.toContain(key);
    expect(result.current.pending).toBe(false);
    expect(result.current.lastResult).toBe('cleanup-test');

    // Reset doit nettoyer l'état
    await act(async () => {
      result.current.reset();
    });

    expect(result.current.lastResult).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('gestion erreur avec cleanup', async () => {
    const mockError = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(mockError);
    const key = 'test-key-error';
    
    const { result } = renderHook(() => 
      useIdempotentAction(key, mockFn, { debug: true })
    );

    let promise: Promise<any>;
    
    await act(async () => {
      promise = result.current.run();
    });

    // Attendre que l'erreur soit propagée
    await expect(promise).rejects.toThrow('Test error');

    // Vérifier que l'état est nettoyé après erreur
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.lastResult).toBe(null);
    expect(IdempotentActionUtils.getActiveKeys()).not.toContain(key);
  });

  it('abort functionality', async () => {
    let abortSignal: AbortSignal;
    const mockFn = vi.fn((signal?: AbortSignal) => {
      abortSignal = signal!;
      return new Promise((resolve, reject) => {
        signal?.addEventListener('abort', () => {
          reject(new Error('Aborted'));
        });
        // Promise qui ne se résout jamais (sauf si aborted)
      });
    });
    
    const key = 'test-key-abort';
    
    const { result } = renderHook(() => 
      useIdempotentAction(key, mockFn, { debug: true })
    );

    let promise: Promise<any>;
    
    await act(async () => {
      promise = result.current.run();
    });

    expect(result.current.pending).toBe(true);
    expect(abortSignal!).toBeDefined();
    expect(abortSignal!.aborted).toBe(false);

    // Abort l'action
    await act(async () => {
      result.current.abort();
    });

    expect(abortSignal!.aborted).toBe(true);
    
    // La promise devrait être rejetée
    await expect(promise).rejects.toThrow('Aborted');
  });
});
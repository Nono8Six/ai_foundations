// Dynamic storage wrapper for professional "Remember me" UX
// - When remember me is enabled, store the Supabase session in localStorage
// - When disabled, store it in sessionStorage (clears on browser close)
// - Reads seamlessly from both; removes from both on delete (resilient)

const REMEMBER_ME_PREF_KEY = 'auth:remember_me';

export function setRememberMePreference(remember: boolean): void {
  try {
    window.localStorage.setItem(REMEMBER_ME_PREF_KEY, remember ? 'true' : 'false');
  } catch (_) {
    // ignore storage errors (private mode, etc.)
  }
}

export function getRememberMePreference(): boolean {
  try {
    return window.localStorage.getItem(REMEMBER_ME_PREF_KEY) === 'true';
  } catch (_) {
    return true; // default to persistent if storage unavailable
  }
}

function safeGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch (_) {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch (_) {
    // ignore
  }
}

function safeRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch (_) {
    // ignore
  }
}

// Storage interface expected by Supabase Auth (sync Storage)
export const dynamicAuthStorage: Storage = {
  get length() {
    // Do not rely on length; not used by supabase
    return 0;
  },
  clear(): void {
    // No-op: we only manage specific keys via set/remove
  },
  key(_index: number): string | null {
    return null;
  },
  getItem(key: string): string | null {
    // Try current preference first
    const preferLocal = getRememberMePreference();
    const primary = preferLocal ? window.localStorage : window.sessionStorage;
    const secondary = preferLocal ? window.sessionStorage : window.localStorage;

    const fromPrimary = safeGet(primary, key);
    if (fromPrimary !== null) return fromPrimary;
    // Fallback to the other storage (handles preference changes)
    return safeGet(secondary, key);
  },
  setItem(key: string, value: string): void {
    const preferLocal = getRememberMePreference();
    const target = preferLocal ? window.localStorage : window.sessionStorage;
    safeSet(target, key, value);
    // Optional: clean up the other storage to avoid stale entries
    const other = preferLocal ? window.sessionStorage : window.localStorage;
    safeRemove(other, key);
  },
  removeItem(key: string): void {
    // Remove from both storages to keep state clean
    safeRemove(window.localStorage, key);
    safeRemove(window.sessionStorage, key);
  },
};

export { REMEMBER_ME_PREF_KEY };


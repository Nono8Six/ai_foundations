import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({})),
}));

describe('supabase client initialization', () => {
  const originalMeta = import.meta.env;
  const originalUrl = process.env.VITE_SUPABASE_URL;
  const originalKey = process.env.VITE_SUPABASE_ANON_KEY;

  afterEach(() => {
    import.meta.env = originalMeta;
    process.env.VITE_SUPABASE_URL = originalUrl;
    process.env.VITE_SUPABASE_ANON_KEY = originalKey;
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('throws an error when required env vars are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    await expect(import('../supabase.js')).rejects.toThrow(
      'Missing Supabase environment variables'
    );
  });

  it('exports a client when env vars are set', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'url');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'key');
    const module = await import('../supabase.js');
    expect(module.supabase).toBeDefined();
  });
});

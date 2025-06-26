import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

async function loadLogger() {
  const mod = await import('@ai-foundations/logger');
  return mod.default;
}

describe('logger', () => {
  const originalLevel = process.env.VITE_LOG_LEVEL;
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.VITE_LOG_LEVEL = originalLevel;
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('logs debug when level is debug', async () => {
    process.env.VITE_LOG_LEVEL = 'debug';
    const logger = await loadLogger();
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('a');
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('skips debug when level is info', async () => {
    process.env.VITE_LOG_LEVEL = 'info';
    const logger = await loadLogger();
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('b');
    expect(spy).not.toHaveBeenCalled();
  });
});

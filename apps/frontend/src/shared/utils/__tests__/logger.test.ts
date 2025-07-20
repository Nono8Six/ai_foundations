import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
async function loadLogger() {
  const mod = await import('@libs/logger');
  return mod.log;
}

const originalViteLevel = process.env.VITE_LOG_LEVEL;
const originalLogLevel = process.env.LOG_LEVEL;

describe('logger', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.VITE_LOG_LEVEL = originalViteLevel;
    process.env.LOG_LEVEL = originalLogLevel;
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('logs debug when VITE_LOG_LEVEL is debug', async () => {
    delete process.env.LOG_LEVEL;
    process.env.VITE_LOG_LEVEL = 'debug';
    const logger = await loadLogger();
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('a');
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('uses LOG_LEVEL over VITE_LOG_LEVEL', async () => {
    process.env.VITE_LOG_LEVEL = 'debug';
    process.env.LOG_LEVEL = 'info';
    const logger = await loadLogger();
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('b');
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs debug when LOG_LEVEL is debug', async () => {
    process.env.VITE_LOG_LEVEL = 'info';
    process.env.LOG_LEVEL = 'debug';
    const logger = await loadLogger();
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('c');
    expect(spy).toHaveBeenCalledWith('c');
  });
});

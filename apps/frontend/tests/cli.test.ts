import { execaCommand } from 'execa';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

const cwd = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function run(cmd: string) {
  return execaCommand(cmd, { cwd });
}

describe('CLI commands', () => {
  it('type-checks', async () => {
    const { exitCode } = await run('pnpm exec tsc --noEmit');
    expect(exitCode).toBe(0);
  });

  it('lint passes', async () => {
    const { exitCode } = await run('pnpm run lint');
    expect(exitCode).toBe(0);
  });

  it('dev build dry run succeeds', async () => {
    const { exitCode } = await run('pnpm run dev -- --dry-run');
    expect(exitCode).toBe(0);
  });
});

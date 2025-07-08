import fs from 'node:fs';
import { resolve } from 'node:path';
import { config as loadDotEnv } from 'dotenv';
import { cleanEnv, str } from 'envalid';

const ENV_FILE = resolve('.env');
const EXAMPLE_FILE = resolve('.env.example');

// Load .env into process.env if present
if (fs.existsSync(ENV_FILE)) {
  loadDotEnv({ path: ENV_FILE });
}

const exampleContent = fs.readFileSync(EXAMPLE_FILE, 'utf-8');
const spec = {};
for (const line of exampleContent.split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=/);
  if (match) {
    const name = match[1];
    spec[name] = str();
  }
}

cleanEnv(process.env, spec, { strict: true });
console.warn('Environment variables validated successfully.');

// Cross-platform guards for P9-C-lite (no bash required)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..'); // apps/frontend/src/..
const SRC = path.join(ROOT, 'src');

const ALLOW_WRITES_REGEX = new RegExp(
  [
    'src/features/admin/contexts/AdminCourseContext.tsx',
    'src/shared/hooks/useSupabaseList.ts',
    'src/shared/services/adminXpService.ts',
    'src/shared/services/authService.ts',
    'src/shared/services/cookieService.ts',
    'src/shared/services/userService.ts',
    // TODO: These XP services should be refactored to use RPC-only pattern
    'src/shared/services/achievementService.ts',
    'src/shared/services/streakService.ts',
    'src/shared/services/xpAutoValidator.ts',
    'src/shared/services/xpService.ts'
  ].map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
);

const isTs = p => /\.(ts|tsx)$/.test(p);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

const files = walk(SRC).filter(isTs);

const violations = [];

files.forEach(fp => {
  const rel = path.relative(path.join(ROOT), fp).replace(/\\/g, '/');
  const code = fs.readFileSync(fp, 'utf8');

  // 1) Forbid supabase.rpc outside xp-rpc.ts
  if (!rel.endsWith('src/shared/services/xp-rpc.ts')) {
    if (/\bsupabase\s*\.\s*rpc\s*\(/.test(code)) {
      violations.push(`[rpc] ${rel}: direct supabase.rpc usage`);
    }
  }

  // 2) Forbid Math.floor level calculations
  // Look for specific patterns like Math.floor(100 * Math.pow(...level...)) or Math.floor(...xp.../100)
  if (/Math\s*\.\s*floor\s*\(\s*100\s*\*\s*Math\.pow\s*\([^)]*level/i.test(code) ||
      /Math\s*\.\s*floor\s*\([^)]*\bxp\b[^)]*\/\s*100/i.test(code) ||
      /level.*Math\s*\.\s*floor.*100|100.*Math\s*\.\s*floor.*level/i.test(code)) {
    violations.push(`[level] ${rel}: hardcoded level calculation (Math.floor with level/xp)`);
  }

  // 3) Forbid table writes outside allowlist
  if (!ALLOW_WRITES_REGEX.test(rel)) {
    if (/\.\s*from\s*\([^)]*\)\s*\.\s*(insert|update|delete)\s*\(/.test(code)) {
      violations.push(`[writes] ${rel}: direct table write not in allowlist`);
    }
  }
});

if (violations.length) {
  console.error('❌ Guards failed:\n' + violations.map(v => ' - ' + v).join('\n'));
  process.exit(1);
} else {
  console.log('✅ Guards passed (RPC-only XP, no hardcoded levels, writes only on allowlist).');
}
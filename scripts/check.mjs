import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(process.cwd(), 'js');
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const info = statSync(fullPath);

    if (info.isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('.js')) {
      files.push(fullPath);
    }
  }
}

walk(root);

let failed = 0;

for (const file of files) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    console.log(`OK   ${relative(process.cwd(), file)}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${relative(process.cwd(), file)}`);
    console.error(error.stderr?.toString() || error.message);
  }
}

console.log('');
console.log(`${files.length} arquivo(s) JavaScript verificado(s).`);

if (failed > 0) {
  console.error(`${failed} arquivo(s) com erro de sintaxe.`);
  process.exit(1);
}

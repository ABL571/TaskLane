/* Detect broken local relative imports. Works without npm dependencies. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..', 'src');
const endings = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
let seen = 0;
const broken = [];
function walk(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    const source = fs.readFileSync(file, 'utf8');
    // Static imports and dynamic imports with literal relative paths.
    const re = /(?:from\s*|import\s*\(\s*|import\s*)['"](\.[^'"]+)['"]/g;
    let match;
    while ((match = re.exec(source))) {
      seen++;
      const imported = path.resolve(folder, match[1]);
      if (!endings.some(suffix => fs.existsSync(imported + suffix))) broken.push(`${file}: ${match[1]}`);
    }
  }
}
walk(root);
if (broken.length) { console.error(broken.join('\n')); process.exitCode = 1; }
else console.log(`PASS: ${seen} relative import paths resolve correctly.`);

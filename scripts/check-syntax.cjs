/* Lightweight TS/TSX parser check; does not replace tsc and a Vite build. */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..', 'src');
let failed = false;
let count = 0;
function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!/\.tsx?$/.test(entry.name)) continue;
    count++;
    const content = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    for (const diagnostic of sourceFile.parseDiagnostics) {
      failed = true;
      const pos = sourceFile.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
      console.error(`${file}:${pos.line + 1}:${pos.character + 1} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    }
  }
}
visit(root);
if (failed) process.exit(1);
console.log(`PASS: parsed ${count} TypeScript/TSX files successfully.`);

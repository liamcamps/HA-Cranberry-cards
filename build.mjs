// Builds dist/cranberry-cards.js from the source files in src/.
//
//   node build.mjs           build (minified when esbuild is installed)
//   node build.mjs --plain   build without minifying, for reading or debugging
//   node build.mjs --check   build in memory and fail if dist/ is out of date (used by CI)
//
// Each folder in src/ becomes one self-contained block, (() => { ... })(), with its files
// joined in name order. The home card is one block, the other cards another; they share a
// few helpers through window.CranberryMorph and window.CranberryWaste. A folder's
// _header.txt is its comment, placed above the block.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const args = new Set(process.argv.slice(2));
const BLOCKS = ['home', 'cards'];

const block = (name) => {
  const dir = join(root, 'src', name);
  const header = existsSync(join(dir, '_header.txt')) ? readFileSync(join(dir, '_header.txt'), 'utf8') : '';
  const files = readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
  return header + '(() => {\n' + files.map((f) => readFileSync(join(dir, f), 'utf8')).join('') + '})();\n';
};

let out = BLOCKS.map(block).join('');

if (!args.has('--plain')) {
  let esbuild = null;
  try { esbuild = await import('esbuild'); } catch (e) { /* not installed: keep it readable */ }
  if (esbuild) {
    const banner = '/* Cranberry Canvas cards · https://github.com/liamcamps/HA-Cranberry-cards · built from src/ */';
    // keepNames: class names stay readable in the browser's developer tools
    out = (await esbuild.transform(out, { minify: true, keepNames: true, target: 'es2020', legalComments: 'none' })).code;
    out = banner + '\n' + out;
  } else if (args.has('--check') || args.has('--require-minify')) {
    console.error('esbuild is not installed: run npm install');
    process.exit(1);
  }
}

const target = join(root, 'dist', 'cranberry-cards.js');
if (args.has('--check')) {
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
  if (current !== out) {
    console.error('dist/cranberry-cards.js is out of date: run node build.mjs and commit the result');
    process.exit(1);
  }
  console.log('dist/cranberry-cards.js is up to date');
} else {
  writeFileSync(target, out);
  console.log('built dist/cranberry-cards.js (' + Math.round(out.length / 1024) + ' KB)');
}

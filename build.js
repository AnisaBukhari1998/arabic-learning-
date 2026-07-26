#!/usr/bin/env node
/**
 * Bundles the site into single self-contained files.
 *
 *   dist/index.html     full standalone page — open it offline, email it, host it anywhere
 *   dist/artifact.html  the same page as a fragment (no doctype/html/head/body wrapper)
 *
 * Fonts, CSS and JS are inlined; nothing is fetched at runtime.
 * Usage: node build.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

function inlineFonts(css) {
  return css.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, file) => {
    const buf = fs.readFileSync(path.join(ROOT, 'assets', 'fonts', file));
    return `url('data:font/woff2;base64,${buf.toString('base64')}')`;
  });
}

const html = read('index.html');
const css = inlineFonts(read('assets/css/app.css'));
const data = read('assets/js/data.js');
const app = read('assets/js/app.js');

const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'The Free Arabic Library'])[1];
const meta = (html.match(/<meta name="description"[^>]*>/) || [''])[0];
const body = html
  .split('<body>')[1]
  .split('</body>')[0]
  .replace(/\s*<script src="[^"]+"><\/script>/g, '')
  .trim();

const styleBlock = `<style>\n${css}\n</style>`;
const scriptBlock = `<script>\n${data}\n</script>\n<script>\n${app}\n</script>`;

const standalone = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${meta}
<meta name="color-scheme" content="light dark">
${styleBlock}
</head>
<body>
${body}
${scriptBlock}
</body>
</html>
`;

const fragment = `<title>${title}</title>
${styleBlock}
${body}
${scriptBlock}
`;

fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), standalone);
fs.writeFileSync(path.join(DIST, 'artifact.html'), fragment);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';
console.log('dist/index.html    ' + kb(standalone));
console.log('dist/artifact.html ' + kb(fragment));

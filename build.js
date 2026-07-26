#!/usr/bin/env node
/**
 * Builds three things from the source in this repo:
 *
 *   dist/site/          what Firebase Hosting serves — app + service worker + manifest
 *   dist/index.html     one self-contained file: fonts, CSS and JS inlined, works offline
 *                       from a USB stick or an email attachment (no service worker)
 *   dist/artifact.html  the same page as an HTML fragment, for embedding
 *
 * Also:  node build.js --check   validates the generated flashcard decks and exits.
 *
 * No dependencies.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SITE = path.join(DIST, 'site');

const SCRIPTS = [
  'assets/js/data.js',
  'assets/js/store.js',
  'assets/js/decks.js',
  'assets/js/habit.js',
  'assets/js/study.js',
  'assets/js/app.js'
];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ------------------------------------------------------------------ check */
function check() {
  const problems = [];
  const sandbox = { window: {} };
  global.window = sandbox.window;
  require('./assets/js/data.js');
  // decks.js only needs shuffle from the store; give it a deterministic stub.
  global.window.STORE = { shuffle: (a) => a };
  require('./assets/js/decks.js');

  const D = global.window.DECKS;
  const ids = {};

  D.list.forEach((deck) => {
    if (!deck.cards.length) problems.push(`${deck.id}: no cards`);
    const shorts = new Set();
    deck.cards.forEach((c) => {
      if (!c.prompt || !(c.prompt.ar || c.prompt.text)) problems.push(`${c.id}: empty prompt`);
      if (!c.answer || !c.answer.text) problems.push(`${c.id}: empty answer`);
      if (!c.short) problems.push(`${c.id}: no short answer for multiple choice`);
      if (ids[c.id]) problems.push(`${c.id}: duplicate id`);
      ids[c.id] = true;
      if (c.short) shorts.add(c.short);
    });
    // Multiple choice needs at least one plausible distractor.
    if (shorts.size < 2) problems.push(`${deck.id}: only ${shorts.size} distinct answer(s) — multiple choice impossible`);
    if (deck.modes.indexOf('type') !== -1) {
      const typeable = deck.cards.filter((c) => c.accept.length).length;
      if (typeable < deck.cards.length / 2) problems.push(`${deck.id}: type mode offered but only ${typeable} cards accept typing`);
    }
  });

  const total = D.list.reduce((a, d) => a + d.cards.length, 0);
  if (problems.length) {
    console.error(`FAIL — ${problems.length} problem(s):`);
    problems.forEach((p) => console.error('  ' + p));
    process.exit(1);
  }
  console.log(`OK — ${D.list.length} decks, ${total} cards, ${Object.keys(ids).length} unique ids`);
}

/* ------------------------------------------------------------------ build */
function inlineFonts(css) {
  return css.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, file) => {
    const buf = fs.readFileSync(path.join(ROOT, 'assets', 'fonts', file));
    return `url('data:font/woff2;base64,${buf.toString('base64')}')`;
  });
}

function build() {
  const html = read('index.html');
  const rawCss = read('assets/css/app.css');
  const css = inlineFonts(rawCss);
  const js = SCRIPTS.map(read);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, 'The Free Arabic Library'])[1];
  const meta = (html.match(/<meta name="description"[^>]*>/) || [''])[0];

  // Body of the page, minus the tags that only make sense in the linked build.
  const body = html
    .split('<body>')[1].split('</body>')[0]
    .replace(/\s*<script src="[^"]+"><\/script>/g, '')
    .trim();

  const styleBlock = `<style>\n${css}\n</style>`;
  const scriptBlock = js.map((src) => `<script>\n${src}\n</script>`).join('\n');

  fs.mkdirSync(DIST, { recursive: true });

  /* --- 1. hosted site ---------------------------------------------------- */
  fs.rmSync(SITE, { recursive: true, force: true });
  fs.mkdirSync(SITE, { recursive: true });
  fs.cpSync(path.join(ROOT, 'assets'), path.join(SITE, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(SITE, 'index.html'));
  fs.copyFileSync(path.join(ROOT, 'manifest.webmanifest'), path.join(SITE, 'manifest.webmanifest'));

  // Stamp the service worker cache with a hash of everything it precaches, so
  // a deploy invalidates the old cache and only then.
  const hash = crypto.createHash('sha256');
  hash.update(html + rawCss + js.join(''));
  ['amiri-ar-400', 'amiri-ar-700', 'fraunces-lat', 'fraunces-latext', 'karla-lat', 'karla-latext']
    .forEach((f) => hash.update(fs.readFileSync(path.join(ROOT, 'assets/fonts/' + f + '.woff2'))));
  const version = hash.digest('hex').slice(0, 10);
  const sw = read('sw.js').replace("const CACHE_VERSION = 'dev';", `const CACHE_VERSION = '${version}';`);
  fs.writeFileSync(path.join(SITE, 'sw.js'), sw);
  fs.writeFileSync(path.join(SITE, '.nojekyll'), '');

  /* --- 2. single-file offline build -------------------------------------- */
  // No manifest link here: a lone file has no scope to register a worker in.
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
  fs.writeFileSync(path.join(DIST, 'index.html'), standalone);

  /* --- 3. artifact fragment --------------------------------------------- */
  fs.writeFileSync(path.join(DIST, 'artifact.html'),
    `<title>${title}</title>\n${styleBlock}\n${body}\n${scriptBlock}\n`);

  const kb = (n) => (n / 1024).toFixed(0) + ' KB';
  const siteBytes = walk(SITE).reduce((a, f) => a + fs.statSync(f).size, 0);
  console.log('dist/site/          ' + kb(siteBytes) + '  (' + walk(SITE).length + ' files, sw cache ' + version + ')');
  console.log('dist/index.html     ' + kb(Buffer.byteLength(standalone)));
  console.log('dist/artifact.html  ' + kb(Buffer.byteLength(styleBlock + body + scriptBlock)));
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((acc, e) => {
    const p = path.join(dir, e.name);
    return acc.concat(e.isDirectory() ? walk(p) : [p]);
  }, []);
}

if (process.argv.indexOf('--check') !== -1) check();
else build();

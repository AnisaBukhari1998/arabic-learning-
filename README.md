# The Free Arabic Library

A single-page app holding the whole path from the Arabic alphabet to reading the Qur'an with
grammatical understanding: eight ordered phases, every resource that carries you through them,
the reference tables you memorise along the way, a daily routine, and milestones you tick off.

Everything listed is free, freemium with a genuinely usable free tier, or public domain.

**Open `index.html` in a browser.** No server, no build step, no dependencies, no network.

## What's in it

| Part | Contents |
| --- | --- |
| 8 phases | Script → MSA foundations → naḥw & ṣarf → vocabulary → Qur'anic Arabic → classical texts → tajwīd → mastery |
| 92 resources | Each with where to find it, why it's here, and a free/freemium/public-domain label |
| Text ladder | The nine classical books in the traditional order, from *Qaṣaṣ al-Nabiyyīn* to the *Muʿallaqāt* |
| Reference tables | 28 letters with articulation points · vowel marks · iʿrāb · sentence structures · pronouns · broken plurals · the ten verb forms · 14 tajwīd rules · makhārij · 46 Qur'anic function words · 40 high-frequency roots |
| Daily plan | Routines for 30 / 60 / 120 minutes a day, a weekly rhythm, and 23 milestones |

## Features

- **Progress tracking** — tick any resource or milestone; per-phase rings and an overall bar update live. Saved in `localStorage` under `fal.progress.v1`; nothing leaves the browser.
- **Export / import** — download your progress as JSON and restore it on another machine (bottom of the *Daily plan* section).
- **Search everything** — press `/` and type; filters resource cards, table rows, milestones and FAQ answers at once.
- **Filter by access** — Free, Freemium, Public domain, or hide what you've already finished.
- **Light and dark themes** — follows your OS by default, with a manual toggle.
- **Prints cleanly** — the whole curriculum on paper, with navigation and checkboxes stripped out.

## Layout

```
index.html            page shell — hero, toolbar, empty <main>
assets/css/app.css    design tokens, both themes, print styles
assets/js/data.js     ALL content: phases, resources, tables, routines, milestones
assets/js/app.js      rendering, progress, search, filters, tabs
assets/fonts/         Amiri, Fraunces, Karla subsets (self-hosted, offline)
build.js              bundles everything into one file
dist/index.html       standalone build — one file, zero external requests
dist/artifact.html    same page as an HTML fragment, for embedding
```

## Editing the content

Everything a reader sees lives in `assets/js/data.js`; `app.js` never hardcodes content.

To add a resource, append to the relevant phase's `resources` array:

```js
{
  name: 'Resource name',
  where: 'example.com',                 // shown under the title
  url: 'https://example.com',           // optional — makes the title a link
  tag: 'free',                          // 'free' | 'freemium' | 'pd'
  best: 'Start here',                   // optional gold flag
  note: 'One or two sentences on why this is worth your time.'
}
```

IDs, phase membership, counts and progress totals are derived automatically — nothing else to update.

## Building the standalone file

```sh
node build.js
```

Inlines the CSS, JS and fonts (as base64 `data:` URIs) into `dist/index.html`, a ~620 KB file that
works offline from a USB stick, an email attachment, or any static host.

## A note on the data

Resource availability and free tiers change. If a link has moved, search its name plus
`archive.org` before assuming it's gone. Qur'anic root-frequency counts are approximate
root-family totals — counting methods differ between sources, so they rank effort rather than
state facts. Verify any single word at [corpus.quran.com](https://corpus.quran.com).

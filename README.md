# The Free Arabic Library

An offline study app for Arabic, from the alphabet to reading the Qur'an with grammatical
understanding: eight ordered phases, every free resource that carries you through them, the reference
tables you have to memorise — **and those same tables as 310 flashcards**, so you can test recall
instead of only reading.

Everything listed is free, freemium with a genuinely usable free tier, or public domain.

**Open `index.html` in a browser.** No server, no build step, no dependencies, no account, no network.

## What's in it

| Part | Contents |
| --- | --- |
| 8 phases | Script → MSA foundations → naḥw & ṣarf → vocabulary → Qur'anic Arabic → classical texts → tajwīd → mastery |
| 92 resources | Each with where to find it, why it's here, and a free / freemium / public-domain label |
| Text ladder | The nine classical books in traditional order, *Qaṣaṣ al-Nabiyyīn* → the *Muʿallaqāt* |
| Reference tables | 28 letters with articulation points · vowel marks · iʿrāb · sentence structures · pronouns · broken plurals · the ten verb forms · 14 tajwīd rules · makhārij · 46 Qur'anic function words · 40 high-frequency roots |
| 14 flashcard decks | 310 cards generated from those tables — letters, forms, makhārij, sun/moon, marks, function words, particle roles, roots, verb forms, tajwīd, pronouns, plurals, cases, sentence types |
| Daily plan | Routines for 30 / 60 / 120 minutes, weekly rhythm, 23 milestones, 12-week activity heatmap |

## Features

- **Today dashboard** — cards due, streak, minutes against your goal, cards learned, curriculum
  ticked, and one-tap buttons for the next useful thing.
- **Three study modes** — flip with self-grading (keys `1` `2` `3`), multiple choice with distractors
  drawn from the same deck, and type-the-answer where macrons and dots are ignored (`ha` passes for
  `ḥāʾ`).
- **Leitner scheduling** — boxes 0–5 at 0 / 1 / 3 / 7 / 21 / 60 days. *Again* sends a card back to
  today, *Easy* pushes it out two boxes. Deliberately simple and inspectable.
- **Streaks and a daily goal** — the routine you pick becomes your minute goal; reviews log their own
  time and you can add reading or listening by hand.
- **Handwriting practice** — trace any of the 28 letters over a guide glyph, then hide the guide.
- **Five themes** — Parchment, Indigo night, Sepia, Muṣḥaf green, High contrast; follows your OS until
  you choose.
- **Installs as an app and works offline** — service worker precaches everything including the fonts.
- **Search everything** — press `/`; filters resource cards, decks, table rows, milestones and FAQ at
  once. Filter by access tier, or hide what you've finished.
- **Your data stays yours** — one `localStorage` key, nothing uploaded, JSON export/import for moving
  between machines. Prints cleanly too.

## Layout

```
index.html              page shell — hero, toolbar, empty <main>
assets/css/app.css      design tokens for five themes, components, print styles
assets/js/data.js       ALL curriculum content: phases, resources, tables, routines, milestones
assets/js/store.js      state (one key: fal.state.v2) + the Leitner scheduler
assets/js/decks.js      flashcards derived from data.js — no card is hardcoded
assets/js/habit.js      streak, daily goal, heatmap
assets/js/study.js      the review session UI
assets/js/app.js        page rendering, search, filters, themes, tracing canvas
assets/fonts/           Amiri, Fraunces, Karla subsets (self-hosted, offline)
manifest.webmanifest    PWA install metadata
sw.js                   offline cache (version stamped by build.js)
build.js                bundler + content checker
firebase.json           Firebase Hosting config
```

Built output:

```
dist/site/          what Firebase Hosting serves
dist/index.html     one self-contained file — email it, USB it, open it offline
dist/artifact.html  the same page as an HTML fragment, for embedding
```

## Editing the content

Everything a reader sees lives in `assets/js/data.js`. Add a resource to a phase's `resources` array:

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

Add a row to any reference table and the matching flashcards appear automatically — card ids are
derived from the prompt text, not from array position, so reordering a table doesn't lose your review
history. New decks are declared in `assets/js/decks.js`.

## Commands

```sh
node build.js --check   # validate every generated card: prompts, answers, unique ids, distractors
node build.js           # write dist/site, dist/index.html, dist/artifact.html
```

## Deploying

**Firebase Hosting** (what the live site uses). One-time setup:

1. Firebase console → create or pick a project → **Hosting** → add a site.
2. Put the project id in `.firebaserc` (replacing the placeholder).
3. Project settings → **Service accounts** → *Generate new private key*.
4. GitHub → Settings › Secrets and variables › Actions → new secret
   `FIREBASE_SERVICE_ACCOUNT_ARABIC`, pasting the whole JSON file.

`.github/workflows/firebase-hosting.yml` then builds and deploys on every push to `main`.
To deploy from your own machine instead: `npx firebase-tools login && npx firebase-tools deploy --only hosting`.

**GitHub Pages** (`.github/workflows/pages.yml`) is manual-dispatch only: Pages cannot publish a
private repo on a free account. Make the repo public, or enable Pages by hand on Pro, and it works.

## Notes on the data

Resource availability and free tiers change. If a link has moved, search its name plus `archive.org`
before assuming it's gone. Qur'anic root-frequency counts are approximate root-family totals —
counting methods differ between sources, so they rank effort rather than state facts. Verify any single
word at [corpus.quran.com](https://corpus.quran.com).

## Not included, on purpose

- **Audio and text-to-speech** — device Arabic voices are inconsistent and real recitation audio would
  add tens of megabytes. The app points at EveryAyah, QuranicAudio and Forvo instead.
- **AI-generated cards** — needs an API key, and a key shipped in a static page is a key anyone can
  spend. The cards come from the curriculum data instead.
- **Cross-device sync** — would need accounts and a database; export/import covers moving machines.

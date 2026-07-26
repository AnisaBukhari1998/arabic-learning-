/* ==========================================================================
   Decks — flashcards derived from window.LIBRARY. Nothing is hardcoded here:
   edit a row in data.js and the cards follow.

   Card shape
     id      stable: deck + ':' + slug(prompt) — survives reordering data.js
     prompt  {ar, text}   what you are asked
     answer  {ar, text}   what is revealed
     short   the concise answer used for multiple-choice options
     accept  [strings]    normalised answers accepted when typing (optional)
   ========================================================================== */

window.DECKS = (function () {
  'use strict';

  const L = window.LIBRARY;

  /* ---------------------------------------------------------------- utils */
  // Stable, ASCII-ish key from any string (Arabic included, via char codes).
  function slug(s) {
    const base = String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (base.length >= 3) return base;
    let h = 0;
    const str = String(s);
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return 'k' + Math.abs(h).toString(36);
  }

  // Fold transliteration to something a learner can actually type:
  // macrons, dots under letters, hamza marks and case all stop mattering.
  // "ḥāʾ", "ha'" and "HA" all normalise to "ha".
  function normalise(s) {
    let out = String(s).toLowerCase();
    if (out.normalize) out = out.normalize('NFD');
    return out
      .replace(/[̀-ͯ]/g, '')                  // macron, dot below, etc.
      .replace(/[ʼʿʾ‘’'`´]/g, '')  // hamza / ʿayn marks
      .replace(/[^a-z0-9]+/g, '');
  }

  function card(deck, prompt, answer, short, accept) {
    return {
      id: deck + ':' + slug(prompt.ar || prompt.text),
      deck: deck,
      prompt: prompt,
      answer: answer,
      short: short,
      accept: (accept || []).map(normalise).filter(Boolean)
    };
  }

  /* ---------------------------------------------------------------- decks */
  const defs = [
    {
      id: 'letters', label: 'Letters & sounds', phase: 'p1',
      hint: 'See the letter, name it and say its sound.',
      build: function () {
        return L.alphabet.map(function (l) {
          return card('letters',
            { ar: l.iso, text: 'Which letter is this?' },
            { ar: l.name, text: l.tr + ' — ' + l.sound },
            l.tr,
            [l.tr, l.tr.replace(/[ʾʿ']/g, '')]);
        });
      }
    },
    {
      id: 'letter-forms', label: 'Connected forms', phase: 'p1',
      hint: 'Recall how a letter joins at the start, middle and end of a word.',
      build: function () {
        return L.alphabet.map(function (l) {
          return card('letter-forms',
            { ar: l.iso, text: 'Initial · medial · final forms?' },
            { ar: l.ini + '  ' + l.med + '  ' + l.fin, text: l.tr + (l.connects ? '' : ' — never joins to the left') },
            l.ini + ' ' + l.med + ' ' + l.fin);
        });
      }
    },
    {
      id: 'makhraj', label: 'Articulation points', phase: 'p7',
      hint: 'Where in the mouth or throat each letter is made.',
      build: function () {
        return L.alphabet.map(function (l) {
          return card('makhraj',
            { ar: l.iso, text: 'Where is this letter articulated?' },
            { ar: l.name, text: l.makhraj },
            l.makhraj);
        });
      }
    },
    {
      id: 'sun-moon', label: 'Sun & moon letters', phase: 'p1',
      hint: 'Does the ل of الـ assimilate into this letter?',
      build: function () {
        return L.alphabet.map(function (l) {
          const sun = l.group === 'sun';
          return card('sun-moon',
            { ar: 'الـ' + l.iso, text: 'Sun letter or moon letter?' },
            { ar: l.name, text: sun ? 'Sun — the l assimilates and this letter doubles' : 'Moon — the l is pronounced' },
            sun ? 'Sun' : 'Moon',
            [sun ? 'sun' : 'moon']);
        });
      }
    },
    {
      id: 'marks', label: 'Vowel marks', phase: 'p1',
      hint: 'The ḥarakāt and what each one does.',
      build: function () {
        return L.diacritics.map(function (d) {
          return card('marks',
            { ar: d.mark, text: 'Which mark, and what does it do?' },
            { ar: d.name, text: d.tr + ' — ' + d.does + ' · ' + d.ex },
            d.tr,
            [d.tr]);
        });
      }
    },
    {
      id: 'words', label: 'Qur’anic function words', phase: 'p5',
      hint: 'The particles that carry the syntax of the Qur’an.',
      build: function () {
        return L.functionWords.map(function (w) {
          return card('words',
            { ar: w.ar, text: 'What does this word mean?' },
            { ar: w.ar, text: w.tr + ' — ' + w.gloss },
            w.gloss,
            [w.gloss.split(',')[0], w.tr]);
        });
      }
    },
    {
      id: 'word-roles', label: 'What each particle does', phase: 'p5',
      hint: 'Not just the meaning — the grammatical effect.',
      build: function () {
        return L.functionWords.map(function (w) {
          return card('word-roles',
            { ar: w.ar, text: 'What is this word’s grammatical role?' },
            { ar: w.ar, text: w.role },
            w.role);
        });
      }
    },
    {
      id: 'roots', label: 'High-frequency roots', phase: 'p4',
      hint: 'The root families that cover most of the Qur’an.',
      build: function () {
        return L.roots.map(function (r) {
          return card('roots',
            { ar: r.root, text: 'What does this root mean?' },
            { ar: r.ex, text: r.gloss + ' · ' + r.count + ' occurrences' },
            r.gloss,
            [r.gloss.replace(/^to /, ''), r.gloss]);
        });
      }
    },
    {
      id: 'verbs', label: 'The ten verb forms', phase: 'p3',
      hint: 'What each pattern does to the root meaning.',
      build: function () {
        return L.verbForms.map(function (v) {
          return card('verbs',
            { ar: v.past + ' / ' + v.pres, text: 'Which form is this, and what does it do?' },
            { ar: v.masdar, text: 'Form ' + v.rn + ' — ' + v.sense + ' · ' + v.ex },
            'Form ' + v.rn + ': ' + v.sense,
            ['form' + v.rn, v.rn]);
        });
      }
    },
    {
      id: 'tajwid', label: 'Tajwīd rules', phase: 'p7',
      hint: 'Rule, letters, and how it sounds.',
      build: function () {
        return L.tajwid.map(function (t) {
          return card('tajwid',
            { ar: t.rule, text: 'Which letters, and how is it pronounced?' },
            { ar: t.letters, text: t.tr + ' (' + t.where + ') — ' + t.how },
            t.tr,
            [t.tr]);
        });
      }
    },
    {
      id: 'pronouns', label: 'Pronouns', phase: 'p3',
      hint: 'Detached, attached, and who they refer to.',
      build: function () {
        return L.pronouns.map(function (p) {
          return card('pronouns',
            { ar: p.det, text: 'Who is this, and what is the attached form?' },
            { ar: p.att, text: p.person + ' — ' + p.gloss },
            p.gloss);
        });
      }
    },
    {
      id: 'plurals', label: 'Broken plurals', phase: 'p3',
      hint: 'Recognise the pattern from an example.',
      build: function () {
        return L.plurals.map(function (p) {
          return card('plurals',
            { ar: p.pat, text: 'Give an example of this plural pattern.' },
            { ar: p.ex, text: p.gloss + ' — ' + p.note },
            p.ex);
        });
      }
    },
    {
      id: 'cases', label: 'Iʿrāb — the cases', phase: 'p3',
      hint: 'Endings and when each case applies.',
      build: function () {
        return L.cases.map(function (c) {
          return card('cases',
            { ar: c.name, text: 'Which case, which endings, and when?' },
            { ar: c.sing + ' · ' + c.dual + ' · ' + c.plural, text: c.tr + ' — ' + c.when },
            c.tr);
        });
      }
    },
    {
      id: 'sentences', label: 'Sentence structures', phase: 'p3',
      hint: 'The shapes Arabic sentences come in.',
      build: function () {
        return L.sentenceTypes.map(function (s) {
          return card('sentences',
            { ar: s.ar, text: 'What is this structure?' },
            { ar: s.ex, text: s.name + ' — ' + s.shape },
            s.name);
        });
      }
    }
  ];

  /* --------------------------------------------------------------- build */
  const list = defs.map(function (d) {
    const cards = d.build();
    // Guard against duplicate ids from similar prompts.
    const seen = {};
    cards.forEach(function (c) {
      if (seen[c.id]) c.id = c.id + '-' + (++seen[c.id]);
      else seen[c.id] = 1;
    });
    return {
      id: d.id, label: d.label, phase: d.phase, hint: d.hint,
      cards: cards,
      ids: cards.map(function (c) { return c.id; }),
      // Typing only where enough cards carry an accept list.
      modes: cards.filter(function (c) { return c.accept.length; }).length >= cards.length / 2
        ? ['flip', 'mcq', 'type'] : ['flip', 'mcq']
    };
  });

  const byId = {};
  list.forEach(function (d) { byId[d.id] = d; });

  function allIds() {
    return list.reduce(function (a, d) { return a.concat(d.ids); }, []);
  }

  // Three wrong options from the same deck, so distractors are plausible.
  function distractors(deck, card, n) {
    const pool = deck.cards.filter(function (c) { return c.id !== card.id && c.short && c.short !== card.short; });
    const picked = [];
    const used = {};
    const shuffled = window.STORE.shuffle(pool.slice());
    for (let i = 0; i < shuffled.length && picked.length < (n || 3); i++) {
      const s = shuffled[i].short;
      if (used[s]) continue;
      used[s] = 1;
      picked.push(s);
    }
    return picked;
  }

  return {
    list: list,
    byId: function (id) { return byId[id]; },
    allIds: allIds,
    distractors: distractors,
    normalise: normalise,
    count: allIds().length
  };
})();

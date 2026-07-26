/* ==========================================================================
   The Free Arabic Library — application
   Renders window.LIBRARY and window.DECKS, keeps progress in window.STORE,
   and wires search, filters, themes, study sessions and the habit tracker.
   No dependencies, no build step.
   ========================================================================== */

window.APP = (function () {
  'use strict';

  const L = window.LIBRARY;
  const D = window.DECKS;
  const S = window.STORE;
  const H = window.HABIT;

  const THEMES = [
    { id: '', label: 'Match system' },
    { id: 'parchment', label: 'Parchment' },
    { id: 'night', label: 'Indigo night' },
    { id: 'sepia', label: 'Sepia' },
    { id: 'mushaf', label: 'Muṣḥaf green' },
    { id: 'contrast', label: 'High contrast' }
  ];

  /* ------------------------------------------------------------- helpers */
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k === 'html') n.innerHTML = v;
        else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
        else if (v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      });
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function ar(t, cls) { return el('span', { class: 'ar' + (cls ? ' ' + cls : ''), lang: 'ar', dir: 'rtl', text: t }); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* --------------------------------------------------------------- state */
  const filters = { q: '', tags: new Set(), hideDone: false };

  const trackables = (function () {
    const ids = [];
    L.allResources.forEach(function (r) { ids.push(r.id); });
    L.milestones.forEach(function (m) { ids.push(m.id); });
    return ids;
  })();

  /* --------------------------------------------------------------- theme */
  function applyTheme() {
    const t = S.theme();
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }

  /* ------------------------------------------------------------ progress */
  function phaseProgress(phaseId) {
    const items = L.allResources.filter(function (r) { return r.phase === phaseId; });
    const ms = L.milestones.filter(function (m) { return m.phase === phaseId; });
    const total = items.length + ms.length;
    let n = 0;
    items.forEach(function (r) { if (S.isDone(r.id)) n++; });
    ms.forEach(function (m) { if (S.isDone(m.id)) n++; });
    return { done: n, total: total, pct: total ? n / total : 0 };
  }

  function overall() {
    let n = 0;
    trackables.forEach(function (id) { if (S.isDone(id)) n++; });
    return { done: n, total: trackables.length, pct: trackables.length ? n / trackables.length : 0 };
  }

  function nextUnfinished() {
    for (let i = 0; i < L.phases.length; i++) {
      const p = L.phases[i];
      const r = p.resources.filter(function (x) { return !S.isDone(x.id); })[0];
      if (r) return { phase: p, resource: r };
    }
    return null;
  }

  function dueCards() {
    const out = [];
    D.list.forEach(function (deck) {
      deck.cards.forEach(function (c) { if (S.isDue(c.id)) out.push(c); });
    });
    return out;
  }

  function weakestDeck() {
    let best = null;
    D.list.forEach(function (deck) {
      const c = S.counts(deck.ids);
      if (!c.seen) return;
      if (!best || c.mastery < best.mastery) best = { deck: deck, mastery: c.mastery };
    });
    return best ? best.deck : D.list[0];
  }

  /* ---------------------------------------------------------- components */
  function tickbox(id, label) {
    const input = el('input', {
      type: 'checkbox', id: 'chk-' + id, checked: S.isDone(id), 'aria-label': label,
      onchange: function (e) { S.setDone(id, e.target.checked); refresh(); }
    });
    return el('label', { class: 'tick', for: 'chk-' + id }, [input, el('span', { 'aria-hidden': 'true' })]);
  }

  function resourceCard(r) {
    const tag = L.tags[r.tag];
    const title = r.url
      ? el('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', text: r.name })
      : document.createTextNode(r.name);

    return el('div', {
      class: 'card' + (r.best ? ' is-best' : '') + (S.isDone(r.id) ? ' is-done' : ''),
      'data-track': r.id, 'data-tag': r.tag,
      'data-search': (r.name + ' ' + r.where + ' ' + r.note + ' ' + (r.kind || '') + ' ' + r.phaseName).toLowerCase()
    }, [
      el('div', { class: 'card-top' }, [
        el('h3', {}, [title]),
        tickbox(r.id, 'Mark "' + r.name + '" as done')
      ]),
      el('div', { class: 'where', text: r.where }),
      el('p', { text: r.note }),
      el('div', { class: 'card-foot' }, [
        r.best ? el('span', { class: 'best-flag', text: r.best }) : null,
        r.kind ? el('span', { class: 'kind', text: r.kind }) : null,
        el('span', { class: 'tag ' + r.tag, text: tag.label })
      ])
    ]);
  }

  function ring(phaseId) {
    const C = 2 * Math.PI * 18;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ring');
    svg.setAttribute('viewBox', '0 0 44 44');
    svg.setAttribute('aria-hidden', 'true');
    ['track', 'val'].forEach(function (cls) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', cls);
      c.setAttribute('cx', '22'); c.setAttribute('cy', '22'); c.setAttribute('r', '18');
      if (cls === 'val') {
        c.setAttribute('id', 'ring-' + phaseId);
        c.setAttribute('stroke-dasharray', '0 ' + C.toFixed(2));
      }
      svg.appendChild(c);
    });
    return el('div', { class: 'sec-ring' }, [svg, el('span', { id: 'ringtext-' + phaseId, text: '0%' })]);
  }

  function sectionHead(opts) {
    return el('div', { class: 'sec-head' }, [
      opts.num ? el('div', { class: 'sec-num ar', 'aria-hidden': 'true', text: opts.num }) : null,
      el('div', { class: 'sec-title' }, [
        el('div', { class: 'sec-kicker', text: opts.kicker }),
        el('h2', { text: opts.title }),
        opts.meta ? el('div', { class: 'sec-meta' }, opts.meta.map(function (m) { return el('span', { text: m }); })) : null
      ]),
      opts.phaseId ? ring(opts.phaseId) : null
    ]);
  }

  function table(cols, rows, opts) {
    opts = opts || {};
    const thead = el('thead', {}, [el('tr', {}, cols.map(function (c) {
      return el('th', { text: typeof c === 'string' ? c : c.label, scope: 'col' });
    }))]);
    const tbody = el('tbody', {}, rows.map(function (r) {
      return el('tr', {
        'data-search': r.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join(' ').toLowerCase()
      }, r.map(function (c) {
        if (typeof c === 'string') return el('td', { text: c });
        return el('td', { class: c.class || null, text: c.text, lang: c.lang || null, dir: c.dir || null });
      }));
    }));
    return el('div', { class: 'tablewrap' }, [
      el('table', {}, [opts.caption ? el('caption', { text: opts.caption }) : null, thead, tbody])
    ]);
  }

  /* -------------------------------------------------------------- build */
  const main = $('#main');

  /* --- today ------------------------------------------------------------ */
  function buildToday() {
    const tiles = el('div', { class: 'today-tiles', id: 'today-tiles' });
    const actions = el('div', { class: 'today-actions', id: 'today-actions' });
    const sec = el('section', { class: 'sec', id: 'today' }, [
      sectionHead({ kicker: 'Today', title: 'Where you are, and what to do next' }),
      tiles,
      actions,
      el('p', {
        class: 'today-note',
        text: 'Cards are scheduled by how well you knew them — again brings a card back today, easy pushes it out to two months. Ticks, cards and streak all live in this browser only.'
      })
    ]);
    main.appendChild(sec);
    renderToday();
  }

  function tile(value, label, opts) {
    opts = opts || {};
    return el('div', { class: 'tile' + (opts.hot ? ' hot' : '') }, [
      el('b', { class: 'tnum', text: String(value) }),
      el('span', { text: label }),
      opts.meter !== undefined
        ? el('div', { class: 'meter' }, [el('i', { style: 'width:' + (Math.min(1, opts.meter) * 100).toFixed(1) + '%' })])
        : null
    ]);
  }

  function renderToday() {
    const tiles = $('#today-tiles');
    const actions = $('#today-actions');
    if (!tiles || !actions) return;
    const due = dueCards();
    const hs = H.stats();
    const ov = overall();
    const allCounts = S.counts(D.allIds());

    tiles.innerHTML = '';
    tiles.appendChild(tile(due.length, due.length === 1 ? 'card due now' : 'cards due now', { hot: due.length > 0 }));
    tiles.appendChild(tile(hs.streak, hs.streak === 1 ? 'day streak' : 'day streak', { hot: hs.streak > 0 }));
    tiles.appendChild(tile(hs.minutes + '/' + hs.goal, 'minutes today', { meter: hs.pct }));
    tiles.appendChild(tile(allCounts.learned + '/' + allCounts.total, 'cards learned', { meter: allCounts.mastery }));
    tiles.appendChild(tile(Math.round(ov.pct * 100) + '%', 'curriculum ticked', { meter: ov.pct }));

    actions.innerHTML = '';
    if (due.length) {
      actions.appendChild(el('button', {
        class: 'btn btn-primary', type: 'button', text: 'Review ' + due.length + ' due',
        onclick: function () {
          window.STUDY.open({
            deck: { id: 'mixed', label: 'Due review', modes: ['flip'], cards: due, ids: due.map(function (c) { return c.id; }) },
            mode: 'flip', limit: 30
          });
        }
      }));
    }
    const weak = weakestDeck();
    actions.appendChild(el('button', {
      class: 'btn' + (due.length ? '' : ' btn-primary'), type: 'button',
      text: (allCounts.seen ? 'Quiz: ' : 'Start with: ') + weak.label,
      onclick: function () { window.STUDY.open({ deck: weak, mode: 'mcq' }); }
    }));
    const next = nextUnfinished();
    if (next) {
      actions.appendChild(el('a', {
        class: 'btn', href: '#' + next.phase.id,
        text: 'Continue Phase ' + next.phase.num + ' — ' + next.phase.short
      }));
    }
    actions.appendChild(el('a', { class: 'btn', href: '#practice', text: 'All decks' }));
  }

  /* --- orientation ------------------------------------------------------ */
  function buildStart() {
    main.appendChild(el('section', { class: 'sec', id: 'start' }, [
      sectionHead({ kicker: 'Orientation', title: 'How to use this library' }),
      el('p', {
        class: 'lede',
        text: 'Eight phases, in order, each with the free resources that carry you through it. Tick a resource when you have finished it, and test yourself on the reference tables in Practice — the same 310 cards are drawn from the tables further down this page. Search everything from the bar above, or filter by how free a resource is.'
      }),
      el('div', { class: 'legend' }, Object.keys(L.tags).map(function (k) {
        return el('div', {}, [el('span', { class: 'tag ' + k, text: L.tags[k].label }), el('span', { text: L.tags[k].desc })]);
      })),
      el('div', { class: 'grid2' }, L.principles.map(function (p) {
        return el('div', { class: 'panel', 'data-search': (p.n + ' ' + p.t).toLowerCase() }, [
          el('h3', { text: p.n }), el('p', { text: p.t })
        ]);
      })),
      el('div', {
        class: 'note',
        html: '<b>The two registers.</b> Classical Arabic (the Qur’an, hadith, pre-Islamic poetry) and Modern Standard Arabic share roughly 95% of their grammar. MSA simplifies usage and adds modern vocabulary; Classical keeps the full case system and richer constructions. Studying naḥw and ṣarf properly means learning <em>both at once</em> — what separates them later is vocabulary and style, not structure.'
      })
    ]));
  }

  /* --- practice --------------------------------------------------------- */
  function buildPractice() {
    const grid = el('div', { class: 'decks', id: 'deck-grid' });
    main.appendChild(el('section', { class: 'sec', id: 'practice' }, [
      sectionHead({
        kicker: 'Practice', title: 'Recall, not recognition',
        meta: [D.list.length + ' decks', D.count + ' cards', 'Leitner scheduling']
      }),
      el('p', {
        class: 'lede',
        text: 'Reading a table teaches you to recognise; only being asked teaches you to recall. Every card here is generated from the reference tables on this page, so nothing to import and nothing to maintain. Flip trains recall, multiple choice is quicker, and typing forces exactness — macrons and dots are ignored.'
      }),
      grid
    ]));
    renderDecks();
  }

  function renderDecks() {
    const grid = $('#deck-grid');
    if (!grid) return;
    grid.innerHTML = '';
    D.list.forEach(function (deck) {
      const c = S.counts(deck.ids);
      const phase = L.phases.filter(function (p) { return p.id === deck.phase; })[0];
      const actions = el('div', { class: 'deck-actions' });
      const label = { flip: 'Flip', mcq: 'Quiz', type: 'Type it' };
      deck.modes.forEach(function (mode, i) {
        actions.appendChild(el('button', {
          class: 'btn' + (i === 0 && c.due ? ' btn-primary' : ''), type: 'button', text: label[mode],
          onclick: function () { window.STUDY.open({ deck: deck, mode: mode }); }
        }));
      });
      grid.appendChild(el('div', {
        class: 'deck',
        'data-search': (deck.label + ' ' + deck.hint + ' ' + (phase ? phase.short : '')).toLowerCase()
      }, [
        el('div', { class: 'deck-top' }, [
          el('h3', { text: deck.label }),
          el('span', {
            class: 'due' + (c.due ? '' : ' none'),
            text: c.due ? c.due + ' due' : (c.seen ? 'up to date' : 'new')
          })
        ]),
        el('p', { text: deck.hint }),
        el('div', { class: 'mastery' }, [el('i', { style: 'width:' + (c.mastery * 100).toFixed(1) + '%' })]),
        el('div', {
          class: 'deck-meta',
          text: c.total + ' cards · ' + c.seen + ' seen · ' + c.learned + ' learned' +
            (phase ? ' · Phase ' + phase.num : '')
        }),
        actions
      ]));
    });
  }

  /* --- phases ----------------------------------------------------------- */
  function buildPhases() {
    L.phases.forEach(function (p) {
      const sec = el('section', { class: 'sec', id: p.id }, [
        sectionHead({
          num: p.num, kicker: 'Phase ' + p.num + ' · ' + p.short, title: p.title,
          meta: [p.time, p.hours, p.resources.length + ' resources'], phaseId: p.id
        }),
        el('p', { class: 'lede', text: p.intro }),
        el('p', { class: 'goal', html: '<b>Goal:</b> ' + escapeHtml(p.goal) }),
        el('p', { class: 'exit', html: '<b>You are done when:</b> ' + escapeHtml(p.exit) })
      ]);

      const decksHere = D.list.filter(function (d) { return d.phase === p.id; });
      if (decksHere.length) {
        sec.appendChild(el('div', { class: 'today-actions' }, decksHere.map(function (d) {
          const c = S.counts(d.ids);
          return el('button', {
            class: 'btn', type: 'button',
            text: 'Practise: ' + d.label + (c.due ? ' (' + c.due + ' due)' : ''),
            onclick: function () { window.STUDY.open({ deck: d, mode: 'flip' }); }
          });
        })));
      }

      if (p.ladder) {
        sec.appendChild(el('ol', { class: 'ladder' }, p.ladder.map(function (s) {
          return el('li', { 'data-search': (s.name + ' ' + s.what + ' ' + s.why).toLowerCase() }, [
            el('div', { class: 'rung', text: String(s.step) }),
            el('div', {}, [
              el('div', { class: 'name' }, [ar(s.ar), document.createTextNode(s.name)]),
              el('div', { class: 'what', text: s.what }),
              el('div', { class: 'why', text: s.why })
            ])
          ]);
        })));
      }

      sec.appendChild(el('div', { class: 'cards' }, p.resources.map(resourceCard)));
      sec.appendChild(el('div', { class: 'empty', hidden: true, text: 'No resources in this phase match your filters.' }));
      main.appendChild(sec);
    });
  }

  /* --- tools ------------------------------------------------------------ */
  function buildTools() {
    main.appendChild(el('section', { class: 'sec', id: 'tools' }, [
      sectionHead({ kicker: 'Reference', title: 'Dictionaries, analysers & libraries', meta: [L.tools.length + ' tools'] }),
      el('p', {
        class: 'lede',
        text: 'Not a phase — the workbench you keep open from week one to year ten. Learn two of them properly (Arabic Almanac for words, the Quranic Corpus for grammar) and the rest will be there when you need them.'
      }),
      el('div', { class: 'cards' }, L.tools.map(resourceCard)),
      el('div', { class: 'empty', hidden: true, text: 'No tools match your filters.' })
    ]));
  }

  /* --- listening & media ------------------------------------------------- */
  function buildMedia() {
    main.appendChild(el('section', { class: 'sec', id: 'media' }, [
      sectionHead({ kicker: 'Beyond the page', title: 'Listening, TV & spoken Arabic', meta: [L.media.length + ' sources', 'Fuṣḥā + Gulf'] }),
      el('p', {
        class: 'lede',
        text: 'Everything above teaches the written register. None of it tells you what a room full of Emiratis sounds like — for that you need broadcast audio, and there is no shortage of it for free. Start with subtitled street interviews, keep radio on in the background, and save native podcasts for when you can follow a conversation.'
      }),
      el('div', { class: 'cards' }, L.media.map(resourceCard)),
      el('div', { class: 'empty', hidden: true, text: 'No listening sources match your filters.' })
    ]));
  }

  /* --- letter tracing --------------------------------------------------- */
  function buildTracer() {
    let idx = 0;
    let guide = true;
    let drawing = false;

    const canvas = el('canvas', { width: 300, height: 300, 'aria-label': 'Handwriting practice area' });
    const nameEl = el('div', { class: 'tracer-letter' });
    const posEl = el('div', { class: 'count-note' });

    function letter() { return L.alphabet[idx]; }

    function paint() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const size = 300;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      if (guide) {
        ctx.save();
        ctx.globalAlpha = 0.16;
        ctx.fillStyle = getComputedStyle(document.body).color;
        ctx.font = '200px Amiri, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter().iso, size / 2, size / 2 + 10);
        ctx.restore();
      }
      // Baseline, so the letter is written on a line like real practice paper.
      ctx.save();
      ctx.strokeStyle = getComputedStyle(document.body).color;
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.moveTo(20, size * 0.66);
      ctx.lineTo(size - 20, size * 0.66);
      ctx.stroke();
      ctx.restore();
    }

    function show() {
      const l = letter();
      nameEl.textContent = l.iso + '   ' + l.name + ' — ' + l.tr;
      posEl.textContent = 'Letter ' + (idx + 1) + ' of ' + L.alphabet.length +
        ' · joins ' + (l.connects ? 'both sides' : 'from the right only');
      paint();
    }

    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      const ctx = canvas.getContext('2d');
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = getComputedStyle(document.body).color;
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return;
      e.preventDefault();
      const ctx = canvas.getContext('2d');
      const p = pos(e);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      canvas.addEventListener(ev, function () { drawing = false; });
    });

    const controls = el('div', { class: 'tracer-controls' }, [
      el('button', { class: 'btn', type: 'button', text: '← Previous', onclick: function () { idx = (idx + L.alphabet.length - 1) % L.alphabet.length; show(); } }),
      el('button', { class: 'btn', type: 'button', text: 'Next →', onclick: function () { idx = (idx + 1) % L.alphabet.length; show(); } }),
      el('button', { class: 'btn', type: 'button', text: 'Clear', onclick: paint }),
      el('button', {
        class: 'btn', type: 'button', text: 'Hide guide',
        onclick: function (e) {
          guide = !guide;
          e.currentTarget.textContent = guide ? 'Hide guide' : 'Show guide';
          paint();
        }
      })
    ]);

    const wrap = el('div', { class: 'tracer' }, [
      el('h3', { text: 'Write it out' }),
      el('p', { text: 'Trace the letter with a finger, stylus or mouse, then hide the guide and write it from memory. Copying by hand is what makes the shapes stick — no scoring here, because the font carries no stroke order to score against.' }),
      el('div', { class: 'tracer-stage' }, [
        canvas,
        el('div', { class: 'tracer-side' }, [nameEl, posEl, controls])
      ])
    ]);

    if (document.fonts && document.fonts.ready) document.fonts.ready.then(show);
    else show();
    show();
    return wrap;
  }

  /* --- reference tables -------------------------------------------------- */
  function buildReference() {
    const panels = [];

    panels.push({
      id: 'alphabet', label: 'Alphabet',
      build: function () {
        const rows = L.alphabet.map(function (l) {
          return [
            { text: String(l.n), class: 'num' },
            { text: l.iso, class: 'ar-big', lang: 'ar', dir: 'rtl' },
            { text: l.name, class: 'ar', lang: 'ar', dir: 'rtl' },
            l.tr,
            { text: l.ini + '  ' + l.med + '  ' + l.fin, class: 'ar', lang: 'ar', dir: 'rtl' },
            l.sound, l.makhraj, l.group === 'sun' ? 'Sun' : 'Moon'
          ];
        });
        return el('div', {}, [
          table(['#', 'Letter', 'Name', 'Translit.', 'Initial / medial / final', 'Sound', 'Articulation point', 'Sun/Moon'], rows,
            { caption: 'The 28 letters in hijāʾī order. Six — ا د ذ ر ز و — never join to the left.' }),
          buildTracer(),
          el('h3', { class: 'sec-kicker', style: 'margin-top:24px', text: 'Letters that are not letters' }),
          table(['Glyph', 'Name', 'What it does'], L.extraLetters.map(function (x) {
            return [{ text: x.glyph, class: 'ar-big', lang: 'ar', dir: 'rtl' }, x.name, x.note];
          })),
          el('ul', { class: 'facts' }, L.scriptFacts.map(function (f) {
            return el('li', { 'data-search': (f.k + ' ' + f.v).toLowerCase() }, [
              el('b', { text: f.k }), el('span', { text: f.v })
            ]);
          }))
        ]);
      }
    });

    panels.push({
      id: 'marks', label: 'Vowel marks',
      build: function () {
        return table(['Mark', 'Name', 'Translit.', 'What it does', 'Example'], L.diacritics.map(function (d) {
          return [
            { text: d.mark, class: 'ar-big', lang: 'ar', dir: 'rtl' },
            { text: d.name, class: 'ar', lang: 'ar', dir: 'rtl' },
            d.tr, d.does, { text: d.ex, class: 'ar', lang: 'ar', dir: 'rtl' }
          ];
        }), { caption: 'Ḥarakāt and the other marks. Ordinary text omits them; the Qur’an, poetry and learners’ books keep them.' });
      }
    });

    panels.push({
      id: 'grammar', label: 'Grammar core',
      build: function () {
        return el('div', {}, [
          el('h3', { class: 'sec-kicker', text: 'Iʿrāb — the case system' }),
          table(['Case', 'Name', 'Singular', 'Dual', 'Sound plural', 'When it applies'], L.cases.map(function (c) {
            return [
              { text: c.name, class: 'ar', lang: 'ar', dir: 'rtl' }, c.tr,
              { text: c.sing, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: c.dual, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: c.plural, class: 'ar', lang: 'ar', dir: 'rtl' }, c.when
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Sentence structures' }),
          table(['Arabic', 'Structure', 'Shape', 'Example', 'Note'], L.sentenceTypes.map(function (s) {
            return [
              { text: s.ar, class: 'ar', lang: 'ar', dir: 'rtl' }, s.name, s.shape,
              { text: s.ex, class: 'ar', lang: 'ar', dir: 'rtl' }, s.note
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Pronouns' }),
          table(['Person', 'Detached', 'Attached', 'Meaning'], L.pronouns.map(function (p) {
            return [
              p.person,
              { text: p.det, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: p.att, class: 'ar', lang: 'ar', dir: 'rtl' }, p.gloss
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Broken plural patterns' }),
          table(['Pattern', 'Example', 'Meaning', 'Note'], L.plurals.map(function (p) {
            return [
              { text: p.pat, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: p.ex, class: 'ar', lang: 'ar', dir: 'rtl' }, p.gloss, p.note
            ];
          }))
        ]);
      }
    });

    panels.push({
      id: 'verbs', label: 'Verb forms',
      build: function () {
        return el('div', {}, [
          table(['Form', 'Past', 'Present', 'Verbal noun', 'What it does', 'Example', 'Qur’anic example'], L.verbForms.map(function (v) {
            return [
              v.rn,
              { text: v.past, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: v.pres, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: v.masdar, class: 'ar', lang: 'ar', dir: 'rtl' },
              v.sense, { text: v.ex }, { text: v.quran }
            ];
          }), { caption: 'The ten forms on the model root ف-ع-ل. Learn the shape, not the individual verb: any root poured into a form takes that form’s meaning.' }),
          el('div', {
            class: 'note',
            html: '<b>How to drill this.</b> Take one root a week — ك-ت-ب, then ع-ل-م, then ن-ز-ل — and write out every form that exists for it with its verbal noun and participles. Check yourself against Qutrub. Ten roots done this way beats memorising the table.'
          })
        ]);
      }
    });

    panels.push({
      id: 'tajwidref', label: 'Tajwīd rules',
      build: function () {
        return el('div', {}, [
          table(['Rule', 'Translit.', 'Applies to', 'Letters', 'How it sounds', 'Memory aid'], L.tajwid.map(function (t) {
            return [
              { text: t.rule, class: 'ar', lang: 'ar', dir: 'rtl' }, t.tr, t.where,
              { text: t.letters, class: 'ar', lang: 'ar', dir: 'rtl' }, t.how, t.memo
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Makhārij — the five articulation areas' }),
          table(['Area', 'Name', 'Points', 'Letters', 'Note'], L.makharij.map(function (m) {
            return [
              { text: m.area, class: 'ar', lang: 'ar', dir: 'rtl' }, m.tr,
              { text: String(m.points), class: 'num' },
              { text: m.letters, class: 'ar', lang: 'ar', dir: 'rtl' }, m.note
            ];
          }), { caption: 'Seventeen points in five areas — the difference between reciting Arabic and reciting English sounds with Arabic letters.' })
        ]);
      }
    });

    panels.push({
      id: 'words', label: 'Qur’anic words',
      build: function () {
        return el('div', {}, [
          el('p', { class: 'lede', text: 'Two lists worth more than any other vocabulary you will learn. Both are decks in Practice above.' }),
          el('h3', { class: 'sec-kicker', style: 'margin-top:22px', text: 'Function words — learn every one' }),
          table(['Word', 'Translit.', 'Meaning', 'Grammatical role'], L.functionWords.map(function (w) {
            return [{ text: w.ar, class: 'ar', lang: 'ar', dir: 'rtl' }, w.tr, w.gloss, w.role];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'High-frequency roots' }),
          table(['Root', 'Core meaning', 'Occurrences', 'Derived words in the Qur’an'], L.roots.map(function (r) {
            return [
              { text: r.root, class: 'ar', lang: 'ar', dir: 'rtl' }, r.gloss,
              { text: r.count, class: 'num' },
              { text: r.ex, class: 'ar', lang: 'ar', dir: 'rtl' }
            ];
          }), { caption: 'Counts are approximate root-family totals — methods differ between sources. Use them to rank effort, not as exact figures; verify any single word at corpus.quran.com.' })
        ]);
      }
    });

    const tablist = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Reference tables' });
    const holder = el('div', {});

    function selectTab(id) {
      panels.forEach(function (p) {
        const on = p.id === id;
        const tab = $('#tab-' + p.id);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        $('#panel-' + p.id).hidden = !on;
      });
    }

    panels.forEach(function (p, i) {
      tablist.appendChild(el('button', {
        class: 'tab', role: 'tab', id: 'tab-' + p.id, type: 'button',
        'aria-selected': i === 0 ? 'true' : 'false',
        'aria-controls': 'panel-' + p.id, tabindex: i === 0 ? '0' : '-1',
        text: p.label,
        onclick: function () { selectTab(p.id); },
        onkeydown: function (e) {
          const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
          if (!step) return;
          e.preventDefault();
          const next = panels[(i + step + panels.length) % panels.length];
          selectTab(next.id);
          $('#tab-' + next.id).focus();
        }
      }));
      holder.appendChild(el('div', {
        class: 'tabpanel', role: 'tabpanel', id: 'panel-' + p.id,
        'aria-labelledby': 'tab-' + p.id, tabindex: '0', hidden: i !== 0
      }, [p.build()]));
    });
    window.__selectRefTab = selectTab;

    main.appendChild(el('section', { class: 'sec', id: 'reference' }, [
      sectionHead({ kicker: 'Reference', title: 'Everything you have to memorise, in one place' }),
      el('p', {
        class: 'lede',
        text: 'The tables a learner reaches for weekly — and the source of every flashcard in Practice. Search from the bar above to jump straight to a row.'
      }),
      tablist, holder
    ]));
  }

  /* --- study plan -------------------------------------------------------- */
  function buildPlan() {
    const routineHolder = el('div', {});

    function renderRoutine() {
      routineHolder.innerHTML = '';
      const r = L.routines.filter(function (x) { return x.budget === S.budget(); })[0] || L.routines[1];
      const total = r.blocks.reduce(function (a, b) { return a + b.min; }, 0);
      routineHolder.appendChild(el('div', { class: 'routine' }, [
        el('h3', { text: r.label }),
        el('p', { class: 'sub', text: r.subtitle }),
        el('ul', { class: 'blocks' }, r.blocks.map(function (b) {
          return el('li', {}, [
            el('div', { class: 'mins tnum', text: b.min + ' min' }),
            el('div', {}, [el('div', { class: 'what', text: b.what }), el('div', { class: 'how', text: b.how })])
          ]);
        })),
        el('p', { class: 'count-note', text: 'Total ' + total + ' minutes, and your daily goal. Reviews before new material, always.' })
      ]));
    }

    const budgetChips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Daily time budget' },
      L.routines.map(function (r) {
        return el('button', {
          class: 'chip', type: 'button', 'aria-pressed': S.budget() === r.budget ? 'true' : 'false', text: r.label,
          onclick: function (e) {
            S.setBudget(r.budget);
            $$('button', budgetChips).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
            e.currentTarget.setAttribute('aria-pressed', 'true');
            renderRoutine();
            refresh();
          }
        });
      }));

    renderRoutine();

    const habitBox = el('div', { class: 'habit', id: 'habit-box' });

    main.appendChild(el('section', { class: 'sec', id: 'plan' }, [
      sectionHead({ kicker: 'Practice', title: 'The daily plan', meta: [L.milestones.length + ' milestones'] }),
      el('p', {
        class: 'lede',
        text: 'A curriculum is a list; a routine is what moves you along it. Pick the budget you can keep on a bad week, not a good one — it becomes your daily goal in the tracker below.'
      }),
      budgetChips,
      routineHolder,

      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Your last ' + H.WEEKS + ' weeks' }),
      habitBox,

      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Weekly rhythm' }),
      el('ul', { class: 'facts' }, L.weeklyRhythm.map(function (w) {
        return el('li', { 'data-search': (w.day + ' ' + w.focus + ' ' + w.detail).toLowerCase() }, [
          el('b', { text: w.day + ' — ' + w.focus }), el('span', { text: w.detail })
        ]);
      })),

      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Milestones — tick them as you pass' }),
      el('ul', { class: 'milestones' }, L.milestones.map(function (m) {
        const phase = L.phases.filter(function (p) { return p.id === m.phase; })[0];
        return el('li', {
          class: S.isDone(m.id) ? 'done' : '', 'data-track': m.id,
          'data-search': (m.text + ' ' + phase.short).toLowerCase()
        }, [
          tickbox(m.id, 'Mark milestone: ' + m.text),
          el('span', { class: 'mphase', text: phase.num + ' ' + phase.short }),
          el('span', { class: 'mtext', text: m.text })
        ]);
      })),

      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Your progress data' }),
      el('p', {
        class: 'count-note',
        text: 'Ticks, card scheduling and your streak live in this browser’s local storage — nothing is uploaded anywhere. Export before clearing browser data or switching machines.'
      }),
      el('div', { class: 'chips', style: 'margin-top:10px' }, [
        el('button', { class: 'icon-btn', type: 'button', text: 'Export progress', onclick: exportProgress }),
        el('label', { class: 'icon-btn', style: 'cursor:pointer' }, [
          document.createTextNode('Import progress'),
          el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importProgress })
        ]),
        el('button', { class: 'icon-btn', type: 'button', text: 'Reset all', onclick: resetProgress })
      ])
    ]));

    renderHabit();
  }

  function renderHabit() {
    const box = $('#habit-box');
    if (!box) return;
    const hs = H.stats();
    box.innerHTML = '';
    box.appendChild(el('div', { class: 'habit-cal' }, [H.heatmap(), H.legend()]));
    box.appendChild(el('div', { class: 'habit-side' }, [
      el('div', {}, [el('b', { text: hs.streak + (hs.streak === 1 ? ' day' : ' days') }), document.createTextNode(' current streak')]),
      el('div', {}, [el('b', { text: String(hs.best) }), document.createTextNode(' best streak')]),
      el('div', {
        text: hs.minutes + ' of ' + hs.goal + ' minutes today' + (hs.metGoal ? ' — goal met' : '')
      }),
      el('div', { class: 'count-note', text: 'Reviews log their own time. Add reading or listening by hand:' }),
      el('div', { class: 'log-time' }, [15, 30, 60].map(function (n) {
        return el('button', {
          class: 'btn', type: 'button', text: '+' + n + ' min',
          onclick: function () { H.logMinutes(n); }
        });
      }))
    ]));
  }

  /* --- FAQ --------------------------------------------------------------- */
  function buildFaq() {
    main.appendChild(el('section', { class: 'sec', id: 'faq' }, [
      sectionHead({ kicker: 'Before you start', title: 'Questions people ask first' }),
      el('div', { style: 'margin-top:18px' }, L.faqs.map(function (f) {
        return el('details', { class: 'faq', 'data-search': (f.q + ' ' + f.a).toLowerCase() }, [
          el('summary', { text: f.q }), el('p', { text: f.a })
        ]);
      }))
    ]));
  }

  /* --- rail -------------------------------------------------------------- */
  function buildRail() {
    const rail = $('#rail');
    const items = [
      { id: 'today', num: '·', label: 'Today' },
      { id: 'start', num: '·', label: 'How to use this' },
      { id: 'practice', num: '·', label: 'Practice decks' }
    ]
      .concat(L.phases.map(function (p) { return { id: p.id, num: p.num, label: p.short, phase: true }; }))
      .concat([
        { id: 'tools', num: '·', label: 'Dictionaries & tools' },
        { id: 'media', num: '·', label: 'Listening & media' },
        { id: 'reference', num: '·', label: 'Reference tables' },
        { id: 'plan', num: '·', label: 'Daily plan' },
        { id: 'faq', num: '·', label: 'Questions' }
      ]);

    rail.appendChild(el('h4', { text: 'The path' }));
    rail.appendChild(el('ul', { class: 'rail-list' }, items.map(function (it) {
      const li = el('li', {}, [
        el('a', { href: '#' + it.id, 'data-rail': it.id }, [
          el('span', { class: 'rail-num', 'aria-hidden': 'true', text: it.num }),
          el('span', { text: it.label }),
          it.phase ? el('span', { class: 'rail-pct tnum', id: 'railpct-' + it.id, text: '0%' }) : null
        ])
      ]);
      if (it.phase) li.appendChild(el('div', { class: 'rail-mini' }, [el('i', { id: 'railmini-' + it.id })]));
      return li;
    })));
  }

  /* ------------------------------------------------------------- refresh */
  function refresh() {
    const ov = overall();
    const bar = $('#overall-bar i');
    if (bar) bar.style.width = (ov.pct * 100).toFixed(1) + '%';
    const lbl = $('#overall-label');
    if (lbl) lbl.textContent = ov.done + ' / ' + ov.total + ' done';

    L.phases.forEach(function (p) {
      const pr = phaseProgress(p.id);
      const C = 2 * Math.PI * 18;
      const r = $('#ring-' + p.id);
      if (r) r.setAttribute('stroke-dasharray', (pr.pct * C).toFixed(2) + ' ' + C.toFixed(2));
      const rt = $('#ringtext-' + p.id);
      if (rt) rt.textContent = Math.round(pr.pct * 100) + '%';
      const rp = $('#railpct-' + p.id);
      if (rp) rp.textContent = Math.round(pr.pct * 100) + '%';
      const rm = $('#railmini-' + p.id);
      if (rm) rm.style.width = (pr.pct * 100).toFixed(1) + '%';
    });

    $$('[data-track]').forEach(function (node) {
      const on = S.isDone(node.getAttribute('data-track'));
      node.classList.toggle(node.classList.contains('card') ? 'is-done' : 'done', on);
    });

    renderToday();
    renderDecks();
    renderHabit();
    if (filters.hideDone) applyFilters();
  }

  /* ------------------------------------------------------------ filtering */
  function applyFilters() {
    const q = filters.q.trim().toLowerCase();
    const tags = filters.tags;

    $$('.card').forEach(function (card) {
      const matchQ = !q || (card.getAttribute('data-search') || '').indexOf(q) !== -1;
      const matchTag = tags.size === 0 || tags.has(card.getAttribute('data-tag'));
      const matchDone = !filters.hideDone || !S.isDone(card.getAttribute('data-track'));
      card.hidden = !(matchQ && matchTag && matchDone);
    });

    $$('[data-search]:not(.card)').forEach(function (n) {
      if (n.classList.contains('panel') || n.classList.contains('deck') ||
          n.tagName === 'TR' || n.tagName === 'LI' || n.tagName === 'DETAILS') {
        n.hidden = !!q && (n.getAttribute('data-search') || '').indexOf(q) === -1;
      }
    });

    $$('section.sec').forEach(function (sec) {
      const cards = $$('.card', sec);
      const empty = $('.empty', sec);
      if (cards.length && empty) {
        empty.hidden = cards.filter(function (c) { return !c.hidden; }).length !== 0;
      }
      const filtering = !!q || tags.size > 0 || filters.hideDone;
      if (!filtering) { sec.hidden = false; return; }
      if (q) {
        sec.hidden = $$('[data-search]', sec).filter(function (n) { return !n.hidden; }).length === 0;
      } else {
        sec.hidden = cards.length > 0 && cards.filter(function (c) { return !c.hidden; }).length === 0;
      }
    });

    // A search must not hide hits behind an unselected tab.
    $$('.tabpanel').forEach(function (p, i) {
      if (q) p.hidden = false;
      else p.hidden = i !== 0;
    });
    if (!q && window.__selectRefTab) {
      const active = $$('.tab').filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
      if (active) window.__selectRefTab(active.id.replace('tab-', ''));
    }

    const banner = $('#no-results');
    if (banner) banner.hidden = $$('section.sec').some(function (s) { return !s.hidden; });
  }

  /* --------------------------------------------------------------- export */
  function exportProgress() {
    const blob = new Blob([JSON.stringify(S.exportState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: 'arabic-library-progress.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Progress exported.');
  }

  function importProgress(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        S.importState(JSON.parse(String(reader.result)), trackables);
        syncChecks();
        applyTheme();
        refresh();
        toast('Progress restored.');
      } catch (err) {
        toast('That file is not a progress export from this page.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!window.confirm('Clear every tick, card and streak? This cannot be undone unless you exported first.')) return;
    S.reset();
    syncChecks();
    refresh();
    toast('Progress cleared.');
  }

  function syncChecks() {
    $$('input[type="checkbox"]').forEach(function (c) {
      c.checked = S.isDone(c.id.replace('chk-', ''));
    });
  }

  let toastTimer = null;
  function toast(msg) {
    let t = $('#toast');
    if (!t) {
      t = el('div', {
        id: 'toast', role: 'status', 'aria-live': 'polite',
        style: 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--band-bg);' +
               'color:var(--band-ink);padding:10px 18px;border-radius:3px;font-size:14px;z-index:300;' +
               'box-shadow:0 8px 24px rgba(0,0,0,.25);border:1px solid var(--accent)'
      });
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ------------------------------------------------------------ scrollspy */
  function initScrollspy() {
    const links = {};
    $$('[data-rail]').forEach(function (a) { links[a.getAttribute('data-rail')] = a; });
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        const a = links[en.target.id];
        if (a) a.classList.add('active');
      });
    }, { rootMargin: '-90px 0px -70% 0px', threshold: 0 });
    $$('section.sec').forEach(function (s) { obs.observe(s); });
  }

  /* -------------------------------------------------------------- wiring */
  function initToolbar() {
    const input = $('#search');
    input.addEventListener('input', function () {
      filters.q = input.value;
      $('#search-clear').hidden = !input.value;
      applyFilters();
    });
    $('#search-clear').addEventListener('click', function () {
      input.value = ''; filters.q = ''; $('#search-clear').hidden = true; applyFilters(); input.focus();
    });

    $$('.chip[data-tag]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const tag = chip.getAttribute('data-tag');
        if (filters.tags.has(tag)) filters.tags.delete(tag); else filters.tags.add(tag);
        chip.setAttribute('aria-pressed', filters.tags.has(tag) ? 'true' : 'false');
        applyFilters();
      });
    });

    $('#hide-done').addEventListener('click', function (e) {
      filters.hideDone = !filters.hideDone;
      e.currentTarget.setAttribute('aria-pressed', filters.hideDone ? 'true' : 'false');
      applyFilters();
    });

    const select = $('#theme-select');
    THEMES.forEach(function (t) {
      select.appendChild(el('option', { value: t.id, text: t.label, selected: (S.theme() || '') === t.id }));
    });
    select.addEventListener('change', function () {
      S.setTheme(select.value || null);
      applyTheme();
    });

    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('study-open')) return;
      if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape' && document.activeElement === input) input.blur();
    });
  }

  function initStats() {
    $('#stat-resources').textContent = L.allResources.length;
    $('#stat-phases').textContent = L.phases.length;
    $('#stat-cards').textContent = D.count;
  }

  /* --------------------------------------------------------- service worker */
  function initSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;          // no SW when opened as a file
    if (!document.querySelector('link[rel="manifest"]')) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* offline install is optional */ });
    });
  }

  /* ----------------------------------------------------------------- go */
  applyTheme();
  buildRail();
  buildToday();
  buildStart();
  buildPractice();
  buildPhases();
  buildTools();
  buildMedia();
  buildReference();
  buildPlan();
  buildFaq();
  initToolbar();
  initStats();
  refresh();
  initScrollspy();
  initSW();

  return { refresh: refresh, toast: toast };
})();

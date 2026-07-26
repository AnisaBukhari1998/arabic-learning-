/* ==========================================================================
   The Free Arabic Library — application
   Renders window.LIBRARY, tracks progress in localStorage, filters and
   searches everything on the page. No dependencies, no build step.
   ========================================================================== */

(function () {
  'use strict';

  const L = window.LIBRARY;
  const STORE_PROGRESS = 'fal.progress.v1';
  const STORE_THEME = 'fal.theme.v1';
  const STORE_BUDGET = 'fal.budget.v1';

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
  const ar = function (t, cls) { return el('span', { class: 'ar' + (cls ? ' ' + cls : ''), lang: 'ar', dir: 'rtl', text: t }); };

  /* --------------------------------------------------------------- state */
  const state = {
    q: '',
    tags: new Set(),
    hideDone: false,
    done: new Set(load(STORE_PROGRESS, [])),
    budget: localStorage.getItem(STORE_BUDGET) || '60'
  };

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_PROGRESS, JSON.stringify(Array.prototype.slice.call(state.done))); }
    catch (e) { /* private mode — progress simply won't persist */ }
  }

  /* --------------------------------------------------------------- theme */
  function initTheme() {
    const saved = localStorage.getItem(STORE_THEME);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    syncThemeButton();
  }
  function currentTheme() {
    const set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(STORE_THEME, next); } catch (e) {}
    syncThemeButton();
  }
  function syncThemeButton() {
    const b = $('#theme-btn');
    if (!b) return;
    const dark = currentTheme() === 'dark';
    b.textContent = dark ? 'Light' : 'Dark';
    b.setAttribute('aria-label', 'Switch to ' + (dark ? 'light' : 'dark') + ' theme');
  }

  /* ------------------------------------------------------------ progress */
  const trackables = (function () {
    const ids = [];
    L.allResources.forEach(function (r) { ids.push(r.id); });
    L.milestones.forEach(function (m) { ids.push(m.id); });
    return ids;
  })();

  function isDone(id) { return state.done.has(id); }
  function setDone(id, on) {
    if (on) state.done.add(id); else state.done.delete(id);
    saveProgress();
    refreshProgress();
  }
  function phaseProgress(phaseId) {
    const items = L.allResources.filter(function (r) { return r.phase === phaseId; });
    const ms = L.milestones.filter(function (m) { return m.phase === phaseId; });
    const total = items.length + ms.length;
    let n = 0;
    items.forEach(function (r) { if (isDone(r.id)) n++; });
    ms.forEach(function (m) { if (isDone(m.id)) n++; });
    return { done: n, total: total, pct: total ? n / total : 0 };
  }

  function refreshProgress() {
    // overall
    let n = 0;
    trackables.forEach(function (id) { if (isDone(id)) n++; });
    const pct = trackables.length ? n / trackables.length : 0;
    const bar = $('#overall-bar i');
    if (bar) bar.style.width = (pct * 100).toFixed(1) + '%';
    const lbl = $('#overall-label');
    if (lbl) lbl.textContent = n + ' / ' + trackables.length + ' done';

    // per-phase rings + rail
    L.phases.forEach(function (p) {
      const pr = phaseProgress(p.id);
      const ring = $('#ring-' + p.id);
      if (ring) {
        const C = 2 * Math.PI * 18;
        ring.setAttribute('stroke-dasharray', (pr.pct * C).toFixed(2) + ' ' + C.toFixed(2));
      }
      const rt = $('#ringtext-' + p.id);
      if (rt) rt.textContent = Math.round(pr.pct * 100) + '%';
      const rp = $('#railpct-' + p.id);
      if (rp) rp.textContent = Math.round(pr.pct * 100) + '%';
      const rm = $('#railmini-' + p.id);
      if (rm) rm.style.width = (pr.pct * 100).toFixed(1) + '%';
    });

    // card + milestone visual state
    $$('[data-track]').forEach(function (node) {
      const on = isDone(node.getAttribute('data-track'));
      node.classList.toggle(node.classList.contains('card') ? 'is-done' : 'done', on);
    });

    if (state.hideDone) applyFilters();
  }

  /* ---------------------------------------------------------- components */
  function tickbox(id, label) {
    const input = el('input', {
      type: 'checkbox',
      id: 'chk-' + id,
      checked: isDone(id),
      'aria-label': label,
      onchange: function (e) { setDone(id, e.target.checked); }
    });
    return el('label', { class: 'tick', for: 'chk-' + id }, [input, el('span', { 'aria-hidden': 'true' })]);
  }

  function resourceCard(r) {
    const tag = L.tags[r.tag];
    const title = r.url
      ? el('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', text: r.name })
      : document.createTextNode(r.name);

    const card = el('div', {
      class: 'card' + (r.best ? ' is-best' : '') + (isDone(r.id) ? ' is-done' : ''),
      'data-track': r.id,
      'data-tag': r.tag,
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
    return card;
  }

  function ring(phaseId) {
    const C = 2 * Math.PI * 18;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ring');
    svg.setAttribute('viewBox', '0 0 44 44');
    svg.setAttribute('aria-hidden', 'true');
    const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    track.setAttribute('class', 'track'); track.setAttribute('cx', '22'); track.setAttribute('cy', '22'); track.setAttribute('r', '18');
    const val = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    val.setAttribute('class', 'val'); val.setAttribute('cx', '22'); val.setAttribute('cy', '22'); val.setAttribute('r', '18');
    val.setAttribute('id', 'ring-' + phaseId);
    val.setAttribute('stroke-dasharray', '0 ' + C.toFixed(2));
    svg.appendChild(track); svg.appendChild(val);
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
      const tr = el('tr', { 'data-search': r.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join(' ').toLowerCase() },
        r.map(function (c) {
          if (typeof c === 'string') return el('td', { text: c });
          return el('td', { class: c.class || null, text: c.text, lang: c.lang || null, dir: c.dir || null });
        }));
      return tr;
    }));
    const t = el('table', {}, [opts.caption ? el('caption', { text: opts.caption }) : null, thead, tbody]);
    return el('div', { class: 'tablewrap' }, [t]);
  }

  /* -------------------------------------------------------------- build */
  const main = $('#main');

  /* --- orientation ------------------------------------------------------ */
  function buildStart() {
    const sec = el('section', { class: 'sec', id: 'start' }, [
      sectionHead({ kicker: 'Orientation', title: 'How to use this library' }),
      el('p', { class: 'lede', text: 'Eight phases, in order, each with the free resources that actually carry you through it. Tick a resource when you have finished it — progress is saved in this browser only. Search the whole page from the bar above, or filter by how free a resource is. Nothing here requires a payment, and the three "public domain" items are yours to download and keep.' }),
      el('div', { class: 'legend' }, Object.keys(L.tags).map(function (k) {
        return el('div', {}, [el('span', { class: 'tag ' + k, text: L.tags[k].label }), el('span', { text: L.tags[k].desc })]);
      })),
      el('div', { class: 'grid2' }, L.principles.map(function (p) {
        return el('div', { class: 'panel', 'data-search': (p.n + ' ' + p.t).toLowerCase() }, [
          el('h3', { text: p.n }),
          el('p', { text: p.t })
        ]);
      })),
      el('div', { class: 'note', html: '<b>The two registers.</b> Classical Arabic (the Qur’an, hadith, pre-Islamic poetry) and Modern Standard Arabic share roughly 95% of their grammar. MSA simplifies usage and adds modern vocabulary; Classical keeps the full case system and richer constructions. Studying naḥw and ṣarf properly means learning <em>both at once</em> — what separates them later is vocabulary and style, not structure.' })
    ]);
    main.appendChild(sec);
  }

  /* --- phases ----------------------------------------------------------- */
  function buildPhases() {
    L.phases.forEach(function (p) {
      const sec = el('section', { class: 'sec', id: p.id }, [
        sectionHead({
          num: p.num,
          kicker: 'Phase ' + p.num + ' · ' + p.short,
          title: p.title,
          meta: [p.time, p.hours, p.resources.length + ' resources'],
          phaseId: p.id
        }),
        el('p', { class: 'lede', text: p.intro }),
        el('p', { class: 'goal', html: '<b>Goal:</b> ' + escapeHtml(p.goal) }),
        el('p', { class: 'exit', html: '<b>You are done when:</b> ' + escapeHtml(p.exit) })
      ]);

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
    const sec = el('section', { class: 'sec', id: 'tools' }, [
      sectionHead({ kicker: 'Reference', title: 'Dictionaries, analysers & libraries', meta: [L.tools.length + ' tools'] }),
      el('p', { class: 'lede', text: 'These are not a phase — they are the workbench you keep open from week one to year ten. Learn two of them properly (Arabic Almanac for words, the Quranic Corpus for grammar) and the rest will be there when you need them.' }),
      el('div', { class: 'cards' }, L.tools.map(resourceCard)),
      el('div', { class: 'empty', hidden: true, text: 'No tools match your filters.' })
    ]);
    main.appendChild(sec);
  }

  /* --- reference tables -------------------------------------------------- */
  function buildReference() {
    const panels = [];

    // Alphabet
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
            l.sound,
            l.makhraj,
            l.group === 'sun' ? 'Sun' : 'Moon'
          ];
        });
        return el('div', {}, [
          table(['#', 'Letter', 'Name', 'Translit.', 'Initial / medial / final', 'Sound', 'Articulation point', 'Sun/Moon'], rows,
            { caption: 'The 28 letters, in the standard hijāʾī order. Six letters — ا د ذ ر ز و — never join to the left.' }),
          el('h3', { class: 'sec-kicker', style: 'margin-top:24px', text: 'Letters that are not letters' }),
          table(['Glyph', 'Name', 'What it does'], L.extraLetters.map(function (x) {
            return [{ text: x.glyph, class: 'ar-big', lang: 'ar', dir: 'rtl' }, x.name, x.note];
          })),
          el('ul', { class: 'facts' }, L.scriptFacts.map(function (f) {
            return el('li', { 'data-search': (f.k + ' ' + f.v).toLowerCase() }, [el('b', { text: f.k }), el('span', { text: f.v })]);
          }))
        ]);
      }
    });

    // Marks
    panels.push({
      id: 'marks', label: 'Vowel marks',
      build: function () {
        return table(['Mark', 'Name', 'Translit.', 'What it does', 'Example'], L.diacritics.map(function (d) {
          return [
            { text: d.mark, class: 'ar-big', lang: 'ar', dir: 'rtl' },
            { text: d.name, class: 'ar', lang: 'ar', dir: 'rtl' },
            d.tr, d.does,
            { text: d.ex, class: 'ar', lang: 'ar', dir: 'rtl' }
          ];
        }), { caption: 'Ḥarakāt and the other marks. Written text usually omits them; the Qur’an, poetry and learners’ books keep them.' });
      }
    });

    // Grammar
    panels.push({
      id: 'grammar', label: 'Grammar core',
      build: function () {
        return el('div', {}, [
          el('h3', { class: 'sec-kicker', text: 'Iʿrāb — the case system' }),
          table(['Case', 'Name', 'Singular', 'Dual', 'Sound plural', 'When it applies'], L.cases.map(function (c) {
            return [
              { text: c.name, class: 'ar', lang: 'ar', dir: 'rtl' },
              c.tr,
              { text: c.sing, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: c.dual, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: c.plural, class: 'ar', lang: 'ar', dir: 'rtl' },
              c.when
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Sentence structures' }),
          table(['Arabic', 'Structure', 'Shape', 'Example', 'Note'], L.sentenceTypes.map(function (s) {
            return [
              { text: s.ar, class: 'ar', lang: 'ar', dir: 'rtl' },
              s.name, s.shape,
              { text: s.ex, class: 'ar', lang: 'ar', dir: 'rtl' },
              s.note
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Pronouns' }),
          table(['Person', 'Detached', 'Attached', 'Meaning'], L.pronouns.map(function (p) {
            return [
              p.person,
              { text: p.det, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: p.att, class: 'ar', lang: 'ar', dir: 'rtl' },
              p.gloss
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Broken plural patterns' }),
          table(['Pattern', 'Example', 'Meaning', 'Note'], L.plurals.map(function (p) {
            return [
              { text: p.pat, class: 'ar', lang: 'ar', dir: 'rtl' },
              { text: p.ex, class: 'ar', lang: 'ar', dir: 'rtl' },
              p.gloss, p.note
            ];
          }))
        ]);
      }
    });

    // Verb forms
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
              v.sense,
              { text: v.ex },
              { text: v.quran }
            ];
          }), { caption: 'The ten forms, built on the model root ف-ع-ل. Learn the shape, not the individual verb: any root poured into a form takes that form’s meaning.' }),
          el('div', { class: 'note', html: '<b>How to drill this.</b> Take one root a week — ك-ت-ب, then ع-ل-م, then ن-ز-ل — and write out every form that actually exists for it, with its verbal noun, active participle and passive participle. Check yourself against Qutrub. Ten roots done this way beats memorising the table.' })
        ]);
      }
    });

    // Tajwid
    panels.push({
      id: 'tajwidref', label: 'Tajwīd rules',
      build: function () {
        return el('div', {}, [
          table(['Rule', 'Translit.', 'Applies to', 'Letters', 'How it sounds', 'Memory aid'], L.tajwid.map(function (t) {
            return [
              { text: t.rule, class: 'ar', lang: 'ar', dir: 'rtl' },
              t.tr, t.where,
              { text: t.letters, class: 'ar', lang: 'ar', dir: 'rtl' },
              t.how, t.memo
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'Makhārij — the five articulation areas' }),
          table(['Area', 'Name', 'Points', 'Letters', 'Note'], L.makharij.map(function (m) {
            return [
              { text: m.area, class: 'ar', lang: 'ar', dir: 'rtl' },
              m.tr,
              { text: String(m.points), class: 'num' },
              { text: m.letters, class: 'ar', lang: 'ar', dir: 'rtl' },
              m.note
            ];
          }), { caption: 'Seventeen articulation points in five areas. Learning them is the difference between reciting Arabic and reciting English sounds with Arabic letters.' })
        ]);
      }
    });

    // Qur'anic words
    panels.push({
      id: 'words', label: 'Qur’anic words',
      build: function () {
        return el('div', {}, [
          el('p', { class: 'lede', text: 'Two lists worth more than any other vocabulary you will learn. The function words below are the syntax of the Qur’an — learn all of them before your thousandth noun. The roots after them are the highest-frequency root families in the text.' }),
          el('h3', { class: 'sec-kicker', style: 'margin-top:22px', text: 'Function words — learn every one' }),
          table(['Word', 'Translit.', 'Meaning', 'Grammatical role'], L.functionWords.map(function (w) {
            return [
              { text: w.ar, class: 'ar', lang: 'ar', dir: 'rtl' },
              w.tr, w.gloss, w.role
            ];
          })),
          el('h3', { class: 'sec-kicker', style: 'margin-top:26px', text: 'High-frequency roots' }),
          table(['Root', 'Core meaning', 'Occurrences', 'Derived words in the Qur’an'], L.roots.map(function (r) {
            return [
              { text: r.root, class: 'ar', lang: 'ar', dir: 'rtl' },
              r.gloss,
              { text: r.count, class: 'num' },
              { text: r.ex, class: 'ar', lang: 'ar', dir: 'rtl' }
            ];
          }), { caption: 'Counts are approximate root-family totals — methods of counting differ between sources. Use them to rank your effort, not as exact figures. Verify any single word at corpus.quran.com.' })
        ]);
      }
    });

    const tablist = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Reference tables' });
    const holder = el('div', {});

    panels.forEach(function (p, i) {
      const tab = el('button', {
        class: 'tab', role: 'tab', id: 'tab-' + p.id, type: 'button',
        'aria-selected': i === 0 ? 'true' : 'false',
        'aria-controls': 'panel-' + p.id,
        tabindex: i === 0 ? '0' : '-1',
        text: p.label,
        onclick: function () { selectTab(p.id); },
        onkeydown: function (e) {
          const keys = { ArrowRight: 1, ArrowLeft: -1 };
          if (!(e.key in keys)) return;
          e.preventDefault();
          const idx = (i + keys[e.key] + panels.length) % panels.length;
          selectTab(panels[idx].id);
          $('#tab-' + panels[idx].id).focus();
        }
      });
      tablist.appendChild(tab);
      const panel = el('div', {
        class: 'tabpanel', role: 'tabpanel', id: 'panel-' + p.id,
        'aria-labelledby': 'tab-' + p.id, tabindex: '0', hidden: i !== 0
      }, [p.build()]);
      holder.appendChild(panel);
    });

    function selectTab(id) {
      panels.forEach(function (p) {
        const on = p.id === id;
        const tab = $('#tab-' + p.id);
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        $('#panel-' + p.id).hidden = !on;
      });
    }
    window.__selectRefTab = selectTab;

    const sec = el('section', { class: 'sec', id: 'reference' }, [
      sectionHead({ kicker: 'Reference', title: 'Everything you have to memorise, in one place' }),
      el('p', { class: 'lede', text: 'The tables a learner reaches for weekly: the alphabet with articulation points, the vowel marks, the case system, the ten verb forms, the tajwīd rules, and the Qur’anic words that matter most. Search from the bar above to jump straight to a row.' }),
      tablist, holder
    ]);
    main.appendChild(sec);
  }

  /* --- study plan -------------------------------------------------------- */
  function buildPlan() {
    const routineHolder = el('div', {});

    function renderRoutine() {
      routineHolder.innerHTML = '';
      const r = L.routines.filter(function (x) { return x.budget === state.budget; })[0] || L.routines[1];
      const total = r.blocks.reduce(function (a, b) { return a + b.min; }, 0);
      routineHolder.appendChild(el('div', { class: 'routine' }, [
        el('h3', { text: r.label }),
        el('p', { class: 'sub', text: r.subtitle }),
        el('ul', { class: 'blocks' }, r.blocks.map(function (b) {
          return el('li', {}, [
            el('div', { class: 'mins tnum', text: b.min + ' min' }),
            el('div', {}, [
              el('div', { class: 'what', text: b.what }),
              el('div', { class: 'how', text: b.how })
            ])
          ]);
        })),
        el('p', { class: 'count-note', text: 'Total ' + total + ' minutes. The order matters: reviews before new material, always.' })
      ]));
    }

    const budgetChips = el('div', { class: 'chips', role: 'group', 'aria-label': 'Daily time budget' },
      L.routines.map(function (r) {
        return el('button', {
          class: 'chip', type: 'button', 'aria-pressed': state.budget === r.budget ? 'true' : 'false',
          text: r.label,
          onclick: function (e) {
            state.budget = r.budget;
            try { localStorage.setItem(STORE_BUDGET, r.budget); } catch (err) {}
            $$('button', budgetChips).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
            e.currentTarget.setAttribute('aria-pressed', 'true');
            renderRoutine();
          }
        });
      }));

    renderRoutine();

    const sec = el('section', { class: 'sec', id: 'plan' }, [
      sectionHead({ kicker: 'Practice', title: 'The daily plan', meta: [L.milestones.length + ' milestones'] }),
      el('p', { class: 'lede', text: 'A curriculum is a list; a routine is what actually moves you along it. Pick the time budget you can genuinely keep on a bad week, not a good one — then protect it.' }),
      budgetChips,
      routineHolder,
      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Weekly rhythm' }),
      el('ul', { class: 'facts' }, L.weeklyRhythm.map(function (w) {
        return el('li', { 'data-search': (w.day + ' ' + w.focus + ' ' + w.detail).toLowerCase() }, [
          el('b', { text: w.day + ' — ' + w.focus }),
          el('span', { text: w.detail })
        ]);
      })),
      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Milestones — tick them as you pass' }),
      el('ul', { class: 'milestones' }, L.milestones.map(function (m) {
        const phase = L.phases.filter(function (p) { return p.id === m.phase; })[0];
        return el('li', {
          class: isDone(m.id) ? 'done' : '',
          'data-track': m.id,
          'data-search': (m.text + ' ' + phase.short).toLowerCase()
        }, [
          tickbox(m.id, 'Mark milestone: ' + m.text),
          el('span', { class: 'mphase', text: phase.num + ' ' + phase.short }),
          el('span', { class: 'mtext', text: m.text })
        ]);
      })),
      el('h3', { class: 'sec-kicker', style: 'margin-top:30px', text: 'Your progress data' }),
      el('p', { class: 'count-note', text: 'Progress lives in this browser’s local storage — nothing is uploaded anywhere. Export it before clearing your browser data or switching machines.' }),
      el('div', { class: 'chips', style: 'margin-top:10px' }, [
        el('button', { class: 'icon-btn', type: 'button', text: 'Export progress', onclick: exportProgress }),
        el('label', { class: 'icon-btn', style: 'cursor:pointer' }, [
          document.createTextNode('Import progress'),
          el('input', { type: 'file', accept: 'application/json', style: 'display:none', onchange: importProgress })
        ]),
        el('button', { class: 'icon-btn', type: 'button', text: 'Reset all', onclick: resetProgress })
      ])
    ]);
    main.appendChild(sec);
  }

  /* --- FAQ --------------------------------------------------------------- */
  function buildFaq() {
    const sec = el('section', { class: 'sec', id: 'faq' }, [
      sectionHead({ kicker: 'Before you start', title: 'Questions people ask first' }),
      el('div', { style: 'margin-top:18px' }, L.faqs.map(function (f) {
        return el('details', { class: 'faq', 'data-search': (f.q + ' ' + f.a).toLowerCase() }, [
          el('summary', { text: f.q }),
          el('p', { text: f.a })
        ]);
      }))
    ]);
    main.appendChild(sec);
  }

  /* --- rail -------------------------------------------------------------- */
  function buildRail() {
    const rail = $('#rail');
    const items = [{ id: 'start', num: '·', label: 'How to use this' }]
      .concat(L.phases.map(function (p) { return { id: p.id, num: p.num, label: p.short, phase: true }; }))
      .concat([
        { id: 'tools', num: '·', label: 'Dictionaries & tools' },
        { id: 'reference', num: '·', label: 'Reference tables' },
        { id: 'plan', num: '·', label: 'Daily plan' },
        { id: 'faq', num: '·', label: 'Questions' }
      ]);

    const list = el('ul', { class: 'rail-list' }, items.map(function (it) {
      const a = el('a', { href: '#' + it.id, 'data-rail': it.id }, [
        el('span', { class: 'rail-num', 'aria-hidden': 'true', text: it.num }),
        el('span', { text: it.label }),
        it.phase ? el('span', { class: 'rail-pct tnum', id: 'railpct-' + it.id, text: '0%' }) : null
      ]);
      const li = el('li', {}, [a]);
      if (it.phase) {
        li.appendChild(el('div', { class: 'rail-mini' }, [el('i', { id: 'railmini-' + it.id })]));
      }
      return li;
    }));

    rail.appendChild(el('h4', { text: 'The path' }));
    rail.appendChild(list);
  }

  /* ------------------------------------------------------------ filtering */
  function applyFilters() {
    const q = state.q.trim().toLowerCase();
    const tags = state.tags;

    // resource cards
    $$('.card').forEach(function (card) {
      const matchQ = !q || (card.getAttribute('data-search') || '').indexOf(q) !== -1;
      const matchTag = tags.size === 0 || tags.has(card.getAttribute('data-tag'));
      const matchDone = !state.hideDone || !isDone(card.getAttribute('data-track'));
      card.hidden = !(matchQ && matchTag && matchDone);
    });

    // rows, list items, panels, faqs — text search only
    $$('[data-search]:not(.card)').forEach(function (n) {
      if (n.classList.contains('panel') || n.tagName === 'TR' || n.tagName === 'LI' || n.tagName === 'DETAILS') {
        n.hidden = !!q && (n.getAttribute('data-search') || '').indexOf(q) === -1;
      }
    });

    // section-level empty states and hiding
    $$('section.sec').forEach(function (sec) {
      const cards = $$('.card', sec);
      const empty = $('.empty', sec);
      if (cards.length) {
        const visible = cards.filter(function (c) { return !c.hidden; }).length;
        if (empty) empty.hidden = visible !== 0;
      }
      const filtering = !!q || tags.size > 0 || state.hideDone;
      if (!filtering) { sec.hidden = false; return; }
      // hide a whole section only when nothing inside it survives a text query
      if (q) {
        const hits = $$('[data-search]', sec).filter(function (n) { return !n.hidden; }).length;
        sec.hidden = hits === 0;
      } else if (tags.size > 0 || state.hideDone) {
        sec.hidden = cards.length > 0 && cards.filter(function (c) { return !c.hidden; }).length === 0;
      }
    });

    // when searching, reveal every reference tab so hits are not hidden behind a tab
    const anyQuery = !!q;
    $$('.tabpanel').forEach(function (p, i) {
      if (anyQuery) p.hidden = false;
      else p.hidden = i !== 0;
    });
    if (!anyQuery && window.__selectRefTab) {
      const active = $$('.tab').filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
      if (active) window.__selectRefTab(active.id.replace('tab-', ''));
    }

    const banner = $('#no-results');
    if (banner) {
      const anythingVisible = $$('section.sec').some(function (s) { return !s.hidden; });
      banner.hidden = anythingVisible;
    }
  }

  /* --------------------------------------------------------------- export */
  function exportProgress() {
    const payload = {
      app: 'the-free-arabic-library',
      version: 1,
      exported: new Date().toISOString(),
      done: Array.prototype.slice.call(state.done)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = el('a', { href: url, download: 'arabic-library-progress.json' });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function importProgress(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || !Array.isArray(data.done)) throw new Error('bad file');
        state.done = new Set(data.done.filter(function (id) { return trackables.indexOf(id) !== -1; }));
        saveProgress();
        $$('input[type="checkbox"]').forEach(function (c) {
          const id = c.id.replace('chk-', '');
          c.checked = isDone(id);
        });
        refreshProgress();
        toast(state.done.size + ' items restored.');
      } catch (err) {
        toast('That file is not a progress export from this page.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    if (!window.confirm('Clear every tick on this page? This cannot be undone unless you exported first.')) return;
    state.done = new Set();
    saveProgress();
    $$('input[type="checkbox"]').forEach(function (c) { c.checked = false; });
    refreshProgress();
    toast('Progress cleared.');
  }

  let toastTimer = null;
  function toast(msg) {
    let t = $('#toast');
    if (!t) {
      t = el('div', {
        id: 'toast',
        style: 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--indigo);color:#F3EEE0;' +
               'padding:10px 18px;border-radius:3px;font-size:14px;z-index:200;box-shadow:0 8px 24px rgba(0,0,0,.25);border:1px solid var(--gold)'
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

  /* --------------------------------------------------------------- utils */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* -------------------------------------------------------------- wiring */
  function initToolbar() {
    const input = $('#search');
    input.addEventListener('input', function () {
      state.q = input.value;
      $('#search-clear').hidden = !input.value;
      applyFilters();
    });
    $('#search-clear').addEventListener('click', function () {
      input.value = ''; state.q = ''; $('#search-clear').hidden = true; applyFilters(); input.focus();
    });

    $$('.chip[data-tag]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const tag = chip.getAttribute('data-tag');
        if (state.tags.has(tag)) state.tags.delete(tag); else state.tags.add(tag);
        chip.setAttribute('aria-pressed', state.tags.has(tag) ? 'true' : 'false');
        applyFilters();
      });
    });

    $('#hide-done').addEventListener('click', function (e) {
      state.hideDone = !state.hideDone;
      e.currentTarget.setAttribute('aria-pressed', state.hideDone ? 'true' : 'false');
      applyFilters();
    });

    $('#theme-btn').addEventListener('click', toggleTheme);

    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      if (e.key === 'Escape' && document.activeElement === input) { input.blur(); }
    });
  }

  function initStats() {
    $('#stat-resources').textContent = L.allResources.length;
    $('#stat-phases').textContent = L.phases.length;
    const free = L.allResources.filter(function (r) { return r.tag !== 'freemium'; }).length;
    $('#stat-free').textContent = free;
  }

  /* ----------------------------------------------------------------- go */
  initTheme();
  buildRail();
  buildStart();
  buildPhases();
  buildTools();
  buildReference();
  buildPlan();
  buildFaq();
  initToolbar();
  initStats();
  refreshProgress();
  initScrollspy();
})();

/* ==========================================================================
   Study — the review session: flip cards, multiple choice, or type the answer.
   Opens as a modal over the page, keyboard-first, and logs what you did.
   ========================================================================== */

window.STUDY = (function () {
  'use strict';

  const S = window.STORE;
  const D = window.DECKS;

  let root = null;        // dialog element
  let restoreFocus = null;
  let session = null;

  /* -------------------------------------------------------------- helpers */
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      const v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, '');
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }
  function ar(t, cls) {
    return el('div', { class: 'ar ' + (cls || ''), lang: 'ar', dir: 'rtl', text: t });
  }

  /* ---------------------------------------------------------------- open */
  function open(opts) {
    const deck = typeof opts.deck === 'string' ? D.byId(opts.deck) : opts.deck;
    if (!deck) return;
    const mode = deck.modes.indexOf(opts.mode) !== -1 ? opts.mode : 'flip';

    let ids = S.queue(deck.ids, opts.limit || 20);
    let ahead = false;
    if (!ids.length) {                    // nothing due — offer a light re-run
      ids = S.shuffle(deck.ids.slice()).slice(0, Math.min(10, deck.ids.length));
      ahead = true;
    }

    session = {
      deck: deck, mode: mode, ahead: ahead,
      cards: ids.map(function (id) {
        return deck.cards.filter(function (c) { return c.id === id; })[0];
      }).filter(Boolean),
      i: 0, reviews: 0, correct: 0, started: Date.now(), revealed: false, answered: null
    };

    restoreFocus = document.activeElement;
    root = el('div', { class: 'study', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Study session: ' + deck.label });
    document.body.appendChild(root);
    document.body.classList.add('study-open');
    document.addEventListener('keydown', onKey, true);
    render();
  }

  function close() {
    if (!root) return;
    if (session && session.reviews && !session.logged) logAndFinish();
    document.removeEventListener('keydown', onKey, true);
    document.body.classList.remove('study-open');
    root.remove();
    root = null;
    session = null;
    if (restoreFocus && restoreFocus.focus) restoreFocus.focus();
    if (window.APP && window.APP.refresh) window.APP.refresh();
  }

  function logAndFinish() {
    const mins = Math.max(1, Math.round((Date.now() - session.started) / 60000));
    S.logSession({ reviews: session.reviews, correct: session.correct, minutes: mins });
    session.logged = true;
    return mins;
  }

  /* --------------------------------------------------------------- render */
  function render() {
    const s = session;
    root.innerHTML = '';

    if (s.i >= s.cards.length) return renderDone();

    const card = s.cards[s.i];
    const state = S.cardState(card.id);
    const boxLabel = state ? 'box ' + state.b + '/' + S.MAX_BOX : 'new';

    root.appendChild(el('div', { class: 'study-bar' }, [
      el('div', { class: 'study-meta' }, [
        el('b', { text: s.deck.label }),
        el('span', { text: modeLabel(s.mode) + ' · ' + (s.i + 1) + ' of ' + s.cards.length + ' · ' + boxLabel })
      ]),
      el('button', { class: 'icon-btn', type: 'button', text: 'Close', 'aria-label': 'End session', onclick: close })
    ]));
    root.appendChild(el('div', { class: 'study-progress' }, [
      el('i', { style: 'width:' + (s.i / s.cards.length * 100).toFixed(1) + '%' })
    ]));

    const body = el('div', { class: 'study-body' });
    root.appendChild(body);

    if (card.prompt.ar) body.appendChild(ar(card.prompt.ar, 'study-ar'));
    body.appendChild(el('p', { class: 'study-q', text: card.prompt.text }));

    if (s.mode === 'flip') renderFlip(body, card);
    else if (s.mode === 'mcq') renderMcq(body, card);
    else renderType(body, card);
  }

  function modeLabel(m) {
    return m === 'flip' ? 'Flip' : m === 'mcq' ? 'Multiple choice' : 'Type it';
  }

  function reveal(body, card, extra) {
    const box = el('div', { class: 'study-answer' }, [
      card.answer.ar ? ar(card.answer.ar, 'study-ar-answer') : null,
      el('p', { text: card.answer.text })
    ]);
    if (extra) box.appendChild(extra);
    body.appendChild(box);
    return box;
  }

  /* ------------------------------------------------------------- flip mode */
  function renderFlip(body, card) {
    if (!session.revealed) {
      body.appendChild(el('div', { class: 'study-actions' }, [
        el('button', {
          class: 'btn btn-primary', type: 'button', text: 'Show answer',
          onclick: function () { session.revealed = true; render(); }
        }),
        el('p', { class: 'study-hint', text: 'Say it out loud first — then press space.' })
      ]));
      focusFirst();
      return;
    }
    reveal(body, card);
    body.appendChild(el('div', { class: 'study-actions grades' }, [
      gradeBtn('again', 'Again', '1'),
      gradeBtn('good', 'Good', '2'),
      gradeBtn('easy', 'Easy', '3')
    ]));
    focusFirst();
  }

  function gradeBtn(g, label, key) {
    return el('button', {
      class: 'btn grade grade-' + g, type: 'button',
      onclick: function () { commit(g); }
    }, [
      el('span', { text: label }),
      el('kbd', { text: key })
    ]);
  }

  /* -------------------------------------------------------------- mcq mode */
  function renderMcq(body, card) {
    const options = S.shuffle([card.short].concat(D.distractors(session.deck, card, 3)));
    if (session.answered === null) {
      const wrap = el('div', { class: 'study-options' });
      options.forEach(function (opt) {
        wrap.appendChild(el('button', {
          class: 'btn option', type: 'button', text: opt,
          onclick: function () {
            session.answered = opt === card.short;
            render();
          }
        }));
      });
      body.appendChild(wrap);
      focusFirst();
      return;
    }
    const ok = session.answered;
    reveal(body, card, el('p', {
      class: 'study-verdict ' + (ok ? 'ok' : 'no'),
      text: ok ? 'Correct.' : 'Not this time — the answer is above.'
    }));
    body.appendChild(el('div', { class: 'study-actions' }, [
      el('button', {
        class: 'btn btn-primary', type: 'button', text: 'Next card',
        onclick: function () { commit(ok ? 'good' : 'again', ok); }
      })
    ]));
    focusFirst();
  }

  /* ------------------------------------------------------------- type mode */
  function renderType(body, card) {
    if (session.answered === null) {
      const input = el('input', {
        class: 'study-input', type: 'text', autocomplete: 'off', autocapitalize: 'off',
        spellcheck: 'false', 'aria-label': 'Type your answer', placeholder: 'Type the transliteration…'
      });
      const submit = function () {
        const given = D.normalise(input.value);
        if (!given) return;
        session.answered = card.accept.indexOf(given) !== -1;
        render();
      };
      const form = el('form', { class: 'study-actions', onsubmit: function (e) { e.preventDefault(); submit(); } }, [
        input,
        el('button', { class: 'btn btn-primary', type: 'submit', text: 'Check' })
      ]);
      body.appendChild(form);
      body.appendChild(el('p', { class: 'study-hint', text: 'Macrons and dots don’t matter — “ha” passes for “ḥāʾ”.' }));
      input.focus();
      return;
    }
    const ok = session.answered;
    reveal(body, card, el('p', {
      class: 'study-verdict ' + (ok ? 'ok' : 'no'),
      text: ok ? 'Correct.' : 'Expected: ' + card.short
    }));
    body.appendChild(el('div', { class: 'study-actions' }, [
      el('button', {
        class: 'btn btn-primary', type: 'button', text: 'Next card',
        onclick: function () { commit(ok ? 'good' : 'again', ok); }
      })
    ]));
    focusFirst();
  }

  /* -------------------------------------------------------------- advance */
  function commit(g, wasCorrect) {
    const card = session.cards[session.i];
    S.grade(card.id, g);
    session.reviews++;
    if (g !== 'again' && wasCorrect !== false) session.correct++;
    session.i++;
    session.revealed = false;
    session.answered = null;
    render();
  }

  function renderDone() {
    const mins = session.logged ? null : logAndFinish();
    const acc = session.reviews ? Math.round(session.correct / session.reviews * 100) : 0;
    root.appendChild(el('div', { class: 'study-bar' }, [
      el('div', { class: 'study-meta' }, [el('b', { text: 'Session complete' })]),
      el('button', { class: 'icon-btn', type: 'button', text: 'Close', onclick: close })
    ]));
    root.appendChild(el('div', { class: 'study-body study-summary' }, [
      el('div', { class: 'summary-stats' }, [
        stat(session.reviews, 'cards reviewed'),
        stat(acc + '%', 'answered correctly'),
        stat(mins ? mins + ' min' : '—', 'logged today'),
        stat(S.streak(), 'day streak')
      ]),
      el('p', { class: 'study-hint', text: session.ahead
        ? 'Nothing was due in this deck — this was a free run, and the schedule has moved on anyway.'
        : 'Due cards are scheduled by how well you knew them: again → today, easy → up to 60 days.' }),
      el('div', { class: 'study-actions' }, [
        el('button', {
          class: 'btn btn-primary', type: 'button', text: 'Study again',
          onclick: function () {
            const d = session.deck, m = session.mode;
            session.logged = true; close();
            open({ deck: d, mode: m });
          }
        }),
        el('button', { class: 'btn', type: 'button', text: 'Done', onclick: close })
      ])
    ]));
    focusFirst();
  }

  function stat(value, label) {
    return el('div', { class: 'summary-stat' }, [
      el('b', { class: 'tnum', text: String(value) }),
      el('span', { text: label })
    ]);
  }

  /* ------------------------------------------------------------- keyboard */
  function focusFirst() {
    const b = root.querySelector('.study-body button, .study-body input');
    if (b) b.focus();
  }

  function onKey(e) {
    if (!root) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }

    // Keep tabbing inside the dialog.
    if (e.key === 'Tab') {
      const f = Array.prototype.slice.call(root.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'))
        .filter(function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }

    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const s = session;
    if (!s || s.i >= s.cards.length) return;

    if (e.key === ' ' || e.key === 'Enter') {
      const primary = root.querySelector('.btn-primary');
      if (primary) { e.preventDefault(); primary.click(); }
      return;
    }
    if (s.mode === 'flip' && s.revealed && ['1', '2', '3'].indexOf(e.key) !== -1) {
      e.preventDefault();
      commit(['again', 'good', 'easy'][Number(e.key) - 1]);
    }
  }

  return { open: open, close: close };
})();

/* ==========================================================================
   Store — one state object, one localStorage key, one save path.
   Holds: finished resources/milestones, flashcard scheduling, daily sessions,
   theme and routine choice. Also the Leitner scheduler.
   ========================================================================== */

window.STORE = (function () {
  'use strict';

  const KEY = 'fal.state.v2';
  const LEGACY = { done: 'fal.progress.v1', theme: 'fal.theme.v1', budget: 'fal.budget.v1' };

  // Leitner intervals in days, indexed by box.
  const INTERVALS = [0, 1, 3, 7, 21, 60];
  const MAX_BOX = INTERVALS.length - 1;

  let state = null;
  let writeTimer = null;
  const listeners = [];

  /* ------------------------------------------------------------ date help */
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function dayOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { return dayOf(new Date()); }
  function addDays(dayStr, n) {
    const p = dayStr.split('-');
    const d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() + n);
    return dayOf(d);
  }
  function daysBetween(a, b) {
    const pa = a.split('-'), pb = b.split('-');
    const da = new Date(Number(pa[0]), Number(pa[1]) - 1, Number(pa[2]));
    const db = new Date(Number(pb[0]), Number(pb[1]) - 1, Number(pb[2]));
    return Math.round((db - da) / 86400000);
  }

  /* --------------------------------------------------------------- schema */
  function blank() {
    return {
      v: 2,
      done: [],       // resource + milestone ids
      cards: {},      // id -> {b:box, d:dueDay, s:seen, l:lapses}
      sessions: {},   // 'YYYY-MM-DD' -> {r:reviews, c:correct, m:minutes}
      goal: { minutes: 60 },
      theme: null,    // null = follow the OS
      budget: '60'
    };
  }

  function readJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function migrate() {
    // Legacy keys are read once and left in place as a fallback.
    const s = blank();
    const oldDone = readJSON(LEGACY.done);
    if (Array.isArray(oldDone)) s.done = oldDone.slice();
    try {
      const t = localStorage.getItem(LEGACY.theme);
      if (t === 'dark' || t === 'light') s.theme = t === 'dark' ? 'night' : 'parchment';
      const b = localStorage.getItem(LEGACY.budget);
      if (b) { s.budget = b; s.goal.minutes = Number(b) || 60; }
    } catch (e) { /* storage unavailable */ }
    return s;
  }

  function load() {
    const saved = readJSON(KEY);
    if (saved && saved.v === 2) {
      state = Object.assign(blank(), saved);
      state.goal = Object.assign({ minutes: 60 }, saved.goal || {});
      state.cards = saved.cards || {};
      state.sessions = saved.sessions || {};
      state.done = Array.isArray(saved.done) ? saved.done : [];
    } else {
      state = migrate();
      write();
    }
    return state;
  }

  function write() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { /* private mode — the session still works, it just won't persist */ }
  }

  function save() {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(write, 250);
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }

  // A debounced write loses the last change if the tab closes inside the
  // window — flush on the way out. pagehide fires on mobile Safari where
  // unload does not.
  function flush() {
    if (writeTimer === null) return;
    clearTimeout(writeTimer);
    writeTimer = null;
    write();
  }
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') flush();
    });
  }

  /* ------------------------------------------------------------- progress */
  function isDone(id) { return state.done.indexOf(id) !== -1; }
  function setDone(id, on) {
    const i = state.done.indexOf(id);
    if (on && i === -1) state.done.push(id);
    else if (!on && i !== -1) state.done.splice(i, 1);
    else return;
    save();
  }

  /* ------------------------------------------------------------ scheduler */
  function cardState(id) {
    return state.cards[id] || null;
  }
  function isDue(id) {
    const c = state.cards[id];
    if (!c) return false;                       // unseen is "new", not "due"
    return daysBetween(c.d, today()) >= 0;
  }
  function isNew(id) { return !state.cards[id]; }

  // grade: 'again' | 'good' | 'easy'
  function grade(id, g) {
    const prev = state.cards[id];
    const box = prev ? prev.b : 0;
    let next;
    if (g === 'again') next = 0;
    else if (g === 'easy') next = Math.min(box + 2, MAX_BOX);
    else next = Math.min(box + 1, MAX_BOX);

    state.cards[id] = {
      b: next,
      d: addDays(today(), INTERVALS[next]),
      s: (prev ? prev.s : 0) + 1,
      l: (prev ? prev.l : 0) + (g === 'again' ? 1 : 0)
    };
    save();
    return state.cards[id];
  }

  // Split a list of card ids into what a session should ask, due first.
  function queue(ids, limit) {
    const due = [], fresh = [];
    ids.forEach(function (id) {
      if (isNew(id)) fresh.push(id);
      else if (isDue(id)) due.push(id);
    });
    // Oldest due first so nothing starves.
    due.sort(function (a, b) { return state.cards[a].d < state.cards[b].d ? -1 : 1; });
    shuffle(fresh);
    return due.concat(fresh).slice(0, limit || 20);
  }

  function counts(ids) {
    let due = 0, fresh = 0, learned = 0, boxSum = 0, seen = 0;
    ids.forEach(function (id) {
      const c = state.cards[id];
      if (!c) { fresh++; return; }
      seen++;
      boxSum += c.b;
      if (isDue(id)) due++;
      if (c.b >= 3) learned++;
    });
    return {
      total: ids.length, due: due, fresh: fresh, seen: seen, learned: learned,
      mastery: ids.length ? boxSum / (ids.length * MAX_BOX) : 0
    };
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* -------------------------------------------------------------- habit */
  function logSession(s) {
    const d = today();
    const rec = state.sessions[d] || { r: 0, c: 0, m: 0 };
    rec.r += s.reviews || 0;
    rec.c += s.correct || 0;
    rec.m += s.minutes || 0;
    state.sessions[d] = rec;
    save();
    return rec;
  }
  function sessionFor(day) { return state.sessions[day] || null; }
  function activeDay(day) {
    const r = state.sessions[day];
    return !!(r && (r.r > 0 || r.m > 0));
  }
  function streak() {
    // Counts back from today; a day not yet studied doesn't break yesterday's run.
    let cursor = today();
    if (!activeDay(cursor)) {
      cursor = addDays(cursor, -1);
      if (!activeDay(cursor)) return 0;
    }
    let n = 0;
    while (activeDay(cursor)) { n++; cursor = addDays(cursor, -1); }
    return n;
  }
  function bestStreak() {
    const days = Object.keys(state.sessions).filter(activeDay).sort();
    let best = 0, run = 0, prev = null;
    days.forEach(function (d) {
      run = (prev && daysBetween(prev, d) === 1) ? run + 1 : 1;
      if (run > best) best = run;
      prev = d;
    });
    return best;
  }
  function minutesToday() {
    const r = state.sessions[today()];
    return r ? r.m : 0;
  }
  function reviewsToday() {
    const r = state.sessions[today()];
    return r ? r.r : 0;
  }

  /* ----------------------------------------------------- theme / routine */
  function theme() { return state.theme; }
  function setTheme(name) { state.theme = name; save(); }
  function budget() { return state.budget; }
  function setBudget(b) {
    state.budget = b;
    state.goal.minutes = Number(b) || 60;
    save();
  }
  function goalMinutes() { return state.goal.minutes || Number(state.budget) || 60; }

  /* ------------------------------------------------------ export / import */
  function exportState() {
    return {
      app: 'the-free-arabic-library',
      version: 2,
      exported: new Date().toISOString(),
      state: state,
      done: state.done   // keeps v1 importers working
    };
  }
  function importState(data, validIds) {
    if (!data) throw new Error('empty');
    let incoming = null;
    if (data.state && data.state.v === 2) incoming = data.state;
    else if (Array.isArray(data.done)) incoming = Object.assign(blank(), { done: data.done });
    if (!incoming) throw new Error('unrecognised');

    const next = Object.assign(blank(), incoming);
    if (validIds) {
      next.done = (next.done || []).filter(function (id) { return validIds.indexOf(id) !== -1; });
    }
    state = next;
    write();
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
    return state;
  }
  function reset() {
    state = blank();
    write();
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }

  function onChange(fn) { listeners.push(fn); }

  load();

  return {
    get: function () { return state; },
    today: today, addDays: addDays, daysBetween: daysBetween, dayOf: dayOf,
    isDone: isDone, setDone: setDone,
    cardState: cardState, isDue: isDue, isNew: isNew, grade: grade,
    queue: queue, counts: counts, shuffle: shuffle,
    logSession: logSession, sessionFor: sessionFor, activeDay: activeDay,
    streak: streak, bestStreak: bestStreak, minutesToday: minutesToday, reviewsToday: reviewsToday,
    theme: theme, setTheme: setTheme, budget: budget, setBudget: setBudget, goalMinutes: goalMinutes,
    exportState: exportState, importState: importState, reset: reset,
    onChange: onChange, flush: flush,
    MAX_BOX: MAX_BOX, INTERVALS: INTERVALS
  };
})();

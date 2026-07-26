/* ==========================================================================
   Habit — streak, daily minute goal, and a 12-week activity heatmap.
   Reads sessions from the store; renders the calendar as inline SVG so it
   inherits the theme tokens and needs no images.
   ========================================================================== */

window.HABIT = (function () {
  'use strict';

  const S = window.STORE;
  const WEEKS = 12;
  const CELL = 13;
  const GAP = 3;

  function stats() {
    const goal = S.goalMinutes();
    const mins = S.minutesToday();
    return {
      streak: S.streak(),
      best: S.bestStreak(),
      minutes: mins,
      goal: goal,
      pct: goal ? Math.min(1, mins / goal) : 0,
      reviews: S.reviewsToday(),
      metGoal: mins >= goal
    };
  }

  /* --------------------------------------------------------------- heatmap */
  // Returns 12 weeks of days ending today, oldest first, aligned to weeks
  // starting Monday so the rows read like a calendar.
  function days() {
    const out = [];
    const today = new Date();
    const backTo = new Date(today);
    backTo.setDate(backTo.getDate() - (WEEKS * 7 - 1));
    // Shift start to the Monday of that week.
    const dow = (backTo.getDay() + 6) % 7;
    backTo.setDate(backTo.getDate() - dow);

    const cursor = new Date(backTo);
    while (cursor <= today) {
      const key = S.dayOf(cursor);
      const rec = S.sessionFor(key);
      out.push({ key: key, date: new Date(cursor), minutes: rec ? rec.m : 0, reviews: rec ? rec.r : 0 });
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }

  function level(d) {
    const goal = S.goalMinutes() || 60;
    if (!d.minutes && !d.reviews) return 0;
    const share = d.minutes / goal;
    if (share >= 1) return 4;
    if (share >= 0.6) return 3;
    if (share >= 0.25) return 2;
    return 1;
  }

  function svgEl(name, attrs) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  function heatmap() {
    const list = days();
    const cols = Math.ceil(list.length / 7);
    const w = cols * (CELL + GAP);
    const h = 7 * (CELL + GAP);

    const svg = svgEl('svg', {
      class: 'heatmap', viewBox: '0 0 ' + w + ' ' + h, width: w, height: h,
      role: 'img',
      'aria-label': 'Activity for the last ' + WEEKS + ' weeks: ' +
        list.filter(function (d) { return d.minutes || d.reviews; }).length + ' active days'
    });

    list.forEach(function (d, i) {
      const col = Math.floor(i / 7);
      const row = i % 7;
      const cell = svgEl('rect', {
        x: col * (CELL + GAP), y: row * (CELL + GAP),
        width: CELL, height: CELL, rx: 2,
        class: 'hm hm-' + level(d)
      });
      const label = d.key + (d.minutes || d.reviews
        ? ' — ' + d.minutes + ' min, ' + d.reviews + ' cards'
        : ' — nothing logged');
      cell.appendChild(svgEl('title', {})).textContent = label;
      svg.appendChild(cell);
    });

    return svg;
  }

  function legend() {
    const wrap = document.createElement('div');
    wrap.className = 'hm-legend';
    wrap.appendChild(document.createTextNode('Less'));
    for (let i = 0; i <= 4; i++) {
      const s = document.createElement('span');
      s.className = 'hm hm-' + i;
      wrap.appendChild(s);
    }
    wrap.appendChild(document.createTextNode('More'));
    return wrap;
  }

  /* ------------------------------------------------------ manual time log */
  function logMinutes(n) {
    S.logSession({ minutes: n, reviews: 0, correct: 0 });
    if (window.APP && window.APP.refresh) window.APP.refresh();
  }

  return { stats: stats, heatmap: heatmap, legend: legend, logMinutes: logMinutes, WEEKS: WEEKS };
})();

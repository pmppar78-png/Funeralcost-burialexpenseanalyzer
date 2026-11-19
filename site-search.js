/* Site search: forgiving type-ahead over /search-index.json.
   No third-party code. Prefix, synonym, state-abbr, and 1-typo match
   from the first character. ARIA combobox. Suggestions on focus. */
(function () {
  var input = document.getElementById('site-search-input');
  var list = document.getElementById('site-search-list');
  var form = input && input.form;
  if (!input || !list || !form) return;

  var index = null, loading = null, items = [], active = -1;

  var SYN = {
    cost: 'price costs prices fee fees',
    costs: 'cost price prices fee fees',
    price: 'cost costs prices fee fees',
    prices: 'cost costs price fee fees',
    fee: 'cost price costs prices fees',
    fees: 'cost price costs prices fee',
    funeral: 'burial service memorial',
    funerals: 'funeral burial service memorial',
    burial: 'funeral interment graveside grave',
    cremation: 'cremate cremated ashes',
    cremate: 'cremation cremated ashes',
    plot: 'grave cemetery gravesite',
    cemetery: 'grave plot burial',
    veteran: 'va veterans military',
    veterans: 'va veteran military',
    va: 'veteran veterans military',
    medicaid: 'assistance aid payment help',
    insurance: 'preneed pre-need policy',
    will: 'wills estate trust',
    checklist: 'planning list worksheet',
    calculator: 'estimator estimate tool widget',
    estimator: 'calculator estimate tool',
    ai: 'guide chat assistant',
    guide: 'ai chat'
  };
  var STATES = {
    al:'alabama', ak:'alaska', az:'arizona', ar:'arkansas', ca:'california',
    co:'colorado', ct:'connecticut', de:'delaware', dc:'washington dc',
    fl:'florida', ga:'georgia', hi:'hawaii', id:'idaho', il:'illinois',
    in:'indiana', ia:'iowa', ks:'kansas', ky:'kentucky', la:'louisiana',
    me:'maine', md:'maryland', ma:'massachusetts', mi:'michigan',
    mn:'minnesota', ms:'mississippi', mo:'missouri', mt:'montana',
    ne:'nebraska', nv:'nevada', nh:'new hampshire', nj:'new jersey',
    nm:'new mexico', ny:'new york', nc:'north carolina', nd:'north dakota',
    oh:'ohio', ok:'oklahoma', or:'oregon', pa:'pennsylvania',
    ri:'rhode island', sc:'south carolina', sd:'south dakota',
    tn:'tennessee', tx:'texas', ut:'utah', vt:'vermont', va:'virginia',
    wa:'washington', wv:'west virginia', wi:'wisconsin', wy:'wyoming'
  };
  /* reverse full name -> abbr so "texas" also boosts tx pages */
  var NAME_TO_ABBR = {};
  Object.keys(STATES).forEach(function (ab) { NAME_TO_ABBR[STATES[ab]] = ab; });
  var STOP = { the:1, of:1, and:1, a:1, an:1, for:1, to:1, on:1, at:1, by:1, or:1, vs:1, in:1, with:1, from:1 };

  var STARTER = [
    { t: 'Free AI guide to funeral costs', u: '/chat.html' },
    { t: 'Funeral cost calculator (home)', u: '/' },
    { t: 'Funeral costs by state', u: '/funeral-costs-by-state.html' },
    { t: 'Cremation costs by state', u: '/cremation-costs-by-state.html' },
    { t: 'Burial costs by state', u: '/burial-costs-by-state.html' },
    { t: '2026 National Funeral Cost Index', u: '/national-funeral-cost-index.html' }
  ];

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9$]+/g, ' ').trim();
  }
  function dist1(a, b) {
    if (a === b) return 0;
    var la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return 2;
    if (la > lb) { var t = a; a = b; b = t; la = a.length; lb = b.length; }
    var i = 0, j = 0, used = 0;
    while (i < la && j < lb) {
      if (a.charAt(i) === b.charAt(j)) { i++; j++; continue; }
      if (used) return 2;
      used = 1;
      if (la === lb) { i++; j++; }
      else j++;
    }
    return (used || lb - la) ? 1 : 0;
  }
  function hasWord(hay, w) {
    return (' ' + hay + ' ').indexOf(' ' + w + ' ') !== -1;
  }
  function tokenHit(hay, w) {
    if (!w) return { ok: true, typo: 0, at: 0 };
    var toks = hay.split(' '), i, at, tok;
    for (i = 0; i < toks.length; i++) {
      tok = toks[i];
      if (tok === w) return { ok: true, typo: 0, at: 0, exact: 1 };
      if (tok.indexOf(w) === 0) return { ok: true, typo: 0, at: (i === 0 ? 0 : 2), prefix: 1 };
      if (w.length >= 3 && tok.indexOf(w) !== -1) return { ok: true, typo: 0, at: 3 };
    }
    if (STATES[w] && hasWord(hay, STATES[w])) return { ok: true, typo: 0, at: 0 };
    if (NAME_TO_ABBR[w] && hasWord(hay, NAME_TO_ABBR[w])) return { ok: true, typo: 0, at: 0 };
    var alts = SYN[w];
    if (alts) {
      var parts = alts.split(' ');
      for (i = 0; i < parts.length; i++) {
        for (var j = 0; j < toks.length; j++) {
          if (toks[j] === parts[i] || (parts[i].length >= 3 && toks[j].indexOf(parts[i]) === 0)) {
            return { ok: true, typo: 0, at: 2, syn: 1 };
          }
        }
      }
    }
    if (w.length >= 4) {
      for (i = 0; i < toks.length; i++) {
        if (dist1(w, toks[i]) === 1) return { ok: true, typo: 1, at: 4 };
      }
    }
    return { ok: false };
  }
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('/search-index.json', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (d) {
          index = d.map(function (p) {
            return { t: p.t, u: p.u, n: norm(p.t + ' ' + (p.k || '')) };
          });
          return index;
        })
        .catch(function () { index = []; return index; });
    }
    return loading;
  }
  function score(p, words, q) {
    var s = 0;
    for (var i = 0; i < words.length; i++) {
      var h = tokenHit(p.n, words[i]);
      if (!h.ok) return -1;
      s += h.at === 0 ? 3 : (p.n.indexOf(' ' + words[i]) !== -1 ? 2 : 1);
      if (h.typo) s -= 0.6;
      if (h.syn) s -= 0.15;
    }
    if (q && p.n.indexOf(q) === 0) s += 4;
    else if (q && p.n.indexOf(q) !== -1) s += 2;
    return s - p.t.length / 200;
  }
  function close() {
    list.hidden = true; list.innerHTML = ''; items = []; active = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }
  function setActive(i) {
    if (!items.length) return;
    if (active > -1 && items[active]) items[active].setAttribute('aria-selected', 'false');
    active = (i + items.length) % items.length;
    items[active].setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', items[active].id);
    items[active].scrollIntoView({ block: 'nearest' });
  }
  function addOption(title, url, i, extraClass) {
    var li = document.createElement('li');
    li.id = 'site-search-opt-' + i;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', 'false');
    li.className = 'site-search-option' + (extraClass ? ' ' + extraClass : '');
    li.textContent = title;
    li.dataset.url = url;
    li.addEventListener('mousedown', function (e) { e.preventDefault(); go(url); });
    list.appendChild(li);
    items.push(li);
  }
  function pinAi(hits, q) {
    var want = /(^| )(ai|guide|chat|ask)( |$)/.test(q) || !q;
    if (!want) return hits;
    hits = hits.filter(function (h) { return (h.p.u || '').indexOf('chat.html') === -1; });
    hits.unshift({ p: { t: 'Free AI guide to funeral costs', u: '/chat.html' }, s: 100 });
    return hits.slice(0, 8);
  }
  function render(q, fromFocus) {
    var nq = norm(q);
    if (!nq) {
      list.innerHTML = '';
      items = [];
      active = -1;
      STARTER.forEach(function (s, i) { addOption(s.t, s.u, i); });
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      return;
    }
    var words = nq.split(' ').filter(function (w) { return w && !STOP[w]; });
    if (!words.length) words = nq.split(' ').filter(Boolean);
    var hits = (index || []).map(function (p) { return { p: p, s: score(p, words, nq) }; })
      .filter(function (h) { return h.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8);
    hits = pinAi(hits, nq);
    list.innerHTML = '';
    items = [];
    active = -1;
    if (!hits.length) {
      var li = document.createElement('li');
      li.className = 'site-search-empty';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-disabled', 'true');
      li.id = 'site-search-opt-none';
      li.textContent = 'No matching pages. Press Enter for the full site index.';
      list.appendChild(li);
    } else {
      hits.forEach(function (h, i) {
        var extra = (h.p.u || '').indexOf('chat.html') !== -1 ? 'site-search-option--ai' : '';
        addOption(h.p.t, h.p.u, i, extra);
      });
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }
  function go(u) {
    if (window.gtag) { try { window.gtag('event', 'site_search', { search_term: input.value.slice(0, 80), link_url: u }); } catch (e) {} }
    window.location.href = u;
  }

  input.addEventListener('focus', function () {
    load().then(function () { if (document.activeElement === input) render(input.value, true); });
  });
  input.addEventListener('input', function () {
    var q = input.value;
    load().then(function () { if (input.value === q) render(q); });
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { if (list.hidden) render(input.value); e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { if (!items.length) return; e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      var pick = items[active > -1 ? active : 0];
      if (pick && pick.dataset.url) { e.preventDefault(); go(pick.dataset.url); }
    }
    else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } else { input.value = ''; } }
  });
  input.addEventListener('blur', function () { setTimeout(close, 150); });
  form.addEventListener('submit', function (e) {
    var pick = items[active > -1 ? active : 0];
    if (pick && pick.dataset.url) { e.preventDefault(); go(pick.dataset.url); }
  });
})();

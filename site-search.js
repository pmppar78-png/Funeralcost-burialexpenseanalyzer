/* Site search: static type-ahead over /search-index.json (page titles + URLs).
   No third-party code, no network beyond this site, loaded with defer. */
(function () {
  var input = document.getElementById('site-search-input');
  var list = document.getElementById('site-search-list');
  var form = input && input.form;
  if (!input || !list || !form) return;

  var index = null, loading = null, items = [], active = -1;

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9$]+/g, ' ').trim();
  }
  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch('/search-index.json', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (d) {
          index = d.map(function (p) { return { t: p.t, u: p.u, n: norm(p.t + ' ' + (p.k || '')) }; });
          return index;
        })
        .catch(function () { index = []; return index; });
    }
    return loading;
  }
  function score(p, words, q) {
    var s = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i], at = p.n.indexOf(w);
      if (at === -1) return -1;
      s += at === 0 ? 3 : (p.n.indexOf(' ' + w) !== -1 ? 2 : 1);
    }
    if (p.n.indexOf(q) === 0) s += 4;
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
  function render(q) {
    var nq = norm(q);
    if (nq.length < 2) { close(); return; }
    var words = nq.split(' ');
    var hits = index.map(function (p) { return { p: p, s: score(p, words, nq) }; })
      .filter(function (h) { return h.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8);
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
        var li = document.createElement('li');
        li.id = 'site-search-opt-' + i;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.className = 'site-search-option';
        li.textContent = h.p.t;
        li.dataset.url = h.p.u;
        li.addEventListener('mousedown', function (e) { e.preventDefault(); go(h.p.u); });
        list.appendChild(li);
        items.push(li);
      });
    }
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }
  function go(u) {
    if (window.gtag) { try { window.gtag('event', 'site_search', { search_term: input.value.slice(0, 80), link_url: u }); } catch (e) {} }
    window.location.href = u;
  }

  input.addEventListener('focus', load, { once: true });
  input.addEventListener('input', function () {
    var q = input.value;
    load().then(function () { if (input.value === q) render(q); });
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { if (list.hidden) render(input.value); e.preventDefault(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } else { input.value = ''; } }
  });
  input.addEventListener('blur', function () { setTimeout(close, 150); });
  form.addEventListener('submit', function (e) {
    var pick = items[active > -1 ? active : 0];
    if (pick) { e.preventDefault(); go(pick.dataset.url); }
  });
})();

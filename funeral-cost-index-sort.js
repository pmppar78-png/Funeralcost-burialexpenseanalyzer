/**
 * Progressive enhancement for #state-index-table on the National Funeral Cost Index.
 * The HTML table is complete without this file. This script adds a "Sort by"
 * control and column-header buttons, and reorders the existing rows.
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function cellText(td) {
    return (td.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function cellValue(td, type) {
    var raw = cellText(td);
    if (type === 'name') return raw.toLowerCase();
    var num = raw.replace(/[^0-9.-]/g, '');
    var n = parseFloat(num);
    return isNaN(n) ? raw.toLowerCase() : n;
  }

  function columnType(index, header) {
    var h = (header || '').toLowerCase();
    if (index === 1 || h === 'state') return 'name';
    return 'number';
  }

  ready(function () {
    var table = document.getElementById('state-index-table');
    if (!table || !table.tHead || !table.tBodies.length) return;
    if (window.matchMedia && window.matchMedia('print').matches) return;

    var thead = table.tHead;
    var body = table.tBodies[0];
    var ths = thead.querySelectorAll('th');
    var colCount = ths.length;
    var types = [];
    var headers = [];
    var i;
    for (i = 0; i < colCount; i++) {
      headers[i] = cellText(ths[i]);
      types[i] = columnType(i, headers[i]);
    }

    var original = Array.prototype.slice.call(body.rows);

    var wrap = table.closest('.table-scroll') || table.parentNode;
    var controls = document.createElement('p');
    controls.className = 'index-sort-controls';
    var label = document.createElement('label');
    label.setAttribute('for', 'state-index-sort');
    label.appendChild(document.createTextNode('Sort table by '));
    var select = document.createElement('select');
    select.id = 'state-index-sort';
    function addOption(value, text) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      select.appendChild(opt);
    }
    addOption('0-asc', headers[0] + ' (1–50, default)');
    for (i = 0; i < colCount; i++) {
      if (i === 0) {
        addOption('0-desc', headers[0] + ' (50–1)');
        continue;
      }
      var suffix = types[i] === 'name' ? ['A–Z', 'Z–A'] : ['low to high', 'high to low'];
      addOption(i + '-asc', headers[i] + ' (' + suffix[0] + ')');
      addOption(i + '-desc', headers[i] + ' (' + suffix[1] + ')');
    }
    label.appendChild(document.createElement('br'));
    label.appendChild(select);
    select.style.maxWidth = '100%';
    controls.style.maxWidth = '100%';
    controls.appendChild(label);
    var live = document.createElement('span');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    live.id = 'state-index-sort-status';
    controls.appendChild(document.createTextNode(' '));
    controls.appendChild(live);
    wrap.parentNode.insertBefore(controls, wrap);

    function sortBy(col, dir) {
      var rows = Array.prototype.slice.call(body.rows);
      rows.sort(function (a, b) {
        var av = cellValue(a.cells[col], types[col]);
        var bv = cellValue(b.cells[col], types[col]);
        var cmp;
        if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
        else cmp = String(av).localeCompare(String(bv), 'en');
        if (cmp === 0) {
          // stable-ish tie-breaker: original traditional-funeral rank
          var ar = cellValue(a.cells[0], 'number');
          var br = cellValue(b.cells[0], 'number');
          cmp = ar - br;
        }
        return dir === 'desc' ? -cmp : cmp;
      });
      var frag = document.createDocumentFragment();
      rows.forEach(function (row) { frag.appendChild(row); });
      body.appendChild(frag);
      for (i = 0; i < colCount; i++) {
        if (i === col) ths[i].setAttribute('aria-sort', dir === 'desc' ? 'descending' : 'ascending');
        else ths[i].removeAttribute('aria-sort');
      }
      var labelText = headers[col] + ', ' + (dir === 'desc' ? 'descending' : 'ascending');
      live.textContent = 'Sorted by ' + labelText + '.';
    }

    select.addEventListener('change', function () {
      var parts = select.value.split('-');
      var col = parseInt(parts[0], 10);
      var dir = parts[1] === 'desc' ? 'desc' : 'asc';
      if (col === 0 && dir === 'asc') {
        var frag = document.createDocumentFragment();
        original.forEach(function (row) { frag.appendChild(row); });
        body.appendChild(frag);
        for (i = 0; i < colCount; i++) ths[i].removeAttribute('aria-sort');
        ths[0].setAttribute('aria-sort', 'ascending');
        live.textContent = 'Sorted by ' + headers[0] + ', ascending (default).';
        return;
      }
      sortBy(col, dir);
    });

    for (i = 0; i < colCount; i++) {
      (function (col) {
        var th = ths[col];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = headers[col];
        th.textContent = '';
        th.appendChild(btn);
        btn.addEventListener('click', function () {
          var current = th.getAttribute('aria-sort');
          var dir = current === 'ascending' ? 'desc' : 'asc';
          select.value = col + '-' + dir;
          select.dispatchEvent(new Event('change'));
        });
      })(i);
    }

    ths[0].setAttribute('aria-sort', 'ascending');
  });
})();

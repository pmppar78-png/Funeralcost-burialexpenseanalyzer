'use strict';
/**
 * Replaces spaced em-dashes in visible page text (inside <main>) and in
 * FAQPage JSON-LD answers with ordinary punctuation, so the two stay in
 * sync. Labels such as "Direct Cremation — Most Affordable Option" become
 * "Direct Cremation: Most Affordable Option"; a paired aside
 * "these steps — in roughly this order — prevent" becomes commas; a dash
 * before a new clause becomes a semicolon. Bare "—" table cells and
 * sign-offs are left alone. A single dash becomes a colon before an
 * explanation, a list or a capital letter, a semicolon before a full
 * clause, and a comma only before a contrast or qualifier such as "not",
 * "especially" or "including". Idempotent.
 */
const fs = require('fs');
const path = require('path');

// Words after a dash that make a comma correct: a contrast, an example
// list or a trailing qualifier ("not", "especially", "including").
const COMMA = new Set(['not', 'especially', 'including', 'such', 'like', 'but', 'or', 'and', 'though', 'although', 'which', 'while', 'rather', 'plus', 'even', 'except', 'particularly', 'mainly', 'mostly', 'sometimes', 'often', 'usually', 'typically', 'whether', 'unless', 'so', 'yet', 'than', 'whereas', 'who', 'where', 'when', 'far', 'much', 'well', 'because', 'since', 'if']);
// Imperatives that open a new clause.
const IMPER = new Set(['call', 'ask', 'check', 'get', 'use', 'compare', 'request', 'contact', 'don\'t', 'never', 'always', 'do', 'read', 'see', 'try', 'look', 'keep', 'make', 'expect', 'plan', 'budget', 'confirm', 'bring', 'shop', 'start', 'choose']);
const VERB = /^(is|are|was|were|be|been|isn't|aren't|wasn't|can|can't|cannot|could|will|won't|would|may|might|must|should|has|have|had|hasn't|haven't|do|does|did|doesn't|don't|didn't|cost|costs|run|runs|vary|varies|need|needs|include|includes|require|requires|take|takes|add|adds|mean|means|make|makes|pay|pays|offer|offers|charge|charges|get|gets|go|goes|come|comes|allow|allows|keep|keeps|help|helps|say|says|tend|tends|sit|sits|start|starts|depend|depends|apply|applies|become|becomes|let|lets|cover|covers|matter|matters|change|changes|happen|happens|rise|rises|drop|drops|fall|falls|stay|stays|remain|remains|differ|differs|average|averages|range|ranges|land|lands|exist|exists|seem|seems|work|works|handle|handles|set|sets|give|gives|provide|provides|list|lists|show|shows|know|knows|want|wants|feel|feels|end|ends|save|saves|count|counts|lead|leads|carry|carries|ask|asks|accept|accepts|bill|bills|sell|sells|own|owns|serve|serves|walks|explains|describes|answers|exposes|suffices|shifts|matches)$/i;
const AUX = /^(is|are|was|were|isn't|aren't|wasn't|can|can't|cannot|could|will|won't|would|may|might|must|should|has|have|had|does|do|did|doesn't|don't)$/i;
const SUBJ = /^(i|it|this|that|these|those|they|you|we|there|he|she|its|our|your|their|his|her|the|a|an|most|many|some|each|every|no|none|both|all|one|nothing|everything|someone|families|prices|costs|fees|providers|cemeteries|homes|funeral|cremation|burial)$/i;

const PREP = new Set(['with', 'without', 'in', 'on', 'at', 'by', 'for', 'from', 'about', 'near', 'after', 'before', 'within', 'per', 'via', 'up', 'nothing', 'roughly', 'around', 'almost', 'nearly', 'well', 'only']);
const CONTR = /^(it's|they're|you're|there's|that's|we're|here's|he's|she's|what's)$/i;

function isClause(rest) {
  const w = rest.split(/\s+/).slice(0, 8).map(x => x.replace(/[^A-Za-z']/g, ''));
  if (!w[0]) return false;
  if (CONTR.test(w[0])) return true;
  if (IMPER.has(w[0].toLowerCase())) return true;
  let k = w.findIndex((x, i) => i > 0 && VERB.test(x));
  const rel = w.findIndex((x, i) => i > 0 && /^(that|which|who|whose|where)$/i.test(x) && !/^of$/i.test(w[i - 1]));
  if (rel > 0 && rel < k) k = -1;
  if (k < 0) return false;
  if (SUBJ.test(w[0])) return k <= 6;
  if (/^[A-Z]/.test(w[0])) return k <= 4;
  const a = w.findIndex((x, i) => i > 0 && AUX.test(x));
  return a > 0 && a <= (/ing$/.test(w[0]) ? 4 : 2);
}

// A short left side with no verb ("Direct burial") is a label.
function isLabelLeft(left) {
  const w = left.trim().split(/\s+/);
  return w.length <= 5 && !w.some(x => VERB.test(x.replace(/[^A-Za-z']/g, '')));
}

function pick(left, tail, word, isLabel) {
  const w = word.replace(/[^A-Za-z']/g, '').toLowerCase();
  if (/^(yes|no)$/i.test(left.trim())) return ', ';
  const lw = left.trim().split(/\s+/)[0] || '';
  if (!isLabel && IMPER.has(lw.toLowerCase()) && /^[a-z]/.test(word) && isClause(tail)) return '; ';
  if (isLabel || isLabelLeft(left)) return ': ';
  if (/^[$0-9]/.test(word)) return ', ';
  if (/^[A-Z]/.test(word)) return (!SUBJ.test(word) && isClause(tail)) ? '; ' : ': ';
  if (COMMA.has(w)) return (w === 'all' || w === 'most' || w === 'many' || w === 'some') && isClause(tail) ? '; ' : ', ';
  if (PREP.has(w)) return /(,\s+\w+(\s+\w+)?|\b(the|a|an|it|they|you|this|that|most|many|some)\s+(\w+\s+){0,2}?)\s*(is|are|can|will|may|must|has|have|do|does|should|vary|varies|run|runs|swing|swings)\b/i.test(tail) ? '; ' : ', ';
  if (/ing$/.test(w) && !isClause(tail)) return (w !== 'meaning' && /^(\S+\s+){1,8}?(can|could|will|would|is|are|takes|saves|may|must)\b/i.test(tail)) ? '; ' : ', ';
  if (w === 'all' && !isClause(tail)) return ', ';
  if (isClause(tail)) return '; ';
  return ': ';
}

function fixText(s, isLabel) {
  if (!s.includes('—')) return s;
  if (s.trim() === '—') return s;
  // Paired asides: parentheses when the aside is itself a list, commas otherwise.
  let t = s.replace(/ — ([^—.!?;:]{1,160}?) — (?=(\S+))/g, (m, x, nx) => (x.includes(',') ? ` (${x})${/^(so|and|but|or|yet)$/.test(nx) ? ',' : ''} ` : `, ${x}, `));
  if (/^\s*\n\s*— /.test(t)) return t;
  t = t.replace(/^ ?— /, ': ');
  let out = '', i = 0, m;
  const re = /(\S) — /g;
  while ((m = re.exec(t))) {
    const before = t.slice(0, m.index + 1);
    const after = t.slice(m.index + m[0].length);
    const left = before.split(/[.!?]\s/).pop();
    const tail = after.split(/(?<=[.!?])\s| — /)[0];
    const word = after.split(/\s+/)[0] || '';
    let pu = pick(left, tail, word, isLabel);
    // Never a second colon in one sentence: the later break becomes a comma.
    if (pu === ': ' && !isLabel && /: /.test(left)) pu = ', ';
    out += t.slice(i, m.index + 1) + pu;
    i = m.index + m[0].length;
  }
  t = out + t.slice(i);
  if (process.env.DASH_LOG && t !== s) fs.appendFileSync(process.env.DASH_LOG, JSON.stringify([s, t]) + '\n');
  return t;
}

function fixMain(main) {
  const parts = main.split(/(<[^>]+>)/);
  let skip = 0, prevTag = '', inSummary = 0;
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('<')) {
      if (/^<(script|style|code|pre|svg)\b/i.test(p)) skip++;
      else if (/^<\/(script|style|code|pre|svg)>/i.test(p)) skip = Math.max(0, skip - 1);
      if (/^<summary\b/i.test(p)) inSummary++;
      else if (/^<\/summary>/i.test(p)) inSummary = Math.max(0, inSummary - 1);
      if (!p.startsWith('</')) prevTag = p;
      continue;
    }
    if (skip || !p.includes('—') || /signoff/.test(prevTag)) continue;
    const plain = p.trim();
    const isLabel = !inSummary && plain.length <= 90 && !/[.!?]\s/.test(plain) && /^<(a|h[1-6]|strong|span|button|option|th|figcaption)\b/i.test(prevTag);
    parts[i] = fixText(p, isLabel);
  }
  return parts.join('');
}

function fixLd(html) {
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (m, a, body, c) => {
    if (!body.includes('"FAQPage"') || !body.includes('—')) return m;
    return a + body.replace(/"(text|name)"\s*:\s*"((?:[^"\\]|\\.)*)"/g, (mm, k, txt) => mm.replace(txt, fixText(txt.replace(/&mdash;/g, '—'), false))) + c;
  });
}

function run(OUT) {
  let n = 0;
  for (const f of fs.readdirSync(OUT)) {
    if (!f.endsWith('.html')) continue;
    const file = path.join(OUT, f);
    const html = fs.readFileSync(file, 'utf8');
    let out = html.replace(/<main\b[\s\S]*<\/main>/, m => fixMain(m.replace(/&mdash;/g, '—')));
    out = fixLd(out);
    if (out !== html) { fs.writeFileSync(file, out); n++; }
  }
  console.log(`  Dash cleanup: ${n} page(s)`);
}

module.exports = { run, fixText };

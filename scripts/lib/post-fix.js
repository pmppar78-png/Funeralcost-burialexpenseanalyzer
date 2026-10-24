'use strict';
/**
 * Final consistency pass, run by generate-pages.js right after applyAudit().
 * Idempotent. It:
 *  1. puts "an" before vowel-initial place names ("an Alabama family");
 *  2. repairs the hidden-fees embalming bullet that lost its subject when
 *     PR #94 removed fragment sentences;
 *  3. makes the "Direct burial is the next step up" FAQ figure match the
 *     page's own cost table;
 *  4. corrects the cremation-savings sentence, which subtracted only the
 *     funeral price but said "plus cemetery costs";
 *  5. rebuilds every FAQPage JSON-LD answer from the visible FAQ text, so the
 *     structured data and the page say exactly the same thing.
 */
const fs = require('fs');
const path = require('path');

const VOWEL_PLACES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Ohio', 'Oklahoma', 'Oregon', 'Utah', 'Indianapolis', 'Omaha', 'Orlando', 'Atlanta', 'Austin', 'Albuquerque', 'Anchorage', 'Oakland', 'El Paso', 'Arlington'];
const ART_RE = new RegExp(`(^|[\\s>(\\u201c"])(a|A) (${VOWEL_PLACES.join('|')})\\b`, 'g');

function h(s) { let x = 2166136261; for (const c of s) { x ^= c.codePointAt(0); x = Math.imul(x, 16777619); } return x >>> 0; }
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const num = (s) => Number(String(s).replace(/[$,]/g, ''));

function decode(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '\u2014').replace(/&ndash;/g, '\u2013').replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018')
    .replace(/&ldquo;/g, '\u201c').replace(/&rdquo;/g, '\u201d').replace(/&middot;/g, '\u00b7').replace(/&rsaquo;/g, '\u203a').replace(/&hellip;/g, '\u2026')
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&#x([0-9a-f]+);/gi, (m, d) => String.fromCodePoint(parseInt(d, 16)))
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}
function text(html) {
  // Block tags become spaces; inline tags (a, strong, em, span...) vanish, so
  // "our <a>guide</a>." reads "our guide." exactly as a browser shows it.
  return decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<\/?(?:p|div|li|ul|ol|br|h[1-6]|tr|td|th|table|section|details|summary)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function fixArticles(html) {
  // Only touch text outside tags.
  return html.replace(/(>)([^<]+)(?=<)/g, (m, gt, t) => gt + t.replace(ART_RE, (x, pre, a, place) => `${pre}${a === 'A' ? 'An' : 'an'} ${place}`)
    // "an $8,300", "an $11,070": the article follows how the figure is read aloud.
    .replace(/(^|[\s(])(a|A) (\$(?:8[\d,]*|1[18](?:,\d{3})*)(?![\d,]))/g, (x, pre, a, amt) => `${pre}${a === 'A' ? 'An' : 'an'} ${amt}`));
}

function fixEmbalmingBullet(html, file) {
  return html.replace(/<li data-state-fact="1">In ([^<,]+), it is almost never legally required\.<\/li>/, (m, n) => {
    const v = [
      `A funeral home may tell you embalming is mandatory, but ${n} law almost never requires it; ask which rule they mean.`,
      `Embalming is almost never a legal requirement in ${n}, even when a funeral home lists it as one.`,
      `Be wary of an embalming charge presented as required: in ${n} it almost never is.`,
    ][h(file) % 3];
    return `<li data-state-fact="1">${v}</li>`;
  });
}

// prototype; will be pasted into post-fix
// Sentence splitter that never splits inside parentheses or after an
// abbreviation (legal cites like "(Minn. Stat. § 149A.95)" or "15 Miss. Admin.").
const ABBR_TAIL = /(?:\b(?:[A-Z][a-z]{0,5}|e\.g|i\.e|vs|v|r|avg|alt|approx|etc|subd|ch|pt|no|sec|art)\.|\b[A-Z]\.(?:[A-Z]\.)*|§\s*[\d.]*)$/;
function smartSplit(inner, re) {
  const raw = inner.split(re);
  const out = [];
  const depth = x => (x.match(/\(/g) || []).length - (x.match(/\)/g) || []).length;
  for (const r of raw) {
    const prev = out.length ? out[out.length - 1] : null;
    const plain = prev ? prev.replace(/<[^>]+>/g, '') : '';
    if (prev !== null && (depth(plain) > 0 || ABBR_TAIL.test(plain.trim()))) out[out.length - 1] += ' ' + r;
    else out.push(r);
  }
  return out;
}

const CUE = /other regions|other states|markets like|similar pattern|similar pricing|similar cost|similar supports|compar|stacks up|perspective|quite different|weigh|for context|contrast|elsewhere|neighboring|nearby|much like|just as|across state lines|another market|state-by-state|frame how/i;
function defill(html, file) {
  const own = file.replace(/^\w+-costs-|\.html$/g, '');
  const LINK = /<a href="(?:funeral|burial|cremation)-costs-([a-z-]+)\.html"[^>]*>[\s\S]*?<\/a>/g;
  const log = [];
  const out = html.replace(/(<(p|li)\b[^>]*>)([\s\S]*?)(<\/\2>)/g, (all, o, tag, inner, c) => {
    if (/resource-desc|class="resource/.test(all)) return all;
    const sents = smartSplit(inner, /(?<=[.!?])\s+(?=[A-Z<])/);
    let changed = false;
    const kept = [];
    for (let s of sents) {
      const others = [...s.matchAll(LINK)].filter(m => m[1] !== own && m[1] !== 'by-state');
      const plain = s.replace(/<[^>]+>/g, '');
      if (!others.length || !CUE.test(plain)) { kept.push(s); continue; }
      const li = s.indexOf(others[0][0]);
      const before = s.slice(0, li);
      // last clause boundary before the link
      const P1 = /(,\s+(?:and|as well as|similar to|much like|just as|especially if|while|with|a|families|or other)\b|\.,\s+as well as\b|\s+or in neighboring\b)/g;
      const P2 = /(;\s+|\s+—\s+)/g;
      let m, cut = -1;
      while ((m = P1.exec(before))) cut = m.index;
      while ((m = P2.exec(before))) if (m.index > cut) cut = m.index;
      const head = cut > 0 ? s.slice(0, cut).replace(/\.$/, '') : '';
      const hp = head.replace(/<[^>]+>/g, '');
      if (head && hp.split(/\s+/).length >= 8 && !/other states|other regions|across state lines|another market/i.test(hp)) {
        kept.push(head + '.'); log.push(['TRIM', plain.slice(0, 200), '=>', hp + '.']);
      } else { log.push(['DROP', plain.slice(0, 200)]); }
      changed = true;
    }
    if (!changed) return all;
    const ni = kept.join(' ').trim();
    return ni ? o + ni + c : '';
  });
  return { out, log };
}

// "<State> regulator is the XX Dept. of ...": stamped repeatedly by an older
// pass and missing "The"; the rules-and-help section already names the
// licensing board properly, so every copy is removed.
const REG_RE = /\s*\b[A-Z][a-z]+(?: [A-Z][a-z]+)? regulator is the (?:Dept\.|[^.<"])*\.(?=\s|<|"|$)/g;
const ABBR_END = /(?:\b(?:e\.g|i\.e|vs|v|r|avg|alt|Comp|Regs|approx|etc|Dept|St|No|Ga|Tex|Ala|Fla|Cal|Ind|Code|Stat|Ann|U\.S)\.|\.\w+\.)$/;
function fixSentences(html) {
  html = html.replace(/:\.(?=\s*<)/g, ':')
    // Pipe-joined link lists whose first link was stripped upstream.
    .replace(/>\s*[Cc]asket buying guide \| <a href="best-online-casket-retailers\.html">Best online casket retailers<\/a>\.?/g, '>Compare prices with the <a href="casket-buying-guide.html">casket buying guide</a> and the list of <a href="best-online-casket-retailers.html">online casket retailers</a>.')
    .replace(/([.>]\s*)[Ss]ee the full 2026 national funeral cost report \| <a href="funeral-costs-rising-2026\.html">Why funeral costs are rising<\/a>\./g, '$1The <a href="national-funeral-cost-index.html">national funeral cost index</a> and <a href="funeral-costs-rising-2026.html">why funeral costs are rising</a> give the wider picture.')
    .replace(/\b(A|a)n (Utah|United|Unions?\b|Units?\b|Uniform\w*|Unique\w*|Universit\w*|U\.S\.|US\b|Usual\w*|usual\w*|uniform\w*|unique\w*|union\w*|universit\w*)/g, (x, a, w) => `${a} ${w}`)
    .replace(/\b([A-Z][a-z]+(?: [A-Z][a-z]+)?)'s cremation rate ([a-z])(?=[a-z]+ (?:communities|states|regions?|families)\b)/g, (x, st, c) => c.toUpperCase());
  const body0 = html.indexOf('<body');
  if (body0 < 0) return html;
  let head = html.slice(0, body0), body = html.slice(body0);
  const parts = body.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/i);
  for (let i = 0; i < parts.length; i += 2) {
    let b = parts[i];
    b = b.replace(REG_RE, '');
    b = b.replace(/In ([A-Z][a-z]+(?: [A-Z][a-z]+)?), it is almost never legally required([,.])/g, 'In $1, embalming is almost never legally required$2');
    b = b.replace(/\bdIY\b/g, 'DIY').replace(/typically costs between the range shown/g, 'typically costs within the range shown');
    b = b.replace(/moderate-than-average costs relative to the \$8,300 US median/g, 'moderate costs, a little below the $8,300 US median');
    b = b.replace(/<a href="https:\/\/www\.nfda\.org\/news\/statistics"[^>]*>NFDA's statistics page<\/a>/g, m => m);
    b = b.replace(/(Metal casket: about \$2,500 national median )\(NFDA 2023\)/g, '$1(<a href="https://content.nfda.org/Portals/0/12-8-2023--2023%20GPL%20Survey.pdf" target="_blank" rel="noopener">NFDA 2023 General Price List Study</a>)');
    // ". , as well as" and "text.Next" glue
    b = b.replace(/\.,\s+/g, ', ');
    b = b.replace(/([a-z0-9)])\.([A-Z][a-z])/g, (m, a, c, off, str) => (/[\w-]+\.$/.test(str.slice(Math.max(0, off - 30), off + 2)) && /\.(?:com|org|gov|net)/.test(str.slice(off, off + 6)) ? m : `${a}. ${c}`));
    // Lowercase after a sentence end: short trailing fragments are merged back
    // ("families face. after a death." -> "families face after a death."),
    // otherwise the first letter is capitalized.
    b = b.replace(/([.!?])(\s+)((?:<(?:a|strong|em|span)\b[^>]*>)*)([a-z])([^<.!?]*)/g, (m, p, sp, tags, ch, rest, off, str) => {
      const before = str.slice(Math.max(0, off - 14), off + 1);
      if (ABBR_END.test(before)) return m;
      if (/https?:\/\/\S*$|www\.\S*$/.test(str.slice(Math.max(0, off - 60), off + 1))) return m;
      const end = str[off + m.length];
      const words = (ch + rest).trim().split(/\s+/).length;
      if (!tags && end === '.' && words <= 6 && /^(?:after|to|across|for|in|of|with|from|by|on|at)\b/.test(ch + rest)) return ` ${ch}${rest}`;
      return `${p}${sp}${tags}${ch.toUpperCase()}${rest}`;
    });
    b = b.replace(/\b(the|a|an|and|of|to) \1\b/g, '$1').replace(/([a-z)])\.\.(?=[\s<])/g, '$1.').replace(/ Guide guide\?/g, ' guide?');
    b = b.replace(/(<div class="faq-answer"><p\b[^>]*>)Notably, ([a-z])/g, (m, a, c) => a + c.toUpperCase());
    b = b.replace(/(<(?:p|li|td)\b[^>]*>(?:<(?:a|strong|em)\b[^>]*>)?)([a-z])(?=[a-z ])/g, (m, a, c) => a + c.toUpperCase());
    b = b.replace(/Request viewing or ceremony charges for the funeral home facility separately if the death is between December and March/g, 'Ask cemeteries about winter (frozen-ground) charges if the death is between December and March');
    b = b.replace(/<li\b[^>]*>\s*<\/li>\s*/g, '').replace(/<p\b[^>]*>\s*<\/p>\s*/g, '');
    parts[i] = b;
  }
  return head + parts.join('');
}

// No sentence twice on a page. A body paragraph that is wholly repeated by an
// FAQ answer is dropped (the FAQ keeps it); otherwise later repeats of a
// sentence are removed, and a block left empty is removed unless it is an FAQ
// answer, in which case the repeat stays rather than blanking the answer.
function splitSents(inner) { return smartSplit(inner, /(?<=[.!?])\s+(?=[A-Z<"(])/); }
const norm = x => text(x).replace(/\s+/g, ' ').trim().toLowerCase();
function dedupePage(html) {
  const m0 = html.indexOf('<main'), m1 = html.indexOf('</main>');
  if (m0 < 0 || m1 < 0) return html;
  let main = html.slice(m0, m1);
  const BLOCK = /(<(p|li)\b[^>]*>)((?:(?!<\/?(?:p|li|ul|ol|div)\b)[\s\S])*?)(<\/\2>)/g;
  const answers = new Set();
  main = main.replace(/\s*<details class="faq-item">[\s\S]*?<\/details>/g, d => {
    const a = d.match(/<div class="faq-answer">([\s\S]*?)<\/div>/);
    if (!a) return d;
    const ks = splitSents(a[1]).map(norm).filter(x => x.split(' ').length >= 4);
    if (ks.length && ks.every(x => answers.has(x))) return '';
    ks.forEach(x => answers.add(x)); return d;
  });
  const faqSents = new Set();
  main.replace(/<div class="faq-answer">([\s\S]*?)<\/div>/g, (a, inner) => { splitSents(text(inner)).forEach(x => faqSents.add(norm(x))); return a; });
  // pass 1: body blocks fully repeated in FAQ answers
  main = main.replace(/<div class="faq-answer">[\s\S]*?<\/div>|(<(p|li)\b[^>]*>)((?:(?!<\/?(?:p|li|ul|ol|div)\b)[\s\S])*?)(<\/\2>)/g, (all, o, tag, inner) => {
    if (!o) return all;
    const ss = splitSents(inner).map(norm).filter(x => x.split(' ').length >= 4);
    return ss.length && ss.every(x => faqSents.has(x)) ? '' : all;
  });
  // pass 2: sequential
  const seen = new Set();
  let inFaq = [];
  main = main.replace(/<div class="faq-answer">|(<(p|li|div)\b(?:(?!>)[^c]|c(?!lass="(?:faq|container|content)))*>)((?:(?!<\/?(?:p|li|ul|ol|div|h[1-6]|table|details)\b)[\s\S])*?)(<\/\2>)/g, (all, o, tag, inner, c, off, str) => {
    if (!o) return all;
    const faq = /<div class="faq-answer">(?:(?!<\/div>)[\s\S])*$/.test(str.slice(Math.max(0, off - 3000), off));
    const ss = splitSents(inner);
    const keep = ss.filter(x => { const k = norm(x); if (k.split(' ').length < 4) return true; if (seen.has(k)) return false; seen.add(k); return true; });
    if (keep.length === ss.length) return all;
    if (!keep.some(x => norm(x).split(' ').length >= 4)) return faq ? all : '';
    return o + keep.join(' ') + c;
  });
  main = main.replace(/<(ul|ol)\b[^>]*>\s*<\/\1>\s*/g, '');
  return html.slice(0, m0) + main + html.slice(m1);
}

// Runs in apply-audit before fill-empty, so an FAQ answer that held only a
// stamp or a filler link ends up empty and gets a real answer.
function preClean(html, file) {
  html = defill(html, file).out;
  const i = html.indexOf('<body');
  if (i < 0) return html;
  let b = html.slice(i).replace(/(<script[\s\S]*?<\/script>)|\s*\b[A-Z][a-z]+(?: [A-Z][a-z]+)? regulator is the (?:Dept\.|[^.<"])*\.(?=\s|<|"|$)/g, (m, sc) => sc || '');
  b = b.replace(/<li\b[^>]*>\s*<\/li>\s*/g, '').replace(/<p\b[^>]*>\s*<\/p>/g, '');
  return html.slice(0, i) + b;
}
function fixDirectBurial(html) {
  const t = html.match(/<td>(?:<strong>)?Direct burial(?:<\/strong>)?<\/td><td class="cost-value">(\$[\d,]+)<\/td>/);
  if (!t) return html;
  return html.replace(/(Direct burial (?:is the next step up at about|comes next at around) )\$[\d,]+/g, `$1${t[1]}`);
}

function fixSavings(html, b) {
  return html.replace(/direct cremation at (\$[\d,]+) saves families roughly \$[\d,]+ compared with the (\$[\d,]+) traditional funeral plus cemetery costs\./g, (m, dc, f) => {
    const gap = num(f) - num(dc);
    if (!b) return `direct cremation at ${dc} costs about ${money(gap)} less than the ${f} traditional funeral, before any cemetery charges.`;
    return `direct cremation at ${dc} costs about ${money(gap)} less than the ${f} traditional funeral, and roughly ${money(gap + b)} less once about ${money(b)} in cemetery costs is added.`;
  });
}

// ---------- FAQ JSON-LD from visible text ----------
function balancedDiv(html, start) {
  // start = index of '<div'; returns end index after matching </div>
  const re = /<div\b|<\/div>/g; re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(html))) { depth += m[0] === '</div>' ? -1 : 1; if (!depth) return re.lastIndex; }
  return -1;
}
function visibleFaq(html) {
  const body = html.slice(html.indexOf('<body'));
  const out = [];
  const re = /<summary[^>]*>([\s\S]*?)<\/summary>\s*(<div class="faq-answer">)|<h3 class="faq-question">([\s\S]*?)<\/h3>\s*(<div class="faq-answer">)/g;
  let m;
  while ((m = re.exec(body))) {
    const ds = m.index + m[0].lastIndexOf('<div');
    const de = balancedDiv(body, ds);
    out.push({ q: text(m[1] || m[3]), a: text(body.slice(ds, de)) });
  }
  return out;
}
function answerAfter(body, q) {
  // Loose formats: <h3>Q</h3><p>..</p>... or callout heading + para.
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>/g; let m;
  while ((m = re.exec(body))) {
    if (text(m[1]) !== q) continue;
    const rest = body.slice(re.lastIndex);
    const stop = rest.search(/<h3\b|<h2\b|<\/section>|<\/article>|<section\b|<\/details>|<\/main>/);
    let seg = stop < 0 ? rest : rest.slice(0, stop);
    seg = seg.replace(/(<\/div>\s*)+(<div class="callout[^"]*">\s*)?$/, '');
    return text(seg);
  }
  return null;
}

function syncFaqLd(html) {
  const vis = visibleFaq(html);
  const body = html.slice(html.indexOf('<body'));
  return html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (all, o, js, c) => {
    if (!/"FAQPage"|"headline"/.test(js)) return all;
    let d; try { d = JSON.parse(js); } catch (e) { return all; }
    const nodes = Array.isArray(d) ? d : (d['@graph'] || [d]);
    let touched = false;
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h1t = h1 ? text(h1[1]) : '';
    for (const node of nodes) {
      // Article headline = the visible H1 (Google's limit is 110 characters).
      if (node && typeof node.headline === 'string' && h1t && h1t.length <= 110 && node.headline !== h1t) { node.headline = h1t; touched = true; }
    }
    for (const node of nodes) {
      if (!node || node['@type'] !== 'FAQPage') continue;
      let ents;
      if (vis.length) {
        ents = vis.map(v => ({ '@type': 'Question', name: v.q, acceptedAnswer: { '@type': 'Answer', text: v.a } }));
      } else {
        ents = [];
        for (const e of node.mainEntity || []) {
          const q = text(e.name);
          const a = answerAfter(body, q);
          if (a) ents.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
        }
      }
      if (ents.length) { node.mainEntity = ents; touched = true; }
    }
    if (!touched) return all;
    const indent = /\n\s/.test(js.trim()) ? 2 : 0;
    const lead = js.match(/^\s*/)[0], trail = js.match(/\s*$/)[0];
    const base = (lead.match(/[ \t]*$/) || [''])[0];
    const out = JSON.stringify(d, null, indent).split('\n').map((l, i) => (i ? base + l : l)).join('\n');
    return o + lead + out.replace(/<\//g, '<\\/') + trail + c;
  });
}

function loadCemetery(root) {
  const src = fs.readFileSync(path.join(root, 'generate-pages.js'), 'utf8');
  const b = {};
  for (const m of src.matchAll(/\{name:"([^"]+)",abbr:"[^"]+",slug:"([^"]+)",[^}]*?b:(\d+)\}/g)) b[m[2]] = +m[3];
  return b;
}

let SFJ = null;
function stateFacts() {
  if (SFJ) return SFJ;
  for (const c of [path.join(__dirname, '../../data/state-facts.json'), path.join(__dirname, 'state-facts.json')]) {
    if (fs.existsSync(c)) { SFJ = JSON.parse(fs.readFileSync(c, 'utf8')); return SFJ; }
  }
  return (SFJ = {});
}
// Page-level fixes that need the state's name or verified facts (review 3).
function stateFixes(html, f) {
  const m = f.match(/^(funeral|burial|cremation)-costs-([a-z-]+)\.html$/);
  if (!m) return html;
  const facts = stateFacts();
  const name = Object.keys(facts).find(k => k.toLowerCase().replace(/\s+/g, '-') === m[2]);
  if (!name) return html;
  const F = facts[name];
  // Orphan lowercase callout left after the state-name lead-in was stripped.
  html = html.replace(/(<div class="callout[^"]*" data-state-fact="1">)direct cremation remains/, (x, open) => `${open}In ${name}, direct cremation remains`);
  if (m[1] === 'cremation' && F.waitRule) {
    // A legal-requirements FAQ thinned to a one-line county note: answer it with the
    // verified state rule (same source as the State oversight section, reworded).
    html = html.replace(/(<summary>(?:What legal requirements apply to cremation in [^<]*|What are [^<]*'s cremation regulations\?)<\/summary><div class="faq-answer">)([\s\S]*?)(<\/div><\/details>)/, (x, a, body, z) => {
      const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      if (words >= 40) return x;
      const rule = F.waitRule.replace(/[\s.]+$/, '');
      const lead = `<p>The core rule comes from ${F.waitCite}. ${rule}.</p>`;
      let rest = body;
      if (/medical examiner|coroner/i.test(rule)) rest = rest.replace(/<p[^>]*>Some [^<]*counties require a medical examiner's permit before release\.<\/p>/, '');
      rest = rest.replace(/Some ([A-Z][a-z]+(?: [A-Z][a-z]+)?) counties require a medical examiner's permit before release\./, `If a ${name} death falls under the medical examiner or coroner, that office has to release the body before any cremation.`);
      let note = F.cremationNote && !html.includes(F.cremationNote) ? `<p>${F.cremationNote}</p>` : '';
      if (name === 'Maine') note += '<p>Under the same section, the medical examiner\'s certificate, a certified copy of the death certificate and a burial transit permit together authorize the cremation; the examiner\'s fee for the certificate is $25, which the Chief Medical Examiner can waive.</p>';
      const R = F.regulator;
      let tail = '';
      if (R && R.org) tail = `<p>Complaints about how a crematory or funeral home handled these steps go to the ${R.org}${R.phone ? ` (${R.phone})` : ''}.</p>`;
      return a + lead + note + rest.trim() + tail + z;
    });
  }
  return html;
}

// Round-2 review: per-state FAQ answers that replace one-line templated ones.
// Sourced text lives in data/faq-answers.json ({file: {question: html}}).
let FAQA = null;
function faqAnswers() {
  if (FAQA) return FAQA;
  const c = path.join(__dirname, '../../data/faq-answers.json');
  return (FAQA = fs.existsSync(c) ? JSON.parse(fs.readFileSync(c, 'utf8')) : {});
}
function applyFaqAnswers(html, f) {
  const A = faqAnswers()[f];
  if (!A) return html;
  return html.replace(/(<summary>([^<]*)<\/summary><div class="faq-answer">)([\s\S]*?)(<\/div><\/details>)/g, (x, a, q, body, z) => {
    const ans = A[text(q).replace(/\s+/g, ' ').trim()];
    return ans ? a + ans + z : x;
  });
}

function run(root) {
  const cem = loadCemetery(root);
  let changed = 0;
  for (const f of fs.readdirSync(root)) {
    if (!f.endsWith('.html')) continue;
    const p = path.join(root, f);
    const before = fs.readFileSync(p, 'utf8');
    let html = fixArticles(before);
    if (/^funeral-costs-/.test(f)) {
      const slug = f.replace(/^funeral-costs-|\.html$/g, '');
      const own = html.match(/Cemetery and burial fees add roughly (\$[\d,]+)/);
      html = fixEmbalmingBullet(html, f);
      html = fixDirectBurial(html);
      html = fixSavings(html, own ? num(own[1]) : cem[slug]);
    }
    if (/^cremation-costs-/.test(f) && /do not have to buy the urn/.test(html)) {
      // The audit's urn sentence already covers this; drop the filled duplicate.
      html = html.replace(/\n\s*<li data-state-fact="1">You can buy the urn anywhere and the [^<]*<a href="urn-buying-guide\.html">urn buying guide<\/a>\.<\/li>/, '');
    }
    // Statutory name, NRS 642.020.
    html = html.replace(/NV State Board of Funeral &amp; Cemetery Services/g, 'Nevada Funeral and Cemetery Services Board');
    if (f === 'burial-costs-georgia.html') {
      // This list quoted $8,552 / $995 / $6,340, which contradict the page's own
      // $6,900 / $1,700 / $5,600 estimates; use the page's figures.
      html = html.replace(/<li data-state-fact="1">This service type is the most expensive option[^<]*<\/li>/, '<li data-state-fact="1">A traditional funeral with viewing and burial is the most expensive route in Georgia, at about $6,900 for the funeral home\'s part before the plot, vault and opening fees in the table above.</li>')
        .replace(/<li data-state-fact="1">Embalming is generally not legally required in Georgia unless there is a public viewing[^<]*<\/li>/, '<li data-state-fact="1">A Georgia funeral home may insist on embalming as its own policy for a public viewing, but the FTC Funeral Rule bars it from claiming the law requires embalming when it does not.</li>')
        .replace(/<li><strong>Direct cremation<\/strong> starts around \$995 in Georgia[^<]*<\/li>/, '<li><strong>Direct cremation</strong> starts around $1,700 in Georgia, and cremation with a full service runs about $5,600; for any cremation, Georgia providers must let you use a simple container instead of a casket.</li>')
        .replace('An eco friendly green burial can be a lower-cost alternative', 'A green burial, without embalming or a vault, can cost less than a conventional one');
    }
    if (/-costs-/.test(f)) html = defill(html, f).out;
    if (/-costs-/.test(f)) {
      // Resource-list entries that only point at another state "for comparison".
      const own = f.replace(/^\w+-costs-|\.html$/g, '');
      html = html.replace(/<li><a href="(?:funeral|burial|cremation)-costs-([a-z-]+)\.html">[^<]*<\/a><span class="resource-desc">([^<]*)<\/span><\/li>/g, (m, st, d) => (st !== own && /compar/i.test(d) ? '' : m));
    }
    html = fixSentences(html);
    html = html.replace('and ask what includes cremation so you can spot add-ons', 'and ask exactly what that price includes so you can spot add-ons');
    html = dedupePage(html);
    html = stateFixes(html, f);
    // Block starts left lowercase after an upstream lead-in was stripped.
    html = html.replace(/(<(?:p|li|div|summary)\b[^>]*>)\s*most expensive option but/g, '$1It is the most expensive option but')
      .replace(/(<(?:p|li|div|summary)\b[^>]*>) +(?=[A-Za-z])/g, '$1')
      .replace(/(<(?:p|li|div)\b[^>]*data-state-fact[^>]*>)([a-z])/g, (x, t, c) => t + c.toUpperCase());
    html = applyFaqAnswers(html, f);
    html = syncFaqLd(html);
    if (html !== before) { fs.writeFileSync(p, html); changed++; }
  }
  console.log(`  Post-fix (articles, FAQ JSON-LD sync, number consistency): ${changed} page(s)`);
}
module.exports = { preClean, run, visibleFaq, text };

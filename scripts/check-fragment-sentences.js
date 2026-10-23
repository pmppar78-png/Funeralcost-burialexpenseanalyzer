#!/usr/bin/env node
/**
 * Fails when a page still contains the generated state-page fragment
 * sentences: a place name plus one or two words and a period ("South
 * Dakota request GPL."), a run of those sentences, a "related reading"
 * wrapper, or glued tokens such as 52percent, 48hr, and 453point4.
 * Unpunctuated labels ("Hawaii — $11,000", "Texas burial costs") are
 * not fragments.
 *
 * Usage:
 *   node scripts/check-fragment-sentences.js
 *   node scripts/check-fragment-sentences.js --json
 *   node scripts/check-fragment-sentences.js --strip
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const AS_JSON = process.argv.includes('--json');
const STRIP = process.argv.includes('--strip');

const PLACES = [
  'Washington DC',
  'West Virginia',
  'South Carolina',
  'South Dakota',
  'North Carolina',
  'North Dakota',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'Rhode Island',
  'Indianapolis',
  'Memphis',
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'Wisconsin',
  'Wyoming'
].sort((a, b) => b.length - a.length);

const GLUED = /\b\d+percent\b|\b\d+hr\b|\b453point4\b|\b\d+to\d+\b/i;
const ABBREV = /(?:Dept|U\.S|Dr|Mr|Mrs|Ms|St|vs|Inc|Jr|Sr|No|Fig|approx|a\.m|p\.m|e\.g|i\.e|etc|Ave|Blvd)\.$/i;

function leadOf(text) {
  const trimmed = text.trim();
  for (const place of PLACES) {
    const re = new RegExp('^' + place.replace(/ /g, '\\s+') + '\\b', 'i');
    const found = trimmed.match(re);
    if (!found) continue;
    return { place, rest: trimmed.slice(found[0].length).trim() };
  }
  return null;
}

function isFragmentSentence(plainText) {
  const text = String(plainText).replace(/\s+/g, ' ').trim();
  if (!text) return false;
  if (GLUED.test(text)) return true;
  const body = text.replace(/[.!?]+$/, '').trim();
  const hit = leadOf(body);
  if (!hit) return false;
  if (/^related reading\b/i.test(hit.rest)) return true;
  // Price labels and link titles ("Hawaii — $11,000", "Texas burial costs")
  // are short but are not sentences. Generated fragments always end with
  // punctuation: "South Dakota request GPL."
  if (!/[.!?]$/.test(text)) return false;
  const words = hit.rest.split(/\s+/).filter(Boolean);
  // "Indianapolis Avg." and "Washington DC Avg." are column labels.
  // The period belongs to the abbreviation, not to a generated sentence.
  if (words.length === 1 && /^(avg|dept|dr|mr|mrs|ms|st|no|vs|inc|jr|sr)$/i.test(words[0])) return false;
  return words.length > 0 && words.length <= 2;
}

function nextClauseIsFragment(inner, periodIndex) {
  let j = periodIndex + 1;
  while (j < inner.length && /\s/.test(inner[j])) j++;
  const text = plain(inner.slice(j));
  const hit = leadOf(text);
  if (!hit) return false;
  if (/^related reading\b/i.test(hit.rest)) return true;
  const first = text.split(/(?<=[.!?])\s/)[0] || '';
  const body = first.replace(/[.!?]+$/, '').trim();
  const lead = leadOf(body);
  if (!lead) return false;
  const words = lead.rest.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length <= 2;
}

function htmlSentences(inner) {
  const parts = [];
  let buf = '';
  let inTag = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '<') inTag = true;
    buf += c;
    if (c === '>') inTag = false;
    const atStop = !inTag && /[.!?]/.test(c) && (/\s/.test(inner[i + 1] || '') || i === inner.length - 1);
    const abbrev = atStop && (ABBREV.test(buf) || /\b[A-Z]\.$/.test(buf));
    // "U.S." is an abbreviation and also the end of a sentence when the
    // next clause is a generated fragment ("U.S. Tennessee related reading:").
    if (atStop && (!abbrev || nextClauseIsFragment(inner, i))) {
      parts.push(buf);
      buf = '';
    }
  }
  if (buf.trim()) parts.push(buf);
  return parts;
}

function plain(html) {
  return String(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function anchorsOf(html) {
  return [...String(html).matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(match => match[0]);
}

function anchorNamesPlace(anchorHtml) {
  const hit = leadOf(plain(anchorHtml));
  return !!(hit && hit.rest);
}

const TEXT_ELEMENT = /<(p|li|td|th|div)\b([^>]*)>((?:(?!<(?:p|li|td|th|div|ul|ol|table|h2|h3|section|script)\b)[\s\S])*?)<\/\1>/gi;

function visibleHtml(html) {
  return String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ');
}

function eachTextElement(html, visit) {
  const source = visibleHtml(html);
  TEXT_ELEMENT.lastIndex = 0;
  let match;
  while ((match = TEXT_ELEMENT.exec(source))) {
    visit(match[3], match[1], match[2], match[0]);
  }
}

function fragmentSentencesFromInner(inner) {
  const found = [];
  for (const part of htmlSentences(inner)) {
    const text = plain(part);
    if (!text || !isFragmentSentence(text)) continue;
    found.push(text);
  }
  return found;
}

function fragmentSentencesIn(html) {
  const found = [];
  eachTextElement(html, inner => {
    found.push(...fragmentSentencesFromInner(inner));
  });
  return found;
}

function repeatedRuns(html) {
  const runs = [];
  eachTextElement(html, inner => {
    let current = [];
    let currentPlace = '';
    function flush() {
      if (current.length >= 3) runs.push(current.slice());
      current = [];
      currentPlace = '';
    }
    for (const part of htmlSentences(inner)) {
      const text = plain(part);
      const hit = text && isFragmentSentence(text) ? leadOf(text) : null;
      if (hit && hit.place.toLowerCase() === (currentPlace || hit.place).toLowerCase()) {
        currentPlace = hit.place;
        current.push(text);
      } else {
        flush();
        if (hit) {
          currentPlace = hit.place;
          current = [text];
        }
      }
    }
    flush();
  });
  return runs;
}

function rewriteElement(inner) {
  const kept = [];
  let removed = 0;
  for (const part of htmlSentences(inner)) {
    const text = plain(part);
    if (text && isFragmentSentence(text)) {
      removed++;
      const anchors = anchorsOf(part);
      // "South Dakota funeral regulations directory" is a real link that
      // was sitting inside the generated sentence. Keep that link and the
      // FTC / NAAG links packed with it. Shared labels such as "guide to
      // paying for a funeral with no money" are the fragment, not a source.
      if (anchors.some(anchorNamesPlace)) kept.push(anchors.join(' '));
      continue;
    }
    if (part.trim()) kept.push(part.trim());
  }
  return { html: kept.join(' ').replace(/[ \t]{2,}/g, ' ').trim(), removed };
}

function stripFragments(html) {
  let removed = 0;
  const shielded = [];
  let source = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, block => {
    const token = `%%SCRIPT${shielded.length}%%`;
    shielded.push(block);
    return token;
  });
  source = source.replace(/<(p|li|td|th|div)\b([^>]*)>((?:(?!<(?:p|li|td|th|div|ul|ol|table|h2|h3|section|script)\b)[\s\S])*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    if (!fragmentSentencesFromInner(inner).length) return full;
    const next = rewriteElement(inner);
    removed += next.removed;
    if (!next.html && (tag === 'p' || tag === 'li' || /\bcallout\b/.test(attrs))) return '';
    return `<${tag}${attrs}>${next.html}</${tag}>`;
  });
  shielded.forEach((block, i) => {
    source = source.replace(`%%SCRIPT${i}%%`, block);
  });
  return { html: source, removed };
}

function htmlFiles() {
  return fs.readdirSync(ROOT).filter(name => name.endsWith('.html'));
}

function scanFile(name) {
  const html = fs.readFileSync(path.join(ROOT, name), 'utf8');
  const sentences = fragmentSentencesIn(html);
  const runs = repeatedRuns(html);
  return { name, sentences, runs };
}

function main() {
  const files = htmlFiles();
  if (STRIP) {
    let filesChanged = 0;
    let removed = 0;
    for (const name of files) {
      const full = path.join(ROOT, name);
      const before = fs.readFileSync(full, 'utf8');
      const next = stripFragments(before);
      if (next.html !== before) {
        fs.writeFileSync(full, next.html);
        filesChanged++;
        removed += next.removed;
      }
    }
    console.log(`Stripped ${removed} fragment sentence(s) from ${filesChanged} file(s).`);
  }

  const hits = [];
  let sentenceCount = 0;
  let runCount = 0;
  for (const name of files) {
    const result = scanFile(name);
    if (!result.sentences.length && !result.runs.length) continue;
    sentenceCount += result.sentences.length;
    runCount += result.runs.length;
    hits.push(result);
  }

  if (AS_JSON) {
    console.log(JSON.stringify({
      files: hits.length,
      sentences: sentenceCount,
      runs: runCount,
      sample: hits.slice(0, 5).map(hit => ({
        file: hit.name,
        sentences: hit.sentences.slice(0, 3),
        runs: hit.runs.length
      }))
    }, null, 2));
  } else if (hits.length) {
    console.error(`Fragment sentences: ${sentenceCount} in ${hits.length} file(s); ${runCount} repeated state-name run(s).`);
    for (const hit of hits.slice(0, 12)) {
      console.error(`  ${hit.name}: ${hit.sentences.length} sentence(s)`);
      if (hit.sentences[0]) console.error(`    ${hit.sentences[0].slice(0, 160)}`);
    }
  } else {
    console.log(`No fragment sentences in ${files.length} HTML files.`);
  }
  if (hits.length) process.exit(1);
}

main();

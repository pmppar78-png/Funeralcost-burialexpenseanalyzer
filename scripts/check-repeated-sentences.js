#!/usr/bin/env node
/**
 * Fail when the same sentence appears in the main content of 5 or more pages.
 * Navigation, related-link blocks, resource lists, and the shared legal
 * disclaimer are excluded: those are repeated on purpose. Everything else
 * in <main> counts, including FAQs and cost tables.
 *
 * Usage: node scripts/check-repeated-sentences.js [--min N] [--json]
 */
const fs = require('fs');
const path = require('path');
const { sentencesFromFile } = require('./sentence-scan');

const ROOT = path.join(__dirname, '..');
const MIN_PAGES = Number(process.argv.find((a, i) => process.argv[i - 1] === '--min') || 5);
const AS_JSON = process.argv.includes('--json');
// Sitewide disclosure lines that are meant to be identical (Growth, 2026-10-22).
const ALLOW_REPEAT = new Set([
  'These figures are our estimates, not a survey of local providers.',
]);

function sentencesFrom(file) {
  return sentencesFromFile(path.join(ROOT, file));
}

function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).sort();
  const map = new Map();
  for (const f of files) {
    const seen = new Set();
    for (const s of sentencesFrom(f)) {
      if (seen.has(s) || ALLOW_REPEAT.has(s)) continue;
      seen.add(s);
      if (!map.has(s)) map.set(s, []);
      map.get(s).push(f);
    }
  }
  const hits = [...map.entries()]
    .filter(([, pages]) => pages.length >= MIN_PAGES)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));

  if (AS_JSON) {
    console.log(JSON.stringify(hits.map(([sentence, pages]) => ({ sentence, count: pages.length, pages })), null, 2));
  } else if (hits.length) {
    console.error(`Repeated sentences on ${MIN_PAGES}+ pages: ${hits.length}`);
    for (const [sentence, pages] of hits.slice(0, 40)) {
      console.error(`\n[${pages.length}] ${sentence}`);
      console.error('  e.g. ' + pages.slice(0, 6).join(', '));
    }
    if (hits.length > 40) console.error(`\n... ${hits.length - 40} more`);
  } else {
    console.log(`No sentence repeats on ${MIN_PAGES}+ pages (${files.length} HTML files checked).`);
  }
  process.exit(hits.length ? 1 : 0);
}

main();

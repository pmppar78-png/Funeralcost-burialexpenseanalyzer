#!/usr/bin/env node
/**
 * Five-word overlap on state funeral, cremation, and burial pages.
 * Navigation, related links, resource lists, and the short disclaimer are
 * excluded. Tables stay in the measurement.
 *
 * Fails when average pairwise containment is above the threshold, or when
 * a state's cremation page and burial page share too much.
 *
 * Usage: node scripts/check-state-overlap.js [--json]
 */
const fs = require('fs');
const path = require('path');
const { stripClassBlocks, SKIP_CLASS } = require('./sentence-scan');

const ROOT = path.join(__dirname, '..');
const AS_JSON = process.argv.includes('--json');
// Average pairwise containment of 5-word windows in <main>, after shared
// chrome is removed. Tables stay in the measurement, so identical price
// rows keep cremation pages from falling as far as the prose does.
// Limits sit under the October 22 follow-up baseline (funeral 43%,
// cremation 42%, burial 38%, same-state cremation vs burial 30%) and
// over the pages this check was introduced with.
const LIMITS = {
  funeral: 0.24,
  cremation: 0.28,
  burial: 0.18,
  cremationVsBurial: 0.18
};

const STATES = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana','nebraska','nevada','new-hampshire','new-jersey','new-mexico','new-york','north-carolina','north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island','south-carolina','south-dakota','tennessee','texas','utah','vermont','virginia','washington','west-virginia','wisconsin','wyoming'];

function wordsFromFile(file) {
  let html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const main = html.match(/<main\b[\s\S]*?<\/main>/i);
  html = main ? main[0] : html;
  for (const cls of SKIP_CLASS) html = stripClassBlocks(html, cls);
  html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  html = html.replace(/<[^>]+>/g, ' ');
  html = html.replace(/&[a-z#0-9]+;/gi, ' ');
  return (html.toLowerCase().match(/[a-z0-9$%']+/g) || []);
}

function shingles(words) {
  const set = new Set();
  for (let i = 0; i <= words.length - 5; i++) set.add(words.slice(i, i + 5).join(' '));
  return set;
}

function containment(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const g of small) if (large.has(g)) inter++;
  return inter / small.size;
}

function family(kind) {
  const data = {};
  for (const st of STATES) {
    const file = `${kind}-costs-${st}.html`;
    if (!fs.existsSync(path.join(ROOT, file))) continue;
    data[st] = shingles(wordsFromFile(file));
  }
  return data;
}

function pairwise(data) {
  const keys = Object.keys(data);
  const scores = [];
  let max = 0;
  let pair = null;
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const score = containment(data[keys[i]], data[keys[j]]);
      scores.push(score);
      if (score > max) {
        max = score;
        pair = [keys[i], keys[j]];
      }
    }
  }
  const avg = scores.reduce((s, n) => s + n, 0) / scores.length;
  return { avg, max, pair, pages: keys.length };
}

function main() {
  const funeral = family('funeral');
  const cremation = family('cremation');
  const burial = family('burial');
  const report = {
    funeral: pairwise(funeral),
    cremation: pairwise(cremation),
    burial: pairwise(burial),
    cremationVsBurial: null
  };
  const cross = [];
  let crossMax = 0;
  let crossPair = null;
  for (const st of STATES) {
    if (!cremation[st] || !burial[st]) continue;
    const score = containment(cremation[st], burial[st]);
    cross.push(score);
    if (score > crossMax) {
      crossMax = score;
      crossPair = st;
    }
  }
  report.cremationVsBurial = {
    avg: cross.reduce((s, n) => s + n, 0) / cross.length,
    max: crossMax,
    pair: crossPair,
    pages: cross.length
  };

  const failures = [];
  for (const key of ['funeral', 'cremation', 'burial', 'cremationVsBurial']) {
    if (report[key].avg > LIMITS[key]) failures.push(`${key} average ${(report[key].avg * 100).toFixed(1)}% exceeds ${(LIMITS[key] * 100).toFixed(0)}%`);
  }

  if (AS_JSON) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    for (const key of ['funeral', 'cremation', 'burial', 'cremationVsBurial']) {
      const row = report[key];
      const pair = Array.isArray(row.pair) ? row.pair.join(' / ') : row.pair;
      console.log(`${key}: average ${(row.avg * 100).toFixed(1)}%, max ${(row.max * 100).toFixed(1)}% (${pair})`);
    }
    if (failures.length) {
      console.error('State-page overlap is too high:');
      for (const f of failures) console.error('  ' + f);
    } else {
      console.log('State-page 5-word overlap is within limits.');
    }
  }
  process.exit(failures.length ? 1 : 0);
}

main();

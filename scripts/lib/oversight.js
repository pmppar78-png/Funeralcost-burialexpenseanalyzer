/**
 * State funeral regulators and the rule summary already published in
 * state-funeral-regulations.html. Parsed at build time so the state pages
 * and the directory cannot drift into two different "official" versions.
 * Attorney general contacts are not invented here: pages link to the
 * National Association of Attorneys General directory, which lists the
 * current consumer-protection phone and form for every state.
 */
const fs = require('fs');
const path = require('path');

const NAAG = 'https://www.naag.org/find-my-ag/';

function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function loadOversight(root) {
  const html = fs.readFileSync(path.join(root, 'state-funeral-regulations.html'), 'utf8');
  const map = {};
  const re = /<tr><td><a href="funeral-costs-([a-z-]+)\.html"><strong>([^<]+)<\/strong><\/a><\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td>/g;
  let m;
  while ((m = re.exec(html))) {
    map[m[1]] = {
      slug: m[1],
      name: decode(m[2]),
      board: decode(m[3]),
      rule: decode(m[4]),
      directoryRate: decode(m[5]),
      agUrl: NAAG
    };
  }
  return map;
}

module.exports = { loadOversight, NAAG };

/**
 * Shared sentence extractor for the repeat check and the audit rewriter.
 * Navigation, related-link blocks, resource lists, and the shared legal
 * disclaimer are excluded: those are repeated on purpose.
 */
const fs = require('fs');

const MIN_WORDS = 8;

const SKIP_CLASS = [
  'related-guides',
  'resource-suggestions',
  'resource-list',
  'guide-disclaimer',
  // Round 4: the one labeled sitewide methodology/disclosure line on state pages.
  'state-method-note',
  'toc',
  'guide-breadcrumb',
  'chat-breadcrumb',
  'cta-banner',
  'article-meta',
  'article-byline',
  'site-nav',
  'site-header',
  'site-footer',
  'footer-links',
  'footer-sources',
  'state-grid',
  'sitemap-list',
  'nav-dropdown',
  'starter-questions',
  'chat-form',
  'chat-window',
  'topic-nav'
];

function stripClassBlocks(html, cls) {
  const re = new RegExp(`<(div|nav|section|ul|ol|p|aside|header|footer)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'i');
  let out = '';
  let i = 0;
  while (i < html.length) {
    const m = html.slice(i).match(re);
    if (!m) {
      out += html.slice(i);
      break;
    }
    const start = i + m.index;
    out += html.slice(i, start);
    const tag = m[1].toLowerCase();
    const open = new RegExp(`<${tag}\\b`, 'gi');
    const close = new RegExp(`</${tag}>`, 'gi');
    let depth = 0;
    let j = start;
    while (j < html.length) {
      open.lastIndex = j;
      close.lastIndex = j;
      const o = open.exec(html);
      const c = close.exec(html);
      if (!c) {
        j = html.length;
        break;
      }
      if (o && o.index < c.index) {
        depth++;
        j = o.index + o[0].length;
      } else {
        depth--;
        j = c.index + c[0].length;
        if (depth === 0) break;
      }
    }
    i = j;
  }
  return out;
}

function decode(s) {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&rsquo;|&#8217;/gi, "'")
    .replace(/&lsquo;|&#8216;/gi, "'")
    .replace(/&ldquo;|&#8220;/gi, '"')
    .replace(/&rdquo;|&#8221;/gi, '"')
    .replace(/&mdash;|&#8212;/gi, '—')
    .replace(/&ndash;|&#8211;/gi, '–')
    .replace(/&hellip;|&#8230;/gi, '...')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, ' ');
}

function sentencesFromHtml(html) {
  const main = html.match(/<main\b[\s\S]*?<\/main>/i);
  html = main ? main[0] : html;
  html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  html = html.replace(/<header\b[\s\S]*?<\/header>/gi, ' ').replace(/<footer\b[\s\S]*?<\/footer>/gi, ' ').replace(/<nav\b[\s\S]*?<\/nav>/gi, ' ');
  for (const cls of SKIP_CLASS) html = stripClassBlocks(html, cls);
  html = html.replace(/<\/(p|li|h1|h2|h3|h4|td|th|summary|div|tr)>/gi, '. ');
  let text = decode(html.replace(/<[^>]+>/g, ' '));
  text = text.replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').replace(/([.!?])\1+/g, '$1').trim();
  const parts = text.split(/(?<=[.!?])\s+/);
  const out = [];
  for (let raw of parts) {
    raw = raw.replace(/\s+/g, ' ').trim();
    if (!raw) continue;
    const words = raw.split(' ').filter(Boolean);
    if (words.length < MIN_WORDS) continue;
    if (raw.length > 500) continue;
    out.push(raw);
  }
  return out;
}

function sentencesFromFile(filePath) {
  return sentencesFromHtml(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
  MIN_WORDS,
  SKIP_CLASS,
  stripClassBlocks,
  decode,
  sentencesFromHtml,
  sentencesFromFile
};

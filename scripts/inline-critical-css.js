// Inline the style.css rules each page actually uses, then load the full
// style.css without blocking first paint. Idempotent: safe to run on pages
// that were already processed (the old inline block is recomputed).
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const ROOT = path.join(__dirname, '..');
const CSS = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const BLOCKING = '<link rel="stylesheet" href="style.css" />';
const ASYNC = '<link rel="stylesheet" href="style.css" media="print" onload="this.media=\'all\'" /><noscript><link rel="stylesheet" href="style.css" /></noscript>';
const INLINE_RE = /<style data-critical>[\s\S]*?<\/style>/;

async function main() {
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  let done = 0;
  for (const f of files) {
    const file = path.join(ROOT, f);
    let html = fs.readFileSync(file, 'utf8');
    if (!html.includes(BLOCKING) && !INLINE_RE.test(html)) continue;
    const bare = html.replace(INLINE_RE, '');
    const [res] = await new PurgeCSS().purge({
      content: [{ raw: bare, extension: 'html' }],
      css: [{ raw: CSS }],
      keyframes: true,
      safelist: { standard: [/^nav-open$/, /^is-/, /^active$/, /^open$/] }
    });
    const css = res.css.replace(/\n\s*\n/g, '\n').replace(/<\/style/gi, '<\\/style');
    const block = '<style data-critical>' + css + '</style>';
    if (INLINE_RE.test(html)) html = html.replace(INLINE_RE, () => block);
    else html = html.replace(BLOCKING, () => block + ASYNC);
    fs.writeFileSync(file, html);
    done++;
  }
  console.log('inline-critical-css: ' + done + ' pages');
}
main().catch(e => { console.error(e); process.exit(1); });

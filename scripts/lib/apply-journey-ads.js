// Remove Google AdSense tags and ensure the Journey by Mediavine
// script wrapper is in <head> on every HTML page. Idempotent.
const fs = require('fs');
const path = require('path');

const JOURNEY_SRC =
  'scripts.scriptwrapper.com/tags/43f3bdab-b8ed-4589-b014-150c06f37c31.js';
const JOURNEY_TAG =
  '<script type="text/javascript" async="async" data-noptimize="1" data-cfasync="false" src="//' +
  JOURNEY_SRC +
  '"></script>';

function stripAdSense(html) {
  html = html.replace(
    /\n?  <script\b[^>]*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*>\s*<\/script>/gi,
    ''
  );
  html = html.replace(
    /\n?  <script\b[^>]*src=["'][^"']*adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/gi,
    ''
  );
  html = html.replace(
    /\n?  <meta\b[^>]*name=["']google-adsense-account["'][^>]*>/gi,
    ''
  );
  html = html.replace(
    /\n?  <ins\b[^>]*class=["'][^"']*adsbygoogle[^"']*["'][^>]*>\s*<\/ins>/gi,
    ''
  );
  html = html.replace(
    /\n?  <script\b[^>]*>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\([^<]*\)\s*<\/script>/gi,
    ''
  );
  return html;
}

function ensureJourney(html) {
  if (html.includes(JOURNEY_SRC)) return html;
  if (/<head[^>]*>/i.test(html)) {
    return html.replace(/<head[^>]*>/i, (open) => open + '\n  ' + JOURNEY_TAG);
  }
  return html;
}

function run(outDir) {
  let pages = 0;
  const names = fs.readdirSync(outDir).filter((f) => f.endsWith('.html'));
  for (const name of names) {
    const fp = path.join(outDir, name);
    const before = fs.readFileSync(fp, 'utf8');
    const after = ensureJourney(stripAdSense(before));
    if (after !== before) {
      fs.writeFileSync(fp, after);
      pages++;
    }
  }
  console.log(`  Journey ads hook: updated ${pages} page(s)`);
}

module.exports = { run, stripAdSense, ensureJourney, JOURNEY_TAG };

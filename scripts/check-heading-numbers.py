#!/usr/bin/env python3
"""Fail if any number, percent, dollar amount, or statute in an H1–H3
does not also appear in that page's own body text."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Comment

ROOT = Path(__file__).resolve().parents[1]

# Money, percents, statutes, day/hour quantities, and other numerals.
MONEY_RE = re.compile(r'\$[0-9][0-9,]*')
PCT_RE = re.compile(r'\d+(?:\.\d+)?\s*%')
STATUTE_RE = re.compile(
    r'(?:§+\s*)[0-9A-Za-z().-]+(?:\s*(?:and|,)\s*§+\s*[0-9A-Za-z().-]+)*'
)
# Cite fragments like 16.64.4.8, 43-31-29, 12-135-307, 36-12-5, 9.15 (with section context)
CODE_RE = re.compile(r'\b\d+[A-Za-z]*(?:[.-]\d+[A-Za-z]*){1,}\b')
QTY_RE = re.compile(r'\b\d+-hour\b|\b\d+-day\b|\b\d+\s+hours?\b|\b\d+\s+days?\b', re.I)
YEAR_RE = re.compile(r'\b20[0-9]{2}\b')
NUM_RE = re.compile(r'\b\d+(?:,\d{3})+(?:\.\d+)?\b|\b\d+\.\d+\b|\b\d+\b')

SKIP_TAGS = {'script', 'style', 'noscript', 'svg', 'template'}


def visible_text(node) -> str:
    parts = []
    if node is None:
        return ''
    for child in node.descendants:
        if isinstance(child, Comment):
            continue
        if isinstance(child, NavigableString):
            parent = child.parent
            if parent is not None and parent.name in SKIP_TAGS:
                continue
            parts.append(str(child))
    return re.sub(r'\s+', ' ', ' '.join(parts))


def norm(s: str) -> str:
    s = s.replace('\u2013', '-').replace('\u2014', '-').replace('\u00a0', ' ')
    s = s.replace('&ndash;', '-').replace('&mdash;', '-')
    s = re.sub(r'\s+', ' ', s)
    return s


def body_needles(text: str) -> str:
    """Normalized body plus compact variants so $8,300 matches $8300 etc."""
    t = norm(text)
    compact = t.replace(',', '').replace(' ', '')
    return t + ' ' + compact


def extract_tokens(heading: str) -> list[tuple[str, str]]:
    """Return (kind, token) in heading order, without double-counting."""
    s = norm(heading)
    occupied = [False] * len(s)
    found: list[tuple[int, str, str]] = []

    def take(kind, regex):
        for m in regex.finditer(s):
            if any(occupied[m.start():m.end()]):
                continue
            tok = re.sub(r'\s+', ' ', m.group(0)).strip()
            for i in range(m.start(), m.end()):
                occupied[i] = True
            found.append((m.start(), kind, tok))

    take('money', MONEY_RE)
    take('percent', PCT_RE)
    take('statute', STATUTE_RE)
    take('code', CODE_RE)
    take('quantity', QTY_RE)
    take('year', YEAR_RE)
    take('number', NUM_RE)
    found.sort()
    return [(k, t) for _, k, t in found]


WORDS = {
    '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five',
    '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten',
    '12': 'twelve', '14': 'fourteen', '15': 'fifteen', '20': 'twenty',
    '21': 'twenty-one', '24': 'twenty-four', '30': 'thirty',
    '48': 'forty-eight', '72': 'seventy-two',
}

def token_in_body(kind: str, tok: str, body: str) -> bool:
    raw = norm(tok).rstrip(').,;:')
    compact = raw.replace(',', '').replace(' ', '')
    b = body
    bc = body.replace(',', '').replace(' ', '')
    # percents: "30%" must be a real 30%; also allow "30 percent" / "thirty percent".
    if kind == 'percent':
        n = re.sub(r'\s*%', '', raw)
        patterns = [
            re.compile(r'(?<![\d.])' + re.escape(n) + r'\s*%'),
            re.compile(r'(?<![\d.])' + re.escape(n) + r'\s*percent', re.I),
        ]
        if n in WORDS:
            patterns.append(re.compile(r'\b' + WORDS[n] + r'\s+percent', re.I))
        return any(p.search(b) for p in patterns)
    if kind == 'money':
        digits = raw.replace('$', '').replace(',', '')
        return bool(re.search(r'\$\s*' + re.escape(digits) + r'\b', bc)) or raw in b or compact in bc
    if kind in ('statute', 'code'):
        core = re.sub(r'^§+\s*', '', raw)
        cores = [core, core.replace(' ', ''), raw, compact]
        if any(c and (c in b or c in bc) for c in cores if c):
            return True
        m = re.match(r'^(\d+)[-](\d+)$', core)
        if m:
            a, c2 = m.group(1), m.group(2)
            if re.search(r'\b' + a + r'\s*[–—-]\s*' + c2 + r'\b', b) or re.search(r'\b' + a + r'\s+to\s+' + c2 + r'\b', b, re.I):
                return True
        return False
    if kind == 'quantity':
        raw_l = raw.lower()
        if raw_l in b.lower() or compact.lower() in bc.lower():
            return True
        m = re.match(r'(\d+)[- ]hours?$', raw_l)
        if m:
            n = m.group(1)
            if re.search(r'\b' + n + r'[- ]hours?\b', b, re.I):
                return True
        m = re.match(r'(\d+)[- ]days?$', raw_l)
        if m:
            n = m.group(1)
            if re.search(r'\b' + n + r'[- ]days?\b', b, re.I):
                return True
        return False
    if kind in ('year', 'number'):
        # Word-boundary in normalized text; also comma-formatted counterpart.
        if re.search(r'(?<![\d.])' + re.escape(raw) + r'(?![\d])', b):
            return True
        if raw.replace(',', '') != raw and re.search(r'(?<![\d.])' + re.escape(raw.replace(',', '')) + r'(?![\d])', b.replace(',', '')):
            return True
        return False
    return raw in b


def check_page(path: Path) -> list[dict]:
    html = path.read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'lxml')
    headings = soup.find_all(['h1', 'h2', 'h3'])
    heading_texts = [h.get_text(' ', strip=True) for h in headings]
    # Body: visible page text with heading strings removed once each
    body = visible_text(soup)
    body_n = body_needles(body)
    # Remove heading text so a number only in the heading does not self-match
    body_wo = body
    for t in heading_texts:
        body_wo = body_wo.replace(t, ' ', 1)
    body_wo_n = body_needles(body_wo)

    failures = []
    for h, text in zip(headings, heading_texts):
        if not text:
            continue
        for kind, tok in extract_tokens(text):
            if not token_in_body(kind, tok, body_wo_n):
                failures.append({
                    'file': path.name,
                    'tag': h.name,
                    'id': h.get('id') or '',
                    'heading': text,
                    'kind': kind,
                    'token': tok,
                })
    return failures


def main() -> int:
    pages = sorted(ROOT.glob('*.html'))
    # skip utility pages that are not article content? User said every page.
    all_fail = []
    checked = 0
    for p in pages:
        if p.name in {'404.html', 'chat.html'}:
            # still check; 404 may have few numbers
            pass
        fails = check_page(p)
        checked += 1
        all_fail.extend(fails)
    print(f'Checked {checked} pages, {len(all_fail)} heading-number failure(s).')
    for f in all_fail:
        print(f"FAIL {f['file']} <{f['tag']}{('#'+f['id']) if f['id'] else ''}> {f['kind']} {f['token']!r} not in body")
        print(f"     {f['heading']}")
    out = Path('/tmp/fca-hr/heading-number-check.json')
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({'checked': checked, 'failures': all_fail}, indent=2, ensure_ascii=False) + '\n')
    return 1 if all_fail else 0


if __name__ == '__main__':
    sys.exit(main())

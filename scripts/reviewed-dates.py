# For each html page: date (America/New_York) of the latest commit where its <main> text changed,
# ignoring date strings, review/updated labels, headings, charts and edits under 20 words.
# Usage: python3 scripts/reviewed-dates.py REPO_ROOT data/reviewed-dates.json  (needs bs4 + lxml and full git history)
import subprocess,re,sys,json,os
from bs4 import BeautifulSoup
R=sys.argv[1];os.chdir(R)
MON='(January|February|March|April|May|June|July|August|September|October|November|December)'
def norm(h):
  s=BeautifulSoup(h,'lxml')
  for t in s(['script','style','noscript','svg','time']):t.decompose()
  for t in s.select('figure.data-chart'):t.decompose()
  m=s.find('main') or s.body
  if m is None: return ''
  B=['p','li','h1','h2','h3','h4','h5','h6','td','th','dt','dd','figcaption','summary','blockquote','caption']
  parts=[e.get_text(' ') for e in m.find_all(B) if not e.find(B) and not re.match(r'h[1-6]$',e.name)]
  x='\n'.join(re.sub(r'\s+',' ',p).strip() for p in parts)
  x=re.sub(MON+r'\.? \d{1,2},? \d{4}','D',x);x=re.sub(r'\d{4}-\d{2}-\d{2}','D',x);x=re.sub(MON+r' \d{4}','D',x)
  x=re.sub(r'(Last (reviewed|updated)|Reviewed by Paul Paradis on|Updated)\s*:?','',x)
  return x
import difflib
def toks(x): return re.sub(r"[^\w$%§.]+"," ",x.replace('—',' ')).lower().split()
def sents(x): return set(t for t in (' '.join(toks(p)) for p in re.split(r'(?<=[.!?])\s+|\n',x)) if t)
def changed(a,b,th=20):
  A,B=sents(a),sents(b)
  # order-free: words in sentences that appear only on one side, minus near-identical rewordings
  ad=[x for x in B-A];rm=[x for x in A-B]
  n=0
  for x in ad:
    best=max((difflib.SequenceMatcher(None,x.split(),y.split()).ratio() for y in rm),default=0)
    n+= len(x.split())*(1-best) if best>0.6 else len(x.split())
  return n>=th
def changed_old(a,b,th=20):
  a,b=toks(a),toks(b)
  if a==b: return False
  n=sum(max(i2-i1,j2-j1) for t,i1,i2,j1,j2 in difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes() if t!='equal')
  return n>=th
def show(c,f):
  r=subprocess.run(['git','show',f'{c}:{f}'],capture_output=True,text=True,errors='ignore');return r.stdout if r.returncode==0 else None
out={}
files=sorted(f for f in os.listdir('.') if f.endswith('.html'))
for f in files:
  log=subprocess.run(['git','log','--format=%H %ad','--date=format-local:%Y-%m-%d','--',f],capture_output=True,text=True,env={**os.environ,'TZ':'America/New_York'}).stdout.split('\n')
  log=[l.split() for l in log if l]
  cur=norm(open(f,errors='ignore').read());date=None
  for c,d in log:
    prev=show(c+'^',f)
    if prev is None or changed(norm(prev),norm(show(c,f))):
      date=d;break
  out[f]=date
json.dump({'_note':'Last content change per page from git history (America/New_York). Regenerate with: python3 scripts/reviewed-dates.py . data/reviewed-dates.json','dates':{k:v for k,v in out.items() if v}},open(sys.argv[2],'w'),indent=1,sort_keys=True)
import collections;print(collections.Counter(out.values()).most_common(12))

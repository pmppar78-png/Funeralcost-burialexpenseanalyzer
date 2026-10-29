# For each html page: date (America/New_York) of the latest commit where its <main> text changed,
# ignoring date strings, review/updated labels, bylines, headings, charts, section reorders,
# punctuation and dash fixes, edits under 20 words, and mechanical commits: a sentence added or
# removed in near-identical form (state and city names, numbers masked) on 5 or more pages in
# the same commit counts as boilerplate for that commit. Page-specific text keeps its date.
# Usage: python3 scripts/reviewed-dates.py REPO_ROOT data/reviewed-dates.json  (needs bs4 + lxml and full git history)
import subprocess,re,sys,json,os
from bs4 import BeautifulSoup
R=sys.argv[1];os.chdir(R)
MON='(January|February|March|April|May|June|July|August|September|October|November|December)'
def norm(h):
  s=BeautifulSoup(h,'lxml')
  for t in s(['script','style','noscript','svg','time']):t.decompose()
  for t in s.select('figure.data-chart, .article-byline, .article-meta, [class*="chart"]'):t.decompose()
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
NAMES=None
def mask(x):
  for n in NAMES: x=re.sub(r'\b'+re.escape(n)+r"(?:'s)?\b",'X',x)
  return x
def diffsets(c,f):
  prev=show(c+'^',f);cur=show(c,f)
  if prev is None or cur is None: return None
  A,B=sents(norm(prev)),sents(norm(cur));return A,B
CACHE={};TPL={}
G=4
def grams(w): return {tuple(w[i:i+G]) for i in range(len(w)-G+1)}
def added(A,B):
  # sentences new in B, minus the unchanged part of near-identical rewordings
  rm=list(A-B);out=[]
  for x in B-A:
    w=x.split();best=max(((difflib.SequenceMatcher(None,w,y.split()).ratio(),y) for y in rm),default=(0,None))
    if best[0]>0.6:
      y=best[1].split();sm=difflib.SequenceMatcher(None,y,w,autojunk=False)
      for t,i1,i2,j1,j2 in sm.get_opcodes():
        if t in('replace','insert'): out.append(w[j1:j2])
    else: out.append(w)
  return out
def commit_info(c):
  if c in TPL: return
  fl=[x for x in subprocess.run(['git','show','--format=','--name-only',c],capture_output=True,text=True).stdout.split('\n') if x.endswith('.html')]
  cnt={}
  for f in fl:
    d=diffsets(c,f)
    if d: d=[mask(' '.join(x)).split() for x in added(*d)]
    CACHE[(c,f)]=d
    if not d: continue
    for g in set().union(*[grams(w) for w in d]) if d else set(): cnt[g]=cnt.get(g,0)+1
  TPL[c]={k for k,v in cnt.items() if v>=5}
def real_change(c,f,th=20):
  # >= th words of added text that is not shared, in near-identical form, with 5+ pages of the same commit
  commit_info(c);d=CACHE.get((c,f))
  if d is None: return (c,f) not in CACHE or show(c+'^',f) is None
  mech=TPL[c];n=0
  for w in d:
    cov=[False]*len(w)
    for i in range(len(w)-G+1):
      if tuple(w[i:i+G]) in mech:
        for k in range(i,i+G): cov[k]=True
    n+=cov.count(False)
  return n>=th
out={};WHY={}
files=sorted(f for f in os.listdir('.') if f.endswith('.html'))
ST=json.load(open('data/state-facts.json'))
NAMES=sorted({n.lower() for n in ST}|{'dc','washington, dc','the district of columbia'}|{w.lower() for f in files for w in [re.sub(r'^(funeral|cremation|burial)-costs-','',f[:-5]).replace('-',' ')]},key=len,reverse=True)
for f in files:
  log=subprocess.run(['git','log','--format=%H %ad','--date=format-local:%Y-%m-%d','--',f],capture_output=True,text=True,env={**os.environ,'TZ':'America/New_York'}).stdout.split('\n')
  log=[l.split() for l in log if l]
  cur=norm(open(f,errors='ignore').read());date=None
  for c,d in log:
    if real_change(c,f):
      date=d;WHY[f]=c[:7];break
  out[f]=date
OV=json.load(open('data/reviewed-dates-overrides.json'))['dates'] if os.path.exists('data/reviewed-dates-overrides.json') else {}
for k,v in OV.items():
  if k in out and (out[k] is None or v['date']>out[k]): out[k]=v['date'];WHY[k]='override'
json.dump({'_note':'Last content change per page from git history (America/New_York). Regenerate with: python3 scripts/reviewed-dates.py . data/reviewed-dates.json','dates':{k:v for k,v in out.items() if v}},open(sys.argv[2],'w'),indent=1,sort_keys=True)
import collections;print(collections.Counter(out.values()).most_common(12))
if os.environ.get('RD_WHY'): json.dump(WHY,open(os.environ['RD_WHY'],'w'),indent=0)

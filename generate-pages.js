const fs = require('fs');
const path = require('path');
const OUT = __dirname;

// ── Data ────────────────────────────────────────────────────────
const states = [
  {name:"Alabama",abbr:"AL",slug:"alabama",region:"South",cities:["Birmingham","Montgomery","Huntsville","Mobile"],cr:"38%",f:6400,c:5200,dc:1800,b:3200},
  {name:"Alaska",abbr:"AK",slug:"alaska",region:"West",cities:["Anchorage","Fairbanks","Juneau"],cr:"72%",f:9800,c:7200,dc:2800,b:4500},
  {name:"Arizona",abbr:"AZ",slug:"arizona",region:"West",cities:["Phoenix","Tucson","Mesa","Scottsdale"],cr:"68%",f:7200,c:5800,dc:1600,b:3400},
  {name:"Arkansas",abbr:"AR",slug:"arkansas",region:"South",cities:["Little Rock","Fort Smith","Fayetteville"],cr:"42%",f:6100,c:5000,dc:1500,b:2800},
  {name:"California",abbr:"CA",slug:"california",region:"West",cities:["Los Angeles","San Francisco","San Diego","Sacramento","San Jose"],cr:"65%",f:10600,c:7800,dc:2200,b:5200},
  {name:"Colorado",abbr:"CO",slug:"colorado",region:"Mountain",cities:["Denver","Colorado Springs","Aurora","Fort Collins"],cr:"72%",f:8000,c:6200,dc:1800,b:3800},
  {name:"Connecticut",abbr:"CT",slug:"connecticut",region:"Northeast",cities:["Hartford","New Haven","Stamford","Bridgeport"],cr:"52%",f:10200,c:7600,dc:2400,b:5000},
  {name:"Delaware",abbr:"DE",slug:"delaware",region:"Northeast",cities:["Wilmington","Dover","Newark"],cr:"55%",f:8600,c:6800,dc:2000,b:4200},
  {name:"Florida",abbr:"FL",slug:"florida",region:"South",cities:["Miami","Orlando","Tampa","Jacksonville"],cr:"62%",f:7800,c:6200,dc:1800,b:3600},
  {name:"Georgia",abbr:"GA",slug:"georgia",region:"South",cities:["Atlanta","Savannah","Augusta","Columbus"],cr:"45%",f:6900,c:5600,dc:1700,b:3200},
  {name:"Hawaii",abbr:"HI",slug:"hawaii",region:"West",cities:["Honolulu","Hilo","Kailua"],cr:"70%",f:11000,c:8200,dc:3000,b:5500},
  {name:"Idaho",abbr:"ID",slug:"idaho",region:"Mountain",cities:["Boise","Meridian","Nampa"],cr:"65%",f:6700,c:5400,dc:1500,b:3000},
  {name:"Illinois",abbr:"IL",slug:"illinois",region:"Midwest",cities:["Chicago","Aurora","Naperville","Rockford"],cr:"52%",f:8500,c:6600,dc:2000,b:4200},
  {name:"Indiana",abbr:"IN",slug:"indiana",region:"Midwest",cities:["Indianapolis","Fort Wayne","Evansville"],cr:"48%",f:6900,c:5600,dc:1600,b:3200},
  {name:"Iowa",abbr:"IA",slug:"iowa",region:"Midwest",cities:["Des Moines","Cedar Rapids","Davenport"],cr:"50%",f:6700,c:5400,dc:1500,b:3000},
  {name:"Kansas",abbr:"KS",slug:"kansas",region:"Midwest",cities:["Wichita","Overland Park","Kansas City","Topeka"],cr:"50%",f:6600,c:5300,dc:1500,b:2900},
  {name:"Kentucky",abbr:"KY",slug:"kentucky",region:"South",cities:["Louisville","Lexington","Bowling Green"],cr:"40%",f:6400,c:5200,dc:1600,b:3000},
  {name:"Louisiana",abbr:"LA",slug:"louisiana",region:"South",cities:["New Orleans","Baton Rouge","Shreveport"],cr:"35%",f:6700,c:5400,dc:1700,b:3200},
  {name:"Maine",abbr:"ME",slug:"maine",region:"Northeast",cities:["Portland","Lewiston","Bangor"],cr:"75%",f:8200,c:6400,dc:1900,b:4000},
  {name:"Maryland",abbr:"MD",slug:"maryland",region:"Northeast",cities:["Baltimore","Columbia","Annapolis"],cr:"55%",f:9200,c:7000,dc:2200,b:4600},
  {name:"Massachusetts",abbr:"MA",slug:"massachusetts",region:"Northeast",cities:["Boston","Worcester","Springfield"],cr:"58%",f:10400,c:7800,dc:2500,b:5200},
  {name:"Michigan",abbr:"MI",slug:"michigan",region:"Midwest",cities:["Detroit","Grand Rapids","Ann Arbor"],cr:"58%",f:7200,c:5800,dc:1700,b:3400},
  {name:"Minnesota",abbr:"MN",slug:"minnesota",region:"Midwest",cities:["Minneapolis","St. Paul","Rochester"],cr:"62%",f:7700,c:6000,dc:1800,b:3600},
  {name:"Mississippi",abbr:"MS",slug:"mississippi",region:"South",cities:["Jackson","Gulfport","Hattiesburg"],cr:"28%",f:5900,c:4800,dc:1400,b:2600},
  {name:"Missouri",abbr:"MO",slug:"missouri",region:"Midwest",cities:["Kansas City","St. Louis","Springfield"],cr:"52%",f:6800,c:5500,dc:1600,b:3100},
  {name:"Montana",abbr:"MT",slug:"montana",region:"Mountain",cities:["Billings","Missoula","Great Falls"],cr:"72%",f:7100,c:5600,dc:1600,b:3200},
  {name:"Nebraska",abbr:"NE",slug:"nebraska",region:"Midwest",cities:["Omaha","Lincoln","Bellevue"],cr:"50%",f:6700,c:5300,dc:1500,b:3000},
  {name:"Nevada",abbr:"NV",slug:"nevada",region:"West",cities:["Las Vegas","Henderson","Reno"],cr:"72%",f:8000,c:6200,dc:1800,b:3800},
  {name:"New Hampshire",abbr:"NH",slug:"new-hampshire",region:"Northeast",cities:["Manchester","Nashua","Concord"],cr:"72%",f:8800,c:6800,dc:2100,b:4400},
  {name:"New Jersey",abbr:"NJ",slug:"new-jersey",region:"Northeast",cities:["Newark","Jersey City","Paterson"],cr:"48%",f:10200,c:7600,dc:2400,b:5000},
  {name:"New Mexico",abbr:"NM",slug:"new-mexico",region:"Mountain",cities:["Albuquerque","Las Cruces","Santa Fe"],cr:"65%",f:6400,c:5200,dc:1500,b:2800},
  {name:"New York",abbr:"NY",slug:"new-york",region:"Northeast",cities:["New York City","Buffalo","Rochester","Syracuse"],cr:"55%",f:10800,c:8000,dc:2600,b:5400},
  {name:"North Carolina",abbr:"NC",slug:"north-carolina",region:"South",cities:["Charlotte","Raleigh","Greensboro","Durham"],cr:"48%",f:7100,c:5600,dc:1700,b:3200},
  {name:"North Dakota",abbr:"ND",slug:"north-dakota",region:"Midwest",cities:["Fargo","Bismarck","Grand Forks"],cr:"55%",f:6700,c:5300,dc:1500,b:3000},
  {name:"Ohio",abbr:"OH",slug:"ohio",region:"Midwest",cities:["Columbus","Cleveland","Cincinnati","Toledo"],cr:"55%",f:7100,c:5600,dc:1700,b:3400},
  {name:"Oklahoma",abbr:"OK",slug:"oklahoma",region:"South",cities:["Oklahoma City","Tulsa","Norman"],cr:"45%",f:6100,c:5000,dc:1400,b:2700},
  {name:"Oregon",abbr:"OR",slug:"oregon",region:"West",cities:["Portland","Salem","Eugene"],cr:"78%",f:8200,c:6400,dc:1900,b:3800},
  {name:"Pennsylvania",abbr:"PA",slug:"pennsylvania",region:"Northeast",cities:["Philadelphia","Pittsburgh","Allentown"],cr:"52%",f:8500,c:6600,dc:2000,b:4200},
  {name:"Rhode Island",abbr:"RI",slug:"rhode-island",region:"Northeast",cities:["Providence","Warwick","Cranston"],cr:"58%",f:9000,c:7000,dc:2200,b:4400},
  {name:"South Carolina",abbr:"SC",slug:"south-carolina",region:"South",cities:["Charleston","Columbia","Greenville"],cr:"45%",f:6700,c:5400,dc:1600,b:3000},
  {name:"South Dakota",abbr:"SD",slug:"south-dakota",region:"Midwest",cities:["Sioux Falls","Rapid City","Aberdeen"],cr:"52%",f:6400,c:5200,dc:1500,b:2800},
  {name:"Tennessee",abbr:"TN",slug:"tennessee",region:"South",cities:["Nashville","Memphis","Knoxville","Chattanooga"],cr:"42%",f:6700,c:5400,dc:1600,b:3000},
  {name:"Texas",abbr:"TX",slug:"texas",region:"South",cities:["Houston","Dallas","San Antonio","Austin","Fort Worth"],cr:"48%",f:7200,c:5800,dc:1700,b:3400},
  {name:"Utah",abbr:"UT",slug:"utah",region:"Mountain",cities:["Salt Lake City","Provo","West Jordan"],cr:"42%",f:6900,c:5600,dc:1600,b:3200},
  {name:"Vermont",abbr:"VT",slug:"vermont",region:"Northeast",cities:["Burlington","Essex","Rutland"],cr:"72%",f:8500,c:6600,dc:2000,b:4200},
  {name:"Virginia",abbr:"VA",slug:"virginia",region:"South",cities:["Virginia Beach","Norfolk","Richmond","Arlington"],cr:"50%",f:8200,c:6400,dc:1900,b:4000},
  {name:"Washington",abbr:"WA",slug:"washington",region:"West",cities:["Seattle","Spokane","Tacoma","Vancouver"],cr:"76%",f:8800,c:6800,dc:2100,b:4200},
  {name:"West Virginia",abbr:"WV",slug:"west-virginia",region:"South",cities:["Charleston","Huntington","Morgantown"],cr:"48%",f:6100,c:5000,dc:1400,b:2700},
  {name:"Wisconsin",abbr:"WI",slug:"wisconsin",region:"Midwest",cities:["Milwaukee","Madison","Green Bay"],cr:"58%",f:7200,c:5800,dc:1700,b:3400},
  {name:"Wyoming",abbr:"WY",slug:"wyoming",region:"Mountain",cities:["Cheyenne","Casper","Laramie"],cr:"65%",f:6900,c:5600,dc:1600,b:3200}
];

const metros = [
  {city:"New York City",slug:"new-york-city",st:"New York",ss:"new-york",mp:1.3},
  {city:"Los Angeles",slug:"los-angeles",st:"California",ss:"california",mp:1.25},
  {city:"Chicago",slug:"chicago",st:"Illinois",ss:"illinois",mp:1.2},
  {city:"Houston",slug:"houston",st:"Texas",ss:"texas",mp:1.15},
  {city:"Phoenix",slug:"phoenix",st:"Arizona",ss:"arizona",mp:1.1},
  {city:"Philadelphia",slug:"philadelphia",st:"Pennsylvania",ss:"pennsylvania",mp:1.2},
  {city:"San Antonio",slug:"san-antonio",st:"Texas",ss:"texas",mp:1.05},
  {city:"San Diego",slug:"san-diego",st:"California",ss:"california",mp:1.2},
  {city:"Dallas",slug:"dallas",st:"Texas",ss:"texas",mp:1.15},
  {city:"San Jose",slug:"san-jose",st:"California",ss:"california",mp:1.3},
  {city:"Austin",slug:"austin",st:"Texas",ss:"texas",mp:1.15},
  {city:"Jacksonville",slug:"jacksonville",st:"Florida",ss:"florida",mp:1.05},
  {city:"Fort Worth",slug:"fort-worth",st:"Texas",ss:"texas",mp:1.1},
  {city:"Columbus",slug:"columbus-oh",st:"Ohio",ss:"ohio",mp:1.1},
  {city:"Charlotte",slug:"charlotte",st:"North Carolina",ss:"north-carolina",mp:1.15},
  {city:"Indianapolis",slug:"indianapolis",st:"Indiana",ss:"indiana",mp:1.1},
  {city:"San Francisco",slug:"san-francisco",st:"California",ss:"california",mp:1.35},
  {city:"Seattle",slug:"seattle",st:"Washington",ss:"washington",mp:1.25},
  {city:"Denver",slug:"denver",st:"Colorado",ss:"colorado",mp:1.15},
  {city:"Nashville",slug:"nashville",st:"Tennessee",ss:"tennessee",mp:1.15},
  {city:"Oklahoma City",slug:"oklahoma-city",st:"Oklahoma",ss:"oklahoma",mp:1.1},
  {city:"Boston",slug:"boston",st:"Massachusetts",ss:"massachusetts",mp:1.25},
  {city:"Portland",slug:"portland-or",st:"Oregon",ss:"oregon",mp:1.15},
  {city:"Las Vegas",slug:"las-vegas",st:"Nevada",ss:"nevada",mp:1.1},
  {city:"Memphis",slug:"memphis",st:"Tennessee",ss:"tennessee",mp:1.05},
  {city:"Louisville",slug:"louisville",st:"Kentucky",ss:"kentucky",mp:1.1},
  {city:"Baltimore",slug:"baltimore",st:"Maryland",ss:"maryland",mp:1.15},
  {city:"Milwaukee",slug:"milwaukee",st:"Wisconsin",ss:"wisconsin",mp:1.1},
  {city:"Albuquerque",slug:"albuquerque",st:"New Mexico",ss:"new-mexico",mp:1.1},
  {city:"Tucson",slug:"tucson",st:"Arizona",ss:"arizona",mp:1.0},
  {city:"Sacramento",slug:"sacramento",st:"California",ss:"california",mp:1.15},
  {city:"Atlanta",slug:"atlanta",st:"Georgia",ss:"georgia",mp:1.2},
  {city:"Kansas City",slug:"kansas-city",st:"Missouri",ss:"missouri",mp:1.1},
  {city:"Omaha",slug:"omaha",st:"Nebraska",ss:"nebraska",mp:1.1},
  {city:"Raleigh",slug:"raleigh",st:"North Carolina",ss:"north-carolina",mp:1.15},
  {city:"Miami",slug:"miami",st:"Florida",ss:"florida",mp:1.25},
  {city:"Minneapolis",slug:"minneapolis",st:"Minnesota",ss:"minnesota",mp:1.15},
  {city:"Tampa",slug:"tampa",st:"Florida",ss:"florida",mp:1.1},
  {city:"Tulsa",slug:"tulsa",st:"Oklahoma",ss:"oklahoma",mp:1.05},
  {city:"New Orleans",slug:"new-orleans",st:"Louisiana",ss:"louisiana",mp:1.15},
  {city:"Cleveland",slug:"cleveland",st:"Ohio",ss:"ohio",mp:1.05},
  {city:"Orlando",slug:"orlando",st:"Florida",ss:"florida",mp:1.1},
  {city:"Pittsburgh",slug:"pittsburgh",st:"Pennsylvania",ss:"pennsylvania",mp:1.1},
  {city:"Cincinnati",slug:"cincinnati",st:"Ohio",ss:"ohio",mp:1.1},
  {city:"Arlington",slug:"arlington-tx",st:"Texas",ss:"texas",mp:1.1},
  {city:"Virginia Beach",slug:"virginia-beach",st:"Virginia",ss:"virginia",mp:1.05},
  {city:"Colorado Springs",slug:"colorado-springs",st:"Colorado",ss:"colorado",mp:1.05},
  {city:"Mesa",slug:"mesa-az",st:"Arizona",ss:"arizona",mp:1.05},
  {city:"Washington DC",slug:"washington-dc",st:"Virginia",ss:"virginia",mp:1.3},
  {city:"El Paso",slug:"el-paso",st:"Texas",ss:"texas",mp:0.95}
];

const topical = [
  {fn:"medicaid-funeral-assistance.html",t:"Medicaid Funeral Assistance (2026) — State Programs &amp; Eligibility",st:"Medicaid Funeral Assistance",d:"Learn how Medicaid can help pay for funeral costs including state programs, eligibility requirements, and application steps."},
  {fn:"funeral-overcharging-protection.html",t:"Funeral Overcharging Protection (2026) — Spot &amp; Prevent Fraud",st:"Funeral Overcharging Protection",d:"Protect yourself from funeral overcharging and fraud with this guide to common tactics, legal rights, and reporting."},
  {fn:"consumer-rights-funeral-pricing.html",t:"Consumer Rights in Funeral Pricing (2026) — Your Legal Guide",st:"Consumer Rights in Funeral Pricing",d:"Understand your legal rights when purchasing funeral services under the FTC Funeral Rule and state laws."},
  {fn:"final-expense-insurance-guide.html",t:"Final Expense Insurance Guide (2026) — Plans, Costs &amp; Comparison",st:"Final Expense Insurance",d:"Compare final expense insurance plans with coverage details, costs, eligibility, and honest analysis."},
  {fn:"estate-planning-costs.html",t:"Estate Planning Costs (2026) — Wills, Trusts &amp; Budgeting",st:"Estate Planning Costs",d:"Understand estate planning costs including wills, trusts, power of attorney, and funeral pre-planning."},
  {fn:"probate-process-costs.html",t:"Probate Process &amp; Costs (2026) — Guide for Families",st:"Probate Process & Costs",d:"Learn about probate costs, timelines, and how to navigate the process after a loved one passes."},
  {fn:"funeral-payment-plans.html",t:"Funeral Payment Plans &amp; Financing (2026) — Options for Every Budget",st:"Funeral Payment Plans",d:"Explore funeral payment plans, financing options, and assistance programs for managing funeral costs."},
  {fn:"funeral-price-comparison.html",t:"How to Compare Funeral Prices (2026) — Step-by-Step Guide",st:"Compare Funeral Prices",d:"Learn how to effectively compare funeral prices using General Price Lists and smart questions."},
  {fn:"average-funeral-cost-2026.html",t:"Average Funeral Cost in 2026 — Complete National Breakdown",st:"Average Funeral Cost 2026",d:"Comprehensive guide to the average funeral cost in 2026 with national averages and regional breakdowns."},
  {fn:"cremation-jewelry-guide.html",t:"Cremation Jewelry &amp; Memorial Keepsakes (2026) — Guide",st:"Cremation Jewelry Guide",d:"Explore cremation jewelry and memorial keepsakes including types, costs, materials, and options."},
  {fn:"headstone-monument-costs.html",t:"Headstone &amp; Monument Costs (2026) — Prices &amp; Buying Guide",st:"Headstone & Monument Costs",d:"Compare headstone and monument costs with types, materials, pricing, and buying tips."},
  {fn:"funeral-flowers-guide.html",t:"Funeral Flowers Guide (2026) — Types, Etiquette &amp; Costs",st:"Funeral Flowers Guide",d:"Guide to funeral flowers including popular arrangements, etiquette, cost ranges, and alternatives."},
  {fn:"life-insurance-funeral-costs.html",t:"Using Life Insurance for Funeral Costs (2026) — How It Works",st:"Life Insurance & Funeral Costs",d:"How to use life insurance to cover funeral costs including claims process, timing, and options."},
  {fn:"crowdfunding-funeral-costs.html",t:"Crowdfunding for Funeral Costs (2026) — Platforms &amp; Tips",st:"Crowdfunding for Funerals",d:"Guide to crowdfunding for funeral expenses with best platforms, setup tips, and alternatives."},
  {fn:"military-funeral-honors.html",t:"Military Funeral Honors (2026) — Eligibility &amp; How to Request",st:"Military Funeral Honors",d:"Complete guide to military funeral honors including eligibility, types of honors, and VA benefits."},
  {fn:"infant-child-funeral-costs.html",t:"Infant &amp; Child Funeral Costs (2026) — A Gentle Guide",st:"Infant & Child Funeral Costs",d:"A compassionate guide to infant and child funeral costs, assistance programs, and family support."},
  {fn:"pet-cremation-costs.html",t:"Pet Cremation &amp; Memorial Costs (2026) — Options &amp; Prices",st:"Pet Cremation Costs",d:"Guide to pet cremation and memorial costs including individual vs communal options and pricing."},
  {fn:"funeral-costs-uninsured.html",t:"Funeral Costs When Uninsured (2026) — What Families Need to Know",st:"Funeral Costs When Uninsured",d:"What to do about funeral costs with no insurance including assistance programs and affordable options."},
  {fn:"body-donation-guide.html",t:"Body Donation Programs (2026) — How It Works &amp; Benefits",st:"Body Donation Guide",d:"Learn about whole body donation programs including the process, costs, and reputable organizations."},
  {fn:"funeral-planning-for-parents.html",t:"Planning a Funeral for Aging Parents (2026) — Step-by-Step",st:"Planning for Aging Parents",d:"Guide to planning ahead for aging parents including conversations, documenting wishes, and finances."}
];

// ── Helpers ──────────────────────────────────────────────────────
const $ = n => '$' + n.toLocaleString('en-US');
const esc = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// Stable content-update date. Bump this ONLY when real content changes ship —
// rotating lastmod/dateModified on every deploy is an anti-pattern that tells
// Google the freshness signals are synthetic, which suppresses crawling and
// indexing. Keep this tied to the real last substantive content update.
const LASTMOD = '2026-04-13';
const TODAY = LASTMOD;
const REVIEW_MONTH = new Date(LASTMOD + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

const BASE = 'https://funeralcostanalyzer.com';

// Region groupings for neighboring-state cross-links
const regionMap = {
  'South': ['Alabama','Arkansas','Florida','Georgia','Kentucky','Louisiana','Mississippi','North Carolina','Oklahoma','South Carolina','Tennessee','Texas','Virginia','West Virginia'],
  'Northeast': ['Connecticut','Delaware','Maine','Maryland','Massachusetts','New Hampshire','New Jersey','New York','Pennsylvania','Rhode Island','Vermont'],
  'Midwest': ['Illinois','Indiana','Iowa','Kansas','Michigan','Minnesota','Missouri','Nebraska','North Dakota','Ohio','South Dakota','Wisconsin'],
  'West': ['Alaska','California','Hawaii','Oregon','Washington'],
  'Mountain': ['Arizona','Colorado','Idaho','Montana','Nevada','New Mexico','Utah','Wyoming']
};

function getNeighborStates(s) {
  const region = regionMap[s.region] || [];
  return region.filter(n => n !== s.name).slice(0, 5).map(n => states.find(x => x.name === n)).filter(Boolean);
}

function neighborLinks(s, pageType) {
  const neighbors = getNeighborStates(s);
  if (!neighbors.length) return '';
  const prefix = pageType === 'cremation' ? 'cremation-costs' : pageType === 'burial' ? 'burial-costs' : 'funeral-costs';
  const label = pageType === 'cremation' ? 'Cremation' : pageType === 'burial' ? 'Burial' : 'Funeral';
  return `<div class="related-guides"><h3>${label} Costs in Nearby States</h3><ul>${neighbors.map(n => {
    const cost = pageType === 'cremation' ? $(n.dc) : pageType === 'burial' ? $(n.b) : $(n.f);
    return `<li><a href="${prefix}-${n.slug}.html">${n.name}</a> — from ${cost}</li>`;
  }).join('')}</ul></div>`;
}

function head(title, desc, filename, breadcrumbName, faqItems, parentBreadcrumb) {
  const faqSchema = faqItems && faqItems.length ? `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [${faqItems.map(q => `
      {"@type":"Question","name":"${esc(q.q)}","acceptedAnswer":{"@type":"Answer","text":"${esc(q.a)}"}}`).join(',')}
    ]
  }
  </script>` : '';

  const breadcrumbItems = parentBreadcrumb
    ? `[{"@type":"ListItem","position":1,"name":"Home","item":"${BASE}/"},{"@type":"ListItem","position":2,"name":"${esc(parentBreadcrumb.name)}","item":"${BASE}/${parentBreadcrumb.url}"},{"@type":"ListItem","position":3,"name":"${esc(breadcrumbName)}","item":"${BASE}/${filename}"}]`
    : `[{"@type":"ListItem","position":1,"name":"Home","item":"${BASE}/"},{"@type":"ListItem","position":2,"name":"${esc(breadcrumbName)}","item":"${BASE}/${filename}"}]`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${esc(desc)}" />
  <meta name="last-modified" content="${LASTMOD}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${BASE}/${filename}" />
  <meta property="og:site_name" content="Funeral Cost &amp; Burial Expense Analyzer" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <meta property="og:image" content="${BASE}/og-default.svg" />
  <meta name="twitter:image" content="${BASE}/og-default.svg" />
  <link rel="canonical" href="${BASE}/${filename}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${esc(title)}","description":"${esc(desc)}","datePublished":"2026-01-15","dateModified":"${LASTMOD}","author":{"@type":"Organization","name":"Funeral Cost & Burial Expense Analyzer","url":"${BASE}/"},"publisher":{"@type":"Organization","name":"Funeral Cost & Burial Expense Analyzer","url":"${BASE}/"},"mainEntityOfPage":{"@type":"WebPage","@id":"${BASE}/${filename}"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":${breadcrumbItems}}
  </script>${faqSchema}
</head>`;
}

function header() {
  return `
<body class="guide-body">
  <a href="#main-content" class="skip-link">Skip to main content</a>
  <header class="site-header" role="banner">
    <div class="brand-block">
      <div class="brand-accent" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="flameGrad" x1="12" y1="4" x2="12" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#ffe8b0" stop-opacity="0.95"/><stop offset="50%" stop-color="#f0c060" stop-opacity="0.9"/><stop offset="100%" stop-color="#d4943a" stop-opacity="0.85"/></linearGradient><linearGradient id="candleGrad" x1="12" y1="14" x2="12" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="rgba(255,255,255,0.85)"/><stop offset="100%" stop-color="rgba(255,255,255,0.55)"/></linearGradient></defs><ellipse cx="12" cy="10" rx="5" ry="6" fill="rgba(255,224,150,0.12)"/><path d="M12 3.5C12 3.5 8.5 8.5 8.5 11C8.5 13.2 10.1 14.5 12 14.5C13.9 14.5 15.5 13.2 15.5 11C15.5 8.5 12 3.5 12 3.5Z" fill="url(#flameGrad)"/><path d="M12 7C12 7 10.2 9.5 10.2 11C10.2 12.1 11 12.8 12 12.8C13 12.8 13.8 12.1 13.8 11C13.8 9.5 12 7 12 7Z" fill="rgba(255,255,255,0.45)"/><rect x="10.5" y="14.5" width="3" height="7" rx="1" fill="url(#candleGrad)"/><rect x="9.5" y="20.5" width="5" height="1.5" rx="0.75" fill="rgba(255,255,255,0.5)"/></svg>
      </div>
      <div class="brand-text">
        <a href="/" class="brand-link">
          <span class="brand-title">Funeral Cost &amp; Burial Expense Analyzer</span>
          <span class="brand-tagline">Clarity, dignity, and calm when you need it most</span>
        </a>
      </div>
    </div>
    <button class="mobile-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="site-nav">
      <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a href="/" class="nav-link">Home</a>
      <a href="/#calculator" class="nav-link">Calculator</a>
      <a href="chat.html" class="nav-link">AI Helper</a>
      <div class="nav-dropdown">
        <button class="nav-link nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">Guides <span class="dropdown-arrow" aria-hidden="true"></span></button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="national-funeral-cost-index.html" class="nav-dropdown-link" role="menuitem">National Cost Index</a>
          <a href="funeral-costs-by-state.html" class="nav-dropdown-link" role="menuitem">Funeral Costs by State</a>
          <a href="cremation-costs-by-state.html" class="nav-dropdown-link" role="menuitem">Cremation Costs by State</a>
          <a href="burial-costs-by-state.html" class="nav-dropdown-link" role="menuitem">Burial Costs by State</a>
          <a href="cremation-vs-burial-cost.html" class="nav-dropdown-link" role="menuitem">Cremation vs. Burial</a>
          <a href="average-funeral-cost-2026.html" class="nav-dropdown-link" role="menuitem">Average Cost 2026</a>
          <a href="direct-cremation-cost.html" class="nav-dropdown-link" role="menuitem">Direct Cremation Cost</a>
          <a href="funeral-cost-breakdown.html" class="nav-dropdown-link" role="menuitem">Cost Breakdown</a>
          <a href="cheap-funeral-options.html" class="nav-dropdown-link" role="menuitem">Affordable Funeral Options</a>
          <a href="funeral-payment-assistance.html" class="nav-dropdown-link" role="menuitem">Payment Assistance</a>
          <a href="veteran-burial-benefits.html" class="nav-dropdown-link" role="menuitem">Veteran Benefits</a>
          <a href="ftc-funeral-rule-guide.html" class="nav-dropdown-link" role="menuitem">FTC Funeral Rule</a>
          <a href="funeral-insurance-guide.html" class="nav-dropdown-link" role="menuitem">Funeral Insurance</a>
          <a href="green-burial-options.html" class="nav-dropdown-link" role="menuitem">Green Burial</a>
          <a href="planning-checklist.html" class="nav-dropdown-link" role="menuitem">Planning Checklist</a>
        </div>
      </div>
      <a href="contact.html" class="nav-link">Contact</a>
    </nav>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-accent" aria-hidden="true"></div>
      <p class="footer-text">Information only &middot; Not financial, legal, tax, medical, or funeral-director advice &middot; Always review decisions with licensed professionals.</p>
      <p class="footer-text small">Some links on this site are affiliate links. We may earn a commission if you make a purchase — at no extra cost to you. This never affects our content or recommendations.</p>
      <p class="footer-text small">&copy; 2026 Funeral Cost &amp; Burial Expense Analyzer. Cost data is based on publicly available consumer surveys and may not reflect current prices in your area.</p>
      <div class="footer-links">
        <a href="about.html">About</a>
        <a href="funeral-costs-by-state.html">Funeral Costs by State</a>
        <a href="cremation-costs-by-state.html">Cremation Costs by State</a>
        <a href="burial-costs-by-state.html">Burial Costs by State</a>
        <a href="average-funeral-cost-2026.html">Average Funeral Cost 2026</a>
        <a href="direct-cremation-cost.html">Direct Cremation Cost</a>
        <a href="cheap-funeral-options.html">Affordable Funeral Options</a>
        <a href="cremation-vs-burial-cost.html">Cremation vs. Burial</a>
        <a href="how-to-pay-for-a-funeral-with-no-money.html">Pay for a Funeral With No Money</a>
        <a href="national-funeral-cost-index.html">National Cost Index</a>
        <a href="planning-checklist.html">Planning Checklist</a>
        <a href="funeral-insurance-guide.html">Funeral Insurance</a>
        <a href="veteran-burial-benefits.html">Veteran Benefits</a>
        <a href="editorial-standards.html">Editorial Standards</a>
        <a href="privacy-policy.html">Privacy Policy</a>
        <a href="terms-of-service.html">Terms of Service</a>
        <a href="disclaimer.html">Disclaimer</a>
        <a href="grief-resources.html">Grief Resources</a>
        <a href="contact.html">Contact</a>
        <a href="sitemap-index.html">Site Map</a>
        <a href="sitemap.xml">XML Sitemap</a>
      </div>
      <div class="footer-sources">
        <p class="footer-text small"><strong>Media &amp; Sources:</strong> Our funeral cost data is compiled from the <a href="https://nfda.org" target="_blank" rel="noopener noreferrer">National Funeral Directors Association (NFDA)</a>, the <a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer">Funeral Consumers Alliance (FCA)</a>, the <a href="https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-revised-rule" target="_blank" rel="noopener noreferrer">Federal Trade Commission Funeral Rule</a>, state funeral regulatory boards, and publicly available consumer price surveys. For our full research methodology, see our <a href="editorial-standards.html">Editorial Standards</a>.</p>
      </div>
    </div>
  </footer>
  <script>
(function(){var t=document.querySelector(".mobile-nav-toggle"),n=document.getElementById("site-nav");if(t&&n){t.addEventListener("click",function(){var o=n.classList.toggle("nav-open");t.setAttribute("aria-expanded",o?"true":"false")});n.querySelectorAll(".nav-link").forEach(function(l){l.addEventListener("click",function(){n.classList.remove("nav-open");t.setAttribute("aria-expanded","false")})})}var d=document.querySelectorAll(".nav-dropdown-toggle");d.forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();var p=this.closest(".nav-dropdown");var o=p.classList.toggle("dropdown-open");this.setAttribute("aria-expanded",o?"true":"false")})});document.addEventListener("click",function(){document.querySelectorAll(".nav-dropdown.dropdown-open").forEach(function(x){x.classList.remove("dropdown-open");x.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded","false")})})})();
  </script>
  <script>
(function(){
  if(typeof gtag!=='function')return;
  // Track affiliate link clicks (rel="sponsored")
  document.querySelectorAll('a[rel*="sponsored"]').forEach(function(a){
    a.addEventListener('click',function(){
      gtag('event','affiliate_click',{link_url:this.href,link_text:this.textContent.trim().substring(0,50),partner:this.hostname||'unknown',page_path:location.pathname});
    });
  });
  // Track CTA clicks
  document.querySelectorAll('.btn-primary,.cta-banner a,.btn-hero').forEach(function(a){
    a.addEventListener('click',function(){
      gtag('event','cta_click',{link_url:this.href||'',link_text:this.textContent.trim().substring(0,50),page_path:location.pathname});
    });
  });
  // Track outbound link clicks
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){
    if(a.getAttribute('rel')&&a.getAttribute('rel').indexOf('sponsored')>-1)return;
    a.addEventListener('click',function(){
      gtag('event','outbound_click',{link_url:this.href,link_text:this.textContent.trim().substring(0,50),page_path:location.pathname});
    });
  });
  // Track Netlify form submissions
  document.querySelectorAll('form[data-netlify="true"]').forEach(function(f){
    f.addEventListener('submit',function(){
      gtag('event','form_submit',{form_name:this.getAttribute('name')||'unknown',page_path:location.pathname});
    });
  });
})();
  </script>
</body>
</html>`;
}

function resources(type) {
  const costCluster = `<div class="resource-suggestions"><h3>Compare Funeral Costs</h3><ul class="resource-list"><li><a href="average-funeral-cost-2026.html">Average Funeral Cost in 2026</a><span class="resource-desc">National cost breakdown with real prices</span></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Cost Comparison</a><span class="resource-desc">Side-by-side price comparison to help you decide</span></li><li><a href="funeral-cost-breakdown.html">Funeral Cost Breakdown</a><span class="resource-desc">Every line item explained — know what you're paying for</span></li><li><a href="cheap-funeral-options.html">Cheapest Funeral Options</a><span class="resource-desc">Affordable alternatives that can save thousands</span></li><li><a href="direct-cremation-cost.html">Direct Cremation — Most Affordable Option</a><span class="resource-desc">From $1,000 — the lowest-cost disposition choice</span></li><li><a href="funeral-price-comparison.html">How to Compare Funeral Prices</a><span class="resource-desc">Step-by-step guide to getting the best price</span></li></ul></div>`;
  const all = {
    general: `<div class="resource-suggestions"><h3>Resources That May Help</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a><span class="resource-desc">Independent consumer advocacy for funeral rights</span></li><li><a href="https://www.parting.com" target="_blank" rel="noopener noreferrer sponsored">Parting.com</a><span class="resource-desc">Compare funeral home prices in your area</span></li><li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a><span class="resource-desc">Compare final expense and burial insurance options</span></li><li><a href="best-burial-insurance.html">Best Burial Insurance Companies</a><span class="resource-desc">Side-by-side comparison of top burial insurance providers</span></li><li><a href="funeral-payment-assistance.html">Payment Assistance Guide</a><span class="resource-desc">Government programs and financial help for funeral costs</span></li><li><a href="funeral-insurance-comparison.html">Insurance Plan Comparison</a><span class="resource-desc">Compare coverage, premiums, and payout speed across providers</span></li></ul></div>` + costCluster,
    cremation: `<div class="resource-suggestions"><h3>Cremation Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a><span class="resource-desc">Compare cremation providers and prices</span></li><li><a href="cremation-jewelry-guide.html">Cremation Jewelry Guide</a><span class="resource-desc">Memorial keepsakes and remembrance options</span></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Costs</a><span class="resource-desc">Side-by-side cost comparison</span></li><li><a href="urn-buying-guide.html">Urn Buying Guide</a><span class="resource-desc">Types, prices, and how to choose the right urn</span></li><li><a href="pet-cremation-costs.html">Pet Cremation Costs</a><span class="resource-desc">Options and prices for pet cremation and memorials</span></li><li><a href="final-expense-insurance-guide.html">Final Expense Insurance</a><span class="resource-desc">Coverage options to help pay for cremation costs</span></li></ul></div>` + costCluster,
    burial: `<div class="resource-suggestions"><h3>Burial Resources</h3><ul class="resource-list"><li><a href="https://www.parting.com" target="_blank" rel="noopener noreferrer sponsored">Parting.com</a><span class="resource-desc">Compare burial costs from local providers</span></li><li><a href="headstone-monument-costs.html">Headstone &amp; Monument Guide</a><span class="resource-desc">Costs, types, and buying tips</span></li><li><a href="green-burial-options.html">Green Burial Options</a><span class="resource-desc">Eco-friendly and natural alternatives</span></li><li><a href="best-online-casket-retailers.html">Best Online Casket Retailers</a><span class="resource-desc">Save 50-70% buying caskets online</span></li><li><a href="best-burial-insurance.html">Best Burial Insurance</a><span class="resource-desc">Compare plans to cover burial expenses</span></li></ul></div>` + costCluster
  };
  return all[type] || all.general;
}

function relatedGuides(exclude) {
  const guides = [
    {h:'average-funeral-cost-2026.html',t:'Average Funeral Cost in 2026 — National Breakdown'},
    {h:'funeral-cost-breakdown.html',t:'Funeral Cost Breakdown — Every Line Item Explained'},
    {h:'cremation-vs-burial-cost.html',t:'Cremation vs. Burial Costs — Side-by-Side Comparison'},
    {h:'cheap-funeral-options.html',t:'Cheapest Funeral Options (Save Thousands)'},
    {h:'how-to-pay-for-a-funeral-with-no-money.html',t:'How to Pay for a Funeral With No Money'},
    {h:'direct-cremation-cost.html',t:'Direct Cremation Cost — Most Affordable Option'},
    {h:'funeral-costs-by-state.html',t:'Funeral Costs by State — All 50 States'},
    {h:'cremation-costs-by-state.html',t:'Cremation Costs by State'},
    {h:'burial-costs-by-state.html',t:'Burial Costs by State'},
    {h:'best-burial-insurance.html',t:'Best Burial Insurance Companies (2026)'},
    {h:'funeral-insurance-comparison.html',t:'Funeral Insurance Comparison — Plans &amp; Pricing'},
    {h:'funeral-price-comparison.html',t:'How to Compare Funeral Prices (Step-by-Step)'},
    {h:'funeral-insurance-guide.html',t:'Funeral Insurance Guide'},
    {h:'final-expense-insurance-guide.html',t:'Final Expense Insurance Guide'},
    {h:'prepaid-funeral-plans-comparison.html',t:'Prepaid Funeral Plans Compared'},
    {h:'national-funeral-cost-index.html',t:'2026 National Funeral Cost Index'},
    {h:'funeral-payment-assistance.html',t:'Payment Assistance Programs'},
    {h:'what-to-do-when-someone-dies.html',t:'What to Do When Someone Dies'},
    {h:'ftc-funeral-rule-guide.html',t:'FTC Funeral Rule — Your Consumer Rights'},
    {h:'veteran-burial-benefits.html',t:'Veteran Burial Benefits'},
    {h:'planning-checklist.html',t:'Funeral Planning Checklist'},
    {h:'funeral-costs-rising-2026.html',t:'Why Funeral Costs Are Rising in 2026'},
    {h:'funeral-costs-uninsured.html',t:'Funeral Costs When Uninsured'},
    {h:'funeral-planning-for-parents.html',t:'Planning a Funeral for Aging Parents'},
    {h:'infant-child-funeral-costs.html',t:'Infant &amp; Child Funeral Costs'},
    {h:'military-funeral-honors.html',t:'Military Funeral Honors Guide'},
    {h:'funeral-costs-by-religion.html',t:'Funeral Costs by Religion'},
    {h:'burial-insurance-seniors.html',t:'Burial Insurance for Seniors'},
    {h:'cremation-insurance-guide.html',t:'Cremation Insurance Guide'},
    {h:'funeral-financing-options.html',t:'Funeral Financing Options'},
    {h:'questions-to-ask-funeral-home.html',t:'Questions to Ask Funeral Homes'},
    {h:'what-funeral-homes-dont-tell-you.html',t:'What Funeral Homes Don\'t Tell You'},
    {h:'social-security-death-benefit.html',t:'Social Security Death Benefit'},
    {h:'medicaid-funeral-assistance.html',t:'Medicaid Funeral Assistance'},
    {h:'green-burial-options.html',t:'Green Burial Options — Eco-Friendly &amp; Affordable'},
    {h:'home-funeral-guide.html',t:'Home Funeral Guide'},
    {h:'casket-buying-guide.html',t:'Casket Buying Guide — Save 50-70%'},
    {h:'urn-buying-guide.html',t:'Urn Buying Guide'},
    {h:'headstone-monument-costs.html',t:'Headstone &amp; Monument Costs'},
    {h:'cremation-jewelry-guide.html',t:'Cremation Jewelry Guide'},
    {h:'consumer-rights-funeral-pricing.html',t:'Consumer Rights in Funeral Pricing'},
    {h:'funeral-overcharging-protection.html',t:'Funeral Overcharging Protection'},
    {h:'funeral-flowers-guide.html',t:'Funeral Flowers Guide — Costs &amp; Etiquette'},
    {h:'funeral-cost-widget.html',t:'Embeddable Funeral Cost Widget'}
  ].filter(g => g.h !== exclude);

  // Prioritize cremation-related guides for cremation pages, burial for burial pages
  let sorted = guides;
  if (exclude && exclude.includes('cremation')) {
    sorted = guides.sort((a, b) => {
      const aRel = a.h.includes('cremation') || a.h.includes('urn') ? 0 : 1;
      const bRel = b.h.includes('cremation') || b.h.includes('urn') ? 0 : 1;
      return aRel - bRel;
    });
  } else if (exclude && exclude.includes('burial')) {
    sorted = guides.sort((a, b) => {
      const aRel = a.h.includes('burial') || a.h.includes('casket') || a.h.includes('headstone') || a.h.includes('cemetery') ? 0 : 1;
      const bRel = b.h.includes('burial') || b.h.includes('casket') || b.h.includes('headstone') || b.h.includes('cemetery') ? 0 : 1;
      return aRel - bRel;
    });
  }

  return `<div class="related-guides"><h3>Related Guides</h3><ul>${sorted.slice(0,15).map(g=>`<li><a href="${g.h}">${g.t}</a></li>`).join('')}</ul></div>`;
}

function ctaBanner() {
  return `<div class="cta-banner">
        <h3>Calculate Your Funeral Costs — Free Tools</h3>
        <p>Use our free calculator to estimate funeral costs in your area, compare cremation vs. burial prices, and find ways to save thousands.</p>
        <div class="cta-actions">
          <a href="chat.html" class="btn-primary">Ask Our AI Cost Expert</a>
          <a href="/#calculator" class="btn-secondary">Calculate Funeral Cost</a>
        </div>
      </div>`;
}

// ── State Pages ─────────────────────────────────────────────────
function genState(s) {
  const fn = `funeral-costs-${s.slug}.html`;
  const title = `Funeral Cost in ${s.name} (2026) — ${$(s.dc)} to ${$(s.f)} | Full Price Breakdown`;
  const desc = `How much does a funeral cost in ${s.name} in 2026? Real prices: traditional burial ${$(s.f)}, cremation ${$(s.c)}, direct cremation from ${$(s.dc)}. See the full ${s.name} cost breakdown, hidden fees to avoid, and proven ways to save thousands.`;
  const regionCtx = {
    'South': {priceCtx:'below the national average, reflecting the lower cost of living in the region', regNote:'Many Southern families have strong traditions around homegoing services and church-based funerals, which can affect service choices and costs.', embalmNote:'Some Southern funeral homes may emphasize traditional open-casket services, but embalming remains optional by law in most cases.'},
    'Northeast': {priceCtx:'above the national average due to higher costs of living, real estate, and labor in the region', regNote:'The Northeast has a higher concentration of funeral homes per capita, which can give families more options for comparison shopping.', embalmNote:'Some Northeastern states have specific regulations around timeframes for disposition. Check with your local funeral board for current requirements.'},
    'Midwest': {priceCtx:'near or slightly below the national average, reflecting moderate costs of living across the region', regNote:'Midwestern communities often have strong local funeral home traditions, and independent providers may offer more competitive pricing than national chains.', embalmNote:'Midwestern states generally follow standard embalming laws — it is not legally required in most circumstances, though providers may require it for public viewings.'},
    'West': {priceCtx:'above the national average in most metro areas, though rural communities may see lower prices', regNote:'Western states tend to have higher cremation rates, and the availability of green burial and alternative disposition options is growing across the region.', embalmNote:'Western states generally have progressive disposition laws, and many communities offer a wider range of alternatives to traditional embalming and burial.'},
    'Mountain': {priceCtx:'moderate, typically near or below the national average despite varying costs of living across the region', regNote:'Mountain states often have more dispersed populations, which can mean fewer funeral home options in rural areas — making price comparison especially important.', embalmNote:'Mountain states generally do not require embalming, and some have progressive laws around home funerals and natural burial options.'}
  };
  const rc = regionCtx[s.region] || regionCtx['South'];
  const natAvg = 7848;
  const diff = s.f - natAvg;
  const pctDiff = Math.abs(Math.round((diff / natAvg) * 100));
  const priceComp = diff > 500 ? `${pctDiff}% above` : diff < -500 ? `${pctDiff}% below` : 'near';

  const faq = [
    {q:`How much does a funeral cost in ${s.name}?`,a:`The average traditional funeral in ${s.name} costs approximately ${$(s.f)}, which is ${priceComp} the national average of $7,848. Cremation with service averages ${$(s.c)}, while direct cremation starts around ${$(s.dc)}. Cemetery plot and burial fees add approximately ${$(s.b)}. Prices vary by city and provider within ${s.name} — requesting General Price Lists from multiple funeral homes is the most reliable way to compare.`},
    {q:`Is cremation cheaper than burial in ${s.name}?`,a:`Yes. In ${s.name}, direct cremation (${$(s.dc)}) can save families ${$(s.f - s.dc)} or more compared to a traditional funeral with burial (${$(s.f)} plus cemetery costs). The cremation rate in ${s.name} is currently ${s.cr}, ${parseInt(s.cr)>55?'above':'near'} the national average of approximately 60%. ${rc.regNote}`},
    {q:`What are my consumer rights at ${s.name} funeral homes?`,a:`The FTC Funeral Rule protects all consumers in ${s.name}. Every funeral home must provide an itemized General Price List upon request, allow you to select only the services you want (no forced packages), accept caskets purchased elsewhere without additional fees, and refrain from misrepresenting legal requirements. ${s.name} may also have state-specific consumer protections — contact your state funeral regulatory board for details.`},
    {q:`How can I save on funeral costs in ${s.name}?`,a:`The most effective way to reduce funeral costs in ${s.name} is to compare General Price Lists from at least 2-3 providers in your area. Additional strategies: consider direct cremation at ${$(s.dc)} for the most affordable option, purchase caskets online or from independent retailers (savings of 50-70% are common), check eligibility for veteran burial benefits or Medicaid funeral assistance, and ask funeral homes about basic or simple service packages.`},
    {q:`Does ${s.name} require embalming?`,a:`${s.name} does not legally require embalming in most circumstances. Embalming is a choice, not a legal requirement, though some funeral homes may require it as a matter of policy for open-casket viewings. Refrigeration is typically available as an alternative. ${rc.embalmNote} Under the FTC Funeral Rule, providers cannot claim embalming is legally required without citing specific legal authority.`},
    {q:`How do funeral costs in ${s.name} compare to other states?`,a:`Funeral costs in ${s.name} are ${rc.priceCtx}. At ${$(s.f)} for a traditional funeral, ${s.name} ranks ${priceComp} the national median of $7,848. The ${s.region} region generally sees ${s.region === 'Northeast' || s.region === 'West' ? 'higher' : 'moderate to lower'} costs compared to other parts of the country. See our state-by-state comparison for detailed pricing across all 50 states.`},
    {q:`What is the cheapest funeral option in ${s.name}?`,a:`The cheapest funeral option in ${s.name} is direct cremation at approximately ${$(s.dc)}. This includes only transportation, cremation, and return of ashes — no viewing, ceremony, or embalming. Families can hold a memorial service separately at any location. Direct burial (no viewing or ceremony) is the next most affordable at approximately ${$(Math.round(s.f*0.6))}. For more options, see our affordable funeral guide.`},
    {q:`How can I find affordable funeral homes in ${s.name}?`,a:`To find affordable funeral homes in ${s.name}: request General Price Lists from at least 3 providers and compare line items; check with the Funeral Consumers Alliance for local recommendations; consider direct cremation providers which often offer the lowest rates; ask about simple or basic service packages; and look into nonprofit or cooperative funeral homes in your area of ${s.name}.`}
  ];

  const cityLinks = s.cities.map(c => {
    const m = metros.find(x => x.city === c);
    return m ? `<a href="funeral-costs-${m.slug}.html" class="state-card"><span class="state-name">${c}</span><span class="state-cost">From ${$(Math.round(s.f*m.mp))}</span></a>` : `<span class="state-card"><span class="state-name">${c}</span><span class="state-cost">~${$(s.f)}</span></span>`;
  }).join('');

  const content = `${head(title, desc, fn, `Funeral Costs in ${s.name}`, faq, {name:'Funeral Costs by State',url:'funeral-costs-by-state.html'})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="funeral-costs-by-state.html">Costs by State</a> &rsaquo; <span aria-current="page">${s.name}</span>
      </nav>

      <h1>Funeral Costs in ${s.name}: What Families Pay in 2026</h1>

      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, FCA, ${s.name} Funeral Board</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Region:</span> <span class="article-meta-value">${s.region}</span></span>
      </div>

      <p class="guide-intro">If you are planning a funeral in ${s.name}, understanding the typical costs can help you make informed decisions during a difficult time. This guide covers average prices for traditional funerals, cremation, and burial in ${s.name}, along with your consumer rights, ways to save, and local resources. Every family's situation is unique, and there is no single right answer — only what feels right for you and your loved ones.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(s.f)}</span><span class="stat-label">Avg. Traditional Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(s.c)}</span><span class="stat-label">Avg. Cremation Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(s.dc)}</span><span class="stat-label">Direct Cremation</span></div>
        <div class="stat-box"><span class="stat-number">${s.cr}</span><span class="stat-label">Cremation Rate</span></div>
      </div>

      <div class="callout callout-info"><strong>2026 ${s.name} Funeral Cost Update:</strong> Funeral costs in ${s.name} have risen approximately 4–6% since 2024. The average traditional funeral now costs <strong>${$(s.f)}</strong> (national average: $7,848). Direct cremation remains the most affordable option at <strong>${$(s.dc)}</strong>. <a href="average-funeral-cost-2026.html">See the full 2026 national funeral cost report</a> | <a href="funeral-costs-rising-2026.html">Why funeral costs are rising</a></div>

      <h2 id="cost-breakdown">Funeral Cost Breakdown in ${s.name}</h2>
      <p>The following table shows the average costs for common funeral services in ${s.name}. These figures are based on data from the National Funeral Directors Association, state funeral boards, and consumer surveys. Individual prices will vary depending on the provider, location within the state, and specific services chosen.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${s.name} Funeral Cost Averages (2026)</caption>
          <thead><tr><th>Service</th><th>Average Cost</th><th>Range</th></tr></thead>
          <tbody>
            <tr><td>Traditional funeral with burial</td><td class="cost-value">${$(s.f)}</td><td>${$(Math.round(s.f*0.75))} – ${$(Math.round(s.f*1.3))}</td></tr>
            <tr><td>Funeral with cremation</td><td class="cost-value">${$(s.c)}</td><td>${$(Math.round(s.c*0.8))} – ${$(Math.round(s.c*1.25))}</td></tr>
            <tr><td>Direct cremation</td><td class="cost-value">${$(s.dc)}</td><td>${$(Math.round(s.dc*0.7))} – ${$(Math.round(s.dc*1.4))}</td></tr>
            <tr><td>Cemetery / burial plot</td><td class="cost-value">${$(s.b)}</td><td>${$(Math.round(s.b*0.6))} – ${$(Math.round(s.b*1.8))}</td></tr>
            <tr><td>Embalming</td><td class="cost-value">${$(Math.round(s.f*0.1))}</td><td>${$(Math.round(s.f*0.07))} – ${$(Math.round(s.f*0.15))}</td></tr>
            <tr><td>Casket</td><td class="cost-value">${$(Math.round(s.f*0.3))}</td><td>${$(Math.round(s.f*0.12))} – ${$(Math.round(s.f*0.65))}</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="cost-factors">What Drives Funeral Costs in ${s.name}</h2>
      <p>Funeral costs in ${s.name} are influenced by several factors. The ${s.region} region of the United States tends to have ${s.f > 8000 ? 'higher' : s.f > 7000 ? 'moderate' : 'lower'}-than-average funeral costs compared to the national median of $7,848. Within ${s.name}, you will find significant price differences between urban and rural areas, with metropolitan areas generally costing 10% to 30% more than small towns.</p>
      <p>The cost of living in ${s.name}, local competition among funeral providers, state regulations, cultural traditions, and real estate prices all play a role in determining what families pay. The cremation rate of ${s.cr} in ${s.name} also affects the market — areas with higher cremation rates often see more competitive pricing for cremation services.</p>

      <h2 id="hidden-fees">Hidden Funeral Fees in ${s.name} — What to Watch For</h2>
      <p>Many ${s.name} families are surprised by charges that appear after the initial quote. Here are the most common hidden funeral fees to watch for:</p>
      <ul>
        <li><strong>Casket handling fee</strong> — Some funeral homes add a surcharge for caskets purchased elsewhere, despite this being illegal under the FTC Funeral Rule</li>
        <li><strong>Mandatory embalming</strong> — Funeral homes may claim embalming is required. In ${s.name}, it is almost never legally required. <a href="consumer-rights-funeral-pricing.html">Know your rights</a></li>
        <li><strong>Cemetery "perpetual care" fees</strong> — An ongoing maintenance charge, typically $200–$1,000, added on top of the plot price</li>
        <li><strong>Vault/liner surcharge</strong> — Cemeteries may require a specific vault brand or type, inflating costs by $500–$2,000+</li>
        <li><strong>Documentation and filing fees</strong> — Death certificates, permits, and filing fees can add $200–$600</li>
        <li><strong>Weekend/holiday premium</strong> — Services held outside business hours may carry a 15–25% surcharge</li>
        <li><strong>"Package" markups</strong> — Bundled packages often include services you don't need. Always compare line-by-line. <a href="what-funeral-homes-dont-tell-you.html">What funeral homes don't tell you</a></li>
      </ul>
      <div class="callout callout-tip"><strong>Protect Yourself:</strong> Request a <a href="funeral-price-comparison.html">General Price List (GPL)</a> from every provider. Compare at least 3 funeral homes in ${s.name} before committing. Use our <a href="funeral-cost-comparison-worksheet.html">free comparison worksheet</a> to organize quotes.</div>

      <h2 id="cheapest-options">Cheapest Funeral Options in ${s.name} (2026)</h2>
      <p>If cost is your primary concern, here are the most affordable funeral options in ${s.name}, ranked from least to most expensive:</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Most Affordable Funeral Options in ${s.name}</caption>
          <thead><tr><th>Option</th><th>Estimated Cost</th><th>What's Included</th></tr></thead>
          <tbody>
            <tr><td><strong><a href="direct-cremation-cost.html">Direct cremation</a></strong></td><td class="cost-value">${$(s.dc)}</td><td>Transport, cremation, return of ashes — no viewing or ceremony</td></tr>
            <tr><td><strong>Direct burial</strong></td><td class="cost-value">${$(Math.round(s.f * 0.5))}</td><td>Burial without viewing or ceremony — simplest burial option</td></tr>
            <tr><td><strong><a href="green-burial-options.html">Green burial</a></strong></td><td class="cost-value">${$(Math.round(s.f * 0.55))}</td><td>Biodegradable container, no embalming — eco-friendly and affordable</td></tr>
            <tr><td><strong>Cremation + memorial</strong></td><td class="cost-value">${$(s.c)}</td><td>Cremation followed by a separate memorial service</td></tr>
            <tr><td><strong>Traditional funeral</strong></td><td class="cost-value">${$(s.f)}</td><td>Full service with viewing, ceremony, and burial</td></tr>
          </tbody>
        </table>
      </div>
      <p>For more strategies, see our guides on <a href="cheap-funeral-options.html">affordable funeral options</a> and <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>.</p>

      <h2 id="cities">Major Cities in ${s.name}</h2>
      <p>Funeral costs vary across ${s.name}'s major metropolitan areas. Urban centers typically have higher overhead costs, which are reflected in funeral pricing. Here are the major cities in ${s.name}:</p>
      <div class="state-grid">${cityLinks}</div>

      <h2 id="cremation-vs-burial">Cremation vs. Burial in ${s.name}</h2>
      <div class="comparison-grid">
        <div class="comparison-card"><h3>Cremation</h3><div class="price-range">${$(s.dc)} – ${$(s.c)}</div><ul><li>Direct cremation from ${$(s.dc)}</li><li>Cremation with service from ${$(s.c)}</li><li>No cemetery plot required</li><li>More flexible memorial options</li><li>Current rate: ${s.cr} of families</li></ul></div>
        <div class="comparison-card"><h3>Traditional Burial</h3><div class="price-range">${$(Math.round(s.f*0.75))} – ${$(Math.round(s.f*1.3))}</div><ul><li>Traditional service from ${$(s.f)}</li><li>Cemetery plot from ${$(s.b)}</li><li>Vault or liner typically required</li><li>Permanent memorial location</li><li>Casket from ${$(Math.round(s.f*0.12))}</li></ul></div>
      </div>

      <h2 id="detailed-guides">Detailed ${s.name} Cost Guides</h2>
      <p>For deeper analysis on specific disposition types in ${s.name}, see our dedicated guides:</p>
      <div class="comparison-grid">
        <div class="comparison-card"><h3><a href="cremation-costs-${s.slug}.html">Cremation Costs in ${s.name}</a></h3><p>Complete guide to cremation pricing in ${s.name} including direct cremation from ${$(s.dc)}, cremation with service from ${$(s.c)}, urn options, scattering regulations, and memorial alternatives. The cremation rate in ${s.name} is ${s.cr}.</p><p><a href="cremation-costs-${s.slug}.html"><strong>See ${s.name} cremation prices &rarr;</strong></a></p></div>
        <div class="comparison-card"><h3><a href="burial-costs-${s.slug}.html">Burial Costs in ${s.name}</a></h3><p>Detailed breakdown of burial expenses in ${s.name} including cemetery plots from ${$(s.b)}, caskets, vaults, headstones, and opening/closing fees. Total burial costs in ${s.name} range from ${$(Math.round(s.f + s.b + s.b*0.9))} to ${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))}.</p><p><a href="burial-costs-${s.slug}.html"><strong>See ${s.name} burial prices &rarr;</strong></a></p></div>
      </div>

      <h2 id="consumer-rights">Your Consumer Rights in ${s.name}</h2>
      <div class="callout callout-info"><strong>Know Your Rights Under the FTC Funeral Rule</strong> Every funeral home in ${s.name} must comply with the Federal Trade Commission's Funeral Rule, which protects consumers nationwide. You have the right to: receive an itemized General Price List before making any decisions; choose only the services and products you want; purchase a casket or urn from a third party without penalty; decline embalming unless required by state law for specific circumstances; and receive a written estimate before services are performed.</div>
      <p>If you believe a funeral home in ${s.name} has violated these rights, you can file a complaint with the FTC at <a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer">ftc.gov</a> or contact the <a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a> for guidance. Your state attorney general's office can also assist with consumer protection complaints.</p>

      <h2 id="payment-help">Payment Assistance in ${s.name}</h2>
      <p>If funeral costs in ${s.name} feel overwhelming, there are several assistance options to explore:</p>
      <ul>
        <li><strong>Social Security death benefit</strong> — A one-time $255 payment for eligible surviving spouses or children. <a href="social-security-death-benefit.html">Learn more</a></li>
        <li><strong>Veteran burial benefits</strong> — If the deceased served in the military, burial allowances, free cemetery plots, and headstones may be available. <a href="veteran-burial-benefits.html">Veteran benefits guide</a></li>
        <li><strong>State assistance programs</strong> — ${s.name} may offer funeral assistance through Medicaid or county indigent burial programs. <a href="medicaid-funeral-assistance.html">Medicaid funeral assistance</a></li>
        <li><strong>Burial insurance</strong> — Final expense policies can cover funeral costs from $5,000 to $25,000. <a href="best-burial-insurance.html">Compare the best burial insurance companies</a></li>
        <li><strong>Crowdfunding</strong> — Platforms like GoFundMe are increasingly used to cover funeral costs. <a href="crowdfunding-funeral-costs.html">Crowdfunding guide</a></li>
        <li><strong>Payment plans</strong> — Some funeral homes offer financing or installment plans. <a href="funeral-payment-plans.html">Payment plan options</a></li>
      </ul>
      <p>For a complete overview of all financial assistance options, see our <a href="how-to-pay-for-a-funeral-with-no-money.html">guide to paying for a funeral with no money</a>.</p>

      ${resources('general')}

      <h2 id="what-to-do">What to Do When Planning a Funeral in ${s.name}</h2>
      <p>If you are currently arranging a funeral in ${s.name}, here is a step-by-step approach that can save you time, stress, and money:</p>
      <ol>
        <li><strong>Take a breath.</strong> Unless there are legal or medical time constraints, you typically have 24–72 hours before decisions must be finalized.</li>
        <li><strong>Request General Price Lists</strong> from at least 2–3 funeral homes in your area of ${s.name}. They are legally required to provide them. <a href="questions-to-ask-funeral-home.html">Questions to ask funeral homes</a></li>
        <li><strong>Decide on disposition:</strong> <a href="cremation-costs-${s.slug}.html">cremation in ${s.name}</a> or <a href="burial-costs-${s.slug}.html">burial in ${s.name}</a>. This is the single biggest cost decision.</li>
        <li><strong>Choose only the services you need.</strong> Embalming, premium caskets, and elaborate arrangements are optional. <a href="what-funeral-homes-dont-tell-you.html">What funeral homes don't tell you</a></li>
        <li><strong>Explore payment assistance</strong> if cost is a concern: <a href="social-security-death-benefit.html">Social Security benefits</a>, <a href="veteran-burial-benefits.html">veteran benefits</a>, <a href="medicaid-funeral-assistance.html">Medicaid assistance</a>, or <a href="crowdfunding-funeral-costs.html">crowdfunding</a>.</li>
      </ol>
      <p>For a complete walkthrough, see our <a href="what-to-do-when-someone-dies.html">what to do when someone dies</a> guide or <a href="planning-checklist.html">printable funeral planning checklist</a>.</p>

      <h2 id="faq">Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(fn)}
      ${neighborLinks(s, 'funeral')}
      ${ctaBanner()}

      <div class="callout callout-info"><strong>Compare All 50 States</strong> See how ${s.name} funeral costs compare to the national average and all other states in our <a href="national-funeral-cost-index.html">2026 National Funeral Cost Index</a> — the most comprehensive funeral pricing data available.</div>

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> Cost data is based on publicly available surveys and consumer research. Actual prices vary by provider. This information is for educational purposes only and does not constitute financial, legal, or professional advice. Always consult licensed professionals before making funeral arrangements.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Metro Pages ─────────────────────────────────────────────────
function genMetro(m) {
  const s = states.find(x => x.slug === m.ss);
  if (!s) return null;
  const fn = `funeral-costs-${m.slug}.html`;
  const mf = Math.round(s.f * m.mp);
  const mc = Math.round(s.c * m.mp);
  const mdc = Math.round(s.dc * m.mp);
  const mb = Math.round(s.b * m.mp);
  const title = `Funeral Costs in ${m.city} (2026) — Real Prices ${$(mdc)} to ${$(mf)} | Save Money`;
  const desc = `What does a funeral cost in ${m.city}, ${m.st} in 2026? Traditional funeral ${$(mf)}, cremation ${$(mc)}, direct cremation from ${$(mdc)}. Compare ${m.city} funeral home prices and learn how to save thousands on funeral costs.`;

  // Find nearby cities in the same state for comparison
  const stateMetros = metros.filter(x => x.ss === m.ss && x.slug !== m.slug);
  const nearbyComparison = stateMetros.length > 0 ? stateMetros.slice(0, 3) : [];

  const faq = [
    {q:`How much does a funeral cost in ${m.city}?`,a:`The average traditional funeral in ${m.city} costs approximately ${$(mf)}, which is ${m.mp > 1.1 ? 'higher than' : 'close to'} the ${m.st} state average of ${$(s.f)}. Direct cremation starts around ${$(mdc)}. Cemetery plots average ${$(mb)}. Total costs including burial or cremation typically range from ${$(mdc)} for the simplest option to ${$(Math.round(mf*1.3 + mb))} for a full traditional burial.`},
    {q:`Is cremation or burial more common in ${m.city}?`,a:`In the ${m.city} area, the cremation rate follows ${m.st}'s overall rate of ${s.cr}. Cremation remains the more affordable option, with direct cremation costing ${$(mdc)} compared to traditional burial at ${$(mf)} plus cemetery fees of ${$(mb)}. Many ${m.city} families choose cremation to reduce costs while still holding a meaningful memorial service.`},
    {q:`How do ${m.city} funeral costs compare to the national average?`,a:`${m.city} funeral costs are ${mf > 7848 ? 'above' : 'below'} the national average of $7,848 for a traditional funeral. The ${m.city} metro area's cost of living ${m.mp > 1.15 ? 'significantly' : 'somewhat'} influences local funeral pricing. ${mf > 9000 ? 'Families in ' + m.city + ' may save by comparing providers carefully or considering direct cremation.' : 'While costs are manageable, comparing at least 2-3 providers can still save hundreds.'}`},
    {q:`Where can I compare funeral home prices in ${m.city}?`,a:`Under the FTC Funeral Rule, every funeral home in ${m.city} must provide a General Price List. Call 2-3 providers to request their GPL. You can also visit Parting.com or the Funeral Consumers Alliance for price comparison resources.`},
    {q:`What is direct cremation in ${m.city} and how much does it cost?`,a:`Direct cremation in ${m.city} costs approximately ${$(mdc)} and is the most affordable option. It includes transportation to the crematory and return of ashes without a viewing or ceremony. Families can hold a separate memorial service at a later date, often at a fraction of the cost of a traditional funeral.`},
    {q:`Are there affordable funeral options in ${m.city}?`,a:`Yes. Direct cremation from ${$(mdc)} is the most affordable. You can also consider direct burial (no service), memorial-only services, or home funerals where permitted. Third-party caskets save 50-70% versus funeral home prices. Veteran benefits, Medicaid, and crowdfunding may also help offset costs.`}
  ];

  const nearbyCityRows = nearbyComparison.map(nc => {
    const ncf = Math.round(s.f * nc.mp);
    const ncdc = Math.round(s.dc * nc.mp);
    return `<tr><td><a href="funeral-costs-${nc.slug}.html">${nc.city}</a></td><td>${$(ncf)}</td><td>${$(ncdc)}</td></tr>`;
  }).join('\n            ');

  const nearbyCitySection = nearbyComparison.length > 0 ? `
      <h2>Compare: ${m.city} vs. Other ${m.st} Cities</h2>
      <p>Funeral costs can vary significantly even within ${m.st}. Here is how ${m.city} compares to other metro areas in the state:</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Funeral Cost Comparison in ${m.st} (2026)</caption>
          <thead><tr><th>City</th><th>Traditional Funeral</th><th>Direct Cremation</th></tr></thead>
          <tbody>
            <tr><td><strong>${m.city}</strong></td><td><strong>${$(mf)}</strong></td><td><strong>${$(mdc)}</strong></td></tr>
            ${nearbyCityRows}
            <tr><td><a href="funeral-costs-${s.slug}.html">${m.st} Average</a></td><td>${$(s.f)}</td><td>${$(s.dc)}</td></tr>
          </tbody>
        </table>
      </div>
      <p>${mf > s.f ? `At ${$(mf)}, ${m.city} runs about ${Math.round((m.mp-1)*100)}% above the ${m.st} state average of ${$(s.f)}. This premium reflects ${m.city}'s higher cost of living, real estate, and provider overhead.` : `${m.city}'s funeral costs are close to or below the ${m.st} state average of ${$(s.f)}, making it a relatively affordable area for funeral services.`} Regardless of location, comparing at least 2-3 providers before committing can save families $1,000 or more.</p>` : '';

  const content = `${head(title, desc, fn, `Funeral Costs in ${m.city}`, faq, {name:`${s.name} Funeral Costs`,url:`funeral-costs-${s.slug}.html`})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="funeral-costs-by-state.html">Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">${m.city}</span>
      </nav>

      <h1>Funeral Costs in ${m.city}, ${m.st} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">State:</span> <span class="article-meta-value"><a href="funeral-costs-${s.slug}.html">${m.st}</a></span></span>
      </div>

      <p class="guide-intro">If you are arranging a funeral in the ${m.city} metropolitan area, this guide provides realistic cost estimates to help you plan. Funeral costs in ${m.city} tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average due to the area's cost of living. Understanding typical prices empowers you to make confident, informed decisions for your family.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(mf)}</span><span class="stat-label">Avg. Traditional Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(mc)}</span><span class="stat-label">Avg. Cremation Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(mdc)}</span><span class="stat-label">Direct Cremation</span></div>
        <div class="stat-box"><span class="stat-number">${$(mb)}</span><span class="stat-label">Avg. Burial Plot</span></div>
      </div>

      <h2>Complete Cost Breakdown for ${m.city}</h2>
      <p>The following table breaks down average funeral costs in the ${m.city} metropolitan area compared to ${m.st} state averages. These figures reflect the local cost-of-living multiplier of approximately ${m.mp}x applied to statewide pricing data from the NFDA and consumer surveys.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${m.city} Funeral Cost Averages (2026)</caption>
          <thead><tr><th>Service</th><th>${m.city} Avg.</th><th>${m.st} Avg.</th></tr></thead>
          <tbody>
            <tr><td>Traditional funeral</td><td class="cost-value">${$(mf)}</td><td>${$(s.f)}</td></tr>
            <tr><td>Funeral with cremation</td><td class="cost-value">${$(mc)}</td><td>${$(s.c)}</td></tr>
            <tr><td>Direct cremation</td><td class="cost-value">${$(mdc)}</td><td>${$(s.dc)}</td></tr>
            <tr><td>Cemetery plot</td><td class="cost-value">${$(mb)}</td><td>${$(s.b)}</td></tr>
            <tr><td>Embalming</td><td class="cost-value">${$(Math.round(mf*0.1))}</td><td>${$(Math.round(s.f*0.1))}</td></tr>
            <tr><td>Casket</td><td class="cost-value">${$(Math.round(mf*0.3))}</td><td>${$(Math.round(s.f*0.3))}</td></tr>
            <tr><td>Burial vault / liner</td><td class="cost-value">${$(Math.round(mb*0.4))}</td><td>${$(Math.round(s.b*0.4))}</td></tr>
            <tr><td>Headstone / marker</td><td class="cost-value">$1,500 – $3,000</td><td>$1,000 – $3,000</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Understanding ${m.city} Funeral Pricing</h2>
      <p>Funeral costs in ${m.city} carry a metro premium of approximately ${Math.round((m.mp-1)*100)}% above the ${m.st} state average. This is driven by higher real estate costs for funeral home facilities, higher labor costs, and greater demand for services in a dense metropolitan area. However, the competitive market in ${m.city} also means you have more providers to choose from, which gives you leverage when comparing prices.</p>
      <p>The most effective way to find the best price is to request General Price Lists from 2 to 3 funeral homes in the ${m.city} area and compare them line by line. Under the FTC Funeral Rule, every provider must give you this list upon request — no appointment needed, no commitment required.</p>
      ${nearbyCitySection}

      <h2>Cremation vs. Burial in ${m.city}</h2>
      <div class="comparison-grid">
        <div class="comparison-card"><h3>Cremation in ${m.city}</h3><div class="price-range">${$(mdc)} – ${$(mc)}</div><ul><li>Direct cremation from ${$(mdc)}</li><li>Cremation with service from ${$(mc)}</li><li>No cemetery plot needed</li><li>Memorial service can be held anywhere</li></ul><p><a href="cremation-costs-${s.slug}.html">${m.st} cremation guide</a></p></div>
        <div class="comparison-card"><h3>Burial in ${m.city}</h3><div class="price-range">${$(Math.round(mf*0.75))} – ${$(Math.round(mf*1.3))}</div><ul><li>Traditional service from ${$(mf)}</li><li>Cemetery plot from ${$(mb)}</li><li>Vault or liner typically required</li><li>Permanent memorial location</li></ul><p><a href="burial-costs-${s.slug}.html">${m.st} burial guide</a></p></div>
      </div>

      <h2>Your Rights in ${m.city}</h2>
      <div class="callout callout-info"><strong>FTC Funeral Rule Protection</strong> Every funeral home in ${m.city} must provide an itemized General Price List, let you choose only the services you want, and accept caskets purchased elsewhere. You are never required to buy a package. <a href="ftc-funeral-rule-guide.html">Read the full FTC Funeral Rule guide</a>.</div>

      <h2>Ways to Reduce Costs in ${m.city}</h2>
      <ul>
        <li>Compare prices from at least 3 funeral providers in the ${m.city} area</li>
        <li>Consider direct cremation at ${$(mdc)} as the most affordable option. <a href="direct-cremation-cost.html">Direct cremation guide</a></li>
        <li>Shop for caskets from independent retailers or online — savings of 50-70% are common. <a href="best-online-casket-retailers.html">Best online casket retailers</a></li>
        <li>Ask about veteran benefits, Medicaid assistance, or payment plans. <a href="funeral-payment-assistance.html">See all assistance options</a></li>
        <li>Consider a memorial service at a church, park, or home instead of the funeral home</li>
        <li>Review our <a href="cheap-funeral-options.html">affordable funeral options guide</a> for more strategies</li>
        <li>Learn <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a> if finances are tight</li>
        <li>Use our <a href="funeral-cost-comparison-worksheet.html">cost comparison worksheet</a> to organize quotes from different providers</li>
      </ul>

      <h2>Hidden Fees to Watch For in ${m.city}</h2>
      <p>Many families in ${m.city} encounter unexpected charges. Watch for these common hidden fees:</p>
      <ul>
        <li><strong>Casket handling fees</strong> — Illegal under the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a>, but some providers still add them</li>
        <li><strong>Mandatory embalming claims</strong> — Almost never legally required. <a href="consumer-rights-funeral-pricing.html">Know your consumer rights</a></li>
        <li><strong>Package markups</strong> — Bundles often include unnecessary services. Compare line items. <a href="what-funeral-homes-dont-tell-you.html">What funeral homes don't tell you</a></li>
        <li><strong>Weekend/holiday surcharges</strong> — Can add 15–25% to the total cost</li>
        <li><strong>Documentation fees</strong> — Death certificates and permits can add $200–$600</li>
      </ul>

      ${resources('general')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More in ${m.st}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${m.st} Funeral Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${m.st} Cremation Costs</a></li><li><a href="burial-costs-${s.slug}.html">${m.st} Burial Costs</a></li><li><a href="cremation-costs-${m.slug}.html">${m.city} Cremation Costs</a></li><li><a href="burial-costs-${m.slug}.html">${m.city} Burial Costs</a></li><li><a href="cremation-costs-by-state.html">All State Cremation Costs</a></li><li><a href="burial-costs-by-state.html">All State Burial Costs</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

      ${relatedGuides(fn)}
      ${ctaBanner()}
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Cremation State Pages ───────────────────────────────────────
function genCremation(s) {
  const fn = `cremation-costs-${s.slug}.html`;
  const title = `Cremation Cost in ${s.name} (2026) — From ${$(s.dc)} | Save vs. Burial`;
  const desc = `Cremation costs in ${s.name}: direct cremation from ${$(s.dc)}, cremation with service ${$(s.c)}. Save up to ${$(s.f - s.dc)} vs. traditional burial. Compare ${s.name} cremation providers, types, and prices.`;
  const crRate = parseInt(s.cr);
  const crContext = crRate > 70 ? 'one of the highest cremation rates in the nation' : crRate > 55 ? 'above the national average' : crRate > 45 ? 'near the national average' : 'below the national average, though cremation rates have been rising steadily';
  const savingsVsBurial = $(s.f - s.dc);

  const faq = [
    {q:`How much does cremation cost in ${s.name}?`,a:`Cremation costs in ${s.name} range from ${$(s.dc)} for direct cremation to ${$(s.c)} for a full funeral service followed by cremation. Additional costs may include urns ($50-$3,000), memorial services ($500-$2,000), and scattering or inurnment fees ($200-$600). The total depends on the level of service you choose.`},
    {q:`What types of cremation are available in ${s.name}?`,a:`Families in ${s.name} can choose from three main types: direct cremation (${$(s.dc)}) — the most affordable option with no viewing or ceremony; cremation with memorial service (ceremony held after cremation, often more flexible on timing); and traditional cremation (${$(s.c)}) — a full funeral service before cremation. Each option can be customized to fit your family's needs and budget.`},
    {q:`What are ${s.name}'s cremation regulations?`,a:`${s.name} follows standard cremation regulations requiring a mandatory waiting period (typically 24-48 hours) before cremation. Written authorization from the legal next of kin is required, and some counties require a permit from the medical examiner. Pacemakers and certain implants must be removed beforehand. Under the FTC Funeral Rule, you are not required to purchase a casket for cremation — an alternative container is sufficient.`},
    {q:`Can I scatter ashes in ${s.name}?`,a:`Scattering laws in ${s.name} vary by location. Generally, you may scatter ashes on private property with owner permission, at sea (3+ nautical miles offshore per EPA regulations), and in some designated public areas. National parks may require a permit. Always check local ordinances and be respectful of the environment and others. Some ${s.name} families also choose columbarium niches, burial of ashes, or memorial keepsakes as alternatives to scattering.`},
    {q:`Why is cremation ${crRate > 55 ? 'so popular' : 'growing'} in ${s.name}?`,a:`${s.name} has ${crContext}, with a cremation rate of ${s.cr}. Factors driving cremation adoption include lower cost compared to traditional burial (saving ${savingsVsBurial} or more), greater flexibility for memorial services, environmental considerations, and changing cultural preferences. The national cremation rate has exceeded 60% and continues to rise annually.`},
    {q:`How long does cremation take in ${s.name}?`,a:`In ${s.name}, the cremation process itself takes 2 to 3 hours. However, there is typically a mandatory 24 to 48 hour waiting period before cremation can proceed. After cremation, ashes are usually ready for pickup or delivery within 3 to 7 business days. Direct cremation (${$(s.dc)}) has the shortest total timeline since no viewing or ceremony is involved.`},
    {q:`Can I hold a funeral service before cremation in ${s.name}?`,a:`Yes. A traditional funeral service followed by cremation costs approximately ${$(s.c)} in ${s.name}. This includes visitation, a ceremony, and then cremation instead of burial. You can also hold a memorial service after cremation, which offers more flexibility on timing and location and typically costs less.`}
  ];

  const content = `${head(title, desc, fn, `Cremation Costs in ${s.name}`, faq, {name:'Cremation Costs by State',url:'cremation-costs-by-state.html'})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="cremation-costs-by-state.html">Cremation Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Cremation Costs</span>
      </nav>

      <h1>Cremation Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Cremation Rate:</span> <span class="article-meta-value">${s.cr}</span></span>
      </div>

      <p class="guide-intro">With a cremation rate of ${s.cr}, ${parseInt(s.cr) > 55 ? 'cremation is the most popular disposition choice' : 'cremation is increasingly chosen by families'} in ${s.name}. Whether you are considering direct cremation as the most affordable option or a full funeral service followed by cremation, this guide explains what to expect and what you will pay in ${s.name}.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(s.dc)}</span><span class="stat-label">Direct Cremation</span></div>
        <div class="stat-box"><span class="stat-number">${$(s.c)}</span><span class="stat-label">Cremation w/ Service</span></div>
        <div class="stat-box"><span class="stat-number">${s.cr}</span><span class="stat-label">Cremation Rate</span></div>
      </div>

      <h2>Types of Cremation in ${s.name}</h2>
      <div class="comparison-grid">
        <div class="comparison-card"><h3>Direct Cremation</h3><div class="price-range">${$(s.dc)}</div><ul><li>Most affordable cremation option</li><li>No viewing or ceremony before cremation</li><li>Body transferred directly to crematory</li><li>Remains returned to family</li><li>Memorial service can be held later</li></ul></div>
        <div class="comparison-card"><h3>Cremation with Service</h3><div class="price-range">${$(s.c)}</div><ul><li>Traditional funeral service before cremation</li><li>Viewing or visitation possible</li><li>Ceremony at funeral home or church</li><li>Typically includes basic urn</li><li>More similar to traditional funeral experience</li></ul></div>
      </div>

      <h2>Cremation Cost Breakdown</h2>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Cremation Costs in ${s.name} (2026)</caption>
          <thead><tr><th>Item</th><th>Average Cost</th><th>Range</th></tr></thead>
          <tbody>
            <tr><td>Direct cremation</td><td class="cost-value">${$(s.dc)}</td><td>${$(Math.round(s.dc*0.7))} – ${$(Math.round(s.dc*1.4))}</td></tr>
            <tr><td>Cremation with service</td><td class="cost-value">${$(s.c)}</td><td>${$(Math.round(s.c*0.8))} – ${$(Math.round(s.c*1.3))}</td></tr>
            <tr><td>Basic urn</td><td class="cost-value">$50 – $300</td><td>$25 – $3,000+</td></tr>
            <tr><td>Memorial service</td><td class="cost-value">$500 – $2,000</td><td>$0 – $5,000</td></tr>
            <tr><td>Cremation jewelry</td><td class="cost-value">$50 – $500</td><td>$20 – $2,000+</td></tr>
            <tr><td>Scattering service</td><td class="cost-value">$200 – $600</td><td>$0 – $1,500</td></tr>
          </tbody>
        </table>
      </div>

      <h2>What to Know Before Choosing Cremation in ${s.name}</h2>
      <p>When considering cremation in ${s.name}, keep these important points in mind:</p>
      <ul>
        <li><strong>Cooling-off period:</strong> Most states require a 24-48 hour waiting period before cremation can proceed</li>
        <li><strong>Authorization:</strong> Written authorization from the legal next of kin is required</li>
        <li><strong>Pacemakers and implants:</strong> These must be removed before cremation for safety</li>
        <li><strong>No casket required:</strong> Under the FTC Funeral Rule, you are not required to purchase a casket for cremation — an alternative container is sufficient</li>
        <li><strong>Ashes:</strong> The cremated remains (typically 3-7 pounds) are returned to the family in a container or urn of your choice</li>
      </ul>

      <div class="callout callout-tip"><strong>Cost-Saving Tip:</strong> You do not need to purchase an urn from the cremation provider. Urns can be purchased independently for significantly less. The FTC Funeral Rule protects your right to use a container purchased elsewhere.</div>

      <h2>How to Save on Cremation in ${s.name}</h2>
      <p>Cremation costs in ${s.name} can be reduced with these strategies:</p>
      <ul>
        <li><strong>Compare providers:</strong> Call 2–3 cremation providers in ${s.name} and request their General Price Lists. <a href="funeral-price-comparison.html">How to compare funeral prices</a></li>
        <li><strong>Choose direct cremation:</strong> At ${$(s.dc)}, it saves ${savingsVsBurial} compared to traditional burial. <a href="direct-cremation-cost.html">Direct cremation guide</a></li>
        <li><strong>Buy urns independently:</strong> Save 50–80% on urns by purchasing from a third-party retailer. <a href="urn-buying-guide.html">Urn buying guide</a></li>
        <li><strong>Hold a memorial separately:</strong> A memorial at a church, park, or home costs a fraction of a funeral home ceremony.</li>
        <li><strong>Check assistance programs:</strong> <a href="veteran-burial-benefits.html">Veteran benefits</a>, <a href="medicaid-funeral-assistance.html">Medicaid</a>, and <a href="funeral-payment-assistance.html">other assistance programs</a> may help cover costs.</li>
      </ul>
      <p>For more ways to reduce costs, see our <a href="cheap-funeral-options.html">affordable funeral options guide</a> or learn <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>.</p>

      ${resources('cremation')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More for ${s.name}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${s.name} Funeral Costs</a></li><li><a href="burial-costs-${s.slug}.html">${s.name} Burial Costs</a></li><li><a href="cremation-costs-by-state.html">All State Cremation Costs</a></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

      ${(function(){const cityLinks=metros.filter(x=>x.ss===s.slug).map(x=>'<li><a href="cremation-costs-'+x.slug+'.html">Cremation Costs in '+x.city+'</a></li>').join('');return cityLinks?'<div class="related-guides"><h3>Cremation Costs in '+s.name+' Cities</h3><ul>'+cityLinks+'</ul></div>':'';})()}

      ${neighborLinks(s, 'cremation')}
      ${relatedGuides(fn)}
      ${ctaBanner()}
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Burial State Pages ──────────────────────────────────────────
function genBurial(s) {
  const fn = `burial-costs-${s.slug}.html`;
  const totalBurial = $(Math.round(s.f + s.b + s.b * 0.9));
  const totalBurialHigh = $(Math.round(s.f * 1.3 + s.b * 2 + s.b * 0.9));
  const title = `Burial Cost in ${s.name} (2026) — Plots from ${$(s.b)}, Total ${totalBurial}+ | Save`;
  const desc = `How much does burial cost in ${s.name} in 2026? Funeral service ${$(s.f)}, cemetery plot from ${$(s.b)}, total burial cost ${totalBurial}–${totalBurialHigh}. See hidden fees, casket savings, and cheapest burial options.`;

  const faq = [
    {q:`How much does burial cost in ${s.name}?`,a:`A traditional burial in ${s.name} costs approximately ${$(s.f)} for the funeral service plus ${$(s.b)} for a cemetery plot. When you add a burial vault (${$(Math.round(s.b * 0.4))}), opening and closing fees (${$(Math.round(s.b * 0.5))}), casket (${$(Math.round(s.f * 0.3))}), and headstone ($1,000-$3,000), the total typically ranges from ${totalBurial} to ${totalBurialHigh}.`},
    {q:`Is a burial vault required in ${s.name}?`,a:`Burial vaults are required by most cemeteries in ${s.name} as a matter of cemetery policy (to prevent ground settling), though they are rarely mandated by state law. A grave liner — a less expensive alternative to a full vault — may also meet the cemetery's requirements. Always ask the specific cemetery about their policies and whether cheaper alternatives are accepted. Vault costs in ${s.name} typically range from $800 to $10,000.`},
    {q:`What are the cheapest burial options in ${s.name}?`,a:`The most affordable burial options in ${s.name} include: direct burial (no viewing or ceremony, body buried shortly after death) which eliminates embalming and facility costs; green or natural burial using a biodegradable container and no embalming, available at select ${s.name} cemeteries; and purchasing a casket from an independent retailer rather than the funeral home, which can save 50-70% on casket costs alone. See our affordable funeral options guide for more strategies.`},
    {q:`How do I compare cemetery costs in ${s.name}?`,a:`Cemetery costs in ${s.name} vary significantly even within the same city. Request a complete price list from each cemetery including plot cost, opening and closing fees, vault requirements, perpetual care fees, and any restrictions. Unlike funeral homes, cemeteries are not covered by the FTC Funeral Rule, so you will need to ask proactively for pricing details. Municipal and religious cemeteries often cost less than private cemeteries.`},
    {q:`What is the total cost of burial in ${s.name} including everything?`,a:`The total cost of burial in ${s.name} including funeral service (${$(s.f)}), cemetery plot (${$(s.b)}), casket (${$(Math.round(s.f*0.3))}), vault (${$(Math.round(s.b*0.4))}), opening/closing (${$(Math.round(s.b*0.5))}), and headstone ($1,000–$3,000) typically ranges from ${totalBurial} to ${totalBurialHigh}. These figures vary by provider and the specific choices made. Comparing at least 2–3 funeral homes and cemeteries separately can save significant money.`},
    {q:`Is green burial available in ${s.name}?`,a:`Green burial options are available in some areas of ${s.name}. Green burial uses biodegradable containers, no embalming, and often costs less than traditional burial. Not all cemeteries in ${s.name} offer green burial sections, so you may need to research options in your area. Some families also consider hybrid approaches, such as traditional caskets with no embalming. See our green burial guide for more details.`}
  ];

  const content = `${head(title, desc, fn, `Burial Costs in ${s.name}`, faq, {name:'Burial Costs by State',url:'burial-costs-by-state.html'})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="burial-costs-by-state.html">Burial Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Burial Costs</span>
      </nav>

      <h1>Burial Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Region:</span> <span class="article-meta-value">${s.region}</span></span>
      </div>

      <p class="guide-intro">Traditional burial remains a meaningful choice for many ${s.name} families. Understanding the full cost picture — from funeral service fees to cemetery charges, caskets, vaults, and headstones — helps you plan with confidence. This guide breaks down what you can expect to pay for burial in ${s.name} and how to make informed decisions.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(s.f)}</span><span class="stat-label">Avg. Funeral Service</span></div>
        <div class="stat-box"><span class="stat-number">${$(s.b)}</span><span class="stat-label">Avg. Cemetery Plot</span></div>
        <div class="stat-box"><span class="stat-number">${$(Math.round(s.f*0.3))}</span><span class="stat-label">Avg. Casket</span></div>
      </div>

      <h2>Complete Burial Cost Breakdown</h2>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Burial Costs in ${s.name} (2026)</caption>
          <thead><tr><th>Item</th><th>Average Cost</th><th>Range</th></tr></thead>
          <tbody>
            <tr><td>Funeral service</td><td class="cost-value">${$(s.f)}</td><td>${$(Math.round(s.f*0.75))} – ${$(Math.round(s.f*1.3))}</td></tr>
            <tr><td>Cemetery plot</td><td class="cost-value">${$(s.b)}</td><td>${$(Math.round(s.b*0.5))} – ${$(Math.round(s.b*2))}</td></tr>
            <tr><td>Casket</td><td class="cost-value">${$(Math.round(s.f*0.3))}</td><td>${$(Math.round(s.f*0.1))} – ${$(Math.round(s.f*0.8))}</td></tr>
            <tr><td>Burial vault / liner</td><td class="cost-value">${$(Math.round(s.b*0.4))}</td><td>$800 – $10,000</td></tr>
            <tr><td>Opening &amp; closing grave</td><td class="cost-value">${$(Math.round(s.b*0.5))}</td><td>$800 – $2,500</td></tr>
            <tr><td>Headstone / marker</td><td class="cost-value">$1,500</td><td>$500 – $5,000+</td></tr>
            <tr><td>Embalming</td><td class="cost-value">${$(Math.round(s.f*0.1))}</td><td>$500 – $1,500</td></tr>
          </tbody>
        </table>
      </div>

      <p>The total cost of burial in ${s.name}, including all cemetery fees, typically ranges from <strong>${$(Math.round(s.f + s.b + s.b*0.9))}</strong> to <strong>${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))}</strong> depending on choices made.</p>

      <h2>Burial Options in ${s.name}</h2>
      <ul>
        <li><strong>Traditional burial</strong> — Full funeral service with viewing, casket, and cemetery burial. Most expensive option but provides the most traditional experience.</li>
        <li><strong>Direct burial</strong> — The body is buried shortly after death without embalming, viewing, or ceremony. A memorial service can be held separately. Costs significantly less.</li>
        <li><strong>Green burial</strong> — No embalming, biodegradable container, and a natural setting. <a href="green-burial-options.html">Learn about green burial</a></li>
        <li><strong>Mausoleum entombment</strong> — Above-ground placement in a mausoleum. Typically more expensive than ground burial.</li>
      </ul>

      <div class="callout callout-tip"><strong>Save on Caskets:</strong> Under the FTC Funeral Rule, you have the right to purchase a casket from any retailer and the funeral home must accept it without charging a handling fee. Third-party retailers and online stores often offer caskets for 50-70% less than funeral homes.</div>

      <h2>How to Reduce Burial Costs in ${s.name}</h2>
      <p>Burial costs in ${s.name} can be managed with smart planning:</p>
      <ul>
        <li><strong>Compare cemetery prices:</strong> Municipal and religious cemeteries in ${s.name} often cost less than private cemeteries. Request complete price lists from multiple cemeteries.</li>
        <li><strong>Buy caskets independently:</strong> Save 50–70% by purchasing from an online retailer. <a href="casket-buying-guide.html">Casket buying guide</a> | <a href="best-online-casket-retailers.html">Best online casket retailers</a></li>
        <li><strong>Ask about grave liners:</strong> A liner costs significantly less than a full vault and may meet the cemetery's requirements.</li>
        <li><strong>Consider direct burial:</strong> Skipping the viewing and ceremony can save thousands on embalming and facility fees.</li>
        <li><strong>Explore green burial:</strong> No embalming, simpler containers, and often lower costs. <a href="green-burial-options.html">Green burial options</a></li>
        <li><strong>Check headstone prices independently:</strong> Funeral homes and cemeteries mark up headstones. <a href="headstone-monument-costs.html">Headstone cost guide</a></li>
      </ul>
      <p>For comprehensive cost-saving strategies, see our <a href="cheap-funeral-options.html">affordable funeral options guide</a> or <a href="funeral-payment-assistance.html">payment assistance programs</a>.</p>

      ${resources('burial')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More for ${s.name}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${s.name} Funeral Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${s.name} Cremation Costs</a></li><li><a href="burial-costs-by-state.html">All State Burial Costs</a></li><li><a href="headstone-monument-costs.html">Headstone Costs</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

      ${(function(){const cityLinks=metros.filter(x=>x.ss===s.slug).map(x=>'<li><a href="burial-costs-'+x.slug+'.html">Burial Costs in '+x.city+'</a></li>').join('');return cityLinks?'<div class="related-guides"><h3>Burial Costs in '+s.name+' Cities</h3><ul>'+cityLinks+'</ul></div>':'';})()}

      ${neighborLinks(s, 'burial')}
      ${relatedGuides(fn)}
      ${ctaBanner()}
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Topical Pages ───────────────────────────────────────────────
function genTopical(p) {
  const faq = [
    {q:`What is covered in this ${p.st} guide?`,a:`This guide provides comprehensive, educational information about ${p.st.toLowerCase()} including costs, options, consumer rights, and practical steps. All information is for educational purposes only.`},
    {q:`How current is this information?`,a:`This guide was last reviewed in March 2026. We regularly update our content based on the latest data from industry sources, government agencies, and consumer research.`},
    {q:`Where can I get personalized advice?`,a:`For specific decisions about your situation, always consult with licensed professionals — such as attorneys for legal matters, financial advisors for insurance questions, and licensed funeral directors for service planning.`},
    {q:`Is this information free to use?`,a:`Yes, all guides on Funeral Cost Analyzer are free and available without registration. We provide independent educational resources to help families make informed decisions.`},
    {q:`How much does the average funeral cost in the United States?`,a:`The median cost of a funeral with burial is approximately $7,848, while a funeral with cremation averages $6,971. Direct cremation is the most affordable option at $1,000 to $3,500. Costs vary significantly by state and provider.`},
    {q:`What are my consumer rights when arranging a funeral?`,a:`The FTC Funeral Rule protects all consumers. Funeral homes must provide itemized pricing, allow you to choose only the services you want, accept caskets purchased elsewhere, and refrain from misrepresenting legal requirements. You have the right to a General Price List from any funeral home upon request.`}
  ];

  const content = `${head(p.t, p.d, p.fn, p.st, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <span aria-current="page">${p.st}</span>
      </nav>

      <h1>${p.st}: What Families Need to Know in 2026</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, FCA, Government Sources</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html" style="color:var(--brown-500);">Our Standards</a></span></span>
      </div>

      <p class="guide-intro">${p.d} This guide is designed to give you clear, honest, and compassionate information so you can navigate these decisions with confidence. Take your time reading — there is no rush, and every family's path is different.</p>

      <nav class="toc" aria-label="Table of contents">
        <p class="toc-heading">In This Guide</p>
        <ul class="toc-list">
          <li><a href="#overview">Overview</a></li>
          <li><a href="#what-to-know">What You Need to Know</a></li>
          <li><a href="#costs">Costs and Pricing</a></li>
          <li><a href="#consumer-rights">Your Consumer Rights</a></li>
          <li><a href="#steps">Practical Steps</a></li>
          <li><a href="#faq">Frequently Asked Questions</a></li>
        </ul>
      </nav>

      <h2 id="overview">Understanding ${p.st}</h2>
      <p>Navigating funeral costs and end-of-life planning is one of the most challenging things families face. Whether you are dealing with an immediate need or planning ahead, having clear, accurate information makes a real difference. ${p.st} is an important topic that affects thousands of families each year, and understanding your options helps you avoid unnecessary costs and make decisions that feel right.</p>
      <p>The funeral industry in the United States generates over $20 billion annually, and prices vary widely by location, provider, and the specific services chosen. Federal law — specifically the FTC Funeral Rule — protects consumers by requiring transparency and choice, but many families are unaware of these protections during their time of grief. This guide aims to change that by giving you the knowledge you need.</p>

      <h2 id="what-to-know">What You Need to Know</h2>
      <p>Here are the key facts and considerations related to ${p.st.toLowerCase()}:</p>
      <ul>
        <li><strong>Costs vary significantly</strong> — Prices for funeral-related services can vary by 200-300% between providers in the same city. Always compare at least 2-3 options before making decisions.</li>
        <li><strong>You have legal protections</strong> — The FTC Funeral Rule gives you the right to itemized pricing, freedom to choose only the services you want, and protection against deceptive practices. <a href="ftc-funeral-rule-guide.html">Read our FTC guide</a></li>
        <li><strong>There is no single right answer</strong> — Every family's needs, values, and budget are different. What matters most is that you feel informed and at peace with your decisions.</li>
        <li><strong>Help is available</strong> — From government assistance programs to community resources, there are options if cost is a concern. <a href="funeral-payment-assistance.html">Explore payment assistance</a></li>
        <li><strong>Planning ahead saves money and stress</strong> — Families who research options before an immediate need arises typically save 20-30% and experience less decision-making stress.</li>
        <li><strong>Cremation is the most affordable option</strong> — Direct cremation ($1,000–$3,500) is the least expensive disposition choice. Over 60% of American families now choose cremation. <a href="cremation-vs-burial-cost.html">Cremation vs. burial comparison</a></li>
        <li><strong>Compare at least 2–3 providers</strong> — Use the <a href="funeral-cost-comparison-worksheet.html">funeral cost comparison worksheet</a> to organize your research</li>
      </ul>

      <h2 id="costs">Costs and Pricing</h2>
      <p>Understanding the financial aspects of ${p.st.toLowerCase()} is crucial for making informed decisions. While costs vary by location and provider, here are some general pricing guidelines to keep in mind:</p>
      <div class="callout callout-info"><strong>National Context:</strong> The median cost of a funeral with burial in the US is approximately $7,848, while a funeral with cremation averages $6,971. Direct cremation — the most affordable option — typically costs $1,000 to $3,500. These figures from the National Funeral Directors Association provide a baseline, but actual costs in your area may differ significantly.</div>
      <p>When evaluating costs related to ${p.st.toLowerCase()}, consider the total picture rather than individual line items. Ask every provider for their complete General Price List, compare similar services side by side, and do not hesitate to ask questions about anything you do not understand. There is no such thing as a silly question when it comes to funeral planning.</p>

      <h2 id="consumer-rights">Your Consumer Rights</h2>
      <p>Federal and state laws protect you when making funeral-related decisions:</p>
      <ul>
        <li><strong>FTC Funeral Rule</strong> — Requires itemized pricing, prohibits package-only sales, and protects your right to shop around. <a href="ftc-funeral-rule-guide.html">Full FTC guide</a></li>
        <li><strong>General Price List</strong> — Every funeral home must provide this upon request. It is your most powerful tool for comparison shopping. <a href="funeral-price-comparison.html">How to compare prices</a></li>
        <li><strong>No tying arrangements</strong> — Providers cannot require you to buy one product in order to get another</li>
        <li><strong>Third-party merchandise</strong> — Funeral homes must accept caskets and urns purchased elsewhere without penalty</li>
        <li><strong>Truth in representation</strong> — Providers cannot make false claims about legal requirements for services like embalming</li>
      </ul>
      <p>If you believe your rights have been violated, contact the <a href="https://www.ftc.gov" target="_blank" rel="noopener noreferrer">Federal Trade Commission</a>, your state attorney general, or the <a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a>.</p>

      <h2 id="steps">Practical Steps You Can Take</h2>
      <ol>
        <li><strong>Gather information</strong> — Read guides like this one and note questions you want to ask providers</li>
        <li><strong>Request General Price Lists</strong> — Call or visit 2-3 providers and request their itemized pricing</li>
        <li><strong>Compare carefully</strong> — Look at similar services across providers and note significant price differences</li>
        <li><strong>Ask questions</strong> — Do not hesitate to ask for clarification on any charge or service</li>
        <li><strong>Explore assistance options</strong> — Check for veteran benefits, Social Security, Medicaid, or other programs</li>
        <li><strong>Take your time</strong> — Unless there is an immediate need, take the time you need to make decisions that feel right</li>
        <li><strong>Consult professionals</strong> — For legal, financial, or medical questions, always consult licensed professionals</li>
        <li><strong>Document decisions</strong> — Write down your wishes and share them with family members and your estate planner</li>
      </ol>

      ${resources('general')}

      <h2 id="faq">Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(p.fn)}

      <div class="related-guides"><h3>Find Costs in Your State</h3><ul><li><a href="funeral-costs-by-state.html">Funeral Costs by State</a></li><li><a href="cremation-costs-by-state.html">Cremation Costs by State</a></li><li><a href="burial-costs-by-state.html">Burial Costs by State</a></li><li><a href="funeral-costs-california.html">California Funeral Costs</a></li><li><a href="funeral-costs-texas.html">Texas Funeral Costs</a></li><li><a href="funeral-costs-florida.html">Florida Funeral Costs</a></li><li><a href="funeral-costs-new-york.html">New York Funeral Costs</a></li><li><a href="funeral-costs-pennsylvania.html">Pennsylvania Funeral Costs</a></li><li><a href="funeral-costs-illinois.html">Illinois Funeral Costs</a></li><li><a href="funeral-costs-ohio.html">Ohio Funeral Costs</a></li><li><a href="funeral-costs-georgia.html">Georgia Funeral Costs</a></li><li><a href="funeral-costs-north-carolina.html">North Carolina Funeral Costs</a></li><li><a href="funeral-costs-michigan.html">Michigan Funeral Costs</a></li></ul></div>

      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> This guide is for general educational purposes only and does not constitute financial, legal, tax, medical, or professional advice. Always consult licensed professionals before making decisions. Cost data is based on publicly available surveys and may not reflect current prices in your area.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn: p.fn, content };
}

// ── Hub Pages: Cremation & Burial by State ──────────────────────
function genCremationHub() {
  const fn = 'cremation-costs-by-state.html';
  const title = 'Cremation Costs by State (2026) — Compare All 50 States | From $1,000';
  const desc = 'How much does cremation cost in your state? Compare direct cremation and cremation service prices across all 50 states. Find the cheapest cremation near you — direct cremation from $1,000 to $3,000 depending on state.';
  const faq = [
    {q:'What is the average cremation cost in the US?',a:'The national average for a funeral with cremation is approximately $6,971, while direct cremation — without a viewing or service — averages $1,000 to $3,500 depending on location and provider.'},
    {q:'Which states have the cheapest cremation?',a:'States in the South and Mountain regions tend to have the lowest cremation costs. Mississippi, Oklahoma, Arkansas, and New Mexico typically offer direct cremation for under $1,500.'},
    {q:'Which states have the highest cremation rates?',a:'Western states lead in cremation rates. Oregon (78%), Washington (76%), Maine (75%), Hawaii (70%), and Montana (72%) have among the highest cremation rates in the country.'},
    {q:'Is direct cremation the cheapest funeral option?',a:'Yes, direct cremation is generally the most affordable disposition option in every state. It includes only the essential services: transportation, the cremation itself, and return of remains to the family.'}
  ];

  const regionGroups = {};
  states.forEach(s => {
    if (!regionGroups[s.region]) regionGroups[s.region] = [];
    regionGroups[s.region].push(s);
  });

  const stateRows = states
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => `<tr><td><a href="cremation-costs-${s.slug}.html">${s.name}</a></td><td class="cost-value">${$(s.dc)}</td><td>${$(s.c)}</td><td>${s.cr}</td></tr>`)
    .join('\n            ');

  const stateGrid = states
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => `<a href="cremation-costs-${s.slug}.html" class="state-card"><span class="state-name">${s.name}</span><span class="state-cost">From ${$(s.dc)}</span></a>`)
    .join('');

  const content = `${head(title, desc, fn, 'Cremation Costs by State', faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <span aria-current="page">Cremation Costs by State</span>
      </nav>

      <h1>Cremation Costs by State: 2026 Price Comparison</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, FCA, State Boards</span></span>
      </div>

      <p class="guide-intro">Cremation has become the most popular disposition choice in the United States, with the national cremation rate exceeding 60%. Costs vary significantly by state — direct cremation can range from under $1,000 in some Southern states to over $3,000 in the Northeast. This guide compares cremation costs across all 50 states to help you understand what to expect in your area.</p>

      <h2 id="all-states">Browse All 50 States</h2>
      <p>Click any state below for a detailed cremation cost guide including types, pricing breakdowns, regulations, and consumer rights.</p>
      <div class="state-grid">${stateGrid}</div>

      <h2 id="state-table">State-by-State Cremation Cost Table</h2>
      <p>The table below shows average cremation costs for all 50 states, including direct cremation (the most affordable option), cremation with a full funeral service, and the state's cremation rate. Click any state for detailed pricing.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Cremation Costs by State (2026)</caption>
          <thead><tr><th>State</th><th>Direct Cremation</th><th>Cremation w/ Service</th><th>Cremation Rate</th></tr></thead>
          <tbody>
            ${stateRows}
          </tbody>
        </table>
      </div>

      <h2 id="about">Understanding Cremation Costs</h2>
      <p>Cremation costs are driven by the same factors that affect all funeral pricing: cost of living, local competition, state regulations, and the specific services chosen. Direct cremation — where the body is cremated without a viewing or ceremony — is always the most affordable option. Adding a memorial service, urn upgrade, or scattering service will increase the total cost.</p>
      <p>Regardless of which state you are in, the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a> protects your right to choose only the services you want and to receive itemized pricing from any provider. You are never required to purchase a casket for cremation — a simple alternative container is sufficient.</p>

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(fn)}
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> Cost data is based on publicly available surveys and consumer research. Actual prices vary by provider. This information is for educational purposes only. Always consult licensed professionals before making funeral arrangements.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

function genBurialHub() {
  const fn = 'burial-costs-by-state.html';
  const title = 'Burial Costs by State (2026) — Cemetery Plots &amp; Funeral Prices | All 50 States';
  const desc = 'How much does burial cost in your state? Compare funeral service fees, cemetery plot prices, and total burial expenses in all 50 states. See which states are cheapest and how to reduce costs.';
  const faq = [
    {q:'What is the average burial cost in the US?',a:'A traditional funeral with burial costs approximately $7,848 nationally. Adding cemetery fees (plot, vault, opening/closing, headstone) brings the total to $10,000–$15,000 in most areas.'},
    {q:'Which states have the cheapest burial costs?',a:'Southern states tend to have the lowest burial costs. Mississippi, Oklahoma, Arkansas, and Alabama typically see traditional burials under $7,000 including basic cemetery fees.'},
    {q:'Is a burial vault required?',a:'Burial vaults are required by most cemeteries (as a matter of cemetery policy) to prevent ground settling, though they are rarely required by state law. Grave liners are a less expensive alternative. Always ask the cemetery about their specific requirements.'},
    {q:'What is the cheapest way to be buried?',a:'Direct burial (without a viewing or ceremony) is the most affordable burial option. Green burial, which skips embalming and uses a biodegradable container, is another cost-effective choice. Both can save thousands compared to a traditional funeral with burial.'}
  ];

  const stateRows = states
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => `<tr><td><a href="burial-costs-${s.slug}.html">${s.name}</a></td><td class="cost-value">${$(s.f)}</td><td>${$(s.b)}</td><td>${$(Math.round(s.f + s.b + s.b*0.9))}</td></tr>`)
    .join('\n            ');

  const stateGrid = states
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => `<a href="burial-costs-${s.slug}.html" class="state-card"><span class="state-name">${s.name}</span><span class="state-cost">From ${$(s.b)}</span></a>`)
    .join('');

  const content = `${head(title, desc, fn, 'Burial Costs by State', faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <span aria-current="page">Burial Costs by State</span>
      </nav>

      <h1>Burial Costs by State: 2026 Price Comparison</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, FCA, State Boards</span></span>
      </div>

      <p class="guide-intro">Traditional burial remains a deeply meaningful choice for many American families. However, the total cost — including the funeral service, cemetery plot, casket, vault, headstone, and associated fees — can vary by thousands of dollars between states. This guide compares burial costs across all 50 states to help you plan with realistic expectations and make informed decisions.</p>

      <h2 id="all-states">Browse All 50 States</h2>
      <p>Click any state below for a detailed burial cost guide including cemetery fees, casket options, and ways to save.</p>
      <div class="state-grid">${stateGrid}</div>

      <h2 id="state-table">State-by-State Burial Cost Table</h2>
      <p>The table below shows average burial costs for all 50 states, including the funeral service, cemetery plot, and estimated total (including vault, headstone, and opening/closing fees). Click any state for detailed pricing.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Burial Costs by State (2026)</caption>
          <thead><tr><th>State</th><th>Funeral Service</th><th>Cemetery Plot</th><th>Est. Total</th></tr></thead>
          <tbody>
            ${stateRows}
          </tbody>
        </table>
      </div>

      <h2 id="about">Understanding Burial Costs</h2>
      <p>Burial costs include more line items than most families expect. Beyond the funeral home's service fee, you will likely encounter charges for the cemetery plot, a burial vault or grave liner, opening and closing the grave, a headstone or marker, and perpetual care fees. These cemetery charges alone can add $3,000 to $8,000 to the funeral home bill.</p>
      <p>The most effective way to manage burial costs is to get itemized pricing from both the funeral home and the cemetery before committing. Under the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a>, funeral homes must provide a General Price List on request. Cemeteries are not covered by the FTC rule but most will provide their price sheet upon request. Comparing prices between 2-3 providers can save families significant money.</p>

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(fn)}
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> Cost data is based on publicly available surveys and consumer research. Actual prices vary by provider. This information is for educational purposes only. Always consult licensed professionals before making funeral arrangements.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Cremation Metro Pages ───────────────────────────────────────
function genCremationMetro(m) {
  const s = states.find(x => x.slug === m.ss);
  if (!s) return null;
  const fn = `cremation-costs-${m.slug}.html`;
  const mdc = Math.round(s.dc * m.mp);
  const mc = Math.round(s.c * m.mp);
  const crRate = parseInt(s.cr);
  const savingsVsBurial = $(Math.round(s.f * m.mp) - mdc);
  const title = `Cremation Cost in ${m.city} (2026) — From ${$(mdc)} | Save vs. Burial`;
  const desc = `Cremation in ${m.city}, ${m.st} in 2026: direct cremation from ${$(mdc)}, with service ${$(mc)}. Save up to ${savingsVsBurial} vs. traditional burial. Compare ${m.city} cremation providers and prices.`;

  const stateMetros = metros.filter(x => x.ss === m.ss && x.slug !== m.slug);
  const nearbyComparison = stateMetros.slice(0, 3);

  const faq = [
    {q:`How much does cremation cost in ${m.city}?`,a:`Cremation costs in ${m.city} range from ${$(mdc)} for direct cremation to ${$(mc)} for a full funeral service followed by cremation. These costs are ${m.mp > 1.1 ? 'higher than' : 'close to'} the ${m.st} state average of ${$(s.dc)} for direct cremation. Additional expenses may include urns ($50-$3,000), memorial services ($500-$2,000), and scattering fees ($200-$600).`},
    {q:`What types of cremation are available in ${m.city}?`,a:`${m.city} families can choose from: direct cremation (${$(mdc)}) — the most affordable option with no viewing or ceremony; cremation with memorial service — a ceremony held after cremation; and traditional cremation (${$(mc)}) — a full funeral service before cremation. Each can be customized to fit your family's needs and budget.`},
    {q:`Is cremation cheaper than burial in ${m.city}?`,a:`Yes. Direct cremation in ${m.city} at ${$(mdc)} saves families approximately ${savingsVsBurial} compared to a traditional funeral with burial. Even cremation with a full service (${$(mc)}) costs less than traditional burial when you factor in cemetery plot, vault, and headstone expenses.`},
    {q:`Where can I compare cremation prices in ${m.city}?`,a:`Under the FTC Funeral Rule, every cremation provider in ${m.city} must provide a General Price List upon request. Call 2-3 providers in the ${m.city} area to compare. You can also check Parting.com or the Funeral Consumers Alliance for local price comparisons. Direct cremation providers often offer the lowest rates.`},
    {q:`Can I scatter ashes in ${m.city}?`,a:`Scattering laws in the ${m.city} area follow ${m.st} state regulations. Generally, you may scatter ashes on private property with owner permission, at sea (3+ nautical miles offshore per EPA regulations), and in some designated areas. Check local ordinances in ${m.city} for specific rules. Alternatives include columbarium niches, burial of ashes, and memorial keepsakes.`}
  ];

  const nearbyCityRows = nearbyComparison.map(nc => {
    const ncdc = Math.round(s.dc * nc.mp);
    const ncc = Math.round(s.c * nc.mp);
    return `<tr><td><a href="cremation-costs-${nc.slug}.html">${nc.city}</a></td><td>${$(ncdc)}</td><td>${$(ncc)}</td></tr>`;
  }).join('\n            ');

  const nearbyCitySection = nearbyComparison.length > 0 ? `
      <h2>Compare: ${m.city} vs. Other ${m.st} Cities</h2>
      <p>Cremation costs vary across ${m.st}'s metro areas. Here is how ${m.city} compares:</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Cremation Cost Comparison in ${m.st} (2026)</caption>
          <thead><tr><th>City</th><th>Direct Cremation</th><th>Cremation w/ Service</th></tr></thead>
          <tbody>
            <tr><td><strong>${m.city}</strong></td><td><strong>${$(mdc)}</strong></td><td><strong>${$(mc)}</strong></td></tr>
            ${nearbyCityRows}
            <tr><td><a href="cremation-costs-${s.slug}.html">${m.st} Average</a></td><td>${$(s.dc)}</td><td>${$(s.c)}</td></tr>
          </tbody>
        </table>
      </div>` : '';

  const content = `${head(title, desc, fn, `Cremation Costs in ${m.city}`, faq, {name:`${s.name} Cremation Costs`,url:`cremation-costs-${s.slug}.html`})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="cremation-costs-by-state.html">Cremation Costs by State</a> &rsaquo; <a href="cremation-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">${m.city}</span>
      </nav>

      <h1>Cremation Costs in ${m.city}, ${m.st} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">State:</span> <span class="article-meta-value"><a href="cremation-costs-${s.slug}.html">${m.st}</a></span></span>
        <span class="article-meta-item"><span class="article-meta-label">Cremation Rate:</span> <span class="article-meta-value">${s.cr}</span></span>
      </div>

      <p class="guide-intro">If you are considering cremation in the ${m.city} area, this guide provides current pricing to help you plan. Cremation costs in ${m.city} tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average due to the local cost of living. With a statewide cremation rate of ${s.cr}, ${crRate > 55 ? 'cremation is the most popular choice' : 'cremation is increasingly popular'} among ${m.city} families.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(mdc)}</span><span class="stat-label">Direct Cremation</span></div>
        <div class="stat-box"><span class="stat-number">${$(mc)}</span><span class="stat-label">Cremation w/ Service</span></div>
        <div class="stat-box"><span class="stat-number">${s.cr}</span><span class="stat-label">Cremation Rate</span></div>
      </div>

      <h2>Types of Cremation in ${m.city}</h2>
      <div class="comparison-grid">
        <div class="comparison-card"><h3>Direct Cremation</h3><div class="price-range">${$(mdc)}</div><ul><li>Most affordable cremation option in ${m.city}</li><li>No viewing or ceremony before cremation</li><li>Body transferred directly to crematory</li><li>Remains returned to family</li><li>Memorial service can be held later at any location</li></ul></div>
        <div class="comparison-card"><h3>Cremation with Service</h3><div class="price-range">${$(mc)}</div><ul><li>Traditional funeral service before cremation</li><li>Viewing or visitation possible</li><li>Ceremony at funeral home, church, or venue</li><li>Typically includes basic urn</li><li>Full memorial experience for family and friends</li></ul></div>
      </div>

      <h2>Cremation Cost Breakdown for ${m.city}</h2>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${m.city} Cremation Costs (2026)</caption>
          <thead><tr><th>Item</th><th>${m.city} Avg.</th><th>${m.st} Avg.</th></tr></thead>
          <tbody>
            <tr><td>Direct cremation</td><td class="cost-value">${$(mdc)}</td><td>${$(s.dc)}</td></tr>
            <tr><td>Cremation with service</td><td class="cost-value">${$(mc)}</td><td>${$(s.c)}</td></tr>
            <tr><td>Basic urn</td><td class="cost-value">$50 – $300</td><td>$50 – $300</td></tr>
            <tr><td>Memorial service</td><td class="cost-value">$500 – $2,500</td><td>$500 – $2,000</td></tr>
            <tr><td>Cremation jewelry</td><td class="cost-value">$50 – $500</td><td>$50 – $500</td></tr>
            <tr><td>Scattering service</td><td class="cost-value">$200 – $800</td><td>$200 – $600</td></tr>
          </tbody>
        </table>
      </div>

      ${nearbyCitySection}

      <h2>How to Save on Cremation in ${m.city}</h2>
      <ul>
        <li>Compare prices from at least 3 cremation providers in the ${m.city} area — prices can vary by $1,000 or more</li>
        <li>Consider direct cremation at ${$(mdc)} for the most affordable option</li>
        <li>Purchase urns independently rather than through the cremation provider — savings of 50-80% are common</li>
        <li>Hold a memorial service at a private venue, park, or home instead of a funeral home</li>
        <li>Ask about veteran benefits or <a href="medicaid-funeral-assistance.html">Medicaid funeral assistance</a> if applicable</li>
        <li>Review our <a href="cheap-funeral-options.html">affordable funeral options guide</a> for more strategies</li>
      </ul>

      <div class="callout callout-tip"><strong>Cost-Saving Tip:</strong> You do not need to purchase an urn from the cremation provider. The <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a> protects your right to use any urn or container, including ones purchased independently. <a href="urn-buying-guide.html">See our urn buying guide</a>.</div>

      ${resources('cremation')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More in ${m.st}</h4><ul><li><a href="funeral-costs-${m.slug}.html">${m.city} Funeral Costs</a></li><li><a href="burial-costs-${m.slug}.html">${m.city} Burial Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${m.st} Cremation Costs</a></li><li><a href="funeral-costs-${s.slug}.html">${m.st} Funeral Costs</a></li><li><a href="burial-costs-${s.slug}.html">${m.st} Burial Costs</a></li></ul></div>

      ${relatedGuides(fn)}
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> Cost data is based on publicly available surveys and consumer research. Actual prices vary by provider. This information is for educational purposes only. Always consult licensed professionals before making funeral arrangements.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Burial Metro Pages ──────────────────────────────────────────
function genBurialMetro(m) {
  const s = states.find(x => x.slug === m.ss);
  if (!s) return null;
  const fn = `burial-costs-${m.slug}.html`;
  const mf = Math.round(s.f * m.mp);
  const mb = Math.round(s.b * m.mp);
  const totalBurial = $(Math.round(mf + mb + mb * 0.9));
  const totalBurialHigh = $(Math.round(mf * 1.3 + mb * 2 + mb * 0.9));
  const title = `Burial Cost in ${m.city} (2026) — Total ${totalBurial}+ | Cemetery &amp; Service Prices`;
  const desc = `Burial cost in ${m.city}, ${m.st} in 2026: funeral service ${$(mf)}, cemetery plot from ${$(mb)}, total ${totalBurial}–${totalBurialHigh}. Compare ${m.city} cemeteries and funeral homes. See how to save.`;

  const stateMetros = metros.filter(x => x.ss === m.ss && x.slug !== m.slug);
  const nearbyComparison = stateMetros.slice(0, 3);

  const faq = [
    {q:`How much does burial cost in ${m.city}?`,a:`A traditional burial in ${m.city} costs approximately ${$(mf)} for the funeral service plus ${$(mb)} for a cemetery plot. Including vault (${$(Math.round(mb * 0.4))}), opening/closing fees (${$(Math.round(mb * 0.5))}), casket (${$(Math.round(mf * 0.3))}), and headstone ($1,500-$3,000), the total ranges from ${totalBurial} to ${totalBurialHigh}.`},
    {q:`Is a burial vault required in ${m.city}?`,a:`Burial vaults are required by most cemeteries in the ${m.city} area as a matter of cemetery policy to prevent ground settling. They are rarely required by ${m.st} state law. A grave liner — a less expensive alternative — may meet the cemetery's requirements. Always ask your specific cemetery about their vault policy and whether cheaper alternatives are accepted.`},
    {q:`What are the cheapest burial options in ${m.city}?`,a:`The most affordable burial options in ${m.city} include: direct burial (no viewing or ceremony), which can save thousands on embalming and facility fees; green burial using a biodegradable container and no embalming; and purchasing a casket from an independent retailer to save 50-70%. Municipal and religious cemeteries in ${m.city} often have lower plot costs than private cemeteries.`},
    {q:`How do ${m.city} burial costs compare to ${m.st}?`,a:`Burial costs in ${m.city} are ${m.mp > 1.1 ? 'approximately ' + Math.round((m.mp-1)*100) + '% above' : 'close to'} the ${m.st} state average. At ${$(mf)} for a funeral service (vs. ${$(s.f)} statewide) and ${$(mb)} for a cemetery plot (vs. ${$(s.b)}), the ${m.city} metro premium reflects higher real estate and operating costs.`}
  ];

  const nearbyCityRows = nearbyComparison.map(nc => {
    const ncf = Math.round(s.f * nc.mp);
    const ncb = Math.round(s.b * nc.mp);
    return `<tr><td><a href="burial-costs-${nc.slug}.html">${nc.city}</a></td><td>${$(ncf)}</td><td>${$(ncb)}</td></tr>`;
  }).join('\n            ');

  const nearbyCitySection = nearbyComparison.length > 0 ? `
      <h2>Compare: ${m.city} vs. Other ${m.st} Cities</h2>
      <p>Burial costs vary within ${m.st}. Here is how ${m.city} compares:</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>Burial Cost Comparison in ${m.st} (2026)</caption>
          <thead><tr><th>City</th><th>Funeral Service</th><th>Cemetery Plot</th></tr></thead>
          <tbody>
            <tr><td><strong>${m.city}</strong></td><td><strong>${$(mf)}</strong></td><td><strong>${$(mb)}</strong></td></tr>
            ${nearbyCityRows}
            <tr><td><a href="burial-costs-${s.slug}.html">${m.st} Average</a></td><td>${$(s.f)}</td><td>${$(s.b)}</td></tr>
          </tbody>
        </table>
      </div>` : '';

  const content = `${head(title, desc, fn, `Burial Costs in ${m.city}`, faq, {name:`${s.name} Burial Costs`,url:`burial-costs-${s.slug}.html`})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="burial-costs-by-state.html">Burial Costs by State</a> &rsaquo; <a href="burial-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">${m.city}</span>
      </nav>

      <h1>Burial Costs in ${m.city}, ${m.st} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">State:</span> <span class="article-meta-value"><a href="burial-costs-${s.slug}.html">${m.st}</a></span></span>
      </div>

      <p class="guide-intro">Understanding the full cost of burial in ${m.city} — from funeral service fees to cemetery charges — helps families plan with confidence. Burial costs in the ${m.city} metropolitan area tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average. This guide breaks down what you can expect to pay and how to make informed decisions.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(mf)}</span><span class="stat-label">Avg. Funeral Service</span></div>
        <div class="stat-box"><span class="stat-number">${$(mb)}</span><span class="stat-label">Avg. Cemetery Plot</span></div>
        <div class="stat-box"><span class="stat-number">${$(Math.round(mf * 0.3))}</span><span class="stat-label">Avg. Casket</span></div>
      </div>

      <h2>Complete Burial Cost Breakdown for ${m.city}</h2>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${m.city} Burial Costs (2026)</caption>
          <thead><tr><th>Item</th><th>${m.city} Avg.</th><th>${m.st} Avg.</th></tr></thead>
          <tbody>
            <tr><td>Funeral service</td><td class="cost-value">${$(mf)}</td><td>${$(s.f)}</td></tr>
            <tr><td>Cemetery plot</td><td class="cost-value">${$(mb)}</td><td>${$(s.b)}</td></tr>
            <tr><td>Casket</td><td class="cost-value">${$(Math.round(mf * 0.3))}</td><td>${$(Math.round(s.f * 0.3))}</td></tr>
            <tr><td>Burial vault / liner</td><td class="cost-value">${$(Math.round(mb * 0.4))}</td><td>${$(Math.round(s.b * 0.4))}</td></tr>
            <tr><td>Opening &amp; closing grave</td><td class="cost-value">${$(Math.round(mb * 0.5))}</td><td>${$(Math.round(s.b * 0.5))}</td></tr>
            <tr><td>Headstone / marker</td><td class="cost-value">$1,500 – $3,500</td><td>$1,000 – $3,000</td></tr>
            <tr><td>Embalming</td><td class="cost-value">${$(Math.round(mf * 0.1))}</td><td>${$(Math.round(s.f * 0.1))}</td></tr>
          </tbody>
        </table>
      </div>

      <p>The total cost of burial in ${m.city}, including all cemetery fees, typically ranges from <strong>${totalBurial}</strong> to <strong>${totalBurialHigh}</strong> depending on the services and products chosen.</p>

      <h2>Burial Options in ${m.city}</h2>
      <ul>
        <li><strong>Traditional burial</strong> — Full funeral service with viewing, casket, and cemetery burial. The most traditional option with the highest cost.</li>
        <li><strong>Direct burial</strong> — Body is buried shortly after death without embalming, viewing, or ceremony. Saves significantly on facility and preparation costs.</li>
        <li><strong>Green burial</strong> — No embalming, biodegradable container, and a natural setting. Check for availability in the ${m.city} area. <a href="green-burial-options.html">Learn about green burial</a></li>
        <li><strong>Mausoleum entombment</strong> — Above-ground placement. Typically more expensive than ground burial but eliminates vault requirements.</li>
      </ul>

      ${nearbyCitySection}

      <h2>Ways to Reduce Burial Costs in ${m.city}</h2>
      <ul>
        <li>Compare prices from at least 3 funeral homes and cemeteries in the ${m.city} area</li>
        <li>Purchase caskets from independent retailers or online — savings of 50-70% are common. <a href="casket-buying-guide.html">See our casket buying guide</a></li>
        <li>Consider municipal or religious cemeteries, which often charge less than private ones</li>
        <li>Ask about grave liner options, which cost less than full burial vaults</li>
        <li>Explore <a href="best-burial-insurance.html">burial insurance</a> or <a href="funeral-payment-assistance.html">payment assistance programs</a></li>
        <li>Consider direct burial to eliminate embalming and facility costs</li>
      </ul>

      <div class="callout callout-tip"><strong>Save on Caskets:</strong> Under the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a>, funeral homes must accept caskets purchased from third-party retailers without charging handling fees. <a href="best-online-casket-retailers.html">Compare online casket retailers</a> to save significantly.</div>

      ${resources('burial')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More in ${m.st}</h4><ul><li><a href="funeral-costs-${m.slug}.html">${m.city} Funeral Costs</a></li><li><a href="cremation-costs-${m.slug}.html">${m.city} Cremation Costs</a></li><li><a href="burial-costs-${s.slug}.html">${m.st} Burial Costs</a></li><li><a href="funeral-costs-${s.slug}.html">${m.st} Funeral Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${m.st} Cremation Costs</a></li></ul></div>

      ${relatedGuides(fn)}
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> Cost data is based on publicly available surveys and consumer research. Actual prices vary by provider. This information is for educational purposes only. Always consult licensed professionals before making funeral arrangements.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn, content };
}

// ── Insurance / High-CPC Pages ──────────────────────────────────
const insurancePages = [
  {
    fn:'burial-insurance-seniors.html',
    t:'Burial Insurance for Seniors (2026) — Coverage for Ages 50–85',
    st:'Burial Insurance for Seniors',
    d:'Compare burial insurance plans for seniors ages 50 to 85. Learn about guaranteed issue, simplified issue, and whole life policies with costs, coverage amounts, and honest analysis.',
    sections:[
      {h:'Age-Based Coverage Options',content:`<p>Burial insurance — also called final expense insurance — is designed specifically for seniors who want to ensure their funeral costs are covered. These policies typically offer $5,000 to $25,000 in coverage with simplified underwriting that makes approval easier for older adults.</p><div class="comparison-grid"><div class="comparison-card"><h3>Ages 50–65</h3><div class="price-range">$30 – $80/month</div><ul><li>Widest range of policy options</li><li>Best rates available</li><li>Most carriers offer instant approval</li><li>Coverage from $5,000 to $25,000</li><li>No medical exam required</li></ul></div><div class="comparison-card"><h3>Ages 66–75</h3><div class="price-range">$60 – $150/month</div><ul><li>Simplified issue policies widely available</li><li>Some health questions required</li><li>Coverage from $5,000 to $20,000</li><li>Premiums locked — never increase</li><li>Many carriers still offer same-day approval</li></ul></div><div class="comparison-card"><h3>Ages 76–85</h3><div class="price-range">$100 – $250/month</div><ul><li>Guaranteed issue policies available (no health questions)</li><li>2-year waiting period on some policies</li><li>Coverage typically $5,000 to $15,000</li><li>Higher premiums reflect age risk</li><li>Valuable for those with health conditions</li></ul></div></div>`},
      {h:'Guaranteed Issue vs. Simplified Issue',content:`<p>Understanding the difference between these two policy types is crucial for choosing the right burial insurance:</p><div class="cost-table-wrap"><table class="cost-table"><caption>Burial Insurance Policy Types Compared</caption><thead><tr><th>Feature</th><th>Simplified Issue</th><th>Guaranteed Issue</th></tr></thead><tbody><tr><td>Health questions</td><td>Yes (5-12 questions)</td><td>No</td></tr><tr><td>Medical exam</td><td>No</td><td>No</td></tr><tr><td>Approval speed</td><td>Same day to 1 week</td><td>Immediate</td></tr><tr><td>Waiting period</td><td>None (immediate full coverage)</td><td>2-3 years (graded benefit)</td></tr><tr><td>Monthly cost (age 65, $10K)</td><td>$50 – $80</td><td>$80 – $120</td></tr><tr><td>Best for</td><td>Seniors in fair to good health</td><td>Seniors with serious health conditions</td></tr></tbody></table></div><div class="callout callout-tip"><strong>Important:</strong> If you can qualify for a simplified issue policy, it is almost always the better choice due to immediate full coverage and lower premiums. Guaranteed issue should be reserved for those who cannot pass health screening questions.</div>`},
      {h:'How Much Coverage Do You Need?',content:`<p>The right coverage amount depends on your expected funeral costs and any additional expenses you want covered:</p><ul><li><strong>$5,000 – $7,500</strong> — Covers direct cremation or a modest burial in most states</li><li><strong>$10,000 – $15,000</strong> — Covers a traditional funeral with burial in most markets</li><li><strong>$15,000 – $25,000</strong> — Covers a traditional funeral plus cemetery costs, headstone, and remaining medical bills</li></ul><p>Use our <a href="funeral-costs-by-state.html">state cost guide</a> to estimate funeral costs in your area, then add a buffer for inflation and unexpected expenses. The average traditional funeral costs $7,848 nationally, but varies significantly by location.</p>`}
    ],
    faq:[
      {q:'What is burial insurance for seniors?',a:'Burial insurance (final expense insurance) is a small whole life insurance policy designed to cover funeral and end-of-life costs. Policies range from $5,000 to $25,000 and are specifically marketed to seniors ages 50-85. Unlike term life insurance, burial insurance never expires and premiums never increase.'},
      {q:'Can you get burial insurance at age 80?',a:'Yes. Many insurance carriers offer burial insurance to adults up to age 85. At age 80, you can typically get $5,000-$15,000 in coverage. Guaranteed issue policies require no health questions, though they may include a 2-3 year waiting period before the full death benefit is available.'},
      {q:'How much does burial insurance cost per month?',a:'Monthly premiums depend on age, health, and coverage amount. A healthy 60-year-old might pay $40-$60/month for $10,000 in coverage. A 75-year-old might pay $80-$130 for the same amount. Guaranteed issue policies cost 30-50% more than simplified issue due to the additional risk the insurer assumes.'},
      {q:'Is burial insurance worth it for seniors?',a:'Burial insurance can be worth it if you want to ensure your family is not burdened with funeral costs. The average funeral costs $7,848-$10,000+. Without insurance or savings dedicated to this purpose, families may struggle with unexpected expenses during an already difficult time. However, if you have sufficient savings or existing life insurance, a separate burial policy may not be necessary.'},
      {q:'What happens to burial insurance money not used for the funeral?',a:'Burial insurance pays a lump sum to your named beneficiary. There is no requirement to use the money specifically for funeral costs — your beneficiary can use the funds for any purpose including outstanding medical bills, debts, or living expenses.'}
    ]
  },
  {
    fn:'cremation-insurance-guide.html',
    t:'Cremation Insurance (2026) — What It Covers, Costs &amp; Best Plans',
    st:'Cremation Insurance Guide',
    d:'Learn about cremation insurance — what it covers, how much it costs, and the best plans for 2026. Compare policies designed to cover cremation expenses.',
    sections:[
      {h:'What Is Cremation Insurance?',content:`<p>Cremation insurance is a type of final expense insurance specifically designed to cover the cost of cremation services. While any life insurance policy can technically pay for cremation, cremation-specific plans are tailored for smaller coverage amounts that match typical cremation costs of $1,000 to $7,000.</p><div class="stat-highlights"><div class="stat-box"><span class="stat-number">$1,000 – $3,500</span><span class="stat-label">Direct Cremation</span></div><div class="stat-box"><span class="stat-number">$4,000 – $7,000</span><span class="stat-label">Cremation w/ Service</span></div><div class="stat-box"><span class="stat-number">$15 – $60/mo</span><span class="stat-label">Typical Premium</span></div></div>`},
      {h:'Cremation Insurance vs. Prepaid Cremation Plans',content:`<p>Families often confuse cremation insurance with prepaid cremation plans. Here is how they differ:</p><div class="cost-table-wrap"><table class="cost-table"><caption>Cremation Insurance vs. Prepaid Plans</caption><thead><tr><th>Feature</th><th>Cremation Insurance</th><th>Prepaid Cremation Plan</th></tr></thead><tbody><tr><td>What it is</td><td>Life insurance policy</td><td>Contract with a specific provider</td></tr><tr><td>Payment</td><td>Monthly premiums</td><td>Lump sum or installments to provider</td></tr><tr><td>Flexibility</td><td>Beneficiary chooses any provider</td><td>Locked to one provider</td></tr><tr><td>Portability</td><td>Works anywhere in the US</td><td>May not transfer if you move</td></tr><tr><td>If provider closes</td><td>Not affected — insurance is separate</td><td>Funds may be at risk</td></tr><tr><td>Excess funds</td><td>Go to beneficiary</td><td>May not be refundable</td></tr></tbody></table></div><div class="callout callout-info"><strong>Recommendation:</strong> Cremation insurance generally offers more flexibility and security than prepaid plans. Your beneficiary can choose any provider and keep any excess funds. Prepaid plans can be risky if the provider goes out of business or you relocate. See our <a href="prepaid-funeral-plans-comparison.html">prepaid plans comparison</a> for more details.</div>`},
      {h:'How Much Cremation Insurance Do You Need?',content:`<p>The right coverage amount depends on the type of cremation you prefer and your location:</p><ul><li><strong>$3,000 – $5,000</strong> — Covers direct cremation in most states with some margin for incidental costs</li><li><strong>$5,000 – $10,000</strong> — Covers cremation with a memorial service, urn, and other expenses</li><li><strong>$10,000 – $15,000</strong> — Covers a full cremation funeral plus memorial, travel, or other final expenses</li></ul><p>Check our <a href="cremation-costs-by-state.html">cremation costs by state</a> guide to see average cremation prices in your area and determine the right coverage level.</p>`}
    ],
    faq:[
      {q:'What does cremation insurance cover?',a:'Cremation insurance pays a cash benefit to your beneficiary upon your death. While intended for cremation costs, the funds can be used for any purpose including the cremation itself, a memorial service, an urn, scattering arrangements, outstanding bills, or family expenses. The policy does not restrict how the money is spent.'},
      {q:'How much does cremation insurance cost?',a:'Cremation insurance typically costs $15-$60 per month depending on age, health, and coverage amount. A 60-year-old in good health might pay $20-$35/month for $5,000-$7,000 in coverage. Premiums are locked and never increase. No medical exam is required for most policies.'},
      {q:'Is cremation insurance the same as burial insurance?',a:'Cremation insurance and burial insurance are both types of final expense insurance. The only difference is marketing — cremation insurance is typically sold at lower coverage amounts ($3,000-$10,000) matching cremation costs, while burial insurance covers the full range up to $25,000. The actual policies work the same way.'},
      {q:'Can I get cremation insurance with no health questions?',a:'Yes. Guaranteed issue cremation insurance policies are available with no health questions for ages 50-85. However, these policies typically include a 2-3 year waiting period before the full benefit is payable. If you can answer health questions favorably, simplified issue policies offer immediate coverage at lower rates.'},
      {q:'At what age should I buy cremation insurance?',a:'The younger you purchase cremation insurance, the lower your locked-in premium will be. A 55-year-old will pay significantly less per month than a 75-year-old for the same coverage. However, cremation insurance is available and worthwhile at any age up to 85. The key factor is whether the total premiums you will pay are reasonable compared to the coverage amount.'}
    ]
  },
  {
    fn:'funeral-financing-options.html',
    t:'Funeral Financing Options (2026) — Loans, Payment Plans &amp; Assistance',
    st:'Funeral Financing Options',
    d:'Explore all funeral financing options including loans, payment plans, insurance assignments, government programs, and crowdfunding. Find the right way to cover funeral costs.',
    sections:[
      {h:'Overview of Funeral Financing',content:`<p>When funeral costs exceed your immediate resources, several financing options can help bridge the gap. Understanding all available options — from insurance assignments to government programs — ensures you find the most appropriate solution for your situation.</p><div class="stat-highlights"><div class="stat-box"><span class="stat-number">$7,848</span><span class="stat-label">Avg. Funeral Cost</span></div><div class="stat-box"><span class="stat-number">$1,000–$3,500</span><span class="stat-label">Direct Cremation</span></div><div class="stat-box"><span class="stat-number">60%+</span><span class="stat-label">Families Without Funeral Savings</span></div></div>`},
      {h:'Financing Options Compared',content:`<div class="cost-table-wrap"><table class="cost-table"><caption>Funeral Financing Options Comparison</caption><thead><tr><th>Option</th><th>Speed</th><th>Cost</th><th>Best For</th></tr></thead><tbody><tr><td>Life insurance assignment</td><td>3-10 days</td><td>No interest</td><td>Families with existing life insurance</td></tr><tr><td>Funeral home payment plan</td><td>Immediate</td><td>0-18% APR</td><td>Families needing time to pay</td></tr><tr><td>Personal loan</td><td>1-7 days</td><td>6-36% APR</td><td>Those with good credit</td></tr><tr><td>Credit card</td><td>Immediate</td><td>15-29% APR</td><td>Smaller expenses or 0% intro APR</td></tr><tr><td>Crowdfunding</td><td>1-3 days</td><td>Platform fees 3-5%</td><td>Community-supported families</td></tr><tr><td>Government assistance</td><td>2-8 weeks</td><td>Free</td><td>Qualifying low-income families</td></tr><tr><td>Burial insurance payout</td><td>1-4 weeks</td><td>Already paid via premiums</td><td>Those with existing policies</td></tr></tbody></table></div>`},
      {h:'Government Assistance Programs',content:`<p>Several government programs can help with funeral costs:</p><ul><li><strong>Social Security death benefit</strong> — $255 one-time payment for eligible survivors. <a href="social-security-death-benefit.html">Learn how to apply</a></li><li><strong>Veteran burial benefits</strong> — Up to $2,000+ in burial allowances, free cemetery plots at national cemeteries, and headstones/markers. <a href="veteran-burial-benefits.html">See eligibility requirements</a></li><li><strong>Medicaid funeral assistance</strong> — Most states offer $1,000-$5,000 toward funeral costs for Medicaid recipients. <a href="medicaid-funeral-assistance.html">Check your state's program</a></li><li><strong>FEMA funeral assistance</strong> — Available when death is related to a federally declared disaster</li><li><strong>County indigent burial programs</strong> — Most counties provide basic burial or cremation for those who cannot afford it</li></ul>`}
    ],
    faq:[
      {q:'Can you make payments on a funeral?',a:'Yes. Many funeral homes offer payment plans ranging from 12 to 60 months. Some charge no interest while others charge 10-18% APR. Always ask about payment options before signing any agreement, and get the terms in writing. Not all funeral homes offer financing, so call ahead if this is important to your planning.'},
      {q:'What happens if you cannot afford a funeral?',a:'If you cannot afford a funeral, several options exist: county indigent burial programs provide basic disposition at no cost; Medicaid may cover funeral expenses for eligible recipients; veteran benefits cover burial costs for qualifying veterans; crowdfunding platforms like GoFundMe can rally community support; and choosing direct cremation ($1,000-$3,500) is the most affordable option. See our complete guide to paying for a funeral with no money.'},
      {q:'Are funeral loans a good idea?',a:'Funeral loans can help when immediate funds are unavailable, but they come with interest charges that increase the total cost. Before borrowing, explore alternatives: insurance assignment, government programs, crowdfunding, payment plans from the funeral home, or reducing costs through simpler service options. If you do borrow, compare rates from multiple lenders and choose the shortest repayment term you can afford.'},
      {q:'Can life insurance pay for a funeral directly?',a:'Yes, through a process called insurance assignment. You can assign your life insurance policy to a funeral home, which receives payment directly from the insurer. This allows the funeral to proceed before the full claim is processed. Most funeral homes accept insurance assignments, though they may require partial upfront payment. The process typically takes 3-10 business days.'},
      {q:'How much does the government pay for funerals?',a:'Government funeral assistance varies: Social Security provides a $255 death benefit; VA burial allowances range from $300 to $2,000+ depending on circumstances; Medicaid burial allowances range from $1,000 to $5,000 by state; and FEMA provides up to $9,000 for disaster-related deaths. These programs have specific eligibility requirements — see our payment assistance guide for details.'}
    ]
  },
  {
    fn:'end-of-life-planning-checklist.html',
    t:'End-of-Life Planning Checklist (2026) — Complete Step-by-Step Guide',
    st:'End-of-Life Planning Checklist',
    d:'Comprehensive end-of-life planning checklist covering legal documents, financial planning, funeral wishes, medical directives, and digital assets. Plan with confidence.',
    sections:[
      {h:'Why End-of-Life Planning Matters',content:`<p>End-of-life planning goes beyond funeral arrangements. A complete plan ensures your wishes are documented, your family is prepared, and your legal and financial affairs are in order. Families who plan ahead report less stress, lower costs, and greater peace of mind during an already difficult time.</p><div class="callout callout-info"><strong>Did You Know?</strong> Only 34% of American adults have a will, and fewer than 30% have an advance healthcare directive. Completing these documents while you are healthy protects your family from costly legal proceedings and emotionally difficult decisions.</div>`},
      {h:'Legal Documents Checklist',content:`<ul><li><strong>Last will and testament</strong> — Names an executor, distributes assets, and can designate guardians for minor children. Cost: $300-$1,000 with an attorney, or $50-$200 using an online service. <a href="estate-planning-costs.html">See estate planning costs</a></li><li><strong>Advance healthcare directive / living will</strong> — Documents your wishes for medical treatment if you become incapacitated. Covers life support, resuscitation, feeding tubes, and pain management preferences.</li><li><strong>Durable power of attorney</strong> — Designates someone to make financial decisions on your behalf if you become unable to do so.</li><li><strong>Healthcare proxy / medical power of attorney</strong> — Designates someone to make medical decisions on your behalf.</li><li><strong>Beneficiary designations</strong> — Review and update beneficiaries on life insurance, retirement accounts, bank accounts, and investment accounts. These override your will.</li><li><strong>Trust (if applicable)</strong> — Helps avoid probate, provides for minor children, or manages assets for specific purposes. <a href="probate-process-costs.html">Learn about probate costs</a></li></ul>`},
      {h:'Financial Planning Checklist',content:`<ul><li><strong>Funeral funding</strong> — Ensure funeral costs are covered through savings, <a href="best-burial-insurance.html">burial insurance</a>, or a dedicated fund. The average funeral costs $7,848.</li><li><strong>Account inventory</strong> — List all bank accounts, investment accounts, retirement accounts, and insurance policies with account numbers and contact information.</li><li><strong>Debt inventory</strong> — Document all outstanding debts including mortgages, car loans, credit cards, and personal loans.</li><li><strong>Insurance review</strong> — Confirm life insurance coverage is adequate and beneficiaries are current. <a href="life-insurance-funeral-costs.html">Using life insurance for funeral costs</a></li><li><strong>Digital assets</strong> — List online accounts, passwords, cryptocurrency wallets, and subscription services. Designate a digital executor if possible.</li><li><strong>Safe deposit box</strong> — Ensure someone has access and knows the location of your important documents.</li></ul>`},
      {h:'Funeral Wishes Documentation',content:`<ul><li><strong>Disposition preference</strong> — Cremation, burial, green burial, body donation, or other. <a href="cremation-vs-burial-cost.html">Compare options</a></li><li><strong>Service preferences</strong> — Traditional funeral, memorial service, celebration of life, or no service.</li><li><strong>Specific requests</strong> — Music, readings, dress code, flowers vs. donations, open vs. closed casket.</li><li><strong>Location preferences</strong> — Specific funeral home, church, cemetery, or scattering location.</li><li><strong>Budget guidance</strong> — How much should be spent, and what matters most to you.</li><li><strong>Contact list</strong> — Who should be notified, and any specific wishes about the obituary.</li></ul><p>Document all preferences in writing and share copies with your family and estate executor. Our <a href="planning-checklist.html">funeral planning checklist</a> provides a detailed breakdown of funeral-specific decisions.</p>`}
    ],
    faq:[
      {q:'What should be included in an end-of-life plan?',a:'A complete end-of-life plan includes: legal documents (will, advance directive, power of attorney), financial organization (account inventories, insurance review, debt documentation), funeral wishes (disposition type, service preferences, budget), and practical preparations (digital asset access, safe deposit box information, contact lists). The goal is to ensure your family has clear guidance and access to everything they need.'},
      {q:'How much does end-of-life planning cost?',a:'Basic end-of-life planning can be done for under $500. A will costs $300-$1,000 through an attorney or $50-$200 online. Advance directives are often free through state forms. Power of attorney costs $100-$500. Burial insurance premiums depend on age and coverage. A trust, if needed, costs $1,000-$3,000. The cost of NOT planning — probate, family disputes, unexpected funeral bills — is significantly higher.'},
      {q:'When should you start end-of-life planning?',a:'The best time to start end-of-life planning is now, regardless of your age or health. All adults over 18 should have basic documents (will, advance directive, power of attorney). These should be reviewed every 3-5 years or after major life events like marriage, divorce, birth of children, or significant health changes. Planning while healthy ensures you are making clear-headed decisions and gives you time to compare options.'},
      {q:'What is the difference between a living will and an advance directive?',a:'The terms are often used interchangeably, though technically an advance directive is the broader document that may include both a living will (your treatment preferences) and a healthcare proxy designation (who makes decisions for you). Some states use different terminology. The important thing is to document both your treatment wishes AND designate a trusted decision-maker.'},
      {q:'How do I talk to my family about end-of-life planning?',a:'Start with practical topics rather than emotional ones. Frame the conversation around protecting the family: "I want to make sure you are not burdened with difficult decisions." Share your written plan and explain your reasoning. Be specific about your wishes. Encourage family members to create their own plans. Many families find it helpful to discuss planning during routine conversations rather than waiting for a health crisis.'}
    ]
  }
];

function genInsurancePage(p) {
  const faqSchema = p.faq && p.faq.length ? p.faq : [];

  const content = `${head(p.t, p.d, p.fn, p.st, faqSchema)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <span aria-current="page">${p.st}</span>
      </nav>

      <h1>${p.st}: What You Need to Know in 2026</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, Insurance Industry Data, Government Sources</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html" style="color:var(--brown-500);">Our Standards</a></span></span>
      </div>

      <p class="guide-intro">${p.d} This guide provides clear, honest, and independent information to help you make the best decision for your family.</p>

      <nav class="toc" aria-label="Table of contents">
        <p class="toc-heading">In This Guide</p>
        <ul class="toc-list">
          ${p.sections.map((s, i) => `<li><a href="#section-${i}">${s.h}</a></li>`).join('\n          ')}
          <li><a href="#faq">Frequently Asked Questions</a></li>
        </ul>
      </nav>

      ${p.sections.map((s, i) => `<h2 id="section-${i}">${s.h}</h2>\n      ${s.content}`).join('\n\n      ')}

      ${resources('general')}

      <h2 id="faq">Frequently Asked Questions</h2>
      ${p.faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(p.fn)}

      <div class="related-guides"><h3>Related Insurance &amp; Financial Guides</h3><ul><li><a href="best-burial-insurance.html">Best Burial Insurance Companies</a></li><li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a></li><li><a href="funeral-insurance-comparison.html">Funeral Insurance Comparison</a></li><li><a href="final-expense-insurance-guide.html">Final Expense Insurance Guide</a></li><li><a href="life-insurance-funeral-costs.html">Using Life Insurance for Funeral Costs</a></li><li><a href="prepaid-funeral-plans-comparison.html">Prepaid Funeral Plans Compared</a></li><li><a href="funeral-payment-plans.html">Funeral Payment Plans</a></li><li><a href="funeral-payment-assistance.html">Payment Assistance Programs</a></li></ul></div>

      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> This guide is for educational purposes only and does not constitute financial, legal, insurance, or professional advice. Insurance products and availability vary by state. Always consult licensed insurance professionals before purchasing any policy. We may receive compensation from partners, but this never influences our recommendations.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn: p.fn, content };
}

// ── Religious Funeral Guide Pages ───────────────────────────────
const religiousPages = [
  {
    fn:'catholic-funeral-costs.html',
    t:'Catholic Funeral Costs (2026) — Traditions, Services &amp; Pricing',
    st:'Catholic Funeral Costs',
    d:'Understand Catholic funeral costs including the vigil, funeral Mass, committal service, and burial requirements. Average costs range from $7,000 to $15,000.',
    tradition:'Catholic',
    details:{
      overview:'Catholic funerals follow a three-part structure: the vigil (wake), the funeral Mass, and the committal (burial). The Catholic Church has historically required burial over cremation, though since 1963 cremation has been permitted as long as ashes are interred in a sacred place — scattering of ashes is not allowed.',
      requirements:'<li>Burial is preferred, but cremation is allowed since 1963</li><li>Ashes must be interred in a cemetery, mausoleum, or columbarium — not scattered or kept at home</li><li>A funeral Mass is standard, typically celebrated by a parish priest</li><li>Open-casket viewing during the vigil is traditional but not required</li><li>The funeral typically takes place within 2-5 days of death</li>',
      costs:'<tr><td>Vigil / Wake service</td><td>$500 – $2,000</td></tr><tr><td>Funeral Mass (church offering)</td><td>$200 – $500</td></tr><tr><td>Funeral home services</td><td>$5,000 – $10,000</td></tr><tr><td>Casket</td><td>$1,000 – $5,000</td></tr><tr><td>Cemetery plot (Catholic cemetery)</td><td>$1,500 – $6,000</td></tr><tr><td>Burial vault</td><td>$800 – $4,000</td></tr><tr><td>Headstone / marker</td><td>$1,000 – $3,000</td></tr><tr><td>Flowers and music</td><td>$300 – $1,000</td></tr>',
      savingTips:'Catholic parishes often have relationships with local funeral homes that may offer parishioner discounts. Many Catholic cemeteries offer lower plot costs than private cemeteries. The church offering for the funeral Mass is typically a suggested donation, not a fixed fee. Catholic Charities and the St. Vincent de Paul Society may provide financial assistance for funeral costs in some dioceses.'
    }
  },
  {
    fn:'jewish-funeral-costs.html',
    t:'Jewish Funeral Costs (2026) — Traditions, Services &amp; Pricing',
    st:'Jewish Funeral Costs',
    d:'Understand Jewish funeral costs including chevra kadisha preparation, simple casket requirements, shiva customs, and burial practices. Costs range from $5,000 to $12,000.',
    tradition:'Jewish',
    details:{
      overview:'Jewish funerals emphasize simplicity, dignity, and equality in death. Tradition calls for prompt burial (ideally within 24 hours), a simple wooden casket, no embalming, and no public viewing of the body. The chevra kadisha (burial society) performs the ritual washing and preparation. After burial, the shiva period of mourning begins.',
      requirements:'<li>Burial should occur as soon as possible, ideally within 24 hours (not on Shabbat or major holidays)</li><li>Traditional requirement for a simple, all-wood casket with no metal hardware</li><li>Embalming and public viewing are traditionally not permitted</li><li>Cremation is prohibited in Orthodox Judaism, but accepted by some Reform and Conservative congregations</li><li>Tachrichim (simple white burial shrouds) are traditional</li><li>The body should not be left alone before burial (shomer tradition)</li>',
      costs:'<tr><td>Chevra kadisha preparation</td><td>$0 – $500 (often donated)</td></tr><tr><td>Simple wood casket</td><td>$500 – $2,000</td></tr><tr><td>Funeral home services</td><td>$3,000 – $7,000</td></tr><tr><td>Jewish cemetery plot</td><td>$2,000 – $8,000</td></tr><tr><td>Rabbi / officiant</td><td>$300 – $800</td></tr><tr><td>Burial (opening/closing)</td><td>$800 – $2,000</td></tr><tr><td>Headstone / unveiling</td><td>$1,000 – $4,000</td></tr><tr><td>Shiva expenses</td><td>$200 – $1,000</td></tr>',
      savingTips:'Jewish funerals are often less expensive than the national average because tradition requires simplicity — no elaborate casket, no embalming, no cosmetic preparation. Many synagogues have a chevra kadisha that provides preparation services at no or low cost. Jewish free burial societies exist in many communities for families with limited means. The simple casket requirement eliminates one of the largest funeral expenses.'
    }
  },
  {
    fn:'muslim-funeral-costs.html',
    t:'Muslim Funeral Costs (2026) — Islamic Traditions, Services &amp; Pricing',
    st:'Muslim Funeral Costs',
    d:'Understand Muslim funeral costs including ghusl washing, kafan shroud, Salat al-Janazah prayer, and Islamic burial requirements. Costs range from $3,000 to $8,000.',
    tradition:'Muslim',
    details:{
      overview:'Islamic funeral traditions emphasize simplicity, speed, and respect for the deceased. Burial should occur as soon as possible, ideally within 24 hours. The body is ritually washed (ghusl), wrapped in a white shroud (kafan), and buried facing Mecca. Cremation is not permitted in Islam. The funeral prayer (Salat al-Janazah) is performed by the community.',
      requirements:'<li>Burial should take place as soon as possible after death</li><li>The body is ritually washed (ghusl) by same-gender family members or community volunteers</li><li>White cotton shroud (kafan) is used instead of a casket where permitted by local law</li><li>Cremation is not allowed in Islam</li><li>Embalming is generally not permitted unless required by law</li><li>The body is buried facing Mecca (Qibla direction)</li><li>No elaborate casket or vault required by tradition (though local law may require a container)</li>',
      costs:'<tr><td>Ghusl preparation</td><td>$0 – $300 (often community service)</td></tr><tr><td>Kafan (shroud)</td><td>$50 – $200</td></tr><tr><td>Simple casket (where required by law)</td><td>$500 – $1,500</td></tr><tr><td>Funeral home / mosque services</td><td>$1,500 – $4,000</td></tr><tr><td>Islamic cemetery plot</td><td>$1,000 – $5,000</td></tr><tr><td>Imam / officiant</td><td>$0 – $500 (often donated)</td></tr><tr><td>Burial (opening/closing)</td><td>$800 – $2,000</td></tr><tr><td>Headstone / marker</td><td>$500 – $2,000</td></tr>',
      savingTips:'Muslim funerals are typically among the least expensive because tradition requires simplicity — no embalming, no elaborate casket, and no extensive cosmetic preparation. Many mosques provide ghusl and kafan services at no cost. Islamic burial societies and community organizations often assist with funeral expenses. The Muslim community tradition of quickly rallying support for bereaved families helps cover costs through collective contributions (sadaqah).'
    }
  },
  {
    fn:'hindu-funeral-costs.html',
    t:'Hindu Funeral &amp; Cremation Costs (2026) — Traditions &amp; Pricing',
    st:'Hindu Funeral & Cremation Costs',
    d:'Understand Hindu funeral and cremation costs including the Antyesti ceremony, cremation rituals, and memorial traditions. Costs range from $3,000 to $10,000.',
    tradition:'Hindu',
    details:{
      overview:'Hindu funeral traditions center on cremation (Antyesti), which is considered essential for releasing the soul (atman) from the body. The ceremony typically includes ritual washing, dressing the body in white, a funeral pyre or modern cremation, and the scattering of ashes in a sacred body of water. A period of mourning follows, concluding with a memorial ceremony on the 13th day.',
      requirements:'<li>Cremation is required (except for young children and saints, who may be buried)</li><li>Cremation should ideally occur within 24 hours of death</li><li>The eldest son or closest male relative traditionally lights the funeral pyre or initiates cremation</li><li>The body is bathed, dressed in white (or red for married women), and adorned with garlands</li><li>Ashes should be scattered in a sacred river or body of water</li><li>A 13-day mourning period is observed</li>',
      costs:'<tr><td>Body preparation and ritual washing</td><td>$200 – $500</td></tr><tr><td>Cremation service</td><td>$1,500 – $5,000</td></tr><tr><td>Flowers and garlands</td><td>$200 – $800</td></tr><tr><td>Pandit / priest services</td><td>$200 – $1,000</td></tr><tr><td>Funeral home facility</td><td>$1,000 – $3,000</td></tr><tr><td>Ash scattering service</td><td>$200 – $1,500</td></tr><tr><td>13th day memorial ceremony</td><td>$500 – $2,000</td></tr><tr><td>Urn (if needed temporarily)</td><td>$50 – $500</td></tr>',
      savingTips:'Hindu cremation costs are often lower than traditional Western funerals because no casket or cemetery plot is typically needed. Hindu temples and community organizations often provide priest services at minimal cost or by donation. Families can reduce costs by choosing direct cremation and holding the ritual ceremony separately. Community support during the mourning period often includes donated food and services.'
    }
  },
  {
    fn:'buddhist-funeral-costs.html',
    t:'Buddhist Funeral Costs (2026) — Traditions, Services &amp; Pricing',
    st:'Buddhist Funeral Costs',
    d:'Understand Buddhist funeral costs including meditation services, chanting ceremonies, cremation traditions, and memorial practices. Costs range from $3,000 to $12,000.',
    tradition:'Buddhist',
    details:{
      overview:'Buddhist funerals vary significantly by tradition (Theravada, Mahayana, Tibetan, Zen) and cultural background. Most Buddhist traditions accept both cremation and burial, though cremation is more common, following the tradition that the Buddha himself was cremated. Ceremonies typically include chanting, meditation, and offerings. Simplicity and mindfulness are emphasized.',
      requirements:'<li>Both cremation and burial are accepted; cremation is more traditional</li><li>Ceremonies typically include chanting of sutras and meditation</li><li>A monk or nun typically leads the funeral service</li><li>The body may be displayed for viewing before cremation or burial</li><li>A memorial altar with a photo, candles, incense, and flowers is traditional</li><li>Memorial services may be held at intervals (7 days, 49 days, 100 days)</li>',
      costs:'<tr><td>Monk / temple services</td><td>$200 – $1,000 (often by donation)</td></tr><tr><td>Cremation or burial service</td><td>$1,500 – $6,000</td></tr><tr><td>Funeral home facility</td><td>$1,000 – $3,000</td></tr><tr><td>Casket or container</td><td>$500 – $3,000</td></tr><tr><td>Memorial altar setup</td><td>$100 – $500</td></tr><tr><td>Flowers, incense, offerings</td><td>$200 – $800</td></tr><tr><td>Memorial ceremonies (49 days)</td><td>$500 – $2,000</td></tr><tr><td>Urn or columbarium niche</td><td>$100 – $3,000</td></tr>',
      savingTips:'Buddhist funerals can be relatively affordable when held at a temple rather than a funeral home. Many temples offer funeral services by donation rather than fixed fees. The emphasis on simplicity in many Buddhist traditions naturally reduces costs. Community support through the sangha (Buddhist community) often includes donated food and volunteer services during the mourning period.'
    }
  },
  {
    fn:'mormon-funeral-costs.html',
    t:'LDS / Mormon Funeral Costs (2026) — Traditions, Services &amp; Pricing',
    st:'LDS / Mormon Funeral Costs',
    d:'Understand LDS (Mormon) funeral costs including temple clothing, meetinghouse services, and burial traditions. Costs range from $6,000 to $14,000.',
    tradition:'LDS / Mormon',
    details:{
      overview:'The Church of Jesus Christ of Latter-day Saints (LDS/Mormon) has specific funeral traditions including dressing the deceased in temple clothing (for endowed members), holding the funeral service at a meetinghouse, and dedicating the grave. Burial is generally preferred over cremation, though cremation is not prohibited. The Church allows funeral services to be held in meetinghouses at no cost.',
      requirements:'<li>Burial is preferred, though cremation is now accepted by Church leadership</li><li>Endowed members are dressed in temple clothing by authorized individuals</li><li>Funeral services are typically held at the local meetinghouse</li><li>A priesthood holder dedicates the grave at the cemetery</li><li>The bishop presides over the funeral service</li><li>Services emphasize the plan of salvation and the hope of resurrection</li>',
      costs:'<tr><td>Meetinghouse use</td><td>$0 (provided by the Church)</td></tr><tr><td>Funeral home services</td><td>$4,000 – $8,000</td></tr><tr><td>Temple clothing</td><td>$50 – $200</td></tr><tr><td>Casket</td><td>$1,000 – $5,000</td></tr><tr><td>Cemetery plot</td><td>$1,000 – $5,000</td></tr><tr><td>Burial vault</td><td>$800 – $4,000</td></tr><tr><td>Headstone / marker</td><td>$1,000 – $3,000</td></tr><tr><td>Flowers and programs</td><td>$200 – $800</td></tr>',
      savingTips:'LDS funerals benefit from the Church providing meetinghouse facilities at no charge, which eliminates one of the significant costs of traditional funerals. Ward members often provide food for the post-funeral luncheon. The Church\'s welfare program and fast offering fund may assist families in financial need. Bishop\'s storehouse resources may also be available to support bereaved families.'
    }
  }
];

function genReligiousPage(p) {
  const faq = [
    {q:`How much does a ${p.tradition} funeral cost?`,a:`A ${p.tradition} funeral typically costs between the range shown in the cost breakdown above, depending on location, provider, and specific service choices. ${p.details.savingTips.split('.')[0]}.`},
    {q:`Does the ${p.tradition} tradition require burial or cremation?`,a:`${p.details.overview.split('.').slice(0, 2).join('.')}. See the detailed requirements section above for specific guidelines.`},
    {q:`How can I save on a ${p.tradition} funeral?`,a:`${p.details.savingTips}`},
    {q:`Are there financial assistance programs for ${p.tradition} funerals?`,a:`Many ${p.tradition} communities and religious organizations offer assistance for funeral costs. Contact your local house of worship for community-specific resources. Additionally, government programs like Social Security death benefits ($255), veteran burial benefits, and Medicaid funeral assistance are available regardless of religious tradition. See our payment assistance guide for details.`},
    {q:`What makes a ${p.tradition} funeral different from a secular funeral?`,a:`${p.details.overview}`}
  ];

  const content = `${head(p.t, p.d, p.fn, p.st, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="funeral-costs-by-religion.html">Funeral Costs by Religion</a> &rsaquo; <span aria-current="page">${p.tradition}</span>
      </nav>

      <h1>${p.tradition} Funeral Costs: Traditions and Pricing in 2026</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value">NFDA, Religious Organizations, Consumer Surveys</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html" style="color:var(--brown-500);">Our Standards</a></span></span>
      </div>

      <p class="guide-intro">${p.details.overview}</p>

      <nav class="toc" aria-label="Table of contents">
        <p class="toc-heading">In This Guide</p>
        <ul class="toc-list">
          <li><a href="#requirements">${p.tradition} Funeral Requirements</a></li>
          <li><a href="#costs">Cost Breakdown</a></li>
          <li><a href="#saving">Ways to Save</a></li>
          <li><a href="#faq">Frequently Asked Questions</a></li>
        </ul>
      </nav>

      <h2 id="requirements">${p.tradition} Funeral Requirements and Traditions</h2>
      <p>Understanding ${p.tradition} funeral traditions helps families honor their loved ones while making informed decisions about services and costs. Here are the key requirements and customs:</p>
      <ul>
        ${p.details.requirements}
      </ul>

      <h2 id="costs">${p.tradition} Funeral Cost Breakdown</h2>
      <p>The following table shows typical costs for a ${p.tradition} funeral. Actual costs vary significantly by location, provider, and specific service choices.</p>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${p.tradition} Funeral Cost Estimates (2026)</caption>
          <thead><tr><th>Item</th><th>Typical Cost Range</th></tr></thead>
          <tbody>
            ${p.details.costs}
          </tbody>
        </table>
      </div>

      <h2 id="saving">Ways to Save on a ${p.tradition} Funeral</h2>
      <p>${p.details.savingTips}</p>
      <p>For additional cost-saving strategies, see our guides to <a href="cheap-funeral-options.html">affordable funeral options</a> and <a href="funeral-payment-assistance.html">payment assistance programs</a>. Comparing prices from multiple providers using their <a href="ftc-funeral-rule-guide.html">FTC-required General Price Lists</a> can also save families significant money.</p>

      <div class="callout callout-info"><strong>Know Your Rights:</strong> Regardless of religious tradition, the <a href="ftc-funeral-rule-guide.html">FTC Funeral Rule</a> protects your right to receive itemized pricing, choose only the services you want, and use caskets or urns purchased from third parties. These federal protections apply at every funeral home in the United States.</div>

      ${resources('general')}

      <h2 id="faq">Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="related-guides"><h3>Funeral Costs by Religion</h3><ul><li><a href="funeral-costs-by-religion.html">Complete Guide: Funeral Costs by Religion</a></li><li><a href="catholic-funeral-costs.html">Catholic Funeral Costs</a></li><li><a href="jewish-funeral-costs.html">Jewish Funeral Costs</a></li><li><a href="muslim-funeral-costs.html">Muslim Funeral Costs</a></li><li><a href="hindu-funeral-costs.html">Hindu Funeral &amp; Cremation Costs</a></li><li><a href="buddhist-funeral-costs.html">Buddhist Funeral Costs</a></li><li><a href="mormon-funeral-costs.html">LDS / Mormon Funeral Costs</a></li></ul></div>

      ${relatedGuides(p.fn)}
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> This guide is for educational purposes only. Religious practices and requirements vary by community, congregation, and individual interpretation. Always consult with your religious leader or community for guidance specific to your tradition. Cost data is based on publicly available surveys and may not reflect current prices in your area.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn: p.fn, content };
}

// ── Generate All Pages ──────────────────────────────────────────
console.log('Generating pages...');
let count = { state: 0, metro: 0, cremation: 0, burial: 0, topical: 0, cremMetro: 0, burialMetro: 0, insurance: 0, religious: 0 };
const allPages = [];

// State pages
states.forEach(s => {
  const page = genState(s);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.state++;
});
console.log(`  State pages: ${count.state}`);

// Metro pages
metros.forEach(m => {
  const page = genMetro(m);
  if (page) {
    fs.writeFileSync(path.join(OUT, page.fn), page.content);
    allPages.push(page.fn);
    count.metro++;
  }
});
console.log(`  Metro pages: ${count.metro}`);

// Cremation state pages
states.forEach(s => {
  const page = genCremation(s);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.cremation++;
});
console.log(`  Cremation pages: ${count.cremation}`);

// Burial state pages
states.forEach(s => {
  const page = genBurial(s);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.burial++;
});
console.log(`  Burial pages: ${count.burial}`);

// Topical pages
topical.forEach(p => {
  const page = genTopical(p);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.topical++;
});
console.log(`  Topical pages: ${count.topical}`);

// Hub pages (cremation-by-state, burial-by-state)
const cremHub = genCremationHub();
fs.writeFileSync(path.join(OUT, cremHub.fn), cremHub.content);
allPages.push(cremHub.fn);
const burialHub = genBurialHub();
fs.writeFileSync(path.join(OUT, burialHub.fn), burialHub.content);
allPages.push(burialHub.fn);
console.log('  Hub pages: 2 (cremation-costs-by-state, burial-costs-by-state)');

// Cremation metro pages
metros.forEach(m => {
  const page = genCremationMetro(m);
  if (page) {
    fs.writeFileSync(path.join(OUT, page.fn), page.content);
    allPages.push(page.fn);
    count.cremMetro++;
  }
});
console.log(`  Cremation metro pages: ${count.cremMetro}`);

// Burial metro pages
metros.forEach(m => {
  const page = genBurialMetro(m);
  if (page) {
    fs.writeFileSync(path.join(OUT, page.fn), page.content);
    allPages.push(page.fn);
    count.burialMetro++;
  }
});
console.log(`  Burial metro pages: ${count.burialMetro}`);

// Insurance / High-CPC pages
insurancePages.forEach(p => {
  const page = genInsurancePage(p);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.insurance++;
});
console.log(`  Insurance pages: ${count.insurance}`);

// Religious funeral guide pages
religiousPages.forEach(p => {
  const page = genReligiousPage(p);
  fs.writeFileSync(path.join(OUT, page.fn), page.content);
  allPages.push(page.fn);
  count.religious++;
});
console.log(`  Religious funeral pages: ${count.religious}`);

// ── Generate Sitemap Index with Segmented Sitemaps ─────────────
const existingPages = [
  'index.html', 'chat.html', 'contact.html',
  'national-funeral-cost-index.html',
  'funeral-costs-by-state.html', 'cremation-vs-burial-cost.html', 'direct-cremation-cost.html',
  'funeral-cost-breakdown.html', 'funeral-payment-assistance.html', 'questions-to-ask-funeral-home.html',
  'what-funeral-homes-dont-tell-you.html', 'social-security-death-benefit.html', 'veteran-burial-benefits.html',
  'cheap-funeral-options.html', 'green-burial-options.html', 'prepaid-funeral-plans.html',
  'ftc-funeral-rule-guide.html', 'funeral-insurance-guide.html', 'home-funeral-guide.html',
  'obituary-writing-guide.html', 'grief-resources.html', 'planning-checklist.html',
  'about.html', 'editorial-standards.html', 'privacy-policy.html', 'terms-of-service.html', 'disclaimer.html',
  'funeral-cost-index-pdf.html', 'funeral-planning-checklist-printable.html',
  'funeral-cost-comparison-worksheet.html', 'funeral-cost-widget.html',
  'best-online-casket-retailers.html', 'best-cremation-urns.html',
  'best-burial-insurance.html', 'casket-buying-guide.html',
  'urn-buying-guide.html', 'funeral-insurance-comparison.html',
  'prepaid-funeral-plans-comparison.html', 'cremation-vs-burial-calculator.html',
  'funeral-costs-by-religion.html', 'state-funeral-regulations.html',
  'what-to-do-when-someone-dies.html', 'how-to-pay-for-a-funeral-with-no-money.html',
  'funeral-costs-rising-2026.html'
];

// Priority tiers: differentiate money pages from support pages
function sitemapPriority(p) {
  if (p === 'index.html') return '1.0';
  if (p === 'national-funeral-cost-index.html' || p === 'funeral-costs-by-state.html') return '1.0';
  if (p === 'cremation-costs-by-state.html' || p === 'burial-costs-by-state.html') return '0.9';
  if (p === 'average-funeral-cost-2026.html' || p === 'cremation-vs-burial-cost.html') return '0.9';
  if (p === 'direct-cremation-cost.html' || p === 'funeral-cost-breakdown.html') return '0.9';
  if (p === 'cheap-funeral-options.html' || p === 'how-to-pay-for-a-funeral-with-no-money.html') return '0.9';
  if (p.startsWith('funeral-costs-') && !p.includes('uninsured') && !p.includes('-by-') && !p.includes('rising')) return '0.8';
  if (p.startsWith('cremation-costs-') && !p.includes('-by-')) return '0.8';
  if (p.startsWith('burial-costs-') && !p.includes('-by-')) return '0.8';
  if (p.includes('insurance') || p.includes('payment') || p.includes('financing')) return '0.7';
  if (p === 'funeral-costs-rising-2026.html' || p === 'what-to-do-when-someone-dies.html') return '0.7';
  if (p === 'funeral-price-comparison.html' || p === 'funeral-payment-assistance.html') return '0.7';
  if (p === 'veteran-burial-benefits.html' || p === 'social-security-death-benefit.html') return '0.7';
  if (p === 'questions-to-ask-funeral-home.html' || p === 'what-funeral-homes-dont-tell-you.html') return '0.7';
  if (p.includes('privacy') || p.includes('editorial') || p.includes('terms-of') || p.includes('disclaimer')) return '0.3';
  if (p === 'chat.html' || p === 'contact.html' || p === 'about.html') return '0.4';
  return '0.6';
}

// Differentiated changefreq based on page type — signals crawl cadence to Google
function sitemapChangefreq(p) {
  if (p === 'index.html' || p === 'sitemap-index.html') return 'daily';
  if (p === 'national-funeral-cost-index.html' || p === 'funeral-costs-by-state.html') return 'daily';
  if (p === 'cremation-costs-by-state.html' || p === 'burial-costs-by-state.html') return 'daily';
  if (p === 'average-funeral-cost-2026.html') return 'weekly';
  if (p.startsWith('funeral-costs-') || p.startsWith('cremation-costs-') || p.startsWith('burial-costs-')) return 'weekly';
  if (p.includes('privacy') || p.includes('editorial') || p.includes('terms-of') || p.includes('disclaimer')) return 'monthly';
  return 'weekly';
}

// Stable, honest lastmod — a single site-wide content-update date.
// Google treats rotating per-deploy lastmod values as synthetic freshness and
// suppresses crawling/indexing for sitemaps that exhibit this pattern. The
// LASTMOD constant is the single source of truth and is bumped only when
// substantive content changes ship.
function sitemapLastmod(p, idx) {
  return LASTMOD;
}

// Build per-category URL lists for segmented sitemaps
const funeralStateUrls = [];
const cremationStateUrls = [];
const burialStateUrls = [];
const metroFuneralUrls = [];
const metroCremationUrls = [];
const metroBurialUrls = [];
const guideUrls = [];
const coreUrls = [];

// Classify all pages into categories
const allSitemapPages = existingPages.concat(allPages).concat(['sitemap-index.html']);
allSitemapPages.forEach((p, idx) => {
  const entry = { page: p, idx };
  // Metro pages (check before state pages since they also start with funeral-costs-)
  const isMetro = metros.some(m => p.includes(m.slug));
  if (isMetro && p.startsWith('funeral-costs-')) { metroFuneralUrls.push(entry); return; }
  if (isMetro && p.startsWith('cremation-costs-')) { metroCremationUrls.push(entry); return; }
  if (isMetro && p.startsWith('burial-costs-')) { metroBurialUrls.push(entry); return; }
  // State pages
  if (p.startsWith('funeral-costs-') && !p.includes('-by-') && !p.includes('uninsured') && !p.includes('rising')) { funeralStateUrls.push(entry); return; }
  if (p.startsWith('cremation-costs-') && !p.includes('-by-')) { cremationStateUrls.push(entry); return; }
  if (p.startsWith('burial-costs-') && !p.includes('-by-')) { burialStateUrls.push(entry); return; }
  // Core hub pages
  const corePages = ['index.html', 'funeral-costs-by-state.html', 'cremation-costs-by-state.html',
    'burial-costs-by-state.html', 'national-funeral-cost-index.html', 'average-funeral-cost-2026.html',
    'cremation-vs-burial-cost.html', 'direct-cremation-cost.html', 'funeral-cost-breakdown.html',
    'cheap-funeral-options.html', 'how-to-pay-for-a-funeral-with-no-money.html', 'sitemap-index.html'];
  if (corePages.includes(p)) { coreUrls.push(entry); return; }
  // Everything else goes to guides
  guideUrls.push(entry);
});

function buildSitemapXml(entries) {
  const urls = entries.map(e => {
    const loc = e.page === 'index.html' ? `${BASE}/` : `${BASE}/${e.page}`;
    return `  <url><loc>${loc}</loc><lastmod>${sitemapLastmod(e.page, e.idx)}</lastmod><changefreq>${sitemapChangefreq(e.page)}</changefreq><priority>${sitemapPriority(e.page)}</priority></url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

// Write segmented sitemaps
const sitemapSegments = [
  { file: 'sitemap-core.xml', entries: coreUrls },
  { file: 'sitemap-funeral-states.xml', entries: funeralStateUrls },
  { file: 'sitemap-cremation-states.xml', entries: cremationStateUrls },
  { file: 'sitemap-burial-states.xml', entries: burialStateUrls },
  { file: 'sitemap-metro-funeral.xml', entries: metroFuneralUrls },
  { file: 'sitemap-metro-cremation.xml', entries: metroCremationUrls },
  { file: 'sitemap-metro-burial.xml', entries: metroBurialUrls },
  { file: 'sitemap-guides.xml', entries: guideUrls }
];

sitemapSegments.forEach(seg => {
  if (seg.entries.length > 0) {
    fs.writeFileSync(path.join(OUT, seg.file), buildSitemapXml(seg.entries));
    console.log(`  Sitemap: ${seg.file} (${seg.entries.length} URLs)`);
  }
});

// Write sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapSegments.filter(s => s.entries.length > 0).map(s => `  <sitemap><loc>${BASE}/${s.file}</loc><lastmod>${LASTMOD}</lastmod></sitemap>`).join('\n')}
</sitemapindex>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemapIndex);
console.log(`  Sitemap index: sitemap.xml (${sitemapSegments.filter(s => s.entries.length > 0).length} sub-sitemaps)`);

// ── Generate HTML Sitemap Page ─────────────────────────────────
// Provides 1-click crawl path from homepage to EVERY page on the site
const htmlSitemapContent = `${head(
  'Site Map — All Pages | Funeral Cost & Burial Expense Analyzer',
  'Complete site map of funeralcostanalyzer.com with links to all funeral cost guides, state pages, cremation costs, burial costs, metro area pricing, and planning resources.',
  'sitemap-index.html',
  'Site Map',
  []
)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <span aria-current="page">Site Map</span>
      </nav>

      <h1>Complete Site Map</h1>
      <p class="guide-intro">Browse every page on Funeral Cost Analyzer. This directory links to all state guides, metro area pricing, cremation and burial costs, planning resources, and consumer rights information across all 50 states.</p>

      <h2 id="core">Core Pages &amp; Tools</h2>
      <ul class="sitemap-list">
        <li><a href="/">Home — Funeral Cost Calculator</a></li>
        <li><a href="national-funeral-cost-index.html">2026 National Funeral Cost Index</a></li>
        <li><a href="funeral-costs-by-state.html">Funeral Costs by State — All 50 States</a></li>
        <li><a href="cremation-costs-by-state.html">Cremation Costs by State</a></li>
        <li><a href="burial-costs-by-state.html">Burial Costs by State</a></li>
        <li><a href="average-funeral-cost-2026.html">Average Funeral Cost in 2026</a></li>
        <li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Cost Comparison</a></li>
        <li><a href="direct-cremation-cost.html">Direct Cremation Cost Guide</a></li>
        <li><a href="funeral-cost-breakdown.html">Funeral Cost Breakdown</a></li>
        <li><a href="cheap-funeral-options.html">Affordable Funeral Options</a></li>
        <li><a href="how-to-pay-for-a-funeral-with-no-money.html">How to Pay for a Funeral With No Money</a></li>
        <li><a href="chat.html">AI Funeral Cost Helper</a></li>
      </ul>

      <h2 id="funeral-by-state">Funeral Costs by State</h2>
      <div class="state-grid">
${states.map(s => `        <a href="funeral-costs-${s.slug}.html" class="state-card"><span class="state-name">${s.name}</span><span class="state-cost">${$(s.f)}</span></a>`).join('\n')}
      </div>

      <h2 id="cremation-by-state">Cremation Costs by State</h2>
      <div class="state-grid">
${states.map(s => `        <a href="cremation-costs-${s.slug}.html" class="state-card"><span class="state-name">${s.name}</span><span class="state-cost">${$(s.dc)}</span></a>`).join('\n')}
      </div>

      <h2 id="burial-by-state">Burial Costs by State</h2>
      <div class="state-grid">
${states.map(s => `        <a href="burial-costs-${s.slug}.html" class="state-card"><span class="state-name">${s.name}</span><span class="state-cost">${$(s.b)}</span></a>`).join('\n')}
      </div>

      <h2 id="metro-funeral">Funeral Costs by Metro Area</h2>
      <div class="state-grid">
${metros.map(m => { const s = states.find(x => x.slug === m.ss); return s ? `        <a href="funeral-costs-${m.slug}.html" class="state-card"><span class="state-name">${m.city}</span><span class="state-cost">${$(Math.round(s.f * m.mp))}</span></a>` : ''; }).filter(Boolean).join('\n')}
      </div>

      <h2 id="metro-cremation">Cremation Costs by Metro Area</h2>
      <div class="state-grid">
${metros.map(m => { const s = states.find(x => x.slug === m.ss); return s ? `        <a href="cremation-costs-${m.slug}.html" class="state-card"><span class="state-name">${m.city}</span><span class="state-cost">${$(Math.round(s.dc * m.mp))}</span></a>` : ''; }).filter(Boolean).join('\n')}
      </div>

      <h2 id="metro-burial">Burial Costs by Metro Area</h2>
      <div class="state-grid">
${metros.map(m => { const s = states.find(x => x.slug === m.ss); return s ? `        <a href="burial-costs-${m.slug}.html" class="state-card"><span class="state-name">${m.city}</span><span class="state-cost">${$(Math.round(s.b * m.mp))}</span></a>` : ''; }).filter(Boolean).join('\n')}
      </div>

      <h2 id="guides">Planning &amp; Consumer Guides</h2>
      <ul class="sitemap-list">
        <li><a href="funeral-price-comparison.html">How to Compare Funeral Prices</a></li>
        <li><a href="ftc-funeral-rule-guide.html">FTC Funeral Rule — Your Consumer Rights</a></li>
        <li><a href="consumer-rights-funeral-pricing.html">Consumer Rights in Funeral Pricing</a></li>
        <li><a href="questions-to-ask-funeral-home.html">Questions to Ask Funeral Homes</a></li>
        <li><a href="what-funeral-homes-dont-tell-you.html">What Funeral Homes Don't Tell You</a></li>
        <li><a href="funeral-overcharging-protection.html">Funeral Overcharging Protection</a></li>
        <li><a href="planning-checklist.html">Funeral Planning Checklist</a></li>
        <li><a href="what-to-do-when-someone-dies.html">What to Do When Someone Dies</a></li>
        <li><a href="funeral-planning-for-parents.html">Planning a Funeral for Aging Parents</a></li>
        <li><a href="green-burial-options.html">Green Burial Options</a></li>
        <li><a href="home-funeral-guide.html">Home Funeral Guide</a></li>
        <li><a href="body-donation-guide.html">Body Donation Programs</a></li>
        <li><a href="obituary-writing-guide.html">Obituary Writing Guide</a></li>
        <li><a href="grief-resources.html">Grief Resources</a></li>
      </ul>

      <h2 id="financial">Financial &amp; Insurance Guides</h2>
      <ul class="sitemap-list">
        <li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a></li>
        <li><a href="funeral-insurance-comparison.html">Funeral Insurance Comparison</a></li>
        <li><a href="best-burial-insurance.html">Best Burial Insurance Companies</a></li>
        <li><a href="final-expense-insurance-guide.html">Final Expense Insurance Guide</a></li>
        <li><a href="cremation-insurance-guide.html">Cremation Insurance Guide</a></li>
        <li><a href="burial-insurance-seniors.html">Burial Insurance for Seniors</a></li>
        <li><a href="funeral-payment-assistance.html">Payment Assistance Programs</a></li>
        <li><a href="funeral-payment-plans.html">Funeral Payment Plans &amp; Financing</a></li>
        <li><a href="funeral-financing-options.html">Funeral Financing Options</a></li>
        <li><a href="medicaid-funeral-assistance.html">Medicaid Funeral Assistance</a></li>
        <li><a href="veteran-burial-benefits.html">Veteran Burial Benefits</a></li>
        <li><a href="military-funeral-honors.html">Military Funeral Honors</a></li>
        <li><a href="social-security-death-benefit.html">Social Security Death Benefit</a></li>
        <li><a href="life-insurance-funeral-costs.html">Life Insurance for Funeral Costs</a></li>
        <li><a href="crowdfunding-funeral-costs.html">Crowdfunding for Funeral Costs</a></li>
        <li><a href="funeral-costs-uninsured.html">Funeral Costs When Uninsured</a></li>
        <li><a href="estate-planning-costs.html">Estate Planning Costs</a></li>
        <li><a href="probate-process-costs.html">Probate Process &amp; Costs</a></li>
        <li><a href="prepaid-funeral-plans.html">Prepaid Funeral Plans</a></li>
        <li><a href="prepaid-funeral-plans-comparison.html">Prepaid Plans Comparison</a></li>
      </ul>

      <h2 id="products">Product &amp; Buying Guides</h2>
      <ul class="sitemap-list">
        <li><a href="best-online-casket-retailers.html">Best Online Casket Retailers</a></li>
        <li><a href="casket-buying-guide.html">Casket Buying Guide</a></li>
        <li><a href="best-cremation-urns.html">Best Cremation Urns</a></li>
        <li><a href="urn-buying-guide.html">Urn Buying Guide</a></li>
        <li><a href="headstone-monument-costs.html">Headstone &amp; Monument Costs</a></li>
        <li><a href="cremation-jewelry-guide.html">Cremation Jewelry Guide</a></li>
        <li><a href="funeral-flowers-guide.html">Funeral Flowers Guide</a></li>
      </ul>

      <h2 id="religious">Funeral Costs by Religion</h2>
      <ul class="sitemap-list">
        <li><a href="funeral-costs-by-religion.html">Funeral Costs by Religion — Overview</a></li>
        <li><a href="catholic-funeral-costs.html">Catholic Funeral Costs</a></li>
        <li><a href="jewish-funeral-costs.html">Jewish Funeral Costs</a></li>
        <li><a href="muslim-funeral-costs.html">Muslim Funeral Costs</a></li>
        <li><a href="hindu-funeral-costs.html">Hindu Funeral &amp; Cremation Costs</a></li>
        <li><a href="buddhist-funeral-costs.html">Buddhist Funeral Costs</a></li>
        <li><a href="mormon-funeral-costs.html">LDS / Mormon Funeral Costs</a></li>
        <li><a href="nondenominational-funeral-costs.html">Non-Denominational Funeral Costs</a></li>
        <li><a href="baptist-funeral-costs.html">Baptist Funeral Costs</a></li>
        <li><a href="orthodox-funeral-costs.html">Orthodox Christian Funeral Costs</a></li>
      </ul>

      <h2 id="tools">Tools &amp; Resources</h2>
      <ul class="sitemap-list">
        <li><a href="cremation-vs-burial-calculator.html">Cremation vs. Burial Calculator</a></li>
        <li><a href="funeral-cost-comparison-worksheet.html">Cost Comparison Worksheet</a></li>
        <li><a href="funeral-planning-checklist-printable.html">Printable Planning Checklist</a></li>
        <li><a href="funeral-cost-index-pdf.html">Cost Index PDF Download</a></li>
        <li><a href="funeral-cost-widget.html">Embeddable Cost Widget</a></li>
        <li><a href="state-funeral-regulations.html">State Funeral Regulations</a></li>
        <li><a href="infant-child-funeral-costs.html">Infant &amp; Child Funeral Costs</a></li>
        <li><a href="pet-cremation-costs.html">Pet Cremation Costs</a></li>
        <li><a href="funeral-costs-rising-2026.html">Why Funeral Costs Are Rising in 2026</a></li>
      </ul>

      <h2 id="about">About &amp; Legal</h2>
      <ul class="sitemap-list">
        <li><a href="about.html">About Us</a></li>
        <li><a href="editorial-standards.html">Editorial Standards</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="privacy-policy.html">Privacy Policy</a></li>
        <li><a href="terms-of-service.html">Terms of Service</a></li>
        <li><a href="disclaimer.html">Disclaimer</a></li>
      </ul>

      ${ctaBanner()}
    </article>
  </main>
${footer()}`;
fs.writeFileSync(path.join(OUT, 'sitemap-index.html'), htmlSitemapContent);
console.log('  HTML sitemap page: sitemap-index.html');

const total = count.state + count.metro + count.cremation + count.burial + count.topical + count.cremMetro + count.burialMetro + count.insurance + count.religious;
console.log(`\n=== Page Generation Complete ===`);
console.log(`State pages: ${count.state}`);
console.log(`Metro pages: ${count.metro}`);
console.log(`Cremation state pages: ${count.cremation}`);
console.log(`Burial state pages: ${count.burial}`);
console.log(`Cremation metro pages: ${count.cremMetro}`);
console.log(`Burial metro pages: ${count.burialMetro}`);
console.log(`Topical pages: ${count.topical}`);
console.log(`Insurance/financial pages: ${count.insurance}`);
console.log(`Religious funeral pages: ${count.religious}`);
console.log(`Total new pages: ${total}`);
console.log(`Sitemap updated with ${existingPages.length + allPages.length} total pages`);

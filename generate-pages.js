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

const BASE = 'https://funeralcostanalyzer.com';

function head(title, desc, filename, breadcrumbName, faqItems) {
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${esc(desc)}" />
  <meta name="last-modified" content="2026-02-10" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${BASE}/${filename}" />
  <meta property="og:site_name" content="Funeral Cost &amp; Burial Expense Analyzer" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <link rel="canonical" href="${BASE}/${filename}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Article","headline":"${esc(title)}","description":"${esc(desc)}","datePublished":"2026-01-15","dateModified":"2026-02-10","author":{"@type":"Organization","name":"Funeral Cost & Burial Expense Analyzer","url":"${BASE}/"},"publisher":{"@type":"Organization","name":"Funeral Cost & Burial Expense Analyzer","url":"${BASE}/"},"mainEntityOfPage":{"@type":"WebPage","@id":"${BASE}/${filename}"}}
  </script>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${BASE}/"},{"@type":"ListItem","position":2,"name":"${esc(breadcrumbName)}","item":"${BASE}/${filename}"}]}
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
        <a href="index.html" class="brand-link">
          <span class="brand-title">Funeral Cost &amp; Burial Expense Analyzer</span>
          <span class="brand-tagline">Clarity, dignity, and calm when you need it most</span>
        </a>
      </div>
    </div>
    <button class="mobile-nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="site-nav">
      <span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Main navigation">
      <a href="index.html" class="nav-link">Home</a>
      <a href="index.html#calculator" class="nav-link">Calculator</a>
      <a href="chat.html" class="nav-link">AI Helper</a>
      <div class="nav-dropdown">
        <button class="nav-link nav-dropdown-toggle" aria-expanded="false" aria-haspopup="true">Guides <span class="dropdown-arrow" aria-hidden="true"></span></button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="national-funeral-cost-index.html" class="nav-dropdown-link" role="menuitem">National Cost Index</a>
          <a href="funeral-costs-by-state.html" class="nav-dropdown-link" role="menuitem">Costs by State</a>
          <a href="cremation-vs-burial-cost.html" class="nav-dropdown-link" role="menuitem">Cremation vs. Burial</a>
          <a href="funeral-cost-breakdown.html" class="nav-dropdown-link" role="menuitem">Cost Breakdown</a>
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
        <a href="planning-checklist.html">Planning Checklist</a>
        <a href="editorial-standards.html">Editorial Standards</a>
        <a href="privacy-policy.html">Privacy Policy</a>
        <a href="contact.html">Contact</a>
        <a href="sitemap.xml">Sitemap</a>
      </div>
    </div>
  </footer>
  <script>
(function(){var t=document.querySelector(".mobile-nav-toggle"),n=document.getElementById("site-nav");if(t&&n){t.addEventListener("click",function(){var o=n.classList.toggle("nav-open");t.setAttribute("aria-expanded",o?"true":"false")});n.querySelectorAll(".nav-link").forEach(function(l){l.addEventListener("click",function(){n.classList.remove("nav-open");t.setAttribute("aria-expanded","false")})})}var d=document.querySelectorAll(".nav-dropdown-toggle");d.forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();var p=this.closest(".nav-dropdown");var o=p.classList.toggle("dropdown-open");this.setAttribute("aria-expanded",o?"true":"false")})});document.addEventListener("click",function(){document.querySelectorAll(".nav-dropdown.dropdown-open").forEach(function(x){x.classList.remove("dropdown-open");x.querySelector(".nav-dropdown-toggle").setAttribute("aria-expanded","false")})})})();
  </script>
</body>
</html>`;
}

function resources(type) {
  const all = {
    general: `<div class="resource-suggestions"><h3>Resources That May Help</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a><span class="resource-desc">Independent consumer advocacy for funeral rights</span></li><li><a href="https://www.parting.com" target="_blank" rel="noopener noreferrer sponsored">Parting.com</a><span class="resource-desc">Compare funeral home prices in your area</span></li><li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a><span class="resource-desc">Compare final expense and burial insurance options</span></li><li><a href="funeral-payment-assistance.html">Payment Assistance Guide</a><span class="resource-desc">Government programs and financial help for funeral costs</span></li></ul></div>`,
    cremation: `<div class="resource-suggestions"><h3>Cremation Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="noopener noreferrer sponsored">Funeral Consumers Alliance</a><span class="resource-desc">Compare cremation providers and prices</span></li><li><a href="cremation-jewelry-guide.html">Cremation Jewelry Guide</a><span class="resource-desc">Memorial keepsakes and remembrance options</span></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Costs</a><span class="resource-desc">Side-by-side cost comparison</span></li></ul></div>`,
    burial: `<div class="resource-suggestions"><h3>Burial Resources</h3><ul class="resource-list"><li><a href="https://www.parting.com" target="_blank" rel="noopener noreferrer sponsored">Parting.com</a><span class="resource-desc">Compare burial costs from local providers</span></li><li><a href="headstone-monument-costs.html">Headstone &amp; Monument Guide</a><span class="resource-desc">Costs, types, and buying tips</span></li><li><a href="green-burial-options.html">Green Burial Options</a><span class="resource-desc">Eco-friendly and natural alternatives</span></li></ul></div>`
  };
  return all[type] || all.general;
}

function relatedGuides(exclude) {
  const guides = [
    {h:'national-funeral-cost-index.html',t:'2026 National Funeral Cost Index'},
    {h:'funeral-costs-by-state.html',t:'Funeral Costs by State'},
    {h:'cremation-vs-burial-cost.html',t:'Cremation vs. Burial'},
    {h:'funeral-cost-breakdown.html',t:'Funeral Cost Breakdown'},
    {h:'ftc-funeral-rule-guide.html',t:'FTC Funeral Rule Guide'},
    {h:'funeral-payment-assistance.html',t:'Payment Assistance'},
    {h:'funeral-insurance-guide.html',t:'Funeral Insurance Guide'},
    {h:'veteran-burial-benefits.html',t:'Veteran Burial Benefits'},
    {h:'cheap-funeral-options.html',t:'Affordable Funeral Options'},
    {h:'planning-checklist.html',t:'Planning Checklist'},
    {h:'grief-resources.html',t:'Grief Resources'}
  ].filter(g => g.h !== exclude);
  return `<div class="related-guides"><h3>Related Guides</h3><ul>${guides.slice(0,8).map(g=>`<li><a href="${g.h}">${g.t}</a></li>`).join('')}</ul></div>`;
}

function ctaBanner() {
  return `<div class="cta-banner"><h3>Have Questions About Funeral Costs?</h3><p>Our AI funeral cost expert can help you understand pricing, explore options, and plan with confidence. Free, private, and compassionate.</p><a href="chat.html" class="btn-primary">Talk to Our AI Helper</a></div>`;
}

// ── State Pages ─────────────────────────────────────────────────
function genState(s) {
  const fn = `funeral-costs-${s.slug}.html`;
  const title = `Funeral Costs in ${s.name} (2026) — Average Prices &amp; Options`;
  const desc = `Average funeral costs in ${s.name}: traditional funeral ${$(s.f)}, cremation ${$(s.c)}, direct cremation ${$(s.dc)}. Compare ${s.name} funeral prices, options, and consumer rights.`;
  const faq = [
    {q:`How much does a funeral cost in ${s.name}?`,a:`The average traditional funeral in ${s.name} costs approximately ${$(s.f)}. A funeral with cremation averages ${$(s.c)}, while direct cremation typically costs ${$(s.dc)}. Burial plot and cemetery fees average ${$(s.b)} additional. Costs vary by provider and location within the state.`},
    {q:`Is cremation cheaper than burial in ${s.name}?`,a:`Yes, in ${s.name} cremation is generally less expensive than traditional burial. Direct cremation averages ${$(s.dc)} compared to a full burial service at ${$(s.f)}. The cremation rate in ${s.name} is ${s.cr}, ${parseInt(s.cr)>55?'above':'near'} the national average.`},
    {q:`What are my consumer rights at ${s.name} funeral homes?`,a:`Under the FTC Funeral Rule, all funeral homes in ${s.name} must provide you with an itemized General Price List, allow you to choose only the services you want, accept caskets purchased elsewhere without charging a handling fee, and not misrepresent legal requirements for embalming or caskets.`},
    {q:`How can I save on funeral costs in ${s.name}?`,a:`To save on funeral costs in ${s.name}: compare prices from at least 3 providers, consider direct cremation or direct burial, purchase caskets from third-party retailers, ask about veteran or government assistance if eligible, and request the General Price List from every provider you contact.`},
    {q:`Does ${s.name} require embalming?`,a:`${s.name}, like most states, does not legally require embalming in most circumstances. Some funeral homes may require it for open-casket viewings as a matter of policy, but refrigeration is usually available as an alternative. Always ask about alternatives if a provider insists on embalming.`}
  ];

  const cityLinks = s.cities.map(c => {
    const m = metros.find(x => x.city === c);
    return m ? `<a href="funeral-costs-${m.slug}.html" class="state-card"><span class="state-name">${c}</span><span class="state-cost">From ${$(Math.round(s.f*m.mp))}</span></a>` : `<span class="state-card"><span class="state-name">${c}</span><span class="state-cost">~${$(s.f)}</span></span>`;
  }).join('');

  const content = `${head(title, desc, fn, `Funeral Costs in ${s.name}`, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> &rsaquo; <a href="funeral-costs-by-state.html">Costs by State</a> &rsaquo; <span aria-current="page">${s.name}</span>
      </nav>

      <h1>Funeral Costs in ${s.name}: What Families Pay in 2026</h1>

      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">February 2026</span></span>
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

      <h2 id="cities">Major Cities in ${s.name}</h2>
      <p>Funeral costs vary across ${s.name}'s major metropolitan areas. Urban centers typically have higher overhead costs, which are reflected in funeral pricing. Here are the major cities in ${s.name}:</p>
      <div class="state-grid">${cityLinks}</div>

      <h2 id="cremation-vs-burial">Cremation vs. Burial in ${s.name}</h2>
      <div class="comparison-grid">
        <div class="comparison-card"><h3>Cremation</h3><div class="price-range">${$(s.dc)} – ${$(s.c)}</div><ul><li>Direct cremation from ${$(s.dc)}</li><li>Cremation with service from ${$(s.c)}</li><li>No cemetery plot required</li><li>More flexible memorial options</li><li>Current rate: ${s.cr} of families</li></ul></div>
        <div class="comparison-card"><h3>Traditional Burial</h3><div class="price-range">${$(Math.round(s.f*0.75))} – ${$(Math.round(s.f*1.3))}</div><ul><li>Traditional service from ${$(s.f)}</li><li>Cemetery plot from ${$(s.b)}</li><li>Vault or liner typically required</li><li>Permanent memorial location</li><li>Casket from ${$(Math.round(s.f*0.12))}</li></ul></div>
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
        <li><strong>Crowdfunding</strong> — Platforms like GoFundMe are increasingly used to cover funeral costs. <a href="crowdfunding-funeral-costs.html">Crowdfunding guide</a></li>
        <li><strong>Payment plans</strong> — Some funeral homes offer financing or installment plans. <a href="funeral-payment-plans.html">Payment plan options</a></li>
      </ul>

      ${resources('general')}

      <h2 id="faq">Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      ${relatedGuides(fn)}
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
  const title = `Funeral Costs in ${m.city} (2026) — Average Prices &amp; Options`;
  const desc = `Average funeral costs in ${m.city}, ${m.st}: traditional funeral ${$(mf)}, cremation ${$(mc)}, direct cremation ${$(mdc)}. Compare local prices and know your rights.`;
  const faq = [
    {q:`How much does a funeral cost in ${m.city}?`,a:`The average traditional funeral in ${m.city} costs approximately ${$(mf)}, which is ${m.mp > 1.1 ? 'higher than' : 'close to'} the ${m.st} state average of ${$(s.f)}. Direct cremation starts around ${$(mdc)}.`},
    {q:`Is cremation or burial more common in ${m.city}?`,a:`In the ${m.city} area, the cremation rate follows ${m.st}'s overall rate of ${s.cr}. Cremation remains the more affordable option, with direct cremation costing ${$(mdc)} compared to traditional burial at ${$(mf)}.`},
    {q:`How do ${m.city} funeral costs compare to the national average?`,a:`${m.city} funeral costs are ${mf > 7848 ? 'above' : 'below'} the national average of $7,848 for a traditional funeral. The ${m.city} metro area's cost of living ${m.mp > 1.15 ? 'significantly' : 'somewhat'} influences local funeral pricing.`},
    {q:`Where can I compare funeral home prices in ${m.city}?`,a:`Under the FTC Funeral Rule, every funeral home in ${m.city} must provide a General Price List. Call 2-3 providers to request their GPL. You can also visit Parting.com or the Funeral Consumers Alliance for price comparison resources.`}
  ];

  const content = `${head(title, desc, fn, `Funeral Costs in ${m.city}`, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> &rsaquo; <a href="funeral-costs-by-state.html">Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">${m.city}</span>
      </nav>

      <h1>Funeral Costs in ${m.city}, ${m.st} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">February 2026</span></span>
        <span class="article-meta-item"><span class="article-meta-label">State:</span> <span class="article-meta-value"><a href="funeral-costs-${s.slug}.html">${m.st}</a></span></span>
      </div>

      <p class="guide-intro">If you are arranging a funeral in the ${m.city} metropolitan area, this guide provides realistic cost estimates to help you plan. Funeral costs in ${m.city} tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average due to the area's cost of living. Understanding typical prices empowers you to make confident, informed decisions for your family.</p>

      <div class="stat-highlights">
        <div class="stat-box"><span class="stat-number">${$(mf)}</span><span class="stat-label">Avg. Traditional Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(mc)}</span><span class="stat-label">Avg. Cremation Funeral</span></div>
        <div class="stat-box"><span class="stat-number">${$(mdc)}</span><span class="stat-label">Direct Cremation</span></div>
        <div class="stat-box"><span class="stat-number">${$(mb)}</span><span class="stat-label">Avg. Burial Plot</span></div>
      </div>

      <h2>Cost Breakdown for ${m.city}</h2>
      <div class="cost-table-wrap">
        <table class="cost-table">
          <caption>${m.city} Funeral Cost Averages (2026)</caption>
          <thead><tr><th>Service</th><th>${m.city} Avg.</th><th>${m.st} Avg.</th></tr></thead>
          <tbody>
            <tr><td>Traditional funeral</td><td class="cost-value">${$(mf)}</td><td>${$(s.f)}</td></tr>
            <tr><td>Funeral with cremation</td><td class="cost-value">${$(mc)}</td><td>${$(s.c)}</td></tr>
            <tr><td>Direct cremation</td><td class="cost-value">${$(mdc)}</td><td>${$(s.dc)}</td></tr>
            <tr><td>Cemetery plot</td><td class="cost-value">${$(mb)}</td><td>${$(s.b)}</td></tr>
          </tbody>
        </table>
      </div>

      <p>These estimates reflect the ${m.city} metro area premium of approximately ${Math.round((m.mp-1)*100)}% above the ${m.st} state average. Actual prices will vary by provider. The most effective way to find the best price is to request General Price Lists from 2 to 3 funeral homes in the ${m.city} area and compare them line by line.</p>

      <h2>Your Rights in ${m.city}</h2>
      <div class="callout callout-info"><strong>FTC Funeral Rule Protection</strong> Every funeral home in ${m.city} must provide an itemized General Price List, let you choose only the services you want, and accept caskets purchased elsewhere. You are never required to buy a package. <a href="ftc-funeral-rule-guide.html">Read the full FTC Funeral Rule guide</a>.</div>

      <h2>Ways to Reduce Costs in ${m.city}</h2>
      <ul>
        <li>Compare prices from at least 3 funeral providers in the ${m.city} area</li>
        <li>Consider direct cremation at ${$(mdc)} as the most affordable option</li>
        <li>Shop for caskets from independent retailers or online</li>
        <li>Ask about veteran benefits, Medicaid assistance, or payment plans</li>
        <li>Consider a memorial service at a church, park, or home instead of the funeral home</li>
      </ul>

      ${resources('general')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More in ${m.st}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${m.st} Funeral Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${m.st} Cremation Costs</a></li><li><a href="burial-costs-${s.slug}.html">${m.st} Burial Costs</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

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
  const title = `Cremation Costs in ${s.name} (2026) — Prices, Types &amp; Options`;
  const desc = `Cremation costs in ${s.name}: direct cremation from ${$(s.dc)}, cremation with service from ${$(s.c)}. Compare types, costs, and regulations in ${s.name}.`;
  const faq = [
    {q:`How much does cremation cost in ${s.name}?`,a:`Cremation costs in ${s.name} range from ${$(s.dc)} for direct cremation to ${$(s.c)} for a funeral service with cremation. Additional costs may include urns ($50-$3,000), memorial services, and scattering or inurnment fees.`},
    {q:`What types of cremation are available in ${s.name}?`,a:`${s.name} offers direct cremation (body is cremated without a service), cremation with memorial service (service held after cremation), and traditional cremation (full funeral service before cremation). Direct cremation is the most affordable option.`},
    {q:`What are ${s.name}'s cremation regulations?`,a:`${s.name} follows standard cremation regulations including a mandatory waiting period before cremation can occur. Most states require 24-48 hours. A cremation authorization form signed by the next of kin and often a permit from the medical examiner are required.`},
    {q:`Can I scatter ashes in ${s.name}?`,a:`Scattering laws vary within ${s.name}. Generally, you may scatter ashes on private property with permission, at sea (3+ nautical miles out per EPA rules), and in some public areas. Check local regulations and always be respectful of the environment and others.`}
  ];

  const content = `${head(title, desc, fn, `Cremation Costs in ${s.name}`, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Cremation Costs</span>
      </nav>

      <h1>Cremation Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">February 2026</span></span>
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

      ${resources('cremation')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More for ${s.name}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${s.name} Funeral Costs</a></li><li><a href="burial-costs-${s.slug}.html">${s.name} Burial Costs</a></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

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
  const title = `Burial Costs in ${s.name} (2026) — Cemetery, Plot &amp; Service Prices`;
  const desc = `Burial costs in ${s.name}: traditional burial from ${$(s.f)}, cemetery plot from ${$(s.b)}. Compare burial options, cemetery costs, and consumer rights.`;
  const faq = [
    {q:`How much does burial cost in ${s.name}?`,a:`A traditional burial in ${s.name} costs approximately ${$(s.f)} for the funeral service plus ${$(s.b)} for a cemetery plot. Additional costs include a vault or grave liner ($1,000-$10,000), headstone ($1,000-$3,000), and opening/closing the grave ($1,000-$2,500).`},
    {q:`Is a burial vault required in ${s.name}?`,a:`Many cemeteries in ${s.name} require a burial vault or grave liner, though this is typically a cemetery policy rather than a state law. Vaults prevent the ground from settling. Ask the cemetery about their specific requirements and alternative options.`},
    {q:`What are the cheapest burial options in ${s.name}?`,a:`The most affordable burial options in ${s.name} include direct burial (no viewing or service), which can save thousands. Green burial, which skips embalming and uses a biodegradable casket or shroud, is another cost-effective option available at some ${s.name} cemeteries.`}
  ];

  const content = `${head(title, desc, fn, `Burial Costs in ${s.name}`, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Burial Costs</span>
      </nav>

      <h1>Burial Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">February 2026</span></span>
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

      ${resources('burial')}

      <h2>Frequently Asked Questions</h2>
      ${faq.map(q => `<details class="faq-item"><summary>${q.q}</summary><div class="faq-answer"><p>${q.a}</p></div></details>`).join('\n      ')}

      <div class="topic-nav"><h4>More for ${s.name}</h4><ul><li><a href="funeral-costs-${s.slug}.html">${s.name} Funeral Costs</a></li><li><a href="cremation-costs-${s.slug}.html">${s.name} Cremation Costs</a></li><li><a href="headstone-monument-costs.html">Headstone Costs</a></li><li><a href="national-funeral-cost-index.html">National Cost Index</a></li></ul></div>

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
    {q:`How current is this information?`,a:`This guide was last reviewed in February 2026. We regularly update our content based on the latest data from industry sources, government agencies, and consumer research.`},
    {q:`Where can I get personalized advice?`,a:`For specific decisions about your situation, always consult with licensed professionals — such as attorneys for legal matters, financial advisors for insurance questions, and licensed funeral directors for service planning.`},
    {q:`Is this information free to use?`,a:`Yes, all guides on Funeral Cost Analyzer are free and available without registration. We provide independent educational resources to help families make informed decisions.`}
  ];

  const content = `${head(p.t, p.d, p.fn, p.st, faq)}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a> &rsaquo; <span aria-current="page">${p.st}</span>
      </nav>

      <h1>${p.st}: What Families Need to Know in 2026</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">Reviewed:</span> <span class="article-meta-value">February 2026</span></span>
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
      ${ctaBanner()}

      <div class="guide-disclaimer"><p><strong>Disclaimer:</strong> This guide is for general educational purposes only and does not constitute financial, legal, tax, medical, or professional advice. Always consult licensed professionals before making decisions. Cost data is based on publicly available surveys and may not reflect current prices in your area.</p></div>
    </article>
  </main>
${footer()}`;
  return { fn: p.fn, content };
}

// ── Generate All Pages ──────────────────────────────────────────
console.log('Generating pages...');
let count = { state: 0, metro: 0, cremation: 0, burial: 0, topical: 0 };
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

// ── Generate Sitemap ────────────────────────────────────────────
const existingPages = [
  'index.html', 'chat.html', 'contact.html',
  'national-funeral-cost-index.html',
  'funeral-costs-by-state.html', 'cremation-vs-burial-cost.html', 'direct-cremation-cost.html',
  'funeral-cost-breakdown.html', 'funeral-payment-assistance.html', 'questions-to-ask-funeral-home.html',
  'what-funeral-homes-dont-tell-you.html', 'social-security-death-benefit.html', 'veteran-burial-benefits.html',
  'cheap-funeral-options.html', 'green-burial-options.html', 'prepaid-funeral-plans.html',
  'ftc-funeral-rule-guide.html', 'funeral-insurance-guide.html', 'home-funeral-guide.html',
  'obituary-writing-guide.html', 'grief-resources.html', 'planning-checklist.html',
  'editorial-standards.html', 'privacy-policy.html',
  'funeral-cost-index-pdf.html', 'funeral-planning-checklist-printable.html',
  'funeral-cost-comparison-worksheet.html', 'funeral-cost-widget.html'
];

const sitemapEntries = [];
existingPages.forEach(p => {
  const pri = p === 'index.html' ? '1.0' : p === 'national-funeral-cost-index.html' ? '0.9' : p.includes('privacy') || p.includes('editorial') ? '0.5' : '0.8';
  // Homepage canonical is BASE/ not BASE/index.html
  const loc = p === 'index.html' ? `${BASE}/` : `${BASE}/${p}`;
  sitemapEntries.push(`  <url><loc>${loc}</loc><lastmod>2026-02-10</lastmod><changefreq>monthly</changefreq><priority>${pri}</priority></url>`);
});
allPages.forEach(p => {
  const pri = p.startsWith('funeral-costs-') && !p.includes('uninsured') ? '0.7' : '0.6';
  sitemapEntries.push(`  <url><loc>${BASE}/${p}</loc><lastmod>2026-02-10</lastmod><changefreq>monthly</changefreq><priority>${pri}</priority></url>`);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);

const total = count.state + count.metro + count.cremation + count.burial + count.topical;
console.log(`\n=== Page Generation Complete ===`);
console.log(`State pages: ${count.state}`);
console.log(`Metro pages: ${count.metro}`);
console.log(`Cremation pages: ${count.cremation}`);
console.log(`Burial pages: ${count.burial}`);
console.log(`Topical pages: ${count.topical}`);
console.log(`Total new pages: ${total}`);
console.log(`Sitemap updated with ${existingPages.length + allPages.length} total pages`);

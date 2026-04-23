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
  {city:"Washington DC",slug:"washington-dc",st:"District of Columbia",ss:"virginia",mp:1.35,dc:true},
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
const LASTMOD = '2026-04-23';
const TODAY = LASTMOD;
const REVIEW_MONTH = new Date(LASTMOD + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

// Deterministic variant picker — uses state/metro identifiers plus an optional
// salt string so neighboring pages land on different variants for different
// paragraphs. Same inputs always produce the same output (no per-deploy drift).
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pickVariant(keyParts, arr, salt) {
  const key = (Array.isArray(keyParts) ? keyParts.join('|') : String(keyParts)) + '|' + (salt || '');
  return arr[hashStr(key) % arr.length];
}

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

// ── Region-specific content helpers ─────────────────────────────
// These return a UNIQUE block of prose per page based on region + state slug.
// Different regions get materially different advice and references so that
// pages do not read as pure location-substitution templates. Within a region,
// per-state rotation varies sentence structure so neighboring states also diverge.

function regionalBurialNote(s) {
  const hash = (s.abbr.charCodeAt(0) + s.abbr.charCodeAt(1) + s.name.length) % 3;
  const byRegion = {
    'South': [
      `In much of ${s.name}, family and church cemeteries still operate alongside commercial ones, and many congregations keep section pricing below market. If you have a church or family plot in ${s.name}, the savings over a private cemetery can exceed ${$(Math.round(s.b * 0.4))}. Above-ground entombment is also more common in parts of the Gulf South for high-water-table reasons — worth asking about if you are in a low-lying area.`,
      `${s.name} cemeteries in the rural South often price opening-and-closing fees well below what metro funeral homes quote — sometimes under $600 compared to $1,500+ near ${s.cities[0]}. Family burial plots, church-owned cemeteries, and county veterans' sections (free for eligible veterans) are all worth checking before you accept a private cemetery's package. Above-ground entombment also appears in the coastal parts of the region.`,
      `Families in ${s.name} often assume the funeral home handles everything, but the cemetery bill is separate and usually smaller at church, fraternal, or municipal sites than at commercial memorial parks. Because ${s.name} is in the ${s.region} and summers run long, scheduling flexibility is rarely an issue — families can genuinely take 48-72 hours to compare prices without risking a conflict with cemetery availability.`
    ],
    'Northeast': [
      `Winter burials in ${s.name} can be delayed or carry a frozen-ground surcharge — some cemeteries charge an additional $500-$1,500 from December through March, or offer winter vault storage until spring interment. If the death occurs between late November and early March, ask every ${s.name} cemetery on your shortlist about winter handling fees specifically; they are rarely volunteered up front.`,
      `${s.name} has one of the highest densities of cemeteries in the country, which means you usually have both nonprofit and commercial options within a short drive of ${s.cities[0]}. Nonprofit, municipal, and denominational cemeteries in ${s.name} routinely undercut commercial memorial parks by ${$(Math.round(s.b * 0.3))}-${$(Math.round(s.b * 0.6))} on the plot line. Get quotes from at least one of each type.`,
      `Northeastern burial costs in ${s.name} are pushed up by real estate — cemetery land in densely populated counties is expensive, and that shows up in plot prices. But older municipal and religious cemeteries in ${s.name} were often established on land donated or endowed long ago, and their pricing can still reflect that. A 15-minute longer drive to one of these can cut ${$(Math.round(s.b * 0.4))} or more off your cemetery bill.`
    ],
    'Midwest': [
      `${s.name} has a strong tradition of township, county, and fraternal cemeteries, many of which price plots well below commercial memorial parks. These are often listed only on a county or township website rather than on Google, so a call to the ${s.cities[0]} area clerk's office can surface options that do not show up in a standard search. Direct burial is also widely accepted culturally in ${s.name}, unlike some regions where viewing is expected.`,
      `Rural ${s.name} counties still maintain pioneer-era cemeteries with active sections and prices that reflect community upkeep rather than corporate returns. Opening-and-closing fees at a ${s.name} township cemetery typically run $400-$900, compared to $1,500-$2,500 at a metro private cemetery. If a rural cemetery is acceptable to your family, the savings compound fast.`,
      `Midwestern funeral pricing in ${s.name} is generally transparent — independent family-owned funeral homes still dominate here more than in the coasts, and they tend to be more willing to itemize and negotiate. A GPL walkthrough on the phone with two or three ${s.name} providers is usually enough to see where the price points sit and identify the package markups.`
    ],
    'West': [
      `Green burial is easier to find in ${s.name} than in much of the country — certified conservation burial grounds and hybrid cemetery sections have expanded noticeably along the West Coast. A green burial in ${s.name} typically costs ${$(Math.round(s.f * 0.5))}-${$(Math.round(s.f * 0.7))} total, without the vault, embalming, or traditional casket costs. Ask specifically about "hybrid" or "natural" sections — many ${s.name} cemeteries have them but do not advertise them prominently.`,
      `Scattering at sea, on private land, and in certain federal wilderness areas is more practical in ${s.name} than in the inland US, and families in ${s.cities[0]} increasingly choose cremation with a natural scattering over traditional burial. When burial is still the choice, ${s.name} green burial grounds and Jewish and LDS cemeteries tend to offer the most competitive plot pricing.`,
      `${s.name} cremation rates run far above the national average, and the consequence is a more competitive market for the remaining burial services — the ${s.name} funeral homes that still do a lot of burials often price aggressively to win that share. Do not assume that burial pricing in ${s.name} moves in lockstep with cost of living; shop it as if you were in a buyer's market.`
    ],
    'Mountain': [
      `${s.name} is geographically large and thinly populated outside of ${s.cities[0]}, which means rural counties often have only one or two cemetery options. That local scarcity makes up-front price confirmation especially important — you do not want to discover on the day of a service that the only accessible cemetery is ${$(Math.round(s.b * 0.5))} above your estimate. County clerk offices in ${s.name} typically keep current plot fee schedules on file.`,
      `Home and family burial is legal in parts of ${s.name} with some restrictions, and at least one county-level alternative (green burial ground, conservation cemetery, or family plot) exists within driving distance of ${s.cities[0]}. Because ${s.name} has relatively progressive disposition laws, families here have meaningfully more flexibility than in the Northeast or older Midwest.`,
      `${s.name} winters can delay burial at higher elevations — some cemeteries in the mountain counties close ground operations from November through April and hold remains in a vault until spring. When getting quotes in ${s.name}, ask whether the season matters for your specific cemetery; in-ground interment windows vary dramatically within the state.`
    ]
  };
  const arr = byRegion[s.region] || byRegion['Midwest'];
  return arr[hash % arr.length];
}

function regionalCremationNote(s) {
  const hash = (s.abbr.charCodeAt(1) + s.name.length) % 3;
  const byRegion = {
    'South': [
      `Cremation rates in ${s.name} (${s.cr}) trail the national average, partly reflecting long-standing church traditions around burial in the South. That said, the state's cremation rate has risen nearly every year of the last decade, and direct cremation providers are now widely available near ${s.cities[0]}. If your family's faith permits cremation, the cost gap versus traditional burial in ${s.name} is meaningful — usually ${$(s.f - s.dc)} or more.`,
      `${s.name}'s ${s.cr} cremation rate masks real variation between urban and rural counties. Around ${s.cities[0]}, where independent cremation societies compete directly with full-service funeral homes, direct cremation routinely runs at the low end of the ${$(Math.round(s.dc*0.7))}-${$(Math.round(s.dc*1.4))} range. Rural ${s.name} counties with a single funeral provider often sit at the high end or above.`,
      `Southern families in ${s.name} sometimes choose cremation but still want a traditional viewing and service — a perfectly valid option that costs around ${$(s.c)} in ${s.name} rather than the ${$(s.dc)} direct cremation minimum. If the decision to cremate is settled but a visitation matters to your family, price the full cremation-with-service option separately, as many ${s.name} funeral homes quote the two paths very differently.`
    ],
    'Northeast': [
      `${s.name}'s cremation rate of ${s.cr} is middle-of-the-pack nationally but has been climbing fast, especially in the ${s.cities[0]} area. The Catholic Church permits cremation (since 1963) as long as ashes are interred rather than scattered — worth knowing if tradition is a factor for your family. ${s.name} also has a growing number of columbaria attached to churches, which can keep the total under ${$(Math.round(s.c * 0.8))}.`,
      `Northeastern crematoria handling heavy volume — particularly around ${s.cities[0]} — can process direct cremations in 3-5 business days, but the wait at boutique providers can stretch to 2 weeks. If timing matters, ask each ${s.name} provider for their current turnaround before choosing on price alone. The ${$(s.dc)} direct cremation floor in ${s.name} sometimes reflects capacity pressure, not cost of service.`,
      `In ${s.name}, where winter complicates traditional burial, cremation has a practical scheduling advantage most families underestimate: ashes can be interred or scattered any time of year, which means the service does not have to be planned around frozen-ground delays. This alone pushes some Northeastern families toward cremation, even before considering the ${$(s.f - s.dc)} cost difference versus traditional burial in ${s.name}.`
    ],
    'Midwest': [
      `Cremation adoption in ${s.name} has crossed ${s.cr} and continues to rise, driven largely by cost — direct cremation at ${$(s.dc)} saves Midwestern families roughly ${$(s.f - s.dc)} compared to traditional burial. Independent cremation societies and direct cremation providers are now common in and around ${s.cities[0]}, and their pricing typically undercuts full-service funeral homes offering the same outcome.`,
      `Most ${s.name} crematories are operated by funeral homes rather than standalone facilities, which means direct cremation in ${s.name} usually goes through a funeral home intake even when no service is attached. This does not materially change the ${$(s.dc)} price point in ${s.name}, but it means the intake paperwork and authorization timelines mirror those of a full-service arrangement.`,
      `${s.name}'s cremation rate (${s.cr}) reflects a shift that has been especially pronounced in Midwestern metro areas while remaining slower in rural counties. If you are comparing direct cremation providers in ${s.name}, the price spread between a ${s.cities[0]}-area provider and a small-town provider is typically smaller for cremation than for burial — another reason cremation has gained share here.`
    ],
    'West': [
      `${s.name}'s ${s.cr} cremation rate is among the highest in the nation, which means the local market is mature and competitive. Direct cremation providers in and around ${s.cities[0]} advertise transparent, flat-rate pricing and can often complete the process in under a week. The ${$(s.dc)} price point in ${s.name} reflects real market competition, not a rack rate — there is rarely much room to negotiate lower.`,
      `Scattering options in ${s.name} are unusually rich: private land (with permission), Pacific scattering services, national forests with permits, and several state parks that allow scattering by application. This flexibility is one reason ${s.name} families so often choose cremation over burial. Dedicated scattering services in ${s.name} typically run $200-$800 depending on location and witnessing arrangements.`,
      `Because ${s.cr} of ${s.name} families already choose cremation, most ${s.name} funeral homes are well-practiced at the full spectrum — direct cremation (${$(s.dc)}), cremation with memorial (${$(s.c)}), and cremation-plus-traditional-viewing. That competitive maturity usually shows up as cleaner itemization on the GPL than you will see in regions where cremation is still a minority choice.`
    ],
    'Mountain': [
      `${s.name}'s cremation rate of ${s.cr} tracks with the Mountain West average, and low population density means fewer crematory facilities serving a large geographic area. Direct cremation in ${s.name} can involve a longer transport leg than families expect, and some providers fold that into the ${$(s.dc)} base price while others charge mileage. Ask specifically about transportation when comparing.`,
      `Scattering ashes on public land in ${s.name} — especially in national forests and BLM land — is legal in most cases with a free permit. Combined with the ${s.cr} state cremation rate, this makes cremation a natural choice for many ${s.name} families who want an outdoor memorial. Dedicated scattering services run $200-$800 in ${s.name}; a DIY scatter with a permit is free.`,
      `In rural ${s.name}, the nearest crematory may be 100+ miles from the funeral home handling arrangements. This does not necessarily raise the ${$(s.dc)} direct cremation price, but it does extend turnaround — 7-14 business days is normal in parts of ${s.name}, compared to 3-5 in ${s.cities[0]}. If timing matters for a memorial, confirm turnaround with the provider.`
    ]
  };
  const arr = byRegion[s.region] || byRegion['Mountain'];
  return arr[hash % arr.length];
}

function regionalFuneralNote(s) {
  const hash = (s.abbr.charCodeAt(0) + s.slug.length) % 3;
  const byRegion = {
    'South': [
      `Homegoing services, repast meals, and strong church involvement remain part of ${s.name} funeral culture, and many congregations will cover or reduce the service-venue portion of the cost for members. When pricing a traditional funeral in ${s.name}, ask explicitly whether the quote assumes the service at the funeral home versus at a church — the latter often drops the facility fee by $500-$1,500.`,
      `${s.name}'s funeral pricing is shaped heavily by whether independent or corporate funeral homes dominate your county. In parts of ${s.name}, corporate consolidation has pushed pricing up; in other parts, family-owned funeral homes still anchor the market. The NFDA lists ownership status in its directory, and it is worth checking when you are comparing providers in ${s.name}.`,
      `Because ${s.name} is in the South and summer heat matters, embalming timelines come up earlier in the arrangement conversation than in cooler regions. Embalming is still not legally required in ${s.name} in most circumstances — refrigeration is an alternative. If you are asked to agree to embalming quickly, that is a signal to slow down and ask whether it is a legal requirement or a provider preference.`
    ],
    'Northeast': [
      `${s.name} has one of the highest funeral-home densities in the country, which usually helps consumers — more providers means more pricing competition. However, ownership consolidation by Service Corporation International (SCI) and similar groups has concentrated some of the ${s.cities[0]} market under a handful of brands. Ask each ${s.name} provider whether they are independently owned; independent operators in ${s.name} often undercut branded ones by 10-25%.`,
      `Winter timing affects Northeastern funerals more than most families expect — cemetery interment can be delayed in ${s.name} between December and March, which sometimes shifts the cost structure toward cremation with later interment or memorial. If a ${s.name} death occurs in winter, ask every provider about frozen-ground handling on the very first call; answers vary more than you would guess.`,
      `${s.name}'s Catholic, Jewish, Greek Orthodox, and Protestant communities each have distinct funeral customs, and ${s.name} funeral homes generally know these well. If faith tradition matters, asking for a provider that regularly serves your community is usually more useful than asking for "the cheapest" — specialized providers in ${s.name} are often well-priced within their niche because they do volume.`
    ],
    'Midwest': [
      `Independent, family-owned funeral homes still anchor ${s.name}'s market more than in the coasts, and they generally price closer to the NFDA national averages than corporate-chain locations. Asking a ${s.name} provider whether they are independently owned or part of a national group is a quick way to predict where their GPL will sit. The spread between independent and chain in ${s.name} is often ${$(Math.round(s.f * 0.15))} or more.`,
      `Midwestern funeral customs in ${s.name} tend to be direct and practical — viewings are common but not always lengthy, memorial luncheons are often hosted at the church or a family's home rather than the funeral home, and cremation followed by a graveside or memorial service is increasingly standard. This practicality tends to keep average ${s.name} funeral costs (${$(s.f)}) close to the national median.`,
      `Rural ${s.name} counties often have just one or two funeral homes within a reasonable distance, which limits comparison shopping but also means those providers rely heavily on community reputation. Independent ${s.name} providers with decades in the same town are generally straightforward on pricing in a way that more transient markets are not. Still, always request the GPL in writing.`
    ],
    'West': [
      `${s.name}'s high cremation rate has reshaped its funeral home market — full-service traditional funerals are less than half of all arrangements here, so providers who still do many traditional services in ${s.name} tend to either cater to a specific community or compete aggressively on price. Ask for their breakdown of cremation versus burial volume when comparing; it predicts pricing posture.`,
      `Alternative dispositions — green burial, aquamation where legal, direct cremation, body donation — are more mainstream in ${s.name} than in most of the country. If cost is the primary driver for your family, ${s.name}'s flexibility means you have options below the ${$(s.f)} traditional funeral price point that simply do not exist in the same way elsewhere. Our <a href="green-burial-options.html">green burial</a> and <a href="direct-cremation-cost.html">direct cremation</a> guides both apply cleanly in ${s.name}.`,
      `Western funeral pricing in ${s.name} is pulled up by real estate and labor costs in the ${s.cities[0]} area, but drops noticeably in smaller markets. The ${$(s.f)} statewide average hides a real spread — you can find full-service providers in smaller ${s.name} cities at ${$(Math.round(s.f * 0.8))} and ${s.cities[0]}-area providers at ${$(Math.round(s.f * 1.2))}+ for comparable services. Distance to provider is often worth driving for a meaningful family event.`
    ],
    'Mountain': [
      `Mountain-state funeral pricing in ${s.name} (avg ${$(s.f)}) is usually moderate, but the ${s.cities[0]} area can run noticeably higher than rural parts of the state. Fuel and transportation appear on GPLs in ${s.name} more often than in denser regions — if the funeral home is more than 30 miles from the residence or cemetery, mileage charges can add $100-$400 to the final bill.`,
      `${s.name} has some of the more progressive disposition laws in the country, including accommodations for home funerals and family-led arrangements in several counties. If your family wants a less commercialized approach to a ${s.name} funeral, it is legally easier here than in much of the Northeast — though you still need to comply with death certificate, transportation, and disposition paperwork. Our <a href="home-funeral-guide.html">home funeral guide</a> covers the steps.`,
      `Sparse population in much of ${s.name} means fewer funeral homes per capita, which can narrow choice but also keeps many providers focused on community reputation. The ${s.cities[0]} metro has the most provider density; outside of it, getting a GPL from 2-3 providers may require driving across county lines. It is still worth the effort — price variation in ${s.name} is wider than the statewide ${$(s.f)} average suggests.`
    ]
  };
  const arr = byRegion[s.region] || byRegion['Mountain'];
  return arr[hash % arr.length];
}

// Region-specific, non-location-swap bullets for the "How to Reduce Costs" sections.
// Returns an array of <li> strings that mix universal advice with regional hooks.
function regionalBurialSavingsBullets(s) {
  const region = s.region;
  const universalByHash = [
    `<li><strong>Compare cemetery prices directly:</strong> Cemeteries are not covered by the FTC Funeral Rule but most in ${s.name} will share a price sheet on request. Ask for plot, vault, opening-and-closing, and perpetual care line-by-line.</li>`,
    `<li><strong>Request itemized pricing from every provider:</strong> Funeral homes in ${s.name} must provide a General Price List. Cemeteries are not required to, but most in the ${s.name} area will share one if you ask specifically for the itemized price sheet rather than a "package."</li>`,
    `<li><strong>Price the cemetery and funeral home separately:</strong> These are two different bills in ${s.name}. Bundled quotes obscure where the markup sits — and the markup sits in a different place depending on the provider.</li>`
  ];
  const bulletsByRegion = {
    'South': [
      `<li><strong>Check church and family cemeteries:</strong> Active church and family-owned cemeteries are still common in rural ${s.name} and routinely price plots 30-50% below commercial memorial parks. Call congregations in the area where burial will occur, not only the closest to the funeral home.</li>`,
      `<li><strong>County veterans' sections:</strong> Many ${s.name} counties maintain dedicated veterans' sections separate from national cemeteries. These are often free for eligible veterans and spouses and can be faster to schedule than VA national cemeteries.</li>`,
      `<li><strong>Above-ground entombment where appropriate:</strong> In low-lying parts of ${s.name} (notably coastal areas), mausoleum entombment is the local norm and can actually be less expensive than a plot-plus-vault combination in the same cemetery. Ask both ways.</li>`
    ],
    'Northeast': [
      `<li><strong>Confirm winter pricing up front:</strong> ${s.name} cemeteries frequently add frozen-ground charges from December through March, or require winter vault storage until spring interment. Ask for the winter-specific line item before signing.</li>`,
      `<li><strong>Denominational and municipal cemeteries:</strong> ${s.name} has one of the highest densities of nonprofit cemeteries in the country. Catholic, Jewish, Orthodox, and municipal cemeteries often undercut private memorial parks by $1,000-$3,000 on the plot line alone.</li>`,
      `<li><strong>Shop outside the immediate metro:</strong> A 20-30 minute drive from ${s.cities[0]} into a lower-cost county can reduce plot prices substantially without changing the family's ability to visit. Real estate drives Northeast cemetery pricing more than anywhere else.</li>`
    ],
    'Midwest': [
      `<li><strong>Call the township or county clerk:</strong> ${s.name} has many township, county, and fraternal cemeteries that simply do not appear in Google results. The clerk's office in the county where burial will occur can usually point you to current plot fee schedules for public cemeteries.</li>`,
      `<li><strong>Work with independent funeral homes:</strong> ${s.name} still has a strong independent, family-owned funeral home market, and these providers generally price closer to the NFDA national averages than corporate-chain locations. Ask every provider whether they are independently owned.</li>`,
      `<li><strong>Direct burial is widely accepted:</strong> Cultural openness to direct burial (no viewing, no ceremony, immediate interment) is stronger in ${s.name} than on the coasts. Choosing direct burial removes embalming, facility use, and visitation fees and can cut total costs by $2,000-$4,000.</li>`
    ],
    'West': [
      `<li><strong>Look for hybrid or natural burial sections:</strong> Several ${s.name} cemeteries have added green or natural burial sections without advertising them prominently. These sections skip the vault and embalming requirements and often price plots 30-50% below the traditional sections of the same cemetery.</li>`,
      `<li><strong>Consider certified conservation burial grounds:</strong> ${s.name} is one of the more active states for true conservation burial. These grounds protect land in perpetuity and price simply, typically ${$(Math.round(s.f * 0.4))}-${$(Math.round(s.f * 0.7))} all-in versus ${$(Math.round(s.f + s.b + s.b * 0.9))}+ for traditional burial in ${s.name}.</li>`,
      `<li><strong>Use the competitive cremation market as leverage:</strong> With ${s.cr} of ${s.name} families choosing cremation, burial-focused providers often have pricing flexibility they do not advertise. Mentioning direct cremation as an alternative in the quote conversation sometimes surfaces better burial pricing.</li>`
    ],
    'Mountain': [
      `<li><strong>Confirm seasonal burial windows:</strong> At higher elevations in ${s.name}, cemeteries may pause ground operations from November through April and hold remains in a vault until spring. Vault storage fees vary widely; ask for them specifically in the quote.</li>`,
      `<li><strong>County clerk for rural cemeteries:</strong> Sparse population in much of ${s.name} means rural cemetery fee schedules often live only with the county clerk. A call to the county where burial will occur can surface options 40-60% below ${s.cities[0]}-area private cemeteries.</li>`,
      `<li><strong>Family or home burial where allowed:</strong> ${s.name} has some of the more permissive family and home-burial laws in the country. Where this is an option, it can eliminate cemetery fees entirely while still meeting ${s.name} legal requirements — our home funeral guide walks through the paperwork.</li>`
    ]
  };
  const universalIdx = (s.abbr.charCodeAt(0) + s.name.length) % universalByHash.length;
  const regionArr = bulletsByRegion[region] || bulletsByRegion['Midwest'];
  return [
    universalByHash[universalIdx],
    ...regionArr,
    `<li><strong>Buy caskets independently:</strong> Save 50–70% by purchasing from an online retailer. <a href="casket-buying-guide.html">Casket buying guide</a> | <a href="best-online-casket-retailers.html">Best online casket retailers</a></li>`,
    `<li><strong>Ask about grave liners:</strong> A liner costs significantly less than a full vault and may meet the cemetery's requirements.</li>`,
    `<li><strong>Consider direct burial or green burial:</strong> Skipping viewing, ceremony, and embalming can save thousands. <a href="green-burial-options.html">Green burial options</a></li>`,
    `<li><strong>Check headstone prices independently:</strong> Funeral homes and cemeteries mark up headstones. <a href="headstone-monument-costs.html">Headstone cost guide</a></li>`
  ].join('');
}

function regionalCremationSavingsBullets(s) {
  const region = s.region;
  const regionBullet = {
    'South': `<li><strong>Check cremation societies:</strong> Nonprofit cremation societies operate in several ${s.name} metros and often undercut full-service funeral homes by $300-$900 on direct cremation while meeting all ${s.name} regulatory requirements.</li>`,
    'Northeast': `<li><strong>Ask about current turnaround:</strong> Crematory capacity around ${s.cities[0]} can stretch turnaround to 10-14 days during peak periods. If timing matters for a memorial, confirm the specific return-of-ashes window in writing before choosing on price.</li>`,
    'Midwest': `<li><strong>Price direct cremation as standalone:</strong> ${s.name} funeral homes often bundle direct cremation into broader packages. Ask for the pure direct cremation price — transport, cremation, return of ashes only — to see the true floor.</li>`,
    'West': `<li><strong>Choose a flat-rate direct cremation provider:</strong> ${s.name} has a mature, competitive direct cremation market. Flat-rate providers in and around ${s.cities[0]} publish transparent pricing and rarely leave much room to negotiate lower; pick on turnaround and reputation rather than haggling.</li>`,
    'Mountain': `<li><strong>Account for transport distance:</strong> In rural ${s.name}, the nearest crematory may be 100+ miles from the funeral home. Some providers absorb this in the ${$(s.dc)} base price; others charge mileage. Ask directly when getting quotes.</li>`
  }[region] || '';
  const faithBullet = region === 'Northeast'
    ? `<li><strong>Interment of ashes at a church columbarium:</strong> Many ${s.name} parishes and congregations now operate columbaria attached to the church, offering niche inurnment for a fraction of traditional cemetery costs while meeting Catholic and other faith requirements for interment of ashes.</li>`
    : region === 'West'
      ? `<li><strong>Look into outdoor scattering options:</strong> Private land (with permission), Pacific scattering services, national forests with a free permit, and several ${s.name} state parks allow ash scattering. DIY scattering with the required permits is effectively free; guided services run $200-$800.</li>`
      : `<li><strong>Scattering locations worth researching locally:</strong> Private land (with permission), certain national forests with a permit, and inland waterway scattering are typically options in ${s.name}. Check local ordinances before choosing a specific location.</li>`;
  return [
    `<li><strong>Compare at least 3 cremation providers in ${s.name}:</strong> Request written General Price Lists. Differences between providers in the same market commonly exceed $500-$1,200 for identical direct cremation services.</li>`,
    regionBullet,
    faithBullet,
    `<li><strong>Buy urns independently:</strong> Save 50-80% versus funeral home urn pricing. The FTC Funeral Rule protects your right to use any urn or container. <a href="urn-buying-guide.html">Urn buying guide</a></li>`,
    `<li><strong>Hold a memorial separately:</strong> A memorial at a church, park, or home costs a fraction of a funeral home ceremony and can be scheduled whenever the family is ready.</li>`,
    `<li><strong>Check assistance programs:</strong> <a href="veteran-burial-benefits.html">Veteran benefits</a>, <a href="medicaid-funeral-assistance.html">Medicaid assistance</a>, and <a href="funeral-payment-assistance.html">other programs</a> may cover part or all of cremation costs.</li>`
  ].filter(Boolean).join('');
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
  {"@context":"https://schema.org","@type":"Article","headline":"${esc(title)}","description":"${esc(desc)}","datePublished":"2026-01-15","dateModified":"${LASTMOD}","author":{"@type":"Person","name":"Paul Paradis","jobTitle":"Founder & Editor","url":"${BASE}/about.html"},"publisher":{"@type":"Organization","name":"FuneralCostAnalyzer","url":"${BASE}/","founder":{"@type":"Person","name":"Paul Paradis"}},"mainEntityOfPage":{"@type":"WebPage","@id":"${BASE}/${filename}"}}
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
    general: `<div class="resource-suggestions"><h3>Educational Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a><span class="resource-desc">Independent nonprofit consumer advocacy for funeral rights</span></li><li><a href="https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-revised-rule" target="_blank" rel="nofollow noopener">FTC Funeral Rule</a><span class="resource-desc">The federal rule protecting funeral consumers</span></li><li><a href="funeral-insurance-guide.html">Funeral Insurance Guide</a><span class="resource-desc">Compare final expense and burial insurance options</span></li><li><a href="best-burial-insurance.html">Best Burial Insurance Companies</a><span class="resource-desc">Side-by-side comparison of top burial insurance providers</span></li><li><a href="funeral-payment-assistance.html">Payment Assistance Guide</a><span class="resource-desc">Government programs and financial help for funeral costs</span></li><li><a href="funeral-insurance-comparison.html">Insurance Plan Comparison</a><span class="resource-desc">Compare coverage, premiums, and payout speed across providers</span></li></ul></div>` + costCluster,
    cremation: `<div class="resource-suggestions"><h3>Cremation Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a><span class="resource-desc">Nonprofit advocacy — compare cremation providers</span></li><li><a href="cremation-jewelry-guide.html">Cremation Jewelry Guide</a><span class="resource-desc">Memorial keepsakes and remembrance options</span></li><li><a href="cremation-vs-burial-cost.html">Cremation vs. Burial Costs</a><span class="resource-desc">Side-by-side cost comparison</span></li><li><a href="urn-buying-guide.html">Urn Buying Guide</a><span class="resource-desc">Types, prices, and how to choose the right urn</span></li><li><a href="pet-cremation-costs.html">Pet Cremation Costs</a><span class="resource-desc">Options and prices for pet cremation and memorials</span></li><li><a href="final-expense-insurance-guide.html">Final Expense Insurance</a><span class="resource-desc">Coverage options to help pay for cremation costs</span></li></ul></div>` + costCluster,
    burial: `<div class="resource-suggestions"><h3>Burial Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a><span class="resource-desc">Nonprofit consumer advocacy for funeral pricing</span></li><li><a href="headstone-monument-costs.html">Headstone &amp; Monument Guide</a><span class="resource-desc">Costs, types, and buying tips</span></li><li><a href="green-burial-options.html">Green Burial Options</a><span class="resource-desc">Eco-friendly and natural alternatives</span></li><li><a href="best-online-casket-retailers.html">Best Online Casket Retailers</a><span class="resource-desc">Save 50-70% buying caskets online</span></li><li><a href="best-burial-insurance.html">Best Burial Insurance</a><span class="resource-desc">Compare plans to cover burial expenses</span></li></ul></div>` + costCluster,
    sensitive: `<div class="resource-suggestions"><h3>Trusted Support Resources</h3><ul class="resource-list"><li><a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a><span class="resource-desc">Independent nonprofit — consumer rights and local affiliates</span></li><li><a href="https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-revised-rule" target="_blank" rel="nofollow noopener">FTC Funeral Rule</a><span class="resource-desc">Federal protections for funeral consumers</span></li><li><a href="ftc-funeral-rule-guide.html">Your Consumer Rights Guide</a><span class="resource-desc">Plain-English walkthrough of the FTC Funeral Rule</span></li><li><a href="funeral-payment-assistance.html">Financial Assistance Programs</a><span class="resource-desc">Government and nonprofit programs that may help</span></li><li><a href="grief-resources.html">Grief Support Resources</a><span class="resource-desc">Curated grief support organizations and hotlines</span></li></ul></div>`
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
  const title = `${s.name} Funeral Costs 2026: ${$(s.dc)}–${$(s.f)}`;
  const desc = `Funeral costs in ${s.name} (2026): traditional ${$(s.f)}, cremation ${$(s.c)}, direct cremation from ${$(s.dc)}. Full breakdown, hidden fees, and ways to save.`;
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

  const regionSaveHints = {
    'South': `Check with local churches and fraternal organizations — in ${s.name}, congregation-owned cemeteries and family sections are often priced well below commercial memorial parks. Veteran burial benefits apply at any national cemetery and some state veterans' cemeteries in ${s.name}.`,
    'Northeast': `Request frozen-ground pricing separately if the death is between December and March — ${s.name} cemeteries often charge extra in winter. Municipal, Catholic, and Jewish cemeteries in ${s.name} generally price below private memorial parks by $1,000 or more.`,
    'Midwest': `Township and county cemeteries in ${s.name} rarely appear in online searches but are often half the price of private cemeteries — call the clerk's office in the county where burial will occur. Independent, family-owned funeral homes still dominate ${s.name} and tend to price more transparently than chain providers.`,
    'West': `${s.name} has a mature green burial and direct cremation market; providers are accustomed to non-traditional arrangements and often price transparently. Conservation burial grounds and hybrid cemetery sections in ${s.name} typically cost 30-50% less than traditional plots in the same cemetery.`,
    'Mountain': `${s.name}'s low population density means fewer providers, so calling the county clerk for rural cemetery options — and comparing fuel and transport line items closely — matters more than in dense metros. Home and family burial is legal in parts of ${s.name} with permits and can eliminate cemetery fees entirely.`
  };
  const regionSaveHint = regionSaveHints[s.region] || regionSaveHints['Midwest'];

  const faq = (function(){
    const key = [s.slug, s.abbr, s.region];
    const natAvgStr = '$7,848';
    const q1Variants = [
      {
        q: `How much does a funeral cost in ${s.name}?`,
        a: `Traditional funerals in ${s.name} average around ${$(s.f)}, which lands ${priceComp} the national figure of ${natAvgStr}. Cremation with a service comes in near ${$(s.c)}, and direct cremation can start as low as ${$(s.dc)} in ${s.name}. Expect to budget roughly ${$(s.b)} on top of that for a cemetery plot if you choose burial. The only reliable way to pin down your number is to pull General Price Lists from two or three ${s.cities[0]}-area providers and compare line by line.`
      },
      {
        q: `What does a typical ${s.name} funeral cost in 2026?`,
        a: `Most ${s.name} families paying for a full traditional service see the bill settle around ${$(s.f)} — ${priceComp} the ${natAvgStr} national benchmark. Cremation with ceremony runs closer to ${$(s.c)}, while a stripped-down direct cremation in ${s.name} can land near ${$(s.dc)}. Cemetery plot fees in ${s.name} add about ${$(s.b)}. Actual prices shift a lot depending on which ${s.name} provider you call first, which is why comparing is non-negotiable.`
      },
      {
        q: `What is the average price of a funeral in ${s.name} right now?`,
        a: `Current averages in ${s.name} come in at ${$(s.f)} for a traditional funeral, ${$(s.c)} for cremation with a service, and from ${$(s.dc)} for direct cremation — with the traditional figure sitting ${priceComp} the ${natAvgStr} US median. Cemetery and burial fees add roughly ${$(s.b)} when applicable. Because ${s.name} pricing is not standardized, the same service can swing several thousand dollars between neighboring funeral homes, so always ask for the itemized GPL.`
      }
    ];
    const cremSave = s.f - s.dc;
    const cremCompare = parseInt(s.cr) > 55 ? 'above' : 'near';
    const q2Variants = [
      {
        q: `Is cremation cheaper than burial in ${s.name}?`,
        a: `Yes — significantly. In ${s.name}, direct cremation at ${$(s.dc)} saves families roughly ${$(cremSave)} compared with the ${$(s.f)} traditional funeral plus cemetery costs. The ${s.name} cremation rate currently sits at ${s.cr}, ${cremCompare} the national average of about 60%. ${rc.regNote}`
      },
      {
        q: `Does cremation save money compared with burial in ${s.name}?`,
        a: `It does. A direct cremation in ${s.name} runs about ${$(s.dc)}, whereas a traditional funeral with burial averages ${$(s.f)} before adding the plot — so the gap can easily exceed ${$(cremSave)}. ${s.name}'s cremation rate of ${s.cr} sits ${cremCompare} the roughly 60% national figure. ${rc.regNote}`
      },
      {
        q: `How much cheaper is cremation than burial in ${s.name}?`,
        a: `Direct cremation in ${s.name} starts around ${$(s.dc)}; a traditional funeral with burial averages ${$(s.f)}, not counting the cemetery plot or vault. That is a difference of at least ${$(cremSave)} for most families. With ${s.name}'s cremation rate at ${s.cr} (${cremCompare} the national rate of about 60%), cremation providers in the state are competitive. ${rc.regNote}`
      }
    ];
    const q3Variants = [
      {
        q: `What are my consumer rights at ${s.name} funeral homes?`,
        a: `The federal FTC Funeral Rule protects every consumer in ${s.name}. Funeral homes must hand you an itemized General Price List on request, let you pick and choose services (packages cannot be forced on you), accept a casket or urn purchased elsewhere with no handling fee, and never misrepresent legal requirements. ${s.name} may layer additional state protections on top through its funeral regulatory board.`
      },
      {
        q: `What rights do ${s.name} families have when arranging a funeral?`,
        a: `Under the FTC Funeral Rule, every ${s.name} funeral home is required to give you an itemized price list, allow you to decline any service you do not want, accept caskets or urns brought in from outside providers without surcharges, and avoid false claims about what the law requires. Check with the ${s.name} funeral regulatory board for any additional state-level protections that apply locally.`
      },
      {
        q: `What does the FTC Funeral Rule mean for me in ${s.name}?`,
        a: `In ${s.name}, the Funeral Rule gives you five practical rights: itemized pricing on demand, no obligation to buy bundled packages, the right to supply your own casket or urn without extra fees, protection from false legal claims about mandatory services, and a written estimate before work begins. ${s.name} state consumer-protection laws and the state funeral board can add further rights.`
      }
    ];
    const q4Variants = [
      {
        q: `How can I save on funeral costs in ${s.name}?`,
        a: `Start by lining up General Price Lists from two or three ${s.cities[0]}-area providers before you commit to anything. ${regionSaveHint} Direct cremation at ${$(s.dc)} remains the lowest-cost disposition in every ${s.name} market. Layer in veteran burial benefits, Medicaid funeral assistance, and the Social Security survivor payment where you qualify.`
      },
      {
        q: `What is the best way to reduce funeral expenses in ${s.name}?`,
        a: `The biggest lever is comparison shopping — two or three GPLs from different ${s.name} providers, compared line by line, consistently saves families $1,000 or more. ${regionSaveHint} At ${$(s.dc)}, direct cremation is the cheapest disposition option available in ${s.name}. Always check whether you qualify for veteran burial benefits, Medicaid funeral help, or the Social Security one-time death payment.`
      },
      {
        q: `How do I keep funeral costs down in ${s.name}?`,
        a: `Three moves cut the most: compare at least three ${s.name} General Price Lists side by side before choosing a provider, strip packages down to only the services you actually want, and choose direct cremation (${$(s.dc)}) if cost is the priority. ${regionSaveHint} Then confirm eligibility for veteran, Medicaid, and Social Security survivor benefits.`
      }
    ];
    const q5Variants = [
      {
        q: `Does ${s.name} require embalming?`,
        a: `${s.name} law does not require embalming in most situations. It is generally a choice, not a legal obligation — though a funeral home may insist on it as an internal policy for certain open-casket viewings. Refrigeration is almost always a valid substitute. ${rc.embalmNote} Under the FTC Funeral Rule, no provider may claim embalming is legally required without pointing to a specific statute.`
      },
      {
        q: `Is embalming legally required in ${s.name}?`,
        a: `No — embalming is rarely required by ${s.name} law. Most cases allow refrigeration as an alternative, and the decision is yours. Some ${s.name} funeral homes have internal rules for open-casket viewings, but that is provider policy rather than state law. ${rc.embalmNote} The Funeral Rule specifically prohibits providers from falsely claiming embalming is legally mandated.`
      },
      {
        q: `Do I have to embalm a loved one in ${s.name}?`,
        a: `Almost never. ${s.name} does not legally require embalming in typical circumstances; it is an option you can decline. Refrigeration works in its place for nearly all ${s.name} funeral timelines. ${rc.embalmNote} If a funeral home tells you embalming is legally required, ask them to cite the statute — the FTC Funeral Rule forbids that claim unless it is factually true.`
      }
    ];
    const regionCmp = s.region === 'Northeast' || s.region === 'West' ? 'higher' : 'moderate to lower';
    const q6Variants = [
      {
        q: `How do funeral costs in ${s.name} compare to other states?`,
        a: `${s.name} funerals are ${rc.priceCtx}. The state's traditional-funeral average of ${$(s.f)} sits ${priceComp} the ${natAvgStr} national median, and the ${s.region} region overall trends toward ${regionCmp} pricing than the rest of the country.`
      },
      {
        q: `Is ${s.name} cheaper or more expensive than the US average for funerals?`,
        a: `${s.name} lands ${priceComp} the US median of ${natAvgStr} for a traditional funeral, with the state average at ${$(s.f)}. Costs here are ${rc.priceCtx} and the ${s.region} region trends ${regionCmp} than the country overall. Our state-by-state comparison covers all 50 states.`
      },
      {
        q: `Where does ${s.name} rank nationally for funeral costs?`,
        a: `${s.name}'s ${$(s.f)} average for a traditional funeral puts it ${priceComp} the ${natAvgStr} national median. Pricing in ${s.name} is ${rc.priceCtx}, and the ${s.region} region as a whole tends to price ${regionCmp} than other parts of the US.`
      }
    ];
    const directBurialCost = $(Math.round(s.f*0.6));
    const q7Variants = [
      {
        q: `What is the cheapest funeral option in ${s.name}?`,
        a: `Direct cremation is the lowest-cost option in ${s.name}, starting at roughly ${$(s.dc)}. It covers transport, cremation, and return of the ashes — nothing else. Families then hold a memorial on their own schedule, often at a church, park, or home. Direct burial comes next at around ${directBurialCost} and still avoids viewing, ceremony, and embalming.`
      },
      {
        q: `What is the least expensive way to handle a funeral in ${s.name}?`,
        a: `In ${s.name}, direct cremation at about ${$(s.dc)} is the most affordable path — just transport, cremation, and the return of the remains. A memorial service can happen later, anywhere you choose. If burial is preferred, direct burial (no viewing or ceremony) runs near ${directBurialCost} and is the cheapest burial option.`
      },
      {
        q: `Which funeral option costs the least in ${s.name}?`,
        a: `Direct cremation carries the lowest price tag in ${s.name}, from roughly ${$(s.dc)}. You skip the viewing, ceremony, and embalming — transport, cremation, and return of the ashes are all that are included. Direct burial is the next step up at about ${directBurialCost} and is still considerably cheaper than a traditional service.`
      }
    ];
    const q8Variants = [
      {
        q: `How can I find affordable funeral homes in ${s.name}?`,
        a: `Ask three or more ${s.name} providers for their General Price Lists and compare line by line; call the local Funeral Consumers Alliance chapter for vetted recommendations; look specifically for direct cremation specialists, which often undercut full-service providers; request the simplest or "basic services only" package; and check for nonprofit and cooperative funeral homes in your part of ${s.name}.`
      },
      {
        q: `Where do I look for low-cost funeral providers in ${s.name}?`,
        a: `Start with GPL requests from at least three ${s.name} funeral homes — that alone exposes the outliers. Reach out to the Funeral Consumers Alliance for ${s.name} for member-run lists, shortlist dedicated direct cremation providers, ask every funeral home about their simplest no-frills package, and see if a nonprofit or cooperative provider serves your area of ${s.name}.`
      },
      {
        q: `What is the best way to find a cheap funeral home in ${s.name}?`,
        a: `Three steps: pull General Price Lists from multiple ${s.name} providers and compare the itemized charges; check with the Funeral Consumers Alliance ${s.name} chapter for nonprofit and consumer-friendly providers; and prioritize direct-cremation specialists or cooperative funeral homes where you can get the simplest service tier.`
      }
    ];
    return [
      pickVariant(key, q1Variants, 'q1'),
      pickVariant(key, q2Variants, 'q2'),
      pickVariant(key, q3Variants, 'q3'),
      pickVariant(key, q4Variants, 'q4'),
      pickVariant(key, q5Variants, 'q5'),
      pickVariant(key, q6Variants, 'q6'),
      pickVariant(key, q7Variants, 'q7'),
      pickVariant(key, q8Variants, 'q8')
    ];
  })();

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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">FCA</a>, <a href="https://www.ftc.gov/funerals" target="_blank" rel="nofollow noopener">FTC Funeral Rule</a></span></span>
        <span class="article-meta-item"><span class="article-meta-label">Region:</span> <span class="article-meta-value">${s.region}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `If you are planning a funeral in ${s.name}, understanding typical costs can help you make informed decisions. This guide covers average prices for traditional funerals, cremation, and burial in ${s.name}, along with consumer rights and practical ways to save.`,
          `Funeral costs in ${s.name} run from about ${$(s.dc)} for direct cremation up to ${$(Math.round(s.f*1.3))} for a full traditional service with burial. The range is wide because funeral pricing in ${s.name} is not standardized — what you pay depends heavily on which provider you call first.`,
          `Most ${s.name} families learn funeral prices the hardest possible way: one quote, one signature, one surprise line item. This guide walks through what the full picture actually looks like in ${s.name} — the average ${$(s.f)} traditional service, the ${$(s.dc)} direct cremation floor, and the fees that tend to appear in between.`,
          `Whether you are arranging a service now or planning ahead for later, knowing current ${s.name} funeral costs puts you in a stronger position. The state's cremation rate of ${s.cr} and ${rc.priceCtx.split(',')[0]} pricing both shape what's realistic here. Below: the real numbers and the savings strategies that actually work in ${s.name}.`,
          `Nothing about ${s.name} funeral pricing is fixed. The same traditional service quoted at ${$(s.f)} from one provider can run ${$(Math.round(s.f*0.75))} or ${$(Math.round(s.f*1.3))} at the next — that variation is the single most important thing to understand before you commit. This guide lays out typical ${s.name} costs and where the gaps tend to show up.`,
          `The honest picture of ${s.name} funeral costs in 2026: a traditional service averages ${$(s.f)}, cremation with ceremony sits near ${$(s.c)}, and direct cremation can come in around ${$(s.dc)}. But averages hide the variance — in ${s.name} the same service can swing several thousand dollars between providers in the same city. This guide walks through what families here actually pay and where the pricing gaps show up.`,
          `Arranging a funeral in ${s.name} is not one decision but dozens, and each one carries a price tag that is almost always negotiable. From the service fee to the casket, from the cemetery plot to the headstone, every line item in ${s.name} has a range — and knowing that range is the difference between a ${$(Math.round(s.f*0.8))} bill and a ${$(Math.round(s.f*1.25))} one. Here is what current pricing looks like across ${s.name}.`,
          `A ${s.name} funeral is rarely a single bill. It is a funeral home invoice, a cemetery invoice (if burial), and a handful of third-party charges — and the way those numbers add up in ${s.name} can surprise families who only saw the headline quote. This guide pulls the pieces apart: the ${$(s.f)} traditional service average, the ${$(s.dc)} direct cremation option, and what the gap between them actually buys in ${s.name}.`,
          `Funeral pricing in ${s.name} follows patterns that are very different from other parts of the country. Cremation adoption sits at ${s.cr}, real estate and cost-of-living factors push the ${$(s.f)} traditional-funeral average ${priceComp} the ${pctDiff > 0 ? `$${natAvg.toLocaleString()}` : 'US'} median, and regional traditions shape which services families typically expect. Here is how the current numbers shake out in ${s.name}.`
        ];
        return pickVariant([s.slug, s.abbr, s.region], openings, 'intro');
      })()}</p>

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
      ${(function(){
        const costLevel = s.f > 8000 ? 'higher' : s.f > 7000 ? 'moderate' : 'lower';
        const key = [s.slug, s.abbr, s.region];
        const openers = [
          `<p>Funeral costs in ${s.name} are influenced by several factors. The ${s.region} region of the United States tends to have ${costLevel}-than-average funeral costs compared to the national median of $7,848. Within ${s.name}, you will find significant price differences between urban and rural areas, with metropolitan areas generally costing 10% to 30% more than small towns.</p><p>The cost of living in ${s.name}, local competition among funeral providers, state regulations, cultural traditions, and real estate prices all play a role in determining what families pay. The cremation rate of ${s.cr} in ${s.name} also affects the market — areas with higher cremation rates often see more competitive pricing for cremation services.</p>`,
          `<p>Several forces shape funeral pricing in ${s.name}. Regionally, the ${s.region} trends toward ${costLevel}-than-average costs relative to the $7,848 US median, and within ${s.name} that gap widens between a dense metro like ${s.cities[0]} and the smaller towns — city prices routinely sit 10-30% higher. Real-estate overhead on funeral home facilities, local labor costs, and the state's regulatory environment all feed into the final bill.</p><p>${s.name}'s ${s.cr} cremation rate also matters: where more families choose cremation, direct cremation providers get competitive on price. In lower-cremation ${s.name} areas the direct cremation market is thinner, so shopping around pays off more.</p>`,
          `<p>What you pay for a funeral in ${s.name} depends on a cluster of local factors rather than any single number. Cost of living in ${s.name}, how many funeral homes compete in your area, whether ${s.name} state regulations require specific steps, and local real estate prices for funeral home facilities all feed into quotes. ${s.region} pricing is generally ${costLevel} than the US median of $7,848, and metro-versus-rural pricing in ${s.name} routinely differs by 10-30%.</p><p>The state's ${s.cr} cremation rate shapes pricing too. Where cremation adoption is high, direct cremation providers tend to post competitive flat rates. Where it is lower, you may need to call further to find the best direct cremation price in ${s.name}.</p>`
        ];
        return pickVariant(key, openers, 'drives');
      })()}

      <h2 id="hidden-fees">Hidden Funeral Fees in ${s.name} — What to Watch For</h2>
      ${(function(){
        const key = [s.slug, s.abbr, s.region];
        const leads = [
          `<p>Many ${s.name} families are surprised by charges that appear after the initial quote. Here are the most common hidden funeral fees to watch for:</p>`,
          `<p>The ${s.name} funeral invoice almost never matches the initial quote. These are the surcharges, add-ons, and fine-print line items that most often drive the bill up:</p>`,
          `<p>Quoted prices in ${s.name} rarely include every charge. Before you sign anything, know which line items tend to show up late in the process:</p>`,
          `<p>Most of the pricing surprises in ${s.name} come from a predictable list of add-ons. Look for these specifically when reviewing any funeral home quote:</p>`
        ];
        return pickVariant(key, leads, 'hidden');
      })()}
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
      <p>If you believe a funeral home in ${s.name} has violated these rights, you can file a complaint with the FTC at <a href="https://www.ftc.gov" target="_blank" rel="nofollow noopener">ftc.gov</a> or contact the <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a> for guidance. Your state attorney general's office can also assist with consumer protection complaints.</p>

      <h2 id="regional-context">What's Specific to ${s.name} (${s.region})</h2>
      <p>${regionalFuneralNote(s)}</p>

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
      ${(function(){
        const key = [s.slug, s.abbr, s.region];
        const intros = [
          `<p>If you are currently arranging a funeral in ${s.name}, here is a step-by-step approach that can save you time, stress, and money:</p>`,
          `<p>When an immediate ${s.name} funeral arrangement lands on you, the order of operations matters. This sequence tends to save both money and emotional bandwidth:</p>`,
          `<p>Families arranging a funeral in ${s.name} for the first time often move faster than they need to. The following sequence slows things down just enough to compare options without adding undue delay:</p>`,
          `<p>For anyone planning a funeral in ${s.name} now or soon, these steps — in roughly this order — prevent the most common expensive mistakes:</p>`
        ];
        return pickVariant(key, intros, 'whattodo');
      })()}
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
  const title = `${m.city} Funeral Costs 2026: ${$(mdc)}–${$(mf)}`;
  const desc = `Funeral costs in ${m.city}${m.dc ? '' : ', ' + m.st} (2026): traditional ${$(mf)}, cremation ${$(mc)}, direct cremation from ${$(mdc)}. Compare providers and find real savings.`;

  // Find nearby cities in the same state for comparison
  const stateMetros = metros.filter(x => x.ss === m.ss && x.slug !== m.slug);
  const nearbyComparison = stateMetros.length > 0 ? stateMetros.slice(0, 3) : [];

  const faq = (function(){
    const key = [m.slug, m.ss, s.region, 'metro'];
    const priceCtx = m.mp > 1.1 ? 'higher than' : 'close to';
    const stateAbovePct = Math.round((m.mp-1)*100);
    const q1 = [
      {q:`How much does a funeral cost in ${m.city}?`,a:`The average traditional funeral in ${m.city} costs approximately ${$(mf)}, which is ${priceCtx} the ${m.st} state average of ${$(s.f)}. Direct cremation starts around ${$(mdc)}. Cemetery plots average ${$(mb)}. Total costs including burial or cremation typically range from ${$(mdc)} for the simplest option to ${$(Math.round(mf*1.3 + mb))} for a full traditional burial.`},
      {q:`What is the typical funeral price in ${m.city}?`,a:`Traditional funerals in ${m.city} average about ${$(mf)}, running ${priceCtx} the ${m.st} state figure of ${$(s.f)}. Direct cremation starts near ${$(mdc)} and cemetery plots average ${$(mb)}. Your final total will land somewhere between ${$(mdc)} (direct cremation, simplest option) and ${$(Math.round(mf*1.3 + mb))} (full traditional burial with all trimmings).`},
      {q:`What are funeral costs in the ${m.city} area?`,a:`${m.city} funeral pricing centers on a ${$(mf)} traditional-funeral average — ${priceCtx} the ${m.st} statewide ${$(s.f)}. Direct cremation in ${m.city} starts around ${$(mdc)}, and a cemetery plot runs about ${$(mb)} on average. Expect totals from ${$(mdc)} at the low end to ${$(Math.round(mf*1.3 + mb))} for a full burial with all line items included.`}
    ];
    const q2 = [
      {q:`Is cremation or burial more common in ${m.city}?`,a:`In the ${m.city} area, the cremation rate follows ${m.st}'s overall rate of ${s.cr}. Cremation remains the more affordable option, with direct cremation costing ${$(mdc)} compared to traditional burial at ${$(mf)} plus cemetery fees of ${$(mb)}. Many ${m.city} families choose cremation to reduce costs while still holding a meaningful memorial service.`},
      {q:`Do more ${m.city} families choose cremation or burial?`,a:`${m.city} generally tracks ${m.st}'s ${s.cr} cremation rate. The cost gap is big: direct cremation around ${$(mdc)} versus ${$(mf)} for a traditional funeral plus another ${$(mb)} for the cemetery plot. That math is why most ${m.city} families weighing cremation end up choosing it — a separate memorial service still lets the family gather meaningfully.`},
      {q:`What is ${m.city}'s cremation-versus-burial split?`,a:`${m.city} largely follows ${m.st}'s ${s.cr} cremation rate. The economics are stark — direct cremation near ${$(mdc)} against a traditional funeral at ${$(mf)} plus ${$(mb)} for the plot — so cost is the primary driver locally. A memorial service after cremation is the most common hybrid choice in the ${m.city} metro.`}
    ];
    const natAvg = 7848;
    const q3 = [
      {q:`How do ${m.city} funeral costs compare to the national average?`,a:`${m.city} funeral costs are ${mf > natAvg ? 'above' : 'below'} the national average of $${natAvg.toLocaleString()} for a traditional funeral. The ${m.city} metro area's cost of living ${m.mp > 1.15 ? 'significantly' : 'somewhat'} influences local funeral pricing. ${mf > 9000 ? 'Families in ' + m.city + ' may save by comparing providers carefully or considering direct cremation.' : 'While costs are manageable, comparing at least 2-3 providers can still save hundreds.'}`},
      {q:`Is ${m.city} more or less expensive than the US average for funerals?`,a:`${m.city} sits ${mf > natAvg ? 'above' : 'below'} the national $${natAvg.toLocaleString()} average for a traditional funeral — the cost of living in ${m.city} is ${m.mp > 1.15 ? 'a significant' : 'a modest'} factor. ${mf > 9000 ? 'Comparing providers in ' + m.city + ' aggressively, or choosing direct cremation, is the reliable way to push costs down.' : 'Even at this price point, comparing two or three ' + m.city + ' providers can save several hundred dollars.'}`},
      {q:`Where does ${m.city} rank nationally for funeral pricing?`,a:`${m.city} pricing lands ${mf > natAvg ? 'above' : 'below'} the US $${natAvg.toLocaleString()} average for a traditional funeral. ${m.city}'s cost of living plays ${m.mp > 1.15 ? 'a substantial' : 'a moderate'} role. ${mf > 9000 ? 'Because of the higher baseline, shopping carefully across ' + m.city + ' providers and weighing direct cremation matters more here than in lower-cost markets.' : 'The baseline is manageable, but pulling GPLs from 2-3 ' + m.city + ' providers can still save hundreds.'}`}
    ];
    const q4 = [
      {q:`Where can I compare funeral home prices in ${m.city}?`,a:`Under the FTC Funeral Rule, every funeral home in ${m.city} must provide a General Price List. Call 2-3 providers to request their GPL. You can also visit Parting.com or the Funeral Consumers Alliance for price comparison resources.`},
      {q:`How do I compare funeral quotes in ${m.city}?`,a:`The FTC Funeral Rule requires every ${m.city} funeral home to give you an itemized General Price List on request — no appointment, no commitment. Call two or three ${m.city} providers and ask for their GPL over the phone or by email. For extra perspective, Parting.com aggregates ${m.city}-area quotes and the Funeral Consumers Alliance offers independent resources.`},
      {q:`What is the best way to compare ${m.city} funeral homes?`,a:`Start with GPL requests — the federal Funeral Rule gives you the right to an itemized price list from any ${m.city} funeral home, on demand. Call or email two or three providers. Parting.com provides aggregated ${m.city} price data, and the Funeral Consumers Alliance publishes independent comparison tools.`}
    ];
    const q5 = [
      {q:`What is direct cremation in ${m.city} and how much does it cost?`,a:`Direct cremation in ${m.city} costs approximately ${$(mdc)} and is the most affordable option. It includes transportation to the crematory and return of ashes without a viewing or ceremony. Families can hold a separate memorial service at a later date, often at a fraction of the cost of a traditional funeral.`},
      {q:`How much is direct cremation in ${m.city}?`,a:`Direct cremation in ${m.city} runs about ${$(mdc)} and is the lowest-cost disposition available. The service covers transport to the crematory and return of the ashes — no viewing, no ceremony. A memorial service can be held separately on the family's timeline, usually at much lower cost than a traditional funeral at the funeral home.`},
      {q:`What does direct cremation include in ${m.city}?`,a:`Direct cremation in ${m.city} is the simplest, most affordable option at about ${$(mdc)}. It is exactly three things: transport to the crematory, cremation itself, and return of the ashes. Everything else — viewing, ceremony, embalming — is skipped. Many ${m.city} families hold a memorial afterward at a church, home, park, or any venue of their choice.`}
    ];
    const q6 = [
      {q:`Are there affordable funeral options in ${m.city}?`,a:`Yes. Direct cremation from ${$(mdc)} is the most affordable. You can also consider direct burial (no service), memorial-only services, or home funerals where permitted. Third-party caskets save 50-70% versus funeral home prices. Veteran benefits, Medicaid, and crowdfunding may also help offset costs.`},
      {q:`What are the cheapest funeral choices in ${m.city}?`,a:`${m.city} has several affordable paths. Direct cremation at ${$(mdc)} is the cheapest disposition. Direct burial (no viewing or ceremony) is the cheapest burial. Memorial-only services at a venue you choose sidestep funeral-home facility fees. Independently purchased caskets save 50-70%. And veteran benefits, Medicaid assistance, and crowdfunding can close remaining gaps.`},
      {q:`How can ${m.city} families find low-cost funeral options?`,a:`The cheapest path in ${m.city} is direct cremation at ${$(mdc)}. Direct burial, memorial services held outside the funeral home, and third-party caskets (50-70% cheaper than funeral home pricing) are other standard cost-cutters. Veteran benefits, Medicaid funeral aid, and crowdfunding platforms can offset whatever remains.`}
    ];
    return [
      pickVariant(key, q1, 'mq1'),
      pickVariant(key, q2, 'mq2'),
      pickVariant(key, q3, 'mq3'),
      pickVariant(key, q4, 'mq4'),
      pickVariant(key, q5, 'mq5'),
      pickVariant(key, q6, 'mq6')
    ];
  })();

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

  const content = `${head(title, desc, fn, `Funeral Costs in ${m.city}`, faq, m.dc ? {name:'Funeral Costs by State',url:'funeral-costs-by-state.html'} : {name:`${s.name} Funeral Costs`,url:`funeral-costs-${s.slug}.html`})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="funeral-costs-by-state.html">Costs by State</a> &rsaquo; ${m.dc ? '' : `<a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; `}<span aria-current="page">${m.city}</span>
      </nav>

      <h1>Funeral Costs in ${m.dc ? 'Washington, DC' : `${m.city}, ${m.st}`} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">${m.dc ? 'Area' : 'State'}:</span> <span class="article-meta-value">${m.dc ? 'Washington, DC Metro' : `<a href="funeral-costs-${s.slug}.html">${m.st}</a>`}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `If you are arranging a funeral in the ${m.city} metropolitan area, this guide provides realistic cost estimates to help you plan. Funeral costs in ${m.city} tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average due to the area's cost of living.`,
          `Funeral pricing in ${m.city} lands ${m.mp > 1.15 ? 'noticeably above' : 'roughly in line with'} the rest of ${m.st}, with traditional services averaging around ${$(mf)} and direct cremation starting near ${$(mdc)}. The gap between providers in a single metro is often wider than the gap between cities — which is why comparison shopping matters most here.`,
          `${m.city} families typically face two price tiers: the full-service traditional funeral at around ${$(mf)} and the stripped-down direct cremation at ${$(mdc)}. Most of what drives the difference — viewing, embalming, facility use, casket choice — is optional under the FTC Funeral Rule, even when quotes make it look bundled.`,
          `Knowing real ${m.city} funeral costs before you walk into a provider changes the conversation. This guide lays out what families here actually pay in 2026, how ${m.city} prices compare to the rest of ${m.st}, and which line items have the most room to move.`,
          `Planning a funeral in ${m.city} means working with ${m.st}-level averages adjusted for local real estate, labor, and facility costs. The result is a traditional funeral running around ${$(mf)} and direct cremation near ${$(mdc)} — numbers that shift meaningfully from one ${m.city} provider to the next.`,
          `A funeral in ${m.city} sits inside a wide price band: the low end of direct cremation starts near ${$(mdc)}, while a full traditional funeral with burial reaches past ${$(Math.round(mf*1.3 + mb))} once the plot, vault, and marker are added. Where your arrangement lands depends mostly on which services you decline, not which you add.`,
          `Most ${m.city} families do not realize how much of a funeral bill is optional until they request an itemized General Price List. Local traditional funerals average ${$(mf)} and cremations average ${$(mc)}, but the spread between the cheapest and most expensive ${m.city} providers for the same service is often $2,000–$4,000.`,
          `Local market conditions shape ${m.city} funeral pricing more than most families expect. A ${m.st} average of ${$(s.f)} for a traditional funeral becomes about ${$(mf)} once ${m.city}'s real-estate and operating costs flow through. Understanding that multiplier makes comparison shopping here more productive, not less.`,
          `This ${m.city} cost guide walks through the 2026 numbers the way a funeral director's own General Price List would: service by service, optional where possible, with the local multiplier applied honestly. Expect to see a traditional funeral average of ${$(mf)}, direct cremation at ${$(mdc)}, and a cemetery plot around ${$(mb)}.`
        ];
        return pickVariant([m.slug, m.ss, s.region, 'metro-intro'], openings, 'mintro');
      })()}</p>

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

      <h2>Regional Context: Funeral Pricing in the ${s.region}</h2>
      <p>${regionalFuneralNote(s)}</p>

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
  const title = `${s.name} Cremation Costs 2026: From ${$(s.dc)}`;
  const desc = `Cremation in ${s.name} (2026): direct cremation from ${$(s.dc)}, cremation with service ${$(s.c)}. Save up to ${$(s.f - s.dc)} vs. traditional burial. Real prices, options, regulations.`;
  const crRate = parseInt(s.cr);
  const crContext = crRate > 70 ? 'one of the highest cremation rates in the nation' : crRate > 55 ? 'above the national average' : crRate > 45 ? 'near the national average' : 'below the national average, though cremation rates have been rising steadily';
  const savingsVsBurial = $(s.f - s.dc);

  const faq = (function(){
    const key = [s.slug, s.abbr, s.region, 'crem'];
    const q1 = [
      {q:`How much does cremation cost in ${s.name}?`,a:`Cremation costs in ${s.name} range from ${$(s.dc)} for direct cremation to ${$(s.c)} for a full funeral service followed by cremation. Additional costs may include urns ($50-$3,000), memorial services ($500-$2,000), and scattering or inurnment fees ($200-$600). The total depends on the level of service you choose.`},
      {q:`What is the typical price of cremation in ${s.name}?`,a:`${s.name} cremation pricing lives in two tiers: direct cremation — transport, cremation, and return of ashes — starting around ${$(s.dc)}, and full-service cremation with a ceremony landing near ${$(s.c)}. Urns ($50-$3,000), memorial venues ($500-$2,000), and scattering or inurnment fees ($200-$600) are separate line items most providers will quote on request.`},
      {q:`What does cremation cost in ${s.name} in 2026?`,a:`Cremation in ${s.name} runs from roughly ${$(s.dc)} for the simplest direct option up to about ${$(s.c)} when paired with a viewing or ceremony. Urns, memorial services, and interment of ashes are priced separately — typically $50-$3,000 for an urn, $500-$2,000 for a memorial, and $200-$600 for scattering or inurnment. Your final number depends on which tier you pick.`}
    ];
    const q2 = [
      {q:`What types of cremation are available in ${s.name}?`,a:`Families in ${s.name} can choose from three main types: direct cremation (${$(s.dc)}) — the most affordable option with no viewing or ceremony; cremation with memorial service (ceremony held after cremation, often more flexible on timing); and traditional cremation (${$(s.c)}) — a full funeral service before cremation. Each option can be customized to fit your family's needs and budget.`},
      {q:`Which cremation options exist in ${s.name}?`,a:`${s.name} providers typically offer three tiers. Direct cremation at ${$(s.dc)} is the simplest — no service, no viewing, body cremated and ashes returned. Cremation with a later memorial keeps the ceremony but shifts it to a venue of your choice, offering timing flexibility. Traditional cremation at ${$(s.c)} is a full funeral home service followed by cremation. Each can be adjusted to match family preferences and budget.`},
      {q:`What kinds of cremation services can I choose in ${s.name}?`,a:`Three paths are standard in ${s.name}: (1) direct cremation — ${$(s.dc)}, just the cremation itself, no service; (2) cremation with memorial — cremation first, ceremony later at a location of your choice, priced in between; (3) cremation with full funeral — ${$(s.c)}, ceremony and viewing before cremation. Any of the three can be tailored to the family's specific wishes.`}
    ];
    const q3 = [
      {q:`What are ${s.name}'s cremation regulations?`,a:`${s.name} follows standard cremation regulations requiring a mandatory waiting period (typically 24-48 hours) before cremation. Written authorization from the legal next of kin is required, and some counties require a permit from the medical examiner. Pacemakers and certain implants must be removed beforehand. Under the FTC Funeral Rule, you are not required to purchase a casket for cremation — an alternative container is sufficient.`},
      {q:`What legal requirements apply to cremation in ${s.name}?`,a:`A 24-48 hour waiting period applies before cremation in ${s.name}, along with written authorization from the legal next of kin. Some ${s.name} counties require a medical examiner's permit before release. Pacemakers, implanted defibrillators, and certain other implants are removed beforehand. And under the federal Funeral Rule, you do not need to buy a full casket — an alternative cremation container is sufficient.`},
      {q:`Does ${s.name} have specific rules for cremation?`,a:`Yes. ${s.name} requires written authorization from the legal next of kin, a standard 24-48 hour waiting period, and in some counties a permit from the medical examiner before cremation can proceed. Pacemakers and certain implants must be removed first. The FTC Funeral Rule (federal) separately guarantees you do not need a casket for cremation — a basic cremation container suffices.`}
    ];
    const q4 = [
      {q:`Can I scatter ashes in ${s.name}?`,a:`Scattering laws in ${s.name} vary by location. Generally, you may scatter ashes on private property with owner permission, at sea (3+ nautical miles offshore per EPA regulations), and in some designated public areas. National parks may require a permit. Always check local ordinances and be respectful of the environment and others. Some ${s.name} families also choose columbarium niches, burial of ashes, or memorial keepsakes as alternatives to scattering.`},
      {q:`Where are ashes allowed to be scattered in ${s.name}?`,a:`${s.name} scattering rules depend on the specific location. Private land is generally fine with the owner's permission; at sea requires being at least 3 nautical miles offshore per EPA rules; many state and national parks need a permit (and in some cases prohibit it entirely). Check the local ordinance before choosing a spot. Families in ${s.name} also often opt for columbarium niches, burial of the urn, or keepsake jewelry in place of scattering.`},
      {q:`Is ash scattering legal in ${s.name}?`,a:`In most cases yes, but the specifics depend on where. In ${s.name} you can generally scatter on private land (with owner permission) or at sea beyond 3 nautical miles under EPA rules. National park scattering often requires a free permit. Check ${s.name} local ordinances and any park-specific rules before proceeding. Some families prefer columbarium niches, urn burial, or memorial jewelry to avoid the permitting question entirely.`}
    ];
    const q5 = [
      {q:`Why is cremation ${crRate > 55 ? 'so popular' : 'growing'} in ${s.name}?`,a:`${s.name} has ${crContext}, with a cremation rate of ${s.cr}. Factors driving cremation adoption include lower cost compared to traditional burial (saving ${savingsVsBurial} or more), greater flexibility for memorial services, environmental considerations, and changing cultural preferences. The national cremation rate has exceeded 60% and continues to rise annually.`},
      {q:`Why do so many ${s.name} families choose cremation?`,a:`${s.name} sits with ${crContext} at ${s.cr}. The drivers are familiar: cremation costs far less than traditional burial (the direct-cremation-to-traditional-funeral gap is about ${savingsVsBurial} in ${s.name}), families can schedule memorials on their own timeline, environmental concerns weigh on more people, and cultural norms around burial have shifted nationally past 60% cremation.`},
      {q:`What is driving ${s.name}'s cremation rate?`,a:`${s.name}'s ${s.cr} cremation rate reflects ${crContext}. The cost delta alone explains a lot — families save roughly ${savingsVsBurial} by choosing direct cremation over a traditional funeral in ${s.name}. Add in the greater flexibility for memorial service timing, the environmental considerations, and the broad cultural shift (US cremation rate is now over 60% and still climbing), and the trend is easy to see.`}
    ];
    const q6 = [
      {q:`How long does cremation take in ${s.name}?`,a:`In ${s.name}, the cremation process itself takes 2 to 3 hours. However, there is typically a mandatory 24 to 48 hour waiting period before cremation can proceed. After cremation, ashes are usually ready for pickup or delivery within 3 to 7 business days. Direct cremation (${$(s.dc)}) has the shortest total timeline since no viewing or ceremony is involved.`},
      {q:`What is the timeline for cremation in ${s.name}?`,a:`The cremation itself runs 2-3 hours in ${s.name}. Factor in the mandatory 24-48 hour waiting period before cremation, then 3-7 business days for the crematory to process paperwork and prepare the ashes for pickup or delivery. A direct cremation (${$(s.dc)}) is the fastest end-to-end because no ceremony sits between death and cremation.`},
      {q:`How quickly can cremation be completed in ${s.name}?`,a:`From start to ashes, most cremations in ${s.name} take 4 to 10 days. The cremation itself is 2-3 hours, but the mandatory 24-48 hour pre-cremation waiting period and the 3-7 business day processing window dominate the timeline. Direct cremation at ${$(s.dc)} moves fastest since there is no viewing or service to schedule beforehand.`}
    ];
    const q7 = [
      {q:`Can I hold a funeral service before cremation in ${s.name}?`,a:`Yes. A traditional funeral service followed by cremation costs approximately ${$(s.c)} in ${s.name}. This includes visitation, a ceremony, and then cremation instead of burial. You can also hold a memorial service after cremation, which offers more flexibility on timing and location and typically costs less.`},
      {q:`Is it possible to have a ceremony before cremation in ${s.name}?`,a:`Yes. ${s.name} funeral homes regularly arrange visitation and a ceremony before cremation takes place — the full-service option typically runs around ${$(s.c)}. If the ceremony timing is flexible, a memorial service after cremation (at any venue, anytime) is another option and usually costs less than the full traditional route.`},
      {q:`Do I have to skip the service if I choose cremation in ${s.name}?`,a:`Not at all. ${s.name} providers offer cremation with a full service — visitation, ceremony, and then cremation instead of burial — for about ${$(s.c)}. Memorial services after cremation are also common, letting families choose any venue or date. Only direct cremation at ${$(s.dc)} omits the service entirely.`}
    ];
    return [
      pickVariant(key, q1, 'cq1'),
      pickVariant(key, q2, 'cq2'),
      pickVariant(key, q3, 'cq3'),
      pickVariant(key, q4, 'cq4'),
      pickVariant(key, q5, 'cq5'),
      pickVariant(key, q6, 'cq6'),
      pickVariant(key, q7, 'cq7')
    ];
  })();

  const content = `${head(title, desc, fn, `Cremation Costs in ${s.name}`, faq, {name:'Cremation Costs by State',url:'cremation-costs-by-state.html'})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="cremation-costs-by-state.html">Cremation Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Cremation Costs</span>
      </nav>

      <h1>Cremation Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Cremation Rate:</span> <span class="article-meta-value">${s.cr}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `With a cremation rate of ${s.cr}, ${parseInt(s.cr) > 55 ? 'cremation is the most popular disposition choice' : 'cremation is increasingly chosen by families'} in ${s.name}. Whether you are considering direct cremation as the most affordable option or a full funeral service followed by cremation, this guide explains what to expect and what you will pay in ${s.name}.`,
          `Cremation pricing in ${s.name} is simpler than traditional burial but can still vary by thousands of dollars between providers. Direct cremation starts around ${$(s.dc)} while cremation with a full service averages ${$(s.c)}. This guide walks through what's included at each price point and how ${s.name}'s ${s.cr} cremation rate shapes local options.`,
          `Families choosing cremation in ${s.name} save an average of ${$(s.f - s.dc)} compared to traditional burial. The state's cremation rate — currently ${s.cr} — reflects a steady national shift toward simpler, lower-cost services. Here's the real pricing in ${s.name}, plus what to watch for when comparing providers.`,
          `If you're weighing cremation in ${s.name}, the first honest question is: direct cremation or cremation with a service? The gap between them — roughly ${$(s.c - s.dc)} in ${s.name} — is where most of the decision lives. This guide breaks down both options with current pricing and the regulations that apply in ${s.name}.`,
          `Cremation in ${s.name} is no longer the quiet alternative it was a generation ago. At a ${s.cr} adoption rate, it has moved into the mainstream — and with direct cremation running about ${$(s.dc)} versus ${$(s.f)} for a full traditional funeral, the economic case is clear. This guide covers what ${s.name} families actually pay, what the regulations require, and where the real decisions live.`,
          `Three numbers drive the cremation conversation in ${s.name}: ${$(s.dc)} for direct cremation, ${$(s.c)} for cremation with a full service, and ${s.cr} for the state's current cremation rate. Everything else — urns, memorial venues, scattering, inurnment — is a smaller add-on to those base figures. This guide walks through how each of those numbers is built, and where families can usually save.`,
          `${s.name}'s cremation market has matured enough in 2026 that the pricing is mostly predictable. Direct cremation lands near ${$(s.dc)}, cremation with a ceremony near ${$(s.c)}, and the ${s.cr} cremation rate means most providers compete seriously on price. Here is what the numbers look like now, what regulations apply, and what to ask every ${s.name} provider before you commit.`
        ];
        return pickVariant([s.slug, s.abbr, s.region, 'crem'], openings, 'intro');
      })()}</p>

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
        ${regionalCremationSavingsBullets(s)}
      </ul>
      <p>For more ways to reduce costs, see our <a href="cheap-funeral-options.html">affordable funeral options guide</a> or learn <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>.</p>

      <h2>Regional Context for Cremation in ${s.name}</h2>
      <p>${regionalCremationNote(s)}</p>

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
  const title = `${s.name} Burial Costs 2026: Plots from ${$(s.b)}`;
  const desc = `Burial costs in ${s.name} (2026): funeral service ${$(s.f)}, cemetery plot from ${$(s.b)}, total ${totalBurial}–${totalBurialHigh}. Hidden fees, casket savings, cheapest options.`;

  const burialRegionHints = {
    'South': `church- and family-owned cemeteries in the ${s.region} routinely underprice commercial memorial parks, and above-ground entombment is worth asking about in low-lying parts of ${s.name}.`,
    'Northeast': `${s.name} has many nonprofit, municipal, and denominational cemeteries that undercut private memorial parks, and winter pricing can add a separate line item between December and March.`,
    'Midwest': `township, county, and fraternal cemeteries in ${s.name} are often only listed through the county clerk and frequently price plots well below commercial memorial parks.`,
    'West': `green and hybrid burial sections in ${s.name} cemeteries often sit 30-50% below traditional plots, and conservation burial grounds are more established here than in most regions.`,
    'Mountain': `rural ${s.name} cemeteries served by county clerks often price far below ${s.cities[0]}-area private cemeteries, and seasonal ground-closing windows at elevation can affect the interment timeline.`
  };
  const bHint = burialRegionHints[s.region] || burialRegionHints['Midwest'];

  const faq = (function(){
    const key = [s.slug, s.abbr, s.region, 'burial'];
    const q1 = [
      {q:`How much does burial cost in ${s.name}?`,a:`A traditional burial in ${s.name} costs approximately ${$(s.f)} for the funeral service plus ${$(s.b)} for a cemetery plot. When you add a burial vault (${$(Math.round(s.b * 0.4))}), opening and closing fees (${$(Math.round(s.b * 0.5))}), casket (${$(Math.round(s.f * 0.3))}), and headstone ($1,000-$3,000), the total typically ranges from ${totalBurial} to ${totalBurialHigh}.`},
      {q:`What is the full price of burial in ${s.name}?`,a:`A full burial in ${s.name} comes in at about ${$(s.f)} for the funeral service, ${$(s.b)} for the cemetery plot, ${$(Math.round(s.f * 0.3))} for a casket, ${$(Math.round(s.b * 0.4))} for a vault, ${$(Math.round(s.b * 0.5))} for opening and closing, and $1,000-$3,000 for a headstone. Totals generally land between ${totalBurial} and ${totalBurialHigh} depending on choices.`},
      {q:`What do ${s.name} families spend on burial?`,a:`Typical ${s.name} burials total between ${totalBurial} and ${totalBurialHigh}. The funeral service runs about ${$(s.f)}, the cemetery plot ${$(s.b)}, the casket around ${$(Math.round(s.f * 0.3))}, the vault ${$(Math.round(s.b * 0.4))}, opening-and-closing ${$(Math.round(s.b * 0.5))}, and a headstone $1,000-$3,000. Every line has room to move if you compare providers.`}
    ];
    const q2 = [
      {q:`Is a burial vault required in ${s.name}?`,a:`Burial vaults are required by most cemeteries in ${s.name} as a matter of cemetery policy (to prevent ground settling), though they are rarely mandated by state law. A grave liner — a less expensive alternative to a full vault — may also meet the cemetery's requirements. Always ask the specific cemetery about their policies and whether cheaper alternatives are accepted. Vault costs in ${s.name} typically range from $800 to $10,000.`},
      {q:`Do I need a vault for burial in ${s.name}?`,a:`${s.name} state law rarely mandates a burial vault, but most individual cemeteries require one as a matter of policy to prevent the grave from settling. Grave liners (cheaper than full vaults) often satisfy the same requirement — ask the specific cemetery what they accept. Vault prices in ${s.name} range from $800 to $10,000 depending on material and brand.`},
      {q:`Are burial vaults mandatory in ${s.name}?`,a:`Not by state law, but almost always by cemetery policy in ${s.name}. Cemeteries require a vault or a less expensive grave liner to keep the ground stable over time. A liner is usually an acceptable substitute — always ask the specific ${s.name} cemetery for their written policy. Vault pricing spans $800 to $10,000 in the state.`}
    ];
    const q3 = [
      {q:`What are the cheapest burial options in ${s.name}?`,a:`The most affordable burial options in ${s.name} include: direct burial (no viewing or ceremony, body buried shortly after death) which eliminates embalming and facility costs; green or natural burial using a biodegradable container and no embalming, available at select ${s.name} cemeteries; and purchasing a casket from an independent retailer rather than the funeral home, which can save 50-70% on casket costs alone. See our affordable funeral options guide for more strategies.`},
      {q:`How can I reduce burial costs in ${s.name}?`,a:`Three options cut ${s.name} burial costs the most: choose direct burial (interment without viewing, ceremony, or embalming); go with green or natural burial at a ${s.name} cemetery that offers it (biodegradable container, no embalming, often a smaller plot fee); and buy the casket from an independent or online retailer rather than the funeral home — casket savings alone can run 50-70%.`},
      {q:`What is the most affordable way to bury someone in ${s.name}?`,a:`Direct burial is the lowest-cost path in ${s.name} — it skips viewing, ceremony, and embalming. Green or natural burial is the next rung up, available at a growing number of ${s.name} cemeteries with biodegradable containers and no embalming. And independently purchased caskets — legal under the FTC Funeral Rule — save 50-70% versus funeral home markups.`}
    ];
    const q4 = [
      {q:`How do I compare cemetery costs in ${s.name}?`,a:`Cemetery costs in ${s.name} vary significantly even within the same city. Request a complete itemized price sheet from each cemetery — plot cost, opening-and-closing fees, vault policies, perpetual care, and any residency or denominational restrictions. Unlike funeral homes, cemeteries are not bound by the FTC Funeral Rule, so you have to ask proactively. In particular, ${bHint}`},
      {q:`What is the best way to shop cemeteries in ${s.name}?`,a:`Ask each ${s.name} cemetery for a full itemized price sheet covering the plot, opening-and-closing fees, vault or liner requirements, perpetual-care charge, and any residency or denominational rules. Cemeteries are not covered by the FTC Funeral Rule, so they will only provide these details when asked directly. Notably, ${bHint}`},
      {q:`How do cemetery prices differ across ${s.name}?`,a:`${s.name} cemetery pricing varies widely — two cemeteries in the same city can differ by thousands on plot price alone. Always request an itemized sheet covering plot, opening-and-closing, vault policy, perpetual care, and any residency or membership restrictions. Cemeteries are outside the FTC Funeral Rule's reach, so transparency is on you to pursue. A useful tip: ${bHint}`}
    ];
    const q5 = [
      {q:`What is the total cost of burial in ${s.name} including everything?`,a:`The total cost of burial in ${s.name} including funeral service (${$(s.f)}), cemetery plot (${$(s.b)}), casket (${$(Math.round(s.f*0.3))}), vault (${$(Math.round(s.b*0.4))}), opening/closing (${$(Math.round(s.b*0.5))}), and headstone ($1,000–$3,000) typically ranges from ${totalBurial} to ${totalBurialHigh}. These figures vary by provider and the specific choices made. Comparing at least 2–3 funeral homes and cemeteries separately can save significant money.`},
      {q:`Once I add every line item, what does burial actually cost in ${s.name}?`,a:`A complete burial in ${s.name} — funeral service (${$(s.f)}) + plot (${$(s.b)}) + casket (${$(Math.round(s.f*0.3))}) + vault (${$(Math.round(s.b*0.4))}) + opening-and-closing (${$(Math.round(s.b*0.5))}) + headstone ($1,000-$3,000) — totals ${totalBurial} to ${totalBurialHigh} in practice. Comparing two or three funeral homes and two or three cemeteries independently is the single most reliable way to bring that number down.`},
      {q:`What is an all-in burial estimate for ${s.name}?`,a:`Adding every line item, burial in ${s.name} usually totals ${totalBurial} to ${totalBurialHigh}: funeral service about ${$(s.f)}, plot about ${$(s.b)}, casket about ${$(Math.round(s.f*0.3))}, vault about ${$(Math.round(s.b*0.4))}, opening-and-closing about ${$(Math.round(s.b*0.5))}, and headstone $1,000-$3,000. Shopping funeral homes and cemeteries as separate bills is what bends the total number down.`}
    ];
    const q6 = [
      {q:`Is green burial available in ${s.name}?`,a:`Green burial options are available in some areas of ${s.name}. Green burial uses biodegradable containers, no embalming, and often costs less than traditional burial. Not all cemeteries in ${s.name} offer green burial sections, so you may need to research options in your area. Some families also consider hybrid approaches, such as traditional caskets with no embalming. See our green burial guide for more details.`},
      {q:`Can I choose a natural or green burial in ${s.name}?`,a:`Yes — though availability varies by region. A growing number of ${s.name} cemeteries now offer green burial sections (biodegradable container, no embalming, no vault), and the total cost is usually below a traditional burial. If a dedicated green burial ground is not nearby, some families in ${s.name} use a hybrid approach (traditional plot without embalming). Our green burial guide covers the details.`},
      {q:`Does ${s.name} have green burial cemeteries?`,a:`There are green burial options in parts of ${s.name}, though coverage is not statewide. Green burial removes embalming and the vault requirement and uses a biodegradable container, typically coming in below a traditional burial cost. Some ${s.name} cemeteries have hybrid sections rather than fully dedicated grounds. Check our green burial guide and call local ${s.name} cemeteries to confirm what they currently offer.`}
    ];
    return [
      pickVariant(key, q1, 'bq1'),
      pickVariant(key, q2, 'bq2'),
      pickVariant(key, q3, 'bq3'),
      pickVariant(key, q4, 'bq4'),
      pickVariant(key, q5, 'bq5'),
      pickVariant(key, q6, 'bq6')
    ];
  })();

  const content = `${head(title, desc, fn, `Burial Costs in ${s.name}`, faq, {name:'Burial Costs by State',url:'burial-costs-by-state.html'})}
${header()}
  <main id="main-content" class="guide-main" role="main">
    <article class="guide-article">
      <nav class="guide-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> &rsaquo; <a href="burial-costs-by-state.html">Burial Costs by State</a> &rsaquo; <a href="funeral-costs-${s.slug}.html">${s.name}</a> &rsaquo; <span aria-current="page">Burial Costs</span>
      </nav>

      <h1>Burial Costs in ${s.name} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Region:</span> <span class="article-meta-value">${s.region}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `Traditional burial remains a meaningful choice for many ${s.name} families. Understanding the full cost picture — from funeral service fees to cemetery charges, caskets, vaults, and headstones — helps you plan with confidence. This guide breaks down what you can expect to pay for burial in ${s.name} and how to make informed decisions.`,
          `If you are arranging a burial in ${s.name}, the costs can add up faster than most families expect. Between the funeral home bill and the separate cemetery invoice, total burial expenses in ${s.name} typically range from ${$(Math.round(s.f + s.b + s.b*0.9))} to well over ${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))}. This guide lays out what drives each line item and where families have room to save.`,
          `Burial costs in ${s.name} are shaped by three separate bills: the funeral home's service fee (around ${$(s.f)}), the cemetery's plot and interment charges (starting near ${$(s.b)}), and the headstone or marker (typically $1,000–$3,000). Each is negotiable in its own way. This guide walks through each one so you know what you're actually paying for.`,
          `Planning a burial in ${s.name} is more involved than most people realize — there's the funeral home, the cemetery, the casket, the vault, the headstone, and the paperwork, and each comes with its own price list. We've broken down current ${s.name} costs so you can compare providers honestly and avoid the charges that often get bundled quietly into a package.`,
          `Whether ${s.name} burial is a family tradition or simply the right choice for your loved one, knowing the real numbers before you walk into a funeral home matters. Average totals in ${s.name} run from ${$(Math.round(s.f + s.b + s.b*0.9))} to ${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))}, but careful comparison — especially on caskets and cemetery choice — can cut thousands off that bill.`,
          `Burial in ${s.name} is almost never a single transaction. You pay the funeral home, you pay the cemetery, you pay the monument company, and frequently you pay a handful of administrative fees on top. Across those bills, ${s.name} families typically see totals from ${$(Math.round(s.f + s.b + s.b*0.9))} to ${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))} — with the ceiling often set by the casket and the cemetery choice rather than the ceremony itself.`,
          `${s.name} burial costs can surprise families because the funeral home estimate is never the complete bill. Cemetery fees, vault or liner requirements, headstones, opening-and-closing charges, and documentation costs land on separate invoices. This guide puts them all in one place for ${s.name} and flags which line items most often carry room to negotiate.`,
          `For ${s.name} families choosing burial in 2026, the honest pricing conversation starts with three numbers: the ${$(s.f)} funeral service average, the ${$(s.b)} cemetery plot average, and the $1,000-$3,000 headstone range. Add vault, opening-and-closing, and casket and the complete picture runs ${$(Math.round(s.f + s.b + s.b*0.9))} to ${$(Math.round(s.f*1.3 + s.b*2 + s.b*0.9))}. Here is how those numbers get built — and where they can bend lower.`
        ];
        return pickVariant([s.slug, s.abbr, s.region, 'burial'], openings, 'intro');
      })()}</p>

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
        ${regionalBurialSavingsBullets(s)}
      </ul>
      <p>For comprehensive cost-saving strategies, see our <a href="cheap-funeral-options.html">affordable funeral options guide</a> or <a href="funeral-payment-assistance.html">payment assistance programs</a>.</p>

      <h2>Regional Context for Burial in ${s.name}</h2>
      <p>${regionalBurialNote(s)}</p>

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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">FCA</a>, Government Sources</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html">Our Standards</a></span></span>
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
      <p>If you believe your rights have been violated, contact the <a href="https://www.ftc.gov" target="_blank" rel="nofollow noopener">Federal Trade Commission</a>, your state attorney general, or the <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">Funeral Consumers Alliance</a>.</p>

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

      ${resources(['military-funeral-honors.html','infant-child-funeral-costs.html','funeral-costs-uninsured.html','funeral-planning-for-parents.html','body-donation-guide.html','medicaid-funeral-assistance.html','funeral-overcharging-protection.html','consumer-rights-funeral-pricing.html'].includes(p.fn) ? 'sensitive' : 'general')}

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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">FCA</a>, State Boards</span></span>
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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, <a href="https://www.funerals.org" target="_blank" rel="nofollow noopener">FCA</a>, State Boards</span></span>
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
  const title = `${m.city} Cremation Costs 2026: From ${$(mdc)}`;
  const desc = `Cremation in ${m.city}${m.dc ? '' : ', ' + m.st} (2026): direct cremation from ${$(mdc)}, with service ${$(mc)}. Save up to ${savingsVsBurial} vs. burial. Compare providers.`;

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

      <h1>Cremation Costs in ${m.dc ? 'Washington, DC' : `${m.city}, ${m.st}`} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">${m.dc ? 'Area' : 'State'}:</span> <span class="article-meta-value">${m.dc ? 'Washington, DC Metro' : `<a href="cremation-costs-${s.slug}.html">${m.st}</a>`}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Cremation Rate:</span> <span class="article-meta-value">${s.cr}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `If you are considering cremation in the ${m.city} area, this guide provides current pricing to help you plan. Cremation costs in ${m.city} tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average due to the local cost of living.`,
          `${m.city} cremation prices split sharply by service level: ${$(mdc)} for direct cremation at the low end, ${$(mc)} for a full service at the high end, with about ${savingsVsBurial} separating cremation from traditional burial. ${m.st}'s statewide cremation rate of ${s.cr} reflects how common this choice has become.`,
          `Families looking at cremation in ${m.city} typically want to know two things: how much it actually costs, and what that price includes. Direct cremation in ${m.city} averages ${$(mdc)} and covers transportation, the cremation itself, and return of remains — no ceremony, no viewing, no embalming. A full service before cremation runs closer to ${$(mc)}.`,
          `Cremation has become the default choice in much of ${m.st} — the state cremation rate now sits at ${s.cr}. In ${m.city} specifically, direct cremation from ${$(mdc)} is the floor, while a cremation service with viewing and ceremony runs about ${$(mc)}. This guide walks through both tiers and the regulations that apply to ${m.city} families.`,
          `Cremation pricing in ${m.city} follows a pattern visible across ${m.st}: a wide and growing gap between the simplest option (direct cremation near ${$(mdc)}) and the full-service alternative (near ${$(mc)}). Because ${s.cr} of ${m.st} families already choose cremation, the market here is competitive enough that the two tiers are usually well-defined on any provider's General Price List.`,
          `The honest question most ${m.city} families arrive with is not whether to choose cremation but which version of it. Direct cremation at ${$(mdc)} is the cheapest path; cremation with a funeral service at ${$(mc)} is closer to a traditional experience. The roughly ${savingsVsBurial} gap between cremation and traditional burial is what has made ${m.st}'s ${s.cr} cremation rate what it is today.`,
          `${m.city}-area cremation costs in 2026 reflect both the national trend toward simpler dispositions and ${m.st}'s cost-of-living profile. Direct cremation lands near ${$(mdc)}, cremation with service near ${$(mc)}, and the price that appears on your contract depends heavily on which optional service items you decline. This guide walks through each line item.`,
          `Choosing cremation in ${m.city} can mean spending ${$(mdc)} — or ${$(mc)} — on essentially the same disposition, with the difference accounted for almost entirely by optional service features. Understanding that distinction is how families save the most money. ${m.st}'s ${s.cr} cremation rate means you'll find plenty of local providers competing on both ends of that range.`
        ];
        return pickVariant([m.slug, m.ss, s.region, 'crem-metro'], openings, 'cmintro');
      })()}</p>

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
        ${regionalCremationSavingsBullets(s)}
      </ul>

      <h2>Regional Context: Cremation in ${m.city} and the ${s.region}</h2>
      <p>${regionalCremationNote(s)}</p>

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
  const title = `${m.city} Burial Costs 2026: Total ${totalBurial}+`;
  const desc = `Burial in ${m.city}${m.dc ? '' : ', ' + m.st} (2026): funeral service ${$(mf)}, plot from ${$(mb)}, total ${totalBurial}–${totalBurialHigh}. Compare cemeteries and save.`;

  const stateMetros = metros.filter(x => x.ss === m.ss && x.slug !== m.slug);
  const nearbyComparison = stateMetros.slice(0, 3);

  const faq = [
    {q:`How much does burial cost in ${m.city}?`,a:`A traditional burial in ${m.city} costs approximately ${$(mf)} for the funeral service plus ${$(mb)} for a cemetery plot. Including vault (${$(Math.round(mb * 0.4))}), opening/closing fees (${$(Math.round(mb * 0.5))}), casket (${$(Math.round(mf * 0.3))}), and headstone ($1,500-$3,000), the total ranges from ${totalBurial} to ${totalBurialHigh}.`},
    {q:`Is a burial vault required in ${m.city}?`,a:`Burial vaults are required by most cemeteries in the ${m.city} area as a matter of cemetery policy to prevent ground settling. They are rarely required by ${m.st} state law. A grave liner — a less expensive alternative — may meet the cemetery's requirements. Always ask your specific cemetery about their vault policy and whether cheaper alternatives are accepted.`},
    {q:`What are the cheapest burial options in ${m.city}?`,a:`The most affordable burial options in ${m.city} include: direct burial (no viewing or ceremony), which can save thousands on embalming and facility fees; green burial using a biodegradable container and no embalming; and purchasing a casket from an independent retailer to save 50-70%. In the ${s.region}, ${({
  'South': `church and family cemeteries in the ${m.city} area are often priced well below commercial memorial parks`,
  'Northeast': `denominational and municipal cemeteries in the ${m.city} area typically undercut private memorial parks by $1,000 or more`,
  'Midwest': `township and county cemeteries in the ${m.city} area frequently price plots below commercial memorial parks — call the county clerk`,
  'West': `hybrid or natural burial sections in ${m.city}-area cemeteries often price 30-50% below traditional plots`,
  'Mountain': `rural cemeteries outside the ${m.city} metro often price far below ${m.city}-area private cemeteries — check with the county clerk`
})[s.region] || `nonprofit and municipal cemeteries in the ${m.city} area tend to have lower plot costs than private ones`}.`},
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

      <h1>Burial Costs in ${m.dc ? 'Washington, DC' : `${m.city}, ${m.st}`} (2026)</h1>
      <div class="article-meta">
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">${m.dc ? 'Area' : 'State'}:</span> <span class="article-meta-value">${m.dc ? 'Washington, DC Metro' : `<a href="burial-costs-${s.slug}.html">${m.st}</a>`}</span></span>
      </div>

      <p class="guide-intro">${(function(){
        const openings = [
          `Understanding the full cost of burial in ${m.city} — from funeral service fees to cemetery charges — helps families plan with confidence. Burial costs in the ${m.city} metropolitan area tend to be ${m.mp > 1.15 ? 'higher than' : 'close to'} the ${m.st} state average.`,
          `Burial in ${m.city} involves two separate bills that rarely get discussed together: the funeral home's service fee (around ${$(mf)}) and the cemetery's plot plus interment charges (starting near ${$(mb)}). Together with casket, vault, and headstone, families here typically spend between ${totalBurial} and ${totalBurialHigh}.`,
          `${m.city} cemetery prices and funeral home prices move somewhat independently — it is not unusual to find a reasonable cemetery plot paired with an expensive funeral home, or the reverse. This guide lays out both sides so you can see exactly where ${m.city} burial costs come from and where there is room to negotiate.`,
          `If you are planning a burial in ${m.city}, the total runs well beyond the headline ${$(mf)} funeral service quote. Cemetery plot (${$(mb)}), vault, opening and closing fees, casket, and headstone all stack on top. Totals in ${m.city} typically reach ${totalBurial} to ${totalBurialHigh} depending on choices.`,
          `Most ${m.city} families underestimate burial costs because the funeral home quote is only one of several bills. Cemetery invoices, monument company invoices, and administrative fees are separate. Across all of them, ${m.city} burial totals generally land between ${totalBurial} and ${totalBurialHigh}, with casket and cemetery choice driving most of the variation.`,
          `${m.city}'s burial market reflects the ${m.st} cost-of-living multiplier layered on national averages. A full traditional burial here — funeral service, cemetery plot, vault, casket, headstone — commonly runs ${totalBurial} to ${totalBurialHigh}. The funeral home portion (${$(mf)}) and cemetery portion (${$(mb)} for the plot alone) are the two largest line items.`,
          `Families arranging a burial in ${m.city} in 2026 are often surprised by how much of the total sits outside the funeral home contract. Cemetery charges, vault requirements, and headstone pricing are negotiated separately, on separate schedules. ${m.city} totals typically fall between ${totalBurial} and ${totalBurialHigh} depending on the choices made across each of those conversations.`,
          `Burial costs in ${m.city} are a sum, not a single number. Add the funeral home service (~${$(mf)}), the cemetery (plot near ${$(mb)} plus opening-and-closing), the casket, the vault, and the headstone. The realistic range in ${m.city} runs ${totalBurial} to ${totalBurialHigh}, and most of the difference between the two ends lives in casket and cemetery choice.`
        ];
        return pickVariant([m.slug, m.ss, s.region, 'burial-metro'], openings, 'bmintro');
      })()}</p>

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
        ${regionalBurialSavingsBullets(s)}
      </ul>

      <h2>Regional Context: Burial in ${m.city} and the ${s.region}</h2>
      <p>${regionalBurialNote(s)}</p>

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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, Insurance Industry Data, Government Sources</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html">Our Standards</a></span></span>
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
        <span class="article-meta-item"><span class="article-meta-label">By:</span> <span class="article-meta-value"><a href="about.html">Paul Paradis</a>, Editor</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Updated:</span> <span class="article-meta-value">${REVIEW_MONTH}</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Sources:</span> <span class="article-meta-value"><a href="https://nfda.org" target="_blank" rel="nofollow noopener">NFDA</a>, Religious Organizations, Consumer Surveys</span></span>
        <span class="article-meta-item"><span class="article-meta-label">Editorial:</span> <span class="article-meta-value"><a href="editorial-standards.html">Our Standards</a></span></span>
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

      ${resources('sensitive')}

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

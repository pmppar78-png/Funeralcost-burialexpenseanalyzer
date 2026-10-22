/**
 * Added sections for the short guides named in the 2026-10-22 audit.
 * Inserted by scripts/apply-audit.js. Existing page copy is left in place.
 * Figures are the NFDA 2023 GPL medians (latest national study; NFDA's
 * statistics page still cited them as of its September 29, 2025 update),
 * the FTC Funeral Rule, SSA, IRS, or a statute named in the paragraph.
 */
const NFDA = 'https://content.nfda.org/news/media-center/nfda-news-releases/id/8134/2023-nfda-general-price-list-study-shows-inflation-increasing-faster-than-the-cost-of-a-funeral';
const FTC = 'https://www.ftc.gov/legal-library/browse/rules/funeral-industry-practices-rule';
const SSA = 'https://www.ssa.gov/forms/ssa-8.html';

function src(label) {
  return `<p class="source-note"><strong>Sources for this section, checked October 22, 2026:</strong> ${label} Educational only, and the forms, fees, and eligibility named in those sources should be confirmed with the agency or a licensed professional before anyone relies on this section.</p>`;
}

const expansions = {
  'estate-planning-costs.html': `
<h2 id="weekend-plan">A weekend plan that does not require a fee quote we cannot source</h2>
<p>The estate-planning cost guide already explains why most families will not owe federal estate tax in 2026, and it declines to invent a national attorney fee. This section is the practical sequence that sits next to that caution. Do it while everyone can still sign. None of these steps asks you to prepay a funeral.</p>
<h3>Saturday morning: the one-page inventory</h3>
<p>Write down every account that already has a beneficiary or a payable-on-death name: life insurance, IRAs, 401(k)s, and bank accounts. Those forms pass the money by contract. A later will does not rewrite them. If the form still names a former spouse or a parent who has died, fix the form at the institution, not in a letter kept at home. This is the highest-value hour in the estate-planning cost guide because it is free and it prevents the most common surprise.</p>
<h3>Saturday afternoon: the four signatures</h3>
<p>Most families need four documents, not a trust. A will names an executor and, if you have minor children, a guardian. A durable power of attorney names someone to handle money if you cannot. A health care proxy names someone to talk to doctors. An advance directive records treatment wishes. State forms for the health care papers are often free from the state health department or the bar. The <a href="https://www.americanbar.org/groups/legal_services/flh-home/" target="_blank" rel="noopener">American Bar Association's Find Legal Help</a> page is the directory we use when someone asks where to start looking for a lawyer. Ask any lawyer for a flat fee for a defined package, in writing, before you compare. We still do not publish a national "average will price," because we do not have a survey that would support one.</p>
<h3>Sunday: funeral wishes, separate from the will</h3>
<p>Put burial or cremation wishes in a short letter your family can find, and tell them the letter exists. A will is often not read until after the funeral. For a funding target, use the medians from the <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 General Price List Study</a> (latest available): $8,300 for a funeral with viewing and burial, vault not included, and $6,280 for a funeral with viewing and cremation. Direct cremation medians in that same study, as reprinted in NFDA's 2024 Cremation and Burial Report, are $2,645 when the family supplies the container and $2,750 when the funeral home does. Those are national medians from member price lists surveyed in 2023, not a quote in your county.</p>
<p>If you want the money set aside without buying insurance, a payable-on-death savings account does that job. The person you name files a death certificate with the bank. That is not a funeral policy, and it does not lapse the way a policy can. Our <a href="funeral-insurance-guide.html">funeral insurance guide</a> explains policies. This estate-planning cost page is only about the documents and the account.</p>
<h3>What the Funeral Rule changes about prepaying</h3>
<p>The <a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a> (16 CFR Part 453) requires itemized prices and lets the family decline items they do not want. It applies when a funeral provider sells arrangements, including many preneed sales. It does not make a prepaid contract a good idea. Read the cancellation, trust, and transfer terms before you pay. Our <a href="prepaid-funeral-plans.html">prepaid funeral plan guide</a> is the place for that comparison. State trust rules differ; the state funeral board named in our <a href="state-funeral-regulations.html">regulations directory</a> is the agency that usually writes them.</p>
<h3>A note on state estate and inheritance taxes</h3>
<p>The federal basic exclusion for deaths in 2026 is $15 million per person, and the annual gift exclusion is $19,000, per the <a href="https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax" target="_blank" rel="noopener">IRS estate and gift tax page</a>. A minority of states impose their own estate or inheritance tax at much lower amounts. The list of those states changes. Check the revenue department where you live rather than relying on a blog list, including this one.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA, December 8, 2023 GPL study release</a>; <a href="https://www.irs.gov/businesses/small-businesses-self-employed/whats-new-estate-and-gift-tax" target="_blank" rel="noopener">IRS estate and gift tax</a>; <a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a>.`)}
`,

  'probate-process-costs.html': `
<h2 id="probate-specifics">What probate actually bills, with one state's statute as the example</h2>
<p>Probate is the court process that retitles property that did not already pass by beneficiary form, joint ownership, or a trust. The probate cost guide is not a national fee schedule. States do this differently, and several do not use a percentage at all. Where we cite a number below, it is California's statute, not a U.S. average.</p>
<h3>California's published schedule, and only California's</h3>
<p>California Probate Code section 10810 sets ordinary attorney fees, and section 10800 sets the personal representative's ordinary commission, on the value of the estate accounted for. Both use the same steps: 4 percent of the first $100,000, 3 percent of the next $100,000, 2 percent of the next $800,000, 1 percent of the next $9 million, and one-half of 1 percent of the next $15 million. Above $25 million the court sets a reasonable amount. Extraordinary work, such as a lawsuit or a real-estate sale, can be awarded on top. The text is on the <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PROB&sectionNum=10810" target="_blank" rel="noopener">California Legislative Information site</a>. If the person did not live in California, do not use this table. Ask that state's court or a lawyer there.</p>
<h3>The steps, in the order families meet them</h3>
<ol>
<li>File the death certificate and, if there is a will, lodge it with the court in the county where the person lived.</li>
<li>The court appoints a personal representative. Until then, banks will often freeze solely owned accounts.</li>
<li>Publish notice to creditors and wait out the creditor period that state's code requires. The length is not the same everywhere.</li>
<li>Inventory the assets. Anything with a beneficiary form usually stays out of this list.</li>
<li>Pay allowed claims. Reasonable funeral bills are often a priority claim, but the dollar cap and the paperwork differ by state. Ask the clerk before you assume the estate must pay a particular invoice in full.</li>
<li>Account to the court and distribute what remains.</li>
</ol>
<p>A small-estate affidavit can skip much of this when the probate estate is under the state's dollar limit. That limit is statutory and it changes. Look it up for the state of residence. Do not use a limit you remember from another state.</p>
<h3>How funeral medians fit the probate bill</h3>
<p>The funeral invoice is often the first large bill. For a planning number before you have a General Price List, the <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 study</a> (latest available) reports a median of $8,300 for a viewing and burial, not including the vault or cemetery, and $6,280 for a viewing and cremation. Immediate burial medians in that study are $2,995 if the family supplies the container and $3,720 if the funeral home does. Social Security's one-time death payment is $255 to an eligible spouse or eligible child, claimed on <a href="${SSA}" target="_blank" rel="noopener">Form SSA-8</a>. It will not pay the funeral. Our <a href="how-to-pay-for-a-funeral-with-no-money.html">zero-budget guide</a> covers what to do when the estate has no cash yet, which is a different problem from the probate fee itself.</p>
<h3>Ways families shorten probate without a gimmick</h3>
<p>Beneficiary designations, joint title with right of survivorship, and payable-on-death accounts never enter the probate estate. A living trust can do the same for assets you actually retitle into it. A trust that was signed but never funded does nothing. Those tools have their own costs and their own failure modes, which is why the <a href="estate-planning-costs.html">estate-planning cost guide</a> treats a trust as optional. Probate avoidance is not the same thing as tax avoidance. The federal estate tax exclusion is an IRS figure, discussed on that page, and it is unrelated to the court fee.</p>
${src(`<a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PROB&sectionNum=10810" target="_blank" rel="noopener">California Probate Code § 10810</a>; <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 GPL release</a>; <a href="${SSA}" target="_blank" rel="noopener">SSA Form SSA-8</a>.`)}
`,

  'funeral-price-comparison.html': `
<h2 id="gpl-line-items">Use the NFDA median lines as a checklist, not as a quote</h2>
<p>Comparing funeral prices is a paperwork job. The FTC already requires the paperwork. This price-comparison guide walks through a phone call using the national median lines from the NFDA 2023 General Price List Study so you know which rows to ask for. The medians are not what your funeral home must charge.</p>
<h3>What the 2023 study actually measured</h3>
<p>NFDA mailed and emailed its member funeral homes in July 2023 and published the results on December 8, 2023. The medians below are from that release and from the same study as reprinted in the 2024 NFDA Cremation and Burial Report. NFDA has not published a newer national GPL study; its statistics page still cited these 2023 figures as of September 29, 2025. That is why this site labels them latest available.</p>
<table class="cost-table"><caption>NFDA 2023 national medians to look for on a GPL</caption><thead><tr><th>GPL line</th><th>2023 median</th></tr></thead><tbody>
<tr><td>Non-declinable basic services fee</td><td>$2,495</td></tr>
<tr><td>Removal or transfer of remains</td><td>$395</td></tr>
<tr><td>Embalming</td><td>$845</td></tr>
<tr><td>Other preparation of the body</td><td>$295</td></tr>
<tr><td>Use of facilities and staff for viewing</td><td>$475</td></tr>
<tr><td>Use of facilities and staff for a ceremony</td><td>$550</td></tr>
<tr><td>Funeral with viewing and burial, metal casket, no vault</td><td>$8,300</td></tr>
<tr><td>Funeral with viewing and cremation</td><td>$6,280</td></tr>
<tr><td>Direct cremation, container from the family</td><td>$2,645</td></tr>
<tr><td>Direct cremation, container from the funeral home</td><td>$2,750</td></tr>
<tr><td>Metal burial casket (median on the GPL)</td><td>$2,500</td></tr>
<tr><td>Alternative cremation container</td><td>$160</td></tr>
</tbody></table>
<p>Source: <a href="${NFDA}" target="_blank" rel="noopener">NFDA, December 8, 2023</a>, and the 2024 NFDA Cremation and Burial Report's reprint of the 2023 GPL table. Half of the surveyed homes charged less than the median and half charged more. Cemetery plots, vaults, flowers, and obituaries were not in the $8,300 figure.</p>
<h3>The phone script</h3>
<ol>
<li>Ask for the General Price List. Under 16 CFR § 453.2, a funeral provider must tell you prices over the telephone. You do not have to give your name.</li>
<li>Ask for direct cremation with the container the funeral home supplies, and again with a container you supply. Write down both.</li>
<li>Ask for the basic services fee, the transfer fee, and the embalming fee as separate numbers. The basic services fee is the one line you generally cannot decline if you use that firm for any arrangement.</li>
<li>Ask for the casket price list. The median metal casket in the 2023 study was $2,500. An outside casket must be accepted with no handling fee (16 CFR § 453.4). We do not cite a percentage discount for online caskets, because NFDA did not survey retailers.</li>
<li>Call two more homes the same day and use the same wording. Our <a href="funeral-cost-comparison-worksheet.html">worksheet</a> is the form for that. We do not claim the worksheet saves a set dollar amount. Homes in one city often differ; that is the reason to call, not a guaranteed refund.</li>
</ol>
<h3>Package prices hide the comparison</h3>
<p>A "traditional package" adds the lines above to a casket and sometimes to items you can decline, such as embalming, a visitation, printed cards, and a limousine. Ask the director to point to each package item on the General Price List. If a line is not legally required, you can remove it. Embalming is not required by the Funeral Rule, and no state requires it in every case. Refrigeration is the usual alternative when there will be no viewing.</p>
<p>When you have three lists, circle the basic services fee first. That single number explains more of the gap between homes than the casket does. Then compare direct cremation, because it is the cleanest like-for-like row. Only then compare caskets, and only of the same material.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 GPL release</a>; <a href="${FTC}" target="_blank" rel="noopener">16 CFR Part 453</a>.`)}
`,

  'headstone-monument-costs.html': `
<h2 id="marker-facts">Headstones: what sets the price, without a fake national median</h2>
<p>This headstone and monument guide does not publish a U.S. median price. The NFDA 2023 GPL study excluded monuments and cemetery charges from its $8,300 funeral median on purpose. Cemeteries are also outside most of the FTC Funeral Rule, which binds funeral providers. The useful facts are about materials, who is allowed to set the stone, and the one marker program that does publish a price of zero.</p>
<h3>Materials you will actually be offered</h3>
<p>Granite is the common upright stone because it holds a polish and a carved letter outdoors. Bronze is usually a plaque on a granite base, set flush or on a slant. Marble is softer and shows weather sooner, which is why many cemeteries no longer allow it. A flat grass marker sits flush with the lawn and can be mowed over. An upright monument needs a foundation, and the cemetery, not the dealer, usually pours that foundation and charges a setting fee. Ask for those three numbers separately: the stone, the foundation, and the setting fee. A package quote that blends them cannot be compared.</p>
<h3>The cemetery's rule is the binding one</h3>
<p>Cemeteries publish a list of allowed sizes, colors, and whether an outside dealer may deliver the stone. Some charge an inspection fee when the stone comes from elsewhere. That is not the funeral home's casket rule. The Funeral Rule's ban on casket-handling fees does not automatically give you the same right at the cemetery gate. Get the cemetery's marker rules in writing before you pay a dealer. If the cemetery requires its own bronze, an online granite price is irrelevant.</p>
<h3>Timing</h3>
<p>A stone is rarely ready for the funeral. Carving and shipping often take months. Jewish tradition delays the unveiling until months after burial, which happens to match how long a stone takes. Other families simply wait. You can bury first and order the marker when you can compare two dealers without a salesperson in the room. Put the cemetery's size limit on the order so you do not buy a monument the cemetery will reject.</p>
<h3>The VA marker</h3>
<p>Eligible veterans can receive a government headstone, marker, or medallion at no charge. The family still pays the cemetery's setting fee in a private cemetery. National cemeteries set the government marker without that private fee. The application and the eligibility rules are on our <a href="veteran-burial-benefits.html">veteran burial benefits guide</a>, which tracks the VA's own pages. Do not buy a retail stone until you know whether the VA will provide one.</p>
<h3>Questions for the dealer and the cemetery</h3>
<ol>
<li>What is the cemetery's maximum size, and is a flat marker required in this section?</li>
<li>What is the setting fee, and who pours the foundation?</li>
<li>May an outside dealer deliver, and is there an inspection fee?</li>
<li>Does the quoted price include the vase, the portrait, and the second inscription later?</li>
<li>How long from approval of the proof to installation?</li>
</ol>
<p>Lettering mistakes are common and expensive to recut. Approve a written proof of the name and the dates before anyone cuts. That step costs nothing and it belongs on this headstone page because it saves more money than hunting for a national average we do not have.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 release</a> (monuments excluded from the median); <a href="veteran-burial-benefits.html">VA marker rules as summarized in our veteran guide</a>; <a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a> (funeral providers, not cemeteries).`)}
`,

  'funeral-flowers-guide.html': `
<h2 id="flower-practice">Funeral flowers: who sends what, and how not to get billed twice</h2>
<p>This funeral flower guide is about etiquette and the order form, not a national price survey. Florists do not file a General Price List with anyone, and the NFDA 2023 study did not price flowers. Ask two shops for the same arrangement, in writing, the way you would ask a funeral home for a GPL.</p>
<h3>The pieces, and who traditionally sends them</h3>
<p>The casket spray is the large arrangement on the casket. Immediate family usually orders it, because it is the one piece that has to match the service and because the funeral home will often place a spray automatically if nobody says otherwise. Standing sprays and wreaths are what friends, coworkers, and congregations send. They stand on easels beside the casket. Baskets and vases are easier to carry to the family's house afterward. A lid insert or a single rose is a small piece for a child or for a family that asked for restraint.</p>
<p>If the obituary says "in lieu of flowers," send the donation, not a spray. A standing piece that arrives anyway can embarrass the family and still costs the sender. When the family has not said, a modest basket from friends and a spray from the household is the usual split. Red roses are not required. White and the family's own preference are both fine. Religious services sometimes limit flowers at the altar. Ask the church or mosque before you order a piece that cannot be placed.</p>
<h3>How to order without the markup you cannot see</h3>
<ol>
<li>Call the funeral home and ask whether a casket spray is already on the contract. If it is, do not let a relative order a second one.</li>
<li>Ask the funeral home which local shops already deliver there, and then call one shop that is not on that list. You want two prices for the same description: "standing spray, about three feet, delivered by 10 a.m."</li>
<li>Put the deceased's full name, the funeral home, the service time, and a short card message in the order. Flowers without a name get set aside.</li>
<li>Ask what happens to the flowers after the service. Family often wants the baskets. Sprays are harder to reuse. Some families ask the shop to skip the most perishable blooms if the service is two days away.</li>
<li>Pay the shop, not a vague "flower charge" added to the funeral contract, unless you have seen the shop's receipt.</li>
</ol>
<h3>Lower-cost choices that are still considerate</h3>
<p>A single family spray plus a donation in place of other flowers is a complete choice. A potted plant costs less than a cut arrangement and can go home. Grocery-store bunches, arranged in a basket you already own, are appropriate from close friends when the family has said to keep it simple. None of these is a slight if the obituary invited simplicity.</p>
<p>For a child or an infant, ask the family before you send anything bright or large. Our <a href="infant-child-funeral-costs.html">infant and child funeral guide</a> is the page for that situation. The flower order is not the place to guess.</p>
${src(`No national flower-price survey is cited. <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 GPL study</a> did not include flowers. Delivery steps are practical instructions, not a price quote.`)}
`,

  'crowdfunding-funeral-costs.html': `
<h2 id="campaign-detail">How a funeral fundraiser actually works</h2>
<p>Crowdfunding for a funeral is a public request for gifts. It is not an assistance program, it is not taxed by a rule we can state for every campaign, and it is not a reason to skip the General Price List. This page is the how-to. The <a href="how-to-pay-for-a-funeral-with-no-money.html">zero-budget guide</a> is what to do if the campaign fails, and the <a href="funeral-payment-assistance.html">payment-assistance guide</a> is the government and charity list.</p>
<h3>Fees: read the live page, do not trust a remembered percentage</h3>
<p>GoFundMe publishes its current pricing at <a href="https://www.gofundme.com/c/pricing" target="_blank" rel="noopener">gofundme.com/c/pricing</a>. The company has changed that schedule before. Open the page the day you launch and write down the platform fee and the payment-processing fee it shows that day. Other sites, including Facebook fundraisers, publish their own schedules. A percentage copied from an old article is how families overstate what they will net. If the platform lets donors add a tip, that tip is not part of your total.</p>
<h3>Write the appeal so strangers can act</h3>
<ol>
<li>Name the person, the city, and the relationship of the organizer in the first two lines. Anonymous campaigns read as scams.</li>
<li>Say what the money is for in plain language: direct cremation, a burial plot, travel for relatives. You do not have to post the full invoice.</li>
<li>Give one number you can support. A sound anchor is a written quote, or the NFDA 2023 median you are using only as context ($8,300 for a viewing and burial, or $2,645 for direct cremation with the family's container). Label the median as a national median, not as your bill.</li>
<li>Name who withdraws the money and into which account. Fights inside the family start here.</li>
<li>Post one photo the person would have accepted. Do not post the death certificate or a hospital scene.</li>
</ol>
<h3>Who actually shares it</h3>
<p>The first day depends on people who already know the family: a workplace, a congregation, a team. Ask three people by name to share it, and ask them the same day. A link dropped into a group chat with no request dies. Update the page when you have a figure for what has arrived, and close it when the bill is paid. Leaving a completed campaign open invites skepticism.</p>
<h3>If the money comes up short, or comes up as a tax question</h3>
<p>A campaign can stall at a few hundred dollars. Have the next step ready: direct cremation from a second funeral home's price list, a county indigent program, or the Social Security $255 payment if a spouse or eligible child can file <a href="${SSA}" target="_blank" rel="noopener">Form SSA-8</a>. Whether the gifts are taxable income depends on facts we will not generalize. The IRS discusses gifts in <a href="https://www.irs.gov/publications/p525" target="_blank" rel="noopener">Publication 525</a> and related pages. Ask a tax preparer if the campaign is large or if a stranger organized it and kept control of the account.</p>
<p>Do not sign a funeral contract for a package you cannot cancel while you wait on donations. Ask the home what is due today to proceed with a direct cremation, and what can wait. The <a href="${FTC}" target="_blank" rel="noopener">Funeral Rule</a> still lets you buy only the items you choose.</p>
${src(`<a href="https://www.gofundme.com/c/pricing" target="_blank" rel="noopener">GoFundMe pricing page</a> (read live; not copied here as a percentage); <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 medians</a>; <a href="${SSA}" target="_blank" rel="noopener">SSA-8</a>; <a href="https://www.irs.gov/publications/p525" target="_blank" rel="noopener">IRS Publication 525</a>.`)}
`,

  'infant-child-funeral-costs.html': `
<h2 id="infant-detail">Decisions that can wait, and the ones that should be in writing</h2>
<p>If you are reading the infant and child funeral guide after a death, you do not need a long article. The paragraphs above already point you to the Funeral Rule, the hospital, and the TEARS Foundation. What follows is the detail families ask for once the first call is over. None of it is a claim that a certain percentage of funeral homes waive fees. Some homes reduce or waive their professional charge for an infant. We do not have a national count of how many. Ask, and ask for the answer on the price list.</p>
<h3>Papers that are easy to forget</h3>
<p>A hospital usually starts the fetal death report or the death certificate, depending on the length of the pregnancy and the state's form. The threshold for which form is used is state law, not a single U.S. rule. The funeral director often files it, but you can ask the hospital clerk who has the form today. You will need certified copies later for insurance that actually covered the child, and sometimes for leave from work. Order a few copies from the vital-records office. The fee is a state fee, printed on that office's site, not a funeral charge.</p>
<p>Social Security's $255 lump-sum death payment is for a surviving spouse or for a child who was already receiving benefits on the worker's record. It is not a general infant-funeral benefit. If someone tells you Social Security "pays for the baby," ask them to show the SSA page. The form, when a survivor is eligible, is <a href="${SSA}" target="_blank" rel="noopener">SSA-8</a>.</p>
<h3>What to ask the funeral home, in one conversation</h3>
<ol>
<li>If we choose direct cremation, what is the total, and is an alternative container included? The Funeral Rule requires an alternative container to be available. You do not have to buy a casket.</li>
<li>If we want a tiny casket or an urn we already have, will you accept it with no handling fee? The Rule says yes.</li>
<li>Is any infant fee reduction already on the General Price List, or is it a courtesy you are offering today? If it is a courtesy, ask them to write it on the statement.</li>
<li>May we have a short visitation in a room that is not the main chapel, and what is that room's fee if we want it?</li>
<li>What is due today, and what can a relative pay tomorrow?</li>
</ol>
<h3>People who will make the calls for you</h3>
<p>Hand a friend the five questions and the funeral home's phone number. You do not have to be the person who hears the prices. Hospital social workers and chaplains already know which local homes will talk about an infant without a sales pitch. The TEARS Foundation's application page, linked above, is the charity we name because it publishes an application rather than a vague promise. Faith communities and our <a href="funeral-payment-assistance.html">payment-assistance guide</a> are the other doors. A fundraiser is optional; it is described on the <a href="crowdfunding-funeral-costs.html">crowdfunding page</a>, and it is not required to have a dignified goodbye.</p>
<h3>Keepsakes and photos</h3>
<p>Hospitals often offer photographs, footprints, or a lock of hair through their own bereavement program. You can say no. You can also say yes later if they will store them. Independent remembrance-photography charities exist in many cities. The hospital social worker is the person who knows which one actually returns calls locally. We do not rank them.</p>
<p>There is no NFDA median for an infant funeral. The adult medians ($8,300 and $6,280 in the 2023 study) are the wrong comparison, and we will not print them here as if they were a child's bill. Your number is the one on the statement in front of you.</p>
${src(`<a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a>; <a href="${SSA}" target="_blank" rel="noopener">SSA lump-sum death payment</a>; <a href="https://thetearsfoundation.org/apply/" target="_blank" rel="noopener">TEARS Foundation application</a>. No national fee-waiver rate is cited.`)}
`,

  'pet-cremation-costs.html': `
<h2 id="pet-walkthrough">A pet-cremation walkthrough that stays inside what we can source</h2>
<p>The pet cremation guide above already separates communal, private, and partitioned cremation, and it cites the AVMA on tracking and on home burial after barbiturate euthanasia. This section is the rest of the errand: who regulates it, what to get in writing, and why this page still refuses to print a national price.</p>
<h3>Who actually regulates this</h3>
<p>State funeral boards license people who care for human remains. They usually do not license a veterinary clinic's crematory. The regulator you are more likely to need is the state's veterinary board, if the clinic misled you, or the county if you want to bury a pet at home. The AVMA carcass-disposal page linked above is the professional-association guidance we rely on for the wildlife risk. Local ordinances decide the rest. Call the city clerk or animal control and ask two questions: is home burial allowed at this address, and is there a depth or setback rule. Write down the name of the person who answers.</p>
<h3>Private, partitioned, communal: make them define the noun</h3>
<p>"Individual" is the word that causes the fights. On this page, private means the chamber holds one animal and the ashes you receive are from that cremation. Partitioned means more than one animal is in the chamber with a divider, and the provider should tell you whether the ashes are exclusively your pet's. Communal means the ashes are not returned. Ask the clinic to circle one of those three on the estimate. If they will not, call an independent crematory and ask the same question. You are allowed to use a crematory the clinic does not own. The clinic may charge a transfer fee. That fee is legitimate to ask about, and it belongs on the estimate before you agree.</p>
<h3>What a useful estimate includes</h3>
<ul>
<li>The pet's weight bracket, because price follows weight more than it follows the city's human funeral prices.</li>
<li>Pickup, or a statement that you will bring the pet in.</li>
<li>The container used in the chamber, and the urn or box used to return ashes, as separate lines.</li>
<li>A paw print, a lock of fur, or a viewing, only if you asked for them. Declining them is normal.</li>
<li>The day you can expect the ashes, and what happens if identification is lost. A written ID method, tag or log, is the item the AVMA tells veterinarians to be ready to explain.</li>
</ul>
<p>Aquamation, or alkaline hydrolysis, is offered in some cities for pets and is not offered in others. It is a different machine, not a different kind of love. Ask whether your city allows it and whether the remains are returned. Do not assume a human-funeral green-burial law covers a pet.</p>
<h3>Home burial, one more time, because the mistake is serious</h3>
<p>The AVMA's warning is specific: animals euthanized with pentobarbital can poison scavengers. Deep, intact burial or cremation is the mitigation they describe. A shallow grave in a yard that floods is the scenario to avoid. If your ordinance forbids home burial, a pet cemetery will have its own rules and its own price list. Ask whether the plot is yours or a lease, and whether you may bring a marker from outside. Those are the same questions a human cemetery should answer, and they are not answered by the FTC Funeral Rule, which does not apply to pets.</p>
<p>We still do not print a dollar range. Any number on an old blog is someone else's invoice. Two written estimates for the same weight and the same definition of "private" are the only comparison that holds up.</p>
${src(`<a href="https://www.avma.org/news/veterinarians-role-pet-after-death-care" target="_blank" rel="noopener">AVMA after-death care</a>; <a href="https://www.avma.org/resources-tools/one-health/waste-disposal-veterinary-practices/animal-carcass-disposal" target="_blank" rel="noopener">AVMA carcass disposal</a>.`)}
`,

  'body-donation-guide.html': `
<h2 id="donation-detail">Whole-body donation: the sequence, the refusals, and the bill that remains</h2>
<p>Whole-body donation is a gift to a medical school or a state anatomical program under the anatomical-gift law your state adopted. It is not a no-cost funeral with a viewing, and it is not guaranteed. This body-donation guide spells out the sequence so a family is not surprised on the day.</p>
<h3>The legal frame, without pretending every state uses the same form</h3>
<p>Most states have enacted a version of the Revised Uniform Anatomical Gift Act of 2006. The Act lets an adult donate their body, and it sets an order of who may make the gift if the person did not. Your state's health or anatomical board publishes the actual form. Sign that form, not a generic card from a website, and tell two relatives where the copy is. A donation written only in a will may be found too late. The funeral often happens before anyone reads the will.</p>
<h3>What the program usually pays, and what it does not</h3>
<p>University programs commonly pay to transport a body that dies inside their service area, and they commonly cremate the remains after study and return them, or bury them, according to the program's own page. Study can take months or longer than a year. A memorial service, an obituary, a gathering, and transportation from outside the service area are the family's costs. If you want a viewing first, say so before you register. Many programs cannot accept a body that has already been embalmed for a traditional viewing. That single fact changes the plan, and it belongs in the registration packet.</p>
<h3>Why programs say no</h3>
<p>Programs publish medical limits: some infectious diseases, a recent autopsy, major trauma, or a body the program cannot use for teaching. We will not invent an acceptance rate. Read the program's current criteria, and have a second plan. The second plan should be a direct cremation you have already priced. The NFDA 2023 median for direct cremation is $2,645 when the family supplies the container and $2,750 when the funeral home does (latest available; reprinted in the 2024 Cremation and Burial Report). That number is the backup budget, not a fee the medical school charges.</p>
<h3>How to register without handing the decision to a broker you do not know</h3>
<ol>
<li>Start with the medical school in your state. Search for that school's anatomical gift or body donation program and use the phone number on the .edu page.</li>
<li>Ask whether they accept donors from your county, whether they return cremated remains, and how long that takes.</li>
<li>Ask what happens if they decline on the day of death, and who the family should call next.</li>
<li>If you consider a non-university program, ask who the end user of the donation is and whether any part of the gift is distributed to a company. Write the answer down.</li>
<li>Give the program's 24-hour number to the person who will be called first. Put it on the refrigerator and in your phone, not only in a safe-deposit box.</li>
</ol>
<p>Organ donation for transplant is a different system, run through the organ-procurement organization at the hospital. You can be registered for both. One does not replace the other, and a transplant recovery can make a whole-body program decline. Ask both programs how they coordinate.</p>
<p>Our <a href="funeral-costs-uninsured.html">uninsured funeral guide</a> and the <a href="direct-cremation-cost.html">direct cremation guide</a> are the backup plans. Donation is a gift you hope the school can use. It is not an entitlement to a free disposition.</p>
${src(`Revised Uniform Anatomical Gift Act (2006) as the framework most states adopted; program rules are whatever the school currently publishes. Direct-cremation medians: <a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 GPL study</a>, reprinted in the 2024 Cremation and Burial Report.`)}
`,

  'funeral-planning-for-parents.html': `
<h2 id="parent-conversation">Planning with a parent: the conversation, the folder, and the number</h2>
<p>This page is for adult children who still have time. It is not the first-48-hours list. That list is the <a href="planning-checklist.html">funeral planning checklist</a>. The months-ahead legal file is the <a href="end-of-life-planning-checklist.html">end-of-life planning checklist</a>. Here the job is to learn what your parent wants and to put the papers where you can reach them.</p>
<h3>How to start without making it a crisis</h3>
<p>Pick a normal afternoon. Say that you want to be useful, not that you are worried they are dying. One question is enough for the first talk: "If I had to call a funeral home, do you want burial or cremation?" Write the answer down and read it back. The second talk can cover a church, a cemetery, and whether they want a viewing. People answer more clearly when they are not asked to design an entire funeral in one hour.</p>
<h3>The folder</h3>
<p>A single folder, paper or a shared drive they have already shown you how to open, should hold: the will's location, the power of attorney, the health care proxy, a list of accounts with institutions but not necessarily every password, insurance policy numbers, the veteran's discharge papers if they served, and the funeral note. Passwords to email can wait until they want to share them. The discharge paper (DD-214) is the document the VA will ask for, and it is harder to replace than a bank login. Our <a href="veteran-burial-benefits.html">veteran burial benefits guide</a> says what that paper unlocks, including a no-charge government marker.</p>
<h3>The funding number, sourced</h3>
<p>Ask what they have already set aside. Then show them one page, not a sales brochure. The NFDA 2023 medians, latest available, are $8,300 for a viewing and burial without the vault or cemetery, $6,280 for a viewing and cremation, and $2,645 or $2,750 for direct cremation depending on who supplies the container. If they have more than that in a payable-on-death account, they may not need a burial policy. If they do not, the <a href="burial-insurance-seniors.html">burial insurance for seniors</a> page is the age-banded explanation, and the <a href="funeral-insurance-guide.html">funeral insurance guide</a> is the plain-language overview. This parent-planning page does not pick a carrier.</p>
<h3>What you should not do yet</h3>
<p>Do not prepay a funeral home until you have read the cancellation and transfer terms, which are covered on the <a href="prepaid-funeral-plans.html">prepaid plans guide</a>. Do not put your name on their bank account as a joint owner just to "make it easier." Joint ownership can create gift and creditor problems a payable-on-death form does not. Do not promise siblings a role you cannot explain. If you are the health care proxy, say so. If your brother is the executor, say that too. The <a href="estate-planning-costs.html">estate-planning cost guide</a> separates those jobs.</p>
<h3>A script for the second visit</h3>
<ol>
<li>"I wrote down cremation and St. Luke's. Is that still right?"</li>
<li>"Where is the DD-214, and may I scan it?"</li>
<li>"Who should the hospital call at 2 a.m., and who should they not call?"</li>
<li>"Is there a policy or an account meant for the funeral, and where is the statement?"</li>
<li>"Do you want me to compare two funeral homes now, while you can look at the price lists with me?"</li>
</ol>
<p>If they say they do not want to discuss it, stop. Leave the folder and try again in a month. A forced conversation produces a plan nobody will follow.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 GPL medians</a>. Document roles are described, not priced, because this site does not have a reliable national attorney-fee survey.`)}
`,

  'burial-insurance-seniors.html': `
<h2 id="senior-math">Burial insurance after 50: the math, the waiting period, and where this page stops</h2>
<p>This page is only about age. The <a href="funeral-insurance-guide.html">funeral insurance guide</a> explains what these policies are. The <a href="funeral-insurance-comparison.html">comparison page</a> sets final-expense insurance next to preneed contracts. The <a href="best-burial-insurance.html">provider page</a> names carriers. The <a href="cremation-insurance-guide.html">cremation insurance guide</a> is for people who know they want cremation and a smaller benefit. If you are comparing monthly prices, read the date label on the provider page before you treat any dollar figure as a live quote.</p>
<h3>What you are buying</h3>
<p>Burial insurance for seniors is a small whole life policy, often sold as final expense insurance. The benefit is cash to a person you name. That person may spend it on a funeral or on anything else. The policy does not hire the funeral home, and the funeral home does not have to accept the face amount as the price. Premiums are level if the policy says they are level. Read that sentence on the specimen policy, not in an ad.</p>
<h3>A waiting period changes the product</h3>
<p>Simplified-issue policies ask a few health questions and often pay the full benefit from the first day. Guaranteed-issue policies skip the health questions and often pay only a return of premium, sometimes plus a little interest, if death from illness happens in the first two years. Accidental death is often covered in full immediately. If you are 78 and buying because you are ill, a two-year graded benefit may not do the job you think you are paying for. Ask the agent to say, in one sentence, what your family receives if you die in month six from a diagnosed illness. Write it down.</p>
<h3>Do the lifetime arithmetic before you buy</h3>
<p>This is arithmetic, not a rate quote. A premium of $80 a month is $960 a year. Over ten years that is $9,600, before any cash value. If the face amount is $10,000, you have nearly paid for the funeral yourself, and you still carry the risk that you stop paying and the policy lapses. A 55-year-old paying a lower premium for a longer time can come out differently. Nobody on this page can know your premium. The point of the senior guide is to make you multiply before you sign. Put the premium and the face amount on paper. If the product of premium times the number of years you reasonably expect to pay is close to the face amount, a savings account or a payable-on-death account may be the cleaner tool. It does not lapse, and it does not have a graded period.</p>
<h3>How much coverage the funeral medians suggest</h3>
<p>The NFDA 2023 study, latest available, puts a viewing and burial at a median of $8,300 before the cemetery and the vault, and direct cremation at $2,645 or $2,750. A $10,000 policy covers the first of those medians with a little room and more than covers direct cremation. It does not cover a cemetery plot in a high-cost city. Look at our <a href="funeral-costs-by-state.html">state cost pages</a> for the local funeral-home figures we publish, and ask a cemetery for the plot price, which NFDA left out of the $8,300 on purpose.</p>
<h3>Free look and lapse</h3>
<p>State insurance law gives a free-look window, often 10 to 30 days, during which you can cancel for a refund. The number of days is on the policy cover and in your state's insurance department brochure, not in a national statute we can quote as one figure. If you miss a premium later, ask about the grace period before you assume the policy died. Reinstatement may require new health questions you can no longer pass.</p>
<p>The National Association of Insurance Commissioners publishes consumer guides on life insurance. Start at <a href="https://content.naic.org/consumer.htm" target="_blank" rel="noopener">naic.org/consumer</a> and use your state insurance department's complaint form if a seller will not give you the graded-benefit terms in writing.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 medians</a>; <a href="https://content.naic.org/consumer.htm" target="_blank" rel="noopener">NAIC consumer information</a>. Premium examples in the $80 illustration are arithmetic, not a carrier quote. Reviewed October 22, 2026; carrier rate cards were not re-pulled for this section.`)}
`,

  'cremation-insurance-guide.html': `
<h2 id="cremation-policy">Cremation insurance is a small life policy with a marketing name</h2>
<p>Insurers use "cremation insurance" to mean a final-expense policy sized to a cremation. There is no separate federal product. This page is that sizing question. For the policy types, read the <a href="funeral-insurance-guide.html">funeral insurance guide</a>. For carriers, read <a href="best-burial-insurance.html">best burial insurance</a>. For age bands, read <a href="burial-insurance-seniors.html">burial insurance for seniors</a>. For a contract with one crematory, read <a href="prepaid-funeral-plans-comparison.html">prepaid plans compared</a>.</p>
<h3>Size the benefit to a sourced cremation price</h3>
<p>The NFDA 2023 General Price List Study, latest available, reports these cremation medians from member funeral homes: direct cremation $2,645 if the family provides the container and $2,750 if the funeral home provides it; a funeral with viewing and cremation $6,280. An urn's median in that study was $295. A policy of $5,000 covers a direct cremation near the median and leaves room for an urn, a death-certificate fee, and a simple gathering. A policy of $10,000 is in the range of a viewing plus cremation. It is more than a direct cremation requires. Buying $25,000 because the advertisement said "cremation insurance" is how people pay for a burial-sized policy they did not mean to buy.</p>
<h3>Insurance versus a preneed cremation contract</h3>
<p>A preneed contract names a funeral home, lists the services, and takes your money now, usually into a trust or an insurance policy the home controls. If you move, you are negotiating a transfer. If the home closes, you are dealing with whatever your state preneed law provides. The state board in our <a href="state-funeral-regulations.html">regulations directory</a> is where those rules live. A cremation insurance policy pays cash to a person. That person can hire any crematory, in any state, and keep what is left. The tradeoff is that the cash may not track a future price increase, while a guaranteed preneed contract might. "Might" is doing work in that sentence. Read whether the guarantee covers cash-advance items such as the death certificate and the medical examiner fee. Many do not.</p>
<h3>A payable-on-death account as the alternative</h3>
<p>If you can set aside $3,000 to $6,000 now, a payable-on-death savings account pays the person you name when they bring a death certificate. There is no health question and no lapse. The money is yours while you are alive. That is often the better tool for a healthy person who wants only a direct cremation. It is a poor tool if you cannot leave the money untouched. Insurance exists for the second case, and it costs more over a long life, which the senior page asks you to multiply out.</p>
<h3>Questions that belong on a cremation policy application</h3>
<ol>
<li>Is the full benefit paid in month six if death is from illness, or only a return of premium?</li>
<li>Is the premium guaranteed not to rise?</li>
<li>What is the free-look period in my state?</li>
<li>Does the application ask health questions I must answer myself, or is someone filling it in for me? You are responsible for the answers.</li>
<li>Is this a policy I own, or a preneed contract with a named crematory?</li>
</ol>
<p>We do not rank "the best cremation insurance plan" on this page. Any ranking of carriers is on the provider page, and it should be read with that page's quote-date label.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 cremation medians</a>, including the direct-cremation lines reprinted in the 2024 Cremation and Burial Report.`)}
`,

  'funeral-financing-options.html': `
<h2 id="loan-versus-aid">Loans and payment plans, kept separate from aid and from having nothing</h2>
<p>This financing page is about borrowing and about paying over time: an assignment of life insurance, a funeral-home payment plan, a personal loan, or a credit card. It is not the directory of grants. That directory is <a href="funeral-payment-assistance.html">funeral payment assistance</a>. It is not the page for a family that cannot borrow at all. That page is <a href="how-to-pay-for-a-funeral-with-no-money.html">how to pay for a funeral with no money</a>. Mixing the three is how people take a loan they did not need to take.</p>
<h3>Try price before you try credit</h3>
<p>The NFDA 2023 median of $8,300 is a viewing and burial. Direct cremation's median is $2,645 or $2,750. The gap between those two sourced numbers is larger than the interest on a small loan. Before anyone finances a traditional funeral, ask for the direct-cremation price on the same General Price List. The <a href="${FTC}" target="_blank" rel="noopener">Funeral Rule</a> requires the home to offer the items separately. A payment plan on a $8,300 package is a worse product than paying cash for a $2,700 direct cremation if the family would have accepted cremation. Have that conversation first.</p>
<h3>Assignment of an existing life policy</h3>
<p>If the person who died already had life insurance, the beneficiary can often assign part of the benefit so the funeral home is paid by the insurer. The home may ask for a small deposit while the claim is pending. You are not buying a new policy. You are directing money that already exists. Ask the insurer, not only the funeral director, whether an assignment form is accepted and how long the claim takes. Get the assignment amount in writing so the rest of the benefit still reaches the family.</p>
<h3>Payment plans and loans</h3>
<p>Some funeral homes will divide their own bill over months. The interest rate, or the fact that there is no interest, has to be on the paper. A personal loan from a bank or a credit union is a different contract, with your credit, and it survives even if you later dispute the funeral. Credit cards are the expensive version of the same idea unless a promotional rate is real and you will pay it off inside the promotional window. We do not publish a national average APR for funeral loans. Any percentage on a lender's site today is that lender's number. Compare at least the funeral home's plan and one credit-union quote, and choose the smaller total you will pay, not the smaller monthly coupon.</p>
<h3>What is not financing</h3>
<p>Social Security's $255, a VA burial allowance, a county indigent burial, and Medicaid burial help are aid. They are described on the payment-assistance page and, for the case where nothing else is available, on the zero-budget page. Do not sign a loan "in the meantime" if an aid program will pay the crematory directly and the home is willing to wait. Ask. FEMA funeral help exists only for deaths tied to a declared disaster, under that disaster's rules. It is not a standing funeral grant.</p>
<p>Crowdfunding, covered on its <a href="crowdfunding-funeral-costs.html">own page</a>, is also not a loan. Do not promise a lender you will repay from donations that have not arrived.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 medians</a>; <a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a>; <a href="${SSA}" target="_blank" rel="noopener">SSA $255</a>. No national funeral-loan APR is cited.`)}
`,

  'end-of-life-planning-checklist.html': `
<h2 id="four-weekends">Four weekends, and a correction about the will statistic</h2>
<p>The end-of-life checklist above is the full file: legal papers, money, and funeral wishes. The <a href="planning-checklist.html">funeral planning checklist</a> is the first 48 hours after a death. The <a href="funeral-planning-checklist-printable.html">printable checklist</a> is the packet to carry to a funeral home. Use this page in advance. Use those two when the time is short or when you want paper.</p>
<p>An earlier version of this page said that only 34 percent of American adults have a will and that fewer than 30 percent have an advance directive. We could not tie those percentages to a Census Bureau or other official series when we reviewed the page on October 22, 2026. Treat them as discarded. The action does not depend on them. A will, beneficiary forms, a durable power of attorney, and a health care proxy are worth signing because of what they do, not because of a share of the population.</p>
<h3>Weekend one: people</h3>
<p>Name one health care proxy and one backup. Name one person for finances and say whether that is the same person. Tell both of them. A document they do not know about is a document the hospital will not wait for. If you have minor children, name a guardian in the will even if the will does nothing else. That is the clause that matters most for a young parent, and it is described on the <a href="estate-planning-costs.html">estate-planning cost guide</a>.</p>
<h3>Weekend two: forms that override the will</h3>
<p>Life insurance, retirement accounts, and payable-on-death bank accounts follow the form on file with the company. Walk through each one online or with a statement in your hand. If the beneficiary line is blank, the money may fall into probate. If it names someone you divorced, the form may still control. This is dull work and it is the work that fails when it is skipped.</p>
<h3>Weekend three: the funeral note and a number</h3>
<p>Write burial or cremation, a congregation if you have one, and a spending limit. Use the NFDA 2023 medians as the limit's reference, labeled as medians: $8,300 for a viewing and burial before cemetery charges, $6,280 for a viewing and cremation, about $2,645 to $2,750 for direct cremation. Say whether you have already set money aside. Do not prepay on weekend three. Read the <a href="prepaid-funeral-plans.html">prepaid guide</a> first if you are tempted.</p>
<h3>Weekend four: digital access and the folder</h3>
<p>List the email account that receives the bank alerts, the phone passcode, and where the DD-214 is if you served. You do not have to write every password in a notebook that can be stolen. A password manager with a legacy contact, or a sealed envelope your proxy knows about, is enough. Put the funeral note, the proxy, and a copy of the insurance face page in the same folder. Tell one person the folder's location. Review the folder after a marriage, a divorce, a death, or a move, and otherwise every few years.</p>
<p>State advance-directive forms are usually free. Attorney prices for a will are not a number we will repeat from the old checklist as if they were a surveyed fee. Ask for a flat fee in your city. The <a href="probate-process-costs.html">probate cost guide</a> shows why the alternative, a court process, has its own bill, including California's statutory schedule if that is the state you are in.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 medians</a>. The 34 percent will figure previously printed on this page is withdrawn for lack of an official source.`)}
`,

  'funeral-costs-uninsured.html': `
<h2 id="no-policy">No life insurance: the order of operations</h2>
<p>This page is for a death when there is no policy and not much cash. It overlaps two neighbors on purpose, and then it stops. <a href="how-to-pay-for-a-funeral-with-no-money.html">How to pay with no money</a> is the zero-budget page, including county disposition. <a href="funeral-payment-assistance.html">Payment assistance</a> is the catalog of programs. <a href="funeral-financing-options.html">Financing</a> is loans and payment plans, which assume someone can repay. If nobody can repay, do not start there.</p>
<h3>Price the smallest dignified option first</h3>
<p>Ask two funeral homes for direct cremation, container included, and write the numbers down. The national median from the NFDA 2023 study, latest available, is $2,750 when the funeral home supplies the container and $2,645 when the family does. Your city may be lower or higher. The median is the reality check, not the quote. A viewing and burial at the $8,300 median, before a cemetery, is a different purchase. If there is no insurance, do not agree to that purchase on the first call.</p>
<h3>The benefits that are real and small</h3>
<p>Social Security pays a one-time $255 to a surviving spouse who was living with the worker, or to an eligible child, if the worker had enough work credits. File <a href="${SSA}" target="_blank" rel="noopener">Form SSA-8</a>. It does not pay $7,500, and this site does not cite a single national cap of that size for state programs. State and county burial aid exists and the dollar limit is whatever that county publishes this year. Call the county human-services office and ask for the indigent burial or cremation program. Our payment-assistance guide collects the kinds of programs. It cannot know today's local cap.</p>
<p>Veterans may have a burial allowance, a grave in a national cemetery, and a marker. The amounts change. Use the <a href="veteran-burial-benefits.html">veteran guide</a> and the VA page it cites rather than a number remembered from a commercial. A discharge paper speeds this up.</p>
<h3>What to sign, and what to refuse, on day one</h3>
<p>You can authorize a direct cremation and decline embalming, a visitation, printed materials, and a casket. The Funeral Rule is why. You can also say you need until tomorrow. Refrigeration is the ordinary way a home holds a body while you compare. If a director says the law requires a package, ask which statute. Then call a second home.</p>
<p>A crowdfunding page can fill a gap. It is not a plan. Build it only after you know the direct-cremation price, so the campaign has an honest target. The <a href="crowdfunding-funeral-costs.html">crowdfunding guide</a> covers the rest. A new burial-insurance application cannot help the person who has already died. Insurance is for the next time, and only after you do the multiplication on the <a href="burial-insurance-seniors.html">senior insurance page</a>.</p>
${src(`<a href="${NFDA}" target="_blank" rel="noopener">NFDA 2023 direct-cremation and funeral medians</a>; <a href="${SSA}" target="_blank" rel="noopener">SSA-8, $255 lump-sum death payment</a>; <a href="${FTC}" target="_blank" rel="noopener">FTC Funeral Rule</a>. No national "$7,500 state program" figure is used.`)}
`
};

const more = {
  'funeral-flowers-guide.html': `
<h2 id="after-the-service">After the service, and the bill that is not on the price list</h2>
<p>Flowers are not a line in the NFDA 2023 General Price List Study. That study's $8,300 median for a viewing and burial leaves florists out, which is why this flower guide will not invent a national arrangement price. The bill you can audit is the shop's invoice and the funeral home's statement. If both charge for the same spray, you are paying twice, and the second charge is the one to question before you sign.</p>
<p>Cremation changes the order, not the manners. A family that chose direct cremation may still want flowers at a memorial a week later, in a church, a park, or a living room. Tell the shop the venue and whether there is a casket. A casket spray sent to a memorial with an urn is the wrong object. A basket or a standing piece fits. If the family asked for donations to a named charity, the card can name the charity and the shop does not need to deliver anything.</p>
<p>Keep the shop's written description, the delivery time, and the card copy. Those three lines are what you compare when a second relative offers to handle the flowers. The national funeral medians cited here are from the NFDA 2023 release, and the ordering steps are practice rather than a price quote, reviewed for this flower guide on October 22, 2026.</p>
`,
  'crowdfunding-funeral-costs.html': `
<h2 id="after-launch">The week after you publish the funeral fundraiser</h2>
<p>The first update should be short: what has come in, what the funeral home still needs in writing, and whether the plan is still direct cremation or has changed. People who gave money are owed that, and a silent page looks abandoned. Do not post the General Price List in full if it shows account numbers or a relative's phone. A sentence is enough: the home's written total, labeled as a quote, with the NFDA 2023 direct-cremation median of $2,645 (family-supplied container, latest available) labeled as national context rather than as your bill.</p>
<p>Withdrawals should match the purpose you wrote. Rent, a headstone, and a relative's airfare are different promises. If you change the purpose, say so on the page the same day. The person whose name is on the bank account is the one a donor will ask. Give that person the funeral contract and the platform's payout receipt, and keep both with the estate papers.</p>
<p>If a donor asks whether the gift is deductible, do not guess. A gift to a family is not the same thing as a gift to a charity. IRS Publication 525 is the discussion to hand them, and a tax preparer is the person who applies it. This crowdfunding guide does not quote a platform fee. The live GoFundMe pricing page is the fee schedule it points to, and the link was checked on October 22, 2026.</p>
`,
  'pet-cremation-costs.html': `
<h2 id="pet-records">The record to keep after a pet is cremated</h2>
<p>When the ashes come home, ask for the crematory's name, the date, and the weight that was on the estimate. Staple that note to the clinic invoice. If you later believe the ashes are not your animal's, that pair of papers is what a veterinary board or a small-claims court will ask to see. The AVMA pages linked from this guide discuss identification and carcass disposal. They do not publish a price. This pet-cremation guide still will not print a national dollar range, because no official price survey is its source.</p>
<p>If more than one pet dies, or a pet dies while you are also arranging a person's funeral, keep the invoices separate. A human funeral board does not license a veterinary crematory, and the FTC Funeral Rule's duties on caskets and price lists do not cross over to a clinic. You can still ask the clinic for an itemized estimate before you agree to a paw print, a clay mold, or an upgraded urn. Decline any line you did not request, and have the clinic email the revised total.</p>
<p>A memorial at home can be a photograph and the urn. It does not need a funeral-home chapel, and it does not need to happen the day the ashes return. If you want a marker in a pet cemetery, get the cemetery's rule on outside markers in writing. That request was part of the review of this pet-cremation guide on October 22, 2026.</p>
`,
  'funeral-planning-for-parents.html': `
<h2 id="two-homes">Comparing two homes while a parent can still read the list</h2>
<p>The useful visit is the one your parent attends, even by speakerphone. Ask each funeral home to email the General Price List. Federal rules require a home to tell you prices and to hand over that list. Sit together and circle only the lines they want: transfer, a direct cremation, or a viewing. Write the total in the folder beside the NFDA 2023 medians so a package price has something honest next to it. Those medians remain $8,300 for a viewing and burial, $6,280 for a viewing and cremation, and $2,645 or $2,750 for direct cremation, latest available. They are national figures, not a quote for your parent's city.</p>
<p>Decide who may change the plan later. The health care agent is not always the person who will pay. The person who will sign the funeral contract should be the one who heard the prices. Tell siblings the date of the call and send them both lists. A parent who has named a church and a song has done the part that is hard to guess. The price comparison can be repeated in a year if they move.</p>
<p>This parent-planning guide does not estimate a lawyer's fee for the will. The estate-planning cost page explains why a national fee is not printed here. What you can finish without that fee is the folder, the two price lists, and the names of who calls whom. Those steps were reviewed for this parent guide on October 22, 2026.</p>
`
};

module.exports = { expansions, more };

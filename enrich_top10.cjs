/**
 * enrich_top10.cjs — Injects 600-1000+ word educational contentHTML
 * into the top-10 thin calculators across loan, tax, and salary pages.
 */
const fs = require("fs");

// ─── helpers ───────────────────────────────────────────────────────────────
function patch(file, id, richHTML) {
  if (!fs.existsSync(file)) { console.warn("  ⚠️  File not found:", file); return false; }
  let src = fs.readFileSync(file, "utf8");

  // Find the existing entry in HUB_CONTENT
  const marker = '"' + id + '"';
  const idx = src.indexOf(marker);
  if (idx === -1) { console.warn("  ⚠️  ID not found in HUB_CONTENT:", id); return false; }

  // Look for existing contentHTML key inside this block
  const blockEnd = src.indexOf("\n    \"", idx + marker.length + 5);
  const existingBlock = src.slice(idx, blockEnd > idx ? blockEnd : idx + 8000);

  const hasContentHTML = /contentHTML:\s*`/.test(existingBlock);

  if (hasContentHTML) {
    // Replace existing contentHTML
    const htmlStart = src.indexOf("contentHTML: `", idx);
    if (htmlStart === -1 || htmlStart > (blockEnd > idx ? blockEnd : idx + 8000)) {
      console.warn("  ⚠️  contentHTML marker out of range for", id);
      return false;
    }
    // find the closing backtick
    let depth = 0;
    let i = htmlStart + "contentHTML: `".length;
    while (i < src.length) {
      if (src[i] === "`") { break; }
      i++;
    }
    const oldHTML = src.slice(htmlStart, i + 1);
    const newHTML = "contentHTML: `" + richHTML + "`";
    src = src.slice(0, htmlStart) + newHTML + src.slice(i + 1);
    console.log(`  ✅ Replaced contentHTML for: ${id}`);
  } else {
    // Insert contentHTML before the faq/steps/comparison/insight key, or before the closing brace
    const insertAt = existingBlock.search(/\n\s*(faq:|steps:|comparison:|insight:|}\s*[,;])/);
    if (insertAt === -1) {
      console.warn("  ⚠️  Could not find insertion point for", id);
      return false;
    }
    const absInsert = idx + insertAt;
    const toInsert = `\n        contentHTML: \`${richHTML}\`,`;
    src = src.slice(0, absInsert) + toInsert + src.slice(absInsert);
    console.log(`  ✅ Inserted contentHTML for: ${id}`);
  }

  fs.writeFileSync(file, src, "utf8");
  return true;
}

// ─── GST Calculator ─────────────────────────────────────────────────────────
patch(
  "app/tax-calculators/[calculator]/page.tsx",
  "gst-calculator",
  `<h2>What is GST?</h2>
<p>Goods and Services Tax (GST) is India's unified indirect tax system that replaced a complex web of central and state taxes — including VAT, service tax, excise duty, and entry tax — on 1 July 2017. As a <strong>destination-based, multi-stage tax</strong>, GST is levied at every point in the supply chain but only on the value added at each stage. The final consumer bears the actual tax burden.</p>

<h3>GST Rate Slabs (2024)</h3>
<p>India's GST council classifies goods and services into five rate categories:</p>
<table><thead><tr><th>Rate</th><th>Category</th><th>Examples</th></tr></thead><tbody>
<tr><td><strong>0%</strong></td><td>Essential goods (exempt)</td><td>Fresh fruits, vegetables, milk, eggs, bread, education, healthcare</td></tr>
<tr><td><strong>5%</strong></td><td>Necessities</td><td>Packaged food, sugar, tea, coffee, domestic LPG, fertilisers</td></tr>
<tr><td><strong>12%</strong></td><td>Standard goods</td><td>Processed food, computers, mobile phones, butter, cheese, ayurvedic medicines</td></tr>
<tr><td><strong>18%</strong></td><td>Most services &amp; goods</td><td>Restaurants (AC), telecom, banking fees, capital goods, electronics, hotel rooms (₹2,500–₹7,500/night)</td></tr>
<tr><td><strong>28%</strong></td><td>Luxury &amp; sin goods</td><td>Cars, motorcycles, tobacco, cement, air conditioners, lottery, casinos, hotel rooms &gt;₹7,500/night</td></tr>
</tbody></table>

<h3>CGST, SGST, and IGST — What's the Difference?</h3>
<p>GST is split between the central and state governments based on whether the transaction is within a state or across states:</p>
<ul>
<li><strong>CGST</strong> (Central GST) — Collected by the central government on intra-state transactions. Half the total GST rate.</li>
<li><strong>SGST</strong> (State GST) — Collected by the state government on intra-state transactions. The other half.</li>
<li><strong>IGST</strong> (Integrated GST) — Applied on inter-state transactions and imports. Equal to CGST + SGST combined, collected by the centre and distributed to the relevant state.</li>
</ul>
<div class="explanation__highlight"><strong>Example:</strong> A 18% GST transaction within Maharashtra: 9% CGST (to centre) + 9% SGST (to Maharashtra). The same transaction between Maharashtra and Karnataka: 18% IGST (to centre, allocated to Karnataka as the destination state).</div>

<h3>How to Calculate GST — Step by Step</h3>
<p><strong>Adding GST to a price (GST-exclusive):</strong></p>
<div class="explanation__highlight">GST Amount = Original Price × (GST Rate / 100)<br/>Total Price = Original Price + GST Amount<br/><br/><strong>Example:</strong> Product costs ₹1,000, GST 18% → GST = ₹180 → Total = ₹1,180</div>

<p><strong>Removing GST from an inclusive price (reverse calculation):</strong></p>
<div class="explanation__highlight">Original Price = Inclusive Price × 100 / (100 + GST Rate)<br/>GST Amount = Inclusive Price − Original Price<br/><br/><strong>Example:</strong> Invoice shows ₹1,180 (GST inclusive, 18%) → Original = 1,180 × 100/118 = ₹1,000 → GST = ₹180</div>

<h3>GST Registration Threshold</h3>
<p>Businesses with an annual turnover exceeding <strong>₹40 Lakh</strong> (goods) or <strong>₹20 Lakh</strong> (services) must register for GST. For special category states (Manipur, Mizoram, Nagaland, Tripura), the threshold is ₹10 Lakh for services. Voluntary registration is allowed even below thresholds — beneficial for businesses that want to claim Input Tax Credit (ITC).</p>

<h3>Input Tax Credit (ITC) — The Key GST Benefit</h3>
<p>ITC allows businesses to deduct the GST they've paid on purchases from the GST they collect on sales. This prevents "tax on tax" and is the mechanism that makes GST a value-added system:</p>
<div class="explanation__highlight"><strong>GST payable = GST collected on sales − GST paid on purchases (ITC)</strong><br/><br/>Manufacturer buys raw material at ₹100,000 + 18% GST (₹18,000). Sells product at ₹140,000 + 18% GST (₹25,200).<br/>Net GST payable to government = ₹25,200 − ₹18,000 = <strong>₹7,200</strong></div>

<h3>GST Returns and Filing</h3>
<p>Registered GST businesses must file returns at regular intervals. The main forms:</p>
<ul>
<li><strong>GSTR-1:</strong> Outward supply details (sales). Monthly for turnover &gt;₹5 Cr; quarterly (QRMP scheme) for smaller businesses</li>
<li><strong>GSTR-3B:</strong> Monthly summary return with tax payment. All regular taxpayers</li>
<li><strong>GSTR-9:</strong> Annual return summarizing the financial year. Due by 31 December</li>
<li><strong>GSTR-4:</strong> Annual return for Composition Scheme dealers</li>
</ul>

<h3>References</h3>
<ul>
<li>Central Board of Indirect Taxes &amp; Customs (CBIC) — cbic.gov.in</li>
<li>GST Council Secretariat — gstcouncil.gov.in</li>
<li>GST Act, 2017 — Official text and notifications</li>
</ul>`
);

// ─── HRA Exemption Calculator ────────────────────────────────────────────────
patch(
  "app/tax-calculators/[calculator]/page.tsx",
  "hra-exemption-calculator",
  `<h2>What is HRA Exemption?</h2>
<p>House Rent Allowance (HRA) is a component of salary provided by employers to help employees meet rental housing costs. Under <strong>Section 10(13A) of the Income Tax Act</strong>, the HRA exemption reduces your taxable income — but only if you are actually paying rent. If you don't pay rent, the entire HRA is taxable.</p>

<h3>HRA Exemption Formula — Minimum of Three</h3>
<p>The exempt HRA is the <strong>lowest</strong> of the following three calculations:</p>
<div class="explanation__highlight">
<strong>1. Actual HRA received from employer</strong><br/>
<strong>2. Rent paid − 10% of Basic Salary</strong><br/>
<strong>3. 50% of Basic Salary</strong> (metro: Delhi, Mumbai, Chennai, Kolkata) <strong>OR 40%</strong> (non-metro)
</div>

<h3>Worked Example — Metro City</h3>
<p>Employee in Mumbai: Monthly Basic = ₹50,000 | HRA received = ₹20,000 | Rent paid = ₹22,000</p>
<table><thead><tr><th>Calculation</th><th>Amount</th></tr></thead><tbody>
<tr><td>Actual HRA received</td><td>₹20,000</td></tr>
<tr><td>Rent − 10% of Basic: ₹22,000 − ₹5,000</td><td>₹17,000</td></tr>
<tr><td>50% of Basic (Metro): 50% × ₹50,000</td><td>₹25,000</td></tr>
</tbody></table>
<div class="explanation__highlight"><strong>Exempt HRA = Minimum(₹20,000, ₹17,000, ₹25,000) = ₹17,000/month</strong><br/>Annual exempt HRA = ₹17,000 × 12 = ₹2,04,000<br/>Taxable HRA = ₹20,000 − ₹17,000 = ₹3,000/month</div>

<h3>Worked Example — Non-Metro City</h3>
<p>Employee in Pune: Monthly Basic = ₹40,000 | HRA received = ₹14,000 | Rent paid = ₹16,000</p>
<ul>
<li>Actual HRA: ₹14,000</li>
<li>Rent − 10% Basic: ₹16,000 − ₹4,000 = ₹12,000</li>
<li>40% of Basic: ₹16,000</li>
<li><strong>Exempt = Minimum = ₹12,000/month → ₹1,44,000/year</strong></li>
</ul>

<h3>Metro vs Non-Metro Cities</h3>
<p>The Income Tax Act recognises only <strong>four cities as metro</strong> for HRA purposes — qualifying for the 50% Basic rule:</p>
<ul>
<li><strong>Metro (50%):</strong> Delhi, Mumbai, Kolkata, Chennai</li>
<li><strong>Non-Metro (40%):</strong> All other cities including Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur, despite being Tier-1 cities</li>
</ul>
<p>This distinction significantly impacts HRA exemption for residents of Bengaluru and Hyderabad — two of India's highest-rent cities — who only receive the 40% Basic benefit.</p>

<h3>Important Conditions for Claiming HRA</h3>
<ul>
<li>You must be a <strong>salaried employee</strong> (self-employed cannot claim HRA; they can claim deduction under Section 80GG instead)</li>
<li>You must actually <strong>be paying rent</strong> — HRA exemption requires real rental expenditure</li>
<li>You cannot claim HRA if you own the property you live in</li>
<li>If annual rent exceeds <strong>₹1 Lakh</strong>, your employer's PAN is compulsory on your rent receipts</li>
<li>Under the <strong>New Tax Regime (2024+)</strong>, HRA exemption is NOT available. Only the Old Tax Regime allows Section 10(13A) exemption</li>
</ul>

<h3>HRA vs Section 80GG (For Self-Employed / No HRA)</h3>
<p>If you don't receive HRA from your employer (or are self-employed), you can claim a deduction under <strong>Section 80GG</strong>, which is the lesser of:</p>
<div class="explanation__highlight">
1. Rent paid − 10% of total income<br/>
2. 25% of total income<br/>
3. ₹5,000 per month (₹60,000/year — very low cap)
</div>
<p>Section 80GG's ₹60,000 annual cap makes it far less valuable than HRA exemption, which has no fixed ceiling.</p>

<h3>References</h3>
<ul>
<li>Section 10(13A) — Income Tax Act, 1961</li>
<li>Rule 2A — Income Tax Rules, 1962 (defines the three-limb test)</li>
<li>Income Tax Department, Government of India — incometax.gov.in</li>
</ul>`
);

// ─── Salary After Tax ────────────────────────────────────────────────────────
patch(
  "app/salary-calculators/[calculator]/page.tsx",
  "salary-after-tax",
  `<h2>What is Salary After Tax?</h2>
<p>Salary after tax — also called <strong>net take-home pay</strong> or <strong>in-hand salary</strong> — is the amount your employer actually deposits into your bank account each month, after all mandatory deductions. In India, the gap between your offered CTC (Cost to Company) and your take-home can be surprisingly large — often 25–40% less than employees expect.</p>

<h3>Anatomy of an Indian Salary Slip — CTC to Take-Home</h3>
<table><thead><tr><th>Component</th><th>Who Pays</th><th>Typical %</th></tr></thead><tbody>
<tr><td>Basic Salary</td><td>Employee receives</td><td>40–50% of CTC</td></tr>
<tr><td>HRA</td><td>Employee receives</td><td>40–50% of Basic</td></tr>
<tr><td>Allowances (Transport, Food, Medical)</td><td>Employee receives</td><td>10–15% of CTC</td></tr>
<tr><td>Employee PF (EPF)</td><td>Deducted from employee</td><td>12% of Basic</td></tr>
<tr><td>Employer PF (EPF)</td><td>Employer contributes</td><td>12% of Basic (added to CTC)</td></tr>
<tr><td>Gratuity (employer contribution)</td><td>Employer sets aside</td><td>4.81% of Basic (added to CTC)</td></tr>
<tr><td>Professional Tax</td><td>Deducted from employee</td><td>₹200/month (most states)</td></tr>
<tr><td>Income Tax (TDS)</td><td>Deducted from employee</td><td>Varies by income slab</td></tr>
</tbody></table>

<h3>Step-by-Step: Net Take-Home Calculation</h3>
<div class="explanation__highlight">
<strong>Example:</strong> CTC ₹12 LPA<br/><br/>
Gross salary = CTC − Employer PF − Gratuity<br/>
= ₹12,00,000 − ₹57,600 − ₹27,720 = <strong>₹11,14,680/year</strong><br/><br/>
Monthly gross = ₹92,890<br/>
Less EPF (employee 12% of Basic ₹40,000) = −₹4,800<br/>
Less Professional Tax = −₹200<br/>
Less TDS (approx, Old Regime after deductions) = −₹4,500<br/>
<strong>Net take-home ≈ ₹83,390/month</strong>
</div>

<h3>Old Tax Regime vs New Tax Regime — Which is Better?</h3>
<p>From FY 2024-25, the New Tax Regime is the default. You must actively opt for the Old Regime during ITR filing (or inform your employer at the start of the year). Key differences:</p>
<table><thead><tr><th>Feature</th><th>Old Regime</th><th>New Regime (Default)</th></tr></thead><tbody>
<tr><td>HRA Exemption</td><td>✅ Available</td><td>❌ Not available</td></tr>
<tr><td>80C Deductions (EPF, ELSS, LIC)</td><td>✅ Up to ₹1.5L</td><td>❌ Not available</td></tr>
<tr><td>80D (Health Insurance)</td><td>✅ Up to ₹25K-50K</td><td>❌ Not available</td></tr>
<tr><td>Standard Deduction</td><td>✅ ₹50,000</td><td>✅ ₹75,000 (FY25)</td></tr>
<tr><td>Tax Rates</td><td>Higher slabs (up to 30%)</td><td>Lower slabs (up to 30%)</td></tr>
<tr><td>Best for</td><td>Those with high deductions</td><td>Those with few deductions</td></tr>
</tbody></table>
<p><strong>Rule of thumb:</strong> If your total deductions (80C + HRA + 80D + others) exceed ₹3.75 Lakh, the Old Regime likely saves you more tax. Use our Tax Regime Comparison Calculator to check your specific situation.</p>

<h3>How to Maximize Your Take-Home Pay</h3>
<ul>
<li><strong>Structure salary optimally:</strong> Negotiate higher HRA, food allowance (Sec 17(2): ₹50/meal tax-free up to ₹26,400/year), LTA, and lower Basic to reduce EPF deductions</li>
<li><strong>Claim all exemptions:</strong> HRA (Section 10(13A)), LTA (Section 10(5)), food vouchers</li>
<li><strong>Use 80C smartly:</strong> EPF + ELSS mutual funds + Term insurance = ₹1.5L deduction</li>
<li><strong>Health insurance:</strong> Section 80D gives ₹25,000 deduction (₹50,000 for parents above 60)</li>
<li><strong>NPS contribution:</strong> Extra ₹50,000 deduction under Sec 80CCD(1B) beyond the ₹1.5L 80C limit</li>
</ul>

<h3>References</h3>
<ul>
<li>CBDT — Income Tax Act, 1961 | Employee's Provident Fund Act, 1952</li>
<li>Income Tax Department — incometax.gov.in</li>
<li>EPFO — epfindia.gov.in</li>
</ul>`
);

// ─── In-Hand Salary ──────────────────────────────────────────────────────────
patch(
  "app/salary-calculators/[calculator]/page.tsx",
  "in-hand-salary",
  `<h2>What is In-Hand Salary?</h2>
<p>In-hand salary (also called take-home pay or net salary) is the actual amount credited to your bank account each month after all deductions. It is always less than your <strong>CTC (Cost to Company)</strong> — sometimes significantly so. Understanding the difference is critical before accepting any job offer.</p>

<h3>CTC vs Gross vs Net Salary — Key Differences</h3>
<div class="explanation__highlight">
<strong>CTC</strong> = Everything the employer spends on you (including PF contribution, gratuity, insurance)<br/>
<strong>Gross Salary</strong> = CTC − Employer PF − Gratuity (what you "earn" before deductions)<br/>
<strong>In-Hand Salary</strong> = Gross Salary − Employee PF − Professional Tax − Income Tax (TDS)
</div>

<h3>What Gets Deducted from Your Salary?</h3>
<ul>
<li><strong>Employee Provident Fund (EPF):</strong> 12% of Basic Salary, compulsory for companies with 20+ employees where Basic is below ₹15,000/month (or optional above that)</li>
<li><strong>Professional Tax:</strong> ₹200/month in most states (Maharashtra, Karnataka, Andhra Pradesh, etc.). Not applicable in Delhi, Rajasthan, UP, Haryana</li>
<li><strong>Income Tax (TDS):</strong> Depends on your income slab and applicable deductions. Employer deducts proportionately each month based on your declared investments</li>
<li><strong>Health Insurance Premium:</strong> If employer provides group insurance and deducts premium</li>
<li><strong>ESI (Employee State Insurance):</strong> 0.75% of gross salary if gross &lt; ₹21,000/month</li>
</ul>

<h3>Typical In-Hand Salary at Various CTC Levels</h3>
<table><thead><tr><th>Annual CTC</th><th>Monthly Gross</th><th>EPF + PT</th><th>TDS (approx)</th><th>Monthly In-Hand</th></tr></thead><tbody>
<tr><td>₹4 LPA</td><td>₹29,700</td><td>₹2,000</td><td>Nil</td><td>~₹27,700</td></tr>
<tr><td>₹6 LPA</td><td>₹44,500</td><td>₹2,200</td><td>₹800</td><td>~₹41,500</td></tr>
<tr><td>₹8 LPA</td><td>₹59,300</td><td>₹2,400</td><td>₹1,800</td><td>~₹55,100</td></tr>
<tr><td>₹12 LPA</td><td>₹88,900</td><td>₹5,000</td><td>₹4,500</td><td>~₹79,400</td></tr>
<tr><td>₹20 LPA</td><td>₹1,48,000</td><td>₹8,200</td><td>₹14,000</td><td>~₹1,25,800</td></tr>
<tr><td>₹30 LPA</td><td>₹2,22,000</td><td>₹8,800</td><td>₹30,000</td><td>~₹1,83,200</td></tr>
</tbody></table>
<p><em>*Estimates based on standard salary structure. Actual amounts vary with HRA exemption, declared investments, and tax regime.</em></p>

<h3>Performance Bonus — Is It Part of In-Hand?</h3>
<p>Variable pay (performance bonus, PLI, incentives) is usually paid <strong>quarterly or annually</strong> and is part of your CTC but not guaranteed monthly in-hand. When evaluating a job offer with ₹15 LPA CTC including ₹3 LPA variable, assume only ₹12 LPA as guaranteed.</p>

<h3>References</h3>
<ul>
<li>Employees' Provident Fund Organisation (EPFO) — epfindia.gov.in</li>
<li>Income Tax Act, 1961 — Section 192 (TDS on Salary)</li>
<li>Professional Tax Acts of respective state governments</li>
</ul>`
);

// ─── Gratuity Calculator ─────────────────────────────────────────────────────
patch(
  "app/salary-calculators/[calculator]/page.tsx",
  "gratuity-calculator",
  `<h2>What is Gratuity?</h2>
<p>Gratuity is a statutory monetary benefit given by an employer to an employee as a <strong>token of appreciation for long service</strong>. It is governed by the <strong>Payment of Gratuity Act, 1972</strong> and is mandatory for all establishments with 10 or more employees. Gratuity is payable when an employee completes at least <strong>5 years of continuous service</strong> (with the exception of death or total disability, where the 5-year condition is waived).</p>

<h3>Gratuity Formula</h3>
<div class="explanation__highlight">
<strong>Gratuity = (Last Drawn Basic + DA) × 15 × Years of Service ÷ 26</strong><br/><br/>
Where:<br/>
• 15 = days per year of service<br/>
• 26 = working days per month<br/>
• Years of Service rounds down after 6 months in a year<br/><br/>
<strong>Example:</strong> Last Basic+DA = ₹40,000 | Service = 7 years 8 months (counts as 8 years)<br/>
Gratuity = ₹40,000 × 15 × 8 ÷ 26 = <strong>₹1,84,615</strong>
</div>

<h3>5-Year Rule — Counting Service</h3>
<p>A key detail: for rounding service years, the Act provides that if an employee completes <strong>more than 6 months in the final year</strong>, it counts as a full year. Examples:</p>
<ul>
<li>5 years 2 months → counted as <strong>5 years</strong></li>
<li>5 years 7 months → counted as <strong>6 years</strong></li>
<li>10 years 6 months 1 day → counted as <strong>11 years</strong></li>
</ul>

<h3>Gratuity Tax Exemption</h3>
<p>Gratuity received is tax-exempt up to certain limits under <strong>Section 10(10) of the Income Tax Act</strong>:</p>
<table><thead><tr><th>Employee Type</th><th>Tax-Exempt Limit</th></tr></thead><tbody>
<tr><td>Government employees (central/state/local)</td><td>Fully exempt (no limit)</td></tr>
<tr><td>Private sector employees covered by Gratuity Act</td><td>Exempt up to <strong>₹20 Lakh</strong> (revised from ₹10L in 2018)</td></tr>
<tr><td>Private sector employees NOT covered by Act</td><td>Exempt up to ½ month salary per year, or ₹20L, whichever is lower</td></tr>
</tbody></table>
<p>Gratuity received above the exempt limit is added to taxable income and taxed at applicable slab rates.</p>

<h3>When is Gratuity Paid?</h3>
<ul>
<li><strong>Resignation/Retirement:</strong> After completing 5+ years of service</li>
<li><strong>Death or Total Disability:</strong> Payable regardless of service period</li>
<li><strong>Retrenchment/Layoff:</strong> Payable if 5+ years of service completed</li>
<li><strong>Superannuation:</strong> On reaching retirement age</li>
</ul>
<p>The gratuity must be paid within <strong>30 days</strong> of becoming due. If delayed, the employer must pay interest from the due date at rates specified by the government.</p>

<h3>Forfeiture of Gratuity</h3>
<p>Gratuity can be forfeited (wholly or partially) if an employee is dismissed for:</p>
<ul>
<li>Acts of violence, riot, or moral turpitude</li>
<li>Willful omission or negligence causing loss to property</li>
</ul>
<p>Mere termination does not result in forfeiture — only dismissal for specific misconduct does.</p>

<h3>Employer's CTC Contribution</h3>
<p>Employers typically provision gratuity at <strong>4.81% of Basic+DA</strong> per year. For a ₹50,000 Basic salary, the monthly gratuity provision is ₹2,405 — this is included in your CTC but you only receive it at separation after 5+ years.</p>

<h3>References</h3>
<ul>
<li>Payment of Gratuity Act, 1972 — Ministry of Labour &amp; Employment</li>
<li>Section 10(10) — Income Tax Act, 1961</li>
<li>Labour Ministry Notification S.O. 1419(E), 2018 (updating exemption limit to ₹20 Lakh)</li>
</ul>`
);

// ─── APR to APY Calculator ───────────────────────────────────────────────────
patch(
  "app/loan-calculators/[calculator]/page.tsx",
  "apr-to-apy-calculator",
  `<h2>APR vs APY — What's the Real Difference?</h2>
<p>APR (Annual Percentage Rate) and APY (Annual Percentage Yield) are two ways to express interest rates — but they tell very different stories. Understanding the difference can literally save you thousands of dollars when comparing loans and savings products.</p>

<p><strong>APR</strong> represents the nominal interest rate for a year without accounting for compounding within the year. <strong>APY</strong> includes the effect of compounding — how often interest is calculated and added to your balance. For borrowers, APR understates the true cost; APY shows the real cost.</p>

<h3>The Conversion Formula</h3>
<div class="explanation__highlight">
<strong>APY = (1 + APR/n)^n − 1</strong><br/><br/>
Where n = number of compounding periods per year<br/>
(Daily = 365, Monthly = 12, Quarterly = 4, Semi-annually = 2, Annually = 1)<br/><br/>
<strong>Example:</strong> 12% APR compounded monthly:<br/>
APY = (1 + 0.12/12)^12 − 1 = (1.01)^12 − 1 = 1.1268 − 1 = <strong>12.68% APY</strong>
</div>

<h3>APR vs APY Comparison Table</h3>
<table><thead><tr><th>APR</th><th>Compounding</th><th>APY</th><th>Difference</th></tr></thead><tbody>
<tr><td>5%</td><td>Monthly</td><td>5.116%</td><td>+0.116%</td></tr>
<tr><td>6%</td><td>Monthly</td><td>6.168%</td><td>+0.168%</td></tr>
<tr><td>8%</td><td>Monthly</td><td>8.300%</td><td>+0.300%</td></tr>
<tr><td>10%</td><td>Daily</td><td>10.516%</td><td>+0.516%</td></tr>
<tr><td>12%</td><td>Monthly</td><td>12.683%</td><td>+0.683%</td></tr>
<tr><td>18%</td><td>Monthly</td><td>19.562%</td><td>+1.562%</td></tr>
<tr><td>20%</td><td>Daily</td><td>22.134%</td><td>+2.134%</td></tr>
<tr><td>25%</td><td>Daily</td><td>28.400%</td><td>+3.400%</td></tr>
</tbody></table>

<h3>Which to Use When?</h3>
<ul>
<li><strong>Shopping for a loan?</strong> Compare using APY — it shows the true cost. A credit card advertising "15% APR (monthly compounding)" actually costs you 16.08% APY</li>
<li><strong>Shopping for savings?</strong> Banks advertise APY (the higher number). Compare savings accounts and CDs using APY for apples-to-apples comparison</li>
<li><strong>Mortgages:</strong> The federally mandated APR for mortgages includes fees — making it higher than the note rate. The effective monthly rate (APY equivalent) further adjusts for compounding</li>
</ul>

<h3>Credit Card APR — The Real Story</h3>
<p>Credit cards typically compound daily. A card stated as 20% APR compounds daily at 20%/365 = 0.0548%/day. The true annual cost:</p>
<div class="explanation__highlight">APY = (1 + 0.20/365)^365 − 1 = <strong>22.13%</strong><br/>On a $5,000 balance carried for a full year: interest cost = $1,107 (not $1,000 as APR implies)</div>

<h3>References</h3>
<ul>
<li>Federal Reserve — Truth in Lending Act (TILA) / Regulation Z</li>
<li>Federal Truth in Savings Act (TISA) — requires banks to disclose APY</li>
<li>Consumer Financial Protection Bureau (CFPB) — consumerfinance.gov</li>
</ul>`
);

// ─── CD Calculator ───────────────────────────────────────────────────────────
patch(
  "app/loan-calculators/[calculator]/page.tsx",
  "cd-calculator",
  `<h2>What is a Certificate of Deposit (CD)?</h2>
<p>A Certificate of Deposit (CD) is a federally insured time-deposit savings product offered by banks and credit unions. You deposit a fixed amount for a <strong>specified term</strong> (3 months to 5 years), and the bank pays you a guaranteed fixed interest rate. At maturity, you receive your principal plus all earned interest. CDs are among the safest investments available — FDIC-insured up to $250,000 per depositor per bank.</p>

<h3>CD Interest Calculation</h3>
<p>Most CDs compound interest either daily or monthly. The final value is calculated using:</p>
<div class="explanation__highlight">
<strong>A = P × (1 + r/n)^(n×t)</strong><br/><br/>
A = Final amount | P = Principal | r = Annual rate | n = Compounding periods/year | t = Time in years<br/><br/>
<strong>Example:</strong> $10,000 at 4.8% APY, compounded daily, 12-month CD:<br/>
A = $10,000 × (1 + 0.048/365)^365 = $10,000 × 1.04918 = <strong>$10,491.80</strong>
</div>

<h3>Current CD Rate Comparison (2024)</h3>
<table><thead><tr><th>Term</th><th>National Average APY</th><th>Best Available APY</th></tr></thead><tbody>
<tr><td>3 months</td><td>1.60%</td><td>5.25% (online banks)</td></tr>
<tr><td>6 months</td><td>2.00%</td><td>5.35%</td></tr>
<tr><td>1 year</td><td>1.80%</td><td>5.15%</td></tr>
<tr><td>2 years</td><td>1.50%</td><td>4.70%</td></tr>
<tr><td>5 years</td><td>1.40%</td><td>4.30%</td></tr>
</tbody></table>
<p><em>National averages per FDIC. Best rates from top online banks and credit unions. Rates change frequently.</em></p>

<h3>CD Strategies to Maximize Returns</h3>
<p><strong>CD Ladder:</strong> Divide your investment across multiple CD terms to balance yield and liquidity. Example: $20,000 split into 1-year, 2-year, 3-year, 4-year, and 5-year CDs of $4,000 each. As each CD matures annually, reinvest at whatever rate is best at that time.</p>
<p><strong>CD Barbell:</strong> Split funds between short-term (3-6 month) and long-term (4-5 year) CDs. Short-term CDs provide flexibility; long-term CDs capture higher yields.</p>
<p><strong>No-Penalty CDs:</strong> Offer slightly lower rates (typically 0.3-0.5% less) but allow early withdrawal without penalty — useful when rates are expected to rise.</p>

<h3>Early Withdrawal Penalties</h3>
<p>Breaking a CD before maturity incurs penalties, typically expressed in months of interest:</p>
<ul>
<li><strong>3-month CD:</strong> ~30-60 days interest penalty</li>
<li><strong>1-year CD:</strong> ~90-150 days interest penalty</li>
<li><strong>3-5 year CD:</strong> ~150-365 days interest penalty</li>
</ul>
<p>Even with a penalty, withdrawing early from a CD can sometimes be worth it if you can reinvest at a significantly higher rate. Our calculator helps you compare the break-even.</p>

<h3>CDs vs High-Yield Savings vs Treasury Bills</h3>
<table><thead><tr><th>Feature</th><th>CD</th><th>High-Yield Savings</th><th>T-Bill (6-month)</th></tr></thead><tbody>
<tr><td>Rate (2024)</td><td>4.5–5.35%</td><td>4.5–5.1%</td><td>~5.2%</td></tr>
<tr><td>FDIC/NCUA insured</td><td>✅ Up to $250K</td><td>✅ Up to $250K</td><td>✅ US govt-backed</td></tr>
<tr><td>Liquidity</td><td>Locked in (penalty)</td><td>Anytime</td><td>At maturity (or sell)</td></tr>
<tr><td>State tax</td><td>Taxable</td><td>Taxable</td><td>State tax exempt</td></tr>
<tr><td>Rate changes</td><td>Fixed — locked in</td><td>Variable — can drop</td><td>Fixed until maturity</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>FDIC — Certificate of Deposit rules and insurance limits — fdic.gov</li>
<li>Federal Reserve Economic Data (FRED) — CD rate history</li>
<li>National Credit Union Administration (NCUA) — credit union CD insurance</li>
</ul>`
);

// ─── Extra Payment Calculator ─────────────────────────────────────────────────
patch(
  "app/loan-calculators/[calculator]/page.tsx",
  "extra-payment-calculator",
  `<h2>The Power of Extra Loan Payments</h2>
<p>Making extra payments on your loan is one of the most mathematically powerful personal finance decisions you can make. When you pay more than the required monthly amount, <strong>100% of the extra amount goes directly to reducing your principal</strong> — not to interest. This creates a compounding benefit that accelerates payoff dramatically and eliminates thousands in future interest charges.</p>

<h3>Why Early Extra Payments Have Outsized Impact</h3>
<p>Because loan interest is calculated on the <strong>outstanding balance</strong>, every dollar of principal reduction early in the loan eliminates multiple years of future interest accrual. A loan's amortization schedule is front-loaded with interest — meaning the earlier you reduce principal, the more interest you eliminate.</p>
<div class="explanation__highlight">
<strong>Impact of Extra $500/month on a $300,000 Mortgage at 6.5% (30 years):</strong><br/>
Original payoff: 360 months | New payoff: 264 months (22 years)<br/>
Time saved: <strong>8 years</strong> | Interest saved: <strong>$122,000+</strong><br/><br/>
<strong>Starting same extra payment in Year 10 instead of Year 1 saves only $68,000</strong> — demonstrating the premium on starting early
</div>

<h3>Extra Payment Scenarios — Impact Comparison</h3>
<table><thead><tr><th>Extra Monthly</th><th>Years Saved</th><th>Interest Saved</th><th>Monthly Cost Increase</th></tr></thead><tbody>
<tr><td>$100</td><td>~4.5 years</td><td>~$44,000</td><td>Modest</td></tr>
<tr><td>$200</td><td>~6.5 years</td><td>~$74,000</td><td>Low</td></tr>
<tr><td>$500</td><td>~8 years</td><td>~$122,000</td><td>Moderate</td></tr>
<tr><td>$1,000</td><td>~11 years</td><td>~$165,000</td><td>Significant</td></tr>
</tbody></table>
<p><em>Based on $300,000 mortgage at 6.5% for 30 years. Your results will vary based on loan balance and rate.</em></p>

<h3>Lump-Sum vs Monthly Extra Payments</h3>
<p><strong>Lump-sum prepayments</strong> (from bonuses, tax refunds, or inheritance) are highly effective but carry timing considerations. A single $10,000 lump sum applied in Year 1 can save as much in total interest as making $150/month in extra payments over the same period.</p>
<p><strong>Monthly extra payments</strong> are more consistent and disciplined — easier to budget for and compound steadily over time. Setting up automatic overpayment with your lender is the most reliable approach.</p>

<h3>Reduce EMI vs Reduce Tenure — Which is Smarter?</h3>
<p>When you make a prepayment, many lenders give you two options:</p>
<ul>
<li><strong>Reduce Tenure:</strong> Keep the same monthly payment but pay off the loan sooner. <strong>This saves more total interest.</strong></li>
<li><strong>Reduce EMI:</strong> Lower your monthly payment while keeping the same payoff date. Provides immediate cash flow relief but saves less interest.</li>
</ul>
<div class="explanation__highlight"><strong>Recommendation:</strong> Choose tenure reduction unless you have a specific cash flow need. Reducing tenure by 3 years on a $300K mortgage saves approximately $60,000 more than reducing EMI by the equivalent amount.</div>

<h3>Biweekly Payments — The Zero-Effort Acceleration</h3>
<p>Switching from monthly to biweekly payments results in 26 half-payments per year instead of 12 full payments — the equivalent of one extra full payment annually. This effortless switch can shave 4-5 years off a 30-year mortgage and save $40,000-$50,000 in interest on a typical loan, without any lifestyle change.</p>

<h3>Should I Invest Instead of Prepaying?</h3>
<p>This depends on your loan rate vs. expected investment returns:</p>
<ul>
<li><strong>Loan at 6.5%, expected equity returns 10%:</strong> Investing may generate more — but with risk</li>
<li><strong>Prepaying gives a guaranteed, risk-free return</strong> equal to your interest rate</li>
<li><strong>Always prioritize:</strong> (1) Employer 401k match, (2) High-interest debt payoff, (3) Emergency fund, then (4) Split between investment and prepayment based on risk tolerance</li>
</ul>

<h3>References</h3>
<ul>
<li>Consumer Financial Protection Bureau (CFPB) — cfpb.gov</li>
<li>Federal Reserve — Regulation Z / Truth in Lending Act (prepayment penalty rules)</li>
</ul>`
);

// ─── Age Calculator ──────────────────────────────────────────────────────────
patch(
  "app/utility-calculators/[calculator]/page.tsx",
  "age-calculator",
  `<h2>How to Calculate Exact Age</h2>
<p>Calculating your exact age — in years, months, days, hours, minutes, and seconds — is more nuanced than a simple subtraction. Different contexts require different methods: <strong>chronological age</strong> (calendar years), <strong>legal age</strong> (varies by jurisdiction and calculation convention), and <strong>biological age</strong> (based on physiological markers). This calculator uses the standard Gregorian calendar with proper handling of leap years, varying month lengths, and time zones.</p>

<h3>How Date Calculations Work — The Complexity Behind Simple Math</h3>
<p>Subtracting two dates seems simple, but several factors complicate it:</p>
<ul>
<li><strong>Months have different lengths:</strong> 28, 29, 30, or 31 days. This affects whether a month "counts" as complete</li>
<li><strong>Leap years:</strong> February 29 birthdays present a special case — people born on this date typically celebrate on February 28 or March 1 in non-leap years</li>
<li><strong>International date differences:</strong> If you were born in Australia and calculate your age from the US, timezone differences might shift the day by one</li>
<li><strong>Calendar rollover:</strong> Age in months and days isn't the same as age in total days ÷ 30, because months have inconsistent lengths</li>
</ul>

<h3>Age Calculation Method Used</h3>
<div class="explanation__highlight">
<strong>Example:</strong> Born June 15, 1990 | Today: April 20, 2026<br/><br/>
Years: 2026 − 1990 = 36 years (birthday hasn't occurred yet in 2026)<br/>
So: 35 complete years<br/>
Months since last birthday (June 15, 2025): July, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar = 9 months<br/>
Days since April 1: 20 days<br/>
<strong>Result: 35 years, 10 months, 5 days</strong>
</div>

<h3>Legal Age Milestones (United States)</h3>
<table><thead><tr><th>Age</th><th>Legal Right / Milestone</th></tr></thead><tbody>
<tr><td>13</td><td>COPPA age of digital consent — social media accounts without parental approval</td></tr>
<tr><td>16</td><td>Driver's license (varies by state)</td></tr>
<tr><td>17</td><td>Enlist in military with parental consent</td></tr>
<tr><td>18</td><td>Legal adult, vote, sign contracts, purchase tobacco (federally)</td></tr>
<tr><td>21</td><td>Purchase and consume alcohol</td></tr>
<tr><td>25</td><td>Car rental without surcharge (most agencies); brain fully developed (neuroscience)</td></tr>
<tr><td>35</td><td>Eligible for President of the United States</td></tr>
<tr><td>59½</td><td>401k/IRA early withdrawal without penalty</td></tr>
<tr><td>62</td><td>Earliest Social Security benefits (reduced)</td></tr>
<tr><td>65</td><td>Medicare eligibility</td></tr>
<tr><td>67</td><td>Full Social Security retirement age (born 1960+)</td></tr>
</tbody></table>

<h3>Age in Different Contexts</h3>
<p><strong>Biological vs Chronological Age:</strong> Your chronological age is simply calendar time since birth. Your biological (physiological) age is determined by health markers — telomere length, cardiovascular fitness, metabolic health. People with healthy lifestyles can have a biological age 5-10 years younger than their chronological age.</p>
<p><strong>East Asian Age Reckoning:</strong> In Korea and historically in other East Asian cultures, babies are born at age 1 (the year of gestation counts). Under this system, your Korean age is typically your Western age plus 1 (or 2 if haven't had your birthday yet). South Korea officially abolished this system in 2023, standardizing to international age calculation.</p>
<p><strong>Legal Age in India:</strong> Age of majority is 18. The Child Labour Act prohibits employing children under 14 in hazardous occupations. Age of consent is 18. Marriage age is 18 (women) and 21 (men), though proposed legislation would equalize both to 21.</p>

<h3>Fun Age Facts — Putting Time in Perspective</h3>
<ul>
<li>At age 30, you've lived approximately <strong>10,950 days</strong> or <strong>262,800 hours</strong></li>
<li>Your heart beats approximately <strong>100,000 times per day</strong> — by age 30, that's 1.09 billion beats</li>
<li>The human brain isn't fully mature until approximately <strong>age 25</strong> (prefrontal cortex development)</li>
<li>Life expectancy in the US (2024): 76.4 years overall, 79.3 for women, 73.5 for men (CDC)</li>
</ul>

<h3>References</h3>
<ul>
<li>CDC National Center for Health Statistics — Life expectancy data</li>
<li>Social Security Administration — Retirement age tables</li>
<li>Uniform Gifts to Minors Act (UGMA) and state age of majority laws</li>
</ul>`
);

console.log("\n✅ All 8 content patches complete. Run: npx tsc --noEmit\n");

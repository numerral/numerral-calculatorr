/**
 * enrich_interest_trio.cjs — Patches the 3 remaining thin interest calculators
 */
const fs = require("fs");

function patch(file, id, richHTML) {
  if (!fs.existsSync(file)) { console.warn("MISSING:", file); return; }
  let src = fs.readFileSync(file, "utf8");
  const marker = '"' + id + '"';
  const idx = src.indexOf(marker);
  if (idx === -1) { console.warn("NOT FOUND:", id); return; }
  const blockEnd = src.indexOf('\n    "', idx + marker.length + 5);
  const existingBlock = src.slice(idx, blockEnd > idx ? blockEnd : idx + 6000);
  const hasContentHTML = /contentHTML:\s*`/.test(existingBlock);
  if (hasContentHTML) {
    const htmlStart = src.indexOf("contentHTML: `", idx);
    let i = htmlStart + "contentHTML: `".length;
    while (i < src.length && src[i] !== "`") i++;
    src = src.slice(0, htmlStart) + "contentHTML: `" + richHTML + "`" + src.slice(i + 1);
    console.log("✅ Replaced:", id);
  } else {
    const insertAt = existingBlock.search(/\n\s*(faq:|steps:|comparison:|insight:|}\s*[,;])/);
    if (insertAt === -1) { console.warn("No insert point for", id); return; }
    const absInsert = idx + insertAt;
    src = src.slice(0, absInsert) + "\n        contentHTML: `" + richHTML + "`,\n" + src.slice(absInsert);
    console.log("✅ Inserted:", id);
  }
  fs.writeFileSync(file, src, "utf8");
}

const FILE = "app/loan-calculators/[calculator]/page.tsx";

patch(FILE, "daily-compound-interest-calculator", `<h2>What is Daily Compound Interest?</h2>
<p>Daily compound interest is interest calculated and added to your balance <strong>every single day</strong> — 365 times per year. Each day, you earn interest not just on your original principal, but on all the interest previously earned. Over time, this compounding effect creates exponential growth that far exceeds simple interest or even monthly compounding.</p>

<h3>The Daily Compound Interest Formula</h3>
<div class="explanation__highlight">
<strong>A = P × (1 + r/365)^(365 × t)</strong><br/><br/>
A = Final amount | P = Principal | r = Annual interest rate (decimal) | t = Time in years<br/><br/>
<strong>Example:</strong> $10,000 at 5% annual rate, compounded daily, for 10 years:<br/>
A = $10,000 × (1 + 0.05/365)^3,650 = $10,000 × 1.6487 = <strong>$16,487</strong><br/>
Interest earned: $6,487 (vs $5,000 with simple interest — 30% more)
</div>

<h3>Daily vs Monthly vs Annual Compounding</h3>
<table><thead><tr><th>Compounding Frequency</th><th>$10,000 at 5% after 10 years</th><th>Effective APY</th></tr></thead><tbody>
<tr><td>Annual</td><td>$16,288.95</td><td>5.000%</td></tr>
<tr><td>Quarterly</td><td>$16,436.19</td><td>5.095%</td></tr>
<tr><td>Monthly</td><td>$16,470.09</td><td>5.116%</td></tr>
<tr><td><strong>Daily</strong></td><td><strong>$16,487.21</strong></td><td><strong>5.127%</strong></td></tr>
<tr><td>Continuous</td><td>$16,487.21</td><td>5.127%</td></tr>
</tbody></table>
<p>The difference between daily and monthly compounding is small for savings accounts, but on large balances or long time horizons, even basis-point differences become meaningful.</p>

<h3>Where Daily Compounding Matters Most</h3>
<ul>
<li><strong>Credit cards:</strong> Most US credit cards compound daily. A 20% APR card has an effective APY of 22.13% — costing you significantly more than the headline rate suggests</li>
<li><strong>High-yield savings accounts and CDs:</strong> Most premium savings accounts and online banks use daily compounding, giving you a slight edge over traditional monthly-compounding accounts</li>
<li><strong>Money market accounts:</strong> Typically compound daily, making it important to compare APY (which accounts for compounding) rather than APR</li>
<li><strong>Margin and brokerage loans:</strong> Typically compound daily — can erode returns significantly if positions are held long-term</li>
</ul>

<h3>The Rule of 72 — Quick Doubling Time Estimate</h3>
<p>Divide 72 by your interest rate to estimate how many years it takes to double your money:</p>
<ul>
<li>5% rate → 72/5 = <strong>~14.4 years</strong> to double</li>
<li>7% rate → 72/7 = <strong>~10.3 years</strong></li>
<li>10% rate → 72/10 = <strong>~7.2 years</strong></li>
<li>12% rate → 72/12 = <strong>~6 years</strong></li>
</ul>

<h3>References</h3>
<ul>
<li>Federal Reserve — Truth in Lending Act: compounding disclosure requirements</li>
<li>Federal Truth in Savings Act — APY calculation mandate (12 CFR Part 1030)</li>
</ul>`);

patch(FILE, "interest-calculator", `<h2>Simple Interest vs Compound Interest — Choosing the Right Formula</h2>
<p>Interest calculations are at the heart of every loan, savings account, and investment decision. The two fundamental methods — <strong>simple interest</strong> and <strong>compound interest</strong> — produce dramatically different outcomes over time. Understanding which applies to your situation determines how you calculate costs and returns accurately.</p>

<h3>Simple Interest Formula</h3>
<div class="explanation__highlight">
<strong>I = P × r × t</strong>&nbsp;&nbsp; (Interest = Principal × Rate × Time)<br/>
<strong>A = P + I = P × (1 + r × t)</strong><br/><br/>
<strong>Example:</strong> $5,000 at 6% per year for 3 years:<br/>
I = $5,000 × 0.06 × 3 = <strong>$900</strong><br/>
Total amount = $5,000 + $900 = <strong>$5,900</strong>
</div>

<h3>Compound Interest Formula</h3>
<div class="explanation__highlight">
<strong>A = P × (1 + r/n)^(n×t)</strong><br/><br/>
A = Amount | P = Principal | r = Annual rate | n = Compounding periods/year | t = Years<br/><br/>
<strong>Example:</strong> $5,000 at 6% compounded monthly for 3 years:<br/>
A = $5,000 × (1 + 0.06/12)^36 = $5,000 × 1.19668 = <strong>$5,983</strong><br/>
Interest = $5,983 − $5,000 = <strong>$983</strong> (vs $900 simple — 9.2% more)
</div>

<h3>Where Each Method Applies in Real Life</h3>
<table><thead><tr><th>Financial Product</th><th>Interest Method</th><th>Notes</th></tr></thead><tbody>
<tr><td>Personal loans (India)</td><td>Reducing balance (compound)</td><td>EMI structure</td></tr>
<tr><td>Fixed deposits</td><td>Compound (quarterly)</td><td>TDS deducted on interest at source</td></tr>
<tr><td>Savings accounts</td><td>Compound (quarterly or monthly)</td><td>Interest credited to account</td></tr>
<tr><td>Microfinance loans</td><td>Often flat (simple)</td><td>Watch for flat vs reducing rate difference</td></tr>
<tr><td>US mortgages</td><td>Monthly compound (amortized)</td><td>30-day interest accrual cycle</td></tr>
<tr><td>US savings/CDs</td><td>Daily compound</td><td>APY standardizes comparisons</td></tr>
<tr><td>Government bonds (US)</td><td>Semi-annual simple</td><td>Coupon paid every 6 months</td></tr>
</tbody></table>

<h3>The Flat Rate vs Reducing Balance Trap</h3>
<p>Many lenders in India (especially for vehicle and consumer durables loans) quote a <strong>flat rate</strong> that looks low but is actually very expensive:</p>
<div class="explanation__highlight">
<strong>Flat rate:</strong> Interest calculated on the original principal for the entire tenure<br/>
<strong>Reducing balance:</strong> Interest calculated on outstanding amount each month (standard EMI)<br/><br/>
<strong>Flat 8% ≈ Reducing 14.5-15%</strong> — nearly double the effective cost!<br/><br/>
₹5L loan, 48 months:<br/>
Flat 8%: Total interest = ₹5L × 8% × 4 = ₹1,60,000<br/>
Reducing 8%: Total interest = ₹85,000 (nearly half)
</div>

<h3>Inflation-Adjusted Real Returns</h3>
<p>Nominal interest rate doesn't account for inflation. To find the <strong>real interest rate</strong> (purchasing power growth):</p>
<div class="explanation__highlight"><strong>Real Rate ≈ Nominal Rate − Inflation Rate</strong><br/>If your FD earns 6.8% and inflation is 5.1%, your real return is just <strong>1.7%</strong></div>

<h3>References</h3>
<ul>
<li>Reserve Bank of India — Master Direction on Interest Rate Policy</li>
<li>Securities and Exchange Board of India (SEBI) — Investment return disclosure standards</li>
<li>Federal Reserve — Consumer protection and disclosure rules</li>
</ul>`);

patch(FILE, "interest-rate-calc", `<h2>How to Calculate the Interest Rate on a Loan</h2>
<p>Sometimes you know your loan amount, monthly payment, and tenure — but need to find the <strong>effective annual interest rate</strong>. This reverse calculation is essential when evaluating loan offers, understanding true credit card costs, or auditing a lender's quoted rate. This calculator uses iterative numerical methods (binary search) to solve the interest rate equation accurately.</p>

<h3>The Mathematics of Rate Discovery</h3>
<p>The standard EMI formula is:</p>
<div class="explanation__highlight">
<strong>EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)</strong><br/><br/>
Where P = Principal, r = monthly rate, n = months<br/><br/>
Finding 'r' given EMI, P, and n has no closed-form algebraic solution — it requires iterative approximation (Newton-Raphson or binary search).
</div>

<h3>Step-by-Step: Finding the Rate</h3>
<p>Our calculator solves this iteratively with 100+ iterations for accuracy within ±0.001%. Here's the manual approach:</p>
<ol>
<li><strong>Start with a guess:</strong> Try r = EMI × n / P / n (flat rate approximation)</li>
<li><strong>Calculate EMI from your guess:</strong> Apply the EMI formula</li>
<li><strong>Compare to actual EMI:</strong> If calculated EMI &gt; actual, rate is too high; if lower, rate is too low</li>
<li><strong>Bisect and repeat:</strong> Narrow the range with each iteration until convergence</li>
</ol>

<h3>Flat Rate vs Reducing Balance — The Hidden Cost</h3>
<table><thead><tr><th>Quoted Rate</th><th>Type</th><th>Effective Reducing Rate</th><th>You Really Pay</th></tr></thead><tbody>
<tr><td>8% flat</td><td>Flat</td><td>~14.5%</td><td>81% more than stated</td></tr>
<tr><td>10% flat</td><td>Flat</td><td>~18.2%</td><td>82% more than stated</td></tr>
<tr><td>12% flat</td><td>Flat</td><td>~21.5%</td><td>79% more than stated</td></tr>
<tr><td>8% reducing</td><td>Reducing</td><td>8.00%</td><td>Accurate</td></tr>
</tbody></table>
<div class="explanation__highlight"><strong>Real example:</strong> Car dealer quotes "8% flat, 48 months" on ₹5L loan → EMI = ₹14,583.<br/>Plug this EMI into our rate calculator → Effective reducing rate = <strong>14.8%</strong>, not 8%.</div>

<h3>APR (Annual Percentage Rate) — The US Standard</h3>
<p>In the United States, the Truth in Lending Act (TILA) requires lenders to disclose the <strong>Annual Percentage Rate (APR)</strong> — which includes both the interest rate AND lender fees (origination fees, points, broker fees). This makes APR a better apples-to-apples comparison than the quoted note rate:</p>
<ul>
<li><strong>Mortgage note rate 6.5% + 1% origination fee → APR ≈ 6.75%</strong></li>
<li>When comparing mortgages: always compare APRs, not note rates</li>
<li>For short-term loans held less than the full term, the APR is less useful — calculate your total cost instead</li>
</ul>

<h3>Credit Card Effective Rate</h3>
<p>Credit card APR uses daily compounding, making the effective cost higher.</p>
<div class="explanation__highlight">Credit card at 20% APR (daily compounding):<br/>Daily rate = 20%/365 = 0.0548%<br/>Effective APY = (1 + 0.20/365)^365 − 1 = <strong>22.13%</strong><br/>On $5,000 balance for 1 year: True interest cost = $1,107 (not $1,000)</div>

<h3>References</h3>
<ul>
<li>Truth in Lending Act (TILA) — Regulation Z, 12 CFR Part 1026</li>
<li>Reserve Bank of India — Circular on Fair Practice Code for Lenders</li>
<li>Consumer Financial Protection Bureau (CFPB) — Rate comparison tools</li>
</ul>`);

console.log("\n✅ Interest trio patched. Run: node check_thin.cjs && npx tsc --noEmit\n");

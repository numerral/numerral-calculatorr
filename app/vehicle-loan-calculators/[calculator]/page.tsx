// Dynamic Hub — /vehicle-loan-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import VehicleCalculatorCore from "@/components/calculator/VehicleCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("vehicle").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("vehicle").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/vehicle-loan-calculators/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; contentHTML: string; faq?: { question: string; answer: string }[] }> = {
    "auto-loan-calculator": {
        subtitle: "Calculate your monthly auto loan payment including trade-in value, down payment, sales tax, and extended warranty. Compare loan terms from 36 to 84 months for new and used vehicles.",
        contentHTML: `<h2>How to Calculate an Auto Loan Payment</h2>
<p>An auto loan payment is calculated using the <strong>standard amortizing loan formula (PMT)</strong> — the same formula used by every bank and credit union in the United States:</p>
<div class="explanation__highlight"><strong>PMT = P × r × (1 + r)<sup>n</sup> / [(1 + r)<sup>n</sup> − 1]</strong><br/><br/>Where: P = loan amount, r = monthly interest rate (APR/12), n = number of monthly payments</div>

<h3>Step 1: Determine the Loan Amount</h3>
<p>Your loan amount starts with the <strong>vehicle price</strong> (after negotiation) plus any add-ons — extended warranty, GAP insurance, accessories. Then add <strong>sales tax</strong> (varies by state, 0%–10.25%). Subtract your <strong>trade-in value</strong> and <strong>down payment</strong> to get the net loan amount.</p>

<h3>Step 2: Understand Interest Rates</h3>
<p>Auto loan interest rates depend on your <strong>credit score, loan term, new vs. used, and the lender</strong>. As of 2026:</p>
<table><thead><tr><th>Credit Score</th><th>New Car APR</th><th>Used Car APR</th></tr></thead><tbody>
<tr><td>Excellent (750+)</td><td>4.5%–6.0%</td><td>5.5%–7.5%</td></tr>
<tr><td>Good (700–749)</td><td>6.0%–8.0%</td><td>7.5%–10.0%</td></tr>
<tr><td>Fair (650–699)</td><td>8.0%–12.0%</td><td>10.0%–15.0%</td></tr>
<tr><td>Poor (below 650)</td><td>12.0%–18.0%</td><td>15.0%–22.0%</td></tr>
</tbody></table>

<h3>Worked Example</h3>
<p>$35,000 new car, $5,000 down, 7% sales tax, 6.5% APR, 60 months:</p>
<ul>
<li>Subtotal with tax: $35,000 × 1.07 = $37,450</li>
<li>Loan amount: $37,450 − $5,000 = $32,450</li>
<li>Monthly payment: <strong>$634/mo</strong></li>
<li>Total interest: <strong>$5,613</strong></li>
<li>Total cost: <strong>$43,063</strong></li>
</ul>

<h3>The Benefits of Auto Loans</h3>
<ul>
<li>Spread the cost of a vehicle over time — preserving your savings</li>
<li>Build credit history with on-time payments</li>
<li>You own the car at payoff — no mileage restrictions</li>
<li>0% APR promotions from manufacturers can make financing free</li>
</ul>

<h3>The Hidden Costs of Car Ownership</h3>
<p>Your monthly payment is only part of the total cost. US car owners should budget for:</p>
<ul>
<li><strong>Insurance:</strong> average $1,771/year ($148/mo) — varies dramatically by state</li>
<li><strong>Fuel:</strong> average $150–$300/month depending on vehicle and driving</li>
<li><strong>Maintenance:</strong> $100–$200/month (oil changes, tires, brakes, inspections)</li>
<li><strong>Registration & fees:</strong> $100–$500/year depending on state</li>
<li><strong>Depreciation:</strong> new cars lose 20% in year 1, ~60% over 5 years</li>
</ul>`,
        faq: [
            { question: "What is a good monthly car payment?", answer: "Financial experts recommend your total car costs (payment + insurance + fuel + maintenance) should not exceed 15–20% of your gross monthly income. For a $60,000 salary, that's $750–$1,000/month total — so your payment alone should be $400–$600." },
            { question: "Is it better to get a 48-month or 60-month auto loan?", answer: "A 48-month loan has higher monthly payments but saves significantly on interest. On a $30,000 loan at 6.5% APR, a 48-month loan costs $4,087 in interest vs. $5,138 for 60 months — saving $1,051." },
            { question: "Should I trade in my car or sell it privately?", answer: "Private sales typically yield 15–25% more than trade-in. However, trading in is easier and may reduce sales tax in some states (you only pay tax on the price difference). Check your state's trade-in tax credit rules." },
            { question: "What other costs should I consider with an auto loan?", answer: "Beyond the payment: insurance, fuel, maintenance, registration, property tax (in some states), parking, tolls, and depreciation. The AAA estimates total ownership cost of a new car at $12,182/year." },
        ],
    },
    "car-lease-calculator": {
        subtitle: "Calculate your monthly lease payment using MSRP, negotiated price, residual value, money factor, and down payment. Understand the true cost of leasing a vehicle.",
        contentHTML: `<h2>How to Calculate a Car Lease Payment</h2>
<p>A lease payment has two main components: the <strong>depreciation charge</strong> (paying for how much value the car loses during your lease) and the <strong>finance charge</strong> (the cost of borrowing, similar to interest on a loan).</p>

<h3>Lease Terminology</h3>
<table><thead><tr><th>Term</th><th>Definition</th></tr></thead><tbody>
<tr><td><strong>MSRP</strong></td><td>Manufacturer's Suggested Retail Price (sticker price)</td></tr>
<tr><td><strong>Capitalized Cost</strong></td><td>Negotiated price minus any down payment or trade-in</td></tr>
<tr><td><strong>Residual Value</strong></td><td>Predicted value at lease end (% of MSRP, set by the manufacturer)</td></tr>
<tr><td><strong>Money Factor</strong></td><td>Lease interest rate expressed as a decimal (multiply by 2,400 to get APR equivalent)</td></tr>
<tr><td><strong>Cap Cost Reduction</strong></td><td>Down payment + trade-in that reduces the capitalized cost</td></tr>
</tbody></table>

<h3>The Lease Payment Formula</h3>
<div class="explanation__highlight">
<strong>Depreciation/mo = (Cap Cost − Residual) / Term</strong><br/>
<strong>Finance Charge/mo = (Cap Cost + Residual) × Money Factor</strong><br/>
<strong>Monthly Payment = (Depreciation + Finance) × (1 + Tax Rate)</strong>
</div>

<h3>Worked Example</h3>
<p>$40,000 MSRP, negotiated to $38,000, $3,000 down, 55% residual, 0.0025 money factor, 36 months, 7% tax:</p>
<ul>
<li>Cap cost: $38,000 − $3,000 = $35,000</li>
<li>Residual: $40,000 × 55% = $22,000</li>
<li>Depreciation: ($35,000 − $22,000) / 36 = $361/mo</li>
<li>Finance: ($35,000 + $22,000) × 0.0025 = $143/mo</li>
<li>Pre-tax: $504/mo</li>
<li>Monthly with 7% tax: <strong>$539/mo</strong></li>
</ul>

<h3>Tips for Getting the Best Lease Deal</h3>
<ul>
<li><strong>Negotiate the capitalized cost</strong> — just like buying, you can negotiate the price</li>
<li><strong>Look for high-residual vehicles</strong> — Honda, Toyota, and Lexus hold value best</li>
<li><strong>Shop for low money factors</strong> — manufacturer-subsidized leases often offer 0.0010–0.0015</li>
<li><strong>Match your mileage</strong> — excess mileage fees are $0.15–$0.25 per mile</li>
<li><strong>Avoid excessive down payment</strong> — if the car is totaled, you lose your down payment (unlike a loan)</li>
</ul>`,
        faq: [
            { question: "What is a money factor and how do I convert it to APR?", answer: "Money factor is the lease equivalent of an interest rate. Multiply by 2,400 to get the APR equivalent. A money factor of 0.0025 = 6.0% APR. Lower money factors mean lower lease costs." },
            { question: "Is it smart to put money down on a lease?", answer: "Generally no — unlike a loan, if your leased car is totaled or stolen in month 1, your down payment is gone (insurance pays the leasing company). Instead, negotiate a lower capitalized cost. Only put money down if it significantly lowers your monthly payment and you're comfortable with the risk." },
            { question: "What happens at the end of a car lease?", answer: "You have three options: 1) Return the car (pay any excess mileage or wear fees), 2) Buy the car at the predetermined residual value, 3) Trade it in toward a new lease or purchase. If the car is worth more than the residual, buying it can be a great deal." },
            { question: "What is a good residual value for a lease?", answer: "Higher residual = lower monthly payment. A residual of 55%+ after 36 months is excellent (Honda, Toyota, Lexus). Luxury vehicles often have 50%–55%. Vehicles with poor residuals (under 45%) are expensive to lease." },
        ],
    },
    "lease-vs-buy-calculator": {
        subtitle: "Compare the total cost of leasing vs. buying a car side by side. See monthly payments, total expenditure, and which option saves you more over the same period.",
        contentHTML: `<h2>Lease vs. Buy: How to Compare</h2>
<p>The lease vs. buy decision comes down to your financial priorities, driving habits, and how long you plan to keep the vehicle. This calculator gives you a direct <strong>side-by-side comparison</strong> of total costs over the same time period.</p>

<h3>Key Factors to Compare</h3>
<table><thead><tr><th>Factor</th><th>Lease</th><th>Buy</th></tr></thead><tbody>
<tr><td>Monthly Payment</td><td>Lower (you pay for depreciation only)</td><td>Higher (you pay for the entire vehicle)</td></tr>
<tr><td>Ownership at End</td><td>You return the car</td><td>You own the car outright</td></tr>
<tr><td>Mileage</td><td>Limited (10,000–15,000/year)</td><td>Unlimited</td></tr>
<tr><td>Maintenance</td><td>Usually under warranty</td><td>Your responsibility after warranty</td></tr>
<tr><td>Customization</td><td>Not allowed</td><td>Complete freedom</td></tr>
<tr><td>Tax Advantage</td><td>Tax on monthly payment only (in many states)</td><td>Tax on full purchase price</td></tr>
<tr><td>Equity Building</td><td>None</td><td>Yes — car becomes an asset</td></tr>
</tbody></table>

<h3>When Leasing Makes Sense</h3>
<ul>
<li>You drive fewer than 12,000 miles/year</li>
<li>You prefer a new car every 2–3 years</li>
<li>You want lower monthly payments</li>
<li>You use the vehicle for business (tax deduction benefits)</li>
</ul>

<h3>When Buying Makes Sense</h3>
<ul>
<li>You drive 15,000+ miles/year</li>
<li>You plan to keep the car 5+ years</li>
<li>You want to build equity</li>
<li>You want freedom to modify the vehicle</li>
</ul>

<h3>The True Cost Comparison</h3>
<p>Over 10 years: a buyer who keeps a $40,000 car for 10 years after a 5-year loan spends approximately <strong>$50,000 total</strong> (price + interest − resale). A leaser paying $450/mo for the same 10 years spends <strong>$54,000</strong> with no car to show at the end.</p>`,
        faq: [
            { question: "Is leasing a car a waste of money?", answer: "Not necessarily. Leasing is a cost-efficient way to drive a new vehicle with lower monthly payments and zero repair costs (warranty coverage). It's 'wasteful' only if you compare it to keeping a purchased car for 8–10 years, which maximizes ownership value." },
            { question: "What percentage of Americans lease vs. buy?", answer: "Approximately 20–25% of new vehicle transactions in the US are leases. The rate is higher for luxury brands (BMW, Mercedes, Lexus) where 40–50% of customers lease." },
            { question: "Can I negotiate a lease like a purchase?", answer: "Yes! The capitalized cost (vehicle price) is negotiable, just like buying. You can also negotiate the money factor and ask about manufacturer lease incentives. Always compare offers from multiple dealerships." },
        ],
    },
    "boat-loan-calculator": {
        subtitle: "Calculate your monthly boat loan payment including sales tax, trade-in, and down payment. See total interest cost and amortization for marine financing from 2 to 20 years.",
        contentHTML: `<h2>How to Calculate Boat Loan Payments</h2>
<p>Boat loans work like auto loans — they use the same <strong>standard amortization formula (PMT)</strong>. However, boat financing has some key differences: <strong>longer terms (up to 20 years)</strong> for larger vessels, higher interest rates, and significant additional ownership costs.</p>

<h3>Step-by-Step Boat Loan Calculation</h3>
<ol>
<li><strong>Determine the loan amount</strong> — boat price + accessories + trailer + taxes − trade-in − down payment</li>
<li><strong>Find the interest rate</strong> — typically 6%–9% for new boats, 8%–12% for used. Credit score matters significantly.</li>
<li><strong>Choose the loan term</strong> — 2–7 years for boats under $25,000; up to 15–20 years for boats over $100,000</li>
<li><strong>Calculate with the PMT formula</strong> — or use the calculator above</li>
<li><strong>Budget for ownership costs</strong> — see below</li>
</ol>

<h3>The True Cost of Boat Ownership</h3>
<p>The boat loan payment is just the start. The <strong>"10% Rule"</strong> estimates annual ownership costs at ~10% of the boat's value:</p>
<table><thead><tr><th>Cost</th><th>Annual Estimate</th></tr></thead><tbody>
<tr><td>Insurance</td><td>$300–$1,000+</td></tr>
<tr><td>Storage/Marina Slip</td><td>$1,200–$6,000</td></tr>
<tr><td>Fuel</td><td>$500–$3,000</td></tr>
<tr><td>Maintenance & Repairs</td><td>$500–$2,000</td></tr>
<tr><td>Winterization</td><td>$200–$500</td></tr>
<tr><td>Registration & License</td><td>$50–$300</td></tr>
<tr><td>Safety Equipment</td><td>$100–$500 (initial)</td></tr>
</tbody></table>

<h3>Worked Example</h3>
<p>$25,000 boat, 7% tax, $2,500 down, 7.5% APR, 60 months:</p>
<ul>
<li>With tax: $26,750 − $2,500 = $24,250 loan</li>
<li>Monthly payment: <strong>$486/mo</strong></li>
<li>Total interest: <strong>$4,919</strong></li>
</ul>`,
        faq: [
            { question: "What credit score do I need for a boat loan?", answer: "Most marine lenders require a minimum credit score of 650–680. For the best rates (under 7%), you'll need 750+. Some lenders offer financing for scores as low as 580 but at significantly higher rates (12%+)." },
            { question: "How long can I finance a boat?", answer: "Loan terms vary by boat value: under $25,000 (2–7 years), $25,000–$100,000 (7–15 years), over $100,000 (15–20 years). Longer terms mean lower payments but more total interest." },
            { question: "Do boats hold their value?", answer: "Boats depreciate similarly to cars — roughly 20% in the first year and 30–40% over 5 years. Well-maintained boats from premium brands (Boston Whaler, Grady-White) hold value better." },
        ],
    },
    "motorcycle-loan-calculator": {
        subtitle: "Calculate your monthly motorcycle payment including trade-in, down payment, and sales tax. Find the best loan term for new or used bike financing.",
        contentHTML: `<h2>How to Calculate Motorcycle Loan Payments</h2>
<p>Motorcycle loans use the same <strong>amortization formula</strong> as auto loans but typically have shorter terms and slightly higher interest rates due to the higher risk profile of motorcycles.</p>

<h3>Motorcycle Loan Rates (2026)</h3>
<table><thead><tr><th>Credit Score</th><th>New Bike APR</th><th>Used Bike APR</th></tr></thead><tbody>
<tr><td>Excellent (750+)</td><td>4.5%–7.0%</td><td>6.0%–9.0%</td></tr>
<tr><td>Good (700–749)</td><td>7.0%–10.0%</td><td>9.0%–13.0%</td></tr>
<tr><td>Fair (650–699)</td><td>10.0%–15.0%</td><td>13.0%–18.0%</td></tr>
</tbody></table>

<h3>Total Cost of Motorcycle Ownership</h3>
<ul>
<li><strong>Insurance:</strong> $500–$2,000/year (younger riders and sport bikes cost more)</li>
<li><strong>Gear:</strong> $500–$2,000 initial (helmet, jacket, gloves, boots — DOT-certified helmet required in most states)</li>
<li><strong>Maintenance:</strong> $300–$800/year (oil changes, tires, chain, brakes)</li>
<li><strong>Registration:</strong> $50–$200/year depending on state</li>
<li><strong>MSF Course:</strong> $250–$400 (recommended; may lower insurance)</li>
</ul>

<h3>Worked Example</h3>
<p>$15,000 motorcycle, $2,000 down, 7% tax, 7% APR, 48 months:</p>
<ul>
<li>With tax: $16,050 − $2,000 = $14,050 loan</li>
<li>Monthly payment: <strong>$337/mo</strong></li>
<li>Total interest: <strong>$2,135</strong></li>
</ul>`,
        faq: [
            { question: "What types of motorcycle loans are available?", answer: "Secured loans (bike as collateral, lower rates), unsecured personal loans (higher rates, no collateral), dealer financing (convenient but shop around), and credit union loans (often the best rates)." },
            { question: "How can I get a lower motorcycle loan rate?", answer: "Improve your credit score before applying, make a larger down payment (20%+), choose a shorter loan term, get pre-approved from a credit union, and comparison shop at least 3 lenders." },
            { question: "Is motorcycle insurance expensive?", answer: "It varies widely. A 25-year-old male on a sport bike might pay $2,000+/year. A 40-year-old on a cruiser might pay $500/year. Completing the MSF safety course can reduce premiums by 10–20%." },
        ],
    },
    "rv-loan-calculator": {
        subtitle: "Calculate your monthly payment for an RV, camper, or motorhome loan. Compare terms from 5 to 20 years and see total interest with amortization schedule.",
        contentHTML: `<h2>How to Calculate RV Loan Payments</h2>
<p>RV loans can extend up to <strong>20 years</strong> for higher-value units, making them more similar to mortgage financing than auto loans. The same PMT formula applies, but the longer terms and larger amounts create unique financing considerations.</p>

<h3>RV Loan Tiers</h3>
<table><thead><tr><th>Loan Amount</th><th>Max Term</th><th>Typical APR</th></tr></thead><tbody>
<tr><td>Under $25,000</td><td>7–10 years</td><td>7%–12%</td></tr>
<tr><td>$25,000–$75,000</td><td>10–15 years</td><td>6%–9%</td></tr>
<tr><td>$75,000–$150,000</td><td>15–20 years</td><td>5%–8%</td></tr>
<tr><td>Over $150,000</td><td>15–20 years</td><td>5%–7%</td></tr>
</tbody></table>
<p>New RVs typically qualify for lower rates than used. Credit unions and marine/RV specialty lenders often offer better rates than banks.</p>

<h3>RV Ownership Costs Beyond the Payment</h3>
<ul>
<li><strong>Insurance:</strong> $1,000–$3,000/year for full coverage</li>
<li><strong>Storage:</strong> $100–$400/month if you don't have space at home</li>
<li><strong>Fuel:</strong> Class A motorhomes average 6–10 MPG; Class C 10–14 MPG</li>
<li><strong>Campground fees:</strong> $30–$80/night (RV parks), $500–$1,500/month (seasonal)</li>
<li><strong>Maintenance:</strong> $1,000–$3,000/year (tires, engine, generator, roof sealing)</li>
<li><strong>Winterization:</strong> $150–$500 annually in cold climates</li>
</ul>

<h3>Worked Example</h3>
<p>$45,000 used RV, 7% sales tax, $5,000 down, 6.5% APR, 10-year (120-month) term:</p>
<ul>
<li>With tax: $48,150 − $5,000 = $43,150 loan</li>
<li>Monthly payment: <strong>$490/mo</strong></li>
<li>Total interest: <strong>$15,656</strong></li>
<li>Total cost: <strong>$63,806</strong></li>
</ul>

<h3>Tips for Getting the Best RV Loan</h3>
<ul>
<li>Get pre-approved from multiple lenders before visiting a dealer</li>
<li>Credit unions often beat dealer financing by 1–2%</li>
<li>Negotiate the RV price separately from the financing</li>
<li>Consider a shorter term — the interest savings on a 10-year vs. 20-year loan can be $20,000+</li>
</ul>`,
        faq: [
            { question: "Can I use an RV loan for a camper van?", answer: "Yes — RV loans cover motorhomes (Class A, B, C), travel trailers, fifth wheels, pop-up campers, and camper vans. Some lenders may classify smaller units under personal or auto loans." },
            { question: "Is new or used better for an RV?", answer: "Used RVs are often better value because new RVs depreciate 20–30% in the first year. A 2–3 year old used RV with low miles can save $15,000–$30,000 over new. However, new RVs come with full warranty coverage." },
            { question: "Can an RV be tax deductible?", answer: "If your RV has sleeping, cooking, and bathroom facilities, it may qualify as a second home for mortgage interest deduction purposes. Consult a tax advisor for your specific situation." },
        ],
    },
    "atv-loan-calculator": {
        subtitle: "Calculate your monthly ATV or UTV loan payment. Enter price, down payment, interest rate, and loan term to find your payment and total financing cost.",
        contentHTML: `<h2>How to Calculate ATV Loan Payments</h2>
<p>ATV and UTV loans use the same <strong>amortization formula</strong> as auto loans. These are typically smaller loans with shorter terms, making the monthly payment more manageable but the interest rate slightly higher due to the recreational nature of the purchase.</p>

<h3>ATV Financing Options</h3>
<ul>
<li><strong>Dealer financing</strong> — convenient but often higher rates; watch for 0% promotional offers</li>
<li><strong>Credit union loans</strong> — typically best rates for powersports</li>
<li><strong>Personal loans</strong> — unsecured, higher rates but no collateral required</li>
<li><strong>Home equity line</strong> — low rates but your home is collateral (risky for a recreational purchase)</li>
</ul>

<h3>ATV Ownership Costs</h3>
<table><thead><tr><th>Cost</th><th>Annual Estimate</th></tr></thead><tbody>
<tr><td>Insurance</td><td>$200–$600</td></tr>
<tr><td>Registration</td><td>$25–$150</td></tr>
<tr><td>Maintenance</td><td>$200–$500</td></tr>
<tr><td>Trailer</td><td>$1,500–$3,000 (one-time)</td></tr>
<tr><td>Riding Gear</td><td>$200–$600 (initial)</td></tr>
<tr><td>Trail Fees/Permits</td><td>$25–$100</td></tr>
</tbody></table>

<h3>Worked Example</h3>
<p>$12,000 ATV, $1,500 down, 7% tax, 8% APR, 48 months:</p>
<ul>
<li>With tax: $12,840 − $1,500 = $11,340 loan</li>
<li>Monthly payment: <strong>$277/mo</strong></li>
<li>Total interest: <strong>$1,959</strong></li>
</ul>`,
        faq: [
            { question: "What is a good interest rate for an ATV loan?", answer: "With good credit (700+), expect 5%–9% from credit unions. Dealer promotions occasionally offer 0%–3.99% on new models. Used ATVs typically carry 8%–15% rates." },
            { question: "How long can I finance an ATV?", answer: "Most ATV loans range from 24 to 72 months. For ATVs under $10,000, 36–48 months is typical. Larger UTVs ($15,000+) may qualify for 60–72 month terms." },
            { question: "Do I need insurance for an ATV?", answer: "Requirements vary by state. Even where not required, liability coverage ($50–$100/year) is strongly recommended. Comprehensive coverage protects against theft and damage. Check your state's off-road vehicle insurance laws." },
        ],
    },
};

export default async function VehicleCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("vehicle").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/vehicle-loan-calculators/${calc.slug}`);
    const schemas: object[] = [
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Vehicle Loan Calculators", url: canonicalUrl("/vehicle-loan-calculators") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl, "USD", "FinanceApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-vehicle-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Vehicle Loan Calculators", href: "/vehicle-loan-calculators" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <AuthorBadge categoryKey="vehicle" />
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <VehicleCalculatorCore calcType={calc.calcType || "autoLoan"} defaults={calc.defaults || {}} sliderRanges={calc.sliderRanges} />
                    {content && (<>
                        <DynamicExplanation heading={`How to Use the ${calc.title}`} contentHTML={content.contentHTML} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar"><TrendingCalculations variant="sidebar" /></aside>
            </div>
        </main>
    );
}

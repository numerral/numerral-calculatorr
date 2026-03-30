// Standalone page — /ksa/rent-affordability-calculator
// KSA Rent Affordability Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Rent Affordability Calculator (KSA) — حاسبة القدرة على تحمل الإيجار",
    description: "Find out how much rent you can afford in Saudi Arabia. Compare rent by city (Riyadh, Jeddah, Dammam), factor in housing allowance & GOSI, and see first-year costs including Ejar fees.",
    keywords: ["rent affordability calculator Saudi Arabia", "حاسبة القدرة على تحمل الإيجار", "how much rent can I afford KSA", "Riyadh rent prices 2026", "Jeddah apartment rent", "housing allowance Saudi", "Ejar rental platform", "Riyadh rent freeze", "30 percent rule rent", "Dammam rent cost"],
    alternates: buildCountryAlternates("SA", "/ksa/rent-affordability-calculator", "rent-affordability-calculator"),
};

const FAQ_ITEMS = [
    { question: "How much rent can I afford in Saudi Arabia?", answer: "A widely used guideline is the 30% rule — spend no more than 30% of your gross monthly income on rent. In KSA, this works particularly well because there is no personal income tax, so your gross salary equals your take-home pay. For a SAR 10,000 salary, the maximum affordable rent would be SAR 3,000/month. If you receive a separate housing allowance, add it to your income before applying the rule." },
    { question: "What is the 30% rule for rent?", answer: "The 30% rule states that your monthly rent should not exceed 30% of your gross monthly income. This leaves 70% for other expenses: food, transport, utilities, savings, and debt payments. In Saudi Arabia, since there's no income tax, the 30% applies directly to your salary. Some financial advisors recommend a more conservative 25% for better long-term savings." },
    { question: "What is a housing allowance in KSA?", answer: "A housing allowance (بدل السكن) is a mandatory employment benefit under Saudi Labor Law. Employers must either provide accommodation or a housing allowance in its place. It typically ranges from 20–30% of the basic salary for Saudi employees and up to 50% for some expatriate packages. The amount should be specified in your employment contract." },
    { question: "What is the Ejar platform?", answer: "Ejar (إيجار) is the mandatory electronic rental platform managed by the Real Estate General Authority. Since January 2024, all rental contracts must be registered on Ejar, and all rent payments must be made through Mada or SADAD (biller number 153). An Ejar contract has the legal power of an executive instrument, allowing immediate judicial enforcement through the Execution Court without a separate lawsuit." },
    { question: "What is the Riyadh rent freeze?", answer: "In September 2025, Saudi Arabia implemented a 5-year rent freeze on all residential and commercial properties within Riyadh's defined urban boundary. Annual rent increases are capped at 0–2%. For vacant properties, the rent is fixed at the amount from the last registered Ejar contract. This policy does NOT apply to Jeddah, Dammam, or other cities, where rents may continue to increase." },
    { question: "How much does a 1-bedroom apartment cost in Riyadh?", answer: "As of 2025/2026, a 1-bedroom apartment in Riyadh ranges from SAR 2,500 to SAR 4,800 per month. In premium areas like Al Olaya, Hittin, and KAFD, expect the higher end. More affordable options exist in outer neighborhoods. With the Riyadh rent freeze, prices should remain stable through 2030." },
    { question: "Is it cheaper to rent in Jeddah or Riyadh?", answer: "Generally, Jeddah tends to be slightly cheaper for comparable apartments, with 1-bedroom units ranging SAR 2,000–4,000 vs Riyadh's SAR 2,500–4,800. However, Jeddah does NOT have a rent freeze, so prices may increase 4–6% annually. Riyadh's rent freeze (0–2% cap until 2030) makes it more predictable for budgeting. Dammam/Khobar is the most affordable among the three major cities." },
    { question: "What are typical utility costs in Saudi Arabia?", answer: "Monthly utilities in KSA typically range from SAR 228 to SAR 700, depending on location and season. Summer months see significantly higher electricity bills due to air conditioning. Electricity for residential use costs SAR 18 per kWh up to 6,000 kWh, and SAR 30 above that. Internet costs SAR 66–104/month. Some compounds include utilities in the rent." },
    { question: "Do expats pay income tax on rent in KSA?", answer: "No. Saudi Arabia does not impose personal income tax on individuals — neither on salary, savings interest, nor rental income for personal use. This applies to both Saudi nationals and expatriates. Your gross salary is your net salary, which makes the 30% rent rule straightforward to apply." },
    { question: "How much is an agent/broker fee in Saudi Arabia?", answer: "Real estate agent fees in Saudi Arabia are typically 5% of the annual rent, paid once when signing the lease. For an apartment renting at SAR 3,000/month (SAR 36,000/year), the agent fee would be SAR 1,800. Some landlords absorb this cost, and direct listings through Ejar can help avoid agent fees entirely." },
    { question: "Can foreigners buy property in Saudi Arabia?", answer: "Yes — as of January 2026, new laws allow foreign nationals to purchase residential properties, land, and agricultural farms within designated zones across Saudi Arabia. However, restrictions remain for the holy cities of Makkah and Madinah. This opens a rent-vs-buy consideration for long-term expat residents." },
    { question: "What is compound living in Saudi Arabia?", answer: "Compounds are gated residential communities offering Western-style amenities (pools, gyms, schools, shops) with enhanced security. They are popular with expatriate families. Costs are significantly higher: a 3-bedroom compound villa in North Riyadh costs SAR 180,000–230,000/year (SAR 15,000–19,000/month). More affordable options exist in standalone tower apartments at SAR 80,000–120,000/year." },
    { question: "How does GOSI affect my rent budget?", answer: "GOSI (General Organization for Social Insurance) deducts 9.75% from Saudi employees' salaries (with the employer contributing an additional 11.75%). This reduces your disposable income. For a SAR 10,000 salary, GOSI takes SAR 975, leaving SAR 9,025. Your 30% rent budget should be based on the post-GOSI amount: SAR 2,708 rather than SAR 3,000. Expatriates do not pay the annuities portion, only 1% for occupational hazards (paid by employer)." },
    { question: "Should I rent or buy in KSA?", answer: "It depends on your situation. Renting suits expats on shorter contracts (1–5 years) and those who prefer flexibility. Buying makes sense for long-term Saudi residents who can afford a 10–30% down payment. Consider: a SAR 3,000/month rent = SAR 36,000/year vs mortgage payments on a SAR 500,000 property. Use our Home Loan Calculator to compare mortgage costs and our Savings Goal Calculator to plan your down payment." },
    { question: "What documents do I need to rent in Saudi Arabia?", answer: "To rent, you need: (1) Valid Iqama (residence permit) for expats or National ID for Saudis, (2) Valid work visa, (3) Proof of income or employment letter, (4) Security deposit (typically 1–2 months rent, held by Ejar), (5) Agent fee if applicable (5% of annual rent). The contract must be registered on the Ejar platform. Unmarried couples are prohibited from renting property together." },
];

export default function RentAffordabilityPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Rent Affordability Calculator" },
        ]),
        webAppSchema("Rent Affordability Calculator (KSA)", canonicalUrl("/ksa/rent-affordability-calculator")),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-rent" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Rent Affordability Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Rent Affordability Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Find out how much rent you can afford in Saudi Arabia. Compare prices by city, factor in your housing allowance and GOSI, and see the full first-year cost breakdown — including Ejar fees, security deposit, and utilities.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="rent" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Rent Affordability FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Know your take-home to budget rent</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">GOSI reduces your disposable income</div>
                        </div>
                    </Link>
                    <Link href="/ksa/home-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏠</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Home Loan Calculator</div>
                            <div className="ksa-related-link__desc">Compare buying vs renting costs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/savings-goal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏦</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Savings Goal Calculator</div>
                            <div className="ksa-related-link__desc">Save for your home down payment</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-rent-affordability">What Is a Rent Affordability Calculator?</h2>
    <p>A <strong>rent affordability calculator (حاسبة القدرة على تحمل الإيجار)</strong> helps you determine the maximum amount of rent you should pay based on your income, existing debts, and financial obligations. Instead of guessing, you can make a <strong>data-driven decision</strong> about how much of your salary should go toward housing.</p>
    <p>This is especially important in Saudi Arabia's rapidly evolving housing market, where rental prices have increased by <strong>6–14% year-over-year</strong> in major cities like Riyadh and Jeddah throughout 2024–2025, driven by Vision 2030 development, expatriate demand, and population growth in urban centers.</p>
    <div class="explanation__highlight">
        <strong>Why Use a Rent Calculator for KSA?</strong><br/>
        • Saudi Arabia has <strong>no personal income tax</strong> — your gross salary = your net salary<br/>
        • Housing allowance (بدل السكن) is a <strong>mandatory employment benefit</strong><br/>
        • The <strong>Ejar platform</strong> requires registered contracts with transparent pricing<br/>
        • Riyadh's <strong>5-year rent freeze</strong> (2025) changes affordability calculations<br/>
        • Rent varies dramatically by city — Dammam is 30–40% cheaper than Riyadh
    </div>

    <h2 id="thirty-percent-rule">The 30% Rule Explained for Saudi Arabia</h2>
    <p>The <strong>30% rule</strong> is the most widely recommended rent affordability guideline globally. It states: <strong>spend no more than 30% of your gross monthly income on rent</strong>.</p>
    <p>In Saudi Arabia, this rule works exceptionally well because:</p>
    <ul>
        <li><strong>No income tax</strong> — your gross salary is your net salary (unlike the US, UK, or EU where 20–40% goes to taxes first)</li>
        <li><strong>GOSI is the only deduction</strong> — 9.75% for Saudi employees, minimal for expats — use our <a href="/ksa/gosi-calculator">GOSI Calculator</a> to find your exact deduction</li>
        <li><strong>Housing allowance</strong> is typically included as a separate benefit, effectively increasing your rent budget</li>
    </ul>

    <h3>Affordability % Options</h3>
    <table>
        <thead><tr><th>Rule</th><th>% of Income</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>Conservative (25%)</strong></td><td>25%</td><td>Maximum savings — Vision 2030 alignment, debt-free living</td></tr>
            <tr><td><strong>Standard (30%)</strong></td><td>30%</td><td>Recommended balance between housing quality and savings</td></tr>
            <tr><td><strong>Moderate (35%)</strong></td><td>35%</td><td>Acceptable if low/no other debts</td></tr>
            <tr><td><strong>Stretch (40%)</strong></td><td>40%</td><td>Common for compound living — risky for long-term savings</td></tr>
        </tbody>
    </table>

    <h2 id="worked-examples">How Much Rent Can You Afford? — Worked Examples</h2>

    <h3>Example 1: Expat Earning SAR 7,000/month</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 7,000</td></tr>
            <tr><td>Housing Allowance</td><td>SAR 0 (included in salary)</td></tr>
            <tr><td>GOSI</td><td>No (expat)</td></tr>
            <tr><td>Net Income</td><td>SAR 7,000</td></tr>
            <tr><td><strong>Max Rent (30%)</strong></td><td><strong>SAR 2,100/month</strong></td></tr>
            <tr><td>Best Fit — Riyadh</td><td>Studio (SAR 1,700–3,800) ✅</td></tr>
            <tr><td>Best Fit — Dammam</td><td>1-BR (SAR 1,800–3,500) ✅</td></tr>
            <tr><td>Annual Rent</td><td>SAR 25,200</td></tr>
            <tr><td>Agent Fee (5%)</td><td>SAR 1,260</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/ksa/salary-calculator">Salary Calculator</a> to confirm your exact take-home pay.</p>

    <h3>Example 2: Saudi Employee Earning SAR 15,000 + SAR 3,000 Allowance</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 15,000</td></tr>
            <tr><td>GOSI (9.75%)</td><td>−SAR 1,463</td></tr>
            <tr><td>Net Salary</td><td>SAR 13,537</td></tr>
            <tr><td>Housing Allowance</td><td>+SAR 3,000</td></tr>
            <tr><td>Total Available</td><td>SAR 16,537</td></tr>
            <tr><td><strong>Max Rent (30%)</strong></td><td><strong>SAR 4,961/month</strong></td></tr>
            <tr><td>Best Fit — Riyadh</td><td>2-BR (SAR 3,400–6,800) ✅</td></tr>
            <tr><td>Best Fit — Jeddah</td><td>3-BR (SAR 5,000–12,000) ⚠️ Entry level</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Family Earning SAR 20,000 with Car Loan</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 20,000</td></tr>
            <tr><td>Car Loan Payment</td><td>SAR 2,500/month</td></tr>
            <tr><td><strong>Max Rent (30%)</strong></td><td><strong>SAR 6,000/month</strong></td></tr>
            <tr><td>DTI (Rent + Car)</td><td>42.5% — ⚠️ High</td></tr>
            <tr><td>Recommended</td><td>Consider 25% rule (SAR 5,000) to lower DTI</td></tr>
        </tbody>
    </table>
    <p>Planning to finance a car? Check our <a href="/ksa/car-loan-calculator">Car Loan Calculator</a> to see how the EMI affects your rent budget.</p>

    <h2 id="rent-by-city">KSA Rent Prices by City (2025/2026)</h2>
    <p>Rental prices vary dramatically across Saudi Arabia. The table below shows <strong>monthly rent ranges in SAR</strong> for the five major cities:</p>
    <table>
        <thead><tr><th>City</th><th>Studio</th><th>1-BR</th><th>2-BR</th><th>3-BR</th><th>Villa</th></tr></thead>
        <tbody>
            <tr><td><strong>Riyadh</strong></td><td>1,700–3,800</td><td>2,500–4,800</td><td>3,400–6,800</td><td>4,000–7,500</td><td>15,000–19,000</td></tr>
            <tr><td><strong>Jeddah</strong></td><td>2,200–3,400</td><td>2,000–4,000</td><td>3,200–5,500</td><td>5,000–12,000</td><td>8,000–17,000</td></tr>
            <tr><td><strong>Dammam/Khobar</strong></td><td>1,500–2,800</td><td>1,800–3,500</td><td>2,500–4,500</td><td>3,000–5,000</td><td>5,000–10,000</td></tr>
            <tr><td><strong>Makkah</strong></td><td>1,200–2,500</td><td>1,500–3,000</td><td>2,000–4,000</td><td>2,500–6,000</td><td>6,000–12,000</td></tr>
            <tr><td><strong>Madinah</strong></td><td>1,000–2,000</td><td>1,000–2,500</td><td>1,500–3,000</td><td>2,000–4,000</td><td>4,000–8,000</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Trends (2025):</strong><br/>
        • <strong>Riyadh</strong> — Villa rents rose 13.9%, apartment rents 6.9% in Q2 2025 (now frozen until 2030)<br/>
        • <strong>Jeddah</strong> — Apartments increasing 4–6% annually — NO rent freeze<br/>
        • <strong>Dammam</strong> — Most affordable major city — apartment growth ~5%<br/>
        • Premium areas: Al Olaya, KAFD, Hittin (Riyadh); Al Shati, Corniche (Jeddah/Dammam)
    </div>

    <h2 id="housing-allowance">Housing Allowance in Saudi Arabia (بدل السكن)</h2>
    <p>Under Saudi Labor Law, employers must provide either <strong>residential accommodation or a housing allowance</strong>. This is a critical factor in rent affordability:</p>
    <table>
        <thead><tr><th>Detail</th><th>Typical Range</th></tr></thead>
        <tbody>
            <tr><td><strong>Saudi Employees</strong></td><td>20–30% of basic salary</td></tr>
            <tr><td><strong>Expat Employees</strong></td><td>Up to 50% of monthly salary (some packages)</td></tr>
            <tr><td><strong>Payment</strong></td><td>Monthly, alongside regular salary</td></tr>
            <tr><td><strong>Legal Basis</strong></td><td>Must be specified in employment contract</td></tr>
            <tr><td><strong>Variation</strong></td><td>Depends on company policy, position, and city</td></tr>
        </tbody>
    </table>
    <p><strong>Tip:</strong> When negotiating a job offer, ask for the housing allowance to be <strong>separate from the basic salary</strong>. This keeps your basic salary lower for GOSI calculation purposes while increasing your total spending power. Use our <a href="/ksa/salary-calculator">Salary Calculator</a> to model different allowance structures.</p>

    <h2 id="ejar-guide">Ejar Platform — Complete Guide for Tenants</h2>
    <p>The <strong>Ejar platform (إيجار)</strong> is the government-mandated electronic rental system managed by the Real Estate General Authority. Since <strong>January 2024</strong>, all financial transactions for residential rent in Saudi Arabia must go through Ejar's digital channels.</p>
    <h3>Key Features</h3>
    <ul>
        <li><strong>Mandatory registration</strong> — all lease contracts must be authenticated via Ejar</li>
        <li><strong>Digital payments only</strong> — Mada or SADAD (biller number 153)</li>
        <li><strong>Legal power</strong> — Ejar contracts are "executive instruments" — immediate enforcement via Execution Court</li>
        <li><strong>Security deposit</strong> — held by Ejar as a neutral third party</li>
        <li><strong>Automatic receipts</strong> — no manual receipt needed</li>
    </ul>
    <h3>Tenant Rights via Ejar</h3>
    <ol>
        <li><strong>Contract registration</strong> — if landlord fails to register, tenant can request it</li>
        <li><strong>Termination without penalty</strong> — allowed for property defects, landlord breach, or unsuitable conditions</li>
        <li><strong>Maintenance obligation</strong> — landlord must perform regular maintenance and ensure building safety</li>
        <li><strong>60-day notice</strong> — required before non-renewal of contract</li>
        <li><strong>Support program</strong> — available for eligible tenants facing difficulties (families of deceased, prisoners, low-income)</li>
    </ol>

    <h2 id="riyadh-rent-freeze">Riyadh Rent Freeze (2025–2030)</h2>
    <p>In <strong>September 2025</strong>, the Saudi government implemented a landmark <strong>5-year rent freeze</strong> on all residential and commercial properties within Riyadh's defined urban boundary.</p>
    <table>
        <thead><tr><th>Feature</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Duration</strong></td><td>5 years (Sep 2025 – ~2030)</td></tr>
            <tr><td><strong>Cap</strong></td><td>Annual increases limited to 0–2%</td></tr>
            <tr><td><strong>Scope</strong></td><td>Residential AND commercial properties</td></tr>
            <tr><td><strong>Vacant Properties</strong></td><td>Rent fixed at last registered Ejar contract amount</td></tr>
            <tr><td><strong>Coverage</strong></td><td>Within Riyadh's urban boundary ONLY</td></tr>
            <tr><td><strong>Other Cities</strong></td><td>NOT covered — Jeddah, Dammam, etc. can still increase</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>What This Means for You:</strong> If you're currently renting in Riyadh, your landlord <strong>cannot raise rent beyond 2% annually</strong> until approximately 2030. This provides excellent budget predictability. For those considering relocating to KSA, Riyadh now offers the most rent stability of any major Saudi city.
    </div>

    <h2 id="compound-vs-independent">Compound vs Independent Living in KSA</h2>
    <p>Expatriates in Saudi Arabia face a key housing decision: <strong>compound living vs independent apartments/villas</strong>.</p>
    <table>
        <thead><tr><th>Factor</th><th>Compound</th><th>Independent</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly Cost</strong></td><td>SAR 10,000–19,000 (2-3BR Riyadh)</td><td>SAR 3,400–7,500 (2-3BR Riyadh)</td></tr>
            <tr><td><strong>Security</strong></td><td>Gated, 24/7 guards</td><td>Building security varies</td></tr>
            <tr><td><strong>Amenities</strong></td><td>Pool, gym, school, shops</td><td>External facilities</td></tr>
            <tr><td><strong>Utilities</strong></td><td>Often included</td><td>Separate (SAR 228–700/mo)</td></tr>
            <tr><td><strong>Community</strong></td><td>Expat-focused, social</td><td>Local neighborhood</td></tr>
            <tr><td><strong>% of Income</strong></td><td>40–50% (common)</td><td>25–30% (recommended)</td></tr>
            <tr><td><strong>Best For</strong></td><td>Families with children</td><td>Singles, couples, budget-conscious</td></tr>
        </tbody>
    </table>
    <p><strong>Trend (2025/2026):</strong> A growing number of expats are choosing modern, standalone apartment towers in areas like KAFD, Al Olaya, and King Salman District — prioritizing location and cost efficiency over compound amenities.</p>

    <h2 id="hidden-costs">Hidden Costs of Renting in Saudi Arabia</h2>
    <p>Your monthly rent is just the start. Budget for these <strong>additional costs</strong>:</p>
    <table>
        <thead><tr><th>Cost</th><th>Amount (SAR)</th><th>When</th></tr></thead>
        <tbody>
            <tr><td><strong>Agent/Broker Fee</strong></td><td>5% of annual rent</td><td>One-time at signing</td></tr>
            <tr><td><strong>Security Deposit</strong></td><td>1–2 months rent</td><td>At signing (held by Ejar)</td></tr>
            <tr><td><strong>Electricity</strong></td><td>100–400/month</td><td>Monthly (higher in summer)</td></tr>
            <tr><td><strong>Water</strong></td><td>50–150/month</td><td>Monthly</td></tr>
            <tr><td><strong>Internet</strong></td><td>66–104/month</td><td>Monthly</td></tr>
            <tr><td><strong>A/C Maintenance</strong></td><td>200–500/year</td><td>Annually</td></tr>
            <tr><td><strong>Furniture (unfurnished)</strong></td><td>5,000–20,000</td><td>One-time</td></tr>
            <tr><td><strong>Iqama Renewal</strong></td><td>400–800/year</td><td>Annually (expats)</td></tr>
        </tbody>
    </table>
    <p>Remember: <strong>15% VAT</strong> applies to commercial leases, agent fees, and many services. Use our <a href="/ksa/vat-calculator">VAT Calculator</a> to check the exact VAT amount on any expense.</p>

    <h2 id="expat-tips">Tips for Expats Renting in Saudi Arabia</h2>
    <ol>
        <li><strong>Negotiate rent down 5–10%</strong> for long-term leases (2+ years) — landlords prefer stable tenants</li>
        <li><strong>Move during summer (Jul–Aug)</strong> — expat turnover creates 10–15% rent drops</li>
        <li><strong>Explore suburban areas</strong> — rents drop 30% outside central areas (e.g., Al Nakheel in Riyadh)</li>
        <li><strong>Consider shared villas</strong> — many expats split villa rentals to reduce per-person cost</li>
        <li><strong>Always use Ejar</strong> — informal agreements have NO legal protection</li>
        <li><strong>Get your housing allowance in writing</strong> — ensure it's specified in your contract</li>
        <li><strong>Factor in overtime</strong> — if you earn <a href="/ksa/overtime-calculator">overtime pay</a> at 150%, include it in your budget</li>
        <li><strong>Save your EOSB</strong> — when leaving a job, your <a href="/ksa/end-of-service-calculator">End of Service Benefit</a> can cover deposits and moving costs</li>
        <li><strong>Use leave pay strategically</strong> — your <a href="/ksa/annual-leave-calculator">leave encashment</a> can help with upfront rental costs</li>
        <li><strong>Budget for VAT</strong> — 15% on services adds up: <a href="/ksa/vat-calculator">check VAT</a> on your expenses</li>
    </ol>

    <h2 id="rent-vs-buy">Rent vs Buy in Saudi Arabia</h2>
    <p>With the new <strong>January 2026 property ownership law</strong> allowing foreign nationals to buy in designated zones, the rent-vs-buy decision has become relevant for long-term expats:</p>
    <table>
        <thead><tr><th>Factor</th><th>Renting</th><th>Buying</th></tr></thead>
        <tbody>
            <tr><td><strong>Upfront Cost</strong></td><td>2–3 months rent + agent fee</td><td>10–30% down payment</td></tr>
            <tr><td><strong>Monthly Cost</strong></td><td>Rent only</td><td>Mortgage EMI (may be lower)</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>High — move after 1-year lease</td><td>Low — tied to property</td></tr>
            <tr><td><strong>Equity</strong></td><td>None — money gone</td><td>Building asset value</td></tr>
            <tr><td><strong>Maintenance</strong></td><td>Landlord's responsibility</td><td>Owner's responsibility</td></tr>
            <tr><td><strong>Best For</strong></td><td>Short-term stays (1–5 years)</td><td>Long-term residents (5+ years)</td></tr>
        </tbody>
    </table>
    <p>If you're considering buying, use our <a href="/ksa/home-loan-calculator">Home Loan Calculator</a> to estimate your Sharia-compliant mortgage payment, and our <a href="/ksa/savings-goal-calculator">Savings Goal Calculator</a> to plan your down payment savings.</p>

    <h2 id="vision-2030-housing">Vision 2030 Housing Initiatives</h2>
    <p>Saudi Arabia's <strong>Vision 2030</strong> includes major housing programs that directly affect rental and ownership affordability:</p>
    <ul>
        <li><strong>Sakani Program</strong> — government housing support for Saudi families, including subsidized land, financing, and ready units</li>
        <li><strong>Housing Development Fund (SHF)</strong> — provides Sharia-compliant home finance solutions with profit subsidies for eligible Saudis</li>
        <li><strong>National Housing Company (NHC)</strong> — developing affordable housing projects across the Kingdom</li>
        <li><strong>Riyadh Rent Freeze</strong> — 5-year cap on rent increases (2025–2030)</li>
        <li><strong>Foreign Ownership Law (2026)</strong> — expats can now buy property in designated zones</li>
        <li><strong>Target</strong>: Increase Saudi home ownership from 47% (2016) to 70% by 2030</li>
    </ul>
    <p>For Saudi nationals eligible for Sakani or SHF, the question shifts from "can I afford rent?" to "can I afford a mortgage?" — check our <a href="/ksa/home-loan-calculator">Home Loan Calculator</a> to find out.</p>
`;

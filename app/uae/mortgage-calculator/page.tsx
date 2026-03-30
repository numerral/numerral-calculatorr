// Standalone page — /uae/mortgage-calculator
// UAE Mortgage Calculator with comprehensive educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEMortgageCalculatorCore from "@/components/calculator/UAEMortgageCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Mortgage Calculator 2026 — Dubai & Abu Dhabi Home Loan",
    description: "Calculate your monthly mortgage payment in the UAE. Covers Dubai & Abu Dhabi property fees, CBUAE LTV limits, DBR check, Islamic & conventional financing, and upfront cost estimator.",
    keywords: ["UAE mortgage calculator", "Dubai mortgage calculator", "Abu Dhabi mortgage calculator", "حاسبة الرهن العقاري", "UAE home loan", "CBUAE LTV", "DLD fees calculator", "expat mortgage UAE", "Islamic mortgage UAE", "Murabaha mortgage Dubai", "EIBOR mortgage rate"],
    alternates: buildCountryAlternates("AE", "/uae/mortgage-calculator", "mortgage-calculator"),
};

const FAQ_ITEMS = [
    { question: "How does a mortgage work in the UAE?", answer: "A UAE mortgage works similarly to mortgages worldwide — a bank lends you money to buy a property, and you repay it in monthly installments (EMI) over an agreed period (up to 25 years). The key difference is the UAE offers both conventional mortgages (interest-based) and Islamic mortgages (Sharia-compliant, fee or profit-rate based). The property serves as collateral until the loan is fully repaid. The Central Bank of the UAE (CBUAE) regulates all mortgages with strict Loan-to-Value (LTV) limits and a 50% Debt Burden Ratio cap." },
    { question: "What is the minimum down payment for a mortgage in the UAE?", answer: "The minimum down payment depends on your residency status and property value, as regulated by the CBUAE: UAE Nationals — 15% for first home ≤ AED 5M (LTV 85%), 25% for homes > AED 5M (LTV 75%). UAE Residents (Expats) — 20% for first home ≤ AED 5M (LTV 80%), 30% for homes > AED 5M (LTV 70%). Non-Residents — 35% for properties ≤ AED 5M (LTV 65%), 40% for properties > AED 5M (LTV 60%). Off-plan properties always require a minimum 50% down payment regardless of nationality." },
    { question: "What is the Debt Burden Ratio (DBR) in the UAE?", answer: "The Debt Burden Ratio (DBR) is a CBUAE regulation that caps your total monthly debt payments (including the mortgage EMI, car loans, personal loans, and credit card minimum payments) at 50% of your net monthly income. For example, if your salary is AED 30,000/month, your total debt payments including the mortgage cannot exceed AED 15,000. Banks use the DBR to determine the maximum loan amount you qualify for." },
    { question: "What are the current mortgage interest rates in the UAE (2025)?", answer: "As of 2025, UAE mortgage rates range from approximately 4.25% to 6.50%. Fixed rates typically range from 4.25%–5.99% for the first 1–5 years, after which they convert to variable rates. Variable rates are linked to EIBOR (Emirates Interbank Offered Rate) plus a bank margin of 1.25%–2.00%. Islamic mortgage profit rates are generally comparable to conventional rates. Rates vary by bank, borrower profile, loan amount, and property type." },
    { question: "What is EIBOR and how does it affect my mortgage?", answer: "EIBOR (Emirates Interbank Offered Rate) is the benchmark interest rate that UAE banks use to lend to each other. Variable-rate mortgages are priced as EIBOR + a bank margin (e.g., EIBOR + 1.49%). As of Q1 2025, the 3-month EIBOR is approximately 4.35%. When EIBOR rises, your variable-rate mortgage payments increase; when it falls, payments decrease. Fixed-rate mortgages protect you from EIBOR fluctuations during the fixed period (typically 1–5 years)." },
    { question: "What is the difference between conventional and Islamic mortgages in the UAE?", answer: "Conventional mortgages charge interest on the loan amount. Islamic mortgages (Sharia-compliant) avoid interest (riba) and use alternative structures: Murabaha — the bank buys the property and sells it to you at a disclosed markup. You pay a fixed total price in installments. Ijara — the bank buys the property and leases it to you. You pay monthly rent that includes a purchase component. Ownership transfers at the end. Diminishing Musharaka — you and the bank co-own the property. You gradually buy out the bank's share. In practice, the monthly costs are often similar, but the legal structure and contract terms differ significantly." },
    { question: "What are the DLD fees when buying property in Dubai?", answer: "Dubai Land Department (DLD) fees include: Transfer Fee — 4% of the property price + AED 580 admin fee (this is the largest cost). Mortgage Registration — 0.25% of the loan amount + AED 290. Trustee Fee — AED 4,200 (for properties > AED 500,000). Title Deed — AED 580. As of February 2025, these fees must be paid upfront in cash and cannot be included in the mortgage loan. Total DLD-related costs typically add 5–7% to the purchase price." },
    { question: "How do Abu Dhabi property fees differ from Dubai?", answer: "Abu Dhabi property fees are generally lower than Dubai: Transfer/Registration Fee — 2% of property value (vs. 4% in Dubai). Mortgage Registration — 0.1% of purchase price (vs. 0.25% in Dubai). Title Deed — AED 1,000 (vs AED 580 in Dubai). Trustee Fee — AED 4,000 (vs AED 4,200 in Dubai). Agent commission and valuation fees are similar (2% and ~AED 2,500 respectively). Overall, buying in Abu Dhabi can save 2–3% of the property price in transfer fees alone." },
    { question: "Can non-residents get a mortgage in the UAE?", answer: "Yes, non-residents can obtain a mortgage in the UAE, but with stricter conditions: Higher down payment — typically 35–40% (vs. 20% for residents). Higher interest rates — 0.5%–1% above resident rates. Limited property areas — must buy in designated freehold zones (Dubai Marina, Downtown Dubai, Palm Jumeirah, etc.). Minimum salary — typically AED 15,000–25,000/month or equivalent. Maximum LTV — 65% for properties ≤ AED 5M, 60% for properties > AED 5M. Some banks also require an international credit check and may limit financing to specific developers." },
    { question: "What is the maximum mortgage tenure in the UAE?", answer: "The maximum mortgage tenure in the UAE is 25 years, as regulated by the CBUAE. However, the loan must be fully repaid by age 65 for salaried employees and age 70 for self-employed individuals (UAE nationals may get up to age 70). So if you're 50 and salaried, your maximum tenure is 15 years, not 25." },
    { question: "What happened with the February 2025 CBUAE mortgage regulation change?", answer: "Effective February 1, 2025, the CBUAE mandated that banks can no longer finance certain upfront property fees as part of the mortgage. Specifically, the DLD registration fee (4% in Dubai), real estate agent commission (2%), trustee fee, and mortgage registration fee must now be paid in cash by the buyer. This means buyers need 6–8% more cash upfront beyond the down payment. The regulation aims to promote responsible lending, reduce over-leveraging, and align with international banking standards." },
    { question: "What documents are required for a UAE mortgage?", answer: "Typical documents include: Valid Emirates ID or passport (non-residents). Salary certificate from employer (or trade license for self-employed). Bank statements — last 3–6 months. Employment contract or letter. Property valuation report. Signed Sale and Purchase Agreement (SPA). No Objection Certificate (NOC) from developer (for off-plan). Credit bureau report (Al Etihad Credit Bureau — AECB). Self-employed individuals also need: trade license, audited financial statements (2–3 years), company bank statements. Non-residents may need additional KYC documents depending on the bank." },
    { question: "What is the early settlement penalty for UAE mortgages?", answer: "Under CBUAE regulations, the maximum early settlement fee is 1% of the outstanding loan balance, capped at AED 10,000. For example, if your remaining balance is AED 1,500,000, the maximum fee would be AED 10,000 (not AED 15,000 which would be 1%). Some banks offer reduced or zero early settlement fees during promotional periods. Partial prepayments may also incur a reduced fee, typically 1% of the prepaid amount." },
    { question: "Should I choose a fixed or variable rate mortgage in the UAE?", answer: "It depends on your risk tolerance and market outlook: Fixed rate — predictable payments for 1–5 years. Ideal if you prefer budget certainty or expect rates to rise. Typically 0.25%–0.75% higher than variable rates initially. Variable rate — linked to EIBOR, so payments fluctuate. Better if you expect rates to fall or want a lower starting rate. Most banks offer hybrid products: fixed for 2–3 years, then variable. In Q1 2025, with EIBOR at ~4.35% and rate cuts anticipated, many advisors suggest locking in a fixed rate for 2–3 years." },
    { question: "What is Murabaha financing and how does it work in the UAE?", answer: "Murabaha (مرابحة) is the most popular Islamic mortgage product in UAE. The bank purchases the property you want, then sells it to you at cost plus a disclosed profit margin. Key features: Fixed total price — agreed upfront, cannot change. Monthly installments — like a conventional EMI but technically 'deferred sale payments'. No interest — the profit margin replaces interest, making it Sharia-compliant. Ownership — can be immediate (in your name from day one) or deferred depending on the bank's structure. Monthly payments under Murabaha are often comparable to conventional mortgages at similar rates." },
    { question: "How much total cash do I need to buy a property in Dubai?", answer: "For a typical AED 2,000,000 Dubai apartment as a resident (first home): Down Payment (20%) — AED 400,000. DLD Transfer Fee (4%) — AED 80,580. Agent Commission (2% + VAT) — AED 42,000. Trustee Fee — AED 4,200. Mortgage Registration — AED 4,290. Valuation — AED 3,150. Bank Processing (1% + VAT) — AED 16,800. Title Deed — AED 580. Total cash needed — approximately AED 551,600 (~27.6% of property value). This is why financial planners recommend having at least 25–30% of the property value in liquid funds before making a purchase." },
];

export default function MortgageCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Mortgage Calculator" },
        ]),
        webAppSchema("UAE Mortgage Calculator", canonicalUrl("/uae/mortgage-calculator")),
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
            <Script id="schema-mortgage-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Mortgage Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Mortgage Calculator 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your monthly mortgage payment in the UAE. Covers CBUAE LTV limits for nationals, residents, and non-residents. Includes DLD and DMT fee calculator, DBR affordability check, and Islamic financing options.
            </p>
            <AuthorBadge categoryKey="salary" />
            <UAEMortgageCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Mortgage Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/loan-calculators/emi-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">📊</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">EMI Calculator</div>
                            <div className="uae-related-link__desc">General loan EMI calculation</div>
                        </div>
                    </Link>
                    <Link href="/investment-calculators/compound-interest-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💹</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Compound Interest</div>
                            <div className="uae-related-link__desc">Calculate investment growth</div>
                        </div>
                    </Link>
                    <Link href="/tax-calculators/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">VAT Calculator</div>
                            <div className="uae-related-link__desc">Calculate 5% UAE VAT on fees</div>
                        </div>
                    </Link>
                    <Link href="/loan-calculators/amortization-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">📉</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Amortization Schedule</div>
                            <div className="uae-related-link__desc">Full payment breakdown over time</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="overview">UAE Mortgage Market Overview</h2>
    <p>The United Arab Emirates has one of the most dynamic real estate markets in the Middle East, with <strong>Dubai</strong> and <strong>Abu Dhabi</strong> leading as global property investment destinations. The mortgage market is regulated by the <strong>Central Bank of the UAE (CBUAE)</strong>, which sets strict lending standards including Loan-to-Value (LTV) ratios, Debt Burden Ratios (DBR), and maximum tenures to ensure responsible lending practices.</p>
    <p>As of Q1 2025, mortgage volumes in Dubai surged by approximately <strong>27% year-on-year</strong>, driven by strong buyer confidence, population growth, and a favorable regulatory environment. The UAE saw a record <strong>AED 155 billion</strong> in mortgage disbursements in 2024, with expats accounting for nearly 65% of all mortgage originations. Both conventional and Islamic mortgage products are widely available, reflecting the UAE's position as a global hub for Islamic finance.</p>
    <p>Understanding the mortgage landscape is essential whether you're a <strong>UAE national</strong> buying your first home, an <strong>expatriate</strong> looking to invest in freehold property, or a <strong>non-resident investor</strong> purchasing in Dubai or Abu Dhabi. This guide covers everything you need to know about UAE mortgages in 2025 — from CBUAE regulations and LTV limits to property fees, Islamic financing options, and step-by-step calculations.</p>

    <h2 id="mortgage-types">Types of Mortgages Available in the UAE</h2>
    <p>UAE banks offer two main categories of mortgages — <strong>conventional</strong> and <strong>Islamic (Sharia-compliant)</strong>. Within each category, borrowers can choose between fixed and variable rate structures.</p>
    <table>
        <thead><tr><th>Type</th><th>How It Works</th><th>Rate Structure</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>Conventional Fixed</strong></td><td>Interest-based loan with fixed rate for 1–5 years</td><td>Fixed 4.25–5.99%</td><td>Budget certainty</td></tr>
            <tr><td><strong>Conventional Variable</strong></td><td>Interest-based, rate linked to EIBOR</td><td>EIBOR + 1.25–2.00%</td><td>Potential savings if rates fall</td></tr>
            <tr><td><strong>Islamic Murabaha</strong></td><td>Bank buys property, sells at cost + profit markup</td><td>Fixed profit rate</td><td>Sharia compliance + predictability</td></tr>
            <tr><td><strong>Islamic Ijara</strong></td><td>Bank buys property, leases to buyer</td><td>Can be variable</td><td>Sharia compliance + flexibility</td></tr>
            <tr><td><strong>Diminishing Musharaka</strong></td><td>Joint ownership, buyer buys out bank's share</td><td>Variable</td><td>Risk-sharing, co-ownership</td></tr>
        </tbody>
    </table>

    <h3 id="conventional-mortgages">Conventional Mortgages</h3>
    <p>Conventional mortgages in the UAE function like standard loans worldwide. The bank charges <strong>interest</strong> on the outstanding principal, and you make monthly payments that include both principal repayment and interest. Key features:</p>
    <ul>
        <li><strong>Fixed-rate periods</strong> typically last 1–5 years, after which the mortgage converts to a variable rate linked to EIBOR</li>
        <li><strong>Variable rates</strong> are calculated as: <strong>EIBOR + Bank Margin</strong> (e.g., 4.35% EIBOR + 1.49% margin = 5.84%)</li>
        <li>Available from international banks like <strong>HSBC UAE</strong>, <strong>Standard Chartered</strong>, and local conventional banks</li>
        <li>Monthly payments are typically lower during the fixed period</li>
    </ul>

    <h3 id="islamic-mortgages">Islamic Mortgages (Sharia-Compliant)</h3>
    <p>Islamic mortgages avoid charging interest (<strong>riba</strong>), which is prohibited under Sharia law. Instead, they use profit-based or asset-based structures that achieve a similar economic outcome while remaining compliant with Islamic principles.</p>

    <h4 id="murabaha">Murabaha — Cost-Plus Financing</h4>
    <p><strong>Murabaha (مرابحة)</strong> is the most widely used Islamic mortgage product in the UAE. The structure works as follows:</p>
    <ul>
        <li>You identify the property you want to purchase</li>
        <li>The bank buys the property from the seller at the market price</li>
        <li>The bank then sells the property to you at a <strong>higher price that includes a disclosed profit margin</strong></li>
        <li>You repay this total amount in <strong>fixed monthly installments</strong> over the agreed tenure</li>
        <li>The total cost is <strong>fixed upfront</strong> — it cannot change after signing the contract</li>
    </ul>
    <p>Murabaha is offered by <strong>Dubai Islamic Bank</strong>, <strong>Abu Dhabi Islamic Bank (ADIB)</strong>, <strong>Emirates Islamic</strong>, and the Islamic banking arms of conventional banks.</p>

    <h4 id="ijara">Ijara — Lease-to-Own</h4>
    <p><strong>Ijara (إجارة)</strong> is a lease-based Islamic mortgage structure:</p>
    <ul>
        <li>The bank purchases the property and retains ownership</li>
        <li>You pay monthly <strong>rent</strong> that includes a component toward eventual ownership</li>
        <li>At the end of the lease term (or upon full payment), ownership <strong>transfers to you</strong> for a nominal amount</li>
        <li>Monthly payments <strong>may vary</strong> if the underlying rate is variable</li>
        <li>The bank bears the risk of property ownership during the lease period</li>
    </ul>

    <h4 id="musharaka">Diminishing Musharaka — Partnership</h4>
    <p><strong>Musharaka Mutanaqisa (مشاركة متناقصة)</strong> is a co-ownership model:</p>
    <ul>
        <li>Both you and the bank <strong>contribute capital</strong> to purchase the property (e.g., you contribute 20%, bank contributes 80%)</li>
        <li>You pay the bank rent on their share plus a portion to <strong>buy out their ownership</strong></li>
        <li>Your ownership percentage <strong>increases with each payment</strong></li>
        <li>Eventually, you become the sole owner</li>
        <li>This involves genuine <strong>risk-sharing</strong>, which aligns with Islamic finance principles</li>
    </ul>

    <h2 id="cbuae-regulations">CBUAE Mortgage Regulations 2025</h2>
    <p>The <strong>Central Bank of the UAE (CBUAE)</strong> regulates all mortgage lending in the country. Key regulations effective in 2025:</p>
    <table>
        <thead><tr><th>Rule</th><th>Limit</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Debt Burden Ratio (DBR)</strong></td><td>50%</td><td>Total monthly debt payments ≤ 50% of net monthly income</td></tr>
            <tr><td><strong>Maximum Tenure</strong></td><td>25 years</td><td>For all buyer categories and property types</td></tr>
            <tr><td><strong>Age Limit — Salaried</strong></td><td>65 years</td><td>Loan must be repaid by age 65</td></tr>
            <tr><td><strong>Age Limit — Self-Employed</strong></td><td>70 years</td><td>Loan must be repaid by age 70</td></tr>
            <tr><td><strong>Age Limit — UAE Nationals</strong></td><td>70 years</td><td>Extended limit for UAE nationals</td></tr>
            <tr><td><strong>Minimum Salary — Expats</strong></td><td>AED 15,000+</td><td>Varies by bank; some require AED 18,000–25,000</td></tr>
            <tr><td><strong>Early Settlement</strong></td><td>1% of balance</td><td>Capped at AED 10,000</td></tr>
            <tr><td><strong>Upfront Fees — Feb 2025</strong></td><td>Cash only</td><td>DLD, agent, trustee fees cannot be financed</td></tr>
        </tbody>
    </table>

    <h3 id="ltv-ratios">Loan-to-Value (LTV) Ratios</h3>
    <p>LTV ratios determine how much of a property's value the bank can finance. The remaining amount (down payment) must come from the buyer's own funds. CBUAE LTV limits vary by residency status, property value, and purchase type:</p>
    <table>
        <thead><tr><th>Buyer Type</th><th>First Home ≤ AED 5M</th><th>First Home > AED 5M</th><th>2nd / Investment</th><th>Off-Plan</th></tr></thead>
        <tbody>
            <tr><td><strong>UAE National</strong></td><td>85% (15% down)</td><td>75% (25% down)</td><td>65% (35% down)</td><td>50% (50% down)</td></tr>
            <tr><td><strong>UAE Resident (Expat)</strong></td><td>80% (20% down)</td><td>70% (30% down)</td><td>60% (40% down)</td><td>50% (50% down)</td></tr>
            <tr><td><strong>Non-Resident</strong></td><td>65% (35% down)</td><td>60% (40% down)</td><td>50% (50% down)</td><td>50% (50% down)</td></tr>
        </tbody>
    </table>

    <h3 id="dbr-explained">Debt Burden Ratio (DBR) Explained</h3>
    <p>The DBR is a critical affordability measure. It is calculated as:</p>
    <div class="explanation__highlight">
        <strong>DBR = (Total Monthly Debt Payments ÷ Net Monthly Income) × 100</strong><br/><br/>
        Where Total Monthly Debt Payments includes:<br/>
        • Mortgage EMI (the new loan)<br/>
        • Car loan installments<br/>
        • Personal loan installments<br/>
        • Credit card minimum payments<br/><br/>
        <strong>CBUAE Limit: DBR ≤ 50%</strong>
    </div>
    <p>For example, if your net salary is <strong>AED 30,000</strong> and you have an existing car loan of <strong>AED 2,000/month</strong>, your maximum mortgage EMI would be: (30,000 × 50%) − 2,000 = <strong>AED 13,000/month</strong>.</p>

    <h2 id="2025-changes">2025 Regulatory Changes — What Buyers Must Know</h2>
    <p>Effective <strong>February 1, 2025</strong>, the CBUAE issued a significant directive that changed how property purchase fees are handled:</p>
    <ul>
        <li><strong>DLD Registration Fee (4% in Dubai)</strong> — must be paid upfront; cannot be included in the mortgage</li>
        <li><strong>Real Estate Agent Commission (2%)</strong> — must be paid upfront in cash</li>
        <li><strong>DLD Trustee Fee (AED 4,200)</strong> — excluded from mortgage financing</li>
        <li><strong>Mortgage Registration Fee (0.25%)</strong> — paid separately at time of loan registration</li>
        <li><strong>Title Deed Issuance (AED 580)</strong> — paid separately</li>
    </ul>
    <p>This means buyers now need <strong>6–8% more cash</strong> beyond the down payment compared to pre-2025 requirements. For a <strong>AED 2,000,000</strong> property, this translates to approximately <strong>AED 150,000–160,000</strong> in additional upfront cash.</p>
    <p>The regulation aims to <strong>promote responsible lending</strong>, prevent buyers from over-leveraging, and align UAE banking practices with international standards. It particularly impacts first-time buyers and those with limited liquid savings.</p>

    <h2 id="dubai-fees">Dubai Property Purchase Fees</h2>
    <p>When buying property in <strong>Dubai</strong>, expect to pay 6–8% of the property value in fees beyond the down payment:</p>
    <table>
        <thead><tr><th>Fee</th><th>Amount</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>DLD Transfer Fee</strong></td><td>4% of property value + AED 580</td><td>Legally split 2/2 buyer/seller; buyer often pays full amount</td></tr>
            <tr><td><strong>Agent Commission</strong></td><td>2% of property value + 5% VAT</td><td>Paid to real estate broker</td></tr>
            <tr><td><strong>Trustee Fee</strong></td><td>AED 4,200</td><td>For properties > AED 500,000; AED 2,100 under</td></tr>
            <tr><td><strong>Mortgage Registration</strong></td><td>0.25% of loan + AED 290</td><td>Paid to DLD at loan registration</td></tr>
            <tr><td><strong>Property Valuation</strong></td><td>AED 2,500–3,500 + 5% VAT</td><td>Independent valuation required by bank</td></tr>
            <tr><td><strong>Bank Processing</strong></td><td>~1% of loan + 5% VAT</td><td>Some banks cap at AED 10,000</td></tr>
            <tr><td><strong>Title Deed</strong></td><td>AED 580</td><td>Issued by DLD upon completion</td></tr>
            <tr><td><strong>Oqood (Off-Plan)</strong></td><td>AED 4,020 or 4% of price</td><td>Provisional registration for under-construction properties</td></tr>
            <tr><td><strong>NOC from Developer</strong></td><td>AED 500–5,000 + VAT</td><td>Required from developer for secondary sale</td></tr>
        </tbody>
    </table>

    <h2 id="abu-dhabi-fees">Abu Dhabi Property Purchase Fees</h2>
    <p><strong>Abu Dhabi</strong> generally has lower property transaction costs compared to Dubai, primarily due to the lower transfer fee:</p>
    <table>
        <thead><tr><th>Fee</th><th>Amount</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>DMT Transfer Fee</strong></td><td>2% of property value + AED 400</td><td>Half of Dubai's rate — significant saving on large purchases</td></tr>
            <tr><td><strong>Agent Commission</strong></td><td>2% of property value + 5% VAT</td><td>Same as Dubai</td></tr>
            <tr><td><strong>Trustee Fee</strong></td><td>AED 4,000</td><td>Slightly lower than Dubai</td></tr>
            <tr><td><strong>Mortgage Registration</strong></td><td>0.1% of price + AED 400</td><td>Lower than Dubai's 0.25%</td></tr>
            <tr><td><strong>Property Valuation</strong></td><td>AED 2,500 + 5% VAT</td><td>Typically lower than Dubai</td></tr>
            <tr><td><strong>Bank Processing</strong></td><td>~1% of loan + 5% VAT</td><td>Similar to Dubai</td></tr>
            <tr><td><strong>Title Deed</strong></td><td>AED 1,000</td><td>Higher than Dubai's AED 580</td></tr>
        </tbody>
    </table>
    <p><em>For a <strong>AED 2,000,000</strong> property, buying in Abu Dhabi vs. Dubai saves approximately <strong>AED 42,000</strong> in transfer/registration fees alone.</em></p>

    <h2 id="formula">Monthly Payment Formula</h2>
    <p>The standard <strong>amortization formula</strong> used for UAE mortgage calculations:</p>
    <div class="explanation__highlight">
        <strong>EMI = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1]</strong><br/><br/>
        Where:<br/>
        EMI = Monthly payment (Equal Monthly Installment)<br/>
        P = Loan amount (property price − down payment)<br/>
        r = Monthly interest rate (annual rate ÷ 12 ÷ 100)<br/>
        n = Total number of months (years × 12)
    </div>
    <p>This formula applies to both conventional mortgages and Islamic Murabaha products (where the "interest rate" is replaced by a "profit rate" that produces the same mathematical result).</p>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: AED 2,000,000 Dubai Apartment — Expat, First Home</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Property Price</td><td>AED 2,000,000</td></tr>
            <tr><td>Down Payment (20%)</td><td>AED 400,000</td></tr>
            <tr><td>Loan Amount</td><td>AED 1,600,000</td></tr>
            <tr><td>Interest Rate</td><td>4.99%</td></tr>
            <tr><td>Tenure</td><td>25 years (300 months)</td></tr>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>≈ AED 9,361</strong></td></tr>
            <tr><td>Total Interest</td><td>AED 1,208,413</td></tr>
            <tr><td>Total Repayment</td><td>AED 2,808,413</td></tr>
            <tr><td>DLD & Fees (est.)</td><td>~AED 151,600</td></tr>
            <tr><td>Total Cash Needed</td><td>~AED 551,600 (27.6%)</td></tr>
            <tr><td>Min Salary (50% DBR)</td><td>AED 18,722</td></tr>
        </tbody>
    </table>

    <h3>Example 2: AED 5,000,000 Villa — UAE National, First Home</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Property Price</td><td>AED 5,000,000</td></tr>
            <tr><td>Down Payment (15%)</td><td>AED 750,000</td></tr>
            <tr><td>Loan Amount</td><td>AED 4,250,000</td></tr>
            <tr><td>Interest Rate</td><td>4.49%</td></tr>
            <tr><td>Tenure</td><td>25 years</td></tr>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>≈ AED 23,638</strong></td></tr>
            <tr><td>Total Interest</td><td>AED 2,841,400</td></tr>
            <tr><td>DLD & Fees (est.)</td><td>~AED 328,000</td></tr>
            <tr><td>Total Cash Needed</td><td>~AED 1,078,000 (21.6%)</td></tr>
            <tr><td>Min Salary (50% DBR)</td><td>AED 47,276</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Impact of Interest Rate on Monthly Payment</h3>
    <p>Same property: AED 2M, 20% down (AED 1.6M loan), 25-year tenure:</p>
    <table>
        <thead><tr><th>Rate</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Cost</th></tr></thead>
        <tbody>
            <tr><td>3.99%</td><td>AED 8,436</td><td>AED 930,800</td><td>AED 2,530,800</td></tr>
            <tr><td>4.49%</td><td>AED 8,892</td><td>AED 1,067,600</td><td>AED 2,667,600</td></tr>
            <tr><td>4.99%</td><td>AED 9,361</td><td>AED 1,208,413</td><td>AED 2,808,413</td></tr>
            <tr><td>5.49%</td><td>AED 9,842</td><td>AED 1,352,600</td><td>AED 2,952,600</td></tr>
            <tr><td>5.99%</td><td>AED 10,335</td><td>AED 1,500,500</td><td>AED 3,100,500</td></tr>
        </tbody>
    </table>
    <p><em>A 1% rate difference on a AED 1.6M loan over 25 years = roughly <strong>AED 275,000</strong> in total interest paid.</em></p>

    <h2 id="eibor">Understanding EIBOR</h2>
    <p>The <strong>Emirates Interbank Offered Rate (EIBOR)</strong> is the benchmark interest rate for inter-bank lending in the UAE. It directly impacts variable-rate mortgages and is closely correlated with the US Federal Funds Rate (since the AED is pegged to the USD).</p>
    <table>
        <thead><tr><th>EIBOR Tenor</th><th>Rate (Q1 2025)</th><th>Use</th></tr></thead>
        <tbody>
            <tr><td>1-Month EIBOR</td><td>~4.30%</td><td>Short-term pricing</td></tr>
            <tr><td>3-Month EIBOR</td><td>~4.35%</td><td>Most mortgages benchmark</td></tr>
            <tr><td>6-Month EIBOR</td><td>~4.40%</td><td>Some fixed-period products</td></tr>
            <tr><td>12-Month EIBOR</td><td>~4.45%</td><td>Longer-term products</td></tr>
        </tbody>
    </table>
    <p><strong>How EIBOR affects your payments:</strong> If your variable rate mortgage is priced at EIBOR + 1.49% and the 3-month EIBOR moves from 4.35% to 3.85% (following an anticipated rate cut), your effective rate would drop from 5.84% to 5.34%. On a AED 1.6M loan with 20 years remaining, this would save approximately <strong>AED 450/month</strong> or <strong>AED 5,400/year</strong>.</p>

    <h2 id="banks">UAE Banks Offering Mortgages</h2>
    <table>
        <thead><tr><th>Bank</th><th>Fixed Rate (indicative)</th><th>Variable Rate</th><th>Products</th><th>Min Salary</th></tr></thead>
        <tbody>
            <tr><td><strong>Emirates NBD</strong></td><td>4.49–5.49%</td><td>EIBOR + 1.49%</td><td>Conventional + Islamic</td><td>AED 15,000</td></tr>
            <tr><td><strong>ADCB</strong></td><td>4.25–5.25%</td><td>EIBOR + 1.25%</td><td>Conventional + Islamic</td><td>AED 15,000</td></tr>
            <tr><td><strong>FAB</strong></td><td>4.49–5.49%</td><td>EIBOR + 1.49%</td><td>Conventional + Islamic</td><td>AED 15,000</td></tr>
            <tr><td><strong>Dubai Islamic Bank</strong></td><td>4.99–5.99%</td><td>EIBOR + 1.75%</td><td>Murabaha / Ijara</td><td>AED 10,000</td></tr>
            <tr><td><strong>Mashreq</strong></td><td>4.75–5.50%</td><td>EIBOR + 1.50%</td><td>Conventional + Islamic</td><td>AED 15,000</td></tr>
            <tr><td><strong>HSBC UAE</strong></td><td>4.39–5.25%</td><td>EIBOR + 1.29%</td><td>Conventional</td><td>AED 15,000</td></tr>
            <tr><td><strong>RAK Bank</strong></td><td>4.99–5.75%</td><td>EIBOR + 1.60%</td><td>Conventional + Islamic</td><td>AED 10,000</td></tr>
            <tr><td><strong>ADIB</strong></td><td>5.25–6.25%</td><td>EIBOR + 1.85%</td><td>Murabaha / Ijara</td><td>AED 10,000</td></tr>
        </tbody>
    </table>
    <p><em>Rates are indicative as of Q1 2025 and vary by borrower profile, loan amount, and property type. Always confirm current rates with the bank directly.</em></p>

    <h2 id="non-resident">Non-Resident Mortgages in the UAE</h2>
    <p>Non-residents can purchase property in designated <strong>freehold areas</strong> across the UAE and obtain mortgage financing, subject to stricter conditions:</p>
    <table>
        <thead><tr><th>Requirement</th><th>Non-Resident Buyers</th><th>UAE Resident Buyers</th></tr></thead>
        <tbody>
            <tr><td><strong>Max LTV (≤ AED 5M)</strong></td><td>65%</td><td>80%</td></tr>
            <tr><td><strong>Max LTV (> AED 5M)</strong></td><td>60%</td><td>70%</td></tr>
            <tr><td><strong>Interest Rate Premium</strong></td><td>+0.5% to +1.0%</td><td>Standard rates</td></tr>
            <tr><td><strong>Minimum Salary</strong></td><td>AED 15,000–25,000/mo</td><td>AED 15,000/mo</td></tr>
            <tr><td><strong>Property Restriction</strong></td><td>Freehold areas only</td><td>Freehold areas</td></tr>
            <tr><td><strong>Credit Check</strong></td><td>International + UAE</td><td>UAE (AECB)</td></tr>
        </tbody>
    </table>
    <p>Popular <strong>freehold areas for non-residents</strong> in Dubai include: Dubai Marina, Downtown Dubai, Palm Jumeirah, JBR, JLT, Business Bay, Arabian Ranches, Dubai Hills Estate, and Mohammed Bin Rashid City.</p>
    <p>In Abu Dhabi, freehold ownership is permitted in areas such as: Yas Island, Saadiyat Island, Al Reem Island, Al Raha Beach, and Masdar City.</p>

    <h2 id="documents">Required Documents for UAE Mortgage</h2>
    <h3>Salaried Employees</h3>
    <ul>
        <li><strong>Emirates ID</strong> (or passport for non-residents)</li>
        <li><strong>Valid UAE visa</strong> (residents)</li>
        <li><strong>Salary certificate</strong> from employer (issued within 30 days)</li>
        <li><strong>Bank statements</strong> — last 3–6 months</li>
        <li><strong>Employment contract</strong> or offer letter</li>
        <li><strong>AECB credit report</strong> (Al Etihad Credit Bureau)</li>
        <li><strong>Property details</strong> — SPA, title deed, or booking form</li>
        <li><strong>Proof of down payment</strong> — bank transfer records</li>
    </ul>
    <h3>Self-Employed / Business Owners</h3>
    <ul>
        <li>All of the above, plus:</li>
        <li><strong>Valid trade license</strong> (renewed within last year)</li>
        <li><strong>Audited financial statements</strong> — last 2–3 years</li>
        <li><strong>Company bank statements</strong> — last 6–12 months</li>
        <li><strong>Memorandum of Association</strong> or partnership agreement</li>
        <li><strong>Personal tax returns</strong> (if applicable from home country)</li>
    </ul>

    <h2 id="early-settlement">Early Settlement & Prepayment</h2>
    <p>Under CBUAE regulations, borrowers have the right to settle their mortgage early, subject to a regulated fee:</p>
    <table>
        <thead><tr><th>Type</th><th>Fee</th><th>Cap</th></tr></thead>
        <tbody>
            <tr><td><strong>Full Early Settlement</strong></td><td>1% of outstanding balance</td><td>AED 10,000</td></tr>
            <tr><td><strong>Partial Prepayment</strong></td><td>1% of prepaid amount</td><td>Varies by bank</td></tr>
            <tr><td><strong>Refinancing</strong></td><td>Settlement fee + new loan setup</td><td>Consider total cost</td></tr>
        </tbody>
    </table>
    <p>For example, if your outstanding balance is <strong>AED 1,500,000</strong>, the early settlement fee would be <strong>AED 10,000</strong> (not AED 15,000, because the AED 10,000 cap applies). This makes refinancing relatively affordable in the UAE compared to many other countries. Many banks waive partial prepayment fees for amounts up to 10–20% of the outstanding balance annually.</p>

    <h2 id="rent-vs-buy">Rent vs. Buy — When Does Buying Make Sense in the UAE?</h2>
    <p>A common dilemma for UAE residents. Here are the key factors to consider:</p>
    <table>
        <thead><tr><th>Factor</th><th>Favor Buying</th><th>Favor Renting</th></tr></thead>
        <tbody>
            <tr><td><strong>Tenure in UAE</strong></td><td>5+ years planned</td><td>Less than 3 years</td></tr>
            <tr><td><strong>Cash Available</strong></td><td>25–30% of property value</td><td>Limited savings</td></tr>
            <tr><td><strong>Rental Yield</strong></td><td>Area yields > 6%</td><td>Area yields < 4%</td></tr>
            <tr><td><strong>EMI vs Rent</strong></td><td>EMI similar to or below rent</td><td>EMI significantly > rent</td></tr>
            <tr><td><strong>Market Outlook</strong></td><td>Capital appreciation expected</td><td>Market uncertainty / correction</td></tr>
            <tr><td><strong>Lifestyle</strong></td><td>Settled, family, schools nearby</td><td>Flexibility needed</td></tr>
        </tbody>
    </table>
    <p><strong>Rule of thumb:</strong> If the total cost of ownership (EMI + service charges + maintenance) is within <strong>20% of equivalent rent</strong> and you plan to stay <strong>5+ years</strong>, buying often makes financial sense — especially considering that Dubai has zero property ownership tax and no capital gains tax.</p>

    <h2 id="tips">Expert Tips for UAE Mortgage Borrowers</h2>
    <ol>
        <li><strong>Compare at least 3–4 banks</strong> before choosing — rates, fees, and terms can vary significantly</li>
        <li><strong>Get pre-approved</strong> before property hunting — it strengthens your negotiating position</li>
        <li><strong>Budget for 25–30% cash</strong> (not just the down payment — include DLD fees, agent, and setup costs)</li>
        <li><strong>Check your AECB score</strong> — a score above 700 significantly improves your rate offers</li>
        <li><strong>Consider the total cost</strong> of ownership — service charges in Dubai can be AED 15–30 per sq ft annually</li>
        <li><strong>Fixed vs variable</strong> — lock in a 2–3 year fixed rate if you expect EIBOR to remain stable or rise</li>
        <li><strong>Negotiate the margin</strong> — the bank's margin above EIBOR is often negotiable for high-value borrowers</li>
        <li><strong>Factor in insurance</strong> — life insurance and property insurance are mandatory for mortgage duration</li>
        <li><strong>Plan for DEWA deposits</strong> — AED 2,000 (apartment) or AED 4,000 (villa) refundable deposit</li>
        <li><strong>Read the fine print</strong> — understand the fixed-to-variable conversion terms and any reset clauses</li>
    </ol>
`;

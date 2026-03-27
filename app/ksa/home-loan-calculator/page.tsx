// Standalone page — /ksa/home-loan-calculator
// KSA Home Loan Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Home Loan Calculator (KSA) — Saudi Mortgage & Financing",
    description: "Calculate your monthly mortgage payment in Saudi Arabia. Covers Murabaha, Ijara, and Musharaka. SAMA-compliant with DTI check and bank rate comparison.",
    keywords: ["Saudi home loan calculator", "KSA mortgage calculator", "حاسبة التمويل العقاري", "Murabaha financing", "Ijara home loan", "Saudi real estate", "SAMA mortgage rules", "Vision 2030 housing"],
    alternates: { canonical: canonicalUrl("/ksa/home-loan-calculator") },
};

const FAQ_ITEMS = [
    { question: "How does a home loan work in Saudi Arabia?", answer: "Saudi home loans are Sharia-compliant — banks don't charge interest (riba). Instead, they use 'profit rate' through structures like Murabaha (cost-plus sale), Ijara (lease-to-own), or Musharaka (joint ownership). The bank buys the property and either sells it to you at a markup (Murabaha), leases it to you (Ijara), or co-owns it with you (Musharaka). Monthly payments include both the principal and the bank's profit margin." },
    { question: "What is the minimum down payment in Saudi Arabia?", answer: "Under SAMA regulations: 10% minimum for a first home (90% LTV — increased from 85% in 2018). 30% minimum for a second home (70% LTV). Expatriates typically need 20-30% down. Government programs like REDF/Sakani may offer support to reduce the effective down payment for Saudi first-time buyers." },
    { question: "What is the DTI limit for mortgages in Saudi Arabia?", answer: "SAMA (Saudi Central Bank) limits the Debt-to-Income (DTI) ratio to 65%. This means your total monthly debt payments (including the mortgage) cannot exceed 65% of your net monthly salary. Banks use this to determine the maximum financing amount you qualify for." },
    { question: "What is Murabaha financing?", answer: "Murabaha (cost-plus financing) is the most common Saudi home financing product. The bank purchases the property, then sells it to you at a higher price that includes a pre-agreed profit margin. Key features: property is registered in your name immediately, typically fixed-rate for the entire tenure, and the total price is agreed upfront and cannot change." },
    { question: "What is Ijara financing?", answer: "Ijara (lease-to-own) means the bank buys the property and leases it to you. You pay monthly rent that includes a purchase component. Ownership only transfers to you at the end of the lease term (for a nominal amount). Ijara can have variable rates, meaning your monthly payment may fluctuate with market conditions." },
    { question: "What is Musharaka financing?", answer: "Musharaka (diminishing partnership) is a joint-ownership model. You and the bank both contribute to buying the property, then you gradually buy out the bank's share through scheduled payments. This involves risk-sharing between you and the bank, aligning with Islamic finance principles. Your ownership percentage increases with each payment." },
    { question: "What are typical profit rates in Saudi Arabia?", answer: "As of 2025, indicative annual profit rates (APR) from major Saudi banks range from approximately 5.50% to 7.22%: Al Rajhi ~5.50%, SNB ~5.75%, Riyad Bank ~5.60%, SAB ~5.80%, Emirates NBD ~7.22%. Rates are linked to SAMA's Repo rate (5% as of June 2025). Fixed-rate Murabaha products offer predictable payments." },
    { question: "What is the maximum mortgage tenure?", answer: "Most Saudi banks offer home financing for up to 25-30 years. Al Rajhi Bank and Riyad Bank offer up to 30 years, while others like SNB and SAB offer up to 25 years. Longer tenures reduce monthly payments but increase the total profit paid over the life of the loan." },
    { question: "What is the Sakani program?", answer: "Sakani is a Saudi government housing program under Vision 2030 that provides personalized housing and financing solutions. Benefits include: subsidized profit rates, down payment assistance, access to discounted land plots, and partnership with REDF (Real Estate Development Fund). Eligible Saudi nationals can receive significant financial support for their first home." },
    { question: "Can expatriates get a home loan in Saudi Arabia?", answer: "Yes, under the 2025 Law of Real Estate Ownership by Non-Saudis, expatriates can own property in designated areas. Banks offer financing to expats, typically with: higher down payments (20-30%), shorter tenures, higher minimum salary requirements (SAR 10,000+), and maximum financing amounts that may be lower than for Saudis. Iqama validity is also a factor." },
    { question: "What is the early repayment penalty?", answer: "Under SAMA regulations, banks cannot charge an early repayment penalty exceeding three months of profit (or the remaining profit, whichever is less). This means if you want to refinance or pay off your mortgage early, the maximum fee is capped. Some banks offer zero early repayment fees for promotional periods." },
    { question: "How is the monthly payment calculated?", answer: "The standard amortization formula is used: Monthly Payment = P × [r(1+r)^n] / [(1+r)^n – 1], where P = loan amount, r = monthly profit rate (annual rate ÷ 12), n = total months (years × 12). For example: SAR 900,000 loan at 5.5% APR for 25 years → monthly payment ≈ SAR 5,529." },
    { question: "What documents are needed for a Saudi home loan?", answer: "Typical required documents: National ID (Saudis) or Iqama (expats), salary certificate from employer, bank statements (last 3-6 months), SIMAH credit report, property valuation report, employment contract, and proof of down payment. Self-employed individuals may need additional financial statements." },
    { question: "What is SIMAH and does it affect my mortgage?", answer: "SIMAH is Saudi Arabia's credit bureau, similar to credit scoring systems worldwide. Banks check your SIMAH report to assess creditworthiness. A good SIMAH score improves your chances of approval and may qualify you for better profit rates. Late bill payments, defaults, and existing debts all affect your SIMAH score." },
    { question: "Does GOSI affect my home loan eligibility?", answer: "Yes. Banks often require proof of GOSI registration as evidence of formal employment status. Your GOSI contribution history can prove employment stability. For salary verification, banks may cross-reference your stated salary with GOSI records. Use our GOSI Calculator to understand your social insurance contributions." },
];

export default function HomeLoanPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Home Loan Calculator" },
        ]),
        webAppSchema("Home Loan Calculator (KSA)", canonicalUrl("/ksa/home-loan-calculator")),
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
            <Script id="schema-homeloan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Home Loan Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Home Loan Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your monthly mortgage payment in Saudi Arabia. Sharia-compliant financing with Murabaha, Ijara, and Musharaka options. SAMA-compliant DTI check included.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="homeloan" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Home Loan FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net salary for DTI assessment</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">Banks verify employment via GOSI</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator (15%)</div>
                            <div className="ksa-related-link__desc">Calculate VAT on property transactions</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">Plan EOSB for down payment savings</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="home-financing">Home Financing in Saudi Arabia</h2>
    <p>Saudi Arabia's real estate financing market is one of the fastest-growing in the Middle East, driven by <strong>Vision 2030's</strong> ambitious goal to increase homeownership from 47% to <strong>70% by 2030</strong>. All home financing in the Kingdom is governed by the <strong>Saudi Central Bank (SAMA)</strong> and must comply with <strong>Sharia law</strong> — meaning banks use profit-based structures instead of interest (riba).</p>
    <p>As of Q1 2025, total real estate financing in Saudi Arabia reached approximately <strong>SAR 950 billion</strong>, with individuals accounting for 76% of all mortgage financing.</p>

    <h2 id="sharia-products">Sharia-Compliant Financing Products</h2>
    <table>
        <thead><tr><th>Product</th><th>How It Works</th><th>Rate Type</th><th>Ownership</th></tr></thead>
        <tbody>
            <tr><td><strong>Murabaha</strong></td><td>Bank buys property, sells to you at cost + disclosed profit margin</td><td>Usually Fixed</td><td>Yours immediately</td></tr>
            <tr><td><strong>Ijara</strong></td><td>Bank buys property, leases to you. Ownership at end of lease</td><td>Can be Variable</td><td>At lease end</td></tr>
            <tr><td><strong>Musharaka</strong></td><td>Joint ownership — you gradually buy out bank's share</td><td>Variable</td><td>Gradual transfer</td></tr>
        </tbody>
    </table>

    <h3 id="murabaha">Murabaha — Cost-Plus Financing</h3>
    <p><strong>Murabaha (مرابحة)</strong> is the most popular home financing product in Saudi Arabia. The bank purchases the property you want and immediately sells it to you at a higher price that includes a pre-agreed profit margin. Key features:</p>
    <ul>
        <li><strong>Property registered in your name</strong> from day one</li>
        <li><strong>Fixed monthly payments</strong> for the entire tenure (predictable budgeting)</li>
        <li><strong>Total cost agreed upfront</strong> — cannot change after signing</li>
        <li>No Sharia concerns about ownership ambiguity</li>
    </ul>

    <h3 id="ijara">Ijara — Lease-to-Own</h3>
    <p><strong>Ijara (إجارة)</strong> is a lease-based structure where the bank retains ownership during the financing period. You pay monthly amounts that include both rent and a purchase component:</p>
    <ul>
        <li>Property <strong>remains in the bank's name</strong> during the lease</li>
        <li>Monthly payments may <strong>fluctuate</strong> if the rate is variable</li>
        <li>Ownership transfers <strong>at the end of the lease</strong> for a nominal amount</li>
        <li>Lower initial payments compared to Murabaha in some cases</li>
    </ul>

    <h3 id="musharaka">Musharaka — Diminishing Partnership</h3>
    <p><strong>Musharaka Mutanaqisa (مشاركة متناقصة)</strong> is a joint-ownership model where:</p>
    <ul>
        <li>Both you and the bank <strong>contribute funds</strong> to purchase the property</li>
        <li>You pay rent on the bank's share + buy out their ownership gradually</li>
        <li>Your <strong>ownership percentage increases</strong> with each payment</li>
        <li>Involves <strong>risk-sharing</strong> aligned with Islamic principles</li>
    </ul>

    <h2 id="sama-rules">SAMA Regulations</h2>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>DTI Limit</strong></td><td>Monthly installments ≤ 65% of net salary</td></tr>
            <tr><td><strong>LTV — First Home</strong></td><td>90% max (10% minimum down payment)</td></tr>
            <tr><td><strong>LTV — Second Home</strong></td><td>70% max (30% minimum down payment)</td></tr>
            <tr><td><strong>Early Repayment</strong></td><td>Penalty capped at 3 months' profit or remaining profit (lesser)</td></tr>
            <tr><td><strong>Minimum Age</strong></td><td>21 years (must not exceed 65-70 at end of tenure)</td></tr>
            <tr><td><strong>Min Salary (Transfer)</strong></td><td>SAR 7,000/month (varies by bank)</td></tr>
            <tr><td><strong>Min Salary (Non-Transfer)</strong></td><td>SAR 10,000/month (varies by bank)</td></tr>
        </tbody>
    </table>

    <h2 id="down-payment">Down Payment Rules</h2>
    <table>
        <thead><tr><th>Scenario</th><th>Min Down Payment</th><th>Max LTV</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>First Home (Saudi)</strong></td><td>10%</td><td>90%</td><td>Increased from 85% in 2018 by SAMA</td></tr>
            <tr><td><strong>Second Home</strong></td><td>30%</td><td>70%</td><td>Investment property rules apply</td></tr>
            <tr><td><strong>Expat (Typical)</strong></td><td>20–30%</td><td>70–80%</td><td>Depends on bank, Iqama status</td></tr>
            <tr><td><strong>Off-Plan Property</strong></td><td>10–20%</td><td>Varies</td><td>Developer-specific terms</td></tr>
        </tbody>
    </table>

    <h2 id="formula">Monthly Payment Formula</h2>
    <div class="explanation__highlight">
        <strong>M = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1]</strong><br/><br/>
        Where:<br/>
        M = Monthly payment<br/>
        P = Financing amount (property price − down payment)<br/>
        r = Monthly profit rate (annual rate ÷ 12 ÷ 100)<br/>
        n = Total number of months (years × 12)
    </div>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: SAR 1,000,000 Property — First Home</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Property Price</td><td>SAR 1,000,000</td></tr>
            <tr><td>Down Payment (10%)</td><td>SAR 100,000</td></tr>
            <tr><td>Financing Amount</td><td>SAR 900,000</td></tr>
            <tr><td>APR (Profit Rate)</td><td>5.5%</td></tr>
            <tr><td>Tenure</td><td>25 years (300 months)</td></tr>
            <tr><td><strong>Monthly Payment</strong></td><td><strong>≈ SAR 5,529</strong></td></tr>
            <tr><td>Total Cost</td><td>SAR 1,658,700</td></tr>
            <tr><td>Total Profit Paid</td><td>SAR 758,700</td></tr>
            <tr><td>Min Salary (65% DTI)</td><td>SAR 8,506</td></tr>
        </tbody>
    </table>

    <h3>Example 2: SAR 1,500,000 Villa — Saudi Employee, SAR 20,000 Salary</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Property Price</td><td>SAR 1,500,000</td></tr>
            <tr><td>Down Payment (10%)</td><td>SAR 150,000</td></tr>
            <tr><td>Financing Amount</td><td>SAR 1,350,000</td></tr>
            <tr><td>APR</td><td>5.5%</td></tr>
            <tr><td>Tenure</td><td>25 years</td></tr>
            <tr><td><strong>Monthly Payment</strong></td><td><strong>≈ SAR 8,293</strong></td></tr>
            <tr><td>DTI</td><td>8,293 ÷ 20,000 = 41.5% ✅ OK</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Impact of Tenure Length</h3>
    <p>Same property: SAR 1M, 10% down, 5.5% APR — different tenures:</p>
    <table>
        <thead><tr><th>Tenure</th><th>Monthly Payment</th><th>Total Profit</th></tr></thead>
        <tbody>
            <tr><td>15 years</td><td>SAR 7,352</td><td>SAR 423,360</td></tr>
            <tr><td>20 years</td><td>SAR 6,198</td><td>SAR 587,520</td></tr>
            <tr><td>25 years</td><td>SAR 5,529</td><td>SAR 758,700</td></tr>
            <tr><td>30 years</td><td>SAR 5,112</td><td>SAR 940,320</td></tr>
        </tbody>
    </table>
    <p><em>Longer tenure = lower monthly payment but significantly more total profit paid.</em></p>

    <h2 id="vision-2030">Vision 2030 & Housing Programs</h2>
    <table>
        <thead><tr><th>Program</th><th>What It Offers</th></tr></thead>
        <tbody>
            <tr><td><strong>Sakani</strong></td><td>Personalized housing solutions — subsidized rates, land plots, ready homes</td></tr>
            <tr><td><strong>REDF</strong></td><td>Real Estate Development Fund — profit-free loans and subsidies for first-timers</td></tr>
            <tr><td><strong>SRC</strong></td><td>Saudi Real Estate Refinance Company — provides liquidity to enable long-term mortgages</td></tr>
        </tbody>
    </table>
    <p>The Housing Program under Vision 2030 aims to raise homeownership from <strong>47% (2016) to 70% by 2030</strong>. As of 2025, the rate has already exceeded 62%, supported by regulatory reforms and government subsidies.</p>

    <h2 id="banks">Saudi Banks Offering Home Financing</h2>
    <table>
        <thead><tr><th>Bank</th><th>Indicative APR</th><th>Products</th><th>Max Tenure</th></tr></thead>
        <tbody>
            <tr><td><strong>Al Rajhi Bank</strong></td><td>~5.50%</td><td>Murabaha / Ijara</td><td>30 years</td></tr>
            <tr><td><strong>Saudi National Bank</strong></td><td>~5.75%</td><td>Murabaha / Ijara</td><td>25 years</td></tr>
            <tr><td><strong>Riyad Bank</strong></td><td>~5.60%</td><td>Murabaha / Ijara</td><td>30 years</td></tr>
            <tr><td><strong>SAB (HSBC Saudi)</strong></td><td>~5.80%</td><td>Murabaha / Ijara</td><td>25 years</td></tr>
            <tr><td><strong>Emirates NBD</strong></td><td>~7.22%</td><td>Murabaha</td><td>20 years</td></tr>
            <tr><td><strong>Banque Saudi Fransi</strong></td><td>~5.90%</td><td>Murabaha / Ijara</td><td>25 years</td></tr>
            <tr><td><strong>Arab National Bank</strong></td><td>~5.75%</td><td>Murabaha / Ijara</td><td>25 years</td></tr>
            <tr><td><strong>Alinma Bank</strong></td><td>~5.65%</td><td>Murabaha / Musharaka</td><td>30 years</td></tr>
        </tbody>
    </table>

    <h2 id="documents">Required Documents</h2>
    <ul>
        <li><strong>National ID</strong> (Saudis) or <strong>Iqama</strong> (expatriates)</li>
        <li><strong>Salary certificate</strong> from employer</li>
        <li><strong>Bank statements</strong> (last 3-6 months)</li>
        <li><strong>SIMAH credit report</strong> (credit bureau check)</li>
        <li><strong>Property valuation report</strong></li>
        <li><strong>Employment contract</strong></li>
        <li><strong>Down payment proof</strong></li>
        <li>Self-employed: Additional financial statements, CR (commercial registration)</li>
    </ul>

    <h2 id="related">How Other KSA Calculators Help</h2>
    <table>
        <thead><tr><th>Calculator</th><th>How It Helps with Home Buying</th></tr></thead>
        <tbody>
            <tr><td><a href="/ksa/salary-calculator"><strong>Salary Calculator</strong></a></td><td>Calculate net salary for DTI assessment</td></tr>
            <tr><td><a href="/ksa/gosi-calculator"><strong>GOSI Calculator</strong></a></td><td>Banks verify employment via GOSI records</td></tr>
            <tr><td><a href="/ksa/vat-calculator"><strong>VAT Calculator</strong></a></td><td>Calculate 15% VAT on property (if applicable)</td></tr>
            <tr><td><a href="/ksa/end-of-service-calculator"><strong>EOSB Calculator</strong></a></td><td>Plan EOSB savings toward down payment</td></tr>
        </tbody>
    </table>
`;

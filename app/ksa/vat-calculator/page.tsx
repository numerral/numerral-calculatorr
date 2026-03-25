// Standalone page — /ksa/vat-calculator
// KSA VAT Calculator (15%) with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "VAT Calculator (KSA) — Saudi Arabia 15% VAT",
    description: "Add or remove 15% VAT for Saudi Arabia. Calculate VAT-inclusive and VAT-exclusive prices instantly. Covers ZATCA rules, zero-rated goods, exempt supplies, and e-invoicing.",
    keywords: ["VAT calculator Saudi Arabia", "Saudi VAT 15%", "حاسبة ضريبة القيمة المضافة", "add VAT KSA", "remove VAT Saudi", "ZATCA VAT", "Saudi Arabia tax calculator", "VAT inclusive exclusive"],
    alternates: { canonical: canonicalUrl("/ksa/vat-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is the VAT rate in Saudi Arabia?", answer: "The standard VAT rate in Saudi Arabia is 15%. This rate has been in effect since July 1, 2020, when it was increased from the original 5% rate (introduced January 1, 2018). The 15% rate applies to most goods and services supplied in the Kingdom." },
    { question: "How do I add VAT to a price?", answer: "To add 15% VAT: Total Price = Original Price × 1.15. For example, an item priced at SAR 1,000 excluding VAT: SAR 1,000 × 1.15 = SAR 1,150 (including VAT). The VAT amount is SAR 150." },
    { question: "How do I remove VAT from a price?", answer: "To remove 15% VAT: Original Price = Total Price ÷ 1.15. For example, a receipt shows SAR 1,150 including VAT: SAR 1,150 ÷ 1.15 = SAR 1,000 (excluding VAT). The VAT component is SAR 150." },
    { question: "What goods are zero-rated for VAT in Saudi Arabia?", answer: "Zero-rated supplies (0% VAT) include: exports of goods and services outside GCC countries, international goods and passenger transport, qualifying medicines and medical goods listed by ZATCA, the first supply of residential real estate within 3 years of completion, and precious metals (gold, silver, platinum) with 99%+ purity." },
    { question: "What is exempt from VAT in Saudi Arabia?", answer: "VAT-exempt supplies include: financial services (interest on loans, credit card operations), insurance for life policies, residential real estate rental (not commercial), securities trading, and issuance or transfer of debt securities. Businesses making exempt supplies cannot reclaim input VAT." },
    { question: "When must a business register for VAT in Saudi Arabia?", answer: "Mandatory registration is required when annual taxable supplies exceed SAR 375,000. Voluntary registration is available when supplies exceed SAR 187,500. Non-resident businesses making any taxable supplies in KSA must register regardless of turnover. Registration is done through the ZATCA portal (zatca.gov.sa)." },
    { question: "What is ZATCA?", answer: "ZATCA (Zakat, Tax and Customs Authority — هيئة الزكاة والضريبة والجمارك) is the Saudi government body responsible for collecting Zakat, taxes (including VAT), and customs duties. ZATCA issues VAT regulations, processes registrations, audits taxpayers, and enforces compliance." },
    { question: "What is Fatoora e-invoicing?", answer: "Fatoora (فاتورة) is Saudi Arabia's mandatory e-invoicing system implemented by ZATCA. Phase 1 (Generation — Dec 2021): All VAT-registered businesses must generate electronic invoices. Phase 2 (Integration — ongoing): Businesses must integrate with ZATCA's system for real-time invoice reporting and validation." },
    { question: "What are the penalties for VAT non-compliance?", answer: "Penalties include: Late registration — SAR 10,000; Late filing — 5-25% of unpaid VAT; Late payment — 5% of unpaid amount plus 1% per day; Tax evasion — up to 3× the evaded tax amount; Failure to issue tax invoices — SAR 5,000 per instance; Incorrect invoicing — SAR 10,000 per invoice." },
    { question: "Can tourists get VAT refunds in Saudi Arabia?", answer: "Yes, as of 2025, ZATCA has introduced a VAT refund scheme for international tourists. Qualifying purchases from approved retailers can be claimed at departure points. The scheme covers goods purchased during the visit and taken out of KSA. Detailed procedures and minimum purchase amounts are set by ZATCA." },
    { question: "Is VAT applied to online purchases in Saudi Arabia?", answer: "Yes. All e-commerce transactions within Saudi Arabia are subject to 15% VAT. For international online purchases: digital services (streaming, software, apps) supplied by non-resident providers are subject to VAT. Physical goods imported are subject to VAT at customs. Non-resident e-commerce sellers must register with ZATCA." },
    { question: "How often must VAT returns be filed?", answer: "Monthly: Businesses with annual taxable supplies exceeding SAR 40 million. Quarterly: All other VAT-registered businesses. Returns must be filed through the ZATCA portal within the last day of the month following the end of the tax period. Payment is due at the same time as the return filing." },
    { question: "What is input VAT and can I reclaim it?", answer: "Input VAT is the VAT paid by a business on its purchases and expenses. Businesses can reclaim input VAT if: (1) they are VAT-registered, (2) the purchases are used for making taxable supplies, (3) they hold valid tax invoices. Input VAT on exempt supplies cannot be reclaimed. The excess input VAT over output VAT can be carried forward or refunded." },
    { question: "Does VAT apply to rent in Saudi Arabia?", answer: "Commercial property rental is subject to 15% VAT. Residential property rental is exempt from VAT. This distinction is important: if you rent an office, warehouse, or shop — VAT applies. If you rent an apartment or villa for living — no VAT. Mixed-use properties are apportioned." },
    { question: "Why was Saudi VAT increased from 5% to 15%?", answer: "The VAT rate was tripled from 5% to 15% on July 1, 2020, as a fiscal measure to offset the impact of COVID-19 on oil revenues and government finances. The increase was part of broader austerity measures adopted by the Saudi government, including suspension of the cost-of-living allowance for government employees." },
];

export default function VATPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "VAT Calculator" },
        ]),
        webAppSchema("VAT Calculator (KSA — 15%)", canonicalUrl("/ksa/vat-calculator")),
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
            <Script id="schema-vat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "VAT Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>VAT Calculator (KSA — 15%)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Add or remove 15% VAT for Saudi Arabia. Calculate VAT-inclusive and VAT-exclusive prices instantly based on ZATCA regulations.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="vat" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="calc-card" style={{ marginTop: "var(--s-6)", padding: "var(--s-6)" }}>
                <div className="hub-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia VAT FAQ" items={FAQ_ITEMS} />

            <section className="calc-card" style={{ marginTop: "var(--s-4)", padding: "var(--s-4)" }}>
                <h3>Related KSA Calculators</h3>
                <p style={{ marginBottom: "var(--s-2)" }}>
                    <Link href="/ksa/end-of-service-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>🏢 End of Service Benefit Calculator</Link>
                    {" — "}Calculate your EOSB under Saudi Labor Law Articles 84, 85, and 87.
                </p>
                <p>
                    <Link href="/ksa/gosi-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>🏛️ GOSI Calculator</Link>
                    {" — "}Calculate your GOSI social insurance contributions for Saudi and non-Saudi employees.
                </p>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-vat">What Is VAT in Saudi Arabia?</h2>
    <p><strong>Value Added Tax (ضريبة القيمة المضافة — VAT)</strong> is an indirect consumption tax applied to most goods and services in Saudi Arabia at a standard rate of <strong>15%</strong>. It is collected at every stage of the supply chain — from manufacturer to wholesaler to retailer — but ultimately borne by the final consumer.</p>
    <p>VAT was first introduced in Saudi Arabia on <strong>January 1, 2018</strong>, at a rate of <strong>5%</strong> as part of the GCC-wide VAT framework. The rate was subsequently tripled to <strong>15%</strong> on <strong>July 1, 2020</strong>, as a fiscal response to the economic impact of COVID-19 and declining oil revenues.</p>
    <p>The tax is administered by <strong>ZATCA (Zakat, Tax and Customs Authority — هيئة الزكاة والضريبة والجمارك)</strong>, which handles registration, compliance, auditing, and enforcement.</p>

    <h2 id="vat-history">VAT Rate History</h2>
    <table>
        <thead><tr><th>Period</th><th>Rate</th><th>Context</th></tr></thead>
        <tbody>
            <tr><td>Before Jan 1, 2018</td><td>0%</td><td>No VAT — Saudi Arabia had no consumption tax</td></tr>
            <tr><td>Jan 1, 2018 – Jun 30, 2020</td><td>5%</td><td>GCC-wide VAT introduction (originally planned as permanent rate)</td></tr>
            <tr><td>Jul 1, 2020 – Present</td><td><strong>15%</strong></td><td>Tripled due to COVID-19 fiscal pressure and oil price decline</td></tr>
        </tbody>
    </table>

    <h2 id="formulas">How to Calculate VAT — Formulas</h2>
    <h3>Adding VAT (Price Excluding VAT → Price Including VAT)</h3>
    <div class="explanation__highlight">
        <strong>Formula:</strong> Total Price = Original Price × (1 + VAT Rate)<br/>
        <strong>With 15%:</strong> Total Price = Original Price × 1.15<br/>
        <strong>VAT Amount:</strong> Original Price × 0.15
    </div>

    <h3>Removing VAT (Price Including VAT → Price Excluding VAT)</h3>
    <div class="explanation__highlight">
        <strong>Formula:</strong> Original Price = Total Price ÷ (1 + VAT Rate)<br/>
        <strong>With 15%:</strong> Original Price = Total Price ÷ 1.15<br/>
        <strong>VAT Amount:</strong> Total Price − Original Price
    </div>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: Adding VAT to a Restaurant Bill</h3>
    <p>Food & beverages total: <strong>SAR 350</strong> (excluding VAT)</p>
    <ol>
        <li>VAT Amount: SAR 350 × 0.15 = <strong>SAR 52.50</strong></li>
        <li>Total Bill: SAR 350 + SAR 52.50 = <strong>SAR 402.50</strong></li>
    </ol>

    <h3>Example 2: Removing VAT from an Electronics Purchase</h3>
    <p>Receipt shows: <strong>SAR 5,750</strong> (including VAT)</p>
    <ol>
        <li>Original Price: SAR 5,750 ÷ 1.15 = <strong>SAR 5,000</strong></li>
        <li>VAT Paid: SAR 5,750 − SAR 5,000 = <strong>SAR 750</strong></li>
    </ol>

    <h3>Example 3: Business Invoice with Multiple Items</h3>
    <table>
        <thead><tr><th>Item</th><th>Price (excl. VAT)</th><th>VAT (15%)</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>Office Supplies</td><td>SAR 2,000</td><td>SAR 300</td><td>SAR 2,300</td></tr>
            <tr><td>Software License</td><td>SAR 8,000</td><td>SAR 1,200</td><td>SAR 9,200</td></tr>
            <tr><td>Consulting Fee</td><td>SAR 15,000</td><td>SAR 2,250</td><td>SAR 17,250</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 25,000</strong></td><td><strong>SAR 3,750</strong></td><td><strong>SAR 28,750</strong></td></tr>
        </tbody>
    </table>

    <h2 id="classification">Zero-Rated vs Exempt vs Standard-Rated</h2>
    <p>Not all goods and services are taxed at 15%. Saudi Arabia's VAT law classifies supplies into three categories:</p>
    <table>
        <thead><tr><th>Category</th><th>Rate</th><th>Input VAT Recovery</th><th>Impact on Business</th></tr></thead>
        <tbody>
            <tr><td><strong>Standard-Rated</strong></td><td>15%</td><td>✅ Fully recoverable</td><td>Most goods &amp; services</td></tr>
            <tr><td><strong>Zero-Rated</strong></td><td>0%</td><td>✅ Fully recoverable</td><td>No VAT charged, but can reclaim input VAT</td></tr>
            <tr><td><strong>Exempt</strong></td><td>N/A</td><td>❌ Not recoverable</td><td>No VAT charged, cannot reclaim input VAT</td></tr>
        </tbody>
    </table>

    <h3>Zero-Rated Supplies (0% VAT)</h3>
    <ul>
        <li><strong>Exports</strong> of goods and services outside GCC countries</li>
        <li><strong>International transport</strong> — goods and passenger services</li>
        <li><strong>Qualifying medicines</strong> — listed by the Saudi Food &amp; Drug Authority (SFDA)</li>
        <li><strong>Qualifying medical equipment</strong> — per ZATCA approved list</li>
        <li><strong>Precious metals</strong> — gold, silver, platinum with 99%+ purity for investment</li>
        <li><strong>First supply of residential property</strong> — within 3 years of completion (up to SAR 1M under government housing support)</li>
        <li><strong>Qualifying means of transport</strong> — aircraft, ships for international use</li>
    </ul>

    <h3>Exempt Supplies (No VAT)</h3>
    <ul>
        <li><strong>Financial services</strong> — interest on loans, credit facilities, margin-based products</li>
        <li><strong>Life insurance</strong> — premiums and related services</li>
        <li><strong>Residential property rental</strong> — apartments, villas for living (NOT commercial)</li>
        <li><strong>Local passenger transport</strong> — buses, metro within Saudi Arabia</li>
        <li><strong>Securities</strong> — trading of shares, bonds, sukuk</li>
    </ul>

    <h2 id="registration">VAT Registration</h2>
    <table>
        <thead><tr><th>Type</th><th>Threshold</th><th>Deadline</th></tr></thead>
        <tbody>
            <tr><td><strong>Mandatory</strong></td><td>Annual taxable supplies &gt; SAR 375,000</td><td>Within 30 days of exceeding threshold</td></tr>
            <tr><td><strong>Voluntary</strong></td><td>Annual supplies &gt; SAR 187,500</td><td>Optional — benefits: input VAT recovery</td></tr>
            <tr><td><strong>Non-Resident</strong></td><td>Any taxable supply in KSA</td><td>Before first supply — no threshold</td></tr>
        </tbody>
    </table>
    <p><strong>How to register:</strong> Through the ZATCA portal at <strong>zatca.gov.sa</strong>. Required documents include commercial registration (CR), national address, bank account details, and financial records.</p>

    <h2 id="e-invoicing">ZATCA E-Invoicing (Fatoora — فاتورة)</h2>
    <p>Saudi Arabia has implemented a <strong>mandatory e-invoicing system</strong> called Fatoora in two phases:</p>
    <table>
        <thead><tr><th>Phase</th><th>Effective Date</th><th>Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Phase 1 — Generation</strong></td><td>December 4, 2021</td><td>All VAT-registered businesses must generate electronic invoices and store them electronically</td></tr>
            <tr><td><strong>Phase 2 — Integration</strong></td><td>January 2023 (waves)</td><td>Businesses must integrate with ZATCA's system for real-time reporting. Rolled out in waves by revenue size</td></tr>
        </tbody>
    </table>
    <p><strong>E-invoice requirements:</strong> Each invoice must contain: seller &amp; buyer TIN, invoice date, sequential number, description of goods/services, quantity, unit price, VAT amount, total, and QR code (for simplified invoices).</p>

    <h2 id="vat-return">VAT Return Filing</h2>
    <table>
        <thead><tr><th>Annual Revenue</th><th>Filing Frequency</th><th>Due Date</th></tr></thead>
        <tbody>
            <tr><td>Above SAR 40 million</td><td>Monthly</td><td>Last day of the following month</td></tr>
            <tr><td>Below SAR 40 million</td><td>Quarterly</td><td>Last day of the month after quarter end</td></tr>
        </tbody>
    </table>
    <p>Returns are filed through the ZATCA online portal. The return includes: total output VAT collected, total input VAT paid, net VAT payable (or refundable), adjustments for bad debts and credit notes.</p>

    <h2 id="penalties">Penalties for Non-Compliance</h2>
    <table>
        <thead><tr><th>Violation</th><th>Penalty</th></tr></thead>
        <tbody>
            <tr><td>Late VAT registration</td><td>SAR 10,000</td></tr>
            <tr><td>Late filing of VAT return</td><td>5–25% of unpaid VAT</td></tr>
            <tr><td>Late VAT payment</td><td>5% of unpaid amount + 1% per day (max 25%)</td></tr>
            <tr><td>Tax evasion</td><td>Up to 3× the evaded tax amount</td></tr>
            <tr><td>Failure to issue tax invoice</td><td>SAR 5,000 per instance</td></tr>
            <tr><td>Incorrect tax invoice</td><td>SAR 10,000 per invoice</td></tr>
            <tr><td>Failure to maintain records</td><td>SAR 50,000</td></tr>
            <tr><td>Charging VAT without registration</td><td>Up to SAR 100,000</td></tr>
        </tbody>
    </table>

    <h2 id="tourist-refund">Tourist VAT Refund (2025)</h2>
    <p>Starting 2025, ZATCA has introduced a <strong>VAT refund scheme for international tourists</strong>. Key features:</p>
    <ul>
        <li>Applies to goods purchased from <strong>approved retailers</strong> during the tourist's visit</li>
        <li>Goods must be <strong>taken out of Saudi Arabia</strong> upon departure</li>
        <li>Refunds are processed at <strong>departure points</strong> (airports, seaports, land borders)</li>
        <li>The scheme is part of Saudi Arabia's Vision 2030 tourism promotion strategy</li>
    </ul>

    <h2 id="input-output">Input VAT vs Output VAT</h2>
    <table>
        <thead><tr><th>Type</th><th>Definition</th><th>Example</th></tr></thead>
        <tbody>
            <tr><td><strong>Output VAT</strong></td><td>VAT collected from customers on sales</td><td>You sell goods for SAR 1,150 — output VAT = SAR 150</td></tr>
            <tr><td><strong>Input VAT</strong></td><td>VAT paid to suppliers on purchases</td><td>You buy supplies for SAR 575 — input VAT = SAR 75</td></tr>
            <tr><td><strong>Net VAT Payable</strong></td><td>Output VAT − Input VAT</td><td>SAR 150 − SAR 75 = SAR 75 payable to ZATCA</td></tr>
        </tbody>
    </table>
    <p>If input VAT exceeds output VAT, the business can carry the credit forward to offset future VAT liabilities, or apply for a <strong>refund from ZATCA</strong>.</p>
`;

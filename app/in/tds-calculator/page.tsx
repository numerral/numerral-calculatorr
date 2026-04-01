import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import TDSCalculatorCore from "@/components/calculator/TDSCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "TDS Calculator India 2026 — All Sections Rate Chart, Penalty Calculator & Filing Calendar | Numerral",
    description: "Free TDS Calculator with 4 modes: Section-wise TDS Calculator (23+ sections including 194A, 194C, 194H, 194I, 194IA, 194J, 194S, 194T), Complete Rate Chart with PAN/No-PAN rates, Penalty & Interest Calculator (Sec 201/234E/271H), and Quarterly Filing Calendar with Form 24Q/26Q/27Q due dates.",
    keywords: ["TDS calculator", "TDS rate chart 2026", "TDS on salary", "TDS on rent", "TDS on professional fees", "Section 194A", "Section 194C", "Section 194J", "TDS on property", "TDS on crypto", "TDS penalty calculator", "Form 26AS", "TDS return filing", "TDS due dates"],
    alternates: buildCountryAlternates("IN", "/in/tds-calculator", "tds-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is TDS in India?", answer: "TDS (Tax Deducted at Source) is a method of collecting income tax in India where the payer deducts a specified percentage of tax from certain payments (salary, rent, interest, professional fees, etc.) before making the payment and deposits it directly with the government. The recipient gets credit for TDS against their total tax liability when filing ITR. TDS ensures steady revenue collection throughout the year and reduces tax evasion." },
    { question: "What are the TDS rates for FY 2025-26?", answer: "Key TDS rates for FY 2025-26: Section 194A (Bank/FD Interest): 10%. Section 194C (Contractor): 1% Individual, 2% Others. Section 194H (Commission): 2%. Section 194I (Rent - Building): 10%. Section 194I (Rent - P&M): 2%. Section 194IA (Property >₹50L): 1%. Section 194J (Professional Fees): 10%. Section 194J(a) (Technical Services): 2%. Section 194K (MF Dividend): 10%. Section 194S (Crypto): 1%. Section 194T (Partners - NEW): 10%. Without PAN, most sections attract 20% TDS." },
    { question: "What is the threshold limit for TDS?", answer: "TDS is deducted only when the payment exceeds the prescribed threshold limit. Key thresholds for FY 2025-26: Section 194A (Interest): ₹50,000 (₹1,00,000 for senior citizens). Section 194C (Contractor): ₹30,000 per transaction or ₹1,00,000 aggregate. Section 194H (Commission): ₹20,000. Section 194I (Rent): ₹50,000 per year. Section 194IA (Property): ₹50,00,000. Section 194J (Professional): ₹50,000. Section 194S (Crypto): ₹50,000 (₹10,000 for specified persons)." },
    { question: "What happens if PAN is not provided?", answer: "If the recipient does not furnish PAN or provides an invalid/inoperative PAN, TDS is deducted at a HIGHER rate — typically 20% or the applicable rate, whichever is higher (Section 206AA). Additionally, if PAN is not linked with Aadhaar, it becomes 'inoperative' and the higher rate applies. This can significantly increase the tax burden. For example, bank interest normally attracts 10% TDS, but without PAN it becomes 20%." },
    { question: "What is the due date for TDS deposit?", answer: "TDS must be deposited with the government by the 7th of the following month. For example, TDS deducted in June must be deposited by 7th July. Exception: TDS deducted in March must be deposited by 30th April. For government deductors, same-day deposit is required. Late deposit attracts interest at 1.5% per month under Section 201(1A)." },
    { question: "What are the TDS return filing due dates?", answer: "TDS returns are filed quarterly: Q1 (April-June): 31st July. Q2 (July-September): 31st October. Q3 (October-December): 31st January. Q4 (January-March): 31st May. Returns are filed using Form 24Q (salary), Form 26Q (non-salary residents), Form 27Q (non-residents), and Form 27EQ (TCS). Late filing attracts ₹200/day penalty under Section 234E." },
    { question: "What is the penalty for late TDS deposit?", answer: "Penalties for TDS non-compliance: (1) Interest for non-deduction: 1% per month from date TDS was deductible to date of actual deduction (Sec 201(1A)(i)). (2) Interest for late deposit: 1.5% per month from date of deduction to date of actual deposit (Sec 201(1A)(ii)). (3) Late filing fee: ₹200 per day until return is filed, capped at total TDS amount (Sec 234E). (4) Additional penalty: ₹10,000 to ₹1,00,000 for late/incorrect returns (Sec 271H)." },
    { question: "What is Form 26AS and why is it important?", answer: "Form 26AS is your annual consolidated tax credit statement maintained by the Income Tax Department. It shows: (1) All TDS deducted against your PAN. (2) TCS collected. (3) Advance tax and self-assessment tax paid. (4) High-value transactions reported. It is crucial to verify Form 26AS before filing ITR to ensure all TDS credits are reflected. Any mismatch between 26AS and your ITR may trigger a notice." },
    { question: "What is the difference between Form 16 and Form 16A?", answer: "Form 16 is issued by your employer annually as proof of TDS deducted on salary (Section 192). It contains Part A (TDS details) and Part B (income breakdown, deductions). Form 16A is issued quarterly by any deductor for non-salary TDS (bank interest, rent, professional fees, etc.). Both forms are essential for filing your ITR and claiming TDS credit." },
    { question: "How to apply for a Lower Deduction Certificate?", answer: "If your actual tax liability is lower than the standard TDS rate, you can apply for a Lower Deduction Certificate (LDC) under Section 197. Process: (1) Login to incometax.gov.in. (2) Go to Authorized Representatives → Apply for Lower/Nil TDS. (3) Submit Form 13 with income estimates. (4) AO issues certificate with reduced rate (e.g., 2% instead of 10%). Valid for one financial year. Commonly used by freelancers, contractors, and senior citizens." },
    { question: "Is TDS applicable on crypto/VDA transactions?", answer: "Yes, since FY 2022-23, Section 194S requires 1% TDS on transfer of Virtual Digital Assets (crypto, NFTs) when the consideration exceeds ₹50,000 per year (₹10,000 for specified persons like exchanges). The buyer/exchange deducts TDS. This is separate from the 30% income tax on crypto gains under Section 115BBH. Use our Capital Gains Tax Calculator for computing crypto tax." },
    { question: "What is the new Section 194T for partner payments?", answer: "Section 194T is a NEW provision effective from FY 2025-26. It requires firms and LLPs to deduct TDS at 10% on payments made to partners including: salary, remuneration, commission, bonus, and interest. Threshold: ₹20,000 per year. Without PAN: 20%. This is a significant change — earlier, partner payments were not subject to TDS. Firms must now obtain TAN and file quarterly returns for partner payments." },
    { question: "Can TDS be refunded?", answer: "Yes, if excess TDS has been deducted beyond your actual tax liability, you can claim a refund by filing your Income Tax Return (ITR). The refund is processed after the ITR is assessed by the CPC (Centralized Processing Centre). Refunds are credited directly to your linked bank account. Typically takes 3-6 months. You can track refund status on incometax.gov.in or through Form 26AS." },
    { question: "What is TDS on rent (Section 194I vs 194IB)?", answer: "Section 194I applies when the PAYER is a person liable for tax audit (business/professional with turnover criteria). Rate: 2% for plant & machinery, 10% for land/building. Threshold: ₹50,000 per year. Section 194IB applies when the PAYER is an individual/HUF NOT liable for tax audit who pays rent > ₹50,000 per MONTH. Rate: 5%. Both require PAN of landlord; without PAN, 20% applies." },
    { question: "What is TDS on property purchase (Section 194IA)?", answer: "Section 194IA requires the buyer of immovable property (except agricultural land) to deduct 1% TDS if the sale consideration exceeds ₹50 lakh. The buyer must: (1) Deduct 1% TDS. (2) Deposit via Form 26QB within 30 days of month-end. (3) Issue Form 16B to the seller. There is no TAN requirement — buyer uses PAN directly. The threshold of ₹50 lakh includes stamp duty value if higher than actual consideration." },
];

export default function TDSCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "TDS Calculator" },
        ]),
        webAppSchema("TDS Calculator India 2026", canonicalUrl("/in/tds-calculator")),
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
            <Script id="schema-tds" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "TDS Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>TDS Calculator India 2026</h1>
            <PageDesc>
                Free TDS Calculator with 4 modes: Section-wise TDS Calculator covering 23+ sections (194A, 194C, 194H, 194I, 194IA, 194IB, 194J, 194K, 194O, 194Q, 194R, 194S, 194T, and more) with PAN/No-PAN impact and Individual vs Company rates, Complete TDS Rate Chart with category filters, Penalty &amp; Interest Calculator for late deposit and non-deduction (Sections 201, 234E, 271H), and Quarterly Filing Calendar with Form 24Q/26Q/27Q due dates. Updated for FY 2025-26 including the new Section 194T for partner payments.
            </PageDesc>
            <AuthorBadge categoryKey="tax" />
            <TDSCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="TDS Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    {RELATED.map((r, i) => (
                        <Link key={i} href={r.href} className="in-related-link">
                            <span className="in-related-link__icon">{r.icon}</span>
                            <div className="in-related-link__text">
                                <div className="in-related-link__title">{r.title}</div>
                                <div className="in-related-link__desc">{r.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}

const RELATED = [
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "TDS is advance tax — see total liability under Old vs New Regime" },
    { href: "/in/capital-gains-tax-calculator", icon: "📈", title: "Capital Gains Tax Calculator", desc: "LTCG/STCG tax on equity, MF, property — TDS applies on property" },
    { href: "/in/hra-calculator", icon: "🏠", title: "HRA Calculator", desc: "Rent TDS under 194I/194IB and HRA exemption" },
    { href: "/in/salary-calculator", icon: "💰", title: "Salary Calculator", desc: "TDS on salary under Section 192 — net take-home computation" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "TDS on FD interest under Section 194A at 10%" },
    { href: "/in/mutual-fund-returns-calculator", icon: "📊", title: "Mutual Fund Calculator", desc: "TDS on MF dividend under Section 194K at 10%" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "Another payroll deduction — state-wise PT" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "NPS employer contribution — 80CCD(2) and TDS implications" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "PPF interest is exempt — no TDS applicable" },
    { href: "/in/rd-calculator", icon: "🏦", title: "RD Calculator", desc: "TDS on RD interest under Section 194A" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Calculator", desc: "Post-tax retirement planning" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-tds">What is TDS (Tax Deducted at Source)?</h2>
    <p><strong>Tax Deducted at Source (TDS)</strong> is a mechanism under the Indian Income Tax Act where the payer (deductor) deducts a specified percentage of tax from certain payments — such as salary, interest, rent, professional fees, and commissions — before making the payment to the recipient (deductee). The deducted tax is deposited with the government on behalf of the recipient.</p>
    <div class="explanation__highlight">
        <strong>TDS Formula:</strong> TDS Amount = Payment Amount × Applicable TDS Rate<br>
        <strong>Net Amount Payable:</strong> Net Amount = Payment Amount − TDS Amount
    </div>
    <p>TDS serves dual purposes: (1) it ensures <strong>steady revenue collection</strong> throughout the year instead of a lump-sum payment at year-end, and (2) it creates an <strong>audit trail</strong> of income, reducing tax evasion. The recipient can claim credit for TDS when filing their Income Tax Return (ITR). Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to see how TDS fits into your total tax liability.</p>

    <h2 id="tds-rate-chart">Complete TDS Rate Chart — FY 2025-26 (AY 2026-27)</h2>
    <table>
        <thead><tr><th>Section</th><th>Nature of Payment</th><th>Threshold</th><th>Ind/HUF Rate</th><th>Others Rate</th><th>No PAN Rate</th></tr></thead>
        <tbody>
            <tr><td><strong>192</strong></td><td>Salary</td><td>Exemption limit</td><td>Slab rate</td><td>—</td><td>20%</td></tr>
            <tr><td><strong>194A</strong></td><td>Interest (Banks/FD/RD)</td><td>₹50,000 (₹1L Sr.)</td><td>10%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194B</strong></td><td>Lottery/Games</td><td>₹10,000</td><td>30%</td><td>30%</td><td>30%</td></tr>
            <tr><td><strong>194C</strong></td><td>Contractor</td><td>₹30K/₹1L agg.</td><td>1%</td><td>2%</td><td>20%</td></tr>
            <tr><td><strong>194D</strong></td><td>Insurance Commission</td><td>₹20,000</td><td>5%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194H</strong></td><td>Commission/Brokerage</td><td>₹20,000</td><td>2%</td><td>2%</td><td>20%</td></tr>
            <tr><td><strong>194I(a)</strong></td><td>Rent — Plant & Machinery</td><td>₹50,000/yr</td><td>2%</td><td>2%</td><td>20%</td></tr>
            <tr><td><strong>194I(b)</strong></td><td>Rent — Building/Land</td><td>₹50,000/yr</td><td>10%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194IA</strong></td><td>Property Purchase</td><td>₹50,00,000</td><td>1%</td><td>1%</td><td>20%</td></tr>
            <tr><td><strong>194IB</strong></td><td>Rent (Ind/HUF, no audit)</td><td>₹50,000/month</td><td>5%</td><td>5%</td><td>20%</td></tr>
            <tr><td><strong>194J</strong></td><td>Professional Fees</td><td>₹50,000</td><td>10%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194J(a)</strong></td><td>Technical Services</td><td>₹50,000</td><td>2%</td><td>2%</td><td>20%</td></tr>
            <tr><td><strong>194K</strong></td><td>MF Dividend</td><td>₹10,000</td><td>10%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194O</strong></td><td>E-Commerce Operator</td><td>₹5,00,000</td><td>0.1%</td><td>0.1%</td><td>5%</td></tr>
            <tr><td><strong>194Q</strong></td><td>Purchase of Goods</td><td>₹50,00,000</td><td>0.1%</td><td>0.1%</td><td>5%</td></tr>
            <tr><td><strong>194R</strong></td><td>Business Perquisite</td><td>₹20,000</td><td>10%</td><td>10%</td><td>20%</td></tr>
            <tr><td><strong>194S</strong></td><td>Crypto/VDA Transfer</td><td>₹50,000</td><td>1%</td><td>1%</td><td>20%</td></tr>
            <tr style="background:#fffbeb"><td><strong>194T ★</strong></td><td>Partner Payments (NEW)</td><td>₹20,000</td><td>10%</td><td>10%</td><td>20%</td></tr>
        </tbody>
    </table>
    <p>★ <strong>Section 194T is new from FY 2025-26</strong> — firms and LLPs must now deduct TDS on salary, remuneration, commission, and interest paid to partners.</p>

    <h2 id="tds-on-salary">TDS on Salary — Section 192</h2>
    <p>TDS on salary is the most common form of TDS. Your employer estimates your total annual income, applicable deductions (80C, 80D, HRA, etc.), and deducts TDS at your <strong>average slab rate</strong> each month. Key points:</p>
    <ul>
        <li>Employer considers your investment declarations (proof submission usually by February)</li>
        <li>Standard deduction of ₹75,000 (New Regime) / ₹50,000 (Old Regime) is factored in</li>
        <li>HRA exemption reduces TDS — use our <a href="/in/hra-calculator">HRA Calculator</a></li>
        <li>If you have income from other sources, you can declare it via Form 12BB</li>
        <li>Form 16 is issued annually as TDS certificate</li>
    </ul>
    <p>Use our <a href="/in/salary-calculator">Salary Calculator</a> to compute your exact in-hand salary after TDS and other deductions.</p>

    <h2 id="tds-on-interest">TDS on Interest — Section 194A</h2>
    <p>Banks, post offices, and cooperative societies deduct TDS at <strong>10%</strong> on interest income from fixed deposits, recurring deposits, and savings accounts when interest exceeds:</p>
    <table>
        <thead><tr><th>Recipient</th><th>Threshold (per FY)</th><th>TDS Rate</th></tr></thead>
        <tbody>
            <tr><td>General (below 60 years)</td><td>₹50,000</td><td>10%</td></tr>
            <tr><td>Senior Citizens (60+)</td><td>₹1,00,000</td><td>10%</td></tr>
            <tr><td>Without PAN</td><td>₹50,000 / ₹1,00,000</td><td>20%</td></tr>
        </tbody>
    </table>
    <p>To avoid TDS if your total income is below taxable limit, submit <strong>Form 15G</strong> (below 60) or <strong>Form 15H</strong> (senior citizens) to your bank. See our <a href="/in/fd-calculator">FD Calculator</a> for post-TDS returns on fixed deposits.</p>

    <h2 id="tds-on-rent">TDS on Rent — Sections 194I & 194IB</h2>
    <table>
        <thead><tr><th>Feature</th><th>Section 194I</th><th>Section 194IB</th></tr></thead>
        <tbody>
            <tr><td><strong>Who Deducts?</strong></td><td>Any person (except Ind/HUF without audit)</td><td>Individual/HUF NOT liable for tax audit</td></tr>
            <tr><td><strong>Threshold</strong></td><td>₹50,000 per FY</td><td>₹50,000 per MONTH</td></tr>
            <tr><td><strong>Rate (Building)</strong></td><td>10%</td><td>5%</td></tr>
            <tr><td><strong>Rate (P&M)</strong></td><td>2%</td><td>N/A</td></tr>
            <tr><td><strong>TAN Required?</strong></td><td>Yes</td><td>No (use PAN)</td></tr>
            <tr><td><strong>Deposit Form</strong></td><td>Challan 281</td><td>Form 26QC</td></tr>
        </tbody>
    </table>

    <h2 id="tds-on-property">TDS on Property Purchase — Section 194IA</h2>
    <p>Any person buying immovable property (except agricultural land) where consideration exceeds <strong>₹50 lakh</strong> must deduct <strong>1% TDS</strong>.</p>
    <ul>
        <li>Deposit via <strong>Form 26QB</strong> within 30 days of month-end</li>
        <li>Issue <strong>Form 16B</strong> to the seller</li>
        <li>No TAN requirement — buyer uses their PAN</li>
        <li>Stamp duty value applies if higher than actual consideration</li>
        <li>Use our <a href="/in/capital-gains-tax-calculator">Capital Gains Tax Calculator</a> to compute the seller&rsquo;s LTCG/STCG liability</li>
    </ul>

    <h2 id="tds-on-professional">TDS on Professional & Technical Fees — Section 194J</h2>
    <p>Key distinction: <strong>Professional fees</strong> (CA, lawyer, architect, doctor): <strong>10%</strong>. <strong>Technical services</strong> (call centres, IT services): <strong>2%</strong> under 194J(a). Threshold: ₹50,000 per FY. Royalty: 10%.</p>

    <h2 id="tds-on-crypto">TDS on Crypto/VDA — Section 194S</h2>
    <p>Since FY 2022-23, all transfers of Virtual Digital Assets (crypto, NFTs) attract <strong>1% TDS</strong> under Section 194S:</p>
    <table>
        <thead><tr><th>Detail</th><th>Rule</th></tr></thead>
        <tbody>
            <tr><td>Rate</td><td>1% on gross consideration</td></tr>
            <tr><td>Threshold (General)</td><td>₹50,000 per FY</td></tr>
            <tr><td>Threshold (Specified — exchanges)</td><td>₹10,000 per FY</td></tr>
            <tr><td>Who Deducts?</td><td>Buyer / Exchange</td></tr>
            <tr><td>Income Tax on Gain</td><td>30% flat (Section 115BBH)</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/capital-gains-tax-calculator">Capital Gains Tax Calculator</a> (Mode 1 → Crypto/VDA) for complete crypto tax computation.</p>

    <h2 id="section-194t">NEW Section 194T — TDS on Partner Payments (FY 2025-26)</h2>
    <div class="explanation__highlight">
        <strong>NEW:</strong> From FY 2025-26, firms and LLPs must deduct TDS at <strong>10%</strong> on salary, remuneration, commission, bonus, and interest paid to partners when the annual payment exceeds <strong>₹20,000</strong>. Without PAN: 20%.
    </div>
    <p>This is a significant compliance change. Partnership firms now need a TAN and must include partner payments in quarterly TDS returns (Form 26Q).</p>

    <h2 id="pan-impact">PAN Impact on TDS — Section 206AA</h2>
    <p>If the recipient does not provide a valid PAN, TDS is deducted at the <strong>HIGHER of</strong>:</p>
    <ul>
        <li>The prescribed rate under the applicable section</li>
        <li>20% (for most sections)</li>
        <li>5% (for Sections 194O and 194Q — e-commerce and goods purchase)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Aadhaar-PAN Linkage:</strong> If your PAN is not linked with Aadhaar, it becomes &ldquo;inoperative&rdquo; and is treated as if PAN is not furnished — triggering 20% TDS. Ensure your PAN-Aadhaar linkage is active.
    </div>

    <h2 id="penalty-interest">Penalty & Interest for TDS Non-Compliance</h2>
    <table>
        <thead><tr><th>Default</th><th>Section</th><th>Rate / Amount</th></tr></thead>
        <tbody>
            <tr><td>Failure to deduct TDS</td><td>201(1A)(i)</td><td>1% per month (from due date to actual deduction)</td></tr>
            <tr><td>Failure to deposit TDS</td><td>201(1A)(ii)</td><td>1.5% per month (from deduction to actual deposit)</td></tr>
            <tr><td>Late filing of TDS return</td><td>234E</td><td>₹200 per day (capped at TDS amount)</td></tr>
            <tr><td>Incorrect/late return</td><td>271H</td><td>₹10,000 to ₹1,00,000 penalty</td></tr>
            <tr><td>Non-deduction (assessee in default)</td><td>201(1)</td><td>Deductor is treated as assessee in default</td></tr>
        </tbody>
    </table>
    <p>Use our <strong>Penalty Calculator</strong> (Mode 3 above) to estimate the financial impact of TDS non-compliance.</p>

    <h2 id="forms-guide">TDS Forms & Returns — Complete Guide</h2>
    <table>
        <thead><tr><th>Form</th><th>Purpose</th><th>Filed By</th><th>Frequency</th></tr></thead>
        <tbody>
            <tr><td><strong>Form 24Q</strong></td><td>TDS on Salary</td><td>Employer</td><td>Quarterly</td></tr>
            <tr><td><strong>Form 26Q</strong></td><td>TDS on Non-Salary (Residents)</td><td>Deductor</td><td>Quarterly</td></tr>
            <tr><td><strong>Form 27Q</strong></td><td>TDS on Non-Residents</td><td>Deductor</td><td>Quarterly</td></tr>
            <tr><td><strong>Form 27EQ</strong></td><td>TCS Returns</td><td>Collector</td><td>Quarterly</td></tr>
            <tr><td><strong>Form 16</strong></td><td>Salary TDS Certificate</td><td>Employer to Employee</td><td>Annual</td></tr>
            <tr><td><strong>Form 16A</strong></td><td>Non-Salary TDS Certificate</td><td>Deductor to Deductee</td><td>Quarterly</td></tr>
            <tr><td><strong>Form 26AS</strong></td><td>Tax Credit Statement</td><td>IT Department</td><td>Real-time</td></tr>
            <tr><td><strong>Form 26QB</strong></td><td>Property TDS (194IA)</td><td>Buyer</td><td>Per transaction</td></tr>
            <tr><td><strong>Form 26QC</strong></td><td>Rent TDS (194IB)</td><td>Tenant (Ind/HUF)</td><td>Per transaction</td></tr>
            <tr><td><strong>Form 15G/15H</strong></td><td>Declaration — No TDS on interest</td><td>Recipient</td><td>Annual</td></tr>
            <tr><td><strong>Form 13</strong></td><td>Lower Deduction Certificate</td><td>Recipient</td><td>Annual</td></tr>
            <tr><td><strong>Challan 281</strong></td><td>TDS Payment Challan</td><td>Deductor</td><td>Monthly</td></tr>
        </tbody>
    </table>

    <h2 id="lower-certificate">Lower Deduction Certificate — Section 197</h2>
    <p>If your actual tax liability is lower than the standard TDS rate, you can apply for a <strong>Lower Deduction Certificate (LDC)</strong> via Form 13 on the Income Tax e-filing portal. The Assessing Officer may issue a certificate allowing TDS at a reduced rate (even NIL). Common use cases: freelancers with multiple clients, senior citizens, exporters, and contractors with thin margins.</p>

    <h2 id="form-15g-15h">Form 15G & 15H — Avoid TDS on Interest</h2>
    <p><strong>Form 15G</strong> (below 60 years) and <strong>Form 15H</strong> (60+ years) allow you to declare that your total income is below the taxable limit, preventing the bank from deducting TDS on interest. Conditions:</p>
    <ul>
        <li>Total income must be below basic exemption limit</li>
        <li>Tax liability on total income must be NIL</li>
        <li>Must be filed with each bank/institution separately</li>
        <li>Renewed annually at the start of each FY</li>
    </ul>
`;

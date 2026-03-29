import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import IncomeTaxIndiaCore from "@/components/calculator/IncomeTaxIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Income Tax Calculator India FY 2025-26 — New & Old Regime Comparison | Budget 2025",
    description: "Free income tax calculator for FY 2025-26 (AY 2026-27) with 3 modes: New Regime (Budget 2025 slabs, ₹12L tax-free), Old Regime (80C/80D/HRA/24b deductions), and side-by-side Regime Comparison. Includes surcharge rates, Section 87A rebate, advance tax dates, ITR form guide, and tax-saving investments.",
    keywords: ["income tax calculator India", "income tax calculator FY 2025-26", "new tax regime 2025-26", "old vs new regime", "income tax slabs 2025-26", "Section 80C deductions", "87A rebate", "tax calculator India 2026", "budget 2025 income tax", "HRA exemption calculator"],
    alternates: { canonical: canonicalUrl("/in/income-tax-calculator") },
};

const FAQ_ITEMS = [
    { question: "How to calculate income tax for FY 2025-26?", answer: "Step 1: Add all income sources (salary, interest, rental, other). Step 2: Subtract standard deduction (₹75,000 new regime / ₹50,000 old regime). Step 3: Subtract eligible deductions (80C, 80D, HRA, etc. — old regime only). Step 4: Apply tax slabs to get raw tax. Step 5: Subtract Section 87A rebate if eligible (up to ₹60,000 in new regime for income ≤₹12L). Step 6: Add surcharge (if income >₹50L) and 4% Health & Education Cess. Use our calculator above to do this instantly." },
    { question: "What is the new tax regime for FY 2025-26?", answer: "The new tax regime (Section 115BAC), updated by Budget 2025, has 7 slabs: Nil up to ₹4L, 5% (₹4-8L), 10% (₹8-12L), 15% (₹12-16L), 20% (₹16-20L), 25% (₹20-24L), 30% (above ₹24L). It offers a ₹75,000 standard deduction for salaried individuals, Section 87A rebate making income up to ₹12 lakh tax-free (₹12.75L for salaried), but does NOT allow most deductions like 80C, 80D, HRA, or home loan interest. It is the default regime — you must opt out to use the old regime." },
    { question: "Is income up to ₹12 lakh tax-free in the new regime?", answer: "Yes. Under the new tax regime for FY 2025-26, the Section 87A rebate has been increased to ₹60,000, which fully offsets the tax liability on income up to ₹12 lakh. For salaried taxpayers, adding the ₹75,000 standard deduction means gross salary income up to ₹12.75 lakh is effectively tax-free. Marginal relief also ensures that taxpayers earning slightly above ₹12 lakh don't face a disproportionate tax jump." },
    { question: "What is the difference between old and new tax regime?", answer: "The new regime has lower tax rates but doesn't allow most deductions (80C, 80D, HRA, home loan interest). The old regime has higher rates but allows all deductions. Key differences: Standard deduction is ₹75K (new) vs ₹50K (old). 87A rebate is ₹60K on ₹12L income (new) vs ₹12.5K on ₹5L (old). 80C/80D/HRA/24(b) are available ONLY in old regime. Employer NPS 80CCD(2) is available in BOTH regimes. The new regime is better if your total deductions are less than approximately ₹3.75-4.5 lakh." },
    { question: "Which regime is better — old or new?", answer: "It depends on your deductions. As a rule of thumb: if your total deductions (80C + 80D + HRA + home loan + NPS + 80TTA) are LESS than ₹3.75 lakh, the new regime is usually better. If your deductions exceed ₹4.5 lakh, the old regime often wins. Use our 'Compare Regimes' mode above to see the exact difference for your specific income and deductions. Salaried employees can switch between regimes every year when filing ITR." },
    { question: "What are Section 80C deductions?", answer: "Section 80C allows deductions up to ₹1,50,000 per year for investments in: PPF (Public Provident Fund), EPF (Employee Provident Fund contribution), ELSS (Equity Linked Savings Scheme — mutual funds), Life Insurance premiums (LIC, etc.), NSC (National Savings Certificate), Sukanya Samriddhi Yojana, 5-year Tax-Saving FD, Principal repayment on home loan, Tuition fees (up to 2 children), and SCSS (Senior Citizens Savings Scheme). Available ONLY in the old tax regime." },
    { question: "How much health insurance premium can I claim under 80D?", answer: "Section 80D limits: Self/Spouse/Children — ₹25,000 (below 60 years) or ₹50,000 (senior citizen 60+). Parents — additional ₹25,000 (below 60) or ₹50,000 (senior citizen). Maximum total: ₹1,00,000 if both you and parents are senior citizens. A ₹5,000 sub-limit for preventive health check-ups is included within these limits. Premiums must be paid via non-cash mode. For uninsured senior citizens, actual medical expenses up to ₹50,000 can be claimed. Available ONLY in old regime." },
    { question: "What is Section 80CCD(1B) for NPS?", answer: "Section 80CCD(1B) provides an ADDITIONAL deduction of ₹50,000 for contributions to the National Pension System (NPS) Tier 1 account. This is OVER AND ABOVE the ₹1.5 lakh limit of Section 80C. At the 30% tax slab, this saves ₹15,600 in tax annually (₹50,000 × 30% + 4% cess). Note: This is available only in the OLD regime. However, employer's NPS contribution under 80CCD(2) (up to 10-14% of basic salary) is deductible in BOTH regimes." },
    { question: "Can I switch between old and new regime?", answer: "Yes, with conditions: Salaried individuals (no business income) can switch between old and new regime every financial year while filing their Income Tax Return (ITR). Business/profession income earners who opt out of the new regime can switch back only ONCE — after that, the choice is permanent. The new regime is the DEFAULT — if you don't specifically opt for the old regime, you'll be taxed under new regime rules. You can inform your employer about your regime choice for TDS purposes using Form 12BAA." },
    { question: "What is surcharge on income tax?", answer: "Surcharge is an additional tax on the income tax amount for high-income earners. New Regime rates: 10% (income ₹50L-₹1Cr), 15% (₹1Cr-₹2Cr), 25% (above ₹2Cr — capped at 25% in new regime). Old Regime rates: 10% (₹50L-₹1Cr), 15% (₹1Cr-₹2Cr), 25% (₹2Cr-₹5Cr), 37% (above ₹5Cr). Marginal relief ensures that the total tax+surcharge does not exceed total income minus the threshold. Surcharge on LTCG/STCG/dividends is generally capped at 15%." },
    { question: "What is the 4% health and education cess?", answer: "The Health and Education Cess is a 4% charge applied on the total of income tax + surcharge. It funds primary education and health infrastructure. Example: if your income tax is ₹1,00,000 and surcharge is ₹10,000 → cess = 4% × ₹1,10,000 = ₹4,400 → total liability = ₹1,14,400. The cess applies equally in both old and new regimes. It replaced the earlier 3% education cess from FY 2018-19 onwards." },
    { question: "What are the advance tax due dates?", answer: "If your total tax liability exceeds ₹10,000 in a financial year, you must pay advance tax in 4 instalments: 15 June — at least 15% of total liability. 15 September — at least 45% of total liability (cumulative). 15 December — at least 75% of total liability (cumulative). 15 March — 100% of total liability. Late payment attracts interest under Section 234B (default) and 234C (deferment). Senior citizens without business income are exempt from advance tax." },
    { question: "What is Section 87A rebate?", answer: "Section 87A provides a tax rebate (direct reduction from tax payable) for resident individuals with low income. FY 2025-26 limits: New Regime — rebate up to ₹60,000 for taxable income up to ₹12,00,000 (effectively zero tax up to ₹12L). Old Regime — rebate up to ₹12,500 for taxable income up to ₹5,00,000. The rebate applies only to income tax — surcharge and cess are calculated after rebate. NRIs are NOT eligible for Section 87A rebate." },
    { question: "Is HRA exemption available in new regime?", answer: "No. House Rent Allowance (HRA) exemption is NOT available in the new tax regime. It is available only in the old tax regime. The HRA exemption is the MINIMUM of: (1) Actual HRA received, (2) 50% of basic salary (metro cities) or 40% (non-metro), (3) Rent paid minus 10% of basic salary. If you pay significant rent and receive HRA, this can be a major reason to prefer the old regime. Use our calculator's 'Compare Regimes' mode to check if HRA makes the old regime better for you." },
    { question: "Which ITR form should I use?", answer: "ITR-1 (Sahaj): Salaried individuals with income up to ₹50L from salary, one house property, other sources (interest), and agricultural income up to ₹5,000. ITR-2: Individuals with capital gains, multiple house properties, foreign income/assets, or income above ₹50L. ITR-3: Individuals with business or professional income. ITR-4 (Sugam): Presumptive income under Section 44AD/44ADA/44AE. Most salaried employees use ITR-1. Due date: 31 July for non-audit cases." },
];

export default function IncomeTaxCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Income Tax Calculator" },
        ]),
        webAppSchema("Income Tax Calculator India FY 2025-26", canonicalUrl("/in/income-tax-calculator")),
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
            <Script id="schema-tax" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Income Tax Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Income Tax Calculator India — FY 2025-26</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your income tax for FY 2025-26 (AY 2026-27) with 3 modes — New Regime (Budget 2025 slabs, ₹12 lakh tax-free),
                Old Regime (full 80C/80D/HRA/home loan deductions), and instant side-by-side Regime Comparison.
                Includes slab-by-slab breakdown, surcharge, 4% cess, Section 87A rebate, and monthly TDS.
            </p>
            <AuthorBadge categoryKey="salary" />
            <IncomeTaxIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Income Tax Calculator FAQ — India FY 2025-26" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">ELSS SIPs qualify under Section 80C tax saving</div>
                        </div>
                    </Link>
                    <Link href="/in/ppf-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">PPF Calculator</div>
                            <div className="in-related-link__desc">PPF qualifies under 80C + EEE tax-free returns</div>
                        </div>
                    </Link>
                    <Link href="/in/pension-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏦</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Pension Calculator</div>
                            <div className="in-related-link__desc">NPS contributions save ₹50K extra under 80CCD(1B)</div>
                        </div>
                    </Link>
                    <Link href="/in/hlv-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🛡️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">HLV Calculator</div>
                            <div className="in-related-link__desc">Term insurance premium qualifies under Section 80C</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-income-tax-calculator">What Is an Income Tax Calculator?</h2>
    <p>An <strong>income tax calculator</strong> is a tool that helps you estimate your total tax liability for a given financial year based on your income, deductions, and applicable tax slabs. In India, the Income Tax Act, 1961 governs direct taxation, administered by the <strong>Central Board of Direct Taxes (CBDT)</strong> under the Ministry of Finance.</p>
    <p>For <strong>FY 2025-26 (Assessment Year 2026-27)</strong>, Budget 2025 introduced significant changes to the new tax regime — making income up to <strong>₹12 lakh tax-free</strong> (₹12.75 lakh for salaried individuals). Our calculator covers both regimes with slab-by-slab breakdowns, surcharge, cess, and Section 87A rebate.</p>
    <div class="explanation__highlight">
        <strong>Key Change — Budget 2025:</strong> The new regime now has a <strong>₹4 lakh basic exemption</strong> (up from ₹3L), <strong>₹75,000 standard deduction</strong> (up from ₹50K in old regime), and enhanced <strong>Section 87A rebate of ₹60,000</strong> — making income up to ₹12 lakh completely tax-free under the new regime. Compare both regimes using our calculator above.
    </div>

    <h2 id="new-regime-slabs">Income Tax Slabs — New Regime FY 2025-26 (Budget 2025)</h2>
    <p>The <strong>new tax regime</strong> under Section 115BAC is the <strong>default regime</strong> for all taxpayers. It features lower rates but restricts most deductions:</p>
    <table>
        <thead><tr><th>Annual Income</th><th>Tax Rate</th><th>Tax on Slab</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹4,00,000</td><td><strong>Nil</strong></td><td>₹0</td></tr>
            <tr><td>₹4,00,001 &ndash; ₹8,00,000</td><td>5%</td><td>₹20,000</td></tr>
            <tr><td>₹8,00,001 &ndash; ₹12,00,000</td><td>10%</td><td>₹40,000</td></tr>
            <tr><td>₹12,00,001 &ndash; ₹16,00,000</td><td>15%</td><td>₹60,000</td></tr>
            <tr><td>₹16,00,001 &ndash; ₹20,00,000</td><td>20%</td><td>₹80,000</td></tr>
            <tr><td>₹20,00,001 &ndash; ₹24,00,000</td><td>25%</td><td>₹1,00,000</td></tr>
            <tr><td>Above ₹24,00,000</td><td><strong>30%</strong></td><td>Varies</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>₹12 Lakh Tax-Free:</strong> With the Section 87A rebate of ₹60,000, taxpayers with taxable income up to ₹12 lakh pay <strong>zero income tax</strong>. For salaried individuals, the ₹75,000 standard deduction means gross salary up to <strong>₹12,75,000 is tax-free</strong>. Marginal relief ensures no sudden tax jump for incomes slightly above ₹12L.
    </div>

    <h2 id="old-regime-slabs">Income Tax Slabs — Old Regime FY 2025-26</h2>
    <p>The old regime offers <strong>higher tax rates</strong> but allows all deductions (80C, 80D, HRA, home loan, etc.). Slabs vary by age:</p>
    <h3>Individuals Below 60 Years</h3>
    <table>
        <thead><tr><th>Annual Income</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹2,50,000</td><td>Nil</td></tr>
            <tr><td>₹2,50,001 &ndash; ₹5,00,000</td><td>5%</td></tr>
            <tr><td>₹5,00,001 &ndash; ₹10,00,000</td><td>20%</td></tr>
            <tr><td>Above ₹10,00,000</td><td>30%</td></tr>
        </tbody>
    </table>
    <h3>Senior Citizens (60&ndash;80 Years)</h3>
    <table>
        <thead><tr><th>Annual Income</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹3,00,000</td><td>Nil</td></tr>
            <tr><td>₹3,00,001 &ndash; ₹5,00,000</td><td>5%</td></tr>
            <tr><td>₹5,00,001 &ndash; ₹10,00,000</td><td>20%</td></tr>
            <tr><td>Above ₹10,00,000</td><td>30%</td></tr>
        </tbody>
    </table>
    <h3>Super Senior Citizens (80+ Years)</h3>
    <table>
        <thead><tr><th>Annual Income</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹5,00,000</td><td>Nil</td></tr>
            <tr><td>₹5,00,001 &ndash; ₹10,00,000</td><td>20%</td></tr>
            <tr><td>Above ₹10,00,000</td><td>30%</td></tr>
        </tbody>
    </table>

    <h2 id="old-vs-new">New Regime vs Old Regime — Which Should You Choose?</h2>
    <table>
        <thead><tr><th>Parameter</th><th>New Regime</th><th>Old Regime</th></tr></thead>
        <tbody>
            <tr><td><strong>Default?</strong></td><td>✅ Yes (opt-out required for old)</td><td>Must opt in</td></tr>
            <tr><td><strong>Basic Exemption</strong></td><td>₹4,00,000</td><td>₹2.5L / ₹3L / ₹5L (age-based)</td></tr>
            <tr><td><strong>Standard Deduction</strong></td><td>₹75,000</td><td>₹50,000</td></tr>
            <tr><td><strong>Section 80C (₹1.5L)</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>Section 80D (Health)</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>80CCD(1B) — NPS ₹50K</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>80CCD(2) — Employer NPS</strong></td><td><strong>✅ Available</strong></td><td>✅ Available</td></tr>
            <tr><td><strong>HRA Exemption</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>Home Loan Interest (₹2L)</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>LTA</strong></td><td>❌ Not available</td><td>✅ Available</td></tr>
            <tr><td><strong>87A Rebate</strong></td><td>₹60,000 (up to ₹12L income)</td><td>₹12,500 (up to ₹5L income)</td></tr>
            <tr><td><strong>Tax-free Income</strong></td><td><strong>Up to ₹12.75L</strong> (salaried)</td><td>Up to ₹5L</td></tr>
            <tr><td><strong>Can Switch?</strong></td><td>Every year (salaried)</td><td>Every year (salaried)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Decision Rule:</strong> If your total old-regime deductions (80C + 80D + HRA + NPS + home loan + 80TTA) are <strong>less than ₹3.75 lakh</strong>, the new regime is almost always better. If deductions exceed <strong>₹4.5 lakh</strong>, old regime likely wins. Use our <strong>Compare Regimes</strong> mode above for your exact numbers.
    </div>

    <h2 id="all-deductions">All Tax Deductions &amp; Exemptions — Complete Guide</h2>
    <table>
        <thead><tr><th>Section</th><th>Description</th><th>Limit</th><th>New Regime?</th></tr></thead>
        <tbody>
            <tr><td><strong>80C</strong></td><td>PPF, ELSS, EPF, LIC, NSC, SSY, FD, home loan principal</td><td>₹1,50,000</td><td>❌</td></tr>
            <tr><td><strong>80CCC</strong></td><td>Pension fund contributions</td><td>Within 80C limit</td><td>❌</td></tr>
            <tr><td><strong>80CCD(1)</strong></td><td>Employee NPS contribution</td><td>Within 80C limit</td><td>❌</td></tr>
            <tr><td><strong>80CCD(1B)</strong></td><td>Additional NPS (exclusive)</td><td><strong>₹50,000</strong></td><td>❌</td></tr>
            <tr><td><strong>80CCD(2)</strong></td><td>Employer NPS contribution</td><td>10% of salary (14% for govt)</td><td><strong>✅</strong></td></tr>
            <tr><td><strong>80D</strong></td><td>Health insurance premium</td><td>₹25K&ndash;₹1L (age-based)</td><td>❌</td></tr>
            <tr><td><strong>80DD</strong></td><td>Disabled dependent</td><td>₹75K / ₹1.25L</td><td>❌</td></tr>
            <tr><td><strong>80E</strong></td><td>Education loan interest</td><td>No limit (interest only)</td><td>❌</td></tr>
            <tr><td><strong>80G</strong></td><td>Donations to charity</td><td>50%&ndash;100% of donation</td><td>❌</td></tr>
            <tr><td><strong>80GG</strong></td><td>Rent paid (no HRA from employer)</td><td>₹60,000/yr</td><td>❌</td></tr>
            <tr><td><strong>80TTA</strong></td><td>Savings account interest</td><td>₹10,000</td><td>❌</td></tr>
            <tr><td><strong>80TTB</strong></td><td>Interest income (seniors only)</td><td>₹50,000</td><td>❌</td></tr>
            <tr><td><strong>Section 24(b)</strong></td><td>Home loan interest</td><td>₹2,00,000 (self-occupied)</td><td>❌</td></tr>
            <tr><td><strong>HRA</strong></td><td>House Rent Allowance</td><td>Formula-based</td><td>❌</td></tr>
            <tr><td><strong>LTA</strong></td><td>Leave Travel Allowance</td><td>Actual travel cost</td><td>❌</td></tr>
            <tr><td><strong>Std. Deduction</strong></td><td>Flat deduction for salaried</td><td>₹50K (old) / ₹75K (new)</td><td>✅</td></tr>
        </tbody>
    </table>

    <h2 id="worked-example">How to Calculate Income Tax — Worked Example</h2>
    <h3>Example: ₹15 Lakh Salary (FY 2025-26)</h3>
    <table>
        <thead><tr><th>Step</th><th>New Regime</th><th>Old Regime (with deductions)</th></tr></thead>
        <tbody>
            <tr><td>Gross Salary</td><td>₹15,00,000</td><td>₹15,00,000</td></tr>
            <tr><td>Standard Deduction</td><td>&minus;₹75,000</td><td>&minus;₹50,000</td></tr>
            <tr><td>80C (EPF+PPF+ELSS)</td><td>&mdash;</td><td>&minus;₹1,50,000</td></tr>
            <tr><td>80D (Health Ins.)</td><td>&mdash;</td><td>&minus;₹25,000</td></tr>
            <tr><td>80CCD(1B) NPS</td><td>&mdash;</td><td>&minus;₹50,000</td></tr>
            <tr><td>HRA Exemption</td><td>&mdash;</td><td>&minus;₹1,80,000</td></tr>
            <tr><td><strong>Taxable Income</strong></td><td><strong>₹14,25,000</strong></td><td><strong>₹10,45,000</strong></td></tr>
            <tr><td>Tax on slabs</td><td>₹93,750</td><td>₹1,09,000</td></tr>
            <tr><td>87A Rebate</td><td>₹0 (income &gt; ₹12L)</td><td>₹0 (income &gt; ₹5L)</td></tr>
            <tr><td>Cess (4%)</td><td>₹3,750</td><td>₹4,360</td></tr>
            <tr><td><strong>Total Tax</strong></td><td><strong>₹97,500</strong></td><td><strong>₹1,13,360</strong></td></tr>
            <tr><td><strong>Savings</strong></td><td colspan="2"><strong>New regime saves ₹15,860</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> Even with ₹4.05 lakh in deductions, the new regime still saves ₹15,860 on a ₹15L salary. The old regime becomes beneficial only when deductions exceed roughly ₹4.5 lakh (e.g., high HRA in metros + home loan interest + 80C + 80D + NPS).
    </div>

    <h2 id="surcharge-rates">Surcharge Rates on Income Tax</h2>
    <table>
        <thead><tr><th>Total Income</th><th>New Regime Surcharge</th><th>Old Regime Surcharge</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹50 Lakh</td><td>Nil</td><td>Nil</td></tr>
            <tr><td>₹50L &ndash; ₹1 Crore</td><td>10%</td><td>10%</td></tr>
            <tr><td>₹1Cr &ndash; ₹2 Crore</td><td>15%</td><td>15%</td></tr>
            <tr><td>₹2Cr &ndash; ₹5 Crore</td><td><strong>25% (capped)</strong></td><td>25%</td></tr>
            <tr><td>Above ₹5 Crore</td><td><strong>25% (capped)</strong></td><td>37%</td></tr>
        </tbody>
    </table>
    <p><strong>Marginal Relief:</strong> If your income slightly exceeds a surcharge threshold, the total tax+surcharge is limited so that it doesn&rsquo;t exceed the tax you&rsquo;d pay at the threshold plus the excess income. This prevents a ₹1 increase in income causing a disproportionate tax jump.</p>

    <h2 id="advance-tax">Advance Tax Due Dates — FY 2025-26</h2>
    <p>If your total tax liability (after TDS) exceeds <strong>₹10,000</strong>, you must pay advance tax:</p>
    <table>
        <thead><tr><th>Due Date</th><th>Cumulative %</th><th>Instalment</th></tr></thead>
        <tbody>
            <tr><td><strong>15 June 2025</strong></td><td>15%</td><td>First instalment</td></tr>
            <tr><td><strong>15 September 2025</strong></td><td>45%</td><td>Second instalment</td></tr>
            <tr><td><strong>15 December 2025</strong></td><td>75%</td><td>Third instalment</td></tr>
            <tr><td><strong>15 March 2026</strong></td><td>100%</td><td>Final instalment</td></tr>
        </tbody>
    </table>
    <p><strong>Penalty:</strong> Interest under Section 234B (1% per month for non-payment) and Section 234C (1% per month for deferment) applies on shortfall. Senior citizens (60+) without business income are exempt from advance tax.</p>

    <h2 id="itr-forms">ITR Forms Guide — Which Form to Use</h2>
    <table>
        <thead><tr><th>ITR Form</th><th>Who Should Use</th><th>Income Limit</th></tr></thead>
        <tbody>
            <tr><td><strong>ITR-1 (Sahaj)</strong></td><td>Salaried, one house property, other sources, agriculture &le; ₹5K</td><td>Up to ₹50 Lakh</td></tr>
            <tr><td><strong>ITR-2</strong></td><td>Individuals with capital gains, multiple properties, foreign income</td><td>No limit</td></tr>
            <tr><td><strong>ITR-3</strong></td><td>Individuals with business/profession income</td><td>No limit</td></tr>
            <tr><td><strong>ITR-4 (Sugam)</strong></td><td>Presumptive income (44AD/44ADA/44AE)</td><td>Up to ₹50 Lakh</td></tr>
        </tbody>
    </table>
    <p><strong>Due Date:</strong> 31 July (non-audit), 31 October (audit cases). Belated return can be filed until 31 December with a penalty of ₹5,000 (₹1,000 if income &le; ₹5L).</p>

    <h2 id="special-incomes">Tax on Special Incomes</h2>
    <table>
        <thead><tr><th>Income Type</th><th>Tax Rate</th><th>Section</th></tr></thead>
        <tbody>
            <tr><td><strong>STCG (Equity/MF)</strong></td><td>20%</td><td>Section 111A</td></tr>
            <tr><td><strong>LTCG (Equity/MF)</strong></td><td>12.5% (above ₹1.25L exemption)</td><td>Section 112A</td></tr>
            <tr><td><strong>LTCG (Other assets)</strong></td><td>12.5%</td><td>Section 112</td></tr>
            <tr><td><strong>FD Interest</strong></td><td>Slab rate (added to income)</td><td>Included in &ldquo;other sources&rdquo;</td></tr>
            <tr><td><strong>Dividend Income</strong></td><td>Slab rate</td><td>Included in &ldquo;other sources&rdquo;</td></tr>
            <tr><td><strong>Digital Assets (Crypto)</strong></td><td><strong>30% flat</strong> (no deductions)</td><td>Section 115BBH</td></tr>
            <tr><td><strong>Lottery/Winnings</strong></td><td>30% flat</td><td>Section 115BB</td></tr>
        </tbody>
    </table>

    <h2 id="tax-saving-comparison">Tax-Saving Investment Comparison</h2>
    <p>If you choose the old regime, these investments help reduce tax under Section 80C (₹1.5L limit):</p>
    <table>
        <thead><tr><th>Investment</th><th>Returns</th><th>Lock-in</th><th>Risk</th><th>Tax on Returns</th></tr></thead>
        <tbody>
            <tr><td><strong>ELSS (Equity Mutual Fund)</strong></td><td>12&ndash;15% (historical)</td><td><strong>3 years</strong> (shortest)</td><td>High</td><td>LTCG &gt; ₹1.25L at 12.5%</td></tr>
            <tr><td><strong><a href="/in/ppf-calculator">PPF</a></strong></td><td>7.1% (govt-set)</td><td>15 years</td><td>Zero</td><td><strong>Tax-free (EEE)</strong></td></tr>
            <tr><td><strong><a href="/in/pension-calculator">NPS</a> via 80CCD(1B)</strong></td><td>8&ndash;14% (market-linked)</td><td>Until 60</td><td>Moderate</td><td>60% lump sum tax-free; annuity taxable</td></tr>
            <tr><td><strong>Sukanya Samriddhi (SSY)</strong></td><td>8.2%</td><td>Until girl child turns 21</td><td>Zero</td><td><strong>Tax-free (EEE)</strong></td></tr>
            <tr><td><strong>Tax-Saving FD</strong></td><td>6.5&ndash;7.5%</td><td>5 years</td><td>Zero</td><td>Interest taxable at slab</td></tr>
            <tr><td><strong>NSC</strong></td><td>7.7%</td><td>5 years</td><td>Zero</td><td>Interest taxable (reinvested qualifies under 80C)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Best Strategy:</strong> ELSS combines tax saving (80C) with highest potential returns and shortest lock-in (3 years). Invest via <a href="/in/sip-calculator">monthly SIP</a> for rupee-cost averaging. After ELSS, maximize <a href="/in/ppf-calculator">PPF</a> (guaranteed tax-free returns) and <a href="/in/pension-calculator">NPS</a> (extra ₹50K under 80CCD(1B)).
    </div>

    <h2 id="common-mistakes">Common Mistakes in Income Tax Filing</h2>
    <ol>
        <li><strong>Not comparing regimes</strong> &mdash; Many default to the new regime without checking if old regime saves more. Use our Compare Regimes mode above.</li>
        <li><strong>Forgetting to claim 80CCD(1B)</strong> &mdash; The extra ₹50,000 NPS deduction is OVER AND ABOVE 80C. Saves ₹15,600 at 30% slab. See our <a href="/in/pension-calculator">Pension Calculator</a>.</li>
        <li><strong>Missing advance tax</strong> &mdash; Interest under 234B/234C applies on shortfall. Pay by due dates (June/Sept/Dec/March).</li>
        <li><strong>Not verifying Form 26AS / AIS</strong> &mdash; Mismatch between TDS declared and AIS data triggers scrutiny. Always reconcile before filing.</li>
        <li><strong>Wrong ITR form</strong> &mdash; Using ITR-1 when you have capital gains leads to defective return notice.</li>
        <li><strong>Ignoring HRA calculation</strong> &mdash; HRA exemption requires rent receipts and landlord PAN (if rent &gt; ₹1L/yr). Claim properly in old regime.</li>
        <li><strong>Not claiming employer NPS</strong> &mdash; 80CCD(2) is available in BOTH regimes. Many new-regime taxpayers miss this free deduction.</li>
    </ol>

    <h2 id="section-80d-limits">Section 80D — Health Insurance Deduction Limits</h2>
    <table>
        <thead><tr><th>Category</th><th>Below 60 Years</th><th>Senior Citizen (60+)</th></tr></thead>
        <tbody>
            <tr><td><strong>Self, Spouse &amp; Children</strong></td><td>₹25,000</td><td>₹50,000</td></tr>
            <tr><td><strong>Parents</strong></td><td>₹25,000</td><td>₹50,000</td></tr>
            <tr><td><strong>Max Total</strong></td><td>₹50,000</td><td><strong>₹1,00,000</strong></td></tr>
            <tr><td><strong>Preventive Health Check-up</strong></td><td colspan="2">₹5,000 (included within above limits)</td></tr>
        </tbody>
    </table>

    <h2 id="hra-formula">HRA Exemption Formula</h2>
    <p>House Rent Allowance exemption under the <strong>old regime</strong> is the <strong>minimum</strong> of:</p>
    <ol>
        <li>Actual HRA received from employer</li>
        <li>50% of basic salary (metro cities: Delhi, Mumbai, Chennai, Kolkata) or 40% (non-metro)</li>
        <li>Rent paid minus 10% of basic salary</li>
    </ol>
    <div class="explanation__highlight">
        <strong>Example:</strong> Basic salary ₹6L, HRA ₹3L, rent ₹15,000/month (₹1.8L/year), non-metro city.<br/>
        (1) Actual HRA = ₹3,00,000<br/>
        (2) 40% of basic = ₹2,40,000<br/>
        (3) Rent &minus; 10% basic = ₹1,80,000 &minus; ₹60,000 = ₹1,20,000<br/>
        <strong>HRA Exemption = ₹1,20,000</strong> (minimum of the three)
    </div>
`;

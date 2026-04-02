import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import SalaryCalculatorCore from "@/components/calculator/SalaryCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "In-Hand Salary Calculator India 2026 — CTC to Take-Home Salary | FY 2025-26 New & Old Tax Regime",
    description: "Free In-Hand Salary Calculator for India. Enter your CTC or Gross Salary and instantly see your monthly take-home pay after EPF, Professional Tax, Gratuity, and Income Tax (TDS). Updated for FY 2025-26 New Tax Regime with ₹12.75L zero-tax threshold, Section 87A rebate, and state-wise Professional Tax rates.",
    keywords: ["salary calculator", "in hand salary calculator", "CTC to take home salary", "in hand salary calculator India", "take home pay calculator", "salary calculator India 2026", "CTC calculator", "gross to net salary", "salary after tax India", "10 LPA in hand salary", "15 LPA in hand salary", "new tax regime 2025-26", "salary slip components", "EPF deduction on salary"],
    alternates: buildCountryAlternates("IN", "/in/in-hand-salary-calculator", "in-hand-salary-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is the in-hand salary for 10 LPA CTC?", answer: "For a ₹10 Lakh CTC (Basic at 50%), your approximate in-hand salary is ₹69,000–₹72,000 per month under the New Tax Regime (FY 2025-26). Breakdown: Gross ≈ ₹9.11L after removing Employer EPF (₹60K) and Gratuity (₹29K). Deductions from Gross: Employee EPF ₹60,000, Professional Tax ₹2,400, Income Tax ≈ ₹10,400. Annual take-home ≈ ₹8.38L. Income up to ₹12.75L is effectively tax-free under the New Regime (Section 87A rebate + ₹75K standard deduction)." },
    { question: "What is the difference between CTC, Gross Salary, and In-Hand Salary?", answer: "CTC (Cost to Company) = Total annual cost to employer, including Employer EPF, Gratuity, and insurance. Gross Salary = CTC minus employer contributions — this appears on your salary slip before deductions. In-Hand Salary = Gross minus your deductions (Employee EPF, Professional Tax, Income Tax TDS). Example: ₹12L CTC → ~₹10.7L Gross → ~₹88,000/month in-hand (New Regime, effectively zero tax up to ₹12.75L)." },
    { question: "How is income tax calculated on salary in India?", answer: "Step 1: Calculate Gross Salary (CTC minus Employer EPF, Gratuity). Step 2: Subtract Standard Deduction (₹75,000 New Regime / ₹50,000 Old Regime). Step 3: Subtract eligible deductions (80C, 80D, HRA — Old Regime only). Step 4: Apply slab rates to the resulting Taxable Income. Step 5: Add 4% Health & Education Cess. The final tax is divided by 12 and deducted monthly as TDS by your employer." },
    { question: "Which is better — Old Tax Regime or New Tax Regime for salaried employees?", answer: "Rule of thumb: If your total deductions (80C + 80D + HRA exemption + home loan interest) exceed ₹3.75 Lakh, the Old Regime may give higher take-home. Below that, the New Regime almost always wins. New Regime advantage: Income up to ₹12.75L (including ₹75K standard deduction) is tax-free. Old Regime advantage: Allows HRA exemption, 80C (₹1.5L), 80D (health insurance), and Section 24(b) home loan interest (₹2L)." },
    { question: "Does CTC include PF and Gratuity?", answer: "Yes. CTC includes BOTH Employer EPF (12% of Basic) and Gratuity (4.81% of Basic). These are costs the company bears but the amounts never reach your bank account monthly. Employer EPF goes to your PF account (you get it at retirement or job change). Gratuity is payable only after 5 years of continuous service. Your own Employee EPF (12% of Basic) is also deducted from Gross Salary before arriving at In-Hand." },
    { question: "Why is my in-hand salary so much less than my CTC?", answer: "Because CTC includes 'hidden' costs: Employer EPF (~6% of CTC), Gratuity (~2.4% of CTC), employer health insurance (₹5–25K/year). Then your own contributions are deducted: Employee EPF (another ~6%), Professional Tax (₹200/month), and Income Tax (TDS based on your slab). At ₹15L CTC, the gap is typically 25–30% — you take home ₹10–11L annually." },
    { question: "How much Professional Tax is deducted from salary?", answer: "Professional Tax is a state-level tax capped at ₹2,500/year (Article 276). Most states charge ₹200/month. States like Delhi, Rajasthan, UP, Tamil Nadu do NOT levy PT. Maharashtra has a gender exception — women earning ≤₹25,000/month are exempt. PT is fully deductible from taxable income under Section 16(iii) in both Old and New Tax Regimes." },
    { question: "Can I reduce my EPF contribution to increase take-home salary?", answer: "If your Basic exceeds ₹15,000/month, you can request HR to restrict your EPF contribution to the statutory minimum of ₹1,800/month (12% of ₹15,000). This can increase monthly in-hand by ₹2,000–₹8,000 depending on your Basic. Trade-off: You'll build a smaller retirement corpus and lose the tax-free 8.25% annual returns on the difference." },
    { question: "How is Gratuity calculated on salary?", answer: "Formula: Gratuity = (Basic Salary + DA) × 15 × Years of Service ÷ 26. Example: Basic ₹5,00,000/year, DA ₹0, Service 10 years → Gratuity = (5,00,000 × 15 × 10) ÷ 26 = ₹2,88,462. Eligibility requires 5 years continuous service (waived for death/disability). Tax exemption up to ₹20 Lakhs under Section 10(10)." },
    { question: "Is the salary calculator updated for FY 2025-26 budget changes?", answer: "Yes. Our Numerral salary calculator uses the latest Union Budget 2025 tax slabs: ₹4L basic exemption (New Regime), 7 slabs from 5% to 30%, ₹12L full rebate under Section 87A, ₹75,000 standard deduction for salaried employees, and current EPF interest rate of 8.25%. The Old Regime slabs (₹2.5L/₹5L/₹10L) are also fully supported." },
    { question: "What is 15 LPA in hand salary per month?", answer: "For ₹15 LPA CTC under the New Tax Regime (FY 2025-26): Monthly In-Hand ≈ ₹99,000–₹1,04,000. Annual tax ≈ ₹56,000 (effective rate ~3.7%). Breakdown: Basic (40%) = ₹6L, HRA = ₹3L, Gross ≈ ₹13.6L, Employee EPF = ₹72K, PT = ₹2,400, Tax = ₹56K. Take-home ≈ ₹12.1L/year." },
    { question: "How to calculate TDS on salary?", answer: "Your employer estimates your total annual income, subtracts standard deduction and declared deductions (Form 12BB), applies slab rates to the taxable amount, adds 4% cess, and divides by 12 for monthly TDS. Under New Regime, only standard deduction (₹75K) and employer NPS (80CCD2) are subtracted. Under Old Regime, 80C, 80D, HRA, LTA, and home loan interest are also subtracted." },
    { question: "What is the Section 87A rebate for salaried employees?", answer: "Under the New Tax Regime (FY 2025-26), Section 87A provides a full tax rebate for taxable income up to ₹12,00,000. Combined with the ₹75,000 standard deduction, salaried employees earning up to ₹12,75,000 pay ZERO income tax. Under the Old Regime, the rebate applies for taxable income up to ₹5,00,000 only." },
    { question: "What are the components of a salary slip in India?", answer: "Earnings: Basic Salary (40–50% of CTC), HRA (50% of Basic for metro / 40% non-metro), Special Allowance (balancing figure), LTA, Conveyance, Medical Allowance. Deductions: Employee EPF (12% of Basic), Professional Tax (₹150–200/month), TDS (income tax), ESI (if applicable). Employer contributions (not on payslip): Employer EPF (12% of Basic), Gratuity (4.81% of Basic), health insurance." },
];

export default function InHandSalaryCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "In-Hand Salary Calculator" },
        ]),
        webAppSchema("In-Hand Salary Calculator India 2026", canonicalUrl("/in/in-hand-salary-calculator")),
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
            <Script id="schema-salary" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "In-Hand Salary Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>In-Hand Salary Calculator India 2026</h1>
            <PageDesc>
                Free In-Hand Salary Calculator — enter your annual CTC or Gross Salary and instantly see your monthly take-home pay after EPF, Professional Tax, Gratuity, and Income Tax (TDS). Compare Old vs New Tax Regime side-by-side. Updated for FY 2025-26 Union Budget with ₹12.75 Lakh zero-tax threshold under Section 87A, ₹75,000 standard deduction, and state-wise Professional Tax rates.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <SalaryCalculatorCore calcType="in-hand-salary" />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="In-Hand Salary Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "Old vs New Regime — complete tax computation with all deductions" },
    { href: "/in/hra-exemption-calculator", icon: "🏠", title: "HRA Exemption Calculator", desc: "Section 10(13A) — 3-rule HRA exemption for metro and non-metro cities" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "State-wise PT slabs — Maharashtra, Karnataka, West Bengal & more" },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "TDS on salary under Section 192 — monthly deduction estimation" },
    { href: "/in/gratuity-calculator", icon: "🎁", title: "Gratuity Calculator", desc: "15/26 formula — eligibility, tax exemption under Section 10(10)" },
    { href: "/in/bonus-calculator", icon: "💵", title: "Bonus Calculator", desc: "Statutory bonus 8.33%–20% under Payment of Bonus Act, 1965" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF/EPF Calculator", desc: "12% EPF contribution — 8.25% tax-free interest & retirement corpus" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "Section 80CCD(2) — employer NPS allowed in BOTH tax regimes" },
    { href: "/in/sip-calculator", icon: "📈", title: "SIP Calculator", desc: "Invest your savings — step-up SIP aligned with salary increments" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Park emergency fund in FD — compare bank rates for 2026" },
    { href: "/in/home-loan-calculator", icon: "🏠", title: "Home Loan EMI Calculator", desc: "Section 24(b) interest deduction — impacts Old Regime take-home" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Corpus Calculator", desc: "EPF + NPS + Gratuity = total retirement benefits projection" },
    { href: "/in/fire-calculator", icon: "🔥", title: "FIRE Calculator", desc: "Financial independence planning with salary deductions factored in" },
    { href: "/in/capital-gains-tax-calculator", icon: "📊", title: "Capital Gains Tax Calculator", desc: "LTCG/STCG on equity, debt, property — impacts total tax" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-in-hand-salary">What Is In-Hand Salary?</h2>
    <p><strong>In-Hand Salary</strong> (also called Take-Home Salary, Net Salary, or Salary After Tax) is the actual amount credited to your bank account every month after all deductions — <a href="/in/income-tax-calculator">income tax</a>, EPF, <a href="/in/professional-tax-calculator">professional tax</a>, and other statutory deductions — are subtracted from your gross salary. This is the money you can actually spend.</p>
    <div class="explanation__highlight">
        <strong>Key Formula:</strong> In-Hand Salary = Gross Salary − (Employee EPF + Professional Tax + Income Tax TDS)<br>
        <strong>Where:</strong> Gross Salary = CTC − Employer EPF − Gratuity − Employer Insurance
    </div>

    <h2 id="ctc-vs-gross-vs-inhand">CTC vs Gross Salary vs In-Hand Salary</h2>
    <table>
        <thead><tr><th>Component</th><th>What It Includes</th><th>Formula</th></tr></thead>
        <tbody>
            <tr><td><strong>CTC (Cost to Company)</strong></td><td>Total annual cost the employer spends on you</td><td>Gross Salary + Employer EPF + <a href="/in/gratuity-calculator">Gratuity</a> + Insurance</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td>Total earnings before your deductions</td><td>CTC − Employer EPF − Gratuity − Employer Insurance</td></tr>
            <tr><td><strong>Net/In-Hand Salary</strong></td><td>Actual monthly bank credit</td><td>Gross Salary − Employee EPF − <a href="/in/professional-tax-calculator">Professional Tax</a> − Income Tax (<a href="/in/tds-calculator">TDS</a>)</td></tr>
        </tbody>
    </table>
    <p><strong>Key insight:</strong> On a ₹10 Lakh CTC, your Gross Salary is approximately ₹9.1 Lakh, and your In-Hand Salary is approximately ₹70,000–73,000/month — a 15–20% gap between CTC and what you actually receive.</p>

    <h2 id="salary-formulas">Salary Calculation Formulas</h2>
    <p>Understanding the key formulas is essential before using the calculator:</p>
    <table>
        <thead><tr><th>Formula</th><th>Calculation</th></tr></thead>
        <tbody>
            <tr><td><strong>Take-Home Salary</strong></td><td>Gross Salary − (Employee EPF + Professional Tax + Income Tax TDS)</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td>CTC − Employer EPF − <a href="/in/gratuity-calculator">Gratuity</a> − Employer Insurance</td></tr>
            <tr><td><strong>Taxable Income (New Regime)</strong></td><td>Gross − Standard Deduction (₹75,000)</td></tr>
            <tr><td><strong>Taxable Income (Old Regime)</strong></td><td>Gross − EPF − <a href="/in/hra-exemption-calculator">HRA Exemption</a> − LTA − 80C − 80D − Standard Deduction</td></tr>
            <tr><td><strong><a href="/in/gratuity-calculator">Gratuity</a></strong></td><td>(Basic + DA) × 15 × Years of Service ÷ 26</td></tr>
        </tbody>
    </table>

    <h2 id="salary-components">Components of Your Salary Slip — Complete Breakdown</h2>
    <table>
        <thead><tr><th>Component</th><th>Typical %</th><th>Taxable?</th><th>Purpose</th></tr></thead>
        <tbody>
            <tr><td><strong>Basic Salary</strong></td><td>40–50% of CTC</td><td>✅ Fully taxable</td><td>Foundation — HRA, EPF, Gratuity all depend on this</td></tr>
            <tr><td><strong>House Rent Allowance (<a href="/in/hra-exemption-calculator">HRA</a>)</strong></td><td>50% of Basic (metro) / 40% (non-metro)</td><td>Partially exempt (Old Regime only)</td><td>Rent expenses — exemption under Sec 10(13A)</td></tr>
            <tr><td><strong>Special Allowance</strong></td><td>Balance after all components</td><td>✅ Fully taxable</td><td>Catchall — no tax exemption available</td></tr>
            <tr><td><strong>Leave Travel Allowance (LTA)</strong></td><td>Varies</td><td>Exempt (Old Regime, 2 trips per 4-year block)</td><td>Domestic travel — only fare, not hotel or food</td></tr>
            <tr><td><strong><a href="/in/bonus-calculator">Bonus</a> / Performance Pay</strong></td><td>5–20% of CTC</td><td>✅ Fully taxable</td><td>Annual or quarterly performance linked</td></tr>
            <tr><td><strong>Employee EPF (12% of Basic)</strong></td><td>~6% of CTC</td><td>Exempt (80C, up to ₹1.5L)</td><td>Retirement savings — mandated by law</td></tr>
            <tr><td><strong>Employer EPF (12% of Basic)</strong></td><td>~6% of CTC</td><td>Exempt at deposit</td><td>Employer match — goes to your PF account</td></tr>
            <tr><td><strong><a href="/in/gratuity-calculator">Gratuity</a></strong></td><td>4.81% of Basic</td><td>Exempt up to ₹20L after 5 years</td><td>Lump sum after 5 years of service</td></tr>
            <tr><td><strong><a href="/in/professional-tax-calculator">Professional Tax</a></strong></td><td>₹200/month (most states)</td><td>Deductible from income (Sec 16(iii))</td><td>State government levy — max ₹2,500/year</td></tr>
        </tbody>
    </table>

    <h2 id="tax-slabs-new">Income Tax Slabs — FY 2025-26 (AY 2026-27)</h2>
    <h3>New Tax Regime (Default) — Updated Union Budget 2025</h3>
    <table>
        <thead><tr><th>Taxable Income (₹)</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>0 – 4,00,000</td><td>NIL</td></tr>
            <tr><td>4,00,001 – 8,00,000</td><td>5%</td></tr>
            <tr><td>8,00,001 – 12,00,000</td><td>10%</td></tr>
            <tr><td>12,00,001 – 16,00,000</td><td>15%</td></tr>
            <tr><td>16,00,001 – 20,00,000</td><td>20%</td></tr>
            <tr><td>20,00,001 – 24,00,000</td><td>25%</td></tr>
            <tr><td>Above 24,00,000</td><td>30%</td></tr>
        </tbody>
    </table>
    <p><strong>Section 87A Rebate:</strong> Income up to ₹12 Lakh is effectively tax-free. With ₹75,000 standard deduction, salaried employees earning up to ₹12.75 Lakh pay <strong>zero tax</strong> under the New Regime. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to model both regimes.</p>

    <h3 id="tax-slabs-old">Old Tax Regime</h3>
    <table>
        <thead><tr><th>Taxable Income (₹)</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>0 – 2,50,000</td><td>NIL</td></tr>
            <tr><td>2,50,001 – 5,00,000</td><td>5%</td></tr>
            <tr><td>5,00,001 – 10,00,000</td><td>20%</td></tr>
            <tr><td>Above 10,00,000</td><td>30%</td></tr>
        </tbody>
    </table>

    <h2 id="old-vs-new">Old vs New Tax Regime — Which Gives Higher Take-Home?</h2>
    <table>
        <thead><tr><th>Feature</th><th>New Regime (Default)</th><th>Old Regime</th></tr></thead>
        <tbody>
            <tr><td><strong>Standard Deduction</strong></td><td>₹75,000</td><td>₹50,000</td></tr>
            <tr><td><strong>Section 80C (₹1.5L)</strong></td><td>❌ Not allowed</td><td>✅ Allowed</td></tr>
            <tr><td><strong><a href="/in/hra-exemption-calculator">HRA Exemption</a></strong></td><td>❌ Not allowed</td><td>✅ Allowed</td></tr>
            <tr><td><strong>Section 80D (Health Insurance)</strong></td><td>❌ Not allowed</td><td>✅ Up to ₹1 Lakh</td></tr>
            <tr><td><strong>Home Loan Interest (Sec 24b)</strong></td><td>❌ Not allowed</td><td>✅ Up to ₹2 Lakh</td></tr>
            <tr><td><strong><a href="/in/nps-calculator">NPS</a> — Employer (80CCD2)</strong></td><td>✅ Allowed</td><td>✅ Allowed</td></tr>
            <tr><td><strong>Section 87A Rebate</strong></td><td>Up to ₹12L income</td><td>Up to ₹5L income</td></tr>
            <tr><td><strong>Tax-Free Income Limit</strong></td><td>₹12.75L (with std deduction)</td><td>~₹5.5L (with ₹50K std deduction + 80C)</td></tr>
        </tbody>
    </table>
    <p><strong>Rule of thumb:</strong> If your total deductions (80C + 80D + HRA + <a href="/in/home-loan-calculator">home loan</a> interest) exceed ₹3.75 Lakh, the Old Regime may give you a higher take-home salary. Below that threshold, the New Regime is almost always better.</p>

    <h2 id="example-10lpa">Worked Example — ₹10 Lakh CTC Breakdown</h2>
    <table>
        <thead><tr><th>Component</th><th>Annual (₹)</th><th>Monthly (₹)</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary (50% of CTC)</td><td>5,00,000</td><td>41,667</td></tr>
            <tr><td>HRA (50% of Basic — Metro)</td><td>2,50,000</td><td>20,833</td></tr>
            <tr><td>Special Allowance</td><td>1,61,100</td><td>13,425</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td><strong>9,11,100</strong></td><td><strong>75,925</strong></td></tr>
            <tr><td>Less: Employee EPF (12% of Basic)</td><td>−60,000</td><td>−5,000</td></tr>
            <tr><td>Less: <a href="/in/professional-tax-calculator">Professional Tax</a></td><td>−2,400</td><td>−200</td></tr>
            <tr><td>Less: Income Tax (New Regime)</td><td>−10,400</td><td>−867</td></tr>
            <tr><td><strong>Take-Home Salary (In-Hand)</strong></td><td><strong>8,38,300</strong></td><td><strong>~69,858</strong></td></tr>
        </tbody>
    </table>
    <p><strong>Hidden Employer Costs (part of CTC, never in your bank):</strong> Employer EPF: ₹60,000 | <a href="/in/gratuity-calculator">Gratuity</a>: ₹28,900</p>

    <h2 id="example-15lpa">Worked Example — ₹15 Lakh CTC Breakdown</h2>
    <table>
        <thead><tr><th>Component</th><th>Annual (₹)</th><th>Monthly (₹)</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary (40% of CTC)</td><td>6,00,000</td><td>50,000</td></tr>
            <tr><td>HRA (50% of Basic — metro)</td><td>3,00,000</td><td>25,000</td></tr>
            <tr><td>Special Allowance</td><td>2,06,400</td><td>17,200</td></tr>
            <tr><td>LTA</td><td>24,000</td><td>2,000</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td><strong>11,30,400</strong></td><td><strong>94,200</strong></td></tr>
            <tr><td>Less: Employee EPF (12% of Basic)</td><td>−72,000</td><td>−6,000</td></tr>
            <tr><td>Less: Professional Tax</td><td>−2,400</td><td>−200</td></tr>
            <tr><td>Less: Income Tax (New Regime)</td><td>−56,160</td><td>−4,680</td></tr>
            <tr><td><strong>Take-Home Salary (In-Hand)</strong></td><td><strong>9,99,840</strong></td><td><strong>~83,320</strong></td></tr>
        </tbody>
    </table>
    <p><strong>What you don't see in your bank:</strong> Employer EPF (₹72,000/year) + <a href="/in/gratuity-calculator">Gratuity</a> (₹28,800/year) + Health Insurance (~₹10,000/year) — all part of CTC but never credited to your account.</p>

    <h2 id="example-25lpa">Worked Example — ₹25 Lakh CTC Breakdown</h2>
    <table>
        <thead><tr><th>Component</th><th>Annual (₹)</th><th>Monthly (₹)</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary (50% of CTC)</td><td>12,50,000</td><td>1,04,167</td></tr>
            <tr><td>HRA (50% of Basic)</td><td>6,25,000</td><td>52,083</td></tr>
            <tr><td>Special Allowance</td><td>3,36,350</td><td>28,029</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td><strong>22,11,350</strong></td><td><strong>1,84,279</strong></td></tr>
            <tr><td>Less: Employee EPF (12% of Basic)</td><td>−1,50,000</td><td>−12,500</td></tr>
            <tr><td>Less: Professional Tax</td><td>−2,400</td><td>−200</td></tr>
            <tr><td>Less: Income Tax (New Regime)</td><td>−3,24,480</td><td>−27,040</td></tr>
            <tr><td><strong>Take-Home Salary (In-Hand)</strong></td><td><strong>17,34,470</strong></td><td><strong>~1,44,539</strong></td></tr>
        </tbody>
    </table>
    <p>At ₹25 LPA, your effective tax rate is approximately <strong>13%</strong>. Invest the monthly surplus using our <a href="/in/sip-calculator">SIP Calculator</a> — even ₹20,000/month SIP at 12% returns for 20 years creates a corpus of <strong>₹1.99 Crore</strong>.</p>

    <h2 id="lpa-chart">CTC to In-Hand Salary — Quick Reference Chart (India)</h2>
    <p>Quick reference table for approximate in-hand salary at various CTC levels. Assumptions: New Tax Regime FY 2025-26, Basic at 40–50% of CTC, Metro city HRA, 12% EPF on basic, <a href="/in/professional-tax-calculator">Professional Tax</a> ₹200/month.</p>
    <table>
        <thead><tr><th>CTC (LPA)</th><th>Monthly In-Hand (₹)</th><th>Yearly In-Hand (₹)</th><th>Effective Tax Rate</th></tr></thead>
        <tbody>
            <tr><td>3 LPA</td><td>22,400 – 23,200</td><td>2,69,000 – 2,78,000</td><td>0%</td></tr>
            <tr><td>4 LPA</td><td>29,800 – 30,800</td><td>3,58,000 – 3,70,000</td><td>0%</td></tr>
            <tr><td>5 LPA</td><td>37,100 – 38,300</td><td>4,45,000 – 4,60,000</td><td>0%</td></tr>
            <tr><td>6 LPA</td><td>44,100 – 45,600</td><td>5,29,000 – 5,47,000</td><td>0%</td></tr>
            <tr><td>7 LPA</td><td>51,500 – 53,000</td><td>6,18,000 – 6,36,000</td><td>0%</td></tr>
            <tr><td>8 LPA</td><td>58,200 – 60,000</td><td>6,98,000 – 7,20,000</td><td>0%</td></tr>
            <tr><td>9 LPA</td><td>64,000 – 66,000</td><td>7,68,000 – 7,92,000</td><td>0%</td></tr>
            <tr><td>10 LPA</td><td>69,000 – 72,000</td><td>8,28,000 – 8,64,000</td><td>~1%</td></tr>
            <tr><td>12 LPA</td><td>82,000 – 86,000</td><td>9,84,000 – 10,32,000</td><td>~0.5%</td></tr>
            <tr><td>15 LPA</td><td>99,000 – 1,04,000</td><td>11,88,000 – 12,48,000</td><td>~3.7%</td></tr>
            <tr><td>18 LPA</td><td>1,14,000 – 1,20,000</td><td>13,68,000 – 14,40,000</td><td>~6.5%</td></tr>
            <tr><td>20 LPA</td><td>1,24,000 – 1,31,000</td><td>14,88,000 – 15,72,000</td><td>~8.5%</td></tr>
            <tr><td>22 LPA</td><td>1,34,000 – 1,42,000</td><td>16,08,000 – 17,04,000</td><td>~10%</td></tr>
            <tr><td>25 LPA</td><td>1,49,000 – 1,58,000</td><td>17,88,000 – 18,96,000</td><td>~13%</td></tr>
            <tr><td>28 LPA</td><td>1,63,000 – 1,73,000</td><td>19,56,000 – 20,76,000</td><td>~15%</td></tr>
            <tr><td>30 LPA</td><td>1,73,000 – 1,83,000</td><td>20,76,000 – 21,96,000</td><td>~16.5%</td></tr>
            <tr><td>35 LPA</td><td>1,97,000 – 2,09,000</td><td>23,64,000 – 25,08,000</td><td>~19%</td></tr>
            <tr><td>40 LPA</td><td>2,21,000 – 2,34,000</td><td>26,52,000 – 28,08,000</td><td>~21%</td></tr>
            <tr><td>45 LPA</td><td>2,44,000 – 2,59,000</td><td>29,28,000 – 31,08,000</td><td>~22%</td></tr>
            <tr><td>50 LPA</td><td>2,67,000 – 2,84,000</td><td>32,04,000 – 34,08,000</td><td>~23%</td></tr>
        </tbody>
    </table>
    <p><strong>Note:</strong> Ranges account for variations in Basic Salary percentage (40–50%), HRA rules, and employer-specific allowances. Actual take-home may vary based on your company's salary structure and the tax regime you choose.</p>

    <h2 id="epf-impact">How EPF Affects Your Take-Home Salary</h2>
    <p>EPF is often the largest single deduction from your salary — even more than income tax at lower CTC levels:</p>
    <table>
        <thead><tr><th>CTC</th><th>Basic (40%)</th><th>Employee EPF (12%)</th><th>Employer EPF (12%)</th><th>Total EPF Deduction from CTC</th></tr></thead>
        <tbody>
            <tr><td>₹10L</td><td>₹4,00,000</td><td>₹48,000</td><td>₹48,000</td><td>₹96,000 (9.6% of CTC)</td></tr>
            <tr><td>₹15L</td><td>₹6,00,000</td><td>₹72,000</td><td>₹72,000</td><td>₹1,44,000 (9.6% of CTC)</td></tr>
            <tr><td>₹25L</td><td>₹10,00,000</td><td>₹1,20,000</td><td>₹1,20,000</td><td>₹2,40,000 (9.6% of CTC)</td></tr>
        </tbody>
    </table>
    <p><strong>EPF is not lost money:</strong> It earns <strong>8.25% interest</strong> (FY 2024-25) tax-free and builds into a substantial retirement corpus. ₹48,000/year EPF at 8.25% for 30 years accumulates to approximately <strong>₹60 Lakh</strong>. Use our <a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a> to project your total retirement wealth including EPF.</p>

    <h2 id="professional-tax">Professional Tax — State-Wise Rates (2026)</h2>
    <table>
        <thead><tr><th>State</th><th>Monthly Deduction</th><th>Annual Maximum</th></tr></thead>
        <tbody>
            <tr><td>Maharashtra</td><td>₹200 (₹300 in Feb)</td><td>₹2,500</td></tr>
            <tr><td>Karnataka</td><td>₹200</td><td>₹2,400</td></tr>
            <tr><td>West Bengal</td><td>₹150–200</td><td>₹2,500</td></tr>
            <tr><td>Tamil Nadu</td><td>Nil (no PT)</td><td>₹0</td></tr>
            <tr><td>Telangana</td><td>₹200</td><td>₹2,500</td></tr>
            <tr><td>Gujarat</td><td>₹200</td><td>₹2,400</td></tr>
            <tr><td>Andhra Pradesh</td><td>₹150–200</td><td>₹2,500</td></tr>
            <tr><td>Rajasthan</td><td>Nil (no PT)</td><td>₹0</td></tr>
            <tr><td>Delhi</td><td>Nil (no PT)</td><td>₹0</td></tr>
            <tr><td>Uttar Pradesh</td><td>Nil (no PT)</td><td>₹0</td></tr>
        </tbody>
    </table>
    <p><a href="/in/professional-tax-calculator">Professional Tax</a> is deductible from your taxable income under <strong>Section 16(iii)</strong> in both Old and New Tax Regimes — so while it reduces your monthly take-home by ₹200, it also reduces your tax liability slightly.</p>

    <h2 id="maximize-take-home">How to Maximize Your Take-Home Salary</h2>
    <ol>
        <li><strong>Choose the right tax regime:</strong> Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to compare both regimes at your CTC level. Under ₹15L with no major deductions → New Regime wins.</li>
        <li><strong>Cap EPF at statutory minimum:</strong> Ask HR to limit EPF deduction to 12% of ₹15,000 (₹1,800/month instead of 12% of full Basic). This increases monthly in-hand but reduces retirement savings.</li>
        <li><strong>Restructure salary for <a href="/in/hra-exemption-calculator">HRA</a> (Old Regime):</strong> If paying rent in a metro, ensure HRA is 50% of Basic. The tax exemption can save ₹50,000–₹1 Lakh/year.</li>
        <li><strong>Claim meal coupons / food allowance:</strong> Up to ₹50/meal (₹26,400/year) is tax-free if provided through employer-issued meal cards.</li>
        <li><strong>Maximize <a href="/in/nps-calculator">NPS employer contribution</a>:</strong> Employer NPS under 80CCD(2) is deductible in BOTH regimes — up to 14% of Basic for govt / 10% for private.</li>
        <li><strong>Invest wisely:</strong> Start a <a href="/in/sip-calculator">SIP</a> with your first salary — even ₹5,000/month SIP growing at 12% for 25 years creates ₹1 Crore+ corpus.</li>
    </ol>

    <h2 id="salary-terms">LPA Full Form & Common Indian Salary Terms</h2>
    <table>
        <thead><tr><th>Term</th><th>Full Form</th><th>Meaning</th></tr></thead>
        <tbody>
            <tr><td><strong>LPA</strong></td><td>Lakh Per Annum</td><td>Annual salary in lakhs (₹1 Lakh = ₹1,00,000)</td></tr>
            <tr><td><strong>CTC</strong></td><td>Cost to Company</td><td>Total annual cost including employer EPF, gratuity, insurance</td></tr>
            <tr><td><strong>DA</strong></td><td>Dearness Allowance</td><td>Inflation-linked component — common in govt, rare in private</td></tr>
            <tr><td><strong>HRA</strong></td><td>House Rent Allowance</td><td>Tax-exempt rent component under Section 10(13A) — Old Regime only</td></tr>
            <tr><td><strong>TDS</strong></td><td>Tax Deducted at Source</td><td>Monthly income tax deduction by employer under Section 192</td></tr>
            <tr><td><strong>EPF</strong></td><td>Employee Provident Fund</td><td>12% mandatory retirement savings — 8.25% tax-free interest</td></tr>
            <tr><td><strong>PT</strong></td><td>Professional Tax</td><td>State-level tax — max ₹2,500/year — Section 16(iii) deductible</td></tr>
            <tr><td><strong>ESI</strong></td><td>Employees' State Insurance</td><td>Health insurance for employees earning ≤₹21,000/month gross</td></tr>
        </tbody>
    </table>
`;

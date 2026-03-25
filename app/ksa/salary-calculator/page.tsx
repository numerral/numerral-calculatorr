// Standalone page — /ksa/salary-calculator
// KSA Salary Calculator with educational content

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
    title: "Salary Calculator (KSA) — Saudi Arabia Net Pay",
    description: "Calculate your net salary in Saudi Arabia. No income tax — only GOSI deduction. Covers basic salary, housing, transport allowances for Saudi and non-Saudi employees.",
    keywords: ["Saudi Arabia salary calculator", "KSA net salary", "حاسبة الراتب", "GOSI salary deduction", "Saudi take home pay", "expat salary Saudi Arabia", "Saudi payroll calculator", "no income tax Saudi"],
    alternates: { canonical: canonicalUrl("/ksa/salary-calculator") },
};

const FAQ_ITEMS = [
    { question: "Is there income tax in Saudi Arabia?", answer: "No. Saudi Arabia does not impose personal income tax on individual salaries. This applies to both Saudi nationals and expatriate workers. The only mandatory payroll deduction is GOSI (social insurance) for Saudi employees. This makes Saudi Arabia one of the most tax-friendly countries in the world for employees." },
    { question: "What is deducted from my salary in Saudi Arabia?", answer: "For Saudi nationals: GOSI at 9.75% of basic salary + housing allowance (9% pension + 0.75% SANED unemployment). For non-Saudi expatriates: nothing is deducted — your gross salary equals your net salary. The employer pays 2% for occupational hazards for all employees." },
    { question: "What is the minimum wage in Saudi Arabia?", answer: "The minimum wage for Saudi nationals is SAR 4,000 per month. This applies only to Saudi citizens and is required for the employee to be counted in Saudization (Nitaqat) calculations. There is no government-mandated minimum wage for expatriate workers, though market rates apply." },
    { question: "What salary components are included in GOSI?", answer: "Only Basic Salary + Housing Allowance are included in the GOSI calculation base. Transport allowance, food allowance, phone allowance, overtime, bonuses, commissions, and other benefits are NOT included. The GOSI base is capped at SAR 45,000 and floored at SAR 1,500 per month." },
    { question: "How is the typical Saudi salary structured?", answer: "A standard Saudi salary package typically includes: Basic Salary (40-60% of total), Housing Allowance (25-35%), Transport Allowance (5-10%), and other allowances (food, phone, etc.). The basic salary is the most important component as it determines GOSI contributions and End of Service Benefit (EOSB)." },
    { question: "What is the Wage Protection System (WPS)?", answer: "WPS is a mandatory system by the Ministry of Human Resources (MHRSD) that requires all private sector employers to pay salaries electronically through approved Saudi banks. Salaries must be paid in SAR (Saudi Riyals). The system ensures timely payment and provides proof of salary for labor disputes." },
    { question: "How much does an employer pay on top of my salary?", answer: "For Saudi employees, the employer pays 11.75% of basic+housing for GOSI (9% pension + 0.75% SANED + 2% hazards). For non-Saudi employees, the employer pays 2% for occupational hazards only. This means a Saudi employee's total cost to the employer is salary + 11.75% of GOSI base." },
    { question: "Can my employer deduct more than GOSI from my salary?", answer: "No. Under Saudi Labor Law Article 90, no deductions beyond GOSI and court-ordered amounts can be made without the employee's written consent. Unauthorized deductions are illegal. Workers can file complaints with the Ministry of Human Resources and Social Development (MHRSD)." },
    { question: "How does Saudi salary compare for expats vs Saudis?", answer: "For the same gross salary, non-Saudi employees take home more money because they have zero GOSI deductions. However, Saudi employees benefit from GOSI pension (retirement income), SANED unemployment insurance, and typically higher EOSB at end of service. Saudis also qualify for government housing programs and subsidies." },
    { question: "Is housing allowance mandatory in Saudi Arabia?", answer: "While not explicitly mandated by law for all workers, housing allowance is a near-universal component of Saudi employment contracts. Most contracts include either a housing allowance (typically 25-35% of basic salary) or employer-provided accommodation. It is included in the GOSI calculation base and affects EOSB calculations." },
    { question: "How is overtime calculated in Saudi Arabia?", answer: "Under Saudi Labor Law Article 107, overtime is paid at 150% of the regular hourly wage (base hourly rate + 50% premium). Normal working hours are 8 hours per day or 48 hours per week (reduced to 6 hours/36 hours during Ramadan for Muslim employees). Overtime is NOT included in GOSI calculations." },
    { question: "Do I get paid during annual leave?", answer: "Yes. Saudi Labor Law Article 109 entitles employees to: 21 days of paid annual leave for those with less than 5 years of service, and 30 days for those with 5+ years. Leave pay is based on the full salary (basic + all allowances). Unused leave can be carried forward or compensated upon termination." },
    { question: "What is the probation period salary in Saudi Arabia?", answer: "During the probation period (maximum 90 days, extendable to 180 days with written agreement), the employee receives the full agreed salary. There are no legal provisions for reduced probation pay. However, either party can terminate employment during probation without notice or EOSB." },
    { question: "How are bonuses taxed in Saudi Arabia?", answer: "Since Saudi Arabia has no personal income tax, bonuses are not taxed. Annual bonuses, performance bonuses, and Ramadan bonuses are common in Saudi employment. Bonuses are typically not included in GOSI calculations unless they are contractually guaranteed as part of the regular monthly wage." },
    { question: "What happens to my salary if the company is late paying?", answer: "Under the Wage Protection System, employers must pay salaries by the end of each month. If payment is delayed beyond the agreed date, employees can file a complaint with MHRSD. Persistent late payment can result in penalties, suspension of work permits, and labor office action against the employer." },
];

export default function SalaryPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Salary Calculator" },
        ]),
        webAppSchema("Salary Calculator (KSA)", canonicalUrl("/ksa/salary-calculator")),
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
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Salary Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Salary Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your net take-home salary in Saudi Arabia. No income tax — only GOSI deduction. Supports Saudi and non-Saudi employees with step-by-step breakdown.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="salary" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="calc-card" style={{ marginTop: "var(--s-6)", padding: "var(--s-6)" }}>
                <div className="hub-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Salary FAQ" items={FAQ_ITEMS} />

            <section className="calc-card" style={{ marginTop: "var(--s-4)", padding: "var(--s-4)" }}>
                <h3>Related KSA Calculators</h3>
                <p style={{ marginBottom: "var(--s-2)" }}>
                    <Link href="/ksa/gosi-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>🏛️ GOSI Calculator</Link>
                    {" — "}Calculate your GOSI social insurance contributions in detail.
                </p>
                <p style={{ marginBottom: "var(--s-2)" }}>
                    <Link href="/ksa/end-of-service-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>🏢 End of Service Benefit Calculator</Link>
                    {" — "}Calculate your EOSB under Saudi Labor Law.
                </p>
                <p>
                    <Link href="/ksa/vat-calculator" style={{ color: "var(--primary)", fontWeight: 600 }}>🧾 VAT Calculator (15%)</Link>
                    {" — "}Add or remove 15% VAT for Saudi Arabia.
                </p>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="salary-structure">Saudi Arabia Salary Structure</h2>
    <p>Salaries in Saudi Arabia follow a distinctive structure shaped by the Kingdom's <strong>zero personal income tax</strong> policy and <strong>GOSI social insurance</strong> system. Unlike most countries, employees in KSA keep virtually all of their gross salary — the only mandatory deduction is GOSI for Saudi nationals.</p>
    <p>A typical Saudi employment contract specifies a <strong>total package</strong> broken down into clearly defined components, each with different implications for social insurance, end-of-service benefits, and overtime calculations.</p>

    <h2 id="no-income-tax">No Income Tax — Why Saudi Arabia?</h2>
    <p>Saudi Arabia is one of the few countries in the world with <strong>zero personal income tax</strong>. This applies to all individuals — Saudi nationals and expatriates alike. The Kingdom's revenue comes primarily from:</p>
    <ul>
        <li><strong>Oil revenue</strong> — Saudi Aramco and petroleum exports</li>
        <li><strong>VAT (15%)</strong> — Value Added Tax on goods and services (<a href="/ksa/vat-calculator">calculate VAT here</a>)</li>
        <li><strong>Zakat</strong> — Islamic wealth tax on Saudi-owned businesses</li>
        <li><strong>Corporate Income Tax</strong> — 20% on non-Saudi owned businesses (not individuals)</li>
        <li><strong>Government fees</strong> — Iqama, dependent levies, municipal fees</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Key Point:</strong> Saudi Arabia's Finance Minister confirmed in 2024 that the Kingdom has no plans to introduce personal income tax. Your salary in KSA is tax-free.
    </div>

    <h2 id="components">Salary Components Explained</h2>
    <table>
        <thead><tr><th>Component</th><th>Typical Range</th><th>In GOSI Base?</th><th>In EOSB Calc?</th></tr></thead>
        <tbody>
            <tr><td><strong>Basic Salary</strong></td><td>40–60%</td><td>✅ Yes</td><td>✅ Yes</td></tr>
            <tr><td><strong>Housing Allowance</strong></td><td>25–35%</td><td>✅ Yes</td><td>✅ Yes</td></tr>
            <tr><td><strong>Transport Allowance</strong></td><td>5–10%</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Food/Meal Allowance</strong></td><td>0–5%</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Phone/Internet</strong></td><td>0–3%</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Overtime</strong></td><td>Varies</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Annual Bonus</strong></td><td>Varies</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Commission</strong></td><td>Varies</td><td>❌ No</td><td>❌ No</td></tr>
        </tbody>
    </table>

    <h3 id="basic-salary">Basic Salary</h3>
    <p>The <strong>basic salary</strong> is the fixed monthly amount agreed in the employment contract, excluding all allowances and benefits. It is the most important component because it forms the foundation for:</p>
    <ul>
        <li><strong>GOSI contributions</strong> — calculated on basic + housing (<a href="/ksa/gosi-calculator">GOSI Calculator</a>)</li>
        <li><strong>End of Service Benefit</strong> — calculated on the "actual wage" which includes basic + housing (<a href="/ksa/end-of-service-calculator">EOSB Calculator</a>)</li>
        <li><strong>Overtime pay</strong> — 150% of hourly basic rate</li>
        <li><strong>Leave encashment</strong> — based on full salary</li>
    </ul>

    <h3 id="housing-allowance">Housing Allowance</h3>
    <p>Employers typically provide either a <strong>housing allowance</strong> (cash) or <strong>employer-provided accommodation</strong>. The housing allowance is usually 25–35% of basic salary but can vary significantly by company and role. Key points:</p>
    <ul>
        <li>Included in the GOSI calculation base</li>
        <li>Included in the EOSB "actual wage" calculation</li>
        <li>If employer provides housing instead, the notional value may be used for GOSI</li>
    </ul>

    <h3 id="transport-allowance">Transport Allowance</h3>
    <p>Transport allowance covers commuting expenses and is typically 5–10% of basic salary. It is <strong>NOT included</strong> in GOSI or EOSB calculations, making it a pure take-home benefit.</p>

    <h2 id="gosi-deduction">GOSI Deduction — The Only Salary Deduction</h2>
    <table>
        <thead><tr><th>Nationality</th><th>Employee Deduction</th><th>Employer Contribution</th><th>Net Impact</th></tr></thead>
        <tbody>
            <tr><td><strong>Saudi National</strong></td><td>9.75% of (Basic+Housing)</td><td>11.75% of (Basic+Housing)</td><td>Employee takes home 90.25% of GOSI base + all other allowances</td></tr>
            <tr><td><strong>Non-Saudi (Expat)</strong></td><td>0% — no deduction</td><td>2% (hazards only)</td><td>Employee takes home 100% of gross salary</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>GOSI Limits:</strong> Maximum: SAR 45,000/month | Minimum: SAR 1,500/month<br/>
        For detailed GOSI calculations, use our <a href="/ksa/gosi-calculator">GOSI Calculator</a>.
    </div>

    <h2 id="net-formula">Net Salary Calculation Formula</h2>
    <h3>For Saudi Nationals</h3>
    <div class="explanation__highlight">
        <strong>Net Salary</strong> = Gross Salary − (GOSI Base × 9.75%)<br/>
        Where GOSI Base = min(Basic + Housing, SAR 45,000)<br/>
        <strong>Example:</strong> SAR 8,000 basic + SAR 2,500 housing + SAR 800 transport = SAR 11,300 gross<br/>
        GOSI = SAR 10,500 × 9.75% = SAR 1,023.75<br/>
        Net = SAR 11,300 − SAR 1,023.75 = <strong>SAR 10,276.25</strong>
    </div>

    <h3>For Non-Saudi Employees</h3>
    <div class="explanation__highlight">
        <strong>Net Salary = Gross Salary</strong> (no deductions)<br/>
        <strong>Example:</strong> SAR 8,000 basic + SAR 2,500 housing + SAR 800 transport = SAR 11,300 gross<br/>
        Net = <strong>SAR 11,300</strong>
    </div>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: Mid-Level Saudi Employee — SAR 15,000 Package</h3>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary (60%)</td><td>SAR 9,000</td></tr>
            <tr><td>Housing Allowance (25%)</td><td>SAR 3,750</td></tr>
            <tr><td>Transport (10%)</td><td>SAR 1,500</td></tr>
            <tr><td>Other (5%)</td><td>SAR 750</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td><strong>SAR 15,000</strong></td></tr>
            <tr><td>GOSI Base (Basic + Housing)</td><td>SAR 12,750</td></tr>
            <tr><td>Employee GOSI (9.75%)</td><td>−SAR 1,243.13</td></tr>
            <tr><td><strong>Net Salary</strong></td><td><strong>SAR 13,756.87</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: Non-Saudi Engineer — SAR 15,000 Package</h3>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Gross Salary</td><td>SAR 15,000</td></tr>
            <tr><td>Employee GOSI</td><td>SAR 0 (not applicable)</td></tr>
            <tr><td><strong>Net Salary</strong></td><td><strong>SAR 15,000</strong></td></tr>
            <tr><td>Employer pays: Hazards (2% of 12,750)</td><td>SAR 255</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Senior Saudi Manager — SAR 40,000 Package</h3>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Basic (60%)</td><td>SAR 24,000</td></tr>
            <tr><td>Housing (25%)</td><td>SAR 10,000</td></tr>
            <tr><td>Transport + Other</td><td>SAR 6,000</td></tr>
            <tr><td><strong>Gross Salary</strong></td><td><strong>SAR 40,000</strong></td></tr>
            <tr><td>GOSI Base (Basic + Housing)</td><td>SAR 34,000</td></tr>
            <tr><td>Employee GOSI (9.75%)</td><td>−SAR 3,315</td></tr>
            <tr><td><strong>Net Salary</strong></td><td><strong>SAR 36,685</strong></td></tr>
        </tbody>
    </table>

    <h2 id="minimum-wage">Minimum Wage in Saudi Arabia</h2>
    <table>
        <thead><tr><th>Category</th><th>Minimum Wage</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Saudi Nationals</strong></td><td>SAR 4,000/month</td><td>Required for Nitaqat (Saudization) count</td></tr>
            <tr><td><strong>Non-Saudi Workers</strong></td><td>No statutory minimum</td><td>Market-driven; varies by nationality and role</td></tr>
        </tbody>
    </table>
    <p>The SAR 4,000 minimum wage for Saudis was introduced to strengthen the Saudization (Nitaqat) program. Employees earning below SAR 4,000 are not counted toward a company's Saudization percentage, incentivizing employers to meet the threshold.</p>

    <h2 id="wps">Wage Protection System (WPS)</h2>
    <p>The <strong>Wage Protection System (نظام حماية الأجور)</strong> is a mandatory digital system managed by the Ministry of Human Resources and Social Development (MHRSD). Key features:</p>
    <ul>
        <li><strong>Electronic payment only</strong> — all salaries must be paid through approved Saudi bank transfers</li>
        <li><strong>Payment in SAR</strong> — salaries must be paid in Saudi Riyals</li>
        <li><strong>Monthly reporting</strong> — employers must upload salary payment files to the WPS portal</li>
        <li><strong>Penalties</strong> — late or missing payments trigger alerts and can result in suspension of work permits and services</li>
        <li><strong>Proof of payment</strong> — WPS records serve as official evidence in labor disputes</li>
    </ul>

    <h2 id="overtime">Overtime Rules</h2>
    <table>
        <thead><tr><th>Feature</th><th>Rule</th></tr></thead>
        <tbody>
            <tr><td><strong>Normal hours</strong></td><td>8 hours/day, 48 hours/week</td></tr>
            <tr><td><strong>Ramadan (Muslim)</strong></td><td>6 hours/day, 36 hours/week</td></tr>
            <tr><td><strong>Overtime rate</strong></td><td>150% of hourly wage (base + 50% premium)</td></tr>
            <tr><td><strong>Maximum overtime</strong></td><td>720 hours per year</td></tr>
            <tr><td><strong>In GOSI calculation?</strong></td><td>❌ No — overtime is excluded</td></tr>
        </tbody>
    </table>

    <h2 id="leave-entitlement">Annual Leave & Entitlements</h2>
    <table>
        <thead><tr><th>Entitlement</th><th>Duration</th><th>Pay</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual Leave (&lt;5 years)</strong></td><td>21 days</td><td>Full salary</td></tr>
            <tr><td><strong>Annual Leave (5+ years)</strong></td><td>30 days</td><td>Full salary</td></tr>
            <tr><td><strong>Sick Leave</strong></td><td>120 days/year</td><td>100% first 30 days, 75% next 60, unpaid last 30</td></tr>
            <tr><td><strong>Marriage Leave</strong></td><td>5 days</td><td>Full salary</td></tr>
            <tr><td><strong>Paternity Leave</strong></td><td>3 days</td><td>Full salary</td></tr>
            <tr><td><strong>Maternity Leave</strong></td><td>10 weeks (70 days)</td><td>Full salary</td></tr>
            <tr><td><strong>Bereavement Leave</strong></td><td>5 days</td><td>Full salary</td></tr>
            <tr><td><strong>Hajj Leave</strong></td><td>10-15 days (once)</td><td>Full salary</td></tr>
        </tbody>
    </table>
`;

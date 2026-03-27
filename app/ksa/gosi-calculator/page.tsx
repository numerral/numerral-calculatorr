// Standalone page — /ksa/gosi-calculator
// GOSI (General Organization for Social Insurance) Calculator with educational content

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
    title: "GOSI Calculator (KSA) — Saudi Social Insurance Contributions",
    description: "Calculate your GOSI contributions for Saudi and non-Saudi employees. Covers Annuities (pension), SANED (unemployment), and Occupational Hazards. Based on 2026 GOSI rates.",
    keywords: ["GOSI calculator", "Saudi Arabia social insurance", "GOSI contribution rates", "التأمينات الاجتماعية", "Saudi pension calculator", "SANED unemployment insurance", "GOSI employer employee contribution", "Saudi payroll deductions"],
    alternates: { canonical: canonicalUrl("/ksa/gosi-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is GOSI in Saudi Arabia?", answer: "GOSI (General Organization for Social Insurance — التأمينات الاجتماعية) is Saudi Arabia's mandatory social insurance system. It provides retirement pensions, unemployment insurance (SANED), and occupational hazard coverage. All private sector employers must register their employees with GOSI and make monthly contributions." },
    { question: "How much is GOSI deduction for Saudi employees?", answer: "Saudi employees contribute 9.75% of their basic salary plus housing allowance: 9% for Annuities (pension) and 0.75% for SANED (unemployment insurance). The employer pays an additional 11.75%: 9% for Annuities, 0.75% for SANED, and 2% for Occupational Hazards. The total for a Saudi employee is 21.5%." },
    { question: "Do non-Saudi employees pay GOSI?", answer: "No. Non-Saudi (expatriate) employees do not pay any GOSI contribution from their salary. However, the employer must pay 2% of the employee's contributable salary for Occupational Hazards coverage. Expats are not eligible for pension or SANED benefits through GOSI." },
    { question: "What is the GOSI salary cap?", answer: "The maximum salary used for GOSI calculations is SAR 45,000 per month. If an employee's basic salary plus housing allowance exceeds SAR 45,000, contributions are calculated only on SAR 45,000. The minimum contributable salary is SAR 1,500." },
    { question: "What salary components are included in GOSI calculation?", answer: "GOSI contributions are calculated on the employee's Basic Salary plus Housing Allowance only. Other allowances like transportation, food, phone, commissions, overtime, and bonuses are NOT included in the GOSI calculation base." },
    { question: "What is SANED unemployment insurance?", answer: "SANED (ساند) is Saudi Arabia's unemployment insurance program for Saudi nationals only. It provides temporary financial support (60% of average salary for the first 3 months, 50% for up to 9 more months) to eligible Saudi workers who lose their jobs involuntarily. Both employee and employer contribute 0.75% each." },
    { question: "What is the GOSI pension eligibility?", answer: "Saudi nationals are eligible for a GOSI retirement pension if they: (1) Have contributed for at least 120 months (10 years) for a lump-sum payment, or 300 months (25 years) for early retirement, (2) Have reached age 60 (men) or 55 (women) for standard retirement. The pension is calculated based on the average contributable salary of the last 2 years." },
    { question: "How is the GOSI pension calculated?", answer: "The monthly GOSI pension is: Average Contributable Salary ÷ 40 × Years of Contribution. For example, if your average salary is SAR 20,000 and you contributed for 25 years: SAR 20,000 ÷ 40 × 25 = SAR 12,500 per month. The maximum pension cannot exceed 100% of the average salary." },
    { question: "What does GOSI Occupational Hazards cover?", answer: "Occupational Hazards insurance covers: (1) Medical treatment for work-related injuries or occupational diseases, (2) Daily compensation during recovery (100% of salary for first 60 days, 75% thereafter), (3) Disability compensation — lump sum or monthly pension depending on disability percentage, (4) Death benefits — monthly pension to dependents. This applies to both Saudi and non-Saudi employees." },
    { question: "Can I get a GOSI pension and EOSB together?", answer: "Yes. GOSI pension and End of Service Benefit (EOSB) are completely separate entitlements. Receiving one does not affect the other. EOSB is paid by the employer directly under the Saudi Labor Law (Articles 84-88), while GOSI pension is paid by the General Organization for Social Insurance from accumulated contributions." },
    { question: "What are the 2025 GOSI rate changes?", answer: "Starting July 1, 2025, new Saudi subscribers (those registered after July 3, 2024) will see a gradual increase of 0.5% per year from both employee and employer sides. For 2025: Employee 10.25%, Employer 12.25%, Total 22.5%. This increase continues annually until 2028. Pre-July 2024 subscribers keep the existing rates (9.75% employee, 11.75% employer)." },
    { question: "Do GCC nationals pay GOSI in Saudi Arabia?", answer: "GCC nationals (from Bahrain, Kuwait, Oman, Qatar, UAE) working in Saudi Arabia are covered under a mutual social insurance agreement. Their contributions follow the social security rates of their home country, and their service in Saudi Arabia counts toward pension eligibility in their home country." },
    { question: "What happens to my GOSI if I leave Saudi Arabia?", answer: "For Saudi nationals, your GOSI balance remains and you can claim pension benefits when eligible. For non-Saudi workers, there is no refundable GOSI balance — the 2% Occupational Hazards contribution is not refundable upon leaving. Expats should rely on their EOSB (End of Service Benefit) as their primary end-of-employment financial protection." },
    { question: "Can the employer deduct more than the GOSI rate from salary?", answer: "No. The employer cannot deduct more than the legally prescribed employee GOSI contribution (9.75% for Saudis, 0% for non-Saudis). Any additional deduction is illegal under Saudi Labor Law. If this happens, workers can file a complaint with the Ministry of Human Resources and GOSI." },
    { question: "How do I register for GOSI?", answer: "Employers register employees through the GOSI online portal (gosi.gov.sa) or the GOSI mobile app 'GOSI'. Employees can also access their GOSI account, check contribution history, and estimate pension benefits through the same portal. Registration requires an employee's national ID (for Saudis) or iqama number (for non-Saudis)." },
];

export default function GOSIPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "GOSI Calculator" },
        ]),
        webAppSchema("GOSI Calculator (KSA)", canonicalUrl("/ksa/gosi-calculator")),
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
            <Script id="schema-gosi" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "GOSI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>GOSI Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your GOSI social insurance contributions for Saudi and non-Saudi employees. Covers Annuities (pension), SANED (unemployment), and Occupational Hazards based on 2025 GOSI rates.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="gosi" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="GOSI Calculator FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">EOSB is separate from GOSI</div>
                        </div>
                    </Link>
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">GOSI is the only salary deduction</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator (15%)</div>
                            <div className="ksa-related-link__desc">Calculate 15% VAT on purchases</div>
                        </div>
                    </Link>
                    <Link href="/ksa/overtime-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">⏱️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Overtime Calculator</div>
                            <div className="ksa-related-link__desc">Overtime is excluded from GOSI</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-gosi">What Is GOSI?</h2>
    <p><strong>GOSI (General Organization for Social Insurance — التأمينات الاجتماعية)</strong> is Saudi Arabia's mandatory social insurance system established under the Social Insurance Law (Royal Decree No. M/33). It covers all private sector employees and some public sector workers, providing financial protection through <strong>retirement pensions, unemployment insurance, and workplace injury coverage</strong>.</p>
    <p>GOSI is funded by monthly contributions from both employees and employers, calculated as a percentage of the employee's <strong>basic salary plus housing allowance</strong>. The contribution rates differ significantly depending on whether the employee is a <strong>Saudi national</strong> or a <strong>non-Saudi expatriate</strong>.</p>
    <p>As of 2025, GOSI covers approximately <strong>12 million subscribers</strong> across the Kingdom, making it one of the largest social insurance systems in the Middle East.</p>

    <h2 id="three-components">The Three Components of GOSI</h2>
    <p>GOSI contributions are divided into three distinct insurance branches, each serving a different purpose:</p>

    <h3 id="annuities">1. Annuities (معاشات) — Retirement Pension</h3>
    <p>The largest component of GOSI, the <strong>Annuities branch</strong> funds retirement pensions for Saudi nationals. Both the employee and employer contribute <strong>9% each</strong> (18% total) of the contributable salary. This branch provides:</p>
    <ul>
        <li><strong>Retirement pension</strong> — monthly payments after reaching retirement age</li>
        <li><strong>Early retirement pension</strong> — available after 25 years (300 months) of contributions</li>
        <li><strong>Disability pension</strong> — for non-work-related disabilities</li>
        <li><strong>Survivors' pension</strong> — monthly payments to dependents after the subscriber's death</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Pension Formula:</strong> Monthly Pension = Average Salary (last 2 years) ÷ 40 × Years of Contribution<br/>
        <strong>Example:</strong> SAR 20,000 average salary, 25 years of contribution → SAR 20,000 ÷ 40 × 25 = SAR 12,500/month
    </div>
    <p><strong>Note:</strong> Non-Saudi employees do NOT contribute to or receive benefits from the Annuities branch.</p>

    <h3 id="saned">2. SANED (ساند) — Unemployment Insurance</h3>
    <p><strong>SANED</strong> (نظام التأمين ضد التعطل عن العمل) is Saudi Arabia's unemployment insurance program, available <strong>exclusively to Saudi nationals</strong>. Both employee and employer contribute <strong>0.75% each</strong> (1.5% total).</p>
    <table>
        <thead><tr><th>Period</th><th>Benefit Rate</th><th>Monthly Cap</th></tr></thead>
        <tbody>
            <tr><td>First 3 months</td><td>60% of average salary</td><td>SAR 9,000</td></tr>
            <tr><td>Months 4–12</td><td>50% of average salary</td><td>SAR 7,500</td></tr>
        </tbody>
    </table>
    <p><strong>Eligibility:</strong> Saudi nationals who (1) lost their job involuntarily, (2) are actively seeking employment, (3) have contributed to SANED for at least 12 months in the past 36 months, (4) are registered with the Taqat (HRDF) employment portal.</p>

    <h3 id="occupational-hazards">3. Occupational Hazards (أخطار مهنية)</h3>
    <p>The <strong>Occupational Hazards</strong> branch covers <strong>all employees — both Saudi and non-Saudi</strong>. Only the employer pays this contribution at <strong>2%</strong> of contributable salary. It provides:</p>
    <ul>
        <li><strong>Medical treatment</strong> — full coverage for work-related injuries and occupational diseases</li>
        <li><strong>Daily compensation</strong> — 100% of salary for first 60 days of recovery, 75% thereafter</li>
        <li><strong>Permanent disability pension</strong> — proportional to disability percentage (assessed by GOSI medical committee)</li>
        <li><strong>Death benefits</strong> — monthly pension to dependents (spouse, children, parents)</li>
        <li><strong>Rehabilitation services</strong> — vocational training and workplace modifications</li>
    </ul>

    <h2 id="contribution-rates">GOSI Contribution Rates — Complete Breakdown</h2>
    <table>
        <thead><tr><th>Component</th><th>Saudi Employee</th><th>Saudi Employer</th><th>Non-Saudi Employee</th><th>Non-Saudi Employer</th></tr></thead>
        <tbody>
            <tr><td><strong>Annuities (Pension)</strong></td><td>9%</td><td>9%</td><td>—</td><td>—</td></tr>
            <tr><td><strong>SANED (Unemployment)</strong></td><td>0.75%</td><td>0.75%</td><td>—</td><td>—</td></tr>
            <tr><td><strong>Occupational Hazards</strong></td><td>—</td><td>2%</td><td>—</td><td>2%</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>9.75%</strong></td><td><strong>11.75%</strong></td><td><strong>0%</strong></td><td><strong>2%</strong></td></tr>
            <tr><td><strong>Combined Total</strong></td><td colspan="2"><strong>21.5%</strong></td><td colspan="2"><strong>2%</strong></td></tr>
        </tbody>
    </table>

    <h2 id="calculation-base">What Is Included in the GOSI Calculation Base?</h2>
    <table>
        <thead><tr><th>Included ✅</th><th>Excluded ❌</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary</td><td>Transportation Allowance</td></tr>
            <tr><td>Housing Allowance</td><td>Food Allowance</td></tr>
            <tr><td></td><td>Overtime Pay</td></tr>
            <tr><td></td><td>Commissions</td></tr>
            <tr><td></td><td>Annual Bonuses</td></tr>
            <tr><td></td><td>Phone/Internet Allowance</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Salary Limits:</strong><br/>
        <strong>Maximum:</strong> SAR 45,000/month — contributions are calculated on at most SAR 45,000<br/>
        <strong>Minimum:</strong> SAR 1,500/month — no employee can be registered below this amount
    </div>

    <h2 id="worked-examples">Worked Examples</h2>

    <h3 id="example-1">Example 1: Saudi Employee — SAR 10,000 Base</h3>
    <p>Basic Salary: SAR 8,000 + Housing: SAR 2,000 = <strong>SAR 10,000 contributable base</strong></p>
    <table>
        <thead><tr><th>Component</th><th>Employee</th><th>Employer</th></tr></thead>
        <tbody>
            <tr><td>Annuities (9%)</td><td>SAR 900</td><td>SAR 900</td></tr>
            <tr><td>SANED (0.75%)</td><td>SAR 75</td><td>SAR 75</td></tr>
            <tr><td>Occupational Hazards (2%)</td><td>—</td><td>SAR 200</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 975</strong></td><td><strong>SAR 1,175</strong></td></tr>
        </tbody>
    </table>
    <p>Net Salary: SAR 10,000 − SAR 975 = <strong>SAR 9,025</strong></p>

    <h3 id="example-2">Example 2: Non-Saudi Employee — SAR 10,000 Base</h3>
    <p>Basic Salary: SAR 8,000 + Housing: SAR 2,000 = <strong>SAR 10,000</strong></p>
    <table>
        <thead><tr><th>Component</th><th>Employee</th><th>Employer</th></tr></thead>
        <tbody>
            <tr><td>Annuities</td><td>—</td><td>—</td></tr>
            <tr><td>SANED</td><td>—</td><td>—</td></tr>
            <tr><td>Occupational Hazards (2%)</td><td>—</td><td>SAR 200</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 0</strong></td><td><strong>SAR 200</strong></td></tr>
        </tbody>
    </table>
    <p>Net Salary: <strong>SAR 10,000</strong> (no deduction from employee)</p>

    <h3 id="example-3">Example 3: Saudi at Maximum Cap — SAR 50,000 Base</h3>
    <p>Basic + Housing: SAR 50,000 → <strong>Capped at SAR 45,000</strong> for GOSI</p>
    <table>
        <thead><tr><th>Component</th><th>Employee</th><th>Employer</th></tr></thead>
        <tbody>
            <tr><td>Annuities (9% of 45K)</td><td>SAR 4,050</td><td>SAR 4,050</td></tr>
            <tr><td>SANED (0.75% of 45K)</td><td>SAR 337.50</td><td>SAR 337.50</td></tr>
            <tr><td>Occupational Hazards (2% of 45K)</td><td>—</td><td>SAR 900</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 4,387.50</strong></td><td><strong>SAR 5,287.50</strong></td></tr>
        </tbody>
    </table>
    <p>Net Salary: SAR 50,000 − SAR 4,387.50 = <strong>SAR 45,612.50</strong></p>

    <h2 id="pension-eligibility">GOSI Pension Eligibility</h2>
    <table>
        <thead><tr><th>Type</th><th>Age Requirement</th><th>Contribution Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Standard retirement</strong></td><td>60 (men) / 55 (women)</td><td>At least 120 months (10 years)</td></tr>
            <tr><td><strong>Early retirement</strong></td><td>Any age</td><td>At least 300 months (25 years)</td></tr>
            <tr><td><strong>Disability pension</strong></td><td>Any age</td><td>At least 12 consecutive or 18 non-consecutive months</td></tr>
            <tr><td><strong>Survivors' pension</strong></td><td>Upon death</td><td>At least 3 months or 6 non-consecutive months</td></tr>
        </tbody>
    </table>

    <h2 id="gosi-vs-eosb">GOSI vs EOSB — Understanding the Difference</h2>
    <p>Many workers in Saudi Arabia confuse GOSI and <a href="/ksa/end-of-service-calculator">End of Service Benefit (EOSB)</a>. They are completely separate systems:</p>
    <table>
        <thead><tr><th>Feature</th><th>GOSI</th><th>EOSB</th></tr></thead>
        <tbody>
            <tr><td><strong>Legal Basis</strong></td><td>Social Insurance Law</td><td>Saudi Labor Law (Art 84-88)</td></tr>
            <tr><td><strong>Who Pays</strong></td><td>Employee + Employer (shared)</td><td>100% Employer</td></tr>
            <tr><td><strong>Payment Type</strong></td><td>Monthly pension or lump sum</td><td>Lump sum at end of service</td></tr>
            <tr><td><strong>Non-Saudi Eligible?</strong></td><td>Hazards only (no pension)</td><td>✅ Fully eligible</td></tr>
            <tr><td><strong>Managed By</strong></td><td>GOSI (government entity)</td><td>Employer directly</td></tr>
            <tr><td><strong>Affects Each Other?</strong></td><td colspan="2">❌ No — completely independent benefits</td></tr>
        </tbody>
    </table>

    <h2 id="2025-changes">2025 GOSI Rate Changes</h2>
    <p>GOSI announced a <strong>gradual annual increase</strong> in contribution rates for Saudi employees registered <strong>on or after July 3, 2024</strong>:</p>
    <table>
        <thead><tr><th>Year</th><th>Employee Rate</th><th>Employer Rate</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>Pre-July 2024 subscribers</td><td>9.75%</td><td>11.75%</td><td>21.50%</td></tr>
            <tr><td><strong>2025</strong></td><td><strong>10.25%</strong></td><td><strong>12.25%</strong></td><td><strong>22.50%</strong></td></tr>
            <tr><td>2026</td><td>10.75%</td><td>12.75%</td><td>23.50%</td></tr>
            <tr><td>2027</td><td>11.25%</td><td>13.25%</td><td>24.50%</td></tr>
            <tr><td>2028</td><td>11.75%</td><td>13.75%</td><td>25.50%</td></tr>
        </tbody>
    </table>
    <p><strong>Important:</strong> This gradual increase applies only to new subscribers. Existing subscribers (pre-July 2024) continue at the current rates until further notice.</p>

    <h2 id="filing-complaints">Filing GOSI Complaints</h2>
    <p>Workers can report GOSI violations through multiple channels:</p>
    <ul>
        <li><strong>GOSI Online Portal:</strong> gosi.gov.sa — file complaints, check contribution history, verify registration</li>
        <li><strong>GOSI Mobile App:</strong> Available on iOS and Android for real-time access</li>
        <li><strong>Call Center:</strong> 8001243344 (GOSI customer service)</li>
        <li><strong>Labor Office:</strong> File a complaint at any Ministry of Human Resources office</li>
        <li><strong>Absher:</strong> Some GOSI services are integrated with the Absher platform</li>
    </ul>
`;

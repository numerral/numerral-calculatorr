// Standalone page — /uae/gratuity-calculator
// UAE Gratuity (End-of-Service Benefits) Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEGratuityCalculatorCore from "@/components/calculator/UAEGratuityCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Gratuity Calculator 2025 — End of Service Benefits",
    description: "Calculate your UAE end-of-service gratuity. Covers private sector, domestic workers, part-time, DIFC DEWS, and ADGM. Based on Federal Decree-Law No. 33 of 2021 and MoHRE guidelines.",
    keywords: ["UAE gratuity calculator", "end of service calculator UAE", "حاسبة مكافأة نهاية الخدمة", "EOSB calculator UAE", "Dubai gratuity calculator", "DIFC DEWS calculator", "UAE Labour Law gratuity", "domestic worker gratuity UAE", "MoHRE gratuity", "Federal Decree-Law 33"],
    alternates: { canonical: canonicalUrl("/uae/gratuity-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is gratuity (end-of-service benefits) in the UAE?", answer: "Gratuity, also known as end-of-service benefits (EOSB), is a lump-sum payment that UAE employers must pay employees upon termination or completion of their employment contract. It is mandated by Federal Decree-Law No. 33 of 2021 (UAE Labour Law). The amount is calculated based on the employee's last basic salary and total years of continuous service. For the first five years, employees receive 21 days' basic salary per year, and for each year beyond five, they receive 30 days' basic salary per year. The total is capped at two years' remuneration." },
    { question: "Who is eligible for gratuity in the UAE?", answer: "Any employee who has completed at least one year of continuous service with their employer in the UAE is eligible for gratuity. This applies to UAE nationals, expats, full-time, and part-time workers. Domestic workers are also eligible under Federal Decree-Law No. 9 of 2022. Employees during probation (less than 6 months) or who leave before completing one year are generally not entitled to gratuity. Days of unpaid leave are excluded from the service period calculation." },
    { question: "How is gratuity calculated in the UAE?", answer: "UAE gratuity uses a tiered formula based on basic salary only (excluding allowances): Step 1 — Calculate daily wage: basic monthly salary ÷ 30. Step 2 — First 5 years: 21 × daily wage × number of years (up to 5). Step 3 — Beyond 5 years: 30 × daily wage × number of additional years. Step 4 — Add both amounts. Step 5 — Check against the 2-year salary cap (max gratuity = basic salary × 24 months). Fractional years are calculated proportionately." },
    { question: "Is gratuity calculated on basic salary or total salary?", answer: "Gratuity is calculated exclusively on the employee's last drawn basic salary, as stated in the UAE Labour Law. Basic salary is the fixed amount in the employment contract, excluding any allowances such as housing allowance, transportation allowance, utility allowance, phone allowance, bonuses, commissions, and overtime payments. This is one of the most common mistakes when estimating gratuity — using total salary instead of basic salary can significantly overestimate the actual entitlement." },
    { question: "Do I get full gratuity if I resign in the UAE?", answer: "Yes. Under the new UAE Labour Law (Federal Decree-Law No. 33 of 2021, effective February 2022), all employment contracts are now fixed-term (limited). This means the old distinction between 'limited' and 'unlimited' contracts is abolished, and the sliding scale reductions for resignation (1/3 for 1–3 years, 2/3 for 3–5 years) no longer apply. If you resign after completing one year of continuous service, you are entitled to your full gratuity calculated using the standard 21/30-day formula." },
    { question: "What is the maximum gratuity amount in the UAE?", answer: "The total end-of-service gratuity is capped at the equivalent of two years of the employee's basic salary (24 months). For example, if your basic salary is AED 15,000/month, the maximum gratuity you can receive is AED 15,000 × 24 = AED 360,000, regardless of how many years you have served. This cap is specified in Article 51(4) of Federal Decree-Law No. 33 of 2021." },
    { question: "How is gratuity calculated for domestic workers in the UAE?", answer: "Domestic workers (maids, nannies, drivers, cooks, private tutors, gardeners employed in a household) are governed by Federal Decree-Law No. 9 of 2022, not the general Labour Law. Their gratuity is calculated at 14 days' basic salary per completed year of service. For example, a domestic worker with a basic salary of AED 2,000/month who served 5 years would receive: (2,000 ÷ 30) × 14 × 5 = AED 4,667. The 2-year salary cap still applies." },
    { question: "How does part-time employee gratuity work in the UAE?", answer: "Part-time employees are entitled to gratuity under Article 18 of the UAE Labour Law. The calculation uses the standard 21/30-day formula, but the result is then adjusted pro-rata based on working hours. The formula: Part-Time Gratuity = Full-Time Gratuity × (Part-Time Weekly Hours ÷ Full-Time Weekly Hours). For example, if a part-time worker works 20 hours/week vs a full-time 48 hours/week (ratio: 41.7%), and the full-time gratuity would be AED 35,000, their gratuity is AED 35,000 × 41.7% = AED 14,583." },
    { question: "What is DIFC DEWS and how does it replace gratuity?", answer: "DIFC Employee Workplace Savings (DEWS) is a defined-contribution savings plan that replaced the traditional lump-sum gratuity for DIFC employees since February 1, 2020. Instead of a one-time payment on termination, employers make monthly contributions to a regulated investment fund: 5.83% of basic salary for the first 5 years of service, and 8.33% after 5 years. Employees receive the accumulated contributions plus investment returns when they leave. Employees can also make voluntary additional contributions. DEWS is managed by Zurich International Life." },
    { question: "What is the ADGM employment savings scheme?", answer: "Abu Dhabi Global Market (ADGM) introduced new Employment Regulations 2024 (effective April 1, 2025) that allow employers to replace the traditional gratuity system with a pension or savings scheme. This is a 'double voluntary' system — employers choose whether to offer the scheme, and employees choose whether to participate. If no savings scheme is adopted, the standard UAE gratuity formula (21/30 days) applies. This makes ADGM unique as it offers flexibility between old and new systems." },
    { question: "What is the UAE Voluntary Savings Scheme?", answer: "In October 2023, the UAE government introduced a Voluntary Alternative End-of-Service Benefits Scheme via Cabinet Resolution No. 96 of 2023. Private-sector employers (including most free zones, except DIFC and ADGM) can voluntarily choose to participate. Employer monthly contributions mirror gratuity rates: 5.83% of basic for ≤5 years, 8.33% for >5 years. Employees can add voluntary contributions up to 25% of annual salary. The scheme aims to protect employee benefits from inflation and employer insolvency through professional fund management." },
    { question: "Can an employer deny gratuity in the UAE?", answer: "Under the new UAE Labour Law, employers cannot deny gratuity to an employee who has completed one year of continuous service. Even in cases of gross misconduct or dismissal under Article 44 (theft, violence, fraud, etc.), the employee generally retains their right to gratuity. Forfeiture only occurs in extreme cases involving a court ruling. The employer may, however, pursue separate legal claims for proven damages. Employees who have not completed one year of service are not entitled to gratuity." },
    { question: "When must the employer pay gratuity?", answer: "According to Article 54 of the UAE Labour Law, employers must pay all outstanding wages, entitlements, and end-of-service gratuity within 14 days of the employee's last working day. Failure to pay within this timeframe can result in late payment penalties and legal action through MoHRE (Ministry of Human Resources and Emiratisation). Employees can file a complaint with MoHRE if payment is delayed beyond 14 days." },
    { question: "Does unpaid leave affect gratuity calculation?", answer: "Yes. Days of absence without pay (unpaid leave) are excluded from the calculation of the service period. For example, if you worked for 5 years but took 3 months of unpaid leave, your gratuity would be calculated on 4 years and 9 months of service, not 5 years. This is explicitly stated in the UAE Labour Law. Paid leave (annual leave, sick leave, maternity leave) does count toward the service period." },
    { question: "Is gratuity taxable in the UAE?", answer: "No. The UAE does not impose personal income tax, so your gratuity payment is received tax-free. There is no withholding tax, social security deduction, or other government levy on gratuity for expat employees. UAE nationals may have pension contributions through the GPSSA (General Pension and Social Security Authority), which functions differently from the gratuity system. For expats, the full gratuity amount is paid directly without any deductions (unless the employer has a court-ordered recovery claim)." },
    { question: "What happens to gratuity if employment ends during probation?", answer: "Employees whose employment terminates during the probation period (maximum 6 months in the UAE) are generally not entitled to gratuity. This is because the minimum qualifying period for gratuity is one year of continuous service. However, if the probation period is extended and the employee completes one year before termination, they become eligible. The probation period counts toward the total service period if the employee continues employment after probation." },
];

export default function GratuityCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Gratuity Calculator" },
        ]),
        webAppSchema("UAE Gratuity Calculator", canonicalUrl("/uae/gratuity-calculator")),
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
            <Script id="schema-gratuity-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Gratuity Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Gratuity Calculator 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your end-of-service gratuity in the UAE. Covers private sector, domestic workers, part-time employees, DIFC DEWS, and ADGM. Based on Federal Decree-Law No. 33 of 2021 and updated MoHRE guidelines.
            </p>
            <AuthorBadge categoryKey="salary" />
            <UAEGratuityCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Gratuity Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">Monthly EMI, DLD fees, DBR check</div>
                        </div>
                    </Link>
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
                            <div className="uae-related-link__desc">Invest your gratuity wisely</div>
                        </div>
                    </Link>
                    <Link href="/tax-calculators/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">VAT Calculator</div>
                            <div className="uae-related-link__desc">Calculate 5% UAE VAT</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-gratuity">What Is Gratuity in the UAE?</h2>
    <p><strong>Gratuity</strong> (also called <strong>end-of-service benefits</strong> or EOSB) is a mandatory lump-sum payment that employers in the UAE must pay to employees when their employment ends. It is one of the most important financial rights for workers in the United Arab Emirates, affecting millions of employees — particularly the large expatriate workforce that makes up over <strong>85%</strong> of the private sector.</p>
    <p>The gratuity system is governed by <strong>Federal Decree-Law No. 33 of 2021</strong> on the Regulation of Labour Relations (commonly called the "New UAE Labour Law"), which came into effect on <strong>February 2, 2022</strong>. This law replaced the old Federal Law No. 8 of 1980 and introduced significant changes — most notably, abolishing the distinction between "limited" and "unlimited" contracts and ensuring full gratuity entitlement for all qualifying employees regardless of whether they resign or are terminated.</p>
    <p>Gratuity effectively serves as a form of <strong>savings or pension</strong> for employees, since the UAE does not have a mandatory pension scheme for expats. Understanding how it works is critical for financial planning, negotiating salaries, and knowing your rights when leaving a job.</p>

    <h2 id="eligibility">Who Is Eligible for Gratuity?</h2>
    <p>To qualify for end-of-service gratuity in the UAE, an employee must meet the following conditions:</p>
    <ul>
        <li><strong>Minimum one year</strong> of continuous service with the same employer</li>
        <li>Employment must be governed by the <strong>UAE Labour Law</strong> (private sector)</li>
        <li>Days of <strong>unpaid leave</strong> are excluded from the service period</li>
        <li><strong>Paid leave</strong> (annual, sick, maternity) counts toward service</li>
    </ul>
    <p>Employees who are <strong>not eligible</strong> include:</p>
    <ul>
        <li>Workers who leave during <strong>probation</strong> (before completing 1 year)</li>
        <li>Government sector employees (covered by separate pension schemes)</li>
        <li>UAE/GCC nationals enrolled in <strong>GPSSA</strong> (General Pension and Social Security Authority)</li>
        <li>Free-lance or gig workers not under a standard employment contract</li>
    </ul>

    <h2 id="contract-types">Contract Types in 2025 — The End of "Unlimited" Contracts</h2>
    <p>One of the most significant changes under the new UAE Labour Law is the <strong>abolition of unlimited contracts</strong>. Prior to February 2022, UAE employment contracts were classified as either:</p>
    <table>
        <thead><tr><th>Aspect</th><th>Old Law (Before Feb 2022)</th><th>New Law (Feb 2022 Onwards)</th></tr></thead>
        <tbody>
            <tr><td><strong>Contract Types</strong></td><td>Limited (fixed-term) + Unlimited (open-ended)</td><td>All contracts are <strong>fixed-term (limited)</strong></td></tr>
            <tr><td><strong>Maximum Duration</strong></td><td>Unlimited had no end date</td><td>Maximum <strong>3 years</strong>, renewable</td></tr>
            <tr><td><strong>Resignation Penalty</strong></td><td>Unlimited: reduced gratuity (1/3, 2/3)</td><td><strong>No reduction</strong> — full gratuity on resignation</td></tr>
            <tr><td><strong>Transition Deadline</strong></td><td>N/A</td><td>All unlimited contracts had to be converted by Feb 2023</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key takeaway for 2025:</strong> If you resign after completing one year of service, you are entitled to <strong>full gratuity</strong> — calculated exactly the same way as if you were terminated. The old sliding-scale reductions (1/3 for 1–3 years, 2/3 for 3–5 years) no longer apply. Many online calculators and articles still reference these old rules — they are outdated.
    </div>

    <h2 id="formula">Gratuity Calculation Formula</h2>
    <p>The standard formula for calculating end-of-service gratuity in the UAE (for private sector employees):</p>
    <div class="explanation__highlight">
        <strong>Step 1:</strong> Daily Wage = Basic Monthly Salary ÷ 30<br/><br/>
        <strong>Step 2:</strong> Gratuity for first 5 years = 21 × Daily Wage × Years (up to 5)<br/><br/>
        <strong>Step 3:</strong> Gratuity beyond 5 years = 30 × Daily Wage × (Total Years − 5)<br/><br/>
        <strong>Step 4:</strong> Total Gratuity = Step 2 + Step 3<br/><br/>
        <strong>Step 5:</strong> Cap Check — Total cannot exceed <strong>2 years' basic salary</strong> (24 months)
    </div>
    <p><strong>Important notes:</strong></p>
    <ul>
        <li>Use <strong>basic salary only</strong> — exclude housing, transport, bonuses, commissions, overtime</li>
        <li>Use the <strong>last drawn</strong> basic salary (not the average or starting salary)</li>
        <li>Fractional years are calculated <strong>proportionately</strong> (e.g., 7 years 6 months = 7.5 years)</li>
        <li>The divisor is always <strong>30</strong> (not calendar days in the month)</li>
    </ul>

    <h2 id="worked-examples">Worked Examples</h2>

    <h3>Example 1: 3 Years Service — Basic Salary AED 8,000</h3>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Daily Wage</td><td>AED 8,000 ÷ 30</td><td>AED 266.67</td></tr>
            <tr><td>First 5 years</td><td>21 × 266.67 × 3</td><td>AED 16,800</td></tr>
            <tr><td>Beyond 5 years</td><td>N/A</td><td>AED 0</td></tr>
            <tr><td><strong>Total Gratuity</strong></td><td></td><td><strong>AED 16,800</strong></td></tr>
            <tr><td>Cap Check</td><td>16,800 < 192,000 (8,000 × 24)</td><td>✅ Within cap</td></tr>
        </tbody>
    </table>

    <h3>Example 2: 7 Years 6 Months — Basic Salary AED 15,000</h3>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Daily Wage</td><td>AED 15,000 ÷ 30</td><td>AED 500</td></tr>
            <tr><td>First 5 years</td><td>21 × 500 × 5</td><td>AED 52,500</td></tr>
            <tr><td>Beyond 5 years</td><td>30 × 500 × 2.5</td><td>AED 37,500</td></tr>
            <tr><td><strong>Total Gratuity</strong></td><td></td><td><strong>AED 90,000</strong></td></tr>
            <tr><td>Cap Check</td><td>90,000 < 360,000 (15,000 × 24)</td><td>✅ Within cap</td></tr>
        </tbody>
    </table>

    <h3>Example 3: 12 Years — Basic Salary AED 10,000</h3>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Daily Wage</td><td>AED 10,000 ÷ 30</td><td>AED 333.33</td></tr>
            <tr><td>First 5 years</td><td>21 × 333.33 × 5</td><td>AED 35,000</td></tr>
            <tr><td>Beyond 5 years</td><td>30 × 333.33 × 7</td><td>AED 70,000</td></tr>
            <tr><td><strong>Total Gratuity</strong></td><td></td><td><strong>AED 105,000</strong></td></tr>
            <tr><td>Cap Check</td><td>105,000 < 240,000 (10,000 × 24)</td><td>✅ Within cap</td></tr>
        </tbody>
    </table>

    <h3>Example 4: When the 2-Year Cap Applies</h3>
    <p>An employee with basic salary AED 5,000 serving 25 years:</p>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Daily Wage</td><td>AED 5,000 ÷ 30</td><td>AED 166.67</td></tr>
            <tr><td>First 5 years</td><td>21 × 166.67 × 5</td><td>AED 17,500</td></tr>
            <tr><td>Beyond 5 years</td><td>30 × 166.67 × 20</td><td>AED 100,000</td></tr>
            <tr><td>Sub-total</td><td></td><td>AED 117,500</td></tr>
            <tr><td><strong>Cap Check</strong></td><td>117,500 < 120,000 (5,000 × 24)</td><td><strong>✅ Within cap</strong></td></tr>
            <tr><td><strong>Final Gratuity</strong></td><td></td><td><strong>AED 117,500</strong></td></tr>
        </tbody>
    </table>

    <h2 id="domestic-workers">Domestic Worker Gratuity</h2>
    <p>Domestic workers in the UAE are governed by a <strong>separate law</strong> — <strong>Federal Decree-Law No. 9 of 2022</strong> on Domestic Workers. This covers employees such as:</p>
    <ul>
        <li>Housemaids and cleaners</li>
        <li>Nannies and au pairs</li>
        <li>Private drivers</li>
        <li>Cooks and chefs (employed by a household)</li>
        <li>Private tutors</li>
        <li>Gardeners</li>
        <li>Private security guards</li>
        <li>Private nurses</li>
    </ul>
    <p>The gratuity formula for domestic workers is different:</p>
    <div class="explanation__highlight">
        <strong>Domestic Worker Gratuity = 14 days × Daily Wage × Years of Service</strong><br/><br/>
        Where Daily Wage = Basic Monthly Salary ÷ 30<br/><br/>
        Cap: Total gratuity ≤ 2 years' basic salary
    </div>
    <p><strong>Example:</strong> Domestic worker with AED 2,000/month basic salary, 6 years service:</p>
    <p>Daily wage = 2,000 ÷ 30 = AED 66.67 → Gratuity = 14 × 66.67 × 6 = <strong>AED 5,600</strong></p>

    <h2 id="part-time">Part-Time Employee Gratuity</h2>
    <p>Under <strong>Article 18</strong> of the new UAE Labour Law, part-time workers are entitled to gratuity. The calculation uses the standard 21/30-day formula, but the result is then adjusted <strong>pro-rata</strong> based on working hours:</p>
    <div class="explanation__highlight">
        <strong>Part-Time Gratuity = Full-Time Gratuity × (Part-Time Weekly Hours ÷ Full-Time Weekly Hours)</strong>
    </div>
    <p><strong>Example:</strong> Part-time employee works 20 hours/week (vs 48 hours full-time), basic salary AED 6,000, 4 years service:</p>
    <table>
        <thead><tr><th>Step</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Full-time gratuity</td><td>21 × (6,000 ÷ 30) × 4</td><td>AED 16,800</td></tr>
            <tr><td>Hours ratio</td><td>20 ÷ 48</td><td>41.67%</td></tr>
            <tr><td><strong>Part-time gratuity</strong></td><td>16,800 × 41.67%</td><td><strong>AED 7,000</strong></td></tr>
        </tbody>
    </table>

    <h2 id="difc-dews">DIFC DEWS — Employee Workplace Savings</h2>
    <p>The <strong>Dubai International Financial Centre (DIFC)</strong> operates under a unique system that replaced traditional gratuity with a <strong>defined-contribution savings plan</strong> called <strong>DEWS (DIFC Employee Workplace Savings)</strong>, effective <strong>February 1, 2020</strong>.</p>

    <h3>How DEWS Works</h3>
    <ul>
        <li><strong>Employer contributions</strong> are made monthly to a regulated investment fund managed by <strong>Zurich International Life</strong></li>
        <li>Contribution rates:
            <ul>
                <li><strong>5.83%</strong> of basic salary for the first 5 years of service</li>
                <li><strong>8.33%</strong> of basic salary for each year beyond 5 years</li>
            </ul>
        </li>
        <li><strong>Employee voluntary contributions</strong> — employees can make additional contributions</li>
        <li>Upon termination, the employee receives <strong>accumulated contributions + investment returns</strong></li>
        <li>Investments are professionally managed in <strong>Sharia-compliant and conventional funds</strong></li>
    </ul>

    <h3>DEWS vs Traditional Gratuity</h3>
    <table>
        <thead><tr><th>Feature</th><th>Traditional Gratuity</th><th>DIFC DEWS</th></tr></thead>
        <tbody>
            <tr><td><strong>Payment Type</strong></td><td>Lump sum on termination</td><td>Monthly contributions + returns</td></tr>
            <tr><td><strong>Employer Risk</strong></td><td>Large liability at termination</td><td>Spread evenly monthly</td></tr>
            <tr><td><strong>Employee Risk</strong></td><td>Employer insolvency risk</td><td>Protected in external fund</td></tr>
            <tr><td><strong>Investment Returns</strong></td><td>None</td><td>Potential investment growth</td></tr>
            <tr><td><strong>Portability</strong></td><td>Lost on job change</td><td>Accrued balance preserved</td></tr>
            <tr><td><strong>Transparency</strong></td><td>Calculated at end</td><td>Visible balance anytime</td></tr>
        </tbody>
    </table>

    <h2 id="adgm">ADGM — Abu Dhabi Global Market</h2>
    <p><strong>ADGM</strong> generally follows the standard UAE gratuity calculation. However, new <strong>Employment Regulations 2024</strong> (effective <strong>April 1, 2025</strong>) introduce an important change:</p>
    <ul>
        <li>Employers can now offer an <strong>optional savings/pension scheme</strong> as an alternative to gratuity</li>
        <li>The scheme is <strong>"double voluntary"</strong> — employers choose to offer it, employees choose to participate</li>
        <li>If neither party opts in, the <strong>standard gratuity formula</strong> (21/30 days) applies</li>
        <li>UAE/GCC nationals enrolled in federal pension schemes are exempt from traditional gratuity</li>
    </ul>

    <h2 id="voluntary-savings">Voluntary Alternative Savings Scheme</h2>
    <p>In October 2023, the UAE government introduced a <strong>Voluntary Alternative End-of-Service Benefits Scheme</strong> via <strong>Cabinet Resolution No. 96 of 2023</strong>. This is separate from DIFC DEWS and ADGM:</p>
    <table>
        <thead><tr><th>Feature</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Applicability</strong></td><td>Private sector + most free zones (not DIFC, not ADGM)</td></tr>
            <tr><td><strong>Participation</strong></td><td>Voluntary — employer chooses to join</td></tr>
            <tr><td><strong>Employer Rate (≤ 5 yrs)</strong></td><td>5.83% of basic salary/month</td></tr>
            <tr><td><strong>Employer Rate (> 5 yrs)</strong></td><td>8.33% of basic salary/month</td></tr>
            <tr><td><strong>Employee Voluntary</strong></td><td>Up to 25% of annual salary</td></tr>
            <tr><td><strong>Withdrawal</strong></td><td>Employee voluntary contributions can be withdrawn anytime</td></tr>
            <tr><td><strong>Accrued Rights</strong></td><td>Pre-existing gratuity entitlements must be preserved</td></tr>
            <tr><td><strong>Regulatory Body</strong></td><td>Securities and Commodities Authority (SCA)</td></tr>
        </tbody>
    </table>

    <h2 id="article-44">Article 44 — Gross Misconduct and Gratuity</h2>
    <p>A common concern: <em>"Will I lose my gratuity if I'm dismissed for misconduct?"</em></p>
    <p>Under the <strong>new UAE Labour Law</strong>, employees <strong>do not automatically lose their gratuity</strong> even if dismissed under Article 44 (summary dismissal for gross misconduct). Article 44 grounds include:</p>
    <ul>
        <li>Falsifying identity or submitting forged certificates</li>
        <li>Committing a serious error causing substantial loss to the employer</li>
        <li>Violating workplace safety instructions</li>
        <li>Failing to perform basic duties despite written warnings</li>
        <li>Disclosing company trade secrets</li>
        <li>Being intoxicated at work</li>
        <li>Assaulting the employer, manager, or colleagues</li>
        <li>Absence without valid reason for more than 20 non-consecutive days (or 7 consecutive days) in one year</li>
    </ul>
    <p>While the employer can terminate the employee for these violations, <strong>gratuity is retained</strong>. Forfeiture only occurs through a <strong>court order</strong> in extreme cases. The employer may separately sue for proven damages.</p>
    <div class="explanation__highlight">
        <strong>Key change from old law:</strong> Under the old Federal Law No. 8/1980, Article 120 dismissal automatically forfeited all gratuity. Under the new law, this is <strong>no longer</strong> the case. This is one of the most significant employee protections introduced in 2022.
    </div>

    <h2 id="common-mistakes">Common Mistakes When Calculating Gratuity</h2>
    <ol>
        <li><strong>Using total salary instead of basic salary</strong> — Gratuity is calculated on basic salary only. If your total package is AED 20,000 but basic is AED 12,000, gratuity is on AED 12,000.</li>
        <li><strong>Referencing unlimited contract rules</strong> — The old sliding-scale reductions (1/3, 2/3) no longer apply as of Feb 2022. All contracts are now limited.</li>
        <li><strong>Forgetting the 2-year cap</strong> — Even with 30+ years of service, the maximum gratuity is 24 months of basic salary.</li>
        <li><strong>Including allowances in basic</strong> — Housing, transportation, commissions, and bonuses are excluded.</li>
        <li><strong>Ignoring unpaid leave</strong> — Days of absence without pay reduce the service period.</li>
        <li><strong>Using calendar days instead of 30</strong> — Always divide monthly salary by 30 (not 28, 29, or 31).</li>
        <li><strong>Not accounting for partial years</strong> — If you served 5 years and 3 months, the 3 months counts proportionately.</li>
        <li><strong>Confusing DIFC rules with mainland rules</strong> — DIFC employees are under DEWS, not the standard gratuity formula.</li>
    </ol>

    <h2 id="maximize-gratuity">Tips to Maximize Your Gratuity</h2>
    <ol>
        <li><strong>Negotiate a higher basic salary</strong> — Since gratuity is calculated on basic, a higher basic-to-total ratio means more gratuity. Example: AED 20,000 total with AED 15,000 basic gives 50% more gratuity than AED 20,000 total with AED 10,000 basic.</li>
        <li><strong>Complete at least 5 years</strong> — The rate jumps from 21 days/year to 30 days/year after 5 years — a <strong>43% increase</strong> per year.</li>
        <li><strong>Time your departure</strong> — If you're near a year boundary, staying a few extra weeks to complete the year gives you gratuity for the full additional year.</li>
        <li><strong>Keep records</strong> — Maintain copies of your contract, salary certificates, and bank statements showing basic salary.</li>
        <li><strong>Verify your basic salary in the contract</strong> — Ensure your employment contract clearly states the basic salary separately from allowances.</li>
        <li><strong>Request a salary breakdown from HR</strong> — Get a written confirmation of what constitutes "basic" vs "allowances" before departure.</li>
        <li><strong>Track unpaid leave days</strong> — Know exactly how many days (if any) were unpaid, as these reduce your service period.</li>
    </ol>

    <h2 id="payment-timeline">Payment Timeline and Disputes</h2>
    <p>Under <strong>Article 54</strong> of the UAE Labour Law:</p>
    <table>
        <thead><tr><th>Requirement</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Payment Deadline</strong></td><td>14 days from the last working day</td></tr>
            <tr><td><strong>Includes</strong></td><td>Outstanding wages + unused annual leave + gratuity</td></tr>
            <tr><td><strong>If Employer Delays</strong></td><td>File complaint with MoHRE (Ministry of Human Resources and Emiratisation)</td></tr>
            <tr><td><strong>MoHRE Contact</strong></td><td>Call 600-590000 or use the MoHRE app/website</td></tr>
            <tr><td><strong>Dispute Resolution</strong></td><td>MoHRE mediates first → referred to Labour Court if unresolved</td></tr>
            <tr><td><strong>Filing Deadline</strong></td><td>Claim must be filed within <strong>1 year</strong> of the employment end date</td></tr>
        </tbody>
    </table>

    <h2 id="documents">Documents Needed When Claiming Gratuity</h2>
    <ul>
        <li><strong>Employment contract</strong> — showing basic salary, start date, and contract type</li>
        <li><strong>Resignation letter or termination notice</strong> — proving the employment ended</li>
        <li><strong>Last salary certificate</strong> — showing basic + allowances breakdown</li>
        <li><strong>Bank statements</strong> — showing salary credits (in case of dispute)</li>
        <li><strong>Emirates ID</strong> — for identity verification with MoHRE</li>
        <li><strong>AECB credit report</strong> — optional but useful if employer claims deductions</li>
        <li><strong>Service certificate</strong> — if issued, confirms dates and position</li>
    </ul>

    <h2 id="free-zones">Free Zone Gratuity Rules</h2>
    <p>Most UAE free zones follow the <strong>mainland UAE Labour Law</strong> for gratuity calculations, including:</p>
    <table>
        <thead><tr><th>Free Zone</th><th>Gratuity System</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>JAFZA</strong> (Jebel Ali)</td><td>Standard 21/30-day formula</td><td>Follows Federal Decree-Law 33/2021</td></tr>
            <tr><td><strong>DAFZA</strong> (Dubai Airport)</td><td>Standard formula</td><td>Same as mainland</td></tr>
            <tr><td><strong>DMCC</strong></td><td>Standard formula</td><td>Same as mainland</td></tr>
            <tr><td><strong>Dubai Silicon Oasis</strong></td><td>Standard formula</td><td>Same as mainland</td></tr>
            <tr><td><strong>Sharjah FZs</strong></td><td>Standard formula</td><td>Same as mainland</td></tr>
            <tr><td><strong>RAK FTZ</strong></td><td>Standard formula</td><td>Same as mainland</td></tr>
            <tr><td><strong>DIFC</strong></td><td><strong>DEWS plan</strong></td><td>Own employment law — DIFC Law No. 2/2019</td></tr>
            <tr><td><strong>ADGM</strong></td><td>Standard + optional savings</td><td>Employment Regs 2024, effective April 2025</td></tr>
        </tbody>
    </table>

    <h2 id="invest-gratuity">What to Do With Your Gratuity</h2>
    <p>Since UAE gratuity is paid <strong>tax-free</strong>, it represents a significant financial windfall. Here are smart ways to invest it:</p>
    <ul>
        <li><strong>Emergency fund</strong> — Keep 3–6 months' expenses in a savings account, especially if relocating</li>
        <li><strong>Pay off high-interest debt</strong> — Clear credit card balances or personal loans first</li>
        <li><strong>Invest in home country</strong> — Real estate, retirement funds, or stock market investments</li>
        <li><strong>UAE investments</strong> — If staying in the UAE, consider <a href="/investment-calculators/compound-interest-calculator">compound interest investments</a> or UAE-listed ETFs</li>
        <li><strong>Gold</strong> — UAE is a major gold trading hub with competitive prices</li>
        <li><strong>Education fund</strong> — Set aside money for children's education</li>
        <li><strong>Start a business</strong> — Use gratuity as seed capital for entrepreneurship</li>
    </ul>
`;

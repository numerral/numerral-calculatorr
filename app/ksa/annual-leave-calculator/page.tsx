// Standalone page — /ksa/annual-leave-calculator
// KSA Annual Leave Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Annual Leave Calculator (KSA) — Saudi Labor Law",
    description: "Calculate your annual leave entitlement in Saudi Arabia. 21 days under 5 years, 30 days for 5+ years. Covers encashment, carry-forward, and all Saudi leave types.",
    keywords: ["Saudi annual leave calculator", "Article 109", "حاسبة الإجازة السنوية", "Saudi vacation days", "KSA leave entitlement", "leave encashment Saudi", "Saudi labor law leave", "annual leave pay calculator"],
    alternates: { canonical: canonicalUrl("/ksa/annual-leave-calculator") },
};

const FAQ_ITEMS = [
    { question: "How many annual leave days do I get in Saudi Arabia?", answer: "Under Article 109: employees with less than 5 years of continuous service get 21 days per year. After completing 5 years with the same employer, this increases to 30 days per year. These are minimum entitlements — contracts may offer more but never less." },
    { question: "How is leave pay calculated?", answer: "Leave pay is based on your 'actual wage' (basic salary + all regular allowances). Daily rate = Monthly Salary ÷ 30. For example, with SAR 10,000 salary: daily rate = SAR 333.33. For 21 days leave: SAR 333.33 × 21 = SAR 7,000 leave pay." },
    { question: "Can I encash unused annual leave?", answer: "Not during service — Article 110 prohibits employees from forfeiting leave for cash while employed. However, at termination (Article 111), you receive full payment for all accrued unused leave days based on your actual wage at the time leave was due." },
    { question: "Can annual leave be carried forward?", answer: "Yes, with employer consent. Under Article 110, leave can be postponed to the following year. The employer can also postpone leave for up to 90 days after the year ends if work requires it. Beyond 90 days, the employee's written consent is needed, and postponement cannot extend past the end of the following year." },
    { question: "Is annual leave based on calendar days or working days?", answer: "Under the 2025 standard Qiwa employment contract, annual leave specifically refers to working days — weekends and public holidays falling within the leave period do not count against the entitlement. This is a clarification from recent amendments." },
    { question: "Do I get annual leave during probation?", answer: "Yes. Employees on probation (up to 90 days, extendable to 180) are entitled to regular annual leave and official holidays. However, leave may be limited during probation by company policy. Eid holidays and sick leave do not count toward the probation period." },
    { question: "How does sick leave work in Saudi Arabia?", answer: "Under Article 117, employees get 120 days of sick leave per year (rolling 12-month basis): First 30 days — full pay; Next 60 days — 75% pay; Final 30 days — unpaid. A medical certificate from a licensed physician is mandatory. Sick leave does not reduce annual leave entitlement." },
    { question: "What is Hajj leave?", answer: "Under Article 114, employees who have completed 2+ years of service are entitled to 10-15 days of paid leave to perform Hajj. This is a one-time entitlement per employer and includes Eid Al-Adha holidays. Employers may limit the number of employees taking Hajj leave simultaneously." },
    { question: "What is maternity leave in Saudi Arabia?", answer: "Under Article 151, female employees get 10 weeks (70 days) of fully paid maternity leave: 6 weeks must be taken immediately after childbirth, and the remaining can be distributed before/after delivery. This can be extended by 1 month unpaid. For a sick/disabled newborn, an additional 1 month paid + 1 month unpaid is available." },
    { question: "What are the bereavement leave rules?", answer: "Under Article 113: Death of spouse, parent, or child — 5 days paid. Death of sibling — 3 days paid (2025 amendment). Muslim widow Iddah — 4 months 10 days paid. Non-Muslim widow — 15 days paid. These are separate from annual leave." },
    { question: "What happens to my leave if I resign?", answer: "Under Article 111, upon resignation or any form of termination, you receive monetary compensation for all accrued unused annual leave. The calculation is based on your actual wage at the time the leave was due. This includes pro-rata leave for incomplete years." },
    { question: "Can my employer refuse my annual leave request?", answer: "The employer can schedule leave dates according to work requirements (Article 110) but must notify you at least 30 days in advance. The employer cannot deny annual leave entirely — it is a legal right. If unable to take leave due to work, the leave must be carried forward with proper documentation." },
    { question: "How is pro-rata leave calculated?", answer: "For employees who haven't completed a full year: Under 5 years — accrue 1.75 days per month (21 ÷ 12). Over 5 years — accrue 2.5 days per month (30 ÷ 12). Example: 7 months of service = 7 × 1.75 = 12.25 days of accrued leave." },
    { question: "Are public holidays separate from annual leave?", answer: "Yes. Saudi public holidays are fully paid and do not count against annual leave: Eid Al-Fitr (~4 days), Eid Al-Adha (~4 days), Saudi National Day (Sep 23), and Founding Day (Feb 22). If a holiday falls during annual leave, the leave is extended by the same number of holiday days." },
    { question: "What is the difference between leave pay and EOSB?", answer: "Leave pay is compensation for annual leave days (based on actual wage). EOSB (End of Service Benefit) is a lump-sum gratuity paid at termination based on years of service. They are separate entitlements — upon termination, you receive both: unused leave pay + EOSB. Use our EOSB Calculator for end-of-service calculations." },
];

export default function LeavePage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Annual Leave Calculator" },
        ]),
        webAppSchema("Annual Leave Calculator (KSA)", canonicalUrl("/ksa/annual-leave-calculator")),
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
            <Script id="schema-leave" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Annual Leave Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Annual Leave Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your annual leave entitlement, remaining balance, leave pay, and encashment value under Saudi Labor Law Articles 109-113.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="leave" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Annual Leave FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net salary in KSA</div>
                        </div>
                    </Link>
                    <Link href="/ksa/overtime-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">⏱️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Overtime Calculator</div>
                            <div className="ksa-related-link__desc">Calculate 150% overtime pay</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">Leave pay is separate from EOSB</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">Social insurance contributions</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="annual-leave">Annual Leave in Saudi Arabia</h2>
    <p><strong>Annual leave (الإجازة السنوية)</strong> is a fundamental employee right under the Saudi Labor Law. Every worker in the Kingdom — both Saudi nationals and expatriates — is entitled to a minimum number of paid vacation days each year, based on their length of service.</p>
    <p>The rules are primarily governed by <strong>Articles 109-113</strong> of the Saudi Labor Law, with additional provisions for special leaves under Articles 114-117 and 151-160.</p>

    <h2 id="article-109">Article 109 — Leave Entitlement</h2>
    <table>
        <thead><tr><th>Service Duration</th><th>Annual Leave</th><th>Accrual Rate</th></tr></thead>
        <tbody>
            <tr><td><strong>Less than 5 years</strong></td><td>21 days per year</td><td>1.75 days/month</td></tr>
            <tr><td><strong>5+ years</strong></td><td>30 days per year</td><td>2.5 days/month</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Points:</strong><br/>
        • These are <strong>minimum</strong> entitlements — contracts may offer more<br/>
        • Leave is <strong>paid in advance</strong> before the employee starts vacation<br/>
        • Applies to both Saudi nationals and expatriates<br/>
        • Under 2025 amendments: "days" refers to <strong>working days</strong> (weekends excluded)
    </div>

    <h2 id="leave-pay">How to Calculate Leave Pay</h2>
    <div class="explanation__highlight">
        <strong>Daily Rate = Monthly Actual Wage ÷ 30</strong><br/>
        <strong>Leave Pay = Daily Rate × Number of Leave Days</strong><br/><br/>
        <em>"Actual Wage" includes basic salary + all regular, fixed allowances (housing, transport, etc.)</em>
    </div>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: Employee with 3 Years of Service</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 10,000</td></tr>
            <tr><td>Years of Service</td><td>3 years (<5)</td></tr>
            <tr><td>Leave Entitlement</td><td>21 days</td></tr>
            <tr><td>Daily Rate</td><td>SAR 10,000 ÷ 30 = SAR 333.33</td></tr>
            <tr><td><strong>Leave Pay</strong></td><td><strong>21 × SAR 333.33 = SAR 7,000</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: Senior Employee with 8 Years of Service</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 15,000</td></tr>
            <tr><td>Years of Service</td><td>8 years (5+)</td></tr>
            <tr><td>Leave Entitlement</td><td>30 days</td></tr>
            <tr><td>Daily Rate</td><td>SAR 15,000 ÷ 30 = SAR 500</td></tr>
            <tr><td><strong>Leave Pay</strong></td><td><strong>30 × SAR 500 = SAR 15,000</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 3: Pro-Rata Leave (7 Months of Service)</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Salary</td><td>SAR 8,000</td></tr>
            <tr><td>Service</td><td>7 months (<5 years)</td></tr>
            <tr><td>Accrual Rate</td><td>1.75 days/month</td></tr>
            <tr><td>Accrued Leave</td><td>7 × 1.75 = 12.25 days</td></tr>
            <tr><td>Daily Rate</td><td>SAR 8,000 ÷ 30 = SAR 266.67</td></tr>
            <tr><td><strong>Encashment</strong></td><td><strong>12.25 × SAR 266.67 = SAR 3,266.67</strong></td></tr>
        </tbody>
    </table>

    <h2 id="article-110">Article 110 — Carry-Forward & Postponement</h2>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Scheduling</strong></td><td>Employer sets dates; must notify 30 days in advance</td></tr>
            <tr><td><strong>Same-year use</strong></td><td>Leave must generally be taken in the year it accrues</td></tr>
            <tr><td><strong>Employee postpone</strong></td><td>With employer consent, leave can be deferred to next year</td></tr>
            <tr><td><strong>Employer postpone</strong></td><td>Up to 90 days past year-end if work requires</td></tr>
            <tr><td><strong>Beyond 90 days</strong></td><td>Requires employee's written consent; cannot extend past end of following year</td></tr>
            <tr><td><strong>No cash-in-lieu</strong></td><td>Employee cannot forfeit leave for cash during employment</td></tr>
        </tbody>
    </table>

    <h2 id="article-111">Article 111 — Leave Encashment at Termination</h2>
    <p>When employment ends — whether by resignation, termination, or contract expiry — the employee receives <strong>full monetary compensation</strong> for all accrued unused annual leave:</p>
    <ul>
        <li>Based on <strong>actual wage</strong> at the time the leave was due</li>
        <li>Includes <strong>pro-rata</strong> leave for incomplete service years</li>
        <li>Applies regardless of who initiated the termination</li>
        <li>This is <strong>separate from and in addition to</strong> the End of Service Benefit (<a href="/ksa/end-of-service-calculator">EOSB Calculator</a>)</li>
    </ul>

    <h2 id="all-leave-types">All Saudi Leave Types</h2>
    <table>
        <thead><tr><th>Leave Type</th><th>Duration</th><th>Pay</th><th>Article</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual Leave (<5yr)</strong></td><td>21 days</td><td>Full pay</td><td>Art 109</td></tr>
            <tr><td><strong>Annual Leave (5+yr)</strong></td><td>30 days</td><td>Full pay</td><td>Art 109</td></tr>
            <tr><td><strong>Sick Leave</strong></td><td>120 days</td><td>30d full + 60d 75% + 30d unpaid</td><td>Art 117</td></tr>
            <tr><td><strong>Marriage Leave</strong></td><td>5 days</td><td>Full pay</td><td>Art 113</td></tr>
            <tr><td><strong>Paternity Leave</strong></td><td>3 days</td><td>Full pay (within 7 days of birth)</td><td>Art 113</td></tr>
            <tr><td><strong>Bereavement</strong></td><td>5 days</td><td>Full pay (spouse, parent, child)</td><td>Art 113</td></tr>
            <tr><td><strong>Sibling Bereavement</strong></td><td>3 days</td><td>Full pay (2025 amendment)</td><td>Art 113</td></tr>
            <tr><td><strong>Maternity Leave</strong></td><td>10 weeks</td><td>Full pay (6wk post-birth mandatory)</td><td>Art 151</td></tr>
            <tr><td><strong>Hajj Leave</strong></td><td>10–15 days</td><td>Full pay (once, 2+ years service)</td><td>Art 114</td></tr>
            <tr><td><strong>Iddah (Muslim widow)</strong></td><td>4 mo 10 days</td><td>Full pay</td><td>Art 160</td></tr>
            <tr><td><strong>Study/Exam Leave</strong></td><td>Exam days</td><td>Full pay (if employer approved)</td><td>Art 115</td></tr>
            <tr><td><strong>Unpaid Leave</strong></td><td>By agreement</td><td>Unpaid (>20d suspends contract)</td><td>Custom</td></tr>
        </tbody>
    </table>

    <h2 id="sick-leave">Sick Leave — Detailed Breakdown</h2>
    <table>
        <thead><tr><th>Period</th><th>Days</th><th>Pay</th></tr></thead>
        <tbody>
            <tr><td>First period</td><td>30 days</td><td>100% (full pay)</td></tr>
            <tr><td>Second period</td><td>60 days</td><td>75% pay</td></tr>
            <tr><td>Third period</td><td>30 days</td><td>0% (unpaid)</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>120 days</strong></td><td>—</td></tr>
        </tbody>
    </table>
    <p>Sick leave is calculated on a rolling 12-month basis. A medical certificate from a licensed physician is mandatory. Sick leave does not reduce annual leave entitlement.</p>

    <h2 id="public-holidays">Public Holidays (Separate from Annual Leave)</h2>
    <table>
        <thead><tr><th>Holiday</th><th>Duration</th><th>Pay</th></tr></thead>
        <tbody>
            <tr><td><strong>Eid Al-Fitr</strong></td><td>~4 days</td><td>Full pay</td></tr>
            <tr><td><strong>Eid Al-Adha</strong></td><td>~4 days</td><td>Full pay</td></tr>
            <tr><td><strong>Saudi National Day</strong></td><td>1 day (Sep 23)</td><td>Full pay</td></tr>
            <tr><td><strong>Founding Day</strong></td><td>1 day (Feb 22)</td><td>Full pay</td></tr>
        </tbody>
    </table>
    <p>If a public holiday falls during annual leave, the leave is <strong>extended</strong> by the number of holiday days. Working on a public holiday is overtime at 150% (<a href="/ksa/overtime-calculator">Overtime Calculator</a>).</p>

    <h2 id="termination-settlement">Leave + EOSB at Termination</h2>
    <p>When employment ends, the employee's final settlement includes multiple components:</p>
    <table>
        <thead><tr><th>Component</th><th>Basis</th><th>Calculator</th></tr></thead>
        <tbody>
            <tr><td><strong>Unused Leave Pay</strong></td><td>Daily rate × unused days (Article 111)</td><td>This calculator</td></tr>
            <tr><td><strong>EOSB</strong></td><td>Based on years of service (Articles 84-87)</td><td><a href="/ksa/end-of-service-calculator">EOSB Calculator</a></td></tr>
            <tr><td><strong>Final Month Salary</strong></td><td>Pro-rata for partial month worked</td><td><a href="/ksa/salary-calculator">Salary Calculator</a></td></tr>
            <tr><td><strong>Repatriation</strong></td><td>Employer covers flight ticket (expats)</td><td>—</td></tr>
        </tbody>
    </table>
`;

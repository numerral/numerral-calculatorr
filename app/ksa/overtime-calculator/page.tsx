// Standalone page — /ksa/overtime-calculator
// KSA Overtime Calculator with educational content

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
    title: "Overtime Calculator (KSA) — Saudi Labor Law Article 107",
    description: "Calculate your overtime pay in Saudi Arabia. 150% rate for weekdays, weekends, and holidays. Covers normal and Ramadan hours based on Saudi Labor Law.",
    keywords: ["Saudi overtime calculator", "Article 107", "حاسبة العمل الإضافي", "Saudi labor law overtime", "KSA overtime rate", "Ramadan working hours", "Saudi hourly rate calculator", "weekend overtime Saudi"],
    alternates: { canonical: canonicalUrl("/ksa/overtime-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is the overtime rate in Saudi Arabia?", answer: "Under Saudi Labor Law Article 107, all overtime is compensated at 150% (1.5×) of the employee's regular hourly wage. This rate applies uniformly to weekday overtime, weekend work, and public holiday work. There is no higher rate for weekends or holidays — all overtime is at the same 150%." },
    { question: "How do I calculate my hourly rate in Saudi Arabia?", answer: "Your hourly rate is calculated as: Monthly Basic Salary ÷ 30 days ÷ Daily Working Hours. For example, with SAR 6,000 salary and 8-hour days: SAR 6,000 ÷ 30 ÷ 8 = SAR 25 per hour. During Ramadan (6-hour days for Muslim employees): SAR 6,000 ÷ 30 ÷ 6 = SAR 33.33 per hour." },
    { question: "What are the normal working hours in Saudi Arabia?", answer: "Under Article 98: Normal working hours are 8 hours per day or 48 hours per week. During Ramadan, Muslim employees work reduced hours of 6 per day or 36 per week. Under Article 99, certain industries may have extended (9 hours) or reduced (7 hours) daily limits." },
    { question: "Is weekend work paid at a higher rate?", answer: "No. Under Saudi Labor Law, all work performed on weekends (rest days — typically Friday and Saturday) is classified as overtime and paid at the standard 150% rate. There is no 'double time' or higher weekend rate in Saudi law. However, all weekend hours are counted as overtime regardless of weekly totals." },
    { question: "Is public holiday work paid differently?", answer: "No. Work on official public holidays in Saudi Arabia is also paid at the standard 150% overtime rate — the same as weekday and weekend overtime. All hours on a public holiday are overtime. Saudi public holidays include Eid Al-Fitr, Eid Al-Adha, Saudi National Day (September 23), and Founding Day (February 22)." },
    { question: "What changes during Ramadan?", answer: "During Ramadan, Muslim employees work a maximum of 6 hours per day or 36 hours per week (Article 98). This means: (1) The hourly rate increases since the same monthly salary is divided by fewer hours, (2) The overtime rate also increases proportionally, (3) Any work beyond 6 hours/day is overtime. Non-Muslim employees typically maintain the standard 8-hour schedule." },
    { question: "What is the maximum overtime allowed?", answer: "Employees cannot work more than 720 overtime hours per year without their written consent. Additionally, the total daily hours (regular + overtime) should not exceed 12 hours (Article 101). Workers must get a 30-minute break after every 5 continuous hours of work." },
    { question: "Can my employer force me to work overtime?", answer: "In general, overtime requires the employee's consent. However, Article 106 provides exceptions where employers may require overtime: during annual inventory (max 30 days/year), budget preparation, liquidation/closing accounts, and emergencies or hazardous situations. In these cases, overtime is mandatory but still paid at 150%." },
    { question: "Can I take compensatory leave instead of overtime pay?", answer: "Yes. As of the 2025 Saudi Labor Law updates, employers and employees may agree to compensate overtime with paid leave instead of monetary payment. This requires the employee's consent — the employer cannot unilaterally substitute leave for overtime pay. Each overtime hour equals 1.5 hours of compensatory leave." },
    { question: "Is overtime included in GOSI calculations?", answer: "No. Overtime pay is NOT included in the GOSI (social insurance) contribution base. GOSI is calculated only on basic salary + housing allowance. Similarly, overtime pay is NOT included in the End of Service Benefit (EOSB) calculation. Use our GOSI Calculator and EOSB Calculator for those specific calculations." },
    { question: "Is overtime included in EOSB calculations?", answer: "No. The End of Service Benefit is calculated based on the 'actual wage' which is defined as basic salary plus housing allowance and fixed allowances. Overtime pay, being variable and not fixed, is excluded from the EOSB calculation. Use our End of Service Benefit Calculator for accurate EOSB estimates." },
    { question: "What are Saudi Arabia's public holidays?", answer: "Official public holidays in Saudi Arabia include: Eid Al-Fitr (approximately 4 days after Ramadan), Eid Al-Adha (approximately 4 days), Saudi National Day — September 23, and Founding Day — February 22. If a holiday falls on a rest day, the next working day is the compensatory holiday." },
    { question: "What are night shift rules in Saudi Arabia?", answer: "Night work is defined as work between 11 PM and 6 AM. Key rules: (1) Mandatory shift rotation every 3 months (night to day), unless employee consents to continue, (2) 12-hour minimum rest between shifts, (3) Employer must provide health services and transportation for night workers, (4) Pregnant women (24+ weeks), elderly, and medically unfit employees are exempt from night shifts." },
    { question: "What happens if my employer doesn't pay overtime?", answer: "Unpaid overtime is a violation of Saudi Labor Law. Employees can: (1) File a complaint with the Ministry of Human Resources and Social Development (MHRSD), (2) Report through the Labor Office's online portal or call center (19911), (3) Submit a claim through the Labor Courts for unpaid wages. The WPS (Wage Protection System) may also flag discrepancies." },
    { question: "Do part-time workers get overtime?", answer: "Yes. Part-time, temporary, and seasonal workers are subject to the same overtime provisions as full-time employees. Any work beyond their agreed daily or weekly hours is overtime and must be compensated at 150%. The overtime rate is calculated based on their agreed hourly or monthly rate." },
];

export default function OvertimePage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Overtime Calculator" },
        ]),
        webAppSchema("Overtime Calculator (KSA)", canonicalUrl("/ksa/overtime-calculator")),
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
            <Script id="schema-overtime" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Overtime Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Overtime Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your overtime pay under Saudi Labor Law Article 107. 150% rate for weekdays, weekends, and holidays. Supports normal and Ramadan working hours.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="overtime" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Overtime FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net take-home salary</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">Overtime excluded from GOSI</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">Overtime excluded from EOSB</div>
                        </div>
                    </Link>
                    <Link href="/ksa/annual-leave-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏖️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Annual Leave Calculator</div>
                            <div className="ksa-related-link__desc">Leave entitlement and pay</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-overtime">What Is Overtime in Saudi Arabia?</h2>
    <p><strong>Overtime (العمل الإضافي)</strong> in Saudi Arabia refers to any work performed beyond the legally mandated working hours as defined by the Saudi Labor Law. Under <strong>Article 107</strong>, all overtime — whether on weekdays, weekends, or holidays — is compensated at a uniform rate of <strong>150%</strong> (one and a half times) the employee's regular hourly wage.</p>
    <p>This means Saudi Arabia uses a single overtime multiplier for all scenarios, making the calculation straightforward compared to countries with tiered rates.</p>

    <h2 id="article-107">Article 107 — The 150% Rule</h2>
    <p><strong>Saudi Labor Law Article 107</strong> establishes the overtime framework:</p>
    <div class="explanation__highlight">
        <strong>Article 107:</strong> "The employer shall pay the worker for overtime working hours an additional amount equal to the hourly wage plus 50% of his basic wage."<br/><br/>
        <strong>Overtime Rate = Regular Hourly Wage × 1.5</strong><br/>
        This applies to: Weekday overtime, weekend work, public holidays — all at the same 150% rate.
    </div>

    <h2 id="how-to-calculate">How to Calculate Overtime Pay</h2>
    <h3>Step 1: Calculate Your Hourly Rate</h3>
    <div class="explanation__highlight">
        <strong>Hourly Rate = Monthly Basic Salary ÷ 30 ÷ Daily Working Hours</strong><br/>
        <strong>Normal:</strong> Salary ÷ 30 ÷ 8<br/>
        <strong>Ramadan (Muslim):</strong> Salary ÷ 30 ÷ 6
    </div>

    <h3>Step 2: Calculate Your Overtime Rate</h3>
    <div class="explanation__highlight">
        <strong>Overtime Rate = Hourly Rate × 1.5</strong>
    </div>

    <h3>Step 3: Calculate Total Overtime Pay</h3>
    <div class="explanation__highlight">
        <strong>Overtime Pay = Overtime Rate × Number of Overtime Hours</strong><br/>
        <strong>Total Pay = Basic Salary + Overtime Pay</strong>
    </div>

    <h2 id="working-hours">Working Hours in Saudi Arabia</h2>
    <table>
        <thead><tr><th>Article</th><th>Condition</th><th>Daily Hours</th><th>Weekly Hours</th></tr></thead>
        <tbody>
            <tr><td><strong>Art 98</strong></td><td>Normal (all employees)</td><td>8 hours</td><td>48 hours</td></tr>
            <tr><td><strong>Art 98</strong></td><td>Ramadan (Muslim employees)</td><td>6 hours</td><td>36 hours</td></tr>
            <tr><td><strong>Art 99</strong></td><td>Non-continuous work industries</td><td>9 hours</td><td>—</td></tr>
            <tr><td><strong>Art 99</strong></td><td>Hazardous/physically demanding</td><td>7 hours</td><td>—</td></tr>
            <tr><td><strong>Art 101</strong></td><td>Maximum at workplace (incl. OT)</td><td>12 hours</td><td>—</td></tr>
        </tbody>
    </table>

    <h2 id="ramadan">Ramadan Working Hours</h2>
    <p>During the holy month of <strong>Ramadan</strong>, Article 98 reduces the maximum working hours for Muslim employees to <strong>6 hours per day</strong> or <strong>36 hours per week</strong>. This has two important effects on overtime:</p>
    <ol>
        <li>The <strong>hourly rate increases</strong> because the same monthly salary is divided by fewer hours (÷6 instead of ÷8)</li>
        <li>The <strong>overtime threshold decreases</strong> — any work beyond 6 hours/day is overtime</li>
    </ol>
    <table>
        <thead><tr><th>Monthly Salary</th><th>Normal Hourly (÷8)</th><th>Normal OT Rate</th><th>Ramadan Hourly (÷6)</th><th>Ramadan OT Rate</th></tr></thead>
        <tbody>
            <tr><td>SAR 3,000</td><td>SAR 12.50</td><td>SAR 18.75</td><td>SAR 16.67</td><td>SAR 25.00</td></tr>
            <tr><td>SAR 6,000</td><td>SAR 25.00</td><td>SAR 37.50</td><td>SAR 33.33</td><td>SAR 50.00</td></tr>
            <tr><td>SAR 10,000</td><td>SAR 41.67</td><td>SAR 62.50</td><td>SAR 55.56</td><td>SAR 83.33</td></tr>
            <tr><td>SAR 15,000</td><td>SAR 62.50</td><td>SAR 93.75</td><td>SAR 83.33</td><td>SAR 125.00</td></tr>
        </tbody>
    </table>
    <p><strong>Note:</strong> Non-Muslim employees typically maintain the standard 8-hour schedule during Ramadan, so their overtime rate remains unchanged.</p>

    <h2 id="weekend-holiday">Weekend & Holiday Overtime</h2>
    <p>In Saudi Arabia, the official weekend is <strong>Friday and Saturday</strong>. All work performed on rest days or official public holidays is classified as overtime:</p>
    <ul>
        <li><strong>All hours</strong> worked on weekends are overtime (not just hours beyond 8)</li>
        <li><strong>All hours</strong> worked on holidays are overtime</li>
        <li>Rate remains <strong>150%</strong> — same as weekday overtime</li>
    </ul>

    <h3>Saudi Public Holidays</h3>
    <table>
        <thead><tr><th>Holiday</th><th>Duration</th><th>Date</th></tr></thead>
        <tbody>
            <tr><td><strong>Eid Al-Fitr</strong></td><td>~4 days</td><td>After Ramadan (Hijri calendar)</td></tr>
            <tr><td><strong>Eid Al-Adha</strong></td><td>~4 days</td><td>10th Dhul Hijjah (Hijri calendar)</td></tr>
            <tr><td><strong>Saudi National Day</strong></td><td>1 day</td><td>September 23</td></tr>
            <tr><td><strong>Founding Day</strong></td><td>1 day</td><td>February 22</td></tr>
        </tbody>
    </table>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: Normal Weekday Overtime</h3>
    <p>Employee earning <strong>SAR 6,000/month</strong>, works <strong>10 extra hours</strong> on weekdays:</p>
    <ol>
        <li>Hourly Rate: SAR 6,000 ÷ 30 ÷ 8 = <strong>SAR 25.00</strong></li>
        <li>OT Rate: SAR 25.00 × 1.5 = <strong>SAR 37.50</strong></li>
        <li>OT Pay: SAR 37.50 × 10 = <strong>SAR 375.00</strong></li>
        <li>Total: SAR 6,000 + SAR 375 = <strong>SAR 6,375</strong></li>
    </ol>

    <h3>Example 2: Ramadan Overtime</h3>
    <p>Muslim employee earning <strong>SAR 6,000/month</strong>, works <strong>10 extra hours</strong> during Ramadan:</p>
    <ol>
        <li>Hourly Rate (Ramadan): SAR 6,000 ÷ 30 ÷ 6 = <strong>SAR 33.33</strong></li>
        <li>OT Rate: SAR 33.33 × 1.5 = <strong>SAR 50.00</strong></li>
        <li>OT Pay: SAR 50.00 × 10 = <strong>SAR 500.00</strong></li>
        <li>Total: SAR 6,000 + SAR 500 = <strong>SAR 6,500</strong></li>
    </ol>
    <p><em>Note: The same employee earns <strong>SAR 125 more</strong> for the same 10 OT hours during Ramadan vs normal months.</em></p>

    <h3>Example 3: Full Weekend Shift</h3>
    <p>Employee earning <strong>SAR 8,000/month</strong>, works a full <strong>8-hour shift on Friday</strong>:</p>
    <ol>
        <li>Hourly Rate: SAR 8,000 ÷ 30 ÷ 8 = <strong>SAR 33.33</strong></li>
        <li>OT Rate: SAR 33.33 × 1.5 = <strong>SAR 50.00</strong></li>
        <li>OT Pay: SAR 50.00 × 8 = <strong>SAR 400.00</strong></li>
    </ol>

    <h2 id="night-shift">Night Shift Rules</h2>
    <p>Night work in Saudi Arabia is defined as work between <strong>11 PM and 6 AM</strong>. Special rules apply:</p>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Shift rotation</strong></td><td>Every 3 months — night workers must rotate to day shifts</td></tr>
            <tr><td><strong>Rest period</strong></td><td>Minimum 12 hours between end of one shift and start of next</td></tr>
            <tr><td><strong>Health services</strong></td><td>Employer must provide medical checkups for night workers</td></tr>
            <tr><td><strong>Transportation</strong></td><td>Employer must provide transport for night shift employees</td></tr>
            <tr><td><strong>Exemptions</strong></td><td>Pregnant women (24+ weeks), elderly, medically unfit</td></tr>
        </tbody>
    </table>

    <h2 id="maximum-limits">Maximum Overtime Limits</h2>
    <table>
        <thead><tr><th>Limit</th><th>Amount</th><th>Source</th></tr></thead>
        <tbody>
            <tr><td><strong>Daily maximum</strong> (incl. OT)</td><td>12 hours total</td><td>Article 101</td></tr>
            <tr><td><strong>Annual maximum</strong></td><td>720 hours (without consent)</td><td>Custom/Practice</td></tr>
            <tr><td><strong>Continuous work</strong></td><td>Max 5 hours without 30-min break</td><td>Article 101</td></tr>
            <tr><td><strong>Rest day</strong></td><td>At least 1 day/week (24 consecutive hours)</td><td>Article 104</td></tr>
        </tbody>
    </table>

    <h2 id="compensatory-leave">Compensatory Leave (2025 Update)</h2>
    <p>The 2025 amendments to Saudi Labor Law allow employers and employees to agree on <strong>compensatory paid leave</strong> instead of monetary overtime payment. Key points:</p>
    <ul>
        <li>Requires <strong>employee consent</strong> — cannot be imposed unilaterally</li>
        <li>Each overtime hour = <strong>1.5 hours of paid leave</strong></li>
        <li>Leave must be taken within a reasonable period</li>
        <li>If leave is not granted, monetary compensation reverts</li>
    </ul>

    <h2 id="overtime-not-in-gosi">Overtime Is NOT in GOSI or EOSB</h2>
    <p>Important: Overtime pay is <strong>excluded</strong> from both major Saudi employment calculations:</p>
    <table>
        <thead><tr><th>Calculation</th><th>Includes Overtime?</th><th>Calculator</th></tr></thead>
        <tbody>
            <tr><td><strong>GOSI</strong> (social insurance)</td><td>❌ No — based on basic + housing only</td><td><a href="/ksa/gosi-calculator">GOSI Calculator</a></td></tr>
            <tr><td><strong>EOSB</strong> (end of service)</td><td>❌ No — based on actual wage (fixed components)</td><td><a href="/ksa/end-of-service-calculator">EOSB Calculator</a></td></tr>
            <tr><td><strong>Net Salary</strong></td><td>✅ Yes — overtime adds to gross pay</td><td><a href="/ksa/salary-calculator">Salary Calculator</a></td></tr>
        </tbody>
    </table>
`;

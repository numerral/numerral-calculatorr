// Standalone page — /ksa/iqama-renewal-calculator
// KSA Iqama Renewal Cost Calculator with educational content

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
    title: "Iqama Renewal Cost Calculator (KSA) — حاسبة تكلفة تجديد الإقامة",
    description: "Calculate total Iqama renewal cost in Saudi Arabia for 2025/2026. Includes base fee, work permit (Maktab Amal), dependent levy, Absher processing, health insurance, exit/re-entry visa, and late penalties.",
    keywords: ["Iqama renewal cost calculator", "حاسبة تكلفة تجديد الإقامة", "Iqama renewal fee Saudi Arabia 2025", "dependent levy SAR 400", "Maktab Amal fee", "Absher Iqama renewal", "work permit fee KSA", "exit re-entry visa Saudi", "Iqama late penalty", "Muqeem platform"],
    alternates: { canonical: canonicalUrl("/ksa/iqama-renewal-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much does Iqama renewal cost in Saudi Arabia?", answer: "The base Iqama renewal fee is SAR 650 per year for company/institution workers and SAR 600 per year for domestic workers. However, the total cost includes work permit fees (SAR 700–800/month paid by employer), dependent levy (SAR 400/month per dependent), Absher processing (SAR 51.75), health insurance (SAR 700–4,000+), and potentially exit/re-entry visa fees. A typical annual total for a company worker with one dependent ranges from SAR 12,000 to SAR 16,000+." },
    { question: "What is the dependent levy fee in Saudi Arabia?", answer: "The dependent levy is SAR 400 per month per dependent (SAR 4,800 per year). This applies to family members sponsored by expatriate workers, including spouses and children. New dependents receive a 90-day grace period before the fee applies. Payments can be made quarterly (SAR 1,200), semi-annually (SAR 2,400), or annually (SAR 4,800) via the Absher platform or SADAD." },
    { question: "What is the work permit (Maktab Amal) fee?", answer: "The work permit fee, also known as the expat levy or Maktab Amal fee, is paid by the employer. It's SAR 800/month (SAR 9,600/year) if expatriate employees exceed Saudi employees, or SAR 700/month (SAR 8,400/year) if the company meets its Saudization target. Domestic workers and industrial sector workers are exempt." },
    { question: "How do I renew my Iqama on Absher?", answer: "Steps: (1) Log into Absher Business at business.absher.sa, (2) Navigate to Passports → Renew Iqama, (3) Select the employee/dependent, (4) Choose renewal period (3, 6, 9, or 12 months), (5) Confirm valid health insurance is active, (6) Pay via SADAD, (7) Processing fee is SAR 51.75. The Iqama is updated digitally — no need to visit a passport office." },
    { question: "What is the penalty for late Iqama renewal?", answer: "Penalties escalate: SAR 500 for the first offense, SAR 1,000 for the second offense, and deportation for the third offense. There is typically a 3-day grace period after expiry before fines apply. Late renewal also causes suspension of government services (banking, Absher access, telecommunications), and employers face sanctions for failing to renew on time." },
    { question: "Can I renew my Iqama for less than 1 year?", answer: "Yes. Saudi Arabia offers flexible renewal periods: 3 months (SAR 163 for company workers), 6 months (SAR 325), 9 months (SAR 488), or 12 months (SAR 650). Pro-rata pricing makes shorter renewals cost-effective if you're planning to leave or switch employers. Note that work permit and dependent fees are also pro-rated." },
    { question: "Are domestic workers exempt from work permit fees?", answer: "Yes. Domestic workers (drivers, personal guards, housekeepers, cooks, etc.) are exempt from the work permit (Maktab Amal) fee. Their base Iqama renewal fee is also slightly lower at SAR 600/year vs SAR 650 for company workers. Industrial sector workers are also exempt from the levy." },
    { question: "How much is the exit/re-entry visa?", answer: "Single exit/re-entry: SAR 200 base for up to 2 months, plus SAR 100 for each additional month. Multiple exit/re-entry: SAR 500 base for up to 3 months, plus SAR 200 for each additional month. Example: a 6-month single visa costs SAR 600, while a 6-month multiple visa costs SAR 1,100. The employer is responsible for paying these fees under Saudi Labor Law." },
    { question: "Is health insurance required for Iqama renewal?", answer: "Yes. Valid health insurance is mandatory for Iqama issuance and renewal. The employer must provide health insurance coverage. Costs vary from SAR 700/year for basic coverage to SAR 4,000+ for comprehensive family plans. Without active insurance, the Iqama renewal application will be rejected." },
    { question: "What is the Muqeem platform?", answer: "Muqeem is an online platform operated by the General Directorate of Passports (Jawazat) that provides e-services for establishments. It allows companies to manage Iqama renewals, issue/extend/cancel exit/re-entry visas, process final exits, view employee data, and receive proactive notifications about expiring documents. It works alongside Absher Business." },
    { question: "Who pays for Iqama renewal — employer or employee?", answer: "Under Saudi Labor Law, the employer is responsible for most Iqama-related costs: the base renewal fee, work permit fee, health insurance, and exit/re-entry visa fees. The dependent levy (SAR 400/month per dependent) is typically the employee's responsibility. However, some employers include dependent fees as part of the compensation package — check your employment contract." },
    { question: "What is the grace period for new dependents?", answer: "Newly arrived dependents in Saudi Arabia receive a 90-day grace period from their arrival date. During this period, no dependent levy fee (SAR 400/month) is charged. The fee begins from day 91 onwards. This gives expats time to settle their family before the additional costs begin." },
    { question: "How does Saudization affect Iqama costs?", answer: "Saudization (Nitaqat) directly impacts work permit costs. Companies that meet their Saudi employment targets pay SAR 700/month per expat worker, while companies where expatriates exceed Saudi employees pay SAR 800/month — a difference of SAR 1,200/year per worker. Companies in the red or yellow zones may face additional restrictions on Iqama renewals." },
    { question: "Can I check my Iqama status online?", answer: "Yes. You can check Iqama status via: (1) Absher app → Passport Affairs → Iqama Inquiry, (2) Muqeem platform (for employers), (3) MOI website status query. You'll need your Iqama number or border number. The system shows expiry date, renewal status, any violations, and linked dependents." },
    { question: "What documents are needed for Iqama renewal?", answer: "Required documents: (1) Valid passport with at least 6 months validity, (2) Active health insurance policy, (3) No outstanding traffic violations or fines, (4) Updated profession matching work permit, (5) Employer must have no Nitaqat violations, (6) All fees paid via SADAD. For domestic workers, the sponsor must also be in compliance with immigration regulations." },
];

export default function IqamaRenewalPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Iqama Renewal Cost Calculator" },
        ]),
        webAppSchema("Iqama Renewal Cost Calculator (KSA)", canonicalUrl("/ksa/iqama-renewal-calculator")),
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
            <Script id="schema-iqama" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Iqama Renewal Cost Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Iqama Renewal Cost Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the total cost of renewing your Iqama (residence permit) in Saudi Arabia for 2025/2026.
                Get a detailed breakdown of all fees: Iqama renewal, work permit, dependent levy, Absher processing,
                health insurance, exit/re-entry visa, and late penalties.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="iqama" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Iqama Renewal Cost FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Know your take-home after Iqama costs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">GOSI deduction from your salary</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">End of Service Calculator</div>
                            <div className="ksa-related-link__desc">EOSB when you receive final exit</div>
                        </div>
                    </Link>
                    <Link href="/ksa/savings-goal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏦</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Savings Goal Calculator</div>
                            <div className="ksa-related-link__desc">Save for Iqama &amp; dependent fees</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-iqama">What Is an Iqama (إقامة)?</h2>
    <p>An <strong>Iqama (إقامة)</strong> — also spelled Iqamah — is the <strong>residence permit</strong> issued by the Kingdom of Saudi Arabia's General Directorate of Passports (<strong>Jawazat</strong>) to all foreign nationals living and working in the country. It serves as your primary legal identification document and is mandatory for virtually every aspect of life in KSA.</p>
    <p>Without a valid Iqama, you cannot:</p>
    <ul>
        <li><strong>Open or maintain bank accounts</strong> (all Saudi banks require valid Iqama)</li>
        <li><strong>Sign rental contracts</strong> on the Ejar platform</li>
        <li><strong>Access medical services</strong> under your health insurance</li>
        <li><strong>Register SIM cards</strong> or telecommunications services</li>
        <li><strong>Enroll children in schools</strong></li>
        <li><strong>Drive legally</strong> — your Saudi driving license is tied to your Iqama</li>
        <li><strong>Travel within the Kingdom</strong> at checkpoints</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Critical:</strong> An expired Iqama can result in fines starting at <strong>SAR 500</strong>, escalating to <strong>SAR 1,000</strong> and ultimately <strong>deportation</strong>. Always renew on time — ideally 30 days before expiry. Use this calculator to budget for all renewal costs.
    </div>

    <h2 id="fee-breakdown">Complete Iqama Renewal Fee Breakdown (2025/2026)</h2>
    <p>Iqama renewal involves <strong>multiple fee components</strong>. Understanding each one helps you budget accurately and avoid surprises:</p>

    <h3>1. Base Iqama Renewal Fee</h3>
    <table>
        <thead><tr><th>Worker Category</th><th>3 Months</th><th>6 Months</th><th>9 Months</th><th>12 Months</th></tr></thead>
        <tbody>
            <tr><td><strong>Company / Institution</strong></td><td>SAR 163</td><td>SAR 325</td><td>SAR 488</td><td>SAR 650</td></tr>
            <tr><td><strong>Domestic Worker</strong></td><td>SAR 150</td><td>SAR 300</td><td>SAR 450</td><td>SAR 600</td></tr>
        </tbody>
    </table>
    <p><strong>Flexible renewal:</strong> Since 2023, Saudi Arabia allows renewal for <strong>3, 6, 9, or 12 months</strong> — pro-rated accordingly. This is useful if you're planning to leave the Kingdom or switch employers mid-year.</p>

    <h3>2. Work Permit Fee (Maktab Amal / رسوم رخصة العمل)</h3>
    <p>The work permit fee — commonly called the <strong>expat levy</strong> or <strong>Maktab Amal fee</strong> — is the largest cost component and is <strong>paid by the employer</strong>:</p>
    <table>
        <thead><tr><th>Saudization Status</th><th>Monthly</th><th>Annual</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Expats exceed Saudis</strong></td><td>SAR 800</td><td>SAR 9,600</td><td>Most private-sector companies</td></tr>
            <tr><td><strong>Target met</strong></td><td>SAR 700</td><td>SAR 8,400</td><td>Companies in green/platinum zones</td></tr>
            <tr><td><strong>Domestic workers</strong></td><td>Exempt</td><td>—</td><td>Includes drivers, guards, housekeepers</td></tr>
            <tr><td><strong>Industrial workers</strong></td><td>Exempt</td><td>—</td><td>Manufacturing sector exemption</td></tr>
        </tbody>
    </table>
    <p>While this fee is the employer's responsibility, it <strong>directly affects your employment viability</strong> — companies with high expat costs may be less willing to sponsor additional workers. Use our <a href="/ksa/salary-calculator">Salary Calculator</a> to understand how your total compensation package relates to your employer's costs.</p>

    <h3>3. Dependent Levy (رسوم المرافقين)</h3>
    <p>If you sponsor family members in Saudi Arabia, the <strong>dependent levy</strong> is a significant ongoing cost:</p>
    <table>
        <thead><tr><th>Number of Dependents</th><th>Monthly</th><th>Quarterly</th><th>Semi-Annual</th><th>Annual</th></tr></thead>
        <tbody>
            <tr><td><strong>1 dependent</strong></td><td>SAR 400</td><td>SAR 1,200</td><td>SAR 2,400</td><td>SAR 4,800</td></tr>
            <tr><td><strong>2 dependents</strong></td><td>SAR 800</td><td>SAR 2,400</td><td>SAR 4,800</td><td>SAR 9,600</td></tr>
            <tr><td><strong>3 dependents</strong></td><td>SAR 1,200</td><td>SAR 3,600</td><td>SAR 7,200</td><td>SAR 14,400</td></tr>
            <tr><td><strong>4 dependents</strong></td><td>SAR 1,600</td><td>SAR 4,800</td><td>SAR 9,600</td><td>SAR 19,200</td></tr>
            <tr><td><strong>5 dependents</strong></td><td>SAR 2,000</td><td>SAR 6,000</td><td>SAR 12,000</td><td>SAR 24,000</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>90-Day Grace Period:</strong> Newly arrived dependents receive a <strong>90-day exemption</strong> from the levy. The SAR 400/month fee begins from day 91. This gives families time to settle before the cost kicks in.
    </div>
    <p>For families with 3+ dependents, the annual levy exceeds <strong>SAR 14,400</strong> — a significant budget item. Use our <a href="/ksa/savings-goal-calculator">Savings Goal Calculator</a> to plan for these recurring costs.</p>

    <h3>4. Absher Business Processing Fee</h3>
    <p>As of <strong>January 1, 2025</strong>, the Ministry of Interior's Absher Business platform charges service fees for specific transactions:</p>
    <table>
        <thead><tr><th>Service</th><th>Fee (SAR)</th></tr></thead>
        <tbody>
            <tr><td><strong>Iqama Renewal</strong></td><td>51.75</td></tr>
            <tr><td><strong>New Iqama Issuance</strong></td><td>51.75</td></tr>
            <tr><td><strong>Exit/Re-entry Visa Extension</strong></td><td>103.50</td></tr>
            <tr><td><strong>Final Exit</strong></td><td>70.00</td></tr>
            <tr><td><strong>Employee Report</strong></td><td>28.75</td></tr>
            <tr><td><strong>Passport Info Update</strong></td><td>69.00</td></tr>
        </tbody>
    </table>

    <h3>5. Health Insurance (Mandatory)</h3>
    <p>Valid health insurance is a <strong>prerequisite for Iqama issuance and renewal</strong>. The cost is borne by the employer but directly impacts total sponsorship costs:</p>
    <table>
        <thead><tr><th>Coverage Level</th><th>Annual Cost (SAR)</th><th>Includes</th></tr></thead>
        <tbody>
            <tr><td><strong>Basic</strong></td><td>600–800</td><td>Essential medical, limited coverage</td></tr>
            <tr><td><strong>Standard</strong></td><td>800–1,500</td><td>Outpatient, inpatient, pharmacy</td></tr>
            <tr><td><strong>Enhanced</strong></td><td>1,500–3,000</td><td>Dental, optical, specialist access</td></tr>
            <tr><td><strong>Family Comprehensive</strong></td><td>2,000–4,000+</td><td>Full family coverage including maternity</td></tr>
        </tbody>
    </table>

    <h2 id="absher-guide">How to Renew Iqama via Absher Business</h2>
    <p>Iqama renewal is processed electronically through the <strong>Absher Business</strong> platform. Here's the step-by-step process:</p>
    <ol>
        <li><strong>Log in</strong> to Absher Business at <strong>business.absher.sa</strong></li>
        <li>Navigate to <strong>Passport Affairs → Renew Iqama</strong></li>
        <li><strong>Select the employee</strong> whose Iqama needs renewal</li>
        <li>Choose the <strong>renewal period</strong> (3, 6, 9, or 12 months)</li>
        <li>System checks: <strong>valid health insurance</strong>, no outstanding violations</li>
        <li><strong>Review the total fee</strong> and confirm</li>
        <li><strong>Pay via SADAD</strong> (biller code assigned to your establishment)</li>
        <li><strong>Confirmation</strong> — the Iqama is updated digitally, no physical card needed</li>
    </ol>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> Set a reminder <strong>30 days before expiry</strong>. The Muqeem platform sends proactive notifications to employers about expiring Iqamas, but don't rely on it — create your own calendar alerts.
    </div>

    <h2 id="muqeem">Muqeem Platform — For Employers and HR</h2>
    <p>The <strong>Muqeem platform (مقيم)</strong> is operated by the General Directorate of Passports and provides essential e-services for establishments:</p>
    <ul>
        <li><strong>Iqama Management</strong> — issue, renew, and track residence permits</li>
        <li><strong>Visa Services</strong> — issue, extend, or cancel exit/re-entry visas (single/multiple)</li>
        <li><strong>Final Exit Processing</strong> — handle permanent departures</li>
        <li><strong>Employee Data</strong> — view all resident employee information</li>
        <li><strong>Proactive Alerts</strong> — notifications about expiring Iqamas and visas</li>
        <li><strong>Digital Processing</strong> — eliminate need to visit passport offices</li>
    </ul>
    <p>Muqeem integrates with <strong>Absher</strong>, <strong>Qiwa</strong> (Ministry of Human Resources), and <strong>GOSI</strong> systems. For GOSI contribution details, use our <a href="/ksa/gosi-calculator">GOSI Calculator</a>.</p>

    <h2 id="exit-reentry">Exit/Re-entry Visa Fees</h2>
    <p>Expatriate residents need an <strong>exit/re-entry visa</strong> to leave Saudi Arabia and return. The <strong>employer is responsible</strong> for these fees under Saudi Labor Law:</p>
    <table>
        <thead><tr><th>Type</th><th>Base Fee</th><th>Base Duration</th><th>Additional Per Month</th><th>Example: 6 Months</th></tr></thead>
        <tbody>
            <tr><td><strong>Single</strong></td><td>SAR 200</td><td>Up to 2 months</td><td>+SAR 100/month</td><td>SAR 600</td></tr>
            <tr><td><strong>Multiple</strong></td><td>SAR 500</td><td>Up to 3 months</td><td>+SAR 200/month</td><td>SAR 1,100</td></tr>
        </tbody>
    </table>
    <p><strong>Important:</strong> If you need to <strong>extend your visa while outside KSA</strong>, the fees for additional months are <strong>doubled</strong>. Fees for canceled visas are <strong>non-refundable</strong>. Always plan your travel within the original visa validity.</p>

    <h2 id="penalties">Late Renewal Penalties — How to Avoid Fines</h2>
    <p>Saudi Arabia imposes <strong>escalating penalties</strong> for late Iqama renewal:</p>
    <table>
        <thead><tr><th>Offense</th><th>Fine</th><th>Additional Consequences</th></tr></thead>
        <tbody>
            <tr><td><strong>1st delay</strong></td><td>SAR 500</td><td>Suspension of government services</td></tr>
            <tr><td><strong>2nd delay</strong></td><td>SAR 1,000</td><td>Banking and Absher access blocked</td></tr>
            <tr><td><strong>3rd delay</strong></td><td>Deportation</td><td>Possible permanent re-entry ban</td></tr>
        </tbody>
    </table>
    <p>A <strong>3-day grace period</strong> is typically provided after the Iqama's expiry date before fines are imposed. Penalties for <strong>being without a valid Iqama</strong> (beyond late renewal) are more severe: SAR 1,000 first offense, SAR 2,000 second, SAR 3,000 + deportation for third.</p>
    <h3>How to Avoid Penalties</h3>
    <ol>
        <li><strong>Set calendar reminders</strong> — 60, 30, and 7 days before expiry</li>
        <li><strong>Ensure insurance is active</strong> — expired insurance blocks renewal</li>
        <li><strong>Clear all fines</strong> — traffic violations and other fees must be paid first</li>
        <li><strong>Verify employer compliance</strong> — Nitaqat violations can block renewal</li>
        <li><strong>Keep passport valid</strong> — minimum 6 months remaining</li>
    </ol>

    <h2 id="budget-impact">How Iqama Costs Affect Your Budget</h2>
    <p>Understanding the total annual cost of maintaining your Iqama is crucial for financial planning. Here are realistic scenarios:</p>

    <h3>Scenario 1: Single Expat Worker (Company)</h3>
    <table>
        <thead><tr><th>Component</th><th>Annual Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>Iqama Renewal</td><td>650</td></tr>
            <tr><td>Absher Processing</td><td>51.75</td></tr>
            <tr><td>Work Permit (employer)</td><td>9,600</td></tr>
            <tr><td>Health Insurance (standard)</td><td>1,200</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 11,502</strong></td></tr>
        </tbody>
    </table>

    <h3>Scenario 2: Family with 2 Dependents</h3>
    <table>
        <thead><tr><th>Component</th><th>Annual Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>Iqama Renewal</td><td>650</td></tr>
            <tr><td>Absher Processing</td><td>51.75</td></tr>
            <tr><td>Work Permit (employer)</td><td>9,600</td></tr>
            <tr><td>Dependent Levy (2 × SAR 4,800)</td><td>9,600</td></tr>
            <tr><td>Health Insurance (family)</td><td>4,000</td></tr>
            <tr><td>Single Exit/Re-entry (6 months)</td><td>600</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>SAR 24,502</strong></td></tr>
            <tr><td><strong>Monthly Average</strong></td><td><strong>SAR 2,042/month</strong></td></tr>
        </tbody>
    </table>
    <p>That's <strong>SAR 2,042/month</strong> just for immigration compliance. For a family earning SAR 15,000/month, this represents <strong>13.6% of gross income</strong>. Factor this into your <a href="/ksa/rent-affordability-calculator">rent budget</a> and overall financial planning.</p>

    <h3>Scenario 3: Domestic Worker (Driver)</h3>
    <table>
        <thead><tr><th>Component</th><th>Annual Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>Iqama Renewal</td><td>600</td></tr>
            <tr><td>Absher Processing</td><td>51.75</td></tr>
            <tr><td>Work Permit</td><td>Exempt</td></tr>
            <tr><td>Health Insurance (basic)</td><td>700</td></tr>
            <tr><td><strong>Total (Sponsor Cost)</strong></td><td><strong>SAR 1,352</strong></td></tr>
        </tbody>
    </table>

    <h2 id="documents">Documents Required for Iqama Renewal</h2>
    <p>Before initiating the renewal process, ensure all documents are ready:</p>
    <ol>
        <li><strong>Valid passport</strong> — minimum 6 months remaining validity</li>
        <li><strong>Active health insurance policy</strong> — must be current at time of renewal</li>
        <li><strong>No outstanding violations</strong> — traffic fines, overstay penalties cleared</li>
        <li><strong>Profession match</strong> — Iqama profession must match work permit</li>
        <li><strong>Employer compliance</strong> — no Nitaqat (Saudization) violations</li>
        <li><strong>Fees paid</strong> — all components paid via SADAD</li>
        <li><strong>Updated photo</strong> — if Iqama card is required (digital Iqama increasingly common)</li>
    </ol>
    <p>When leaving a job and receiving your <strong>final exit</strong>, you're entitled to your <a href="/ksa/end-of-service-calculator">End of Service Benefit (EOSB)</a>. Calculate it in advance to plan your exit finances.</p>

    <h2 id="saudization-impact">How Saudization (Nitaqat) Affects Iqama Costs</h2>
    <p>The <strong>Nitaqat (نطاقات)</strong> system categorizes companies by their Saudization levels, directly affecting work permit costs and Iqama renewal eligibility:</p>
    <table>
        <thead><tr><th>Nitaqat Band</th><th>Impact on Work Permit</th><th>Iqama Renewal Status</th></tr></thead>
        <tbody>
            <tr><td><strong>Platinum / Green</strong></td><td>SAR 700/month per expat</td><td>Unrestricted renewal</td></tr>
            <tr><td><strong>Yellow</strong></td><td>SAR 800/month per expat</td><td>Restricted — limited renewals</td></tr>
            <tr><td><strong>Red</strong></td><td>SAR 800/month per expat</td><td>Blocked — cannot renew or transfer</td></tr>
        </tbody>
    </table>
    <p>If your employer falls into the <strong>red zone</strong>, your Iqama renewal can be blocked entirely. This is a critical risk for expatriate workers — always ask about your employer's Nitaqat status during job negotiations.</p>

    <h2 id="tips">10 Tips to Reduce Iqama Renewal Costs</h2>
    <ol>
        <li><strong>Renew on time</strong> — avoid SAR 500–1,000 in late penalties</li>
        <li><strong>Negotiate employer coverage</strong> — ask for dependent levy inclusion in your package</li>
        <li><strong>Use multiple exit/re-entry visas</strong> — more cost-effective for frequent travelers</li>
        <li><strong>Choose short-term renewal</strong> if planning to leave — don't pay for 12 months if you'll exit in 6</li>
        <li><strong>Optimize insurance level</strong> — basic coverage may suffice for young, healthy workers</li>
        <li><strong>Check Saudization status</strong> — green/platinum companies save SAR 1,200/year on work permit</li>
        <li><strong>Plan dependent arrivals</strong> — utilize the 90-day grace period</li>
        <li><strong>Use overtime income</strong> — our <a href="/ksa/overtime-calculator">Overtime Calculator</a> shows how extra hours can cover Iqama costs</li>
        <li><strong>Budget monthly</strong> — set aside SAR 400/dependent/month in advance</li>
        <li><strong>Track via apps</strong> — use Absher and Muqeem mobile apps for real-time status</li>
    </ol>
`;

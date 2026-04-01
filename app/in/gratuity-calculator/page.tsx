import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import GratuityCalculatorCore from "@/components/calculator/GratuityCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Gratuity Calculator India 2026 — Payment of Gratuity Act 1972 | 15/26 Formula, Tax Exemption Sec 10(10), ₹20 Lakh Limit",
    description: "Free Gratuity Calculator with 4 modes: Gratuity Calculator (covered ÷26 vs not-covered ÷30 formula, year rounding, Basic+DA), Tax Exemption Calculator (Section 10(10) — govt 100% exempt, private least-of-3 rule, ₹20 lakh lifetime limit), Employer Liability Estimator (AS-15/Ind AS-19, monthly provisioning), and Eligibility Guide (5-year rule, 240-day rule, forfeiture Sec 4(6), death/disability waiver, nomination Form F).",
    keywords: ["gratuity calculator", "gratuity calculator India", "Payment of Gratuity Act 1972", "gratuity formula 15/26", "gratuity tax exemption", "Section 10(10)", "gratuity eligibility 5 years", "240 day rule gratuity", "gratuity on basic DA", "gratuity forfeiture", "employer gratuity liability", "gratuity ₹20 lakh limit"],
    alternates: buildCountryAlternates("IN", "/in/gratuity-calculator", "gratuity-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is gratuity?", answer: "Gratuity is a statutory terminal benefit paid by an employer to an employee as a token of appreciation for long-term service. It is governed by the Payment of Gratuity Act, 1972 and applies to factories, mines, oilfields, plantations, ports, railways, and shops/establishments with 10+ employees. Gratuity is payable on retirement, resignation, superannuation, death, or disablement after completing 5 years of continuous service (5-year rule waived for death/disability)." },
    { question: "How is gratuity calculated?", answer: "For employees covered under the Payment of Gratuity Act: Gratuity = (Last Drawn Salary × 15 × Years of Service) ÷ 26. For employees NOT covered: Gratuity = (Last Drawn Salary × 15 × Years of Service) ÷ 30. Last Drawn Salary = Basic + Dearness Allowance (DA). The divisor 26 represents working days in a month (excluding 4 Sundays). Service exceeding 6 months is rounded up to the next year." },
    { question: "What is the 15/26 formula in gratuity?", answer: "The 15/26 formula means: 15 days' wages for every completed year of service, calculated on the basis of 26 working days per month (30 calendar days minus 4 Sundays). So for an employee with ₹50,000 Basic+DA and 10 years of service: Gratuity = (₹50,000 × 15 × 10) ÷ 26 = ₹2,88,462. The ÷26 applies to establishments covered under the Act; non-covered use ÷30." },
    { question: "What is the minimum service required for gratuity?", answer: "The minimum continuous service required is 5 years with the same employer. However, this 5-year rule is waived in two cases: (1) Death — gratuity is payable to the nominee/legal heir regardless of service length. (2) Disability — if the employee becomes physically/mentally incapable due to accident or disease. The '4 years and 240 days' judicial interpretation: If you complete 240 days in the 5th year (6-day week) or 190 days (5-day week), you're deemed to have completed 5 years." },
    { question: "Is gratuity taxable?", answer: "Tax treatment under Section 10(10) of the Income Tax Act: Government employees — 100% tax-exempt with no limit. Private employees (covered under the Act) — exempt is the LEAST of: (a) Actual gratuity received, (b) ₹20 lakh (lifetime limit), (c) Formula amount (15/26 × Last Salary × Years). Private employees (not covered) — exempt is the LEAST of: (a) Actual gratuity, (b) ₹20 lakh, (c) Half-month's average salary (last 10 months) × years. Amount exceeding the exempt portion is taxable as 'Income from Salary'." },
    { question: "What is the maximum gratuity amount?", answer: "There is NO statutory cap on the gratuity amount itself — the formula determines the actual amount. The ₹20 lakh limit is only for TAX EXEMPTION under Section 10(10) for private sector employees. Government employees received a ceiling increase to ₹25 lakh for gratuity payment (7th CPC). So an employee could receive ₹30 lakh in gratuity — they'd pay tax on ₹10 lakh (excess over ₹20 lakh exemption)." },
    { question: "What is the 240-day rule for gratuity?", answer: "Under judicial interpretation of Section 2A, an employee who has worked for 4 years and completed 240 working days in the 5th year (for 6-day week establishments) is deemed to have completed 5 years of continuous service. For 5-day week establishments, the threshold is 190 days. This is significant for employees who resign during their 5th year — if they've crossed the 240/190-day mark, they qualify for gratuity." },
    { question: "Can gratuity be forfeited?", answer: "Yes, under Section 4(6), gratuity can be forfeited partially or fully in two cases: (1) Damage/Loss: If services are terminated for willful omission/negligence causing damage to employer's property — forfeiture limited to the extent of loss. (2) Misconduct: Riotous/disorderly conduct, acts of violence, or offences involving moral turpitude during employment — full/partial forfeiture. Due process is mandatory — show-cause notice and opportunity to be heard must be provided before forfeiture." },
    { question: "What is the difference between covered and not-covered establishments?", answer: "Covered under the Act: Factories, mines, oilfields, plantations, ports, railways, and shops/establishments with 10+ employees. Uses ÷26 divisor (26 working days/month). Not covered: Establishments with fewer than 10 employees or those specifically exempt. Uses ÷30 divisor (30 calendar days). The key differences: ÷26 formula gives a slightly higher gratuity than ÷30 for the same salary and years." },
    { question: "Is gratuity paid on Basic salary only?", answer: "Gratuity is calculated on the Last Drawn Salary which includes Basic Salary + Dearness Allowance (DA). It does NOT include: HRA (House Rent Allowance), Special Allowance, Conveyance Allowance, Medical Allowance, or any other allowances. For employees not covered under the Act, some courts have interpreted 'salary' to include all regular payments, but the standard practice is Basic + DA." },
    { question: "What happens to gratuity on death of the employee?", answer: "In case of death, the 5-year minimum service requirement is waived. Gratuity is payable to the nominee designated by the employee (Form F). If no nomination exists, it is paid to the legal heirs. The gratuity amount payable on death depends on years of service: Less than 1 year: 2× last drawn salary. 1-5 years: 6× last drawn salary. 5-11 years: 12× last drawn salary. 11-20 years: 20× last drawn salary. 20+ years: Half-month salary for every completed 6-month period (max 33×)." },
    { question: "Can an employee claim gratuity if they resign before 5 years?", answer: "No. Under the Payment of Gratuity Act, an employee who resigns before completing 5 years of continuous service is NOT entitled to gratuity. The only exceptions are: (1) Death — payable to nominee regardless of service length. (2) Disability — if incapacitated due to accident or disease. (3) 240-day rule — if the employee has worked 4 years and 240+ days in the 5th year, they may be deemed to have completed 5 years." },
    { question: "Is gratuity part of CTC?", answer: "Yes, gratuity is typically included as a component of CTC (Cost to Company) by most Indian employers. Employers provision 4.81% of Basic + DA monthly towards gratuity (₹15/26 × 1/12 = 4.81%). However, gratuity is only PAYABLE upon completion of 5 years. If the employee leaves before 5 years, the employer retains the provisioned amount. This makes gratuity a 'deferred' component of CTC." },
    { question: "What is the employer's obligation for gratuity payment?", answer: "Employers must: (1) Pay gratuity within 30 days of it becoming payable. (2) If delayed beyond 30 days, pay simple interest at 10% per annum. (3) Maintain records of nominations (Form F) from all employees. (4) Comply with the Act once 10+ employees are employed. (5) Can arrange payment through group gratuity insurance (LIC or other insurers) or make provisions in the balance sheet as per AS-15/Ind AS-19. Non-compliance penalty: Imprisonment up to 1 year, fine up to ₹10,000, or both." },
    { question: "How does rounding work in gratuity calculation?", answer: "If an employee has served for a period that includes a fraction of a year: Fraction exceeding 6 months → rounded UP to the next full year. Fraction of 6 months or less → ignored. Example: 7 years 8 months → counted as 8 years. 7 years 4 months → counted as 7 years. This rounding significantly impacts the final gratuity amount, especially at higher salary levels." },
];

export default function GratuityCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Gratuity Calculator" },
        ]),
        webAppSchema("Gratuity Calculator India 2026", canonicalUrl("/in/gratuity-calculator")),
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
            <Script id="schema-gratuity" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Gratuity Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Gratuity Calculator India 2026</h1>
            <PageDesc>
                Free Gratuity Calculator with 4 modes: Gratuity Calculator using the statutory 15/26 formula under the Payment of Gratuity Act, 1972 (covered ÷26 vs not-covered ÷30, year rounding for months &gt; 6, Basic+DA base), Tax Exemption Calculator with Section 10(10) rules for all 3 employee types (Government — 100% exempt, Private Covered — least of actual/₹20 lakh/formula, Private Not Covered — half-month average), Employer Liability Estimator with AS-15/Ind AS-19 annual provisioning and monthly cashflow planning, and Eligibility Guide covering 5-year continuous service rule, 240-day/190-day judicial interpretation, death &amp; disability waiver, forfeiture under Section 4(6), and nomination via Form F.
            </PageDesc>
            <AuthorBadge categoryKey="tax" />
            <GratuityCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Gratuity Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/salary-calculator", icon: "💰", title: "Salary Calculator", desc: "Gratuity is part of CTC — see complete salary breakdown with all deductions" },
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "Gratuity above ₹20L is taxable — compute total tax impact" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Calculator", desc: "Include gratuity in your retirement corpus projection" },
    { href: "/in/bonus-calculator", icon: "🎁", title: "Bonus Calculator", desc: "Statutory bonus is another terminal benefit — 8.33% to 20% of salary" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "Gratuity + NPS combined retirement strategy for tax-efficient exit" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "Park gratuity proceeds in PPF for tax-free compounding" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Invest gratuity in FD — earn 7-8% for senior citizens" },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "TDS on gratuity above exemption limit — employer obligations" },
    { href: "/in/pension-calculator", icon: "📊", title: "Pension Calculator", desc: "EPS-95 pension + gratuity = total retirement benefits" },
    { href: "/in/hra-exemption-calculator", icon: "🏠", title: "HRA Exemption Calculator", desc: "Another salary component with tax exemption rules" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "PT is deducted from salary — another payroll compliance" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-gratuity">What is Gratuity?</h2>
    <p><strong>Gratuity</strong> is a statutory terminal benefit paid by an employer to an employee as a token of appreciation for their long-term service. Governed under the <strong>Payment of Gratuity Act, 1972</strong>, it provides financial security to employees upon retirement, resignation, superannuation, death, or disablement.</p>
    <p>The Act applies to every <strong>factory</strong> (regardless of employee count) and every other <strong>establishment employing 10 or more persons</strong> on any day during the preceding 12 months. Once applicable, the Act continues to apply even if the employee count drops below 10.</p>
    <div class="explanation__highlight">
        <strong>Key Formula:</strong> Gratuity = (Last Drawn Salary × 15 × Years of Service) ÷ 26 | <strong>Eligibility:</strong> 5 years continuous service (waived for death/disability) | <strong>Tax Exemption:</strong> Up to ₹20 lakh under Section 10(10)
    </div>

    <h2 id="eligibility">Eligibility Criteria</h2>
    <table>
        <thead><tr><th>Criterion</th><th>Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Continuous Service</strong></td><td>Minimum 5 years with the same employer</td></tr>
            <tr><td><strong>240-Day Rule (6-day week)</strong></td><td>If 240+ days worked in 5th year → deemed 5 years complete</td></tr>
            <tr><td><strong>190-Day Rule (5-day week)</strong></td><td>If 190+ days worked in 5th year → deemed 5 years complete</td></tr>
            <tr><td><strong>Death</strong></td><td>5-year rule waived — payable to nominee/legal heir</td></tr>
            <tr><td><strong>Disability</strong></td><td>5-year rule waived — payable even with &lt; 5 years service</td></tr>
            <tr><td><strong>Employee Types</strong></td><td>All types — manual, clerical, supervisory (no salary ceiling)</td></tr>
        </tbody>
    </table>

    <h2 id="formula">Gratuity Calculation Formula</h2>
    <table>
        <thead><tr><th>Category</th><th>Formula</th><th>Example (₹50K, 10 years)</th></tr></thead>
        <tbody>
            <tr><td><strong>Covered under Act (÷26)</strong></td><td>(Last Salary × 15 × Years) ÷ 26</td><td>(₹50,000 × 15 × 10) ÷ 26 = <strong>₹2,88,462</strong></td></tr>
            <tr><td><strong>Not Covered (÷30)</strong></td><td>(Last Salary × 15 × Years) ÷ 30</td><td>(₹50,000 × 15 × 10) ÷ 30 = <strong>₹2,50,000</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Why 15/26?</strong> 15 days&rsquo; wages for every completed year. 26 = working days in a month (30 minus 4 Sundays). The ÷26 divisor gives a slightly higher gratuity than ÷30. Use our calculator (Mode 1) to compare both.
    </div>

    <h2 id="rounding">Year Rounding Rule</h2>
    <table>
        <thead><tr><th>Actual Service</th><th>Rounded To</th><th>Impact on ₹50K salary</th></tr></thead>
        <tbody>
            <tr><td>7 years 4 months</td><td>7 years</td><td>₹2,01,923</td></tr>
            <tr><td>7 years 7 months</td><td><strong>8 years</strong></td><td>₹2,30,769 (+₹28,846)</td></tr>
            <tr><td>14 years 6 months</td><td>14 years</td><td>₹4,03,846</td></tr>
            <tr><td>14 years 7 months</td><td><strong>15 years</strong></td><td>₹4,32,692 (+₹28,846)</td></tr>
        </tbody>
    </table>

    <h2 id="tax-exemption">Tax Exemption — Section 10(10)</h2>
    <table>
        <thead><tr><th>Employee Type</th><th>Exemption Rule</th><th>Limit</th></tr></thead>
        <tbody>
            <tr><td><strong>Government</strong></td><td>100% exempt — no conditions</td><td>No limit</td></tr>
            <tr><td><strong>Private (Covered)</strong></td><td>LEAST of: Actual, ₹20L, Formula (15/26)</td><td>₹20 lakh (lifetime)</td></tr>
            <tr><td><strong>Private (Not Covered)</strong></td><td>LEAST of: Actual, ₹20L, Half-month avg salary × years</td><td>₹20 lakh (lifetime)</td></tr>
        </tbody>
    </table>
    <p>The ₹20 lakh limit is a <strong>lifetime limit</strong> — if you receive gratuity from multiple employers, the total exemption across your career cannot exceed ₹20 lakh. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to see the impact on your total tax.</p>

    <h2 id="forfeiture">Forfeiture of Gratuity — Section 4(6)</h2>
    <table>
        <thead><tr><th>Ground</th><th>Extent of Forfeiture</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td><strong>Damage/Loss to Employer</strong></td><td>To the extent of loss caused</td><td>Willful omission or negligence</td></tr>
            <tr><td><strong>Misconduct</strong></td><td>Full or partial</td><td>Riotous/disorderly conduct, violence, moral turpitude</td></tr>
        </tbody>
    </table>
    <p><strong>Mandatory due process:</strong> The employer must issue a show-cause notice and give the employee an opportunity to be heard before forfeiting gratuity.</p>

    <h2 id="death-gratuity">Death Gratuity — Enhanced Rates</h2>
    <table>
        <thead><tr><th>Service Period</th><th>Gratuity Payable</th></tr></thead>
        <tbody>
            <tr><td>Less than 1 year</td><td>2 × last drawn salary</td></tr>
            <tr><td>1 to 5 years</td><td>6 × last drawn salary</td></tr>
            <tr><td>5 to 11 years</td><td>12 × last drawn salary</td></tr>
            <tr><td>11 to 20 years</td><td>20 × last drawn salary</td></tr>
            <tr><td>20+ years</td><td>Half-month salary per completed 6 months (max 33×)</td></tr>
        </tbody>
    </table>
    <p>Death gratuity is payable to the <strong>nominee</strong> (designated via Form F) or <strong>legal heirs</strong> if no nomination exists.</p>

    <h2 id="employer">Employer Obligations</h2>
    <ul>
        <li><strong>Payment deadline:</strong> Within 30 days of gratuity becoming payable</li>
        <li><strong>Interest on delay:</strong> Simple interest at 10% per annum beyond 30 days</li>
        <li><strong>Provisioning:</strong> AS-15 / Ind AS-19 compliant actuarial valuation required annually</li>
        <li><strong>Insurance:</strong> Can arrange through group gratuity insurance (LIC or other insurers)</li>
        <li><strong>Self-funding:</strong> Alternatively, create a gratuity fund with approved trust</li>
        <li><strong>Nomination:</strong> Collect Form F from all employees; update on marriage/change</li>
        <li><strong>Penalty:</strong> Non-compliance — imprisonment up to 1 year, fine up to ₹10,000, or both</li>
    </ul>
    <p>Use our <strong>Employer Liability Estimator</strong> (Mode 3) to compute your workforce-level gratuity provision. See <a href="/in/business-loan-calculator">Business Loan Calculator</a> for working capital planning.</p>

    <h2 id="ctc">Gratuity as Part of CTC</h2>
    <table>
        <thead><tr><th>Aspect</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>CTC Component</strong></td><td>4.81% of Basic + DA (= 15/26 × 1/12)</td></tr>
            <tr><td><strong>Monthly Provision</strong></td><td>₹2,405 for ₹50,000 Basic+DA</td></tr>
            <tr><td><strong>Vesting</strong></td><td>Only after 5 years of continuous service</td></tr>
            <tr><td><strong>Early Exit</strong></td><td>If &lt; 5 years, employer retains the provision</td></tr>
        </tbody>
    </table>
    <p>See our <a href="/in/salary-calculator">Salary Calculator</a> for complete CTC-to-take-home breakdown.</p>

    <h2 id="comparison">Gratuity vs Other Retirement Benefits</h2>
    <table>
        <thead><tr><th>Benefit</th><th>Governed By</th><th>Employer / Employee</th><th>Tax Treatment</th></tr></thead>
        <tbody>
            <tr><td><strong>Gratuity</strong></td><td>Payment of Gratuity Act, 1972</td><td>100% employer-funded</td><td>Exempt up to ₹20L (Sec 10(10))</td></tr>
            <tr><td><strong>EPF</strong></td><td>EPF Act, 1952</td><td>12% + 12% (shared)</td><td>Exempt if &gt; 5 years (Sec 10(12))</td></tr>
            <tr><td><strong>EPS-95 Pension</strong></td><td>EPS, 1995</td><td>From employer's 12%</td><td>Pension taxable as salary</td></tr>
            <tr><td><strong>NPS</strong></td><td>PFRDA Act, 2013</td><td>10% + 14%/10%</td><td>60% exempt at exit (Sec 10(12A))</td></tr>
            <tr><td><strong>Superannuation</strong></td><td>Company policy</td><td>Employer-funded</td><td>Exempt up to ₹15L</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a> and <a href="/in/nps-calculator">NPS Calculator</a> for a complete retirement planning stack.</p>

    <h2 id="fixed-term">Gratuity for Fixed-Term Contract Employees</h2>
    <p>Following the 2018 amendment (labour code reforms), fixed-term contract employees are eligible for gratuity on a <strong>pro-rata basis</strong> even if their contract is less than 5 years. This is a significant change from the original 5-year requirement and applies to all establishments covered under the Act.</p>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/salary-calculator">Salary Calculator</a></strong> — Gratuity is a CTC component. See complete net salary breakdown.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Gratuity above ₹20L is taxable.</li>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Calculator</a></strong> — Include gratuity in your corpus projection.</li>
        <li><strong><a href="/in/bonus-calculator">Bonus Calculator</a></strong> — Another statutory terminal benefit under Payment of Bonus Act.</li>
        <li><strong><a href="/in/nps-calculator">NPS Calculator</a></strong> — Combine gratuity + NPS for tax-efficient retirement.</li>
        <li><strong><a href="/in/tds-calculator">TDS Calculator</a></strong> — TDS obligations on gratuity above exemption.</li>
    </ul>
`;

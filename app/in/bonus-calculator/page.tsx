import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import BonusCalculatorCore from "@/components/calculator/BonusCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Bonus Calculator India 2026 — Statutory Bonus under Payment of Bonus Act 1965 | 8.33%-20%, ₹7000 Ceiling, Allocable Surplus",
    description: "Free Statutory Bonus Calculator with 4 modes: Employee Bonus Calculator (8.33%-20% with ₹21,000 eligibility ceiling and ₹7,000 calculation base), Employer Cost Estimator (workforce-level liability and monthly provisioning), Compliance Guide (Payment of Bonus Act 1965 — eligibility, disqualification, penalties, Form A/B/C/D), and Allocable Surplus Calculator (gross profit, prior charges, 67%/60% split, set-on/set-off).",
    keywords: ["bonus calculator", "statutory bonus calculator India", "Payment of Bonus Act 1965", "minimum bonus 8.33%", "maximum bonus 20%", "bonus calculation formula", "allocable surplus", "set on set off bonus", "employer bonus liability", "bonus eligibility ₹21000", "bonus calculation ceiling ₹7000"],
    alternates: buildCountryAlternates("IN", "/in/bonus-calculator", "bonus-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is statutory bonus under the Payment of Bonus Act 1965?", answer: "Statutory bonus is a mandatory payment made by employers to eligible employees as per the Payment of Bonus Act, 1965. It ensures employees receive a share of the establishment's profits. The minimum bonus is 8.33% of salary (Basic + DA) or ₹100, whichever is higher, and the maximum is 20%. It applies to every factory and every establishment employing 20 or more persons on any day during the accounting year." },
    { question: "What is the eligibility criteria for statutory bonus?", answer: "An employee is eligible for statutory bonus if: (1) They earn Basic + DA up to ₹21,000 per month. (2) They have worked for at least 30 working days in the accounting year. (3) They are employed in a factory or establishment with 20+ employees. The 30-day requirement applies even for casual, temporary, or part-time workers. Managerial/supervisory staff earning above ₹21,000 are excluded." },
    { question: "How is statutory bonus calculated?", answer: "Bonus = (Calculation Base × Bonus Rate × Days Worked) ÷ Total Working Days. The calculation base is the LOWER of: actual Basic + DA, or ₹7,000/month (or applicable minimum wage if higher). For example, if an employee earns ₹18,000/month Basic + DA, bonus is calculated on ₹7,000/month (the ceiling). At 8.33%: ₹7,000 × 12 × 8.33% = ₹6,997/year." },
    { question: "What is the difference between eligibility ceiling and calculation ceiling?", answer: "Eligibility ceiling (₹21,000/month): Determines WHETHER an employee is eligible for bonus. If Basic + DA > ₹21,000, no statutory bonus applies. Calculation ceiling (₹7,000/month or minimum wage, whichever is higher): Determines the BASE on which bonus is calculated. Even if an employee earns ₹18,000, bonus is computed on ₹7,000. This protects employers from excessive liability." },
    { question: "Is minimum bonus mandatory even if the company makes a loss?", answer: "Yes. The minimum bonus of 8.33% (or ₹100, whichever is higher) is mandatory regardless of whether the establishment made a profit or loss. This is a statutory obligation under Section 10. Even loss-making companies must pay the minimum 8.33% bonus. Only new establishments (first 5 years, if no profit) may be exempt under Section 16." },
    { question: "What is allocable surplus?", answer: "Allocable surplus is the portion of an establishment's available surplus from which bonuses are paid: (1) Compute Gross Profit (per First/Second Schedule of the Act). (2) Deduct prior charges — depreciation, direct taxes, development rebate. (3) Get Available Surplus. (4) Apply allocable percentage — 67% for companies, 60% for other establishments. The allocable surplus determines the actual bonus rate between 8.33% and 20%." },
    { question: "What is set-on and set-off in bonus calculation?", answer: "Set-On: If allocable surplus exceeds the 20% maximum bonus, the excess is 'set on' (carried forward) for up to 4 years to supplement future bonus payments. Set-Off: If allocable surplus is less than the 8.33% minimum bonus, the deficit (minimum bonus minus surplus) is 'set off' against future years' surplus. This mechanism balances bonus payments across profitable and lean years." },
    { question: "Can an employer pay more than 20% bonus?", answer: "Yes, but any amount beyond 20% is classified as 'ex-gratia' bonus and is not governed by the Payment of Bonus Act. Ex-gratia bonus is a voluntary payment. Important: Employers can adjust ex-gratia/custom bonuses paid during the year against the statutory bonus liability, provided the total paid meets or exceeds the statutory minimum." },
    { question: "Is statutory bonus taxable?", answer: "Yes, statutory bonus is fully taxable as 'Income from Salary' in the hands of the employee. It is subject to TDS (Tax Deducted at Source) by the employer as part of salary income. The employee includes this in their total income and pays tax at applicable slab rates. Use our Income Tax Calculator to see the impact on your total tax liability." },
    { question: "When must the bonus be paid?", answer: "Statutory bonus must be paid within 8 months from the close of the accounting year. For example, if the accounting year ends on March 31, the bonus must be paid by November 30 of the same year. Failure to pay within the deadline can attract penalties — imprisonment up to 6 months, fine up to ₹1,000, or both." },
    { question: "Who is disqualified from receiving statutory bonus?", answer: "An employee is disqualified from bonus if dismissed for: (1) Fraud. (2) Riotous or violent behaviour on the establishment premises. (3) Theft, misappropriation, or sabotage of the establishment's property. Additionally, if misconduct by the employee causes financial loss to the employer, the employer may deduct that loss amount from the bonus payable for that year." },
    { question: "Does statutory bonus apply to contract workers?", answer: "Contract workers are eligible for statutory bonus from their immediate employer (the contractor), NOT the principal employer, provided: The contractor's establishment employs 20+ workers. The contract worker's Basic + DA ≤ ₹21,000/month. The worker has completed at least 30 days in the accounting year. The principal employer may be held liable if the contractor fails to pay." },
    { question: "What forms must employers maintain for bonus compliance?", answer: "Under the Payment of Bonus Rules, employers must maintain: Form A — Computation of allocable surplus. Form B — Set-on and set-off computations. Form C — Details of bonus paid to employees. Form D — Annual return filed with the Labour Department. These records must be preserved for at least 5 years and produced on demand by the Inspector." },
    { question: "Can a resigned employee claim bonus?", answer: "Yes. If an employee has worked for at least 30 days in the accounting year, they are entitled to proportionate bonus even if they resign mid-year. The bonus is calculated based on the number of days actually worked divided by total working days in the year. The employer must pay the proportionate bonus within 8 months of the accounting year close." },
    { question: "Are new establishments exempt from bonus?", answer: "Under Section 16, a newly established factory/establishment may be exempt from paying bonus for the first 5 accounting years, but ONLY if no profit is derived during those years. If the establishment makes a profit in any of the first 5 years, it must pay bonus for that year. After 5 years, the establishment must pay at least the minimum bonus (8.33%) regardless of profitability." },
];

export default function BonusCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Bonus Calculator" },
        ]),
        webAppSchema("Statutory Bonus Calculator India 2026", canonicalUrl("/in/bonus-calculator")),
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
            <Script id="schema-bonus" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Bonus Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Bonus Calculator India 2026</h1>
            <PageDesc>
                Free Statutory Bonus Calculator with 4 modes: Employee Bonus Calculator using the 3-step formula under the Payment of Bonus Act, 1965 (8.33%&ndash;20% with ₹21,000 eligibility ceiling and ₹7,000 calculation base, proportionate days worked, minimum ₹100 guarantee), Employer Cost Estimator for workforce-level annual liability and monthly provisioning, Compliance Guide covering eligibility, disqualification (fraud, violence, theft), penalties (6 months imprisonment + ₹1,000 fine), and all required forms (Form A/B/C/D), and Allocable Surplus Calculator computing gross profit, prior charges (depreciation, direct tax), available surplus, 67%/60% allocable split, set-on/set-off mechanism for 4-year carry-forward.
            </PageDesc>
            <AuthorBadge categoryKey="tax" />
            <BonusCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Statutory Bonus Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}


const CONTENT_HTML = `
    <h2 id="what-is-bonus">What is Statutory Bonus?</h2>
    <p><strong>Statutory Bonus</strong> is a mandatory payment made by employers to eligible employees, governed under the <strong>Payment of Bonus Act, 1965</strong>. The Act ensures that employees receive a share in the profits of the establishment, regardless of whether bonus is mentioned in the employment contract.</p>
    <p>The Act applies to every <strong>factory</strong> and every other <strong>establishment employing 20 or more persons</strong> on any day during an accounting year. Once an establishment is covered, it remains covered even if employee count drops below 20.</p>
    <div class="explanation__highlight">
        <strong>Key Numbers:</strong> Eligibility Ceiling = ₹21,000/month (Basic + DA) | Calculation Ceiling = ₹7,000/month (or minimum wage) | Minimum Bonus = 8.33% | Maximum Bonus = 20% | Payment Deadline = 8 months from year-end
    </div>

    <h2 id="eligibility">Eligibility Criteria</h2>
    <table>
        <thead><tr><th>Criterion</th><th>Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Salary Ceiling</strong></td><td>Basic + DA ≤ ₹21,000 per month</td></tr>
            <tr><td><strong>Minimum Service</strong></td><td>At least 30 working days in the accounting year</td></tr>
            <tr><td><strong>Establishment Size</strong></td><td>20+ employees on any day during the year</td></tr>
            <tr><td><strong>Employee Type</strong></td><td>Manual, clerical, supervisory — all types (excluding managerial staff above ₹21,000)</td></tr>
            <tr><td><strong>Sector</strong></td><td>Both public and private sector (with specific exemptions)</td></tr>
        </tbody>
    </table>

    <h2 id="formula">Bonus Calculation Formula</h2>
    <table>
        <thead><tr><th>Step</th><th>Formula</th><th>Example (₹18,000 Basic+DA)</th></tr></thead>
        <tbody>
            <tr><td><strong>Step 1: Determine Base</strong></td><td>MIN(Actual Basic+DA, ₹7,000 or Min Wage)</td><td>MIN(₹18,000, ₹7,000) = ₹7,000</td></tr>
            <tr><td><strong>Step 2: Annual Base</strong></td><td>Monthly Base × 12</td><td>₹7,000 × 12 = ₹84,000</td></tr>
            <tr><td><strong>Step 3: Apply Rate</strong></td><td>Annual Base × Bonus % × (Days ÷ Total Days)</td><td>₹84,000 × 8.33% × (365/365) = <strong>₹6,997</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Two Ceilings:</strong> ₹21,000 decides IF you get bonus. ₹7,000 decides HOW MUCH. An employee earning ₹18,000/month gets bonus calculated on ₹7,000, not ₹18,000. This is a common source of confusion.
    </div>

    <h2 id="allocable-surplus">Allocable Surplus — How Bonus Rate is Determined</h2>
    <p>The actual bonus percentage (between 8.33% and 20%) depends on the establishment&rsquo;s <strong>allocable surplus</strong>:</p>
    <table>
        <thead><tr><th>Step</th><th>Computation</th></tr></thead>
        <tbody>
            <tr><td><strong>Gross Profit</strong></td><td>As per First Schedule (banking) or Second Schedule (other)</td></tr>
            <tr><td><strong>Less: Prior Charges</strong></td><td>Depreciation + Direct Tax + Development Rebate</td></tr>
            <tr><td><strong>= Available Surplus</strong></td><td>Gross Profit − Prior Charges</td></tr>
            <tr><td><strong>Allocable Surplus</strong></td><td>67% of Available Surplus (companies) OR 60% (others)</td></tr>
        </tbody>
    </table>

    <h2 id="set-on-set-off">Set-On and Set-Off Mechanism</h2>
    <table>
        <thead><tr><th>Scenario</th><th>Action</th><th>Carry Forward</th></tr></thead>
        <tbody>
            <tr><td>Surplus &gt; 20% max bonus</td><td><strong>Set On</strong> — excess carried forward</td><td>Up to 4 years</td></tr>
            <tr><td>Surplus &lt; 8.33% min bonus</td><td><strong>Set Off</strong> — deficit carried forward</td><td>Up to 4 years</td></tr>
            <tr><td>Surplus between 8.33%–20%</td><td>Pay actual percentage</td><td>No carry forward</td></tr>
        </tbody>
    </table>
    <p>This mechanism ensures bonus payments are smoothed across years of varying profitability. Use our <strong>Surplus Calculator</strong> (Mode 4) to compute your establishment&rsquo;s set-on/set-off.</p>

    <h2 id="disqualification">Disqualification from Bonus</h2>
    <ul>
        <li><strong>Fraud</strong> — Employee engages in fraud against the establishment</li>
        <li><strong>Violence</strong> — Riotous or violent behaviour on establishment premises</li>
        <li><strong>Theft/Sabotage</strong> — Theft, misappropriation, or sabotage of establishment property</li>
        <li><strong>Financial Loss</strong> — If misconduct causes financial loss, employer may deduct from bonus</li>
    </ul>

    <h2 id="exclusions">Excluded Establishments & Employees</h2>
    <ul>
        <li>Apprentices under the Apprentices Act, 1961</li>
        <li>Employees of Life Insurance Corporation of India</li>
        <li>Indian Red Cross Society</li>
        <li>Universities and educational institutions</li>
        <li>Chambers of Commerce; social welfare institutions</li>
        <li>Managerial/supervisory staff earning above ₹21,000/month</li>
    </ul>

    <h2 id="compliance">Compliance & Record-Keeping</h2>
    <table>
        <thead><tr><th>Form</th><th>Purpose</th><th>Maintained By</th></tr></thead>
        <tbody>
            <tr><td><strong>Form A</strong></td><td>Computation of allocable surplus</td><td>Employer</td></tr>
            <tr><td><strong>Form B</strong></td><td>Set-on and set-off statement</td><td>Employer</td></tr>
            <tr><td><strong>Form C</strong></td><td>Details of bonus paid to each employee</td><td>Employer</td></tr>
            <tr><td><strong>Form D</strong></td><td>Annual return — filed with Labour Department</td><td>Employer</td></tr>
        </tbody>
    </table>
    <p>Records must be preserved for at least <strong>5 years</strong>. Non-compliance can attract imprisonment up to 6 months, fine up to ₹1,000, or both. See our <a href="/in/tds-calculator">TDS Calculator</a> for TDS compliance alongside bonus.</p>

    <h2 id="tax-treatment">Tax Treatment of Statutory Bonus</h2>
    <ul>
        <li>Statutory bonus is <strong>fully taxable</strong> as &ldquo;Income from Salary&rdquo;</li>
        <li>Employer deducts TDS as part of monthly salary</li>
        <li>Employee includes bonus in total income for ITR filing</li>
        <li>If bonus relates to arrears, relief under <strong>Section 89</strong> may apply</li>
        <li>For the employer, bonus paid is a <strong>deductible business expense</strong> under Section 36(1)(ii)</li>
        <li>Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to see the impact on your total tax</li>
    </ul>

    <h2 id="new-establishments">New Establishment Exemption (Section 16)</h2>
    <p>Newly established factories/establishments may be exempt from bonus for the <strong>first 5 accounting years</strong>, but only if no profit is derived. If profit is made in any year within the first 5, bonus becomes payable for that year. After 5 years, the minimum 8.33% is mandatory regardless of profitability.</p>

    <h2 id="employer-strategy">Employer Strategy — Monthly Provisioning</h2>
    <p>Smart employers <strong>provision for bonus monthly</strong> rather than paying a lump sum at year-end. This prevents cash-flow strain. For example, if your total annual bonus liability is ₹5,00,000, provision ₹41,667 each month. Use our <strong>Employer Cost Estimator</strong> (Mode 2) to calculate your exact monthly provision.</p>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/salary-calculator">Salary Calculator</a></strong> — Bonus is a key CTC component. See complete salary breakdown.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Bonus is taxable income. Compute your total tax liability.</li>
        <li><strong><a href="/in/tds-calculator">TDS Calculator</a></strong> — Employer TDS on bonus payments.</li>
        <li><strong><a href="/in/professional-tax-calculator">Professional Tax Calculator</a></strong> — Another payroll compliance obligation.</li>
        <li><strong><a href="/in/hra-exemption-calculator">HRA Exemption Calculator</a></strong> — Another salary component with tax implications.</li>
        <li><strong><a href="/in/gst-calculator">GST Calculator</a></strong> — Gross profit (for surplus) is affected by GST treatment.</li>
        <li><strong><a href="/in/business-loan-calculator">Business Loan Calculator</a></strong> — Bonus liability impacts working capital needs.</li>
    </ul>
`;

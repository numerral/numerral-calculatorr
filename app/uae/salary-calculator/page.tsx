import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAESalaryCalculatorCore from "@/components/calculator/UAESalaryCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Salary Calculator 2025 — Gross to Net, Overtime & Pension",
    description: "Calculate your UAE salary breakdown: gross to net, GPSSA pension, overtime pay, and unemployment insurance. Covers expat & Emirati salaries, WPS, allowances, and leave entitlements.",
    keywords: ["UAE salary calculator", "Dubai salary calculator", "حاسبة الراتب الإمارات", "gross to net UAE", "GPSSA pension calculator", "UAE overtime calculator", "WPS wage protection", "UAE allowances housing transport", "Emirati pension deduction", "MOHRE salary"],
    alternates: { canonical: canonicalUrl("/uae/salary-calculator") },
};

const FAQ_ITEMS = [
    { question: "Is there income tax in the UAE?", answer: "No. The UAE does not levy any personal income tax on salaries and wages — for both Emiratis and expatriates. This means your gross salary is nearly equal to your net take-home salary. The only deductions are: GPSSA/ADPF pension (UAE nationals only, 5% or 11% of basic salary), and mandatory unemployment insurance (AED 5 or 10/month). There is no state, city, or federal income tax on personal earnings." },
    { question: "What is the typical UAE salary structure?", answer: "A UAE salary package typically consists of: Basic Salary (50–60% of gross) — the fixed base used for gratuity, overtime, and pension calculations; Housing Allowance (20–30%) — often the largest non-basic component; Transport Allowance (5–10%); and Other Allowances (education, food, phone, COLA). The specific split varies by employer, but the basic salary percentage is critical because it directly affects your end-of-service gratuity and any overtime pay calculations." },
    { question: "What is the Wage Protection System (WPS)?", answer: "The Wage Protection System (WPS) is a mandatory electronic salary transfer system implemented by MOHRE in partnership with the UAE Central Bank. All private sector employers must pay salaries through WPS. Key rules: wages are due one day after the contractual payday; payments become late after 15 days; employers must register new employees within 30 days; at least 90% of staff must be paid each month. Since April 2025, domestic workers are also covered. Non-compliance results in fines, work permit suspension, and legal action." },
    { question: "What is GPSSA and how does it affect my salary?", answer: "GPSSA (General Pension and Social Security Authority) is the UAE's pension scheme for Emirati nationals. Expatriates are NOT subject to GPSSA deductions. For Emiratis: those who joined before October 31, 2023 contribute 5% of basic salary (employer 12.5%, government 2.5% = 20% total). Those who joined on/after October 31, 2023 contribute 11% (employer 15% = 26% total) under Decree Law 57/2023. The pensionable salary is capped at AED 70,000/month for private sector workers." },
    { question: "How is overtime calculated in the UAE?", answer: "Overtime is calculated on basic salary only (not gross). Formula: (Basic Salary ÷ 30 ÷ 8) × multiplier × hours. Normal weekday OT = 125% of hourly basic rate. Night OT (9PM–4AM) = 150%. Friday/public holiday OT = 150% (or a day off in lieu + 50% pay). Maximum overtime is 2 hours per day per UAE Labour Law Article 19. Senior management and certain sectors (maritime, oil & gas) may be exempt from overtime rules." },
    { question: "Is there a minimum wage in the UAE?", answer: "The UAE does not have a universal national minimum wage for all workers. However, MOHRE provides salary guidelines by skill level: Level 1 (university graduates) — AED 12,000–15,000/month; Level 2 (diploma holders) — AED 5,000–8,000; Level 3 (high school) — AED 4,000–5,000. For unskilled workers, typical salaries range from AED 1,200–1,500/month. For Emiratisation purposes, skilled positions must pay at least AED 4,000/month to count toward the quota." },
    { question: "What is unemployment insurance in the UAE?", answer: "Since 2023, mandatory unemployment insurance covers all private and public sector employees (both Emirati and expat). Premium: AED 5/month if your salary is AED 16,000 or below; AED 10/month if above AED 16,000. If you lose your job involuntarily, the scheme provides 60% of your basic salary for up to 3 months (capped at AED 10,000/month for the basic tier or AED 20,000 for the premium tier). Domestic workers and investors are exempt." },
    { question: "What leave entitlements do UAE employees get?", answer: "Under UAE Labour Law (Decree-Law 33/2021): Annual leave — 30 calendar days after 1 year (2 days/month for 6–12 months). Sick leave — 90 days/year (15 full pay, 30 half pay, 45 unpaid). Maternity — 60 days (45 full, 15 half), plus 45 unpaid. Paternity — 5 working days within 6 months. Bereavement — 5 days (spouse) or 3 days (other relatives). Hajj — 30 days unpaid (once). Study leave — 10 days (UAE nationals, 2+ years). Public holidays — approximately 14 days/year." },
    { question: "What is the difference between basic salary and gross salary?", answer: "Basic salary is the core fixed amount stated in your employment contract, excluding all allowances, bonuses, and benefits. It typically constitutes 50–60% of your total package. Gross salary is the total of basic salary plus all allowances (housing, transport, food, etc.) before any deductions. This distinction matters because: gratuity is calculated on basic salary only, overtime is based on basic salary, and GPSSA pension (for Emiratis) applies to basic salary. A higher basic salary means more gratuity but also more pension deduction." },
    { question: "How does DIFC salary differ from mainland UAE?", answer: "Employees in the Dubai International Financial Centre (DIFC) are governed by DIFC Employment Law No. 2 of 2019, not the federal UAE Labour Law. Key differences: DIFC uses the DEWS (DIFC Employee Workplace Savings) scheme instead of traditional end-of-service gratuity — employers make monthly contributions to a savings/investment plan. DIFC employees can also make voluntary contributions. Working hours, leave, and termination rules may differ slightly. However, there is no income tax in DIFC, and unemployment insurance still applies." },
    { question: "What is Emiratisation and does it affect salaries?", answer: "Emiratisation is a government initiative requiring private sector companies to employ UAE nationals. Companies with 50+ employees must increase their skilled Emirati workforce by 2% annually (7% by mid-2025, 8% by end-2025). Non-compliance: AED 9,000/month per unfilled position. Companies with 20–49 employees in 14 sectors must hire at least 2 Emiratis by end-2025. To count toward quotas, a position must pay at least AED 4,000/month and be registered with a social security fund. The NAFIS program provides salary subsidies to employers." },
    { question: "Can my employer deduct money from my salary?", answer: "UAE Labour Law strictly limits salary deductions. Permitted deductions: court-ordered payments, GPSSA pension (Emiratis), unemployment insurance, documented loan repayments agreed in writing, fines for proven disciplinary violations (max 5 days' pay/month), recovery of overpayments (max 20% of salary per month), and government-mandated charges. Employers cannot deduct for damages without a court order. All deductions must appear on the pay statement. The WPS system monitors that at least 80% of each worker's agreed wage is actually paid." },
    { question: "How does my salary affect my end-of-service gratuity?", answer: "End-of-service gratuity is calculated exclusively on your basic salary, not your gross or total package. The formula: 21 days' basic pay per year for the first 5 years, plus 30 days' basic per year for each year beyond 5 years (capped at 2 years' total salary). This means a higher basic salary percentage directly increases your gratuity payout. For example, if your gross is AED 15,000 with 60% basic (AED 9,000), your gratuity base is AED 9,000 — not AED 15,000. Use our UAE Gratuity Calculator for a detailed estimate." },
    { question: "What are public holidays in the UAE?", answer: "The UAE has approximately 14 paid public holidays per year: New Year's Day (Jan 1), Isra'a Wal Mi'raj (1 day), Eid Al Fitr (approximately 4 days), Arafat Day (1 day), Eid Al Adha (approximately 3 days), Islamic New Year (1 day), Prophet's Birthday (1 day), UAE National Day (Dec 2–3, 2 days). Islamic holidays follow the Hijri calendar and exact dates are confirmed annually by the government. Employees who work on public holidays are entitled to 150% overtime pay or a day off in lieu." },
    { question: "Is housing allowance taxable in the UAE?", answer: "No. Since there is no personal income tax in the UAE, housing allowance (like all salary components) is completely tax-free. However, a 5% Dubai Municipality Housing Fee is charged on the annual rent of your residence — this is added to your DEWA bill monthly and is separate from your salary. The housing fee = 5% of annual rent ÷ 12. For example, AED 60,000 annual rent = AED 250/month added to your DEWA bill. This is not deducted from your salary — it's a utility charge." },
    { question: "How does the UAE salary compare to other countries?", answer: "The UAE's zero income tax makes it highly competitive globally. A person earning AED 15,000/month (≈USD 4,085) in the UAE takes home virtually the entire amount. The same gross salary in: UK would net approximately 76% after income tax and NI; US approximately 72–78% after federal and state tax; India approximately 70–75% after income tax; Saudi Arabia 100% (also no income tax but GOSI deductions for nationals). This tax-free advantage, combined with no capital gains or inheritance tax, makes the UAE one of the most attractive jurisdictions for salary earners worldwide." },
];

export default function SalaryCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Salary Calculator" },
        ]),
        webAppSchema("UAE Salary Calculator", canonicalUrl("/uae/salary-calculator")),
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
            <Script id="schema-salary-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Salary Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Salary Calculator 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your UAE salary breakdown: gross to net take-home, GPSSA pension deductions, overtime pay, and unemployment insurance. Covers both expatriate and Emirati salaries, WPS compliance, allowance structures, and leave entitlements.
            </p>
            <AuthorBadge categoryKey="salary" />
            <UAESalaryCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE Salary Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/gratuity-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💼</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Gratuity Calculator</div>
                            <div className="uae-related-link__desc">End-of-service benefits</div>
                        </div>
                    </Link>
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT, tourist refund</div>
                        </div>
                    </Link>
                    <Link href="/uae/rera-rental-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">📊</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">RERA Rental Calculator</div>
                            <div className="uae-related-link__desc">Max legal rent increase</div>
                        </div>
                    </Link>
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">EMI, DLD fees, DBR check</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="salary-structure">UAE Salary Structure Explained</h2>
    <p>Understanding your UAE salary package is essential — not just for budgeting, but because the way your salary is split between <strong>basic salary</strong> and <strong>allowances</strong> directly impacts your <strong>end-of-service gratuity</strong>, <strong>overtime pay</strong>, and (for Emirati nationals) your <strong>pension contributions</strong>.</p>
    <p>A typical UAE salary package consists of:</p>
    <table>
        <thead><tr><th>Component</th><th>Typical %</th><th>Purpose</th></tr></thead>
        <tbody>
            <tr><td><strong>Basic Salary</strong></td><td>50–60%</td><td>Core pay — base for gratuity, overtime, pension</td></tr>
            <tr><td><strong>Housing Allowance</strong></td><td>20–30%</td><td>Covers rent — cash, accommodation, or reimbursement</td></tr>
            <tr><td><strong>Transport Allowance</strong></td><td>5–10%</td><td>Commuting costs or company car</td></tr>
            <tr><td><strong>Other Allowances</strong></td><td>5–15%</td><td>Food, phone, education, COLA, etc.</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Why does the basic salary percentage matter?</strong> Your gratuity is calculated ONLY on basic salary. If your gross is AED 15,000 and basic is 50% (AED 7,500), your gratuity base is AED 7,500. If basic is 60% (AED 9,000), your gratuity base is AED 9,000 — a significant difference over years of service. <strong>Always negotiate for a higher basic salary %.</strong>
    </div>

    <h2 id="no-income-tax">Zero Personal Income Tax</h2>
    <p>The UAE has <strong>no personal income tax</strong> — for both Emirati citizens and expatriates. This has been the case since the country&apos;s founding and remains unchanged in 2025. There is no state tax, no municipal tax, and no social contributions for expats (beyond the AED 5–10/month unemployment insurance).</p>
    <p>This means your <strong>gross salary ≈ net salary</strong> for expatriates. For UAE nationals, the only significant deduction is the GPSSA/ADPF pension contribution.</p>
    <table>
        <thead><tr><th>Country</th><th>Income Tax on AED 15,000/month</th><th>Net Take-Home</th></tr></thead>
        <tbody>
            <tr><td><strong>🇦🇪 UAE</strong></td><td><strong>0%</strong></td><td><strong>AED 14,990–15,000</strong></td></tr>
            <tr><td>🇬🇧 UK</td><td>~24%</td><td>~AED 11,400</td></tr>
            <tr><td>🇺🇸 USA (Texas)</td><td>~22%</td><td>~AED 11,700</td></tr>
            <tr><td>🇮🇳 India</td><td>~25%</td><td>~AED 11,250</td></tr>
            <tr><td>🇸🇦 Saudi Arabia</td><td>0%</td><td>~AED 15,000</td></tr>
        </tbody>
    </table>

    <h2 id="wps">Wage Protection System (WPS)</h2>
    <p>The <strong>Wage Protection System (WPS)</strong> is a mandatory electronic salary transfer system implemented by the <strong>Ministry of Human Resources and Emiratisation (MOHRE)</strong> in partnership with the UAE Central Bank.</p>
    <ul>
        <li><strong>All private sector employers</strong> must pay salaries through WPS — no cash payments</li>
        <li><strong>Wages are due</strong> one day after the contractual payday</li>
        <li><strong>Late definition</strong> — Payment is "late" if not made within 15 days of the due date</li>
        <li><strong>Coverage</strong> — At least 90% of staff must be paid each month; 80% of each worker&apos;s wage</li>
        <li><strong>New employees</strong> must be registered in WPS within 30 days of joining</li>
        <li><strong>Domestic workers</strong> included since April 1, 2025</li>
        <li><strong>SIF (Salary Information File)</strong> submitted each pay cycle must match contract terms</li>
    </ul>
    <p><strong>Non-compliance penalties:</strong> MOHRE can impose fines, suspend new work permits, and refer cases for legal action.</p>

    <h2 id="gpssa">GPSSA Pension (UAE Nationals Only)</h2>
    <p>The <strong>General Pension and Social Security Authority (GPSSA)</strong> administers the mandatory pension scheme for UAE nationals. Expatriates are <strong>not</strong> subject to GPSSA deductions — they receive end-of-service gratuity instead.</p>
    <table>
        <thead><tr><th>Category</th><th>Employee</th><th>Employer</th><th>Government</th><th>Total</th></tr></thead>
        <tbody>
            <tr><td>Joined <strong>before</strong> Oct 31, 2023</td><td><strong>5%</strong></td><td>12.5%</td><td>2.5%</td><td>20%</td></tr>
            <tr><td>Joined <strong>on/after</strong> Oct 31, 2023</td><td><strong>11%</strong></td><td>15%</td><td>—</td><td>26%</td></tr>
        </tbody>
    </table>
    <p><strong>Key details:</strong></p>
    <ul>
        <li>Contributions are on <strong>basic salary only</strong> (not gross)</li>
        <li>Private sector cap: <strong>AED 70,000/month</strong>; government: AED 100,000</li>
        <li>Based on <strong>Federal Decree Law No. 57 of 2023</strong></li>
        <li>Abu Dhabi nationals may fall under <strong>ADPF</strong> instead of GPSSA (similar rates)</li>
        <li>For private sector employees earning under AED 20,000, government contributes an additional 2.5% of the employer&apos;s share</li>
    </ul>

    <h2 id="unemployment-insurance">Unemployment Insurance</h2>
    <p>Since 2023, <strong>mandatory unemployment insurance</strong> covers all UAE employees:</p>
    <table>
        <thead><tr><th>Salary Bracket</th><th>Monthly Premium</th><th>Benefit if Unemployed</th></tr></thead>
        <tbody>
            <tr><td>≤ AED 16,000/month</td><td><strong>AED 5</strong></td><td>60% of basic salary, max AED 10,000/month for 3 months</td></tr>
            <tr><td>&gt; AED 16,000/month</td><td><strong>AED 10</strong></td><td>60% of basic salary, max AED 20,000/month for 3 months</td></tr>
        </tbody>
    </table>
    <p>Exempt: domestic workers, investors/business owners, government employees with separate pension, part-time employees, and those under 18.</p>

    <h2 id="overtime">Overtime Laws — UAE Labour Law</h2>
    <p>Overtime is governed by <strong>Federal Decree-Law No. 33 of 2021</strong>:</p>
    <table>
        <thead><tr><th>Type</th><th>Rate</th><th>Formula</th></tr></thead>
        <tbody>
            <tr><td>Normal weekday OT</td><td><strong>125%</strong> of hourly basic</td><td>(Basic ÷ 30 ÷ 8) × 1.25 × hours</td></tr>
            <tr><td>Night OT (9PM–4AM)</td><td><strong>150%</strong> of hourly basic</td><td>(Basic ÷ 30 ÷ 8) × 1.50 × hours</td></tr>
            <tr><td>Friday / holiday OT</td><td><strong>150%</strong> of hourly basic</td><td>Or day off in lieu + 50% pay</td></tr>
        </tbody>
    </table>
    <p><strong>Important rules:</strong></p>
    <ul>
        <li>Maximum <strong>2 hours overtime per day</strong> (Article 19)</li>
        <li>Standard work week: <strong>48 hours</strong> (8 hours/day, 6 days/week)</li>
        <li>During Ramadan: <strong>6 hours/day</strong> for Muslim employees</li>
        <li>Exempt from overtime: senior management, maritime, oil &amp; gas workers</li>
        <li>OT is calculated on <strong>basic salary only</strong> — not gross</li>
    </ul>

    <h2 id="leave">Leave Entitlements</h2>
    <table>
        <thead><tr><th>Leave Type</th><th>Duration</th><th>Conditions</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual Leave</strong></td><td>30 calendar days</td><td>After 1 year; 2 days/month if 6–12 months</td></tr>
            <tr><td><strong>Sick Leave</strong></td><td>90 days/year</td><td>15 full pay, 30 half pay, 45 unpaid</td></tr>
            <tr><td><strong>Maternity</strong></td><td>60 days</td><td>45 full pay, 15 half pay. 45 extra unpaid</td></tr>
            <tr><td><strong>Paternity</strong></td><td>5 working days</td><td>Within 6 months of birth</td></tr>
            <tr><td><strong>Bereavement</strong></td><td>3–5 days</td><td>5 (spouse), 3 (other relatives)</td></tr>
            <tr><td><strong>Hajj</strong></td><td>30 days unpaid</td><td>Once during employment; Muslim employees</td></tr>
            <tr><td><strong>Study Leave</strong></td><td>10 days</td><td>UAE nationals, 2+ years service</td></tr>
        </tbody>
    </table>

    <h2 id="gratuity-link">How Salary Affects Gratuity</h2>
    <p>End-of-service gratuity is based <strong>exclusively on basic salary</strong>:</p>
    <ul>
        <li><strong>First 5 years:</strong> 21 days of basic salary per year of service</li>
        <li><strong>After 5 years:</strong> 30 days of basic salary per additional year</li>
        <li><strong>Cap:</strong> Total gratuity cannot exceed 2 years&apos; total salary</li>
    </ul>
    <p><strong>Example:</strong> If your basic salary is AED 9,000/month and you worked for 7 years: First 5 years = (9,000 ÷ 30 × 21) × 5 = AED 31,500. Next 2 years = (9,000 ÷ 30 × 30) × 2 = AED 18,000. <strong>Total = AED 49,500</strong>.</p>
    <p>This is why negotiating a higher basic salary percentage is so important for long-term financial planning.</p>

    <h2 id="emiratisation">Emiratisation — Private Sector Requirements</h2>
    <table>
        <thead><tr><th>Company Size</th><th>2025 Target</th><th>Penalty for Non-Compliance</th></tr></thead>
        <tbody>
            <tr><td>50+ employees</td><td>7% by Jun, 8% by Dec 2025</td><td>AED 9,000/month per unfilled position</td></tr>
            <tr><td>20–49 employees (14 sectors)</td><td>2 Emiratis by end 2025</td><td>AED 108,000 from Jan 2026</td></tr>
        </tbody>
    </table>
    <p>To count toward quotas: position must pay <strong>≥ AED 4,000/month</strong>, require post-secondary qualifications, and be registered with a social security fund. The <strong>NAFIS</strong> program provides salary subsidies to employers meeting targets.</p>

    <h2 id="difc-adgm">DIFC & ADGM — Special Employment Zones</h2>
    <table>
        <thead><tr><th>Aspect</th><th>DIFC</th><th>ADGM</th></tr></thead>
        <tbody>
            <tr><td><strong>Governing law</strong></td><td>DIFC Employment Law No. 2/2019</td><td>ADGM Employment Regs 2025</td></tr>
            <tr><td><strong>Gratuity replacement</strong></td><td>DEWS (employer-funded savings)</td><td>End-of-service + optional pension</td></tr>
            <tr><td><strong>Income tax</strong></td><td>0%</td><td>0%</td></tr>
            <tr><td><strong>Working hours</strong></td><td>Contractually agreed</td><td>Contractually agreed</td></tr>
        </tbody>
    </table>
    <p><strong>DEWS (DIFC Employee Workplace Savings):</strong> Replaces traditional gratuity with employer monthly contributions to an investment plan. Employees can make voluntary contributions for additional savings.</p>

    <h2 id="salary-deductions">Permitted Salary Deductions</h2>
    <p>UAE Labour Law strictly limits what employers can deduct:</p>
    <ul>
        <li><strong>Court-ordered payments</strong> — Alimony, debt recovery</li>
        <li><strong>GPSSA/ADPF pension</strong> — UAE nationals only</li>
        <li><strong>Unemployment insurance</strong> — AED 5 or AED 10/month</li>
        <li><strong>Loan repayments</strong> — If documented and agreed in writing</li>
        <li><strong>Disciplinary fines</strong> — Max 5 days&apos; pay per month, with proper documentation</li>
        <li><strong>Overpayment recovery</strong> — Max 20% of salary per month</li>
    </ul>
    <p>Employers <strong>cannot</strong> deduct for: property damage (without court order), recruitment costs, visa costs (employer responsibility), or arbitrary penalties.</p>

    <h2 id="common-mistakes">Common Salary Mistakes in the UAE</h2>
    <ol>
        <li><strong>Accepting a low basic salary %</strong> — This reduces your gratuity, overtime pay, and pension</li>
        <li><strong>Not knowing your WPS rights</strong> — Salary must be paid electronically and on time</li>
        <li><strong>Confusing gross and basic for gratuity</strong> — Gratuity is ONLY on basic, not total package</li>
        <li><strong>Not enrolling in unemployment insurance</strong> — It&apos;s mandatory since 2023</li>
        <li><strong>Expecting tax-free status if you&apos;re on remote work</strong> — Tax residency depends on your home country</li>
        <li><strong>Ignoring GPSSA rates</strong> — New joiners (post-Oct 2023) pay 11% vs 5% for older employees</li>
        <li><strong>Not negotiating housing allowance</strong> — Dubai rents are high; this can make or break your package</li>
        <li><strong>Forgetting the housing fee</strong> — 5% of annual rent is charged via DEWA, not from salary</li>
    </ol>
`;

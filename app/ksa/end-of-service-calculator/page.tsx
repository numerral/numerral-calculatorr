// Standalone page — /ksa/end-of-service-calculator
// KSA End of Service Benefit (EOSB) Calculator with full educational content

import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "End of Service Benefit Calculator (KSA) — Saudi Labor Law EOSB",
    description: "Calculate your End of Service Benefit (EOSB) under Saudi Labor Law. Applies Articles 84, 85, and 87 for termination, resignation, and special cases. Free, accurate, and step-by-step.",
    keywords: ["end of service benefit calculator", "EOSB calculator", "Saudi Arabia gratuity calculator", "Saudi labor law", "مكافأة نهاية الخدمة", "end of service Saudi Arabia", "KSA gratuity", "Article 84", "Article 85"],
    alternates: { canonical: canonicalUrl("/ksa/end-of-service-calculator") },
};

const FAQ_ITEMS = [
    { question: "How is the End of Service Benefit calculated in Saudi Arabia?", answer: "Under Article 84 of the Saudi Labor Law, EOSB is calculated as: half a month's wage for each of the first 5 years of service, plus a full month's wage for each year after that. The calculation is based on the employee's 'Actual Wage' — the last wage received including basic salary and all fixed allowances (housing, transportation). Partial years are calculated proportionally." },
    { question: "What is the 'Actual Wage' used for EOSB calculation?", answer: "The 'Actual Wage' (الأجر الفعلي) is the Basic Wage plus all fixed increments and allowances — such as housing allowance, transportation allowance, and any other regular payments. It does NOT include: overtime pay, one-time bonuses, commissions, or irregular payments. This is defined in Article 2 of the Saudi Labor Law." },
    { question: "Am I entitled to EOSB if I resign?", answer: "It depends on your service length (Article 85): Less than 2 years — no entitlement. 2 to 5 years — one-third (⅓) of the full EOSB. 5 to 10 years — two-thirds (⅔). 10 years or more — full entitlement (100%), same as termination." },
    { question: "Do I get full EOSB if my employer terminates me?", answer: "Yes. If the employer terminates the employment relationship (and it is not for cause under Article 80), the worker is entitled to the full EOSB as calculated under Article 84. This applies to both fixed-term and unlimited-term contracts." },
    { question: "When can EOSB be forfeited completely?", answer: "Under Article 80, an employer may terminate a worker without notice, award, or compensation in cases of: assault on the employer, failure to perform essential duties, disobedience of lawful orders, absence without cause for more than 30 days in a year or 15 consecutive days, fraud in obtaining the job, deliberate acts causing material loss, or disclosure of trade secrets." },
    { question: "What are the special cases for full EOSB upon resignation?", answer: "Under Article 87, a worker gets full EOSB even when resigning in these cases: (1) Force majeure beyond the worker's control, (2) A female worker who resigns within 6 months of her marriage date, (3) A female worker who resigns within 3 months of giving birth." },
    { question: "How soon must the employer pay the EOSB?", answer: "Under Article 88 of the Saudi Labor Law: Within 7 days if the contract ends by employer termination or contract expiry. Within 14 days if the worker resigns voluntarily. The employer may deduct any amounts owed by the worker before payment." },
    { question: "Is EOSB taxable in Saudi Arabia?", answer: "No. Saudi Arabia does not levy personal income tax on salaries or benefits for most workers. EOSB is received as a lump sum and is not subject to any tax deduction. However, GOSI (General Organization for Social Insurance) contributions are separate from EOSB." },
    { question: "Does EOSB apply to part-time workers?", answer: "Yes. Part-time workers are entitled to EOSB, but it is calculated proportionally based on the hours worked compared to a full-time equivalent. The Saudi Labor Law amendments that introduced part-time work regulations maintain EOSB eligibility." },
    { question: "What happens to EOSB for fixed-term contracts?", answer: "For fixed-term contracts that expire naturally (not renewed), the worker is entitled to the full EOSB under Article 84. If the worker resigns before the contract term ends, Article 85 resignation tiers apply. If the employer terminates before the term ends without cause, the worker gets full EOSB plus compensation for the remaining contract period." },
    { question: "Can EOSB be paid in installments?", answer: "The Saudi Labor Law requires EOSB to be paid as a lump sum at the end of the employment relationship. Employers cannot legally pay it in installments unless the worker agrees in writing. However, some employment contracts may include provisions for periodic deposits into end-of-service funds." },
    { question: "How is EOSB calculated for partial years?", answer: "Article 84 states that workers are entitled to a proportional award for portions of the year. For example, if you worked 7 years and 6 months: EOSB = (5 × half month) + (2.5 × full month). The 6 months is pro-rated as 0.5 years." },
    { question: "Does EOSB include overtime and bonuses?", answer: "No. EOSB is based on the 'Actual Wage' which includes the basic salary and fixed allowances only. Overtime pay, performance bonuses, commissions, sales incentives, and any variable or one-time payments are excluded from the calculation. However, Article 86 allows employers and workers to agree on including certain variable components." },
    { question: "What is the difference between EOSB and GOSI?", answer: "EOSB (End of Service Benefit) is a lump-sum payment made by the employer directly to the worker at the end of employment. GOSI (General Organization for Social Insurance) is a mandatory social insurance system separate from EOSB. Saudi nationals contribute 10% of salary (matched by employer) and are covered for retirement pensions, occupational hazards, and unemployment (SANED). Non-Saudi workers contribute 2% for occupational hazards only." },
    { question: "Can I file a complaint if my employer doesn't pay EOSB?", answer: "Yes. Workers can file a complaint with the Ministry of Human Resources and Social Development (HRSD) through the Musaned platform or by visiting a labor office. If the dispute is not resolved, it is referred to the Labor Courts. The limitation period for EOSB claims is 12 months from the date the right arose (Article 200)." },
];

export default function EOSBPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "End of Service Benefit Calculator" },
        ]),
        webAppSchema(
            "End of Service Benefit Calculator (KSA)",
            canonicalUrl("/ksa/end-of-service-calculator"),
        ),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-eosb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "End of Service Benefit Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>End of Service Benefit Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your End of Service Benefit (EOSB) under Saudi Labor Law. Applies Articles 84, 85, and 87 for accurate estimates based on your wage, service duration, and reason for separation.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="eosb" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            {/* ─── Educational Content ─── */}
            <section className="calc-card" style={{ marginTop: "var(--s-6)", padding: "var(--s-6)" }}>
                <div className="hub-content" dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="End of Service Benefit (KSA) FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-eosb">What Is End of Service Benefit (EOSB)?</h2>
    <p>The <strong>End of Service Benefit</strong> (مكافأة نهاية الخدمة), also known as <strong>EOSB</strong> or <strong>gratuity</strong>, is a mandatory lump-sum payment that employers in Saudi Arabia must pay to workers upon the termination of their employment relationship. It is governed by <strong>Articles 84–88 of the Saudi Labor Law</strong> (Royal Decree No. M/51, dated 23/08/1426H).</p>
    <p>EOSB serves as a form of <strong>financial security</strong> for workers — similar to a retirement benefit. Unlike pension systems in many Western countries, Saudi Arabia's private sector does not have a mandatory pension scheme for expatriate workers. Instead, EOSB acts as the primary end-of-employment financial protection for the approximately <strong>11 million expatriate workers</strong> in KSA.</p>
    <p>For <strong>Saudi nationals</strong>, EOSB exists alongside the <strong>GOSI (General Organization for Social Insurance)</strong> retirement pension. Both benefits are separate and do not replace each other.</p>

    <h2 id="article-84">Article 84 — The EOSB Formula</h2>
    <p>Article 84 of the Saudi Labor Law establishes the core formula for calculating EOSB:</p>
    <div class="explanation__highlight">
        <strong>First 5 years:</strong> Half a month's wage for each year of service<br/>
        <strong>After 5 years:</strong> A full month's wage for each additional year<br/>
        <strong>Partial years:</strong> Pro-rated proportionally
    </div>
    <p>The formula uses <strong>progressive rates</strong> — the per-year benefit increases after the 5-year mark, rewarding long-term employees with higher payouts.</p>
    <table>
        <thead><tr><th>Service Period</th><th>Rate Per Year</th><th>Example (SAR 10,000/month)</th></tr></thead>
        <tbody>
            <tr><td>Year 1 through Year 5</td><td>½ month's wage</td><td>SAR 5,000 per year</td></tr>
            <tr><td>Year 6 onward</td><td>1 full month's wage</td><td>SAR 10,000 per year</td></tr>
        </tbody>
    </table>

    <h3 id="worked-example-1">Worked Example 1: SAR 10,000 Wage, 7 Years Service (Termination)</h3>
    <ol>
        <li>First 5 years: 5 × (SAR 10,000 / 2) = 5 × SAR 5,000 = <strong>SAR 25,000</strong></li>
        <li>Remaining 2 years: 2 × SAR 10,000 = <strong>SAR 20,000</strong></li>
        <li>Total EOSB: SAR 25,000 + SAR 20,000 = <strong>SAR 45,000</strong></li>
    </ol>

    <h3 id="worked-example-2">Worked Example 2: SAR 15,000 Wage, 12 Years Service (Termination)</h3>
    <ol>
        <li>First 5 years: 5 × (SAR 15,000 / 2) = 5 × SAR 7,500 = <strong>SAR 37,500</strong></li>
        <li>Remaining 7 years: 7 × SAR 15,000 = <strong>SAR 105,000</strong></li>
        <li>Total EOSB: SAR 37,500 + SAR 105,000 = <strong>SAR 142,500</strong></li>
    </ol>

    <h3 id="worked-example-3">Worked Example 3: SAR 8,000 Wage, 3 Years 6 Months (Resignation)</h3>
    <ol>
        <li>Service: 3.5 years (within first 5, so all at half-month rate)</li>
        <li>Full EOSB: 3.5 × (SAR 8,000 / 2) = 3.5 × SAR 4,000 = <strong>SAR 14,000</strong></li>
        <li>Resignation tier: 2–5 years = ⅓ entitlement</li>
        <li>Final Payout: SAR 14,000 × ⅓ = <strong>SAR 4,667</strong></li>
    </ol>

    <h2 id="actual-wage">What Counts as "Actual Wage"?</h2>
    <p>The EOSB calculation is based on the employee's <strong>Actual Wage (الأجر الفعلي)</strong> — the last wage received before separation. This includes:</p>
    <table>
        <thead><tr><th>Included ✅</th><th>Excluded ❌</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary</td><td>Overtime pay</td></tr>
            <tr><td>Housing Allowance</td><td>One-time bonuses</td></tr>
            <tr><td>Transportation Allowance</td><td>Commissions (unless agreed)</td></tr>
            <tr><td>Other fixed monthly allowances</td><td>Irregular incentives</td></tr>
            <tr><td>Cost of living allowance</td><td>In-kind benefits (car, housing provided)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important (Article 86):</strong> The employer and worker may agree that commissions, sales percentages, and similar variable payments are excluded from the wage used for EOSB calculation. This agreement should be documented in the employment contract.
    </div>

    <h2 id="article-85">Article 85 — Resignation Entitlement Tiers</h2>
    <p>When a worker <strong>resigns voluntarily</strong>, the EOSB entitlement is reduced according to the length of service:</p>
    <table>
        <thead><tr><th>Service Duration</th><th>Entitlement</th><th>Payout</th></tr></thead>
        <tbody>
            <tr><td><strong>Less than 2 years</strong></td><td>0%</td><td>No EOSB — worker forfeits the benefit</td></tr>
            <tr><td><strong>2 to less than 5 years</strong></td><td>⅓ (33.3%)</td><td>One-third of the full Article 84 amount</td></tr>
            <tr><td><strong>5 to less than 10 years</strong></td><td>⅔ (66.7%)</td><td>Two-thirds of the full Article 84 amount</td></tr>
            <tr><td><strong>10 years or more</strong></td><td>100%</td><td>Full EOSB — same as employer termination</td></tr>
        </tbody>
    </table>
    <p>This tiered system incentivizes workers to remain in employment longer. A worker who resigns after 10 years receives the same payout as one who is terminated.</p>

    <h2 id="article-87">Article 87 — Special Cases for Full Entitlement</h2>
    <p>Certain situations grant the worker <strong>full EOSB regardless of service length or reason for separation</strong>:</p>
    <table>
        <thead><tr><th>Situation</th><th>Entitlement</th><th>Article</th></tr></thead>
        <tbody>
            <tr><td><strong>Force Majeure</strong> — beyond the worker's control</td><td>Full (100%)</td><td>Article 87</td></tr>
            <tr><td><strong>Marriage</strong> — female worker resigns within 6 months of marriage</td><td>Full (100%)</td><td>Article 87</td></tr>
            <tr><td><strong>Childbirth</strong> — female worker resigns within 3 months of giving birth</td><td>Full (100%)</td><td>Article 87</td></tr>
            <tr><td><strong>Worker's death or disability</strong></td><td>Full (100%)</td><td>Article 84</td></tr>
        </tbody>
    </table>

    <h2 id="article-80">Article 80 — Forfeiture for Gross Misconduct</h2>
    <p>An employer may terminate a worker <strong>without notice, award, or compensation</strong> under Article 80 if the worker:</p>
    <ol>
        <li>Assaults the employer, manager, or any superior during or because of work</li>
        <li>Fails to perform essential obligations under the employment contract</li>
        <li>Disobeys legitimate orders or fails to observe work instructions</li>
        <li>Is found guilty of misconduct or dishonesty</li>
        <li>Commits a deliberate act causing material loss to the employer</li>
        <li>Resorts to forgery to obtain the employment</li>
        <li>Is absent without valid cause for more than 30 days in one year or 15 consecutive days</li>
        <li>Exploits his position for personal gain</li>
        <li>Discloses trade or industrial secrets</li>
    </ol>
    <div class="explanation__highlight">
        <strong>Critical note:</strong> Even under Article 80, the employer must have conducted a proper investigation and given the worker an opportunity to be heard (Article 71). An unfair dismissal can be challenged at Saudi Labor Courts, and compensation claims may include the full EOSB plus damages.
    </div>

    <h2 id="final-settlement">Final Settlement Timeline (Article 88)</h2>
    <p>The Saudi Labor Law specifies strict timelines for EOSB payment:</p>
    <table>
        <thead><tr><th>Scenario</th><th>Payment Deadline</th></tr></thead>
        <tbody>
            <tr><td>Employer termination or contract expiry</td><td><strong>Within 7 days</strong></td></tr>
            <tr><td>Worker resignation</td><td><strong>Within 14 days</strong></td></tr>
        </tbody>
    </table>
    <p>The employer may deduct any amounts owed by the worker from the EOSB (e.g., outstanding loans, penalties, or damages). However, the deduction must be documented and lawful.</p>

    <h2 id="contracts">EOSB for Different Contract Types</h2>
    <table>
        <thead><tr><th>Contract Type</th><th>End Scenario</th><th>EOSB Entitlement</th></tr></thead>
        <tbody>
            <tr><td>Fixed-term — expires naturally</td><td>Contract not renewed</td><td>Full EOSB (Article 84)</td></tr>
            <tr><td>Fixed-term — worker resigns early</td><td>Resignation before term</td><td>Article 85 tiers apply</td></tr>
            <tr><td>Fixed-term — employer terminates early</td><td>Without cause</td><td>Full EOSB + remaining contract compensation</td></tr>
            <tr><td>Unlimited-term — employer terminates</td><td>With notice</td><td>Full EOSB</td></tr>
            <tr><td>Unlimited-term — worker resigns</td><td>With notice</td><td>Article 85 tiers apply</td></tr>
        </tbody>
    </table>
    <p><strong>Note:</strong> Under the 2019 Saudi Labor Law amendments, for non-Saudi workers, fixed-term contracts are the default. If the contract does not specify a term, the duration of the work permit/iqama is considered the contract term.</p>

    <h2 id="eosb-vs-gosi">EOSB vs GOSI — Understanding the Difference</h2>
    <table>
        <thead><tr><th>Feature</th><th>EOSB</th><th>GOSI Pension</th></tr></thead>
        <tbody>
            <tr><td><strong>Applicability</strong></td><td>All workers (Saudi & non-Saudi)</td><td>Saudi nationals only (pension), all for hazards</td></tr>
            <tr><td><strong>Funding</strong></td><td>100% employer-funded</td><td>Employee (10%) + Employer (12%) for Saudis</td></tr>
            <tr><td><strong>Payment Type</strong></td><td>Lump sum at end of service</td><td>Monthly pension after retirement</td></tr>
            <tr><td><strong>Legal Basis</strong></td><td>Saudi Labor Law (Art 84-88)</td><td>Social Insurance Law</td></tr>
            <tr><td><strong>Non-Saudi Workers</strong></td><td>✅ Fully eligible</td><td>❌ No pension (only 2% hazards)</td></tr>
        </tbody>
    </table>
    <p>For <strong>Saudi nationals</strong>, both EOSB and GOSI pension are separate entitlements. Receiving GOSI pension does not reduce EOSB. For <strong>non-Saudi (expatriate) workers</strong>, EOSB is the only end-of-service financial protection — making it critically important.</p>

    <h2 id="vision-2030">EOSB in the Context of Vision 2030</h2>
    <p>Saudi Arabia's <strong>Vision 2030</strong> economic transformation program has brought significant changes to labor regulations. The Ministry of Human Resources and Social Development (HRSD) has been working on reforms including:</p>
    <ul>
        <li><strong>Labor Market reforms</strong> — improved worker mobility through the Labor Reform Initiative</li>
        <li><strong>GOSI modernization</strong> — expanded coverage and digital services</li>
        <li><strong>Wage Protection System (WPS)</strong> — ensures timely salary payments</li>
        <li><strong>Musaned platform</strong> — digital dispute resolution for labor complaints</li>
    </ul>
    <p>These reforms aim to make Saudi Arabia more attractive to skilled workers while strengthening worker protections. EOSB remains a cornerstone of worker rights under these modernized regulations.</p>
`;

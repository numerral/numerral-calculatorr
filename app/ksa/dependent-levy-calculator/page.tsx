// Standalone page — /ksa/dependent-levy-calculator
// KSA Dependent Levy Calculator with comprehensive content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import DependentLevyCalculatorCore from "@/components/calculator/DependentLevyCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Dependent Levy Calculator (KSA) — حاسبة رسوم المرافقين (2025/2026)",
    description: "Calculate your dependent levy in Saudi Arabia — SAR 400/month per dependent. Covers spouse, children, parents, domestic workers, exemptions, payment via Absher & Muqeem, newborn fees, and salary impact analysis.",
    keywords: ["dependent levy calculator Saudi Arabia", "حاسبة رسوم المرافقين", "dependent fee KSA 2025", "expat family cost Saudi", "SAR 400 dependent fee", "exempt from dependent fee", "domestic worker levy", "Absher dependent payment", "Iqama renewal dependent fee", "family visa cost Saudi"],
    alternates: { canonical: canonicalUrl("/ksa/dependent-levy-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much is the dependent levy in Saudi Arabia (2025/2026)?", answer: "The dependent levy is SAR 400 per dependent per month, which equals SAR 4,800 per dependent per year. This rate has been fixed since July 2020. The fee applies to all expatriate-sponsored family members including spouse, children, and parents. Payment is made in advance through Absher, Muqeem, or SADAD." },
    { question: "Who is exempt from the dependent levy in Saudi Arabia?", answer: "The following are exempt: (1) Non-Saudi spouse of a Saudi citizen, (2) Non-Saudi children of a Saudi father or mother, (3) Widow/divorcee of a Saudi man and her expat children, (4) Expatriate government sector employees, (5) GCC nationals, (6) Foreign students on student visas, (7) Non-Saudi parents of Saudi children, (8) Premium Residency holders (for domestic worker limits), (9) Dependents who left on final exit." },
    { question: "How much does it cost to sponsor a family of 4 in Saudi Arabia?", answer: "For a typical family of 4 dependents (spouse + 3 children), the annual dependent levy is SAR 19,200 (4 × SAR 400/month × 12 months). This equals SAR 1,600 per month. Over 5 years, this totals SAR 96,000. This does not include Iqama renewal fees, medical insurance, or other costs." },
    { question: "What is the history of the dependent levy fee?", answer: "The dependent levy was introduced in July 2017 as part of Vision 2030 economic reforms: July 2017: SAR 100/month, July 2018: SAR 200/month, July 2019: SAR 300/month, July 2020 onwards: SAR 400/month. The Saudi government has been reviewing these fees to attract talent, but no changes have been announced as of 2025/2026." },
    { question: "How are domestic worker fees different from dependent levy?", answer: "Domestic workers have a separate fee structure. Saudi citizens get the first 4 domestic workers free; expatriate employers get the first 2 free. Each additional worker beyond the free limit costs SAR 9,600 per year (SAR 800/month). Premium Residency holders get the same 4-worker limit as Saudi citizens. Humanitarian exemptions exist for workers caring for disabled family members." },
    { question: "How do I pay the dependent levy?", answer: "You can pay through three main channels: (1) Absher — log in, go to Electronic Services → Residents → Pay Dependent Fee, (2) Muqeem — employer platform for managing worker services, (3) SADAD — through your Saudi bank's online/mobile app (SNB, Al Rajhi, etc.) under Government Payments. The fee must be paid before Iqama renewal or exit/re-entry visa processing." },
    { question: "Is there a grace period for newborn babies?", answer: "Yes. Newborn dependents are exempt from the dependent levy for the first 90 days after registration. From the 91st day onwards, the SAR 400/month fee applies. Additionally, there is a SAR 2,000 Iqama issuance fee for newborns born after the family's initial visa. The total first-year cost for a newborn is approximately SAR 5,600 (SAR 2,000 Iqama + 9 months × SAR 400)." },
    { question: "Can I get a refund if my dependents leave Saudi Arabia early?", answer: "Generally, dependent fees are non-refundable. If dependents leave on a final exit visa before their Iqama expires, no refund is issued. However, overpayments may appear as available funds in your Absher account and can potentially be refunded through the originating bank. For bank-related refund issues, complaints can be filed through the SAMA portal." },
    { question: "How much does an exit/re-entry visa cost for dependents?", answer: "Single exit/re-entry visa: SAR 200 for up to 2 months, plus SAR 100 for each additional month until Iqama expiry. Multiple exit/re-entry visa: SAR 500 for up to 3 months, plus SAR 200 for each additional month. The dependent levy must be fully paid before any exit/re-entry visa can be processed." },
    { question: "Does the dependent levy affect my loan eligibility?", answer: "Yes, indirectly. The dependent levy reduces your disposable income. When banks calculate your Debt Burden Ratio (DBR) under SAMA's 33.33% rule, the dependent levy isn't counted as a 'debt obligation' — but it does reduce how much you can comfortably afford in loan repayments. For example, SAR 1,600/month in dependent fees on a SAR 15,000 salary leaves less room for loan EMIs." },
    { question: "What happens if I don't pay the dependent levy?", answer: "Non-payment of the dependent levy results in: (1) inability to renew Iqama for dependents, (2) inability to process exit/re-entry visas, (3) potential fines and penalties, (4) risk of Iqama expiry leading to illegal residency status for dependents. It is strongly recommended to pay all fees on time to avoid complications." },
    { question: "Are there any plans to reduce or cancel the dependent levy?", answer: "The Saudi Minister of Finance has acknowledged the impact of dependent fees on the economy and talent attraction. The government is reviewing the fee structure as part of efforts to attract and retain skilled professionals under Vision 2030. However, as of 2025/2026, the SAR 400/month rate remains unchanged with no official announcement of reduction or cancellation." },
];

export default function DependentLevyPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Dependent Levy Calculator" },
        ]),
        webAppSchema("Dependent Levy Calculator (KSA — حاسبة رسوم المرافقين)", canonicalUrl("/ksa/dependent-levy-calculator")),
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
            <Script id="schema-dependent-levy" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Dependent Levy Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Dependent Levy Calculator (KSA) — حاسبة رسوم المرافقين</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the total cost of sponsoring family members and domestic workers in Saudi Arabia. Includes fee breakdowns, exemptions, salary impact, and 5-year projections.
            </p>
            <AuthorBadge categoryKey="salary" />
            <DependentLevyCalculatorCore />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Dependent Levy FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/iqama-renewal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">📋</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Iqama Renewal Calculator</div>
                            <div className="ksa-related-link__desc">Dependent levy is part of Iqama renewal cost</div>
                        </div>
                    </Link>
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net salary before dependent costs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/savings-goal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🎯</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Savings Goal Calculator</div>
                            <div className="ksa-related-link__desc">Plan savings after dependent levy costs</div>
                        </div>
                    </Link>
                    <Link href="/ksa/rent-affordability-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏘️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Rent Affordability Calculator</div>
                            <div className="ksa-related-link__desc">Factor dependent levy into housing budget</div>
                        </div>
                    </Link>
                    <Link href="/ksa/personal-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏦</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Personal Loan Calculator</div>
                            <div className="ksa-related-link__desc">Dependent costs reduce EMI affordability</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">EOSB can help recoup dependent costs</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-dependent-levy">What Is the Dependent Levy? (رسوم المرافقين)</h2>
    <p>The <strong>Dependent Levy (رسوم المرافقين والمرافقات)</strong> is a monthly fee that expatriates in Saudi Arabia must pay for each family member they sponsor under their Iqama (residency permit). Introduced in <strong>July 2017</strong> as part of Saudi Arabia's <strong>Vision 2030</strong> economic diversification strategy, the fee is designed to generate non-oil revenue for the Kingdom.</p>
    <p>The current rate is <strong>SAR 400 per dependent per month</strong> (SAR 4,800 per year per dependent). The fee applies to spouses, children, parents, and other family members sponsored by the expatriate.</p>
    <div class="explanation__highlight">
        <strong>Key Numbers (2025/2026):</strong><br/>
        <strong>SAR 400</strong> per dependent per month<br/>
        <strong>SAR 4,800</strong> per dependent per year<br/>
        <strong>SAR 13.33</strong> per dependent per day
    </div>

    <h2 id="fee-history">Fee History — How It Increased (2017–2020)</h2>
    <p>The dependent levy was introduced gradually over four years:</p>
    <table>
        <thead><tr><th>Period</th><th>Monthly Rate</th><th>Annual per Dependent</th><th>Annual for Family of 4</th></tr></thead>
        <tbody>
            <tr><td><strong>July 2017</strong></td><td>SAR 100</td><td>SAR 1,200</td><td>SAR 4,800</td></tr>
            <tr><td><strong>July 2018</strong></td><td>SAR 200</td><td>SAR 2,400</td><td>SAR 9,600</td></tr>
            <tr><td><strong>July 2019</strong></td><td>SAR 300</td><td>SAR 3,600</td><td>SAR 14,400</td></tr>
            <tr><td><strong>July 2020 → Present</strong></td><td>SAR 400</td><td>SAR 4,800</td><td>SAR 19,200</td></tr>
        </tbody>
    </table>
    <p>The Saudi government is currently reviewing these fees to attract and retain skilled professionals, but no changes have been officially announced.</p>

    <h2 id="exemptions">Who Is Exempt? — Complete Guide</h2>
    <p>Not everyone pays the dependent levy. The following categories are <strong>fully exempt</strong>:</p>
    <table>
        <thead><tr><th>#</th><th>Exempt Category</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td>1</td><td><strong>Spouse of Saudi citizen</strong></td><td>Non-Saudi wife or husband of a Saudi national</td></tr>
            <tr><td>2</td><td><strong>Children of Saudi parent</strong></td><td>Non-Saudi children of a Saudi father OR mother</td></tr>
            <tr><td>3</td><td><strong>Widow/divorcee of Saudi man</strong></td><td>Exempt for herself and her expatriate children</td></tr>
            <tr><td>4</td><td><strong>Government sector employees</strong></td><td>Expats employed directly by Saudi government</td></tr>
            <tr><td>5</td><td><strong>GCC nationals</strong></td><td>Citizens of UAE, Bahrain, Kuwait, Oman, Qatar</td></tr>
            <tr><td>6</td><td><strong>Students on student visa</strong></td><td>Foreign students studying in Saudi Arabia</td></tr>
            <tr><td>7</td><td><strong>Non-Saudi parents of Saudi children</strong></td><td>Exempt under family ties provision</td></tr>
            <tr><td>8</td><td><strong>Newborns (first 90 days)</strong></td><td>Grace period after birth registration</td></tr>
            <tr><td>9</td><td><strong>Dependents on final exit</strong></td><td>Those who have left on final exit and not returned</td></tr>
            <tr><td>10</td><td><strong>Premium Residency holders</strong></td><td>Same domestic worker limits as Saudi citizens</td></tr>
        </tbody>
    </table>

    <h2 id="domestic-workers">Domestic Worker Fees — Separate Rules</h2>
    <p>Domestic workers (drivers, housemaids, nannies, cooks) have a <strong>different fee structure</strong> from family dependents:</p>
    <table>
        <thead><tr><th>Sponsor Type</th><th>Free Workers</th><th>Fee for Each Additional Worker</th></tr></thead>
        <tbody>
            <tr><td><strong>Saudi Citizens</strong></td><td>First 4 free</td><td>SAR 9,600/year (SAR 800/month)</td></tr>
            <tr><td><strong>Expatriate Employers</strong></td><td>First 2 free</td><td>SAR 9,600/year (SAR 800/month)</td></tr>
            <tr><td><strong>Premium Residency</strong></td><td>First 4 free (same as Saudi)</td><td>SAR 9,600/year (SAR 800/month)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Humanitarian Exemption:</strong> Domestic workers providing medical care to a disabled family member or caring for individuals with special needs may be exempt from the additional worker fee. Apply through the relevant government channel.
    </div>

    <h2 id="cost-examples">Total Cost — Worked Examples by Family Size</h2>
    <table>
        <thead><tr><th>Family Composition</th><th>Dependents</th><th>Monthly Cost</th><th>Annual Cost</th><th>5-Year Cost</th></tr></thead>
        <tbody>
            <tr><td>Spouse only</td><td>1</td><td>SAR 400</td><td>SAR 4,800</td><td>SAR 24,000</td></tr>
            <tr><td>Spouse + 1 child</td><td>2</td><td>SAR 800</td><td>SAR 9,600</td><td>SAR 48,000</td></tr>
            <tr><td>Spouse + 2 children</td><td>3</td><td>SAR 1,200</td><td>SAR 14,400</td><td>SAR 72,000</td></tr>
            <tr><td>Spouse + 3 children</td><td>4</td><td>SAR 1,600</td><td>SAR 19,200</td><td>SAR 96,000</td></tr>
            <tr><td>Spouse + 4 children</td><td>5</td><td>SAR 2,000</td><td>SAR 24,000</td><td>SAR 120,000</td></tr>
            <tr><td>Spouse + 3 children + 1 parent</td><td>5</td><td>SAR 2,000</td><td>SAR 24,000</td><td>SAR 120,000</td></tr>
        </tbody>
    </table>

    <h2 id="financial-impact">Financial Planning — Impact on Your Salary</h2>
    <p>The dependent levy can consume a significant portion of an expatriate's income:</p>
    <table>
        <thead><tr><th>Monthly Salary</th><th>3 Dependents</th><th>% of Salary</th><th>4 Dependents</th><th>% of Salary</th></tr></thead>
        <tbody>
            <tr><td>SAR 5,000</td><td>SAR 1,200</td><td><strong>24.0%</strong></td><td>SAR 1,600</td><td><strong>32.0%</strong></td></tr>
            <tr><td>SAR 8,000</td><td>SAR 1,200</td><td>15.0%</td><td>SAR 1,600</td><td>20.0%</td></tr>
            <tr><td>SAR 10,000</td><td>SAR 1,200</td><td>12.0%</td><td>SAR 1,600</td><td>16.0%</td></tr>
            <tr><td>SAR 15,000</td><td>SAR 1,200</td><td>8.0%</td><td>SAR 1,600</td><td>10.7%</td></tr>
            <tr><td>SAR 20,000</td><td>SAR 1,200</td><td>6.0%</td><td>SAR 1,600</td><td>8.0%</td></tr>
            <tr><td>SAR 30,000</td><td>SAR 1,200</td><td>4.0%</td><td>SAR 1,600</td><td>5.3%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Critical Insight:</strong> For expats earning SAR 5,000/month with 4 dependents, the levy alone consumes <strong>32% of their salary</strong> — nearly as much as the SAMA loan DBR limit of 33.33%. This makes it practically impossible to qualify for personal financing while paying dependent fees.
    </div>

    <h2 id="newborn">Newborn Baby — Registration, Iqama & Fees</h2>
    <p>Adding a newborn to your sponsorship involves multiple steps and costs:</p>
    <ol>
        <li><strong>Hospital birth notification</strong> → obtain from the hospital</li>
        <li><strong>Birth certificate</strong> → Civil Affairs Office (الأحوال المدنية)</li>
        <li><strong>Passport</strong> → Home country embassy/consulate</li>
        <li><strong>Pay Iqama fee</strong> → SAR 2,000 for newborn Iqama</li>
        <li><strong>Pay dependent levy</strong> → SAR 400/month from day 91 (90-day grace period)</li>
        <li><strong>Register at Jawazat</strong> → General Directorate of Passports</li>
    </ol>
    <table>
        <thead><tr><th>Cost Item</th><th>Amount</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td>Iqama Issuance</td><td>SAR 2,000</td><td>One-time fee</td></tr>
            <tr><td>Dependent Levy (first year)</td><td>~SAR 3,600</td><td>9 months × SAR 400 (after 90-day grace)</td></tr>
            <tr><td><strong>Total First Year</strong></td><td><strong>~SAR 5,600</strong></td><td></td></tr>
            <tr><td>Subsequent Years</td><td>SAR 4,800/year</td><td>Full 12 months</td></tr>
        </tbody>
    </table>

    <h2 id="payment">How to Pay — Absher, Muqeem & SADAD</h2>
    <h3>Method 1: Absher</h3>
    <ol>
        <li>Log in to <strong>absher.sa</strong></li>
        <li>Go to <strong>Electronic Services → Residents</strong></li>
        <li>Select <strong>Pay Dependent Fee</strong></li>
        <li>System displays total liability</li>
        <li>Pay via linked bank account or SADAD</li>
    </ol>
    <h3>Method 2: SADAD (Bank Apps)</h3>
    <ol>
        <li>Open your Saudi bank app (SNB, Al Rajhi, Riyad, etc.)</li>
        <li>Go to <strong>SADAD → Government Payments</strong></li>
        <li>Select dependent fee payment service</li>
        <li>Enter family head's Iqama number</li>
        <li>Select dependents and payment period</li>
        <li>Confirm and pay</li>
    </ol>
    <h3>Method 3: Muqeem</h3>
    <p>Employers may use the <strong>Muqeem (مقيم)</strong> platform to manage dependent services, including the "Companion Fee Calculator" for fee estimation.</p>

    <h2 id="exit-reentry">Exit/Re-Entry Visa Fees</h2>
    <table>
        <thead><tr><th>Visa Type</th><th>Base Fee</th><th>Extension</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Single Exit/Re-Entry</strong></td><td>SAR 200</td><td>+ SAR 100/month</td><td>Max 2 months initially</td></tr>
            <tr><td><strong>Multiple Exit/Re-Entry</strong></td><td>SAR 500</td><td>+ SAR 200/month</td><td>Max 3 months initially</td></tr>
        </tbody>
    </table>
    <p><strong>Important:</strong> All dependent levy fees must be fully paid before exit/re-entry visas can be processed for dependents.</p>

    <h2 id="refund">Refund Policy</h2>
    <ul>
        <li>Dependent fees are <strong>generally non-refundable</strong></li>
        <li>If dependents leave on <strong>final exit</strong> before Iqama expires → no refund</li>
        <li><strong>Overpayments</strong> may appear as available funds in Absher and can potentially be refunded through the originating bank</li>
        <li>File complaints through <strong>SAMA portal</strong> for bank-related refund issues</li>
    </ul>
`;

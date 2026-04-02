import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import HLVCalculatorIndiaCore from "@/components/calculator/HLVCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Human Life Value (HLV) Calculator India 2026 — Free Insurance Cover Guide",
    description: "Free HLV calculator for India. Calculate required life insurance cover using Income Replacement, Need-Based, and Quick Estimate methods. Includes IRDAI FY25 data, MWP Act guide, age-based multiplier table, term vs ULIP comparison, and Section 80C tax benefits.",
    keywords: ["HLV calculator India", "human life value calculator", "life insurance calculator India", "how much life insurance do I need", "insurance cover calculator", "HLV formula", "IRDAI life insurance", "term insurance calculator", "MWP Act life insurance", "insurance gap calculator India"],
    alternates: buildCountryAlternates("IN", "/in/hlv-calculator", "hlv-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is Human Life Value (HLV)?", answer: "Human Life Value (HLV) is a financial metric that estimates the present value of all future income you would contribute to your family until retirement. It helps determine the appropriate sum assured for your life insurance policy. HLV accounts for your annual income, personal expenses, outstanding liabilities, inflation, and investment returns to arrive at a comprehensive coverage amount. The concept was developed by Dr. Solomon Huebner in the 1920s and is now widely used by IRDAI-regulated insurers in India." },
    { question: "How do I calculate my HLV in India?", answer: "There are three common methods: (1) Income Replacement Method — calculates the present value of (Annual Income − Personal Expenses) × Working Years Remaining, adjusted for inflation and discount rate. (2) Need-Based Method — totals your liabilities (loans), future goals (children's education/marriage), living expenses corpus, and emergency fund, then subtracts existing savings and insurance. (3) Quick Estimate — multiplies your annual income by an age-based factor (10×–25×) and adds outstanding loans. Our calculator above supports all three methods." },
    { question: "What is the 10x income rule for life insurance?", answer: "The '10x rule' suggests your life insurance cover should be at least 10 times your annual income. However, modern financial planners in India recommend 15×–20× for young earners (age 25–40) to adequately cover inflation, children's education, and long-term lifestyle maintenance. For someone earning ₹12 LPA at age 30, a minimum of ₹1.8 Cr (15×) to ₹2.4 Cr (20×) cover is recommended, plus outstanding loans. The 10x rule is considered a bare minimum, not optimal." },
    { question: "What is India's life insurance penetration rate?", answer: "According to the IRDAI Annual Report for FY 2024-25, India's life insurance penetration stands at 2.7% of GDP — down from 2.8% in FY24. This is significantly below the global average of ~7.3%. Life insurance density (per capita premium) is USD 72. Alarmingly, an estimated 87% of India's population remains underinsured. Total life insurance premium income was ₹8.86 lakh crore, but the number of new individual policies issued declined by 7.39% to 270.22 lakh." },
    { question: "What is the Married Women's Property Act (MWP Act)?", answer: "The MWP Act, 1874, creates a statutory trust over a life insurance policy's proceeds, keeping them legally separate from the policyholder's personal estate. Key protections: (1) Proceeds cannot be attached by creditors or courts; (2) Benefits go exclusively to wife and/or children — no other family member can claim; (3) Beneficiaries are irrevocable once set. The MWP Act addendum must be selected at the time of purchasing a new policy and cannot be added later. It's especially valuable for business owners and individuals with significant debt." },
    { question: "What are the tax benefits on life insurance in India?", answer: "Under the old tax regime: Premiums up to ₹1.5 lakh/year qualify for deduction under Section 80C (provided premium ≤ 10% of sum assured for policies after April 2012). Maturity proceeds are exempt under Section 10(10D) if annual premium ≤ ₹5 lakh (for policies issued after April 2023, aggregate premium across all policies). Death benefit (sum assured paid to nominee) is fully exempt from income tax under Section 10(10D) regardless of premium amount." },
    { question: "How often should I recalculate my HLV?", answer: "Recalculate your HLV at least once a year or whenever a major life event occurs: marriage, birth of a child, new home loan or car loan, significant salary increase (>20%), child turning 18 (one less dependent), inheritance or large windfall, spouse starting/stopping work, or retirement of parents. Each of these events materially changes your financial responsibilities and required coverage." },
    { question: "What is the difference between term insurance and whole life insurance?", answer: "Term insurance covers a fixed period (e.g., age 30 to 60) and pays the sum assured only if death occurs during the term — it has no maturity value. It is the cheapest form of life cover with the highest coverage-to-premium ratio. Whole life insurance covers you until death (typically age 99-100) and may have a cash value or maturity benefit. For pure protection (which is what HLV calculation is about), term insurance is recommended because: ₹1 Cr term plan costs ₹8,000–15,000/year vs ₹2–5 lakh/year for equivalent whole life/endowment." },
    { question: "Does HLV include my home loan?", answer: "Yes. Your HLV calculation should include all outstanding liabilities — home loan, car loan, personal loan, credit card debt, education loan, and any business debt. In the Income Replacement method, these are indirectly covered through the income stream. In the Need-Based method, you explicitly add each loan amount. If you die with a ₹40 lakh home loan outstanding, your family would need at least ₹40 lakh just to clear that debt — so it must be part of your life cover calculation." },
    { question: "What does IRDAI say about minimum sum assured?", answer: "IRDAI (Insurance Regulatory and Development Authority of India) mandates that for life insurance policies, the minimum death benefit must be at least 105% of all premiums paid up to the date of death. This is a regulatory floor — not a guide for adequate coverage. IRDAI also requires insurers to follow prudent underwriting practices to ensure the requested sum assured is justified by the proposer's income and financial profile. For tax benefits under Section 80C, the sum assured must be at least 10× the annual premium." },
    { question: "How does inflation affect my life insurance coverage?", answer: "Inflation erodes purchasing power over time. At 6% inflation, ₹1 crore in 20 years will have the purchasing power of only ₹31 lakh in today's terms. This means: if you bought a ₹50 lakh cover 10 years ago, it's worth approximately ₹28 lakh today. This is why financial planners recommend: (1) Buying term insurance with cover of 15–20× income (not just 10×); (2) Adding increasing cover riders where available; (3) Reviewing and topping up coverage every 3–5 years." },
    { question: "Should I buy one large policy or multiple smaller policies?", answer: "Financial advisors generally recommend having 2–3 policies (not more) from different insurers for diversification. Advantages: (1) Claim processing from one insurer doesn't delay the other; (2) You can stagger policy terms (e.g., one till age 60, one till 65); (3) As children become independent, you can let one policy lapse while keeping others. However, avoid too many small policies as the paperwork burden on your nominees increases. A common structure: one large base policy (60% of coverage) + one supplementary policy (40%)." },
    { question: "What is the protection gap in India?", answer: "The protection gap is the difference between the life insurance coverage needed by a household to maintain its standard of living and the actual coverage in place. As of 2025, approximately 87% of India's population has a protection gap — meaning they are underinsured or have no life insurance at all. The gap is even more severe among the 18–35 age group (>90%). Contributing factors include low financial literacy, preference for investment-linked policies over pure protection, and cultural reluctance to discuss death-related planning." },
    { question: "Is life insurance necessary for a DINK (Dual Income, No Kids) couple?", answer: "Yes, but the calculation differs. For DINK couples: (1) Cover outstanding joint debts (home loan, car loan) so the surviving partner isn't burdened; (2) Provide a transition fund — 2–3 years of expenses to allow lifestyle adjustment; (3) If one partner earns significantly more, the income gap should be covered; (4) Factor in any dependent parents. HLV for DINK couples is typically lower than for families with children, but a cover of 8–12× the higher-earning partner's income is still recommended." },
    { question: "How do I calculate HLV in Excel?", answer: "Use the PV (Present Value) function: =PV(real_rate, years, -annual_contribution). Example: Age 30, retirement 60, income ₹12L, expenses ₹3L, inflation 6%, return 8%. Real rate = (1.08/1.06)−1 = 1.887%. Annual contribution = ₹9L. Formula: =PV(1.887%, 30, -900000) = ₹1.99 Cr. For the Need-Based method, simply sum all liabilities and goals in separate cells, subtract existing assets, and the remainder is your insurance gap." },
];

export default function HLVCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "HLV Calculator" },
        ]),
        webAppSchema("Human Life Value Calculator India 2026", canonicalUrl("/in/hlv-calculator")),
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
            <Script id="schema-hlv" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "HLV Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Human Life Value (HLV) Calculator India 2026</h1>
            <PageDesc>
                Calculate how much life insurance cover you actually need using three methods — Income Replacement (Present Value), Need-Based Analysis, and the Quick 10×–20× Estimate. Includes IRDAI FY25 data, MWP Act guide, age-based multiplier table, and Section 80C tax benefits.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <HLVCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Human Life Value Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-hlv">What Is Human Life Value (HLV)?</h2>
    <p><strong>Human Life Value (HLV)</strong> is a financial metric that estimates the present value of all future income you would contribute to your family&rsquo;s well-being until your planned retirement. It is the single most important number for determining how much <strong>life insurance coverage (sum assured)</strong> you actually need.</p>
    <p>The concept, first formalized by insurance economist <strong>Dr. Solomon Huebner</strong> in the 1920s, treats your earning ability as a financial asset &mdash; just like a house or investment portfolio. If that &ldquo;asset&rdquo; is lost (through premature death), the family needs a replacement corpus that generates equivalent financial support.</p>
    <div class="explanation__highlight">
        <strong>India&rsquo;s Protection Gap:</strong> According to the <strong>IRDAI Annual Report FY 2024&ndash;25</strong>, India&rsquo;s life insurance penetration is only <strong>2.7% of GDP</strong> &mdash; the global average is ~7.3%. An estimated <strong>87% of India&rsquo;s population</strong> remains underinsured or has no life cover at all.
    </div>
    <p>Key factors that determine your HLV:</p>
    <ul>
        <li><strong>Current age</strong> and <strong>planned retirement age</strong> &mdash; determines working years remaining</li>
        <li><strong>Annual income</strong> from all sources (salary, rental income, business income)</li>
        <li><strong>Annual personal expenses</strong> &mdash; only the portion you spend on yourself</li>
        <li><strong>Outstanding liabilities</strong> &mdash; home loan, car loan, personal loan, credit card debt</li>
        <li><strong>Future financial goals</strong> &mdash; children&rsquo;s education, marriage, spouse&rsquo;s retirement</li>
        <li><strong>Inflation rate</strong> &mdash; erodes the value of a fixed sum assured over time</li>
        <li><strong>Existing assets</strong> &mdash; savings, investments, and current life insurance cover already held</li>
    </ul>

    <h2 id="income-replacement-method">Income Replacement Method &mdash; How to Calculate HLV</h2>
    <p>The <strong>Income Replacement Method</strong> calculates the present value of your net future financial contribution to your family. This is the most widely used approach by financial planners and IRDAI-regulated insurers.</p>
    <div class="explanation__highlight">
        <strong>Formula:</strong> HLV = Net Annual Contribution &times; [(1 &minus; (1 + r)<sup>&minus;n</sup>) / r]<br/>
        Where: r = real discount rate = (1 + return rate) / (1 + inflation rate) &minus; 1, and n = working years remaining
    </div>
    <p>This formula uses the <strong>Present Value of an annuity</strong> approach. Unlike the simplified &ldquo;income &times; years&rdquo; formula that many competitor calculators use, this properly accounts for the <strong>time value of money</strong> &mdash; ₹1 lakh received today is worth more than ₹1 lakh received 20 years from now.</p>

    <h3>Step-by-Step Example &mdash; ₹12 LPA Earner, Age 30</h3>
    <p>Let&rsquo;s calculate HLV for a typical Indian professional:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Current Age</strong></td><td>30 years</td></tr>
            <tr><td><strong>Planned Retirement Age</strong></td><td>60 years</td></tr>
            <tr><td><strong>Annual Income</strong></td><td>₹12,00,000 (₹12 LPA)</td></tr>
            <tr><td><strong>Annual Personal Expenses</strong></td><td>₹3,00,000</td></tr>
            <tr><td><strong>Net Annual Contribution</strong></td><td>₹9,00,000</td></tr>
            <tr><td><strong>Expected Inflation</strong></td><td>6%</td></tr>
            <tr><td><strong>Expected Investment Return</strong></td><td>8%</td></tr>
            <tr><td><strong>Real Discount Rate</strong></td><td>(1.08/1.06) &minus; 1 = 1.887%</td></tr>
            <tr><td><strong>Working Years (n)</strong></td><td>30 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Calculation:</strong> HLV = ₹9,00,000 &times; [(1 &minus; (1.01887)<sup>&minus;30</sup>) / 0.01887]<br/>
        = ₹9,00,000 &times; 22.12 = <strong>₹1.99 Crore</strong>
    </div>
    <p>This means a 30-year-old earning ₹12 LPA needs approximately <strong>₹2 crore</strong> of life insurance cover to adequately protect their family &mdash; this is roughly <strong>16.6&times;</strong> their annual income, well within the 15&ndash;20&times; range recommended by financial planners.</p>

    <h2 id="need-based-method">Need-Based Method &mdash; Comprehensive Approach</h2>
    <p>The <strong>Need-Based Method</strong> is more comprehensive and practical because it considers your family&rsquo;s actual future financial requirements rather than just income replacement. It is particularly useful for families with specific goals like children&rsquo;s higher education or a home loan.</p>
    <div class="explanation__highlight">
        <strong>Formula:</strong> Insurance Gap = (Total Liabilities + Future Goals + Living Expenses Corpus + Emergency Fund) &minus; (Existing Life Cover + Existing Savings)
    </div>
    <h3>Worked Example &mdash; Family with Two Children</h3>
    <table>
        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td><strong>Outstanding Home Loan</strong></td><td>₹35,00,000</td></tr>
            <tr><td><strong>Car Loan</strong></td><td>₹5,00,000</td></tr>
            <tr><td><strong>Child 1 &mdash; Engineering/Medical Education</strong></td><td>₹25,00,000</td></tr>
            <tr><td><strong>Child 2 &mdash; Education Fund</strong></td><td>₹20,00,000</td></tr>
            <tr><td><strong>Children&rsquo;s Marriage Fund (combined)</strong></td><td>₹20,00,000</td></tr>
            <tr><td><strong>Annual Household Expenses &times; 20 years</strong></td><td>₹1,20,00,000</td></tr>
            <tr><td><strong>Emergency Fund</strong></td><td>₹5,00,000</td></tr>
            <tr><td style="border-top:2px solid #4f46e5"><strong>Total Requirement</strong></td><td style="border-top:2px solid #4f46e5"><strong>₹2,30,00,000</strong></td></tr>
            <tr><td><strong>Less: Existing Life Cover</strong></td><td>&minus; ₹25,00,000</td></tr>
            <tr><td><strong>Less: Existing Savings</strong></td><td>&minus; ₹15,00,000</td></tr>
            <tr><td style="border-top:2px solid #dc2626"><strong>Insurance Gap</strong></td><td style="border-top:2px solid #dc2626;color:#dc2626"><strong>₹1,90,00,000 (₹1.9 Cr)</strong></td></tr>
        </tbody>
    </table>
    <p>This family needs an <strong>additional ₹1.9 crore</strong> of life insurance cover beyond what they already have. A <a href="/in/home-loan-calculator">home loan outstanding balance</a> is one of the biggest components &mdash; use our Home Loan EMI Calculator to check your current balance.</p>

    <h2 id="quick-estimate">Quick Estimate &mdash; The 10&times;&ndash;20&times; Rule of Thumb</h2>
    <p>If you want a fast estimate without detailed calculations, use the industry-standard <strong>age-based income multiplier</strong> approach:</p>
    <table>
        <thead><tr><th>Age Group</th><th>Recommended Multiple</th><th>Example (₹12 LPA)</th><th>Reason</th></tr></thead>
        <tbody>
            <tr><td><strong>20&ndash;30 years</strong></td><td>20&times;&ndash;25&times;</td><td>₹2.4&ndash;3.0 Cr</td><td>Long earning horizon, high compounding benefit</td></tr>
            <tr><td><strong>30&ndash;40 years</strong></td><td>15&times;&ndash;20&times;</td><td>₹1.8&ndash;2.4 Cr</td><td>Peak responsibility &mdash; kids, home loan, lifestyle</td></tr>
            <tr><td><strong>40&ndash;50 years</strong></td><td>10&times;&ndash;15&times;</td><td>₹1.2&ndash;1.8 Cr</td><td>Accumulated assets reduce gap</td></tr>
            <tr><td><strong>50&ndash;60 years</strong></td><td>8&times;&ndash;10&times;</td><td>₹96L&ndash;1.2 Cr</td><td>Near retirement, fewer dependents</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important:</strong> Always add your <strong>outstanding loan amount</strong> on top of the multiplier. ₹15&times; income + ₹40L home loan + ₹5L car loan = total recommended cover.
    </div>

    <h2 id="india-insurance-gap">India&rsquo;s Insurance Protection Gap &mdash; IRDAI FY 2024&ndash;25 Data</h2>
    <p>India has one of the world&rsquo;s largest insurance protection gaps. Here are the key statistics from the IRDAI Annual Report:</p>
    <table>
        <thead><tr><th>Metric</th><th>FY 2024&ndash;25</th><th>Trend</th></tr></thead>
        <tbody>
            <tr><td><strong>Life Insurance Penetration</strong></td><td>2.7% of GDP</td><td>↓ Declined from 2.8%</td></tr>
            <tr><td><strong>Global Average Penetration</strong></td><td>~7.3% of GDP</td><td>&mdash;</td></tr>
            <tr><td><strong>Life Insurance Density</strong></td><td>USD 72 per capita</td><td>↑ Increased from USD 70</td></tr>
            <tr><td><strong>Population Underinsured</strong></td><td>~87%</td><td>Persistent</td></tr>
            <tr><td><strong>Youth (18&ndash;35) Gap</strong></td><td>&gt;90%</td><td>Most vulnerable</td></tr>
            <tr><td><strong>Total Life Premium Income</strong></td><td>₹8.86 lakh crore</td><td>↑ 6.73% growth</td></tr>
            <tr><td><strong>New Individual Policies</strong></td><td>270.22 lakh</td><td>↓ 7.39% decline</td></tr>
        </tbody>
    </table>
    <p>The declining penetration rate means most Indian families are financially vulnerable. Use our calculator above to check whether your coverage is adequate.</p>

    <h2 id="irdai-guidelines">IRDAI Guidelines on Sum Assured</h2>
    <p>The <strong>Insurance Regulatory and Development Authority of India (IRDAI)</strong> does not mandate a specific HLV formula, but it sets regulatory guardrails:</p>
    <ul>
        <li><strong>Minimum Death Benefit:</strong> Must be at least <strong>105% of all premiums paid</strong> up to the date of death</li>
        <li><strong>Sum Assured for 80C:</strong> For tax benefits under Section 80C, the sum assured must be at least <strong>10&times; the annual premium</strong> (for policies issued after April 2012)</li>
        <li><strong>Underwriting Standards:</strong> Insurers must verify that the requested sum assured is proportionate to the policyholder&rsquo;s income and financial profile</li>
        <li><strong>Claim Settlement:</strong> IRDAI tracks and publishes <strong>claim settlement ratios</strong> for all insurers &mdash; check this before choosing a life insurer (top insurers exceed 97%)</li>
    </ul>

    <h2 id="when-to-recalculate">When to Recalculate Your HLV</h2>
    <p>Your HLV is not a one-time calculation. Recalculate whenever a <strong>major life event</strong> changes your financial responsibilities:</p>
    <table>
        <thead><tr><th>Life Event</th><th>Impact on HLV</th><th>Action</th></tr></thead>
        <tbody>
            <tr><td><strong>Marriage</strong></td><td>↑ New dependent, shared expenses</td><td>Increase cover by 30&ndash;50%</td></tr>
            <tr><td><strong>Birth of child</strong></td><td>↑↑ Education, marriage fund needed</td><td>Add ₹25&ndash;50L per child</td></tr>
            <tr><td><strong>New home loan</strong></td><td>↑ Large liability added</td><td>Add loan amount to cover</td></tr>
            <tr><td><strong>Salary hike (&gt;20%)</strong></td><td>↑ Lifestyle and expectations rise</td><td>Recalculate with new income</td></tr>
            <tr><td><strong>Child turns 18</strong></td><td>↓ One less dependent</td><td>Reduce cover if appropriate</td></tr>
            <tr><td><strong>Home loan paid off</strong></td><td>↓ Major liability removed</td><td>Can reduce cover</td></tr>
            <tr><td><strong>Spouse starts earning</strong></td><td>↓ Shared financial burden</td><td>Adjust for dual income</td></tr>
            <tr><td><strong>Parents become dependent</strong></td><td>↑ New financial responsibility</td><td>Add ₹10&ndash;20L to cover</td></tr>
        </tbody>
    </table>

    <h2 id="hlv-by-life-stage">HLV by Life Stage &mdash; India Reference Guide</h2>
    <table>
        <thead><tr><th>Life Stage</th><th>Typical Profile</th><th>Recommended Cover</th><th>Key Focus</th></tr></thead>
        <tbody>
            <tr><td><strong>Single, No Dependents</strong></td><td>Age 22&ndash;28, entry-level job</td><td>5&times;&ndash;10&times; income</td><td>Clear education loans, protect aging parents</td></tr>
            <tr><td><strong>DINK (Dual Income, No Kids)</strong></td><td>Age 25&ndash;35, married</td><td>8&times;&ndash;12&times; higher income</td><td>Joint loans, transition fund for spouse</td></tr>
            <tr><td><strong>Young Family</strong></td><td>Age 28&ndash;40, 1&ndash;2 children</td><td>15&times;&ndash;20&times; income</td><td>Children&rsquo;s education, home loan, lifestyle</td></tr>
            <tr><td><strong>Established Family</strong></td><td>Age 40&ndash;50, teens</td><td>10&times;&ndash;15&times; income</td><td>College fees, marriage fund, remaining loan</td></tr>
            <tr><td><strong>Pre-Retirement</strong></td><td>Age 50&ndash;60, adult children</td><td>5&times;&ndash;8&times; income</td><td>Spouse&rsquo;s retirement, residual loan</td></tr>
        </tbody>
    </table>

    <h2 id="term-vs-whole-life">Term Insurance vs Whole Life vs ULIP &mdash; Which Is Right After HLV?</h2>
    <p>Once you know your HLV, the next question is: <em>which type of life insurance should I buy?</em> Here&rsquo;s the comparison:</p>
    <table>
        <thead><tr><th>Feature</th><th>Term Insurance</th><th>Whole Life / Endowment</th><th>ULIP</th></tr></thead>
        <tbody>
            <tr><td><strong>Purpose</strong></td><td>Pure protection</td><td>Protection + savings</td><td>Protection + market-linked investment</td></tr>
            <tr><td><strong>Premium for ₹1 Cr Cover</strong></td><td><strong>₹8,000&ndash;15,000/yr</strong></td><td>₹2&ndash;5 lakh/yr</td><td>₹1.5&ndash;3 lakh/yr</td></tr>
            <tr><td><strong>Maturity Benefit</strong></td><td>None (payout only on death)</td><td>Sum assured + bonus</td><td>Fund value (market-linked)</td></tr>
            <tr><td><strong>Cover-to-Premium Ratio</strong></td><td><strong>Highest (60&ndash;100&times;)</strong></td><td>Low (3&ndash;5&times;)</td><td>Low-Medium (5&ndash;10&times;)</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>Fixed cover, fixed term</td><td>Fixed cover, lifetime</td><td>Can switch between equity/debt funds</td></tr>
            <tr><td><strong>Best For</strong></td><td>Income replacement (HLV)</td><td>Conservative savers</td><td>Those who want insurance + equity exposure</td></tr>
            <tr><td><strong>Recommendation</strong></td><td><strong>⭐ Best for HLV coverage</strong></td><td>Generally not recommended</td><td>Only if you understand market risk</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Expert Advice:</strong> &ldquo;Buy term and invest the rest.&rdquo; A ₹1 Cr term plan at age 30 costs ~₹10,000/year. The same cover via endowment would cost ~₹3 lakh/year. Invest the ₹2.9 lakh difference in a <a href="/in/sip-calculator">mutual fund SIP</a> at 12% returns and you&rsquo;ll build ₹1.6 Cr wealth in 20 years &mdash; far more than any endowment maturity.
    </div>

    <h2 id="mwp-act">Married Women&rsquo;s Property Act (MWP Act) &mdash; Protect Your Family</h2>
    <p>The <strong>MWP Act, 1874</strong> is one of the most powerful legal protections available for Indian families. When you buy a life insurance policy under the MWP Act, it creates a <strong>statutory trust</strong> over the policy proceeds:</p>
    <ul>
        <li><strong>Creditor Protection:</strong> Proceeds cannot be attached by courts or creditors, even if you have outstanding debts at death</li>
        <li><strong>Exclusive Beneficiaries:</strong> Only your wife and/or children can receive the payout &mdash; no other family member, relative, or legal heir can claim</li>
        <li><strong>Separate from Estate:</strong> The policy is not part of your personal estate, avoiding potential succession disputes</li>
        <li><strong>Irrevocable:</strong> Once beneficiaries are set under MWP, they cannot be changed &mdash; even upon divorce</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Who should use MWP Act?</strong> Business owners (protects from business creditors), individuals with large loans (ensures insurance doesn&rsquo;t go to repay debt), and anyone wanting to guarantee that the cover reaches their wife and children.
    </div>
    <p><strong>Important:</strong> The MWP Act addendum must be selected <em>at the time of purchasing</em> a new policy. It cannot be added to an existing policy retroactively.</p>

    <h2 id="tax-benefits">Tax Benefits on Life Insurance &mdash; Section 80C &amp; 10(10D)</h2>
    <table>
        <thead><tr><th>Benefit</th><th>Section</th><th>Limit</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td><strong>Premium Deduction</strong></td><td>80C</td><td>Up to ₹1.5 lakh/yr</td><td>Premium &le; 10% of sum assured (policies post April 2012)</td></tr>
            <tr><td><strong>Maturity Exempt</strong></td><td>10(10D)</td><td>Full exemption</td><td>Annual premium &le; ₹5L (aggregate, post April 2023)</td></tr>
            <tr><td><strong>Death Benefit</strong></td><td>10(10D)</td><td><strong>Fully exempt</strong></td><td>No conditions &mdash; always tax-free to nominee</td></tr>
            <tr><td><strong>NPS Additional</strong></td><td>80CCD(1B)</td><td>₹50,000 extra</td><td>Over and above 80C limit</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Note:</strong> These deductions apply only under the <strong>old tax regime</strong>. Under the new tax regime (default from FY 2024&ndash;25), Section 80C deductions are <em>not available</em>. However, death benefit under Section 10(10D) remains exempt under both regimes.
    </div>

    <h2 id="common-mistakes">Common Mistakes in Life Insurance Planning</h2>
    <ol>
        <li><strong>Buying investment plans instead of term insurance</strong> &mdash; Endowments and ULIPs provide 3&ndash;5&times; cover vs 60&ndash;100&times; with term. You end up grossly underinsured.</li>
        <li><strong>Not accounting for inflation</strong> &mdash; ₹50L cover bought in 2015 is worth only ~₹28L today (at 6% inflation). Review every 3&ndash;5 years.</li>
        <li><strong>Mixing insurance with investment</strong> &mdash; Insurance is for protection; mutual funds and <a href="/in/ppf-calculator">PPF</a> are for investment. Keep them separate.</li>
        <li><strong>Ignoring liabilities</strong> &mdash; Your <a href="/in/home-loan-calculator">home loan</a>, <a href="/in/car-loan-calculator">car loan</a>, and other debts must be factored in.</li>
        <li><strong>Buying too late</strong> &mdash; Term insurance premiums increase significantly with age. A 25-year-old pays ~₹8,000/yr for ₹1 Cr; a 40-year-old pays ~₹20,000/yr for the same cover.</li>
        <li><strong>Not disclosing health conditions</strong> &mdash; Non-disclosure can lead to claim rejection. Always be honest in the proposal form.</li>
        <li><strong>Having only employer-provided cover</strong> &mdash; Employer group life insurance typically covers 1&ndash;3&times; annual salary, which is grossly insufficient. This cover also ends when you leave the company.</li>
    </ol>

    <h2 id="hlv-in-excel">How to Calculate HLV in Excel / Google Sheets</h2>
    <p>Use the built-in <strong>PV (Present Value)</strong> function:</p>
    <div class="explanation__highlight">
        <strong>Income Replacement:</strong> =PV(real_rate, years, -annual_contribution)<br/>
        <strong>Example:</strong> =PV(1.887%, 30, -900000) = <strong>₹1,99,11,823</strong> (~₹1.99 Cr)
    </div>
    <p>For the <strong>Need-Based method</strong> in Excel:</p>
    <ul>
        <li>Cell A1: Total Liabilities (home loan + car loan + personal loan)</li>
        <li>Cell A2: Future Goals (education + marriage)</li>
        <li>Cell A3: Living Expenses &times; Years covered</li>
        <li>Cell A4: Emergency Fund</li>
        <li>Cell A5: =SUM(A1:A4) &mdash; Total Requirement</li>
        <li>Cell A6: Existing Cover + Savings</li>
        <li>Cell A7: =MAX(A5-A6, 0) &mdash; <strong>Insurance Gap</strong></li>
    </ul>

    <h2 id="related-tools">Related Calculators &amp; Tools</h2>
    <ul>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> &mdash; Invest the coverage gap amount via systematic SIP and build wealth for your family.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> &mdash; PPF contributes to your &ldquo;existing savings&rdquo; component in HLV calculation. See how much your PPF will mature to.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> &mdash; Check outstanding home loan balance to input in the Need-Based method.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> &mdash; Calculate remaining car loan liability.</li>
        <li><strong><a href="/in/age-calculator">Age Calculator</a></strong> &mdash; Calculate exact <a href="/in/age-calculator">age in years and months</a> for accurate retirement planning.</li>
        <li><strong><a href="/in/bmi-calculator">BMI Calculator</a></strong> &mdash; Health status affects insurance premiums &mdash; check your <a href="/in/bmi-calculator">BMI</a> to estimate potential loading.</li>
    </ul>
`;

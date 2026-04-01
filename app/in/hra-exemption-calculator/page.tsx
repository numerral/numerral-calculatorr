import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import HRAExemptionCalculatorCore from "@/components/calculator/HRAExemptionCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "HRA Exemption Calculator India 2026 — Section 10(13A) | Metro vs Non-Metro, Old vs New Regime, Rent to Parents",
    description: "Free HRA Exemption Calculator with 4 modes: HRA Tax Exemption (3-rule formula under Section 10(13A) & Rule 2A), Old vs New Regime comparison, Rent to Parents strategy with net family savings, and Rent Optimiser. Covers metro 50% / non-metro 40%, landlord PAN rule, Form 12BB, Section 80GG, and compliance requirements.",
    keywords: ["HRA calculator", "HRA exemption calculator", "Section 10(13A)", "Rule 2A", "house rent allowance", "HRA tax exemption", "metro non-metro HRA", "rent to parents HRA", "Old vs New Regime HRA", "HRA exemption formula", "landlord PAN HRA", "Form 12BB", "Section 80GG", "HRA calculator India 2026"],
    alternates: buildCountryAlternates("IN", "/in/hra-exemption-calculator", "hra-exemption-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is HRA exemption under Section 10(13A)?", answer: "HRA (House Rent Allowance) exemption is a tax benefit available under the OLD tax regime for salaried employees who receive HRA as part of their salary and pay rent for residential accommodation. The exempt amount is calculated using a three-rule formula under Section 10(13A) read with Rule 2A of the Income Tax Rules. Only the LEAST of the three amounts is exempt from tax. The remaining HRA (total HRA received minus exempt amount) is added to taxable income." },
    { question: "How is HRA exemption calculated?", answer: "HRA exemption = MINIMUM of three amounts: (1) Actual HRA received from employer. (2) 50% of Basic Salary + DA if living in a metro city (Delhi, Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, Ahmedabad), OR 40% if living in a non-metro city. (3) Actual Rent Paid minus 10% of Basic Salary + DA. The key: 'Salary' for HRA purposes means Basic Pay + Dearness Allowance (forming part of retirement benefits) + Turnover-based Commission. No other allowances are included." },
    { question: "Which cities qualify as metro for HRA 50%?", answer: "As of FY 2025-26, the cities qualifying for the 50% HRA exemption (metro classification) include: Delhi (NCR), Mumbai, Chennai, Kolkata, Bengaluru, Hyderabad, Pune, and Ahmedabad. The expanded list (from the original 4 metros) was introduced to reflect current urban costs. All other cities qualify for the 40% rate. Note: The city classification is based on where you RESIDE and pay rent, not where your employer is located." },
    { question: "Is HRA exemption available in the New Tax Regime?", answer: "No. HRA exemption under Section 10(13A) is NOT available in the New Tax Regime (Section 115BAC). If you opt for the new regime, your entire HRA received becomes fully taxable. This is one of the major reasons salaried employees with high rent payments may find the Old Regime more beneficial. Use our 'Old vs New Regime' mode (Mode 2) to check which regime saves you more money." },
    { question: "Can I pay rent to my parents and claim HRA?", answer: "Yes, this is a perfectly legal tax-saving strategy. You can pay rent to your parents who own the house, claim HRA exemption, and your parents declare the rental income in their ITR. Requirements: (1) Valid rent agreement between you and your parents. (2) Rent receipts with revenue stamps. (3) Parents must show rental income in their ITR. (4) The property must be owned by your parents (not by you). (5) You cannot pay rent to your spouse. (6) Provide parent's PAN if rent exceeds ₹1 lakh per year." },
    { question: "What is Section 80GG for those without HRA?", answer: "Section 80GG provides a deduction for rent paid by individuals who do NOT receive HRA from their employer — such as self-employed persons or employees whose salary structure has no HRA component. Deduction = LEAST of: (1) ₹5,000 per month (₹60,000/year). (2) 25% of Adjusted Total Income. (3) Actual rent paid minus 10% of Adjusted Total Income. Conditions: You must file Form 10BA, must not own residential property at the place of employment, and must opt for Old Regime." },
    { question: "What documents are needed to claim HRA?", answer: "To claim HRA exemption, you need: (1) Rent receipts with landlord's name, address, rent amount, period, and revenue stamp (for rent > ₹5,000/month). (2) Rent agreement (recommended, mandatory for some employers). (3) Landlord's PAN card copy if annual rent exceeds ₹1,00,000. (4) Form 12BB submitted to employer declaring HRA claim with landlord details. (5) Bank transfer proof is recommended over cash payments for amounts exceeding ₹3,000/month." },
    { question: "What if I own a house and also pay rent?", answer: "You CAN claim HRA exemption even if you own a house — but only if the house is at a DIFFERENT location than where you are paying rent for residence. Common scenario: You own a house in your hometown (say Jaipur) but work and rent in Mumbai. You can claim: (1) HRA exemption for Mumbai rent. (2) Home loan interest deduction under Section 24(b) for the Jaipur property. (3) If the Jaipur property is let out, rental income minus 30% standard deduction is taxable. However, you CANNOT claim HRA if you live in your own house at the same location." },
    { question: "How does HRA affect my employer's TDS?", answer: "When you submit Form 12BB (investment declaration) to your employer, declaring that you pay rent and providing landlord details, your employer factors the HRA exemption into your TDS calculation. This means lower TDS is deducted monthly, resulting in higher take-home salary. If you don't submit Form 12BB, the employer treats the entire HRA as taxable and deducts higher TDS. You can still claim exemption while filing ITR, but you'll need to wait for a refund." },
    { question: "What is the landlord PAN requirement?", answer: "If your total annual rent paid exceeds ₹1,00,000 (₹1 lakh), you MUST provide your landlord's PAN to your employer. If the landlord doesn't have a PAN, you should obtain a signed declaration from the landlord along with their name and address. Failure to provide landlord PAN when rent exceeds ₹1 lakh may result in your employer disallowing the HRA exemption at the TDS stage. Note: For rent to parents, the parent must also provide PAN if rent > ₹1L." },
    { question: "Can I claim HRA for rent paid for furnished accommodation?", answer: "Yes, HRA exemption can be claimed for furnished or unfurnished accommodation. The entire rent paid (including furniture charges included in rent) qualifies for HRA calculation. However, if you separately pay for furniture rental, only the accommodation portion counts for HRA. Service charges, maintenance fees, and electricity are NOT considered as 'rent paid' for HRA purposes." },
    { question: "What happens if I receive HRA but don't pay rent?", answer: "If you receive HRA as part of your salary but do NOT pay rent (e.g., you live in your own house or with family without a formal rent arrangement), the ENTIRE HRA received is fully taxable. Since Rule 3 of the formula (Rent paid − 10% of salary) becomes negative or zero, the exempt amount becomes zero. The full HRA amount is added to your taxable income." },
    { question: "Can I claim both HRA and home loan interest deduction?", answer: "Yes, you can claim BOTH HRA exemption AND home loan interest deduction (Section 24b) simultaneously, provided the situations are at different locations. For example: You work in Mumbai (paying rent — claim HRA), and you own a house in Delhi (with home loan — claim Sec 24b interest up to ₹2L for self-occupied, or actual interest for let-out). This dual benefit can significantly reduce your taxable income under the Old Regime." },
    { question: "How to optimise rent for maximum HRA benefit?", answer: "To maximise HRA exemption: (1) Ensure rent paid is at least MORE than 10% of your basic salary (otherwise Rule 3 gives zero). (2) Ideally, rent should equal the MINIMUM of actual HRA received and 50%/40% of basic salary. (3) Paying more rent than this optimal amount gives diminishing returns. (4) Use our 'Rent Optimiser' mode (Mode 4) to find the exact optimal rent for your salary. (5) Consider the rent-to-parents strategy for maximum family-level tax savings." },
    { question: "Is HRA exemption available for part of the year?", answer: "Yes. If you received HRA for only part of the year (e.g., you joined mid-year or your salary structure changed), HRA exemption is calculated on a monthly basis for the months you received HRA and paid rent. If you changed cities during the year (metro to non-metro or vice versa), different percentages apply for different months. The IT department allows proportional calculation based on actual months of entitlement." },
];

export default function HRAExemptionCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "HRA Exemption Calculator" },
        ]),
        webAppSchema("HRA Exemption Calculator India 2026", canonicalUrl("/in/hra-exemption-calculator")),
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
            <Script id="schema-hra" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "HRA Exemption Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>HRA Exemption Calculator India 2026</h1>
            <PageDesc>
                Free HRA Exemption Calculator with 4 modes: HRA Tax Exemption Calculator using the 3-rule formula under Section 10(13A) &amp; Rule 2A (Actual HRA, 50/40% of Basic+DA, Rent−10% of Salary), Old vs New Regime comparison showing how HRA impacts your regime choice, Rent to Parents strategy calculator with net family savings, and Rent Optimiser to find the exact rent level for maximum tax benefit. Covers metro/non-metro classification (8 metros including Bengaluru, Hyderabad, Pune, Ahmedabad), landlord PAN rules, Form 12BB compliance, and Section 80GG for non-HRA recipients.
            </PageDesc>
            <AuthorBadge categoryKey="tax" />
            <HRAExemptionCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="HRA Exemption Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "HRA exemption reduces taxable income — see full Old vs New Regime tax" },
    { href: "/in/salary-calculator", icon: "💰", title: "Salary Calculator", desc: "Compute net take-home salary after HRA, EPF, TDS, and PT deductions" },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "HRA affects your employer's TDS — submit Form 12BB to reduce TDS" },
    { href: "/in/capital-gains-tax-calculator", icon: "📈", title: "Capital Gains Tax Calculator", desc: "If you own property + rent elsewhere — dual HRA + Sec 24b benefit" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Park HRA tax savings in FD for additional returns" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "Combine HRA + 80C (PPF ₹1.5L) for maximum old regime savings" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "80CCD(2) works in BOTH regimes — combine with HRA in old regime" },
    { href: "/in/home-loan-calculator", icon: "🏠", title: "Home Loan Calculator", desc: "Claim both HRA + home loan interest if properties at different locations" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "Another salary deduction — PT under Section 16(iii)" },
    { href: "/in/mutual-fund-returns-calculator", icon: "📊", title: "Mutual Fund Calculator", desc: "Invest HRA tax savings in ELSS for 80C + wealth creation" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Calculator", desc: "HRA savings during working years boost retirement corpus" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-hra">What is HRA (House Rent Allowance)?</h2>
    <p><strong>House Rent Allowance (HRA)</strong> is a component of salary paid by employers to employees to help cover rental accommodation expenses. It is one of the most valuable tax exemptions available to salaried individuals under the <strong>Old Tax Regime</strong>.</p>
    <p>HRA exemption is governed by <strong>Section 10(13A)</strong> of the Income Tax Act, 1961, read with <strong>Rule 2A</strong> of the Income Tax Rules. The exemption is NOT automatic — you must actually pay rent for residential accommodation to claim it.</p>
    <div class="explanation__highlight">
        <strong>Key Point:</strong> HRA exemption is available ONLY in the Old Tax Regime. In the New Regime (Section 115BAC), any HRA received is fully taxable. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to compare both regimes.
    </div>

    <h2 id="hra-formula">HRA Exemption Formula — Section 10(13A) & Rule 2A</h2>
    <p>The HRA exemption is the <strong>LEAST (minimum)</strong> of the following three amounts:</p>
    <table>
        <thead><tr><th>Rule</th><th>Formula</th><th>Explanation</th></tr></thead>
        <tbody>
            <tr><td><strong>Rule 1</strong></td><td>Actual HRA Received</td><td>The HRA component as paid by your employer</td></tr>
            <tr><td><strong>Rule 2</strong></td><td>50% of Salary (metro) OR 40% of Salary (non-metro)</td><td>Salary = Basic Pay + DA + Turnover Commission</td></tr>
            <tr><td><strong>Rule 3</strong></td><td>Rent Paid − 10% of Salary</td><td>Actual rent minus a deemed personal contribution</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Salary Definition for HRA:</strong> "Salary" for HRA purposes means ONLY Basic Pay + Dearness Allowance (forming part of retirement benefits) + Commission based on fixed percentage of turnover. It does NOT include special allowances, bonuses, overtime, or any other components.
    </div>

    <h2 id="worked-example">Worked Example — HRA Exemption Calculation</h2>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Basic Salary</td><td>₹6,00,000/year (₹50,000/month)</td></tr>
            <tr><td>DA</td><td>₹0</td></tr>
            <tr><td>HRA Received</td><td>₹3,00,000/year (₹25,000/month)</td></tr>
            <tr><td>City</td><td>Bengaluru (Metro — 50%)</td></tr>
            <tr><td>Actual Rent Paid</td><td>₹1,80,000/year (₹15,000/month)</td></tr>
        </tbody>
    </table>
    <h3>Three-Rule Calculation</h3>
    <table>
        <thead><tr><th>Rule</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Rule 1: Actual HRA</td><td>₹3,00,000</td><td>₹3,00,000</td></tr>
            <tr><td>Rule 2: 50% of Basic</td><td>₹6,00,000 × 50%</td><td>₹3,00,000</td></tr>
            <tr><td>Rule 3: Rent − 10% Basic</td><td>₹1,80,000 − ₹60,000</td><td><strong>₹1,20,000</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>HRA Exempt = ₹1,20,000</strong> (Minimum of ₹3L, ₹3L, ₹1.2L)<br>
        <strong>HRA Taxable = ₹1,80,000</strong> (₹3L received − ₹1.2L exempt)<br>
        <strong>Tax Saved ≈ ₹37,440</strong> (₹1.2L × 31.2% if in 30% bracket + cess)
    </div>

    <h2 id="metro-cities">Metro vs Non-Metro Classification</h2>
    <table>
        <thead><tr><th>Metro Cities (50%)</th><th>Non-Metro Cities (40%)</th></tr></thead>
        <tbody>
            <tr><td>Delhi (NCR)</td><td>Jaipur</td></tr>
            <tr><td>Mumbai</td><td>Lucknow</td></tr>
            <tr><td>Chennai</td><td>Chandigarh</td></tr>
            <tr><td>Kolkata</td><td>Indore</td></tr>
            <tr><td>Bengaluru</td><td>Nagpur</td></tr>
            <tr><td>Hyderabad</td><td>Patna</td></tr>
            <tr><td>Pune</td><td>Bhopal</td></tr>
            <tr><td>Ahmedabad</td><td>All other cities</td></tr>
        </tbody>
    </table>
    <p>The metro classification is based on your <strong>place of residence</strong> (where you pay rent), NOT your employer&rsquo;s office location. If you work in Mumbai but live in Thane, the classification depends on how your employer treats the address.</p>

    <h2 id="rent-to-parents">Rent to Parents — Legal Tax-Saving Strategy</h2>
    <p>One of the most effective HRA strategies is paying rent to your own parents who own the house you live in. This is <strong>100% legal</strong> and accepted by the Income Tax Department:</p>
    <table>
        <thead><tr><th>Step</th><th>Action</th><th>Compliance</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>Enter rent agreement with parent</td><td>Written agreement specifying monthly rent, tenant, landlord</td></tr>
            <tr><td>2</td><td>Pay rent monthly via bank transfer</td><td>Maintain bank trail — avoid cash payments</td></tr>
            <tr><td>3</td><td>Collect rent receipts with revenue stamps</td><td>Revenue stamp required for receipts > ₹5,000</td></tr>
            <tr><td>4</td><td>Submit Form 12BB to employer</td><td>Include parent's name, PAN (if rent > ₹1L/year)</td></tr>
            <tr><td>5</td><td>Parent declares rental income in ITR</td><td>30% standard deduction available on rental income</td></tr>
        </tbody>
    </table>
    <h3>Net Family Savings Example</h3>
    <table>
        <thead><tr><th>Scenario</th><th>Your Tax (30% bracket)</th><th>Parent's Tax (Nil bracket)</th><th>Net Savings</th></tr></thead>
        <tbody>
            <tr><td>No rent payment</td><td>₹0 HRA benefit</td><td>₹0</td><td>₹0</td></tr>
            <tr><td>₹20,000/month to parent</td><td>₹74,880 saved</td><td>₹0 (below exemption)</td><td><strong>₹74,880</strong></td></tr>
            <tr><td>₹20,000/month to parent (parent in 5%)</td><td>₹74,880 saved</td><td>−₹12,480 tax</td><td><strong>₹62,400</strong></td></tr>
        </tbody>
    </table>

    <h2 id="old-vs-new">HRA in Old vs New Tax Regime</h2>
    <table>
        <thead><tr><th>Feature</th><th>Old Regime</th><th>New Regime</th></tr></thead>
        <tbody>
            <tr><td><strong>HRA Exemption</strong></td><td>✅ Available (Sec 10(13A))</td><td>❌ NOT available</td></tr>
            <tr><td><strong>Standard Deduction</strong></td><td>₹50,000</td><td>₹75,000</td></tr>
            <tr><td><strong>Section 80C</strong></td><td>✅ Up to ₹1.5L</td><td>❌ Not available</td></tr>
            <tr><td><strong>Section 80D</strong></td><td>✅ ₹25K–₹1L</td><td>❌ Not available</td></tr>
            <tr><td><strong>Home Loan Interest (24b)</strong></td><td>✅ Up to ₹2L</td><td>❌ Not available</td></tr>
            <tr><td><strong>Section 80GG</strong></td><td>✅ If no HRA (max ₹60K)</td><td>❌ Not available</td></tr>
            <tr><td><strong>NPS 80CCD(2)</strong></td><td>✅ Available</td><td>✅ Available</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Decision Rule:</strong> If your total deductions (HRA + 80C + 80D + NPS + home loan) exceed approximately ₹3.75 lakh, the Old Regime typically saves more tax. If deductions are below ₹3.75L, the New Regime is usually better. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to compare.
    </div>

    <h2 id="section-80gg">Section 80GG — Deduction Without HRA</h2>
    <p>If your employer does NOT pay you HRA (common for self-employed professionals, freelancers, and some contract workers), you can claim deduction under <strong>Section 80GG</strong>:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Rule</th></tr></thead>
        <tbody>
            <tr><td><strong>Maximum Deduction</strong></td><td>LEAST of: ₹5,000/month OR 25% of Adjusted Total Income OR Rent Paid − 10% of ATI</td></tr>
            <tr><td><strong>Annual Cap</strong></td><td>₹60,000 per year</td></tr>
            <tr><td><strong>Filing Requirement</strong></td><td>Form 10BA (self-declaration)</td></tr>
            <tr><td><strong>Property Ownership</strong></td><td>Must NOT own residential property at employment location</td></tr>
            <tr><td><strong>Regime</strong></td><td>Old Regime ONLY</td></tr>
        </tbody>
    </table>

    <h2 id="compliance">Compliance & Documentation Requirements</h2>
    <table>
        <thead><tr><th>Requirement</th><th>When Applicable</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Rent Receipts</strong></td><td>Rent > ₹3,000/month</td><td>Landlord name, address, amount, period, revenue stamp</td></tr>
            <tr><td><strong>Landlord PAN</strong></td><td>Annual rent > ₹1,00,000</td><td>Mandatory — employer may disallow HRA without it</td></tr>
            <tr><td><strong>Rent Agreement</strong></td><td>Recommended always</td><td>Registered or unregistered; mentioning full terms</td></tr>
            <tr><td><strong>Form 12BB</strong></td><td>To employer</td><td>Annual declaration for investment proofs including HRA</td></tr>
            <tr><td><strong>Bank Transfer</strong></td><td>Rent > ₹3,000/month</td><td>Cash payments lack audit trail; bank transfer recommended</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common HRA Mistakes to Avoid</h2>
    <ul>
        <li><strong>Claiming HRA in New Regime</strong> — HRA exemption is NOT available in the new regime. If you opt for new regime, entire HRA becomes taxable.</li>
        <li><strong>Paying rent to spouse</strong> — Tax department generally disallows HRA if rent is paid to spouse. Pay to parents instead.</li>
        <li><strong>Not providing landlord PAN</strong> — If rent > ₹1L/year and landlord PAN is not provided, employer may deduct higher TDS.</li>
        <li><strong>Claiming without paying rent</strong> — You MUST actually pay rent. Living in own house while claiming HRA is fraud and can attract penalties.</li>
        <li><strong>Incorrect salary definition</strong> — Using gross salary instead of Basic + DA for the formula leads to wrong calculations.</li>
        <li><strong>Ignoring monthly calculation</strong> — If you changed cities or salary changed mid-year, compute HRA month by month.</li>
    </ul>

    <h2 id="dual-benefit">Dual Benefit: HRA + Home Loan Interest</h2>
    <p>You can claim <strong>both</strong> HRA exemption and home loan interest deduction simultaneously if:</p>
    <ul>
        <li>Your rented accommodation and owned property are at <strong>different locations</strong></li>
        <li>Example: Work in Mumbai (rent apartment — claim HRA) + own house in Pune (home loan — claim Section 24b up to ₹2L)</li>
        <li>This dual benefit can reduce taxable income by ₹3-5 lakh in the old regime</li>
        <li>See our <a href="/in/home-loan-calculator">Home Loan Calculator</a> for complete home loan tax benefit computation</li>
    </ul>

    <h2 id="tds-impact">HRA Impact on TDS & Form 12BB</h2>
    <p>Submitting your HRA claim to your employer via <strong>Form 12BB</strong> directly reduces your monthly TDS, increasing your take-home salary. Without Form 12BB, the employer treats all HRA as taxable. Proofs typically need to be submitted by December/January of the financial year. See our <a href="/in/tds-calculator">TDS Calculator</a> for TDS computation on salary.</p>

    <h2 id="rent-optimisation">Rent Optimisation Strategy</h2>
    <p>There is an <strong>optimal rent amount</strong> beyond which paying more rent gives ZERO additional tax benefit. This is because the HRA exemption is the minimum of three rules:</p>
    <ul>
        <li>If your rent is very low, Rule 3 (Rent − 10% of salary) limits the exemption</li>
        <li>As rent increases, the exemption increases until it hits Rule 1 (Actual HRA) or Rule 2 (50%/40% of salary)</li>
        <li>Beyond this point, paying more rent provides NO additional tax benefit</li>
        <li>Use our <strong>Rent Optimiser</strong> (Mode 4 above) to find your exact optimal rent</li>
    </ul>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — HRA is a key differentiator between Old and New Regime. See total tax impact.</li>
        <li><strong><a href="/in/salary-calculator">Salary Calculator</a></strong> — Complete CTC-to-net-salary breakdown including HRA, EPF, TDS, and PT.</li>
        <li><strong><a href="/in/tds-calculator">TDS Calculator</a></strong> — HRA reduces TDS via Form 12BB — understand the flow.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan Calculator</a></strong> — Dual benefit: HRA + Section 24b interest at different locations.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Combine HRA (old regime) + 80C (PPF ₹1.5L) for maximum tax savings.</li>
        <li><strong><a href="/in/nps-calculator">NPS Calculator</a></strong> — 80CCD(2) employer NPS works in BOTH regimes — combine with HRA in old regime.</li>
        <li><strong><a href="/in/professional-tax-calculator">Professional Tax Calculator</a></strong> — Another salary deduction under Section 16(iii).</li>
        <li><strong><a href="/in/capital-gains-tax-calculator">Capital Gains Tax Calculator</a></strong> — If you sell a property, capital gains tax applies separately.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Park your HRA tax savings in FD for additional returns.</li>
        <li><strong><a href="/in/mutual-fund-returns-calculator">Mutual Fund Calculator</a></strong> — Invest tax savings in ELSS for 80C + wealth creation.</li>
    </ul>
`;

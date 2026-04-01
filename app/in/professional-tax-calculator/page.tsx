import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import ProfessionalTaxCalculatorCore from "@/components/calculator/ProfessionalTaxCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Professional Tax Calculator India 2026 — State-wise PT Slabs, Section 16(iii) Deduction & Employer Compliance",
    description: "Free Professional Tax calculator with 4 modes: State-wise PT Calculator (18 states with slab tables), Annual PT & Section 16(iii) Income Tax Impact, PT Comparison Across All States, and Employer PTRC/PTEC Compliance Dashboard. Covers Maharashtra, Karnataka, West Bengal, Gujarat, Tamil Nadu, Telangana, Kerala, AP, and all PT-applicable states. Updated 2026 rates.",
    keywords: ["professional tax calculator", "professional tax India 2026", "PT calculator state wise", "professional tax slab rates", "professional tax Maharashtra", "professional tax Karnataka", "Section 16 iii", "PTRC PTEC", "professional tax exemption", "Article 276", "professional tax deduction income tax", "employer professional tax compliance"],
    alternates: buildCountryAlternates("IN", "/in/professional-tax-calculator", "professional-tax-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is Professional Tax in India?", answer: "Professional Tax (PT) is a state-level tax levied on individuals earning income from salary, profession, trade, or business. It is governed by respective state legislatures under Article 276 of the Indian Constitution. Unlike income tax (which is a central tax), PT is collected by state governments. The maximum PT any state can levy is ₹2,500 per annum. For salaried employees, the employer deducts PT from the monthly salary and deposits it with the state government. Self-employed professionals (doctors, lawyers, CAs, etc.) must pay PT directly." },
    { question: "What is the maximum Professional Tax allowed under Article 276?", answer: "Article 276 of the Constitution of India empowers state governments to levy professional tax but explicitly caps it at ₹2,500 per financial year per individual. No state can charge more than this amount. This is why you'll see many states charging ₹200/month (₹2,400/year) with a higher deduction of ₹300 in one month (usually February) to reach exactly ₹2,500. Some states like Tamil Nadu and Kerala calculate PT on a half-yearly basis but still stay within the ₹2,500 annual cap." },
    { question: "Which states in India charge Professional Tax?", answer: "As of 2026, the following states and union territories levy Professional Tax: Maharashtra, Karnataka, West Bengal, Gujarat, Andhra Pradesh, Telangana, Tamil Nadu, Kerala, Madhya Pradesh, Odisha, Assam, Meghalaya, Jharkhand, Bihar, Sikkim, Tripura, Chhattisgarh, Manipur, Mizoram, Nagaland, and Puducherry. Each state has its own slab rates and exemption thresholds. Use our calculator's 'Compare States' mode to see rates for your salary across all states." },
    { question: "Which states do NOT charge Professional Tax?", answer: "The following states and union territories do NOT levy Professional Tax: Delhi, Haryana, Rajasthan, Uttar Pradesh, Punjab, Uttarakhand, Himachal Pradesh, Goa, Jammu & Kashmir, Arunachal Pradesh, Chandigarh, Ladakh, Lakshadweep, Andaman & Nicobar Islands, and Dadra & Nagar Haveli and Daman & Diu. If you work in any of these states, your payslip will not show any PT deduction." },
    { question: "How is Professional Tax calculated on salary?", answer: "Professional Tax is calculated based on your monthly gross salary and the slab rates of the state where you work. Each state defines salary brackets with corresponding PT amounts. For example, in Maharashtra: salary up to ₹7,500 = Nil, ₹7,501–₹10,000 = ₹175/month, above ₹10,000 = ₹200/month. Some states like Tamil Nadu and Kerala calculate on a half-yearly basis. The total annual PT cannot exceed ₹2,500 regardless of the state." },
    { question: "Why is February PT ₹300 in Maharashtra and Karnataka?", answer: "In states like Maharashtra and Karnataka, the standard monthly PT is ₹200. Over 11 months (April–February), this equals ₹2,200. To reach the annual cap of ₹2,500, an extra ₹100 is added in February, making the February deduction ₹300. This is called the 'February adjustment' or 'balancing figure.' It ensures the total annual deduction equals exactly ₹2,500 (11 × ₹200 + 1 × ₹300 = ₹2,500)." },
    { question: "Is Professional Tax deductible under income tax?", answer: "Yes. Professional Tax paid during the financial year is fully deductible from your gross salary under Section 16(iii) of the Income Tax Act, 1961. This deduction is available under BOTH the Old and New Tax Regimes. For example, if you pay ₹2,500 PT annually and are in the 30% tax bracket, you save approximately ₹780 in income tax (₹2,500 × 31.2% including 4% cess). The PT deduction is automatic — your employer shows it as a salary deduction on Form 16." },
    { question: "What is the difference between PTRC and PTEC?", answer: "PTRC (Professional Tax Registration Certificate) is required by employers who deduct PT from their employees' salaries. They must register within 30 days of hiring staff and file periodic returns (monthly for 20+ employees, annually otherwise). PTEC (Professional Tax Enrolment Certificate) is required by self-employed individuals, directors, partners, and proprietors to pay their own PT. PTEC holders make an annual payment, usually by June 30. Both registrations are specific to each state where the business operates." },
    { question: "Who is exempt from paying Professional Tax?", answer: "Exemptions vary by state but commonly include: (1) Senior citizens aged 65+ years (Maharashtra, Karnataka). (2) Persons with 40%+ disability (most states). (3) Parents/guardians of children with mental or physical disabilities. (4) Members of the Armed Forces. (5) Women earning below a threshold — e.g., women earning ≤ ₹25,000/month in Maharashtra. (6) Badli workers in the textile industry (Maharashtra). (7) Individuals earning below the state-specific exemption threshold (varies from ₹7,500 to ₹25,000)." },
    { question: "Do self-employed professionals have to pay PT?", answer: "Yes. Self-employed professionals (doctors, lawyers, chartered accountants, architects, consultants, freelancers, etc.) must pay Professional Tax if they work in a state that levies it AND their income exceeds the exemption threshold. They need to obtain a PTEC (Professional Tax Enrolment Certificate) from the state's commercial tax department and pay the applicable PT directly — it is not deducted by an employer. The amount depends on the state's slab for their income level, but the maximum remains ₹2,500/year." },
    { question: "What is the penalty for not paying Professional Tax?", answer: "Penalties for PT non-compliance vary by state but generally include: (1) Late payment interest — 1% to 1.25% per month on the outstanding PT amount. (2) Non-filing/late filing penalty — 10% of the tax amount, or a fixed penalty of ₹1,000–₹2,000. (3) Late registration penalty — ₹5/day until registration is completed. (4) In some states, continued non-compliance can lead to prosecution under the state's PT Act. Employers face stricter penalties as they are responsible for collecting and depositing PT on behalf of employees." },
    { question: "Is Professional Tax applicable under the New Tax Regime?", answer: "Yes, Professional Tax deduction under Section 16(iii) is available under BOTH the Old Tax Regime and New Tax Regime. This is one of the few deductions that survived the transition to the new regime. Your employer will continue to deduct PT from your salary regardless of your chosen tax regime, and the deducted amount will reduce your taxable salary income in both cases." },
    { question: "How do I register for Professional Tax as an employer?", answer: "To register for PTRC: (1) Visit the commercial tax department website of the state where your employees work. (2) Fill out the registration form (usually online via state GST portal or dedicated PT portal). (3) Submit supporting documents: PAN, Aadhaar, business registration, address proof. (4) Pay the registration fee (if applicable). (5) Receive your PTRC number. Registration must be completed within 30 days of employing staff. If you have offices in multiple PT-applicable states, you need separate PTRC registrations for each state." },
    { question: "Can I get a refund of Professional Tax?", answer: "Generally, Professional Tax is a statutory deduction and is NOT refundable once paid. However, in cases of excess deduction (e.g., if PT was incorrectly deducted for a month when you were exempt), you can claim adjustment from your employer or file a correction with the state commercial tax department. If PT was deducted more than the ₹2,500 annual cap, the excess should be adjusted by your employer. PT paid is always deductible under Section 16(iii) from income tax, which provides indirect financial relief." },
    { question: "Is Professional Tax applicable on contract workers?", answer: "It depends on the nature of the engagement. If a contract worker is treated as an 'employee' under the state's PT Act (i.e., they receive a salary-like payment and work under the direction of the employer), then PT may apply and the principal employer or contractor must deduct it. However, if the worker is genuinely self-employed or running their own business, they would need their own PTEC and pay PT independently. The classification varies by state and the specific terms of the contract." },
];

export default function ProfessionalTaxCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Professional Tax Calculator" },
        ]),
        webAppSchema("Professional Tax Calculator India 2026", canonicalUrl("/in/professional-tax-calculator")),
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
            <Script id="schema-pt" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Professional Tax Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Professional Tax Calculator India 2026</h1>
            <PageDesc>
                Free Professional Tax calculator with 4 modes: State-wise PT Calculator covering 18 states with detailed slab tables (Maharashtra, Karnataka, West Bengal, Gujarat, Tamil Nadu, Telangana, Kerala, AP and more), Annual PT &amp; Section 16(iii) Income Tax Impact calculator, PT Comparison Across All States, and Employer PTRC/PTEC Compliance Dashboard with penalty estimation. Updated for 2026 state-wise rates and Article 276 constitutional limits.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <ProfessionalTaxCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Professional Tax Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "Old vs New Regime — see how PT deduction under Section 16(iii) reduces your taxable income" },
    { href: "/in/hra-calculator", icon: "🏠", title: "HRA Calculator", desc: "Salary structure — understand gross salary, Basic + DA, and all payslip deductions" },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "TDS on salary — PT is deducted before TDS, affecting your net take-home" },
    { href: "/in/salary-calculator", icon: "💰", title: "Salary Calculator", desc: "Net take-home salary after PT, TDS, EPF, and all statutory deductions" },
    { href: "/in/gratuity-calculator", icon: "🎁", title: "Gratuity Calculator", desc: "Complete employee benefits stack: Gratuity + EPF + NPS alongside PT" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "80CCD deductions work alongside PT under Section 16(iii)" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "Tax-saving instruments that complement PT deduction planning" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Corpus Calculator", desc: "Total salary deductions impact on retirement savings" },
    { href: "/in/fire-calculator", icon: "🔥", title: "FIRE Calculator", desc: "Financial independence planning with salary deductions factored in" },
    { href: "/in/sip-calculator", icon: "📈", title: "SIP Calculator", desc: "Invest the tax savings from Section 16(iii) deduction" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Bank FD returns — alternative to PT savings investment" },
    { href: "/in/compound-interest-calculator", icon: "📊", title: "Compound Interest Calculator", desc: "Visualise the power of investing PT tax savings" },
    { href: "/in/business-loan-emi-calculator", icon: "🏢", title: "Business Loan EMI Calculator", desc: "Self-employed PT payers — business loan planning" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-professional-tax">What is Professional Tax in India?</h2>
    <p><strong>Professional Tax (PT)</strong> is a state-level tax levied on income earned from employment, trade, profession, or calling in India. Unlike <strong>Income Tax</strong> — which is a central government levy — Professional Tax is collected by individual <strong>state governments</strong> and governed by their respective state legislatures.</p>
    <p>The term &ldquo;professional&rdquo; is misleading — PT applies to <strong>ALL salaried employees</strong> (not just professionals) and also to self-employed individuals such as doctors, lawyers, chartered accountants, architects, and freelancers. For salaried employees, the employer is legally responsible for deducting PT from the monthly salary and depositing it with the state government.</p>
    <div class="explanation__highlight">
        <strong>Key Point:</strong> Professional Tax is a mandatory payroll deduction that appears on your <strong>payslip</strong> every month. The good news? It is fully deductible from your taxable income under <strong>Section 16(iii)</strong> of the Income Tax Act — available under BOTH Old and New Tax Regimes. Use our calculator above to see the exact impact on your take-home salary.
    </div>

    <h2 id="article-276">Article 276 — Constitutional Basis of Professional Tax</h2>
    <p><strong>Article 276 of the Indian Constitution</strong> is the legal foundation for Professional Tax. Key provisions:</p>
    <ul>
        <li><strong>Empowers states</strong> to levy taxes on professions, trades, callings, and employments</li>
        <li><strong>Maximum cap of ₹2,500 per annum</strong> — no state can charge more than this amount per person per year</li>
        <li>The tax is completely <strong>separate from central Income Tax</strong></li>
        <li>States are <strong>free to set their own slab rates</strong> within the ₹2,500 cap</li>
        <li>Not all states have chosen to levy PT — it is <strong>optional</strong> for states</li>
    </ul>
    <p>This constitutional provision ensures that while states can generate revenue from professional activities, the burden on individuals remains modest. The ₹2,500 cap was set when Article 276 was amended in 1988 (increased from ₹250 to ₹2,500). There have been periodic discussions about raising this cap, but as of 2026 it remains at ₹2,500.</p>

    <h2 id="state-wise-slabs">Professional Tax Slab Rates — All States 2026</h2>
    <h3>Maharashtra</h3>
    <table>
        <thead><tr><th>Monthly Salary</th><th>Male PT</th><th>Female PT</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹7,500</td><td>Nil</td><td>Nil</td></tr>
            <tr><td>₹7,501 – ₹10,000</td><td>₹175/month</td><td>Nil</td></tr>
            <tr><td>Above ₹10,000</td><td>₹200/month (₹300 in Feb)</td><td>Nil (if ≤ ₹25,000)</td></tr>
            <tr><td>Above ₹25,000</td><td>₹200/month (₹300 in Feb)</td><td>₹200/month (₹300 in Feb)</td></tr>
        </tbody>
    </table>
    <p><strong>Maharashtra is unique:</strong> It has a <strong>gender-based exemption</strong> — women earning up to ₹25,000/month are completely exempt from PT. This is not available in any other state. The ₹300 deduction in February is a &ldquo;balancing figure&rdquo; to ensure the annual total equals exactly ₹2,500.</p>

    <h3>Karnataka</h3>
    <table>
        <thead><tr><th>Monthly Salary</th><th>PT Amount</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹15,000</td><td>Nil</td></tr>
            <tr><td>₹15,001 – ₹25,000</td><td>₹150/month</td></tr>
            <tr><td>Above ₹25,000</td><td>₹200/month (₹300 in Feb)</td></tr>
        </tbody>
    </table>

    <h3>West Bengal</h3>
    <table>
        <thead><tr><th>Monthly Salary</th><th>PT Amount</th></tr></thead>
        <tbody>
            <tr><td>Up to ₹10,000</td><td>Nil</td></tr>
            <tr><td>₹10,001 – ₹15,000</td><td>₹110/month</td></tr>
            <tr><td>₹15,001 – ₹25,000</td><td>₹130/month</td></tr>
            <tr><td>₹25,001 – ₹40,000</td><td>₹150/month</td></tr>
            <tr><td>Above ₹40,000</td><td>₹200/month</td></tr>
        </tbody>
    </table>
    <p>West Bengal has the <strong>most granular slab structure</strong> with 5 brackets — giving a more progressive tax treatment compared to states with only 2-3 slabs.</p>

    <h3>Gujarat, Andhra Pradesh & Telangana</h3>
    <table>
        <thead><tr><th>State</th><th>Exemption Threshold</th><th>Above Threshold</th></tr></thead>
        <tbody>
            <tr><td><strong>Gujarat</strong></td><td>Up to ₹12,000 — Nil</td><td>₹200/month</td></tr>
            <tr><td><strong>Andhra Pradesh</strong></td><td>Up to ₹15,000 — Nil</td><td>₹15K–₹20K: ₹150, Above ₹20K: ₹200</td></tr>
            <tr><td><strong>Telangana</strong></td><td>Up to ₹15,000 — Nil</td><td>₹15K–₹20K: ₹150, Above ₹20K: ₹200</td></tr>
        </tbody>
    </table>
    <p>Gujarat has the simplest structure — a straight ₹200/month for anyone earning above ₹12,000. AP and Telangana mirror each other (pre-bifurcation framework). Calculate your exact PT for any of these states using our <strong>State-wise PT Calculator</strong> above.</p>

    <h3>Tamil Nadu & Kerala (Half-Yearly)</h3>
    <p>These two states calculate PT on a <strong>half-yearly basis</strong> rather than monthly. Tamil Nadu has 6 slabs ranging from Nil (below ₹21,000/half-year) to ₹1,250/half-year (above ₹75,000). Kerala has a more detailed 9-slab structure. In both cases, the annual total stays within the ₹2,500 constitutional cap.</p>

    <h2 id="no-pt-states">States Where Professional Tax is NOT Applicable</h2>
    <p>The following states and union territories <strong>do NOT levy Professional Tax</strong>:</p>
    <table>
        <thead><tr><th>State/UT</th><th>Region</th></tr></thead>
        <tbody>
            <tr><td>Delhi</td><td>North India</td></tr>
            <tr><td>Haryana</td><td>North India</td></tr>
            <tr><td>Rajasthan</td><td>North India</td></tr>
            <tr><td>Uttar Pradesh</td><td>North India</td></tr>
            <tr><td>Punjab</td><td>North India</td></tr>
            <tr><td>Uttarakhand</td><td>North India</td></tr>
            <tr><td>Himachal Pradesh</td><td>North India</td></tr>
            <tr><td>Goa</td><td>West India</td></tr>
            <tr><td>Jammu & Kashmir</td><td>North India</td></tr>
            <tr><td>Arunachal Pradesh</td><td>Northeast India</td></tr>
            <tr><td>Chandigarh</td><td>Union Territory</td></tr>
            <tr><td>Ladakh</td><td>Union Territory</td></tr>
            <tr><td>Lakshadweep</td><td>Union Territory</td></tr>
            <tr><td>Andaman & Nicobar</td><td>Union Territory</td></tr>
            <tr><td>Dadra & Nagar Haveli and Daman & Diu</td><td>Union Territory</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important for Multi-State Employers:</strong> If your company has offices in both PT-applicable states (like Maharashtra) and non-applicable states (like Delhi), you must register for PTRC and deduct PT <strong>only for employees working in PT-applicable states</strong>. Delhi employees will not have PT deducted. Use our <a href="/in/salary-calculator">Salary Calculator</a> to see the net take-home difference.
    </div>

    <h2 id="who-pays">Who Has to Pay Professional Tax?</h2>
    <table>
        <thead><tr><th>Category</th><th>PT Responsibility</th><th>Registration</th></tr></thead>
        <tbody>
            <tr><td><strong>Salaried Employees</strong></td><td>Employer deducts from salary</td><td>Employer holds PTRC</td></tr>
            <tr><td><strong>Doctors, Lawyers, CAs</strong></td><td>Self-pay directly to state</td><td>Need PTEC</td></tr>
            <tr><td><strong>Freelancers & Consultants</strong></td><td>Self-pay if income exceeds threshold</td><td>Need PTEC</td></tr>
            <tr><td><strong>Business Owners</strong></td><td>Self-pay + deduct for employees</td><td>Need PTEC + PTRC for employees</td></tr>
            <tr><td><strong>Company Directors</strong></td><td>Company deducts (treated as employee)</td><td>Company holds PTRC</td></tr>
            <tr><td><strong>Partners in Firms</strong></td><td>Self-pay based on firm income</td><td>Need PTEC</td></tr>
        </tbody>
    </table>

    <h2 id="ptrc-ptec">PTRC vs PTEC — Registration Guide</h2>
    <table>
        <thead><tr><th>Feature</th><th>PTRC (Employer Certificate)</th><th>PTEC (Self-Enrolment)</th></tr></thead>
        <tbody>
            <tr><td><strong>Full Form</strong></td><td>Professional Tax Registration Certificate</td><td>Professional Tax Enrolment Certificate</td></tr>
            <tr><td><strong>Who Needs It</strong></td><td>Employers deducting PT from employees</td><td>Self-employed professionals, directors, partners</td></tr>
            <tr><td><strong>Registration Timeline</strong></td><td>Within 30 days of hiring first employee</td><td>Within 30 days of starting profession/business</td></tr>
            <tr><td><strong>Filing Frequency</strong></td><td>Monthly (if 20+ employees), else Annual</td><td>Annual payment only</td></tr>
            <tr><td><strong>Due Date</strong></td><td>15th of the following month</td><td>30th June of each financial year</td></tr>
            <tr><td><strong>Documents Needed</strong></td><td>PAN, Aadhaar, Business registration, Address proof</td><td>PAN, Aadhaar, Professional qualification certificate</td></tr>
            <tr><td><strong>State-Specific</strong></td><td>Yes — separate registration per state</td><td>Yes — register in state of practice</td></tr>
        </tbody>
    </table>
    <p><strong>Key Compliance Point:</strong> If your business operates in multiple states that levy PT, you need <strong>separate PTRC registrations</strong> for each state. Many payroll software solutions handle multi-state PT compliance automatically.</p>

    <h2 id="due-dates">PT Due Dates & Filing — State-wise</h2>
    <table>
        <thead><tr><th>State</th><th>Filing Frequency</th><th>Due Date</th><th>Annual Return</th></tr></thead>
        <tbody>
            <tr><td>Maharashtra</td><td>Monthly (if 20+ employees)</td><td>15th of following month</td><td>15th March</td></tr>
            <tr><td>Karnataka</td><td>Monthly</td><td>20th of following month</td><td>30th April</td></tr>
            <tr><td>West Bengal</td><td>Monthly</td><td>21st of following month</td><td>31st March</td></tr>
            <tr><td>Gujarat</td><td>Monthly/Annually</td><td>15th of following month</td><td>31st March</td></tr>
            <tr><td>Tamil Nadu</td><td>Half-Yearly</td><td>30th Sept / 31st March</td><td>N/A</td></tr>
            <tr><td>Telangana</td><td>Monthly</td><td>15th of following month</td><td>31st March</td></tr>
            <tr><td>Kerala</td><td>Half-Yearly</td><td>Within 30 days of half-year end</td><td>N/A</td></tr>
        </tbody>
    </table>
    <p>Use our <strong>Employer Compliance Dashboard</strong> (Mode 4 above) to calculate your total monthly PT liability and understand filing requirements.</p>

    <h2 id="exemptions">Professional Tax Exemptions</h2>
    <table>
        <thead><tr><th>Exemption Category</th><th>Applicable States</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Senior Citizens (65+)</strong></td><td>Maharashtra, Karnataka, most states</td><td>Fully exempt from PT</td></tr>
            <tr><td><strong>Persons with 40%+ Disability</strong></td><td>All PT-applicable states</td><td>Exempt as per PwD Act</td></tr>
            <tr><td><strong>Parents of Disabled Children</strong></td><td>Maharashtra, Karnataka</td><td>Mental or physical disability</td></tr>
            <tr><td><strong>Women Below Threshold</strong></td><td>Maharashtra (≤ ₹25,000/month)</td><td>Gender-specific exemption</td></tr>
            <tr><td><strong>Armed Forces</strong></td><td>Maharashtra, most states</td><td>Military personnel exempt</td></tr>
            <tr><td><strong>Badli Workers</strong></td><td>Maharashtra</td><td>Textile industry workers</td></tr>
            <tr><td><strong>Below Minimum Slab</strong></td><td>All states</td><td>₹7,500–₹25,000 depending on state</td></tr>
        </tbody>
    </table>

    <h2 id="section-16-iii">Section 16(iii) — PT Deduction from Income Tax</h2>
    <p>Under <strong>Section 16(iii) of the Income Tax Act, 1961</strong>, the Professional Tax paid during the financial year is allowed as a <strong>deduction from gross salary</strong>. This means PT reduces your taxable income, effectively giving you a tax benefit.</p>
    <h3>How Section 16(iii) Works — Worked Example</h3>
    <table>
        <thead><tr><th>Component</th><th>Without PT Deduction</th><th>With PT Deduction</th></tr></thead>
        <tbody>
            <tr><td>Gross Salary</td><td>₹12,00,000</td><td>₹12,00,000</td></tr>
            <tr><td>Standard Deduction (₹75,000)</td><td>₹11,25,000</td><td>₹11,25,000</td></tr>
            <tr><td>Section 16(iii) PT Deduction</td><td>—</td><td>−₹2,500</td></tr>
            <tr><td><strong>Net Taxable Salary</strong></td><td>₹11,25,000</td><td><strong>₹11,22,500</strong></td></tr>
            <tr><td>Tax Saved (at 30% + 4% cess)</td><td>—</td><td><strong>₹780</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Available Under Both Regimes:</strong> Unlike many deductions that were removed under the New Tax Regime, the PT deduction under Section 16(iii) is available under <strong>BOTH Old and New Tax Regimes</strong>. This makes it one of the few universal salary deductions. See our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to model the full impact.
    </div>

    <h2 id="self-employed">Professional Tax for Self-Employed Professionals</h2>
    <p>If you are a self-employed professional (doctor, lawyer, CA, architect, consultant, freelancer) working in a PT-applicable state, you must:</p>
    <ol>
        <li><strong>Obtain a PTEC</strong> from the state&rsquo;s commercial tax department within 30 days of starting your practice</li>
        <li><strong>Assess your income</strong> against the state&rsquo;s PT slabs — some states use monthly income, others use annual income</li>
        <li><strong>Pay PT directly</strong> to the state government — usually through the state&rsquo;s online portal</li>
        <li><strong>File annual returns</strong> by the due date (usually 30th June)</li>
        <li><strong>Claim Section 16(iii) deduction</strong> when filing your Income Tax Return</li>
    </ol>
    <p>Common self-employed PT rates: Most states charge the maximum ₹200/month (₹2,500/year) for income above their threshold. Use our <a href="/in/business-loan-emi-calculator">Business Loan EMI Calculator</a> if you also need financing for your professional practice.</p>

    <h2 id="formula">PT Calculator Formula & Worked Example</h2>
    <p>Professional Tax isn&rsquo;t &ldquo;calculated&rdquo; using a formula per se — it follows a <strong>slab-based lookup</strong>:</p>
    <div class="explanation__highlight">
        <strong>Step 1:</strong> Identify your state<br>
        <strong>Step 2:</strong> Find your monthly gross salary<br>
        <strong>Step 3:</strong> Match salary to the applicable slab<br>
        <strong>Step 4:</strong> The slab amount = your monthly PT<br>
        <strong>Step 5:</strong> Annual PT = Monthly PT × 12 (with February adjustment if applicable)
    </div>
    <h3>Worked Example — Maharashtra (Male, ₹45,000/month)</h3>
    <table>
        <thead><tr><th>Component</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Monthly Gross Salary</td><td>₹45,000</td></tr>
            <tr><td>Maharashtra Slab (Above ₹10,000)</td><td>₹200/month</td></tr>
            <tr><td>April to January (10 months)</td><td>₹200 × 10 = ₹2,000</td></tr>
            <tr><td>February (adjusted)</td><td>₹300</td></tr>
            <tr><td>March</td><td>₹200</td></tr>
            <tr><td><strong>Total Annual PT</strong></td><td><strong>₹2,500</strong></td></tr>
            <tr><td>Section 16(iii) Tax Saving (30% slab)</td><td>₹780/year</td></tr>
            <tr><td>Effective Annual PT Cost</td><td>₹1,720</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to see what investing the ₹780 annual tax saving from PT deduction would grow into over 20–30 years.</p>

    <h2 id="penalties">Penalties for Professional Tax Non-Compliance</h2>
    <table>
        <thead><tr><th>Violation</th><th>Penalty</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Late Registration</strong></td><td>₹5/day</td><td>Until PTRC/PTEC registration completed</td></tr>
            <tr><td><strong>Late Payment</strong></td><td>1%–1.25% per month</td><td>Interest on outstanding PT amount</td></tr>
            <tr><td><strong>Non-Filing of Return</strong></td><td>10% of tax or ₹1,000–₹2,000</td><td>Whichever is higher</td></tr>
            <tr><td><strong>Under-Reporting</strong></td><td>Up to 25% of shortfall</td><td>Difference between actual and reported PT</td></tr>
            <tr><td><strong>Continued Default</strong></td><td>Prosecution under state PT Act</td><td>For persistent non-compliance</td></tr>
        </tbody>
    </table>

    <h2 id="payslip">PT on Your Payslip — How to Read It</h2>
    <p>On a standard Indian payslip, Professional Tax appears as a <strong>deduction</strong> (not an earning). It is typically listed alongside other statutory deductions such as:</p>
    <ul>
        <li><strong>EPF (Employee Provident Fund)</strong> — 12% of Basic + DA</li>
        <li><strong>ESI (Employees&rsquo; State Insurance)</strong> — 0.75% of gross salary (if applicable)</li>
        <li><strong>TDS (Tax Deducted at Source)</strong> — based on your projected annual tax</li>
        <li><strong>Professional Tax</strong> — ₹150–₹200/month depending on state and salary</li>
    </ul>
    <p>Your <strong>net take-home salary</strong> = Gross Salary − (EPF + ESI + TDS + PT + other deductions). Use our <a href="/in/salary-calculator">Salary Calculator</a> to compute your exact net salary after all deductions, or our <a href="/in/hra-calculator">HRA Calculator</a> to understand the full salary structure.</p>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Old vs New Regime, see how PT deduction under Section 16(iii) reduces your taxable income.</li>
        <li><strong><a href="/in/hra-calculator">HRA Calculator</a></strong> — Understand your full salary structure: Basic + DA, HRA, and all deductions including PT.</li>
        <li><strong><a href="/in/tds-calculator">TDS Calculator</a></strong> — PT is deducted before TDS computation — see how they interact.</li>
        <li><strong><a href="/in/salary-calculator">Salary Calculator</a></strong> — Compute net take-home salary after PT, EPF, ESI, TDS, and all statutory deductions.</li>
        <li><strong><a href="/in/gratuity-calculator">Gratuity Calculator</a></strong> — Complete employee benefits stack alongside PT.</li>
        <li><strong><a href="/in/nps-calculator">NPS Calculator</a></strong> — NPS 80CCD deductions work alongside PT deduction under Section 16.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Tax-saving instruments that complement PT deduction planning.</li>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></strong> — Factor in all salary deductions (PT, EPF, NPS) for retirement planning.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Invest your Section 16(iii) tax savings via SIP.</li>
        <li><strong><a href="/in/fire-calculator">FIRE Calculator</a></strong> — Financial independence planning with salary deductions factored in.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Compare FD returns with PT cost.</li>
    </ul>
`;

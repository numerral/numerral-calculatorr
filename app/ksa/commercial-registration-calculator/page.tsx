// Standalone page — /ksa/commercial-registration-calculator
// KSA Commercial Registration Fee Calculator with educational content

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
    title: "Commercial Registration Fee Calculator (KSA) — حاسبة رسوم السجل التجاري",
    description: "Calculate total commercial registration (CR) cost in Saudi Arabia for 2026. Covers all entity types, Chamber of Commerce, municipality license, MISA fees for foreign investors, sub-CRs, and late penalties.",
    keywords: ["commercial registration fee calculator Saudi Arabia", "حاسبة رسوم السجل التجاري", "CR fee KSA 2026", "LLC registration cost Saudi", "Chamber of Commerce fee KSA", "MISA license fee", "business registration Saudi Arabia", "Sijil commercial registration", "sole proprietorship fee KSA"],
    alternates: { canonical: canonicalUrl("/ksa/commercial-registration-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much does commercial registration cost in Saudi Arabia?", answer: "CR fees vary by entity type: Sole Proprietorship SAR 500/year, LLC SAR 1,200/year (initial SAR 6,000), General/Limited Partnership SAR 1,000/year, Simplified Joint Stock Company SAR 1,600/year, and Foreign Company Branch SAR 2,000/year. Additional costs include Chamber of Commerce membership (SAR 1,000–5,000), municipality license (SAR 500–5,000), and MISA fees for foreign investors." },
    { question: "What is the annual CR renewal fee for an LLC?", answer: "The annual renewal (confirmation) fee for an LLC in Saudi Arabia is SAR 1,200. You may also need to pay SAR 500 for articles of association publication, SAR 300 per additional activity, and SAR 100 per sub-CR. Chamber of Commerce membership (SAR 1,000–5,000) and municipality license are additional annual costs." },
    { question: "What is the Chamber of Commerce fee?", answer: "Chamber of Commerce membership is mandatory for all businesses. Fees are tiered: Category A (capital >SAR 1M or 250+ employees) = SAR 5,000/year, Category B (SAR 375K–1M capital or 50–249 employees) = SAR 2,000/year, Category C/D (<SAR 375K capital or <50 employees) = SAR 1,000/year." },
    { question: "What is the MISA license fee for foreign investors?", answer: "For foreign investors, the Ministry of Investment (MISA) charges an annual service fee of SAR 2,000 and a one-time first-year investor relations center subscription of SAR 10,000. The previous issuance fee (SAR 12,000) and renewal fee (SAR 62,000) have been suspended as of 2026 to encourage foreign investment." },
    { question: "What is a sub-CR and how much does it cost?", answer: "A sub-commercial register (sub-CR) is an additional registration for a branch or secondary business activity under your main CR. Each sub-CR costs SAR 100 per year. Businesses with multiple locations or distinct activity lines may need multiple sub-CRs." },
    { question: "What happens if I don't renew my CR on time?", answer: "Late renewal penalties: (1) Late fee of 25% of the renewal amount, (2) CR suspended after 90 days overdue — you cannot conduct business, (3) CR cancelled after 1 year overdue — requires re-registration. Always confirm your CR annually on the Ministry of Commerce portal." },
    { question: "How do I register a commercial registration online?", answer: "Steps: (1) Visit mc.gov.sa or use the Sijil app, (2) Create an account and verify identity via Absher, (3) Select entity type and business activities (ISIC codes), (4) Submit required documents (national ID, articles of association for LLCs), (5) Pay fees via SADAD, (6) Receive digital CR — no physical office visit needed." },
    { question: "What is the difference between CR issuance and annual confirmation?", answer: "From April 2025, the Ministry of Commerce replaced the traditional 'renewal' process with 'annual confirmation.' Instead of renewing, you confirm and update your CR information annually. The fee structure remains similar, but the process now requires verifying that all company data is current." },
    { question: "What is the municipality license (Baladiya)?", answer: "A municipality license is required to operate a physical business location. It's issued by the local Baladiya (municipality) and costs SAR 500–5,000 annually depending on business type, size, and location. Small offices pay around SAR 750, medium commercial establishments around SAR 2,000, and large/industrial operations up to SAR 4,000–5,000." },
    { question: "What entity types are available in Saudi Arabia?", answer: "Saudi Arabia's Companies Law offers several entity types: Sole Proprietorship (simplest, full personal liability), LLC (most popular, limited liability), General Partnership (partners share liability), Limited Partnership (general + limited partners), Simplified Joint Stock Company (for larger ventures), and Professional Company (for licensed professions like law, medicine)." },
    { question: "What is the minimum capital for an LLC?", answer: "Under the current Companies Law, the minimum declared capital for an LLC is SAR 25,000, though this may not require an upfront deposit during initial incorporation. For foreign-owned LLCs, the practical minimum capital requirement is typically SAR 500,000, and some industries may require higher capital." },
    { question: "Do I need Saudization compliance for CR?", answer: "Yes. To maintain an active CR, your business must comply with Saudization (Nitaqat) requirements. Companies in the Red zone may face restrictions on CR renewals, visa issuance, and government services. Use our Saudization Calculator to check your compliance status." },
    { question: "What documents are needed for CR registration?", answer: "Required documents: (1) National ID or Iqama, (2) Articles of Association (for LLCs/partnerships), (3) National address registration (Subul), (4) MISA license (for foreign investors), (5) Professional license (if applicable), (6) Lease contract for business premises, (7) Chamber of Commerce membership proof." },
    { question: "Can I have multiple CRs?", answer: "Yes. A single person or company can hold multiple commercial registrations for different business activities. Each main CR costs the standard fee for its entity type, and each sub-CR costs an additional SAR 100/year. Multiple CRs are common for businesses operating in different sectors or locations." },
    { question: "How does VAT apply to CR fees?", answer: "Government fees for CR issuance, renewal, and Chamber of Commerce membership are generally exempt from VAT. However, professional services related to CR (legal, accounting, consulting) are subject to 15% VAT. Use our VAT Calculator to compute VAT on business services." },
];

export default function CommercialRegistrationPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Commercial Registration Fee Calculator" },
        ]),
        webAppSchema("Commercial Registration Fee Calculator (KSA)", canonicalUrl("/ksa/commercial-registration-calculator")),
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
            <Script id="schema-cr" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Commercial Registration Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Commercial Registration Fee Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the total cost of issuing or renewing your commercial registration (السجل التجاري)
                in Saudi Arabia for 2025/2026. Get a complete breakdown including CR fee, Chamber of Commerce,
                municipality license, MISA fees, sub-CRs, and additional activities.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="crfee" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Commercial Registration Fee FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/saudization-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">📊</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Saudization Calculator</div>
                            <div className="ksa-related-link__desc">CR requires Nitaqat compliance</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator</div>
                            <div className="ksa-related-link__desc">VAT on business services</div>
                        </div>
                    </Link>
                    <Link href="/ksa/iqama-renewal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">📋</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Iqama Renewal Calculator</div>
                            <div className="ksa-related-link__desc">Employee Iqama costs for your business</div>
                        </div>
                    </Link>
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Employee salary planning</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-cr">What Is a Commercial Registration (السجل التجاري)?</h2>
    <p>A <strong>Commercial Registration (CR)</strong> — known as <strong>السجل التجاري</strong> (As-Sijil At-Tijari) — is the official license issued by the <strong>Ministry of Commerce (MOCI)</strong> that authorizes businesses to conduct commercial activities in the Kingdom of Saudi Arabia. It is the foundational legal document for any business entity and is required before you can:</p>
    <ul>
        <li><strong>Open business bank accounts</strong></li>
        <li><strong>Sign commercial contracts</strong></li>
        <li><strong>Issue invoices and collect payments</strong></li>
        <li><strong>Register for VAT</strong> with ZATCA (use our <a href="/ksa/vat-calculator">VAT Calculator</a>)</li>
        <li><strong>Sponsor employees</strong> and issue <a href="/ksa/iqama-renewal-calculator">Iqamas</a></li>
        <li><strong>Bid on government contracts</strong></li>
        <li><strong>Import and export goods</strong></li>
    </ul>
    <div class="explanation__highlight">
        <strong>April 2025 Change:</strong> The MOCI replaced the traditional CR "renewal" with <strong>annual confirmation</strong>. Businesses must now confirm and update their CR data annually on the issuance anniversary. Fees remain similar, but you must verify company information is current.
    </div>

    <h2 id="entity-types">Types of Business Entities in KSA</h2>
    <p>Saudi Arabia's <strong>Companies Law</strong> offers several entity structures, each with different CR fees, liability exposure, and capital requirements:</p>
    <table>
        <thead><tr><th>Entity Type</th><th>CR Fee (Annual)</th><th>Initial Fee</th><th>Liability</th><th>Min Capital</th></tr></thead>
        <tbody>
            <tr><td><strong>Sole Proprietorship</strong></td><td>SAR 500</td><td>SAR 500</td><td>Unlimited personal</td><td>None</td></tr>
            <tr><td><strong>LLC</strong></td><td>SAR 1,200</td><td>SAR 6,000</td><td>Limited to capital</td><td>SAR 25,000</td></tr>
            <tr><td><strong>General Partnership</strong></td><td>SAR 1,000</td><td>SAR 1,000</td><td>Unlimited joint</td><td>None</td></tr>
            <tr><td><strong>Limited Partnership</strong></td><td>SAR 1,000</td><td>SAR 1,000</td><td>Mixed</td><td>None</td></tr>
            <tr><td><strong>Simplified Joint Stock</strong></td><td>SAR 1,600</td><td>SAR 1,600</td><td>Limited to shares</td><td>SAR 500,000</td></tr>
            <tr><td><strong>Foreign Branch</strong></td><td>SAR 2,000</td><td>SAR 2,000</td><td>Parent company</td><td>SAR 500,000</td></tr>
        </tbody>
    </table>

    <h3>Which Entity Type Should You Choose?</h3>
    <ul>
        <li><strong>Freelancers and solo entrepreneurs</strong> → Sole Proprietorship (SAR 500/year, simplest setup)</li>
        <li><strong>Small to medium businesses</strong> → LLC (most popular, liability protection, SAR 1,200/year)</li>
        <li><strong>Professional services</strong> → Professional LLC (law firms, medical practices, engineering)</li>
        <li><strong>Multiple partners</strong> → Partnership (general or limited based on liability preference)</li>
        <li><strong>Larger ventures seeking investment</strong> → Simplified Joint Stock Company</li>
        <li><strong>International companies expanding to KSA</strong> → Foreign Branch (requires MISA license)</li>
    </ul>

    <h2 id="fee-breakdown">Complete CR Fee Breakdown (2025/2026)</h2>
    <h3>1. Base CR Registration Fee</h3>
    <p>This is the core government fee for issuing or confirming your commercial registration:</p>
    <table>
        <thead><tr><th>Entity Type</th><th>Initial Registration</th><th>Annual Confirmation</th></tr></thead>
        <tbody>
            <tr><td><strong>Sole Proprietorship</strong></td><td>SAR 500</td><td>SAR 500</td></tr>
            <tr><td><strong>LLC</strong></td><td>SAR 6,000</td><td>SAR 1,200</td></tr>
            <tr><td><strong>General Partnership</strong></td><td>SAR 1,000</td><td>SAR 1,000</td></tr>
            <tr><td><strong>Limited Partnership</strong></td><td>SAR 1,000</td><td>SAR 1,000</td></tr>
            <tr><td><strong>Simplified Joint Stock</strong></td><td>SAR 1,600</td><td>SAR 1,600</td></tr>
            <tr><td><strong>Foreign Branch</strong></td><td>SAR 2,000</td><td>SAR 2,000</td></tr>
        </tbody>
    </table>

    <h3>2. Chamber of Commerce Membership</h3>
    <p>Chamber of Commerce membership is <strong>mandatory</strong> for all registered businesses. Fees are tiered based on company size:</p>
    <table>
        <thead><tr><th>Category</th><th>Criteria</th><th>Annual Fee</th></tr></thead>
        <tbody>
            <tr><td><strong>Category A</strong></td><td>Listed company, capital &gt;SAR 1M, or 250+ employees</td><td>SAR 5,000</td></tr>
            <tr><td><strong>Category B</strong></td><td>Capital SAR 375K–1M, or 50–249 employees</td><td>SAR 2,000</td></tr>
            <tr><td><strong>Category C</strong></td><td>Capital &lt;SAR 375K, or 6–49 employees</td><td>SAR 1,000</td></tr>
            <tr><td><strong>Category D</strong></td><td>Capital &lt;SAR 375K, or ≤5 employees</td><td>SAR 1,000</td></tr>
        </tbody>
    </table>
    <p>Chamber membership provides networking opportunities, trade dispute resolution, and access to business support services.</p>

    <h3>3. Municipality License (Baladiya)</h3>
    <p>If your business operates from a physical location, you need a <strong>municipality license</strong>:</p>
    <table>
        <thead><tr><th>Business Size</th><th>Annual Fee</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Small office/shop</strong></td><td>SAR 500–1,000</td><td>Home offices, small retail</td></tr>
            <tr><td><strong>Medium commercial</strong></td><td>SAR 1,000–3,000</td><td>Offices, restaurants, clinics</td></tr>
            <tr><td><strong>Large/industrial</strong></td><td>SAR 3,000–5,000</td><td>Warehouses, factories, showrooms</td></tr>
        </tbody>
    </table>

    <h3>4. MISA License (Foreign Investors)</h3>
    <p>Foreign-owned businesses require a license from the <strong>Ministry of Investment (MISA)</strong>:</p>
    <table>
        <thead><tr><th>Component</th><th>Fee (SAR)</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual service fee</strong></td><td>2,000</td><td>Ongoing annual cost</td></tr>
            <tr><td><strong>First-year investor subscription</strong></td><td>10,000</td><td>One-time in first year</td></tr>
            <tr><td><strong>License issuance fee</strong></td><td>Suspended</td><td>Was SAR 12,000 — suspended 2026</td></tr>
            <tr><td><strong>Subsequent renewal</strong></td><td>Suspended</td><td>Was SAR 62,000 — suspended 2026</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Good News for Foreign Investors:</strong> In 2026, the Saudi government suspended the MISA license issuance fee (SAR 12,000) and renewal fee (SAR 62,000) to <strong>attract more foreign investment</strong> under Vision 2030. This makes KSA significantly more affordable for international businesses.
    </div>

    <h3>5. Sub-CRs and Additional Activities</h3>
    <table>
        <thead><tr><th>Item</th><th>Fee (SAR)</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Sub-CR (branch registration)</strong></td><td>100/year each</td><td>For each branch or secondary location</td></tr>
            <tr><td><strong>Additional activity</strong></td><td>300 each</td><td>Each ISIC code beyond the primary</td></tr>
            <tr><td><strong>CR information update</strong></td><td>100</td><td>Updating company details</td></tr>
            <tr><td><strong>Articles of association (LLC)</strong></td><td>500</td><td>Publication fee for new LLCs</td></tr>
        </tbody>
    </table>

    <h2 id="annual-confirmation">Annual Confirmation Process (2025)</h2>
    <p>Since April 2025, the MOCI requires <strong>annual confirmation</strong> instead of traditional renewal. Here's the process:</p>
    <ol>
        <li><strong>Receive notification</strong> — MOCI sends reminder 30 days before anniversary</li>
        <li><strong>Log in</strong> to mc.gov.sa or Sijil app</li>
        <li><strong>Verify company information</strong> — update any changes (address, activities, partners)</li>
        <li><strong>Confirm accuracy</strong> — digitally sign the confirmation</li>
        <li><strong>Pay via SADAD</strong> — CR fee + Chamber of Commerce membership</li>
        <li><strong>Download updated CR</strong> — digital certificate available immediately</li>
    </ol>

    <h2 id="penalties">Late Penalties and CR Suspension</h2>
    <p>Failing to confirm your CR on time has serious consequences:</p>
    <table>
        <thead><tr><th>Timeline</th><th>Consequence</th></tr></thead>
        <tbody>
            <tr><td><strong>Late confirmation</strong></td><td>25% surcharge on renewal fee</td></tr>
            <tr><td><strong>90 days overdue</strong></td><td>CR suspended — cannot conduct business</td></tr>
            <tr><td><strong>1 year overdue</strong></td><td>CR cancelled — must re-register from scratch</td></tr>
        </tbody>
    </table>
    <p>A suspended CR prevents you from issuing invoices, renewing employee Iqamas, and accessing government services. It can also trigger <a href="/ksa/saudization-calculator">Saudization compliance</a> issues.</p>

    <h2 id="registration-process">How to Register a Business in Saudi Arabia</h2>
    <ol>
        <li><strong>Choose your entity type</strong> — LLC is most common for small-medium businesses</li>
        <li><strong>Reserve a company name</strong> — via mc.gov.sa (SAR 200 reservation fee)</li>
        <li><strong>Register national address</strong> — via Subul (Saudi Post)</li>
        <li><strong>Draft articles of association</strong> — required for LLCs and partnerships</li>
        <li><strong>Apply for MISA license</strong> — if foreign-owned</li>
        <li><strong>Issue CR online</strong> — select activity codes, pay via SADAD</li>
        <li><strong>Join Chamber of Commerce</strong> — mandatory, pay membership fee</li>
        <li><strong>Obtain municipality license</strong> — for physical business locations</li>
        <li><strong>Register for VAT</strong> — mandatory if revenue exceeds SAR 375,000</li>
        <li><strong>Register employees on GOSI</strong> — use our <a href="/ksa/gosi-calculator">GOSI Calculator</a></li>
    </ol>

    <h2 id="cost-examples">Total Setup Cost Examples</h2>
    <h3>Example 1: Small LLC (Saudi-owned, 10 employees)</h3>
    <table>
        <thead><tr><th>Component</th><th>Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>CR Initial Registration</td><td>6,000</td></tr>
            <tr><td>Articles Publication</td><td>500</td></tr>
            <tr><td>Chamber of Commerce (Cat C)</td><td>1,000</td></tr>
            <tr><td>Municipality License</td><td>2,000</td></tr>
            <tr><td><strong>Total Year 1</strong></td><td><strong>SAR 9,500</strong></td></tr>
            <tr><td><strong>Annual Renewal</strong></td><td><strong>SAR 4,200/year</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: Foreign Branch (100 employees)</h3>
    <table>
        <thead><tr><th>Component</th><th>Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>CR Registration</td><td>2,000</td></tr>
            <tr><td>MISA License (1st year)</td><td>12,000</td></tr>
            <tr><td>Chamber of Commerce (Cat B)</td><td>2,000</td></tr>
            <tr><td>Municipality License</td><td>4,000</td></tr>
            <tr><td><strong>Total Year 1</strong></td><td><strong>SAR 20,000</strong></td></tr>
            <tr><td><strong>Annual Renewal</strong></td><td><strong>SAR 8,000/year</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 3: Sole Proprietorship (Freelancer)</h3>
    <table>
        <thead><tr><th>Component</th><th>Cost (SAR)</th></tr></thead>
        <tbody>
            <tr><td>CR Registration</td><td>500</td></tr>
            <tr><td>Chamber of Commerce (Cat D)</td><td>1,000</td></tr>
            <tr><td>Municipality License (home office)</td><td>750</td></tr>
            <tr><td><strong>Total Year 1</strong></td><td><strong>SAR 2,250</strong></td></tr>
            <tr><td><strong>Annual Renewal</strong></td><td><strong>SAR 2,250/year</strong></td></tr>
        </tbody>
    </table>

    <h2 id="saudization-link">CR and Saudization Compliance</h2>
    <p>Your commercial registration is directly linked to <strong>Saudization (Nitaqat) compliance</strong>. Companies must maintain minimum Saudi employment ratios to keep their CR in good standing:</p>
    <ul>
        <li><strong>Red zone companies</strong> face CR renewal restrictions and visa blocks</li>
        <li><strong>Work permit costs</strong> are higher for non-compliant companies (SAR 800 vs SAR 700/month per expat)</li>
        <li><strong>New Saudization targets</strong> for 2025/2026 affect 13+ sectors</li>
    </ul>
    <p>Use our <a href="/ksa/saudization-calculator">Saudization Calculator</a> to check your Nitaqat band and determine how many Saudi employees you need. For employee compensation planning, the <a href="/ksa/salary-calculator">Salary Calculator</a> and <a href="/ksa/end-of-service-calculator">End of Service Calculator</a> are essential tools.</p>

    <h2 id="vision-2030">Vision 2030 and Business Environment</h2>
    <p>Saudi Arabia's Vision 2030 has dramatically improved the business registration environment:</p>
    <ul>
        <li><strong>100% foreign ownership</strong> now permitted in most sectors</li>
        <li><strong>MISA fee suspension</strong> — SAR 62,000 renewal fee eliminated</li>
        <li><strong>Digital-first registration</strong> — complete CR issuance online in minutes</li>
        <li><strong>Reduced capital requirements</strong> — SAR 25,000 for LLCs (previously higher)</li>
        <li><strong>Simplified processes</strong> — annual confirmation replaces complex renewal</li>
        <li><strong>Special Economic Zones</strong> — NEOM, KAEC offer additional incentives</li>
    </ul>
`;

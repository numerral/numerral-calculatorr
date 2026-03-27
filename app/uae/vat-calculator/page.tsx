import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEVATCalculatorCore from "@/components/calculator/UAEVATCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE VAT Calculator 2026 — Add, Remove & Tourist Refund",
    description: "Calculate UAE 5% VAT instantly. Add or remove VAT, estimate tourist refunds, and manage bulk invoices. Covers zero-rated, exempt, and standard-rated supplies under Federal Decree-Law No. 8 of 2017.",
    keywords: ["UAE VAT calculator", "VAT calculator Dubai", "ضريبة القيمة المضافة حاسبة", "5% VAT UAE", "tourist VAT refund UAE", "FTA VAT", "zero-rated VAT UAE", "exempt VAT supplies UAE", "reverse charge UAE", "e-invoicing UAE"],
    alternates: { canonical: canonicalUrl("/uae/vat-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is the VAT rate in the UAE?", answer: "The UAE applies a standard VAT rate of 5% on most goods and services. This rate has been in effect since January 1, 2018, when VAT was first introduced under Federal Decree-Law No. 8 of 2017 on Value Added Tax. Some supplies are zero-rated (0% VAT but still taxable) and others are exempt from VAT entirely. The 5% rate is one of the lowest in the world and applies uniformly across all seven emirates." },
    { question: "How do I calculate VAT on a purchase in the UAE?", answer: "To add 5% VAT: multiply the net amount by 0.05 to get the VAT, then add to the original. For example, AED 1,000 × 5% = AED 50 VAT, total = AED 1,050. To extract VAT from an inclusive price: divide by 1.05. For example, AED 1,050 ÷ 1.05 = AED 1,000 net, and AED 1,050 − AED 1,000 = AED 50 VAT. Our calculator handles both directions automatically." },
    { question: "What is the difference between zero-rated and exempt VAT supplies?", answer: "Zero-rated supplies carry a 0% VAT rate but are still considered 'taxable supplies' — meaning businesses can recover input VAT on costs related to making those supplies. Examples include exports, healthcare, and education. Exempt supplies are not subject to VAT at all, and businesses cannot recover input VAT on related costs. Examples include financial services without explicit fees, bare land, and subsequent residential property sales. This distinction is critical for businesses calculating their input tax credits." },
    { question: "Who must register for VAT in the UAE?", answer: "VAT registration is mandatory for businesses whose taxable supplies and imports exceed AED 375,000 in a 12-month period (or are expected to in the next 30 days). Voluntary registration is available for businesses exceeding AED 187,500. Non-resident businesses making taxable supplies in the UAE must register from the first supply — there is no threshold. Registration is done through the Federal Tax Authority (FTA) EmaraTax portal. Failure to register on time incurs a AED 10,000 penalty." },
    { question: "How does the UAE tourist VAT refund work?", answer: "Non-resident tourists aged 18+ can claim a refund of 85% of the VAT paid on eligible purchases. Requirements: minimum AED 250 per invoice, purchased from registered retailers, goods must be exported within 90 days, and validated at self-service kiosks at airports/ports/borders. An administrative fee of 15% of VAT and AED 4.80 per tax-free tag is deducted. Refunds can be received as cash (max AED 10,000), credit card, or digital wallet. Services, food consumed locally, and cars are not eligible." },
    { question: "What are VAT Designated Zones in the UAE?", answer: "Designated Zones are specific free zones that receive special VAT treatment — they're treated as outside the UAE for goods (not services). This means transfers of goods between designated zones, or imports into designated zones, may not attract VAT provide strict conditions are met (customs controls, fencing, etc.). Major designated zones include Jebel Ali Free Zone, Dubai Airport Free Zone, Khalifa Port FTZ, and RAK FTZ. Services within designated zones are still subject to standard 5% VAT." },
    { question: "What is the reverse charge mechanism in UAE VAT?", answer: "The Reverse Charge Mechanism (RCM) shifts VAT payment responsibility from the supplier to the recipient. It applies when: (1) a UAE business imports services from abroad; (2) certain domestic B2B supplies of electronic devices, hydrocarbons, and precious metals/stones are made for resale or manufacturing. Under RCM, the supplier does not charge VAT — instead, the buyer self-accounts for output VAT in their return and can simultaneously claim input VAT credit if eligible, resulting in a net-zero cash impact." },
    { question: "How is VAT applied to real estate in the UAE?", answer: "Real estate VAT treatment depends on the property type and supply timing. First supply (sale or lease) of newly constructed residential buildings within 3 years of completion is zero-rated (0%). Subsequent sales/leases of residential property are exempt from VAT. Commercial property (offices, retail, warehouses) is always standard-rated at 5%. Bare land is exempt. Service charges and maintenance fees for any building attract 5% VAT. This means developers of new residential projects can recover their input VAT, while secondary market transactions have no VAT impact." },
    { question: "Is healthcare subject to VAT in the UAE?", answer: "Most healthcare services are zero-rated (0%) in the UAE. This includes preventive healthcare (vaccinations, check-ups), treatment of illness/injury, prescribed medicines, and medical equipment used for healthcare purposes. However, optional and cosmetic procedures (Botox, teeth whitening, laser hair removal) are standard-rated at 5%. Over-the-counter vitamins, supplements, and wellness products not prescribed by a licensed doctor are also subject to 5% VAT." },
    { question: "What are the penalties for VAT non-compliance in the UAE?", answer: "The FTA imposes significant penalties: Late registration = AED 10,000. Late filing = AED 1,000 first offense, AED 2,000 repeat within 24 months. Late payment = 2% immediately, 4% on day 7, then 1% daily after one month (max 300% of unpaid tax). Not issuing tax invoices = AED 2,500 first offense. Errors in returns = AED 500–20,000. Not notifying FTA of changes = AED 5,000 first, AED 15,000 repeat. Non-compliance in designated zones = higher of AED 50,000 or 50% of unpaid tax." },
    { question: "How does UAE VAT interact with Corporate Tax?", answer: "VAT and Corporate Tax are separate systems that co-exist. VAT is an indirect consumption tax (5%) collected on transactions and remitted to FTA. Corporate Tax is a direct tax (0% on profits up to AED 375,000, 9% thereafter) on business net profits. They have different tax bases — VAT applies to revenue (supplies), while CT applies to profitability. There is no double taxation on the same amount. Businesses must comply with both regimes independently." },
    { question: "What is e-invoicing in the UAE?", answer: "The UAE is implementing a mandatory electronic invoicing system starting 2026-2027. It will be Peppol-based, requiring businesses to issue and report invoices electronically through Accredited Service Providers (ASPs). Timeline: voluntary pilot from July 2026; businesses with revenue ≥ AED 50M must comply by January 2027; all others by July 2027; government entities by October 2027. E-invoices must be issued within 14 days of the taxable event and records stored within the UAE." },
    { question: "Can I recover input VAT on business expenses?", answer: "Yes, VAT-registered businesses can recover input VAT on expenses related to making taxable supplies (standard-rated or zero-rated). However, input VAT cannot be recovered on: expenses related to exempt supplies, entertainment expenses (unless for non-resident business visitors), employee personal expenses, and purchases of motor vehicles for personal use. A new 5-year time limit on input VAT recovery has been introduced by the 2025 amendment laws. Mixed-use expenses require apportionment." },
    { question: "What is the VAT treatment of education in the UAE?", answer: "Education services at government-recognized institutions are zero-rated: this covers tuition fees, curriculum materials, and teacher-led instruction at nurseries, schools, and universities (if >50% government funded). Student transport from home to school is exempt. Standard 5% VAT applies to: uniforms, electronic devices, food/beverages at schools, non-curriculum field trips, extracurricular activities with separate fees, and student organization memberships." },
    { question: "Is food subject to VAT in the UAE?", answer: "Yes, most food items in the UAE are subject to the standard 5% VAT rate. This includes groceries, restaurant meals, takeaway food, and food delivery services. There is no reduced rate or exemption for basic food items in the UAE (unlike some countries that zero-rate essential foodstuffs). The only food-related exception is food provided as part of a zero-rated educational or healthcare supply." },
    { question: "What amendments were made to the UAE VAT Law in 2025?", answer: "Federal Decree-Laws No. 16 and 17 of 2025 were issued to amend the VAT Law and Tax Procedures Law respectively, taking effect January 1, 2026. Key changes include: introducing a 5-year limit on input VAT recovery claims; enhanced anti-evasion provisions; clarifications on supply categorization; new rules for group registration and tax representatives; and alignment with the UAE's e-invoicing framework. These amendments aim to strengthen compliance and modernize the tax system." },
];

export default function VATCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "VAT Calculator" },
        ]),
        webAppSchema("UAE VAT Calculator", canonicalUrl("/uae/vat-calculator")),
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
            <Script id="schema-vat-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "VAT Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE VAT Calculator 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate UAE 5% VAT instantly. Add or remove VAT, estimate tourist refunds, and manage bulk invoices. Covers standard-rated, zero-rated, and exempt supplies under Federal Decree-Law No. 8 of 2017.
            </p>
            <AuthorBadge categoryKey="tax" />
            <UAEVATCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="UAE VAT Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">Monthly EMI, DLD fees, DBR check</div>
                        </div>
                    </Link>
                    <Link href="/uae/gratuity-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💼</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Gratuity Calculator</div>
                            <div className="uae-related-link__desc">End-of-service benefits</div>
                        </div>
                    </Link>
                    <Link href="/tax-calculators/gst-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">GST Calculator</div>
                            <div className="uae-related-link__desc">India GST calculation</div>
                        </div>
                    </Link>
                    <Link href="/investment-calculators/compound-interest-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💹</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Compound Interest</div>
                            <div className="uae-related-link__desc">Grow your savings</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-vat">What Is VAT in the UAE?</h2>
    <p><strong>Value Added Tax (VAT)</strong> is an indirect consumption tax levied on most goods and services at each stage of the supply chain, from manufacturing to final sale. The UAE introduced VAT on <strong>January 1, 2018</strong>, under <strong>Federal Decree-Law No. 8 of 2017</strong>, at a standard rate of <strong>5%</strong> — one of the lowest VAT rates globally.</p>
    <p>VAT is administered by the <strong>Federal Tax Authority (FTA)</strong> and applies across all seven emirates. It generates approximately <strong>AED 47 billion annually</strong>, forming a significant portion of the UAE&apos;s non-oil government revenue. Unlike income tax (which doesn&apos;t exist for individuals in the UAE), VAT is paid by consumers on purchases and collected by businesses on behalf of the government.</p>
    <p>Key vocabulary: <strong>ضريبة القيمة المضافة</strong> (Dareebat al-Qeema al-Mudafa) = Value Added Tax in Arabic.</p>

    <h2 id="vat-categories">VAT Supply Categories</h2>
    <p>Every good or service in the UAE falls into one of three VAT categories:</p>
    <table>
        <thead><tr><th>Category</th><th>Rate</th><th>Input VAT Recovery</th><th>Key Examples</th></tr></thead>
        <tbody>
            <tr><td><strong>Standard-Rated</strong></td><td>5%</td><td>✅ Yes</td><td>Electronics, clothing, dining, commercial rent, professional services</td></tr>
            <tr><td><strong>Zero-Rated</strong></td><td>0%</td><td>✅ Yes</td><td>Exports, healthcare, education, first residential supply, precious metals (99%+)</td></tr>
            <tr><td><strong>Exempt</strong></td><td>N/A</td><td>❌ No</td><td>Financial services (no explicit fee), bare land, subsequent residential, local transport</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Why does the zero-rated vs exempt distinction matter?</strong> If your business makes zero-rated supplies, you can still claim back input VAT on your expenses. If your business makes exempt supplies, you <em>cannot</em> recover input VAT — meaning the VAT you pay on costs becomes an additional business expense.
    </div>

    <h2 id="zero-rated">Zero-Rated Supplies (0% VAT)</h2>
    <p>Zero-rated supplies are taxable at 0%, meaning businesses charge no VAT to customers but can recover input VAT on related costs. This category includes:</p>
    <ul>
        <li><strong>Exports</strong> — Goods/services shipped outside the UAE or GCC implementing states (goods must leave within 90 days)</li>
        <li><strong>International transportation</strong> — Cross-border passenger and cargo transport services</li>
        <li><strong>Healthcare</strong> — Preventive care, treatment of illness/injury, prescribed medicines, medical equipment (not cosmetic procedures)</li>
        <li><strong>Education</strong> — Tuition at government-recognized institutions, curriculum textbooks (not uniforms or devices)</li>
        <li><strong>First residential supply</strong> — First sale or lease of a newly built residential property within 3 years of completion</li>
        <li><strong>Investment precious metals</strong> — Gold, silver, and platinum at ≥99% purity, tradeable on global bullion markets</li>
        <li><strong>Certain transport</strong> — Aircraft, ships, and related spare parts</li>
    </ul>

    <h2 id="exempt">Exempt Supplies</h2>
    <p>Exempt supplies are completely outside the VAT system — no VAT is charged, and businesses cannot recover input VAT on related costs:</p>
    <ul>
        <li><strong>Financial services without explicit fees</strong> — Currency exchange margins, loan interest, securities trading, life insurance premiums (advisory services with explicit fees are standard-rated at 5%)</li>
        <li><strong>Subsequent residential property</strong> — Any sale or lease of residential property after the first supply</li>
        <li><strong>Bare land</strong> — Undeveloped land not covered by completed buildings</li>
        <li><strong>Local passenger transport</strong> — Metro, bus, and taxi services within the UAE</li>
        <li><strong>Student transportation</strong> — School bus services from home to institution</li>
    </ul>

    <h2 id="registration">VAT Registration with the FTA</h2>
    <p>Businesses operating in the UAE must evaluate their registration obligations:</p>
    <table>
        <thead><tr><th>Type</th><th>Threshold</th><th>Deadline</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Mandatory</strong></td><td>AED 375,000</td><td>Within 30 days of exceeding</td><td>Applies to taxable supplies + imports in any 12-month period</td></tr>
            <tr><td><strong>Voluntary</strong></td><td>AED 187,500</td><td>Any time after exceeding</td><td>Useful to recover input VAT; commits business to filing returns</td></tr>
            <tr><td><strong>Non-Resident</strong></td><td>AED 0</td><td>From first taxable supply</td><td>No threshold for foreign businesses making UAE supplies</td></tr>
        </tbody>
    </table>
    <p>Registration is done through the <strong>EmaraTax portal</strong> (tax.gov.ae). Required documents include: trade license, passport/Emirates ID, bank account details, and 12-month revenue records. The FTA issues a <strong>Tax Registration Number (TRN)</strong> — a 15-digit identifier that must appear on all tax invoices.</p>

    <h2 id="vat-return">VAT Return Filing</h2>
    <p>VAT-registered businesses must file periodic VAT returns through the EmaraTax portal:</p>
    <table>
        <thead><tr><th>Aspect</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Filing frequency</strong></td><td>Quarterly (most businesses) or monthly (assigned by FTA for larger entities)</td></tr>
            <tr><td><strong>Due date</strong></td><td>28th day of the month following the end of the tax period</td></tr>
            <tr><td><strong>What to declare</strong></td><td>Output VAT collected, input VAT paid, net VAT payable/refundable</td></tr>
            <tr><td><strong>Payment</strong></td><td>Net VAT must be paid by the same due date via e-Dirham or bank transfer</td></tr>
            <tr><td><strong>Records retention</strong></td><td>All tax records must be kept for at least 5 years</td></tr>
        </tbody>
    </table>

    <h2 id="reverse-charge">Reverse Charge Mechanism (RCM)</h2>
    <p>The <strong>Reverse Charge Mechanism</strong> shifts VAT payment responsibility from the supplier to the buyer. This applies in specific B2B scenarios:</p>
    <ul>
        <li><strong>Imported services</strong> — When a UAE business purchases services from a foreign supplier not registered for UAE VAT</li>
        <li><strong>Electronic devices</strong> — B2B supply of mobile phones, computers, tablets, and parts for resale or manufacturing</li>
        <li><strong>Hydrocarbons</strong> — Crude oil, refined oil, natural gas for resale or energy production</li>
        <li><strong>Precious metals and stones</strong> — B2B supplies of gold, diamonds, etc. for resale</li>
    </ul>
    <p>Under RCM, the buyer self-accounts for output VAT in their return and simultaneously claims input VAT credit, resulting in a <strong>net-zero cash impact</strong>. The buyer must be VAT-registered and maintain proper documentation.</p>

    <h2 id="tourist-refund">Tourist VAT Refund Scheme</h2>
    <p>The UAE operates a <strong>VAT refund scheme for tourists</strong>, allowing non-resident visitors to reclaim VAT on eligible purchases:</p>
    <table>
        <thead><tr><th>Requirement</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Who qualifies</strong></td><td>Non-resident tourists aged 18+</td></tr>
            <tr><td><strong>Minimum purchase</strong></td><td>AED 250 per invoice</td></tr>
            <tr><td><strong>Refund amount</strong></td><td>85% of VAT paid (15% admin fee deducted)</td></tr>
            <tr><td><strong>Tag fee</strong></td><td>AED 4.80 per tax-free tag</td></tr>
            <tr><td><strong>Eligible items</strong></td><td>Physical goods: electronics, jewelry, watches, fashion, souvenirs</td></tr>
            <tr><td><strong>Excluded</strong></td><td>Services, food consumed locally, motor vehicles, goods installed in UAE</td></tr>
            <tr><td><strong>Export deadline</strong></td><td>Goods must leave UAE within 90 days of purchase</td></tr>
            <tr><td><strong>Validation</strong></td><td>Self-service kiosks at airports, sea ports, land borders</td></tr>
            <tr><td><strong>Refund methods</strong></td><td>Cash (max AED 10,000), credit card, or digital wallet</td></tr>
            <tr><td><strong>Operator</strong></td><td>Planet Tax Free (authorized by FTA)</td></tr>
        </tbody>
    </table>
    <p><strong>Example:</strong> A tourist purchases AED 5,000 worth of electronics. VAT = AED 250 (5%). Refund = AED 250 × 85% − AED 4.80 = <strong>AED 207.70</strong>.</p>

    <h2 id="designated-zones">Designated Zones (Free Zone VAT Treatment)</h2>
    <p><strong>Designated Zones</strong> are specific free zones that receive special VAT treatment. For <strong>goods</strong> (not services), they are treated as being outside the UAE — meaning transfers of goods between designated zones or imports into them may not attract VAT.</p>
    <p>However, critical conditions must be met:</p>
    <ul>
        <li>The zone must have robust <strong>security and customs controls</strong></li>
        <li>Movement of goods in/out must be <strong>monitored and documented</strong></li>
        <li><strong>Services</strong> supplied within designated zones are still subject to <strong>5% VAT</strong></li>
        <li>Not all free zones are designated zones — only FTA-listed zones qualify</li>
    </ul>
    <p>Major designated zones include: Jebel Ali Free Zone (North & South), Dubai Airport Free Zone, DUCAMZ, Khalifa Port FTZ, Abu Dhabi Airport Free Zone, RAK FTZ, and others across all seven emirates.</p>

    <h2 id="real-estate">VAT on Real Estate</h2>
    <p>Real estate has complex VAT treatment in the UAE:</p>
    <table>
        <thead><tr><th>Property Type</th><th>Transaction</th><th>VAT Treatment</th></tr></thead>
        <tbody>
            <tr><td><strong>New residential</strong></td><td>First sale/lease within 3 years</td><td>Zero-rated (0%)</td></tr>
            <tr><td><strong>Used residential</strong></td><td>Subsequent sale/lease</td><td>Exempt</td></tr>
            <tr><td><strong>Commercial</strong></td><td>All sales and leases</td><td>Standard (5%)</td></tr>
            <tr><td><strong>Bare land</strong></td><td>Sale</td><td>Exempt</td></tr>
            <tr><td><strong>Service charges</strong></td><td>Any building maintenance</td><td>Standard (5%)</td></tr>
            <tr><td><strong>Hotel stays</strong></td><td>Short-term accommodation</td><td>Standard (5%)</td></tr>
        </tbody>
    </table>
    <p>This means developers of new residential projects can recover input VAT on construction costs (since first supply is zero-rated), while secondary market residential transactions have no VAT impact (exempt).</p>

    <h2 id="healthcare-vat">VAT on Healthcare</h2>
    <p>Healthcare in the UAE has a nuanced VAT treatment:</p>
    <table>
        <thead><tr><th>Service/Product</th><th>VAT Rate</th></tr></thead>
        <tbody>
            <tr><td>Preventive healthcare (vaccinations, check-ups)</td><td><strong>0% (Zero-rated)</strong></td></tr>
            <tr><td>Treatment of illness/injury</td><td><strong>0% (Zero-rated)</strong></td></tr>
            <tr><td>Prescribed medicines and medical equipment</td><td><strong>0% (Zero-rated)</strong></td></tr>
            <tr><td>Cosmetic procedures (Botox, whitening)</td><td><strong>5% (Standard)</strong></td></tr>
            <tr><td>OTC vitamins and supplements</td><td><strong>5% (Standard)</strong></td></tr>
            <tr><td>Wellness therapies (spa, massage)</td><td><strong>5% (Standard)</strong></td></tr>
        </tbody>
    </table>

    <h2 id="education-vat">VAT on Education</h2>
    <table>
        <thead><tr><th>Supply</th><th>VAT Treatment</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td>Tuition fees</td><td><strong>0% (Zero-rated)</strong></td><td>Institution recognized by federal/local government</td></tr>
            <tr><td>Curriculum textbooks</td><td><strong>0% (Zero-rated)</strong></td><td>Directly linked to recognized curriculum</td></tr>
            <tr><td>Student transport</td><td><strong>Exempt</strong></td><td>Home-to-school only</td></tr>
            <tr><td>School uniforms</td><td><strong>5% (Standard)</strong></td><td>—</td></tr>
            <tr><td>Electronic devices</td><td><strong>5% (Standard)</strong></td><td>Laptops, tablets required by school</td></tr>
            <tr><td>Cafeteria food</td><td><strong>5% (Standard)</strong></td><td>—</td></tr>
            <tr><td>Extracurricular activities</td><td><strong>5% (Standard)</strong></td><td>If charged separately from tuition</td></tr>
        </tbody>
    </table>
    <p><strong>Higher education note:</strong> For universities to qualify for zero-rating, over 50% of their annual funding must come directly from the federal or local government.</p>

    <h2 id="corporate-tax">VAT vs Corporate Tax</h2>
    <p>Since the introduction of <strong>Corporate Tax</strong> (9% on profits above AED 375,000) in June 2023, businesses must now comply with both tax regimes:</p>
    <table>
        <thead><tr><th>Aspect</th><th>VAT</th><th>Corporate Tax</th></tr></thead>
        <tbody>
            <tr><td><strong>Type</strong></td><td>Indirect (consumption)</td><td>Direct (profit)</td></tr>
            <tr><td><strong>Rate</strong></td><td>5% on supplies</td><td>0% up to AED 375K, 9% above</td></tr>
            <tr><td><strong>Tax base</strong></td><td>Transaction value</td><td>Taxable net profit</td></tr>
            <tr><td><strong>Who bears it</strong></td><td>End consumer</td><td>Business entity</td></tr>
            <tr><td><strong>Filing</strong></td><td>Quarterly/monthly</td><td>Annually</td></tr>
            <tr><td><strong>Effective since</strong></td><td>January 2018</td><td>June 2023</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>No double taxation:</strong> VAT is charged on revenue (supplies), while CT is on net profits. They have completely different tax bases. VAT collected is not income for CT purposes — it belongs to the FTA.
    </div>

    <h2 id="e-invoicing">E-Invoicing 2026–2027</h2>
    <p>The UAE is implementing a <strong>mandatory electronic invoicing system</strong> through Ministerial Decisions 243 and 244 (September 2025). The system will be <strong>Peppol-based</strong>:</p>
    <table>
        <thead><tr><th>Phase</th><th>Date</th><th>Who</th></tr></thead>
        <tbody>
            <tr><td>Voluntary pilot</td><td>July 1, 2026</td><td>Early adopters with technical readiness</td></tr>
            <tr><td>Large businesses</td><td>January 1, 2027</td><td>Revenue ≥ AED 50 million (ASP appointed by July 2026)</td></tr>
            <tr><td>All businesses</td><td>July 1, 2027</td><td>Revenue &lt; AED 50 million (ASP appointed by March 2027)</td></tr>
            <tr><td>Government entities</td><td>October 1, 2027</td><td>All government bodies</td></tr>
        </tbody>
    </table>
    <p>Requirements: e-invoices must be issued within <strong>14 days</strong> of the taxable event, transmitted through an <strong>Accredited Service Provider (ASP)</strong>, and records stored within the UAE.</p>

    <h2 id="input-vat">Input VAT Recovery</h2>
    <p>VAT-registered businesses can recover input VAT on expenses related to taxable supplies. However, recovery is <strong>blocked</strong> for:</p>
    <ul>
        <li><strong>Entertainment expenses</strong> — unless for non-resident business visitors</li>
        <li><strong>Motor vehicles</strong> — purchased for employee personal use</li>
        <li><strong>Employee personal expenses</strong> — not related to business operations</li>
        <li><strong>Expenses related to exempt supplies</strong> — no input recovery on exempt-only costs</li>
    </ul>
    <p><strong>Mixed-use expenses:</strong> If expenses relate to both taxable and exempt supplies, input VAT must be <strong>apportioned</strong> — only the portion attributable to taxable supplies can be recovered.</p>
    <p><strong>2025 amendment:</strong> A new <strong>5-year time limit</strong> on input VAT recovery claims has been introduced by Federal Decree-Law No. 16 of 2025 (effective January 2026).</p>

    <h2 id="penalties">Penalties for Non-Compliance</h2>
    <table>
        <thead><tr><th>Violation</th><th>Penalty</th></tr></thead>
        <tbody>
            <tr><td>Late VAT registration</td><td><strong>AED 10,000</strong></td></tr>
            <tr><td>Late deregistration</td><td>AED 1,000 first + AED 1,000/month (max AED 10,000)</td></tr>
            <tr><td>Late filing (1st offense)</td><td><strong>AED 1,000</strong></td></tr>
            <tr><td>Late filing (repeat within 24 months)</td><td><strong>AED 2,000</strong></td></tr>
            <tr><td>Late payment</td><td>2% immediately + 4% on day 7 + 1%/day after 1 month (max 300%)</td></tr>
            <tr><td>Not issuing tax invoices</td><td>AED 2,500 (1st), AED 5,000–10,000 (repeat)</td></tr>
            <tr><td>Errors in returns/records</td><td>AED 500–20,000</td></tr>
            <tr><td>Not notifying FTA of changes</td><td>AED 5,000 (1st), AED 15,000 (repeat)</td></tr>
            <tr><td>Designated zone non-compliance</td><td>Higher of AED 50,000 or 50% of unpaid tax</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common VAT Mistakes in the UAE</h2>
    <ol>
        <li><strong>Charging VAT on exempt supplies</strong> — Incorrectly charging 5% on items like bare land or financial services without fees</li>
        <li><strong>Claiming input VAT on exempt-only expenses</strong> — Cannot recover VAT on costs solely related to exempt supplies</li>
        <li><strong>Missing the registration deadline</strong> — Monitor your rolling 12-month turnover; exceeding AED 375K triggers a 30-day registration window</li>
        <li><strong>Including VAT in Corporate Tax income</strong> — VAT collected belongs to FTA, not your business revenue</li>
        <li><strong>Not applying reverse charge on imports</strong> — If you import services, you must self-account for VAT</li>
        <li><strong>Wrong TRN on invoices</strong> — Each invoice must show the correct 15-digit Tax Registration Number</li>
        <li><strong>Treating all free zones as designated</strong> — Only FTA-listed designated zones get special goods treatment</li>
        <li><strong>Not keeping records for 5 years</strong> — All tax records must be retained for a minimum of 5 years</li>
    </ol>

    <h2 id="2025-amendments">2025 Amendment Laws (Effective January 2026)</h2>
    <p><strong>Federal Decree-Law No. 16 of 2025</strong> (amending VAT Law) and <strong>No. 17 of 2025</strong> (amending Tax Procedures Law) introduce:</p>
    <ul>
        <li><strong>5-year input VAT recovery limit</strong> — Claims must be made within 5 years of the relevant tax period</li>
        <li><strong>Enhanced anti-evasion provisions</strong> — Stricter rules on artificial arrangements to avoid VAT</li>
        <li><strong>Supply categorization clarity</strong> — Refined definitions for mixed supplies and composite transactions</li>
        <li><strong>Group registration updates</strong> — New rules for tax groups and shared liability</li>
        <li><strong>Tax representative changes</strong> — Updated criteria for appointing tax representatives</li>
        <li><strong>E-invoicing alignment</strong> — Legal framework supporting mandatory electronic invoicing</li>
    </ul>
`;

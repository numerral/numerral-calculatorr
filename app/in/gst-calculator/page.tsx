import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import GSTCalculatorCore from "@/components/calculator/GSTCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "GST Calculator India 2026 — Add/Remove GST, All Slabs, CGST SGST IGST Split, ITC Calculator & Return Calendar",
    description: "Free GST Calculator with 4 modes: Add/Remove GST (exclusive/inclusive) with CGST+SGST vs IGST split across all 8 slabs (0%, 0.25%, 3%, 5%, 12%, 18%, 28%, 40%), Category-wise Rate Chart with HSN/SAC codes, Input Tax Credit (ITC) Calculator with blocked credit under Section 17(5), and GST Return Filing Calendar (GSTR-1, GSTR-3B, GSTR-9, CMP-08, QRMP scheme).",
    keywords: ["GST calculator", "GST calculator India", "CGST SGST calculator", "IGST calculator", "GST rate chart 2026", "HSN code", "SAC code", "input tax credit", "ITC calculator", "GSTR-1", "GSTR-3B", "GST return filing", "GST slab rates", "add GST", "remove GST", "reverse charge mechanism", "composition scheme GST"],
    alternates: buildCountryAlternates("IN", "/in/gst-calculator", "gst-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is GST in India?", answer: "GST (Goods and Services Tax) is a comprehensive indirect tax levied on the supply of goods and services in India. It replaced multiple taxes — Excise Duty, VAT, Service Tax, CST, and others — under a unified 'One Nation, One Tax' framework. Implemented on July 1, 2017, GST is administered by the GST Council (federal body) and collected by both Central (CGST) and State (SGST) governments. The GST system uses HSN codes (for goods) and SAC codes (for services) to classify items and determine applicable rates." },
    { question: "What are the GST slabs in India 2026?", answer: "India has the following GST rate slabs: 0% (Essential goods — milk, vegetables, healthcare, education). 0.25% (Rough precious stones). 3% (Gold, silver, platinum jewellery). 5% (Packaged food, restaurants, cab aggregators, hotels ≤₹7,500). 12% (Removed/merged — most items moved to 5% or 18%). 18% (Standard rate — electronics, banking, telecom, IT services, cement). 28% (Luxury — automobiles, AC, dishwashers). 40% (Sin goods — pan masala, tobacco, since GST 2.0 reform, replacing compensation cess)." },
    { question: "What is the difference between CGST, SGST, and IGST?", answer: "CGST (Central GST) goes to the Central Government. SGST (State GST) goes to the State Government. Both are levied on INTRA-STATE transactions (buyer and seller in the same state), each at half the total rate. IGST (Integrated GST) is levied on INTER-STATE transactions (buyer and seller in different states) and imports, at the full rate. Example: 18% GST on an intra-state sale → 9% CGST + 9% SGST. Same sale inter-state → 18% IGST." },
    { question: "How to calculate GST?", answer: "Two methods: (1) Add GST (exclusive): GST Amount = Price × GST Rate ÷ 100. Total = Price + GST Amount. Example: ₹10,000 at 18% → GST = ₹1,800, Total = ₹11,800. (2) Remove GST (inclusive): Base Price = Total × 100 ÷ (100 + GST Rate). GST = Total − Base Price. Example: ₹11,800 inclusive of 18% → Base = ₹10,000, GST = ₹1,800." },
    { question: "What is Input Tax Credit (ITC)?", answer: "ITC allows registered businesses to offset GST paid on purchases (input tax) against GST collected on sales (output tax). This prevents double taxation (cascading effect). Example: You buy raw materials for ₹1,00,000 + 18% GST (₹18,000 input tax). You sell finished goods for ₹2,00,000 + 18% GST (₹36,000 output tax). Net GST payable = ₹36,000 − ₹18,000 = ₹18,000 (cash payment). ITC cannot be claimed on items under Section 17(5) — personal use, food, motor vehicles, etc." },
    { question: "What is the GST registration threshold?", answer: "Mandatory GST registration thresholds: Goods suppliers: ₹40 lakh (normal states) / ₹20 lakh (special category states — NE states, J&K, Himachal, Uttarakhand). Service providers: ₹20 lakh (normal) / ₹10 lakh (special). Mandatory regardless of turnover: Inter-state suppliers, e-commerce operators, persons liable for reverse charge, casual taxable persons, non-resident taxable persons, and input service distributors." },
    { question: "What is the Composition Scheme under GST?", answer: "The Composition Scheme is a simplified compliance option for small taxpayers: Eligibility: Turnover up to ₹1.5 crore (goods) or ₹50 lakh (services). Tax Rate: 1% for manufacturers, 1% for traders, 5% for restaurants, 6% for other service providers. Benefits: Quarterly filing (CMP-08) instead of monthly, simpler compliance. Restrictions: Cannot collect GST from customers, cannot claim ITC, cannot make inter-state supplies, must mention 'Composition Taxable Person' on invoices." },
    { question: "What is Reverse Charge Mechanism (RCM)?", answer: "Under RCM, the recipient (not the supplier) is liable to pay GST to the government. RCM applies to: Specified services (legal, GTA/transport, manpower supply, security). Purchases from unregistered dealers in notified cases. Import of services. The recipient must pay RCM in cash (ITC cannot be used for RCM payment), but can claim ITC on RCM paid for business purposes." },
    { question: "What are the GST return due dates?", answer: "Regular taxpayers: GSTR-1 (sales): 11th of following month. GSTR-3B (summary + payment): 20th of following month. GSTR-9 (annual return): 31st December of next FY. QRMP scheme (turnover ≤ ₹5 crore): GSTR-1 quarterly (13th of month after quarter). GSTR-3B quarterly (22nd/24th). Composition dealers: CMP-08 quarterly (18th). GSTR-4 annually (30th April)." },
    { question: "What is the penalty for late GST return filing?", answer: "Late filing penalties: GSTR-3B: ₹50/day (₹25 CGST + ₹25 SGST), maximum ₹10,000 per return. Nil returns: ₹20/day (₹10 CGST + ₹10 SGST). Interest on late tax payment: 18% per annum. GSTR-1 late fee: ₹50/day, maximum ₹10,000. GSTR-9 (annual): ₹200/day, maximum 0.5% of turnover in the state." },
    { question: "What is HSN code and SAC code?", answer: "HSN (Harmonized System of Nomenclature) is a global classification system for GOODS. India uses 4-digit to 8-digit HSN codes. SAC (Services Accounting Code) classifies SERVICES under GST. Both codes are mandatory on GST invoices and determine the applicable GST rate. Businesses with turnover > ₹5 crore must use 6-digit HSN. Turnover ₹1.5–5 crore: 4-digit HSN. Below ₹1.5 crore: 4-digit recommended." },
    { question: "What is the GST on gold and jewellery?", answer: "Gold, silver, and platinum attract 3% GST on the value of the metal. Making charges on jewellery attract a separate 5% GST. So total GST on jewellery = 3% on metal value + 5% on making charges. Import of gold attracts IGST at 3% + Customs Duty. Rough precious/semi-precious stones: 0.25%." },
    { question: "What is the GST on real estate?", answer: "Under-construction property (non-affordable): 5% GST without ITC. Affordable housing (up to ₹45 lakh, carpet area ≤ 60/90 sqm): 1% GST without ITC. Ready-to-move-in property with Completion Certificate: No GST (only stamp duty). Rental of commercial property: 18% GST if landlord is registered. Residential rent to a registered person: 18% GST under RCM." },
    { question: "Is there GST on insurance premiums?", answer: "Since GST 2.0 reforms, individual life insurance and health insurance premiums are exempt from GST (0% rate). Corporate/group insurance policies: 18% GST. General insurance: 18% GST. Motor insurance: 18% GST. This significant change (previously 18% on all insurance) was introduced to make insurance more affordable for individual policyholders." },
    { question: "What items are exempt from GST?", answer: "Key GST-exempt items: Fresh fruits, vegetables, milk, curd, eggs. Unprocessed food grains — rice, wheat, pulses, flour. Fresh meat and fish. Salt, jaggery. Books, newspapers, maps. Healthcare services (hospitals, clinics). Educational services (schools, recognised institutions). Public transport. Agricultural services. Individual life and health insurance. Postal services (below ₹15)." },
];

export default function GSTCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "GST Calculator" },
        ]),
        webAppSchema("GST Calculator India 2026", canonicalUrl("/in/gst-calculator")),
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
            <Script id="schema-gst" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "GST Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>GST Calculator India 2026</h1>
            <PageDesc>
                Free GST Calculator with 4 modes: Add/Remove GST Calculator (exclusive &amp; inclusive) with CGST+SGST vs IGST split across all 8 rate slabs (0%, 0.25%, 3%, 5%, 12%, 18%, 28%, 40%), Category-wise GST Rate Chart with HSN/SAC codes for 30+ goods and services, Input Tax Credit (ITC) Calculator with blocked credit under Section 17(5) and net cash liability computation, and GST Return Filing Calendar with GSTR-1, GSTR-3B, GSTR-9, CMP-08 due dates and QRMP scheme details. Updated for GST 2.0 reforms including compensation cess abolition and 40% sin goods rate.
            </PageDesc>
            <AuthorBadge categoryKey="tax" />
            <GSTCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="GST Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "GST is indirect tax — income tax is direct. Compare your total tax burden." },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "TDS on professional fees, rent, and payments — 23+ sections covered" },
    { href: "/in/salary-calculator", icon: "💰", title: "Salary Calculator", desc: "Net take-home salary after income tax, EPF, PT, and other deductions" },
    { href: "/in/business-loan-calculator", icon: "🏢", title: "Business Loan Calculator", desc: "EMI and eligibility for MSME/Mudra loans to grow your GST-registered business" },
    { href: "/in/home-loan-calculator", icon: "🏠", title: "Home Loan Calculator", desc: "GST on under-construction property: 1% affordable, 5% non-affordable" },
    { href: "/in/car-loan-calculator", icon: "🚗", title: "Car Loan Calculator", desc: "28% GST on automobiles — compute EMI and total cost of ownership" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Park GST refunds in FD for additional returns" },
    { href: "/in/compound-interest-calculator", icon: "📊", title: "Compound Interest Calculator", desc: "18% p.a. interest on late GST payment — compute the compounding impact" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "Another business compliance — state-wise PT on salary/income" },
    { href: "/in/capital-gains-tax-calculator", icon: "📈", title: "Capital Gains Tax Calculator", desc: "GST on gold (3%) + LTCG if you sell — complete tax picture" },
    { href: "/in/hra-exemption-calculator", icon: "🏠", title: "HRA Exemption Calculator", desc: "Rent payments and HRA exemption under Section 10(13A)" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-gst">What is GST (Goods and Services Tax)?</h2>
    <p><strong>Goods and Services Tax (GST)</strong> is a comprehensive, multi-stage, destination-based indirect tax levied on every value addition in the supply chain. Implemented in India on <strong>July 1, 2017</strong>, GST replaced a complex web of indirect taxes including Excise Duty, VAT, Service Tax, CST, Entry Tax, and Octroi under a unified <strong>&ldquo;One Nation, One Tax&rdquo;</strong> framework.</p>
    <p>GST is administered by the <strong>GST Council</strong> — a constitutional body chaired by the Union Finance Minister with state finance ministers as members. The tax is collected by both Central (CGST) and State (SGST/UTGST) governments for intra-state supplies, and as IGST for inter-state supplies.</p>
    <div class="explanation__highlight">
        <strong>GST 2.0 (September 2025):</strong> Major reforms including abolition of Compensation Cess, introduction of 40% rate for sin goods, and exemption of individual life &amp; health insurance premiums from GST.
    </div>

    <h2 id="gst-formula">GST Calculation Formula</h2>
    <table>
        <thead><tr><th>Calculation</th><th>Formula</th><th>Example (₹10,000 @ 18%)</th></tr></thead>
        <tbody>
            <tr><td><strong>Add GST (Exclusive)</strong></td><td>GST = Price × Rate ÷ 100<br>Total = Price + GST</td><td>GST = ₹1,800<br>Total = ₹11,800</td></tr>
            <tr><td><strong>Remove GST (Inclusive)</strong></td><td>Base = Total × 100 ÷ (100 + Rate)<br>GST = Total − Base</td><td>Base = ₹10,000<br>GST = ₹1,800</td></tr>
        </tbody>
    </table>

    <h2 id="cgst-sgst-igst">CGST, SGST & IGST — How They Work</h2>
    <table>
        <thead><tr><th>Type</th><th>When Applied</th><th>Goes To</th><th>Example (18% GST)</th></tr></thead>
        <tbody>
            <tr><td><strong>CGST</strong></td><td>Intra-state supply</td><td>Central Government</td><td>9% CGST</td></tr>
            <tr><td><strong>SGST/UTGST</strong></td><td>Intra-state supply</td><td>State/UT Government</td><td>9% SGST</td></tr>
            <tr><td><strong>IGST</strong></td><td>Inter-state supply + Imports</td><td>Central (shared with states)</td><td>18% IGST</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Rule:</strong> Same state = CGST + SGST (each half the rate). Different state = IGST (full rate). IGST collected by Centre is later shared with the destination state. Use our calculator (Mode 1) to see the exact split.
    </div>

    <h2 id="gst-rate-slabs">GST Rate Slabs — Complete Guide</h2>
    <table>
        <thead><tr><th>Rate</th><th>Category</th><th>Key Items</th></tr></thead>
        <tbody>
            <tr><td><strong>0%</strong></td><td>Essential / Exempt</td><td>Fresh food, milk, healthcare, education, individual insurance</td></tr>
            <tr><td><strong>0.25%</strong></td><td>Special</td><td>Rough precious/semi-precious stones</td></tr>
            <tr><td><strong>3%</strong></td><td>Precious Metals</td><td>Gold, silver, platinum jewellery</td></tr>
            <tr><td><strong>5%</strong></td><td>Merit / Daily Use</td><td>Packaged food, restaurants, cab aggregators, hotel rooms ≤₹7,500</td></tr>
            <tr><td><strong>18%</strong></td><td>Standard</td><td>Electronics, banking, telecom, IT, cement, iron & steel</td></tr>
            <tr><td><strong>28%</strong></td><td>Luxury</td><td>Automobiles, AC, dishwashers, aerated drinks</td></tr>
            <tr><td><strong>40%</strong></td><td>Sin / De-merit</td><td>Pan masala, tobacco, cigarettes (post GST 2.0)</td></tr>
        </tbody>
    </table>

    <h2 id="itc">Input Tax Credit (ITC) — How It Works</h2>
    <p><strong>ITC</strong> is the mechanism that prevents cascading of tax (tax on tax). Registered businesses can offset GST paid on purchases against GST collected on sales.</p>
    <table>
        <thead><tr><th>Step</th><th>Transaction</th><th>GST Impact</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>Buy raw materials ₹1,00,000 + 18% GST</td><td>₹18,000 input tax (ITC available)</td></tr>
            <tr><td>2</td><td>Manufacture and sell ₹2,00,000 + 18% GST</td><td>₹36,000 output tax</td></tr>
            <tr><td>3</td><td>Net GST payable</td><td>₹36,000 − ₹18,000 = <strong>₹18,000</strong> (cash)</td></tr>
        </tbody>
    </table>
    <h3>Blocked ITC — Section 17(5)</h3>
    <p>ITC cannot be claimed on certain items under Section 17(5) of the CGST Act:</p>
    <ul>
        <li>Motor vehicles and conveyances (except for specific business use)</li>
        <li>Food, beverages, outdoor catering, beauty treatment</li>
        <li>Club memberships, health and fitness</li>
        <li>Rent-a-cab, life/health insurance (for employees — unless mandated)</li>
        <li>Construction of immovable property (for own use)</li>
        <li>Goods/services used for personal consumption</li>
        <li>Goods lost, stolen, destroyed, written off, or given as free samples</li>
    </ul>
    <p>Use our <strong>ITC Calculator</strong> (Mode 3) to compute your net GST liability after claiming eligible ITC.</p>

    <h2 id="registration">GST Registration — Thresholds & Requirements</h2>
    <table>
        <thead><tr><th>Category</th><th>Normal States</th><th>Special States</th></tr></thead>
        <tbody>
            <tr><td><strong>Goods Suppliers</strong></td><td>₹40 lakh</td><td>₹20 lakh</td></tr>
            <tr><td><strong>Service Providers</strong></td><td>₹20 lakh</td><td>₹10 lakh</td></tr>
        </tbody>
    </table>
    <p><strong>Mandatory registration regardless of turnover:</strong> Inter-state suppliers, e-commerce operators, persons liable for reverse charge, casual/non-resident taxable persons, input service distributors, and agents of a supplier.</p>

    <h2 id="composition">Composition Scheme — For Small Businesses</h2>
    <table>
        <thead><tr><th>Parameter</th><th>Rule</th></tr></thead>
        <tbody>
            <tr><td><strong>Eligibility</strong></td><td>Turnover up to ₹1.5 crore (goods) / ₹50 lakh (services)</td></tr>
            <tr><td><strong>Tax Rates</strong></td><td>Manufacturers: 1% | Traders: 1% | Restaurants: 5% | Other services: 6%</td></tr>
            <tr><td><strong>Filing</strong></td><td>CMP-08 quarterly + GSTR-4 annually</td></tr>
            <tr><td><strong>Restrictions</strong></td><td>No ITC, no inter-state supply, no e-commerce, must mention &ldquo;Composition Taxable Person&rdquo; on bills</td></tr>
        </tbody>
    </table>

    <h2 id="reverse-charge">Reverse Charge Mechanism (RCM)</h2>
    <p>Under RCM, the <strong>recipient</strong> pays GST instead of the supplier. RCM applies to:</p>
    <ul>
        <li>Goods Transport Agency (GTA) services</li>
        <li>Legal services by individual advocates</li>
        <li>Sponsorship services</li>
        <li>Director&rsquo;s remuneration (sitting fees, commission)</li>
        <li>Security services by individuals/firms</li>
        <li>Renting of residential property to a registered person</li>
        <li>Import of services</li>
    </ul>
    <p>RCM must be paid in cash — ITC cannot be used for RCM payment. However, ITC on RCM paid can be claimed for subsequent transactions.</p>

    <h2 id="hsn-sac">HSN & SAC Codes</h2>
    <table>
        <thead><tr><th>Code System</th><th>Used For</th><th>Digits Required</th></tr></thead>
        <tbody>
            <tr><td><strong>HSN</strong> (Harmonized System of Nomenclature)</td><td>Goods</td><td>4-digit (≤₹5Cr) / 6-digit (>₹5Cr)</td></tr>
            <tr><td><strong>SAC</strong> (Services Accounting Code)</td><td>Services</td><td>6-digit</td></tr>
        </tbody>
    </table>
    <p>HSN and SAC codes are mandatory on GST invoices and determine the applicable rate. Incorrect classification can attract penalties and interest.</p>

    <h2 id="returns">GST Return Filing — Complete Guide</h2>
    <table>
        <thead><tr><th>Return</th><th>Purpose</th><th>Due Date</th><th>Who Files</th></tr></thead>
        <tbody>
            <tr><td><strong>GSTR-1</strong></td><td>Outward supplies (sales)</td><td>11th of next month</td><td>Regular taxpayer</td></tr>
            <tr><td><strong>GSTR-3B</strong></td><td>Summary + tax payment</td><td>20th of next month</td><td>Regular taxpayer</td></tr>
            <tr><td><strong>GSTR-2B</strong></td><td>Auto-generated ITC statement</td><td>14th (auto)</td><td>All taxpayers</td></tr>
            <tr><td><strong>GSTR-9</strong></td><td>Annual return</td><td>31st December</td><td>Turnover > ₹2 crore</td></tr>
            <tr><td><strong>GSTR-9C</strong></td><td>Reconciliation statement</td><td>31st December</td><td>Turnover > ₹5 crore</td></tr>
            <tr><td><strong>CMP-08</strong></td><td>Composition quarterly</td><td>18th of next month</td><td>Composition dealer</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/tds-calculator">TDS Calculator</a> for TDS compliance alongside GST filings.</p>

    <h2 id="gst-on-real-estate">GST on Real Estate</h2>
    <table>
        <thead><tr><th>Property Type</th><th>GST Rate</th><th>ITC Available?</th></tr></thead>
        <tbody>
            <tr><td>Under-construction (non-affordable)</td><td>5%</td><td>❌ No</td></tr>
            <tr><td>Affordable housing (≤₹45L, area limit)</td><td>1%</td><td>❌ No</td></tr>
            <tr><td>Ready-to-move with CC/OC</td><td>0% (no GST)</td><td>N/A</td></tr>
            <tr><td>Commercial rental (registered landlord)</td><td>18%</td><td>✅ Yes</td></tr>
        </tbody>
    </table>
    <p>If buying under-construction property, use our <a href="/in/home-loan-calculator">Home Loan Calculator</a> to factor in GST on total property cost.</p>

    <h2 id="gst-gold">GST on Gold & Jewellery</h2>
    <ul>
        <li><strong>Gold/silver/platinum:</strong> 3% on metal value</li>
        <li><strong>Making charges:</strong> 5% on making charges</li>
        <li><strong>Import:</strong> 3% IGST + Customs Duty</li>
        <li><strong>Rough precious stones:</strong> 0.25%</li>
    </ul>

    <h2 id="penalties">GST Penalties & Interest</h2>
    <table>
        <thead><tr><th>Default</th><th>Penalty / Interest</th></tr></thead>
        <tbody>
            <tr><td>Late GSTR-3B filing</td><td>₹50/day (₹25 CGST + ₹25 SGST), max ₹10,000</td></tr>
            <tr><td>Nil GSTR-3B late</td><td>₹20/day (₹10 + ₹10), max ₹10,000</td></tr>
            <tr><td>Late tax payment</td><td>18% per annum interest</td></tr>
            <tr><td>Late GSTR-9</td><td>₹200/day, max 0.5% of state turnover</td></tr>
            <tr><td>Fraudulent ITC claim</td><td>100% penalty + interest + prosecution</td></tr>
        </tbody>
    </table>
`;

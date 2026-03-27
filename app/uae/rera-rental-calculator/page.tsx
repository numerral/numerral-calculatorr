import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAERERARentalCalculatorCore from "@/components/calculator/UAERERARentalCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "RERA Rental Increase Calculator 2025 — Dubai & Abu Dhabi",
    description: "Calculate the maximum legal rent increase in Dubai and Abu Dhabi. Based on RERA Smart Rental Index, Decree No. 43 of 2013 tiers, and Abu Dhabi's 5% cap. Includes Ejari guide and tenant rights.",
    keywords: ["RERA rental increase calculator", "Dubai rent increase calculator", "حاسبة زيادة الإيجار", "Smart Rental Index 2025", "Decree 43 2013", "Ejari registration", "Abu Dhabi Tawtheeq", "tenant rights Dubai", "landlord rental increase UAE", "RDC rental disputes"],
    alternates: { canonical: canonicalUrl("/uae/rera-rental-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is the RERA rental increase calculator?", answer: "The RERA rental increase calculator is an official tool provided by the Dubai Land Department (DLD) through its Real Estate Regulatory Agency (RERA) division. It helps tenants and landlords determine the maximum permissible rent increase upon lease renewal, based on how far the current rent is below the average market rent for similar properties in the same area. The tool is based on Decree No. 43 of 2013 and was upgraded to the 'Smart Rental Index' in January 2025, using AI and real-time data for more accurate valuations." },
    { question: "What are the RERA rental increase tiers?", answer: "Dubai's rental increase system uses 5 tiers based on Decree No. 43 of 2013: If your rent is up to 10% below the average market rate — no increase is permitted (0%). If 11–20% below — up to 5% increase. If 21–30% below — up to 10% increase. If 31–40% below — up to 15% increase. If more than 40% below — up to 20% increase. These are maximum caps and the landlord cannot increase beyond these percentages, even if they believe the rent is significantly below market." },
    { question: "How do I find the average market rent for my area?", answer: "For Dubai: visit dubailand.gov.ae and use the 'Rental Index' calculator, or download the Dubai REST app (available on iOS and Android). You'll need to enter: property type (residential/commercial), area/community, number of bedrooms, and your current annual rent. The tool will show the average market rent and whether an increase is permitted. For Abu Dhabi: check the ADREC website (adrec.gov.ae) for the Abu Dhabi Residential Rental Index." },
    { question: "How much notice must my landlord give before increasing rent?", answer: "In Dubai, landlords must provide at least 90 days' written notice before the lease expiry date if they intend to increase the rent. In Abu Dhabi, the notice period is 60 days. If the landlord fails to provide this notice on time, the rent increase cannot be legally enforced, and the lease automatically renews at the same rent. The notice must be in writing — delivered via notary public, registered mail, or as stipulated in the tenancy contract." },
    { question: "What is the difference between Dubai and Abu Dhabi rental increase rules?", answer: "Dubai uses a tiered system (0–20% based on how far below market average the rent is) through the RERA Smart Rental Index. Abu Dhabi uses a simpler flat 5% annual cap on rent increases for renewals. Dubai requires 90 days' notice; Abu Dhabi requires 60 days. Dubai uses Ejari for contract registration; Abu Dhabi uses Tawtheeq. Both systems aim to protect tenants from excessive increases but take different approaches." },
    { question: "What is Ejari and why is it required?", answer: "Ejari is Dubai's mandatory tenancy contract registration system, operated by the Dubai Land Department. Every rental contract in Dubai — residential or commercial — must be registered in Ejari within a specified period. Ejari is required for: activating DEWA (electricity and water), processing residence visas, opening bank accounts, enrolling children in school, and filing rental disputes. Without Ejari, your tenancy contract is not legally enforceable. Registration costs approximately AED 175–220 online or AED 270–320 through a trustee centre." },
    { question: "Can my landlord evict me to increase rent beyond the RERA cap?", answer: "No, a landlord cannot evict you solely to increase rent beyond the RERA-permitted amount. They can only evict at lease expiry with 12 months' notice for specific legal reasons: personal use (for themselves or a first-degree relative), sale of the property, demolition/reconstruction, or major renovation that cannot be done while occupied. If a landlord evicts for personal use and re-lets within 2 years (residential) or 3 years (non-residential), the tenant can claim compensation through the RDC." },
    { question: "What is the Smart Rental Index 2025?", answer: "The Smart Rental Index is an upgraded version of Dubai's RERA rental index calculator, launched on January 1, 2025. It uses AI analytics, real-time market data, and considers factors like building quality, property type, location demand, and amenities to provide more accurate rental valuations. Unlike the previous system, which used broader area-level averages, the Smart Index provides property-specific benchmarks. This makes the system fairer for both landlords and tenants." },
    { question: "What happens if I don't agree with the rent increase?", answer: "If your landlord proposes a rent increase and you disagree, you have several options: (1) Negotiate directly with the landlord — many increases are negotiable. (2) Check the RERA rental index to verify whether the increase is within the legal limit. (3) File a complaint with the Rental Disputes Centre (RDC) if the increase exceeds the legal cap. Filing fee is 3.5% of annual rent (min AED 500, max AED 20,000). (4) If you do not reach an agreement and the landlord has given valid notice, you may choose to vacate at lease end. (5) If the landlord did not give 90 days' notice, the lease renews at the same rent." },
    { question: "How much does it cost to file a case with the Rental Disputes Centre?", answer: "The RDC filing fee is 3.5% of the annual rent or claimed amount, with a minimum of AED 500 and a maximum of AED 20,000 for rental/lease cases. Additional fixed fees: process service (AED 100), knowledge fee (AED 10), innovation fee (AED 10), and POA registration (AED 25 if using a representative). If you file through a trustee centre, add AED 130 + VAT. The appeal deposit is 50% of the amount awarded in the original case. If you win, the judge may order the losing party to reimburse your fees." },
    { question: "What is Tawtheeq in Abu Dhabi?", answer: "Tawtheeq is Abu Dhabi's equivalent of Dubai's Ejari system. It is the mandatory tenancy contract registration system operated by the Abu Dhabi Municipality under the Department of Municipalities and Transport (DMT). All rental agreements in Abu Dhabi must be registered through Tawtheeq for the contract to be legally recognized. You need a Tawtheeq certificate for ADDC (Abu Dhabi Distribution Company) utility connection, visa processing, and to file any rental disputes." },
    { question: "Can my landlord increase rent in the middle of my lease?", answer: "No. A landlord cannot increase rent during an active lease period. Rent can only be increased upon contract renewal, and only after providing the required notice (90 days in Dubai, 60 days in Abu Dhabi). The rental increase must comply with the applicable rules — RERA tiers for Dubai and the 5% cap for Abu Dhabi. Any attempt to increase rent mid-contract is a breach of the tenancy agreement and can be challenged at the RDC." },
    { question: "What documents do I need for Ejari registration?", answer: "For Ejari registration you need: (1) Signed Unified Tenancy Contract (RERA standard form), (2) Tenant's Emirates ID (both sides, valid), (3) Tenant's passport copy with valid UAE visa page, (4) Security deposit receipt, (5) DEWA premise number or latest DEWA bill, (6) Landlord's Emirates ID or passport, (7) Title deed or property ownership certificate. For commercial properties, also provide the tenant company's trade license. Registration is done via the Dubai REST app, DLD website, or at a Real Estate Services Trustee Centre." },
    { question: "How is DEWA connected to Ejari?", answer: "DEWA (Dubai Electricity and Water Authority) services cannot be activated without a valid Ejari certificate. When you register your tenancy contract in Ejari, the DLD automatically links your property's DEWA premise number to your lease. DEWA then notifies you to complete activation. You'll need to pay a refundable security deposit (AED 2,000 for apartments, AED 4,000 for villas), plus a connection fee of AED 130, knowledge and innovation fees of AED 20, and 5% VAT. Services are typically connected within 24 hours of payment." },
    { question: "What are the grounds for eviction in Dubai?", answer: "During an active lease: non-payment of rent (30-day notice), unauthorized subletting, illegal use, property damage, or breach of contract terms. At lease expiry (12-month notice via notary/registered mail): landlord personal use or first-degree relative, sale of property, demolition/reconstruction with permits, or major renovation that cannot be done while occupied. The landlord must prove genuine need for personal use eviction and cannot own a suitable alternative property. If evicted for personal use, re-letting within 2 years entitles the tenant to compensation." },
    { question: "Does the 5% housing fee in Dubai affect my rent calculation?", answer: "The 5% housing fee (Dubai Municipality Housing Fee) is a separate charge from rent and is not included in the RERA rental increase calculation. This fee is 5% of your annual rent, divided into 12 monthly installments and added to your DEWA bill. For example, if your annual rent is AED 60,000, the housing fee is AED 3,000/year (AED 250/month), added to each DEWA bill. The housing fee applies to residential tenants in Dubai and is calculated on the registered Ejari rent." },
];

export default function RERARentalCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "RERA Rental Calculator" },
        ]),
        webAppSchema("RERA Rental Increase Calculator", canonicalUrl("/uae/rera-rental-calculator")),
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
            <Script id="schema-rera-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "RERA Rental Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>RERA Rental Increase Calculator 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the maximum legal rent increase in Dubai and Abu Dhabi. Based on the RERA Smart Rental Index, Decree No. 43 of 2013, and Abu Dhabi&apos;s 5% cap. Includes notice period validation, Ejari guide, and tenant rights.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAERERARentalCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="RERA Rental Calculator FAQ" items={FAQ_ITEMS} />

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
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT, tourist refund</div>
                        </div>
                    </Link>
                    <Link href="/loan-calculators/emi-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">📊</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">EMI Calculator</div>
                            <div className="uae-related-link__desc">General loan EMI calculation</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-rera">What Is RERA?</h2>
    <p><strong>RERA</strong> (Real Estate Regulatory Agency) is the regulatory arm of the <strong>Dubai Land Department (DLD)</strong>, responsible for governing the rental and real estate market in Dubai. Established to protect both landlords and tenants, RERA administers the <strong>Smart Rental Index</strong> — a tool that determines the maximum legally permissible rent increase upon lease renewal.</p>
    <p>RERA&apos;s rental increase system is one of the most structured in the GCC, offering clear, transparent rules that prevent arbitrary rent hikes. Understanding how it works is critical for anyone renting in Dubai — whether you&apos;re a tenant checking if your landlord&apos;s proposed increase is legal, or a landlord determining the maximum you can charge.</p>

    <h2 id="decree-43">Decree No. 43 of 2013 — The Rental Increase Framework</h2>
    <p><strong>Decree No. 43 of 2013</strong>, issued by the Ruler of Dubai, establishes the tiered system for allowable rent increases. The system compares your <strong>current rent</strong> to the <strong>average market rent</strong> for similar properties in the same area. The larger the gap, the higher the permitted increase — up to a maximum of 20%.</p>
    <table>
        <thead><tr><th>Current Rent vs Average Market Rent</th><th>Maximum Increase</th><th>Example (AED 60,000 rent)</th></tr></thead>
        <tbody>
            <tr><td>Up to <strong>10% below</strong> average</td><td><strong>0% (No increase)</strong></td><td>Rent stays AED 60,000</td></tr>
            <tr><td><strong>11–20% below</strong> average</td><td>Up to <strong>5%</strong></td><td>Max AED 63,000 (+3,000)</td></tr>
            <tr><td><strong>21–30% below</strong> average</td><td>Up to <strong>10%</strong></td><td>Max AED 66,000 (+6,000)</td></tr>
            <tr><td><strong>31–40% below</strong> average</td><td>Up to <strong>15%</strong></td><td>Max AED 69,000 (+9,000)</td></tr>
            <tr><td><strong>More than 40% below</strong></td><td>Up to <strong>20%</strong></td><td>Max AED 72,000 (+12,000)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key point:</strong> If your current rent is within 10% of the market average, your landlord <strong>cannot increase rent at all</strong>. Many tenants don't know this — if you're already paying near-market rate, you're protected from any increase.
    </div>

    <h2 id="smart-rental-index">Smart Rental Index 2025</h2>
    <p>On <strong>January 1, 2025</strong>, Dubai upgraded its rental index to the <strong>Smart Rental Index</strong> — an AI-driven system that provides more accurate, property-specific valuations. Key improvements:</p>
    <ul>
        <li><strong>AI analytics</strong> — Uses machine learning and real-time transaction data</li>
        <li><strong>Building-level precision</strong> — Considers building quality, age, facilities, and demand</li>
        <li><strong>Frequent updates</strong> — More regular data refreshes vs the old annual updates</li>
        <li><strong>Location granularity</strong> — Distinguishes between micro-areas within communities</li>
        <li><strong>Amenity weighting</strong> — Factors like pool, gym, parking, and metro proximity</li>
    </ul>
    <p>You can access the Smart Rental Index at <strong>dubailand.gov.ae</strong> or via the <strong>Dubai REST app</strong> (available on iOS and Android). Enter your property type, area, bedrooms, and current rent to see the average market value and whether an increase is permitted.</p>

    <h2 id="worked-examples">Worked Examples</h2>

    <h3>Example 1: No Increase (Within 10%)</h3>
    <table>
        <thead><tr><th>Item</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Current annual rent</td><td>AED 72,000</td></tr>
            <tr><td>RERA average market rent</td><td>AED 78,000</td></tr>
            <tr><td>Difference</td><td>AED 6,000 (7.7% below average)</td></tr>
            <tr><td>Applicable tier</td><td><strong>0–10% below → No increase</strong></td></tr>
            <tr><td>New rent</td><td><strong>AED 72,000 (unchanged)</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: 5% Increase (15% Below)</h3>
    <table>
        <thead><tr><th>Item</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Current annual rent</td><td>AED 55,000</td></tr>
            <tr><td>RERA average market rent</td><td>AED 65,000</td></tr>
            <tr><td>Difference</td><td>AED 10,000 (15.4% below average)</td></tr>
            <tr><td>Applicable tier</td><td><strong>11–20% below → Up to 5%</strong></td></tr>
            <tr><td>Max increase</td><td>AED 55,000 × 5% = AED 2,750</td></tr>
            <tr><td>New rent</td><td><strong>AED 57,750 maximum</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 3: 20% Increase (50% Below)</h3>
    <table>
        <thead><tr><th>Item</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Current annual rent</td><td>AED 40,000</td></tr>
            <tr><td>RERA average market rent</td><td>AED 80,000</td></tr>
            <tr><td>Difference</td><td>AED 40,000 (50% below average)</td></tr>
            <tr><td>Applicable tier</td><td><strong>&gt;40% below → Up to 20%</strong></td></tr>
            <tr><td>Max increase</td><td>AED 40,000 × 20% = AED 8,000</td></tr>
            <tr><td>New rent</td><td><strong>AED 48,000 maximum</strong></td></tr>
        </tbody>
    </table>

    <h2 id="dubai-vs-abudhabi">Dubai vs Abu Dhabi — Rental Increase Rules</h2>
    <table>
        <thead><tr><th>Aspect</th><th>Dubai</th><th>Abu Dhabi</th></tr></thead>
        <tbody>
            <tr><td><strong>System</strong></td><td>Tiered (0–20%)</td><td>Flat 5% cap</td></tr>
            <tr><td><strong>Legal basis</strong></td><td>Decree No. 43/2013</td><td>DMT regulations</td></tr>
            <tr><td><strong>Index tool</strong></td><td>Smart Rental Index</td><td>ADREC Rental Index</td></tr>
            <tr><td><strong>Notice period</strong></td><td>90 days</td><td>60 days</td></tr>
            <tr><td><strong>Contract system</strong></td><td>Ejari</td><td>Tawtheeq</td></tr>
            <tr><td><strong>Disputes</strong></td><td>RDC (rdc.gov.ae)</td><td>AD Rental Disputes Centre</td></tr>
            <tr><td><strong>Governing law</strong></td><td>Law No. 26/2007</td><td>Law No. 20/2006</td></tr>
        </tbody>
    </table>

    <h2 id="ejari">Ejari System — Registration, Renewal & Cancellation</h2>
    <p><strong>Ejari</strong> (which means "my rent" in Arabic) is Dubai&apos;s mandatory tenancy contract registration system. Every rental contract must be registered in Ejari for it to be legally enforceable.</p>

    <h3>Why Ejari Is Mandatory</h3>
    <ul>
        <li><strong>DEWA activation</strong> — Cannot connect electricity and water without Ejari</li>
        <li><strong>Visa processing</strong> — Required for residence visa applications</li>
        <li><strong>School enrollment</strong> — Schools require proof of residence via Ejari</li>
        <li><strong>Banking</strong> — Some banks require Ejari for account opening</li>
        <li><strong>Dispute resolution</strong> — RDC only accepts cases with valid Ejari</li>
    </ul>

    <h3>Ejari Fees</h3>
    <table>
        <thead><tr><th>Fee</th><th>Online (Dubai REST)</th><th>Trustee Centre</th></tr></thead>
        <tbody>
            <tr><td>Registration fee</td><td>AED 100</td><td>AED 100</td></tr>
            <tr><td>Knowledge fee</td><td>AED 10</td><td>AED 10</td></tr>
            <tr><td>Innovation fee</td><td>AED 10</td><td>AED 10</td></tr>
            <tr><td>Service partner</td><td>AED 55</td><td>AED 130 + VAT</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>AED 175–220</strong></td><td><strong>AED 270–320</strong></td></tr>
        </tbody>
    </table>

    <h3>Documents Required</h3>
    <ul>
        <li>Signed Unified Tenancy Contract (RERA standard form)</li>
        <li>Tenant&apos;s Emirates ID (both sides, valid)</li>
        <li>Tenant&apos;s passport copy with valid UAE visa page</li>
        <li>Security deposit receipt (if applicable)</li>
        <li>DEWA premise number or latest DEWA bill</li>
        <li>Landlord&apos;s Emirates ID/passport and title deed</li>
    </ul>

    <h2 id="tenant-rights">Tenant Rights — Law No. 26 of 2007</h2>
    <p><strong>Law No. 26 of 2007</strong> (as amended by Law No. 33 of 2008) governs all landlord-tenant relationships in Dubai. Key tenant protections:</p>
    <ul>
        <li><strong>No mid-contract rent increase</strong> — Rent can only be increased at renewal</li>
        <li><strong>90-day notice requirement</strong> — No notice = no increase</li>
        <li><strong>RERA cap applies</strong> — Landlord cannot exceed the tier-based maximum</li>
        <li><strong>Auto-renewal</strong> — If tenant stays after contract end without objection, lease renews at same terms (for the shorter of the original period or 1 year)</li>
        <li><strong>Deposit refund</strong> — Landlord must return security deposit at lease end, minus legitimate deductions</li>
        <li><strong>Maintenance obligation</strong> — Landlord is generally responsible for structural maintenance</li>
        <li><strong>No eviction for non-payment without 30-day notice</strong> — Written warning required first</li>
    </ul>

    <h2 id="landlord-rights">Landlord Rights and Eviction Grounds</h2>

    <h3>Eviction During Active Lease</h3>
    <ul>
        <li><strong>Non-payment of rent</strong> — After 30-day written notice to pay</li>
        <li><strong>Unauthorized subletting</strong> — Without landlord&apos;s written consent</li>
        <li><strong>Illegal use</strong> — Using property for illegal or immoral activities</li>
        <li><strong>Property damage</strong> — Endangering safety or making unauthorized modifications</li>
        <li><strong>Commercial vacancy</strong> — Leaving commercial property empty for 30+ consecutive or 90+ non-consecutive days</li>
    </ul>

    <h3>Eviction at Lease Expiry (12-Month Notice Required)</h3>
    <ul>
        <li><strong>Personal use</strong> — Landlord or first-degree relative needs the property. Must not own a suitable alternative.</li>
        <li><strong>Sale of property</strong> — Owner wishes to sell the leased property</li>
        <li><strong>Demolition/reconstruction</strong> — With Dubai Municipality approval and construction permits</li>
        <li><strong>Major renovation</strong> — That cannot be performed while occupied, verified by a technical report</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Protection:</strong> If a landlord evicts for "personal use" and re-lets the property within <strong>2 years</strong> (residential) or <strong>3 years</strong> (non-residential), the former tenant can claim <strong>compensation</strong> through the RDC.
    </div>

    <h2 id="disputes">Rental Disputes Centre (RDC)</h2>
    <p>The <strong>Rental Disputes Centre (RDC)</strong>, established in 2013 under the DLD, handles all rental disagreements in Dubai.</p>
    <table>
        <thead><tr><th>Aspect</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Filing location</strong></td><td>RDC office, trustee centres, or online (rdc.gov.ae / Dubai REST)</td></tr>
            <tr><td><strong>Filing fee</strong></td><td>3.5% of annual rent (min AED 500, max AED 20,000)</td></tr>
            <tr><td><strong>Additional fees</strong></td><td>Process service AED 100 + Knowledge AED 10 + Innovation AED 10</td></tr>
            <tr><td><strong>Amicable settlement</strong></td><td>Available before litigation — conciliator appointed</td></tr>
            <tr><td><strong>Verdict timeline</strong></td><td>Typically within 30 days</td></tr>
            <tr><td><strong>Appeal</strong></td><td>Within 15 days; deposit = 50% of awarded amount</td></tr>
            <tr><td><strong>Appeal threshold</strong></td><td>AED 50,000 (general) / AED 100,000 (financial-only) / no limit for eviction</td></tr>
        </tbody>
    </table>

    <h2 id="dewa">DEWA Connection After Ejari</h2>
    <p>DEWA services are automatically linked when Ejari is registered. Costs:</p>
    <table>
        <thead><tr><th>Fee</th><th>Apartment</th><th>Villa</th></tr></thead>
        <tbody>
            <tr><td>Security deposit (refundable)</td><td>AED 2,000</td><td>AED 4,000</td></tr>
            <tr><td>Connection fee</td><td>AED 130</td><td>AED 130</td></tr>
            <tr><td>Knowledge & innovation</td><td>AED 20</td><td>AED 20</td></tr>
            <tr><td>VAT (5%)</td><td>~AED 108</td><td>~AED 208</td></tr>
            <tr><td><strong>Total</strong></td><td><strong>~AED 2,258</strong></td><td><strong>~AED 4,358</strong></td></tr>
        </tbody>
    </table>
    <p>The <strong>5% Housing Fee</strong> (Dubai Municipality) is also added to your monthly DEWA bill: 5% of annual rent ÷ 12. For a rent of AED 60,000, this is AED 250/month.</p>

    <h2 id="common-mistakes">Common Mistakes When Dealing With Rent Increases</h2>
    <ol>
        <li><strong>Not checking the RERA index</strong> — Many tenants accept increases without verifying if they&apos;re within the legal cap</li>
        <li><strong>Ignoring the notice period</strong> — If your landlord didn&apos;t give 90 days&apos; notice (Dubai) or 60 days (Abu Dhabi), the increase is unenforceable</li>
        <li><strong>Using the wrong area average</strong> — Make sure you check the average for your exact community, not the broader area</li>
        <li><strong>Confusing Dubai and Abu Dhabi rules</strong> — Dubai uses tiers, Abu Dhabi has a flat 5% cap</li>
        <li><strong>Not registering Ejari</strong> — Without valid Ejari, you cannot file a dispute at the RDC</li>
        <li><strong>Accepting verbal notice</strong> — Notice must be in <strong>writing</strong> (notary public or registered mail)</li>
        <li><strong>Forgetting about the housing fee</strong> — The 5% municipality fee is separate from rent and isn&apos;t covered by the RERA cap</li>
        <li><strong>Assuming the landlord can charge the RERA average</strong> — The cap applies to the <strong>increase %</strong>, not setting rent to the average itself</li>
    </ol>

    <h2 id="tips">Tips for Tenants and Landlords</h2>

    <h3>For Tenants</h3>
    <ul>
        <li><strong>Check the RERA index before renewal</strong> — Know your rights before your landlord contacts you</li>
        <li><strong>Document everything</strong> — Save all correspondence, notices, and receipts</li>
        <li><strong>Register Ejari immediately</strong> — Don&apos;t delay, as it affects DEWA and dispute rights</li>
        <li><strong>Negotiate</strong> — Even if an increase is legal, you can often negotiate a lower amount</li>
        <li><strong>Know your eviction protections</strong> — Landlords need valid legal grounds and proper notice</li>
    </ul>

    <h3>For Landlords</h3>
    <ul>
        <li><strong>Serve notice on time</strong> — 90 days before lease end in Dubai, 60 days in Abu Dhabi</li>
        <li><strong>Use written notice</strong> — Via notary public or registered mail for legal enforceability</li>
        <li><strong>Stay within RERA caps</strong> — Exceeding the maximum can result in disputes and legal costs</li>
        <li><strong>Maintain the property</strong> — Good maintenance retains tenants and justifies market-rate rents</li>
        <li><strong>Keep Ejari current</strong> — Expired or missing Ejari weakens your position in disputes</li>
    </ul>
`;

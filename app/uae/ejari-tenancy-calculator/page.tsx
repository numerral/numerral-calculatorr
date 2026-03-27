import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEEjariTenancyCalculatorCore from "@/components/calculator/UAEEjariTenancyCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Ejari & Tenancy Cost Calculator UAE 2025 — Dubai & Abu Dhabi",
    description: "Calculate the total cost of renting in the UAE: security deposit, agency fee, Ejari/Tawtheeq registration, DEWA/ADDC deposit, and first-year total. Covers Dubai (Ejari) and Abu Dhabi (Tawtheeq) with 2025 fees.",
    keywords: ["Ejari calculator", "Ejari cost 2025", "Dubai tenancy calculator", "Tawtheeq Abu Dhabi cost", "total cost renting Dubai", "security deposit Dubai", "agency fee UAE", "DEWA deposit", "move-in cost Dubai", "first year rent cost UAE"],
    alternates: { canonical: canonicalUrl("/uae/ejari-tenancy-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is Ejari and why is it mandatory in Dubai?", answer: "Ejari (Arabic for 'my rent') is Dubai's official tenancy contract registration system, managed by the Dubai Land Department (DLD) and regulated by RERA. Every rental agreement in Dubai — whether residential or commercial — must be registered through Ejari. It's legally mandatory and required for: activating DEWA (electricity and water), processing or renewing residency visas, enrolling children in school, obtaining trade licenses for commercial properties, and pursuing any rental dispute through the Rental Dispute Settlement Centre (RDSC). Without a valid Ejari certificate, tenants cannot access essential government services." },
    { question: "How much does Ejari registration cost in 2025?", answer: "Ejari registration costs depend on your chosen method: Online via the Dubai REST app or DLD website costs approximately AED 120 (AED 100 base fee + AED 10 knowledge fee + AED 10 innovation fee) plus 5% VAT, totaling around AED 126. Through a Real Estate Services Trustee Center (typing center), the cost is approximately AED 235 (AED 120 base + AED 95 service partner fee + AED 20 knowledge/innovation fees) plus VAT and possible additional typing charges of AED 30–100, bringing the total to AED 265–320. Renewal costs the same as initial registration through either method." },
    { question: "How do I cancel Ejari and is there a fee?", answer: "Ejari cancellation is free when done online through the Dubai REST app. Simply log in with your UAE Pass, select your registered tenancy, and submit a cancellation request. Through a typing center, cancellation costs approximately AED 40–60. You'll need: the original Ejari certificate, a final DEWA bill showing no outstanding balance, and a No Objection Certificate (NOC) from the landlord. It's crucial to cancel Ejari when moving out — an active Ejari on your old property can prevent you from registering a new rental or cause issues with DEWA setup at your new address." },
    { question: "What is the security deposit for renting in Dubai?", answer: "The standard security deposit in Dubai is 5% of the annual rent for unfurnished properties and 10% for furnished properties. For example, an unfurnished apartment at AED 80,000/year requires a AED 4,000 deposit. The deposit is fully refundable when you vacate, provided: the property is returned in good condition (normal wear and tear accepted), there are no outstanding utility bills, and you've completed DEWA disconnection. The landlord must refund the deposit within 14 days of vacating. Any deductions must be justified with receipts or evidence of damage beyond normal wear." },
    { question: "How much is the agency fee when renting in the UAE?", answer: "The standard real estate agency fee in the UAE is 5% of the annual rent, paid by the tenant to the broker who facilitated the rental. This fee is non-refundable and is typically due at the time of signing the tenancy contract. A 5% VAT is also applied to the brokerage service, making the effective agency cost 5.25% of annual rent. For example, on AED 80,000 annual rent: agency fee = AED 4,000 + AED 200 VAT = AED 4,200. Some brokers may charge a flat fee (e.g., AED 5,000) regardless of rent amount. You can avoid this fee entirely by dealing directly with the landlord." },
    { question: "What is the DEWA deposit and connection fee?", answer: "DEWA (Dubai Electricity and Water Authority) charges a refundable security deposit to activate services: AED 2,000 for apartments and AED 4,000 for villas. Additionally, non-refundable connection fees apply: AED 100 for activation + AED 10 knowledge fee + AED 10 innovation fee = AED 120 total. The deposit is returned when you permanently cancel your DEWA account (usually when leaving Dubai or when the landlord takes over the account). You can register for DEWA online through the DEWA app or website using your Ejari certificate, Emirates ID, and passport." },
    { question: "What is the total upfront cost of renting in Dubai?", answer: "For an unfurnished apartment at AED 80,000/year in Dubai, total upfront costs are approximately: Security deposit (5%): AED 4,000 + Agency fee (5% + VAT): AED 4,200 + Ejari registration: AED 220 + DEWA deposit: AED 2,000 + DEWA connection: AED 130 + Internet setup: AED 350 + Moving: AED 1,500 = Total: approximately AED 12,400. This equals about 15.5% of annual rent in additional costs, BEFORE your first rent cheque. Adding the first quarterly cheque (AED 20,000 for 4-cheque payment), you need approximately AED 32,400 available on move-in day." },
    { question: "What is Tawtheeq and how does it differ from Ejari?", answer: "Tawtheeq is Abu Dhabi's equivalent of Dubai's Ejari — the mandatory tenancy contract registration system. Key differences: Tawtheeq is managed by the Abu Dhabi Judiciary (vs DLD for Ejari), costs less at AED 50–100 per contract (vs AED 120–320 for Ejari), is registered through SmartHub/TAMM portal (vs Dubai REST app), and is the landlord's responsibility to register. Both systems serve the same purpose: legalizing tenancy contracts, protecting tenant/landlord rights, and enabling access to government services (utilities, visa, school). The municipality fee (5% of rent) appears on your ADDC bill based on Tawtheeq registration, just as it appears on DEWA based on Ejari." },
    { question: "How many cheques should I offer for rent in Dubai?", answer: "The number of cheques affects your cash flow and potentially your rental rate: 1 cheque (full year upfront) — best rate, typically 5–10% discount, but requires the entire annual rent available at once. 2 cheques (semi-annual) — good rate, two large payments. 4 cheques (quarterly) — the most common arrangement, standard pricing. 6 cheques (bi-monthly) — increasingly available. 12 cheques (monthly) — growing trend since January 2025 Ejari reforms, but may come with 2–5% premium. In 2025, 49% of Dubai landlords accept 4+ cheques. The UAE Direct Debit System (UAEDDS) is making monthly payments more mainstream." },
    { question: "What is the municipality fee on my utility bill?", answer: "The municipality fee (also called housing fee) is an annual charge of 5% of your rental contract value, collected monthly through your utility bill — DEWA in Dubai or ADDC in Abu Dhabi. The fee is calculated based on the rent registered in your Ejari (Dubai) or Tawtheeq (Abu Dhabi) contract. For example, AED 80,000 annual rent = AED 4,000/year = AED 333.33/month added to your utility bill. This fee funds municipal services including waste collection, public area maintenance, street cleaning, and infrastructure upkeep. It applies to all tenants and is shown as a separate line item on your monthly bill." },
    { question: "What documents do I need for Ejari registration?", answer: "To register Ejari in Dubai, you need: (1) Signed Unified Tenancy Contract — the official form with landlord and tenant signatures. (2) Tenant Emirates ID + passport copy. (3) Landlord Emirates ID or passport copy. (4) Title deed or property ownership certificate. (5) DEWA premise number or latest DEWA bill. (6) Security deposit receipt (optional but recommended). For commercial properties, a trade license copy is also required. For cancellation, you'll need the Ejari certificate, final DEWA bill with zero balance, and a landlord NOC." },
    { question: "Is it cheaper to rent in Abu Dhabi than Dubai?", answer: "Generally yes — Abu Dhabi offers 15–30% lower rents than comparable Dubai areas. Additionally, Abu Dhabi has lower ancillary costs: Tawtheeq registration (AED 50–100) is cheaper than Ejari (AED 120–320), ADDC utility bills are typically AED 100–250/month less than DEWA for the same usage, and ADDC deposits are similar (AED 2,000–3,000). However, Abu Dhabi's market is catching up — apartment rents grew ~23% in 2025. Use our Rent Affordability Calculator to compare options across both emirates." },
    { question: "Can I negotiate the agency fee in Dubai?", answer: "The 5% agency fee is market standard but technically negotiable. Strategies: (1) Deal directly with the landlord — eliminates the fee entirely (save 5%+). (2) Ask for a flat fee — some agents accept AED 3,000–5,000 regardless of rent. (3) Negotiate a split — ask if landlord and tenant can each pay 2.5%. (4) Look for landlord-listed properties on Dubizzle or Bayut marked 'direct from owner'. (5) For high-value properties (AED 200,000+ rent), agents may reduce the percentage. Note: In 2025, some Dubai brokerages offer 0% commission for tenants on select listings." },
    { question: "What happens if I break my lease early in Dubai?", answer: "Early termination of a Dubai lease is governed by your tenancy contract and RERA regulations: If your contract has an early termination clause: follow its terms (typically 2 months' notice + 1–2 months' rent penalty). If no clause exists: you're liable for rent until the contract end date, unless you and the landlord reach a mutual agreement. To legally exit: serve a 90-day written notice (12-month notice for landlord-initiated non-renewal), ensure DEWA is settled, cancel Ejari, and get your security deposit back. Always review the early termination clause before signing — it's your most important protection." },
    { question: "How do I get my security deposit back when moving out?", answer: "To recover your full security deposit: (1) Give proper notice — usually 2–3 months before lease end. (2) Arrange a property inspection with the landlord or property manager. (3) Fix any damage beyond normal wear and tear before the final walkthrough. (4) Settle all outstanding DEWA/ADDC bills and get a final clearance. (5) Cancel your Ejari/Tawtheeq registration. (6) Return all keys and access cards. The landlord must refund your deposit within 14 days. If they withhold it unjustly, you can file a complaint with RERA (Dubai) or the Abu Dhabi Municipality. Document the property condition with photos at both move-in and move-out." },
];

export default function EjariTenancyCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Ejari & Tenancy Calculator" },
        ]),
        webAppSchema("Ejari & Tenancy Cost Calculator UAE", canonicalUrl("/uae/ejari-tenancy-calculator")),
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
            <Script id="schema-ejari" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Ejari & Tenancy Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Ejari & Tenancy Cost Calculator UAE 2025 — Dubai & Abu Dhabi</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the true total cost of renting in the UAE — not just the headline rent. Enter your annual rent to see a complete breakdown of security deposit, agency fee, Ejari/Tawtheeq registration, DEWA/ADDC deposit, moving costs, and your first-year grand total. Covers both Dubai (Ejari) and Abu Dhabi (Tawtheeq) with 2025 fees.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEEjariTenancyCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Ejari & UAE Tenancy FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/rent-affordability-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Rent Affordability Calculator</div>
                            <div className="uae-related-link__desc">Find out how much rent you can afford on your salary</div>
                        </div>
                    </Link>
                    <Link href="/uae/dewa-bill-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">⚡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Estimate monthly DEWA costs for your Dubai rental</div>
                        </div>
                    </Link>
                    <Link href="/uae/addc-bill-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🔌</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">ADDC Bill Calculator</div>
                            <div className="uae-related-link__desc">Abu Dhabi electricity & water cost estimate</div>
                        </div>
                    </Link>
                    <Link href="/uae/rera-rental-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">📊</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">RERA Rental Calculator</div>
                            <div className="uae-related-link__desc">Check legal rent increase limits at renewal</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Verify your take-home pay before committing to rent</div>
                        </div>
                    </Link>
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">VAT Calculator</div>
                            <div className="uae-related-link__desc">Calculate 5% VAT on agency fees and services</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-ejari">What Is Ejari? — Dubai's Tenancy Registration System</h2>
    <p><strong>Ejari</strong> (Arabic: "my rent") is Dubai's mandatory online tenancy contract registration system. Managed by the <strong>Dubai Land Department (DLD)</strong> and regulated by the <strong>Real Estate Regulatory Agency (RERA)</strong>, Ejari was established to formalize and record all rental agreements in Dubai.</p>
    <p>Every residential and commercial rental contract in Dubai must be registered through Ejari. The system ensures transparency, prevents disputes, and protects the legal rights of both landlords and tenants. It creates a permanent government record of the lease terms, rent amount, and parties involved.</p>
    <h3>What You Need Ejari For</h3>
    <ul>
        <li><strong>DEWA activation:</strong> You cannot open a <a href="/uae/dewa-bill-calculator">DEWA account</a> without a valid Ejari certificate</li>
        <li><strong>Residency visa:</strong> Required for processing or renewing your residence visa</li>
        <li><strong>School enrollment:</strong> Dubai schools require proof of address via Ejari</li>
        <li><strong>Trade license:</strong> Commercial Ejari needed for business operations</li>
        <li><strong>Legal disputes:</strong> Only registered contracts are recognized by the Rental Dispute Settlement Centre (RDSC)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Without Ejari:</strong> You cannot activate utilities, sponsor family visas, enroll children in school, or pursue legal action in rental disputes. It's not optional — it's legally required.
    </div>

    <h2 id="ejari-cost">Ejari Registration Cost Breakdown (2025)</h2>
    <p>Ejari registration can be done online or at a physical typing center. The costs differ significantly:</p>
    <table>
        <thead><tr><th>Method</th><th>Base Fee</th><th>Other Fees</th><th>Total (incl. VAT)</th></tr></thead>
        <tbody>
            <tr><td><strong>Online (Dubai REST app / DLD website)</strong></td><td>AED 100</td><td>Knowledge AED 10 + Innovation AED 10</td><td>~AED 126</td></tr>
            <tr><td><strong>Typing center (in person)</strong></td><td>AED 120</td><td>Service AED 95 + K&I AED 20 + typing AED 30–100</td><td>~AED 280–350</td></tr>
        </tbody>
    </table>
    <p><strong>Renewal:</strong> Same fees as initial registration for both methods. <strong>Cancellation:</strong> Free through the Dubai REST app; AED 40–60 at typing centers.</p>
    <div class="explanation__highlight">
        <strong>Pro tip:</strong> Always use the <strong>Dubai REST app</strong> for Ejari services — it's faster (same day), cheaper (AED 126 vs AED 280+), and you can do everything from your phone. Download it from the App Store or Google Play.
    </div>

    <h2 id="tawtheeq">Tawtheeq — Abu Dhabi's Tenancy Registration</h2>
    <p><strong>Tawtheeq</strong> is Abu Dhabi's equivalent of Dubai's Ejari. Managed by the <strong>Abu Dhabi Judiciary</strong>, it serves the same purpose: legalizing tenancy contracts and enabling access to government services like <a href="/uae/addc-bill-calculator">ADDC utilities</a>, visa processing, and school enrollment.</p>
    <table>
        <thead><tr><th>Fee Type</th><th>Amount</th><th>Paid By</th></tr></thead>
        <tbody>
            <tr><td><strong>Property registration (first time)</strong></td><td>AED 900–1,000</td><td>Landlord</td></tr>
            <tr><td><strong>Unit registration</strong></td><td>AED 5/unit</td><td>Landlord</td></tr>
            <tr><td><strong>New tenancy contract</strong></td><td>AED 50–100/year</td><td>Landlord</td></tr>
            <tr><td><strong>Contract renewal</strong></td><td>AED 50/year</td><td>Landlord</td></tr>
            <tr><td><strong>Cancellation</strong></td><td>Free</td><td>—</td></tr>
            <tr><td><strong>Contracts &gt;4 years</strong></td><td>1% of first year's rent</td><td>Landlord</td></tr>
        </tbody>
    </table>
    <p>Unlike Dubai's Ejari where tenants can initiate registration, Tawtheeq registration is the <strong>landlord's responsibility</strong>. The process is done through the <strong>Abu Dhabi SmartHub</strong> or <strong>TAMM portal</strong> and typically takes one business day.</p>

    <h2 id="security-deposit">Security Deposit — Rules & Recovery</h2>
    <p>The security deposit is your largest upfront cost after the first rent cheque. UAE rules are straightforward:</p>
    <table>
        <thead><tr><th>Property Type</th><th>Deposit Rate</th><th>Example (AED 80K/yr)</th></tr></thead>
        <tbody>
            <tr><td><strong>Unfurnished</strong></td><td>5% of annual rent</td><td>AED 4,000</td></tr>
            <tr><td><strong>Furnished</strong></td><td>10% of annual rent</td><td>AED 8,000</td></tr>
        </tbody>
    </table>
    <h3>Getting Your Deposit Back</h3>
    <ol>
        <li><strong>Give proper notice</strong> — 2–3 months before lease end (check your contract)</li>
        <li><strong>Schedule a pre-inspection</strong> — landlord reviews property condition</li>
        <li><strong>Fix any damage</strong> — beyond normal wear and tear, before the final walkthrough</li>
        <li><strong>Settle utility bills</strong> — clear all <a href="/uae/dewa-bill-calculator">DEWA</a>/<a href="/uae/addc-bill-calculator">ADDC</a> balances</li>
        <li><strong>Cancel Ejari/Tawtheeq</strong> — must be done before landlord can register new tenant</li>
        <li><strong>Return all keys</strong> — including access cards, parking remotes</li>
    </ol>
    <p>The landlord must refund your deposit within <strong>14 days</strong> of vacating. If they withhold it unjustly, file a complaint with <strong>RERA</strong> (Dubai) or the <strong>Abu Dhabi Municipality</strong>.</p>

    <h2 id="agency-fee">Agency Fee — What You Actually Pay</h2>
    <p>The standard real estate agency fee in the UAE is <strong>5% of the annual rent</strong>, paid by the tenant to the broker. With 5% VAT on services, the effective agency cost is <strong>5.25%</strong>.</p>
    <table>
        <thead><tr><th>Annual Rent</th><th>Agency Fee (5%)</th><th>+ VAT (5%)</th><th>Total Agency Cost</th></tr></thead>
        <tbody>
            <tr><td>AED 50,000</td><td>AED 2,500</td><td>AED 125</td><td>AED 2,625</td></tr>
            <tr><td>AED 80,000</td><td>AED 4,000</td><td>AED 200</td><td>AED 4,200</td></tr>
            <tr><td>AED 120,000</td><td>AED 6,000</td><td>AED 300</td><td>AED 6,300</td></tr>
            <tr><td>AED 200,000</td><td>AED 10,000</td><td>AED 500</td><td>AED 10,500</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Save the agency fee:</strong> Look for "direct from owner" listings on Dubizzle or Bayut. Dealing directly eliminates the 5% commission entirely. For AED 80,000 rent, that's AED 4,200 saved.
    </div>

    <h2 id="dewa-addc-deposit">DEWA & ADDC Deposits</h2>
    <p>Setting up utilities requires a refundable security deposit:</p>
    <table>
        <thead><tr><th>Utility</th><th>Apartment</th><th>Villa</th><th>Connection Fee</th></tr></thead>
        <tbody>
            <tr><td><strong>DEWA (Dubai)</strong></td><td>AED 2,000</td><td>AED 4,000</td><td>AED 130</td></tr>
            <tr><td><strong>ADDC (Abu Dhabi)</strong></td><td>AED 2,000</td><td>AED 3,000</td><td>~AED 100</td></tr>
        </tbody>
    </table>
    <p>The deposit is returned when you permanently close your account. Use our <a href="/uae/dewa-bill-calculator">DEWA Calculator</a> or <a href="/uae/addc-bill-calculator">ADDC Calculator</a> to estimate ongoing monthly utility costs.</p>

    <h2 id="cheque-payments">Cheque Payment Structure</h2>
    <p>UAE rent is paid through <strong>post-dated cheques</strong>, not monthly transfers. The number of cheques affects both pricing and cash flow:</p>
    <table>
        <thead><tr><th>Cheques</th><th>Payment</th><th>Impact</th></tr></thead>
        <tbody>
            <tr><td><strong>1</strong></td><td>Full year upfront</td><td>Best rate — 5–10% discount possible</td></tr>
            <tr><td><strong>2</strong></td><td>Two equal payments</td><td>Good rate — 3–5% discount</td></tr>
            <tr><td><strong>4</strong></td><td>Quarterly</td><td>Most common — standard pricing</td></tr>
            <tr><td><strong>6</strong></td><td>Bi-monthly</td><td>Increasingly accepted</td></tr>
            <tr><td><strong>12</strong></td><td>Monthly</td><td>Growing since Jan 2025 — may cost 2–5% more</td></tr>
        </tbody>
    </table>
    <p>From <strong>January 2025</strong>, new Ejari contracts may include monthly payment clauses by default. The <strong>UAEDDS</strong> (UAE Direct Debit System) is making digital payments mainstream, reducing reliance on physical cheques.</p>

    <h2 id="municipality-fee">Municipality Fee Explained</h2>
    <p>The <strong>municipality fee</strong> (housing fee) is 5% of your annual rent, collected monthly through your utility bill. It's linked to your Ejari/Tawtheeq registration, not your rental agreement directly.</p>
    <table>
        <thead><tr><th>Annual Rent</th><th>Annual Fee</th><th>Monthly on Bill</th></tr></thead>
        <tbody>
            <tr><td>AED 50,000</td><td>AED 2,500</td><td>AED 208</td></tr>
            <tr><td>AED 80,000</td><td>AED 4,000</td><td>AED 333</td></tr>
            <tr><td>AED 120,000</td><td>AED 6,000</td><td>AED 500</td></tr>
            <tr><td>AED 200,000</td><td>AED 10,000</td><td>AED 833</td></tr>
        </tbody>
    </table>
    <p>This fee funds waste management, public area maintenance, street cleaning, and infrastructure. It applies to all tenants in Dubai and Abu Dhabi.</p>

    <h2 id="first-year-cost">The True First-Year Cost of Renting</h2>
    <p>Many tenants are shocked by the gap between <strong>headline annual rent</strong> and the <strong>true first-year cost</strong>. Here's a realistic example for an unfurnished apartment in Dubai:</p>
    <table>
        <thead><tr><th>Cost Component</th><th>AED 80,000/yr apartment</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual rent</strong></td><td>AED 80,000</td></tr>
            <tr><td>Security deposit (5%)</td><td>AED 4,000</td></tr>
            <tr><td>Agency fee (5% + VAT)</td><td>AED 4,200</td></tr>
            <tr><td>Ejari registration</td><td>AED 220</td></tr>
            <tr><td>DEWA deposit + connection</td><td>AED 2,130</td></tr>
            <tr><td>Internet setup</td><td>AED 350</td></tr>
            <tr><td>Moving costs</td><td>AED 1,500</td></tr>
            <tr><td>DEWA annual estimate</td><td>AED 7,200</td></tr>
            <tr><td>Municipality fee (5%)</td><td>AED 4,000</td></tr>
            <tr><td>Internet (12 months)</td><td>AED 4,200</td></tr>
            <tr><td><strong>TOTAL FIRST-YEAR</strong></td><td><strong>AED 107,800</strong></td></tr>
        </tbody>
    </table>
    <p>That's <strong>35% more than the headline rent</strong>. Use our calculator above to compute this for your specific situation.</p>

    <h2 id="moving-costs">Moving Costs in the UAE</h2>
    <p>Professional movers and packers in Dubai and Abu Dhabi charge based on property size:</p>
    <table>
        <thead><tr><th>Property</th><th>Cost Range</th></tr></thead>
        <tbody>
            <tr><td>Studio</td><td>AED 500 – AED 1,200</td></tr>
            <tr><td>1-Bedroom</td><td>AED 800 – AED 2,500</td></tr>
            <tr><td>2-Bedroom</td><td>AED 1,300 – AED 3,500</td></tr>
            <tr><td>3-Bedroom / small villa</td><td>AED 2,000 – AED 6,000</td></tr>
            <tr><td>Large villa (4–5 BR)</td><td>AED 3,500 – AED 7,000+</td></tr>
        </tbody>
    </table>
    <p>Watch for hidden charges: stairs fees (no elevator), long carry fees (parking far from the building), dismantling/reassembly, and special handling for fragile items.</p>

    <h2 id="early-termination">Early Lease Termination</h2>
    <p>Breaking a lease early has consequences. Your options depend on your contract:</p>
    <ul>
        <li><strong>If your contract has an early termination clause:</strong> Follow its terms — typically 2 months' written notice + 1–2 months' rent as a penalty</li>
        <li><strong>If no clause exists:</strong> You may be liable for rent until the contract end date</li>
        <li><strong>Mutual agreement:</strong> Negotiate with your landlord — many will accept early termination if you find a replacement tenant</li>
    </ul>
    <p>To initiate termination: serve written notice (90 days for tenant, 12 months for landlord), settle all utility bills, cancel Ejari/Tawtheeq, and return the property in good condition to recover your deposit.</p>

    <h2 id="rera-increases">RERA Rental Increase Rules</h2>
    <p>When renewing your lease, landlords cannot increase rent arbitrarily. Dubai's RERA Rental Index caps increases based on how your current rent compares to the market average:</p>
    <table>
        <thead><tr><th>Rent vs Market Rate</th><th>Max Increase</th></tr></thead>
        <tbody>
            <tr><td>≤10% below market</td><td>No increase</td></tr>
            <tr><td>11–20% below</td><td>Up to 5%</td></tr>
            <tr><td>21–30% below</td><td>Up to 10%</td></tr>
            <tr><td>31–40% below</td><td>Up to 15%</td></tr>
            <tr><td>&gt;40% below</td><td>Up to 20%</td></tr>
        </tbody>
    </table>
    <p>Abu Dhabi uses a simpler <strong>5% annual cap</strong>. Use our <a href="/uae/rera-rental-calculator">RERA Rental Calculator</a> to check whether your landlord's proposed increase is legal.</p>

    <h2 id="tips">Tips to Minimize Tenancy Costs</h2>
    <ol>
        <li><strong>Register Ejari online</strong> — saves AED 100–200 vs typing centers</li>
        <li><strong>Deal directly with owners</strong> — eliminates 5% agency fee</li>
        <li><strong>Offer fewer cheques</strong> — 1-2 cheques can yield 5–10% rent discount</li>
        <li><strong>Sign during off-peak</strong> — July–September typically has lower demand</li>
        <li><strong>Document everything</strong> — photograph the property at move-in and move-out</li>
        <li><strong>Read the early termination clause</strong> — before signing, not after</li>
        <li><strong>Check RERA Index at renewal</strong> — ensure increases are legal</li>
        <li><strong>Use our <a href="/uae/rent-affordability-calculator">Rent Affordability Calculator</a></strong> — know your budget before searching</li>
    </ol>
`;

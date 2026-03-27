import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEADDCBillCalculatorCore from "@/components/calculator/UAEADDCBillCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "ADDC Bill Calculator 2026 — Abu Dhabi Electricity & Water (TAQA Distribution)",
    description: "Calculate your ADDC / TAQA Distribution bill for Abu Dhabi. Instant breakdown of electricity (Green/Red Band), water, meter fee, municipality fee, and VAT. Includes ADDC vs DEWA comparison and 2026 tariff tables for UAE Nationals and expatriates.",
    keywords: ["ADDC bill calculator", "Abu Dhabi electricity rates 2026", "TAQA Distribution tariff", "ADDC electricity water charges", "Abu Dhabi utility bill", "Green Band Red Band ADDC", "ADDC vs DEWA", "Abu Dhabi municipality fee", "ADDC expat rates", "Abu Dhabi water tariff"],
    alternates: { canonical: canonicalUrl("/uae/addc-bill-calculator") },
};

const FAQ_ITEMS = [
    { question: "How much is electricity per kWh in Abu Dhabi for expats in 2026?", answer: "Expatriate residents in Abu Dhabi pay 26.8 fils per kWh (AED 0.268/kWh) for consumption within the Green Band (up to 20 kWh/day for apartments, 30 kWh/day for villas). Consumption exceeding the Green Band limit is charged at the Red Band rate of 29.5 fils per kWh (AED 0.295/kWh). UAE Nationals pay significantly less: 6.7 fils/kWh (Green) and 8.1 fils/kWh (Red). These rates are set by TAQA Distribution (formerly ADDC) and include a monthly meter service fee of AED 7.84 for expats." },
    { question: "What is the Green Band and Red Band on my ADDC bill?", answer: "The Green Band and Red Band are ADDC's two-tier pricing system designed to encourage sustainable consumption. The Green Band is the standard lower rate applied when your daily usage stays within a set allowance. For expat apartments, the Green Band limit is 20 kWh/day for electricity and 0.7 m³/day for water. For villas, it's 30 kWh/day (electricity) and 5 m³/day (water). If your average daily consumption exceeds these thresholds during the billing period, the excess is charged at the higher Red Band rate. This is different from DEWA's progressive slab system in Dubai." },
    { question: "How is the municipality fee calculated on ADDC bills?", answer: "The municipality fee on ADDC bills is calculated as 5% of your annual rental contract value, divided into 12 monthly installments. The minimum annual charge is AED 450 (approximately AED 37.50 per month). For example, if your annual rent is AED 60,000, your monthly municipality fee is AED 250 (60,000 × 5% ÷ 12). This fee is collected by ADDC/TAQA Distribution on behalf of the Department of Municipalities and Transport (DMT) and is linked to your Tawtheeq tenancy registration. The fee applies to expatriate tenants only." },
    { question: "Is ADDC cheaper than DEWA?", answer: "For most expatriate residents, ADDC (Abu Dhabi) is cheaper than DEWA (Dubai) for the same consumption level. The key reasons: (1) ADDC has a flatter rate structure — expats pay 26.8–29.5 fils/kWh, while DEWA charges 23–38 fils/kWh in progressive slabs that penalize high usage. (2) ADDC has no separate fuel surcharge, while DEWA charges 6.0 fils/kWh on electricity and AED 1.10/m³ on water. (3) For 2,000–3,000 kWh monthly consumption, ADDC is typically AED 100–250 cheaper per month. However, at very low consumption (under 1,000 kWh), DEWA's lower starting slab of 23 fils/kWh can be slightly cheaper." },
    { question: "What is the average ADDC bill for a 2-bedroom apartment in Abu Dhabi?", answer: "The average ADDC bill for a 2-bedroom apartment in Abu Dhabi ranges from AED 700 to AED 1,200 per month, depending on the season. In winter (October–March), electricity consumption averages 1,500–2,000 kWh, resulting in bills of AED 500–700. In summer (June–September), heavy AC usage pushes consumption to 2,500–3,500 kWh, increasing bills to AED 900–1,400. This total includes electricity, water, meter service fee, municipality fee (varies with rent), and 5% VAT. The municipality fee alone can add AED 200–500/month depending on your rental contract value." },
    { question: "How do UAE Nationals' electricity rates differ from expats?", answer: "UAE Nationals benefit from substantially subsidized utility rates — approximately 75–85% lower than expatriate rates. For electricity, nationals pay 6.7 fils/kWh (Green Band) versus 26.8 fils/kWh for expats — a 75% discount. For water, nationals pay AED 2.09/m³ versus AED 7.84/m³ for expats — a 73% discount. The monthly meter service fee is also lower: AED 5.23 for nationals versus AED 7.84 for expats. Additionally, UAE National villa owners have an extremely generous Green Band limit of 400 kWh/day for electricity (vs. 30 kWh/day for expat villas). Social card holders may receive free utility services." },
    { question: "What is TAQA Distribution?", answer: "TAQA Distribution is the new unified brand formed from the merger of Abu Dhabi Distribution Company (ADDC) and Al Ain Distribution Company (AADC) in January 2025. It operates under TAQA Group (Abu Dhabi National Energy Company). Both ADDC and AADC now function under this single brand, ensuring consistent tariff rates across Abu Dhabi city, the Western Region (Al Dhafra), and Al Ain. The website is taqadistribution.com, though addc.ae still functions. The tariff structure, Green/Red Band system, and all service features remain the same from before the merger." },
    { question: "How do I pay my ADDC bill online?", answer: "You can pay your ADDC/TAQA Distribution bill through multiple channels: (1) TAQA Distribution mobile app (iOS and Android) — supports autopay, bill breakdown, and multi-property management. (2) TAQA Distribution e-services portal (online). (3) TAMM government portal (tamm.abudhabi.ae). (4) Partner bank channels — ADCB, FAB, and others via internet banking, mobile apps, or WhatsApp banking. (5) MBME self-service kiosks (locations across Abu Dhabi). (6) Quick Pay — enter your account number on the TAQA website without logging in. Direct debit and autopay options are available for automatic monthly payments." },
    { question: "What are the water charges in Abu Dhabi per cubic meter?", answer: "Water charges in Abu Dhabi (ADDC/TAQA Distribution) for expatriate residents are: Green Band rate of AED 7.84 per cubic meter for consumption within the daily allowance (0.7 m³/day for apartments, 5 m³/day for villas), and Red Band rate of AED 10.41 per cubic meter for excess consumption. UAE Nationals pay AED 2.09/m³ (Green) and AED 2.60/m³ (Red), with a higher Green Band limit of 7 m³/day for villas. Commercial and industrial customers pay a flat rate of AED 10.41/m³. All rates are subject to 5% VAT." },
    { question: "Does ADDC have a fuel surcharge like DEWA?", answer: "No, ADDC does not have a separate fuel surcharge. Unlike DEWA (Dubai), which explicitly itemizes a variable fuel surcharge on bills (currently 6.0 fils/kWh for electricity and AED 1.10/m³ for water), ADDC's fuel-related costs are built into the base tariff rates. This is one reason ADDC bills can appear simpler with fewer line items than DEWA bills. The absence of a separate fuel surcharge means ADDC rates are less volatile — they don't fluctuate with global fuel prices the way DEWA's surcharge does." },
    { question: "How do I read my ADDC smart meter?", answer: "To read your ADDC/TAQA Distribution smart meter: (1) Press the Display or Scroll button to wake the screen. (2) Cycle through screens until you see a number followed by 'kWh' (electricity) or an 'm³' reading (water). (3) Record all digits before the decimal point. (4) Subtract your previous reading from the current one to calculate your consumption. Smart meters automatically transmit readings to TAQA Distribution, reducing estimated bills. The TAQA mobile app also displays real-time consumption data if your smart meter is linked. TAQA has been rolling out smart meters across Abu Dhabi since 2016." },
    { question: "What are commercial electricity rates in Abu Dhabi?", answer: "Commercial electricity in Abu Dhabi is charged at a flat rate of 20.0 fils per kWh (AED 0.200/kWh) with no Green/Red Band system — it's a single-tier rate regardless of consumption. The monthly meter service fee for commercial customers is AED 7.84. Commercial water is charged at AED 10.41 per cubic meter. Industrial customers pay a lower electricity rate of 15.0 fils/kWh, while government institutions pay the highest at 29.4 fils/kWh. Agricultural customers receive the most subsidized rate at just 3.0 fils/kWh. All commercial rates are subject to 5% VAT." },
    { question: "How can I reduce my ADDC bill in summer?", answer: "To reduce your ADDC bill in summer: (1) Set AC to 24°C — each degree lower adds about 5% to your electricity bill. (2) Stay within the Green Band — keep daily consumption under 20 kWh (apartments) or 30 kWh (villas) to avoid the higher Red Band rate. (3) Use timers on AC units — turn off in empty rooms. (4) Switch to inverter AC units — they use 30–50% less electricity. (5) Use LED lighting (80% less energy than incandescent). (6) Close curtains during the day to reduce heat gain. (7) Service your AC units before summer. (8) Use a smart thermostat linked to the TAQA app. (9) Fix water leaks — even small drips waste significant water over a month." },
    { question: "What is the Tawtheeq connection to ADDC billing?", answer: "Tawtheeq is Abu Dhabi's mandatory tenancy contract registration system managed by the Abu Dhabi Judiciary. It's directly connected to ADDC billing because: (1) Your ADDC account is linked to your Tawtheeq-registered address. (2) The municipality fee on your ADDC bill (5% of annual rent) is calculated based on the rent value in your Tawtheeq contract. (3) To open a new ADDC account or transfer utilities to your name, you need a valid Tawtheeq certificate. (4) When renewing or changing your tenancy, ADDC adjusts the municipality fee based on the updated Tawtheeq registration." },
    { question: "Are ADDC and AADC tariffs the same after the TAQA merger?", answer: "Yes, ADDC and AADC tariffs are now identical under the unified TAQA Distribution brand as of January 2025. Both entities serve different areas — ADDC covers Abu Dhabi city and the Western Region (Al Dhafra), while AADC covers Al Ain — but they operate under the same tariff schedule. Electricity rates, water rates, Green/Red Band limits, meter service fees, and all ancillary charges are the same across all three regions. The merger consolidated operations for efficiency, and customers can use the same TAQA app, portal, and payment channels regardless of their location." },
];

export default function ADDCBillCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "ADDC Bill Calculator" },
        ]),
        webAppSchema("ADDC Bill Calculator", canonicalUrl("/uae/addc-bill-calculator")),
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
            <Script id="schema-addc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "ADDC Bill Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>ADDC Bill Calculator 2026 — Abu Dhabi Electricity & Water (TAQA Distribution)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Estimate your monthly ADDC / TAQA Distribution utility bill with our interactive calculator. Get an instant itemized breakdown of electricity (Green & Red Band), water charges, meter service fee, municipality fee, and 5% VAT. Compare ADDC (Abu Dhabi) vs DEWA (Dubai) costs side-by-side. Updated with 2026 tariff rates for UAE Nationals, expatriates, and commercial customers.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEADDCBillCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Abu Dhabi ADDC Bill FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/dewa-bill-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Dubai electricity & water — compare with Abu Dhabi</div>
                        </div>
                    </Link>
                    <Link href="/uae/rera-rental-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">RERA Rental Calculator</div>
                            <div className="uae-related-link__desc">Rent impacts your municipality fee on ADDC bill</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Budget utilities as a percentage of your salary</div>
                        </div>
                    </Link>
                    <Link href="/uae/currency-converter" className="uae-related-link">
                        <span className="uae-related-link__icon">💱</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">Currency Converter</div>
                            <div className="uae-related-link__desc">Convert your bill to home currency</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="addc-overview">ADDC Overview & the TAQA Distribution Transition</h2>
    <p>The <strong>Abu Dhabi Distribution Company (ADDC)</strong> is the sole provider of electricity and water distribution services across Abu Dhabi city and the Western Region (Al Dhafra). In <strong>January 2025</strong>, ADDC merged with the <strong>Al Ain Distribution Company (AADC)</strong> under the unified brand <strong>TAQA Distribution</strong>, a subsidiary of the Abu Dhabi National Energy Company (TAQA Group). This consolidation means identical tariff rates now apply across Abu Dhabi, Al Ain, and the Western Region.</p>
    <p>ADDC/TAQA Distribution serves over <strong>400,000 customer accounts</strong>, delivering electricity generated by EWEC (Emirates Water and Electricity Company) and desalinated water. The tariff structure is regulated by the <strong>Department of Energy (DoE)</strong> in Abu Dhabi, which sets rates for residential, commercial, industrial, government, and agricultural customers.</p>
    <p>Key differences from <a href="/uae/dewa-bill-calculator">DEWA (Dubai)</a>: ADDC uses a <strong>Green Band / Red Band</strong> two-tier pricing system instead of DEWA's progressive 4-slab structure, and ADDC has <strong>no separate fuel surcharge</strong> — fuel costs are embedded in the base tariff.</p>

    <h2 id="electricity-tariffs">Electricity Tariffs Explained</h2>
    <p>ADDC electricity tariffs use a <strong>two-tier system</strong> based on daily average consumption:</p>
    <table>
        <thead><tr><th>Customer</th><th>Property</th><th>🟢 Green Band</th><th>Green Limit</th><th>🔴 Red Band</th></tr></thead>
        <tbody>
            <tr><td><strong>UAE National</strong></td><td>Apartment</td><td>6.7 fils/kWh</td><td>≤30 kWh/day</td><td>8.1 fils/kWh</td></tr>
            <tr><td><strong>UAE National</strong></td><td>Villa</td><td>6.7 fils/kWh</td><td>≤400 kWh/day</td><td>8.1 fils/kWh</td></tr>
            <tr><td><strong>Expatriate</strong></td><td>Apartment</td><td>26.8 fils/kWh</td><td>≤20 kWh/day</td><td>29.5 fils/kWh</td></tr>
            <tr><td><strong>Expatriate</strong></td><td>Villa</td><td>26.8 fils/kWh</td><td>≤30 kWh/day</td><td>29.5 fils/kWh</td></tr>
        </tbody>
    </table>

    <h3>How the Green/Red Band Works</h3>
    <p>ADDC calculates your <strong>average daily consumption</strong> for the billing period. If your total consumption divided by billing days stays within the Green Band limit, your entire usage is charged at the lower Green Band rate. Once you exceed the threshold, only the excess is charged at the higher Red Band rate.</p>
    <div class="explanation__highlight">
        <strong>Example:</strong> An expat apartment uses 1,000 kWh in 30 days (33.3 kWh/day average). The Green Band limit is 20 kWh/day = 600 kWh. So: 600 kWh × AED 0.268 = AED 160.80 (Green) + 400 kWh × AED 0.295 = AED 118.00 (Red) = <strong>AED 278.80</strong> total electricity.
    </div>

    <h3>Non-Residential Rates</h3>
    <table>
        <thead><tr><th>Customer Type</th><th>Rate (fils/kWh)</th><th>Meter Fee (AED/mo)</th></tr></thead>
        <tbody>
            <tr><td><strong>Commercial</strong></td><td>20.0</td><td>7.84</td></tr>
            <tr><td><strong>Industrial</strong></td><td>15.0</td><td>10.41</td></tr>
            <tr><td><strong>Government</strong></td><td>29.4</td><td>10.41</td></tr>
            <tr><td><strong>Agricultural</strong></td><td>3.0 (subsidized)</td><td>5.23</td></tr>
        </tbody>
    </table>
    <p>Industrial customers with installed capacity above 1 MW may face time-of-use pricing: <strong>36.6 fils/kWh during peak hours</strong> (10 AM – 10 PM, June–September) and 27.0 fils/kWh off-peak. A senior worker surcharge of <strong>AED 5,000</strong> applies for workers aged 65+ on their employer's utility account.</p>

    <h2 id="water-tariffs">Water Tariffs Explained</h2>
    <p>Water is billed by ADDC in <strong>cubic meters (m³)</strong>, using the same Green/Red Band concept:</p>
    <table>
        <thead><tr><th>Customer</th><th>Property</th><th>🟢 Green (AED/m³)</th><th>Green Limit</th><th>🔴 Red (AED/m³)</th></tr></thead>
        <tbody>
            <tr><td><strong>UAE National</strong></td><td>Apartment</td><td>2.09</td><td>≤0.7 m³/day</td><td>2.60</td></tr>
            <tr><td><strong>UAE National</strong></td><td>Villa</td><td>2.09</td><td>≤7 m³/day</td><td>2.60</td></tr>
            <tr><td><strong>Expatriate</strong></td><td>Apartment</td><td>7.84</td><td>≤0.7 m³/day</td><td>10.41</td></tr>
            <tr><td><strong>Expatriate</strong></td><td>Villa</td><td>7.84</td><td>≤5 m³/day</td><td>10.41</td></tr>
        </tbody>
    </table>
    <p>A typical household uses <strong>10–30 m³ of water per month</strong>. To convert from the old imperial gallon billing: 1 m³ = 219.97 imperial gallons. DEWA in Dubai switched from imperial gallons to cubic meters in March 2025, aligning with ADDC's existing practice.</p>

    <h2 id="municipality-fee">Municipality Fee — How It Appears on Your Bill</h2>
    <p>The <strong>municipality fee</strong> is a significant component of your ADDC bill, often surprising new residents. It is calculated as:</p>
    <div class="explanation__highlight">
        <strong>Municipality Fee = 5% of Annual Rent ÷ 12 months</strong><br>
        Minimum: AED 450/year (AED 37.50/month)
    </div>
    <table>
        <thead><tr><th>Annual Rent</th><th>Monthly Municipality Fee</th><th>Annual Total</th></tr></thead>
        <tbody>
            <tr><td>AED 36,000</td><td>AED 150.00</td><td>AED 1,800</td></tr>
            <tr><td>AED 60,000</td><td>AED 250.00</td><td>AED 3,000</td></tr>
            <tr><td>AED 80,000</td><td>AED 333.33</td><td>AED 4,000</td></tr>
            <tr><td>AED 120,000</td><td>AED 500.00</td><td>AED 6,000</td></tr>
        </tbody>
    </table>
    <p>This fee is collected by ADDC on behalf of the <strong>Department of Municipalities and Transport (DMT)</strong>. It's linked to your <strong>Tawtheeq</strong> tenancy registration — when your rent changes, the municipality fee adjusts accordingly. Use our <a href="/uae/rera-rental-calculator">RERA Rental Calculator</a> to check if your rent increase is legal before accepting a higher Tawtheeq contract.</p>

    <h2 id="read-bill">How to Read Your ADDC Bill</h2>
    <p>Your ADDC/TAQA Distribution bill contains the following components:</p>
    <ol>
        <li><strong>Electricity consumption charges</strong> — Split into Green Band and Red Band amounts</li>
        <li><strong>Water consumption charges</strong> — Split into Green Band and Red Band amounts</li>
        <li><strong>Meter service fee</strong> — Fixed monthly charge (AED 5.23–10.41 depending on customer type)</li>
        <li><strong>Municipality fee</strong> — 5% of annual rent ÷ 12</li>
        <li><strong>Government subsidy</strong> — Shown as a credit (especially for UAE Nationals)</li>
        <li><strong>5% VAT</strong> — Applied to total of all above charges</li>
        <li><strong>Previous balance</strong> — Any outstanding amount from prior bills</li>
        <li><strong>Total amount due</strong> — Sum payable</li>
    </ol>
    <p>If a meter reading couldn't be taken, your bill shows "Estimated" — this will adjust in the next billing cycle when an actual reading is obtained. Smart meters linked to the TAQA app display real-time consumption, reducing estimated bills.</p>

    <h2 id="addc-vs-dewa">ADDC vs DEWA — Detailed Comparison</h2>
    <p>Residents choosing between Abu Dhabi and Dubai often ask: <strong>which emirate has cheaper utilities?</strong> Here's the full comparison:</p>
    <table>
        <thead><tr><th>Feature</th><th>⚡ ADDC (Abu Dhabi)</th><th>💡 DEWA (Dubai)</th></tr></thead>
        <tbody>
            <tr><td><strong>Brand (2025)</strong></td><td>TAQA Distribution</td><td>DEWA</td></tr>
            <tr><td><strong>Tariff system</strong></td><td>Green/Red Band (2-tier)</td><td>Progressive slabs (4-tier)</td></tr>
            <tr><td><strong>Expat electricity</strong></td><td>26.8–29.5 fils/kWh</td><td>23–38 fils/kWh</td></tr>
            <tr><td><strong>Fuel surcharge</strong></td><td>❌ None (built into rate)</td><td>✅ 6.0 fils/kWh</td></tr>
            <tr><td><strong>Water billing</strong></td><td>Cubic meters (m³)</td><td>Cubic meters (since Mar 2025)</td></tr>
            <tr><td><strong>Sewage fee</strong></td><td>Included in water charges</td><td>Separate (~AED 0.33/m³)</td></tr>
            <tr><td><strong>Municipality fee</strong></td><td>5% of annual rent</td><td>5% of annual rent</td></tr>
            <tr><td><strong>Savings at 3,000 kWh</strong></td><td colspan="2">ADDC ~AED 150–250/mo cheaper</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Verdict:</strong> For moderate-to-high consumption (1,500+ kWh/month), <strong>ADDC is typically cheaper</strong> because: (1) no separate fuel surcharge, (2) flatter rate structure doesn't penalize high usage as aggressively as DEWA's progressive slabs. For very low consumption (under 500 kWh), DEWA's lower starting slab of 23 fils/kWh may edge out slightly cheaper.
    </div>

    <h2 id="average-bills">Average Monthly Bills by Property Type</h2>
    <p>These estimates are for <strong>expatriate residents</strong> including electricity, water, meter fee, and VAT (municipality fee depends on your rent):</p>
    <table>
        <thead><tr><th>Property</th><th>Winter (Oct–Mar)</th><th>Summer (Jun–Sep)</th><th>Annual Average</th></tr></thead>
        <tbody>
            <tr><td><strong>Studio/1BR Apartment</strong></td><td>AED 200–350</td><td>AED 400–600</td><td>AED 300–450</td></tr>
            <tr><td><strong>2BR Apartment</strong></td><td>AED 400–600</td><td>AED 800–1,200</td><td>AED 600–900</td></tr>
            <tr><td><strong>3BR Villa</strong></td><td>AED 600–1,000</td><td>AED 1,500–2,500</td><td>AED 1,000–1,700</td></tr>
            <tr><td><strong>5BR Villa</strong></td><td>AED 1,000–1,800</td><td>AED 2,500–5,000</td><td>AED 1,700–3,200</td></tr>
        </tbody>
    </table>
    <p>Summer bills can be <strong>30–50% higher</strong> than winter due to air conditioning. A well-maintained inverter AC unit uses 30–50% less electricity than conventional units. Planning your <a href="/uae/salary-calculator">salary budget</a>? Factor in utility costs — they're one of the largest monthly expenses after rent in Abu Dhabi.</p>

    <h2 id="commercial-industrial">Commercial & Industrial Tariffs</h2>
    <p>Business customers in Abu Dhabi pay different rates based on their classification:</p>
    <table>
        <thead><tr><th>Category</th><th>Electricity</th><th>Water</th><th>Meter Fee</th></tr></thead>
        <tbody>
            <tr><td><strong>Commercial</strong></td><td>20.0 fils/kWh (flat)</td><td>AED 10.41/m³</td><td>AED 7.84/mo</td></tr>
            <tr><td><strong>Industrial (&lt;1 MW)</strong></td><td>15.0 fils/kWh</td><td>AED 10.41/m³</td><td>AED 10.41/mo</td></tr>
            <tr><td><strong>Industrial (≥1 MW)</strong></td><td>27.0–36.6 fils/kWh (TOU)</td><td>AED 10.41/m³</td><td>AED 10.41/mo</td></tr>
            <tr><td><strong>Government</strong></td><td>29.4 fils/kWh</td><td>AED 10.41/m³</td><td>AED 10.41/mo</td></tr>
            <tr><td><strong>Agricultural</strong></td><td>3.0 fils/kWh</td><td>Subsidized</td><td>AED 5.23/mo</td></tr>
        </tbody>
    </table>
    <p>Large industrial operators with capacity ≥1 MW are subject to <strong>time-of-use (TOU) pricing</strong>: peak rates of 36.6 fils/kWh apply from 10 AM to 10 PM during June–September, with off-peak rates of 27.0 fils/kWh. The Abu Dhabi Department of Energy also offers an <strong>Electricity Tariff Incentive Program</strong> for qualifying industrial projects.</p>

    <h2 id="how-to-pay">How to Pay Your ADDC Bill</h2>
    <table>
        <thead><tr><th>Channel</th><th>How</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>TAQA App</strong></td><td>Download from App Store / Google Play</td><td>Autopay, bill breakdown, usage tracking</td></tr>
            <tr><td><strong>TAQA Portal</strong></td><td>taqadistribution.com e-services</td><td>Full account management</td></tr>
            <tr><td><strong>Quick Pay</strong></td><td>Enter account number online</td><td>No login required</td></tr>
            <tr><td><strong>TAMM</strong></td><td>tamm.abudhabi.ae</td><td>Abu Dhabi government services portal</td></tr>
            <tr><td><strong>Bank channels</strong></td><td>ADCB, FAB, DIB, etc.</td><td>Internet/mobile banking, WhatsApp</td></tr>
            <tr><td><strong>MBME Kiosks</strong></td><td>Self-service machines</td><td>Cash and card accepted</td></tr>
            <tr><td><strong>Direct debit</strong></td><td>Set up via bank or TAQA</td><td>Automatic monthly payments</td></tr>
        </tbody>
    </table>

    <h2 id="smart-meters">Smart Meters in Abu Dhabi</h2>
    <p>TAQA Distribution has been deploying <strong>smart meters</strong> across Abu Dhabi since 2016 as part of a major grid modernization initiative. Benefits include:</p>
    <ul>
        <li><strong>Real-time tracking</strong> — Monitor your consumption live via the TAQA app</li>
        <li><strong>Accurate billing</strong> — No more estimated readings</li>
        <li><strong>Leak detection</strong> — Unusual usage patterns trigger alerts</li>
        <li><strong>Smart home integration</strong> — Compatible with TAQA smart home devices</li>
    </ul>
    <p>To read your smart meter manually: press the Display button → cycle to the kWh screen → record digits before the decimal point → subtract your previous reading to get consumption.</p>

    <h2 id="energy-saving">Energy-Saving Tips for Abu Dhabi</h2>
    <ol>
        <li><strong>Target the Green Band</strong> — Keep daily electricity under 20 kWh (apartment) or 30 kWh (villa) to stay in the cheaper tier</li>
        <li><strong>Set AC to 24°C</strong> — Each degree lower increases electricity usage by ~5%</li>
        <li><strong>Use inverter AC</strong> — 30–50% more efficient than conventional units</li>
        <li><strong>LED lighting</strong> — Uses 80% less energy than incandescent bulbs</li>
        <li><strong>Timer on water heaters</strong> — Run only during peak usage hours</li>
        <li><strong>Fix leaks immediately</strong> — A dripping tap wastes up to 20 liters per day (0.6 m³/month)</li>
        <li><strong>Use appliances at night</strong> — Reduces AC load from heat generation</li>
        <li><strong>Close curtains</strong> — Block sunlight to reduce cooling requirements</li>
        <li><strong>Service AC before summer</strong> — Clean filters improve efficiency by 15–20%</li>
        <li><strong>Monitor via TAQA app</strong> — Track daily consumption to stay within Green Band</li>
    </ol>

    <h2 id="subsidies">Government Subsidies</h2>
    <p>The Abu Dhabi government provides significant subsidies to <strong>UAE Nationals</strong>:</p>
    <ul>
        <li><strong>Electricity subsidy:</strong> ~75% discount versus expatriate rates (6.7 vs 26.8 fils/kWh)</li>
        <li><strong>Water subsidy:</strong> ~73% discount (AED 2.09 vs AED 7.84/m³)</li>
        <li><strong>Social card holders:</strong> May receive free or heavily discounted utilities</li>
        <li><strong>Villa Green Band:</strong> Extremely generous 400 kWh/day limit for nationals (vs 30 for expats)</li>
    </ul>
    <p>Expatriates also benefit from partial subsidies — the actual cost of producing and distributing electricity and water is higher than published tariff rates. According to The National, UAE Nationals enjoy an estimated <strong>86% subsidy</strong> on the true cost of electricity and water services.</p>
`;

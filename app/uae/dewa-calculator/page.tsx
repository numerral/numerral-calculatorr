import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAEDEWACalculatorCore from "@/components/calculator/UAEDEWACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "DEWA Bill Calculator 2025 — Electricity & Water Dubai",
    description: "Calculate your monthly DEWA bill with accurate 2025 slab tariffs for electricity (23–38 fils/kWh) and water (3.5–4.6 fils/IG). Includes fuel surcharge, sewerage fee, housing fee, and 5% VAT.",
    keywords: ["DEWA bill calculator", "Dubai electricity calculator", "DEWA tariff rates 2025", "حاسبة فاتورة ديوا", "DEWA slab rates", "Dubai water charges", "fuel surcharge DEWA", "housing fee Dubai", "DEWA vs ADDC", "sewerage fee Dubai 2025"],
    alternates: { canonical: canonicalUrl("/uae/dewa-calculator") },
};

const FAQ_ITEMS = [
    { question: "How is my DEWA electricity bill calculated?", answer: "DEWA uses a progressive slab tariff system for residential electricity. Your first 2,000 kWh per month are charged at 23 fils/kWh (Green slab), the next 2,000 kWh at 28 fils/kWh (Yellow), the next 2,000 kWh at 32 fils/kWh (Orange), and everything above 6,000 kWh at 38 fils/kWh (Red). A fuel surcharge of 6 fils/kWh is added on top, and 5% VAT is applied to the total. Commercial properties pay a flat rate of 38 fils/kWh regardless of consumption." },
    { question: "What are the DEWA water tariff slabs?", answer: "DEWA water tariffs for residential customers are divided into 3 slabs based on Imperial Gallon (IG) consumption per month: 0–6,000 IG at 3.5 fils/IG, 6,001–12,000 IG at 4.0 fils/IG, and above 12,000 IG at 4.6 fils/IG. A fuel surcharge of 0.5 fils/IG is also applied. From March 2025, DEWA is transitioning to cubic meters (m³) as the standard unit, with equivalent rates of AED 7.70/m³, AED 8.80/m³, and AED 10.12/m³." },
    { question: "What is the fuel surcharge on my DEWA bill?", answer: "The fuel surcharge is a variable charge added to your DEWA bill to reflect the cost of fuel used for electricity generation and water desalination. For electricity, it is approximately 6 fils/kWh (AED 0.060/kWh). For water, it is approximately 0.5 fils/IG (AED 1.10/m³). These rates are updated monthly by the Dubai Supreme Council of Energy based on global fuel prices. The surcharge appears as a separate line item on your bill." },
    { question: "What is the housing fee on my DEWA bill?", answer: "The housing fee (also called the municipality fee) is a charge collected by DEWA on behalf of the Dubai Municipality. It is calculated as 5% of your annual rent, divided into 12 equal monthly installments and added to your DEWA bill. For example, if your annual rent is AED 60,000, the housing fee is AED 250/month. UAE Nationals are exempt from this fee. The fee funds municipal services including waste management, street cleaning, and infrastructure maintenance." },
    { question: "How much is the new sewerage fee in Dubai?", answer: "Starting January 2025, Dubai Municipality introduced a phased sewerage fee collected through DEWA bills. The 2025 rate is 1.5 fils per Imperial Gallon (approximately AED 0.33/m³). This will increase to 2.0 fils/IG in 2026 and reach the final rate of 2.8 fils/IG in 2027. The fee was introduced to fund improvements to Dubai's wastewater infrastructure and treatment facilities." },
    { question: "What is the difference between DEWA and ADDC tariffs?", answer: "DEWA (Dubai) and TAQA/ADDC (Abu Dhabi) have different tariff structures. DEWA uses a 4-tier progressive slab system (23–38 fils/kWh) with separate fuel surcharges. ADDC uses a Green/Red band system (26.8–30.5 fils/kWh for expats) with no separate fuel surcharge. ADDC offers significantly subsidized rates for UAE Nationals (as low as 6.7 fils/kWh), while DEWA charges the same rates regardless of nationality. ADDC also charges a monthly meter service fee of AED 7.84." },
    { question: "How much is the DEWA security deposit?", answer: "The DEWA security deposit is a refundable amount paid when activating a new connection. For apartments, the deposit is AED 2,000. For villas, it is AED 4,000. The deposit is fully refundable when you close your DEWA account, provided all outstanding bills are settled. In addition to the deposit, you pay a non-refundable activation fee of AED 130, plus AED 10 knowledge fee and AED 10 innovation fee, totaling approximately AED 2,258 for apartments and AED 4,358 for villas (including 5% VAT)." },
    { question: "What is the DEWA Green Charger tariff?", answer: "DEWA's Green Charger initiative supports electric vehicle owners in Dubai. DEWA operates EV charging stations across the emirate with a tariff of 29 fils/kWh (AED 0.29/kWh) at public charging stations. Some newer stations support fast charging at higher rates. The initiative is part of the Dubai Clean Energy Strategy 2050, which aims to generate 75% of its energy from clean sources by 2050. Home EV charging is billed at your residential slab rate." },
    { question: "How do I read my DEWA bill?", answer: "A typical DEWA bill has several sections: Account Information (account number, premise number, billing period), Electricity Charges (slab-wise breakdown with units consumed and cost), Water Charges (slab-wise breakdown), Fuel Surcharge (separate line for electricity and water), Sewerage Fee, Housing Fee (5% of rent/12 — shown as 'Municipality Fee'), VAT (5% of the total), and Total Amount Due. The bill also shows your meter readings (current vs previous) and a consumption comparison with the same month in the previous year." },
    { question: "What is the Shams Dubai net metering program?", answer: "Shams Dubai is DEWA's net metering program that allows property owners to install solar panels and export excess electricity back to the grid. Under this program, any surplus solar energy generated is exported to the DEWA grid and credited to your account at the slab rate applicable to your consumption level. The credits offset your electricity consumption, and any remaining credits roll over to the next billing cycle. To participate, you need DEWA approval, a qualified solar installer, and panels connected through a DEWA-approved inverter." },
    { question: "How can I reduce my DEWA bill?", answer: "Key strategies to reduce your DEWA bill: (1) Set AC to 24°C — each degree lower increases consumption by 5–10%. (2) Use energy-efficient appliances (5-star ESMA rating). (3) Install smart thermostats and timers. (4) Use LED lighting throughout. (5) Fix water leaks immediately — a dripping tap wastes 5,000+ gallons/year. (6) Run appliances during off-peak hours. (7) Install low-flow showerheads and faucet aerators. (8) Use blackout curtains to reduce heat gain. (9) Maintain AC filters monthly. (10) Consider Shams Dubai solar panels for long-term savings." },
    { question: "What happens if I don't pay my DEWA bill?", answer: "If you fail to pay your DEWA bill by the due date (typically 30 days after billing), DEWA follows a phased process: First, a reminder notification is sent. If payment is still not made, a disconnection notice is issued with an additional grace period. After this, electricity and water services may be disconnected. Reconnection requires payment of all outstanding bills plus a reconnection fee of AED 100. Prolonged non-payment may result in legal action and can affect your credit score. DEWA offers payment plans for customers facing financial difficulty." },
    { question: "How is the DEWA bill calculated for villa owners vs tenants?", answer: "The electricity and water tariff rates are the same whether you own or rent. The key difference is the housing fee: Tenants pay 5% of their registered Ejari rent divided by 12. Villa owners pay 5% of the property's estimated annual rental value as assessed by Dubai Municipality. Owners also pay the initial security deposit (AED 4,000 for villas vs AED 2,000 for apartments). Additionally, villa owners connected to district cooling pay separately to the cooling provider, while those with central AC pay higher DEWA electricity bills due to greater consumption." },
    { question: "Can I pay my DEWA bill in installments?", answer: "DEWA does not typically offer installment payments for regular monthly bills. However, for large outstanding balances, you can contact DEWA Customer Happiness (04-601-9999) to discuss a payment arrangement. DEWA accepts payments through multiple channels: online via dewa.gov.ae or the DEWA app, bank transfer, direct debit, at customer happiness centers, DEWA payment machines, and through authorized exchange houses. The DEWA app also supports Apple Pay and Google Pay." },
    { question: "What is the DEWA smart meter and how does it work?", answer: "DEWA's Advanced Metering Infrastructure (AMI) — commonly called smart meters — are digital meters that record electricity and water consumption in real-time and transmit data to DEWA automatically. Benefits include: no manual meter reading required, real-time consumption monitoring via the DEWA app, automated billing with accurate readings (no estimates), ability to detect leaks and unusual consumption patterns, and remote connection/disconnection capability. By 2025, DEWA has installed over 2.1 million smart meters across Dubai." },
    { question: "Are DEWA tariff rates the same for all nationalities?", answer: "Yes, DEWA tariff rates are the same for all nationalities in Dubai — both UAE Nationals and expatriates pay identical slab rates for electricity and water. The only difference is the housing fee: UAE Nationals are exempt from the 5% housing fee charged through DEWA bills. This contrasts with Abu Dhabi (TAQA/ADDC), where UAE Nationals receive significantly subsidized electricity rates (as low as 6.7 fils/kWh compared to 26.8 fils/kWh for expatriates)." },
];

export default function DEWACalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "DEWA Bill Calculator" },
        ]),
        webAppSchema("DEWA Bill Calculator", canonicalUrl("/uae/dewa-calculator")),
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
            <Script id="schema-dewa-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "DEWA Bill Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>DEWA Bill Calculator 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your monthly DEWA electricity and water bill with accurate 2025 slab tariffs. Includes fuel surcharge, sewerage fee, housing fee, and 5% VAT. Works for residential and commercial properties in Dubai.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAEDEWACalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="DEWA Bill Calculator FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/rera-rental-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏠</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">RERA Rental Calculator</div>
                            <div className="uae-related-link__desc">Maximum legal rent increase</div>
                        </div>
                    </Link>
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT calculation</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Net salary & cost of living</div>
                        </div>
                    </Link>
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏢</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">Monthly EMI & DLD fees</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-dewa">What Is DEWA?</h2>
    <p><strong>DEWA</strong> (Dubai Electricity and Water Authority) is the sole provider of electricity and water services in the Emirate of Dubai. Established in 1992, DEWA supplies power to over 1.1 million customer accounts serving a population of approximately 3.6 million people. DEWA is one of the world's most efficient utilities, reporting transmission and distribution losses of just 3.3% — well below the global average of 8%.</p>
    <p>Understanding how DEWA calculates your bill is essential for budgeting in Dubai. Unlike many countries where utility bills follow a flat rate, DEWA uses a <strong>progressive slab tariff system</strong> — meaning the unit price increases as your consumption rises. This system was designed to encourage conservation, align with the UAE&apos;s sustainability goals, and penalize excessive consumption.</p>

    <h2 id="electricity-slabs">Electricity Slab Tariff System</h2>
    <p>DEWA divides residential electricity consumption into <strong>four color-coded slabs</strong>. Each slab has a progressively higher rate per kilowatt-hour (kWh):</p>
    <table>
        <thead><tr><th>Slab</th><th>Usage Range</th><th>Rate</th><th>Designed For</th></tr></thead>
        <tbody>
            <tr><td><strong>🟢 Green</strong></td><td>0–2,000 kWh</td><td><strong>23 fils/kWh</strong></td><td>Energy-efficient households (studio/1BR)</td></tr>
            <tr><td><strong>🟡 Yellow</strong></td><td>2,001–4,000 kWh</td><td><strong>28 fils/kWh</strong></td><td>Average family consumption (2-3BR)</td></tr>
            <tr><td><strong>🟠 Orange</strong></td><td>4,001–6,000 kWh</td><td><strong>32 fils/kWh</strong></td><td>Large apartments, small villas</td></tr>
            <tr><td><strong>🔴 Red</strong></td><td>6,001+ kWh</td><td><strong>38 fils/kWh</strong></td><td>Large villas, high consumption</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key point:</strong> The slab system is <strong>cumulative</strong>, not flat. If you use 3,000 kWh, your first 2,000 kWh are charged at 23 fils, and only the remaining 1,000 kWh are charged at 28 fils — not the entire 3,000 kWh at 28 fils.
    </div>

    <h3>Commercial Electricity Rates</h3>
    <p>Commercial and industrial properties in Dubai do not benefit from the slab system. They pay a <strong>flat rate of 38 fils/kWh</strong> (the Red slab rate) regardless of consumption volume. This applies to all non-residential accounts including offices, retail spaces, restaurants, and warehouses.</p>

    <h2 id="water-slabs">Water Slab Tariff System</h2>
    <p>Water tariffs in Dubai follow a similar progressive structure, with <strong>three consumption slabs</strong> based on Imperial Gallons (IG) per month:</p>
    <table>
        <thead><tr><th>Slab</th><th>Usage (IG/month)</th><th>Rate (fils/IG)</th><th>Metric Equivalent</th></tr></thead>
        <tbody>
            <tr><td><strong>Slab 1</strong></td><td>0–6,000</td><td><strong>3.5 fils</strong></td><td>AED 7.70/m³</td></tr>
            <tr><td><strong>Slab 2</strong></td><td>6,001–12,000</td><td><strong>4.0 fils</strong></td><td>AED 8.80/m³</td></tr>
            <tr><td><strong>Slab 3</strong></td><td>12,001+</td><td><strong>4.6 fils</strong></td><td>AED 10.12/m³</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>March 2025 Update:</strong> DEWA is transitioning from <strong>Imperial Gallons to cubic meters (m³)</strong> as the standard unit for water billing. During the transition, both units may appear on your bill. 1 m³ ≈ 220 Imperial Gallons.
    </div>

    <h2 id="fuel-surcharge">Fuel Surcharge — How It Works</h2>
    <p>The <strong>fuel surcharge</strong> is a variable charge added to every DEWA bill that reflects the cost of fuel used for electricity generation and water desalination. Dubai relies on natural gas for a significant portion of its power generation, and the surcharge fluctuates with global energy prices.</p>
    <ul>
        <li><strong>Electricity:</strong> approximately 6 fils/kWh (AED 0.060/kWh) — updated monthly</li>
        <li><strong>Water:</strong> approximately 0.5 fils/IG (AED 1.10/m³) — updated monthly</li>
    </ul>
    <p>The rates are set by the <strong>Dubai Supreme Council of Energy</strong> and published on the DEWA website at the start of each month. Check <strong>dewa.gov.ae</strong> for the latest rates. The surcharge appears as a separate line item on your bill, calculated by multiplying your total consumption by the applicable surcharge rate.</p>

    <h2 id="sewerage-fee">Sewerage Fee (New from January 2025)</h2>
    <p>Starting <strong>January 1, 2025</strong>, Dubai Municipality introduced a new <strong>sewerage fee</strong> collected through DEWA bills. This fee funds improvements to Dubai&apos;s wastewater treatment infrastructure and is being phased in over three years:</p>
    <table>
        <thead><tr><th>Year</th><th>Rate (fils/IG)</th><th>Rate (AED/m³)</th><th>Impact on Average Bill</th></tr></thead>
        <tbody>
            <tr><td><strong>2025</strong></td><td>1.5 fils</td><td>AED 0.33</td><td>~AED 7–15/month</td></tr>
            <tr><td><strong>2026</strong></td><td>2.0 fils</td><td>AED 0.44</td><td>~AED 10–20/month</td></tr>
            <tr><td><strong>2027</strong></td><td>2.8 fils</td><td>AED 0.62</td><td>~AED 14–28/month</td></tr>
        </tbody>
    </table>
    <p>The fee is calculated by multiplying your total water consumption (in IG) by the applicable rate and is included in the total before 5% VAT is applied.</p>

    <h2 id="housing-fee">Housing Fee (Municipality Fee)</h2>
    <p>The <strong>housing fee</strong> is one of the most significant charges on your DEWA bill — often more than the utility charges themselves. This fee is collected by DEWA on behalf of <strong>Dubai Municipality</strong> to fund public services including waste management, street cleaning, and infrastructure maintenance.</p>
    <ul>
        <li><strong>Calculation:</strong> 5% of your annual rent ÷ 12 months</li>
        <li><strong>For tenants:</strong> Based on the rent registered in your Ejari contract</li>
        <li><strong>For owners:</strong> Based on the estimated annual rental value assessed by Dubai Municipality</li>
        <li><strong>UAE Nationals:</strong> Exempt from this fee</li>
    </ul>
    <table>
        <thead><tr><th>Annual Rent (AED)</th><th>Monthly Housing Fee</th><th>Annual Housing Fee</th></tr></thead>
        <tbody>
            <tr><td>30,000</td><td><strong>AED 125</strong></td><td>AED 1,500</td></tr>
            <tr><td>50,000</td><td><strong>AED 208</strong></td><td>AED 2,500</td></tr>
            <tr><td>60,000</td><td><strong>AED 250</strong></td><td>AED 3,000</td></tr>
            <tr><td>80,000</td><td><strong>AED 333</strong></td><td>AED 4,000</td></tr>
            <tr><td>100,000</td><td><strong>AED 417</strong></td><td>AED 5,000</td></tr>
            <tr><td>150,000</td><td><strong>AED 625</strong></td><td>AED 7,500</td></tr>
        </tbody>
    </table>

    <h2 id="vat">VAT on DEWA Bills</h2>
    <p>A <strong>5% Value Added Tax (VAT)</strong> is applied to the total DEWA bill, including electricity charges, water charges, fuel surcharges, sewerage fee, and housing fee. VAT was introduced in the UAE on January 1, 2018, and applies to utility services.</p>

    <h2 id="worked-examples">Worked Examples</h2>

    <h3>Example 1: Studio Apartment (Low Usage)</h3>
    <table>
        <thead><tr><th>Item</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Electricity (800 kWh)</td><td>800 × 0.23</td><td><strong>AED 184.00</strong></td></tr>
            <tr><td>Fuel surcharge (electricity)</td><td>800 × 0.06</td><td>AED 48.00</td></tr>
            <tr><td>Water (3,000 IG)</td><td>3,000 × 0.035</td><td><strong>AED 105.00</strong></td></tr>
            <tr><td>Fuel surcharge (water)</td><td>3,000 × 0.005</td><td>AED 15.00</td></tr>
            <tr><td>Sewerage (2025)</td><td>3,000 × 0.0015</td><td>AED 4.50</td></tr>
            <tr><td>Housing fee</td><td>30,000 × 5% ÷ 12</td><td>AED 125.00</td></tr>
            <tr><td>Subtotal</td><td></td><td>AED 481.50</td></tr>
            <tr><td>VAT (5%)</td><td>481.50 × 0.05</td><td>AED 24.08</td></tr>
            <tr><td><strong>Total</strong></td><td></td><td><strong>AED 505.58</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: 2BR Apartment (Average Usage)</h3>
    <table>
        <thead><tr><th>Item</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Electricity (2,500 kWh)</td><td>2,000 × 0.23 + 500 × 0.28</td><td><strong>AED 600.00</strong></td></tr>
            <tr><td>Fuel surcharge (electricity)</td><td>2,500 × 0.06</td><td>AED 150.00</td></tr>
            <tr><td>Water (8,000 IG)</td><td>6,000 × 0.035 + 2,000 × 0.04</td><td><strong>AED 290.00</strong></td></tr>
            <tr><td>Fuel surcharge (water)</td><td>8,000 × 0.005</td><td>AED 40.00</td></tr>
            <tr><td>Sewerage (2025)</td><td>8,000 × 0.0015</td><td>AED 12.00</td></tr>
            <tr><td>Housing fee</td><td>60,000 × 5% ÷ 12</td><td>AED 250.00</td></tr>
            <tr><td>Subtotal</td><td></td><td>AED 1,342.00</td></tr>
            <tr><td>VAT (5%)</td><td>1,342 × 0.05</td><td>AED 67.10</td></tr>
            <tr><td><strong>Total</strong></td><td></td><td><strong>AED 1,409.10</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 3: Villa (High Usage)</h3>
    <table>
        <thead><tr><th>Item</th><th>Calculation</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td>Electricity (7,000 kWh)</td><td>2,000 × 0.23 + 2,000 × 0.28 + 2,000 × 0.32 + 1,000 × 0.38</td><td><strong>AED 2,040.00</strong></td></tr>
            <tr><td>Fuel surcharge (electricity)</td><td>7,000 × 0.06</td><td>AED 420.00</td></tr>
            <tr><td>Water (15,000 IG)</td><td>6,000 × 0.035 + 6,000 × 0.04 + 3,000 × 0.046</td><td><strong>AED 588.00</strong></td></tr>
            <tr><td>Fuel surcharge (water)</td><td>15,000 × 0.005</td><td>AED 75.00</td></tr>
            <tr><td>Sewerage (2025)</td><td>15,000 × 0.0015</td><td>AED 22.50</td></tr>
            <tr><td>Housing fee</td><td>120,000 × 5% ÷ 12</td><td>AED 500.00</td></tr>
            <tr><td>Subtotal</td><td></td><td>AED 3,645.50</td></tr>
            <tr><td>VAT (5%)</td><td>3,645.50 × 0.05</td><td>AED 182.28</td></tr>
            <tr><td><strong>Total</strong></td><td></td><td><strong>AED 3,827.78</strong></td></tr>
        </tbody>
    </table>

    <h2 id="dewa-vs-addc">DEWA (Dubai) vs ADDC/TAQA (Abu Dhabi)</h2>
    <p>If you&apos;re moving between Dubai and Abu Dhabi, it&apos;s important to understand the differences between the two utility providers:</p>
    <table>
        <thead><tr><th>Aspect</th><th>Dubai (DEWA)</th><th>Abu Dhabi (TAQA)</th></tr></thead>
        <tbody>
            <tr><td><strong>Provider</strong></td><td>Dubai Electricity & Water Authority</td><td>TAQA Distribution (formerly ADDC/AADC)</td></tr>
            <tr><td><strong>Electricity system</strong></td><td>4-slab progressive (23–38 fils/kWh)</td><td>Green/Red band (26.8–30.5 fils/kWh for expats)</td></tr>
            <tr><td><strong>National subsidy</strong></td><td>Same rates for all</td><td>Heavy subsidy — as low as 6.7 fils/kWh</td></tr>
            <tr><td><strong>Fuel surcharge</strong></td><td>Yes — variable, updated monthly</td><td>No separate fuel surcharge</td></tr>
            <tr><td><strong>Meter service charge</strong></td><td>Included in tariff</td><td>AED 7.84/month (expat)</td></tr>
            <tr><td><strong>Sewerage fee</strong></td><td>1.5 fils/IG (from 2025)</td><td>Included in tariff</td></tr>
            <tr><td><strong>Housing fee</strong></td><td>5% of rent (via DEWA bill)</td><td>5% of rent (via municipality)</td></tr>
            <tr><td><strong>VAT</strong></td><td>5% on total bill</td><td>5% on total bill</td></tr>
        </tbody>
    </table>

    <h2 id="shams-dubai">Shams Dubai — Solar Net Metering</h2>
    <p><strong>Shams Dubai</strong> is DEWA&apos;s solar net metering program that allows home and building owners to install photovoltaic (PV) solar panels and connect them to the DEWA grid. Under this program:</p>
    <ul>
        <li><strong>Excess solar energy</strong> generated during the day is exported to the grid and credited to your account</li>
        <li>Credits are applied at the <strong>same slab rate</strong> as your consumption tier</li>
        <li>Credits roll over to subsequent billing cycles</li>
        <li>No battery storage is required — the grid acts as your &quot;virtual battery&quot;</li>
        <li>DEWA offers <strong>zero connection fees</strong> for approved solar installations</li>
    </ul>
    <p>To participate, you need: property owner consent, a DEWA-approved solar installer, panels and inverters meeting DEWA&apos;s technical standards, and a completed application through DEWA&apos;s Shams Dubai portal.</p>

    <h2 id="green-charger">DEWA Green Charger — EV Charging</h2>
    <p>DEWA operates a network of <strong>EV charging stations</strong> across Dubai under the Green Charger initiative. The current tariff for public charging is <strong>29 fils/kWh (AED 0.29/kWh)</strong>. Charging at home uses your residential slab rate. DEWA plans to expand the network to support Dubai&apos;s target of 30% of vehicles being electric or hybrid by 2030.</p>

    <h2 id="smart-meters">DEWA Smart Meters</h2>
    <p>DEWA has deployed over <strong>2.1 million smart meters</strong> (Advanced Metering Infrastructure — AMI) across Dubai, covering virtually all connections. Benefits of smart meters:</p>
    <ul>
        <li><strong>Real-time monitoring</strong> — Track consumption through the DEWA app</li>
        <li><strong>Automated billing</strong> — No estimated readings or manual meter checks</li>
        <li><strong>Leak detection</strong> — Unusual water consumption patterns trigger alerts</li>
        <li><strong>Remote services</strong> — Connection and disconnection without physical visits</li>
        <li><strong>Usage history</strong> — Compare consumption across months and years</li>
    </ul>

    <h2 id="energy-saving">Energy Saving Tips for Dubai</h2>
    <p>Dubai&apos;s climate makes air conditioning the single largest contributor to electricity bills — typically <strong>60–70% of total consumption</strong>. Here are evidence-based strategies to reduce your DEWA bill:</p>

    <h3>Air Conditioning (Biggest Impact)</h3>
    <ul>
        <li><strong>Set thermostat to 24°C</strong> — Each degree below 24°C increases consumption by 5–10%</li>
        <li><strong>Clean AC filters monthly</strong> — Dirty filters force the unit to work harder</li>
        <li><strong>Service units annually</strong> — Professional maintenance improves efficiency by 15–20%</li>
        <li><strong>Use programmable timers</strong> — Set higher temperatures when away</li>
        <li><strong>Install smart thermostats</strong> — Platforms like Honeywell or Nest learn your patterns</li>
    </ul>

    <h3>Lighting & Appliances</h3>
    <ul>
        <li><strong>Switch to LED bulbs</strong> — Use 75% less energy than incandescent bulbs</li>
        <li><strong>Choose ESMA 5-star appliances</strong> — Look for the Emirates Authority for Standardization & Metrology rating</li>
        <li><strong>Unplug standby devices</strong> — &quot;Phantom load&quot; can account for 5–10% of electricity use</li>
        <li><strong>Use energy-efficient water heaters</strong> — Or heat water using solar in summer months</li>
    </ul>

    <h3>Water Conservation</h3>
    <ul>
        <li><strong>Fix leaks immediately</strong> — A dripping tap wastes 5,000+ gallons per year</li>
        <li><strong>Install low-flow showerheads</strong> — Reduces water use by 30–50%</li>
        <li><strong>Use efficient irrigation</strong> — Drip systems for gardens, water during early morning</li>
        <li><strong>Run dishwashers and washing machines full</strong> — Avoid partial loads</li>
    </ul>

    <h2 id="dewa-connection">How to Set Up a New DEWA Connection</h2>
    <p>When moving to a new property in Dubai, you&apos;ll need to activate DEWA services. The process is automated through the <strong>Ejari system</strong>:</p>
    <ol>
        <li><strong>Register your Ejari</strong> — Sign your tenancy contract and register it through the Dubai REST app or a trustee centre</li>
        <li><strong>Automatic DEWA notification</strong> — DEWA receives your data from the DLD system</li>
        <li><strong>SMS/email notification</strong> — DEWA contacts you with payment details</li>
        <li><strong>Pay security deposit + fees</strong> — Online through the DEWA app or dewa.gov.ae</li>
        <li><strong>Service activation</strong> — Electricity and water are typically connected within 15–24 hours of payment</li>
    </ol>
    <table>
        <thead><tr><th>Fee Component</th><th>Apartment</th><th>Villa</th></tr></thead>
        <tbody>
            <tr><td><strong>Security deposit (refundable)</strong></td><td>AED 2,000</td><td>AED 4,000</td></tr>
            <tr><td>Activation fee</td><td>AED 130</td><td>AED 130</td></tr>
            <tr><td>Knowledge + Innovation fee</td><td>AED 20</td><td>AED 20</td></tr>
            <tr><td>VAT (5%)</td><td>~AED 108</td><td>~AED 208</td></tr>
            <tr><td><strong>Total (approx.)</strong></td><td><strong>AED 2,258</strong></td><td><strong>AED 4,358</strong></td></tr>
        </tbody>
    </table>

    <h2 id="complaints">How to File a DEWA Complaint</h2>
    <p>If you believe your DEWA bill is incorrect or you&apos;re experiencing service issues:</p>
    <ol>
        <li><strong>DEWA App</strong> — Submit a complaint through the DEWA app (iOS/Android)</li>
        <li><strong>Call Center</strong> — Call 04-601-9999 (available 24/7)</li>
        <li><strong>Customer Happiness Centre</strong> — Visit a walk-in centre during working hours</li>
        <li><strong>Online</strong> — Submit through dewa.gov.ae &gt; eServices &gt; Complaints</li>
    </ol>
    <p>DEWA typically responds to complaints within <strong>2 working days</strong>. For billing disputes, DEWA will review your meter readings and may arrange a physical inspection if needed. If the meter is faulty, DEWA will adjust the bill based on your average historical consumption.</p>
`;

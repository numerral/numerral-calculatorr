// Dynamic Hub — /automotive-calculators/fuel-economy/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import FuelEconomyCalculatorCore from "@/components/calculator/FuelEconomyCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";

import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";

interface PageProps { params: Promise<{ calculator: string }>; }

export async function generateStaticParams() {
    return getCalculatorsByCategory("fuel").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("fuel").find((c) => c.slug === calculator);
    if (!calc) return {};
    return { title: calc.title, description: calc.description, keywords: calc.keywords ? calc.keywords.split(", ") : undefined, alternates: { canonical: canonicalUrl(`/automotive-calculators/fuel-economy/${calc.slug}`) } };
}

const HUB_CONTENT: Record<string, { subtitle: string; contentHTML: string; faq?: { question: string; answer: string }[] }> = {
    "gas-mileage-calculator": {
        subtitle: "Calculate your vehicle's gas mileage (MPG) from distance driven and fuel consumed. Choose between distance or odometer method. See cost per mile and metric equivalents.",
        contentHTML: `<h2>How to Calculate Gas Mileage</h2>
<p>Gas mileage, measured in <strong>miles per gallon (MPG)</strong>, tells you how far your vehicle travels on one gallon of fuel. Higher MPG means better fuel efficiency and lower fuel costs.</p>
<div class="explanation__highlight"><strong>MPG = Miles Driven ÷ Gallons Used</strong></div>

<h3>Two Methods to Calculate</h3>
<p><strong>Distance Method:</strong> If you know the total trip distance and how much fuel you used, simply divide: 300 miles ÷ 12 gallons = <strong>25 MPG</strong>.</p>
<p><strong>Odometer Method:</strong> Fill your tank, note the odometer reading. At next fill-up, note the new reading and gallons added. Subtract to get miles driven, then divide by gallons.</p>

<h3>What Affects Your MPG?</h3>
<table><thead><tr><th>Factor</th><th>Impact on MPG</th></tr></thead><tbody>
<tr><td>City vs Highway</td><td>Highway is 20–30% better due to less braking</td></tr>
<tr><td>Speed over 60 mph</td><td>Each 5 mph over 60 = ~7% worse MPG</td></tr>
<tr><td>Aggressive driving</td><td>Rapid acceleration/braking = 15–30% worse</td></tr>
<tr><td>Tire pressure (low)</td><td>Every 1 PSI low = 0.2% worse MPG</td></tr>
<tr><td>AC usage</td><td>3–4% worse in the city</td></tr>
<tr><td>Cold weather</td><td>15–24% worse (under 20°F)</td></tr>
<tr><td>Roof rack/cargo</td><td>2–8% worse due to wind drag</td></tr>
</tbody></table>

<h3>Tips to Improve Your MPG</h3>
<ul>
<li><strong>Maintain proper tire pressure</strong> — check monthly</li>
<li><strong>Drive smoothly</strong> — gradual acceleration and coasting to stops</li>
<li><strong>Use cruise control</strong> on highways</li>
<li><strong>Remove excess weight</strong> — every 100 lbs costs ~1% MPG</li>
<li><strong>Keep up with maintenance</strong> — clean air filter, fresh oil, new spark plugs</li>
</ul>`,
        faq: [
            { question: "What is considered good gas mileage?", answer: "For 2026 vehicles: 30+ MPG is good for cars, 25+ MPG for SUVs, 20+ MPG for trucks. Hybrids achieve 45–55 MPG. The US fleet average is about 25.7 MPG. Electric vehicles get 100+ MPGe (miles per gallon equivalent)." },
            { question: "Why is my real MPG lower than the EPA rating?", answer: "EPA tests are conducted in controlled lab conditions. Real-world MPG is typically 10–20% lower due to: aggressive driving, city traffic, cold weather, AC usage, hilly terrain, and cargo. Highway MPG tends to be closest to the EPA rating." },
            { question: "How do I track my gas mileage over time?", answer: "Fill up completely each time, note the odometer and gallons. Calculate MPG each fill-up. Average over 3–5 fill-ups for an accurate picture. A sudden drop in MPG can indicate maintenance issues (dirty air filter, low tire pressure, alignment problems)." },
        ],
    },
    "fuel-cost-us-calculator": {
        subtitle: "Calculate the fuel cost for any trip based on distance, vehicle MPG, and gas price. Includes a quick-reference cost table for common distances.",
        contentHTML: `<h2>How to Calculate Fuel Cost</h2>
<p>Knowing your trip fuel cost helps you budget for road trips, compare driving vs flying, and evaluate the true cost of your commute.</p>
<div class="explanation__highlight"><strong>Fuel Cost = (Distance ÷ MPG) × Gas Price</strong></div>
<p><strong>Example:</strong> A 500-mile trip in a 25 MPG vehicle at $3.15/gallon: (500 ÷ 25) × $3.15 = $63.00</p>

<h3>National Average Gas Prices (2026)</h3>
<table><thead><tr><th>Fuel Grade</th><th>Avg Price/Gal</th></tr></thead><tbody>
<tr><td>Regular (87)</td><td>$3.15</td></tr>
<tr><td>Mid-Grade (89)</td><td>$3.55</td></tr>
<tr><td>Premium (93)</td><td>$3.95</td></tr>
<tr><td>Diesel</td><td>$3.65</td></tr>
</tbody></table>
<p>Prices vary significantly by state. California averages $1.00+/gallon above the national average; states like Texas and Mississippi are typically $0.30 below.</p>

<h3>Cost Per Mile Perspective</h3>
<p>At $3.15/gallon and 25 MPG, your fuel cost per mile is <strong>$0.126</strong>. That means even a 10-mile commute costs $1.26 each way, or about $650/year in fuel alone. The IRS standard mileage rate for 2026 is $0.70/mile, which includes all vehicle costs beyond just fuel.</p>`,
        faq: [
            { question: "How much does it cost to drive 1,000 miles?", answer: "At the national average: 25 MPG vehicle at $3.15/gal = $126. A 15 MPG truck at $3.15/gal = $210. A 45 MPG hybrid at $3.15/gal = $70. The cost scales linearly with distance and inversely with MPG." },
            { question: "Is driving cheaper than flying?", answer: "For a solo traveler on a 500+ mile trip, flying is often cheaper when you factor in fuel, tolls, wear & tear, and time. But for families (3–4 people), driving is almost always cheaper since everyone shares one vehicle's fuel cost. Use this calculator to compare." },
        ],
    },
    "fuel-savings-calculator": {
        subtitle: "Compare annual fuel costs between two vehicles side by side. See how much you'd save per year and over 5 years by switching to a more efficient car.",
        contentHTML: `<h2>How to Calculate Fuel Savings Between Vehicles</h2>
<p>When considering a new vehicle, fuel savings are a major factor. A vehicle with better fuel economy can save thousands of dollars over its lifetime.</p>
<div class="explanation__highlight"><strong>Annual Savings = (Miles/Year ÷ MPG₁ − Miles/Year ÷ MPG₂) × Gas Price</strong></div>
<p><strong>Example:</strong> Switching from a 22 MPG SUV to a 35 MPG sedan, driving 15,000 miles/year at $3.15/gallon:</p>
<ul>
<li>SUV: 15,000 ÷ 22 × $3.15 = <strong>$2,148/year</strong></li>
<li>Sedan: 15,000 ÷ 35 × $3.15 = <strong>$1,350/year</strong></li>
<li>Annual savings: <strong>$798/year</strong></li>
<li>5-year savings: <strong>$3,990</strong></li>
</ul>

<h3>Diminishing Returns of Higher MPG</h3>
<p>Counterintuitively, improving from 15 to 25 MPG saves more than improving from 35 to 45 MPG for the same annual mileage. This is because fuel consumption is inversely proportional to MPG. Going from 15→25 saves 267 gallons; going from 35→45 saves only 95 gallons (at 15,000 miles/year).</p>`,
        faq: [
            { question: "How long does it take for fuel savings to pay for a new car?", answer: "If you save $800/year in fuel and the new car costs $5,000 more than keeping your old one, the payback period is about 6 years. If you also consider lower maintenance costs and higher resale value of newer, more efficient vehicles, the payback can be faster." },
        ],
    },
    "cost-per-mile-calculator": {
        subtitle: "Calculate the true all-in cost per mile of vehicle ownership including fuel, insurance, maintenance, depreciation, and loan payments.",
        contentHTML: `<h2>Understanding the True Cost of Driving</h2>
<p>Fuel is only one part of what it costs to drive. The <strong>AAA estimates total vehicle ownership cost at $0.75–$1.12 per mile</strong> for a new vehicle, depending on type. This includes fuel, insurance, maintenance, depreciation, financing, registration, and taxes.</p>

<h3>Average Annual Costs by Vehicle Type (2026)</h3>
<table><thead><tr><th>Category</th><th>Small Sedan</th><th>Mid SUV</th><th>Pickup</th></tr></thead><tbody>
<tr><td>Fuel</td><td>$1,400</td><td>$2,000</td><td>$2,600</td></tr>
<tr><td>Insurance</td><td>$1,600</td><td>$1,800</td><td>$1,900</td></tr>
<tr><td>Maintenance</td><td>$900</td><td>$1,100</td><td>$1,200</td></tr>
<tr><td>Depreciation</td><td>$3,200</td><td>$4,500</td><td>$4,800</td></tr>
<tr><td>Financing</td><td>$800</td><td>$1,100</td><td>$1,300</td></tr>
<tr><td><strong>Total</strong></td><td><strong>$7,900</strong></td><td><strong>$10,500</strong></td><td><strong>$11,800</strong></td></tr>
<tr><td><strong>Per Mile</strong></td><td><strong>$0.53</strong></td><td><strong>$0.70</strong></td><td><strong>$0.79</strong></td></tr>
</tbody></table>`,
        faq: [
            { question: "What is the IRS mileage rate for 2026?", answer: "The IRS standard mileage rate for 2026 is $0.70 per mile for business use. This covers all vehicle operating costs (fuel, maintenance, insurance, depreciation, etc.) and is used when you drive your personal vehicle for work. Medical/moving mileage is $0.22/mile." },
        ],
    },
    "mpg-to-l100km-converter": {
        subtitle: "Instantly convert between MPG (US), MPG (Imperial), km/L, and L/100km. Bidirectional fuel economy unit conversion.",
        contentHTML: `<h2>Fuel Economy Unit Conversions</h2>
<p>Different countries use different units to express fuel economy. The US uses <strong>miles per gallon (MPG)</strong>, most of the world uses <strong>liters per 100 kilometers (L/100km)</strong>, and some Asian countries use <strong>kilometers per liter (km/L)</strong>.</p>
<div class="explanation__highlight"><strong>L/100km = 235.215 ÷ MPG (US)</strong><br/><strong>km/L = MPG × 0.425144</strong><br/><strong>1 US gallon = 3.785 liters | 1 Imperial gallon = 4.546 liters</strong></div>
<h3>Quick Reference Table</h3>
<table><thead><tr><th>MPG (US)</th><th>L/100km</th><th>km/L</th></tr></thead><tbody>
<tr><td>15</td><td>15.7</td><td>6.4</td></tr>
<tr><td>20</td><td>11.8</td><td>8.5</td></tr>
<tr><td>25</td><td>9.4</td><td>10.6</td></tr>
<tr><td>30</td><td>7.8</td><td>12.8</td></tr>
<tr><td>40</td><td>5.9</td><td>17.0</td></tr>
<tr><td>50</td><td>4.7</td><td>21.3</td></tr>
</tbody></table>`,
        faq: [
            { question: "Why are there two different MPG standards?", answer: "US gallons (3.785 liters) and Imperial gallons (4.546 liters) are different sizes. A car rated 30 MPG in the US would be rated 36 MPG in Imperial. UK and Canada historically used Imperial MPG. Always check which standard is being used when comparing international specs." },
        ],
    },
    "fuel-injector-calculator": {
        subtitle: "Calculate required fuel injector flow rate (lb/hr or cc/min) from target horsepower, BSFC, number of injectors, and maximum duty cycle.",
        contentHTML: `<h2>How to Size Fuel Injectors</h2>
<p>Fuel injectors must supply enough fuel to support the engine's target horsepower without exceeding a safe duty cycle. Undersized injectors run at 100% duty cycle and can't deliver enough fuel; oversized injectors have poor idle quality and atomization.</p>
<div class="explanation__highlight"><strong>Injector Flow (lb/hr) = (HP × BSFC) ÷ (# Injectors × Duty Cycle)</strong></div>
<p><strong>Example:</strong> 400 HP, BSFC of 0.50, 8 injectors, 80% duty: (400 × 0.50) ÷ (8 × 0.80) = <strong>31.25 lb/hr per injector</strong> (328 cc/min)</p>

<h3>BSFC Guidelines</h3>
<p>Brake Specific Fuel Consumption (BSFC) measures fuel efficiency at peak power. Lower BSFC = more efficient.</p>
<ul>
<li><strong>Naturally Aspirated:</strong> 0.45–0.50 lb/HP-hr</li>
<li><strong>Turbocharged:</strong> 0.55–0.65 lb/HP-hr</li>
<li><strong>E85 Flex Fuel:</strong> 0.65–0.70 lb/HP-hr</li>
<li><strong>Methanol:</strong> 0.90–1.00 lb/HP-hr</li>
</ul>

<h3>Duty Cycle</h3>
<p>The duty cycle is the percentage of time the injector is open. At 80% duty, the injector is open 80% and closed 20% of each engine cycle. Never size for more than 80–85% duty — this leaves headroom for fuel pressure fluctuations and ECU corrections.</p>`,
        faq: [
            { question: "How do I convert lb/hr to cc/min?", answer: "Multiply lb/hr by 10.5 to get cc/min. So a 42 lb/hr injector = 440 cc/min. This conversion assumes gasoline; for E85 or methanol, the specific gravity differs slightly." },
        ],
    },
    "fuel-tank-range-calculator": {
        subtitle: "Calculate how far you can drive on your current fuel level based on tank size, vehicle MPG, and fuel percentage remaining.",
        contentHTML: `<h2>How to Calculate Driving Range</h2>
<p>Knowing your driving range helps prevent running out of fuel and plan stops on road trips.</p>
<div class="explanation__highlight"><strong>Range = Tank Size × (Fuel Level ÷ 100) × MPG</strong></div>
<p><strong>Example:</strong> 16-gallon tank at 50% fuel in a 25 MPG car: 16 × 0.50 × 25 = <strong>200 miles</strong></p>

<h3>Average Tank Sizes by Vehicle Type</h3>
<table><thead><tr><th>Vehicle Type</th><th>Tank (gal)</th><th>Full Range (25 MPG)</th></tr></thead><tbody>
<tr><td>Compact Car</td><td>12–14</td><td>300–350 mi</td></tr>
<tr><td>Midsize Sedan</td><td>14–17</td><td>350–425 mi</td></tr>
<tr><td>SUV</td><td>18–24</td><td>360–480 mi</td></tr>
<tr><td>Full-Size Truck</td><td>26–36</td><td>400–540 mi</td></tr>
</tbody></table>

<h3>When to Fill Up</h3>
<p>Most fuel gauges become inaccurate below ¼ tank. Running very low can also damage the fuel pump (which uses fuel for cooling) and suck up sediment from the tank bottom. Best practice: fill up at ¼ tank.</p>`,
        faq: [
            { question: "How many miles can I drive on empty?", answer: "Most vehicles can drive 25–50 miles after the fuel light comes on, but this varies widely by model. The light typically triggers at 1–2.5 gallons remaining. Don't rely on this — running out of fuel can strand you and damage the fuel pump." },
        ],
    },
    "annual-fuel-cost-calculator": {
        subtitle: "Calculate your total yearly fuel expense from annual miles driven, vehicle MPG, and gas price. See monthly, weekly, and daily breakdowns.",
        contentHTML: `<h2>Calculating Your Annual Fuel Budget</h2>
<p>The average American drives <strong>13,500 miles per year</strong> and spends approximately <strong>$1,700–$2,500</strong> on fuel depending on vehicle efficiency and local gas prices.</p>
<div class="explanation__highlight"><strong>Annual Fuel Cost = (Miles/Year ÷ MPG) × Price/Gallon</strong></div>
<p><strong>Example:</strong> 15,000 miles at 25 MPG and $3.15/gallon = $1,890/year = $157.50/month</p>

<h3>How Annual Fuel Cost Varies by MPG</h3>
<table><thead><tr><th>Vehicle MPG</th><th>Annual Cost (15K mi)</th><th>Monthly</th></tr></thead><tbody>
<tr><td>15 MPG (Truck)</td><td>$3,150</td><td>$263</td></tr>
<tr><td>20 MPG (SUV)</td><td>$2,363</td><td>$197</td></tr>
<tr><td>25 MPG (Sedan)</td><td>$1,890</td><td>$158</td></tr>
<tr><td>35 MPG (Compact)</td><td>$1,350</td><td>$113</td></tr>
<tr><td>50 MPG (Hybrid)</td><td>$945</td><td>$79</td></tr>
</tbody></table>`,
        faq: [
            { question: "How much does the average American spend on gas?", answer: "About $2,000–$2,500 per year based on driving 13,500 miles at 25 MPG and $3.15/gallon. This ranges from $1,000 for a hybrid driver to $3,500+ for truck or SUV owners who drive above average miles." },
        ],
    },
    "mpg-improvement-calculator": {
        subtitle: "See how much money you save by improving your vehicle's fuel economy. Compare savings from a small MPG improvement to a dramatic one over 1, 5, and 10 years.",
        contentHTML: `<h2>The Value of Improving MPG</h2>
<p>Even small improvements in fuel economy add up to significant savings over time. Improving from 20 to 25 MPG saves more than improving from 35 to 40 MPG — because fuel consumption drops faster at lower MPG values.</p>
<div class="explanation__highlight"><strong>Annual Savings = Miles/Year × Price × (1/Old MPG − 1/New MPG)</strong></div>

<h3>How Much Can You Save?</h3>
<table><thead><tr><th>Improvement</th><th>Annual Savings*</th><th>5-Year Savings</th></tr></thead><tbody>
<tr><td>15 → 20 MPG</td><td>$788</td><td>$3,938</td></tr>
<tr><td>20 → 25 MPG</td><td>$473</td><td>$2,363</td></tr>
<tr><td>25 → 30 MPG</td><td>$315</td><td>$1,575</td></tr>
<tr><td>30 → 40 MPG</td><td>$394</td><td>$1,969</td></tr>
<tr><td>40 → 50 MPG</td><td>$189</td><td>$945</td></tr>
</tbody></table>
<p style="font-size:0.85rem;opacity:0.7">*At 15,000 mi/year and $3.15/gallon</p>

<h3>Easy Ways to Gain MPG</h3>
<ul>
<li><strong>Proper tire inflation:</strong> +3% MPG</li>
<li><strong>Remove roof rack when not in use:</strong> +2–8% MPG</li>
<li><strong>Regular oil changes:</strong> +1–2% MPG</li>
<li><strong>Clean air filter:</strong> +up to 10% (older cars)</li>
<li><strong>Eco driving habits:</strong> +10–20% MPG</li>
</ul>`,
        faq: [
            { question: "Why does improving from 15 to 20 MPG save more than 35 to 40?", answer: "Because fuel consumption is the reciprocal of MPG. Going from 15→20 MPG reduces consumption from 1,000 to 750 gallons (saves 250 gal). Going from 35→40 reduces from 429 to 375 gallons (saves only 54 gal). The worse your starting point, the bigger the savings from any improvement." },
        ],
    },
};

export default async function FuelCalcHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("fuel").find((c) => c.slug === calculator);
    if (!calc) return notFound();
    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];
    const pageUrl = canonicalUrl(`/automotive-calculators/fuel-economy/${calc.slug}`);
    const schemas: object[] = [
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") }, { name: "Fuel Economy", url: canonicalUrl("/automotive-calculators/fuel-economy") }, { name: calc.title }]), webAppSchema(calc.title, pageUrl, "USD", "UtilitiesApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas);
    const allFuelCalcs = getCalculatorsByCategory("fuel").filter(c => c.slug !== calculator);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-fuel-calc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Fuel Economy", href: "/automotive-calculators/fuel-economy" }, { label: calc.title.replace(/ Calculator.*$/, "") }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{content.subtitle}</p>}
            <div className="layout-2col">
                <div className="layout-2col__main">
                    <FuelEconomyCalculatorCore calcType={calc.calcType || "gas-mileage"} />
                    <AuthorBadge categoryKey="fuel" />
                    {content && (<>
                        <DynamicExplanation heading={`How to Use the ${calc.title}`} contentHTML={content.contentHTML} />
                        {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                    </>)}
                    <RelatedCalculators calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <div className="sidebar-card" style={{ position: "sticky", top: "80px" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>⛽ Fuel Economy Tools</h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            {allFuelCalcs.slice(0, 9).map(c => (
                                <li key={c.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                                    <a href={`/automotive-calculators/fuel-economy/${c.slug}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.87rem", textDecoration: "none", color: "var(--text)" }}>
                                        <span>{c.title.replace(/ Calculator$/, "")}</span>
                                        <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <a href="/automotive-calculators/fuel-economy" style={{ display: "block", marginTop: "14px", fontSize: "0.82rem", color: "#d4620a", fontWeight: 600, textDecoration: "none" }}>View all Fuel Calculators →</a>
                    </div>
                </aside>
            </div>
        </main>
    );
}

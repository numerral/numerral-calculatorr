// Standalone page — /in/fuel-cost-calculator
// India Fuel Cost Calculator with comprehensive educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import FuelCostCalculatorCore from "@/components/calculator/FuelCostCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Fuel Cost Calculator India 2026 — Petrol, Diesel & CNG Cost per KM",
    description: "Free fuel cost calculator for India. Calculate petrol, diesel, and CNG costs for daily commutes and road trips. City-wise fuel prices, mileage data for popular cars, trip cost estimator, and fuel comparison tool.",
    keywords: ["fuel cost calculator India", "petrol cost calculator", "diesel cost calculator", "CNG cost per km", "fuel cost per km calculator", "petrol price calculator India", "daily fuel cost calculator", "trip fuel cost calculator India", "fuel mileage calculator", "petrol diesel price comparison"],
    alternates: buildCountryAlternates("IN", "/in/fuel-cost-calculator", "fuel-cost-calculator"),
};

const FAQ_ITEMS = [
    { question: "How do I calculate fuel cost for a trip?", answer: "Use the formula: Total Fuel Cost = (Trip Distance in km ÷ Vehicle Mileage in km/litre) × Fuel Price per litre. For example, a 281 km Delhi to Jaipur trip in a car with 18 kmpl mileage at ₹94.77/litre petrol: (281 ÷ 18) × 94.77 = ₹1,479. Our Trip Cost mode calculates this instantly." },
    { question: "What is the average petrol price in India in 2026?", answer: "As of March 2026, petrol prices in India range from ₹94.51 per litre in Ahmedabad to ₹109.78 per litre in Hyderabad. Delhi petrol is ₹94.77/litre and Mumbai petrol is ₹103.54/litre. Prices vary between states due to different VAT rates." },
    { question: "Which fuel is cheapest — Petrol, Diesel, or CNG?", answer: "CNG is typically the cheapest fuel per kilometer of travel in India. At average prices and mileage, CNG costs about ₹3.08/km, diesel costs about ₹4.09/km, and petrol costs about ₹5.27/km. Use our Fuel Comparison mode to see the exact savings for your specific vehicle and city." },
    { question: "How much does it cost to travel 100 km by car in India?", answer: "For a petrol car with 18 kmpl mileage at ₹94.77/litre: (100 ÷ 18) × 94.77 ≈ ₹527. For a diesel car with 22 kmpl at ₹87.67/litre: ≈ ₹399. For CNG at 25 km/kg at ₹77.09/kg: ≈ ₹308. The exact cost depends on your vehicle's mileage and local fuel prices." },
    { question: "Why do petrol and diesel prices differ between Indian states?", answer: "Fuel prices differ because each state levies its own VAT (Value Added Tax) or sales tax on fuel on top of the central excise duty. States like Rajasthan and Maharashtra charge higher VAT, making fuel more expensive. Additionally, local transportation charges and dealer commissions contribute to price variations." },
    { question: "What is ARAI mileage vs real-world mileage?", answer: "ARAI (Automotive Research Association of India) mileage is tested under standardized laboratory conditions — constant speed, no AC, no traffic. Real-world mileage in Indian city driving is typically 20-30% lower due to stop-and-go traffic, AC usage, road conditions, and driving style. For example, a car claiming 22 kmpl may deliver 15-17 kmpl in city traffic." },
    { question: "How can I improve my car's fuel efficiency?", answer: "10 tips for better mileage: (1) Maintain correct tire pressure, (2) Drive at 50-80 km/h on highways, (3) Avoid sudden acceleration and braking, (4) Use AC judiciously — switch off in light traffic, (5) Get regular servicing — clean air filter and proper engine oil, (6) Remove unnecessary weight from the car, (7) Plan routes to avoid traffic, (8) Use the correct gear — don't over-rev, (9) Keep windows closed at highway speeds, (10) Consider CNG if you drive 1,000+ km/month." },
    { question: "Is CNG worth converting to from petrol?", answer: "CNG is worth it if you drive 1,000+ km per month. The CNG kit costs ₹50,000-₹80,000.  Savings are roughly ₹2/km. Break-even analysis: at 30 km/day (900 km/month), you save about ₹1,800/month, so the kit pays for itself in 28-44 months. For high-usage vehicles (Uber/Ola drivers), CNG conversion pays off in 8-12 months." },
    { question: "What is the composition of petrol price in India?", answer: "The retail petrol price is made up of: (1) Base price (crude oil cost + refining margin + freight): ~45-50%, (2) Central excise duty: ~₹3/litre (reduced March 2026), (3) Dealer commission: ~₹3.5-4/litre, (4) State VAT/Sales tax: 15-30% depending on the state. The state VAT is the biggest variable, which is why prices vary so much between states." },
    { question: "How do I calculate cost per km for my car?", answer: "Cost per km = Fuel Price per litre ÷ Vehicle Mileage (km per litre). Example: Petrol at ₹94.77/litre with a car giving 18 kmpl = ₹94.77 ÷ 18 = ₹5.27 per km. For diesel at ₹87.67/litre with 22 kmpl = ₹3.99/km. For CNG at ₹77.09/kg with 25 km/kg = ₹3.08/km." },
    { question: "When were fuel prices last changed in India?", answer: "India moved to a dynamic fuel pricing mechanism in June 2017, where prices are revised daily based on international crude oil rates and exchange fluctuations. However, in practice, Oil Marketing Companies (IOC, BPCL, HPCL) sometimes hold prices stable for extended periods to absorb fluctuations. The central excise duty was last reduced by ₹10/litre in March 2026." },
    { question: "What is the best mileage car in India 2026?", answer: "Top mileage cars in 2026: Maruti Suzuki Swift (24-25 kmpl petrol, 32+ km/kg CNG), Maruti Dzire (24-25 kmpl), Maruti Baleno (22-23 kmpl), Hyundai i20 (20-21 kmpl), Toyota Glanza (22-23 kmpl). For diesel: Maruti Dzire (25 kmpl), Hyundai Aura diesel (25 kmpl). For best overall running cost: any CNG variant gives the lowest cost per km." },
    { question: "How far can I travel on ₹500 of petrol?", answer: "With Delhi petrol at ₹94.77/litre and a car giving 18 kmpl: ₹500 buys 5.28 litres → 5.28 × 18 = 95 km. With a more efficient car (22 kmpl): 5.28 × 22 = 116 km. With CNG at ₹77.09/kg and 25 km/kg: ₹500 buys 6.49 kg → 162 km. Use our Budget → Distance mode for instant calculation." },
    { question: "Does driving with AC on increase fuel consumption?", answer: "Yes, using AC typically increases fuel consumption by 10-20% in city driving. The AC compressor puts extra load on the engine. At highway speeds (80+ km/h), AC is more efficient than open windows (which create aerodynamic drag). Tip: In moderate weather, use ventilation mode; in heavy traffic, consider turning AC off briefly to save fuel." },
    { question: "Should I buy a petrol or diesel car in India?", answer: "Choose diesel if you drive 1,500+ km per month — the higher mileage and lower per-litre cost offset the higher vehicle price (₹1-2 lakh premium). For under 1,000 km/month, petrol or CNG is more economical because the diesel variant's extra cost never breaks even. Since 2020, many manufacturers have dropped diesel from smaller cars, making CNG the primary alternative for cost-conscious buyers." },
];

export default function FuelCostCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Fuel Cost Calculator" },
        ]),
        webAppSchema("Fuel Cost Calculator India 2026", canonicalUrl("/in/fuel-cost-calculator")),
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
            <Script id="schema-fuel" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Fuel Cost Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Fuel Cost Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate petrol, diesel, and CNG costs for daily commutes, monthly budgets, and road trips across India. Compare fuel types, estimate trip costs, and find how far your budget takes you — with live city-wise prices for 15+ Indian cities.
            </p>
            <AuthorBadge categoryKey="salary" />
            <FuelCostCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Fuel Cost Calculator FAQ — India" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/math-calculators/percentage-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Percentage Calculator</div>
                            <div className="in-related-link__desc">Calculate fuel price changes</div>
                        </div>
                    </Link>
                    <Link href="/math-calculators/percentage-increase-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Percentage Increase</div>
                            <div className="in-related-link__desc">Track fuel price increases</div>
                        </div>
                    </Link>
                    <Link href="/utility-calculators/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest</div>
                            <div className="in-related-link__desc">Calculate investment returns</div>
                        </div>
                    </Link>
                    <Link href="/in" className="in-related-link">
                        <span className="in-related-link__icon">🇮🇳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">All India Calculators</div>
                            <div className="in-related-link__desc">Browse all India tools</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="how-to-calculate-fuel-cost">How to Calculate Fuel Cost</h2>
    <p>Calculating fuel cost is straightforward — you need just three numbers: the <strong>distance</strong> you plan to travel, your vehicle's <strong>mileage</strong> (fuel efficiency), and the current <strong>fuel price</strong>. Whether you're estimating your daily commute budget, planning a weekend road trip from Mumbai to Pune, or comparing annual fuel costs between petrol and CNG, the process follows the same simple formula.</p>
    <p>Follow these four steps to calculate fuel cost manually:</p>
    <ol>
        <li><strong>Determine your distance:</strong> Measure or estimate the total distance in kilometers. For daily commute, this is your one-way or round-trip office distance.</li>
        <li><strong>Find your vehicle's mileage:</strong> Check your car's fuel efficiency in <strong>km/litre</strong> (kmpl) for petrol/diesel or <strong>km/kg</strong> for CNG. Use real-world mileage, not the ARAI-claimed figure.</li>
        <li><strong>Check the current fuel price:</strong> Fuel prices vary by city in India. Check the latest petrol, diesel, or CNG price for your city.</li>
        <li><strong>Apply the formula:</strong> Divide the distance by mileage to get litres consumed, then multiply by fuel price.</li>
    </ol>
    <p>Our calculator above automates all four steps. Just select your city (prices auto-fill), enter your distance and mileage, and see instant results.</p>

    <h2 id="fuel-cost-formula">Fuel Cost Formula</h2>
    <div class="explanation__highlight">
        <strong>Total Fuel Cost = (Distance in km ÷ Mileage in km/litre) × Fuel Price per litre</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>Distance</strong> — one-way or total distance in kilometers</li>
        <li><strong>Mileage</strong> — your vehicle's fuel efficiency (km per litre for petrol/diesel, km per kg for CNG)</li>
        <li><strong>Fuel Price</strong> — current price per litre (₹/litre) or per kg (₹/kg) in your city</li>
    </ul>
    <p>To find <strong>cost per kilometer</strong>, simply divide the fuel price by your mileage:</p>
    <div class="explanation__highlight">
        <strong>Cost per km = Fuel Price (₹/litre) ÷ Mileage (km/litre)</strong>
    </div>

    <h2 id="worked-example-daily-commute">Worked Example — Daily Commute in Delhi</h2>
    <p>Ravi drives <strong>30 km</strong> daily (round trip) to his office in Delhi. He owns a <strong>Maruti Swift</strong> (petrol) with real-world city mileage of <strong>18 kmpl</strong>. Petrol in Delhi costs <strong>₹94.77/litre</strong>.</p>
    <ol>
        <li><strong>Fuel consumed per day:</strong> 30 km ÷ 18 kmpl = <strong>1.67 litres</strong></li>
        <li><strong>Daily fuel cost:</strong> 1.67 × ₹94.77 = <strong>₹158</strong></li>
        <li><strong>Monthly cost (30 days):</strong> ₹158 × 30 = <strong>₹4,740</strong></li>
        <li><strong>Yearly cost (365 days):</strong> ₹158 × 365 = <strong>₹57,670</strong></li>
        <li><strong>Cost per km:</strong> ₹94.77 ÷ 18 = <strong>₹5.27/km</strong></li>
    </ol>

    <h2 id="worked-example-road-trip">Worked Example — Delhi to Jaipur Road Trip</h2>
    <p>Planning a weekend trip from Delhi to Jaipur? The distance is <strong>281 km</strong> (one way). Using a <strong>Hyundai Creta</strong> (petrol, 15 kmpl highway mileage) at Delhi petrol price of ₹94.77/litre:</p>
    <ol>
        <li><strong>Fuel needed (one way):</strong> 281 ÷ 15 = <strong>18.73 litres</strong></li>
        <li><strong>One-way cost:</strong> 18.73 × ₹94.77 = <strong>₹1,775</strong></li>
        <li><strong>Round trip cost:</strong> ₹1,775 × 2 = <strong>₹3,550</strong></li>
        <li><strong>Cost per km:</strong> ₹94.77 ÷ 15 = <strong>₹6.32/km</strong></li>
    </ol>
    <p>Use our <strong>Trip Cost</strong> mode above to calculate this for any route in India.</p>

    <h2 id="fuel-prices-india">Today's Fuel Prices in Major Indian Cities (March 2026)</h2>
    <p>Fuel prices in India are revised daily under the <strong>dynamic fuel pricing</strong> mechanism adopted in June 2017. However, prices vary significantly between cities due to different <strong>state VAT rates</strong>. Below are indicative prices for major cities:</p>
    <table>
        <thead>
            <tr><th>City</th><th>Petrol (₹/L)</th><th>Diesel (₹/L)</th><th>CNG (₹/kg)</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Delhi</strong></td><td>₹94.77</td><td>₹87.67</td><td>₹77.09</td></tr>
            <tr><td><strong>Mumbai</strong></td><td>₹103.54</td><td>₹90.03</td><td>₹80.50</td></tr>
            <tr><td><strong>Bangalore</strong></td><td>₹102.96</td><td>₹90.99</td><td>₹88.95</td></tr>
            <tr><td><strong>Chennai</strong></td><td>₹100.85</td><td>₹92.81</td><td>₹91.50</td></tr>
            <tr><td><strong>Kolkata</strong></td><td>₹105.45</td><td>₹92.02</td><td>₹93.50</td></tr>
            <tr><td><strong>Hyderabad</strong></td><td>₹109.78</td><td>₹97.45</td><td>₹88.00</td></tr>
            <tr><td><strong>Pune</strong></td><td>₹104.36</td><td>₹90.33</td><td>₹78.00</td></tr>
            <tr><td><strong>Ahmedabad</strong></td><td>₹94.51</td><td>₹90.07</td><td>₹72.00</td></tr>
            <tr><td><strong>Jaipur</strong></td><td>₹104.88</td><td>₹90.36</td><td>₹85.00</td></tr>
            <tr><td><strong>Lucknow</strong></td><td>₹94.65</td><td>₹87.75</td><td>₹76.00</td></tr>
            <tr><td><strong>Chandigarh</strong></td><td>₹96.20</td><td>₹84.26</td><td>₹79.00</td></tr>
            <tr><td><strong>Bhopal</strong></td><td>₹108.65</td><td>₹93.90</td><td>₹84.00</td></tr>
            <tr><td><strong>Patna</strong></td><td>₹107.54</td><td>₹94.27</td><td>₹89.00</td></tr>
            <tr><td><strong>Guwahati</strong></td><td>₹96.01</td><td>₹88.94</td><td>₹90.00</td></tr>
            <tr><td><strong>Kochi</strong></td><td>₹104.47</td><td>₹93.47</td><td>₹92.00</td></tr>
        </tbody>
    </table>
    <p><em>Note: Prices are indicative and subject to daily revision. Last updated March 2026.</em></p>

    <h2 id="fuel-price-composition">How Fuel Prices Are Determined in India</h2>
    <p>The retail price you pay at the petrol pump is not just the cost of crude oil. It is a complex composition of multiple components:</p>
    <table>
        <thead>
            <tr><th>Component</th><th>Description</th><th>Approximate Share</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Base Price</strong></td><td>International crude oil cost + refining margin + freight charges</td><td>45–50%</td></tr>
            <tr><td><strong>Central Excise Duty</strong></td><td>Tax levied by the Union government (reduced to ~₹3/L for petrol, ₹0 for diesel in March 2026)</td><td>3–5%</td></tr>
            <tr><td><strong>Dealer Commission</strong></td><td>Margin for the petrol pump owner</td><td>₹3.50–4.00/L</td></tr>
            <tr><td><strong>State VAT/Sales Tax</strong></td><td>Varies by state: 15–30%+ of the pre-tax price</td><td>25–35%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Why prices vary between states:</strong> While the central excise duty is uniform nationwide, <strong>state VAT</strong> varies dramatically. Maharashtra charges among the highest VAT on petrol, which is why Mumbai's petrol (₹103.54) is ₹9+ more expensive than Delhi's (₹94.77) despite similar base costs.
    </div>

    <h2 id="mileage-popular-cars">Mileage of Popular Cars in India (2026)</h2>
    <p>Your car's mileage (fuel efficiency) is the most important variable in calculating fuel cost. Here are ARAI-claimed and estimated real-world mileage figures for India's most popular cars:</p>
    <table>
        <thead>
            <tr><th>Car Model</th><th>Fuel</th><th>ARAI (kmpl)</th><th>Real-World City</th><th>Real-World Highway</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Maruti Swift</strong></td><td>Petrol</td><td>24.80</td><td>16–18</td><td>20–22</td></tr>
            <tr><td><strong>Maruti Swift</strong></td><td>CNG</td><td>32.85 km/kg</td><td>24–26</td><td>28–30</td></tr>
            <tr><td><strong>Maruti Dzire</strong></td><td>Petrol</td><td>24.79</td><td>16–18</td><td>20–22</td></tr>
            <tr><td><strong>Maruti Baleno</strong></td><td>Petrol</td><td>22.94</td><td>15–17</td><td>19–21</td></tr>
            <tr><td><strong>Tata Nexon</strong></td><td>Petrol</td><td>17.44</td><td>12–14</td><td>16–18</td></tr>
            <tr><td><strong>Tata Nexon</strong></td><td>Diesel</td><td>23.22</td><td>17–19</td><td>21–23</td></tr>
            <tr><td><strong>Hyundai Creta</strong></td><td>Petrol</td><td>17.40</td><td>11–13</td><td>15–17</td></tr>
            <tr><td><strong>Hyundai Creta</strong></td><td>Diesel</td><td>21.38</td><td>15–17</td><td>19–21</td></tr>
            <tr><td><strong>Tata Punch</strong></td><td>Petrol</td><td>20.09</td><td>14–16</td><td>18–20</td></tr>
            <tr><td><strong>Mahindra XUV700</strong></td><td>Diesel</td><td>18.00</td><td>12–14</td><td>16–18</td></tr>
            <tr><td><strong>Maruti Alto K10</strong></td><td>Petrol</td><td>24.39</td><td>18–20</td><td>22–24</td></tr>
            <tr><td><strong>Maruti Wagon R</strong></td><td>CNG</td><td>34.05 km/kg</td><td>26–28</td><td>30–32</td></tr>
            <tr><td><strong>Hyundai i20</strong></td><td>Petrol</td><td>20.35</td><td>14–16</td><td>18–20</td></tr>
            <tr><td><strong>Honda City</strong></td><td>Petrol</td><td>18.40</td><td>12–14</td><td>17–19</td></tr>
            <tr><td><strong>Kia Seltos</strong></td><td>Diesel</td><td>20.70</td><td>14–16</td><td>18–20</td></tr>
            <tr><td><strong>Toyota Fortuner</strong></td><td>Diesel</td><td>14.40</td><td>9–11</td><td>13–15</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>ARAI vs Real-World:</strong> ARAI mileage is tested under controlled lab conditions — constant speed, no AC, flat road. In actual Indian city driving (stop-and-go traffic, AC, undulations), expect <strong>20–30% lower mileage</strong>. Highway driving typically gives <strong>10–15% lower</strong> than ARAI. Always use <em>real-world</em> mileage in fuel cost calculations for accuracy.
    </div>

    <h2 id="mileage-popular-bikes">Mileage of Popular Bikes in India</h2>
    <p>Two-wheelers are the most fuel-efficient mode of personal transport in India. Here are mileage figures for top-selling bikes and scooters:</p>
    <table>
        <thead>
            <tr><th>Bike/Scooter</th><th>ARAI (kmpl)</th><th>Real-World</th><th>Annual Cost (30 km/day)</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Honda Activa 6G</strong></td><td>60</td><td>45–50</td><td>~₹20,700</td></tr>
            <tr><td><strong>TVS Jupiter</strong></td><td>62</td><td>48–52</td><td>~₹19,900</td></tr>
            <tr><td><strong>Hero Splendor Plus</strong></td><td>72</td><td>55–65</td><td>~₹16,400</td></tr>
            <tr><td><strong>Bajaj Pulsar 150</strong></td><td>55</td><td>40–45</td><td>~₹23,000</td></tr>
            <tr><td><strong>Royal Enfield Classic 350</strong></td><td>37</td><td>30–35</td><td>~₹30,400</td></tr>
            <tr><td><strong>Honda CB Shine</strong></td><td>65</td><td>50–58</td><td>~₹18,500</td></tr>
            <tr><td><strong>TVS Apache RTR 160</strong></td><td>50</td><td>38–42</td><td>~₹24,600</td></tr>
            <tr><td><strong>Bajaj Platina 110</strong></td><td>70</td><td>60–65</td><td>~₹15,900</td></tr>
        </tbody>
    </table>
    <p><em>Annual cost assumes 30 km/day, 365 days, Delhi petrol at ₹94.77/litre, using real-world average mileage.</em></p>

    <h2 id="petrol-vs-diesel-vs-cng">Petrol vs Diesel vs CNG — Cost Comparison</h2>
    <p>Choosing the right fuel type is one of the biggest financial decisions for Indian vehicle owners. Here's a detailed comparison based on Delhi prices (March 2026):</p>
    <table>
        <thead>
            <tr><th>Parameter</th><th>Petrol</th><th>Diesel</th><th>CNG</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Price (Delhi)</strong></td><td>₹94.77/litre</td><td>₹87.67/litre</td><td>₹77.09/kg</td></tr>
            <tr><td><strong>Typical Car Mileage</strong></td><td>18 kmpl</td><td>22 kmpl</td><td>25 km/kg</td></tr>
            <tr><td><strong>Cost per km</strong></td><td><strong>₹5.27</strong></td><td><strong>₹3.99</strong></td><td><strong>₹3.08</strong></td></tr>
            <tr><td><strong>Monthly (30 km/day)</strong></td><td>₹4,743</td><td>₹3,587</td><td>₹2,774</td></tr>
            <tr><td><strong>Yearly (30 km/day)</strong></td><td>₹57,711</td><td>₹43,634</td><td>₹33,745</td></tr>
            <tr><td><strong>5-Year Running Cost</strong></td><td>₹2,88,555</td><td>₹2,18,170</td><td>₹1,68,725</td></tr>
            <tr><td><strong>Vehicle Price Premium</strong></td><td>Base</td><td>+₹1–2 lakh</td><td>+₹50K–80K (kit)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Bottom Line:</strong> CNG offers the <strong>lowest running cost</strong> (₹3.08/km) — saving <strong>₹23,966/year</strong> over petrol and <strong>₹9,889/year</strong> over diesel for someone driving 30 km/day. However, factor in the CNG kit cost (₹50K–80K), reduced boot space, and limited CNG station availability outside major cities.
    </div>

    <h2 id="diesel-break-even">Should You Buy Diesel? Break-Even Analysis</h2>
    <p>Diesel cars cost ₹1–2 lakh more than their petrol counterparts but offer better mileage and lower per-litre cost. The key question: <em>"How many kilometers do I need to drive before the diesel variant pays for itself?"</em></p>
    <div class="explanation__highlight">
        <strong>Break-Even Formula:</strong> Break-Even Distance = Price Premium ÷ (Petrol Cost/km − Diesel Cost/km)
    </div>
    <p><strong>Example — Hyundai Creta:</strong></p>
    <ul>
        <li>Petrol variant: ₹11 lakh | 13 kmpl city | Cost/km = ₹94.77 ÷ 13 = ₹7.29/km</li>
        <li>Diesel variant: ₹13 lakh | 16 kmpl city | Cost/km = ₹87.67 ÷ 16 = ₹5.48/km</li>
        <li>Saving per km with diesel: ₹7.29 − ₹5.48 = <strong>₹1.81/km</strong></li>
        <li>Break-even: ₹2,00,000 ÷ ₹1.81 = <strong>1,10,497 km</strong> (~3.7 years at 30,000 km/year)</li>
    </ul>
    <p>If you keep the car for <strong>5+ years</strong> and drive <strong>20,000+ km per year</strong>, diesel makes financial sense. For city-only driving under 10,000 km/year, stick with petrol or CNG.</p>

    <h2 id="fuel-efficiency-tips">10 Tips to Improve Fuel Efficiency in Indian Conditions</h2>
    <p>Indian roads and traffic present unique challenges. Here are 10 practical tips to reduce your fuel bills:</p>
    <ol>
        <li><strong>Maintain correct tire pressure:</strong> Under-inflated tires increase rolling resistance by 3–5%. Check tire pressure every 2 weeks — most Indian cars need 30–35 PSI.</li>
        <li><strong>Drive in the 50–80 km/h sweet spot:</strong> Most engines are optimized for this range. Going above 100 km/h increases fuel consumption significantly due to aerodynamic drag.</li>
        <li><strong>Avoid sudden acceleration and braking:</strong> Smooth, gradual acceleration uses <strong>15–20% less fuel</strong> than aggressive driving. This is especially important in Indian city traffic.</li>
        <li><strong>Use AC judiciously:</strong> AC increases fuel consumption by 10–20%. Below 40 km/h, consider open windows. Above 60 km/h, AC is more efficient than open windows (drag).</li>
        <li><strong>Get regular servicing:</strong> A dirty air filter alone can reduce mileage by <strong>5–10%</strong>. Change engine oil, air filter, and spark plugs as per schedule.</li>
        <li><strong>Remove unnecessary weight:</strong> Every 50 kg of extra weight reduces mileage by ~2%. Remove roof racks, heavy items from the boot, and unused accessories.</li>
        <li><strong>Plan routes to avoid traffic:</strong> Use Google Maps to avoid congestion. Idling in traffic burns 0.5–0.8 litres per hour of fuel with zero km covered.</li>
        <li><strong>Use the correct gear:</strong> In manual cars, upshift early (around 2,000–2,500 RPM). Don't lug the engine in too high a gear either — it causes unnecessary fuel richness.</li>
        <li><strong>Turn off the engine at long signals:</strong> Indian traffic signals can last 90–120 seconds. At any stop longer than 30 seconds, turning off the engine saves fuel.</li>
        <li><strong>Consider CNG for high usage:</strong> If you drive 1,000+ km/month, CNG conversion (₹50K–80K) pays for itself in 2–3 years and gives the lowest running cost.</li>
    </ol>

    <h2 id="popular-trip-costs">Popular Road Trip Fuel Costs in India</h2>
    <p>Planning a weekend getaway? Here are estimated fuel costs for popular Indian road trips (using a typical petrol car with 15 kmpl highway mileage):</p>
    <table>
        <thead>
            <tr><th>Route</th><th>Distance</th><th>Fuel (L)</th><th>One-Way Cost</th><th>Round Trip</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Delhi → Jaipur</strong></td><td>281 km</td><td>18.7 L</td><td>₹1,775</td><td>₹3,550</td></tr>
            <tr><td><strong>Mumbai → Pune</strong></td><td>149 km</td><td>9.9 L</td><td>₹1,028</td><td>₹2,056</td></tr>
            <tr><td><strong>Bangalore → Mysore</strong></td><td>150 km</td><td>10.0 L</td><td>₹1,030</td><td>₹2,060</td></tr>
            <tr><td><strong>Chennai → Pondicherry</strong></td><td>155 km</td><td>10.3 L</td><td>₹1,041</td><td>₹2,082</td></tr>
            <tr><td><strong>Delhi → Agra</strong></td><td>233 km</td><td>15.5 L</td><td>₹1,473</td><td>₹2,946</td></tr>
            <tr><td><strong>Mumbai → Goa</strong></td><td>589 km</td><td>39.3 L</td><td>₹4,067</td><td>₹8,134</td></tr>
            <tr><td><strong>Bangalore → Goa</strong></td><td>560 km</td><td>37.3 L</td><td>₹3,845</td><td>₹7,690</td></tr>
            <tr><td><strong>Delhi → Chandigarh</strong></td><td>244 km</td><td>16.3 L</td><td>₹1,542</td><td>₹3,084</td></tr>
        </tbody>
    </table>
    <p><em>Costs calculated using Delhi petrol price (₹94.77/L) for northern routes and respective city prices for others. Actual costs may vary with fuel price at the route's origin city.</em></p>

    <h2 id="dynamic-fuel-pricing">Understanding Dynamic Fuel Pricing in India</h2>
    <p>India adopted <strong>daily dynamic fuel pricing</strong> on June 16, 2017. Under this system, Oil Marketing Companies (OMCs) — Indian Oil Corporation (IOC), Bharat Petroleum (BPCL), and Hindustan Petroleum (HPCL) — revise petrol and diesel prices daily at <strong>6:00 AM</strong> based on:</p>
    <ul>
        <li><strong>International crude oil prices:</strong> India imports over 85% of its crude oil. Brent crude fluctuations directly impact the base cost.</li>
        <li><strong>USD/INR exchange rate:</strong> Since crude is traded in US dollars, rupee depreciation increases the cost for Indian refiners.</li>
        <li><strong>Refining margins:</strong> The spread between crude oil cost and refined product prices.</li>
        <li><strong>OMC operational costs:</strong> Freight, insurance, and storage.</li>
    </ul>
    <p>Before 2017, fuel prices were revised only on the 1st and 16th of each month. The shift to daily pricing was intended to smooth out price shock from fortnightly revisions and align Indian prices more closely with global markets.</p>
    <p><strong>March 2026 Update:</strong> The central excise duty on petrol was reduced by <strong>₹10/litre</strong> (down to ~₹3/litre) and on diesel to <strong>₹0</strong> in March 2026, as a government response to crude oil prices approaching $149/barrel due to geopolitical tensions.</p>

    <h2 id="cng-vs-petrol">CNG vs Petrol — Detailed Running Cost Analysis</h2>
    <p>CNG (Compressed Natural Gas) has become increasingly popular in India, especially in cities with CNG infrastructure like Delhi-NCR, Mumbai, Ahmedabad, Lucknow, and Pune. Here's a km-by-km comparison:</p>
    <div class="explanation__highlight">
        <strong>Petrol:</strong> ₹94.77/L ÷ 18 kmpl = <strong>₹5.27/km</strong><br/>
        <strong>CNG:</strong> ₹77.09/kg ÷ 25 km/kg = <strong>₹3.08/km</strong><br/>
        <strong>Saving with CNG:</strong> ₹2.19/km → <strong>₹23,966/year</strong> (at 30 km/day)
    </div>
    <p><strong>CNG Kit Cost:</strong> ₹50,000–₹80,000 (including installation). At ₹23,966/year savings, the kit pays for itself in <strong>2.1–3.3 years</strong>. For Uber/Ola drivers covering 150+ km/day, the payback is just <strong>5–8 months</strong>.</p>
    <p><strong>Considerations:</strong></p>
    <ul>
        <li><strong>Boot space:</strong> The CNG cylinder takes up significant boot space (~60L). Some OEM CNG variants have underseat cylinders to preserve boot space.</li>
        <li><strong>Station availability:</strong> CNG stations are concentrated in major metros. In tier-2/3 cities and highways, availability can be limited.</li>
        <li><strong>Performance:</strong> CNG mode typically delivers 10–15% lower power than petrol mode due to lower energy density.</li>
        <li><strong>Resale value:</strong> Aftermarket CNG fitment can reduce resale value. OEM (factory-fitted) CNG holds better value.</li>
    </ul>

    <h2 id="ev-comparison">Electric vs Petrol — Running Cost Perspective</h2>
    <p>With EVs like Tata Nexon EV, MG ZS EV, and Mahindra XUV400 gaining popularity, here's how electric compares on running cost:</p>
    <table>
        <thead>
            <tr><th>Parameter</th><th>Petrol</th><th>CNG</th><th>Electric (EV)</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Cost per km</strong></td><td>₹5.27</td><td>₹3.08</td><td><strong>₹1.00–1.50</strong></td></tr>
            <tr><td><strong>Monthly (30 km/day)</strong></td><td>₹4,743</td><td>₹2,774</td><td>₹900–1,350</td></tr>
            <tr><td><strong>Yearly</strong></td><td>₹57,711</td><td>₹33,745</td><td>₹10,950–16,425</td></tr>
            <tr><td><strong>Vehicle Price</strong></td><td>₹8–15 lakh</td><td>+₹50K–80K</td><td>₹14–25 lakh</td></tr>
        </tbody>
    </table>
    <p>EVs win decisively on running cost but have higher upfront costs. Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> to compare the total cost of ownership over 5–10 years.</p>

    <h2 id="related-concepts">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/math-calculators/percentage-calculator">Percentage Calculator</a></strong> — Calculate percentage increase/decrease in fuel prices across months or years.</li>
        <li><strong><a href="/math-calculators/percentage-increase-calculator">Percentage Increase Calculator</a></strong> — Track how much fuel prices have risen in your city.</li>
        <li><strong><a href="/utility-calculators/compound-interest-calculator">Compound Interest Calculator</a></strong> — Calculate how investing your fuel savings could grow over time.</li>
    </ul>
`;

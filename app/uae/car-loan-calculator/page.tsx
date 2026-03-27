import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../../ksa/ksa.css";
import "../uae.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UAECarLoanSalikCalculatorCore from "@/components/calculator/UAECarLoanSalikCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "UAE Car Loan & Salik Calculator 2025 — Auto EMI + Toll Costs",
    description: "Calculate your monthly car loan EMI in the UAE with flat-to-reducing rate conversion. Estimate Salik toll costs with 2025 variable pricing (AED 6 peak / AED 4 off-peak). Includes bank rate comparison and ownership cost breakdown.",
    keywords: ["UAE car loan calculator", "Dubai auto finance EMI", "Salik calculator", "حاسبة قرض السيارة", "flat rate vs reducing rate", "car loan interest rate UAE 2025", "Salik toll charges 2025", "CBUAE car loan rules", "car ownership cost Dubai"],
    alternates: { canonical: canonicalUrl("/uae/car-loan-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is the maximum car loan tenure in the UAE?", answer: "The Central Bank of the UAE (CBUAE) caps car loan tenure at a maximum of 60 months (5 years). This applies to all banks and financial institutions in the UAE. Some banks may offer shorter maximum tenures (e.g., 48 months) for used cars older than a certain age. The 60-month cap is designed to protect borrowers from excessive debt and ensure the loan doesn't extend beyond the vehicle's useful life." },
    { question: "What is the minimum down payment for a car loan in UAE?", answer: "The CBUAE mandates a minimum down payment of 20% of the car's value. This means the bank can finance a maximum of 80% of the vehicle's purchase price (Loan-to-Value ratio of 80%). For example, if a car costs AED 120,000, you must pay at least AED 24,000 upfront, and the bank can finance up to AED 96,000. Some banks may require higher down payments for used cars, non-salary-transfer customers, or high-risk profiles." },
    { question: "What is the difference between flat rate and reducing rate?", answer: "This is the most important concept in UAE car finance. A flat rate calculates interest on the original loan amount for the entire tenure — even though you're paying down the principal monthly. A reducing rate (APR) calculates interest only on the outstanding balance, which decreases with each payment. Banks advertise flat rates because they appear lower. To convert: flat rate × 1.82 ≈ reducing rate. So a 2.99% flat rate is actually equivalent to approximately 5.44% APR. Always compare total cost, not just the advertised rate." },
    { question: "What are the current car loan interest rates in Dubai?", answer: "As of 2025, new car loan flat rates range from 1.99% to 4.5% depending on the bank, car type, and customer profile. Emirates NBD and FAB offer rates from 1.99% (promotional), Emirates Islamic from 2.49% (Murabaha), RAKBANK and CBD from 2.99%, and Mashreq from 3.19%. Used car rates are typically 0.5–1.5% higher. Salary transfer customers and UAE Nationals generally get the best rates. Always check the latest rate with your bank as these change frequently." },
    { question: "How much are Salik toll charges in 2025?", answer: "Since January 31, 2025, Dubai's Salik tolls use variable pricing: AED 6 per crossing during peak hours (6–10AM and 4–8PM on weekdays), AED 4 during off-peak hours (10AM–4PM and 8PM–1AM), and free from 1AM to 6AM. Sundays are AED 4 flat all day. During Ramadan, timing shifts: peak is 9AM–5PM (AED 6), off-peak is 7–9AM and 5PM–2AM (AED 4), and free from 2–7AM. There is no daily or monthly cap on charges." },
    { question: "How many Salik toll gates are there in Dubai?", answer: "As of 2025, Dubai has 10 active Salik toll gates: Al Barsha (SZR), Al Garhoud Bridge, Al Maktoum Bridge (peak only), Al Mamzar North, Al Mamzar South, Al Safa North, Al Safa South (new Nov 2024), Airport Tunnel, Business Bay Crossing (new Nov 2024), and Jebel Ali (SZR). The two newest gates — Al Safa South and Business Bay Crossing — were activated in November 2024, expanding from 8 to 10 gates." },
    { question: "What is the Debt Burden Ratio (DBR) limit?", answer: "The CBUAE mandates that your total monthly loan payments (including car loan EMI, personal loans, credit card minimum payments, and mortgage) must not exceed 50% of your gross monthly salary and regular income. This is called the Debt Burden Ratio (DBR). If your salary is AED 15,000, your maximum total monthly debt payments cannot exceed AED 7,500. Banks use DBR as a primary eligibility criterion — if your existing obligations push you above 50%, your car loan application will be declined." },
    { question: "Is Islamic car financing better than conventional?", answer: "Islamic car financing (Murabaha) and conventional car loans serve the same purpose but are structured differently. In Murabaha, the bank buys the car and sells it to you at a markup — there's no 'interest.' In practice, the total cost is similar to conventional loans. Some advantages of Islamic financing: Sharia-compliance for Muslim customers, transparent total cost (no variable rates), and sometimes competitive rates from banks like Emirates Islamic (from 2.49% equivalent flat rate). The choice depends on personal preference and which bank offers the best total cost." },
    { question: "How much does car insurance cost in Dubai?", answer: "Car insurance in Dubai ranges from AED 450–1,000 for basic third-party liability (TPL) to AED 1,200–7,500+ for comprehensive coverage. The premium depends on: car value (1.25–3% for comprehensive), driver's age (under-25 surcharge of 25–45%), driving record (No Claim Discount of 10–30% for clean records), vehicle type (SUVs and luxury cars cost more), and agency vs non-agency repair. Electric vehicles get a 15% insurance discount until 2026. Insurance is mandatory for registration renewal." },
    { question: "What documents do I need for a car loan in UAE?", answer: "Required documents for a UAE car loan: (1) Emirates ID (valid), (2) Passport with residence visa, (3) Salary certificate and last 3–6 months' bank statements, (4) Vehicle quotation from the dealer, (5) Proof of address (utility bill or tenancy contract). For self-employed: trade license, company bank statements, and audited financials. Some banks require salary transfer as a condition for the best rates. Digital-first banks like Mashreq offer online applications with reduced paperwork." },
    { question: "Can I settle my car loan early in UAE?", answer: "Yes, early settlement is permitted under CBUAE regulations. Banks can charge a maximum early settlement fee of 1% of the remaining principal or AED 10,000 — whichever is lower. This cap was introduced by the CBUAE to protect consumers. When you settle early, the bank recalculates the amount owed, removing future interest charges. The best strategy is to settle when you have extra funds, as the interest savings almost always outweigh the early settlement penalty." },
    { question: "What happens to my car loan if I leave the UAE?", answer: "If you leave the UAE with an outstanding car loan, the bank can: (1) require immediate full settlement before canceling your visa, (2) repossess and auction the vehicle to recover the outstanding balance, (3) pursue legal action through UAE courts, including travel bans. Most banks require a security cheque at loan origination to cover this scenario. Upon leaving, you should either settle the loan, transfer it to another buyer (with bank approval), or sell the car and use proceeds to close the loan." },
    { question: "How much does a Salik tag cost?", answer: "A Salik tag costs AED 100 from authorized retail outlets (petrol stations, supermarkets), which includes AED 50 for the tag itself and AED 50 prepaid toll balance. Online purchase costs AED 120 (AED 50 tag + AED 50 balance + AED 20 delivery). You can top up your Salik account through the Salik app, website, Etisalat, du, Carrefour, ENOC stations, and various bank apps. Minimum top-up is AED 50. Not having a valid tag results in fines starting at AED 100." },
    { question: "How does car depreciation work in the UAE?", answer: "Cars in the UAE depreciate approximately 15–20% in the first year and 50–60% over 5 years. Japanese brands (Toyota, Nissan, Honda) hold value best, retaining 55–65% after 3 years. European luxury brands depreciate fastest — a BMW or Mercedes can lose 40–50% in 3 years. Key factors affecting resale: brand reputation, mileage (average is 20,000 km/year), accident history (checked via VIN on dubicars.com), service history (agency-maintained cars command premiums), and GCC-spec vs imported." },
    { question: "What are the car registration renewal fees in Dubai?", answer: "Annual car registration renewal (Mulkiya) costs approximately AED 350–380 for light vehicles. Vehicles older than 3 years must pass a technical inspection (AED 150–170). Additional fees include: Knowledge and Innovation fee (AED 20), courier delivery (AED 20–50), special plate fees (AED 35–500). Late renewal penalty: AED 25–35/month after 30-day grace period. Driving with expired registration: AED 500 fine + 4 black points + possible impoundment. Electric vehicles get a 15% reduction in registration fees." },
    { question: "Can I transfer my car loan to another bank?", answer: "Yes, car loan buyout/refinancing is possible in the UAE. Another bank pays off your existing loan and creates a new one, often at a lower rate. Benefits: lower interest rate, reduced EMI, extended tenure, or consolidation with other loans. Process: Apply to the new bank → they evaluate the car → pay off the old loan → register the new mortgage → you start paying the new bank. Costs include: early settlement fee (max 1% or AED 10,000), new bank processing fee, and mortgage re-registration. This makes sense if the new rate is at least 1% lower than your current flat rate." },
];

export default function CarLoanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "UAE Calculators", url: `${SITE_URL}/uae` },
            { name: "Car Loan & Salik Calculator" },
        ]),
        webAppSchema("Car Loan & Salik Calculator", canonicalUrl("/uae/car-loan-calculator")),
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
            <Script id="schema-carloan-uae" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators", href: "/uae" },
                { label: "Car Loan & Salik Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>UAE Car Loan & Salik Calculator 2025</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your monthly car loan EMI with flat-to-reducing rate conversion and estimate your Salik toll costs with 2025 variable pricing. Includes CBUAE regulations, bank rate comparison, and total car ownership cost breakdown.
            </p>
            <AuthorBadge categoryKey="loan" />
            <UAECarLoanSalikCalculatorCore />

            <section className="uae-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Car Loan & Salik FAQ" items={FAQ_ITEMS} />

            <section className="uae-related">
                <h3>Related Calculators</h3>
                <div className="uae-related-links">
                    <Link href="/uae/mortgage-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🏢</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Mortgage Calculator</div>
                            <div className="uae-related-link__desc">Home loan EMI & DLD fees</div>
                        </div>
                    </Link>
                    <Link href="/uae/salary-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">💰</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE Salary Calculator</div>
                            <div className="uae-related-link__desc">Net salary & affordability</div>
                        </div>
                    </Link>
                    <Link href="/uae/vat-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">🧾</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">UAE VAT Calculator</div>
                            <div className="uae-related-link__desc">5% VAT on purchases</div>
                        </div>
                    </Link>
                    <Link href="/uae/dewa-calculator" className="uae-related-link">
                        <span className="uae-related-link__icon">⚡</span>
                        <div className="uae-related-link__text">
                            <div className="uae-related-link__title">DEWA Bill Calculator</div>
                            <div className="uae-related-link__desc">Monthly utility costs</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="car-loan-basics">Car Loans in the UAE — How They Work</h2>
    <p>Buying a car in the UAE usually involves financing through a bank or financial institution. Understanding the mechanics of car loans — especially the critical difference between <strong>flat and reducing rates</strong> — can save you thousands of dirhams over the life of your loan.</p>
    <p>The <strong>Central Bank of the UAE (CBUAE)</strong> regulates all consumer lending, including car loans. Key regulations include: maximum 80% Loan-to-Value (minimum 20% down payment), maximum 60-month tenure, and a Debt Burden Ratio (DBR) cap of 50% of gross income.</p>

    <h2 id="flat-vs-reducing">Flat Rate vs Reducing Rate — The Most Important Concept</h2>
    <p>This is the single most important thing to understand about car loans in the UAE. Banks advertise <strong>flat rates</strong> because they appear lower, but the actual cost (reducing/APR rate) is approximately <strong>1.8× higher</strong>.</p>
    <table>
        <thead><tr><th>Concept</th><th>Flat Rate</th><th>Reducing Rate (APR)</th></tr></thead>
        <tbody>
            <tr><td><strong>Calculation basis</strong></td><td>Interest on original loan amount</td><td>Interest on outstanding balance only</td></tr>
            <tr><td><strong>As you repay</strong></td><td>Interest stays the same</td><td>Interest decreases each month</td></tr>
            <tr><td><strong>Advertised?</strong></td><td>Yes — banks promote this</td><td>Rarely shown upfront</td></tr>
            <tr><td><strong>True cost?</strong></td><td>Understates actual cost</td><td>Reflects true cost of borrowing</td></tr>
            <tr><td><strong>Conversion</strong></td><td>Flat × 1.82 ≈ Reducing</td><td>Reducing ÷ 1.82 ≈ Flat</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Example:</strong> A 2.99% flat rate on a 5-year AED 100,000 loan means you pay interest on the full AED 100,000 every year — even when you&apos;ve repaid AED 60,000. The effective reducing rate is approximately 5.44%. This means the bank earns far more than the headline 2.99% suggests.
    </div>

    <h3>Worked Example: AED 120,000 New Car</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Car price</strong></td><td>AED 120,000</td></tr>
            <tr><td>Down payment (20%)</td><td>AED 24,000</td></tr>
            <tr><td><strong>Loan amount</strong></td><td>AED 96,000</td></tr>
            <tr><td>Flat rate</td><td>2.99% p.a.</td></tr>
            <tr><td>Tenure</td><td>60 months (5 years)</td></tr>
            <tr><td>Total interest</td><td>96,000 × 2.99% × 5 = <strong>AED 14,352</strong></td></tr>
            <tr><td>Total repayment</td><td>96,000 + 14,352 = <strong>AED 110,352</strong></td></tr>
            <tr><td><strong>Monthly EMI</strong></td><td>110,352 ÷ 60 = <strong>AED 1,839.20</strong></td></tr>
            <tr><td>Effective reducing rate</td><td>~5.44% APR</td></tr>
        </tbody>
    </table>

    <h2 id="cbuae-regulations">CBUAE Car Loan Regulations</h2>
    <p>The Central Bank of the UAE sets strict rules for car financing to protect consumers:</p>
    <table>
        <thead><tr><th>Regulation</th><th>Requirement</th><th>Purpose</th></tr></thead>
        <tbody>
            <tr><td><strong>Maximum LTV</strong></td><td>80% (min 20% down payment)</td><td>Ensures borrower has equity in the car</td></tr>
            <tr><td><strong>Maximum tenure</strong></td><td>60 months (5 years)</td><td>Prevents loan extending beyond car&apos;s useful life</td></tr>
            <tr><td><strong>DBR cap</strong></td><td>50% of gross salary</td><td>Prevents over-indebtedness</td></tr>
            <tr><td><strong>Early settlement fee</strong></td><td>Max 1% or AED 10,000 (lower)</td><td>Protects right to prepay</td></tr>
            <tr><td><strong>Vehicle mortgage</strong></td><td>Car is collateral for the loan</td><td>Bank holds vehicle title until fully paid</td></tr>
        </tbody>
    </table>

    <h2 id="bank-comparison">Bank Rate Comparison (2025)</h2>
    <p>Car loan rates vary significantly between banks, and the best rate depends on your profile (salary transfer customer, UAE National, car type). Here&apos;s a comparison of major UAE banks:</p>
    <table>
        <thead><tr><th>Bank</th><th>Flat Rate (New)</th><th>Type</th><th>Key Features</th></tr></thead>
        <tbody>
            <tr><td><strong>Emirates NBD</strong></td><td>From 1.99%</td><td>Conventional</td><td>Best promotional rate; fast approval; 0% DP on credit card</td></tr>
            <tr><td><strong>First Abu Dhabi Bank</strong></td><td>From 2.49%</td><td>Conventional</td><td>Up to AED 1.5M; EIBOR-linked option available</td></tr>
            <tr><td><strong>Emirates Islamic</strong></td><td>From 2.49%</td><td>Murabaha</td><td>Sharia-compliant; transparent markup</td></tr>
            <tr><td><strong>ADCB</strong></td><td>From 2.75%</td><td>Conventional</td><td>Flexible tenure; pre-approval in 2 hours</td></tr>
            <tr><td><strong>RAKBANK</strong></td><td>From 2.99%</td><td>Conventional</td><td>Non-salary-transfer friendly; competitive used car rates</td></tr>
            <tr><td><strong>Mashreq</strong></td><td>From 3.19%</td><td>Conventional</td><td>Digital application; same-day approval possible</td></tr>
            <tr><td><strong>Dubai Islamic Bank</strong></td><td>From 2.65%</td><td>Murabaha</td><td>Largest Islamic bank; strong dealer partnerships</td></tr>
        </tbody>
    </table>

    <h2 id="salik-system">Salik Toll System — Complete Guide</h2>
    <p><strong>Salik</strong> (meaning &quot;clear&quot; or &quot;open&quot; in Arabic) is Dubai&apos;s electronic toll collection system operated by Salik PJSC (listed on DFM since September 2022). Vehicles are charged automatically as they pass through toll gates via an RFID tag affixed to the windshield.</p>

    <h3>Variable Pricing (Effective January 31, 2025)</h3>
    <p>Dubai introduced <strong>variable (congestion-based) pricing</strong> in January 2025, replacing the previous flat AED 4 rate:</p>
    <table>
        <thead><tr><th>Time Period</th><th>Weekday Rate</th><th>Sunday Rate</th><th>Hours</th></tr></thead>
        <tbody>
            <tr><td><strong>🔴 Peak</strong></td><td><strong>AED 6</strong></td><td>AED 4</td><td>6:00–10:00 AM &amp; 4:00–8:00 PM</td></tr>
            <tr><td><strong>🟡 Off-Peak</strong></td><td><strong>AED 4</strong></td><td>AED 4</td><td>10:00 AM–4:00 PM &amp; 8:00 PM–1:00 AM</td></tr>
            <tr><td><strong>🟢 Late Night</strong></td><td><strong>FREE</strong></td><td>FREE</td><td>1:00 AM–6:00 AM</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Ramadan timing adjustment:</strong> Peak shifts to 9:00 AM–5:00 PM (AED 6), off-peak becomes 7:00–9:00 AM and 5:00 PM–2:00 AM (AED 4), and toll-free hours extend to 2:00–7:00 AM.
    </div>

    <h3>All 10 Salik Gates (2025)</h3>
    <p>Dubai operates <strong>10 toll gates</strong> on major highways and crossings:</p>
    <table>
        <thead><tr><th>#</th><th>Gate Name</th><th>Road</th><th>Special Rules</th></tr></thead>
        <tbody>
            <tr><td>1</td><td><strong>Al Barsha</strong></td><td>Sheikh Zayed Road (E11)</td><td>Standard pricing</td></tr>
            <tr><td>2</td><td><strong>Al Garhoud Bridge</strong></td><td>Sheikh Rashid Road</td><td>Standard pricing</td></tr>
            <tr><td>3</td><td><strong>Al Maktoum Bridge</strong></td><td>Umm Hurair Road</td><td>Peak hours only — free at night and Fridays</td></tr>
            <tr><td>4</td><td><strong>Al Mamzar North</strong></td><td>Al Ittihad Road (to Sharjah)</td><td>1-hour rule with South gate</td></tr>
            <tr><td>5</td><td><strong>Al Mamzar South</strong></td><td>Al Ittihad Road (return)</td><td>1-hour rule with North gate</td></tr>
            <tr><td>6</td><td><strong>Al Safa North</strong></td><td>Sheikh Zayed Road</td><td>1-hour rule with South gate</td></tr>
            <tr><td>7</td><td><strong>Al Safa South ⭐</strong></td><td>Sheikh Zayed Road</td><td>NEW — activated Nov 2024</td></tr>
            <tr><td>8</td><td><strong>Airport Tunnel</strong></td><td>Beirut Street</td><td>Near DXB Terminal 3</td></tr>
            <tr><td>9</td><td><strong>Business Bay Crossing ⭐</strong></td><td>Al Khail Road</td><td>NEW — activated Nov 2024</td></tr>
            <tr><td>10</td><td><strong>Jebel Ali</strong></td><td>Sheikh Zayed Road (E11)</td><td>Last gate before Abu Dhabi</td></tr>
        </tbody>
    </table>

    <h2 id="ownership-costs">Total Car Ownership Costs in Dubai</h2>
    <p>Beyond the purchase price and loan payments, car ownership in Dubai involves multiple recurring costs. Here&apos;s a realistic annual breakdown for 2025:</p>
    <table>
        <thead><tr><th>Expense</th><th>Budget Sedan</th><th>Mid-Range SUV</th><th>Luxury Vehicle</th></tr></thead>
        <tbody>
            <tr><td><strong>Insurance (comprehensive)</strong></td><td>AED 1,200</td><td>AED 2,500</td><td>AED 5,000+</td></tr>
            <tr><td><strong>Registration + inspection</strong></td><td>AED 550</td><td>AED 550</td><td>AED 550</td></tr>
            <tr><td><strong>Salik tolls</strong></td><td>AED 1,200</td><td>AED 2,400</td><td>AED 3,600</td></tr>
            <tr><td><strong>Fuel</strong></td><td>AED 2,400</td><td>AED 3,600</td><td>AED 6,000</td></tr>
            <tr><td><strong>Maintenance</strong></td><td>AED 1,000</td><td>AED 2,000</td><td>AED 5,000+</td></tr>
            <tr><td><strong>Parking</strong></td><td>AED 1,200</td><td>AED 2,400</td><td>AED 4,800</td></tr>
            <tr><td><strong>Total annual</strong></td><td><strong>~AED 7,550</strong></td><td><strong>~AED 13,450</strong></td><td><strong>~AED 24,950+</strong></td></tr>
            <tr><td><strong>Monthly equivalent</strong></td><td><strong>~AED 629</strong></td><td><strong>~AED 1,121</strong></td><td><strong>~AED 2,079+</strong></td></tr>
        </tbody>
    </table>

    <h2 id="insurance">Car Insurance in the UAE</h2>
    <p>Car insurance is mandatory in the UAE. There are two main types:</p>
    <ul>
        <li><strong>Third-Party Liability (TPL)</strong> — Minimum legal requirement; covers damage to others; costs AED 450–1,000/year</li>
        <li><strong>Comprehensive</strong> — Full coverage including own damage, theft, fire; costs 1.25–3% of car value; required by most banks for financed cars</li>
    </ul>
    <p>Factors affecting your premium: vehicle value and type, driver age (under-25 surcharge of 25–45%), driving history (No Claim Discount of 10–30%), agency vs non-agency repairs, and deductible amount. Electric vehicles receive a 15% insurance discount until 2026.</p>

    <h2 id="depreciation">Car Depreciation in Dubai</h2>
    <p>Depreciation is the largest hidden cost of car ownership. In the UAE:</p>
    <ul>
        <li><strong>Year 1:</strong> 15–20% depreciation (the biggest single-year loss)</li>
        <li><strong>Year 3:</strong> 35–45% total depreciation from purchase price</li>
        <li><strong>Year 5:</strong> 50–60% total depreciation</li>
    </ul>
    <p>Japanese brands (Toyota, Nissan, Honda) hold value best — a Toyota Camry retains ~60% after 3 years. German luxury brands depreciate fastest — a BMW 5 Series can lose 45% in 3 years. Buying a 1–2 year old car with low mileage is often the best financial strategy, as you avoid the steepest depreciation while getting a near-new vehicle.</p>

    <h2 id="ev-benefits">Electric Vehicle Benefits in Dubai</h2>
    <ul>
        <li><strong>Free Salik:</strong> Some EV models qualify for free toll passage (check RTA for current eligibility)</li>
        <li><strong>Registration discount:</strong> 15% reduction in RTA registration fees</li>
        <li><strong>Insurance discount:</strong> 15% reduction in premiums (until 2026)</li>
        <li><strong>Free public parking:</strong> Available at designated green spots</li>
        <li><strong>DEWA Green Charger:</strong> 29 fils/kWh at public stations; home charging at residential slab rate</li>
    </ul>

    <h2 id="tips">Smart Car Buying Tips for the UAE</h2>
    <ol>
        <li><strong>Compare total cost, not flat rate</strong> — Two banks with the same flat rate may charge different fees</li>
        <li><strong>Negotiate the car price first</strong> — A lower price means lower down payment AND lower interest</li>
        <li><strong>Consider salary transfer</strong> — Banks offer 0.5–1% lower rates for salary transfer customers</li>
        <li><strong>Buy during promotions</strong> — Ramadan, DSF (Dubai Shopping Festival), and year-end clearance offer the best deals</li>
        <li><strong>Get pre-approved</strong> — Know your budget before visiting the showroom</li>
        <li><strong>Check DBR first</strong> — Calculate your Debt Burden Ratio before applying</li>
        <li><strong>Consider used cars</strong> — A 1–2 year old certified pre-owned (CPO) car can save 20–30%</li>
        <li><strong>Factor in all costs</strong> — Include insurance, Salik, fuel, maintenance, and parking</li>
    </ol>
`;

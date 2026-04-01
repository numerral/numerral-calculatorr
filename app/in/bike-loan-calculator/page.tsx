// Standalone page — /in/bike-loan-calculator
// India Bike Loan EMI Calculator with 5,000+ word educational hub

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import BikeLoanCalculatorCore from "@/components/calculator/BikeLoanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Bike Loan EMI Calculator India 2026 — Two-Wheeler EMI, Eligibility & Interest Rates",
    description: "Free bike loan EMI calculator for India. Calculate two-wheeler monthly EMI, compare 12+ bank & NBFC rates (SBI, HDFC, Bajaj Finance, TVS Credit), check eligibility, prepayment savings, and model-wise EMI for Honda Activa, Splendor, Apache, Royal Enfield. PM E-DRIVE EV subsidy guide included.",
    keywords: ["bike loan EMI calculator", "two wheeler loan calculator India", "bike EMI calculator 2026", "two wheeler loan interest rate", "bike loan eligibility", "Honda Activa EMI", "Royal Enfield loan EMI", "Bajaj Finance bike loan rate", "TVS Credit interest rate", "electric scooter loan India", "PM E-DRIVE subsidy", "CIBIL score bike loan"],
    alternates: buildCountryAlternates("IN", "/in/bike-loan-calculator", "bike-loan-calculator"),
};

const FAQ_ITEMS = [
    { question: "How is bike loan EMI calculated?", answer: "Bike loan EMI is calculated using the standard reducing balance formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P is the loan principal (on-road price minus down payment), R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the total number of months. For example, a ₹90,000 loan (Honda Activa 6G after 10% down) at 12% for 2 years gives an EMI of ₹4,244." },
    { question: "What is the minimum CIBIL score for a two-wheeler loan?", answer: "Most lenders require a CIBIL score of 700 or above for two-wheeler loan approval. With 750+, you get the best interest rates (10–12%). Between 650–700, loans are possible but at higher rates (14–18%). Below 650, most banks reject applications. NBFCs like Bajaj Finance and TVS Credit may approve at slightly lower scores with a higher down payment or guarantor." },
    { question: "What is the minimum salary required for a bike loan in India?", answer: "Most lenders require a minimum monthly income of ₹10,000–₹15,000 for standard two-wheeler loans under ₹1 lakh. For premium bikes (Royal Enfield, KTM, etc.) priced above ₹1.5 lakh, the minimum salary requirement is typically ₹25,000+. Self-employed individuals need ITR or bank statements showing regular income of equivalent amounts." },
    { question: "Can I get 100% financing on a two-wheeler?", answer: "Some NBFCs like Bajaj Finance and TVS Credit offer up to 100% of the ex-showroom price as loan. However, you still pay registration, insurance, road tax, and accessories separately — typically ₹8,000–₹25,000 additional. True 100% on-road financing is rare and comes at premium interest rates (14–18%). A 10–20% down payment is recommended." },
    { question: "What is the maximum tenure for a bike loan?", answer: "Standard two-wheeler loans offer maximum tenure of 3–4 years (36–48 months). For superbikes (Royal Enfield 650cc, KTM, BMW, Ducati), some lenders offer up to 5 years (60 months). However, keeping tenure to 2–3 years is recommended because two-wheelers depreciate 30–40% in 3 years — you don't want to owe more than the bike is worth." },
    { question: "Which is cheaper — bank or dealer/NBFC bike loan?", answer: "Banks (SBI, HDFC, ICICI) typically charge 10–14% interest but require more paperwork and 2–5 days processing. Dealer-tied NBFCs (Bajaj Finance, TVS Credit, Hero FinCorp) charge 12–18% but process in 15–30 minutes at the showroom. For a ₹1 lakh loan over 3 years, the 4% rate difference means ₹6,000–₹8,000 extra in total interest with the NBFC. If the total saving exceeds ₹3,000, the bank route is worth the extra effort." },
    { question: "Can I prepay or foreclose my bike loan without penalty?", answer: "Under the RBI Pre-Payment Charges Directions 2025 (effective January 1, 2026), banks and NBFCs cannot charge prepayment/foreclosure penalty on floating-rate loans for individual borrowers. Most two-wheeler loans are fixed-rate, where lenders may charge 2–5% penalty on outstanding principal. Always check your loan agreement's Key Fact Statement (KFS) for exact charges before prepaying." },
    { question: "What documents are needed for a bike loan?", answer: "For salaried: PAN Card, Aadhaar Card, 3 months salary slips, 3–6 months bank statements, and a vehicle quotation from the dealer. For self-employed: PAN, Aadhaar, ITR for 2 years, and bank statements. Some NBFCs offering instant loans at showrooms only require Aadhaar + PAN + one selfie for loans under ₹1 lakh." },
    { question: "Is bike loan interest tax deductible in India?", answer: "No, two-wheeler loan interest is NOT tax deductible for personal-use bikes in India. Unlike home loans (Section 24b) or education loans (Section 80E), there is no specific tax section for vehicle loan interest deduction for individuals. However, if the bike is used for business purposes by a sole proprietor, the interest can be claimed as a business expense under Section 37." },
    { question: "What is the current two-wheeler loan interest rate in India 2026?", answer: "As of March 2026, two-wheeler loan interest rates range from approximately 10.25% (ICICI Bank) to 28% (Shriram Finance for subprime). Major indicators: SBI 11.70–15.70%, HDFC Bank from 14.50%, ICICI Bank from 10.25%, Axis Bank 10.50–28%, Bajaj Finance 14–28%, TVS Credit 14–24%, Hero FinCorp from 12%. Your actual rate depends on CIBIL score, income, bike model, and lender." },
    { question: "How much EMI will I pay for a ₹1 lakh bike loan?", answer: "For a ₹1 lakh bike loan at 12% p.a.: 1 year = ₹8,885/month (total interest ₹6,617), 2 years = ₹4,707/month (total interest ₹12,968), 3 years = ₹3,321/month (total interest ₹19,570). At 15% p.a.: 1 year = ₹9,026, 2 years = ₹4,849, 3 years = ₹3,466. Choose the shortest tenure you can afford — every additional year adds ₹5,000–₹7,000 in total interest." },
    { question: "Can I transfer my bike loan to another bank?", answer: "Bike loan balance transfers exist but are rare because the ticket size is small (₹50K–₹3L). The processing fee (₹500–₹1,500) and effort often outweigh the interest saving. For example, on an ₹80,000 outstanding at 16% with 18 months left, switching to 12% saves only ₹1,200. Full prepayment using savings is usually the better strategy for two-wheelers." },
    { question: "What are the total charges for a two-wheeler loan?", answer: "Beyond the interest rate, expect: Processing Fee (₹500–₹2,500 or 1–3% of loan), Documentation Charges (₹200–₹500), Stamp Duty (state-dependent, ₹100–₹500), Late Payment Penalty (1–2% per month on overdue EMI), Bounce Charges (₹300–₹500 per failed ECS/NACH), and Foreclosure Charges (0–5% of outstanding). Always read the Key Fact Statement (KFS) before signing." },
    { question: "Is insurance mandatory when taking a bike loan?", answer: "Yes, comprehensive insurance is typically mandatory for the duration of the bike loan. Per IRDAI rules, new two-wheelers must have a 5-year third-party insurance policy upfront. The lender will require comprehensive coverage (own damage + third-party) and will be listed as the financier on the policy. RBI rules prohibit the lender from forcing you to buy insurance from their partner — you can choose any IRDAI-registered insurer." },
    { question: "What is the PM E-DRIVE subsidy for electric two-wheelers in 2026?", answer: "The PM E-DRIVE (Electric Drive Revolution in Innovative Vehicle Enhancement) scheme provides a subsidy of ₹2,500 per kWh of battery capacity, capped at ₹5,000 per vehicle, for electric two-wheelers with ex-showroom price under ₹1.5 lakh. The scheme is active until July 31, 2026. The subsidy is linked to Aadhaar (one vehicle per individual). Some states offer additional incentives — Delhi, Maharashtra, and Gujarat have their own EV subsidy programs." },
    { question: "Should I buy a bike on EMI or pay cash?", answer: "If you have the cash, paying upfront saves ₹5,000–₹20,000 in interest (depending on bike price and tenure). However, EMI makes sense if: (1) You need the bike urgently for work/commute and can't save up in time, (2) The NBFC is offering 0% or low-interest promotional EMI during festivals, (3) You can invest the cash at a return higher than the loan rate (unlikely for most individuals). For bikes under ₹1 lakh, paying cash is almost always better financially." },
];

export default function BikeLoanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Bike Loan EMI Calculator" },
        ]),
        webAppSchema("Bike Loan EMI Calculator India 2026", canonicalUrl("/in/bike-loan-calculator")),
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
            <Script id="schema-bikeloan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Bike Loan EMI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Bike Loan EMI Calculator India 2026</h1>
            <PageDesc>
                Calculate your two-wheeler loan EMI, compare 12+ bank and NBFC interest rates (SBI, HDFC, ICICI, Bajaj Finance, TVS Credit), check eligibility, and see how prepayment saves money. Covers scooters, commuters, sports bikes, and superbikes — with model-wise EMI examples and the PM E-DRIVE EV subsidy guide.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <BikeLoanCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Bike Loan EMI Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/car-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🚗</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Car Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Upgrading to four wheels? Compare rates</div>
                        </div>
                    </Link>
                    <Link href="/in/personal-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Personal Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Unsecured loan EMI & CIBIL guide</div>
                        </div>
                    </Link>
                    <Link href="/in/fuel-cost-calculator" className="in-related-link">
                        <span className="in-related-link__icon">⛽</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Fuel Cost Calculator</div>
                            <div className="in-related-link__desc">Daily commute running cost</div>
                        </div>
                    </Link>
                    <Link href="/in/loan-eligibility-calculator" className="in-related-link">
                        <span className="in-related-link__icon">✅</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Loan Eligibility Calculator</div>
                            <div className="in-related-link__desc">Check eligibility across loan types</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">FY 2025-26 tax computation</div>
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
    <h2 id="what-is-bike-loan-emi">What Is a Bike Loan EMI?</h2>
    <p>An <strong>Equated Monthly Instalment (EMI)</strong> is the fixed amount you pay every month to repay your two-wheeler loan. Each EMI is split into two components: <strong>principal repayment</strong> (which reduces your actual loan balance) and <strong>interest payment</strong> (the cost of borrowing charged by the lender).</p>
    <p>Two-wheeler loans are the <strong>most accessible vehicle finance product in India</strong>, with over 10 crore two-wheelers sold annually. Unlike <a href="/in/home-loan-calculator">home loans</a> (7–9%, up to 30 years) or <a href="/in/car-loan-calculator">car loans</a> (8–12%, up to 7 years), bike loans are characterised by:</p>
    <ul>
        <li><strong>Smaller ticket size:</strong> ₹30,000 to ₹5,00,000 (vs ₹30L–₹1Cr for home loans)</li>
        <li><strong>Higher interest rates:</strong> 10–18% p.a. (because two-wheelers are unsecured or weakly secured collateral)</li>
        <li><strong>Shorter tenure:</strong> 1–4 years maximum (bikes depreciate 30–40% in 3 years)</li>
        <li><strong>Faster processing:</strong> NBFCs approve loans in 15–30 minutes at the showroom</li>
        <li><strong>Lower down payment:</strong> 0–20% (some NBFCs offer 100% ex-showroom finance)</li>
    </ul>
    <p>Bike loans are offered by <strong>banks</strong> (SBI, HDFC Bank, ICICI Bank, Axis Bank), <strong>NBFCs</strong> (Bajaj Finance, TVS Credit, Hero FinCorp, Shriram Finance), and <strong>manufacturer captive finance</strong> companies (Honda Financial Services, Royal Enfield Financial Services).</p>

    <h2 id="emi-formula">Two-Wheeler Loan EMI Formula</h2>
    <div class="explanation__highlight">
        <strong>EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>P</strong> — Principal loan amount = On-Road Price − Down Payment (e.g., ₹90,000 − ₹9,000 = ₹81,000)</li>
        <li><strong>R</strong> — Monthly interest rate = Annual Rate ÷ 12 ÷ 100 (e.g., 12% ÷ 12 ÷ 100 = 0.01)</li>
        <li><strong>N</strong> — Total number of monthly instalments = Years × 12 (e.g., 3 × 12 = 36)</li>
    </ul>
    <p>The formula uses the <strong>reducing balance method</strong> — interest is calculated on the outstanding principal, which decreases with each EMI payment. This is the standard method mandated by the RBI for all retail loans.</p>

    <h2 id="step-by-step-example">Step-by-Step Worked Examples</h2>

    <h3>Example 1: Honda Activa 6G — Budget Scooter</h3>
    <ul>
        <li><strong>On-Road Price:</strong> ₹90,000 (including registration, insurance, accessories)</li>
        <li><strong>Down Payment (10%):</strong> ₹9,000</li>
        <li><strong>Loan Amount (P):</strong> ₹81,000</li>
        <li><strong>Interest Rate:</strong> 12% p.a. → Monthly Rate (R) = 0.01</li>
        <li><strong>Tenure:</strong> 2 years → N = 24 months</li>
    </ul>
    <ol>
        <li><strong>Calculate (1+R)<sup>N</sup>:</strong> (1.01)<sup>24</sup> = 1.2697</li>
        <li><strong>Numerator:</strong> 81,000 × 0.01 × 1.2697 = <strong>1,028</strong></li>
        <li><strong>Denominator:</strong> 1.2697 − 1 = <strong>0.2697</strong></li>
        <li><strong>EMI:</strong> 1,028 ÷ 0.2697 = <strong>₹3,813</strong></li>
    </ol>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>₹3,813</strong></td></tr>
            <tr><td>Down Payment</td><td>₹9,000</td></tr>
            <tr><td>Total Interest (24 months)</td><td>₹10,512</td></tr>
            <tr><td>Total Cost of Acquisition</td><td>₹1,00,512</td></tr>
        </tbody>
    </table>

    <h3>Example 2: Royal Enfield Classic 350 — Premium Cruiser</h3>
    <ul>
        <li><strong>On-Road Price:</strong> ₹2,30,000</li>
        <li><strong>Down Payment (15%):</strong> ₹34,500</li>
        <li><strong>Loan Amount (P):</strong> ₹1,95,500</li>
        <li><strong>Interest Rate:</strong> 10.5% p.a. → Monthly Rate (R) = 0.00875</li>
        <li><strong>Tenure:</strong> 3 years → N = 36 months</li>
    </ul>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>₹6,351</strong></td></tr>
            <tr><td>Down Payment</td><td>₹34,500</td></tr>
            <tr><td>Total Interest (36 months)</td><td>₹33,136</td></tr>
            <tr><td>Total Cost of Acquisition</td><td>₹2,63,136</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> The Royal Enfield Classic 350 costs ₹33,136 in interest over 3 years — that's 14.4% of the on-road price. By paying ₹34,500 more as down payment (20% instead of 15%), you'd reduce interest by ~₹5,000.
    </div>

    <h2 id="bank-interest-rates">Two-Wheeler Loan Interest Rates 2026 — Bank & NBFC Comparison</h2>
    <p>Interest rates for bike loans vary significantly between banks and NBFCs. Banks offer lower rates but need more paperwork; NBFCs approve faster at the showroom. Here are indicative rates as of March 2026:</p>
    <table>
        <thead><tr><th>Lender</th><th>Rate Range (p.a.)</th><th>Processing Fee</th><th>Max Tenure</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>ICICI Bank</strong></td><td>10.25% onwards</td><td>Up to 4%</td><td>3 years</td><td>Lowest bank rate</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>10.50% – 28.00%</td><td>From 0.5%</td><td>4 years (5 for superbikes)</td><td>Superbike financing</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>11.00% – 13.65%</td><td>2%</td><td>5 years</td><td>Long tenure</td></tr>
            <tr><td><strong>State Bank of India (SBI)</strong></td><td>11.70% – 15.70%</td><td>2% + taxes</td><td>5 years</td><td>Largest branch network</td></tr>
            <tr><td><strong>Hero FinCorp</strong></td><td>12.00% onwards</td><td>2–3%</td><td>4 years</td><td>Hero bikes/scooters</td></tr>
            <tr><td><strong>L&T Finance</strong></td><td>13.50% – 22.00%</td><td>Up to 2.5%</td><td>4 years</td><td>Used two-wheelers</td></tr>
            <tr><td><strong>SMFG India Credit</strong></td><td>14.00% – 22.00%</td><td>Up to 3%</td><td>4 years</td><td>Semi-urban areas</td></tr>
            <tr><td><strong>Bajaj Finance</strong></td><td>14.00% – 28.00%</td><td>Up to 3%</td><td>5 years</td><td>Instant approval</td></tr>
            <tr><td><strong>TVS Credit</strong></td><td>14.00% – 24.00%</td><td>2–3%</td><td>3 years</td><td>TVS bikes/scooters</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>14.50% onwards</td><td>Up to 2.5%</td><td>4 years</td><td>Existing HDFC customers</td></tr>
            <tr><td><strong>Shriram Finance</strong></td><td>15.00% – 26.00%</td><td>Up to 3%</td><td>5 years</td><td>Used bikes, lower CIBIL</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> Manufacturer-backed captive finance (TVS Credit for TVS bikes, Hero FinCorp for Hero bikes, Bajaj Finance for Bajaj/KTM) often offers <strong>0% or low-interest promotional EMIs during festive seasons</strong> (Navratri, Diwali, Onam, Pongal). These offers can save you ₹3,000–₹10,000 on total interest. Always check festival offers before financing.
    </div>

    <h2 id="popular-bike-emis">Popular Bike EMI Examples — Model-Wise Breakdown 2026</h2>
    <p>Pre-calculated EMIs for India's most popular two-wheelers with 10% down payment at typical interest rates:</p>
    <table>
        <thead><tr><th>Model</th><th>Category</th><th>On-Road Price (Approx)</th><th>Loan (90%)</th><th>EMI @12%/2yr</th><th>EMI @12%/3yr</th></tr></thead>
        <tbody>
            <tr><td><strong>Honda Activa 6G</strong></td><td>Scooter</td><td>₹90,000</td><td>₹81,000</td><td>₹3,813</td><td>₹2,690</td></tr>
            <tr><td><strong>Hero Splendor Plus</strong></td><td>Commuter</td><td>₹88,000</td><td>₹79,200</td><td>₹3,728</td><td>₹2,630</td></tr>
            <tr><td><strong>TVS Jupiter 125</strong></td><td>Scooter</td><td>₹95,000</td><td>₹85,500</td><td>₹4,025</td><td>₹2,839</td></tr>
            <tr><td><strong>Bajaj Pulsar 150</strong></td><td>Sports</td><td>₹1,15,000</td><td>₹1,03,500</td><td>₹4,872</td><td>₹3,437</td></tr>
            <tr><td><strong>TVS Apache RTR 160 4V</strong></td><td>Sports</td><td>₹1,40,000</td><td>₹1,26,000</td><td>₹5,930</td><td>₹4,184</td></tr>
            <tr><td><strong>Royal Enfield Hunter 350</strong></td><td>Retro/Cruiser</td><td>₹1,75,000</td><td>₹1,57,500</td><td>₹7,413</td><td>₹5,230</td></tr>
            <tr><td><strong>Yamaha MT-15 V2</strong></td><td>Naked</td><td>₹1,85,000</td><td>₹1,66,500</td><td>₹7,837</td><td>₹5,529</td></tr>
            <tr><td><strong>KTM Duke 200</strong></td><td>Sports</td><td>₹2,10,000</td><td>₹1,89,000</td><td>₹8,896</td><td>₹6,276</td></tr>
            <tr><td><strong>Royal Enfield Classic 350</strong></td><td>Cruiser</td><td>₹2,30,000</td><td>₹2,07,000</td><td>₹9,742</td><td>₹6,874</td></tr>
            <tr><td><strong>Honda CB350</strong></td><td>Retro</td><td>₹2,30,000</td><td>₹2,07,000</td><td>₹9,742</td><td>₹6,874</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Budget bikes (&lt;₹1L):</strong> On a Honda Activa, you're paying ₹10,512 in total interest over 2 years — that's 11.7% of the on-road price. For budget bikes, paying cash or choosing the shortest tenure is strongly recommended.
    </div>

    <h2 id="eligibility-criteria">Bike Loan Eligibility Criteria in India</h2>
    <p>Banks and NBFCs assess your loan eligibility based on several factors. Meeting these criteria improves your approval chances and gets you better interest rates:</p>
    <table>
        <thead><tr><th>Factor</th><th>Typical Requirement</th><th>Impact on Approval</th></tr></thead>
        <tbody>
            <tr><td><strong>Age</strong></td><td>21–65 years (at loan maturity)</td><td>Younger borrowers get longer tenure options</td></tr>
            <tr><td><strong>CIBIL Score</strong></td><td>700+ (750+ for best rates)</td><td>Below 650 = most applications rejected</td></tr>
            <tr><td><strong>Income (Salaried)</strong></td><td>₹10,000–₹15,000/month minimum</td><td>Higher income = higher eligible loan amount</td></tr>
            <tr><td><strong>Income (Self-Employed)</strong></td><td>₹1.5–2 lakh annual income (via ITR)</td><td>Min 2 years of ITR required</td></tr>
            <tr><td><strong>Employment Stability</strong></td><td>Min 6 months in current job</td><td>Frequent job changes reduce eligibility</td></tr>
            <tr><td><strong>Residency</strong></td><td>Indian resident, 1+ year at current address</td><td>Proof of stable residence required</td></tr>
            <tr><td><strong>Existing Obligations</strong></td><td>FOIR below 50–60%</td><td>Existing EMIs reduce eligible amount</td></tr>
        </tbody>
    </table>

    <h3>CIBIL Score & Two-Wheeler Loan Rates — Impact Guide</h3>
    <table>
        <thead><tr><th>CIBIL Score</th><th>Rating</th><th>Typical Rate Range</th><th>Approval Likelihood</th></tr></thead>
        <tbody>
            <tr><td><strong>800–900</strong></td><td>Excellent</td><td>10% – 12%</td><td>Instant approval, best terms</td></tr>
            <tr><td><strong>750–799</strong></td><td>Good</td><td>11% – 14%</td><td>High, competitive rates</td></tr>
            <tr><td><strong>700–749</strong></td><td>Fair</td><td>13% – 17%</td><td>Moderate, standard terms</td></tr>
            <tr><td><strong>650–699</strong></td><td>Below Average</td><td>16% – 22%</td><td>Possible with higher down payment</td></tr>
            <tr><td><strong>Below 650</strong></td><td>Poor</td><td>20%+ or rejected</td><td>Most banks reject; few NBFCs may approve</td></tr>
        </tbody>
    </table>

    <h2 id="documents-checklist">Documents Required for Two-Wheeler Loan</h2>
    <h3>For Salaried Employees</h3>
    <ul>
        <li><strong>Identity Proof:</strong> PAN Card (mandatory for loans above ₹50,000), Aadhaar Card</li>
        <li><strong>Address Proof:</strong> Aadhaar, Voter ID, Passport, or utility bill (electricity/water, &lt;3 months old)</li>
        <li><strong>Income Proof:</strong> Last 3 months salary slips or 3–6 months bank statements showing salary credits</li>
        <li><strong>Vehicle Documents:</strong> Proforma invoice/quotation from the authorised dealer</li>
        <li><strong>Photographs:</strong> 2 passport-size photos</li>
    </ul>
    <h3>For Self-Employed</h3>
    <ul>
        <li>All identity and address documents (same as above)</li>
        <li><strong>Income Proof:</strong> ITR for last 2 years, 6–12 months bank statements</li>
        <li><strong>Business Proof:</strong> GST registration, Shop Act licence, or any business registration</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Instant Loans:</strong> Many NBFCs (Bajaj Finance, TVS Credit) offer instant approval at the showroom with just <strong>Aadhaar + PAN</strong> for loans under ₹1 lakh. They verify income digitally via CIBIL and bank account analysis. Processing time: 15–30 minutes.
    </div>

    <h2 id="ev-two-wheeler">Electric Two-Wheeler Loans — PM E-DRIVE Subsidy Guide 2026</h2>
    <p>India's electric two-wheeler market is growing rapidly, with brands like <strong>Ather Energy, Ola Electric, TVS iQube, and Bajaj Chetak</strong> leading the charge. Here's what you need to know about financing an EV two-wheeler:</p>

    <h3>PM E-DRIVE Subsidy (Active Until July 2026)</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Scheme Name</strong></td><td>PM E-DRIVE (Electric Drive Revolution in Innovative Vehicle Enhancement)</td></tr>
            <tr><td><strong>Subsidy Amount</strong></td><td>₹2,500 per kWh of battery capacity</td></tr>
            <tr><td><strong>Maximum Cap</strong></td><td>₹5,000 per vehicle</td></tr>
            <tr><td><strong>Eligible Vehicles</strong></td><td>Electric two-wheelers with ex-showroom price under ₹1.5 lakh</td></tr>
            <tr><td><strong>Battery Requirement</strong></td><td>Lithium-ion battery</td></tr>
            <tr><td><strong>Identification</strong></td><td>Linked to Aadhaar (one vehicle per individual)</td></tr>
            <tr><td><strong>Validity</strong></td><td>Until July 31, 2026</td></tr>
        </tbody>
    </table>

    <h3>EV Two-Wheeler Loan Rates</h3>
    <p>Many banks offer <strong>0.25–0.50% interest rate concession</strong> for electric two-wheelers compared to petrol bikes. SBI, Axis Bank, and Bank of Baroda have specific green vehicle loan schemes. Some manufacturers like Ather Energy offer "Flexipay" plans with zero down payment options.</p>

    <h3>EV vs Petrol — 5-Year Total Cost Comparison</h3>
    <table>
        <thead><tr><th>Cost Component</th><th>Petrol Scooter (Activa 6G)</th><th>Electric Scooter (TVS iQube)</th></tr></thead>
        <tbody>
            <tr><td><strong>On-Road Price (after subsidy)</strong></td><td>₹90,000</td><td>₹1,10,000 (after ₹5,000 PM E-DRIVE)</td></tr>
            <tr><td><strong>Annual Fuel/Charging Cost</strong></td><td>₹15,000 (50km/day, 50 kmpl, ₹107/L petrol)</td><td>₹3,600 (50km/day, ₹6/kWh, 65 km/charge)</td></tr>
            <tr><td><strong>5-Year Running Cost</strong></td><td>₹75,000</td><td>₹18,000</td></tr>
            <tr><td><strong>Annual Maintenance</strong></td><td>₹3,000–₹5,000</td><td>₹1,000–₹2,000</td></tr>
            <tr><td><strong>5-Year Total Cost</strong></td><td>~₹1,85,000</td><td>~₹1,43,000</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Bottom Line:</strong> Despite the higher upfront cost, an electric scooter saves approximately <strong>₹42,000 over 5 years</strong> compared to a petrol scooter — primarily through fuel savings. Use our <a href="/in/fuel-cost-calculator">Fuel Cost Calculator</a> to estimate your exact petrol running cost.
    </div>

    <h2 id="insurance-guide">Two-Wheeler Insurance — What's Required with a Bike Loan?</h2>
    <p>Insurance is a significant additional cost when buying a two-wheeler on loan. Here's what you need to know:</p>
    <table>
        <thead><tr><th>Insurance Type</th><th>Coverage</th><th>Mandatory?</th><th>Approx. Annual Cost</th></tr></thead>
        <tbody>
            <tr><td><strong>Third-Party (TP)</strong></td><td>Damages to others caused by your vehicle</td><td>✅ Legally mandatory (Motor Vehicles Act 1988)</td><td>₹538–₹1,176 (based on CC)</td></tr>
            <tr><td><strong>Own Damage (OD)</strong></td><td>Damage to your own bike (accident, theft, fire)</td><td>Optional but recommended</td><td>₹1,500–₹5,000</td></tr>
            <tr><td><strong>Comprehensive</strong></td><td>TP + OD combined</td><td>✅ Required by lender for loan tenure</td><td>₹2,000–₹6,500</td></tr>
        </tbody>
    </table>
    <h3>Key Insurance Rules for Financed Two-Wheelers</h3>
    <ul>
        <li><strong>IRDAI 5-Year TP Rule:</strong> New two-wheelers must have a 5-year third-party insurance policy upfront (paid at the time of purchase)</li>
        <li><strong>Lender Endorsement:</strong> The financier's name must appear on the insurance policy as the hypothecation holder</li>
        <li><strong>Choice of Insurer:</strong> RBI prohibits lenders from forcing you to buy insurance from their partner — you are free to choose any IRDAI-registered insurer</li>
        <li><strong>No Claim Bonus (NCB):</strong> For every year without a claim, you earn 20–50% discount on the OD premium at renewal</li>
    </ul>

    <h2 id="prepayment-rules">Prepayment & Foreclosure Rules — RBI 2025 Directions</h2>
    <p>The Reserve Bank of India issued the <strong>"Pre-Payment Charges on Loans Directions, 2025"</strong> effective <strong>January 1, 2026</strong>. Here's how it impacts your bike loan:</p>
    <table>
        <thead><tr><th>Loan Type</th><th>Prepayment Penalty</th><th>Applicability</th></tr></thead>
        <tbody>
            <tr><td><strong>Floating-Rate Bike Loan</strong></td><td>✅ Zero penalty — prohibited by RBI</td><td>All loans sanctioned/renewed after Jan 1, 2026</td></tr>
            <tr><td><strong>Fixed-Rate Bike Loan</strong></td><td>As per lender policy (typically 2–5%)</td><td>Must be disclosed in KFS and agreement</td></tr>
        </tbody>
    </table>
    <p><strong>Important:</strong> Most two-wheeler loans from NBFCs (Bajaj Finance, TVS Credit, Shriram Finance) are <strong>fixed-rate loans</strong>. Check your loan agreement carefully. If the lender is charging you a penalty not disclosed in the agreement, you can file a complaint with the RBI Ombudsman.</p>
    <div class="explanation__highlight">
        <strong>Transparency Rule:</strong> Under the new RBI directions, all lenders must disclose prepayment/foreclosure charges in the <strong>Key Fact Statement (KFS)</strong> before loan sanction. If a charge is not in the KFS, the lender cannot levy it. Ask for the KFS before signing any loan agreement.
    </div>

    <h2 id="bank-vs-nbfc">Bank vs NBFC vs Manufacturer Finance — Which to Choose?</h2>
    <table>
        <thead><tr><th>Parameter</th><th>🏦 Bank (SBI, HDFC)</th><th>⚡ NBFC (Bajaj, TVS Credit)</th><th>🏭 Manufacturer (Honda, RE)</th></tr></thead>
        <tbody>
            <tr><td><strong>Interest Rate</strong></td><td>10% – 15%</td><td>12% – 24%</td><td>0% – 15% (promotional)</td></tr>
            <tr><td><strong>Processing Time</strong></td><td>2–5 days</td><td>15–30 minutes</td><td>30 minutes – 1 day</td></tr>
            <tr><td><strong>Documentation</strong></td><td>Extensive (salary slips, ITR)</td><td>Minimal (Aadhaar + PAN)</td><td>Moderate</td></tr>
            <tr><td><strong>Approval Rate</strong></td><td>Stricter (CIBIL 700+)</td><td>More flexible (CIBIL 650+)</td><td>Varies by scheme</td></tr>
            <tr><td><strong>Max Tenure</strong></td><td>3–5 years</td><td>3–5 years</td><td>2–4 years</td></tr>
            <tr><td><strong>Prepayment Terms</strong></td><td>Zero for floating rate</td><td>2–5% for fixed rate</td><td>Varies</td></tr>
            <tr><td><strong>Best For</strong></td><td>Planned purchases, best rates</td><td>Instant buying, thin credit</td><td>Festive offers, 0% EMI</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Strategy:</strong> Check manufacturer/dealer offers first (especially during festivals). If they don't have a competitive deal, compare your primary bank's rate vs the NBFC at the showroom. For savings above ₹3,000 on total interest, the bank route is worth the extra 2–3 days of paperwork.
    </div>

    <h2 id="tenure-guide">Two-Wheeler Loan Tenure Guide — Why 2–3 Years Is Optimal</h2>
    <p>Unlike <a href="/in/home-loan-calculator">home loans</a> where 20–30 year tenures are common, two-wheelers depreciate rapidly. Here's the impact of different tenures on a ₹1 lakh loan at 12%:</p>
    <table>
        <thead><tr><th>Tenure</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Amount</th><th>Bike's Resale Value (%)</th></tr></thead>
        <tbody>
            <tr><td><strong>1 year</strong></td><td>₹8,885</td><td>₹6,617</td><td>₹1,06,617</td><td>~80% (₹80,000)</td></tr>
            <tr><td><strong>2 years</strong></td><td>₹4,707</td><td>₹12,968</td><td>₹1,12,968</td><td>~65% (₹65,000)</td></tr>
            <tr><td><strong>3 years</strong></td><td>₹3,321</td><td>₹19,570</td><td>₹1,19,570</td><td>~50% (₹50,000)</td></tr>
            <tr><td><strong>4 years</strong></td><td>₹2,633</td><td>₹26,417</td><td>₹1,26,417</td><td>~40% (₹40,000)</td></tr>
            <tr><td><strong>5 years</strong></td><td>₹2,224</td><td>₹33,473</td><td>₹1,33,473</td><td>~30% (₹30,000)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Golden Rule for Bike Loans:</strong> Keep tenure under 3 years. At Year 3, your ₹1 lakh bike is worth ~₹50,000 but you've paid ₹1,19,570 — the <strong>outstanding loan should never exceed the bike's resale value</strong>. With a 4–5 year tenure, you'll be "underwater" (owing more than the bike is worth) for most of the loan period. Use our <a href="/in/sip-calculator">SIP Calculator</a> to see if investing the EMI difference yields better returns.
    </div>

    <h2 id="new-vs-used">New vs Used Two-Wheeler Loan Comparison</h2>
    <table>
        <thead><tr><th>Parameter</th><th>New Bike Loan</th><th>Used Bike Loan</th></tr></thead>
        <tbody>
            <tr><td><strong>Interest Rate</strong></td><td>10% – 18%</td><td>14% – 24% (+2–5% premium)</td></tr>
            <tr><td><strong>Max LTV</strong></td><td>Up to 100% ex-showroom</td><td>Up to 70–80% of valuation</td></tr>
            <tr><td><strong>Max Tenure</strong></td><td>3–5 years</td><td>1–3 years</td></tr>
            <tr><td><strong>Vehicle Age Limit</strong></td><td>Brand new</td><td>Must be under 5–7 years old</td></tr>
            <tr><td><strong>Processing</strong></td><td>Standard</td><td>+ Vehicle inspection required</td></tr>
            <tr><td><strong>Insurance</strong></td><td>Fresh comprehensive + 5yr TP</td><td>Transfer + renewal</td></tr>
            <tr><td><strong>Availability</strong></td><td>All lenders</td><td>Select NBFCs (Shriram, L&T Finance)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Advice:</strong> Used bike loans are generally <strong>not recommended</strong> for bikes priced below ₹50,000. The processing fee (₹500–₹1,500), higher interest rate, and documentation effort make the total saving negligible compared to saving up and buying cash. Used bike loans make sense only for premium pre-owned motorcycles (Royal Enfield, KTM, etc.) priced above ₹1 lakh.
    </div>

    <h2 id="total-cost-ownership">Total Cost of Ownership — Beyond the EMI</h2>
    <p>The EMI is just one component of owning a two-wheeler. Budget for these annual costs:</p>
    <table>
        <thead><tr><th>Cost Component</th><th>Scooter (Activa)</th><th>Commuter (Splendor)</th><th>Sports (Apache 200)</th><th>Premium (RE 350)</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual Insurance</strong></td><td>₹2,000–₹3,000</td><td>₹2,000–₹3,000</td><td>₹3,500–₹5,000</td><td>₹4,000–₹7,000</td></tr>
            <tr><td><strong>Annual Fuel</strong></td><td>₹12,000–₹18,000</td><td>₹8,000–₹12,000</td><td>₹18,000–₹25,000</td><td>₹20,000–₹30,000</td></tr>
            <tr><td><strong>Annual Maintenance</strong></td><td>₹2,000–₹3,000</td><td>₹1,500–₹2,500</td><td>₹4,000–₹6,000</td><td>₹5,000–₹8,000</td></tr>
            <tr><td><strong>Tyres (every 2 yrs)</strong></td><td>₹1,500–₹2,500</td><td>₹1,500–₹2,000</td><td>₹3,000–₹5,000</td><td>₹4,000–₹7,000</td></tr>
            <tr><td><strong>Total Annual Cost</strong></td><td><strong>₹16,000–₹24,000</strong></td><td><strong>₹12,000–₹18,000</strong></td><td><strong>₹26,000–₹36,000</strong></td><td><strong>₹30,000–₹45,000</strong></td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/fuel-cost-calculator">Fuel Cost Calculator</a> to get a precise estimate of your daily commute running cost based on your specific bike's mileage and city fuel prices.</p>

    <h2 id="common-mistakes">7 Common Mistakes to Avoid When Taking a Bike Loan</h2>
    <ol>
        <li><strong>Not checking CIBIL before applying:</strong> Each rejected application reduces your score by 5–10 points. Check your CIBIL score first (free at cibil.com) and apply only where you meet the minimum threshold.</li>
        <li><strong>Choosing the longest tenure by default:</strong> A 5-year tenure on a ₹1 lakh loan costs ₹33,473 in interest — nearly 33% of the bike's price. Choose 2–3 years maximum.</li>
        <li><strong>Ignoring total cost of ownership:</strong> A ₹90,000 scooter with ₹12,000 in interest actually costs ₹1,02,000 to borrow + ₹15,000 insurance + ₹5,000 registration = <strong>₹1,22,000 total</strong>.</li>
        <li><strong>Not comparing bank vs dealer financing:</strong> The dealer's NBFC partner is fastest but often 2–5% more expensive. Always get a quote from your bank first.</li>
        <li><strong>Skipping insurance in your budget:</strong> Comprehensive insurance (₹2,000–₹7,000) plus the mandatory 5-year TP cover adds significant cost. Include it in your total budget before deciding.</li>
        <li><strong>Forgetting about festive season discounts:</strong> Navratri, Dussehra, and Diwali bring manufacturer-backed 0% EMI offers, cashbacks, and exchange bonuses. Timing your purchase can save ₹5,000–₹15,000.</li>
        <li><strong>Not reading the loan agreement KFS:</strong> The Key Fact Statement shows your APR (effective rate including processing fee), all charges, and foreclosure terms. Read it before signing — it's your legal right under RBI guidelines.</li>
    </ol>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — Upgrading to four wheels? Compare car loan EMI, down payment, and eligibility across 10 banks.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Need unsecured funds? Compare personal loan rates and CIBIL requirements.</li>
        <li><strong><a href="/in/fuel-cost-calculator">Fuel Cost Calculator India</a></strong> — Calculate your daily commute running cost with city-wise petrol/diesel prices.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Planning a home purchase? Calculate housing loan EMI with tax benefit guide.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Should you invest the EMI difference? See how SIP returns compare to bike loan interest.</li>
        <li><strong><a href="/in/loan-eligibility-calculator">Loan Eligibility Calculator</a></strong> — Check your eligibility across home, car, personal, and two-wheeler loans.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Note: Bike loan interest is NOT tax deductible — but check your other deductions here.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Save for your down payment with a fixed deposit — compare bank FD rates.</li>
    </ul>
`;

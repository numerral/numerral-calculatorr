import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import CarLoanCalculatorCore from "@/components/calculator/CarLoanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Car Loan EMI Calculator India 2026 — Monthly EMI, Eligibility & Interest Rates",
    description: "Free car loan EMI calculator for India. Calculate monthly EMI, down payment, eligibility, and prepayment savings. Compare new vs used car loan rates from SBI, HDFC, ICICI, Axis Bank with CIBIL score guide, RBI rules, and documents checklist.",
    keywords: ["car loan EMI calculator India", "car loan calculator", "car loan interest rate 2026", "car loan eligibility calculator", "new car loan vs used car loan", "SBI car loan rate", "HDFC car loan EMI", "car loan CIBIL score", "car loan down payment"],
    alternates: buildCountryAlternates("IN", "/in/car-loan-calculator", "car-loan-calculator"),
};

const FAQ_ITEMS = [
    { question: "How is car loan EMI calculated in India?", answer: "Car loan EMI is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P is the loan amount (car price minus down payment), R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the tenure in months. For example, an ₹8 lakh car with 10% down payment at 8.5% for 5 years gives a loan of ₹7.2 lakh and EMI of ₹14,765." },
    { question: "What is the current car loan interest rate in India 2026?", answer: "As of March 2026, new car loan rates range from ~7.25% (SBI/BoB) to ~12.50% (NBFCs). Used car loan rates are higher: ~10% to ~16%. SBI offers 8.40–9.80%, HDFC 8.50–9.50%, ICICI 8.70–9.70%. The rate depends on your CIBIL score, car model, and loan tenure." },
    { question: "How much down payment is required for a car loan?", answer: "Most banks require 10–20% of the car's on-road price as down payment. This means for an ₹8 lakh car, you need ₹80,000–₹1.6 lakh upfront. Some banks offer zero down payment for premium customers with excellent CIBIL (800+), but a 20% down payment is recommended as it reduces EMI, total interest, and loan risk." },
    { question: "What CIBIL score is needed for a car loan in India?", answer: "A CIBIL score of 750+ gets you the best car loan rates (7.5–8.5%). Scores of 700–749 still get approved with competitive rates. Between 650–700, approval is possible but at higher rates (+1–3%). Below 650, most banks reject car loan applications. Unlike personal loans, car loans are secured (car as collateral), so some NBFCs may approve at lower scores with higher down payment." },
    { question: "What is the difference between new and used car loan rates?", answer: "New car loans typically have rates of 7.5–10% with tenure up to 7–8 years, LTV up to 90–100%. Used car loans have higher rates of 10–16%, shorter tenure (3–5 years max), and lower LTV (70–85%). The car's age also matters — most banks won't finance a used car older than 8–10 years, and the combined age of car + tenure shouldn't exceed 10–12 years." },
    { question: "Is there a prepayment penalty on car loans in India?", answer: "Per RBI guidelines effective January 2026, banks cannot charge prepayment or foreclosure penalty on floating-rate car loans for individual borrowers. For fixed-rate car loans, banks can charge 2–5% penalty. Most car loans in India are fixed rate, so check your sanction letter carefully before prepaying." },
    { question: "What documents are needed for a car loan?", answer: "For salaried: PAN card, Aadhaar, 3–6 months salary slips, Form 16, 6 months bank statements, employer ID. For self-employed: PAN, Aadhaar, ITR for 3 years, business proof, 12 months bank statements. Additionally, car dealers provide: proforma invoice, insurance quote, and vehicle registration form." },
    { question: "Can I get a car loan without income proof?", answer: "Generally no — banks require income proof for car loans. However, some options exist: (1) Pre-approved loans from your existing bank based on account history, (2) Loan against FD or securities to buy a car, (3) Digital lenders who use alternative data. These typically come with higher interest rates or require substantial down payment." },
    { question: "Is car loan interest tax deductible in India?", answer: "Car loan interest is NOT tax deductible for personal-use vehicles in India. However, if the car is purchased for business purposes under a proprietorship, partnership, or company, the interest can be claimed as a business expense under Section 37 of the Income Tax Act, and depreciation on the vehicle can be claimed under Section 32." },
    { question: "How much car loan can I get on ₹50,000 salary?", answer: "On ₹50,000 net monthly salary with no existing EMIs, banks allow up to 50% FOIR (₹25,000 as EMI capacity). At 8.5% for 5 years, this supports a maximum loan of ₹12.1 lakh. With 10% down payment, you can afford a car up to ₹13.4 lakh on-road. Actual eligibility depends on your CIBIL score and the bank's assessment." },
    { question: "Is comprehensive car insurance mandatory for car loans?", answer: "Yes, comprehensive car insurance is mandatory for the entire loan tenure. This protects the bank's collateral (your car). However, per RBI guidelines, the bank cannot force you to buy insurance from their partner — you are free to choose any IRDAI-registered insurer. The insurance must cover the full loan amount." },
    { question: "What is LTV ratio in car loans?", answer: "LTV (Loan-to-Value) ratio is the percentage of the car's value that the bank finances. For new cars, LTV can be 80–100% (meaning 0–20% down payment). For used cars, LTV is typically 70–85%. A lower LTV (higher down payment) means lower risk for the bank, resulting in better interest rates." },
    { question: "Is it better to take a 5-year or 7-year car loan?", answer: "A 5-year loan has higher EMI but much less total interest. For ₹7.2 lakh at 8.5%: 5 years = ₹14,765 EMI, ₹1,65,900 interest. 7 years = ₹11,377 EMI, ₹2,35,660 interest. The 7-year option costs ₹69,760 MORE in interest. Also, a longer tenure means you'll be paying EMIs for a depreciating asset longer — consider resale value." },
    { question: "Should I buy a new or used car with a loan?", answer: "Financially, a 2–3 year old certified pre-owned car offers the best value — someone else absorbs the first-year depreciation (15–20%). However, the total borrowing cost can be similar due to higher used car rates. For reliability and warranty, new cars are better. Key rule: if the used car rate exceeds 13% and the car is 5+ years old, a new car loan is often cheaper overall." },
    { question: "Can I transfer my car loan to another bank?", answer: "Yes, car loan balance transfer is possible if another bank offers a lower rate. Requirements: (1) At least 6–12 months of regular EMI payments, (2) Good repayment track record, (3) The new bank's rate should be at least 1–1.5% lower to justify processing fees. Some banks offer BT + top-up if you need additional funds." },
];

export default function CarLoanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Car Loan EMI Calculator" },
        ]),
        webAppSchema("Car Loan EMI Calculator India 2026", canonicalUrl("/in/car-loan-calculator")),
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
            <Script id="schema-carloan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Car Loan EMI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Car Loan EMI Calculator India 2026</h1>
            <PageDesc>
                Calculate your car loan EMI with down payment, compare new vs used car rates, check eligibility, and see how prepayment saves you money. Based on 2026 Indian bank rates — SBI, HDFC, ICICI, Axis, and more.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <CarLoanCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Car Loan EMI Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/home-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏠</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Home Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Housing loan EMI & eligibility</div>
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
                            <div className="in-related-link__desc">Running cost after buying your car</div>
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
    <h2 id="what-is-car-loan">What Is a Car Loan?</h2>
    <p>A <strong>car loan</strong> (also called an <strong>automobile loan</strong> or <strong>vehicle loan</strong>) is a <strong>secured loan</strong> offered by banks, NBFCs, and car finance companies to help you purchase a new or used car. Unlike <a href="/in/personal-loan-calculator">personal loans</a> which are unsecured, a car loan uses the vehicle itself as <strong>collateral</strong> — if you default, the bank can repossess the car.</p>
    <p>This secured nature is why car loan interest rates (7.5–12%) are significantly lower than personal loan rates (10–24%). The bank's risk is reduced because they hold the RC (Registration Certificate) of the car until the loan is fully repaid.</p>
    <p>Key characteristics of car loans in India:</p>
    <ul>
        <li><strong>Loan Amount:</strong> 80–100% of the on-road price (new cars) or 70–85% (used cars)</li>
        <li><strong>Tenure:</strong> 1–8 years (new cars), 1–5 years (used cars)</li>
        <li><strong>Down Payment:</strong> 10–20% of on-road price typically required</li>
        <li><strong>Security:</strong> Car's RC hypothecated to the bank until loan closure</li>
        <li><strong>Insurance:</strong> Comprehensive insurance mandatory for full tenure</li>
    </ul>

    <h2 id="emi-formula">Car Loan EMI Formula</h2>
    <div class="explanation__highlight">
        <strong>EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>P</strong> — Loan Amount = Car On-Road Price − Down Payment (e.g., ₹8,00,000 − ₹80,000 = ₹7,20,000)</li>
        <li><strong>R</strong> — Monthly interest rate = Annual Rate ÷ 12 ÷ 100 (e.g., 8.5% ÷ 12 ÷ 100 = 0.007083)</li>
        <li><strong>N</strong> — Total months (e.g., 5 years = 60 months)</li>
    </ul>

    <h2 id="worked-example">Step-by-Step Worked Example</h2>
    <p>Let's calculate the EMI for a popular scenario — buying a <strong>Hyundai Creta</strong> (on-road ~₹14 lakh):</p>
    <ul>
        <li><strong>Car On-Road Price:</strong> ₹14,00,000</li>
        <li><strong>Down Payment (15%):</strong> ₹2,10,000</li>
        <li><strong>Loan Amount (P):</strong> ₹11,90,000</li>
        <li><strong>Interest Rate:</strong> 8.5% p.a. → Monthly Rate (R) = 0.007083</li>
        <li><strong>Tenure:</strong> 5 years → N = 60 months</li>
    </ul>
    <ol>
        <li><strong>Calculate (1+R)<sup>N</sup>:</strong> (1.007083)<sup>60</sup> = 1.5269</li>
        <li><strong>Numerator:</strong> 11,90,000 × 0.007083 × 1.5269 = <strong>12,870</strong></li>
        <li><strong>Denominator:</strong> 1.5269 − 1 = <strong>0.5269</strong></li>
        <li><strong>EMI:</strong> 12,870 ÷ 0.5269 = <strong>₹24,426</strong></li>
    </ol>
    <table>
        <thead><tr><th>Component</th><th>Amount</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>₹24,426</strong></td></tr>
            <tr><td>Down Payment</td><td>₹2,10,000</td></tr>
            <tr><td>Loan Amount</td><td>₹11,90,000</td></tr>
            <tr><td>Total Interest (5 years)</td><td>₹2,75,560</td></tr>
            <tr><td>Total Amount Payable</td><td>₹14,65,560 + ₹2,10,000 = ₹16,75,560</td></tr>
        </tbody>
    </table>

    <h2 id="bank-interest-rates">Car Loan Interest Rates 2026 — Major Indian Banks</h2>
    <p>Car loan rates vary significantly between new and used cars. Rates also depend on CIBIL score, loan amount, and whether you're a salaried or self-employed borrower.</p>
    <table>
        <thead><tr><th>Bank / Lender</th><th>New Car Rate (p.a.)</th><th>Used Car Rate (p.a.)</th><th>Processing Fee</th><th>Max Tenure</th></tr></thead>
        <tbody>
            <tr><td><strong>State Bank of India (SBI)</strong></td><td>8.40% – 9.80%</td><td>10.35% – 11.55%</td><td>₹1,000 – ₹10,000</td><td>7 years</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>8.50% – 9.50%</td><td>11.50% – 13.75%</td><td>Up to ₹7,500</td><td>7 years</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>8.70% – 9.70%</td><td>11.50% – 14.25%</td><td>Up to ₹6,500</td><td>7 years</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>8.50% – 10.00%</td><td>12.00% – 15.50%</td><td>Up to ₹5,000</td><td>5 years</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>7.25% – 9.85%</td><td>10.00% – 12.50%</td><td>₹1,500 – ₹10,000</td><td>7 years</td></tr>
            <tr><td><strong>Kotak Mahindra</strong></td><td>8.50% – 10.99%</td><td>12.00% – 16.00%</td><td>Up to ₹5,000</td><td>5 years</td></tr>
            <tr><td><strong>Punjab National Bank</strong></td><td>8.25% – 10.40%</td><td>10.50% – 13.00%</td><td>0.25% of loan</td><td>7 years</td></tr>
            <tr><td><strong>Bajaj Finserv</strong></td><td>9.00% – 12.50%</td><td>12.50% – 16.00%</td><td>Up to ₹10,000</td><td>5 years</td></tr>
            <tr><td><strong>Tata Capital</strong></td><td>8.75% – 12.00%</td><td>12.00% – 15.00%</td><td>Up to ₹7,500</td><td>6 years</td></tr>
            <tr><td><strong>Maruti Suzuki Finance</strong></td><td>7.50% – 9.50%</td><td>N/A</td><td>Included in rate</td><td>7 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> Manufacturer-backed financing (Maruti Finance, Hyundai Capital, Toyota Financial) often offers promotional rates 0.5–1% lower than bank rates, especially during festive seasons (Navratri, Diwali, Onam). Always compare 3+ offers.
    </div>

    <h2 id="new-vs-used">New Car vs Used Car Loan — Comprehensive Comparison</h2>
    <table>
        <thead><tr><th>Parameter</th><th>New Car Loan</th><th>Used Car Loan</th></tr></thead>
        <tbody>
            <tr><td><strong>Interest Rate</strong></td><td>7.5% – 10%</td><td>10% – 16%</td></tr>
            <tr><td><strong>LTV Ratio</strong></td><td>Up to 90–100%</td><td>Up to 70–85%</td></tr>
            <tr><td><strong>Max Tenure</strong></td><td>7–8 years</td><td>3–5 years</td></tr>
            <tr><td><strong>Down Payment</strong></td><td>0–20% (10% typical)</td><td>15–30%</td></tr>
            <tr><td><strong>Age Restriction</strong></td><td>None (brand new)</td><td>Car must be &lt;8–10 years old</td></tr>
            <tr><td><strong>Combined Limit</strong></td><td>N/A</td><td>Car age + tenure ≤ 10–12 years</td></tr>
            <tr><td><strong>Documentation</strong></td><td>Proforma invoice only</td><td>+ RTO transfer, inspection report</td></tr>
            <tr><td><strong>Insurance</strong></td><td>Fresh comprehensive</td><td>Transfer + comprehensive renewal</td></tr>
            <tr><td><strong>Processing Time</strong></td><td>1–3 days</td><td>3–7 days (includes inspection)</td></tr>
        </tbody>
    </table>

    <h2 id="down-payment-guide">Down Payment & LTV Guide</h2>
    <p>Your <strong>down payment</strong> directly impacts your EMI, interest cost, and loan approval chances:</p>
    <table>
        <thead><tr><th>Down Payment %</th><th>Loan on ₹10L Car</th><th>EMI @8.5%/5yr</th><th>Total Interest</th><th>Benefit</th></tr></thead>
        <tbody>
            <tr><td><strong>0% (100% LTV)</strong></td><td>₹10,00,000</td><td>₹20,517</td><td>₹2,31,020</td><td>No upfront cost (rare approval)</td></tr>
            <tr><td><strong>10%</strong></td><td>₹9,00,000</td><td>₹18,465</td><td>₹2,07,900</td><td>Standard minimum</td></tr>
            <tr><td><strong>15%</strong></td><td>₹8,50,000</td><td>₹17,440</td><td>₹1,96,400</td><td>Better rate negotiation</td></tr>
            <tr><td><strong>20%</strong></td><td>₹8,00,000</td><td>₹16,414</td><td>₹1,84,840</td><td>Best rates, recommended</td></tr>
            <tr><td><strong>25%</strong></td><td>₹7,50,000</td><td>₹15,388</td><td>₹1,73,280</td><td>Lowest risk, fastest approval</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>₹57,740 difference:</strong> Increasing your down payment from 0% to 25% on a ₹10L car saves <strong>₹57,740 in total interest</strong>. The sweet spot is <strong>20% down</strong> — it gets you the best rates and keeps sufficient cash in hand for insurance, accessories, and registration.
    </div>

    <h2 id="rbi-guidelines">RBI Guidelines for Car Loans 2026</h2>
    <table>
        <thead><tr><th>Rule</th><th>Details</th><th>Effective</th></tr></thead>
        <tbody>
            <tr><td><strong>Zero Prepayment Penalty (Floating)</strong></td><td>No foreclosure/prepayment fee on floating-rate car loans for individuals (non-business)</td><td>Jan 2026</td></tr>
            <tr><td><strong>Key Fact Statement (KFS)</strong></td><td>Lenders must disclose APR, all fees, and total cost upfront before sanctioning the car loan</td><td>Oct 2024</td></tr>
            <tr><td><strong>No Insurance Bundling</strong></td><td>Banks cannot force you to buy insurance from their partner as a loan condition</td><td>Ongoing</td></tr>
            <tr><td><strong>Fair Practices Code</strong></td><td>No coercive recovery, mandatory communication before repossession, 7-day notice</td><td>Ongoing</td></tr>
            <tr><td><strong>Digital Lending Rules</strong></td><td>All fintech car lenders must disclose the regulated entity behind the loan</td><td>Sep 2022</td></tr>
        </tbody>
    </table>

    <h2 id="eligibility-criteria">Car Loan Eligibility Criteria in India</h2>
    <table>
        <thead><tr><th>Factor</th><th>Salaried</th><th>Self-Employed</th></tr></thead>
        <tbody>
            <tr><td><strong>Age</strong></td><td>21–65 years (at loan maturity)</td><td>25–70 years</td></tr>
            <tr><td><strong>Minimum Income</strong></td><td>₹20,000 – ₹25,000/month (metro-dependent)</td><td>₹3 lakh+ annual income</td></tr>
            <tr><td><strong>CIBIL Score</strong></td><td>700+ (750+ for best rates)</td><td>700+ (750+ preferred)</td></tr>
            <tr><td><strong>Employment</strong></td><td>Min 1 year total, 6 months current</td><td>Min 3 years of business</td></tr>
            <tr><td><strong>FOIR</strong></td><td>Max 50–60% of net income</td><td>Max 50% of net income</td></tr>
            <tr><td><strong>Car Restriction</strong></td><td>Any new/used car (brand approved list)</td><td>Same</td></tr>
        </tbody>
    </table>

    <h3>Salary-Based Car Loan Eligibility Quick Reference</h3>
    <table>
        <thead><tr><th>Net Salary</th><th>Max EMI (50%)</th><th>Max Loan @8.5%/5yr</th><th>Max Car (10% down)</th></tr></thead>
        <tbody>
            <tr><td><strong>₹25,000</strong></td><td>₹12,500</td><td>₹6.09 lakh</td><td>₹6.77 lakh</td></tr>
            <tr><td><strong>₹40,000</strong></td><td>₹20,000</td><td>₹9.74 lakh</td><td>₹10.82 lakh</td></tr>
            <tr><td><strong>₹50,000</strong></td><td>₹25,000</td><td>₹12.18 lakh</td><td>₹13.53 lakh</td></tr>
            <tr><td><strong>₹75,000</strong></td><td>₹37,500</td><td>₹18.27 lakh</td><td>₹20.30 lakh</td></tr>
            <tr><td><strong>₹1,00,000</strong></td><td>₹50,000</td><td>₹24.36 lakh</td><td>₹27.07 lakh</td></tr>
        </tbody>
    </table>

    <h2 id="popular-car-examples">Popular Car Loan EMI Examples — India 2026</h2>
    <p>Here are pre-calculated EMIs for popular Indian cars at 15% down payment & 8.5% interest:</p>
    <table>
        <thead><tr><th>Car Model</th><th>On-Road Price (Approx)</th><th>Loan Amount (85%)</th><th>EMI (5yr)</th><th>EMI (7yr)</th></tr></thead>
        <tbody>
            <tr><td><strong>Maruti Swift</strong></td><td>₹7.50 lakh</td><td>₹6.38 lakh</td><td>₹13,088</td><td>₹10,076</td></tr>
            <tr><td><strong>Hyundai i20</strong></td><td>₹8.50 lakh</td><td>₹7.23 lakh</td><td>₹14,833</td><td>₹11,419</td></tr>
            <tr><td><strong>Tata Nexon</strong></td><td>₹10.00 lakh</td><td>₹8.50 lakh</td><td>₹17,440</td><td>₹13,428</td></tr>
            <tr><td><strong>Hyundai Creta</strong></td><td>₹14.00 lakh</td><td>₹11.90 lakh</td><td>₹24,416</td><td>₹18,800</td></tr>
            <tr><td><strong>Mahindra XUV700</strong></td><td>₹18.00 lakh</td><td>₹15.30 lakh</td><td>₹31,392</td><td>₹24,171</td></tr>
            <tr><td><strong>Toyota Fortuner</strong></td><td>₹38.00 lakh</td><td>₹32.30 lakh</td><td>₹66,278</td><td>₹51,027</td></tr>
        </tbody>
    </table>

    <h2 id="documents-checklist">Car Loan Documents Checklist</h2>
    <h3>For Salaried Employees</h3>
    <ul>
        <li><strong>Identity Proof:</strong> PAN Card (mandatory), Aadhaar, Voter ID, or Passport</li>
        <li><strong>Address Proof:</strong> Aadhaar, Utility bill (&lt;3 months), Passport, Rent agreement</li>
        <li><strong>Income Proof:</strong> Last 3–6 months salary slips, Form 16</li>
        <li><strong>Bank Statements:</strong> Last 6 months of salary account</li>
        <li><strong>Car Documents:</strong> Proforma invoice from dealer, insurance quote</li>
        <li><strong>Photographs:</strong> 2 passport-size photos</li>
    </ul>
    <h3>For Self-Employed / Professionals</h3>
    <ul>
        <li>All identity and address documents (same as above)</li>
        <li><strong>Business Proof:</strong> GST registration, CA certificate, Shop Act license</li>
        <li><strong>Income Proof:</strong> ITR for last 3 years</li>
        <li><strong>Financial Statements:</strong> CA-certified P&L + Balance Sheet (2 years)</li>
        <li><strong>Bank Statements:</strong> Last 12 months of current/business account</li>
    </ul>
    <h3>Additional for Used Car Loans</h3>
    <ul>
        <li><strong>Vehicle inspection report</strong> (by bank-approved evaluator)</li>
        <li><strong>RC book</strong> of the car (original)</li>
        <li><strong>Insurance transfer</strong> documents</li>
        <li><strong>NOC from previous financier</strong> (if any existing loan)</li>
        <li><strong>RTO transfer application</strong></li>
    </ul>

    <h2 id="insurance-requirements">Insurance Requirements for Car Loans</h2>
    <p><strong>Comprehensive car insurance</strong> is mandatory for the entire loan tenure. Here's what you need to know:</p>
    <table>
        <thead><tr><th>Aspect</th><th>Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Type Required</strong></td><td>Comprehensive (own damage + third-party)</td></tr>
            <tr><td><strong>Duration</strong></td><td>Full loan tenure (annual renewal)</td></tr>
            <tr><td><strong>IDV Coverage</strong></td><td>Must cover outstanding loan amount</td></tr>
            <tr><td><strong>Choice of Insurer</strong></td><td>You can choose any IRDAI-registered insurer</td></tr>
            <tr><td><strong>Bank Cannot Force</strong></td><td>RBI prohibits forcing insurance from partner</td></tr>
            <tr><td><strong>Typical Cost (Year 1)</strong></td><td>3–5% of car value (₹30,000–₹60,000 for ₹10L car)</td></tr>
        </tbody>
    </table>

    <h2 id="cibil-score-guide">CIBIL Score & Car Loan Rates — Impact Guide</h2>
    <table>
        <thead><tr><th>CIBIL Score</th><th>Rating</th><th>New Car Rate</th><th>Used Car Rate</th><th>Approval</th></tr></thead>
        <tbody>
            <tr><td><strong>800–900</strong></td><td>Excellent</td><td>7.5% – 8.5%</td><td>10% – 11%</td><td>Instant, best terms</td></tr>
            <tr><td><strong>750–799</strong></td><td>Good</td><td>8.5% – 9.5%</td><td>11% – 13%</td><td>High, competitive</td></tr>
            <tr><td><strong>700–749</strong></td><td>Fair</td><td>9.5% – 11%</td><td>13% – 15%</td><td>Moderate</td></tr>
            <tr><td><strong>650–699</strong></td><td>Below Avg</td><td>11% – 13%</td><td>15% – 17%</td><td>Possible with higher down</td></tr>
            <tr><td><strong>Below 650</strong></td><td>Poor</td><td>Unlikely</td><td>Unlikely</td><td>Most reject</td></tr>
        </tbody>
    </table>

    <h2 id="tenure-comparison">3 Years vs 5 Years vs 7 Years — Total Cost Comparison</h2>
    <p>For an ₹8 lakh car with 10% down (₹7.2 lakh loan) at 8.5%:</p>
    <table>
        <thead><tr><th>Tenure</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Amount</th></tr></thead>
        <tbody>
            <tr><td><strong>3 years</strong></td><td>₹22,700</td><td>₹97,200</td><td>₹8,17,200</td></tr>
            <tr><td><strong>5 years</strong></td><td>₹14,765</td><td>₹1,65,900</td><td>₹8,85,900</td></tr>
            <tr><td><strong>7 years</strong></td><td>₹11,377</td><td>₹2,35,660</td><td>₹9,55,660</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>₹1,38,460 difference:</strong> Stretching from 3 to 7 years saves ₹11,323/month on EMI but costs <strong>₹1,38,460 extra in interest</strong>. Also, at year 7, a car's resale value drops to 25–30% of original — you'll still be paying EMIs on a significantly depreciated asset. <strong>5 years is the sweet spot</strong> for most buyers.
    </div>

    <h2 id="prepayment-strategy">Prepayment Strategy — How to Save Money</h2>
    <table>
        <thead><tr><th>Strategy (₹7.2L, 8.5%, 5yr)</th><th>Interest Saved</th><th>Tenure Reduced</th></tr></thead>
        <tbody>
            <tr><td>₹1 lakh at month 12</td><td>~₹25,000–₹30,000</td><td>~6–8 months</td></tr>
            <tr><td>₹50,000 at month 18</td><td>~₹12,000–₹16,000</td><td>~3–4 months</td></tr>
            <tr><td>₹25,000 every 6 months</td><td>~₹30,000–₹35,000</td><td>~10–14 months</td></tr>
            <tr><td>Full foreclosure at month 24</td><td>~₹40,000+</td><td>Immediate closure</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">7 Common Mistakes When Taking a Car Loan</h2>
    <ol>
        <li><strong>Focusing on EMI, not total cost:</strong> A ₹7,000/month lower EMI over 7 years costs ₹1.38 lakh more. Always compare total cost.</li>
        <li><strong>Skipping the down payment:</strong> 0% down offers sound great but result in higher EMI, higher interest, and often lower approval chances.</li>
        <li><strong>Not checking CIBIL first:</strong> Each rejected application lowers your score. Check before applying to multiple banks.</li>
        <li><strong>Accepting dealer financing blindly:</strong> Dealers earn commission on financing. Their rate may be 1–2% higher than what your own bank offers.</li>
        <li><strong>Ignoring total ownership cost:</strong> EMI is just one cost. Factor in insurance (₹30K–₹60K/yr), fuel (use our <a href="/in/fuel-cost-calculator">Fuel Cost Calculator</a>), maintenance, and parking.</li>
        <li><strong>Buying more car than you need:</strong> Bank approves ₹15 lakh but you need ₹8 lakh? Don't over-borrow because of "pre-approved" offers.</li>
        <li><strong>Not reading the KFS:</strong> The Key Fact Statement shows your true APR including processing fee and insurance. Read it before signing.</li>
    </ol>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Planning to buy a house? Compare housing loan EMI and tax benefits.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Need unsecured funds? Compare personal loan rates and eligibility.</li>
        <li><strong><a href="/in/fuel-cost-calculator">Fuel Cost Calculator India</a></strong> — Calculate your monthly running cost based on the car you're buying.</li>
        <li><strong><a href="/utility-calculators/compound-interest-calculator">Compound Interest Calculator</a></strong> — See how investing your down payment savings can grow.</li>
    </ul>
`;

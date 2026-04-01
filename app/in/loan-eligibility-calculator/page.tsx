// Standalone page — /in/loan-eligibility-calculator
// India Home Loan Eligibility Calculator with 5,000+ word educational hub

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import HomeLoanEligibilityCore from "@/components/calculator/HomeLoanEligibilityCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Home Loan Eligibility Calculator India 2026 — Check Max Loan, FOIR & CIBIL Impact",
    description: "Free home loan eligibility calculator for India 2026. Check your maximum loan amount based on income, CIBIL score, and FOIR. Compare SBI, HDFC, ICICI eligibility criteria. Includes co-applicant boost, RBI LTV guidelines, PMAY subsidy guide, and document checklist.",
    keywords: ["home loan eligibility calculator", "home loan eligibility India", "how much home loan can I get", "home loan eligibility on salary", "FOIR calculator", "home loan CIBIL score", "home loan eligibility SBI HDFC ICICI", "home loan eligibility 2026", "loan eligibility calculator India", "home loan eligibility co-applicant", "home loan LTV ratio RBI", "PMAY home loan subsidy"],
    alternates: buildCountryAlternates("IN", "/in/loan-eligibility-calculator", "loan-eligibility-calculator"),
};

const FAQ_ITEMS = [
    { question: "How much home loan can I get on ₹50,000 salary?", answer: "On a ₹50,000 monthly salary with no existing EMIs, banks allow up to 50% FOIR — which means ₹25,000 EMI capacity. At 8.5% interest for 20 years, this supports a maximum home loan of approximately ₹28.8 lakh. With a 20% down payment (80% LTV), you can afford a property worth around ₹36 lakh. If you extend the tenure to 30 years, the eligible amount increases to approximately ₹32 lakh." },
    { question: "What is FOIR and how does it affect my home loan eligibility?", answer: "FOIR (Fixed Obligation to Income Ratio) is the percentage of your gross monthly income committed to all EMI payments — existing personal loans, car loans, credit card dues, plus the proposed home loan EMI. Banks typically cap FOIR at 40–50% for home loans. Formula: FOIR = (Total Monthly EMIs ÷ Gross Monthly Income) × 100. For example, if your income is ₹1 lakh and existing EMIs are ₹15,000, your FOIR is 15%. The bank will allow up to ₹35,000 as new home loan EMI (keeping total FOIR at 50%)." },
    { question: "What CIBIL score is needed for a home loan in India?", answer: "Most banks require a minimum CIBIL score of 650–700 for home loan approval. However, score bands significantly affect your interest rate: 800+ = lowest rate (base), 750–799 = base rate, 700–749 = base + 0.25–0.50%, 650–699 = base + 0.50–1.0%, below 650 = likely rejection. A score of 750+ is considered ideal. The difference between a 650 and 800 score can mean ₹5–8 lakh more in total interest paid on a ₹50 lakh loan." },
    { question: "Can I get a home loan with CIBIL score below 700?", answer: "Yes, but it's harder and more expensive. With a 650–700 score, you may get approval at 0.5–1% higher interest rates, primarily from public sector banks (SBI, PNB, Bank of Baroda) that have slightly more flexible criteria. Below 650, most banks will reject your application. To improve: (1) Pay all EMIs and credit card dues on time for 6 months, (2) Reduce credit utilization below 30%, (3) Don't apply for multiple loans simultaneously, (4) Check for errors in your CIBIL report and dispute them." },
    { question: "How does adding a co-applicant increase loan eligibility?", answer: "Adding a co-applicant (spouse, parent, sibling) allows banks to combine both incomes when calculating FOIR. For example: Your salary ₹80,000 → solo max EMI ₹40,000 → eligible for ~₹46 lakh. Adding spouse with ₹50,000 → combined max EMI ₹65,000 → eligible for ~₹75 lakh — a 63% boost. Additional benefits: (1) Female co-applicant may get 0.05% rate concession, (2) States like Delhi, Rajasthan, and UP offer 1–2% stamp duty concession for female property owners." },
    { question: "What is the maximum LTV ratio for home loans in India (RBI rules)?", answer: "RBI mandates maximum Loan-to-Value (LTV) ratios based on loan amount: Up to ₹30 lakh = 90% LTV (10% down payment), ₹30–75 lakh = 80% LTV (20% down payment), Above ₹75 lakh = 75% LTV (25% down payment). Stamp duty and registration charges are excluded from property value for LTV calculation. For a ₹1 crore property, you need a minimum down payment of ₹25 lakh (25%)." },
    { question: "How much home loan can I get on ₹1 lakh salary?", answer: "On ₹1,00,000 monthly salary with zero existing EMIs and 50% FOIR: Maximum EMI = ₹50,000. At 8.5% for 20 years = ₹57.6 lakh loan. At 8.5% for 25 years = ₹62.2 lakh loan. At 8.5% for 30 years = ₹65.0 lakh loan. With 80% LTV, you can target properties worth ₹72L, ₹78L, or ₹81L respectively. If you have existing EMIs of ₹15,000, the eligible amount drops to approximately ₹40 lakh." },
    { question: "What documents are required for home loan eligibility?", answer: "For salaried: PAN Card, Aadhaar Card, last 6 months salary slips, Form 16 (2 years), bank statements (6 months), property documents (sale agreement, title deed, approved plan). For self-employed: All KYC documents + 3 years ITR, CA-certified P&L and balance sheet, 12 months business bank statements, GST registration. For NRI: Valid passport with visa, overseas bank statements, employment contract, NRE/NRO account statements, Power of Attorney." },
    { question: "Can self-employed individuals get home loans?", answer: "Yes. Self-employed individuals can get home loans, but the process involves more documentation. Banks typically require: 3 years of Income Tax Returns (ITR), CA-certified Profit & Loss statements and Balance Sheets, 12 months of current account statements, Business proof (GST registration, trade license). Income is calculated differently — banks usually take the average of the last 3 years' net profit (after tax) as your monthly income. Self-employed applicants may receive slightly lower loan amounts compared to salaried individuals with similar income, as banks consider business income less stable." },
    { question: "Can NRIs buy property in India with a home loan?", answer: "Yes, NRIs can get home loans in India. Key requirements: Valid Indian passport, Employment contract and salary certificate from overseas employer, NRE/NRO bank account statements (6 months), Overseas bank statements, Power of Attorney (notarized) appointing a local representative. NRI home loans typically have interest rates 0.25–0.5% higher than resident loans. SBI, HDFC, ICICI, and Axis Bank all offer dedicated NRI home loan products. NRIs cannot purchase agricultural land, plantation property, or farmhouse land in India." },
    { question: "What is the PMAY subsidy for home loans in 2026?", answer: "Under PMAY Urban 2.0, eligible first-time homebuyers can avail: EWS (income up to ₹3L/year) — 4% interest subsidy on first ₹8 lakh of loan, max benefit ₹1.80 lakh. LIG (₹3–6L) — 4% subsidy on ₹8 lakh. MIG (₹6–9L) — 4% subsidy on ₹8 lakh. Max property value: ₹35 lakh. Max carpet area: 120 sq.m. Subsidy disbursed in 5 annual installments. Applicant must not own a pucca house anywhere in India. Apply through any Primary Lending Institution (bank or HFC)." },
    { question: "Which bank gives the highest home loan amount in India?", answer: "The bank offering the highest eligible amount depends on your profile. However, in general: Bank of Baroda often has the lowest interest rates (starting ~8.40%), leading to slightly higher eligibility. SBI is competitive at ~8.50% with the largest branch network and flexible criteria. For maximum loan amount, optimize: (1) Choose the bank with the lowest rate for your profile, (2) Opt for the longest tenure you qualify for, (3) Add a co-applicant to boost income, (4) Clear existing loans to improve FOIR. A 0.5% lower interest rate on ₹50 lakh over 20 years means approximately ₹3–4 lakh more in eligible amount." },
    { question: "How to improve home loan eligibility?", answer: "10 proven ways: (1) Improve CIBIL score above 750, (2) Clear existing personal/car loan EMIs, (3) Add a co-applicant (spouse/parent), (4) Choose a longer tenure (20→30 years), (5) Opt for a lower interest rate bank, (6) Show additional income sources (rental, freelance), (7) Reduce credit card utilization below 30%, (8) Maintain 6+ months of stable employment, (9) Build a larger down payment to negotiate better terms, (10) Avoid multiple loan inquiries in a short period." },
    { question: "What is the difference between home loan eligibility and pre-approval?", answer: "Eligibility is an estimate of how much loan you can get based on your income, credit score, and existing obligations — it's a calculation, not a commitment. Pre-approval is a conditional sanction letter from the bank stating they will lend you up to a specific amount, subject to property verification. Pre-approval is stronger when negotiating with sellers, typically valid for 3–6 months, and requires a formal application with document verification. Get pre-approval before house hunting to know your exact budget." },
    { question: "Can I get a home loan for an under-construction property?", answer: "Yes. Banks offer home loans for under-construction properties from RERA-registered builders. Key differences: (1) Loan is disbursed in stages aligned with construction progress (slab-wise), (2) You pay interest on the disbursed amount only (pre-EMI/tranche payment) until full disbursement, (3) Full EMI starts after final disbursement or completion, (4) GST of 5% applies on under-construction flats (1% for affordable housing), (5) Banks may offer 1–2% lower interest rate during the construction period. Ensure the project has RERA registration and all necessary approvals." },
];

export default function HomeLoanEligibilityPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Home Loan Eligibility Calculator" },
        ]),
        webAppSchema("Home Loan Eligibility Calculator India 2026", canonicalUrl("/in/loan-eligibility-calculator")),
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
            <Script id="schema-eligibility" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Home Loan Eligibility Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Home Loan Eligibility Calculator India 2026</h1>
            <PageDesc>
                Check your maximum home loan eligibility based on income, CIBIL score, and existing obligations. Compare bank-wise criteria, see how a co-applicant boosts your limit, and understand RBI LTV guidelines — all with 2026 Indian bank rates and FOIR calculations.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <HomeLoanEligibilityCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Home Loan Eligibility FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/home-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏠</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Home Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Calculate EMI & amortization</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">80C & 24b tax savings</div>
                        </div>
                    </Link>
                    <Link href="/in/personal-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Personal Loan Calculator</div>
                            <div className="in-related-link__desc">Clear loans to boost FOIR</div>
                        </div>
                    </Link>
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Build your down payment</div>
                        </div>
                    </Link>
                    <Link href="/in/ppf-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">PPF Calculator</div>
                            <div className="in-related-link__desc">Safe down payment savings</div>
                        </div>
                    </Link>
                    <Link href="/in" className="in-related-link">
                        <span className="in-related-link__icon">🇮🇳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">All India Calculators</div>
                            <div className="in-related-link__desc">Browse all 41+ India tools</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-eligibility">What Is Home Loan Eligibility?</h2>
    <p><strong>Home loan eligibility</strong> is the maximum loan amount a bank or housing finance company (HFC) is willing to lend you, based on your financial profile. It is determined before loan sanctioning and considers your income, existing debt obligations, credit history, age, employment stability, and the property's value.</p>
    <p>Unlike a simple <strong>EMI calculator</strong> (which tells you the monthly instalment for a given loan amount), an eligibility calculator works <em>in reverse</em> — it tells you <strong>how much you can borrow</strong> given your income and constraints. This is the starting point of every home buying journey.</p>
    <p>Understanding your eligibility helps you: (1) <strong>Set a realistic budget</strong> for your property search, (2) <strong>Negotiate better</strong> with builders and sellers when you know your exact limit, (3) <strong>Identify gaps</strong> — if your eligible amount falls short, you know exactly what to improve (CIBIL, tenure, co-applicant), (4) <strong>Compare banks</strong> to find which lender offers the highest eligible amount for your profile.</p>
    <div class="explanation__highlight">
        <strong>Eligibility ≠ Pre-Approval:</strong> Eligibility is a mathematical estimate. Pre-approval is a conditional sanction letter from the bank. Always get pre-approval before house hunting — it strengthens your negotiating position.
    </div>

    <h2 id="foir-formula">How Banks Calculate Your Eligibility — The FOIR Formula</h2>
    <p>The cornerstone of home loan eligibility assessment is the <strong>FOIR (Fixed Obligation to Income Ratio)</strong>, also called Debt-to-Income (DTI) ratio. This single metric determines how much EMI you can afford.</p>
    <div class="explanation__highlight">
        <strong>FOIR Formula:</strong> FOIR = (All Monthly EMI Obligations ÷ Gross Monthly Income) × 100
    </div>
    <p>Banks typically cap FOIR at <strong>40–50%</strong> for home loans. Here's what this means in practice:</p>

    <h3>Worked Example — ₹1 Lakh Salary</h3>
    <table>
        <thead>
            <tr><th>Parameter</th><th>Value</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Gross Monthly Income</strong></td><td>₹1,00,000</td></tr>
            <tr><td>Existing Car Loan EMI</td><td>₹8,000</td></tr>
            <tr><td>Credit Card EMI</td><td>₹5,000</td></tr>
            <tr><td><strong>Total Existing Obligations</strong></td><td><strong>₹13,000</strong></td></tr>
            <tr><td>FOIR Cap (50%)</td><td>₹50,000</td></tr>
            <tr><td><strong>Available for Home Loan EMI</strong></td><td><strong>₹37,000</strong></td></tr>
        </tbody>
    </table>
    <p>With ₹37,000 available EMI at <strong>8.5% interest for 20 years</strong>, the reverse EMI formula gives:</p>
    <div class="explanation__highlight">
        <strong>Max Loan = EMI × [(1+R)<sup>N</sup> − 1] / [R × (1+R)<sup>N</sup>]</strong><br>
        = 37,000 × [(1.007083)<sup>240</sup> − 1] / [0.007083 × (1.007083)<sup>240</sup>]<br>
        = 37,000 × 115.23 = <strong>₹42,63,510</strong>
    </div>
    <p>This means with a ₹1 lakh salary and ₹13,000 existing EMIs, you're eligible for approximately <strong>₹42.6 lakh</strong> in home loan. Use our calculator above to get your exact number.</p>

    <h3>Income-Wise Quick Reference Table</h3>
    <p>How much home loan can you get based on your salary? Here's a quick reference assuming <strong>8.5% interest, 20-year tenure, zero existing EMIs, 50% FOIR</strong>:</p>
    <table>
        <thead>
            <tr><th>Monthly Salary</th><th>Max EMI (50%)</th><th>Max Loan</th><th>Property (80% LTV)</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>₹25,000</strong></td><td>₹12,500</td><td>₹14.4 Lakh</td><td>₹18 Lakh</td></tr>
            <tr><td><strong>₹40,000</strong></td><td>₹20,000</td><td>₹23.0 Lakh</td><td>₹28.8 Lakh</td></tr>
            <tr><td><strong>₹50,000</strong></td><td>₹25,000</td><td>₹28.8 Lakh</td><td>₹36.0 Lakh</td></tr>
            <tr><td><strong>₹75,000</strong></td><td>₹37,500</td><td>₹43.2 Lakh</td><td>₹54.0 Lakh</td></tr>
            <tr><td><strong>₹1,00,000</strong></td><td>₹50,000</td><td>₹57.6 Lakh</td><td>₹72.0 Lakh</td></tr>
            <tr><td><strong>₹1,50,000</strong></td><td>₹75,000</td><td>₹86.4 Lakh</td><td>₹1.08 Crore</td></tr>
            <tr><td><strong>₹2,00,000</strong></td><td>₹1,00,000</td><td>₹1.15 Crore</td><td>₹1.44 Crore</td></tr>
            <tr><td><strong>₹3,00,000</strong></td><td>₹1,50,000</td><td>₹1.73 Crore</td><td>₹2.16 Crore</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> Every ₹10,000 increase in monthly salary adds approximately ₹11.5 lakh to your home loan eligibility (at 8.5%, 20 years). Use our <a href="/in/home-loan-calculator">Home Loan EMI Calculator</a> to see the exact EMI for your eligible amount.
    </div>

    <h2 id="rbi-ltv">RBI LTV (Loan-to-Value) Guidelines 2026</h2>
    <p>The <strong>Reserve Bank of India</strong> mandates maximum Loan-to-Value (LTV) ratios that determine the minimum down payment you must make. LTV limits the percentage of property value a bank can finance:</p>
    <table>
        <thead>
            <tr><th>Property Value / Loan Amount</th><th>Maximum LTV</th><th>Minimum Down Payment</th><th>Example</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Up to ₹30 Lakh</strong></td><td>90%</td><td>10%</td><td>₹25L property → ₹2.5L down</td></tr>
            <tr><td><strong>₹30 Lakh – ₹75 Lakh</strong></td><td>80%</td><td>20%</td><td>₹60L property → ₹12L down</td></tr>
            <tr><td><strong>Above ₹75 Lakh</strong></td><td>75%</td><td>25%</td><td>₹1Cr property → ₹25L down</td></tr>
        </tbody>
    </table>
    <p><strong>Important:</strong> Stamp duty, registration charges, and GST (for under-construction) are <em>not</em> included in the property value for LTV calculation. You must pay these separately from your own funds.</p>
    <div class="explanation__highlight">
        <strong>Practical Impact:</strong> For a ₹1 crore property, your minimum out-of-pocket cost is: ₹25 lakh (down payment) + ~₹6–8 lakh (stamp duty + registration) + ~₹1–2 lakh (legal + documentation) = <strong>₹32–35 lakh</strong>. Plan your <a href="/in/sip-calculator">SIP investments</a> and <a href="/in/fd-calculator">FD savings</a> well in advance.
    </div>

    <h2 id="bank-criteria">Bank-Wise Home Loan Eligibility Criteria 2026</h2>
    <p>Each bank has its own eligibility criteria beyond the standard FOIR calculation. Here's a comprehensive comparison of major Indian lenders as of March 2026:</p>
    <table>
        <thead>
            <tr><th>Bank / Lender</th><th>Interest Rate</th><th>Min Age</th><th>Max Age</th><th>Min Income</th><th>Processing Fee</th><th>Max Tenure</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>SBI</strong></td><td>8.50% onwards</td><td>18</td><td>70</td><td>₹25,000</td><td>₹2K–₹10K</td><td>30 yrs</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>8.75% onwards</td><td>21</td><td>65</td><td>₹10,000</td><td>Up to 0.5%</td><td>30 yrs</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>8.75% onwards</td><td>23</td><td>65</td><td>₹25,000</td><td>Up to 0.5%</td><td>30 yrs</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>8.40% onwards</td><td>21</td><td>70</td><td>₹15,000</td><td>₹8,500 flat</td><td>30 yrs</td></tr>
            <tr><td><strong>PNB</strong></td><td>8.45% onwards</td><td>18</td><td>70</td><td>₹15,000</td><td>Up to 0.35%</td><td>30 yrs</td></tr>
            <tr><td><strong>Kotak Mahindra</strong></td><td>8.70% onwards</td><td>21</td><td>65</td><td>₹20,000</td><td>Up to 0.5%</td><td>25 yrs</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>8.75% onwards</td><td>21</td><td>70</td><td>₹15,000</td><td>Up to 1%</td><td>30 yrs</td></tr>
            <tr><td><strong>IDFC First Bank</strong></td><td>8.85% onwards</td><td>23</td><td>62</td><td>₹20,000</td><td>Up to 3%</td><td>30 yrs</td></tr>
            <tr><td><strong>LIC HFL</strong></td><td>8.50% onwards</td><td>21</td><td>65</td><td>₹10,000</td><td>Up to 0.5%</td><td>30 yrs</td></tr>
            <tr><td><strong>Bajaj Housing</strong></td><td>8.45% onwards</td><td>23</td><td>70</td><td>₹25,000</td><td>Up to 0.5%</td><td>30 yrs</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Strategy Tip:</strong> Public sector banks (SBI, PNB, Bank of Baroda) generally offer lower rates and more flexible age criteria. Private banks (HDFC, ICICI, Kotak) often have faster processing but slightly higher rates. Always get quotes from at least 3 banks — a 0.25% rate difference on ₹50 lakh over 20 years saves approximately <strong>₹2 lakh in interest</strong>.
    </div>

    <h2 id="cibil-impact">CIBIL Score Impact on Home Loan Eligibility</h2>
    <p>Your <strong>CIBIL score</strong> (credit score) is the single most important factor after income. It directly affects both your <strong>approval probability</strong> and the <strong>interest rate</strong> you receive. Here's the impact analysis for a ₹1 lakh salary, 20-year tenure:</p>
    <table>
        <thead>
            <tr><th>CIBIL Score</th><th>Approval Odds</th><th>Interest Rate</th><th>Max Loan</th><th>Total Interest</th><th>vs Best Rate</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>800+</strong></td><td>✅ Very High</td><td>8.40%</td><td>₹58.3 Lakh</td><td>₹52.7 Lakh</td><td>—</td></tr>
            <tr><td><strong>750–799</strong></td><td>✅ High</td><td>8.50%</td><td>₹57.6 Lakh</td><td>₹54.1 Lakh</td><td>+₹1.4L interest</td></tr>
            <tr><td><strong>700–749</strong></td><td>⚠️ Moderate</td><td>8.85%</td><td>₹55.5 Lakh</td><td>₹57.9 Lakh</td><td>+₹5.2L interest</td></tr>
            <tr><td><strong>650–699</strong></td><td>⚠️ Low</td><td>9.25%</td><td>₹53.3 Lakh</td><td>₹62.2 Lakh</td><td>+₹9.5L interest</td></tr>
            <tr><td><strong>Below 650</strong></td><td>❌ Very Low</td><td>10.0%+</td><td>₹49.6 Lakh</td><td>₹69.0 Lakh</td><td>+₹16.3L interest</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Shocking Fact:</strong> A person with CIBIL 650 pays approximately <strong>₹16.3 lakh MORE</strong> in total interest compared to someone with 800+ score — on the same ₹50,000/month salary. That's nearly the cost of a car! Use our CIBIL Impact mode above to see your exact numbers.
    </div>

    <h3>How to Improve Your CIBIL Score</h3>
    <ol>
        <li><strong>Pay all EMIs and credit card dues on time</strong> — even one late payment drops your score by 50–100 points</li>
        <li><strong>Reduce credit utilization below 30%</strong> — if your credit card limit is ₹3 lakh, keep outstanding below ₹90,000</li>
        <li><strong>Don't close old credit cards</strong> — longer credit history improves your score</li>
        <li><strong>Avoid multiple loan inquiries</strong> — each "hard inquiry" reduces your score by 5–10 points</li>
        <li><strong>Dispute errors in CIBIL report</strong> — check for incorrect loan entries, wrong amounts, or closed loans showing as active</li>
        <li><strong>Maintain a mix of credit types</strong> — having both secured (home/car loan) and unsecured (credit card) credit improves the score</li>
    </ol>
    <p>Typical timeline: 3–6 months of disciplined credit behavior can improve your score by 50–100 points.</p>

    <h2 id="increase-eligibility">10 Proven Ways to Increase Your Home Loan Eligibility</h2>
    <ol>
        <li><strong>Add a co-applicant (spouse/parent):</strong> Combining incomes can boost eligibility by 40–80%. Use our Co-Applicant mode above to see your exact boost.</li>
        <li><strong>Clear existing loans:</strong> Paying off a ₹15,000/month car loan EMI can increase your home loan eligibility by ₹17 lakh. Consider using your savings to <a href="/in/personal-loan-calculator">prepay personal loans</a> first.</li>
        <li><strong>Improve CIBIL to 750+:</strong> This alone can increase your eligible amount by ₹3–5 lakh due to lower interest rates.</li>
        <li><strong>Choose a longer tenure:</strong> Going from 15 to 25 years increases eligibility by approximately 30%, though you'll pay more in total interest.</li>
        <li><strong>Opt for a lower interest rate bank:</strong> Use our bank selector to compare — even 0.25% means ₹2 lakh more in eligible loan.</li>
        <li><strong>Show additional income:</strong> Declare rental income, freelance earnings, or spouse's income. Banks will consider it in FOIR calculation.</li>
        <li><strong>Reduce credit card dues:</strong> High credit card outstanding directly reduces your FOIR capacity. Pay off card balances before applying.</li>
        <li><strong>Maintain 6+ months employment stability:</strong> Banks prefer borrowers with at least 6 months in their current job and 2+ years of total experience.</li>
        <li><strong>Build a larger down payment:</strong> While this doesn't directly increase loan eligibility, it reduces the loan amount needed and may get you better terms. Use <a href="/in/ppf-calculator">PPF</a> or <a href="/in/fd-calculator">Fixed Deposits</a> to build your down payment fund.</li>
        <li><strong>Avoid simultaneous loan applications:</strong> Multiple applications trigger multiple hard inquiries, each dropping your CIBIL by 5–10 points.</li>
    </ol>

    <h2 id="self-employed">Home Loan Eligibility for Self-Employed Professionals</h2>
    <p>Self-employed individuals — doctors, CAs, lawyers, business owners, freelancers — face a different eligibility assessment process compared to salaried employees.</p>
    <h3>How Banks Calculate Self-Employed Income</h3>
    <p>Unlike salaried individuals where the salary slip is definitive, banks use the following method for self-employed:</p>
    <ul>
        <li><strong>Average of last 3 years' Net Profit</strong> (from ITR) is taken as annual income</li>
        <li>Monthly income = Average Annual Net Profit ÷ 12</li>
        <li>Banks may apply a <strong>30–40% haircut</strong> on declared income for conservative assessment</li>
        <li>Business vintage of <strong>3+ years</strong> is typically required</li>
    </ul>
    <h3>Example</h3>
    <table>
        <thead>
            <tr><th>Year</th><th>Net Profit (per ITR)</th></tr>
        </thead>
        <tbody>
            <tr><td>FY 2023-24</td><td>₹12,00,000</td></tr>
            <tr><td>FY 2024-25</td><td>₹15,00,000</td></tr>
            <tr><td>FY 2025-26</td><td>₹18,00,000</td></tr>
            <tr><td><strong>Average</strong></td><td><strong>₹15,00,000</strong></td></tr>
            <tr><td><strong>Monthly Income</strong></td><td><strong>₹1,25,000</strong></td></tr>
        </tbody>
    </table>
    <p>At 50% FOIR and 8.5% for 20 years, this translates to approximately <strong>₹72 lakh</strong> eligibility. However, some banks may apply a 30% haircut, making the effective monthly income ₹87,500 and eligibility approximately ₹50 lakh.</p>

    <h2 id="nri-eligibility">NRI Home Loan Eligibility in India</h2>
    <p>Non-Resident Indians (NRIs) can purchase residential and commercial property in India with home loans. However, the process has specific requirements:</p>
    <table>
        <thead>
            <tr><th>Parameter</th><th>NRI Requirement</th><th>Resident Indian</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Interest Rate Premium</strong></td><td>+0.25% to +0.50%</td><td>Base rate</td></tr>
            <tr><td><strong>Max LTV</strong></td><td>80% (most banks)</td><td>Up to 90%</td></tr>
            <tr><td><strong>Income Proof</strong></td><td>Overseas employment contract, salary certificate</td><td>Salary slips, Form 16</td></tr>
            <tr><td><strong>Bank Account</strong></td><td>NRE/NRO account mandatory</td><td>Savings account</td></tr>
            <tr><td><strong>Power of Attorney</strong></td><td>Required (notarized/apostilled)</td><td>Not needed</td></tr>
            <tr><td><strong>Repayment</strong></td><td>Only from NRE/NRO/FCNR accounts</td><td>Any Indian account</td></tr>
            <tr><td><strong>Property Types</strong></td><td>Residential & commercial only</td><td>All types</td></tr>
            <tr><td><strong>Restriction</strong></td><td>Cannot buy agricultural land, farmhouse, plantation</td><td>None</td></tr>
        </tbody>
    </table>
    <p>Banks offering NRI home loans: <strong>SBI (NRI home loan)</strong>, <strong>HDFC Bank</strong>, <strong>ICICI Bank</strong>, <strong>Axis Bank</strong>, and <strong>Kotak Mahindra Bank</strong>. SBI typically offers the most competitive rates for NRIs.</p>

    <h2 id="pmay-guide">PMAY 2.0 Subsidy Guide — Pradhan Mantri Awas Yojana</h2>
    <p>Under <strong>PMAY Urban 2.0</strong>, eligible first-time homebuyers can receive interest subsidies that reduce their effective home loan cost. Here are the current guidelines:</p>
    <table>
        <thead>
            <tr><th>Category</th><th>Annual Income</th><th>Subsidy Rate</th><th>On Loan Up To</th><th>Max Benefit</th><th>Max Carpet Area</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>EWS</strong></td><td>Up to ₹3 Lakh</td><td>4%</td><td>₹8 Lakh</td><td>₹1,80,000</td><td>60 sq.m</td></tr>
            <tr><td><strong>LIG</strong></td><td>₹3–6 Lakh</td><td>4%</td><td>₹8 Lakh</td><td>₹1,80,000</td><td>60 sq.m</td></tr>
            <tr><td><strong>MIG</strong></td><td>₹6–9 Lakh</td><td>4%</td><td>₹8 Lakh</td><td>₹1,80,000</td><td>120 sq.m</td></tr>
        </tbody>
    </table>
    <h3>Key PMAY Eligibility Conditions</h3>
    <ul>
        <li>Applicant must <strong>not own a pucca house</strong> anywhere in India</li>
        <li>Must not have availed benefits under any government housing scheme in the last 20 years</li>
        <li>Maximum property value: <strong>₹35 lakh</strong></li>
        <li>Maximum loan amount for subsidy: <strong>₹25 lakh</strong></li>
        <li>Subsidy is disbursed in <strong>5 annual installments</strong> directly to the loan account</li>
        <li>Property must be in a statutory urban area</li>
        <li>Aadhaar number/Virtual ID required for verification</li>
    </ul>
    <div class="explanation__highlight">
        <strong>How Subsidy Works:</strong> The 4% interest subsidy on ₹8 lakh over 12 years translates to a net present value (NPV) benefit of approximately <strong>₹1.80 lakh</strong>. This amount is credited to your loan account, reducing the effective loan principal and your monthly EMI. Apply through your bank — they'll handle the PMAY application as part of your home loan process.
    </div>

    <h2 id="documents-required">Documents Required for Home Loan — Complete Checklist</h2>
    <h3>For Salaried Employees</h3>
    <table>
        <thead>
            <tr><th>Category</th><th>Documents</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Identity Proof</strong></td><td>PAN Card (mandatory), Aadhaar Card, Voter ID, Passport, or Driving License</td></tr>
            <tr><td><strong>Address Proof</strong></td><td>Aadhaar, Utility bill (electricity/gas), Passport, Rent agreement (if renting)</td></tr>
            <tr><td><strong>Income Proof</strong></td><td>Last 6 months salary slips, Form 16 (last 2 years), IT Returns (last 2 years)</td></tr>
            <tr><td><strong>Employment</strong></td><td>Appointment letter, HR declaration letter with CTC breakdown</td></tr>
            <tr><td><strong>Banking</strong></td><td>Last 6–12 months bank statements (salary credit account)</td></tr>
            <tr><td><strong>Property</strong></td><td>Sale agreement, Title deed, Approved building plan, NOC from society/builder, Encumbrance certificate, Property tax receipts</td></tr>
            <tr><td><strong>Personal</strong></td><td>6 passport-size photographs, Loan application form</td></tr>
        </tbody>
    </table>

    <h3>For Self-Employed / Business Owners</h3>
    <table>
        <thead>
            <tr><th>Category</th><th>Documents</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>KYC</strong></td><td>Same as salaried (PAN, Aadhaar, address proof)</td></tr>
            <tr><td><strong>Business Proof</strong></td><td>GST registration, Trade license, Partnership deed / MOA / AOA</td></tr>
            <tr><td><strong>Income Proof</strong></td><td>ITR (last 3 years), CA-certified P&L and Balance Sheet (3 years), Computation of income</td></tr>
            <tr><td><strong>Banking</strong></td><td>Last 12 months current/business account statements</td></tr>
            <tr><td><strong>Professional</strong></td><td>Qualification certificates (for doctors, CAs, lawyers)</td></tr>
        </tbody>
    </table>

    <h3>For NRI Applicants</h3>
    <table>
        <thead>
            <tr><th>Category</th><th>Documents</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>KYC</strong></td><td>Valid Indian Passport (with visa stamps), PIO/OCI card (if applicable)</td></tr>
            <tr><td><strong>Visa</strong></td><td>Valid work visa/residence permit, Employment contract</td></tr>
            <tr><td><strong>Income</strong></td><td>Salary certificate, overseas bank statements (6 months), Tax returns (country of residence)</td></tr>
            <tr><td><strong>Banking</strong></td><td>NRE/NRO account statements (6 months)</td></tr>
            <tr><td><strong>Legal</strong></td><td>Notarized/apostilled Power of Attorney</td></tr>
        </tbody>
    </table>

    <h2 id="tax-benefits">Tax Benefits on Home Loans — Section 80C & 24(b)</h2>
    <p>Home loans provide significant tax deductions under the <strong>Old Tax Regime</strong>. These benefits are <strong>NOT available under the New Tax Regime</strong> — plan accordingly using our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.</p>
    <table>
        <thead>
            <tr><th>Section</th><th>Deduction On</th><th>Max Limit</th><th>Conditions</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Section 80C</strong></td><td>Principal repayment + stamp duty + registration</td><td>₹1.5 lakh/year</td><td>Shared with PPF, ELSS, LIC. Property not to be sold within 5 years.</td></tr>
            <tr><td><strong>Section 24(b)</strong></td><td>Interest on home loan</td><td>₹2 lakh/year (self-occupied)</td><td>No limit for let-out property. Possession within 5 years of loan start.</td></tr>
            <tr><td><strong>Section 80EE</strong></td><td>Additional interest (first-time buyer)</td><td>₹50,000/year</td><td>Loan ≤ ₹35 lakh. Property value ≤ ₹50 lakh.</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Maximum Total Tax Saving:</strong> Under the old regime (30% slab), a homebuyer can save up to <strong>₹1,05,000/year</strong> in taxes — ₹45,000 from 80C (₹1.5L × 30%) + ₹60,000 from 24(b) (₹2L × 30%). Over 20 years, this translates to approximately <strong>₹15–20 lakh</strong> in cumulative tax savings. Check your exact savings with our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.
    </div>

    <h2 id="common-mistakes">8 Common Mistakes That Reduce Your Home Loan Eligibility</h2>
    <ol>
        <li><strong>Not checking CIBIL before applying:</strong> Multiple rejection inquiries drop your score by 15–30 points. Check your score first (free annually at cibil.com) and fix issues before applying.</li>
        <li><strong>Having high credit card utilization:</strong> Even if you pay full bills on time, >50% utilization ratio reduces your FOIR capacity. Pay down card balances before the home loan application.</li>
        <li><strong>Taking a personal loan just before applying:</strong> New loan EMIs immediately reduce your FOIR capacity. If you need funds for registration/interiors, wait until after the home loan is sanctioned.</li>
        <li><strong>Not declaring all income sources:</strong> Rental income, freelance earnings, and performance bonuses can significantly increase your eligible amount. Provide documentation for all income streams.</li>
        <li><strong>Choosing the wrong bank:</strong> A bank with 0.5% higher interest rate on ₹50 lakh means ₹5–6 lakh more in total interest AND lower eligible amount. Compare at least 3 banks using our calculator.</li>
        <li><strong>Applying as a single applicant:</strong> Not adding a co-applicant when eligible costs you 40–80% higher eligible amount. Always consider adding your spouse or parent.</li>
        <li><strong>Defaulting on small EMIs:</strong> Even a ₹500 credit card minimum payment default can drop your CIBIL by 50–100 points. Set up auto-debits for all obligations.</li>
        <li><strong>Job-hopping before application:</strong> Banks want 6+ months in your current job. Switching jobs right before applying triggers a red flag. Wait for the cooling period.</li>
    </ol>

    <h2 id="co-applicant-strategy">Co-Applicant Strategy — Maximize Your Eligibility</h2>
    <p>Adding a <strong>co-applicant</strong> is the single most effective way to increase your home loan eligibility. Here's who can be a co-applicant and the benefits:</p>
    <table>
        <thead>
            <tr><th>Co-Applicant Type</th><th>Income Counted?</th><th>Interest Concession?</th><th>Stamp Duty Benefit?</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Spouse (Female)</strong></td><td>✅ Full</td><td>✅ 0.05% (most banks)</td><td>✅ 1–2% in Delhi, Rajasthan, UP, Punjab, Haryana</td></tr>
            <tr><td><strong>Spouse (Male)</strong></td><td>✅ Full</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Parent</strong></td><td>✅ Full</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Sibling</strong></td><td>✅ Full (some banks)</td><td>❌ No</td><td>❌ No</td></tr>
            <tr><td><strong>Son/Daughter</strong></td><td>✅ Full</td><td>❌ No</td><td>❌ No</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Best Strategy:</strong> Make your <strong>wife the primary applicant and co-owner</strong>. This gives you: (1) Combined income for higher eligibility, (2) 0.05% interest concession at most banks, (3) 1–2% stamp duty concession in many states, (4) Both 80C and 24(b) tax benefits if she is working. On a ₹80 lakh property in Delhi, the stamp duty savings alone can be <strong>₹1.6 lakh</strong>.
    </div>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — After knowing your eligible amount, calculate the exact EMI, amortization schedule, and prepayment savings.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator 2026</a></strong> — See how Section 80C and 24(b) deductions from your home loan reduce your tax liability.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Planning to clear existing loans to improve FOIR? Check the prepayment math.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan Calculator</a></strong> — Check your car loan outstanding before applying for a home loan.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Build your down payment corpus through systematic monthly investments in mutual funds.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Save for your down payment with PPF at 7.1% — tax-free returns with EEE status under Section 80C.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Park your down payment savings in a Fixed Deposit while you search for the right property.</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> — Calculate how your down payment savings grow over time with compound interest.</li>
    </ul>
`;

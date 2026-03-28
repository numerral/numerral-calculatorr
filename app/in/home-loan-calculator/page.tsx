// Standalone page — /in/home-loan-calculator
// India Home Loan EMI Calculator with 5,000+ word educational hub

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import HomeLoanCalculatorCore from "@/components/calculator/HomeLoanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Home Loan EMI Calculator India 2026 — Monthly EMI, Eligibility & Amortization",
    description: "Free home loan EMI calculator for India. Calculate monthly EMI, total interest, amortization schedule, loan eligibility, and prepayment savings. Compare bank interest rates — SBI, HDFC, ICICI — with tax benefit guide (Sec 80C/24b).",
    keywords: ["home loan EMI calculator India", "home loan calculator", "housing loan calculator", "EMI calculator India", "home loan interest rate 2026", "home loan eligibility calculator", "home loan prepayment calculator", "SBI home loan rate", "HDFC home loan EMI", "amortization schedule home loan"],
    alternates: { canonical: canonicalUrl("/in/home-loan-calculator") },
};

const FAQ_ITEMS = [
    { question: "How is home loan EMI calculated?", answer: "Home loan EMI is calculated using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P is the loan principal, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the total number of months (tenure in years × 12). For example, a ₹50 lakh loan at 8.5% for 20 years gives an EMI of ₹43,391." },
    { question: "What is the current home loan interest rate in India 2026?", answer: "As of March 2026, home loan interest rates in India start from approximately 7.10% p.a. at SBI, 7.20% at HDFC Bank, 7.65% at ICICI Bank, 7.30% at Bank of Baroda, and 7.25% at PNB. Rates vary based on your CIBIL score, loan amount, employment type, and the bank's base rate (EBLR/MCLR)." },
    { question: "What is the RBI repo rate in March 2026?", answer: "The RBI repo rate as of March 2026 is 5.25%. The repo rate is the rate at which the Reserve Bank of India lends money to commercial banks. It directly influences the External Benchmark Lending Rate (EBLR) offered by banks for home loans. A lower repo rate generally means lower home loan EMIs." },
    { question: "How much home loan can I get on ₹1 lakh salary?", answer: "On a ₹1 lakh monthly salary with no existing EMIs, banks typically allow up to 50% of income as EMI (FOIR rule), which is ₹50,000. At 8.5% interest for 20 years, this supports a maximum loan of approximately ₹57.6 lakh. With a 20% down payment, you can afford a property worth ~₹72 lakh." },
    { question: "What are the tax benefits on home loans in India?", answer: "Under the old tax regime: (1) Section 80C — up to ₹1.5 lakh deduction on principal repayment, (2) Section 24(b) — up to ₹2 lakh deduction on interest paid for self-occupied property, (3) Section 80EEA — additional ₹1.5 lakh on interest (for loans sanctioned between April 2019 and March 2022, property value ≤ ₹45 lakh). Total potential tax saving: up to ₹5 lakh per year. Note: These benefits are NOT available under the new tax regime." },
    { question: "Should I choose a fixed or floating interest rate?", answer: "In India, most home loans are floating rate (linked to EBLR/repo rate). Floating rates start lower than fixed rates and adjust with market conditions. Fixed rates offer EMI certainty for 2-3 years but are typically 1-2% higher. Recommendation: Choose floating rate if you expect rates to decrease; choose fixed if you want EMI predictability and rates are at historical lows." },
    { question: "How much can I save by prepaying my home loan?", answer: "A one-time prepayment of ₹5 lakh on a ₹50 lakh loan (8.5%, 20 years) in Year 3 can save approximately ₹5-7 lakh in interest and reduce your tenure by 2-3 years. The earlier you prepay, the more you save because the outstanding principal is higher. Under RBI guidelines, floating rate home loans have zero prepayment penalty." },
    { question: "What documents are needed for a home loan in India?", answer: "For salaried borrowers: (1) PAN card and Aadhaar, (2) Last 6 months salary slips, (3) Form 16 / IT returns for 2 years, (4) Last 6 months bank statements, (5) Property documents — sale agreement, title deed, approved plan, (6) Passport-size photos. Self-employed borrowers additionally need business registration, profit & loss statements, and CA-certified financial statements." },
    { question: "What is the maximum home loan tenure in India?", answer: "Most Indian banks offer home loan tenures of up to 30 years. However, the loan must typically be repaid before you turn 60-70 years (depending on the bank's policy). For example, if you are 35 years old and the bank's retirement age policy is 60, your maximum tenure would be 25 years. SBI, HDFC, and ICICI all offer up to 30-year tenures." },
    { question: "What is FOIR and how does it affect eligibility?", answer: "FOIR (Fixed Obligation to Income Ratio) is the percentage of your gross monthly income that goes towards all EMI obligations. Banks generally cap FOIR at 50-60%. If your income is ₹1 lakh and existing EMIs are ₹15,000, your FOIR is 15%. The bank will allow a new EMI of maximum ₹35,000-₹45,000 (to keep total FOIR within 50-60%)." },
    { question: "What stamp duty do I pay on buying a house?", answer: "Stamp duty varies by state: Maharashtra charges 5-6%, Karnataka 5.6%, Delhi 4-6%, Tamil Nadu 7%, Uttar Pradesh 5-7%, Gujarat 4.9%, Rajasthan 4-6%, West Bengal 6-8%. Many states offer 1-2% concessions for female buyers. Registration charges are typically 1% additional. For a ₹80 lakh property in Mumbai, expect approximately ₹4-5 lakh in stamp duty + ₹80,000 registration." },
    { question: "What is the PMAY subsidy and who is eligible?", answer: "Under PMAY (Pradhan Mantri Awas Yojana), eligible homebuyers can get interest subsidies: EWS (income up to ₹3 lakh/year) — 4% subsidy on ₹8 lakh loan, LIG (₹3-6 lakh) — 4% subsidy on ₹8 lakh, MIG-I (₹6-12 lakh) — 3% subsidy on ₹9 lakh, MIG-II (₹12-18 lakh) — 3% on ₹12 lakh. The subsidy translates to ₹2.35-2.67 lakh in net present value savings over the loan tenure." },
    { question: "How does the amortization schedule work?", answer: "An amortization schedule shows how each EMI is split between principal and interest over the loan tenure. In the early years, a larger portion (60-70%) goes towards interest. As the loan matures, more goes towards principal. For a ₹50 lakh, 8.5%, 20-year loan: In Year 1, about ₹4.2 lakh goes to interest and only ₹93,000 to principal. By Year 20, almost the entire EMI goes to principal." },
    { question: "Can I get a home loan with a low CIBIL score?", answer: "Most banks require a CIBIL score of 700+ for home loan approval. With 750+, you get the best interest rates. Between 650-700, loans are possible but at higher rates (0.5-1% premium). Below 650, approval is difficult — consider improving your score first by clearing outstanding dues, reducing credit utilization, and maintaining regular payments for 6-12 months." },
    { question: "Is it better to take a home loan for 20 or 30 years?", answer: "A 20-year tenure has higher EMI but you pay significantly less total interest. Example: ₹50 lakh at 8.5% — 20 years: EMI ₹43,391, Total Interest ₹54.14 lakh. 30 years: EMI ₹38,446, Total Interest ₹88.40 lakh. The 30-year option costs ₹34.26 lakh MORE in interest. Choose 20 years if you can afford the higher EMI; choose 30 years for lower monthly outflow and invest the EMI difference." },
];

export default function HomeLoanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Home Loan EMI Calculator" },
        ]),
        webAppSchema("Home Loan EMI Calculator India 2026", canonicalUrl("/in/home-loan-calculator")),
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
            <Script id="schema-homeloan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Home Loan EMI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Home Loan EMI Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your home loan EMI, total interest, and amortization schedule. Check your loan eligibility, see how prepayment saves lakhs in interest, and find out how much property you can afford — all based on 2026 Indian bank rates and RBI guidelines.
            </p>
            <AuthorBadge categoryKey="salary" />
            <HomeLoanCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Home Loan EMI Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/fuel-cost-calculator" className="in-related-link">
                        <span className="in-related-link__icon">⛽</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Fuel Cost Calculator</div>
                            <div className="in-related-link__desc">Petrol, diesel & CNG costs</div>
                        </div>
                    </Link>
                    <Link href="/utility-calculators/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest</div>
                            <div className="in-related-link__desc">Grow your down payment savings</div>
                        </div>
                    </Link>
                    <Link href="/math-calculators/percentage-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Percentage Calculator</div>
                            <div className="in-related-link__desc">Calculate interest rate changes</div>
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
    <h2 id="what-is-home-loan-emi">What Is a Home Loan EMI?</h2>
    <p>An <strong>Equated Monthly Instalment (EMI)</strong> is the fixed monthly amount a borrower pays to the lender to repay a home loan over a predetermined period. Each EMI consists of two components: <strong>principal repayment</strong> (the portion that reduces your actual loan balance) and <strong>interest payment</strong> (the cost of borrowing charged by the bank).</p>
    <p>In the early years of your loan, a larger portion of the EMI goes towards interest — often 60–70% of the total EMI. As you progress through the tenure, the interest component decreases and the principal component increases. This is why <strong>prepayments made early</strong> in the loan tenure are far more effective at reducing total interest.</p>
    <p>In India, home loans are offered by public sector banks (SBI, PNB, Bank of Baroda), private banks (HDFC, ICICI, Axis, Kotak), and non-banking financial companies (Bajaj, LIC HFL, HDFC Ltd). Most loans have a <strong>floating interest rate</strong> linked to the RBI repo rate through the External Benchmark Lending Rate (EBLR) mechanism.</p>

    <h2 id="emi-formula">Home Loan EMI Formula</h2>
    <div class="explanation__highlight">
        <strong>EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>P</strong> — Principal loan amount (e.g., ₹50,00,000)</li>
        <li><strong>R</strong> — Monthly interest rate = Annual Rate ÷ 12 ÷ 100 (e.g., 8.5% ÷ 12 ÷ 100 = 0.007083)</li>
        <li><strong>N</strong> — Total number of monthly instalments = Years × 12 (e.g., 20 × 12 = 240)</li>
    </ul>
    <p>The formula ensures that each EMI remains <strong>constant</strong> throughout the tenure (assuming a fixed interest rate), while the split between principal and interest changes every month.</p>

    <h2 id="step-by-step-example">Step-by-Step Worked Example</h2>
    <p>Let's calculate the EMI for a typical Indian home loan:</p>
    <ul>
        <li><strong>Loan Amount (P):</strong> ₹50,00,000 (50 Lakh)</li>
        <li><strong>Interest Rate:</strong> 8.5% per annum → Monthly Rate (R) = 0.085 ÷ 12 = 0.007083</li>
        <li><strong>Tenure:</strong> 20 years → N = 20 × 12 = 240 months</li>
    </ul>
    <ol>
        <li><strong>Calculate (1+R)<sup>N</sup>:</strong> (1 + 0.007083)<sup>240</sup> = 5.4392</li>
        <li><strong>Numerator:</strong> P × R × (1+R)<sup>N</sup> = 50,00,000 × 0.007083 × 5.4392 = <strong>1,92,624</strong></li>
        <li><strong>Denominator:</strong> (1+R)<sup>N</sup> − 1 = 5.4392 − 1 = <strong>4.4392</strong></li>
        <li><strong>EMI:</strong> 1,92,624 ÷ 4.4392 = <strong>₹43,391</strong></li>
    </ol>
    <table>
        <thead>
            <tr><th>Component</th><th>Amount</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>₹43,391</strong></td></tr>
            <tr><td>Total Amount Payable (240 months)</td><td>₹1,04,13,840</td></tr>
            <tr><td>Total Interest Paid</td><td>₹54,13,840</td></tr>
            <tr><td>Interest as % of Total</td><td>52.0%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> On a ₹50 lakh loan at 8.5% for 20 years, you pay <strong>₹54.14 lakh in interest</strong> — more than the original loan amount! This is why tenure selection and prepayment strategy are critical.
    </div>

    <h2 id="amortization-explained">Understanding Your Amortization Schedule</h2>
    <p>An <strong>amortization schedule</strong> (also called loan repayment schedule) shows the detailed breakdown of every EMI payment over the entire loan tenure. Here's the year-wise split for our ₹50 lakh example:</p>
    <table>
        <thead>
            <tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Outstanding Balance</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>1</strong></td><td>₹93,000</td><td>₹4,27,700</td><td>₹49,07,000</td></tr>
            <tr><td><strong>5</strong></td><td>₹1,28,000</td><td>₹3,92,700</td><td>₹44,61,000</td></tr>
            <tr><td><strong>10</strong></td><td>₹1,98,000</td><td>₹3,22,700</td><td>₹35,75,000</td></tr>
            <tr><td><strong>15</strong></td><td>₹3,05,000</td><td>₹2,15,700</td><td>₹22,14,000</td></tr>
            <tr><td><strong>20</strong></td><td>₹5,16,000</td><td>₹4,800</td><td>₹0</td></tr>
        </tbody>
    </table>
    <p>Notice how in Year 1, only <strong>₹93,000 goes to principal</strong> while ₹4.28 lakh goes to interest. By Year 20, almost the entire EMI is principal. This is why <strong>prepaying in the early years is most effective</strong>.</p>

    <h2 id="bank-interest-rates">Home Loan Interest Rates 2026 — Major Indian Banks</h2>
    <p>Interest rates are determined by each bank based on the <strong>RBI repo rate</strong> (currently 5.25%), their own spread (margin), and your individual credit profile. Here are indicative starting rates as of March 2026:</p>
    <table>
        <thead>
            <tr><th>Bank / Lender</th><th>Rate (p.a.)</th><th>Processing Fee</th><th>Max Tenure</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>State Bank of India (SBI)</strong></td><td>7.10% onwards</td><td>₹2,000 – ₹10,000</td><td>30 years</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>7.20% onwards</td><td>Up to 0.5% of loan</td><td>30 years</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>7.65% onwards</td><td>Up to 0.5% of loan</td><td>30 years</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>7.30% onwards</td><td>₹8,500 flat</td><td>30 years</td></tr>
            <tr><td><strong>Punjab National Bank</strong></td><td>7.25% onwards</td><td>Up to 0.35% of loan</td><td>30 years</td></tr>
            <tr><td><strong>Kotak Mahindra Bank</strong></td><td>7.50% onwards</td><td>Up to 0.5% of loan</td><td>25 years</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>7.60% onwards</td><td>Up to 1% of loan</td><td>30 years</td></tr>
            <tr><td><strong>IDFC First Bank</strong></td><td>7.35% onwards</td><td>Up to 3% of loan</td><td>30 years</td></tr>
            <tr><td><strong>LIC Housing Finance</strong></td><td>7.50% onwards</td><td>Up to 0.5% of loan</td><td>30 years</td></tr>
            <tr><td><strong>Bajaj Housing Finance</strong></td><td>7.45% onwards</td><td>Up to 0.5% of loan</td><td>30 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tip:</strong> Always negotiate! Banks have flexibility on interest rates, especially for CIBIL scores above 750 and loan amounts above ₹30 lakh. Female borrowers often get 0.05% concession at most banks. Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> to compare rate differences.
    </div>

    <h2 id="rbi-repo-rate">RBI Repo Rate & Its Impact on Home Loan EMIs</h2>
    <p>The <strong>Reserve Bank of India (RBI) repo rate</strong> is the benchmark rate at which commercial banks borrow from the central bank. As of March 2026, the repo rate stands at <strong>5.25%</strong>.</p>
    <p>Since October 2019, all new floating-rate home loans are linked to an external benchmark — typically the <strong>RBI repo rate</strong> — through the External Benchmark Lending Rate (EBLR). When the RBI cuts the repo rate, banks must pass on the benefit to borrowers within a quarter.</p>
    <table>
        <thead>
            <tr><th>RBI Repo Rate</th><th>Typical Home Loan Rate</th><th>EMI on ₹50L / 20yr</th><th>Total Interest</th></tr>
        </thead>
        <tbody>
            <tr><td>4.00%</td><td>~6.50%</td><td>₹37,286</td><td>₹39.49 L</td></tr>
            <tr><td>5.25% (current)</td><td>~8.50%</td><td>₹43,391</td><td>₹54.14 L</td></tr>
            <tr><td>6.00%</td><td>~9.25%</td><td>₹45,839</td><td>₹60.01 L</td></tr>
            <tr><td>6.50%</td><td>~9.75%</td><td>₹47,470</td><td>₹63.93 L</td></tr>
        </tbody>
    </table>
    <p>A <strong>1% change in the repo rate</strong> can impact your EMI by ₹3,000–₹4,000 per month on a ₹50 lakh loan, and total interest by ₹6–10 lakh over 20 years.</p>

    <h2 id="tax-benefits">Tax Benefits on Home Loans in India</h2>
    <p>Home loans offer significant tax deductions under the <strong>Old Tax Regime</strong>. These are NOT available under the New Tax Regime — choose wisely when filing your ITR.</p>
    <table>
        <thead>
            <tr><th>Section</th><th>Deduction On</th><th>Max Limit</th><th>Conditions</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Section 80C</strong></td><td>Principal repayment</td><td>₹1.5 lakh/year</td><td>Shared with PPF, ELSS, LIC etc. Construction must be completed within 5 years.</td></tr>
            <tr><td><strong>Section 24(b)</strong></td><td>Interest on home loan</td><td>₹2 lakh/year (self-occupied)</td><td>No limit for let-out property. Possession must be within 5 years of loan start.</td></tr>
            <tr><td><strong>Section 80EEA</strong></td><td>Additional interest</td><td>₹1.5 lakh/year</td><td>First-time buyer. Loan sanctioned Apr 2019–Mar 2022. Stamp value ≤ ₹45 lakh.</td></tr>
            <tr><td><strong>Section 80EE</strong></td><td>Additional interest</td><td>₹50,000/year</td><td>First-time buyer. Loan ≤ ₹35 lakh. Property value ≤ ₹50 lakh.</td></tr>
        </tbody>
    </table>

    <h3>Worked Example — Tax Saving on ₹50 Lakh Home Loan</h3>
    <p>Consider Priya who has a ₹50 lakh home loan at 8.5% for 20 years (EMI: ₹43,391) and is in the 30% tax bracket under the old regime:</p>
    <table>
        <thead>
            <tr><th>Benefit</th><th>Annual Claim</th><th>Tax Saved (30% slab)</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Section 80C</strong> (Principal)</td><td>₹93,000 (Year 1 principal)</td><td>₹27,900</td></tr>
            <tr><td><strong>Section 24(b)</strong> (Interest)</td><td>₹2,00,000 (capped)</td><td>₹60,000</td></tr>
            <tr><td><strong>Total Tax Saved</strong></td><td></td><td><strong>₹87,900/year</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Effective EMI after tax benefit:</strong> ₹43,391 − (₹87,900 ÷ 12) = <strong>₹36,066/month</strong>. The tax benefit effectively reduces your monthly cost by ₹7,325!
    </div>

    <h2 id="old-vs-new-regime">Old vs New Tax Regime — Which Is Better for Homebuyers?</h2>
    <p>The <strong>New Tax Regime</strong> (default from FY 2023-24 onwards) offers lower slab rates but <strong>removes deductions</strong> like Sections 80C and 24(b). Here's a comparison:</p>
    <table>
        <thead>
            <tr><th>Parameter</th><th>Old Regime</th><th>New Regime</th></tr>
        </thead>
        <tbody>
            <tr><td>Section 80C (₹1.5L)</td><td>✅ Available</td><td>❌ Not available</td></tr>
            <tr><td>Section 24(b) (₹2L interest)</td><td>✅ Available</td><td>❌ Not available</td></tr>
            <tr><td>Standard Deduction</td><td>₹50,000</td><td>₹75,000</td></tr>
            <tr><td>Tax Rates</td><td>Higher slabs</td><td>Lower slabs</td></tr>
            <tr><td><strong>Best for homebuyers</strong></td><td>✅ <strong>Usually yes</strong></td><td>Only if no deductions</td></tr>
        </tbody>
    </table>
    <p><strong>Rule of thumb:</strong> If your total deductions (80C + 24b + NPS + HRA etc.) exceed ₹3.75 lakh, the old regime is typically more beneficial. Most homebuyers with active home loans benefit from the old regime.</p>

    <h2 id="stamp-duty">Stamp Duty & Registration Charges — State-Wise Guide</h2>
    <p>Beyond the down payment and EMI, homebuyers must budget for <strong>stamp duty</strong> (a state tax on property transactions) and <strong>registration charges</strong>. These are one-time costs payable at the time of property registration.</p>
    <table>
        <thead>
            <tr><th>State</th><th>Stamp Duty (Male)</th><th>Stamp Duty (Female)</th><th>Registration</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Maharashtra</strong></td><td>5% (+ 1% metro cess in Mumbai)</td><td>5% (+ 1% metro cess)</td><td>1%</td></tr>
            <tr><td><strong>Delhi</strong></td><td>6% (Male), 4% (Female)</td><td>4%</td><td>1%</td></tr>
            <tr><td><strong>Karnataka</strong></td><td>5% + 1% surcharge</td><td>5% + 1% surcharge</td><td>1%</td></tr>
            <tr><td><strong>Tamil Nadu</strong></td><td>7%</td><td>7%</td><td>4%</td></tr>
            <tr><td><strong>Uttar Pradesh</strong></td><td>7% (Male), 6% (Female)</td><td>6%</td><td>1%</td></tr>
            <tr><td><strong>Gujarat</strong></td><td>4.9%</td><td>4.9%</td><td>1%</td></tr>
            <tr><td><strong>Rajasthan</strong></td><td>6% (Male), 4% (Female)</td><td>4%</td><td>1%</td></tr>
            <tr><td><strong>West Bengal</strong></td><td>6–8% (based on value)</td><td>6–8%</td><td>1%</td></tr>
            <tr><td><strong>Telangana</strong></td><td>5%</td><td>5%</td><td>0.5%</td></tr>
            <tr><td><strong>Kerala</strong></td><td>8%</td><td>8%</td><td>2%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Example — Mumbai:</strong> For an ₹80 lakh flat, stamp duty = ₹80L × 6% (5% + 1% metro cess) = ₹4,80,000. Registration = ₹80L × 1% = ₹80,000 (capped at ₹30,000 in some cases). <strong>Total: ~₹5.1 lakh</strong> just in taxes, before any interiors or moving costs.
    </div>

    <h2 id="pmay-subsidy">PMAY Subsidy — Pradhan Mantri Awas Yojana Guide</h2>
    <p>The <strong>PMAY (Pradhan Mantri Awas Yojana)</strong> scheme provides interest subsidies to eligible first-time homebuyers in India. Under PMAY Urban 2.0:</p>
    <table>
        <thead>
            <tr><th>Category</th><th>Annual Income</th><th>Subsidy Rate</th><th>Max Subsidy (₹)</th><th>Max Carpet Area</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>EWS</strong></td><td>Up to ₹3 lakh</td><td>4% on ₹8 lakh</td><td>₹2,67,000</td><td>60 sq.m</td></tr>
            <tr><td><strong>LIG</strong></td><td>₹3–6 lakh</td><td>4% on ₹8 lakh</td><td>₹2,67,000</td><td>60 sq.m</td></tr>
            <tr><td><strong>MIG-I</strong></td><td>₹6–12 lakh</td><td>3% on ₹9 lakh</td><td>₹2,35,000</td><td>160 sq.m</td></tr>
            <tr><td><strong>MIG-II</strong></td><td>₹12–18 lakh</td><td>3% on ₹12 lakh</td><td>₹2,30,000</td><td>200 sq.m</td></tr>
        </tbody>
    </table>
    <p><strong>Eligibility conditions:</strong> Applicant must not own a pucca house anywhere in India. The property must be the first residential property. Preference is given to EWS/LIG categories and female head of households.</p>

    <h2 id="documents-checklist">Home Loan Documents Checklist</h2>
    <p>Here's a comprehensive list of documents required for home loan application in India, organized by borrower type:</p>

    <h3>For Salaried Employees</h3>
    <ul>
        <li><strong>Identity Proof:</strong> PAN Card, Aadhaar Card, Voter ID, or Passport</li>
        <li><strong>Address Proof:</strong> Aadhaar, Utility bill, Passport, Rent agreement</li>
        <li><strong>Income Proof:</strong> Last 6 months salary slips, Form 16 (last 2 years), IT Returns (last 2 years)</li>
        <li><strong>Employment Proof:</strong> Appointment letter, HR declaration of designation and CTC</li>
        <li><strong>Bank Statements:</strong> Last 6–12 months of salary account statements</li>
        <li><strong>Property Documents:</strong> Sale agreement, Title deed, Approved building plan, NOC from society/builder, Encumbrance certificate</li>
        <li><strong>Personal:</strong> Passport-size photographs (6)</li>
    </ul>

    <h3>For Self-Employed / Business Owners</h3>
    <ul>
        <li>All of the above identity/address documents</li>
        <li><strong>Business Proof:</strong> GST registration, Business PAN, Partnership deed / MOA / AOA</li>
        <li><strong>Income Proof:</strong> IT Returns (last 3 years), CA-certified Profit & Loss statement, Balance sheet (last 3 years)</li>
        <li><strong>Bank Statements:</strong> Last 12 months of business account statements</li>
    </ul>

    <h2 id="fixed-vs-floating">Fixed vs Floating Interest Rate — Which to Choose?</h2>
    <p>In India, the vast majority (90%+) of home loans are <strong>floating rate</strong>, linked to the EBLR (External Benchmark Lending Rate) or MCLR. Here's a comparison:</p>
    <table>
        <thead>
            <tr><th>Parameter</th><th>Fixed Rate</th><th>Floating Rate</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Rate Movement</strong></td><td>Stays constant for 2–3 years, then may reset</td><td>Changes with RBI repo rate (quarterly)</td></tr>
            <tr><td><strong>Starting Rate</strong></td><td>1–2% higher than floating</td><td>Lowest available rate</td></tr>
            <tr><td><strong>EMI Certainty</strong></td><td>✅ Fixed for the initial period</td><td>❌ EMI can change</td></tr>
            <tr><td><strong>Prepayment Penalty</strong></td><td>May have penalty (up to 2%)</td><td>✅ Zero penalty (RBI mandate)</td></tr>
            <tr><td><strong>Best When</strong></td><td>Rates are at historic lows</td><td>Rates are expected to decrease</td></tr>
            <tr><td><strong>Availability</strong></td><td>Limited (few banks/NBFCs)</td><td>Universal</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>RBI Rule (Sep 2019):</strong> Banks cannot charge any prepayment or foreclosure penalty on <strong>floating rate</strong> home loans. This makes floating rate loans ideal for borrowers planning partial or full prepayments.
    </div>

    <h2 id="prepayment-strategy">How Prepayment Saves Lakhs — Strategy Guide</h2>
    <p>Making even small additional payments towards your home loan principal can save <strong>lakhs in interest</strong> and <strong>years of tenure</strong>. Here's the impact of different prepayment strategies on a ₹50 lakh, 8.5%, 20-year loan:</p>
    <table>
        <thead>
            <tr><th>Prepayment Strategy</th><th>Interest Saved</th><th>Tenure Reduced</th></tr>
        </thead>
        <tbody>
            <tr><td>₹1 lakh/year from Year 1</td><td>~₹15–18 lakh</td><td>~5–6 years</td></tr>
            <tr><td>₹50,000/year from Year 1</td><td>~₹9–11 lakh</td><td>~3–4 years</td></tr>
            <tr><td>One-time ₹5 lakh in Year 3</td><td>~₹5–7 lakh</td><td>~2–3 years</td></tr>
            <tr><td>One-time ₹10 lakh in Year 5</td><td>~₹8–10 lakh</td><td>~3–4 years</td></tr>
            <tr><td>One EMI extra per year</td><td>~₹12–14 lakh</td><td>~4–5 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> The best prepayment strategy is to <strong>pay one extra EMI every year</strong> (from your annual bonus or savings). On a ₹50 lakh loan, this single habit saves approximately ₹12–14 lakh in interest and cuts your 20-year loan to ~15 years. Use our <strong>Prepayment Impact</strong> mode above to see your exact savings.
    </div>

    <h2 id="eligibility-criteria">Home Loan Eligibility Criteria in India</h2>
    <p>Banks assess home loan eligibility based on several factors:</p>
    <table>
        <thead>
            <tr><th>Factor</th><th>Requirement</th><th>Impact</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>Age</strong></td><td>21–65 years (at maturity)</td><td>Younger = longer tenure allowed</td></tr>
            <tr><td><strong>CIBIL Score</strong></td><td>750+ for best rates</td><td>700–750: Higher rate (+0.25–0.5%); Below 700: May be rejected</td></tr>
            <tr><td><strong>FOIR</strong></td><td>Max 50–60% of income</td><td>Existing EMIs reduce eligible amount</td></tr>
            <tr><td><strong>LTV Ratio</strong></td><td>Up to 80% (≤₹30L), 75% (₹30–75L), 65% (>₹75L)</td><td>Higher property value = more down payment needed</td></tr>
            <tr><td><strong>Employment</strong></td><td>Min 2 years total, 6 months current</td><td>Salaried preferred; Self-employed needs 3+ years</td></tr>
            <tr><td><strong>Income</strong></td><td>No fixed minimum (bank-dependent)</td><td>Higher income = higher eligibility</td></tr>
        </tbody>
    </table>

    <h3>LTV (Loan-to-Value) Ratio — RBI Guidelines</h3>
    <p>The RBI mandates maximum LTV ratios based on loan amount:</p>
    <ul>
        <li><strong>Up to ₹30 lakh:</strong> Max 90% LTV (10% down payment)</li>
        <li><strong>₹30 lakh to ₹75 lakh:</strong> Max 80% LTV (20% down payment)</li>
        <li><strong>Above ₹75 lakh:</strong> Max 75% LTV (25% down payment)</li>
    </ul>
    <p>This means for a ₹1 crore property, you need a minimum down payment of <strong>₹25 lakh</strong>.</p>

    <h2 id="tenure-comparison">20 Years vs 30 Years — Total Cost Comparison</h2>
    <p>Choosing the right tenure is crucial. Here's how different tenures affect your total cost on a ₹50 lakh loan at 8.5%:</p>
    <table>
        <thead>
            <tr><th>Tenure</th><th>Monthly EMI</th><th>Total Interest</th><th>Total Amount</th></tr>
        </thead>
        <tbody>
            <tr><td><strong>10 years</strong></td><td>₹61,969</td><td>₹24.36 L</td><td>₹74.36 L</td></tr>
            <tr><td><strong>15 years</strong></td><td>₹49,246</td><td>₹38.64 L</td><td>₹88.64 L</td></tr>
            <tr><td><strong>20 years</strong></td><td>₹43,391</td><td>₹54.14 L</td><td>₹1.04 Cr</td></tr>
            <tr><td><strong>25 years</strong></td><td>₹40,261</td><td>₹70.78 L</td><td>₹1.21 Cr</td></tr>
            <tr><td><strong>30 years</strong></td><td>₹38,446</td><td>₹88.40 L</td><td>₹1.38 Cr</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>₹34.26 lakh difference:</strong> Going from 20 to 30 years saves ₹4,945/month in EMI but costs <strong>₹34.26 lakh MORE in total interest</strong>. Choose the shortest tenure you can comfortably afford.
    </div>

    <h2 id="common-mistakes">7 Common Mistakes to Avoid When Taking a Home Loan</h2>
    <ol>
        <li><strong>Not comparing banks:</strong> A 0.5% rate difference on ₹50 lakh over 20 years = ₹3–4 lakh in savings. Always get quotes from at least 3 banks.</li>
        <li><strong>Ignoring processing fees:</strong> Banks charge 0.25–1% of loan amount as processing fees. On ₹50 lakh, that's ₹12,500–₹50,000. Negotiate or look for waivers.</li>
        <li><strong>Choosing 30-year tenure by default:</strong> Longer tenure = lower EMI but drastically higher total cost (see comparison above).</li>
        <li><strong>Not checking CIBIL before applying:</strong> Multiple loan rejections hurt your score. Check your CIBIL first and improve it if below 700.</li>
        <li><strong>Forgetting about hidden costs:</strong> Budget for stamp duty (4–8%), registration (1%), legal charges (₹5,000–₹15,000), GST on under-construction (5%), and society transfer fees.</li>
        <li><strong>Skipping home loan insurance:</strong> While not mandatory, a term plan covering the loan amount protects your family if something happens to you.</li>
        <li><strong>Not prepaying when possible:</strong> Every ₹1 lakh prepaid in the first 5 years saves ₹1.5–2 lakh in interest. Use your bonus, increments, and windfalls for prepayment.</li>
    </ol>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/fuel-cost-calculator">Fuel Cost Calculator India</a></strong> — Calculate your daily commute costs after moving to your new home's location.</li>
        <li><strong><a href="/utility-calculators/compound-interest-calculator">Compound Interest Calculator</a></strong> — Plan your down payment savings with compound interest growth.</li>
        <li><strong><a href="/math-calculators/percentage-calculator">Percentage Calculator</a></strong> — Calculate stamp duty, registration charges, and rate differences between banks.</li>
        <li><strong><a href="/math-calculators/percentage-increase-calculator">Percentage Increase Calculator</a></strong> — Track how much property prices have increased in your city.</li>
    </ul>
`;

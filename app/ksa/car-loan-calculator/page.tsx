// Standalone page — /ksa/car-loan-calculator
// KSA Car Loan Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Car Loan Calculator (KSA) — Saudi Auto Financing",
    description: "Calculate your monthly car installment in Saudi Arabia. Covers Murabaha, Ijara, and balloon payments. SAMA 60-month limit with DTI check and bank comparison.",
    keywords: ["Saudi car loan calculator", "KSA auto financing", "حاسبة تمويل السيارات", "Murabaha auto", "Ijara car", "Al Rajhi car loan", "Saudi vehicle financing", "car installment Saudi"],
    alternates: { canonical: canonicalUrl("/ksa/car-loan-calculator") },
};

const FAQ_ITEMS = [
    { question: "How does car financing work in Saudi Arabia?", answer: "Saudi car financing is Sharia-compliant. Banks use Murabaha (cost-plus — bank buys the car and sells to you at a markup with fixed installments) or Ijara (lease-to-own — bank buys and leases to you, ownership transfers at end). Both avoid interest (riba). The maximum tenure is 60 months (5 years) per SAMA regulations." },
    { question: "What is the maximum car loan tenure in Saudi Arabia?", answer: "SAMA (Saudi Central Bank) limits all non-real-estate financing to a maximum of 60 months (5 years). This applies to car loans from banks and licensed finance companies. Some providers offer shorter tenures of 12-48 months." },
    { question: "What is the minimum down payment for a car loan?", answer: "Down payments range from 0% to 20% depending on the provider: Al Rajhi Bank offers 0% down for salary-transfer customers; most banks require 10-20%; used car financing typically requires higher down payments (10-30%). Zero down payment options usually come with higher profit rates." },
    { question: "What is the minimum salary for car financing?", answer: "Minimum salary requirements range from SAR 3,000 to SAR 5,000 per month: Al Rajhi Bank — SAR 1,900 (Auto Murabaha) to SAR 4,000; Abdul Latif Jameel — SAR 3,000; Bank Albilad — SAR 4,500; Most banks — SAR 5,000 without salary transfer. Both Saudi nationals and expatriates are eligible." },
    { question: "What are typical car loan profit rates in Saudi Arabia?", answer: "As of 2025: New vehicles — 3.5% to 5.5% APR. Used vehicles — 4% to 7% APR. Al Rajhi offers ~3.99%, SNB ~4.25%, ALJ Finance ~4.75%, Emirates NBD ~5.51%. The actual rate depends on your credit score (SIMAH), salary level, and whether you transfer your salary to the financing bank." },
    { question: "What is a balloon payment?", answer: "A balloon payment is a large lump-sum payment due at the end of your financing tenure. It reduces your monthly installments by deferring part of the cost. Maximum balloon: Al Rajhi 25%, SNB 40%, ALJ Finance 45%. For example, on a SAR 120,000 car with 25% balloon = SAR 30,000 final payment, with lower monthly installments on the remaining SAR 90,000." },
    { question: "Can I finance a used car in Saudi Arabia?", answer: "Yes. Both banks and finance companies offer used car financing. Key differences from new: higher APR (4-7% vs 3.5-5.5%), typically max 5-7 years old, higher down payment required (10-30%), may have maximum mileage limits. Al Rajhi finances used cars up to 2019 models. ALJ Finance includes warranty for used vehicles." },
    { question: "What is Murabaha auto financing?", answer: "Murabaha (مرابحة) is cost-plus financing: the bank buys the car from the dealer, then sells it to you at a higher price (cost + agreed profit margin). Key features: car is registered in your name immediately, fixed monthly payments for the entire tenure, total cost agreed upfront and cannot change. This is the most common auto financing product in Saudi Arabia." },
    { question: "What is Ijara auto financing?", answer: "Ijara (إجارة) is lease-to-own: the bank buys the car and leases it to you. You pay monthly rent that includes a purchase component. The car remains in the bank's name during the lease. At the end, you either pay a final amount (balloon/residual) to own it or return the car. Ijara can have variable rates and is popular for those who want flexibility." },
    { question: "Is car insurance mandatory with financing?", answer: "Yes. Comprehensive insurance is mandatory for all financed vehicles in Saudi Arabia. The insurance covers the vehicle throughout the financing tenure. Some banks include insurance in the financing package, while others require you to arrange it separately. Insurance cost is typically 5-8% of the vehicle value per year." },
    { question: "What is the DTI limit for car loans?", answer: "Banks generally prefer a Debt-to-Income (DTI) ratio where total monthly debt payments don't exceed 50% of your net salary (some guidelines say 33-40%). If you have an existing mortgage or other loans, the car installment is added to your total monthly debt for the DTI calculation." },
    { question: "What documents do I need for car financing?", answer: "Required documents: National ID (Saudi) or Iqama (expat), salary certificate from employer, bank statements (last 3-6 months), SIMAH credit report authorization, employment contract, proof of down payment (if applicable). Expatriates may need a longer employment history (6+ months) and valid Iqama." },
    { question: "Can I pay off my car loan early?", answer: "Yes. Under SAMA regulations, early repayment is allowed. The penalty is capped at three months of profit or the remaining profit, whichever is less. Some banks offer promotional zero early repayment fees. Paying early can save significant profit costs, especially in the first years when the profit component of payments is highest." },
    { question: "How does SIMAH affect my car loan?", answer: "SIMAH is Saudi Arabia's credit bureau. A score of 700+ significantly improves approval chances and may qualify you for lower rates. Late payments, defaults, and high existing debt levels will lower your score. Banks check SIMAH before approving any financing. You can check your SIMAH score online at simah.com to improve your chances before applying." },
    { question: "Should I buy or lease a car in Saudi Arabia?", answer: "It depends on your needs: Buy (Murabaha) — car is yours immediately, builds equity, fixed payments, best for long-term ownership. Lease (Ijara) — lower monthly payments, can return car at end, good for those who change cars frequently, may have variable rates. Consider total cost over the tenure, insurance, and maintenance when comparing." },
];

export default function CarLoanPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Car Loan Calculator" },
        ]),
        webAppSchema("Car Loan Calculator (KSA)", canonicalUrl("/ksa/car-loan-calculator")),
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
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Car Loan Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Car Loan Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your monthly car installment in Saudi Arabia. Sharia-compliant Murabaha and Ijara with SAMA 60-month tenure limit and DTI check.
            </p>
            <AuthorBadge categoryKey="salary" />
            <KSACalculatorCore calcType="carloan" />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Car Loan FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/home-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏠</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Home Loan Calculator</div>
                            <div className="ksa-related-link__desc">Compare car vs home financing</div>
                        </div>
                    </Link>
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net salary for DTI</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">Banks verify employment via GOSI</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator (15%)</div>
                            <div className="ksa-related-link__desc">Calculate VAT on vehicle purchases</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="car-financing">Car Financing in Saudi Arabia</h2>
    <p><strong>Car financing (تمويل السيارات)</strong> is one of the most active segments of Saudi Arabia's consumer finance market. With over <strong>68 licensed finance companies</strong> as of September 2025 and all major banks offering auto financing products, Saudi residents have a wide range of Sharia-compliant options to finance both new and used vehicles.</p>
    <p>All auto financing in the Kingdom is regulated by the <strong>Saudi Central Bank (SAMA)</strong> and must comply with <strong>Islamic finance principles</strong> — using profit-based structures instead of interest (riba).</p>

    <h2 id="products">Sharia-Compliant Auto Financing Products</h2>
    <table>
        <thead><tr><th>Product</th><th>How It Works</th><th>Rate</th><th>Ownership</th></tr></thead>
        <tbody>
            <tr><td><strong>Murabaha</strong></td><td>Bank buys car, sells to you at cost + profit margin</td><td>Fixed</td><td>Yours immediately</td></tr>
            <tr><td><strong>Ijara</strong></td><td>Bank buys car, leases to you. Own at end of lease</td><td>Can be variable</td><td>At lease end</td></tr>
        </tbody>
    </table>

    <h3 id="murabaha-auto">Murabaha — Cost-Plus Auto Financing</h3>
    <p><strong>Murabaha (مرابحة)</strong> is the most popular auto financing product in Saudi Arabia:</p>
    <ul>
        <li><strong>Car registered in your name</strong> from the start</li>
        <li><strong>Fixed monthly installments</strong> — predictable budgeting</li>
        <li><strong>Total cost agreed upfront</strong> — cannot increase</li>
        <li>No concerns about residual value — you own the car outright</li>
        <li>Available from all major Saudi banks</li>
    </ul>

    <h3 id="ijara-auto">Ijara — Lease-to-Own</h3>
    <p><strong>Ijara (إجارة)</strong> is the lease-to-own alternative:</p>
    <ul>
        <li>Car <strong>remains in the bank's name</strong> during the lease</li>
        <li>Monthly payments may <strong>fluctuate</strong> if variable rate</li>
        <li>At lease end: pay final amount (balloon) to own, or <strong>return the car</strong></li>
        <li><strong>Lower monthly payments</strong> with balloon option</li>
        <li>Good for those who <strong>change cars frequently</strong></li>
    </ul>

    <h2 id="sama-rules">SAMA Regulations for Auto Financing</h2>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Maximum Tenure</strong></td><td>60 months (5 years) — non-real-estate limit</td></tr>
            <tr><td><strong>DTI Recommendation</strong></td><td>Total monthly debt ≤ 50% of net salary</td></tr>
            <tr><td><strong>Early Repayment</strong></td><td>Penalty capped at 3 months' profit or remaining profit (lesser)</td></tr>
            <tr><td><strong>Insurance</strong></td><td>Comprehensive insurance mandatory throughout</td></tr>
            <tr><td><strong>Balloon Max</strong></td><td>25–45% depending on bank (subject to terms)</td></tr>
            <tr><td><strong>Supervision</strong></td><td>68 licensed finance companies as of Sep 2025</td></tr>
        </tbody>
    </table>

    <h2 id="formula">Monthly Installment Formula</h2>
    <div class="explanation__highlight">
        <strong>M = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> – 1]</strong><br/><br/>
        Where:<br/>
        M = Monthly installment<br/>
        P = Financing amount (vehicle price − down payment)<br/>
        r = Monthly profit rate (annual rate ÷ 12 ÷ 100)<br/>
        n = Total number of months
    </div>

    <h2 id="worked-examples">Worked Examples</h2>
    <h3>Example 1: New Toyota Camry — SAR 120,000</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Vehicle Price</td><td>SAR 120,000</td></tr>
            <tr><td>Down Payment (10%)</td><td>SAR 12,000</td></tr>
            <tr><td>Financing Amount</td><td>SAR 108,000</td></tr>
            <tr><td>APR</td><td>4.5%</td></tr>
            <tr><td>Tenure</td><td>60 months</td></tr>
            <tr><td><strong>Monthly Installment</strong></td><td><strong>≈ SAR 2,014</strong></td></tr>
            <tr><td>Total Cost</td><td>SAR 120,840</td></tr>
            <tr><td>Total Profit Paid</td><td>SAR 12,840</td></tr>
        </tbody>
    </table>

    <h3>Example 2: Used Car — SAR 60,000, Higher Rate</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Vehicle Price</td><td>SAR 60,000</td></tr>
            <tr><td>Down Payment (20%)</td><td>SAR 12,000</td></tr>
            <tr><td>Financing Amount</td><td>SAR 48,000</td></tr>
            <tr><td>APR</td><td>6%</td></tr>
            <tr><td>Tenure</td><td>48 months</td></tr>
            <tr><td><strong>Monthly Installment</strong></td><td><strong>≈ SAR 1,128</strong></td></tr>
            <tr><td>Total Cost</td><td>SAR 54,144</td></tr>
            <tr><td>Total Profit Paid</td><td>SAR 6,144</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Impact of Tenure Length</h3>
    <p>Same car: SAR 120K, 10% down, 4.5% APR — different tenures:</p>
    <table>
        <thead><tr><th>Tenure</th><th>Monthly</th><th>Total Profit</th></tr></thead>
        <tbody>
            <tr><td>24 months</td><td>SAR 4,715</td><td>SAR 5,160</td></tr>
            <tr><td>36 months</td><td>SAR 3,211</td><td>SAR 7,596</td></tr>
            <tr><td>48 months</td><td>SAR 2,462</td><td>SAR 10,176</td></tr>
            <tr><td>60 months</td><td>SAR 2,014</td><td>SAR 12,840</td></tr>
        </tbody>
    </table>

    <h2 id="new-vs-used">New vs Used Vehicle Financing</h2>
    <table>
        <thead><tr><th>Feature</th><th>New Vehicle</th><th>Used Vehicle</th></tr></thead>
        <tbody>
            <tr><td><strong>Typical APR</strong></td><td>3.5–5.5%</td><td>4–7%</td></tr>
            <tr><td><strong>Max Tenure</strong></td><td>60 months</td><td>48–60 months</td></tr>
            <tr><td><strong>Down Payment</strong></td><td>0–20%</td><td>10–30%</td></tr>
            <tr><td><strong>Insurance</strong></td><td>Comprehensive (mandatory)</td><td>Comprehensive (mandatory)</td></tr>
            <tr><td><strong>Vehicle Age Limit</strong></td><td>Current year models</td><td>5–7 years old max</td></tr>
            <tr><td><strong>Mileage Limit</strong></td><td>N/A</td><td>May apply (bank-specific)</td></tr>
            <tr><td><strong>Warranty</strong></td><td>Manufacturer warranty</td><td>ALJ offers 3yr/60K km</td></tr>
        </tbody>
    </table>

    <h2 id="balloon">Balloon Payments Explained</h2>
    <p>A <strong>balloon payment</strong> is a large lump-sum due at the end of your financing tenure. It reduces monthly installments but increases total cost:</p>
    <table>
        <thead><tr><th>Bank</th><th>Max Balloon</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td><strong>Al Rajhi Bank</strong></td><td>25%</td><td>Different for salary vs non-salary transfer</td></tr>
            <tr><td><strong>Saudi National Bank (SNB)</strong></td><td>40%</td><td>50/50 programs may differ</td></tr>
            <tr><td><strong>Abdul Latif Jameel</strong></td><td>45%</td><td>Commonly used with Toyota</td></tr>
        </tbody>
    </table>

    <h2 id="providers">Saudi Auto Financing Providers</h2>
    <table>
        <thead><tr><th>Provider</th><th>APR (New)</th><th>Down Payment</th><th>Min Salary</th><th>Max Tenure</th></tr></thead>
        <tbody>
            <tr><td><strong>Al Rajhi Bank</strong></td><td>~3.99%</td><td>0–10%</td><td>SAR 1,900–4,000</td><td>60 months</td></tr>
            <tr><td><strong>Saudi National Bank</strong></td><td>~4.25%</td><td>10–20%</td><td>SAR 5,000</td><td>60 months</td></tr>
            <tr><td><strong>Bank Albilad</strong></td><td>~4.50%</td><td>10%</td><td>SAR 4,500</td><td>60 months</td></tr>
            <tr><td><strong>Abdul Latif Jameel</strong></td><td>~4.75%</td><td>10–20%</td><td>SAR 3,000</td><td>60 months</td></tr>
            <tr><td><strong>Emirates NBD</strong></td><td>~5.51%</td><td>20%</td><td>SAR 5,000</td><td>60 months</td></tr>
            <tr><td><strong>Tasheel Finance</strong></td><td>~5.00%</td><td>15–20%</td><td>SAR 3,000</td><td>60 months</td></tr>
        </tbody>
    </table>

    <h2 id="eligibility">Eligibility Requirements</h2>
    <ul>
        <li><strong>Age:</strong> 21–60 years (up to 65 for government employees)</li>
        <li><strong>Nationality:</strong> Saudi nationals and expatriates with valid Iqama</li>
        <li><strong>Employment:</strong> 3–6 months minimum (longer for expats)</li>
        <li><strong>Credit Score:</strong> SIMAH score of 700+ recommended</li>
        <li><strong>Salary:</strong> SAR 3,000–5,000 minimum (bank-dependent)</li>
    </ul>

    <h2 id="documents">Required Documents</h2>
    <ul>
        <li><strong>National ID</strong> (Saudi) or <strong>Iqama</strong> (expatriate)</li>
        <li><strong>Salary certificate</strong> from employer</li>
        <li><strong>Bank statements</strong> (last 3-6 months)</li>
        <li><strong>SIMAH authorization</strong> (credit bureau check)</li>
        <li><strong>Employment contract</strong></li>
        <li>Vehicle quotation from dealer (for new cars)</li>
    </ul>

    <h2 id="related">How Other KSA Calculators Help</h2>
    <table>
        <thead><tr><th>Calculator</th><th>How It Helps with Car Buying</th></tr></thead>
        <tbody>
            <tr><td><a href="/ksa/salary-calculator"><strong>Salary Calculator</strong></a></td><td>Calculate net salary for DTI assessment</td></tr>
            <tr><td><a href="/ksa/home-loan-calculator"><strong>Home Loan Calculator</strong></a></td><td>Compare car vs home financing costs</td></tr>
            <tr><td><a href="/ksa/gosi-calculator"><strong>GOSI Calculator</strong></a></td><td>Banks verify employment via GOSI records</td></tr>
            <tr><td><a href="/ksa/vat-calculator"><strong>VAT Calculator</strong></a></td><td>Calculate 15% VAT on vehicle purchase</td></tr>
        </tbody>
    </table>
`;

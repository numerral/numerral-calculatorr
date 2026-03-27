// Standalone page — /ksa/personal-loan-calculator
// KSA Personal Loan EMI Calculator with SAMA compliance content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PersonalLoanCalculatorCore from "@/components/calculator/PersonalLoanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Personal Loan Calculator (KSA) — حاسبة التمويل الشخصي (2025/2026)",
    description: "Calculate your personal loan EMI in Saudi Arabia. Includes SAMA DBR compliance check (33.33%), amortization schedule, processing fees with VAT, and bank rate comparison. Covers Tawarruq, Murabaha, SIMAH credit score, eligibility requirements, and early settlement rules.",
    keywords: ["personal loan calculator Saudi Arabia", "حاسبة التمويل الشخصي", "EMI calculator KSA", "SAMA DBR limit", "personal finance Saudi", "Tawarruq financing", "SIMAH credit score", "best personal loan Saudi", "loan without salary transfer", "Islamic finance calculator", "Al Rajhi personal loan", "SABB personal finance"],
    alternates: { canonical: canonicalUrl("/ksa/personal-loan-calculator") },
};

const FAQ_ITEMS = [
    { question: "How is personal loan EMI calculated in Saudi Arabia?", answer: "EMI (Equal Monthly Installment) is calculated using the standard annuity formula: EMI = P × [r(1+r)^n] / [(1+r)^n − 1], where P is the finance amount, r is the monthly profit rate (APR ÷ 12), and n is the tenure in months. For example, SAR 100,000 at 5% APR over 60 months gives an EMI of approximately SAR 1,887. In Saudi Arabia, 'profit rate' is used instead of 'interest rate' as all personal financing is Sharia-compliant." },
    { question: "What is the SAMA DBR (Debt Burden Ratio) limit?", answer: "SAMA (Saudi Central Bank) limits monthly debt obligations deducted from salary to 33.33% of gross salary for employees and 25% for retirees. For individuals earning SAR 15,000–25,000, total monthly obligations (excluding real estate) can go up to 45% of total income. For those benefiting from MoH/REDF housing programs, the limit extends to 65% of total income." },
    { question: "What is Tawarruq financing?", answer: "Tawarruq (التورق) is the most common Islamic financing method for personal loans in Saudi Arabia. The bank buys a commodity (typically metals) and sells it to you at a markup on deferred payment. You then immediately sell that commodity to a third party for cash at the spot price. This gives you cash liquidity while keeping the transaction Sharia-compliant through tangible asset involvement." },
    { question: "What is the maximum personal loan tenure in Saudi Arabia?", answer: "SAMA regulations set the maximum personal loan tenure at 60 months (5 years) for standard personal finance. This applies to all banks and finance companies in the Kingdom. Some banks may offer shorter maximum tenures for non-salary transfer products or expatriate customers." },
    { question: "What is the minimum salary for a personal loan in Saudi Arabia?", answer: "Minimums vary by bank and nationality. For Saudi nationals: SAR 2,000–5,000 depending on the bank (government sector often has lower requirements). For expatriates: SAR 5,000–8,000 typically. Al Rajhi requires SAR 2,000 for Saudis and SAR 5,000 for expats. SABB and Riyad Bank typically require SAR 5,000+ for Saudis and SAR 8,000+ for expats." },
    { question: "Can I get a personal loan without salary transfer in Saudi Arabia?", answer: "Yes, but at significantly higher profit rates. For example, SABB offers personal finance with salary transfer at ~3.21% APR but without salary transfer at ~19.11% APR. Banks view non-salary-transfer loans as higher risk. To qualify without salary transfer, you typically need a higher salary, longer employment history, and a stronger SIMAH credit score." },
    { question: "What is the early settlement penalty for personal loans in KSA?", answer: "SAMA has capped early repayment compensation at a maximum of 3 months' interest (profit) on the outstanding balance at the time of settlement. Banks cannot charge any additional fees or penalties beyond this cap. This rule encourages borrowers to refinance at better rates when available." },
    { question: "What is SIMAH and how does it affect my loan?", answer: "SIMAH (سمة) is Saudi Arabia's credit bureau. It collects credit data from banks, finance companies, telcos, and utilities. Your SIMAH credit score ranges from 300–850. Scores above 700 are considered good, above 750 is excellent. Key factors: payment history (35%), credit utilization (30%), credit history length, and recent inquiries. A higher score means better rates and higher approved amounts." },
    { question: "What documents do I need for a personal loan in Saudi Arabia?", answer: "Typically required: (1) valid National ID (Saudi) or Iqama with 2+ years remaining validity (expat), (2) salary certificate from employer (issued within last 3 months), (3) bank statements for last 3–6 months, (4) employer introduction letter showing salary and start date, (5) GOSI certificate, (6) salary assignment letter in favor of the bank, (7) proof of residence (utility bill or tenancy contract)." },
    { question: "How much processing fee do banks charge in Saudi Arabia?", answer: "SAMA regulations cap processing fees at 1% of the finance amount or SAR 5,000 — whichever is lower. This fee is also subject to 15% VAT. For example, on a SAR 200,000 loan: processing fee = SAR 2,000 (1%) + SAR 300 (15% VAT) = SAR 2,300 total. Some banks may charge less than the SAMA cap." },
    { question: "What profit rates do Saudi banks offer for personal loans?", answer: "Indicative APR rates (2025/2026) with salary transfer: Al Rajhi from 3.07%, SABB from 3.21%, SNB varies by profile, Riyad Bank from 2–4% depending on tenure. Rates without salary transfer are significantly higher (e.g., SABB at 19.11%). Actual rates depend on salary, employer, SIMAH score, tenure, and loan amount. Always get personalized quotes from multiple banks." },
    { question: "What is the difference between Murabaha and Tawarruq?", answer: "Both are Sharia-compliant financing structures. Murabaha (المرابحة) is used to finance a specific asset — the bank buys the asset and sells it to you at cost + agreed profit. Most common for auto and home financing. Tawarruq (التورق) provides cash — the bank buys a commodity and sells it to you at markup, then you sell the commodity to a third party for cash. Most common for personal finance (cash loans)." },
];

export default function PersonalLoanPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Personal Loan Calculator" },
        ]),
        webAppSchema("Personal Loan Calculator (KSA — حاسبة التمويل الشخصي)", canonicalUrl("/ksa/personal-loan-calculator")),
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
            <Script id="schema-personal-loan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Personal Loan Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Personal Loan Calculator (KSA) — حاسبة التمويل الشخصي</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your personal finance EMI, total cost, and SAMA Debt Burden Ratio compliance. Includes processing fees, VAT, amortization schedule, and bank rate comparison for Saudi Arabia.
            </p>
            <AuthorBadge categoryKey="salary" />
            <PersonalLoanCalculatorCore />

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Personal Loan FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Calculate net salary for DBR check</div>
                        </div>
                    </Link>
                    <Link href="/ksa/home-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏠</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Home Loan Calculator</div>
                            <div className="ksa-related-link__desc">Mortgage counts towards your DBR</div>
                        </div>
                    </Link>
                    <Link href="/ksa/car-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🚗</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Car Loan Calculator</div>
                            <div className="ksa-related-link__desc">Auto installments affect loan eligibility</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">GOSI deductions reduce take-home pay</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator</div>
                            <div className="ksa-related-link__desc">15% VAT applies to processing fees</div>
                        </div>
                    </Link>
                    <Link href="/ksa/zakat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🕌</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Zakat Calculator</div>
                            <div className="ksa-related-link__desc">Loan installments may reduce Zakat base</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-personal-finance">What Is Personal Finance in Saudi Arabia?</h2>
    <p>In Saudi Arabia, what is commonly called a "personal loan" globally is known as <strong>personal finance (التمويل الشخصي)</strong>. All personal lending in the Kingdom is <strong>Sharia-compliant</strong> — traditional interest-based loans do not exist in the Saudi banking system.</p>
    <p>Instead, banks and financial institutions use Islamic financing structures — primarily <strong>Tawarruq</strong> and <strong>Murabaha</strong> — to provide cash liquidity to individuals. The <strong>Saudi Central Bank (SAMA — البنك المركزي السعودي)</strong> regulates all personal financing, setting rules on maximum tenure, profit rates disclosure, debt-to-income ratios, and consumer protection.</p>
    <div class="explanation__highlight">
        <strong>Key Fact:</strong> Saudi Arabia has a 0% personal income tax rate. This means your gross salary is also your net salary (minus GOSI deductions). Banks calculate your loan eligibility based on your <strong>gross salary</strong>, making the affordability calculation simpler than in countries with income tax.
    </div>

    <h2 id="tawarruq-vs-murabaha">Tawarruq vs Murabaha — Islamic Financing Explained</h2>
    <p>Understanding these two structures is essential for any personal finance decision in KSA:</p>

    <h3>Tawarruq (التورق) — Cash Finance</h3>
    <p>The most common method for personal finance (cash loans) in Saudi Arabia:</p>
    <ol>
        <li>The bank purchases a <strong>commodity</strong> (e.g., metals, platinum) from the market</li>
        <li>The bank sells the commodity to you at <strong>cost + agreed profit margin</strong> on a deferred payment basis</li>
        <li>You immediately authorize the bank to sell the commodity to a <strong>third-party buyer</strong> at the current market (spot) price</li>
        <li>You receive <strong>cash</strong> from the sale — this is your "loan amount"</li>
        <li>You repay the bank in <strong>monthly installments</strong> over the agreed tenure</li>
    </ol>
    <div class="explanation__highlight">
        <strong>Why Tawarruq is Sharia-compliant:</strong> The transaction involves <em>real, tangible assets</em> (commodities) rather than lending money directly at interest. The bank earns a profit from the markup on the commodity sale, which is a legitimate trade transaction in Islamic law.
    </div>

    <h3>Murabaha (المرابحة) — Asset Finance</h3>
    <p>More common for <strong>auto loans</strong> and <strong>home purchases</strong>:</p>
    <ol>
        <li>You identify a specific asset you want to buy (car, property, equipment)</li>
        <li>The bank purchases the asset on your behalf</li>
        <li>The bank sells the asset to you at <strong>cost + agreed profit margin</strong></li>
        <li>You pay in <strong>monthly installments</strong></li>
    </ol>
    <table>
        <thead><tr><th>Feature</th><th>Tawarruq (التورق)</th><th>Murabaha (المرابحة)</th></tr></thead>
        <tbody>
            <tr><td><strong>Purpose</strong></td><td>Cash liquidity</td><td>Specific asset purchase</td></tr>
            <tr><td><strong>Common Use</strong></td><td>Personal finance, debt consolidation</td><td>Auto loans, home financing</td></tr>
            <tr><td><strong>Customer Gets</strong></td><td>Cash (SAR)</td><td>The asset itself</td></tr>
            <tr><td><strong>Underlying Asset</strong></td><td>Commodities (metals)</td><td>The purchased asset</td></tr>
        </tbody>
    </table>

    <h2 id="emi-formula">How to Calculate Your EMI — Formula & Worked Example</h2>
    <p>EMI (Equal Monthly Installment) follows the standard annuity formula:</p>
    <div class="explanation__highlight">
        <strong>EMI = P × [r(1+r)<sup>n</sup>] / [(1+r)<sup>n</sup> − 1]</strong><br/><br/>
        Where:<br/>
        <strong>P</strong> = Finance amount (principal) in SAR<br/>
        <strong>r</strong> = Monthly profit rate = APR ÷ 12 ÷ 100<br/>
        <strong>n</strong> = Number of monthly installments (tenure)
    </div>

    <h3>Example: SAR 200,000 at 5% APR over 48 months</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Finance Amount (P)</td><td>SAR 200,000</td></tr>
            <tr><td>APR</td><td>5%</td></tr>
            <tr><td>Monthly Rate (r)</td><td>5% ÷ 12 = 0.4167%</td></tr>
            <tr><td>Tenure (n)</td><td>48 months</td></tr>
            <tr><td><strong>Monthly EMI</strong></td><td><strong>SAR 4,606</strong></td></tr>
            <tr><td>Total Repayment</td><td>SAR 221,088</td></tr>
            <tr><td>Total Profit Paid</td><td>SAR 21,088</td></tr>
            <tr><td>Processing Fee (1%)</td><td>SAR 2,000 + SAR 300 VAT = SAR 2,300</td></tr>
            <tr><td><strong>Effective Total Cost</strong></td><td><strong>SAR 23,388</strong></td></tr>
        </tbody>
    </table>

    <h2 id="sama-dbr">SAMA Debt Burden Ratio (DBR) Rules</h2>
    <p>SAMA's Responsible Lending Principles set strict limits on how much of your salary can go towards debt repayment:</p>
    <table>
        <thead><tr><th>Income Bracket</th><th>Employee Limit</th><th>Retiree Limit</th><th>Notes</th></tr></thead>
        <tbody>
            <tr><td>Any salary (deduction-based)</td><td><strong>33.33%</strong> of gross salary</td><td><strong>25%</strong> of pension</td><td>Core rule for all salary-linked financing</td></tr>
            <tr><td>SAR 15,000–25,000/month</td><td><strong>45%</strong> of total income</td><td>—</td><td>Excluding real estate finance</td></tr>
            <tr><td>SAR 25,000+/month</td><td>33.33% deduction</td><td>25%</td><td>Standard deduction still applies</td></tr>
            <tr><td>Real estate + MoH/REDF</td><td><strong>65%</strong> of total income</td><td>—</td><td>Housing subsidy special cap</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>DBR Example:</strong> Monthly salary = SAR 15,000<br/>
        Max deduction = SAR 15,000 × 33.33% = <strong>SAR 5,000</strong><br/>
        If you have an existing car loan EMI of SAR 2,000:<br/>
        Remaining for new loan = SAR 5,000 − SAR 2,000 = <strong>SAR 3,000</strong><br/>
        At 5% APR over 60 months, this affords ≈ <strong>SAR 158,000</strong> personal finance.
    </div>

    <h2 id="simah">SIMAH Credit Score — Your Financial Passport</h2>
    <p><strong>SIMAH (سمة)</strong> is Saudi Arabia's credit bureau, collecting data from banks, finance companies, telcos, and utilities. Your credit score determines your loan eligibility, approved amounts, and profit rates.</p>
    <table>
        <thead><tr><th>Score Range</th><th>Rating</th><th>Loan Impact</th></tr></thead>
        <tbody>
            <tr><td><strong>750–850</strong></td><td>Excellent</td><td>Best rates, highest amounts, instant approval</td></tr>
            <tr><td><strong>700–749</strong></td><td>Very Good</td><td>Competitive rates, quick approval</td></tr>
            <tr><td><strong>650–699</strong></td><td>Good</td><td>Standard rates, approval likely</td></tr>
            <tr><td><strong>600–649</strong></td><td>Fair</td><td>Higher rates, may need guarantees</td></tr>
            <tr><td><strong>300–599</strong></td><td>Poor</td><td>Likely declined or very limited amounts</td></tr>
        </tbody>
    </table>
    <p><strong>Score factors:</strong> Payment history (35%), credit utilization (30%), credit history length, recent inquiries, and credit mix. Updated monthly by SIMAH.</p>

    <h2 id="eligibility">Eligibility Requirements — Saudi vs. Expat</h2>
    <table>
        <thead><tr><th>Requirement</th><th>Saudi Nationals</th><th>Expatriates</th></tr></thead>
        <tbody>
            <tr><td><strong>Min Age</strong></td><td>21 years</td><td>21–23 years</td></tr>
            <tr><td><strong>Max Age at Maturity</strong></td><td>60–65 years</td><td>60 years</td></tr>
            <tr><td><strong>Min Salary</strong></td><td>SAR 2,000–5,000</td><td>SAR 5,000–8,000</td></tr>
            <tr><td><strong>Min Employment</strong></td><td>1–3 months</td><td>3–12 months</td></tr>
            <tr><td><strong>Iqama Validity</strong></td><td>N/A</td><td>Min 2 years beyond maturity</td></tr>
            <tr><td><strong>SIMAH</strong></td><td>Required — no defaults</td><td>Required — stricter check</td></tr>
            <tr><td><strong>Salary Transfer</strong></td><td>Preferred (lower rates)</td><td>Often required</td></tr>
        </tbody>
    </table>

    <h2 id="bank-comparison">Bank Comparison — Personal Finance Rates (2025/2026)</h2>
    <p>Indicative rates with salary transfer — actual rates depend on your profile:</p>
    <table>
        <thead><tr><th>Bank</th><th>Min APR</th><th>Max Amount</th><th>Max Tenure</th><th>Min Salary (Saudi)</th><th>Min Salary (Expat)</th></tr></thead>
        <tbody>
            <tr><td><strong>Al Rajhi</strong></td><td>3.07%</td><td>SAR 2.5M</td><td>60 mo</td><td>SAR 2,000</td><td>SAR 5,000</td></tr>
            <tr><td><strong>SABB</strong></td><td>3.21%</td><td>—</td><td>60 mo</td><td>~SAR 5,000</td><td>~SAR 8,000</td></tr>
            <tr><td><strong>Riyad Bank</strong></td><td>~2–4%</td><td>—</td><td>60 mo</td><td>SAR 5,000</td><td>SAR 8,000</td></tr>
            <tr><td><strong>SNB</strong></td><td>Varies</td><td>—</td><td>60 mo</td><td>~SAR 3,000</td><td>~SAR 5,000</td></tr>
            <tr><td><strong>Alinma</strong></td><td>Varies</td><td>—</td><td>60 mo</td><td>SAR 3,000</td><td>~SAR 5,000</td></tr>
            <tr><td><strong>Tasheel</strong></td><td>Varies</td><td>—</td><td>60 mo</td><td>SAR 4,000</td><td>SAR 5,000</td></tr>
        </tbody>
    </table>
    <p><em>Disclaimer: Rates shown are indicative and based on publicly available information. Actual rates depend on individual credit profile, salary, employer, and bank assessment. Always get a personalized quote.</em></p>

    <h2 id="salary-transfer">Salary Transfer vs. Non-Salary Transfer Loans</h2>
    <p>One of the biggest decisions when choosing personal finance in Saudi Arabia:</p>
    <table>
        <thead><tr><th>Factor</th><th>With Salary Transfer</th><th>Without Salary Transfer</th></tr></thead>
        <tbody>
            <tr><td><strong>APR</strong></td><td>~3–5% (competitive)</td><td>~10–19% (significantly higher)</td></tr>
            <tr><td><strong>Approval Speed</strong></td><td>Faster (salary verified automatically)</td><td>Slower (more documentation needed)</td></tr>
            <tr><td><strong>Max Amount</strong></td><td>Higher</td><td>Lower</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>Less (salary locked to one bank)</td><td>More (salary stays at current bank)</td></tr>
            <tr><td><strong>Best For</strong></td><td>Lowest cost, maximum amounts</td><td>Those who can't or won't switch banks</td></tr>
        </tbody>
    </table>

    <h2 id="early-settlement">Early Settlement Rules — SAMA Protection</h2>
    <p>SAMA has capped early repayment penalties to protect consumers:</p>
    <ul>
        <li><strong>Maximum penalty:</strong> 3 months' worth of profit (interest) on the outstanding balance</li>
        <li>Banks <strong>cannot</strong> charge additional fees or penalties beyond this cap</li>
        <li>This encourages refinancing when better rates become available</li>
        <li><strong>No penalty</strong> if the bank agrees to waive it (common during promotional periods)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Example:</strong> Outstanding balance = SAR 80,000, APR = 5%<br/>
        Monthly profit = SAR 80,000 × 5% ÷ 12 = <strong>SAR 333.33</strong><br/>
        Max early settlement fee = 3 × SAR 333.33 = <strong>SAR 1,000</strong>
    </div>

    <h2 id="processing-fees">Processing Fees & VAT</h2>
    <table>
        <thead><tr><th>Fee Type</th><th>SAMA Limit</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Processing Fee</strong></td><td>1% of finance or SAR 5,000 (lower)</td><td>One-time, upfront</td></tr>
            <tr><td><strong>VAT on Fee</strong></td><td>15%</td><td>Applied on the processing fee amount</td></tr>
            <tr><td><strong>Late Payment</strong></td><td>Bank-specific</td><td>Subject to SAMA guidelines</td></tr>
            <tr><td><strong>Early Settlement</strong></td><td>Max 3 months' profit</td><td>On outstanding balance</td></tr>
        </tbody>
    </table>

    <h2 id="documents">Required Documents Checklist</h2>
    <ol>
        <li><strong>National ID</strong> (Saudi) or <strong>Iqama</strong> (expat — min 2 years validity beyond loan maturity)</li>
        <li><strong>Salary certificate</strong> — issued by employer within the last 3 months</li>
        <li><strong>Bank statements</strong> — last 3–6 months (showing salary credits)</li>
        <li><strong>Employer introduction letter</strong> — basic salary, allowances, start date</li>
        <li><strong>GOSI certificate</strong> — proof of social insurance registration</li>
        <li><strong>Salary assignment letter</strong> — authorizing deduction in favor of the bank</li>
        <li><strong>Proof of residence</strong> — utility bill or tenancy contract</li>
        <li><strong>For loan buyout:</strong> Outstanding debt letter from current bank/finance company</li>
    </ol>
`;

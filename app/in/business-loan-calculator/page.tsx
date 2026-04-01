import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import BusinessLoanCalculatorCore from "@/components/calculator/BusinessLoanCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Business Loan EMI Calculator India 2026 — MSME EMI, Eligibility, Mudra & CGTMSE Guide",
    description: "Free business loan EMI calculator for India. Compare 13+ bank, NBFC & fintech rates (SBI, HDFC, Bajaj Finserv, Lendingkart), check eligibility, Mudra PMMY, CGTMSE collateral-free guide, PMEGP subsidy, RBI April 2026 ₹20L mandate, tax benefits under Section 36(1)(iii), and amount-wise EMI from ₹5L to ₹1Cr.",
    keywords: ["business loan EMI calculator","MSME loan calculator India","business loan interest rate 2026","Mudra loan calculator","CGTMSE collateral free loan","business loan eligibility","SBI business loan rate","Bajaj Finserv business loan","business loan tax deduction","Section 36 interest deduction","PMEGP subsidy scheme","Udyam MSME classification"],
    alternates: buildCountryAlternates("IN", "/in/business-loan-calculator", "business-loan-calculator"),
};

const FAQ_ITEMS = [
    { question: "How is business loan EMI calculated?", answer: "Business loan EMI uses the reducing balance formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1], where P is the loan principal, R is the monthly interest rate (annual rate ÷ 12 ÷ 100), and N is the tenure in months. For example, a ₹10 Lakh loan at 14% for 5 years gives an EMI of ₹23,268. The key difference from personal loans: business loan interest is 100% tax deductible under Section 36(1)(iii), so your effective cost at 30% slab is only 9.8%." },
    { question: "What is the current business loan interest rate in India 2026?", answer: "As of April 2026, business loan rates range from 8% (SBI secured/government-backed) to 40% (fintech unsecured for high-risk profiles). Key rates: SBI from 8%, HDFC Bank 10.75–22.50%, ICICI Bank 13.25–19.25%, Axis Bank 11–20%, Bajaj Finserv 14–26%, Tata Capital 12–24%, Lendingkart 15–27%, FlexiLoans 18%+. Your rate depends on CIBIL score, turnover, business vintage, and whether the loan is secured or unsecured." },
    { question: "What is the minimum turnover required for a business loan?", answer: "Banks typically require ₹10–25 Lakh annual turnover for unsecured business loans of ₹5–10 Lakh. For larger loans (₹20L+), lenders expect turnover of 2–3× loan amount. Mudra loans (up to ₹20L) have no strict turnover requirement. Fintech lenders like Lendingkart assess based on 6–12 months bank statements rather than strict turnover thresholds." },
    { question: "What CIBIL score is needed for a business loan?", answer: "Most banks require a CIBIL score of 700+ for business loan approval. With 750+, you get the best rates (8–12%). Between 650–700, NBFCs may approve at 16–22%. Below 650, explore Mudra loans (no strict CIBIL requirement) or collateral-backed options. Both personal CIBIL and business credit score (CIBIL MSME Rank) are evaluated for proprietorship firms." },
    { question: "Can I get a business loan without collateral?", answer: "Yes, multiple options: (1) RBI mandates all banks to provide collateral-free loans up to ₹20 Lakh for Micro and Small Enterprises (effective April 1, 2026). (2) CGTMSE scheme covers collateral-free loans up to ₹10 Crore with 75–90% government guarantee. (3) Mudra PMMY provides up to ₹20 Lakh without collateral. (4) Most NBFCs and fintechs offer unsecured business loans up to ₹50L–₹2Cr based on creditworthiness." },
    { question: "What is CGTMSE and how does it help?", answer: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) is a government scheme that guarantees your business loan so the bank doesn't demand collateral. Coverage: up to ₹10 Crore per borrower. Guarantee: 75–90% of loan amount (90% for micro-enterprises, women, and SC/ST borrowers). Fee: 1–1.5% of loan amount annually. Apply through any CGTMSE-registered bank. This eliminates the need to pledge property for MSME loans." },
    { question: "What are the Mudra loan categories and limits?", answer: "Pradhan Mantri Mudra Yojana (PMMY) has 4 categories: SHISHU (up to ₹50,000 for startups), KISHOR (₹50,001–₹5 Lakh for scaling), TARUN (₹5L–₹10L for expansion), and TARUN PLUS (up to ₹20 Lakh for successful Tarun borrowers — new category). No collateral required. Interest rates are set by the lending institution (typically 8.5–20%). Apply through any bank, NBFC, or the JanSamarth portal." },
    { question: "Is business loan interest tax deductible?", answer: "Yes, 100% of business loan interest is deductible as a business expense under Section 36(1)(iii) of the Income Tax Act. Additionally, the processing fee is deductible in the year paid, and GST charged on the processing fee is claimable as Input Tax Credit (ITC). At 30% tax bracket, a 14% business loan effectively costs only 9.8% after tax savings. This makes business loans significantly cheaper than personal loans after tax." },
    { question: "What is the difference between term loan and overdraft?", answer: "Term Loan: fixed lump-sum disbursal, fixed EMI, suited for one-time purchases (equipment, renovation). Overdraft (OD): revolving credit line where you draw and repay flexibly, paying interest only on the utilized amount. Cash Credit (CC): similar to OD but against stock/debtors. For a ₹10L OD at 14%, using only ₹5L for 15 days costs ~₹2,877 vs ₹23,268 monthly EMI for term loan. Choose OD for variable working capital needs, term loan for capex." },
    { question: "Can startups get business loans in India?", answer: "Banks prefer 2+ years business vintage. Startup alternatives: (1) Mudra SHISHU/KISHOR for micro-enterprises, (2) PMEGP scheme with 15–35% subsidy for new manufacturing/service units, (3) Stand-Up India for SC/ST/Women (₹10L–₹1Cr), (4) Startup India Seed Fund, (5) Revenue-based financing from GetVantage/Velocity for D2C/SaaS, (6) Venture debt from Trifecta/InnoVen for VC-funded startups." },
    { question: "What documents are needed for a business loan?", answer: "Proprietorship: PAN, Aadhaar, GST registration, Udyam certificate, ITR (2 years), bank statements (12 months), dealer proforma invoice. Partnership: above + partnership deed, partners' KYC. Pvt Ltd: above + MOA/AOA, board resolution, audited financials. Simplified route: many fintechs need only Aadhaar + PAN + GST login + bank statement access for loans under ₹10 Lakh." },
    { question: "Can I prepay my business loan without penalty?", answer: "Under RBI Pre-Payment Charges Directions 2025 (effective January 1, 2026), banks and NBFCs cannot charge prepayment/foreclosure penalties on floating-rate business loans to Micro and Small Enterprises. For fixed-rate loans, lenders may charge 2–5% but must disclose in the Key Fact Statement (KFS). Note: prepaying reduces your Section 36(1)(iii) tax deduction, so calculate the net benefit after tax impact." },
    { question: "What is the PMEGP subsidy scheme?", answer: "Prime Minister's Employment Generation Programme provides margin money subsidy for new enterprises: Manufacturing (up to ₹50L project cost), Service (up to ₹20L). General category gets 15% urban / 25% rural subsidy; Special categories (SC/ST/OBC/Women) get 25% urban / 35% rural. Own contribution: 5–10%. Age 18+, 8th pass for higher amounts. Apply through KVIC, DIC, or the PMEGP portal." },
    { question: "What is the new RBI ₹20 lakh collateral-free rule (April 2026)?", answer: "Effective April 1, 2026, the RBI doubled the mandatory collateral-free lending limit for Micro and Small Enterprises from ₹10 Lakh to ₹20 Lakh. All banks must issue loans up to ₹20L to MSEs without demanding any collateral or third-party guarantee. This applies to all loans sanctioned or renewed on or after April 1, 2026. Combined with CGTMSE coverage (up to ₹10Cr), this significantly improves credit access for small businesses." },
    { question: "Bank vs NBFC vs fintech — which is best for business loan?", answer: "Banks (SBI, HDFC): lowest rates (8–15%), complex documentation, 5–15 days processing. NBFCs (Bajaj Finserv, Tata Capital): moderate rates (12–26%), simpler docs, 2–5 days. Fintechs (Lendingkart, FlexiLoans): highest rates (15–40%), minimal docs, 24–72 hours. Strategy: for planned capex, use banks; for urgent working capital, use fintechs; for medium-term needs, use NBFCs. At ₹20L, each 1% rate difference saves ₹35,000+ in total interest." },
    { question: "How much EMI for a ₹20 lakh business loan?", answer: "₹20 Lakh business loan EMI: At 12% for 5 years = ₹44,489/month (total interest ₹6,69,348). At 14% for 5 years = ₹46,537/month (total interest ₹7,92,220). At 16% for 5 years = ₹48,638/month (total interest ₹9,18,280). Tax benefit at 30% slab saves ₹2L–₹2.75L on interest. The effective EMI after tax saving is ₹40,000–₹43,000 depending on rate." },
];

export default function BusinessLoanCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Business Loan EMI Calculator" },
        ]),
        webAppSchema("Business Loan EMI Calculator India 2026", canonicalUrl("/in/business-loan-calculator")),
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
            <Script id="schema-businessloan" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Business Loan EMI Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Business Loan EMI Calculator India 2026</h1>
            <PageDesc>
                Calculate your MSME and business loan EMI, compare 13+ bank, NBFC and fintech interest rates (SBI, HDFC, Bajaj Finserv, Lendingkart), check eligibility, see prepayment impact with tax analysis, and compare secured vs unsecured loans. Complete guide to Mudra PMMY, CGTMSE, PMEGP subsidies, RBI April 2026 ₹20L collateral-free mandate, and Section 36(1)(iii) tax benefits.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <BusinessLoanCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Business Loan EMI Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/personal-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Personal Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Unsecured personal loan EMI & rates</div>
                        </div>
                    </Link>
                    <Link href="/in/home-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏠</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Home Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Loan Against Property comparison</div>
                        </div>
                    </Link>
                    <Link href="/in/car-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🚗</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Car Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Commercial vehicle financing</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">See how loan interest reduces tax</div>
                        </div>
                    </Link>
                    <Link href="/in/gst-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">GST Calculator</div>
                            <div className="in-related-link__desc">Claim ITC on processing fees</div>
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
<h2 id="what-is-business-loan-emi">What Is a Business Loan EMI?</h2>
<p>An <strong>Equated Monthly Instalment (EMI)</strong> is the fixed payment you make every month to repay your business loan. Each EMI comprises two parts: <strong>principal repayment</strong> (reducing your outstanding balance) and <strong>interest payment</strong> (cost of borrowing). Business loans in India are the primary financing tool for <strong>6.3+ crore MSMEs</strong> (Micro, Small, and Medium Enterprises) that contribute 30%+ of India's GDP.</p>
<p>Business loans differ fundamentally from <a href="/in/personal-loan-calculator">personal loans</a> and <a href="/in/home-loan-calculator">home loans</a>:</p>
<ul>
    <li><strong>Ticket range:</strong> ₹50,000 (Mudra SHISHU) to ₹5 Crore+ (SME term loans)</li>
    <li><strong>Interest rates:</strong> 8% (government-backed secured) to 40% (fintech unsecured high-risk)</li>
    <li><strong>Tenure:</strong> 1–7 years (vs 30 years for home loans)</li>
    <li><strong>Tax advantage:</strong> 100% interest deductible under Section 36(1)(iii) — personal/home loan interest has limited deduction</li>
    <li><strong>Product variety:</strong> Term loan, overdraft (OD), cash credit (CC), working capital, invoice discounting</li>
    <li><strong>Government support:</strong> Mudra PMMY, CGTMSE, PMEGP, Stand-Up India, SIDBI schemes</li>
</ul>

<h2 id="emi-formula">Business Loan EMI Formula</h2>
<div class="explanation__highlight">
    <strong>EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]</strong>
</div>
<p>Where:</p>
<ul>
    <li><strong>P</strong> — Principal loan amount (e.g., ₹10,00,000)</li>
    <li><strong>R</strong> — Monthly interest rate = Annual Rate ÷ 12 ÷ 100 (e.g., 14% ÷ 12 ÷ 100 = 0.01167)</li>
    <li><strong>N</strong> — Tenure in months = Years × 12 (e.g., 5 × 12 = 60)</li>
</ul>
<p>This <strong>reducing balance method</strong> is mandated by the RBI for all retail loans. Interest is calculated on the outstanding principal, which decreases with each EMI.</p>

<h2 id="worked-examples">Step-by-Step Worked Examples</h2>
<h3>Example 1: ₹10 Lakh Unsecured Business Loan</h3>
<ul>
    <li><strong>Loan Amount (P):</strong> ₹10,00,000</li>
    <li><strong>Interest Rate:</strong> 14% p.a. → Monthly Rate (R) = 0.01167</li>
    <li><strong>Tenure:</strong> 5 years → N = 60 months</li>
</ul>
<table>
    <thead><tr><th>Component</th><th>Amount</th></tr></thead>
    <tbody>
        <tr><td><strong>Monthly EMI</strong></td><td><strong>₹23,268</strong></td></tr>
        <tr><td>Total Interest</td><td>₹3,96,080</td></tr>
        <tr><td>Total Amount Payable</td><td>₹13,96,080</td></tr>
        <tr><td>Tax Saving @30% on Interest</td><td>₹1,18,824</td></tr>
        <tr><td><strong>Effective Interest Cost</strong></td><td><strong>₹2,77,256</strong></td></tr>
        <tr><td>Effective Rate (after tax)</td><td>9.8% p.a.</td></tr>
    </tbody>
</table>

<h3>Example 2: ₹50 Lakh Secured (LAP) Business Loan</h3>
<ul>
    <li><strong>Loan Amount (P):</strong> ₹50,00,000</li>
    <li><strong>Interest Rate:</strong> 10% p.a. (Loan Against Property)</li>
    <li><strong>Tenure:</strong> 7 years → N = 84 months</li>
</ul>
<table>
    <thead><tr><th>Component</th><th>Amount</th></tr></thead>
    <tbody>
        <tr><td><strong>Monthly EMI</strong></td><td><strong>₹83,015</strong></td></tr>
        <tr><td>Total Interest</td><td>₹19,73,260</td></tr>
        <tr><td>Total Amount Payable</td><td>₹69,73,260</td></tr>
        <tr><td>Tax Saving @30% on Interest</td><td>₹5,91,978</td></tr>
        <tr><td><strong>Effective Interest Cost</strong></td><td><strong>₹13,81,282</strong></td></tr>
    </tbody>
</table>
<div class="explanation__highlight">
    <strong>Key Insight:</strong> The ₹50L secured loan at 10% costs ₹19.73L in interest — but after the ₹5.92L tax saving, the effective cost is only ₹13.81L. Compare this to an unsecured loan at 16% which would cost ₹33.5L in interest. For large amounts, secured loans with tax deduction save <strong>₹15–20 Lakh</strong>.
</div>

<h2 id="bank-interest-rates">Business Loan Interest Rates 2026 — Bank, NBFC & Fintech Comparison</h2>
<p>Interest rates vary dramatically based on lender type. Here's a comprehensive comparison as of April 2026:</p>
<table>
    <thead><tr><th>Lender</th><th>Type</th><th>Rate (p.a.)</th><th>Processing Fee</th><th>Max Amount</th><th>Tenure</th><th>Collateral</th></tr></thead>
    <tbody>
        <tr><td><strong>SBI</strong></td><td>Bank</td><td>8.00% onwards</td><td>0.5–1%</td><td>₹5 Cr+</td><td>7 yrs</td><td>Varies</td></tr>
        <tr><td><strong>Bank of Baroda</strong></td><td>Bank</td><td>9.15% onwards</td><td>0.5–1%</td><td>₹5 Cr</td><td>7 yrs</td><td>Required >₹20L</td></tr>
        <tr><td><strong>PNB</strong></td><td>Bank</td><td>9.55% onwards</td><td>0.35–1%</td><td>₹2 Cr</td><td>5 yrs</td><td>Varies</td></tr>
        <tr><td><strong>HDFC Bank</strong></td><td>Bank</td><td>10.75–22.50%</td><td>Up to 2.5%</td><td>₹50L</td><td>5 yrs</td><td>Optional</td></tr>
        <tr><td><strong>Axis Bank</strong></td><td>Bank</td><td>11.00–20.00%</td><td>Up to 2%</td><td>₹50L</td><td>5 yrs</td><td>Optional</td></tr>
        <tr><td><strong>Tata Capital</strong></td><td>NBFC</td><td>12.00–24.00%</td><td>Up to 2.5%</td><td>₹75L</td><td>5 yrs</td><td>No</td></tr>
        <tr><td><strong>Poonawalla Fincorp</strong></td><td>NBFC</td><td>12.00–21.00%</td><td>Up to 3%</td><td>₹50L</td><td>5 yrs</td><td>No</td></tr>
        <tr><td><strong>ICICI Bank</strong></td><td>Bank</td><td>13.25–19.25%</td><td>Up to 2%</td><td>₹50L</td><td>5 yrs</td><td>Optional</td></tr>
        <tr><td><strong>L&T Finance</strong></td><td>NBFC</td><td>13.00–22.00%</td><td>Up to 3%</td><td>₹1 Cr</td><td>5 yrs</td><td>Optional</td></tr>
        <tr><td><strong>Bajaj Finserv</strong></td><td>NBFC</td><td>14.00–26.00%</td><td>Up to 3.5%</td><td>₹80L</td><td>5 yrs</td><td>No</td></tr>
        <tr><td><strong>Lendingkart</strong></td><td>Fintech</td><td>15.00–27.00%</td><td>2–5%</td><td>₹2 Cr</td><td>3 yrs</td><td>No</td></tr>
        <tr><td><strong>NeoGrowth</strong></td><td>Fintech</td><td>15.00–40.00%</td><td>2–5%</td><td>₹2 Cr</td><td>3 yrs</td><td>No</td></tr>
        <tr><td><strong>FlexiLoans</strong></td><td>Fintech</td><td>18.00% onwards</td><td>2–4%</td><td>₹1 Cr</td><td>3 yrs</td><td>No</td></tr>
    </tbody>
</table>
<div class="explanation__highlight">
    <strong>Rate Impact:</strong> On a ₹20 Lakh loan for 5 years, the difference between SBI (8%) and a fintech (18%) is <strong>₹6.3 Lakh extra in interest</strong>. If your business can afford the 5–15 day bank processing time, the savings are significant. Use fintechs only for genuinely urgent working capital needs.
</div>

<h2 id="amount-wise-emi">Amount-Wise EMI Breakdown — ₹5 Lakh to ₹1 Crore</h2>
<p>Pre-calculated business loan EMIs at common rate tiers:</p>
<table>
    <thead><tr><th>Loan Amount</th><th>EMI @12%/3yr</th><th>EMI @14%/5yr</th><th>EMI @16%/5yr</th><th>Total Interest @14%/5yr</th><th>Tax Saving @30%</th></tr></thead>
    <tbody>
        <tr><td><strong>₹5 Lakh</strong></td><td>₹16,607</td><td>₹11,634</td><td>₹12,159</td><td>₹1,98,040</td><td>₹59,412</td></tr>
        <tr><td><strong>₹10 Lakh</strong></td><td>₹33,214</td><td>₹23,268</td><td>₹24,319</td><td>₹3,96,080</td><td>₹1,18,824</td></tr>
        <tr><td><strong>₹15 Lakh</strong></td><td>₹49,821</td><td>₹34,902</td><td>₹36,478</td><td>₹5,94,120</td><td>₹1,78,236</td></tr>
        <tr><td><strong>₹20 Lakh</strong></td><td>₹66,428</td><td>₹46,537</td><td>₹48,638</td><td>₹7,92,220</td><td>₹2,37,666</td></tr>
        <tr><td><strong>₹30 Lakh</strong></td><td>₹99,642</td><td>₹69,805</td><td>₹72,957</td><td>₹11,88,300</td><td>₹3,56,490</td></tr>
        <tr><td><strong>₹50 Lakh</strong></td><td>₹1,66,070</td><td>₹1,16,341</td><td>₹1,21,595</td><td>₹19,80,460</td><td>₹5,94,138</td></tr>
        <tr><td><strong>₹1 Crore</strong></td><td>₹3,32,140</td><td>₹2,32,683</td><td>₹2,43,190</td><td>₹39,60,980</td><td>₹11,88,294</td></tr>
    </tbody>
</table>

<h2 id="loan-types">Business Loan Types — Term Loan vs OD vs CC vs Working Capital</h2>
<table>
    <thead><tr><th>Feature</th><th>Term Loan</th><th>Overdraft (OD)</th><th>Cash Credit (CC)</th><th>Working Capital Loan</th></tr></thead>
    <tbody>
        <tr><td><strong>Disbursal</strong></td><td>Lump sum</td><td>Credit line (draw as needed)</td><td>Against stock/debtors</td><td>Lump sum or revolving</td></tr>
        <tr><td><strong>Interest On</strong></td><td>Full principal (reducing)</td><td>Used amount only</td><td>Used amount only</td><td>Full or used amount</td></tr>
        <tr><td><strong>EMI</strong></td><td>Fixed monthly EMI</td><td>Interest-only monthly</td><td>Interest-only monthly</td><td>Fixed or flexible</td></tr>
        <tr><td><strong>Best For</strong></td><td>Equipment, expansion, capex</td><td>Variable working capital</td><td>Inventory financing</td><td>Seasonal businesses</td></tr>
        <tr><td><strong>Rate Range</strong></td><td>8–20%</td><td>10–18%</td><td>10–16%</td><td>10–22%</td></tr>
        <tr><td><strong>Tenure</strong></td><td>1–7 years</td><td>1 year (renewable)</td><td>1 year (renewable)</td><td>1–5 years</td></tr>
        <tr><td><strong>Repayment</strong></td><td>Monthly EMI</td><td>On-demand + annual renewal</td><td>On-demand + annual renewal</td><td>Monthly or quarterly</td></tr>
    </tbody>
</table>
<div class="explanation__highlight">
    <strong>OD Advantage:</strong> For a ₹10 Lakh OD at 14%, using only ₹5 Lakh for 15 days costs just <strong>₹2,877</strong> — vs ₹23,268 fixed monthly EMI for a term loan. If your working capital needs fluctuate, OD/CC saves 30–60% vs term loan. Ask your bank about OD facility against your current account.
</div>

<h2 id="government-schemes">Government Schemes for Business Loans 2026</h2>
<h3>1. Mudra PMMY (Pradhan Mantri Mudra Yojana)</h3>
<table>
    <thead><tr><th>Category</th><th>Loan Range</th><th>Target</th><th>Collateral</th></tr></thead>
    <tbody>
        <tr><td><strong>SHISHU</strong></td><td>Up to ₹50,000</td><td>Startup/initial stage</td><td>None</td></tr>
        <tr><td><strong>KISHOR</strong></td><td>₹50,001 – ₹5 Lakh</td><td>Growth/scaling businesses</td><td>None</td></tr>
        <tr><td><strong>TARUN</strong></td><td>₹5 Lakh – ₹10 Lakh</td><td>Mature/expanding businesses</td><td>None</td></tr>
        <tr><td><strong>TARUN PLUS</strong></td><td>Up to ₹20 Lakh</td><td>Successful Tarun borrowers</td><td>None</td></tr>
    </tbody>
</table>
<p>Interest rates are set by the lending institution (typically 8.5–20%). No government-mandated rate. Apply through any bank, NBFC, or the <strong>JanSamarth portal</strong> (jansamarth.in).</p>

<h3>2. CGTMSE (Credit Guarantee Fund Trust)</h3>
<ul>
    <li><strong>Coverage:</strong> Up to ₹10 Crore per borrower (collateral-free)</li>
    <li><strong>Guarantee:</strong> 75–90% of loan amount (90% for micro-enterprises, women, SC/ST)</li>
    <li><strong>Fee:</strong> 1–1.5% annual guarantee fee</li>
    <li><strong>Eligibility:</strong> Micro and Small Enterprises (not medium)</li>
    <li><strong>Key Benefit:</strong> Eliminates collateral requirement — lender's risk is covered by government guarantee</li>
</ul>

<h3>3. PMEGP (Prime Minister's Employment Generation Programme)</h3>
<table>
    <thead><tr><th>Category</th><th>Urban Subsidy</th><th>Rural Subsidy</th><th>Own Contribution</th></tr></thead>
    <tbody>
        <tr><td>General</td><td>15%</td><td>25%</td><td>10%</td></tr>
        <tr><td>SC/ST/OBC/Women/Minorities/Ex-Servicemen</td><td>25%</td><td>35%</td><td>5%</td></tr>
    </tbody>
</table>
<p>Max project cost: Manufacturing ₹50 Lakh, Service ₹20 Lakh. Apply through KVIC or DIC.</p>

<h3>4. Stand-Up India</h3>
<p>Loans of <strong>₹10 Lakh to ₹1 Crore</strong> for SC/ST and women entrepreneurs for greenfield enterprises in manufacturing, services, or agri-allied activities. At least one SC/ST and one woman borrower per bank branch.</p>

<h3>5. RBI Mandatory Collateral-Free Lending (April 2026)</h3>
<div class="explanation__highlight">
    <strong>New Rule:</strong> Effective April 1, 2026, the RBI has <strong>doubled the mandatory collateral-free limit from ₹10L to ₹20 Lakh</strong> for Micro and Small Enterprises. All scheduled commercial banks must comply. This means <strong>no bank can demand property, FD, or personal guarantee</strong> for MSE loans up to ₹20L.
</div>

<h2 id="eligibility">Business Loan Eligibility Criteria</h2>
<table>
    <thead><tr><th>Factor</th><th>Typical Requirement</th><th>Impact</th></tr></thead>
    <tbody>
        <tr><td><strong>CIBIL Score</strong></td><td>700+ (750+ for best rates)</td><td>Below 650 = most banks reject</td></tr>
        <tr><td><strong>Business Vintage</strong></td><td>2+ years (3+ preferred for large)</td><td>Startups: Mudra/PMEGP route</td></tr>
        <tr><td><strong>Annual Turnover</strong></td><td>₹10L+ (2–3× loan amount)</td><td>Higher turnover = higher eligible amount</td></tr>
        <tr><td><strong>Profitability</strong></td><td>Profit for last 2 years (ITR proof)</td><td>Losses reduce eligibility</td></tr>
        <tr><td><strong>GST Filing</strong></td><td>Regular GST filing history</td><td>Non-filers face higher scrutiny</td></tr>
        <tr><td><strong>Existing Debt</strong></td><td>DSCR > 1.25</td><td>High existing EMIs reduce eligibility</td></tr>
        <tr><td><strong>Udyam Registration</strong></td><td>Registered MSME preferred</td><td>Enables government scheme benefits</td></tr>
    </tbody>
</table>

<h2 id="documents">Documents Required for Business Loan</h2>
<h3>Proprietorship Firm</h3>
<ul>
    <li><strong>Identity:</strong> PAN Card (mandatory), Aadhaar Card</li>
    <li><strong>Business:</strong> GST Registration, Udyam Certificate, Shop & Establishment Licence</li>
    <li><strong>Financial:</strong> ITR for 2 years, 12 months bank statements, profit & loss statement</li>
    <li><strong>Purpose:</strong> Proforma invoice, project report, or quotation</li>
</ul>
<h3>Partnership / LLP</h3>
<ul>
    <li>All above + Partnership Deed / LLP Agreement, all partners' KYC</li>
</ul>
<h3>Private Limited Company</h3>
<ul>
    <li>All above + MOA/AOA, Board Resolution, audited balance sheets, director KYC</li>
</ul>
<div class="explanation__highlight">
    <strong>Fast Track:</strong> Fintechs (Lendingkart, FlexiLoans) need only <strong>Aadhaar + PAN + GST login + bank statement access</strong> for loans under ₹10 Lakh. They pull data digitally from your GST filings and bank statements — approval in 24–72 hours.
</div>

<h2 id="tax-benefits">Tax Benefits of Business Loans — Complete Guide</h2>
<p>Business loan interest enjoys the most favourable tax treatment of any loan type in India:</p>
<table>
    <thead><tr><th>Tax Benefit</th><th>Section</th><th>Details</th></tr></thead>
    <tbody>
        <tr><td><strong>Interest Deduction</strong></td><td>Section 36(1)(iii)</td><td>100% of interest paid is deductible as business expense — no cap</td></tr>
        <tr><td><strong>Processing Fee</strong></td><td>Section 37</td><td>Fully deductible in the year paid</td></tr>
        <tr><td><strong>GST on Fees</strong></td><td>GST ITC</td><td>18% GST on processing fee is claimable as Input Tax Credit</td></tr>
        <tr><td><strong>Depreciation</strong></td><td>Section 32</td><td>If loan is used for asset purchase, depreciation is additionally deductible</td></tr>
    </tbody>
</table>
<h3>Effective Cost at Different Tax Brackets</h3>
<table>
    <thead><tr><th>Loan Rate</th><th>Effective Rate @25% slab</th><th>Effective Rate @30% slab</th><th>Savings on ₹10L/5yr Interest</th></tr></thead>
    <tbody>
        <tr><td>10%</td><td>7.5%</td><td>7.0%</td><td>₹72,000–₹86,000</td></tr>
        <tr><td>12%</td><td>9.0%</td><td>8.4%</td><td>₹88,000–₹1,05,000</td></tr>
        <tr><td>14%</td><td>10.5%</td><td>9.8%</td><td>₹99,000–₹1,19,000</td></tr>
        <tr><td>16%</td><td>12.0%</td><td>11.2%</td><td>₹1,12,000–₹1,35,000</td></tr>
        <tr><td>18%</td><td>13.5%</td><td>12.6%</td><td>₹1,28,000–₹1,54,000</td></tr>
    </tbody>
</table>
<p>Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to check your current tax slab and calculate the exact deduction.</p>

<h2 id="rbi-guidelines">RBI Guidelines for Business Loans 2026</h2>
<h3>Collateral-Free Mandate (April 2026)</h3>
<p>The RBI has doubled the mandatory collateral-free lending limit for MSEs from <strong>₹10 Lakh to ₹20 Lakh</strong>, effective April 1, 2026. All scheduled commercial banks, RRBs, Small Finance Banks, and NBFCs must comply for all loans sanctioned or renewed on or after this date.</p>

<h3>Pre-Payment Charges Directions (January 2026)</h3>
<table>
    <thead><tr><th>Loan Type</th><th>Prepayment Penalty</th><th>Applicability</th></tr></thead>
    <tbody>
        <tr><td><strong>Floating-Rate MSE Loan</strong></td><td>✅ Zero penalty — prohibited by RBI</td><td>All loans sanctioned/renewed after Jan 1, 2026</td></tr>
        <tr><td><strong>Fixed-Rate Business Loan</strong></td><td>As per lender policy (2–5%)</td><td>Must be disclosed in KFS</td></tr>
    </tbody>
</table>

<h3>Key Fact Statement (KFS) Requirement</h3>
<p>All lenders must provide a KFS before loan sanction disclosing: APR (effective annual rate including all fees), total cost of credit, prepayment/foreclosure charges, and all fees. Any charge not disclosed in the KFS is unenforceable.</p>

<h2 id="secured-vs-unsecured">Secured vs Unsecured Business Loan — Complete Comparison</h2>
<table>
    <thead><tr><th>Parameter</th><th>🔒 Secured (LAP/Collateral)</th><th>🔓 Unsecured</th><th>🏛️ CGTMSE-Backed</th></tr></thead>
    <tbody>
        <tr><td><strong>Rate Range</strong></td><td>8–14%</td><td>14–28%</td><td>10–14%</td></tr>
        <tr><td><strong>Max Amount</strong></td><td>₹5 Cr+ (based on collateral)</td><td>₹50L–₹2Cr</td><td>₹10 Crore</td></tr>
        <tr><td><strong>Collateral</strong></td><td>Property, FD, machinery</td><td>None</td><td>None (govt guarantee)</td></tr>
        <tr><td><strong>Processing Time</strong></td><td>7–21 days</td><td>1–5 days</td><td>14–30 days</td></tr>
        <tr><td><strong>Risk</strong></td><td>Property at risk on default</td><td>No asset risk</td><td>Government covers default</td></tr>
        <tr><td><strong>Tenure</strong></td><td>5–15 years</td><td>1–5 years</td><td>1–7 years</td></tr>
        <tr><td><strong>Best For</strong></td><td>Large capex, lowest cost</td><td>Urgent working capital</td><td>MSMEs wanting best of both</td></tr>
    </tbody>
</table>
<div class="explanation__highlight">
    <strong>Cost Comparison on ₹20 Lakh/5 Years:</strong> Secured (10%) = ₹4,99,600 interest. Unsecured (16%) = ₹8,47,008 interest. CGTMSE-backed (12%) = ₹5,33,120 interest + ~₹30,000 guarantee fee. The secured route saves <strong>₹3.47 Lakh</strong> vs unsecured — but puts your property at risk.
</div>

<h2 id="msme-classification">MSME Classification — Udyam Registration Guide</h2>
<table>
    <thead><tr><th>Category</th><th>Investment in Plant & Machinery</th><th>Annual Turnover</th></tr></thead>
    <tbody>
        <tr><td><strong>Micro</strong></td><td>≤ ₹1 Crore</td><td>≤ ₹5 Crore</td></tr>
        <tr><td><strong>Small</strong></td><td>≤ ₹10 Crore</td><td>≤ ₹50 Crore</td></tr>
        <tr><td><strong>Medium</strong></td><td>≤ ₹50 Crore</td><td>≤ ₹250 Crore</td></tr>
    </tbody>
</table>
<p><strong>Why register?</strong> Udyam registration entitles you to: CGTMSE collateral-free loans, priority sector lending benefits, lower interest rates at banks, delayed payment protection (buyer must pay within 45 days), MSME Samadhaan portal for dispute resolution, and government e-marketplace (GeM) vendor eligibility. Register free at <strong>udyamregistration.gov.in</strong>.</p>

<h2 id="sector-guidance">Sector-Specific Business Loan Guidance</h2>
<table>
    <thead><tr><th>Sector</th><th>Best Loan Type</th><th>Typical Rate</th><th>Special Schemes</th></tr></thead>
    <tbody>
        <tr><td><strong>Medical/Clinics</strong></td><td>Doctor loan (special product)</td><td>10–12%</td><td>SBI Doctor Loan, Canara Clinic Loan</td></tr>
        <tr><td><strong>CA/Lawyers</strong></td><td>Professional loan</td><td>10–13%</td><td>BoB Professional Loan, ICICI</td></tr>
        <tr><td><strong>Manufacturing</strong></td><td>Term + CLCSS subsidy</td><td>10–14%</td><td>CLCSS 15% subsidy, PMEGP</td></tr>
        <tr><td><strong>Retail/Shops</strong></td><td>Working capital + OD</td><td>12–18%</td><td>Mudra KISHOR/TARUN</td></tr>
        <tr><td><strong>E-Commerce/D2C</strong></td><td>Revenue-based financing</td><td>12–18% flat</td><td>GetVantage, Velocity</td></tr>
        <tr><td><strong>Exporters</strong></td><td>Export credit (ECGS)</td><td>7–9%</td><td>ECGC cover, SIDBI</td></tr>
        <tr><td><strong>Startups (funded)</strong></td><td>Venture debt</td><td>14–17%</td><td>Trifecta, InnoVen, Alteria</td></tr>
    </tbody>
</table>

<h2 id="common-mistakes">7 Common Mistakes in Business Loan Applications</h2>
<ol>
    <li><strong>Mixing personal and business bank accounts:</strong> Lenders assess business revenue from bank statements. Personal transactions muddy the picture. Use a dedicated current account for all business transactions.</li>
    <li><strong>Ignoring CIBIL before applying:</strong> Each rejected application drops your CIBIL by 5–10 points. Check both personal CIBIL and CIBIL MSME Rank before applying. Apply only where you meet thresholds.</li>
    <li><strong>Not exploring government schemes:</strong> Many MSMEs pay 18–24% to fintechs when they qualify for 8–12% Mudra or CGTMSE-backed loans. Always check Mudra/PMEGP eligibility before approaching private lenders.</li>
    <li><strong>Choosing the longest tenure blindly:</strong> A ₹10 Lakh loan at 14%: 3-year tenure costs ₹2,40,000 in interest; 7-year tenure costs ₹5,95,000. That's ₹3.55 Lakh extra for lower EMIs.</li>
    <li><strong>Not reading the Key Fact Statement:</strong> The KFS shows your APR (full cost including processing fee), all charges, and prepayment terms. It's your legal right under RBI guidelines — review before signing.</li>
    <li><strong>Ignoring the tax deduction advantage:</strong> At 30% bracket, a 14% business loan costs effectively 9.8%. Some MSME owners prepay aggressively without realizing they lose the tax deduction. Calculate the net benefit using our prepayment mode.</li>
    <li><strong>Not registering on Udyam:</strong> Free Udyam registration unlocks CGTMSE coverage, priority sector lending, delayed payment protection, and access to government e-marketplace. Takes 10 minutes online.</li>
</ol>

<h2 id="related-tools">Related Calculators & Tools</h2>
<ul>
    <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Compare personal vs business loan: personal loan interest is NOT tax deductible.</li>
    <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Planning a Loan Against Property? Compare LAP rates and EMI.</li>
    <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — Financing a commercial vehicle? Compare vehicle loan rates.</li>
    <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Check your tax slab to calculate exact Section 36(1)(iii) benefit.</li>
    <li><strong><a href="/in/gst-calculator">GST Calculator</a></strong> — Calculate GST on processing fee for ITC claim.</li>
    <li><strong><a href="/in/loan-eligibility-calculator">Loan Eligibility Calculator</a></strong> — Check eligibility across loan types.</li>
    <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Should you invest surplus vs prepay the loan? Compare returns.</li>
    <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> — Understand the true cost of compounding interest on your loan.</li>
    <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — FD as collateral for secured loan? Check FD rates.</li>
</ul>
`;

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import PPFCalculatorCore from "@/components/calculator/PPFCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "PPF Calculator India 2026 — Maturity Amount, Interest Rate 7.1% & Tax Benefits",
    description: "Free PPF calculator for India. Calculate maturity amount at 7.1% interest rate with yearly breakdown. Compare deposit timing strategies, plan extensions, and understand Section 80C tax benefits. PPF vs EPF vs NPS vs ELSS comparison included.",
    keywords: ["PPF calculator India", "PPF calculator", "PPF interest rate 2026", "PPF maturity amount", "PPF Section 80C", "Public Provident Fund calculator", "PPF vs ELSS", "PPF withdrawal rules", "PPF extension rules", "PPF tax benefits EEE"],
    alternates: buildCountryAlternates("IN", "/in/ppf-calculator", "ppf-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is the current PPF interest rate in 2026?", answer: "The current PPF interest rate is 7.1% per annum (as of Q1 FY2026–27, April–June 2026). This rate has remained unchanged since April 2020. The Government of India reviews PPF rates quarterly, but has maintained 7.1% for over 6 years. The rate is announced by the Ministry of Finance and applies to the balance between the 5th and last day of each month." },
    { question: "How is PPF interest calculated?", answer: "PPF interest is calculated on the lowest balance between the 5th and the last day of each month. Monthly interest is summed up and credited to the account at the end of the financial year (March 31). Formula: Monthly Interest = (Lowest balance between 5th–30th/31st) × 7.1% ÷ 12. This means depositing before the 5th of each month maximizes your interest earnings." },
    { question: "What is the maximum PPF deposit per year?", answer: "The maximum annual deposit in PPF is ₹1,50,000 (₹1.5 lakh) per financial year. The minimum is ₹500. You can make multiple deposits throughout the year, but the total cannot exceed ₹1.5 lakh. If you have a self account and a minor child's account, the combined limit is still ₹1.5 lakh. Deposits above ₹1.5 lakh will not earn interest and won't qualify for Section 80C benefits." },
    { question: "Can I withdraw money from PPF before 15 years?", answer: "Partial withdrawal is allowed from the 7th financial year onwards (after completing 5 full financial years of deposits). The maximum withdrawal is 50% of the balance at the end of the 4th preceding year or balance at the end of the previous year, whichever is lower. Only one withdrawal per financial year is permitted. Premature closure (full withdrawal) is allowed after 5 years only for medical emergencies, higher education, or change in residency status (NRI), with a 1% interest rate penalty." },
    { question: "What are the tax benefits of PPF?", answer: "PPF enjoys EEE (Exempt-Exempt-Exempt) status — the gold standard of tax efficiency in India: (1) Investment: Deposits up to ₹1.5 lakh qualify for Section 80C deduction under the old tax regime. (2) Interest: All interest earned is completely tax-free. (3) Maturity: The entire maturity amount (principal + interest) is exempt from income tax. Note: Under the new tax regime, Section 80C deduction is not available, but interest and maturity remain tax-free." },
    { question: "Can I take a loan against my PPF account?", answer: "Yes, loans against PPF are available from the 3rd to the 6th financial year of account opening. The maximum loan amount is 25% of the balance at the end of the 2nd preceding financial year. The loan must be repaid within 36 months. Interest is charged at 1% above the prevailing PPF rate (currently 7.1% + 1% = 8.1%). After the 6th year, you become eligible for partial withdrawals instead, which don't need to be repaid." },
    { question: "What happens to PPF after 15 years?", answer: "After the 15-year maturity, you have three options: (1) Withdraw the entire amount tax-free. (2) Extend for 5-year blocks with fresh contributions — submit Form H within 1 year of maturity. (3) Extend without contributions — the existing balance continues earning interest at the prevailing rate. Extensions can be done indefinitely in 5-year blocks. If extended with contributions, you can make one withdrawal per block (up to 60% of the balance at the start of that block)." },
    { question: "Can NRIs open a PPF account?", answer: "No, NRIs cannot open new PPF accounts. However, if a resident Indian becomes an NRI after opening a PPF account, they can continue the account until its maturity (15 years). After maturity, the account cannot be extended — it must be closed. The account continues to earn interest at the prevailing rate until closure. HUFs (Hindu Undivided Families) are also not eligible to open PPF accounts since 2005." },
    { question: "Should I deposit in PPF on April 5 or monthly?", answer: "Depositing the entire annual amount (₹1.5 lakh) as a lump sum on or before April 5 is the optimal strategy. PPF interest is calculated on the lowest balance between the 5th and last day of each month. By depositing on April 5, your entire contribution earns interest for all 12 months. Compared to monthly deposits, the lump-sum approach can earn ₹1–2 lakh more over 15 years at current rates. However, if you can't afford a lump sum, depositing before the 5th of each month is the next best approach." },
    { question: "What is the PPF maturity amount for ₹1.5 lakh per year?", answer: "If you invest ₹1,50,000 per year for 15 years at 7.1% interest rate, your PPF maturity amount will be approximately ₹40,68,209. Of this, ₹22,50,000 is your total investment and ₹18,18,209 is tax-free interest earned. If extended for an additional 5 years (20 years total) with continued contributions, the amount grows to approximately ₹66,58,288." },
    { question: "How to open a PPF account?", answer: "You can open a PPF account at any post office, SBI, or authorized banks like HDFC, ICICI, Axis, PNB. Online options: (1) Net banking of your existing bank. (2) Post office via India Post. Documents needed: PAN card, Aadhaar, address proof, passport-size photo, and a cheque/DD for initial deposit (minimum ₹500). Only one PPF account is allowed per person — duplicate accounts are merged by the government." },
    { question: "Is PPF better than ELSS for tax saving?", answer: "It depends on your risk appetite. PPF: 7.1% guaranteed, 15-year lock-in, zero risk, EEE tax. ELSS: 12–18% historical returns, only 3-year lock-in, market risk, LTCG tax above ₹1 lakh. For conservative investors prioritizing safety, PPF is better. For those who can tolerate market volatility and want higher returns with shorter lock-in, ELSS is superior. Many investors use both — ₹1.5 lakh split between PPF (safety) and ELSS (growth)." },
    { question: "Can I have two PPF accounts?", answer: "No, only one PPF account is allowed per individual. If duplicate accounts are discovered, the second account is merged into the first, and excess deposits (above ₹1.5 lakh combined) do not earn interest. However, you can have your own account plus one account as guardian of a minor child — but the combined annual deposit limit is still ₹1.5 lakh." },
    { question: "What is the PPF lock-in period?", answer: "The PPF lock-in period is 15 years from the end of the financial year in which the account was opened. For example, if you open a PPF on 15 January 2026, the 15-year period is calculated from 31 March 2026 — so maturity is on 1 April 2041. During this 15-year period, you cannot close the account except under specific hardship conditions (medical, education, NRI) after 5 years. Partial withdrawals are allowed from the 7th year." },
    { question: "Which is better — PPF or FD for tax saving?", answer: "PPF is significantly better than tax-saving FDs: PPF gives 7.1% interest (currently comparable to FD rates) but with EEE status — interest and maturity are tax-free. Tax-saving FDs have a 5-year lock-in (shorter than PPF's 15 years), and interest is fully taxable as per your income slab. For someone in the 30% tax bracket, a 7% FD effectively gives only ~4.9% post-tax, while PPF gives the full 7.1%. The only advantage of FDs is the shorter lock-in." },
];

export default function PPFCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "PPF Calculator" },
        ]),
        webAppSchema("PPF Calculator India 2026", canonicalUrl("/in/ppf-calculator")),
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
            <Script id="schema-ppf" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "PPF Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>PPF Calculator India 2026</h1>
            <PageDesc>
                Calculate your PPF maturity amount at the current 7.1% interest rate with year-by-year breakdown. Learn the optimal deposit timing strategy, plan post-maturity extensions, and understand Section 80C tax benefits with EEE status.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <PPFCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="PPF Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
                    <Link href="/in/car-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🚗</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Car Loan EMI Calculator</div>
                            <div className="in-related-link__desc">New vs used car loan rates</div>
                        </div>
                    </Link>
                    <Link href="/in/personal-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Personal Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Unsecured loan EMI & CIBIL guide</div>
                        </div>
                    </Link>
                    <Link href="/in/age-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🎂</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Age Calculator</div>
                            <div className="in-related-link__desc">Legal milestones & retirement age</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-ppf">What Is PPF (Public Provident Fund)?</h2>
    <p>The <strong>Public Provident Fund (PPF)</strong> is India's most popular long-term, government-backed savings scheme. Established under the <strong>Public Provident Fund Act, 1968</strong>, it offers a combination of <strong>safety, guaranteed returns, and triple tax exemption (EEE)</strong> that no other investment instrument matches.</p>
    <p>Key characteristics:</p>
    <ul>
        <li><strong>Sovereign guarantee:</strong> Backed by the Government of India — zero risk of default</li>
        <li><strong>Current rate:</strong> 7.1% per annum (compounded annually, reviewed quarterly)</li>
        <li><strong>Lock-in:</strong> 15 years (extendable in 5-year blocks)</li>
        <li><strong>Tax status:</strong> EEE — Exempt at investment, interest, and maturity</li>
        <li><strong>Deposit limits:</strong> ₹500 minimum to ₹1,50,000 maximum per financial year</li>
    </ul>

    <h2 id="ppf-formula">PPF Calculator Formula</h2>
    <div class="explanation__highlight">
        <strong>A = P × [((1 + r)<sup>n</sup> − 1) / r] × (1 + r)</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>A</strong> — Maturity amount</li>
        <li><strong>P</strong> — Annual investment amount</li>
        <li><strong>r</strong> — Annual interest rate (e.g., 7.1% = 0.071)</li>
        <li><strong>n</strong> — Number of years</li>
    </ul>

    <h2 id="worked-example">Worked Example — ₹1.5 Lakh per Year for 15 Years</h2>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual Investment</strong></td><td>₹1,50,000</td></tr>
            <tr><td><strong>Interest Rate</strong></td><td>7.1% per annum</td></tr>
            <tr><td><strong>Tenure</strong></td><td>15 years</td></tr>
            <tr><td><strong>Total Invested</strong></td><td>₹22,50,000 (₹1.5L × 15)</td></tr>
            <tr><td><strong>Total Interest Earned</strong></td><td><strong>₹18,18,209</strong> (tax-free)</td></tr>
            <tr><td><strong>Maturity Amount</strong></td><td><strong>₹40,68,209</strong></td></tr>
            <tr><td><strong>Effective Growth</strong></td><td>81% above invested amount</td></tr>
        </tbody>
    </table>

    <h2 id="fifth-of-month-rule">The "5th of Month" Rule — Maximize Your PPF Returns</h2>
    <p>This is the <strong>single most important tip</strong> for PPF investors that most calculators and guides miss:</p>
    <div class="explanation__highlight">
        <strong>PPF interest is calculated on the lowest balance between the 5th and the last day of each month.</strong>
    </div>
    <p>What this means practically:</p>
    <ul>
        <li><strong>Best strategy:</strong> Deposit your entire ₹1.5 lakh on <strong>April 5</strong> (or before the 5th of April). This ensures your full balance earns interest for all 12 months.</li>
        <li><strong>Next best:</strong> If you can't manage a lump sum, deposit before the <strong>5th of each month</strong>.</li>
        <li><strong>Worst strategy:</strong> Depositing at the end of March means your investment earns interest for only ~1 month in that financial year.</li>
        <li><strong>Impact:</strong> Over 15 years, the timing difference between an April 5 lump sum and a March deposit can be <strong>₹2–3 lakh</strong> for a ₹1.5L annual contribution.</li>
    </ul>

    <h2 id="interest-rate-history">PPF Interest Rate History — 2012 to 2026</h2>
    <p>The PPF interest rate has been revised quarterly since 2016, but has remained at 7.1% for an unusually long period:</p>
    <table>
        <thead><tr><th>Period</th><th>Rate (% p.a.)</th><th>Change</th></tr></thead>
        <tbody>
            <tr><td><strong>Apr 2020 – Mar 2026</strong></td><td><strong>7.1%</strong></td><td>Unchanged for 6 years</td></tr>
            <tr><td>Jan 2020 – Mar 2020</td><td>7.9%</td><td>↓ 0.8%</td></tr>
            <tr><td>Jul 2019 – Dec 2019</td><td>7.9%</td><td>Maintained</td></tr>
            <tr><td>Apr 2019 – Jun 2019</td><td>8.0%</td><td>↓ 0.1%</td></tr>
            <tr><td>Oct 2018 – Mar 2019</td><td>8.0%</td><td>↑ 0.4%</td></tr>
            <tr><td>Jan 2018 – Sep 2018</td><td>7.6%</td><td>↓ 0.2%</td></tr>
            <tr><td>Jul 2017 – Dec 2017</td><td>7.8%</td><td>↓ 0.1%</td></tr>
            <tr><td>Apr 2017 – Jun 2017</td><td>7.9%</td><td>↓ 0.1%</td></tr>
            <tr><td>Oct 2016 – Mar 2017</td><td>8.0%</td><td>↓ 0.1%</td></tr>
            <tr><td>Apr 2016 – Sep 2016</td><td>8.1%</td><td>↓ 0.6%</td></tr>
            <tr><td>Apr 2015 – Mar 2016</td><td>8.7%</td><td>Maintained</td></tr>
            <tr><td>Apr 2014 – Mar 2015</td><td>8.7%</td><td>↓ 0.1%</td></tr>
            <tr><td>Apr 2013 – Mar 2014</td><td>8.7%</td><td>↓ 0.1%</td></tr>
            <tr><td>Apr 2012 – Mar 2013</td><td>8.8%</td><td>—</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Trend:</strong> PPF rates have fallen from 8.8% (2012) to 7.1% (2020–2026) — a decline of 1.7 percentage points. Despite this, PPF remains attractive because the 7.1% is <strong>completely tax-free</strong>. For someone in the 30% tax bracket, a PPF at 7.1% is equivalent to a pre-tax return of <strong>~10.1%</strong>.
    </div>

    <h2 id="ppf-rules">PPF Account Rules — Complete Reference</h2>
    <table>
        <thead><tr><th>Rule</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Eligibility</strong></td><td>Resident Indians only (NRIs cannot open new accounts)</td></tr>
            <tr><td><strong>Accounts per person</strong></td><td>One account only (duplicates are merged)</td></tr>
            <tr><td><strong>Minor accounts</strong></td><td>Guardian can open on behalf of minor (combined limit ₹1.5L)</td></tr>
            <tr><td><strong>Joint accounts</strong></td><td>Not allowed — individual accounts only</td></tr>
            <tr><td><strong>Min deposit</strong></td><td>₹500 per financial year</td></tr>
            <tr><td><strong>Max deposit</strong></td><td>₹1,50,000 per financial year</td></tr>
            <tr><td><strong>Deposit frequency</strong></td><td>Any number of times (min 1/year to keep active)</td></tr>
            <tr><td><strong>Tenure</strong></td><td>15 years (from end of FY of opening)</td></tr>
            <tr><td><strong>Extension</strong></td><td>5-year blocks (unlimited, with/without contributions)</td></tr>
            <tr><td><strong>Where to open</strong></td><td>Post offices, SBI, HDFC, ICICI, Axis, PNB, and authorized banks</td></tr>
            <tr><td><strong>Transfer</strong></td><td>Between post offices and banks freely</td></tr>
            <tr><td><strong>Nomination</strong></td><td>Mandatory — one or more nominees</td></tr>
        </tbody>
    </table>

    <h2 id="ppf-comparison">PPF vs EPF vs NPS vs ELSS — Comparison for Tax Saving</h2>
    <p>All four instruments qualify for Section 80C deduction. Here's how they compare:</p>
    <table>
        <thead><tr><th>Feature</th><th>PPF</th><th>EPF</th><th>NPS</th><th>ELSS</th></tr></thead>
        <tbody>
            <tr><td><strong>Returns</strong></td><td>7.1% (fixed)</td><td>8.15% (fixed)</td><td>8–14% (market)</td><td>12–18% (market)</td></tr>
            <tr><td><strong>Risk</strong></td><td>Zero</td><td>Zero</td><td>Low–Medium</td><td>High</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>15 years</td><td>Till retirement</td><td>Till age 60</td><td>3 years</td></tr>
            <tr><td><strong>80C Benefit</strong></td><td>₹1.5L</td><td>₹1.5L</td><td>₹1.5L + ₹50K (80CCD)</td><td>₹1.5L</td></tr>
            <tr><td><strong>Tax on Interest</strong></td><td>Exempt</td><td>Exempt (if &lt;₹2.5L/yr)</td><td>Partially taxable</td><td>LTCG &gt;₹1L taxed</td></tr>
            <tr><td><strong>Tax on Maturity</strong></td><td><strong>EEE (Exempt)</strong></td><td>EEE (if 5+ yrs)</td><td>60% exempt</td><td>LTCG above ₹1L</td></tr>
            <tr><td><strong>Who Can Open</strong></td><td>Any Indian</td><td>Salaried (mandatory)</td><td>Any Indian</td><td>Any Indian</td></tr>
            <tr><td><strong>Best For</strong></td><td>Risk-averse, long-term</td><td>Salaried employees</td><td>Extra ₹50K deduction</td><td>Wealth creation</td></tr>
        </tbody>
    </table>

    <h2 id="tax-benefits">PPF Tax Benefits — EEE Status Explained</h2>
    <table>
        <thead><tr><th>Stage</th><th>Tax Treatment</th><th>Section</th></tr></thead>
        <tbody>
            <tr><td><strong>Investment</strong></td><td>Tax deduction up to ₹1.5 lakh under Section 80C (old regime only)</td><td>Section 80C</td></tr>
            <tr><td><strong>Interest</strong></td><td>Completely tax-free — no TDS, no income tax</td><td>Section 10</td></tr>
            <tr><td><strong>Maturity</strong></td><td>Entire maturity amount exempt from income tax</td><td>Section 10</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>New vs Old Tax Regime:</strong> Under the <strong>new tax regime</strong>, Section 80C deduction is not available, so PPF deposits don't reduce your taxable income. However, the interest and maturity amount remain tax-free under both regimes. If you opt for the new regime, PPF is still a good savings tool — just not a tax-saving one.
    </div>

    <h2 id="partial-withdrawal">PPF Partial Withdrawal Rules</h2>
    <table>
        <thead><tr><th>Rule</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Earliest withdrawal</strong></td><td>7th financial year (after 5 full years of deposits)</td></tr>
            <tr><td><strong>Maximum amount</strong></td><td>50% of balance at end of 4th preceding year OR 50% of previous year balance — whichever is lower</td></tr>
            <tr><td><strong>Frequency</strong></td><td>One withdrawal per financial year</td></tr>
            <tr><td><strong>Repayment</strong></td><td>Not required — it's a withdrawal, not a loan</td></tr>
            <tr><td><strong>After extension</strong></td><td>Up to 60% of balance at start of extension block (if extended with contributions)</td></tr>
        </tbody>
    </table>

    <h2 id="loan-against-ppf">Loan Against PPF</h2>
    <table>
        <thead><tr><th>Parameter</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Eligibility period</strong></td><td>3rd to 6th financial year of account opening</td></tr>
            <tr><td><strong>Maximum loan</strong></td><td>25% of balance at end of 2nd preceding financial year</td></tr>
            <tr><td><strong>Interest rate</strong></td><td>PPF rate + 1% (currently 7.1% + 1% = 8.1%)</td></tr>
            <tr><td><strong>Repayment</strong></td><td>Within 36 months (principal + interest)</td></tr>
            <tr><td><strong>Second loan</strong></td><td>Only after first loan is fully repaid</td></tr>
            <tr><td><strong>After 6th year</strong></td><td>Loan facility stops — partial withdrawal begins from year 7</td></tr>
        </tbody>
    </table>

    <h2 id="extension-rules">PPF Extension After 15 Years</h2>
    <p>After the 15-year maturity, you have three options:</p>
    <table>
        <thead><tr><th>Option</th><th>How</th><th>Key Rules</th></tr></thead>
        <tbody>
            <tr><td><strong>Full Withdrawal</strong></td><td>Close account, withdraw entire balance</td><td>Tax-free. Submit closure form to bank/PO.</td></tr>
            <tr><td><strong>Extend WITH contributions</strong></td><td>Submit Form H within 1 year of maturity</td><td>Continue depositing ₹500–₹1.5L/year. One withdrawal of up to 60% per 5-year block.</td></tr>
            <tr><td><strong>Extend WITHOUT contributions</strong></td><td>Do nothing (automatic)</td><td>Existing balance earns interest at prevailing rate. No new deposits allowed. Withdraw any amount, any time.</td></tr>
        </tbody>
    </table>

    <h2 id="premature-closure">Premature Closure Rules</h2>
    <ul>
        <li><strong>When:</strong> Only after completing <strong>5 financial years</strong> of active deposits</li>
        <li><strong>Reasons:</strong> Medical emergency (self/spouse/children/parents), Higher education (self/children), Change of residency status (NRI)</li>
        <li><strong>Penalty:</strong> Interest rate reduced by <strong>1%</strong> from the date of account opening on the entire balance</li>
        <li><strong>Documentation:</strong> Medical certificates / admission letters / passport/visa proof required</li>
    </ul>

    <h2 id="where-to-open">Where to Open a PPF Account</h2>
    <ul>
        <li><strong>Post Office:</strong> Any post office. Visit with KYC documents + ₹500 initial deposit</li>
        <li><strong>SBI:</strong> Online via SBI YONO or any SBI branch</li>
        <li><strong>HDFC Bank:</strong> Net banking or branch (existing customers only)</li>
        <li><strong>ICICI Bank:</strong> Online via iMobile or net banking</li>
        <li><strong>Axis Bank, PNB, BoB:</strong> Branch or net banking</li>
    </ul>
    <p><strong>Documents required:</strong> PAN card, Aadhaar card, Address proof, Passport-size photo, Cheque/DD for initial deposit (min ₹500)</p>

    <h2 id="nri-minor">NRI & Minor Account Rules</h2>
    <table>
        <thead><tr><th>Category</th><th>Can Open?</th><th>Rules</th></tr></thead>
        <tbody>
            <tr><td><strong>NRI</strong></td><td>❌ Cannot open new</td><td>Existing accounts continue till maturity. Cannot extend. Must close after 15 years.</td></tr>
            <tr><td><strong>Minor (Indian)</strong></td><td>✅ Through guardian</td><td>Parent/guardian opens. Combined limit with parent's own PPF = ₹1.5L/year.</td></tr>
            <tr><td><strong>HUF</strong></td><td>❌ Not eligible</td><td>Hindu Undivided Family accounts discontinued since 2005.</td></tr>
        </tbody>
    </table>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Planning to buy a house? PPF can serve as partial down payment after 7 years.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan EMI Calculator</a></strong> — Consider PPF loan (8.1%) vs personal loan (10–24%) for short-term needs.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — PPF partial withdrawal can fund car down payment.</li>
        <li><strong><a href="/in/age-calculator">Age Calculator</a></strong> — Track your retirement age and align PPF maturity with retirement planning.</li>
    </ul>
`;

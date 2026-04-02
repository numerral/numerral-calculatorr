import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import SSYCalculatorCore from "@/components/calculator/SSYCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Sukanya Samriddhi Yojana Calculator 2026 — SSY Interest Rate 8.2%, Maturity & Withdrawal",
    description: "Free SSY Calculator with 4 modes: Maturity Estimator (21-year growth schedule, inflation toggle), Partial Withdrawal Simulator (50% at age 18), SSY vs PPF vs FD comparison, and Goal-Based Reverse Calculator. Current rate 8.2%, EEE tax-free, Section 80C. Complete guide with eligibility, documents, bank list.",
    keywords: ["SSY calculator", "Sukanya Samriddhi Yojana calculator", "SSY interest rate 2026", "SSY maturity calculator", "SSY vs PPF", "girl child savings scheme", "SSY withdrawal rules", "SSY tax benefits", "sukanya samriddhi account"],
    alternates: buildCountryAlternates("IN", "/in/sukanya-samriddhi-yojana-calculator", "sukanya-samriddhi-yojana-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is Sukanya Samriddhi Yojana (SSY)?", answer: "Sukanya Samriddhi Yojana is a government-backed savings scheme launched under the 'Beti Bachao, Beti Padhao' campaign for the girl child. It offers 8.2% annual interest (highest among government schemes), EEE (Exempt-Exempt-Exempt) tax status, and a 21-year maturity period. Parents or legal guardians can open an account for a girl child below 10 years of age at any post office or authorized bank. The scheme is designed to build a corpus for the girl's education and marriage." },
    { question: "What is the current SSY interest rate in 2026?", answer: "The SSY interest rate for Q1 FY 2026-27 (April-June 2026) is 8.2% per annum, compounded annually. This rate has remained steady since Q4 FY 2023-24. The rate is reviewed quarterly by the Ministry of Finance. Historically, SSY rates have ranged from 7.6% (2020-21) to 9.2% (2015-16). At 8.2%, SSY offers the highest return among all government small savings schemes (PPF: 7.1%, NSC: 7.7%, SCSS: 8.2%)." },
    { question: "Who is eligible to open an SSY account?", answer: "Eligibility: (1) The girl child must be below 10 years of age at the time of account opening. (2) Only parents or legal guardians can open the account. (3) Maximum 2 accounts per family (exception: 3 allowed if second pregnancy results in twins/triplets). (4) The girl must be a resident Indian citizen. (5) NRIs cannot open new SSY accounts (existing accounts opened before NRI status can continue). (6) Only one account per girl child." },
    { question: "What is the minimum and maximum deposit in SSY?", answer: "Minimum: ₹250 per financial year (to keep account active). Maximum: ₹1,50,000 per financial year. Deposits can be made in lump sum or multiple installments during the year. Deposits are required for the first 15 years only — from year 16 to 21, no deposits are needed and the balance continues earning interest. If minimum ₹250 is not deposited in any year, a penalty of ₹50 per year of default is charged." },
    { question: "Can I open SSY account for 2 daughters?", answer: "Yes, you can open separate SSY accounts for up to 2 daughters per family. Exception: If the second pregnancy results in twins or triplets, a third account is permitted. Each account is independent with its own deposits and maturity. Both accounts can have the full ₹1.5 lakh annual deposit limit independently, giving a combined Section 80C benefit of ₹3 lakh (though 80C itself is capped at ₹1.5L total)." },
    { question: "What happens if I miss the minimum yearly deposit?", answer: "If you fail to deposit the minimum ₹250 in any financial year, the account becomes 'inactive' (defaulted). To revive it, you must pay: (1) The minimum deposit of ₹250 for each year of default, plus (2) A penalty of ₹50 per year of default. Example: 3 years missed = ₹250×3 + ₹50×3 = ₹900 to regularize. The account continues to earn interest even during default, but you cannot make withdrawals from a defaulted account." },
    { question: "When does SSY account mature?", answer: "An SSY account matures 21 years from the date of opening, regardless of the girl's age at opening. Example: Account opened on 15 March 2026 → Matures on 15 March 2047. Note: Deposits are required only for the first 15 years (2026-2041). From year 16 to 21, no deposits are needed — the balance simply earns compound interest. Early closure is allowed after the girl turns 18 for marriage." },
    { question: "Can I withdraw money before maturity?", answer: "Partial withdrawal: Up to 50% of the balance at the end of the preceding financial year can be withdrawn once the girl turns 18 — for higher education expenses. Full premature closure allowed in: (1) Marriage of the account holder (after age 18), (2) Death of the account holder, (3) Life-threatening illness of the account holder. The account holder (girl) can operate the account independently after turning 18." },
    { question: "What are the tax benefits of SSY?", answer: "SSY enjoys the coveted EEE (Exempt-Exempt-Exempt) tax status — the most favorable tax treatment available: (1) EXEMPT: Deposits qualify for Section 80C deduction (up to ₹1.5 lakh/year), (2) EXEMPT: Interest earned is completely tax-free, (3) EXEMPT: Maturity proceeds are entirely tax-free. No other investment (except PPF) offers complete EEE status. This makes SSY the most tax-efficient girl child savings option." },
    { question: "SSY vs PPF — which is better for girl child?", answer: "SSY wins on returns (8.2% vs 7.1%) and both have EEE tax status. SSY advantage: Higher interest, dedicated girl child scheme, partial withdrawal at 18 for education. PPF advantage: Shorter lock-in (15 years vs 21), available to everyone (not just girl child), partial withdrawal from year 7. For a girl child: SSY is clearly better due to 1.1% higher return — over 21 years, this compounds to significantly more wealth. Use both if you want flexibility." },
    { question: "Can NRI open SSY account?", answer: "No, NRIs cannot open new SSY accounts. However, if an existing SSY account holder's parent becomes an NRI, the account can continue until maturity with deposits allowed for the first 15 years. If the girl child herself becomes an NRI or foreign citizen, the account will be closed. Some recent RBI clarifications have introduced nuances, so consult your bank for the latest rules before proceeding." },
    { question: "Which banks accept SSY account opening?", answer: "SSY accounts can be opened at any India Post office and 28 authorized banks including: SBI, PNB, Bank of Baroda, Canara Bank, Union Bank, Bank of India, Central Bank, Indian Bank, HDFC Bank, ICICI Bank, Axis Bank, and others. The list of authorized banks is notified by the Ministry of Finance. Post offices are often easier for account opening in rural areas, while banks may offer online tracking features." },
    { question: "Can grandfather/grandmother open SSY account?", answer: "No, only the natural or legal guardian (parent/adoptive parent) of the girl child can open and operate an SSY account. Grandparents cannot open or operate the account unless they are the legally appointed guardian of the girl child. However, anyone (including grandparents) can contribute money toward the deposits — the deposit just needs to be made through the guardian's account." },
    { question: "What documents are needed to open SSY?", answer: "Required documents: (1) Birth certificate of the girl child, (2) Identity proof of parent/guardian (Aadhaar, PAN, Voter ID, Passport), (3) Address proof of parent/guardian (Aadhaar, utility bill, bank statement), (4) SSY application form (Form SSA-1, available at bank/post office), (5) Passport-size photographs of girl child and guardian, (6) Initial deposit amount (minimum ₹250). Processing time: Usually same day at post offices, 2-3 days at banks." },
    { question: "How is SSY interest calculated?", answer: "SSY interest is compounded annually at the prescribed rate (currently 8.2%). The interest is calculated on the lowest balance between the 5th and last day of each month. This means if you deposit before the 5th of a month, that amount earns interest for the entire month. Deposits after the 5th only earn from the next month. Formula: A = P × (1 + r)^t for each year's balance. Interest is credited to the account at the end of each financial year (March 31)." },
];

export default function SSYCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Sukanya Samriddhi Yojana Calculator" },
        ]),
        webAppSchema("SSY Calculator India 2026", canonicalUrl("/in/sukanya-samriddhi-yojana-calculator")),
        {
            "@context": "https://schema.org", "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map(f => ({
                "@type": "Question", name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-ssy" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "SSY Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Sukanya Samriddhi Yojana Calculator 2026</h1>
            <PageDesc>
                Calculate SSY maturity with 4 modes — Maturity Estimator (21-year growth schedule with inflation toggle),
                Partial Withdrawal Simulator (50% at age 18 for education), SSY vs PPF vs FD comparison, and Goal-Based
                Reverse Calculator. Current interest rate: <strong>8.2% p.a.</strong> | EEE tax-free | Section 80C.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <SSYCalculatorCore />

            <section className="in-content"><div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} /></section>
            <FAQAccordion title="SSY Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-ssy">What Is Sukanya Samriddhi Yojana (SSY)?</h2>
    <p><strong>Sukanya Samriddhi Yojana (SSY)</strong> is a government-backed savings scheme launched in January 2015 under the <em>Beti Bachao, Beti Padhao</em> (Save the Girl Child, Educate the Girl Child) initiative. It is designed specifically to build a financial corpus for the <strong>education and marriage</strong> of a girl child.</p>
    <p>SSY stands out among all Indian savings instruments for three reasons: (1) It offers the <strong>highest interest rate</strong> (8.2%) among government-guaranteed schemes, (2) It enjoys <strong>EEE (Triple Exempt)</strong> tax treatment — deposits, interest, and maturity are all tax-free, and (3) It is <strong>sovereign guaranteed</strong> with zero risk.</p>
    <div class="explanation__highlight">
        <strong>Key Numbers:</strong> ₹1,50,000/year for 15 years at 8.2% = approximately <strong>₹69.3 Lakh</strong> at maturity (year 21). Total invested: ₹22.5L. Interest earned: ₹46.8L — more than <strong>2× your investment</strong> returned as tax-free interest.
    </div>

    <h2 id="eligibility">SSY Eligibility &amp; Rules</h2>
    <table>
        <thead><tr><th>Criterion</th><th>Requirement</th></tr></thead>
        <tbody>
            <tr><td><strong>Girl&rsquo;s Age</strong></td><td>Below 10 years at account opening</td></tr>
            <tr><td><strong>Who Can Open</strong></td><td>Natural parents or legal guardian</td></tr>
            <tr><td><strong>Max Accounts/Family</strong></td><td>2 (3 if twins/triplets in second pregnancy)</td></tr>
            <tr><td><strong>Accounts/Girl</strong></td><td>Only 1 per girl child</td></tr>
            <tr><td><strong>NRI Eligibility</strong></td><td>Cannot open new; existing accounts can continue</td></tr>
            <tr><td><strong>Where to Open</strong></td><td>Any Post Office or 28 authorized banks</td></tr>
            <tr><td><strong>Deposit Period</strong></td><td>First 15 years only</td></tr>
            <tr><td><strong>Maturity</strong></td><td>21 years from account opening</td></tr>
        </tbody>
    </table>

    <h2 id="interest-rate-history">SSY Interest Rate 2026 &amp; History</h2>
    <p>The SSY interest rate is reviewed quarterly by the Ministry of Finance. Current rate: <strong>8.2% p.a.</strong></p>
    <table>
        <thead><tr><th>Period</th><th>Interest Rate</th></tr></thead>
        <tbody>
            <tr><td>Apr 2015 &ndash; Mar 2016</td><td>9.2%</td></tr>
            <tr><td>Apr 2016 &ndash; Sep 2016</td><td>8.6%</td></tr>
            <tr><td>Oct 2016 &ndash; Mar 2017</td><td>8.5%</td></tr>
            <tr><td>Apr 2017 &ndash; Jun 2017</td><td>8.4%</td></tr>
            <tr><td>Jul 2017 &ndash; Dec 2017</td><td>8.3%</td></tr>
            <tr><td>Jan 2018 &ndash; Sep 2018</td><td>8.1%</td></tr>
            <tr><td>Oct 2018 &ndash; Jun 2019</td><td>8.5%</td></tr>
            <tr><td>Jul 2019 &ndash; Mar 2020</td><td>8.4%</td></tr>
            <tr><td>Apr 2020 &ndash; Mar 2023</td><td>7.6%</td></tr>
            <tr><td>Apr 2023 &ndash; Present (2026)</td><td><strong>8.2%</strong></td></tr>
        </tbody>
    </table>

    <h2 id="deposit-rules">SSY Deposit Rules</h2>
    <table>
        <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
        <tbody>
            <tr><td><strong>Minimum Deposit</strong></td><td>₹250 per financial year</td></tr>
            <tr><td><strong>Maximum Deposit</strong></td><td>₹1,50,000 per financial year</td></tr>
            <tr><td><strong>Deposit Frequency</strong></td><td>Lump sum or multiple installments</td></tr>
            <tr><td><strong>Deposit Period</strong></td><td>First 15 years from account opening</td></tr>
            <tr><td><strong>Years 16&ndash;21</strong></td><td>No deposit needed; interest continues</td></tr>
            <tr><td><strong>Penalty (Missed Deposit)</strong></td><td>₹50/year + back-deposit of ₹250/year</td></tr>
            <tr><td><strong>Payment Modes</strong></td><td>Cash, cheque, DD, or online transfer</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> Deposit before the <strong>5th of each month</strong> to earn interest for that full month. Deposits after the 5th only earn interest from the next month. For maximum benefit, make your annual ₹1.5L deposit as a lump sum on April 1st each year.
    </div>

    <h2 id="calculation-formula">SSY Maturity Calculation Formula</h2>
    <div class="explanation__highlight">
        <strong>A = P &times; (1 + r)<sup>t</sup></strong> (applied iteratively for each year&rsquo;s balance)<br/>
        Where: <strong>P</strong> = Balance at start of year + deposit, <strong>r</strong> = Annual interest rate, <strong>t</strong> = Number of years
    </div>
    <h3>Worked Example: ₹1,50,000/year at 8.2% for 21 years</h3>
    <table>
        <thead><tr><th>Year</th><th>Deposit</th><th>Opening Balance</th><th>Interest</th><th>Closing Balance</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>₹1,50,000</td><td>₹1,50,000</td><td>₹12,300</td><td>₹1,62,300</td></tr>
            <tr><td>2</td><td>₹1,50,000</td><td>₹3,12,300</td><td>₹25,609</td><td>₹3,37,909</td></tr>
            <tr><td>5</td><td>₹1,50,000</td><td>₹8,83,527</td><td>₹72,449</td><td>₹9,55,976</td></tr>
            <tr><td>10</td><td>₹1,50,000</td><td>₹23,90,856</td><td>₹1,96,050</td><td>₹25,86,906</td></tr>
            <tr><td>15</td><td>₹1,50,000</td><td>₹44,54,466</td><td>₹3,65,266</td><td>₹48,19,732</td></tr>
            <tr><td>16</td><td>₹0</td><td>₹48,19,732</td><td>₹3,95,218</td><td>₹52,14,950</td></tr>
            <tr><td>21</td><td>₹0</td><td>₹64,10,938</td><td>₹5,25,697</td><td><strong>₹69,36,635</strong></td></tr>
        </tbody>
    </table>

    <h2 id="tax-benefits">Tax Benefits — EEE Status</h2>
    <p>SSY enjoys <strong>EEE (Exempt-Exempt-Exempt)</strong> status — the most favorable tax treatment available in India:</p>
    <table>
        <thead><tr><th>Tax Event</th><th>Treatment</th><th>Section</th></tr></thead>
        <tbody>
            <tr><td><strong>Deposit</strong></td><td>Deductible up to ₹1.5L/year</td><td>Section 80C</td></tr>
            <tr><td><strong>Interest</strong></td><td>Completely tax-free</td><td>Section 10</td></tr>
            <tr><td><strong>Maturity</strong></td><td>Completely tax-free</td><td>Section 10(11A)</td></tr>
            <tr><td><strong>Partial Withdrawal</strong></td><td>Tax-free</td><td>Section 10</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tax-Saving Combo:</strong> SSY (₹1.5L) + <a href="/in/ppf-calculator">PPF</a> (₹1.5L) = ₹3L invested in EEE instruments. However, Section 80C cap is ₹1.5L total. So optimize: ₹1.5L in SSY (for daughter) + ₹50K in <a href="/in/pension-calculator">NPS (80CCD(1B))</a> = ₹2L deduction. Use <a href="/in/income-tax-calculator">Income Tax Calculator</a> to plan.
    </div>

    <h2 id="withdrawal-rules">Partial Withdrawal &amp; Premature Closure</h2>
    <table>
        <thead><tr><th>Event</th><th>Rule</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td><strong>Partial Withdrawal</strong></td><td>Up to 50% of balance</td><td>Girl turns 18 + for higher education</td></tr>
            <tr><td><strong>Marriage Closure</strong></td><td>Full closure allowed</td><td>Girl turns 18 + for marriage</td></tr>
            <tr><td><strong>Death of Girl</strong></td><td>Full closure + balance to guardian</td><td>Death certificate required</td></tr>
            <tr><td><strong>Life-Threatening Illness</strong></td><td>Full premature closure</td><td>Medical certificate required</td></tr>
            <tr><td><strong>Normal Maturity</strong></td><td>Full balance + interest to girl</td><td>21 years from account opening</td></tr>
        </tbody>
    </table>

    <h2 id="ssy-vs-ppf-vs-fd">SSY vs PPF vs FD vs ELSS — Detailed Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>SSY</th><th>PPF</th><th>FD (5-yr Tax Saver)</th><th>ELSS</th></tr></thead>
        <tbody>
            <tr><td><strong>Returns</strong></td><td><strong>8.2%</strong></td><td>7.1%</td><td>6.5&ndash;7.5%</td><td>12&ndash;15% (market)</td></tr>
            <tr><td><strong>Tax Status</strong></td><td><strong>EEE</strong></td><td>EEE</td><td>Interest taxable</td><td>LTCG 12.5%</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>21 years</td><td>15 years</td><td>5 years</td><td><strong>3 years</strong></td></tr>
            <tr><td><strong>Risk</strong></td><td>Zero</td><td>Zero</td><td>Zero</td><td>Market risk</td></tr>
            <tr><td><strong>80C Benefit</strong></td><td>Yes (₹1.5L)</td><td>Yes (₹1.5L)</td><td>Yes (₹1.5L)</td><td>Yes (₹1.5L)</td></tr>
            <tr><td><strong>Eligibility</strong></td><td>Girl child &lt;10</td><td>Any Indian</td><td>Any Indian</td><td>Any Indian</td></tr>
            <tr><td><strong>₹1.5L/yr for 15 yrs</strong></td><td><strong>₹69.4L</strong></td><td>₹43.6L (15yr)</td><td>₹32.3L (post-tax)</td><td>₹74L+ (at 12%)</td></tr>
        </tbody>
    </table>

    <h2 id="documents">Documents Required to Open SSY Account</h2>
    <ol>
        <li><strong>Birth Certificate</strong> of the girl child (primary document)</li>
        <li><strong>Identity Proof of Guardian</strong> &mdash; Aadhaar Card, PAN Card, Voter ID, or Passport</li>
        <li><strong>Address Proof of Guardian</strong> &mdash; Aadhaar, utility bill, bank statement, or rental agreement</li>
        <li><strong>Application Form SSA-1</strong> &mdash; Available at post offices and authorized banks</li>
        <li><strong>Passport-size Photographs</strong> &mdash; Of the girl child and parent/guardian</li>
        <li><strong>Initial Deposit</strong> &mdash; Minimum ₹250 (cash, cheque, DD, or online)</li>
    </ol>

    <h2 id="authorized-banks">Banks &amp; Post Offices for SSY</h2>
    <p>SSY accounts can be opened at <strong>any India Post office</strong> and the following <strong>28 authorized banks</strong>:</p>
    <table>
        <thead><tr><th>Public Sector Banks</th><th>Private &amp; Other Banks</th></tr></thead>
        <tbody>
            <tr><td>State Bank of India (SBI)</td><td>ICICI Bank</td></tr>
            <tr><td>Punjab National Bank (PNB)</td><td>HDFC Bank</td></tr>
            <tr><td>Bank of Baroda</td><td>Axis Bank</td></tr>
            <tr><td>Canara Bank</td><td>IDBI Bank</td></tr>
            <tr><td>Union Bank of India</td><td>Bandhan Bank</td></tr>
            <tr><td>Bank of India</td><td>Punjab &amp; Sind Bank</td></tr>
            <tr><td>Central Bank of India</td><td>UCO Bank</td></tr>
            <tr><td>Indian Bank</td><td>Bank of Maharashtra</td></tr>
            <tr><td>Indian Overseas Bank</td><td>Dena Bank (merged with BoB)</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common Mistakes in SSY</h2>
    <ol>
        <li><strong>Not investing the maximum ₹1.5L</strong> &mdash; At ₹250/year, maturity is only ₹1,155. At ₹1.5L/year, it&rsquo;s ₹69.4L. Maximize your deposits every year.</li>
        <li><strong>Depositing after the 5th of the month</strong> &mdash; Interest is calculated on balance between 5th and month-end. Deposit before the 5th for full month&rsquo;s interest.</li>
        <li><strong>Forgetting the annual minimum</strong> &mdash; Missing the ₹250 minimum triggers ₹50/year penalty and account deactivation. Set a reminder for March.</li>
        <li><strong>Not considering inflation</strong> &mdash; ₹69L in 21 years = ~₹20L in today&rsquo;s purchasing power at 6% inflation. Supplement SSY with equity <a href="/in/sip-calculator">SIP</a> for real growth.</li>
        <li><strong>Choosing SSY over ELSS for short-term goals</strong> &mdash; SSY locks money for 21 years. If you need liquidity within 3&ndash;5 years, ELSS (3-year lock-in) is better for 80C.</li>
        <li><strong>Not transferring account when moving</strong> &mdash; SSY accounts can be transferred between post offices and banks. Don&rsquo;t abandon the old account; initiate transfer.</li>
    </ol>
`;

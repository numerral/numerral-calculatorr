import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import FDCalculatorIndiaCore from "@/components/calculator/FDCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "FD Calculator India 2026 — Fixed Deposit Interest Rate Calculator with Bank Comparison",
    description: "Free FD calculator with 4 modes: Maturity Calculator, Bank Rate Comparison (SBI/HDFC/ICICI/Axis/BOB), TDS & Tax Impact analyser, and FD vs PPF/SCSS/MF comparison. Includes year-by-year breakdown, senior citizen rates, Section 80C guide, and FD laddering strategy.",
    keywords: ["FD calculator", "fixed deposit calculator India", "FD interest calculator", "FD maturity calculator", "bank FD rates 2026", "TDS on FD", "tax-saver FD Section 80C", "FD vs PPF", "senior citizen FD rates", "FD laddering strategy", "DICGC insurance", "compound interest FD", "cumulative vs non-cumulative FD"],
    alternates: buildCountryAlternates("IN", "/in/fd-calculator", "fd-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a Fixed Deposit (FD)?", answer: "A Fixed Deposit (FD) is a financial instrument offered by banks and NBFCs in India where you deposit a lump sum amount for a fixed tenure at a predetermined interest rate. The deposit is held until maturity, after which you receive the principal plus accumulated interest. FDs are considered one of the safest investment options in India because bank deposits up to ₹5 lakh per depositor per bank are insured by the Deposit Insurance and Credit Guarantee Corporation (DICGC), a subsidiary of the Reserve Bank of India (RBI). FDs offer higher interest rates than savings accounts and are available for tenures ranging from 7 days to 10 years." },
    { question: "How is FD interest calculated in India?", answer: "Most Indian banks calculate FD interest using the compound interest formula: A = P × (1 + r/n)^(n×t), where A = maturity amount, P = principal (deposit amount), r = annual interest rate (as decimal), n = number of compounding periods per year (4 for quarterly, which is the standard in Indian banking), and t = tenure in years. For example, ₹5,00,000 deposited at 7% for 5 years with quarterly compounding: A = 5,00,000 × (1 + 0.07/4)^(4×5) = 5,00,000 × (1.0175)^20 = ₹7,07,390. The interest earned = ₹2,07,390. Non-cumulative FDs pay out interest periodically (monthly/quarterly) using simple interest calculations on the principal." },
    { question: "What is the difference between cumulative and non-cumulative FD?", answer: "Cumulative FD: Interest is compounded (typically quarterly) and reinvested into the principal. You receive the entire maturity amount (principal + all interest) at the end of the tenure. This gives higher total returns due to the power of compounding. Best for wealth building and long-term savings. Non-Cumulative FD: Interest is paid out at regular intervals — monthly, quarterly, half-yearly, or annually — based on your choice. The principal remains unchanged, and you receive only the original deposit at maturity. Best for retirees and those who need regular income. For example, ₹10 lakh at 7%: Cumulative (5 yr) → Maturity ₹14,14,778. Non-cumulative (monthly payout) → ₹5,833/month income, ₹10 lakh returned at maturity." },
    { question: "What are the current FD interest rates in India (2026)?", answer: "As of March 2026, FD rates for major banks (general public, below ₹3 Cr): SBI: 6.50%–6.80% (1–5 yr). HDFC Bank: 6.60%–7.00%. ICICI Bank: 6.70%–7.00%. Axis Bank: 6.70%–7.10%. Bank of Baroda: 6.50%–7.05%. Post Office TD: 6.90%–7.50%. Small Finance Banks like AU SFB and Ujjivan SFB offer higher rates of 7.25%–7.90% but may carry slightly higher risk. Senior citizens typically get an additional 0.25%–0.50% across all banks. Special schemes like BOB Square Drive (444 days) and SBI Amrit Vrishti often offer premium rates. Always verify latest rates on bank websites — rates change frequently based on RBI monetary policy." },
    { question: "What is TDS on FD interest and how can I avoid it?", answer: "TDS (Tax Deducted at Source) on FD interest: Banks deduct TDS at 10% if your total FD interest from that bank exceeds ₹50,000 per financial year (₹1,00,000 for senior citizens aged 60+). If PAN is not provided, TDS is charged at 20%. How to avoid TDS: If your total annual income is below the taxable limit (₹7 lakh under new regime), submit Form 15G (below age 60) or Form 15H (age 60+) to your bank. The new unified Form 121 has been introduced to simplify this process. Submit at the beginning of each financial year (April). Important: TDS is not the final tax — it's an advance collection. You must declare FD interest in your ITR and pay any additional tax based on your actual slab, or claim a refund if excess TDS was deducted." },
    { question: "What is a Tax-Saver FD under Section 80C?", answer: "A Tax-Saver FD (also called Tax-Saving Fixed Deposit) is a special 5-year FD that qualifies for tax deduction under Section 80C of the Income Tax Act. Key features: Maximum deduction: ₹1.5 lakh per financial year (shared limit with PPF, ELSS, LIC premiums, etc.). Lock-in period: Strict 5-year lock-in — premature withdrawal is NOT allowed. Joint holding: Only the first holder gets the 80C benefit. Interest is taxable: While the investment amount gets 80C deduction, the interest earned is FULLY taxable at your slab rate. This is a key disadvantage compared to PPF (where interest is also tax-free). No auto-renewal: Tax-saver FDs do not auto-renew. Nomination: Mandatory nomination is required. Available at all scheduled commercial banks, not NBFCs." },
    { question: "What are senior citizen FD benefits?", answer: "Senior citizens (aged 60+) enjoy several FD benefits: Higher interest rates: Most banks offer 0.25%–0.50% extra over general public rates. Some banks offer up to 0.75% more for super senior citizens (80+). Higher TDS threshold: TDS is deducted only if annual interest exceeds ₹1,00,000 (vs ₹50,000 for others). Form 15H: Seniors can submit Form 15H (instead of 15G) if their total income is below taxable limit. SCSS alternative: The Senior Citizens Savings Scheme (SCSS) offers 8.2% with quarterly payouts and 80C benefit — often better than bank FDs. PMVVY: The Pradhan Mantri Vaya Vandana Yojana offered guaranteed pension; check current availability. Tip: Consider FD laddering across multiple banks (each within ₹5L DICGC limit) for maximum safety and liquidity." },
    { question: "What is the premature withdrawal penalty on FDs?", answer: "Most banks allow premature withdrawal of FDs, but with a penalty that reduces your effective interest rate: Typical penalty: 0.50% to 1.00% reduction from the applicable rate for the period the FD was held. Example: If you break a 5-year FD (7% rate) after 2 years, the bank will pay the 2-year rate (say 6.5%) minus a 1% penalty = 5.5% effective rate on the amount for 2 years. Some banks offer partial premature withdrawal (breaking only a portion of the FD). Tax-Saver FDs (5-year 80C FDs) cannot be prematurely withdrawn — there is a strict lock-in. Non-callable FDs (like BOB Advantage FD) offer higher rates but do not allow premature withdrawal at all. RBI guidelines: Banks must allow premature withdrawal on callable FDs (most standard retail FDs). Check the specific penalty terms before opening your FD." },
    { question: "What is the FD laddering strategy?", answer: "FD laddering is a strategy where you split your total investment across multiple FDs with different maturity dates, rather than putting everything in a single FD. How it works: Instead of investing ₹10 lakh in one 5-year FD, create 5 FDs of ₹2 lakh each maturing in 1, 2, 3, 4, and 5 years. Benefits: (1) Liquidity — You have an FD maturing every year, reducing the need for premature withdrawal. (2) Rate optimization — You can reinvest each maturing FD at the prevailing rate, benefiting if rates rise. (3) TDS management — Spreading across banks/FDs can keep each below the TDS threshold. (4) DICGC coverage — Spreading across banks (each within ₹5L) maximizes deposit insurance. Example: ₹25 lakh split across 5 banks × 5 tenures = 25 FDs, each fully covered by DICGC insurance." },
    { question: "How does an FD compare to PPF?", answer: "FD vs PPF comparison for Indian investors: Interest Rate: FD = 6.50%–7.50% (varies by bank); PPF = 7.1% (government-fixed, revised quarterly). Tax on Interest: FD = Fully taxable at slab rate; PPF = 100% tax-free (EEE status). Tax Deduction: FD = Only 5-year tax-saver FD qualifies for 80C; PPF = All deposits up to ₹1.5L qualify for 80C. Liquidity: FD = Available with penalty (0.5–1%); PPF = Partial withdrawal after 7 years, loan from Year 3. Tenure: FD = 7 days to 10 years; PPF = 15 years (extendable in 5-year blocks). Safety: FD = DICGC cover up to ₹5L; PPF = Sovereign guarantee (100% safe). Verdict: For the 30% tax bracket, a 7% FD gives only ~4.9% after tax, while PPF gives 7.1% tax-free. PPF wins for long-term savings if you don't need liquidity." },
    { question: "Is FD interest taxable in India?", answer: "Yes, FD interest is fully taxable in India. Tax treatment: The interest earned on FDs is added to your total income and taxed at your applicable income tax slab rate (0%, 5%, 10%, 15%, 20%, or 30% + surcharge + cess). Interest is taxable on an accrual basis — even if you choose a cumulative FD (interest reinvested), you must pay tax on the accrued interest each year, not just at maturity. TDS is deducted at source (10% if PAN provided, 20% if not) when annual interest exceeds the threshold. You must report all FD interest in your Income Tax Return (ITR) — from all banks. Use your Form 26AS or AIS/TIS to verify TDS credits. Important: Only PPF and Sukanya Samriddhi Yojana offer tax-free interest on fixed-income instruments. All bank FDs, RDs, Post Office TDs, NSC, and SCSS have taxable interest." },
    { question: "What is the DICGC deposit insurance for FDs?", answer: "The Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly-owned subsidiary of the Reserve Bank of India, provides insurance coverage on bank deposits. Coverage: Up to ₹5,00,000 per depositor per bank — covering principal + interest across all deposit types (savings, current, FD, RD) in that bank. What's covered: All commercial banks (public and private sector), small finance banks, regional rural banks, cooperative banks, and local area banks. What's NOT covered: Deposits with NBFCs, cooperative societies (non-bank), and foreign bank branches not registered with RBI. Strategy: If you have more than ₹5 lakh to invest, spread your FDs across multiple banks so each bank's total is within the ₹5L DICGC limit. You don't need to apply for this insurance — it's automatic for all eligible bank deposits. The DICGC insurance premium is paid by the bank, not the depositor." },
    { question: "Can NRIs open Fixed Deposits in India?", answer: "Yes, NRIs can open FDs in India through special accounts: NRE FD (Non-Resident External): Funded from foreign earnings. Interest is tax-free in India. Fully repatriable (principal + interest). Rates are similar to domestic FD rates. NRO FD (Non-Resident Ordinary): Funded from Indian earnings (rent, dividends, etc.). Interest is taxable in India and subject to TDS at 30% + surcharge + cess (can be reduced via DTAA). Principal repatriation limited to USD 1 million per financial year. FCNR FD (Foreign Currency Non-Resident): Deposits in foreign currency (USD, GBP, EUR, etc.). Interest is tax-free in India. No currency risk as deposit and maturity are in the same foreign currency. All NRI FDs are eligible for DICGC coverage up to ₹5 lakh." },
    { question: "What is the Effective Annual Rate (EAR) for FDs?", answer: "The Effective Annual Rate (EAR) is the actual annual return on an FD after accounting for compounding frequency. It's always slightly higher than the stated (nominal) rate because of intra-year compounding. Formula: EAR = (1 + r/n)^n − 1, where r = nominal annual rate and n = compounding frequency. Examples at 7% nominal rate: Monthly compounding (n=12): EAR = 7.229%. Quarterly compounding (n=4): EAR = 7.186%. Half-yearly compounding (n=2): EAR = 7.123%. Annual compounding (n=1): EAR = 7.000%. Since most Indian banks compound FDs quarterly, a stated 7% FD actually yields 7.186% effective return. This is why our calculator shows both the nominal rate and the EAR — the EAR is the true return you earn." },
    { question: "How to open an FD online in India?", answer: "Most major banks allow online FD booking through their net banking or mobile app: Step 1: Log in to your bank's internet banking portal or mobile app (e.g., YONO for SBI, iMobile for ICICI, PayZapp for HDFC). Step 2: Navigate to 'Deposits' or 'Fixed Deposit' section. Step 3: Select deposit type (Cumulative/Non-Cumulative), enter amount, choose tenure, and set nomination. Step 4: Link your savings account for auto-debit and maturity credit. Step 5: Review interest rate, maturity date, maturity amount, and confirm. Documents needed: Existing savings account with KYC, PAN card, Aadhaar (for e-KYC). You can also open FDs at bank branches with the same documents plus a signed FD application form. Some banks like AU Small Finance Bank and Ujjivan SFB allow FD opening with just a video KYC — no branch visit needed." },
];

export default function FDCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "FD Calculator" },
        ]),
        webAppSchema("FD Calculator India 2026 — Fixed Deposit Interest Rate Calculator", canonicalUrl("/in/fd-calculator")),
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
            <Script id="schema-fd" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "FD Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>FD Calculator India 2026 — Fixed Deposit Interest Rate Calculator</h1>
            <PageDesc>
                Free FD interest calculator with 4 modes — Maturity Calculator with year-by-year breakdown, Bank Rate Comparison (SBI, HDFC, ICICI, Axis, BOB + 7 more), TDS &amp; Tax Impact analyser, and FD vs PPF/SCSS/MF/NPS comparison.
                Includes senior citizen rates, Section 80C tax-saver guide, and FD laddering strategy.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <FDCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Fixed Deposit Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-fd">What Is a Fixed Deposit (FD)?</h2>
    <p>A <strong>Fixed Deposit (FD)</strong> is one of the most popular and trusted savings instruments in India. When you open an FD, you deposit a lump sum amount with a bank or Non-Banking Financial Company (NBFC) for a <strong>fixed tenure</strong> at a <strong>predetermined interest rate</strong>. At the end of the tenure, you receive your principal plus the accumulated interest as the <strong>maturity amount</strong>.</p>
    <p>FDs are classified as <strong>term deposits</strong> under the Reserve Bank of India (RBI) guidelines. They are considered one of India&rsquo;s safest investment options because:</p>
    <ul>
        <li><strong>Capital Protection</strong> &mdash; Your principal is guaranteed (no market risk)</li>
        <li><strong>DICGC Insurance</strong> &mdash; Deposits up to <strong>?5 lakh per depositor per bank</strong> are insured by the Deposit Insurance and Credit Guarantee Corporation (a subsidiary of the RBI)</li>
        <li><strong>Guaranteed Returns</strong> &mdash; The interest rate is fixed at the time of deposit and does not change during the tenure, regardless of market conditions</li>
        <li><strong>Flexible Tenure</strong> &mdash; Available from 7 days to 10 years, giving you full control over your investment horizon</li>
    </ul>
    <div class="explanation__highlight">
        <strong>India Context:</strong> As of March 2026, Indians hold approximately <strong>?200 lakh crore</strong> in bank deposits, making FDs the single largest asset class in the country &mdash; larger than equity markets, gold, or real estate. Use our FD calculator above to plan your deposit strategy and compare rates across 12 banks instantly.
    </div>

    <h2 id="fd-interest-formula">How Is FD Interest Calculated?</h2>
    <p>Indian banks use <strong>compound interest</strong> for cumulative FDs, calculated using the standard formula:</p>
    <div class="explanation__highlight">
        <strong>A = P &times; (1 + r/n)<sup>n&times;t</sup></strong><br/><br/>
        Where:<br/>
        <strong>A</strong> = Maturity Amount (principal + interest)<br/>
        <strong>P</strong> = Principal amount (your deposit)<br/>
        <strong>r</strong> = Annual interest rate (as decimal; 7% = 0.07)<br/>
        <strong>n</strong> = Compounding frequency per year (most Indian banks use <strong>n = 4</strong> for quarterly compounding)<br/>
        <strong>t</strong> = Tenure in years<br/><br/>
        <strong>Interest Earned = A &minus; P</strong>
    </div>

    <h3>Worked Example &mdash; ?5 Lakh FD at 7% for 5 Years</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Principal (P)</strong></td><td>?5,00,000</td></tr>
            <tr><td><strong>Rate (r)</strong></td><td>7% (0.07)</td></tr>
            <tr><td><strong>Compounding (n)</strong></td><td>Quarterly (n = 4)</td></tr>
            <tr><td><strong>Tenure (t)</strong></td><td>5 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Calculation:</strong> A = 5,00,000 &times; (1 + 0.07/4)<sup>4&times;5</sup> = 5,00,000 &times; (1.0175)<sup>20</sup> = <strong>?7,07,390</strong><br/>
        <strong>Interest Earned = ?2,07,390</strong> on your ?5 lakh deposit over 5 years.
    </div>
    <p>For comparison, <strong>simple interest</strong> would give: SI = 5,00,000 &times; 0.07 &times; 5 = ?1,75,000. Compound interest earns <strong>?32,390 more</strong> (18.5% advantage) on the same deposit.</p>

    <h2 id="cumulative-vs-non-cumulative">Cumulative vs Non-Cumulative FD</h2>
    <p>Banks offer two types of FDs based on how interest is handled:</p>
    <table>
        <thead><tr><th>Feature</th><th>Cumulative FD</th><th>Non-Cumulative FD</th></tr></thead>
        <tbody>
            <tr><td><strong>Interest Handling</strong></td><td>Reinvested (compounded quarterly)</td><td>Paid out periodically (monthly/quarterly/half-yearly/annually)</td></tr>
            <tr><td><strong>Interest Received</strong></td><td>Only at maturity</td><td>At chosen intervals during tenure</td></tr>
            <tr><td><strong>Maturity Amount</strong></td><td>Higher (due to compounding)</td><td>Only principal returned</td></tr>
            <tr><td><strong>Total Returns</strong></td><td>Higher (interest-on-interest)</td><td>Lower (no compounding benefit)</td></tr>
            <tr><td><strong>Best For</strong></td><td>Wealth building, salaried individuals</td><td>Retirees who need regular income</td></tr>
            <tr><td><strong>Example: ?10L at 7%, 5 yrs</strong></td><td>Maturity: <strong>?14,14,778</strong></td><td>Monthly payout: <strong>?5,833</strong> + ?10L at maturity</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tip:</strong> If you don&rsquo;t need regular income, always choose a <strong>cumulative FD</strong> &mdash; your effective return is higher because interest earns interest. Compare both options using the FD Maturity mode in our calculator above. For SWP-based monthly income from mutual funds, see our <a href="/in/swp-calculator">SWP Calculator</a>.
    </div>

    <h2 id="fd-rates-2026">FD Interest Rates in India &mdash; March 2026</h2>
    <p>Here are the current Fixed Deposit rates from major Indian banks for retail deposits (below ?3 Crore) as of March 2026:</p>
    <table>
        <thead><tr><th>Bank</th><th>1 Year</th><th>3 Years</th><th>5 Years</th><th>Senior Citizen (5Y)</th></tr></thead>
        <tbody>
            <tr><td><strong>SBI</strong></td><td>6.80%</td><td>6.75%</td><td>6.50%</td><td>7.00%</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>6.60%</td><td>7.00%</td><td>7.00%</td><td>7.50%</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>6.70%</td><td>7.00%</td><td>7.00%</td><td>7.50%</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>6.70%</td><td>7.10%</td><td>7.00%</td><td>7.75%</td></tr>
            <tr><td><strong>Kotak Mahindra</strong></td><td>6.50%</td><td>7.10%</td><td>6.70%</td><td>7.20%</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>6.85%</td><td>7.05%</td><td>6.50%</td><td>7.15%</td></tr>
            <tr><td><strong>Punjab National Bank</strong></td><td>6.80%</td><td>7.00%</td><td>6.50%</td><td>7.00%</td></tr>
            <tr><td><strong>Canara Bank</strong></td><td>6.85%</td><td>7.00%</td><td>6.70%</td><td>7.20%</td></tr>
            <tr><td><strong>Post Office TD</strong></td><td>6.90%</td><td>7.10%</td><td>7.50%</td><td>7.50%</td></tr>
            <tr><td><strong>AU Small Finance Bank</strong></td><td>7.25%</td><td>7.50%</td><td>7.25%</td><td>7.75%</td></tr>
            <tr><td><strong>Ujjivan SFB</strong></td><td>7.40%</td><td>7.90%</td><td>7.60%</td><td>8.10%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Note:</strong> Rates are indicative and subject to change. Banks revise FD rates based on RBI repo rate decisions and liquidity conditions. Small Finance Banks (SFBs) offer higher rates but may carry slightly higher perceived risk. All listed banks are covered under <strong>DICGC insurance up to ?5 lakh</strong>. Use our Bank Comparison mode above to see exact maturity amounts.
    </div>
    <p><em>Special Rate Schemes:</em> Many banks offer limited-period special FD schemes with higher rates for specific tenures &mdash; BOB Square Drive (444 days), SBI Amrit Vrishti, and HDFC special tenures. Check bank websites for current special offers.</p>

    <h2 id="senior-citizen-benefits">Senior Citizen FD Benefits</h2>
    <p>Indian banks provide preferential treatment to senior citizens (aged 60 and above) for Fixed Deposits:</p>
    <ul>
        <li><strong>Higher Interest Rates</strong> &mdash; Typically 0.25% to 0.50% above the general public rate. Some banks offer up to <strong>0.75% extra for super senior citizens (80+)</strong></li>
        <li><strong>Higher TDS Threshold</strong> &mdash; TDS is deducted only when annual FD interest exceeds <strong>?1,00,000</strong> (vs ?50,000 for others)</li>
        <li><strong>Form 15H</strong> &mdash; Seniors can submit Form 15H to request no TDS if total income is below taxable limit</li>
        <li><strong>SCSS Alternative</strong> &mdash; The <strong>Senior Citizens Savings Scheme (SCSS)</strong> offers <strong>8.2% p.a.</strong> with quarterly payouts and Section 80C benefit &mdash; often better than bank FDs. Use our <a href="/in/pension-calculator">Pension Calculator</a> to compare</li>
    </ul>
    <table>
        <thead><tr><th>Bank</th><th>General Rate (5Y)</th><th>Senior Citizen Rate (5Y)</th><th>Extra Benefit</th></tr></thead>
        <tbody>
            <tr><td><strong>SBI</strong></td><td>6.50%</td><td>7.00%</td><td>+0.50%</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>7.00%</td><td>7.50%</td><td>+0.50%</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>7.00%</td><td>7.75%</td><td>+0.75%</td></tr>
            <tr><td><strong>Ujjivan SFB</strong></td><td>7.60%</td><td>8.10%</td><td>+0.50%</td></tr>
        </tbody>
    </table>

    <h2 id="tds-on-fd">TDS on Fixed Deposit Interest &mdash; Rules for 2026</h2>
    <p>Banks are required to deduct <strong>Tax Deducted at Source (TDS)</strong> on FD interest under Section 194A of the Income Tax Act:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Regular Citizen</th><th>Senior Citizen (60+)</th></tr></thead>
        <tbody>
            <tr><td><strong>TDS Threshold</strong></td><td>?50,000 per FY</td><td>?1,00,000 per FY</td></tr>
            <tr><td><strong>TDS Rate (with PAN)</strong></td><td>10%</td><td>10%</td></tr>
            <tr><td><strong>TDS Rate (without PAN)</strong></td><td>20%</td><td>20%</td></tr>
            <tr><td><strong>Declaration Form</strong></td><td>Form 15G / Form 121</td><td>Form 15H / Form 121</td></tr>
            <tr><td><strong>Condition for no TDS</strong></td><td>Total income below taxable limit</td><td>Total income below taxable limit</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important:</strong> TDS is per bank, not per FD. If you have 3 FDs in SBI earning ?20K, ?18K, and ?15K interest = ?53K total &mdash; TDS of 10% will be deducted on the entire ?53K. Strategy: Spread FDs across multiple banks to stay below the threshold at each bank.<br/><br/>
        Use the <strong>TDS &amp; Tax mode</strong> in our calculator above to see exact TDS and post-tax returns. Check your tax slab with our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.
    </div>

    <h2 id="section-80c-fd">Tax-Saver FD Under Section 80C</h2>
    <p>A <strong>Tax-Saver Fixed Deposit</strong> is a special 5-year FD that qualifies for deduction under <strong>Section 80C</strong> of the Income Tax Act:</p>
    <table>
        <thead><tr><th>Feature</th><th>Tax-Saver FD</th><th>Regular FD</th></tr></thead>
        <tbody>
            <tr><td><strong>Section 80C Deduction</strong></td><td>Yes &mdash; up to ?1.5 lakh/year</td><td>No</td></tr>
            <tr><td><strong>Lock-in Period</strong></td><td>5 years (strict)</td><td>No lock-in</td></tr>
            <tr><td><strong>Premature Withdrawal</strong></td><td>Not allowed</td><td>Allowed (with penalty)</td></tr>
            <tr><td><strong>Interest Taxability</strong></td><td>Fully taxable at slab rate</td><td>Fully taxable at slab rate</td></tr>
            <tr><td><strong>Joint Holding</strong></td><td>Allowed (only first holder gets 80C)</td><td>Allowed</td></tr>
            <tr><td><strong>Auto-Renewal</strong></td><td>No</td><td>Yes (optional)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Comparison with PPF:</strong> While Tax-Saver FDs offer 80C benefit, the interest is taxable. <a href="/in/ppf-calculator">PPF</a> offers EEE status (investment, interest, AND maturity all tax-free). For individuals in the 30% slab, a 7% tax-saver FD gives ~4.9% post-tax vs PPF&rsquo;s 7.1% tax-free. PPF wins for long-term tax-efficient savings. For more 80C options, check our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.
    </div>

    <h2 id="fd-laddering">FD Laddering Strategy &mdash; Optimise Liquidity &amp; Returns</h2>
    <p><strong>FD laddering</strong> is a smart investment strategy where you spread your deposit across multiple FDs with staggered maturity dates:</p>
    <h3>How It Works &mdash; ?10 Lakh Example</h3>
    <table>
        <thead><tr><th>FD #</th><th>Amount</th><th>Tenure</th><th>Rate</th><th>Maturity Date</th></tr></thead>
        <tbody>
            <tr><td>FD-1</td><td>?2,00,000</td><td>1 Year</td><td>6.80%</td><td>March 2027</td></tr>
            <tr><td>FD-2</td><td>?2,00,000</td><td>2 Years</td><td>7.00%</td><td>March 2028</td></tr>
            <tr><td>FD-3</td><td>?2,00,000</td><td>3 Years</td><td>7.10%</td><td>March 2029</td></tr>
            <tr><td>FD-4</td><td>?2,00,000</td><td>4 Years</td><td>7.05%</td><td>March 2030</td></tr>
            <tr><td>FD-5</td><td>?2,00,000</td><td>5 Years</td><td>7.00%</td><td>March 2031</td></tr>
        </tbody>
    </table>
    <p><strong>Benefits:</strong></p>
    <ol>
        <li><strong>Annual Liquidity</strong> &mdash; An FD matures every year, reducing premature withdrawal penalties</li>
        <li><strong>Rate Optimization</strong> &mdash; When FD-1 matures in 2027, you reinvest at the prevailing 5-year rate (which may be higher if RBI has increased rates)</li>
        <li><strong>TDS Management</strong> &mdash; Interest earned on each FD stays lower, potentially below the TDS threshold per bank</li>
        <li><strong>DICGC Maximization</strong> &mdash; By spreading across different banks, you maximize the ?5L deposit insurance per bank</li>
    </ol>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> For larger sums (?25L+), combine laddering with multi-bank distribution: 5 banks &times; 5 tenures = 25 FDs, each within ?5L DICGC limit. This gives you maximum insurance coverage, annual liquidity, and rate diversification. Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to model each FD&rsquo;s growth independently.
    </div>

    <h2 id="fd-vs-alternatives">FD vs PPF vs SCSS vs SIP &mdash; Comprehensive Comparison</h2>
    <p>How does an FD stack up against other popular Indian investment options?</p>
    <table>
        <thead><tr><th>Feature</th><th>Bank FD</th><th>PPF</th><th>SCSS</th><th>Equity SIP</th></tr></thead>
        <tbody>
            <tr><td><strong>Interest Rate</strong></td><td>6.50&ndash;7.50%</td><td>7.10%</td><td>8.20%</td><td>~12% (historical avg)</td></tr>
            <tr><td><strong>Compounding</strong></td><td>Quarterly</td><td>Annually</td><td>Quarterly</td><td>Daily (NAV-based)</td></tr>
            <tr><td><strong>Tenure</strong></td><td>7 days&ndash;10 yrs</td><td>15 years</td><td>5 years</td><td>Flexible</td></tr>
            <tr><td><strong>Tax on Returns</strong></td><td>Fully taxable</td><td>EEE (tax-free)</td><td>Fully taxable</td><td>12.5% LTCG (>?1.25L)</td></tr>
            <tr><td><strong>Section 80C</strong></td><td>5-yr tax-saver only</td><td>Yes (up to ?1.5L)</td><td>Yes</td><td>Only ELSS</td></tr>
            <tr><td><strong>Liquidity</strong></td><td>Anytime (penalty)</td><td>Partial from Year 7</td><td>After 1 year (penalty)</td><td>Anytime (exit load)</td></tr>
            <tr><td><strong>Risk</strong></td><td>Very Low</td><td>Zero (sovereign)</td><td>Zero (sovereign)</td><td>High (market-linked)</td></tr>
            <tr><td><strong>DICGC Cover</strong></td><td>Up to ?5L</td><td>Sovereign guarantee</td><td>Sovereign guarantee</td><td>SEBI regulated</td></tr>
            <tr><td><strong>Post-Tax Return (30% slab)</strong></td><td>~4.9%</td><td><strong>7.1%</strong></td><td>~5.7%</td><td>~10.5%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Verdict:</strong> For <strong>guaranteed, tax-free</strong> returns: <a href="/in/ppf-calculator">PPF</a> and <a href="/in/sukanya-samriddhi-yojana-calculator">Sukanya Samriddhi</a> are unmatched. For <strong>regular fixed income</strong> (retirees): SCSS at 8.2% with quarterly payouts — see our <a href="/in/pension-calculator">Pension Calculator</a>. For <strong>wealth creation</strong>: <a href="/in/sip-calculator">Equity SIPs</a> outperform FDs over 10+ year horizons but carry market risk. FDs remain ideal for <strong>short-to-medium term</strong> parking of funds, emergency fund, and capital preservation.
    </div>

    <h2 id="premature-withdrawal">Premature Withdrawal &amp; Penalty Rates</h2>
    <p>If you need to break your FD before maturity, here&rsquo;s what to expect:</p>
    <table>
        <thead><tr><th>Bank</th><th>Penalty</th><th>Non-Callable FDs</th></tr></thead>
        <tbody>
            <tr><td><strong>SBI</strong></td><td>0.50% below the card rate for the period held</td><td>Not offered</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>1.00% below the applicable rate</td><td>Not offered</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>0.50&ndash;1.00% depending on tenure</td><td>Not offered</td></tr>
            <tr><td><strong>Bank of Baroda</strong></td><td>1.00% for general; BOB Advantage FD is non-callable</td><td>BOB Advantage FD</td></tr>
            <tr><td><strong>Post Office TD</strong></td><td>Savings account rate for premature closure in first year</td><td>Not applicable</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Strategy:</strong> Instead of one large FD, split into smaller FDs (FD laddering). If you need funds urgently, break only one small FD instead of the entire deposit. This minimizes penalty impact. Also, some banks offer <strong>sweep-in FDs</strong> linked to your savings account &mdash; the bank automatically breaks FDs in ?1,000 denominations when your savings balance falls short.
    </div>

    <h2 id="open-fd-online">How to Open an FD Online in India</h2>
    <p>Most major Indian banks allow online FD booking through their net banking portal or mobile app:</p>
    <ol>
        <li><strong>Log in</strong> to your bank&rsquo;s internet banking (SBI &rarr; YONO, ICICI &rarr; iMobile, HDFC &rarr; NetBanking/PayZapp)</li>
        <li><strong>Navigate</strong> to Deposits → Fixed Deposit → Open New FD</li>
        <li><strong>Choose</strong> deposit type (Cumulative/Non-Cumulative), enter amount, select tenure</li>
        <li><strong>Set nomination</strong> (mandatory for tax-saver FDs)</li>
        <li><strong>Review</strong> the interest rate, maturity date, maturity amount, and confirm</li>
    </ol>
    <p><strong>Documents needed:</strong> Existing savings account with completed KYC, PAN card (for TDS compliance), Aadhaar (for e-KYC verification). Some banks like AU SFB and Ujjivan SFB offer <strong>video KYC-based FD opening</strong> without visiting a branch.</p>

    <h2 id="common-mistakes">7 Common Mistakes When Investing in Fixed Deposits</h2>
    <ol>
        <li><strong>Not comparing rates across banks</strong> &mdash; Even a 0.50% difference on ?10 lakh over 5 years is ?28,000+ in extra interest. Use our Bank Comparison mode above.</li>
        <li><strong>Ignoring post-tax returns</strong> &mdash; A 7% FD in the 30% tax bracket gives only ~4.9% post-tax, which may not beat inflation (~5&ndash;6%). Use our TDS &amp; Tax mode to see the real picture. Check your slab with our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.</li>
        <li><strong>Putting all money in one FD</strong> &mdash; Use FD laddering (see above) for better liquidity, rate optimization, and DICGC coverage.</li>
        <li><strong>Not claiming 80C on tax-saver FDs</strong> &mdash; If you have a 5-year FD, make sure you claim the Section 80C deduction in your ITR.</li>
        <li><strong>Forgetting to submit Form 15G/15H</strong> &mdash; If your total income is below the taxable limit, submit the form at the <em>start</em> of each financial year to avoid unnecessary TDS.</li>
        <li><strong>Auto-renewal at the old rate</strong> &mdash; Many banks auto-renew FDs at the then-prevailing rate, which may be lower. Review and rebook manually for the best available rate/scheme.</li>
        <li><strong>Ignoring inflation</strong> &mdash; A 6.5% FD in the 30% slab gives ~4.55% post-tax and &minus;1.45% real return after 6% inflation. For inflation-beating returns, consider <a href="/in/ppf-calculator">PPF</a> or <a href="/in/sip-calculator">equity SIPs</a>.</li>
    </ol>

    <h2 id="related-tools">Related Calculators &amp; Tools</h2>
    <ul>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> &mdash; Understand the CI formula that powers FD interest calculations. Includes FD comparison mode with SBI/HDFC/ICICI rates.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> &mdash; Calculate 15-year PPF maturity at 7.1% with tax-free EEE status. The best tax-free alternative to FDs.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> &mdash; Compare equity mutual fund SIP returns with FD growth over 10+ year horizons.</li>
        <li><strong><a href="/in/sukanya-samriddhi-yojana-calculator">Sukanya Samriddhi Calculator</a></strong> &mdash; 8.2% tax-free returns for girl child savings &mdash; the highest guaranteed return in India.</li>
        <li><strong><a href="/in/pension-calculator">Pension Calculator</a></strong> &mdash; Plan retirement with SCSS (8.2%), NPS, and EPS pension estimates.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> &mdash; Find your exact tax slab to calculate post-tax FD returns accurately.</li>
        <li><strong><a href="/in/swp-calculator">SWP Calculator</a></strong> &mdash; Compare SWP from mutual funds with non-cumulative FD monthly payouts.</li>
        <li><strong><a href="/in/lumpsum-calculator">Lumpsum Calculator</a></strong> &mdash; Compare one-time mutual fund investment returns with FD maturity.</li>
        <li><strong><a href="/in/crorepati-calculator">Crorepati Calculator</a></strong> &mdash; Can you reach ?1 Crore with FD laddering? Find out.</li>
        <li><strong><a href="/in/xirr-calculator">XIRR Calculator</a></strong> &mdash; Calculate the true return on FDs with premature withdrawal or partial breakage using XIRR.</li>
    </ul>
`;

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import CompoundInterestIndiaCore from "@/components/calculator/CompoundInterestIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Compound Interest Calculator India 2026 — FD, PPF, SIP Returns Calculator",
    description: "Free compound interest calculator for India with 4 modes: Lump Sum, Recurring SIP, FD Comparison (SBI/HDFC/ICICI/PPF/NSC/SCSS rates), and Cost of Delay. Includes compounding frequency selector, Rule of 72, CI vs SI comparison, year-by-year growth table, and Section 80C tax guide.",
    keywords: ["compound interest calculator India", "compound interest formula", "FD interest calculator", "CI calculator", "power of compounding", "Rule of 72", "compound interest vs simple interest", "PPF interest rate", "FD comparison calculator", "cost of delay investing"],
    alternates: { canonical: canonicalUrl("/in/compound-interest-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is compound interest?", answer: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (which is calculated only on the principal), compound interest creates a 'snowball effect' where your money grows exponentially over time. Albert Einstein reportedly called compound interest the 'eighth wonder of the world.' In India, most investment products — FDs, PPF, RD, NSC, and mutual funds — use compound interest." },
    { question: "What is the compound interest formula?", answer: "The standard compound interest formula is: A = P × (1 + r/n)^(n×t), where A = maturity amount, P = principal, r = annual interest rate (in decimal), n = number of compounding periods per year, and t = time in years. The compound interest earned = A − P. For example, ₹1 lakh at 7% compounded quarterly for 5 years: A = 1,00,000 × (1 + 0.07/4)^(4×5) = ₹1,41,478. So CI = ₹41,478." },
    { question: "What is the difference between compound interest and simple interest?", answer: "Simple Interest (SI) = P × r × t — interest is calculated only on the original principal, resulting in linear growth. Compound Interest (CI) uses A = P × (1 + r/n)^(n×t) — interest is calculated on principal PLUS accumulated interest, creating exponential growth. Example: ₹1 lakh at 8% for 20 years → SI = ₹2,60,000 vs CI (annual) = ₹4,66,096. That's ₹2,06,096 more with CI — an 80% advantage." },
    { question: "How often is compound interest calculated in India?", answer: "Compounding frequency varies by product: Bank Fixed Deposits (FDs) typically compound quarterly (n=4). PPF compounds annually (n=1) — interest is calculated monthly on the minimum balance between the 5th and last day but credited annually on March 31. Recurring Deposits (RDs) compound quarterly. NSC compounds annually. Post Office Time Deposits compound quarterly. Mutual fund NAVs are calculated daily, effectively giving daily compounding." },
    { question: "Which Indian investments use compound interest?", answer: "Most Indian investment products use compound interest: (1) Bank Fixed Deposits — quarterly compounding, (2) PPF — annual compounding at 7.1%, (3) Recurring Deposits — quarterly compounding, (4) National Savings Certificate — annual compounding at 7.7%, (5) Kisan Vikas Patra — annual compounding at 7.5%, (6) Sukanya Samriddhi Yojana — annual compounding at 8.2%, (7) Senior Citizens Savings Scheme — quarterly compounding at 8.2%, (8) Mutual Funds — daily NAV compounding, (9) NPS — market-linked compounding." },
    { question: "What is the Rule of 72?", answer: "The Rule of 72 is a quick mental shortcut to estimate how long it takes to double your money: Years to Double = 72 ÷ Interest Rate. Examples: At 6% → 12 years, at 7.1% (PPF rate) → ~10.1 years, at 8% → 9 years, at 12% (equity mutual fund avg.) → 6 years, at 15% → 4.8 years. This rule is most accurate for rates between 5% and 12%. For the Rule of 114 (tripling): Years to Triple = 114 ÷ Interest Rate." },
    { question: "How much will ₹1 lakh grow in 10 years at 7%?", answer: "At 7% interest compounded annually for 10 years: ₹1,00,000 grows to ₹1,96,715 (interest = ₹96,715). If compounded quarterly: ₹2,00,160 (interest = ₹1,00,160). If compounded monthly: ₹2,00,966 (interest = ₹1,00,966). The difference between annual and monthly compounding on ₹1 lakh over 10 years is approximately ₹4,251 — quarterly compounding captures most of this benefit with ₹3,445 extra over annual." },
    { question: "Is FD interest compounded quarterly or annually?", answer: "Most Indian banks (SBI, HDFC, ICICI, Axis, Kotak) compound FD interest quarterly for cumulative deposits. However, the interest is paid/credited at the chosen frequency: monthly, quarterly, half-yearly, annually, or at maturity. For cumulative FDs (where you want maximum returns), the interest compounds quarterly, which is why the effective annual yield is slightly higher than the stated rate. For example, 7% stated rate with quarterly compounding gives an effective annual rate of 7.186%." },
    { question: "What is the PPF interest rate and compounding frequency?", answer: "As of Q1 FY 2025-26, the PPF interest rate is 7.1% per annum, compounded annually. Interest is calculated monthly on the minimum balance between the 5th and the last day of each month, but it is credited to your PPF account only once a year on March 31st. To maximize PPF interest: deposit before the 5th of each month. PPF has EEE tax status — contributions (up to ₹1.5L/year under 80C), interest, and maturity are all 100% tax-free." },
    { question: "Is compound interest taxable in India?", answer: "Tax treatment depends on the investment: FD interest is fully taxable at your income tax slab rate. TDS of 10% is deducted if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). PPF interest is 100% tax-free (EEE status). NSC interest is taxable yearly as accrued income, but qualifies for Section 80C deduction (effectively reinvested interest gets 80C benefit). SCSS interest is taxable but the principal qualifies for 80C. Sukanya Samriddhi has EEE status like PPF. Mutual fund gains are taxed as LTCG/STCG depending on holding period." },
    { question: "What is TDS on FD interest?", answer: "Banks deduct TDS (Tax Deducted at Source) at 10% on FD interest if the total interest from all FDs with that bank exceeds ₹40,000 in a financial year (₹50,000 for senior citizens aged 60+). If you don't provide PAN, TDS rises to 20%. You can submit Form 15G (below 60) or Form 15H (60+) to request no TDS if your total income is below the taxable limit. TDS is not the final tax — you must still declare FD interest in your ITR and pay any additional tax based on your slab." },
    { question: "What is the cost of delaying investments?", answer: "The 'cost of delay' shows how starting late drastically reduces your final corpus. Example: investing ₹5,000/month at 12% return → Starting at age 25 (35 years to age 60): corpus = ₹3.24 Crore. Starting at age 35 (25 years): corpus = ₹94.88 Lakhs. Starting at age 45 (15 years): corpus = ₹25.22 Lakhs. The 10-year delay from 25 to 35 costs you ₹2.30 Crore — even though you only invest ₹6 lakh more by starting at 25. Time is the most powerful factor in compounding." },
    { question: "How does compounding frequency affect returns?", answer: "Higher compounding frequency gives slightly higher returns because interest is reinvested more often. For ₹1 lakh at 7% for 10 years: Annual compounding → ₹1,96,715. Semi-annual → ₹1,98,979. Quarterly → ₹2,00,160. Monthly → ₹2,00,966. Daily → ₹2,01,375. The difference between annual and daily is ₹4,660 on ₹1 lakh. However, the difference between quarterly and daily is only ₹1,215 — so quarterly compounding captures most of the benefit (which is why banks use it)." },
    { question: "Is daily compounding better than monthly?", answer: "Daily compounding gives a marginally higher return than monthly, but the difference is negligible for practical purposes. For ₹1 lakh at 7% for 10 years: Monthly compounding = ₹2,00,966, Daily compounding = ₹2,01,375 — difference of just ₹409 over 10 years. The real benefit comes from moving from annual to quarterly compounding (₹3,445 extra). In India, most savings products compound quarterly (FDs) or annually (PPF), so the debate between daily and monthly is mostly theoretical." },
    { question: "How to calculate compound interest in Excel or Google Sheets?", answer: "Use the FV (Future Value) function for lump sum: =FV(rate/n, n*t, 0, -P). Example: ₹1 lakh, 7%, quarterly, 5 years → =FV(7%/4, 4*5, 0, -100000) = ₹1,41,478. For SIP/recurring: =FV(rate/12, months, -monthly_payment, 0). Example: ₹5,000/mo, 12%, 15 years → =FV(12%/12, 180, -5000, 0) = ₹25,22,447. You can also use the POWER function: =P*POWER(1+r/n, n*t). The CI earned = FV result − initial investment." },
];

export default function CompoundInterestPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Compound Interest Calculator" },
        ]),
        webAppSchema("Compound Interest Calculator India 2026", canonicalUrl("/in/compound-interest-calculator")),
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
            <Script id="schema-ci" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Compound Interest Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Compound Interest Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate compound interest with 4 modes — Lump Sum, Recurring SIP, FD Comparison (SBI/HDFC/ICICI/PPF/NSC/SCSS rates), and Cost of Delay. Includes compounding frequency selector, year-by-year growth table,
                Rule of 72, CI vs SI comparison, and Section 80C tax guide.
            </p>
            <AuthorBadge categoryKey="salary" />
            <CompoundInterestIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Compound Interest Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Power of compounding via mutual fund SIPs</div>
                        </div>
                    </Link>
                    <Link href="/in/ppf-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">PPF Calculator</div>
                            <div className="in-related-link__desc">7.1% annual compounding, EEE tax-free</div>
                        </div>
                    </Link>
                    <Link href="/in/hlv-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🛡️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">HLV Calculator</div>
                            <div className="in-related-link__desc">Life cover using present value of income</div>
                        </div>
                    </Link>
                    <Link href="/in/home-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏠</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Home Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Home loans also use compound interest for EMI</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-compound-interest">What Is Compound Interest?</h2>
    <p><strong>Compound interest (CI)</strong> is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike <strong>simple interest</strong>, which is calculated only on the original principal, compound interest creates exponential growth — often called the <strong>&ldquo;snowball effect&rdquo;</strong> of investing.</p>
    <p>Albert Einstein reportedly called compound interest the <em>&ldquo;eighth wonder of the world — he who understands it, earns it; he who doesn&rsquo;t, pays it.&rdquo;</em> Whether or not the quote is truly Einstein&rsquo;s, the principle is universally powerful.</p>
    <div class="explanation__highlight">
        <strong>India Context:</strong> Almost every investment product in India uses compound interest — Fixed Deposits (FDs), <a href="/in/ppf-calculator">PPF</a>, Recurring Deposits (RDs), NSC, KVP, Sukanya Samriddhi Yojana, and <a href="/in/sip-calculator">mutual fund SIPs</a>. Understanding compounding is the foundation of personal finance in India.
    </div>
    <p>The key variables that determine compound interest growth:</p>
    <ul>
        <li><strong>Principal (P)</strong> — the initial amount invested or deposited</li>
        <li><strong>Interest Rate (r)</strong> — the annual rate of return (e.g., 7% for PPF, 6.5% for SBI FD)</li>
        <li><strong>Compounding Frequency (n)</strong> — how often interest is compounded per year (quarterly for FDs, annually for PPF)</li>
        <li><strong>Time Period (t)</strong> — the number of years the money stays invested</li>
    </ul>

    <h2 id="compound-interest-formula">Compound Interest Formula</h2>
    <p>The standard formula to calculate compound interest is:</p>
    <div class="explanation__highlight">
        <strong>A = P &times; (1 + r/n)<sup>n&times;t</sup></strong><br/><br/>
        Where:<br/>
        <strong>A</strong> = Maturity Amount (principal + interest)<br/>
        <strong>P</strong> = Principal amount (initial investment)<br/>
        <strong>r</strong> = Annual interest rate (as a decimal; 7% = 0.07)<br/>
        <strong>n</strong> = Number of compounding periods per year (1=annual, 4=quarterly, 12=monthly, 365=daily)<br/>
        <strong>t</strong> = Time period in years<br/><br/>
        <strong>Compound Interest = A &minus; P</strong>
    </div>

    <h3>Worked Example — ₹1 Lakh FD at 7% for 5 Years</h3>
    <p>Let&rsquo;s apply the formula with a common Indian Fixed Deposit scenario:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Principal (P)</strong></td><td>₹1,00,000</td></tr>
            <tr><td><strong>Rate (r)</strong></td><td>7% (0.07)</td></tr>
            <tr><td><strong>Compounding (n)</strong></td><td>Quarterly (n = 4)</td></tr>
            <tr><td><strong>Time (t)</strong></td><td>5 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Calculation:</strong> A = 1,00,000 &times; (1 + 0.07/4)<sup>4&times;5</sup> = 1,00,000 &times; (1.0175)<sup>20</sup> = <strong>₹1,41,478</strong><br/>
        <strong>Compound Interest earned = ₹41,478</strong>
    </div>
    <p>Compare this with simple interest: SI = 1,00,000 &times; 0.07 &times; 5 = ₹35,000. Compound interest earns <strong>₹6,478 more</strong> (18.5% advantage) on the same deposit.</p>

    <h2 id="ci-vs-si">Compound Interest vs Simple Interest — Detailed Comparison</h2>
    <p>The gap between compound and simple interest widens dramatically with time and higher rates:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Simple Interest (SI)</th><th>Compound Interest (CI)</th></tr></thead>
        <tbody>
            <tr><td><strong>Formula</strong></td><td>SI = P &times; r &times; t</td><td>CI = P(1 + r/n)<sup>nt</sup> &minus; P</td></tr>
            <tr><td><strong>Interest on</strong></td><td>Original principal only</td><td>Principal + accumulated interest</td></tr>
            <tr><td><strong>Growth pattern</strong></td><td>Linear (straight line)</td><td>Exponential (accelerating curve)</td></tr>
            <tr><td><strong>₹1L at 8% for 5 yrs</strong></td><td>₹1,40,000</td><td>₹1,46,933 (quarterly)</td></tr>
            <tr><td><strong>₹1L at 8% for 10 yrs</strong></td><td>₹1,80,000</td><td>₹2,19,112 (quarterly)</td></tr>
            <tr><td><strong>₹1L at 8% for 20 yrs</strong></td><td>₹2,60,000</td><td>₹4,80,102 (quarterly)</td></tr>
            <tr><td><strong>₹1L at 8% for 30 yrs</strong></td><td>₹3,40,000</td><td>₹10,57,646 (quarterly)</td></tr>
            <tr><td><strong>Common usage</strong></td><td>Rare (some personal loans)</td><td>FDs, PPF, RDs, SIPs, home loans</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> At 8% for 30 years, CI earns <strong>₹7,17,646</strong> in interest vs ₹2,40,000 with SI — a <strong>3× difference</strong>. This is why long-term investors in India always prioritize compound interest instruments.
    </div>

    <h2 id="compounding-frequency">Compounding Frequency — How It Affects Returns</h2>
    <p>Higher compounding frequency means interest is reinvested more often, giving slightly higher returns:</p>
    <table>
        <thead><tr><th>Frequency</th><th>n</th><th>₹1 Lakh at 7% for 10 yrs</th><th>Interest Earned</th><th>Extra vs Annual</th></tr></thead>
        <tbody>
            <tr><td><strong>Annually</strong></td><td>1</td><td>₹1,96,715</td><td>₹96,715</td><td>&mdash;</td></tr>
            <tr><td><strong>Semi-Annually</strong></td><td>2</td><td>₹1,98,979</td><td>₹98,979</td><td>+₹2,264</td></tr>
            <tr><td><strong>Quarterly</strong></td><td>4</td><td>₹2,00,160</td><td>₹1,00,160</td><td>+₹3,445</td></tr>
            <tr><td><strong>Monthly</strong></td><td>12</td><td>₹2,00,966</td><td>₹1,00,966</td><td>+₹4,251</td></tr>
            <tr><td><strong>Daily</strong></td><td>365</td><td>₹2,01,375</td><td>₹1,01,375</td><td>+₹4,660</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Practical Tip:</strong> Most Indian bank FDs compound <strong>quarterly</strong> — this captures ~74% of the maximum benefit (quarterly gets ₹3,445 extra vs annual; daily only adds ₹1,215 more over quarterly). This is why quarterly compounding is the sweet spot used by banks.
    </div>
    <p>The concept of <strong>Effective Annual Rate (EAR)</strong> accounts for this difference: at 7% stated rate with quarterly compounding, the EAR = (1 + 0.07/4)<sup>4</sup> &minus; 1 = <strong>7.186%</strong>.</p>

    <h2 id="rule-of-72">Rule of 72 — How Long to Double Your Money</h2>
    <p>The <strong>Rule of 72</strong> is a quick mental formula: <strong>Years to Double = 72 &divide; Interest Rate</strong>.</p>
    <table>
        <thead><tr><th>Interest Rate</th><th>Years to Double</th><th>India Investment</th></tr></thead>
        <tbody>
            <tr><td><strong>6%</strong></td><td>12.0 years</td><td>Bank Savings Account</td></tr>
            <tr><td><strong>7.1%</strong></td><td>10.1 years</td><td><a href="/in/ppf-calculator">PPF</a> (current rate)</td></tr>
            <tr><td><strong>7.5%</strong></td><td>9.6 years</td><td>KVP (Kisan Vikas Patra)</td></tr>
            <tr><td><strong>7.7%</strong></td><td>9.4 years</td><td>NSC (National Savings Certificate)</td></tr>
            <tr><td><strong>8%</strong></td><td>9.0 years</td><td>Good FD / SCSS</td></tr>
            <tr><td><strong>10%</strong></td><td>7.2 years</td><td>Balanced Mutual Fund</td></tr>
            <tr><td><strong>12%</strong></td><td>6.0 years</td><td>Equity Mutual Fund (avg)</td></tr>
            <tr><td><strong>15%</strong></td><td>4.8 years</td><td>Small/Mid-Cap Fund (high risk)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Related Rules:</strong><br/>
        <strong>Rule of 114</strong> — Years to <em>triple</em> = 114 &divide; rate (e.g., at 7% → 16.3 years)<br/>
        <strong>Rule of 144</strong> — Years to <em>quadruple</em> = 144 &divide; rate (e.g., at 8% → 18 years)
    </div>

    <h2 id="india-fd-rates">India FD Interest Rates — 2026 Comparison</h2>
    <p>Here are the current Fixed Deposit rates from major Indian banks as of Q1 FY 2025&ndash;26 (compounding quarterly):</p>
    <table>
        <thead><tr><th>Bank / Scheme</th><th>1 Year</th><th>3 Year</th><th>5 Year</th><th>Senior Citizen (5Y)</th></tr></thead>
        <tbody>
            <tr><td><strong>SBI</strong></td><td>6.80%</td><td>6.75%</td><td>6.50%</td><td>7.00%</td></tr>
            <tr><td><strong>HDFC Bank</strong></td><td>6.60%</td><td>7.00%</td><td>7.00%</td><td>7.50%</td></tr>
            <tr><td><strong>ICICI Bank</strong></td><td>6.70%</td><td>7.00%</td><td>7.00%</td><td>7.50%</td></tr>
            <tr><td><strong>Axis Bank</strong></td><td>6.70%</td><td>7.10%</td><td>7.00%</td><td>7.75%</td></tr>
            <tr><td><strong>Kotak Mahindra</strong></td><td>6.50%</td><td>7.10%</td><td>6.70%</td><td>7.20%</td></tr>
            <tr><td><strong>Post Office TD</strong></td><td>6.90%</td><td>7.10%</td><td>7.50%</td><td>7.50%</td></tr>
        </tbody>
    </table>
    <p><em>Rates are indicative and subject to change. Check bank websites for the latest rates. Senior Citizen rates typically carry a 0.25&ndash;0.50% premium.</em></p>

    <h2 id="government-schemes">Government Schemes — Compounding Details</h2>
    <p>India&rsquo;s sovereign-backed small savings schemes offer guaranteed compound interest returns:</p>
    <table>
        <thead><tr><th>Scheme</th><th>Rate (FY26 Q1)</th><th>Compounding</th><th>Lock-in</th><th>Tax Status</th><th>80C Eligible</th></tr></thead>
        <tbody>
            <tr><td><strong><a href="/in/ppf-calculator">Public Provident Fund (PPF)</a></strong></td><td>7.1%</td><td>Annually</td><td>15 years</td><td>✅ EEE (fully exempt)</td><td>✅ Up to ₹1.5L</td></tr>
            <tr><td><strong>National Savings Certificate (NSC)</strong></td><td>7.7%</td><td>Annually</td><td>5 years</td><td>Interest taxable</td><td>✅ Up to ₹1.5L</td></tr>
            <tr><td><strong>Kisan Vikas Patra (KVP)</strong></td><td>7.5%</td><td>Annually</td><td>~115 months</td><td>Interest taxable</td><td>❌</td></tr>
            <tr><td><strong>Senior Citizens Savings Scheme (SCSS)</strong></td><td>8.2%</td><td>Quarterly</td><td>5 years</td><td>Interest taxable</td><td>✅ Up to ₹1.5L</td></tr>
            <tr><td><strong>Sukanya Samriddhi Yojana (SSY)</strong></td><td>8.2%</td><td>Annually</td><td>21 years (from a/c opening)</td><td>✅ EEE (fully exempt)</td><td>✅ Up to ₹1.5L</td></tr>
            <tr><td><strong>Post Office Time Deposit (5Y)</strong></td><td>7.5%</td><td>Quarterly</td><td>5 years</td><td>Interest taxable</td><td>✅ (5-year TD only)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Best for Tax-Free Returns:</strong> PPF (7.1%) and Sukanya Samriddhi (8.2%) offer EEE status — no tax on investment, interest, or maturity. For retired individuals, SCSS at 8.2% gives the highest fixed rate but interest is taxable.
    </div>

    <h2 id="tax-treatment">Tax Treatment of Compound Interest in India</h2>
    <p>Understanding the tax impact is critical because it significantly affects your <em>real</em> returns:</p>
    <table>
        <thead><tr><th>Investment</th><th>Tax on Interest/Returns</th><th>TDS</th><th>Section 80C</th><th>After-Tax Return (30% slab)</th></tr></thead>
        <tbody>
            <tr><td><strong>Bank FD</strong></td><td>Fully taxable at slab rate</td><td>10% if interest &gt; ₹40K</td><td>Only 5-year tax-saver FD</td><td>~4.55% (on 6.5% FD)</td></tr>
            <tr><td><strong>PPF</strong></td><td>100% tax-free (EEE)</td><td>None</td><td>✅</td><td><strong>7.1% (full)</strong></td></tr>
            <tr><td><strong>NSC</strong></td><td>Annually taxable (accrued)</td><td>None</td><td>✅ (including reinvested interest)</td><td>~5.39%</td></tr>
            <tr><td><strong>SCSS</strong></td><td>Fully taxable at slab rate</td><td>10% if interest &gt; ₹50K</td><td>✅</td><td>~5.74%</td></tr>
            <tr><td><strong>Sukanya Samriddhi</strong></td><td>100% tax-free (EEE)</td><td>None</td><td>✅</td><td><strong>8.2% (full)</strong></td></tr>
            <tr><td><strong>Equity Mutual Fund (LTCG)</strong></td><td>12.5% on gains &gt; ₹1.25L/yr</td><td>None</td><td>Only ELSS</td><td>Varies</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> A 6.5% FD in the 30% tax bracket gives only ~4.55% after tax — <em>lower than the inflation rate</em> of ~5&ndash;6%. PPF at 7.1% (tax-free) or Sukanya at 8.2% (tax-free) are the clear winners for guaranteed, inflation-beating, tax-efficient returns. Use our <a href="/in/ppf-calculator">PPF Calculator</a> to see your corpus grow.
    </div>

    <h2 id="cost-of-delay">The Cost of Delay — Why Starting Early Matters</h2>
    <p>The most powerful factor in compounding is <strong>time</strong> — not the amount invested or the rate of return. Here&rsquo;s a real-world example:</p>
    <table>
        <thead><tr><th>Scenario</th><th>Start at Age 25</th><th>Start at Age 35</th><th>Start at Age 45</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly Investment</strong></td><td>₹5,000</td><td>₹5,000</td><td>₹5,000</td></tr>
            <tr><td><strong>Expected Return</strong></td><td>12% p.a.</td><td>12% p.a.</td><td>12% p.a.</td></tr>
            <tr><td><strong>Years to Age 60</strong></td><td>35 years</td><td>25 years</td><td>15 years</td></tr>
            <tr><td><strong>Total Invested</strong></td><td>₹21,00,000</td><td>₹15,00,000</td><td>₹9,00,000</td></tr>
            <tr><td><strong>Corpus at 60</strong></td><td style="color:#16a34a"><strong>₹3.24 Cr</strong></td><td>₹94.88 L</td><td>₹25.22 L</td></tr>
            <tr><td><strong>Interest Earned</strong></td><td>₹3.03 Cr</td><td>₹79.88 L</td><td>₹16.22 L</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>The Math:</strong> A 10-year delay (age 25 → 35) costs you <strong>₹2.30 Crore</strong> in final wealth. You only invest ₹6 lakh more by starting at 25, but your corpus is 3.4× larger. This is why financial planners say: <em>&ldquo;The best time to start investing was yesterday. The second best time is today.&rdquo;</em>
    </div>

    <h2 id="recurring-deposits">Compound Interest for Recurring Deposits (RDs)</h2>
    <p>Recurring Deposits work differently from lump-sum FDs. With an RD, you make fixed monthly deposits and interest compounds quarterly:</p>
    <ul>
        <li><strong>Compounding:</strong> Quarterly (like FDs)</li>
        <li><strong>Each installment:</strong> Earns interest from the date of deposit to maturity</li>
        <li><strong>First installment:</strong> Earns interest for the full tenure</li>
        <li><strong>Last installment:</strong> Earns interest for only one month</li>
        <li><strong>Tax:</strong> Interest is fully taxable at slab rate (TDS applies if &gt; ₹40K/year, ₹50K for senior citizens)</li>
    </ul>
    <p>For example, ₹5,000/month RD at 6.5% for 5 years: Total deposited = ₹3,00,000. Maturity = ~₹3,53,790. Interest = ~₹53,790.</p>

    <h2 id="continuous-compounding">Continuous Compounding — The Mathematical Limit</h2>
    <p>When compounding frequency approaches infinity (every instant), we get <strong>continuous compounding</strong>:</p>
    <div class="explanation__highlight">
        <strong>Formula:</strong> A = P &times; e<sup>r&times;t</sup><br/>
        Where <strong>e</strong> = Euler&rsquo;s number ≈ 2.71828<br/><br/>
        Example: ₹1 lakh at 7% for 10 years → A = 1,00,000 &times; e<sup>0.07&times;10</sup> = 1,00,000 &times; 2.01375 = <strong>₹2,01,375</strong>
    </div>
    <p>The difference between daily compounding and continuous compounding is negligible (often less than ₹1 on ₹1 lakh over 10 years). This concept is mainly used in financial engineering and derivative pricing.</p>

    <h2 id="inflation-impact">How Inflation Erodes Compound Interest Returns</h2>
    <p>When evaluating compound interest returns, always consider <strong>real returns</strong> (after inflation):</p>
    <table>
        <thead><tr><th>Investment</th><th>Nominal Rate</th><th>After Tax (30% slab)</th><th>After Inflation (6%)</th><th>Real Return</th></tr></thead>
        <tbody>
            <tr><td><strong>Bank FD</strong></td><td>6.50%</td><td>4.55%</td><td>&minus;1.45%</td><td style="color:#dc2626"><strong>Negative ❌</strong></td></tr>
            <tr><td><strong>PPF</strong></td><td>7.10%</td><td>7.10% (EEE)</td><td>+1.10%</td><td style="color:#16a34a"><strong>Positive ✅</strong></td></tr>
            <tr><td><strong>SCSS</strong></td><td>8.20%</td><td>5.74%</td><td>&minus;0.26%</td><td style="color:#d97706"><strong>Barely Zero ⚠️</strong></td></tr>
            <tr><td><strong>Sukanya Samriddhi</strong></td><td>8.20%</td><td>8.20% (EEE)</td><td>+2.20%</td><td style="color:#16a34a"><strong>Positive ✅</strong></td></tr>
            <tr><td><strong>Equity MF (avg LTCG)</strong></td><td>12.00%</td><td>~10.50%</td><td>+4.50%</td><td style="color:#16a34a"><strong>Strong ✅</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Takeaway:</strong> A bank FD at 6.5% in the 30% tax bracket gives a <em>negative real return</em> after inflation. For long-term wealth creation, tax-free instruments like <a href="/in/ppf-calculator">PPF</a> or <a href="/in/sip-calculator">equity SIPs</a> are essential to beat inflation.
    </div>

    <h2 id="ci-in-excel">How to Calculate Compound Interest in Excel / Google Sheets</h2>
    <p>Use these built-in functions for quick calculations:</p>
    <div class="explanation__highlight">
        <strong>Lump Sum (FV function):</strong><br/>
        =FV(rate/n, n*t, 0, -P)<br/>
        Example: ₹1L, 7%, quarterly, 5 yrs → =FV(7%/4, 4*5, 0, -100000) = <strong>₹1,41,478</strong>
    </div>
    <div class="explanation__highlight">
        <strong>SIP / Recurring (FV function):</strong><br/>
        =FV(rate/12, months, -monthly_payment, 0)<br/>
        Example: ₹5,000/mo, 12%, 15 yrs → =FV(12%/12, 180, -5000, 0) = <strong>₹25,22,447</strong>
    </div>
    <div class="explanation__highlight">
        <strong>Using POWER function:</strong><br/>
        =P*POWER(1+r/n, n*t)<br/>
        Example: =100000*POWER(1+0.07/4, 4*5) = <strong>₹1,41,478</strong>
    </div>
    <p>For <strong>Compound Interest only</strong> (without principal): =FV(…) &minus; P or =P*POWER(1+r/n, n*t) &minus; P.</p>

    <h2 id="common-mistakes">Common Mistakes in Compound Interest Calculations</h2>
    <ol>
        <li><strong>Confusing stated rate with effective rate</strong> — 7% compounded quarterly is actually 7.186% effective annual rate. Our calculator above shows both.</li>
        <li><strong>Ignoring tax impact</strong> — FD interest is taxable, so a 6.5% FD gives only ~4.55% post-tax for the 30% slab. Always compare post-tax returns.</li>
        <li><strong>Not adjusting for inflation</strong> — A 7% return with 6% inflation gives only 1% real growth. Use real return for long-term planning.</li>
        <li><strong>Assuming constant rates</strong> — <a href="/in/ppf-calculator">PPF</a> and small savings rates are revised quarterly by the government. FD rates change with RBI repo rate.</li>
        <li><strong>Withdrawing early</strong> — Breaking an FD before maturity usually attracts a 0.5&ndash;1% penalty, reducing your effective return.</li>
        <li><strong>Comparing different compounding frequencies</strong> — A 7% quarterly FD vs 7.2% annual deposit: use the calculator above to see which gives higher maturity.</li>
        <li><strong>Not considering the cost of delay</strong> — Even a 5-year delay can cost lakhs in lost compounding. Use our Cost of Delay mode above to see the impact.</li>
    </ol>

    <h2 id="related-tools">Related Calculators &amp; Tools</h2>
    <ul>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Systematic Investment Plans use compounding through market-linked returns. Compare lump sum CI vs SIP returns.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Calculate your PPF maturity with 7.1% annual compounding and tax-free EEE benefits.</li>
        <li><strong><a href="/in/hlv-calculator">HLV Calculator</a></strong> — Human Life Value uses present value (reverse of compounding) to determine insurance cover.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Home loan EMI is derived using compound interest on the reducing balance. See how CI powers your EMI calculation.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — Car loan interest also compounds — check your total interest outgo.</li>
        <li><strong><a href="/in/age-calculator">Age Calculator</a></strong> — Calculate your exact age gap for cost-of-delay compounding analysis.</li>
    </ul>
`;

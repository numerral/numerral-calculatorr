import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import XIRRCalculatorCore from "@/components/calculator/XIRRCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "XIRR Calculator India 2026 — True SIP Return, XIRR vs CAGR, Newton-Raphson Solver",
    description: "Free XIRR Calculator with 4 modes: True XIRR (add custom date + amount rows, Newton-Raphson solver), SIP XIRR Quick (vs CAGR comparison), XIRR vs CAGR vs Absolute Return, and What-If Analyser (target XIRR reverse solver). Covers XIRR formula, Excel guide, FIFO taxation, negative XIRR meaning.",
    keywords: ["XIRR calculator", "XIRR mutual fund India", "XIRR vs CAGR", "SIP return calculator", "extended internal rate of return", "XIRR formula", "XIRR Excel India", "Newton-Raphson XIRR", "portfolio return calculator"],
    alternates: buildCountryAlternates("IN", "/in/xirr-calculator", "xirr-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is XIRR in mutual funds?", answer: "XIRR (Extended Internal Rate of Return) is the annualized rate of return that accounts for the exact timing and amount of every cash flow in your investment. For SIP investors, each monthly installment enters the market on a different date, so each installment has a different holding period. XIRR solves for the single discount rate that makes the Net Present Value (NPV) of all cash flows equal zero. It is the gold standard for measuring SIP and portfolio returns in India." },
    { question: "How is XIRR different from CAGR?", answer: "CAGR (Compound Annual Growth Rate) only uses two data points — initial investment and final value — treating the entire amount as invested on day 1. XIRR accounts for every individual cash flow and its exact date. For a ₹10K/month SIP over 3 years (₹3.6L invested), CAGR treats all ₹3.6L as invested at the start, while XIRR correctly recognizes that the last installment was invested only 1 month ago. XIRR always gives a higher and more accurate return for SIPs because later installments had less time to grow." },
    { question: "How do I calculate XIRR for my SIP?", answer: "Step 1: List all SIP installments as negative amounts (outflows) with their exact dates. Step 2: Add the current portfolio value as a positive amount (inflow) with today's date. Step 3: Apply the XIRR formula. In Excel/Google Sheets: =XIRR(amounts_range, dates_range). Our calculator does this automatically — use the SIP XIRR mode, enter your monthly amount, duration, and current value to get instant results." },
    { question: "What does negative XIRR mean?", answer: "A negative XIRR means your investment has generated a loss — the current portfolio value is less than total invested amount. For example, if you invested ₹1,20,000 via SIP over 12 months and current value is ₹1,10,000, your XIRR will be negative (approximately -15% to -18% depending on market timing). Negative XIRR doesn't mean you should panic — SIP investments often show negative XIRR in the first 1-2 years during market corrections before recovering." },
    { question: "Can XIRR be greater than 100%?", answer: "Yes, XIRR can exceed 100% in cases of short holding periods with significant gains. For example, if you invested ₹1,00,000 three months ago and it's now worth ₹1,30,000 (30% absolute gain), the annualized XIRR would be approximately 185% because XIRR extrapolates the 3-month return to a full year. Be cautious interpreting very high XIRRs from short periods — they represent the annualized equivalent, not actual yearly returns." },
    { question: "How to calculate XIRR in Excel?", answer: "In Excel: (1) Column A: Enter dates of all investments and the current date. (2) Column B: Enter amounts — negative for investments (e.g., -10000), positive for redemptions/current value. (3) In any cell, type: =XIRR(B2:B13, A2:A13). (4) Format the cell as Percentage. The result is your annualized return. Important: You must have at least one negative and one positive value. If you get #NUM! error, try adding a guess parameter: =XIRR(B2:B13, A2:A13, 0.1)." },
    { question: "How to calculate XIRR in Google Sheets?", answer: "Google Sheets uses the same XIRR function as Excel. Format: =XIRR(cashflow_range, date_range, [guess]). Example: =XIRR(B2:B13, A2:A13). Ensure dates are in valid date format (use DATE(year, month, day) if needed). The optional [guess] parameter defaults to 0.1 (10%). Google Sheets may handle convergence differently than Excel, so if you get errors, try different guess values like 0.5 or -0.1." },
    { question: "What is the XIRR formula?", answer: "XIRR finds the rate 'r' that makes the NPV of all cash flows equal zero: NPV = Σ [Ci / (1+r)^((di - d0)/365)] = 0, where Ci is each cash flow amount, di is the date of that cash flow, d0 is the date of the first cash flow, and r is the XIRR. This equation cannot be solved algebraically — it requires the Newton-Raphson iterative method to converge on the solution. Our calculator uses this exact method with up to 200 iterations." },
    { question: "What is the Newton-Raphson method in XIRR?", answer: "The Newton-Raphson method is a numerical technique for finding roots of equations. For XIRR: (1) Start with an initial guess (typically 10%). (2) Calculate NPV at this rate. (3) Calculate the derivative of NPV. (4) Adjust the rate: new_rate = old_rate - NPV/NPV'. (5) Repeat until NPV ≈ 0 (within 0.000001). This converges very quickly — usually within 10-20 iterations. Excel, Google Sheets, and our calculator all use this method internally." },
    { question: "Is XIRR annualized?", answer: "Yes, XIRR always produces an annualized (yearly) return, regardless of the actual investment period. If your SIP ran for 18 months, XIRR gives you the equivalent annual rate. This makes it easy to compare investments of different durations. However, for very short periods (1-3 months), annualized XIRR can appear misleadingly high or low. For periods under 12 months, consider looking at absolute returns alongside XIRR." },
    { question: "When should I use CAGR instead of XIRR?", answer: "Use CAGR when you made a single lump-sum investment with no additional transactions — just one buy and one current value. Examples: FD maturity, one-time stock purchase held for years, PPF maturity. Use XIRR when you have multiple transactions at different times — SIPs, additional purchases, partial redemptions, dividend reinvestments. For most mutual fund investors who invest via SIP, XIRR is always the correct metric." },
    { question: "Can I calculate XIRR for my entire portfolio?", answer: "Yes — consolidate ALL transactions from ALL investments into one list. Include every SIP, lump sum, redemption, and dividend from stocks, mutual funds, gold, and FDs. Add the total current value of everything as the final positive cash flow. Apply XIRR to get your portfolio-level annualized return. This is extremely useful for comparing your overall investment performance against benchmarks like Nifty 50 (which has returned ~12-14% CAGR over 15 years)." },
    { question: "Why does XIRR change when I add new SIP installments?", answer: "Each new SIP installment is a fresh cash flow with its own date. When you add it, the calculation re-weights all cash flows. If the market has recently fallen, the new installment buys units at a lower NAV, potentially improving your XIRR over time (rupee cost averaging). If the market has risen sharply and then corrects, adding a new installment at a high NAV can temporarily lower your XIRR. This is normal and expected." },
    { question: "What is a good XIRR for mutual funds in India?", answer: "Benchmarks for Indian mutual funds: Large Cap equity funds: 10-14% XIRR over 5+ years. Mid/Small Cap: 14-20% XIRR over 5+ years. Balanced/Hybrid: 8-12% XIRR. Debt funds: 6-8% XIRR. Index funds (Nifty 50): ~12% XIRR over 15+ years. Important: These are long-term averages. Short-term XIRR can be extremely volatile. A good XIRR should beat inflation (6-7%) + provide real returns. Any XIRR above 12% over 5+ years is considered good for Indian equity." },
    { question: "XIRR vs absolute returns — which should I track?", answer: "Track XIRR for performance comparison and long-term monitoring. Track absolute returns for tax planning and goal tracking. Example: Your SIP shows ₹5L invested → ₹7L current value = 40% absolute return. But XIRR tells you this 40% gain was earned over 3 years of staggered investments, translating to ~18% annualized. For tax purposes (LTCG computation), absolute per-unit gain matters. For evaluating fund manager performance, XIRR is superior." },
];

export default function XIRRCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "XIRR Calculator" },
        ]),
        webAppSchema("XIRR Calculator India 2026", canonicalUrl("/in/xirr-calculator")),
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
            <Script id="schema-xirr" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "XIRR Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>XIRR Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate true annualized return with 4 modes — True XIRR (add custom date + amount rows with Newton-Raphson
                solver), SIP XIRR Quick Mode (vs CAGR comparison), XIRR vs CAGR vs Absolute Return, and What-If Analyser
                (reverse-solve target XIRR). Covers the XIRR formula, Excel/Sheets guide, and negative XIRR meaning.
            </p>
            <AuthorBadge categoryKey="salary" />
            <XIRRCalculatorCore />

            <section className="in-content"><div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} /></section>
            <FAQAccordion title="XIRR Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Estimate SIP returns, then verify with XIRR</div>
                        </div>
                    </Link>
                    <Link href="/in/lumpsum-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Lumpsum Calculator</div>
                            <div className="in-related-link__desc">CAGR suits lump sum; XIRR suits SIP</div>
                        </div>
                    </Link>
                    <Link href="/in/swp-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💸</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SWP Calculator</div>
                            <div className="in-related-link__desc">Track withdrawal returns using XIRR</div>
                        </div>
                    </Link>
                    <Link href="/in/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest Calculator</div>
                            <div className="in-related-link__desc">Understand the compounding XIRR annualizes</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-xirr">What Is XIRR (Extended Internal Rate of Return)?</h2>
    <p><strong>XIRR (Extended Internal Rate of Return)</strong> is the annualized rate of return that accounts for the <strong>exact timing and amount of every cash flow</strong> in your investment. It is the most accurate metric for measuring returns on <a href="/in/sip-calculator">SIPs</a>, portfolios with multiple transactions, and any investment where money enters or exits at irregular intervals.</p>
    <p>Unlike simple returns or <strong>CAGR</strong> (which assumes all money was invested at once), XIRR mathematically weights each cash flow by its actual holding period. This makes it the <strong>gold standard for Indian mutual fund investors</strong> who predominantly use SIPs.</p>
    <div class="explanation__highlight">
        <strong>Simple Analogy:</strong> Imagine 12 people join a bus at different bus stops. CAGR calculates the average journey distance as if all 12 boarded at Stop 1. XIRR correctly accounts for the fact that each person boarded at a different stop — giving a more accurate &ldquo;average distance traveled&rdquo; for each passenger.
    </div>

    <h2 id="xirr-formula">XIRR Formula &amp; Newton-Raphson Method</h2>
    <p>XIRR finds the rate <strong>r</strong> that makes the Net Present Value (NPV) of all cash flows equal zero:</p>
    <div class="explanation__highlight">
        <strong>NPV = &sum; [C<sub>i</sub> / (1 + r)<sup>(d<sub>i</sub> &minus; d<sub>0</sub>) / 365</sup>] = 0</strong><br/>
        Where: <strong>C<sub>i</sub></strong> = Cash flow amount (negative for investments, positive for redemptions),
        <strong>d<sub>i</sub></strong> = Date of cash flow, <strong>d<sub>0</sub></strong> = Date of first cash flow, <strong>r</strong> = XIRR
    </div>
    <p>This equation <strong>cannot be solved algebraically</strong> because <em>r</em> appears as an exponent for multiple terms. The <strong>Newton-Raphson iterative method</strong> is used:</p>
    <ol>
        <li>Start with an initial guess (typically 10%)</li>
        <li>Calculate NPV at this rate</li>
        <li>Calculate the derivative (slope) of NPV with respect to rate</li>
        <li>Adjust: <strong>r<sub>new</sub> = r<sub>old</sub> &minus; NPV / NPV&prime;</strong></li>
        <li>Repeat until NPV &asymp; 0 (within 0.000001 tolerance)</li>
    </ol>
    <p>This typically converges in 10&ndash;20 iterations. Excel, Google Sheets, and our calculator all use this method internally.</p>

    <h2 id="xirr-vs-cagr">XIRR vs CAGR vs IRR — Complete Comparison</h2>
    <table>
        <thead><tr><th>Factor</th><th>XIRR</th><th>CAGR</th><th>IRR</th></tr></thead>
        <tbody>
            <tr><td><strong>Full Name</strong></td><td>Extended Internal Rate of Return</td><td>Compound Annual Growth Rate</td><td>Internal Rate of Return</td></tr>
            <tr><td><strong>Cash Flows</strong></td><td>Multiple, <strong>irregular</strong> dates</td><td>Single invest + single final value</td><td>Multiple, <strong>regular</strong> intervals</td></tr>
            <tr><td><strong>Date Handling</strong></td><td>Exact dates (day-level)</td><td>Only start &amp; end dates</td><td>Equal-period intervals</td></tr>
            <tr><td><strong>Formula</strong></td><td>NPV = 0 (Newton-Raphson)</td><td>(FV/PV)<sup>1/n</sup> &minus; 1</td><td>NPV = 0 (periodic)</td></tr>
            <tr><td><strong>Best For</strong></td><td><strong>SIPs, portfolios, SWPs</strong></td><td>Lump sum, FD, PPF</td><td>EMIs, annuities</td></tr>
            <tr><td><strong>Result</strong></td><td>Annualized %</td><td>Annualized %</td><td>Per-period %</td></tr>
            <tr><td><strong>Accuracy for SIP</strong></td><td><strong>Most accurate</strong></td><td>Misleading (understates)</td><td>Only if equal intervals</td></tr>
        </tbody>
    </table>

    <h2 id="sip-xirr-example">How to Calculate XIRR for SIP — Worked Example</h2>
    <h3>12-Month SIP of ₹10,000/month → Current Value ₹1,35,000</h3>
    <table>
        <thead><tr><th>Date</th><th>Cash Flow</th><th>Type</th></tr></thead>
        <tbody>
            <tr><td>10-Apr-2025</td><td>&minus;₹10,000</td><td>SIP Installment 1</td></tr>
            <tr><td>10-May-2025</td><td>&minus;₹10,000</td><td>SIP Installment 2</td></tr>
            <tr><td>10-Jun-2025</td><td>&minus;₹10,000</td><td>SIP Installment 3</td></tr>
            <tr><td colspan="3" style="text-align:center">... (9 more monthly installments) ...</td></tr>
            <tr><td>10-Mar-2026</td><td>&minus;₹10,000</td><td>SIP Installment 12</td></tr>
            <tr><td><strong>30-Mar-2026</strong></td><td><strong>+₹1,35,000</strong></td><td><strong>Current Portfolio Value</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Results:</strong> Total invested = ₹1,20,000 | Current value = ₹1,35,000 | Absolute gain = ₹15,000 (12.5%)<br/>
        <strong>CAGR</strong> = (1,35,000/1,20,000)<sup>1/1</sup> &minus; 1 = <strong>12.5%</strong> (treats all ₹1.2L as invested on day 1)<br/>
        <strong>XIRR</strong> = <strong>~25.1%</strong> (correctly weights each installment&rsquo;s holding period)
    </div>

    <h2 id="excel-guide">How to Use XIRR in Excel &amp; Google Sheets</h2>
    <h3>Step-by-Step</h3>
    <ol>
        <li><strong>Column A</strong>: Enter dates of all investments (SIP dates) in DD/MM/YYYY format</li>
        <li><strong>Column B</strong>: Enter amounts &mdash; negative (&minus;) for investments, positive (+) for redemptions/current value</li>
        <li>In the <strong>last row</strong>: Enter today&rsquo;s date + current portfolio value as <strong>positive</strong></li>
        <li>In any empty cell: <code>=XIRR(B2:B13, A2:A13)</code></li>
        <li>Format the cell as <strong>Percentage</strong></li>
    </ol>
    <div class="explanation__highlight">
        <strong>Common Errors:</strong> <code>#NUM!</code> error? (1) Ensure at least one negative and one positive value, (2) Check dates are valid (not text), (3) Try adding a guess: <code>=XIRR(B2:B13, A2:A13, 0.1)</code>, (4) Use <code>DATE(year,month,day)</code> function for dates.
    </div>

    <h2 id="when-to-use">When to Use XIRR vs CAGR — Decision Guide</h2>
    <table>
        <thead><tr><th>Scenario</th><th>Use This</th><th>Why</th></tr></thead>
        <tbody>
            <tr><td>Monthly <a href="/in/sip-calculator">SIP</a> in mutual fund</td><td><strong>XIRR</strong></td><td>Multiple cash flows at different dates</td></tr>
            <tr><td>One-time <a href="/in/lumpsum-calculator">lump sum</a> investment</td><td><strong>CAGR</strong></td><td>Single investment, single value</td></tr>
            <tr><td>SIP + additional lump sums</td><td><strong>XIRR</strong></td><td>Irregular amounts and dates</td></tr>
            <tr><td>FD maturity calculation</td><td><strong>CAGR</strong></td><td>Known start amount and maturity</td></tr>
            <tr><td><a href="/in/swp-calculator">SWP</a> with withdrawals</td><td><strong>XIRR</strong></td><td>Multiple outflows at different dates</td></tr>
            <tr><td>Comparing fund managers</td><td><strong>XIRR</strong></td><td>Time-weighted gives true performance</td></tr>
            <tr><td>Entire portfolio tracking</td><td><strong>XIRR</strong></td><td>Combines all assets, all transactions</td></tr>
        </tbody>
    </table>

    <h2 id="negative-xirr">Negative XIRR — What It Means &amp; When to Worry</h2>
    <p>A <strong>negative XIRR</strong> simply means your current portfolio value is less than what you invested. Common scenarios:</p>
    <table>
        <thead><tr><th>Scenario</th><th>Typical XIRR</th><th>Action</th></tr></thead>
        <tbody>
            <tr><td>New SIP (1&ndash;6 months) in falling market</td><td>&minus;10% to &minus;30%</td><td>Normal; continue SIP (rupee cost averaging)</td></tr>
            <tr><td>SIP 1&ndash;2 years during bear market</td><td>&minus;5% to &minus;15%</td><td>Normal; historical data shows recovery in 3&ndash;5 years</td></tr>
            <tr><td>SIP 3+ years still negative</td><td>&minus;5% to &minus;10%</td><td>Review fund selection; consider switching to index fund</td></tr>
            <tr><td>Individual stock crashed</td><td>&minus;30% to &minus;80%</td><td>Evaluate fundamentals; consider booking loss for tax harvesting</td></tr>
        </tbody>
    </table>

    <h2 id="good-xirr">What Is a Good XIRR for Indian Mutual Funds?</h2>
    <table>
        <thead><tr><th>Fund Category</th><th>5-Year XIRR (Typical)</th><th>10-Year XIRR (Typical)</th></tr></thead>
        <tbody>
            <tr><td><strong>Large Cap / Index (Nifty 50)</strong></td><td>10&ndash;14%</td><td>11&ndash;13%</td></tr>
            <tr><td><strong>Mid Cap</strong></td><td>14&ndash;20%</td><td>13&ndash;17%</td></tr>
            <tr><td><strong>Small Cap</strong></td><td>15&ndash;25%</td><td>14&ndash;18%</td></tr>
            <tr><td><strong>Flexi Cap</strong></td><td>12&ndash;18%</td><td>12&ndash;15%</td></tr>
            <tr><td><strong>Balanced Advantage</strong></td><td>8&ndash;12%</td><td>9&ndash;11%</td></tr>
            <tr><td><strong>Debt / Liquid</strong></td><td>5&ndash;7%</td><td>6&ndash;8%</td></tr>
            <tr><td><strong>ELSS (Tax Saver)</strong></td><td>12&ndash;18%</td><td>12&ndash;15%</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common XIRR Mistakes</h2>
    <ol>
        <li><strong>Wrong sign convention</strong> &mdash; Investments MUST be negative, current value MUST be positive. Swapping signs gives wrong results or #NUM! error.</li>
        <li><strong>Missing the final value row</strong> &mdash; The last row must be today&rsquo;s date + current portfolio value. Without it, XIRR cannot converge.</li>
        <li><strong>Using CAGR for SIPs</strong> &mdash; CAGR treats all your SIP money as invested on day 1, massively understating actual performance. Always use XIRR for SIPs.</li>
        <li><strong>Over-interpreting short-period XIRR</strong> &mdash; XIRR of 50% over 2 months doesn&rsquo;t mean 50% annual return. It&rsquo;s an annualized projection that may not sustain.</li>
        <li><strong>Ignoring dates</strong> &mdash; XIRR is date-sensitive. A 1-day error in recording can change results, especially for short holding periods.</li>
        <li><strong>Not including dividends/bonuses</strong> &mdash; If your fund pays dividends or you received bonuses, include them as positive cash flows on their payment dates for accurate XIRR.</li>
    </ol>
`;

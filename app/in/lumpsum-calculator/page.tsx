import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import LumpsumCalculatorCore from "@/components/calculator/LumpsumCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Lumpsum Calculator India 2026 — One-Time Mutual Fund Investment Returns with LTCG Tax",
    description: "Free Lumpsum Calculator with 4 modes: Returns Estimator (compounding frequency, inflation & LTCG tax toggles, year-by-year schedule), Lump Sum vs SIP comparison, STP Strategy Planner (Liquid→Equity), and Goal-Based Reverse Calculator. Covers CAGR, return types, tax implications, and asset comparison for India.",
    keywords: ["lumpsum calculator", "lump sum calculator India", "lumpsum investment calculator", "mutual fund lumpsum returns", "one time investment calculator", "lump sum vs SIP", "STP calculator", "CAGR calculator", "lumpsum tax calculator"],
    alternates: buildCountryAlternates("IN", "/in/lumpsum-calculator", "lumpsum-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a lumpsum calculator?", answer: "A lumpsum calculator estimates the future value of a one-time (lump sum) investment using the compound interest formula: A = P(1 + r/n)^(nt), where P = principal, r = annual return rate, n = compounding frequency, and t = time in years. Our calculator offers 4 modes: Returns Estimator (with inflation & LTCG tax toggles), Lump Sum vs SIP comparison, STP Strategy Planner, and Goal-Based Reverse Calculator." },
    { question: "What is the formula for lumpsum investment returns?", answer: "The compound interest formula: A = P × (1 + r/n)^(n×t). For example, ₹5 lakh invested at 12% annually for 10 years: A = 5,00,000 × (1 + 0.12)^10 = ₹15,52,926. The total return is ₹10,52,926 (210.6% absolute return, or 12% CAGR). In mutual funds, 'n' is effectively 1 (returns accrue daily but displayed annually), while in FDs/bonds, compounding can be quarterly (n=4) or monthly (n=12)." },
    { question: "Lump sum vs SIP — which is better?", answer: "At a constant return rate, lump sum ALWAYS outperforms SIP because the full amount compounds from day 1. However, in real volatile markets, SIP often wins due to rupee cost averaging — you buy more units when markets fall and fewer when they rise. Best strategy: Use STP (Systematic Transfer Plan) — park lump sum in a liquid fund and transfer monthly to equity over 6-12 months. This gives partial compounding + volatility protection." },
    { question: "What is CAGR and how is it calculated?", answer: "CAGR (Compound Annual Growth Rate) is the average annual return that takes compounding into account. Formula: CAGR = (Final Value / Initial Value)^(1/n) − 1. Example: ₹1 lakh growing to ₹3.11 lakh in 10 years = (3.11/1)^(1/10) − 1 = 12% CAGR. CAGR is the standard for comparing mutual fund performance across different time periods. It is different from absolute return (which ignores time) and annualised return (which may not account for compounding)." },
    { question: "What is a Systematic Transfer Plan (STP)?", answer: "STP is a strategy where you invest a lump sum in a low-risk source fund (liquid/debt) and set up automatic periodic transfers to a target fund (equity). Benefits: (1) Your idle money earns 6-7% in liquid fund, (2) Equity exposure builds gradually reducing market timing risk, (3) You get rupee cost averaging like SIP. Typical STP duration: 6-12 months. Important: Each STP transfer from the source fund is a taxable redemption event — plan accordingly." },
    { question: "How does compounding frequency affect returns?", answer: "More frequent compounding produces slightly higher returns. Example with ₹10 lakh at 12% for 10 years: Annual compounding = ₹31.06L, Semi-annual = ₹32.07L, Quarterly = ₹32.62L, Monthly = ₹33.00L. The difference between annual and monthly compounding is about 6% over 10 years. FDs typically compound quarterly, mutual funds effectively compound daily (reflected in NAV), and PPF compounds annually." },
    { question: "What are absolute vs annualised returns?", answer: "Absolute Return = (Final Value − Initial Value) / Initial Value × 100. It ignores time. Example: ₹1L becoming ₹2L = 100% absolute return whether it took 5 years or 15 years. Annualised Return converts any period's return to a yearly equivalent for comparison. For periods >1 year, use CAGR. For periods <1 year, annualise by: (1 + Absolute Return)^(365/Days) − 1. Always compare funds using CAGR over the same duration." },
    { question: "Is lump sum investment risky?", answer: "Lump sum carries higher market timing risk than SIP because your entire capital enters at one price point. If markets drop 20% after your investment, your entire capital is affected. However, for long-term horizons (7+ years), market timing becomes less significant — historical data shows that 'time in the market' beats 'timing the market'. Mitigation strategies: (1) Use STP to stagger entry, (2) Invest during market corrections, (3) Diversify across asset classes." },
    { question: "How much lump sum should I invest to get ₹1 crore?", answer: "At 12% annual returns: ₹32.20L for 10 years, ₹18.27L for 15 years, ₹10.37L for 20 years, ₹5.88L for 25 years, ₹3.34L for 30 years. At 15%: ₹24.72L for 10 years, ₹12.29L for 15 years, ₹6.11L for 20 years, ₹3.04L for 25 years, ₹1.51L for 30 years. Use our Goal-Based Reverse Calculator mode to find your exact number." },
    { question: "What is LTCG tax on lump sum mutual fund investment?", answer: "For equity mutual funds (held >12 months): Long-Term Capital Gains (LTCG) up to ₹1.25 lakh/year are TAX-FREE. Gains above ₹1.25L are taxed at 12.5% (no indexation). Short-Term Capital Gains (held <12 months) are taxed at 20%. For debt mutual funds: All gains are taxed at your income tax slab rate regardless of holding period. Strategy: Harvest ₹1.25L LTCG annually by selling and reinvesting to reset cost basis." },
    { question: "Can I invest lump sum in ELSS for tax saving?", answer: "Yes, ELSS (Equity Linked Savings Scheme) accepts lump sum investments up to ₹1.5 lakh/year for Section 80C deduction. It has the shortest lock-in among 80C instruments (3 years). However, only ₹1.5L qualifies for deduction — invest more than that and the excess doesn't get tax benefit. For larger lump sums, combine ELSS (₹1.5L for 80C) + NPS (₹50K for 80CCD(1B)) + remaining in index/flexi-cap funds." },
    { question: "What is the best time to invest a lump sum?", answer: "The honest answer: NOW is the best time if your horizon is 7+ years. Historical data shows time in the market beats timing the market. However, for risk-averse investors: (1) During market corrections (10-15% dips from highs) — deploy into equity, (2) When interest rates peak — lock into long-duration debt funds/FDs, (3) After receiving windfall (bonus, inheritance) — don't let it sit in savings account earning 3%. If uncertain, use STP over 6-12 months." },
    { question: "How does inflation reduce my lump sum returns?", answer: "Inflation erodes purchasing power. The Fisher Equation gives real return: Real Return = ((1 + Nominal Return) / (1 + Inflation)) − 1. At 12% nominal and 6% inflation, real return = 5.66% (not 6%). Implications: ₹5L invested at 12% for 20 years = ₹48.2L nominal but only ₹15.0L in today's purchasing power. This is why FDs (7% nominal, 1% real) barely preserve wealth, while equity MFs (12% nominal, 5.7% real) genuinely grow it." },
    { question: "What is the difference between trailing and rolling returns?", answer: "Trailing Returns look backward from today — '5-year trailing return' measures from exactly 5 years ago to today. It gives ONE number that changes daily. Rolling Returns calculate returns for every possible holding period of a given length within a date range — '5-year rolling return from 2010-2025' gives hundreds of data points showing the range of outcomes. Rolling returns are more reliable for setting expectations because they show best-case, worst-case, and average scenarios." },
    { question: "Should I use STP or invest directly?", answer: "Use STP when: (1) Markets are near all-time highs, (2) You're investing a large windfall and can't afford a 20% drawdown, (3) You're new to equity and want to ease in. Invest directly when: (1) Markets are in a correction (10%+ down), (2) Your horizon is 10+ years (timing matters less), (3) Amount is small relative to your net worth. Optimal STP duration: 6 months for moderate amounts, 12 months for large amounts. Source fund should be liquid/ultra-short-term debt." },
];

export default function LumpsumCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Lumpsum Calculator" },
        ]),
        webAppSchema("Lumpsum Calculator India 2026", canonicalUrl("/in/lumpsum-calculator")),
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
            <Script id="schema-lumpsum" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Lumpsum Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Lumpsum Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate one-time mutual fund investment returns with 4 modes — Returns Estimator (compounding frequency,
                inflation &amp; LTCG tax toggles, year-by-year schedule), Lump Sum vs SIP comparison, STP Strategy Planner
                (Liquid→Equity transfer), and Goal-Based Reverse Calculator. Covers CAGR, return types, and asset comparison.
            </p>
            <AuthorBadge categoryKey="salary" />
            <LumpsumCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>
            <FAQAccordion title="Lumpsum Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Compare lump sum vs systematic monthly investment</div>
                        </div>
                    </Link>
                    <Link href="/in/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest Calculator</div>
                            <div className="in-related-link__desc">See how compounding accelerates your one-time investment</div>
                        </div>
                    </Link>
                    <Link href="/in/crorepati-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏆</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Crorepati Calculator</div>
                            <div className="in-related-link__desc">Plan your path to ₹1 Crore using lump sum or SIP</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">Calculate LTCG/STCG tax on your investment gains</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-lumpsum-calculator">What Is a Lumpsum Calculator?</h2>
    <p>A <strong>lumpsum calculator</strong> (also called a one-time investment calculator) estimates the future value of a single, one-time investment using the <strong>compound interest formula</strong>. Unlike a <a href="/in/sip-calculator">SIP calculator</a> that projects returns on periodic investments, a lumpsum calculator focuses on how a single deployed amount grows over time.</p>
    <p>Lump sum investing is common when you receive a <strong>bonus, inheritance, maturity proceeds, or property sale amount</strong> — a large sum that you want to put to work immediately. Understanding how this money compounds is critical for making informed decisions about where and how long to invest it.</p>
    <div class="explanation__highlight">
        <strong>Our Advantage:</strong> While most lumpsum calculators (like Groww&rsquo;s) offer only one basic mode, our calculator provides <strong>4 modes</strong>: Returns Estimator with compounding frequency, inflation, and LTCG tax toggles; Lump Sum vs SIP head-to-head comparison; STP Strategy Planner; and Goal-Based Reverse Calculator.
    </div>

    <h2 id="lumpsum-formula">Lumpsum Investment Formula — Compound Interest</h2>
    <p>The standard formula to calculate lumpsum investment returns:</p>
    <div class="explanation__highlight">
        <strong>A = P &times; (1 + r/n)<sup>n&times;t</sup></strong><br/>
        Where: <strong>A</strong> = Maturity value, <strong>P</strong> = Principal (initial investment), <strong>r</strong> = Annual rate of return (decimal), <strong>n</strong> = Compounding frequency per year, <strong>t</strong> = Time in years
    </div>
    <h3>Worked Example</h3>
    <p>₹5,00,000 invested at 12% annual return for 10 years with annual compounding:</p>
    <table>
        <thead><tr><th>Variable</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>P (Principal)</td><td>₹5,00,000</td></tr>
            <tr><td>r (Annual Return)</td><td>12% = 0.12</td></tr>
            <tr><td>n (Compounding)</td><td>1 (Annual)</td></tr>
            <tr><td>t (Years)</td><td>10</td></tr>
            <tr><td><strong>A = 5,00,000 &times; (1.12)<sup>10</sup></strong></td><td><strong>₹15,52,926</strong></td></tr>
            <tr><td>Total Return</td><td>₹10,52,926 (210.6%)</td></tr>
            <tr><td>CAGR</td><td>12.0%</td></tr>
        </tbody>
    </table>

    <h2 id="return-types">Understanding Return Types — CAGR vs Absolute vs Trailing vs Rolling</h2>
    <table>
        <thead><tr><th>Return Type</th><th>Formula</th><th>Best For</th><th>Example</th></tr></thead>
        <tbody>
            <tr><td><strong>Absolute Return</strong></td><td>(Final &minus; Initial) / Initial &times; 100</td><td>Quick check (&lt;1 year)</td><td>₹1L → ₹1.2L = 20%</td></tr>
            <tr><td><strong>CAGR</strong></td><td>(Final/Initial)<sup>1/n</sup> &minus; 1</td><td>Standard long-term comparison</td><td>₹1L → ₹3.11L in 10 yrs = 12%</td></tr>
            <tr><td><strong>Trailing Return</strong></td><td>CAGR from X years ago to today</td><td>Current fund evaluation</td><td>&ldquo;5-yr trailing: 14.2%&rdquo;</td></tr>
            <tr><td><strong>Rolling Return</strong></td><td>All possible CAGR values for a period</td><td>Setting realistic expectations</td><td>&ldquo;5-yr rolling range: 8&ndash;22%&rdquo;</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> When comparing mutual funds, use <strong>rolling returns over 5&ndash;10 years</strong> instead of trailing returns. Rolling returns show you the range of possible outcomes (best case, worst case, average) — giving a much more honest picture than a single trailing number that changes daily.
    </div>

    <h2 id="growth-table">Lumpsum Growth Table — Quick Reference</h2>
    <p>How different lump sum amounts grow at various return rates. Use this as a quick reference for your investment planning:</p>
    <table>
        <thead><tr><th>Investment</th><th>Years</th><th>At 8%</th><th>At 10%</th><th>At 12%</th><th>At 15%</th></tr></thead>
        <tbody>
            <tr><td rowspan="4"><strong>₹1 Lakh</strong></td><td>5</td><td>₹1.47L</td><td>₹1.61L</td><td>₹1.76L</td><td>₹2.01L</td></tr>
            <tr><td>10</td><td>₹2.16L</td><td>₹2.59L</td><td>₹3.11L</td><td>₹4.05L</td></tr>
            <tr><td>15</td><td>₹3.17L</td><td>₹4.18L</td><td>₹5.47L</td><td>₹8.14L</td></tr>
            <tr><td>20</td><td>₹4.66L</td><td>₹6.73L</td><td>₹9.65L</td><td>₹16.37L</td></tr>
            <tr><td rowspan="4"><strong>₹5 Lakh</strong></td><td>5</td><td>₹7.35L</td><td>₹8.05L</td><td>₹8.81L</td><td>₹10.06L</td></tr>
            <tr><td>10</td><td>₹10.79L</td><td>₹12.97L</td><td>₹15.53L</td><td>₹20.23L</td></tr>
            <tr><td>15</td><td>₹15.86L</td><td>₹20.89L</td><td>₹27.37L</td><td>₹40.69L</td></tr>
            <tr><td>20</td><td>₹23.30L</td><td>₹33.64L</td><td>₹48.23L</td><td>₹81.83L</td></tr>
            <tr><td rowspan="4"><strong>₹10 Lakh</strong></td><td>5</td><td>₹14.69L</td><td>₹16.11L</td><td>₹17.62L</td><td>₹20.11L</td></tr>
            <tr><td>10</td><td>₹21.59L</td><td>₹25.94L</td><td>₹31.06L</td><td>₹40.46L</td></tr>
            <tr><td>15</td><td>₹31.72L</td><td>₹41.77L</td><td>₹54.74L</td><td>₹81.37L</td></tr>
            <tr><td>20</td><td>₹46.61L</td><td>₹67.27L</td><td>₹96.46L</td><td>₹1.64Cr</td></tr>
            <tr><td rowspan="4"><strong>₹25 Lakh</strong></td><td>5</td><td>₹36.73L</td><td>₹40.26L</td><td>₹44.06L</td><td>₹50.28L</td></tr>
            <tr><td>10</td><td>₹53.97L</td><td>₹64.84L</td><td>₹77.65L</td><td>₹1.01Cr</td></tr>
            <tr><td>15</td><td>₹79.30L</td><td>₹1.04Cr</td><td>₹1.37Cr</td><td>₹2.03Cr</td></tr>
            <tr><td>20</td><td>₹1.17Cr</td><td>₹1.68Cr</td><td>₹2.41Cr</td><td>₹4.09Cr</td></tr>
        </tbody>
    </table>

    <h2 id="lumpsum-vs-sip">Lump Sum vs SIP — Detailed Comparison</h2>
    <table>
        <thead><tr><th>Factor</th><th>Lump Sum</th><th>SIP</th></tr></thead>
        <tbody>
            <tr><td><strong>Entry Style</strong></td><td>One-time large investment</td><td>Small amounts at regular intervals</td></tr>
            <tr><td><strong>Market Timing Risk</strong></td><td>HIGH — entire amount at one price point</td><td>LOW — rupee cost averaging</td></tr>
            <tr><td><strong>Best In</strong></td><td>Bull markets + long horizon</td><td>Volatile/sideways markets</td></tr>
            <tr><td><strong>Compounding Edge</strong></td><td>Full amount compounds from day 1</td><td>Only early installments get full compounding</td></tr>
            <tr><td><strong>Discipline</strong></td><td>Requires willingness to deploy large sum</td><td>Builds saving habit automatically</td></tr>
            <tr><td><strong>Ideal Source</strong></td><td>Bonus, inheritance, maturity</td><td>Monthly salary</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>No ongoing commitment</td><td>Can pause/stop/increase</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Hybrid Strategy (Recommended):</strong> Maintain regular SIPs from salary + Deploy lump sums (bonuses, windfalls) via <strong>STP over 6&ndash;12 months</strong> into the same equity fund. This gives you: (1) Consistent wealth building from SIPs, (2) Compounding advantage from lump sums, (3) Volatility protection via STP. Use our <a href="/in/crorepati-calculator">Crorepati Calculator</a> to plan combined SIP + lump sum goals.
    </div>

    <h2 id="stp-strategy">STP — The Smart Way to Deploy a Lump Sum</h2>
    <p>A <strong>Systematic Transfer Plan (STP)</strong> is a risk-managed approach to investing a lump sum in equity:</p>
    <ol>
        <li><strong>Step 1:</strong> Invest the entire lump sum in a <strong>liquid or ultra-short-term debt fund</strong> (earning 6&ndash;7% p.a.)</li>
        <li><strong>Step 2:</strong> Set up a <strong>systematic transfer</strong> of equal amounts from the debt fund to an <strong>equity fund</strong> over 6&ndash;12 months</li>
        <li><strong>Step 3:</strong> Benefit from <strong>rupee cost averaging</strong> while your idle money still earns returns in the liquid fund</li>
    </ol>
    <table>
        <thead><tr><th>STP Duration</th><th>Risk Reduction</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td>3 months</td><td>Moderate</td><td>Small amounts, market already corrected</td></tr>
            <tr><td>6 months</td><td>Good</td><td>Medium amounts, normal market conditions</td></tr>
            <tr><td>9&ndash;12 months</td><td>High</td><td>Large windfalls, market near all-time highs</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tax Note:</strong> Each STP transfer counts as a <strong>redemption</strong> from the source fund. If the source is a debt fund, gains are taxed at your slab rate. If the source is an equity fund (less common), STCG (&lt;1 year) = 20%, LTCG (&gt;1 year) = 12.5%. Plan STP duration carefully to optimize tax impact.
    </div>

    <h2 id="compounding-frequency">Impact of Compounding Frequency</h2>
    <p>₹10 Lakh invested at 12% for 10 years — how compounding frequency affects returns:</p>
    <table>
        <thead><tr><th>Frequency</th><th>Times/Year (n)</th><th>Maturity Value</th><th>Extra vs Annual</th></tr></thead>
        <tbody>
            <tr><td>Annual</td><td>1</td><td>₹31.06L</td><td>&mdash;</td></tr>
            <tr><td>Semi-Annual</td><td>2</td><td>₹32.07L</td><td>+₹1.01L</td></tr>
            <tr><td>Quarterly</td><td>4</td><td>₹32.62L</td><td>+₹1.56L</td></tr>
            <tr><td>Monthly</td><td>12</td><td>₹33.00L</td><td>+₹1.94L</td></tr>
            <tr><td>Daily</td><td>365</td><td>₹33.19L</td><td>+₹2.13L</td></tr>
        </tbody>
    </table>

    <h2 id="inflation-real-returns">Inflation &amp; Real Returns</h2>
    <p>The <strong>Fisher Equation</strong> gives the real (purchasing power) return:</p>
    <div class="explanation__highlight">
        <strong>Real Return = ((1 + Nominal Return) &divide; (1 + Inflation)) &minus; 1</strong><br/>
        Example: 12% nominal, 6% inflation → Real Return = (1.12 &divide; 1.06) &minus; 1 = <strong>5.66%</strong>
    </div>
    <table>
        <thead><tr><th>Investment</th><th>Nominal Return</th><th>Real Return (6% CPI)</th><th>₹10L after 20 yrs (Real)</th></tr></thead>
        <tbody>
            <tr><td>Savings Account</td><td>3.5%</td><td>&minus;2.4%</td><td>₹6.19L (LOSES value)</td></tr>
            <tr><td>FD</td><td>7.0%</td><td>0.9%</td><td>₹12.01L</td></tr>
            <tr><td><a href="/in/ppf-calculator">PPF</a></td><td>7.1%</td><td>1.0%</td><td>₹12.24L</td></tr>
            <tr><td>Index Fund</td><td>12%</td><td><strong>5.7%</strong></td><td><strong>₹30.09L</strong></td></tr>
            <tr><td>Mid-Cap MF</td><td>15%</td><td>8.5%</td><td>₹50.55L</td></tr>
        </tbody>
    </table>

    <h2 id="tax-implications">Tax on Lump Sum Investments (FY 2025&ndash;26)</h2>
    <table>
        <thead><tr><th>Asset</th><th>Holding Period</th><th>Tax Rate</th><th>Exemption</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity MF (STCG)</strong></td><td>&le; 12 months</td><td>20%</td><td>None</td></tr>
            <tr><td><strong>Equity MF (LTCG)</strong></td><td>&gt; 12 months</td><td>12.5%</td><td>₹1.25L/year exempt</td></tr>
            <tr><td><strong>Debt MF</strong></td><td>Any</td><td>Slab rate</td><td>None</td></tr>
            <tr><td><strong>ELSS</strong></td><td>3 years (locked)</td><td>12.5% LTCG</td><td>₹1.25L + 80C deduction</td></tr>
            <tr><td><strong>PPF</strong></td><td>15 years</td><td><strong>Tax-free (EEE)</strong></td><td>Fully exempt</td></tr>
            <tr><td><strong>FD Interest</strong></td><td>Any</td><td>Slab rate</td><td>80TTA ₹10K</td></tr>
            <tr><td><strong>Gold (physical/digital)</strong></td><td>&gt; 24 months</td><td>12.5%</td><td>None</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tax-Saving Strategy:</strong> Invest ₹1.5L in <strong>ELSS</strong> (80C deduction + equity returns + 3-year lock-in) + ₹50K in <strong><a href="/in/pension-calculator">NPS</a></strong> (80CCD(1B)) + remaining lump sum in <strong>Index Fund</strong> via STP. Harvest ₹1.25L LTCG annually to stay tax-free. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to plan deductions.
    </div>

    <h2 id="asset-comparison">Lump Sum in Different Assets — India Comparison</h2>
    <table>
        <thead><tr><th>Asset</th><th>Returns</th><th>Liquidity</th><th>Risk</th><th>₹10L in 10 yrs</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity MF (Index)</strong></td><td>11&ndash;13%</td><td>T+1</td><td>Moderate</td><td><strong>₹28&ndash;34L</strong></td></tr>
            <tr><td><strong>Equity MF (Mid-Cap)</strong></td><td>14&ndash;17%</td><td>T+1</td><td>High</td><td>₹37&ndash;48L</td></tr>
            <tr><td><strong>Gold (Sovereign/Digital)</strong></td><td>8&ndash;10%</td><td>Medium</td><td>Low</td><td>₹22&ndash;26L</td></tr>
            <tr><td><strong>FD</strong></td><td>6.5&ndash;7.5%</td><td>Pre-mature penalty</td><td>Zero</td><td>₹19&ndash;21L</td></tr>
            <tr><td><strong>PPF</strong></td><td>7.1%</td><td>15-year lock-in</td><td>Zero</td><td>₹20L (tax-free)</td></tr>
            <tr><td><strong>Real Estate</strong></td><td>3&ndash;8%</td><td>Very low</td><td>Moderate</td><td>₹13&ndash;22L</td></tr>
            <tr><td><strong>Savings Account</strong></td><td>3&ndash;4%</td><td>Instant</td><td>Zero</td><td>₹13&ndash;15L</td></tr>
        </tbody>
    </table>

    <h2 id="when-to-invest">When to Invest a Lump Sum</h2>
    <table>
        <thead><tr><th>Scenario</th><th>Recommended Action</th><th>Why</th></tr></thead>
        <tbody>
            <tr><td><strong>Annual bonus</strong></td><td>STP over 6 months → Equity MF</td><td>Stagger entry, avoid timing peak</td></tr>
            <tr><td><strong>Large inheritance</strong></td><td>STP over 12 months → diversified portfolio</td><td>Protect against immediate drawdown</td></tr>
            <tr><td><strong>FD maturity</strong></td><td>Direct lump sum → Index Fund (if horizon 7+ yrs)</td><td>Beat FD returns with equity</td></tr>
            <tr><td><strong>Market 15%+ down</strong></td><td>Direct lump sum → Equity (no STP needed)</td><td>Correction already provides margin of safety</td></tr>
            <tr><td><strong>PPF maturity</strong></td><td>Reinvest 60% Equity + 40% Debt</td><td>Rebalance for higher growth</td></tr>
            <tr><td><strong>Sitting in savings</strong></td><td>Move TODAY to at least liquid fund</td><td>3.5% savings vs 6.5% liquid — no effort needed</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common Mistakes in Lump Sum Investing</h2>
    <ol>
        <li><strong>Letting money sit in savings account</strong> &mdash; At 3.5%, you&rsquo;re losing 2&ndash;3% to inflation every year. Move idle cash to at least a liquid fund (6&ndash;7%).</li>
        <li><strong>Waiting for the &ldquo;perfect&rdquo; entry point</strong> &mdash; Time in the market beats timing the market. If you&rsquo;ve been waiting 2 years for a crash, you&rsquo;ve already lost 2 years of compounding.</li>
        <li><strong>Investing entire lump sum at market peak</strong> &mdash; Use STP to stagger entry. If Nifty is near all-time highs, deploy over 6&ndash;12 months.</li>
        <li><strong>Choosing FD over equity for 10+ year goals</strong> &mdash; FD at 7% barely beats inflation. Equity at 12% gives 5.7% real return — your money genuinely grows.</li>
        <li><strong>Ignoring tax harvesting</strong> &mdash; You can book ₹1.25 lakh in equity LTCG tax-free every year. Sell, reinvest, reset your cost basis.</li>
        <li><strong>Over-concentrating in one fund</strong> &mdash; Diversify: 60% Large-Cap/Index + 25% Mid-Cap + 15% Debt/Gold for balanced risk.</li>
        <li><strong>Not considering inflation</strong> &mdash; ₹50L today won&rsquo;t buy what it does in 20 years. Always plan in real (inflation-adjusted) terms using our calculator&rsquo;s inflation toggle.</li>
    </ol>
`;

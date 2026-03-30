import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import CrorepatiCalculatorCore from "@/components/calculator/CrorepatiCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Crorepati Calculator 2026 — How to Become Crorepati with SIP, Step-Up & Lump Sum",
    description: "Free Crorepati Calculator with 4 modes: Goal Planner (SIP + Lump Sum → time to ₹1 Crore), Step-Up SIP (annual increase projection), Cost of Delay (impact of starting late), and Milestone Tracker (₹25L to ₹10Cr timeline). Includes Rule of 72, inflation adjustment, SIP vs Lump Sum, and investment comparison.",
    keywords: ["crorepati calculator", "how to become crorepati", "1 crore SIP calculator", "crorepati calculator India", "SIP calculator 1 crore", "step up SIP calculator", "wealth creation India", "mutual fund crorepati", "cost of delay investing", "crorepati by age"],
    alternates: buildCountryAlternates("IN", "/in/crorepati-calculator", "crorepati-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a crorepati calculator?", answer: "A crorepati calculator is a financial planning tool that helps you estimate how long it will take to reach your wealth goal (typically ₹1 Crore or more) based on your monthly SIP amount, lump sum investment, and expected rate of return. It uses the compound interest formula to project future wealth. Our calculator offers 4 modes: Goal Planner, Step-Up SIP, Cost of Delay, and Milestone Tracker — far beyond a basic time-to-goal calculation." },
    { question: "How much monthly SIP is needed to become crorepati?", answer: "At 12% annual returns: ₹5,000/month takes ~20 years, ₹10,000/month takes ~16 years, ₹15,000/month takes ~14 years, ₹25,000/month takes ~11 years, ₹50,000/month takes ~8.5 years. At 15% returns, these timelines reduce by 2-3 years. The key insight: starting early matters more than investing more — ₹5,000/month for 30 years gives ₹1.76 Crore at 12%, while ₹15,000/month for 15 years gives only ₹1.13 Crore." },
    { question: "Can I become crorepati by investing ₹5,000 per month?", answer: "Yes! At 12% annual returns from equity mutual funds, a ₹5,000 monthly SIP will grow to approximately ₹1 Crore in about 20 years. With a 10% annual step-up (increasing SIP by 10% each year as your salary grows), you can reach ₹1 Crore in approximately 15 years instead. The key is to start early, stay invested through market ups and downs, and let compounding work its magic. Use our Step-Up SIP mode to see how annual increases accelerate your journey." },
    { question: "What is step-up SIP and how does it help?", answer: "Step-up SIP (or top-up SIP) is a strategy where you increase your monthly SIP amount by a fixed percentage every year — typically 5-15%, aligned with your annual salary growth. Impact: A ₹10,000/month SIP with 10% annual step-up reaches ₹1 Crore in ~12.5 years vs ~16 years for a flat SIP — saving 3.5 years! You also invest less total money because compounding works harder on the earlier larger amounts. Most mutual fund platforms (Groww, Zerodha, ET Money, etc.) support automatic step-up SIPs." },
    { question: "What is the Rule of 72?", answer: "The Rule of 72 is a mental math shortcut to estimate how long your investment takes to double. Formula: Years to Double = 72 ÷ Annual Return (%). Examples: at 12% → doubles in 6 years, at 8% → doubles in 9 years, at 15% → doubles in 4.8 years. It also works for inflation: at 6% inflation, your purchasing power halves in 12 years (72 ÷ 6). This means ₹1 Crore today will have the buying power of only ₹50 Lakh in 12 years!" },
    { question: "How does inflation affect my ₹1 crore goal?", answer: "At 6% average inflation in India, ₹1 Crore today will have the purchasing power of approximately ₹31 lakh in 20 years, or ₹17 lakh in 30 years. This means if you're 30 years away from retirement, your actual target should be ₹3-5 Crore, not ₹1 Crore. Use our Goal Planner mode's inflation toggle to see the real (purchasing power) value of your target corpus. The Fisher equation gives the precise real return: Real Return = ((1 + Nominal Return) / (1 + Inflation)) - 1." },
    { question: "SIP or lump sum — which is better for becoming crorepati?", answer: "SIP is better for most investors because of rupee cost averaging (you buy more units when markets are down, fewer when up) and the discipline of automated investing. Lump sum can outperform in sustained bull markets since the entire amount compounds from day one. Best strategy: Maintain a regular SIP + deploy lump sums (bonuses, inheritance) during market corrections (10-15% dips). Never try to time the market with your entire corpus — time IN the market beats timing THE market." },
    { question: "What returns can I expect from equity mutual funds?", answer: "Historical category-wise returns for Indian equity mutual funds (10+ year average): Large Cap Index Funds: 11-13%, Flexi-Cap/Multi-Cap: 12-15%, Mid-Cap: 14-17%, Small-Cap: 15-20%. However, past performance doesn't guarantee future results. For conservative estimation, use 12% for equity funds, 8-9% for balanced/hybrid funds, and 7-8% for debt funds. Markets can give 20-30% in bull years and -10% to -20% in bear years, but long-term averages smooth out." },
    { question: "Is ₹1 crore enough for retirement in India?", answer: "For most urban Indians, ₹1 Crore alone is NOT enough for a comfortable retirement. At 6% inflation, ₹1 Crore today = ₹31L in purchasing power after 20 years. Following the 4% withdrawal rule, ₹1 Crore provides only ₹33,333/month. For a comfortable urban retirement with ₹1 lakh/month current expenses, you need ₹3-4 Crore (using the 25× rule). Use our Pension Calculator for detailed retirement corpus planning." },
    { question: "How does cost of delay work in investing?", answer: "Every year you delay investing costs you exponentially because you lose the compounding on the most valuable years (earliest years). Example: ₹10,000/month SIP at 12%: Start at age 25 → ₹3.53 Crore by 60. Start at age 30 → ₹1.89 Crore by 60. Start at age 35 → ₹1 Crore by 60. Just 5 years of delay cuts your corpus by nearly HALF (₹1.89Cr vs ₹3.53Cr) despite investing for 30 vs 35 years. Use our Cost of Delay mode to see the exact impact." },
    { question: "What is rupee cost averaging?", answer: "Rupee cost averaging (RCA) is the automatic benefit of SIP investing: when markets fall, your fixed SIP amount buys MORE units; when markets rise, it buys FEWER units. Over time, this averages your purchase cost to below the average market price. Example: if NAV fluctuates between ₹10-₹20 and your SIP is ₹1,000/month, you buy 100 units at ₹10 but only 50 at ₹20. Your average cost = ₹13.33, not ₹15. This is why SIP is preferred over lump sum for most investors." },
    { question: "Which mutual fund category is best for long-term wealth creation?", answer: "For 10+ year goals (becoming crorepati): (1) Nifty 50/Sensex Index Funds — lowest cost, broadest large-cap exposure, 12-13% historical returns. (2) Flexi-Cap Funds — manager picks across market caps, 13-15% historical. (3) Mid-Cap Index/Funds — higher risk but 14-17% historical. (4) ELSS — equity + Section 80C tax savings + shortest lock-in (3 years). Start with 60-70% in index funds, 20-30% mid-cap, 10% small-cap. Always choose Direct plans (lower expense ratio) over Regular plans." },
    { question: "How are mutual fund returns taxed in India?", answer: "Equity Mutual Funds: Short-Term Capital Gains (STCG, held <1 year) = 20% tax. Long-Term Capital Gains (LTCG, held >1 year) = 12.5% on gains above ₹1.25 lakh exemption per year. Debt Mutual Funds: All gains taxed at your income tax slab rate regardless of holding period. ELSS: Same as equity funds + Section 80C deduction on investment (up to ₹1.5L). Index Funds: Same as equity. Strategy: Harvest LTCG up to ₹1.25 lakh annually to reset cost basis (tax-loss harvesting equivalent for gains)." },
    { question: "What is the difference between direct and regular mutual funds?", answer: "Direct plans have NO distributor commission, so the expense ratio is 0.5-1% lower than regular plans. Over 20 years, this difference compounds to 15-20% more wealth. Example: ₹10,000/month SIP for 20 years at 12% (direct) = ₹99.9L vs at 11% (regular) = ₹86.5L. That's ₹13.4 lakh MORE just from avoiding commissions. Always invest in Direct plans through platforms like Groww, Zerodha Coin, ET Money, or AMC websites directly." },
    { question: "How often should I review my SIP investments?", answer: "Review annually — not monthly or quarterly (that invites emotional decisions). Check: (1) Fund performance vs its benchmark over 3-5 years (not 1 year), (2) Expense ratio changes, (3) Fund manager changes, (4) Your asset allocation is still aligned with your risk profile and timeline. Do NOT stop your SIP during market crashes — that's when you're buying the most units at the lowest prices. Increase SIP annually with salary growth (step-up SIP strategy)." },
];

export default function CrorepatiCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Crorepati Calculator" },
        ]),
        webAppSchema("Crorepati Calculator 2026", canonicalUrl("/in/crorepati-calculator")),
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
            <Script id="schema-crorepati" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Crorepati Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Crorepati Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Plan your path to ₹1 Crore and beyond with 4 modes — Goal Planner (SIP + Lump Sum with inflation adjustment),
                Step-Up SIP (annual increase projection), Cost of Delay (impact of starting late), and Milestone Tracker
                (₹25 Lakh to ₹10 Crore timeline). Includes Rule of 72, SIP vs Lump Sum, investment comparison, and tax guide.
            </p>
            <AuthorBadge categoryKey="salary" />
            <CrorepatiCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Crorepati Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Calculate exact SIP returns with detailed projections</div>
                        </div>
                    </Link>
                    <Link href="/in/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest Calculator</div>
                            <div className="in-related-link__desc">See how compounding accelerates your wealth</div>
                        </div>
                    </Link>
                    <Link href="/in/pension-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏦</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Pension Calculator</div>
                            <div className="in-related-link__desc">Plan retirement corpus with NPS &amp; EPS</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">Plan ELSS tax savings under Section 80C</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-crorepati-calculator">What Is a Crorepati Calculator?</h2>
    <p>A <strong>crorepati calculator</strong> is a wealth-planning tool that estimates how long it will take you to accumulate a target corpus — typically <strong>₹1 Crore</strong> (₹1,00,00,000) — through systematic investments. In India, &ldquo;crorepati&rdquo; has long been the benchmark of financial success, popularized by the TV show <em>Kaun Banega Crorepati</em>.</p>
    <p>However, with <strong>inflation averaging 5&ndash;6%</strong> in India, the real question isn&rsquo;t just <em>how to become a crorepati</em> — it&rsquo;s whether ₹1 Crore will be enough. Our calculator goes beyond a basic SIP projection with <strong>4 dedicated modes</strong> including inflation adjustment, step-up SIP, cost of delay analysis, and milestone tracking.</p>
    <div class="explanation__highlight">
        <strong>Reality Check:</strong> ₹1 Crore today = ₹31 Lakh in purchasing power in 20 years at 6% inflation. For a comfortable retirement, most urban Indians need <strong>₹3&ndash;5 Crore</strong>. Use our <a href="/in/pension-calculator">Pension Calculator</a> for detailed retirement planning.
    </div>

    <h2 id="sip-to-crorepati">How Much SIP to Become Crorepati?</h2>
    <p>The table below shows the monthly SIP required to reach <strong>₹1 Crore</strong> at different return rates and time horizons:</p>
    <table>
        <thead><tr><th>Time Horizon</th><th>At 10% Return</th><th>At 12% Return</th><th>At 15% Return</th></tr></thead>
        <tbody>
            <tr><td><strong>10 years</strong></td><td>₹48,493</td><td>₹43,041</td><td>₹36,152</td></tr>
            <tr><td><strong>15 years</strong></td><td>₹24,144</td><td>₹20,143</td><td>₹15,092</td></tr>
            <tr><td><strong>20 years</strong></td><td>₹13,170</td><td>₹10,109</td><td>₹6,679</td></tr>
            <tr><td><strong>25 years</strong></td><td>₹7,488</td><td>₹5,227</td><td>₹2,965</td></tr>
            <tr><td><strong>30 years</strong></td><td>₹4,281</td><td>₹2,698</td><td>₹1,300</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> Notice how doubling your time horizon from 15 to 30 years reduces the monthly SIP by <strong>85%</strong> (from ₹20,143 to ₹2,698 at 12%). This is the power of compounding &mdash; <strong>time is your greatest asset</strong>. Start with our <a href="/in/sip-calculator">SIP Calculator</a> to plan your investment.
    </div>

    <h2 id="step-up-sip">Step-Up SIP &mdash; The Fastest Path to ₹1 Crore</h2>
    <p>A <strong>step-up SIP</strong> (or top-up SIP) increases your monthly investment by a fixed percentage every year, typically aligned with your annual salary growth (5&ndash;15%). This dramatically accelerates your wealth creation:</p>
    <table>
        <thead><tr><th>Starting SIP</th><th>Annual Step-Up</th><th>Time to ₹1Cr (12%)</th><th>Flat SIP Time</th><th>Years Saved</th></tr></thead>
        <tbody>
            <tr><td>₹5,000</td><td>10%</td><td><strong>~15 yrs</strong></td><td>~20 yrs</td><td>~5 years</td></tr>
            <tr><td>₹10,000</td><td>10%</td><td><strong>~12.5 yrs</strong></td><td>~16 yrs</td><td>~3.5 years</td></tr>
            <tr><td>₹15,000</td><td>10%</td><td><strong>~11 yrs</strong></td><td>~14 yrs</td><td>~3 years</td></tr>
            <tr><td>₹25,000</td><td>10%</td><td><strong>~9 yrs</strong></td><td>~11 yrs</td><td>~2 years</td></tr>
        </tbody>
    </table>
    <p>The step-up strategy works because: (1) Early years of compounding are most valuable, (2) Your SIP naturally grows with income, and (3) You invest <strong>less total money</strong> than flat SIP for the same goal because the accelerated compounding compensates.</p>

    <h2 id="rule-of-72">The Power of Compounding &mdash; Rule of 72</h2>
    <p>The <strong>Rule of 72</strong> is a mental shortcut: divide 72 by your annual return rate to estimate how many years your money takes to <strong>double</strong>:</p>
    <table>
        <thead><tr><th>Return Rate</th><th>Years to Double</th><th>₹1L becomes ₹1Cr in</th></tr></thead>
        <tbody>
            <tr><td>8% (PPF/Debt)</td><td>9 years</td><td>~63 years (9 doublings)</td></tr>
            <tr><td>10% (Balanced/Index)</td><td>7.2 years</td><td>~50 years</td></tr>
            <tr><td>12% (Equity MF)</td><td><strong>6 years</strong></td><td><strong>~42 years</strong></td></tr>
            <tr><td>15% (Mid/Small Cap)</td><td>4.8 years</td><td>~34 years</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Inflation Warning:</strong> The Rule of 72 also works for inflation. At 6% inflation, your purchasing power <strong>halves every 12 years</strong>. ₹1 Crore today = ₹50L in 12 years, ₹25L in 24 years. This is why beating inflation is critical &mdash; use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to model real vs nominal returns.
    </div>

    <h2 id="cost-of-delay">Cost of Delay &mdash; Why Starting Today Matters</h2>
    <p>Every year you delay investing costs exponentially more than just the missed principal. Here&rsquo;s the impact of starting a ₹10,000/month SIP at 12% return, targeting retirement at age 60:</p>
    <table>
        <thead><tr><th>Start Age</th><th>Years Investing</th><th>Total Invested</th><th>Corpus at 60</th></tr></thead>
        <tbody>
            <tr><td><strong>25 years</strong></td><td>35</td><td>₹42.0 L</td><td><strong>₹6.49 Cr</strong></td></tr>
            <tr><td>30 years</td><td>30</td><td>₹36.0 L</td><td>₹3.53 Cr</td></tr>
            <tr><td>35 years</td><td>25</td><td>₹30.0 L</td><td>₹1.89 Cr</td></tr>
            <tr><td>40 years</td><td>20</td><td>₹24.0 L</td><td>₹99.9 L</td></tr>
            <tr><td>45 years</td><td>15</td><td>₹18.0 L</td><td>₹50.5 L</td></tr>
        </tbody>
    </table>
    <p>Starting at 25 vs 35 gives <strong>3.4× more wealth</strong> (₹6.49 Cr vs ₹1.89 Cr) despite only 40% more time. The earlier years of compounding are extraordinarily valuable because every year of delay loses the <em>longest</em> compounding tail.</p>

    <h2 id="sip-vs-lumpsum">SIP vs Lump Sum vs Hybrid Strategy</h2>
    <table>
        <thead><tr><th>Strategy</th><th>Best When</th><th>Risk</th><th>Key Benefit</th></tr></thead>
        <tbody>
            <tr><td><strong>SIP</strong></td><td>Regular income, disciplined saving</td><td>Lower (rupee cost averaging)</td><td>Automated discipline + volatility smoothing</td></tr>
            <tr><td><strong>Lump Sum</strong></td><td>Large windfall (bonus, inheritance)</td><td>Higher (market timing risk)</td><td>Full amount compounds from day 1</td></tr>
            <tr><td><strong>Hybrid</strong></td><td>Regular income + occasional bonuses</td><td>Moderate</td><td>Best of both worlds</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Strategy:</strong> Maintain your regular SIP regardless of market conditions. Deploy lump sums during market corrections (10&ndash;15% dips from recent highs). This &ldquo;SIP + tactical lump sum&rdquo; approach historically outperforms both pure SIP and pure lump sum strategies. <strong>Never</strong> try to time the market with your entire portfolio.
    </div>

    <h2 id="best-investments">Best Investment Options to Become Crorepati</h2>
    <table>
        <thead><tr><th>Investment</th><th>Returns (Historical)</th><th>Lock-in</th><th>Risk</th><th>Tax Treatment</th></tr></thead>
        <tbody>
            <tr><td><strong>Nifty 50 Index Fund</strong></td><td>11&ndash;13%</td><td>None</td><td>Moderate</td><td>LTCG 12.5% (&gt;₹1.25L)</td></tr>
            <tr><td><strong>Flexi-Cap Fund</strong></td><td>12&ndash;15%</td><td>None</td><td>Moderate-High</td><td>LTCG 12.5%</td></tr>
            <tr><td><strong>Mid-Cap Fund</strong></td><td>14&ndash;17%</td><td>None</td><td>High</td><td>LTCG 12.5%</td></tr>
            <tr><td><strong>ELSS (Tax Saver)</strong></td><td>12&ndash;15%</td><td><strong>3 years</strong></td><td>High</td><td>LTCG 12.5% + 80C benefit</td></tr>
            <tr><td><strong><a href="/in/pension-calculator">NPS</a></strong></td><td>8&ndash;14%</td><td>Until 60</td><td>Moderate</td><td>EET + extra ₹50K u/s 80CCD(1B)</td></tr>
            <tr><td><strong><a href="/in/ppf-calculator">PPF</a></strong></td><td>7.1%</td><td>15 years</td><td>Zero</td><td><strong>EEE (fully tax-free)</strong></td></tr>
            <tr><td><strong>FD</strong></td><td>6.5&ndash;7.5%</td><td>Varies</td><td>Zero</td><td>Slab rate (fully taxable)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Recommended Portfolio:</strong> For ₹1 Crore+ goals with 10+ year horizon: <strong>60% Index Fund</strong> (core, low-cost) + <strong>20% Mid-Cap</strong> (growth) + <strong>10% ELSS</strong> (tax saving) + <strong>10% <a href="/in/ppf-calculator">PPF</a></strong> (safety). Review annually. Use <a href="/in/income-tax-calculator">Income Tax Calculator</a> to optimize 80C deductions.
    </div>

    <h2 id="tax-implications">Tax Implications on Wealth Creation</h2>
    <table>
        <thead><tr><th>Investment</th><th>Holding Period</th><th>Tax Rate</th><th>Exemption</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity MF (LTCG)</strong></td><td>&gt; 1 year</td><td>12.5%</td><td>₹1.25L/year exempt</td></tr>
            <tr><td><strong>Equity MF (STCG)</strong></td><td>&le; 1 year</td><td>20%</td><td>No exemption</td></tr>
            <tr><td><strong>ELSS</strong></td><td>3 years (locked)</td><td>12.5% LTCG</td><td>₹1.25L + 80C deduction</td></tr>
            <tr><td><strong>Debt MF</strong></td><td>Any</td><td>Slab rate</td><td>No exemption</td></tr>
            <tr><td><strong>PPF</strong></td><td>15 years</td><td><strong>Tax-free (EEE)</strong></td><td>Fully exempt</td></tr>
            <tr><td><strong>NPS</strong></td><td>Until 60</td><td>60% lump sum exempt; annuity taxable</td><td>80CCD(1B) ₹50K</td></tr>
            <tr><td><strong>FD interest</strong></td><td>Any</td><td>Slab rate</td><td>80TTA ₹10K interest</td></tr>
        </tbody>
    </table>

    <h2 id="crorepati-by-age">Crorepati by Age &mdash; Action Plan</h2>
    <p>Monthly SIP needed to reach <strong>₹1 Crore by age 60</strong> (at 12% returns):</p>
    <table>
        <thead><tr><th>Current Age</th><th>Years to 60</th><th>SIP Needed (Flat)</th><th>SIP Needed (10% Step-Up)</th></tr></thead>
        <tbody>
            <tr><td><strong>25</strong></td><td>35</td><td>₹1,498</td><td>₹650</td></tr>
            <tr><td><strong>30</strong></td><td>30</td><td>₹2,698</td><td>₹1,350</td></tr>
            <tr><td><strong>35</strong></td><td>25</td><td>₹5,227</td><td>₹2,950</td></tr>
            <tr><td><strong>40</strong></td><td>20</td><td>₹10,109</td><td>₹6,500</td></tr>
            <tr><td><strong>45</strong></td><td>15</td><td>₹20,143</td><td>₹14,800</td></tr>
            <tr><td><strong>50</strong></td><td>10</td><td>₹43,041</td><td>₹35,200</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Start at 25:</strong> Just <strong>₹650/month</strong> with 10% annual step-up = ₹1 Crore by 60. That&rsquo;s less than ₹22/day! <strong>Start at 45:</strong> You need <strong>₹14,800/month</strong> &mdash; 23× more. The cost of delay is devastating.
    </div>

    <h2 id="milestones">Wealth Milestones &mdash; ₹25 Lakh to ₹10 Crore</h2>
    <p>One of the most fascinating aspects of compounding is that each successive crore comes <strong>faster</strong> than the previous one:</p>
    <table>
        <thead><tr><th>Milestone</th><th>Time (₹15K SIP at 12%)</th><th>Gap from Previous</th></tr></thead>
        <tbody>
            <tr><td>₹25 Lakh</td><td>~8 years</td><td>&mdash;</td></tr>
            <tr><td>₹50 Lakh</td><td>~11.5 years</td><td>3.5 years</td></tr>
            <tr><td>₹1 Crore</td><td>~14 years</td><td><strong>2.5 years</strong></td></tr>
            <tr><td>₹2 Crore</td><td>~18 years</td><td>4 years</td></tr>
            <tr><td>₹5 Crore</td><td>~24 years</td><td>6 years</td></tr>
            <tr><td>₹10 Crore</td><td>~29 years</td><td>5 years</td></tr>
        </tbody>
    </table>
    <p>The jump from ₹50L to ₹1Cr takes only <strong>2.5 years</strong> vs 3.5 years for ₹25L to ₹50L. At scale, the compounding engine generates wealth equivalent to decades of SIP contributions in just a few years. Use our Milestone Tracker mode to see your personal timeline.</p>

    <h2 id="inflation-returns">Inflation and Real vs Nominal Returns</h2>
    <p>The <strong>Fisher Equation</strong> gives the precise real (purchasing power) return:</p>
    <div class="explanation__highlight">
        <strong>Real Return = ((1 + Nominal Return) &divide; (1 + Inflation)) &minus; 1</strong><br/>
        Example: 12% nominal return, 6% inflation → Real Return = (1.12 &divide; 1.06) &minus; 1 = <strong>5.66%</strong> (not 6% as simple subtraction suggests)
    </div>
    <table>
        <thead><tr><th>Investment</th><th>Nominal Return</th><th>Real Return (6% inflation)</th><th>₹1Cr doubles to ₹2Cr in</th></tr></thead>
        <tbody>
            <tr><td>FD</td><td>7%</td><td>0.9%</td><td>~80 years (real)</td></tr>
            <tr><td><a href="/in/ppf-calculator">PPF</a></td><td>7.1%</td><td>1.0%</td><td>~72 years (real)</td></tr>
            <tr><td>Index Fund</td><td>12%</td><td><strong>5.7%</strong></td><td><strong>~12.6 years (real)</strong></td></tr>
            <tr><td>Mid-Cap</td><td>15%</td><td>8.5%</td><td>~8.5 years (real)</td></tr>
        </tbody>
    </table>

    <h2 id="direct-vs-regular">Direct vs Regular Mutual Funds</h2>
    <p>The expense ratio difference between Direct and Regular plans may seem small (0.5&ndash;1%), but over 20&ndash;30 years, it compounds to a <strong>15&ndash;25% wealth difference</strong>:</p>
    <table>
        <thead><tr><th>Parameter</th><th>Direct Plan</th><th>Regular Plan</th></tr></thead>
        <tbody>
            <tr><td><strong>Expense Ratio</strong></td><td>0.3&ndash;1.0%</td><td>1.0&ndash;2.0%</td></tr>
            <tr><td><strong>Effective Return (12% base)</strong></td><td>~11.5%</td><td>~10.5&ndash;11%</td></tr>
            <tr><td><strong>₹10K SIP for 20 years</strong></td><td><strong>₹95.1L</strong></td><td>₹83.2L</td></tr>
            <tr><td><strong>₹10K SIP for 30 years</strong></td><td><strong>₹3.23 Cr</strong></td><td>₹2.60 Cr</td></tr>
            <tr><td><strong>Extra Wealth (30 yrs)</strong></td><td colspan="2"><strong>₹63 Lakh more with Direct</strong></td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common Mistakes in Wealth Creation</h2>
    <ol>
        <li><strong>Stopping SIP during market crashes</strong> &mdash; Crashes are when you buy units cheapest. Historically, markets recover and reach new highs within 2&ndash;3 years.</li>
        <li><strong>Ignoring inflation</strong> &mdash; ₹1 Crore won&rsquo;t be enough in 20 years. Plan for ₹3&ndash;5 Crore with our <a href="/in/pension-calculator">Pension Calculator</a>.</li>
        <li><strong>Not using Step-Up SIP</strong> &mdash; Keeping SIP flat despite salary growth wastes compounding potential. Even 5% annual increase makes a huge difference.</li>
        <li><strong>Choosing Regular plans over Direct</strong> &mdash; Commission drag costs ₹63 Lakh+ over 30 years. Always invest in Direct plans.</li>
        <li><strong>Over-diversification</strong> &mdash; Holding 15+ funds cancels out alpha. 4&ndash;5 well-chosen funds are sufficient.</li>
        <li><strong>Chasing past performance</strong> &mdash; Last year&rsquo;s top fund often underperforms next year. Stick with index funds for core allocation.</li>
        <li><strong>Not harvesting LTCG</strong> &mdash; You can realize ₹1.25 lakh in equity LTCG tax-free every year. Sell and reinvest to reset your cost basis.</li>
    </ol>
`;

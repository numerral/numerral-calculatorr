import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import SWPCalculatorCore from "@/components/calculator/SWPCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "SWP Calculator India 2026 — Systematic Withdrawal Plan Monthly Income & Safe Withdrawal Rate",
    description: "Free SWP Calculator with 4 modes: Withdrawal Planner (month-by-month depletion schedule, inflation toggle), SWP vs FD Income comparison, Corpus Required reverse calculator, and Safe Withdrawal Rate Finder (India-adapted SWR). Covers SWP tax (LTCG/STCG/FIFO), retirement planning, and best fund types.",
    keywords: ["SWP calculator", "systematic withdrawal plan calculator", "SWP mutual fund India", "retirement income calculator", "safe withdrawal rate India", "SWP vs FD", "SWP tax India", "monthly income from mutual fund", "corpus required for retirement"],
    alternates: buildCountryAlternates("IN", "/in/swp-calculator", "swp-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is SWP in mutual funds?", answer: "SWP (Systematic Withdrawal Plan) is a facility offered by mutual funds that allows you to withdraw a fixed amount at regular intervals (monthly, quarterly, annually) from your mutual fund investment. It works as the reverse of SIP — instead of investing regularly, you withdraw regularly. The fund house redeems the required number of units at the prevailing NAV to generate your withdrawal. Your remaining corpus continues to earn returns." },
    { question: "How does SWP differ from SIP?", answer: "SIP is for wealth accumulation — you invest small amounts regularly to build a corpus. SWP is for wealth distribution — you withdraw from an existing corpus for regular income. SIP uses rupee cost averaging to buy units; SWP redeems units at varying NAVs. Typically, you use SIP during your earning years (25-55) and SWP during retirement (55+). Many investors transition from SIP accumulation to SWP withdrawal at retirement." },
    { question: "What is the safe withdrawal rate for India?", answer: "The US '4% rule' (withdraw 4% of initial corpus annually, adjusted for inflation) doesn't directly apply in India because Indian inflation averages 6-7% vs 2-3% in the US. Indian financial planners recommend 2.5-3.5% initial withdrawal rate for a 30-year retirement horizon. At 3% SWR with 9% returns and 6% inflation, a ₹1 Cr corpus can sustain ₹25,000/month. Use our Safe Rate Finder mode to find your exact number." },
    { question: "Is SWP better than FD for regular income?", answer: "For most investors in the 20-30% tax bracket, SWP from a hybrid/BAF fund is significantly more tax-efficient than FD. FD interest is 100% taxable at your slab rate (30% bracket: 7% FD → 4.9% effective). SWP withdrawals are part capital return + part gain — only the gain portion is taxed, and equity LTCG up to ₹1.25L/year is exempt. SWP also offers potential for capital appreciation, while FD principal erodes with inflation." },
    { question: "How is SWP taxed in India?", answer: "SWP taxation depends on fund type and holding period. Equity funds: STCG (held <12 months) at 20%, LTCG (held >12 months) at 12.5% with ₹1.25L annual exemption. Debt funds: all gains taxed at your income tax slab rate regardless of holding period. The FIFO (First-In, First-Out) method determines which units are redeemed first. Important: No TDS is deducted on mutual fund SWP, unlike FD interest where TDS applies above ₹50K (senior citizens)." },
    { question: "What is FIFO method in SWP taxation?", answer: "FIFO (First-In, First-Out) means the units purchased earliest are considered sold first during SWP redemption. This matters for tax calculation — if your earliest units were bought over 12 months ago, they qualify for LTCG treatment (12.5% for equity). If you started SWP immediately after lump sum investment, the first 12 months' withdrawals will be taxed as STCG (20%). Strategy: Wait 12 months after lump sum investment before starting SWP to ensure LTCG treatment." },
    { question: "Can SWP provide lifelong income?", answer: "Yes, if your withdrawal rate is lower than or equal to your return rate. For example, withdrawing 6% annually from a fund earning 9% means your corpus grows by 3% per year even while providing income. However, with inflation-adjusted withdrawals (increasing 6% annually), even a modest 3% gap will eventually deplete the corpus. Use our Withdrawal Planner with the inflation toggle to model exact scenarios for your situation." },
    { question: "Which mutual fund is best for SWP?", answer: "Best fund types for SWP: (1) Balanced Advantage/Dynamic Asset Allocation Funds (BAF) — auto-rebalance between equity/debt, 8-10% returns, moderate risk. (2) Aggressive Hybrid Funds — 65-80% equity, qualifies for equity taxation. (3) Equity Savings Funds — lower volatility, 7-9% returns. (4) Debt/Liquid Funds — for short-term SWP (1-3 years). Avoid pure equity funds for SWP as NAV volatility can force selling at losses." },
    { question: "What happens when my SWP corpus runs out?", answer: "When your corpus reaches zero, the SWP automatically stops as there are no units left to redeem. The fund house will notify you. You will have received the total of all monthly withdrawals up to that point. This is why it's critical to plan: use our Withdrawal Planner to check if your corpus survives the intended duration. If it depletes early, reduce monthly withdrawal, increase corpus, or choose higher-return funds." },
    { question: "Can I change SWP withdrawal amount later?", answer: "Yes, most mutual funds allow you to modify your SWP amount, frequency, or stop it entirely at any time. You typically need to submit a modification request (online or physical form) giving 7-10 business days notice. Some AMCs allow instant changes via their apps. You can also pause SWP temporarily without cancelling it. This flexibility is a major advantage over annuity/pension plans which are usually rigid." },
    { question: "Is there TDS on SWP withdrawals?", answer: "No, there is no TDS (Tax Deducted at Source) on mutual fund SWP withdrawals for resident Indians. This is a significant advantage over FDs where TDS is deducted at 10% if interest exceeds ₹50,000/year (₹50K for senior citizens). However, you are still liable to pay tax on capital gains when filing your ITR. NRI investors face TDS on mutual fund redemptions at applicable rates." },
    { question: "SWP vs dividend plan — which is better?", answer: "SWP is almost always better than dividend/IDCW plans. Dividends are unpredictable (AMC decides timing and amount), while SWP gives you control over amount and frequency. Tax treatment: Dividend income is taxed at your slab rate on the full amount. SWP gains are taxed partially (only the gain portion) and equity LTCG has ₹1.25L exemption. Since 2020, dividend taxation shifted from DDT to recipient — making SWP even more tax-efficient." },
    { question: "How much corpus do I need for ₹50K/month SWP?", answer: "At 9% return for 25 years: approximately ₹55-60 lakh. At 8% return for 30 years: approximately ₹65-70 lakh. At 9% return for 30 years (with 6% inflation adjustment): approximately ₹1.2-1.5 crore. The exact amount depends on your expected returns, duration, and whether you increase withdrawals for inflation. Use our Corpus Required mode for precise calculation with your specific assumptions." },
    { question: "Can I do SWP from ELSS?", answer: "You can start SWP from ELSS only after the mandatory 3-year lock-in period for each unit. Since ELSS units are locked individually, units purchased via SIP unlock gradually (each month's units unlock 3 years after purchase). For lump sum ELSS investment, all units unlock together after 3 years. Post lock-in, ELSS functions like any equity fund for SWP. SWP from ELSS is not common — most investors use hybrid/BAF funds instead." },
    { question: "What is the minimum SWP amount?", answer: "Most mutual funds set minimum SWP at ₹500-₹1,000 per installment. The minimum corpus required to start SWP varies by fund (typically ₹10,000-₹25,000). Some AMCs like HDFC and SBI require minimum ₹1,000/installment. There's no maximum limit — you can withdraw the entire remaining balance in a single SWP if needed. Check your specific fund's scheme document for exact minimums." },
];

export default function SWPCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "SWP Calculator" },
        ]),
        webAppSchema("SWP Calculator India 2026", canonicalUrl("/in/swp-calculator")),
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
            <Script id="schema-swp" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "SWP Calculator" },
            ]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>SWP Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate systematic withdrawal plan returns with 4 modes — Withdrawal Planner (month-by-month depletion
                schedule with inflation toggle), SWP vs FD Income comparison, Corpus Required reverse calculator, and
                Safe Withdrawal Rate Finder (India-adapted SWR). Covers SWP tax (LTCG/STCG/FIFO) and retirement planning.
            </p>
            <AuthorBadge categoryKey="salary" />
            <SWPCalculatorCore />

            <section className="in-content"><div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} /></section>
            <FAQAccordion title="SWP Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Build your corpus via SIP before starting SWP</div>
                        </div>
                    </Link>
                    <Link href="/in/lumpsum-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Lumpsum Calculator</div>
                            <div className="in-related-link__desc">Invest lump sum before starting SWP withdrawals</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">Calculate tax on SWP capital gains</div>
                        </div>
                    </Link>
                    <Link href="/in/pension-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏖️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Pension Calculator</div>
                            <div className="in-related-link__desc">Combine NPS pension with SWP for retirement</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-swp">What Is a Systematic Withdrawal Plan (SWP)?</h2>
    <p>A <strong>Systematic Withdrawal Plan (SWP)</strong> is a mutual fund facility that allows investors to withdraw a fixed amount at regular intervals from their investment. It is essentially the <strong>reverse of a <a href="/in/sip-calculator">SIP</a></strong> — while SIP helps you accumulate wealth by investing regularly, SWP helps you distribute wealth by withdrawing regularly.</p>
    <p>SWP is widely used for <strong>retirement income, supplementing pension, funding education expenses</strong>, and any situation where consistent cash flow from investments is needed.</p>
    <div class="explanation__highlight">
        <strong>How It Works:</strong> You invest a lump sum corpus into a mutual fund. On specified dates, the fund house redeems the required number of <strong>units at the prevailing NAV</strong> to generate your requested withdrawal amount. The remaining corpus continues earning returns. If returns exceed withdrawals, your corpus can actually grow while providing income.
    </div>

    <h2 id="how-swp-works">How SWP Works — Units, NAV &amp; Cash Flow</h2>
    <h3>Worked Example: ₹50 Lakh Corpus, ₹40,000/month Withdrawal</h3>
    <table>
        <thead><tr><th>Month</th><th>Opening Balance</th><th>Interest (0.67%)</th><th>Withdrawal</th><th>Closing Balance</th></tr></thead>
        <tbody>
            <tr><td>1</td><td>₹50,00,000</td><td>₹33,333</td><td>−₹40,000</td><td>₹49,93,333</td></tr>
            <tr><td>2</td><td>₹49,93,333</td><td>₹33,289</td><td>−₹40,000</td><td>₹49,86,622</td></tr>
            <tr><td>6</td><td>₹49,60,148</td><td>₹33,068</td><td>−₹40,000</td><td>₹49,53,216</td></tr>
            <tr><td>12</td><td>₹49,14,102</td><td>₹32,761</td><td>−₹40,000</td><td>₹49,06,863</td></tr>
            <tr><td>60 (5 yrs)</td><td>₹47,12,543</td><td>₹31,417</td><td>−₹40,000</td><td>₹47,03,960</td></tr>
            <tr><td>120 (10 yrs)</td><td>₹43,58,217</td><td>₹29,055</td><td>−₹40,000</td><td>₹43,47,272</td></tr>
            <tr><td>240 (20 yrs)</td><td>₹32,89,143</td><td>₹21,928</td><td>−₹40,000</td><td>₹32,71,071</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> At 8% annual return (0.67%/month), withdrawing ₹40,000/month from ₹50L corpus = 9.6% withdrawal rate per year. Since withdrawals exceed returns, the corpus slowly depletes over ~25 years. Use our calculator to find your <strong>sustainable withdrawal rate</strong>.
    </div>

    <h2 id="swp-vs-sip">SWP vs SIP — Accumulation vs Distribution</h2>
    <table>
        <thead><tr><th>Factor</th><th>SIP (Accumulation)</th><th>SWP (Distribution)</th></tr></thead>
        <tbody>
            <tr><td><strong>Purpose</strong></td><td>Build wealth over time</td><td>Generate regular income</td></tr>
            <tr><td><strong>Cash Flow</strong></td><td>Money flows IN to fund</td><td>Money flows OUT of fund</td></tr>
            <tr><td><strong>Units</strong></td><td>Units are purchased</td><td>Units are redeemed</td></tr>
            <tr><td><strong>NAV Impact</strong></td><td>Low NAV = buy more units</td><td>High NAV = sell fewer units</td></tr>
            <tr><td><strong>Life Stage</strong></td><td>Earning years (25&ndash;55)</td><td>Retirement years (55+)</td></tr>
            <tr><td><strong>Tax Event</strong></td><td>No tax until redemption</td><td>Tax on capital gains each withdrawal</td></tr>
            <tr><td><strong>Typical Duration</strong></td><td>10&ndash;30 years</td><td>15&ndash;30 years</td></tr>
        </tbody>
    </table>

    <h2 id="swp-vs-fd">SWP vs FD Interest Income — Why SWP Wins</h2>
    <p>For investors in the 20%+ tax bracket, SWP from a hybrid mutual fund is significantly more <strong>tax-efficient</strong> than FD interest:</p>
    <table>
        <thead><tr><th>Factor</th><th>SWP (Hybrid MF)</th><th>FD Interest</th></tr></thead>
        <tbody>
            <tr><td><strong>Pre-tax Return</strong></td><td>8&ndash;10%</td><td>6.5&ndash;7.5%</td></tr>
            <tr><td><strong>Tax Treatment</strong></td><td>Only GAINS portion taxed</td><td>ENTIRE interest taxable</td></tr>
            <tr><td><strong>Equity LTCG</strong></td><td>12.5% (₹1.25L exempt)</td><td>N/A</td></tr>
            <tr><td><strong>TDS</strong></td><td>None</td><td>10% above ₹50K interest</td></tr>
            <tr><td><strong>Effective Rate (30% slab)</strong></td><td>~8.5%</td><td>~4.9%</td></tr>
            <tr><td><strong>Inflation Protection</strong></td><td>Corpus can grow</td><td>Principal erodes</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>Change amount anytime</td><td>Penalty for premature break</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tax Advantage Explained:</strong> When you withdraw ₹40,000/month via SWP, each withdrawal consists of (a) <strong>return of your own capital</strong> (not taxed) and (b) <strong>capital gains</strong> (partially taxed). In a well-aged equity fund, most of your gains qualify for LTCG with ₹1.25L annual exemption. FD interest is 100% taxable — no capital return component, no exemption.
    </div>

    <h2 id="swp-tax">SWP Tax Rules in India (FY 2025&ndash;26)</h2>
    <table>
        <thead><tr><th>Fund Type</th><th>Holding Period</th><th>Tax Classification</th><th>Tax Rate</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity MF</strong></td><td>&le; 12 months</td><td>STCG</td><td>20%</td></tr>
            <tr><td><strong>Equity MF</strong></td><td>&gt; 12 months</td><td>LTCG</td><td>12.5% (₹1.25L exempt/yr)</td></tr>
            <tr><td><strong>Debt MF</strong></td><td>Any duration</td><td>Capital Gains</td><td>Slab rate (no indexation)</td></tr>
            <tr><td><strong>Hybrid (Equity &gt;65%)</strong></td><td>&gt; 12 months</td><td>LTCG</td><td>12.5% (₹1.25L exempt)</td></tr>
            <tr><td><strong>Hybrid (Equity &lt;65%)</strong></td><td>Any duration</td><td>Capital Gains</td><td>Slab rate</td></tr>
        </tbody>
    </table>
    <h3>FIFO Method — How SWP Units Are Taxed</h3>
    <p>When you redeem units via SWP, the <strong>FIFO (First-In, First-Out)</strong> method applies — units purchased earliest are considered sold first. This is crucial for tax planning:</p>
    <div class="explanation__highlight">
        <strong>Strategy:</strong> If you invest a lump sum and start SWP immediately, the first 12 months&rsquo; withdrawals will be taxed as <strong>STCG (20%)</strong> because units haven&rsquo;t completed 1 year. Wait 12 months after investing to start SWP, and all withdrawals from equity funds qualify for <strong>LTCG (12.5%)</strong>.
    </div>

    <h2 id="safe-withdrawal-rate">The Safe Withdrawal Rate for India</h2>
    <p>The famous <strong>&ldquo;4% Rule&rdquo;</strong> from the Trinity Study (US, 1998) suggests withdrawing 4% of initial retirement corpus annually, adjusted for inflation, to last 30 years. However, this rule <strong>doesn&rsquo;t directly apply to India</strong>:</p>
    <table>
        <thead><tr><th>Factor</th><th>USA</th><th>India</th></tr></thead>
        <tbody>
            <tr><td><strong>Inflation</strong></td><td>2&ndash;3%</td><td>6&ndash;7%</td></tr>
            <tr><td><strong>Safe WR</strong></td><td>4%</td><td><strong>2.5&ndash;3.5%</strong></td></tr>
            <tr><td><strong>Bond Returns</strong></td><td>2&ndash;4%</td><td>6&ndash;7%</td></tr>
            <tr><td><strong>Equity Returns</strong></td><td>7&ndash;10%</td><td>10&ndash;13%</td></tr>
            <tr><td><strong>Healthcare Costs</strong></td><td>Partially insured</td><td>Mostly out-of-pocket</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>🇮🇳 India Recommendation:</strong> Start with <strong>2.5&ndash;3%</strong> initial withdrawal rate for a 30-year horizon. This means for ₹50K/month income, you need ₹2&ndash;2.4 Crore corpus. Review and adjust every 3&ndash;5 years. Use our <strong>Safe Rate Finder</strong> mode for your exact calculation.
    </div>

    <h2 id="best-funds">Best Fund Types for SWP</h2>
    <table>
        <thead><tr><th>Fund Type</th><th>Returns</th><th>Risk</th><th>Best For SWP Duration</th><th>Tax Status</th></tr></thead>
        <tbody>
            <tr><td><strong>Balanced Advantage (BAF)</strong></td><td>8&ndash;10%</td><td>Moderate</td><td>10&ndash;25 years</td><td>Equity (12.5% LTCG)</td></tr>
            <tr><td><strong>Aggressive Hybrid</strong></td><td>9&ndash;11%</td><td>Moderate-High</td><td>15&ndash;30 years</td><td>Equity (12.5% LTCG)</td></tr>
            <tr><td><strong>Equity Savings</strong></td><td>7&ndash;9%</td><td>Low-Moderate</td><td>5&ndash;15 years</td><td>Equity (12.5% LTCG)</td></tr>
            <tr><td><strong>Large Cap Index</strong></td><td>10&ndash;12%</td><td>High (volatile)</td><td>20+ years (risky)</td><td>Equity (12.5% LTCG)</td></tr>
            <tr><td><strong>Liquid/Ultra-Short</strong></td><td>5&ndash;7%</td><td>Very Low</td><td>1&ndash;3 years</td><td>Slab rate</td></tr>
            <tr><td><strong>Conservative Hybrid</strong></td><td>7&ndash;8%</td><td>Low</td><td>5&ndash;10 years</td><td>Slab rate (&lt;65% equity)</td></tr>
        </tbody>
    </table>

    <h2 id="retirement-planning">SWP for Retirement Planning</h2>
    <p>The ideal retirement income strategy combines multiple income sources:</p>
    <table>
        <thead><tr><th>Source</th><th>Type</th><th>Monthly Income</th><th>Tax</th></tr></thead>
        <tbody>
            <tr><td><strong><a href="/in/pension-calculator">NPS Pension</a></strong></td><td>Fixed annuity (40%+ of corpus)</td><td>Guaranteed</td><td>Slab rate</td></tr>
            <tr><td><strong>SWP from BAF</strong></td><td>Flexible withdrawal</td><td>Variable (your control)</td><td>12.5% LTCG</td></tr>
            <tr><td><strong>PPF Maturity</strong></td><td>Lump sum at 15 years</td><td>One-time</td><td>Tax-free (EEE)</td></tr>
            <tr><td><strong>Senior Citizen FD</strong></td><td>Quarterly interest</td><td>Guaranteed</td><td>Slab rate</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Optimal Combo:</strong> NPS annuity (for guaranteed floor income) + SWP from Balanced Advantage Fund (for growth + flexibility) + Senior Citizen FD (for safe emergency buffer). Use <a href="/in/income-tax-calculator">Income Tax Calculator</a> to optimize tax across all sources.
    </div>

    <h2 id="corpus-guide">Corpus Required for SWP — Quick Reference</h2>
    <p>How much corpus you need for different monthly incomes (assuming 9% return, 25-year duration):</p>
    <table>
        <thead><tr><th>Monthly Income</th><th>Annual Withdrawal</th><th>Corpus Needed</th><th>Withdrawal Rate</th></tr></thead>
        <tbody>
            <tr><td>₹25,000</td><td>₹3,00,000</td><td><strong>₹28&ndash;32 Lakh</strong></td><td>~9.5%</td></tr>
            <tr><td>₹50,000</td><td>₹6,00,000</td><td><strong>₹56&ndash;65 Lakh</strong></td><td>~9.5%</td></tr>
            <tr><td>₹75,000</td><td>₹9,00,000</td><td><strong>₹85&ndash;97 Lakh</strong></td><td>~9.5%</td></tr>
            <tr><td>₹1,00,000</td><td>₹12,00,000</td><td><strong>₹1.13&ndash;1.30 Cr</strong></td><td>~9.5%</td></tr>
            <tr><td>₹1,50,000</td><td>₹18,00,000</td><td><strong>₹1.70&ndash;1.95 Cr</strong></td><td>~9.5%</td></tr>
            <tr><td>₹2,00,000</td><td>₹24,00,000</td><td><strong>₹2.26&ndash;2.60 Cr</strong></td><td>~9.5%</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common Mistakes in SWP</h2>
    <ol>
        <li><strong>Over-withdrawing from the start</strong> &mdash; Withdrawing more than your return rate depletes corpus rapidly. Start conservative (3&ndash;4% annually) and adjust upward if returns exceed expectations.</li>
        <li><strong>Ignoring inflation in withdrawals</strong> &mdash; ₹50K/month today will barely cover ₹25K of expenses in 12 years at 6% inflation. Plan for annual increase in withdrawals using our inflation toggle.</li>
        <li><strong>Using pure equity fund for SWP</strong> &mdash; Market crashes can force selling at severe losses. Use <strong>Balanced Advantage / Hybrid</strong> funds that auto-rebalance between equity and debt.</li>
        <li><strong>Starting SWP immediately after lump sum</strong> &mdash; First 12 months&rsquo; withdrawals will be taxed as STCG (20%). Wait 12 months to get LTCG treatment (12.5%).</li>
        <li><strong>Not separating emergency fund</strong> &mdash; Keep 6&ndash;12 months&rsquo; expenses in liquid fund separately. Don&rsquo;t rely on SWP corpus for emergencies.</li>
        <li><strong>Choosing dividend plan instead of SWP</strong> &mdash; Dividend amounts and timing are decided by AMC. SWP gives you full control. Dividend income is also fully taxable at slab rate.</li>
    </ol>
`;

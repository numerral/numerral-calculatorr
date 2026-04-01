import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import MutualFundReturnsCalculatorCore from "@/components/calculator/MutualFundReturnsCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Mutual Fund Returns Calculator India 2026 — CAGR, XIRR, LTCG Tax & SIP vs Lump Sum",
    description: "Free mutual fund returns calculator with 4 modes: Returns Calculator (SIP + Lump Sum with inflation & exit load), Lump Sum vs SIP vs STP comparison, LTCG/STCG Tax Impact Analyser by SEBI category, and Goal Reverse Planner. Covers CAGR formula, XIRR for SIP, direct vs regular expense ratio, Section 80C ELSS, and 2026 tax rules.",
    keywords: ["mutual fund returns calculator", "mutual fund calculator India", "CAGR calculator", "XIRR SIP calculator", "mutual fund tax calculator", "LTCG tax mutual fund", "STCG tax 20%", "SIP vs lump sum", "mutual fund return formula", "direct vs regular mutual fund", "ELSS tax saving", "exit load mutual fund", "SEBI mutual fund categories", "mutual fund inflation adjusted returns"],
    alternates: buildCountryAlternates("IN", "/in/mutual-fund-returns-calculator", "mutual-fund-returns-calculator"),
};

const FAQ_ITEMS = [
    { question: "How to calculate mutual fund returns?", answer: "Mutual fund returns are calculated using different methods depending on the investment type. For lump sum investments, use CAGR (Compound Annual Growth Rate): CAGR = (Ending Value / Beginning Value)^(1/Years) − 1. For SIP investments with multiple cash flows at different dates, use XIRR (Extended Internal Rate of Return) in Excel or Google Sheets. For investments held less than 1 year, use Absolute Return: ((Current Value − Invested) / Invested) × 100. Our calculator supports all three methods — select Lump Sum or SIP mode and it automatically applies the correct formula." },
    { question: "What is CAGR and how is it different from absolute return?", answer: "CAGR (Compound Annual Growth Rate) measures the annualised return of an investment, accounting for compounding. Absolute return simply measures the total percentage gain without considering time. Example: If ₹1 lakh grows to ₹1.5 lakh in 3 years, the absolute return is 50%, but the CAGR is only 14.47% per year. CAGR is more meaningful for comparing investments of different durations because it normalises returns on a per-year basis. Always use CAGR for periods longer than 1 year, and absolute return for periods under 1 year." },
    { question: "What is XIRR and why is it used for SIP returns?", answer: "XIRR (Extended Internal Rate of Return) calculates the annualised return when you have multiple investments at different dates — exactly what happens with SIP. Unlike CAGR which assumes a single lump sum, XIRR accounts for the fact that each SIP installment has been invested for a different duration. In Excel: =XIRR(cash_flows, dates). Enter each SIP as a negative value, and the final redemption value as positive. XIRR is the only accurate way to measure SIP returns — never use simple CAGR for SIP as it will give misleading results." },
    { question: "What are the LTCG and STCG tax rates on mutual funds in 2026?", answer: "For equity-oriented funds (≥65% domestic equity): STCG (held <12 months) = 20% flat. LTCG (held >12 months) = 12.5% on gains exceeding ₹1.25 lakh per financial year. For debt funds (<35% equity): All gains taxed at your income tax slab rate regardless of holding period (no LTCG benefit since April 2023). For other hybrid funds (<65% equity): STCG (held <24 months) = slab rate. LTCG (held >24 months) = 12.5%. Additionally, 4% health and education cess applies on all tax amounts." },
    { question: "Are debt mutual fund gains taxed at slab rate?", answer: "Yes, since April 1, 2023, all gains from debt mutual funds (funds with less than 35% domestic equity exposure) are taxed at your applicable income tax slab rate — regardless of how long you hold them. The indexation benefit that was previously available for debt funds held over 3 years has been removed. This means a person in the 30% bracket pays 31.2% (including cess) on all debt fund gains. This makes debt funds less tax-efficient than before, though they still offer better liquidity and potentially higher returns than bank FDs." },
    { question: "What is the difference between direct and regular mutual funds?", answer: "Direct plans are purchased directly from the AMC (Asset Management Company) without any intermediary, so they have a lower expense ratio (TER). Regular plans are bought through distributors/brokers who earn commission, increasing the TER by 0.5%–1.0%. Over time, this expense difference compounds significantly. Example: ₹10,000/month SIP for 20 years at 12% (direct) vs 11% (regular after commission) = ₹99.9L vs ₹87.6L — a difference of ₹12.3 lakh! Always choose Direct plans when investing through platforms like Groww, Zerodha Coin, or AMC websites directly." },
    { question: "How does exit load affect my mutual fund returns?", answer: "Exit load is a fee charged when you redeem (sell) mutual fund units before a specified period. Most equity funds charge 1% exit load if redeemed within 1 year of purchase. On a ₹10 lakh redemption, that's ₹10,000 in exit load. Some funds have no exit load: Liquid funds (after 7 days), overnight funds, and some index funds. ELSS funds have a 3-year lock-in but zero exit load after that. Our Tax Impact mode automatically calculates exit load based on your holding period and fund type." },
    { question: "What is TER (Total Expense Ratio) and why does it matter?", answer: "TER is the annual fee charged by the mutual fund to manage your money. It includes fund management fees, administrative costs, and distributor commissions (in regular plans). As of April 2026, SEBI has introduced a new Base Expense Ratio (BER) framework that separates management fees from brokerage and statutory levies. Typical TER ranges: Equity direct = 0.3%–1.0%, Equity regular = 1.0%–2.0%, Debt direct = 0.1%–0.5%. A 1% higher TER over 20 years on ₹50 lakh can cost you ₹15–20 lakh in returns. Always compare TER before investing." },
    { question: "Is SIP better than lump sum for mutual fund investment?", answer: "Neither is universally better — it depends on market conditions. At a constant return rate, lump sum always generates higher returns because the full amount compounds from day 1. However, in volatile real markets, SIP provides rupee cost averaging — you buy more units when markets are low and fewer when markets are high, reducing your average cost. Best strategies: (1) Have a large sum? Use STP (Systematic Transfer Plan) — park in liquid fund, transfer to equity monthly over 3–6 months. (2) Regular income? SIP is ideal. (3) Market crash? Lump sum beats SIP because you buy everything at the bottom." },
    { question: "What is rupee cost averaging?", answer: "Rupee cost averaging is the key benefit of SIP investing. When you invest a fixed amount every month, you automatically buy more units when NAV is low and fewer units when NAV is high. Over time, this averages out your purchase cost, reducing the impact of market volatility. Example: ₹10,000 monthly SIP — Month 1: NAV ₹100, you get 100 units. Month 2: NAV ₹80 (market dip), you get 125 units. Month 3: NAV ₹120, you get 83 units. Average cost: ₹97.4/unit (lower than average NAV of ₹100). This works best in volatile, sideways markets." },
    { question: "What is the average mutual fund return in India for 10 years?", answer: "Historical 10-year category averages (as of March 2026): Large Cap: 11–13% CAGR. Mid Cap: 14–17% CAGR. Small Cap: 15–20% CAGR (higher volatility). Flexi Cap: 12–15% CAGR. ELSS: 12–15% CAGR. Aggressive Hybrid: 10–13% CAGR. Debt (Short Duration): 6–8% CAGR. Liquid Fund: 5–7% CAGR. The Nifty 50 index has delivered approximately 12% CAGR over the last 20 years. Important: Past performance doesn't guarantee future returns. Use 10–12% for conservative planning and 12–14% for equity-heavy portfolios." },
    { question: "Can I lose money in mutual funds?", answer: "Yes, mutual funds are subject to market risk. Equity funds can lose 20–40% in a market crash (like March 2020 when Nifty fell 38%). However, historically, no diversified equity fund has given negative returns over any 7+ year period in India. Key risk-reduction strategies: (1) Stay invested for 7+ years minimum in equity. (2) Use SIP for rupee cost averaging. (3) Diversify across large cap, mid cap, and debt. (4) Don't panic-sell during corrections — they are temporary. (5) Debt/liquid funds have very low risk of capital loss. The biggest risk in mutual funds is actually not investing long enough." },
    { question: "What is the lock-in period for ELSS mutual funds?", answer: "ELSS (Equity Linked Savings Scheme) has a mandatory 3-year lock-in period — the shortest among all Section 80C tax-saving instruments. Each SIP installment has its own 3-year lock-in. For example, your January 2024 SIP unlocks in January 2027, February 2024 SIP unlocks in February 2027, and so on. After the lock-in, there is zero exit load. ELSS qualifies for up to ₹1.5 lakh deduction under Section 80C (Old Tax Regime only). Returns are taxed as equity LTCG: 12.5% on gains exceeding ₹1.25 lakh. ELSS offers the dual benefit of tax saving + market-linked growth." },
    { question: "How do I calculate post-tax mutual fund returns?", answer: "Step 1: Calculate gross maturity using CAGR or XIRR. Step 2: Determine gain = Maturity − Invested Amount. Step 3: Classify the fund (equity/debt/hybrid) and determine holding period. Step 4: Apply the correct tax rate — Equity LTCG: 12.5% on gains above ₹1.25L, Equity STCG: 20%, Debt: slab rate. Step 5: Add 4% cess. Step 6: Subtract exit load if applicable. Our Tax Impact Analyser (Mode 3) does all this automatically — just enter your investment details and select the SEBI fund category. It shows both pre-tax and post-tax CAGR for accurate comparison." },
    { question: "What is NAV in mutual funds?", answer: "NAV (Net Asset Value) is the per-unit market value of a mutual fund scheme. It's calculated daily as: NAV = (Total Assets − Total Liabilities) / Total Outstanding Units. When you invest ₹10,000 in a fund with NAV ₹50, you get 200 units. If NAV rises to ₹60, your 200 units are worth ₹12,000 (20% gain). NAV is updated at the end of each business day (typically by 11 PM). Important: A lower NAV doesn't mean a fund is 'cheaper' or 'better' — a fund with NAV ₹500 can give the same percentage returns as one with NAV ₹10. Always compare returns percentage, not NAV values." },
];

export default function MutualFundReturnsCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Mutual Fund Returns Calculator" },
        ]),
        webAppSchema("Mutual Fund Returns Calculator India 2026", canonicalUrl("/in/mutual-fund-returns-calculator")),
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
            <Script id="schema-mf-returns" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Mutual Fund Returns Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Mutual Fund Returns Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Free mutual fund returns calculator with 4 modes: Returns Calculator (Lump Sum + SIP with inflation adjustment, LTCG tax, and exit load), Lump Sum vs SIP vs STP comparison, LTCG/STCG Tax Impact Analyser by SEBI fund category, and Goal Reverse Planner. Covers CAGR formula, XIRR for SIP, direct vs regular expense ratio impact, Section 80C ELSS, and 2026 taxation rules for India.
            </p>
            <AuthorBadge categoryKey="salary" />
            <MutualFundReturnsCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Mutual Fund Returns Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Monthly SIP returns with step-up and XIRR modelling</div>
                        </div>
                    </Link>
                    <Link href="/in/lumpsum-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Lumpsum Calculator</div>
                            <div className="in-related-link__desc">One-time investment returns with Lump Sum vs SIP and STP planner</div>
                        </div>
                    </Link>
                    <Link href="/in/swp-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💰</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SWP Calculator</div>
                            <div className="in-related-link__desc">Systematic withdrawal for regular income from mutual funds</div>
                        </div>
                    </Link>
                    <Link href="/in/xirr-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📐</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">XIRR Calculator</div>
                            <div className="in-related-link__desc">Accurate annualised returns for irregular SIP and lump sum flows</div>
                        </div>
                    </Link>
                    <Link href="/in/fd-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏦</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">FD Calculator</div>
                            <div className="in-related-link__desc">Compare mutual fund returns with bank FD rates and SCSS</div>
                        </div>
                    </Link>
                    <Link href="/in/ppf-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏛️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">PPF Calculator</div>
                            <div className="in-related-link__desc">Tax-free 7.1% returns — MF vs PPF comparison for 80C</div>
                        </div>
                    </Link>
                    <Link href="/in/income-tax-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🧾</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Income Tax Calculator</div>
                            <div className="in-related-link__desc">Old vs New Regime — maximise ELSS + 80C deductions</div>
                        </div>
                    </Link>
                    <Link href="/in/compound-interest-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Compound Interest Calculator</div>
                            <div className="in-related-link__desc">Visualise compounding power behind mutual fund growth</div>
                        </div>
                    </Link>
                    <Link href="/in/retirement-corpus-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🛡️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Retirement Corpus Calculator</div>
                            <div className="in-related-link__desc">How much MF corpus you need for retirement in India</div>
                        </div>
                    </Link>
                    <Link href="/in/fire-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🔥</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">FIRE Calculator</div>
                            <div className="in-related-link__desc">Early retirement through aggressive MF SIP investing</div>
                        </div>
                    </Link>
                    <Link href="/in/crorepati-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💎</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Crorepati Calculator</div>
                            <div className="in-related-link__desc">When will your MF SIP make you a crorepati?</div>
                        </div>
                    </Link>
                    <Link href="/in/nps-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏛️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">NPS Calculator</div>
                            <div className="in-related-link__desc">NPS vs MF — pension + 80CCD(1B) tax benefit comparison</div>
                        </div>
                    </Link>
                    <Link href="/in/education-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🎓</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Education Loan Calculator</div>
                            <div className="in-related-link__desc">Fund education via MF SIP or loan? Compare options</div>
                        </div>
                    </Link>
                    <Link href="/in" className="in-related-link">
                        <span className="in-related-link__icon">🇮🇳</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">All India Calculators</div>
                            <div className="in-related-link__desc">Browse all India-specific financial tools</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-mf-calculator">What is a Mutual Fund Returns Calculator?</h2>
    <p>A <strong>mutual fund returns calculator</strong> is a free online tool that estimates the future value of your mutual fund investments based on the amount invested, expected rate of return, and investment duration. Unlike simple interest calculators, a mutual fund calculator accounts for the <strong>power of compounding</strong> — where your returns generate their own returns over time.</p>
    <p>Our calculator goes far beyond basic estimation. It supports <strong>4 distinct modes</strong>: a Returns Calculator (with both Lump Sum and SIP options, inflation adjustment, LTCG tax, and exit load toggles), a Lump Sum vs SIP vs STP comparison engine, a <strong>SEBI-category-aware Tax Impact Analyser</strong> that calculates post-tax returns for equity, debt, and hybrid funds, and a Goal Reverse Planner that tells you exactly how much to invest today to reach your target corpus.</p>
    <div class="explanation__highlight">
        <strong>Why Use a Calculator?</strong> The difference between estimated and actual returns can be enormous when taxes and inflation are ignored. A ₹10L investment at 12% for 10 years gives ₹31.06L gross — but after 12.5% LTCG tax, 1% exit load, and 6% inflation, the <strong>real after-tax value</strong> is only ₹15.2L in today's money. Our calculator shows you the real picture.
    </div>

    <h2 id="return-types">How Mutual Fund Returns Are Calculated — 5 Methods</h2>
    <p>Understanding different return metrics is critical for evaluating and comparing mutual fund performance accurately. Here are the five key methods:</p>
    <table>
        <thead><tr><th>Return Type</th><th>Formula</th><th>Best For</th><th>Use When</th></tr></thead>
        <tbody>
            <tr><td><strong>Absolute Return</strong></td><td>((End Value − Start Value) / Start Value) × 100</td><td>Investments &lt; 1 year</td><td>Quick gain/loss check</td></tr>
            <tr><td><strong>CAGR</strong></td><td>(End Value / Start Value)^(1/Years) − 1</td><td>Lump sum &gt; 1 year</td><td>Comparing funds over different periods</td></tr>
            <tr><td><strong>XIRR</strong></td><td>Excel: =XIRR(cashflows, dates)</td><td>SIP / irregular investments</td><td>Accurate SIP returns</td></tr>
            <tr><td><strong>Trailing Return</strong></td><td>Return between two specific dates</td><td>Point-to-point snapshot</td><td>"How did Fund X do last 3 years?"</td></tr>
            <tr><td><strong>Rolling Return</strong></td><td>Average of all possible N-year windows</td><td>Consistency analysis</td><td>"How reliable is this fund?"</td></tr>
        </tbody>
    </table>

    <h3>CAGR Detailed Example</h3>
    <p>You invest <strong>₹5,00,000</strong> in a large-cap equity fund. After <strong>5 years</strong>, it grows to <strong>₹9,50,000</strong>.</p>
    <div class="explanation__highlight">
        <strong>CAGR = (9,50,000 / 5,00,000)^(1/5) − 1 = (1.90)^(0.2) − 1 = 13.7% per annum</strong><br>
        This means your money grew at an average compounded rate of 13.7% each year, even though actual year-by-year returns may have varied (e.g., +22%, −8%, +18%, +15%, +12%).
    </div>

    <h3>XIRR for SIP — Why CAGR Doesn't Work</h3>
    <p>For SIP investments, each installment is invested for a different duration. Your January SIP has been invested for 12 months, but your December SIP for only 1 month. CAGR treats the entire amount as if it was invested for the full period — which is wrong for SIP.</p>
    <p><strong>XIRR</strong> solves this by treating each SIP as a separate cash flow with its own date. In Excel: enter each SIP as −₹10,000 with its date, and the final redemption value as a positive number. Use <code>=XIRR(B2:B14, A2:A14)</code>. Use our <a href="/in/xirr-calculator">XIRR Calculator</a> for instant results without spreadsheets.</p>

    <h2 id="sip-vs-lumpsum">Lump Sum vs SIP — Which Gives Higher Returns?</h2>
    <p>This is the most debated question in Indian mutual fund investing. The answer depends on market conditions:</p>
    <table>
        <thead><tr><th>Factor</th><th>Lump Sum</th><th>SIP</th><th>STP</th></tr></thead>
        <tbody>
            <tr><td><strong>How it works</strong></td><td>Full amount invested day 1</td><td>Fixed monthly installments</td><td>Park in liquid fund, transfer to equity monthly</td></tr>
            <tr><td><strong>In rising markets</strong></td><td>✅ Wins (full compounding)</td><td>❌ Loses (higher average cost)</td><td>Moderate</td></tr>
            <tr><td><strong>In falling markets</strong></td><td>❌ Loses (bought at peak)</td><td>✅ Wins (rupee cost averaging)</td><td>✅ Wins (delayed exposure)</td></tr>
            <tr><td><strong>At constant return</strong></td><td>Always higher</td><td>Always lower</td><td>Between both</td></tr>
            <tr><td><strong>Risk level</strong></td><td>High (timing risk)</td><td>Low (averaged out)</td><td>Moderate</td></tr>
            <tr><td><strong>Best for</strong></td><td>Windfall, bonus, inheritance</td><td>Regular salary income</td><td>Large sum near market highs</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Practical Advice:</strong> If you have a large sum to invest and markets are near all-time highs, use <strong>STP (Systematic Transfer Plan)</strong> — park the money in a liquid mutual fund (earning 5–7%) and set up automatic monthly transfers to your equity fund over 3–6 months. This gives you the safety of SIP with the growth potential of lump sum. Use our <a href="/in/lumpsum-calculator">Lumpsum Calculator</a> to model the STP strategy.
    </div>

    <h2 id="sebi-categories">SEBI Mutual Fund Categories — Expected Returns 2026</h2>
    <p>SEBI has standardised mutual fund categories to make comparison easier. Here are the broad categories with historical return ranges:</p>
    <table>
        <thead><tr><th>Category</th><th>Equity Exposure</th><th>Risk</th><th>Expected Return (10yr CAGR)</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>Large Cap</strong></td><td>≥80% in top 100 stocks</td><td>Moderate</td><td>10–13%</td><td>Stable, long-term growth</td></tr>
            <tr><td><strong>Mid Cap</strong></td><td>≥65% in stocks ranked 101–250</td><td>Moderately High</td><td>13–17%</td><td>Higher growth, more volatility</td></tr>
            <tr><td><strong>Small Cap</strong></td><td>≥65% in stocks ranked 251+</td><td>High</td><td>15–20%</td><td>Aggressive investors, 10+ year horizon</td></tr>
            <tr><td><strong>Flexi Cap</strong></td><td>≥65% across all caps</td><td>Moderate-High</td><td>12–15%</td><td>Fund manager picks best opportunities</td></tr>
            <tr><td><strong>ELSS (Tax Saver)</strong></td><td>≥80% equity</td><td>Moderate-High</td><td>12–15%</td><td>Tax saving under Section 80C</td></tr>
            <tr><td><strong>Index Fund (Nifty 50)</strong></td><td>100% Nifty 50 stocks</td><td>Moderate</td><td>11–13%</td><td>Passive investors, lowest expense ratio</td></tr>
            <tr><td><strong>Aggressive Hybrid</strong></td><td>65–80% equity</td><td>Moderate</td><td>10–13%</td><td>Balanced growth + stability</td></tr>
            <tr><td><strong>Debt (Short Duration)</strong></td><td>0%</td><td>Low</td><td>6–8%</td><td>Capital preservation, 1–3 year horizon</td></tr>
            <tr><td><strong>Liquid Fund</strong></td><td>0%</td><td>Very Low</td><td>5–7%</td><td>Emergency fund, parking cash</td></tr>
        </tbody>
    </table>

    <h2 id="tax-guide">LTCG & STCG Tax on Mutual Funds — Complete 2026 Guide</h2>
    <p>Understanding mutual fund taxation is essential for calculating your <strong>actual, post-tax returns</strong>. Here's the complete table for FY 2026–27:</p>
    <table>
        <thead><tr><th>Fund Type</th><th>Equity Exposure</th><th>STCG (Short-Term)</th><th>LTCG (Long-Term)</th><th>LTCG Holding Period</th><th>Exemption</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity Funds</strong></td><td>≥65%</td><td>20% (held &lt;12mo)</td><td>12.5%</td><td>&gt;12 months</td><td>₹1.25L/year</td></tr>
            <tr><td><strong>Aggressive Hybrid</strong></td><td>≥65%</td><td>20% (held &lt;12mo)</td><td>12.5%</td><td>&gt;12 months</td><td>₹1.25L/year</td></tr>
            <tr><td><strong>Debt Funds</strong></td><td>&lt;35%</td><td>Slab rate</td><td>Slab rate</td><td>No LTCG benefit</td><td>None</td></tr>
            <tr><td><strong>Other Hybrid</strong></td><td>35–65%</td><td>Slab rate (&lt;24mo)</td><td>12.5%</td><td>&gt;24 months</td><td>None</td></tr>
            <tr><td><strong>Gold/International</strong></td><td>&lt;35%</td><td>Slab rate (&lt;24mo)</td><td>12.5%</td><td>&gt;24 months</td><td>None</td></tr>
            <tr><td><strong>ELSS</strong></td><td>≥80%</td><td>N/A (3yr lock-in)</td><td>12.5%</td><td>&gt;36 months</td><td>₹1.25L/year</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Tax-Saving Tip:</strong> If your total equity LTCG is under ₹1.25 lakh in a financial year, you pay <strong>zero tax</strong>. Strategy: Harvest gains annually — sell and immediately re-buy units worth up to ₹1.25L in gains to "reset" your purchase price. This is called <strong>tax-loss/gain harvesting</strong>. Over 10 years, this can save ₹2–5 lakh in taxes. Verify your savings with our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.
    </div>

    <h2 id="direct-vs-regular">Direct vs Regular Mutual Funds — Expense Ratio Impact</h2>
    <p>The choice between direct and regular plans is one of the biggest decisions affecting your long-term returns:</p>
    <table>
        <thead><tr><th>Feature</th><th>Direct Plan</th><th>Regular Plan</th></tr></thead>
        <tbody>
            <tr><td><strong>TER (Expense Ratio)</strong></td><td>0.3%–1.0% (lower)</td><td>1.0%–2.0% (higher, includes commission)</td></tr>
            <tr><td><strong>NAV</strong></td><td>Higher (less deducted)</td><td>Lower (commission deducted daily)</td></tr>
            <tr><td><strong>Returns (10yr)</strong></td><td>1–2% higher CAGR</td><td>1–2% lower CAGR</td></tr>
            <tr><td><strong>Advice</strong></td><td>No personalised advice (DIY)</td><td>Distributor may provide guidance</td></tr>
            <tr><td><strong>Where to buy</strong></td><td>AMC website, Groww, Zerodha Coin, Kuvera</td><td>Banks, brokers, IFAs</td></tr>
        </tbody>
    </table>

    <h3>₹10,000/month SIP — Direct vs Regular Over 20 Years</h3>
    <table>
        <thead><tr><th>Plan Type</th><th>Assumed Return</th><th>Total Invested</th><th>Maturity Value</th><th>Difference</th></tr></thead>
        <tbody>
            <tr><td><strong>Direct Plan</strong></td><td>12% CAGR</td><td>₹24,00,000</td><td><strong>₹99,91,479</strong></td><td>—</td></tr>
            <tr><td><strong>Regular Plan</strong></td><td>11% CAGR (after 1% TER diff)</td><td>₹24,00,000</td><td>₹87,56,869</td><td><strong>₹12,34,610 less</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Bottom Line:</strong> That 1% expense ratio difference costs you <strong>₹12.35 lakh</strong> over 20 years on just ₹10,000/month SIP. On larger portfolios (₹50,000/month), the loss exceeds <strong>₹60 lakh</strong>. Always choose Direct plans unless you genuinely need and value distributor advice.
    </div>

    <h2 id="exit-load">Exit Load Rules — When You Pay & How to Avoid It</h2>
    <table>
        <thead><tr><th>Fund Type</th><th>Exit Load</th><th>Applicable Period</th><th>How to Avoid</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity Funds</strong></td><td>1%</td><td>Redeemed within 1 year</td><td>Hold for &gt;12 months</td></tr>
            <tr><td><strong>ELSS</strong></td><td>Nil</td><td>3-year mandatory lock-in</td><td>No exit load after lock-in</td></tr>
            <tr><td><strong>Liquid Fund</strong></td><td>0.0045–0.007%</td><td>Redeemed within 1–6 days</td><td>Hold for &gt;7 days</td></tr>
            <tr><td><strong>Overnight Fund</strong></td><td>Nil</td><td>No lock-in</td><td>Always zero</td></tr>
            <tr><td><strong>Index Fund</strong></td><td>0–0.25%</td><td>Varies by fund</td><td>Check scheme document</td></tr>
            <tr><td><strong>Debt Fund</strong></td><td>0–1%</td><td>Varies (typically 30–90 days)</td><td>Hold beyond exit load period</td></tr>
        </tbody>
    </table>

    <h2 id="historical-returns">Historical Mutual Fund Returns — India Benchmarks</h2>
    <p>Here are the long-term benchmark returns that we recommend using for financial planning:</p>
    <table>
        <thead><tr><th>Index / Category</th><th>5-Year CAGR</th><th>10-Year CAGR</th><th>20-Year CAGR</th></tr></thead>
        <tbody>
            <tr><td><strong>Nifty 50</strong></td><td>14–16%</td><td>11–13%</td><td>12–13%</td></tr>
            <tr><td><strong>Nifty Midcap 150</strong></td><td>18–22%</td><td>14–17%</td><td>15–16%</td></tr>
            <tr><td><strong>Nifty Smallcap 250</strong></td><td>16–24%</td><td>13–18%</td><td>14–16%</td></tr>
            <tr><td><strong>Nifty 500 (Broad Market)</strong></td><td>15–18%</td><td>12–14%</td><td>13–14%</td></tr>
            <tr><td><strong>CRISIL Short Term Bond Index</strong></td><td>6–8%</td><td>7–8%</td><td>7–8%</td></tr>
            <tr><td><strong>Bank FD (Average)</strong></td><td>5.5–6.5%</td><td>6–7%</td><td>7–8%</td></tr>
            <tr><td><strong>CPI Inflation</strong></td><td>5–6%</td><td>5–6%</td><td>6–7%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Planning Rule:</strong> For conservative retirement planning, use <strong>10–12% for equity</strong> and <strong>6–7% for debt</strong>. The Nifty 50 has delivered ~12% CAGR over 20 years, but there have been 3-year periods with negative returns (2008–2011). Always plan for 7+ year equity horizons. Compare with our <a href="/in/fd-calculator">FD Calculator</a> to see the opportunity cost of parking money in bank deposits.
    </div>

    <h2 id="inflation-adjusted">Inflation-Adjusted Returns — Real vs Nominal</h2>
    <p>The number on your mutual fund statement is the <strong>nominal return</strong>. The <strong>real return</strong> is what you can actually buy with that money after accounting for inflation.</p>
    <table>
        <thead><tr><th>Investment</th><th>Nominal Return</th><th>Inflation (6%)</th><th>Real Return</th><th>₹10L After 10 Years</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity MF (12%)</strong></td><td>12%</td><td>6%</td><td>~5.7%</td><td>₹31L nominal → ₹17.3L real</td></tr>
            <tr><td><strong>Balanced MF (10%)</strong></td><td>10%</td><td>6%</td><td>~3.8%</td><td>₹25.9L nominal → ₹14.5L real</td></tr>
            <tr><td><strong>Debt MF (7%)</strong></td><td>7%</td><td>6%</td><td>~0.9%</td><td>₹19.7L nominal → ₹11.0L real</td></tr>
            <tr><td><strong>Bank FD (6.5%)</strong></td><td>6.5%</td><td>6%</td><td>~0.5%</td><td>₹18.8L nominal → ₹10.5L real</td></tr>
        </tbody>
    </table>
    <p><strong>Key insight:</strong> A bank FD at 6.5% with 6% inflation gives you just <strong>0.5% real return</strong> — barely keeping up with inflation. After 30% tax on interest, you're actually <strong>losing purchasing power</strong>. This is why equity mutual funds, despite their volatility, are essential for long-term wealth building. Visualise this with our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a>.</p>

    <h2 id="nav-aum-ter">NAV, AUM & Expense Ratio — Key Terms Explained</h2>
    <table>
        <thead><tr><th>Term</th><th>Meaning</th><th>Impact on You</th></tr></thead>
        <tbody>
            <tr><td><strong>NAV (Net Asset Value)</strong></td><td>Per-unit market value = (Total Assets − Liabilities) / Units Outstanding</td><td>Your units × NAV = Your investment value. A higher NAV doesn't mean a fund is "expensive" — returns are in %</td></tr>
            <tr><td><strong>AUM (Assets Under Management)</strong></td><td>Total money managed by the fund (all investors combined)</td><td>High AUM = popular, liquid fund. But very high AUM in small/mid cap can limit performance</td></tr>
            <tr><td><strong>TER (Total Expense Ratio)</strong></td><td>Annual fee for managing the fund — deducted daily from NAV</td><td>Lower TER = higher returns for you. 1% TER difference = ₹12L+ loss over 20 years</td></tr>
            <tr><td><strong>BER (Base Expense Ratio)</strong></td><td>New SEBI 2026 metric — core management fee, excludes brokerage/statutory costs</td><td>Better transparency — compare BER across funds for fair apple-to-apple comparison</td></tr>
        </tbody>
    </table>

    <h2 id="sip-benchmark">₹10,000/month SIP Returns — India Benchmark Table</h2>
    <p>How much will a ₹10,000/month SIP grow over different time horizons and return scenarios?</p>
    <table>
        <thead><tr><th>Duration</th><th>Total Invested</th><th>At 8% (Debt/Hybrid)</th><th>At 10% (Balanced)</th><th>At 12% (Equity)</th><th>At 14% (Mid/Small Cap)</th></tr></thead>
        <tbody>
            <tr><td><strong>5 Years</strong></td><td>₹6,00,000</td><td>₹7,33,329</td><td>₹7,74,397</td><td>₹8,16,697</td><td>₹8,60,309</td></tr>
            <tr><td><strong>10 Years</strong></td><td>₹12,00,000</td><td>₹18,29,460</td><td>₹20,48,450</td><td>₹23,00,390</td><td>₹25,90,236</td></tr>
            <tr><td><strong>15 Years</strong></td><td>₹18,00,000</td><td>₹34,60,399</td><td>₹41,44,788</td><td>₹49,95,741</td><td>₹60,57,221</td></tr>
            <tr><td><strong>20 Years</strong></td><td>₹24,00,000</td><td>₹58,90,204</td><td>₹76,56,969</td><td>₹99,91,479</td><td>₹1,31,31,351</td></tr>
            <tr><td><strong>25 Years</strong></td><td>₹30,00,000</td><td>₹95,10,264</td><td>₹1,33,78,912</td><td>₹1,89,76,354</td><td>₹2,71,67,543</td></tr>
            <tr><td><strong>30 Years</strong></td><td>₹36,00,000</td><td>₹1,49,03,580</td><td>₹2,27,93,253</td><td>₹3,52,99,138</td><td>₹5,53,08,457</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Compounding Magic:</strong> A ₹10,000/month SIP at 12% for 30 years turns ₹36 lakh invested into <strong>₹3.53 Crore</strong> — a 9.8× multiplication! But starting just 5 years late (25 years instead of 30) gives only ₹1.90 Cr — <strong>₹1.63 Crore less</strong>. Every year of delay costs crores. Start your SIP today — use our <a href="/in/sip-calculator">SIP Calculator</a> to plan.
    </div>

    <h2 id="elss-guide">Tax-Saving Mutual Funds (ELSS) Under Section 80C</h2>
    <p><strong>ELSS (Equity Linked Savings Scheme)</strong> is the only mutual fund category that offers tax deduction under Section 80C of the Income Tax Act. Key features:</p>
    <table>
        <thead><tr><th>Feature</th><th>ELSS Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Tax Deduction</strong></td><td>Up to ₹1.5 lakh/year under Section 80C (Old Tax Regime only)</td></tr>
            <tr><td><strong>Lock-in Period</strong></td><td>3 years (shortest among all 80C instruments)</td></tr>
            <tr><td><strong>Exit Load</strong></td><td>Nil after lock-in</td></tr>
            <tr><td><strong>Tax on Returns</strong></td><td>LTCG 12.5% on gains above ₹1.25L</td></tr>
            <tr><td><strong>Expected Returns</strong></td><td>12–15% CAGR (10-year historical)</td></tr>
            <tr><td><strong>Tax Saving</strong></td><td>₹1.5L × 31.2% (30% bracket + cess) = ₹46,800/year</td></tr>
        </tbody>
    </table>
    <p>Compare with other 80C instruments: PPF (7.1%, 15-year lock-in), Tax-Saver FD (6.5–7%, 5-year lock-in), NSC (7.7%, 5-year), ULIP (market-linked, 5-year). ELSS offers the <strong>highest potential returns</strong> with the <strong>shortest lock-in</strong>. Use our <a href="/in/ppf-calculator">PPF Calculator</a> for PPF comparison and <a href="/in/income-tax-calculator">Income Tax Calculator</a> to maximise your 80C deductions.</p>

    <h2 id="common-mistakes">7 Common Mistakes in Estimating Mutual Fund Returns</h2>
    <ol>
        <li><strong>Using CAGR for SIP returns:</strong> CAGR assumes a single lump sum investment. For SIP, use XIRR — it accounts for the different investment dates of each installment. Use our <a href="/in/xirr-calculator">XIRR Calculator</a>.</li>
        <li><strong>Ignoring inflation:</strong> A 12% return with 6% inflation gives only ~5.7% real return. Always check the inflation-adjusted value — toggle it in our calculator.</li>
        <li><strong>Forgetting taxes:</strong> LTCG of 12.5% on equity gains above ₹1.25L and 20% STCG erode returns significantly. Our Tax Impact mode shows exact post-tax returns.</li>
        <li><strong>Comparing NAV instead of returns:</strong> A fund with NAV ₹500 isn't "expensive" — if it gave 15% CAGR, it's better than a fund with NAV ₹10 that gave 8%. Always compare percentage returns.</li>
        <li><strong>Ignoring expense ratio difference:</strong> A 1% TER gap between direct and regular plans costs ₹12+ lakh over 20 years on just ₹10K/month SIP. Always go direct.</li>
        <li><strong>Not accounting for exit load:</strong> Selling equity fund within 1 year costs 1% exit load on the entire redemption value — not just gains. Plan your holding period.</li>
        <li><strong>Assuming past returns will repeat:</strong> A fund that gave 25% last year won't necessarily repeat. Use 10+ year CAGR and rolling returns for realistic expectations. Historical Nifty 50 CAGR is ~12%.</li>
    </ol>

    <h2 id="excel-formulas">Excel Formulas for Mutual Fund Returns</h2>

    <h3>1. CAGR (Lump Sum Return)</h3>
    <div class="explanation__highlight">
        <code>=((End_Value/Start_Value)^(1/Years))-1</code><br>
        Example: <code>=((950000/500000)^(1/5))-1</code> → 13.7%
    </div>

    <h3>2. XIRR (SIP Return)</h3>
    <div class="explanation__highlight">
        <code>=XIRR(B2:B14, A2:A14)</code><br>
        Column A: Dates (each SIP date + redemption date). Column B: Cash flows (−10000 for each SIP, +final value for redemption). Returns the annualised return.
    </div>

    <h3>3. Future Value of SIP</h3>
    <div class="explanation__highlight">
        <code>=FV(12%/12, 10*12, -10000, 0, 1)</code><br>
        ₹10,000/month SIP at 12% for 10 years → ₹23,00,390
    </div>

    <h3>4. Post-Tax Return (Equity LTCG)</h3>
    <div class="explanation__highlight">
        <code>=Gross_Return - MAX((Gross_Return - Invested - 125000), 0) * 0.125 * 1.04</code><br>
        Calculates net value after 12.5% LTCG + 4% cess with ₹1.25L exemption.
    </div>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Calculate monthly SIP returns with step-up and target-based planning.</li>
        <li><strong><a href="/in/lumpsum-calculator">Lumpsum Calculator</a></strong> — One-time investment returns with Lump Sum vs SIP and STP strategy comparison.</li>
        <li><strong><a href="/in/swp-calculator">SWP Calculator</a></strong> — Systematic Withdrawal Plan for regular income from your MF corpus.</li>
        <li><strong><a href="/in/xirr-calculator">XIRR Calculator</a></strong> — Accurate annualised returns for irregular cash flows and SIP investments.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Compare mutual fund returns with bank FD rates and SCSS (8.2%).</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Tax-free 7.1% returns — MF vs PPF comparison for Section 80C planning.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Old vs New Regime comparison to maximise ELSS + 80C deductions.</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> — Visualise the power of compounding behind mutual fund growth.</li>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></strong> — How much MF corpus you need for retirement in India.</li>
        <li><strong><a href="/in/fire-calculator">FIRE Calculator</a></strong> — Early retirement planning through aggressive MF SIP investing.</li>
        <li><strong><a href="/in/crorepati-calculator">Crorepati Calculator</a></strong> — When will your MF SIP make you a crorepati?</li>
        <li><strong><a href="/in/nps-calculator">NPS Calculator</a></strong> — NPS + MF combined retirement strategy with 80CCD(1B) benefit.</li>
        <li><strong><a href="/in/education-loan-calculator">Education Loan Calculator</a></strong> — Fund education via MF SIP or education loan? Compare both options.</li>
    </ul>
`;

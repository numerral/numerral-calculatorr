import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import SIPCalculatorIndiaCore from "@/components/calculator/SIPCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "SIP Calculator India 2026 — Step-up SIP, Returns & Mutual Fund Tax Guide",
    description: "Free SIP calculator for India. Calculate mutual fund SIP returns with step-up, lumpsum, goal planning & inflation-adjusted modes. Includes 2026 LTCG/STCG tax rates, SEBI categories, ELSS tax saving guide, Direct vs Regular comparison, and SIP vs PPF vs FD.",
    keywords: ["SIP calculator India", "SIP calculator", "mutual fund SIP", "step-up SIP calculator", "SIP returns calculator", "ELSS tax saving", "SIP vs lumpsum", "mutual fund tax India 2026", "LTCG STCG mutual fund", "SIP goal calculator"],
    alternates: buildCountryAlternates("IN", "/in/sip-calculator", "sip-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is SIP in mutual funds?", answer: "SIP (Systematic Investment Plan) is a method of investing a fixed amount at regular intervals (weekly, monthly, or quarterly) into a mutual fund scheme. In India, the minimum SIP starts at ₹500/month. As of 2026, over 10 crore SIP accounts are active (AMFI data). SIP works through rupee-cost averaging — you buy more units when markets are low and fewer when markets are high, reducing the impact of market volatility on your portfolio." },
    { question: "What is the SIP calculator formula?", answer: "FV = P × [((1 + r)^n − 1) / r] × (1 + r), where: FV = Future value (maturity amount), P = Monthly SIP amount, r = Expected monthly return rate (annual rate ÷ 12), n = Total number of months. For example: ₹10,000/month SIP at 12% for 15 years → FV = ₹50.46 lakh. This formula assumes a constant rate of return, which is a simplification — actual mutual fund returns vary." },
    { question: "What is Step-up SIP and how much difference does it make?", answer: "Step-up SIP (also called Top-up SIP) means increasing your monthly SIP by a fixed percentage each year. Example: ₹10,000 SIP with 10% annual step-up → Year 1: ₹10,000/mo, Year 2: ₹11,000/mo, Year 3: ₹12,100/mo. At 12% returns for 15 years: Fixed SIP = ₹50.46 lakh vs Step-up SIP = ₹95.39 lakh — that's 89% more wealth from the same starting amount! Step-up aligns your investments with salary increments." },
    { question: "What is the tax on SIP returns in India 2026?", answer: "Mutual fund SIP taxation (post Budget 2024): Equity funds: STCG (≤12 months) = 20%, LTCG (>12 months) = 12.5% on gains above ₹1.25 lakh/year. Debt funds: All gains taxed at income slab rate (no LTCG benefit). ELSS: After 3-year lock-in, same as equity LTCG. Each SIP installment is treated as a separate purchase. Units are sold on FIFO (First-In-First-Out) basis, so the oldest units are redeemed first." },
    { question: "What is XIRR vs CAGR? Which should I use for SIP?", answer: "CAGR (Compound Annual Growth Rate) works for lump sum investments — one entry, one exit. XIRR (Extended Internal Rate of Return) is the correct metric for SIP returns because each monthly installment has a different entry date and holding period. XIRR accounts for the timing of all cash flows and gives a more accurate annualized return. Most mutual fund apps in India (Groww, Zerodha, ET Money) show XIRR for SIP portfolios." },
    { question: "What is the difference between Direct and Regular mutual fund plans?", answer: "Direct plans have lower expense ratios because they don't include distributor commissions. Regular plans are bought through intermediaries who earn a commission (0.5%–1.5% of AUM annually). Impact: Over 20 years, a 0.5% difference in expense ratio on a ₹10,000 SIP at 12% returns means losing ~₹8–10 lakh. Both invest in the same stocks/bonds with the same fund manager. Always prefer Direct plans — invest via Groww, Zerodha Coin, or the AMC's website directly." },
    { question: "What is ELSS and how does it save tax?", answer: "ELSS (Equity Linked Savings Scheme) is a tax-saving mutual fund under Section 80C. Benefits: Deduction up to ₹1.5 lakh from taxable income (old regime only). Shortest lock-in among 80C options — just 3 years (vs PPF 15 years, FD 5 years). Market-linked returns: historically 12–18% over 10+ years. After 3-year lock-in, gains are taxed as equity LTCG (12.5% above ₹1.25 lakh). ELSS is widely considered the best tax-saving instrument for growth-oriented investors." },
    { question: "How much should I invest in SIP per month?", answer: "A common rule of thumb: Invest 20–30% of your take-home salary in SIPs. The ideal split depends on your goals: Emergency fund first (6 months of expenses), then allocate SIPs: 40–50% in Flexi Cap/Large Cap for stability, 20–30% in Mid Cap for growth, 10–20% in Small Cap for aggressive growth, and ELSS if you need Section 80C benefit. Start with any amount (even ₹500) — the key is consistency and increasing your SIP annually with salary hikes." },
    { question: "Is SIP better than PPF for long-term investment?", answer: "It depends on risk tolerance: SIP (Equity MF): 12–15% historical returns, market-linked risk, no lock-in (except ELSS). PPF: 7.1% guaranteed, zero risk, 15-year lock-in, EEE tax status. For a 30% tax bracket investor, PPF's effective pre-tax return is ~10.1%, while equity SIP gives 12–15% (after LTCG tax ~10.5–13%). Over 20+ years, equity SIPs create significantly more wealth. Many advisors recommend both: PPF for safe base + equity SIP for growth." },
    { question: "What happens if I miss a SIP payment?", answer: "Missing 1-2 SIP payments usually has no penalty — the bank simply doesn't debit for that month. If you miss 3 consecutive SIP payments, the SIP mandate is automatically cancelled by most AMCs. Your existing invested units remain untouched and continue to grow. You can restart or start a new SIP at any time. Important: ELSS SIP has a 3-year lock-in per installment — each monthly payment's 3-year lock-in is separate." },
    { question: "What is a good expected return rate for SIP calculations?", answer: "Historical average returns by SEBI category: Large Cap: 11–14% (10yr), Mid Cap: 15–20% (10yr), Small Cap: 16–22% (10yr), Flexi Cap: 13–17% (10yr), ELSS: 13–17% (10yr), Debt funds: 7–9% (10yr). For realistic planning, use 12% for equity (conservative) or 10% for after-inflation estimates. Past performance doesn't guarantee future returns — but India's long-term equity markets have rewarded patient investors." },
    { question: "Can I withdraw SIP money anytime?", answer: "Yes — open-ended equity and debt mutual fund units can be redeemed at any time (T+2 or T+3 settlement). Exceptions: ELSS has a mandatory 3-year lock-in per installment. You can withdraw via: Full redemption (sell all units), Partial redemption (sell specific amount), or SWP (Systematic Withdrawal Plan — set up regular monthly withdrawals, ideal for retirement income). Stopping SIP doesn't mean withdrawal — your invested units remain and continue to grow." },
    { question: "How does inflation affect my SIP corpus?", answer: "At 6% average inflation, ₹1 crore in 20 years will have the purchasing power of only ~₹31 lakh in today's money. This is why equity SIPs (12–15% returns) are essential — they give a real return of 6–9% above inflation. FDs (6.5–7.5%) barely beat inflation, giving real returns of ~0.5–1.5%. PPF (7.1%) gives ~1% real return. Gold (8–9%) gives ~2–3% real return. Equity mutual funds are the most reliable inflation-beating instrument for Indian investors." },
    { question: "What are SEBI mutual fund categories?", answer: "SEBI mandates 5 broad categories: (1) Equity: Large Cap (top 100 stocks), Mid Cap (101–250), Small Cap (251+), Flexi Cap, Multi Cap, Focused, Sectoral, ELSS. (2) Debt: Liquid, Ultra Short, Short Duration, Corporate Bond, Gilt. (3) Hybrid: Aggressive Hybrid (65–80% equity), Conservative Hybrid, Balanced Advantage. (4) Solution-Oriented: Being phased out in 2026; replaced by Life Cycle Funds. (5) Other: Index Funds, ETFs, Fund of Funds. Each AMC can have only one scheme per category." },
    { question: "How is lump sum different from SIP?", answer: "Lump sum: One-time large investment. Works best when markets are low (timing advantage). Higher risk if invested at market peak. Use CAGR to measure returns. SIP: Regular small investments. Leverages rupee-cost averaging. No need to time the market. Use XIRR to measure returns. Research shows: In a rising market, lump sum beats SIP. In volatile/falling markets, SIP wins. For most retail investors, SIP is recommended because timing the market is extremely difficult." },
];

export default function SIPCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "SIP Calculator" },
        ]),
        webAppSchema("SIP Calculator India 2026", canonicalUrl("/in/sip-calculator")),
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
            <Script id="schema-sip" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "SIP Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>SIP Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate mutual fund SIP returns with step-up comparison, lumpsum projections, goal-based planning, and inflation-adjusted real value. Includes complete 2026 LTCG/STCG tax guide, SEBI fund categories, ELSS tax saving, and Direct vs Regular plan analysis.
            </p>
            <AuthorBadge categoryKey="salary" />
            <SIPCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="SIP Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/ppf-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📊</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">PPF Calculator</div>
                            <div className="in-related-link__desc">Compare PPF vs SIP returns</div>
                        </div>
                    </Link>
                    <Link href="/in/home-loan-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏠</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Home Loan EMI Calculator</div>
                            <div className="in-related-link__desc">Plan SIP alongside EMI</div>
                        </div>
                    </Link>
                    <Link href="/in/bmi-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏋️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">BMI Calculator</div>
                            <div className="in-related-link__desc">Health & wellness tools</div>
                        </div>
                    </Link>
                    <Link href="/in/age-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🎂</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Age Calculator</div>
                            <div className="in-related-link__desc">Retirement age & milestones</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-sip">What Is SIP (Systematic Investment Plan)?</h2>
    <p>A <strong>Systematic Investment Plan (SIP)</strong> is a disciplined method of investing a fixed amount at regular intervals (typically monthly) into a mutual fund scheme. SIP leverages the power of <strong>rupee-cost averaging</strong> and <strong>compounding</strong> to build wealth over time.</p>
    <p>Key facts about SIPs in India:</p>
    <ul>
        <li><strong>10+ crore</strong> active SIP accounts in India (AMFI, 2026)</li>
        <li><strong>₹500</strong> minimum SIP amount at most fund houses</li>
        <li><strong>Monthly contributions</strong> exceed ₹25,000 crore (industry aggregate, 2026)</li>
        <li>Available for all SEBI categories — equity, debt, hybrid, ELSS</li>
    </ul>

    <h2 id="sip-formula">SIP Calculator Formula</h2>
    <div class="explanation__highlight">
        <strong>FV = P × [((1 + r)<sup>n</sup> − 1) / r] × (1 + r)</strong>
    </div>
    <p>Where:</p>
    <ul>
        <li><strong>FV</strong> — Future Value (maturity amount)</li>
        <li><strong>P</strong> — Monthly SIP amount</li>
        <li><strong>r</strong> — Monthly return rate (annual rate ÷ 12)</li>
        <li><strong>n</strong> — Total number of months (years × 12)</li>
    </ul>

    <h2 id="worked-example">Worked Example — ₹10,000 SIP at 12% for 15 Years</h2>
    <table>
        <thead><tr><th>Parameter</th><th>Fixed SIP</th><th>Step-up SIP (+10%/yr)</th></tr></thead>
        <tbody>
            <tr><td><strong>Monthly SIP (start)</strong></td><td>₹10,000</td><td>₹10,000 → ₹41,772 (yr 15)</td></tr>
            <tr><td><strong>Total Invested</strong></td><td>₹18,00,000</td><td>₹38,12,759</td></tr>
            <tr><td><strong>Wealth Gained</strong></td><td>₹32,45,760</td><td>₹57,26,456</td></tr>
            <tr><td><strong>Maturity Value</strong></td><td><strong>₹50,45,760</strong></td><td><strong>₹95,39,215</strong></td></tr>
            <tr><td><strong>Growth</strong></td><td>2.8x invested</td><td>2.5x invested</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> A 10% annual step-up nearly <strong>doubles your maturity</strong> (₹50.46L → ₹95.39L) because each year's increase compounds for the remaining years.
    </div>

    <h2 id="step-up-sip">Step-up SIP — The Wealth Turbocharger</h2>
    <p>Step-up SIP means increasing your SIP amount by a fixed percentage each year. Most working professionals get 8–15% annual salary increments — allocating even half to step-up SIP creates dramatically more wealth.</p>
    <table>
        <thead><tr><th>Starting SIP</th><th>Step-up</th><th>15yr Maturity (12%)</th><th>Extra vs Fixed</th></tr></thead>
        <tbody>
            <tr><td>₹5,000/mo</td><td>0%</td><td>₹25.23L</td><td>—</td></tr>
            <tr><td>₹5,000/mo</td><td>5%</td><td>₹35.42L</td><td>+₹10.19L (+40%)</td></tr>
            <tr><td>₹5,000/mo</td><td>10%</td><td>₹47.70L</td><td>+₹22.47L (+89%)</td></tr>
            <tr><td>₹5,000/mo</td><td>15%</td><td>₹63.85L</td><td>+₹38.62L (+153%)</td></tr>
        </tbody>
    </table>

    <h2 id="sip-vs-lumpsum">SIP vs Lumpsum — Which Is Better?</h2>
    <table>
        <thead><tr><th>Factor</th><th>SIP</th><th>Lumpsum</th></tr></thead>
        <tbody>
            <tr><td><strong>Investment style</strong></td><td>Regular, small amounts</td><td>One-time, large amount</td></tr>
            <tr><td><strong>Market timing</strong></td><td>Not needed (rupee-cost averaging)</td><td>Crucial — poor timing = poor returns</td></tr>
            <tr><td><strong>Risk</strong></td><td>Lower (spread over time)</td><td>Higher (concentrated)</td></tr>
            <tr><td><strong>Best in</strong></td><td>Volatile/falling markets</td><td>Rising markets</td></tr>
            <tr><td><strong>Performance metric</strong></td><td>XIRR</td><td>CAGR</td></tr>
            <tr><td><strong>Ideal for</strong></td><td>Salaried investors</td><td>Windfall/bonus money</td></tr>
        </tbody>
    </table>

    <h2 id="mutual-fund-taxation">Mutual Fund Taxation — India 2026 (Post Budget 2024)</h2>
    <p>This is the <strong>most important section</strong> for Indian SIP investors. Budget 2024 revised capital gains tax rates significantly:</p>
    <table>
        <thead><tr><th>Fund Type</th><th>STCG Period</th><th>STCG Rate</th><th>LTCG Period</th><th>LTCG Rate</th><th>Exemption</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity (≥65% equity)</strong></td><td>≤ 12 months</td><td>20%</td><td>&gt; 12 months</td><td>12.5%</td><td>₹1.25L/FY</td></tr>
            <tr><td><strong>Debt (&lt;35% equity)</strong></td><td>Any</td><td>Slab rate</td><td>—</td><td>—</td><td>None</td></tr>
            <tr><td><strong>Hybrid (35–65%)</strong></td><td>≤ 24 months</td><td>Slab rate</td><td>&gt; 24 months</td><td>12.5%</td><td>₹1.25L/FY</td></tr>
            <tr><td><strong>ELSS</strong></td><td>3yr lock-in</td><td>N/A</td><td>&gt; 3 years</td><td>12.5%</td><td>₹1.25L/FY</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>SIP-specific tax rule:</strong> Each SIP installment is treated as a <strong>separate purchase</strong>. When you redeem, units are sold on <strong>FIFO (First-In-First-Out)</strong> basis. This means a single redemption can trigger both STCG and LTCG depending on when each installment was made.
    </div>

    <h2 id="sebi-categories">SEBI Mutual Fund Categories & Expected Returns</h2>
    <table>
        <thead><tr><th>Category</th><th>5-Year Return</th><th>10-Year Return</th><th>Risk Level</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>Large Cap</strong></td><td>10–14%</td><td>11–14%</td><td>Moderate</td><td>Beginners, core portfolio</td></tr>
            <tr><td><strong>Mid Cap</strong></td><td>14–20%</td><td>15–20%</td><td>High</td><td>5+ year horizon, growth</td></tr>
            <tr><td><strong>Small Cap</strong></td><td>16–25%</td><td>16–22%</td><td>Very High</td><td>7+ year horizon, aggressive</td></tr>
            <tr><td><strong>Flexi Cap</strong></td><td>12–18%</td><td>13–17%</td><td>Moderate-High</td><td>Diversified single fund</td></tr>
            <tr><td><strong>ELSS</strong></td><td>12–18%</td><td>13–17%</td><td>Moderate-High</td><td>Tax saving under 80C</td></tr>
            <tr><td><strong>Balanced Advantage</strong></td><td>9–13%</td><td>10–13%</td><td>Moderate</td><td>Low volatility preference</td></tr>
            <tr><td><strong>Debt (Short Duration)</strong></td><td>6–8%</td><td>7–9%</td><td>Low</td><td>1–3 year goals</td></tr>
        </tbody>
    </table>

    <h2 id="elss-tax-saving">ELSS — Tax-Saving SIP (Section 80C)</h2>
    <table>
        <thead><tr><th>Feature</th><th>ELSS</th><th>PPF</th><th>Tax-Saving FD</th><th>NPS</th></tr></thead>
        <tbody>
            <tr><td><strong>80C Limit</strong></td><td>₹1.5L</td><td>₹1.5L</td><td>₹1.5L</td><td>₹1.5L + ₹50K extra</td></tr>
            <tr><td><strong>Lock-in</strong></td><td><strong>3 years</strong></td><td>15 years</td><td>5 years</td><td>Till age 60</td></tr>
            <tr><td><strong>Returns</strong></td><td>12–18% (market)</td><td>7.1% (fixed)</td><td>6.5–7.5%</td><td>8–14% (market)</td></tr>
            <tr><td><strong>Risk</strong></td><td>High</td><td>Zero</td><td>Zero</td><td>Low-Medium</td></tr>
            <tr><td><strong>Tax on Gains</strong></td><td>LTCG 12.5%</td><td>EEE (Exempt)</td><td>Fully taxable</td><td>60% exempt</td></tr>
        </tbody>
    </table>

    <h2 id="direct-vs-regular">Direct vs Regular Plans — Expense Ratio Impact</h2>
    <table>
        <thead><tr><th>Feature</th><th>Direct Plan</th><th>Regular Plan</th></tr></thead>
        <tbody>
            <tr><td><strong>Expense Ratio</strong></td><td>0.3–1.0%</td><td>0.8–2.5%</td></tr>
            <tr><td><strong>Commission</strong></td><td>None</td><td>0.5–1.5% to distributor</td></tr>
            <tr><td><strong>NAV</strong></td><td>Higher (lower costs)</td><td>Lower (costs deducted)</td></tr>
            <tr><td><strong>Where to buy</strong></td><td>Groww, Zerodha, AMC website</td><td>Banks, MF distributors</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Impact over 20 years:</strong> ₹10,000 SIP in a fund giving 12% (Direct, 0.5% expense) vs 11.5% (Regular, 1.0% expense): Direct = ₹99.9L vs Regular = ₹92.7L. The 0.5% difference costs you <strong>₹7.2 lakh</strong> over 20 years.
    </div>

    <h2 id="xirr-vs-cagr">XIRR vs CAGR — When to Use Each</h2>
    <table>
        <thead><tr><th>Metric</th><th>XIRR</th><th>CAGR</th></tr></thead>
        <tbody>
            <tr><td><strong>Full form</strong></td><td>Extended Internal Rate of Return</td><td>Compound Annual Growth Rate</td></tr>
            <tr><td><strong>Best for</strong></td><td>SIP / multiple cash flows</td><td>Lump sum / single investment</td></tr>
            <tr><td><strong>Accounts for</strong></td><td>Timing of each cash flow</td><td>Start and end value only</td></tr>
            <tr><td><strong>More accurate for SIP?</strong></td><td><strong>Yes</strong></td><td>No (overstates/understates)</td></tr>
        </tbody>
    </table>

    <h2 id="sip-vs-ppf-vs-fd">SIP vs PPF vs FD — India Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>SIP (Equity MF)</th><th>PPF</th><th>FD (5yr tax-saver)</th></tr></thead>
        <tbody>
            <tr><td><strong>Expected Returns</strong></td><td>12–15% (market)</td><td>7.1% (fixed)</td><td>6.5–7.5% (fixed)</td></tr>
            <tr><td><strong>Risk</strong></td><td>High (market-linked)</td><td>Zero (govt. backed)</td><td>Zero</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>None (ELSS: 3yr)</td><td>15 years</td><td>5 years</td></tr>
            <tr><td><strong>Tax Benefit</strong></td><td>80C (ELSS only)</td><td>80C (₹1.5L)</td><td>80C (₹1.5L)</td></tr>
            <tr><td><strong>Tax on Gains</strong></td><td>LTCG 12.5% (>₹1.25L)</td><td>EEE (Exempt)</td><td>Fully taxable (slab)</td></tr>
            <tr><td><strong>Beats Inflation?</strong></td><td>✅ Yes (6–9% real)</td><td>⚠️ Barely (1%)</td><td>❌ No (0–1%)</td></tr>
            <tr><td><strong>₹10K/mo × 20yr</strong></td><td><strong>₹99.9L</strong> (Direct, 12%)</td><td>₹66.6L</td><td>₹57.3L (pre-tax)</td></tr>
        </tbody>
    </table>

    <h2 id="rupee-cost-averaging">Rupee-Cost Averaging — How SIP Reduces Risk</h2>
    <p>SIP's key advantage is <strong>rupee-cost averaging</strong>:</p>
    <ul>
        <li><strong>When markets fall:</strong> Your fixed ₹10,000 buys more units (e.g., NAV ₹50 → 200 units)</li>
        <li><strong>When markets rise:</strong> Same ₹10,000 buys fewer units (e.g., NAV ₹100 → 100 units)</li>
        <li><strong>Net effect:</strong> Your average purchase price is lower than the average market price</li>
        <li><strong>Result:</strong> You don't need to "time the market" — SIP does it automatically</li>
    </ul>

    <h2 id="sip-withdrawal">SIP Withdrawal — SWP (Systematic Withdrawal Plan)</h2>
    <ul>
        <li><strong>What:</strong> Auto-withdrawal of a fixed amount from your mutual fund at regular intervals</li>
        <li><strong>Use case:</strong> Monthly income during retirement (e.g., invest ₹1 Cr, withdraw ₹50K/month)</li>
        <li><strong>Tax:</strong> Each SWP withdrawal triggers capital gains tax (STCG or LTCG depending on holding period)</li>
        <li><strong>Advantage:</strong> Remaining corpus stays invested and continues to grow</li>
    </ul>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Compare SIP vs PPF returns over 15–20 years.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan EMI Calculator</a></strong> — Plan SIP alongside home loan EMI.</li>
        <li><strong><a href="/in/car-loan-calculator">Car Loan EMI Calculator</a></strong> — Partial SIP withdrawal for car down payment.</li>
        <li><strong><a href="/in/bmi-calculator">BMI Calculator</a></strong> — Health & wellness tools for India.</li>
    </ul>
`;

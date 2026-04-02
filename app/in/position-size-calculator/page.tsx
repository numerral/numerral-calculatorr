import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import PositionSizeCalculatorCore from "@/components/calculator/PositionSizeCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Position Size Calculator India 2026 — Calculate Shares to Buy, F&O Lots & Risk-Reward",
    description: "Free Position Size Calculator for Indian traders with 4 modes: Basic Position Sizer (% risk model), F&O Lot Calculator (NSE 2026 lot sizes for Nifty, Bank Nifty, FinNifty), Risk-Reward Analyser, and Kelly Criterion. Includes STT/GST cost breakdown, ATR-based sizing guide, and SEBI F&O regulations.",
    keywords: ["position size calculator", "position sizing India", "lot size calculator NSE", "F&O position size", "risk per trade calculator", "Kelly criterion calculator", "shares to buy calculator", "stock trading risk management", "intraday position sizing", "NSE lot size 2026", "Bank Nifty lot size", "Nifty lot size", "risk reward calculator", "STT calculator", "trading cost calculator India"],
    alternates: buildCountryAlternates("IN", "/in/position-size-calculator", "position-size-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a position size calculator?", answer: "A position size calculator is a risk management tool that determines the optimal number of shares or lots to trade based on your total capital, risk tolerance (typically 1–2% of capital), entry price, and stop-loss level. It ensures that if your trade hits its stop-loss, your maximum loss is limited to a predetermined amount — protecting your trading capital from catastrophic drawdowns. For example, with ₹5,00,000 capital and 1% risk, the calculator ensures you never lose more than ₹5,000 on a single trade, regardless of the stock price." },
    { question: "How do I calculate position size for stocks in India?", answer: "Use the standard formula: Position Size (Shares) = Risk Amount ÷ Risk per Share. Step 1: Calculate Risk Amount = Total Capital × Risk % (e.g., ₹5,00,000 × 1% = ₹5,000). Step 2: Calculate Risk per Share = Entry Price − Stop-Loss Price (e.g., ₹500 − ₹480 = ₹20). Step 3: Shares to Buy = ₹5,000 ÷ ₹20 = 250 shares. The investment amount = 250 × ₹500 = ₹1,25,000. If the trade hits your stop-loss at ₹480, your loss = 250 × ₹20 = ₹5,000, which is exactly 1% of your capital. This works for both delivery and intraday trades on NSE/BSE." },
    { question: "What is the 1% risk rule in trading?", answer: "The 1% rule states that you should never risk more than 1% of your total trading capital on any single trade. This is the most widely recommended risk management rule by professional traders and fund managers globally. At 1% risk, even a streak of 10 consecutive losing trades would only reduce your capital by about 9.6% (due to compounding), which is recoverable. At 5% risk per trade, 10 losses would wipe out 40% of your capital, requiring a 67% gain just to break even. The 1% rule ensures long-term survival. Aggressive traders may use 2%, but exceeding 2% per trade is considered irresponsible by most trading professionals." },
    { question: "How does position sizing work for F&O trading on NSE?", answer: "F&O (Futures & Options) on the NSE must be traded in fixed lot sizes set by the exchange. You cannot buy fractional lots. The position sizing formula is modified: Lots = Risk Amount ÷ (Risk per Unit × Lot Size). For example, with ₹10,00,000 capital, 1% risk (₹10,000), Nifty 50 entry at 24,000 and stop-loss at 23,800: Risk per unit = 200 points. Risk per lot = 200 × 65 (lot size) = ₹13,000. Since ₹13,000 > ₹10,000, you cannot trade even 1 lot within your risk limit. You would need to either increase capital, reduce stop-loss distance, or increase risk percentage. This is why F&O trading requires significantly higher capital than equity delivery trading." },
    { question: "What are the current NSE F&O lot sizes (2026)?", answer: "As of January 2026, the NSE revised index derivative lot sizes to align with SEBI's contract value guidelines (₹15–20 lakh per contract): Nifty 50 = 65 units, Bank Nifty = 30 units, Nifty Financial Services (FinNifty) = 60 units, Nifty Midcap Select = 120 units, Nifty Next 50 = 25 units, BSE Sensex = 20 units. Stock F&O lot sizes vary by individual security and are revised periodically by NSE based on the stock's price — the official lot size file (NSE_FO_contract_ddmmyyyy.csv.gz) is published on nseindia.com. Always check the latest NSE circular before trading." },
    { question: "What is the Kelly Criterion for position sizing?", answer: "The Kelly Criterion is a mathematical formula that calculates the optimal percentage of capital to allocate to a trade for maximum long-term growth. Formula: f* = (p × b − q) / b, where f* = fraction of capital to allocate, p = win probability, q = loss probability (1 − p), and b = win/loss ratio (average win ÷ average loss). Example: 55% win rate, average win 3%, average loss 1.5%: f* = (0.55 × 2.0 − 0.45) / 2.0 = 0.325 or 32.5%. However, full Kelly is extremely aggressive and causes massive drawdowns. Professional traders use Half Kelly (16.25%) or Quarter Kelly (8.1%) for smoother performance. Never use full Kelly on live trading capital." },
    { question: "How do trading costs (STT, GST) affect position sizing in India?", answer: "Indian trading involves multiple costs: Securities Transaction Tax (STT) — 0.1% on delivery (both sides), 0.025% intraday (sell only), 0.05% futures (sell), 0.15% options (sell premium) — effective April 2026. GST at 18% on brokerage and SEBI charges. SEBI turnover charges of ₹10 per crore. Stamp duty varies by segment (0.015% delivery, 0.003% intraday). For a ₹1 lakh intraday trade, total costs are approximately ₹70–100, which can eat 2–5% of a small risk amount (₹2,000 at 2% risk on ₹1L capital). When your trading cost exceeds 5% of your risk amount, the trade becomes cost-inefficient." },
    { question: "What is ATR-based position sizing?", answer: "ATR (Average True Range) based position sizing adjusts your trade size based on a stock's current volatility. Instead of using a fixed stop-loss distance, you set the stop-loss as a multiple of the ATR value — typically 1.5× to 2× ATR. Formula: Position Size = Risk Amount ÷ (ATR × Multiplier). For example, if a stock has a 14-period ATR of ₹25: Stop-loss = 2 × ₹25 = ₹50 away from entry. With ₹5,000 risk: Shares = ₹5,000 ÷ ₹50 = 100 shares. The advantage is that high-volatility stocks (large ATR) get smaller positions, and low-volatility stocks (small ATR) get larger positions, equalizing the risk impact across different stocks." },
    { question: "What is a risk-reward ratio and why does it matter?", answer: "The risk-reward ratio (RRR) compares the potential profit to the potential loss of a trade. A 1:2 RRR means for every ₹1 risked, you expect to make ₹2 if the trade works. Why it matters: At 1:2 RRR, you only need to win 33.3% of trades to break even. At 1:3 RRR, you need only 25%. Even a trader winning just 40% of trades can be consistently profitable with a 1:2 or better ratio. Professional traders typically refuse trades below 1:1.5 minimum. Use our Risk-Reward Analyser mode above to check any trade setup before entering." },
    { question: "How much capital do I need for F&O trading in India?", answer: "SEBI has set the minimum contract value for index derivatives at ₹15–20 lakh. With margin requirements of 12–20% for futures and varying premium costs for options, practical capital requirements are: Index Futures (Nifty/Bank Nifty): Minimum ₹2–3 lakh margin per lot + ₹2–5 lakh buffer for mark-to-market = ₹5–8 lakh recommended. Stock Futures: ₹3–10 lakh depending on the stock. Options Buying: Can start with ₹50,000–1,00,000 but with very high risk. Options Selling: Minimum ₹5–10 lakh for one lot. For proper position sizing with the 1% rule, you need at least ₹10–15 lakh to trade F&O comfortably." },
    { question: "What is the difference between position sizing and lot sizing?", answer: "Position sizing refers to calculating how many shares to buy based on your risk tolerance — it's a risk management concept that works for any tradable instrument. Lot sizing is specific to derivatives (F&O) where you must trade in exact multiples of exchange-mandated lot sizes. In equity delivery/intraday: You can buy any number of shares (position sizing). In F&O: You must buy in lots — Nifty = 65 units per lot, Bank Nifty = 30 per lot. If your position size calculation suggests 90 Nifty units, you can only trade 1 lot (65) because 2 lots (130) would exceed your risk limit. This constraint makes F&O position sizing more restrictive." },
    { question: "Should I use the same position size for every trade?", answer: "No — using the same fixed number of shares for every trade is a common mistake. Different stocks have different prices and volatilities. 100 shares of a ₹50 stock (₹5,000 exposure) is very different from 100 shares of a ₹5,000 stock (₹5,00,000 exposure). Instead, calculate position size based on the risk per share (stop-loss distance) for each trade. This means volatile stocks with wider stop-losses get fewer shares, and stable stocks with tight stop-losses get more shares — keeping your actual rupee risk consistent. This is called equal-risk position sizing." },
    { question: "How do I manage drawdowns with position sizing?", answer: "Drawdown management rules: At 10% account drawdown: Review your strategy, tighten stop-losses, and stop adding new positions. At 15–20% drawdown: Reduce position sizes by 50% — trade half your normal size until you recover to 10% drawdown. At 25%+ drawdown: Stop trading completely. Switch to paper trading and re-evaluate your strategy. The key is to reduce size during losing streaks (not increase to 'recover'), because a 50% loss requires a 100% gain just to break even. Position sizing should be anti-fragile — smaller when losing, normal when stable." },
    { question: "Is position sizing relevant for long-term investors?", answer: "Yes, position sizing applies to investors too, though the framework differs. For long-term portfolios: no single stock should exceed 5–10% of your total portfolio value. Diversify across 15–25 stocks minimum. Use the 'equal weight' approach (allocate equal amounts to each stock) or 'risk parity' (allocate based on volatility — less to volatile stocks, more to stable stocks). When adding to positions (averaging down), ensure total allocation doesn't exceed your per-stock limit. For SIP-based investing in mutual funds, use our SIP Calculator to plan systematic allocation." },
];

export default function PositionSizeCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Position Size Calculator" },
        ]),
        webAppSchema("Position Size Calculator India 2026 — Calculate Shares, F&O Lots & Risk", canonicalUrl("/in/position-size-calculator")),
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
            <Script id="schema-position-size" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Position Size Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Position Size Calculator India 2026 — Calculate Shares to Buy, F&O Lots &amp; Risk-Reward</h1>
            <PageDesc>
                Free Position Size Calculator with 4 modes — Basic Position Sizer with STT/GST cost breakdown, F&amp;O Lot Calculator (NSE 2026 lot sizes for Nifty 50, Bank Nifty, FinNifty),
                Risk-Reward Analyser with colour-coded ratio, and Kelly Criterion for optimal allocation.
                Includes SEBI regulations, ATR-based sizing guide, and loss recovery table.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <PositionSizeCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Position Size Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-position-sizing">What Is Position Sizing?</h2>
    <p><strong>Position sizing</strong> is the single most critical component of any trading strategy. It determines <strong>how many shares, lots, or contracts</strong> you should buy or sell on each trade, based on your total capital, risk tolerance, and the specific trade setup. Without proper position sizing, even the best trading strategy will fail.</p>
    <p>The core principle is simple: <strong>never risk more than a small, predetermined percentage of your total trading capital on any single trade</strong>. This ensures that no single losing trade — or even a streak of losses — can cause irreparable damage to your account.</p>
    <ul>
        <li><strong>Capital Preservation</strong> &mdash; Your primary job as a trader is to protect capital, not to make profit. Profits follow naturally when capital is preserved.</li>
        <li><strong>Consistency</strong> &mdash; Position sizing removes emotional decision-making. You calculate mechanically, not impulsively.</li>
        <li><strong>Longevity</strong> &mdash; Traders who survive long enough eventually succeed. Those who blow up their accounts in the first year never get the chance to learn.</li>
        <li><strong>Compounding</strong> &mdash; Consistent, small wins compound dramatically over time. A 2% monthly return on ₹5 lakh produces ₹6.35 lakh in just one year &mdash; without any additional capital. Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to model this.</li>
    </ul>
    <div class="explanation__highlight">
        <strong>India Context:</strong> According to SEBI data published in January 2025, approximately <strong>93% of individual F&amp;O traders in India incurred losses</strong> over a 3-year period (FY22–FY24), with an average loss of ₹2 lakh per person. The primary reason cited? Over-leveraging and poor risk management &mdash; not bad stock picks. Position sizing is the antidote.
    </div>

    <h2 id="position-size-formula">Position Size Formula &mdash; Complete Guide</h2>
    <p>The standard position sizing formula used by professional traders worldwide is:</p>
    <div class="explanation__highlight">
        <strong>Position Size (Number of Shares) = Risk Amount &divide; Risk per Share</strong><br/><br/>
        Where:<br/>
        <strong>Risk Amount</strong> = Total Capital &times; Risk % per Trade<br/>
        <strong>Risk per Share</strong> = |Entry Price &minus; Stop-Loss Price|<br/><br/>
        <strong>Investment Amount</strong> = Position Size &times; Entry Price<br/>
        <strong>Potential Risk</strong> = Position Size &times; Risk per Share
    </div>

    <h3>Worked Example &mdash; ₹5 Lakh Capital at 1% Risk</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Total Capital</strong></td><td>₹5,00,000</td></tr>
            <tr><td><strong>Risk per Trade</strong></td><td>1%</td></tr>
            <tr><td><strong>Risk Amount</strong></td><td>₹5,00,000 &times; 1% = <strong>₹5,000</strong></td></tr>
            <tr><td><strong>Entry Price</strong></td><td>₹500</td></tr>
            <tr><td><strong>Stop-Loss Price</strong></td><td>₹480</td></tr>
            <tr><td><strong>Risk per Share</strong></td><td>₹500 &minus; ₹480 = <strong>₹20</strong></td></tr>
            <tr><td><strong>Position Size</strong></td><td>₹5,000 &divide; ₹20 = <strong>250 shares</strong></td></tr>
            <tr><td><strong>Investment Amount</strong></td><td>250 &times; ₹500 = <strong>₹1,25,000</strong></td></tr>
        </tbody>
    </table>
    <p>If the trade hits your stop-loss at ₹480, your loss = 250 &times; ₹20 = <strong>₹5,000</strong>, which is exactly 1% of your ₹5 lakh capital.</p>
    <p>If the trade hits your target at ₹550 (a 1:2.5 risk-reward ratio), your profit = 250 &times; ₹50 = <strong>₹12,500</strong> &mdash; 2.5x your risk.</p>

    <h2 id="one-percent-rule">The 1%&ndash;2% Risk Rule Explained</h2>
    <p>The <strong>1%&ndash;2% rule</strong> is the cornerstone of professional risk management. It caps the maximum loss on any single trade to 1% (conservative) or 2% (moderate) of your total trading capital.</p>
    <h3>Why the 1% Rule Works &mdash; The Maths of Survival</h3>
    <p>The table below shows why limiting risk per trade is critical. As losses grow, the return required just to <strong>break even</strong> increases exponentially:</p>
    <table>
        <thead><tr><th>Capital Loss</th><th>Return Needed to Recover</th><th>Trades at 1% Risk to Reach This</th></tr></thead>
        <tbody>
            <tr><td>5%</td><td>5.3%</td><td>5 consecutive losses</td></tr>
            <tr><td>10%</td><td>11.1%</td><td>10 consecutive losses</td></tr>
            <tr><td>20%</td><td>25.0%</td><td>22 consecutive losses</td></tr>
            <tr><td>30%</td><td>42.9%</td><td>35 consecutive losses</td></tr>
            <tr><td>50%</td><td><strong>100.0%</strong></td><td>68 consecutive losses</td></tr>
            <tr><td>75%</td><td><strong>300.0%</strong></td><td>138 consecutive losses</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Takeaway:</strong> At 1% risk, you would need <strong>68 consecutive losing trades</strong> to lose 50% of your capital. In practice, that virtually never happens with any reasonable strategy. At 5% risk per trade, just 13 consecutive losses would wipe out 50% &mdash; a far more likely scenario in volatile Indian markets.
    </div>

    <h2 id="fno-position-sizing">Position Sizing for F&amp;O Trading in India</h2>
    <p>Futures and Options (F&amp;O) on the NSE are different from equity trading because you <strong>must trade in fixed lot sizes</strong> mandated by the exchange. You cannot buy fractional lots.</p>
    <h3>NSE F&amp;O Lot Sizes &mdash; Effective January 2026</h3>
    <table>
        <thead><tr><th>Index / Segment</th><th>Lot Size (Units)</th><th>Approx. Contract Value</th><th>Approx. Margin (Futures)</th></tr></thead>
        <tbody>
            <tr><td><strong>Nifty 50</strong></td><td>65</td><td>~₹15.6 lakh</td><td>~₹1.8&ndash;2.3 lakh</td></tr>
            <tr><td><strong>Bank Nifty</strong></td><td>30</td><td>~₹15.0 lakh</td><td>~₹1.5&ndash;2.0 lakh</td></tr>
            <tr><td><strong>Nifty Financial Services</strong></td><td>60</td><td>~₹15.6 lakh</td><td>~₹1.8&ndash;2.2 lakh</td></tr>
            <tr><td><strong>Nifty Midcap Select</strong></td><td>120</td><td>~₹15.0 lakh</td><td>~₹2.0&ndash;2.5 lakh</td></tr>
            <tr><td><strong>Nifty Next 50</strong></td><td>25</td><td>~₹17.5 lakh</td><td>~₹2.0&ndash;2.8 lakh</td></tr>
            <tr><td><strong>BSE Sensex</strong></td><td>20</td><td>~₹15.6 lakh</td><td>~₹1.8&ndash;2.3 lakh</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>SEBI Mandate:</strong> SEBI requires derivative contract values to remain within <strong>₹15&ndash;20 lakh</strong> at introduction. As index values change, NSE revises lot sizes accordingly. The January 2026 revision increased Nifty lot size from 50 to 65 and Bank Nifty from 25 to 30. Stock F&amp;O lot sizes vary &mdash; check the official NSE lot size file at <strong>nseindia.com</strong>.
    </div>
    <h3>F&amp;O Position Sizing Formula</h3>
    <div class="explanation__highlight">
        <strong>Number of Lots = Risk Amount &divide; (Risk per Unit &times; Lot Size)</strong><br/><br/>
        Example: ₹10 lakh capital, 1% risk (₹10,000), Nifty at 24,000, SL at 23,800 (200 pts):<br/>
        Risk per lot = 200 &times; 65 = ₹13,000. Since ₹13,000 > ₹10,000, <strong>you cannot trade even 1 lot</strong> at 1% risk.<br/>
        You need at least ₹13,00,000 capital to trade 1 Nifty lot at 1% risk with a 200-point stop-loss.
    </div>

    <h2 id="trading-costs-india">Indian Trading Costs That Affect Your Position</h2>
    <p>Trading is not free. Every trade incurs charges that eat into your risk budget. Here are all costs effective April 2026:</p>
    <table>
        <thead><tr><th>Charge</th><th>Delivery</th><th>Intraday</th><th>Futures</th><th>Options</th></tr></thead>
        <tbody>
            <tr><td><strong>STT</strong></td><td>0.1% (buy + sell)</td><td>0.025% (sell only)</td><td>0.05% (sell only)</td><td>0.15% (sell premium)</td></tr>
            <tr><td><strong>GST</strong></td><td colspan="4">18% on brokerage + SEBI charges</td></tr>
            <tr><td><strong>SEBI Turnover</strong></td><td colspan="4">₹10 per crore of turnover</td></tr>
            <tr><td><strong>Stamp Duty</strong></td><td>0.015%</td><td>0.003%</td><td>0.002%</td><td>0.003%</td></tr>
            <tr><td><strong>Brokerage</strong></td><td colspan="4">₹20/order (discount) or 0.01&ndash;0.5% (full-service)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Impact on Position Sizing:</strong> For a ₹1 lakh intraday trade, total costs are approximately ₹70&ndash;100 (discount broker). If your risk amount on this trade is ₹2,000 (2% on ₹1L), trading costs are <strong>3&ndash;5% of your risk budget</strong>. For small accounts, this significantly reduces effective returns. Use the &ldquo;Trading Cost Breakdown&rdquo; toggle in our calculator above to see exact costs.
        Check the latest STT rates at the official <strong>Income Tax Department</strong> website or with your broker. Use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to compute STCG (20%) and LTCG (12.5%) on trading profits.
    </div>

    <h2 id="atr-position-sizing">ATR-Based (Volatility) Position Sizing</h2>
    <p>The <strong>Average True Range (ATR)</strong> is a volatility indicator that measures how much a stock typically moves in a given period. ATR-based position sizing adjusts your trade size based on market conditions &mdash; larger positions when volatility is low, smaller when it&rsquo;s high.</p>
    <div class="explanation__highlight">
        <strong>ATR Position Size Formula:</strong><br/><br/>
        <strong>Position Size = Risk Amount &divide; (ATR &times; Multiplier)</strong><br/><br/>
        The multiplier (typically 1.5&ndash;2.0) determines how many ATRs away your stop-loss sits.
    </div>
    <h3>Worked Example &mdash; ATR-Based Sizing on Tata Steel</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Stock</strong></td><td>Tata Steel (NSE)</td></tr>
            <tr><td><strong>14-period ATR</strong></td><td>₹8.50</td></tr>
            <tr><td><strong>Multiplier</strong></td><td>2.0 (stop-loss = 2 &times; ATR)</td></tr>
            <tr><td><strong>Effective Stop-Loss Distance</strong></td><td>₹8.50 &times; 2.0 = <strong>₹17</strong></td></tr>
            <tr><td><strong>Capital</strong></td><td>₹5,00,000</td></tr>
            <tr><td><strong>Risk (1%)</strong></td><td>₹5,000</td></tr>
            <tr><td><strong>Position Size</strong></td><td>₹5,000 &divide; ₹17 = <strong>294 shares</strong></td></tr>
        </tbody>
    </table>
    <p><strong>Advantage:</strong> On a volatile day when ATR is ₹15 instead of ₹8.50, the same formula gives: ₹5,000 &divide; (₹15 &times; 2) = <strong>167 shares</strong>. The position automatically shrinks in volatile markets, protecting your capital.</p>

    <h2 id="kelly-criterion">Kelly Criterion for Indian Traders</h2>
    <p>The <strong>Kelly Criterion</strong>, developed by John L. Kelly Jr. in 1956, is a mathematical formula that determines the <strong>optimal fraction of capital</strong> to allocate to a bet (or trade) for maximum long-term geometric growth.</p>
    <div class="explanation__highlight">
        <strong>Kelly Formula:</strong> f* = (p &times; b &minus; q) &divide; b<br/><br/>
        Where:<br/>
        <strong>f*</strong> = Optimal fraction of capital to allocate<br/>
        <strong>p</strong> = Probability of winning (win rate)<br/>
        <strong>q</strong> = Probability of losing (1 &minus; p)<br/>
        <strong>b</strong> = Win/loss ratio (average win &divide; average loss)
    </div>
    <h3>Worked Example</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Win Rate (p)</strong></td><td>55% (0.55)</td></tr>
            <tr><td><strong>Average Win</strong></td><td>₹3,000 (3%)</td></tr>
            <tr><td><strong>Average Loss</strong></td><td>₹1,500 (1.5%)</td></tr>
            <tr><td><strong>Win/Loss Ratio (b)</strong></td><td>3000 &divide; 1500 = 2.0</td></tr>
            <tr><td><strong>Full Kelly</strong></td><td>(0.55 &times; 2.0 &minus; 0.45) &divide; 2.0 = <strong>32.5%</strong></td></tr>
            <tr><td><strong>Half Kelly</strong></td><td>32.5% &divide; 2 = <strong>16.25%</strong></td></tr>
            <tr><td><strong>Quarter Kelly</strong></td><td>32.5% &divide; 4 = <strong>8.1%</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Warning:</strong> Full Kelly is <strong>extremely aggressive</strong> and causes drawdowns of 50%+ in practice. Professional hedge funds and prop traders use <strong>Half Kelly or Quarter Kelly</strong>. The Kelly Criterion also assumes your win rate and payoff estimates are perfectly accurate &mdash; which they never are in real trading. When in doubt, use Quarter Kelly.
    </div>

    <h2 id="risk-reward-ratio">Risk-Reward Ratio &mdash; The Trader's Edge</h2>
    <p>The <strong>risk-reward ratio (RRR)</strong> is the comparison between the potential profit and potential loss of a trade. A 1:2 RRR means for every ₹1 you risk, you expect ₹2 if the trade works.</p>
    <table>
        <thead><tr><th>Risk-Reward Ratio</th><th>Required Win Rate (Breakeven)</th><th>Rating</th></tr></thead>
        <tbody>
            <tr><td>1 : 0.5</td><td>66.7%</td><td style="color:#ef4444;"><strong>Poor</strong></td></tr>
            <tr><td>1 : 1.0</td><td>50.0%</td><td style="color:#f59e0b;"><strong>Fair</strong></td></tr>
            <tr><td>1 : 1.5</td><td>40.0%</td><td style="color:#f59e0b;"><strong>Fair</strong></td></tr>
            <tr><td>1 : 2.0</td><td>33.3%</td><td style="color:#3b82f6;"><strong>Good</strong></td></tr>
            <tr><td>1 : 3.0</td><td>25.0%</td><td style="color:#16a34a;"><strong>Excellent</strong></td></tr>
            <tr><td>1 : 5.0</td><td>16.7%</td><td style="color:#16a34a;"><strong>Excellent</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> Most successful intraday traders on NSE/BSE aim for a <strong>minimum 1:2 risk-reward ratio</strong>. This means they only need to win 33% of their trades to be profitable. Combined with proper position sizing (1% risk rule), this creates a mathematically robust trading system. Use our Risk-Reward Analyser mode above to evaluate any trade before entering. For overall portfolio performance, calculate true returns with our <a href="/in/xirr-calculator">XIRR Calculator</a>.
    </div>

    <h2 id="five-methods-compared">5 Position Sizing Methods Compared</h2>
    <table>
        <thead><tr><th>Method</th><th>Formula</th><th>Best For</th><th>Risk Level</th></tr></thead>
        <tbody>
            <tr><td><strong>Fixed Percentage Risk</strong></td><td>Risk Amount &divide; Risk per Share</td><td>Most traders (beginners to pros)</td><td>Low&ndash;Medium</td></tr>
            <tr><td><strong>Fixed Share Count</strong></td><td>Buy same number of shares always</td><td>Not recommended</td><td>Variable (dangerous)</td></tr>
            <tr><td><strong>ATR/Volatility-Based</strong></td><td>Risk Amount &divide; (ATR &times; Multiplier)</td><td>Swing traders, multi-stock portfolios</td><td>Low</td></tr>
            <tr><td><strong>Kelly Criterion</strong></td><td>(p&times;b &minus; q) &divide; b</td><td>Quantitative traders with reliable stats</td><td>High (use fractional)</td></tr>
            <tr><td><strong>Van Tharp CPR</strong></td><td>Capital &times; Risk% &divide; R-multiple</td><td>Systematic traders, prop firms</td><td>Medium</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Recommendation:</strong> Start with the <strong>Fixed Percentage Risk</strong> method (1% rule) &mdash; it&rsquo;s simple, effective, and used by most professional traders. As you gain experience and build reliable trading statistics (win rate, avg win/loss over 100+ trades), graduate to ATR-based or Fractional Kelly for optimization. Never use Fixed Share Count &mdash; it creates wildly inconsistent risk across trades.
    </div>

    <h2 id="sebi-regulations-2026">SEBI F&amp;O Regulations &mdash; 2026 Update</h2>
    <p>The Securities and Exchange Board of India (SEBI) has introduced several regulations in 2025&ndash;2026 that directly impact position sizing for retail traders:</p>
    <ul>
        <li><strong>Increased STT on Derivatives</strong> &mdash; Effective April 2026, STT on futures increased to 0.05% (from 0.02%) and options to 0.15% (from 0.10%), making derivatives trading more expensive</li>
        <li><strong>Intraday Position Monitoring</strong> &mdash; From April 2025, exchanges monitor position limits multiple times intraday (not just end-of-day), making it harder to exceed prescribed limits</li>
        <li><strong>Higher Contract Values</strong> &mdash; SEBI mandates ₹15&ndash;20 lakh per lot at introduction, increasing capital requirements for retail F&amp;O traders</li>
        <li><strong>Additional ELM on Expiry</strong> &mdash; Extra margin requirements on short option positions on expiry day to curb speculative excess</li>
        <li><strong>Algo Trading Framework</strong> &mdash; Effective April 2026, all algorithmic trading must comply with SEBI&rsquo;s registration and reporting requirements for order-per-second thresholds</li>
        <li><strong>Risk Disclosures</strong> &mdash; Brokers must show standardized risk disclosures (including the 93% loss statistic) before granting F&amp;O access</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Impact on Traders:</strong> Higher STT and margin requirements mean your effective trading costs have increased by 30&ndash;50% compared to 2024. Position sizing must account for these higher costs. For every ₹1 lakh of options sold, you now pay ~₹150 in STT alone (previously ₹100). Factor this into your risk calculations using our calculator&rsquo;s cost breakdown feature.
    </div>

    <h2 id="common-mistakes">7 Common Position Sizing Mistakes Indian Traders Make</h2>
    <ol>
        <li><strong>Trading without a stop-loss</strong> &mdash; Position sizing is meaningless without a stop-loss. If you don&rsquo;t know where you&rsquo;ll exit, you can&rsquo;t calculate risk per share. Always set your stop-loss <em>before</em> calculating position size.</li>
        <li><strong>Risking too much per trade</strong> &mdash; Risking 5&ndash;10% per trade is gambling, not trading. Even a short losing streak at 5% risk can cause a 30%+ drawdown &mdash; requiring a 43% gain just to break even.</li>
        <li><strong>Using the same share count for every stock</strong> &mdash; Buying 100 shares of a ₹50 stock (₹5K exposure) versus 100 shares of a ₹5,000 stock (₹5L exposure) creates wildly different risk profiles. Always calculate based on risk per share, not a fixed count.</li>
        <li><strong>Ignoring trading costs</strong> &mdash; STT, GST, brokerage, and stamp duty can eat 3&ndash;5% of a small risk amount. On ₹1 lakh capital at 1% risk (₹1,000), trading costs of ₹80&ndash;100 represent 8&ndash;10% of your risk budget. Use our cost calculator above.</li>
        <li><strong>Revenge trading with oversized positions</strong> &mdash; After a losing trade, the temptation to &ldquo;make it back quickly&rdquo; by increasing position size is the fastest path to account destruction. Always reduce size during losing streaks, never increase it.</li>
        <li><strong>Not adjusting for volatility</strong> &mdash; Using the same 20-point stop-loss for a large-cap like HDFC Bank (ATR ~15) and a mid-cap like NHPC (ATR ~3) makes no sense. Use ATR-based sizing or adjust your stop-loss based on the stock&rsquo;s volatility.</li>
        <li><strong>Trading F&amp;O with insufficient capital</strong> &mdash; Nifty futures require ~₹2 lakh margin for one lot. With ₹3 lakh capital and 1 lot, a 200-point adverse move (₹13,000 loss) is a 4.3% drawdown from a single trade. You need at least ₹10&ndash;15 lakh to trade F&amp;O responsibly with the 1% rule. For safe, predictable returns on smaller capital, consider <a href="/in/ppf-calculator">PPF</a> or <a href="/in/fd-calculator">Fixed Deposits</a> instead.</li>
    </ol>

    <h2 id="related-tools">Related Calculators &amp; Tools</h2>
    <ul>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> &mdash; For long-term wealth creation through systematic investing in mutual funds. Compare SIP returns vs active trading returns over 15+ year horizons.</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> &mdash; Model how consistent trading profits compound over time. A 2% monthly return compounding over 5 years is transformative.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> &mdash; Calculate STCG (20% under new regime) and LTCG (12.5% above ₹1.25 lakh) on your trading profits. F&amp;O profits are taxed as business income.</li>
        <li><strong><a href="/in/xirr-calculator">XIRR Calculator</a></strong> &mdash; Calculate the true annualized return on your trading portfolio with irregular cash flows (deposits, withdrawals, P&amp;L).</li>
        <li><strong><a href="/in/lumpsum-calculator">Lumpsum Calculator</a></strong> &mdash; Compare one-time mutual fund investment returns with trading capital returns.</li>
        <li><strong><a href="/in/crorepati-calculator">Crorepati Calculator</a></strong> &mdash; Can systematic trading with position sizing compound your capital to ₹1 Crore? Model the timeline.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> &mdash; Compare risk-free FD returns (6.5&ndash;7.5%) with trading returns. Keep a portion of your capital in FDs as emergency reserve.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> &mdash; PPF offers 7.1% tax-free returns &mdash; a risk-free &ldquo;core&rdquo; holding alongside your trading &ldquo;satellite&rdquo; capital.</li>
        <li><strong><a href="/in/personal-loan-calculator">Personal Loan Calculator</a></strong> &mdash; Never trade with borrowed money. If you&rsquo;re considering taking a loan to fund trading, calculate the true cost first.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan Calculator</a></strong> &mdash; Prioritize EMI obligations over trading capital allocation. Housing is a need; trading is an activity.</li>
    </ul>
`;

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import FIRECalculatorIndiaCore from "@/components/calculator/FIRECalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "FIRE Calculator India 2026 — Financial Independence Retire Early with SIP, NPS & SWR Planning",
    description: "Free FIRE calculator for India with 4 modes: FIRE Number (Lean/Standard/Fat with India-adapted 3.5% SWR), Coast FIRE, Barista FIRE, and Readiness Scorecard. Includes SIP bridge calculator, NPS/EPF/PPF integration, healthcare cost planning, bucket withdrawal strategy, and city-wise FIRE targets.",
    keywords: ["FIRE calculator India", "financial independence retire early India", "FIRE number calculator", "early retirement India", "FIRE movement India", "lean FIRE", "fat FIRE", "coast FIRE", "barista FIRE", "safe withdrawal rate India", "retirement calculator India", "SIP for FIRE", "FIRE planning India 2026"],
    alternates: buildCountryAlternates("IN", "/in/fire-calculator", "fire-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is the FIRE movement?", answer: "FIRE stands for Financial Independence, Retire Early. It is a lifestyle and financial strategy focused on aggressive saving (50–70% of income) and disciplined investing during your peak working years to build a large enough investment corpus that generates passive income to cover all living expenses — allowing you to 'retire' or become work-optional decades earlier than the traditional retirement age of 58–60. The concept gained popularity from the 1992 book 'Your Money or Your Life' by Vicki Robin and Joe Dominguez, and has been adopted by Indian millennials and Gen-Z professionals who want financial freedom in their 30s or 40s. FIRE doesn't necessarily mean stopping all work — it means having the CHOICE to work on what you love without financial pressure." },
    { question: "What is a FIRE number and how do I calculate it for India?", answer: "Your FIRE number is the total investment corpus you need so that your annual investment returns (or systematic withdrawals) cover all your living expenses without working. For India, the formula is: FIRE Number = Annual Expenses at Retirement Age × Multiplier. The multiplier depends on your chosen Safe Withdrawal Rate (SWR): 25× for 4% SWR (global standard), 29× for 3.5% SWR (India-recommended), 30× for 3.3% SWR (conservative India), or 33× for 3% SWR (very safe). Example: If your monthly expenses are ₹50,000 today, at 6% inflation they become ₹1,61,000/month at age 45 (17 years). Annual expenses = ₹19.3 lakh. FIRE number at 29× = ₹5.6 Crore. Use our calculator above to get your personalised number." },
    { question: "Does the 4% rule work in India?", answer: "The 4% rule was developed by William Bengen in 1994 based on US market data — it assumes 2–3% inflation and access to low-cost US index funds and bonds. In India, this rule needs significant adjustment because: (1) Indian CPI inflation averages 5–7% (nearly double the US rate). (2) Medical inflation in India runs at 10–14% per year. (3) There are no inflation-linked government bonds like US TIPS. (4) Capital gains taxation (LTCG at 12.5%, STCG at 20%) reduces real returns. (5) Rupee depreciation adds another layer of risk. Most Indian financial planners and SEBI-registered advisors now recommend a Safe Withdrawal Rate of 2.5–3.5% for India. Our calculator defaults to 3.5% as the India-recommended rate, which translates to a 29× multiplier instead of the US 25×." },
    { question: "What is Lean FIRE vs Fat FIRE?", answer: "Lean FIRE and Fat FIRE represent different lifestyle approaches to financial independence: Lean FIRE means living a minimalist, frugal lifestyle both before and after retirement. Typical monthly expenses: ₹25,000–₹40,000 in Tier-2 cities. Corpus needed: 20× annual expenses (lower multiplier because shorter horizon or accepting more risk). Best for singles or couples without dependents in smaller cities. Fat FIRE means maintaining a comfortable, premium lifestyle — international travel, premium healthcare, dining out, hobbies. Typical monthly expenses: ₹1.5–3 lakh. Corpus needed: 40× annual expenses. Requires significantly higher savings during working years. In between, Standard FIRE (25–30×) targets a comfortable middle-class Indian lifestyle. Choose your FIRE type based on your actual lifestyle needs, not aspirational goals." },
    { question: "What is Coast FIRE and how does it work?", answer: "Coast FIRE means you have saved and invested enough money at a young age so that, even without any further contributions, your existing corpus will grow through compounding to reach your full FIRE number by traditional retirement age (55–60). Once you reach Coast FIRE, you only need to earn enough to cover today's living expenses — you don't need to save for retirement anymore. Example: A 28-year-old with ₹25 lakh invested at 12% return will have ₹4.8 Crore by age 55 (27 years of compounding). If their FIRE target at 55 is ₹4.5 Crore, they've already reached Coast FIRE. They can now take a lower-paying job, go freelance, travel, or pursue passions. Coast FIRE is particularly appealing to Indian tech professionals who earn high salaries early in their careers." },
    { question: "What is Barista FIRE?", answer: "Barista FIRE (named after the idea of working at a coffee shop) is a hybrid approach where you accumulate a partial FIRE corpus and then transition to part-time, freelance, or passion-based work that covers your ongoing living expenses. Your investment corpus continues to grow untouched, eventually reaching full FIRE. In India, Barista FIRE is increasingly popular thanks to the gig economy — freelance consulting, online tutoring (Unacademy, Vedantu), content creation (YouTube, blogging), part-time teaching, e-commerce, or running a small home-based business. Example: If your monthly expenses are ₹80,000 and you earn ₹30,000 from freelancing, you only need your corpus to generate ₹50,000/month — reducing your required FIRE number by 37.5%. Use Mode 3 in our calculator to model your Barista FIRE scenario." },
    { question: "How much do I need to retire at 40 in India?", answer: "To retire at 40 in India, you need to account for: (1) Inflation — your ₹50,000/month expenses today become ₹1,07,000/month at 40 assuming you're 28 today (12 years at 6% inflation). (2) Long retirement horizon — retiring at 40 means your money needs to last 40–50 years, requiring a more conservative SWR of 3–3.5%. (3) Healthcare costs — medical inflation at 10–14% means a separate healthcare corpus is essential. A rough estimate for ₹50,000/month lifestyle: Annual expenses at 40 = ₹12.8 lakh. At 30× multiplier = ₹3.85 Crore. Add healthcare buffer of ₹50 lakh = ₹4.35 Crore total. Monthly SIP needed: approximately ₹1.05 lakh/month at 12% return for 12 years. This is why FIRE at 40 requires a savings rate of 50–70% of income. For a more precise number, use our FIRE Number calculator above with your specific inputs." },
    { question: "What is the safe withdrawal rate for India?", answer: "The Safe Withdrawal Rate (SWR) is the maximum percentage of your retirement corpus that you can withdraw annually while ensuring your money lasts through your entire retirement. For India, experts recommend: 2.5% SWR (Very Safe) — for early retirees (35–40 year horizon), conservative investors. Corpus multiplier: 40×. 3.0% SWR (Safe) — for 30-year retirement, balanced. Corpus multiplier: 33×. 3.5% SWR (India Recommended) — for 25-year retirement, moderate equity allocation. Corpus multiplier: 29×. 4.0% SWR (Global Standard) — for traditional 20–25 year retirement. Corpus multiplier: 25×. The lower SWR for India is because: higher inflation, medical costs inflation at 10–14%, no social security safety net, and capital gains taxation reducing real returns. Our calculator defaults to 3.5% as the balanced India recommendation." },
    { question: "How does healthcare inflation affect FIRE planning in India?", answer: "Healthcare inflation is the single biggest threat to FIRE planning in India. While general CPI inflation is 5–7%, medical inflation runs at 10–14% per year — meaning healthcare costs double every 5–7 years. Examples: Heart bypass surgery costs ₹3–5 lakh today → ₹29–48 lakh in 20 years. Knee replacement costs ₹2.5–4 lakh today → ₹24–39 lakh in 20 years. Monthly medicines for chronic conditions: ₹3,000–8,000 today → ₹29,000–77,000/month in 20 years. Strategy: (1) Maintain comprehensive health insurance with ₹20–50 lakh cover (buy Super Top-Up plan). (2) Build a separate healthcare corpus of ₹50–75 lakh outside your FIRE corpus. (3) Factor 8–10% inflation for healthcare expenses specifically. (4) Consider family floater plans for spouse and parents. Never include healthcare costs in your general FIRE number — always keep them separate." },
    { question: "Should I include NPS in my FIRE plan?", answer: "Yes — NPS (National Pension System) is an excellent FIRE tool for tax efficiency. Key benefits: (1) Additional ₹50,000 deduction under Section 80CCD(1B) — over and above the ₹1.5 lakh 80C limit — saving ₹15,000/year in tax at 30% bracket. (2) Market-linked returns of 8–14% historically. (3) At age 60, up to 60% lump sum is tax-free (80% for non-government under 2024 amendment). However, NPS has limitations for FIRE: (1) Locked until age 60 (partial withdrawal allowed after 3 years for specific purposes). (2) Mandatory annuity purchase (minimum 20–40%) — annuity income is taxable at slab rate. (3) Not suitable as your primary FIRE vehicle if retiring at 35–45. Strategy: Use NPS for the tax benefit (₹50K extra under 80CCD(1B)) and treat it as your 'traditional retirement' safety net. Build your primary FIRE corpus through equity mutual fund SIPs, PPF, and direct equity. See our Pension Calculator for NPS projections." },
    { question: "What is the bucket strategy for FIRE withdrawal in India?", answer: "The bucket strategy divides your FIRE corpus into three time-horizon buckets to manage cash flow and market risk: Bucket 1 (Immediate — 0 to 3 years): 12–36 months of expenses in liquid mutual funds, savings accounts, or short-term FDs. Purpose: daily living expenses without selling equity during market downturns. Bucket 2 (Medium-term — 3 to 10 years): Conservative debt mutual funds, balanced/hybrid funds, or FD laddering. Purpose: refill Bucket 1 annually and provide stability. Bucket 3 (Long-term — 10+ years): Equity mutual funds (index funds, flexi-cap, multi-cap). Purpose: growth to beat inflation over long periods. Rebalancing: annually, move gains from Bucket 3 → Bucket 2 → Bucket 1. This prevents you from selling equity during bear markets. Example: ₹3 Crore corpus → Bucket 1: ₹30 lakh (liquid), Bucket 2: ₹90 lakh (balanced/debt), Bucket 3: ₹1.8 Crore (equity). Use our SWP Calculator to model Bucket 1 withdrawals." },
    { question: "How do I account for parents' expenses in FIRE planning?", answer: "This is uniquely important in India, where supporting aging parents is both a cultural expectation and often a financial necessity. Steps: (1) Estimate parents' monthly expenses: rent/mortgage, groceries, medicines, domestic help, utilities. Typical range: ₹15,000–₹40,000/month per parent couple. (2) Estimate their existing income sources: pension (government), EPF/EPS, senior citizen FD interest, rental income: see our FD Calculator for senior citizen rates. (3) Calculate the gap — the amount you need to contribute monthly. (4) Add this gap to YOUR monthly expenses when calculating YOUR FIRE number. (5) Health insurance for parents: separate policy (₹10–25 lakh cover with super top-up) — factor premium (~₹30,000–₹60,000/year) into your expenses. (6) Consider parents' life expectancy (75–85 years in India) and reduce this support expense once their other savings kick in. Many Indian FIRE aspirants add 20–30% buffer to their FIRE number specifically for parent support." },
];

export default function FIRECalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "FIRE Calculator" },
        ]),
        webAppSchema("FIRE Calculator India 2026 — Financial Independence Retire Early", canonicalUrl("/in/fire-calculator")),
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
            <Script id="schema-fire" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "FIRE Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>FIRE Calculator India 2026 — Financial Independence, Retire Early</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Free FIRE calculator with 4 modes — FIRE Number (Lean/Standard/Conservative/Fat with India-adapted 3.5% SWR),
                Coast FIRE, Barista FIRE, and FIRE Readiness Scorecard. Includes SIP bridge calculator, NPS/EPF/PPF integration guidance,
                healthcare cost planning, bucket withdrawal strategy, and city-wise FIRE targets for India.
            </p>
            <AuthorBadge categoryKey="salary" />
            <FIRECalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="FIRE Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    <Link href="/in/sip-calculator" className="in-related-link">
                        <span className="in-related-link__icon">📈</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SIP Calculator</div>
                            <div className="in-related-link__desc">Calculate monthly SIP needed to reach your FIRE number</div>
                        </div>
                    </Link>
                    <Link href="/in/swp-calculator" className="in-related-link">
                        <span className="in-related-link__icon">💸</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">SWP Calculator</div>
                            <div className="in-related-link__desc">Plan post-FIRE withdrawals with bucket strategy</div>
                        </div>
                    </Link>
                    <Link href="/in/pension-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🏦</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Pension Calculator</div>
                            <div className="in-related-link__desc">NPS tax benefits and EPS pension for FIRE planning</div>
                        </div>
                    </Link>
                    <Link href="/in/retirement-corpus-calculator" className="in-related-link">
                        <span className="in-related-link__icon">🛡️</span>
                        <div className="in-related-link__text">
                            <div className="in-related-link__title">Retirement Corpus Calculator</div>
                            <div className="in-related-link__desc">Traditional vs FIRE retirement — compare corpus needs</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-fire">What Is the FIRE Movement?</h2>
    <p><strong>FIRE</strong> stands for <strong>Financial Independence, Retire Early</strong> &mdash; a lifestyle and financial strategy where you aggressively save and invest during your peak earning years to build a large enough investment corpus that generates passive income to cover all your living expenses indefinitely, without needing to work for a salary.</p>
    <p>The FIRE movement originated from the 1992 book <em>&ldquo;Your Money or Your Life&rdquo;</em> by Vicki Robin and Joe Dominguez, and was popularized by blogs like Mr. Money Mustache and the subreddit r/financialindependence. In India, the movement has gained significant traction among <strong>millennials and Gen-Z professionals</strong> in IT, finance, and startup sectors&mdash;people who earn well in their 20s and 30s and want the freedom to pursue passions, travel, spend time with family, or start their own ventures without financial pressure.</p>
    <div class="explanation__highlight">
        <strong>Key Distinction:</strong> FIRE doesn&rsquo;t mean you <em>must</em> stop working. It means you have the <strong>financial freedom to CHOOSE</strong> whether to work, what to work on, and when to work. Many people who achieve FIRE continue working on passion projects, consulting, teaching, or building businesses &mdash; the difference is they do it from a position of freedom, not financial necessity.
    </div>

    <h2 id="fire-number">What Is Your FIRE Number?</h2>
    <p>Your <strong>FIRE number</strong> is the total investment corpus needed so that annual withdrawal from this corpus covers all your living expenses for the rest of your life. The formula is:</p>
    <div class="explanation__highlight">
        <strong>FIRE Number = Annual Expenses at FIRE Age &times; Multiplier</strong><br/><br/>
        Where the <strong>multiplier</strong> = 100 &divide; Safe Withdrawal Rate (SWR):<br/>
        <strong>25&times;</strong> (4% SWR &mdash; global standard)<br/>
        <strong>29&times;</strong> (3.5% SWR &mdash; India recommended)<br/>
        <strong>33&times;</strong> (3% SWR &mdash; conservative India)<br/>
        <strong>40&times;</strong> (2.5% SWR &mdash; very safe, early retirement)
    </div>
    <h3>Worked Example &mdash; ₹50,000/Month Lifestyle, FIRE at 45</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td><strong>Current monthly expenses</strong></td><td>₹50,000</td></tr>
            <tr><td><strong>Current age</strong></td><td>28 years</td></tr>
            <tr><td><strong>Target FIRE age</strong></td><td>45 years (17 years to FIRE)</td></tr>
            <tr><td><strong>Inflation</strong></td><td>6% per year</td></tr>
            <tr><td><strong>Monthly expenses at 45</strong></td><td><strong>₹1,34,590</strong></td></tr>
            <tr><td><strong>Annual expenses at 45</strong></td><td>₹16,15,080</td></tr>
            <tr><td><strong>FIRE Number (29&times; at 3.5% SWR)</strong></td><td><strong>₹4.68 Crore</strong></td></tr>
            <tr><td><strong>Monthly SIP needed (12% return)</strong></td><td><strong>₹56,800/month</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Savings Rate Required:</strong> You need to invest ₹56,800/month &mdash; which is <strong>113% of your current expenses.</strong> This illustrates why FIRE requires high income, extreme frugality, or both. Most successful FIRE achievers in India maintain a <strong>50&ndash;70% savings rate</strong>. Use our <a href="/in/sip-calculator">SIP Calculator</a> to model step-up SIP strategies that increase your investment with annual salary hikes.
    </div>

    <h2 id="types-of-fire">Types of FIRE &mdash; Which One Is Right for You?</h2>
    <p>The FIRE movement isn&rsquo;t one-size-fits-all. Different FIRE types suit different lifestyles, risk tolerances, and income levels:</p>
    <table>
        <thead><tr><th>FIRE Type</th><th>Multiplier</th><th>Monthly Expense (India)</th><th>FIRE Corpus (at 45)</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>🥬 Lean FIRE</strong></td><td>20&times;</td><td>₹25,000&ndash;₹40,000</td><td>₹1.3&ndash;₹2.2 Cr</td><td>Minimalists, Tier-2/3 cities, singles</td></tr>
            <tr><td><strong>🔥 Standard FIRE</strong></td><td>25&ndash;29&times;</td><td>₹50,000&ndash;₹80,000</td><td>₹3.2&ndash;₹6.2 Cr</td><td>Middle-class families, metro salaried</td></tr>
            <tr><td><strong>🛡️ Conservative FIRE</strong></td><td>33&times;</td><td>₹50,000&ndash;₹80,000</td><td>₹4.3&ndash;₹7.1 Cr</td><td>Risk-averse, early retirement (35&ndash;40)</td></tr>
            <tr><td><strong>👑 Fat FIRE</strong></td><td>40&times;</td><td>₹1.5L&ndash;₹3L</td><td>₹12&ndash;₹32 Cr</td><td>Premium lifestyle, travel, luxury</td></tr>
            <tr><td><strong>🏖️ Coast FIRE</strong></td><td>N/A</td><td>Any</td><td>Front-load early</td><td>Young high earners, let compounding work</td></tr>
            <tr><td><strong>☕ Barista FIRE</strong></td><td>Reduced</td><td>Any (with part-time income)</td><td>30&ndash;60% of Full FIRE</td><td>Freelancers, gig workers, passion careers</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>India Insight:</strong> For most Indian professionals earning ₹12&ndash;25 LPA, <strong>Standard FIRE at 29&times;</strong> with a 3.5% SWR is the most realistic and safe target. Lean FIRE works well in cities like Jaipur, Pune, or Chandigarh where cost of living is 40&ndash;50% lower than Mumbai or Bangalore. Fat FIRE is typically achievable only for people with incomes above ₹50 LPA or those with rental income. For wealth milestone planning, see our <a href="/in/crorepati-calculator">Crorepati Calculator</a>.
    </div>

    <h2 id="why-4-percent-fails-india">Why the 4% Rule Doesn&rsquo;t Work for India</h2>
    <p>The <strong>4% rule</strong> was developed by William Bengen in 1994 using US historical market data. It states that withdrawing 4% of your portfolio in the first year (and adjusting for inflation afterwards) has historically lasted 30+ years. However, this rule has <strong>critical limitations</strong> when applied to India:</p>
    <table>
        <thead><tr><th>Factor</th><th>USA (4% Rule)</th><th>India (Reality)</th></tr></thead>
        <tbody>
            <tr><td><strong>General Inflation</strong></td><td>2&ndash;3%</td><td>5&ndash;7% (CPI India avg)</td></tr>
            <tr><td><strong>Medical Inflation</strong></td><td>3&ndash;5%</td><td><strong>10&ndash;14%</strong></td></tr>
            <tr><td><strong>Social Security</strong></td><td>Yes (SS benefits)</td><td>No (except EPS ₹1,000&ndash;₹7,929/mo)</td></tr>
            <tr><td><strong>Capital Gains Tax</strong></td><td>0% on LTCG (in 401k/IRA)</td><td>12.5% LTCG on equity &gt;₹1.25L</td></tr>
            <tr><td><strong>Healthcare</strong></td><td>Medicare at 65</td><td>No public healthcare safety net</td></tr>
            <tr><td><strong>Currency Risk</strong></td><td>Reserve currency (USD)</td><td>INR depreciates 3&ndash;4%/year vs USD</td></tr>
            <tr><td><strong>Inflation-Linked Bonds</strong></td><td>TIPS available</td><td>No equivalent instrument</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>India-Adapted Recommendation:</strong> Use <strong>3&ndash;3.5% SWR</strong> (29&ndash;33&times; multiplier) for Indian FIRE planning. This provides a safety buffer against higher inflation, medical costs, and the lack of a social security safety net. For early retirees (FIRE at 35&ndash;40 with 40+ year horizon), use <strong>2.5&ndash;3% SWR</strong> (33&ndash;40&times;) for maximum safety. Check your exact sustainable withdrawal rate using our <a href="/in/swp-calculator">SWP Calculator&rsquo;s Safe Rate Finder mode</a>.
    </div>

    <h2 id="investment-stack">The FIRE Investment Stack for India</h2>
    <p>Building your FIRE corpus in India requires a <strong>diversified, tax-efficient investment stack</strong> that balances growth, safety, and liquidity. Here&rsquo;s the recommended stack:</p>
    <table>
        <thead><tr><th>Instrument</th><th>Role in FIRE</th><th>Expected Return</th><th>Tax Status</th><th>Liquidity</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity Mutual Fund SIP</strong></td><td>Primary growth engine</td><td>12&ndash;15%</td><td>LTCG 12.5% (&gt;₹1.25L)</td><td>High (T+2)</td></tr>
            <tr><td><strong>NPS (Tier 1)</strong></td><td>Tax optimization + growth</td><td>8&ndash;14%</td><td>EET (80CCD(1B) ₹50K extra)</td><td>Low (locked till 60)</td></tr>
            <tr><td><strong>EPF</strong></td><td>Safety + guaranteed return</td><td>8.25%</td><td>EEE (tax-free)</td><td>Low (till 58)</td></tr>
            <tr><td><strong><a href="/in/ppf-calculator">PPF</a></strong></td><td>Tax-free fixed-income</td><td>7.1%</td><td>EEE (tax-free)</td><td>Partial from Yr 7</td></tr>
            <tr><td><strong><a href="/in/fd-calculator">FD Laddering</a></strong></td><td>Stable bucket / emergency</td><td>6.5&ndash;7.5%</td><td>Fully taxable</td><td>High (with penalty)</td></tr>
            <tr><td><strong>Direct Equity / Stocks</strong></td><td>High-growth satellite</td><td>Variable</td><td>LTCG 12.5%</td><td>High</td></tr>
            <tr><td><strong>Gold (SGBs)</strong></td><td>Hedge / diversification</td><td>8&ndash;10%</td><td>Tax-free at maturity</td><td>Moderate</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Ideal FIRE Allocation (Age 25&ndash;35):</strong> 60&ndash;70% Equity SIPs (via <a href="/in/sip-calculator">SIP Calculator</a>) + 10&ndash;15% NPS (extra ₹50K tax benefit via <a href="/in/pension-calculator">Pension Calculator</a>) + 10% PPF + 5&ndash;10% Gold SGBs + Emergency fund in liquid funds. As you approach your FIRE date, gradually shift equity → debt/balanced using the bucket strategy described below.
    </div>

    <h2 id="healthcare-fire-killer">Healthcare &mdash; The Silent FIRE Killer in India</h2>
    <p>Medical inflation in India at <strong>10&ndash;14% per year</strong> is the single biggest risk to your FIRE plan. While general CPI inflation is 5&ndash;7%, healthcare costs double every 5&ndash;7 years:</p>
    <table>
        <thead><tr><th>Medical Procedure</th><th>Cost Today (2026)</th><th>Cost in 15 Years</th><th>Cost in 25 Years</th></tr></thead>
        <tbody>
            <tr><td>Heart bypass surgery</td><td>₹3&ndash;5 Lakh</td><td>₹13&ndash;21 Lakh</td><td>₹47&ndash;78 Lakh</td></tr>
            <tr><td>Knee replacement (single)</td><td>₹2.5&ndash;4 Lakh</td><td>₹10&ndash;17 Lakh</td><td>₹39&ndash;63 Lakh</td></tr>
            <tr><td>Cancer treatment (average)</td><td>₹5&ndash;20 Lakh</td><td>₹21&ndash;84 Lakh</td><td>₹78 Lakh&ndash;₹3.1 Cr</td></tr>
            <tr><td>Monthly medicines (chronic conditions)</td><td>₹3,000&ndash;₹8,000/mo</td><td>₹12,600&ndash;₹33,600/mo</td><td>₹47,000&ndash;₹1.25L/mo</td></tr>
            <tr><td>Comprehensive health checkup</td><td>₹5,000&ndash;₹15,000</td><td>₹21,000&ndash;₹63,000</td><td>₹78,000&ndash;₹2.3L</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Healthcare Strategy for FIRE:</strong> (1) <strong>Health insurance</strong> with ₹20&ndash;50 lakh cover &mdash; buy a Super Top-Up plan while young (premiums are 70% cheaper at 30 than at 50). (2) <strong>Separate healthcare corpus</strong> of ₹50&ndash;75 lakh &mdash; NOT part of your FIRE corpus. Invest in a mix of balanced funds and <a href="/in/fd-calculator">FD laddering</a> for this. (3) <strong>Family floater</strong> to cover spouse, children, and aged parents. (4) Factor healthcare expenses at <strong>8&ndash;10% inflation</strong> separately from your 6% general inflation. Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to project healthcare corpus growth.
    </div>

    <h2 id="withdrawal-strategy">Tax-Efficient Withdrawal Strategy &mdash; Bucket Approach</h2>
    <p>Once you reach FIRE, <strong>how you withdraw</strong> is just as important as how much you saved. The <strong>bucket strategy</strong> protects you from market volatility and optimizes tax efficiency:</p>
    <table>
        <thead><tr><th>Bucket</th><th>Time Horizon</th><th>Instruments</th><th>Purpose</th><th>Allocation %</th></tr></thead>
        <tbody>
            <tr><td><strong>🪣 Bucket 1 (Immediate)</strong></td><td>0&ndash;3 years</td><td>Liquid funds, savings account, short-term FDs</td><td>Daily expenses without selling equity</td><td>10&ndash;15%</td></tr>
            <tr><td><strong>🪣 Bucket 2 (Medium)</strong></td><td>3&ndash;10 years</td><td>Debt mutual funds, balanced/hybrid funds, <a href="/in/fd-calculator">FD laddering</a></td><td>Refill Bucket 1 annually</td><td>25&ndash;35%</td></tr>
            <tr><td><strong>🪣 Bucket 3 (Growth)</strong></td><td>10+ years</td><td>Equity index funds, flexi-cap, multi-cap, direct stocks</td><td>Long-term growth to beat inflation</td><td>50&ndash;65%</td></tr>
        </tbody>
    </table>
    <p><strong>Rebalancing Rule:</strong> Every year, move gains from Bucket 3 → Bucket 2 → Bucket 1. This ensures you <strong>never sell equity during a bear market</strong>. During market crashes, you live off Bucket 1 (3 years of expenses) while Bucket 3 recovers.</p>
    <div class="explanation__highlight">
        <strong>Tax Optimization Tips:</strong> (1) Harvest LTCG up to ₹1.25 lakh per year tax-free by selling and reinvesting equity. (2) Use <a href="/in/swp-calculator">SWP (Systematic Withdrawal Plan)</a> from balanced funds &mdash; each withdrawal is part capital return + part gain, making it more tax-efficient than FD interest. (3) NPS lump sum (60%) is fully tax-free at 60. (4) <a href="/in/ppf-calculator">PPF</a> maturity is 100% tax-free (EEE status). (5) Plan withdrawals to stay within the ₹7 lakh tax-free limit under the new regime. Check your tax slab with our <a href="/in/income-tax-calculator">Income Tax Calculator</a>.
    </div>

    <h2 id="fire-by-city">FIRE by City in India &mdash; Metro vs Tier-2 Targets</h2>
    <p>Your FIRE number varies dramatically based on which Indian city you plan to retire in. Here&rsquo;s a realistic breakdown of monthly expenses for a <strong>comfortable middle-class lifestyle</strong> (family of 3&ndash;4, rented accommodation, one car):</p>
    <table>
        <thead><tr><th>City</th><th>Monthly Expenses (2026)</th><th>At Age 45 (6% inflation, from age 28)</th><th>FIRE Number (29&times;)</th><th>Monthly SIP (12%)</th></tr></thead>
        <tbody>
            <tr><td><strong>Mumbai</strong></td><td>₹1,00,000</td><td>₹2,69,000</td><td><strong>₹9.37 Cr</strong></td><td>₹1,14,000</td></tr>
            <tr><td><strong>Bangalore</strong></td><td>₹80,000</td><td>₹2,15,000</td><td><strong>₹7.49 Cr</strong></td><td>₹91,200</td></tr>
            <tr><td><strong>Delhi NCR</strong></td><td>₹85,000</td><td>₹2,29,000</td><td><strong>₹7.96 Cr</strong></td><td>₹96,900</td></tr>
            <tr><td><strong>Hyderabad</strong></td><td>₹65,000</td><td>₹1,75,000</td><td><strong>₹6.09 Cr</strong></td><td>₹74,100</td></tr>
            <tr><td><strong>Pune</strong></td><td>₹60,000</td><td>₹1,61,000</td><td><strong>₹5.62 Cr</strong></td><td>₹68,400</td></tr>
            <tr><td><strong>Chennai</strong></td><td>₹65,000</td><td>₹1,75,000</td><td><strong>₹6.09 Cr</strong></td><td>₹74,100</td></tr>
            <tr><td><strong>Jaipur</strong></td><td>₹40,000</td><td>₹1,07,600</td><td><strong>₹3.74 Cr</strong></td><td>₹45,600</td></tr>
            <tr><td><strong>Chandigarh</strong></td><td>₹45,000</td><td>₹1,21,000</td><td><strong>₹4.21 Cr</strong></td><td>₹51,200</td></tr>
            <tr><td><strong>Kochi</strong></td><td>₹45,000</td><td>₹1,21,000</td><td><strong>₹4.21 Cr</strong></td><td>₹51,200</td></tr>
            <tr><td><strong>Coimbatore/Mysore</strong></td><td>₹35,000</td><td>₹94,100</td><td><strong>₹3.27 Cr</strong></td><td>₹39,800</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Geo-Arbitrage Strategy:</strong> One of the most powerful FIRE strategies is <strong>earning in a metro city and retiring in a Tier-2/3 city</strong>. A tech professional earning ₹30 LPA in Bangalore can save 60%+ and retire in Jaipur or Coimbatore where the FIRE number is <strong>50&ndash;65% lower</strong>. Owning a home in the retirement city further reduces costs &mdash; see our <a href="/in/home-loan-calculator">Home Loan Calculator</a> for EMI planning. Rental income from a metro property can also supplement your FIRE corpus &mdash; factor this into your calculations.
    </div>

    <h2 id="fire-by-age">FIRE Planning by Age &mdash; Actionable Checklist</h2>
    <table>
        <thead><tr><th>Age</th><th>Priority Actions</th><th>Savings Rate Target</th><th>Key Tools</th></tr></thead>
        <tbody>
            <tr><td><strong>22&ndash;25</strong></td><td>Build emergency fund (6 months), start <a href="/in/sip-calculator">SIP</a> (even ₹5,000/mo), open NPS for 80CCD(1B), get term insurance</td><td>20&ndash;30%</td><td>Compound Interest Calculator</td></tr>
            <tr><td><strong>25&ndash;30</strong></td><td>Increase SIP to 30&ndash;50% of income, maximize EPF, start PPF, clear any education loans, build CIBIL score</td><td>30&ndash;50%</td><td><a href="/in/sip-calculator">SIP Calculator</a>, <a href="/in/ppf-calculator">PPF Calculator</a></td></tr>
            <tr><td><strong>30&ndash;35</strong></td><td>Review HLV coverage, top-up health insurance (₹20L+), step-up SIP annually by 10&ndash;15%, consider home purchase vs rent</td><td>40&ndash;60%</td><td><a href="/in/hlv-calculator">HLV Calculator</a>, <a href="/in/home-loan-calculator">Home Loan Calculator</a></td></tr>
            <tr><td><strong>35&ndash;40</strong></td><td>Assess Coast FIRE status, build healthcare corpus separately, plan children&rsquo;s education corpus, increase NPS allocation</td><td>50&ndash;70%</td><td><a href="/in/pension-calculator">Pension Calculator</a></td></tr>
            <tr><td><strong>40&ndash;45</strong></td><td>Begin gradual equity → debt shift, set up Bucket 1 (3-year cash buffer), practice living on FIRE budget, Barista FIRE transition</td><td>50&ndash;70%</td><td><a href="/in/swp-calculator">SWP Calculator</a></td></tr>
            <tr><td><strong>45&ndash;50</strong></td><td>Finalize FIRE corpus, set up SWP, review annuity/NPS exit plan, ensure all insurance covers are active</td><td>Withdrawing</td><td><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></td></tr>
        </tbody>
    </table>

    <h2 id="fire-vs-traditional">FIRE vs Traditional Retirement &mdash; Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>🔥 FIRE (Retire at 40&ndash;45)</th><th>🏢 Traditional (Retire at 58&ndash;60)</th></tr></thead>
        <tbody>
            <tr><td><strong>Savings Rate</strong></td><td>50&ndash;70% of income</td><td>10&ndash;20% of income</td></tr>
            <tr><td><strong>Retirement Duration</strong></td><td>35&ndash;50 years</td><td>20&ndash;25 years</td></tr>
            <tr><td><strong>Required Corpus</strong></td><td>29&ndash;40&times; annual expenses</td><td>20&ndash;25&times; annual expenses</td></tr>
            <tr><td><strong>Primary Vehicle</strong></td><td>Equity MF SIP + NPS + PPF</td><td>EPF + PPF + FD</td></tr>
            <tr><td><strong>Healthcare Risk</strong></td><td>High (no employer insurance post-FIRE)</td><td>Lower (employer insurance till 58)</td></tr>
            <tr><td><strong>Social Security</strong></td><td>EPS ₹1,000&ndash;₹7,929/mo (at 58)</td><td>EPS pension + EPF lump sum (at 58)</td></tr>
            <tr><td><strong>Lifestyle Trade-off</strong></td><td>Frugal during accumulation, free after</td><td>Normal lifestyle, limited freedom</td></tr>
            <tr><td><strong>Risk Level</strong></td><td>Higher (longer horizon, no salary buffer)</td><td>Lower (pension + EPF + shorter horizon)</td></tr>
            <tr><td><strong>Best For</strong></td><td>High earners, disciplined savers, freedom seekers</td><td>Moderate earners, risk-averse, structured careers</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Hybrid Approach:</strong> You don&rsquo;t have to choose between FIRE and traditional retirement. Many Indian professionals pursue <strong>Barista FIRE at 40</strong> (leave corporate, do freelance/consulting) while their NPS and EPF continue growing for <strong>traditional pension at 58&ndash;60</strong>. This &ldquo;dual-track&rdquo; approach gives freedom now AND pension security later. Plan your retirement corpus with our <a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a>. Use the <a href="/in/pension-calculator">Pension Calculator</a> to see your NPS + EPS projections.
    </div>

    <h2 id="common-mistakes">8 Common FIRE Mistakes in India</h2>
    <ol>
        <li><strong>Using the US 4% rule blindly</strong> &mdash; India&rsquo;s higher inflation (6% vs 2%) and medical costs (10&ndash;14% inflation) require a more conservative 3&ndash;3.5% withdrawal rate. Using 4% can result in running out of money in your 60s.</li>
        <li><strong>Ignoring healthcare costs</strong> &mdash; Not building a separate healthcare corpus is the most dangerous FIRE mistake. A single cancer treatment can wipe out years of savings if you rely on your FIRE corpus. Budget ₹50&ndash;75 lakh separately.</li>
        <li><strong>Not accounting for parents&rsquo; expenses</strong> &mdash; Uniquely Indian: supporting aging parents can add ₹15,000&ndash;₹40,000/month to your FIRE expenses. Include this in your FIRE number and plan health insurance for parents separately.</li>
        <li><strong>Not starting early enough</strong> &mdash; Every year of delay costs exponentially due to compounding. Starting SIP at 25 vs 30 can mean ₹2&ndash;3 Crore difference in final corpus. Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator&rsquo;s Cost of Delay mode</a> to see the impact.</li>
        <li><strong>No emergency fund before FIRE</strong> &mdash; You need 12&ndash;18 months of expenses in liquid savings before pulling the FIRE trigger. This prevents you from withdrawing from your corpus during Market downturns or unexpected expenses.</li>
        <li><strong>Overlooking tax efficiency</strong> &mdash; Not using NPS (80CCD(1B) ₹50K extra), not harvesting LTCG within the ₹1.25 lakh annual exemption, and not planning <a href="/in/swp-calculator">SWP withdrawals</a> tax-efficiently can cost lakhs over a 30-year retirement.</li>
        <li><strong>Putting everything in equity</strong> &mdash; While equity drives FIRE growth, having 100% in equity at FIRE is dangerous. A 2008-style 60% crash could force you back to work. Use the bucket strategy with 3 years of cash in Bucket 1.</li>
        <li><strong>Lifestyle inflation after high salaries</strong> &mdash; As income grows, expenses tend to grow with it (&ldquo;lifestyle creep&rdquo;). Successful FIRE achievers keep expenses flat even as income doubles. Save the difference in <a href="/in/sip-calculator">step-up SIPs</a>.</li>
    </ol>

    <h2 id="how-to-calculate-excel">How to Calculate Your FIRE Number in Excel</h2>
    <div class="explanation__highlight">
        <strong>Step 1 &mdash; Future Monthly Expenses (inflation-adjusted):</strong><br/>
        =Monthly_Expenses * POWER(1 + Inflation%/100, Years_to_FIRE)<br/>
        Example: =50000 * POWER(1+6/100, 17) = <strong>₹1,34,590</strong>
    </div>
    <div class="explanation__highlight">
        <strong>Step 2 &mdash; FIRE Number (at chosen SWR):</strong><br/>
        =Future_Annual_Expenses * (100 / SWR%)<br/>
        Example: =1345900 * 12 * (100 / 3.5) = <strong>₹4.61 Crore</strong>
    </div>
    <div class="explanation__highlight">
        <strong>Step 3 &mdash; Monthly SIP to Reach FIRE Number:</strong><br/>
        =PMT(Return%/12/100, Years*12, 0, -FIRE_Number)<br/>
        Example: =PMT(12/12/100, 17*12, 0, -46100000) = <strong>₹56,200/month</strong>
    </div>

    <h2 id="related-tools">Related Calculators &amp; Tools</h2>
    <ul>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> &mdash; Calculate the monthly SIP needed to reach your FIRE number. Includes step-up SIP mode and lumpsum comparison.</li>
        <li><strong><a href="/in/swp-calculator">SWP Calculator</a></strong> &mdash; Plan post-FIRE withdrawals from mutual funds using the bucket strategy. India-adapted safe withdrawal rate finder.</li>
        <li><strong><a href="/in/pension-calculator">Pension Calculator</a></strong> &mdash; Model NPS corpus growth, EPS pension formula, and 80CCD tax benefits for dual-track FIRE + traditional retirement.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> &mdash; Calculate 15-year PPF maturity at 7.1% with tax-free EEE status. The safest component of your FIRE investment stack.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> &mdash; Model FD laddering for your Bucket 1 and Bucket 2 allocations. Compare rates across 12 banks.</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> &mdash; See the power of compounding that drives FIRE. Includes Cost of Delay mode showing impact of starting late.</li>
        <li><strong><a href="/in/crorepati-calculator">Crorepati Calculator</a></strong> &mdash; Track your path to ₹1 Crore, ₹5 Crore, ₹10 Crore milestones on your FIRE journey.</li>
        <li><strong><a href="/in/lumpsum-calculator">Lumpsum Calculator</a></strong> &mdash; Model one-time lump sum investments at the start of your FIRE journey or upon receiving bonuses/inheritances.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> &mdash; Plan tax-efficient FIRE withdrawals under old and new regimes. Check ₹7L tax-free limit under new regime.</li>
        <li><strong><a href="/in/hlv-calculator">HLV Calculator</a></strong> &mdash; Calculate adequate term insurance cover during your FIRE accumulation phase to protect your family.</li>
        <li><strong><a href="/in/home-loan-calculator">Home Loan Calculator</a></strong> &mdash; Plan home purchase as part of geo-arbitrage FIRE strategy. Owning a home eliminates rent from your FIRE budget.</li>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></strong> &mdash; Compare traditional retirement corpus vs FIRE corpus requirements side by side.</li>
        <li><strong><a href="/in/xirr-calculator">XIRR Calculator</a></strong> &mdash; Calculate your true investment return (XIRR) across all FIRE investments to verify if you&rsquo;re on track.</li>
    </ul>
`;

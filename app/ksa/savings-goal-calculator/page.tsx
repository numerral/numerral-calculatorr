// Standalone page — /ksa/savings-goal-calculator
// KSA Savings Goal Calculator with educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import KSACalculatorCore from "@/components/calculator/KSACalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Savings Goal Calculator (KSA) — حاسبة هدف الادخار",
    description: "Plan your savings in Saudi Arabia. Calculate how long to reach your goal or how much to save monthly. Covers Hajj, emergency fund, home, car, wedding goals with Sharia-compliant profit rates.",
    keywords: ["savings goal calculator Saudi Arabia", "حاسبة هدف الادخار", "KSA savings calculator", "Saudi savings plan", "Hajj savings calculator", "emergency fund Saudi", "Murabaha savings rate", "how to save money Saudi Arabia", "50/30/20 budget KSA", "Sah Sukuk savings"],
    alternates: { canonical: canonicalUrl("/ksa/savings-goal-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is a savings goal calculator?", answer: "A savings goal calculator helps you plan how to reach a specific financial target. You enter your goal amount, current savings, monthly contribution, and expected profit rate — and the calculator shows how long it will take, or how much you need to save per month. It uses compound interest formulas to account for profit earned on your balance over time." },
    { question: "How do I calculate how much to save monthly in Saudi Arabia?", answer: "Use the 'Monthly Needed' mode in our calculator. Enter your target amount (e.g., SAR 100,000 for a wedding), your current savings, timeframe (in months), and expected annual profit rate (e.g., 4% from a Murabaha deposit). The calculator will show exactly how much SAR you need to deposit each month to reach your goal on time." },
    { question: "What is the best savings rate in KSA banks (2025)?", answer: "As of 2025/2026, Murabaha deposit rates in Saudi banks range from approximately 3% to 5.14%, depending on the bank, deposit amount, and tenor. meem Digital Banking offers up to 5.14% on 90-day SAR deposits for larger amounts. Alinma Bank offers around 3%. Rates are influenced by SAMA's repo rate (currently 4.25%) which tracks the US Federal Reserve." },
    { question: "Is savings account profit Halal in Saudi Arabia?", answer: "Most Saudi banks offer Sharia-compliant savings products. Murabaha deposits involve the bank purchasing a commodity and selling it at an agreed profit margin — not charging interest. Mudarabah accounts invest in Sharia-compliant assets with profit-sharing. Wadiah accounts are safekeeping arrangements. These structures are approved by each bank's Sharia Board. The government's Sah Sukuk is also Sharia-compliant." },
    { question: "What is Murabaha savings?", answer: "Murabaha is a Sharia-compliant financing structure where the bank buys a commodity at a known price and sells it to the depositor at a predetermined higher price, with the difference being the profit. In savings, you deposit money with the bank, the bank invests via Murabaha transactions, and you receive a pre-agreed profit rate. It's the most common deposit product in Saudi banks like Al Rajhi, SNB, SAIB, and meem." },
    { question: "How much should I save for an emergency fund in KSA?", answer: "Financial advisors recommend 3 to 6 months of living expenses. For a typical Saudi household spending SAR 5,000–10,000/month, this means SAR 15,000–60,000. Saudi employees should note they have no income tax deductions but may face sudden expenses like medical bills, car repairs, or job transitions. Keep emergency funds in a liquid, Sharia-compliant savings account." },
    { question: "How much does Hajj cost for Saudi residents?", answer: "Hajj for residents of Saudi Arabia typically costs SAR 3,000 to SAR 12,000 depending on the package level. Economy packages (domestic pilgrim) are around SAR 3,000–5,000, while premium packages with better accommodation near the Haram can cost SAR 8,000–12,000 or more. Islamic scholars emphasize that Hajj should not be performed by going into debt." },
    { question: "What is the 50/30/20 budget rule for Saudi Arabia?", answer: "The 50/30/20 rule allocates: 50% of income to needs (rent, food, utilities, transport, Iqama fees), 30% to wants (dining out, entertainment, travel, shopping), and 20% to savings and debt repayment (emergency fund, Hajj savings, investments, Murabaha deposits). This works especially well in KSA because there is no personal income tax — your gross salary equals your take-home pay." },
    { question: "Does Saudi Arabia have income tax on savings?", answer: "No. Saudi Arabia does not impose personal income tax on individuals, including on savings income and investment profits. This applies to both Saudi nationals and expatriates. However, businesses pay Zakat (2.5% on net worth for Saudi-owned companies) and corporate income tax (20% for non-Saudi owned). This tax-free environment makes Saudi Arabia highly attractive for savings." },
    { question: "What is the Sah Sukuk savings product?", answer: "Sah (صح) is a government-backed, Sharia-compliant savings product launched in 2024 for individual investors in Saudi Arabia. It takes the form of sukuk (Islamic bonds) with a fixed yield set for each issue and a one-year saving period. Available through SNB Capital, AlJazira Capital, Alinma Investment, SAB Invest, and Al Rajhi Capital. It offers capital protection with competitive returns backed by the Saudi government." },
    { question: "How does compound profit work in Islamic banks?", answer: "In Islamic banks, 'compound profit' replaces 'compound interest.' The mechanism works similarly — profit earned in one period is added to the principal, and future profit is calculated on the new, larger balance. For example, SAR 10,000 at 4% annual Murabaha profit compounded monthly: after 1 year, you earn approximately SAR 407 (vs SAR 400 with simple profit). The Sharia compliance comes from the underlying transaction structure, not the compounding." },
    { question: "What is the SAMA repo rate and how does it affect savings?", answer: "SAMA's repo rate (currently 4.25% as of February 2026) is the interest rate at which banks borrow from the Saudi Central Bank. When SAMA raises the repo rate, banks can offer higher profit rates on deposits, benefiting savers. When it falls, deposit rates decrease. SAMA's rate closely follows the US Federal Reserve because the Saudi Riyal is pegged to the US Dollar at SAR 3.75 per USD." },
    { question: "Can I lose money in a Mudarabah savings account?", answer: "Theoretically, yes. In a Mudarabah arrangement, the bank (mudarib) manages the investment while the depositor provides capital. Profits are shared according to a pre-agreed ratio, but losses are borne by the capital provider (depositor). However, in practice, major Saudi banks rarely report losses on Mudarabah savings accounts. For capital-protected options, consider Wadiah accounts or the government-backed Sah Sukuk." },
    { question: "How much do I need for a home down payment in KSA?", answer: "Under SAMA regulations: first-time Saudi homebuyers need a minimum 10% down payment (90% LTV). For second homes, the minimum is 30%. Expatriates typically need 20–30%. For a home priced at SAR 1,000,000, this means SAR 100,000–300,000 as a down payment. Use our Home Loan Calculator for detailed mortgage planning and our savings calculator to build toward this goal." },
    { question: "What is Vision 2030's savings target for Saudi households?", answer: "The Financial Sector Development Program (FSDP) under Vision 2030 aims to increase the household savings rate from approximately 1.6% to 10% of total household income. It also targets raising adult financial literacy from 38% (2023) to 60%. Initiatives include the Financial Literacy Entity, mandatory financial education courses in schools (since 2023), SAMA's SAMACares program, and new savings products like Sah Sukuk." },
];

export default function SavingsGoalPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Savings Goal Calculator" },
        ]),
        webAppSchema("Savings Goal Calculator (KSA)", canonicalUrl("/ksa/savings-goal-calculator")),
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
            <Script id="schema-savings" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Savings Goal Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Savings Goal Calculator (KSA)</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Plan your savings in Saudi Arabia. Calculate how long to reach your financial goal or how much to save monthly. Supports Hajj, emergency fund, home, car, and wedding goals with Sharia-compliant profit rates.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <KSACalculatorCore calcType="savings" />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Saudi Arabia Savings FAQ" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Know your take-home pay to plan savings</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">GOSI deductions affect your disposable income</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">Plan your end-of-service lump sum</div>
                        </div>
                    </Link>
                    <Link href="/ksa/home-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏠</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Home Loan Calculator</div>
                            <div className="ksa-related-link__desc">Save for down payment, then calculate EMI</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-savings-goal">What Is a Savings Goal?</h2>
    <p>A <strong>savings goal (هدف الادخار)</strong> is a specific financial target you set to save a predetermined amount of money within a defined timeframe. Whether you're saving for <strong>Hajj</strong>, building an <strong>emergency fund</strong>, accumulating a <strong>home down payment</strong>, or planning a <strong>wedding</strong>, setting a clear savings goal transforms vague financial intentions into an actionable, measurable plan.</p>
    <p>In Saudi Arabia, the concept of structured savings is gaining significant momentum under <strong>Vision 2030's Financial Sector Development Program (FSDP)</strong>. The household savings rate in KSA currently stands at approximately <strong>1.6%</strong>, well below the global recommended minimum of <strong>10%</strong>. This calculator helps you join the growing movement of financially literate Saudi residents who plan, track, and achieve their savings goals.</p>
    <div class="explanation__highlight">
        <strong>Why Set Savings Goals?</strong><br/>
        • Provides <strong>clarity and motivation</strong> — you know exactly what you're saving for<br/>
        • Creates <strong>accountability</strong> — monthly targets keep you on track<br/>
        • Enables <strong>compound profit</strong> — money grows faster in Sharia-compliant deposits<br/>
        • Reduces <strong>financial stress</strong> — knowing you have a plan for major expenses
    </div>

    <h2 id="how-it-works">How the Savings Goal Calculator Works</h2>
    <p>Our calculator offers <strong>two modes</strong> tailored for different planning needs:</p>
    <ul>
        <li><strong>⏱️ Time to Goal:</strong> Enter your target amount, current savings, monthly contribution, and expected profit rate. The calculator tells you <strong>how many months</strong> it will take to reach your goal.</li>
        <li><strong>💰 Monthly Needed:</strong> Enter your target amount, current savings, timeframe, and profit rate. The calculator tells you <strong>how much SAR to save per month</strong> to hit your target on time.</li>
    </ul>

    <h3>The Compound Interest Formula</h3>
    <div class="explanation__highlight">
        <strong>Future Value with Regular Deposits:</strong><br/>
        FV = PV × (1 + r)ⁿ + PMT × [((1 + r)ⁿ − 1) / r]<br/><br/>
        <strong>Where:</strong><br/>
        • FV = Future Value (your savings goal)<br/>
        • PV = Present Value (current savings)<br/>
        • PMT = Regular payment (monthly contribution)<br/>
        • r = Periodic rate (annual rate ÷ compounding periods)<br/>
        • n = Total compounding periods
    </div>

    <h2 id="worked-examples">Worked Examples — KSA Savings Scenarios</h2>

    <h3>Example 1: Hajj Savings — SAR 8,000 in 18 Months</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Goal</td><td>Hajj pilgrimage</td></tr>
            <tr><td>Target</td><td>SAR 8,000</td></tr>
            <tr><td>Current Savings</td><td>SAR 1,000</td></tr>
            <tr><td>Remaining</td><td>SAR 7,000</td></tr>
            <tr><td>Profit Rate</td><td>4.0% (Murabaha deposit)</td></tr>
            <tr><td><strong>Monthly Needed</strong></td><td><strong>SAR 377</strong></td></tr>
            <tr><td>Total Contributions</td><td>SAR 6,786</td></tr>
            <tr><td>Profit Earned</td><td>SAR 214</td></tr>
        </tbody>
    </table>

    <h3>Example 2: Emergency Fund — SAR 30,000 with SAR 2,000/month</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Goal</td><td>Emergency fund (6 months expenses)</td></tr>
            <tr><td>Target</td><td>SAR 30,000</td></tr>
            <tr><td>Starting</td><td>SAR 0</td></tr>
            <tr><td>Monthly Deposit</td><td>SAR 2,000</td></tr>
            <tr><td>Profit Rate</td><td>3.5%</td></tr>
            <tr><td><strong>Time to Goal</strong></td><td><strong>15 months</strong></td></tr>
            <tr><td>Total Contributions</td><td>SAR 30,000</td></tr>
            <tr><td>Profit Earned</td><td>SAR 546</td></tr>
        </tbody>
    </table>

    <h3>Example 3: Home Down Payment — SAR 150,000 Save Over 5 Years</h3>
    <table>
        <thead><tr><th>Detail</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Goal</td><td>10% down payment on SAR 1.5M home</td></tr>
            <tr><td>Target</td><td>SAR 150,000</td></tr>
            <tr><td>Starting</td><td>SAR 20,000</td></tr>
            <tr><td>Timeframe</td><td>60 months (5 years)</td></tr>
            <tr><td>Profit Rate</td><td>4.5% (Murabaha)</td></tr>
            <tr><td><strong>Monthly Needed</strong></td><td><strong>SAR 1,967</strong></td></tr>
            <tr><td>Total Contributions</td><td>SAR 118,020</td></tr>
            <tr><td>Profit Earned</td><td>SAR 11,980</td></tr>
        </tbody>
    </table>
    <p>After saving your down payment, use our <a href="/ksa/home-loan-calculator">Home Loan Calculator</a> to plan your mortgage — including Sharia-compliant Murabaha, Ijara, and Musharaka financing options.</p>

    <h2 id="sharia-savings">Sharia-Compliant Savings in Saudi Arabia</h2>
    <p>Saudi Arabia is one of the world's largest Islamic finance markets. Most banks offer exclusively <strong>Sharia-compliant</strong> savings products, eliminating conventional interest (Riba) in favor of structured alternatives:</p>

    <h3>Murabaha Deposits (المرابحة)</h3>
    <p>The most common savings product in KSA. The bank purchases a commodity and sells it to the depositor at an agreed profit margin. You receive a <strong>pre-determined profit rate</strong> on your deposit. Available at Al Rajhi, SNB, SAIB, meem, and virtually all Saudi banks.</p>

    <h3>Mudarabah Accounts (المضاربة)</h3>
    <p>You provide capital, the bank invests in <strong>Sharia-compliant assets</strong>, and profits are shared according to a pre-agreed ratio. Unlike Murabaha, the profit rate is <strong>not guaranteed</strong> — actual returns depend on investment performance. Capital is theoretically at risk, though major banks rarely report losses. Available at Emirates NBD KSA, SAB, and Riyad Bank.</p>

    <h3>Wadiah Accounts (الوديعة)</h3>
    <p>A <strong>safekeeping</strong> arrangement where the bank acts as custodian. The bank may invest your funds but <strong>guarantees return of your capital</strong> on demand. No fixed profit is promised, but the bank may offer a discretionary gift (<strong>Hiba — هبة</strong>). Best for ultra-conservative savers who prioritize capital protection.</p>

    <h3>Sah Sukuk (صح — Government-Backed Savings)</h3>
    <p>Launched in 2024, <strong>Sah</strong> is a government-backed, Sharia-compliant savings product in the form of <strong>sukuk (Islamic bonds)</strong>. Features include:</p>
    <ul>
        <li>Fixed yield set for each issue — <strong>known profit at purchase</strong></li>
        <li><strong>1-year saving period</strong></li>
        <li>Backed by the Saudi government — <strong>extremely low risk</strong></li>
        <li>Available through SNB Capital, AlJazira Capital, Alinma Investment, SAB Invest, Al Rajhi Capital</li>
    </ul>

    <table>
        <thead><tr><th>Product</th><th>Profit Type</th><th>Capital Guaranteed?</th><th>Risk Level</th></tr></thead>
        <tbody>
            <tr><td><strong>Murabaha</strong></td><td>Pre-determined</td><td>✅ Yes</td><td>Very Low</td></tr>
            <tr><td><strong>Mudarabah</strong></td><td>Variable (profit-sharing)</td><td>❌ No (theoretically)</td><td>Low–Medium</td></tr>
            <tr><td><strong>Wadiah</strong></td><td>Discretionary gift (Hiba)</td><td>✅ Yes</td><td>Lowest</td></tr>
            <tr><td><strong>Sah Sukuk</strong></td><td>Fixed (per issue)</td><td>✅ Yes (govt-backed)</td><td>Lowest</td></tr>
        </tbody>
    </table>

    <h2 id="bank-rates">Saudi Bank Savings Rates (2025/2026)</h2>
    <p>Savings profit rates in Saudi Arabia are influenced by SAMA's policy rates, which track the US Federal Reserve due to the SAR-USD peg. As of February 2026, the SAMA repo rate is <strong>4.25%</strong>.</p>
    <table>
        <thead><tr><th>Bank</th><th>Product</th><th>Type</th><th>Indicative Rate</th></tr></thead>
        <tbody>
            <tr><td><strong>meem</strong></td><td>Murabaha Deposit (90-day)</td><td>Sharia</td><td>Up to 5.14%</td></tr>
            <tr><td><strong>Al Rajhi</strong></td><td>Savings Account</td><td>Sharia</td><td>Variable</td></tr>
            <tr><td><strong>Riyad Bank</strong></td><td>Savings (Mudarabah)</td><td>Sharia</td><td>Competitive</td></tr>
            <tr><td><strong>SNB (AlAhli)</strong></td><td>Khayrat / Murabaha</td><td>Sharia</td><td>Variable</td></tr>
            <tr><td><strong>SAB</strong></td><td>Wafer Account (Mudarabah)</td><td>Sharia</td><td>Competitive</td></tr>
            <tr><td><strong>Alinma</strong></td><td>Savings Account</td><td>Sharia</td><td>~3.0%</td></tr>
            <tr><td><strong>SAIB</strong></td><td>Murabaha Deposit</td><td>Sharia</td><td>Variable</td></tr>
            <tr><td><strong>Sah Sukuk</strong></td><td>Government Sukuk</td><td>Sukuk</td><td>Fixed per issue</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Important:</strong> Rates are indicative and subject to change. Always verify current rates directly with your bank. Rates vary by deposit amount, tenor, and account type.
    </div>

    <h2 id="budget-rule">The 50/30/20 Budget Rule for Saudi Arabia</h2>
    <p>The <strong>50/30/20 rule</strong> is a simple framework for allocating your income. It works particularly well in Saudi Arabia because there is <strong>no personal income tax</strong> — your net salary equals your gross salary (minus GOSI for Saudis). Use our <a href="/ksa/salary-calculator">Salary Calculator</a> to find your actual take-home pay.</p>
    <table>
        <thead><tr><th>Category</th><th>% of Income</th><th>Monthly (SAR 10,000 salary)</th><th>KSA Examples</th></tr></thead>
        <tbody>
            <tr><td><strong>Needs</strong></td><td>50%</td><td>SAR 5,000</td><td>Rent, food, utilities, transport, Iqama/dependent fees</td></tr>
            <tr><td><strong>Wants</strong></td><td>30%</td><td>SAR 3,000</td><td>Dining out, entertainment, travel, shopping, subscriptions</td></tr>
            <tr><td><strong>Savings & Debt</strong></td><td>20%</td><td>SAR 2,000</td><td>Emergency fund, Hajj/Umrah, investments, Murabaha, loan repayment</td></tr>
        </tbody>
    </table>
    <p><strong>Pro tip:</strong> Since Saudi Arabia has <strong>zero income tax</strong>, the 20% savings allocation goes entirely to building wealth — unlike countries where taxes consume a significant portion. This is a unique advantage for residents in the Kingdom.</p>

    <h2 id="vision-2030">Vision 2030 & Savings Culture in KSA</h2>
    <p>Saudi Arabia's <strong>Vision 2030</strong> has placed savings culture at the heart of economic reform through the <strong>Financial Sector Development Program (FSDP)</strong>.</p>
    <table>
        <thead><tr><th>Metric</th><th>Baseline</th><th>Target</th><th>Current</th></tr></thead>
        <tbody>
            <tr><td><strong>Household Savings Rate</strong></td><td>2.4% (2013)</td><td>10% of income</td><td>~1.6%</td></tr>
            <tr><td><strong>Adult Financial Literacy</strong></td><td>30% (2021)</td><td>60%</td><td>38% (2023)</td></tr>
            <tr><td><strong>School Financial Education</strong></td><td>None</td><td>Mandatory</td><td>Since Autumn 2023</td></tr>
            <tr><td><strong>Gross Savings (% GDP)</strong></td><td>—</td><td>—</td><td>33.65% (2024)</td></tr>
        </tbody>
    </table>
    <p>Key initiatives include: SAMA's <strong>SAMACares</strong> financial awareness program, the establishment of a <strong>Financial Literacy Entity (FLE)</strong>, mandatory <strong>Financial Knowledge courses</strong> in schools, and the launch of government-backed savings products like <strong>Sah Sukuk</strong>.</p>

    <h2 id="emergency-fund">Emergency Fund Guide for KSA</h2>
    <p>An <strong>emergency fund (صندوق الطوارئ)</strong> is your first priority before any other savings goal. It covers unexpected expenses without going into debt.</p>
    <div class="explanation__highlight">
        <strong>How Much?</strong> 3–6 months of essential living expenses<br/>
        <strong>For SAR 5,000/month expenses:</strong> SAR 15,000–30,000<br/>
        <strong>For SAR 10,000/month expenses:</strong> SAR 30,000–60,000<br/>
        <strong>Where to Keep:</strong> Liquid Sharia-compliant savings account (Murabaha or Wadiah)
    </div>
    <p>Key considerations for KSA residents:</p>
    <ul>
        <li><strong>Medical emergencies</strong> — despite government healthcare, private treatment can be expensive</li>
        <li><strong>Job transitions</strong> — especially important for expats whose Iqama is tied to employment</li>
        <li><strong>Car repairs and maintenance</strong> — essential in most Saudi cities</li>
        <li><strong>Saudi employees:</strong> Your <a href="/ksa/gosi-calculator">GOSI contributions</a> provide some safety net, but an emergency fund is still essential</li>
        <li><strong>Ending service?</strong> Your <a href="/ksa/end-of-service-calculator">EOSB lump sum</a> can be directed into a Murabaha deposit</li>
    </ul>

    <h2 id="hajj-savings">Hajj & Umrah Savings Plans</h2>
    <p><strong>Hajj (الحج)</strong> is a mandatory religious obligation for all financially and physically capable Muslims at least once in a lifetime. Islamic scholars stress that Hajj should <strong>not be performed by taking on debt</strong> — this makes a savings plan essential.</p>
    <table>
        <thead><tr><th>Package Type</th><th>Cost (SAR)</th><th>Includes</th></tr></thead>
        <tbody>
            <tr><td><strong>Economy (Domestic)</strong></td><td>3,000–5,000</td><td>Basic tent in Mina, shared transport</td></tr>
            <tr><td><strong>Standard</strong></td><td>5,000–8,000</td><td>Better accommodation, organized group</td></tr>
            <tr><td><strong>Premium</strong></td><td>8,000–12,000+</td><td>Hotel near Haram, private transport, premium tents</td></tr>
        </tbody>
    </table>
    <p><strong>Umrah</strong> is a non-obligatory pilgrimage that can be performed at any time. Typical costs for residents range from <strong>SAR 2,000–8,000</strong> depending on accommodation and timing (Ramadan Umrah is the most expensive).</p>
    <div class="explanation__highlight">
        <strong>Savings Strategy for Hajj:</strong> Set aside SAR 300–600/month for 12–24 months in a Murabaha savings account. The profit earned helps offset rising package costs.
    </div>

    <h2 id="tips-save-more">Tips to Save More in Saudi Arabia</h2>
    <ol>
        <li><strong>Automate your savings</strong> — Set up automatic transfers to your Murabaha deposit on payday via your bank app</li>
        <li><strong>Take advantage of zero income tax</strong> — Unlike most countries, your entire salary is available for spending and saving</li>
        <li><strong>Use the GOSI advantage</strong> — Saudi employees already have 9.75% going to social insurance (<a href="/ksa/gosi-calculator">GOSI Calculator</a>). Budget your remaining income accordingly</li>
        <li><strong>Maximize overtime income</strong> — Any <a href="/ksa/overtime-calculator">overtime pay</a> at 150% is pure savings potential</li>
        <li><strong>Encash unused leave</strong> — When leaving a job, your <a href="/ksa/annual-leave-calculator">accrued leave pay</a> can go directly into savings</li>
        <li><strong>Direct your EOSB to savings</strong> — Your <a href="/ksa/end-of-service-calculator">End of Service Benefit</a> is a lump sum that should be invested in Murabaha or Sah Sukuk</li>
        <li><strong>Track VAT spending</strong> — 15% <a href="/ksa/vat-calculator">VAT</a> adds up. Budget for it explicitly</li>
        <li><strong>Compare bank rates regularly</strong> — Move your deposits to banks offering the best Murabaha rates</li>
        <li><strong>Start with an emergency fund</strong> — Before saving for wants, build your 3–6 month safety net</li>
        <li><strong>Use this calculator monthly</strong> — Track progress, adjust contributions, stay motivated</li>
    </ol>

    <h2 id="sama-impact">How SAMA Interest Rates Affect Your Savings</h2>
    <p>The <strong>Saudi Central Bank (SAMA — البنك المركزي السعودي)</strong> sets the repo rate and reverse repo rate, which directly influence the profit rates offered by commercial banks on savings products.</p>
    <table>
        <thead><tr><th>Date</th><th>Repo Rate</th><th>Reverse Repo</th><th>Impact on Savings</th></tr></thead>
        <tbody>
            <tr><td>Sep 2025</td><td>4.75%</td><td>4.25%</td><td>Following US Fed 25bps cut</td></tr>
            <tr><td>Oct 2025</td><td>4.50%</td><td>—</td><td>Additional easing</td></tr>
            <tr><td>Dec 2025</td><td>4.25%</td><td>3.75%</td><td>Lowest in 3+ years</td></tr>
            <tr><td><strong>Feb 2026</strong></td><td><strong>4.25%</strong></td><td><strong>3.75%</strong></td><td><strong>Current — savings rates may decrease</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Key Insight:</strong> The SAR is pegged to the USD at SAR 3.75, so SAMA follows US Federal Reserve rate changes. When the Fed cuts rates, SAMA follows, and bank deposit rates decrease. <strong>Lock in current rates with longer-tenor Murabaha deposits</strong> if you expect further cuts.
    </div>

    <h2 id="eosb-savings">Turn Your EOSB Into a Savings Launchpad</h2>
    <p>When leaving a Saudi employer, your <strong>End of Service Benefit (EOSB)</strong> can be a significant lump sum — use our <a href="/ksa/end-of-service-calculator">EOSB Calculator</a> to estimate it. Instead of spending it all, consider:</p>
    <ul>
        <li><strong>SAR 15,000–30,000</strong> → Emergency fund (if you don't have one)</li>
        <li><strong>Remaining amount</strong> → Murabaha deposit or Sah Sukuk for next goal</li>
        <li><strong>If buying a car:</strong> Use as down payment, check financing with our <a href="/ksa/car-loan-calculator">Car Loan Calculator</a></li>
        <li><strong>If buying a home:</strong> Boost your down payment fund, then use our <a href="/ksa/home-loan-calculator">Home Loan Calculator</a></li>
    </ul>
`;

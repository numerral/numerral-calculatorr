// Standalone page — /ksa/zakat-calculator
// KSA Zakat Calculator with comprehensive educational content

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import ZakatCalculatorCore from "@/components/calculator/ZakatCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Zakat Calculator (KSA) — حاسبة الزكاة السعودية (2025/2026)",
    description: "Calculate your Zakat on gold, silver, cash, stocks, investments, and business assets in SAR. Covers Nisab thresholds, ZATCA regulations, Tadawul stocks, real estate rental income, and Saudi-specific Zakat rules.",
    keywords: ["Zakat calculator Saudi Arabia", "حاسبة الزكاة", "zakat calculator KSA", "nisab in SAR", "zakat on gold Saudi", "ZATCA zakat", "zakat on stocks Tadawul", "zakat on savings", "how to calculate zakat", "zakat al-mal calculator", "Islamic finance Saudi Arabia", "zakat 2025 2026"],
    alternates: { canonical: canonicalUrl("/ksa/zakat-calculator") },
};

const FAQ_ITEMS = [
    { question: "What is Zakat and is it mandatory in Saudi Arabia?", answer: "Zakat (الزكاة) is one of the Five Pillars of Islam — a mandatory act of worship requiring eligible Muslims to give 2.5% of their qualifying wealth annually to those in need. In Saudi Arabia, Zakat is a religious obligation for all Muslims. For individuals, it is self-calculated. For businesses owned by Saudi or GCC nationals, ZATCA (Zakat, Tax and Customs Authority) enforces collection. 100% foreign-owned businesses pay corporate income tax instead." },
    { question: "What is the Nisab and how is it calculated in SAR?", answer: "Nisab (النصاب) is the minimum wealth threshold that triggers the Zakat obligation. It equals either 85 grams of pure gold or 612.36 grams of silver. In SAR, this fluctuates with market prices — approximately SAR 26,350 (gold standard) or SAR 2,327 (silver standard) as of 2025/2026. Most scholars recommend using the silver standard as the lower threshold ensures more people fulfill their obligation." },
    { question: "How is Zakat calculated?", answer: "Zakat is calculated in 4 steps: (1) Total all your zakatable assets — gold, silver, cash, savings, investments, business assets, rental income saved, and loans owed to you. (2) Subtract deductible liabilities — debts due within 12 months, installments, overdue payments. (3) Check if your net wealth meets or exceeds the Nisab threshold. (4) If eligible, pay 2.5% of your net zakatable wealth. The wealth must have been in your possession for one full lunar year (Hawl)." },
    { question: "Is Zakat due on gold jewelry worn for personal adornment?", answer: "This is a matter of scholarly difference. The Hanafi school holds that Zakat is due on all gold and silver, including jewelry worn regularly. The Shafi'i and Hanbali schools generally exempt gold jewelry that is worn regularly for personal adornment (not saved or invested). In KSA, the most common position follows the Hanbali school — personal jewelry regularly worn may be exempt. Investment gold, stored gold, or gold not regularly worn is always subject to Zakat." },
    { question: "How do I calculate Zakat on Tadawul stocks?", answer: "It depends on your intention: (1) Short-term trading — pay 2.5% on the full market value of your shares on your Zakat due date. (2) Long-term investment (held for dividends) — calculate 2.5% of your proportional share of the company's zakatable assets (cash + receivables + inventory). A simplified method: take 25-30% of the market value and pay 2.5% on that amount. Use the closing price on the Saudi Exchange (Tadawul) on your Zakat date." },
    { question: "Is Zakat due on rental income from Saudi property?", answer: "Zakat is not due on the rental property itself — only on the accumulated rental income that remains in your possession on your Zakat due date. This rental income is combined with your other zakatable assets. However, if you purchased property with the intention of reselling it for profit, Zakat is due on the full current market value of the property (treated as trading stock). Your primary residence is always exempt." },
    { question: "What debts can be deducted when calculating Zakat?", answer: "You can deduct: (1) Debts payable within the next 12 months, (2) Up to 12 months of installments on longer-term debts (mortgages, car loans), (3) Overdue payments and arrears. You cannot deduct: expenses not yet due, debts not payable within 12 months, or interest (riba) payments — since riba is haram, interest cannot reduce your Zakat liability." },
    { question: "When should I pay Zakat? What is the Hawl?", answer: "Zakat is due once per lunar (Hijri) year. The Hawl (الحول) is the Islamic date on which your wealth first met or exceeded the Nisab threshold — for example, the day you received your first substantial paycheck. You should pay Zakat on the same Islamic date each year. Many Muslims choose to pay during Ramadan for the additional rewards, but the obligation begins from your personal Hawl date." },
    { question: "What is the difference between Zakat al-Mal and Zakat al-Fitr?", answer: "Zakat al-Mal (زكاة المال) is the annual wealth tax of 2.5% on qualifying assets — this is what our calculator computes. Zakat al-Fitr (زكاة الفطر) is a separate, smaller obligatory charity paid at the end of Ramadan before Eid al-Fitr prayer. It is approximately SAR 25-30 per person (including dependents) in Saudi Arabia and is meant to purify the fast and help the needy celebrate Eid." },
    { question: "Does ZATCA collect Zakat from individuals?", answer: "No. ZATCA (هيئة الزكاة والضريبة والجمارك) collects Zakat from businesses and corporate entities owned by Saudi or GCC nationals. For individuals, Zakat is a personal religious obligation — you calculate and distribute it yourself. ZATCA does offer the ZAKATY calculator app to help individuals calculate their Zakat, and allows voluntary payment through the ZAKATY platform." },
    { question: "Is Zakat applicable on cryptocurrency in Saudi Arabia?", answer: "Yes. While ZATCA has not issued specific cryptocurrency Zakat regulations, Islamic scholars generally agree that cryptocurrency held as an investment or for trading is subject to Zakat. You should calculate the SAR value of your crypto holdings on your Zakat due date and include it in your total zakatable assets. If held for trading, 2.5% of the market value is due." },
    { question: "How is corporate Zakat calculated for businesses in KSA?", answer: "ZATCA calculates corporate Zakat at 2.5% of the Zakat base. The Zakat base equals: share capital + retained earnings + cash + receivables + inventory − deductible liabilities. For mixed Saudi/foreign ownership, only the Saudi/GCC portion pays Zakat; the foreign portion pays 20% corporate income tax. Businesses must file Zakat returns within 120 days of fiscal year-end with audited financial statements." },
];

export default function ZakatCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: `${SITE_URL}/ksa` },
            { name: "Zakat Calculator" },
        ]),
        webAppSchema("Zakat Calculator (KSA — حاسبة الزكاة)", canonicalUrl("/ksa/zakat-calculator")),
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
            <Script id="schema-zakat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators", href: "/ksa" },
                { label: "Zakat Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Zakat Calculator (KSA) — حاسبة الزكاة</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate your Zakat on gold, silver, cash, savings, stocks, business assets, and real estate. Based on Islamic jurisprudence and ZATCA Saudi Arabia guidelines.
            </p>
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <ZakatCalculatorCore />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <section className="ksa-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Zakat Calculator FAQ — Saudi Arabia" items={FAQ_ITEMS} />

            <section className="ksa-related">
                <h3>Related KSA Calculators</h3>
                <div className="ksa-related-links">
                    <Link href="/ksa/salary-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">💰</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Salary Calculator</div>
                            <div className="ksa-related-link__desc">Net salary → savings → Zakat base</div>
                        </div>
                    </Link>
                    <Link href="/ksa/savings-goal-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🎯</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Savings Goal Calculator</div>
                            <div className="ksa-related-link__desc">Plan savings while accounting for Zakat</div>
                        </div>
                    </Link>
                    <Link href="/ksa/gosi-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏛️</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">GOSI Calculator</div>
                            <div className="ksa-related-link__desc">Social insurance deductions from salary</div>
                        </div>
                    </Link>
                    <Link href="/ksa/end-of-service-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏢</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">EOSB Calculator</div>
                            <div className="ksa-related-link__desc">EOSB is zakatable if held for a Hawl</div>
                        </div>
                    </Link>
                    <Link href="/ksa/home-loan-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🏠</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">Home Loan Calculator</div>
                            <div className="ksa-related-link__desc">Mortgage installments may reduce Zakat</div>
                        </div>
                    </Link>
                    <Link href="/ksa/vat-calculator" className="ksa-related-link">
                        <span className="ksa-related-link__icon">🧾</span>
                        <div className="ksa-related-link__text">
                            <div className="ksa-related-link__title">VAT Calculator</div>
                            <div className="ksa-related-link__desc">VAT is separate from Zakat in KSA</div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-zakat">What Is Zakat? (الزكاة)</h2>
    <p><strong>Zakat (الزكاة)</strong> is the third pillar of Islam — a mandatory annual act of worship through which eligible Muslims purify their wealth by giving <strong>2.5%</strong> of their qualifying assets to those in need. The word "Zakat" literally means <strong>purification</strong> and <strong>growth</strong>, reflecting the Islamic belief that sharing wealth purifies the soul and increases blessings (<em>barakah</em>).</p>
    <p>In Saudi Arabia, Zakat holds a unique dual role. For <strong>individuals</strong>, it remains a personal religious obligation — you calculate and pay it yourself. For <strong>businesses</strong> owned by Saudi or GCC nationals, the <strong>Zakat, Tax and Customs Authority (ZATCA — هيئة الزكاة والضريبة والجمارك)</strong> enforces collection as a state-mandated obligation.</p>
    <div class="explanation__highlight">
        <strong>Key Fact:</strong> Saudi Arabia is one of the only countries in the world where Zakat is collected from businesses by the state through ZATCA. This applies to all entities with Saudi/GCC ownership — making it both a religious and legal obligation.
    </div>
    <p>The eight categories of Zakat recipients are defined in the Quran (Surah At-Tawbah 9:60): the poor (<em>al-fuqara</em>), the needy (<em>al-masakin</em>), Zakat administrators, those whose hearts need reconciliation, freeing captives, debtors, in the cause of Allah, and travelers in need.</p>

    <h2 id="nisab">Understanding Nisab — The Minimum Threshold (النصاب)</h2>
    <p>Zakat only becomes obligatory when your wealth reaches or exceeds the <strong>Nisab</strong> (النصاب) — the minimum threshold. There are two standards:</p>
    <table>
        <thead><tr><th>Standard</th><th>Weight</th><th>Approximate SAR Value (2025)</th><th>Use Case</th></tr></thead>
        <tbody>
            <tr><td><strong>Gold Nisab</strong></td><td>85 grams of pure gold (24K)</td><td>SAR ~26,350</td><td>Higher threshold — fewer people qualify</td></tr>
            <tr><td><strong>Silver Nisab</strong></td><td>612.36 grams of pure silver</td><td>SAR ~2,327</td><td>Lower threshold — more people qualify (recommended)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Which standard should I use?</strong> Most scholars recommend using the <strong>silver standard</strong> because it has a lower monetary threshold, meaning more people become eligible to pay Zakat. This benefits the poor and is the more cautious (<em>ahwat</em>) position. However, if you only own gold, use the gold Nisab for that specific assessment.
    </div>
    <p>The SAR value of Nisab fluctuates daily with commodity prices. Always check <strong>current gold and silver prices</strong> on your Zakat due date.</p>

    <h2 id="step-by-step">How to Calculate Zakat — Step-by-Step Guide</h2>
    <p>Calculating Zakat is straightforward when broken into steps:</p>
    <div class="explanation__highlight">
        <strong>Step 1:</strong> List all your zakatable assets — gold, silver, cash, savings, investments, business inventory, rental income saved, and money owed to you.<br/>
        <strong>Step 2:</strong> Total the SAR value of all assets.<br/>
        <strong>Step 3:</strong> Subtract deductible liabilities — debts due within 12 months, installments, and arrears.<br/>
        <strong>Step 4:</strong> Calculate your <strong>Net Zakatable Wealth</strong> = Total Assets − Liabilities.<br/>
        <strong>Step 5:</strong> Compare to the Nisab. If your net wealth ≥ Nisab, Zakat is due.<br/>
        <strong>Step 6:</strong> <strong>Zakat = Net Zakatable Wealth × 2.5%</strong> (or ÷ 40).
    </div>

    <h3>Worked Example (SAR)</h3>
    <table>
        <thead><tr><th>Asset / Liability</th><th>Amount (SAR)</th></tr></thead>
        <tbody>
            <tr><td>Savings Account</td><td>85,000</td></tr>
            <tr><td>Gold Jewelry (21K, 120g)</td><td>32,550</td></tr>
            <tr><td>Tadawul Stocks</td><td>45,000</td></tr>
            <tr><td>Cash on Hand</td><td>5,000</td></tr>
            <tr><td><strong>Total Assets</strong></td><td><strong>167,550</strong></td></tr>
            <tr><td>Car Loan Installments (12 months)</td><td>−24,000</td></tr>
            <tr><td>Credit Card Balance</td><td>−3,500</td></tr>
            <tr><td><strong>Total Liabilities</strong></td><td><strong>−27,500</strong></td></tr>
            <tr><td><strong>Net Zakatable Wealth</strong></td><td><strong>140,050</strong></td></tr>
            <tr><td>Nisab (Silver Standard)</td><td>2,327</td></tr>
            <tr><td>✅ Eligible</td><td>Yes</td></tr>
            <tr><td><strong>Zakat Due (2.5%)</strong></td><td><strong>SAR 3,501.25</strong></td></tr>
        </tbody>
    </table>

    <h2 id="zakat-gold-silver">Zakat on Gold & Silver in Saudi Arabia</h2>
    <p>Gold holds deep cultural significance in Saudi Arabia. Whether it is <em>mahr</em> (مهر) wedding jewelry, souq purchases, or investment bullion — understanding Zakat on gold is essential for every Muslim in the Kingdom.</p>
    <h3>Gold Carat Conversion</h3>
    <p>Saudi gold markets commonly sell in <strong>21 karat</strong> (the most popular in KSA), 22K, and 18K. Since Zakat is based on <strong>pure gold content</strong>, you must convert to 24K equivalent:</p>
    <table>
        <thead><tr><th>Carat</th><th>Purity</th><th>Multiplier</th><th>100g Actual = Pure Gold</th></tr></thead>
        <tbody>
            <tr><td><strong>24K</strong></td><td>99.9%</td><td>1.000</td><td>100.0g</td></tr>
            <tr><td><strong>22K</strong></td><td>91.7%</td><td>0.917</td><td>91.7g</td></tr>
            <tr><td><strong>21K</strong> (KSA Standard)</td><td>87.5%</td><td>0.875</td><td>87.5g</td></tr>
            <tr><td><strong>18K</strong></td><td>75.0%</td><td>0.750</td><td>75.0g</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Formula:</strong> Pure Gold (g) = Total Weight (g) × (Carat ÷ 24)<br/>
        <strong>Example:</strong> 120g of 21K gold = 120 × (21 ÷ 24) = <strong>105g pure gold</strong>
    </div>

    <h3>Scholarly Positions on Jewelry</h3>
    <ul>
        <li><strong>Hanafi School:</strong> Zakat is due on <em>all</em> gold and silver, including jewelry worn daily — no exemption for personal adornment.</li>
        <li><strong>Hanbali School (dominant in KSA):</strong> Gold jewelry worn <em>regularly</em> for personal adornment may be exempt. Investment gold, stored gold, or jewelry rarely worn <em>is</em> subject to Zakat.</li>
        <li><strong>Mixed pieces:</strong> Only the gold or silver content is subject to Zakat. Gemstones, pearls, and non-precious metals are excluded — subtract their weight.</li>
    </ul>

    <h2 id="zakat-cash">Zakat on Cash, Savings & Bank Deposits</h2>
    <p>Cash is the most straightforward zakatable asset. Include all SAR-denominated and foreign-currency holdings:</p>
    <ul>
        <li><strong>Cash on hand</strong> — physical SAR notes and coins</li>
        <li><strong>Bank savings accounts</strong> — all Saudi banks (Al Rajhi, SNB, SABB, Riyad Bank, etc.)</li>
        <li><strong>Current / checking accounts</strong> — business or personal</li>
        <li><strong>Foreign currency</strong> — convert to SAR at the spot rate on your Zakat date</li>
        <li><strong>Hajj / Umrah savings</strong> — money set aside for pilgrimage is still zakatable</li>
        <li><strong>Fixed deposits</strong> — even if locked, the principal is zakatable (interest is excluded as riba)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Important:</strong> Interest earned on bank deposits is considered <em>riba</em> (usury) in Islam. You should not include interest income as part of your zakatable wealth. Instead, consult a scholar about disposing of interest earnings through charity (without expecting reward).
    </div>

    <h2 id="zakat-stocks">Zakat on Stocks & Investments (Tadawul)</h2>
    <p>The method for calculating Zakat on stocks depends on your <strong>intention</strong>:</p>
    <table>
        <thead><tr><th>Holding Type</th><th>Zakat Method</th><th>Example (SAR 100,000 portfolio)</th></tr></thead>
        <tbody>
            <tr><td><strong>Short-Term Trading</strong></td><td>2.5% of full market value</td><td>SAR 100,000 × 2.5% = <strong>SAR 2,500</strong></td></tr>
            <tr><td><strong>Long-Term (Dividends)</strong></td><td>2.5% of zakatable portion (~25-30%)</td><td>SAR 100,000 × 30% × 2.5% = <strong>SAR 750</strong></td></tr>
            <tr><td><strong>Mixed Intent</strong></td><td>Use full market value (cautious approach)</td><td>SAR 100,000 × 2.5% = <strong>SAR 2,500</strong></td></tr>
        </tbody>
    </table>
    <p>For <strong>Tadawul</strong> stocks, use the closing price on the Saudi Exchange on your Zakat due date. This includes:</p>
    <ul>
        <li>Saudi Aramco (2222) shares</li>
        <li>Al Rajhi Bank, SABIC, STC, and all listed equities</li>
        <li><strong>Mutual Funds / ETFs</strong> — use the Net Asset Value (NAV) on your Zakat date</li>
        <li><strong>Sukuk</strong> (Islamic bonds) — the face value or market value is zakatable</li>
    </ul>

    <h2 id="zakat-real-estate">Zakat on Real Estate & Rental Income in Saudi Arabia</h2>
    <p>With Saudi Arabia's booming real estate market under <strong>Vision 2030</strong>, understanding Zakat on property is crucial:</p>
    <table>
        <thead><tr><th>Property Type</th><th>Zakat Rule</th></tr></thead>
        <tbody>
            <tr><td><strong>Primary Residence</strong></td><td>❌ Exempt — never subject to Zakat</td></tr>
            <tr><td><strong>Rental Property</strong></td><td>Zakat on <em>accumulated rental income</em> only (not property value)</td></tr>
            <tr><td><strong>Property for Resale</strong></td><td>✅ Full market value is zakatable (treated as trading stock)</td></tr>
            <tr><td><strong>Vacation / Second Home</strong></td><td>❌ Generally exempt (if not generating income/not for sale)</td></tr>
            <tr><td><strong>Land for Development</strong></td><td>✅ Zakatable if held with the intention of selling</td></tr>
        </tbody>
    </table>
    <p><strong>Rental income example:</strong> You earn SAR 5,000/month from renting an apartment in Riyadh. Over the Hawl, you save SAR 42,000 of that rental income. Only this <strong>SAR 42,000</strong> is added to your zakatable assets — not the apartment's market value.</p>

    <h2 id="zakat-business">Corporate Zakat — Business Obligations in KSA</h2>
    <p>Saudi Arabia is unique in that <strong>ZATCA enforces Zakat collection from businesses</strong>. This applies to all entities with Saudi or GCC national ownership:</p>
    <table>
        <thead><tr><th>Ownership</th><th>Obligation</th><th>Rate</th></tr></thead>
        <tbody>
            <tr><td>100% Saudi/GCC</td><td>Zakat (ZATCA)</td><td>2.5% of Zakat base</td></tr>
            <tr><td>Mixed (Saudi + Foreign)</td><td>Zakat on Saudi portion, CIT on foreign portion</td><td>2.5% / 20%</td></tr>
            <tr><td>100% Foreign</td><td>Corporate Income Tax</td><td>20%</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Zakat Base Formula (Corporate):</strong><br/>
        Zakat Base = Share Capital + Retained Earnings + Reserves + Provisions + Long-term Liabilities − Net Fixed Assets − Investments in other companies<br/><br/>
        <strong>Zakat Due = Zakat Base × 2.5%</strong>
    </div>
    <p>Businesses must file Zakat returns within <strong>120 days</strong> of the fiscal year-end, accompanied by <strong>audited financial statements</strong>. ZATCA's 2024 Executive Regulations updated calculation methods to align with financial statement balances.</p>

    <h2 id="deductible-liabilities">Deductible Liabilities — What Reduces Your Zakat</h2>
    <p>Certain debts reduce your zakatable wealth. Understanding what qualifies is critical:</p>
    <h3>✅ Deductible</h3>
    <ul>
        <li>Debts payable within the next <strong>12 months</strong></li>
        <li>Up to <strong>12 months of installments</strong> on mortgages, car loans, personal loans</li>
        <li>Overdue payments and arrears</li>
        <li>Wages owed to employees</li>
        <li>Taxes due (VAT, government fees)</li>
    </ul>
    <h3>❌ Not Deductible</h3>
    <ul>
        <li>Expenses not yet due (future obligations)</li>
        <li>Debts with no payment due within 12 months</li>
        <li><strong>Interest (riba) payments</strong> — since riba is haram, interest cannot reduce your Zakat</li>
        <li>Rent for future months (not yet incurred)</li>
    </ul>

    <h2 id="zakat-al-fitr">Zakat al-Fitr vs Zakat al-Mal</h2>
    <p>These are two <strong>separate obligations</strong> that should not be confused:</p>
    <table>
        <thead><tr><th>Aspect</th><th>Zakat al-Mal (زكاة المال)</th><th>Zakat al-Fitr (زكاة الفطر)</th></tr></thead>
        <tbody>
            <tr><td><strong>What</strong></td><td>Annual wealth tax (2.5%)</td><td>End-of-Ramadan charity</td></tr>
            <tr><td><strong>Who</strong></td><td>Muslims with wealth ≥ Nisab</td><td>Every Muslim (including dependents)</td></tr>
            <tr><td><strong>When</strong></td><td>On your personal Hawl date</td><td>Before Eid al-Fitr prayer</td></tr>
            <tr><td><strong>Amount</strong></td><td>2.5% of net zakatable wealth</td><td>~SAR 25-30 per person (KSA rate)</td></tr>
            <tr><td><strong>Calculator</strong></td><td>This calculator</td><td>Fixed amount per person</td></tr>
        </tbody>
    </table>

    <h2 id="hawl">When to Pay Zakat — The Hawl (الحول)</h2>
    <p>Zakat becomes due after a <strong>full lunar (Hijri) year</strong> has passed since your wealth first reached the Nisab. This date is called your <strong>Hawl</strong>.</p>
    <ul>
        <li><strong>Setting your Hawl:</strong> The Islamic date on which you first had Nisab-level wealth (e.g., 15 Ramadan 1446)</li>
        <li><strong>Consistency:</strong> Pay Zakat on the same Islamic date every year</li>
        <li><strong>Ramadan preference:</strong> Many Muslims choose Ramadan for extra reward, but your actual Hawl may differ</li>
        <li><strong>Advance payment:</strong> You may pay Zakat before the Hawl is complete (this is permitted)</li>
        <li><strong>Lunar vs Solar year:</strong> One Hijri year ≈ 354 days (shorter than the 365-day Gregorian year)</li>
    </ul>
    <div class="explanation__highlight">
        <strong>Pro Tip:</strong> If you're unsure of your exact Hawl, pick a fixed date — such as <strong>1 Ramadan</strong> — and consistently calculate each year on that date. This simplifies the process and ensures you never miss your obligation.
    </div>

    <h2 id="zatca-individuals">ZATCA & Individual Zakat in Saudi Arabia</h2>
    <p>While ZATCA primarily collects Zakat from businesses, they also support individuals:</p>
    <ul>
        <li><strong>ZAKATY App:</strong> ZATCA launched the ZAKATY calculator in May 2025 — a simplified and detailed calculator for individuals</li>
        <li><strong>Voluntary Payment:</strong> Individuals can pay Zakat through the ZAKATY platform, which distributes funds to eligible recipients via the Social Security Agency (ضمان اجتماعي)</li>
        <li><strong>No enforcement:</strong> Individual Zakat is not monitored or enforced — it remains a personal duty between you and Allah</li>
    </ul>
    <p>For detailed business Zakat filing, visit <strong>zatca.gov.sa</strong> — ZATCA's official portal for corporate Zakat returns, compliance, and e-invoicing.</p>
`;

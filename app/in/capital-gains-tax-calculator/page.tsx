import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import CapitalGainsTaxCalculatorCore from "@/components/calculator/CapitalGainsTaxCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Capital Gains Tax Calculator India 2026 — LTCG & STCG on Equity, MF, Property, Gold, Crypto | Section 54 Exemption",
    description: "Free Capital Gains Tax Calculator with 4 modes: CG Tax Calculator (9 asset types), Asset Tax Comparison, Section 54/54EC/54F Exemption Planner, and Tax Loss Harvesting Optimiser. Covers post-Budget 2024 rules — 12.5% LTCG, 20% STCG equity, indexation removal, ₹1.25L exemption, grandfathering, and VDA 30% flat tax.",
    keywords: ["capital gains tax calculator", "LTCG calculator India", "STCG calculator", "capital gains tax 2026", "Section 112A", "Section 111A", "equity mutual fund capital gains", "property capital gains tax", "crypto tax India", "Section 54 exemption", "tax loss harvesting", "indexation removed", "12.5% LTCG", "grandfathering provision"],
    alternates: buildCountryAlternates("IN", "/in/capital-gains-tax-calculator", "capital-gains-tax-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is capital gains tax in India?", answer: "Capital Gains Tax is levied on the profit earned from selling a capital asset — such as equity shares, mutual funds, real estate, gold, bonds, or cryptocurrency. If the selling price exceeds the purchase cost (plus expenses), the difference is your capital gain, which is taxable. The tax rate depends on (1) the type of asset, (2) the holding period (short-term vs long-term), and (3) the applicable provisions of the Income Tax Act. Post Budget 2024, LTCG on most assets is taxed at 12.5%, equity STCG at 20%, and crypto at a flat 30%." },
    { question: "What are the LTCG and STCG tax rates after Budget 2024?", answer: "After the Union Budget 2024 (effective 23 July 2024): (1) LTCG on listed equity/equity MF: 12.5% (was 10%), with ₹1.25 lakh annual exemption (was ₹1 lakh). (2) STCG on listed equity/equity MF: 20% (was 15%). (3) LTCG on property/gold/unlisted shares/bonds: 12.5% (was 20% with indexation — indexation now removed for most assets). (4) Crypto/VDA: 30% flat rate regardless of holding period. (5) Debt MF acquired after 1 April 2023: taxed at slab rates regardless of holding period." },
    { question: "What is the holding period for LTCG on different assets?", answer: "After Budget 2024 simplification: (1) Listed equity shares and equity-oriented MF/ETF: more than 12 months = LTCG. (2) Unlisted shares: more than 24 months = LTCG. (3) Real estate (land, house): more than 24 months = LTCG. (4) Gold and jewellery: more than 24 months = LTCG. (5) Listed bonds and debentures: more than 12 months = LTCG. (6) Debt mutual funds: taxed at slab rates regardless (no LTCG benefit). (7) Crypto/VDA: flat 30% regardless of holding period." },
    { question: "Has indexation been removed for capital gains?", answer: "Yes, mostly. The Union Budget 2024 removed indexation benefit for calculating LTCG on most asset classes. However, there is a special transition rule for real estate: For properties purchased BEFORE 23 July 2024, resident individuals and HUFs can choose the LOWER tax between (a) 12.5% without indexation, or (b) 20% with indexation. This choice is not available for properties bought on or after 23 July 2024, which are taxed at flat 12.5% without indexation." },
    { question: "What is the ₹1.25 lakh LTCG exemption?", answer: "For listed equity shares and equity-oriented mutual funds (where STT is paid), the first ₹1.25 lakh of LTCG per financial year is completely tax-free. This was increased from ₹1 lakh in Budget 2024. This exemption applies only to Section 112A (now Section 198) gains — i.e., listed equity and equity MF with STT paid. It does NOT apply to property, gold, debt MF, unlisted shares, or crypto." },
    { question: "What is the grandfathering provision for equity?", answer: "For listed equity shares and equity MF purchased before 31 January 2018, a special 'grandfathering' provision applies. The cost of acquisition is taken as the HIGHER of (a) actual purchase price or (b) the Fair Market Value (FMV) as on 31 January 2018, but capped at the sale price. This ensures that gains accrued before 1 February 2018 (when LTCG tax was introduced) are not taxed. Only the appreciation after 31 Jan 2018 is subject to LTCG tax." },
    { question: "How is crypto/VDA taxed in India?", answer: "Cryptocurrency, NFTs, and other Virtual Digital Assets (VDAs) are taxed at a flat 30% rate regardless of holding period (no distinction between STCG and LTCG). Additionally: (1) No deduction is allowed except cost of acquisition (no brokerage, no expenses). (2) Losses from crypto cannot be set off against any other income. (3) Crypto losses cannot even be set off against gains from other crypto assets. (4) 1% TDS applies on crypto transfers exceeding ₹50,000 per year (₹10,000 for specified persons). (5) 4% health and education cess applies on top." },
    { question: "What is Section 54 exemption for capital gains?", answer: "Section 54 provides exemption from LTCG tax on sale of a residential house property if the capital gain is reinvested in purchasing or constructing ONE new residential house in India. Time limits: (1) Purchase: within 1 year before or 2 years after the sale date. (2) Construction: within 3 years after the sale date. The exemption is capped at ₹10 crore (from FY 2023-24). If the new house is sold within 3 years, the exemption is reversed and added to income in the year of sale." },
    { question: "What is Section 54EC exemption?", answer: "Section 54EC provides LTCG exemption on sale of land or buildings if the capital gain is invested in specified bonds — NHAI, REC, PFC, or IRFC bonds — within 6 months of the sale date. Maximum investment limit: ₹50 lakh per financial year. These bonds have a mandatory lock-in period of 5 years. If sold before 5 years, the exemption is reversed. Interest on these bonds (currently ~5-5.5%) is taxable as income from other sources." },
    { question: "What is Section 54F exemption?", answer: "Section 54F provides LTCG exemption on sale of ANY long-term capital asset EXCEPT a residential house (e.g., shares, gold, land). The NET SALE CONSIDERATION (not just the gain) must be invested in ONE new residential house in India. Full exemption if entire net consideration is invested; proportional exemption otherwise. Same time limits as Section 54. Capped at ₹10 crore from FY 2023-24. You must not own more than one other residential house on the date of transfer." },
    { question: "What is tax loss harvesting?", answer: "Tax loss harvesting is a strategy where you sell investments that are in loss to offset your capital gains and reduce tax liability. Rules: (1) STCG losses can be set off against both STCG and LTCG. (2) LTCG losses can be set off ONLY against LTCG, not STCG. (3) Unabsorbed capital losses can be carried forward for up to 8 assessment years. (4) You must file your ITR before the due date to carry forward losses. (5) After selling at a loss, you can immediately repurchase the same stock (India has no 'wash sale' rule like the US)." },
    { question: "How are debt mutual funds taxed after April 2023?", answer: "Debt mutual fund units acquired on or after 1 April 2023 are taxed at your income tax slab rate regardless of the holding period. There is no distinction between STCG and LTCG for these funds anymore, and no indexation benefit. This rule also applies to gold mutual funds, international funds, and fund-of-funds with less than 65% domestic equity allocation. Units acquired before 1 April 2023 continue to enjoy pre-existing treatment." },
    { question: "Is STT relevant for capital gains tax?", answer: "Yes. Securities Transaction Tax (STT) must be paid at the time of buying AND selling listed equity shares and equity MF units for the preferential LTCG rate of 12.5% (Section 112A/198) and STCG rate of 20% (Section 111A/196) to apply. If STT is not paid (e.g., off-market transactions), LTCG is still taxed at 12.5% but under Section 112 (now 197), without the ₹1.25 lakh exemption. STCG without STT is taxed at your slab rate." },
    { question: "Can capital losses be set off against salary or business income?", answer: "No. Capital losses (both STCG and LTCG) can ONLY be set off against capital gains. They cannot be adjusted against salary income, business income, rental income, or any other head of income. The only intra-head adjustment is: STCG losses against both STCG and LTCG, and LTCG losses against LTCG only. Unabsorbed capital losses can be carried forward for up to 8 years. Exception: Crypto losses cannot even be set off against other capital gains." },
    { question: "What surcharge applies on capital gains?", answer: "In addition to the base tax rate and 4% health & education cess, surcharges apply based on total income: (1) Income ₹50L–₹1Cr: 10% surcharge. (2) ₹1Cr–₹2Cr: 15% surcharge. (3) ₹2Cr–₹5Cr: 25% surcharge. (4) Above ₹5Cr: 37% surcharge. However, for LTCG under Section 112A (equity), the maximum surcharge is capped at 15%. For crypto/VDA, the maximum surcharge is also 15%. Our calculator applies the standard 4% cess; consult a CA for surcharge on high incomes." },
];

export default function CapitalGainsTaxCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Capital Gains Tax Calculator" },
        ]),
        webAppSchema("Capital Gains Tax Calculator India 2026", canonicalUrl("/in/capital-gains-tax-calculator")),
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
            <Script id="schema-cg" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Capital Gains Tax Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Capital Gains Tax Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Free Capital Gains Tax calculator with 4 modes: CG Tax Calculator for 9 asset types (listed equity, unlisted shares, equity MF, debt MF, real estate, gold, crypto/VDA, bonds, and other assets), Asset Tax Comparison across all classes, Section 54/54EC/54F Exemption Planner, and Tax Loss Harvesting optimiser. Updated for post-Budget 2024 rules including 12.5% LTCG, 20% equity STCG, indexation removal, ₹1.25 lakh annual exemption, grandfathering provision, and 30% VDA flat tax.
            </p>
            <AuthorBadge categoryKey="tax" />
            <CapitalGainsTaxCalculatorCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Capital Gains Tax Calculator FAQ — India 2026" items={FAQ_ITEMS} />

            <section className="in-related">
                <h3>Related India Calculators</h3>
                <div className="in-related-links">
                    {RELATED.map((r, i) => (
                        <Link key={i} href={r.href} className="in-related-link">
                            <span className="in-related-link__icon">{r.icon}</span>
                            <div className="in-related-link__text">
                                <div className="in-related-link__title">{r.title}</div>
                                <div className="in-related-link__desc">{r.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}

const RELATED = [
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "Old vs New Regime — see how capital gains add to your total taxable income" },
    { href: "/in/mutual-fund-returns-calculator", icon: "📊", title: "Mutual Fund Returns Calculator", desc: "Calculate MF returns with LTCG/STCG tax impact factored in" },
    { href: "/in/sip-calculator", icon: "📈", title: "SIP Calculator", desc: "Systematic Investment Plan returns — factor in tax on exit" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "Compare post-tax returns: FD (slab rate) vs Equity (12.5% LTCG)" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "PPF is EEE — completely tax-free vs capital gains taxation" },
    { href: "/in/nps-calculator", icon: "🏛️", title: "NPS Calculator", desc: "NPS taxation on withdrawal — 60% lump sum tax-free" },
    { href: "/in/tds-calculator", icon: "📋", title: "TDS Calculator", desc: "TDS on property sale, TDS on crypto transfers (1%)" },
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Corpus Calculator", desc: "Post-tax corpus planning — equity vs debt allocation" },
    { href: "/in/fire-calculator", icon: "🔥", title: "FIRE Calculator", desc: "Financial independence with post-tax withdrawal planning" },
    { href: "/in/compound-interest-calculator", icon: "📊", title: "Compound Interest Calculator", desc: "Pre-tax vs post-tax compounding comparison" },
    { href: "/in/professional-tax-calculator", icon: "🏛️", title: "Professional Tax Calculator", desc: "Another payroll deduction — PT under Section 16(iii)" },
    { href: "/in/hra-calculator", icon: "🏠", title: "HRA Calculator", desc: "Salary deductions and tax-saving strategy" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-capital-gains">What is Capital Gains Tax in India?</h2>
    <p><strong>Capital Gains Tax</strong> is levied on the profit earned when you sell a <strong>capital asset</strong> — such as shares, mutual funds, property, gold, bonds, or cryptocurrency — at a price higher than what you paid for it. It is one of the most significant components of investment taxation in India.</p>
    <p>The formula is straightforward:</p>
    <div class="explanation__highlight">
        <strong>Capital Gain = Sale Price − Cost of Acquisition − Transfer Expenses (Brokerage, Stamp Duty)</strong>
    </div>
    <p>Capital gains are classified as either <strong>Short-Term Capital Gains (STCG)</strong> or <strong>Long-Term Capital Gains (LTCG)</strong> based on the holding period. The tax rate varies by asset type, and the Union Budget 2024 made sweeping changes to rates, holding periods, and indexation rules. Use our calculator above to compute your exact tax liability.</p>

    <h2 id="budget-2024-changes">Union Budget 2024 — Key Changes to Capital Gains Tax</h2>
    <p>The Finance (No. 2) Act, 2024 — effective from <strong>23 July 2024</strong> — significantly restructured India&rsquo;s capital gains tax framework:</p>
    <table>
        <thead><tr><th>Change</th><th>Old Rule (Before 23-Jul-2024)</th><th>New Rule (After 23-Jul-2024)</th></tr></thead>
        <tbody>
            <tr><td><strong>LTCG Rate (Equity/MF)</strong></td><td>10% above ₹1 lakh</td><td><strong>12.5%</strong> above ₹1.25 lakh</td></tr>
            <tr><td><strong>STCG Rate (Equity/MF)</strong></td><td>15%</td><td><strong>20%</strong></td></tr>
            <tr><td><strong>LTCG Rate (Property/Gold/Others)</strong></td><td>20% with indexation</td><td><strong>12.5%</strong> without indexation</td></tr>
            <tr><td><strong>Indexation</strong></td><td>Available for most assets</td><td><strong>Removed</strong> (exception: pre-Jul-2024 property)</td></tr>
            <tr><td><strong>Annual Exemption</strong></td><td>₹1,00,000</td><td><strong>₹1,25,000</strong></td></tr>
            <tr><td><strong>Holding Period (Unlisted/Gold/Property)</strong></td><td>36 months</td><td><strong>24 months</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Property Transition Rule:</strong> For residential property purchased BEFORE 23 July 2024, you can choose the LOWER tax between (a) 12.5% without indexation or (b) 20% with indexation. This flexibility is only for resident Individuals and HUFs.
    </div>

    <h2 id="stcg-ltcg-classification">STCG vs LTCG — Holding Period Classification</h2>
    <table>
        <thead><tr><th>Asset Type</th><th>Short-Term (STCG)</th><th>Long-Term (LTCG)</th><th>LTCG Rate</th><th>STCG Rate</th></tr></thead>
        <tbody>
            <tr><td>Listed Equity Shares</td><td>≤ 12 months</td><td>> 12 months</td><td>12.5% (₹1.25L exempt)</td><td>20%</td></tr>
            <tr><td>Equity Mutual Funds / ETFs</td><td>≤ 12 months</td><td>> 12 months</td><td>12.5% (₹1.25L exempt)</td><td>20%</td></tr>
            <tr><td>Unlisted Shares</td><td>≤ 24 months</td><td>> 24 months</td><td>12.5%</td><td>Slab Rate</td></tr>
            <tr><td>Real Estate (Land / House)</td><td>≤ 24 months</td><td>> 24 months</td><td>12.5% (or 20% with idx)</td><td>Slab Rate</td></tr>
            <tr><td>Gold / Jewellery</td><td>≤ 24 months</td><td>> 24 months</td><td>12.5%</td><td>Slab Rate</td></tr>
            <tr><td>Debt Mutual Funds (post Apr 2023)</td><td colspan="2">Slab rate regardless</td><td>Slab Rate</td><td>Slab Rate</td></tr>
            <tr><td>Crypto / VDA / NFTs</td><td colspan="2">30% flat regardless</td><td>30%</td><td>30%</td></tr>
            <tr><td>Listed Bonds</td><td>≤ 12 months</td><td>> 12 months</td><td>12.5%</td><td>Slab Rate</td></tr>
        </tbody>
    </table>
    <p>Use our <a href="/in/mutual-fund-returns-calculator">Mutual Fund Returns Calculator</a> to see how these tax rates impact your actual post-tax returns from SIP and lump sum investments.</p>

    <h2 id="tax-rates-detailed">Capital Gains Tax Rates — Detailed Breakdown</h2>
    <table>
        <thead><tr><th>Asset</th><th>LTCG Tax</th><th>STCG Tax</th><th>Exemption</th><th>IT Section</th></tr></thead>
        <tbody>
            <tr><td>Listed Equity (STT paid)</td><td>12.5%</td><td>20%</td><td>₹1.25L/yr</td><td>Sec 198 / 196</td></tr>
            <tr><td>Equity MF / ETF (STT paid)</td><td>12.5%</td><td>20%</td><td>₹1.25L/yr</td><td>Sec 198 / 196</td></tr>
            <tr><td>Equity (No STT)</td><td>12.5%</td><td>Slab Rate</td><td>None</td><td>Sec 197</td></tr>
            <tr><td>Debt MF (post Apr-2023)</td><td>Slab Rate</td><td>Slab Rate</td><td>None</td><td>Sec 76</td></tr>
            <tr><td>Property</td><td>12.5% / 20%*</td><td>Slab Rate</td><td>Sec 54/54EC</td><td>Sec 197</td></tr>
            <tr><td>Gold / Jewellery</td><td>12.5%</td><td>Slab Rate</td><td>None</td><td>Sec 197</td></tr>
            <tr><td>Crypto / VDA</td><td>30%</td><td>30%</td><td>None</td><td>Sec 194</td></tr>
            <tr><td>Listed Bonds</td><td>12.5%</td><td>Slab Rate</td><td>None</td><td>Sec 197</td></tr>
            <tr><td>Unlisted Shares</td><td>12.5%</td><td>Slab Rate</td><td>None</td><td>Sec 197</td></tr>
        </tbody>
    </table>
    <p>* Property bought before 23-Jul-2024: choice of 12.5% (no indexation) or 20% (with indexation).</p>

    <h2 id="grandfathering">Grandfathering Provision — Equity Shares Bought Before 31 Jan 2018</h2>
    <p>When LTCG tax on listed equity was introduced in Budget 2018, a <strong>grandfathering provision</strong> was included to protect gains accrued before 1 February 2018. The cost of acquisition is computed as:</p>
    <div class="explanation__highlight">
        <strong>Cost of Acquisition = HIGHER of:</strong><br>
        (a) Actual Purchase Price, OR<br>
        (b) Fair Market Value (FMV) as on 31 January 2018<br>
        <strong>BUT capped at the Sale Price</strong> (to prevent artificial losses)
    </div>
    <h3>Grandfathering Worked Example</h3>
    <table>
        <thead><tr><th>Scenario</th><th>Buy Price</th><th>FMV (31-Jan-2018)</th><th>Sell Price</th><th>Cost Taken</th><th>LTCG</th></tr></thead>
        <tbody>
            <tr><td>Buy < FMV < Sell</td><td>₹100</td><td>₹200</td><td>₹400</td><td>₹200 (FMV)</td><td>₹200</td></tr>
            <tr><td>FMV < Buy < Sell</td><td>₹250</td><td>₹200</td><td>₹400</td><td>₹250 (Buy)</td><td>₹150</td></tr>
            <tr><td>Buy < Sell < FMV</td><td>₹100</td><td>₹500</td><td>₹400</td><td>₹400 (capped)</td><td>₹0</td></tr>
        </tbody>
    </table>

    <h2 id="indexation">Indexation — Cost Inflation Index (CII)</h2>
    <p><strong>Indexation</strong> adjusts the purchase cost of an asset for inflation using the Cost Inflation Index (CII) published by the government. Post Budget 2024, indexation is largely removed, but remains relevant for pre-July-2024 property transactions.</p>
    <h3>CII Table (FY 2001-02 to 2025-26)</h3>
    <table>
        <thead><tr><th>Financial Year</th><th>CII</th><th>Financial Year</th><th>CII</th></tr></thead>
        <tbody>
            <tr><td>2001-02 (Base Year)</td><td>100</td><td>2014-15</td><td>240</td></tr>
            <tr><td>2005-06</td><td>117</td><td>2017-18</td><td>272</td></tr>
            <tr><td>2008-09</td><td>137</td><td>2019-20</td><td>289</td></tr>
            <tr><td>2010-11</td><td>167</td><td>2021-22</td><td>317</td></tr>
            <tr><td>2011-12</td><td>184</td><td>2022-23</td><td>331</td></tr>
            <tr><td>2012-13</td><td>200</td><td>2023-24</td><td>348</td></tr>
            <tr><td>2013-14</td><td>220</td><td>2024-25</td><td>363</td></tr>
            <tr><td></td><td></td><td>2025-26</td><td>377</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Indexed Cost Formula:</strong> Indexed Cost = Purchase Price × (CII of Sale Year ÷ CII of Purchase Year)
    </div>

    <h2 id="section-54">Section 54, 54EC, 54F — Capital Gains Exemptions</h2>
    <table>
        <thead><tr><th>Feature</th><th>Section 54</th><th>Section 54EC</th><th>Section 54F</th></tr></thead>
        <tbody>
            <tr><td><strong>Applies To</strong></td><td>Sale of residential house</td><td>Sale of land or building</td><td>Sale of any asset except house</td></tr>
            <tr><td><strong>Invest In</strong></td><td>1 new house in India</td><td>NHAI/REC/PFC/IRFC bonds</td><td>1 new house in India</td></tr>
            <tr><td><strong>Invest</strong></td><td>Capital gain amount</td><td>Capital gain (max ₹50L)</td><td>Net sale consideration</td></tr>
            <tr><td><strong>Time Limit</strong></td><td>Buy 1yr before / 2yr after; Build 3yr</td><td>6 months from sale</td><td>Buy 1yr before / 2yr after; Build 3yr</td></tr>
            <tr><td><strong>Max Exemption</strong></td><td>₹10 crore (from FY 2023-24)</td><td>₹50 lakh per FY</td><td>₹10 crore (from FY 2023-24)</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>3 years (new house)</td><td>5 years (bonds)</td><td>3 years (new house)</td></tr>
        </tbody>
    </table>

    <h2 id="tax-loss-harvesting">Tax Loss Harvesting — Strategy Guide</h2>
    <p><strong>Tax loss harvesting</strong> is a legal strategy to reduce your capital gains tax by selling loss-making investments to offset realised gains. In India:</p>
    <ul>
        <li><strong>STCG losses</strong> can offset both STCG and LTCG</li>
        <li><strong>LTCG losses</strong> can offset ONLY LTCG (not STCG)</li>
        <li>Unabsorbed losses can be <strong>carried forward for 8 years</strong></li>
        <li>Must <strong>file ITR before the due date</strong> to carry forward</li>
        <li>India has <strong>no wash-sale rule</strong> — you can repurchase immediately</li>
    </ul>
    <h3>Harvesting Example</h3>
    <table>
        <thead><tr><th>Without Harvesting</th><th>With Harvesting</th></tr></thead>
        <tbody>
            <tr><td>LTCG: ₹3,00,000</td><td>LTCG: ₹3,00,000</td></tr>
            <tr><td>Losses harvested: ₹0</td><td>Losses harvested: −₹1,50,000</td></tr>
            <tr><td>Net LTCG: ₹3,00,000</td><td>Net LTCG: ₹1,50,000</td></tr>
            <tr><td>Exemption: −₹1,25,000</td><td>Exemption: −₹1,25,000</td></tr>
            <tr><td>Taxable: ₹1,75,000</td><td>Taxable: ₹25,000</td></tr>
            <tr><td>Tax (12.5% + cess): <strong>₹22,750</strong></td><td>Tax (12.5% + cess): <strong>₹3,250</strong></td></tr>
            <tr><td colspan="2" style="text-align:center"><strong>Tax Saved: ₹19,500</strong></td></tr>
        </tbody>
    </table>
    <p>Use our <strong>Tax Loss Harvesting mode</strong> (Mode 4 above) to plan your year-end tax optimisation. Also see our <a href="/in/income-tax-calculator">Income Tax Calculator</a> for the complete picture.</p>

    <h2 id="crypto-vda">Crypto / VDA Taxation — Section 115BBH</h2>
    <p>Since FY 2022-23, crypto and Virtual Digital Assets (VDAs) have a special harsh tax regime:</p>
    <table>
        <thead><tr><th>Rule</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td>Tax Rate</td><td><strong>30% flat</strong> (+ 4% cess = 31.2% effective)</td></tr>
            <tr><td>Holding Period</td><td>Irrelevant — same rate for any duration</td></tr>
            <tr><td>Deductions</td><td>ONLY cost of acquisition (no brokerage, no expenses)</td></tr>
            <tr><td>Loss Set-off</td><td>NO set-off against any income (not even other crypto)</td></tr>
            <tr><td>TDS</td><td>1% on transfers > ₹50,000/yr (₹10,000 for specified persons)</td></tr>
            <tr><td>Gifts</td><td>Taxable as income if received as gift</td></tr>
        </tbody>
    </table>

    <h2 id="debt-mf-rules">Debt Mutual Fund Taxation — Post April 2023</h2>
    <p>A major change from FY 2023-24: Debt mutual funds (and other funds with <65% equity allocation) acquired on or after 1 April 2023 are now taxed at your <strong>income tax slab rate</strong> regardless of holding period. No LTCG benefit, no indexation.</p>
    <p>This affects: Gold MFs, International MFs, Fund-of-Funds, and Hybrid funds with <65% equity. Compare the post-tax returns using our <a href="/in/fd-calculator">FD Calculator</a> — since both debt MF and FD are now taxed at slab rates, the comparison is more direct.</p>

    <h2 id="stt-role">Role of STT in Capital Gains Taxation</h2>
    <p><strong>Securities Transaction Tax (STT)</strong> is crucial for determining which tax section applies to your equity gains. STT must be paid on BOTH purchase and sale for the preferential rates (12.5% LTCG, 20% STCG) under Sections 198 and 196 to apply. Off-market transfers without STT are taxed under Section 197 without the ₹1.25L exemption.</p>

    <h2 id="set-off-rules">Capital Loss Set-off Rules</h2>
    <table>
        <thead><tr><th>Loss Type</th><th>Can Set Off Against</th><th>Cannot Set Off Against</th></tr></thead>
        <tbody>
            <tr><td><strong>STCG Loss</strong></td><td>STCG + LTCG (any asset)</td><td>Salary, business, rental, other income</td></tr>
            <tr><td><strong>LTCG Loss</strong></td><td>LTCG only</td><td>STCG, salary, business, rental</td></tr>
            <tr><td><strong>Crypto Loss</strong></td><td>Nothing</td><td>All income including other crypto</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Carry Forward Rule:</strong> Unabsorbed capital losses can be carried forward for up to 8 assessment years. You MUST file your ITR before the due date (usually 31 July for non-audit cases) to preserve the carry-forward right. See our <a href="/in/income-tax-calculator">Income Tax Calculator</a> for due dates.
    </div>

    <h2 id="worked-examples">Worked Examples — Common Scenarios</h2>
    <h3>Example 1: Equity Shares — LTCG</h3>
    <table>
        <thead><tr><th>Component</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Bought TCS shares in March 2023</td><td>₹5,00,000</td></tr>
            <tr><td>Sold in September 2025</td><td>₹9,00,000</td></tr>
            <tr><td>Brokerage & charges</td><td>₹2,000</td></tr>
            <tr><td>Capital Gain</td><td>₹3,98,000</td></tr>
            <tr><td>Holding period (>12 months)</td><td>LTCG</td></tr>
            <tr><td>₹1.25L exemption</td><td>−₹1,25,000</td></tr>
            <tr><td>Taxable LTCG</td><td>₹2,73,000</td></tr>
            <tr><td>Tax at 12.5% + 4% cess</td><td><strong>₹35,490</strong></td></tr>
        </tbody>
    </table>

    <h3>Example 2: Property Sale — Pre-July-2024 Purchase</h3>
    <table>
        <thead><tr><th>Component</th><th>Without Indexation</th><th>With Indexation</th></tr></thead>
        <tbody>
            <tr><td>Purchase (2015-16)</td><td>₹50,00,000</td><td>₹50,00,000</td></tr>
            <tr><td>CII Adjustment</td><td>—</td><td>₹50L × (377/254) = ₹74,21,260</td></tr>
            <tr><td>Sale (2025-26)</td><td>₹1,20,00,000</td><td>₹1,20,00,000</td></tr>
            <tr><td>LTCG</td><td>₹70,00,000</td><td>₹45,78,740</td></tr>
            <tr><td>Tax Rate</td><td>12.5%</td><td>20%</td></tr>
            <tr><td>Tax + Cess</td><td><strong>₹9,10,000</strong></td><td><strong>₹9,52,379</strong></td></tr>
            <tr><td colspan="3"><strong>Winner: 12.5% without indexation saves ₹42,379</strong></td></tr>
        </tbody>
    </table>
    <p>Both options are close — for higher appreciation, 12.5% may win; for moderate appreciation, 20% with indexation may be better. Use our calculator to test your specific numbers. Also plan your reinvestment with our <a href="/in/sip-calculator">SIP Calculator</a>.</p>

    <h2 id="advance-tax">Advance Tax on Capital Gains</h2>
    <p>If your total tax liability (including capital gains) exceeds ₹10,000 in a financial year, you may need to pay <strong>advance tax</strong>. However, there is a relaxation: capital gains that arise after the last instalment due date (15 March) need not be covered by advance tax. Use our <a href="/in/tds-calculator">TDS Calculator</a> to understand TDS obligations on property and crypto sales.</p>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — See how capital gains add to your total income and the overall tax impact.</li>
        <li><strong><a href="/in/mutual-fund-returns-calculator">Mutual Fund Returns Calculator</a></strong> — MF returns with exit load and LTCG tax factored in.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Plan your SIP investments and understand post-tax wealth creation.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — Compare: FD taxed at slab rate vs Equity LTCG at 12.5%.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Tax-free (EEE) alternative to taxable capital gains.</li>
        <li><strong><a href="/in/nps-calculator">NPS Calculator</a></strong> — NPS 60% lump sum is tax-free — compare with equity exit taxation.</li>
        <li><strong><a href="/in/tds-calculator">TDS Calculator</a></strong> — TDS on property sale (1%), TDS on crypto (1%).</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> — Pre-tax vs post-tax compounding comparison.</li>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></strong> — Post-tax corpus with equity/debt allocation.</li>
        <li><strong><a href="/in/professional-tax-calculator">Professional Tax Calculator</a></strong> — Another tax deduction from your salary.</li>
    </ul>
`;

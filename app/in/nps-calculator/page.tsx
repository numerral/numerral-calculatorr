import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import NPSCalculatorIndiaCore from "@/components/calculator/NPSCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "NPS Calculator India 2026 — Corpus, Pension, 80CCD Tax Benefits & Annuity Planner",
    description: "Free NPS calculator with 4 modes: NPS Corpus & Pension Estimator (Active/Auto Choice, LC75/LC50/LC25), 80CCD Tax Benefit Calculator (Old vs New Regime), NPS vs PPF vs ELSS vs MF comparison, and Annuity Planner. Covers 2026 withdrawal rules (80:20 rule), employer 80CCD(2), Tier I vs II, PFM comparison, and PFRDA regulations.",
    keywords: ["NPS calculator", "NPS calculator India 2026", "National Pension System calculator", "NPS tax benefit", "80CCD 1B", "NPS corpus calculator", "NPS pension calculator", "NPS vs PPF", "NPS annuity", "NPS Active Choice", "NPS Auto Choice lifecycle fund", "NPS withdrawal rules 2026", "NPS employer contribution", "PFRDA pension"],
    alternates: buildCountryAlternates("IN", "/in/nps-calculator", "nps-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is the National Pension System (NPS)?", answer: "NPS is a voluntary, market-linked retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA). It was launched in 2004 for government employees and opened to all Indian citizens in 2009. NPS invests your contributions across equity, corporate bonds, and government securities through professional Pension Fund Managers (PFMs). At retirement (age 60), you receive a portion as a lump sum (tax-free) and the rest as a monthly pension through an annuity. NPS offers unique tax benefits under Sections 80CCD(1), 80CCD(1B), and 80CCD(2) of the Income Tax Act." },
    { question: "What is the difference between NPS Tier I and Tier II?", answer: "NPS Tier I is the primary retirement account with tax benefits and withdrawal restrictions — you cannot withdraw before age 60 (except in specified circumstances). All 80CCD tax deductions apply only to Tier I. NPS Tier II is a voluntary investment account with complete liquidity — you can deposit and withdraw anytime with no lock-in. However, Tier II offers NO tax benefits (except for government employees who get 80C benefit with a 3-year lock-in). You must have a Tier I account to open a Tier II account." },
    { question: "What is the new NPS withdrawal rule in 2026?", answer: "PFRDA introduced major changes effective December 2025 for non-government subscribers: (1) Corpus above ₹12 lakh: You can withdraw up to 80% as a tax-free lump sum, with only 20% mandatory for annuity (reduced from 40%). (2) Corpus ₹8–12 lakh: Up to ₹6 lakh lump sum, rest via annuity or Systematic Unit Redemption (SUR). (3) Corpus ≤ ₹8 lakh: 100% can be withdrawn as lump sum — no annuity requirement. Government employees generally continue with the older 60:40 rule. Subscribers can now stay invested until age 75 (extended from 70)." },
    { question: "How much tax benefit can I get from NPS?", answer: "NPS offers three separate tax deductions: (1) Section 80CCD(1): Employee contribution up to 10% of Basic+DA, within the ₹1.5 lakh Section 80C overall cap. (2) Section 80CCD(1B): Additional ₹50,000 deduction — exclusively for NPS, OVER AND ABOVE the ₹1.5 lakh limit. This works under BOTH Old and New Tax Regimes. (3) Section 80CCD(2): Employer contribution up to 10% of Basic+DA (14% for Central Govt) — no cap, fully tax-free. At the 30% tax bracket, NPS can save up to ₹62,400/year (₹1.5L + ₹50K deductions × 31.2%)." },
    { question: "Is NPS available under the New Tax Regime?", answer: "Partially yes. Under the New Tax Regime: Section 80CCD(1B) — the additional ₹50,000 NPS deduction — IS available. Section 80CCD(2) — employer's NPS contribution — IS available. However, Section 80CCD(1) — employee's own contribution under 80C — is NOT available under the New Regime. This makes NPS one of the few instruments that provides tax benefits under BOTH regimes, making it especially valuable for taxpayers who have switched to the New Regime." },
    { question: "What is Active Choice vs Auto Choice in NPS?", answer: "Active Choice lets you decide your exact asset allocation across Equity (E, max 75%), Corporate Bonds (C), Government Securities (G), and Alternative Investments (A, max 5%). You control the mix based on your risk appetite. Auto Choice (Lifecycle Fund) is a hands-off approach where your allocation is automatically managed based on your age. Three options: LC75 (Aggressive — starts with 75% equity), LC50 (Moderate — starts with 50%), LC25 (Conservative — starts with 25%). As you age, equity reduces automatically and shifts to safer government bonds." },
    { question: "How do I choose between NPS pension fund managers?", answer: "There are 11 PFRDA-registered PFMs: SBI, UTI, HDFC, ICICI Prudential, Kotak, LIC, Aditya Birla, Axis, DSP, Max Life, and Tata. Compare them on: (1) Long-term performance (5–10 year returns) in each asset class (E, C, G). (2) Consistency — avoid managers who performed well only in one year. (3) AUM size — larger AUM generally means more stability. You can switch PFMs once per financial year at no cost. Separate PFM selection is possible for Tier I and Tier II accounts." },
    { question: "What is the minimum contribution for NPS?", answer: "NPS Tier I: Minimum ₹500 per contribution, with at least ₹1,000/year (at least one contribution annually to keep the account active). If you miss contributions for 3 consecutive years, the account becomes 'frozen' — you can reactivate it by paying a ₹100 penalty + outstanding contributions. NPS Tier II: Minimum ₹250 per contribution, no annual minimum. There is no maximum contribution limit for either tier." },
    { question: "Can I withdraw from NPS before age 60?", answer: "Partial withdrawal: After 3 years of membership, you can make up to 4 partial withdrawals (with a 4-year gap between each) of up to 25% of your OWN contributions. Allowed only for specified reasons: children's education/marriage, medical treatment, house purchase/construction, or starting a business. Premature exit (before 60): You must use at least 80% of the corpus to buy an annuity — only 20% can be withdrawn as lump sum. However, if corpus is ≤ ₹2.5 lakh, 100% lump sum withdrawal is allowed." },
    { question: "What are the annuity options in NPS?", answer: "At retirement, you must use the annuity portion of your corpus to buy a pension plan from a PFRDA-empanelled insurer. Options include: (1) Life Annuity — highest pension, stops at death. (2) Joint Life Annuity — spouse gets 50–100% pension after your death. (3) Life with Return of Purchase Price — lower pension but full corpus returned to nominee at death (most popular). (4) Guaranteed Period (5/10/15/20 years) — pension guaranteed for a fixed period. Providers include LIC, SBI Life, HDFC Life, ICICI Pru Life, and others." },
    { question: "Is NPS better than PPF for retirement?", answer: "It depends on your risk appetite and goals. NPS advantages: Higher potential returns (10–12% vs PPF's 7.1%), additional ₹50K tax benefit (80CCD(1B)), employer contribution (80CCD(2)). PPF advantages: Guaranteed returns (government-backed), fully tax-free (EEE status — invest, earn, and withdraw all tax-free), no market risk. Best strategy: Use NPS for the ₹50K extra deduction AND long-term equity growth, and PPF for the guaranteed safety portion of your retirement portfolio. Compare using our PPF Calculator." },
    { question: "What is 80CCD(1B) and how is it different from 80C?", answer: "Section 80C allows deductions up to ₹1.5 lakh for various investments (PPF, ELSS, EPF, LIC, etc.). Section 80CCD(1B) is an ADDITIONAL deduction of up to ₹50,000 exclusively for NPS Tier I contributions — it is OVER AND ABOVE the ₹1.5 lakh 80C limit. This means with NPS, you can claim a total of ₹2 lakh in deductions (₹1.5L under 80C + ₹50K under 80CCD(1B)). Crucially, 80CCD(1B) is available under BOTH Old and New Tax Regimes — making it one of the most valuable tax-saving sections." },
    { question: "How is the NPS pension calculated?", answer: "NPS pension is calculated as: Monthly Pension = (Annuity Corpus × Annuity Rate) / 12. Example: Total NPS Corpus = ₹1 Cr. Annuity allocation = 40% (₹40L). Annuity rate = 6%. Monthly pension = (₹40,00,000 × 6%) / 12 = ₹20,000/month. The remaining 60% (₹60L) is withdrawn as a tax-free lump sum. Your actual corpus depends on your monthly contribution, investment duration, and blended return from your E/C/G asset allocation." },
    { question: "Can NRI invest in NPS?", answer: "Yes, NRIs (Non-Resident Indians) can invest in NPS Tier I and Tier II accounts. They get the same tax benefits as resident Indians. Contributions can be made through an NRE or NRO bank account. However, if the NRI's citizenship status changes to OCI (Overseas Citizen of India) or foreign national, the NPS account may need to be closed. Repatriation is subject to FEMA regulations and RBI guidelines." },
    { question: "What happens to NPS if the subscriber dies?", answer: "If the subscriber dies before retirement: The entire accumulated corpus (100%) is paid to the nominee/legal heir as a lump sum — no mandatory annuity requirement. If the subscriber dies after retirement: The treatment depends on the annuity type chosen — (1) Life Annuity: Pension stops, no payout to nominee. (2) Joint Life: Spouse continues receiving pension (50–100%). (3) Life with Return of Purchase Price: Full annuity corpus returned to nominee. (4) Guaranteed Period: If death occurs within the guaranteed period, remaining pension paid to nominee." },
];

export default function NPSCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "NPS Calculator" },
        ]),
        webAppSchema("NPS Calculator India 2026", canonicalUrl("/in/nps-calculator")),
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
            <Script id="schema-nps" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "NPS Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>NPS Calculator India 2026</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Free NPS (National Pension System) calculator with 4 modes: Corpus &amp; Pension Estimator with Active/Auto Choice asset allocation (LC75/LC50/LC25), 80CCD Tax Benefit Calculator for Old &amp; New Regime, NPS vs PPF vs ELSS vs Mutual Fund comparison, and Annuity Planner with 5 annuity types. Updated for 2026 PFRDA withdrawal rules (new 80:20 rule) and employer 80CCD(2) benefits.
            </p>
            <AuthorBadge categoryKey="salary" />
            <NPSCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="NPS Calculator FAQ — India 2026" items={FAQ_ITEMS} />

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
    { href: "/in/retirement-corpus-calculator", icon: "🛡️", title: "Retirement Corpus Calculator", desc: "NPS + EPF + PPF stack, healthcare inflation, post-retirement income planner" },
    { href: "/in/ppf-calculator", icon: "🏦", title: "PPF Calculator", desc: "Tax-free 7.1% returns — NPS vs PPF for Section 80C planning" },
    { href: "/in/income-tax-calculator", icon: "🧾", title: "Income Tax Calculator", desc: "Old vs New Regime — maximise 80CCD(1B) + 80C deductions" },
    { href: "/in/fire-calculator", icon: "🔥", title: "FIRE Calculator", desc: "Early retirement with NPS + MF + EPF combined strategy" },
    { href: "/in/sip-calculator", icon: "📈", title: "SIP Calculator", desc: "Compare NPS returns with mutual fund SIP growth" },
    { href: "/in/mutual-fund-returns-calculator", icon: "📊", title: "Mutual Fund Calculator", desc: "MF vs NPS: LTCG tax, CAGR, and post-tax returns comparison" },
    { href: "/in/fd-calculator", icon: "🏛️", title: "FD Calculator", desc: "NPS vs FD: market-linked vs guaranteed returns" },
    { href: "/in/hra-calculator", icon: "🏠", title: "HRA Calculator", desc: "Salary structure — understand Basic + DA for NPS 80CCD limit" },
    { href: "/in/gratuity-calculator", icon: "🎁", title: "Gratuity Calculator", desc: "Complete retirement benefits: Gratuity + EPF + NPS stack" },
    { href: "/in/compound-interest-calculator", icon: "📊", title: "Compound Interest Calculator", desc: "Visualise compounding behind NPS corpus growth" },
    { href: "/in/swp-calculator", icon: "💰", title: "SWP Calculator", desc: "Post-retirement income: NPS annuity vs MF SWP strategy" },
    { href: "/in/crorepati-calculator", icon: "💎", title: "Crorepati Calculator", desc: "When will your NPS + SIP make you a crorepati?" },
    { href: "/in/education-loan-calculator", icon: "🎓", title: "Education Loan Calculator", desc: "Financial planning tools for India" },
    { href: "/in", icon: "🇮🇳", title: "All India Calculators", desc: "Browse all India-specific financial tools" },
];

const CONTENT_HTML = `
    <h2 id="what-is-nps">What is NPS (National Pension System)?</h2>
    <p>The <strong>National Pension System (NPS)</strong> is a voluntary, government-backed retirement savings scheme in India regulated by the <strong>Pension Fund Regulatory and Development Authority (PFRDA)</strong>. Launched in January 2004 for government employees and opened to all citizens in May 2009, NPS is designed to provide old-age income security through market-linked returns.</p>
    <p>Unlike PPF or EPF which offer fixed returns, NPS invests your contributions across <strong>equity (E), corporate bonds (C), government securities (G), and alternative investments (A)</strong> through professional Pension Fund Managers (PFMs). At retirement (typically age 60), you receive a portion as a <strong>tax-free lump sum</strong> and the rest as a <strong>monthly pension</strong> through an annuity purchase.</p>
    <div class="explanation__highlight">
        <strong>Why NPS Matters:</strong> NPS offers the unique <strong>Section 80CCD(1B)</strong> deduction of ₹50,000 — available under BOTH Old and New Tax Regimes — over and above the ₹1.5 lakh Section 80C limit. This makes it the <strong>single most tax-efficient retirement tool</strong> in India. Use our calculator above to see your exact savings.
    </div>

    <h2 id="tier-1-vs-tier-2">NPS Tier I vs Tier II — Complete Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>NPS Tier I (Primary)</th><th>NPS Tier II (Voluntary)</th></tr></thead>
        <tbody>
            <tr><td><strong>Purpose</strong></td><td>Retirement savings — mandatory for pension</td><td>Voluntary investment — like a savings account</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>Until age 60 (partial withdrawals allowed)</td><td>None — withdraw anytime</td></tr>
            <tr><td><strong>Tax Benefit</strong></td><td>80CCD(1) + 80CCD(1B) + 80CCD(2)</td><td>None (except Govt employees with 3-yr lock-in get 80C)</td></tr>
            <tr><td><strong>Min Contribution</strong></td><td>₹500/contribution, ₹1,000/year</td><td>₹250/contribution</td></tr>
            <tr><td><strong>Withdrawal</strong></td><td>Partial: up to 25% of own contribution, max 4 times</td><td>Unlimited withdrawals</td></tr>
            <tr><td><strong>At Retirement</strong></td><td>Up to 80% lump sum + 20% annuity (2026 rule)</td><td>Full withdrawal — no annuity required</td></tr>
            <tr><td><strong>Prerequisite</strong></td><td>None</td><td>Must have active Tier I account</td></tr>
        </tbody>
    </table>
    <p><strong>Key insight:</strong> Always maximise Tier I contributions first (for the tax benefits), then use Tier II only for surplus liquid investments. Tier II is essentially a tax-neutral mutual fund — consider using <a href="/in/mutual-fund-returns-calculator">Mutual Fund Calculator</a> to compare returns.</p>

    <h2 id="active-vs-auto">NPS Investment Choices — Active vs Auto Choice</h2>
    <h3>Auto Choice (Lifecycle Fund) — Recommended for Most Investors</h3>
    <p>Auto Choice automatically manages your asset allocation based on your age. You select one of three risk profiles:</p>
    <table>
        <thead><tr><th>Fund</th><th>Max Equity at Young Age</th><th>Equity at Age 55</th><th>Risk Level</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>LC75 (Aggressive)</strong></td><td>75%</td><td>15%</td><td>High</td><td>Young investors (25–35) wanting maximum growth</td></tr>
            <tr><td><strong>LC50 (Moderate)</strong></td><td>50%</td><td>10%</td><td>Medium</td><td>Default choice — balanced risk-return</td></tr>
            <tr><td><strong>LC25 (Conservative)</strong></td><td>25%</td><td>5%</td><td>Low</td><td>Risk-averse investors near retirement</td></tr>
        </tbody>
    </table>
    <p>As you age, the system automatically reduces equity and increases government bond allocation — protecting your corpus as you near retirement.</p>

    <h3>Active Choice — For Experienced Investors</h3>
    <p>Active Choice lets you decide the exact percentage in each asset class:</p>
    <table>
        <thead><tr><th>Asset Class</th><th>Code</th><th>Max Allocation</th><th>Historical Return</th><th>Risk</th></tr></thead>
        <tbody>
            <tr><td><strong>Equity</strong></td><td>E</td><td>75% (until age 50, reduces after)</td><td>12–14%</td><td>High</td></tr>
            <tr><td><strong>Corporate Bonds</strong></td><td>C</td><td>100%</td><td>8–10%</td><td>Medium</td></tr>
            <tr><td><strong>Government Securities</strong></td><td>G</td><td>100%</td><td>7–9%</td><td>Low</td></tr>
            <tr><td><strong>Alternative Investments</strong></td><td>A</td><td>5%</td><td>9–11%</td><td>Medium-High</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Expert Recommendation:</strong> If you are under 40, choose <strong>LC75 (Aggressive)</strong> in Auto Choice or <strong>75% Equity (E)</strong> in Active Choice. Every 1% higher return over 30 years can add ₹15–25 lakh to your corpus. Use our calculator's Active Choice mode to see the impact of different allocations.
    </div>

    <h2 id="tax-benefits">NPS Tax Benefits — 80CCD Complete Guide 2026</h2>
    <table>
        <thead><tr><th>Section</th><th>Deduction</th><th>Limit</th><th>Old Regime</th><th>New Regime</th><th>Who Can Claim</th></tr></thead>
        <tbody>
            <tr><td><strong>80CCD(1)</strong></td><td>Employee contribution</td><td>10% of Basic+DA (within ₹1.5L 80C cap)</td><td>✅</td><td>❌</td><td>Salaried + Self-employed</td></tr>
            <tr><td><strong>80CCD(1B)</strong></td><td>Additional NPS deduction</td><td>₹50,000 (over and above 80C)</td><td>✅</td><td>✅</td><td>Everyone</td></tr>
            <tr><td><strong>80CCD(2)</strong></td><td>Employer contribution</td><td>10% of Basic+DA (14% for Govt)</td><td>✅</td><td>✅</td><td>Salaried (Corporate NPS)</td></tr>
        </tbody>
    </table>
    <h3>Maximum NPS Tax Saving Worked Example</h3>
    <p>A salaried employee with <strong>Basic + DA = ₹8,00,000/year</strong> in the <strong>30% bracket (Old Regime)</strong>:</p>
    <table>
        <thead><tr><th>Section</th><th>Eligible Amount</th><th>Tax Saved (31.2% incl. cess)</th></tr></thead>
        <tbody>
            <tr><td>80CCD(1) — within 80C</td><td>₹80,000 (10% of ₹8L)</td><td>₹24,960</td></tr>
            <tr><td>80CCD(1B) — additional</td><td>₹50,000</td><td>₹15,600</td></tr>
            <tr><td>80CCD(2) — employer</td><td>₹80,000 (10% of ₹8L)</td><td>₹24,960</td></tr>
            <tr><td><strong>Total NPS Tax Saving</strong></td><td><strong>₹2,10,000</strong></td><td><strong>₹65,520/year</strong></td></tr>
        </tbody>
    </table>
    <p>Over 30 years, this ₹65,520 annual tax saving alone amounts to <strong>₹19.66 lakh</strong> — and if reinvested at 10%, it compounds to <strong>₹1.08 Crore</strong>! Calculate your exact savings using our Tax Benefit mode, or use our <a href="/in/income-tax-calculator">Income Tax Calculator</a> to plan your complete deduction strategy.</p>

    <h2 id="withdrawal-2026">NPS Withdrawal Rules 2026 — New 80:20 Rule</h2>
    <p>PFRDA introduced <strong>major relaxations</strong> in December 2025 for non-government subscribers:</p>
    <table>
        <thead><tr><th>Corpus Size</th><th>Lump Sum</th><th>Mandatory Annuity</th><th>Option</th></tr></thead>
        <tbody>
            <tr><td><strong>≤ ₹8 Lakh</strong></td><td>100%</td><td>0%</td><td>Full withdrawal as lump sum</td></tr>
            <tr><td><strong>₹8L – ₹12L</strong></td><td>Up to ₹6 lakh</td><td>Balance via annuity/SUR</td><td>Systematic Unit Redemption available</td></tr>
            <tr><td><strong>> ₹12 Lakh</strong></td><td>Up to 80%</td><td>Minimum 20%</td><td>New 80:20 rule (prev. 60:40)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>What changed?</strong> The mandatory annuity was reduced from 40% to <strong>20%</strong> for non-government subscribers with corpus above ₹12 lakh. This means up to <strong>80% tax-free lump sum</strong> withdrawal is now possible — a massive improvement in liquidity. Government employees generally continue with the 60:40 rule. Subscribers can now stay invested until <strong>age 75</strong> (extended from 70).
    </div>

    <h2 id="partial-withdrawal">NPS Partial Withdrawal Rules</h2>
    <table>
        <thead><tr><th>Rule</th><th>Details</th></tr></thead>
        <tbody>
            <tr><td><strong>Eligibility</strong></td><td>After 3 years of Tier I membership</td></tr>
            <tr><td><strong>Maximum withdrawals</strong></td><td>4 times during entire NPS tenure</td></tr>
            <tr><td><strong>Gap between withdrawals</strong></td><td>Minimum 4 years</td></tr>
            <tr><td><strong>Amount limit</strong></td><td>Up to 25% of YOUR OWN contributions (not employer's)</td></tr>
            <tr><td><strong>Qualifying reasons</strong></td><td>Children's education, children's marriage, medical treatment (self/family/dependents), house purchase/construction, starting a business</td></tr>
            <tr><td><strong>Tax treatment</strong></td><td>Tax-free withdrawal (no tax on the amount withdrawn)</td></tr>
        </tbody>
    </table>

    <h2 id="pfm-comparison">NPS Pension Fund Managers — Performance Guide</h2>
    <p>PFRDA has registered <strong>11 Pension Fund Managers</strong>. You can change your PFM once per financial year at no cost. Select based on long-term consistency, not just one-year returns:</p>
    <table>
        <thead><tr><th>PFM</th><th>Equity (E) Trend</th><th>Corp Bond (C) Trend</th><th>Govt Bond (G) Trend</th><th>Strength</th></tr></thead>
        <tbody>
            <tr><td><strong>SBI Pension Fund</strong></td><td>Strong</td><td>Good</td><td>Good</td><td>Largest AUM, consistent</td></tr>
            <tr><td><strong>UTI Retirement Solutions</strong></td><td>Good</td><td>Strong</td><td>Good</td><td>Balanced across classes</td></tr>
            <tr><td><strong>HDFC Pension</strong></td><td>Strong</td><td>Good</td><td>Good</td><td>Strong equity track record</td></tr>
            <tr><td><strong>ICICI Pru Pension</strong></td><td>Good</td><td>Good</td><td>Strong</td><td>Debt expertise</td></tr>
            <tr><td><strong>Kotak Pension</strong></td><td>Good</td><td>Good</td><td>Good</td><td>All-rounder</td></tr>
            <tr><td><strong>LIC Pension Fund</strong></td><td>Moderate</td><td>Good</td><td>Strong</td><td>Conservative, government trust</td></tr>
            <tr><td><strong>Aditya Birla Pension</strong></td><td>Good</td><td>Good</td><td>Good</td><td>Newer entrant, competitive</td></tr>
        </tbody>
    </table>
    <p><strong>Pro tip:</strong> You can choose <strong>different PFMs for Tier I and Tier II</strong>. If your Active Choice is equity-heavy, pick a PFM with strong equity returns. For debt-heavy allocation, prioritise corporate bond performance.</p>

    <h2 id="annuity-options">NPS Annuity Options & Providers</h2>
    <table>
        <thead><tr><th>Annuity Type</th><th>Monthly Pension</th><th>Corpus to Nominee</th><th>Spouse Benefit</th><th>Popularity</th></tr></thead>
        <tbody>
            <tr><td><strong>Life Annuity</strong></td><td>Highest</td><td>❌ No</td><td>❌ No</td><td>Low</td></tr>
            <tr><td><strong>Joint Life (50%)</strong></td><td>~90% of Life</td><td>❌ No</td><td>✅ 50% pension</td><td>Medium</td></tr>
            <tr><td><strong>Life + RoP ⭐</strong></td><td>~72% of Life</td><td>✅ Full corpus returned</td><td>❌ No</td><td>Most Popular</td></tr>
            <tr><td><strong>Guaranteed 15 yrs</strong></td><td>~95% of Life</td><td>❌ No (paid to nominee if death in 15 yrs)</td><td>❌ No</td><td>Medium</td></tr>
            <tr><td><strong>Guaranteed 20 yrs</strong></td><td>~92% of Life</td><td>❌ No (paid to nominee if death in 20 yrs)</td><td>❌ No</td><td>Low</td></tr>
        </tbody>
    </table>
    <p><strong>Life with Return of Purchase Price (RoP)</strong> is the most popular choice because it provides a monthly pension while guaranteeing that the <strong>full annuity corpus is returned to your nominee</strong> upon death. The pension is lower (~72%) but the capital is preserved. PFRDA-empanelled insurers include LIC, SBI Life, HDFC Life, ICICI Pru Life, Star Union Dai-ichi, IndiaFirst Life, and Tata AIA Life. Use our <a href="/in/swp-calculator">SWP Calculator</a> to compare NPS annuity income with systematic withdrawal from mutual funds.</p>

    <h2 id="nps-vs-others">NPS vs PPF vs ELSS vs EPF — Which is Better?</h2>
    <table>
        <thead><tr><th>Feature</th><th>NPS</th><th>PPF</th><th>ELSS</th><th>EPF</th></tr></thead>
        <tbody>
            <tr><td><strong>Return Type</strong></td><td>Market-linked (10–12%)</td><td>Fixed (7.1%)</td><td>Market-linked (12–15%)</td><td>Fixed (8.25%)</td></tr>
            <tr><td><strong>Tax Status</strong></td><td>EET (partial taxable)</td><td>EEE (fully tax-free)</td><td>E-E-T (gains taxed)</td><td>EEE (tax-free up to ₹2.5L/yr)</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>Age 60</td><td>15 years</td><td>3 years</td><td>Till retirement</td></tr>
            <tr><td><strong>Extra Tax Benefit</strong></td><td>₹50K 80CCD(1B) + employer 80CCD(2)</td><td>Within 80C only</td><td>Within 80C only</td><td>Within 80C only</td></tr>
            <tr><td><strong>Liquidity</strong></td><td>Low (partial withdrawal only)</td><td>Partial after yr 7</td><td>High after 3 yrs</td><td>Low (partial allowed)</td></tr>
            <tr><td><strong>Employer Match</strong></td><td>✅ Corporate NPS</td><td>❌</td><td>❌</td><td>✅ 12% employer</td></tr>
            <tr><td><strong>Risk</strong></td><td>Moderate (market-linked)</td><td>Zero (govt-backed)</td><td>High (equity)</td><td>Low (govt-set rate)</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Best Strategy for Salaried Employees:</strong> (1) EPF — mandatory, take the employer match. (2) NPS — invest ₹50,000/year to claim 80CCD(1B), especially under New Regime. (3) ELSS — if under Old Regime, use for remaining 80C limit with 3-year liquidity. (4) PPF — for guaranteed, tax-free safety. Compare all options using our calculator. See also: <a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a> for the full NPS+EPF+PPF stack.
    </div>

    <h2 id="govt-vs-private">NPS for Government vs Private Employees</h2>
    <table>
        <thead><tr><th>Feature</th><th>Government NPS</th><th>Corporate/Private NPS</th></tr></thead>
        <tbody>
            <tr><td><strong>Contribution</strong></td><td>10% of Basic+DA (mandatory)</td><td>Voluntary — employer may match</td></tr>
            <tr><td><strong>Employer Match</strong></td><td>14% of Basic+DA (Central Govt)</td><td>Up to 10% of Basic+DA</td></tr>
            <tr><td><strong>80CCD(2) Limit</strong></td><td>14% of Basic+DA</td><td>10% of Basic+DA</td></tr>
            <tr><td><strong>Withdrawal (2026)</strong></td><td>60:40 rule (60% lump sum)</td><td>80:20 rule (80% lump sum)</td></tr>
            <tr><td><strong>PFM Options</strong></td><td>3 PFMs (SBI, UTI, LIC)</td><td>All 11 PFMs available</td></tr>
            <tr><td><strong>Default Choice</strong></td><td>Auto Choice LC50</td><td>Any — Active or Auto</td></tr>
        </tbody>
    </table>

    <h2 id="open-account">How to Open NPS Account Online (eNPS)</h2>
    <ol>
        <li>Visit <strong>enps.nsdl.com</strong> (Protean eNPS portal)</li>
        <li>Click "Registration" → Select "All Citizens" or "Corporate"</li>
        <li>Enter PAN number, Aadhaar, and mobile number for eKYC</li>
        <li>Complete identity verification via Aadhaar OTP or online PAN validation</li>
        <li>Select your <strong>Pension Fund Manager</strong> and <strong>Investment Choice</strong> (Active/Auto)</li>
        <li>Make initial contribution (min ₹500 for Tier I)</li>
        <li>Your PRAN (Permanent Retirement Account Number) is generated instantly</li>
    </ol>
    <p>You can also open NPS through your bank (Point of Presence), employer (Corporate NPS), or through investment platforms. Annual KYC renewal may be required for eNPS accounts.</p>

    <h2 id="formula">NPS Calculator Formula with Example</h2>
    <p>The NPS corpus is calculated using the <strong>Future Value of Annuity</strong> formula:</p>
    <div class="explanation__highlight">
        <strong>FV = PMT × [(1 + r)^n − 1] / r × (1 + r)</strong><br>
        Where: PMT = Monthly contribution, r = Monthly return rate (annual rate / 12), n = Total months of contribution
    </div>
    <h3>Worked Example</h3>
    <p><strong>Age:</strong> 30 | <strong>Retirement:</strong> 60 | <strong>Monthly:</strong> ₹5,000 | <strong>Return:</strong> 10% (blended)</p>
    <table>
        <thead><tr><th>Component</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Investment Period</td><td>30 years (360 months)</td></tr>
            <tr><td>Monthly Rate (r)</td><td>10% / 12 = 0.833%</td></tr>
            <tr><td>Total Invested</td><td>₹5,000 × 360 = ₹18,00,000</td></tr>
            <tr><td><strong>Total Corpus (FV)</strong></td><td><strong>₹1,13,96,627</strong></td></tr>
            <tr><td>Lump Sum (80%) — tax-free</td><td>₹91,17,302</td></tr>
            <tr><td>Annuity Corpus (20%)</td><td>₹22,79,325</td></tr>
            <tr><td>Monthly Pension (at 6%)</td><td>₹11,397/month</td></tr>
        </tbody>
    </table>
    <p>Just ₹5,000/month from age 30 builds a corpus of over <strong>₹1.13 Crore</strong> at retirement! And with the new 80:20 rule, you get ₹91 lakh as a tax-free lump sum. Visualise this growth with our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a>.</p>

    <h2 id="mistakes">7 Common NPS Mistakes to Avoid</h2>
    <ol>
        <li><strong>Not investing the minimum ₹50K for 80CCD(1B):</strong> This is free money — ₹15,600/year tax saving at 30% bracket, available under both regimes.</li>
        <li><strong>Choosing too conservative an allocation when young:</strong> At age 25–35, LC75 or 75% equity gives 2–3% higher returns than LC25 over 30 years.</li>
        <li><strong>Ignoring employer NPS (80CCD(2)):</strong> Ask your employer to contribute via Corporate NPS — the employer's contribution is tax-free for you up to 10% of Basic+DA.</li>
        <li><strong>Not knowing the new 80:20 withdrawal rule:</strong> Many assume 40% must go to annuity — it's now only 20% for non-government subscribers.</li>
        <li><strong>Selecting the wrong annuity type:</strong> Life Annuity gives the highest pension but nothing to family. Choose Life with RoP for family security.</li>
        <li><strong>Treating NPS as the only retirement tool:</strong> NPS should be part of a stack — combine with EPF, PPF, and ELSS. Use our <a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a> to build the complete picture.</li>
        <li><strong>Not reviewing PFM performance:</strong> You can switch PFMs once/year for free. Check annual returns and switch if your PFM consistently underperforms peers.</li>
    </ol>

    <h2 id="related-tools">Related Calculators & Tools</h2>
    <ul>
        <li><strong><a href="/in/retirement-corpus-calculator">Retirement Corpus Calculator</a></strong> — Full NPS + EPF + PPF stack, healthcare inflation, SCSS, post-retirement income planner.</li>
        <li><strong><a href="/in/ppf-calculator">PPF Calculator</a></strong> — Tax-free 7.1% returns, NPS vs PPF for Section 80C planning.</li>
        <li><strong><a href="/in/income-tax-calculator">Income Tax Calculator</a></strong> — Old vs New Regime comparison to maximise 80CCD(1B) + 80C deductions.</li>
        <li><strong><a href="/in/mutual-fund-returns-calculator">Mutual Fund Calculator</a></strong> — MF vs NPS: CAGR, LTCG tax, and post-tax returns comparison.</li>
        <li><strong><a href="/in/sip-calculator">SIP Calculator</a></strong> — Compare NPS returns with mutual fund SIP growth modelling.</li>
        <li><strong><a href="/in/fire-calculator">FIRE Calculator</a></strong> — Early retirement with NPS + MF + EPF combined strategy.</li>
        <li><strong><a href="/in/fd-calculator">FD Calculator</a></strong> — NPS vs Bank FD: market-linked vs guaranteed returns.</li>
        <li><strong><a href="/in/swp-calculator">SWP Calculator</a></strong> — Post-retirement income comparison: NPS annuity vs MF SWP.</li>
        <li><strong><a href="/in/gratuity-calculator">Gratuity Calculator</a></strong> — Complete retirement benefits stack: Gratuity + EPF + NPS.</li>
        <li><strong><a href="/in/compound-interest-calculator">Compound Interest Calculator</a></strong> — Visualise the power of compounding behind NPS corpus growth.</li>
        <li><strong><a href="/in/crorepati-calculator">Crorepati Calculator</a></strong> — When will your NPS + SIP make you a crorepati?</li>
    </ul>
`;

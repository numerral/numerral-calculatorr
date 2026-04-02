import type { Metadata } from "next";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import "../in.css";
import "../../ksa/ksa.css";
import AuthorBadge from "@/components/shared/AuthorBadge";
import PageDesc from "@/components/shared/PageDesc";
import PensionCalculatorIndiaCore from "@/components/calculator/PensionCalculatorIndiaCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { buildCountryAlternates } from "@/lib/geo-seo";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Pension Calculator India 2026 — NPS, EPS, Retirement Corpus & Annuity Planner",
    description: "Free pension calculator for India with 4 modes: Retirement Corpus Planner, NPS Calculator (80CCD tax benefits), EPS/EPFO Pension (formula with early/deferred), and Annuity Income Estimator. Includes NPS vs EPF vs PPF comparison, OPS vs NPS, annuity options guide, and healthcare cost planning.",
    keywords: ["pension calculator India", "NPS calculator", "retirement calculator India", "EPS pension formula", "EPF pension calculator", "annuity calculator India", "retirement corpus calculator", "NPS tax benefits 80CCD", "pension plan India 2026", "old pension scheme vs new pension scheme"],
    alternates: buildCountryAlternates("IN", "/in/pension-calculator", "pension-calculator"),
};

const FAQ_ITEMS = [
    { question: "What is a pension calculator?", answer: "A pension calculator is an online tool that helps you estimate how much money you need to save for retirement and what monthly pension income you can expect. It considers factors like your current age, monthly expenses, inflation rate, life expectancy, existing savings, and expected investment returns. Our calculator offers 4 modes: Retirement Corpus Planner (how much you need), NPS Calculator (National Pension System projections), EPS/EPFO Calculator (Employee Pension Scheme formula), and Annuity Estimator (monthly income from a corpus)." },
    { question: "How much money do I need to retire in India?", answer: "A common guideline is the 25× Rule: multiply your expected annual expenses at retirement by 25. For example, if you expect monthly expenses of ₹1 lakh at retirement → annual = ₹12 lakh → corpus needed = ₹3 Crore. For conservative planning, use the 30× Rule (₹3.6 Cr in this case). Remember: your current ₹50,000/month expenses will become approximately ₹1.61 lakh/month in 20 years at 6% inflation. Use our Retirement Corpus mode above for a personalized estimate." },
    { question: "What is the 25× rule for retirement?", answer: "The 25× Rule (or 4% Rule) states that your retirement corpus should be 25 times your expected annual expenses at retirement. This assumes a 4% safe withdrawal rate — meaning you withdraw 4% of your corpus annually and it should last 25–30 years. Example: ₹1.5 lakh/month expenses → ₹18 lakh/year → need ₹4.5 Crore corpus. The 30× Rule is more conservative, designed for longer retirements or higher inflation expectations." },
    { question: "How is NPS pension calculated?", answer: "NPS pension depends on: (1) Your total accumulated corpus at age 60 (based on monthly contributions × years × market returns), (2) The percentage allocated to annuity (minimum 40%, rest as tax-free lump sum), and (3) The annuity rate from the insurance company. Example: ₹5,000/mo at 10% for 30 years → corpus ≈ ₹1.13 Cr. With 40% to annuity (₹45.2L) at 6% rate → monthly pension ≈ ₹22,600. The 60% lump sum (₹67.8L) is tax-free." },
    { question: "What are NPS tax benefits under Section 80CCD?", answer: "NPS offers three tax deductions: (1) Section 80CCD(1) — Employee contribution up to 10% of salary (self-employed: 20% of income), within the ₹1.5L limit of Section 80C. (2) Section 80CCD(1B) — Additional ₹50,000 deduction exclusively for NPS, over and above the ₹1.5L limit. (3) Section 80CCD(2) — Employer contribution up to 10% of salary (14% for central/state govt employees), no upper limit, fully deductible. At the 30% tax slab, the ₹2 lakh total deduction saves ₹60,000 in tax annually." },
    { question: "What is the EPS pension formula?", answer: "The EPS (Employees' Pension Scheme) monthly pension formula is: Monthly Pension = (Pensionable Salary × Pensionable Service) ÷ 70. Pensionable Salary = average of last 60 months' basic salary + DA (capped at ₹15,000). Pensionable Service = total years of EPS membership (max 35 years; employees with 20+ years service get 2 bonus years). Example: salary ₹15,000, service 30 years → (15,000 × 32) ÷ 70 = ₹6,857/month." },
    { question: "What is the ₹15,000 salary cap for EPS?", answer: "Under EPS-95, the pensionable salary is capped at ₹15,000/month. This means even if your actual basic salary is ₹50,000, the pension calculation uses only ₹15,000. The maximum possible EPS pension = (15,000 × 35+2) ÷ 70 = ₹7,929/month. The 'higher pension' option (under a Supreme Court ruling) allows eligible employees who were members before September 2014 to contribute on their actual full salary instead of the capped amount, resulting in significantly higher pension." },
    { question: "What is the difference between EPF, NPS, and PPF?", answer: "EPF: Employer-mandated (12% each), 8.25% return (FY26), EEE tax status, locked until age 58, includes EPS pension component. NPS: Voluntary/mandatory for govt employees post-2004, market-linked (8-14%), EET tax (annuity income is taxable), locked until 60, additional ₹50K tax benefit under 80CCD(1B). PPF: Voluntary, 7.1% fixed rate, EEE tax status, 15-year lock-in, no pension component — purely savings. For retirement, EPF+NPS combination is ideal: EPF gives safety + guaranteed pension (EPS), NPS gives market-linked growth + additional tax benefits." },
    { question: "What is the difference between OPS and NPS?", answer: "OPS (Old Pension Scheme): Defined benefit — guaranteed pension = 50% of last drawn basic salary, fully funded by government, available only to govt employees who joined before 1 January 2004. No employee contribution required. NPS (New Pension Scheme): Defined contribution — pension depends on corpus accumulated from employee + employer contributions invested in market-linked funds. No guaranteed amount. Employee contributes 10%, employer 14% (central govt). NPS was introduced because OPS was fiscally unsustainable for the government." },
    { question: "What are annuity options in India?", answer: "When purchasing an annuity (mandatory for NPS exit, optional for other retirement corpus), you can choose: (1) Life Annuity — highest monthly payout, stops at death, nothing to nominee. (2) Joint Life Annuity — pension continues to spouse (50-100%) after your death. (3) Life with Return of Purchase Price (RoP) — lower monthly payout but entire corpus is returned to nominee at death. Most popular option. (4) Guaranteed Period (5/10/15/20 years) — pension guaranteed for fixed period even if you die during it. Major annuity providers: LIC, SBI Life, HDFC Life, ICICI Pru." },
    { question: "Is NPS lump sum withdrawal tax-free?", answer: "Yes, the lump sum withdrawal from NPS (up to 60% of the corpus for non-government subscribers, or up to 80% under the 2024 amendment) is completely tax-free under Section 10(12A) of the Income Tax Act. However, the monthly pension received from the annuity purchased with the remaining corpus IS taxable at your applicable income tax slab rate. This is why NPS has EET (Exempt-Exempt-Taxed) status — contributions are exempt (80CCD), corpus growth is exempt, but annuity income is taxed." },
    { question: "What is medical inflation and how does it affect retirement?", answer: "Medical inflation in India runs at 10-14% per year — roughly double the general inflation rate of 5-6%. This means healthcare costs double every 5-7 years. A hospitalization that costs ₹5 lakh today could cost ₹25-40 lakh in 20 years. For retirement planning, you must: (1) Maintain a separate healthcare corpus or comprehensive health insurance, (2) Account for medical inflation separately from general inflation, (3) Budget ₹50-75 lakh additional corpus specifically for healthcare in retirement. Our calculator uses general inflation; add 3-4% to the inflation rate for healthcare-heavy budgets." },
    { question: "What is the minimum pension under EPS?", answer: "The minimum pension under the Employees' Pension Scheme (EPS-95) is ₹1,000 per month, as set by the Government of India. This applies to all EPS pensioners regardless of the calculated formula amount. Widow pension minimum is also ₹1,000/month. Children's pension (for up to 2 children till age 25) = 25% of the pension. Orphan pension = 75% of pension per child. There have been ongoing demands to increase the minimum EPS pension to ₹7,500-₹9,000, but no change has been implemented as of March 2026." },
    { question: "How to calculate retirement corpus with inflation?", answer: "Step 1: Inflate current expenses to retirement age: Future Monthly Expenses = Current Expenses × (1 + inflation)^years. Example: ₹50,000 × (1.06)^30 = ₹2,87,175/month. Step 2: Calculate corpus needed using the Present Value of Annuity formula, which considers post-retirement returns and retirement duration. Step 3: Subtract existing savings (grown at pre-retirement returns). Step 4: Calculate the monthly SIP needed to bridge the gap. Our Retirement Corpus mode above does all 4 steps automatically — just enter your numbers." },
    { question: "What is the best retirement plan in India 2026?", answer: "There is no single 'best' plan — a diversified approach is recommended: (1) EPF — foundational safety net with 8.25% returns + EPS pension, mandatory for salaried. (2) NPS — additional ₹50,000 tax benefit under 80CCD(1B), market-linked growth, mandatory annuity. (3) PPF — 7.1% guaranteed, EEE tax-free, ideal for conservative portion. (4) Equity Mutual Fund SIPs — highest long-term returns (12-15%), essential for beating inflation. (5) Term Insurance — protects family during accumulation phase. (6) Health Insurance — separate from retirement corpus. The ideal mix: EPF + NPS (tax optimization) + SIP (growth) + PPF (safety) + insurance (protection)." },
];

export default function PensionCalculatorPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "India Calculators", url: `${SITE_URL}/in` },
            { name: "Pension Calculator" },
        ]),
        webAppSchema("Pension Calculator India 2026", canonicalUrl("/in/pension-calculator")),
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
            <Script id="schema-pension" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators", href: "/in" },
                { label: "Pension Calculator" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Pension Calculator India 2026</h1>
            <PageDesc>
                Plan your retirement with 4 modes — Retirement Corpus Planner, NPS Calculator (with 80CCD tax savings),
                EPS/EPFO Pension (formula with early/deferred adjustments), and Annuity Income Estimator. Includes NPS vs EPF vs PPF comparison,
                OPS vs NPS analysis, annuity options guide, and India-specific healthcare cost planning.
            </PageDesc>
            <AuthorBadge categoryKey="salary" />
            <PensionCalculatorIndiaCore />

            <section className="in-content">
                <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            </section>

            <FAQAccordion title="Pension Calculator FAQ — India 2026" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
    <h2 id="what-is-pension-calculator">What Is a Pension Calculator?</h2>
    <p>A <strong>pension calculator</strong> is a financial planning tool that helps you estimate how much money you need to accumulate for a comfortable retirement and what monthly pension income you can expect from your savings. In India, where only about <strong>10% of the workforce</strong> has access to formal pension schemes, retirement planning is critically important.</p>
    <p>Unlike countries with robust social security systems, most Indians must self-fund their retirement through a combination of EPF, NPS, PPF, mutual funds, and personal savings. Our calculator covers all major India-specific pension instruments with 4 dedicated modes.</p>
    <div class="explanation__highlight">
        <strong>India&rsquo;s Retirement Reality:</strong> India&rsquo;s old-age dependency ratio is projected to reach 20% by 2050 (from 10% in 2020). With increasing life expectancy (now 72+ years) and medical inflation at 10&ndash;14%, a typical Indian needs a retirement corpus of <strong>₹2&ndash;5 Crore</strong> to maintain their current lifestyle. Start with our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to see how early investing makes this achievable.
    </div>

    <h2 id="how-much-to-retire">How Much Money Do You Need to Retire in India?</h2>
    <p>Two popular rules help estimate your retirement corpus:</p>
    <table>
        <thead><tr><th>Rule</th><th>Formula</th><th>Withdrawal Rate</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>25&times; Rule</strong></td><td>Annual Expenses at Retirement &times; 25</td><td>4% per year</td><td>Standard retirement (20&ndash;25 years)</td></tr>
            <tr><td><strong>30&times; Rule</strong></td><td>Annual Expenses at Retirement &times; 30</td><td>3.3% per year</td><td>Conservative / early retirement</td></tr>
        </tbody>
    </table>
    <h3>Worked Example — ₹50,000/month Lifestyle</h3>
    <table>
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Current monthly expenses</td><td>₹50,000</td></tr>
            <tr><td>Years to retirement</td><td>25 years (age 35 → 60)</td></tr>
            <tr><td>Inflation</td><td>6%</td></tr>
            <tr><td>Monthly expenses at 60</td><td><strong>₹2,14,594</strong></td></tr>
            <tr><td>Annual expenses at 60</td><td>₹25,75,128</td></tr>
            <tr><td><strong>Corpus (25&times; Rule)</strong></td><td><strong>₹6.44 Crore</strong></td></tr>
            <tr><td><strong>Corpus (30&times; Rule)</strong></td><td><strong>₹7.73 Crore</strong></td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Reality Check:</strong> ₹50,000 monthly expenses today become <strong>₹2.15 lakh/month</strong> in 25 years at 6% inflation. This is why starting early with <a href="/in/sip-calculator">SIP investments</a> is non-negotiable — even ₹10,000/month started 25 years early can grow to ₹1.9 Crore at 12% returns.
    </div>

    <h2 id="nps-guide">NPS — National Pension System Complete Guide</h2>
    <p>The <strong>National Pension System (NPS)</strong> is a government-backed, market-linked retirement scheme regulated by PFRDA. It was made mandatory for new central government employees from January 1, 2004, and is now open to all Indian citizens aged 18&ndash;70.</p>
    <h3>NPS Tier 1 vs Tier 2</h3>
    <table>
        <thead><tr><th>Feature</th><th>Tier 1 (Mandatory)</th><th>Tier 2 (Voluntary)</th></tr></thead>
        <tbody>
            <tr><td><strong>Purpose</strong></td><td>Long-term retirement</td><td>Flexible savings/investment</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>Until age 60</td><td>No lock-in; withdraw anytime</td></tr>
            <tr><td><strong>Tax benefit</strong></td><td>✅ 80CCD(1), 80CCD(1B), 80CCD(2)</td><td>❌ (only for central govt employees)</td></tr>
            <tr><td><strong>Min. contribution</strong></td><td>₹500/month or ₹6,000/year</td><td>₹250/month</td></tr>
            <tr><td><strong>At maturity</strong></td><td>60% lump sum + 40% annuity</td><td>Full withdrawal</td></tr>
        </tbody>
    </table>
    <h3>NPS Tax Benefits (Section 80CCD)</h3>
    <table>
        <thead><tr><th>Section</th><th>Deduction Limit</th><th>Applies To</th><th>Tax Saved (30% slab)</th></tr></thead>
        <tbody>
            <tr><td><strong>80CCD(1)</strong></td><td>Up to 10% of salary (within ₹1.5L of 80C)</td><td>Employee contribution</td><td>Up to ₹45,000/yr</td></tr>
            <tr><td><strong>80CCD(1B)</strong></td><td><strong>Additional ₹50,000</strong> (over 80C limit)</td><td>Employee contribution</td><td><strong>₹15,000/yr</strong></td></tr>
            <tr><td><strong>80CCD(2)</strong></td><td>Up to 10% of salary (14% for govt)</td><td>Employer contribution</td><td>No cap</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Max Tax Savings:</strong> An employee in the 30% bracket can save up to <strong>₹60,000+ per year</strong> in tax through NPS (₹1.5L under 80C + ₹50K under 80CCD(1B)). Over 30 years, this tax saving alone compounds to over <strong>₹1 Crore</strong> if reinvested.
    </div>
    <h3>NPS Exit Rules (At Age 60)</h3>
    <ul>
        <li><strong>60% Lump Sum</strong> — Withdraw up to 60% of corpus <strong>tax-free</strong> under Section 10(12A)</li>
        <li><strong>40% Annuity</strong> — Minimum 40% must be used to purchase an annuity from a PFRDA-registered ASP (LIC, SBI Life, HDFC Life, etc.)</li>
        <li><strong>2024 Amendment:</strong> Non-government subscribers can now withdraw up to <strong>80%</strong> as lump sum (minimum 20% annuity)</li>
        <li><strong>Small corpus (&le;₹8 Lakh):</strong> Can withdraw 100% without purchasing annuity</li>
    </ul>

    <h2 id="eps-formula">EPS — Employees&rsquo; Pension Scheme Formula</h2>
    <p>The <strong>Employees&rsquo; Pension Scheme (EPS-95)</strong> provides a defined-benefit monthly pension to EPF members after retirement at age 58.</p>
    <div class="explanation__highlight">
        <strong>EPS Pension Formula:</strong><br/>
        <strong>Monthly Pension = (Pensionable Salary &times; Pensionable Service) &divide; 70</strong><br/><br/>
        <strong>Pensionable Salary</strong> = Average of last 60 months&rsquo; (Basic + DA) — capped at ₹15,000<br/>
        <strong>Pensionable Service</strong> = Total years of EPS membership (max 35 years)<br/>
        <strong>Bonus:</strong> 20+ years of service = 2 additional years credited<br/>
        <strong>Minimum pension</strong> = ₹1,000/month (guaranteed by government)
    </div>
    <h3>EPS Pension Types</h3>
    <table>
        <thead><tr><th>Type</th><th>Age</th><th>Adjustment</th><th>Condition</th></tr></thead>
        <tbody>
            <tr><td><strong>Normal</strong></td><td>58 years</td><td>None (full pension)</td><td>Minimum 10 years service</td></tr>
            <tr><td><strong>Early</strong></td><td>50&ndash;57 years</td><td><strong>&minus;4% per year</strong> before 58</td><td>Minimum 10 years service</td></tr>
            <tr><td><strong>Deferred</strong></td><td>59&ndash;60 years</td><td><strong>+4% per year</strong> after 58 (max 2 years)</td><td>Optional deferment</td></tr>
        </tbody>
    </table>
    <h3>Higher Pension (Supreme Court Ruling)</h3>
    <p>Employees who were EPS members before September 1, 2014, can opt for pension calculated on <strong>actual salary</strong> (not the ₹15,000 cap). Example: if your actual average salary is ₹60,000 with 30+2 years service → pension = (60,000 &times; 32) / 70 = <strong>₹27,429/month</strong> instead of ₹6,857. Check eligibility on the EPFO Unified Portal.</p>

    <h2 id="epf-nps-ppf-comparison">EPF vs NPS vs PPF — Complete Comparison</h2>
    <table>
        <thead><tr><th>Feature</th><th>EPF</th><th>NPS</th><th>PPF</th></tr></thead>
        <tbody>
            <tr><td><strong>Type</strong></td><td>Provident Fund + Pension</td><td>Defined Contribution</td><td>Savings Scheme</td></tr>
            <tr><td><strong>Returns</strong></td><td>8.25% (FY26, fixed)</td><td>8&ndash;14% (market-linked)</td><td>7.1% (govt-set, fixed)</td></tr>
            <tr><td><strong>Tax Status</strong></td><td>EEE (fully exempt)</td><td>EET (annuity taxable)</td><td>EEE (fully exempt)</td></tr>
            <tr><td><strong>Lock-in</strong></td><td>Until age 58</td><td>Until age 60</td><td>15 years</td></tr>
            <tr><td><strong>Employer Match</strong></td><td>✅ 12% of basic</td><td>✅ 14% (central govt)</td><td>❌ No</td></tr>
            <tr><td><strong>Pension Component</strong></td><td>✅ EPS monthly pension</td><td>✅ Via annuity purchase</td><td>❌ No monthly pension</td></tr>
            <tr><td><strong>Extra Tax Benefit</strong></td><td>Within 80C only</td><td><strong>₹50K under 80CCD(1B)</strong></td><td>Within 80C only</td></tr>
            <tr><td><strong>Flexibility</strong></td><td>Low (employer-linked)</td><td>Moderate (auto/active choice)</td><td>High (voluntary)</td></tr>
            <tr><td><strong>Best For</strong></td><td>Salaried employees (mandatory)</td><td>Additional tax savings + growth</td><td>Conservative, tax-free savings</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Ideal Retirement Stack:</strong> EPF (foundation, guaranteed 8.25%) + NPS (growth, extra ₹50K tax benefit) + <a href="/in/ppf-calculator">PPF</a> (safety, EEE) + <a href="/in/sip-calculator">Equity SIP</a> (wealth creation, 12&ndash;15%) + Term Insurance (family protection via <a href="/in/hlv-calculator">HLV Calculator</a>).
    </div>

    <h2 id="ops-vs-nps">Old Pension Scheme (OPS) vs New Pension Scheme (NPS)</h2>
    <p>This comparison is critical for government employees and those following the ongoing OPS vs NPS debate:</p>
    <table>
        <thead><tr><th>Feature</th><th>OPS (Old Pension Scheme)</th><th>NPS (New Pension Scheme)</th></tr></thead>
        <tbody>
            <tr><td><strong>Type</strong></td><td>Defined Benefit (guaranteed amount)</td><td>Defined Contribution (market-linked)</td></tr>
            <tr><td><strong>Pension Amount</strong></td><td><strong>50% of last drawn basic salary</strong></td><td>Depends on corpus &amp; annuity choice</td></tr>
            <tr><td><strong>Employee Contribution</strong></td><td>None (fully government-funded)</td><td>10% of salary (Basic + DA)</td></tr>
            <tr><td><strong>Employer Contribution</strong></td><td>Fully funded by government</td><td>14% of salary (central govt)</td></tr>
            <tr><td><strong>DA Benefits</strong></td><td>✅ Pension increases with DA revision</td><td>❌ No DA linkage</td></tr>
            <tr><td><strong>Applicable To</strong></td><td>Govt employees joined <strong>before 1 Jan 2004</strong></td><td>Govt employees joined <strong>after 1 Jan 2004</strong></td></tr>
            <tr><td><strong>Risk</strong></td><td>None (government guarantee)</td><td>Market risk on corpus</td></tr>
            <tr><td><strong>Family Pension</strong></td><td>✅ Spouse gets ~60% pension</td><td>Only if joint life annuity purchased</td></tr>
            <tr><td><strong>Government Burden</strong></td><td>Very high (unsustainable)</td><td>Lower (funded by contributions)</td></tr>
        </tbody>
    </table>

    <h2 id="annuity-options">Annuity Options in India — Complete Guide</h2>
    <p>When you exit NPS or invest a retirement corpus, you must purchase an annuity plan. Here are the 4 major types:</p>
    <table>
        <thead><tr><th>Annuity Type</th><th>Monthly Payout</th><th>On Death</th><th>Corpus Return</th><th>Best For</th></tr></thead>
        <tbody>
            <tr><td><strong>Life Annuity</strong></td><td>Highest</td><td>Pension stops</td><td>❌ No</td><td>Single, no dependents</td></tr>
            <tr><td><strong>Joint Life Annuity</strong></td><td>Moderate (∼90%)</td><td>Spouse gets 50&ndash;100%</td><td>❌ No</td><td>Married couples</td></tr>
            <tr><td><strong>Life with RoP</strong></td><td>Lower (∼72%)</td><td>Corpus to nominee</td><td>✅ Full corpus</td><td>Family with dependents</td></tr>
            <tr><td><strong>Guaranteed Period</strong></td><td>Moderate (∼95%)</td><td>Pension continues for period</td><td>❌ No</td><td>Uncertain health</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Most Popular:</strong> &ldquo;Life Annuity with Return of Purchase Price&rdquo; is the most popular option in India because it provides lifetime income AND returns the full corpus to nominees. It scores lower monthly income but highest family security. Major annuity providers: LIC, SBI Life, HDFC Life, ICICI Prudential.
    </div>

    <h2 id="tax-treatment">Tax Treatment of Pension Income in India</h2>
    <table>
        <thead><tr><th>Source</th><th>What&rsquo;s Taxable</th><th>What&rsquo;s Exempt</th></tr></thead>
        <tbody>
            <tr><td><strong>NPS Lump Sum (60%)</strong></td><td>—</td><td>✅ Fully exempt [Section 10(12A)]</td></tr>
            <tr><td><strong>NPS Annuity Income</strong></td><td>📋 Taxable at slab rate</td><td>—</td></tr>
            <tr><td><strong>EPF Withdrawal</strong></td><td>—</td><td>✅ Exempt if service &ge; 5 years</td></tr>
            <tr><td><strong>EPS Monthly Pension</strong></td><td>📋 Taxable at slab rate</td><td>—</td></tr>
            <tr><td><strong>Employer Pension (Gratuity)</strong></td><td>Above ₹20L is taxable</td><td>✅ Up to ₹20 lakh exempt</td></tr>
            <tr><td><strong><a href="/in/ppf-calculator">PPF</a> Maturity</strong></td><td>—</td><td>✅ Fully exempt (EEE)</td></tr>
            <tr><td><strong>Annuity from Insurance</strong></td><td>📋 Pension taxable at slab</td><td>Commuted portion may be exempt</td></tr>
        </tbody>
    </table>

    <h2 id="healthcare-costs">Healthcare Costs in Retirement — India</h2>
    <p>Medical inflation in India is <strong>10&ndash;14% per year</strong> &mdash; nearly double the general inflation rate. This is the single biggest risk to your retirement corpus:</p>
    <table>
        <thead><tr><th>Medical Expense</th><th>Cost Today</th><th>Cost in 20 Years (12% medical inflation)</th></tr></thead>
        <tbody>
            <tr><td>Heart bypass surgery</td><td>₹3&ndash;5 Lakh</td><td>₹29&ndash;48 Lakh</td></tr>
            <tr><td>Knee replacement (single)</td><td>₹2.5&ndash;4 Lakh</td><td>₹24&ndash;39 Lakh</td></tr>
            <tr><td>Cancer treatment (avg)</td><td>₹5&ndash;20 Lakh</td><td>₹48 Lakh&ndash;₹1.93 Cr</td></tr>
            <tr><td>Monthly medicines (chronic)</td><td>₹3,000&ndash;8,000/mo</td><td>₹29,000&ndash;₹77,000/mo</td></tr>
        </tbody>
    </table>
    <div class="explanation__highlight">
        <strong>Action Steps:</strong> (1) Maintain health insurance with ₹20&ndash;50 lakh cover — premium is cheaper if bought young. (2) Build a separate healthcare corpus of ₹50&ndash;75 lakh (not part of retirement corpus). (3) Consider a Super Top-Up plan for catastrophic coverage. (4) Use our <a href="/in/compound-interest-calculator">Compound Interest Calculator</a> to project healthcare corpus growth.
    </div>

    <h2 id="planning-by-age">Retirement Planning by Age — Action Checklist</h2>
    <table>
        <thead><tr><th>Age</th><th>Priority Actions</th><th>Target Allocation</th></tr></thead>
        <tbody>
            <tr><td><strong>25&ndash;30</strong></td><td>Start <a href="/in/sip-calculator">SIP</a>, open NPS (80CCD(1B)), build emergency fund</td><td>80% Equity, 15% Debt, 5% Gold</td></tr>
            <tr><td><strong>30&ndash;35</strong></td><td>Increase SIP (&ge;20% of income), maximize EPF, term insurance</td><td>75% Equity, 20% Debt, 5% Gold</td></tr>
            <tr><td><strong>35&ndash;40</strong></td><td>Review <a href="/in/hlv-calculator">HLV</a>, top-up health insurance, start PPF</td><td>65% Equity, 30% Debt, 5% Gold</td></tr>
            <tr><td><strong>40&ndash;45</strong></td><td>Assess corpus gap, increase NPS allocation, plan children&rsquo;s education separately</td><td>55% Equity, 40% Debt, 5% Gold</td></tr>
            <tr><td><strong>45&ndash;50</strong></td><td>Shift to balanced funds, consider <a href="/in/ppf-calculator">PPF</a> extensions, build healthcare corpus</td><td>40% Equity, 50% Debt, 10% Gold</td></tr>
            <tr><td><strong>50&ndash;55</strong></td><td>De-risk portfolio, consolidate accounts, plan annuity strategy</td><td>30% Equity, 60% Debt, 10% Gold</td></tr>
            <tr><td><strong>55&ndash;60</strong></td><td>Finalize NPS exit plan, choose annuity type, set up SWP</td><td>20% Equity, 70% Debt, 10% Gold</td></tr>
        </tbody>
    </table>

    <h2 id="common-mistakes">Common Retirement Planning Mistakes</h2>
    <ol>
        <li><strong>Starting too late</strong> — A 10-year delay can cost ₹2&ndash;3 Crore in final corpus. Use our <a href="/in/compound-interest-calculator">Cost of Delay tool</a> to see the impact.</li>
        <li><strong>Ignoring inflation</strong> — ₹50,000 today = ₹2.15 lakh in 25 years at 6% inflation. Never plan in today&rsquo;s rupees.</li>
        <li><strong>Underestimating healthcare</strong> — Medical costs inflate at 10&ndash;14%, not 6%. Budget a separate healthcare corpus.</li>
        <li><strong>Relying solely on EPF</strong> — EPF alone won&rsquo;t suffice. The maximum EPS pension is only ₹7,929/month.</li>
        <li><strong>Not using NPS tax benefits</strong> — Missing the extra ₹50,000 under 80CCD(1B) means losing ₹15,000 in tax savings every year.</li>
        <li><strong>Choosing wrong annuity</strong> — Life Annuity gives highest income but nothing to family. Consider &ldquo;Life with RoP&rdquo; for family security.</li>
        <li><strong>No term insurance during accumulation</strong> — If the earning member dies, the retirement plan collapses. Calculate adequate cover with our <a href="/in/hlv-calculator">HLV Calculator</a>.</li>
    </ol>

    <h2 id="excel-formula">How to Calculate Retirement Corpus in Excel</h2>
    <div class="explanation__highlight">
        <strong>Future Monthly Expenses (inflation-adjusted):</strong><br/>
        =Current_Expenses * POWER(1 + Inflation%, Years_to_Retire)<br/>
        Example: =50000 * POWER(1+6%/100, 25) = <strong>₹2,14,594</strong>
    </div>
    <div class="explanation__highlight">
        <strong>Retirement Corpus (PV of annuity):</strong><br/>
        =PV(PostReturn% - Inflation%, Retirement_Years, -Annual_Expenses, 0, 1)<br/>
        <em>Note: Use real return rate = post-retirement return &minus; inflation</em>
    </div>
    <div class="explanation__highlight">
        <strong>Monthly SIP to Bridge Gap:</strong><br/>
        =PMT(PreReturn%/12, Years*12, 0, -Gap_Amount)<br/>
        Example: =PMT(10%/12, 25*12, 0, -50000000) = <strong>₹3,768/month</strong> to accumulate ₹50L gap
    </div>
`;

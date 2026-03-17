// Dynamic Hub — /tax-calculators/[calculator]/
// Each tax calculator gets its own hub page with calculator + explanation + FAQ

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import TaxCalculatorCore from "@/components/calculator/TaxCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export function generateStaticParams() {
    return getCalculatorsByCategory("tax").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("tax").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/tax-calculators/${calc.slug}`) },
    };
}

// Hub content per tax calculator
const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "income-tax-calculator": {
        subtitle: "Estimate your 2025 federal income tax refund or amount owed. Includes all filing statuses, standard & itemized deductions, credits, and FICA.",
        explanation: {
            heading: "Understanding U.S. Federal Income Tax",
            paragraphs: [
                "The U.S. uses a progressive federal income tax system with seven marginal tax brackets for 2025: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Your marginal rate applies only to income within each bracket — not your entire income. For example, a single filer earning $75,000 pays 10% on the first $11,925, 12% on $11,925–$48,475, and 22% on $48,475–$60,000 (after the $15,000 standard deduction).",
                "Most taxpayers choose the standard deduction — $15,000 for single filers, $30,000 for married filing jointly in 2025. Itemizing makes sense when your mortgage interest, state & local taxes (SALT, capped at $40,000), charitable donations, and medical expenses (above 7.5% of AGI) exceed the standard deduction.",
                "Beyond income tax, employees pay FICA payroll taxes: 6.2% Social Security (on wages up to $176,100) and 1.45% Medicare (plus 0.9% surtax on wages above $200,000 for single filers). The Child Tax Credit is $2,000 per qualifying child under 17.",
            ],
            highlight: "Single filer, $75,000 wages, standard deduction → Taxable income: $60,000 → Federal tax: ~$8,600 → Effective rate: ~11.5%. Add FICA ($5,738) for a total tax burden of ~$14,338 (19.1% of income).",
        },
        faq: [
            { question: "What are the 2025 federal income tax brackets?", answer: "There are seven brackets: 10% ($0–$11,925), 12% ($11,925–$48,475), 22% ($48,475–$103,350), 24% ($103,350–$197,300), 32% ($197,300–$250,525), 35% ($250,525–$626,350), and 37% (above $626,350) for single filers. Married Filing Jointly brackets are roughly doubled." },
            { question: "What is the standard deduction for 2025?", answer: "$15,000 for Single and Married Filing Separately, $30,000 for Married Filing Jointly, and $22,500 for Head of Household. Most taxpayers (roughly 90%) choose the standard deduction over itemizing." },
            { question: "Should I take the standard deduction or itemize?", answer: "Itemize if your total deductible expenses (mortgage interest, charitable donations, state & local taxes up to $40,000, and medical expenses above 7.5% of AGI) exceed the standard deduction. Our calculator compares both and tells you which saves more." },
            { question: "How is the Child Tax Credit calculated?", answer: "The Child Tax Credit is $2,000 per qualifying child under 17. It begins phasing out at $200,000 AGI for single filers ($400,000 for joint). Up to $1,700 per child may be refundable as the Additional Child Tax Credit." },
            { question: "What is FICA and how much do I pay?", answer: "FICA stands for Federal Insurance Contributions Act and funds Social Security and Medicare. Employees pay 6.2% for Social Security (on wages up to $176,100) and 1.45% for Medicare (no wage cap). An additional 0.9% Medicare surtax applies to wages above $200,000 for single filers." },
        ],
    },
    "gst-calculator": {
        subtitle: "Calculate GST instantly — CGST, SGST & IGST split for any amount at 5%, 12%, 18% or 28%.",
        explanation: {
            heading: "Understanding GST Calculation",
            paragraphs: [
                "GST (Goods and Services Tax) is levied at 4 main rates: 5% (essential items), 12% (standard goods), 18% (most services), and 28% (luxury/sin goods). The tax is split into CGST + SGST for intra-state supply, or IGST for inter-state.",
                "When calculating GST, the mode matters: 'Exclusive' adds GST on top of the base price, while 'Inclusive' means GST is already included in the price — the calculator extracts the base amount and GST component.",
            ],
            highlight: "₹10,000 product at 18% GST exclusive = ₹11,800 total (CGST ₹900 + SGST ₹900). The same ₹10,000 at 18% inclusive = ₹8,475 base + ₹1,525 GST.",
        },
        faq: [
            { question: "What is the difference between CGST, SGST, and IGST?", answer: "CGST (Central GST) and SGST (State GST) apply to intra-state transactions — the rate is split equally between both. IGST (Integrated GST) applies to inter-state transactions — the full rate goes to the central government." },
            { question: "How do I know if GST is inclusive or exclusive?", answer: "MRP on consumer products is always GST-inclusive. B2B invoices usually show GST-exclusive prices. Check the invoice — if it says 'plus GST' or shows GST separately, it's exclusive." },
            { question: "Which GST rate applies to my product?", answer: "Check the HSN/SAC code for your product/service. Essential items (food, medicine) are at 5%, most goods at 12-18%, services at 18%, and luxury items (cars, tobacco) at 28%." },
        ],
    },
    "hra-exemption-calculator": {
        subtitle: "Calculate how much of your HRA is tax-exempt. Compare all 3 HRA rules to find your maximum exemption.",
        explanation: {
            heading: "How HRA Exemption Works",
            paragraphs: [
                "HRA (House Rent Allowance) exemption is available under Section 10(13A) for salaried employees who pay rent. The exempt amount is the LOWEST of three values: actual HRA received, 50% of basic (metro) / 40% (non-metro), or rent paid minus 10% of basic salary.",
                "Metro cities for HRA purposes include Delhi, Mumbai, Kolkata, and Chennai. If you live in any other city, you get 40% of basic instead of 50%. The HRA exemption is only available under the Old Tax Regime.",
            ],
            highlight: "Basic: ₹50K/month, HRA: ₹25K/month, Rent: ₹20K/month (Mumbai) → Exemption = ₹15K/month (Rent − 10% Basic = lowest). Annual savings: ₹1,80,000 exempt from tax.",
        },
        faq: [
            { question: "Can I claim HRA if I own a house?", answer: "Yes, if you live in a rented house in a different city than your owned property. You can claim both HRA exemption and home loan interest deduction (Section 24b) simultaneously." },
            { question: "Is HRA available under the New Tax Regime?", answer: "No. HRA exemption under Section 10(13A) is not available under the New Regime. This is one reason why the Old Regime can be better for those claiming HRA + other deductions." },
            { question: "What documents do I need for HRA claim?", answer: "Rent receipts (monthly), rental agreement, and landlord's PAN if rent exceeds ₹1,00,000/year. Some employers also require a declaration form." },
        ],
    },
    "tds-calculator": {
        subtitle: "Calculate TDS deduction on salary, rent, professional fees, property sale, FD interest & other income types for FY 2025-26. Know the exact TDS rate, threshold, and section applicable.",
        explanation: {
            heading: "Understanding TDS (Tax Deducted at Source)",
            paragraphs: [
                "TDS (Tax Deducted at Source) is a mechanism under the Indian Income Tax Act where the payer deducts tax at a prescribed rate before making a payment to the recipient. The deducted amount is deposited with the government on behalf of the recipient. Different income types have different TDS sections, thresholds, and rates — salary (Section 192), bank interest (194A), rent (194I/194IB), professional fees (194J), property sale (194IA), and many more.",
                "Each payment type has a threshold below which no TDS is deducted. If you don't provide your PAN, TDS is deducted at the higher rate of 20%. If you haven't filed ITR for past 2 years, Section 206AB mandates TDS at double the prescribed rate or 5%, whichever is higher. TDS can be claimed as credit when filing your income tax return.",
            ],
            highlight: "₹12 Lakh CTC salary → Employer deducts ~₹0 TDS (New Regime, FY 25-26, income up to ₹12.75L is tax-free). But ₹15 Lakh salary → ~₹4,680/month TDS under New Regime. Submit investment proofs (80C, 80D, HRA under Old Regime) to reduce TDS.",
        },
        contentHTML: `<h3>What Is TDS (Tax Deducted at Source)?</h3>
            <p><strong>TDS</strong> is a system introduced by the Income Tax Department of India to collect tax at the point where income is generated. Instead of waiting for the taxpayer to pay tax at year-end, the government collects it in advance from the payer (employer, bank, tenant, etc.). This ensures regular cash flow to the government and reduces tax evasion.</p>
            <p>The payer (called <strong>deductor</strong>) deducts TDS and deposits it with the government using their TAN (Tax Deduction and Collection Account Number). The recipient (called <strong>deductee</strong>) receives the net amount and can claim credit for the TDS when filing their income tax return.</p>

            <h3>TDS Rates by Section — FY 2025-26</h3>
            <table>
                <tr><th>Section</th><th>Nature of Payment</th><th>Threshold (₹/year)</th><th>TDS Rate</th></tr>
                <tr><td><strong>192</strong></td><td>Salary</td><td>Basic exemption limit</td><td>Average rate of tax (slab-based)</td></tr>
                <tr><td><strong>194A</strong></td><td>Interest (Bank FD, RD)</td><td>₹40,000 (₹50,000 for seniors)</td><td>10%</td></tr>
                <tr><td><strong>194B</strong></td><td>Lottery / Game show winnings</td><td>₹10,000</td><td>30%</td></tr>
                <tr><td><strong>194C</strong></td><td>Contractor payments</td><td>₹30,000 (single) / ₹1,00,000 (annual)</td><td>1% (Individual) / 2% (Others)</td></tr>
                <tr><td><strong>194H</strong></td><td>Commission / Brokerage</td><td>₹15,000</td><td>5%</td></tr>
                <tr><td><strong>194I</strong></td><td>Rent (by business/company)</td><td>₹2,40,000</td><td>2% (plant) / 10% (land/building)</td></tr>
                <tr><td><strong>194IB</strong></td><td>Rent (by individual ≥₹50K/month)</td><td>₹50,000/month</td><td>5%</td></tr>
                <tr><td><strong>194IA</strong></td><td>Property purchase (≥₹50L)</td><td>₹50,00,000</td><td>1%</td></tr>
                <tr><td><strong>194J</strong></td><td>Professional / Technical fees</td><td>₹30,000</td><td>10% (Professional) / 2% (Technical)</td></tr>
                <tr><td><strong>194N</strong></td><td>Cash withdrawal (above limit)</td><td>₹1 Crore</td><td>2%</td></tr>
                <tr><td><strong>194Q</strong></td><td>Purchase of goods (≥₹50L)</td><td>₹50,00,000</td><td>0.1%</td></tr>
                <tr><td><strong>195</strong></td><td>Payment to NRI</td><td>No threshold</td><td>20-40% (varies by income type)</td></tr>
            </table>
            <p><strong>Note:</strong> If PAN is not provided, TDS is deducted at 20% (or the applicable rate, whichever is higher). For non-filers of ITR (Section 206AB), TDS is double the prescribed rate or 5%, whichever is higher.</p>

            <h3>TDS on Salary — How It Works</h3>
            <p>TDS on salary under Section 192 is unique because it's calculated based on the <strong>estimated annual income</strong> and applicable slab rates — not a flat percentage.</p>
            <table>
                <tr><th>Step</th><th>Calculation</th></tr>
                <tr><td>1. Estimate annual salary (Gross)</td><td>Monthly salary × 12 + bonus + other income declared</td></tr>
                <tr><td>2. Deduct standard deduction</td><td>₹75,000 (New Regime) / ₹50,000 (Old Regime)</td></tr>
                <tr><td>3. Deduct exemptions (Old Regime)</td><td>HRA, 80C, 80D, 80CCD1B, LTA, etc.</td></tr>
                <tr><td>4. Calculate taxable income</td><td>Step 1 − Step 2 − Step 3</td></tr>
                <tr><td>5. Apply tax slab rates</td><td>New Regime: 0% / 5% / 10% / 15% / 20% / 25% / 30%</td></tr>
                <tr><td>6. Add 4% Health & Education Cess</td><td>Tax × 1.04</td></tr>
                <tr><td>7. Monthly TDS = Annual tax ÷ 12</td><td>Deducted from salary each month</td></tr>
            </table>
            <p><strong>Example:</strong> ₹15 Lakh Gross Salary (New Regime) → Taxable = ₹14,25,000 (after ₹75K std deduction) → Tax = ₹1,48,200 + ₹28,000 cess → Monthly TDS ≈ ₹4,680. If you submit investment proofs under Old Regime (80C ₹1.5L + 80D ₹25K + HRA), TDS could be lower.</p>

            <h3>TDS on Fixed Deposit Interest (Section 194A)</h3>
            <table>
                <tr><th>Detail</th><th>Rule</th></tr>
                <tr><td><strong>Rate</strong></td><td>10% (if PAN provided)</td></tr>
                <tr><td><strong>Threshold</strong></td><td>₹40,000/year (₹50,000 for senior citizens 60+)</td></tr>
                <tr><td><strong>Without PAN</strong></td><td>20%</td></tr>
                <tr><td><strong>How to avoid</strong></td><td>Submit Form 15G (below 60) / Form 15H (60+) if total income is below taxable limit</td></tr>
                <tr><td><strong>Applied on</strong></td><td>Interest earned across all FDs with the same bank/branch</td></tr>
            </table>
            <p><strong>Important:</strong> TDS on FD is deducted when interest is <em>credited</em> (not when FD matures). For multi-year FDs, banks accrue interest annually and deduct TDS each year — even if you haven't received the interest yet.</p>

            <h3>TDS on Rent</h3>
            <table>
                <tr><th>Section</th><th>Who Deducts</th><th>Threshold</th><th>Rate</th></tr>
                <tr><td><strong>194I</strong></td><td>Business/Company paying rent</td><td>₹2,40,000/year</td><td>10% (land/building) / 2% (plant & machinery)</td></tr>
                <tr><td><strong>194IB</strong></td><td>Individual/HUF paying rent ≥₹50K/month</td><td>₹50,000/month</td><td>5% (on total annual rent, not monthly)</td></tr>
            </table>
            <p><strong>For tenants:</strong> If you pay rent above ₹50,000/month and are not a business, you must deduct 5% TDS under 194IB. You don't need a TAN — deposit using Form 26QC on the IT portal. Many tenants overlook this and face penalty later.</p>

            <h3>TDS on Property Purchase (Section 194IA)</h3>
            <ul>
                <li><strong>Applicable when:</strong> Property purchase value is ₹50 Lakh or more</li>
                <li><strong>Rate:</strong> 1% of the total sale consideration (not just the amount above ₹50L)</li>
                <li><strong>Who deducts:</strong> The buyer (purchaser)</li>
                <li><strong>How to deposit:</strong> Use Form 26QB on the Income Tax portal within 30 days of the month of deduction</li>
                <li><strong>TDS certificate:</strong> Issue Form 16B to the seller within 15 days of filing 26QB</li>
                <li><strong>Stamp duty value:</strong> If the stamp duty value exceeds the actual consideration, TDS is calculated on the higher amount</li>
            </ul>

            <h3>Form 26AS and AIS — Tracking Your TDS</h3>
            <table>
                <tr><th>Document</th><th>What It Shows</th><th>Where to Access</th></tr>
                <tr><td><strong>Form 26AS</strong></td><td>All TDS deducted against your PAN, advance tax paid, self-assessment tax</td><td>TRACES portal / IT e-filing portal</td></tr>
                <tr><td><strong>AIS (Annual Information Statement)</strong></td><td>Comprehensive: TDS + SFT transactions + mutual fund purchases + property deals + foreign remittances</td><td>IT e-filing portal → AIS tab</td></tr>
                <tr><td><strong>TIS (Taxpayer Information Summary)</strong></td><td>Processed version of AIS — shows derived income values</td><td>IT e-filing portal → TIS tab</td></tr>
            </table>
            <p><strong>Always verify:</strong> Before filing ITR, match your Form 26AS / AIS with your actual income. If TDS is deducted but not reflected in 26AS, follow up with the deductor — they may not have filed their TDS return.</p>

            <h3>TDS Return Filing Schedule</h3>
            <table>
                <tr><th>Quarter</th><th>Period</th><th>Due Date</th><th>Form</th></tr>
                <tr><td>Q1</td><td>April – June</td><td>31 July</td><td>24Q (Salary) / 26Q (Non-salary)</td></tr>
                <tr><td>Q2</td><td>July – September</td><td>31 October</td><td>24Q / 26Q</td></tr>
                <tr><td>Q3</td><td>October – December</td><td>31 January</td><td>24Q / 26Q</td></tr>
                <tr><td>Q4</td><td>January – March</td><td>31 May</td><td>24Q / 26Q</td></tr>
            </table>
            <p>Late filing of TDS returns attracts a penalty of ₹200/day under Section 234E (capped at TDS amount). Additionally, a penalty of ₹10,000 to ₹1,00,000 under Section 271H may apply.</p>

            <h3>TDS for NRIs (Section 195)</h3>
            <ul>
                <li><strong>No threshold:</strong> TDS on payments to NRIs applies from the first rupee — there is no minimum threshold</li>
                <li><strong>Salary to NRI:</strong> At applicable slab rates (same as resident)</li>
                <li><strong>Interest to NRI:</strong> 20% (or DTAA rate, whichever is lower)</li>
                <li><strong>Rent from Indian property:</strong> 30% for NRI landlords</li>
                <li><strong>Property sale by NRI:</strong> 12.5% LTCG (if held 24+ months) / 20% STCG on equity, slab on others</li>
                <li><strong>Lower TDS:</strong> NRI can apply for a lower TDS certificate under Section 197 if actual tax liability is lower</li>
            </ul>

            <h3>How to Get a TDS Refund</h3>
            <ol>
                <li><strong>File your ITR:</strong> This is mandatory — TDS refund is only processed after filing income tax return</li>
                <li><strong>Verify ITR:</strong> e-Verify within 30 days using Aadhaar OTP, net banking, or DSC</li>
                <li><strong>Processing by CPC:</strong> The Centralized Processing Centre (Bengaluru) processes your return and calculates actual tax liability vs TDS paid</li>
                <li><strong>Refund issued:</strong> If TDS exceeds actual tax, refund is credited directly to your bank account (linked via pre-validated bank account on IT portal)</li>
                <li><strong>Timeline:</strong> Typically 20-45 days after e-verification. Interest at 6% p.a. (under Section 244A) is paid on delayed refunds</li>
            </ol>`,
        faq: [
            { question: "What is TDS and who deducts it?", answer: "TDS (Tax Deducted at Source) is tax collected by the payer at the time of making a payment. Employers deduct TDS from salary, banks deduct from FD interest, tenants deduct from rent (if above ₹50K/month), and property buyers deduct from property purchases above ₹50 Lakh. The deductor deposits the TDS with the government using their TAN." },
            { question: "Can I get a TDS refund?", answer: "Yes. If your actual tax liability is less than the total TDS deducted (shown in Form 26AS), you'll get a refund when filing your ITR. Common scenarios: multiple TDS deductions from different banks, or income below the taxable limit but TDS was still deducted from FD interest." },
            { question: "What happens if PAN is not provided?", answer: "TDS is deducted at 20% (the higher rate) instead of the applicable rate. For example, FD interest TDS goes from 10% to 20%, rent TDS from 10% to 20%. Always provide your PAN to deductors to avoid excess deduction." },
            { question: "When is TDS deposited to the government?", answer: "TDS must be deposited by the 7th of the next month using Challan 281. For TDS deducted in March, the deadline is April 30. Late deposits attract interest at 1.5% per month under Section 201(1A)." },
            { question: "What is Section 206AB and how does it affect TDS?", answer: "Section 206AB mandates higher TDS for 'specified persons' — those who haven't filed ITR for the past 2 years and have TDS exceeding ₹50,000 in each year. The TDS rate doubles to twice the prescribed rate or 5%, whichever is higher. This was introduced to encourage tax return filing compliance." },
            { question: "How can I avoid TDS on FD interest?", answer: "Submit Form 15G (if below 60) or Form 15H (if 60+) to your bank at the beginning of the financial year, declaring that your total income is below the taxable limit. The bank will then not deduct TDS on your FD interest. Note: You must submit these forms to every bank where you hold FDs." },
            { question: "What is TDS on rent and when does it apply?", answer: "Under Section 194IB, any individual or HUF paying monthly rent of ₹50,000 or more must deduct 5% TDS. You don't need a TAN — use Form 26QC on the IT portal. Under Section 194I, businesses paying annual rent above ₹2,40,000 deduct 10% TDS. Many tenants overlook 194IB and face penalties later." },
            { question: "How do I check if TDS has been deposited by my employer/deductor?", answer: "Check Form 26AS on the TRACES portal or AIS (Annual Information Statement) on the Income Tax e-filing portal. Form 26AS shows all TDS deducted against your PAN. If TDS was deducted but doesn't appear in 26AS, the deductor hasn't filed their TDS return — contact them immediately." },
            { question: "What is the TDS rate on property purchase?", answer: "Under Section 194IA, the buyer of any property worth ₹50 Lakh or more must deduct 1% TDS on the total sale consideration. This must be deposited using Form 26QB within 30 days. The buyer must issue Form 16B (TDS certificate) to the seller within 15 days of filing 26QB." },
            { question: "Is TDS applicable on salary under the New Tax Regime?", answer: "Yes. TDS on salary applies regardless of which regime you choose. Under the New Regime, the employer calculates your estimated annual tax liability using new slab rates (with ₹75,000 standard deduction) and deducts TDS monthly. Income up to ₹12.75 Lakh (including standard deduction) results in zero TDS under the New Regime." },
        ],
    },
    "capital-gains-tax-calculator": {
        subtitle: "Calculate STCG & LTCG tax on stocks, mutual funds, property & gold. Know your tax liability before you sell.",
        explanation: {
            heading: "Capital Gains Tax in India",
            paragraphs: [
                "Capital gains tax depends on two factors: the type of asset and how long you've held it. Equity shares and equity mutual funds become long-term after 12 months, while most other assets (debt MF, property, gold) need 24 months.",
                "As per Budget 2024, LTCG on all assets is taxed at 12.5%. Equity STCG is 20%, while other STCG is taxed at your income slab rate. Equity LTCG has an annual exemption of ₹1.25 Lakh — gains below this are tax-free.",
            ],
            highlight: "Bought stocks at ₹5L, sold at ₹8L after 14 months → LTCG = ₹3L. Tax = 12.5% × (₹3L − ₹1.25L exemption) = ₹21,875 + 4% cess = ₹22,750. Net gain after tax: ₹2,77,250.",
        },
        faq: [
            { question: "What is the LTCG exemption for equity?", answer: "₹1,25,000 per financial year. This means your first ₹1.25 Lakh of long-term capital gains from equity/equity MF is completely tax-free each year." },
            { question: "How is STCG different from LTCG?", answer: "STCG (Short-Term Capital Gain) applies when you sell before the minimum holding period (12 months for equity, 24 months for others). STCG has higher tax rates — 20% for equity and slab rate for other assets." },
            { question: "Is there indexation benefit for property?", answer: "After Budget 2024, LTCG on property is taxed at a flat 12.5% without indexation. Previously, you could adjust the purchase price for inflation using CII (Cost Inflation Index)." },
        ],
    },
    "professional-tax-calculator": {
        subtitle: "Calculate state-specific professional tax deductions for salaried employees across India.",
        explanation: {
            heading: "Understanding Professional Tax in India",
            paragraphs: [
                "Professional Tax (PT) is a direct tax levied by state governments in India on all individuals who earn a living through salary, professions, trades, or callings. Despite the name, it is not just for professionals like doctors or lawyers—it applies to all salaried employees working in states where the legislation is active.",
                "Under Article 276 of the Indian Constitution, the maximum amount any state can levy as professional tax is capped at ₹2,500 per financial year. Employers are responsible for deducting this amount directly from an employee's salary and remitting it to the state government. The exact amount deducted varies based on your gross salary slab and the specific state in which you are employed.",
                "It's important to note that not all Indian states levy Professional Tax. States like Delhi, Haryana, and Uttar Pradesh do not charge PT, whereas states like Maharashtra, Karnataka, Tamil Nadu, and West Bengal do. For salaried employees filing income tax, the total professional tax paid during the year is allowed as a deduction under Section 16(iii) of the Income Tax Act."
            ],
            highlight: "Did you know? Even if your employer doesn't deduct Professional Tax, self-employed professionals must register and pay this tax directly to their state commercial tax department.",
        },
        faq: [
            { question: "What is the maximum limit for professional tax?", answer: "As per the Constitution of India, the total professional tax payable by any person cannot exceed ₹2,500 per financial year." },
            { question: "Is professional tax deductible under Income Tax?", answer: "Yes. Salaried employees can claim a deduction for the exact amount of professional tax paid during the year under Section 16(iii) of the Income Tax Act." },
            { question: "Do all states charge professional tax?", answer: "No. It is a state-level tax. Many states and union territories (e.g., Delhi, Haryana, Chandigarh) do not levy any professional tax." },
            { question: "Is professional tax the same in all states?", answer: "No. Each state sets its own PT slabs. Some states like Rajasthan and UP don't levy PT at all. Maharashtra charges ₹200/month for salary above ₹10,000, while Tamil Nadu has slabs ranging from ₹135 to ₹1,250/month." },
            { question: "Can I claim PT as a deduction?", answer: "Yes. Professional tax paid is deductible under Section 16(iii) of the Income Tax Act. It's automatically deducted from your gross salary when computing taxable income — in both old and new regimes." },
        ],
    },
};

export default async function TaxCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const allTaxCalcs = getCalculatorsByCategory("tax");
    const calc = allTaxCalcs.find((c) => c.slug === calculator);
    if (!calc) notFound();

    const hub = HUB_CONTENT[calc.slug];
    if (!hub) notFound();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Tax Calculators", url: `${SITE_URL}/tax-calculators` },
            { name: calc.title },
        ]),
        webAppSchema(
            calc.title,
            canonicalUrl(`/tax-calculators/${calc.slug}`),
        ),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }} >
            <Script
                id={`schema-${calc.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Tax Calculators", href: "/tax-calculators" },
                    { label: calc.title },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{hub.subtitle}</p>
            <AuthorBadge categoryKey="tax" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <TaxCalculatorCore calcType={calc.calcType || "income-tax"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <DynamicExplanation
                heading={hub.explanation.heading}
                paragraphs={hub.explanation.paragraphs}
                highlight={hub.explanation.highlight}
            />

            {hub.contentHTML && (
                <section
                    className="content-section"
                    style={{ marginTop: "var(--s-6)" }}
                    dangerouslySetInnerHTML={{ __html: hub.contentHTML }}
                />
            )}

            <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />
        </main >
    );
}

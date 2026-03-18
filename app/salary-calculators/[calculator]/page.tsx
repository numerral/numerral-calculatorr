// Dynamic Hub — /salary-calculators/[calculator]/
// Each salary calculator gets its own hub page with calculator + explanation + FAQ

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import SalaryCalculatorCore from "@/components/calculator/SalaryCalculatorCore";
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
    return getCalculatorsByCategory("salary").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("salary").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/salary-calculators/${calc.slug}`) },
    };
}

// Hub content per salary calculator
const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation: { heading: string; paragraphs?: string[]; contentHTML?: string; highlight?: string };
    faq: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "salary-after-tax": {
        subtitle: "Calculate your net take-home salary after income tax, EPF, professional tax, and other deductions for FY 2025-26. See the exact monthly amount credited to your bank.",
        explanation: {
            heading: "Understanding Salary After Tax Deductions",
            paragraphs: [
                "Your Cost to Company (CTC) is never the amount credited to your bank account. Significant portions are deducted for statutory compliance and taxes before you receive your 'In-Hand' or 'Net' salary.",
                "First, Employer EPF and Gratuity are removed from the CTC to arrive at your Gross Salary. From the Gross Salary, Employee EPF (typically 12% of basic), Professional Tax (state-dependent), and Income Tax (TDS) based on your chosen regime are deducted. The final remaining amount is your Salary After Tax.",
            ],
            highlight: "₹12 Lakh CTC → ~₹88,000/month in-hand (New Regime). The ₹12L income is effectively tax-free under the New Regime (FY 25-26), but you still lose ~₹12,000/month to EPF (employer + employee shares) and Professional Tax.",
        },
        contentHTML: `<h3>What Is Salary After Tax?</h3>
            <p><strong>Salary After Tax</strong> (also called Take-Home Salary, In-Hand Salary, or Net Salary) is the actual amount credited to your bank account every month after all deductions — income tax, EPF, professional tax, and other statutory deductions — are subtracted from your gross salary. This is the money you can actually spend.</p>

            <h3>CTC vs Gross Salary vs In-Hand Salary</h3>
            <table>
                <tr><th>Component</th><th>What It Includes</th><th>Formula</th></tr>
                <tr><td><strong>CTC (Cost to Company)</strong></td><td>Total annual cost the employer spends on you</td><td>Gross Salary + Employer EPF + Gratuity + Insurance</td></tr>
                <tr><td><strong>Gross Salary</strong></td><td>Total earnings before your deductions</td><td>CTC − Employer EPF − Gratuity − Employer Insurance</td></tr>
                <tr><td><strong>Net/In-Hand Salary</strong></td><td>Actual monthly bank credit</td><td>Gross Salary − Employee EPF − Professional Tax − Income Tax (TDS)</td></tr>
            </table>
            <p><strong>Key insight:</strong> On a ₹10 Lakh CTC, your Gross Salary is approximately ₹9.1 Lakh, and your In-Hand Salary is approximately ₹70,000-73,000/month — a 15-20% gap between CTC and what you actually receive.</p>

            <h3>Components of Your Salary — Complete Breakdown</h3>
            <table>
                <tr><th>Component</th><th>Typical %</th><th>Taxable?</th><th>Purpose</th></tr>
                <tr><td><strong>Basic Salary</strong></td><td>40-50% of CTC</td><td>✅ Fully taxable</td><td>Foundation — HRA, EPF, Gratuity all depend on this</td></tr>
                <tr><td><strong>House Rent Allowance (HRA)</strong></td><td>50% of Basic (metro) / 40% (non-metro)</td><td>Partially exempt (Old Regime)</td><td>Rent expenses (exemption under Sec 10(13A))</td></tr>
                <tr><td><strong>Special Allowance</strong></td><td>Balance after all components</td><td>✅ Fully taxable</td><td>Catchall — covers food, internet, books, etc.</td></tr>
                <tr><td><strong>Leave Travel Allowance (LTA)</strong></td><td>Varies</td><td>Exempt (Old Regime, 2 trips per 4-year block)</td><td>Domestic travel — only fare, not hotel or food</td></tr>
                <tr><td><strong>Bonus / Performance Pay</strong></td><td>5-20% of CTC</td><td>✅ Fully taxable</td><td>Annual or quarterly performance linked</td></tr>
                <tr><td><strong>Employee EPF (12% of Basic)</strong></td><td>~6% of CTC</td><td>Exempt (80C, up to ₹1.5L)</td><td>Retirement savings — mandated by law</td></tr>
                <tr><td><strong>Employer EPF (12% of Basic)</strong></td><td>~6% of CTC</td><td>Exempt at deposit</td><td>Employer match — goes to your PF account</td></tr>
                <tr><td><strong>Gratuity</strong></td><td>4.81% of Basic</td><td>Exempt (up to ₹20L at withdrawal after 5 years)</td><td>Lump sum after 5 years of service</td></tr>
                <tr><td><strong>Professional Tax</strong></td><td>₹200/month (most states)</td><td>Deductible from income</td><td>State government levy — max ₹2,500/year</td></tr>
                <tr><td><strong>Health Insurance (Group)</strong></td><td>₹5,000-25,000/year</td><td>Not taxable benefit</td><td>Employer-provided medical coverage</td></tr>
            </table>

            <h3>Worked Example — ₹15 Lakh CTC Breakdown</h3>
            <table>
                <tr><th>Component</th><th>Monthly</th><th>Annual</th></tr>
                <tr><td>Basic Salary (40% of CTC)</td><td>₹50,000</td><td>₹6,00,000</td></tr>
                <tr><td>HRA (50% of Basic — metro)</td><td>₹25,000</td><td>₹3,00,000</td></tr>
                <tr><td>Special Allowance</td><td>₹17,200</td><td>₹2,06,400</td></tr>
                <tr><td>LTA</td><td>₹2,000</td><td>₹24,000</td></tr>
                <tr><td><strong>Gross Salary</strong></td><td><strong>₹94,200</strong></td><td><strong>₹11,30,400</strong></td></tr>
                <tr><td>Less: Employee EPF (12% of Basic)</td><td>−₹6,000</td><td>−₹72,000</td></tr>
                <tr><td>Less: Professional Tax</td><td>−₹200</td><td>−₹2,400</td></tr>
                <tr><td>Less: Income Tax (New Regime)</td><td>−₹4,680</td><td>−₹56,160</td></tr>
                <tr><td><strong>Salary After Tax (In-Hand)</strong></td><td><strong>₹83,320</strong></td><td><strong>₹9,99,840</strong></td></tr>
            </table>
            <p><strong>What you don't see in your bank:</strong> Employer EPF (₹6,000/month = ₹72,000/year) + Gratuity (₹2,400/month = ₹28,800/year) + Health Insurance (~₹800/month) — all part of CTC but never credited to your account.</p>

            <h3>Income Tax Slabs — FY 2025-26</h3>
            <h4>New Tax Regime (Default)</h4>
            <table>
                <tr><th>Taxable Income (₹)</th><th>Rate</th></tr>
                <tr><td>0 – 4,00,000</td><td>Nil</td></tr>
                <tr><td>4,00,001 – 8,00,000</td><td>5%</td></tr>
                <tr><td>8,00,001 – 12,00,000</td><td>10%</td></tr>
                <tr><td>12,00,001 – 16,00,000</td><td>15%</td></tr>
                <tr><td>16,00,001 – 20,00,000</td><td>20%</td></tr>
                <tr><td>20,00,001 – 24,00,000</td><td>25%</td></tr>
                <tr><td>Above 24,00,000</td><td>30%</td></tr>
            </table>
            <p><strong>Section 87A Rebate:</strong> Income up to ₹12 Lakh is effectively tax-free. With ₹75,000 standard deduction, salaried employees earning up to ₹12.75 Lakh pay zero tax under the New Regime.</p>

            <h4>Old Tax Regime</h4>
            <table>
                <tr><th>Taxable Income (₹)</th><th>Rate</th></tr>
                <tr><td>0 – 2,50,000</td><td>Nil</td></tr>
                <tr><td>2,50,001 – 5,00,000</td><td>5%</td></tr>
                <tr><td>5,00,001 – 10,00,000</td><td>20%</td></tr>
                <tr><td>Above 10,00,000</td><td>30%</td></tr>
            </table>

            <h3>Old vs New Tax Regime — Which Gives Higher Take-Home?</h3>
            <table>
                <tr><th>Feature</th><th>New Regime (Default)</th><th>Old Regime</th></tr>
                <tr><td><strong>Standard Deduction</strong></td><td>₹75,000</td><td>₹50,000</td></tr>
                <tr><td><strong>Section 80C (₹1.5L)</strong></td><td>❌ Not allowed</td><td>✅ Allowed</td></tr>
                <tr><td><strong>HRA Exemption</strong></td><td>❌ Not allowed</td><td>✅ Allowed</td></tr>
                <tr><td><strong>Section 80D (Health Insurance)</strong></td><td>❌ Not allowed</td><td>✅ Up to ₹1 Lakh</td></tr>
                <tr><td><strong>Home Loan Interest (24b)</strong></td><td>❌ Not allowed</td><td>✅ Up to ₹2 Lakh</td></tr>
                <tr><td><strong>NPS — Employer (80CCD2)</strong></td><td>✅ Allowed</td><td>✅ Allowed</td></tr>
                <tr><td><strong>Section 87A Rebate</strong></td><td>Up to ₹12L income</td><td>Up to ₹5L income</td></tr>
                <tr><td><strong>Tax-Free Income Limit</strong></td><td>₹12.75L (with std deduction)</td><td>~₹5.5L (with ₹50K std deduction + 80C)</td></tr>
            </table>
            <p><strong>Rule of thumb:</strong> If your total deductions (80C + 80D + HRA + home loan interest) exceed ₹3.75 Lakh, the Old Regime may give you a higher take-home salary. Below that threshold, the New Regime is almost always better.</p>

            <h3>Take-Home Salary at Different CTC Levels (FY 2025-26, New Regime)</h3>
            <table>
                <tr><th>Annual CTC</th><th>Monthly CTC</th><th>Monthly In-Hand (Approx)</th><th>Annual Tax</th><th>Effective Tax Rate</th></tr>
                <tr><td>₹5 Lakh</td><td>₹41,667</td><td>₹36,500</td><td>₹0 (Rebate)</td><td>0%</td></tr>
                <tr><td>₹8 Lakh</td><td>₹66,667</td><td>₹56,800</td><td>₹0 (Rebate)</td><td>0%</td></tr>
                <tr><td>₹12 Lakh</td><td>₹1,00,000</td><td>₹83,500</td><td>₹0 (Rebate)</td><td>0%</td></tr>
                <tr><td>₹15 Lakh</td><td>₹1,25,000</td><td>₹99,800</td><td>₹56,160</td><td>3.7%</td></tr>
                <tr><td>₹25 Lakh</td><td>₹2,08,333</td><td>₹1,57,500</td><td>₹3,24,480</td><td>13%</td></tr>
                <tr><td>₹50 Lakh</td><td>₹4,16,667</td><td>₹2,88,000</td><td>₹10,81,200</td><td>21.6%</td></tr>
            </table>
            <p><strong>Note:</strong> These are approximate figures assuming Basic = 40% of CTC, standard EPF deduction, and no additional deductions beyond standard deduction. Your actual numbers may vary based on company salary structure.</p>

            <h3>How EPF Affects Your Take-Home Salary</h3>
            <p>EPF is often the largest single deduction from your salary — even more than income tax at lower CTC levels:</p>
            <table>
                <tr><th>CTC</th><th>Basic (40%)</th><th>Employee EPF (12%)</th><th>Employer EPF (12%)</th><th>Total EPF Deduction from CTC</th></tr>
                <tr><td>₹10L</td><td>₹4,00,000</td><td>₹48,000</td><td>₹48,000</td><td>₹96,000 (9.6% of CTC)</td></tr>
                <tr><td>₹15L</td><td>₹6,00,000</td><td>₹72,000</td><td>₹72,000</td><td>₹1,44,000 (9.6% of CTC)</td></tr>
                <tr><td>₹25L</td><td>₹10,00,000</td><td>₹1,20,000</td><td>₹1,20,000</td><td>₹2,40,000 (9.6% of CTC)</td></tr>
            </table>
            <p><strong>EPF is not lost money:</strong> It earns 8.25% interest (FY 2024-25) tax-free and builds into a substantial retirement corpus. ₹48,000/year EPF at 8.25% for 30 years accumulates to approximately ₹60 Lakh.</p>

            <h3>Professional Tax — State-Wise Rates</h3>
            <table>
                <tr><th>State</th><th>Monthly Deduction</th><th>Annual Maximum</th></tr>
                <tr><td>Maharashtra</td><td>₹200 (₹300 in Feb)</td><td>₹2,500</td></tr>
                <tr><td>Karnataka</td><td>₹200</td><td>₹2,400</td></tr>
                <tr><td>West Bengal</td><td>₹150-200</td><td>₹2,500</td></tr>
                <tr><td>Tamil Nadu</td><td>Nil (no PT)</td><td>₹0</td></tr>
                <tr><td>Telangana</td><td>₹200</td><td>₹2,500</td></tr>
                <tr><td>Gujarat</td><td>₹200</td><td>₹2,500</td></tr>
                <tr><td>Rajasthan</td><td>Nil (no PT)</td><td>₹0</td></tr>
                <tr><td>Delhi</td><td>Nil (no PT)</td><td>₹0</td></tr>
                <tr><td>Uttar Pradesh</td><td>Nil (no PT)</td><td>₹0</td></tr>
            </table>
            <p>Professional Tax is deductible from your taxable income under both Old and New Tax Regimes — so while it reduces your monthly take-home by ₹200, it also reduces your tax liability slightly.</p>

            <h3>How to Maximize Your Take-Home Salary</h3>
            <ol>
                <li><strong>Choose the right tax regime:</strong> Use our calculator to compare both regimes at your CTC level. Under ₹15L with no major deductions → New Regime wins</li>
                <li><strong>Cap EPF at statutory minimum:</strong> Ask HR to limit EPF deduction to 12% of ₹15,000 (₹1,800/month instead of 12% of full Basic). This increases monthly in-hand but reduces retirement savings</li>
                <li><strong>Restructure salary for HRA (Old Regime):</strong> If paying rent in a metro, ensure HRA is 50% of Basic. The tax exemption can save ₹50,000-₹1 Lakh/year</li>
                <li><strong>Claim meal coupons / food allowance:</strong> Up to ₹50/meal (₹26,400/year) is tax-free if provided through employer-issued meal cards</li>
                <li><strong>Maximize NPS employer contribution:</strong> Employer NPS under 80CCD(2) is deductible in BOTH regimes — up to 14% of Basic for govt / 10% for private</li>
                <li><strong>Submit rent receipts on time:</strong> Missing HRA proof submission means full HRA becomes taxable under Old Regime — a costly mistake</li>
            </ol>`,
        faq: [
            { question: "Why is my Salary After Tax different from my Gross Salary?", answer: "Gross Salary only removes employer contributions (like Employer EPF and Gratuity) from the CTC. Salary After Tax further removes your own deductions: Employee EPF, Professional Tax, and Income Tax (TDS). The gap between Gross and In-Hand is typically 10-25% depending on your tax bracket." },
            { question: "Does the New Tax Regime increase my take-home salary?", answer: "For most people earning up to ₹15 Lakhs without heavy deductions (like high HRA and home loans), the New Regime results in lower tax and therefore a higher in-hand salary. Income up to ₹12.75L (including ₹75,000 standard deduction) is tax-free in FY 25-26 under the New Regime." },
            { question: "Are EPF deductions mandatory?", answer: "Yes, if your basic salary is up to ₹15,000 per month, EPF contribution (12% from employee and 12% from employer) is mandatory under the Employees' Provident Fund Act. Many companies apply this 12% to your full basic salary even if it exceeds ₹15,000, resulting in larger EPF deductions but a bigger retirement corpus." },
            { question: "How is Professional Tax calculated?", answer: "Professional Tax (PT) is a state-level tax, not a central government tax. Rates vary by state but are constitutionally capped at ₹2,500 per year. Most states charge ₹200/month. Some states like Tamil Nadu, Delhi, Rajasthan, and UP don't levy Professional Tax at all. PT is deductible from taxable income in both regimes." },
            { question: "What is the difference between CTC, Gross Salary, and In-Hand Salary?", answer: "CTC = Total cost to employer (includes employer PF, gratuity, insurance). Gross Salary = CTC minus employer contributions. In-Hand Salary = Gross minus your own deductions (employee PF, professional tax, income tax TDS). Example: ₹12L CTC → ~₹10.7L Gross → ~₹10L take-home (New Regime, effectively zero tax)." },
            { question: "Why is my in-hand salary so much less than my CTC?", answer: "Because CTC includes 'hidden' costs that never reach your bank account: Employer EPF (~6% of CTC), Gratuity (~2.4% of CTC), employer health insurance (₹5-25K/year). Then your own contributions — Employee EPF, Professional Tax, and Income Tax — are deducted from the remaining Gross Salary." },
            { question: "Can I reduce my EPF contribution to increase take-home salary?", answer: "If your Basic exceeds ₹15,000/month, you can request HR to restrict your EPF contribution to the statutory minimum of ₹1,800/month (12% of ₹15,000). This can increase your monthly in-hand by ₹2,000-₹8,000 depending on your Basic. However, you'll build a smaller retirement corpus and lose the tax-free 8.25% returns on the difference." },
            { question: "How is income tax calculated on salary?", answer: "First, calculate your taxable income: Gross Salary minus standard deduction (₹75K New / ₹50K Old) minus other eligible deductions (80C, 80D, HRA — Old Regime only). Then apply the applicable slab rates to this taxable income. Add 4% Health & Education Cess. The resulting amount is divided by 12 and deducted monthly as TDS by your employer." },
            { question: "Which is better for a ₹15 Lakh CTC — Old or New Regime?", answer: "At ₹15L CTC, the New Regime gives approximately ₹56,000 annual tax. For the Old Regime to be better, you'd need total deductions (80C + 80D + HRA + home loan interest) exceeding approximately ₹4 Lakh. If you pay high rent and invest ₹1.5L in 80C, the Old Regime may save ₹10,000-30,000 more. Without significant deductions, New Regime wins clearly." },
            { question: "Is salary calculator updated for FY 2025-26 budget changes?", answer: "Yes. Our Numerral salary calculator uses the latest FY 2025-26 tax slabs including: ₹4L basic exemption (New Regime), ₹12L income tax rebate under Section 87A, ₹75,000 standard deduction, and current EPF interest rate of 8.25%." },
        ],
    },
    "in-hand-salary": {
        subtitle: "Find out your exact monthly bank credit. View a detailed breakdown of your CTC, gross pay, and monthly deductions.",
        explanation: {
            heading: "How to Calculate In-Hand Salary",
            paragraphs: [
                "In-Hand Salary refers to the net amount transferred to an employee's bank account every month. To calculate it accurately, you need to understand the structure of your CTC package.",
                "The formula is: In-Hand Salary = Gross Salary − (Employee PF + Professional Tax + TDS). Note that Gross Salary equals CTC minus Employer PF, Gratuity, and Health Insurance premiums (if borne by the employer).",
            ],
            highlight: "Pro Tip: If you want a higher In-Hand salary, you can ask your employer to cap your EPF contribution to the statutory limit of 12% on ₹15,000 (i.e., ₹1,800/month) rather than 12% of your entire basic salary.",
        },
        faq: [
            { question: "What is the difference between In-Hand Salary and CTC?", answer: "CTC (Cost to Company) is the total expense the employer incurs on you annually, including indirect benefits like PF and gratuity. In-Hand Salary is the actual cash you receive every month after all direct and indirect deductions." },
            { question: "How does Professional Tax affect my in-hand salary?", answer: "Professional Tax (PT) is a direct state-level tax. It varies by state but is capped at ₹2,500 per year. It is deducted monthly (usually ₹200) directly from your salary, reducing your in-hand pay slightly." },
            { question: "Can I increase my monthly in-hand salary?", answer: "Yes, by opting for the New Tax Regime (if it lowers your tax liability), capping your PF contributions to the statutory minimum, or restructuring your salary to include higher tax-exempt allowances like LTA and food coupons." },
        ],
    },
    "ctc-to-take-home": {
        subtitle: "Deconstruct your CTC package. See exactly how much goes into PF, gratuity, taxes, and your actual take-home pay. Understand every salary component, tax regime impact, and get instant breakdowns for any CTC amount.",
        explanation: {
            heading: "What Is CTC (Cost to Company)?",
            paragraphs: [
                "CTC (Cost to Company) is the total annual expenditure an employer incurs on an employee. It includes your direct pay (Basic + Allowances), statutory contributions (Employer EPF, Gratuity), and sometimes benefits like health insurance and meal coupons. When you receive a job offer, the CTC figure is NOT the amount you take home — it can be 20-35% higher than your actual in-hand salary.",
                "The formula to arrive at your take-home salary is: Take-Home Salary = Gross Salary − (Employee EPF + Professional Tax + Income Tax TDS). Where Gross Salary = CTC − Employer EPF − Gratuity − Employer Insurance. Understanding this breakdown is critical for comparing job offers and planning your monthly budget.",
                "Your Basic Salary forms the foundation of the entire structure. HRA, EPF, and Gratuity are all calculated as percentages of Basic. A higher Basic means higher PF deductions (lower take-home now, but bigger retirement corpus) and higher HRA tax exemption. Most companies set Basic at 40-50% of CTC.",
            ],
            highlight: "A ₹10 Lakh CTC does NOT mean ₹83,333 per month in hand. After removing ~₹60,000 for Employer EPF and ₹28,900 for Gratuity, your Gross is ~₹9.11L. After deducting Employee PF (₹60,000), Professional Tax (₹2,400), and Income Tax, your actual take-home is closer to ₹70,000-₹73,000/month depending on your tax regime.",
        },
        faq: [
            { question: "What is the difference between CTC, Gross Salary, and In-Hand Salary?", answer: "CTC is the total cost your employer spends on you (includes employer PF, gratuity, insurance). Gross Salary = CTC minus employer contributions (what appears on your salary slip before deductions). In-Hand/Take-Home Salary = Gross minus your own deductions (employee PF, professional tax, income tax TDS). Example: ₹10L CTC → ~₹9.1L Gross → ~₹8.5L take-home (New Regime)." },
            { question: "Why is my in-hand salary so much less than CTC?", answer: "Because CTC includes 'hidden' costs: Employer EPF (12% of basic = ~₹60K on ₹10L CTC), Gratuity (4.81% of basic = ~₹29K), and sometimes employer health insurance (₹10-25K). These are part of your compensation but never hit your bank account monthly. Then your own PF, PT, and tax are also deducted." },
            { question: "What is Special Allowance and why is it fully taxable?", answer: "Special Allowance is the balancing figure in your CTC structure. Once Basic (40-50%), HRA (50% of Basic for metro), EPF, and Gratuity are allocated, whatever is left is bundled as Special Allowance. Unlike HRA or LTA, there is no Section in the Income Tax Act that exempts Special Allowance — it is 100% taxable under both Old and New Regime." },
            { question: "Should I negotiate for a higher Basic Salary?", answer: "It depends on your priorities. Higher Basic = Higher HRA exemption (Old Regime), Higher EPF contribution (bigger retirement corpus), Higher Gratuity payout. But it also means lower monthly in-hand salary due to higher EPF deductions. If you want maximum current cash flow, ask for lower basic with higher special allowance." },
            { question: "Is the New Tax Regime always better for salaried employees?", answer: "Not always. New Regime is better if: your CTC is under ₹15L, you don't have significant HRA/80C/80D deductions, or you don't have a home loan. Old Regime is better if: you pay high rent in a metro (substantial HRA exemption), invest ₹1.5L in 80C instruments, have a home loan (Section 24 interest deduction), or have health insurance premiums (80D)." },
            { question: "How is Professional Tax calculated?", answer: "Professional Tax (PT) is a state-level tax, not a central government tax. Rates vary by state but are capped at ₹2,500 per year. Most states charge ₹200/month (₹2,400/year). Some states like Rajasthan and Uttarakhand don't levy Professional Tax at all." },
            { question: "Does CTC include Provident Fund (PF)?", answer: "Yes. CTC includes BOTH employer's EPF contribution (12% of Basic) and your own employee EPF contribution (12% of Basic). However, your employee share is deducted from your gross salary and deposited into your PF account. The employer's share is a separate cost to the company, never visible on your salary slip." },
            { question: "Why is Gratuity deducted from CTC if I only get it after 5 years?", answer: "Gratuity (4.81% of Basic Salary) is a provisioned cost — the company sets aside this amount monthly as your future benefit. You receive it as a lump sum only after completing 5 continuous years of service (or in case of death/disability). If you leave before 5 years, the company retains this amount. The formula: Gratuity = (Basic + DA) × 15 × Years of Service ÷ 26." },
        ],
        contentHTML: `
<h3>Salary Calculation Formulas</h3>
<p>Understanding the key formulas is essential before using the calculator:</p>
<table>
<tr><th>Formula</th><th>Calculation</th></tr>
<tr><td><strong>Take-Home Salary</strong></td><td>Gross Salary − (Employee EPF + Professional Tax + Income Tax TDS)</td></tr>
<tr><td><strong>Gross Salary</strong></td><td>CTC − Employer EPF − Gratuity − Employer Insurance</td></tr>
<tr><td><strong>Taxable Income (Old Regime)</strong></td><td>Gross − EPF − HRA Exemption − LTA − 80C − 80D − Standard Deduction</td></tr>
<tr><td><strong>Taxable Income (New Regime)</strong></td><td>Gross − Standard Deduction (₹75,000)</td></tr>
<tr><td><strong>Gratuity</strong></td><td>(Basic + DA) × 15 × Years of Service ÷ 26</td></tr>
</table>

<h3>Components of Your Salary Slip</h3>
<p>Every salary package (CTC) is made up of multiple components. Each has specific tax treatment and calculation rules:</p>

<h4>1. Basic Salary</h4>
<p>Basic Salary is the core component — typically 40-50% of CTC. It is fully taxable under both tax regimes. All other components (HRA, EPF, Gratuity) are calculated as percentages of Basic. A higher basic salary means higher retirement benefits but lower current take-home pay.</p>

<h4>2. House Rent Allowance (HRA)</h4>
<p>HRA is paid to employees living in rented accommodation. It equals 50% of Basic Salary for metro cities (Mumbai, Delhi, Kolkata, Chennai) and 40% for non-metro cities (Bangalore, Hyderabad, Pune, etc.).</p>
<p><strong>HRA Tax Exemption (Section 10(13A) — Old Regime Only):</strong> The exempt amount is the LOWEST of: (a) Actual HRA received, (b) 50% of Basic for metro / 40% for non-metro, (c) Actual rent paid minus 10% of Basic Salary. HRA exemption is NOT available under the New Tax Regime.</p>

<h4>3. Leave Travel Allowance (LTA)</h4>
<p>LTA covers domestic travel expenses for you and your family during holidays. Tax exemption under Section 10(5) covers only travel fare (train/air tickets), not hotel or food expenses. Exemption is available for 2 journeys in a block of 4 calendar years. Available only under the Old Tax Regime.</p>

<h4>4. Special Allowance</h4>
<p>The balancing figure after Basic, HRA, EPF, and Gratuity are calculated. Whatever remains of the CTC is allocated as Special Allowance. It is 100% taxable under both tax regimes — there is no exemption provision in the Income Tax Act.</p>

<h4>5. Bonus</h4>
<p>Performance bonus or statutory bonus under the Payment of Bonus Act, 1965. Statutory minimum is 8.33% of salary (capped at ₹21,000/month for calculation). Maximum is 20%. The entire bonus amount is fully taxable in the year of receipt.</p>

<h4>6. Employee Provident Fund (EPF)</h4>
<p>Both you and your employer contribute 12% of Basic Salary to EPF. Your contribution (employee share) is deducted from your gross salary. Employer's contribution is part of CTC but never appears on your salary slip. Employee EPF contribution is tax-deductible up to ₹1.5 Lakhs under Section 80C (Old Regime only).</p>

<h3>New Tax Regime Slabs — FY 2025-26 (AY 2026-27)</h3>
<p>As per Union Budget 2025, the revised income tax slabs under the New Tax Regime are:</p>
<table>
<tr><th>Income Range (₹)</th><th>Tax Rate</th></tr>
<tr><td>Up to 4,00,000</td><td>NIL</td></tr>
<tr><td>4,00,001 – 8,00,000</td><td>5%</td></tr>
<tr><td>8,00,001 – 12,00,000</td><td>10%</td></tr>
<tr><td>12,00,001 – 16,00,000</td><td>15%</td></tr>
<tr><td>16,00,001 – 20,00,000</td><td>20%</td></tr>
<tr><td>20,00,001 – 24,00,000</td><td>25%</td></tr>
<tr><td>Above 24,00,000</td><td>30%</td></tr>
</table>
<p><strong>Standard Deduction:</strong> ₹75,000 under New Regime. <strong>Rebate under Section 87A:</strong> Income up to ₹12,00,000 (taxable income up to ₹12,75,000 with standard deduction) is effectively tax-free.</p>

<h3>Old vs New Tax Regime — Which Is Better?</h3>
<table>
<tr><th>Feature</th><th>Old Regime</th><th>New Regime</th></tr>
<tr><td>HRA Exemption</td><td>✅ Available (Section 10(13A))</td><td>❌ Not available</td></tr>
<tr><td>LTA Exemption</td><td>✅ Available (Section 10(5))</td><td>❌ Not available</td></tr>
<tr><td>Section 80C (₹1.5L)</td><td>✅ Available</td><td>❌ Not available</td></tr>
<tr><td>Section 80D (Health Insurance)</td><td>✅ Available</td><td>❌ Not available</td></tr>
<tr><td>Home Loan Interest (Sec 24)</td><td>✅ Up to ₹2L</td><td>❌ Not available</td></tr>
<tr><td>Standard Deduction</td><td>₹50,000</td><td>₹75,000</td></tr>
<tr><td>Tax Slabs</td><td>Higher rates, fewer slabs</td><td>Lower rates, more slabs</td></tr>
<tr><td>Best For</td><td>High rent + heavy investments</td><td>CTC under ₹15L or minimal deductions</td></tr>
</table>

<h3>Worked Example — ₹10 Lakh CTC Breakdown</h3>
<table>
<tr><th>Component</th><th>Annual (₹)</th><th>Monthly (₹)</th></tr>
<tr><td>Basic Salary (50% of CTC)</td><td>5,00,000</td><td>41,667</td></tr>
<tr><td>HRA (50% of Basic — Metro)</td><td>2,50,000</td><td>20,833</td></tr>
<tr><td>Special Allowance</td><td>1,61,100</td><td>13,425</td></tr>
<tr><td><strong>Gross Salary</strong></td><td><strong>9,11,100</strong></td><td><strong>75,925</strong></td></tr>
<tr><td>Employee EPF (12% of Basic)</td><td>−60,000</td><td>−5,000</td></tr>
<tr><td>Professional Tax</td><td>−2,400</td><td>−200</td></tr>
<tr><td>Income Tax (New Regime)</td><td>−10,400</td><td>−867</td></tr>
<tr><td><strong>Take-Home Salary</strong></td><td><strong>8,38,300</strong></td><td><strong>~69,858</strong></td></tr>
</table>
<p><strong>Hidden Employer Costs (part of CTC, never in your bank):</strong> Employer EPF: ₹60,000 | Gratuity: ₹28,900</p>

<h3>Worked Example — ₹15 Lakh CTC Breakdown</h3>
<table>
<tr><th>Component</th><th>Annual (₹)</th><th>Monthly (₹)</th></tr>
<tr><td>Basic Salary (50%)</td><td>7,50,000</td><td>62,500</td></tr>
<tr><td>HRA (50% of Basic)</td><td>3,75,000</td><td>31,250</td></tr>
<tr><td>Special Allowance</td><td>2,31,650</td><td>19,304</td></tr>
<tr><td><strong>Gross Salary</strong></td><td><strong>13,56,650</strong></td><td><strong>1,13,054</strong></td></tr>
<tr><td>Employee EPF</td><td>−90,000</td><td>−7,500</td></tr>
<tr><td>Professional Tax</td><td>−2,400</td><td>−200</td></tr>
<tr><td>Income Tax (New Regime)</td><td>−52,000</td><td>−4,333</td></tr>
<tr><td><strong>Take-Home Salary</strong></td><td><strong>12,12,250</strong></td><td><strong>~1,01,021</strong></td></tr>
</table>

<h3>How to Calculate Gratuity</h3>
<p><strong>Formula:</strong> Gratuity = (Basic Salary + Dearness Allowance) × 15 × Years of Service ÷ 26</p>
<p><strong>Example:</strong> Basic Salary = ₹5,00,000/year. DA = ₹0 (most private companies). Service = 10 years.</p>
<p>Gratuity = 5,00,000 × 15 × 10 ÷ 26 = <strong>₹2,88,462</strong></p>
<p>Tax exemption on gratuity: Up to ₹25 Lakhs is fully exempt from income tax. Any amount above ₹25L is taxed at your slab rate. Eligibility: Minimum 5 years of continuous service (waived in case of death or disability).</p>

<h3>Commonly Searched CTC to In-Hand Salary (India)</h3>
<p>Quick reference table for approximate in-hand salary at various CTC levels. Assumptions: New Tax Regime FY 2025-26, Basic at 50% of CTC, Metro city HRA, 12% EPF on basic, Professional Tax ₹200/month.</p>
<table>
<tr><th>CTC (LPA)</th><th>Monthly In-Hand (₹)</th><th>Yearly In-Hand (₹)</th></tr>
<tr><td>3 LPA</td><td>22,400 – 23,200</td><td>2,69,000 – 2,78,000</td></tr>
<tr><td>4 LPA</td><td>29,800 – 30,800</td><td>3,58,000 – 3,70,000</td></tr>
<tr><td>5 LPA</td><td>37,100 – 38,300</td><td>4,45,000 – 4,60,000</td></tr>
<tr><td>6 LPA</td><td>44,100 – 45,600</td><td>5,29,000 – 5,47,000</td></tr>
<tr><td>7 LPA</td><td>51,500 – 53,000</td><td>6,18,000 – 6,36,000</td></tr>
<tr><td>8 LPA</td><td>58,200 – 60,000</td><td>6,98,000 – 7,20,000</td></tr>
<tr><td>9 LPA</td><td>64,000 – 66,000</td><td>7,68,000 – 7,92,000</td></tr>
<tr><td>10 LPA</td><td>69,000 – 72,000</td><td>8,28,000 – 8,64,000</td></tr>
<tr><td>12 LPA</td><td>82,000 – 86,000</td><td>9,84,000 – 10,32,000</td></tr>
<tr><td>15 LPA</td><td>99,000 – 1,04,000</td><td>11,88,000 – 12,48,000</td></tr>
<tr><td>18 LPA</td><td>1,14,000 – 1,20,000</td><td>13,68,000 – 14,40,000</td></tr>
<tr><td>20 LPA</td><td>1,24,000 – 1,31,000</td><td>14,88,000 – 15,72,000</td></tr>
<tr><td>22 LPA</td><td>1,34,000 – 1,42,000</td><td>16,08,000 – 17,04,000</td></tr>
<tr><td>25 LPA</td><td>1,49,000 – 1,58,000</td><td>17,88,000 – 18,96,000</td></tr>
<tr><td>28 LPA</td><td>1,63,000 – 1,73,000</td><td>19,56,000 – 20,76,000</td></tr>
<tr><td>30 LPA</td><td>1,73,000 – 1,83,000</td><td>20,76,000 – 21,96,000</td></tr>
<tr><td>35 LPA</td><td>1,97,000 – 2,09,000</td><td>23,64,000 – 25,08,000</td></tr>
<tr><td>40 LPA</td><td>2,21,000 – 2,34,000</td><td>26,52,000 – 28,08,000</td></tr>
<tr><td>45 LPA</td><td>2,44,000 – 2,59,000</td><td>29,28,000 – 31,08,000</td></tr>
<tr><td>50 LPA</td><td>2,67,000 – 2,84,000</td><td>32,04,000 – 34,08,000</td></tr>
</table>
<p><strong>Note:</strong> Ranges account for variations in Basic Salary percentage (40-50%), HRA rules, and employer-specific allowances. Actual take-home may vary based on your company's salary structure and the tax regime you choose.</p>

<h3>Benefits of Using a CTC to Take-Home Calculator</h3>
<ul>
<li><strong>Instant Results:</strong> Get your complete salary breakdown in seconds — no manual calculations needed</li>
<li><strong>Job Offer Comparison:</strong> Compare two offers by converting both CTCs to actual in-hand salary</li>
<li><strong>Budget Planning:</strong> Know your exact monthly bank credit for planning rent, EMIs, and investments</li>
<li><strong>Tax Regime Decision:</strong> Compare Old vs New regime impact to choose the one that maximizes your take-home</li>
<li><strong>Salary Negotiation:</strong> Understand your CTC structure to negotiate effectively — ask for specific component adjustments</li>
<li><strong>Appraisal Impact:</strong> See how a CTC hike translates to actual monthly increase after taxes and deductions</li>
</ul>
`,
    },
    "hra-salary-calculator": {
        subtitle: "Calculate your HRA tax exemption under Section 10(13A). See how the 3-rule system determines your exempt amount, compare metro vs non-metro benefits, and plan your tax savings for FY 2025-26.",
        explanation: {
            heading: "Understanding HRA Tax Exemption",
            paragraphs: [
                "House Rent Allowance (HRA) is one of the most significant tax-saving components in a salaried individual's pay structure. Under Section 10(13A) of the Income Tax Act, a portion of HRA received from your employer can be claimed as exempt from tax — but only under the Old Tax Regime. The New Tax Regime does NOT allow any HRA exemption.",
                "The actual exempt amount is strictly the LOWEST of three calculated values: (1) Actual HRA received from your employer, (2) 50% of Basic Salary for Metro cities (Mumbai, Delhi, Kolkata, Chennai) or 40% for Non-Metro cities, (3) Actual rent paid minus 10% of Basic Salary. The remainder that exceeds the exempt amount is fully taxable at your slab rate.",
            ],
            highlight: "Basic = ₹50,000/month | HRA = ₹25,000/month | Rent = ₹18,000/month (Mumbai). Rule 1: ₹25,000 | Rule 2: ₹25,000 (50% of ₹50K) | Rule 3: ₹13,000 (₹18K − ₹5K). Exemption = ₹13,000/month (the lowest). The remaining ₹12,000 is taxable.",
        },
        faq: [
            { question: "Is HRA exemption available under the New Tax Regime?", answer: "No. Section 10(13A) exemption for HRA is completely unavailable under the New Tax Regime. If you pay high rent (especially in metro cities), this is one of the main reasons to consider staying on the Old Tax Regime, as the HRA exemption can save ₹50,000–₹2,00,000+ in tax annually depending on your salary and rent." },
            { question: "Can I claim HRA by paying rent to my parents?", answer: "Yes! You can pay rent to your parents and claim HRA exemption. Conditions: (1) Your parents must be the legal owners of the property, (2) You must actually transfer rent to them (bank transfer recommended), (3) Your parents must declare the rent as income under 'Income from House Property' in their ITR. This is a perfectly legal tax-saving strategy — if your parents are in a lower tax bracket, the family saves money collectively." },
            { question: "Which cities qualify as Metro for the 50% HRA rule?", answer: "For income tax purposes, only FOUR cities qualify as Metro: Mumbai (including Navi Mumbai and Thane), Delhi (including NCR areas within Delhi boundary), Kolkata, and Chennai. Bangalore, Hyderabad, Pune, Ahmedabad, and all other cities fall under Non-Metro (40% rule)." },
            { question: "What if my rent paid minus 10% of basic is zero or negative?", answer: "If your annual rent paid is less than or equal to 10% of your basic salary, your HRA exemption under Rule 3 becomes ZERO — and since HRA exemption equals the lowest of three rules, your entire HRA becomes taxable. Example: Basic ₹60,000/month, Rent ₹5,000/month → 10% of Basic = ₹6,000, which exceeds your rent. HRA exemption = ₹0." },
            { question: "Can I claim both HRA and home loan deductions simultaneously?", answer: "Yes! There is no restriction on claiming both together. If you own a home (paying home loan EMI) but live in a rented property in a different city for work, you can claim: (a) HRA exemption for the rented accommodation under Old Regime, and (b) Home loan interest deduction up to ₹2 lakh under Section 24(b), and (c) Principal repayment under Section 80C (up to ₹1.5L). This is common for IT professionals who buy homes in their hometowns but rent in Bangalore/Mumbai for work." },
            { question: "What documents do I need for HRA exemption?", answer: "You need: (1) Rent receipts signed by landlord (compulsory if rent exceeds ₹3,000/month), (2) Landlord's PAN if annual rent exceeds ₹1,00,000, (3) Rent agreement (recommended but not mandatory), (4) Bank transfer proof (highly recommended over cash payments for audit trail). If your landlord refuses to provide a PAN, you must submit a declaration from the landlord stating they don't have a PAN." },
            { question: "What if I forgot to submit rent receipts to my employer?", answer: "You can still claim HRA when filing your ITR directly. Adjust your taxable income to include HRA exemption and calculate the lower tax. If your employer deducted higher TDS (without considering HRA), you'll receive a refund from the income tax department upon filing." },
            { question: "What is Section 80GG and who can claim it?", answer: "Section 80GG is for individuals who pay rent but do NOT receive HRA from their employer — such as self-employed professionals, freelancers, or employees whose salary structure doesn't include HRA. The deduction is the lowest of: ₹5,000/month (₹60,000/yr), 25% of total income, or rent paid minus 10% of total income. You must file Form 10BA to claim this deduction." },
            { question: "Is HRA received during notice period exempt from tax?", answer: "Yes, if you continue to pay rent during your notice period and HRA is part of your salary during that time, the same 3-rule exemption applies. However, if your employer pays you a lump sum settlement that includes HRA for the notice period, the entire lump sum may be treated as fully taxable." },
            { question: "Can I claim HRA if I live in my own house?", answer: "No. HRA exemption under Section 10(13A) requires that you actually pay rent for the accommodation you live in. If you live in your own house (self-occupied property), you cannot claim HRA exemption. The HRA component in your salary becomes fully taxable. However, you can still claim home loan interest deduction under Section 24(b)." },
        ],
        contentHTML: `
<h3>How HRA Exemption Is Calculated — The 3-Rule System</h3>
<p>HRA exemption under Section 10(13A) is determined by comparing three values. The <strong>lowest</strong> of the three becomes your exempt (tax-free) amount:</p>
<table>
<tr><th>Rule</th><th>Formula</th><th>Purpose</th></tr>
<tr><td><strong>Rule 1</strong></td><td>Actual HRA received from employer</td><td>Caps exemption at what you actually receive</td></tr>
<tr><td><strong>Rule 2</strong></td><td>50% of Basic Salary (Metro) or 40% (Non-Metro)</td><td>Government ceiling based on city classification</td></tr>
<tr><td><strong>Rule 3</strong></td><td>Actual Rent Paid − 10% of Basic Salary</td><td>Ensures you're spending significantly on rent</td></tr>
</table>
<p><strong>Metro cities (50% rule):</strong> Mumbai, Delhi, Kolkata, Chennai. <strong>All other cities</strong> including Bangalore, Hyderabad, Pune, Ahmedabad use the 40% rule.</p>

<h3>Worked Example — Metro City (Mumbai)</h3>
<p><strong>Raghu's Monthly Salary:</strong> Basic = ₹50,000 | HRA received = ₹25,000 | Rent paid = ₹18,000</p>
<table>
<tr><th>Rule</th><th>Calculation</th><th>Monthly Amount</th></tr>
<tr><td>Rule 1: Actual HRA</td><td>₹25,000</td><td>₹25,000</td></tr>
<tr><td>Rule 2: 50% of Basic (Metro)</td><td>50% × ₹50,000</td><td>₹25,000</td></tr>
<tr><td>Rule 3: Rent − 10% of Basic</td><td>₹18,000 − ₹5,000</td><td>₹13,000</td></tr>
<tr><td><strong>HRA Exempt</strong></td><td><strong>Minimum of the above</strong></td><td><strong>₹13,000/month</strong></td></tr>
<tr><td>HRA Taxable</td><td>₹25,000 − ₹13,000</td><td>₹12,000/month</td></tr>
</table>
<p>Raghu's annual HRA exemption = ₹13,000 × 12 = <strong>₹1,56,000</strong>. The remaining ₹1,44,000 (₹12,000 × 12) is added to his taxable income.</p>

<h3>Worked Example — Non-Metro City (Bangalore)</h3>
<p><strong>Priya's Monthly Salary:</strong> Basic = ₹60,000 | HRA received = ₹24,000 | Rent paid = ₹22,000</p>
<table>
<tr><th>Rule</th><th>Calculation</th><th>Monthly Amount</th></tr>
<tr><td>Rule 1: Actual HRA</td><td>₹24,000</td><td>₹24,000</td></tr>
<tr><td>Rule 2: 40% of Basic (Non-Metro)</td><td>40% × ₹60,000</td><td>₹24,000</td></tr>
<tr><td>Rule 3: Rent − 10% of Basic</td><td>₹22,000 − ₹6,000</td><td>₹16,000</td></tr>
<tr><td><strong>HRA Exempt</strong></td><td><strong>Minimum of the above</strong></td><td><strong>₹16,000/month</strong></td></tr>
<tr><td>HRA Taxable</td><td>₹24,000 − ₹16,000</td><td>₹8,000/month</td></tr>
</table>
<p>Priya's annual HRA exemption = ₹16,000 × 12 = <strong>₹1,92,000</strong>. At the 30% tax bracket, this saves her <strong>₹59,904</strong> in tax (including 4% cess).</p>

<h3>Can You Pay Rent to Parents and Claim HRA?</h3>
<p>Yes — this is one of the most popular and perfectly legal HRA optimization strategies in India. Here's how to do it correctly:</p>
<ul>
<li><strong>Parents must own the property</strong> — they should be the legal owners (name on property documents)</li>
<li><strong>Formal rent agreement</strong> — execute a written rental agreement with market-rate rent</li>
<li><strong>Bank transfers only</strong> — avoid cash payments. Monthly bank transfers create an audit trail</li>
<li><strong>Parents declare rental income</strong> — your parents must report this rent as 'Income from House Property' in their own ITR</li>
<li><strong>Tax arbitrage benefit:</strong> If you're in the 30% bracket and your parents are in the NIL/5% bracket (e.g., retired with pension below ₹5L), the family saves 25-30% tax on the rent amount paid</li>
</ul>

<h3>HRA + Home Loan — Can You Claim Both?</h3>
<p>Yes, you can claim <strong>both HRA exemption AND home loan tax benefits simultaneously</strong>. This is common for professionals who:</p>
<ul>
<li>Own a home in their hometown (paying EMI) but rent in their work city</li>
<li>Own a home in one city but are transferred to another city for work</li>
<li>Have rented out their owned property and live in a different rented accommodation</li>
</ul>
<p><strong>Combined deductions available (Old Regime):</strong></p>
<table>
<tr><th>Deduction</th><th>Section</th><th>Maximum Limit</th></tr>
<tr><td>HRA Exemption</td><td>10(13A)</td><td>As per 3-rule formula</td></tr>
<tr><td>Home Loan Interest (Self-Occupied)</td><td>24(b)</td><td>₹2,00,000/year</td></tr>
<tr><td>Home Loan Principal Repayment</td><td>80C</td><td>₹1,50,000/year (shared limit)</td></tr>
<tr><td>Stamp Duty & Registration</td><td>80C</td><td>One-time, within ₹1.5L limit</td></tr>
</table>

<h3>Section 80GG — For Those Without HRA</h3>
<p>If you're self-employed, a freelancer, or your employer doesn't pay HRA, you can claim rent deduction under <strong>Section 80GG</strong>. The deduction is the <strong>lowest</strong> of:</p>
<ul>
<li>₹5,000 per month (₹60,000 per year)</li>
<li>25% of your total income</li>
<li>Actual rent paid minus 10% of total income</li>
</ul>
<p><strong>Conditions:</strong> You must not own a residential property in the city where you work, and you must file Form 10BA. Available only under the Old Tax Regime.</p>

<h3>HRA in New vs Old Tax Regime</h3>
<table>
<tr><th>Feature</th><th>Old Regime</th><th>New Regime</th></tr>
<tr><td>HRA Exemption (Sec 10(13A))</td><td>✅ Available</td><td>❌ Not available</td></tr>
<tr><td>Section 80GG (No HRA in salary)</td><td>✅ Available</td><td>❌ Not available</td></tr>
<tr><td>Standard Deduction</td><td>₹50,000</td><td>₹75,000</td></tr>
<tr><td>Impact on High-Rent Payers</td><td>Significant tax savings</td><td>No benefit from rent payments</td></tr>
</table>
<p><strong>When Old Regime is better for HRA:</strong> If your annual HRA exemption exceeds ₹1.5–2 lakh (common in metro cities), the Old Regime often results in lower overall tax, especially when combined with 80C, 80D, and home loan deductions.</p>

<h3>Documents Required for HRA Claim</h3>
<ul>
<li><strong>Rent receipts</strong> — Signed by landlord with revenue stamp. Mandatory if rent exceeds ₹3,000/month</li>
<li><strong>Landlord's PAN</strong> — Mandatory if annual rent exceeds ₹1,00,000. If landlord doesn't have PAN, obtain a signed declaration</li>
<li><strong>Rent agreement</strong> — Registered or unregistered lease agreement. Strongly recommended for rent > ₹8,000/month</li>
<li><strong>Bank transfer proof</strong> — Monthly bank statements showing rent payments. Cash payments are not recommended as they're harder to prove</li>
<li><strong>Form 12BB</strong> — Declaration form submitted to employer for TDS calculation with HRA details</li>
</ul>

<h3>Common HRA Mistakes to Avoid</h3>
<ul>
<li><strong>Claiming HRA without paying rent:</strong> This is fraud. The IT department conducts random checks and may demand proof from your landlord</li>
<li><strong>Not getting landlord's PAN for rent > ₹1 lakh/year:</strong> Your exemption will be disallowed in assessment</li>
<li><strong>Paying rent in cash with no receipts:</strong> Always transfer via bank and keep receipts. Cash payments without documentation won't survive a tax audit</li>
<li><strong>Claiming HRA under the New Tax Regime:</strong> HRA exemption is not available — if you've opted for the new regime, your entire HRA is taxable</li>
<li><strong>Not adjusting for mid-year changes:</strong> If you changed cities (metro → non-metro) or changed rent amounts during the year, calculate HRA month by month, not on annual averages</li>
<li><strong>Forgetting to report rent to parents:</strong> If you pay rent to parents, they MUST declare it in their ITR. Inconsistencies trigger IT notices</li>
</ul>

<h3>Reference: Average Monthly Rent in Indian Cities (2025)</h3>
<p>Use these as a reference when planning your HRA optimization. Rents shown are for 2BHK apartments in mid-range localities:</p>
<table>
<tr><th>City</th><th>Metro/Non-Metro</th><th>Avg. Rent (2BHK)</th><th>HRA Rule</th></tr>
<tr><td>Mumbai</td><td>Metro</td><td>₹25,000 – ₹45,000</td><td>50% of Basic</td></tr>
<tr><td>Delhi / NCR</td><td>Metro</td><td>₹15,000 – ₹30,000</td><td>50% of Basic</td></tr>
<tr><td>Chennai</td><td>Metro</td><td>₹12,000 – ₹22,000</td><td>50% of Basic</td></tr>
<tr><td>Kolkata</td><td>Metro</td><td>₹10,000 – ₹18,000</td><td>50% of Basic</td></tr>
<tr><td>Bangalore</td><td>Non-Metro</td><td>₹18,000 – ₹35,000</td><td>40% of Basic</td></tr>
<tr><td>Hyderabad</td><td>Non-Metro</td><td>₹14,000 – ₹25,000</td><td>40% of Basic</td></tr>
<tr><td>Pune</td><td>Non-Metro</td><td>₹12,000 – ₹22,000</td><td>40% of Basic</td></tr>
<tr><td>Ahmedabad</td><td>Non-Metro</td><td>₹8,000 – ₹16,000</td><td>40% of Basic</td></tr>
<tr><td>Noida / Gurgaon</td><td>Non-Metro</td><td>₹14,000 – ₹28,000</td><td>40% of Basic</td></tr>
</table>
<p><strong>Note:</strong> Despite Gurgaon and Noida being part of the NCR, they fall in Haryana and UP respectively — only areas within Delhi's boundary qualify for Metro (50%) classification.</p>
`,
    },
    "gratuity-calculator": {
        subtitle: "Estimate your gratuity payout based on the 15/26 formula. Check eligibility criteria and tax exemption limits up to ₹25 Lakhs.",
        explanation: {
            heading: "Understanding Gratuity Calculations",
            paragraphs: [
                "Gratuity is a statutory right under the Payment of Gratuity Act, 1972. It is a monetary reward given by an employer to an employee for services rendered to the company. To be eligible, an employee must have completed at least 5 years of continuous service with the same employer.",
                "The legal formula for calculation is: (15 / 26) × Last Drawn Salary × Number of Years of Service. Here, 'Last Drawn Salary' means your Basic Salary plus Dearness Allowance (DA). For years of service, anything above 6 months is rounded up to the next full year.",
            ],
            highlight: "Tax Exemption: Gratuity received up to ₹25 Lakhs (increased from ₹20L recently) is completely exempt from income tax. Any amount received above ₹25 Lakhs is added to your salary income and taxed as per your slab rate.",
        },
        faq: [
            { question: "Is 5 years strictly mandatory for Gratuity?", answer: "Generally, yes. You must complete 5 years of continuous service. However, the condition of 5 years is waived in cases of death or disablement of the employee." },
            { question: "Does Gratuity calculation include allowances?", answer: "No. Gratuity is strictly calculated on Basic Salary + Dearness Allowance (DA). Special allowances, HRA, bonuses, and commissions are NOT included in the 'Last Drawn Salary' figure for the calculation." },
            { question: "How do you count the number of years?", answer: "If you have worked for 5 years and 7 months, it is rounded up to 6 years for the calculation. If you worked for 5 years and 4 months, it is rounded down to 5 years. (Note: You must still cross the 5-year initial threshold first)." },
        ],
    },
    "bonus-calculator": {
        subtitle: "Calculate your statutory bonus under the Payment of Bonus Act, 1965. Check eligibility, salary capping rules, and bonus from 8.33% to 20%.",
        explanation: { heading: "Statutory Bonus in India — Complete Guide (Payment of Bonus Act, 1965)", contentHTML: `<p>The <strong>Payment of Bonus Act, 1965</strong> mandates that eligible employees in India receive an annual bonus ranging from <strong>8.33% (minimum) to 20% (maximum)</strong> of their salary. This is a statutory right, not a discretionary benefit — employers are legally required to pay it.</p>

<h3>What is Statutory Bonus?</h3>
<p>Statutory bonus is a mandatory annual payment to employees governed by the <strong>Payment of Bonus Act, 1965</strong> (as amended in 2015). The Act applies to every factory and establishment with <strong>20 or more employees</strong> on any day during the accounting year. Key points:</p>
<ul>
<li>It is <strong>not a performance bonus</strong> — it is a legal entitlement irrespective of individual performance</li>
<li>The minimum bonus (8.33%) must be paid even if the employer has <strong>no profits or incurs losses</strong></li>
<li>Maximum bonus (20%) is linked to the employer's <strong>allocable surplus</strong> (available profits)</li>
<li>Bonus must be paid within <strong>8 months</strong> of the close of the accounting year</li>
</ul>

<h3>Who is Eligible for Statutory Bonus?</h3>
<table><thead><tr><th>Criterion</th><th>Requirement</th><th>Details</th></tr></thead><tbody>
<tr><td><strong>Salary Ceiling</strong></td><td>Basic + DA ≤ ₹21,000/month</td><td>Employees earning above ₹21,000 (Basic + DA) are excluded from the Act</td></tr>
<tr><td><strong>Minimum Working Days</strong></td><td>At least 30 days in the FY</td><td>Even if resigned or terminated, bonus is payable if 30+ days worked</td></tr>
<tr><td><strong>Establishment Size</strong></td><td>20+ employees</td><td>Applies to factories and establishments with 20+ employees on any day during the year</td></tr>
<tr><td><strong>Employee Type</strong></td><td>All types eligible</td><td>Manual, clerical, supervisory, and technical staff — except managerial positions</td></tr>
<tr><td><strong>Age</strong></td><td>Must have completed 15 years</td><td>Disqualified if below 15 years of age</td></tr>
</tbody></table>

<h3>Statutory Bonus Calculation Formula</h3>
<p>The calculation has a critical nuance — there is a <strong>salary cap</strong> for computation:</p>
<p><strong>Bonus = Calculation Salary × Bonus % × (Days Worked ÷ Total Working Days in Year)</strong></p>
<p>The <strong>Calculation Salary</strong> is determined as follows:</p>
<table><thead><tr><th>Employee's Basic + DA</th><th>Calculation Salary Used</th><th>Why</th></tr></thead><tbody>
<tr><td>Up to ₹7,000/month</td><td>Actual Basic + DA</td><td>Below the statutory cap</td></tr>
<tr><td>₹7,001 – ₹21,000/month</td><td>₹7,000/month (or Minimum Wage, whichever is higher)</td><td>Salary is capped at ₹7,000 for calculation</td></tr>
<tr><td>Above ₹21,000/month</td><td>NOT eligible for statutory bonus</td><td>Excluded under the Act</td></tr>
</tbody></table>
<p><em>Note: In scheduled employments, if the <strong>minimum wage</strong> exceeds ₹7,000, the minimum wage is used as the calculation base instead of ₹7,000.</em></p>

<h3>Worked Examples — Bonus at Different Salary Levels</h3>
<table><thead><tr><th>Scenario</th><th>Basic + DA</th><th>Calculation Salary</th><th>Bonus @ 8.33%</th><th>Bonus @ 20%</th></tr></thead><tbody>
<tr><td>Low salary employee</td><td>₹5,000/month</td><td>₹5,000 (actual)</td><td>₹4,998/year</td><td>₹12,000/year</td></tr>
<tr><td>Mid-range employee</td><td>₹15,000/month</td><td>₹7,000 (capped)</td><td>₹6,997/year</td><td>₹16,800/year</td></tr>
<tr><td>Near ceiling employee</td><td>₹21,000/month</td><td>₹7,000 (capped)</td><td>₹6,997/year</td><td>₹16,800/year</td></tr>
<tr><td>Above ceiling (₹25K)</td><td>₹25,000/month</td><td>Not eligible</td><td>₹0</td><td>₹0</td></tr>
</tbody></table>
<p><strong>Key insight</strong>: An employee earning ₹15,000 and one earning ₹21,000 receive the <strong>same statutory bonus amount</strong> because the calculation base is capped at ₹7,000. The bonus difference only matters below ₹7,000.</p>

<h3>Minimum vs Maximum Bonus</h3>
<table><thead><tr><th>Type</th><th>Percentage</th><th>When Applicable</th><th>Annual Amount (on ₹7,000 cap)</th></tr></thead><tbody>
<tr><td><strong>Minimum Bonus</strong></td><td>8.33%</td><td>Mandatory — regardless of profit or loss</td><td>₹6,997/year (₹583/month)</td></tr>
<tr><td><strong>Maximum Bonus</strong></td><td>20%</td><td>When allocable surplus is sufficient</td><td>₹16,800/year (₹1,400/month)</td></tr>
</tbody></table>
<p>The actual bonus percentage depends on the employer's <strong>allocable surplus</strong> — the available profit after specified deductions. If surplus exists beyond 8.33%, employers can pay up to 20%.</p>

<h3>Compliance Requirements for Employers</h3>
<ul>
<li><strong>Payment deadline</strong>: Bonus must be paid within <strong>8 months</strong> of the accounting year's close (i.e., by Nov 30 for March-ending FY)</li>
<li><strong>Records to maintain</strong>: Form A (computation of gross profits), Form B (computation of available surplus), Form C (bonus paid), Form D (deduction register)</li>
<li><strong>Penalty for non-compliance</strong>: Imprisonment up to <strong>6 months</strong>, fine up to <strong>₹1,000</strong>, or both</li>
<li><strong>Set-off and carry forward</strong>: If bonus paid exceeds allocable surplus, employer can set off excess against future years (up to 4 years)</li>
<li><strong>Adjustment against ex-gratia</strong>: Any customary or interim bonus (Diwali bonus, festival bonus) already paid can be adjusted against statutory bonus liability</li>
</ul>

<h3>Who is Excluded from Statutory Bonus?</h3>
<ul>
<li>Employees earning above <strong>₹21,000/month</strong> (Basic + DA)</li>
<li>Apprentices under the <strong>Apprentices Act, 1961</strong></li>
<li>Employees of <strong>LIC, RBI, UIDAI, hospitals, educational institutions, chambers of commerce</strong>, and other bodies listed under Section 32</li>
<li>Employees dismissed for <strong>fraud, misconduct, theft, or sabotage</strong> (bonus forfeited)</li>
<li>Employees of <strong>new establishments</strong> — exempted for the first 5 years (for first 6 years if establishment starts with losses)</li>
</ul>

<h3>Tax Treatment of Bonus</h3>
<p>Statutory bonus is <strong>fully taxable</strong> as "Income from Salary" under the Income Tax Act. It is taxed at your applicable slab rate. Key points:</p>
<ul>
<li>Employer deducts <strong>TDS</strong> on bonus along with salary</li>
<li>Bonus is shown in <strong>Form 16</strong> and your salary slip</li>
<li>For the employer, bonus paid is a <strong>deductible business expense</strong> under Section 36(1)(ii)</li>
<li>If bonus is received as <strong>arrears</strong> for multiple years, you can claim relief under <strong>Section 89(1)</strong></li>
</ul>` },
        faq: [
            { question: "Who is eligible for a statutory bonus?", answer: "Employees drawing Basic + DA of up to ₹21,000/month and who have worked for at least 30 days in the accounting year in an establishment with 20+ employees. This applies to manual, clerical, supervisory, and technical staff — but excludes managerial positions." },
            { question: "What is the minimum and maximum bonus percentage?", answer: "The statutory minimum is 8.33% (mandatory even in loss-making years). The maximum under the Act is 20%, payable when the employer has sufficient allocable surplus. Any amount above 20% is considered ex-gratia." },
            { question: "Is the statutory bonus taxable?", answer: "Yes, fully taxable under 'Income from Salary'. TDS is deducted by the employer. It appears in your Form 16 and salary slip. If received as arrears for multiple years, you may claim relief under Section 89(1) of the Income Tax Act." },
            { question: "Can I get bonus if I resigned mid-year?", answer: "Yes. If you worked for at least 30 days in the accounting year, you are entitled to proportionate bonus. For example, if you worked 6 months out of 12, you receive 50% of the annual bonus amount. This applies even if you resign voluntarily." },
            { question: "Why is bonus calculated on ₹7,000 when my salary is ₹20,000?", answer: "Under the Act, bonus is calculated on ₹7,000/month (or the minimum wage, whichever is higher) — not on your actual salary. This cap applies to all employees earning between ₹7,001 and ₹21,000. So an employee earning ₹20,000 gets the same bonus as one earning ₹10,000." },
            { question: "Is Diwali bonus the same as statutory bonus?", answer: "Not necessarily. Many companies pay a 'Diwali bonus' or 'festival bonus' which may be ex-gratia (discretionary). However, employers can adjust this against the statutory bonus obligation. If your Diwali bonus equals or exceeds the statutory minimum, the employer may treat it as fulfilling the statutory requirement." },
            { question: "Do government employees get statutory bonus?", answer: "Government employees are generally not covered under the Payment of Bonus Act. However, the government separately announces ad-hoc bonus/productivity-linked bonus (PLB) for central government employees, typically around ₹7,000 for Group C and D staff." },
            { question: "Is bonus payable during the probation period?", answer: "Yes. The Act does not distinguish between probationary and confirmed employees. As long as the employee has worked for 30+ days and meets the salary ceiling (≤₹21,000 Basic+DA), they are eligible — even during probation." }
        ],
    },
};

export default async function SalaryCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const allSalaryCalcs = getCalculatorsByCategory("salary");
    const calc = allSalaryCalcs.find((c) => c.slug === calculator);
    if (!calc) notFound();

    const hub = HUB_CONTENT[calc.slug];
    if (!hub) notFound();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Salary Calculators", url: `${SITE_URL}/salary-calculators` },
            { name: calc.title },
        ]),
        webAppSchema(
            calc.title,
            canonicalUrl(`/salary-calculators/${calc.slug}`),
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
                    { label: "Salary Calculators", href: "/salary-calculators" },
                    { label: calc.title },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {hub.subtitle && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {hub.subtitle}
                </p>
            )}
            <AuthorBadge categoryKey="salary" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <SalaryCalculatorCore calcType={calc.calcType || "in-hand-salary"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <DynamicExplanation
                heading={hub.explanation.heading}
                paragraphs={hub.explanation.paragraphs}
                contentHTML={hub.explanation.contentHTML}
                highlight={hub.explanation.highlight}
            />

            {hub.contentHTML && (
                <section className="calc-card" style={{ marginTop: "var(--s-6)", padding: "var(--s-6)" }}>
                    <div className="hub-content" dangerouslySetInnerHTML={{ __html: hub.contentHTML }} />
                </section>
            )}

            <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />
        </main >
    );
}

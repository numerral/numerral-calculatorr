// Dynamic Hub — /salary-calculators/[calculator]/
// Each salary calculator gets its own hub page with calculator + explanation + FAQ

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
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
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "salary-after-tax": {
        subtitle: "Calculate your net take-home salary after income tax, EPF, professional tax, and other deductions for FY 2025-26.",
        explanation: {
            heading: "Understanding Salary After Tax Deductions",
            paragraphs: [
                "Your Cost to Company (CTC) is never the amount credited to your bank account. Significant portions are deducted for statutory compliance and taxes before you receive your 'In-Hand' or 'Net' salary.",
                "First, Employer EPF and Gratuity are removed from the CTC to arrive at your Gross Salary. From the Gross Salary, Employee EPF (typically 12% of basic), Professional Tax (state-dependent), and Income Tax (TDS) based on your chosen regime are deducted. The final remaining amount is your Salary After Tax.",
            ],
            highlight: "₹12 Lakh CTC → ~₹88,000/month in-hand (New Regime). The ₹12L income is effectively tax-free under the New Regime (FY 25-26), but you still lose ~₹12,000/month to EPF (employer + employee shares) and Professional Tax.",
        },
        faq: [
            { question: "Why is my Salary After Tax different from my Gross Salary?", answer: "Gross Salary only removes employer contributions (like Employer EPF and Gratuity) from the CTC. Salary After Tax further removes your own deductions: Employee EPF, Professional Tax, and Income Tax (TDS)." },
            { question: "Does the New Tax Regime increase my take-home salary?", answer: "For most people earning up to ₹15 Lakhs without heavy deductions (like high HRA and home loans), the New Regime results in lower tax and therefore a higher in-hand salary. Income up to ₹12.75L (including standard deduction) is tax-free in FY 25-26." },
            { question: "Are EPF deductions mandatory?", answer: "Yes, if your basic salary is up to ₹15,000 per month, EPF contribution (12% from employee and 12% from employer) is mandatory. Many companies apply this 12% to your full basic salary even if it exceeds ₹15,000 to encourage retirement savings." },
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
        subtitle: "Calculate your HRA tax exemption under Section 10(13A) using the three-rule system and find your precise taxable allowance.",
        explanation: {
            heading: "Maximizing HRA Exemption in Your Salary",
            paragraphs: [
                "House Rent Allowance (HRA) is a common salary component that offers significant tax benefits if you live in a rented accommodation. However, receiving HRA doesn't mean it's 100% tax-free. HRA exemption is ONLY available under the Old Tax Regime.",
                "The actual exempt amount is strictly the LOWEST of three calculated values: 1) The actual HRA received from your employer, 2) 50% of your Basic Salary if living in a Metro (or 40% for Non-Metro), 3) Actual rent paid minus 10% of your Basic Salary.",
            ],
            highlight: "Living with your parents? You can still claim HRA! You can pay rent formally to your parents (who must declare it as rental income) and claim the HRA exemption. If they are in a lower tax bracket, this saves the family significant tax.",
        },
        faq: [
            { question: "Is HRA exemption available in the New Tax Regime?", answer: "No. The New Tax Regime does not allow deductions for HRA under Section 10(13A). This is one of the main reasons why high-rent paying individuals often stick to the Old Tax Regime." },
            { question: "What happens if rent paid minus 10% of basic is zero or negative?", answer: "If your annual rent paid is less than 10% of your basic salary, your HRA exemption becomes ZERO. You must pay rent exceeding 10% of your basic to claim any tax benefit." },
            { question: "Which cities qualify as Metro for the 50% HRA rule?", answer: "For income tax purposes, only four cities classify as Metro: Mumbai, Delhi, Kolkata, and Chennai. If you rent in Bangalore, Hyderabad, or Pune, you fall under the 40% (Non-Metro) rule." },
        ],
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
        subtitle: "Calculate your statutory bonus under the Payment of Bonus Act (8.33% to 20%) and understand your eligibility and capping rules.",
        explanation: {
            heading: "Demystifying Statutory Bonus in India",
            paragraphs: [
                "Under the Payment of Bonus Act, 1965, eligible employees are entitled to a mandatory annual statutory bonus ranging from a minimum of 8.33% to a maximum of 20% of their salary.",
                "However, there is a strict calculation ceiling. For the purpose of calculating this bonus, the salary is capped at ₹7,000 per month or the minimum wage, whichever is higher. In most practical implementations today, companies calculate the minimum bonus (8.33%) capping the basic salary at ₹21,000 per month.",
            ],
            highlight: "If your Basic Salary is ₹50,000/month, your statutory bonus is NOT 8.33% of ₹50,000. It is calculated on a maximum cap of ₹21,000 — meaning your minimum guaranteed annual bonus is roughly ₹21,000 × 8.33% × 12 = ₹21,000/year.",
        },
        faq: [
            { question: "Who is eligible for a statutory bonus?", answer: "Employees drawing a salary/wage of up to ₹21,000 per month and who have worked for at least 30 days in the accounting year are eligible under the Act. However, many companies apply the rule universally across the CTC structure." },
            { question: "What is the minimum and maximum bonus percentage?", answer: "The statutory minimum bonus is 8.33% of the salary (capped at ₹21,000/mth). The maximum bonus that can be paid under the act, based on the employer's allocable surplus, is 20%." },
            { question: "Is the statutory bonus taxable?", answer: "Yes, the bonus received is fully taxable as it forms a part of your 'Income from Salary'. It will be taxed according to your applicable income tax slab rate." },
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
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{hub.subtitle}</p>

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

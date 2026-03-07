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
        subtitle: "Deconstruct your CTC package. See exactly how much goes into PF, gratuity, taxes, and your actual take-home pay.",
        explanation: {
            heading: "Demystifying the CTC Breakdown",
            paragraphs: [
                "When you receive a job offer, the number you focus on is the CTC. However, the CTC is heavily structured. It typically includes Basic Salary (40-50%), House Rent Allowance (HRA), Special Allowance, Employer's contribution to EPF, and Gratuity.",
                "Basic Salary forms the foundation — your PF, HRA, and Gratuity are strictly calculated as percentages of your Basic. A higher basic means higher PF deductions (lower take-home) but better HRA exemption and retirement corpus. A lower basic means a higher special allowance (fully taxable) but higher current take-home pay.",
            ],
            highlight: "A ₹10 Lakh CTC does NOT mean ₹83,333 per month. After removing ~₹60,000 for EPF and Gratuity, your Gross is ₹9.4L. After deducting your PF share, PT, and Tax, your actual take-home will be closer to ₹73,000/month.",
        },
        faq: [
            { question: "Why is Gratuity included in my CTC if I don't get paid for it monthly?", answer: "Companies include Gratuity (typically 4.81% of basic salary) in the CTC because it is a provisioned cost to the company. However, you only receive this money if you resign or retire after completing 5 continuous years of service." },
            { question: "What is Special Allowance?", answer: "Special Allowance is the balancing figure in your CTC structure. Once Basic, HRA, PF, and other fixed components are decided, whatever is left of the CTC is bundled under 'Special Allowance'. It is fully taxable." },
            { question: "Should I negotiate for a higher Basic Salary?", answer: "It depends on your goals. A higher Basic Salary increases your HRA tax exemption limit and helps build a strong retirement corpus (higher PF). But it also reduces your monthly in-hand cash since EPF deductions will be higher." },
        ],
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

            <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />
        </main >
    );
}

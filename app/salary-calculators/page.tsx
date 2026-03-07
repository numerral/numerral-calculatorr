// Salary Calculators Category Page — /salary-calculators/
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Salary Calculators — CTC to Take Home, Gratuity & Bonus in India",
    description:
        "Calculate your actual in-hand salary from CTC. Includes salary after tax, EPF deductions, gratuity, bonus, and HRA exemption tools for FY 2025-26.",
    alternates: { canonical: canonicalUrl("/salary-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Salary Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Salary Calculators",
        description: "All salary calculators including CTC to in-hand, gross payload, gratuity, bonus, and HRA.",
        url: canonicalUrl("/salary-calculators"),
    },
]);

export default function SalaryCalculatorsPage() {
    const salaryCalcs = getCalculatorsByCategory("salary");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-salary-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Salary Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Salary Calculators — Take Home, Gratuity & Bonus
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Understand your exact salary breakdown with our free tools. Convert CTC to take-home pay, calculate
                tax deductions, estimate your gratuity payout, and check your statutory bonus eligibility.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Salary & Income Tools</h2>
                <div className="calc-index-grid">
                    {salaryCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/salary-calculators/${calc.slug}`}
                            className="calc-index-card"
                        >
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <span className="calc-index-card__stars">
                                    {"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <DynamicExplanation
                heading="Understanding Indian Salary Structures"
                paragraphs={[
                    "A Cost to Company (CTC) package in India usually comprises Direct Benefits (Basic, HRA, Special Allowance), Indirect Benefits (Employer EPF, Gratuity), and Taxes (Income Tax, Professional Tax).",
                    "A common misconception is that CTC equals your in-hand salary. In reality, Employer EPF (12% of basic) and Gratuity (4.81% of basic) are deducted from the CTC before arriving at your Gross Salary. From the Gross Salary, Employee EPF, Professional Tax, and Income Tax (TDS) are further deducted to give you your Net Take-Home Pay.",
                ]}
                highlight="Pro tip: Always ask HR for the 'Gross Salary' instead of just the CTC. The Gross Salary determines what actually hits your bank account after mandatory deductions."
            />

            <FAQAccordion
                title="Salary Calculator FAQ"
                items={[
                    {
                        question: "Why is my In-Hand salary much lower than my CTC?",
                        answer: "Because CTC includes employer contributions to EPF and Gratuity, which you don't receive monthly. Plus, your share of EPF (12%), Professional Tax, and Income Tax (TDS) are deducted from your gross pay before it reaches your bank account.",
                    },
                    {
                        question: "How is Basic Salary determined?",
                        answer: "Most companies set basic salary at 40% to 50% of the CTC. This is crucial because HRA, EPF, and Gratuity are all calculated as a percentage of your basic salary.",
                    },
                    {
                        question: "Is Gratuity paid every year?",
                        answer: "No. Gratuity is a lump sum paid by the employer only when you leave the organization after completing a minimum of 5 continuous years of service. However, companies deduct it annually from your CTC structure.",
                    },
                    {
                        question: "Is bonus part of my CTC?",
                        answer: "Yes, guaranteed statutory bonus (minimum 8.33% of basic) or performance variable pay is usually included in the CTC. However, variable pay is only paid out based on company or individual performance.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["salary"]} />
            </section>
        </main>
    );
}

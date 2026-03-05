// Utility Calculators Category Page — /utility-calculators/
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
    title: "Utility Calculators — Age, Percentage, BMI & More",
    description:
        "Free utility calculators: Age Calculator, Percentage, Compound & Simple Interest, BMI, and Discount Calculator. Instant, accurate results.",
    alternates: { canonical: canonicalUrl("/utility-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Utility Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Utility Calculators",
        description: "All utility calculators including age, percentage, compound interest, simple interest, BMI, and discount.",
        url: canonicalUrl("/utility-calculators"),
    },
]);

export default function UtilityCalculatorsPage() {
    const utilCalcs = getCalculatorsByCategory("utility");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-utility-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Utility Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Utility Calculators — Age, Percentage, BMI & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Everyday calculators for quick calculations — find your exact age, calculate percentages,
                compare simple vs compound interest, check BMI, and compute discounts instantly.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Utility Calculators</h2>
                <div className="calc-index-grid">
                    {utilCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/utility-calculators/${calc.slug}`}
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
                heading="Why Use Utility Calculators?"
                paragraphs={[
                    "Our utility calculators cover everyday math that saves you time. Whether you're computing a sale discount, checking your BMI, or figuring out compound interest on your savings — these tools give you instant, accurate results.",
                    "The Compound Interest Calculator helps you visualize the power of compounding across monthly, quarterly, and yearly frequencies. The BMI Calculator provides your weight category with a healthy range for your height. Each tool is designed to be fast, mobile-friendly, and completely free.",
                ]}
                highlight="Pro tip: Compound interest vs simple interest on ₹1L at 8% for 5 years — CI gives ₹1,48,985 while SI gives ₹1,40,000. That's ₹8,985 extra from compounding alone!"
            />

            <FAQAccordion
                title="Utility Calculator FAQ"
                items={[
                    {
                        question: "How accurate is the Age Calculator?",
                        answer: "Our age calculator computes exact years, months, and days accounting for varying month lengths. It also shows your age in total days, weeks, and months, plus days until your next birthday.",
                    },
                    {
                        question: "What is the difference between simple and compound interest?",
                        answer: "Simple interest is calculated only on the principal amount. Compound interest is calculated on the principal plus accumulated interest. Over time, compound interest grows exponentially — the longer the tenure, the bigger the gap.",
                    },
                    {
                        question: "What is a healthy BMI range?",
                        answer: "A BMI between 18.5 and 24.9 is considered normal/healthy. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese. BMI is a screening tool — consult a healthcare provider for a complete assessment.",
                    },
                    {
                        question: "How does the double discount work?",
                        answer: "Double discount applies two discounts sequentially. For example, 20% + 10% on ₹5,000: first discount gives ₹4,000, then 10% on ₹4,000 gives ₹3,600. The effective discount is 28% (not 30%).",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["utility"]} />
            </section>
        </main>
    );
}

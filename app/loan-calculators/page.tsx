// Category Page — /loan-calculators/ (Server Component)
// Data sourced from: calculators.json → lib/data.ts

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Loan Calculators — EMI, Eligibility & Comparison Tools",
    description:
        "Explore all loan calculators: Car Loan EMI, Home Loan EMI, Personal Loan EMI, Education Loan and more. Free, instant results on Numerral.",
    alternates: { canonical: canonicalUrl("/loan-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Loan Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Loan Calculators",
        description: "All loan-related calculators including EMI, eligibility and comparison tools.",
        url: canonicalUrl("/loan-calculators"),
    },
]);

export default function LoanCalculatorsPage() {
    const loanCalcs = getCalculatorsByCategory("loan");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Loan Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Loan Calculators — EMI, Eligibility & Comparison Tools
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Plan smarter with our full suite of loan calculators. Get instant EMI
                breakdowns, compare scenarios, and understand total costs before you borrow.
            </p>

            {/* Calculator index — card grid */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Loan Calculators</h2>
                <div className="calc-index-grid">
                    {loanCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/${calc.categorySlug}/${calc.slug}`}
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
                heading="Understanding Loan Calculators"
                paragraphs={[
                    "Loan calculators help you estimate monthly payments before committing to any borrowing. Whether you're financing a car, home, or education, understanding your EMI upfront prevents over-leveraging.",
                    "Each calculator supports flexible inputs — adjust the loan amount, interest rate, and tenure to see how changes impact your monthly outflow.",
                ]}
                highlight="Pro tip: Always compare the total payable amount, not just the EMI. A lower EMI with longer tenure often costs more in total interest."
            />

            <FAQAccordion
                title="Loan Calculator FAQ"
                items={[
                    {
                        question: "Are these calculators accurate?",
                        answer: "Yes. Our calculators use the same reducing-balance EMI formula (PMT) used by major Indian banks and NBFCs.",
                    },
                    {
                        question: "How do I choose between a longer or shorter tenure?",
                        answer: "Shorter tenure = higher EMI but less total interest. Longer tenure = lower EMI but significantly more interest paid overall.",
                    },
                    {
                        question: "Can I compare multiple loan offers?",
                        answer: "Yes! Use our Loan Comparison tool to compare EMIs across different banks and interest rates side by side.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["loan"]} />
            </section>
        </main>
    );
}

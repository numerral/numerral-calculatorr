// Tax Calculators Category Page — /tax-calculators/
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
    title: "Tax Calculators — Income Tax, GST, HRA & TDS Tools for India",
    description:
        "Calculate income tax (old & new regime), GST, HRA exemption, TDS, capital gains tax & professional tax. Free, instant results for FY 2025-26.",
    alternates: { canonical: canonicalUrl("/tax-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Tax Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Tax Calculators",
        description: "All tax calculators including income tax, GST, HRA exemption, TDS, capital gains, and professional tax.",
        url: canonicalUrl("/tax-calculators"),
    },
]);

export default function TaxCalculatorsPage() {
    const taxCalcs = getCalculatorsByCategory("tax");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-tax-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Tax Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Tax Calculators — Income Tax, GST, HRA & TDS Tools
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Estimate your tax liability accurately with our free tax calculators. Compare old vs new regime,
                split GST, calculate HRA exemptions, and plan your tax-saving strategy for FY 2025-26.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Tax Calculators</h2>
                <div className="calc-index-grid">
                    {taxCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/tax-calculators/${calc.slug}`}
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
                heading="Understanding Tax Calculators"
                paragraphs={[
                    "Indian taxation involves multiple layers — income tax with dual regime options, GST on goods and services, TDS deducted at source, and state-level professional tax. Our calculators help you navigate each one with precision.",
                    "The New Tax Regime (FY 2025-26) offers simplified slabs with no deductions, while the Old Regime allows deductions under 80C, 80D, and HRA. The right choice depends on your deduction profile — our Income Tax Calculator compares both regimes instantly.",
                ]}
                highlight="Pro tip: If your total deductions (80C + 80D + HRA + others) exceed ₹3.75 Lakh, the Old Regime is likely better for incomes above ₹15 Lakh. Below that, the New Regime's ₹12 Lakh rebate makes it almost always cheaper."
            />

            <FAQAccordion
                title="Tax Calculator FAQ"
                items={[
                    {
                        question: "What is the income tax rebate under the New Regime?",
                        answer: "Under the New Regime for FY 2025-26, income up to ₹12 Lakh is effectively tax-free due to the Section 87A rebate. This means salaried individuals with income up to ₹12,75,000 (including ₹75,000 standard deduction) pay zero tax.",
                    },
                    {
                        question: "How is GST calculated?",
                        answer: "GST is calculated at 5%, 12%, 18%, or 28% depending on the item category. For intra-state supply, it's split equally into CGST and SGST. For inter-state, the full amount is IGST. Our calculator handles both inclusive and exclusive modes.",
                    },
                    {
                        question: "What is HRA exemption and who can claim it?",
                        answer: "HRA exemption is available to salaried employees who receive HRA and pay rent. The exempt amount is the minimum of: actual HRA received, 50%/40% of basic salary (metro/non-metro), or rent paid minus 10% of basic salary.",
                    },
                    {
                        question: "When is TDS deducted?",
                        answer: "TDS is deducted at source when income exceeds specified thresholds — ₹2.5L for salary, ₹40,000 for interest (bank), ₹2.4L for rent, ₹30,000 for professional fees, and ₹50L for property sale.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["tax"]} />
            </section>
        </main>
    );
}

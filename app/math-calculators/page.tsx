// Math Calculators Category Page — /math-calculators/
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import AuthorBadge from "@/components/shared/AuthorBadge";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Math Calculators — Percentage, Fractions, Algebra & Statistics",
    description:
        "Free online math calculators: percentages, fractions, GCD, LCM, quadratic equations, exponents, factorials, averages, standard deviation, and long division. Step-by-step solutions with formulas explained.",
    alternates: { canonical: canonicalUrl("/math-calculators") },
};

const FAQ_ITEMS = [
                    {
                        question: "Are these calculators suitable for school and college homework?",
                        answer: "Yes — every calculator shows the formula used and step-by-step working. This means you can verify your manual calculations against the tool's output. The detailed steps also help you understand the method, not just copy an answer.",
                    },
                    {
                        question: "How accurate are these math calculators?",
                        answer: "All calculators use standard floating-point arithmetic with precision up to 10+ decimal places. For everyday math, homework, and professional use, the results are exact. The factorial calculator supports values up to 170! (the limit of JavaScript's number representation).",
                    },
                    {
                        question: "Can I use these on my phone?",
                        answer: "Absolutely. All calculators are fully responsive and work on any screen size — phones, tablets, and desktops. No app installation required.",
                    },
                    {
                        question: "Do you plan to add more math calculators?",
                        answer: "Yes. We are actively adding calculators for geometry (area, volume, perimeter), trigonometry (sin, cos, tan), probability, logarithms, and more. Check back regularly for new tools.",
                    },
                ];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Math Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Math Calculators",
        description: "Free online math calculators with step-by-step solutions for percentages, fractions, algebra, statistics, and number operations.",
        url: canonicalUrl("/math-calculators"),
    },
,
    faqSchema(FAQ_ITEMS)]);

export default function MathCalculatorsPage() {
    const calcs = getCalculatorsByCategory("math");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-math-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Math Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Math Calculators — Percentage, Fractions, Algebra & Statistics
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                Free math calculators with step-by-step solutions — calculate percentages, add and subtract fractions,
                find GCD and LCM, solve quadratic equations, compute exponents and factorials, calculate averages
                and standard deviations, and perform long division. Every tool shows the formula, explains the method,
                and walks you through worked examples.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="math" />
            </div>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Math Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/math-calculators/${calc.slug}`}
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
                heading="Why Use Online Math Calculators?"
                paragraphs={[
                    "Mathematics is the foundation of science, engineering, finance, and everyday problem-solving. Our math calculators don't just give you the answer — they show you the formula, walk you through each step, and explain the underlying concept. This makes them equally useful for students learning the material and professionals who need quick, verified results.",
                    "Each calculator uses established mathematical methods — the Euclidean algorithm for GCD, the quadratic formula for second-degree equations, the standard formulas for mean, median, mode, and standard deviation. Results are computed instantly and displayed alongside the full working, so you can verify every step.",
                ]}
                highlight="Start with the Percentage Calculator for everyday calculations, or try the Quadratic Equation Solver for algebra. The Average and Standard Deviation calculators are essential tools for statistics coursework and data analysis."
            />

            <FAQAccordion
                title="Math Calculator FAQ"
                items={FAQ_ITEMS}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["math"]} />
            </section>
        </main>
    );
}

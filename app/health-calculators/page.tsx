// Health Calculators Category Page — /health-calculators/
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
    title: "Health Calculators — BMI, Calories, TDEE, Body Fat & More",
    description:
        "Free health & fitness calculators: BMI, calorie needs, TDEE, body fat percentage, ideal weight, macros, pregnancy due date, heart rate zones, and more. Instant, science-backed results.",
    alternates: { canonical: canonicalUrl("/health-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Health Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Health Calculators",
        description: "Free health and fitness calculators for BMI, calories, TDEE, body fat, ideal weight, macros, pregnancy, and more.",
        url: canonicalUrl("/health-calculators"),
    },
]);

export default function HealthCalculatorsPage() {
    const calcs = getCalculatorsByCategory("health");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-health-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Health Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Health Calculators — BMI, Calories, TDEE, Body Fat & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Free health and fitness calculators — check your BMI, calculate daily calorie needs,
                find your TDEE and BMR, estimate body fat percentage, plan macros, track pregnancy milestones,
                find heart rate training zones, and more. All tools use established scientific formulas for accurate results.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Health Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/health-calculators/${calc.slug}`}
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
                heading="Why Use Health Calculators?"
                paragraphs={[
                    "Understanding your body's metrics is the foundation of any health or fitness journey. Our calculators use established scientific formulas — Mifflin-St Jeor for BMR, the Navy method for body fat, Karvonen for heart rate zones — to give you accurate, personalised results based on your inputs.",
                    "Whether you're tracking calories for weight management, planning macros for muscle gain, estimating your pregnancy due date, or checking if your blood pressure is in a healthy range, these tools provide instant, reliable answers. All calculations use metric units and are globally applicable.",
                ]}
                highlight="Start with the BMI Calculator for a quick health snapshot, then use the TDEE Calculator to find your daily calorie needs and the Macro Calculator to plan your nutrition."
            />

            <FAQAccordion
                title="Health Calculator FAQ"
                items={[
                    {
                        question: "How accurate are these health calculators?",
                        answer: "Our calculators use established medical and scientific formulas (Mifflin-St Jeor, Harris-Benedict, Navy method, Karvonen, etc.) that are widely used by healthcare professionals. Results are estimates — for medical decisions, always consult a qualified healthcare provider.",
                    },
                    {
                        question: "Which calorie calculator should I use — Calorie, TDEE, or BMR?",
                        answer: "BMR gives you base calories at rest. TDEE adds your activity level. The Calorie Calculator combines both and shows maintenance, weight loss, and weight gain targets. For most people, start with the Calorie Calculator.",
                    },
                    {
                        question: "Are these calculators suitable for all ages?",
                        answer: "Most calculators are designed for adults (18+). The BMI Calculator and calorie-based tools use adult formulas. For children and adolescents, consult a paediatrician for appropriate growth and nutrition guidance.",
                    },
                    {
                        question: "What units do these calculators use?",
                        answer: "All calculators use metric units — kilograms for weight, centimetres for height, and litres for volume. This makes them universally applicable regardless of your location.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["health"]} />
            </section>
        </main>
    );
}

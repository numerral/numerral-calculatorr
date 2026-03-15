// Construction Calculators Category Page — /construction-calculators/
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
    title: "Construction Calculators — Concrete, Roofing, Flooring & More",
    description:
        "Free construction calculators: concrete volume, roofing materials, flooring area, paint coverage, drywall sheets, tile estimator, and more. Instant, accurate results for every project.",
    alternates: { canonical: canonicalUrl("/construction-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Construction Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Construction Calculators",
        description: "Free construction calculators for concrete, roofing, flooring, paint, drywall, tile, square footage, and cubic yards.",
        url: canonicalUrl("/construction-calculators"),
    },
]);

export default function ConstructionCalculatorsPage() {
    const calcs = getCalculatorsByCategory("construction");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-construction-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Construction Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Construction Calculators — Concrete, Roofing, Flooring & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Free building & renovation calculators — estimate concrete volume, roofing materials,
                flooring area, paint coverage, drywall sheets, tile count, and more. Get instant, accurate
                results for any construction project.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Construction Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/construction-calculators/${calc.slug}`}
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
                heading="Why Use Construction Calculators?"
                paragraphs={[
                    "Accurate material estimates can save you hundreds or thousands of dollars on any construction project. Over-ordering wastes money; under-ordering causes delays and extra delivery fees. Our construction calculators use industry-standard formulas to give you precise quantities for concrete, roofing, flooring, paint, drywall, and more.",
                    "Each calculator includes waste factor adjustments, unit conversions (feet, inches, meters, yards), and material-specific outputs like bag counts, bundle quantities, and coverage estimates. Whether you're a DIY homeowner or a professional contractor, these tools help you plan and budget with confidence.",
                ]}
                highlight="Pro tip: Always add 10% waste factor for standard projects and 15% for complex layouts, irregular shapes, or first-time installers. It's far cheaper to return unused materials than to make a second trip."
            />

            <FAQAccordion
                title="Construction Calculator FAQ"
                items={[
                    {
                        question: "How accurate are these construction calculators?",
                        answer: "Our calculators use the same formulas professional contractors use. Concrete volumes are calculated using standard cubic measurement. Roofing uses pitch multipliers from the NRCA. Paint calculations follow manufacturer coverage guidelines (350 sq ft/gallon). For most projects, results are accurate within 5%.",
                    },
                    {
                        question: "Should I include a waste factor?",
                        answer: "Yes, always. Construction materials require extra for cuts, breakage, and fitting around obstacles. Standard practice is 10% for rectangular rooms with simple layouts and 15% for complex shapes, diagonal patterns, or beginners. Our calculators include a waste factor input for easy adjustment.",
                    },
                    {
                        question: "What units do these calculators support?",
                        answer: "All calculators use feet and inches as primary inputs. Results include conversions to metric units (square meters, cubic meters) where applicable. Depth inputs support both inches and feet to match how different trades measure.",
                    },
                    {
                        question: "Can I use these for professional estimates?",
                        answer: "These calculators are great for material quantity estimation. For professional bids, you'll also need to account for labor, equipment, permits, subcontractor costs, and local material pricing — which vary by region and project complexity.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["construction"]} />
            </section>
        </main>
    );
}

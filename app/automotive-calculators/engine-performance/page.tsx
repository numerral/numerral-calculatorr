// Engine & Performance — Subcategory Page — /automotive-calculators/engine-performance/
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
    title: "Engine & Performance Calculators — HP, Torque, Displacement & More",
    description:
        "Free engine calculators: horsepower (3 methods), torque, displacement, compression ratio, carburetor CFM, quarter mile, gear ratio, top speed, dyno correction. Instant results with US & metric.",
    alternates: { canonical: canonicalUrl("/automotive-calculators/engine-performance") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") },
        { name: "Engine & Performance" },
    ]),
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Engine & Performance Calculators", url: canonicalUrl("/automotive-calculators/engine-performance") },
]);

export default function EnginePerformancePage() {
    const calcs = getCalculatorsByCategory("engine");
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-engine-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Engine & Performance" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Engine & Performance Calculators</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Calculate horsepower using RPM & torque, elapsed quarter-mile time, or trap speed. Determine engine displacement, compression ratio, carburetor sizing, gear ratios, and more. All results display in both US and metric units instantly.
            </p>
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Engine & Performance Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/engine-performance/${calc.slug}`} className="calc-index-card">
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3><p>{calc.description}</p>
                                <span className="calc-index-card__stars">{"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <DynamicExplanation heading="Understanding Engine Performance Metrics"
                paragraphs={[
                    "Engine horsepower and torque are the two fundamental measures of engine output. Horsepower measures the rate at which work is done — how quickly the engine can move a vehicle. Torque measures the rotational force — how much pulling strength the engine produces. The two are mathematically related: HP = (Torque × RPM) ÷ 5,252.",
                    "Engine displacement (measured in cubic inches, cubic centimeters, or liters) describes the total volume swept by all pistons in the engine. Larger displacement generally means more power, but modern turbocharging allows smaller engines to match or exceed the output of larger naturally aspirated motors. Compression ratio affects both power output and the octane fuel required.",
                ]}
                highlight="Pro tip: Use the Quarter Mile Calculator to estimate your vehicle's ET and trap speed from HP and weight — these are the two most popular drag strip metrics."
            />
            <FAQAccordion title="Engine Calculator FAQ" items={[
                { question: "What is the difference between HP and torque?", answer: "Horsepower is the rate of doing work (how fast), while torque is the force applied (how hard). A diesel truck may have more torque for towing, while a sports car may have more HP for top speed. They're related by: HP = (Torque × RPM) ÷ 5,252." },
                { question: "How accurate is the quarter-mile estimate?", answer: "The Roger Huntington formula (ET = ∛(Weight/HP) × 5.825) is accurate within 5% for most street vehicles between 10 and 18 seconds. It doesn't account for traction, driver skill, or transmission losses, so real-world times may be slightly slower." },
                { question: "What does volumetric efficiency mean?", answer: "Volumetric efficiency (VE) is how well the engine fills its cylinders with air. A typical naturally aspirated engine achieves 80–85% VE. Ram-air intake can push this to 90%+. Forced induction (turbo/supercharger) can exceed 100% VE since air is pressurized." },
            ]} />
            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["engine"]} />
            </section>
        </main>
    );
}

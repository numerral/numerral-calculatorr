// Wheels & Tires — Subcategory Page — /automotive-calculators/wheels-tires/
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
    title: "Wheels & Tires Calculators — Tire Size, Comparison, Offset & More",
    description:
        "Free tire calculators: tire size decoder, side-by-side comparison, size conversion, speedometer error, speedometer gear, wheel offset, tire pressure adjustment & bolt pattern. Instant results.",
    alternates: { canonical: canonicalUrl("/automotive-calculators/wheels-tires") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") },
        { name: "Wheels & Tires" },
    ]),
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Wheels & Tires Calculators", url: canonicalUrl("/automotive-calculators/wheels-tires") },
]);

export default function WheelsTiresPage() {
    const calcs = getCalculatorsByCategory("wheels");
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wheels-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Wheels & Tires" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Wheels & Tires Calculators</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Decode any tire size (P-metric, LT, flotation), compare two tire sizes side by side, calculate speedometer error from a tire change, find the correct wheel offset, adjust tire pressure for temperature, and verify bolt pattern compatibility — all with instant real-time results.
            </p>
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Wheels & Tires Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/wheels-tires/${calc.slug}`} className="calc-index-card">
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3><p>{calc.description}</p>
                                <span className="calc-index-card__stars">{"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <DynamicExplanation heading="Understanding Tire Size Notation"
                paragraphs={[
                    "A tire marked 225/55R17 means: 225mm tread width, 55% aspect ratio (sidewall height is 55% of width), R for radial construction, and 17-inch rim diameter. The overall tire diameter, circumference, and revolutions per mile are calculated from these three numbers. A wider tire (larger first number) provides more grip; a lower aspect ratio (smaller second number) improves handling but reduces ride comfort.",
                    "When changing tire sizes, the critical factor is overall diameter. A 3% diameter change is the generally accepted maximum before speedometer error, ABS calibration, and fender clearance become issues. Our Tire Size Comparison Calculator shows the exact diameter difference and flags whether the change is within the safe range.",
                ]}
                highlight="Always verify that your new wheel offset keeps the tire inside the fender well. Use the Wheel Offset Calculator to check inner and outer clearance changes before purchasing."
            />
            <FAQAccordion title="Wheels & Tires FAQ" items={[
                { question: "How do I read a tire size like 225/55R17?", answer: "225 = tread width in millimeters, 55 = aspect ratio (sidewall height as percentage of width), R = radial, 17 = rim diameter in inches. To find the overall diameter: sidewall = 225 × 0.55 = 123.75mm (4.87\"), diameter = 17\" + 2 × 4.87\" = 26.74 inches." },
                { question: "How much can I upsize my tires?", answer: "Stay within 3% of the original overall diameter. For a 26\" OEM tire, your range is 25.2\"–26.8\". Exceeding this causes speedometer errors (+/- 3 mph at 60), can trigger ABS/traction control warnings, and may rub on fenders during turns or over bumps." },
                { question: "What is wheel offset (ET)?", answer: "Offset (ET, from the German 'Einpresstiefe') is the distance in mm from the wheel's mounting face to its centerline. Positive offset = mounting face toward the outside (most modern cars). Negative offset = mounting face toward the inside (deep-dish wheels). Changing offset by more than 10mm requires careful clearance checks." },
            ]} />
            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["wheels"]} />
            </section>
        </main>
    );
}

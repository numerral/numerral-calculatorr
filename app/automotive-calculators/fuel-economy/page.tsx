// Fuel Economy — Subcategory Page — /automotive-calculators/fuel-economy/
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
    title: "Fuel Economy Calculators — MPG, Fuel Cost, Savings & Efficiency",
    description:
        "Free fuel economy calculators: gas mileage (MPG), fuel cost, fuel savings comparison, cost per mile, MPG to L/100km converter, fuel injector sizing, tank range & annual fuel cost. Instant results.",
    alternates: { canonical: canonicalUrl("/automotive-calculators/fuel-economy") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Automotive Calculators", url: canonicalUrl("/automotive-calculators") },
        { name: "Fuel Economy" },
    ]),
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Fuel Economy Calculators", url: canonicalUrl("/automotive-calculators/fuel-economy") },
]);

export default function FuelEconomyPage() {
    const calcs = getCalculatorsByCategory("fuel");
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-fuel-cat" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive", href: "/automotive-calculators" }, { label: "Fuel Economy" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Fuel Economy Calculators</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Calculate gas mileage (MPG), estimate fuel costs for any trip, compare annual fuel expenses between vehicles, find your true cost per mile, convert between MPG and L/100km, size fuel injectors, and project savings from improving your fuel efficiency. All with instant results and metric equivalents.
            </p>
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Fuel Economy Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/fuel-economy/${calc.slug}`} className="calc-index-card">
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3><p>{calc.description}</p>
                                <span className="calc-index-card__stars">{"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <DynamicExplanation heading="Understanding Fuel Economy"
                paragraphs={[
                    "Fuel economy measures how far a vehicle can travel per unit of fuel. In the US, it's expressed as miles per gallon (MPG) — higher is better. In most of the world, it's expressed as liters per 100 kilometers (L/100km) — lower is better. These are inverse measures: 25 MPG = 9.4 L/100km.",
                    "Your actual fuel economy depends on driving habits, terrain, weather, tire pressure, vehicle maintenance, and load. EPA-rated MPG is a standardized test result — real-world fuel economy is typically 10–20% lower. City driving burns 20–30% more fuel than highway due to frequent acceleration and idling. Properly inflated tires alone can improve MPG by 3%.",
                ]}
                highlight="The average American drives 13,500 miles/year spending $1,700–$2,500 on fuel. Use the Fuel Savings Calculator to see how much switching to a more efficient vehicle could save you."
            />
            <FAQAccordion title="Fuel Economy FAQ" items={[
                { question: "What is good gas mileage?", answer: "For 2026 vehicles: 30+ MPG is good for sedans, 25+ MPG for SUVs, and 20+ MPG for trucks. Hybrids typically achieve 45–55 MPG. The national fleet average is about 25.7 MPG. If you're shopping, compare the EPA ratings at fueleconomy.gov." },
                { question: "How do I calculate my actual MPG?", answer: "Fill your tank completely. Reset your trip odometer (or note the mileage). Drive normally until you need fuel. Fill up again and note how many gallons it took. Divide miles driven by gallons used. For best accuracy, do this over at least 2–3 fill-ups." },
                { question: "What is L/100km and how does it compare to MPG?", answer: "L/100km measures how many liters of fuel are consumed per 100 kilometers. It's the global standard outside the US. Lower numbers = better efficiency. To convert: L/100km = 235.215 ÷ MPG. So 25 MPG = 9.4 L/100km, and 5 L/100km = 47 MPG." },
            ]} />
            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["fuel"]} />
            </section>
        </main>
    );
}

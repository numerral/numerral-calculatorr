// Density Calculators Category Page — /density-calculators/
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
    title: "Density Calculators — Density, Metal Weight, Water Weight & More",
    description:
        "Free density calculators for mass, volume, and density conversions. Calculate metal weight by shape, water weight by volume, snow load, and more.",
    alternates: { canonical: canonicalUrl("/density-calculators") },
};

const FAQ_ITEMS = [
                { question: "What is the formula for density?", answer: "Density = Mass / Volume (ρ = m/V). In SI units: kg/m³. In US units: lb/ft³ or lb/gal. 1 kg/m³ = 0.0624 lb/ft³." },
                { question: "How heavy is a gallon of water?", answer: "1 US gallon of water weighs 8.34 pounds (3.785 kg). This is at standard temperature. Hot water is slightly lighter due to thermal expansion." },
                { question: "Why does ice float?", answer: "Ice has a density of 917 kg/m³ — less than liquid water (1,000 kg/m³). Water is one of the few substances that expands when freezing, thanks to hydrogen bonding creating an open crystal structure." },
            ];

const schemaData = JSON.stringify([
    breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Density Calculators" }]),
    { "@context": "https://schema.org", "@type": "CollectionPage", name: "Density Calculators", description: "Free density calculators for mass, volume, density, metal weight, and water weight.", url: canonicalUrl("/density-calculators") },
    faqSchema(FAQ_ITEMS)]);


export default function DensityCalculatorsPage() {
    const calcs = getCalculatorsByCategory("density");
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-density-category" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Density Calculators" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Density Calculators — Mass, Volume & Weight Tools</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                Free density calculators for computing mass, volume, and density using ρ = m/V.
                Calculate metal weight by shape and alloy, water weight by volume, snow load for roofs,
                snow water equivalent for hydrology, and even how many ping pong balls fit in a pool.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="density" />
            </div>
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Density Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/density-calculators/${calc.slug}`} className="calc-index-card">
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body"><h3>{calc.title}</h3><p>{calc.description}</p>
                                <span className="calc-index-card__stars">{"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}</span></div>
                        </Link>
                    ))}
                </div>
            </section>
            <DynamicExplanation heading="Understanding Density" paragraphs={[
                "Density (ρ) is the mass per unit volume of a substance: ρ = m/V. It determines whether an object floats or sinks, how heavy a metal piece is, and how much a snowfall weighs on your roof.",
                "Water at 4°C has a density of exactly 1,000 kg/m³ (8.34 lb/gal). This is the reference standard. Materials denser than water sink; those less dense float. Steel (7,850 kg/m³) sinks, while oak wood (750 kg/m³) floats.",
            ]} highlight="Water = 1,000 kg/m³ (8.34 lb/gal). Steel = 7,850 kg/m³. Gold = 19,300 kg/m³." />
            <FAQAccordion title="Density Calculator FAQ" items={FAQ_ITEMS} />
            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["density"]} />
            </section>
        </main>
    );
}

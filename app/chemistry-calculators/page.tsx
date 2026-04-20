// Chemistry Calculators Category Page — /chemistry-calculators/
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
    title: "Chemistry Calculators — Moles, Molarity, pH, PPM & More",
    description:
        "Free chemistry calculators for mole conversions, molarity, pH, PPM, percent yield, half-life, and stoichiometry. Solve chemistry problems with step-by-step formulas and reference tables.",
    alternates: { canonical: canonicalUrl("/chemistry-calculators") },
};

const FAQ_ITEMS = [
                { question: "What is a mole?", answer: "A mole is Avogadro's number (6.022 × 10²³) of particles. 1 mole of water (H₂O) weighs 18.015 grams and contains 6.022 × 10²³ molecules. It connects atomic mass units to grams." },
                { question: "What is the difference between molarity and molality?", answer: "Molarity (M) = moles of solute / liters of solution. Molality (m) = moles of solute / kilograms of solvent. Molality is temperature-independent since mass doesn't change with temperature, while volume (and therefore molarity) does." },
                { question: "What does PPM mean?", answer: "Parts per million (PPM) means 1 part in 1,000,000 parts. In water chemistry, 1 ppm ≈ 1 mg/L. The EPA drinking water standard for lead is 15 ppb (0.015 ppm)." },
                { question: "How does the pH scale work?", answer: "pH measures acidity on a 0-14 scale: 7 is neutral, below 7 is acidic, above 7 is basic/alkaline. Each unit represents a 10× change in [H⁺]. Lemon juice (pH 2) is 100,000× more acidic than water (pH 7)." },
            ];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Chemistry Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Chemistry Calculators",
        description: "Free chemistry calculators for moles, molarity, pH, PPM, and more.",
        url: canonicalUrl("/chemistry-calculators"),
    },
,
    faqSchema(FAQ_ITEMS)]);

export default function ChemistryCalculatorsPage() {
    const calcs = getCalculatorsByCategory("chemistry");
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-chemistry-category" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Chemistry Calculators" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Chemistry Calculators — Moles, Molarity, pH & More</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                Free chemistry calculators covering mole conversions (grams, atoms, liters), molarity and molality,
                pH calculations, parts-per-million (PPM) converters, percent yield, theoretical yield, half-life
                decay, and stoichiometry — all with step-by-step formulas and reference tables.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="chemistry" />
            </div>
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Chemistry Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/chemistry-calculators/${calc.slug}`} className="calc-index-card">
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <span className="calc-index-card__stars">{"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <DynamicExplanation
                heading="Understanding Chemistry Calculations"
                paragraphs={[
                    "Chemistry calculations form the bridge between the macroscopic world we observe and the atomic-scale world of molecules and reactions. The mole — Avogadro's number (6.022 × 10²³) — is the central concept, connecting grams to atoms.",
                    "These calculators cover the most commonly used chemistry formulas: mole conversions (n = m/M), molarity (M = n/V), pH (pH = -log[H⁺]), stoichiometry, concentration (PPM, PPB), and reaction yield. All use IUPAC-standard definitions and NIST reference values.",
                ]}
                highlight="Start with the Mole Calculator for basic conversions, pH Calculator for acid-base chemistry, or PPM Calculator for environmental/water quality work."
            />
            <FAQAccordion title="Chemistry Calculator FAQ" items={FAQ_ITEMS} />
            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["chemistry"]} />
            </section>
        </main>
    );
}

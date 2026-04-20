// Physics Calculators Category Page — /physics-calculators/
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
    title: "Physics Calculators — Force, Energy, Velocity, Acceleration & More",
    description:
        "Free physics calculators for force, kinetic energy, momentum, velocity, acceleration, gravitational PE, friction, wavelength, and more. Solve physics problems with step-by-step formulas and reference tables.",
    alternates: { canonical: canonicalUrl("/physics-calculators") },
};

const FAQ_ITEMS = [
    { question: "What is Newton's Second Law?", answer: "Newton's Second Law states that Force = Mass × Acceleration (F = ma). It means the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. A 10 kg object with 50 N of force applied accelerates at 5 m/s²." },
    { question: "What is the difference between speed and velocity?", answer: "Speed is a scalar (magnitude only) — how fast something moves. Velocity is a vector (magnitude + direction) — how fast and in what direction. A car going 60 mph north has a velocity; 60 mph is its speed. Average velocity uses displacement (straight-line distance), while average speed uses total distance traveled." },
    { question: "What is the difference between kinetic and potential energy?", answer: "Kinetic energy (KE = ½mv²) is the energy of motion — a moving car has KE. Potential energy is stored energy due to position — a ball at height h has gravitational PE = mgh. Energy is conserved: as an object falls, PE converts to KE." },
    { question: "What is terminal velocity?", answer: "Terminal velocity is the maximum speed reached by a falling object when air resistance equals gravitational force (net force = 0, acceleration = 0). For a skydiver belly-to-earth, it’s about 55 m/s (120 mph); head-down is ~90 m/s (200 mph)." },
    { question: "What units are used in physics calculations?", answer: "The SI (metric) system is standard: meters (m), kilograms (kg), seconds (s), newtons (N), joules (J), and watts (W). Our calculators also show imperial equivalents (feet, pounds, mph, BTU) for practical US applications." },
];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Physics Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Physics Calculators",
        description: "Free physics calculators for force, energy, velocity, acceleration, momentum, and more.",
        url: canonicalUrl("/physics-calculators"),
    },
    faqSchema(FAQ_ITEMS),
]);


export default function PhysicsCalculatorsPage() {
    const calcs = getCalculatorsByCategory("physics");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-physics-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Physics Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Physics Calculators — Force, Energy, Velocity & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                Free physics calculators covering mechanics, kinematics, dynamics, energy, and waves.
                Solve problems involving force (Newton&apos;s Laws), kinetic and potential energy, momentum,
                acceleration, velocity, friction, gravitational force, specific heat, and wavelength &mdash;
                all with step-by-step formulas and reference tables.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="physics" />
            </div>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Physics Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/physics-calculators/${calc.slug}`}
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
                heading="Understanding Physics Calculations"
                paragraphs={[
                    "Physics is the fundamental science of matter, energy, and their interactions. These calculators cover the most commonly used physics formulas — from Newton's Laws of Motion (F = ma) to energy conservation (KE = ½mv²), wave mechanics (λ = v/f), and gravitational physics.",
                    "All calculations use SI units (meters, kilograms, seconds, newtons, joules) as the base, with automatic conversions to imperial units (feet, pounds, mph, BTU) for practical US applications. Constants like g = 9.80665 m/s² and G = 6.674×10⁻¹¹ N⋅m²/kg² follow NIST standard reference values.",
                ]}
                highlight="Start with Force (F = ma) and Kinetic Energy (KE = ½mv²) — the two most widely used physics formulas in education and engineering."
            />

            <FAQAccordion
                title="Physics Calculator FAQ"
                items={FAQ_ITEMS}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["physics"]} />
            </section>
        </main>
    );
}

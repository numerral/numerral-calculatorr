// Electrical Calculators Category Page — /electrical-calculators/
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
    title: "Electrical Calculators — Amps, Watts, Volts, kVA & Power Conversions",
    description:
        "Free electrical conversion calculators: amps to watts, watts to amps, volts to watts, kVA to amps, watts to kWh, and more. Supports DC, single-phase AC, and three-phase AC circuits. Built for US standard voltages (120V/240V).",
    alternates: { canonical: canonicalUrl("/electrical-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Electrical Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Electrical Calculators",
        description: "Free electrical conversion calculators for amps, watts, volts, kVA, and kWh conversions.",
        url: canonicalUrl("/electrical-calculators"),
    },
]);

export default function ElectricalCalculatorsPage() {
    const calcs = getCalculatorsByCategory("electrical");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-electrical-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Electrical Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Electrical Calculators — Amps, Watts, Volts & Power Conversions
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Free electrical conversion calculators for US standard circuits. Convert between amps, watts, volts,
                kilovolt-amps (kVA), and kilowatt-hours (kWh). Every calculator supports DC, single-phase AC, and
                three-phase AC circuits with power factor adjustment.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Electrical Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/electrical-calculators/${calc.slug}`}
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
                heading="Understanding Electrical Conversions"
                paragraphs={[
                    "Electrical conversions are fundamental to anyone working with circuits — from homeowners planning electrical work to licensed electricians, engineers, and HVAC technicians. In the United States, most residential circuits operate at 120 volts (standard outlets) or 240 volts (large appliances like dryers, ovens, and AC units), while commercial and industrial facilities use 208V, 277V, and 480V systems.",
                    "Our calculators use Watt's Law (P = I × V) and Ohm's Law (V = I × R) — the two foundational electrical formulas. For AC circuits, we include the power factor (PF), which accounts for the phase difference between voltage and current in inductive or capacitive loads. Three-phase calculations use the √3 (1.732) multiplier for line-to-line voltage conversions.",
                ]}
                highlight="Start with Amps to Watts or Watts to Amps — the two most commonly searched electrical conversions. For generator and transformer sizing, use the kVA to Amps calculator."
            />

            <FAQAccordion
                title="Electrical Calculator FAQ"
                items={[
                    {
                        question: "What voltage do US homes use?",
                        answer: "US residential electrical systems use a split-phase 240V service. Standard outlets provide 120V (for lights, electronics, small appliances), while dedicated circuits for large appliances (dryers, ovens, water heaters, central AC) use 240V. Commercial buildings often use 208V or 277V three-phase systems.",
                    },
                    {
                        question: "What is power factor and when does it matter?",
                        answer: "Power factor (PF) is the ratio of real power (watts) to apparent power (volt-amps) in an AC circuit. It ranges from 0 to 1. A PF of 1 means all power is doing useful work (purely resistive loads like heaters). Motors, compressors, and fluorescent lighting have PF values of 0.6–0.9. For DC circuits, power factor doesn't apply.",
                    },
                    {
                        question: "What is the difference between watts and kVA?",
                        answer: "Watts measure real (active) power — the actual energy consumed. kVA (kilovolt-amps) measures apparent power, which includes both real power and reactive power. In a purely resistive load (PF = 1), watts equal VA. In circuits with motors or capacitors, kVA is always higher than kW because of the reactive component.",
                    },
                    {
                        question: "How do I know what size circuit breaker I need?",
                        answer: "Divide your total wattage by voltage to get amps, then select a breaker rated at 125% of that value (NEC 80% rule). For example, a 1,800W load on a 120V circuit draws 15A, so you'd need at least a 20A breaker. Always follow NEC (National Electrical Code) requirements and consult a licensed electrician.",
                    },
                    {
                        question: "What is the difference between single-phase and three-phase power?",
                        answer: "Single-phase power uses two wires (one hot, one neutral) and is standard in US homes at 120V/240V. Three-phase power uses three hot wires and delivers more power more efficiently — it's used in commercial and industrial settings. Three-phase calculations include the √3 (1.732) factor for line-to-line voltage.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["electrical"]} />
            </section>
        </main>
    );
}

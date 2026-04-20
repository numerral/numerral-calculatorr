// Automotive Calculators — Parent Hub — /automotive-calculators/
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
    title: "Automotive Calculators — Engine, Fuel, Tires, EV & Loan Tools",
    description:
        "Free automotive calculators: horsepower, torque, displacement, gas mileage, fuel cost, tire size comparison, speedometer error, vehicle loans, EV charging & more. 55+ tools with instant results.",
    alternates: { canonical: canonicalUrl("/automotive-calculators") },
};

const FAQ_ITEMS = [
                    { question: "Are these calculators accurate for my specific vehicle?", answer: "Yes — all calculators use vehicle-agnostic engineering formulas. You input your specific vehicle's data (horsepower, weight, tire size, MPG, etc.) and get results tailored to your car, truck, or motorcycle. Presets for popular configurations are provided where applicable." },
                    { question: "Do these work for both US and metric units?", answer: "Every calculator defaults to US units (HP, lb-ft, MPG, inches) and automatically displays metric equivalents (kW, Nm, L/100km, mm) inline below the primary result. No need to toggle or convert manually." },
                    { question: "How do I find my vehicle's horsepower and torque specs?", answer: "Check your owner's manual, the manufacturer's website, or look up your vehicle on sites like Edmund's or Car and Driver. For modified engines, a dyno test gives the most accurate numbers — use our Dyno Correction Factor Calculator to normalize results." },
                    { question: "What tire size is safe to upsize to?", answer: "The general rule is to stay within 3% of the OEM tire diameter to avoid speedometer errors, ABS/traction control issues, and rubbing. Use our Tire Size Comparison Calculator to check the exact diameter difference and our Speedometer Error Calculator to see the impact." },
                    { question: "Can I use these calculators for motorcycles and trucks?", answer: "Absolutely. The engine, fuel, and tire formulas are universal. For vehicle loans, we have dedicated Motorcycle Loan and RV Loan calculators. The tire tools support any P-metric, LT-metric, or flotation tire size." },
                ];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Automotive Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Automotive Calculators",
        description: "Comprehensive automotive calculator suite covering engine performance, fuel economy, wheels & tires, EV charging, and vehicle loan financing.",
        url: canonicalUrl("/automotive-calculators"),
    },
,
    faqSchema(FAQ_ITEMS)]);

/* ── Subcategory groups ── */
const SUBCATEGORIES = [
    {
        icon: "🔧", name: "Engine & Performance", count: 10,
        href: "/automotive-calculators/engine-performance", categoryKey: "engine" as const,
        desc: "Horsepower, torque, displacement, compression ratio, carburetor CFM, quarter mile, gear ratio & more.",
    },
    {
        icon: "⛽", name: "Fuel Economy", count: 9,
        href: "/automotive-calculators/fuel-economy", categoryKey: "fuel" as const,
        desc: "Gas mileage (MPG), fuel cost, fuel savings, cost per mile, MPG ↔ L/100km converter & more.",
    },
    {
        icon: "🛞", name: "Wheels & Tires", count: 8,
        href: "/automotive-calculators/wheels-tires", categoryKey: "wheels" as const,
        desc: "Tire size calculator, tire comparison, speedometer error, wheel offset, bolt pattern & more.",
    },
    {
        icon: "🔋", name: "EV Calculators", count: 22,
        href: "/ev-calculators", categoryKey: "ev" as const,
        desc: "EV vs gas comparison, charging cost & time, range estimator, tax credit eligibility, battery degradation & more.",
    },
    {
        icon: "🚗", name: "Vehicle Loan Calculators", count: 7,
        href: "/vehicle-loan-calculators", categoryKey: "vehicle" as const,
        desc: "Auto loan, car lease, lease vs buy, motorcycle, boat, RV, and ATV loan payment calculators.",
    },
];

export default function AutomotiveCalculatorsPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-auto-category" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Automotive Calculators" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Automotive Calculators — Engine, Fuel, Tires, EV & Loan Tools
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                55+ free automotive calculators covering engine performance, fuel economy, wheels & tires, electric vehicles, and vehicle financing. From estimating horsepower and quarter-mile times to comparing tire sizes and calculating loan payments — instant, accurate results for every automotive need.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="automotive" />
            </div>

            {/* ── Subcategory Cards ── */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Calculator Categories</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--s-4)" }}>
                    {SUBCATEGORIES.map(sub => (
                        <Link key={sub.name} href={sub.href} className="calc-index-card" style={{ display: "flex", gap: "var(--s-3)", padding: "var(--s-4)" }}>
                            <span style={{ fontSize: "2rem", lineHeight: 1 }}>{sub.icon}</span>
                            <div>
                                <h3 style={{ marginBottom: "4px" }}>{sub.name} <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>({sub.count})</span></h3>
                                <p style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: 1.5 }}>{sub.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Quick Access: Engine & Performance ── */}
            <section style={{ marginBottom: "var(--s-10)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>🔧 Engine & Performance Calculators</h2>
                <div className="calc-index-grid">
                    {getCalculatorsByCategory("engine").map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/engine-performance/${calc.slug}`} className="calc-index-card">
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

            {/* ── Quick Access: Fuel Economy ── */}
            <section style={{ marginBottom: "var(--s-10)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>⛽ Fuel Economy Calculators</h2>
                <div className="calc-index-grid">
                    {getCalculatorsByCategory("fuel").map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/fuel-economy/${calc.slug}`} className="calc-index-card">
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

            {/* ── Quick Access: Wheels & Tires ── */}
            <section style={{ marginBottom: "var(--s-10)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>🛞 Wheels & Tires Calculators</h2>
                <div className="calc-index-grid">
                    {getCalculatorsByCategory("wheels").map((calc: CalculatorDef) => (
                        <Link key={calc.id} href={`/automotive-calculators/wheels-tires/${calc.slug}`} className="calc-index-card">
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
                heading="Why Use Our Automotive Calculators?"
                paragraphs={[
                    "Whether you're building a high-performance engine, shopping for the right tires, planning a road trip on a budget, or financing your next vehicle — these automotive calculators give you the precise numbers you need. Every tool provides instant results with both US and metric units displayed inline, so you never have to convert manually.",
                    "Our engine calculators use industry-standard formulas (SAE J1349, Roger Huntington's ¼-mile method) and include preset data for popular engines. Fuel economy tools compare costs across vehicles and project multi-year savings. Tire calculators decode P-metric notation, flag speedometer errors, and verify fitment safety — all in real time as you type.",
                ]}
                highlight="Start with the Engine Horsepower Calculator if you're building or tuning, the Gas Mileage Calculator if you're tracking fuel efficiency, or the Tire Size Comparison Calculator if you're upgrading wheels."
            />

            <FAQAccordion
                title="Automotive Calculator FAQ"
                items={FAQ_ITEMS}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["engine", "fuel", "wheels"]} />
            </section>
        </main>
    );
}

// EV Calculators Category Page — /ev-calculators/
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
    title: "EV Calculators — Charging Cost, Range, Savings & More",
    description:
        "Free electric vehicle calculators: EV vs gas cost comparison, charging cost, range estimator, tax credit eligibility, total cost of ownership, battery degradation, and more. Instant, accurate results.",
    alternates: { canonical: canonicalUrl("/ev-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "EV Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "EV Calculators",
        description: "Free electric vehicle calculators for charging cost, range estimation, fuel savings, tax credits, battery health, and total cost of ownership.",
        url: canonicalUrl("/ev-calculators"),
    },
]);

export default function EVCalculatorsPage() {
    const calcs = getCalculatorsByCategory("ev");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ev-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "EV Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                EV Calculators — Charging Cost, Range, Savings & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Free electric vehicle calculators — compare EV vs gas costs, estimate charging time and cost,
                check federal tax credit eligibility, calculate range under real-world conditions, plan road trips,
                and analyze total cost of ownership. Instant, accurate results for every EV decision.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All EV Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/ev-calculators/${calc.slug}`}
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
                heading="Why Use EV Calculators?"
                paragraphs={[
                    "Switching to an electric vehicle is one of the biggest financial decisions you can make. Our EV calculators help you analyze every angle — from upfront costs and tax credits to long-term fuel savings, battery health, and resale value. Each calculator uses real-world data and industry-standard assumptions to give you accurate, actionable results.",
                    "Whether you're comparing an EV to your current gas car, sizing a home charger, planning a cross-country road trip, or estimating how many solar panels you need to charge for free, these tools give you the numbers you need to make a confident decision. All calculations use US units, electricity rates, and federal tax credit rules.",
                ]}
                highlight="Pro tip: Start with the EV vs Gas Cost Comparison to see your potential annual savings, then use the Tax Credit Calculator to check your eligibility for up to $7,500 off the purchase price."
            />

            <FAQAccordion
                title="EV Calculator FAQ"
                items={[
                    {
                        question: "How accurate are these EV calculators?",
                        answer: "Our calculators use real-world averages and industry data. Electricity rates default to the US national average ($0.14/kWh), gas prices to $3.50/gallon, and EV efficiency to 3.5 mi/kWh (the average for modern EVs). You can adjust all inputs to match your exact situation for precise results.",
                    },
                    {
                        question: "What electricity rate should I use?",
                        answer: "Check your utility bill for your per-kWh rate. The US national average is about $0.14/kWh, but rates vary widely — from $0.08/kWh in states like Louisiana to $0.30+/kWh in Hawaii and California. If you charge during off-peak hours, your rate may be even lower.",
                    },
                    {
                        question: "Are these calculators specific to a particular EV model?",
                        answer: "No — all calculators are model-agnostic. You input your specific vehicle's battery size (kWh), efficiency (mi/kWh), and other specs. This makes them work for any EV from a Nissan Leaf to a Tesla Model S to a Rivian R1T.",
                    },
                    {
                        question: "How do I find my EV's efficiency in mi/kWh?",
                        answer: "Check your vehicle's infotainment system for lifetime efficiency, or use the EPA rating. Common values: Tesla Model 3 = 4.0 mi/kWh, Chevy Bolt = 3.9, Ford Mustang Mach-E = 3.2, Rivian R1T = 2.5. Higher numbers mean better efficiency.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["ev"]} />
            </section>
        </main>
    );
}

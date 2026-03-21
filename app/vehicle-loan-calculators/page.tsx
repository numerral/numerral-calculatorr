// Vehicle Loan Calculators Category Page — /vehicle-loan-calculators/
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
    title: "Vehicle Loan Calculators — Auto, Boat, Motorcycle, RV & ATV Payment Tools",
    description:
        "Free vehicle loan calculators for US buyers: auto loan payment, car lease, lease vs. buy comparison, boat loan, motorcycle loan, RV loan, and ATV loan. Includes amortization schedules, trade-in values, and total cost breakdowns.",
    alternates: { canonical: canonicalUrl("/vehicle-loan-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Vehicle Loan Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Vehicle Loan Calculators",
        description: "Free US-focused vehicle loan calculators for auto, boat, motorcycle, RV, and ATV financing.",
        url: canonicalUrl("/vehicle-loan-calculators"),
    },
]);

export default function VehicleLoanCalculatorsPage() {
    const calcs = getCalculatorsByCategory("vehicle");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-vehicle-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Vehicle Loan Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Vehicle Loan Calculators — Auto, Boat, Motorcycle, RV & ATV
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Free calculators for US vehicle buyers — calculate monthly payments for car loans, auto leases,
                boat financing, motorcycle loans, RV loans, and ATV loans. Compare lease vs. buy, see amortization
                schedules, and find the true cost of vehicle ownership.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Vehicle Loan Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/vehicle-loan-calculators/${calc.slug}`}
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
                heading="Why Use Our Vehicle Loan Calculators?"
                paragraphs={[
                    "Americans owe more than $1.63 trillion in auto loans across 107 million active accounts. The average new car transaction price in the US is $48,528, and the average monthly new-car payment exceeds $730. Understanding the true cost of vehicle financing — including interest, taxes, depreciation, and insurance — is essential before signing any contract.",
                    "Our calculators use the standard amortizing loan payment formula (PMT) used by every US bank and credit union. You can model different down payments, trade-in values, sales tax rates, and loan terms to see exactly how each variable affects your monthly payment and total cost.",
                ]}
                highlight="Start with the Auto Loan Calculator for car purchases, the Car Lease Calculator for leasing, or the Lease vs. Buy Calculator to compare both options side by side."
            />

            <FAQAccordion
                title="Vehicle Loan Calculator FAQ"
                items={[
                    {
                        question: "What is a good interest rate for a car loan in 2025?",
                        answer: "As of 2025, good auto loan rates are 4.5%–6.5% for new cars with excellent credit (750+). Used car rates are typically 1–3% higher. Credit unions often offer the best rates — check local CUs alongside national banks.",
                    },
                    {
                        question: "How long should my auto loan be?",
                        answer: "Most financial experts recommend 48–60 month terms. Loans of 72–84 months lower your payment but dramatically increase total interest and the risk of being 'upside down' (owing more than the car is worth).",
                    },
                    {
                        question: "Is it better to lease or buy a car?",
                        answer: "It depends on your situation. Leasing offers lower monthly payments and a new car every 2–3 years, but you never build equity. Buying costs more monthly but you own the car after payoff. Use our Lease vs. Buy Calculator to compare your specific numbers.",
                    },
                    {
                        question: "How much should I put down on a car?",
                        answer: "Aim for at least 20% on a new car and 10% on a used car. Larger down payments reduce your monthly payment, total interest, and the risk of negative equity. Some lenders require a minimum 10% down.",
                    },
                    {
                        question: "Do these calculators work for all US states?",
                        answer: "Yes — the calculators let you input your state's sales tax rate. Five states (Alaska, Delaware, Montana, New Hampshire, Oregon) have no sales tax. Other states range from 2.9% (Colorado) to 7.25% (California).",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["vehicle"]} />
            </section>
        </main>
    );
}

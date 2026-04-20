// Pet Calculators Category Page — /pet-calculators/
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
    title: "Pet Calculators — Dog Age, Cat Age, Chocolate Toxicity & Nutrition",
    description:
        "Free pet calculators for dog owners and cat owners: dog age in human years, cat age in human years, chocolate toxicity checker, daily calorie calculator, and water intake guide. Science-backed results for responsible pet care.",
    alternates: { canonical: canonicalUrl("/pet-calculators") },
};

const FAQ_ITEMS = [
                    {
                        question: "How accurate are these pet calculators?",
                        answer: "Our calculators use established veterinary formulas (AVMA, AAHA, NRC) that are widely used by veterinarians. Results are estimates — individual pets vary based on breed, genetics, and health. For medical decisions, always consult your veterinarian.",
                    },
                    {
                        question: "Are these calculators designed for US pet owners?",
                        answer: "Yes. Weight inputs use pounds (lbs), food is measured in cups, and water in fluid ounces — standard US units. Emergency contacts reference the ASPCA poison control hotline, which serves the United States.",
                    },
                    {
                        question: "My dog got into chocolate — should I use the calculator or call the vet?",
                        answer: "Call your vet or ASPCA Poison Control (888-426-4435) immediately. Use the calculator to estimate the risk level while you're on the phone, but never delay seeking professional help. Time matters with chocolate toxicity.",
                    },
                    {
                        question: "Do these calculators work for all dog breeds?",
                        answer: "The dog age calculator accounts for breed size (small, medium, large, giant). The calorie and water calculators use weight-based formulas that apply to all breeds. Specific breed health concerns should be discussed with your veterinarian.",
                    },
                ];

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Pet Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Pet Calculators",
        description: "Free pet calculators for dog age, cat age, chocolate toxicity, calorie needs, and water intake.",
        url: canonicalUrl("/pet-calculators"),
    },
,
    faqSchema(FAQ_ITEMS)]);

export default function PetCalculatorsPage() {
    const calcs = getCalculatorsByCategory("pet");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-pet-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Pet Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Pet Calculators — Dog Age, Cat Age, Nutrition & Safety
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                Free calculators for dog owners and cat owners — check your pet&apos;s age in human years,
                calculate daily calorie and water needs, and assess chocolate toxicity risk.
                All tools use veterinary formulas and guidelines from the AVMA, AAHA, and ASPCA.
            </p>
            <div style={{ marginBottom: "var(--s-8)" }}>
                <AuthorBadge categoryKey="pet" />
            </div>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Pet Calculators</h2>
                <div className="calc-index-grid">
                    {calcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/pet-calculators/${calc.slug}`}
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
                heading="Why Use Pet Calculators?"
                paragraphs={[
                    "The United States has more than 65 million households with dogs and 47 million with cats — that's over 200 million pets according to the American Pet Products Association (APPA). Understanding your pet's health metrics helps you provide better care throughout their life.",
                    "Our calculators use established veterinary formulas: the AVMA method for dog aging, AAHA/AAFP guidelines for cat aging, NRC resting energy requirement (RER) for nutrition, and theobromine dose calculations for chocolate toxicity. All results are based on peer-reviewed veterinary science.",
                ]}
                highlight="Start with the Dog Age Calculator or Cat Age Calculator to understand your pet's life stage, then use the Calorie Calculator to dial in their nutrition."
            />

            <FAQAccordion
                title="Pet Calculator FAQ"
                items={FAQ_ITEMS}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["pet"]} />
            </section>
        </main>
    );
}

// Conversion Calculators Category Page — /convert/
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
    title: "Conversion Calculators — mL, Grams, Ounces & More",
    description:
        "Free unit conversion calculators: milliliters to grams, grams to milliliters, ounces, cups, and more. Instant, accurate volume-to-weight conversions for cooking, baking, and science.",
    alternates: { canonical: canonicalUrl("/convert") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Conversion Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Conversion Calculators",
        description: "All unit conversion calculators including volume, weight, temperature, and length converters.",
        url: canonicalUrl("/convert"),
    },
]);

export default function ConvertPage() {
    const converters = getCalculatorsByCategory("convert");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-convert-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Conversion Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Conversion Calculators — Volume, Weight & Unit Converters
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Instantly convert between milliliters, grams, ounces, cups, and more. 
                Select from 20+ common cooking and baking ingredients for accurate density-based conversions, 
                or enter a custom density for any substance.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Conversion Calculators</h2>
                <div className="calc-index-grid">
                    {converters.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/convert/${calc.slug}`}
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
                heading="Why Use Conversion Calculators?"
                paragraphs={[
                    "Volume and weight are different physical quantities — 1 mL of flour does NOT weigh 1 gram. Our conversion calculators use accurate ingredient densities to give you precise results. This matters most in baking, where small measurement errors can make or break a recipe.",
                    "Each converter includes 20 preset ingredient densities (from water and milk to flour, sugar, honey, and oils), plus a custom density option for any substance. You also get an instant reference table showing conversions for common amounts — no need to calculate each one separately.",
                ]}
                highlight="Did you know? 1 cup of flour weighs about 126g, but 1 cup of honey weighs 337g — nearly 3× more! This is why professional bakers always measure by weight, not volume."
            />

            <FAQAccordion
                title="Conversion Calculator FAQ"
                items={[
                    {
                        question: "Is 1 mL the same as 1 gram?",
                        answer: "Only for water. 1 mL of water weighs exactly 1 gram. But for any other substance, the weight depends on its density. For example, 1 mL of honey weighs 1.42 grams, while 1 mL of flour weighs only 0.53 grams.",
                    },
                    {
                        question: "How do I convert between volume and weight for cooking?",
                        answer: "Use the formula: grams = mL × density (for mL to grams) or mL = grams ÷ density (for grams to mL). Our calculators include 20 preset ingredient densities so you don't need to look them up.",
                    },
                    {
                        question: "Why are weight-based measurements more accurate?",
                        answer: "Volume measurements like cups and tablespoons are inconsistent — a cup of flour can vary by 20% depending on how it's scooped. Weight measurements in grams are exact every time, which is why professional recipes worldwide use them.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["convert"]} />
            </section>
        </main>
    );
}

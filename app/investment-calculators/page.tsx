// Investment Calculators Category Page — /investment-calculators/
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
    title: "Investment Calculators — SIP, FD, PPF & Mutual Fund Tools",
    description:
        "Plan your investments with free SIP, FD, RD, PPF, NPS, and mutual fund return calculators. Instant results, compare scenarios.",
    alternates: { canonical: canonicalUrl("/investment-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Investment Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Investment Calculators",
        description: "All investment calculators including SIP, FD, PPF, and mutual fund tools.",
        url: canonicalUrl("/investment-calculators"),
    },
]);

export default function InvestmentCalculatorsPage() {
    const investCalcs = getCalculatorsByCategory("invest");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-invest-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Investment Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Investment Calculators — SIP, FD, PPF & Mutual Fund Tools
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Grow your wealth smarter with our investment calculators. Whether you&apos;re
                investing via SIP, fixed deposits, or PPF — compare returns and plan ahead.
            </p>

            {/* Calculator index */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Investment Calculators</h2>
                <div className="calc-index-grid">
                    {investCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/investment-calculators/${calc.slug}`}
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
                heading="Understanding Investment Calculators"
                paragraphs={[
                    "Investment calculators help you estimate future returns based on your contribution, expected rate, and time horizon. Whether it's a monthly SIP, a fixed deposit, or a government-backed PPF — knowing your projected maturity helps you plan better.",
                    "The power of compounding means small differences in return rate or tenure can dramatically change your final corpus. Use our comparison tables to see the impact of even a 1-2% change.",
                ]}
                highlight="Pro tip: Always start investing early. A ₹5,000/month SIP at 12% for 20 years grows to ₹49.9 Lakhs — but starting just 5 years earlier turns it into ₹1.05 Crores."
            />

            <FAQAccordion
                title="Investment Calculator FAQ"
                items={[
                    {
                        question: "What is SIP and how does it work?",
                        answer: "SIP (Systematic Investment Plan) is a disciplined way to invest a fixed amount monthly in mutual funds. It averages your purchase price over time (rupee cost averaging) and benefits from compounding.",
                    },
                    {
                        question: "Is the FD calculator rate accurate?",
                        answer: "Our FD calculator uses quarterly compounding, which matches most Indian banks. Actual rates vary by bank — check your bank's current FD rates for exact numbers.",
                    },
                    {
                        question: "How much should I invest in PPF yearly?",
                        answer: "PPF allows a minimum of ₹500 and maximum of ₹1,50,000 per year. For maximum tax benefit under Section 80C, invest the full ₹1.5 Lakh annually.",
                    },
                    {
                        question: "Can I compare SIP vs lumpsum returns?",
                        answer: "Yes! Use our SIP Calculator for monthly investments and the Mutual Fund Returns Calculator for lumpsum. Compare both side by side to see which suits your cash flow.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["invest"]} />
            </section>
        </main>
    );
}

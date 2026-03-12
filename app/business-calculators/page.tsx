// Business Calculators Category Page — /business-calculators/
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
    title: "Business Calculators — Enterprise Value, WACC, ROI & Financial Ratios",
    description:
        "Free business & financial ratio calculators: Enterprise Value, EBITDA, EBIT, WACC, Cap Rate, ROI, ROAS, Beta, Net Worth & more. Instant results for valuation and analysis.",
    alternates: { canonical: canonicalUrl("/business-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Business Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Business Calculators",
        description: "All business & financial ratio calculators including Enterprise Value, WACC, ROI, and more.",
        url: canonicalUrl("/business-calculators"),
    },
]);

export default function BusinessCalculatorsPage() {
    const bizCalcs = getCalculatorsByCategory("business");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-business-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Business Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Business Calculators — Enterprise Value, WACC, ROI & Financial Ratios
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Analyze company valuation, profitability, returns, and financial health with our
                free business ratio calculators. Used by investors, analysts, founders, and MBA students worldwide.
            </p>

            {/* Calculator index */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Business Calculators</h2>
                <div className="calc-index-grid">
                    {bizCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/business-calculators/${calc.slug}`}
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
                heading="Understanding Business & Financial Ratios"
                paragraphs={[
                    "Financial ratios translate raw accounting numbers into actionable insights. Enterprise Value reveals what a company is truly worth to an acquirer. WACC sets the minimum return a company must earn to satisfy both debt holders and equity investors. ROI and ROAS measure the efficiency of capital deployed in investments and marketing campaigns.",
                    "Whether you are evaluating a startup for investment, running competitive analysis on publicly listed companies, or building a financial model for an MBA case study — these calculators give you instant, accurate results without spreadsheet formulas.",
                ]}
                highlight="Pro tip: Combine multiple ratios for deeper analysis. A company with a low EV/EBITDA multiple, strong current ratio (above 1.5×), and a WACC below its ROI is generating real economic value — a strong buy signal for value investors."
            />

            <FAQAccordion
                title="Business Calculator FAQ"
                items={[
                    {
                        question: "What is Enterprise Value and why is it better than Market Cap?",
                        answer: "Enterprise Value (EV) represents the total cost to acquire a business — it includes market capitalization plus debt, minus cash. Unlike market cap, EV accounts for a company's debt obligations, making it a more accurate measure of total business value for comparison and acquisition analysis.",
                    },
                    {
                        question: "What is a good WACC for a company?",
                        answer: "WACC varies by industry and risk profile. Typical ranges: mature companies 6–10%, growth companies 10–15%, startups 15–25%+. A company creates value when its return on invested capital (ROIC) exceeds its WACC — known as positive economic spread.",
                    },
                    {
                        question: "How should I interpret EBITDA vs EBIT?",
                        answer: "EBITDA adds back depreciation and amortization to show cash-flow-like operating performance — useful for comparing companies with different capital structures. EBIT is closer to true operating income and is better for companies where asset depreciation is a real economic cost.",
                    },
                    {
                        question: "What is a good ROAS for digital advertising?",
                        answer: "A ROAS of 4× (400%) is generally considered good — meaning $4 revenue for every $1 spent on ads. However, benchmarks vary by industry: e-commerce typically targets 4–10×, SaaS companies may accept 3–5× due to higher LTV, and brand awareness campaigns may have lower ROAS but higher long-term value.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["business"]} />
            </section>
        </main>
    );
}

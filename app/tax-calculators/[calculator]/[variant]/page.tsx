// Programmatic Variant Page — /tax-calculators/[calculator]/[variant]/
// Pre-renders all 51 tax variant pages with unique SEO content

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TaxCalculatorCore from "@/components/calculator/TaxCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import {
    getCalculatorsByCategory,
    getAllTaxPages,
    getTaxPageEntry,
    getTaxPagesByCalculator,
} from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

interface PageProps {
    params: Promise<{ calculator: string; variant: string }>;
}

// Pre-render all tax variant pages at build time
export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("tax");
    const taxPages = getAllTaxPages();

    return taxPages.map((p) => {
        const calc = calcs.find((c) => c.id === p.calculatorId);
        return {
            calculator: calc?.slug ?? p.calculatorId,
            variant: p.slug,
        };
    });
}

// Dynamic metadata from generated content
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator, variant } = await params;
    const calcs = getCalculatorsByCategory("tax");
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return {};

    const page = getTaxPageEntry(calc.id, variant);
    if (!page) return {};

    return {
        title: page.title,
        description: page.metaDescription,
        alternates: { canonical: canonicalUrl(`/tax-calculators/${calculator}/${variant}`) },
        robots: page.isIndexable ? "index, follow" : "noindex, nofollow",
    };
}

export default async function TaxVariantPage({ params }: PageProps) {
    const { calculator, variant } = await params;
    const calcs = getCalculatorsByCategory("tax");
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const page = getTaxPageEntry(calc.id, variant);
    if (!page) return notFound();

    // Get related pages for this calculator
    const relatedPages = getTaxPagesByCalculator(calc.id).filter(
        (p) => p.slug !== variant
    );

    const pageUrl = canonicalUrl(`/tax-calculators/${calculator}/${variant}`);

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Tax Calculators", url: canonicalUrl("/tax-calculators") },
            { name: calc.title, url: canonicalUrl(`/tax-calculators/${calculator}`) },
            { name: page.h1.split("—")[0].trim() },
        ]),
        webAppSchema(page.h1, pageUrl),
        faqSchema(page.faq),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-tax-variant"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Tax Calculators", href: "/tax-calculators" },
                    { label: calc.title.replace(" Calculator", ""), href: `/tax-calculators/${calculator}` },
                    { label: page.h1.split("—")[0].trim() },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{page.h1}</h1>
            <p
                className="t-body text-muted"
                style={{ marginBottom: "var(--s-6)" }}
                dangerouslySetInnerHTML={{ __html: page.subtitle }}
            />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <TaxCalculatorCore calcType={page.calcType} />

                    <DynamicExplanation
                        heading={page.explanation.heading}
                        paragraphs={page.explanation.paragraphs}
                        highlight={page.explanation.highlight}
                    />

                    {/* Related tax calculations */}
                    {relatedPages.length > 0 && (
                        <section style={{ marginTop: "var(--s-8)", marginBottom: "var(--s-6)" }}>
                            <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                                More {calc.title.replace(" Calculator", "")} Calculations
                            </h2>
                            <div className="calc-index-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                                {relatedPages.slice(0, 8).map((rp) => (
                                    <Link
                                        key={rp.slug}
                                        href={`/tax-calculators/${calculator}/${rp.slug}`}
                                        className="calc-index-card"
                                        style={{ padding: "var(--s-4)" }}
                                    >
                                        <div className="calc-index-card__body">
                                            <h3 style={{ fontSize: "var(--t-body-sm)" }}>
                                                {rp.h1.split("—")[0].trim()}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    <FAQAccordion
                        title={`${page.h1.split("—")[0].trim()} FAQ`}
                        items={page.faq}
                    />
                </div>

                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>
        </main>
    );
}

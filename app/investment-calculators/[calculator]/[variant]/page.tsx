// Programmatic Variant Page — /investment-calculators/[calculator]/[variant]/
// Pre-renders all 54 investment variant pages with unique content

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import InvestmentCalculatorCore from "@/components/calculator/InvestmentCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import RelatedCalculations from "@/components/calculator/RelatedCalculations";
import {
    getCalculatorsByCategory,
    getAllInvestPages,
    getInvestPageEntry,
} from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string; variant: string }>;
}

// Pre-render all investment variant pages at build time
export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("invest");
    const investPages = getAllInvestPages();

    return investPages.map((p) => {
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
    const calcs = getCalculatorsByCategory("invest");
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return {};

    const page = getInvestPageEntry(calc.id, variant);
    if (!page) return {};

    return {
        title: page.title,
        description: page.metaDescription,
        alternates: { canonical: canonicalUrl(`/investment-calculators/${calculator}/${variant}`) },
        robots: page.isIndexable ? "index, follow" : "noindex, nofollow",
    };
}

export default async function InvestmentVariantPage({ params }: PageProps) {
    const { calculator, variant } = await params;
    const calcs = getCalculatorsByCategory("invest");
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const page = getInvestPageEntry(calc.id, variant);
    if (!page) return notFound();

    const pageUrl = canonicalUrl(`/investment-calculators/${calculator}/${variant}`);

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Investment Calculators", url: canonicalUrl("/investment-calculators") },
            { name: calc.title, url: canonicalUrl(`/investment-calculators/${calculator}`) },
            { name: page.h1.split("—")[0].trim() },
        ]),
        webAppSchema(page.h1, pageUrl),
        faqSchema(page.faq),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-invest-variant"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Investment Calculators", href: "/investment-calculators" },
                    { label: calc.title.replace(" Calculator", ""), href: `/investment-calculators/${calculator}` },
                    { label: page.h1.split("—")[0].trim() },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{page.h1}</h1>
            <p
                className="t-body text-muted"
                style={{ marginBottom: "var(--s-6)" }}
                dangerouslySetInnerHTML={{ __html: page.subtitle }}
            />

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <InvestmentCalculatorCore
                        defaults={{
                            amount: page.amount,
                            rate: page.rate,
                            tenure: page.tenure,
                        }}
                        sliderRanges={calc.sliderRanges}
                        calcType={calc.calcType || "lumpsum"}
                        labels={
                            ["sip", "rd", "nps"].includes(calc.calcType || "")
                                ? { amountLabel: "Monthly Investment (₹)" }
                                : calc.calcType === "ppf"
                                    ? { amountLabel: "Yearly Investment (₹)" }
                                    : undefined
                        }
                    />

                    <DynamicExplanation
                        heading={page.explanation.heading}
                        paragraphs={page.explanation.paragraphs}
                        highlight={page.explanation.highlight}
                    />

                    <RelatedCalculations
                        calculatorId={calc.id}
                        baseUrl={`/investment-calculators/${calc.slug}`}
                        limit={8}
                        heading={`More ${calc.title.replace(" Calculator", "")} Calculations`}
                        linkSuffix=""
                    />

                    <FAQAccordion
                        title={`${page.h1.split("—")[0].trim()} FAQ`}
                        items={page.faq}
                    />
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}

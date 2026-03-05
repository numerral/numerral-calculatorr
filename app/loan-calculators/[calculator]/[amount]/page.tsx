// Programmatic Amount Page — /loan-calculators/[calculator]/[amount]/ (Server Component)
// Pre-renders all 56 amount pages with unique handwritten content

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import RelatedCalculations from "@/components/calculator/RelatedCalculations";
import { getAllCalculators, getAllPages, getCalculatorById } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string; amount: string }>;
}

// Pre-render all amount pages at build time
export async function generateStaticParams() {
    const pages = getAllPages();
    const calcs = getAllCalculators();

    return pages.map((p) => {
        const calc = calcs.find((c) => c.id === p.calculatorId);
        return {
            calculator: calc?.slug ?? p.calculatorId,
            amount: p.slug,
        };
    });
}

// Dynamic metadata from handwritten content
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator, amount } = await params;
    const calcs = getAllCalculators();
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return {};

    const pages = getAllPages();
    const page = pages.find((p) => p.calculatorId === calc.id && p.slug === amount);
    if (!page) return {};

    return {
        title: page.title,
        description: page.metaDescription,
        alternates: { canonical: canonicalUrl(`/loan-calculators/${calculator}/${amount}`) },
        robots: page.isIndexable ? "index, follow" : "noindex, nofollow",
    };
}

export default async function AmountPage({ params }: PageProps) {
    const { calculator, amount } = await params;
    const calcs = getAllCalculators();
    const calc = calcs.find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const pages = getAllPages();
    const page = pages.find((p) => p.calculatorId === calc.id && p.slug === amount);
    if (!page) return notFound();

    const pageUrl = canonicalUrl(`/loan-calculators/${calculator}/${amount}`);

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Loan Calculators", url: canonicalUrl("/loan-calculators") },
            { name: calc.title, url: canonicalUrl(`/loan-calculators/${calculator}`) },
            { name: page.h1.split("—")[0].trim() },
        ]),
        webAppSchema(page.h1, pageUrl),
        faqSchema(page.faq),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-amount"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Loan Calculators", href: "/loan-calculators" },
                    { label: calc.title.replace(" Calculator", ""), href: `/loan-calculators/${calculator}` },
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
                    <CalculatorCore
                        defaults={{
                            amount: page.amount,
                            rate: page.rate,
                            tenure: page.tenure,
                        }}
                        sliderRanges={calc.sliderRanges}
                        loanTypeId={calc.id}
                    />

                    <DynamicExplanation
                        heading={page.explanation.heading}
                        paragraphs={page.explanation.paragraphs}
                        highlight={page.explanation.highlight}
                    />

                    <RelatedCalculations
                        calculatorId={calc.id}
                        baseUrl={`/loan-calculators/${calc.slug}`}
                        limit={8}
                        heading={`More ${calc.title.replace(" Calculator", "")} Amounts`}
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

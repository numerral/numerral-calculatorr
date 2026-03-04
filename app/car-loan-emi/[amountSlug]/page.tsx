// Programmatic Page — /car-loan-emi/[amountSlug]/ (Server Component)
// Data sourced from: variants.json → lib/data.ts → lib/seo.ts (fillPageSeo)

import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import RelatedCalculations from "@/components/calculator/RelatedCalculations";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getPagesByCalculator, getPageEntry } from "@/lib/data";
import {
    canonicalUrl,
    fillPageSeo,
    breadcrumbSchema,
    webAppSchema,
    faqSchema,
} from "@/lib/seo";
import { amountToLabel } from "@/lib/slug";
import { SITE_URL } from "@/lib/constants";

const CALC_ID = "car-loan-emi";

// SSG — pre-render all car-loan-emi pages from pages_first_50.json
export function generateStaticParams() {
    return getPagesByCalculator(CALC_ID).map((p) => ({
        amountSlug: p.slug,
    }));
}

// Unique metadata per slug: title, description, robots, canonical
export async function generateMetadata({
    params,
}: {
    params: Promise<{ amountSlug: string }>;
}): Promise<Metadata> {
    const { amountSlug } = await params;
    const page = getPageEntry(CALC_ID, amountSlug);
    if (!page) return {};

    const seo = fillPageSeo(CALC_ID, page);
    if (!seo) return {};

    return {
        title: seo.title,
        description: seo.description,
        robots: seo.isIndexable ? "index, follow" : "noindex, follow",
        alternates: {
            canonical: seo.isIndexable ? seo.canonical : undefined,
        },
    };
}

export default async function ProgrammaticPage({
    params,
}: {
    params: Promise<{ amountSlug: string }>;
}) {
    const { amountSlug } = await params;
    const page = getPageEntry(CALC_ID, amountSlug);
    if (!page) notFound();

    const seo = fillPageSeo(CALC_ID, page);
    if (!seo) notFound();

    const label = amountToLabel(page.amount);
    const pageUrl = seo.canonical;

    // Combined JSON-LD: BreadcrumbList + WebApplication + FAQPage
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Loan Calculators", url: canonicalUrl("/loan-calculators") },
            {
                name: "Car Loan EMI",
                url: canonicalUrl("/loan-calculators/car-loan-emi-calculator"),
            },
            { name: label },
        ]),
        webAppSchema(`Car Loan EMI Calculator for ${label}`, pageUrl),
        faqSchema(seo.faq),
    ]);

    return (
        <main>
            <Script
                id="schema-programmatic"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Loan Calculators", href: "/loan-calculators" },
                    {
                        label: "Car Loan EMI",
                        href: "/loan-calculators/car-loan-emi-calculator",
                    },
                    { label },
                ]}
            />

            <h1>{seo.h1}</h1>
            <p>{seo.subtitle}</p>

            <div>
                {/* Main column */}
                <div>
                    <CalculatorCore
                        defaults={{
                            amount: page.amount,
                            rate: page.rate,
                            tenure: page.tenure,
                        }}
                    />

                    <RelatedCalculations
                        calculatorId={CALC_ID}
                        activeSlug={amountSlug}
                        heading="Related Car Loan EMI Calculations"
                    />

                    <DynamicExplanation
                        heading={seo.explanation.heading}
                        paragraphs={seo.explanation.paragraphs}
                        highlight={seo.explanation.highlight}
                    />

                    <FAQAccordion
                        title={`FAQ — ${label} Car Loan`}
                        items={seo.faq}
                    />
                </div>

                {/* Sidebar */}
                <aside>
                    <TrendingCalculations variant="sidebar" />
                    <div>
                        <h3>Compare Rates</h3>
                        <p>See car loan offers from 15+ banks and NBFCs.</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}

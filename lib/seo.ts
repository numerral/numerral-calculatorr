// SEO utilities — canonical URLs, template filling, JSON-LD helpers

import { SITE_URL } from "./constants";
import {
    fillTemplate,
    buildTemplateVars,
    getSeoTemplate,
    getFaqs,
    type PageEntry,
    type SeoTemplate,
} from "./data";
import { type FAQItem } from "./types";

// ---- Canonical URL ----

/**
 * Build a full canonical URL from a relative path.
 * Always includes trailing slash for consistency.
 *
 * @example canonicalUrl("/loan-calculators") → "https://numerral.com/loan-calculators/"
 */
export function canonicalUrl(path: string): string {
    const clean = path.replace(/\/+$/, "");
    return `${SITE_URL}${clean}/`;
}

// ---- Template-based SEO ----

export interface FilledSeo {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq: FAQItem[];
    canonical: string;
    isIndexable: boolean;
}

/**
 * Fill all SEO templates for a programmatic page entry.
 * Reads the SEO template for the calculator type, fills {{placeholders}}
 * with page-specific values, and merges generic + amount-specific FAQs.
 *
 * @example
 * const seo = fillPageSeo("car-loan-emi", pageEntry);
 * seo.title  → "₹5 Lakh Car Loan EMI Calculator | Numerral"
 * seo.faq    → [3 generic + 3 amount-specific, all filled]
 */
export function fillPageSeo(
    calculatorId: string,
    page: PageEntry
): FilledSeo | null {
    const template = getSeoTemplate(calculatorId);
    if (!template) return null;

    const vars = buildTemplateVars(page);
    const fill = (s: string) => fillTemplate(s, vars);

    const { generic, amountSpecific } = getFaqs(calculatorId, vars);

    // Build canonical URL for this specific page
    // Format: /car-loan-emi/5-lakh/
    const basePath = calculatorId; // "car-loan-emi"
    const canonical = canonicalUrl(`/${basePath}/${page.slug}`);

    return {
        title: fill(template.title),
        description: fill(template.description),
        h1: fill(template.h1),
        subtitle: fill(template.subtitle),
        explanation: {
            heading: fill(template.explanation_heading),
            paragraphs: template.explanation_paragraphs.map(fill),
            highlight: fill(template.explanation_highlight),
        },
        faq: [...generic, ...amountSpecific],
        canonical,
        isIndexable: page.isIndexable,
    };
}

// ---- JSON-LD Schema Helpers ----

/**
 * Build JSON-LD BreadcrumbList schema.
 */
export function breadcrumbSchema(
    items: { name: string; url?: string }[]
): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            ...(item.url ? { item: item.url } : {}),
        })),
    };
}

/**
 * Build JSON-LD FAQPage schema.
 */
export function faqSchema(
    items: { question: string; answer: string }[]
): object {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}

/**
 * Build JSON-LD WebApplication schema.
 */
export function webAppSchema(name: string, url: string): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    };
}

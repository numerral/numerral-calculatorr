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
 * No trailing slash — canonical matches the actual URL exactly.
 *
 * @example canonicalUrl("/loan-calculators") → "https://www.numerral.com/loan-calculators"
 */
export function canonicalUrl(path: string): string {
    const clean = path.replace(/\/+$/, "");
    return `${SITE_URL}${clean}`;
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
/**
 * applicationCategory follows schema.org vocabulary.
 * Finance → "FinanceApplication"
 * Health  → "HealthApplication"
 * Science/Physics/Math → "EducationalApplication"
 * General / Any → "WebApplication"
 */
export function webAppSchema(
    name: string,
    url: string,
    currency = "USD",
    applicationCategory = "WebApplication"
): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url,
        applicationCategory,
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: currency },
    };
}

/**
 * Build JSON-LD SoftwareApplication schema for construction tools.
 * Matches the competitor (CalculatorSoup) format validated by Google Rich Results.
 *
 * @param name        Calculator name
 * @param url         Full canonical URL of the page
 * @param description Descriptive sentence about what the calculator does
 * @param additionalTypes  Product ontology URLs (e.g. Square_foot, Area)
 */
export function constructionAppSchema(
    name: string,
    url: string,
    description: string,
    additionalTypes: string[] = []
): object {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        url,
        description,
        applicationCategory: "https://schema.org/WebApplication",
        operatingSystem: "Browser required with JavaScript support, Web platform, Windows, Mac OS X, Linux, iOS, Android",
        offers: { "@type": "Offer", price: "0" },
        ...(additionalTypes.length > 0 ? { additionalType: additionalTypes } : {}),
    };
}

/**
 * Build JSON-LD Organization schema for the site.
 */
export function organizationSchema(siteUrl: string): object {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Numerral",
        url: siteUrl,
        logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/logo.png`,
            width: 180,
            height: 60,
        },
        description: "Free online calculator platform — 500+ calculators for finance, health, math, physics, construction, and more.",
        foundingDate: "2023",
        sameAs: [
            "https://twitter.com/numerral",
            "https://www.linkedin.com/company/numerral",
        ],
    };
}

/**
 * Build JSON-LD WebSite schema with Sitelinks Searchbox potential.
 * Placing this in the root layout signals to Google that this is a
 * site-level entity, improving Knowledge Panel eligibility.
 */
export function webSiteSchema(siteUrl: string): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Numerral",
        url: siteUrl,
        description: "Free online calculator platform — 500+ calculators for finance, health, math, physics, construction, and more.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteUrl}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

/**
 * Build JSON-LD Person schema for author profile pages.
 * Provides Google with structured author credentialing data (E-E-A-T).
 */
export function personSchema(author: {
    name: string;
    title: string;
    bio: string;
    url: string;
    image: string;
    linkedin?: string;
    education?: string[];
}): object {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        jobTitle: author.title,
        description: author.bio,
        url: author.url,
        image: author.image,
        ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
        ...(author.education && author.education.length > 0
            ? {
                  alumniOf: author.education.map((edu) => ({
                      "@type": "EducationalOrganization",
                      name: edu,
                  })),
              }
            : {}),
        worksFor: {
            "@type": "Organization",
            name: "Numerral",
            url: "https://www.numerral.com",
        },
    };
}

/**
 * Build JSON-LD WebPage schema.
 */
export function webPageSchema(name: string, url: string, description: string): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name,
        url,
        description,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", name: "Numerral", url },
    };
}

/**
 * Build JSON-LD HowTo schema for step-by-step calculation guides.
 */
export function howToSchema(
    name: string,
    description: string,
    steps: { name: string; text: string }[]
): object {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name,
        description,
        step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
        })),
    };
}

/**
 * Build JSON-LD MathSolver schema.
 * Enables Google's MathSolver rich results for calculation-based queries.
 * Reference: https://developers.google.com/search/docs/appearance/structured-data/math-solvers
 */
export function mathSolverSchema(
    name: string,
    url: string,
    description: string,
    eduQuestionType: string = "Math"
): object {
    return {
        "@context": "https://schema.org",
        "@type": "MathSolver",
        name,
        url,
        description,
        potentialAction: {
            "@type": "SolveMathAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: url,
                actionAccessibilityRequirement: {
                    "@type": "ActionAccessSpecification",
                    availabilityStarts: "2024-01-01",
                    eligibleRegion: { "@type": "Country", name: "Worldwide" },
                },
            },
            eduQuestionType,
        },
    };
}

/**
 * Build JSON-LD Speakable schema for voice search optimisation.
 * Marks CSS selectors that Google Assistant / voice devices should read.
 */
export function speakableSchema(
    url: string,
    cssSelector: string[] = [".calc-result__emi", ".explanation__highlight", ".insight-box__text"]
): object {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url,
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector,
        },
    };
}

/**
 * Build an entity-rich WebApplication schema.
 * Adds `about` (entity URI), `teaches`, `audience` for semantic search engines.
 * Per Koray Tuğberk's methodology: entity-context signals improve topical authority.
 */
export function entityRichWebAppSchema(
    name: string,
    url: string,
    description: string,
    options: {
        applicationCategory?: string;
        currency?: string;
        aboutEntity?: { name: string; sameAs: string }; // Wikipedia URI
        teaches?: string;
        audienceType?: string;
        dateModified?: string; // ISO 8601 e.g. "2026-07-01"
        keywords?: string[];
    } = {}
): object {
    const {
        applicationCategory = "WebApplication",
        currency = "USD",
        aboutEntity,
        teaches,
        audienceType = "Everyone",
        dateModified,
        keywords = [],
    } = options;

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url,
        description,
        applicationCategory,
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: currency },
        ...(aboutEntity
            ? {
                  about: {
                      "@type": "Thing",
                      name: aboutEntity.name,
                      sameAs: aboutEntity.sameAs,
                  },
              }
            : {}),
        ...(teaches ? { teaches } : {}),
        ...(audienceType
            ? { audience: { "@type": "Audience", audienceType } }
            : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    };
}

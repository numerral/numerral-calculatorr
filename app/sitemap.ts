// app/sitemap.ts — generates sitemap.xml at build time
// Sources: static routes, all calculator hubs, all programmatic sub-pages

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
    getIndexablePages,
    getAllInvestPages,
    getAllTaxPages,
    getCalculatorsByCategory,
    getAllGuides,
    getAllGlossaryTerms,
} from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    // ─── Static / category pages ───
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
        { url: canonicalUrl("/loan-calculators"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: canonicalUrl("/investment-calculators"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: canonicalUrl("/tax-calculators"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: canonicalUrl("/utility-calculators"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: canonicalUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
        { url: canonicalUrl("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: canonicalUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: canonicalUrl("/cookie-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
        { url: canonicalUrl("/site-map"), lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    ];

    // ─── Loan calculator hubs ───
    const loanHubs: MetadataRoute.Sitemap = getCalculatorsByCategory("loan").map((c) => ({
        url: canonicalUrl(`/loan-calculators/${c.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
    }));

    // Legacy car-loan-emi-calculator route
    loanHubs.push({
        url: canonicalUrl("/loan-calculators/car-loan-emi-calculator"),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.85,
    });

    // ─── Investment calculator hubs ───
    const investHubs: MetadataRoute.Sitemap = getCalculatorsByCategory("invest").map((c) => ({
        url: canonicalUrl(`/investment-calculators/${c.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
    }));

    // ─── Tax calculator hubs ───
    const taxHubs: MetadataRoute.Sitemap = getCalculatorsByCategory("tax").map((c) => ({
        url: canonicalUrl(`/tax-calculators/${c.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
    }));

    // ─── Utility calculator hubs ───
    const utilityHubs: MetadataRoute.Sitemap = getCalculatorsByCategory("utility").map((c) => ({
        url: canonicalUrl(`/utility-calculators/${c.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
    }));

    // ─── Loan programmatic sub-pages ───
    const loanSubPages: MetadataRoute.Sitemap = getIndexablePages().map((p) => {
        const calc = getCalculatorsByCategory("loan").find((c) => c.id === p.calculatorId);
        return {
            url: canonicalUrl(`/loan-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        };
    });

    // ─── Investment programmatic sub-pages ───
    const investSubPages: MetadataRoute.Sitemap = getAllInvestPages()
        .filter((p) => p.isIndexable)
        .map((p) => {
            const calc = getCalculatorsByCategory("invest").find((c) => c.id === p.calculatorId);
            return {
                url: canonicalUrl(`/investment-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
                lastModified: now,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            };
        });

    // ─── Tax programmatic sub-pages ───
    const taxSubPages: MetadataRoute.Sitemap = getAllTaxPages()
        .filter((p) => p.isIndexable)
        .map((p) => {
            const calc = getCalculatorsByCategory("tax").find((c) => c.id === p.calculatorId);
            return {
                url: canonicalUrl(`/tax-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
                lastModified: now,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            };
        });

    // ─── Guide pages ───
    const guideHub: MetadataRoute.Sitemap = [
        { url: canonicalUrl("/guides"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const guidePages: MetadataRoute.Sitemap = getAllGuides().map((g) => ({
        url: canonicalUrl(`/guides/${g.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // ─── Glossary pages ───
    const glossaryHub: MetadataRoute.Sitemap = [
        { url: canonicalUrl("/glossary"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const glossaryPages: MetadataRoute.Sitemap = getAllGlossaryTerms().map((t) => ({
        url: canonicalUrl(`/glossary/${t.slug}`),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [
        ...staticPages,
        ...loanHubs,
        ...investHubs,
        ...taxHubs,
        ...utilityHubs,
        ...loanSubPages,
        ...investSubPages,
        ...taxSubPages,
        ...guideHub,
        ...guidePages,
        ...glossaryHub,
        ...glossaryPages,
    ];
}

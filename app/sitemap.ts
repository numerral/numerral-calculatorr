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
import { AR_CALCULATORS } from "@/data/ar-calculators";
import { ID_CALCULATORS } from "@/data/id-calculators";
import { TR_CALCULATORS } from "@/data/tr-calculators";
import { DE_CALCULATORS } from "@/data/de-calculators";

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

    // ─── Salary calculator hubs ───
    const salaryHubs: MetadataRoute.Sitemap = getCalculatorsByCategory("salary").map((c) => ({
        url: canonicalUrl(`/salary-calculators/${c.slug}`),
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

    // ─── Arabic calculator pages ───
    const arHub: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/ar`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const arPages: MetadataRoute.Sitemap = AR_CALCULATORS.map((c) => ({
        url: `${SITE_URL}/ar/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // ─── Indonesian calculator pages ───
    const idHub: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/id`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const idPages: MetadataRoute.Sitemap = ID_CALCULATORS.map((c) => ({
        url: `${SITE_URL}/id/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // ─── Turkish calculator pages ───
    const trHub: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/tr`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const trPages: MetadataRoute.Sitemap = TR_CALCULATORS.map((c) => ({
        url: `${SITE_URL}/tr/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // ─── German calculator pages ───
    const deHub: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/de`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ];
    const dePages: MetadataRoute.Sitemap = DE_CALCULATORS.map((c) => ({
        url: `${SITE_URL}/de/${c.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
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
        ...arHub,
        ...arPages,
        ...idHub,
        ...idPages,
        ...trHub,
        ...trPages,
        ...deHub,
        ...dePages,
    ];
}

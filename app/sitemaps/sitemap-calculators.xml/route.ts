// app/sitemaps/sitemap-calculators.xml/route.ts
// All calculator hub pages, programmatic sub-pages, and locale calculator pages

import { SITE_URL } from "@/lib/constants";
import {
    getIndexablePages,
    getAllInvestPages,
    getAllTaxPages,
    getCalculatorsByCategory,
} from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";
import { AR_CALCULATORS } from "@/data/ar-calculators";
import { ID_CALCULATORS } from "@/data/id-calculators";
import { TR_CALCULATORS } from "@/data/tr-calculators";
import { DE_CALCULATORS } from "@/data/de-calculators";
import { CH_CALCULATORS } from "@/data/ch-calculators";
import { KSA_PAGES, UAE_PAGES, IN_PAGES } from "@/lib/geo-seo";
import { generateStaticParams as getHeightParams } from "@/app/height-converter/[slug]/page";

export const dynamic = "force-static";

interface SitemapEntry {
    loc: string;
    lastmod: string;
}

function buildEntries(): SitemapEntry[] {
    const now = new Date().toISOString();
    const entries: SitemapEntry[] = [];

    // ─── Calculator hub pages (all categories) ───
    const categories = [
        { cat: "loan", slug: "loan-calculators" },
        { cat: "invest", slug: "investment-calculators" },
        { cat: "tax", slug: "tax-calculators" },
        { cat: "salary", slug: "salary-calculators" },
        { cat: "utility", slug: "utility-calculators" },
        { cat: "construction", slug: "construction-calculators" },
        { cat: "ev", slug: "ev-calculators" },
        { cat: "health", slug: "health-calculators" },
        { cat: "math", slug: "math-calculators" },
        { cat: "pet", slug: "pet-calculators" },
        { cat: "time", slug: "time-calculators" },
        { cat: "convert", slug: "convert" },
        { cat: "vehicle", slug: "vehicle-loan-calculators" },
        { cat: "physics", slug: "physics-calculators" },
        { cat: "chemistry", slug: "chemistry-calculators" },
        { cat: "density", slug: "density-calculators" },
        { cat: "electrical", slug: "electrical-calculators" },
        { cat: "business", slug: "business-calculators" },
        { cat: "cooking", slug: "cooking-calculators" },
    ];

    // Category hub index pages
    for (const { slug } of categories) {
        if (slug !== "convert") {
            entries.push({ loc: canonicalUrl(`/${slug}`), lastmod: now });
        }
    }

    for (const { cat, slug } of categories) {
        const calcs = getCalculatorsByCategory(cat);
        for (const c of calcs) {
            entries.push({ loc: canonicalUrl(`/${slug}/${c.slug}`), lastmod: now });
        }
    }

    // ─── Loan programmatic sub-pages ───
    const loanCalcs = getCalculatorsByCategory("loan");
    for (const p of getIndexablePages()) {
        const calc = loanCalcs.find((c) => c.id === p.calculatorId);
        entries.push({
            loc: canonicalUrl(`/loan-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
            lastmod: now,
        });
    }

    // ─── Investment programmatic sub-pages ───
    const investCalcs = getCalculatorsByCategory("invest");
    for (const p of getAllInvestPages().filter((p) => p.isIndexable)) {
        const calc = investCalcs.find((c) => c.id === p.calculatorId);
        entries.push({
            loc: canonicalUrl(`/investment-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
            lastmod: now,
        });
    }

    // ─── Tax programmatic sub-pages ───
    const taxCalcs = getCalculatorsByCategory("tax");
    for (const p of getAllTaxPages().filter((p) => p.isIndexable)) {
        const calc = taxCalcs.find((c) => c.id === p.calculatorId);
        entries.push({
            loc: canonicalUrl(`/tax-calculators/${calc?.slug ?? p.calculatorId}/${p.slug}`),
            lastmod: now,
        });
    }

    // ─── Automotive calculators (3-level URL structure) ───
    entries.push({ loc: canonicalUrl("/automotive-calculators"), lastmod: now });
    entries.push({ loc: canonicalUrl("/automotive-calculators/engine-performance"), lastmod: now });
    entries.push({ loc: canonicalUrl("/automotive-calculators/fuel-economy"), lastmod: now });
    entries.push({ loc: canonicalUrl("/automotive-calculators/wheels-tires"), lastmod: now });
    for (const c of getCalculatorsByCategory("engine")) {
        entries.push({ loc: canonicalUrl(`/automotive-calculators/engine-performance/${c.slug}`), lastmod: now });
    }
    for (const c of getCalculatorsByCategory("fuel")) {
        entries.push({ loc: canonicalUrl(`/automotive-calculators/fuel-economy/${c.slug}`), lastmod: now });
    }
    for (const c of getCalculatorsByCategory("wheels")) {
        entries.push({ loc: canonicalUrl(`/automotive-calculators/wheels-tires/${c.slug}`), lastmod: now });
    }

    // ─── Locale calculator pages ───
    for (const c of AR_CALCULATORS) {
        entries.push({ loc: `${SITE_URL}/ar/${c.id}`, lastmod: now });
    }
    for (const c of ID_CALCULATORS) {
        entries.push({ loc: `${SITE_URL}/id/${c.id}`, lastmod: now });
    }
    for (const c of TR_CALCULATORS) {
        entries.push({ loc: `${SITE_URL}/tr/${c.id}`, lastmod: now });
    }
    for (const c of DE_CALCULATORS) {
        entries.push({ loc: `${SITE_URL}/de/${c.id}`, lastmod: now });
    }
    for (const c of CH_CALCULATORS) {
        entries.push({ loc: `${SITE_URL}/ch/${c.id}`, lastmod: now });
    }

    // ─── Country-specific hub index pages ───
    entries.push({ loc: canonicalUrl("/ksa"), lastmod: now });
    entries.push({ loc: canonicalUrl("/uae"), lastmod: now });
    entries.push({ loc: canonicalUrl("/in"), lastmod: now });

    // ─── KSA calculator pages ───
    for (const slug of KSA_PAGES) {
        entries.push({ loc: canonicalUrl(`/ksa/${slug}`), lastmod: now });
    }

    // ─── UAE calculator pages ───
    for (const slug of UAE_PAGES) {
        entries.push({ loc: canonicalUrl(`/uae/${slug}`), lastmod: now });
    }

    // ─── India calculator pages ───
    for (const slug of IN_PAGES) {
        entries.push({ loc: canonicalUrl(`/in/${slug}`), lastmod: now });
    }

    // ─── KSA glossary and guides ───
    entries.push({ loc: canonicalUrl("/ksa/glossary"), lastmod: now });
    entries.push({ loc: canonicalUrl("/ksa/guides"), lastmod: now });

    // ─── Height Converter Programmatic URLs ───
    entries.push({ loc: canonicalUrl("/height-converter"), lastmod: now });
    const heightSlugs = getHeightParams();
    for (const h of heightSlugs) {
        entries.push({ loc: canonicalUrl(`/height-converter/${h.slug}`), lastmod: now });
    }

    // ─── Trust & E-E-A-T pages ───
    entries.push({ loc: canonicalUrl("/authors"), lastmod: now });
    entries.push({ loc: canonicalUrl("/editorial-policy"), lastmod: now });
    for (const author of ["priya-sharma", "arjun-mehta", "neha-kapoor", "rajiv-nair"]) {
        entries.push({ loc: canonicalUrl(`/authors/${author}`), lastmod: now });
    }

    return entries;
}

export async function GET() {
    const entries = buildEntries();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`).join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}

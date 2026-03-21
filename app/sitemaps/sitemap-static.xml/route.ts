// app/sitemaps/sitemap-static.xml/route.ts
// Homepage, category hubs, legal pages, authors, locale hub pages

import { SITE_URL } from "@/lib/constants";
import { canonicalUrl } from "@/lib/seo";
import { getAllAuthors } from "@/data/authors";

export const dynamic = "force-static";

export async function GET() {
    const now = new Date().toISOString();

    const entries = [
        // Homepage
        { loc: `${SITE_URL}/`, lastmod: now },

        // Category hub pages
        { loc: canonicalUrl("/loan-calculators"), lastmod: now },
        { loc: canonicalUrl("/investment-calculators"), lastmod: now },
        { loc: canonicalUrl("/tax-calculators"), lastmod: now },
        { loc: canonicalUrl("/salary-calculators"), lastmod: now },
        { loc: canonicalUrl("/utility-calculators"), lastmod: now },
        { loc: canonicalUrl("/construction-calculators"), lastmod: now },
        { loc: canonicalUrl("/ev-calculators"), lastmod: now },
        { loc: canonicalUrl("/health-calculators"), lastmod: now },
        { loc: canonicalUrl("/math-calculators"), lastmod: now },
        { loc: canonicalUrl("/pet-calculators"), lastmod: now },
        { loc: canonicalUrl("/time-calculators"), lastmod: now },
        { loc: canonicalUrl("/convert"), lastmod: now },

        // Resource pages
        { loc: canonicalUrl("/about"), lastmod: now },
        { loc: canonicalUrl("/site-map"), lastmod: now },
        { loc: canonicalUrl("/authors"), lastmod: now },
        { loc: canonicalUrl("/editorial-policy"), lastmod: now },

        // Legal pages
        { loc: canonicalUrl("/terms"), lastmod: now },
        { loc: canonicalUrl("/privacy"), lastmod: now },
        { loc: canonicalUrl("/cookie-policy"), lastmod: now },

        // Locale hub pages
        { loc: `${SITE_URL}/ar`, lastmod: now },
        { loc: `${SITE_URL}/id`, lastmod: now },
        { loc: `${SITE_URL}/tr`, lastmod: now },
        { loc: `${SITE_URL}/de`, lastmod: now },
        { loc: `${SITE_URL}/ch`, lastmod: now },

        // Author profile pages
        ...getAllAuthors().map((a) => ({
            loc: canonicalUrl(`/authors/${a.slug}`),
            lastmod: now,
        })),
    ];

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

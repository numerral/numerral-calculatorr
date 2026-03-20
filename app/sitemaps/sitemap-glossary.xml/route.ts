// app/sitemaps/sitemap-glossary.xml/route.ts
// Glossary hub + all individual glossary term pages

import { getAllGlossaryTerms } from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
    const now = new Date().toISOString();

    const entries = [
        { loc: canonicalUrl("/glossary"), lastmod: now },
        ...getAllGlossaryTerms().map((t) => ({
            loc: canonicalUrl(`/glossary/${t.slug}`),
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

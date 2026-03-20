// app/sitemaps/sitemap-guides.xml/route.ts
// Guide hub + all individual guide pages

import { getAllGuides } from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
    const now = new Date().toISOString();

    const entries = [
        { loc: canonicalUrl("/guides"), lastmod: now },
        ...getAllGuides().map((g) => ({
            loc: canonicalUrl(`/guides/${g.slug}`),
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

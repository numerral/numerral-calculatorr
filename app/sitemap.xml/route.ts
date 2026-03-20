// app/sitemap.xml/route.ts — Sitemap Index
// Returns a sitemapindex listing all child sitemaps

import { SITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

export async function GET() {
    const now = new Date().toISOString();

    const sitemaps = [
        `${SITE_URL}/sitemaps/sitemap-calculators.xml`,
        `${SITE_URL}/sitemaps/sitemap-guides.xml`,
        `${SITE_URL}/sitemaps/sitemap-glossary.xml`,
        `${SITE_URL}/sitemaps/sitemap-static.xml`,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((loc) => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
    });
}

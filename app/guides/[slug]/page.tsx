// Dynamic Guide Page — /guides/[slug]/ (Server Component)
// Renders a single pillar article with sections, FAQ schema, and related calculators

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import InsightBox from "@/components/shared/InsightBox";
import { getAllGuides, getGuideBySlug, getCalculatorById } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);
    if (!guide) return {};
    return {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: canonicalUrl(`/guides/${guide.slug}`) },
        openGraph: {
            images: [{ url: `/images/guides/${guide.slug}.png`, width: 1024, height: 1024 }],
        },
    };
}

export default async function GuidePage({ params }: PageProps) {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);
    if (!guide) return notFound();

    const relatedCalcs = guide.relatedCalculators
        .map((id) => getCalculatorById(id))
        .filter(Boolean);

    const pageUrl = canonicalUrl(`/guides/${guide.slug}`);

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Financial Guides", url: canonicalUrl("/guides") },
            { name: guide.title },
        ]),
        faqSchema(guide.faq),
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: pageUrl,
            publisher: {
                "@type": "Organization",
                name: "Numerral",
                url: SITE_URL,
            },
            datePublished: "2026-03-04",
            dateModified: "2026-03-04",
        },
    ];

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-guide"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Guides", href: "/guides" },
                    { label: guide.title.length > 40 ? guide.title.slice(0, 40) + "…" : guide.title },
                ]}
            />

            <article
                style={{
                    maxWidth: "var(--w-narrow)",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <header style={{ marginBottom: "var(--s-8)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-3)" }}>
                        <span className="result-highlight">
                            🕒 {guide.readTime} read
                        </span>
                        <span className="result-highlight">
                            {guide.icon} {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                        </span>
                    </div>
                    <h1 className="t-h1" style={{ marginBottom: "var(--s-3)", lineHeight: 1.3 }}>
                        {guide.title}
                    </h1>
                    <p className="t-body text-muted" style={{ lineHeight: 1.6 }}>
                        {guide.description}
                    </p>
                    <Image
                        src={`/images/guides/${guide.slug}.png`}
                        alt={guide.title}
                        width={800}
                        height={450}
                        priority
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "var(--r-lg)",
                            marginTop: "var(--s-5)",
                        }}
                    />
                </header>

                {/* Table of Contents */}
                <nav
                    style={{
                        padding: "var(--s-5)",
                        background: "var(--n-surface)",
                        border: "1px solid var(--n-border)",
                        borderRadius: "var(--r-md)",
                        marginBottom: "var(--s-8)",
                    }}
                >
                    <p style={{ fontWeight: 700, marginBottom: "var(--s-3)", color: "var(--n-text)" }}>
                        📋 In This Guide
                    </p>
                    <ol style={{ paddingLeft: "var(--s-6)", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                        {guide.sections.map((section, i) => (
                            <li key={i}>
                                <a
                                    href={`#section-${i}`}
                                    style={{ color: "var(--n-primary)", fontWeight: 500, fontSize: "var(--t-body-sm)" }}
                                >
                                    {section.heading}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Content Sections */}
                {guide.sections.map((section, i) => (
                    <section
                        key={i}
                        id={`section-${i}`}
                        style={{ marginBottom: "var(--s-8)" }}
                    >
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                            {section.heading}
                        </h2>
                        <div
                            className="t-body"
                            style={{
                                lineHeight: 1.8,
                                color: "var(--n-text-secondary)",
                                whiteSpace: "pre-line",
                            }}
                        >
                            {section.content.split("\n\n").map((para, j) => {
                                // Check if this paragraph is a markdown table
                                if (para.includes("|") && para.includes("---")) {
                                    const lines = para.trim().split("\n").filter((l) => !l.match(/^\|[\s-|]+\|$/));
                                    const headers = lines[0]?.split("|").map((h) => h.trim()).filter(Boolean);
                                    const rows = lines.slice(1).map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
                                    return (
                                        <table key={j} className="calc-table" style={{ marginBottom: "var(--s-4)" }}>
                                            <thead>
                                                <tr>
                                                    {headers?.map((h, k) => <th key={k}>{h}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, k) => (
                                                    <tr key={k}>
                                                        {row.map((cell, l) => <td key={l}>{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    );
                                }
                                // Check if it's a list
                                if (para.match(/^[•\-]\s/m)) {
                                    const items = para.split("\n").filter((l) => l.trim());
                                    return (
                                        <ul key={j} style={{ paddingLeft: "var(--s-6)", marginBottom: "var(--s-4)", lineHeight: 1.8 }}>
                                            {items.map((item, k) => (
                                                <li key={k} dangerouslySetInnerHTML={{
                                                    __html: item
                                                        .replace(/^[•\-]\s*/, "")
                                                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                }} />
                                            ))}
                                        </ul>
                                    );
                                }
                                return (
                                    <p
                                        key={j}
                                        style={{ marginBottom: "var(--s-4)" }}
                                        dangerouslySetInnerHTML={{
                                            __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </section>
                ))}

                {/* Related Calculators */}
                {relatedCalcs.length > 0 && (
                    <InsightBox icon="🔗" title="Try These Calculators">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)", marginTop: "var(--s-2)" }}>
                            {relatedCalcs.map((calc) => calc && (
                                <Link
                                    key={calc.id}
                                    href={`/${calc.categorySlug}/${calc.slug}`}
                                    className="result-highlight"
                                    style={{ textDecoration: "none" }}
                                >
                                    {calc.icon} {calc.title}
                                </Link>
                            ))}
                        </div>
                    </InsightBox>
                )}

                {/* FAQ */}
                {guide.faq.length > 0 && (
                    <FAQAccordion
                        title={`Frequently Asked Questions`}
                        items={guide.faq}
                    />
                )}

                {/* Back to guides */}
                <div style={{ textAlign: "center", padding: "var(--s-8) 0" }}>
                    <Link
                        href="/guides"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "var(--s-2)",
                            color: "var(--n-primary)",
                            fontWeight: 600,
                        }}
                    >
                        ← Browse All Guides
                    </Link>
                </div>
            </article>
        </main>
    );
}

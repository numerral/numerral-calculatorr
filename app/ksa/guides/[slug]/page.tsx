// Dynamic KSA Guide Page — /ksa/guides/[slug]/ (Server Component)
// Renders a single KSA pillar article with sections, TOC, FAQ, and related resources

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import InsightBox from "@/components/shared/InsightBox";
import { getAllKSAGuides, getKSAGuideBySlug, getKSAGlossaryTermBySlug } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import "@/app/ksa/ksa.css";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllKSAGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = getKSAGuideBySlug(slug);
    if (!guide) return {};
    return {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: canonicalUrl(`/ksa/guides/${guide.slug}`) },
    };
}

const categoryMeta: Record<string, { color: string; label: string }> = {
    business: { color: "#1a56db", label: "Business" },
    finance: { color: "#006a3c", label: "Finance" },
    employment: { color: "#7c3aed", label: "Employment" },
    banking: { color: "#0891b2", label: "Banking" },
    immigration: { color: "#dc2626", label: "Immigration" },
};

export default async function KSAGuidePage({ params }: PageProps) {
    const { slug } = await params;
    const guide = getKSAGuideBySlug(slug);
    if (!guide) return notFound();

    const meta = categoryMeta[guide.category] || { color: "#006a3c", label: guide.category };

    // Resolve related glossary terms
    const glossaryTerms = guide.relatedGlossary
        .map((s) => getKSAGlossaryTermBySlug(s))
        .filter(Boolean);

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: canonicalUrl("/ksa") },
            { name: "Guides", url: canonicalUrl("/ksa/guides") },
            { name: guide.title.length > 60 ? guide.title.slice(0, 57) + "…" : guide.title },
        ]),
        faqSchema(guide.faq),
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: canonicalUrl(`/ksa/guides/${guide.slug}`),
            publisher: {
                "@type": "Organization",
                name: "Numerral",
                url: SITE_URL,
            },
            datePublished: "2026-03-26",
            dateModified: "2026-03-26",
        },
    ];

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ksa-guide"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "KSA Calculators", href: "/ksa" },
                    { label: "Guides", href: "/ksa/guides" },
                    { label: guide.title.length > 40 ? guide.title.slice(0, 40) + "…" : guide.title },
                ]}
            />

            <article style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
                {/* Header */}
                <header style={{ marginBottom: "var(--s-8)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-3)" }}>
                        <span
                            className="result-highlight"
                            style={{ background: `${meta.color}10`, color: meta.color, border: `1px solid ${meta.color}22` }}
                        >
                            🕒 {guide.readTime} read
                        </span>
                        <span
                            className="result-highlight"
                            style={{ background: `${meta.color}10`, color: meta.color, border: `1px solid ${meta.color}22` }}
                        >
                            {guide.icon} {meta.label}
                        </span>
                    </div>
                    <h1 className="t-h1" style={{ marginBottom: "var(--s-3)", lineHeight: 1.3 }}>
                        {guide.title}
                    </h1>
                    <p className="t-body text-muted" style={{ lineHeight: 1.6 }}>
                        {guide.description}
                    </p>
                </header>

                {/* Quotation */}
                {guide.quotation && (
                    <blockquote
                        style={{
                            margin: "0 0 var(--s-8) 0",
                            padding: "var(--s-5) var(--s-6)",
                            borderLeft: `4px solid ${meta.color}`,
                            background: "var(--n-surface)",
                            borderRadius: "0 var(--r-md) var(--r-md) 0",
                            fontStyle: "italic",
                            fontSize: "var(--t-h4)",
                            lineHeight: 1.6,
                            color: "var(--n-text)",
                            position: "relative",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "2rem",
                                position: "absolute",
                                top: "var(--s-3)",
                                left: "var(--s-3)",
                                opacity: 0.15,
                                lineHeight: 1,
                            }}
                        >
                            &#x201C;
                        </span>
                        <p style={{ margin: 0, paddingLeft: "var(--s-4)" }}>
                            {guide.quotation}
                        </p>
                    </blockquote>
                )}

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
                                    style={{ color: meta.color, fontWeight: 500, fontSize: "var(--t-body-sm)" }}
                                >
                                    {section.heading}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Content Sections — uses the same smart markdown parser as the Indian guides */}
                {guide.sections.map((section, i) => (
                    <section key={i} id={`section-${i}`} style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                            {section.heading}
                        </h2>
                        <div
                            className="t-body"
                            style={{ lineHeight: 1.8, color: "var(--n-text-secondary)", whiteSpace: "pre-line" }}
                        >
                            {section.content.split("\n\n").map((para, j) => {
                                // Markdown table
                                if (para.includes("|") && para.includes("---")) {
                                    const lines = para.trim().split("\n").filter((l) => !l.match(/^\|[\s-|]+\|$/));
                                    const headers = lines[0]?.split("|").map((h) => h.trim()).filter(Boolean);
                                    const rows = lines.slice(1).map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
                                    return (
                                        <table key={j} className="calc-table" style={{ marginBottom: "var(--s-4)" }}>
                                            <thead>
                                                <tr>
                                                    {headers?.map((h, k) => <th key={k} dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, k) => (
                                                    <tr key={k}>
                                                        {row.map((cell, l) => <td key={l} dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    );
                                }
                                // Sub-header + bullet list
                                const subHeaderMatch = para.match(/^\*\*(.+?)\*\*:?\s*\n([•\-]\s)/m);
                                if (subHeaderMatch) {
                                    const lines = para.split("\n");
                                    const headerLine = lines[0];
                                    const bulletLines = lines.slice(1).filter((l) => l.trim());
                                    return (
                                        <div key={j} style={{
                                            background: "var(--n-surface)",
                                            border: "1px solid var(--n-border)",
                                            borderRadius: "var(--r-md)",
                                            padding: "var(--s-4) var(--s-5)",
                                            marginBottom: "var(--s-4)",
                                        }}>
                                            <p style={{ fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-2)", fontSize: "var(--t-body)" }}
                                                dangerouslySetInnerHTML={{ __html: headerLine.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                                            <ul style={{ paddingLeft: "var(--s-6)", marginBottom: 0, lineHeight: 1.8 }}>
                                                {bulletLines.map((item, k) => (
                                                    <li key={k} dangerouslySetInnerHTML={{
                                                        __html: item
                                                            .replace(/^[•\-]\s*/, "")
                                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                    }} />
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }
                                // Plain bullet list
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
                                // Regular paragraph
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

                {/* Related KSA Calculators */}
                {guide.relatedCalcs.length > 0 && (
                    <InsightBox icon="🔗" title="Related KSA Calculators">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)", marginTop: "var(--s-2)" }}>
                            {guide.relatedCalcs.map((href) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="result-highlight"
                                    style={{ textDecoration: "none" }}
                                >
                                    🇸🇦 {href.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                </Link>
                            ))}
                        </div>
                    </InsightBox>
                )}

                {/* Related Glossary Terms */}
                {glossaryTerms.length > 0 && (
                    <section style={{ marginTop: "var(--s-6)", marginBottom: "var(--s-6)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📖 Related KSA Glossary Terms</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--s-3)" }}>
                            {glossaryTerms.map((t) => t && (
                                <Link
                                    key={t.slug}
                                    href={`/ksa/glossary/${t.slug}`}
                                    style={{
                                        padding: "var(--s-3)",
                                        background: "var(--n-surface)",
                                        border: "1px solid var(--n-border)",
                                        borderRadius: "var(--r-sm)",
                                        textDecoration: "none",
                                        color: "#006a3c",
                                        fontWeight: 600,
                                        fontSize: "var(--t-body-sm)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "2px",
                                    }}
                                >
                                    <span>{t.term} →</span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", fontWeight: 400 }}>
                                        {t.termAr}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {guide.faq.length > 0 && (
                    <FAQAccordion title="Frequently Asked Questions" items={guide.faq} />
                )}

                {/* Back links */}
                <div
                    style={{
                        display: "flex",
                        gap: "var(--s-6)",
                        justifyContent: "center",
                        padding: "var(--s-8) 0",
                        flexWrap: "wrap",
                    }}
                >
                    <Link href="/ksa/guides" style={{ color: "#006a3c", fontWeight: 600 }}>
                        ← Browse KSA Guides
                    </Link>
                    <Link href="/ksa/glossary" style={{ color: "#006a3c", fontWeight: 600 }}>
                        📖 KSA Glossary
                    </Link>
                    <Link href="/ksa" style={{ color: "#006a3c", fontWeight: 600 }}>
                        🇸🇦 KSA Calculators Hub
                    </Link>
                </div>
            </article>
        </main>
    );
}

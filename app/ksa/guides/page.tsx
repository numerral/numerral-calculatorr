// KSA Guides Hub — /ksa/guides/ (Server Component)
// Lists all KSA-specific pillar articles

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getAllKSAGuides } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import "@/app/ksa/ksa.css";

export const metadata: Metadata = {
    title: "KSA Guides — Saudi Arabia Business, Finance & Employment Guides | Numerral",
    description:
        "In-depth guides for Saudi Arabia — starting a business, expat financial planning, Nitaqat compliance, Islamic banking, and Iqama renewal. Based on current 2025/2026 regulations.",
    alternates: { canonical: canonicalUrl("/ksa/guides") },
};

const categoryMeta: Record<string, { color: string; label: string }> = {
    business: { color: "#1a56db", label: "Business" },
    finance: { color: "#006a3c", label: "Finance" },
    employment: { color: "#7c3aed", label: "Employment" },
    banking: { color: "#0891b2", label: "Banking" },
    immigration: { color: "#dc2626", label: "Immigration" },
};

export default function KSAGuidesPage() {
    const guides = getAllKSAGuides();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: canonicalUrl("/ksa") },
            { name: "Guides" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "KSA Guides",
            description: "In-depth guides for Saudi Arabia business, finance, employment, and immigration.",
            url: canonicalUrl("/ksa/guides"),
            hasPart: guides.map((g) => ({
                "@type": "Article",
                name: g.title,
                url: canonicalUrl(`/ksa/guides/${g.slug}`),
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ksa-guides"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "KSA Calculators", href: "/ksa" },
                    { label: "Guides" },
                ]}
            />

            {/* Hero Section */}
            <div className="ksa-hero">
                <div className="ksa-hero__flag">📚</div>
                <h1 className="ksa-hero__title">KSA Guides</h1>
                <p className="ksa-hero__subtitle">
                    In-depth, practical guides for doing business, managing finances, and navigating regulations in Saudi Arabia — written for expats, entrepreneurs, and HR professionals.
                </p>
                <div className="ksa-hero__stats">
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">{guides.length}</span>
                        <span className="ksa-hero__stat-label">Guides</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">8,000+</span>
                        <span className="ksa-hero__stat-label">Words</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">🇸🇦</span>
                        <span className="ksa-hero__stat-label">KSA Focus</span>
                    </div>
                </div>
            </div>

            {/* Guide Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)", marginBottom: "var(--s-8)" }}>
                {guides.map((guide) => {
                    const meta = categoryMeta[guide.category] || { color: "#006a3c", label: guide.category };
                    return (
                        <Link
                            key={guide.slug}
                            href={`/ksa/guides/${guide.slug}`}
                            className="calc-card"
                            style={{
                                textDecoration: "none",
                                padding: "var(--s-5) var(--s-6)",
                                display: "flex",
                                gap: "var(--s-5)",
                                alignItems: "flex-start",
                                borderLeft: `4px solid ${meta.color}`,
                            }}
                        >
                            <span style={{ fontSize: "2rem", flexShrink: 0 }}>{guide.icon}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginBottom: "var(--s-2)", flexWrap: "wrap" }}>
                                    <span
                                        style={{
                                            fontSize: "0.72rem",
                                            fontWeight: 700,
                                            textTransform: "uppercase",
                                            letterSpacing: "0.04em",
                                            color: meta.color,
                                            background: `${meta.color}10`,
                                            padding: "2px 10px",
                                            borderRadius: "var(--r-full)",
                                        }}
                                    >
                                        {meta.label}
                                    </span>
                                    <span style={{ fontSize: "0.78rem", color: "var(--n-text-muted)" }}>
                                        🕒 {guide.readTime} read
                                    </span>
                                </div>
                                <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-2)", lineHeight: 1.3 }}>
                                    {guide.title}
                                </h2>
                                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-secondary)", lineHeight: 1.5, margin: 0 }}>
                                    {guide.description}
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-2)", marginTop: "var(--s-3)" }}>
                                    {guide.sections.slice(0, 4).map((s, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                fontSize: "0.7rem",
                                                padding: "2px 8px",
                                                background: "var(--n-surface)",
                                                border: "1px solid var(--n-border)",
                                                borderRadius: "var(--r-full)",
                                                color: "var(--n-text-muted)",
                                            }}
                                        >
                                            {s.heading.length > 35 ? s.heading.slice(0, 35) + "…" : s.heading}
                                        </span>
                                    ))}
                                    {guide.sections.length > 4 && (
                                        <span style={{ fontSize: "0.7rem", padding: "2px 8px", color: "var(--n-text-muted)" }}>
                                            +{guide.sections.length - 4} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span style={{ color: "var(--n-text-muted)", flexShrink: 0, fontSize: "1.2rem" }}>→</span>
                        </Link>
                    );
                })}
            </div>

            {/* Back to KSA Hub */}
            <div style={{ textAlign: "center", padding: "var(--s-4) 0 var(--s-8)" }}>
                <Link href="/ksa" style={{ color: "#006a3c", fontWeight: 600 }}>
                    ← Back to KSA Calculators Hub
                </Link>
            </div>
        </main>
    );
}

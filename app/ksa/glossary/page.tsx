// KSA Glossary Hub — /ksa/glossary/ (Server Component)
// Lists all KSA-specific glossary terms grouped by category

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getAllKSAGlossaryTerms } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import "@/app/ksa/ksa.css";

export const metadata: Metadata = {
    title: "KSA Glossary — 30+ Saudi Arabia Business, Employment & Finance Terms Explained | مسرد المصطلحات",
    description:
        "Comprehensive glossary of Saudi-specific terms: Nitaqat, Saudization, GOSI, Iqama, Commercial Registration, VAT, Zakat, and 25+ more — explained in plain English with Arabic translations.",
    alternates: { canonical: canonicalUrl("/ksa/glossary") },
};

const categoryMeta: Record<string, { icon: string; label: string; labelAr: string; color: string }> = {
    employment: { icon: "👷", label: "Employment & Labor", labelAr: "التوظيف والعمل", color: "#006a3c" },
    business: { icon: "🏢", label: "Business Registration", labelAr: "تسجيل الأعمال", color: "#1a56db" },
    tax: { icon: "🧾", label: "Tax & Finance", labelAr: "الضرائب والمالية", color: "#7c3aed" },
    immigration: { icon: "🛂", label: "Immigration & Visas", labelAr: "الهجرة والتأشيرات", color: "#dc2626" },
    banking: { icon: "🏦", label: "Islamic Banking", labelAr: "المصرفية الإسلامية", color: "#0891b2" },
};

export default function KSAGlossaryPage() {
    const terms = getAllKSAGlossaryTerms();

    // Group by category
    const grouped = terms.reduce((acc, term) => {
        if (!acc[term.category]) acc[term.category] = [];
        acc[term.category].push(term);
        return acc;
    }, {} as Record<string, typeof terms>);

    const categoryOrder = ["employment", "business", "tax", "immigration", "banking"];

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: canonicalUrl("/ksa") },
            { name: "Glossary" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "KSA Business & Employment Glossary",
            description: "Comprehensive glossary of Saudi Arabia business, employment, tax, and immigration terms",
            url: canonicalUrl("/ksa/glossary"),
            hasDefinedTerm: terms.map((t) => ({
                "@type": "DefinedTerm",
                name: t.term,
                description: t.definition,
                url: canonicalUrl(`/ksa/glossary/${t.slug}`),
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ksa-glossary"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "KSA Calculators", href: "/ksa" },
                    { label: "Glossary" },
                ]}
            />

            {/* Hero Section */}
            <div className="ksa-hero">
                <div className="ksa-hero__flag">📖</div>
                <h1 className="ksa-hero__title">KSA Glossary — مسرد المصطلحات</h1>
                <p className="ksa-hero__subtitle">
                    {terms.length} Saudi Arabia-specific terms explained in plain English with Arabic translations — covering employment law, business registration, tax, immigration, and Islamic banking.
                </p>
                <div className="ksa-hero__stats">
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">{terms.length}</span>
                        <span className="ksa-hero__stat-label">Terms</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">{categoryOrder.length}</span>
                        <span className="ksa-hero__stat-label">Categories</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">🇸🇦</span>
                        <span className="ksa-hero__stat-label">KSA Focus</span>
                    </div>
                </div>
            </div>

            {/* Category Quick Nav */}
            <nav
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--s-3)",
                    marginBottom: "var(--s-8)",
                    justifyContent: "center",
                }}
            >
                {categoryOrder.map((cat) => {
                    const meta = categoryMeta[cat];
                    return (
                        <a
                            key={cat}
                            href={`#cat-${cat}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "var(--s-2)",
                                padding: "8px 16px",
                                borderRadius: "var(--r-full)",
                                background: "var(--n-surface)",
                                border: `1.5px solid ${meta.color}22`,
                                fontWeight: 600,
                                fontSize: "var(--t-body-sm)",
                                color: meta.color,
                                textDecoration: "none",
                                transition: "all 0.15s",
                            }}
                        >
                            <span>{meta.icon}</span>
                            {meta.label}
                        </a>
                    );
                })}
            </nav>

            {/* Terms by Category */}
            {categoryOrder.map((cat) => {
                const meta = categoryMeta[cat];
                const catTerms = grouped[cat] || [];
                return (
                    <section key={cat} id={`cat-${cat}`} style={{ marginBottom: "var(--s-10)" }}>
                        <div style={{ marginBottom: "var(--s-4)" }}>
                            <h2
                                style={{
                                    fontSize: "1.4rem",
                                    fontWeight: 700,
                                    marginBottom: "var(--s-1)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--s-3)",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "36px",
                                        height: "36px",
                                        borderRadius: "var(--r-sm)",
                                        background: `${meta.color}12`,
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    {meta.icon}
                                </span>
                                {meta.label}
                                <span style={{ fontSize: "0.85rem", color: "var(--n-text-muted)", fontWeight: 400 }}>
                                    {meta.labelAr}
                                </span>
                            </h2>
                            <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                                {catTerms.length} terms
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--s-3)" }}>
                            {catTerms.map((term) => (
                                <Link
                                    key={term.slug}
                                    href={`/ksa/glossary/${term.slug}`}
                                    className="calc-card"
                                    style={{
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "var(--s-4)",
                                        padding: "var(--s-4)",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "4px",
                                            minHeight: "48px",
                                            borderRadius: "2px",
                                            background: meta.color,
                                            flexShrink: 0,
                                            alignSelf: "stretch",
                                        }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-2)", marginBottom: "var(--s-1)" }}>
                                            <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--n-text)" }}>
                                                {term.term}
                                            </span>
                                            <span style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", fontFamily: "'Noto Sans Arabic', sans-serif" }}>
                                                {term.termAr}
                                            </span>
                                        </div>
                                        <p
                                            style={{
                                                fontSize: "var(--t-body-sm)",
                                                color: "var(--n-text-secondary)",
                                                lineHeight: 1.4,
                                                margin: 0,
                                            }}
                                        >
                                            {term.definition.length > 110
                                                ? term.definition.slice(0, 110) + "…"
                                                : term.definition}
                                        </p>
                                    </div>
                                    <span style={{ color: "var(--n-text-muted)", flexShrink: 0 }}>→</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* Back to KSA Hub */}
            <div style={{ textAlign: "center", padding: "var(--s-4) 0 var(--s-8)" }}>
                <Link
                    href="/ksa"
                    style={{
                        color: "#006a3c",
                        fontWeight: 600,
                    }}
                >
                    ← Back to KSA Calculators Hub
                </Link>
            </div>
        </main>
    );
}

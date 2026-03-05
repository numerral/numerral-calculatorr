// Glossary Hub — /glossary/ (Server Component)
// A-Z index of 100+ financial terms with links to individual pages

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getAllGlossaryTerms } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Financial Glossary — 100+ Key Finance and Banking Terms Explained",
    description:
        "Comprehensive glossary of financial terms: EMI, SIP, CAGR, CIBIL Score, GST, Section 80C, and 100+ more. Simple, jargon-free definitions.",
    alternates: { canonical: canonicalUrl("/glossary") },
};

export default function GlossaryHubPage() {
    const terms = getAllGlossaryTerms();

    // Group by first letter
    const grouped = terms.reduce((acc, term) => {
        const letter = term.term[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(term);
        return acc;
    }, {} as Record<string, typeof terms>);

    const letters = Object.keys(grouped).sort();

    const schemaData = JSON.stringify(
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Financial Glossary" },
        ])
    );

    const categoryColors: Record<string, string> = {
        loan: "var(--n-cat-loan)",
        invest: "var(--n-cat-invest)",
        tax: "var(--n-cat-tax)",
        utility: "var(--n-cat-utility)",
    };

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-glossary"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Financial Glossary" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                📖 Financial Glossary
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)", maxWidth: "var(--w-narrow)" }}>
                {terms.length} financial terms explained in plain language. From EMI to XIRR, Section 80C to GSTIN — everything you need to understand Indian finance.
            </p>

            {/* A-Z Navigation */}
            <nav
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--s-2)",
                    marginBottom: "var(--s-8)",
                    padding: "var(--s-4)",
                    background: "var(--n-surface)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--n-border)",
                }}
            >
                {letters.map((letter) => (
                    <a
                        key={letter}
                        href={`#letter-${letter}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "var(--r-sm)",
                            background: "var(--n-bg)",
                            border: "1px solid var(--n-border)",
                            fontWeight: 700,
                            fontSize: "var(--t-body-sm)",
                            color: "var(--n-primary)",
                            textDecoration: "none",
                        }}
                    >
                        {letter}
                    </a>
                ))}
            </nav>

            {/* Term listings by letter */}
            {letters.map((letter) => (
                <section key={letter} id={`letter-${letter}`} style={{ marginBottom: "var(--s-8)" }}>
                    <h2
                        className="t-h2"
                        style={{
                            marginBottom: "var(--s-4)",
                            paddingBottom: "var(--s-2)",
                            borderBottom: "2px solid var(--n-primary)",
                            display: "inline-block",
                        }}
                    >
                        {letter}
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                        {grouped[letter].map((term) => (
                            <Link
                                key={term.slug}
                                href={`/glossary/${term.slug}`}
                                className="calc-card"
                                style={{
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "var(--s-4)",
                                    padding: "var(--s-4)",
                                }}
                            >
                                <span
                                    style={{
                                        width: "4px",
                                        height: "100%",
                                        minHeight: "40px",
                                        borderRadius: "2px",
                                        background: categoryColors[term.category] ?? "var(--n-primary)",
                                        flexShrink: 0,
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <span className="t-h4" style={{ fontWeight: 600, color: "var(--n-text)" }}>
                                        {term.term}
                                    </span>
                                    <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-1)", lineHeight: 1.4 }}>
                                        {term.definition.length > 120
                                            ? term.definition.slice(0, 120) + "…"
                                            : term.definition}
                                    </p>
                                </div>
                                <span className="t-caption" style={{ color: categoryColors[term.category], fontWeight: 600, flexShrink: 0 }}>
                                    {term.category}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}

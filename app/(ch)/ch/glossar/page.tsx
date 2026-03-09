// Swiss Glossary Hub — /ch/glossar
// A-Z index of 50 Swiss financial terms

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getAllChGlossaryTerms } from "@/lib/ch-glossary";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Schweizer Finanz-Glossar — 50 wichtige Finanzbegriffe erklärt",
    description:
        "Umfassendes Glossar der Schweizer Finanzwelt: AHV, BVG, Säule 3a, Hypothek, Tragbarkeit, Verrechnungssteuer, ETF, FIRE und 40+ weitere Begriffe. Einfach und verständlich erklärt.",
    alternates: { canonical: `${SITE_URL}/ch/glossar` },
};

const CATEGORY_META: Record<string, { label: string; color: string }> = {
    immobilien: { label: "Immobilien", color: "hsl(0, 70%, 65%)" },
    steuern: { label: "Steuern", color: "hsl(142, 60%, 55%)" },
    vorsorge: { label: "Vorsorge", color: "hsl(270, 60%, 65%)" },
    investition: { label: "Investition", color: "hsl(38, 80%, 60%)" },
    lohn: { label: "Lohn", color: "hsl(217, 70%, 65%)" },
};

export default function ChGlossarPage() {
    const terms = getAllChGlossaryTerms();

    // Group by first letter
    const grouped = terms.reduce((acc, term) => {
        const first = term.term[0].toUpperCase();
        const letter = /[A-ZÄÖÜ0-9]/.test(first) ? first : "#";
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(term);
        return acc;
    }, {} as Record<string, typeof terms>);

    const letters = Object.keys(grouped).sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b, "de-CH");
    });

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "Schweizer Finanz-Glossar",
        description: "50 wichtige Finanzbegriffe der Schweiz verständlich erklärt",
        url: `${SITE_URL}/ch/glossar`,
        inLanguage: "de-CH",
        hasDefinedTerm: terms.map(t => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition.slice(0, 200),
            url: `${SITE_URL}/ch/glossar/${t.slug}`,
        })),
    });

    return (
        <main className="ch-page">
            <Script
                id="schema-ch-glossar"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Hero */}
            <section className="ch-hero" style={{ paddingBottom: "var(--s-8)" }}>
                <Link href="/ch" className="ch-glossar__back">← Zurück zu allen Rechnern</Link>
                <h1 className="ch-hero__title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                    📖 Schweizer <span className="ch-hero__accent">Finanz-Glossar</span>
                </h1>
                <p className="ch-hero__subtitle">
                    {terms.length} wichtige Finanzbegriffe der Schweiz — von AHV bis Zinseszins.
                    Einfach und verständlich erklärt.
                </p>
                <div className="ch-hero__stats">
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">{terms.length}</span><span className="ch-hero__stat-label">Begriffe</span></div>
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">5</span><span className="ch-hero__stat-label">Kategorien</span></div>
                </div>
            </section>

            {/* A-Z Navigation */}
            <nav className="ch-glossar__nav">
                {letters.map(letter => (
                    <a key={letter} href={`#buchstabe-${letter}`} className="ch-glossar__nav-letter">
                        {letter}
                    </a>
                ))}
            </nav>

            {/* Category legend */}
            <div className="ch-glossar__legend">
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <span key={key} className="ch-glossar__legend-item">
                        <span className="ch-glossar__legend-dot" style={{ background: meta.color }} />
                        {meta.label}
                    </span>
                ))}
            </div>

            {/* Term listings by letter */}
            {letters.map(letter => (
                <section key={letter} id={`buchstabe-${letter}`} className="ch-glossar__section">
                    <h2 className="ch-glossar__letter">{letter}</h2>
                    <div className="ch-glossar__terms">
                        {grouped[letter].map(term => (
                            <Link key={term.slug} href={`/ch/glossar/${term.slug}`} className="ch-glossar__term-card">
                                <span
                                    className="ch-glossar__term-bar"
                                    style={{ background: CATEGORY_META[term.category]?.color ?? "var(--n-primary)" }}
                                />
                                <div className="ch-glossar__term-body">
                                    <span className="ch-glossar__term-name">{term.term}</span>
                                    <p className="ch-glossar__term-def">
                                        {term.definition.length > 140
                                            ? term.definition.slice(0, 140) + "…"
                                            : term.definition}
                                    </p>
                                </div>
                                <span
                                    className="ch-glossar__term-badge"
                                    style={{ color: CATEGORY_META[term.category]?.color }}
                                >
                                    {CATEGORY_META[term.category]?.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}

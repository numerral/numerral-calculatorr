// Swiss Glossary Term Detail — /ch/glossar/[slug]
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getAllChGlossaryTerms, getChGlossaryTermBySlug } from "@/lib/ch-glossary";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
    return getAllChGlossaryTerms().map(t => ({ slug: t.slug }));
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const term = getChGlossaryTermBySlug(slug);
    if (!term) return {};
    return {
        title: `${term.term} — Schweizer Finanz-Glossar | Numerral`,
        description: term.definition.slice(0, 160),
        alternates: { canonical: `${SITE_URL}/ch/glossar/${slug}` },
    };
}

const CATEGORY_META: Record<string, { label: string; color: string }> = {
    immobilien: { label: "Immobilien", color: "hsl(0, 70%, 65%)" },
    steuern: { label: "Steuern", color: "hsl(142, 60%, 55%)" },
    vorsorge: { label: "Vorsorge", color: "hsl(270, 60%, 65%)" },
    investition: { label: "Investition", color: "hsl(38, 80%, 60%)" },
    lohn: { label: "Lohn", color: "hsl(217, 70%, 65%)" },
};

export default async function ChGlossarTermPage({ params }: Props) {
    const { slug } = await params;
    const term = getChGlossaryTermBySlug(slug);
    if (!term) notFound();

    const allTerms = getAllChGlossaryTerms();
    const relatedTerms = allTerms.filter(t => t.slug !== slug && term.related?.some(r => t.related?.includes(r)));
    const catMeta = CATEGORY_META[term.category] ?? { label: term.category, color: "var(--n-primary)" };

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: term.term,
        description: term.definition,
        url: `${SITE_URL}/ch/glossar/${slug}`,
        inLanguage: "de-CH",
        inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Schweizer Finanz-Glossar",
            url: `${SITE_URL}/ch/glossar`,
        },
    });

    return (
        <main className="ch-page" style={{ maxWidth: "800px" }}>
            <Script
                id="schema-ch-term"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Breadcrumb */}
            <nav className="ch-glossar__breadcrumb">
                <Link href="/ch">Rechner</Link>
                <span>/</span>
                <Link href="/ch/glossar">Glossar</Link>
                <span>/</span>
                <span>{term.term.length > 30 ? term.term.slice(0, 30) + "…" : term.term}</span>
            </nav>

            {/* Header */}
            <header className="ch-glossar__detail-header">
                <span className="ch-glossar__detail-badge" style={{ color: catMeta.color, borderColor: catMeta.color, background: `${catMeta.color}15` }}>
                    {catMeta.label}
                </span>
                <h1 className="ch-glossar__detail-title">{term.term}</h1>
            </header>

            {/* Definition */}
            <section className="ch-glossar__detail-section">
                <h2>Definition</h2>
                <p className="ch-glossar__detail-text">{term.definition}</p>
            </section>

            {/* Formula */}
            {term.formula && (
                <section className="ch-glossar__detail-formula">
                    <h2>Formel</h2>
                    <code className="ch-glossar__detail-code">{term.formula}</code>
                </section>
            )}

            {/* Related Calculators */}
            {term.related && term.related.length > 0 && (
                <section className="ch-glossar__detail-section">
                    <h2>Verwandte Rechner</h2>
                    <div className="ch-glossar__detail-links">
                        {term.related.map(id => (
                            <Link key={id} href={`/ch/${id}`} className="ch-glossar__detail-link">
                                🧮 {id.replace(/-/g, " ").replace(/rechner/gi, "Rechner")}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Related Terms */}
            {relatedTerms.length > 0 && (
                <section className="ch-glossar__detail-section">
                    <h2>Verwandte Begriffe</h2>
                    <div className="ch-glossar__detail-links">
                        {relatedTerms.slice(0, 6).map(t => (
                            <Link key={t.slug} href={`/ch/glossar/${t.slug}`} className="ch-glossar__detail-link">
                                📖 {t.term.length > 35 ? t.term.slice(0, 35) + "…" : t.term}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back */}
            <div style={{ marginTop: "var(--s-10)", paddingTop: "var(--s-6)", borderTop: "1px solid var(--n-border)" }}>
                <Link href="/ch/glossar" className="ch-glossar__back">← Alle Begriffe anzeigen</Link>
            </div>
        </main>
    );
}

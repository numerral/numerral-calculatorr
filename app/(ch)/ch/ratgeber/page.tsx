// Swiss Guides Hub — /ch/ratgeber
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getAllChGuides } from "@/data/ch-guides";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Schweizer Finanz-Ratgeber — Immobilien, Hypotheken & Vorsorge",
    description:
        "Umfassende Ratgeber zu Schweizer Finanzen: Hypothek, Tragbarkeit, Eigenkapital, Kaufnebenkosten, Mieten vs. Kaufen, Amortisation und Immobilienrendite.",
    alternates: { canonical: `${SITE_URL}/ch/ratgeber` },
};

export default function ChRatgeberPage() {
    const guides = getAllChGuides();

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Schweizer Finanz-Ratgeber",
        description: "Umfassende Ratgeber zu Schweizer Finanzen",
        url: `${SITE_URL}/ch/ratgeber`,
        hasPart: guides.map(g => ({
            "@type": "Article",
            name: g.title,
            url: `${SITE_URL}/ch/ratgeber/${g.slug}`,
        })),
    });

    return (
        <main className="ch-page">
            <Script id="schema-ch-ratgeber" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Hero */}
            <section className="ch-hero" style={{ paddingBottom: "var(--s-6)" }}>
                <Link href="/ch" className="ch-glossar__back">← Zurück zu allen Rechnern</Link>
                <h1 className="ch-hero__title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
                    📚 Schweizer <span className="ch-hero__accent">Finanz-Ratgeber</span>
                </h1>
                <p className="ch-hero__subtitle">
                    {guides.length} ausführliche Ratgeber zu Immobilien, Hypotheken und Vorsorge in der Schweiz.
                    Fundiertes Wissen für Ihre finanziellen Entscheidungen.
                </p>
            </section>

            {/* Guides Grid */}
            <div className="ch-ratgeber__grid">
                {guides.map(guide => (
                    <Link key={guide.slug} href={`/ch/ratgeber/${guide.slug}`} className="ch-ratgeber__card">
                        <div className="ch-ratgeber__card-icon">{guide.icon}</div>
                        <div className="ch-ratgeber__card-body">
                            <h2 className="ch-ratgeber__card-title">{guide.title}</h2>
                            <p className="ch-ratgeber__card-desc">
                                {guide.description.length > 160 ? guide.description.slice(0, 160) + "…" : guide.description}
                            </p>
                            <div className="ch-ratgeber__card-meta">
                                <span>🕒 {guide.readTime}</span>
                                <span>📖 {guide.sections.length} Kapitel</span>
                                <span>❓ {guide.faq.length} FAQ</span>
                            </div>
                        </div>
                        <span className="ch-ratgeber__card-arrow">→</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}

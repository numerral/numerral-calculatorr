// Swiss Calculator Hub — /ch
// Lists all 10 Swiss finance calculators

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CH_CALCULATORS } from "@/data/ch-calculators";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Schweizer Hypothekenrechner & Finanzrechner — Kostenlos",
    description:
        "Alle Schweizer Finanzrechner auf einen Blick: Hypothekenrechner, Tragbarkeitsrechner, Eigenkapitalrechner, Kaufnebenkosten, Renditerechner und mehr. Kostenlos & sofort.",
    alternates: { canonical: `${SITE_URL}/ch` },
};

export default function ChHubPage() {
    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Schweizer Finanzrechner",
        description: "Kostenlose Finanzrechner für Hypotheken und Immobilien in der Schweiz",
        url: `${SITE_URL}/ch`,
        inLanguage: "de-CH",
    });

    return (
        <main className="ar-page">
            <Script
                id="schema-ch-hub"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Hero */}
            <section className="ar-hub__hero">
                <h1 className="ar-hub__title">🇨🇭 Schweizer Finanzrechner</h1>
                <p className="ar-hub__subtitle">
                    Kostenlose Rechner für Hypotheken, Tragbarkeit, Eigenkapital und Immobilien.
                    Berechnet nach den aktuellen Schweizer Standards und Richtlinien.
                </p>
            </section>

            {/* Calculator Grid */}
            <section className="ar-hub__grid">
                {CH_CALCULATORS.map((calc) => (
                    <Link key={calc.id} href={`/ch/${calc.id}`} className="ar-hub__card">
                        <span className="ar-hub__card-icon">{calc.icon}</span>
                        <div>
                            <h2 className="ar-hub__card-title">{calc.title}</h2>
                            <p className="ar-hub__card-desc">{calc.subtitle}</p>
                        </div>
                    </Link>
                ))}
            </section>

            {/* SEO Content */}
            <section className="ar-explanation" style={{ maxWidth: "740px", margin: "0 auto" }}>
                <h2 className="ar-explanation__heading">Warum Numerral für Ihre Hypothekenberechnung?</h2>
                <p className="ar-explanation__text">
                    Unsere Rechner basieren auf den aktuellen Schweizer Richtlinien: 33%-Tragbarkeitsregel,
                    kalkulatorischer Zinssatz von 5%, 20% Eigenkapital mit mindestens 10% harten Eigenmitteln,
                    und kantonsSpezifische Kaufnebenkosten. Alle Berechnungen erfolgen sofort und ohne Registrierung.
                </p>
                <p className="ar-explanation__text">
                    Ob Hypothekenvergleich, Tragbarkeitsprüfung oder Budgetplanung — unsere Tools helfen Ihnen,
                    fundierte Entscheidungen für Ihre Immobilienfinanzierung zu treffen.
                </p>
            </section>
        </main>
    );
}

// Swiss Calculator Hub — /ch
// Premium hub page with categorized calculator grid

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { CH_CALCULATORS } from "@/data/ch-calculators";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "50 Schweizer Finanzrechner — Hypothek, Steuer, Lohn, Vorsorge, Investition",
    description:
        "Alle 50 Schweizer Finanzrechner auf einen Blick: Hypothekenrechner, Steuerrechner, Lohnrechner, AHV/BVG/3a-Vorsorge und Investitionsrechner. Kostenlos & sofort.",
    alternates: { canonical: `${SITE_URL}/ch` },
};

const CATEGORIES = [
    { label: "Immobilien & Hypotheken", icon: "🏠", range: [0, 10] },
    { label: "Steuern & Abgaben", icon: "🧾", range: [10, 20] },
    { label: "Lohn & Gehalt", icon: "💼", range: [20, 30] },
    { label: "Vorsorge & Pension", icon: "🏛️", range: [30, 40] },
    { label: "Investieren & Vermögen", icon: "📈", range: [40, 50] },
];

export default function ChHubPage() {
    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "50 Schweizer Finanzrechner",
        description: "Kostenlose Finanzrechner für Hypotheken, Steuern, Lohn, Vorsorge und Investitionen in der Schweiz",
        url: `${SITE_URL}/ch`,
        inLanguage: "de-CH",
    });

    return (
        <main className="ch-page">
            <Script
                id="schema-ch-hub"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Hero */}
            <section className="ch-hero">
                <div className="ch-hero__badge">🇨🇭 Schweiz</div>
                <h1 className="ch-hero__title">
                    Schweizer<br />
                    <span className="ch-hero__accent">Finanzrechner</span>
                </h1>
                <p className="ch-hero__subtitle">
                    50 kostenlose Rechner für Hypotheken, Steuern, Lohn, Vorsorge und Investitionen —
                    berechnet nach Schweizer Standards.
                </p>
                <div className="ch-hero__stats">
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">50</span><span className="ch-hero__stat-label">Rechner</span></div>
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">5</span><span className="ch-hero__stat-label">Kategorien</span></div>
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">26</span><span className="ch-hero__stat-label">Kantone</span></div>
                </div>
            </section>

            {/* Categorized Calculator Grid */}
            {CATEGORIES.map((cat, ci) => {
                const calcs = CH_CALCULATORS.slice(cat.range[0], cat.range[1]);
                return (
                    <section key={ci} className="ch-category">
                        <div className="ch-category__header">
                            <span className="ch-category__icon">{cat.icon}</span>
                            <h2 className="ch-category__title">{cat.label}</h2>
                            <span className="ch-category__count">{calcs.length} Rechner</span>
                        </div>
                        <div className="ch-category__grid">
                            {calcs.map((calc) => (
                                <Link key={calc.id} href={`/ch/${calc.id}`} className="ch-card">
                                    <span className="ch-card__icon">{calc.icon}</span>
                                    <div className="ch-card__content">
                                        <h3 className="ch-card__title">{calc.title}</h3>
                                        <p className="ch-card__desc">{calc.subtitle}</p>
                                    </div>
                                    <span className="ch-card__arrow">→</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}

            {/* SEO Content */}
            <section className="ch-seo">
                <h2 className="ch-seo__heading">Warum Numerral für Ihre Finanzplanung?</h2>
                <div className="ch-seo__grid">
                    <div className="ch-seo__item">
                        <span className="ch-seo__item-icon">🎯</span>
                        <h3>Schweizer Standards</h3>
                        <p>Alle Rechner basieren auf aktuellen Schweizer Richtlinien: 33%-Tragbarkeitsregel, AHV/BVG-Sätze 2026, kantonale Steuertarife und FINMA-Vorgaben.</p>
                    </div>
                    <div className="ch-seo__item">
                        <span className="ch-seo__item-icon">⚡</span>
                        <h3>Sofort & Kostenlos</h3>
                        <p>Keine Registrierung, keine Wartezeit. 50 Rechner für Hypotheken, Steuern, Lohn, Vorsorge und Investitionen — sofort berechnen.</p>
                    </div>
                    <div className="ch-seo__item">
                        <span className="ch-seo__item-icon">🔒</span>
                        <h3>Privat & Sicher</h3>
                        <p>Alle Berechnungen laufen lokal in Ihrem Browser. Keine Daten werden gespeichert oder an Dritte weitergegeben.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

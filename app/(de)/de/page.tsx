// German Calculator Hub — /de
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { DE_CALCULATORS, DE_CATEGORIES } from "@/data/de-calculators";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Rechner Online — 35 Kostenlose Rechner für Gesundheit, Mathe, Finanzen & mehr",
    description:
        "Entdecken Sie 35+ kostenlose Online-Rechner: BMI, Kalorien, Prozent, Dreisatz, Zins, Kredit, Physik, Statistik und mehr. Sofort berechnen.",
    alternates: { canonical: `${SITE_URL}/de` },
};

export default function DeHubPage() {
    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Rechner Online — Kostenlose Online-Rechner",
        description: "35 kostenlose Rechner für Gesundheit, Mathematik, Finanzen, Physik, Statistik, Alltag und KI-Tools",
        url: `${SITE_URL}/de`,
        inLanguage: "de-DE",
    });

    return (
        <main className="ch-page">
            <Script
                id="schema-de-hub"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Hero */}
            <section className="ch-hero">
                <div className="ch-hero__badge">🇩🇪 Deutschland</div>
                <h1 className="ch-hero__title">
                    Rechner<br />
                    <span className="ch-hero__accent">Online</span>
                </h1>
                <p className="ch-hero__subtitle">
                    35 kostenlose Rechner für Gesundheit, Mathematik, Finanzen, Physik,
                    Statistik, Alltag und KI-Tools — sofort berechnen, keine Registrierung.
                </p>
                <div className="ch-hero__stats">
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">35</span><span className="ch-hero__stat-label">Rechner</span></div>
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">7</span><span className="ch-hero__stat-label">Kategorien</span></div>
                    <div className="ch-hero__stat"><span className="ch-hero__stat-num">100%</span><span className="ch-hero__stat-label">Kostenlos</span></div>
                </div>
            </section>

            {/* Categorized Calculator Grid */}
            {DE_CATEGORIES.map((cat, ci) => {
                const calcs = cat.ids.map((id) => DE_CALCULATORS.find((c) => c.id === id)).filter(Boolean);
                return (
                    <section key={ci} className="ch-category">
                        <div className="ch-category__header">
                            <span className="ch-category__icon">{cat.icon}</span>
                            <h2 className="ch-category__title">{cat.label} Taschenrechner</h2>
                            <span className="ch-category__count">{calcs.length} Rechner</span>
                        </div>
                        <div className="ch-category__grid">
                            {calcs.map((calc) => calc && (
                                <Link key={calc.id} href={`/de/${calc.id}`} className="ch-card">
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
                <h2 className="ch-seo__heading">Über Numerral Rechner Online</h2>
                <div className="ch-seo__grid">
                    <div className="ch-seo__item">
                        <span className="ch-seo__item-icon">🎯</span>
                        <h3>Sofort & Präzise</h3>
                        <p>Alle Rechner liefern sofortige Ergebnisse mit wissenschaftlicher Genauigkeit. Von BMI bis Standardabweichung — jede Berechnung ist verifiziert.</p>
                    </div>
                    <div className="ch-seo__item">
                        <span className="ch-seo__item-icon">⚡</span>
                        <h3>Kostenlos & Ohne Registrierung</h3>
                        <p>Keine Anmeldung, keine Werbung, keine versteckten Kosten. 35 Rechner für Gesundheit, Mathematik, Finanzen, Physik, Statistik und mehr.</p>
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

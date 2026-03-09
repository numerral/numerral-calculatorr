// Dynamic Swiss Calculator Page — /ch/[calculator]
// Pre-renders all 10 Swiss calculator pages at build time

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import ChCustomCalculatorCore from "@/components/ch/ChCustomCalculators";
import { CH_CALCULATORS, getChCalculatorBySlug } from "@/data/ch-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

// Pre-render all Swiss calculator pages
export function generateStaticParams() {
    return CH_CALCULATORS.map((c) => ({ calculator: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getChCalculatorBySlug(calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.subtitle,
        keywords: [calc.keyword, calc.title, "Schweiz", "Rechner"],
        alternates: { canonical: `${SITE_URL}/ch/${calc.id}` },
    };
}

export default async function ChCalculatorPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getChCalculatorBySlug(calculator);
    if (!calc) return notFound();

    // Related calculators
    const relatedCalcs = (calc.relatedIds || [])
        .map((id) => CH_CALCULATORS.find((c) => c.id === id))
        .filter(Boolean);

    // Structured data (WebApplication + FAQPage)
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.title,
            url: `${SITE_URL}/ch/${calc.id}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
            inLanguage: "de-CH",
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: calc.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="ar-page">
            <Script
                id={`schema-ch-${calc.id}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Breadcrumb */}
            <nav className="ar-breadcrumb" aria-label="Navigation">
                <Link href="/ch">Rechner</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>{calc.title}</span>
            </nav>

            <h1 className="ar-page__title">
                {calc.icon} {calc.title}
            </h1>
            <p className="ar-page__subtitle">{calc.subtitle}</p>

            {/* Calculator widget */}
            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <ChCustomCalculatorCore calcType={calc.calcType} />
                </div>
            </div>

            {/* German explanation */}
            <section className="ar-explanation">
                <h2 className="ar-explanation__heading">{calc.explanation.heading}</h2>
                {calc.explanation.paragraphs.map((p, i) => (
                    <p key={i} className="ar-explanation__text">{p}</p>
                ))}
                <div className="ar-explanation__highlight">
                    <span className="ar-explanation__highlight-icon">💡</span>
                    <p>{calc.explanation.highlight}</p>
                </div>
            </section>

            {/* Rich Content Sections — tables, bullets, extra paragraphs */}
            {calc.richSections && calc.richSections.length > 0 && (
                <div className="ar-rich-content">
                    {calc.richSections.map((section, i) => (
                        <section key={i} className="ar-rich-section">
                            <h2 className="ar-rich-section__heading">{section.heading}</h2>

                            {section.paragraphs && section.paragraphs.map((p, j) => (
                                <p key={j} className="ar-rich-section__text">{p}</p>
                            ))}

                            {section.bullets && (
                                <ul className="ar-rich-section__bullets">
                                    {section.bullets.map((b, j) => (
                                        <li key={j}>{b}</li>
                                    ))}
                                </ul>
                            )}

                            {section.table && (
                                <div className="ar-rich-section__table-wrap">
                                    <table className="ar-rich-section__table">
                                        <thead>
                                            <tr>
                                                {section.table.headers.map((h, j) => (
                                                    <th key={j}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section.table.rows.map((row, j) => (
                                                <tr key={j}>
                                                    {row.map((cell, k) => (
                                                        <td key={k}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}

            {/* FAQ Accordion */}
            <section className="ar-faq">
                <h2 className="ar-faq__title">Häufig gestellte Fragen — {calc.title}</h2>
                {calc.faq.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            {/* Related Calculators */}
            {relatedCalcs.length > 0 && (
                <section className="ar-related">
                    <h2 className="ar-related__title">🔗 Verwandte Rechner</h2>
                    <div className="ar-related__grid">
                        {relatedCalcs.map((rc) => rc && (
                            <Link key={rc.id} href={`/ch/${rc.id}`} className="ar-related__card">
                                <span className="ar-related__icon">{rc.icon}</span>
                                <span className="ar-related__name">{rc.title}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back to hub */}
            <div className="ar-page__back">
                <Link href="/ch" className="ar-page__back-link">
                    ← Alle Rechner anzeigen
                </Link>
            </div>
        </main>
    );
}

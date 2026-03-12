// Dynamic Turkish Calculator Page — /tr/[calculator]
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import TrCustomCalculatorCore from "@/components/tr/TrCustomCalculators";
import { TR_CALCULATORS, getTrCalculatorBySlug } from "@/data/tr-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export function generateStaticParams() {
    return TR_CALCULATORS.map((c) => ({ calculator: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getTrCalculatorBySlug(calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.subtitle,
        keywords: [calc.keyword, calc.title, "Türkiye", "hesaplayıcı"],
        alternates: { canonical: `${SITE_URL}/tr/${calc.id}` },
    };
}

export default async function TrCalculatorPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getTrCalculatorBySlug(calculator);
    if (!calc) return notFound();

    const relatedCalcs = (calc.relatedIds || [])
        .map((id) => TR_CALCULATORS.find((c) => c.id === id))
        .filter(Boolean);

    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.title,
            url: `${SITE_URL}/tr/${calc.id}`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            inLanguage: "tr",
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
            <Script id={`schema-tr-${calc.id}`} type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="Gezinti">
                <Link href="/tr">Hesaplayıcılar</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>{calc.title.split("—")[0].trim()}</span>
            </nav>

            <h1 className="ar-page__title">{calc.icon} {calc.title}</h1>
            <p className="ar-page__subtitle">{calc.subtitle}</p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <TrCustomCalculatorCore calcType={calc.calcType} />
                </div>
            </div>

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

            {calc.richSections && calc.richSections.length > 0 && (
                <div className="ar-rich-content">
                    {calc.richSections.map((section, i) => (
                        <section key={i} className="ar-rich-section">
                            <h2 className="ar-rich-section__heading">{section.heading}</h2>
                            {section.paragraphs?.map((p, j) => <p key={j} className="ar-rich-section__text">{p}</p>)}
                            {section.bullets && <ul className="ar-rich-section__bullets">{section.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
                            {section.table && (
                                <div className="ar-rich-section__table-wrap">
                                    <table className="ar-rich-section__table">
                                        <thead><tr>{section.table.headers.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
                                        <tbody>{section.table.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>)}</tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            )}

            <section className="ar-faq">
                <h2 className="ar-faq__title">Sıkça Sorulan Sorular — {calc.title.split("—")[0].trim()}</h2>
                {calc.faq.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            {relatedCalcs.length > 0 && (
                <section className="ar-related">
                    <h2 className="ar-related__title">🔗 İlgili Hesaplayıcılar</h2>
                    <div className="ar-related__grid">
                        {relatedCalcs.map((rc) => rc && (
                            <Link key={rc.id} href={`/tr/${rc.id}`} className="ar-related__card">
                                <span className="ar-related__icon">{rc.icon}</span>
                                <span className="ar-related__name">{rc.title.split("—")[0].trim()}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="ar-page__back">
                <Link href="/tr" className="ar-page__back-link">← Tüm Hesaplayıcılar</Link>
            </div>
        </main>
    );
}

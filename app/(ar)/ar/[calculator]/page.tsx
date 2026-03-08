// Dynamic Arabic Calculator Page — /ar/[calculator]
// Pre-renders all 24 Arabic calculator pages at build time

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import UtilityCalculatorCore from "@/components/calculator/UtilityCalculatorCore";
import ArCustomCalculatorCore from "@/components/ar/ArCustomCalculators";
import { AR_CALCULATORS, getArCalculatorBySlug } from "@/data/ar-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

// Pre-render all Arabic calculator pages
export function generateStaticParams() {
    return AR_CALCULATORS.map((c) => ({ calculator: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getArCalculatorBySlug(calculator);
    if (!calc) return {};
    return {
        title: calc.arabicTitle,
        description: calc.subtitle,
        keywords: [calc.arabicKeyword, calc.arabicTitle],
        alternates: { canonical: `${SITE_URL}/ar/${calc.id}` },
    };
}

export default async function ArCalculatorPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getArCalculatorBySlug(calculator);
    if (!calc) return notFound();

    // Related calculators
    const relatedCalcs = (calc.relatedIds || [])
        .map((id) => AR_CALCULATORS.find((c) => c.id === id))
        .filter(Boolean);

    // Structured data (WebApplication + FAQPage)
    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.arabicTitle,
            url: `${SITE_URL}/ar/${calc.id}`,
            applicationCategory: "FinanceApplication",
            operatingSystem: "All",
            inLanguage: "ar",
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
                id={`schema-ar-${calc.id}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            {/* Breadcrumb */}
            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>{calc.arabicTitle}</span>
            </nav>

            <h1 className="ar-page__title">
                {calc.icon} {calc.arabicTitle}
            </h1>
            <p className="ar-page__subtitle">{calc.subtitle}</p>

            {/* Calculator widget */}
            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    {calc.engine === "emi" ? (
                        <CalculatorCore
                            defaults={calc.defaults}
                            sliderRanges={calc.sliderRanges}
                            showComparison={false}
                        />
                    ) : calc.engine === "custom" ? (
                        <ArCustomCalculatorCore calcType={calc.calcType} />
                    ) : (
                        <UtilityCalculatorCore calcType={calc.calcType} />
                    )}
                </div>
            </div>

            {/* Arabic explanation */}
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
                <h2 className="ar-faq__title">أسئلة شائعة — {calc.arabicTitle}</h2>
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
                    <h2 className="ar-related__title">🔗 حاسبات ذات صلة</h2>
                    <div className="ar-related__grid">
                        {relatedCalcs.map((rc) => rc && (
                            <Link key={rc.id} href={`/ar/${rc.id}`} className="ar-related__card">
                                <span className="ar-related__icon">{rc.icon}</span>
                                <span className="ar-related__name">{rc.arabicTitle}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back to hub */}
            <div className="ar-page__back">
                <Link href="/ar" className="ar-page__back-link">
                    → العودة لجميع الحاسبات
                </Link>
            </div>
        </main>
    );
}

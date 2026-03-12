// Dynamic German Calculator Page — /de/[calculator]
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import DeCalculatorCore from "@/components/de/DeCalculatorCore";
import { DE_CALCULATORS, getDeCalculatorById } from "@/data/de-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps { params: Promise<{ calculator: string }>; }

export function generateStaticParams() {
    return DE_CALCULATORS.map((c) => ({ calculator: c.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getDeCalculatorById(calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.subtitle,
        keywords: [calc.keyword, calc.title, "Rechner", "Online"],
        alternates: { canonical: `${SITE_URL}/de/${calc.id}` },
    };
}

export default async function DeCalculatorPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getDeCalculatorById(calculator);
    if (!calc) return notFound();

    const relatedCalcs = (calc.relatedIds || [])
        .map((id) => DE_CALCULATORS.find((c) => c.id === id))
        .filter(Boolean);

    const schemaData = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: calc.title,
            url: `${SITE_URL}/de/${calc.id}`,
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            inLanguage: "de-DE",
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
                id={`schema-de-${calc.id}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <nav className="ar-breadcrumb" aria-label="Navigation">
                <Link href="/de">Rechner</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>{calc.title}</span>
            </nav>

            <h1 className="ar-page__title">{calc.icon} {calc.title}</h1>
            <p className="ar-page__subtitle">{calc.subtitle}</p>

            <div className="ar-page__calc-wrapper">
                <div className="ar-page__calc-main">
                    <DeCalculatorCore calcType={calc.calcType} />
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

            <section className="ar-faq">
                <h2 className="ar-faq__title">Häufig gestellte Fragen — {calc.title}</h2>
                {calc.faq.map((item, i) => (
                    <details key={i} className="ar-faq__item">
                        <summary className="ar-faq__question">{item.question}</summary>
                        <p className="ar-faq__answer">{item.answer}</p>
                    </details>
                ))}
            </section>

            {relatedCalcs.length > 0 && (
                <section className="ar-related">
                    <h2 className="ar-related__title">🔗 Verwandte Rechner</h2>
                    <div className="ar-related__grid">
                        {relatedCalcs.map((rc) => rc && (
                            <Link key={rc.id} href={`/de/${rc.id}`} className="ar-related__card">
                                <span className="ar-related__icon">{rc.icon}</span>
                                <span className="ar-related__name">{rc.title}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <div className="ar-page__back">
                <Link href="/de" className="ar-page__back-link">
                    ← Alle Rechner anzeigen
                </Link>
            </div>
        </main>
    );
}

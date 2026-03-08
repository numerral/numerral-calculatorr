// Arabic Guide Article — /ar/guides/[slug]
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { AR_GUIDES, getArGuideBySlug } from "@/data/ar-guides";
import { AR_CALCULATORS } from "@/data/ar-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
    return AR_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = getArGuideBySlug(slug);
    if (!guide) return {};
    return {
        title: guide.title,
        description: guide.description,
        alternates: { canonical: `${SITE_URL}/ar/guides/${guide.slug}` },
        openGraph: {
            images: [{ url: `/images/ar-guides/${guide.slug}.png`, width: 1024, height: 1024 }],
        },
    };
}

export default async function ArGuidePage({ params }: PageProps) {
    const { slug } = await params;
    const guide = getArGuideBySlug(slug);
    if (!guide) return notFound();

    const relatedCalcs = guide.relatedCalculators
        .map((id) => AR_CALCULATORS.find((c) => c.id === id))
        .filter(Boolean);

    const schemas = JSON.stringify([
        {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url: `${SITE_URL}/ar/guides/${guide.slug}`,
            inLanguage: "ar",
            publisher: { "@type": "Organization", name: "Numerral", url: SITE_URL },
            datePublished: "2026-03-09",
            dateModified: "2026-03-09",
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="ar-page">
            <Script id={`schema-ar-guide-${guide.slug}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemas }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <Link href="/ar/guides">المقالات</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>{guide.title.length > 40 ? guide.title.slice(0, 40) + "…" : guide.title}</span>
            </nav>

            <article className="ar-guide-article">
                {/* Header */}
                <header className="ar-guide-article__header">
                    <div className="ar-guide-article__meta">
                        <span className="ar-guide-article__badge">🕒 {guide.readTime}</span>
                        <span className="ar-guide-article__badge">{guide.icon} رياضيات</span>
                    </div>
                    <h1 className="ar-page__title">{guide.title}</h1>
                    <p className="ar-page__subtitle">{guide.description}</p>
                    <Image
                        src={`/images/ar-guides/${guide.slug}.png`}
                        alt={guide.title}
                        width={800}
                        height={450}
                        priority
                        className="ar-guide-article__image"
                    />
                </header>

                {/* Table of Contents */}
                <nav className="ar-guide-toc">
                    <p className="ar-guide-toc__title">📋 محتويات المقال</p>
                    <ol className="ar-guide-toc__list">
                        {guide.sections.map((s, i) => (
                            <li key={i}>
                                <a href={`#section-${i}`}>{s.heading}</a>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* Sections */}
                {guide.sections.map((section, i) => (
                    <section key={i} id={`section-${i}`} className="ar-guide-section">
                        <h2 className="ar-guide-section__heading">{section.heading}</h2>
                        <div className="ar-guide-section__content">
                            {section.content.split("\n\n").map((para, j) => {
                                if (para.includes("|") && para.includes("---")) {
                                    const lines = para.trim().split("\n").filter((l) => !l.match(/^\|[\s\-|]+\|$/));
                                    const headers = lines[0]?.split("|").map((h) => h.trim()).filter(Boolean);
                                    const rows = lines.slice(1).map((r) => r.split("|").map((c) => c.trim()).filter(Boolean));
                                    return (
                                        <div key={j} className="ar-rich-section__table-wrap">
                                            <table className="ar-rich-section__table">
                                                <thead><tr>{headers?.map((h, k) => <th key={k}>{h}</th>)}</tr></thead>
                                                <tbody>{rows.map((row, k) => <tr key={k}>{row.map((cell, l) => <td key={l}>{cell}</td>)}</tr>)}</tbody>
                                            </table>
                                        </div>
                                    );
                                }
                                if (para.match(/^[•\-]\s/m)) {
                                    const items = para.split("\n").filter((l) => l.trim());
                                    return (
                                        <ul key={j} className="ar-rich-section__bullets">
                                            {items.map((item, k) => (
                                                <li key={k} dangerouslySetInnerHTML={{
                                                    __html: item.replace(/^[•\-]\s*/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                }} />
                                            ))}
                                        </ul>
                                    );
                                }
                                return (
                                    <p key={j} className="ar-guide-section__text" dangerouslySetInnerHTML={{
                                        __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                    }} />
                                );
                            })}
                        </div>
                    </section>
                ))}

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

                {/* FAQ */}
                {guide.faq.length > 0 && (
                    <section className="ar-faq">
                        <h2 className="ar-faq__title">أسئلة شائعة</h2>
                        {guide.faq.map((item, i) => (
                            <details key={i} className="ar-faq__item">
                                <summary className="ar-faq__question">{item.question}</summary>
                                <p className="ar-faq__answer">{item.answer}</p>
                            </details>
                        ))}
                    </section>
                )}

                {/* Back */}
                <div className="ar-page__back">
                    <Link href="/ar/guides" className="ar-page__back-link">→ جميع المقالات</Link>
                </div>
            </article>
        </main>
    );
}

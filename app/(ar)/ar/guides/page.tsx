// Arabic Guides Hub — /ar/guides/
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { AR_GUIDES } from "@/data/ar-guides";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "مقالات ودلائل الرياضيات والنسب المئوية — نمررال",
    description: "دلائل ومقالات شاملة حول النسبة المئوية، الخصم، الربح، المتوسط الحسابي والمزيد — بأمثلة عملية وجداول مرجعية.",
    alternates: { canonical: `${SITE_URL}/ar/guides` },
};

export default function ArGuidesHubPage() {
    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "مقالات الرياضيات والنسب المئوية",
        url: `${SITE_URL}/ar/guides`,
        inLanguage: "ar",
    });

    return (
        <main className="ar-page">
            <Script id="schema-ar-guides" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <nav className="ar-breadcrumb" aria-label="مسار التنقل">
                <Link href="/ar">الرئيسية</Link>
                <span className="ar-breadcrumb__sep">/</span>
                <span>المقالات</span>
            </nav>

            <h1 className="ar-page__title">📚 مقالات ودلائل الرياضيات</h1>
            <p className="ar-page__subtitle">
                مقالات شاملة حول النسبة المئوية، الخصومات، الأرباح والمزيد — مع أمثلة عملية وجداول مرجعية جاهزة.
            </p>

            <div className="ar-guides-grid">
                {AR_GUIDES.map((guide) => (
                    <Link key={guide.slug} href={`/ar/guides/${guide.slug}`} className="ar-guide-card">
                        <Image
                            src={`/images/ar-guides/${guide.slug}.png`}
                            alt={guide.title}
                            width={640}
                            height={360}
                            className="ar-guide-card__image"
                        />
                        <div className="ar-guide-card__body">
                            <div className="ar-guide-card__icon-row">
                                <span className="ar-guide-card__icon">{guide.icon}</span>
                                <span className="ar-guide-card__title">{guide.title}</span>
                            </div>
                            <p className="ar-guide-card__desc">{guide.description}</p>
                            <div className="ar-guide-card__footer">
                                <span className="ar-guide-card__badge">🕒 {guide.readTime}</span>
                                <span className="ar-guide-card__sections">{guide.sections.length} أقسام</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="ar-page__back">
                <Link href="/ar" className="ar-page__back-link">→ العودة للرئيسية</Link>
            </div>
        </main>
    );
}

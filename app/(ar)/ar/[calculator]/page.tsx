// Dynamic Arabic Calculator Page — /ar/[calculator]
// Pre-renders all 10 Arabic calculator pages at build time

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import UtilityCalculatorCore from "@/components/calculator/UtilityCalculatorCore";
import { AR_CALCULATORS, getArCalculatorBySlug } from "@/data/ar-calculators";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

// Pre-render all 10 Arabic calculator pages
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

    // Structured data
    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: calc.arabicTitle,
        url: `${SITE_URL}/ar/${calc.id}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        inLanguage: "ar",
    });

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

            {/* Back to hub */}
            <div className="ar-page__back">
                <Link href="/ar" className="ar-page__back-link">
                    → العودة لجميع الحاسبات
                </Link>
            </div>
        </main>
    );
}

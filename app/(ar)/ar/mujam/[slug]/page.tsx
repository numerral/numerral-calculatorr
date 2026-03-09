// Arabic Glossary Term Detail — /ar/mujam/[slug]
// Matches English glossary design: Definition + Importance + Related Calculators + Related Terms
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { getAllArGlossaryTerms, getArGlossaryTermBySlug } from "@/lib/ar-glossary";
import { AR_CALCULATORS } from "@/data/ar-calculators";
import { SITE_URL } from "@/lib/constants";

export function generateStaticParams() {
    return getAllArGlossaryTerms().map(t => ({ slug: t.slug }));
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const term = getArGlossaryTermBySlug(slug);
    if (!term) return {};
    return {
        title: `${term.term} — معجم المصطلحات المالية | نمررال`,
        description: term.definition.slice(0, 160),
        alternates: { canonical: `${SITE_URL}/ar/mujam/${slug}` },
    };
}

const CATEGORY_META: Record<string, { label: string; color: string }> = {
    "قروض": { label: "قروض", color: "hsl(38, 80%, 60%)" },
    "استثمار": { label: "استثمار", color: "hsl(142, 60%, 55%)" },
    "ضرائب": { label: "ضرائب", color: "hsl(217, 70%, 65%)" },
    "راتب": { label: "راتب", color: "hsl(270, 60%, 65%)" },
    "عام": { label: "عام", color: "hsl(0, 60%, 65%)" },
};

export default async function ArMujamTermPage({ params }: Props) {
    const { slug } = await params;
    const term = getArGlossaryTermBySlug(slug);
    if (!term) notFound();

    const allTerms = getAllArGlossaryTerms();
    const catMeta = CATEGORY_META[term.category] ?? { label: term.category, color: "var(--n-primary)" };

    // Find related calculators from AR_CALCULATORS
    const relatedCalcs = (term.related ?? [])
        .map(id => AR_CALCULATORS.find(c => c.id === id))
        .filter(Boolean);

    // Find related glossary terms
    const relatedTermsData = (term.relatedTerms ?? [])
        .map(slug => allTerms.find(t => t.slug === slug))
        .filter(Boolean);

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: term.term,
        description: term.definition,
        url: `${SITE_URL}/ar/mujam/${slug}`,
        inLanguage: "ar",
        inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "معجم المصطلحات المالية العربية",
            url: `${SITE_URL}/ar/mujam`,
        },
    });

    return (
        <main className="ar-hub-v2 ar-mujam__detail" dir="rtl" style={{ maxWidth: "800px" }}>
            <Script id="schema-ar-term" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Breadcrumb */}
            <nav className="ar-mujam__breadcrumb">
                <Link href="/ar">الرئيسية</Link>
                <span>/</span>
                <Link href="/ar/mujam">المعجم</Link>
                <span>/</span>
                <span>{term.term.length > 30 ? term.term.slice(0, 30) + "…" : term.term}</span>
            </nav>

            {/* Header */}
            <header className="ar-mujam__detail-header">
                <span className="ar-mujam__detail-badge"
                    style={{ color: catMeta.color, borderColor: catMeta.color, background: `${catMeta.color}18` }}>
                    {catMeta.label}
                </span>
                <h1 className="ar-mujam__detail-title">{term.term}</h1>
            </header>

            {/* Definition */}
            <section className="ar-mujam__detail-section">
                <h2>التعريف</h2>
                <p className="ar-mujam__detail-text">{term.definition}</p>
            </section>

            {/* Importance */}
            {term.importance && (
                <section className="ar-mujam__detail-section">
                    <h2>لماذا يهمّك هذا المصطلح؟</h2>
                    <p className="ar-mujam__detail-text ar-mujam__detail-importance">{term.importance}</p>
                </section>
            )}

            {/* Formula */}
            {term.formula && (
                <section className="ar-mujam__detail-formula">
                    <h2>الصيغة الحسابية</h2>
                    <code className="ar-mujam__detail-code">{term.formula}</code>
                </section>
            )}

            {/* Related Calculators */}
            {relatedCalcs.length > 0 && (
                <section className="ar-mujam__detail-section">
                    <h2>🧮 الحاسبات ذات الصلة</h2>
                    <div className="ar-mujam__detail-links">
                        {relatedCalcs.map(calc => calc && (
                            <Link key={calc.id} href={`/ar/${calc.id}`} className="ar-mujam__detail-link">
                                {calc.icon} {calc.arabicTitle}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Related Terms */}
            {relatedTermsData.length > 0 && (
                <section className="ar-mujam__detail-section">
                    <h2>مصطلحات ذات صلة</h2>
                    <div className="ar-mujam__related-terms">
                        {relatedTermsData.map(t => t && (
                            <Link key={t.slug} href={`/ar/mujam/${t.slug}`} className="ar-mujam__related-link">
                                {t.term} →
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back */}
            <div className="ar-mujam__back-wrap">
                <Link href="/ar/mujam" className="ar-mujam__back-full">→ تصفح المعجم كاملاً</Link>
            </div>
        </main>
    );
}

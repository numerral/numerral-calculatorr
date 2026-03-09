// Arabic Glossary Hub — /ar/mujam
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getAllArGlossaryTerms } from "@/lib/ar-glossary";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "معجم المصطلحات المالية — 25 مصطلحاً مالياً معرّفاً بالعربية",
    description:
        "معجم شامل للمصطلحات المالية بالعربية: القسط الشهري، الفائدة المتناقصة، التمويل العقاري، العائد على الاستثمار، الزكاة، وأكثر. تعريفات واضحة وبسيطة.",
    alternates: { canonical: `${SITE_URL}/ar/mujam` },
};

const CATEGORY_META: Record<string, { label: string; color: string }> = {
    "قروض": { label: "قروض", color: "hsl(38, 80%, 60%)" },
    "استثمار": { label: "استثمار", color: "hsl(142, 60%, 55%)" },
    "ضرائب": { label: "ضرائب", color: "hsl(217, 70%, 65%)" },
    "راتب": { label: "راتب", color: "hsl(270, 60%, 65%)" },
    "عام": { label: "عام", color: "hsl(0, 60%, 65%)" },
};

export default function ArMujamPage() {
    const terms = getAllArGlossaryTerms();

    // Group by first Arabic letter
    const grouped = terms.reduce((acc, term) => {
        const letter = term.term[0];
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(term);
        return acc;
    }, {} as Record<string, typeof terms>);

    const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, "ar"));

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name: "معجم المصطلحات المالية العربية",
        description: "تعريفات لأهم المصطلحات المالية بالعربية",
        url: `${SITE_URL}/ar/mujam`,
        inLanguage: "ar",
        hasDefinedTerm: terms.map(t => ({
            "@type": "DefinedTerm",
            name: t.term,
            description: t.definition.slice(0, 200),
            url: `${SITE_URL}/ar/mujam/${t.slug}`,
        })),
    });

    return (
        <main className="ar-hub-v2" dir="rtl">
            <Script id="schema-ar-mujam" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Hero */}
            <section className="ar-hub-v2__hero">
                <Link href="/ar" className="ar-mujam__back">→ العودة إلى جميع الحاسبات</Link>
                <div className="ar-hub-v2__badge">📖 معجم مالي</div>
                <h1 className="ar-hub-v2__title">
                    معجم <span className="ar-hub-v2__accent">المصطلحات المالية</span>
                </h1>
                <p className="ar-hub-v2__subtitle">
                    {terms.length} مصطلحاً مالياً معرّفاً بالعربية — من القسط الشهري إلى الزكاة.
                    تعريفات واضحة لتفهم قراراتك المالية.
                </p>
                <div className="ar-hub-v2__stats">
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">{terms.length}</span><span className="ar-hub-v2__stat-label">مصطلح</span></div>
                    <div className="ar-hub-v2__stat"><span className="ar-hub-v2__stat-num">5</span><span className="ar-hub-v2__stat-label">فئات</span></div>
                </div>
            </section>

            {/* Category Legend */}
            <div className="ar-mujam__legend">
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <span key={key} className="ar-mujam__legend-item">
                        <span className="ar-mujam__legend-dot" style={{ background: meta.color }} />
                        {meta.label}
                    </span>
                ))}
            </div>

            {/* Letter Index */}
            <nav className="ar-mujam__nav">
                {letters.map(letter => (
                    <a key={letter} href={`#harf-${encodeURIComponent(letter)}`} className="ar-mujam__nav-letter">
                        {letter}
                    </a>
                ))}
            </nav>

            {/* Terms by Letter */}
            {letters.map(letter => (
                <section key={letter} id={`harf-${encodeURIComponent(letter)}`} className="ar-mujam__section">
                    <h2 className="ar-mujam__letter">{letter}</h2>
                    <div className="ar-mujam__terms">
                        {grouped[letter].map(term => (
                            <Link key={term.slug} href={`/ar/mujam/${term.slug}`} className="ar-mujam__term-card">
                                <span className="ar-mujam__term-bar"
                                    style={{ background: CATEGORY_META[term.category]?.color ?? "var(--n-primary)" }} />
                                <div className="ar-mujam__term-body">
                                    <span className="ar-mujam__term-name">{term.term}</span>
                                    <p className="ar-mujam__term-def">
                                        {term.definition.length > 140
                                            ? term.definition.slice(0, 140) + "…" : term.definition}
                                    </p>
                                </div>
                                <span className="ar-mujam__term-badge"
                                    style={{ color: CATEGORY_META[term.category]?.color }}>
                                    {CATEGORY_META[term.category]?.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}

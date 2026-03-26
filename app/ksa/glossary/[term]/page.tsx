// Dynamic KSA Glossary Term Page — /ksa/glossary/[term]/ (Server Component)
// Renders a single KSA-specific term with definition, Arabic translation, rich content, FAQ, and schema

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getAllKSAGlossaryTerms, getKSAGlossaryTermBySlug, getKSAGlossaryTermsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import "@/app/ksa/ksa.css";

interface PageProps {
    params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
    return getAllKSAGlossaryTerms().map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { term: slug } = await params;
    const term = getKSAGlossaryTermBySlug(slug);
    if (!term) return {};
    return {
        title: `${term.term} (${term.termAr}) — Definition & Meaning in Saudi Arabia`,
        description: term.definition.length > 155 ? term.definition.slice(0, 152) + "..." : term.definition,
        alternates: { canonical: canonicalUrl(`/ksa/glossary/${term.slug}`) },
    };
}

const categoryMeta: Record<string, { icon: string; label: string; color: string }> = {
    employment: { icon: "👷", label: "Employment & Labor", color: "#006a3c" },
    business: { icon: "🏢", label: "Business Registration", color: "#1a56db" },
    tax: { icon: "🧾", label: "Tax & Finance", color: "#7c3aed" },
    immigration: { icon: "🛂", label: "Immigration & Visas", color: "#dc2626" },
    banking: { icon: "🏦", label: "Islamic Banking", color: "#0891b2" },
};

export default async function KSAGlossaryTermPage({ params }: PageProps) {
    const { term: slug } = await params;
    const term = getKSAGlossaryTermBySlug(slug);
    if (!term) return notFound();

    const meta = categoryMeta[term.category] || { icon: "📖", label: term.category, color: "#006a3c" };

    // Related terms in same category (excluding current)
    const relatedTerms = getKSAGlossaryTermsByCategory(term.category)
        .filter((t) => t.slug !== term.slug)
        .slice(0, 6);

    // Related terms from other categories
    const crossTerms = getAllKSAGlossaryTerms()
        .filter((t) => t.category !== term.category && t.slug !== term.slug)
        .slice(0, 4);

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "KSA Calculators", url: canonicalUrl("/ksa") },
            { name: "Glossary", url: canonicalUrl("/ksa/glossary") },
            { name: term.term },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.definition,
            inDefinedTermSet: {
                "@type": "DefinedTermSet",
                name: "KSA Business & Employment Glossary",
                url: canonicalUrl("/ksa/glossary"),
            },
        },
        faqSchema([
            { question: `What is ${term.term}?`, answer: term.definition },
            ...term.faq,
        ]),
    ];

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-ksa-term"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "KSA Calculators", href: "/ksa" },
                    { label: "Glossary", href: "/ksa/glossary" },
                    { label: term.term },
                ]}
            />

            <article style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
                {/* Header */}
                <header style={{ marginBottom: "var(--s-6)" }}>
                    <span
                        className="result-highlight"
                        style={{
                            marginBottom: "var(--s-3)",
                            display: "inline-block",
                            background: `${meta.color}12`,
                            color: meta.color,
                            border: `1px solid ${meta.color}22`,
                        }}
                    >
                        {meta.icon} {meta.label}
                    </span>
                    <h1 className="t-h1" style={{ lineHeight: 1.3, marginBottom: "var(--s-2)" }}>
                        {term.term}
                    </h1>
                    <p
                        style={{
                            fontSize: "1.3rem",
                            color: "var(--n-text-muted)",
                            fontFamily: "'Noto Sans Arabic', sans-serif",
                            marginBottom: "var(--s-2)",
                        }}
                    >
                        {term.termAr}
                    </p>
                </header>

                {/* Definition */}
                <section style={{ marginBottom: "var(--s-8)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Definition</h2>
                    <p className="t-body" style={{ lineHeight: 1.8, color: "var(--n-text-secondary)" }}>
                        {term.definition}
                    </p>
                </section>

                {/* Why This Matters in KSA */}
                <section style={{ marginBottom: "var(--s-8)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>
                        Why {term.term} Matters in Saudi Arabia
                    </h2>
                    <div className="t-body" style={{ lineHeight: 1.8, color: "var(--n-text-secondary)" }}>
                        {term.category === "employment" && (
                            <p>
                                Understanding <strong>{term.term}</strong> is essential for any business operating in Saudi Arabia. The Kingdom&apos;s Vision 2030 economic transformation plan places heavy emphasis on labor market reform and nationalization. Companies that fail to comply with employment regulations face significant penalties including fines, service suspension, and visa blocks. Whether you are an HR manager, business owner, or employee, mastering this concept helps ensure compliance and operational continuity in the Saudi market.
                            </p>
                        )}
                        {term.category === "business" && (
                            <p>
                                For entrepreneurs and companies establishing a presence in Saudi Arabia, <strong>{term.term}</strong> is a foundational concept. The Kingdom has streamlined its business registration processes under Vision 2030, making it easier than ever for both local and foreign businesses to set up operations. Understanding this term helps navigate the regulatory landscape, avoid costly delays, and take advantage of new business-friendly reforms.
                            </p>
                        )}
                        {term.category === "tax" && (
                            <p>
                                <strong>{term.term}</strong> is a critical component of Saudi Arabia&apos;s fiscal framework managed by ZATCA. With the introduction of 15% VAT in 2020, enhanced e-invoicing requirements (Fatoorah), and ongoing Zakat compliance, businesses must understand these financial concepts to remain compliant. Proper knowledge of this term helps optimize tax planning and avoid penalties that can significantly impact your bottom line.
                            </p>
                        )}
                        {term.category === "immigration" && (
                            <p>
                                For the 10+ million expatriates living and working in Saudi Arabia, understanding <strong>{term.term}</strong> is crucial for daily life and legal compliance. The Kingdom&apos;s immigration system has undergone significant reforms since 2021, including the Labor Reform Initiative that grants workers greater mobility. Staying informed about this concept helps expatriates maintain legal status, plan travel, and protect their rights.
                            </p>
                        )}
                        {term.category === "banking" && (
                            <p>
                                Saudi Arabia&apos;s financial system is built on Islamic banking principles, making <strong>{term.term}</strong> a fundamental concept for anyone seeking financing, investing, or conducting business in the Kingdom. All Saudi banks operate under Sharia compliance as regulated by SAMA, and understanding these structures helps you choose the right financial products, compare offerings, and make informed decisions about loans, savings, and investments.
                            </p>
                        )}
                    </div>
                </section>

                {/* Rich Content */}
                {term.contentHTML && (
                    <section className="calc-card" style={{ marginBottom: "var(--s-8)", padding: "var(--s-6)" }}>
                        <div className="ksa-content" dangerouslySetInnerHTML={{ __html: term.contentHTML }} />
                    </section>
                )}

                {/* Related KSA Calculator */}
                <section style={{ marginBottom: "var(--s-8)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🔗 Related KSA Calculator</h2>
                    <Link
                        href={term.relatedCalc}
                        className="calc-card"
                        style={{
                            textDecoration: "none",
                            padding: "var(--s-5)",
                            display: "flex",
                            alignItems: "center",
                            gap: "var(--s-4)",
                            borderLeft: `4px solid ${meta.color}`,
                        }}
                    >
                        <span style={{ fontSize: "1.75rem" }}>🇸🇦</span>
                        <div>
                            <span className="t-h4" style={{ fontWeight: 700, color: "var(--n-text)" }}>
                                Use the {term.term} Calculator →
                            </span>
                            <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-1)" }}>
                                Free online tool — calculate instantly with the latest 2025/2026 rules
                            </p>
                        </div>
                    </Link>
                </section>

                {/* Related Terms (Same Category) */}
                {relatedTerms.length > 0 && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                            Related {meta.label} Terms
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "var(--s-3)",
                            }}
                        >
                            {relatedTerms.map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/ksa/glossary/${t.slug}`}
                                    style={{
                                        padding: "var(--s-3)",
                                        background: "var(--n-surface)",
                                        border: `1px solid ${meta.color}22`,
                                        borderRadius: "var(--r-sm)",
                                        textDecoration: "none",
                                        color: meta.color,
                                        fontWeight: 600,
                                        fontSize: "var(--t-body-sm)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "2px",
                                    }}
                                >
                                    <span>{t.term} →</span>
                                    <span style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", fontWeight: 400 }}>
                                        {t.termAr}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Cross-Category Terms */}
                {crossTerms.length > 0 && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                            Other KSA Terms You Should Know
                        </h2>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                                gap: "var(--s-3)",
                            }}
                        >
                            {crossTerms.map((t) => {
                                const tMeta = categoryMeta[t.category];
                                return (
                                    <Link
                                        key={t.slug}
                                        href={`/ksa/glossary/${t.slug}`}
                                        style={{
                                            padding: "var(--s-3)",
                                            background: "var(--n-surface)",
                                            border: `1px solid var(--n-border)`,
                                            borderRadius: "var(--r-sm)",
                                            textDecoration: "none",
                                            color: tMeta?.color || "var(--n-primary)",
                                            fontWeight: 600,
                                            fontSize: "var(--t-body-sm)",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "2px",
                                        }}
                                    >
                                        <span>{t.term} →</span>
                                        <span style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", fontWeight: 400 }}>
                                            {t.termAr}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {term.faq && term.faq.length > 0 && (
                    <FAQAccordion title={`${term.term} — Frequently Asked Questions`} items={term.faq} />
                )}

                {/* Back links */}
                <div
                    style={{
                        display: "flex",
                        gap: "var(--s-6)",
                        justifyContent: "center",
                        padding: "var(--s-6) 0 var(--s-8)",
                        flexWrap: "wrap",
                    }}
                >
                    <Link href="/ksa/glossary" style={{ color: "#006a3c", fontWeight: 600 }}>
                        ← Browse KSA Glossary
                    </Link>
                    <Link href="/ksa" style={{ color: "#006a3c", fontWeight: 600 }}>
                        🇸🇦 KSA Calculators Hub
                    </Link>
                </div>
            </article>
        </main>
    );
}

// Dynamic Glossary Term Page — /glossary/[term]/ (Server Component)
// Renders a single financial term with definition, formula, related calculators, and schema

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getAllGlossaryTerms, getGlossaryTermBySlug, getCalculatorById, getGlossaryTermsByCategory, getGuidesByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ term: string }>;
}

export async function generateStaticParams() {
    return getAllGlossaryTerms().map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { term: slug } = await params;
    const term = getGlossaryTermBySlug(slug);
    if (!term) return {};
    return {
        title: `${term.term} — Definition, Formula & Meaning`,
        description: term.definition.length > 155 ? term.definition.slice(0, 152) + "..." : term.definition,
        alternates: { canonical: canonicalUrl(`/glossary/${term.slug}`) },
    };
}

export default async function GlossaryTermPage({ params }: PageProps) {
    const { term: slug } = await params;
    const term = getGlossaryTermBySlug(slug);
    if (!term) return notFound();

    const relatedCalcs = term.related
        .map((id) => getCalculatorById(id))
        .filter(Boolean);

    // Get related terms in the same category (excluding current)
    const relatedTerms = getGlossaryTermsByCategory(term.category)
        .filter((t) => t.slug !== term.slug)
        .slice(0, 6);

    // Get related guides
    const relatedGuides = getGuidesByCategory(term.category);

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Glossary", url: canonicalUrl("/glossary") },
            { name: term.term },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.definition,
            inDefinedTermSet: {
                "@type": "DefinedTermSet",
                name: "Numerral Financial Glossary",
                url: canonicalUrl("/glossary"),
            },
        },
        faqSchema([
            { question: `What is ${term.term}?`, answer: term.definition },
            ...(term.formula ? [{ question: `What is the formula for ${term.term}?`, answer: `The formula is: ${term.formula}` }] : []),
            ...(term.faq ? term.faq.map((f: { question: string; answer: string }) => ({ question: f.question, answer: f.answer })) : []),
        ]),
    ];

    const categoryLabels: Record<string, string> = {
        loan: "🏦 Loans",
        invest: "📈 Investment",
        tax: "🧾 Tax",
        utility: "⚡ Utility",
        construction: "🏗️ Construction",
        health: "💊 Health",
        electrical: "⚡ Electrical",
        math: "📐 Math",
        physics: "🔬 Physics",
        chemistry: "🧪 Chemistry",
        ev: "🔋 EV",
        business: "💼 Business",
    };

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-term"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Glossary", href: "/glossary" },
                    { label: term.term },
                ]}
            />

            <article style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
                {/* Header */}
                <header style={{ marginBottom: "var(--s-6)" }}>
                    <span className="result-highlight" style={{ marginBottom: "var(--s-3)", display: "inline-block" }}>
                        {categoryLabels[term.category] ?? term.category}
                    </span>
                    <h1 className="t-h1" style={{ lineHeight: 1.3, marginBottom: "var(--s-3)" }}>
                        {term.term}
                    </h1>
                </header>

                {/* Definition */}
                <section style={{ marginBottom: "var(--s-8)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Definition</h2>
                    <p className="t-body" style={{ lineHeight: 1.8, color: "var(--n-text-secondary)" }}>
                        {term.definition}
                    </p>
                </section>

                {/* Significance (Dynamic SEO Expansion) */}
                <section style={{ marginBottom: "var(--s-8)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Why is {term.term} Important?</h2>
                    <div className="t-body" style={{ lineHeight: 1.8, color: "var(--n-text-secondary)" }}>
                        {term.category === "loan" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    When applying for a loan in India—whether it&apos;s a home loan, personal loan, or car loan—the concept of <strong>{term.term}</strong> plays a significant role in determining your total borrowing cost. Lenders use factors like this to assess credit risk, determine eligibility, and structure your EMI schedule. Understanding this term helps borrowers negotiate better interest rates, choose the right loan product, and save money over the loan tenure.
                                </p>
                                <p>
                                    For accurate financial planning, it is highly recommended to use our free online calculators to see how {term.term} impacts your specific scenario. Real-time calculations provide clarity on monthly outgoes, principal vs. interest components, and long-term financial burdens.
                                </p>
                            </>
                        )}
                        {term.category === "tax" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    Navigating the Indian tax system requires a clear understanding of terms like <strong>{term.term}</strong>. With the introduction of the new income tax regime alongside the old one, taxpayers must evaluate their deductions, exemptions, and tax brackets carefully. This concept is a key component in optimizing your tax liabilities under the Income Tax Act and GST framework.
                                </p>
                                <p>
                                    Proper tax planning using this metric can help individuals and businesses maximize their take-home income while remaining fully compliant with government regulations. We provide free tax calculators to help you estimate these figures accurately and make informed decisions before filing your returns.
                                </p>
                            </>
                        )}
                        {term.category === "invest" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    In the context of wealth creation and investing in India, <strong>{term.term}</strong> is a fundamental concept. Whether you are investing in mutual funds via SIPs, fixed deposits, or retirement schemes like PPF and NPS, this metric helps evaluate potential returns and risks. The power of compounding and market volatility make it essential to track this indicator for any long-term portfolio.
                                </p>
                                <p>
                                    Investors are encouraged to use specific investment calculators to project the future value of their corpus. Understanding this term enables better asset allocation, inflation protection, and consistent progress toward your ultimate financial goals.
                                </p>
                            </>
                        )}
                        {term.category === "utility" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    In everyday personal finance and mathematical computations, understanding <strong>{term.term}</strong> helps you make quick, informed decisions. Whether you are calculating discounts during a sale, determining health metrics, or figuring out percentage changes, this concept is universally applicable.
                                </p>
                                <p>
                                    Using automated calculators for these metrics eliminates human error and provides instant results, allowing you to focus on the underlying financial or personal health decisions rather than manual arithmetic.
                                </p>
                            </>
                        )}
                        {term.category === "construction" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    For homeowners, contractors, and DIY builders across the United States, understanding <strong>{term.term}</strong> is essential to accurate material estimation and cost planning. Whether you are pouring a concrete driveway, framing a deck, or calculating roofing materials, mastering this concept helps prevent costly over-ordering or project delays from material shortages.
                                </p>
                                <p>
                                    Our free construction calculators leverage this concept to provide instant, accurate estimates — saving hours of manual measurement and arithmetic while ensuring your project stays on budget.
                                </p>
                            </>
                        )}
                        {term.category === "health" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    Understanding <strong>{term.term}</strong> empowers you to take control of your personal health and wellness. Whether you are tracking body composition, planning nutrition, or evaluating fitness metrics, this concept provides the foundation for making informed health decisions backed by science.
                                </p>
                                <p>
                                    Our health calculators make these metrics accessible and easy to compute, giving you instant, evidence-based results so you can focus on achieving your wellness goals rather than crunching numbers.
                                </p>
                            </>
                        )}
                        {term.category === "electrical" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    In electrical engineering and everyday applications, <strong>{term.term}</strong> is a fundamental concept for understanding how electrical systems work. Whether you are an engineer designing circuits, an electrician sizing wires, or a homeowner estimating energy costs, this metric is essential for safety, efficiency, and accurate calculations.
                                </p>
                                <p>
                                    Our electrical conversion calculators help you quickly convert between units and verify calculations, reducing errors and saving time in both professional and DIY electrical work.
                                </p>
                            </>
                        )}
                        {term.category === "math" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    <strong>{term.term}</strong> is a foundational mathematical concept used across science, engineering, finance, and everyday problem-solving. From analyzing data sets to optimizing business decisions, this concept provides the analytical framework needed to interpret quantitative information accurately.
                                </p>
                                <p>
                                    Our math calculators make complex computations simple and accessible, providing step-by-step results that help students, professionals, and curious minds explore mathematical relationships with confidence.
                                </p>
                            </>
                        )}
                        {term.category === "physics" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    <strong>{term.term}</strong> is a core physics concept that describes the fundamental behavior of matter and energy. Understanding this principle enables engineers, students, and scientists to design better systems, solve real-world problems, and predict physical phenomena with precision.
                                </p>
                                <p>
                                    Our physics calculators make it easy to compute values related to this concept, bridging the gap between theoretical understanding and practical application in engineering, education, and research.
                                </p>
                            </>
                        )}
                        {term.category === "chemistry" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    <strong>{term.term}</strong> is an essential chemistry concept used in laboratories, pharmaceutical development, environmental science, and industrial processes. Understanding this concept is critical for accurate chemical calculations, safe laboratory practices, and optimizing reactions.
                                </p>
                                <p>
                                    Our chemistry calculators provide instant, accurate results for complex conversions and calculations, making lab work more efficient and reducing the risk of errors in critical measurements.
                                </p>
                            </>
                        )}
                        {term.category === "ev" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    As electric vehicles transform transportation across the United States, understanding <strong>{term.term}</strong> is essential for making informed EV ownership decisions. Whether you are comparing models, planning road trips, or evaluating long-term savings, this concept directly impacts your EV experience and total cost of ownership.
                                </p>
                                <p>
                                    Our EV calculators help you quantify these factors, enabling confident comparisons between electric and gas vehicles and optimizing your charging strategy for maximum efficiency and savings.
                                </p>
                            </>
                        )}
                        {term.category === "business" && (
                            <>
                                <p style={{ marginBottom: "var(--s-3)" }}>
                                    <strong>{term.term}</strong> is a critical concept in corporate finance, business analysis, and investment decision-making. Whether you are evaluating a company&apos;s performance, assessing an investment opportunity, or running your own business, understanding this metric helps you make data-driven decisions that maximize returns and minimize risk.
                                </p>
                                <p>
                                    Our business calculators provide instant computations for this metric, empowering entrepreneurs, analysts, and investors to evaluate financial health and make strategic decisions with confidence.
                                </p>
                            </>
                        )}
                    </div>
                </section>

                {/* Rich Content (contentHTML) */}
                {term.contentHTML && (
                    <section className="calc-card" style={{ marginBottom: "var(--s-8)", padding: "var(--s-6)" }}>
                        <div className="hub-content" dangerouslySetInnerHTML={{ __html: term.contentHTML }} />
                    </section>
                )}

                {/* Formula */}
                {term.formula && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Formula</h2>
                        <div style={{
                            padding: "var(--s-5)",
                            background: "var(--n-surface)",
                            border: "1px solid var(--n-border)",
                            borderRadius: "var(--r-md)",
                            fontFamily: "var(--t-mono)",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "var(--n-primary)",
                            textAlign: "center",
                            letterSpacing: "0.02em",
                        }}>
                            {term.formula}
                        </div>
                    </section>
                )}

                {/* Related Calculators */}
                {relatedCalcs.length > 0 && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🔗 Related Calculators</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-3)" }}>
                            {relatedCalcs.map((calc) => calc && (
                                <Link
                                    key={calc.id}
                                    href={`/${calc.categorySlug}/${calc.slug}`}
                                    className="calc-card"
                                    style={{
                                        textDecoration: "none",
                                        padding: "var(--s-4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--s-3)",
                                        flex: "1 1 200px",
                                    }}
                                >
                                    <span style={{ fontSize: "1.5rem" }}>{calc.icon}</span>
                                    <span className="t-body" style={{ fontWeight: 600, color: "var(--n-text)" }}>
                                        {calc.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Guides */}
                {relatedGuides.length > 0 && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📚 Related Guides</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                            {relatedGuides.slice(0, 3).map((guide) => (
                                <Link
                                    key={guide.slug}
                                    href={`/guides/${guide.slug}`}
                                    className="calc-card"
                                    style={{
                                        textDecoration: "none",
                                        padding: "var(--s-4)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "var(--s-3)",
                                    }}
                                >
                                    <span style={{ fontSize: "1.3rem" }}>{guide.icon}</span>
                                    <div>
                                        <span className="t-body" style={{ fontWeight: 600, color: "var(--n-text)" }}>
                                            {guide.title}
                                        </span>
                                        <span className="t-caption text-muted" style={{ marginLeft: "var(--s-3)" }}>
                                            🕒 {guide.readTime}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Terms */}
                {relatedTerms.length > 0 && (
                    <section style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>Related Terms</h2>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "var(--s-3)",
                        }}>
                            {relatedTerms.map((t) => (
                                <Link
                                    key={t.slug}
                                    href={`/glossary/${t.slug}`}
                                    style={{
                                        padding: "var(--s-3)",
                                        background: "var(--n-surface)",
                                        border: "1px solid var(--n-border)",
                                        borderRadius: "var(--r-sm)",
                                        textDecoration: "none",
                                        color: "var(--n-primary)",
                                        fontWeight: 600,
                                        fontSize: "var(--t-body-sm)",
                                        display: "block",
                                    }}
                                >
                                    {t.term} →
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ */}
                {term.faq && term.faq.length > 0 && (
                    <FAQAccordion title={`${term.term} — Frequently Asked Questions`} items={term.faq} />
                )}

                {/* Back link */}
                <div style={{ textAlign: "center", padding: "var(--s-6) 0 var(--s-8)" }}>
                    <Link
                        href="/glossary"
                        style={{
                            color: "var(--n-primary)",
                            fontWeight: 600,
                        }}
                    >
                        ← Browse Full Glossary
                    </Link>
                </div>
            </article>
        </main>
    );
}

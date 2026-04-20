// Individual Author Profile — /authors/[slug]
// Investopedia-quality profile with photo, credentials, bio, and articles list

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { getAllAuthors, getAuthorBySlug, CALC_AUTHOR_MAP } from "@/data/authors";
import { getCalculatorsByCategory } from "@/lib/data";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const author = getAuthorBySlug(slug);
    if (!author) return {};
    return {
        title: `${author.name} — ${author.title} | ${SITE_NAME}`,
        description: `${author.name} is a ${author.title} at Numerral. ${author.summary[0]}`,
        alternates: { canonical: canonicalUrl(`/authors/${author.slug}`) },
    };
}

// Map category keys to display names and URL prefixes
const CATEGORY_INFO: Record<string, { label: string; prefix: string }> = {
    // Finance & Business
    loan:         { label: "Loan Calculators",             prefix: "/loan-calculators" },
    invest:       { label: "Investment Calculators",        prefix: "/investment-calculators" },
    tax:          { label: "Tax Calculators",               prefix: "/tax-calculators" },
    salary:       { label: "Salary Calculators",            prefix: "/salary-calculators" },
    business:     { label: "Business Calculators",          prefix: "/business-calculators" },
    vehicle:      { label: "Vehicle Loan Calculators",      prefix: "/vehicle-loan-calculators" },
    // Science & Engineering
    physics:      { label: "Physics Calculators",           prefix: "/physics-calculators" },
    chemistry:    { label: "Chemistry Calculators",         prefix: "/chemistry-calculators" },
    density:      { label: "Density Calculators",           prefix: "/density-calculators" },
    electrical:   { label: "Electrical Calculators",        prefix: "/electrical-calculators" },
    math:         { label: "Math Calculators",              prefix: "/math-calculators" },
    construction: { label: "Construction Calculators",      prefix: "/construction-calculators" },
    // Health & Lifestyle
    health:       { label: "Health Calculators",            prefix: "/health-calculators" },
    pet:          { label: "Pet Calculators",               prefix: "/pet-calculators" },
    cooking:      { label: "Cooking & Baking Calculators",  prefix: "/cooking-calculators" },
    // Utility & Time
    utility:      { label: "Utility Calculators",           prefix: "/utility-calculators" },
    time:         { label: "Time & Date Calculators",       prefix: "/time-calculators" },
    // Automotive
    ev:           { label: "EV Calculators",                prefix: "/ev-calculators" },
    engine:       { label: "Engine & Performance Calculators", prefix: "/automotive-calculators/engine-performance" },
    fuel:         { label: "Fuel Economy Calculators",      prefix: "/automotive-calculators/fuel-economy" },
    wheels:       { label: "Wheels & Tires Calculators",    prefix: "/automotive-calculators/wheels-tires" },
};

function getArticlesForAuthor(authorSlug: string, role: string) {
    const articles: { title: string; href: string; category: string }[] = [];

    for (const [catKey, mapping] of Object.entries(CALC_AUTHOR_MAP)) {
        const isAssigned =
            (role === "Writer" && mapping.writer === authorSlug) ||
            (role === "Reviewer" && mapping.reviewer === authorSlug) ||
            (role === "Fact Checker" && mapping.factChecker === authorSlug);

        if (!isAssigned) continue;

        const catInfo = CATEGORY_INFO[catKey];
        if (!catInfo) continue;

        const calcs = getCalculatorsByCategory(catKey as never);
        for (const calc of calcs) {
            articles.push({
                title: calc.title,
                href: `${catInfo.prefix}/${calc.slug}`,
                category: catInfo.label,
            });
        }
    }

    return articles;
}

export default async function AuthorProfilePage({ params }: PageProps) {
    const { slug } = await params;
    const author = getAuthorBySlug(slug);
    if (!author) return notFound();

    const articles = getArticlesForAuthor(author.slug, author.role);

    const roleLabel =
        author.role === "Writer" ? "Written" :
            author.role === "Reviewer" ? "Reviewed" : "Fact Checked";

    // JSON-LD Person schema
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        jobTitle: author.title,
        worksFor: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
        url: canonicalUrl(`/authors/${author.slug}`),
        image: `${SITE_URL}${author.image}`,
        sameAs: author.linkedin ? [author.linkedin] : [],
        knowsAbout: author.expertise,
        alumniOf: author.education.map((edu) => ({
            "@type": "EducationalOrganization",
            name: edu,
        })),
    };

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Our Team", url: canonicalUrl("/authors") },
            { name: author.name },
        ]),
        personSchema,
    ]);

    return (
        <main className="container author-profile">
            <Script
                id="schema-author"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Our Team", href: "/authors" },
                    { label: author.name },
                ]}
            />

            {/* ── Header: Photo + Credentials ── */}
            <div className="author-profile__header">
                <div className="author-profile__photo-col">
                    <Image
                        src={author.image}
                        alt={author.name}
                        width={220}
                        height={220}
                        className="author-profile__photo"
                        priority
                    />
                    {author.linkedin && (
                        <div className="author-profile__social">
                            <a
                                href={author.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="author-profile__social-link"
                                aria-label={`${author.name} on LinkedIn`}
                            >
                                in
                            </a>
                        </div>
                    )}
                </div>

                <div className="author-profile__info">
                    <h1 className="author-profile__name">{author.name}</h1>

                    {author.location && (
                        <div className="author-profile__field">
                            <span className="author-profile__field-label">Resides In</span>
                            <span className="author-profile__field-value">{author.location}</span>
                        </div>
                    )}

                    <div className="author-profile__field">
                        <span className="author-profile__field-label">Education</span>
                        <span className="author-profile__field-value">
                            {author.education.join(", ")}
                        </span>
                    </div>

                    <div className="author-profile__field">
                        <span className="author-profile__field-label">Expertise</span>
                        <span className="author-profile__field-value">
                            {author.expertise.join(", ")}
                        </span>
                    </div>

                    {author.companyInfo && (
                        <div className="author-profile__field">
                            <span className="author-profile__field-label">Company Info</span>
                            <span className="author-profile__field-value">
                                {author.companyInfo.url ? (
                                    <Link href={author.companyInfo.url}>
                                        {author.companyInfo.name}
                                    </Link>
                                ) : (
                                    author.companyInfo.name
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Summary ── */}
            <section className="author-profile__summary">
                <h2>Summary</h2>
                <ul>
                    {author.summary.map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </section>

            {/* ── Full Bio ── */}
            <section className="author-profile__bio">
                {author.bio.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </section>

            {/* ── Articles ── */}
            {articles.length > 0 && (
                <section className="author-profile__articles">
                    <h2>Calculators {roleLabel} by {author.name}</h2>
                    <div className="author-profile__articles-grid">
                        {articles.map((article) => (
                            <Link
                                key={article.href}
                                href={article.href}
                                className="author-profile__article-card"
                            >
                                <span className="author-profile__article-category">
                                    {article.category}
                                </span>
                                <span className="author-profile__article-title">
                                    {article.title}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

// Guides Hub — /guides/ (Server Component)
// Lists all financial guides organized by category

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { getAllGuides, getAllCategories } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Financial Guides — Expert Insights on Loans, Tax & Investments",
    description:
        "In-depth financial guides covering home loans, SIP vs FD, income tax, EMI formulas, and more. Expert-written, easy to understand, and always free.",
    alternates: { canonical: canonicalUrl("/guides") },
};

export default function GuidesHubPage() {
    const guides = getAllGuides();
    const categories = getAllCategories();

    // Group guides by category
    const grouped = categories.reduce((acc, cat) => {
        const catGuides = guides.filter((g) => g.category === cat.key);
        if (catGuides.length) acc.push({ ...cat, guides: catGuides });
        return acc;
    }, [] as (typeof categories[number] & { guides: typeof guides })[]);

    const schemaData = JSON.stringify(
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Financial Guides" },
        ])
    );

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-guides"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Financial Guides" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                📚 Financial Guides
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)", maxWidth: "var(--w-narrow)" }}>
                Expert-written guides to help you make smarter financial decisions. Deep dives into loans, investments, taxes, and more — with real examples and calculator links.
            </p>

            {grouped.map((group) => (
                <section key={group.key} style={{ marginBottom: "var(--s-10)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                        {group.icon} {group.name} Guides
                    </h2>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "var(--s-5)",
                    }}>
                        {group.guides.map((guide) => (
                            <Link
                                key={guide.slug}
                                href={`/guides/${guide.slug}`}
                                className="calc-card"
                                style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "var(--s-3)", overflow: "hidden", padding: 0 }}
                            >
                                <Image
                                    src={`/images/guides/${guide.slug}.png`}
                                    alt={guide.title}
                                    width={640}
                                    height={360}
                                    style={{ width: "100%", height: "auto", borderRadius: "var(--r-md) var(--r-md) 0 0" }}
                                />
                                <div style={{ padding: "var(--s-4)", display: "flex", flexDirection: "column", gap: "var(--s-3)", flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)" }}>
                                        <span style={{ fontSize: "1.5rem" }}>{guide.icon}</span>
                                        <span className="t-h4" style={{ fontWeight: 600, color: "var(--n-text)" }}>
                                            {guide.title}
                                        </span>
                                    </div>
                                    <p className="t-body-sm text-muted" style={{ lineHeight: 1.5 }}>
                                        {guide.description}
                                    </p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)", marginTop: "auto" }}>
                                        <span className="result-highlight">
                                            🕒 {guide.readTime}
                                        </span>
                                        <span className="t-caption text-muted">
                                            {guide.sections.length} sections
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}

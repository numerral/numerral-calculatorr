// Our Editorial Team — /authors/
// Lists all team members with photo, role badge, expertise tags

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getAllAuthors, type Author } from "@/data/authors";

export const metadata: Metadata = {
    title: "Our Editorial Team — Meet the Experts Behind Numerral",
    description:
        "Meet the financial experts, reviewers, and fact checkers who build and verify every calculator and guide on Numerral. Our team ensures accuracy, transparency, and editorial integrity.",
    alternates: { canonical: canonicalUrl("/authors") },
};

function roleClass(role: Author["role"]): string {
    switch (role) {
        case "Writer":
        case "Editor":
            return "team-card__role--writer";
        case "Reviewer":
            return "team-card__role--reviewer";
        case "Fact Checker":
            return "team-card__role--factchecker";
        default:
            return "";
    }
}

export default function AuthorsPage() {
    const authors = getAllAuthors();

    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Our Team" },
        ]),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", paddingBottom: "var(--s-12)" }}>
            <Script
                id="schema-team"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />

            <div style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
                <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>
                    Our Editorial Team
                </h1>
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-2)", lineHeight: 1.7 }}>
                    Every calculator, formula, and financial explanation on Numerral goes through a rigorous
                    three-step editorial process — written by subject-matter experts, reviewed by qualified
                    financial professionals, and fact-checked against authoritative primary sources.
                </p>
                <p className="t-body-sm" style={{ marginBottom: "var(--s-6)" }}>
                    <Link href="/editorial-policy" style={{ fontWeight: 600 }}>
                        Read our Editorial Policy →
                    </Link>
                </p>
            </div>

            <div className="team-grid" style={{ maxWidth: "var(--w-max)", margin: "0 auto" }}>
                {authors.map((author) => (
                    <Link
                        key={author.slug}
                        href={`/authors/${author.slug}`}
                        className="team-card"
                    >
                        <Image
                            src={author.image}
                            alt={author.name}
                            width={120}
                            height={120}
                            className="team-card__photo"
                        />
                        <h2 className="team-card__name">{author.name}</h2>
                        <span className={`team-card__role ${roleClass(author.role)}`}>
                            {author.role}
                        </span>
                        <p className="team-card__title">{author.title}</p>
                        <div className="team-card__expertise">
                            {author.expertise.slice(0, 4).map((tag) => (
                                <span key={tag} className="team-card__tag">{tag}</span>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

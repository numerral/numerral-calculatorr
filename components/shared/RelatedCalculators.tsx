// RelatedCalculators — Contextual calculator links for topical authority
// Server component

import Link from "next/link";

interface RelatedCalc {
    title: string;
    slug: string;
    categorySlug: string;
    description: string;
}

interface RelatedCalculatorsProps {
    title?: string;
    calculators: RelatedCalc[];
}

export default function RelatedCalculators({ title = "Related Calculators", calculators }: RelatedCalculatorsProps) {
    if (!calculators || calculators.length === 0) return null;

    return (
        <section className="related-calcs">
            <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🔗 {title}</h2>
            <div className="related-calcs__grid">
                {calculators.map((calc, i) => (
                    <Link
                        key={i}
                        href={`/${calc.categorySlug}/${calc.slug}`}
                        className="related-calcs__card"
                    >
                        <span className="related-calcs__title">{calc.title}</span>
                        <span className="related-calcs__desc">{calc.description}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

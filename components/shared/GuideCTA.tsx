// GuideCTA — Shows linked guide cards for a calculator
// Server component

import Link from "next/link";
import { getLinkedGuides } from "@/lib/data";

interface GuideCTAProps {
    calcId: string;
}

export default function GuideCTA({ calcId }: GuideCTAProps) {
    const guides = getLinkedGuides(calcId);
    if (guides.length === 0) return null;

    return (
        <section className="guide-cta">
            <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📖 Recommended Guides</h2>
            <div className="guide-cta__grid">
                {guides.map((g) => (
                    <Link key={g.slug} href={`/guides/${g.slug}`} className="guide-cta__card">
                        <span className="guide-cta__title">{g.title}</span>
                        <span className="guide-cta__meta">{g.readTime} read</span>
                        <span className="guide-cta__desc">{g.description}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

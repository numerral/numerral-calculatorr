// GlossaryChip — Compact glossary term link for a calculator
// Server component

import Link from "next/link";
import { getLinkedGlossary } from "@/lib/data";

interface GlossaryChipProps {
    calcId: string;
}

export default function GlossaryChip({ calcId }: GlossaryChipProps) {
    const term = getLinkedGlossary(calcId);
    if (!term) return null;

    return (
        <section className="glossary-chip">
            <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>📘 Key Term</h2>
            <Link href={`/glossary/${term.slug}`} className="glossary-chip__card">
                <span className="glossary-chip__term">{term.term}</span>
                <span className="glossary-chip__def">{term.definition}</span>
                <span className="glossary-chip__cta">Read full definition →</span>
            </Link>
        </section>
    );
}

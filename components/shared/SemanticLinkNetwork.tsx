// SemanticLinkNetwork.tsx
// Renders semantically described internal links that help search engines understand
// the topical relationships between calculator pages.
// Per Koray Tuğberk methodology: anchor text must describe the relationship,
// not just repeat the tool name.

import Link from "next/link";

interface SemanticLink {
    href: string;
    relationshipLabel: string; // e.g. "Calculate the full amortization breakdown for"
    toolName: string; // e.g. "your home loan"
    description?: string; // Optional 1-line benefit statement
}

interface SemanticLinkNetworkProps {
    heading?: string;
    intro?: string;
    links: SemanticLink[];
}

export default function SemanticLinkNetwork({
    heading = "Explore Related Calculations",
    intro,
    links,
}: SemanticLinkNetworkProps) {
    if (!links || links.length === 0) return null;

    return (
        <section className="semantic-link-network" aria-labelledby="semantic-network-heading">
            <h2 id="semantic-network-heading" className="t-h2" style={{ marginBottom: "var(--s-3)" }}>
                {heading}
            </h2>
            {intro && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-4)" }}>
                    {intro}
                </p>
            )}
            <ul className="semantic-link-network__list" role="list">
                {links.map((link, i) => (
                    <li key={i} className="semantic-link-network__item">
                        <Link
                            href={link.href}
                            className="semantic-link-network__link"
                            aria-label={`${link.relationshipLabel} ${link.toolName}`}
                        >
                            <span className="semantic-link-network__arrow" aria-hidden="true">→</span>
                            <span className="semantic-link-network__text">
                                <span className="semantic-link-network__relation">{link.relationshipLabel}</span>{" "}
                                <span className="semantic-link-network__tool">{link.toolName}</span>
                            </span>
                        </Link>
                        {link.description && (
                            <p className="semantic-link-network__desc">{link.description}</p>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

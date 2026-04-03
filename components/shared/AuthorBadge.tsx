// AuthorBadge — EEAT attribution strip
// Displayed below H1 on every calculator hub page

import Link from "next/link";
import { getCategoryAuthors } from "@/data/authors";

interface AuthorBadgeProps {
    categoryKey: string;
    updatedDate?: string;  // ISO date string; defaults to current
}

export default function AuthorBadge({ categoryKey, updatedDate }: AuthorBadgeProps) {
    const { writer, reviewer, factChecker } = getCategoryAuthors(categoryKey);
    if (!writer && !reviewer && !factChecker) return null;

    const displayDate = updatedDate
        ? new Date(updatedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <div 
            role="contentinfo" 
            aria-label="Article attribution"
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.25rem",
                background: "var(--n-surface-alt)",
                border: "1px solid var(--n-border)",
                borderLeft: "4px solid #3b82f6",
                borderRadius: "0.5rem",
                fontSize: "0.82rem",
                color: "var(--n-foreground)",
                opacity: 0.9,
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
            }}
        >
            {writer && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ color: "var(--n-foreground-muted)" }}>By</span>
                    <Link href={`/authors/${writer.slug}`} style={{ fontWeight: 600, color: "var(--n-foreground)", textDecoration: "none" }}>
                        {writer.name.toUpperCase()}
                    </Link>
                    <span style={{ color: "var(--n-border)", marginLeft: "0.15rem", marginRight: "0.15rem" }}>•</span>
                    <span style={{ color: "var(--n-foreground-muted)" }}>Updated {displayDate}</span>
                </div>
            )}
            
            {reviewer && (
                <>
                  <span style={{ color: "var(--n-border)", margin: "0 0.25rem" }}>|</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{ color: "var(--n-foreground-muted)" }}>Reviewed by</span>
                      <Link href={`/authors/${reviewer.slug}`} style={{ fontWeight: 600, color: "var(--n-foreground)", textDecoration: "none" }}>
                          {reviewer.name.toUpperCase()}
                      </Link>
                  </div>
                </>
            )}
            
            {factChecker && (
                <>
                  <span style={{ color: "var(--n-border)", margin: "0 0.25rem" }}>|</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <span style={{ color: "var(--n-foreground-muted)" }}>Fact checked by</span>
                      <Link href={`/authors/${factChecker.slug}`} style={{ fontWeight: 600, color: "var(--n-foreground)", textDecoration: "none" }}>
                          {factChecker.name.toUpperCase()}
                      </Link>
                  </div>
                </>
            )}
        </div>
    );
}

// AuthorBadge — EEAT attribution strip
// "By AUTHOR · Updated DATE / Reviewed by REVIEWER / Fact checked by FACT_CHECKER"
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
        <div className="author-badge" role="contentinfo" aria-label="Article attribution">
            {writer && (
                <div className="author-badge__line">
                    <span className="author-badge__label">By</span>
                    <Link href={`/authors/${writer.slug}`} className="author-badge__name">
                        {writer.name.toUpperCase()}
                    </Link>
                    <span className="author-badge__date">Updated {displayDate}</span>
                </div>
            )}
            {reviewer && (
                <div className="author-badge__line">
                    <span className="author-badge__label">Reviewed by</span>
                    <Link href={`/authors/${reviewer.slug}`} className="author-badge__name">
                        {reviewer.name.toUpperCase()}
                    </Link>
                </div>
            )}
            {factChecker && (
                <div className="author-badge__line">
                    <span className="author-badge__label">Fact checked by</span>
                    <Link href={`/authors/${factChecker.slug}`} className="author-badge__name">
                        {factChecker.name.toUpperCase()}
                    </Link>
                </div>
            )}
        </div>
    );
}

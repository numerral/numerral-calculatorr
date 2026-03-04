// RelatedCalculations — Server component
// Auto-generates internal links from variants.json (deterministic, sorted by amount)

import Link from "next/link";
import { type RelatedItem } from "@/lib/types";
import { getRelatedAmounts } from "@/lib/data";

interface RelatedCalculationsProps {
    /** Calculator type ID — if provided, auto-generates items from variants.json */
    calculatorId?: string;
    /** Manual items override (takes precedence over calculatorId) */
    items?: RelatedItem[];
    /** Slug of the currently active page (highlighted) */
    activeSlug?: string;
    /** Base URL prefix for links */
    baseUrl?: string;
    /** Maximum number of items to show */
    limit?: number;
    /** Section heading */
    heading?: string;
    /** Suffix after label text (defaults to "EMI" for loan pages) */
    linkSuffix?: string;
}

export default function RelatedCalculations({
    calculatorId,
    items,
    activeSlug,
    baseUrl = "/loan-calculators/car-loan-emi",
    limit,
    heading = "Related Calculations",
    linkSuffix = "EMI",
}: RelatedCalculationsProps) {
    // Resolve items: manual override > auto from variants.json
    let resolvedItems: RelatedItem[];

    if (items) {
        resolvedItems = items;
    } else if (calculatorId) {
        resolvedItems = getRelatedAmounts(calculatorId);
    } else {
        return null;
    }

    // Apply limit if set
    if (limit && limit > 0) {
        resolvedItems = resolvedItems.slice(0, limit);
    }

    if (resolvedItems.length === 0) return null;

    return (
        <section className="related-calc">
            <h3>{heading}</h3>
            <div className="related-calc__list">
                {resolvedItems.map((item) => {
                    const isActive = item.slug === activeSlug;
                    return (
                        <Link
                            key={item.slug}
                            href={`${baseUrl}/${item.slug}`}
                            className={`related-calc__item${isActive ? " active" : ""}`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {item.label}{linkSuffix ? ` ${linkSuffix}` : ""}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

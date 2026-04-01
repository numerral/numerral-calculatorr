"use client";
/**
 * PageDesc — Mobile-optimised page description wrapper.
 * On desktop: full text visible. On mobile (≤768px): clamped to 2 lines
 * with a "Read more / Show less" toggle. Full text stays in DOM for SEO.
 *
 * Usage:
 *   <PageDesc>
 *     Free HRA Exemption Calculator with 4 modes…
 *   </PageDesc>
 */
import { ReactNode, useId } from "react";

export default function PageDesc({ children }: { children: ReactNode }) {
    const id = useId();
    return (
        <div className="in-page-desc">
            <input type="checkbox" id={id} className="in-page-desc__toggle" />
            <p className="t-body text-muted">{children}</p>
            <label htmlFor={id} className="in-page-desc__btn" />
        </div>
    );
}

// Breadcrumb — Server component

import Link from "next/link";
import { type BreadcrumbItem } from "@/lib/types";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol className="breadcrumb__list">
                {items.map((item, i) => {
                    const isLast = i === items.length - 1;
                    return (
                        <li key={i} className={`breadcrumb__item${isLast ? " breadcrumb__item--current" : ""}`}>
                            {i > 0 && (
                                <svg className="breadcrumb__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                            {item.href && !isLast ? (
                                <Link href={item.href} className="breadcrumb__link">{item.label}</Link>
                            ) : (
                                <span className="breadcrumb__current" aria-current={isLast ? "page" : undefined}>{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

// Breadcrumb — Server component

import Link from "next/link";
import { type BreadcrumbItem } from "@/lib/types";

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" style={{ marginBottom: "var(--s-4)" }}>
            {items.map((item, i) => (
                <span key={i}>
                    {i > 0 && <span> › </span>}
                    {item.href ? (
                        <Link href={item.href}>{item.label}</Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

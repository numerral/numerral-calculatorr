// TrendingCalculations — Server component with styled sidebar

import Link from "next/link";
import { getTrendingItems } from "@/lib/data";

interface TrendingCalculationsProps {
    variant?: "sidebar" | "full";
}

export default function TrendingCalculations({ variant = "sidebar" }: TrendingCalculationsProps) {
    const items = getTrendingItems();

    return (
        <div className="trending">
            <h3>🔥 Trending Calculators</h3>
            <div className="trending__list">
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="trending__item"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// CategoryGrid — Server component
// Data sourced from: categories.json → lib/data.ts

import Link from "next/link";
import { getCategories, type CategoryDef } from "@/lib/data";
import { type CategoryKey } from "@/lib/types";

interface CategoryGridProps {
    exclude?: CategoryKey[];
}

export default function CategoryGrid({ exclude = [] }: CategoryGridProps) {
    const categories = getCategories(exclude);

    return (
        <div className="category-grid">
            {categories.map((cat: CategoryDef) => (
                <Link
                    key={cat.key}
                    href={cat.href}
                    className="category-card"
                    data-cat={cat.key}
                >
                    <div className="category-card__icon">{cat.icon}</div>
                    <div className="category-card__body">
                        <h3>{cat.name}</h3>
                        <p>{cat.description}</p>
                        <span className="category-card__count">{cat.count} Calculators →</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

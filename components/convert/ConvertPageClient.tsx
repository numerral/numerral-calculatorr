"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ──────────────────────────────────────── */
/*  Types                                  */
/* ──────────────────────────────────────── */

interface ConverterItem {
    id: string;
    title: string;
    slug: string;
    icon: string;
    description: string;
    calcType?: string;
}

interface ConvertPageClientProps {
    converters: ConverterItem[];
}

/* ──────────────────────────────────────── */
/*  Category definitions                   */
/* ──────────────────────────────────────── */

interface CategoryGroup {
    key: string;
    label: string;
    emoji: string;
    color: string;     // hsl accent for the category
    ids: string[];
}

const CATEGORIES: CategoryGroup[] = [
    {
        key: "cooking",
        label: "Cooking & Baking",
        emoji: "🍳",
        color: "hsl(24, 85%, 52%)",
        ids: [
            "ml-to-gram-converter", "gram-to-ml-converter", "gram-to-cup-converter",
            "tbsp-to-gram-converter", "gram-to-tsp-converter", "tsp-to-cup-converter",
            "butter-tsp-to-gram-converter", "cup-to-gram-converter", "gram-flour-to-cup-converter",
            "cup-butter-to-gram-converter", "floz-to-ml-converter", "oz-to-ml-converter",
            "gal-to-lb-converter",
        ],
    },
    {
        key: "weight",
        label: "Weight & Mass",
        emoji: "⚖️",
        color: "hsl(262, 65%, 52%)",
        ids: [
            "stone-to-kg-converter", "kg-to-stone-converter", "cal-to-kg-converter",
            "mg-to-ml-converter", "ml-to-mg-converter",
        ],
    },
    {
        key: "volume",
        label: "Volume & Liquid",
        emoji: "🧪",
        color: "hsl(200, 72%, 48%)",
        ids: [
            "liter-to-kg-converter", "kg-to-liter-converter", "gram-to-liter-converter",
            "liter-to-gram-converter", "cc-to-m3-converter",
        ],
    },
    {
        key: "length",
        label: "Length & Area",
        emoji: "📏",
        color: "hsl(152, 60%, 42%)",
        ids: [
            "inch-to-cm-converter", "inch-to-foot-converter", "sqm-to-sqft-converter", "sqft-to-sqm-converter", "sqmi-to-sqkm-converter",
            "inlb-to-ftlb-converter",
        ],
    },
    {
        key: "temperature",
        label: "Temperature",
        emoji: "🌡️",
        color: "hsl(0, 72%, 52%)",
        ids: ["f-to-c-converter", "c-to-f-converter", "f-to-k-converter", "c-to-k-converter"],
    },
    {
        key: "time",
        label: "Time",
        emoji: "⏱️",
        color: "hsl(210, 70%, 50%)",
        ids: ["min-to-hour-converter", "sec-to-min-converter", "day-to-month-converter"],
    },
    {
        key: "speed",
        label: "Speed & Motion",
        emoji: "🚀",
        color: "hsl(340, 65%, 50%)",
        ids: ["mph-to-kmh-converter", "rpm-to-rads-converter"],
    },
    {
        key: "electrical",
        label: "Electrical & Energy",
        emoji: "⚡",
        color: "hsl(45, 85%, 48%)",
        ids: [
            "kiloohm-to-ohm-converter", "megaohm-to-ohm-converter", "ohm-to-kiloohm-converter",
            "mmbtu-to-mwh-converter", "mwh-to-kwh-converter", "kcal-to-cal-converter",
        ],
    },
    {
        key: "fuel",
        label: "Fuel Economy",
        emoji: "⛽",
        color: "hsl(168, 60%, 40%)",
        ids: ["l100km-to-mpg-converter", "mpg-to-l100km-converter", "kml-to-mpg-converter", "mpg-to-kml-converter"],
    },
    {
        key: "angle",
        label: "Angle",
        emoji: "📐",
        color: "hsl(280, 60%, 55%)",
        ids: ["deg-to-rad-converter", "rad-to-deg-converter", "deg-to-mrad-converter", "mrad-to-deg-converter", "angle-converters"],
    },
];

/* ──────────────────────────────────────── */
/*  Icons                                  */
/* ──────────────────────────────────────── */

const SEARCH_ICON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
);

const ARROW_RIGHT = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);

/* ──────────────────────────────────────── */
/*  Helpers                                */
/* ──────────────────────────────────────── */

function getShortTitle(title: string): string {
    // Extract the parenthetical label, e.g., "(mL to g)" or use cleaned title
    const m = title.match(/\(([^)]+)\)/);
    return m ? m[1] : title.replace(/ Converter.*$/, "");
}

/* ──────────────────────────────────────── */
/*  Component                              */
/* ──────────────────────────────────────── */

export default function ConvertPageClient({ converters }: ConvertPageClientProps) {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const converterMap = useMemo(() => {
        const map = new Map<string, ConverterItem>();
        for (const c of converters) map.set(c.id, c);
        return map;
    }, [converters]);

    const lowerSearch = search.toLowerCase().trim();

    // When searching, filter across all categories
    // When a category is active, show only that category
    const visibleCategories = useMemo(() => {
        let cats = CATEGORIES;

        if (activeCategory) {
            cats = cats.filter((c) => c.key === activeCategory);
        }

        if (lowerSearch) {
            cats = cats.map((cat) => ({
                ...cat,
                ids: cat.ids.filter((id) => {
                    const c = converterMap.get(id);
                    if (!c) return false;
                    return (
                        c.title.toLowerCase().includes(lowerSearch) ||
                        c.description.toLowerCase().includes(lowerSearch) ||
                        getShortTitle(c.title).toLowerCase().includes(lowerSearch)
                    );
                }),
            })).filter((cat) => cat.ids.length > 0);
        }

        return cats;
    }, [lowerSearch, activeCategory, converterMap]);

    const totalVisible = visibleCategories.reduce((sum, c) => sum + c.ids.length, 0);

    return (
        <>
            {/* ── Search Bar ── */}
            <div className="convert-search-wrap">
                <span className="convert-search-wrap__icon">{SEARCH_ICON}</span>
                <input
                    id="convert-search"
                    type="text"
                    className="convert-search-wrap__input"
                    placeholder="Search converters — e.g. mL to grams, Fahrenheit, inches…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                />
                {search && (
                    <button
                        className="convert-search-wrap__clear"
                        onClick={() => setSearch("")}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* ── Category Dashboard ── */}
            <section className="cvt-dashboard" style={{ marginBottom: "var(--s-8)" }}>
                <div className="cvt-dashboard__grid">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.key}
                            className={`cvt-cat-chip ${activeCategory === cat.key ? "cvt-cat-chip--active" : ""}`}
                            onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                            style={{ "--cat-accent": cat.color } as React.CSSProperties}
                        >
                            <span className="cvt-cat-chip__emoji">{cat.emoji}</span>
                            <span className="cvt-cat-chip__label">{cat.label}</span>
                            <span className="cvt-cat-chip__count">{cat.ids.length}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Converter Card Grid ── */}
            <section style={{ marginBottom: "var(--s-10)" }}>
                {visibleCategories.map((cat) => {
                    const originalCat = CATEGORIES.find((c) => c.key === cat.key);
                    return (
                        <div key={cat.key} className="cvt-section">
                            {/* Section header shown when not filtering to single category */}
                            {!activeCategory && (
                                <div className="cvt-section__header">
                                    <span className="cvt-section__emoji">{originalCat?.emoji}</span>
                                    <h2 className="cvt-section__title">{cat.label}</h2>
                                </div>
                            )}
                            <div className="cvt-card-grid">
                                {cat.ids.map((id) => {
                                    const c = converterMap.get(id);
                                    if (!c) return null;
                                    const shortTitle = getShortTitle(c.title);
                                    const fullLabel = c.title.replace(/ Converter.*$/, "");
                                    return (
                                        <Link
                                            key={id}
                                            href={`/convert/${c.slug}`}
                                            className="cvt-card"
                                        >
                                            <div className="cvt-card__top">
                                                <span className="cvt-card__short">{shortTitle}</span>
                                                <span className="cvt-card__arrow">{ARROW_RIGHT}</span>
                                            </div>
                                            <span className="cvt-card__full">{fullLabel}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {totalVisible === 0 && lowerSearch && (
                    <div className="convert-empty">
                        <p>No converters found for &ldquo;{search}&rdquo;</p>
                        <button className="convert-empty__btn" onClick={() => { setSearch(""); setActiveCategory(null); }}>
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}

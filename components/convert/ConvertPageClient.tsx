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
    shortLabel?: string;
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
    svgIcon: React.ReactNode;
    ids: string[];          // converter IDs belonging here
    popularIds: string[];   // top 4 to show in popular grid
}

const SEARCH_ICON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const CHEVRON_RIGHT = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

const CHEVRON_DOWN = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

/* SVG Icons for each category */
const ICON_COOKING = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" />
        <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" /><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
    </svg>
);

const ICON_WEIGHT = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.23A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.46A2 2 0 0 0 17.48 8Z" />
    </svg>
);

const ICON_LENGTH = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
        <path d="m14.5 12.5 2-2" /><path d="m11.5 9.5 2-2" /><path d="m8.5 6.5 2-2" /><path d="m17.5 15.5 2-2" />
    </svg>
);

const ICON_VOLUME = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" /><path d="M7 16h10" />
    </svg>
);

const ICON_TEMP = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
);

const ICON_TIME = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
    </svg>
);

const ICON_SPEED = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M13.45 11.55l2.05-2.05" />
        <path d="M6.4 20a9 9 0 1 1 11.2 0H6.4" />
    </svg>
);

const ICON_ELECTRICAL = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

const ICON_FUEL = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" x2="15" y1="22" y2="22" /><line x1="4" x2="14" y1="9" y2="9" />
        <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
        <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
    </svg>
);

const ICON_ANGLE = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 19H5V5" /><path d="M5 19 5.9 6.7a1 1 0 0 1 1-.7h2.2a1 1 0 0 1 1 .7L17 19" />
    </svg>
);

const CATEGORIES: CategoryGroup[] = [
    {
        key: "cooking",
        label: "Cooking & Baking",
        svgIcon: ICON_COOKING,
        ids: [
            "ml-to-gram-converter", "gram-to-ml-converter", "gram-to-cup-converter",
            "tbsp-to-gram-converter", "gram-to-tsp-converter", "tsp-to-cup-converter",
            "butter-tsp-to-gram-converter", "cup-to-gram-converter", "gram-flour-to-cup-converter",
            "cup-butter-to-gram-converter", "floz-to-ml-converter", "oz-to-ml-converter",
            "gal-to-lb-converter",
        ],
        popularIds: ["ml-to-gram-converter", "gram-to-cup-converter", "tbsp-to-gram-converter", "cup-to-gram-converter"],
    },
    {
        key: "weight",
        label: "Weight & Mass",
        svgIcon: ICON_WEIGHT,
        ids: [
            "stone-to-kg-converter", "kg-to-stone-converter", "cal-to-kg-converter",
            "mg-to-ml-converter", "ml-to-mg-converter",
        ],
        popularIds: ["stone-to-kg-converter", "kg-to-stone-converter", "mg-to-ml-converter", "cal-to-kg-converter"],
    },
    {
        key: "volume",
        label: "Volume & Liquid",
        svgIcon: ICON_VOLUME,
        ids: [
            "liter-to-kg-converter", "kg-to-liter-converter", "gram-to-liter-converter",
            "liter-to-gram-converter", "cc-to-m3-converter",
        ],
        popularIds: ["liter-to-kg-converter", "kg-to-liter-converter", "gram-to-liter-converter", "cc-to-m3-converter"],
    },
    {
        key: "length",
        label: "Length & Area",
        svgIcon: ICON_LENGTH,
        ids: [
            "inch-to-cm-converter", "inch-to-foot-converter", "sqm-to-sqft-converter",
            "inlb-to-ftlb-converter",
        ],
        popularIds: ["inch-to-cm-converter", "inch-to-foot-converter", "sqm-to-sqft-converter", "inlb-to-ftlb-converter"],
    },
    {
        key: "temperature",
        label: "Temperature",
        svgIcon: ICON_TEMP,
        ids: ["f-to-c-converter", "c-to-f-converter", "f-to-k-converter", "c-to-k-converter"],
        popularIds: ["f-to-c-converter", "c-to-f-converter", "f-to-k-converter", "c-to-k-converter"],
    },
    {
        key: "time",
        label: "Time",
        svgIcon: ICON_TIME,
        ids: ["min-to-hour-converter", "sec-to-min-converter", "day-to-month-converter"],
        popularIds: ["min-to-hour-converter", "sec-to-min-converter", "day-to-month-converter"],
    },
    {
        key: "speed",
        label: "Speed & Motion",
        svgIcon: ICON_SPEED,
        ids: ["mph-to-kmh-converter", "rpm-to-rads-converter"],
        popularIds: ["mph-to-kmh-converter", "rpm-to-rads-converter"],
    },
    {
        key: "electrical",
        label: "Electrical & Energy",
        svgIcon: ICON_ELECTRICAL,
        ids: [
            "kiloohm-to-ohm-converter", "megaohm-to-ohm-converter", "ohm-to-kiloohm-converter",
            "mmbtu-to-mwh-converter", "mwh-to-kwh-converter", "kcal-to-cal-converter",
        ],
        popularIds: ["kiloohm-to-ohm-converter", "mwh-to-kwh-converter", "kcal-to-cal-converter", "megaohm-to-ohm-converter"],
    },
    {
        key: "fuel",
        label: "Fuel Economy",
        svgIcon: ICON_FUEL,
        ids: ["l100km-to-mpg-converter", "mpg-to-l100km-converter", "kml-to-mpg-converter", "mpg-to-kml-converter"],
        popularIds: ["l100km-to-mpg-converter", "mpg-to-l100km-converter", "kml-to-mpg-converter", "mpg-to-kml-converter"],
    },
    {
        key: "angle",
        label: "Angle",
        svgIcon: ICON_ANGLE,
        ids: ["deg-to-rad-converter", "rad-to-deg-converter", "deg-to-mrad-converter", "mrad-to-deg-converter", "angle-converters"],
        popularIds: ["deg-to-rad-converter", "rad-to-deg-converter", "deg-to-mrad-converter", "angle-converters"],
    },
];

/* ──────────────────────────────────────── */
/*  Short label helper (extract parens)    */
/* ──────────────────────────────────────── */
function getShortLabel(title: string): string {
    const m = title.match(/\(([^)]+)\)/);
    if (m) return m[1];
    // fallback: strip "Converter" etc.
    return title.replace(/ Converter$/, "").replace(/ Calculator$/, "");
}

/* ──────────────────────────────────────── */
/*  Component                              */
/* ──────────────────────────────────────── */

export default function ConvertPageClient({ converters }: ConvertPageClientProps) {
    const [search, setSearch] = useState("");
    const [openSections, setOpenSections] = useState<Set<string>>(
        () => new Set(CATEGORIES.map((c) => c.key))
    );

    // Build a lookup map
    const converterMap = useMemo(() => {
        const map = new Map<string, ConverterItem>();
        for (const c of converters) map.set(c.id, c);
        return map;
    }, [converters]);

    // Filter by search
    const lowerSearch = search.toLowerCase().trim();

    const filteredCategories = useMemo(() => {
        if (!lowerSearch) return CATEGORIES;
        return CATEGORIES.map((cat) => ({
            ...cat,
            ids: cat.ids.filter((id) => {
                const c = converterMap.get(id);
                if (!c) return false;
                return (
                    c.title.toLowerCase().includes(lowerSearch) ||
                    c.description.toLowerCase().includes(lowerSearch) ||
                    (c.calcType || "").toLowerCase().includes(lowerSearch) ||
                    getShortLabel(c.title).toLowerCase().includes(lowerSearch)
                );
            }),
        })).filter((cat) => cat.ids.length > 0);
    }, [lowerSearch, converterMap]);

    const toggleSection = (key: string) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

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

            {/* ── Category Accordion Sections ── */}
            <section className="convert-categories" style={{ marginBottom: "var(--s-10)" }}>
                {filteredCategories.map((cat) => {
                    const isOpen = openSections.has(cat.key);
                    // Find the original category for the icon
                    const originalCat = CATEGORIES.find((c) => c.key === cat.key);
                    return (
                        <div key={cat.key} className={`convert-accordion ${isOpen ? "convert-accordion--open" : ""}`}>
                            <button
                                className="convert-accordion__header"
                                onClick={() => toggleSection(cat.key)}
                                aria-expanded={isOpen}
                            >
                                <span className="convert-accordion__icon">{originalCat?.svgIcon}</span>
                                <span className="convert-accordion__title">{cat.label}</span>
                                <span className="convert-accordion__count">{cat.ids.length}</span>
                                <span className={`convert-accordion__chevron ${isOpen ? "convert-accordion__chevron--open" : ""}`}>
                                    {CHEVRON_DOWN}
                                </span>
                            </button>
                            {isOpen && (
                                <div className="convert-accordion__body">
                                    {cat.ids.map((id) => {
                                        const c = converterMap.get(id);
                                        if (!c) return null;
                                        return (
                                            <Link
                                                key={id}
                                                href={`/convert/${c.slug}`}
                                                className="convert-link"
                                            >
                                                <span className="convert-link__text">
                                                    {c.title.replace(/ Converter.*$/, "")}
                                                </span>
                                                <span className="convert-link__chevron">{CHEVRON_RIGHT}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
                {filteredCategories.length === 0 && lowerSearch && (
                    <div className="convert-empty">
                        <p>No converters found for &ldquo;{search}&rdquo;</p>
                        <button className="convert-empty__btn" onClick={() => setSearch("")}>
                            Clear search
                        </button>
                    </div>
                )}
            </section>

            {/* ── Popular Converters Grid ── */}
            {!lowerSearch && (
                <section style={{ marginBottom: "var(--s-10)" }}>
                    <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Popular Converters</h2>
                    <div className="convert-popular-grid">
                        {CATEGORIES.map((cat) => (
                            <div key={cat.key} className="convert-popular-card">
                                <div className="convert-popular-card__header">
                                    <span className="convert-popular-card__icon">{cat.svgIcon}</span>
                                    <span className="convert-popular-card__label">{cat.label}</span>
                                </div>
                                <div className="convert-popular-card__links">
                                    {cat.popularIds.map((id) => {
                                        const c = converterMap.get(id);
                                        if (!c) return null;
                                        return (
                                            <Link key={id} href={`/convert/${c.slug}`} className="convert-popular-link">
                                                <span>{getShortLabel(c.title)}</span>
                                                <span className="convert-popular-link__chevron">{CHEVRON_RIGHT}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}

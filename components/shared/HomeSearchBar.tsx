"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface CalcItem {
    title: string;
    slug: string;
    categorySlug: string;
    icon: string;
    description: string;
}

export default function HomeSearchBar({ calculators }: { calculators: CalcItem[] }) {
    const [query, setQuery] = useState("");
    const [focused, setFocused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const results = query.length >= 2
        ? calculators
              .filter(
                  (c) =>
                      c.title.toLowerCase().includes(query.toLowerCase()) ||
                      c.description.toLowerCase().includes(query.toLowerCase())
              )
              .slice(0, 6)
        : [];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setFocused(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="hp-search" ref={wrapperRef}>
            <div className={`hp-search__box ${focused ? "hp-search__box--focus" : ""}`}>
                <svg
                    className="hp-search__icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    className="hp-search__input"
                    placeholder="Search for a calculator..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    aria-label="Search calculators"
                    id="homepage-search"
                />
                {query && (
                    <button
                        className="hp-search__clear"
                        onClick={() => { setQuery(""); }}
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            {focused && results.length > 0 && (
                <div className="hp-search__dropdown">
                    {results.map((calc) => (
                        <Link
                            key={calc.slug}
                            href={`/${calc.categorySlug}/${calc.slug}`}
                            className="hp-search__result"
                            onClick={() => { setFocused(false); setQuery(""); }}
                        >
                            <span className="hp-search__result-icon">{calc.icon}</span>
                            <div className="hp-search__result-body">
                                <span className="hp-search__result-title">{calc.title}</span>
                                <span className="hp-search__result-cat">{calc.categorySlug.replace(/-/g, " ")}</span>
                            </div>
                            <span className="hp-search__result-arrow">→</span>
                        </Link>
                    ))}
                </div>
            )}

            {focused && query.length >= 2 && results.length === 0 && (
                <div className="hp-search__dropdown">
                    <div className="hp-search__no-results">
                        No calculators found for &ldquo;{query}&rdquo;
                    </div>
                </div>
            )}
        </div>
    );
}

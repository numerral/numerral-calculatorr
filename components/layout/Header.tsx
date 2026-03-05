// Header — Premium navigation with mega dropdown & mobile menu
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const categories = [
    { key: "loan", name: "Loan Calculators", icon: "🏠", href: "/loan-calculators", desc: "EMI, eligibility & repayment" },
    { key: "invest", name: "Investment Calculators", icon: "📈", href: "/investment-calculators", desc: "SIP, FD, mutual funds" },
    { key: "tax", name: "Tax Calculators", icon: "🧾", href: "/tax-calculators", desc: "Income tax, GST, HRA" },
    { key: "utility", name: "Utility Calculators", icon: "⚡", href: "/utility-calculators", desc: "Age, percentage, BMI" },
];

const resources = [
    { name: "Financial Guides", href: "/guides", icon: "📚" },
    { name: "Financial Glossary", href: "/glossary", icon: "📖" },
];

export default function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        const saved = localStorage.getItem("numerral-theme") as "light" | "dark" | null;
        const preferred = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(preferred);
        document.documentElement.setAttribute("data-theme", preferred);
    }, []);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("numerral-theme", next);
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setDropdownOpen(false), 200);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <header className="header">
            <div className="header__inner container">
                {/* Logo */}
                <Link href="/" className="header__logo">
                    <span className="header__logo-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="logoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#logoGrad)" />
                            <path d="M7 8h2v8H7V8zm4 3h2v5h-2v-5zm4-1h2v6h-2v-6z" fill="white" />
                        </svg>
                    </span>
                    <span className="header__logo-text">
                        Numer<span className="header__logo-accent">ral</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="header__nav">
                    {/* Calculators Dropdown */}
                    <div
                        ref={dropdownRef}
                        className="header__dropdown-wrapper"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button
                            className={`header__nav-link header__dropdown-trigger ${dropdownOpen ? "active" : ""}`}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            Calculators
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4, transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }}>
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="header__mega-dropdown">
                                <div className="header__mega-grid">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.key}
                                            href={cat.href}
                                            className="header__mega-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <span className="header__mega-icon">{cat.icon}</span>
                                            <div>
                                                <div className="header__mega-name">{cat.name}</div>
                                                <div className="header__mega-desc">{cat.desc}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/guides" className="header__nav-link">Guides</Link>
                    <Link href="/glossary" className="header__nav-link">Glossary</Link>
                    <Link href="/about" className="header__nav-link">About</Link>

                    <button
                        className="header__theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </nav>

                {/* Mobile: theme + burger */}
                <div className="header__mobile-actions">
                    <button
                        className="header__theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                    <button
                        className="header__burger"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="header__mobile-menu">
                    <div className="header__mobile-section">
                        <div className="header__mobile-label">Calculators</div>
                        {categories.map((cat) => (
                            <Link
                                key={cat.key}
                                href={cat.href}
                                className="header__mobile-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <span>{cat.icon}</span> {cat.name}
                            </Link>
                        ))}
                    </div>
                    <div className="header__mobile-section">
                        <div className="header__mobile-label">Resources</div>
                        {resources.map((r) => (
                            <Link
                                key={r.href}
                                href={r.href}
                                className="header__mobile-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <span>{r.icon}</span> {r.name}
                            </Link>
                        ))}
                        <Link href="/about" className="header__mobile-link" onClick={() => setMobileOpen(false)}>
                            <span>ℹ️</span> About
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

// Header — Full navigation with logo, links, and dark mode toggle
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

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

    return (
        <header className="header">
            <div className="header__inner container">
                <Link href="/" className="header__logo">
                    <span className="header__logo-icon">N</span>
                    Numerral
                </Link>

                <nav className="header__nav">
                    <Link href="/loan-calculators" className="header__nav-link">Calculators</Link>
                    <Link href="/loan-calculators" className="header__nav-link">Loan EMI</Link>
                    <button
                        className="header__theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>
                </nav>

                <button
                    className="header__theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                    style={{ marginLeft: "auto" }}
                >
                    {theme === "light" ? "🌙" : "☀️"}
                </button>
                <button className="header__burger" aria-label="Open menu">
                    ☰
                </button>
            </div>
        </header>
    );
}

// MegaFooter — Server component
// Data sourced from: footer_links.json + categories.json → lib/data.ts

import Link from "next/link";
import { getFooterLinks, getAllCategories } from "@/lib/data";

export default function MegaFooter() {
    const linksByCategory = getFooterLinks();
    const categories = getAllCategories();

    return (
        <footer className="mega-footer">
            <div className="mega-footer__inner">
                {/* Brand */}
                <div className="mega-footer__brand">
                    <Link href="/" className="mega-footer__logo">
                        Numerral
                    </Link>
                    <p>India&apos;s smartest calculator platform.</p>
                </div>

                {/* Calculator link columns — driven by footer_links.json */}
                {categories.map((cat) => {
                    const links = linksByCategory[cat.key] ?? [];
                    return (
                        <div key={cat.key} className="mega-footer__col">
                            <h4 className="mega-footer__col-title">
                                {cat.icon} {cat.name}
                            </h4>
                            {links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="mega-footer__link"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    );
                })}

                {/* Resources column */}
                <div className="mega-footer__col">
                    <h4 className="mega-footer__col-title">
                        📚 Resources
                    </h4>
                    <Link href="/guides" className="mega-footer__link">Financial Guides</Link>
                    <Link href="/glossary" className="mega-footer__link">Financial Glossary</Link>
                    <Link href="/about" className="mega-footer__link">About Us</Link>
                    <Link href="/site-map" className="mega-footer__link">Site Map</Link>
                </div>
            </div>

            {/* Semantic footer text — NLP-rich context for search engines */}
            <div className="mega-footer__semantic">
                <p>
                    Numerral is a free financial calculator platform built for India. We offer 50+ calculators covering
                    loan EMI estimation, investment return projection, income tax computation, and everyday mathematical
                    calculations. Our tools use standard financial formulas — including compound interest, reducing balance
                    amortization, XIRR, and Indian tax slab structures — to generate accurate results instantly. Whether
                    you are calculating a home loan EMI, estimating SIP returns on mutual funds, computing GST, or checking
                    your income tax liability under the old and new regime, Numerral provides precise calculations with
                    transparent methodology.
                </p>
                <p>
                    Each calculator is developed and tested individually to ensure accuracy across a wide range of inputs.
                    Our loan calculators support amounts from ₹10,000 to ₹10 Crore with tenure options from 6 months to
                    30 years. Investment calculators cover SIP, lumpsum, FD, RD, PPF, and NPS with current Indian rates.
                    Tax tools are updated for FY 2025-26 and cover income tax, GST, TDS, HRA, capital gains, and professional
                    tax across all Indian states. All tools are completely free, require no registration, and work on any device.
                </p>
            </div>

            <div className="mega-footer__bottom">
                <span>© 2026 Numerral. All rights reserved.</span>
                <div>
                    <Link href="/terms">Terms</Link>
                    <Link href="/privacy">Privacy</Link>
                    <Link href="/cookie-policy">Cookies</Link>
                    <Link href="/about">About</Link>
                </div>
            </div>
        </footer>
    );
}


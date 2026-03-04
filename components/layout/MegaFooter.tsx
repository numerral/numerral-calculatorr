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


// MegaFooter — Server component
// Clean footer: Brand + Quick Links + Legal + Language Selector + Semantic content

import Link from "next/link";

const LANGUAGES = [
    { label: "English", href: "/", code: "en" },
    { label: "العربية", href: "/ar", code: "ar" },
    { label: "中文", href: "/ch", code: "zh" },
    { label: "Deutsch", href: "/de", code: "de" },
    { label: "Bahasa Indonesia", href: "/id", code: "id" },
    { label: "Türkçe", href: "/tr", code: "tr" },
];

export default function MegaFooter() {
    return (
        <footer className="mega-footer">
            <div className="mega-footer__inner">
                {/* Brand */}
                <div className="mega-footer__brand">
                    <Link href="/" className="mega-footer__logo">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#a5b4fc" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#footerLogoGrad)" />
                            <path d="M7 8h2v8H7V8zm4 3h2v5h-2v-5zm4-1h2v6h-2v-6z" fill="white" />
                        </svg>
                        <span>Numer<span style={{ color: '#a5b4fc' }}>ral</span></span>
                    </Link>
                    <p>Free online calculator platform — 346+ tools for finance, construction, health, EV, and everyday math.</p>
                </div>

                {/* Quick Links */}
                <div className="mega-footer__col">
                    <h4 className="mega-footer__col-title">Resources</h4>
                    <Link href="/about" className="mega-footer__link">About Numerral</Link>
                    <Link href="/guides" className="mega-footer__link">Financial Guides</Link>
                    <Link href="/glossary" className="mega-footer__link">Glossary</Link>
                    <Link href="/site-map" className="mega-footer__link">Site Map</Link>
                </div>

                {/* Legal */}
                <div className="mega-footer__col">
                    <h4 className="mega-footer__col-title">Legal</h4>
                    <Link href="/terms" className="mega-footer__link">Terms &amp; Conditions</Link>
                    <Link href="/privacy" className="mega-footer__link">Privacy Policy</Link>
                    <Link href="/cookie-policy" className="mega-footer__link">Cookie Policy</Link>
                </div>

                {/* Language Selector */}
                <div className="mega-footer__col">
                    <h4 className="mega-footer__col-title">🌐 Language</h4>
                    <div className="mega-footer__languages">
                        {LANGUAGES.map((lang) => (
                            <Link
                                key={lang.code}
                                href={lang.href}
                                className="mega-footer__lang-btn"
                                hrefLang={lang.code}
                            >
                                {lang.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Semantic footer text — NLP-rich context for search engines */}
            <div className="mega-footer__semantic">
                <p>
                    Numerral is a free online calculator platform offering 346+ calculators across 10 specialized categories.
                    Our finance calculators cover loan EMI estimation using the reducing balance method, SIP and mutual fund
                    return projection with compound interest, fixed deposit maturity calculation, PPF and NPS corpus estimation,
                    and complete income tax computation under both old and new tax regimes for FY 2025-26. Construction
                    calculators provide material quantity estimation for concrete, lumber, roofing, flooring, insulation,
                    drywall, paint coverage, gravel, and 150+ building project types using industry-standard formulas.
                </p>
                <p>
                    Health calculators include BMI, TDEE, basal metabolic rate (BMR), body fat percentage, calorie intake,
                    macro distribution, ideal weight, pregnancy due date, water intake, and heart rate zone estimation based
                    on peer-reviewed formulas such as Mifflin-St Jeor and Harris-Benedict equations. EV calculators compare
                    electric vehicle total cost of ownership against internal combustion engines, estimate charging costs per
                    kWh, calculate battery degradation over time, and project fuel savings. All calculators run entirely in
                    the browser — no data is collected, stored, or transmitted. Numerral is available in English, Arabic,
                    Chinese, German, Indonesian, and Turkish.
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

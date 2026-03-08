// ArHeader — Minimal RTL header for Arabic section
import Link from "next/link";

export default function ArHeader() {
    return (
        <header className="ar-header">
            <div className="ar-header__inner">
                <Link href="/ar" className="ar-header__logo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="arLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#a5b4fc" />
                                <stop offset="100%" stopColor="#818cf8" />
                            </linearGradient>
                        </defs>
                        <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#arLogoGrad)" />
                        <path d="M7 8h2v8H7V8zm4 3h2v5h-2v-5zm4-1h2v6h-2v-6z" fill="white" />
                    </svg>
                    <span>Numer<span style={{ color: '#a5b4fc' }}>ral</span></span>
                </Link>

                <nav className="ar-header__nav">
                    <Link href="/ar" className="ar-header__link">
                        🏠 الرئيسية
                    </Link>
                    <Link href="/" className="ar-header__link ar-header__link--en">
                        🌐 English
                    </Link>
                </nav>
            </div>
        </header>
    );
}

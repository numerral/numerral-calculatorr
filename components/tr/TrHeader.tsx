// Turkish Header
import Link from "next/link";

export default function TrHeader() {
    return (
        <header className="ar-header">
            <nav className="ar-header__nav">
                <Link href="/tr" className="ar-header__logo">
                    <span className="ar-header__logo-icon">🇹🇷</span> Numerral
                </Link>
                <div className="ar-header__links">
                    <Link href="/tr" className="ar-header__link">Hesaplayıcılar</Link>
                    <Link href="/" className="ar-header__link">EN</Link>
                </div>
            </nav>
        </header>
    );
}

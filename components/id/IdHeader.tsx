// Indonesian Section Header — /id/*
import Link from "next/link";

export default function IdHeader() {
    return (
        <header className="ar-header">
            <div className="ar-header__inner">
                <Link href="/id" className="ar-header__logo">
                    Numerral 🇮🇩
                </Link>
                <nav className="ar-header__nav">
                    <Link href="/id" className="ar-header__link">Kalkulator</Link>
                    <Link href="/" className="ar-header__link ar-header__link--en">EN</Link>
                </nav>
            </div>
        </header>
    );
}

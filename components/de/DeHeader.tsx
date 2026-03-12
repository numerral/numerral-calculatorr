// German Section Header — /de/*
import Link from "next/link";

export default function DeHeader() {
    return (
        <header className="ar-header">
            <div className="ar-header__inner">
                <Link href="/de" className="ar-header__logo">
                    Numerral 🇩🇪
                </Link>
                <nav className="ar-header__nav">
                    <Link href="/de" className="ar-header__link">Rechner</Link>
                    <Link href="/" className="ar-header__link ar-header__link--en">EN</Link>
                </nav>
            </div>
        </header>
    );
}

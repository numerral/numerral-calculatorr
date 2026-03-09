// Swiss Section Header — /ch/*
import Link from "next/link";

export default function ChHeader() {
    return (
        <header className="ar-header">
            <div className="ar-header__inner">
                <Link href="/ch" className="ar-header__logo">
                    Numerral 🇨🇭
                </Link>
                <nav className="ar-header__nav">
                    <Link href="/ch" className="ar-header__link">Rechner</Link>
                    <Link href="/" className="ar-header__link ar-header__link--en">EN</Link>
                </nav>
            </div>
        </header>
    );
}

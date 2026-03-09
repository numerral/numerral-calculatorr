// Swiss Section Footer — /ch/*
import Link from "next/link";

export default function ChFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div>
                    <h3 className="ar-footer__heading">Numerral Schweiz</h3>
                    <p className="ar-footer__text">
                        Kostenlose Finanzrechner für Hypotheken, Steuern, Lohn und Gehalt in der Schweiz.
                    </p>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Immobilien</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/hypothekenrechner">Hypothekenrechner</Link></li>
                        <li><Link href="/ch/tragbarkeitsrechner">Tragbarkeitsrechner</Link></li>
                        <li><Link href="/ch/eigenkapitalrechner">Eigenkapitalrechner</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Steuern</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/steuerrechner">Steuerrechner</Link></li>
                        <li><Link href="/ch/mehrwertsteuerrechner">MWST Rechner</Link></li>
                        <li><Link href="/ch/steuervergleich">Steuervergleich</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Lohn & Gehalt</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/brutto-netto-rechner">Brutto Netto</Link></li>
                        <li><Link href="/ch/stundenlohnrechner">Stundenlohn</Link></li>
                        <li><Link href="/ch/freelancer-rechner">Freelancer</Link></li>
                        <li><Link href="/">English Version</Link></li>
                    </ul>
                </div>
            </div>
            <div className="ar-footer__bottom">
                <span>© {new Date().getFullYear()} Numerral — Alle Rechte vorbehalten</span>
            </div>
        </footer>
    );
}

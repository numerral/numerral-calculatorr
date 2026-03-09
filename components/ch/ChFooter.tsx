// Swiss Section Footer — /ch/*
import Link from "next/link";

export default function ChFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div>
                    <h3 className="ar-footer__heading">Numerral Schweiz</h3>
                    <p className="ar-footer__text">
                        Kostenlose Finanzrechner für Hypotheken, Immobilien und Eigenheimfinanzierung in der Schweiz.
                    </p>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Rechner</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/hypothekenrechner">Hypothekenrechner</Link></li>
                        <li><Link href="/ch/tragbarkeitsrechner">Tragbarkeitsrechner</Link></li>
                        <li><Link href="/ch/eigenkapitalrechner">Eigenkapitalrechner</Link></li>
                        <li><Link href="/ch/kaufnebenkostenrechner">Kaufnebenkosten</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Weitere</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/mieten-oder-kaufen">Mieten oder Kaufen</Link></li>
                        <li><Link href="/ch/renditerechner">Renditerechner</Link></li>
                        <li><Link href="/ch/budgetrechner">Budgetrechner</Link></li>
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

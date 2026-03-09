// Swiss Section Footer — /ch/*
import Link from "next/link";

export default function ChFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div>
                    <h3 className="ar-footer__heading">Numerral Schweiz</h3>
                    <p className="ar-footer__text">
                        50 kostenlose Finanzrechner für Hypotheken, Steuern, Lohn, Vorsorge und Investitionen.
                    </p>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Immobilien</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/hypothekenrechner">Hypothekenrechner</Link></li>
                        <li><Link href="/ch/tragbarkeitsrechner">Tragbarkeit</Link></li>
                        <li><Link href="/ch/eigenkapitalrechner">Eigenkapital</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Steuern</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/steuerrechner">Steuerrechner</Link></li>
                        <li><Link href="/ch/mehrwertsteuerrechner">MWST</Link></li>
                        <li><Link href="/ch/steuervergleich">Vergleich</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Lohn</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/brutto-netto-rechner">Brutto Netto</Link></li>
                        <li><Link href="/ch/stundenlohnrechner">Stundenlohn</Link></li>
                        <li><Link href="/ch/freelancer-rechner">Freelancer</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Vorsorge</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/ahv-rentenrechner">AHV Rente</Link></li>
                        <li><Link href="/ch/bvg-rechner">BVG</Link></li>
                        <li><Link href="/ch/saeule-3a-rechner">Säule 3a</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Investieren</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/ch/zinseszinsrechner">Zinseszins</Link></li>
                        <li><Link href="/ch/etf-rendite-rechner">ETF Rendite</Link></li>
                        <li><Link href="/ch/finanzielle-freiheit-rechner">FIRE</Link></li>
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


// German Section Footer — /de/*
import Link from "next/link";
import { DE_CATEGORIES } from "@/data/de-calculators";

export default function DeFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div>
                    <h3 className="ar-footer__heading">Numerral Deutschland</h3>
                    <p className="ar-footer__text">
                        35 kostenlose Online-Rechner für Gesundheit, Mathematik, Finanzen, Physik, Statistik, Alltag und KI-Tools.
                    </p>
                </div>
                {DE_CATEGORIES.map((cat) => (
                    <div key={cat.label}>
                        <h3 className="ar-footer__heading">{cat.icon} {cat.label}</h3>
                        <ul className="ar-footer__links">
                            {cat.ids.slice(0, 3).map((id) => (
                                <li key={id}><Link href={`/de/${id}`}>{id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/rechner/gi, "").trim() || id}</Link></li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="ar-footer__bottom">
                <span>© {new Date().getFullYear()} Numerral — Alle Rechte vorbehalten</span>
                <Link href="/">English Version</Link>
            </div>
        </footer>
    );
}

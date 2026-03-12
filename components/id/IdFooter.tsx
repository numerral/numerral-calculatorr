// Indonesian Section Footer — /id/*
import Link from "next/link";

export default function IdFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div>
                    <h3 className="ar-footer__heading">Numerral Indonesia</h3>
                    <p className="ar-footer__text">
                        25 kalkulator gratis untuk keuangan, pajak, bisnis, matematika, dan kesehatan.
                    </p>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Keuangan</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/id/kalkulator-kpr">Kalkulator KPR</Link></li>
                        <li><Link href="/id/kalkulator-kredit-mobil">Kredit Mobil</Link></li>
                        <li><Link href="/id/kalkulator-kredit-motor">Kredit Motor</Link></li>
                        <li><Link href="/id/kalkulator-pinjaman">Pinjaman</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Pajak & Gaji</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/id/kalkulator-pph21">PPh 21</Link></li>
                        <li><Link href="/id/kalkulator-ppn">PPN 12%</Link></li>
                        <li><Link href="/id/kalkulator-gaji">Gaji Bersih</Link></li>
                        <li><Link href="/id/kalkulator-bpjs">BPJS</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Bisnis</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/id/kalkulator-laba-rugi">Laba Rugi</Link></li>
                        <li><Link href="/id/kalkulator-diskon">Diskon</Link></li>
                        <li><Link href="/id/kalkulator-margin">Margin</Link></li>
                        <li><Link href="/id/kalkulator-roi">ROI</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Matematika</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/id/kalkulator-persentase">Persentase</Link></li>
                        <li><Link href="/id/kalkulator-rata-rata">Rata-Rata</Link></li>
                        <li><Link href="/id/kalkulator-pecahan">Pecahan</Link></li>
                        <li><Link href="/id/kalkulator-pangkat">Pangkat</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="ar-footer__heading">Kesehatan</h3>
                    <ul className="ar-footer__links">
                        <li><Link href="/id/kalkulator-bmi">BMI</Link></li>
                        <li><Link href="/id/kalkulator-usia">Usia</Link></li>
                        <li><Link href="/id/kalkulator-kehamilan">Kehamilan</Link></li>
                        <li><Link href="/">English Version</Link></li>
                    </ul>
                </div>
            </div>
            <div className="ar-footer__bottom">
                <span>© {new Date().getFullYear()} Numerral — Hak cipta dilindungi</span>
            </div>
        </footer>
    );
}

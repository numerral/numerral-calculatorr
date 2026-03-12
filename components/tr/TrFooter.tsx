// Turkish Footer
import Link from "next/link";

export default function TrFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div className="ar-footer__col">
                    <h3 className="ar-footer__brand">🇹🇷 Numerral Türkiye</h3>
                    <p className="ar-footer__desc">
                        Türkiye'nin ücretsiz finans hesaplayıcı platformu: kredi, yatırım, vergi, maaş ve daha fazlası.
                    </p>
                </div>
                <div className="ar-footer__col">
                    <h4 className="ar-footer__heading">Kredi</h4>
                    <Link href="/tr/konut-kredi-hesaplama">Konut Kredisi</Link>
                    <Link href="/tr/tasit-kredi-hesaplama">Taşıt Kredisi</Link>
                    <Link href="/tr/ihtiyac-kredi-hesaplama">İhtiyaç Kredisi</Link>
                    <Link href="/tr/kredi-taksit-hesaplama">Taksit Hesaplama</Link>
                    <Link href="/tr/faiz-hesaplama">Faiz Hesaplama</Link>
                </div>
                <div className="ar-footer__col">
                    <h4 className="ar-footer__heading">Vergi & Maaş</h4>
                    <Link href="/tr/kdv-hesaplama">KDV Hesaplama</Link>
                    <Link href="/tr/gelir-vergisi-hesaplama">Gelir Vergisi</Link>
                    <Link href="/tr/maas-hesaplama">Maaş Hesaplama</Link>
                    <Link href="/tr/sgk-hesaplama">SGK Prim</Link>
                    <Link href="/tr/kidem-tazminati-hesaplama">Kıdem Tazminatı</Link>
                </div>
                <div className="ar-footer__col">
                    <h4 className="ar-footer__heading">İşletme</h4>
                    <Link href="/tr/kar-zarar-hesaplama">Kâr-Zarar</Link>
                    <Link href="/tr/indirim-hesaplama">İndirim</Link>
                    <Link href="/tr/kar-marji-hesaplama">Kâr Marjı</Link>
                    <Link href="/tr/yatirim-getiri-hesaplama">ROI</Link>
                </div>
                <div className="ar-footer__col">
                    <h4 className="ar-footer__heading">Araçlar</h4>
                    <Link href="/tr/vki-hesaplama">VKİ</Link>
                    <Link href="/tr/yas-hesaplama">Yaş</Link>
                    <Link href="/tr/gebelik-hesaplama">Gebelik</Link>
                    <Link href="/tr/doviz-hesaplama">Döviz Kuru</Link>
                </div>
            </div>
            <div className="ar-footer__bottom">
                <p>© {new Date().getFullYear()} Numerral. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}

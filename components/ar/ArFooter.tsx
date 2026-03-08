// ArFooter — Compact Arabic footer
import Link from "next/link";

export default function ArFooter() {
    return (
        <footer className="ar-footer">
            <div className="ar-footer__inner">
                <div className="ar-footer__brand">
                    <Link href="/ar" className="ar-footer__logo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="arFooterGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#a5b4fc" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                            <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#arFooterGrad)" />
                            <path d="M7 8h2v8H7V8zm4 3h2v5h-2v-5zm4-1h2v6h-2v-6z" fill="white" />
                        </svg>
                        <span>Numerral</span>
                    </Link>
                    <p>منصة الحاسبات المالية الأذكى — مجانية بالكامل.</p>
                </div>

                <div className="ar-footer__links">
                    <h4>🔗 روابط سريعة</h4>
                    <Link href="/ar">الحاسبات</Link>
                    <Link href="/">English Site</Link>
                    <Link href="/about">عن نمررال</Link>
                    <Link href="/privacy">الخصوصية</Link>
                    <Link href="/terms">الشروط</Link>
                </div>
            </div>

            <div className="ar-footer__bottom">
                <span>© 2026 Numerral. جميع الحقوق محفوظة.</span>
                <div className="ar-footer__lang">
                    <Link href="/">🌐 English</Link>
                    <span className="ar-footer__lang-active">العربية</span>
                </div>
            </div>
        </footer>
    );
}

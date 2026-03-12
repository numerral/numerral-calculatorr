// Turkish Calculator Hub — /tr
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { TR_CALCULATORS } from "@/data/tr-calculators";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Ücretsiz Online Hesaplayıcılar — Kredi, KDV, Maaş, Yatırım & Daha Fazlası",
    description:
        "25 ücretsiz hesaplayıcı: konut kredisi, taşıt kredisi, KDV, gelir vergisi, SGK, maaş, yatırım, kıdem tazminatı, VKİ ve daha fazlası. Hızlı ve doğru sonuçlar.",
    alternates: { canonical: `${SITE_URL}/tr` },
};

const TR_CATEGORIES: { name: string; icon: string; slugs: string[] }[] = [
    {
        name: "Kredi & Finans",
        icon: "🏦",
        slugs: ["konut-kredi-hesaplama", "tasit-kredi-hesaplama", "ihtiyac-kredi-hesaplama", "kredi-taksit-hesaplama", "faiz-hesaplama", "mevduat-hesaplama", "yatirim-hesaplama", "enflasyon-hesaplama"],
    },
    {
        name: "Vergi & Maaş",
        icon: "🧾",
        slugs: ["kdv-hesaplama", "gelir-vergisi-hesaplama", "maas-hesaplama", "sgk-hesaplama", "kidem-tazminati-hesaplama"],
    },
    {
        name: "İşletme",
        icon: "💼",
        slugs: ["kar-zarar-hesaplama", "indirim-hesaplama", "kar-marji-hesaplama", "yatirim-getiri-hesaplama"],
    },
    {
        name: "Matematik",
        icon: "📐",
        slugs: ["yuzde-hesaplama", "ortalama-hesaplama", "kesir-hesaplama", "us-hesaplama"],
    },
    {
        name: "Sağlık & Genel",
        icon: "❤️",
        slugs: ["vki-hesaplama", "yas-hesaplama", "gebelik-hesaplama", "doviz-hesaplama"],
    },
];

export default function TrHomePage() {
    const allCalcs = TR_CALCULATORS;

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Numerral Türkiye",
        url: `${SITE_URL}/tr`,
        inLanguage: "tr",
        description: "Ücretsiz online hesaplayıcılar",
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/tr/{search_term}`,
        },
    });

    return (
        <main className="ar-hub-v2">
            <Script id="schema-tr-hub" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Hero — Turkish red */}
            <section className="ar-hub-v2__hero" style={{ background: "linear-gradient(135deg, hsl(0, 80%, 45%) 0%, hsl(0, 85%, 30%) 100%)" }}>
                <div className="ar-hub-v2__hero-inner">
                    <div className="ar-hub-v2__hero-badge" style={{ background: "hsla(0,0%,100%,0.18)" }}>🇹🇷 Numerral Türkiye</div>
                    <h1 className="ar-hub-v2__hero-title">
                        Online <span style={{ color: "hsl(0, 100%, 85%)" }}>Hesaplayıcılar</span>
                    </h1>
                    <p className="ar-hub-v2__hero-subtitle" style={{ maxWidth: 600, margin: "0 auto" }}>
                        {allCalcs.length} ücretsiz hesaplayıcı: kredi, vergi, yatırım, maaş ve daha fazlası.
                        Hızlı, doğru ve reklamsız.
                    </p>
                    <div className="ar-hub-v2__hero-stats">
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">{allCalcs.length}</span>
                            <span className="ar-hub-v2__hero-stat-label">Hesaplayıcı</span>
                        </div>
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">5</span>
                            <span className="ar-hub-v2__hero-stat-label">Kategori</span>
                        </div>
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">100%</span>
                            <span className="ar-hub-v2__hero-stat-label">Ücretsiz</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Sections */}
            {TR_CATEGORIES.map((cat) => {
                const calcs = cat.slugs.map((s) => allCalcs.find((c) => c.id === s)).filter(Boolean);
                return (
                    <section key={cat.name} className="ar-hub-v2__category">
                        <h2 className="ar-hub-v2__category-title">{cat.icon} {cat.name}</h2>
                        <div className="ar-hub-v2__grid">
                            {calcs.map((calc) => calc && (
                                <Link key={calc.id} href={`/tr/${calc.id}`} className="ar-hub-v2__card">
                                    <span className="ar-hub-v2__card-icon">{calc.icon}</span>
                                    <div className="ar-hub-v2__card-body">
                                        <h3 className="ar-hub-v2__card-title">{calc.title.split("—")[0].trim()}</h3>
                                        <p className="ar-hub-v2__card-desc">{calc.subtitle.length > 100 ? calc.subtitle.slice(0, 100) + "…" : calc.subtitle}</p>
                                    </div>
                                    <span className="ar-hub-v2__card-arrow">→</span>
                                </Link>
                            ))}
                        </div>
                    </section>
                );
            })}
        </main>
    );
}

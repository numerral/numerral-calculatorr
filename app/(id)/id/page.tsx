// Indonesian Calculator Hub — /id
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ID_CALCULATORS } from "@/data/id-calculators";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Kalkulator Online Gratis Indonesia — KPR, Pajak, Kredit, Investasi & Lainnya",
    description:
        "25 kalkulator online gratis untuk Indonesia: KPR, kredit mobil, kredit motor, PPh 21, PPN, cicilan, investasi, BMI, dan banyak lagi. Cepat, akurat, tanpa iklan.",
    alternates: { canonical: `${SITE_URL}/id` },
};

const ID_CATEGORIES: { name: string; icon: string; slugs: string[] }[] = [
    {
        name: "Keuangan",
        icon: "💰",
        slugs: ["kalkulator-kpr", "kalkulator-kredit-mobil", "kalkulator-kredit-motor", "kalkulator-pinjaman", "kalkulator-cicilan", "kalkulator-bunga", "kalkulator-investasi", "kalkulator-tabungan"],
    },
    {
        name: "Pajak & Gaji",
        icon: "🧾",
        slugs: ["kalkulator-pph21", "kalkulator-ppn", "kalkulator-gaji", "kalkulator-lembur", "kalkulator-bpjs"],
    },
    {
        name: "Bisnis",
        icon: "📊",
        slugs: ["kalkulator-laba-rugi", "kalkulator-diskon", "kalkulator-margin", "kalkulator-roi"],
    },
    {
        name: "Matematika",
        icon: "📐",
        slugs: ["kalkulator-persentase", "kalkulator-rata-rata", "kalkulator-pecahan", "kalkulator-pangkat"],
    },
    {
        name: "Kesehatan & Umum",
        icon: "❤️",
        slugs: ["kalkulator-bmi", "kalkulator-usia", "kalkulator-kehamilan", "kalkulator-kurs"],
    },
];

export default function IdHomePage() {
    const allCalcs = ID_CALCULATORS;

    const schemaData = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Numerral Indonesia",
        url: `${SITE_URL}/id`,
        inLanguage: "id",
        description: "Kalkulator online gratis untuk Indonesia",
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/id/{search_term}`,
        },
    });

    return (
        <main className="ar-hub-v2">
            <Script id="schema-id-hub" type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }} />

            {/* Hero */}
            <section className="ar-hub-v2__hero" style={{ background: "linear-gradient(135deg, hsl(0, 75%, 50%) 0%, hsl(0, 82%, 38%) 100%)" }}>
                <div className="ar-hub-v2__hero-inner">
                    <div className="ar-hub-v2__hero-badge" style={{ background: "hsla(0,0%,100%,0.18)" }}>🇮🇩 Numerral Indonesia</div>
                    <h1 className="ar-hub-v2__hero-title">
                        Kalkulator Online <span style={{ color: "hsl(0, 100%, 85%)" }}>Gratis</span>
                    </h1>
                    <p className="ar-hub-v2__hero-subtitle" style={{ maxWidth: 600, margin: "0 auto" }}>
                        {allCalcs.length} kalkulator gratis untuk keuangan, pajak, bisnis, matematika, dan kesehatan.
                        Cepat, akurat, dan tanpa iklan.
                    </p>
                    <div className="ar-hub-v2__hero-stats">
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">{allCalcs.length}</span>
                            <span className="ar-hub-v2__hero-stat-label">Kalkulator</span>
                        </div>
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">5</span>
                            <span className="ar-hub-v2__hero-stat-label">Kategori</span>
                        </div>
                        <div className="ar-hub-v2__hero-stat">
                            <span className="ar-hub-v2__hero-stat-num">100%</span>
                            <span className="ar-hub-v2__hero-stat-label">Gratis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Sections */}
            {ID_CATEGORIES.map((cat) => {
                const calcs = cat.slugs
                    .map((s) => allCalcs.find((c) => c.id === s))
                    .filter(Boolean);
                return (
                    <section key={cat.name} className="ar-hub-v2__category">
                        <h2 className="ar-hub-v2__category-title">
                            {cat.icon} {cat.name}
                        </h2>
                        <div className="ar-hub-v2__grid">
                            {calcs.map(
                                (calc) =>
                                    calc && (
                                        <Link
                                            key={calc.id}
                                            href={`/id/${calc.id}`}
                                            className="ar-hub-v2__card"
                                        >
                                            <span className="ar-hub-v2__card-icon">{calc.icon}</span>
                                            <div className="ar-hub-v2__card-body">
                                                <h3 className="ar-hub-v2__card-title">{calc.title.split("—")[0].trim()}</h3>
                                                <p className="ar-hub-v2__card-desc">
                                                    {calc.subtitle.length > 100 ? calc.subtitle.slice(0, 100) + "…" : calc.subtitle}
                                                </p>
                                            </div>
                                            <span className="ar-hub-v2__card-arrow">→</span>
                                        </Link>
                                    )
                            )}
                        </div>
                    </section>
                );
            })}
        </main>
    );
}

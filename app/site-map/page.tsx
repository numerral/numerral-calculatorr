import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";
import { getCalculatorsByCategory, getAllCategories } from "@/lib/data";

export const metadata: Metadata = {
    title: "Site Map — All Calculators, Guides & Pages",
    description:
        "Complete site map of Numerral. Browse all 200+ calculators across loans, investments, tax, and utilities.",
    alternates: { canonical: canonicalUrl("/site-map") },
};

export default function SiteMapPage() {
    const categories = getAllCategories();

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Site Map" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>Site Map</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Complete index of all pages and calculators on Numerral.
            </p>

            {/* Main pages */}
            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📄 Main Pages</h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                    <li><Link href="/" style={{ color: "var(--n-primary)", fontWeight: 500 }}>Home</Link></li>
                    <li><Link href="/terms" style={{ color: "var(--n-primary)", fontWeight: 500 }}>Terms &amp; Conditions</Link></li>
                    <li><Link href="/privacy" style={{ color: "var(--n-primary)", fontWeight: 500 }}>Privacy Policy</Link></li>
                    <li><Link href="/cookie-policy" style={{ color: "var(--n-primary)", fontWeight: 500 }}>Cookie Policy</Link></li>
                    <li><Link href="/site-map" style={{ color: "var(--n-primary)", fontWeight: 500 }}>Site Map</Link></li>
                </ul>
            </section>

            {/* Calculator categories */}
            {categories.map((cat) => {
                const calcs = getCalculatorsByCategory(cat.key);
                return (
                    <section key={cat.key} style={{ marginBottom: "var(--s-8)" }}>
                        <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                            {cat.icon} {cat.name}
                        </h2>
                        <p className="t-body-sm text-muted" style={{ marginBottom: "var(--s-3)" }}>
                            {cat.description}
                        </p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                            <li>
                                <Link href={cat.href} style={{ color: "var(--n-primary)", fontWeight: 600 }}>
                                    → {cat.name} (All)
                                </Link>
                            </li>
                            {calcs.map((calc) => (
                                <li key={calc.id} style={{ paddingLeft: "var(--s-6)" }}>
                                    <Link
                                        href={`${cat.href}/${calc.slug}`}
                                        style={{ color: "var(--n-text-secondary)", fontWeight: 500 }}
                                    >
                                        {calc.icon} {calc.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                );
            })}

            {/* Trust & Legal */}
            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🛡️ Trust &amp; Legal</h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                    <li><Link href="/terms" style={{ color: "var(--n-text-secondary)", fontWeight: 500 }}>Terms &amp; Conditions</Link></li>
                    <li><Link href="/privacy" style={{ color: "var(--n-text-secondary)", fontWeight: 500 }}>Privacy Policy</Link></li>
                    <li><Link href="/cookie-policy" style={{ color: "var(--n-text-secondary)", fontWeight: 500 }}>Cookie Policy</Link></li>
                    <li><Link href="/sitemap.xml" style={{ color: "var(--n-text-secondary)", fontWeight: 500 }}>XML Sitemap</Link></li>
                </ul>
            </section>
        </main>
    );
}

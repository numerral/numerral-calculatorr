import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const VARIANTS = [
    { slug: "1-week-from-today", weeks: 1 }, { slug: "2-weeks-from-today", weeks: 2 },
    { slug: "3-weeks-from-today", weeks: 3 }, { slug: "4-weeks-from-today", weeks: 4 },
    { slug: "5-weeks-from-today", weeks: 5 }, { slug: "6-weeks-from-today", weeks: 6 },
    { slug: "8-weeks-from-today", weeks: 8 }, { slug: "10-weeks-from-today", weeks: 10 },
    { slug: "12-weeks-from-today", weeks: 12 }, { slug: "16-weeks-from-today", weeks: 16 },
    { slug: "20-weeks-from-today", weeks: 20 }, { slug: "24-weeks-from-today", weeks: 24 },
    { slug: "26-weeks-from-today", weeks: 26 }, { slug: "52-weeks-from-today", weeks: 52 },
];
const variantMap = new Map(VARIANTS.map((v) => [v.slug, v]));

function addWeeks(weeks: number) { const d = new Date(); d.setDate(d.getDate() + weeks * 7); return d; }
function fmt(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export function generateStaticParams() { return VARIANTS.map((v) => ({ variant: v.slug })); }

interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) return {};
    const target = addWeeks(v.weeks);
    return {
        title: `${v.weeks} Week${v.weeks > 1 ? "s" : ""} From Today — ${fmt(target)} | Numerral`,
        description: `${v.weeks} week${v.weeks > 1 ? "s" : ""} from today is ${fmt(target)}. That's ${v.weeks * 7} calendar days from now.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/weeks-from-today/${variant}`) },
    };
}

export default async function WeeksVariantPage({ params }: PageProps) {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) notFound();

    const target = addWeeks(v.weeks);
    const days = v.weeks * 7;
    const months = (days / 30.44).toFixed(1);
    const idx = VARIANTS.findIndex((x) => x.slug === variant);
    const adj = [-2, -1, 1, 2].map((o) => VARIANTS.at((idx + o) % VARIANTS.length)!);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Weeks From Today", url: canonicalUrl("/time-calculators/weeks-from-today") },
        { name: `${v.weeks} Week${v.weeks > 1 ? "s" : ""} From Today` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wv" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Weeks From Today", href: "/time-calculators/weeks-from-today" }, { label: `${v.weeks} Week${v.weeks > 1 ? "s" : ""} From Today` }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Date Is {v.weeks} Week{v.weeks > 1 ? "s" : ""} From Today?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>📅 {v.weeks} week{v.weeks > 1 ? "s" : ""} from today is:</p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--n-primary)" }}>{fmt(target)}</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}><strong>{days} days</strong> • {months} months • {v.weeks} weeks</p>
            </div>

            <section className="hub-content">
                <h2>How We Calculated This</h2>
                <p>{v.weeks} week{v.weeks > 1 ? "s" : ""} = {v.weeks} × 7 = <strong>{days} days</strong>. Starting from today and counting forward {days} calendar days lands on <strong>{fmt(target)}</strong>.</p>
                <p>This calculation includes all calendar days (weekends and holidays). For business days only, use our <Link href="/time-calculators/business-days-calculator">Business Days Calculator</Link>.</p>
                <p>Need to count days instead of weeks? Try <Link href="/time-calculators/days-from-today">Days From Today Calculator</Link> or use our <Link href="/time-calculators/countdown-timer">Countdown Timer</Link> for a live countdown to any date.</p>
            </section>

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📅 More Weeks From Today</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/weeks-from-today/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{a.weeks} Week{a.weeks > 1 ? "s" : ""} From Today</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/weeks-from-today" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>All Weeks From Today</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

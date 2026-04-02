import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const VARIANTS = [
    { slug: "1-month-from-today", months: 1 }, { slug: "2-months-from-today", months: 2 },
    { slug: "3-months-from-today", months: 3 }, { slug: "4-months-from-today", months: 4 },
    { slug: "5-months-from-today", months: 5 }, { slug: "6-months-from-today", months: 6 },
    { slug: "7-months-from-today", months: 7 }, { slug: "8-months-from-today", months: 8 },
    { slug: "9-months-from-today", months: 9 }, { slug: "10-months-from-today", months: 10 },
    { slug: "12-months-from-today", months: 12 }, { slug: "18-months-from-today", months: 18 },
    { slug: "24-months-from-today", months: 24 },
];
const variantMap = new Map(VARIANTS.map((v) => [v.slug, v]));

function addMonths(m: number) { const d = new Date(); d.setMonth(d.getMonth() + m); return d; }
function fmt(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export function generateStaticParams() { return VARIANTS.map((v) => ({ variant: v.slug })); }

interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) return {};
    return {
        title: `${v.months} Month${v.months > 1 ? "s" : ""} From Today — ${fmt(addMonths(v.months))} | Numerral`,
        description: `${v.months} month${v.months > 1 ? "s" : ""} from today is ${fmt(addMonths(v.months))}. Find the exact date with calendar context.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/months-from-today/${variant}`) },
    };
}

export default async function MonthsVariantPage({ params }: PageProps) {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) notFound();

    const target = addMonths(v.months);
    const approxDays = Math.round(v.months * 30.44);
    const approxWeeks = (approxDays / 7).toFixed(1);
    const idx = VARIANTS.findIndex((x) => x.slug === variant);
    const adj = [-2, -1, 1, 2].map((o) => VARIANTS.at((idx + o) % VARIANTS.length)!);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Months From Today", url: canonicalUrl("/time-calculators/months-from-today") },
        { name: `${v.months} Month${v.months > 1 ? "s" : ""} From Today` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-mv" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Months From Today", href: "/time-calculators/months-from-today" }, { label: `${v.months} Month${v.months > 1 ? "s" : ""} From Today` }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Date Is {v.months} Month{v.months > 1 ? "s" : ""} From Today?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>📅 {v.months} month{v.months > 1 ? "s" : ""} from today is:</p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--n-primary)" }}>{fmt(target)}</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>~{approxDays} days • ~{approxWeeks} weeks • {v.months} month{v.months > 1 ? "s" : ""}</p>
            </div>

            <section className="hub-content">
                <h2>How This Was Calculated</h2>
                <p>Adding {v.months} month{v.months > 1 ? "s" : ""} to today&apos;s date advances the calendar by {v.months} month{v.months > 1 ? "s" : ""}, keeping the same day number when possible. If the target month has fewer days, the date is capped (e.g., January 31 + 1 month = February 28).</p>
                <p>This equals approximately <strong>{approxDays} calendar days</strong> or <strong>{approxWeeks} weeks</strong>. For exact day counts, use our <Link href="/time-calculators/days-from-today">Days From Today Calculator</Link>. For business days, try the <Link href="/time-calculators/business-days-calculator">Business Days Calculator</Link>.</p>
            </section>

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📅 More Months From Today</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/months-from-today/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{a.months} Month{a.months > 1 ? "s" : ""} From Today</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/months-from-today" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>All Months From Today</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

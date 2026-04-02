import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const VARIANTS = [
    { slug: "5-minutes-from-now", minutes: 5 }, { slug: "10-minutes-from-now", minutes: 10 },
    { slug: "15-minutes-from-now", minutes: 15 }, { slug: "20-minutes-from-now", minutes: 20 },
    { slug: "25-minutes-from-now", minutes: 25 }, { slug: "30-minutes-from-now", minutes: 30 },
    { slug: "45-minutes-from-now", minutes: 45 }, { slug: "60-minutes-from-now", minutes: 60 },
    { slug: "90-minutes-from-now", minutes: 90 }, { slug: "120-minutes-from-now", minutes: 120 },
];
const variantMap = new Map(VARIANTS.map((v) => [v.slug, v]));

function addMinutes(m: number) { const d = new Date(); d.setMinutes(d.getMinutes() + m); return d; }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export function generateStaticParams() { return VARIANTS.map((v) => ({ variant: v.slug })); }
interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) return {};
    const d = addMinutes(v.minutes);
    return {
        title: `${v.minutes} Minutes From Now — ${fmtTime(d)} | Numerral`,
        description: `${v.minutes} minutes from now it will be ${fmtTime(d)}. Find the exact time with our calculator.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/minutes-from-now/${variant}`) },
    };
}

export default async function MinutesVariantPage({ params }: PageProps) {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) notFound();

    const target = addMinutes(v.minutes);
    const seconds = v.minutes * 60;
    const hours = (v.minutes / 60).toFixed(2);
    const idx = VARIANTS.findIndex((x) => x.slug === variant);
    const adj = [-2, -1, 1, 2].map((o) => VARIANTS.at((idx + o) % VARIANTS.length)!);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Minutes From Now", url: canonicalUrl("/time-calculators/minutes-from-now") },
        { name: `${v.minutes} Minutes From Now` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-mnv" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Minutes From Now", href: "/time-calculators/minutes-from-now" }, { label: `${v.minutes} Minutes From Now` }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Time Is It {v.minutes} Minutes From Now?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>⏰ {v.minutes} minutes from now is:</p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--n-primary)" }}>{fmtTime(target)}</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>{fmtDate(target)}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{v.minutes} min = {hours} hours = {seconds.toLocaleString()} seconds</p>
            </div>

            <section className="hub-content">
                <h2>The Math</h2>
                <p>We added {v.minutes} minutes ({seconds.toLocaleString()} seconds / {hours} hours) to the current time. {v.minutes >= 60 ? `Since ${v.minutes} minutes exceeds 60, this is equivalent to ${Math.floor(v.minutes / 60)} hour${Math.floor(v.minutes / 60) > 1 ? "s" : ""} and ${v.minutes % 60} minutes.` : ""}</p>
                <p>Want a running countdown instead? Use our <Link href={`/time-calculators/timer/${v.minutes <= 60 ? `${v.minutes}-minute-timer` : ""}`}>{v.minutes}-minute timer</Link> for a live countdown, or the <Link href="/time-calculators/stopwatch">Stopwatch</Link> to time something in progress.</p>
            </section>

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏰ More Minutes From Now</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/minutes-from-now/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{a.minutes} Minutes From Now</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/minutes-from-now" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>All Minutes From Now</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

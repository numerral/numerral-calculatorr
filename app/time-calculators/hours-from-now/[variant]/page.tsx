import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const VARIANTS = [
    { slug: "1-hour-from-now", hours: 1 }, { slug: "2-hours-from-now", hours: 2 },
    { slug: "3-hours-from-now", hours: 3 }, { slug: "4-hours-from-now", hours: 4 },
    { slug: "5-hours-from-now", hours: 5 }, { slug: "6-hours-from-now", hours: 6 },
    { slug: "8-hours-from-now", hours: 8 }, { slug: "10-hours-from-now", hours: 10 },
    { slug: "12-hours-from-now", hours: 12 }, { slug: "16-hours-from-now", hours: 16 },
    { slug: "18-hours-from-now", hours: 18 }, { slug: "20-hours-from-now", hours: 20 },
    { slug: "24-hours-from-now", hours: 24 }, { slug: "48-hours-from-now", hours: 48 },
    { slug: "72-hours-from-now", hours: 72 },
];
const variantMap = new Map(VARIANTS.map((v) => [v.slug, v]));

function addHours(h: number) { const d = new Date(); d.setHours(d.getHours() + h); return d; }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export function generateStaticParams() { return VARIANTS.map((v) => ({ variant: v.slug })); }
interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) return {};
    const d = addHours(v.hours);
    return {
        title: `${v.hours} Hour${v.hours > 1 ? "s" : ""} From Now — ${fmtTime(d)} on ${fmtDate(d)} | Numerral`,
        description: `${v.hours} hour${v.hours > 1 ? "s" : ""} from now it will be ${fmtTime(d)} on ${fmtDate(d)}. Find the exact time with our calculator.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/hours-from-now/${variant}`) },
    };
}

export default async function HoursVariantPage({ params }: PageProps) {
    const { variant } = await params;
    const v = variantMap.get(variant);
    if (!v) notFound();

    const target = addHours(v.hours);
    const minutes = v.hours * 60;
    const idx = VARIANTS.findIndex((x) => x.slug === variant);
    const adj = [-2, -1, 1, 2].map((o) => VARIANTS.at((idx + o) % VARIANTS.length)!);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Hours From Now", url: canonicalUrl("/time-calculators/hours-from-now") },
        { name: `${v.hours} Hour${v.hours > 1 ? "s" : ""} From Now` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-hv" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Hours From Now", href: "/time-calculators/hours-from-now" }, { label: `${v.hours} Hour${v.hours > 1 ? "s" : ""} From Now` }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Time Is It {v.hours} Hour{v.hours > 1 ? "s" : ""} From Now?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>🕐 {v.hours} hour{v.hours > 1 ? "s" : ""} from now is:</p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--n-primary)" }}>{fmtTime(target)}</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>{fmtDate(target)}</p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>{v.hours} hour{v.hours > 1 ? "s" : ""} = {minutes.toLocaleString()} minutes = {(minutes * 60).toLocaleString()} seconds</p>
            </div>

            <section className="hub-content">
                <h2>How This Was Calculated</h2>
                <p>We added {v.hours} hour{v.hours > 1 ? "s" : ""} ({minutes.toLocaleString()} minutes) to the current time. {v.hours >= 24 ? `Since ${v.hours} hours exceeds 24, the date advances by ${Math.floor(v.hours / 24)} day${Math.floor(v.hours / 24) > 1 ? "s" : ""}.` : "The calculation accounts for AM/PM transitions and midnight crossovers."}</p>
                <p>Need a live countdown? Use our <Link href="/time-calculators/timer">Timer</Link> to set a {v.hours}-hour countdown, or our <Link href="/time-calculators/countdown-timer">Countdown Timer</Link> to count down to the exact time.</p>
            </section>

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🕐 More Hours From Now</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/hours-from-now/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{a.hours} Hour{a.hours > 1 ? "s" : ""} From Now</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/hours-from-now" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>All Hours From Now</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

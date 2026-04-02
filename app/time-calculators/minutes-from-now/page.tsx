import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const VARIANTS = [
    { slug: "5-minutes-from-now", minutes: 5 }, { slug: "10-minutes-from-now", minutes: 10 },
    { slug: "15-minutes-from-now", minutes: 15 }, { slug: "20-minutes-from-now", minutes: 20 },
    { slug: "25-minutes-from-now", minutes: 25 }, { slug: "30-minutes-from-now", minutes: 30 },
    { slug: "45-minutes-from-now", minutes: 45 }, { slug: "60-minutes-from-now", minutes: 60 },
    { slug: "90-minutes-from-now", minutes: 90 }, { slug: "120-minutes-from-now", minutes: 120 },
];

function addMinutes(m: number) { const d = new Date(); d.setMinutes(d.getMinutes() + m); return d; }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }

export const metadata: Metadata = {
    title: "Minutes From Now Calculator — What Time Is It X Minutes From Now? | Numerral",
    description: "Find the exact time any number of minutes from now. Quick reference for 5, 10, 15, 20, 30, 45, 60, 90, and 120 minutes from the current time.",
    keywords: ["minutes from now", "10 minutes from now", "15 minutes from now", "30 minutes from now", "what time in 30 minutes"],
    alternates: { canonical: canonicalUrl("/time-calculators/minutes-from-now") },
};

const FAQ_ITEMS = [
    { question: "What time is it 30 minutes from now?", answer: `30 minutes from now it will be ${fmtTime(addMinutes(30))}.` },
    { question: "What time is it 15 minutes from now?", answer: `15 minutes from now it will be ${fmtTime(addMinutes(15))}. This is a standard quarter-hour increment used in scheduling.` },
    { question: "How many seconds are in X minutes?", answer: "Multiply minutes by 60 to get seconds. 5 minutes = 300 seconds. 15 minutes = 900 seconds. 30 minutes = 1,800 seconds. 60 minutes = 3,600 seconds." },
];

export default function MinutesFromNowHub() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Minutes From Now" }]),
        webAppSchema("Minutes From Now Calculator", canonicalUrl("/time-calculators/minutes-from-now")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-mfn" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Minutes From Now" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Minutes From Now Calculator</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>What time will it be X minutes from now? Quick reference table below.</p>

            <div style={{ overflowX: "auto", marginBottom: "var(--s-6)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Minutes</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Time</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Equivalent</th>
                    </tr></thead>
                    <tbody>
                        {VARIANTS.map((v, i) => {
                            const d = addMinutes(v.minutes);
                            const hrs = v.minutes >= 60 ? `${(v.minutes / 60).toFixed(1)} hr` : `${v.minutes * 60} sec`;
                            return (
                                <tr key={v.slug} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: 600 }}><Link href={`/time-calculators/minutes-from-now/${v.slug}`} style={{ color: "var(--n-primary)", textDecoration: "none" }}>{v.minutes} min</Link></td>
                                    <td style={{ padding: "var(--s-3)" }}>{fmtTime(d)}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{hrs}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="common-uses">Common Uses for Minute Calculations</h2>
<ul>
<li><strong>Cooking timers:</strong> "The pasta needs 10 minutes" — when should I drain it?</li>
<li><strong>Meeting scheduling:</strong> "The meeting is in 45 minutes" — what time does it start?</li>
<li><strong>Parking meters:</strong> "I put in 90 minutes" — when does it expire?</li>
<li><strong>Medication:</strong> "Wait 30 minutes before eating" — what time can I eat?</li>
<li><strong>Transit:</strong> "The bus arrives in 15 minutes" — what time should I be at the stop?</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/hours-from-now"><strong>Hours From Now</strong></a> — What time is it X hours from now?</li>
<li><a href="/time-calculators/timer"><strong>Timer</strong></a> — Set a countdown timer for any duration.</li>
<li><a href="/time-calculators/time-calculator"><strong>Time Calculator</strong></a> — Add or subtract time values.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to any time.</li>
</ul>
` }} />

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏰ Quick Links</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {VARIANTS.map((v) => (
                        <Link key={v.slug} href={`/time-calculators/minutes-from-now/${v.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{v.minutes} Minutes From Now</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Minutes From Now FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

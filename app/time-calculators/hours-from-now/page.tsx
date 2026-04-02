import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
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

function addHours(h: number) { const d = new Date(); d.setHours(d.getHours() + h); return d; }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }); }
function fmtDate(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export const metadata: Metadata = {
    title: "Hours From Now — What Time Will It Be in X Hours?",
    description: "Find the exact time and date 1 to 72 hours from now. Accounts for midnight crossovers and day changes automatically.",
    keywords: ["hours from now", "what time is it in 8 hours", "12 hours from now", "24 hours from now", "48 hours from now", "72 hours from now"],
    alternates: { canonical: canonicalUrl("/time-calculators/hours-from-now") },
};

const FAQ_ITEMS = [
    { question: "What time is it 8 hours from now?", answer: `8 hours from now it will be ${fmtTime(addHours(8))} on ${fmtDate(addHours(8))}.` },
    { question: "What time is it 24 hours from now?", answer: `24 hours from now is the same time tomorrow: ${fmtTime(addHours(24))} on ${fmtDate(addHours(24))}.` },
    { question: "What time is it 72 hours from now?", answer: `72 hours from now (3 days) it will be ${fmtTime(addHours(72))} on ${fmtDate(addHours(72))}.` },
    { question: "How do I add hours across midnight?", answer: "When adding hours crosses midnight, the date automatically advances. For example, if it's 10 PM and you add 5 hours, the result is 3 AM the next day." },
    { question: "Does this account for Daylight Saving Time?", answer: "Yes. The calculator uses your device's local time zone, which automatically handles DST transitions. During spring-forward, 2 AM + 1 hour = 3 AM (skipping the lost hour). During fall-back, the extra hour is accounted for." },
];

export default function HoursFromNowHub() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Hours From Now" }]),
        webAppSchema("Hours From Now Calculator", canonicalUrl("/time-calculators/hours-from-now")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-hfn" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Hours From Now" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Hours From Now Calculator</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>What time will it be X hours from now? Quick reference table with links to detailed pages.</p>

            <div style={{ overflowX: "auto", marginBottom: "var(--s-6)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Hours</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Time</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Date</th>
                    </tr></thead>
                    <tbody>
                        {VARIANTS.map((v, i) => {
                            const d = addHours(v.hours);
                            return (
                                <tr key={v.slug} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: 600 }}><Link href={`/time-calculators/hours-from-now/${v.slug}`} style={{ color: "var(--n-primary)", textDecoration: "none" }}>{v.hours} hour{v.hours > 1 ? "s" : ""}</Link></td>
                                    <td style={{ padding: "var(--s-3)" }}>{fmtTime(d)}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{fmtDate(d)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="how-it-works">How to Add Hours to the Current Time</h2>
<p>To calculate the time X hours from now, add the hours to the current time. If the total exceeds 12 (for 12-hour clocks) or 24, the time wraps around and the date advances.</p>
<p style="text-align:center;font-weight:700;font-size:1.1em">Future Time = Current Time + Hours</p>
<p>Example: If it's 3:30 PM and you add 8 hours → 11:30 PM (same day). If you add 10 hours → 1:30 AM (next day).</p>

<h2 id="common-uses">Common Uses</h2>
<ul>
<li><strong>Medication schedules:</strong> "Take every 8 hours" — what time is the next dose?</li>
<li><strong>Travel planning:</strong> "My flight lands in 6 hours" — what time will I arrive?</li>
<li><strong>Cooking:</strong> "The roast needs 4 hours" — when should I start?</li>
<li><strong>Work shifts:</strong> "I work for 10 more hours" — when do I get off?</li>
<li><strong>Time zones:</strong> "It's 8 hours ahead in London" — what time is it there?</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/minutes-from-now"><strong>Minutes From Now</strong></a> — What time is it X minutes from now?</li>
<li><a href="/time-calculators/time-calculator"><strong>Time Calculator</strong></a> — Add or subtract hours, minutes, seconds.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to any time.</li>
<li><a href="/time-calculators/timer"><strong>Timer</strong></a> — Set a countdown timer for any duration.</li>
</ul>
` }} />

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🕐 Quick Links</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {VARIANTS.map((v) => (
                        <Link key={v.slug} href={`/time-calculators/hours-from-now/${v.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{v.hours} Hour{v.hours > 1 ? "s" : ""} From Now</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Hours From Now FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
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

function addWeeks(weeks: number) {
    const d = new Date(); d.setDate(d.getDate() + weeks * 7); return d;
}
function fmt(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export const metadata: Metadata = {
    title: "Weeks From Today — Date Calculator by Week Count",
    description: "Find the exact date 1 to 52 weeks from today. Reference table with day, month, and use-case context for each week count.",
    keywords: ["weeks from today", "weeks from now", "date weeks from today", "4 weeks from today", "6 weeks from today", "12 weeks from today"],
    alternates: { canonical: canonicalUrl("/time-calculators/weeks-from-today") },
};

const FAQ_ITEMS = [
    { question: "What date is 2 weeks from today?", answer: `2 weeks from today is ${fmt(addWeeks(2))}. That's 14 calendar days from now.` },
    { question: "What date is 6 weeks from today?", answer: `6 weeks from today is ${fmt(addWeeks(6))}. That's 42 calendar days from now — approximately 1.5 months.` },
    { question: "What date is 12 weeks from today?", answer: `12 weeks from today is ${fmt(addWeeks(12))}. That's 84 calendar days, or roughly 3 months from now.` },
    { question: "How do I calculate weeks from a date?", answer: "Multiply the number of weeks by 7 to get days, then add that many days to the start date. For example, 6 weeks = 42 days. Add 42 days to today's date to get the result." },
    { question: "What date is 52 weeks from today?", answer: `52 weeks from today is ${fmt(addWeeks(52))}. That's 364 days — one day short of a full year (365 days). Note: 52 weeks ≠ 1 year.` },
    { question: "Why do doctors use weeks instead of months?", answer: "Pregnancy is tracked in weeks (40 weeks term) because weeks are a fixed 7-day unit, while months vary from 28–31 days. Using weeks eliminates ambiguity in medical timelines, medication schedules, and treatment plans." },
];

export default function WeeksFromTodayHub() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Weeks From Today" }]),
        webAppSchema("Weeks From Today Calculator", canonicalUrl("/time-calculators/weeks-from-today")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wft" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Weeks From Today" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Weeks From Today Calculator</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Find the exact date any number of weeks from today. Use the quick reference table or click a link below for full details.</p>

            {/* Quick reference table */}
            <div style={{ overflowX: "auto", marginBottom: "var(--s-6)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Weeks</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Days</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Date</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Day</th>
                    </tr></thead>
                    <tbody>
                        {VARIANTS.map((v, i) => {
                            const d = addWeeks(v.weeks);
                            return (
                                <tr key={v.slug} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: 600 }}><Link href={`/time-calculators/weeks-from-today/${v.slug}`} style={{ color: "var(--n-primary)", textDecoration: "none" }}>{v.weeks} week{v.weeks > 1 ? "s" : ""}</Link></td>
                                    <td style={{ padding: "var(--s-3)" }}>{v.weeks * 7}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{d.toLocaleDateString("en-US", { weekday: "long" })}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="how-it-works">How to Calculate Weeks From Today</h2>
<p>To find the date X weeks from today:</p>
<ol><li>Multiply weeks by 7 to get the number of days.</li><li>Add that many days to today's date.</li><li>Account for month boundaries — our calculator handles months with 28, 29, 30, and 31 days automatically.</li></ol>
<p style="text-align:center;font-weight:700;font-size:1.1em">Target Date = Today + (Weeks × 7 days)</p>

<h2 id="common-uses">Common Uses for Week Calculations</h2>
<h3>Medical & Pregnancy</h3>
<p>Pregnancy is tracked in weeks (40-week term). Doctors schedule check-ups at specific week intervals: 12-week ultrasound, 20-week anatomy scan, 36-week weekly visits. Medication courses are often prescribed in 2, 4, or 6-week durations.</p>
<h3>Project Management</h3>
<p>Sprint cycles commonly run in 2-week (14-day) intervals. Quarter milestones are roughly 13 weeks apart. Annual planning divides the year into 52 weeks for budgeting and resource allocation.</p>
<h3>Legal & Regulatory</h3>
<p>FMLA leave is calculated in 12-week blocks. Workers' compensation waiting periods are typically 1 week. Court deadlines, appeal windows, and statute of limitations periods are often specified in weeks.</p>
<h3>Fitness & Training</h3>
<p>Training programs — marathon prep (16–20 weeks), Couch to 5K (9 weeks), strength programs (8–12 weeks) — are structured in weekly cycles with progressive overload.</p>

<h2 id="weeks-vs-months">Weeks vs. Months: Why It Matters</h2>
<table><thead><tr><th>Unit</th><th>Duration</th><th>Consistency</th></tr></thead>
<tbody>
<tr><td><strong>1 week</strong></td><td>Always 7 days</td><td>100% consistent</td></tr>
<tr><td><strong>1 month</strong></td><td>28–31 days</td><td>Varies by 10.7%</td></tr>
<tr><td><strong>52 weeks</strong></td><td>364 days</td><td>1 day short of a year</td></tr>
</tbody></table>
<p>Weeks are used in medicine, athletics, and project management because they're a <strong>fixed, unambiguous unit</strong>. Months are convenient for everyday use but imprecise for scheduling.</p>

<h2 id="related">Related Calculators</h2>
<ul>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the date N days from now.</li>
<li><a href="/time-calculators/months-from-today"><strong>Months From Today</strong></a> — Find the date N months from now.</li>
<li><a href="/time-calculators/date-calculator"><strong>Date Calculator</strong></a> — Add or subtract days, weeks, months.</li>
<li><a href="/time-calculators/week-calculator"><strong>Week Calculator</strong></a> — Calculate weeks between dates.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to any date.</li>
</ul>
` }} />

            {/* Child page links */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📅 Quick Links</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--s-3)" }}>
                    {VARIANTS.map((v) => (
                        <Link key={v.slug} href={`/time-calculators/weeks-from-today/${v.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{v.weeks} Week{v.weeks > 1 ? "s" : ""} From Today</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Weeks From Today FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

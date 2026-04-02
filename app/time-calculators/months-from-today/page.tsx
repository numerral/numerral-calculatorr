import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
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

function addMonths(m: number) { const d = new Date(); d.setMonth(d.getMonth() + m); return d; }
function fmt(d: Date) { return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }

export const metadata: Metadata = {
    title: "Months From Today — Future Date by Month Count",
    description: "Calculate the date 1 to 24 months from today. Covers lease terms, COBRA deadlines, CD maturity, and planning milestones.",
    keywords: ["months from today", "months from now", "3 months from today", "6 months from today", "date months from now"],
    alternates: { canonical: canonicalUrl("/time-calculators/months-from-today") },
};

const FAQ_ITEMS = [
    { question: "What date is 3 months from today?", answer: `3 months from today is ${fmt(addMonths(3))}. Month calculations add exactly 3 calendar months, so March 15 → June 15, January 31 → April 30 (capped at month end).` },
    { question: "What date is 6 months from today?", answer: `6 months from today is ${fmt(addMonths(6))}. Six months is a common lease, subscription, and probationary period.` },
    { question: "How do month calculations handle different month lengths?", answer: "When the target month has fewer days than the start, the date is capped. For example, January 31 + 1 month = February 28 (or 29 in leap years). This is the standard calendar math convention." },
    { question: "Is 12 months the same as 1 year?", answer: "Usually yes, but not always. 12 calendar months from January 15 = January 15 next year (365 or 366 days). However, 12 months from January 31 = January 31 (365/366 days), while '1 year' is always 365 or 366 days." },
    { question: "What date is 18 months from today?", answer: `18 months from today is ${fmt(addMonths(18))}. 18 months (1.5 years) is a common warranty period, loan term, and MBA program duration.` },
];

export default function MonthsFromTodayHub() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Months From Today" }]),
        webAppSchema("Months From Today Calculator", canonicalUrl("/time-calculators/months-from-today")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-mft" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Months From Today" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Months From Today Calculator</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Find the exact date any number of months from today. Quick reference table plus detailed pages for each month interval.</p>

            <div style={{ overflowX: "auto", marginBottom: "var(--s-6)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Months</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Approx. Days</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Date</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>Day</th>
                    </tr></thead>
                    <tbody>
                        {VARIANTS.map((v, i) => {
                            const d = addMonths(v.months);
                            const approxDays = Math.round(v.months * 30.44);
                            return (
                                <tr key={v.slug} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: 600 }}><Link href={`/time-calculators/months-from-today/${v.slug}`} style={{ color: "var(--n-primary)", textDecoration: "none" }}>{v.months} month{v.months > 1 ? "s" : ""}</Link></td>
                                    <td style={{ padding: "var(--s-3)" }}>~{approxDays}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{d.toLocaleDateString("en-US", { weekday: "long" })}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="how-it-works">How Month Calculations Work</h2>
<p>Adding months to a date advances the month number while keeping the day number the same. If the target month has fewer days, the date is capped:</p>
<table><thead><tr><th>Start Date</th><th>+ Months</th><th>Result</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Jan 15</td><td>+1</td><td>Feb 15</td><td>Same day, next month</td></tr>
<tr><td>Jan 31</td><td>+1</td><td>Feb 28/29</td><td>Capped at month end</td></tr>
<tr><td>Mar 30</td><td>+1</td><td>Apr 30</td><td>Same day, next month</td></tr>
<tr><td>May 31</td><td>+1</td><td>Jun 30</td><td>June has only 30 days</td></tr>
</tbody></table>

<h2 id="common-periods">Common Month-Based Periods in the US</h2>
<table><thead><tr><th>Period</th><th>Duration</th><th>Context</th></tr></thead>
<tbody>
<tr><td><strong>Probation</strong></td><td>3–6 months</td><td>Employment probationary/trial periods</td></tr>
<tr><td><strong>Lease term</strong></td><td>6 or 12 months</td><td>Standard apartment leases</td></tr>
<tr><td><strong>COBRA coverage</strong></td><td>18 months</td><td>Health insurance continuation after job loss</td></tr>
<tr><td><strong>Tax filing</strong></td><td>6 months</td><td>IRS extension from April 15 → October 15</td></tr>
<tr><td><strong>CD terms</strong></td><td>3, 6, 12, 18, 24 mo</td><td>Bank certificate of deposit maturities</td></tr>
<tr><td><strong>Pregnancy</strong></td><td>9 months (~40 weeks)</td><td>Full-term gestation</td></tr>
<tr><td><strong>Warranty</strong></td><td>12–24 months</td><td>Standard manufacturer warranties</td></tr>
</tbody></table>

<h2 id="related">Related Calculators</h2>
<ul>
<li><a href="/time-calculators/weeks-from-today"><strong>Weeks From Today</strong></a> — Find the date N weeks from now.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the date N days from now.</li>
<li><a href="/time-calculators/date-calculator"><strong>Date Calculator</strong></a> — Add or subtract days, weeks, months.</li>
<li><a href="/time-calculators/deadline-calculator"><strong>Deadline Calculator</strong></a> — Compute deadlines from today.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to any date.</li>
</ul>
` }} />

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📅 Quick Links</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--s-3)" }}>
                    {VARIANTS.map((v) => (
                        <Link key={v.slug} href={`/time-calculators/months-from-today/${v.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{v.months} Month{v.months > 1 ? "s" : ""} From Today</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Months From Today FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "What Week of the Year Is It? — Current Week Number | Numerral",
    description: "Find the current ISO week number. See how many weeks have passed and how many remain in the year, with a complete week-number reference table.",
    keywords: ["week of the year", "what week is it", "week number", "ISO week", "current week number"],
    alternates: { canonical: canonicalUrl("/time-calculators/week-of-the-year") },
};

export default function WeekOfTheYearPage() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000);
    const weekOfYear = Math.ceil(dayOfYear / 7);
    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const totalWeeks = 52;
    const weeksLeft = totalWeeks - weekOfYear + 1;
    const pct = (weekOfYear / totalWeeks * 100).toFixed(1);

    /* Build week reference table for current quarter */
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const qStart = (quarter - 1) * 13 + 1;
    const qEnd = Math.min(quarter * 13, 52);
    const weekRows: { week: number; startDate: string; endDate: string; isCurrent: boolean }[] = [];
    for (let w = qStart; w <= qEnd; w++) {
        const s = new Date(year, 0, 1 + (w - 1) * 7);
        const e = new Date(s); e.setDate(e.getDate() + 6);
        weekRows.push({
            week: w,
            startDate: s.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            endDate: e.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            isCurrent: w === weekOfYear,
        });
    }

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Week of the Year" },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-woy" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Week of the Year" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Week of the Year Is It?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>Current week:</p>
                <p style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "var(--n-primary)" }}>Week {weekOfYear}</p>
                <p style={{ fontSize: "var(--t-h3)", marginTop: "var(--s-2)" }}>of {totalWeeks} weeks in {year}</p>
                <div style={{ maxWidth: 400, margin: "var(--s-4) auto 0", background: "var(--n-surface)", borderRadius: "var(--r-sm)", height: 24, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--n-primary)", borderRadius: "var(--r-sm)" }} />
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{pct}% elapsed — {weeksLeft > 0 ? weeksLeft : 0} week{weeksLeft !== 1 ? "s" : ""} remaining</p>
            </div>

            <section className="hub-content">
                <h2 id="q-table">Q{quarter} Week Reference — {year}</h2>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Week #</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Start</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>End</th>
                        </tr></thead>
                        <tbody>
                            {weekRows.map((r) => (
                                <tr key={r.week} style={{ background: r.isCurrent ? "color-mix(in srgb, var(--n-primary) 12%, transparent)" : r.week % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center", fontWeight: r.isCurrent ? 800 : 600 }}>{r.isCurrent ? `→ ${r.week}` : r.week}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{r.startDate}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{r.endDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="hub-content" style={{ marginTop: "var(--s-5)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="iso">What Is ISO Week Numbering?</h2>
<p>The ISO 8601 standard defines week 1 as the week containing the first Thursday of the year. Each ISO week starts on Monday and ends on Sunday. Most of the world (Europe, Asia) uses ISO weeks for business planning, payroll, and logistics.</p>
<p>The US and Canada less commonly use ISO weeks, but they're standard in software (Excel's <code>ISOWEEKNUM()</code>), international shipping, and manufacturing.</p>

<h2 id="uses">Who Uses Week Numbers?</h2>
<ul>
<li><strong>Payroll & HR:</strong> Biweekly pay cycles reference week numbers for period tracking.</li>
<li><strong>Manufacturing:</strong> Production schedules and lot codes use week numbers (e.g., "W14" = Week 14).</li>
<li><strong>Retail:</strong> Sales reporting and inventory planning by fiscal week.</li>
<li><strong>Agile/Scrum:</strong> Sprint planning tied to calendar week numbers.</li>
<li><strong>Logistics:</strong> Shipping and delivery schedules by week number across international supply chains.</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/todays-date"><strong>Today's Date</strong></a> — Current date in multiple formats.</li>
<li><a href="/time-calculators/day-of-the-year"><strong>Day of the Year</strong></a> — Current day number out of 365.</li>
<li><a href="/time-calculators/weeks-left-in-year"><strong>Weeks Left in ${year}</strong></a> — How many weeks remain.</li>
<li><a href="/time-calculators/weeks-from-today"><strong>Weeks From Today</strong></a> — Date N weeks from now.</li>
<li><a href="/time-calculators/week-calculator"><strong>Week Calculator</strong></a> — Weeks between two dates.</li>
</ul>
` }} />
        </main>
    );
}

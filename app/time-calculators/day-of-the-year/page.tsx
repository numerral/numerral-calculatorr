import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "What Day of the Year Is It? — Day Number Counter | Numerral",
    description: "Find today's day number out of 365 (or 366 in leap years). See the exact year progress with days elapsed and remaining.",
    keywords: ["day of the year", "what day of the year is it", "day number", "julian day", "day count"],
    alternates: { canonical: canonicalUrl("/time-calculators/day-of-the-year") },
};

export default function DayOfTheYearPage() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000);
    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const daysInYear = isLeap ? 366 : 365;
    const daysLeft = daysInYear - dayOfYear;
    const pct = (dayOfYear / daysInYear * 100).toFixed(1);

    const monthDays = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let cumulative = 0;
    const monthTable = monthNames.map((name, i) => {
        const start = cumulative + 1;
        cumulative += monthDays[i];
        return { name, days: monthDays[i], start, end: cumulative };
    });

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Day of the Year" },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-doy" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Day of the Year" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Day of the Year Is It?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>Today is:</p>
                <p style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "var(--n-primary)" }}>Day {dayOfYear}</p>
                <p style={{ fontSize: "var(--t-h3)", marginTop: "var(--s-2)" }}>of {daysInYear} days in {year}</p>
                <div style={{ maxWidth: 400, margin: "var(--s-4) auto 0", background: "var(--n-surface)", borderRadius: "var(--r-sm)", height: 24, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--n-primary)", borderRadius: "var(--r-sm)", transition: "width 0.3s" }} />
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{pct}% of {year} elapsed — {daysLeft} days remaining</p>
            </div>

            <section className="hub-content">
                <h2 id="month-table">Day Numbers by Month — {year}</h2>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Month</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Days</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Start Day #</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>End Day #</th>
                        </tr></thead>
                        <tbody>
                            {monthTable.map((m, i) => (
                                <tr key={m.name} style={{ background: i === now.getMonth() ? "color-mix(in srgb, var(--n-primary) 10%, transparent)" : i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: i === now.getMonth() ? 700 : 400 }}>{i === now.getMonth() ? `→ ${m.name}` : m.name}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{m.days}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{m.start}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{m.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="hub-content" style={{ marginTop: "var(--s-5)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="uses">Who Uses Day-of-Year Numbers?</h2>
<ul>
<li><strong>Military & aviation:</strong> Julian date codes (e.g., "Day 092" = April 2) appear on MREs, flight plans, and maintenance logs.</li>
<li><strong>Food industry:</strong> Manufacturing date codes on canned goods and packaged foods use day-of-year numbering.</li>
<li><strong>Astronomy:</strong> Julian Day Numbers are the standard for tracking celestial events and satellite passes.</li>
<li><strong>Insurance & finance:</strong> Some policy documents use ordinal day numbers for effective dates.</li>
<li><strong>Agriculture:</strong> Planting and harvest schedules reference "growing degree days" anchored to day-of-year counts.</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/todays-date"><strong>Today's Date</strong></a> — Current date in multiple formats.</li>
<li><a href="/time-calculators/week-of-the-year"><strong>Week of the Year</strong></a> — Current ISO week number.</li>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in ${year}</strong></a> — Countdown to year end.</li>
<li><a href="/time-calculators/weeks-left-in-year"><strong>Weeks Left in ${year}</strong></a> — Weeks remaining.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any date.</li>
</ul>
` }} />
        </main>
    );
}

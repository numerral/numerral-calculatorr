import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "What Is Today's Date? — Current Date & Day of the Week | Numerral",
    description: "Today's date displayed in multiple formats. See the current day of the week, day number of the year, week number, and days remaining in the year.",
    keywords: ["today's date", "what is today's date", "current date", "what day is it", "today date"],
    alternates: { canonical: canonicalUrl("/time-calculators/todays-date") },
};

export default function TodaysDatePage() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const full = now.toLocaleDateString("en-US", options);
    const iso = now.toISOString().split("T")[0];
    const mmddyyyy = `${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")}/${now.getFullYear()}`;
    const ddmmyyyy = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
    const monthName = now.toLocaleDateString("en-US", { month: "long" });
    const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
    const year = now.getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000);
    const daysInYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
    const daysLeft = daysInYear - dayOfYear;
    const weekOfYear = Math.ceil(dayOfYear / 7);
    const weeksLeft = Math.ceil(daysLeft / 7);
    const quarter = Math.ceil((now.getMonth() + 1) / 3);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Today's Date" },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-td" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Today's Date" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Is Today&apos;s Date?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>{full}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "var(--s-3)", maxWidth: 700, margin: "0 auto" }}>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>ISO Format</p><p style={{ fontWeight: 700 }}>{iso}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>US Format</p><p style={{ fontWeight: 700 }}>{mmddyyyy}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>EU Format</p><p style={{ fontWeight: 700 }}>{ddmmyyyy}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>Day of Year</p><p style={{ fontWeight: 700 }}>Day {dayOfYear} of {daysInYear}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>Week Number</p><p style={{ fontWeight: 700 }}>Week {weekOfYear}</p>
                    </div>
                    <div style={{ padding: "var(--s-3)", background: "var(--n-surface)", borderRadius: "var(--r-sm)" }}>
                        <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>Quarter</p><p style={{ fontWeight: 700 }}>Q{quarter}</p>
                    </div>
                </div>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="year-progress">Year Progress — ${year}</h2>
<table>
<thead><tr><th>Metric</th><th>Value</th></tr></thead>
<tbody>
<tr><td><strong>Today</strong></td><td>${dayName}, ${monthName} ${now.getDate()}, ${year}</td></tr>
<tr><td><strong>Day of the year</strong></td><td>${dayOfYear} of ${daysInYear} (${(dayOfYear / daysInYear * 100).toFixed(1)}% elapsed)</td></tr>
<tr><td><strong>Days remaining in ${year}</strong></td><td>${daysLeft} days</td></tr>
<tr><td><strong>Week number</strong></td><td>Week ${weekOfYear} of 52</td></tr>
<tr><td><strong>Weeks remaining</strong></td><td>${weeksLeft} weeks</td></tr>
<tr><td><strong>Quarter</strong></td><td>Q${quarter} of 4</td></tr>
<tr><td><strong>Leap year?</strong></td><td>${daysInYear === 366 ? "Yes — 366 days" : "No — 365 days"}</td></tr>
</tbody>
</table>

<h2 id="date-formats">Common Date Formats Used Today</h2>
<table>
<thead><tr><th>Format</th><th>Example</th><th>Used In</th></tr></thead>
<tbody>
<tr><td><strong>ISO 8601</strong></td><td>${iso}</td><td>International standard, software, APIs</td></tr>
<tr><td><strong>US (MM/DD/YYYY)</strong></td><td>${mmddyyyy}</td><td>United States, Philippines</td></tr>
<tr><td><strong>EU (DD/MM/YYYY)</strong></td><td>${ddmmyyyy}</td><td>Europe, South America, Asia, Africa</td></tr>
<tr><td><strong>Long format</strong></td><td>${full}</td><td>Formal documents, invitations</td></tr>
</tbody>
</table>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/day-of-the-year"><strong>Day of the Year</strong></a> — What day number is it out of 365?</li>
<li><a href="/time-calculators/week-of-the-year"><strong>Week of the Year</strong></a> — What ISO week number is it?</li>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in ${year}</strong></a> — How many days remain?</li>
<li><a href="/time-calculators/weeks-left-in-year"><strong>Weeks Left in ${year}</strong></a> — How many weeks remain?</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find a future date.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to any date.</li>
</ul>
` }} />
        </main>
    );
}

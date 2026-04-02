import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Weeks Left in the Year — Remaining Week Count",
    description: "See how many weeks remain in the current year. Includes upcoming US holiday milestones and year-end planning tips.",
    keywords: ["weeks left in year", "how many weeks left", "weeks remaining", "weeks left in 2026"],
    alternates: { canonical: canonicalUrl("/time-calculators/weeks-left-in-year") },
};

export default function WeeksLeftInYearPage() {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / 86400000);
    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const daysInYear = isLeap ? 366 : 365;
    const daysLeft = daysInYear - dayOfYear;
    const weeksLeft = Math.ceil(daysLeft / 7);
    const weeksPassed = 52 - weeksLeft;
    const pct = ((52 - weeksLeft) / 52 * 100).toFixed(1);

    /* Key remaining milestones */
    const milestones = [
        { name: "Memorial Day", date: new Date(year, 4, 26) },
        { name: "Independence Day", date: new Date(year, 6, 4) },
        { name: "Labor Day", date: new Date(year, 8, 7) },
        { name: "Halloween", date: new Date(year, 9, 31) },
        { name: "Thanksgiving", date: new Date(year, 10, 26) },
        { name: "Christmas", date: new Date(year, 11, 25) },
        { name: `New Year ${year + 1}`, date: new Date(year + 1, 0, 1) },
    ].filter((m) => m.date > now).map((m) => ({
        ...m,
        weeksAway: Math.ceil((m.date.getTime() - now.getTime()) / (7 * 86400000)),
        dateStr: m.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: `Weeks Left in ${year}` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wly" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: `Weeks Left in ${year}` }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>How Many Weeks Are Left in {year}?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "var(--n-primary)" }}>{weeksLeft} Weeks Left</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>{daysLeft} days remaining in {year} ({weeksPassed} of 52 weeks elapsed)</p>
                <div style={{ maxWidth: 400, margin: "var(--s-4) auto 0", background: "var(--n-surface)", borderRadius: "var(--r-sm)", height: 24, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--n-primary)", borderRadius: "var(--r-sm)" }} />
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>{pct}% of {year} complete</p>
            </div>

            {milestones.length > 0 && (
                <section className="hub-content">
                    <h2>Upcoming Milestones</h2>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Event</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Date</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Weeks Away</th>
                        </tr></thead>
                        <tbody>
                            {milestones.map((m, i) => (
                                <tr key={m.name} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", fontWeight: 600 }}>{m.name}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{m.dateStr}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{m.weeksAway}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <section className="hub-content" style={{ marginTop: "var(--s-5)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="planning">Year-End Planning Guide</h2>
<ul>
<li><strong>Q4 budgets:</strong> If you're in fiscal planning, the final 13 weeks of the year are critical for budget reconciliation, reforecasting, and capital expenditure decisions.</li>
<li><strong>Tax planning:</strong> Key deadlines include estimated tax payments (Sep 15, Jan 15), IRA contributions (Dec 31), and charitable donations (Dec 31).</li>
<li><strong>Open enrollment:</strong> Health insurance open enrollment typically runs November 1 – January 15 in most states.</li>
<li><strong>Holiday shopping:</strong> Plan Black Friday (late November), Cyber Monday, and shipping deadlines for Christmas.</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in ${year}</strong></a> — Exact days remaining.</li>
<li><a href="/time-calculators/week-of-the-year"><strong>Week of the Year</strong></a> — Current week number.</li>
<li><a href="/time-calculators/day-of-the-year"><strong>Day of the Year</strong></a> — Day number out of 365.</li>
<li><a href="/time-calculators/todays-date"><strong>Today's Date</strong></a> — Current date in all formats.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Live countdown to year end.</li>
</ul>
` }} />
        </main>
    );
}

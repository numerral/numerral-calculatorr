import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "What Month Is It? — Current Month & Year Info | Numerral",
    description: "Find out what month it is right now. See the current month number, days remaining, and season with a complete months-of-the-year reference.",
    keywords: ["what month is it", "current month", "month number", "months of the year"],
    alternates: { canonical: canonicalUrl("/time-calculators/current-month") },
};

const MONTHS = [
    { name: "January", num: 1, days: 31, season: "Winter", birthstone: "Garnet", flower: "Carnation" },
    { name: "February", num: 2, days: 28, season: "Winter", birthstone: "Amethyst", flower: "Violet" },
    { name: "March", num: 3, days: 31, season: "Spring", birthstone: "Aquamarine", flower: "Daffodil" },
    { name: "April", num: 4, days: 30, season: "Spring", birthstone: "Diamond", flower: "Daisy" },
    { name: "May", num: 5, days: 31, season: "Spring", birthstone: "Emerald", flower: "Lily of the Valley" },
    { name: "June", num: 6, days: 30, season: "Summer", birthstone: "Pearl", flower: "Rose" },
    { name: "July", num: 7, days: 31, season: "Summer", birthstone: "Ruby", flower: "Larkspur" },
    { name: "August", num: 8, days: 31, season: "Summer", birthstone: "Peridot", flower: "Gladiolus" },
    { name: "September", num: 9, days: 30, season: "Fall", birthstone: "Sapphire", flower: "Aster" },
    { name: "October", num: 10, days: 31, season: "Fall", birthstone: "Opal", flower: "Marigold" },
    { name: "November", num: 11, days: 30, season: "Fall", birthstone: "Topaz", flower: "Chrysanthemum" },
    { name: "December", num: 12, days: 31, season: "Winter", birthstone: "Tanzanite", flower: "Narcissus" },
];

export default function CurrentMonthPage() {
    const now = new Date();
    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const isLeap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
    const current = { ...MONTHS[monthIdx] };
    if (monthIdx === 1 && isLeap) current.days = 29;
    const dayOfMonth = now.getDate();
    const daysRemaining = current.days - dayOfMonth;

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Current Month" },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-cm" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Current Month" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>What Month Is It?</h1>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", marginBottom: "var(--s-5)", textAlign: "center" }}>
                <p style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "var(--n-primary)" }}>{current.name}</p>
                <p style={{ fontSize: "var(--t-h3)", marginTop: "var(--s-2)" }}>Month {current.num} of 12 — {year}</p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>Day {dayOfMonth} of {current.days} — <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left</strong> in {current.name}</p>
                <div style={{ maxWidth: 400, margin: "var(--s-4) auto 0", background: "var(--n-surface)", borderRadius: "var(--r-sm)", height: 24, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(dayOfMonth / current.days * 100).toFixed(0)}%`, background: "var(--n-primary)", borderRadius: "var(--r-sm)" }} />
                </div>
            </div>

            <section className="hub-content">
                <h2>Months of the Year — Reference Table</h2>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>#</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Month</th>
                            <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Days</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Season</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Birthstone</th>
                            <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)" }}>Flower</th>
                        </tr></thead>
                        <tbody>
                            {MONTHS.map((m, i) => (
                                <tr key={m.name} style={{ background: i === monthIdx ? "color-mix(in srgb, var(--n-primary) 12%, transparent)" : i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center", fontWeight: i === monthIdx ? 800 : 400 }}>{i === monthIdx ? "→" : ""} {m.num}</td>
                                    <td style={{ padding: "var(--s-3)", fontWeight: i === monthIdx ? 700 : 400 }}>{m.name}</td>
                                    <td style={{ padding: "var(--s-3)", textAlign: "center" }}>{i === 1 ? `${m.days}*` : m.days}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{m.season}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{m.birthstone}</td>
                                    <td style={{ padding: "var(--s-3)" }}>{m.flower}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>* February has 29 days in leap years. Next leap year: {isLeap ? year : year + (4 - year % 4)}.</p>
            </section>

            <section className="hub-content" style={{ marginTop: "var(--s-5)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="mnemonics">How to Remember Days in Each Month</h2>
<p>The classic rhyme: <em>"Thirty days hath September, April, June, and November. All the rest have thirty-one, except February alone, which has twenty-eight days clear, and twenty-nine in each leap year."</em></p>
<p><strong>Knuckle method:</strong> Make a fist. Each knuckle and valley represents a month. Knuckles = 31 days. Valleys = 30 days (except February). Start with your left index finger knuckle = January (31).</p>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/todays-date"><strong>Today's Date</strong></a> — Current date in all formats.</li>
<li><a href="/time-calculators/day-of-the-year"><strong>Day of the Year</strong></a> — Day number out of 365.</li>
<li><a href="/time-calculators/week-of-the-year"><strong>Week of the Year</strong></a> — Current ISO week number.</li>
<li><a href="/time-calculators/months-from-today"><strong>Months From Today</strong></a> — Date N months from now.</li>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in the Year</strong></a> — How many days remain.</li>
</ul>
` }} />
        </main>
    );
}

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Time Converter — Convert Hours, Minutes, Seconds & Days | Numerral",
    description: "Free online time converter. Convert between hours, minutes, seconds, days, and weeks with instant reference tables and formulas.",
    keywords: ["time converter", "convert hours to minutes", "convert minutes to seconds", "time unit converter"],
    alternates: { canonical: canonicalUrl("/time-calculators/time-converter") },
};

const CONVERTERS = [
    { slug: "hours-to-minutes", title: "Hours → Minutes", icon: "⏰", formula: "× 60" },
    { slug: "minutes-to-hours", title: "Minutes → Hours", icon: "⏱️", formula: "÷ 60" },
    { slug: "hours-to-seconds", title: "Hours → Seconds", icon: "⏲️", formula: "× 3,600" },
    { slug: "seconds-to-hours", title: "Seconds → Hours", icon: "🔢", formula: "÷ 3,600" },
    { slug: "minutes-to-seconds", title: "Minutes → Seconds", icon: "⏱", formula: "× 60" },
    { slug: "seconds-to-minutes", title: "Seconds → Minutes", icon: "⏰", formula: "÷ 60" },
    { slug: "days-to-hours", title: "Days → Hours", icon: "📅", formula: "× 24" },
    { slug: "hours-to-days", title: "Hours → Days", icon: "🗓️", formula: "÷ 24" },
    { slug: "weeks-to-days", title: "Weeks → Days", icon: "📆", formula: "× 7" },
    { slug: "days-to-weeks", title: "Days → Weeks", icon: "📋", formula: "÷ 7" },
    { slug: "days-to-minutes", title: "Days → Minutes", icon: "📊", formula: "× 1,440" },
    { slug: "weeks-to-hours", title: "Weeks → Hours", icon: "🕐", formula: "× 168" },
];

const FAQ_ITEMS = [
    { question: "How many seconds are in a day?", answer: "There are 86,400 seconds in a day (24 hours × 60 minutes × 60 seconds)." },
    { question: "How many minutes are in a week?", answer: "There are 10,080 minutes in a week (7 days × 24 hours × 60 minutes)." },
    { question: "How many hours are in a year?", answer: "A regular year has 8,760 hours (365 × 24). A leap year has 8,784 hours (366 × 24)." },
    { question: "What is the easiest way to convert time units?", answer: "Use multiplication to go to smaller units and division to go to larger units. Key factors: 60 (min↔sec, hr↔min), 24 (day↔hr), 7 (wk↔day)." },
];

const schema = JSON.stringify(breadcrumbSchema([
    { name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Time Converter" },
]));

export default function TimeConverterHub() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-tch" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Time Converter" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Time Unit Converter</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>
                Convert between hours, minutes, seconds, days, and weeks. Click any converter below for a full reference table.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--s-4)", marginBottom: "var(--s-6)" }}>
                {CONVERTERS.map((c) => (
                    <Link key={c.slug} href={`/time-calculators/time-converter/${c.slug}`}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-4) var(--s-5)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit", border: "1px solid var(--n-border)" }}>
                        <span style={{ fontWeight: 600, fontSize: "var(--t-body)" }}>{c.icon} {c.title}</span>
                        <span style={{ color: "var(--n-text-muted)", fontSize: "var(--t-body-sm)", fontFamily: "monospace" }}>{c.formula}</span>
                    </Link>
                ))}
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: `
<h2 id="reference">Quick Time Reference</h2>
<table>
<thead><tr><th>Unit</th><th>Equivalent</th></tr></thead>
<tbody>
<tr><td><strong>1 minute</strong></td><td>60 seconds</td></tr>
<tr><td><strong>1 hour</strong></td><td>60 minutes = 3,600 seconds</td></tr>
<tr><td><strong>1 day</strong></td><td>24 hours = 1,440 minutes = 86,400 seconds</td></tr>
<tr><td><strong>1 week</strong></td><td>7 days = 168 hours = 10,080 minutes</td></tr>
<tr><td><strong>1 month</strong></td><td>~30.44 days = ~730.5 hours (average)</td></tr>
<tr><td><strong>1 year</strong></td><td>365 days = 8,760 hours = 525,600 minutes</td></tr>
<tr><td><strong>1 leap year</strong></td><td>366 days = 8,784 hours = 527,040 minutes</td></tr>
</tbody>
</table>

<h2 id="how">How Time Units Work</h2>
<p>Time units follow a hierarchy: <strong>seconds → minutes → hours → days → weeks → months → years</strong>. Each level uses a different multiplier:</p>
<ul>
<li><strong>×60:</strong> Seconds → Minutes → Hours (base-60, inherited from Babylonian mathematics)</li>
<li><strong>×24:</strong> Hours → Days (based on Earth's rotation)</li>
<li><strong>×7:</strong> Days → Weeks (cultural convention, likely from the Book of Genesis)</li>
<li><strong>×30.44:</strong> Days → Months (average — actual months range from 28 to 31 days)</li>
<li><strong>×365.25:</strong> Days → Years (average, accounting for leap years)</li>
</ul>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/time-duration-calculator"><strong>Time Duration Calculator</strong></a> — Calculate time between two moments.</li>
<li><a href="/time-calculators/time-calculator"><strong>Time Calculator</strong></a> — Add and subtract time values.</li>
<li><a href="/time-calculators/military-time-converter"><strong>Military Time Converter</strong></a> — Convert between 12h and 24h time.</li>
<li><a href="/time-calculators/hours-from-now"><strong>Hours From Now</strong></a> — What time will it be in X hours?</li>
<li><a href="/time-calculators/digital-clock"><strong>Digital Clock</strong></a> — See the current time with seconds.</li>
</ul>
` }} />

            <FAQAccordion title="Time Conversion FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

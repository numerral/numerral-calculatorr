import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

/* ── All Time Conversion Definitions ── */
interface ConversionDef {
    slug: string;
    title: string;
    fromUnit: string;
    toUnit: string;
    formula: string;
    factor: number; // multiply input by this to get output
    icon: string;
    description: string;
    tableValues: number[];
    faq: { question: string; answer: string }[];
    relatedSlugs: string[];
    content: string;
}

const CONVERSIONS: ConversionDef[] = [
    {
        slug: "hours-to-minutes", title: "Hours to Minutes Converter", fromUnit: "hours", toUnit: "minutes",
        formula: "Minutes = Hours × 60", factor: 60, icon: "⏰",
        description: "Convert hours to minutes instantly. Reference table and formula for quick conversions.",
        tableValues: [0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12, 16, 24],
        faq: [
            { question: "How many minutes are in 1 hour?", answer: "There are exactly 60 minutes in 1 hour. This has been the standard since ancient Babylon, which used a base-60 (sexagesimal) number system." },
            { question: "How many minutes are in 8 hours?", answer: "8 hours = 480 minutes (8 × 60). This is the standard US workday." },
            { question: "How do I convert decimal hours to minutes?", answer: "Multiply the decimal portion by 60. For example, 2.5 hours = 2 hours + (0.5 × 60) = 2 hours 30 minutes = 150 minutes total." },
        ],
        relatedSlugs: ["minutes-to-hours", "hours-to-seconds", "hours-to-days"],
        content: `<h2>How to Convert Hours to Minutes</h2><p>Multiply the number of hours by <strong>60</strong> to get minutes. Each hour contains exactly 60 minutes.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Minutes = Hours × 60</p><h3>Examples</h3><ul><li>1.5 hours = 1.5 × 60 = <strong>90 minutes</strong></li><li>3.25 hours = 3.25 × 60 = <strong>195 minutes</strong></li><li>8 hours = 8 × 60 = <strong>480 minutes</strong> (standard workday)</li></ul><h2>Common Uses</h2><ul><li><strong>Payroll:</strong> Converting timecard decimal hours to minutes for wage calculations</li><li><strong>Cooking:</strong> Recipe timing (e.g., "bake for 1.5 hours" = 90 minutes)</li><li><strong>Project management:</strong> Converting estimated hours to minutes for scheduling</li><li><strong>Fitness:</strong> Workout duration tracking</li></ul>`,
    },
    {
        slug: "minutes-to-hours", title: "Minutes to Hours Converter", fromUnit: "minutes", toUnit: "hours",
        formula: "Hours = Minutes ÷ 60", factor: 1 / 60, icon: "⏱️",
        description: "Convert minutes to hours instantly. Reference table with decimal and fractional results.",
        tableValues: [5, 10, 15, 20, 25, 30, 45, 60, 75, 90, 100, 120, 150, 180, 240, 300, 360, 480, 720, 1440],
        faq: [
            { question: "How many hours is 90 minutes?", answer: "90 minutes = 1.5 hours (90 ÷ 60 = 1.5). That's 1 hour and 30 minutes." },
            { question: "How many hours is 480 minutes?", answer: "480 minutes = 8 hours (480 ÷ 60). This is the standard 8-hour workday." },
            { question: "How many hours is 1440 minutes?", answer: "1440 minutes = 24 hours = 1 full day (1440 ÷ 60 = 24)." },
        ],
        relatedSlugs: ["hours-to-minutes", "minutes-to-seconds", "minutes-to-days"],
        content: `<h2>How to Convert Minutes to Hours</h2><p>Divide the number of minutes by <strong>60</strong> to get hours.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Hours = Minutes ÷ 60</p><h3>Examples</h3><ul><li>45 minutes = 45 ÷ 60 = <strong>0.75 hours</strong></li><li>90 minutes = 90 ÷ 60 = <strong>1.5 hours</strong></li><li>480 minutes = 480 ÷ 60 = <strong>8 hours</strong></li></ul><h2>Common Uses</h2><ul><li><strong>Billing:</strong> Converting billable minutes to hours for invoicing (legal, consulting)</li><li><strong>Transportation:</strong> Flight and commute times often listed in minutes</li><li><strong>Exercise:</strong> Converting total workout minutes to hours for weekly tracking</li></ul>`,
    },
    {
        slug: "hours-to-seconds", title: "Hours to Seconds Converter", fromUnit: "hours", toUnit: "seconds",
        formula: "Seconds = Hours × 3,600", factor: 3600, icon: "⏲️",
        description: "Convert hours to seconds instantly. 1 hour = 3,600 seconds.",
        tableValues: [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 24],
        faq: [
            { question: "How many seconds are in 1 hour?", answer: "There are exactly 3,600 seconds in 1 hour (60 minutes × 60 seconds)." },
            { question: "How many seconds are in 24 hours?", answer: "24 hours = 86,400 seconds (24 × 3,600). This is the number of seconds in one day." },
        ],
        relatedSlugs: ["seconds-to-hours", "hours-to-minutes", "minutes-to-seconds"],
        content: `<h2>How to Convert Hours to Seconds</h2><p>Multiply hours by <strong>3,600</strong> (60 minutes × 60 seconds).</p><p style="text-align:center;font-weight:700;font-size:1.1em">Seconds = Hours × 3,600</p><h3>Key Values</h3><ul><li>1 hour = <strong>3,600 seconds</strong></li><li>8 hours = <strong>28,800 seconds</strong></li><li>24 hours = <strong>86,400 seconds</strong></li></ul><h2>Uses</h2><ul><li><strong>Science:</strong> Physics calculations (velocity, acceleration, energy)</li><li><strong>Computing:</strong> Performance benchmarks, timeout configurations</li><li><strong>Video:</strong> Frame count calculations (frames = seconds × FPS)</li></ul>`,
    },
    {
        slug: "seconds-to-hours", title: "Seconds to Hours Converter", fromUnit: "seconds", toUnit: "hours",
        formula: "Hours = Seconds ÷ 3,600", factor: 1 / 3600, icon: "🔢",
        description: "Convert seconds to hours. Reference table for common second values.",
        tableValues: [60, 300, 600, 900, 1800, 3600, 5400, 7200, 10800, 14400, 18000, 28800, 36000, 43200, 86400],
        faq: [
            { question: "How many hours is 3600 seconds?", answer: "3,600 seconds = exactly 1 hour." },
            { question: "How many hours is 86400 seconds?", answer: "86,400 seconds = 24 hours = 1 day." },
        ],
        relatedSlugs: ["hours-to-seconds", "seconds-to-minutes", "minutes-to-hours"],
        content: `<h2>How to Convert Seconds to Hours</h2><p>Divide seconds by <strong>3,600</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Hours = Seconds ÷ 3,600</p><h3>Examples</h3><ul><li>7,200 seconds = <strong>2 hours</strong></li><li>5,400 seconds = <strong>1.5 hours</strong></li><li>86,400 seconds = <strong>24 hours</strong></li></ul>`,
    },
    {
        slug: "minutes-to-seconds", title: "Minutes to Seconds Converter", fromUnit: "minutes", toUnit: "seconds",
        formula: "Seconds = Minutes × 60", factor: 60, icon: "⏱",
        description: "Convert minutes to seconds instantly. 1 minute = 60 seconds.",
        tableValues: [0.5, 1, 2, 3, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120],
        faq: [
            { question: "How many seconds are in 5 minutes?", answer: "5 minutes = 300 seconds (5 × 60)." },
            { question: "How many seconds are in 30 minutes?", answer: "30 minutes = 1,800 seconds (30 × 60)." },
        ],
        relatedSlugs: ["seconds-to-minutes", "minutes-to-hours", "hours-to-seconds"],
        content: `<h2>How to Convert Minutes to Seconds</h2><p>Multiply minutes by <strong>60</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Seconds = Minutes × 60</p><h3>Common Values</h3><ul><li>1 minute = <strong>60 seconds</strong></li><li>5 minutes = <strong>300 seconds</strong></li><li>30 minutes = <strong>1,800 seconds</strong></li><li>60 minutes = <strong>3,600 seconds</strong></li></ul><h2>Uses</h2><ul><li><strong>Sports:</strong> Race times, lap times, interval training</li><li><strong>Music:</strong> Song duration, metronome calculations</li><li><strong>Cooking:</strong> Microwave times, precise baking intervals</li></ul>`,
    },
    {
        slug: "seconds-to-minutes", title: "Seconds to Minutes Converter", fromUnit: "seconds", toUnit: "minutes",
        formula: "Minutes = Seconds ÷ 60", factor: 1 / 60, icon: "⏰",
        description: "Convert seconds to minutes. Quick reference table included.",
        tableValues: [10, 15, 30, 45, 60, 90, 120, 180, 240, 300, 600, 900, 1800, 3600],
        faq: [
            { question: "How many minutes is 300 seconds?", answer: "300 seconds = 5 minutes (300 ÷ 60)." },
            { question: "How many minutes is 3600 seconds?", answer: "3,600 seconds = 60 minutes = 1 hour." },
        ],
        relatedSlugs: ["minutes-to-seconds", "seconds-to-hours", "hours-to-minutes"],
        content: `<h2>How to Convert Seconds to Minutes</h2><p>Divide seconds by <strong>60</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Minutes = Seconds ÷ 60</p><h3>Examples</h3><ul><li>120 seconds = <strong>2 minutes</strong></li><li>180 seconds = <strong>3 minutes</strong></li><li>300 seconds = <strong>5 minutes</strong></li></ul>`,
    },
    {
        slug: "days-to-hours", title: "Days to Hours Converter", fromUnit: "days", toUnit: "hours",
        formula: "Hours = Days × 24", factor: 24, icon: "📅",
        description: "Convert days to hours. 1 day = 24 hours. Reference table for 1–365 days.",
        tableValues: [0.5, 1, 2, 3, 5, 7, 10, 14, 21, 28, 30, 60, 90, 180, 365],
        faq: [
            { question: "How many hours are in a day?", answer: "There are exactly 24 hours in one day. A day is defined as the time it takes Earth to complete one rotation on its axis." },
            { question: "How many hours are in a week?", answer: "1 week = 7 days × 24 hours = 168 hours." },
            { question: "How many hours are in a year?", answer: "1 year = 365 days × 24 hours = 8,760 hours (8,784 in a leap year)." },
        ],
        relatedSlugs: ["hours-to-days", "days-to-minutes", "weeks-to-days"],
        content: `<h2>How to Convert Days to Hours</h2><p>Multiply days by <strong>24</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Hours = Days × 24</p><h3>Key Values</h3><ul><li>1 day = <strong>24 hours</strong></li><li>7 days = <strong>168 hours</strong> (1 week)</li><li>30 days = <strong>720 hours</strong> (~1 month)</li><li>365 days = <strong>8,760 hours</strong> (1 year)</li></ul><h2>Uses</h2><ul><li><strong>Project management:</strong> Converting effort estimates from days to hours</li><li><strong>Travel:</strong> Trip duration planning</li><li><strong>Medicine:</strong> Medication intervals and dosing schedules</li></ul>`,
    },
    {
        slug: "hours-to-days", title: "Hours to Days Converter", fromUnit: "hours", toUnit: "days",
        formula: "Days = Hours ÷ 24", factor: 1 / 24, icon: "🗓️",
        description: "Convert hours to days. Quick reference table for common hour values.",
        tableValues: [1, 6, 8, 12, 24, 36, 48, 72, 96, 120, 168, 240, 336, 480, 720, 8760],
        faq: [
            { question: "How many days is 48 hours?", answer: "48 hours = 2 days (48 ÷ 24)." },
            { question: "How many days is 72 hours?", answer: "72 hours = 3 days (72 ÷ 24)." },
            { question: "How many days is 168 hours?", answer: "168 hours = 7 days = 1 week (168 ÷ 24)." },
        ],
        relatedSlugs: ["days-to-hours", "hours-to-minutes", "hours-to-seconds"],
        content: `<h2>How to Convert Hours to Days</h2><p>Divide hours by <strong>24</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Days = Hours ÷ 24</p><h3>Examples</h3><ul><li>48 hours = <strong>2 days</strong></li><li>72 hours = <strong>3 days</strong></li><li>168 hours = <strong>7 days</strong> (1 week)</li><li>8,760 hours = <strong>365 days</strong> (1 year)</li></ul>`,
    },
    {
        slug: "weeks-to-days", title: "Weeks to Days Converter", fromUnit: "weeks", toUnit: "days",
        formula: "Days = Weeks × 7", factor: 7, icon: "📆",
        description: "Convert weeks to days instantly. 1 week = 7 days. Reference table included.",
        tableValues: [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 16, 20, 24, 26, 36, 40, 52],
        faq: [
            { question: "How many days are in a week?", answer: "There are exactly 7 days in one week." },
            { question: "How many days are in 4 weeks?", answer: "4 weeks = 28 days (4 × 7). Note: 4 weeks ≠ 1 month (most months have 30 or 31 days)." },
            { question: "How many days are in 52 weeks?", answer: "52 weeks = 364 days (52 × 7). A year is 365 days, so 52 weeks is 1 day short of a full year." },
        ],
        relatedSlugs: ["days-to-weeks", "weeks-to-hours", "days-to-hours"],
        content: `<h2>How to Convert Weeks to Days</h2><p>Multiply weeks by <strong>7</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Days = Weeks × 7</p><h3>Key Values</h3><ul><li>1 week = <strong>7 days</strong></li><li>2 weeks = <strong>14 days</strong> (biweekly pay cycle)</li><li>4 weeks = <strong>28 days</strong></li><li>13 weeks = <strong>91 days</strong> (~1 quarter)</li><li>52 weeks = <strong>364 days</strong> (~1 year)</li></ul><h2>Uses</h2><ul><li><strong>Pregnancy:</strong> Tracking 40 weeks = 280 days</li><li><strong>Employment:</strong> Notice periods, probation durations</li><li><strong>Project planning:</strong> Sprint cycles, milestones</li></ul>`,
    },
    {
        slug: "days-to-weeks", title: "Days to Weeks Converter", fromUnit: "days", toUnit: "weeks",
        formula: "Weeks = Days ÷ 7", factor: 1 / 7, icon: "📋",
        description: "Convert days to weeks. Quick reference table for common day values.",
        tableValues: [1, 3, 5, 7, 10, 14, 21, 28, 30, 45, 60, 90, 100, 120, 180, 365],
        faq: [
            { question: "How many weeks is 30 days?", answer: "30 days = approximately 4.3 weeks (30 ÷ 7 = 4.286)." },
            { question: "How many weeks is 90 days?", answer: "90 days = approximately 12.9 weeks (90 ÷ 7 ≈ 12.86), roughly one quarter." },
            { question: "How many weeks is 365 days?", answer: "365 days = 52.14 weeks. That's why a year has 52 weeks plus 1 extra day (2 in leap years)." },
        ],
        relatedSlugs: ["weeks-to-days", "days-to-hours", "days-to-minutes"],
        content: `<h2>How to Convert Days to Weeks</h2><p>Divide days by <strong>7</strong>.</p><p style="text-align:center;font-weight:700;font-size:1.1em">Weeks = Days ÷ 7</p><h3>Examples</h3><ul><li>14 days = <strong>2 weeks</strong></li><li>30 days = <strong>4.29 weeks</strong></li><li>90 days = <strong>12.86 weeks</strong></li><li>365 days = <strong>52.14 weeks</strong></li></ul>`,
    },
    {
        slug: "days-to-minutes", title: "Days to Minutes Converter", fromUnit: "days", toUnit: "minutes",
        formula: "Minutes = Days × 1,440", factor: 1440, icon: "📊",
        description: "Convert days to minutes. 1 day = 1,440 minutes.",
        tableValues: [0.5, 1, 2, 3, 5, 7, 10, 14, 30, 60, 90, 365],
        faq: [
            { question: "How many minutes are in a day?", answer: "There are exactly 1,440 minutes in a day (24 hours × 60 minutes)." },
            { question: "How many minutes are in a week?", answer: "1 week = 10,080 minutes (7 × 1,440)." },
        ],
        relatedSlugs: ["minutes-to-days", "days-to-hours", "days-to-seconds"],
        content: `<h2>How to Convert Days to Minutes</h2><p>Multiply days by <strong>1,440</strong> (24 × 60).</p><p style="text-align:center;font-weight:700;font-size:1.1em">Minutes = Days × 1,440</p><h3>Key Values</h3><ul><li>1 day = <strong>1,440 minutes</strong></li><li>7 days = <strong>10,080 minutes</strong></li><li>30 days = <strong>43,200 minutes</strong></li></ul>`,
    },
    {
        slug: "weeks-to-hours", title: "Weeks to Hours Converter", fromUnit: "weeks", toUnit: "hours",
        formula: "Hours = Weeks × 168", factor: 168, icon: "🕐",
        description: "Convert weeks to hours. 1 week = 168 hours.",
        tableValues: [1, 2, 3, 4, 6, 8, 10, 12, 13, 16, 20, 26, 40, 52],
        faq: [
            { question: "How many hours are in a week?", answer: "There are exactly 168 hours in a week (7 days × 24 hours)." },
            { question: "How many work hours are in a week?", answer: "A standard US work week is 40 hours (5 days × 8 hours). This means only 23.8% of the week's 168 total hours are spent working." },
        ],
        relatedSlugs: ["hours-to-weeks", "weeks-to-days", "days-to-hours"],
        content: `<h2>How to Convert Weeks to Hours</h2><p>Multiply weeks by <strong>168</strong> (7 days × 24 hours).</p><p style="text-align:center;font-weight:700;font-size:1.1em">Hours = Weeks × 168</p><h3>Key Values</h3><ul><li>1 week = <strong>168 hours</strong></li><li>2 weeks = <strong>336 hours</strong></li><li>4 weeks = <strong>672 hours</strong></li><li>52 weeks = <strong>8,736 hours</strong></li></ul><h2>Work vs. Total Hours</h2><p>A 40-hour work week uses only 23.8% of the week's total 168 hours. The remaining 128 hours (76.2%) include sleep (~56 hours), commuting, and personal time.</p>`,
    },
];

const conversionMap = new Map(CONVERSIONS.map((c) => [c.slug, c]));

export function generateStaticParams() { return CONVERSIONS.map((c) => ({ converter: c.slug })); }

interface PageProps { params: Promise<{ converter: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { converter } = await params;
    const c = conversionMap.get(converter);
    if (!c) return {};
    return {
        title: `${c.title} — ${c.formula} | Numerral`,
        description: c.description,
        keywords: [c.slug.replace(/-/g, " "), `convert ${c.fromUnit} to ${c.toUnit}`, `${c.fromUnit} to ${c.toUnit}`, `how many ${c.toUnit} in ${c.fromUnit}`],
        alternates: { canonical: canonicalUrl(`/time-calculators/time-converter/${converter}`) },
    };
}

function formatNumber(n: number): string {
    if (Number.isInteger(n)) return n.toLocaleString("en-US");
    if (n < 0.01) return n.toFixed(6);
    if (n < 1) return n.toFixed(4);
    return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export default async function TimeConverterPage({ params }: PageProps) {
    const { converter } = await params;
    const c = conversionMap.get(converter);
    if (!c) notFound();

    const relatedConverters = c.relatedSlugs.map((s) => CONVERSIONS.find((x) => x.slug === s)).filter(Boolean) as ConversionDef[];

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Time Converter", url: canonicalUrl("/time-calculators/time-converter") },
        { name: c.title },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-tc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Time Converter", href: "/time-calculators/time-converter" }, { label: c.title }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{c.icon} {c.title}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Convert {c.fromUnit} to {c.toUnit} using the formula <strong>{c.formula}</strong>. Reference table below.</p>

            {/* Conversion table */}
            <div style={{ overflowX: "auto", marginBottom: "var(--s-6)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>
                        <th style={{ textAlign: "right", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700, textTransform: "capitalize" }}>{c.fromUnit}</th>
                        <th style={{ textAlign: "center", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700 }}>=</th>
                        <th style={{ textAlign: "left", padding: "var(--s-3)", borderBottom: "2px solid var(--n-border)", fontWeight: 700, textTransform: "capitalize" }}>{c.toUnit}</th>
                    </tr></thead>
                    <tbody>
                        {c.tableValues.map((v, i) => (
                            <tr key={v} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                <td style={{ textAlign: "right", padding: "var(--s-3)", fontWeight: 600 }}>{formatNumber(v)}</td>
                                <td style={{ textAlign: "center", padding: "var(--s-3)", color: "var(--n-text-muted)" }}>=</td>
                                <td style={{ textAlign: "left", padding: "var(--s-3)", fontWeight: 600, color: "var(--n-primary)" }}>{formatNumber(v * c.factor)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <section className="hub-content" dangerouslySetInnerHTML={{ __html: c.content }} />

            {/* Related converters */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🔄 Related Converters</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {relatedConverters.map((r) => (
                        <Link key={r.slug} href={`/time-calculators/time-converter/${r.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{r.icon} {r.title}</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/time-converter" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>All Time Converters</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>

            <FAQAccordion title={`${c.title} FAQ`} items={c.faq} />
        </main>
    );
}

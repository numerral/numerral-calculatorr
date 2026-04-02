import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CountdownTicker from "@/components/calculator/CountdownTicker";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

/* ────────────────────── Variant Registry ────────────────────── */

interface TimeVariant { slug: string; label: string; hour: number; minute: number; }
interface HolidayVariant {
    slug: string; label: string; emoji: string;
    getNextDate: () => Date;
    context: string;
    adjacentSlugs: string[];
}

function nthDayOfMonth(year: number, month: number, dayOfWeek: number, nth: number): Date {
    const first = new Date(year, month, 1);
    let d = ((dayOfWeek - first.getDay() + 7) % 7) + 1;
    d += (nth - 1) * 7;
    return new Date(year, month, d);
}
function lastDayOfMonth(year: number, month: number, dayOfWeek: number): Date {
    const last = new Date(year, month + 1, 0);
    const diff = ((last.getDay() - dayOfWeek + 7) % 7);
    return new Date(year, month, last.getDate() - diff);
}

function getEaster(year: number): Date {
    const a = year % 19, b = Math.floor(year / 100), c = year % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
}

function nextOccurrence(month: number, day: number): Date {
    const now = new Date(); const y = now.getFullYear();
    const d = new Date(y, month, day);
    return d >= now ? d : new Date(y + 1, month, day);
}
function nextOccurrenceComputed(fn: (y: number) => Date): Date {
    const now = new Date(); const y = now.getFullYear();
    const d = fn(y);
    return d >= now ? d : fn(y + 1);
}

const TIME_VARIANTS: TimeVariant[] = Array.from({ length: 24 }, (_, i) => {
    const suffix = i < 12 ? "am" : "pm";
    const hr = i === 0 ? 12 : i > 12 ? i - 12 : i;
    return { slug: `how-long-until-${hr}-00-${suffix}`, label: `${hr}:00 ${suffix.toUpperCase()}`, hour: i, minute: 0 };
});

const HOLIDAY_VARIANTS: HolidayVariant[] = [
    {
        slug: "days-until-new-years", label: "New Year's Day", emoji: "🎆",
        getNextDate: () => nextOccurrence(0, 1),
        context: "New Year's Day is a federal holiday marking the start of the calendar year. For many Americans, it's the culmination of New Year's Eve celebrations — and the start of New Year's resolutions, fiscal year planning, and annual tax preparation cycles.",
        adjacentSlugs: ["days-until-new-years-eve", "days-until-mlk-day", "days-until-super-bowl"],
    },
    {
        slug: "days-until-mlk-day", label: "Martin Luther King Jr. Day", emoji: "✊",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 0, 1, 3)),
        context: "MLK Day honors Dr. Martin Luther King Jr.'s legacy. Observed on the 3rd Monday in January, it's the first federal holiday of the year and a day of community service across the United States.",
        adjacentSlugs: ["days-until-new-years", "days-until-valentines-day", "days-until-presidents-day"],
    },
    {
        slug: "days-until-valentines-day", label: "Valentine's Day", emoji: "❤️",
        getNextDate: () => nextOccurrence(1, 14),
        context: "Valentine's Day on February 14 is the biggest holiday for the US floral, candy, and greeting card industries. Americans spend over $25 billion annually on Valentine's gifts, making advance planning essential.",
        adjacentSlugs: ["days-until-mlk-day", "days-until-presidents-day", "days-until-st-patricks-day"],
    },
    {
        slug: "days-until-presidents-day", label: "Presidents' Day", emoji: "🏛️",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 1, 1, 3)),
        context: "Presidents' Day falls on the 3rd Monday in February, honoring George Washington and Abraham Lincoln. It's one of the biggest retail sale weekends of the year — particularly for furniture, mattresses, and automobiles.",
        adjacentSlugs: ["days-until-valentines-day", "days-until-st-patricks-day", "days-until-easter"],
    },
    {
        slug: "days-until-st-patricks-day", label: "St. Patrick's Day", emoji: "☘️",
        getNextDate: () => nextOccurrence(2, 17),
        context: "St. Patrick's Day on March 17 celebrates Irish heritage and culture in the US. Major cities host parades (NYC, Chicago, Boston), and the Chicago River is famously dyed green every year.",
        adjacentSlugs: ["days-until-presidents-day", "days-until-easter", "days-until-mothers-day"],
    },
    {
        slug: "days-until-easter", label: "Easter", emoji: "🐣",
        getNextDate: () => nextOccurrenceComputed(getEaster),
        context: "Easter is a moveable feast calculated using the Computus formula: it falls on the first Sunday after the first full moon after the vernal equinox. In the US, Easter spending exceeds $20 billion annually on food, candy, gifts, and clothing.",
        adjacentSlugs: ["days-until-st-patricks-day", "days-until-mothers-day", "days-until-memorial-day"],
    },
    {
        slug: "days-until-mothers-day", label: "Mother's Day", emoji: "🌸",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 4, 0, 2)),
        context: "Mother's Day falls on the 2nd Sunday in May. It's the third-highest consumer spending holiday in the US (after Christmas and Back-to-School), with Americans spending over $30 billion on gifts, dining, and experiences.",
        adjacentSlugs: ["days-until-easter", "days-until-memorial-day", "days-until-fathers-day"],
    },
    {
        slug: "days-until-memorial-day", label: "Memorial Day", emoji: "🇺🇸",
        getNextDate: () => nextOccurrenceComputed((y) => lastDayOfMonth(y, 4, 1)),
        context: "Memorial Day falls on the last Monday in May and honors US military personnel who died in service. It also marks the unofficial start of summer, triggering major sales events and the opening of pools and beaches nationwide.",
        adjacentSlugs: ["days-until-mothers-day", "days-until-fathers-day", "days-until-juneteenth"],
    },
    {
        slug: "days-until-fathers-day", label: "Father's Day", emoji: "👔",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 5, 0, 3)),
        context: "Father's Day falls on the 3rd Sunday in June. Popular gift categories include electronics, tools, clothing, and experience gifts. US spending on Father's Day exceeds $22 billion annually.",
        adjacentSlugs: ["days-until-memorial-day", "days-until-juneteenth", "days-until-fourth-of-july"],
    },
    {
        slug: "days-until-juneteenth", label: "Juneteenth", emoji: "✊🏿",
        getNextDate: () => nextOccurrence(5, 19),
        context: "Juneteenth (June 19) commemorates the end of slavery in the United States. It became a federal holiday in 2021 — the first new federal holiday since MLK Day in 1983. Celebrations include community festivals, parades, and educational events.",
        adjacentSlugs: ["days-until-fathers-day", "days-until-fourth-of-july", "days-until-labor-day"],
    },
    {
        slug: "days-until-fourth-of-july", label: "Fourth of July", emoji: "🎆",
        getNextDate: () => nextOccurrence(6, 4),
        context: "Independence Day on July 4 celebrates the Declaration of Independence in 1776. Americans spend over $7 billion on food and over $2 billion on fireworks. When July 4 falls on a Saturday, the federal holiday is observed on Friday, July 3.",
        adjacentSlugs: ["days-until-juneteenth", "days-until-labor-day", "days-until-halloween"],
    },
    {
        slug: "days-until-labor-day", label: "Labor Day", emoji: "⚒️",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 8, 1, 1)),
        context: "Labor Day falls on the 1st Monday in September, honoring the American labor movement. It marks the unofficial end of summer and the start of back-to-school season — one of the biggest retail spending periods after the winter holidays.",
        adjacentSlugs: ["days-until-fourth-of-july", "days-until-halloween", "days-until-veterans-day"],
    },
    {
        slug: "days-until-halloween", label: "Halloween", emoji: "🎃",
        getNextDate: () => nextOccurrence(9, 31),
        context: "Halloween on October 31 is the second-largest consumer holiday in the US after Christmas. Americans spend over $12 billion on costumes, decorations, and candy. Trick-or-treating, haunted houses, and costume parties are the centerpiece traditions.",
        adjacentSlugs: ["days-until-labor-day", "days-until-election-day", "days-until-veterans-day"],
    },
    {
        slug: "days-until-election-day", label: "Election Day", emoji: "🗳️",
        getNextDate: () => {
            const now = new Date(); const y = now.getFullYear();
            const nov1 = new Date(y, 10, 1);
            const dayOfWeek = nov1.getDay();
            const firstTue = dayOfWeek <= 2 ? 1 + (2 - dayOfWeek) : 1 + (9 - dayOfWeek);
            const d = new Date(y, 10, firstTue + 1 > 7 ? firstTue : firstTue);
            // First Tuesday AFTER November 1
            const correctDay = dayOfWeek <= 2 ? 2 - dayOfWeek + 1 + 1 : 9 - dayOfWeek + 1 + 1;
            const elecDate = new Date(y, 10, Math.min(correctDay, 8));
            if (elecDate < now) {
                const ny = y + 1; const nNov1 = new Date(ny, 10, 1); const nDow = nNov1.getDay();
                const nDay = nDow <= 2 ? 3 - nDow : 10 - nDow;
                return new Date(ny, 10, nDay);
            }
            return elecDate;
        },
        context: "US Election Day falls on the first Tuesday after the first Monday in November. Federal elections occur every two years (even years for congressional races, every four years for presidential elections). Many states provide paid time off to vote.",
        adjacentSlugs: ["days-until-halloween", "days-until-veterans-day", "days-until-thanksgiving"],
    },
    {
        slug: "days-until-veterans-day", label: "Veterans Day", emoji: "🎖️",
        getNextDate: () => nextOccurrence(10, 11),
        context: "Veterans Day on November 11 honors all US military veterans. Unlike Memorial Day (which honors those who died in service), Veterans Day celebrates all who served. Many businesses offer veterans discounts and free meals.",
        adjacentSlugs: ["days-until-election-day", "days-until-thanksgiving", "days-until-christmas"],
    },
    {
        slug: "days-until-thanksgiving", label: "Thanksgiving", emoji: "🦃",
        getNextDate: () => nextOccurrenceComputed((y) => nthDayOfMonth(y, 10, 4, 4)),
        context: "Thanksgiving falls on the 4th Thursday in November. It's the busiest travel period of the year — TSA screens over 30 million passengers during the Thanksgiving travel window. Black Friday follows the next day, kicking off the holiday shopping season.",
        adjacentSlugs: ["days-until-veterans-day", "days-until-christmas-eve", "days-until-christmas"],
    },
    {
        slug: "days-until-christmas-eve", label: "Christmas Eve", emoji: "🕯️",
        getNextDate: () => nextOccurrence(11, 24),
        context: "Christmas Eve on December 24 is the last major shopping day before Christmas. Retailers generate billions in last-minute sales, and many families attend evening church services and exchange gifts.",
        adjacentSlugs: ["days-until-thanksgiving", "days-until-christmas", "days-until-new-years-eve"],
    },
    {
        slug: "days-until-christmas", label: "Christmas", emoji: "🎄",
        getNextDate: () => nextOccurrence(11, 25),
        context: "Christmas on December 25 is the largest consumer holiday in the United States. Total holiday season spending (November–December) exceeds $900 billion. Christmas is a federal holiday — banks, government offices, and most businesses are closed.",
        adjacentSlugs: ["days-until-christmas-eve", "days-until-new-years-eve", "days-until-new-years"],
    },
    {
        slug: "days-until-new-years-eve", label: "New Year's Eve", emoji: "🥂",
        getNextDate: () => nextOccurrence(11, 31),
        context: "New Year's Eve on December 31 is the biggest celebration night of the year. The ball drop in Times Square, New York City, is watched by over 1 billion people worldwide. Many Americans host parties, attend events, and watch fireworks to ring in the new year.",
        adjacentSlugs: ["days-until-christmas", "days-until-new-years", "days-until-super-bowl"],
    },
    {
        slug: "days-until-super-bowl", label: "Super Bowl", emoji: "🏈",
        getNextDate: () => {
            const now = new Date(); const y = now.getFullYear();
            const feb = nthDayOfMonth(y, 1, 0, 2);
            return feb >= now ? feb : nthDayOfMonth(y + 1, 1, 0, 2);
        },
        context: "The Super Bowl is the most-watched annual sporting event in the US, with over 115 million viewers. It's typically held on the 2nd Sunday in February. Super Bowl Sunday is the 2nd-largest food consumption day in the US after Thanksgiving.",
        adjacentSlugs: ["days-until-new-years-eve", "days-until-new-years", "days-until-valentines-day"],
    },
];

const ALL_VARIANTS = [
    ...TIME_VARIANTS.map((v) => v.slug),
    ...HOLIDAY_VARIANTS.map((v) => v.slug),
];
const variantMap = new Map<string, "time" | "holiday">();
TIME_VARIANTS.forEach((v) => variantMap.set(v.slug, "time"));
HOLIDAY_VARIANTS.forEach((v) => variantMap.set(v.slug, "holiday"));

/* ────────────────────── Static Params ────────────────────── */

export function generateStaticParams() {
    return ALL_VARIANTS.map((slug) => ({ variant: slug }));
}

/* ────────────────────── Metadata ────────────────────── */

interface PageProps { params: Promise<{ variant: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { variant } = await params;
    const type = variantMap.get(variant);
    if (!type) return {};

    if (type === "time") {
        const v = TIME_VARIANTS.find((t) => t.slug === variant)!;
        return {
            title: `How Long Until ${v.label}? — Live Countdown Timer | Numerral`,
            description: `Count down the time to ${v.label}. See hours, minutes, and seconds remaining until ${v.label} with a live, auto-updating countdown timer.`,
            alternates: { canonical: canonicalUrl(`/time-calculators/countdown-timer/${variant}`) },
        };
    }
    const v = HOLIDAY_VARIANTS.find((h) => h.slug === variant)!;
    return {
        title: `How Many Days Until ${v.label}? — Live Countdown | Numerral`,
        description: `Count down the days, hours, minutes, and seconds until ${v.label}. Live auto-updating countdown with holiday context and planning tips.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/countdown-timer/${variant}`) },
    };
}

/* ────────────────────── Page ────────────────────── */

export default async function CountdownVariantPage({ params }: PageProps) {
    const { variant } = await params;
    const type = variantMap.get(variant);
    if (!type) notFound();

    if (type === "time") return <TimeVariantPage variant={variant} />;
    return <HolidayVariantPage variant={variant} />;
}

/* ────────────── Time Variant Page ────────────── */

function TimeVariantPage({ variant }: { variant: string }) {
    const v = TIME_VARIANTS.find((t) => t.slug === variant)!;
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), v.hour, v.minute);
    if (target <= now) target.setDate(target.getDate() + 1);

    const formattedTarget = target.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const isPM = v.hour >= 12;
    const oppositeSlug = v.slug.replace(isPM ? "-pm" : "-am", isPM ? "-am" : "-pm");
    const oppositeLabel = v.label.replace(isPM ? "PM" : "AM", isPM ? "AM" : "PM");

    // Adjacent hours
    const idx = TIME_VARIANTS.findIndex((t) => t.slug === variant);
    const adj = [-2, -1, 1, 2].map((o) => TIME_VARIANTS[(idx + o + 24) % 24]);

    const totalMinutes = v.hour * 60 + v.minute;
    const hoursEquiv = (totalMinutes / 60).toFixed(1);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Countdown Timer", url: canonicalUrl("/time-calculators/countdown-timer") },
        { name: `How Long Until ${v.label}?` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-time-variant" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Time & Date Calculators", href: "/time-calculators" },
                { label: "Countdown Timer", href: "/time-calculators/countdown-timer" },
                { label: `How Long Until ${v.label}?` },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>How Long Until {v.label}?</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>
                Live countdown to {v.label} — {formattedTarget}. The timer below updates every second.
            </p>

            <CountdownTicker targetDate={target} label={`Counting down to ${v.label}`} showInputs={false} />

            {/* AM/PM toggle */}
            <div style={{ textAlign: "center", marginTop: "var(--s-4)" }}>
                <Link href={`/time-calculators/countdown-timer/${oppositeSlug}`}
                    style={{ fontSize: "var(--t-body-sm)", color: "var(--n-primary)" }}>
                    Looking for {oppositeLabel} instead? →
                </Link>
            </div>

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }}>
                <h2>How to Calculate the Time Until {v.label}</h2>
                <p>To manually calculate how long until {v.label}, subtract the current time from {v.label}. If {v.label} has already passed today, the countdown targets {v.label} tomorrow.</p>
                <p>For example, if it's currently 10:30 AM and you want to know how long until {v.label}:</p>
                <p style={{ textAlign: "center", fontWeight: 700 }}>Time remaining = {v.label} − Current Time</p>
                <p>The countdown above handles this automatically — including the day-rollover logic when the target time has passed for today. You can also use our <Link href="/time-calculators/time-duration-calculator">Time Duration Calculator</Link> for precise duration between any two times.</p>

                <h2>Time Equivalents</h2>
                <p>{v.label} is the same as {String(v.hour).padStart(2, "0")}:{String(v.minute).padStart(2, "0")} in <Link href="/time-calculators/military-time-converter">24-hour (military) time</Link>. That&apos;s {hoursEquiv} hours into the day, or {totalMinutes.toLocaleString()} minutes past midnight.</p>
            </section>

            {/* Adjacent times */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏰ More Countdown Timers</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/countdown-timer/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>How long until {a.label}?</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/countdown-timer"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>Custom Countdown Timer</span>
                        <span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                    <Link href="/time-calculators/days-from-today"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>Days From Today Calculator</span>
                        <span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

/* ────────────── Holiday Variant Page ────────────── */

function HolidayVariantPage({ variant }: { variant: string }) {
    const v = HOLIDAY_VARIANTS.find((h) => h.slug === variant)!;
    const target = v.getNextDate();
    const formatted = target.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const daysAway = Math.ceil(diffMs / 86400000);
    const weeksAway = (daysAway / 7).toFixed(1);
    const monthsAway = (daysAway / 30.44).toFixed(1);

    const adjacentHolidays = v.adjacentSlugs
        .map((s) => HOLIDAY_VARIANTS.find((h) => h.slug === s))
        .filter(Boolean) as HolidayVariant[];

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Countdown Timer", url: canonicalUrl("/time-calculators/countdown-timer") },
        { name: `Days Until ${v.label}` },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-holiday-variant" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Time & Date Calculators", href: "/time-calculators" },
                { label: "Countdown Timer", href: "/time-calculators/countdown-timer" },
                { label: `Days Until ${v.label}` },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                {v.emoji} How Many Days Until {v.label}?
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>
                {v.label} is <strong>{formatted}</strong> — approximately <strong>{daysAway} days</strong> ({weeksAway} weeks / {monthsAway} months) from today.
            </p>

            {/* Result Card */}
            <div style={{
                background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)",
                padding: "var(--s-5)", marginBottom: "var(--s-4)", textAlign: "center",
            }}>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>
                    {v.emoji} {v.label} is on:
                </p>
                <p style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 800, color: "var(--n-primary)" }}>
                    {formatted}
                </p>
                <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-2)" }}>
                    That&apos;s <strong>{daysAway} days</strong> • {weeksAway} weeks • {monthsAway} months from today
                </p>
            </div>

            <CountdownTicker targetDate={target} label={`Live Countdown to ${v.label}`} showInputs={false} />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }}>
                <h2>About {v.label}</h2>
                <p>{v.context}</p>

                <h2>How to Calculate Days Until {v.label}</h2>
                <p>You can calculate how many days until {v.label} by counting forward from today&apos;s date on a calendar. The simplest method is to break the count into full months and remaining days:</p>
                <ol>
                    <li>Count the number of complete months between now and {v.label}.</li>
                    <li>Multiply months × 30 (approximate) to get a rough day count.</li>
                    <li>Add the remaining individual days.</li>
                    <li>For exact results, use this countdown timer or our <Link href="/time-calculators/days-until-calculator">Days Until Calculator</Link>.</li>
                </ol>
                <p>The live countdown above handles leap years, variable month lengths, and year boundaries automatically.</p>
                <p>Looking for a specific number of days from today instead? Try our <Link href="/time-calculators/days-from-today">Days From Today Calculator</Link> to find the exact date N days from now.</p>
            </section>

            {/* Adjacent holidays */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🎉 More Holiday Countdowns</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--s-3)" }}>
                    {adjacentHolidays.map((h) => (
                        <Link key={h.slug} href={`/time-calculators/countdown-timer/${h.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{h.emoji} Days until {h.label}</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/countdown-timer"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>⏱️ Custom Countdown Timer</span>
                        <span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                    <Link href="/time-calculators/days-from-today"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>📅 Days From Today Calculator</span>
                        <span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

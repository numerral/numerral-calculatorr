import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CountdownTicker from "@/components/calculator/CountdownTicker";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const HOLIDAYS = [
    { slug: "days-until-new-years", label: "New Year's Day", date: "January 1" },
    { slug: "days-until-mlk-day", label: "Martin Luther King Jr. Day", date: "3rd Monday in January" },
    { slug: "days-until-valentines-day", label: "Valentine's Day", date: "February 14" },
    { slug: "days-until-presidents-day", label: "Presidents' Day", date: "3rd Monday in February" },
    { slug: "days-until-st-patricks-day", label: "St. Patrick's Day", date: "March 17" },
    { slug: "days-until-easter", label: "Easter", date: "Varies (Spring)" },
    { slug: "days-until-mothers-day", label: "Mother's Day", date: "2nd Sunday in May" },
    { slug: "days-until-memorial-day", label: "Memorial Day", date: "Last Monday in May" },
    { slug: "days-until-fathers-day", label: "Father's Day", date: "3rd Sunday in June" },
    { slug: "days-until-juneteenth", label: "Juneteenth", date: "June 19" },
    { slug: "days-until-fourth-of-july", label: "Fourth of July", date: "July 4" },
    { slug: "days-until-labor-day", label: "Labor Day", date: "1st Monday in September" },
    { slug: "days-until-halloween", label: "Halloween", date: "October 31" },
    { slug: "days-until-election-day", label: "Election Day", date: "1st Tuesday after Nov 1" },
    { slug: "days-until-veterans-day", label: "Veterans Day", date: "November 11" },
    { slug: "days-until-thanksgiving", label: "Thanksgiving", date: "4th Thursday in November" },
    { slug: "days-until-christmas-eve", label: "Christmas Eve", date: "December 24" },
    { slug: "days-until-christmas", label: "Christmas", date: "December 25" },
    { slug: "days-until-new-years-eve", label: "New Year's Eve", date: "December 31" },
    { slug: "days-until-super-bowl", label: "Super Bowl", date: "Varies (February)" },
];

function hourLabel(h: number) {
    if (h === 0) return "12:00 AM (Midnight)";
    if (h === 12) return "12:00 PM (Noon)";
    return h < 12 ? `${h}:00 AM` : `${h - 12}:00 PM`;
}
function hourSlug(h: number) {
    const suffix = h < 12 ? "am" : "pm";
    const hr = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `how-long-until-${hr}-00-${suffix}`;
}

export const metadata: Metadata = {
    title: "Countdown Timer to Any Date and Time — Live Days, Hours, Minutes & Seconds | Numerral",
    description: "Set a countdown timer to any future date and time. Watch days, hours, minutes, and seconds tick down live. Countdown to holidays, deadlines, events, and more.",
    keywords: ["countdown timer", "countdown to date", "how long until", "days until christmas", "countdown clock", "event countdown", "timer to date"],
    alternates: { canonical: canonicalUrl("/time-calculators/countdown-timer") },
};

const FAQ_ITEMS = [
    { question: "How does the countdown timer work?", answer: "Enter a target date and optional time, then click 'Start Countdown.' The timer calculates the difference between now and your target using JavaScript's Date object, converting the millisecond difference into days, hours, minutes, and seconds. It updates every second via setInterval." },
    { question: "How many days until Christmas 2026?", answer: "Christmas 2026 falls on Friday, December 25. Use the countdown timer above or visit our 'Days Until Christmas' page for a live countdown with holiday context and planning tips." },
    { question: "How many days until Thanksgiving 2026?", answer: "Thanksgiving 2026 is Thursday, November 26. It's always the 4th Thursday in November. Use our countdown timer or visit the 'Days Until Thanksgiving' page for a live ticker." },
    { question: "Can I count down to a specific time, not just a date?", answer: "Yes. The timer accepts both a date and an optional time. If you only set the date, it counts down to midnight (12:00 AM) of that date. Setting a specific time (e.g., 3:00 PM) counts down to that exact moment." },
    { question: "What happens when the countdown reaches zero?", answer: "When the countdown reaches zero, all four boxes (days, hours, minutes, seconds) display '00' and a 'Countdown has finished!' message appears. The timer stops updating." },
    { question: "How do I calculate a countdown in Excel?", answer: "Use the formula =B1-NOW() where B1 contains your target date/time. Format the result cell as custom: d \"days\" h \"hours\" m \"min\". For a live update, enable iterative calculations or use a VBA macro to auto-refresh." },
    { question: "What's the difference between a countdown timer and a stopwatch?", answer: "A countdown timer counts DOWN from a target time to zero (future → present). A stopwatch counts UP from zero (present → future). Timers are for deadlines; stopwatches are for measuring elapsed time." },
    { question: "How many hours until midnight?", answer: "The countdown timer automatically calculates this. Set the date to today and time to 11:59 PM (or leave the date as tomorrow with no time, which defaults to midnight). The live display shows the exact hours, minutes, and seconds remaining." },
    { question: "Does the countdown account for time zones?", answer: "The countdown timer uses your device's local time zone. If you're in Eastern Time and set a countdown to 3:00 PM, it counts down to 3:00 PM ET. For cross-timezone events, convert to your local time first." },
    { question: "How many days until the 4th of July 2026?", answer: "Independence Day 2026 falls on Saturday, July 4. Use our countdown timer or visit the 'Days Until Fourth of July' page. Since July 4 is on Saturday in 2026, the federal holiday will be observed on Friday, July 3." },
    { question: "How many days until summer 2026?", answer: "Summer 2026 begins with the summer solstice on Sunday, June 21. Use the countdown timer with June 21, 2026 as the target date to see the exact days, hours, minutes, and seconds remaining." },
    { question: "Can I use this for a New Year's Eve countdown?", answer: "Absolutely. Set the date to January 1 of the next year and the time to 12:00 AM. The timer will show the exact time remaining until midnight on New Year's Eve — perfect for parties and celebrations." },
];

export default function CountdownTimerHub() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
            { name: "Countdown Timer" },
        ]),
        webAppSchema("Countdown Timer", canonicalUrl("/time-calculators/countdown-timer")),
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-countdown" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Time & Date Calculators", href: "/time-calculators" },
                { label: "Countdown Timer" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Countdown Timer to Any Date and Time</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>
                Set a date and time to start a live countdown. Watch days, hours, minutes, and seconds tick down in real time — perfect for holidays, events, deadlines, and milestones.
            </p>

            <CountdownTicker />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }}
                dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
            />

            {/* ── Holiday Countdowns Grid ── */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>🎄 Countdown to US Holidays &amp; Events</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--s-3)" }}>
                    {HOLIDAYS.map((h) => (
                        <Link key={h.slug} href={`/time-calculators/countdown-timer/${h.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit", transition: "background 0.15s" }}>
                            <div>
                                <span style={{ fontWeight: 600, display: "block" }}>How many days until {h.label}?</span>
                                <span style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>{h.date}</span>
                            </div>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Time-Until Grid ── */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏰ How Long Until…?</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "var(--s-3)" }}>
                    {HOURS.map((h) => (
                        <Link key={h} href={`/time-calculators/countdown-timer/${hourSlug(h)}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit", transition: "background 0.15s" }}>
                            <span style={{ fontWeight: 600 }}>How long until {hourLabel(h)}?</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Countdown Timer FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
<h2 id="what-is-countdown">What Is a Countdown Timer?</h2>
<p>A <strong>countdown timer</strong> calculates the exact time remaining — in days, hours, minutes, and seconds — between the current moment and a future target date or time. Unlike a <a href="/time-calculators/days-until-calculator">Days Until Calculator</a> that shows a static number of days, a countdown timer updates <strong>every second in real time</strong>, creating a live, ticking display.</p>
<p>Countdown timers are used for event anticipation (holidays, weddings, product launches), deadline management (project due dates, filing deadlines, RSVP dates), and personal milestones (birthdays, retirement, anniversaries). The psychological effect of watching time tick away creates urgency and motivation — which is why countdowns are a staple of marketing, project management, and personal productivity.</p>

<h2 id="how-to-use">How to Use This Countdown Timer</h2>
<p>Using the countdown timer above is straightforward:</p>
<ol>
<li><strong>Set the date:</strong> Use the date picker to select your target date (required).</li>
<li><strong>Set the time (optional):</strong> Enter a specific time. If left blank, the countdown defaults to midnight (12:00 AM) of the selected date.</li>
<li><strong>Click "Start Countdown":</strong> The timer instantly begins calculating and displays the remaining time in four boxes: Days, Hours, Minutes, and Seconds.</li>
<li><strong>Watch it tick:</strong> The display updates every second. You can keep the page open and the countdown continues indefinitely with no need to refresh.</li>
</ol>
<p>When the countdown reaches zero, a "Countdown has finished!" message appears. To set a new countdown, simply change the date and time and click the button again.</p>

<h2 id="practical-uses">Practical Uses for Countdown Timers</h2>
<h3 id="event-planning">Event Planning</h3>
<p>Track the time until weddings, conferences, reunions, graduations, or any milestone event. Knowing that your event is "47 days, 6 hours away" is more actionable than "about 7 weeks" — it creates a concrete sense of urgency for preparation.</p>

<h3 id="holidays">US Holiday Countdowns</h3>
<p>The most popular countdown queries in the US are for major holidays: <a href="/time-calculators/countdown-timer/days-until-christmas">Christmas</a>, <a href="/time-calculators/countdown-timer/days-until-thanksgiving">Thanksgiving</a>, <a href="/time-calculators/countdown-timer/days-until-halloween">Halloween</a>, <a href="/time-calculators/countdown-timer/days-until-fourth-of-july">Fourth of July</a>, and <a href="/time-calculators/countdown-timer/days-until-new-years-eve">New Year's Eve</a>. See the quick links below for live countdowns to all major US holidays.</p>

<h3 id="deadlines">Deadline Management</h3>
<p>Project managers use countdowns to track deliverables, sprint deadlines, and release dates. A live ticker is more effective than a calendar reminder because it creates <strong>continuous awareness</strong> of remaining time. Use our <a href="/time-calculators/deadline-calculator">Deadline Calculator</a> to compute deadlines from a start date and lead time.</p>

<h3 id="personal-goals">Personal Goals & Milestones</h3>
<p>Set a countdown to your vacation, fitness challenge end date, retirement, savings goal target, or any personal milestone. Research shows that <strong>visual time tracking</strong> increases goal completion rates by making abstract deadlines feel tangible and immediate.</p>

<h3 id="classroom">Classroom & Education</h3>
<p>Teachers display countdowns to the end of class, final exams, school breaks, and project due dates. Students use them for study session pacing and exam preparation. A visible countdown reduces "how much longer?" questions and improves focus.</p>

<h2 id="how-calculated">How Countdowns Are Calculated</h2>
<p>The math behind a countdown timer is straightforward but precise:</p>
<p style="text-align:center;font-weight:700;font-size:1.1em">Remaining Time = Target Date/Time − Current Date/Time</p>
<p>This gives a raw difference in milliseconds, which is then converted:</p>
<table>
<thead><tr><th>Unit</th><th>Formula</th><th>Example (86,523 seconds remaining)</th></tr></thead>
<tbody>
<tr><td><strong>Days</strong></td><td>floor(totalSeconds ÷ 86,400)</td><td>1 day</td></tr>
<tr><td><strong>Hours</strong></td><td>floor((totalSeconds mod 86,400) ÷ 3,600)</td><td>0 hours</td></tr>
<tr><td><strong>Minutes</strong></td><td>floor((totalSeconds mod 3,600) ÷ 60)</td><td>2 minutes</td></tr>
<tr><td><strong>Seconds</strong></td><td>totalSeconds mod 60</td><td>3 seconds</td></tr>
</tbody>
</table>
<p>This modular arithmetic ensures each unit "rolls over" correctly — 60 seconds becomes 1 minute, 24 hours becomes 1 day, and so on.</p>

<h2 id="us-holidays">US Holidays — 2026 Quick Reference</h2>
<p>Use the grid below to jump to a live countdown for any major US holiday. Here are the key dates for 2026:</p>
<table>
<thead><tr><th>Holiday</th><th>Date</th><th>Day</th></tr></thead>
<tbody>
<tr><td>New Year's Day</td><td>January 1</td><td>Thursday</td></tr>
<tr><td>MLK Day</td><td>January 19</td><td>Monday</td></tr>
<tr><td>Valentine's Day</td><td>February 14</td><td>Saturday</td></tr>
<tr><td>Presidents' Day</td><td>February 16</td><td>Monday</td></tr>
<tr><td>St. Patrick's Day</td><td>March 17</td><td>Tuesday</td></tr>
<tr><td>Easter</td><td>April 5</td><td>Sunday</td></tr>
<tr><td>Mother's Day</td><td>May 10</td><td>Sunday</td></tr>
<tr><td>Memorial Day</td><td>May 25</td><td>Monday</td></tr>
<tr><td>Father's Day</td><td>June 21</td><td>Sunday</td></tr>
<tr><td>Juneteenth</td><td>June 19</td><td>Friday</td></tr>
<tr><td>Independence Day</td><td>July 4 (observed Jul 3)</td><td>Saturday</td></tr>
<tr><td>Labor Day</td><td>September 7</td><td>Monday</td></tr>
<tr><td>Halloween</td><td>October 31</td><td>Saturday</td></tr>
<tr><td>Veterans Day</td><td>November 11</td><td>Wednesday</td></tr>
<tr><td>Thanksgiving</td><td>November 26</td><td>Thursday</td></tr>
<tr><td>Christmas Eve</td><td>December 24</td><td>Thursday</td></tr>
<tr><td>Christmas</td><td>December 25</td><td>Friday</td></tr>
<tr><td>New Year's Eve</td><td>December 31</td><td>Thursday</td></tr>
</tbody>
</table>

<h2 id="time-zones">Time Zones & Countdown Accuracy</h2>
<p>This countdown timer uses your <strong>device's local time zone</strong>. If you're on the East Coast (ET) and set a countdown to 3:00 PM, it counts down to 3:00 PM Eastern — not Pacific, Central, or UTC.</p>
<p>For events that occur simultaneously worldwide (like a global product launch at a specific UTC time), convert to your local time first. The four major US time zones:</p>
<table>
<thead><tr><th>Zone</th><th>Abbreviation</th><th>UTC Offset (Standard)</th><th>UTC Offset (DST)</th></tr></thead>
<tbody>
<tr><td>Eastern</td><td>ET</td><td>UTC−5</td><td>UTC−4</td></tr>
<tr><td>Central</td><td>CT</td><td>UTC−6</td><td>UTC−5</td></tr>
<tr><td>Mountain</td><td>MT</td><td>UTC−7</td><td>UTC−6</td></tr>
<tr><td>Pacific</td><td>PT</td><td>UTC−8</td><td>UTC−7</td></tr>
</tbody>
</table>
<p>Use our <a href="/time-calculators/time-calculator">Time Calculator</a> to add or subtract hours across time zones, or our <a href="/time-calculators/military-time-converter">Military Time Converter</a> for unambiguous 24-hour notation.</p>

<h2 id="countdown-vs-timer">Countdown Timer vs. Timer vs. Stopwatch</h2>
<p>These three tools serve different purposes:</p>
<table>
<thead><tr><th>Tool</th><th>Direction</th><th>Use Case</th></tr></thead>
<tbody>
<tr><td><strong>Countdown Timer</strong> (this page)</td><td>Counts DOWN to a target</td><td>Events, deadlines, holidays</td></tr>
<tr><td><strong>Timer</strong></td><td>Counts DOWN from a set duration</td><td>Cooking, exercise sets, exams</td></tr>
<tr><td><strong>Stopwatch</strong></td><td>Counts UP from zero</td><td>Lap times, elapsed time, benchmarks</td></tr>
</tbody>
</table>
<p>A countdown timer targets a specific future date/time. A timer targets a specific duration (e.g., 30 minutes). A stopwatch measures how long something takes.</p>

<h2 id="excel-countdown">How to Make a Countdown in Excel or Google Sheets</h2>
<p>You can create a simple countdown in any spreadsheet:</p>
<table>
<thead><tr><th>Cell</th><th>Content</th><th>Purpose</th></tr></thead>
<tbody>
<tr><td><strong>A1</strong></td><td>12/25/2026 12:00 AM</td><td>Target date/time</td></tr>
<tr><td><strong>A2</strong></td><td>=NOW()</td><td>Current date/time (updates on recalculation)</td></tr>
<tr><td><strong>A3</strong></td><td>=A1-A2</td><td>Raw difference</td></tr>
<tr><td><strong>A4</strong></td><td>=INT(A3)</td><td>Full days remaining</td></tr>
<tr><td><strong>A5</strong></td><td>=TEXT(A3, "d \\d\\a\\y\\s h \\h\\r\\s m \\m\\i\\n")</td><td>Formatted display</td></tr>
</tbody>
</table>
<p><strong>Limitation:</strong> Excel and Sheets don't auto-refresh in real time. You must press F9 (Excel) or wait for auto-recalculation (Sheets) to update the countdown. For a true real-time experience, use the calculator above.</p>

<h2 id="related-tools">Related Time & Date Tools</h2>
<ul>
<li><a href="/time-calculators/days-until-calculator"><strong>Days Until Calculator</strong></a> — Static calculation of days, weeks, and months until any date.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today Calculator</strong></a> — Find the exact date N days from now.</li>
<li><a href="/time-calculators/date-calculator"><strong>Date Calculator</strong></a> — Add or subtract days, weeks, months, and years from any date.</li>
<li><a href="/time-calculators/deadline-calculator"><strong>Deadline Calculator</strong></a> — Calculate calendar and business-day deadlines from a start date.</li>
<li><a href="/time-calculators/business-days-calculator"><strong>Business Days Calculator</strong></a> — Count working days between two dates.</li>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in Year</strong></a> — Year progress tracker with visual bar.</li>
<li><a href="/time-calculators/time-duration-calculator"><strong>Time Duration Calculator</strong></a> — Duration between two times within a day.</li>
<li><a href="/time-calculators/date-duration-calculator"><strong>Date Duration Calculator</strong></a> — Years, months, and days between two dates.</li>
</ul>
`;

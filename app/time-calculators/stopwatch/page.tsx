import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import StopwatchComponent from "@/components/calculator/StopwatchComponent";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Online Stopwatch — Free Stopwatch with Lap Splits | Numerral",
    description: "Free online stopwatch with centisecond precision and lap split tracking. Start, stop, lap, and reset — perfect for sports, workouts, cooking, and time management.",
    keywords: ["online stopwatch", "stopwatch", "lap timer", "free stopwatch", "split timer", "elapsed time", "digital stopwatch"],
    alternates: { canonical: canonicalUrl("/time-calculators/stopwatch") },
};

const FAQ_ITEMS = [
    { question: "How accurate is the online stopwatch?", answer: "The stopwatch uses requestAnimationFrame for smooth display updates at ~60fps and tracks time using the Performance API (performance.now()), which provides sub-millisecond precision. Displayed accuracy is to the centisecond (hundredths of a second)." },
    { question: "Can I record lap splits?", answer: "Yes. Click the 'Lap' button while the stopwatch is running to record a split. The lap table shows both the split time (time since last lap) and the total elapsed time for each lap." },
    { question: "Does the stopwatch work in the background?", answer: "Yes. The stopwatch continues tracking time even if you switch to another browser tab. When you return, the elapsed time will be accurate." },
    { question: "What's the difference between a stopwatch and a timer?", answer: "A stopwatch counts UP from zero to measure how long something takes. A timer counts DOWN from a set duration to zero. Use a stopwatch for timing; use a timer for deadlines." },
    { question: "How do I use a stopwatch for interval training?", answer: "Start the stopwatch when your workout begins. Press 'Lap' at the end of each interval (e.g., every sprint or rest period). The split column shows each interval's duration, making it easy to track consistency." },
];

export default function StopwatchPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Stopwatch" }]),
        webAppSchema("Online Stopwatch", canonicalUrl("/time-calculators/stopwatch")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-sw" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Stopwatch" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Online Stopwatch</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Centisecond-precision stopwatch with lap split tracking. Start, stop, record laps, and reset — runs entirely in your browser.</p>
            <StopwatchComponent />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="how-to-use">How to Use the Stopwatch</h2>
<p>Click <strong>Start</strong> to begin timing. The display updates smoothly to the centisecond (hundredths of a second). Use <strong>Lap</strong> to record split times without stopping the clock — each lap shows both the split duration and total elapsed time in a table below.</p>
<p>Click <strong>Stop</strong> to freeze the display. You can then <strong>Resume</strong> to continue from the same point, or <strong>Reset</strong> to clear everything and start fresh.</p>

<h2 id="common-uses">Common Uses for Stopwatches</h2>
<h3>Sports & Athletics</h3>
<p>Track sprint times, swim splits, mile paces, and race results. The lap feature lets coaches record each athlete's individual splits for analysis.</p>
<h3>Workouts & HIIT</h3>
<p>Time your intervals, rest periods, and total workout duration. Use lap splits to ensure consistency across sets — if your 5th rep takes 50% longer than your 1st, it's time to reduce weight.</p>
<h3>Cooking</h3>
<p>Time recipes that need precise timing — soft-boiled eggs (6 minutes), searing steaks (3 minutes per side), or reducing sauces ("cook for 8–10 minutes, stirring occasionally").</p>
<h3>Games & Competitions</h3>
<p>Time board game turns, trivia rounds, debate speeches, or speed-solving puzzles. The digital display eliminates disputes over timing.</p>

<h2 id="stopwatch-vs-timer">Stopwatch vs. Timer vs. Countdown</h2>
<table><thead><tr><th>Tool</th><th>Direction</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><strong>Stopwatch</strong> (this page)</td><td>Counts UP from 0</td><td>Measuring elapsed time / laps</td></tr>
<tr><td><a href="/time-calculators/timer"><strong>Timer</strong></a></td><td>Counts DOWN from duration</td><td>Cooking, workouts, exams</td></tr>
<tr><td><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a></td><td>Counts DOWN to date/time</td><td>Events, holidays, deadlines</td></tr>
</tbody></table>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/timer"><strong>Timer</strong></a> — Count down from hours, minutes, and seconds.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any future date.</li>
<li><a href="/time-calculators/time-duration-calculator"><strong>Time Duration Calculator</strong></a> — Calculate duration between two times.</li>
<li><a href="/time-calculators/time-card-calculator"><strong>Time Card Calculator</strong></a> — Track work hours and payroll time.</li>
</ul>
` }} />
            <FAQAccordion title="Stopwatch FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

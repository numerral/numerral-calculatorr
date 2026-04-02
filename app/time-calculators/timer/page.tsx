import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TimerComponent from "@/components/calculator/TimerComponent";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Online Timer — Set Hours, Minutes & Seconds | Free Countdown Timer | Numerral",
    description: "Free online timer with hours, minutes, and seconds. Set any duration, start the countdown, and get an alert when time is up. Includes preset timers from 15 seconds to 4 hours.",
    keywords: ["online timer", "countdown timer", "set timer", "timer online", "minute timer", "timer with alarm", "free timer"],
    alternates: { canonical: canonicalUrl("/time-calculators/timer") },
};

const PRESETS = [
    { slug: "15-second-timer", label: "15 Second Timer", h: 0, m: 0, s: 15 },
    { slug: "30-second-timer", label: "30 Second Timer", h: 0, m: 0, s: 30 },
    { slug: "45-second-timer", label: "45 Second Timer", h: 0, m: 0, s: 45 },
    { slug: "60-second-timer", label: "60 Second Timer", h: 0, m: 1, s: 0 },
    { slug: "2-minute-timer", label: "2 Minute Timer", h: 0, m: 2, s: 0 },
    { slug: "3-minute-timer", label: "3 Minute Timer", h: 0, m: 3, s: 0 },
    { slug: "5-minute-timer", label: "5 Minute Timer", h: 0, m: 5, s: 0 },
    { slug: "10-minute-timer", label: "10 Minute Timer", h: 0, m: 10, s: 0 },
    { slug: "15-minute-timer", label: "15 Minute Timer", h: 0, m: 15, s: 0 },
    { slug: "20-minute-timer", label: "20 Minute Timer", h: 0, m: 20, s: 0 },
    { slug: "25-minute-timer", label: "25 Minute Timer", h: 0, m: 25, s: 0 },
    { slug: "30-minute-timer", label: "30 Minute Timer", h: 0, m: 30, s: 0 },
    { slug: "45-minute-timer", label: "45 Minute Timer", h: 0, m: 45, s: 0 },
    { slug: "1-hour-timer", label: "1 Hour Timer", h: 1, m: 0, s: 0 },
    { slug: "2-hour-timer", label: "2 Hour Timer", h: 2, m: 0, s: 0 },
    { slug: "3-hour-timer", label: "3 Hour Timer", h: 3, m: 0, s: 0 },
    { slug: "4-hour-timer", label: "4 Hour Timer", h: 4, m: 0, s: 0 },
];

const FAQ_ITEMS = [
    { question: "How do I set a timer for a specific duration?", answer: "Enter the hours, minutes, and seconds in the input fields above, then click 'Start.' The timer will count down to zero and alert you when time is up." },
    { question: "What is the Pomodoro Technique?", answer: "The Pomodoro Technique uses 25-minute focused work sessions followed by 5-minute breaks. After four sessions, take a longer 15–30 minute break. Use our 25-minute timer preset for each work session." },
    { question: "Does the timer work if I switch tabs?", answer: "Yes. The timer continues running in the background even if you switch to another browser tab. When the timer finishes, you'll hear an audio alert." },
    { question: "Can I pause and resume the timer?", answer: "Yes. Click 'Pause' to stop the timer at any point, then 'Resume' to continue from where you left off. Click 'Reset' to start over." },
    { question: "What's the difference between a timer and a countdown timer?", answer: "A timer counts down from a set duration (e.g., 30 minutes). A countdown timer counts down to a specific date and time (e.g., December 25). Use our Countdown Timer for date-based countdowns." },
    { question: "What are common timer durations?", answer: "The most common timer durations are: 1 minute (quick tasks), 5 minutes (short breaks), 15 minutes (meetings), 25 minutes (Pomodoro work sessions), 30 minutes (cooking), and 1 hour (deep work blocks)." },
];

export default function TimerPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
            { name: "Online Timer" },
        ]),
        webAppSchema("Online Timer", canonicalUrl("/time-calculators/timer")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-timer" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Online Timer" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Online Timer — Set Hours, Minutes &amp; Seconds</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Set any duration and start the countdown. The timer alerts you when time is up — perfect for cooking, workouts, Pomodoro sessions, exams, and more.</p>
            <TimerComponent />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏱️ Preset Timers</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--s-3)" }}>
                    {PRESETS.map((p) => (
                        <Link key={p.slug} href={`/time-calculators/timer/${p.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{p.label}</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Timer FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
<h2 id="how-to-use">How to Use the Online Timer</h2>
<p>Enter the desired duration using the hours, minutes, and seconds fields, then click <strong>Start</strong>. The timer begins counting down immediately, displaying the remaining time in large, easy-to-read digits.</p>
<p>You can <strong>pause</strong> the timer at any point and <strong>resume</strong> later — the remaining time is preserved. When the countdown reaches zero, an audio alert notifies you that time is up. Click <strong>Reset</strong> to start a new timer.</p>

<h2 id="common-uses">Common Uses for Timers</h2>
<h3>Cooking & Baking</h3>
<p>Set a timer for baking (e.g., 25 minutes for cookies, 45 minutes for bread, 1 hour for roasts). Multiple timers let you track different dishes simultaneously. Never overcook or undercook again.</p>
<h3>Pomodoro Technique</h3>
<p>The Pomodoro Technique is one of the most effective productivity methods. Work for 25 minutes, take a 5-minute break, repeat. After four cycles, take a longer 15–30 minute break. Use our <strong>25-minute preset</strong> for work sessions and <strong>5-minute preset</strong> for breaks.</p>
<h3>Exercise & Workouts</h3>
<p>Time your HIIT intervals (30 seconds work / 15 seconds rest), plank holds, stretching routines, or rest periods between weight sets. Use the preset timers below for common workout intervals.</p>
<h3>Exams & Testing</h3>
<p>Set the exact exam duration to practice time management. SAT sections range from 25–65 minutes; ACT sections are 35–60 minutes. GRE section timers run 30–35 minutes. Timed practice under real conditions is the single most effective test prep strategy.</p>
<h3>Meetings & Presentations</h3>
<p>Keep meetings on track by setting a timer for each agenda item. The visible countdown prevents discussions from running over and ensures every topic gets covered.</p>

<h2 id="timer-vs-stopwatch">Timer vs. Stopwatch</h2>
<p>A <strong>timer</strong> counts <em>down</em> from a set duration to zero — you know the end point in advance. A <strong><a href="/time-calculators/stopwatch">stopwatch</a></strong> counts <em>up</em> from zero — you measure how long something takes. Use a timer when you have a deadline; use a stopwatch when you're measuring elapsed time.</p>
<p>For counting down to a specific <em>date</em> rather than a duration, use our <a href="/time-calculators/countdown-timer">Countdown Timer</a>.</p>

<h2 id="related-tools">Related Tools</h2>
<ul>
<li><a href="/time-calculators/stopwatch"><strong>Stopwatch</strong></a> — Count up with lap splits and precise timing.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any future date and time.</li>
<li><a href="/time-calculators/time-calculator"><strong>Time Calculator</strong></a> — Add or subtract hours, minutes, and seconds.</li>
<li><a href="/time-calculators/time-duration-calculator"><strong>Time Duration Calculator</strong></a> — Calculate exact duration between two times.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the exact date N days from now.</li>
</ul>
`;

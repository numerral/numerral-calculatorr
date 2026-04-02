import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TimerComponent from "@/components/calculator/TimerComponent";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

const PRESETS = [
    { slug: "15-second-timer", label: "15 Second Timer", h: 0, m: 0, s: 15, desc: "A 15-second timer is ideal for quick transitions, micro-rest intervals in HIIT workouts, and rapid task switches. In fitness, 15-second rest intervals maintain an elevated heart rate for maximum calorie burn." },
    { slug: "30-second-timer", label: "30 Second Timer", h: 0, m: 0, s: 30, desc: "30 seconds is the standard HIIT work interval. It's also the duration of many TV and radio commercial slots, and the recommended duration for effective hand washing (per CDC guidelines)." },
    { slug: "45-second-timer", label: "45 Second Timer", h: 0, m: 0, s: 45, desc: "A 45-second timer is commonly used for intense workout intervals, speed reading exercises, and quick brainstorming bursts. It's long enough for focused effort but short enough to maintain intensity." },
    { slug: "60-second-timer", label: "60 Second Timer", h: 0, m: 1, s: 0, desc: "One minute is the most universal timer duration. Use it for plank holds, teeth brushing (dentists recommend 2 minutes — two 60-second intervals), elevator pitches, and quick mental resets between tasks." },
    { slug: "2-minute-timer", label: "2 Minute Timer", h: 0, m: 2, s: 0, desc: "Two minutes is the ADA-recommended duration for brushing teeth. It's also a common rest period between strength training sets, the length of military-style pushup tests, and a good duration for guided breathing exercises." },
    { slug: "3-minute-timer", label: "3 Minute Timer", h: 0, m: 3, s: 0, desc: "Three minutes is a standard boxing round duration and a common egg-boiling time for soft-boiled eggs. It's also the ideal duration for a micro-meditation break during the workday." },
    { slug: "5-minute-timer", label: "5 Minute Timer", h: 0, m: 5, s: 0, desc: "Five minutes is the standard Pomodoro break interval. It's also used for quick classroom transitions, meeting buffer time, and the 'five-minute rule' in productivity (commit to just 5 minutes of a dreaded task to overcome inertia)." },
    { slug: "10-minute-timer", label: "10 Minute Timer", h: 0, m: 10, s: 0, desc: "Ten minutes is the recommended duration for power naps (NASA research shows a 10-minute nap improves alertness for up to 3 hours). Also common for guided meditation sessions and quick household cleaning bursts." },
    { slug: "15-minute-timer", label: "15 Minute Timer", h: 0, m: 15, s: 0, desc: "Fifteen minutes is a standard meeting segment, school period transition, and the minimum effective exercise duration for health benefits according to WHO guidelines. It's also the billing increment for many professional services." },
    { slug: "20-minute-timer", label: "20 Minute Timer", h: 0, m: 20, s: 0, desc: "Twenty minutes is the optimal power nap duration per sleep research. It's also the 20-20-20 rule base for eye strain prevention (every 20 minutes, look at something 20 feet away for 20 seconds)." },
    { slug: "25-minute-timer", label: "25 Minute Timer", h: 0, m: 25, s: 0, desc: "Twenty-five minutes is the core Pomodoro Technique work session. Developed by Francesco Cirillo in the 1980s, this duration maximizes focus while preventing burnout. Four 25-minute sessions with short breaks equal a full Pomodoro cycle." },
    { slug: "30-minute-timer", label: "30 Minute Timer", h: 0, m: 30, s: 0, desc: "Thirty minutes is the minimum recommended daily exercise duration from the American Heart Association. It's also a standard TV episode length, a common laundry cycle time, and a standard therapy session." },
    { slug: "45-minute-timer", label: "45 Minute Timer", h: 0, m: 45, s: 0, desc: "Forty-five minutes is a standard classroom period in US high schools and many college courses. It's also a common yoga session length, bread proofing time, and the ideal duration for focused deep work sessions." },
    { slug: "1-hour-timer", label: "1 Hour Timer", h: 1, m: 0, s: 0, desc: "One hour is the standard deep-work block for knowledge workers. It's also the average commute time in many US metro areas, a standard therapy session, and the minimum parking meter increment in most cities." },
    { slug: "2-hour-timer", label: "2 Hour Timer", h: 2, m: 0, s: 0, desc: "Two hours is a common exam duration (SAT sections combined, GRE, many college finals). It's also the average feature film length and a standard study block recommended by academic advisors." },
    { slug: "3-hour-timer", label: "3 Hour Timer", h: 3, m: 0, s: 0, desc: "Three hours is the total SAT exam duration and a common slow-cooker setting for smaller cuts of meat. It's also the recommended maximum continuous study time before taking a significant break." },
    { slug: "4-hour-timer", label: "4 Hour Timer", h: 4, m: 0, s: 0, desc: "Four hours is a half-day work block, a common slow-cooker 'high' setting for large roasts, and the duration of many professional certification exams (CPA, bar exam sections)." },
];

const presetMap = new Map(PRESETS.map((p) => [p.slug, p]));

export function generateStaticParams() { return PRESETS.map((p) => ({ preset: p.slug })); }

interface PageProps { params: Promise<{ preset: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { preset } = await params;
    const p = presetMap.get(preset);
    if (!p) return {};
    return {
        title: `${p.label} — Free Online ${p.label} | Numerral`,
        description: `Start a ${p.label.toLowerCase()} instantly. Watch the countdown in real time and get an alert when time is up. No download required.`,
        alternates: { canonical: canonicalUrl(`/time-calculators/timer/${preset}`) },
    };
}

export default async function TimerPresetPage({ params }: PageProps) {
    const { preset } = await params;
    const p = presetMap.get(preset);
    if (!p) notFound();

    const idx = PRESETS.findIndex((x) => x.slug === preset);
    const adj = [-2, -1, 1, 2].map((o) => PRESETS.at((idx + o) % PRESETS.length)!);

    const schema = JSON.stringify(breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
        { name: "Timer", url: canonicalUrl("/time-calculators/timer") },
        { name: p.label },
    ]));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-preset" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Timer", href: "/time-calculators/timer" }, { label: p.label }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{p.label}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Click Start to begin the {p.label.toLowerCase()}. The countdown runs in your browser and alerts you when time is up.</p>

            <TimerComponent initialHours={p.h} initialMinutes={p.m} initialSeconds={p.s} autoStart={false} label={p.label} />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }}>
                <h2>About the {p.label}</h2>
                <p>{p.desc}</p>
                <p>Need a different duration? Use our <Link href="/time-calculators/timer">custom timer</Link> to set any hours, minutes, and seconds combination. For counting down to a specific date, try our <Link href="/time-calculators/countdown-timer">Countdown Timer</Link>.</p>
            </section>

            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>⏱️ More Timers</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "var(--s-3)" }}>
                    {adj.map((a) => (
                        <Link key={a.slug} href={`/time-calculators/timer/${a.slug}`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                            <span style={{ fontWeight: 600 }}>{a.label}</span>
                            <span style={{ color: "var(--n-primary)" }}>→</span>
                        </Link>
                    ))}
                    <Link href="/time-calculators/timer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>Custom Timer</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                    <Link href="/time-calculators/stopwatch" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontWeight: 600 }}>Stopwatch</span><span style={{ color: "var(--n-primary)" }}>→</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}

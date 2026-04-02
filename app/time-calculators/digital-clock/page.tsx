import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import DigitalClockWidget from "@/components/calculator/DigitalClockWidget";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Digital Clock — Live Online Clock with Seconds | Numerral",
    description: "Free online digital clock showing the current time with seconds. Displays 12-hour and 24-hour formats with automatic timezone detection.",
    keywords: ["digital clock", "online clock", "current time", "live clock", "clock with seconds"],
    alternates: { canonical: canonicalUrl("/time-calculators/digital-clock") },
};

const FAQ_ITEMS = [
    { question: "Is the digital clock accurate?", answer: "The clock syncs with your device's system time, which is typically accurate to within a second of atomic time (if your device uses NTP synchronization). For scientific-grade precision, refer to time.gov or time.is." },
    { question: "What timezone does the clock show?", answer: "The clock automatically detects and displays your device's local timezone. The timezone name is shown below the time display." },
    { question: "What is 24-hour time?", answer: "24-hour time (also called military time) counts hours from 00:00 (midnight) to 23:59 (11:59 PM). It eliminates AM/PM ambiguity. Common in Europe, military, aviation, healthcare, and computing." },
    { question: "What is the difference between UTC and GMT?", answer: "GMT (Greenwich Mean Time) is a timezone; UTC (Coordinated Universal Time) is a time standard. In practice they're identical, but UTC is the official standard used by scientists and the internet." },
];

export default function DigitalClockPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Digital Clock" }]),
        webAppSchema("Digital Clock", canonicalUrl("/time-calculators/digital-clock")),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-dc" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Digital Clock" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Digital Clock — What Time Is It?</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Live digital clock with seconds. Shows your local time with automatic timezone detection.</p>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: "var(--r-lg)", padding: "var(--s-6)" }}>
                <DigitalClockWidget />
            </div>

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="us-time-zones">US Time Zones</h2>
<table>
<thead><tr><th>Zone</th><th>Abbreviation</th><th>UTC Offset (Standard)</th><th>UTC Offset (DST)</th><th>Major Cities</th></tr></thead>
<tbody>
<tr><td><strong>Eastern</strong></td><td>EST / EDT</td><td>UTC-5</td><td>UTC-4</td><td>New York, Miami, Atlanta, Boston</td></tr>
<tr><td><strong>Central</strong></td><td>CST / CDT</td><td>UTC-6</td><td>UTC-5</td><td>Chicago, Houston, Dallas, Nashville</td></tr>
<tr><td><strong>Mountain</strong></td><td>MST / MDT</td><td>UTC-7</td><td>UTC-6</td><td>Denver, Phoenix*, Salt Lake City</td></tr>
<tr><td><strong>Pacific</strong></td><td>PST / PDT</td><td>UTC-8</td><td>UTC-7</td><td>Los Angeles, San Francisco, Seattle</td></tr>
<tr><td><strong>Alaska</strong></td><td>AKST / AKDT</td><td>UTC-9</td><td>UTC-8</td><td>Anchorage, Fairbanks, Juneau</td></tr>
<tr><td><strong>Hawaii</strong></td><td>HST</td><td>UTC-10</td><td>No DST</td><td>Honolulu, Maui, Hilo</td></tr>
</tbody>
</table>
<p>*Arizona (Mountain Time) does not observe Daylight Saving Time, except on the Navajo Nation.</p>

<h2 id="dst">Daylight Saving Time</h2>
<p>DST in the US begins the <strong>second Sunday of March</strong> (clocks "spring forward" 1 hour at 2:00 AM) and ends the <strong>first Sunday of November</strong> (clocks "fall back" 1 hour at 2:00 AM).</p>
<p><strong>States that do NOT observe DST:</strong> Hawaii, most of Arizona, and US territories (Puerto Rico, US Virgin Islands, Guam, American Samoa).</p>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/todays-date"><strong>Today's Date</strong></a> — Current date in all formats.</li>
<li><a href="/time-calculators/timer"><strong>Timer</strong></a> — Set a countdown timer.</li>
<li><a href="/time-calculators/stopwatch"><strong>Stopwatch</strong></a> — Time events with lap splits.</li>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any date.</li>
<li><a href="/time-calculators/military-time-converter"><strong>Military Time Converter</strong></a> — Convert between 12h and 24h time.</li>
<li><a href="/time-calculators/hours-from-now"><strong>Hours From Now</strong></a> — What time will it be in X hours?</li>
</ul>
` }} />

            <FAQAccordion title="Digital Clock FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

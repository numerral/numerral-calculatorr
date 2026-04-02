import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CountdownTicker from "@/components/calculator/CountdownTicker";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "School Countdown — Days Until End of School & Back to School 2026 | Numerral",
    description: "Count down the days until the end of school or the start of the new school year. Live countdown timer for students, parents, and teachers across all US states.",
    keywords: ["school countdown", "end of school countdown", "how many days until school ends", "back to school countdown", "last day of school", "first day of school 2026"],
    alternates: { canonical: canonicalUrl("/time-calculators/school-countdown") },
};

const FAQ_ITEMS = [
    { question: "When does school end in 2026?", answer: "School end dates vary by state and district. Most US public schools end between late May and mid-June. Check your school district's calendar for exact dates. Common end dates range from May 22 (some Southern states) to June 26 (some Northeastern states)." },
    { question: "When does school start in 2026?", answer: "Most US schools start between early August and early September. Southern states (Georgia, Texas, Florida) often start in early-to-mid August, while Northeastern states (New York, Massachusetts) typically start after Labor Day." },
    { question: "How many school days are in a year?", answer: "Most US states require 170–180 school days per year. The most common requirement is 180 days. Some states measure by instructional hours instead (e.g., Colorado requires 1,056 hours for elementary school)." },
    { question: "Do snow days extend the school year?", answer: "It depends on the district. Many districts build 2–5 'snow days' into the calendar. If more days are missed, the school year may be extended into June, or districts may convert to remote learning days (a practice normalized after COVID-19)." },
    { question: "When is spring break 2026?", answer: "Spring break dates vary widely by district. Most fall between mid-March and mid-April. Common timeframes include the weeks surrounding Easter (April 5, 2026). Check your district's academic calendar for exact dates." },
    { question: "How long is summer break?", answer: "Summer vacation in the US typically lasts 10–12 weeks (roughly mid-June to late August/early September). Year-round school calendars provide shorter, more frequent breaks instead of one long summer." },
];

export default function SchoolCountdownPage() {
    const now = new Date();
    const year = now.getFullYear();

    /* Approximate US school calendar dates */
    const endOfSchoolDate = new Date(year, 5, 6); // June 6 (median end date)
    const backToSchoolDate = new Date(year, 7, 25); // August 25 (median start)
    const endIsRelevant = endOfSchoolDate > now;
    const backIsRelevant = backToSchoolDate > now;

    const suggestedDate = endIsRelevant ? endOfSchoolDate : backIsRelevant ? backToSchoolDate : new Date(year + 1, 7, 25);
    const suggestedLabel = endIsRelevant ? "End of School" : "Back to School";

    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "School Countdown" }]),
        webAppSchema("School Countdown", canonicalUrl("/time-calculators/school-countdown")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-school" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "School Countdown" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>🏫 School Countdown — Days Until {suggestedLabel} {year}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>
                Set your school&apos;s last day (or first day) below to see a live countdown. School calendars vary by state and district — enter your exact date for the most accurate results.
            </p>

            <CountdownTicker targetDate={suggestedDate} label={`Approximate ${suggestedLabel} — adjust the date to match your district`} />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="how-to-use">How to Use the School Countdown</h2>
<p>The timer above shows an <strong>approximate</strong> ${suggestedLabel.toLowerCase()} date based on the US median. To get an exact countdown for your school:</p>
<ol>
<li>Check your school district's <strong>academic calendar</strong> for the specific last day or first day.</li>
<li>Update the <strong>date field</strong> above with your exact date.</li>
<li>Click <strong>"Start Countdown"</strong> to see the live countdown.</li>
</ol>

<h2 id="end-of-school">When Does School End in Each US Region?</h2>
<table>
<thead><tr><th>Region</th><th>Typical End Date Range</th><th>Example States</th></tr></thead>
<tbody>
<tr><td><strong>South</strong></td><td>Late May (May 22–30)</td><td>Texas, Georgia, Florida, North Carolina</td></tr>
<tr><td><strong>Midwest</strong></td><td>Late May – Early June</td><td>Ohio, Michigan, Illinois, Minnesota</td></tr>
<tr><td><strong>West</strong></td><td>Early-to-Mid June</td><td>California, Colorado, Washington, Oregon</td></tr>
<tr><td><strong>Northeast</strong></td><td>Mid-to-Late June</td><td>New York, Massachusetts, Connecticut, New Jersey</td></tr>
</tbody>
</table>

<h2 id="back-to-school">When Does School Start in Each US Region?</h2>
<table>
<thead><tr><th>Region</th><th>Typical Start Date Range</th><th>Example States</th></tr></thead>
<tbody>
<tr><td><strong>South</strong></td><td>Early-to-Mid August (Aug 1–15)</td><td>Georgia, Alabama, Mississippi, Tennessee</td></tr>
<tr><td><strong>Midwest</strong></td><td>Mid-to-Late August</td><td>Indiana, Ohio, Wisconsin, Iowa</td></tr>
<tr><td><strong>West</strong></td><td>Mid-to-Late August</td><td>California, Arizona, Colorado, Nevada</td></tr>
<tr><td><strong>Northeast</strong></td><td>After Labor Day (Sep 2–8)</td><td>New York, Massachusetts, New Jersey, Connecticut</td></tr>
</tbody>
</table>

<h2 id="school-year-facts">US School Year Facts</h2>
<table>
<thead><tr><th>Fact</th><th>Detail</th></tr></thead>
<tbody>
<tr><td><strong>Required school days</strong></td><td>170–180 days (varies by state; 180 is most common)</td></tr>
<tr><td><strong>Average school day length</strong></td><td>6.5–7 hours (elementary: 6.5h, middle/high: 7h)</td></tr>
<tr><td><strong>Summer break length</strong></td><td>10–12 weeks (typically mid-June to late August)</td></tr>
<tr><td><strong>Spring break</strong></td><td>1 week, typically March–April</td></tr>
<tr><td><strong>Winter break</strong></td><td>2 weeks, late December through early January</td></tr>
<tr><td><strong>Total US K–12 students</strong></td><td>~49.5 million (public schools, 2025–2026)</td></tr>
</tbody>
</table>

<h2 id="school-supplies">Back-to-School Shopping Timeline</h2>
<p>The back-to-school shopping season is the <strong>second-largest US retail event</strong> after the winter holidays. Here's when to shop:</p>
<ul>
<li><strong>July (5–6 weeks before)</strong> — Best time to buy electronics, laptops, and backpacks. Retailers launch back-to-school sales.</li>
<li><strong>August (2–4 weeks before)</strong> — Peak season for clothing, school supplies, and shoes. Many states offer <strong>tax-free weekends</strong> for school supplies (check your state).</li>
<li><strong>Labor Day weekend</strong> — Final major sales event before school starts in most states.</li>
</ul>

<h2 id="related">Related Countdowns</h2>
<ul>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any date and time.</li>
<li><a href="/time-calculators/birthday-countdown"><strong>Birthday Countdown</strong></a> — Count down to your next birthday.</li>
<li><a href="/time-calculators/countdown-timer/days-until-labor-day"><strong>Days Until Labor Day</strong></a> — The unofficial end of summer.</li>
<li><a href="/time-calculators/countdown-timer/days-until-memorial-day"><strong>Days Until Memorial Day</strong></a> — The unofficial start of summer.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the date N days from now.</li>
</ul>
` }} />
            <FAQAccordion title="School Countdown FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

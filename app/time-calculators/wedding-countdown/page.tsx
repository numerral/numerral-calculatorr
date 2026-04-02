import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CountdownTicker from "@/components/calculator/CountdownTicker";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Wedding Countdown — Days Until Your Wedding Date",
    description: "Set your wedding date for a live countdown with planning milestones. Includes average US wedding cost and season context.",
    keywords: ["wedding countdown", "how many days until my wedding", "wedding timer", "wedding day countdown", "days until wedding"],
    alternates: { canonical: canonicalUrl("/time-calculators/wedding-countdown") },
};

const FAQ_ITEMS = [
    { question: "How many days until my wedding?", answer: "Enter your wedding date in the countdown timer above and click 'Start Countdown.' The live display shows the exact days, hours, minutes, and seconds remaining until your wedding day." },
    { question: "When should I start planning my wedding?", answer: "Most wedding planners recommend starting 12–18 months before your wedding date. Key early tasks include setting a budget, choosing a venue, and hiring a photographer. The average US wedding takes 12–14 months to plan." },
    { question: "What is the average cost of a wedding in the US?", answer: "The average US wedding cost is approximately $35,000 (2025 data), though this varies dramatically by location. New York City and San Francisco average $60,000+, while rural areas may average $15,000–$20,000." },
    { question: "What are the most popular wedding months?", answer: "The most popular wedding months in the US are June, September, and October. June weddings are a tradition dating back to ancient Rome (the month is named for Juno, goddess of marriage). Fall weddings offer comfortable temperatures and beautiful foliage." },
    { question: "When should I send wedding invitations?", answer: "Mail formal invitations 6–8 weeks before the wedding (8–12 weeks for destination weddings). Send save-the-dates 6–8 months in advance. Set the RSVP deadline for 2–3 weeks before the wedding to finalize catering numbers." },
    { question: "How far in advance should I book a wedding venue?", answer: "Book your venue 12–18 months in advance, especially for popular dates (Saturday evenings in June, September, or October). Some in-demand venues book 2+ years ahead in major metros like NYC, LA, and Chicago." },
];

export default function WeddingCountdownPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Wedding Countdown" }]),
        webAppSchema("Wedding Countdown", canonicalUrl("/time-calculators/wedding-countdown")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-wedding" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Wedding Countdown" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>💍 Wedding Countdown — How Many Days Until My Wedding?</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Enter your wedding date below to see a live countdown. Watch the days, hours, minutes, and seconds tick down to your big day.</p>

            <CountdownTicker />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: CONTENT_HTML }} />
            <FAQAccordion title="Wedding Countdown FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

const CONTENT_HTML = `
<h2 id="how-to-use">How to Use the Wedding Countdown</h2>
<p>Select your <strong>wedding date</strong> and optionally set the <strong>ceremony time</strong> (e.g., 4:00 PM). Click "Start Countdown" to see the live, ticking display of days, hours, minutes, and seconds until you say "I do."</p>
<p>Share this page with your partner, wedding party, and guests — the countdown updates in real time on any device.</p>

<h2 id="planning-timeline">Wedding Planning Timeline</h2>
<p>Use these milestones to plan your wedding on schedule. The timeline below assumes a 12-month engagement:</p>
<table>
<thead><tr><th>Months Before</th><th>Task</th><th>Details</th></tr></thead>
<tbody>
<tr><td><strong>12 months</strong></td><td>Set budget & guest list</td><td>Determine total budget, draft guest list, hire wedding planner if desired</td></tr>
<tr><td><strong>10–11 months</strong></td><td>Book venue & vendors</td><td>Venue, photographer, caterer, officiant, DJ/band</td></tr>
<tr><td><strong>9 months</strong></td><td>Choose wedding party</td><td>Ask bridesmaids & groomsmen, begin dress shopping</td></tr>
<tr><td><strong>8 months</strong></td><td>Send save-the-dates</td><td>Mail or email save-the-dates to all guests</td></tr>
<tr><td><strong>6 months</strong></td><td>Register & plan honeymoon</td><td>Create gift registry, book flights & hotels for honeymoon</td></tr>
<tr><td><strong>4 months</strong></td><td>Order cake & flowers</td><td>Schedule tastings, choose floral arrangements</td></tr>
<tr><td><strong>6–8 weeks</strong></td><td>Mail invitations</td><td>Include RSVP card with deadline 2–3 weeks before wedding</td></tr>
<tr><td><strong>4 weeks</strong></td><td>Final fittings & details</td><td>Dress alterations, confirm vendor details, write vows</td></tr>
<tr><td><strong>2 weeks</strong></td><td>Confirm RSVPs & seating</td><td>Finalize guest count, create seating chart, confirm catering numbers</td></tr>
<tr><td><strong>1 week</strong></td><td>Final walkthrough</td><td>Venue walkthrough, rehearsal dinner, marriage license</td></tr>
</tbody>
</table>

<h2 id="costs">Average US Wedding Costs (2025–2026)</h2>
<table>
<thead><tr><th>Category</th><th>Average Cost</th><th>% of Total Budget</th></tr></thead>
<tbody>
<tr><td><strong>Venue</strong></td><td>$11,000–$15,000</td><td>30–40%</td></tr>
<tr><td><strong>Catering</strong></td><td>$7,000–$10,000</td><td>20–25%</td></tr>
<tr><td><strong>Photography</strong></td><td>$3,000–$5,000</td><td>8–12%</td></tr>
<tr><td><strong>Flowers & Décor</strong></td><td>$2,500–$4,000</td><td>7–10%</td></tr>
<tr><td><strong>Music / DJ / Band</strong></td><td>$1,500–$3,500</td><td>5–8%</td></tr>
<tr><td><strong>Wedding Dress</strong></td><td>$1,500–$3,000</td><td>5–8%</td></tr>
<tr><td><strong>Videography</strong></td><td>$2,000–$3,500</td><td>5–8%</td></tr>
<tr><td><strong>Transportation</strong></td><td>$500–$1,500</td><td>2–4%</td></tr>
<tr><td><strong>Invitations & Stationery</strong></td><td>$400–$800</td><td>1–3%</td></tr>
</tbody>
</table>

<h2 id="popular-dates">Most Popular Wedding Dates</h2>
<p>The most popular wedding dates in the US tend to cluster around:</p>
<ul>
<li><strong>Saturdays in June, September, and October</strong> — Peak season with the highest demand and pricing</li>
<li><strong>"Easy" dates</strong> like 6/6, 7/7, 8/8, 10/10 — Popular for their memorability</li>
<li><strong>Long weekends</strong> — Memorial Day, Labor Day, and Columbus Day weekends are popular for destination weddings</li>
<li><strong>Valentine's Day (Feb 14)</strong> — Popular for intimate ceremonies and elopements</li>
</ul>
<p>Pro tip: <strong>Off-peak dates</strong> (January–March, Fridays, Sundays) can save 20–40% on venue and vendor costs while offering greater availability.</p>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any date and time.</li>
<li><a href="/time-calculators/birthday-countdown"><strong>Birthday Countdown</strong></a> — Count down to your next birthday.</li>
<li><a href="/time-calculators/days-until-calculator"><strong>Days Until Calculator</strong></a> — Calculate exact days until any date.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the date N days from now.</li>
<li><a href="/time-calculators/date-calculator"><strong>Date Calculator</strong></a> — Add or subtract days from any date.</li>
</ul>
`;

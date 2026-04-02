import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CountdownTicker from "@/components/calculator/CountdownTicker";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Birthday Countdown — Days Until Your Next Birthday",
    description: "Enter your birthdate to see days, hours, and minutes until your next birthday. Includes age milestones and zodiac info.",
    keywords: ["birthday countdown", "how many days until my birthday", "days until birthday", "birthday timer", "next birthday countdown"],
    alternates: { canonical: canonicalUrl("/time-calculators/birthday-countdown") },
};

const FAQ_ITEMS = [
    { question: "How many days until my birthday?", answer: "Enter your birthdate using the date picker above (set the year to the current or next year). The countdown will show the exact days, hours, minutes, and seconds until your next birthday celebration." },
    { question: "How do I calculate my birthday countdown manually?", answer: "Count the remaining days in each month between today and your birthday month, then add the days in your birthday month. For example, if today is March 15 and your birthday is June 22: 16 days left in March + 30 days in April + 31 days in May + 22 days in June = 99 days." },
    { question: "What if my birthday is on February 29 (leap day)?", answer: "If you were born on February 29, you only have a 'true' birthday every 4 years during leap years. In non-leap years, most leap-day babies celebrate on either February 28 or March 1. Set the countdown to whichever date you prefer." },
    { question: "What is a golden birthday?", answer: "A golden birthday (also called a champagne birthday) is when your age equals your birth date. For example, turning 25 on the 25th of the month, or turning 7 on the 7th. These are once-in-a-lifetime celebrations." },
    { question: "How many days are between each birthday?", answer: "In most years, there are exactly 365 days between birthdays. In a year that includes a February 29 (leap year), there are 366 days. This means your birthday falls on a different day of the week each year (shifting forward by 1 or 2 days)." },
];

export default function BirthdayCountdownPage() {
    const schemaData = JSON.stringify([
        breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") }, { name: "Birthday Countdown" }]),
        webAppSchema("Birthday Countdown", canonicalUrl("/time-calculators/birthday-countdown")),
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ_ITEMS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script id="schema-bday" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Time & Date Calculators", href: "/time-calculators" }, { label: "Birthday Countdown" }]} />
            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>🎂 Birthday Countdown — How Many Days Until My Birthday?</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-5)" }}>Enter your birthday below to see a live countdown. Watch the days, hours, minutes, and seconds tick down to your special day.</p>

            <CountdownTicker />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }} dangerouslySetInnerHTML={{ __html: `
<h2 id="how-to-use">How to Use the Birthday Countdown</h2>
<p>Select your birthday date — set the <strong>year to ${new Date().getFullYear()}</strong> (or ${new Date().getFullYear() + 1} if your birthday has already passed this year). Then click "Start Countdown" to see the live countdown to your next birthday.</p>
<p>The timer shows the remaining <strong>days, hours, minutes, and seconds</strong> and updates every second in real time. Keep the page open and share it with friends and family!</p>

<h2 id="birthday-traditions">Birthday Traditions in America</h2>
<p>Birthday celebrations in the US typically include:</p>
<ul>
<li><strong>Birthday cake and candles</strong> — The tradition of candles on birthday cakes dates back to 18th-century Germany. The number of candles represents the person's age, and they make a wish while blowing them out.</li>
<li><strong>"Happy Birthday" song</strong> — The most recognized song in the English language, written in 1893 by Patty and Mildred Hill.</li>
<li><strong>Milestone birthdays</strong> — 1st, 16th (Sweet Sixteen), 18th (legal adulthood), 21st (legal drinking age), 30th, 40th, 50th, and 100th birthdays receive special celebrations.</li>
<li><strong>Birthday parties</strong> — Children's parties often feature themes, games, and goodie bags. Adult celebrations range from dinner parties to surprise gatherings.</li>
</ul>

<h2 id="milestone-birthdays">US Milestone Birthdays & Legal Significance</h2>
<table>
<thead><tr><th>Age</th><th>Milestone</th><th>Legal Significance</th></tr></thead>
<tbody>
<tr><td><strong>16</strong></td><td>Sweet Sixteen</td><td>Driver's license eligible (most states)</td></tr>
<tr><td><strong>18</strong></td><td>Legal Adult</td><td>Vote, military service, signing contracts, jury duty</td></tr>
<tr><td><strong>21</strong></td><td>Legal Drinking Age</td><td>Purchase and consume alcohol legally nationwide</td></tr>
<tr><td><strong>25</strong></td><td>Quarter Century</td><td>Car rental age drops, insurance rates decrease</td></tr>
<tr><td><strong>26</strong></td><td>Insurance Milestone</td><td>No longer eligible for parent's health insurance (ACA)</td></tr>
<tr><td><strong>35</strong></td><td>Presidential Eligibility</td><td>Minimum age to run for President of the United States</td></tr>
<tr><td><strong>50</strong></td><td>Half Century</td><td>AARP eligibility, catch-up retirement contributions (401k/IRA)</td></tr>
<tr><td><strong>62</strong></td><td>Early Retirement</td><td>Early Social Security benefits eligible (at reduced rate)</td></tr>
<tr><td><strong>65</strong></td><td>Medicare Eligible</td><td>Medicare health insurance kicks in</td></tr>
<tr><td><strong>67</strong></td><td>Full Retirement</td><td>Full Social Security retirement age (born after 1960)</td></tr>
</tbody>
</table>

<h2 id="zodiac">Birthday Zodiac Signs</h2>
<p>Curious about your zodiac sign? Here's a quick reference:</p>
<table>
<thead><tr><th>Sign</th><th>Dates</th><th>Element</th></tr></thead>
<tbody>
<tr><td>♈ Aries</td><td>Mar 21 – Apr 19</td><td>Fire</td></tr>
<tr><td>♉ Taurus</td><td>Apr 20 – May 20</td><td>Earth</td></tr>
<tr><td>♊ Gemini</td><td>May 21 – Jun 20</td><td>Air</td></tr>
<tr><td>♋ Cancer</td><td>Jun 21 – Jul 22</td><td>Water</td></tr>
<tr><td>♌ Leo</td><td>Jul 23 – Aug 22</td><td>Fire</td></tr>
<tr><td>♍ Virgo</td><td>Aug 23 – Sep 22</td><td>Earth</td></tr>
<tr><td>♎ Libra</td><td>Sep 23 – Oct 22</td><td>Air</td></tr>
<tr><td>♏ Scorpio</td><td>Oct 23 – Nov 21</td><td>Water</td></tr>
<tr><td>♐ Sagittarius</td><td>Nov 22 – Dec 21</td><td>Fire</td></tr>
<tr><td>♑ Capricorn</td><td>Dec 22 – Jan 19</td><td>Earth</td></tr>
<tr><td>♒ Aquarius</td><td>Jan 20 – Feb 18</td><td>Air</td></tr>
<tr><td>♓ Pisces</td><td>Feb 19 – Mar 20</td><td>Water</td></tr>
</tbody>
</table>

<h2 id="related">Related Tools</h2>
<ul>
<li><a href="/time-calculators/countdown-timer"><strong>Countdown Timer</strong></a> — Count down to any date and time.</li>
<li><a href="/time-calculators/days-until-calculator"><strong>Days Until Calculator</strong></a> — Static days, weeks, and months until any date.</li>
<li><a href="/utility-calculators/age-calculator"><strong>Age Calculator</strong></a> — Calculate your exact age in years, months, and days.</li>
<li><a href="/time-calculators/days-from-today"><strong>Days From Today</strong></a> — Find the date N days from now.</li>
</ul>
` }} />
            <FAQAccordion title="Birthday Countdown FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

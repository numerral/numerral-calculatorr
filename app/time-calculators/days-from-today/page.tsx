import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TimeDateCalculatorCore from "@/components/calculator/TimeDateCalculatorCore";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

/* ── variants for the "Quick Dates" grid ── */
const FUTURE_DAYS = [3, 5, 7, 10, 14, 15, 21, 28, 30, 45, 60, 75, 90, 100, 120, 150, 180, 200, 270, 365];
const PAST_DAYS   = [3, 7, 14, 30, 45, 60, 90, 120, 180, 365];

function futureDate(n: number) {
    const d = new Date(); d.setDate(d.getDate() + n);
    return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export const revalidate = 86400; // ISR — refresh once per day

export const metadata: Metadata = {
    title: "Days From Today Calculator — Find Future & Past Dates",
    description: "Enter any number of days to find the exact date forward or backward from today. Includes business-day results and US context, Excel formulas, and common deadline reference tables.",
    keywords: ["days from today", "days from today calculator", "30 days from today", "60 days from today", "90 days from today", "what date is 30 days from today", "business days calculator", "date calculator"],
    alternates: { canonical: canonicalUrl("/time-calculators/days-from-today") },
};

const FAQ_ITEMS = [
    { question: "What date is 30 days from today?", answer: "Use the calculator above — enter 30 in the Days field and the result instantly shows the calendar date 30 days from today. As a quick example, 30 calendar days typically spans about 4 weeks and 2 days, containing approximately 22 business days (weekdays)." },
    { question: "What date is 90 days from today?", answer: "Enter 90 in the calculator to see the exact date. 90 days is roughly 3 months (12 weeks and 6 days) and contains approximately 64 business days. Many US legal deadlines — including IRS payment extensions, probation periods, and FMLA protections — use a 90-day window." },
    { question: "What is the difference between calendar days and business days?", answer: "Calendar days count every day including weekends and holidays. Business days (working days) count only Monday through Friday, excluding weekends. 30 calendar days = approximately 22 business days. Contracts, legal notices, and government filings often specify which type applies — always verify." },
    { question: "How do I calculate a future date in Excel?", answer: "For calendar days: =TODAY()+N (e.g., =TODAY()+30 for 30 days from today). For business days: =WORKDAY(TODAY(),N) which skips weekends. You can add a holidays range: =WORKDAY(TODAY(),30,HolidayRange). For counting business days between dates: =NETWORKDAYS(start,end)." },
    { question: "Does the calculator account for leap years?", answer: "Yes. The calculator uses JavaScript's native Date object which correctly handles leap years (Feb 29), varying month lengths (28–31 days), and year boundaries. This means adding 365 days from Feb 28, 2028 correctly lands on Feb 27, 2029 (since 2028 is a leap year with 366 days)." },
    { question: "How many business days are in 30 calendar days?", answer: "Approximately 22 business days (30 days minus 8 weekend days). The exact number depends on which day of the week you start. Starting on Monday: 22. Starting on Wednesday: 22. Starting on Saturday: 21. Federal holidays further reduce the count." },
    { question: "What is the 60-day COBRA election period?", answer: "When you lose employer health coverage, the COBRA law gives you 60 calendar days from the date of the qualifying event (or the date you receive the COBRA election notice, whichever is later) to elect continuation coverage. Use this calculator to find your exact COBRA deadline." },
    { question: "What is the 90-day probation period?", answer: "Many US employers use a 90-day probationary period for new hires — during which employment may be terminated more easily. It's also the standard FMLA eligibility look-back period (you must have worked for the employer for at least 12 months and 1,250 hours). Use this calculator to find when a 90-day period ends." },
    { question: "How do I count days ago from today?", answer: "Enter a negative number in the calculator, or use our child pages — for example, '30 days ago from today' gives the date 30 calendar days in the past. You can also subtract days from today's date in Excel: =TODAY()-30." },
    { question: "What is a net-30 payment term?", answer: "Net-30 means payment is due within 30 calendar days of the invoice date. Other common terms: Net-15 (15 days), Net-60 (60 days), Net-90 (90 days), and 2/10 Net-30 (2% discount if paid within 10 days, otherwise full amount due in 30). Use this calculator to find the exact due date." },
    { question: "How many days until the end of the year?", answer: "Use our Days Left in the Year Calculator for a live countdown, or enter the date December 31 in the calculator. A standard year has 365 days (366 in a leap year). The number of remaining days depends on today's date." },
    { question: "What US deadlines use a 120-day period?", answer: "The IRS tax extension deadline is 120 days after the original April 15 due date (October 15). Some states use 120 days for professional license renewal. Real estate escrows in some markets allow up to 120 days for certain property types. Use this calculator to track any 120-day deadline." },
];

export default function DaysFromTodayHub() {
    const today = new Date();
    const todayStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
            { name: "Days From Today Calculator" },
        ]),
        webAppSchema("Days From Today Calculator", canonicalUrl("/time-calculators/days-from-today")),
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
            <Script id="schema-days-from" type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaData }} />

            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "Time & Date Calculators", href: "/time-calculators" },
                { label: "Days From Today" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>Days From Today Calculator</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Calculate the exact calendar date any number of days from today. Get business-day results, US federal holiday context, and common deadline references — updated daily.
            </p>

            <TimeDateCalculatorCore calcType="date-calc" />

            <section className="hub-content" style={{ marginTop: "var(--s-6)" }}
                dangerouslySetInnerHTML={{ __html: CONTENT_HTML(todayStr) }}
            />

            {/* ── Quick Dates Grid ── */}
            <section style={{ marginTop: "var(--s-6)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>📅 Quick Dates From Today</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--s-3)" }}>
                    {FUTURE_DAYS.map((n) => (
                        <Link key={`f${n}`} href={`/time-calculators/days-from-today/${n}-days-from-today`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit", transition: "background 0.15s" }}>
                            <span style={{ fontWeight: 600 }}>What date is {n} days from today?</span>
                            <span style={{ color: "var(--n-primary)", fontSize: "var(--t-body-sm)" }}>→</span>
                        </Link>
                    ))}
                </div>

                <h3 className="t-h3" style={{ marginTop: "var(--s-5)", marginBottom: "var(--s-3)" }}>📆 Days Ago From Today</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--s-3)" }}>
                    {PAST_DAYS.map((n) => (
                        <Link key={`p${n}`} href={`/time-calculators/days-from-today/${n}-days-ago`}
                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--s-3) var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)", textDecoration: "none", color: "inherit", transition: "background 0.15s" }}>
                            <span style={{ fontWeight: 600 }}>What date was {n} days ago?</span>
                            <span style={{ color: "var(--n-primary)", fontSize: "var(--t-body-sm)" }}>→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <FAQAccordion title="Days From Today Calculator FAQ" items={FAQ_ITEMS} />
        </main>
    );
}

/* ── Educational Content ── */
function CONTENT_HTML(todayStr: string) { return `
<h2 id="what-is-days-from-today">What Does "Days From Today" Mean?</h2>
<p><strong>Days from today</strong> is a date calculation that adds a specified number of calendar days to today's date (${todayStr}) to find a future date. For example, "30 days from today" means counting 30 consecutive days forward from today — including weekends and holidays — to arrive at the exact calendar date.</p>
<p>This calculation is separate from <strong>business days</strong> (which exclude weekends). A <a href="/time-calculators/business-days-calculator">Business Days Calculator</a> counts only Monday through Friday. Understanding the distinction is critical for contracts, legal notices, shipping estimates, and payment terms — where using the wrong type can mean missing deadlines by a week or more.</p>

<h2 id="how-to-calculate">How to Calculate a Date From Today</h2>
<p>There are three reliable methods to find a future or past date:</p>

<h3 id="method-manual">Method 1: Count on a Calendar</h3>
<p>Start from today's date on a physical or digital calendar. Count forward one day at a time until you've reached your target count. Be careful at month boundaries — months have different lengths (28–31 days). This method works well for small counts (under 14 days) but becomes error-prone for larger spans.</p>
<p>For counts over 30 days, it's faster to jump by weeks (subtract 7 for each week forward) then count remaining individual days. For example, 45 days = 6 weeks (42 days) + 3 more days.</p>

<h3 id="method-spreadsheet">Method 2: Use Excel or Google Sheets</h3>
<p>Spreadsheet software is extremely powerful for date math. Key formulas:</p>
<table>
<thead><tr><th>Formula</th><th>What It Does</th><th>Example</th></tr></thead>
<tbody>
<tr><td><strong>=TODAY()+N</strong></td><td>Adds N calendar days to today</td><td>=TODAY()+30 → date 30 days from now</td></tr>
<tr><td><strong>=TODAY()-N</strong></td><td>Subtracts N calendar days</td><td>=TODAY()-90 → date 90 days ago</td></tr>
<tr><td><strong>=WORKDAY(start,N)</strong></td><td>Adds N business days (skips weekends)</td><td>=WORKDAY(TODAY(),30) → 30 business days from now</td></tr>
<tr><td><strong>=WORKDAY(start,N,holidays)</strong></td><td>Business days excluding holidays</td><td>=WORKDAY(TODAY(),30,A1:A11) → skips holidays in range</td></tr>
<tr><td><strong>=NETWORKDAYS(start,end)</strong></td><td>Counts business days between dates</td><td>=NETWORKDAYS(A1,B1) → working days in range</td></tr>
<tr><td><strong>=EDATE(start,N)</strong></td><td>Adds N months (not days)</td><td>=EDATE(TODAY(),3) → 3 months from now</td></tr>
</tbody>
</table>
<p><strong>Pro tip:</strong> Format the result cell as a "Date" to see the full date instead of a serial number.</p>

<h3 id="method-calculator">Method 3: Use an Online Calculator</h3>
<p>The calculator at the top of this page handles all the edge cases automatically — <strong>leap years</strong>, variable month lengths, and year boundaries. Enter any number of days and get instant results. For more flexibility, use our <a href="/time-calculators/date-calculator">Date Calculator</a> which lets you add or subtract days, weeks, months, and years from any starting date — not just today.</p>

<h2 id="calendar-vs-business">Calendar Days vs. Business Days — Why It Matters</h2>
<p>This distinction causes more missed deadlines than almost any other scheduling confusion:</p>
<table>
<thead><tr><th>Metric</th><th>Calendar Days</th><th>Business Days</th></tr></thead>
<tbody>
<tr><td><strong>Definition</strong></td><td>Every day (Mon–Sun)</td><td>Weekdays only (Mon–Fri)</td></tr>
<tr><td><strong>30-day span contains</strong></td><td>30 days</td><td>~22 working days</td></tr>
<tr><td><strong>Weekends</strong></td><td>Included</td><td>Excluded</td></tr>
<tr><td><strong>Federal holidays</strong></td><td>Included</td><td>Usually excluded</td></tr>
<tr><td><strong>Used by</strong></td><td>Shipping, leases, consumer returns</td><td>Contracts, courts, government filings</td></tr>
<tr><td><strong>Example</strong></td><td>"30-day return policy"</td><td>"10 business days to respond"</td></tr>
</tbody>
</table>
<p><strong>Rule of thumb:</strong> Multiply business days by 1.4 to estimate calendar days. Divide calendar days by 1.4 to estimate business days. For precise results, use our <a href="/time-calculators/business-days-calculator">Business Days Calculator</a>.</p>

<h2 id="quick-reference">Quick Reference — Days From Today</h2>
<p>Here are the most commonly searched day counts with their approximate durations. Use the links to see the exact date for each:</p>
<table>
<thead><tr><th>Days</th><th>Approximate Duration</th><th>~Business Days</th><th>Common US Use</th></tr></thead>
<tbody>
<tr><td><a href="/time-calculators/days-from-today/7-days-from-today"><strong>7</strong></a></td><td>1 week</td><td>5</td><td>Weekly billing cycle, return window</td></tr>
<tr><td><a href="/time-calculators/days-from-today/14-days-from-today"><strong>14</strong></a></td><td>2 weeks</td><td>10</td><td>Biweekly pay, FTC cooling-off, quarantine</td></tr>
<tr><td><a href="/time-calculators/days-from-today/30-days-from-today"><strong>30</strong></a></td><td>~1 month</td><td>22</td><td>Net-30 payment, lease notice, credit card cycle</td></tr>
<tr><td><a href="/time-calculators/days-from-today/45-days-from-today"><strong>45</strong></a></td><td>~6.5 weeks</td><td>33</td><td>HIPAA breach notification, mortgage processing</td></tr>
<tr><td><a href="/time-calculators/days-from-today/60-days-from-today"><strong>60</strong></a></td><td>~2 months</td><td>43</td><td>COBRA election, WARN Act notice, lease termination</td></tr>
<tr><td><a href="/time-calculators/days-from-today/90-days-from-today"><strong>90</strong></a></td><td>~3 months</td><td>64</td><td>Probation period, FMLA, IRS installment, passport</td></tr>
<tr><td><a href="/time-calculators/days-from-today/120-days-from-today"><strong>120</strong></a></td><td>~4 months</td><td>86</td><td>Tax extension (Oct 15), license renewal</td></tr>
<tr><td><a href="/time-calculators/days-from-today/180-days-from-today"><strong>180</strong></a></td><td>~6 months</td><td>129</td><td>Statute of limitations, EEOC charge, insurance review</td></tr>
<tr><td><a href="/time-calculators/days-from-today/365-days-from-today"><strong>365</strong></a></td><td>~1 year</td><td>261</td><td>Annual renewal, lease term, employment anniversary</td></tr>
</tbody>
</table>

<h2 id="us-deadlines">Common US Legal & Regulatory Day Periods</h2>
<p>Many federal and state regulations specify exact day counts. Here are the most important ones:</p>

<h3 id="employment-deadlines">Employment & Labor</h3>
<table>
<thead><tr><th>Period</th><th>Regulation</th><th>What It Means</th></tr></thead>
<tbody>
<tr><td><strong>3 days</strong></td><td>I-9 Verification</td><td>Employers must complete Form I-9 within 3 business days of a new hire's start date.</td></tr>
<tr><td><strong>60 days</strong></td><td>WARN Act</td><td>Employers with 100+ employees must give 60 calendar days' advance notice before mass layoffs or plant closings.</td></tr>
<tr><td><strong>60 days</strong></td><td>COBRA Election</td><td>Employees have 60 days to elect COBRA continuation coverage after losing employer health insurance.</td></tr>
<tr><td><strong>90 days</strong></td><td>Probation Period</td><td>Standard probationary period for new hires. Also the FMLA eligibility look-back (12 months + 1,250 hours).</td></tr>
<tr><td><strong>180 days</strong></td><td>EEOC Charge</td><td>Deadline to file a charge of discrimination with the EEOC (300 days if your state has a fair employment practices agency).</td></tr>
</tbody>
</table>

<h3 id="financial-deadlines">Financial & Tax</h3>
<table>
<thead><tr><th>Period</th><th>Context</th><th>What It Means</th></tr></thead>
<tbody>
<tr><td><strong>3 days</strong></td><td>Right of Rescission (TILA)</td><td>Borrowers can cancel certain home equity loans within 3 business days of closing.</td></tr>
<tr><td><strong>30 days</strong></td><td>Net-30 Payment</td><td>Standard invoice payment term — full amount due within 30 calendar days of invoice date.</td></tr>
<tr><td><strong>30 days</strong></td><td>Credit Card Billing</td><td>Statement closing date to payment due date is typically 21–25 days (minimum 21 per CARD Act).</td></tr>
<tr><td><strong>90 days</strong></td><td>IRS Installment</td><td>Taxpayers can request a 90-day extension to pay in full before an installment agreement is required.</td></tr>
<tr><td><strong>120 days</strong></td><td>Tax Extension</td><td>Extended filing deadline (originally April 15 → October 15 = approximately 183 days for individuals).</td></tr>
</tbody>
</table>

<h3 id="consumer-deadlines">Consumer & Real Estate</h3>
<table>
<thead><tr><th>Period</th><th>Context</th><th>What It Means</th></tr></thead>
<tbody>
<tr><td><strong>14 days</strong></td><td>FTC Return Policy</td><td>Many retailers follow a 14-day return window. The FTC "Cooling-Off Rule" gives 3 days for door-to-door sales.</td></tr>
<tr><td><strong>30 days</strong></td><td>Lease Notice</td><td>Most month-to-month leases require 30 days' written notice to terminate.</td></tr>
<tr><td><strong>45 days</strong></td><td>1031 Exchange ID</td><td>Investors have 45 days from closing to identify replacement properties in a tax-deferred 1031 exchange.</td></tr>
<tr><td><strong>60 days</strong></td><td>IRA Rollover</td><td>You have 60 calendar days to complete an indirect IRA rollover to avoid taxes and penalties.</td></tr>
</tbody>
</table>

<h2 id="us-federal-holidays">US Federal Holidays 2026 — Business Day Impact</h2>
<p>Federal holidays affect business day calculations because government offices, banks, and many businesses are closed. Here are all 11 federal holidays for 2026:</p>
<table>
<thead><tr><th>Date</th><th>Day</th><th>Holiday</th></tr></thead>
<tbody>
<tr><td>Jan 1</td><td>Thursday</td><td>New Year's Day</td></tr>
<tr><td>Jan 19</td><td>Monday</td><td>Martin Luther King Jr. Day</td></tr>
<tr><td>Feb 16</td><td>Monday</td><td>Presidents' Day</td></tr>
<tr><td>May 25</td><td>Monday</td><td>Memorial Day</td></tr>
<tr><td>Jun 19</td><td>Friday</td><td>Juneteenth</td></tr>
<tr><td>Jul 3</td><td>Friday</td><td>Independence Day (observed)</td></tr>
<tr><td>Sep 7</td><td>Monday</td><td>Labor Day</td></tr>
<tr><td>Oct 12</td><td>Monday</td><td>Columbus Day</td></tr>
<tr><td>Nov 11</td><td>Wednesday</td><td>Veterans Day</td></tr>
<tr><td>Nov 26</td><td>Thursday</td><td>Thanksgiving Day</td></tr>
<tr><td>Dec 25</td><td>Friday</td><td>Christmas Day</td></tr>
</tbody>
</table>
<p><strong>Note:</strong> When a federal holiday falls on Saturday, it's observed on the preceding Friday. When it falls on Sunday, it's observed on the following Monday. The <a href="/time-calculators/business-days-calculator">Business Days Calculator</a> can help you count working days excluding weekends; subtract any holidays that fall within your range for the most accurate business-day count.</p>

<h2 id="leap-years">Leap Year & Edge Cases</h2>
<p>Date math has several tricky edge cases that manual counting often gets wrong:</p>
<ul>
<li><strong>Leap years:</strong> Every 4 years, February has 29 days instead of 28. Next US leap year: <strong>2028</strong>. This means 365 days from Feb 28, 2028 = Feb 27, 2029 (not Feb 28).</li>
<li><strong>Month-length variation:</strong> January has 31 days, February has 28 (or 29), April has 30. A "30 days from today" calculation in January crosses into March, while in February it stays in March.</li>
<li><strong>Year boundaries:</strong> Counting 90 days from November crosses into the next calendar year. This affects fiscal year reporting and annual deadlines.</li>
<li><strong>Daylight Saving Time:</strong> DST doesn't affect day-count math (a "day" is always a calendar date change), but it does affect hour-based calculations. Spring forward means one day per year is only 23 hours. Use our <a href="/time-calculators/time-duration-calculator">Time Duration Calculator</a> for exact hour counts.</li>
</ul>

<h2 id="related-calculators">Related Time & Date Tools</h2>
<p>Our calculator suite covers every aspect of date and time math:</p>
<ul>
<li><a href="/time-calculators/date-calculator"><strong>Date Calculator</strong></a> — Add or subtract days, weeks, months, and years from any date (not just today).</li>
<li><a href="/time-calculators/business-days-calculator"><strong>Business Days Calculator</strong></a> — Count working days between two dates, excluding weekends.</li>
<li><a href="/time-calculators/deadline-calculator"><strong>Deadline Calculator</strong></a> — Find calendar and business-day deadlines from a start date and lead time.</li>
<li><a href="/time-calculators/date-duration-calculator"><strong>Date Duration Calculator</strong></a> — Calculate years, months, and days between two dates.</li>
<li><a href="/time-calculators/days-until-calculator"><strong>Days Until Calculator</strong></a> — Countdown to any future date in days, weeks, and months.</li>
<li><a href="/time-calculators/days-left-in-year-calculator"><strong>Days Left in Year</strong></a> — Track year progress with days remaining and percentage complete.</li>
<li><a href="/time-calculators/week-calculator"><strong>Week Calculator</strong></a> — Find the ISO week number of any date.</li>
<li><a href="/time-calculators/time-calculator"><strong>Time Calculator</strong></a> — Add or subtract hours, minutes, and seconds from any time.</li>
</ul>
`; }

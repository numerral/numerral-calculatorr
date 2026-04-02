// Dynamic Hub — /time-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TimeDateCalculatorCore from "@/components/calculator/TimeDateCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import Link from "next/link";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("time");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("time").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/time-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    contentHTML?: string;
    faq?: { question: string; answer: string }[];
}> = {
    "time-calculator": {
        subtitle: "Add or subtract hours, minutes, and seconds from any time. Convert times to decimal hours, calculate durations, and handle midnight crossings automatically.",
        explanation: {
            heading: "How the Time Calculator Works",
            paragraphs: [
                "This calculator performs arithmetic on time values. Enter a starting time in 24-hour format, choose to add or subtract, then enter the hours, minutes, and seconds to adjust by. The result automatically wraps around midnight — if you add 5 hours to 10:00 PM, you get 3:00 AM.",
                "Common uses include calculating end times for meetings, cooking timers, flight arrivals across time zones, and shift scheduling. The tool handles all the tricky edge cases like crossing midnight and minute/second overflow automatically.",
            ],
            highlight: "9:30 AM + 2h 45m = 12:15 PM. The calculator handles all the carry-over arithmetic so you don't have to think about it.",
        },
        contentHTML: `
<p>Time arithmetic is something we all need but rarely enjoy doing manually. Whether you're scheduling meetings across <strong>US time zones</strong>, planning cooking times, calculating shift differentials, or figuring out when your flight lands, a time calculator eliminates the mental gymnastics of carrying over minutes and hours. For tracking <a href="/time-calculators/work-hours-calculator">weekly work hours</a> or <a href="/time-calculators/time-card-calculator">daily time card entries</a>, decimal time conversion is especially critical for accurate payroll processing.</p>

<h2 id="how-to-add-times">How to Add Times</h2>
<p>Adding two times (or a time and a <a href="/time-calculators/time-duration-calculator">duration</a>) follows a simple carry-over process:</p>
<ol>
<li><strong>Add the seconds together.</strong> If the result is 60 or more, subtract 60 from the seconds and carry 1 to the minutes.</li>
<li><strong>Add the minutes together</strong> (plus any carry). If the result is 60 or more, subtract 60 from the minutes and carry 1 to the hours.</li>
<li><strong>Add the hours together</strong> (plus any carry). If the result is 24 or more, subtract 24 (the time wraps past midnight into the next day).</li>
</ol>
<p><strong>Example:</strong> 10:45:30 PM + 3h 25m 40s</p>
<ul>
<li>Seconds: 30 + 40 = 70 → 10 seconds, carry 1</li>
<li>Minutes: 45 + 25 + 1 = 71 → 11 minutes, carry 1</li>
<li>Hours: 22 + 3 + 1 = 26 → 26 − 24 = <strong>2:11:10 AM (next day)</strong></li>
</ul>
<p>If you need to add up multiple time entries for a full workweek, our <a href="/time-calculators/hours-calculator">Hours Calculator</a> handles multi-day spans across date boundaries.</p>

<h2 id="how-to-subtract-times">How to Subtract Times</h2>
<p>If you're trying to count down the time to an event, you may need to subtract one time from another. You can also use our <a href="/time-calculators/days-until-calculator">Days Until Calculator</a> for date-based countdowns. To subtract times, follow these steps:</p>
<ol>
<li><strong>Subtract the seconds.</strong> If the result is negative, add 60 to the seconds and borrow 1 from the minutes.</li>
<li><strong>Subtract the minutes.</strong> If the result is negative, add 60 to the minutes and borrow 1 from the hours.</li>
<li><strong>Subtract the hours.</strong> If the result is negative, add 24 (the time wraps backward past midnight).</li>
</ol>
<p><strong>Example:</strong> 2:15:00 AM − 4h 30m</p>
<ul>
<li>Convert 2:15 AM to 24-hour: 02:15</li>
<li>Minutes: 15 − 30 = −15 → add 60 = 45 minutes, borrow 1 hour</li>
<li>Hours: 2 − 1 − 4 = −3 → add 24 = <strong>21:45 = 9:45:00 PM (previous day)</strong></li>
</ul>

<h2 id="converting-time-to-decimal">How to Convert a Time to Decimal</h2>
<p>Many payroll systems, billing software, and scheduling tools require time in <strong>decimal format</strong> rather than hours:minutes. Here are the three conversion formulas. In all equations below, <em>H</em> is the number of hours, <em>M</em> is the number of minutes, and <em>S</em> is the number of seconds.</p>

<h3 id="time-to-hours-formula">Time to Hours Formula</h3>
<p>Use this formula to convert a time to <strong>decimal hours</strong> — the format most US payroll systems require:</p>
<blockquote style="background:var(--n-surface-alt);border-left:4px solid var(--n-primary);padding:var(--s-3) var(--s-4);border-radius:var(--r-md);font-size:1.1em;font-weight:600;font-style:italic;margin:var(--s-3) 0">
time in hours = H + (M ÷ 60) + (S ÷ 3,600)
</blockquote>
<p><strong>Example:</strong> 2h 30m 45s → 2 + (30 ÷ 60) + (45 ÷ 3,600) = 2 + 0.5 + 0.0125 = <strong>2.5125 hours</strong></p>

<h3 id="time-to-minutes-formula">Time to Minutes Formula</h3>
<p>Use this formula to convert a time to <strong>decimal minutes</strong>:</p>
<blockquote style="background:var(--n-surface-alt);border-left:4px solid var(--n-primary);padding:var(--s-3) var(--s-4);border-radius:var(--r-md);font-size:1.1em;font-weight:600;font-style:italic;margin:var(--s-3) 0">
time in minutes = (H × 60) + M + (S ÷ 60)
</blockquote>
<p><strong>Example:</strong> 2h 30m 45s → (2 × 60) + 30 + (45 ÷ 60) = 120 + 30 + 0.75 = <strong>150.75 minutes</strong></p>

<h3 id="time-to-seconds-formula">Time to Seconds Formula</h3>
<p>Use this formula to convert a time to <strong>total seconds</strong>:</p>
<blockquote style="background:var(--n-surface-alt);border-left:4px solid var(--n-primary);padding:var(--s-3) var(--s-4);border-radius:var(--r-md);font-size:1.1em;font-weight:600;font-style:italic;margin:var(--s-3) 0">
time in seconds = (H × 3,600) + (M × 60) + S
</blockquote>
<p><strong>Example:</strong> 2h 30m 45s → (2 × 3,600) + (30 × 60) + 45 = 7,200 + 1,800 + 45 = <strong>9,045 seconds</strong></p>

<h2 id="decimal-hours-chart">Decimal Hours to Minutes — Quick Reference Chart</h2>
<p>This chart is the quick reference used in US payroll departments to convert clock time to decimal hours. Use it when filling out timesheets or verifying <a href="/time-calculators/time-card-calculator">time card calculations</a>.</p>
<table>
<thead><tr><th>Minutes</th><th>Decimal Hours</th><th>Minutes</th><th>Decimal Hours</th><th>Minutes</th><th>Decimal Hours</th></tr></thead>
<tbody>
<tr><td>1</td><td>0.02</td><td>15</td><td>0.25</td><td>40</td><td>0.67</td></tr>
<tr><td>2</td><td>0.03</td><td>18</td><td>0.30</td><td>42</td><td>0.70</td></tr>
<tr><td>3</td><td>0.05</td><td>20</td><td>0.33</td><td>45</td><td>0.75</td></tr>
<tr><td>5</td><td>0.08</td><td>24</td><td>0.40</td><td>48</td><td>0.80</td></tr>
<tr><td>6</td><td>0.10</td><td>25</td><td>0.42</td><td>50</td><td>0.83</td></tr>
<tr><td>10</td><td>0.17</td><td>30</td><td>0.50</td><td>54</td><td>0.90</td></tr>
<tr><td>12</td><td>0.20</td><td>35</td><td>0.58</td><td>55</td><td>0.92</td></tr>
<tr><td>14</td><td>0.23</td><td>36</td><td>0.60</td><td>60</td><td>1.00</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> 6-minute increments (0.10 hours) are the standard billing unit in the <strong>legal profession</strong>. Quarter-hour rounding (15 min = 0.25) is the most common US payroll rounding method. Use our <a href="/time-calculators/work-hours-calculator">Work Hours Calculator</a> to automatically convert your weekly timesheet to decimal format with FLSA overtime.</p>

<h2 id="calculating-time-duration">How to Calculate Time Duration</h2>
<p>You can calculate the <a href="/time-calculators/time-duration-calculator">time duration</a> between two times by following a few steps:</p>
<ol>
<li><strong>Convert both times to <a href="/time-calculators/military-time-converter">24-hour (military) time</a>.</strong> 3:00 PM = 15:00. 8:30 AM = 08:30. Our Military Time Converter handles this instantly.</li>
<li><strong>Convert both times to decimal hours.</strong> Divide the minutes by 60 to get the decimal portion. 15:00 = 15.0 hours. 08:30 = 8.5 hours.</li>
<li><strong>Subtract the start time from the end time.</strong> 15.0 − 8.5 = <strong>6.5 hours = 6h 30m</strong></li>
</ol>
<p>If the end time is before the start time (overnight span), add 24 to the end time first. Example: 10:00 PM to 6:00 AM = (6 + 24) − 22 = <strong>8 hours</strong>.</p>
<p>To find the number of <strong>days between two dates</strong>, use our <a href="/time-calculators/date-duration-calculator">Date Duration Calculator</a>. For <strong>business days only</strong> (excluding weekends), use our <a href="/time-calculators/business-days-calculator">Business Days Calculator</a>. To find a specific <strong>future or past date</strong>, try the <a href="/time-calculators/date-calculator">Date Calculator</a>.</p>

<h2 id="seven-minute-rounding-rule">The 7-Minute Rounding Rule for US Payroll</h2>
<p>The <strong>FLSA (Fair Labor Standards Act)</strong> allows employers to round employee clock-in and clock-out times to the nearest increment, as long as the rounding doesn't systematically favor the employer over time. The most widely used method is the <strong>7-minute rule</strong>:</p>
<ul>
<li>Round to the nearest <strong>15 minutes</strong> (quarter hour)</li>
<li>1–7 minutes → round <strong>down</strong></li>
<li>8–14 minutes → round <strong>up</strong></li>
</ul>
<p><strong>Examples:</strong></p>
<ul>
<li>Clock in at 8:07 AM → rounds to <strong>8:00 AM</strong></li>
<li>Clock in at 8:08 AM → rounds to <strong>8:15 AM</strong></li>
<li>Clock out at 5:22 PM → rounds to <strong>5:15 PM</strong></li>
<li>Clock out at 5:23 PM → rounds to <strong>5:30 PM</strong></li>
</ul>
<p>Some employers use 6-minute rounding (tenth of an hour) or exact-minute tracking with digital time clocks. Always verify your company's rounding policy. Use our <a href="/time-calculators/time-card-calculator">Time Card Calculator</a> to track your exact clock-in/out times and verify your payroll hours, or the <a href="/time-calculators/work-hours-calculator">Work Hours Calculator</a> for full weekly timesheet totals with automatic FLSA overtime.</p>

<h2 id="us-time-zones">US Time Zones &amp; Daylight Saving Time</h2>
<table>
<thead><tr><th>Zone</th><th>Abbreviation</th><th>UTC Offset (Standard)</th><th>UTC Offset (DST)</th></tr></thead>
<tbody>
<tr><td><strong>Eastern</strong></td><td>EST / EDT</td><td>UTC−5</td><td>UTC−4</td></tr>
<tr><td><strong>Central</strong></td><td>CST / CDT</td><td>UTC−6</td><td>UTC−5</td></tr>
<tr><td><strong>Mountain</strong></td><td>MST / MDT</td><td>UTC−7</td><td>UTC−6</td></tr>
<tr><td><strong>Pacific</strong></td><td>PST / PDT</td><td>UTC−8</td><td>UTC−7</td></tr>
<tr><td><strong>Alaska</strong></td><td>AKST / AKDT</td><td>UTC−9</td><td>UTC−8</td></tr>
<tr><td><strong>Hawaii</strong></td><td>HST</td><td>UTC−10</td><td>No DST</td></tr>
</tbody>
</table>
<p><strong>Daylight saving time (DST)</strong> runs from the second Sunday in March to the first Sunday in November. Arizona (except Navajo Nation) and Hawaii do not observe DST. When scheduling across time zones, remember that the difference between Eastern and Pacific is always 3 hours, regardless of DST. Use our <a href="/time-calculators/hours-calculator">Hours Calculator</a> to compute exact hour differences across multi-day spans, or the <a href="/time-calculators/deadline-calculator">Deadline Calculator</a> to find calendar and business-day deadlines from any start date.</p>
`,
        faq: [
            { question: "How do I add hours and minutes to a time?", answer: "Add hours to hours, minutes to minutes. If minutes total 60+, subtract 60 and add 1 to hours. If hours total 24+, subtract 24 (next day). Example: 10:45 AM + 3h 30m = 10:45 + 3:30 = 13:75 → 14:15 = 2:15 PM. For adding up an entire week of work hours, use the Work Hours Calculator which handles daily entries with break deductions." },
            { question: "How do I subtract time?", answer: "Subtract hours from hours, minutes from minutes. If minutes go negative, add 60 to minutes and subtract 1 from hours. If hours go negative, add 24 (previous day). Example: 2:15 PM − 4h 30m = 14:15 − 4:30 = 9:45 AM. For date-based countdowns (days until an event), try the Days Until Calculator." },
            { question: "How do I convert minutes to decimal hours for payroll?", answer: "Divide minutes by 60. Examples: 15 min = 0.25 hrs, 30 min = 0.50 hrs, 45 min = 0.75 hrs, 20 min = 0.333 hrs, 6 min = 0.10 hrs. For payroll: 7h 45m = 7.75 decimal hours × hourly rate. The Time Card Calculator automatically converts your clock-in/out times to decimal hours." },
            { question: "How many hours is 9 AM to 5 PM?", answer: "9:00 AM to 5:00 PM is exactly 8 hours (gross). With a 30-minute lunch break, net work time is 7.5 hours (7 hours 30 minutes = 7.50 decimal hours). With a 60-minute lunch, net is 7 hours (7.00 decimal). This is the standard US full-time work day. Use the Time Duration Calculator for any start/end time pair." },
            { question: "What is 1.75 hours in hours and minutes?", answer: "Take the decimal part (0.75) and multiply by 60: 0.75 × 60 = 45 minutes. So 1.75 hours = 1 hour 45 minutes. Other common conversions: 1.25 hours = 1h 15m, 1.50 hours = 1h 30m, 2.33 hours ≈ 2h 20m, 8.25 hours = 8h 15m." },
            { question: "How do I calculate time across midnight?", answer: "Just enter the start time and the duration. If you start at 11:00 PM and add 3 hours, the result correctly shows 2:00 AM. For duration calculations across midnight, add 24 to the end time before subtracting. Example: 10 PM to 6 AM = (6+24) − 22 = 8 hours. The Time Duration Calculator handles overnight spans automatically." },
            { question: "What is military time?", answer: "Military time uses a 24-hour clock (0000 to 2359) instead of AM/PM. To convert PM times: add 12 to the hour. 1 PM = 1300, 3 PM = 1500, 10 PM = 2200. Midnight = 0000. Noon = 1200. Used by military, aviation, healthcare, and most countries outside the US. Use our Military Time Converter for instant bidirectional conversion." },
            { question: "How do I round time for payroll (the 7-minute rule)?", answer: "The most common FLSA-compliant method is the 7-minute rule: round to the nearest 15 minutes. 1–7 minutes round down, 8–14 minutes round up. Example: clock in at 8:07 → rounds to 8:00. Clock in at 8:08 → rounds to 8:15. The rounding must not systematically favor the employer. Use the Time Card Calculator to verify your exact hours." },
            { question: "How do I calculate overtime under the FLSA?", answer: "Under the Fair Labor Standards Act (FLSA), non-exempt employees earn 1.5× their regular rate for all hours over 40 in a workweek. Formula: Overtime Pay = (Hours over 40) × (Rate × 1.5). Example: 45 hours at $20/hr → Regular: 40 × $20 = $800. Overtime: 5 × $30 = $150. Total: $950. The Work Hours Calculator computes this automatically." },
            { question: "How many work hours are in a year?", answer: "52 weeks × 40 hours = 2,080 hours per year. With 2 weeks vacation: 2,000 hours. With 2 weeks vacation + 10 federal holidays: 1,920 hours. The 2,080 figure is the standard used for salary-to-hourly conversions in the US. Use the Business Days Calculator to count exact working days between any two dates." },
            { question: "What are the US time zones?", answer: "The continental US has 4 time zones: Eastern (UTC−5), Central (UTC−6), Mountain (UTC−7), Pacific (UTC−8). Plus Alaska (UTC−9) and Hawaii (UTC−10). During DST (March–November), clocks move forward 1 hour. Arizona and Hawaii don't observe DST. Use the Hours Calculator to compute time differences across date boundaries." },
            { question: "How do I calculate elapsed time between two dates?", answer: "For same-day durations: convert both to 24-hour format, then subtract start from end. For multi-day spans: use the Date Duration Calculator which shows years, months, and days. For business days only (excluding weekends): use the Business Days Calculator. For finding a specific future date (e.g., 90 days from now): try the Date Calculator." },
        ],

    },
    "time-duration-calculator": {
        subtitle: "Calculate the exact duration between two times — in hours, minutes, seconds, and total minutes. Handles overnight spans automatically.",
        explanation: {
            heading: "Calculating Time Duration Between Two Times",
            paragraphs: [
                "Enter a start time and end time to instantly see the exact duration. If the end time is earlier than the start time, the calculator assumes the times span across midnight and adjusts accordingly.",
                "This tool is essential for payroll processing, event planning, cooking schedules, and any situation where you need to know exactly how long something took or will take.",
            ],
            highlight: "9:00 AM to 5:30 PM = 8h 30m = 510 total minutes. If end time is before start time (e.g., 10 PM to 6 AM), it correctly calculates 8 hours spanning midnight.",
        },
        faq: [
            { question: "Does this handle overnight time spans?", answer: "Yes. If the end time is earlier than the start time, the calculator automatically assumes you've crossed midnight. For example, 10:00 PM to 6:00 AM correctly calculates as 8 hours." },
        ],
    },
    "time-card-calculator": {
        subtitle: "Track your work hours with clock-in/out times and break deduction. See gross hours, net hours, and decimal hours for payroll.",
        explanation: {
            heading: "Time Card Calculator for Work Hour Tracking",
            paragraphs: [
                "Enter your clock-in and clock-out times along with your break duration to instantly calculate your net working hours. The calculator shows both standard format (hours and minutes) and decimal hours — the format most payroll systems require.",
                "Decimal hours convert minutes to fractions: 7h 30m = 7.5 decimal hours, 8h 15m = 8.25 decimal hours. This makes payroll multiplication straightforward: 7.5 hours × $25/hour = $187.50.",
            ],
            highlight: "Clock in 9:00, clock out 5:30, 60-minute break = 7h 30m net work (7.5 decimal hours). At $25/hr, that's $187.50 for the day.",
        },
        faq: [
            { question: "What are decimal hours?", answer: "Decimal hours express time as a decimal number instead of hours and minutes. 30 minutes = 0.5 hours, 15 minutes = 0.25 hours, 45 minutes = 0.75 hours. Most payroll systems use decimal hours for wage calculations." },
            { question: "Does this work for overnight shifts?", answer: "Yes. If your clock-out time is earlier than clock-in (e.g., in 10 PM, out 6 AM), the calculator correctly calculates 8 hours of gross time." },
        ],
    },
    "work-hours-calculator": {
        subtitle: "Add up your weekly work hours with start time, end time, and breaks for each day. See total hours in hh:mm and decimal format, automatic FLSA overtime calculation, and optional gross pay estimate.",
        explanation: {
            heading: "Weekly Work Hours Calculator with Overtime & Pay",
            paragraphs: [
                "Enter your clock-in and clock-out times plus break duration for each day of the week. The calculator instantly totals your hours in both standard (hours:minutes) and decimal format — the format most payroll systems use. Days you didn't work can be unchecked to exclude them.",
                "If your total exceeds 40 hours per week, the calculator automatically splits your time into regular hours (up to 40) and overtime hours (the excess) per FLSA rules. Toggle the pay calculation to see your estimated gross pay, including time-and-a-half overtime.",
            ],
            highlight: "Mon–Fri, 9:00 AM to 5:30 PM with a 60-minute break = 37.50 decimal hours per week. At $25/hr, that's $937.50 gross pay. Add Saturday hours to see overtime calculations kick in.",
        },
        contentHTML: `
<h2 id="how-to-calculate-work-hours">How to Calculate Work Hours</h2>
<p>Calculating work hours is straightforward once you break it into steps. For each work day:</p>
<ol>
<li><strong>Convert times to 24-hour format.</strong> 9:00 AM = 09:00. 5:30 PM = 17:30.</li>
<li><strong>Subtract start time from end time.</strong> 17:30 − 09:00 = 8 hours 30 minutes (gross hours).</li>
<li><strong>Subtract unpaid breaks.</strong> 8h 30m − 60 min break = <strong>7h 30m net hours</strong>.</li>
<li><strong>Convert to decimal hours</strong> for payroll: 7h 30m = 7 + (30 ÷ 60) = <strong>7.50 decimal hours</strong>.</li>
</ol>
<p>For a full work week, repeat for each day and add the daily totals. Our calculator above does all of this automatically for all 7 days.</p>

<h3 id="overnight-shift">Overnight Shifts</h3>
<p>If your shift crosses midnight (e.g., clock in 10:00 PM, clock out 6:30 AM), the calculator detects this automatically. It adds 24 hours to the end time before subtracting: (6:30 + 24:00) − 22:00 = 8h 30m gross hours.</p>

<h2 id="converting-minutes-to-decimal">Converting Minutes to Decimal Hours</h2>
<p>Payroll systems use <strong>decimal hours</strong> instead of hours and minutes. The conversion formula is:</p>
<p style="text-align:center;font-weight:700;font-size:1.1em">Decimal Hours = Whole Hours + (Minutes ÷ 60)</p>
<p><strong>Example:</strong> You worked 41 hours and 15 minutes.</p>
<ul>
<li>Whole hours = 41</li>
<li>Minutes to decimal: 15 ÷ 60 = 0.25</li>
<li>Total decimal hours: <strong>41.25</strong></li>
<li>At $20/hr: 41.25 × $20 = <strong>$825.00</strong></li>
</ul>

<h3 id="minutes-to-decimal-table">Minutes to Decimal Quick-Reference Table</h3>
<table>
<thead><tr><th>Minutes</th><th>Decimal</th><th>Minutes</th><th>Decimal</th><th>Minutes</th><th>Decimal</th></tr></thead>
<tbody>
<tr><td>5</td><td>0.08</td><td>25</td><td>0.42</td><td>45</td><td>0.75</td></tr>
<tr><td>6</td><td>0.10</td><td>30</td><td>0.50</td><td>48</td><td>0.80</td></tr>
<tr><td>10</td><td>0.17</td><td>35</td><td>0.58</td><td>50</td><td>0.83</td></tr>
<tr><td>12</td><td>0.20</td><td>36</td><td>0.60</td><td>54</td><td>0.90</td></tr>
<tr><td>15</td><td>0.25</td><td>40</td><td>0.67</td><td>55</td><td>0.92</td></tr>
<tr><td>20</td><td>0.33</td><td>42</td><td>0.70</td><td>60</td><td>1.00</td></tr>
</tbody>
</table>
<p><strong>Tip:</strong> 6-minute increments are the standard billing unit in the legal profession (each 6 min = 0.10 hours). Quarter-hour rounding (15 min = 0.25) is the most common payroll rounding method.</p>

<h2 id="flsa-overtime-rules">FLSA Overtime Rules for US Workers</h2>
<p>The <strong>Fair Labor Standards Act (FLSA)</strong> is the federal law that governs overtime pay in the United States. Here are the key rules every hourly worker and employer should know:</p>
<ul>
<li><strong>40-hour threshold:</strong> Non-exempt employees must receive overtime pay for all hours worked over 40 in a workweek.</li>
<li><strong>Overtime rate:</strong> The minimum overtime rate is <strong>1.5× the regular hourly rate</strong> (commonly called "time and a half").</li>
<li><strong>Workweek definition:</strong> A workweek is any fixed, recurring 168-hour period (7 consecutive 24-hour periods). It doesn't have to align with the calendar week.</li>
<li><strong>No daily overtime (federally):</strong> Federal law does <em>not</em> require overtime for working more than 8 hours in a single day. However, some states (like <strong>California</strong>) do require daily overtime after 8 hours.</li>
<li><strong>Exempt vs. non-exempt:</strong> Salaried employees earning above a threshold ($35,568/year as of 2024) in executive, administrative, or professional roles may be exempt from overtime. Hourly workers are almost always non-exempt.</li>
</ul>

<h3 id="overtime-calculation-example">Overtime Calculation Example</h3>
<p>You worked 45 hours this week at $20/hour:</p>
<ul>
<li>Regular pay: 40 hours × $20 = <strong>$800</strong></li>
<li>Overtime hours: 45 − 40 = <strong>5 hours</strong></li>
<li>Overtime rate: $20 × 1.5 = <strong>$30/hour</strong></li>
<li>Overtime pay: 5 × $30 = <strong>$150</strong></li>
<li>Total gross pay: $800 + $150 = <strong>$950</strong></li>
</ul>
<p>Our calculator above performs this computation automatically when your total exceeds 40 hours and you enable the "Show Pay Calculation" option.</p>

<h2 id="common-us-work-schedules">Common US Work Schedules</h2>
<table>
<thead><tr><th>Schedule Type</th><th>Hours/Day</th><th>Days/Week</th><th>Hours/Week</th><th>Common In</th></tr></thead>
<tbody>
<tr><td><strong>Standard</strong></td><td>8</td><td>5 (Mon–Fri)</td><td>40</td><td>Most office jobs</td></tr>
<tr><td><strong>9/80 Compressed</strong></td><td>9 or 8</td><td>5 or 4 (alternating)</td><td>40</td><td>Federal government, engineering</td></tr>
<tr><td><strong>4/10 Compressed</strong></td><td>10</td><td>4</td><td>40</td><td>Healthcare, manufacturing</td></tr>
<tr><td><strong>Part-Time</strong></td><td>4–6</td><td>3–5</td><td>20–30</td><td>Retail, food service</td></tr>
<tr><td><strong>Rotating Shifts</strong></td><td>8 or 12</td><td>Varies</td><td>36–48</td><td>Hospitals, police, fire</td></tr>
<tr><td><strong>Flex Schedule</strong></td><td>Varies</td><td>5</td><td>40</td><td>Tech, startups</td></tr>
</tbody>
</table>

<h2 id="gross-pay-formula">How to Calculate Gross Pay from Work Hours</h2>
<p>The gross pay formula depends on whether you worked overtime:</p>
<p><strong>No overtime (≤ 40 hours):</strong></p>
<p style="text-align:center;font-weight:700">Gross Pay = Total Hours × Hourly Rate</p>
<p><strong>With overtime (> 40 hours):</strong></p>
<p style="text-align:center;font-weight:700">Gross Pay = (40 × Rate) + (Overtime Hours × Rate × 1.5)</p>
<p>Remember: gross pay is <em>before</em> taxes and deductions. Your take-home pay will be lower after federal income tax, state income tax, Social Security (6.2%), and Medicare (1.45%) are withheld. Use our <a href="/time-calculators/time-card-calculator">Time Card Calculator</a> for single-day calculations, or our <a href="/time-calculators/hours-calculator">Hours Calculator</a> for multi-day hour tracking.</p>

<h2 id="break-requirements">Federal and State Break Requirements</h2>
<p>There is <strong>no federal requirement</strong> for meal or rest breaks under the FLSA. However, if an employer provides short breaks (typically 5–20 minutes), they must be <em>paid</em>. Meal periods of 30 minutes or longer may be unpaid if the employee is completely relieved of duties.</p>
<p>Many states have their own break laws:</p>
<ul>
<li><strong>California:</strong> 30-min unpaid meal break for shifts over 5 hours; 10-min paid rest break per 4 hours worked.</li>
<li><strong>Washington:</strong> 30-min meal break for shifts over 5 hours; 10-min paid rest break per 4 hours.</li>
<li><strong>New York:</strong> 30-min meal break for shifts over 6 hours.</li>
<li><strong>Texas, Florida, Georgia:</strong> No state-mandated break requirements (follow FLSA only).</li>
</ul>
<p>Our calculator defaults to a 60-minute break for weekdays, but you can adjust the break duration for each day to match your actual schedule.</p>

<h2 id="payroll-rounding">Payroll Time Rounding Rules</h2>
<p>The FLSA allows employers to round time to the nearest increment, as long as rounding doesn't systematically favor the employer over time. The most common rounding method is the <strong>7-minute rule</strong>:</p>
<ul>
<li>Round to the nearest <strong>15 minutes</strong> (quarter hour)</li>
<li>1–7 minutes → round <strong>down</strong></li>
<li>8–14 minutes → round <strong>up</strong></li>
</ul>
<p><strong>Example:</strong> Clock in at 8:07 AM → rounds to 8:00 AM. Clock in at 8:08 AM → rounds to 8:15 AM.</p>
<p>Some employers use 6-minute rounding (tenth of an hour) or exact-minute tracking with digital time clocks. Always check your company's policy.</p>

<h2 id="time-tracking-tips">Tips for Accurate Time Tracking</h2>
<ul>
<li><strong>Use consistent time format:</strong> Pick either 12-hour or 24-hour and stick with it to avoid AM/PM mix-ups. Our calculator uses 24-hour format for accuracy.</li>
<li><strong>Record times immediately:</strong> Don't rely on memory at the end of the day. Use a phone alarm or digital clock-in system.</li>
<li><strong>Track breaks separately:</strong> Always deduct actual break time, not just the scheduled break. A 45-minute lunch is 0.75 hours, not 1.00.</li>
<li><strong>Save weekly totals:</strong> Keep a record of your weekly hours for pay stub verification and tax documentation.</li>
<li><strong>Know your state laws:</strong> Some states (California, Colorado, Oregon) have daily overtime rules on top of the federal weekly overtime rule.</li>
</ul>

<h2 id="work-hours-in-a-year">How Many Work Hours Are in a Year?</h2>
<table>
<thead><tr><th>Scenario</th><th>Calculation</th><th>Total Hours</th></tr></thead>
<tbody>
<tr><td><strong>No time off</strong></td><td>52 weeks × 40 hours</td><td>2,080</td></tr>
<tr><td><strong>2 weeks vacation</strong></td><td>50 weeks × 40 hours</td><td>2,000</td></tr>
<tr><td><strong>2 weeks vacation + 10 holidays</strong></td><td>50 × 40 − (10 × 8)</td><td>1,920</td></tr>
<tr><td><strong>Part-time (20 hrs/week)</strong></td><td>52 × 20</td><td>1,040</td></tr>
</tbody>
</table>
<p>The standard figure used for <strong>salary-to-hourly</strong> conversions in the US is <strong>2,080 hours per year</strong> (52 weeks × 40 hours). Use our <a href="/time-calculators/business-days-calculator">Business Days Calculator</a> to count the exact working days between any two dates, or our <a href="/time-calculators/deadline-calculator">Deadline Calculator</a> to plan project timelines.</p>
        `,
        faq: [
            { question: "How many hours is a standard work week in the US?", answer: "A standard full-time work week in the US is 40 hours, typically Monday through Friday, 8 hours per day. This is the threshold used by the FLSA for overtime calculations. Anything over 40 hours in a workweek qualifies for overtime pay at 1.5× the regular rate for non-exempt employees." },
            { question: "How do I convert 41 hours 15 minutes to decimal?", answer: "Take the minutes and divide by 60: 15 ÷ 60 = 0.25. Add to the whole hours: 41 + 0.25 = 41.25 decimal hours. To convert back: take the decimal portion (0.25) and multiply by 60: 0.25 × 60 = 15 minutes. So 41.25 = 41 hours 15 minutes." },
            { question: "What is FLSA overtime?", answer: "FLSA (Fair Labor Standards Act) overtime requires employers to pay non-exempt employees at least 1.5× their regular hourly rate for all hours worked over 40 in a workweek. For example, at $20/hour, overtime pays $30/hour. The FLSA is a federal law enforced by the Department of Labor." },
            { question: "How do I calculate overtime pay?", answer: "Overtime Pay = (Hours over 40) × (Hourly Rate × 1.5). Example: 45 hours at $20/hr → Regular: 40 × $20 = $800. Overtime: 5 × $30 = $150. Total: $950. Some states like California also require daily overtime (after 8 hours in a day) in addition to the weekly 40-hour threshold." },
            { question: "Are lunch breaks paid in the US?", answer: "Under federal FLSA rules, meal periods of 30+ minutes are generally unpaid IF the employee is completely relieved of duties. Short breaks (5–20 minutes) must be paid. State laws vary — California, Washington, and New York have specific break requirements. There is no federal law REQUIRING employers to provide breaks." },
            { question: "How many work hours are in a year?", answer: "52 weeks × 40 hours = 2,080 hours per year. With 2 weeks vacation: 2,000 hours. With 2 weeks vacation + 10 federal holidays: 1,920 hours. The 2,080 figure is the standard used for salary-to-hourly conversions in the US." },
            { question: "What is the difference between gross hours and net hours?", answer: "Gross hours = total time from clock-in to clock-out. Net hours = gross hours minus unpaid breaks. Example: clock in 9:00, clock out 5:30 = 8.5 gross hours. Minus 1-hour lunch = 7.5 net hours. Payroll is calculated on net hours, not gross." },
            { question: "How do I round time for payroll?", answer: "The most common FLSA-compliant method is the 7-minute rule: round to the nearest 15 minutes. 1–7 minutes round down, 8–14 minutes round up. Example: 8:07 AM → 8:00. 8:08 AM → 8:15. The key rule is that rounding must not consistently favor the employer." },
            { question: "What is a compressed work schedule?", answer: "A compressed schedule packs 40 hours into fewer than 5 days. Common formats: 4/10 (four 10-hour days, one day off) and 9/80 (alternating weeks of five 9-hour days and four 9-hour days plus one 8-hour day, getting every other Friday off). Popular in government and healthcare." },
            { question: "How many working days are in a month?", answer: "Most months have 20–23 working days (weekdays). The average is about 21.7 working days per month. January and February tend to have fewer (due to New Year's and Presidents' Day holidays), while months without federal holidays have 22–23. Use our Business Days Calculator for exact counts." },
        ],
    },
    "hours-calculator": {
        subtitle: "Calculate the total number of hours and minutes between two date-times. Perfect for project tracking and event duration.",
        explanation: {
            heading: "Hours Between Two Dates and Times",
            paragraphs: [
                "Unlike the Time Duration Calculator (which works within a single day), the Hours Calculator spans across multiple days. Enter a start date-time and end date-time to see the total hours and minutes between them.",
                "This is invaluable for tracking project hours, calculating event durations that span multiple days (conferences, trips), and billing for time-based services.",
            ],
            highlight: "Monday 9:00 AM to Wednesday 5:00 PM = 56 hours. The calculator handles multi-day spans, month boundaries, and even year boundaries.",
        },
    },
    "military-time-converter": {
        subtitle: "Convert between 12-hour (AM/PM) and 24-hour (military) time format. Instant, bidirectional conversions.",
        explanation: {
            heading: "Understanding Military Time (24-Hour Clock)",
            paragraphs: [
                "Military time (also called the 24-hour clock) runs from 0000 (midnight) to 2359 (11:59 PM). It eliminates AM/PM confusion — there's no ambiguity between 8 AM and 8 PM. Military, aviation, healthcare, and many international contexts use 24-hour time exclusively.",
                "Quick conversion rules: For AM times (12:01 AM – 12:59 PM), the hours stay the same (but midnight is 0000). For PM times (1:00 PM – 11:59 PM), add 12 to the hour: 1 PM = 1300, 3 PM = 1500, 10 PM = 2200.",
            ],
            highlight: "3:30 PM = 1530 military time. Midnight = 0000. Noon = 1200. The converter handles both directions instantly, including edge cases like 12 AM (0000) and 12 PM (1200).",
        },
        faq: [
            { question: "Is military time the same as 24-hour time?", answer: "Essentially yes. Both number hours 0–23 continuously. The main difference is notation: military time is written without a colon (1530), while 24-hour time uses a colon (15:30). Both are unambiguous and used worldwide in aviation, healthcare, and many countries." },
        ],
    },
    "reading-time-calculator": {
        subtitle: "Estimate how long it takes to read any text. Paste your content and get reading time, speaking time, and word count instantly.",
        explanation: {
            heading: "How Reading Time Is Calculated",
            paragraphs: [
                "The average adult reads at approximately 238 words per minute (wpm) for non-fiction content. Our calculator divides your word count by this rate (adjustable) to estimate reading time. It also estimates speaking time at 150 wpm — useful for presentations and speeches.",
                "Content creators use reading time for blog posts (readers prefer knowing time commitment), speakers use it for presentation pacing, and students use it to plan study sessions. The typical blog post is 1,000–2,000 words (4–8 minutes reading time).",
            ],
            highlight: "A 2,000-word article takes about 8 minutes to read (at 238 wpm) and 13 minutes to speak aloud (at 150 wpm). Adjust the WPM slider to match your personal reading speed.",
        },
    },
    "playback-speed-calculator": {
        subtitle: "See how much time you save at different playback speeds — from 1× to 3×. Perfect for podcasts, lectures, and audiobooks.",
        explanation: {
            heading: "Optimizing Playback Speed for Learning",
            paragraphs: [
                "Increasing playback speed is one of the simplest productivity hacks. Research shows that comprehension remains high up to 1.5× speed for most content, and many learners comfortably absorb content at 2× speed after brief adaptation.",
                "A 60-minute podcast at 1.5× takes only 40 minutes — saving 20 minutes per episode. If you listen to 5 podcasts per week, 1.5× speed saves you 100 minutes weekly — over 86 hours per year. At 2× speed, savings double.",
            ],
            highlight: "60 minutes at 1.5× = 40 minutes (save 20 min). At 2× = 30 minutes (save 30 min). Over a year of daily listening, 2× speed saves 182 hours — nearly 8 full days.",
        },
    },
    "date-calculator": {
        subtitle: "Add or subtract days, weeks, months, and years from any date. Find future or past dates instantly for planning and scheduling.",
        explanation: {
            heading: "Date Arithmetic Made Simple",
            paragraphs: [
                "Enter a starting date, choose add or subtract, and specify the number of days, weeks, months, and/or years to adjust. The calculator handles month-length variations (28–31 days), leap years, and all date boundary edge cases automatically.",
                "Common uses: 'What date is 90 days from today?' for contract deadlines. 'What was the date 6 months ago?' for financial reporting periods. 'What date is 2 weeks from Friday?' for scheduling.",
            ],
            highlight: "Today + 30 days = the exact future date with day-of-week shown. Month additions respect month lengths — adding 1 month to January 31 gives February 28 (or 29 in leap years).",
        },
        faq: [
            { question: "How does adding months work for different month lengths?", answer: "Adding 1 month to January 31 gives February 28 (or 29 in a leap year). Adding 1 month to March 31 gives April 30. The calculator always adjusts to the last valid day of the target month." },
        ],
    },
    "date-duration-calculator": {
        subtitle: "Calculate the exact duration between two dates — in years, months, days, total days, and total weeks.",
        explanation: {
            heading: "Precise Duration Between Any Two Dates",
            paragraphs: [
                "Enter a start and end date to see the exact difference broken down into years, months, and days — plus totals in days, weeks, and months. This is the same calculation used for age computation, tenure tracking, and project timeline analysis.",
                "The calculator accounts for varying month lengths and leap years. It always gives the most human-readable breakdown: '2 years, 3 months, 15 days' rather than just '865 days' (though it shows both).",
            ],
            highlight: "January 1 to October 15 = 9 months, 14 days = 287 total days = 41 weeks. Useful for tracking project timelines, relationship milestones, or event planning windows.",
        },
    },
    "business-days-calculator": {
        subtitle: "Count working days between two dates, excluding weekends. Essential for contracts, SLAs, and project planning.",
        explanation: {
            heading: "Business Days vs Calendar Days",
            paragraphs: [
                "Business days (also called working days) exclude Saturdays and Sundays. This distinction is critical for contracts ('payment due within 30 business days'), project management, shipping estimates, and SLA compliance.",
                "A common mistake is confusing calendar days with business days. 30 calendar days contains approximately 22 business days (and 8 weekend days). Missing this distinction can cause missed deadlines and SLA violations.",
            ],
            highlight: "30 calendar days ≈ 22 business days. A '10 business day' delivery window actually spans 14 calendar days (2 weekends). Always clarify which type is specified in contracts.",
        },
        faq: [
            { question: "Are holidays excluded from business days?", answer: "This calculator excludes weekends (Saturday and Sunday) only. Public holidays vary by country and region. For precise calculations involving holidays, manually subtract the applicable holiday count from the business days result." },
        ],
    },
    "days-until-calculator": {
        subtitle: "Countdown to any future date — see days, weeks, months, and hours remaining. Works for past dates too.",
        explanation: {
            heading: "Countdown to Any Date",
            paragraphs: [
                "Enter a target date to instantly see how many days remain until it arrives. The calculator also shows weeks, months, and hours for additional context. If the target date is in the past, it shows how many days ago it was.",
                "Popular uses include tracking days until vacations, product launches, weddings, graduations, retirement, or any significant milestone. Seeing the exact number makes goals feel more tangible and actionable.",
            ],
            highlight: "90 days until your target date = 12 weeks and 6 days = approximately 3 months = 2,160 hours. Seeing multiple timeframes helps you plan with the right granularity.",
        },
    },
    "birth-year-calculator": {
        subtitle: "Find the birth year from someone's current age. Shows both possible birth years depending on birthday timing.",
        explanation: {
            heading: "Calculating Birth Year from Age",
            paragraphs: [
                "If someone is 25 years old in 2026, they were born in either 2000 or 2001 — depending on whether their birthday has already occurred this year. This calculator shows both possible birth years so you always have the complete picture.",
                "This tool is useful for form filling, genealogy research, age verification, and any situation where you know someone's age but need their birth year.",
            ],
            highlight: "Age 25 in 2026 → Born in 2001 (if birthday has passed) or 2000 (if birthday is still coming). Both years are shown so you can choose the correct one based on context.",
        },
    },
    "days-left-in-year-calculator": {
        subtitle: "See how many days are left in the current year — with a visual progress bar, percentage complete, and weeks remaining.",
        explanation: {
            heading: "Year Progress Tracker",
            paragraphs: [
                "This live calculator shows how far through the current year we are. It displays days passed, days remaining, weeks left, and a visual progress bar. The calculation updates automatically based on today's date.",
                "Year-progress tracking is useful for annual goal setting, budget pacing, project planning, and understanding seasonal timing. Knowing you're 75% through the year with only 50% of your annual goals complete creates actionable urgency.",
            ],
            highlight: "The progress bar provides an instant visual of where we are in the year. Use it for annual goal tracking — if the progress bar shows 50% but your goals are only 30% complete, it's time to accelerate.",
        },
    },
    "deadline-calculator": {
        subtitle: "Calculate a deadline from a start date and lead time. Shows both calendar-day and business-day deadlines.",
        explanation: {
            heading: "Deadline and Lead Time Calculator",
            paragraphs: [
                "Enter a start date and the number of lead-time days to calculate when the deadline falls. The calculator shows two results: the calendar-day deadline (counting all days) and the business-day deadline (skipping weekends).",
                "This distinction is critical for project management and contract compliance. A 14-day lead time gives you a calendar deadline of exactly 2 weeks later, but a business-day deadline that's approximately 20 calendar days later (accounting for 4 weekends).",
            ],
            highlight: "Start today + 14 lead days → Calendar deadline: 2 weeks later. Business deadline: ~20 calendar days later (skips weekends). Always clarify which type your stakeholder means.",
        },
    },
    "week-calculator": {
        subtitle: "Find the ISO week number of any date, plus the start/end of that week and the day of the year.",
        explanation: {
            heading: "Understanding ISO Week Numbers",
            paragraphs: [
                "ISO 8601 defines week numbering: Week 1 is the week containing January 4th (or equivalently, the week containing the first Thursday of the year). Weeks run Monday through Sunday. A year has either 52 or 53 weeks.",
                "Week numbers are used extensively in business planning, manufacturing schedules, project management, and financial reporting. 'Ship by Week 42' is more precise than 'ship in mid-October' and is standard in European and international business.",
            ],
            highlight: "Enter any date to see its ISO week number, the start and end dates of that week, and the day-of-year number. Week numbers provide a universal reference for scheduling across organizations.",
        },
    },
};

export default async function TimeCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("time").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/time-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Time & Date Calculators", url: canonicalUrl("/time-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-time-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Time & Date Calculators", href: "/time-calculators" },
                    { label: calc.title.replace(" Calculator", "").replace(" Converter", "") },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {content.subtitle}
                </p>
            )}

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <TimeDateCalculatorCore calcType={calc.calcType || "time-calc"} />

                    {content && (
                        <>
                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                            />
                            {content.contentHTML && (
                                <section
                                    className="hub-content"
                                    style={{ marginTop: "var(--s-6)" }}
                                    dangerouslySetInnerHTML={{ __html: content.contentHTML }}
                                />
                            )}
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                        </>
                    )}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <div className="trending">
                        <h3>📅 Related Time & Date Tools</h3>
                        <div className="trending__list">
                            <Link href="/time-calculators/days-from-today" className="trending__item">Days From Today Calculator</Link>
                            <Link href="/time-calculators/countdown-timer" className="trending__item">Countdown Timer</Link>
                            <Link href="/time-calculators/date-calculator" className="trending__item">Date Calculator</Link>
                            <Link href="/time-calculators/business-days-calculator" className="trending__item">Business Days Calculator</Link>
                            <Link href="/time-calculators/date-duration-calculator" className="trending__item">Date Duration Calculator</Link>
                            <Link href="/time-calculators/days-until-calculator" className="trending__item">Days Until Calculator</Link>
                            <Link href="/time-calculators/deadline-calculator" className="trending__item">Deadline Calculator</Link>
                            <Link href="/time-calculators/time-calculator" className="trending__item">Time Calculator</Link>
                            <Link href="/time-calculators/time-duration-calculator" className="trending__item">Time Duration Calculator</Link>
                            <Link href="/time-calculators/hours-calculator" className="trending__item">Hours Calculator</Link>
                            <Link href="/time-calculators/time-card-calculator" className="trending__item">Time Card Calculator</Link>
                            <Link href="/time-calculators/work-hours-calculator" className="trending__item">Work Hours Calculator</Link>
                            <Link href="/time-calculators/military-time-converter" className="trending__item">Military Time Converter</Link>
                            <Link href="/time-calculators/week-calculator" className="trending__item">Week Calculator</Link>
                            <Link href="/time-calculators/days-left-in-year-calculator" className="trending__item">Days Left in Year</Link>
                            <Link href="/time-calculators/birth-year-calculator" className="trending__item">Birth Year Calculator</Link>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}

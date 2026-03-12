// Dynamic Hub — /time-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TimeDateCalculatorCore from "@/components/calculator/TimeDateCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

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
    faq?: { question: string; answer: string }[];
}> = {
    "time-calculator": {
        subtitle: "Add or subtract hours, minutes, and seconds from any time of day. Perfect for scheduling, cooking, and shift planning.",
        explanation: {
            heading: "How the Time Calculator Works",
            paragraphs: [
                "This calculator performs arithmetic on time values. Enter a starting time in 24-hour format, choose to add or subtract, then enter the hours, minutes, and seconds to adjust by. The result automatically wraps around midnight — if you add 5 hours to 10:00 PM, you get 3:00 AM.",
                "Common uses include calculating end times for meetings, cooking timers, flight arrivals across time zones, and shift scheduling. The tool handles all the tricky edge cases like crossing midnight and minute/second overflow automatically.",
            ],
            highlight: "9:30 AM + 2h 45m = 12:15 PM. The calculator handles all the carry-over arithmetic so you don't have to think about it.",
        },
        faq: [
            { question: "Can I add more than 24 hours?", answer: "Yes. The calculator wraps around — adding 25 hours is the same as adding 1 hour. The result always shows a valid time within a 24-hour day." },
            { question: "How do I calculate time across midnight?", answer: "Just enter the start time and the duration. If you start at 11:00 PM and add 3 hours, the result correctly shows 2:00 AM." },
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
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                        </>
                    )}
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}

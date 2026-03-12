// Time & Date Calculators Category Page — /time-calculators/
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryGrid from "@/components/shared/CategoryGrid";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Time & Date Calculators — Duration, Business Days, Countdown & More",
    description:
        "Free time and date calculators: duration between times, business days counter, date math, military time converter, reading time estimator, and more. Instant results.",
    alternates: { canonical: canonicalUrl("/time-calculators") },
};

const schemaData = JSON.stringify([
    breadcrumbSchema([
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Time & Date Calculators" },
    ]),
    {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Time & Date Calculators",
        description: "All time and date calculators including duration, business days, countdown, and more.",
        url: canonicalUrl("/time-calculators"),
    },
]);

export default function TimeCalculatorsPage() {
    const timeCalcs = getCalculatorsByCategory("time");

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-time-category"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Time & Date Calculators" },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>
                Time & Date Calculators — Duration, Business Days, Countdown & More
            </h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Plan trips, schedule events, track work hours, and calculate deadlines with our
                free time and date tools. Simplify every time-related task with instant, accurate results.
            </p>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>All Time & Date Calculators</h2>
                <div className="calc-index-grid">
                    {timeCalcs.map((calc: CalculatorDef) => (
                        <Link
                            key={calc.id}
                            href={`/time-calculators/${calc.slug}`}
                            className="calc-index-card"
                        >
                            <span className="calc-index-card__icon">{calc.icon}</span>
                            <div className="calc-index-card__body">
                                <h3>{calc.title}</h3>
                                <p>{calc.description}</p>
                                <span className="calc-index-card__stars">
                                    {"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <DynamicExplanation
                heading="Why Time & Date Calculators Matter"
                paragraphs={[
                    "Time is the one resource you cannot buy, borrow, or store — making accurate time management the highest-leverage skill in business and life. These calculators eliminate mental math and human error from scheduling, project planning, and deadline tracking.",
                    "From counting business days for SLA compliance to converting military time for global coordination, every tool is designed for instant, zero-friction results. No formulas to remember, no spreadsheets to maintain.",
                ]}
                highlight="Pro tip: The Business Days Calculator is invaluable for contracts and SLAs. A '30-day' delivery window actually means ~22 business days — missing this distinction is one of the most common project planning mistakes."
            />

            <FAQAccordion
                title="Time & Date Calculator FAQ"
                items={[
                    {
                        question: "How do I calculate the number of days between two dates?",
                        answer: "Use our Date Duration Calculator. Enter the start date and end date, and it instantly shows the difference in years, months, days, total weeks, and total days. It handles month-length variations and leap years automatically.",
                    },
                    {
                        question: "What is the difference between calendar days and business days?",
                        answer: "Calendar days include every day (Monday through Sunday). Business days exclude weekends (Saturday and Sunday) and optionally holidays. A 14-calendar-day window contains only 10 business days. Always clarify which type is meant in contracts and deadlines.",
                    },
                    {
                        question: "How does military time work?",
                        answer: "Military (24-hour) time runs from 0000 (midnight) to 2359 (11:59 PM). To convert PM times: add 12 to the hour (3:00 PM = 1500). To convert from military: if the hour is 13 or above, subtract 12 and add PM. Our converter handles this instantly.",
                    },
                    {
                        question: "What is the average reading speed?",
                        answer: "The average adult reads at approximately 238 words per minute (wpm) for non-fiction and 260 wpm for fiction. Speed readers can reach 500–700 wpm. Our Reading Time Calculator lets you adjust the WPM to match your personal reading speed.",
                    },
                ]}
            />

            <section style={{ marginTop: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore Other Categories</h2>
                <CategoryGrid exclude={["time"]} />
            </section>
        </main>
    );
}

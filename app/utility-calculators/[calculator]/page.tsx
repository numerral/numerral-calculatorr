// Dynamic Hub — /utility-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UtilityCalculatorCore from "@/components/calculator/UtilityCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import Link from "next/link";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export function generateStaticParams() {
    return getCalculatorsByCategory("utility").map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("utility").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/utility-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "age-calculator": {
        subtitle: "Find your exact age in years, months, and days from your date of birth — or calculate age between any two dates.",
        contentHTML: `
            <h2>How Old Am I? — How This Calculator Works</h2>
            <p>Our age calculator computes the precise difference between your <strong>date of birth</strong> and a target date (defaulting to today). It accounts for varying month lengths (28, 29, 30, or 31 days) and correctly handles <strong>leap years</strong>, giving you accurate results in years, months, and days. Beyond basic age, it also shows your total age in <strong>days, weeks, and months</strong> — and tells you exactly how many days remain until your next birthday.</p>
            <p>The calculation uses the international (Western) age system where you are age 0 at birth and your age increments on each birthday. If you enter a target date in the future, the calculator shows what your age <em>will be</em> on that date — useful for eligibility checks, milestone planning, and event countdowns.</p>

            <h2>How to Calculate Age by Hand</h2>
            <p>There are two reliable methods for calculating age manually. Both give accurate results; the first is more intuitive for everyday use, while the second is useful for spreadsheet-based calculations.</p>

            <h3>Method 1: Long Subtraction (Borrowing)</h3>
            <p>This method works like subtraction with carrying, using the date format <strong>YYYY MM DD</strong>. Place the more recent date on top and the older date on the bottom, then subtract right to left:</p>
            <ol>
                <li><strong>Subtract days.</strong> If the result is negative, borrow 1 from the months column. The number of days you borrow equals the number of days in the previous month.</li>
                <li><strong>Subtract months.</strong> If the result is negative, borrow 1 from the years column (add 12 months).</li>
                <li><strong>Subtract years.</strong></li>
            </ol>
            <p><strong>Worked Example:</strong> Calculate the age of someone born <strong>November 15, 1995</strong> as of <strong>April 4, 2026</strong>.</p>
            <ul>
                <li>Set up: <strong>2026 04 04</strong> (top) minus <strong>1995 11 15</strong> (bottom)</li>
                <li>Days: 4 − 15 = negative → borrow 1 month. March has 31 days, so: 4 + 31 = 35. Then 35 − 15 = <strong>20 days</strong></li>
                <li>Months: 4 − 1 (borrowed) = 3. Then 3 − 11 = negative → borrow 1 year (add 12): 3 + 12 = 15. Then 15 − 11 = <strong>4 months</strong></li>
                <li>Years: 2026 − 1 (borrowed) = 2025. Then 2025 − 1995 = <strong>30 years</strong></li>
            </ul>
            <div class="explanation__highlight">
                <strong>Result:</strong> The person is <strong>30 years, 4 months, and 20 days old</strong>. Use this calculator above to verify instantly.
            </div>

            <h3>Method 2: Total Days Division</h3>
            <p>Count the total number of days between the two dates, then divide by <strong>365.2425</strong> (the average length of a Gregorian calendar year, accounting for leap years):</p>
            <ul>
                <li>Total days between Nov 15, 1995 and Apr 4, 2026 = <strong>11,098 days</strong></li>
                <li>11,098 ÷ 365.2425 = <strong>30.38 years</strong> ≈ 30 years and ~4.6 months</li>
            </ul>
            <p>This method gives an approximate result. For exact years/months/days, the long subtraction method or our calculator is more precise.</p>

            <h2>Age in Different Units — Conversion Chart</h2>
            <p>How old are you in days? In weeks? In hours? This reference chart converts common ages into different time units. Approximate values assume 365.25 days per year (accounting for leap years).</p>
            <table>
                <thead><tr><th>Age (Years)</th><th>Days</th><th>Weeks</th><th>Months</th><th>Hours</th></tr></thead>
                <tbody>
                    <tr><td><strong>1</strong></td><td>365</td><td>52</td><td>12</td><td>8,766</td></tr>
                    <tr><td><strong>5</strong></td><td>1,826</td><td>261</td><td>60</td><td>43,830</td></tr>
                    <tr><td><strong>10</strong></td><td>3,652</td><td>522</td><td>120</td><td>87,660</td></tr>
                    <tr><td><strong>16</strong></td><td>5,844</td><td>835</td><td>192</td><td>140,256</td></tr>
                    <tr><td><strong>18</strong></td><td>6,574</td><td>939</td><td>216</td><td>157,766</td></tr>
                    <tr><td><strong>21</strong></td><td>7,670</td><td>1,096</td><td>252</td><td>184,082</td></tr>
                    <tr><td><strong>25</strong></td><td>9,131</td><td>1,304</td><td>300</td><td>219,145</td></tr>
                    <tr><td><strong>30</strong></td><td>10,957</td><td>1,565</td><td>360</td><td>262,974</td></tr>
                    <tr><td><strong>40</strong></td><td>14,610</td><td>2,087</td><td>480</td><td>350,640</td></tr>
                    <tr><td><strong>50</strong></td><td>18,262</td><td>2,609</td><td>600</td><td>438,300</td></tr>
                    <tr><td><strong>62</strong></td><td>22,645</td><td>3,235</td><td>744</td><td>543,490</td></tr>
                    <tr><td><strong>65</strong></td><td>23,741</td><td>3,392</td><td>780</td><td>569,790</td></tr>
                    <tr><td><strong>67</strong></td><td>24,472</td><td>3,496</td><td>804</td><td>587,322</td></tr>
                    <tr><td><strong>80</strong></td><td>29,220</td><td>4,174</td><td>960</td><td>701,280</td></tr>
                </tbody>
            </table>
            <p><em>Leap years add 1 day for every 4 years. A person who turns 40 has experienced approximately 10 leap days.</em></p>

            <h2>Age Systems Around the World</h2>
            <p>Age is not counted the same way in every culture. Our calculator uses the <strong>international (Western) system</strong>, which is the legal standard in the United States and most countries. Here's how systems differ:</p>

            <h3>International (Western) Age System</h3>
            <p>You are <strong>age 0 at birth</strong>, and your age increases by 1 on each birthday. A person born on March 15, 2000 turns 26 on March 15, 2026. This is the system used in the <strong>United States</strong>, all of Europe, and most of the modern world. It is the basis for all legal age calculations — voting eligibility, drinking age, Social Security benefits, etc.</p>

            <h3>Korean Age System</h3>
            <p>In the traditional Korean system, you are <strong>age 1 at birth</strong>, and everyone's age increments by 1 on <strong>January 1</strong> (not on their birthday). A baby born on December 31 would be "1" at birth and turn "2" the very next day on January 1 — making them "2 years old" when only 1 day old.</p>
            <p><strong>Important update:</strong> South Korea officially <a href="https://www.bbc.com/news/world-asia-65838842" target="_blank" rel="noopener noreferrer">switched to the international age system in June 2023</a> for all legal and administrative purposes. Korean age is still used informally in social contexts.</p>

            <h3>Chinese Lunar Age System</h3>
            <p>Similar to Korean age, the traditional Chinese system counts you as <strong>1 at birth</strong>, with age incrementing on <strong>Lunar New Year</strong> (late January or February). This system is used in some traditional Chinese contexts and is sometimes referenced in Chinese astrology.</p>

            <h3>Comparison Example</h3>
            <table>
                <thead><tr><th>System</th><th>Born Dec 20, 2000</th><th>Age on Jan 5, 2026</th></tr></thead>
                <tbody>
                    <tr><td><strong>International (Western)</strong></td><td>Age 0 at birth</td><td><strong>25 years old</strong></td></tr>
                    <tr><td><strong>Korean (traditional)</strong></td><td>Age 1 at birth</td><td><strong>27 years old</strong></td></tr>
                    <tr><td><strong>Chinese Lunar</strong></td><td>Age 1 at birth</td><td><strong>27 years old</strong> (if after Lunar New Year)</td></tr>
                </tbody>
            </table>

            <h2>What If You Were Born on a Leap Day? (February 29)</h2>
            <p>Approximately <strong>4.1 million Americans</strong> have a February 29 birthday — roughly a 1-in-1,461 chance. Leap Day babies (sometimes called "leaplings") face a unique question: <em>what is your birthday in non-leap years?</em></p>
            <ul>
                <li><strong>Most U.S. states</strong> legally recognize <strong>March 1</strong> as the birthday in non-leap years for age-related milestones (driver's license, voting, drinking age).</li>
                <li>Some states and agencies use <strong>February 28</strong> instead.</li>
                <li>The <strong>Social Security Administration</strong> uses March 1 for benefit calculations in non-leap years.</li>
                <li>International practice varies — in New Zealand, the legal birthday in non-leap years is February 28; in Hong Kong and Taiwan, it is March 1.</li>
            </ul>
            <p>Our calculator handles leap year birthdays correctly — it counts your exact chronological age regardless of whether the current year is a leap year.</p>

            <h2>How to Calculate Age in Excel or Google Sheets</h2>
            <p>You can calculate exact age in <strong>Microsoft Excel</strong> or <strong>Google Sheets</strong> using the <code>DATEDIF</code> function. Although this function is undocumented in Excel's official help, it works reliably in all versions.</p>

            <h3>Step-by-Step Formulas</h3>
            <p>Assume your date of birth is in cell <strong>A1</strong> (e.g., 11/15/1995):</p>
            <table>
                <thead><tr><th>What to Calculate</th><th>Formula</th><th>Result Example</th></tr></thead>
                <tbody>
                    <tr><td>Years</td><td><code>=DATEDIF(A1, TODAY(), "Y")</code></td><td>30</td></tr>
                    <tr><td>Remaining Months</td><td><code>=DATEDIF(A1, TODAY(), "YM")</code></td><td>4</td></tr>
                    <tr><td>Remaining Days</td><td><code>=DATEDIF(A1, TODAY(), "MD")</code></td><td>20</td></tr>
                </tbody>
            </table>

            <h3>Combine into One Cell</h3>
            <p>To display the full age as a single readable string:</p>
            <blockquote style="background:var(--n-surface-alt);border-left:4px solid var(--n-primary);padding:var(--s-3) var(--s-4);border-radius:var(--r-md);font-size:0.95em;font-weight:600;font-style:normal;margin:var(--s-3) 0;font-family:monospace">
                =DATEDIF(A1,TODAY(),"Y") & " years, " & DATEDIF(A1,TODAY(),"YM") & " months, " & DATEDIF(A1,TODAY(),"MD") & " days"
            </blockquote>
            <p>This outputs: <strong>30 years, 4 months, 20 days</strong>. The same formulas work identically in <strong>Google Sheets</strong>.</p>

            <h2>How Old Is My Baby?</h2>
            <p>Pediatricians in the United States use age-specific milestones that require precise age tracking in different units:</p>
            <ul>
                <li><strong>First 6 months:</strong> Baby age is measured in <strong>weeks</strong> (e.g., "my baby is 12 weeks old")</li>
                <li><strong>6 months to 2 years:</strong> Age is measured in <strong>months</strong> (e.g., "she is 14 months old")</li>
                <li><strong>After 2 years:</strong> Age is measured in <strong>years and months</strong> (e.g., "he is 3 years and 2 months")</li>
            </ul>
            <p>Our calculator automatically shows <strong>total weeks</strong> in the results, which is exactly what you need for well-baby checkup scheduling. The <a href="https://www.cdc.gov/vaccines/schedules/hcp/imz/child-adolescent.html" target="_blank" rel="noopener noreferrer">CDC recommended immunization schedule</a> uses weeks and months for all pediatric appointments.</p>

            <h3>Standard Pediatric Checkup Schedule</h3>
            <table>
                <thead><tr><th>Checkup</th><th>Baby Age</th><th>Key Milestone</th></tr></thead>
                <tbody>
                    <tr><td>Newborn</td><td>3–5 days</td><td>Weight check, jaundice screening</td></tr>
                    <tr><td>1 month</td><td>4 weeks</td><td>Feeding assessment, Hep B vaccine</td></tr>
                    <tr><td>2 months</td><td>8 weeks</td><td>DTaP, IPV, Hib, PCV13, Rotavirus vaccines</td></tr>
                    <tr><td>4 months</td><td>16 weeks</td><td>Second round of infant vaccines</td></tr>
                    <tr><td>6 months</td><td>26 weeks</td><td>Flu vaccine (first eligible age)</td></tr>
                    <tr><td>9 months</td><td>39 weeks</td><td>Developmental screening</td></tr>
                    <tr><td>12 months</td><td>52 weeks</td><td>MMR, Varicella, Hep A vaccines</td></tr>
                </tbody>
            </table>

            <h2>Days Per Month Reference</h2>
            <table>
                <thead><tr><th>Month</th><th>Days</th><th>Note</th></tr></thead>
                <tbody>
                    <tr><td>January</td><td>31</td><td></td></tr>
                    <tr><td>February</td><td>28 / 29</td><td>29 in leap years</td></tr>
                    <tr><td>March</td><td>31</td><td></td></tr>
                    <tr><td>April</td><td>30</td><td></td></tr>
                    <tr><td>May</td><td>31</td><td></td></tr>
                    <tr><td>June</td><td>30</td><td></td></tr>
                    <tr><td>July</td><td>31</td><td></td></tr>
                    <tr><td>August</td><td>31</td><td></td></tr>
                    <tr><td>September</td><td>30</td><td></td></tr>
                    <tr><td>October</td><td>31</td><td></td></tr>
                    <tr><td>November</td><td>30</td><td></td></tr>
                    <tr><td>December</td><td>31</td><td></td></tr>
                </tbody>
            </table>
            <p><strong>Mnemonic:</strong> "Thirty days hath September, April, June, and November. All the rest have thirty-one, except February alone."</p>
            <p><strong>Leap year rule:</strong> A year is a leap year if divisible by 4, <em>except</em> for century years — unless they're also divisible by 400. So <strong>2000 was a leap year</strong> (divisible by 400), but <strong>1900 was not</strong> (divisible by 100 but not 400). The next century leap year is <strong>2400</strong>.</p>

            <h2>U.S. Legal Age Milestones</h2>
            <p>Many rights and responsibilities in the United States are tied to specific age thresholds. Use this calculator to check eligibility:</p>
            <table>
                <thead><tr><th>Milestone</th><th>Minimum Age</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td><strong>Driver's Learner Permit</strong></td><td>14–16</td><td>Varies by state (14 in South Dakota, 15 in many states, 16 in some)</td></tr>
                    <tr><td><strong>Driver's License</strong></td><td>16–17</td><td>16 in most states with restrictions; full license at 18 in many</td></tr>
                    <tr><td><strong>Voting</strong></td><td>18</td><td>26th Amendment (1971); must register before Election Day</td></tr>
                    <tr><td><strong>Military Enlistment</strong></td><td>17–18</td><td>17 with parental consent; 18 without</td></tr>
                    <tr><td><strong>Legal Drinking Age</strong></td><td>21</td><td>National Minimum Drinking Age Act (1984) — all 50 states</td></tr>
                    <tr><td><strong>Car Rental (most companies)</strong></td><td>25</td><td>Can rent at 21 with surcharge; 25 with no surcharge at most agencies</td></tr>
                    <tr><td><strong>Running for U.S. House</strong></td><td>25</td><td>U.S. Constitution, Article I, Section 2</td></tr>
                    <tr><td><strong>Running for U.S. Senate</strong></td><td>30</td><td>U.S. Constitution, Article I, Section 3</td></tr>
                    <tr><td><strong>Running for President</strong></td><td>35</td><td>U.S. Constitution, Article II, Section 1</td></tr>
                    <tr><td><strong>Social Security (early)</strong></td><td>62</td><td>Reduced benefits; benefit reduced ~6.7%/yr before full retirement age</td></tr>
                    <tr><td><strong>Medicare Eligibility</strong></td><td>65</td><td>Parts A & B; enrollment window is 7 months around 65th birthday</td></tr>
                    <tr><td><strong>Social Security (full)</strong></td><td>66–67</td><td>Full retirement age depends on birth year (1960+: age 67)</td></tr>
                </tbody>
            </table>

            <h2>How Many Days Until My Birthday?</h2>
            <p>Our calculator automatically shows the number of <strong>days remaining until your next birthday</strong> at the top of the results. This countdown is recalculated each time you use the tool.</p>
            <p>For countdowns to other events — vacations, deadlines, holidays, or milestones — use our <a href="/time-calculators/days-until-calculator">Days Until Calculator</a> or <a href="/time-calculators/birthday-countdown">Birthday Countdown Timer</a>.</p>
        `,
        faq: [
            { question: "How old am I if I was born in 1995?", answer: "If you were born in 1995 and your birthday has already passed in 2026, you are 31 years old. If your birthday hasn't occurred yet this year, you are still 30. Enter your exact date of birth above for a precise result in years, months, and days." },
            { question: "How do I calculate my age in days?", answer: "Multiply your age in years by 365.25 (which accounts for leap years) to get an approximate number. For example, 30 years × 365.25 = approximately 10,958 days. For an exact count, use our calculator above — it tallies every day including leap days." },
            { question: "What is the difference between chronological age and biological age?", answer: "Chronological age is the number of years since your birth — the number our calculator computes. Biological age reflects how well your body functions relative to your chronological age, based on biomarkers like telomere length, cardiovascular fitness, and metabolic health. A 50-year-old marathon runner may have a biological age of 35." },
            { question: "How does a leap year affect my age?", answer: "Your chronological age is not affected by leap years — you still age one year per year. However, if you were born on February 29 (Leap Day), your birthday occurs only once every 4 years. In non-leap years, most U.S. states consider your legal birthday to be March 1." },
            { question: "Can I calculate someone's date of birth from their age?", answer: "If you know someone's exact age (years, months, days) and the date on which they were that age, you can reverse-calculate their date of birth by subtracting. Our Birth Year Calculator provides the birth year from just an age in years." },
            { question: "How is Korean age calculated?", answer: "In the traditional Korean system, you are 1 at birth and everyone ages 1 year on January 1. A baby born on December 31 becomes 2 on January 1 — just 1 day after birth. South Korea officially adopted the international (Western) age system for legal purposes in June 2023." },
            { question: "What is the legal drinking age in the United States?", answer: "The legal drinking age in all 50 states is 21, established by the National Minimum Drinking Age Act of 1984. This means you must be 21 years old to purchase or publicly possess alcoholic beverages anywhere in the U.S." },
            { question: "How many days are in a year?", answer: "A standard year has 365 days. A leap year has 366 days (with February 29 added). The average Gregorian year is 365.2425 days. Leap years occur every 4 years, except for century years not divisible by 400. For example, 2024 was a leap year, but 1900 was not." },
            { question: "How do I calculate age in Excel?", answer: "Use the DATEDIF function: =DATEDIF(A1, TODAY(), \\\"Y\\\") for years, =DATEDIF(A1, TODAY(), \\\"YM\\\") for remaining months, and =DATEDIF(A1, TODAY(), \\\"MD\\\") for remaining days. Combine them with: =DATEDIF(A1,TODAY(),\\\"Y\\\") & \\\" years, \\\" & DATEDIF(A1,TODAY(),\\\"YM\\\") & \\\" months\\\"" },
            { question: "At what age can I collect Social Security?", answer: "You can claim Social Security retirement benefits as early as age 62, but your benefit will be permanently reduced (approximately 6.7% per year before full retirement age). Full retirement age is 66 for people born 1943–1954, and 67 for those born in 1960 or later. Delaying benefits past full retirement age increases your payment by 8% per year up to age 70." },
        ],
    },
    "percentage-calculator": {
        subtitle: "Calculate percentages in 5 different ways — find X% of a number, percentage change, what percent one number is of another, and more.",
        contentHTML: `<h2>How to Calculate Percentages — A Complete Guide</h2>
<p>Percentages are one of the most universally useful mathematical concepts in daily life. From calculating GST and discounts to understanding salary hikes, exam scores, and investment returns, percentages are the language of proportion. This guide explains the five key percentage calculation methods, shows step-by-step formulas, and covers real-world applications.</p>

<h3>The 5 Percentage Calculation Modes — Explained</h3>
<p><strong>Mode 1 — What is X% of Y?</strong><br/>Formula: Result = (X ÷ 100) × Y. Used for GST, discounts, tips, interest. Example: 18% of ₹50,000 = <strong>₹9,000</strong>. An item at ₹50,000 with 18% GST costs ₹59,000 total.</p>
<p><strong>Mode 2 — X is what percent of Y?</strong><br/>Formula: Percentage = (X ÷ Y) × 100. Used for exam scores and proportions. If you scored 45 out of 60: (45 ÷ 60) × 100 = <strong>75%</strong>.</p>
<p><strong>Mode 3 — Percentage Change.</strong><br/>Formula: Change% = ((New − Old) ÷ Old) × 100. A product going from ₹80 to ₹100: ((100 − 80) ÷ 80) × 100 = <strong>25% increase</strong>.</p>
<p><strong>Mode 4 — Increase by X%.</strong><br/>Formula: New = Original × (1 + X/100). A ₹50,000 salary with 12% hike = 50,000 × 1.12 = <strong>₹56,000</strong>.</p>
<p><strong>Mode 5 — Decrease by X%.</strong><br/>Formula: New = Original × (1 − X/100). ₹80,000 laptop at 15% discount = 80,000 × 0.85 = <strong>₹68,000</strong>.</p>

<div class="explanation__highlight">
<strong>Quick Mental Math:</strong> For 18% GST — think 10% + 5% + 3%. On ₹5,000: ₹500 + ₹250 + ₹150 = <strong>₹900 GST</strong>. Total = ₹5,900.
</div>

<h3>Reverse Percentage Calculations</h3>
<ul>
<li><strong>Original before discount:</strong> Original = Final ÷ (1 − Discount%/100). A jacket at ₹850 after 15% off → 850 ÷ 0.85 = <strong>₹1,000</strong>.</li>
<li><strong>Extract GST from inclusive price:</strong> GST = Total × Rate ÷ (100 + Rate). ₹59,000 with 18% GST → GST = 59,000 × 18/118 = <strong>₹9,000</strong>.</li>
<li><strong>Original before markup:</strong> Original = Final ÷ (1 + Markup%/100). ₹1,200 price with 20% markup → 1,200 ÷ 1.20 = <strong>₹1,000</strong> original cost.</li>
</ul>

<h3>Stacked Discounts — The Common Shopping Trap</h3>
<p>When an offer says "30% off + extra 20% off," shoppers assume 50% total. Wrong — discounts stack sequentially:</p>
<ul>
<li>Original: ₹1,000 → after 30% off: ₹700 → after 20% off ₹700 = ₹560.</li>
<li><strong>Effective discount: 44%, not 50%.</strong></li>
</ul>
<p>Formula: Final = Original × (1 − D1) × (1 − D2). Always verify with a calculator before assuming the advertised savings.</p>

<h3>Percentage Points vs. Percentage Change</h3>
<p>If the RBI repo rate rises from 6% to 6.5%, that is <strong>0.5 percentage points</strong> (absolute arithmetic change). As a percentage change, it is (0.5 ÷ 6) × 100 = <strong>8.33%</strong> relative increase. Headlines saying "inflation rose 2 percentage points" mean the rate moved from, say, 4% to 6% — not that it doubled.</p>

<h3>Real-World Percentage Applications</h3>
<table><thead><tr><th>Scenario</th><th>Formula</th><th>Example</th></tr></thead><tbody>
<tr><td>GST Calculation</td><td>Amount × Rate ÷ 100</td><td>₹10,000 × 18% = ₹1,800</td></tr>
<tr><td>Salary Hike</td><td>Salary × (1 + Hike%/100)</td><td>₹60,000 × 1.10 = ₹66,000</td></tr>
<tr><td>Exam Score</td><td>(Marks ÷ Total) × 100</td><td>540/600 = 90%</td></tr>
<tr><td>Investment Return</td><td>((End − Start) ÷ Start) × 100</td><td>(₹13L − ₹10L) ÷ ₹10L = 30%</td></tr>
<tr><td>EMI-to-Income Ratio</td><td>(EMI ÷ Income) × 100</td><td>₹20K EMI / ₹60K salary = 33.3%</td></tr>
<tr><td>Body Weight Change</td><td>((New − Old) ÷ Old) × 100</td><td>80kg → 72kg = −10%</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>CBSE Class 7–8 Mathematics — Percentage and Ratio chapters</li>
<li>Reserve Bank of India (RBI) — Financial Literacy Program materials</li>
<li>NISM — Investor Education: Percentage-based returns</li>
</ul>`,
        faq: [
            { question: "How do I calculate GST from a total amount?", answer: "To find GST already included in the total, use the reverse GST formula: GST Amount = Total × (Rate ÷ (100 + Rate)). For 18% GST, divide total by 1.18 to get the base price, then subtract to get the GST." },
            { question: "What is percentage change and when do I use it?", answer: "Percentage change = ((New Value − Old Value) ÷ Old Value) × 100. Use it to measure growth in sales, change in price, returns on investment, or variation in any two comparable figures." },
            { question: "How is percentage different from percentage points?", answer: "Percentage points measure absolute differences — if inflation goes from 5% to 6%, that's 1 percentage point. But percentagewise, it's a 20% increase in the inflation rate. The distinction matters in financial and policy reporting." },
        ],
    },
    "compound-interest-calculator": {
        subtitle: "Calculate how your money grows with compound interest. See the total amount, interest earned, and year-by-year growth over time.",
        contentHTML: `<h2>How Compound Interest Works — The Complete Guide</h2>
<p>Compound interest is the single most powerful concept in personal finance. Unlike simple interest — which earns returns only on your original principal — compound interest earns returns on both the principal and all previously accrued interest. This creates an accelerating snowball effect: the longer your money stays invested, the faster it grows.</p>

<h3>The Compound Interest Formula</h3>
<div class="explanation__highlight">
<strong>A = P × (1 + r/n)^(n×t)</strong><br/><br/>
<strong>A</strong> = Final Amount &nbsp;|&nbsp; <strong>P</strong> = Principal &nbsp;|&nbsp; <strong>r</strong> = Annual rate (decimal) &nbsp;|&nbsp; <strong>n</strong> = Compounding periods/year &nbsp;|&nbsp; <strong>t</strong> = Time in years<br/><br/>
<strong>Interest Earned = A − P</strong><br/><br/>
Example: ₹1,00,000 at 12% monthly (n=12) for 10 years → A = 1,00,000 × (1.01)^120 = <strong>₹3,30,039</strong>. Interest earned = ₹2,30,039 — a 230% return on your principal!
</div>

<h3>How Compounding Frequency Impacts Returns (₹1 Lakh at 12% for 10 Years)</h3>
<table><thead><tr><th>Compounding Frequency</th><th>n Value</th><th>Final Amount</th><th>Interest Earned</th></tr></thead><tbody>
<tr><td>Annually</td><td>1</td><td>₹3,10,585</td><td>₹2,10,585</td></tr>
<tr><td>Semi-Annually</td><td>2</td><td>₹3,20,714</td><td>₹2,20,714</td></tr>
<tr><td>Quarterly</td><td>4</td><td>₹3,26,204</td><td>₹2,26,204</td></tr>
<tr><td>Monthly</td><td>12</td><td>₹3,30,039</td><td>₹2,30,039</td></tr>
<tr><td>Daily</td><td>365</td><td>₹3,31,946</td><td>₹2,31,946</td></tr>
</tbody></table>
<p>In India, most Fixed Deposits compound quarterly. The difference between annual and daily compounding on ₹1 Lakh over 10 years is ₹21,000 — significantly more at scale. Equity mutual funds grow via daily NAV appreciation, effectively giving daily compounding.</p>

<h3>The Power of Starting Early — Time Outperforms Capital</h3>
<table><thead><tr><th>Investor</th><th>Start Age</th><th>Monthly SIP</th><th>Total Invested</th><th>Corpus at Age 60 (12% p.a.)</th></tr></thead><tbody>
<tr><td><strong>Arjun (Early Start)</strong></td><td>25</td><td>₹5,000</td><td>₹21 Lakh</td><td><strong>₹1.76 Crore</strong></td></tr>
<tr><td><strong>Priya (10-Yr Delay)</strong></td><td>35</td><td>₹5,000</td><td>₹15 Lakh</td><td><strong>₹52 Lakh</strong></td></tr>
<tr><td><strong>Vikram (Later, More Capital)</strong></td><td>40</td><td>₹10,000</td><td>₹24 Lakh</td><td><strong>₹99 Lakh</strong></td></tr>
</tbody></table>
<p>Arjun invests the least money in rupee terms, yet accumulates the most — 3.4× more than Priya and 1.8× more than Vikram who doubled the monthly amount. A 10-year head start is worth <strong>₹1.24 Crore</strong>. Time is the most powerful input in any compound interest calculation.</p>

<h3>Compound Interest vs. Simple Interest — The Diverging Paths</h3>
<table><thead><tr><th>Time Horizon</th><th>Simple Interest (12%)</th><th>Compound Interest (12% monthly)</th><th>Compounding Advantage</th></tr></thead><tbody>
<tr><td>5 years</td><td>₹1,60,000</td><td>₹1,81,940</td><td>+₹21,940</td></tr>
<tr><td>10 years</td><td>₹2,20,000</td><td>₹3,30,039</td><td>+₹1,10,039</td></tr>
<tr><td>20 years</td><td>₹3,40,000</td><td>₹10,89,255</td><td>+₹7,49,255</td></tr>
<tr><td>30 years</td><td>₹4,60,000</td><td>₹35,94,964</td><td>+₹31,34,964</td></tr>
</tbody></table>
<p><em>Based on ₹1,00,000 initial investment at 12% per year. Simple interest grows linearly (same amount each year); compound interest grows exponentially (accelerating amount each year).</em></p>

<h3>Common Indian Investment Products and Their Compounding</h3>
<ul>
<li><strong>Fixed Deposits (FDs):</strong> Compound quarterly. Current rates 7–8.5% for major banks. Ideal for capital preservation with guaranteed returns over 1–5 year horizons.</li>
<li><strong>PPF (Public Provident Fund):</strong> Compounds annually at 7.1% (2024–25 rate). Fully tax-exempt under the EEE (Exempt-Exempt-Exempt) regime; 15-year lock-in. Real return ~1–1.5% after 6% inflation.</li>
<li><strong>Equity Mutual Funds:</strong> Historical CAGR of 12–15% (Nifty 50 index, 20-year average). Growth through daily NAV increases. Best suited for 7+ year financial goals.</li>
<li><strong>ELSS (Tax-Saver) Funds:</strong> Equity funds with a mandatory 3-year lock-in. Historical returns 12–14%. Provides Section 80C tax deduction on investments up to ₹1.5 Lakh per year.</li>
<li><strong>NPS (National Pension System):</strong> Market-linked with 9–10% historical CAGR. Additional ₹50,000 deduction under Section 80CCD(1B) beyond the standard 80C limit.</li>
</ul>

<h3>The Rule of 72 — Estimate Doubling Time Instantly</h3>
<p>A quick mental shortcut: <strong>Doubling Time ≈ 72 ÷ Annual Rate</strong></p>
<ul>
<li>FD at 7%: 72 ÷ 7 = <strong>~10.3 years</strong> to double your money</li>
<li>Equity fund at 12%: 72 ÷ 12 = <strong>6 years</strong> to double</li>
<li>Savings account at 3.5%: 72 ÷ 3.5 = <strong>~20.6 years</strong> to double</li>
<li>Inflation at 6%: 72 ÷ 6 = <strong>12 years</strong> for prices to double — meaning your idle cash loses half its purchasing power in 12 years</li>
</ul>

<h3>References</h3>
<ul>
<li>SEBI Investor Education — sebi.gov.in/investor-education</li>
<li>Reserve Bank of India Financial Literacy — rbi.org.in</li>
<li>AMFI Mutual Fund Awareness Programme — amfiindia.com</li>
<li>NISM Module 1: Compounding and Time Value of Money</li>
</ul>`,
        faq: [
            { question: "What is the compound interest formula?", answer: "A = P × (1 + r/n)^(n×t) where P = principal, r = annual interest rate (as decimal), n = compounding frequency per year, t = time in years. Subtract P from A to get the interest earned." },
            { question: "Which compounding frequency is best?", answer: "More frequent compounding means slightly higher returns. Monthly compounding gives more than annual, and daily gives more than monthly. For most FDs and savings accounts in India, interest compounds quarterly." },
            { question: "Is compound interest always better than simple interest?", answer: "Yes, for the investor. Compound interest grows your wealth faster over time. However, as a borrower, compound interest on loans means your debt grows faster — which is why credit card debt can spiral if unpaid." },
        ],
    },
    "simple-interest-calculator": {
        subtitle: "Calculate simple interest on any principal amount with a fixed rate and time period. Useful for short-term loans and deposits.",
        explanation: {
            heading: "What is Simple Interest and When Does It Apply?",
            paragraphs: [
                "Simple interest is calculated only on the original principal amount — not on any accumulated interest. The formula is straightforward: SI = (Principal × Rate × Time) ÷ 100. It is used in certain short-term loans, personal loans, vehicle loans, and savings certificates.",
                "In India, simple interest is commonly used for calculating returns on some postal saving schemes, short-term fixed deposits, and personal ad-hoc loans. It is the baseline calculation used in many financial literacy programs because its linear growth makes it easy to understand and verify.",
            ],
            highlight: "Quick example: ₹50,000 at 10% simple interest for 3 years = (50,000 × 10 × 3) ÷ 100 = ₹15,000 interest. Total return = ₹65,000.",
        },
        faq: [
            { question: "What is the difference between simple and compound interest?", answer: "Simple interest is calculated only on the principal. Compound interest adds the earned interest back to the principal and compounds over time. For the same rate and period, compound interest always yields a higher total." },
            { question: "When is simple interest used in real life?", answer: "Simple interest is common in short-term personal loans, auto loans (some), certain government schemes, and informal lending. Most modern savings products now use compound interest to attract investors." },
            { question: "How do I convert simple interest rate to effective annual rate?", answer: "Simple interest rate does not compound, so it is equal to the nominal rate. For a direct comparison with compound interest investments, use online XIRR or effective annual rate calculators." },
        ],
    },
    "discount-calculator": {
        subtitle: "Find the final price after discount. Enter the original price and discount percentage to instantly calculate your savings.",
        explanation: {
            heading: "How to Calculate Discounts",
            paragraphs: [
                "Discount calculators help you quickly find out how much you save and what the final price will be after a percentage-off offer. The formula is: Discount Amount = (Original Price × Discount %) ÷ 100. Final Price = Original Price − Discount Amount.",
                "Discounts are everywhere — on e-commerce platforms during sale seasons, retail stores during festivals, and in bulk purchases. Understanding how discounts compound (e.g., a 20% off + extra 10% off) is especially useful, as these are usually applied sequentially, not on the original price together.",
            ],
            highlight: "Stacked discounts trap: '20% off + 10% additional off' on ₹1,000 sounds like 30% off but actually gives only 28% savings. The second discount applies on the already-reduced price of ₹800, not the original ₹1,000.",
        },
        faq: [
            { question: "How do I calculate the original price from discounted price?", answer: "Use: Original Price = Discounted Price ÷ (1 - Discount%). For example, if final price is ₹720 and discount was 20%, original = 720 ÷ 0.80 = ₹900." },
            { question: "What is a 'flat' discount vs percentage discount?", answer: "A flat discount reduces the price by a fixed amount (e.g., ₹500 off). A percentage discount (e.g., 15% off) reduces the price proportionally — saving more on expensive items than cheaper ones." },
            { question: "How are GST and discounts applied together?", answer: "GST in India is calculated on the post-discount price, not the original price. So if you get a ₹500 discount on a ₹5,000 item, GST applies to ₹4,500, reducing your total tax burden." },
        ],
    },
    "interest-rate-calculator": {
        subtitle: "Find the exact interest rate (CAGR) needed to grow your money from an initial amount to a target amount over a set period.",
        explanation: {
            heading: "What is the Required Rate of Return (CAGR) Calculator?",
            paragraphs: [
                "This calculator works in reverse: instead of telling you how much money you'll have, it tells you what annual growth rate (CAGR) you need to reach a financial goal. If you have ₹2 lakhs today and want ₹10 lakhs in 10 years, what interest rate do you need? This tool answers exactly that.",
                "The calculation uses the CAGR formula backwards: Required Rate = (Target ÷ Principal)^(1/Years) − 1. Once you know the required rate, you can evaluate whether it's achievable with real-world investments. A 12% required CAGR is reasonable for equity mutual funds. A 25% required CAGR is very risky and unlikely to be consistently delivered.",
            ],
            highlight: "Reality check: If you need a 20%+ CAGR to meet your goal, you either need more time, more starting capital, or a lower target. No mainstream, regulated investment in India consistently delivers over 18% CAGR over a decade.",
        },
        faq: [
            { question: "What is CAGR and how is it calculated?", answer: "CAGR stands for Compound Annual Growth Rate. It is the steady rate at which an investment would have grown if it grew at a stable rate every year. Formula: CAGR = (End Value / Start Value)^(1/Years) − 1, multiplied by 100 for percentage." },
            { question: "How is CAGR different from absolute return?", answer: "Absolute return ignores time. A 50% return sounds great, but 50% over 10 years is only ~4.1% CAGR — below inflation. CAGR normalizes returns to a per-year basis, making different investments comparable regardless of time period." },
            { question: "What if my required CAGR is unrealistic?", answer: "If your required rate exceeds 15%, consider: (a) extending your time horizon, (b) investing a higher initial amount, (c) reducing your target amount, or (d) combining investment types — equity for growth plus debt for stability." },
        ],
    },
    "rule-of-72-calculator": {
        subtitle: "Use the Rule of 72 to find out how many years it will take your money to double at a given interest rate — no spreadsheet needed.",
        contentHTML: `
            <h3>What is the Rule of 72?</h3>
            <p>The <strong>Rule of 72</strong> is a simple mental math shortcut used in personal finance and investment planning to estimate how long it will take for your money to double. You divide 72 by your expected annual interest rate, and the result gives you the approximate number of years needed to double your investment.</p>
            <p>For example, if your Fixed Deposit earns 8% per year, dividing 72 by 8 gives you 9 years. That means your ₹1 lakh will become ₹2 lakhs in roughly 9 years — without any complex calculation or spreadsheet.</p>

            <h3>Why Is the Rule of 72 Useful?</h3>
            <p>Most people struggle to visualize how compounding works over time. The Rule of 72 makes this tangible and instantly comparable. It helps you:</p>
            <ul>
                <li><strong>Compare investment options side-by-side</strong> — Is an FD at 7% better than a debt mutual fund at 9% for your 10-year goal?</li>
                <li><strong>Understand the real cost of low returns</strong> — A savings account at 3.5% takes nearly 21 years to double your money. Is that acceptable for your goal?</li>
                <li><strong>See the impact of small rate changes</strong> — Moving from 6% to 9% cuts your doubling time from 12 years to just 8 years. Four fewer years of waiting is significant when building wealth.</li>
                <li><strong>Make faster financial decisions</strong> — No calculator needed. Just divide 72 by the rate and you have an instant answer.</li>
            </ul>

            <h3>Rule of 72 Applied to Common Indian Investments</h3>
            <p>Here's how the Rule of 72 works across popular investment options available to Indian investors:</p>
            <ul>
                <li><strong>Savings Account (3.5%):</strong> Takes about 20.6 years to double your money</li>
                <li><strong>Fixed Deposit (7%):</strong> Doubles in approximately 10.3 years</li>
                <li><strong>PPF (7.1%):</strong> Doubles in roughly 10.1 years</li>
                <li><strong>Balanced / Hybrid Mutual Funds (11%):</strong> Doubles in about 6.5 years</li>
                <li><strong>Diversified Equity / Nifty 50 Index Funds (13%):</strong> Can double in approximately 5.5 years</li>
                <li><strong>Small Cap Stocks (historical 16-18%):</strong> Potentially doubles in 4 to 4.5 years (but with high risk)</li>
            </ul>

            <div class="explanation__highlight">
                <strong>Use it to measure inflation damage too:</strong> If India's inflation rate is 6%, the purchasing power of ₹1 lakh sitting idle in a zero-interest account gets cut in half in just 12 years. That's why staying ahead of inflation isn't optional — it's essential for every rupee you save.
            </div>

            <h3>The Formula and How to Apply It</h3>
            <p>The formula is: <strong>Doubling Time (Years) = 72 ÷ Annual Interest Rate (%)</strong></p>
            <p>The Rule of 72 works best for interest rates between 5% and 15%, which covers the vast majority of everyday investment decisions. It assumes annual compounding. If your investment compounds monthly (like most bank savings accounts), the actual doubling time will be slightly shorter than what the Rule of 72 predicts.</p>

            <h3>When Should You Use the Rule of 72 Calculator?</h3>
            <ul>
                <li>To quickly compare how fast two different investments will grow your money</li>
                <li>To set a realistic timeline for financial goals like buying a house, funding education, or retiring early</li>
                <li>To explain compounding to family members or children in a simple, relatable way</li>
                <li>To evaluate whether an investment promising unusually high returns is realistic or a red flag</li>
            </ul>

            <h3>Limitations of the Rule of 72</h3>
            <p>The Rule of 72 gives you a quick estimate, not an exact answer. Here's what it cannot account for:</p>
            <ul>
                <li>It assumes a constant, fixed annual rate — equity markets do not compound linearly year to year.</li>
                <li>It ignores taxes. A 12% equity return taxed at 10% LTCG becomes approximately 10.8% net, which changes your doubling timeline meaningfully.</li>
                <li>It does not factor in additional contributions (SIPs), withdrawals, or regular deposits — those require a proper compound interest or SIP calculator.</li>
            </ul>

            <h3>Frequently Asked Questions — Rule of 72</h3>
            <p><strong>Q: Is the Rule of 72 accurate?</strong><br/>A: It is an approximation, accurate to within one year for rates between 5% and 15%. For exact calculations, use our compound interest calculator.</p>
            <p><strong>Q: Can I use the Rule of 72 for inflation?</strong><br/>A: Yes. Divide 72 by the inflation rate to find how many years it takes for prices to double (or for your idle money's purchasing power to halve).</p>
            <p><strong>Q: What about the Rule of 69 or Rule of 70?</strong><br/>A: Rule of 69 is slightly more accurate for continuously compounding assets. Rule of 70 works well for estimates too. Rule of 72 is the most widely used because 72 divides evenly by more common interest rates (2, 3, 4, 6, 8, 9, 12, etc.).</p>
        `
    },
    "inflation-adjusted-return-calculator": {
        subtitle: "Find out how much your investment actually earned after adjusting for inflation. Real returns reveal the truth about your wealth growth.",
        contentHTML: `
            <h3>What is an Inflation Adjusted Return?</h3>
            <p>An <strong>inflation adjusted return</strong> — also called a <strong>real return</strong> — is the actual increase in your purchasing power after accounting for rising prices. It tells you whether your investment made you genuinely wealthier, or just kept you running in place against inflation.</p>
            <p>Here's a simple way to think about it: If your Fixed Deposit earned 7% this year and inflation was 6%, your nominal return is 7%. But your <em>real return</em> — the actual improvement in what you can buy — is approximately just 1%. You earned something, but not as much as the 7% figure suggests.</p>

            <h3>Why Nominal Returns Can Be Misleading</h3>
            <p>Banks, fund houses, product brochures, and most advertisements quote <em>nominal returns</em>. That's the raw percentage before inflation eats into your gains. But for long-term financial planning, nominal returns alone are dangerously incomplete.</p>
            <p>Consider this common scenario: A 5-year endowment insurance plan advertises 6% returns. If India's average CPI inflation over that period is 6%, your real return is essentially <strong>zero</strong>. You preserved your money, but you didn't grow it. Your purchasing power at the end of 5 years is the same as when you started.</p>
            <ul>
                <li><strong>Fixed Deposit at 7%</strong> with 6% inflation → Real return is only ~0.9%</li>
                <li><strong>PPF at 7.1%</strong> with 6% inflation → Real return is approximately 1.0%</li>
                <li><strong>Equity Mutual Fund at 13%</strong> with 6% inflation → Real return is a healthy ~6.6%</li>
                <li><strong>Savings Account at 3.5%</strong> with 6% inflation → Real return is <strong>−2.4%</strong> — you're losing wealth every year</li>
            </ul>

            <div class="explanation__highlight">
                <strong>The golden rule of wealth building:</strong> Any investment earning less than the prevailing inflation rate is destroying your wealth in real terms, even if your nominal balance grows. For long-term goals, target investments that beat inflation by at least 2–3% after accounting for taxes.
            </div>

            <h3>How is Inflation Adjusted Return Calculated?</h3>
            <p>Our calculator uses the precise <strong>Fisher Equation</strong>, which is the global standard in economics for computing real returns:</p>
            <p><strong>Real Return = [(1 + Nominal Return) ÷ (1 + Inflation Rate)] − 1</strong></p>
            <p>Many quick tools simply subtract inflation from the nominal return (e.g., 7% − 6% = 1%), but this is only a rough estimate. The Fisher Equation is more accurate — especially over 10 to 30-year investment horizons where compound effects stack significantly. For short time periods, the difference is minimal; for long periods, it matters a great deal for accurate retirement planning.</p>

            <h3>When Should You Use This Calculator?</h3>
            <p>This calculator is particularly valuable when you want to:</p>
            <ul>
                <li><strong>Evaluate fixed-income investments honestly:</strong> FDs, PPF, NSC, Sovereign Gold Bonds, and RDs have predictable returns. Use this tool to compare their real value against inflation.</li>
                <li><strong>Stress-test your retirement plan:</strong> In retirement, you need income that keeps up with or beats inflation. If your corpus returns don't exceed inflation, your annual withdrawals will slowly erode your standard of living.</li>
                <li><strong>Compare investment strategies over time:</strong> Which gave you more real wealth — a 10-year SIP in a large-cap equity fund at 13%, or a series of rolling FDs at 7%? This calculator answers that with precision.</li>
                <li><strong>Evaluate past investment performance:</strong> Look back at any investment and compute how much real wealth it created, factoring in the actual inflation experienced over that time period.</li>
            </ul>

            <h3>What Real Return Should You Target?</h3>
            <p>Financial planners in India typically recommend targeting a real return of at least 3% to 5% per year for long-term wealth creation. Here's the context behind that benchmark:</p>
            <ul>
                <li>A 3% real return means your money is genuinely growing — your purchasing power expands year on year, not just your account balance.</li>
                <li>Over 25 years, a 3% real return doubles your purchasing power. A 5% real return nearly triples it.</li>
                <li>To consistently beat consumption inflation by 3% in India, most financial advisors recommend maintaining at least 60–70% of long-term savings in equity-linked instruments for goals 10 or more years away.</li>
                <li>For near-term goals (1–3 years), capital protection matters more than beating inflation — use Liquid Funds or Short-Term FDs.</li>
            </ul>
            <p>Use this calculator regularly to audit your portfolio. If your real return is under 2%, it's time to review your asset allocation and ensure your money is working as hard as it can for your future.</p>

            <h3>Frequently Asked Questions — Inflation Adjusted Return</h3>
            <p><strong>Q: Is inflation adjustment needed for short-term investments?</strong><br/>A: For goals under 2 years, inflation adjustment has minimal impact. It becomes critically important for goals 5+ years away, where even small inflation-return gaps compound into large shortfalls.</p>
            <p><strong>Q: Should I use CPI or WPI inflation for this calculation?</strong><br/>A: Use CPI (Consumer Price Index) — it reflects the actual rise in prices for goods and services that households consume. WPI tracks wholesale prices and is less relevant for personal financial planning.</p>
            <p><strong>Q: My FD is earning more than inflation right now. Am I safe?</strong><br/>A: Today's FD rates are unusually elevated due to RBI rate hikes. Historically, FD rates have trailed inflation by 1–2% in real terms. Always plan for a 15+ year average scenario, not just current rates.</p>
        `
    },
    "inflation-calculator": {
        subtitle: "Calculate how inflation has changed the value of the U.S. dollar from 1913 to 2025 using official CPI data. Project future purchasing power, compare past values, and find what your salary should be today.",
        contentHTML: `
            <h2>What Is Inflation?</h2>
            <p><strong>Inflation</strong> is the sustained increase in the general price level of goods and services in an economy over time. When inflation rises, every dollar you hold buys less than it did before — this erosion of value is called a <strong>decline in purchasing power</strong>. The U.S. Federal Reserve targets an annual inflation rate of approximately <strong>2%</strong>, believing moderate inflation is necessary for a healthy, growing economy. When prices rise too fast (high inflation) or fall (deflation), it signals economic instability.</p>
            <p>The most common measure of inflation in the United States is the <strong>Consumer Price Index (CPI)</strong>, published monthly by the <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer">Bureau of Labor Statistics (BLS)</a>. The CPI tracks the average change in prices paid by urban consumers for a representative basket of goods and services, including food, housing, transportation, medical care, apparel, recreation, and education.</p>
            <p>Our Inflation Calculator uses the <strong>CPI-U (Consumer Price Index for All Urban Consumers)</strong> annual average data from 1913 to 2025 to give you the most accurate purchasing power comparison across any two years in modern U.S. history.</p>

            <h2>Types of Inflation</h2>
            <p>Economists classify inflation by its root cause. Understanding these types helps explain why prices rise and how policymakers respond:</p>
            <ul>
                <li><strong>Demand-Pull Inflation</strong> — Occurs when aggregate demand for goods and services exceeds aggregate supply. When consumers, businesses, and the government are all spending heavily, prices get bid up. The post-pandemic spending surge in 2021–2022 is a recent U.S. example where stimulus checks, pent-up demand, and low interest rates combined to push inflation to 40-year highs.</li>
                <li><strong>Cost-Push Inflation</strong> — Happens when the cost of producing goods rises, forcing businesses to pass those costs on to consumers. Oil price shocks, supply chain disruptions, and rising wages can all trigger cost-push inflation. The 1970s oil crisis is the textbook U.S. example, when OPEC embargoes sent gasoline and energy prices soaring.</li>
                <li><strong>Built-In Inflation (Wage-Price Spiral)</strong> — When workers expect rising prices, they demand higher wages. Businesses then raise prices to cover higher labor costs, which in turn fuels more wage demands. This self-reinforcing cycle can be very difficult to break once it takes hold.</li>
                <li><strong>Monetary Inflation</strong> — The Monetarist view, championed by Milton Friedman, holds that "inflation is always and everywhere a monetary phenomenon." When the Federal Reserve increases the money supply faster than the economy grows, more dollars chase the same goods, pushing prices up. The Fed's massive quantitative easing programs after 2008 and 2020 are modern examples.</li>
            </ul>

            <h2>How Is Inflation Measured in the United States?</h2>
            <p>The U.S. uses several price indices to measure inflation. Each serves a different purpose:</p>
            <table>
                <thead>
                    <tr><th>Index</th><th>Full Name</th><th>Used For</th><th>Key Characteristic</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>CPI-U</strong></td><td>CPI for All Urban Consumers</td><td>General inflation reporting, media headlines</td><td>Covers ~93% of U.S. population. Most widely cited inflation measure.</td></tr>
                    <tr><td><strong>CPI-W</strong></td><td>CPI for Urban Wage Earners</td><td>Social Security COLA calculation</td><td>Covers ~29% of population (hourly workers). Used for SS benefits since 1975.</td></tr>
                    <tr><td><strong>C-CPI-U</strong></td><td>Chained CPI for All Urban Consumers</td><td>IRS tax bracket indexation (since 2018)</td><td>Accounts for consumer substitution. Grows ~0.2–0.3% slower than CPI-U per year.</td></tr>
                    <tr><td><strong>Core CPI</strong></td><td>CPI Less Food and Energy</td><td>Fed policy analysis</td><td>Excludes volatile food and energy prices for a clearer inflation trend.</td></tr>
                    <tr><td><strong>PCE</strong></td><td>Personal Consumption Expenditures Price Index</td><td>Federal Reserve's preferred inflation gauge</td><td>Broader coverage than CPI—includes employer-paid healthcare. Accounts for substitution effects.</td></tr>
                    <tr><td><strong>PPI</strong></td><td>Producer Price Index</td><td>Wholesale/producer price tracking</td><td>Measures prices from the seller's perspective. Rising PPI often foreshadows rising CPI.</td></tr>
                </tbody>
            </table>
            <p>Our calculator uses <strong>CPI-U</strong> because it is the most widely referenced and covers the broadest segment of the U.S. population. The Federal Reserve, however, prefers the <strong>PCE index</strong> for setting monetary policy because it has broader coverage and naturally accounts for consumers switching between products when prices change.</p>

            <h2>U.S. Inflation by Decade</h2>
            <p>Inflation in the United States has varied dramatically over the past century. Here is a decade-by-decade summary:</p>
            <table>
                <thead>
                    <tr><th>Decade</th><th>Avg Annual Inflation</th><th>Key Events</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>1920s</strong></td><td>~-1.1%</td><td>Post-WWI deflation, Roaring Twenties economic boom</td></tr>
                    <tr><td><strong>1930s</strong></td><td>~-2.0%</td><td>Great Depression brought severe deflation</td></tr>
                    <tr><td><strong>1940s</strong></td><td>~5.6%</td><td>WWII wartime spending and post-war demand surge</td></tr>
                    <tr><td><strong>1950s</strong></td><td>~2.2%</td><td>Korean War spike, then stable growth</td></tr>
                    <tr><td><strong>1960s</strong></td><td>~2.5%</td><td>Vietnam War spending, "guns and butter" fiscal policy</td></tr>
                    <tr><td><strong>1970s</strong></td><td>~7.4%</td><td>Oil crises (1973, 1979), wage-price spirals, stagflation</td></tr>
                    <tr><td><strong>1980s</strong></td><td>~5.1%</td><td>Volcker shock (Fed rate hikes to 20%), inflation tamed by mid-decade</td></tr>
                    <tr><td><strong>1990s</strong></td><td>~2.9%</td><td>Great Moderation, tech boom, globalization kept prices stable</td></tr>
                    <tr><td><strong>2000s</strong></td><td>~2.6%</td><td>Housing bubble, 2008 financial crisis, near-deflation in 2009</td></tr>
                    <tr><td><strong>2010s</strong></td><td>~1.8%</td><td>Slow recovery, persistently below-target inflation, near-zero interest rates</td></tr>
                    <tr><td><strong>2020s</strong></td><td>~5.0%*</td><td>COVID supply shocks, stimulus spending, 2022 peak at 9.1% (June), aggressive Fed rate hikes</td></tr>
                </tbody>
            </table>
            <p><em>*2020s average through 2025. The June 2022 CPI reading of 9.1% year-over-year was the highest since November 1981.</em></p>

            <h2>How Inflation Affects Your Daily Life</h2>
            <p>Inflation isn't just an abstract economic concept — it directly impacts what Americans pay for everything from groceries to college tuition. Here's how the prices of common items have changed over the decades:</p>
            <table>
                <thead>
                    <tr><th>Item</th><th>1970</th><th>1990</th><th>2000</th><th>2010</th><th>2025</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>Gallon of Gas</strong></td><td>$0.36</td><td>$1.16</td><td>$1.51</td><td>$2.79</td><td>$3.40</td></tr>
                    <tr><td><strong>Gallon of Milk</strong></td><td>$1.15</td><td>$2.15</td><td>$2.79</td><td>$3.32</td><td>$4.20</td></tr>
                    <tr><td><strong>Loaf of Bread</strong></td><td>$0.25</td><td>$0.70</td><td>$0.99</td><td>$1.37</td><td>$2.00</td></tr>
                    <tr><td><strong>Postage Stamp</strong></td><td>$0.06</td><td>$0.25</td><td>$0.33</td><td>$0.44</td><td>$0.73</td></tr>
                    <tr><td><strong>Movie Ticket</strong></td><td>$1.55</td><td>$4.23</td><td>$5.39</td><td>$7.89</td><td>$11.00</td></tr>
                    <tr><td><strong>Median Home Price</strong></td><td>$23,400</td><td>$79,100</td><td>$119,600</td><td>$221,800</td><td>$420,000</td></tr>
                    <tr><td><strong>Avg College Tuition (4-yr public)</strong></td><td>$1,207</td><td>$3,349</td><td>$4,845</td><td>$8,244</td><td>$11,600</td></tr>
                    <tr><td><strong>Federal Minimum Wage</strong></td><td>$1.60</td><td>$3.80</td><td>$5.15</td><td>$7.25</td><td>$7.25</td></tr>
                </tbody>
            </table>
            <p>Notice that the federal minimum wage has been frozen at $7.25/hour since 2009 — the longest period without an increase in U.S. history. Meanwhile, the cost of essential goods has continued to rise, effectively reducing the real purchasing power of minimum-wage workers by over 30% since 2009.</p>

            <h2>Social Security and Inflation (COLA)</h2>
            <p>Social Security benefits are adjusted annually through the <strong>Cost-of-Living Adjustment (COLA)</strong>, which is tied to the CPI-W index. The Social Security Administration compares the average CPI-W for July through September of the current year to the same period in the prior year. If prices have risen, benefits are increased by that percentage the following January.</p>
            <table>
                <thead>
                    <tr><th>Year</th><th>COLA %</th><th>Impact on Avg Monthly Benefit</th></tr>
                </thead>
                <tbody>
                    <tr><td>2025</td><td>2.5%</td><td>+$48/month</td></tr>
                    <tr><td>2024</td><td>3.2%</td><td>+$59/month</td></tr>
                    <tr><td>2023</td><td>8.7%</td><td>+$146/month (highest since 1981)</td></tr>
                    <tr><td>2022</td><td>5.9%</td><td>+$92/month</td></tr>
                    <tr><td>2021</td><td>1.3%</td><td>+$20/month</td></tr>
                    <tr><td>2020</td><td>1.6%</td><td>+$24/month</td></tr>
                    <tr><td>2019</td><td>2.8%</td><td>+$39/month</td></tr>
                </tbody>
            </table>
            <p>The record-high 8.7% COLA in 2023 was a direct response to the inflation spike of 2022. While large adjustments help, critics argue that the CPI-W underweights healthcare costs, which disproportionately affect retirees.</p>

            <h2>How to Protect Your Money from Inflation</h2>
            <p>No single investment perfectly hedges against inflation, but several strategies can help preserve or grow your purchasing power:</p>
            <table>
                <thead>
                    <tr><th>Strategy</th><th>How It Works</th><th>Inflation Protection</th><th>Risk Level</th></tr>
                </thead>
                <tbody>
                    <tr><td><strong>TIPS</strong></td><td>Treasury Inflation-Protected Securities — principal adjusts with CPI</td><td>Direct (indexed to CPI-U)</td><td>Very Low</td></tr>
                    <tr><td><strong>I-Bonds</strong></td><td>Series I Savings Bonds — rate = fixed rate + inflation rate (CPI-U semiannual)</td><td>Direct (indexed to CPI-U)</td><td>Very Low</td></tr>
                    <tr><td><strong>Stocks (S&P 500)</strong></td><td>Historically return 10% annually, well above inflation</td><td>Indirect (earnings growth outpaces prices)</td><td>High</td></tr>
                    <tr><td><strong>Real Estate</strong></td><td>Property values and rents tend to rise with inflation</td><td>Moderate-High</td><td>Medium-High</td></tr>
                    <tr><td><strong>Commodities</strong></td><td>Gold, silver, oil — tangible assets that often rise during inflationary periods</td><td>Moderate (cyclical)</td><td>High</td></tr>
                    <tr><td><strong>High-Yield Savings</strong></td><td>Online savings accounts with 4–5% APY (2024–2025)</td><td>Partial (keeps pace but rarely beats)</td><td>Very Low</td></tr>
                </tbody>
            </table>
            <p><strong>TIPS</strong> are U.S. Treasury bonds whose principal adjusts daily based on CPI changes. If inflation is 3%, a $1,000 TIPS bond's principal becomes $1,030. Interest is paid on the adjusted principal, so your payments also increase. TIPS come in 5, 10, and 30-year maturities and can be purchased directly from <a href="https://www.treasurydirect.gov" target="_blank" rel="noopener noreferrer">TreasuryDirect.gov</a>.</p>
            <p><strong>I-Bonds</strong> combine a fixed rate (set when you buy) with an inflation rate (adjusted every 6 months based on CPI-U). You can purchase up to $10,000 in I-Bonds per person per year electronically. They must be held for at least 1 year, and cashing out before 5 years forfeits 3 months of interest. I-Bonds are ideal for emergency savings and short-to-medium-term inflation protection.</p>

            <h2>How the Inflation Calculator Works</h2>
            <p>Our CPI-based inflation calculator uses the following formula to determine the equivalent purchasing power of a dollar amount across different years:</p>
            <div class="explanation__highlight">
                <strong>Equivalent Value = Original Amount × (CPI in Target Year ÷ CPI in Original Year)</strong>
            </div>
            <p>For example, to find out what $100 in 1990 would be worth in 2025:</p>
            <ul>
                <li>CPI-U Annual Average for 1990: <strong>130.7</strong></li>
                <li>CPI-U Annual Average for 2025: <strong>320.8</strong></li>
                <li>Equivalent Value = $100 × (320.8 ÷ 130.7) = <strong>$245.37</strong></li>
                <li>Cumulative Inflation = ((320.8 − 130.7) ÷ 130.7) × 100 = <strong>145.37%</strong></li>
            </ul>
            <p>This means $100 in 1990 has the same purchasing power as approximately $245.37 in 2025 — prices have more than doubled over those 35 years.</p>
            <p>The <strong>Forward Flat Rate</strong> and <strong>Backward Flat Rate</strong> modes use a simpler flat-rate compound formula for theoretical projections:</p>
            <ul>
                <li><strong>Forward:</strong> Future Value = Amount × (1 + Rate)^Years</li>
                <li><strong>Backward:</strong> Past Value = Amount ÷ (1 + Rate)^Years</li>
            </ul>
            <p>The historical U.S. average inflation rate hovers around <strong>3.2% per year</strong> since 1913, making 3% a commonly used assumption for forward and backward projections.</p>

            <h2>Problems with Measuring Inflation</h2>
            <p>While the CPI is the most widely used inflation measure, it has well-documented limitations:</p>
            <ul>
                <li><strong>Quality Adjustment Bias</strong> — When a product improves in quality (a computer becomes faster, a car becomes safer), the BLS adjusts the price to account for the quality improvement. Critics argue this can understate true inflation because consumers still pay the higher price.</li>
                <li><strong>Substitution Bias</strong> — When the price of beef rises, consumers may switch to chicken. The standard CPI-U uses a fixed basket, which can overstate inflation if consumers are substituting. The Chained CPI (C-CPI-U) addresses this but gives lower results.</li>
                <li><strong>Housing Measurement</strong> — The CPI uses "owners' equivalent rent" to measure housing costs, not actual home prices. During the 2020–2022 housing boom, home prices surged 40%+ while the CPI's shelter component lagged significantly behind.</li>
                <li><strong>Demographic Differences</strong> — Inflation affects people differently. Retirees spend more on healthcare (which inflates faster), while young families spend more on childcare and education. The experimental CPI-E (for the elderly) consistently shows higher inflation than the standard CPI-U.</li>
            </ul>

            <h2>Hyperinflation and Deflation</h2>
            <p><strong>Hyperinflation</strong> is extreme, out-of-control price increases — typically exceeding 50% per month. The most extreme case in modern history was Zimbabwe in 2008, where prices doubled every 24 hours. Germany's Weimar Republic experienced hyperinflation in the 1920s when the government printed money to pay war reparations, making the currency essentially worthless. The United States has never experienced hyperinflation, though the 1970s stagflation period (high inflation + high unemployment + low growth) was the closest the country has come to an inflationary crisis since WWII.</p>
            <p><strong>Deflation</strong> — a sustained decrease in the general price level — is often more dangerous than inflation. When prices fall, consumers delay purchases (expecting even lower prices), businesses cut production and jobs, and a vicious cycle of falling demand and falling prices takes hold. The Great Depression of the 1930s saw sustained deflation, with prices falling nearly 25% from 1929 to 1933. The U.S. briefly experienced deflation in 2009 during the Great Recession.</p>

            <h2>How the Federal Reserve Controls Inflation</h2>
            <p>The Federal Reserve uses several tools to manage inflation and keep it near its 2% target:</p>
            <ul>
                <li><strong>Federal Funds Rate</strong> — The Fed's primary tool. By raising the overnight lending rate between banks, borrowing becomes more expensive, which slows spending and investment, reducing inflationary pressure. In 2022–2023, the Fed raised rates from 0% to 5.25–5.50% — the fastest tightening cycle in decades — to combat 9.1% inflation.</li>
                <li><strong>Open Market Operations</strong> — The Fed buys or sells Treasury securities. Buying bonds injects money into the economy (stimulating growth but potentially increasing inflation); selling bonds removes money (cooling the economy).</li>
                <li><strong>Quantitative Easing/Tightening</strong> — Large-scale asset purchases expand the money supply. The Fed bought trillions in bonds after 2008 and 2020. Quantitative tightening (letting bonds mature without replacement) reduces the money supply.</li>
                <li><strong>Forward Guidance</strong> — The Fed communicates its future policy intentions to shape market expectations. If markets believe inflation will be controlled, it becomes a self-fulfilling prophecy.</li>
            </ul>
        `,
        faq: [
            { question: "What is the current US inflation rate?", answer: "As of early 2025, the annual U.S. inflation rate (CPI-U, 12-month) is approximately 2.8–3.0%. This is down significantly from the peak of 9.1% in June 2022, the highest since 1981. The Federal Reserve targets a long-run inflation rate of 2%, so current levels remain slightly above target." },
            { question: "How does the CPI measure inflation?", answer: "The Bureau of Labor Statistics (BLS) tracks the prices of approximately 80,000 items across 23,000 retail and service establishments in 75 urban areas nationwide. These items form a representative 'basket' of goods and services — including food, housing, transportation, medical care, apparel, recreation, and education. The CPI measures the average change in these prices over time." },
            { question: "What is the difference between CPI and PCE?", answer: "The CPI (Consumer Price Index) and PCE (Personal Consumption Expenditures Price Index) both measure inflation but differ in scope and methodology. CPI uses a fixed basket of goods; PCE uses a flexible basket that adjusts for consumer substitution. PCE also includes employer-paid healthcare and has broader coverage. The Federal Reserve prefers PCE because it better reflects actual consumer spending patterns. PCE typically runs 0.3–0.5 percentage points lower than CPI." },
            { question: "How does inflation affect purchasing power?", answer: "Inflation erodes purchasing power — the real value of your money. At 3% annual inflation, $100 today will only buy about $74 worth of goods in 10 years and about $55 worth in 20 years. This is why simply holding cash or keeping money in low-yield savings accounts causes a steady loss of real wealth. Investments must earn returns above the inflation rate to preserve purchasing power." },
            { question: "What was the highest inflation rate in US history?", answer: "The highest annual CPI inflation rate in modern U.S. history was approximately 18% in 1918 (during WWI). In the post-WWII era, the peak was 13.5% in 1980 during the oil crisis and stagflation period. More recently, the CPI-U hit 9.1% year-over-year in June 2022 — the highest reading since November 1981 — driven by pandemic-era supply chain disruptions and massive fiscal stimulus." },
            { question: "How does the Federal Reserve control inflation?", answer: "The Federal Reserve's primary tool is the federal funds rate — the overnight lending rate between banks. By raising this rate, the Fed makes borrowing more expensive, which slows consumer spending and business investment, reducing demand-driven inflation. The Fed also uses open market operations (buying/selling Treasury securities), quantitative easing or tightening, and forward guidance to influence inflation expectations and economic activity." },
            { question: "What are TIPS (Treasury Inflation-Protected Securities)?", answer: "TIPS are U.S. Treasury bonds whose principal value adjusts daily based on changes in the Consumer Price Index (CPI-U). If inflation rises 3%, a $1,000 TIPS bond's principal becomes $1,030, and interest is calculated on the higher amount. At maturity, you receive the greater of the adjusted principal or original face value, providing deflation protection. TIPS come in 5, 10, and 30-year maturities and can be purchased through TreasuryDirect.gov or via TIPS mutual funds and ETFs." },
            { question: "How does inflation affect Social Security benefits?", answer: "Social Security benefits receive an annual Cost-of-Living Adjustment (COLA) based on the CPI-W index. The Social Security Administration compares average CPI-W readings from July–September of the current year to the same period in the prior year. If prices increased, benefits rise by that percentage the following January. For example, the 8.7% COLA in 2023 (the largest since 1981) added approximately $146/month to the average benefit." },
            { question: "What investments beat inflation in the US?", answer: "Historically, U.S. equities (S&P 500) have returned approximately 10% annually — well above the ~3.2% long-run average inflation rate, yielding a real return of about 7%. TIPS and I-Bonds provide direct inflation protection. Real estate, through both property appreciation and rising rents, has also been an effective long-term inflation hedge. Commodities like gold tend to outperform during inflationary spikes but are more volatile. A diversified portfolio is the best approach." },
            { question: "How is core inflation different from headline inflation?", answer: "Core inflation excludes volatile food and energy prices from the CPI calculation, providing a clearer view of underlying price trends. Headline inflation includes everything. The Federal Reserve focuses on core measures because food and energy prices can swing dramatically due to weather, geopolitical events, or seasonal factors, creating noise that obscures the true inflation trend. When core inflation is stable but headline inflation spikes, the Fed may consider the spike temporary." },
        ],
    },
};

export default async function UtilityCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const allCalcs = getCalculatorsByCategory("utility");
    const calc = allCalcs.find((c) => c.slug === calculator);
    if (!calc) notFound();

    const hub = HUB_CONTENT[calc.slug];
    if (!hub) notFound();

    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Utility Calculators", url: `${SITE_URL}/utility-calculators` },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, canonicalUrl(`/utility-calculators/${calc.slug}`)),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }} >
            <Script
                id={`schema-${calc.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Utility Calculators", href: "/utility-calculators" },
                    { label: calc.title },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>{hub.subtitle}</p>

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <UtilityCalculatorCore calcType={calc.calcType || "percentage"} />
                    <AuthorBadge categoryKey="utility" />

                    <DynamicExplanation
                        heading={hub.explanation?.heading}
                        paragraphs={hub.explanation?.paragraphs}
                        highlight={hub.explanation?.highlight}
                        contentHTML={hub.contentHTML}
                    />

                    {hub.faq && <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <nav style={{
                        background: "var(--n-surface)",
                        border: "1px solid var(--n-border)",
                        borderRadius: "var(--r-md)",
                        padding: "var(--s-5)",
                    }}>
                        <h3 style={{ fontSize: "var(--t-body)", fontWeight: 700, marginBottom: "var(--s-4)", display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
                            📅 Time & Date Tools
                        </h3>
                        {[
                            { label: "Age Calculator", href: "/utility-calculators/age-calculator" },
                            { label: "Date Calculator", href: "/time-calculators/date-calculator" },
                            { label: "Birth Year Calculator", href: "/time-calculators/birth-year-calculator" },
                            { label: "Days Until Calculator", href: "/time-calculators/days-until-calculator" },
                            { label: "Date Duration", href: "/time-calculators/date-duration-calculator" },
                            { label: "Business Days", href: "/time-calculators/business-days-calculator" },
                            { label: "Birthday Countdown", href: "/time-calculators/birthday-countdown" },
                            { label: "Days From Today", href: "/time-calculators/days-from-today" },
                            { label: "Weeks From Today", href: "/time-calculators/weeks-from-today" },
                            { label: "Hours Calculator", href: "/time-calculators/hours-calculator" },
                            { label: "Time Calculator", href: "/time-calculators/time-calculator" },
                            { label: "Days Left in Year", href: "/time-calculators/days-left-in-year-calculator" },
                            { label: "Deadline Calculator", href: "/time-calculators/deadline-calculator" },
                            { label: "Week Calculator", href: "/time-calculators/week-calculator" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "var(--s-3) 0", borderBottom: "1px solid var(--n-border)",
                                    color: item.href === `/utility-calculators/${calc.slug}` ? "var(--n-primary)" : "var(--n-text-secondary)",
                                    fontWeight: item.href === `/utility-calculators/${calc.slug}` ? 600 : 400,
                                    fontSize: "var(--t-body-sm)", textDecoration: "none", transition: "color 0.2s",
                                }}
                            >
                                {item.label} <span style={{ color: "var(--n-text-muted)" }}>→</span>
                            </Link>
                        ))}
                    </nav>
                </aside>
            </div>
        </main >
    );
}

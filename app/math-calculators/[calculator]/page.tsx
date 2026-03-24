// Dynamic Hub — /math-calculators/[calculator]/
// Each math calculator gets its own hub page with calculator + formula + explanation + FAQ + related

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import MathCalculatorCore from "@/components/calculator/MathCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import FormulaBlock from "@/components/shared/FormulaBlock";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("math");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("math").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title} — Free Online Tool`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/math-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
    formula?: {
        formula: string;
        variables?: { symbol: string; meaning: string }[];
        example?: { label: string; substitution: string; result: string }[];
    };
    relatedCalculators?: { title: string; slug: string; categorySlug: string; description: string }[];
}> = {

    /* ─── 1. PERCENTAGE CALCULATOR ─── */
    "percentage-calculator": {
        subtitle: "Calculate percentages instantly — find X% of Y, what percent one number is of another, percentage change, increase, and decrease.",
        explanation: {
            heading: "What is a Percentage and How Do You Calculate It?",
            paragraphs: [
                "A percentage is a way of expressing a number as a fraction of 100. The word itself comes from the Latin 'per centum,' meaning 'by the hundred.' Percentages are used everywhere — in discounts and sales tax, exam scores, statistics, finance (interest rates, inflation), and data analysis. Understanding how to calculate percentages is one of the most practical mathematical skills.",
                "There are five common percentage calculations: (1) finding X% of a number, (2) finding what percentage one number is of another, (3) calculating the percentage change between two values, (4) increasing a number by a given percentage, and (5) decreasing a number by a given percentage. Our calculator handles all five modes with step-by-step formulas shown for each calculation.",
                "Percentage calculations are the backbone of financial literacy. Interest rates, tax rates, discounts, tips, profit margins, inflation, and investment returns are all expressed as percentages. Mastering these calculations helps you make better decisions about money, data, and everyday math problems.",
            ],
            highlight: "Example: What is 15% of 240? → (15 ÷ 100) × 240 = 36. Or: 45 is what % of 180? → (45 ÷ 180) × 100 = 25%.",
        },
        formula: {
            formula: "Percentage = (Part / Whole) × 100",
            variables: [
                { symbol: "Part", meaning: "The value you want to express as a percentage" },
                { symbol: "Whole", meaning: "The total or reference value (denominator)" },
                { symbol: "100", meaning: "Multiplier to convert the fraction to a percentage" },
            ],
            example: [
                { label: "What is 25% of 200?", substitution: "(25/100) × 200", result: "50" },
                { label: "36 is what % of 150?", substitution: "(36/150) × 100", result: "24%" },
                { label: "% change from 80 to 100", substitution: "((100-80)/80) × 100", result: "25% increase" },
            ],
        },
        faq: [
            { question: "How do I calculate a percentage of a number?", answer: "Divide the percentage by 100, then multiply by the number. For example, 20% of 350 = (20 ÷ 100) × 350 = 0.20 × 350 = 70." },
            { question: "How do I find what percentage one number is of another?", answer: "Divide the part by the whole and multiply by 100. For example, 45 out of 200 = (45 ÷ 200) × 100 = 22.5%." },
            { question: "What is the formula for percentage change?", answer: "Percentage change = ((New Value − Old Value) / |Old Value|) × 100. A positive result means an increase; negative means a decrease." },
            { question: "How do I reverse a percentage? For example, 120 after a 20% increase — what was the original?", answer: "Original = Final Value / (1 + percentage/100). So 120 / 1.20 = 100. The original value was 100." },
        ],
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Convert between fractions and percentages" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate mean, median, and mode" },
            { title: "Standard Deviation", slug: "standard-deviation-calculator", categorySlug: "math-calculators", description: "Measure data variability" },
            { title: "Compound Interest", slug: "compound-interest-calculator", categorySlug: "utility-calculators", description: "Apply percentages to investment growth" },
        ],
    },

    /* ─── 1b. PERCENTAGE DECREASE CALCULATOR — RICH CONTENT (Competitor-beating) ─── */
    "percentage-decrease-calculator": {
        subtitle: "Calculate the percentage decrease between two values. Enter the original and new value to see the percent decrease, the formula, step-by-step solution, and the absolute difference — instantly.",
        contentHTML: `
            <h2 id="how-to-calculate-percentage-decrease">How to Calculate Percentage Decrease</h2>
            <p>A <strong>percentage decrease</strong> measures how much a value has fallen relative to its original amount, expressed as a percent. It answers the question: <em>"By what percent did this value go down?"</em> Whether you're tracking a price drop, a salary reduction, or a decline in website traffic, the percentage decrease tells you the <strong>relative magnitude</strong> of the change — which is often more meaningful than the raw number.</p>
            <p>To calculate the percentage decrease between an original value and a new (smaller) value, follow these four steps:</p>
            <ol>
                <li><strong>Find the difference:</strong> Subtract the new value from the original value. This gives you the <em>absolute decrease</em>.</li>
                <li><strong>Divide by the original:</strong> Divide the difference by the <strong>absolute value</strong> of the original number. This gives a decimal representing the relative drop.</li>
                <li><strong>Multiply by 100:</strong> Convert the decimal to a percentage by multiplying by 100.</li>
                <li><strong>Interpret the result:</strong> The resulting number is the percentage decrease. A positive number confirms a decrease; a negative number would indicate the value actually <em>increased</em>.</li>
            </ol>
            <p>Our calculator above performs all four steps automatically. Just enter any two values — the original and the new — and the percentage decrease, absolute difference, and step-by-step formula are displayed instantly.</p>

            <h2 id="percentage-decrease-formula">Percentage Decrease Formula</h2>
            <p>The <strong>percent decrease formula</strong> is:</p>
            <div class="explanation__highlight">
                <strong>Percentage Decrease = ((Original Value − New Value) / |Original Value|) × 100</strong>
            </div>
            <p>Where:</p>
            <ul>
                <li><strong>Original Value</strong> — the starting amount (before the decrease)</li>
                <li><strong>New Value</strong> — the ending amount (after the decrease)</li>
                <li><strong>|Original Value|</strong> — the absolute value of the original, used as the reference point for the relative calculation</li>
            </ul>
            <p>The formula divides by the <em>original</em> value because we want to express the drop as a proportion of where we started. This is the same formula used in our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> when set to "percentage change" mode, but focused specifically on decreases.</p>

            <h2 id="step-by-step-example">Step-by-Step Example</h2>
            <p>Let's walk through a real example: a product was priced at <strong>$250</strong> and is now on sale for <strong>$185</strong>. What is the percentage decrease?</p>
            <ol>
                <li><strong>Find the difference:</strong> $250 − $185 = <strong>$65</strong></li>
                <li><strong>Divide by the original:</strong> $65 / $250 = <strong>0.26</strong></li>
                <li><strong>Multiply by 100:</strong> 0.26 × 100 = <strong>26%</strong></li>
                <li><strong>Result:</strong> The price decreased by <strong>26%</strong>.</li>
            </ol>
            <p>You can verify this by using our calculator above: enter 250 as the original value and 185 as the new value.</p>

            <h3 id="another-example">Another Worked Example — Salary Reduction</h3>
            <p>Suppose your annual salary was <strong>$75,000</strong> and it was reduced to <strong>$68,250</strong>. To find the percentage decrease:</p>
            <ol>
                <li>Difference: $75,000 − $68,250 = <strong>$6,750</strong></li>
                <li>Divide: $6,750 / $75,000 = <strong>0.09</strong></li>
                <li>Multiply: 0.09 × 100 = <strong>9%</strong></li>
                <li>Your salary decreased by <strong>9%</strong>.</li>
            </ol>

            <h2 id="common-percentage-decrease-table">Common Percentage Decrease Reference Table</h2>
            <p>Here is a quick-reference table showing the percentage decrease for common value drops. Use this to quickly verify your calculations or get a sense of popular decrease scenarios.</p>
            <table>
                <thead>
                    <tr><th>Original Value</th><th>New Value</th><th>Decrease</th><th>% Decrease</th></tr>
                </thead>
                <tbody>
                    <tr><td>100</td><td>90</td><td>10</td><td><strong>10%</strong></td></tr>
                    <tr><td>100</td><td>75</td><td>25</td><td><strong>25%</strong></td></tr>
                    <tr><td>100</td><td>50</td><td>50</td><td><strong>50%</strong></td></tr>
                    <tr><td>100</td><td>25</td><td>75</td><td><strong>75%</strong></td></tr>
                    <tr><td>100</td><td>10</td><td>90</td><td><strong>90%</strong></td></tr>
                    <tr><td>200</td><td>150</td><td>50</td><td><strong>25%</strong></td></tr>
                    <tr><td>500</td><td>400</td><td>100</td><td><strong>20%</strong></td></tr>
                    <tr><td>1,000</td><td>850</td><td>150</td><td><strong>15%</strong></td></tr>
                    <tr><td>5,000</td><td>1,000</td><td>4,000</td><td><strong>80%</strong></td></tr>
                    <tr><td>50,000</td><td>45,000</td><td>5,000</td><td><strong>10%</strong></td></tr>
                </tbody>
            </table>

            <h2 id="percentage-decrease-vs-difference">Percentage Decrease vs. Percentage Difference</h2>
            <p>These two concepts are often confused, but they measure different things:</p>
            <ul>
                <li><strong>Percentage decrease</strong> always uses the <em>original</em> (starting) value as the denominator. It has a clear direction: from old to new.</li>
                <li><strong>Percentage difference</strong> uses the <em>average</em> of the two values as the denominator. It is directionless — it measures how far apart two values are relative to their midpoint.</li>
            </ul>
            <p><strong>Example:</strong> For values 200 and 150:</p>
            <ul>
                <li>Percentage decrease (from 200 to 150): (200 − 150) / 200 × 100 = <strong>25%</strong></li>
                <li>Percentage difference: |200 − 150| / ((200 + 150) / 2) × 100 = 50 / 175 × 100 = <strong>28.57%</strong></li>
            </ul>
            <p>Use <strong>percentage decrease</strong> when you know which value came first (the "before" value). Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> for percentage difference, percentage change, or percentage increase calculations.</p>

            <h2 id="real-world-applications">Real-World Applications of Percentage Decrease</h2>
            <p>Percentage decrease is used across many domains. Here are common real-life applications that are particularly relevant in the United States:</p>

            <h3 id="finance-investing">Finance & Investing</h3>
            <p>Stock market analysts use percentage decrease to report market drops. For example, if the S&P 500 falls from 5,200 to 4,940, that's a (5,200 − 4,940) / 5,200 × 100 = <strong>5% decrease</strong>. Investors track percentage drops to assess portfolio risk and make buy/sell decisions.</p>
            <p>Similarly, company earnings reports often show year-over-year revenue changes as a percentage decrease. A $1 million revenue decline has very different implications for a $5 million company (20% decrease) versus a $100 million company (1% decrease).</p>

            <h3 id="shopping-discounts">Shopping & Discount Calculations</h3>
            <p>Percentage decrease is the math behind every sale. A $120 jacket on sale for $84 has been reduced by (120 − 84) / 120 × 100 = <strong>30%</strong>. Use our <a href="/business-calculators/discount-calculator">Discount Calculator</a> for quick sale-price calculations including multiple stacked discounts.</p>

            <h3 id="population-decline">Population Decline</h3>
            <p>Demographers and urban planners use percentage decrease to track population changes. Many U.S. cities have experienced population declines — comparing the drop as a percentage (rather than raw numbers) allows fair comparison between cities of different sizes.</p>

            <h3 id="weight-loss">Health & Weight Loss</h3>
            <p>Doctors recommend tracking weight loss as a percentage of body weight. Losing 10 lbs means very different things for someone weighing 300 lbs (3.3% decrease) versus someone weighing 130 lbs (7.7% decrease). A 5–10% body weight decrease is considered clinically significant for health improvements.</p>

            <h3 id="inflation-purchasing-power">Inflation & Purchasing Power</h3>
            <p>When inflation rises, the purchasing power of a dollar decreases. If inflation is 3.5% over a year, a dollar's purchasing power decreases by roughly 3.4% — meaning $100 at the start of the year buys the equivalent of about $96.62 by year-end.</p>

            <h2 id="common-mistakes">Common Mistakes When Calculating Percentage Decrease</h2>
            <p>Even simple math can trip you up. Watch out for these common errors:</p>
            <ol>
                <li><strong>Dividing by the wrong value:</strong> Always divide by the <em>original</em> (starting) value, not the new value. Dividing by the new value gives you a different (and incorrect) percentage.</li>
                <li><strong>Confusing decrease with difference:</strong> Percentage decrease is directional (old → new). Percentage difference is symmetric. See the <a href="#percentage-decrease-vs-difference">comparison above</a>.</li>
                <li><strong>Forgetting absolute value:</strong> If the original value is negative (like a temperature drop from −10 to −15), use the absolute value of the original in the denominator.</li>
                <li><strong>Reversing the values:</strong> If the new value is <em>larger</em> than the original, the result is a percentage <em>increase</em>, not a decrease. Make sure you're entering them in the right order.</li>
                <li><strong>Confusing "decreased by" with "decreased to":</strong> A <a href="/math-calculators/percentage-calculator">20% decrease</a> of 100 gives you 80 (decreased <em>to</em> 80). The <em>decrease amount</em> is 20, but the new value is 80.</li>
            </ol>

            <h2 id="how-to-reverse">How to Reverse a Percentage Decrease</h2>
            <p>Sometimes you know the percentage decrease and the new value, and you need to find the original value. The reverse formula is:</p>
            <div class="explanation__highlight">
                <strong>Original Value = New Value / (1 − Percentage Decrease / 100)</strong>
            </div>
            <p><strong>Example:</strong> A product is now $60 after a 25% decrease. What was the original price?</p>
            <p>Original = $60 / (1 − 0.25) = $60 / 0.75 = <strong>$80</strong>.</p>

            <h2 id="related-concepts">Related Percentage Concepts</h2>
            <p>Percentage decrease is one of several related percentage calculations. Understanding the differences helps you choose the right formula:</p>
            <ul>
                <li><strong><a href="/math-calculators/percentage-calculator">Percentage Calculator</a>:</strong> The comprehensive tool for all percentage operations — X% of Y, percentage change, increase, decrease, and "what % is A of B."</li>
                <li><strong><a href="/math-calculators/fraction-to-percent-calculator">Fraction to Percent Calculator</a>:</strong> Convert fractions like 3/4 to 75%. Useful when your decrease is expressed as a fraction (e.g., "the stock lost a quarter of its value" = 25% decrease).</li>
                <li><strong><a href="/business-calculators/discount-calculator">Discount Calculator</a>:</strong> Specialized for shopping — enter the original price and discount percentage to see the sale price and savings amount.</li>
                <li><strong><a href="/math-calculators/average-calculator">Average Calculator</a>:</strong> When comparing multiple percentage decreases over time, the average (mean) decrease can reveal the overall trend.</li>
            </ul>
        `,
        formula: {
            formula: "Percentage Decrease = ((Original − New) / |Original|) × 100",
            variables: [
                { symbol: "Original", meaning: "The starting value (before the decrease)" },
                { symbol: "New", meaning: "The ending value (after the decrease)" },
                { symbol: "|Original|", meaning: "Absolute value of the original — ensures a correct result even if the original is negative" },
                { symbol: "× 100", meaning: "Converts the decimal to a percentage" },
            ],
            example: [
                { label: "Price drop: $250 → $185", substitution: "((250 − 185) / 250) × 100 = (65/250) × 100", result: "26% decrease" },
                { label: "Salary cut: $75,000 → $68,250", substitution: "((75000 − 68250) / 75000) × 100", result: "9% decrease" },
                { label: "Stock: 5,000 → 1,000", substitution: "((5000 − 1000) / 5000) × 100", result: "80% decrease" },
            ],
        },
        faq: [
            { question: "What is the percentage decrease from 100 to 10?", answer: "The percentage decrease from 100 to 10 is 90%. The calculation: (100 − 10) / 100 × 100 = 90 / 100 × 100 = 90%." },
            { question: "What is the percentage decrease from 80 to 60?", answer: "The percentage decrease is 25%. Calculation: (80 − 60) / 80 × 100 = 20/80 × 100 = 25%." },
            { question: "How do I calculate a 20% decrease?", answer: "Multiply the original value by 0.20 to get the decrease amount, then subtract from the original. Or simply multiply by 0.80. Example: 20% decrease of 500 = 500 × 0.80 = 400." },
            { question: "What is the formula for percentage decrease?", answer: "Percentage Decrease = ((Original Value − New Value) / |Original Value|) × 100. The result tells you what percent the value dropped relative to the starting amount." },
            { question: "Is percentage decrease always positive?", answer: "Yes, when the value actually decreased (new < original). If the new value is larger, the result is negative — meaning it was actually an increase, not a decrease." },
            { question: "What is the difference between percentage decrease and percentage change?", answer: "Percentage change is the general concept covering both increases and decreases. Percentage decrease is specifically when the change is downward (new value < original value). They use the same formula." },
            { question: "Can percentage decrease be more than 100%?", answer: "Not when both values are positive. A 100% decrease means the value dropped to zero. However, if working with negative original values, technically a result over 100% is possible." },
            { question: "How is percentage decrease used in finance?", answer: "It's used to report stock declines, revenue drops, and portfolio losses. A percentage decrease normalizes comparisons — a $50 drop means 10% on a $500 stock but only 1% on a $5,000 stock." },
        ],
        relatedCalculators: [
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "All percentage operations — change, increase, decrease, X% of Y" },
            { title: "Fraction to Percent", slug: "fraction-to-percent-calculator", categorySlug: "math-calculators", description: "Convert fractions to percentages" },
            { title: "Discount Calculator", slug: "discount-calculator", categorySlug: "business-calculators", description: "Calculate sale prices and savings from discounts" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Mean, median, and mode for data analysis" },
            { title: "Standard Deviation", slug: "standard-deviation-calculator", categorySlug: "math-calculators", description: "Measure data spread and variability" },
        ],
    },

    /* ─── 1c. NUMBERS TO WORDS CONVERTER — RICH CONTENT (Competitor-beating) ─── */
    "numbers-to-words-converter": {
        subtitle: "Convert any number to English words instantly. Supports integers, decimals, negative numbers, USD currency for check writing, and ordinal numbers (1st, 2nd, 3rd). Choose lowercase, UPPERCASE, Title Case, or Sentence case.",
        contentHTML: `
            <h2 id="how-to-convert-numbers-to-words">How to Convert Numbers to Words</h2>
            <p>Converting <strong>numbers to words</strong> means spelling out a numeric value as English text. For example, the number <strong>1,234</strong> becomes <strong>"one thousand two hundred thirty-four."</strong> This is a fundamental skill used in check writing, legal documents, formal reports, education, and accessibility.</p>
            <p>Our converter above handles any number you enter — positive, negative, integers, and decimals — and instantly outputs the word form. You can switch between three modes:</p>
            <ul>
                <li><strong>Number → Words:</strong> Converts any number to its English word form</li>
                <li><strong>USD Currency:</strong> Formats the output for check writing (e.g., "five thousand seventy-five and 62/100 dollars")</li>
                <li><strong>Ordinal:</strong> Converts to ordinal form (e.g., 23 → "twenty-third")</li>
            </ul>
            <p>You can also choose your preferred <strong>letter case</strong> — lowercase, UPPERCASE, Title Case, or Sentence case — so you can copy and paste directly into your document.</p>

            <h2 id="place-value-groups">How Numbers Are Named — Place Value Groups</h2>
            <p>English names numbers by grouping digits into <strong>groups of three</strong>, starting from the right. Each group of three digits is called a <strong>period</strong> and has a scale name:</p>
            <table>
                <thead>
                    <tr><th>Group Position</th><th>Scale Name</th><th>Value</th><th>Example</th></tr>
                </thead>
                <tbody>
                    <tr><td>1st group</td><td>Ones</td><td>1 – 999</td><td>five hundred twelve</td></tr>
                    <tr><td>2nd group</td><td>Thousands</td><td>1,000</td><td>three thousand</td></tr>
                    <tr><td>3rd group</td><td>Millions</td><td>1,000,000</td><td>seven million</td></tr>
                    <tr><td>4th group</td><td>Billions</td><td>1,000,000,000</td><td>two billion</td></tr>
                    <tr><td>5th group</td><td>Trillions</td><td>1,000,000,000,000</td><td>one trillion</td></tr>
                    <tr><td>6th group</td><td>Quadrillions</td><td>10<sup>15</sup></td><td>four quadrillion</td></tr>
                    <tr><td>7th group</td><td>Quintillions</td><td>10<sup>18</sup></td><td>nine quintillion</td></tr>
                </tbody>
            </table>
            <p>For each three-digit group, the conversion follows the same pattern: <em>[ones digit] hundred [tens and ones]</em>. For example, the group <strong>512</strong> becomes "five hundred twelve." Then the scale name is appended: "five hundred twelve <strong>thousand</strong>."</p>
            <p>The United States uses the <strong>short scale</strong> system, where each new scale name represents 1,000 times the previous one. This is different from the <strong>long scale</strong> used in some European countries, where "billion" means 10<sup>12</sup> (one million millions) rather than 10<sup>9</sup>.</p>

            <h2 id="number-names-reference">Number Names Reference Table</h2>
            <p>Here is a complete reference for number names from 1 through 100, plus the key large numbers:</p>

            <h3 id="ones-through-twenty">1 Through 20</h3>
            <table>
                <thead><tr><th>Number</th><th>Word</th><th>Number</th><th>Word</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>one</td><td>11</td><td>eleven</td></tr>
                    <tr><td>2</td><td>two</td><td>12</td><td>twelve</td></tr>
                    <tr><td>3</td><td>three</td><td>13</td><td>thirteen</td></tr>
                    <tr><td>4</td><td>four</td><td>14</td><td>fourteen</td></tr>
                    <tr><td>5</td><td>five</td><td>15</td><td>fifteen</td></tr>
                    <tr><td>6</td><td>six</td><td>16</td><td>sixteen</td></tr>
                    <tr><td>7</td><td>seven</td><td>17</td><td>seventeen</td></tr>
                    <tr><td>8</td><td>eight</td><td>18</td><td>eighteen</td></tr>
                    <tr><td>9</td><td>nine</td><td>19</td><td>nineteen</td></tr>
                    <tr><td>10</td><td>ten</td><td>20</td><td>twenty</td></tr>
                </tbody>
            </table>

            <h3 id="tens">Tens (30–100)</h3>
            <table>
                <thead><tr><th>Number</th><th>Word</th><th>Number</th><th>Word</th></tr></thead>
                <tbody>
                    <tr><td>30</td><td>thirty</td><td>70</td><td>seventy</td></tr>
                    <tr><td>40</td><td>forty</td><td>80</td><td>eighty</td></tr>
                    <tr><td>50</td><td>fifty</td><td>90</td><td>ninety</td></tr>
                    <tr><td>60</td><td>sixty</td><td>100</td><td>one hundred</td></tr>
                </tbody>
            </table>

            <div class="explanation__highlight">
                <strong>Common spelling mistake:</strong> "Forty" is the correct spelling — not "fourty." This is one of the most common spelling errors in English.
            </div>

            <h2 id="how-to-write-a-check">How to Write a Check in the United States</h2>
            <p>Even in the digital age, writing checks is still common in the U.S. for rent payments, contractor invoices, and business-to-business transactions. The most important line on a check is the <strong>amount written in words</strong> — this is the legal amount, and it takes priority over the numeric amount if they differ.</p>
            <p>Follow these steps to write a check correctly:</p>
            <ol>
                <li><strong>Date:</strong> Write today's date in MM/DD/YYYY format (the standard U.S. format) in the upper right corner.</li>
                <li><strong>Payee:</strong> Write the full name of the person or company on the "Pay to the order of" line.</li>
                <li><strong>Numeric amount:</strong> Write the dollar amount in numbers in the box (e.g., <strong>$5,075.62</strong>).</li>
                <li><strong>Amount in words:</strong> On the line below the payee, write the amount in words. Use our converter in "USD Currency" mode to get the exact wording.</li>
                <li><strong>Signature:</strong> Sign your name on the bottom-right line.</li>
                <li><strong>Memo (optional):</strong> Add a note on the memo line (e.g., "September rent" or "Invoice #123").</li>
            </ol>

            <h3 id="check-writing-example">Worked Example: Writing a Check for $5,075.62</h3>
            <p>Enter <strong>5075.62</strong> in our converter and select "USD Currency" mode. The output is:</p>
            <div class="explanation__highlight">
                <strong>Five thousand seventy-five and 62/100 dollars</strong>
            </div>
            <p>Write this on the "amount in words" line. The cents are written as a fraction over 100 (<strong>62/100</strong>). Draw a line through any remaining blank space on the line to prevent tampering.</p>
            <p>Writing amounts in words reduces the risk of fraud — it's much harder to alter "five thousand" to "fifty thousand" than to add a zero to "$5,000" to make "$50,000."</p>

            <h2 id="numbers-in-formal-writing">Numbers in Formal Writing — When to Spell Out Numbers</h2>
            <p>Different style guides have different rules for when to use numerals versus words. Here are the two most common standards in the United States:</p>

            <h3 id="ap-style">AP Style (Journalism)</h3>
            <ul>
                <li>Spell out numbers <strong>one through nine</strong>; use numerals for <strong>10 and above</strong>.</li>
                <li>Always spell out a number at the <strong>beginning of a sentence</strong>: "Twenty-three people attended."</li>
                <li>Use numerals for <strong>ages, dates, addresses, percentages, and dollar amounts</strong>.</li>
            </ul>

            <h3 id="chicago-style">Chicago Manual of Style (Academic/Book Publishing)</h3>
            <ul>
                <li>Spell out numbers <strong>zero through one hundred</strong> and any number that can be expressed in two words (e.g., "two hundred," "forty-five thousand").</li>
                <li>Use numerals for numbers <strong>over one hundred</strong> when they cannot be expressed in two words.</li>
                <li>Never start a sentence with a numeral — always spell it out or rewrite the sentence.</li>
            </ul>

            <h2 id="ordinal-numbers">Ordinal Numbers — 1st, 2nd, 3rd</h2>
            <p><strong>Ordinal numbers</strong> indicate position or order — first, second, third, and so on. They are different from <strong>cardinal numbers</strong> (one, two, three), which indicate quantity. Our converter's "Ordinal" mode generates the word form of ordinal numbers.</p>
            <table>
                <thead><tr><th>Cardinal</th><th>Ordinal Word</th><th>Cardinal</th><th>Ordinal Word</th></tr></thead>
                <tbody>
                    <tr><td>1</td><td>first</td><td>11</td><td>eleventh</td></tr>
                    <tr><td>2</td><td>second</td><td>12</td><td>twelfth</td></tr>
                    <tr><td>3</td><td>third</td><td>13</td><td>thirteenth</td></tr>
                    <tr><td>4</td><td>fourth</td><td>20</td><td>twentieth</td></tr>
                    <tr><td>5</td><td>fifth</td><td>21</td><td>twenty-first</td></tr>
                    <tr><td>6</td><td>sixth</td><td>30</td><td>thirtieth</td></tr>
                    <tr><td>7</td><td>seventh</td><td>50</td><td>fiftieth</td></tr>
                    <tr><td>8</td><td>eighth</td><td>100</td><td>one hundredth</td></tr>
                    <tr><td>9</td><td>ninth</td><td>101</td><td>one hundred first</td></tr>
                    <tr><td>10</td><td>tenth</td><td>1000</td><td>one thousandth</td></tr>
                </tbody>
            </table>
            <p>Ordinal numbers are used for <strong>dates</strong> (March 3rd), <strong>rankings</strong> (1st place), <strong>floors</strong> (the 42nd floor), and <strong>fractions</strong> (one-fifth, three-fourths).</p>

            <h2 id="common-use-cases">Common Use Cases for Numbers to Words</h2>
            <ul>
                <li><strong>Check writing:</strong> Banks require the dollar amount in words as the legal amount on checks.</li>
                <li><strong>Legal documents:</strong> Contracts, leases, and court filings spell out monetary amounts and quantities to prevent ambiguity and fraud.</li>
                <li><strong>Invoices and receipts:</strong> Some businesses include word-form amounts alongside numeric totals for clarity.</li>
                <li><strong>Education:</strong> Students learn to read and write numbers in word form in elementary math classes. Use this converter with our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> and <a href="/math-calculators/fraction-calculator">Fraction Calculator</a> for complete math homework support.</li>
                <li><strong>Accessibility:</strong> Screen readers for visually impaired users sometimes interpret numerals differently than written words. Spelling out numbers ensures clear communication.</li>
                <li><strong>Tax forms:</strong> IRS forms and some state tax documents require amounts in both numeric and word form.</li>
                <li><strong>Speeches and presentations:</strong> "There are only five thousand six hundred wild tigers left" has more impact than "5,600."</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>How do you write 1,000 in words?</h3>
            <p>1,000 in words is <strong>"one thousand."</strong></p>

            <h3>How do you write 100,000 in words?</h3>
            <p>100,000 in words is <strong>"one hundred thousand."</strong></p>

            <h3>How do you write a check for $1,500?</h3>
            <p>Write <strong>"one thousand five hundred and 00/100 dollars"</strong> on the amount-in-words line. If paying $1,500.50, write "one thousand five hundred and 50/100 dollars."</p>

            <h3>What is the word for 1,000,000,000?</h3>
            <p>1,000,000,000 is <strong>"one billion"</strong> in the United States (short scale). In some European countries using the long scale, this would be called "one milliard."</p>

            <h3>How do you spell out dollars and cents on a check?</h3>
            <p>Write the dollar amount in words, then write "and" followed by the cents as a fraction over 100. For example, $42.75 becomes <strong>"forty-two and 75/100 dollars."</strong></p>

            <h3>When should you spell out numbers in writing?</h3>
            <p>In AP Style (journalism), spell out one through nine. In Chicago style (academic), spell out zero through one hundred. Always spell out numbers at the beginning of a sentence. Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> when you need to express numerical relationships.</p>

            <h3>What is the largest number with a recognized name?</h3>
            <p>A <strong>googolplex</strong> (10<sup>10<sup>100</sup></sup>) is one of the largest named numbers. A <strong>googol</strong> (10<sup>100</sup>) — the number 1 followed by 100 zeros — is "ten duotrigintillion." Our converter handles numbers up to quintillions (10<sup>18</sup>).</p>

            <h3>Do you use "and" when writing numbers in words?</h3>
            <p>In <strong>American English</strong>, "and" is typically <em>not</em> used between the hundreds and tens place (e.g., "one hundred twenty-three," not "one hundred and twenty-three"). However, "and" <em>is</em> used in check writing to separate dollars from cents: "one hundred twenty-three <strong>and</strong> 45/100 dollars." In British English, "and" is always used.</p>

            <h3>How do you write ordinal numbers in words?</h3>
            <p>Most ordinal numbers are formed by adding "-th" to the cardinal number: four → four<strong>th</strong>, six → six<strong>th</strong>. Exceptions: first, second, third, fifth (not "fiveth"), eighth (not "eightth"), ninth (not "nineth"), twelfth (not "twelveth"). Use our Ordinal mode to convert any number.</p>

            <h3>What is the difference between cardinal and ordinal numbers?</h3>
            <p><strong>Cardinal numbers</strong> express quantity: one, two, three (how many?). <strong>Ordinal numbers</strong> express position or rank: first, second, third (which one?). Use our <a href="/math-calculators/average-calculator">Average Calculator</a> for working with cardinal numbers in data sets.</p>
        `,
        formula: {
            formula: "Group digits by 3s from right → Name each group → Add scale (thousand, million, …)",
            variables: [
                { symbol: "Ones", meaning: "0–9: zero, one, two, three, four, five, six, seven, eight, nine" },
                { symbol: "Teens", meaning: "10–19: ten, eleven, twelve, thirteen, … nineteen" },
                { symbol: "Tens", meaning: "20–90: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety" },
                { symbol: "Scales", meaning: "thousand (10³), million (10⁶), billion (10⁹), trillion (10¹²)" },
            ],
            example: [
                { label: "1,234", substitution: "1 thousand + 234 → two hundred thirty-four", result: "one thousand two hundred thirty-four" },
                { label: "1,000,000", substitution: "1 million + 0 thousands + 0 ones", result: "one million" },
                { label: "$5,075.62 (USD)", substitution: "5 thousand + 75 + 62/100", result: "five thousand seventy-five and 62/100 dollars" },
            ],
        },
        faq: [
            { question: "How do you write 1,000 in words?", answer: "1,000 in words is \"one thousand.\"" },
            { question: "How do you write 100,000 in words?", answer: "100,000 in words is \"one hundred thousand.\"" },
            { question: "How do you write a check for $1,500?", answer: "Write \"one thousand five hundred and 00/100 dollars\" on the amount-in-words line. The check usually has \"dollars\" pre-printed, so write up to that point." },
            { question: "What is the word for 1,000,000,000?", answer: "One billion (in the U.S. short scale). In countries using the long scale, it would be \"one milliard\" — \"billion\" in the long scale means 10¹²." },
            { question: "How do you spell out dollars and cents?", answer: "Write the dollar amount in words, then \"and\" followed by the cents as a fraction over 100. Example: $42.75 = \"forty-two and 75/100 dollars.\"" },
            { question: "When should you spell out numbers in writing?", answer: "AP Style: spell out one through nine, use numerals for 10+. Chicago style: spell out zero through one hundred. Always spell out a number at the start of a sentence." },
            { question: "What is the largest number with a name?", answer: "A googolplex (10^(10^100)) is one of the largest. A googol (10^100) — the number 1 followed by 100 zeros — is \"ten duotrigintillion.\"" },
            { question: "Do you use 'and' when writing numbers?", answer: "In American English, \"and\" is NOT used between hundreds and tens (\"one hundred twenty-three\"). However, in check writing, \"and\" separates dollars from cents (\"one hundred twenty-three and 45/100 dollars\")." },
            { question: "How do you write ordinal numbers in words?", answer: "Add \"-th\" to the cardinal number (fourth, sixth). Exceptions: first, second, third, fifth, eighth, ninth, twelfth. For compound ordinals: twenty-first, thirty-second, etc." },
            { question: "What is the difference between cardinal and ordinal numbers?", answer: "Cardinal numbers express quantity (one, two, three — how many?). Ordinal numbers express position (first, second, third — in what order?). Our converter supports both modes." },
        ],
        relatedCalculators: [
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate percentages — X% of Y, change, increase, decrease" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply, and divide fractions" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Division with step-by-step working" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate mean, median, and mode" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers and scientific notation" },
        ],
    },

    /* ─── 2. FRACTION CALCULATOR — RICH CONTENT (Competitor-level) ─── */

    "fraction-calculator": {
        subtitle: "Add, subtract, multiply, and divide fractions and mixed numbers using our fraction calculator. See every step of the solution — from finding the common denominator to simplifying the result.",
        contentHTML: `
            <h2 id="how-to-calculate-fractions">How to Calculate Fractions</h2>
            <p>A <strong>fraction</strong> is a number that represents a part of a whole, written as one number over another separated by a line: <em>numerator / denominator</em>. The <strong>numerator</strong> (top number) tells how many parts you have, and the <strong>denominator</strong> (bottom number) tells how many equal parts the whole is divided into.</p>
            <p>Our calculator above handles addition, subtraction, multiplication, and division of fractions — including proper fractions, improper fractions, and mixed numbers. It shows the complete step-by-step solution so you can follow along and learn the process.</p>
            <p>Below you'll find detailed guides for each operation, complete with formulas and worked examples.</p>

            <h2 id="add-subtract-fractions">How to Add & Subtract Fractions</h2>
            <p>Adding and subtracting fractions is different from adding whole numbers because the fractions must have the <strong>same denominator</strong> before you can combine them. You can use the following formula to add two fractions:</p>
            <p><strong>a/b + c/d = (a×d + b×c) / (b×d)</strong></p>
            <p>This formula works by cross-multiplying to create a common denominator. After applying it, you simplify the result. Here are the three steps in detail:</p>

            <h3 id="step-common-denominator">Step One: Convert to Fractions with a Common Denominator</h3>
            <p>When adding or subtracting fractions with different denominators, you first need to find the <strong>Least Common Denominator (LCD)</strong> — the smallest number that both denominators divide into evenly. The LCD is the same as the <a href="/math-calculators/lcm-calculator">Least Common Multiple (LCM)</a> of the denominators.</p>
            <p>Once you have the LCD, convert each fraction to an <strong>equivalent fraction</strong> with the LCD as the denominator. To do this, divide the LCD by each fraction's denominator, then multiply both the numerator and denominator by that result.</p>
            <p><strong>Example:</strong> Add 1/3 + 1/4.</p>
            <ul>
                <li>LCD of 3 and 4 = 12</li>
                <li>1/3 = (1 × 4) / (3 × 4) = <strong>4/12</strong></li>
                <li>1/4 = (1 × 3) / (4 × 3) = <strong>3/12</strong></li>
            </ul>

            <h3 id="step-add-numerators">Step Two: Add or Subtract the Numerators</h3>
            <p>Once both fractions have the same denominator, simply <strong>add</strong> (or subtract) the numerators and keep the denominator the same.</p>
            <p><strong>Continuing the example:</strong></p>
            <p>4/12 + 3/12 = (4 + 3) / 12 = <strong>7/12</strong></p>

            <h3 id="step-simplify-add">Step Three: Simplify the Fraction</h3>
            <p>The final step is to <strong>simplify</strong> the result. Find the <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a> of the numerator and denominator, then divide both by it.</p>
            <p>In our example, 7/12 is already in its simplest form because GCD(7, 12) = 1. The answer is <strong>7/12 ≈ 0.5833</strong>.</p>

            <div class="explanation__highlight">
                <strong>Subtraction works the same way</strong> — just subtract the numerators instead of adding them. For example: 3/4 − 1/3 → LCD = 12 → 9/12 − 4/12 = <strong>5/12</strong>.
            </div>

            <h2 id="multiply-fractions">How to Multiply Fractions</h2>
            <p>Multiplying fractions is simpler than adding them — no common denominator needed. Use this formula:</p>
            <p><strong>a/b × c/d = (a × c) / (b × d)</strong></p>
            <p>Simply multiply the numerators together and multiply the denominators together, then simplify the result.</p>

            <h3 id="step-multiply-num-den">Step One: Multiply the Numerators and Denominators</h3>
            <p>Multiply the top numbers together to get the new numerator. Multiply the bottom numbers together to get the new denominator.</p>
            <p><strong>Example:</strong> Multiply 2/3 × 3/4.</p>
            <p>2/3 × 3/4 = (2 × 3) / (3 × 4) = <strong>6/12</strong></p>

            <h3 id="step-simplify-multiply">Step Two: Simplify the Fraction</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">GCD</a> of the numerator and denominator, then divide both by it.</p>
            <p>GCD(6, 12) = 6. So: 6/12 = (6 ÷ 6) / (12 ÷ 6) = <strong>1/2</strong>.</p>

            <div class="explanation__highlight">
                <strong>Tip:</strong> You can cross-cancel <em>before</em> multiplying to make the math easier. In 2/3 × 3/4, the 3 in the numerator and the 3 in the denominator cancel out, giving you 2/1 × 1/4 = 2/4 = 1/2. Same answer, simpler arithmetic.
            </div>

            <h2 id="divide-fractions">How to Divide Fractions</h2>
            <p>To divide fractions, use the <strong>"keep, change, flip"</strong> method — also called multiplying by the reciprocal:</p>
            <ol>
                <li><strong>Keep</strong> the first fraction as it is.</li>
                <li><strong>Change</strong> the division sign (÷) to multiplication (×).</li>
                <li><strong>Flip</strong> the second fraction (swap its numerator and denominator to get the reciprocal).</li>
            </ol>
            <p>The formula is: <strong>a/b ÷ c/d = a/b × d/c = (a × d) / (b × c)</strong></p>

            <h3 id="step-cross-multiply">Step One: Multiply by the Reciprocal</h3>
            <p><strong>Example:</strong> Divide 2/3 ÷ 3/4.</p>
            <p>Flip the second fraction: 3/4 → <strong>4/3</strong></p>
            <p>Now multiply: 2/3 × 4/3 = (2 × 4) / (3 × 3) = <strong>8/9</strong></p>

            <h3 id="step-simplify-divide">Step Two: Simplify the Fraction</h3>
            <p>GCD(8, 9) = 1, so 8/9 is already in simplest form. The answer is <strong>8/9 ≈ 0.8889</strong>.</p>

            <div class="explanation__highlight">
                <strong>Why does "keep, change, flip" work?</strong> Division is the inverse of multiplication. Dividing by a fraction is the same as multiplying by its reciprocal. Think about it: 6 ÷ 2 = 3, and 6 × 1/2 = 3. Same result!
            </div>

            <h2 id="mixed-numbers">How to Calculate Mixed Numbers</h2>
            <p>A <strong>mixed number</strong> combines a whole number and a proper fraction, like 2 3/5. To perform arithmetic with mixed numbers, the first step is to convert them to <strong>improper fractions</strong>:</p>
            <ol>
                <li>Multiply the whole number by the denominator.</li>
                <li>Add the result to the numerator.</li>
                <li>Keep the same denominator.</li>
            </ol>
            <p><strong>Example:</strong> Convert 2 3/5 to an improper fraction.</p>
            <ul>
                <li>2 × 5 = 10</li>
                <li>10 + 3 = 13</li>
                <li>2 3/5 = <strong>13/5</strong></li>
            </ul>
            <p>Once you have improper fractions, use any of the formulas above (add, subtract, multiply, or divide) as normal. After calculating, you can convert the result back to a mixed number by dividing the numerator by the denominator — the quotient is the whole number, and the remainder over the denominator is the fraction part.</p>

            <h2 id="negative-fractions">How to Calculate Negative Fractions</h2>
            <p>A <strong>negative fraction</strong> has a minus sign in front. The negative sign can be placed in front of the entire fraction, in front of the numerator, or in front of the denominator — all three are equivalent:</p>
            <p><strong>−a/b = (−a)/b = a/(−b)</strong></p>
            <p>When <em>both</em> the numerator and denominator are negative, the fraction is actually <strong>positive</strong>, because a negative divided by a negative is positive.</p>
            <p>Key rules for negative fractions:</p>
            <ul>
                <li><strong>Positive × Negative = Negative</strong> (e.g., 1/2 × −1/3 = −1/6)</li>
                <li><strong>Negative × Negative = Positive</strong> (e.g., −2/3 × −3/4 = 6/12 = 1/2)</li>
                <li>The same rules apply for division — it follows the sign rules of multiplication.</li>
                <li>For addition and subtraction, attach the negative sign to the numerator and follow the standard steps.</li>
            </ul>

            <h2 id="types-of-fractions">Types of Fractions</h2>
            <p>There are three main types of fractions:</p>
            <ul>
                <li><strong>Proper fractions:</strong> The numerator is smaller than the denominator (e.g., 3/4, 2/7). The value is always less than 1.</li>
                <li><strong>Improper fractions:</strong> The numerator is equal to or greater than the denominator (e.g., 7/4, 5/3). The value is 1 or greater.</li>
                <li><strong>Mixed numbers:</strong> A whole number combined with a proper fraction (e.g., 1 3/4, 2 1/3). Every mixed number can be converted to an improper fraction and vice versa.</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What are the 3 types of fractions?</h3>
            <p>The three types are <strong>proper fractions</strong> (numerator &lt; denominator, like 3/4), <strong>improper fractions</strong> (numerator ≥ denominator, like 7/4), and <strong>mixed numbers</strong> (a whole number plus a proper fraction, like 1 3/4). You can convert between improper fractions and mixed numbers: 7/4 = 1 3/4.</p>

            <h3>What is the golden rule of fractions?</h3>
            <p>The golden rule is: <strong>always find a common denominator</strong> before adding or subtracting fractions. This is done by finding the <a href="/math-calculators/lcm-calculator">Least Common Multiple (LCM)</a> of the denominators. Without a common denominator, you cannot directly combine fractions — this is the single most important rule in fraction arithmetic.</p>

            <h3>How do I simplify a fraction?</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a> of the numerator and denominator, then divide both by it. For example: 18/24 → GCD(18, 24) = 6 → 18/24 = 3/4. If the GCD is 1, the fraction is already in simplest form.</p>

            <h3>How do I convert a fraction to a decimal?</h3>
            <p>Divide the numerator by the denominator. For example, 3/8 = 3 ÷ 8 = 0.375. Use our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> to see the full division steps. To convert a fraction to a percentage, multiply the decimal by 100: 3/8 = 0.375 = 37.5%.</p>

            <h3>Why do we use fractions instead of decimals?</h3>
            <p>Fractions are <strong>exact</strong> — they can represent values like 1/3 precisely, while the decimal 0.333... goes on forever. Fractions are essential in cooking (1/2 cup), construction (3/4 inch), music (time signatures like 3/4), probability, and algebra. Many mathematical operations are simpler with fractions than with decimals.</p>
        `,
        formula: {
            formula: "a/b + c/d = (a×d + b×c) / (b×d)",
            variables: [
                { symbol: "a/b", meaning: "First fraction (a = numerator, b = denominator)" },
                { symbol: "c/d", meaning: "Second fraction (c = numerator, d = denominator)" },
                { symbol: "×", meaning: "Multiply: a/b × c/d = (a×c) / (b×d)" },
                { symbol: "÷", meaning: "Divide: a/b ÷ c/d = (a×d) / (b×c) — flip & multiply" },
            ],
            example: [
                { label: "Add: 1/3 + 1/4", substitution: "(1×4 + 3×1) / (3×4) = 7/12", result: "7/12 ≈ 0.5833" },
                { label: "Multiply: 2/3 × 3/4", substitution: "(2×3) / (3×4) = 6/12", result: "1/2 (simplified)" },
                { label: "Divide: 2/3 ÷ 3/4", substitution: "(2×4) / (3×3) = 8/9", result: "8/9 ≈ 0.8889" },
            ],
        },
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD to simplify fractions" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find the LCD for adding fractions" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Convert fractions to percentages" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Convert fractions to decimals with steps" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate the mean of fractional values" },
        ],
    },

    /* ─── 3. GCD CALCULATOR — RICH CONTENT (Competitor-level) ─── */
    "gcd-calculator": {
        subtitle: "Find the greatest common divisor (GCD), also known as the greatest common factor (GCF) or highest common factor (HCF), for a set of numbers. See all factors, common factors, prime factorization, and step-by-step solutions using three different methods.",
        contentHTML: `
            <h2 id="how-to-find-the-gcd">How to Find the Greatest Common Divisor</h2>
            <p>The <strong>greatest common divisor (GCD)</strong> of a set of numbers is the largest number that divides evenly into all numbers in the set. The greatest common divisor is sometimes referred to as the <em>greatest common factor (GCF)</em>, <em>highest common factor (HCF)</em>, <em>greatest common denominator</em>, or <em>highest common divisor</em>.</p>
            <p>A <strong>factor</strong> (or divisor) of a number <em>x</em> is any whole number that can be multiplied by another whole number to produce <em>x</em>. For example, 3 and 5 are both factors of 15, because 3 × 5 = 15.</p>
            <p>There are three standard methods to find the GCD: using <strong>prime factorization</strong>, <strong>listing all factors</strong>, or <strong>Euclid's algorithm</strong>. Our calculator above uses all three and shows the complete step-by-step solution. Read on to learn each method with a worked example.</p>

            <h3 id="method-prime-factorization">Method One: Find GCD Using Prime Factorization</h3>
            <p>The prime factorization method works by decomposing each number into its <strong>prime factors</strong> — the building blocks that are themselves only divisible by 1 and themselves. Once you have the prime factors for every number in the set, you identify the primes that are <strong>common to all numbers</strong> and multiply them together to get the GCD.</p>
            <p>A <em>prime number</em> is a number greater than 1 that has no divisors other than 1 and itself. The first several primes are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29…</p>

            <p><strong>Example: Find the GCD of 90 and 165 using prime factorization.</strong></p>
            <p><strong>Step 1 — Find the prime factors of 90:</strong></p>
            <ul>
                <li>90 ÷ 2 = 45 → <strong>2</strong> is a prime factor</li>
                <li>45 ÷ 3 = 15 → <strong>3</strong> is a prime factor</li>
                <li>15 ÷ 3 = 5 → <strong>3</strong> is a prime factor (again)</li>
                <li>5 ÷ 5 = 1 → <strong>5</strong> is a prime factor</li>
            </ul>
            <p>Prime factors of 90 = <strong>2 × 3 × 3 × 5</strong> (or 2 × 3² × 5)</p>

            <p><strong>Step 2 — Find the prime factors of 165:</strong></p>
            <ul>
                <li>165 ÷ 3 = 55 → <strong>3</strong> is a prime factor</li>
                <li>55 ÷ 5 = 11 → <strong>5</strong> is a prime factor</li>
                <li>11 ÷ 11 = 1 → <strong>11</strong> is a prime factor</li>
            </ul>
            <p>Prime factors of 165 = <strong>3 × 5 × 11</strong></p>

            <p><strong>Step 3 — Find the common prime factors:</strong></p>
            <p>Both 90 and 165 share the prime factors <strong>3</strong> and <strong>5</strong>.</p>

            <p><strong>Step 4 — Multiply the common prime factors:</strong></p>
            <p>GCD = 3 × 5 = <strong>15</strong></p>

            <div class="explanation__highlight">
                <strong>Result:</strong> The greatest common divisor of 90 and 165 is <strong>15</strong>. This means you can simplify the fraction 90/165 to 6/11 by dividing both the numerator and denominator by 15. Use our <a href="/math-calculators/fraction-calculator">Fraction Calculator</a> to simplify any fraction instantly.
            </div>

            <h3 id="method-listing-factors">Method Two: Find GCD by Listing All Factors</h3>
            <p>This method involves finding <em>every</em> factor of each number, identifying which factors are common to all numbers, and then selecting the largest one. It is straightforward and easy to understand, though it becomes impractical for very large numbers.</p>

            <p><strong>Example: Find the GCD of 90 and 165 by listing all factors.</strong></p>

            <p><strong>Step 1 — List all factors of 90:</strong></p>
            <p>Check every integer from 1 up to 90 that divides 90 evenly:</p>
            <p>Factors of 90 = {1, 2, 3, 5, 6, 9, 10, 15, 18, 30, 45, 90}</p>

            <p><strong>Step 2 — List all factors of 165:</strong></p>
            <p>Factors of 165 = {1, 3, 5, 11, 15, 33, 55, 165}</p>

            <p><strong>Step 3 — Find the common factors:</strong></p>
            <p>Numbers that appear in <em>both</em> factor lists:</p>
            <p>Common factors = {<strong>1, 3, 5, 15</strong>}</p>

            <p><strong>Step 4 — Select the greatest common factor:</strong></p>
            <p>The largest number in the set of common factors is <strong>15</strong>.</p>

            <div class="explanation__highlight">
                <strong>Tip:</strong> Listing all factors also reveals useful information beyond the GCD — you can see <em>all</em> common factors, which is helpful when you need to find factor pairs or reduce fractions to intermediate forms. Our calculator above shows the complete list of factors for every number you enter.
            </div>

            <h3 id="method-euclids-algorithm">Method Three: Find GCD Using Euclid's Algorithm</h3>
            <p><strong>Euclid's algorithm</strong> is the most efficient method for finding the GCD of two numbers. Invented by the Greek mathematician Euclid around 300 BCE, it is one of the oldest algorithms still in everyday use. The method works by repeatedly dividing and taking remainders until the remainder reaches zero.</p>

            <p><strong>The algorithm:</strong></p>
            <ol>
                <li>Divide the larger number by the smaller number. Note the <strong>remainder</strong>.</li>
                <li>If the remainder is <strong>0</strong>, the divisor in this step is the GCD. Stop here.</li>
                <li>If the remainder is <strong>not 0</strong>, replace the larger number with the previous divisor, and the smaller number with the remainder. Go back to step 1.</li>
            </ol>

            <p><strong>Example: Find the GCD of 90 and 165 using Euclid's algorithm.</strong></p>
            <ul>
                <li><strong>Step 1:</strong> 165 ÷ 90 = 1 remainder <strong>75</strong></li>
                <li><strong>Step 2:</strong> 90 ÷ 75 = 1 remainder <strong>15</strong></li>
                <li><strong>Step 3:</strong> 75 ÷ 15 = 5 remainder <strong>0</strong></li>
            </ul>
            <p>The remainder is 0, so the divisor in this final step — <strong>15</strong> — is the GCD.</p>

            <div class="explanation__highlight">
                <strong>Why Euclid's algorithm is powerful:</strong> It works in O(log n) steps, meaning it can find the GCD of numbers with hundreds of digits almost instantly. This efficiency is why it is used in modern cryptography (RSA encryption), computer science, and engineering. Our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> uses the same division-and-remainder process.
            </div>

            <h2 id="gcd-and-lcm-relationship">The Relationship Between GCD and LCM</h2>
            <p>The GCD and <a href="/math-calculators/lcm-calculator">LCM (Least Common Multiple)</a> are deeply connected by a simple formula:</p>
            <p><strong>GCD(a, b) × LCM(a, b) = a × b</strong></p>
            <p>This means once you know the GCD, you can instantly calculate the LCM:</p>
            <p><strong>LCM(a, b) = (a × b) / GCD(a, b)</strong></p>
            <p>For example: GCD(90, 165) = 15, so LCM(90, 165) = (90 × 165) / 15 = 14,850 / 15 = <strong>990</strong>.</p>
            <p>The LCM is essential when you need to <a href="/math-calculators/fraction-calculator">add or subtract fractions</a> with different denominators — the LCD (Least Common Denominator) is simply the LCM of the denominators.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the difference between GCD, GCF, and HCF?</h3>
            <p>They are all <strong>different names for the same concept</strong> — the largest number that divides two or more numbers without a remainder. <strong>GCD</strong> (Greatest Common Divisor) is the term most commonly used in university-level mathematics and computer science. <strong>GCF</strong> (Greatest Common Factor) is the preferred term in American K-12 education. <strong>HCF</strong> (Highest Common Factor) is widely used in British, Indian, and Australian math education. All three terms are interchangeable.</p>

            <h3>How do I find the GCD of more than two numbers?</h3>
            <p>Apply the GCD function iteratively. First find the GCD of the first two numbers, then find the GCD of that result with the third number, and continue until all numbers have been processed. For example:</p>
            <p>GCD(12, 18, 24) = GCD(GCD(12, 18), 24) = GCD(6, 24) = <strong>6</strong></p>
            <p>Our calculator above handles any number of inputs — just enter them separated by commas.</p>

            <h3>What is the greatest common divisor used for?</h3>
            <p>The GCD has many practical applications:</p>
            <ul>
                <li><strong>Simplifying fractions:</strong> Divide both numerator and denominator by their GCD. For example, 48/36 → divide both by GCD(48,36) = 12 → simplified to 4/3. Use our <a href="/math-calculators/fraction-calculator">Fraction Calculator</a> to simplify fractions automatically.</li>
                <li><strong>Finding the LCM:</strong> LCM(a,b) = (a × b) / GCD(a,b). The <a href="/math-calculators/lcm-calculator">LCM Calculator</a> uses this relationship.</li>
                <li><strong>Tiling problems:</strong> The largest square tile that fits perfectly into a rectangular room of dimensions a × b (with no cutting) has a side length equal to GCD(a, b).</li>
                <li><strong>Gear ratios:</strong> In mechanical engineering, the GCD determines the simplest gear ratio between two gears.</li>
                <li><strong>Cryptography:</strong> RSA encryption — the foundation of internet security — relies heavily on GCD computations and Euclid's extended algorithm.</li>
            </ul>

            <h3>Can the GCD ever be 1?</h3>
            <p>Yes. When the GCD of two numbers is 1, the numbers are called <strong>coprime</strong> (or <em>relatively prime</em>). This means they share no common factors other than 1. Examples: GCD(8, 15) = 1, GCD(7, 13) = 1, GCD(25, 36) = 1. Two consecutive integers are always coprime.</p>

            <h3>Is there a GCD function on scientific calculators?</h3>
            <p>Many scientific calculators have a built-in GCD or "gcd" function. On the TI-84, use <code>math → NUM → gcd(</code>. On Casio calculators, the function is often under the MATH menu. Online tools like our GCD Calculator above provide step-by-step solutions that physical calculators typically do not show.</p>
        `,
        formula: {
            formula: "GCD(a, b) = GCD(b, a mod b), repeat until b = 0",
            variables: [
                { symbol: "a", meaning: "The larger of the two numbers" },
                { symbol: "b", meaning: "The smaller of the two numbers" },
                { symbol: "a mod b", meaning: "The remainder when a is divided by b" },
                { symbol: "GCD = a", meaning: "When b reaches 0, the current value of a is the GCD" },
            ],
            example: [
                { label: "GCD(90, 165) — Step 1", substitution: "165 ÷ 90 = 1 R 75 → GCD(90, 75)", result: "Continue…" },
                { label: "Step 2", substitution: "90 ÷ 75 = 1 R 15 → GCD(75, 15)", result: "Continue…" },
                { label: "Step 3", substitution: "75 ÷ 15 = 5 R 0 → STOP", result: "GCD = 15" },
            ],
        },
        relatedCalculators: [
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find the least common multiple — uses GCD internally" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Simplify fractions by dividing by GCD" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Division with remainder — the core of Euclid's algorithm" },
            { title: "Factorial Calculator", slug: "factorial-calculator", categorySlug: "math-calculators", description: "Calculate n! for permutations and combinations" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Express ratios and proportions as percentages" },
        ],
    },

    /* ─── 4. LCM CALCULATOR ─── */
    "lcm-calculator": {
        subtitle: "Find the Least Common Multiple (LCM) of two or more numbers. See step-by-step calculation using prime factorization and the GCD method.",
        explanation: {
            heading: "What is the Least Common Multiple (LCM)?",
            paragraphs: [
                "The Least Common Multiple (LCM) of two or more integers is the smallest positive integer that is divisible by all of them. For example, the LCM of 4 and 6 is 12, because 12 is the smallest number that both 4 and 6 divide into evenly.",
                "There are three common methods to find the LCM: (1) Listing multiples of each number until you find the first common one — simple but slow for large numbers. (2) Prime factorization — decompose each number into primes, then take the highest power of each prime. (3) Using the GCD formula: LCM(a,b) = |a×b| / GCD(a,b) — the most efficient method, and the one our calculator uses.",
                "The LCM is essential for adding and subtracting fractions (finding the least common denominator), scheduling problems (when will two events coincide?), and modular arithmetic. In real life, the LCM appears in gear systems, traffic light timing, and any situation where two periodic events need to synchronize.",
            ],
            highlight: "LCM(12, 18): GCD = 6, so LCM = (12 × 18) / 6 = 216 / 6 = 36. The first common multiple is 36.",
        },
        formula: {
            formula: "LCM(a, b) = |a × b| / GCD(a, b)",
            variables: [
                { symbol: "a, b", meaning: "The two numbers" },
                { symbol: "GCD(a,b)", meaning: "Greatest Common Divisor of a and b" },
                { symbol: "|a × b|", meaning: "Absolute value of the product" },
            ],
            example: [
                { label: "LCM(12, 18)", substitution: "|12 × 18| / GCD(12, 18) = 216 / 6", result: "36" },
                { label: "Alt: prime factorization", substitution: "12=2²×3, 18=2×3² → 2²×3²", result: "= 36" },
            ],
        },
        faq: [
            { question: "How do I find the LCM of more than two numbers?", answer: "Find the LCM of the first two numbers, then find the LCM of that result with the third number. For example: LCM(4, 6, 10) = LCM(LCM(4, 6), 10) = LCM(12, 10) = 60." },
            { question: "What is the difference between LCM and LCD?", answer: "LCD (Least Common Denominator) is the LCM of the denominators of two or more fractions. To add 1/4 + 1/6, you need the LCD of 4 and 6, which is 12 — the same as the LCM." },
            { question: "When is LCM used in real life?", answer: "Scheduling: if Bus A comes every 12 minutes and Bus B every 18 minutes, they coincide every LCM(12,18) = 36 minutes. Gear ratios, tiling patterns, digital clock timing circuits, and event synchronization all rely on LCM calculations." },
        ],
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD (required to calculate LCM)" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Use LCM as the common denominator" },
            { title: "Factorial Calculator", slug: "factorial-calculator", categorySlug: "math-calculators", description: "Calculate factorials for combinatorics" },
        ],
    },

    /* ─── 5. QUADRATIC EQUATION SOLVER — RICH CONTENT (Topical Authority) ─── */
    "quadratic-equation-solver": {
        subtitle: "Solve any quadratic equation ax² + bx + c = 0 using the quadratic formula. See discriminant analysis, real and complex roots, exact fractions, simplified radicals, vertex, factored form, Vieta's formulas, and step-by-step solution.",
        contentHTML: `
            <h2 id="what-is-a-quadratic-equation">What Is a Quadratic Equation?</h2>
            <p>A <strong>quadratic equation</strong> is any polynomial equation of the <strong>second degree</strong>, meaning the highest power of the unknown variable <em>x</em> is 2. The word "quadratic" comes from the Latin <em>quadratus</em>, meaning "square," because the equation involves squaring a variable.</p>
            <p>Every quadratic equation can be written in <strong>standard form</strong>:</p>
            <div class="explanation__highlight">
                <strong>ax² + bx + c = 0</strong>
            </div>
            <p>Where:</p>
            <table>
                <thead><tr><th>Coefficient</th><th>Name</th><th>Role</th><th>Constraint</th></tr></thead>
                <tbody>
                    <tr><td><strong>a</strong></td><td>Quadratic coefficient</td><td>Determines the width and direction of the parabola</td><td>a ≠ 0 (otherwise it's linear)</td></tr>
                    <tr><td><strong>b</strong></td><td>Linear coefficient</td><td>Shifts the vertex horizontally</td><td>Can be any real number</td></tr>
                    <tr><td><strong>c</strong></td><td>Constant term</td><td>The y-intercept of the parabola</td><td>Can be any real number</td></tr>
                </tbody>
            </table>
            <p>Examples of quadratic equations: <strong>x² − 5x + 6 = 0</strong>, <strong>2x² + 3x − 2 = 0</strong>, <strong>x² + 1 = 0</strong> (complex roots). An equation like 3x + 5 = 0 is <em>not</em> quadratic because the highest power is 1 (it's linear).</p>

            <h2 id="the-quadratic-formula">The Quadratic Formula</h2>
            <p>The <strong>quadratic formula</strong> provides a direct way to find the solutions (roots) of any quadratic equation. It is one of the most important formulas in algebra:</p>
            <div class="explanation__highlight">
                <strong>x = (−b ± √(b² − 4ac)) / 2a</strong>
            </div>
            <p>This formula works for <em>every</em> quadratic equation — whether the roots are rational, irrational, or complex. The "±" symbol means there are two solutions: one using addition and one using subtraction.</p>

            <h3 id="deriving-the-quadratic-formula">Derivation from Completing the Square</h3>
            <p>The quadratic formula isn't magic — it is derived by applying the <strong>completing the square</strong> technique to the general equation ax² + bx + c = 0:</p>
            <ol>
                <li><strong>Start:</strong> ax² + bx + c = 0</li>
                <li><strong>Divide by a:</strong> x² + (b/a)x + c/a = 0</li>
                <li><strong>Move constant:</strong> x² + (b/a)x = −c/a</li>
                <li><strong>Complete the square:</strong> Add (b/2a)² to both sides: x² + (b/a)x + (b/2a)² = (b/2a)² − c/a</li>
                <li><strong>Factor left side:</strong> (x + b/2a)² = (b² − 4ac) / 4a²</li>
                <li><strong>Take square root:</strong> x + b/2a = ±√(b² − 4ac) / 2a</li>
                <li><strong>Solve for x:</strong> x = (−b ± √(b² − 4ac)) / 2a ✓</li>
            </ol>
            <p>This derivation is a standard topic in <strong>Algebra I and Algebra II</strong> courses across the United States and appears on the <strong>SAT, ACT, and GRE</strong> math sections.</p>

            <h2 id="understanding-the-discriminant">Understanding the Discriminant (Δ)</h2>
            <p>The expression under the square root — <strong>Δ = b² − 4ac</strong> — is called the <strong>discriminant</strong>. It determines the <em>nature and number</em> of solutions without actually solving the equation:</p>
            <table>
                <thead><tr><th>Discriminant Value</th><th>Number of Roots</th><th>Type of Roots</th><th>Graph Behavior</th></tr></thead>
                <tbody>
                    <tr><td><strong>Δ &gt; 0</strong> (positive)</td><td>2</td><td>Two distinct real roots</td><td>Parabola crosses x-axis at two points</td></tr>
                    <tr><td><strong>Δ = 0</strong></td><td>1</td><td>One repeated (double) root</td><td>Parabola touches x-axis at vertex</td></tr>
                    <tr><td><strong>Δ &lt; 0</strong> (negative)</td><td>0 real / 2 complex</td><td>Two complex conjugate roots</td><td>Parabola does not cross x-axis</td></tr>
                </tbody>
            </table>
            <p>Additionally, when Δ is a <strong>perfect square</strong> (like 1, 4, 9, 16, 25, …), the roots are <em>rational numbers</em> and the equation can be factored over the integers. Our calculator above automatically detects this and shows the <strong>exact fraction form</strong> and <strong>factored form</strong> when applicable.</p>

            <h2 id="three-solving-methods">Three Methods for Solving Quadratic Equations</h2>
            <p>There are three standard methods for solving quadratic equations. Each has advantages depending on the equation:</p>
            <table>
                <thead><tr><th>Method</th><th>Best For</th><th>Pros</th><th>Cons</th></tr></thead>
                <tbody>
                    <tr><td><strong>Factoring</strong></td><td>Simple integer roots</td><td>Fastest when applicable; no calculator needed</td><td>Only works when roots are rational</td></tr>
                    <tr><td><strong>Quadratic Formula</strong></td><td>Any quadratic equation</td><td>Universal — works for all cases including complex roots</td><td>More arithmetic steps</td></tr>
                    <tr><td><strong>Completing the Square</strong></td><td>Converting to vertex form</td><td>Reveals vertex; foundation for deriving the formula</td><td>Tedious for non-unit leading coefficients</td></tr>
                </tbody>
            </table>
            <p><strong>Pro tip:</strong> Always check the discriminant first. If Δ is a perfect square, try factoring. If not, go straight to the quadratic formula. Our calculator uses the <a href="/math-calculators/quadratic-equation-solver">quadratic formula</a> for all cases and automatically simplifies radicals and fractions.</p>

            <h2 id="worked-examples">Worked Examples</h2>

            <h3 id="example-two-real-roots">Example 1: Two Distinct Real Roots (Δ &gt; 0)</h3>
            <p><strong>Solve:</strong> x² − 5x + 6 = 0</p>
            <ol>
                <li>Identify: a = 1, b = −5, c = 6</li>
                <li>Discriminant: Δ = (−5)² − 4(1)(6) = 25 − 24 = <strong>1</strong></li>
                <li>Since Δ = 1 > 0 and is a perfect square → two rational roots</li>
                <li>x = (5 ± √1) / 2 = (5 ± 1) / 2</li>
                <li><strong>x₁ = (5 + 1) / 2 = 3</strong></li>
                <li><strong>x₂ = (5 − 1) / 2 = 2</strong></li>
            </ol>
            <p>Factored form: (x − 3)(x − 2) = 0. Verify: 3 × 2 = 6 ✓ and 3 + 2 = 5 ✓ (Vieta's formulas).</p>

            <h3 id="example-one-repeated-root">Example 2: One Repeated Root (Δ = 0)</h3>
            <p><strong>Solve:</strong> x² − 6x + 9 = 0</p>
            <ol>
                <li>Identify: a = 1, b = −6, c = 9</li>
                <li>Discriminant: Δ = (−6)² − 4(1)(9) = 36 − 36 = <strong>0</strong></li>
                <li>Since Δ = 0 → one repeated root</li>
                <li><strong>x = −(−6) / 2(1) = 6/2 = 3</strong></li>
            </ol>
            <p>Factored form: (x − 3)² = 0. The parabola touches the x-axis at its vertex (3, 0).</p>

            <h3 id="example-complex-roots">Example 3: Complex Conjugate Roots (Δ &lt; 0)</h3>
            <p><strong>Solve:</strong> x² + 2x + 5 = 0</p>
            <ol>
                <li>Identify: a = 1, b = 2, c = 5</li>
                <li>Discriminant: Δ = (2)² − 4(1)(5) = 4 − 20 = <strong>−16</strong></li>
                <li>Since Δ < 0 → two complex conjugate roots</li>
                <li>√|Δ| = √16 = 4</li>
                <li>Real part: −b/2a = −2/2 = −1</li>
                <li>Imaginary part: ±4/2 = ±2i</li>
                <li><strong>x₁ = −1 + 2i</strong>, <strong>x₂ = −1 − 2i</strong></li>
            </ol>
            <p>The parabola y = x² + 2x + 5 has its vertex at (−1, 4) and never crosses the x-axis.</p>

            <h3 id="example-word-problem">Example 4: Real-World Word Problem — Projectile Motion</h3>
            <p>A baseball is hit from a height of 3 feet with an initial upward velocity of 80 feet per second. Using the US standard gravitational acceleration (g = 32 ft/s²), the height equation is:</p>
            <div class="explanation__highlight">
                <strong>h(t) = −16t² + 80t + 3</strong>
            </div>
            <p><strong>Question:</strong> When does the ball hit the ground? (h = 0)</p>
            <ol>
                <li>Set h(t) = 0: −16t² + 80t + 3 = 0</li>
                <li>a = −16, b = 80, c = 3</li>
                <li>Δ = 80² − 4(−16)(3) = 6400 + 192 = 6592</li>
                <li>√6592 = √(64 × 103) = 8√103 ≈ 81.20</li>
                <li>t = (−80 ± 8√103) / (−32)</li>
                <li>t₁ = (−80 + 81.20) / (−32) = −0.04 s (rejected, before hit)</li>
                <li><strong>t₂ = (−80 − 81.20) / (−32) ≈ 5.04 seconds</strong></li>
            </ol>
            <p>The ball hits the ground after approximately <strong>5.04 seconds</strong>. Our calculator shows the exact form using simplified radicals — try entering a = −16, b = 80, c = 3.</p>

            <h2 id="complex-roots-imaginary-numbers">Complex Roots & Imaginary Numbers</h2>
            <p>When the discriminant is negative (Δ < 0), the square root of a negative number is required. This introduces the <strong>imaginary unit</strong>:</p>
            <div class="explanation__highlight">
                <strong>i = √(−1)</strong>
            </div>
            <p>A <strong>complex number</strong> has the form <strong>a + bi</strong>, where <em>a</em> is the real part and <em>b</em> is the imaginary part. Complex roots of quadratic equations always come in <strong>conjugate pairs</strong>: if <em>a + bi</em> is a root, then <em>a − bi</em> is also a root.</p>
            <p>Complex numbers are not just mathematical abstractions — they are essential in <strong>electrical engineering</strong> (AC circuit analysis uses impedance as a complex number), <strong>signal processing</strong> (Fourier transforms), <strong>quantum mechanics</strong>, and <strong>control theory</strong>.</p>

            <h2 id="vertex-parabola-properties">Vertex & Parabola Properties</h2>
            <p>Every quadratic equation y = ax² + bx + c graphs as a <strong>parabola</strong>. Key properties:</p>
            <table>
                <thead><tr><th>Property</th><th>Formula</th><th>Meaning</th></tr></thead>
                <tbody>
                    <tr><td><strong>Vertex</strong></td><td>(h, k) where h = −b/2a, k = c − b²/4a</td><td>The highest or lowest point of the parabola</td></tr>
                    <tr><td><strong>Axis of Symmetry</strong></td><td>x = −b/2a</td><td>The vertical line through the vertex</td></tr>
                    <tr><td><strong>Direction</strong></td><td>a > 0 → opens up; a < 0 → opens down</td><td>Determines if vertex is a minimum or maximum</td></tr>
                    <tr><td><strong>Y-intercept</strong></td><td>(0, c)</td><td>Where the parabola crosses the y-axis</td></tr>
                    <tr><td><strong>Vertex Form</strong></td><td>y = a(x − h)² + k</td><td>Alternative form revealing the vertex directly</td></tr>
                </tbody>
            </table>
            <p>Our calculator displays the vertex, axis of symmetry, y-intercept, and factored form (when roots are rational) for complete parabola analysis. For related geometry calculations, see our <a href="/math-calculators/area-calculator">Area Calculator</a>.</p>

            <h2 id="real-world-applications">Real-World Applications of Quadratic Equations (USA Focus)</h2>
            <p>Quadratic equations appear throughout science, engineering, business, and everyday life:</p>

            <h3 id="physics-projectile-motion">Physics — Projectile Motion</h3>
            <p>In the United States, physics courses use the equation <strong>h(t) = −16t² + v₀t + h₀</strong> (in feet, using g = 32 ft/s²) or <strong>h(t) = −4.9t² + v₀t + h₀</strong> (in meters). This is the basis for calculating the trajectory of a thrown baseball, a launched rocket, or a basketball shot. The roots of the equation tell you <em>when</em> the object hits the ground.</p>

            <h3 id="business-optimization">Business — Profit Optimization</h3>
            <p>Revenue and profit functions are often quadratic: <strong>P(x) = −ax² + bx − c</strong>, where x is the quantity produced. The vertex gives the <strong>maximum profit point</strong> — the optimal quantity to produce. This is taught in MBA programs and <a href="/business-calculators/ebitda-calculator">business finance</a> courses across the US.</p>

            <h3 id="engineering-architecture">Engineering & Architecture</h3>
            <p>Parabolic shapes appear in satellite dishes, headlight reflectors, suspension bridge cables, and the famous <strong>Gateway Arch</strong> in St. Louis (which is actually a catenary, closely related to a parabola). Engineers use quadratic equations to design these structures, calculate load distributions, and model stress curves.</p>

            <h3 id="sports-analytics">Sports Analytics</h3>
            <p>In American football, the trajectory of a field goal kick follows a parabolic path. Coaches and analysts use quadratic models to determine the optimal launch angle and initial velocity for maximum distance or to clear the crossbar at 10 feet high.</p>

            <h2 id="the-golden-ratio">The Golden Ratio — Derived from a Quadratic</h2>
            <p>One of mathematics' most famous numbers — the <strong>golden ratio</strong> φ (phi) — comes from solving a quadratic equation. If we want to split a line segment into two pieces where the ratio of the whole to the longer piece equals the ratio of the longer to the shorter:</p>
            <div class="explanation__highlight">
                <strong>φ² − φ − 1 = 0 → φ = (1 + √5) / 2 ≈ 1.61803...</strong>
            </div>
            <p>The golden ratio appears in:</p>
            <ul>
                <li><strong>Fibonacci sequence:</strong> The ratio of consecutive Fibonacci numbers approaches φ</li>
                <li><strong>Regular pentagons:</strong> The diagonal-to-side ratio equals φ</li>
                <li><strong>Art & architecture:</strong> The Parthenon, Leonardo da Vinci's works, and modern design</li>
                <li><strong>Nature:</strong> Spiral patterns in sunflowers, pinecones, and nautilus shells</li>
            </ul>
            <p>Try it in our calculator: enter a = 1, b = −1, c = −1. You'll get x₁ ≈ 1.618034 (the golden ratio) and x₂ ≈ −0.618034.</p>

            <h2 id="vietas-formulas">Vieta's Formulas — Sum & Product of Roots</h2>
            <p><strong>Vieta's formulas</strong> provide a direct relationship between the roots and the coefficients of a quadratic equation, without actually solving for the roots:</p>
            <table>
                <thead><tr><th>Formula</th><th>Relationship</th><th>Example: x² − 5x + 6 = 0 (roots: 2, 3)</th></tr></thead>
                <tbody>
                    <tr><td><strong>Sum of roots</strong></td><td>x₁ + x₂ = −b/a</td><td>2 + 3 = 5 = −(−5)/1 ✓</td></tr>
                    <tr><td><strong>Product of roots</strong></td><td>x₁ · x₂ = c/a</td><td>2 × 3 = 6 = 6/1 ✓</td></tr>
                </tbody>
            </table>
            <p>These formulas are invaluable for <strong>checking your work</strong> and for constructing quadratic equations when you know the desired roots. Our calculator displays both Vieta's values automatically. For working with fractions in these calculations, use our <a href="/math-calculators/fraction-calculator">Fraction Calculator</a>.</p>

            <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
            <p>Students frequently make these errors when solving quadratic equations:</p>
            <ol>
                <li><strong>Forgetting the ± symbol:</strong> The formula gives <em>two</em> solutions. Always calculate both the + and − cases.</li>
                <li><strong>Sign errors with b:</strong> If b is negative, −b becomes positive. Be careful with double negatives: −(−5) = +5.</li>
                <li><strong>Dividing by 2a, not 2:</strong> The denominator is <strong>2a</strong>, not just 2. For the equation 3x² + 6x + 2 = 0, the denominator is 2(3) = 6.</li>
                <li><strong>Forgetting that a ≠ 0:</strong> If a = 0, it's a linear equation, not quadratic. Solve with x = −c/b instead.</li>
                <li><strong>Not simplifying radicals:</strong> √50 should be simplified to 5√2. Our calculator handles this automatically.</li>
                <li><strong>Applying the formula to non-standard form:</strong> Always rearrange the equation to ax² + bx + c = 0 first. Move all terms to one side before identifying a, b, and c.</li>
            </ol>
            <p>Use our <a href="/math-calculators/exponent-calculator">Exponent Calculator</a> when squaring the b coefficient, and our <a href="/math-calculators/gcd-calculator">GCD Calculator</a> to simplify fraction results.</p>

            <h2 id="related-algebraic-concepts">Related Algebraic Concepts</h2>
            <ul>
                <li><strong><a href="/math-calculators/percentage-calculator">Percentage Calculator</a>:</strong> Express discriminant ratios or root proportions as percentages</li>
                <li><strong><a href="/math-calculators/exponent-calculator">Exponent Calculator</a>:</strong> Compute powers needed for discriminant calculations (b²)</li>
                <li><strong><a href="/math-calculators/fraction-calculator">Fraction Calculator</a>:</strong> Simplify the fractional roots returned by the quadratic formula</li>
                <li><strong><a href="/math-calculators/gcd-calculator">GCD Calculator</a>:</strong> Find the GCD to reduce fractions and simplify radicals</li>
                <li><strong><a href="/math-calculators/standard-deviation-calculator">Standard Deviation Calculator</a>:</strong> Analyze distributions related to quadratic models</li>
                <li><strong><a href="/glossary/quadratic-equation">Glossary: Quadratic Equation</a>:</strong> Full reference with discriminant table and solving methods compared</li>
            </ul>
        `,
        formula: {
            formula: "x = (−b ± √(b² − 4ac)) / 2a",
            variables: [
                { symbol: "a", meaning: "Coefficient of x² (the quadratic coefficient, must not be zero)" },
                { symbol: "b", meaning: "Coefficient of x (the linear coefficient)" },
                { symbol: "c", meaning: "Constant term (the y-intercept of the parabola)" },
                { symbol: "Δ = b²−4ac", meaning: "Discriminant — determines the nature and number of roots" },
            ],
            example: [
                { label: "Solve x² − 5x + 6 = 0", substitution: "x = (5 ± √(25−24)) / 2 = (5 ± 1) / 2", result: "x₁ = 3, x₂ = 2" },
                { label: "Solve 2x² − 7x + 3 = 0", substitution: "x = (7 ± √(49−24)) / 4 = (7 ± 5) / 4", result: "x₁ = 3, x₂ = 1/2" },
                { label: "Golden ratio: x² − x − 1 = 0", substitution: "x = (1 ± √5) / 2", result: "x₁ ≈ 1.618, x₂ ≈ −0.618" },
            ],
        },
        faq: [
            { question: "What is the quadratic formula?", answer: "The quadratic formula is x = (−b ± √(b² − 4ac)) / 2a. It provides the exact solutions to any quadratic equation ax² + bx + c = 0, regardless of whether the roots are rational, irrational, or complex. It is derived by completing the square on the general quadratic equation." },
            { question: "How does the discriminant determine the type of roots?", answer: "The discriminant Δ = b² − 4ac tells you: (1) Δ > 0 means two distinct real roots — if Δ is a perfect square, the roots are rational; (2) Δ = 0 means one repeated (double) root; (3) Δ < 0 means two complex conjugate roots involving the imaginary unit i = √(−1). Always check the discriminant before choosing a solving method." },
            { question: "What are complex roots in a quadratic equation?", answer: "Complex roots occur when the discriminant is negative. They involve the imaginary unit i = √(−1) and always come in conjugate pairs: a + bi and a − bi. For example, x² + 1 = 0 has roots x = i and x = −i. Complex numbers are essential in electrical engineering, signal processing, and quantum mechanics." },
            { question: "When should I use factoring vs the quadratic formula?", answer: "Try factoring first when the discriminant is a perfect square — this means the roots are rational and the equation factors easily. Example: x² − 5x + 6 = (x−2)(x−3). If the equation doesn't factor easily, use the quadratic formula. The formula works universally for all quadratic equations." },
            { question: "How do I complete the square?", answer: "To complete the square for x² + bx: (1) Take half of b: b/2. (2) Square it: (b/2)². (3) Add and subtract this value: x² + bx + (b/2)² − (b/2)² = (x + b/2)² − (b/2)². For example: x² + 6x = x² + 6x + 9 − 9 = (x + 3)² − 9. This technique is used to derive the quadratic formula and to convert to vertex form." },
            { question: "What is the vertex form of a quadratic equation?", answer: "The vertex form is y = a(x − h)² + k, where (h, k) is the vertex of the parabola. Convert from standard form using h = −b/(2a) and k = c − b²/(4a). The vertex form immediately reveals the maximum or minimum point and the axis of symmetry x = h." },
            { question: "Can a quadratic equation have no solution?", answer: "In the real number system, a quadratic equation has no real solutions when Δ < 0. However, every quadratic equation always has exactly two solutions in the complex number system (counting multiplicity). The Fundamental Theorem of Algebra guarantees that a polynomial of degree n has exactly n roots over the complex numbers." },
            { question: "What are Vieta's formulas for quadratic equations?", answer: "Vieta's formulas relate the roots to the coefficients: (1) Sum of roots: x₁ + x₂ = −b/a. (2) Product of roots: x₁ × x₂ = c/a. These formulas work even for complex roots and are useful for checking solutions or constructing equations from known roots." },
            { question: "How are quadratic equations used in physics?", answer: "In US physics courses, projectile motion uses h(t) = −16t² + v₀t + h₀ (in feet). Setting h = 0 gives a quadratic equation whose positive root is the time when the object hits the ground. Quadratics also model kinetic energy (½mv²), spring force (F = kx²), and gravitational potential energy problems." },
            { question: "What is the golden ratio and how is it related to quadratics?", answer: "The golden ratio φ ≈ 1.618 is the solution to the quadratic equation φ² − φ − 1 = 0. Using the quadratic formula: φ = (1 + √5) / 2. It appears in the Fibonacci sequence, regular pentagons, Renaissance art, and natural spiral patterns. It's sometimes called the 'divine proportion.'" },
        ],
        relatedCalculators: [
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate b² for the discriminant" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Simplify fractional roots from the formula" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify radicals and fraction results" },
            { title: "Standard Deviation", slug: "standard-deviation-calculator", categorySlug: "math-calculators", description: "Analyze data modeled by quadratic functions" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Express mathematical relationships as percentages" },
        ],
    },

    /* ─── 6. EXPONENT CALCULATOR ─── */
    "exponent-calculator": {
        subtitle: "Calculate any base raised to any power — including negative, fractional, and zero exponents. See the exponent laws and step-by-step explanation.",
        explanation: {
            heading: "What are Exponents and How Do They Work?",
            paragraphs: [
                "An exponent (also called a power or index) tells you how many times to multiply a number by itself. In the expression bⁿ, b is the base and n is the exponent. For example, 2⁵ = 2×2×2×2×2 = 32. Exponents are a compact notation for repeated multiplication, just as multiplication is a compact notation for repeated addition.",
                "Key exponent rules: (1) Any number to the power of 0 is 1 (except 0⁰, which is undefined in some contexts). (2) Negative exponents represent reciprocals: b⁻ⁿ = 1/bⁿ. (3) Fractional exponents represent roots: b^(1/n) = ⁿ√b, and b^(m/n) = ⁿ√(bᵐ). (4) Product rule: bᵐ × bⁿ = bᵐ⁺ⁿ. (5) Quotient rule: bᵐ ÷ bⁿ = bᵐ⁻ⁿ. (6) Power of a power: (bᵐ)ⁿ = bᵐⁿ.",
                "Exponents appear everywhere in science and mathematics: compound interest (A = P(1+r)ᵗ), population growth, radioactive decay, pH scale (powers of 10), computing (binary powers of 2), and the decibel scale for sound. Understanding exponent rules is crucial for algebra, calculus, and applied mathematics.",
            ],
            highlight: "2¹⁰ = 1,024. 10⁶ = 1,000,000 (one million). 5⁻² = 1/25 = 0.04. 8^(1/3) = ³√8 = 2 (cube root).",
        },
        formula: {
            formula: "bⁿ = b × b × b × ... × b  (n times)",
            variables: [
                { symbol: "b", meaning: "The base number" },
                { symbol: "n", meaning: "The exponent (power)" },
                { symbol: "b⁰ = 1", meaning: "Zero exponent rule (b ≠ 0)" },
                { symbol: "b⁻ⁿ = 1/bⁿ", meaning: "Negative exponent = reciprocal" },
            ],
            example: [
                { label: "2¹⁰", substitution: "2×2×2×2×2×2×2×2×2×2", result: "1,024" },
                { label: "5⁻³", substitution: "1 / 5³ = 1 / 125", result: "0.008" },
            ],
        },
        faq: [
            { question: "What is any number to the power of 0?", answer: "Any non-zero number raised to the power of 0 equals 1. This follows from the quotient rule: bⁿ / bⁿ = b⁰ = 1. The expression 0⁰ is considered indeterminate in analysis, though in combinatorics it is often defined as 1 by convention." },
            { question: "How do negative exponents work?", answer: "A negative exponent means 'take the reciprocal.' b⁻ⁿ = 1/bⁿ. For example, 2⁻³ = 1/2³ = 1/8 = 0.125. Think of it as dividing by the base n times instead of multiplying." },
            { question: "What does a fractional exponent mean?", answer: "A fractional exponent b^(m/n) means take the nth root of b raised to the mth power. So 8^(2/3) = (³√8)² = 2² = 4. The denominator is the root, and the numerator is the power." },
        ],
        relatedCalculators: [
            { title: "Factorial Calculator", slug: "factorial-calculator", categorySlug: "math-calculators", description: "Calculate factorials (n!)" },
            { title: "Quadratic Solver", slug: "quadratic-equation-solver", categorySlug: "math-calculators", description: "Solve equations involving x²" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Percentage and ratio calculations" },
            { title: "Compound Interest", slug: "compound-interest-calculator", categorySlug: "utility-calculators", description: "Apply exponential growth to finance" },
        ],
    },

    /* ─── 7. FACTORIAL CALCULATOR ─── */
    "factorial-calculator": {
        subtitle: "Calculate n! (n factorial) for any non-negative integer. See the full expansion, digit count, and applications in permutations and combinations.",
        explanation: {
            heading: "What is a Factorial and What is it Used For?",
            paragraphs: [
                "The factorial of a non-negative integer n, written as n!, is the product of all positive integers from 1 to n. For example, 5! = 5 × 4 × 3 × 2 × 1 = 120. By convention, 0! = 1. Factorials grow extraordinarily fast — 10! = 3,628,800 and 20! = 2,432,902,008,176,640,000 (over 2.4 quintillion).",
                "Factorials are the foundation of combinatorics — the mathematics of counting. Permutations (ordered arrangements) use the formula P(n,r) = n!/(n−r)!, and combinations (unordered selections) use C(n,r) = n!/(r!(n−r)!). These formulas appear in probability theory, statistics, computer science algorithms, and even card games and lottery calculations.",
                "Stirling's approximation (n! ≈ √(2πn) × (n/e)ⁿ) is used to estimate factorials of very large numbers. The gamma function Γ(n) = (n−1)! extends factorials to non-integer and even complex numbers, which is essential in advanced mathematics, physics, and engineering.",
            ],
            highlight: "10! = 3,628,800. This means there are 3,628,800 different ways to arrange 10 distinct objects in a line. And 52! (shuffled deck of cards) has 80 digits!",
        },
        formula: {
            formula: "n! = n × (n−1) × (n−2) × ... × 2 × 1",
            variables: [
                { symbol: "n!", meaning: "Product of all positive integers from 1 to n" },
                { symbol: "0!", meaning: "Defined as 1 (by convention)" },
                { symbol: "P(n,r)", meaning: "Permutations = n!/(n−r)!" },
                { symbol: "C(n,r)", meaning: "Combinations = n!/(r!(n−r)!)" },
            ],
            example: [
                { label: "6!", substitution: "6 × 5 × 4 × 3 × 2 × 1", result: "720" },
                { label: "C(10, 3) — choose 3 from 10", substitution: "10! / (3! × 7!) = 720/(6×5040)", result: "120 ways" },
            ],
        },
        faq: [
            { question: "Why is 0! equal to 1?", answer: "There is exactly one way to arrange zero objects — do nothing. Mathematically, it follows from the recursive definition: n! = n × (n−1)!, so 1! = 1 × 0!, which means 0! must equal 1 for consistency. It also makes combinatorial formulas like C(n,0) = n!/(0!×n!) = 1 work correctly." },
            { question: "What is the largest factorial a calculator can compute?", answer: "Standard JavaScript (and most programming languages using 64-bit floating-point) can represent up to 170! ≈ 7.26 × 10³⁰⁶. Beyond 170!, the result exceeds the maximum representable number (Infinity). For larger values, arbitrary-precision libraries (BigInt) are needed." },
            { question: "What is the difference between permutations and combinations?", answer: "Permutations count ordered arrangements (ABC ≠ BAC), while combinations count unordered selections (ABC = BAC). Use permutations for rankings, sequences, and passwords. Use combinations for teams, committees, and lottery numbers. P(n,r) = n!/(n−r)!, C(n,r) = n!/(r!(n−r)!)." },
        ],
        relatedCalculators: [
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers and exponential growth" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Greatest common divisor" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Probability as percentages" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate statistical averages" },
        ],
    },

    /* ─── 8. AVERAGE CALCULATOR ─── */
    "average-calculator": {
        subtitle: "Calculate the mean, median, mode, range, and sum of any set of numbers. Paste or type your data for instant descriptive statistics.",
        explanation: {
            heading: "Understanding Mean, Median, and Mode — Three Types of Averages",
            paragraphs: [
                "The arithmetic mean is what most people think of as 'the average' — add up all the numbers and divide by the count. The mean is sensitive to outliers: a single extreme value can significantly shift it. For example, the mean of {1, 2, 3, 4, 100} is 22, even though most values are below 5.",
                "The median is the middle value when the data is sorted in order. If there is an even number of values, the median is the average of the two middle values. The median is resistant to outliers, making it a better measure of central tendency for skewed data. For example, the median of {1, 2, 3, 4, 100} is 3 — much more representative of the typical value.",
                "The mode is the most frequently occurring value in a dataset. A dataset can have no mode (all values unique), one mode (unimodal), or multiple modes (bimodal, multimodal). The range is the difference between the maximum and minimum values — a simple measure of data spread. Together, mean, median, mode, and range provide a quick profile of any dataset.",
            ],
            highlight: "Data: 10, 20, 30, 40, 50, 30 → Mean = 30, Median = 30, Mode = 30 (appears twice), Range = 40, Sum = 180.",
        },
        formula: {
            formula: "Mean = Σxᵢ / n",
            variables: [
                { symbol: "Σxᵢ", meaning: "Sum of all values" },
                { symbol: "n", meaning: "Number of values" },
                { symbol: "Median", meaning: "Middle value of sorted data" },
                { symbol: "Mode", meaning: "Most frequently occurring value" },
            ],
            example: [
                { label: "Mean of {5, 10, 15, 20, 25}", substitution: "(5+10+15+20+25) / 5 = 75/5", result: "Mean = 15" },
                { label: "Median of {3, 7, 9, 12, 15}", substitution: "Middle value (3rd of 5)", result: "Median = 9" },
            ],
        },
        faq: [
            { question: "When should I use mean vs median?", answer: "Use the mean for normally distributed (symmetric) data. Use the median when data is skewed or has outliers — such as income data, house prices, or exam scores with a few extreme values. The median gives a more representative 'typical' value in these cases." },
            { question: "Can a dataset have more than one mode?", answer: "Yes. A dataset with two modes is called bimodal, and one with multiple modes is multimodal. For example, {1, 2, 2, 3, 3, 4} has two modes: 2 and 3. If all values appear the same number of times, the dataset has no mode." },
            { question: "What is the relationship between mean, median, and mode in a skewed distribution?", answer: "In a right-skewed (positive skew) distribution: mean > median > mode. In a left-skewed (negative skew) distribution: mean < median < mode. In a perfectly symmetric distribution: mean = median = mode." },
        ],
        relatedCalculators: [
            { title: "Standard Deviation", slug: "standard-deviation-calculator", categorySlug: "math-calculators", description: "Measure data variability beyond range" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Express values as percentages" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Mean as a fraction" },
            { title: "Long Division", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Manual division for mean calculation" },
        ],
    },

    /* ─── 9. STANDARD DEVIATION CALCULATOR ─── */
    "standard-deviation-calculator": {
        subtitle: "Calculate population and sample standard deviation, variance, mean, and more from any dataset. See step-by-step calculation with formulas explained.",
        explanation: {
            heading: "What is Standard Deviation and Why Does It Matter?",
            paragraphs: [
                "Standard deviation measures how spread out the values in a dataset are from the mean. A low standard deviation means the data points are clustered close to the mean; a high standard deviation means they are spread out over a wider range. It is the most widely used measure of variability in statistics.",
                "There are two versions: Population standard deviation (σ) divides by N (the total population size), and Sample standard deviation (s) divides by N−1 (using Bessel's correction to provide an unbiased estimate). Use population SD when you have data for the entire group you're studying. Use sample SD when your data is a sample drawn from a larger population — which is the more common scenario in research.",
                "Standard deviation is critical in science, finance, quality control, and data analysis. In finance, it measures investment risk (volatility). In manufacturing, it underpins Six Sigma quality standards. In science, it determines whether experimental results are statistically significant. The 68-95-99.7 rule states that in a normal distribution, 68% of data falls within 1 SD of the mean, 95% within 2 SDs, and 99.7% within 3 SDs.",
            ],
            highlight: "Data: 4, 8, 6, 5, 3, 7, 9, 2 → Mean = 5.50, Population SD (σ) ≈ 2.29, Sample SD (s) ≈ 2.45. Most values fall between 3.05 and 7.95 (within 1 SD).",
        },
        formula: {
            formula: "σ = √[Σ(xᵢ − x̄)² / N]",
            variables: [
                { symbol: "σ", meaning: "Population standard deviation" },
                { symbol: "s", meaning: "Sample standard deviation (divide by N−1)" },
                { symbol: "xᵢ", meaning: "Each data value" },
                { symbol: "x̄", meaning: "Mean (average) of the data" },
                { symbol: "N", meaning: "Number of data points" },
            ],
            example: [
                { label: "Data: {2, 4, 4, 4, 5, 5, 7, 9}", substitution: "Mean = 5, Σ(xᵢ−5)² = 32", result: "σ = √(32/8) = √4 = 2" },
                { label: "Sample SD", substitution: "s = √(32/7)", result: "s ≈ 2.14" },
            ],
        },
        faq: [
            { question: "What is the difference between population and sample standard deviation?", answer: "Population SD (σ) uses N in the denominator — use when you have data for the entire population. Sample SD (s) uses N−1 (Bessel's correction) — use when your data is a sample from a larger population. The sample SD is slightly larger, compensating for the fact that a sample tends to underestimate the true population variability." },
            { question: "What does it mean if standard deviation is zero?", answer: "A standard deviation of zero means every value in the dataset is identical — there is no variability at all. For example, {5, 5, 5, 5} has SD = 0." },
            { question: "How is standard deviation used in finance?", answer: "In investing, standard deviation measures volatility — how much an asset's returns vary from its average return. A stock with 25% annual SD is more volatile (risky) than one with 10% SD. Portfolio diversification aims to reduce overall SD while maintaining expected returns." },
            { question: "What is the 68-95-99.7 rule?", answer: "For normally distributed data: approximately 68% of values fall within 1 standard deviation of the mean, 95% within 2 standard deviations, and 99.7% within 3 standard deviations. This is also called the empirical rule and is the foundation of statistical significance testing." },
        ],
        relatedCalculators: [
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate mean, median, and mode" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Express deviations as percentages" },
            { title: "Quadratic Solver", slug: "quadratic-equation-solver", categorySlug: "math-calculators", description: "Solve equations in statistics" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate squares for variance" },
        ],
    },

    /* ─── 10. LONG DIVISION CALCULATOR ─── */
    "long-division-calculator": {
        subtitle: "Perform long division with step-by-step working. See quotient, remainder, decimal result, and each division step explained clearly.",
        explanation: {
            heading: "How to Perform Long Division — Step by Step",
            paragraphs: [
                "Long division is a method for dividing large numbers by breaking the problem into a series of easier steps. The algorithm works digit by digit: bring down the next digit of the dividend, determine how many times the divisor fits into the current number, record the quotient digit, subtract the product, and repeat until all digits have been processed.",
                "The result of long division has two parts: the quotient (how many times the divisor fits into the dividend evenly) and the remainder (what is left over). For example, 1234 ÷ 56 = 22 remainder 2, because 56 × 22 = 1232, and 1234 − 1232 = 2. The decimal result is 1234/56 = 22.0357...",
                "Long division is one of the fundamental arithmetic algorithms taught in elementary school, but it remains important in higher mathematics: polynomial long division in algebra, the Euclidean algorithm for GCD, and converting fractions to repeating decimals all rely on the same process. Our calculator shows every 'bring down' step so you can follow the method clearly.",
            ],
            highlight: "1234 ÷ 56: Bring down 1→1 (too small). Bring down 2→12 (still <56, write 0). Bring down 3→123: 56×2=112, remainder 11. Bring down 4→114: 56×2=112, remainder 2. Answer: 22 R 2.",
        },
        formula: {
            formula: "Dividend = Divisor × Quotient + Remainder",
            variables: [
                { symbol: "Dividend", meaning: "The number being divided" },
                { symbol: "Divisor", meaning: "The number dividing into the dividend" },
                { symbol: "Quotient", meaning: "The integer result of the division" },
                { symbol: "Remainder", meaning: "What is left over (0 ≤ R < Divisor)" },
            ],
            example: [
                { label: "1234 ÷ 56", substitution: "56 × 22 + 2", result: "Quotient = 22, Remainder = 2" },
                { label: "Check:", substitution: "56 × 22 + 2 = 1232 + 2", result: "= 1234 ✓" },
            ],
        },
        faq: [
            { question: "How do I check my long division answer?", answer: "Multiply the quotient by the divisor and add the remainder. The result should equal the original dividend. For example: 1234 ÷ 56 = 22 R 2. Check: 56 × 22 + 2 = 1232 + 2 = 1234 ✓" },
            { question: "What if the dividend is smaller than the divisor?", answer: "The quotient is 0 and the remainder equals the dividend. For example, 5 ÷ 12 = 0 remainder 5 (or as a decimal, 0.4167)." },
            { question: "How do I convert a remainder to a decimal?", answer: "Continue the long division by appending a decimal point and zeros to the dividend. Bring down zeros one at a time and continue dividing. For 7 ÷ 4 = 1 R 3, continue: 30 ÷ 4 = 7 R 2, then 20 ÷ 4 = 5 R 0. So 7 ÷ 4 = 1.75." },
            { question: "Is long division still relevant today?", answer: "Absolutely. While calculators handle numerical division, long division is the foundation for polynomial division in algebra, the Euclidean algorithm in number theory, converting fractions to repeating decimals, and understanding how division algorithms work in computer science." },
        ],
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Uses division steps (Euclidean algorithm)" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Division as fractions" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Division for percentage calculations" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Division to find the mean" },
        ],
    },

    /* ─── 11. FRACTION TO RATIO CALCULATOR — RICH CONTENT ─── */
    "fraction-to-ratio-calculator": {
        subtitle: "Convert any fraction or mixed number to a ratio, or convert a ratio back to a fraction. See the complete step-by-step conversion with simplification.",
        contentHTML: `
            <h2 id="how-to-convert">How to Convert a Fraction to a Ratio</h2>
            <p>A <strong>fraction</strong> and a <strong>ratio</strong> are closely related — they both compare two quantities. A fraction is written as <em>a/b</em> (numerator over denominator), while a ratio is written as <em>a:b</em> (with a colon separating the two values).</p>
            <p>Converting between the two is straightforward, but there are a few important steps to follow — especially when dealing with mixed numbers or fractions that need simplification.</p>

            <h3 id="step-simplify">Step One: Simplify and Convert to an Improper Fraction</h3>
            <p>If your fraction is a <strong>mixed number</strong> (like 2 3/4), first convert it to an <strong>improper fraction</strong>:</p>
            <ol>
                <li>Multiply the whole number by the denominator.</li>
                <li>Add the result to the numerator.</li>
                <li>Keep the same denominator.</li>
            </ol>
            <p><strong>Example:</strong> Convert 2 3/4 to an improper fraction.</p>
            <ul>
                <li>2 × 4 = 8</li>
                <li>8 + 3 = 11</li>
                <li>2 3/4 = <strong>11/4</strong></li>
            </ul>
            <p>Next, <strong>simplify</strong> the fraction by dividing both the numerator and denominator by their <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a>. For example, 6/8 → GCD(6,8) = 2 → 3/4.</p>

            <h3 id="step-rewrite">Step Two: Rewrite as a Ratio</h3>
            <p>Once you have a simplified improper (or proper) fraction, simply replace the fraction bar with a colon:</p>
            <p><strong>a/b → a:b</strong></p>
            <p><strong>Example:</strong> Convert 1 1/2 to a ratio.</p>
            <ul>
                <li>Convert to improper fraction: 1 1/2 = <strong>3/2</strong></li>
                <li>Rewrite as ratio: 3/2 = <strong>3:2</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Key point:</strong> Always simplify first! The fraction 6/4 would give you the ratio 6:4, but the <em>simplified</em> ratio is 3:2. A ratio should be in its simplest form, just like a fraction.
            </div>

            <h2 id="ratio-to-fraction">How to Convert a Ratio to a Fraction</h2>
            <p>Converting in the other direction is equally simple — replace the colon with a fraction bar:</p>
            <p><strong>a:b → a/b</strong></p>
            <p><strong>Example:</strong> Convert the ratio 5:3 to a fraction.</p>
            <ul>
                <li>5:3 = <strong>5/3</strong></li>
                <li>As a mixed number: <strong>1 2/3</strong></li>
                <li>As a decimal: <strong>1.6667</strong></li>
            </ul>
            <p>Our calculator above handles both directions — use the dropdown to switch between "Fraction → Ratio" and "Ratio → Fraction".</p>

            <h2 id="understanding-ratios">Understanding Ratios</h2>
            <p>A <strong>ratio</strong> compares two quantities by division. The ratio 3:2 means "for every 3 of the first quantity, there are 2 of the second." Ratios appear everywhere in daily life:</p>
            <ul>
                <li><strong>Cooking:</strong> A recipe might call for ingredients in a 2:1 ratio (e.g., 2 cups flour to 1 cup sugar)</li>
                <li><strong>Maps and scale models:</strong> A 1:100 scale means 1 cm on the map represents 100 cm in reality</li>
                <li><strong>Finance:</strong> Debt-to-income ratio, price-to-earnings ratio</li>
                <li><strong>Science:</strong> Stoichiometric ratios in chemistry, gear ratios in engineering</li>
                <li><strong>Art and design:</strong> The golden ratio (approximately 1.618:1) and aspect ratios (16:9, 4:3)</li>
            </ul>

            <h3 id="part-to-part-vs-part-to-whole">Part-to-Part vs. Part-to-Whole Ratios</h3>
            <p>There are two types of ratios:</p>
            <ul>
                <li><strong>Part-to-part:</strong> Compares one part of a group to another part. If a class has 12 boys and 8 girls, the boy-to-girl ratio is 12:8 = 3:2.</li>
                <li><strong>Part-to-whole:</strong> Compares one part to the total. In the same class, the boy-to-total ratio is 12:20 = 3:5, and as a fraction: 12/20 = 3/5 = 60%.</li>
            </ul>
            <p>Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> to convert ratios to percentages.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the difference between a fraction and a ratio?</h3>
            <p>A <strong>fraction</strong> always represents a part of a whole (3/4 means 3 out of 4 equal parts). A <strong>ratio</strong> can compare any two quantities — parts to parts, parts to wholes, or even unrelated quantities (like speed: miles per hour). While 3/4 and 3:4 look similar, a ratio of 3:4 often means "3 of one thing compared to 4 of another" — which is 7 things total, not 4.</p>

            <h3>Can a ratio have more than two parts?</h3>
            <p>Yes! A ratio can compare three or more quantities. For example, a concrete mix ratio of 1:2:3 means 1 part cement, 2 parts sand, and 3 parts gravel. However, this cannot be directly written as a single fraction — you would need multiple fractions (1/6 cement, 2/6 = 1/3 sand, 3/6 = 1/2 gravel by proportion).</p>

            <h3>How do I simplify a ratio?</h3>
            <p>Divide both sides of the ratio by their <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a>. For example: 12:8 → GCD(12,8) = 4 → 12÷4 : 8÷4 = <strong>3:2</strong>. This works exactly like simplifying a <a href="/math-calculators/fraction-calculator">fraction</a>.</p>

            <h3>What is the golden ratio?</h3>
            <p>The golden ratio (φ ≈ 1.618:1) is a mathematical ratio found throughout nature, art, and architecture. Two quantities are in the golden ratio if their ratio equals the ratio of their sum to the larger quantity: (a+b)/a = a/b ≈ 1.618. As a fraction, it is approximately 89/55 or 144/89 (consecutive Fibonacci numbers).</p>

            <h3>How are ratios used in real life?</h3>
            <p>Ratios are used in cooking (ingredient proportions), finance (P/E ratio, debt ratio), construction (concrete mix 1:2:3), maps (scale 1:50,000), medicine (dosage per weight), chemistry (molar ratios), and technology (screen aspect ratios like 16:9).</p>
        `,
        formula: {
            formula: "Fraction a/b = Ratio a:b (after simplification)",
            variables: [
                { symbol: "a/b", meaning: "Fraction form (numerator / denominator)" },
                { symbol: "a:b", meaning: "Ratio form (first quantity : second quantity)" },
                { symbol: "GCD(a,b)", meaning: "Divide both by GCD to simplify before converting" },
            ],
            example: [
                { label: "6/8 → Ratio", substitution: "GCD(6,8)=2 → 3/4 → 3:4", result: "3:4" },
                { label: "2 1/2 → Ratio", substitution: "2 1/2 = 5/2 → 5:2", result: "5:2" },
                { label: "Ratio 5:3 → Fraction", substitution: "5:3 → 5/3 = 1 2/3", result: "5/3 ≈ 1.667" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply, and divide fractions" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD to simplify fractions and ratios" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Convert ratios and fractions to percentages" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find common multiples for scaling ratios" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Divide to convert fractions to decimals" },
        ],
    },

    /* ─── 12. COMPARE FRACTIONS CALCULATOR — RICH CONTENT ─── */
    "compare-fractions-calculator": {
        subtitle: "Compare two fractions to find which is greater, less than, or equal. See the step-by-step comparison using decimal conversion, cross multiplication, and common denominator methods.",
        contentHTML: `
            <h2 id="how-to-compare-fractions">How to Compare Fractions</h2>
            <p>Comparing fractions might seem challenging at first — it's a bit like comparing apples and oranges when the denominators are different. Fortunately, there are several reliable methods to determine which fraction is larger. Our calculator above uses all of them and shows the complete step-by-step work.</p>
            <p>Below you'll find four methods explained in detail, each with a worked example using the same pair of fractions: <strong>2/7</strong> and <strong>3/5</strong>.</p>

            <h3 id="method-decimal">Method One: Compare Fractions by Converting to Decimals</h3>
            <p>The simplest method is to convert each fraction to a <strong>decimal</strong> by dividing the numerator by the denominator. Once both fractions are in decimal form, you can compare them directly — the larger decimal is the larger fraction.</p>
            <p><strong>Example:</strong> Compare 2/7 and 3/5.</p>
            <ul>
                <li>2/7 = 2 ÷ 7 = <strong>0.2857…</strong></li>
                <li>3/5 = 3 ÷ 5 = <strong>0.6000</strong></li>
            </ul>
            <p>Since 0.6 > 0.2857, we know that <strong>3/5 > 2/7</strong>.</p>
            <p>Use our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> to see the full division steps when converting fractions to decimals.</p>

            <h3 id="method-common-denominator">Method Two: Compare by Finding the Common Denominator</h3>
            <p>Rewrite both fractions as <strong>equivalent fractions</strong> with the same denominator. Then simply compare the numerators — the fraction with the larger numerator is the larger fraction.</p>
            <p><strong>Example:</strong> Compare 2/7 and 3/5.</p>
            <ul>
                <li>Find the <a href="/math-calculators/lcm-calculator">LCD (Least Common Denominator)</a>: LCM(7, 5) = <strong>35</strong></li>
                <li>2/7 = (2 × 5) / (7 × 5) = <strong>10/35</strong></li>
                <li>3/5 = (3 × 7) / (5 × 7) = <strong>21/35</strong></li>
            </ul>
            <p>Compare numerators: 21 > 10, so <strong>3/5 > 2/7</strong>.</p>

            <div class="explanation__highlight">
                <strong>Tip:</strong> This method is especially useful when you need to compare more than two fractions — convert all of them to the same denominator, then simply rank the numerators.
            </div>

            <h3 id="method-same-numerator">Method Three: Compare Fractions with the Same Numerator</h3>
            <p>When two fractions have the <strong>same numerator</strong>, there's a shortcut: the fraction with the <strong>smaller denominator is larger</strong>.</p>
            <p>Why? Because a smaller denominator means the whole is divided into fewer pieces, so each piece is bigger.</p>
            <p><strong>Example:</strong> Compare 3/5 and 3/8.</p>
            <ul>
                <li>Both numerators are 3.</li>
                <li>5 < 8, so fifths are larger than eighths.</li>
                <li>Therefore, <strong>3/5 > 3/8</strong>.</li>
            </ul>

            <h3 id="method-cross-multiply">Method Four: Cross Multiplication</h3>
            <p><strong>Cross multiplication</strong> is a quick, reliable method that always works. Multiply each numerator by the opposite denominator and compare the products.</p>
            <p><strong>Formula:</strong> To compare a/b and c/d, compute a × d and c × b.</p>
            <ul>
                <li>If a × d > c × b, then a/b > c/d</li>
                <li>If a × d < c × b, then a/b < c/d</li>
                <li>If a × d = c × b, then a/b = c/d</li>
            </ul>
            <p><strong>Example:</strong> Compare 2/7 and 3/5.</p>
            <ul>
                <li>2 × 5 = <strong>10</strong></li>
                <li>3 × 7 = <strong>21</strong></li>
                <li>10 < 21, so <strong>2/7 < 3/5</strong>.</li>
            </ul>

            <div class="explanation__highlight">
                <strong>All four methods confirm the same result:</strong> 3/5 is greater than 2/7. Cross multiplication is the fastest single method, while the common denominator method gives you the most insight into <em>how much</em> larger one fraction is.
            </div>

            <h2 id="compare-decimals-percentages">How to Compare Fractions to Decimals and Percentages</h2>
            <p>To compare a fraction to a decimal or percentage, convert all values to the same format:</p>
            <ul>
                <li><strong>Fraction → Decimal:</strong> Divide the numerator by the denominator. Example: 3/8 = 0.375</li>
                <li><strong>Fraction → Percentage:</strong> Convert to decimal, then multiply by 100. Example: 3/8 = 0.375 = 37.5%</li>
                <li><strong>Percentage → Decimal:</strong> Divide by 100. Example: 45% = 0.45</li>
            </ul>
            <p>Once all values are in the same format, compare them directly. Use our <a href="/math-calculators/percentage-calculator">Percentage Calculator</a> for quick conversions.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>Why do we compare fractions?</h3>
            <p>Comparing fractions is essential for:</p>
            <ul>
                <li>Determining which quantity is larger or smaller (e.g., is 3/4 cup more than 2/3 cup?)</li>
                <li>Ordering and ranking data represented as fractions</li>
                <li>Deciding between options in recipes, measurements, and science experiments</li>
                <li>Evaluating performance metrics (e.g., batting averages, completion rates)</li>
            </ul>

            <h3>Why is it easier to compare decimals instead of fractions?</h3>
            <p>Decimals use the <strong>base-10 number system</strong>, which makes their relative size immediately visible. Comparing 0.75 and 0.6 is trivial — you can see at a glance that 0.75 is larger. With fractions like 3/4 and 3/5, the comparison requires extra steps because the denominators are different.</p>

            <h3>How do you compare fractions with whole numbers?</h3>
            <p>Convert the whole number to a fraction by putting it over 1 (e.g., 3 = 3/1), then use any of the four methods above. Alternatively, convert the fraction to a decimal and compare directly. For example: Is 2/3 greater than 1? Since 2/3 = 0.667 and 1 = 1.000, we know 2/3 < 1.</p>

            <h3>How do you compare more than two fractions at a time?</h3>
            <p>The best approach is to find a <strong>common denominator</strong> for all the fractions using the <a href="/math-calculators/lcm-calculator">LCM</a> of all denominators. Convert each fraction to an equivalent fraction with that denominator, then rank the numerators from smallest to largest. Alternatively, convert all fractions to decimals and sort them.</p>
        `,
        formula: {
            formula: "Cross multiply: compare a×d with c×b (for a/b vs c/d)",
            variables: [
                { symbol: "a/b", meaning: "First fraction to compare" },
                { symbol: "c/d", meaning: "Second fraction to compare" },
                { symbol: "a×d vs c×b", meaning: "If a×d > c×b then a/b > c/d" },
            ],
            example: [
                { label: "Compare 2/7 vs 3/5", substitution: "2×5=10  vs  3×7=21", result: "10 < 21 → 2/7 < 3/5" },
                { label: "Common denom. method", substitution: "LCD=35 → 10/35 vs 21/35", result: "10 < 21 → 2/7 < 3/5" },
                { label: "Decimal method", substitution: "0.2857 vs 0.6000", result: "0.2857 < 0.6 → 2/7 < 3/5" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply, and divide fractions" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find the LCD for comparing fractions" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify fractions before comparing" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Convert fractions to percentages" },
            { title: "Fraction to Ratio", slug: "fraction-to-ratio-calculator", categorySlug: "math-calculators", description: "Convert fractions to ratios" },
        ],
    },

    /* ─── 13. FRACTION TO MIXED NUMBER CALCULATOR — RICH CONTENT ─── */
    "fraction-to-mixed-number-calculator": {
        subtitle: "Convert an improper fraction to a mixed number or a mixed number back to an improper fraction. See each step of the conversion including long division and simplification.",
        contentHTML: `
            <h2 id="how-to-convert-improper">How to Convert an Improper Fraction to a Mixed Number</h2>
            <p>An <strong>improper fraction</strong> is a <a href="/math-calculators/fraction-calculator">fraction</a> where the numerator is greater than or equal to the denominator — meaning its value is 1 or greater. A <strong>mixed number</strong> combines a whole number with a proper fraction, like 2 1/3. Both forms represent the same value, but mixed numbers are often easier to understand in everyday life.</p>
            <p>Converting between them takes just two simple steps.</p>

            <h3 id="step-long-division">Step One: Use Long Division</h3>
            <p>Divide the numerator by the denominator using <a href="/math-calculators/long-division-calculator">long division</a>. You need two numbers from this division:</p>
            <ul>
                <li><strong>Quotient</strong> — the whole number result (how many times the denominator fits into the numerator)</li>
                <li><strong>Remainder</strong> — what's left over after division</li>
            </ul>
            <p><strong>Example:</strong> Convert 7/3 to a mixed number.</p>
            <p>7 ÷ 3 = <strong>2 remainder 1</strong></p>

            <h3 id="step-rewrite">Step Two: Rewrite as a Mixed Number</h3>
            <p>Use the quotient and remainder to build the mixed number:</p>
            <ul>
                <li><strong>Whole number</strong> = quotient = 2</li>
                <li><strong>New numerator</strong> = remainder = 1</li>
                <li><strong>Denominator</strong> = original denominator = 3</li>
            </ul>
            <p>Result: 7/3 = <strong>2 1/3</strong></p>

            <div class="explanation__highlight">
                <strong>General formula:</strong> For any improper fraction a/b where a ≥ b: divide a ÷ b = q remainder r. Then a/b = q r/b. If the remainder is 0, the fraction is exactly equal to the whole number (e.g., 6/3 = 2).
            </div>

            <h3 id="more-examples">More Examples</h3>
            <ul>
                <li><strong>11/4:</strong> 11 ÷ 4 = 2 remainder 3 → <strong>2 3/4</strong></li>
                <li><strong>23/5:</strong> 23 ÷ 5 = 4 remainder 3 → <strong>4 3/5</strong></li>
                <li><strong>15/5:</strong> 15 ÷ 5 = 3 remainder 0 → <strong>3</strong> (exact whole number)</li>
                <li><strong>9/4:</strong> 9 ÷ 4 = 2 remainder 1 → <strong>2 1/4</strong></li>
            </ul>

            <h2 id="mixed-to-improper">How to Convert a Mixed Number to an Improper Fraction</h2>
            <p>Converting in the other direction is equally simple — multiply and add:</p>
            <ol>
                <li><strong>Multiply</strong> the whole number by the denominator.</li>
                <li><strong>Add</strong> the result to the numerator.</li>
                <li><strong>Keep</strong> the same denominator.</li>
            </ol>
            <p><strong>Formula:</strong> w n/d = (w × d + n) / d</p>
            <p><strong>Example:</strong> Convert 3 2/5 to an improper fraction.</p>
            <ul>
                <li>3 × 5 = 15</li>
                <li>15 + 2 = 17</li>
                <li>3 2/5 = <strong>17/5</strong></li>
            </ul>
            <p>You can verify this is correct by converting back: 17 ÷ 5 = 3 remainder 2 → 3 2/5 ✓</p>

            <h2 id="simplifying">Simplifying Before and After Conversion</h2>
            <p>It's good practice to <strong>simplify</strong> your fraction before or after converting. Find the <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a> of the numerator and denominator, then divide both by it.</p>
            <p><strong>Example:</strong> Convert 18/8 to a mixed number.</p>
            <ul>
                <li>Simplify first: GCD(18, 8) = 2 → 18/8 = <strong>9/4</strong></li>
                <li>Convert: 9 ÷ 4 = 2 remainder 1 → <strong>2 1/4</strong></li>
            </ul>

            <h2 id="negative-fractions">Negative Improper Fractions</h2>
            <p>For negative improper fractions, convert the absolute value to a mixed number, then apply the negative sign to the whole number.</p>
            <p><strong>Example:</strong> Convert −7/3 to a mixed number.</p>
            <ul>
                <li>|7/3| → 7 ÷ 3 = 2 remainder 1 → 2 1/3</li>
                <li>Apply negative: <strong>−2 1/3</strong></li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the difference between a proper fraction, improper fraction, and mixed number?</h3>
            <p>A <strong>proper fraction</strong> has a numerator smaller than the denominator (value < 1), like 3/4. An <strong>improper fraction</strong> has a numerator ≥ denominator (value ≥ 1), like 7/3. A <strong>mixed number</strong> is another way to write an improper fraction: 7/3 = 2 1/3. Every improper fraction can be written as a mixed number and vice versa.</p>

            <h3>When should I use mixed numbers instead of improper fractions?</h3>
            <p>Mixed numbers are easier to visualize in <strong>everyday contexts</strong> — measurements (2 1/2 inches), cooking (1 3/4 cups), and time (2 1/4 hours). Improper fractions are preferred in <strong>mathematical calculations</strong> — it's easier to multiply, divide, add, and subtract with improper fractions. Use our <a href="/math-calculators/fraction-calculator">Fraction Calculator</a> to perform operations on either form.</p>

            <h3>Can a proper fraction be converted to a mixed number?</h3>
            <p>No — a proper fraction (where numerator < denominator) is already less than 1, so there's no whole number part. 3/4 simply remains 3/4. Only <strong>improper fractions</strong> (numerator ≥ denominator) can be converted to mixed numbers.</p>

            <h3>How do I simplify the fractional part of a mixed number?</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">GCD</a> of the fractional part's numerator and denominator, then divide both by it. For example, 3 4/8: GCD(4, 8) = 4, so 4/8 = 1/2. The simplified mixed number is <strong>3 1/2</strong>.</p>

            <h3>What if the remainder is zero?</h3>
            <p>If the remainder is 0, the improper fraction is exactly equal to a whole number. For example, 12/4 = 12 ÷ 4 = 3 remainder 0, so 12/4 = <strong>3</strong> (no fractional part).</p>
        `,
        formula: {
            formula: "a/b = q  r/b  (where a ÷ b = q remainder r)",
            variables: [
                { symbol: "a/b", meaning: "Improper fraction (numerator ≥ denominator)" },
                { symbol: "q", meaning: "Quotient from long division (whole number part)" },
                { symbol: "r", meaning: "Remainder (becomes the new numerator)" },
                { symbol: "b", meaning: "Original denominator (stays the same)" },
            ],
            example: [
                { label: "7/3 → Mixed", substitution: "7 ÷ 3 = 2 R 1", result: "2 1/3" },
                { label: "11/4 → Mixed", substitution: "11 ÷ 4 = 2 R 3", result: "2 3/4" },
                { label: "3 2/5 → Improper", substitution: "(3 × 5 + 2) / 5", result: "17/5" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with fractions and mixed numbers" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD to simplify fractions" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "See the full division steps used in conversion" },
            { title: "Compare Fractions", slug: "compare-fractions-calculator", categorySlug: "math-calculators", description: "Compare fractions and mixed numbers" },
            { title: "Fraction to Ratio", slug: "fraction-to-ratio-calculator", categorySlug: "math-calculators", description: "Convert fractions and mixed numbers to ratios" },
        ],
    },

    /* ─── 14. DECIMAL TO FRACTION CALCULATOR — RICH CONTENT ─── */
    "decimal-to-fraction-calculator": {
        subtitle: "Convert any decimal number to a fraction in simplest form. See the step-by-step process — from writing the decimal over 1 to reducing with the GCD.",
        contentHTML: `
            <h2 id="how-to-convert">How to Convert a Decimal to a Fraction</h2>
            <p>Every <strong>terminating decimal</strong> (a decimal with a finite number of digits) can be converted to a fraction in just three steps. This process works for any decimal, whether it's less than 1 (like 0.75), greater than 1 (like 1.25), or negative (like −0.4).</p>

            <h3 id="step-starting-fraction">Step One: Create the Starting Fraction</h3>
            <p>Write the decimal as a fraction with the decimal number as the <strong>numerator</strong> and <strong>1</strong> as the denominator.</p>
            <p><strong>Example:</strong> Convert 0.75 to a fraction.</p>
            <p>0.75 = <strong>0.75 / 1</strong></p>

            <h3 id="step-multiply-ten">Step Two: Multiply by 10 to Remove the Decimal</h3>
            <p>Multiply both the numerator and denominator by <strong>10</strong> repeatedly until the numerator is a whole number. The number of times you multiply equals the number of decimal places.</p>
            <p><strong>Continuing the example:</strong></p>
            <ul>
                <li>0.75 has 2 decimal places → multiply by 10² = 100</li>
                <li>0.75 / 1 = (0.75 × 100) / (1 × 100) = <strong>75 / 100</strong></li>
            </ul>

            <h3 id="step-reduce">Step Three: Reduce the Fraction</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a> of the numerator and denominator, then divide both by it to get the simplest form.</p>
            <p><strong>Completing the example:</strong></p>
            <ul>
                <li>GCD(75, 100) = 25</li>
                <li>75 / 100 = (75 ÷ 25) / (100 ÷ 25) = <strong>3/4</strong></li>
            </ul>
            <p>So 0.75 = <strong>3/4</strong>. ✓</p>

            <div class="explanation__highlight">
                <strong>Quick shortcut:</strong> For common decimals, you can read off the fraction directly. 0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4, 0.2 = 1/5, 0.125 = 1/8. For everything else, follow the three steps above.
            </div>

            <h3 id="more-examples">More Worked Examples</h3>
            <ul>
                <li><strong>0.625:</strong> 625/1000 → GCD = 125 → <strong>5/8</strong></li>
                <li><strong>0.4:</strong> 4/10 → GCD = 2 → <strong>2/5</strong></li>
                <li><strong>1.25:</strong> 125/100 → GCD = 25 → 5/4 → as mixed number: <strong>1 1/4</strong></li>
                <li><strong>2.375:</strong> 2375/1000 → GCD = 125 → 19/8 → as mixed number: <strong>2 3/8</strong></li>
                <li><strong>0.333:</strong> 333/1000 → GCD = 1 → <strong>333/1000</strong> (not exact — see repeating decimals below)</li>
            </ul>

            <h2 id="decimals-greater-than-1">Converting Decimals Greater Than 1</h2>
            <p>Decimals larger than 1 produce <strong>improper fractions</strong> (where the numerator is larger than the denominator). You can convert these to <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed numbers</a>:</p>
            <ol>
                <li>Follow the same three steps to get the improper fraction.</li>
                <li>Divide the numerator by the denominator — the quotient is the whole number, the remainder is the new numerator.</li>
            </ol>
            <p><strong>Example:</strong> 1.75 → 175/100 → GCD = 25 → 7/4 → 7 ÷ 4 = 1 remainder 3 → <strong>1 3/4</strong></p>

            <h2 id="repeating-decimals">How to Convert a Repeating Decimal to a Fraction</h2>
            <p>A <strong>repeating decimal</strong> is a decimal that goes on forever with a repeating pattern, like 0.333… (= 1/3) or 0.142857142857… (= 1/7). These require a different algebraic approach:</p>
            <ol>
                <li>Let x = the repeating decimal (e.g., x = 0.333…)</li>
                <li>Multiply both sides by a power of 10 to shift the repeating part (e.g., 10x = 3.333…)</li>
                <li>Subtract the original equation: 10x − x = 3.333… − 0.333… → 9x = 3</li>
                <li>Solve for x: x = 3/9 = <strong>1/3</strong></li>
            </ol>
            <p><strong>Another example:</strong> 0.1666… (where 6 repeats)</p>
            <ul>
                <li>x = 0.1666…</li>
                <li>10x = 1.666… and 100x = 16.666…</li>
                <li>100x − 10x = 16.666… − 1.666… → 90x = 15</li>
                <li>x = 15/90 = <strong>1/6</strong></li>
            </ul>

            <h2 id="negative-decimals">How to Convert a Negative Decimal</h2>
            <p>For negative decimals, simply <strong>ignore the minus sign</strong>, convert the absolute value to a fraction using the steps above, then add the negative sign back to the result.</p>
            <p><strong>Example:</strong> −0.4 → convert 0.4 → 4/10 = 2/5 → <strong>−2/5</strong></p>

            <h2 id="common-conversions">Common Decimal to Fraction Conversions</h2>
            <p>Here are some frequently used conversions for quick reference:</p>
            <ul>
                <li>0.1 = <strong>1/10</strong> &nbsp;|&nbsp; 0.125 = <strong>1/8</strong> &nbsp;|&nbsp; 0.2 = <strong>1/5</strong></li>
                <li>0.25 = <strong>1/4</strong> &nbsp;|&nbsp; 0.333… = <strong>1/3</strong> &nbsp;|&nbsp; 0.375 = <strong>3/8</strong></li>
                <li>0.4 = <strong>2/5</strong> &nbsp;|&nbsp; 0.5 = <strong>1/2</strong> &nbsp;|&nbsp; 0.625 = <strong>5/8</strong></li>
                <li>0.666… = <strong>2/3</strong> &nbsp;|&nbsp; 0.75 = <strong>3/4</strong> &nbsp;|&nbsp; 0.875 = <strong>7/8</strong></li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>When do you need to convert decimals to fractions?</h3>
            <p>You'll need to convert decimals to fractions in <strong>construction</strong> (measurements in inches), <strong>cooking</strong> (recipe quantities like 1/3 cup), <strong>finance</strong> (interest rates), and in <strong>math courses</strong> when simplifying expressions or solving equations. Fractions are also essential when working with <a href="/math-calculators/fraction-to-ratio-calculator">ratios</a>.</p>

            <h3>What are the benefits of using fractions over decimals?</h3>
            <p>Fractions are <strong>exact</strong> — 1/3 is precise, while 0.333… is an approximation. Fractions also make it easier to see relationships between numbers (3/4 immediately tells you "three out of four parts"), and they simplify certain calculations like finding common denominators for <a href="/math-calculators/fraction-calculator">adding fractions</a>.</p>

            <h3>How do you convert a decimal greater than 1 to a fraction?</h3>
            <p>Follow the same three steps (write over 1, multiply by 10, reduce). The result will be an <strong>improper fraction</strong> that you can convert to a <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed number</a>. For example, 2.5 → 25/10 → 5/2 → 2 1/2.</p>

            <h3>What is 0.333… as a fraction?</h3>
            <p>0.333… (repeating) = <strong>1/3</strong>. Similarly, 0.666… = 2/3 and 0.999… = 1 (exactly). These are repeating decimals that require the algebraic method described above.</p>

            <h3>Can every decimal be expressed as a fraction?</h3>
            <p>Every <strong>terminating decimal</strong> and every <strong>repeating decimal</strong> can be expressed as a fraction (rational number). However, <strong>irrational numbers</strong> like π (3.14159…) and √2 (1.41421…) cannot be expressed as exact fractions because their decimal expansions never terminate or repeat.</p>
        `,
        formula: {
            formula: "decimal = numerator / denominator (after GCD reduction)",
            variables: [
                { symbol: "decimal", meaning: "The decimal number to convert" },
                { symbol: "10ⁿ", meaning: "Multiply by 10 raised to the number of decimal places" },
                { symbol: "GCD", meaning: "Greatest Common Divisor — divide both by it to simplify" },
            ],
            example: [
                { label: "0.75 → Fraction", substitution: "75/100 → GCD=25 → 75÷25 / 100÷25", result: "3/4" },
                { label: "1.25 → Fraction", substitution: "125/100 → GCD=25 → 5/4", result: "1 1/4" },
                { label: "0.625 → Fraction", substitution: "625/1000 → GCD=125 → 5/8", result: "5/8" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with the resulting fractions" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD to simplify fractions" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions to mixed numbers" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Convert decimals to percentages" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "See the division steps for fraction-to-decimal" },
        ],
    },

    /* ─── 15. INCH FRACTION CALCULATOR — RICH CONTENT ─── */
    "inch-fraction-calculator": {
        subtitle: "Convert decimal inches to inch fractions (1/16″, 1/32″, 1/64″) or inch fractions to decimal. Also converts to metric (mm, cm). See step-by-step rounding.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate Inch Fractions</h2>
            <p>Measurements in inches can be expressed as a <strong>decimal</strong> (2.695″) or as an <strong>inch fraction</strong> (2 11/16″). Inch fractions follow a special rule: the denominator is always a <strong>power of 2</strong> — specifically 2, 4, 8, 16, 32, or 64. These are called <strong>dyadic fractions</strong>.</p>
            <p>This means converting a decimal to an inch fraction is not the same as converting to a <a href="/math-calculators/decimal-to-fraction-calculator">regular fraction</a>. Some rounding is required to snap the value to the nearest power-of-2 denominator.</p>

            <h3 id="decimal-to-fraction">How to Convert Decimal Inches to an Inch Fraction</h3>
            <p>Follow these three steps to convert a decimal measurement to an inch fraction:</p>
            <ol>
                <li><strong>Separate</strong> the whole number from the decimal portion. The whole number is the full inches.</li>
                <li><strong>Multiply</strong> the decimal portion by your desired precision (16 for 1/16″, 32 for 1/32″, or 64 for 1/64″).</li>
                <li><strong>Round</strong> the result to the nearest whole number — this becomes the numerator. Place it over the precision denominator and simplify.</li>
            </ol>
            <p><strong>Example:</strong> Convert 2.695″ to the nearest 1/16″.</p>
            <ul>
                <li>Separate: 2 whole inches + 0.695 decimal</li>
                <li>Multiply: 0.695 × 16 = 11.12</li>
                <li>Round: 11.12 → 11</li>
                <li>Result: 2 11/16″</li>
            </ul>
            <p>Note: We use ≈ (approximately equal) rather than = because the rounding introduces a tiny difference. The more precise your denominator (32 or 64), the closer the result.</p>

            <div class="explanation__highlight">
                <strong>Precision comparison:</strong> 2.695″ = 2 11/16″ (1/16 precision) = 2 11/16″ (1/32 → 2 22/32 = 2 11/16) = 2 44/64 = 2 11/16″. In this case all precisions give the same result, but for values like 2.7″: 1/16 → 2 11/16, 1/32 → 2 22/32 = 2 11/16, 1/64 → 2 45/64.
            </div>

            <h3 id="fraction-to-decimal">How to Convert Inch Fractions to Decimal</h3>
            <p>Converting an inch fraction to decimal is simple — just <strong>divide the numerator by the denominator</strong> and add the whole inches.</p>
            <p><strong>Example:</strong> Convert 3 7/8″ to decimal.</p>
            <ul>
                <li>7 ÷ 8 = 0.875</li>
                <li>3 + 0.875 = <strong>3.875″</strong></li>
            </ul>
            <p>Use our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> for the full division steps.</p>

            <h2 id="inches-to-metric">How to Convert Inches to Metric Measurements</h2>
            <p>To convert inch fractions to metric, use these conversion factors:</p>
            <ul>
                <li><strong>1 inch = 25.4 millimeters (mm)</strong></li>
                <li><strong>1 inch = 2.54 centimeters (cm)</strong></li>
            </ul>
            <p><strong>Example:</strong> Convert 2 11/16″ to millimeters.</p>
            <ul>
                <li>2 11/16″ = 2.6875″</li>
                <li>2.6875 × 25.4 = <strong>68.2625 mm</strong></li>
                <li>2.6875 × 2.54 = <strong>6.82625 cm</strong></li>
            </ul>

            <h2 id="tape-measure">How to Find Inch Fractions on a Tape Measure</h2>
            <p>The markings on a ruler or tape measure vary in length to indicate different fractions of an inch:</p>
            <ul>
                <li><strong>Longest marks</strong> (after whole inches) = <strong>1/2″</strong></li>
                <li><strong>Next longest</strong> = <strong>1/4″</strong> marks (at 1/4, 3/4)</li>
                <li><strong>Medium marks</strong> = <strong>1/8″</strong> marks (at 1/8, 3/8, 5/8, 7/8)</li>
                <li><strong>Short marks</strong> = <strong>1/16″</strong> marks (at 1/16, 3/16, 5/16, …)</li>
                <li><strong>Shortest marks</strong> (on precision tapes) = <strong>1/32″</strong> or <strong>1/64″</strong></li>
            </ul>
            <p>The key insight: <strong>longer marks = larger fractions</strong>. Count the marks from the last whole inch to find your measurement.</p>

            <h2 id="common-conversions">Common Inch Fraction Conversions</h2>
            <ul>
                <li>1/8″ = 0.125″ = 3.175 mm &nbsp;|&nbsp; 1/4″ = 0.25″ = 6.35 mm</li>
                <li>3/8″ = 0.375″ = 9.525 mm &nbsp;|&nbsp; 1/2″ = 0.5″ = 12.7 mm</li>
                <li>5/8″ = 0.625″ = 15.875 mm &nbsp;|&nbsp; 3/4″ = 0.75″ = 19.05 mm</li>
                <li>7/8″ = 0.875″ = 22.225 mm &nbsp;|&nbsp; 1″ = 1.0″ = 25.4 mm</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is an inch fraction?</h3>
            <p>An <strong>inch fraction</strong> is a fraction of an inch with a denominator that is a power of 2 — specifically 2, 4, 8, 16, 32, or 64. Examples: 1/2″, 3/8″, 15/16″, 17/32″, 33/64″. These are the fractions you see on standard rulers and tape measures.</p>

            <h3>How big is one inch?</h3>
            <p>One inch equals <strong>25.4 millimeters</strong> or <strong>2.54 centimeters</strong>. For reference, a standard paperclip is about one inch long, and the diameter of a U.S. quarter coin is approximately one inch.</p>

            <h3>Do you use decimals or fractions for inches?</h3>
            <p>Both are common. <strong>Fractions</strong> are standard in woodworking, construction, and on tape measures. <strong>Decimals</strong> are preferred in engineering, CNC machining, and when higher precision is needed. Our calculator converts between both formats instantly.</p>

            <h3>Why does the U.S. use inches?</h3>
            <p>The U.S. inherited the <strong>imperial measurement system</strong> from the British Empire, which adopted these units in 1826. While the UK has since switched primarily to the metric system, the U.S. continues to use imperial units — inches, feet, yards, and miles — for everyday measurements.</p>

            <h3>What is the symbol for inches?</h3>
            <p>Inches are represented with the abbreviation <strong>in</strong> or the <strong>double prime symbol ″</strong>. For example: 5 inches = 5 in = 5″. Feet use a single prime (′), so 5 feet 3 inches = 5′ 3″.</p>
        `,
        formula: {
            formula: "Inch Fraction = round(decimal × precision) / precision",
            variables: [
                { symbol: "decimal", meaning: "The decimal portion of the inch measurement" },
                { symbol: "precision", meaning: "Desired denominator: 8, 16, 32, or 64" },
                { symbol: "round()", meaning: "Round to the nearest whole number" },
                { symbol: "25.4", meaning: "Millimeters per inch (for metric conversion)" },
            ],
            example: [
                { label: "2.695″ → 1/16″", substitution: "0.695 × 16 = 11.12 → round = 11", result: "2 11/16″" },
                { label: "3 7/8″ → Decimal", substitution: "3 + 7/8 = 3 + 0.875", result: "3.875″" },
                { label: "3.875″ → mm", substitution: "3.875 × 25.4", result: "98.425 mm" },
            ],
        },
        relatedCalculators: [
            { title: "Decimal to Fraction", slug: "decimal-to-fraction-calculator", categorySlug: "math-calculators", description: "Convert any decimal to a standard fraction" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply inch fractions" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify inch fractions" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Divide to convert fractions to decimals" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper inch fractions" },
        ],
    },

    /* ─── 16. EQUIVALENT FRACTIONS CALCULATOR — RICH CONTENT ─── */
    "equivalent-fractions-calculator": {
        subtitle: "Find equivalent fractions for any fraction. See the simplified form and a list of equivalent fractions generated by multiplying the numerator and denominator.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate Equivalent Fractions</h2>
            <p><strong>Equivalent fractions</strong> are fractions that have the same value but different numerators and denominators. For example, 1/2, 2/4, 3/6, and 5/10 are all equivalent — they all represent the same amount (half).</p>
            <p>Finding equivalent fractions is a two-step process: simplify first, then multiply to generate new equivalents.</p>

            <h3 id="step-reduce">Step One: Reduce to Simplest Form</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">Greatest Common Divisor (GCD)</a> of the numerator and denominator, then divide both by it.</p>
            <p><strong>Example:</strong> Simplify 6/9.</p>
            <ul>
                <li>GCD(6, 9) = 3</li>
                <li>6 ÷ 3 = 2, 9 ÷ 3 = 3</li>
                <li>6/9 = <strong>2/3</strong> (simplest form)</li>
            </ul>

            <h3 id="step-multiply">Step Two: Generate Equivalent Fractions</h3>
            <p>Multiply both the numerator and denominator by the same number (2, 3, 4, …) to create new equivalent fractions.</p>
            <p><strong>Example:</strong> Starting from 2/3, generate equivalents:</p>
            <ul>
                <li>2/3 × 2/2 = <strong>4/6</strong></li>
                <li>2/3 × 3/3 = <strong>6/9</strong></li>
                <li>2/3 × 4/4 = <strong>8/12</strong></li>
                <li>2/3 × 5/5 = <strong>10/15</strong></li>
                <li>2/3 × 10/10 = <strong>20/30</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Key principle:</strong> Multiplying (or dividing) both the numerator and denominator by the same non-zero number does not change the value of the fraction. This is because you're multiplying by 1 (e.g., 3/3 = 1).
            </div>

            <h2 id="check-if-equivalent">How to Check if Two Fractions Are Equivalent</h2>
            <p>There are three reliable methods to determine whether two fractions are equivalent:</p>

            <h3 id="method-reduce">Method 1: Reduce Both to Simplest Form</h3>
            <p>Simplify both fractions using their GCD. If the simplified forms are identical, the fractions are equivalent.</p>
            <p><strong>Example:</strong> Are 5/10 and 6/12 equivalent?</p>
            <ul>
                <li>5/10: GCD(5,10) = 5 → 5/10 = <strong>1/2</strong></li>
                <li>6/12: GCD(6,12) = 6 → 6/12 = <strong>1/2</strong></li>
                <li>Both equal 1/2, so <strong>yes, they are equivalent</strong>. ✓</li>
            </ul>

            <h3 id="method-decimal">Method 2: Convert to Decimals</h3>
            <p>Divide the numerator by the denominator for each fraction. If the decimals are equal, the fractions are equivalent.</p>
            <ul>
                <li>5 ÷ 10 = <strong>0.5</strong></li>
                <li>6 ÷ 12 = <strong>0.5</strong></li>
                <li>Equal decimals → <strong>equivalent</strong>. ✓</li>
            </ul>

            <h3 id="method-cross-multiply">Method 3: Cross Multiplication</h3>
            <p>For fractions a/b and c/d: if a × d = b × c, the fractions are equivalent.</p>
            <p><strong>Example:</strong> Are 3/4 and 9/12 equivalent?</p>
            <ul>
                <li>3 × 12 = 36</li>
                <li>4 × 9 = 36</li>
                <li>36 = 36 → <strong>equivalent</strong>. ✓</li>
            </ul>
            <p>Use our <a href="/math-calculators/compare-fractions-calculator">Compare Fractions Calculator</a> to check equivalence automatically.</p>

            <h2 id="why-equivalent-fractions">Why Are Equivalent Fractions Important?</h2>
            <p>Equivalent fractions are used everywhere in math and daily life:</p>
            <ul>
                <li><strong>Adding fractions:</strong> You need a <a href="/math-calculators/lcm-calculator">common denominator</a>, which requires finding equivalent fractions. To add 1/3 + 1/4, convert to 4/12 + 3/12 = 7/12.</li>
                <li><strong>Comparing fractions:</strong> Convert to equivalent fractions with the same denominator to see which is larger.</li>
                <li><strong>Simplifying:</strong> Reducing fractions to simplest form means finding the smallest equivalent fraction.</li>
                <li><strong>Measurements:</strong> 1/2 inch = 2/4 inch = 4/8 inch = 8/16 inch — all the same measurement on a tape measure.</li>
                <li><strong>Cooking:</strong> Doubling a recipe that calls for 1/3 cup? You need 2/3 cup — an equivalent fraction scaled up.</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What are equivalent fractions?</h3>
            <p>Equivalent fractions are fractions that represent the <strong>same value</strong> despite having different numerators and denominators. For example, 1/2 = 2/4 = 3/6 = 50/100. You create them by multiplying or dividing both parts of the fraction by the same number.</p>

            <h3>How many equivalent fractions does a fraction have?</h3>
            <p><strong>Infinitely many.</strong> Since you can multiply the numerator and denominator by any number (2, 3, 4, …, 100, …, 1000, …), there is no limit to how many equivalent fractions you can find. For example, 1/2 = 2/4 = 3/6 = 4/8 = … = 500/1000 = …</p>

            <h3>Is 0/5 equivalent to 0/10?</h3>
            <p>Yes. Any fraction with a numerator of 0 equals 0, regardless of the denominator (as long as the denominator is not also 0). So 0/5 = 0/10 = 0/1000 = 0.</p>

            <h3>How do you simplify a fraction to find its simplest equivalent?</h3>
            <p>Find the <a href="/math-calculators/gcd-calculator">GCD (Greatest Common Divisor)</a> of the numerator and denominator, then divide both by it. The result is the simplest equivalent fraction. For example, 18/24: GCD(18,24) = 6 → 18÷6 / 24÷6 = <strong>3/4</strong>.</p>

            <h3>Can mixed numbers have equivalent fractions?</h3>
            <p>Yes! First convert the <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed number to an improper fraction</a>, then find equivalents. For example, 1 1/2 = 3/2 → 6/4, 9/6, 12/8, etc.</p>
        `,
        formula: {
            formula: "a/b = (a×n) / (b×n) for any non-zero n",
            variables: [
                { symbol: "a/b", meaning: "Original fraction" },
                { symbol: "n", meaning: "Any non-zero multiplier (2, 3, 4, …)" },
                { symbol: "(a×n)/(b×n)", meaning: "Equivalent fraction — same value, different form" },
            ],
            example: [
                { label: "6/9 simplified", substitution: "GCD(6,9) = 3 → 6÷3 / 9÷3", result: "2/3" },
                { label: "2/3 × 4", substitution: "(2×4) / (3×4)", result: "8/12" },
                { label: "Check: 5/10 ≟ 6/12", substitution: "5×12 = 60, 10×6 = 60", result: "60 = 60 → Equivalent ✓" },
            ],
        },
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD to simplify fractions" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply, divide fractions" },
            { title: "Compare Fractions", slug: "compare-fractions-calculator", categorySlug: "math-calculators", description: "Check if fractions are equivalent" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find common denominators" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions to mixed numbers" },
        ],
    },

    /* ─── 17. LCD CALCULATOR — RICH CONTENT ─── */
    "lcd-calculator": {
        subtitle: "Find the least common denominator (LCD) for two or more fractions. See step-by-step solutions using prime factorization, the listing method, and the GCD formula.",
        contentHTML: `
            <h2 id="how-to-find">How to Find the Least Common Denominator</h2>
            <p>The <strong>denominator</strong> is the bottom number of a <a href="/math-calculators/fraction-calculator">fraction</a> — for 1/3, the denominator is 3. A <strong>common denominator</strong> is a denominator shared by two or more fractions. The <strong>least common denominator (LCD)</strong> is the <em>smallest</em> number that every denominator divides into evenly.</p>
            <p>For example, the LCD of 1/3 and 2/5 is <strong>15</strong>, because 15 ÷ 3 = 5 and 15 ÷ 5 = 3 — both divide evenly with no remainder.</p>
            <p>There are three methods to find the LCD.</p>

            <h3 id="method-factorization">Method 1: Prime Factorization</h3>
            <p>Find the prime factors of each denominator, then multiply all the prime factors together, taking common factors only once.</p>
            <p><strong>Example:</strong> Find the LCD of 10 and 15.</p>
            <ol>
                <li>Prime factors of 10: <strong>2 × 5</strong></li>
                <li>Prime factors of 15: <strong>3 × 5</strong></li>
                <li>Common factor: 5 (use only once)</li>
                <li>LCD = 2 × 3 × 5 = <strong>30</strong></li>
            </ol>

            <h3 id="method-multiples">Method 2: Listing Multiples</h3>
            <p>List multiples of each denominator and find the smallest number that appears in both lists.</p>
            <p><strong>Example:</strong> Find the LCD of 4 and 6.</p>
            <ul>
                <li>Multiples of 4: 4, 8, <strong>12</strong>, 16, 20, <strong>24</strong>, …</li>
                <li>Multiples of 6: 6, <strong>12</strong>, 18, <strong>24</strong>, 30, …</li>
                <li>Common multiples: 12, 24, 36, … → Smallest = <strong>12</strong></li>
            </ul>

            <h3 id="method-division">Method 3: Using the GCD Formula</h3>
            <p>The fastest method: LCD = (a × b) / <a href="/math-calculators/gcd-calculator">GCD(a, b)</a>, where a and b are the two denominators.</p>
            <p><strong>Example:</strong> Find the LCD of 3 and 5.</p>
            <ul>
                <li>GCD(3, 5) = 1 (they share no common factors)</li>
                <li>LCD = (3 × 5) / 1 = <strong>15</strong></li>
            </ul>
            <p><strong>Another example:</strong> LCD of 8 and 12.</p>
            <ul>
                <li>GCD(8, 12) = 4</li>
                <li>LCD = (8 × 12) / 4 = 96 / 4 = <strong>24</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Quick check:</strong> After finding the LCD, verify that each denominator divides into it evenly. If LCD = 24: 24 ÷ 8 = 3 ✓, 24 ÷ 12 = 2 ✓.
            </div>

            <h2 id="using-lcd">How to Use the LCD to Add Fractions</h2>
            <p>The main reason to find the LCD is so you can <strong>add or subtract fractions</strong> with different denominators. Here's the process:</p>
            <ol>
                <li>Find the LCD of the denominators.</li>
                <li>Convert each fraction to an <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a> with the LCD as the denominator.</li>
                <li>Add (or subtract) the numerators.</li>
                <li>Simplify the result if needed.</li>
            </ol>
            <p><strong>Example:</strong> 1/3 + 2/5</p>
            <ul>
                <li>LCD of 3 and 5 = 15</li>
                <li>1/3 = 5/15 (multiply by 5/5)</li>
                <li>2/5 = 6/15 (multiply by 3/3)</li>
                <li>5/15 + 6/15 = <strong>11/15</strong></li>
            </ul>

            <h2 id="lcd-vs-lcm-vs-gcf">LCD vs. LCM vs. GCF — What's the Difference?</h2>
            <ul>
                <li><strong>LCD (Least Common Denominator):</strong> The smallest common multiple of fraction <em>denominators</em>. Used to add/subtract fractions.</li>
                <li><strong>LCM (Least Common Multiple):</strong> The smallest common multiple of any two (or more) numbers — not just denominators. The LCD <em>is</em> the LCM of the denominators.</li>
                <li><strong>GCF/GCD (Greatest Common Factor/Divisor):</strong> The <em>largest</em> number that divides both numbers evenly. Used to <em>simplify</em> fractions and also to <em>compute</em> the LCD via the formula LCD = (a × b) / GCD.</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the least common denominator used for?</h3>
            <p>The LCD is used to convert fractions to <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> with the same denominator so you can <strong>add, subtract, or compare</strong> them. Without a common denominator, you cannot directly combine fractions.</p>

            <h3>Are LCD and LCM the same thing?</h3>
            <p>They're related but not identical. The <strong>LCM</strong> is the least common multiple of any set of numbers. The <strong>LCD</strong> is specifically the LCM of the <em>denominators</em> of two or more fractions. So the LCD is a specific application of the LCM concept.</p>

            <h3>What is the difference between LCD and GCF?</h3>
            <p>They serve opposite purposes. The <strong>GCF</strong> (Greatest Common Factor) is the largest number that divides into all given numbers — used to <em>simplify</em> fractions. The <strong>LCD</strong> is the smallest number that all denominators divide into — used to find <em>common denominators</em> for adding fractions.</p>

            <h3>What if the denominators are already the same?</h3>
            <p>If the fractions already have the same denominator, the LCD is simply that denominator. For example, the LCD of 3/7 and 5/7 is just <strong>7</strong>. You can add them directly: 3/7 + 5/7 = 8/7.</p>

            <h3>Can you find the LCD of more than two fractions?</h3>
            <p>Yes! Find the LCD of the first two denominators, then find the LCD of that result with the third denominator, and so on. For example, LCD of 2, 3, and 5: LCD(2,3) = 6, then LCD(6,5) = <strong>30</strong>.</p>
        `,
        formula: {
            formula: "LCD = (a × b) / GCD(a, b)",
            variables: [
                { symbol: "a, b", meaning: "The two denominators" },
                { symbol: "GCD(a,b)", meaning: "Greatest Common Divisor of a and b" },
                { symbol: "LCD", meaning: "Least Common Denominator — smallest number divisible by both" },
            ],
            example: [
                { label: "LCD(3, 5)", substitution: "(3 × 5) / GCD(3,5) = 15 / 1", result: "15" },
                { label: "LCD(8, 12)", substitution: "(8 × 12) / GCD(8,12) = 96 / 4", result: "24" },
                { label: "LCD(10, 15)", substitution: "(10 × 15) / GCD(10,15) = 150 / 5", result: "30" },
            ],
        },
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCD used in the LCD formula" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find the least common multiple of any numbers" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add and subtract fractions using the LCD" },
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Convert fractions to equivalent forms" },
            { title: "Compare Fractions", slug: "compare-fractions-calculator", categorySlug: "math-calculators", description: "Compare fractions using a common denominator" },
        ],
    },

    /* ─── 18. MIXED NUMBER CALCULATOR — RICH CONTENT ─── */
    /* ─── 18. MIXED NUMBER CALCULATOR — RICH CONTENT (Topical Authority) ─── */
    "mixed-number-calculator": {
        subtitle: "Add, subtract, multiply, or divide mixed numbers and fractions. See the full step-by-step solution with conversion to improper fractions, LCD, simplification, and conversion back to mixed number form.",
        contentHTML: `
            <h2 id="what-is-a-mixed-number">What Is a Mixed Number?</h2>
            <p>A <strong>mixed number</strong> (also called a <strong>mixed fraction</strong>) combines a <em>whole number</em> and a <em>proper fraction</em> into one value. For example, <strong>2 3/4</strong> means "two and three-fourths" — it represents a quantity between 2 and 3.</p>
            <p>Mixed numbers are part of everyday American life: recipes call for <strong>1 1/2 cups of flour</strong>, lumber is measured in <strong>3 3/4 inches</strong>, and race times might be <strong>9 3/10 seconds</strong>.</p>

            <h3 id="fraction-terminology">Fraction Terminology Table</h3>
            <table>
                <thead><tr><th>Term</th><th>Definition</th><th>Example</th></tr></thead>
                <tbody>
                    <tr><td><strong>Proper fraction</strong></td><td>Numerator &lt; Denominator</td><td>3/4, 2/5, 7/8</td></tr>
                    <tr><td><strong>Improper fraction</strong></td><td>Numerator ≥ Denominator</td><td>7/4, 11/3, 5/5</td></tr>
                    <tr><td><strong>Mixed number</strong></td><td>Whole number + proper fraction</td><td>1 3/4, 2 1/3, 5 7/8</td></tr>
                    <tr><td><strong>Equivalent fractions</strong></td><td>Different fractions with the same value</td><td>1/2 = 2/4 = 3/6</td></tr>
                    <tr><td><strong>Lowest terms</strong></td><td>Simplified so GCD of numerator and denominator is 1</td><td>6/8 → 3/4</td></tr>
                </tbody>
            </table>
            <p>A mixed number like <strong>2 3/4</strong> and the improper fraction <strong>11/4</strong> represent the <em>same value</em>. Mixed numbers are easier for humans to read; improper fractions are easier to calculate with. Our calculator handles both — enter whole = 0 for pure fractions.</p>

            <h2 id="converting-mixed-improper">How to Convert Between Mixed Numbers and Improper Fractions</h2>
            <p>Before performing any operation, you must convert mixed numbers to <strong>improper fractions</strong>. This is the critical first step:</p>

            <h3 id="mixed-to-improper">Mixed Number → Improper Fraction</h3>
            <div class="explanation__highlight">
                <strong>Formula: w n/d = (w × d + n) / d</strong>
            </div>
            <p>Multiply the whole number by the denominator, add the numerator, and place the result over the original denominator.</p>
            <p><strong>Example:</strong> Convert 3 2/5 to an improper fraction:</p>
            <ul>
                <li>3 × 5 + 2 = 15 + 2 = 17</li>
                <li>Result: <strong>17/5</strong></li>
            </ul>
            <p>Use our <a href="/math-calculators/mixed-number-to-fraction-calculator">Mixed Number to Improper Fraction Calculator</a> for instant conversions.</p>

            <h3 id="improper-to-mixed">Improper Fraction → Mixed Number</h3>
            <div class="explanation__highlight">
                <strong>Divide the numerator by the denominator. Quotient = whole, Remainder = new numerator.</strong>
            </div>
            <p><strong>Example:</strong> Convert 17/5 back to a mixed number:</p>
            <ul>
                <li>17 ÷ 5 = 3 remainder 2</li>
                <li>Result: <strong>3 2/5</strong></li>
            </ul>
            <p>Use our <a href="/math-calculators/fraction-to-mixed-number-calculator">Fraction to Mixed Number Calculator</a> for this step.</p>

            <h3 id="conversion-reference-table">Common Conversion Reference Table</h3>
            <table>
                <thead><tr><th>Mixed Number</th><th>Improper Fraction</th><th>Decimal</th></tr></thead>
                <tbody>
                    <tr><td>1 1/2</td><td>3/2</td><td>1.5</td></tr>
                    <tr><td>1 1/3</td><td>4/3</td><td>1.333...</td></tr>
                    <tr><td>1 1/4</td><td>5/4</td><td>1.25</td></tr>
                    <tr><td>1 3/4</td><td>7/4</td><td>1.75</td></tr>
                    <tr><td>2 1/2</td><td>5/2</td><td>2.5</td></tr>
                    <tr><td>2 1/3</td><td>7/3</td><td>2.333...</td></tr>
                    <tr><td>2 2/3</td><td>8/3</td><td>2.666...</td></tr>
                    <tr><td>3 1/4</td><td>13/4</td><td>3.25</td></tr>
                    <tr><td>3 3/4</td><td>15/4</td><td>3.75</td></tr>
                    <tr><td>5 1/2</td><td>11/2</td><td>5.5</td></tr>
                </tbody>
            </table>

            <h2 id="how-to-add-mixed-numbers">How to Add Mixed Numbers</h2>
            <p>Adding mixed numbers requires a common denominator. Follow these steps:</p>
            <ol>
                <li><strong>Convert</strong> each mixed number to an improper fraction.</li>
                <li><strong>Find the LCD</strong> (<a href="/math-calculators/lcd-calculator">Least Common Denominator</a>).</li>
                <li><strong>Convert</strong> both fractions to <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> with the LCD.</li>
                <li><strong>Add</strong> the numerators; keep the denominator.</li>
                <li><strong>Simplify</strong> using the <a href="/math-calculators/gcd-calculator">GCD</a> and convert back to a mixed number.</li>
            </ol>
            <div class="explanation__highlight">
                <strong>Formula: a/b + c/d = (a×d + c×b) / (b×d)</strong>
            </div>

            <h3 id="addition-example">Worked Example: Add 1 2/3 + 2 1/4</h3>
            <ol>
                <li>Convert: 1 2/3 = (1×3+2)/3 = <strong>5/3</strong>; 2 1/4 = (2×4+1)/4 = <strong>9/4</strong></li>
                <li>LCD(3, 4) = 12</li>
                <li>Convert: 5/3 = 20/12; 9/4 = 27/12</li>
                <li>Add: 20 + 27 = 47 → <strong>47/12</strong></li>
                <li>Convert back: 47 ÷ 12 = 3 remainder 11 → <strong>3 11/12</strong></li>
            </ol>

            <h2 id="how-to-subtract-mixed-numbers">How to Subtract Mixed Numbers</h2>
            <p>Subtraction follows the same process as addition, but you subtract the numerators instead:</p>
            <div class="explanation__highlight">
                <strong>Formula: a/b − c/d = (a×d − c×b) / (b×d)</strong>
            </div>

            <h3 id="subtraction-example">Worked Example: Subtract 1 2/6 − 2 1/4</h3>
            <ol>
                <li>Convert: 1 2/6 = 8/6; 2 1/4 = 9/4</li>
                <li>LCD(6, 4) = 12</li>
                <li>Convert: 8/6 = 16/12; 9/4 = 27/12</li>
                <li>Subtract: 16 − 27 = −11 → <strong>−11/12</strong></li>
                <li>Result is negative: <strong>−11/12</strong></li>
            </ol>
            <p><strong>Note:</strong> When the second number is larger, the result is naturally <em>negative</em>. This is perfectly normal — our calculator handles negative results automatically.</p>

            <h2 id="how-to-multiply-mixed-numbers">How to Multiply Mixed Numbers</h2>
            <p>Multiplying mixed numbers is actually <em>simpler</em> than adding them — you <strong>don't need a common denominator</strong>:</p>
            <ol>
                <li><strong>Convert</strong> both mixed numbers to improper fractions.</li>
                <li><strong>Multiply</strong> numerators together and denominators together.</li>
                <li><strong>Simplify</strong> and convert back to a mixed number.</li>
            </ol>
            <div class="explanation__highlight">
                <strong>Formula: a/b × c/d = (a × c) / (b × d)</strong>
            </div>

            <h3 id="multiplication-example">Worked Example: Multiply 2 1/2 × 1 1/3</h3>
            <ol>
                <li>Convert: 2 1/2 = 5/2; 1 1/3 = 4/3</li>
                <li>Multiply: (5 × 4) / (2 × 3) = 20/6</li>
                <li>Simplify: GCD(20, 6) = 2 → 10/3</li>
                <li>Convert: 10 ÷ 3 = 3 R 1 → <strong>3 1/3</strong></li>
            </ol>
            <p><strong>Pro tip (Cross-cancellation):</strong> Before multiplying, check if any numerator shares a common factor with either denominator. Cancel first to work with smaller numbers. For example, in 5/2 × 4/3, you could cancel the 2 and 4 first: 5/1 × 2/3 = 10/3.</p>

            <h2 id="how-to-divide-mixed-numbers">How to Divide Mixed Numbers</h2>
            <p>Division uses the <strong>"Keep, Change, Flip"</strong> method (also called "multiply by the reciprocal"):</p>
            <ol>
                <li><strong>Convert</strong> both mixed numbers to improper fractions.</li>
                <li><strong>Keep</strong> the first fraction the same.</li>
                <li><strong>Change</strong> the division sign (÷) to multiplication (×).</li>
                <li><strong>Flip</strong> the second fraction (swap numerator and denominator).</li>
                <li><strong>Multiply</strong>, simplify, and convert back.</li>
            </ol>
            <div class="explanation__highlight">
                <strong>Formula: a/b ÷ c/d = a/b × d/c = (a × d) / (b × c)</strong>
            </div>

            <h3 id="division-example">Worked Example: Divide 3 1/2 ÷ 1 1/4</h3>
            <ol>
                <li>Convert: 3 1/2 = 7/2; 1 1/4 = 5/4</li>
                <li>Flip second fraction: 5/4 → 4/5</li>
                <li>Multiply: (7 × 4) / (2 × 5) = 28/10</li>
                <li>Simplify: GCD(28, 10) = 2 → 14/5</li>
                <li>Convert: 14 ÷ 5 = 2 R 4 → <strong>2 4/5</strong></li>
            </ol>

            <h2 id="negative-mixed-numbers">Working with Negative Mixed Numbers</h2>
            <p>Negative mixed numbers follow the same rules as positive ones, with additional sign considerations. A negative sign can be placed in three equivalent positions:</p>
            <table>
                <thead><tr><th>Notation</th><th>Meaning</th><th>Example</th></tr></thead>
                <tbody>
                    <tr><td><strong>−a/b</strong></td><td>Negative in front of fraction</td><td>−3/4 (most common)</td></tr>
                    <tr><td><strong>−a / b</strong></td><td>Negative numerator</td><td>(−3)/4</td></tr>
                    <tr><td><strong>a / −b</strong></td><td>Negative denominator</td><td>3/(−4)</td></tr>
                </tbody>
            </table>
            <p>All three forms are equivalent: <strong>−3/4 = (−3)/4 = 3/(−4)</strong>.</p>
            <p><strong>Multiplication/Division sign rules:</strong></p>
            <ul>
                <li>Positive × Positive = <strong>Positive</strong></li>
                <li>Negative × Negative = <strong>Positive</strong></li>
                <li>Positive × Negative = <strong>Negative</strong></li>
                <li>Negative × Positive = <strong>Negative</strong></li>
            </ul>
            <p>Our calculator handles negative inputs automatically — just enter negative values in the whole or numerator field.</p>

            <h2 id="when-common-denominator">When Do You Need a Common Denominator?</h2>
            <table>
                <thead><tr><th>Operation</th><th>Common Denominator Needed?</th><th>Why?</th></tr></thead>
                <tbody>
                    <tr><td><strong>Addition (+)</strong></td><td>✅ Yes</td><td>You must combine numerators over the same denominator</td></tr>
                    <tr><td><strong>Subtraction (−)</strong></td><td>✅ Yes</td><td>Same reason — you subtract numerators over a shared base</td></tr>
                    <tr><td><strong>Multiplication (×)</strong></td><td>❌ No</td><td>Just multiply straight across: numerator × numerator, denominator × denominator</td></tr>
                    <tr><td><strong>Division (÷)</strong></td><td>❌ No</td><td>Flip the second fraction and multiply</td></tr>
                </tbody>
            </table>
            <p>This is one of the most common sources of confusion for students. Remember: LCD is only needed for <strong>addition and subtraction</strong>. Use our <a href="/math-calculators/lcd-calculator">LCD Calculator</a> to find it quickly.</p>

            <h2 id="real-world-applications">Real-World Applications of Mixed Numbers (USA Focus)</h2>

            <h3 id="cooking-baking">Cooking & Baking</h3>
            <p>American recipes regularly use mixed numbers: <strong>1 1/2 cups of flour</strong>, <strong>2 1/4 teaspoons of baking soda</strong>, <strong>3/4 cup of sugar</strong>. Doubling or halving a recipe requires multiplying or dividing mixed numbers. For example, doubling a recipe that calls for 1 3/4 cups means calculating 1 3/4 × 2 = 7/4 × 2 = 14/4 = <strong>3 1/2 cups</strong>.</p>

            <h3 id="construction-carpentry">Construction & Carpentry</h3>
            <p>US construction measurements use feet and inches with fractions: a board might be <strong>5 3/4 inches</strong> wide, and you need to cut <strong>2 1/8 inches</strong> off. You'd calculate 5 3/4 − 2 1/8 = 23/4 − 17/8 = 46/8 − 17/8 = 29/8 = <strong>3 5/8 inches</strong> remaining. See our <a href="/math-calculators/inch-fraction-calculator">Inch Fraction Calculator</a> for measurement-specific calculations.</p>

            <h3 id="sports-statistics">Sports Statistics</h3>
            <p>Track and field records, marathon times, and race results often involve mixed numbers: a runner's split might be <strong>4 1/4 minutes</strong> per mile. Comparing or averaging performance times requires mixed number arithmetic.</p>

            <h2 id="us-curriculum">US Curriculum Alignment</h2>
            <p>Mixed number operations are a core part of the <strong>Common Core State Standards</strong> adopted by most US states:</p>
            <table>
                <thead><tr><th>Standard</th><th>Grade Level</th><th>Skill</th></tr></thead>
                <tbody>
                    <tr><td><strong>4.NF.B.3c</strong></td><td>4th Grade</td><td>Add and subtract mixed numbers with like denominators</td></tr>
                    <tr><td><strong>4.NF.B.3d</strong></td><td>4th Grade</td><td>Solve word problems involving addition and subtraction of fractions</td></tr>
                    <tr><td><strong>5.NF.A.1</strong></td><td>5th Grade</td><td>Add and subtract fractions with unlike denominators (including mixed numbers)</td></tr>
                    <tr><td><strong>5.NF.B.4</strong></td><td>5th Grade</td><td>Multiply fractions and mixed numbers</td></tr>
                    <tr><td><strong>5.NF.B.6</strong></td><td>5th Grade</td><td>Solve real-world problems involving multiplication of fractions and mixed numbers</td></tr>
                    <tr><td><strong>5.NF.B.7</strong></td><td>5th Grade</td><td>Divide unit fractions by whole numbers and whole numbers by unit fractions</td></tr>
                    <tr><td><strong>6.NS.A.1</strong></td><td>6th Grade</td><td>Divide fractions by fractions (including mixed numbers)</td></tr>
                </tbody>
            </table>
            <p>Mixed number operations also appear on the <strong>SAT, ACT, and GRE</strong> math sections, typically as word problems involving measurements, recipes, or time calculations.</p>

            <h2 id="common-mistakes">Common Mistakes to Avoid</h2>
            <ol>
                <li><strong>Forgetting to convert to improper fractions:</strong> You cannot add whole parts and fraction parts separately (e.g., 1 2/3 + 2 1/4 ≠ 3 3/7). Always convert first.</li>
                <li><strong>Using LCD for multiplication:</strong> You do NOT need a common denominator for multiplication or division. Just multiply straight across.</li>
                <li><strong>Not simplifying the result:</strong> Always check if the answer can be reduced. Use the <a href="/math-calculators/gcd-calculator">GCD</a> to find the greatest common factor.</li>
                <li><strong>Forgetting to convert back:</strong> After calculating, convert the improper fraction back to a mixed number for a readable answer.</li>
                <li><strong>Sign errors with negatives:</strong> Be careful with negative numbers. A negative times a negative is positive: (−3) × (−2) = +6.</li>
                <li><strong>Wrong reciprocal for division:</strong> When dividing, flip only the <em>second</em> fraction (the divisor), not the first.</li>
            </ol>

            <h2 id="related-fraction-tools">Related Fraction Tools</h2>
            <ul>
                <li><strong><a href="/math-calculators/fraction-calculator">Fraction Calculator</a>:</strong> Perform operations with simple (non-mixed) fractions</li>
                <li><strong><a href="/math-calculators/fraction-to-mixed-number-calculator">Fraction to Mixed Number Converter</a>:</strong> Convert improper fractions to mixed numbers</li>
                <li><strong><a href="/math-calculators/mixed-number-to-fraction-calculator">Mixed Number to Improper Fraction</a>:</strong> Convert mixed numbers before calculating</li>
                <li><strong><a href="/math-calculators/add-fractions-calculator">Add Fractions Calculator</a>:</strong> Add pure fractions without the whole number component</li>
                <li><strong><a href="/math-calculators/subtract-fractions-calculator">Subtract Fractions Calculator</a>:</strong> Subtract pure fractions</li>
                <li><strong><a href="/math-calculators/lcd-calculator">LCD Calculator</a>:</strong> Find the Least Common Denominator for addition and subtraction</li>
                <li><strong><a href="/math-calculators/gcd-calculator">GCD Calculator</a>:</strong> Find the Greatest Common Divisor to simplify results</li>
                <li><strong><a href="/math-calculators/equivalent-fractions-calculator">Equivalent Fractions</a>:</strong> Find fractions with matching denominators</li>
                <li><strong><a href="/math-calculators/fraction-simplifier">Fraction Simplifier</a>:</strong> Reduce any fraction to lowest terms</li>
                <li><strong><a href="/math-calculators/long-division-calculator">Long Division Calculator</a>:</strong> Divide numerator by denominator to get the mixed number form</li>
            </ul>
        `,
        formula: {
            formula: "Convert to improper → Operate → Simplify → Convert back",
            variables: [
                { symbol: "w n/d → (w×d+n)/d", meaning: "Convert mixed number to improper fraction" },
                { symbol: "a/b + c/d = (ad+bc)/bd", meaning: "Add fractions (requires common denominator)" },
                { symbol: "a/b − c/d = (ad−bc)/bd", meaning: "Subtract fractions (requires common denominator)" },
                { symbol: "a/b × c/d = ac/bd", meaning: "Multiply: numerator × numerator, denominator × denominator" },
                { symbol: "a/b ÷ c/d = ad/bc", meaning: "Divide: flip second fraction and multiply" },
            ],
            example: [
                { label: "1 2/3 + 2 1/4", substitution: "5/3 + 9/4 → 20/12 + 27/12 = 47/12", result: "3 11/12" },
                { label: "2 1/2 × 1 1/3", substitution: "5/2 × 4/3 = 20/6 → 10/3", result: "3 1/3" },
                { label: "3 1/2 ÷ 1 1/4", substitution: "7/2 × 4/5 = 28/10 → 14/5", result: "2 4/5" },
                { label: "1 2/6 − 2 1/4", substitution: "8/6 − 9/4 → 16/12 − 27/12 = −11/12", result: "−11/12" },
            ],
        },
        faq: [
            { question: "What is a mixed number?", answer: "A mixed number combines a whole number and a proper fraction, like 2 3/4 (read as 'two and three-fourths'). It represents a value greater than 1. Mixed numbers are equivalent to improper fractions — for example, 2 3/4 = 11/4. They're commonly used in American cooking recipes, construction measurements, and everyday math." },
            { question: "How do you add mixed numbers with different denominators?", answer: "First, convert both mixed numbers to improper fractions. Then find the Least Common Denominator (LCD) of the two denominators. Convert both fractions to equivalent fractions with the LCD. Add the numerators (keep the denominator). Finally, simplify and convert back to a mixed number. Example: 1 1/3 + 2 1/2 = 4/3 + 5/2 = 8/6 + 15/6 = 23/6 = 3 5/6." },
            { question: "How do you convert a mixed number to an improper fraction?", answer: "Multiply the whole number by the denominator, then add the numerator. Place this result over the original denominator. Formula: w n/d = (w × d + n) / d. Example: 3 2/5 = (3 × 5 + 2) / 5 = 17/5." },
            { question: "Can you subtract a larger mixed number from a smaller one?", answer: "Yes! The result will simply be negative. Follow the same steps — convert to improper fractions, find the LCD, and subtract. Example: 1 1/4 − 2 1/2 = 5/4 − 5/2 = 5/4 − 10/4 = −5/4 = −1 1/4." },
            { question: "Why don't you need a common denominator for multiplication?", answer: "When multiplying fractions, you multiply numerators together and denominators together (a/b × c/d = ac/bd). There's no step that combines numerators over a shared base—that only happens in addition and subtraction. The same applies to division (after flipping the second fraction)." },
            { question: "How do you divide mixed numbers?", answer: "Use the 'Keep, Change, Flip' method: (1) Convert both mixed numbers to improper fractions. (2) Keep the first fraction. (3) Change ÷ to ×. (4) Flip the second fraction (swap numerator and denominator). (5) Multiply straight across, simplify, and convert back. Example: 3 1/2 ÷ 1 1/4 = 7/2 × 4/5 = 28/10 = 14/5 = 2 4/5." },
            { question: "What is the difference between a proper and improper fraction?", answer: "A proper fraction has a numerator smaller than the denominator (like 3/4 — less than 1). An improper fraction has a numerator equal to or greater than the denominator (like 7/4 — equal to or greater than 1). Improper fractions can be converted to mixed numbers: 7/4 = 1 3/4." },
            { question: "How are mixed numbers used in everyday life?", answer: "Americans encounter mixed numbers daily: cooking (1 1/2 cups of flour), carpentry (a board 5 3/4 inches wide), fuel (3 1/4 gallons of gas), time (2 1/2 hours), and sports (a 9 3/10 second sprint). Understanding mixed number arithmetic is essential for doubling recipes, cutting wood to size, and calculating distances." },
            { question: "What does 'reduce to lowest terms' mean?", answer: "Reducing a fraction to lowest terms means dividing both the numerator and denominator by their Greatest Common Divisor (GCD) until no further simplification is possible. For example, 12/18: GCD(12, 18) = 6, so 12/18 = 2/3. A fraction is in lowest terms when the only common factor of the numerator and denominator is 1." },
            { question: "How do mixed numbers appear on standardized tests?", answer: "Mixed numbers appear frequently on the SAT, ACT, and GRE math sections, typically as word problems: 'A recipe calls for 2 1/3 cups of flour. If you make 1 1/2 batches, how much flour do you need?' (Answer: 2 1/3 × 1 1/2 = 7/3 × 3/2 = 21/6 = 7/2 = 3 1/2 cups). These problems test conversion skills, operation selection, and simplification." },
        ],
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with simple fractions" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions to mixed numbers" },
            { title: "Mixed to Improper", slug: "mixed-number-to-fraction-calculator", categorySlug: "math-calculators", description: "Convert mixed numbers before calculating" },
            { title: "LCD Calculator", slug: "lcd-calculator", categorySlug: "math-calculators", description: "Find the common denominator for adding" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify the result to lowest terms" },
            { title: "Add Fractions", slug: "add-fractions-calculator", categorySlug: "math-calculators", description: "Add pure fractions without whole numbers" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Reduce any fraction to lowest terms" },
        ],
    },

    /* ─── 19. FRACTION SIMPLIFIER — RICH CONTENT ─── */
    "fraction-simplifier": {
        subtitle: "Simplify any fraction to its lowest terms. Reduce proper, improper, and negative fractions using GCD division with step-by-step work shown.",
        contentHTML: `
            <h2 id="how-to-simplify">How to Simplify a Fraction</h2>
            <p>A <strong>simplified fraction</strong> (also called a <em>reduced fraction</em>) is one where the numerator and denominator are as small as possible while still being whole numbers. The key: the only common factor between them is 1.</p>
            <p>For example, 6/8 and 3/4 are <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> — they represent the same value. But <strong>3/4</strong> is in simplest form because the only common factor of 3 and 4 is 1.</p>

            <h3 id="step-gcf">Step One: Find the Greatest Common Factor (GCF)</h3>
            <p>List all factors of both the numerator and denominator, then identify the largest factor they share.</p>
            <p><strong>Example:</strong> Simplify 18/24.</p>
            <ul>
                <li>Factors of 18: 1, 2, 3, <strong>6</strong>, 9, 18</li>
                <li>Factors of 24: 1, 2, 3, 4, <strong>6</strong>, 8, 12, 24</li>
                <li>Common factors: 1, 2, 3, <strong>6</strong></li>
                <li>Greatest Common Factor = <strong>6</strong></li>
            </ul>
            <p>Use our <a href="/math-calculators/gcd-calculator">GCD Calculator</a> for a faster way to find the GCF.</p>

            <h3 id="step-divide">Step Two: Divide by the GCF</h3>
            <p>Divide both the numerator and denominator by the greatest common factor.</p>
            <ul>
                <li>18 ÷ 6 = 3</li>
                <li>24 ÷ 6 = 4</li>
                <li>18/24 = <strong>3/4</strong> ✓</li>
            </ul>

            <div class="explanation__highlight">
                <strong>Verification:</strong> A fraction is fully simplified when GCF(numerator, denominator) = 1. For 3/4: GCF(3, 4) = 1 ✓.
            </div>

            <h2 id="division-ladder">The Division Ladder — An Easier Method</h2>
            <p>Instead of finding all factors, repeatedly divide both numbers by the smallest common factor until no more common factors exist:</p>
            <p><strong>Example:</strong> Simplify 8/12 using the division ladder.</p>
            <ol>
                <li>Both are even → divide by 2: 8/12 → 4/6</li>
                <li>Both are even → divide by 2: 4/6 → 2/3</li>
                <li>2 and 3 share no common factor → <strong>done!</strong></li>
            </ol>
            <p>Result: 8/12 = <strong>2/3</strong></p>
            <p>This method is great when you don't want to compute the GCF upfront — you just keep dividing by small primes (2, 3, 5, …) until you can't anymore.</p>

            <h2 id="improper-fractions">How to Simplify Improper Fractions</h2>
            <p>An <strong>improper fraction</strong> has a numerator larger than the denominator (like 12/8). First simplify, then convert to a <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed number</a>.</p>
            <p><strong>Example:</strong> Simplify 12/8.</p>
            <ul>
                <li>GCF(12, 8) = 4</li>
                <li>12/8 = 3/2 (simplified)</li>
                <li>3 ÷ 2 = 1 remainder 1 → <strong>1 1/2</strong> (as mixed number)</li>
            </ul>
            <p>Use our <a href="/math-calculators/long-division-calculator">Long Division Calculator</a> for that final step.</p>

            <h2 id="negative-fractions">Simplifying Negative Fractions</h2>
            <p>For negative fractions like −6/8 or 6/(−8):</p>
            <ol>
                <li>Note the sign — if exactly one of numerator or denominator is negative, the fraction is negative.</li>
                <li>Simplify the absolute values: 6/8 → 3/4.</li>
                <li>Reattach the sign: <strong>−3/4</strong>.</li>
            </ol>
            <p>If <em>both</em> are negative (−6/−8), the negatives cancel and the result is <strong>positive</strong>: 3/4.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What does it mean to simplify a fraction?</h3>
            <p>Simplifying means expressing a fraction in its <strong>lowest terms</strong> — the numerator and denominator have no common factor other than 1. The value of the fraction doesn't change; only the way it's written becomes simpler. For example, 6/8 simplified is 3/4.</p>

            <h3>How do you know when a fraction is already in simplest form?</h3>
            <p>A fraction is in simplest form when the <a href="/math-calculators/gcd-calculator">GCF (Greatest Common Factor)</a> of the numerator and denominator is <strong>1</strong>. For example, 3/4 has GCF(3,4) = 1, so it's already simplified. But 6/8 has GCF(6,8) = 2, so it can still be reduced.</p>

            <h3>What is the difference between reducing and simplifying a fraction?</h3>
            <p>They're often used interchangeably. <strong>Reducing</strong> typically means dividing both parts by any common factor (making the fraction smaller). <strong>Simplifying</strong> means reducing all the way to the <em>lowest</em> terms by dividing by the GCF. So simplifying is the complete version of reducing.</p>

            <h3>Can fractions with prime numbers be simplified?</h3>
            <p>If both the numerator and denominator are prime numbers (and different), the fraction is <strong>already in simplest form</strong> because primes only have factors of 1 and themselves. For example, 3/7 cannot be simplified. However, 5/5 = 1.</p>

            <h3>Is 0/5 a simplified fraction?</h3>
            <p>Yes — any fraction with a <strong>numerator of 0</strong> equals 0 and is already in simplest form, as long as the denominator is not also 0 (which would be undefined). The simplest way to write 0/5 is just <strong>0</strong>.</p>
        `,
        formula: {
            formula: "Simplified = (n ÷ GCF) / (d ÷ GCF)",
            variables: [
                { symbol: "n", meaning: "Numerator of the original fraction" },
                { symbol: "d", meaning: "Denominator of the original fraction" },
                { symbol: "GCF", meaning: "Greatest Common Factor of n and d" },
            ],
            example: [
                { label: "18/24", substitution: "GCF(18,24) = 6 → 18÷6 / 24÷6", result: "3/4" },
                { label: "12/8 (improper)", substitution: "GCF(12,8) = 4 → 12÷4 / 8÷4 = 3/2", result: "1 1/2" },
                { label: "−6/8 (negative)", substitution: "GCF(6,8) = 2 → 6÷2 / 8÷2 = 3/4", result: "−3/4" },
            ],
        },
        relatedCalculators: [
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Find the GCF to simplify" },
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Find equivalent fractions" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply fractions" },
            { title: "Long Division Calculator", slug: "long-division-calculator", categorySlug: "math-calculators", description: "Convert to mixed numbers" },
        ],
    },

    /* ─── 20. MIXED NUMBER TO IMPROPER FRACTION — RICH CONTENT ─── */
    "mixed-number-to-fraction-calculator": {
        subtitle: "Convert a mixed number to an improper fraction. See the step-by-step conversion with formula, simplification, and decimal equivalent.",
        contentHTML: `
            <h2 id="how-to-convert">How to Convert a Mixed Number to an Improper Fraction</h2>
            <p>A <strong>mixed number</strong> combines a whole number with a proper fraction — like 2 1/4. An <strong>improper fraction</strong> has a numerator that is greater than or equal to the denominator — like 9/4. Both represent the same value, just written differently.</p>
            <p>Converting a mixed number to an improper fraction takes just two simple steps.</p>

            <h3 id="step-multiply">Step One: Multiply the Whole Number by the Denominator</h3>
            <p>Multiply the whole number part by the fraction's denominator. This tells you how many "fractional parts" the whole number contains.</p>
            <p><strong>Example:</strong> Convert 2 1/4 to an improper fraction.</p>
            <ul>
                <li>Whole number: 2, Denominator: 4</li>
                <li>2 × 4 = <strong>8</strong></li>
            </ul>
            <p>Think of it this way: 2 whole pizzas, each cut into 4 slices = 8 slices total.</p>

            <h3 id="step-add">Step Two: Add the Numerator</h3>
            <p>Add the original numerator to the result from Step One. This becomes the new numerator of the improper fraction.</p>
            <ul>
                <li>8 + 1 = <strong>9</strong></li>
                <li>Place over the original denominator: <strong>9/4</strong></li>
            </ul>
            <p>So 2 1/4 = <strong>9/4</strong>. That's 8 slices from 2 whole pizzas plus 1 extra slice = 9 slices of size 1/4.</p>

            <div class="explanation__highlight">
                <strong>Quick formula:</strong> w n/d = (w × d + n) / d. In one step: multiply whole by denominator, add numerator, keep denominator.
            </div>

            <h2 id="more-examples">More Worked Examples</h2>
            <p><strong>Example 1:</strong> Convert 3 2/5 to an improper fraction.</p>
            <ul>
                <li>3 × 5 = 15</li>
                <li>15 + 2 = 17</li>
                <li>3 2/5 = <strong>17/5</strong></li>
            </ul>
            <p><strong>Example 2:</strong> Convert 1 7/8 to an improper fraction.</p>
            <ul>
                <li>1 × 8 = 8</li>
                <li>8 + 7 = 15</li>
                <li>1 7/8 = <strong>15/8</strong></li>
            </ul>
            <p><strong>Example 3:</strong> Convert 5 1/3 to an improper fraction.</p>
            <ul>
                <li>5 × 3 = 15</li>
                <li>15 + 1 = 16</li>
                <li>5 1/3 = <strong>16/3</strong></li>
            </ul>

            <h2 id="negative-mixed">Negative Mixed Numbers</h2>
            <p>For negative mixed numbers like −2 1/4:</p>
            <ol>
                <li>Ignore the sign and convert as usual: 2 1/4 → 9/4</li>
                <li>Reattach the negative sign: <strong>−9/4</strong></li>
            </ol>

            <h2 id="why-convert">Why Convert to Improper Fractions?</h2>
            <p>You need improper fractions when performing <strong>arithmetic operations</strong>:</p>
            <ul>
                <li><strong>Adding/Subtracting:</strong> You need a common denominator, which requires improper fractions first. Use our <a href="/math-calculators/mixed-number-calculator">Mixed Number Calculator</a>.</li>
                <li><strong>Multiplying/Dividing:</strong> Multiply numerators and denominators directly — only works with improper fractions.</li>
                <li><strong>Comparing:</strong> It's easier to <a href="/math-calculators/compare-fractions-calculator">compare fractions</a> when all are in the same form.</li>
            </ul>
            <p>To go the other way, use our <a href="/math-calculators/fraction-to-mixed-number-calculator">Improper Fraction to Mixed Number Calculator</a>.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the formula for converting a mixed number to an improper fraction?</h3>
            <p>The formula is: <strong>(whole × denominator + numerator) / denominator</strong>. Multiply the whole number by the denominator, add the numerator to get the new numerator, and keep the original denominator.</p>

            <h3>What is the difference between a mixed number and an improper fraction?</h3>
            <p>A <strong>mixed number</strong> shows a whole part and a fractional part separately (e.g., 2 3/4). An <strong>improper fraction</strong> writes the same value as a single fraction where the numerator ≥ denominator (e.g., 11/4). They represent the same quantity.</p>

            <h3>Can every mixed number be converted to an improper fraction?</h3>
            <p>Yes — every mixed number has an equivalent improper fraction. The conversion simply re-expresses the whole parts as fractional parts. For example, 1 1/2 = 3/2, 10 3/4 = 43/4, etc.</p>

            <h3>Should I simplify the improper fraction after converting?</h3>
            <p>If possible, yes. Use our <a href="/math-calculators/fraction-simplifier">Fraction Simplifier</a> to reduce the improper fraction to lowest terms. For example, 2 4/8 = 20/8, which simplifies to 5/2.</p>

            <h3>How do I convert back from an improper fraction to a mixed number?</h3>
            <p>Divide the numerator by the denominator. The quotient is the whole number, and the remainder is the new numerator. For example, 17/5: 17 ÷ 5 = 3 remainder 2 → <strong>3 2/5</strong>. See our <a href="/math-calculators/fraction-to-mixed-number-calculator">Fraction to Mixed Number Calculator</a>.</p>
        `,
        formula: {
            formula: "Improper Fraction = (w × d + n) / d",
            variables: [
                { symbol: "w", meaning: "Whole number part" },
                { symbol: "n", meaning: "Numerator of the fractional part" },
                { symbol: "d", meaning: "Denominator of the fractional part" },
            ],
            example: [
                { label: "2 1/4", substitution: "(2 × 4 + 1) / 4 = 9 / 4", result: "9/4" },
                { label: "3 2/5", substitution: "(3 × 5 + 2) / 5 = 17 / 5", result: "17/5" },
                { label: "1 7/8", substitution: "(1 × 8 + 7) / 8 = 15 / 8", result: "15/8" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions back to mixed numbers" },
            { title: "Mixed Number Calculator", slug: "mixed-number-calculator", categorySlug: "math-calculators", description: "Add, subtract, multiply mixed numbers" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Reduce the improper fraction" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with fractions" },
            { title: "Compare Fractions", slug: "compare-fractions-calculator", categorySlug: "math-calculators", description: "Compare mixed numbers and fractions" },
        ],
    },

    /* ─── 21. SOLVE FOR UNKNOWN FRACTION — RICH CONTENT ─── */
    "solve-for-unknown-fraction": {
        subtitle: "Solve for x in a proportion with fractions using cross-multiplication. Find the unknown numerator or denominator with step-by-step work.",
        contentHTML: `
            <h2 id="how-to-solve">How to Solve Fractions in Algebraic Equations</h2>
            <p>When you have a proportion like <strong>a/b = c/d</strong> with one unknown value (x), you can solve for x using <strong>cross-multiplication</strong>. This technique works whether x is a numerator or a denominator.</p>

            <h3 id="step-cross">Step One: Cross Multiply</h3>
            <p>Multiply each numerator by the opposite denominator. This eliminates the fractions and creates a simple equation.</p>
            <p><strong>Example:</strong> Solve x/3 = 3/4.</p>
            <ul>
                <li>Cross multiply: x × 4 = 3 × 3</li>
                <li>4x = 9</li>
            </ul>

            <h3 id="step-solve">Step Two: Solve for x</h3>
            <p>Isolate x by dividing both sides by the coefficient next to x.</p>
            <ul>
                <li>4x = 9</li>
                <li>x = 9 / 4 = <strong>9/4</strong></li>
            </ul>

            <h3 id="step-reduce">Step Three: Simplify the Result</h3>
            <p><a href="/math-calculators/fraction-simplifier">Simplify the fraction</a> if possible, and convert to a <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed number</a> if needed.</p>
            <ul>
                <li>9/4 cannot be simplified (GCD = 1)</li>
                <li>As mixed number: 9 ÷ 4 = 2 remainder 1 → <strong>2 1/4</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Cross-multiplication rule:</strong> For a/b = c/d: a × d = b × c. This works because both sides equal the same value when multiplied by both denominators.
            </div>

            <h2 id="more-examples">More Worked Examples</h2>
            <p><strong>Example 1:</strong> Solve 5/x = 10/6 (unknown denominator).</p>
            <ul>
                <li>Cross multiply: 5 × 6 = 10 × x → 30 = 10x</li>
                <li>x = 30 / 10 = <strong>3</strong></li>
                <li>Check: 5/3 = 10/6 ✓ (both equal 1.667)</li>
            </ul>
            <p><strong>Example 2:</strong> Solve 1/2 = x/100 (finding an <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a>).</p>
            <ul>
                <li>Cross multiply: 1 × 100 = 2 × x → 100 = 2x</li>
                <li>x = 100 / 2 = <strong>50</strong></li>
                <li>Check: 1/2 = 50/100 ✓</li>
            </ul>

            <h2 id="multiples-method">The Multiples Shortcut</h2>
            <p>For simpler proportions, you can spot the relationship by looking at multiples. If 1/2 = x/100, notice that the denominator went from 2 to 100 (multiplied by 50). So the numerator must also be multiplied by 50: 1 × 50 = <strong>50</strong>.</p>
            <p>This shortcut works when the unknown is a simple multiple of a known fraction, but cross-multiplication always works.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is cross-multiplication?</h3>
            <p><strong>Cross-multiplication</strong> is a method for solving proportions (a/b = c/d). You multiply each numerator by the opposite denominator: a × d = b × c. This converts the proportion into a simple equation without fractions.</p>

            <h3>Can x be a decimal or fraction?</h3>
            <p>Yes. The unknown value may not always be a whole number. In the example x/3 = 3/4, x = 9/4 = 2.25. The calculator always shows the result as a decimal, fraction, and mixed number.</p>

            <h3>Can I solve for the denominator instead of the numerator?</h3>
            <p>Absolutely. Cross-multiplication works regardless of which position is unknown. Use the dropdown in our calculator to select which value (numerator or denominator on either side) you want to solve for.</p>

            <h3>What if one of the values is 0?</h3>
            <p>If the unknown's coefficient turns out to be 0 (e.g., 0/x = something), division by zero is undefined. The calculator will handle this gracefully.</p>

            <h3>How is this related to equivalent fractions?</h3>
            <p>Solving for x in a proportion is essentially finding an <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a>. If a/b = c/d, then a/b and c/d are equivalent fractions, and cross-multiplication lets you find the missing piece.</p>
        `,
        formula: {
            formula: "a/b = c/d → a × d = b × c → solve for unknown",
            variables: [
                { symbol: "a, b", meaning: "Numerator and denominator of the first fraction" },
                { symbol: "c, d", meaning: "Numerator and denominator of the second fraction" },
                { symbol: "x", meaning: "The unknown value in one of the four positions" },
            ],
            example: [
                { label: "x/3 = 3/4", substitution: "x × 4 = 3 × 3 → 4x = 9", result: "x = 9/4 = 2 1/4" },
                { label: "5/x = 10/6", substitution: "5 × 6 = 10 × x → 30 = 10x", result: "x = 3" },
                { label: "1/2 = x/100", substitution: "1 × 100 = 2 × x → 100 = 2x", result: "x = 50" },
            ],
        },
        relatedCalculators: [
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Find equivalent fractions" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Reduce the result" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with fractions" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify fractions" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert improper fractions" },
        ],
    },

    /* ─── 22. FRACTION TO PERCENT — RICH CONTENT ─── */
    "fraction-to-percent-calculator": {
        subtitle: "Convert any fraction or mixed number to a percentage. See the step-by-step division and multiplication with a common conversion chart.",
        contentHTML: `
            <h2 id="how-to-convert">How to Convert a Fraction to Percent</h2>
            <p>Converting a fraction to a percentage is a simple two-step process: <strong>divide</strong>, then <strong>multiply by 100</strong>.</p>

            <h3 id="step-decimal">Step One: Convert to a Decimal</h3>
            <p>Divide the numerator by the denominator to get a decimal value.</p>
            <p><strong>Example:</strong> Convert 3/4 to a percentage.</p>
            <ul>
                <li>3 ÷ 4 = <strong>0.75</strong></li>
            </ul>
            <p>The fraction does <em>not</em> need to be in <a href="/math-calculators/fraction-simplifier">simplest form</a> — 6/8 gives the same result (6 ÷ 8 = 0.75).</p>

            <h3 id="step-percent">Step Two: Multiply by 100</h3>
            <p>Multiply the decimal by 100 (or move the decimal point two places right) and add a percent sign.</p>
            <ul>
                <li>0.75 × 100 = <strong>75%</strong></li>
            </ul>
            <p>So 3/4 as a percent is <strong>75%</strong>.</p>

            <div class="explanation__highlight">
                <strong>Quick formula:</strong> Percentage = (numerator ÷ denominator) × 100%. In one step: divide, move decimal two places right.
            </div>

            <h2 id="mixed-number">How to Convert a Mixed Number to Percent</h2>
            <p>For a <a href="/math-calculators/mixed-number-calculator">mixed number</a> like 1 3/4, you have two approaches:</p>
            <p><strong>Method 1: Convert fraction part, add whole part.</strong></p>
            <ol>
                <li>Convert 3/4 to percent: 75%</li>
                <li>Convert whole number: 1 × 100% = 100%</li>
                <li>Add: 100% + 75% = <strong>175%</strong></li>
            </ol>
            <p><strong>Method 2: Convert to <a href="/math-calculators/mixed-number-to-fraction-calculator">improper fraction</a> first.</strong></p>
            <ol>
                <li>1 3/4 = 7/4</li>
                <li>7 ÷ 4 = 1.75</li>
                <li>1.75 × 100 = <strong>175%</strong></li>
            </ol>

            <h2 id="chart">Fraction to Percent Conversion Chart</h2>
            <p>Common fractions and their percent equivalents:</p>
            <table>
                <thead><tr><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead>
                <tbody>
                    <tr><td>1/2</td><td>0.5</td><td>50%</td></tr>
                    <tr><td>1/3</td><td>0.3333</td><td>33.33%</td></tr>
                    <tr><td>2/3</td><td>0.6667</td><td>66.67%</td></tr>
                    <tr><td>1/4</td><td>0.25</td><td>25%</td></tr>
                    <tr><td>3/4</td><td>0.75</td><td>75%</td></tr>
                    <tr><td>1/5</td><td>0.2</td><td>20%</td></tr>
                    <tr><td>2/5</td><td>0.4</td><td>40%</td></tr>
                    <tr><td>3/5</td><td>0.6</td><td>60%</td></tr>
                    <tr><td>4/5</td><td>0.8</td><td>80%</td></tr>
                    <tr><td>1/8</td><td>0.125</td><td>12.5%</td></tr>
                    <tr><td>3/8</td><td>0.375</td><td>37.5%</td></tr>
                    <tr><td>5/8</td><td>0.625</td><td>62.5%</td></tr>
                    <tr><td>7/8</td><td>0.875</td><td>87.5%</td></tr>
                    <tr><td>1/10</td><td>0.1</td><td>10%</td></tr>
                </tbody>
            </table>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the formula to convert a fraction to a percent?</h3>
            <p>The formula is: <strong>Percent = (numerator ÷ denominator) × 100</strong>. Divide the top by the bottom to get a decimal, then multiply by 100 to get the percentage.</p>

            <h3>Can a fraction be more than 100%?</h3>
            <p>Yes — any <strong>improper fraction</strong> (numerator ≥ denominator) converts to 100% or more. For example, 5/4 = 125%, and 2 1/2 = 250%. This simply means the fraction represents more than one whole.</p>

            <h3>What about repeating decimals like 1/3?</h3>
            <p>1/3 = 0.3333… = <strong>33.33…%</strong> (repeating). The calculator shows this rounded to a reasonable number of decimal places. The exact value is 33⅓%.</p>

            <h3>Is 1/2 always 50%?</h3>
            <p>Yes — 1/2 = 0.5 = 50%, always. Any <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a> like 2/4, 3/6, 50/100 also equals 50%.</p>

            <h3>How do I convert a percent back to a fraction?</h3>
            <p>Divide the percent by 100 to get a decimal, then convert the <a href="/math-calculators/decimal-to-fraction-calculator">decimal to a fraction</a>. For example, 75% = 0.75 = 3/4.</p>
        `,
        formula: {
            formula: "Percentage = (n ÷ d) × 100%",
            variables: [
                { symbol: "n", meaning: "Numerator of the fraction" },
                { symbol: "d", meaning: "Denominator of the fraction" },
            ],
            example: [
                { label: "3/4", substitution: "(3 ÷ 4) × 100 = 0.75 × 100", result: "75%" },
                { label: "1/3", substitution: "(1 ÷ 3) × 100 = 0.3333 × 100", result: "33.33%" },
                { label: "1 3/4 (mixed)", substitution: "(7 ÷ 4) × 100 = 1.75 × 100", result: "175%" },
            ],
        },
        relatedCalculators: [
            { title: "Decimal to Fraction", slug: "decimal-to-fraction-calculator", categorySlug: "math-calculators", description: "Convert percent back to fraction" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Simplify before converting" },
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Find equivalent percentages" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate percentage of a number" },
            { title: "Mixed Number to Fraction", slug: "mixed-number-to-fraction-calculator", categorySlug: "math-calculators", description: "Convert mixed numbers first" },
        ],
    },

    /* ─── 23. ADD FRACTIONS — RICH CONTENT ─── */
    "add-fractions-calculator": {
        subtitle: "Add fractions with different denominators — including mixed numbers and negative fractions. See the step-by-step LCD conversion, addition, and simplification with the result as a fraction, mixed number, and decimal.",
        contentHTML: `
            <h2 id="how-to-add-fractions">How to Add Fractions</h2>
            <p>A <strong>fraction</strong> is a numerical value that represents a part of a whole, written as one number over another separated by a line: <em>numerator / denominator</em>. Adding fractions is a bit different from adding regular whole numbers because the fractions must share a <strong>common denominator</strong> before you can combine them.</p>
            <p>Our calculator above handles the complete process — just enter two fractions (with optional whole numbers for mixed fractions), and it will find the LCD, convert, add, and simplify for you, showing every step.</p>

            <h3 id="fraction-addition-formula">Fraction Addition Formula</h3>
            <p>The formula for adding two fractions is:</p>
            <p><strong>a/b + c/d = (a×d + b×c) / (b×d)</strong></p>
            <p>This formula works by cross-multiplying to ensure both fractions have a common denominator. To add two fractions, complete the following:</p>
            <ol>
                <li>Multiply the numerator of the first fraction (<em>a</em>) by the denominator of the second fraction (<em>d</em>).</li>
                <li>Multiply the denominator of the first fraction (<em>b</em>) by the numerator of the second fraction (<em>c</em>).</li>
                <li>Add the products from steps 1 and 2 (<em>ad + bc</em>).</li>
                <li>Divide the sum by the product of both denominators (<em>b × d</em>).</li>
            </ol>
            <p>You can also follow the three-step method below, which uses the <a href="/math-calculators/lcd-calculator">Least Common Denominator (LCD)</a> for smaller, more manageable numbers.</p>

            <h3 id="step-lcd">Step One: Convert to Fractions with the LCD</h3>
            <p>When adding fractions, the first step is to ensure they have the <strong>same denominator</strong>. Find the <a href="/math-calculators/lcd-calculator">Least Common Denominator (LCD)</a> — the smallest number that both denominators divide into evenly. Then convert each fraction to an <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a> with that common denominator.</p>
            <p>To convert each fraction, divide the LCD by the fraction's denominator to find the <strong>multiplier</strong>, then multiply both the numerator and denominator by that multiplier.</p>
            <p><strong>Example:</strong> Add 1/3 + 1/4.</p>
            <ul>
                <li>Find the LCD of 3 and 4: <strong>LCD = 12</strong></li>
                <li>Multiplier for 1/3: 12 ÷ 3 = <strong>4</strong> → 1/3 = (1×4)/(3×4) = <strong>4/12</strong></li>
                <li>Multiplier for 1/4: 12 ÷ 4 = <strong>3</strong> → 1/4 = (1×3)/(4×3) = <strong>3/12</strong></li>
            </ul>

            <h3 id="step-add-numerators">Step Two: Add the Numerators</h3>
            <p>Once both fractions have the same denominator, simply <strong>add the numerators</strong> and keep the denominator the same.</p>
            <p><strong>Continuing the example:</strong></p>
            <p>4/12 + 3/12 = (4 + 3) / 12 = <strong>7/12</strong></p>

            <h3 id="step-simplify">Step Three: Simplify the Fraction</h3>
            <p>The final step is to <strong>simplify</strong> (reduce) the fraction to its lowest terms. Find the <a href="/math-calculators/gcd-calculator">Greatest Common Factor (GCF)</a> of the numerator and denominator, then divide both by it. You can also use our <a href="/math-calculators/fraction-simplifier">Fraction Simplifier</a> to reduce any fraction instantly.</p>
            <p>In our example, 7/12 is already in simplest form because GCF(7, 12) = 1. The answer is <strong>7/12 ≈ 0.5833</strong>.</p>

            <div class="explanation__highlight">
                <strong>Key rule:</strong> You can only add the <em>numerators</em> — never the denominators. The denominator represents the size of each piece, and the pieces must be the same size before you can add them together.
            </div>

            <h2 id="mixed-numbers">How to Add Mixed Numbers</h2>
            <p>A <strong>mixed number</strong> is a number with both a whole number and a proper fraction, like 1 2/3. The process of adding mixed numbers is nearly the same as adding normal fractions, with one extra step at the beginning.</p>
            <p>First, convert each mixed number to an <a href="/math-calculators/mixed-number-to-fraction-calculator">improper fraction</a>:</p>
            <ol>
                <li>Multiply the whole number by the denominator.</li>
                <li>Add the result to the numerator.</li>
                <li>Keep the same denominator.</li>
            </ol>
            <p><strong>Example:</strong> Add 1 2/3 + 2 1/4.</p>
            <ul>
                <li>Convert 1 2/3: (1 × 3) + 2 = 5 → <strong>5/3</strong></li>
                <li>Convert 2 1/4: (2 × 4) + 1 = 9 → <strong>9/4</strong></li>
                <li>LCD(3, 4) = 12</li>
                <li>5/3 = 20/12, 9/4 = 27/12</li>
                <li>20/12 + 27/12 = <strong>47/12</strong></li>
                <li>As a mixed number: <strong>3 11/12</strong></li>
            </ul>

            <h2 id="negative-fractions">How to Add Negative Fractions</h2>
            <p>A <strong>negative fraction</strong> has a minus sign either in front of the fraction, the numerator, or the denominator. All three representations are equivalent:</p>
            <p><strong>−a/b = (−a)/b = a/(−b)</strong></p>
            <p>If <em>both</em> the numerator and the denominator are negative, the fraction is actually <strong>positive</strong> (negative ÷ negative = positive).</p>
            <p>When adding negative fractions, it's easiest to attach the sign to the numerator, then use the standard addition formula above. The addition and simplification steps are the same — just keep track of the signs.</p>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>Can you add fractions and decimals?</h3>
            <p>Yes, but you need to convert one value to match the other's format first. Either convert the decimal to a <a href="/math-calculators/decimal-to-fraction-calculator">fraction</a> or convert the fraction to a decimal, then add. For example, to add 1/2 + 0.25, convert 0.25 to 1/4, then add: 1/2 + 1/4 = <strong>3/4</strong>.</p>

            <h3>What are the rules to add fractions?</h3>
            <p>The four rules to add fractions are:</p>
            <ol>
                <li>Find a common denominator (the <a href="/math-calculators/lcd-calculator">LCD</a>).</li>
                <li>Convert both fractions to <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> with the LCD.</li>
                <li>Add the numerators and keep the denominator.</li>
                <li><a href="/math-calculators/fraction-simplifier">Simplify</a> the result.</li>
            </ol>
            <p>If you're adding mixed numbers, convert them to improper fractions first.</p>

            <h3>Why can't you add the denominators of fractions?</h3>
            <p>Denominators represent the <strong>number of equal parts</strong> a whole has been divided into, while numerators represent how many of those parts you have. When fractions have different denominators, the "pieces" are different sizes — you can't simply add denominators because that would change the size of the pieces. You must first make the pieces the same size (common denominator), then count how many you have (add the numerators).</p>

            <h3>Can I add more than two fractions at a time?</h3>
            <p>Yes! Follow the same process — find a common denominator for <em>all</em> the fractions, convert them, then add all the numerators. Use our <a href="/math-calculators/fraction-calculator">Fraction Calculator</a> for multi-fraction operations, or use this calculator twice (add the first result to the third fraction).</p>

            <h3>What if the fractions already have the same denominator?</h3>
            <p>Even easier — skip Step One and just add the numerators directly. For example, 2/7 + 3/7 = (2 + 3)/7 = <strong>5/7</strong>.</p>
        `,
        formula: {
            formula: "a/b + c/d = (a×d + b×c) / (b×d)",
            variables: [
                { symbol: "a/b", meaning: "First fraction (a = numerator, b = denominator)" },
                { symbol: "c/d", meaning: "Second fraction (c = numerator, d = denominator)" },
                { symbol: "LCD", meaning: "Least Common Denominator of b and d" },
            ],
            example: [
                { label: "1/3 + 1/4", substitution: "(1×4 + 3×1) / (3×4) = 7/12", result: "7/12 ≈ 0.5833" },
                { label: "2/5 + 1/3", substitution: "LCD=15 → 6/15 + 5/15 = 11/15", result: "11/15" },
                { label: "1 2/3 + 2 1/4", substitution: "5/3 + 9/4 = 20/12 + 27/12 = 47/12", result: "3 11/12" },
            ],
        },
        relatedCalculators: [
            { title: "Subtract Fractions", slug: "subtract-fractions-calculator", categorySlug: "math-calculators", description: "Subtract fractions with different denominators" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "All fraction operations (add, subtract, multiply, divide)" },
            { title: "LCD Calculator", slug: "lcd-calculator", categorySlug: "math-calculators", description: "Find the common denominator" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Simplify the result" },
            { title: "Mixed Number Calculator", slug: "mixed-number-calculator", categorySlug: "math-calculators", description: "Add mixed numbers with all operations" },
        ],
    },

    /* ─── 24. SUBTRACT FRACTIONS — RICH CONTENT ─── */
    "subtract-fractions-calculator": {
        subtitle: "Subtract fractions with different denominators. See the step-by-step LCD conversion, subtraction, and simplification with the result as a fraction, mixed number, and decimal.",
        contentHTML: `
            <h2 id="how-to-subtract">How to Subtract Fractions</h2>
            <p>Subtracting fractions follows the same principle as <a href="/math-calculators/fraction-calculator">adding fractions</a> — you need a <strong>common denominator</strong> before you can operate on the numerators.</p>

            <h3 id="formula">Fraction Subtraction Formula</h3>
            <p>The shortcut formula for subtracting two fractions is:</p>
            <p><strong>a/b − c/d = (a×d − c×b) / (b×d)</strong></p>
            <p>This works by cross-multiplying to get matching denominators automatically. However, it's often easier to find the <a href="/math-calculators/lcd-calculator">LCD</a> first for smaller numbers.</p>

            <h3 id="step-lcd">Step One: Find a Common Denominator</h3>
            <p>Find the <strong>Least Common Denominator (LCD)</strong> of both denominators, then convert each fraction to an <a href="/math-calculators/equivalent-fractions-calculator">equivalent fraction</a> with that denominator.</p>
            <p><strong>Example:</strong> Subtract 1/2 − 1/3.</p>
            <ul>
                <li>LCD(2, 3) = 6</li>
                <li>1/2 = 3/6 (multiply by 3/3)</li>
                <li>1/3 = 2/6 (multiply by 2/2)</li>
            </ul>

            <h3 id="step-subtract">Step Two: Subtract the Numerators</h3>
            <p>With matching denominators, subtract the second numerator from the first. Keep the denominator.</p>
            <ul>
                <li>3/6 − 2/6 = (3 − 2) / 6 = <strong>1/6</strong></li>
            </ul>

            <h3 id="step-simplify">Step Three: Simplify</h3>
            <p><a href="/math-calculators/fraction-simplifier">Simplify</a> the result by dividing both numerator and denominator by their <a href="/math-calculators/gcd-calculator">GCD</a>. Convert to a <a href="/math-calculators/fraction-to-mixed-number-calculator">mixed number</a> if it's improper.</p>
            <ul>
                <li>1/6 — GCD(1, 6) = 1, already simplified ✓</li>
            </ul>

            <div class="explanation__highlight">
                <strong>Key rule:</strong> You can only subtract the <em>numerators</em> — never the denominators. The denominator tells you the size of each piece, and the pieces must be the same size before you can subtract.
            </div>

            <h2 id="mixed-numbers">Subtracting Mixed Numbers</h2>
            <p>To subtract <a href="/math-calculators/mixed-number-calculator">mixed numbers</a>, first convert them to <a href="/math-calculators/mixed-number-to-fraction-calculator">improper fractions</a>, then follow the same steps.</p>
            <p><strong>Example:</strong> 3 1/4 − 1 2/3</p>
            <ol>
                <li>Convert: 3 1/4 = 13/4, 1 2/3 = 5/3</li>
                <li>LCD(4, 3) = 12</li>
                <li>13/4 = 39/12, 5/3 = 20/12</li>
                <li>39/12 − 20/12 = 19/12</li>
                <li>As mixed number: <strong>1 7/12</strong></li>
            </ol>

            <h2 id="negative-results">What if the Result is Negative?</h2>
            <p>When you subtract a larger fraction from a smaller one, the result is <strong>negative</strong>. This is perfectly valid.</p>
            <p><strong>Example:</strong> 1/4 − 1/2</p>
            <ul>
                <li>1/4 = 1/4, 1/2 = 2/4</li>
                <li>1/4 − 2/4 = <strong>−1/4</strong></li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>Can you subtract fractions with different denominators?</h3>
            <p>Not directly — you must first convert them to <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> with a <a href="/math-calculators/lcd-calculator">common denominator</a>. Once the denominators match, subtract the numerators and keep the denominator.</p>

            <h3>What are the three rules for subtracting fractions?</h3>
            <p><strong>1)</strong> Find the LCD and convert both fractions. <strong>2)</strong> Subtract the numerators, keeping the denominator. <strong>3)</strong> <a href="/math-calculators/fraction-simplifier">Simplify</a> the result using the GCD.</p>

            <h3>Why can't you subtract the denominators?</h3>
            <p>Denominators represent the <em>size of each piece</em>, not a quantity. Subtracting them would change the piece size, which doesn't make mathematical sense. You can only subtract numerators (the <em>number</em> of pieces) once the pieces are the same size.</p>

            <h3>Can you subtract fractions and decimals together?</h3>
            <p>Yes, but first convert everything to the same format. Either convert the decimal to a <a href="/math-calculators/decimal-to-fraction-calculator">fraction</a> or convert the fraction to a <a href="/math-calculators/fraction-to-percent-calculator">decimal</a>, then subtract.</p>

            <h3>What if the fractions already have the same denominator?</h3>
            <p>Even easier! Skip Step One and just subtract the numerators directly. For example, 5/8 − 3/8 = (5 − 3)/8 = <strong>2/8 = 1/4</strong>.</p>
        `,
        formula: {
            formula: "a/b − c/d = (a×d − c×b) / (b×d)",
            variables: [
                { symbol: "a/b", meaning: "First fraction (minuend)" },
                { symbol: "c/d", meaning: "Second fraction (subtrahend)" },
                { symbol: "LCD", meaning: "Least Common Denominator of b and d" },
            ],
            example: [
                { label: "1/2 − 1/3", substitution: "(1×3 − 1×2) / (2×3) = 1/6", result: "1/6" },
                { label: "3/4 − 1/4", substitution: "(3 − 1) / 4", result: "1/2" },
                { label: "3 1/4 − 1 2/3", substitution: "13/4 − 5/3 = 39/12 − 20/12 = 19/12", result: "1 7/12" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "All fraction operations" },
            { title: "LCD Calculator", slug: "lcd-calculator", categorySlug: "math-calculators", description: "Find the common denominator" },
            { title: "Fraction Simplifier", slug: "fraction-simplifier", categorySlug: "math-calculators", description: "Simplify the result" },
            { title: "Mixed Number Calculator", slug: "mixed-number-calculator", categorySlug: "math-calculators", description: "Subtract mixed numbers" },
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Convert to matching denominators" },
        ],
    },

    /* ─── 25. ANGLE CONVERTER — RICH CONTENT ─── */
    "angle-converter-calculator": {
        subtitle: "Convert angle measurements instantly between degrees, radians, gradians, arcminutes, arcseconds, milliradians, revolutions, and mils. See step-by-step formulas and a complete conversion table for all 9 units.",
        contentHTML: `
            <h2 id="what-is-angle">What Is an Angle?</h2>
            <p>An <strong>angle</strong> measures the amount of rotation between two lines or planes that share a common point (called the <strong>vertex</strong>). Angles are fundamental to geometry, trigonometry, navigation, construction, physics, and engineering.</p>
            <p>A full rotation around a point is <strong>360 degrees</strong> (°), which is equivalent to <strong>2π radians</strong>, <strong>400 gradians</strong>, or <strong>1 revolution</strong>. Our converter above supports all 9 standard angle units and shows the value in every unit simultaneously.</p>

            <h2 id="angle-units">Angle Units Explained</h2>

            <h3 id="degrees">Degrees (°)</h3>
            <p>The most common angle unit. A full circle is <strong>360°</strong>. The number 360 was likely chosen by ancient Babylonian astronomers because it has 24 divisors, making it easy to subdivide. Degrees are the <strong>SI accepted</strong> unit for angle and are used in everyday life, education, construction, and navigation.</p>
            <p>Degrees can be further divided into <strong>arcminutes</strong> (′) and <strong>arcseconds</strong> (″). There are 60 arcminutes in 1 degree and 60 arcseconds in 1 arcminute (so 3,600 arcseconds per degree). This notation — called DMS (degrees, minutes, seconds) — is used in GPS coordinates and astronomy.</p>

            <h3 id="radians">Radians (rad)</h3>
            <p>The <strong>SI derived unit</strong> for angle. A radian is defined as the angle subtended by an arc whose length equals the radius of the circle. A full circle is <strong>2π ≈ 6.2832 radians</strong>. Radians are essential in calculus, physics, and engineering because trigonometric functions (sin, cos, tan) work most naturally in radians.</p>
            <p>Key values: <strong>π/6 = 30°</strong>, <strong>π/4 = 45°</strong>, <strong>π/3 = 60°</strong>, <strong>π/2 = 90°</strong>, <strong>π = 180°</strong>, <strong>2π = 360°</strong>.</p>

            <h3 id="gradians">Gradians (grad/gon)</h3>
            <p>Used primarily in <strong>surveying and land measurement</strong>. A full circle is <strong>400 gradians</strong>, making right angles exactly 100 grad — convenient for survey calculations. Also called <em>gons</em> or <em>grades</em>. One gradian equals 0.9 degrees.</p>

            <h3 id="milliradians">Milliradians (mrad)</h3>
            <p>One-thousandth of a radian. Used extensively in <strong>military ballistics</strong>, <strong>optics</strong>, and <strong>telescopic sights</strong>. At 1,000 meters, 1 milliradian subtends approximately 1 meter — making distance estimation intuitive. A full circle is approximately 6,283 milliradians.</p>

            <h3 id="mils">Mils (NATO)</h3>
            <p>The <strong>NATO mil</strong> divides a circle into <strong>6,400 mils</strong>. Used in military artillery and navigation for its practical divisibility. Not to be confused with milliradians — though similar in purpose, they differ slightly in value: 1 NATO mil = 0.05625° (vs. 1 mrad ≈ 0.05730°).</p>

            <h3 id="other-units">Revolutions, Circles, Arcminutes &amp; Arcseconds</h3>
            <p>A <strong>revolution</strong> (or <strong>circle</strong>) is one complete rotation = 360°. Used in rotational mechanics (RPM = revolutions per minute). <strong>Arcminutes</strong> (1° = 60′) and <strong>arcseconds</strong> (1′ = 60″) provide precision for astronomy, GPS coordinates, and geodesy.</p>

            <h2 id="how-to-convert-degrees-radians">How to Convert Degrees to Radians</h2>
            <p>Since <strong>π radians = 180°</strong>, the conversion formula is:</p>
            <p><strong>radians = degrees × π / 180</strong></p>
            <p><strong>Example:</strong> Convert 90° to radians.</p>
            <ul>
                <li>radians = 90 × π / 180</li>
                <li>radians = 90π / 180</li>
                <li>Simplify: 90/180 = 1/2</li>
                <li>radians = <strong>π/2 ≈ 1.5708 rad</strong></li>
            </ul>

            <h2 id="how-to-convert-radians-degrees">How to Convert Radians to Degrees</h2>
            <p>The reverse formula is:</p>
            <p><strong>degrees = radians × 180 / π</strong></p>
            <p><strong>Example:</strong> Convert 1 radian to degrees.</p>
            <ul>
                <li>degrees = 1 × 180 / π</li>
                <li>degrees = 180 / 3.14159…</li>
                <li>degrees ≈ <strong>57.2958°</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Quick reference:</strong> To convert degrees → radians, multiply by <strong>0.017453</strong>. To convert radians → degrees, multiply by <strong>57.2958</strong>. For gradians, multiply degrees by <strong>10/9</strong>.
            </div>

            <h2 id="conversion-table">Common Angle Conversion Table</h2>
            <table>
                <thead>
                    <tr><th>Degrees (°)</th><th>Radians (rad)</th><th>Gradians (grad)</th><th>Revolutions</th></tr>
                </thead>
                <tbody>
                    <tr><td>0°</td><td>0</td><td>0</td><td>0</td></tr>
                    <tr><td>30°</td><td>π/6 ≈ 0.5236</td><td>33.333</td><td>1/12</td></tr>
                    <tr><td>45°</td><td>π/4 ≈ 0.7854</td><td>50</td><td>1/8</td></tr>
                    <tr><td>60°</td><td>π/3 ≈ 1.0472</td><td>66.667</td><td>1/6</td></tr>
                    <tr><td>90°</td><td>π/2 ≈ 1.5708</td><td>100</td><td>1/4</td></tr>
                    <tr><td>120°</td><td>2π/3 ≈ 2.0944</td><td>133.333</td><td>1/3</td></tr>
                    <tr><td>180°</td><td>π ≈ 3.1416</td><td>200</td><td>1/2</td></tr>
                    <tr><td>270°</td><td>3π/2 ≈ 4.7124</td><td>300</td><td>3/4</td></tr>
                    <tr><td>360°</td><td>2π ≈ 6.2832</td><td>400</td><td>1</td></tr>
                </tbody>
            </table>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>Why are radians used instead of degrees in math?</h3>
            <p>Radians simplify formulas in calculus and physics. The derivative of sin(x) is cos(x) <em>only</em> when x is in radians. In degrees, there would be an extra factor of π/180 in every derivative and integral. Radians also connect arc length directly to angle: arc length = radius × angle (in radians).</p>

            <h3>How many radians are in a full circle?</h3>
            <p>A full circle is <strong>2π radians</strong> (approximately 6.2832 radians). This follows from the definition: the circumference of a circle is 2πr, and dividing by the radius r gives 2π.</p>

            <h3>What is a gradian and when is it used?</h3>
            <p>A gradian (also called a <em>gon</em>) divides a right angle into exactly <strong>100 parts</strong>, making a full circle 400 gradians. This decimal-friendly system is used primarily in <strong>surveying</strong>, <strong>civil engineering</strong>, and in some European countries for land measurement. Many survey calculators and total stations support gradians natively.</p>

            <h3>What is the difference between a mil and a milliradian?</h3>
            <p>A <strong>milliradian</strong> is exactly 1/1000 of a radian (≈ 0.05730°). A <strong>NATO mil</strong> divides the circle into 6,400 parts (= 0.05625°). They are close but not identical. The NATO mil was chosen for military use because 6,400 is easily divisible by powers of 2, simplifying field calculations.</p>

            <h3>How do arcminutes and arcseconds relate to degrees?</h3>
            <p><strong>1 degree = 60 arcminutes = 3,600 arcseconds.</strong> This sexagesimal (base-60) system was inherited from Babylonian mathematics. GPS coordinates use DMS notation: 40° 26′ 46″ N means 40 degrees, 26 arcminutes, 46 arcseconds north latitude.</p>

            <h3>Can I measure angles with a protractor?</h3>
            <p>Yes — a protractor is the standard tool for measuring angles in degrees. Place the center point on the vertex of the angle, align one side with the base line (0°), and read where the other side crosses the scale. Protractors typically measure 0°–180° (half-circle) or 0°–360° (full-circle).</p>
        `,
        formula: {
            formula: "radians = degrees × π / 180",
            variables: [
                { symbol: "°", meaning: "Degrees — 360° per full circle" },
                { symbol: "rad", meaning: "Radians — 2π per full circle (SI derived unit)" },
                { symbol: "grad", meaning: "Gradians — 400 per full circle (surveying)" },
                { symbol: "mrad", meaning: "Milliradians — 1/1000 radian (military/optics)" },
                { symbol: "mil", meaning: "NATO mils — 6400 per full circle (artillery)" },
            ],
            example: [
                { label: "90° → radians", substitution: "90 × π / 180 = π/2", result: "1.5708 rad" },
                { label: "1 rad → degrees", substitution: "1 × 180 / π", result: "57.2958°" },
                { label: "45° → gradians", substitution: "45 × (400/360)", result: "50 grad" },
            ],
        },
        relatedCalculators: [
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate percentages and ratios" },
            { title: "Quadratic Equation Solver", slug: "quadratic-equation-solver", categorySlug: "math-calculators", description: "Solve equations involving angles" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers for trig values" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Work with fractional angle values" },
            { title: "LCM Calculator", slug: "lcm-calculator", categorySlug: "math-calculators", description: "Find common multiples for unit conversions" },
        ],
    },

    /* ─── 26. PARALLELOGRAM AREA — RICH CONTENT ─── */
    "parallelogram-area-calculator": {
        subtitle: "Calculate the area of a parallelogram using base & height, two sides & the interior angle, or the diagonals & angle between them. See the step-by-step formula and sine calculation for each method.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate the Area of a Parallelogram</h2>
            <p>A <strong>parallelogram</strong> is a four-sided figure (quadrilateral) with two pairs of <strong>parallel sides</strong>. Opposite sides are equal in length, and opposite angles are equal. Rectangles, rhombi, and squares are all special types of parallelograms.</p>
            <p>There are three ways to calculate the area of a parallelogram, depending on the information you have. Our calculator above supports all three methods — just select the one that matches your available measurements.</p>

            <h3 id="method-base-height">Method 1: Base and Height</h3>
            <p>The most common and simplest method. The formula is:</p>
            <p><strong>A = b × h</strong></p>
            <p>The area <em>A</em> equals the length of the <strong>base</strong> (<em>b</em>) multiplied by the perpendicular <strong>height</strong> (<em>h</em>). The height must be measured at a right angle (90°) to the base — <em>not</em> along the slanted side.</p>
            <p><strong>Example:</strong> A parallelogram with base = 10 and height = 6.</p>
            <ul>
                <li>A = 10 × 6 = <strong>60 square units</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Important:</strong> The height is the <em>perpendicular</em> distance between the base and the opposite side — not the length of the slanted side. If you only know the slanted side and the angle, use Method 2 instead.
            </div>

            <h3 id="method-sides-angle">Method 2: Two Sides and Interior Angle</h3>
            <p>When you know the lengths of two adjacent sides and the angle between them, use trigonometry:</p>
            <p><strong>A = a × b × sin(α)</strong></p>
            <p>The area equals the product of the two side lengths multiplied by the <strong>sine</strong> of the included angle <em>α</em>.</p>
            <p><strong>Example:</strong> Side a = 7, side b = 8, angle α = 60°.</p>
            <ul>
                <li>sin(60°) = 0.866025</li>
                <li>A = 7 × 8 × 0.866025 = <strong>48.50 square units</strong></li>
            </ul>
            <p>This method works because <em>h = a × sin(α)</em>, so the formula is equivalent to <em>b × h</em>. When α = 90°, sin(90°) = 1, and the parallelogram becomes a rectangle.</p>

            <h3 id="method-diagonals">Method 3: Diagonals and Angle Between</h3>
            <p>If you know the lengths of the two diagonals and the angle where they intersect:</p>
            <p><strong>A = ½ × d₁ × d₂ × sin(θ)</strong></p>
            <p>The area equals one-half the product of the two diagonal lengths multiplied by the sine of the angle <em>θ</em> between them.</p>
            <p><strong>Example:</strong> Diagonal d₁ = 9, diagonal d₂ = 12, angle θ = 30°.</p>
            <ul>
                <li>sin(30°) = 0.5</li>
                <li>A = ½ × 9 × 12 × 0.5 = <strong>27 square units</strong></li>
            </ul>

            <h2 id="properties">Properties of a Parallelogram</h2>
            <ul>
                <li><strong>Opposite sides</strong> are equal and parallel</li>
                <li><strong>Opposite angles</strong> are equal</li>
                <li><strong>Consecutive angles</strong> are supplementary (add up to 180°)</li>
                <li><strong>Diagonals bisect each other</strong> (they cross at their midpoints)</li>
                <li>The sum of all interior angles is <strong>360°</strong></li>
            </ul>

            <h2 id="special-cases">Special Cases</h2>
            <ul>
                <li><strong>Rectangle:</strong> A parallelogram where all angles are 90° → A = length × width</li>
                <li><strong>Rhombus:</strong> A parallelogram where all sides are equal → A = ½ × d₁ × d₂</li>
                <li><strong>Square:</strong> Both a rectangle and a rhombus → A = side²</li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the difference between base × height and side × side?</h3>
            <p>The <strong>base</strong> is one side of the parallelogram, but the <strong>height</strong> is the <em>perpendicular</em> distance to the opposite side — not the other side. In a parallelogram that isn't a rectangle, the slanted side is longer than the height. Using side × side would overestimate the area unless you multiply by sin(angle).</p>

            <h3>Do I need to know the angle to calculate area?</h3>
            <p>If you know the <strong>base and perpendicular height</strong>, no angle is needed (Method 1). If you only know the side lengths or diagonal lengths, then yes — you need an angle to use Method 2 or Method 3.</p>

            <h3>What if my angle is in radians?</h3>
            <p>Use our <a href="/math-calculators/angle-converter-calculator">Angle Converter</a> to convert radians to degrees first, or enter the angle in degrees directly. The calculator expects angles in degrees.</p>

            <h3>Is a rectangle a parallelogram?</h3>
            <p>Yes! A <strong>rectangle</strong> is a special parallelogram where all four angles are 90°. Since sin(90°) = 1, the area formula simplifies to A = base × height = length × width.</p>

            <h3>How do I find the height if I only know the sides and angle?</h3>
            <p>The height can be calculated from the side and angle: <strong>h = a × sin(α)</strong>, where <em>a</em> is the slanted side and <em>α</em> is the interior angle. Then use A = base × h.</p>
        `,
        formula: {
            formula: "A = b × h",
            variables: [
                { symbol: "A", meaning: "Area of the parallelogram" },
                { symbol: "b", meaning: "Length of the base" },
                { symbol: "h", meaning: "Perpendicular height (not slanted side)" },
                { symbol: "α", meaning: "Interior angle between sides (for Method 2)" },
                { symbol: "d₁, d₂", meaning: "Lengths of the two diagonals (for Method 3)" },
            ],
            example: [
                { label: "Base & Height", substitution: "A = 10 × 6", result: "60 sq units" },
                { label: "Sides & Angle", substitution: "A = 7 × 8 × sin(60°)", result: "48.50 sq units" },
                { label: "Diagonals & Angle", substitution: "A = ½ × 9 × 12 × sin(30°)", result: "27 sq units" },
            ],
        },
        relatedCalculators: [
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate percentages of areas" },
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert angle units for formulas" },
            { title: "Quadratic Equation Solver", slug: "quadratic-equation-solver", categorySlug: "math-calculators", description: "Solve geometry equations" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Work with fractional dimensions" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers for area units" },
        ],
    },

    /* ─── 27. ARC LENGTH — RICH CONTENT ─── */
    "arc-length-calculator": {
        subtitle: "Calculate the arc length of a circle sector using the radius and central angle, radius and chord, angle and chord, or sector area and angle. See the step-by-step formula, chord length, and sector area.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate Arc Length</h2>
            <p><strong>Arc length</strong> is the distance along the curved edge of a circle between two points — the curved portion of a <strong>sector</strong> (a pie-shaped slice of a circle). A sector is bounded by two radii and an arc.</p>
            <p>Our calculator supports four different input combinations to find arc length, plus it computes the <strong>chord length</strong>, <strong>sector area</strong>, and <strong>central angle</strong> automatically.</p>

            <h3 id="arc-length-formula">Arc Length Formula</h3>
            <p>The fundamental formula for arc length is:</p>
            <p><strong>s = r × θ</strong></p>
            <p>The arc length <em>s</em> equals the radius <em>r</em> times the central angle <em>θ</em> <strong>in radians</strong>. The angle must be in radians because radians are "unitless" — ensuring both sides have units of distance.</p>
            <p>If your angle is in degrees, convert it first:</p>
            <p><strong>θ (radians) = θ (degrees) × π / 180</strong></p>
            <p><strong>Example:</strong> Find the arc length of a sector with radius = 7 and central angle = 90°.</p>
            <ul>
                <li>Convert: 90° × π/180 = π/2 ≈ 1.5708 rad</li>
                <li>Arc length: s = 7 × 1.5708 = <strong>10.9956</strong></li>
            </ul>

            <h3 id="method-radius-chord">Using Radius and Chord Length</h3>
            <p>If you know the radius and chord but not the angle, find the angle first:</p>
            <p><strong>θ = 2 × sin⁻¹(a / 2r)</strong></p>
            <p>The central angle θ (in radians) equals 2 times the inverse sine of the chord length <em>a</em> divided by 2 times the radius <em>r</em>. Then use <em>s = r × θ</em>.</p>

            <h3 id="method-angle-chord">Using Central Angle and Chord Length</h3>
            <p>If you know the angle and chord but not the radius, find the radius first:</p>
            <p><strong>r = a / (2 × sin(θ / 2))</strong></p>
            <p>The radius equals the chord length <em>a</em> divided by (2 × sine of half the central angle). Then use <em>s = r × θ</em>.</p>

            <h3 id="method-area-angle">Using Sector Area and Central Angle</h3>
            <p>If you know the sector area and angle:</p>
            <p><strong>r = √(2A / θ)</strong></p>
            <p>The radius equals the square root of (2 times the sector area divided by the central angle in radians). Then use <em>s = r × θ</em>.</p>

            <h2 id="chord-length">How to Find Chord Length</h2>
            <p>The <strong>chord</strong> is the straight-line distance between the two points where the arc meets the radii. It is always shorter than the arc length (a straight line vs. a curve).</p>
            <p><strong>chord (a) = 2r × sin(θ / 2)</strong></p>
            <p>The chord length equals 2 times the radius times the sine of half the central angle.</p>

            <h2 id="sector-area">How to Find Sector Area</h2>
            <p>The area enclosed by the two radii and the arc:</p>
            <p><strong>A = r² × θ / 2</strong></p>
            <p>The sector area equals the radius squared times the central angle (in radians) divided by 2.</p>

            <h2 id="major-minor-arc">Major Arc vs. Minor Arc</h2>
            <p>When two points divide a circle into two arcs:</p>
            <ul>
                <li><strong>Minor arc:</strong> The shorter arc (central angle &lt; 180°)</li>
                <li><strong>Major arc:</strong> The longer arc (central angle &gt; 180°)</li>
                <li><strong>Semicircle:</strong> When both arcs are equal (central angle = 180°)</li>
            </ul>
            <p>The calculator computes the arc based on the angle you enter. For the major arc, enter the reflex angle (360° minus the minor angle).</p>

            <div class="explanation__highlight">
                <strong>Quick check:</strong> The arc length of a full circle (360° = 2π rad) equals the circumference: s = r × 2π = 2πr. A 90° arc is exactly one-quarter of the circumference.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>How do you find arc length using a central angle in degrees?</h3>
            <p>First convert the angle to radians by multiplying by π/180. Then use the formula <strong>s = r × θ</strong> with the angle in radians. For example, for a 60° angle with r = 10: θ = 60 × π/180 = π/3 ≈ 1.0472, so s = 10 × 1.0472 = <strong>10.472</strong>. You can also use our <a href="/math-calculators/angle-converter-calculator">Angle Converter</a> to convert degrees to radians.</p>

            <h3>How do you calculate arc length without the radius?</h3>
            <p>You need the central angle plus either the chord length or the sector area. With the chord: find the radius using <em>r = a / (2 × sin(θ/2))</em>. With the sector area: find the radius using <em>r = √(2A/θ)</em>. Then use the standard arc length formula.</p>

            <h3>Is arc length the same as the angle?</h3>
            <p>No. The <strong>angle</strong> measures the rotation between two radii (in degrees or radians), while the <strong>arc length</strong> measures the actual distance along the curve. Arc length depends on both the angle and the radius — a larger circle with the same angle produces a longer arc.</p>

            <h3>What is the arc length of 90 degrees?</h3>
            <p>A 90° arc is exactly <strong>one-quarter of the circumference</strong>. If the radius is <em>r</em>, then: s = r × π/2 ≈ 1.5708r. For example, with r = 10: s = 10 × π/2 ≈ <strong>15.708</strong>.</p>
        `,
        formula: {
            formula: "s = r × θ",
            variables: [
                { symbol: "s", meaning: "Arc length (distance along the curve)" },
                { symbol: "r", meaning: "Radius of the circle" },
                { symbol: "θ", meaning: "Central angle in radians" },
                { symbol: "a", meaning: "Chord length (straight-line distance)" },
                { symbol: "A", meaning: "Sector area" },
            ],
            example: [
                { label: "r=7, θ=90°", substitution: "s = 7 × (90×π/180) = 7 × 1.5708", result: "10.996" },
                { label: "r=10, θ=60°", substitution: "s = 10 × (60×π/180) = 10 × 1.0472", result: "10.472" },
                { label: "Full circle", substitution: "s = r × 2π = 2πr", result: "circumference" },
            ],
        },
        relatedCalculators: [
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert degrees to radians" },
            { title: "Parallelogram Area", slug: "parallelogram-area-calculator", categorySlug: "math-calculators", description: "Calculate parallelogram area" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate arc as percentage of circumference" },
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Work with fractional π values" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate r² for sector area" },
        ],
    },

    /* ─── 28. PENTAGON — RICH CONTENT ─── */
    "pentagon-calculator": {
        subtitle: "Calculate all properties of a regular pentagon — area, perimeter, diagonal, height, circumradius, and apothem — from any known measurement. Step-by-step formulas with golden ratio included.",
        contentHTML: `
            <h2 id="what-is-pentagon">What Is a Pentagon?</h2>
            <p>A <strong>pentagon</strong> is a polygon with <strong>five sides</strong> and five angles. When all sides and angles are equal, it's called a <strong>regular pentagon</strong>. In a regular pentagon:</p>
            <ul>
                <li>All five sides are equal length</li>
                <li>Every interior angle is <strong>108°</strong></li>
                <li>The sum of all interior angles is <strong>540°</strong></li>
                <li>It can be divided into <strong>5 isosceles triangles</strong></li>
            </ul>
            <p>Our calculator computes every property of a regular pentagon from any single known value — enter the side length, area, perimeter, diagonal, circumradius, or apothem, and all other properties are calculated automatically.</p>

            <h2 id="properties">Pentagon Properties &amp; Formulas</h2>

            <h3 id="area">Area of a Pentagon</h3>
            <p>The area formula for a regular pentagon involves the square root of 5:</p>
            <p><strong>A = (a²/4) × √(5(5 + 2√5))</strong></p>
            <p>This simplifies to approximately <strong>A ≈ 1.72048 × a²</strong>.</p>
            <p><strong>Example:</strong> For a pentagon with side length 5:</p>
            <ul>
                <li>A = (25/4) × √(5 × 9.4721) = 6.25 × √47.3607 = 6.25 × 6.882 ≈ <strong>43.01</strong></li>
            </ul>

            <h3 id="perimeter">Perimeter of a Pentagon</h3>
            <p>Since all five sides are equal:</p>
            <p><strong>P = 5a</strong></p>
            <p>For a = 5: P = 5 × 5 = <strong>25</strong></p>

            <h3 id="diagonal">Diagonal of a Pentagon</h3>
            <p>The diagonal connects two non-adjacent vertices. In a regular pentagon, the diagonal-to-side ratio is the famous <strong>golden ratio φ</strong> (phi):</p>
            <p><strong>d = a × φ = a × (1 + √5)/2 ≈ 1.618 × a</strong></p>
            <p>For a = 5: d = 5 × 1.618 ≈ <strong>8.09</strong></p>
            <p>Each pentagon has <strong>5 diagonals</strong>, all of equal length in a regular pentagon.</p>

            <h3 id="height">Height of a Pentagon</h3>
            <p>The height is the perpendicular distance from one side to the opposite vertex:</p>
            <p><strong>h = a × √(5 + 2√5) / 2 ≈ 1.539 × a</strong></p>
            <p>For a = 5: h ≈ 5 × 1.539 ≈ <strong>7.69</strong></p>

            <h3 id="circumradius">Circumradius (R)</h3>
            <p>The <strong>circumradius</strong> is the radius of the circle that passes through all five vertices (circumscribed circle):</p>
            <p><strong>R = a × √(50 + 10√5) / 10 ≈ 0.851 × a</strong></p>
            <p>For a = 5: R ≈ <strong>4.253</strong></p>

            <h3 id="apothem">Apothem / Inradius (r)</h3>
            <p>The <strong>apothem</strong> (or inradius) is the perpendicular distance from the center to the midpoint of a side (inscribed circle radius):</p>
            <p><strong>r = a × √(25 + 10√5) / 10 ≈ 0.688 × a</strong></p>
            <p>For a = 5: r ≈ <strong>3.441</strong></p>

            <h2 id="golden-ratio">The Golden Ratio &amp; Pentagons</h2>
            <p>The regular pentagon has a deep connection to the <strong>golden ratio φ ≈ 1.61803</strong>. The ratio of the diagonal to the side length <em>equals</em> φ exactly. This makes pentagons a fundamental shape in both mathematics and art.</p>
            <p>The golden ratio also appears in: the Fibonacci sequence, the Parthenon's proportions, sunflower seed spirals, and the famous <strong>pentagram</strong> (five-pointed star drawn inside a pentagon).</p>

            <div class="explanation__highlight">
                <strong>Quick approximations:</strong> Area ≈ 1.72 × a², Diagonal ≈ 1.618 × a (golden ratio), Height ≈ 1.539 × a, Circumradius ≈ 0.851 × a, Apothem ≈ 0.688 × a.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is a regular vs. irregular pentagon?</h3>
            <p>A <strong>regular pentagon</strong> has all five sides equal and all five angles equal (108° each). An <strong>irregular pentagon</strong> has sides and angles of different lengths and measures. Our calculator handles regular pentagons only, since irregular pentagons require all five side lengths and additional information to solve.</p>

            <h3>How many diagonals does a pentagon have?</h3>
            <p>A pentagon has <strong>5 diagonals</strong>. The formula for the number of diagonals in any polygon is n(n−3)/2. For a pentagon: 5(5−3)/2 = 5. In a regular pentagon, all diagonals are the same length.</p>

            <h3>Why is the interior angle 108°?</h3>
            <p>The sum of interior angles of any polygon is (n−2) × 180°. For a pentagon: (5−2) × 180° = 540°. Dividing equally among 5 angles: 540° / 5 = <strong>108°</strong>.</p>

            <h3>What is the difference between circumradius and apothem?</h3>
            <p>The <strong>circumradius (R)</strong> is the distance from the center to a vertex (corner). The <strong>apothem (r)</strong> is the distance from the center to the midpoint of a side. The circumradius is always larger: R ≈ 1.236 × r.</p>

            <h3>Where are pentagons found in real life?</h3>
            <p>The most famous example is the <strong>Pentagon building</strong> in Washington, D.C. Pentagons also appear in soccer ball patterns, certain crystals, starfish body plans, and many tiling patterns. The pentagram (five-pointed star) inscribed in a pentagon is an ancient mathematical symbol.</p>
        `,
        formula: {
            formula: "A = (a²/4) × √(5(5 + 2√5))",
            variables: [
                { symbol: "a", meaning: "Side length of the regular pentagon" },
                { symbol: "A", meaning: "Area (≈ 1.72 × a²)" },
                { symbol: "P", meaning: "Perimeter (= 5a)" },
                { symbol: "d", meaning: "Diagonal (= a × φ ≈ 1.618a)" },
                { symbol: "R", meaning: "Circumradius (≈ 0.851a)" },
                { symbol: "r", meaning: "Apothem / inradius (≈ 0.688a)" },
            ],
            example: [
                { label: "Side = 5", substitution: "A = (25/4)√(5×9.472)", result: "43.01" },
                { label: "Perimeter", substitution: "P = 5 × 5", result: "25" },
                { label: "Diagonal", substitution: "d = 5 × 1.618", result: "8.09" },
            ],
        },
        relatedCalculators: [
            { title: "Parallelogram Area", slug: "parallelogram-area-calculator", categorySlug: "math-calculators", description: "Calculate parallelogram area" },
            { title: "Arc Length Calculator", slug: "arc-length-calculator", categorySlug: "math-calculators", description: "Calculate arc length and sector area" },
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert between angle units" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate area ratios" },
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers for formulas" },
        ],
    },

    /* ─── 29. AREA CALCULATOR — RICH CONTENT ─── */
    "area-calculator": {
        subtitle: "Calculate the area of 12 different shapes — square, rectangle, triangle, circle, ellipse, trapezoid, parallelogram, rhombus, sector, ring, and regular polygon. Select a shape to see the formula and step-by-step solution.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate Area</h2>
            <p><strong>Area</strong> is the space inside the boundary of a two-dimensional shape, measured in <strong>square units</strong> (sq ft, m², cm², etc.). It answers the question "how much surface does this shape cover?"</p>
            <p>Every geometric shape has a unique area formula. Our calculator supports 12 shapes — select one from the dropdown above and enter the required dimensions to get the area instantly with a step-by-step breakdown.</p>

            <h2 id="area-formulas">Area Formulas for All Shapes</h2>

            <h3 id="square">Square</h3>
            <p><strong>A = a²</strong> — Side length squared. Example: side = 5 → A = 25.</p>

            <h3 id="rectangle">Rectangle</h3>
            <p><strong>A = length × width</strong>. Example: 10 × 6 = 60.</p>

            <h3 id="triangle-bh">Triangle (Base × Height)</h3>
            <p><strong>A = ½ × b × h</strong> — Half of base times perpendicular height. Example: b = 8, h = 5 → A = 20.</p>

            <h3 id="triangle-heron">Triangle (Heron's Formula — SSS)</h3>
            <p>When you know all three sides (a, b, c) but not the height:</p>
            <p><strong>s = (a + b + c) / 2</strong> (semi-perimeter)</p>
            <p><strong>A = √(s(s−a)(s−b)(s−c))</strong></p>
            <p>Example: sides 3, 4, 5 → s = 6, A = √(6×3×2×1) = √36 = <strong>6</strong>.</p>

            <h3 id="circle">Circle</h3>
            <p><strong>A = πr²</strong>. If you know the diameter: A = π(d/2)². Example: r = 7 → A = 153.94.</p>

            <h3 id="ellipse">Ellipse</h3>
            <p><strong>A = π × a × b</strong> — where <em>a</em> is the semi-major axis and <em>b</em> is the semi-minor axis. Example: a = 10, b = 6 → A = 188.50.</p>

            <h3 id="trapezoid">Trapezoid</h3>
            <p><strong>A = ½(a + b) × h</strong> — Average of the two parallel bases times the height. Example: bases 8 and 12, height 5 → A = 50.</p>

            <h3 id="parallelogram">Parallelogram</h3>
            <p><strong>A = b × h</strong> — Base times perpendicular height (not the slanted side). See our dedicated <a href="/math-calculators/parallelogram-area-calculator">Parallelogram Area Calculator</a> for the sides-and-angle method.</p>

            <h3 id="rhombus">Rhombus</h3>
            <p><strong>A = a × h</strong> — Edge length times perpendicular height. Alternatively: A = ½ × d₁ × d₂ (half the product of the diagonals).</p>

            <h3 id="sector">Sector</h3>
            <p><strong>A = ½r²θ</strong> — where θ is in radians. For degrees: A = (θ/360) × πr². See our <a href="/math-calculators/arc-length-calculator">Arc Length Calculator</a> for arc length and chord.</p>

            <h3 id="ring">Ring (Annulus)</h3>
            <p><strong>A = π(R² − r²)</strong> — Outer circle area minus inner circle area. Example: R = 7, r = 3 → A = π(49−9) = 125.66.</p>

            <h3 id="polygon">Regular Polygon (n-gon)</h3>
            <p><strong>A = (a² × n) / (4 × tan(π/n))</strong> — Works for any regular polygon with <em>n</em> equal sides of length <em>a</em>. Pentagon (n=5), hexagon (n=6), octagon (n=8), etc. See our <a href="/math-calculators/pentagon-calculator">Pentagon Calculator</a> for dedicated pentagon properties.</p>

            <h2 id="area-vs">Area vs. Perimeter vs. Surface Area</h2>
            <ul>
                <li><strong>Area:</strong> The 2D space inside a shape (square units)</li>
                <li><strong>Perimeter:</strong> The distance around the shape's boundary (linear units)</li>
                <li><strong>Surface Area:</strong> The total area of all faces of a 3D solid</li>
            </ul>

            <div class="explanation__highlight">
                <strong>Why square units?</strong> Area is always in "squared" units (ft², m², cm²) because you're multiplying one dimension by another — length × width. This represents two-dimensional space.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>When should I calculate area?</h3>
            <p>Whenever you need to know how much surface a space covers — flooring, painting walls, landscaping, tiling, concrete pouring, carpet installation, or any material that covers a surface.</p>

            <h3>How do I find the area of an irregular shape?</h3>
            <p>Break the irregular shape into regular shapes (rectangles, triangles, circles), calculate each area separately, then add them together. For an irregular quadrilateral: draw a diagonal, measure the perpendicular heights to the other two corners, and use A = ½ × d × (h₁ + h₂).</p>

            <h3>What's the difference between base×height and Heron's formula for triangles?</h3>
            <p>Use <strong>½bh</strong> when you know the base and perpendicular height. Use <strong>Heron's formula</strong> when you know all three side lengths but not the height. Both give the same result — they're just different ways to reach it.</p>

            <h3>How do I convert between area units?</h3>
            <p>Common conversions: <strong>1 m² = 10.764 ft²</strong>, <strong>1 acre = 43,560 ft²</strong>, <strong>1 hectare = 10,000 m²</strong>. Multiply your area result by the appropriate conversion factor.</p>

            <h3>Does a circle count as a polygon?</h3>
            <p>No — a polygon must have straight sides. A circle has no straight sides. However, a regular polygon with a very large number of sides (n→∞) approaches a circle, and the polygon area formula approaches πr².</p>

            <h3>What is the easiest way to calculate the area of a room?</h3>
            <p>Most rooms are rectangular: just measure <strong>length × width</strong>. For L-shaped rooms, divide into two rectangles, calculate each area, and add them together.</p>
        `,
        formula: {
            formula: "A = l × w (rectangle), A = πr² (circle), A = ½bh (triangle)",
            variables: [
                { symbol: "A", meaning: "Area in square units" },
                { symbol: "l, w", meaning: "Length and width (rectangle)" },
                { symbol: "r", meaning: "Radius (circle, sector)" },
                { symbol: "b, h", meaning: "Base and height (triangle, parallelogram)" },
                { symbol: "n", meaning: "Number of sides (regular polygon)" },
            ],
            example: [
                { label: "Rectangle 10×6", substitution: "A = 10 × 6", result: "60 sq units" },
                { label: "Circle r=7", substitution: "A = π × 7²", result: "153.94 sq units" },
                { label: "Triangle 8×5", substitution: "A = ½ × 8 × 5", result: "20 sq units" },
            ],
        },
        relatedCalculators: [
            { title: "Parallelogram Area", slug: "parallelogram-area-calculator", categorySlug: "math-calculators", description: "Dedicated parallelogram calculator with 3 methods" },
            { title: "Arc Length Calculator", slug: "arc-length-calculator", categorySlug: "math-calculators", description: "Arc length, chord, and sector area" },
            { title: "Pentagon Calculator", slug: "pentagon-calculator", categorySlug: "math-calculators", description: "All pentagon properties from side length" },
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert degrees to radians for sector area" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate area percentages and ratios" },
        ],
    },

    /* ─── 30. PERIMETER CALCULATOR — RICH CONTENT ─── */
    "perimeter-calculator": {
        subtitle: "Calculate the perimeter of 10 different shapes — square, rectangle, triangle, circle (circumference), ellipse, trapezoid, parallelogram, rhombus, sector, and regular polygon. Select a shape and enter the dimensions.",
        contentHTML: `
            <h2 id="how-to-find-perimeter">How to Find the Perimeter of a Shape</h2>
            <p><strong>Perimeter</strong> is the total length of the outer boundary of a two-dimensional shape. The word comes from Greek: <em>peri</em> ("around") + <em>metron</em> ("measure"). Unlike area (which measures surface), perimeter measures <strong>distance around</strong>.</p>
            <p>For shapes with straight edges, the perimeter is simply the sum of all side lengths. For curved shapes like circles and ellipses, you need a formula.</p>

            <h2 id="perimeter-formulas">Perimeter Formulas</h2>

            <h3 id="square">Square</h3>
            <p><strong>P = 4a</strong> — Four times the side length. Example: a = 5 → P = 20.</p>

            <h3 id="rectangle">Rectangle</h3>
            <p><strong>P = 2l + 2w</strong> — Twice the length plus twice the width. Example: 10 + 10 + 6 + 6 = 32.</p>

            <h3 id="triangle">Triangle</h3>
            <p><strong>P = a + b + c</strong> — Sum of all three sides. Example: 3 + 4 + 5 = 12.</p>

            <h3 id="circle">Circle (Circumference)</h3>
            <p><strong>C = 2πr</strong> — Two times π times the radius. Alternatively: C = πd (π times the diameter). Example: r = 7 → C = 43.982.</p>

            <h3 id="ellipse">Ellipse</h3>
            <p>There is no exact closed-form formula for the perimeter of an ellipse. The best approximation is <strong>Ramanujan's formula</strong>:</p>
            <p><strong>P ≈ π[3(a+b) − √((3a+b)(a+3b))]</strong></p>
            <p>Where <em>a</em> is the semi-major axis and <em>b</em> is the semi-minor axis. Example: a = 10, b = 6 → P ≈ 51.054.</p>

            <h3 id="trapezoid">Trapezoid</h3>
            <p><strong>P = a + b + c + d</strong> — Sum of all four sides (two bases + two legs). Example: 8 + 6 + 5 + 5 = 24.</p>

            <h3 id="parallelogram">Parallelogram</h3>
            <p><strong>P = 2a + 2b</strong> — Since opposite sides are equal. Example: a = 10, b = 6 → P = 32.</p>

            <h3 id="rhombus">Rhombus</h3>
            <p><strong>P = 4a</strong> — All four sides are equal. Example: a = 7 → P = 28.</p>

            <h3 id="sector">Sector</h3>
            <p><strong>P = 2r + arc length</strong>, where arc = rθ (θ in radians). This is the two straight edges (radii) plus the curved arc. Example: r = 7, angle = 90° → P = 14 + 10.996 = 24.996.</p>

            <h3 id="polygon">Regular Polygon (n-gon)</h3>
            <p><strong>P = n × a</strong> — Number of sides times the side length. Works for pentagon (n=5), hexagon (n=6), octagon (n=8), or any regular polygon.</p>

            <h2 id="perimeter-vs-area">Perimeter vs. Area vs. Circumference</h2>
            <ul>
                <li><strong>Perimeter:</strong> Distance <em>around</em> a shape (linear units: ft, m, cm)</li>
                <li><strong>Circumference:</strong> Perimeter of a circle — same concept, different name</li>
                <li><strong>Area:</strong> Space <em>inside</em> a shape (square units: ft², m²). See our <a href="/math-calculators/area-calculator">Area Calculator</a></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Practical uses:</strong> Calculate perimeter for fencing a yard, framing a painting, trimming a room with baseboard, wrapping string around a shape, or buying edge material for any project.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>Is perimeter the same as circumference?</h3>
            <p>Both measure the boundary length, but <strong>perimeter</strong> is used for shapes with straight sides, while <strong>circumference</strong> specifically refers to the boundary of a circle. Mathematically, the circumference <em>is</em> the perimeter of a circle.</p>

            <h3>How do I find the perimeter of an irregular shape?</h3>
            <p>Measure each edge individually and add them all together. If some edges are curved, you'll need the appropriate formula for each curved section. For a completely irregular shape, measuring with a flexible tape or string is often the easiest approach.</p>

            <h3>Why is perimeter measured in linear units, not squared?</h3>
            <p>Perimeter is a one-dimensional measurement (distance), so it uses linear units like feet, meters, or centimeters. Area is two-dimensional (length × width), which is why it uses squared units.</p>

            <h3>Why do you calculate perimeter?</h3>
            <p>Common real-world uses include: calculating <strong>fencing</strong> needed for a yard, <strong>baseboard</strong> trim for a room, <strong>string lights</strong> for windows, <strong>framing</strong> for pictures, and <strong>edging</strong> for garden beds.</p>
        `,
        formula: {
            formula: "P = 2l + 2w (rectangle), C = 2πr (circle), P = na (polygon)",
            variables: [
                { symbol: "P", meaning: "Perimeter in linear units" },
                { symbol: "l, w", meaning: "Length and width (rectangle)" },
                { symbol: "r", meaning: "Radius (circle, sector)" },
                { symbol: "a, b, c", meaning: "Side lengths" },
                { symbol: "n", meaning: "Number of sides (regular polygon)" },
            ],
            example: [
                { label: "Rectangle 10×6", substitution: "P = 2(10) + 2(6)", result: "32 units" },
                { label: "Circle r=7", substitution: "C = 2π(7)", result: "43.98 units" },
                { label: "Hexagon a=5", substitution: "P = 6 × 5", result: "30 units" },
            ],
        },
        relatedCalculators: [
            { title: "Area Calculator", slug: "area-calculator", categorySlug: "math-calculators", description: "Calculate area for 12 shapes" },
            { title: "Parallelogram Area", slug: "parallelogram-area-calculator", categorySlug: "math-calculators", description: "Dedicated parallelogram calculator" },
            { title: "Arc Length Calculator", slug: "arc-length-calculator", categorySlug: "math-calculators", description: "Arc length for sector perimeters" },
            { title: "Pentagon Calculator", slug: "pentagon-calculator", categorySlug: "math-calculators", description: "All pentagon properties" },
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert degrees to radians for sector" },
        ],
    },

    /* ─── 31. CIRCLE AREA — RICH CONTENT ─── */
    "circle-area-calculator": {
        subtitle: "Calculate the area, circumference, diameter, and radius of a circle from any known value. Enter the radius, diameter, circumference, or area to compute all circle properties with step-by-step formulas.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate the Area of a Circle</h2>
            <p>A <strong>circle</strong> is a round, two-dimensional shape with no corners or edges. Every point along its edge is equidistant from the center. The <strong>area</strong> of a circle is the amount of space the shape occupies — the region enclosed within its boundary.</p>
            <p>You can find the area using the radius, diameter, or circumference. Our calculator accepts any one of these values and computes all circle properties automatically.</p>

            <h2 id="formulas">Circle Area Formulas</h2>

            <h3 id="using-radius">Using Radius</h3>
            <p>The most common formula:</p>
            <p><strong>A = πr²</strong></p>
            <p>The area equals pi (≈ 3.14159) times the radius squared.</p>
            <p><strong>Example:</strong> r = 7 → A = π × 49 = <strong>153.938</strong></p>

            <h3 id="using-diameter">Using Diameter</h3>
            <p>The diameter is twice the radius (d = 2r). If you know the diameter:</p>
            <p><strong>A = π × (d/2)²</strong></p>
            <p><strong>Example:</strong> d = 14 → A = π × 7² = <strong>153.938</strong></p>

            <h3 id="using-circumference">Using Circumference</h3>
            <p>The circumference is the distance around the circle (C = 2πr). From circumference:</p>
            <p><strong>A = π × (C/2π)² = C²/(4π)</strong></p>
            <p><strong>Example:</strong> C = 43.982 → r = 43.982/(2π) = 7 → A = <strong>153.938</strong></p>

            <h2 id="circumference-formula">Circumference Formula</h2>
            <p>The circumference (perimeter of a circle) is:</p>
            <p><strong>C = 2πr = πd</strong></p>
            <p>See our <a href="/math-calculators/perimeter-calculator">Perimeter Calculator</a> for circumference alongside other shape perimeters.</p>

            <h2 id="why-pi-r-squared">Why Is the Area πr²?</h2>
            <p>If you divide a circle into many thin slices (like a pizza) and rearrange them alternately, the shape approximates a <strong>parallelogram</strong>. The height of this parallelogram equals the radius <em>r</em>, and the base equals half the circumference (πr). So:</p>
            <p>Area = base × height = πr × r = <strong>πr²</strong></p>
            <p>As you use more and more slices, the approximation becomes exact — proving that A = πr².</p>

            <h2 id="what-is-pi">What Is π (Pi)?</h2>
            <p><strong>π ≈ 3.14159265…</strong> is an irrational number — its decimal digits go on forever without repeating. It represents the ratio of any circle's circumference to its diameter: C/d = π. Pi appears throughout mathematics, physics, and engineering.</p>

            <div class="explanation__highlight">
                <strong>Quick reference:</strong> π ≈ 3.14159. For rough estimates, use 3.14. For precision, use 3.14159265. Most calculators and programming languages have a built-in π constant.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What number does π represent?</h3>
            <p>π is approximately <strong>3.14159265</strong>. It's an irrational number — its decimal representation is infinite and non-repeating. It's the ratio of a circle's circumference to its diameter and appears naturally in geometry, trigonometry, and calculus.</p>

            <h3>How do you solve πr²?</h3>
            <p>Multiply π (use 3.14159) by the radius squared. For example, if r = 2: A = 3.14159 × 2² = 3.14159 × 4 = <strong>12.566</strong>.</p>

            <h3>Why is pi used to find the area of a circle?</h3>
            <p>Pi is a naturally occurring constant that arises from the relationship between a circle's dimensions. When mathematicians derived the area formula, they found the area equals a specific constant times r² — that constant turned out to be π.</p>

            <h3>Is area the same as circumference?</h3>
            <p>No. <strong>Area</strong> is the 2D space <em>inside</em> the circle (measured in square units). <strong>Circumference</strong> is the distance <em>around</em> the circle (measured in linear units). They're related through the radius, but they measure fundamentally different things.</p>

            <h3>How do I find the radius if I know the area?</h3>
            <p>Rearrange the formula: <strong>r = √(A/π)</strong>. For example, if A = 100: r = √(100/3.14159) = √31.831 ≈ <strong>5.642</strong>. Our calculator supports this — just select "Area" as the input mode.</p>
        `,
        formula: {
            formula: "A = πr²",
            variables: [
                { symbol: "A", meaning: "Area of the circle (square units)" },
                { symbol: "r", meaning: "Radius — distance from center to edge" },
                { symbol: "d", meaning: "Diameter — distance across through center (= 2r)" },
                { symbol: "C", meaning: "Circumference — distance around (= 2πr)" },
                { symbol: "π", meaning: "Pi ≈ 3.14159265…" },
            ],
            example: [
                { label: "Radius = 7", substitution: "A = π × 7² = π × 49", result: "153.938" },
                { label: "Diameter = 14", substitution: "A = π × (14/2)² = π × 49", result: "153.938" },
                { label: "Circumference = 44", substitution: "A = 44²/(4π) = 1936/12.566", result: "154.062" },
            ],
        },
        relatedCalculators: [
            { title: "Area Calculator", slug: "area-calculator", categorySlug: "math-calculators", description: "Area of 12 shapes including circles" },
            { title: "Perimeter Calculator", slug: "perimeter-calculator", categorySlug: "math-calculators", description: "Circumference and perimeters of 10 shapes" },
            { title: "Arc Length Calculator", slug: "arc-length-calculator", categorySlug: "math-calculators", description: "Arc length and sector area from radius" },
            { title: "Pentagon Calculator", slug: "pentagon-calculator", categorySlug: "math-calculators", description: "All regular pentagon properties" },
            { title: "Parallelogram Area", slug: "parallelogram-area-calculator", categorySlug: "math-calculators", description: "πr² proof uses parallelogram concept" },
        ],
    },

    /* ─── 32. POLYGON CALCULATOR — RICH CONTENT ─── */
    "polygon-calculator": {
        subtitle: "Calculate all properties of any regular polygon — area, perimeter, interior and exterior angles, circumradius, inradius (apothem), and diagonals. Enter the number of sides and any known measurement.",
        contentHTML: `
            <h2 id="what-is-polygon">What Is a Regular Polygon?</h2>
            <p>A <strong>polygon</strong> is a two-dimensional shape made up of straight line segments. A <strong>regular polygon</strong> is one where all sides are equal in length and all interior angles are equal. Examples include equilateral triangles, squares, pentagons, hexagons, and octagons.</p>
            <p>Our calculator works for any regular polygon with 3 or more sides. Enter the number of sides and any one known value (side length, area, perimeter, circumradius, or apothem) to compute all properties.</p>

            <h2 id="formulas">Polygon Formulas</h2>

            <h3 id="area">Area</h3>
            <p><strong>A = (n × a²) / (4 × tan(π/n))</strong></p>
            <p>Where <em>n</em> is the number of sides and <em>a</em> is the side length.</p>
            <p><strong>Example (hexagon, n=6, a=5):</strong> A = (6 × 25) / (4 × tan(π/6)) = 150 / 2.309 = <strong>64.952</strong></p>

            <h3 id="perimeter">Perimeter</h3>
            <p><strong>P = n × a</strong></p>
            <p>Simply the number of sides times the side length. Hexagon with a=5: P = 6 × 5 = <strong>30</strong>.</p>

            <h3 id="angles">Interior &amp; Exterior Angles</h3>
            <p><strong>Interior angle: α = (n − 2) × 180° / n</strong></p>
            <p><strong>Exterior angle: β = 360° / n</strong></p>
            <p>The sum of all interior angles is always <strong>(n − 2) × 180°</strong>. Interior + exterior = 180° for each vertex.</p>
            <p>Hexagon: α = (6−2)×180/6 = <strong>120°</strong>, β = 360/6 = <strong>60°</strong>.</p>

            <h3 id="circumradius">Circumradius (R)</h3>
            <p>The circumradius is the radius of the circle that passes through all vertices:</p>
            <p><strong>R = a / (2 × sin(π/n))</strong></p>
            <p>Hexagon with a=5: R = 5 / (2 × sin(π/6)) = 5 / 1 = <strong>5</strong>. (For a hexagon, R = a!)</p>

            <h3 id="inradius">Inradius / Apothem (r)</h3>
            <p>The apothem is the perpendicular distance from the center to the midpoint of a side (inscribed circle radius):</p>
            <p><strong>r = a / (2 × tan(π/n))</strong></p>
            <p>Hexagon with a=5: r = 5 / (2 × tan(π/6)) = 5 / 1.155 = <strong>4.330</strong>.</p>

            <h3 id="diagonals">Number of Diagonals</h3>
            <p><strong>Diagonals = n(n − 3) / 2</strong></p>
            <p>Hexagon: 6(6−3)/2 = <strong>9 diagonals</strong>.</p>

            <h2 id="polygon-names">Common Polygon Names</h2>
            <table><thead><tr><th>Sides</th><th>Name</th><th>Interior Angle</th></tr></thead><tbody>
                <tr><td>3</td><td>Triangle</td><td>60°</td></tr>
                <tr><td>4</td><td>Square</td><td>90°</td></tr>
                <tr><td>5</td><td>Pentagon</td><td>108°</td></tr>
                <tr><td>6</td><td>Hexagon</td><td>120°</td></tr>
                <tr><td>7</td><td>Heptagon</td><td>128.57°</td></tr>
                <tr><td>8</td><td>Octagon</td><td>135°</td></tr>
                <tr><td>9</td><td>Nonagon</td><td>140°</td></tr>
                <tr><td>10</td><td>Decagon</td><td>144°</td></tr>
                <tr><td>12</td><td>Dodecagon</td><td>150°</td></tr>
                <tr><td>20</td><td>Icosagon</td><td>162°</td></tr>
            </tbody></table>

            <div class="explanation__highlight">
                <strong>As n → ∞:</strong> A regular polygon approaches a circle. The interior angle approaches 180°, the area formula approaches πr², and the circumradius and inradius converge.
            </div>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What's the difference between regular and irregular polygons?</h3>
            <p>A <strong>regular polygon</strong> has all sides and all angles equal. An <strong>irregular polygon</strong> has sides or angles of different sizes. Our calculator works for regular polygons only, since irregular polygons need all individual side lengths and angles to solve.</p>

            <h3>What is the difference between circumradius and apothem?</h3>
            <p>The <strong>circumradius (R)</strong> goes from the center to a vertex. The <strong>apothem (r)</strong> goes from the center to the midpoint of a side. The circumradius is always larger than the apothem.</p>

            <h3>How do interior and exterior angles relate?</h3>
            <p>At each vertex, <strong>interior + exterior = 180°</strong>. The sum of all exterior angles is always 360° for any convex polygon, regardless of the number of sides.</p>

            <h3>Why does a regular hexagon have R = a?</h3>
            <p>A regular hexagon can be divided into 6 equilateral triangles. The circumradius equals the side length because each triangle has sides equal to the hexagon's side. This makes hexagons uniquely simple — R = a exactly.</p>

            <h3>Can this calculator handle very large numbers of sides?</h3>
            <p>Yes — enter any number ≥ 3. With very large n values (e.g., 100+), the polygon closely approximates a circle, and you'll see the area approach πR² and the angles approach 180°.</p>
        `,
        formula: {
            formula: "A = (n × a²) / (4 × tan(π/n))",
            variables: [
                { symbol: "n", meaning: "Number of sides (≥ 3)" },
                { symbol: "a", meaning: "Side length" },
                { symbol: "α", meaning: "Interior angle = (n−2)×180/n" },
                { symbol: "β", meaning: "Exterior angle = 360/n" },
                { symbol: "R", meaning: "Circumradius = a / (2sin(π/n))" },
                { symbol: "r", meaning: "Inradius/apothem = a / (2tan(π/n))" },
            ],
            example: [
                { label: "Hexagon a=5", substitution: "A = (6×25)/(4×tan(30°))", result: "64.952" },
                { label: "Octagon a=4", substitution: "A = (8×16)/(4×tan(22.5°))", result: "77.255" },
                { label: "Pentagon a=6", substitution: "A = (5×36)/(4×tan(36°))", result: "61.937" },
            ],
        },
        relatedCalculators: [
            { title: "Pentagon Calculator", slug: "pentagon-calculator", categorySlug: "math-calculators", description: "Dedicated pentagon properties with golden ratio" },
            { title: "Area Calculator", slug: "area-calculator", categorySlug: "math-calculators", description: "Area of 12 shapes including regular polygons" },
            { title: "Perimeter Calculator", slug: "perimeter-calculator", categorySlug: "math-calculators", description: "Perimeter of 10 shapes including n-gons" },
            { title: "Circle Area Calculator", slug: "circle-area-calculator", categorySlug: "math-calculators", description: "Circle — the limit of regular polygons" },
            { title: "Angle Converter", slug: "angle-converter-calculator", categorySlug: "math-calculators", description: "Convert angle units for polygon calculations" },
        ],
    },
};

export default async function MathCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("math").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/math-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Math Calculators", url: canonicalUrl("/math-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-math-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Math Calculators", href: "/math-calculators" },
                    { label: calc.title.replace(" Calculator", "").replace(" —", " –") },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {content.subtitle}
                </p>
            )}
            <AuthorBadge categoryKey="math" />

            <div className="layout-2col">
                <div className="layout-2col__main">
                    <MathCalculatorCore calcType={calc.calcType || "percentage"} />

                    {content && (
                        <>
                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            {content.formula && (
                                <FormulaBlock
                                    formula={content.formula.formula}
                                    variables={content.formula.variables}
                                    example={content.formula.example}
                                />
                            )}
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
                            {content.relatedCalculators && (
                                <RelatedCalculators calculators={content.relatedCalculators} />
                            )}
                        </>
                    )}
                    <RelatedCalculators calcId={calc.id} />
                    <GuideCTA calcId={calc.id} />
                    <GlossaryChip calcId={calc.id} />
                </div>
                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}

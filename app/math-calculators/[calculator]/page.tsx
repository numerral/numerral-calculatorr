// Dynamic Hub — /math-calculators/[calculator]/
// Each math calculator gets its own hub page with calculator + formula + explanation + FAQ + related

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import MathCalculatorCore from "@/components/calculator/MathCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import FormulaBlock from "@/components/shared/FormulaBlock";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

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

    /* ─── 5. QUADRATIC EQUATION SOLVER ─── */
    "quadratic-equation-solver": {
        subtitle: "Solve any quadratic equation ax² + bx + c = 0 using the quadratic formula. See discriminant analysis, real and complex roots, vertex, and step-by-step solution.",
        explanation: {
            heading: "What is the Quadratic Formula and How Does It Work?",
            paragraphs: [
                "A quadratic equation is any equation of the form ax² + bx + c = 0, where a ≠ 0. It is called 'quadratic' because the highest power of the unknown variable x is 2 (from the Latin 'quadratus,' meaning square). Quadratic equations arise naturally in physics (projectile motion), engineering (signal processing), economics (profit maximization), and geometry (area problems).",
                "The quadratic formula x = (−b ± √(b² − 4ac)) / 2a gives the solution to any quadratic equation. The key element is the discriminant, Δ = b² − 4ac, which determines the nature of the roots: if Δ > 0, there are two distinct real roots; if Δ = 0, there is exactly one repeated real root; and if Δ < 0, the roots are complex conjugates (involving imaginary numbers).",
                "Beyond the roots, the vertex of the parabola — the highest or lowest point of the graph — is found at x = −b/(2a), y = f(−b/(2a)). If a > 0, the parabola opens upward and the vertex is a minimum. If a < 0, it opens downward and the vertex is a maximum. Our calculator provides the roots, discriminant, vertex, and complete step-by-step solution for any quadratic equation.",
            ],
            highlight: "Example: x² − 5x + 6 = 0 → Δ = 25 − 24 = 1 > 0 → x₁ = (5+1)/2 = 3, x₂ = (5−1)/2 = 2. Vertex at (2.5, −0.25).",
        },
        formula: {
            formula: "x = (−b ± √(b² − 4ac)) / 2a",
            variables: [
                { symbol: "a", meaning: "Coefficient of x² (must not be zero)" },
                { symbol: "b", meaning: "Coefficient of x" },
                { symbol: "c", meaning: "Constant term" },
                { symbol: "Δ = b²−4ac", meaning: "Discriminant — determines root nature" },
            ],
            example: [
                { label: "Solve 2x² − 7x + 3 = 0", substitution: "x = (7 ± √(49−24)) / 4 = (7 ± 5) / 4", result: "x₁ = 3, x₂ = 0.5" },
                { label: "Discriminant", substitution: "Δ = 49 − 24", result: "25 > 0 → Two real roots" },
            ],
        },
        faq: [
            { question: "What does the discriminant tell us?", answer: "The discriminant Δ = b² − 4ac reveals the nature of the roots: Δ > 0 means two distinct real roots; Δ = 0 means one repeated (double) root; Δ < 0 means two complex conjugate roots involving √(−1) = i. A perfect square discriminant means the roots are rational numbers." },
            { question: "Can I use the quadratic formula for higher-degree equations?", answer: "No, the quadratic formula only works for degree-2 equations. For cubic (degree 3) and quartic (degree 4) equations, there are more complex formulas. For degree 5 and above, there is no general algebraic formula (proven by the Abel–Ruffini theorem), and numerical methods must be used." },
            { question: "What is the vertex form of a quadratic equation?", answer: "The vertex form is y = a(x − h)² + k, where (h, k) is the vertex. You can convert from standard form by completing the square, or use h = −b/(2a) and k = c − b²/(4a)." },
            { question: "How are quadratic equations used in real life?", answer: "Physics: projectile motion (height = −½gt² + v₀t + h₀). Business: profit optimization (revenue minus cost functions). Engineering: stress analysis, circuit impedance. Architecture: parabolic arches and suspension bridges." },
        ],
        relatedCalculators: [
            { title: "Exponent Calculator", slug: "exponent-calculator", categorySlug: "math-calculators", description: "Calculate powers and exponents" },
            { title: "Percentage Calculator", slug: "percentage-calculator", categorySlug: "math-calculators", description: "Calculate percentage changes" },
            { title: "Average Calculator", slug: "average-calculator", categorySlug: "math-calculators", description: "Calculate mean of data sets" },
            { title: "Standard Deviation", slug: "standard-deviation-calculator", categorySlug: "math-calculators", description: "Measure data spread" },
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
                </div>

                <aside className="layout-2col__sidebar">
                    <TrendingCalculations variant="sidebar" />
                </aside>
            </div>
        </main>
    );
}

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
    "mixed-number-calculator": {
        subtitle: "Add, subtract, multiply, or divide mixed numbers and fractions. See the full step-by-step solution with conversion to improper fractions, LCD, and simplification.",
        contentHTML: `
            <h2 id="how-to-calculate">How to Calculate Mixed Numbers</h2>
            <p>A <strong>mixed number</strong> combines a whole number with a <a href="/math-calculators/fraction-calculator">fraction</a> — like 1 2/3 or 3 1/4. Calculating with mixed numbers is similar to calculating with regular fractions, but with one extra step: you first convert each mixed number to an <strong>improper fraction</strong>.</p>

            <h3 id="step-convert">Step One: Convert to Improper Fractions</h3>
            <p>Multiply the whole number by the denominator, then add the numerator. Keep the same denominator.</p>
            <p><strong>Formula:</strong> w n/d = (w × d + n) / d</p>
            <p><strong>Example:</strong> Convert 1 2/3 and 1 3/4 to improper fractions.</p>
            <ul>
                <li>1 2/3 = (1 × 3 + 2) / 3 = <strong>5/3</strong></li>
                <li>1 3/4 = (1 × 4 + 3) / 4 = <strong>7/4</strong></li>
            </ul>
            <p>Use our <a href="/math-calculators/fraction-to-mixed-number-calculator">Fraction to Mixed Number Calculator</a> for this step.</p>

            <h3 id="step-lcd">Step Two: Find a Common Denominator</h3>
            <p>For <strong>addition</strong> and <strong>subtraction</strong>, you need fractions with the same denominator. Find the <a href="/math-calculators/lcd-calculator">Least Common Denominator (LCD)</a> and convert both fractions.</p>
            <p><strong>Continuing the example:</strong></p>
            <ul>
                <li>LCD(3, 4) = 12</li>
                <li>5/3 = (5 × 4) / (3 × 4) = <strong>20/12</strong></li>
                <li>7/4 = (7 × 3) / (4 × 3) = <strong>21/12</strong></li>
            </ul>

            <h3 id="step-operate">Step Three: Add or Subtract the Numerators</h3>
            <p>With matching denominators, add (or subtract) the numerators and keep the denominator.</p>
            <p>20/12 + 21/12 = (20 + 21) / 12 = <strong>41/12</strong></p>

            <h3 id="step-simplify">Step Four: Simplify and Convert Back</h3>
            <p>Simplify the fraction using the <a href="/math-calculators/gcd-calculator">GCD</a>, then convert back to a mixed number using <a href="/math-calculators/long-division-calculator">long division</a>.</p>
            <ul>
                <li>41/12 — GCD(41, 12) = 1, already simplified</li>
                <li>41 ÷ 12 = 3 remainder 5</li>
                <li>Result: 1 2/3 + 1 3/4 = <strong>3 5/12</strong></li>
            </ul>

            <div class="explanation__highlight">
                <strong>Tip:</strong> Skip Step Two for multiplication and division — you don't need a common denominator for those operations.
            </div>

            <h2 id="multiply-mixed">How to Multiply Mixed Numbers</h2>
            <p>Multiplying mixed numbers is actually <em>simpler</em> than adding them because you don't need a common denominator:</p>
            <ol>
                <li>Convert both mixed numbers to improper fractions.</li>
                <li>Multiply the numerators together and the denominators together.</li>
                <li>Simplify and convert back to a mixed number.</li>
            </ol>
            <p><strong>Example:</strong> 2 1/2 × 1 1/3</p>
            <ul>
                <li>2 1/2 = 5/2, 1 1/3 = 4/3</li>
                <li>5/2 × 4/3 = (5 × 4) / (2 × 3) = 20/6</li>
                <li>Simplify: GCD(20, 6) = 2 → 10/3</li>
                <li>Convert: 10 ÷ 3 = 3 R 1 → <strong>3 1/3</strong></li>
            </ul>

            <h2 id="divide-mixed">How to Divide Mixed Numbers</h2>
            <p>Dividing mixed numbers uses the "flip and multiply" method:</p>
            <ol>
                <li>Convert both mixed numbers to improper fractions.</li>
                <li><strong>Flip</strong> the second fraction (swap numerator and denominator).</li>
                <li>Multiply the fractions.</li>
                <li>Simplify and convert back.</li>
            </ol>
            <p><strong>Example:</strong> 3 1/2 ÷ 1 1/4</p>
            <ul>
                <li>3 1/2 = 7/2, 1 1/4 = 5/4</li>
                <li>Flip: 5/4 → 4/5</li>
                <li>7/2 × 4/5 = 28/10</li>
                <li>Simplify: GCD(28, 10) = 2 → 14/5</li>
                <li>Convert: 14 ÷ 5 = 2 R 4 → <strong>2 4/5</strong></li>
            </ul>

            <h2 id="faq">Frequently Asked Questions</h2>

            <h3>What is the difference between a mixed number and an improper fraction?</h3>
            <p>A <strong>mixed number</strong> has a whole number and a fraction (e.g., 2 3/4). An <strong>improper fraction</strong> has a numerator ≥ denominator (e.g., 11/4). They represent the same value: 2 3/4 = 11/4. Mixed numbers are easier to read; improper fractions are easier to calculate with.</p>

            <h3>Do I always need to convert to improper fractions first?</h3>
            <p>Yes — for all four operations. It's the simplest and most reliable approach. Once you've finished calculating, convert the result back to a mixed number for readability.</p>

            <h3>Can I add mixed numbers with different denominators?</h3>
            <p>Yes, but you must first find a <a href="/math-calculators/lcd-calculator">common denominator</a>. Convert both fractions to <a href="/math-calculators/equivalent-fractions-calculator">equivalent fractions</a> with the same denominator, then add the numerators.</p>

            <h3>Why don't I need a common denominator for multiplication?</h3>
            <p>When multiplying fractions, you simply multiply numerators together and denominators together. There's no combining of numerators that requires matching denominators. The same applies to division (after flipping the second fraction).</p>

            <h3>How do I subtract a larger mixed number from a smaller one?</h3>
            <p>The result will be <strong>negative</strong>. Follow the same steps — the answer will naturally come out negative. For example, 1 1/4 − 2 1/2 = 5/4 − 5/2 = 5/4 − 10/4 = −5/4 = <strong>−1 1/4</strong>.</p>
        `,
        formula: {
            formula: "Convert to improper → Operate → Simplify → Convert back",
            variables: [
                { symbol: "w n/d → (w×d+n)/d", meaning: "Convert mixed number to improper fraction" },
                { symbol: "LCD", meaning: "Least Common Denominator (needed for +/−)" },
                { symbol: "a/b × c/d = ac/bd", meaning: "Multiply numerators & denominators" },
                { symbol: "a/b ÷ c/d = a/b × d/c", meaning: "Flip second fraction and multiply" },
            ],
            example: [
                { label: "1 2/3 + 1 3/4", substitution: "5/3 + 7/4 = 20/12 + 21/12 = 41/12", result: "3 5/12" },
                { label: "2 1/2 × 1 1/3", substitution: "5/2 × 4/3 = 20/6 → 10/3", result: "3 1/3" },
                { label: "3 1/2 ÷ 1 1/4", substitution: "7/2 × 4/5 = 28/10 → 14/5", result: "2 4/5" },
            ],
        },
        relatedCalculators: [
            { title: "Fraction Calculator", slug: "fraction-calculator", categorySlug: "math-calculators", description: "Perform operations with regular fractions" },
            { title: "Fraction to Mixed Number", slug: "fraction-to-mixed-number-calculator", categorySlug: "math-calculators", description: "Convert between mixed numbers and improper fractions" },
            { title: "LCD Calculator", slug: "lcd-calculator", categorySlug: "math-calculators", description: "Find the common denominator for adding" },
            { title: "GCD Calculator", slug: "gcd-calculator", categorySlug: "math-calculators", description: "Simplify the result" },
            { title: "Equivalent Fractions", slug: "equivalent-fractions-calculator", categorySlug: "math-calculators", description: "Find fractions with matching denominators" },
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

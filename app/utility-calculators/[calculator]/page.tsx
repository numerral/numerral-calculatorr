// Dynamic Hub — /utility-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import UtilityCalculatorCore from "@/components/calculator/UtilityCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
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
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
}> = {
    "age-calculator": {
        subtitle: "Calculate your exact age in years, months & days. Find age between any two dates — past, present, or future.",
        explanation: {
            heading: "How the Age Calculator Works",
            paragraphs: [
                "Our age calculator determines your exact age by computing the difference between your date of birth and a target date. It accounts for varying month lengths (28/29/30/31 days) and leap years, giving you precise results in years, months, and days.",
                "Beyond basic age, it also calculates your total age in days, weeks, and months — useful for documents, insurance applications, and milestone tracking. It even tells you how many days are left until your next birthday.",
            ],
            highlight: "Born on Jan 15, 2000 → As of today, you're 26 years, 1 month, and 17 days old. That's 9,545 days, 1,363 weeks, or 313 months!",
        },
        faq: [
            { question: "How accurate is this age calculator?", answer: "It's precise to the day. The calculator accounts for leap years, varying month lengths, and correctly handles month-boundary cases (e.g., Feb 28 to March 31)." },
            { question: "Can I calculate age on a future date?", answer: "Yes! Set the 'Age on Date' to any future date and the calculator shows what your age will be on that date — useful for upcoming milestones or eligibility checks." },
        ],
    },
    "percentage-calculator": {
        subtitle: "5 percentage modes in one tool — X% of Y, what percent, % change, increase & decrease. Instant results.",
        explanation: {
            heading: "Understanding Percentages",
            paragraphs: [
                "Percentages are used everywhere — from discounts and taxes to exam scores and growth rates. Our calculator supports 5 modes: (1) X% of Y (e.g., 18% of ₹10,000 = ₹1,800), (2) X is what % of Y (e.g., 45 out of 60 = 75%), (3) Percentage change (e.g., from 80 to 100 = 25% increase).",
                "Modes 4 and 5 handle percentage increase and decrease directly — useful for salary hikes, price changes, and markup calculations.",
            ],
            highlight: "10% of 1,000 = 100 | 250 is 25% of 1,000 | From 80 to 100 = 25% increase | 1,000 + 15% = 1,150 | 1,000 − 20% = 800.",
        },
        faq: [
            { question: "How do I calculate what percentage X is of Y?", answer: "Use the 'X is ?% of Y' mode. Enter X (the part) and Y (the total). The formula is (X ÷ Y) × 100. Example: 45 is 75% of 60." },
            { question: "How is percentage change calculated?", answer: "Percentage change = ((New − Old) / Old) × 100. If the result is positive, it's an increase; if negative, it's a decrease." },
        ],
    },
    "compound-interest-calculator": {
        subtitle: "Calculate compound interest with monthly, quarterly, yearly or daily compounding. See year-by-year growth.",
        explanation: {
            heading: "The Power of Compound Interest",
            paragraphs: [
                "Compound interest means earning interest on your interest — creating exponential growth over time. The more frequently interest is compounded (daily > monthly > quarterly > yearly), the more you earn.",
                "Banks and FDs typically compound quarterly. SIPs and mutual funds compound at market rates. Our calculator shows you the maturity amount, effective rate, and a year-by-year breakdown of how your money grows.",
            ],
            highlight: "₹1 Lakh at 8% for 5 years: Yearly compounding → ₹1,46,933 | Monthly → ₹1,48,985 | Daily → ₹1,49,182. Monthly compounding earns ₹2,052 more than yearly!",
        },
        faq: [
            { question: "What is the compound interest formula?", answer: "A = P × (1 + r/n)^(n×t), where P = principal, r = annual rate, n = compounding frequency per year, t = time in years. Our calculator handles all the math for you." },
            { question: "Which compounding frequency is best?", answer: "Higher frequency = higher returns. Daily > Monthly > Quarterly > Yearly. But the practical difference between daily and monthly is small — focus on getting the best interest rate." },
        ],
    },
    "simple-interest-calculator": {
        subtitle: "Calculate simple interest on any amount at any rate. Includes automatic SI vs CI comparison.",
        explanation: {
            heading: "Simple Interest Explained",
            paragraphs: [
                "Simple interest is calculated only on the original principal — the formula is SI = (P × R × T) / 100. Unlike compound interest, simple interest grows linearly over time. It's commonly used for short-term loans and some fixed deposits.",
                "Our calculator automatically compares simple vs compound interest so you can see how much more you'd earn with compounding. For long tenures, the difference can be substantial.",
            ],
            highlight: "₹1 Lakh at 8% for 5 years: SI = ₹40,000 (₹1.40L total) | CI = ₹48,985 (₹1.49L total). CI earns ₹8,985 more — and the gap grows wider with longer tenures.",
        },
        faq: [
            { question: "What is the simple interest formula?", answer: "SI = (P × R × T) / 100, where P = principal, R = annual rate, T = time in years. Total amount = P + SI." },
            { question: "Where is simple interest used?", answer: "Short-term personal loans, some savings accounts, flat-rate car/bike loans, and short-duration FDs. Most modern financial products use compound interest." },
        ],
    },
    "bmi-calculator": {
        subtitle: "Calculate your BMI instantly. Know your weight category (underweight, normal, overweight, obese) and healthy weight range.",
        explanation: {
            heading: "Understanding Body Mass Index (BMI)",
            paragraphs: [
                "BMI is a screening tool that uses your weight and height to estimate body fat. The formula is BMI = Weight (kg) ÷ Height² (m²). A BMI of 18.5 to 24.9 is considered normal weight, with higher values indicating overweight or obesity.",
                "While BMI is widely used, it doesn't distinguish between muscle and fat mass. Athletes may have a high BMI with low body fat. For a complete assessment, combine BMI with waist circumference and other health metrics.",
            ],
            highlight: "70 kg at 170 cm → BMI 24.2 (Normal). Healthy weight range for 170 cm: 53.5 – 72.0 kg.",
        },
        faq: [
            { question: "What is a healthy BMI?", answer: "18.5 – 24.9. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese. These categories apply to adults (20+ years)." },
            { question: "Is BMI accurate for everyone?", answer: "BMI is a general screening tool. It may overestimate body fat in muscular individuals and underestimate in older adults. It doesn't account for age, sex, ethnicity, or muscle mass distribution." },
        ],
    },
    "discount-calculator": {
        subtitle: "Instantly calculate final sale prices, double discounts, and total savings.",
        explanation: {
            heading: "How Discount Calculations Work",
            paragraphs: [
                "A discount calculator helps consumers and retail business owners quickly determine the final selling price of an item after applying a percentage-based markdown. Simply input the original maximum retail price (MRP) and the discount percentage to instantly reveal the final price alongside the exact cash amount saved.",
                "In retail, promotional events frequently feature 'successive discounts' or 'double discounts'—such as '50% + 20% Off'. It is a common misconception that this equals a flat 70% off. In reality, the second discount is applied only to the already-reduced price, resulting in a true cumulative discount of 60%. Using a discount calculator ensures you never miscalculate these cascade scenarios.",
                "For business merchants, establishing the correct discount strategy is critical for balancing sales volume with profit margins. Markdown percentages must be carefully calibrated against wholesale costs and overheads to avoid selling products at a loss. Consumers, on the other hand, benefit by gaining instant clarity during large clearance events or when comparing promotional offers across different stores."
            ],
            highlight: "Retail Trick: 'Flat 50% Off' always provides deeper savings than '30% + 20% Off'. The latter only equates to an effective 44% discount.",
        },
        faq: [
            { question: "How do I calculate a discount manually?", answer: "Multiply the original price by the discount percentage (as a decimal). For example, a 20% discount on ₹1,000 is 1,000 × 0.20 = ₹200. The final price is ₹1,000 - ₹200 = ₹800." },
            { question: "What does '50% + 50% Off' mean?", answer: "It does not mean the item is free (100% off). The first 50% halves the price, and the second 50% halves the remaining price. The effective total discount is 75%." },
            { question: "How do I reverse calculate an original price?", answer: "If you know the discounted price and the discount percentage, divide the discounted price by (1 - discount percentage). For example, ₹800 / (1 - 0.20) = ₹1,000." }
        ],
    },
        faq: [
            { question: "Why is 20% + 10% not equal to 30%?", answer: "Because the second discount applies to the reduced price, not the original. 20% off ₹5,000 = ₹4,000, then 10% off ₹4,000 = ₹3,600 (28% total, not 30%)." },
            { question: "Is 20% + 10% the same as 10% + 20%?", answer: "Yes! The order doesn't matter. Both give the same final price. Mathematically: (1 − 0.2) × (1 − 0.1) = (1 − 0.1) × (1 − 0.2) = 0.72." },
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
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
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

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <UtilityCalculatorCore calcType={calc.calcType || "percentage"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

            <DynamicExplanation
                heading={hub.explanation.heading}
                paragraphs={hub.explanation.paragraphs}
                highlight={hub.explanation.highlight}
            />

            <FAQAccordion title={`${calc.title} FAQ`} items={hub.faq} />
        </main>
    );
}

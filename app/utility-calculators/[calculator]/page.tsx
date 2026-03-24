// Dynamic Hub — /utility-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import UtilityCalculatorCore from "@/components/calculator/UtilityCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
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
        explanation: {
            heading: "How the Age Calculator Works",
            paragraphs: [
                "Our age calculator works by computing the precise difference between your date of birth and a target date. It accounts for varying month lengths (28, 29, 30, or 31 days) and correctly handles leap years, giving you accurate results in years, months, and days.",
                "Beyond basic age, this tool also calculates your total age in days, weeks, and months — which is often needed for insurance applications, passport forms, scholarship eligibility, and government scheme verification. It also tells you how many days remain until your next birthday.",
            ],
            highlight: "Born on Jan 15, 2000 → As of today, you are 26 years, 1 month, and 17 days old. That's 9,545 days, 1,363 weeks, or 313 months of life!",
        },
        faq: [
            { question: "How accurate is this age calculator?", answer: "It is precise to the exact day. The calculator accounts for leap years, varying month lengths, and correctly handles boundary cases like February 28 to March 31." },
            { question: "Can I calculate age on a future date?", answer: "Yes. Set the 'Age on Date' to any future date and the calculator instantly shows what your age will be — helpful for upcoming events, deadlines, or eligibility checks." },
            { question: "What documents need age proof in India?", answer: "Many documents require age proof including passports, school admissions, pension applications, insurance policies, government job applications, and voter ID processing." },
        ],
    },
    "percentage-calculator": {
        subtitle: "Calculate percentages in 5 different ways — find X% of a number, percentage change, what percent one number is of another, and more.",
        explanation: {
            heading: "How to Use the Percentage Calculator",
            paragraphs: [
                "Percentages come up everywhere — from GST on your bill to discount on a sale, from exam scores to salary hikes. Our percentage calculator handles 5 common use cases: (1) X% of Y — for example, 18% of ₹10,000 is ₹1,800. (2) X is what percent of Y — 45 out of 60 is 75%. (3) Percentage change between two values — going from 80 to 100 is a 25% increase.",
                "Modes 4 and 5 handle direct percentage increase and decrease. Enter the original value and the percentage, and get the new value instantly. This is useful for calculating salary after a 12% hike, price after a 30% discount, or budget after a 10% reduction.",
            ],
            highlight: "Quick mental trick: To find 18% GST on ₹5,000, split it into 10% (₹500) + 8% (₹400) = ₹900 GST. Total payable = ₹5,900.",
        },
        faq: [
            { question: "How do I calculate GST from a total amount?", answer: "To find GST already included in the total, use the reverse GST formula: GST Amount = Total × (Rate ÷ (100 + Rate)). For 18% GST, divide total by 1.18 to get the base price, then subtract to get the GST." },
            { question: "What is percentage change and when do I use it?", answer: "Percentage change = ((New Value − Old Value) ÷ Old Value) × 100. Use it to measure growth in sales, change in price, returns on investment, or variation in any two comparable figures." },
            { question: "How is percentage different from percentage points?", answer: "Percentage points measure absolute differences — if inflation goes from 5% to 6%, that's 1 percentage point. But percentagewise, it's a 20% increase in the inflation rate. The distinction matters in financial and policy reporting." },
        ],
    },
    "compound-interest-calculator": {
        subtitle: "Calculate how your money grows with compound interest. See the total amount, interest earned, and year-by-year growth over time.",
        explanation: {
            heading: "How Compound Interest Works",
            paragraphs: [
                "Compound interest means you earn interest not just on your original principal, but also on the interest you have already earned. This creates a snowball effect — the longer you stay invested, the faster your money grows. It is why Warren Buffett calls compounding the 'eighth wonder of the world'.",
                "For example, ₹1 lakh invested at 12% per year for 20 years grows to ₹9.65 lakhs with simple interest. With compound interest (compounded annually), the same money grows to ₹9.65 lakhs too initially — but with monthly compounding, it reaches ₹10.89 lakhs. The frequency of compounding makes a real difference over time.",
            ],
            highlight: "Power of starting early: ₹5,000/month invested at 12% from age 25 grows to ₹1.76 Crores by age 60. Starting just 10 years later at 35 gives only ₹52 Lakhs — a ₹1.24 Crore difference from a 10-year delay.",
        },
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
            <AuthorBadge categoryKey="utility" />

            <div className="calculator-layout">
                <div className="calculator-layout__main">
                    <UtilityCalculatorCore calcType={calc.calcType || "percentage"} />
                </div>
                <aside className="calculator-layout__sidebar">
                    <TrendingCalculations />
                </aside>
            </div>

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
        </main >
    );
}

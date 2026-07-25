
// Dynamic Hub Page — /loan-calculators/[calculator]/ (Server Component)
// Handles all 6 EMI calculator hubs + 3 utility tools via one route

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import AuthorBadge from "@/components/shared/AuthorBadge";
import CalculatorCore from "@/components/calculator/CalculatorCore";
import LoanToolsCore from "@/components/calculator/LoanToolsCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import StepByStep from "@/components/shared/StepByStep";
import ComparisonCallout from "@/components/shared/ComparisonCallout";
import InsightBox from "@/components/shared/InsightBox";
import { getAllCalculators, getCalculatorById, getCalculatorsByCategory, getVariants } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema, faqSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { amountToLabel } from "@/lib/slug";
import { CIBIL_FAQS } from "@/lib/cibilConfig";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("loan");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("loan").find((c) => c.slug === calculator);
    if (!calc) return {};
    const hub = HUB_CONTENT[calc.slug];
    return {
        title: hub ? `${calc.title} | Numerral` : calc.title,
        description: hub?.explanation?.highlight ?? calc.description,
        alternates: { canonical: canonicalUrl(`/loan-calculators/${calc.slug}`) },
    };
}

const LOAN_TOOL_TYPES = ["emi-compare", "loan-eligibility", "prepayment"];

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    steps?: { label: string; formula: string; result: string }[];
    comparison?: { title: string; value: string; detail: string; isWinner?: boolean }[];
    insight?: { icon: string; title: string; text: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "debt-consolidation-calculator": {
        subtitle: "Calculate how much you can save by consolidating multiple debts into a single loan. Compare monthly payments, total interest, and payoff timelines side-by-side.",
        faq: [
            { question: "Will debt consolidation hurt my credit score?", answer: "Short-term: a small dip from the hard inquiry. Long-term: it typically improves your score by lowering credit utilization and reducing the number of accounts with balances." },
            { question: "What types of debt can be consolidated?", answer: "Credit card balances, personal loans, medical bills, payday loans, and store credit. Student loans and mortgages have their own refinancing programs." },
        ],
    },
    "loan-affordability-calculator": {
        subtitle: "Find out how much house you can afford based on your income, debts, and loan type. Compare Conventional, FHA, and VA loan limits with DTI ratio analysis.",
        explanation: {
            heading: "How Much House Can I Afford?",
            paragraphs: [
                "Mortgage lenders use debt-to-income (DTI) ratios to determine the maximum home price you can afford. DTI compares your monthly debt obligations to your gross monthly income. There are two types: the front-end ratio (housing costs only ÷ income) and the back-end ratio (all debts including housing ÷ income). Lenders use both to assess risk, and different loan programs have different thresholds.",
                "The most widely used standard is the 28/36 Rule for conventional loans: your housing costs (principal, interest, taxes, insurance) should not exceed 28% of gross monthly income (front-end), and your total monthly debts should not exceed 36% of gross income (back-end). On an $85,000 salary, this means a maximum housing payment of $1,983/month. With a 20% down payment at 6.5% for 30 years, that translates to approximately $315,000 in home value.",
                "FHA and VA loans offer more flexibility. FHA loans allow a 31/43 split (31% front-end, 43% back-end) and require as little as 3.5% down, making homeownership accessible with lower savings. VA loans for veterans have no front-end limit and a 41% back-end threshold with 0% down payment — the most generous program available. However, FHA requires mortgage insurance premiums (MIP) and VA charges a funding fee.",
            ],
            highlight: "With $85K income, $500/mo debts, 20% down at 6.5%: Conventional allows ~$313K house | FHA allows ~$362K | VA allows ~$377K. Higher DTI limits mean a bigger home, but also tighter monthly budgets.",
        },
        faq: [
            { question: "What is the 28/36 rule?", answer: "The 28/36 rule is the standard guideline for conventional mortgage loans. It states: your monthly housing payment (PITI — principal, interest, taxes, insurance) should be ≤ 28% of gross monthly income, and your total monthly debt (housing + car + student + credit cards) should be ≤ 36% of gross income. If your income is $7,000/month, housing max = $1,960 and total debt max = $2,520." },
            { question: "What is the difference between FHA, VA, and conventional loans?", answer: "Conventional loans follow the 28/36 rule and typically require 3-20% down. FHA loans (insured by the Federal Housing Administration) use 31/43 DTI limits with 3.5% minimum down, but require mortgage insurance premiums. VA loans (for veterans) have no front-end limit, 41% back-end limit, and 0% down payment — the most favorable terms available." },
            { question: "What is PMI and when is it required?", answer: "Private Mortgage Insurance (PMI) is required on conventional loans when the down payment is less than 20%. PMI costs 0.3-1.5% of the loan amount annually, added to your monthly payment. Once you reach 20% equity, you can request PMI removal. FHA has its own version called MIP (Mortgage Insurance Premium) that lasts for the life of the loan if down payment < 10%." },
            { question: "How does my credit score affect affordability?", answer: "Higher credit scores qualify you for lower interest rates, directly increasing your buying power. A 740+ score might get 6.0% while a 620 score might get 7.5%. On a $300K loan for 30 years, that 1.5% difference means $300+ more per month — which reduces the home you can afford by $45,000 or more." },
            { question: "How much should I save for a down payment?", answer: "Conventional: 3-20% (20% avoids PMI). FHA: 3.5% minimum (10% with credit score 500-579). VA: 0% down for eligible veterans. On a $300K home: 20% = $60,000, 10% = $30,000, 3.5% = $10,500. A larger down payment reduces your loan, lowers monthly payments, and may secure a better interest rate." },
            { question: "What if I can't afford the house I want?", answer: "Five strategies to increase affordability: (1) Reduce other debts to lower your back-end DTI, (2) Improve your credit score for better rates, (3) Save a larger down payment to eliminate PMI, (4) Increase income through career moves or side income, (5) Consider a less expensive area or smaller home. Many first-time buyer programs also offer down payment assistance." },
        ],
        steps: [
            { label: "Determine monthly income", formula: "$85,000 annual ÷ 12", result: "$7,083 gross monthly income" },
            { label: "Apply 28/36 rule (Conventional)", formula: "Front-end: $7,083 × 28% = $1,983 max housing", result: "Back-end: $7,083 × 36% = $2,550 max total debt" },
            { label: "Subtract existing debts", formula: "$2,550 − $500 monthly debts = $2,050 available for housing", result: "Lower of $1,983 and $2,050 → $1,983 max housing" },
            { label: "Calculate max home price", formula: "Subtract tax/ins/HOA, reverse P&I with 6.5% for 30yr", result: "Max home ≈ $313,000 with 20% down" },
        ],
        comparison: [
            { title: "Conventional (28/36)", value: "~$313K", detail: "Strictest DTI | 3-20% down | No MI with 20% down" },
            { title: "FHA (31/43)", value: "~$362K", detail: "Moderate DTI | 3.5% down | MIP required", isWinner: false },
            { title: "VA (41% back)", value: "~$377K", detail: "Most generous | 0% down | For veterans", isWinner: true },
        ],
        insight: { icon: "🏠", title: "The True Cost of Homeownership", text: "Your mortgage payment is just the beginning. Budget an additional 1-3% of home value per year for maintenance, 1-2% for property taxes, plus insurance, utilities, and HOA fees. On a $300K home, that's $6,000-$15,000/year beyond your mortgage. Financial advisors suggest total housing costs should stay below 30% of take-home pay — not gross income." },
        contentHTML: `
<h3>Front-End Ratio: Housing Costs Only</h3>
<p>The front-end debt ratio (also called the mortgage-to-income ratio) measures your housing costs as a percentage of gross monthly income. Housing costs include <strong>PITI</strong>: principal, interest, property taxes, and homeowner's insurance, plus HOA fees and PMI/MIP if applicable.</p>
<p><strong>Formula:</strong> Front-End DTI = (Total Monthly Housing Costs ÷ Gross Monthly Income) × 100</p>
<p>Conventional loans cap this at <strong>28%</strong>. FHA allows <strong>31%</strong>. VA loans generally don't enforce a front-end limit, focusing instead on the back-end ratio.</p>

<h3>Back-End Ratio: All Monthly Debts</h3>
<p>The back-end ratio includes everything in the front-end ratio plus all other recurring monthly debts: car payments, student loans, credit card minimums, personal loans, child support, and alimony.</p>
<p><strong>Formula:</strong> Back-End DTI = (Total Monthly Debts ÷ Gross Monthly Income) × 100</p>
<p>This is the primary ratio lenders examine. Conventional loans cap it at <strong>36%</strong>, FHA at <strong>43%</strong>, and VA at <strong>41%</strong>.</p>

<h3>Conventional Loans and the 28/36 Rule</h3>
<p>A conventional loan is a mortgage not insured by the federal government, generally following guidelines set by Fannie Mae and Freddie Mac. These can be <strong>conforming</strong> (meeting agency limits) or <strong>non-conforming</strong> (jumbo loans exceeding limits).</p>
<p>The <strong>28/36 Rule</strong> is the standard qualification guideline: no more than 28% of gross income on housing, no more than 36% on total debt. While widely used, this rule is sometimes relaxed in competitive markets — some lenders approve DTI ratios as high as 45-50% with strong compensating factors (high credit score, significant savings, large down payment).</p>

<h3>FHA Loans: Lower Barriers to Entry</h3>
<p>FHA loans, insured by the Federal Housing Administration, use a <strong>31/43 DTI standard</strong> — more lenient than conventional. Key features:</p>
<ul>
<li><strong>Minimum down payment:</strong> 3.5% (with credit score ≥ 580)</li>
<li><strong>Credit score:</strong> As low as 500 (with 10% down)</li>
<li><strong>Mortgage Insurance Premium (MIP):</strong> 1.75% upfront + 0.55% annual</li>
<li><strong>MIP duration:</strong> Life of loan if down payment < 10%; 11 years if ≥ 10%</li>
</ul>
<p>FHA loans are popular with first-time homebuyers due to lower entry requirements, but the mandatory MIP increases monthly costs compared to conventional loans with 20% down.</p>

<h3>VA Loans: Best Terms for Veterans</h3>
<p>VA loans, guaranteed by the U.S. Department of Veterans Affairs, use a <strong>41% back-end DTI</strong> with no specific front-end limit. They offer:</p>
<ul>
<li><strong>0% down payment</strong> — the only major loan program with no down payment</li>
<li><strong>No PMI/MIP</strong> — saving hundreds per month</li>
<li><strong>Competitive rates</strong> — typically 0.25-0.5% lower than conventional</li>
<li><strong>VA Funding Fee:</strong> 1.25-3.3% of loan amount (can be rolled into the loan)</li>
</ul>
<p>VA loans are available to veterans, active-duty service members, National Guard/Reserve members, and eligible surviving spouses.</p>

<h3>How to Increase Your Home Affordability</h3>
<p>If you can't immediately afford the home you want, here are proven strategies:</p>
<ol>
<li><strong>Reduce existing debt</strong> — Pay off credit cards and car loans to lower your back-end DTI. Every $200/month of eliminated debt increases your home buying power by approximately $30,000.</li>
<li><strong>Improve your credit score</strong> — Moving from 660 to 740 could save 0.5-1.0% on your rate, increasing your purchase power by $20,000-$40,000.</li>
<li><strong>Save a larger down payment</strong> — 20% down eliminates PMI and gets you better rates. Plus, every dollar of down payment directly adds to your max home price.</li>
<li><strong>Increase income</strong> — A $10,000 raise increases affordable home price by $25,000-$35,000 depending on the loan type.</li>
<li><strong>Consider location</strong> — Property taxes vary dramatically: New Jersey averages 2.5% while Hawaii averages 0.3%. Moving to a low-tax state can increase your affordable home price by $50,000+.</li>
</ol>

<h3>When Renting Makes More Financial Sense</h3>
<p>Homeownership isn't always the right choice. Renting may be smarter when: (1) you plan to move within 3-5 years (closing costs won't be recouped), (2) local rent-to-price ratios favor renting, (3) you have high-interest debt that should be paid first, or (4) the housing market is overheated. Use the "5% Rule": if annual rent is less than 5% of the home's purchase price, renting is likely the better financial decision.</p>
`,
    },
    "loan-interest-rate-calculator": {
        subtitle: "Reverse-calculate the effective interest rate on any loan from the EMI amount, principal, and tenure.",
        contentHTML: `<h3>Finding the Hidden Interest Rate</h3><p>Many lenders quote flat rates, processing fees, or EMI amounts without clearly disclosing the effective annual rate. This calculator uses iterative numerical methods to back-calculate the exact reducing-balance interest rate from your actual EMI, so you can compare apples-to-apples across lenders.</p><p><strong>Example:</strong> A car dealer offers ₹10L at "8% flat" for 5 years. EMI = ₹18,333. The effective reducing-balance rate is actually <strong>14.8%</strong> — nearly double the quoted flat rate.</p>`,
        faq: [
            { question: "What is the difference between flat and reducing rate?", answer: "Flat rate calculates interest on the original principal throughout. Reducing rate calculates on outstanding balance each month. A 10% flat rate ≈ 17-18% reducing rate. Always compare using reducing/effective rate." },
            { question: "How accurate is this reverse calculation?", answer: "The calculator uses binary search with 100 iterations to find the rate that produces your exact EMI. Accuracy is within ±0.01% of the true rate." },
        ],
    },
    "loan-payoff-calculator": {
        subtitle: "Calculate how extra payments or biweekly payments accelerate your mortgage payoff. See exactly how much interest you'll save and when you'll be debt-free.",
        explanation: {
            heading: "How to Pay Off Your Mortgage Faster",
            paragraphs: [
                "Every mortgage payment consists of two parts: principal (loan repayment) and interest (cost of borrowing). Because interest is calculated on the outstanding balance, early payments are overwhelmingly interest-heavy. On a $300,000 mortgage at 6.5%, your first payment of $1,896 contains $1,625 of interest and just $271 of principal — that's 86% interest. This front-loading is exactly why extra payments are so powerful: every extra dollar goes directly to principal, permanently reducing the balance that generates interest.",
                "The impact of extra payments is dramatic. Adding $500/month to a $300K mortgage at 6.5% saves approximately $122,000 in interest and pays off the loan nearly 8 years early. Even small amounts matter: just $100/month extra saves $44,000 and shaves off 4.5 years. The key is consistency — starting extra payments in Year 1 has roughly 3× the impact compared to starting in Year 10, because those early dollars eliminate years of compounding interest.",
                "Biweekly payments offer an effortless payoff acceleration strategy. Instead of 12 monthly payments, you pay half the monthly amount every two weeks. Since there are 52 weeks in a year, this results in 26 half-payments — the equivalent of 13 full monthly payments instead of 12. That one extra payment per year, made automatically, can shave 4-5 years off a 30-year mortgage and save tens of thousands in interest without significantly impacting your budget.",
            ],
            highlight: "$300K mortgage at 6.5%, 25 years remaining: Extra $500/month saves $122,306 in interest and pays off 7 years 9 months early. Biweekly payments (pay half every 2 weeks) save $46,000+ and pay off 4+ years early — with zero lifestyle change.",
        },
        faq: [
            { question: "How much can I save with extra mortgage payments?", answer: "On a $300K mortgage at 6.5%: $100 extra/month saves $44K (4.5yr early), $300 extra saves $90K (7yr early), $500 extra saves $122K (8yr early). The earlier you start making extra payments, the greater the compounding benefit." },
            { question: "How do biweekly mortgage payments work?", answer: "You pay half your monthly mortgage every two weeks. Since there are 52 weeks/year, you make 26 half-payments = 13 full payments instead of 12. The extra payment goes entirely to principal. On a 30-year mortgage, biweekly payments typically shave off 4-5 years and save 15-20% of total interest." },
            { question: "Are there penalties for paying off my mortgage early?", answer: "Most modern conventional mortgages have no prepayment penalties. FHA loans, VA loans, and loans from federally chartered credit unions are prohibited by law from charging prepayment penalties. However, some older or non-standard loans may have penalties in the first 3-5 years — check your loan documents or call your servicer." },
            { question: "Should I pay off my mortgage or invest instead?", answer: "Compare your mortgage rate to expected investment returns after tax. If your mortgage is 6.5% and you expect 8-10% stock market returns, investing may earn more — but with risk. Paying off the mortgage gives a guaranteed, risk-free return equal to your rate. Most financial advisors recommend: (1) Max out 401k match, (2) Pay off high-interest debt, (3) Build emergency fund, (4) Then split extra between mortgage payoff and investing." },
            { question: "Can I refinance to pay off my mortgage faster?", answer: "Yes — refinancing from a 30-year to a 15-year mortgage typically saves 55-65% of total interest. For example, $300K at 6.5% for 30 years = $382K interest. Refinanced to 15 years at 5.9% = $163K interest — savings of $219K. However, closing costs (2-5% of loan) must be factored in." },
            { question: "Is mortgage interest deductible on taxes?", answer: "Yes, in the U.S. you can deduct mortgage interest on up to $750,000 of loan balance ($375K if married filing separately). However, you only benefit if your itemized deductions exceed the standard deduction ($14,600 single / $29,200 married in 2024). Paying off your mortgage faster reduces this deduction." },
        ],
        steps: [
            { label: "Current mortgage snapshot", formula: "$300,000 balance, 6.5% rate, $1,896/mo payment", result: "Original payoff: 25 years" },
            { label: "Add $500/month extra", formula: "New monthly total: $2,396 | Extra goes entirely to principal", result: "New payoff: 17 years 3 months" },
            { label: "Calculate savings", formula: "Original interest: $269K | New interest: $147K", result: "Save $122,306 in interest" },
            { label: "Time saved", formula: "25 years − 17 years 3 months", result: "Pay off 7 years 9 months early" },
        ],
        comparison: [
            { title: "Normal Payments", value: "$1,896/mo", detail: "25 years remaining | Total interest: $269,000" },
            { title: "Extra $500/mo", value: "$2,396/mo", detail: "17yr 3mo remaining | Saves $122,306 interest!", isWinner: true },
        ],
        insight: { icon: "💡", title: "The 'Invisible' 13th Payment", text: "Biweekly payments are the easiest payoff strategy because they align with biweekly paychecks. You barely notice the change — paying $948 every two weeks instead of $1,896 once a month — but the math creates one full extra payment per year. Over a 30-year mortgage, this single trick saves $46,000+ in interest and eliminates 4-5 years of payments." },
        contentHTML: `
<h3>Principal and Interest: How Your Mortgage Payment Breaks Down</h3>
<p>Each monthly mortgage payment covers two things: <strong>principal</strong> (repaying what you borrowed) and <strong>interest</strong> (the lender's charge for lending you money). Interest is always calculated on the current outstanding balance, which means the proportion changes dramatically over the life of the loan.</p>
<p>On a $300,000 mortgage at 6.5% for 30 years ($1,896/month):</p>
<ul>
<li><strong>Month 1:</strong> $1,625 interest + $271 principal (86% interest)</li>
<li><strong>Month 180 (Year 15):</strong> $1,024 interest + $872 principal (54% interest)</li>
<li><strong>Month 300 (Year 25):</strong> $340 interest + $1,556 principal (18% interest)</li>
<li><strong>Month 360 (Final):</strong> $10 interest + $1,886 principal (0.5% interest)</li>
</ul>
<p>This is why each extra dollar paid early has an outsized impact — it eliminates the interest that dollar would have generated for the rest of the loan term.</p>

<h3>Extra Payments: How Small Amounts Create Big Savings</h3>
<p>Extra payments go entirely to principal reduction, which permanently shrinks the balance that accrues interest. Here's the impact on a $300K loan at 6.5%:</p>
<ul>
<li>Extra <strong>$100/month:</strong> Pays off <strong>4.5 years early</strong>, saves <strong>$44,000</strong></li>
<li>Extra <strong>$200/month:</strong> Pays off <strong>6.5 years early</strong>, saves <strong>$74,000</strong></li>
<li>Extra <strong>$500/month:</strong> Pays off <strong>8 years early</strong>, saves <strong>$122,000</strong></li>
<li>One-time <strong>$10,000 payment</strong> in Year 1: Saves <strong>$23,000</strong> over the loan life</li>
</ul>
<p>A one-time additional payment of $1,000 towards a $200,000, 30-year loan at 5% interest can pay off the loan four months earlier, saving $3,420 in interest. Extra monthly payments of just $6 on the same loan will pay it off four payments earlier, saving $2,796.</p>

<h3>Biweekly Payments: The Effortless Strategy</h3>
<p>Biweekly payments are the simplest and most painless way to accelerate mortgage payoff. Instead of paying $1,896 once a month, you pay <strong>$948 every two weeks</strong>.</p>
<p>The math: 52 weeks ÷ 2 = <strong>26 half-payments = 13 full payments</strong> per year instead of 12. That one extra payment per year, applied to principal, can shave 4–5 years off a 30-year mortgage. This strategy is especially effective for borrowers who receive biweekly paychecks.</p>

<h3>Refinancing to a Shorter Term</h3>
<p>Refinancing from a longer term to a shorter one can dramatically reduce your total interest, though your monthly payment will increase. For example, a borrower with $200,000 remaining at 5% interest with 20 years left can refinance to a new loan at 4%, reducing the monthly payment by $108 and saving $25,908 over the life of the loan.</p>
<p>However, refinancing comes with closing costs (typically 2–5% of the loan amount). Borrowers should calculate their <strong>break-even point</strong> — the month at which refinancing savings exceed the closing costs. Usually, refinancing makes sense if you plan to stay in the home at least 3-5 more years.</p>

<h3>Prepayment Penalties: What You Need to Know</h3>
<p>Some lenders charge penalties for paying off a mortgage early. Penalties are calculated in various ways: some charge 80% of six months' interest, while others charge a percentage of the remaining balance. These can amount to thousands of dollars, especially in the early years.</p>
<p>Important protections: <strong>FHA loans, VA loans, and loans from federally chartered credit unions prohibit prepayment penalties by law</strong>. Most modern conventional mortgages also lack prepayment penalties, but it's always wise to review your loan documents. When prepayment penalties do exist, they typically expire after 3-5 years.</p>

<h3>Opportunity Costs: Pay Off Mortgage or Invest?</h3>
<p>Before making extra mortgage payments, consider the <strong>opportunity cost</strong> — the potential returns you could earn by using that money elsewhere. Mortgages typically carry relatively low interest rates compared to other investment returns:</p>
<ul>
<li>If your mortgage rate is <strong>6.5%</strong> and the stock market returns <strong>10% annually</strong>, investing may produce higher returns — but with market risk</li>
<li>Paying off your mortgage provides a <strong>guaranteed, risk-free return</strong> equal to your interest rate</li>
<li>Always prioritize: <strong>(1)</strong> Employer 401k match, <strong>(2)</strong> High-interest debt (credit cards at 20%+), <strong>(3)</strong> Emergency fund, <strong>(4)</strong> Then split between mortgage payoff and investing</li>
</ul>
<p>Contributing to <strong>tax-advantaged accounts</strong> (401k, IRA, Roth IRA) should generally take priority over extra mortgage payments due to the combination of higher potential returns and significant tax benefits.</p>

<h3>Real-World Scenarios</h3>
<p><strong>Scenario 1: Christine</strong> — Christine wanted to pay off her mortgage early for peace of mind. But her financial advisor pointed out she had three credit cards with rates as high as 20%, while her mortgage was only 5%. By paying off the credit cards first, Christine eliminated far more interest charges.</p>
<p><strong>Scenario 2: Bob</strong> — Bob is debt-free except for his mortgage and had extra income to deploy. However, his company was laying off employees. His advisor recommended building a 6-month emergency fund before making extra mortgage payments — financial security should come before debt optimization.</p>
<p><strong>Scenario 3: Charles</strong> — Near retirement, Charles had maxed out his 401k, built an emergency fund, and had no other debt. With a conservative risk tolerance, his advisor recommended paying off the mortgage to enter retirement with zero housing expenses — a guaranteed return and maximum peace of mind.</p>
`,
    },
    "loan-amortization-calculator": {
        subtitle: "Generate a complete amortization schedule showing how each payment splits between principal and interest. See annual and monthly breakdowns, add extra payments, and plan your loan payoff strategy.",
        explanation: {
            heading: "What Is Loan Amortization?",
            paragraphs: [
                "Amortization is the process of gradually paying off a loan through scheduled periodic payments. Each payment consists of two parts: interest (the cost of borrowing) and principal (repayment of the actual loan balance). The standard amortization formula — M = P × r(1+r)^n / ((1+r)^n − 1) — produces a fixed monthly payment that fully retires the loan by the end of the term. This is how mortgages, car loans, personal loans, and student loans work in the U.S.",
                "What surprises most borrowers is how heavily front-loaded the interest is. On a 30-year mortgage at 6.5%, your first payment of $1,264 contains $1,083 of interest and only $181 of principal — that's 86% interest! By year 15 (the halfway point), you've paid $199,000 but only reduced the balance by $60,000. The crossover point where principal exceeds interest doesn't happen until month 248 of 360. This is the key insight that makes early prepayments so powerful.",
                "Smart borrowers use three strategies to minimize interest: (1) Extra monthly payments — even $100/month extra on a $200K loan at 6.5% saves $51,000 in interest and pays off 5 years early. (2) Biweekly payments — paying half the monthly amount every two weeks results in one extra payment per year, shaving 4-5 years off a 30-year mortgage. (3) Refinancing to a shorter term — moving from 30 years to 15 years roughly doubles your monthly payment but cuts total interest by 55-65%.",
            ],
            highlight: "$200K loan at 6.5% for 30 years: Monthly payment $1,264. Total interest: $255,089 — that's 128% of the original loan. The same loan at 15 years: $1,742/mo, total interest $113,539. You pay $478 more per month but save $141,550 in interest.",
        },
        faq: [
            { question: "What is an amortization schedule?", answer: "An amortization schedule (or amortization table) is a complete list of all loan payments, showing exactly how much of each payment goes to interest vs. principal, plus the remaining balance after each payment. It proves that early payments are heavily interest-loaded while later payments are mostly principal." },
            { question: "Why do I pay more interest at the beginning of a loan?", answer: "Because interest is calculated on the outstanding balance. At the start, your full loan amount is outstanding, so interest is at its maximum. As you pay down principal month after month, interest decreases and more of your fixed payment goes toward principal. On a 30-year mortgage, the interest-to-principal crossover happens around year 21." },
            { question: "How do extra payments affect my amortization schedule?", answer: "Extra payments go directly to principal reduction, which shrinks the balance that accrues interest. This creates a compounding benefit: $200/month extra on a $200K loan at 6.5% for 30 years saves $79,000 in interest and pays off the loan 8 years early. The earlier you start making extra payments, the greater the impact." },
            { question: "What is the difference between amortization and depreciation?", answer: "Both spread costs over time, but amortization applies to loan repayment (tangible debt) or intangible assets (patents, goodwill), while depreciation applies to tangible assets (equipment, buildings). In accounting, amortization of intangible assets under IRS Section 197 is typically 15 years." },
            { question: "Does amortization work the same for all loan types?", answer: "No. Standard amortization applies to fixed-rate loans (mortgages, car loans, personal loans). Adjustable-rate mortgages (ARMs) recalculate the payment when rates change. Credit cards use revolving debt (not amortized). Interest-only loans and balloon loans have different payment structures entirely." },
            { question: "How do I read an amortization table?", answer: "Each row represents one payment period (month or year). The columns show: Payment number, Payment amount, Principal portion, Interest portion, and Remaining balance. Watch how the principal portion grows and interest shrinks over time — this is the amortization curve in action." },
        ],
        steps: [
            { label: "Identify loan parameters", formula: "$200,000 loan, 6.5% annual rate, 30-year term", result: "Monthly rate: 0.5417%, 360 payments" },
            { label: "Calculate monthly payment", formula: "M = $200K × 0.005417 × 1.005417^360 ÷ (1.005417^360 − 1)", result: "Monthly payment: $1,264" },
            { label: "First month breakdown", formula: "Interest: $200K × 0.5417% = $1,083 | Principal: $1,264 − $1,083", result: "$1,083 interest + $181 principal" },
            { label: "Total cost over 30 years", formula: "$1,264 × 360 months", result: "Total: $455,089 ($255,089 interest)" },
        ],
        comparison: [
            { title: "30-Year Term", value: "$1,264/mo", detail: "Total interest: $255,089 | Lower payment, much higher total cost" },
            { title: "15-Year Term", value: "$1,742/mo", detail: "Total interest: $113,539 | Saves $141,550!", isWinner: true },
        ],
        insight: { icon: "⏱️", title: "The Early Prepayment Advantage", text: "A $5,000 extra payment in Year 1 of a 30-year mortgage saves approximately $14,000 in interest. The same $5,000 payment in Year 20 saves only $2,800. The amortization schedule reveals why: in early years, that $5,000 eliminates months of future interest charges. This is why financial planners call the first 5 years the 'golden window' for prepayments." },
        contentHTML: `
<h3>The Amortization Formula</h3>
<p>The fixed monthly payment for a fully amortizing loan is calculated using:</p>
<p><strong>M = P × [r(1 + r)<sup>n</sup>] / [(1 + r)<sup>n</sup> − 1]</strong></p>
<p>Where: <strong>M</strong> = monthly payment, <strong>P</strong> = principal (loan amount), <strong>r</strong> = monthly interest rate (annual rate ÷ 12), and <strong>n</strong> = total number of payments (years × 12). This formula ensures that each payment covers the accrued interest for the month and contributes to principal reduction, so the loan is fully paid off by payment <em>n</em>.</p>

<h3>Worked Example: $200,000 Mortgage at 6.5%</h3>
<p>For a $200,000 loan at 6.5% for 30 years (360 payments):</p>
<ul>
<li><strong>Monthly rate:</strong> 6.5% ÷ 12 = 0.5417%</li>
<li><strong>Monthly payment:</strong> $200,000 × [0.005417 × 1.005417<sup>360</sup>] / [1.005417<sup>360</sup> − 1] = <strong>$1,264.14</strong></li>
<li><strong>First payment:</strong> $1,083.33 interest + $180.81 principal (86% interest!)</li>
<li><strong>Final payment:</strong> $6.63 interest + $1,257.51 principal (0.5% interest)</li>
<li><strong>Total paid:</strong> $455,089 over 30 years ($255,089 in interest alone)</li>
</ul>

<h3>How Interest Front-Loading Works</h3>
<p>The single most important concept in amortization is <strong>interest front-loading</strong>. Because interest is calculated on the outstanding balance, early payments are overwhelmingly interest. On our $200K example:</p>
<ul>
<li><strong>Year 1:</strong> You pay $15,170 total, but only $2,240 goes to principal. The remaining $12,929 is interest.</li>
<li><strong>Year 15 (halfway):</strong> You've paid $227,545, but your remaining balance is still $139,920 — you've only paid off 30% of the loan!</li>
<li><strong>Year 21:</strong> The crossover point — for the first time, more of your monthly payment goes to principal than interest.</li>
<li><strong>Year 30:</strong> Your final year's payments are almost entirely principal ($14,880 principal vs $488 interest).</li>
</ul>
<p>This front-loading effect is why financial advisors emphasize <strong>early prepayments</strong>. Every extra dollar paid in Year 1 eliminates the compounding interest that dollar would have generated over the remaining 29 years.</p>

<h3>Strategies to Pay Off Your Loan Early</h3>
<p>There are three proven methods to reduce total interest and shorten your loan term:</p>
<p><strong>1. Extra Monthly Payments</strong></p>
<p>Adding even a small amount to each monthly payment goes directly to principal. On a $200K loan at 6.5% for 30 years:</p>
<ul>
<li>Extra $100/month: Pays off <strong>5 years early</strong>, saves <strong>$51,000</strong> in interest</li>
<li>Extra $200/month: Pays off <strong>8 years early</strong>, saves <strong>$79,000</strong> in interest</li>
<li>Extra $500/month: Pays off <strong>14 years early</strong>, saves <strong>$131,000</strong> in interest</li>
</ul>
<p><strong>2. Biweekly Payments</strong></p>
<p>Instead of 12 monthly payments, you make 26 half-payments (equivalent to 13 full payments per year). This one extra payment per year can shave 4–5 years off a 30-year mortgage and save tens of thousands in interest — without dramatically affecting your monthly budget.</p>
<p><strong>3. Refinancing to a Shorter Term</strong></p>
<p>Refinancing from a 30-year to a 15-year mortgage typically increases your payment by 35–45% but cuts total interest by 55–65%. On our $200K example: 30-year total interest is $255,089 vs. 15-year total interest of $113,539 — a savings of <strong>$141,550</strong>.</p>

<h3>Amortization in Accounting: Spreading Costs</h3>
<p>In business accounting, amortization has a second meaning: the systematic allocation of the cost of an <strong>intangible asset</strong> over its useful life. This is distinct from depreciation, which applies to tangible assets like machinery and buildings.</p>
<p>Under <strong>IRS Section 197</strong>, businesses can amortize certain intangible assets over a 15-year period. These include:</p>
<ol>
<li><strong>Goodwill</strong> — the reputation and customer loyalty of a business</li>
<li><strong>Going-concern value</strong> — the value of a business as a continuing operation</li>
<li><strong>Workforce in place</strong> — the value of current employees, their training and experience</li>
<li><strong>Business records and operating systems</strong> — customer lists, databases, information bases</li>
<li><strong>Patents, copyrights, and formulas</strong> — intellectual property with defined legal lifespans</li>
<li><strong>Customer-based intangibles</strong> — established customer relationships and bases</li>
<li><strong>Supplier-based intangibles</strong> — value from existing vendor relationships</li>
<li><strong>Government licenses and permits</strong> — rights granted by agencies</li>
<li><strong>Covenants not to compete</strong> — non-compete agreements from acquisitions</li>
<li><strong>Franchises, trademarks, and trade names</strong> — brand-related assets</li>
</ol>
<p>Note: Some intangible assets, such as goodwill that is self-created (not acquired in a purchase), cannot be amortized for tax purposes.</p>

<h3>Amortizing Business Startup Costs</h3>
<p>In the United States, business startup costs — defined as expenses incurred to investigate, create, or acquire an active business — can be amortized under specific IRS rules. These costs include consulting fees, financial analysis, advertising expenditures, and employee payments incurred before the business becomes active. According to IRS guidelines, qualifying startup costs are amortized over a <strong>180-month (15-year) period</strong> beginning in the month the business starts operating.</p>

<h3>Amortization vs. Depreciation</h3>
<p>While both concepts involve spreading costs over time, there is an important distinction:</p>
<ul>
<li><strong>Amortization</strong> applies to <strong>intangible assets</strong> (patents, trademarks, goodwill, copyrights) and loan repayment schedules</li>
<li><strong>Depreciation</strong> applies to <strong>tangible assets</strong> (buildings, equipment, vehicles, machinery)</li>
</ul>
<p>Both reduce taxable income by recognizing a portion of the asset's cost as an expense each year. The key difference is what type of asset is being written down. Amortization is typically straight-line (equal amounts each year), while depreciation can use accelerated methods like MACRS (Modified Accelerated Cost Recovery System) under U.S. tax law.</p>

<h3>Types of Loans That Use Amortization</h3>
<p>Standard amortization applies to most common loan types in the U.S.:</p>
<ul>
<li><strong>Fixed-rate mortgages</strong> — 15-year and 30-year conventional, FHA, VA loans</li>
<li><strong>Auto loans</strong> — typically 36–84 month terms</li>
<li><strong>Personal loans</strong> — usually 12–60 month terms</li>
<li><strong>Student loans</strong> — federal and private, 10–25 year repayment plans</li>
</ul>
<p>Loans that do <strong>not</strong> follow standard amortization include:</p>
<ul>
<li><strong>Credit cards</strong> — revolving debt with variable payments</li>
<li><strong>Interest-only loans</strong> — payments cover interest only with no principal reduction</li>
<li><strong>Balloon loans</strong> — small payments with a large lump sum due at maturity</li>
<li><strong>Adjustable-rate mortgages (ARMs)</strong> — payments recalculate when the rate adjusts</li>
</ul>
`,
    },
    "ltv-calculator": {
        subtitle: "Calculate your Loan-to-Value ratio to determine borrowing limits, PMI requirements, and interest rate eligibility.",
        contentHTML: `<h3>Understanding LTV Ratio</h3><p>LTV = (Loan Amount ÷ Property Value) × 100. A lower LTV means less risk for the lender, which translates to better rates and terms for you.</p><ul><li><strong>LTV ≤ 80%:</strong> No PMI required, best rates available</li><li><strong>LTV 80-90%:</strong> PMI required, slightly higher rates</li><li><strong>LTV 90-95%:</strong> PMI required, limited lender options</li><li><strong>LTV > 95%:</strong> Very few lenders, highest rates</li></ul>`,
        faq: [
            { question: "What is a good LTV ratio?", answer: "Below 80% is ideal — it avoids PMI and qualifies you for the best rates. For investment properties, lenders typically require LTV below 70-75%." },
            { question: "How does LTV affect my interest rate?", answer: "Every 5% reduction in LTV can save 0.125-0.25% on your rate. On a $300K loan, that's $2,000-$4,000 saved over the life of the loan." },
        ],
    },
    "balloon-loan-calculator": {
        subtitle: "Calculate payments for a balloon loan with a large lump-sum payment due at the end of the term.",
        contentHTML: `<h3>How Balloon Loans Work</h3><p>A balloon loan has lower monthly payments because it's amortized over a longer period than the actual loan term. At the end of the term, the remaining balance (the "balloon") is due in one lump sum.</p><p><strong>Example:</strong> A $300K loan with 7-year term amortized over 30 years gives you the payment of a 30-year mortgage, but after 7 years you owe the remaining ~$265K as a balloon payment.</p><div class="explanation__highlight"><strong>Risk factor:</strong> Balloon loans assume you'll refinance or sell before the balloon is due. If property values drop or your credit deteriorates, you may not qualify for refinancing — leaving you with a massive payment you can't cover.</div>`,
        faq: [
            { question: "Who should use a balloon loan?", answer: "Investors planning to flip a property within 5-7 years, borrowers expecting a large future windfall, or buyers who plan to refinance before the balloon date. Not recommended for primary residences unless you have a clear exit strategy." },
            { question: "What happens if I can't pay the balloon?", answer: "Options include refinancing, negotiating an extension with the lender, selling the asset, or in worst case, defaulting on the loan. Always have a backup plan." },
        ],
    },
    "arm-calculator": {
        subtitle: "Calculate payments for an adjustable-rate mortgage. See how rate changes after the introductory period impact your monthly payment.",
        contentHTML: `<h3>How Adjustable Rate Mortgages Work</h3><p>An ARM offers a lower fixed rate for an intro period (typically 3, 5, 7, or 10 years), then adjusts periodically based on a reference index plus a margin. Common structures:</p><ul><li><strong>5/1 ARM:</strong> Fixed for 5 years, adjusts annually after</li><li><strong>7/6 ARM:</strong> Fixed for 7 years, adjusts every 6 months</li><li><strong>10/1 ARM:</strong> Fixed for 10 years, adjusts annually</li></ul><p>Rate caps limit how much the rate can change: initial cap (first adjustment), periodic cap (each subsequent adjustment), and lifetime cap (maximum over the loan's life).</p>`,
        faq: [
            { question: "When is an ARM better than a fixed rate?", answer: "When you plan to sell or refinance before the intro period ends. If you're in a 5/1 ARM and sell in year 4, you benefit from 4 years of lower payments without ever facing the rate adjustment." },
            { question: "How much can my ARM rate increase?", answer: "Typical caps: 2% initial adjustment, 1-2% per year after, 5-6% lifetime cap. A 5% ARM with 5% lifetime cap can never exceed 10%, even if market rates go higher." },
        ],
    },
    "fixed-vs-variable-calculator": {
        subtitle: "Compare fixed-rate vs variable-rate loans side by side. See which saves more based on your expected rate trajectory.",
        contentHTML: `<h3>Fixed vs Variable: The Key Decision</h3><p>This is one of the most consequential decisions in personal finance. The right choice depends on rate outlook, your risk tolerance, and how long you'll hold the loan.</p><ul><li><strong>Choose Fixed when:</strong> Rates are historically low, you want predictability, or you plan to hold 10+ years</li><li><strong>Choose Variable when:</strong> Rates are high and expected to fall, you plan to sell/refinance in 3-5 years, or you can handle payment fluctuations</li></ul>`,
        faq: [
            { question: "What if rates stay flat?", answer: "Variable wins — it starts lower and stays lower. Fixed rate includes a premium for certainty. If rates don't rise enough to offset that premium, variable saves money." },
            { question: "Can I switch from variable to fixed?", answer: "Yes, most lenders offer a rate conversion option, though there may be a switching fee. You can also refinance with a different lender to lock in a fixed rate." },
        ],
    },
    "extra-payment-calculator": {
        subtitle: "See the powerful impact of making extra monthly payments or lump-sum prepayments on your loan payoff timeline and total interest.",
        contentHTML: `<h2>The Power of Extra Loan Payments</h2>
<p>Making extra payments on your loan is one of the most mathematically powerful personal finance decisions you can make. When you pay more than the required monthly amount, <strong>100% of the extra amount goes directly to reducing your principal</strong> — not to interest. This creates a compounding benefit that accelerates payoff dramatically and eliminates thousands in future interest charges.</p>

<h3>Why Early Extra Payments Have Outsized Impact</h3>
<p>Because loan interest is calculated on the <strong>outstanding balance</strong>, every dollar of principal reduction early in the loan eliminates multiple years of future interest accrual. A loan's amortization schedule is front-loaded with interest — meaning the earlier you reduce principal, the more interest you eliminate.</p>
<div class="explanation__highlight">
<strong>Impact of Extra $500/month on a $300,000 Mortgage at 6.5% (30 years):</strong><br/>
Original payoff: 360 months | New payoff: 264 months (22 years)<br/>
Time saved: <strong>8 years</strong> | Interest saved: <strong>$122,000+</strong><br/><br/>
<strong>Starting same extra payment in Year 10 instead of Year 1 saves only $68,000</strong> — demonstrating the premium on starting early
</div>

<h3>Extra Payment Scenarios — Impact Comparison</h3>
<table><thead><tr><th>Extra Monthly</th><th>Years Saved</th><th>Interest Saved</th><th>Monthly Cost Increase</th></tr></thead><tbody>
<tr><td>$100</td><td>~4.5 years</td><td>~$44,000</td><td>Modest</td></tr>
<tr><td>$200</td><td>~6.5 years</td><td>~$74,000</td><td>Low</td></tr>
<tr><td>$500</td><td>~8 years</td><td>~$122,000</td><td>Moderate</td></tr>
<tr><td>$1,000</td><td>~11 years</td><td>~$165,000</td><td>Significant</td></tr>
</tbody></table>
<p><em>Based on $300,000 mortgage at 6.5% for 30 years. Your results will vary based on loan balance and rate.</em></p>

<h3>Lump-Sum vs Monthly Extra Payments</h3>
<p><strong>Lump-sum prepayments</strong> (from bonuses, tax refunds, or inheritance) are highly effective but carry timing considerations. A single $10,000 lump sum applied in Year 1 can save as much in total interest as making $150/month in extra payments over the same period.</p>
<p><strong>Monthly extra payments</strong> are more consistent and disciplined — easier to budget for and compound steadily over time. Setting up automatic overpayment with your lender is the most reliable approach.</p>

<h3>Reduce EMI vs Reduce Tenure — Which is Smarter?</h3>
<p>When you make a prepayment, many lenders give you two options:</p>
<ul>
<li><strong>Reduce Tenure:</strong> Keep the same monthly payment but pay off the loan sooner. <strong>This saves more total interest.</strong></li>
<li><strong>Reduce EMI:</strong> Lower your monthly payment while keeping the same payoff date. Provides immediate cash flow relief but saves less interest.</li>
</ul>
<div class="explanation__highlight"><strong>Recommendation:</strong> Choose tenure reduction unless you have a specific cash flow need. Reducing tenure by 3 years on a $300K mortgage saves approximately $60,000 more than reducing EMI by the equivalent amount.</div>

<h3>Biweekly Payments — The Zero-Effort Acceleration</h3>
<p>Switching from monthly to biweekly payments results in 26 half-payments per year instead of 12 full payments — the equivalent of one extra full payment annually. This effortless switch can shave 4-5 years off a 30-year mortgage and save $40,000-$50,000 in interest on a typical loan, without any lifestyle change.</p>

<h3>Should I Invest Instead of Prepaying?</h3>
<p>This depends on your loan rate vs. expected investment returns:</p>
<ul>
<li><strong>Loan at 6.5%, expected equity returns 10%:</strong> Investing may generate more — but with risk</li>
<li><strong>Prepaying gives a guaranteed, risk-free return</strong> equal to your interest rate</li>
<li><strong>Always prioritize:</strong> (1) Employer 401k match, (2) High-interest debt payoff, (3) Emergency fund, then (4) Split between investment and prepayment based on risk tolerance</li>
</ul>

<h3>References</h3>
<ul>
<li>Consumer Financial Protection Bureau (CFPB) — cfpb.gov</li>
<li>Federal Reserve — Regulation Z / Truth in Lending Act (prepayment penalty rules)</li>
</ul>`,
        faq: [
            { question: "Should I reduce EMI or reduce tenure?", answer: "Reducing tenure saves significantly more interest. Reducing EMI gives immediate cash flow relief. If finances allow, always choose tenure reduction — it can save 15-30% more interest than EMI reduction." },
            { question: "When is the best time to prepay?", answer: "As early as possible. A ₹1L prepayment in year 1 of a 20-year loan saves 3-4× more interest than the same ₹1L prepayment in year 15. The amortization curve heavily favors early intervention." },
        ],
    },
    "refinance-calculator": {
        subtitle: "Compare your current loan with a refinanced loan. Calculate monthly payment savings, total interest savings, and break-even period after closing costs.",
        explanation: {
            heading: "What Is Loan Refinancing?",
            paragraphs: [
                "Loan refinancing means replacing your current loan with a new one — usually with a lower interest rate, different term, or both. The new loan pays off the old one entirely, and you start making payments on the new loan going forward. Common types include mortgage refinancing, student loan refinancing, auto loan refinancing, and credit card balance transfers. Refinancing is different from debt restructuring, which renegotiates existing terms under financial distress.",
                "The most critical calculation in any refinance decision is the break-even analysis. Break-even = total closing costs ÷ monthly savings. If closing costs are $4,000 and you save $200/month, the break-even point is 20 months. If you plan to keep the loan past that point, refinancing saves money. If you'll pay it off or move before then, refinancing costs you money.",
                "Important caveat: refinancing resets your amortization schedule. If you refinance a 30-year mortgage into another 30-year mortgage in year 5, you now have 35 total years of payments. To avoid this trap, refinance to a shorter term (like 20 or 15 years) so you don't extend your total repayment period.",
            ],
            highlight: "Example: $300K mortgage at 7.5% refinanced to 6.0%. Monthly savings: $332. With $6,000 closing costs, break-even is 18 months. Total savings over remaining 25 years: $93,600 in interest.",
        },
        faq: [
            { question: "When does refinancing make financial sense?", answer: "Refinancing is worth it when: (1) the new rate is 0.75-1% lower than current rate, (2) you'll keep the loan past the break-even point, (3) your credit score has improved significantly, (4) you want to switch from ARM to fixed rate, (5) you need to remove PMI, or (6) you want to consolidate multiple debts into one payment." },
            { question: "What are typical refinancing costs?", answer: "Mortgage refinance: 2-5% of loan amount ($6,000-$15,000 on $300K). Includes application fee (1%), appraisal ($300-$600), title insurance ($500-$2,000), origination fee (0.5-1.5%), recording fees ($50-$250). Student loan refinance: usually no fees. Auto loan refinance: $50-$300 in admin/transfer fees." },
            { question: "How many times can I refinance?", answer: "There's no legal limit, but each refinance incurs costs and temporarily drops your credit score (hard inquiry). Some lenders require a 'seasoning period' — waiting 6-12 months between refinances. The key question: do the savings exceed the costs each time?" },
            { question: "Does refinancing hurt my credit score?", answer: "Temporarily, yes. The lender performs a hard inquiry (5-10 point drop), and the new account lowers your average account age. However, lower monthly payments can improve your debt-to-income ratio long-term, and consistent payments on the new loan rebuild your score within 6-12 months." },
            { question: "What is a cash-out refinance?", answer: "Cash-out refinancing replaces your mortgage with a larger loan, and you receive the difference in cash. Example: you owe $200K on a home worth $350K. You refinance for $280K and receive $80K cash. Requires at least 20% remaining equity. Common uses: home improvements, debt consolidation, emergency expenses." },
            { question: "Should I refinance student loans?", answer: "It depends. Federal student loans have benefits (income-driven repayment, forgiveness programs, deferment) that are LOST when refinanced to private loans. Only refinance federal loans if you don't need these protections and can get a significantly lower rate. Private student loans are usually good candidates for refinancing." },
        ],
        steps: [
            { label: "Current loan payment", formula: "$300,000 at 7.5%, 25 yrs left", result: "$2,218/month" },
            { label: "New loan payment", formula: "$300,000 at 6.0%, 25 years", result: "$1,933/month" },
            { label: "Monthly savings", formula: "$2,218 − $1,933", result: "$285/month saved" },
            { label: "Break-even point", formula: "$6,000 costs ÷ $285/month", result: "21 months to break even" },
        ],
        comparison: [
            { title: "Rate-and-Term", value: "Most Common", detail: "Lower rate and/or shorter term | Same loan balance", isWinner: true },
            { title: "Cash-Out", value: "Access Equity", detail: "Higher loan amount | Receive cash difference" },
            { title: "Streamline (FHA/VA)", value: "Easiest Process", detail: "Minimal paperwork | No appraisal required" },
        ],
        insight: { icon: "⚠️", title: "The Hidden Cost of Extending Your Term", text: "Refinancing a 30-year mortgage at year 8 into a new 30-year mortgage means 38 total years of payments instead of 30. Even with a lower rate, you could pay MORE total interest. Solution: refinance to a 20 or 22-year term to maintain your original payoff date. The monthly payment will be slightly higher than a 30-year, but total savings are dramatically better." },
        contentHTML: `
<h3>What Is Loan Refinancing?</h3>
<p>Refinancing involves taking out a new loan to replace an existing one, typically to secure better terms. The new loan pays off the old balance in full, and the borrower begins making payments on the new loan. While most commonly associated with mortgages, refinancing applies to car loans, student loans, personal loans, and even credit card debt (via balance transfers).</p>

<h3>6 Reasons to Refinance</h3>
<ol>
<li><strong>Lower interest rate</strong> — The most common reason. If rates have dropped or your credit score improved, a lower rate means less interest over the life of the loan and lower monthly payments</li>
<li><strong>Cash-out equity</strong> — Borrow against accumulated home equity for renovations, debt consolidation, or emergencies. Requires maintaining at least 20% equity after the new loan</li>
<li><strong>Lower monthly payment</strong> — Extending the loan term reduces monthly payments, providing breathing room — though you'll pay more total interest</li>
<li><strong>Shorten the loan term</strong> — Refinancing from a 30-year to 15-year mortgage typically comes with a lower rate AND faster payoff, though monthly payments increase</li>
<li><strong>Consolidate debts</strong> — Combine multiple loans into one payment, ideally at a lower overall rate. Simplifies finances and may reduce total monthly obligations</li>
<li><strong>Switch rate type</strong> — Convert from adjustable-rate (ARM) to fixed-rate to lock in certainty, or from fixed to ARM if you plan to sell before the adjustment period</li>
</ol>

<h3>Types of Refinancing</h3>
<table><tr><th>Type</th><th>How It Works</th><th>Best For</th></tr>
<tr><td>Rate-and-Term</td><td>Change rate and/or loan length, same balance</td><td>Lowering rate or shortening term</td></tr>
<tr><td>Cash-Out</td><td>New loan is larger than old balance; receive difference</td><td>Home improvements, debt consolidation</td></tr>
<tr><td>Cash-In</td><td>Pay additional cash at closing to reduce new balance</td><td>Removing PMI, qualifying for better rate</td></tr>
<tr><td>Streamline (FHA/VA)</td><td>Simplified process with reduced documentation</td><td>Existing FHA or VA loan holders</td></tr>
<tr><td>No-Closing-Cost</td><td>Closing costs rolled into loan or offset by higher rate</td><td>Short-term ownership plans</td></tr></table>

<h3>Refinancing Student Loans</h3>
<p><strong>Federal student loans</strong> carry unique benefits: income-driven repayment plans, Public Service Loan Forgiveness (PSLF), deferment/forbearance options, and death/disability discharge. Refinancing federal loans into private loans permanently surrenders these protections. Only refinance federal loans if you have stable income, don't qualify for forgiveness, and can secure a meaningfully lower rate.</p>
<p><strong>Private student loans</strong> lack these protections, making them better candidates for refinancing. Grad PLUS and Parent PLUS loans typically have the highest rates and benefit most from refinancing.</p>

<h3>Refinancing Car Loans</h3>
<p>Auto loan refinancing can lower your rate if your credit has improved or rates have dropped. Key considerations:</p>
<ul>
<li>Check for prepayment penalties on your current loan</li>
<li>Avoid "upside-down" loans — where you owe more than the car is worth</li>
<li>Extending the term lowers payments but increases total cost</li>
<li>Typical costs: $50-$300 (admin fees, lien transfer, state re-registration)</li>
</ul>

<h3>Refinancing Credit Card Debt</h3>
<p>Credit card refinancing typically involves a <strong>balance transfer</strong> to a new card with 0% intro APR (usually 12-21 months). Transfer fees of 3-5% apply, but at 0% interest, even with the fee, this saves significantly versus paying 20%+ APR. After the intro period ends, the standard rate applies to remaining balances.</p>

<h3>When NOT to Refinance</h3>
<ul>
<li>You're close to paying off the current loan (little interest left to save)</li>
<li>Closing costs exceed total interest savings</li>
<li>You plan to sell or move before the break-even point</li>
<li>Your credit score has declined (you'll get worse terms)</li>
<li>You'd lose valuable benefits (federal student loan protections)</li>
</ul>
`,
    },
    "mortgage-refinance-calculator": {
        subtitle: "Mortgage-specific refinance analysis with closing costs, PMI changes, break-even timeline, and total cost comparison over the life of the loan.",
        explanation: {
            heading: "Should You Refinance Your Mortgage?",
            paragraphs: [
                "Mortgage refinancing replaces your existing home loan with a new one. The most common scenarios: rates have dropped since you took out your mortgage, your credit score has improved, your home has appreciated (enabling PMI removal or cash-out), or you want to switch from an adjustable rate to a fixed rate. In the U.S., mortgage refinancing typically costs 2-5% of the loan amount in closing costs.",
                "There are four main types: rate-and-term (most common — lower your rate and/or shorten your term), cash-out (borrow more than you owe and pocket the difference), FHA Streamline (simplified refinance for existing FHA loans), and ARM-to-fixed (lock in a stable rate before your ARM adjusts upward).",
                "The critical decision factor is break-even timing. If refinancing your $300,000 mortgage costs $8,000 in closing costs and saves $250/month, your break-even point is 32 months. If you'll stay in the home longer than 32 months, refinancing saves money. If you plan to move sooner, you'll lose money.",
            ],
            highlight: "$300K mortgage: 7.5% → 6.0%. Monthly savings: $332. Closing costs: $8K. Break-even: 24 months. If you stay 10+ years, total savings: $31,840 in interest.",
        },
        faq: [
            { question: "What are the types of mortgage refinancing?", answer: "Rate-and-term: change rate/term, same balance. Cash-out: larger loan, receive cash difference (need 20% equity). Cash-in: pay cash to reduce balance (remove PMI or get better rate). FHA Streamline: simplified for FHA holders. VA IRRRL: Interest Rate Reduction Refinance Loan for VA borrowers." },
            { question: "What fees are involved in mortgage refinancing?", answer: "Application fee (~1% of loan), home appraisal ($300-$600), origination fee (0.5-1.5%), title search ($200-$400), title insurance ($500-$2,000), recording fee ($50-$250), document preparation ($200-$500), flood certification ($15-$25). Total: typically 2-5% of loan amount." },
            { question: "When should I refinance my mortgage?", answer: "When rates drop 0.75-1% below your current rate, when your credit score has improved significantly (680+ to 740+), when you want to switch from ARM to fixed before adjustment, when you have 20% equity and want to drop PMI, or when you need cash for major expenses (cash-out refi)." },
            { question: "Does refinancing reset my amortization?", answer: "Yes. A 30-year refinance in year 8 means 38 total years of payments. To avoid this, refinance to a term that matches your remaining payoff timeline (e.g., 22-year term if you had 22 years left). This maintains your original payoff date while capturing the lower rate." },
            { question: "Can I refinance from FHA to conventional?", answer: "Yes, and it's often smart. FHA loans require mortgage insurance premium (MIP) for the life of the loan. Once you have 20% equity, refinancing to conventional eliminates MIP entirely. This alone can save $100-$300/month depending on loan size." },
            { question: "What credit score do I need to refinance?", answer: "Conventional: 620 minimum, 740+ for best rates. FHA Streamline: 580+. VA IRRRL: no minimum (but most lenders require 620+). A higher credit score not only qualifies you but gets you a significantly better rate — the difference between 680 and 760 can be 0.5% in rate." },
        ],
        steps: [
            { label: "Current mortgage details", formula: "$300K at 7.5%, 25 years remaining", result: "$2,218/month P&I" },
            { label: "New loan terms", formula: "$300K at 6.0%, 25 years", result: "$1,933/month P&I" },
            { label: "Monthly savings", formula: "$2,218 − $1,933", result: "$285 saved per month" },
            { label: "Break-even analysis", formula: "$8,000 closing costs ÷ $285", result: "28 months to recoup costs" },
        ],
        comparison: [
            { title: "Rate-and-Term", value: "Most Popular", detail: "Same balance | Lower rate/shorter term | 2-5% costs", isWinner: true },
            { title: "Cash-Out", value: "Access Equity", detail: "Larger loan | Receive cash | Need 20% equity" },
            { title: "FHA Streamline", value: "Easiest", detail: "No appraisal | Reduced docs | FHA-to-FHA only" },
        ],
        insight: { icon: "🏠", title: "FHA-to-Conventional: The Hidden PMI Savings", text: "FHA loans charge MIP for the entire life of the loan — even after you pass 20% equity. On a $300K loan, that's roughly $212/month ($2,550/year) that NEVER goes away unless you refinance to conventional. Once you reach 20% equity, refinancing to conventional eliminates MIP entirely. Over 20 remaining years, that saves $51,000. The closing costs ($6-8K) pay for themselves in under 3 years." },
        contentHTML: `
<h3>4 Types of Mortgage Refinancing</h3>
<p>Understanding the different refinance types helps you choose the right approach:</p>
<ul>
<li><strong>Rate-and-Term Refinance</strong> — The most common type. You change the interest rate and/or loan length while keeping the same balance. Ideal when rates drop or your credit improves</li>
<li><strong>Cash-Out Refinance</strong> — Replace your mortgage with a larger loan and receive the difference as cash. Requires at least 20% remaining equity. Common uses: home improvements, paying off high-interest debt, emergency expenses. Rates are typically 0.125-0.25% higher than rate-and-term</li>
<li><strong>FHA Streamline Refinance</strong> — Available only to existing FHA loan holders. Simplified process with no appraisal required, reduced documentation, and the benefit of net tangible cost must be met. Ideal for FHA borrowers who want a lower rate without the hassle of a full refinance</li>
<li><strong>ARM-to-Fixed Refinance</strong> — Converts an adjustable-rate mortgage to a fixed rate before the ARM adjustment period begins. Provides payment certainty and protection from rising rates. Most valuable when you plan to stay in the home long-term</li>
</ul>

<h3>Mortgage Refinance Closing Costs Breakdown</h3>
<p>Refinancing a mortgage involves several fees, typically totaling 2-5% of the loan amount:</p>
<table><tr><th>Fee</th><th>Typical Cost</th><th>Notes</th></tr>
<tr><td>Loan Origination</td><td>0.5-1.5% of loan</td><td>Lender's processing fee; sometimes negotiable</td></tr>
<tr><td>Home Appraisal</td><td>$300-$600</td><td>Required to confirm current home value</td></tr>
<tr><td>Title Search</td><td>$200-$400</td><td>Verifies clear title and no liens</td></tr>
<tr><td>Title Insurance</td><td>$500-$2,000</td><td>Protects lender against title issues</td></tr>
<tr><td>Recording Fee</td><td>$50-$250</td><td>County charge for deed paperwork</td></tr>
<tr><td>Application Fee</td><td>$250-$500</td><td>Non-refundable processing charge</td></tr>
<tr><td>Document Preparation</td><td>$200-$500</td><td>Legal paperwork and disclosures</td></tr>
<tr><td>Inspection/Survey</td><td>$300-$600</td><td>Property condition and boundary verification</td></tr></table>
<p>Some lenders offer "no-closing-cost" refinances where costs are either rolled into the loan balance or offset by a slightly higher interest rate. This can make sense if you plan to sell within 5-7 years.</p>

<h3>Removing PMI Through Refinancing</h3>
<p>If your home has appreciated or you've paid down your balance enough to reach 20% equity, refinancing can eliminate PMI/MIP entirely:</p>
<ul>
<li><strong>Conventional PMI:</strong> Automatically drops at 78% LTV, but refinancing can remove it at 80% LTV sooner</li>
<li><strong>FHA MIP:</strong> Required for the life of the loan (for loans with less than 10% down). The ONLY way to remove it is refinancing to a conventional loan</li>
<li><strong>Savings:</strong> PMI typically costs 0.3-1.5% of loan annually. On a $250K loan, that's $62-$312/month</li>
</ul>

<h3>Common Refinancing Mistakes</h3>
<ol>
<li><strong>Ignoring the break-even point</strong> — Refinancing costs money upfront. If you move before break-even, you lose</li>
<li><strong>Extending the term</strong> — A new 30-year mortgage resets your clock. Refinance to your remaining term length instead</li>
<li><strong>Focusing only on rate</strong> — A 0.5% lower rate with $10,000 in fees may not save as much as a 0.375% drop with $3,000 in fees</li>
<li><strong>Cash-out for depreciating assets</strong> — Using home equity for vacations or cars turns short-term spending into 30-year debt</li>
<li><strong>Not shopping multiple lenders</strong> — Rates and fees vary significantly. Get quotes from at least 3-4 lenders within a 14-day window (counts as one credit inquiry)</li>
</ol>
`,
    },
    "rent-affordability-calculator": {
        subtitle: "Find out how much rent you can afford based on your income, debts, and the 30% rule. See a full monthly budget breakdown with DTI analysis.",
        explanation: {
            heading: "How Much Rent Can I Afford?",
            paragraphs: [
                "The most widely used guideline for rent affordability is the 30% rule: your monthly rent should not exceed 30% of your gross monthly income. On a $55,000 salary, that means a maximum rent of $1,375/month. This standard was established by the U.S. Department of Housing and Urban Development (HUD) and remains the benchmark used by landlords, property managers, and financial advisors nationwide.",
                "However, the 30% rule is just a starting point. Your actual affordable rent depends on your total financial picture — including existing debts, utilities, transportation, and savings goals. A more comprehensive approach uses debt-to-income (DTI) ratios: your total monthly debts (including rent) should ideally stay below 36% of gross income. If you have $400/month in car and student loan payments, that reduces the rent you can comfortably afford.",
                "Beyond the monthly payment, renting involves significant upfront and hidden costs. Security deposits typically equal 1-2 months' rent. Application fees range from $25-$75. Utilities (electricity, water, gas, internet) add $150-$300/month on average. Renter's insurance costs $15-$30/month. These costs should all factor into your affordability assessment — not just the rent itself.",
            ],
            highlight: "$55K salary → $4,583 gross/month → 30% rule = $1,375 max rent. After $400 debts and $200 utilities, you'd have ~$1,453 remaining each month for food, transportation, savings, and discretionary spending.",
        },
        faq: [
            { question: "What is the 30% rule for rent?", answer: "The 30% rule states that you should spend no more than 30% of your gross (before-tax) monthly income on rent. On a $50K salary, that's $1,250/month. On $75K, it's $1,875/month. This guideline was established by HUD and is used by most landlords to qualify tenants." },
            { question: "Should I use gross or net income for the 30% rule?", answer: "The traditional 30% rule uses gross income. However, many financial advisors recommend using 25-30% of net (after-tax) income for a more conservative and realistic budget. On a $55K salary with ~25% taxes, gross-based max is $1,375 while net-based max is ~$1,031 — a significant difference." },
            { question: "What costs beyond rent should I budget for?", answer: "Security deposit (1-2 months' rent), application fee ($25-$75), renter's insurance ($15-$30/mo), utilities — electricity ($70-$120), water ($30-$50), gas ($30-$50), internet ($50-$80) — plus moving costs ($300-$1,500). Many apartments also require first and last month's rent at signing." },
            { question: "How do landlords decide if I qualify?", answer: "Most landlords require: (1) Monthly income ≥ 3× monthly rent (the '3× rule'), (2) Credit score ≥ 620 (some require 700+), (3) No recent evictions, (4) Clean criminal background, (5) Positive rental history. Some landlords accept co-signers or larger security deposits for borderline applicants." },
            { question: "Is it better to rent or buy?", answer: "Use the '5% Rule': if annual rent is less than 5% of a comparable home's purchase price, renting is likely better. Also consider: do you plan to stay 5+ years? (buying favors long stays), do you have 20% down payment? (avoids PMI), is local appreciation strong? Renting offers flexibility; buying builds equity but has hidden costs (maintenance, taxes, insurance)." },
            { question: "How can I reduce my rent costs?", answer: "Top strategies: (1) Get a roommate — shared 2BR is ~30% cheaper than a studio, (2) Negotiate with your landlord — especially at lease renewal, (3) Move slightly farther from downtown, (4) Rent during off-peak months (Nov-Feb in most markets), (5) Offer to sign a longer lease for a discount, (6) Look for units with included utilities." },
        ],
        steps: [
            { label: "Calculate gross monthly income", formula: "$55,000 ÷ 12", result: "$4,583/month gross" },
            { label: "Apply the 30% rule", formula: "$4,583 × 30%", result: "$1,375 max affordable rent" },
            { label: "Add all housing costs", formula: "$1,375 rent + $200 utilities", result: "$1,575 total housing cost" },
            { label: "Check total budget", formula: "$4,583 − $1,575 housing − $400 debts − $1,146 taxes", result: "$1,462 remaining for food, transport, savings" },
        ],
        comparison: [
            { title: "Conservative (25%)", value: "$1,146/mo", detail: "More savings buffer | Easier to build wealth" },
            { title: "Standard (30%)", value: "$1,375/mo", detail: "HUD recommended | Good balance", isWinner: true },
            { title: "Stretch (35%)", value: "$1,604/mo", detail: "Tighter budget | Higher-end options" },
        ],
        insight: { icon: "💡", title: "The 50/30/20 Budget Rule", text: "A popular alternative to the 30% rule is the 50/30/20 budget: 50% of after-tax income for needs (rent, utilities, food, insurance), 30% for wants (entertainment, dining out), 20% for savings and debt repayment. On $55K take-home of ~$41K, that's $1,712/month for ALL needs — rent should be well under this to leave room for groceries, insurance, and transportation." },
        contentHTML: `
<h3>What Is Rent?</h3>
<p>Rent is the periodic payment a tenant makes to a landlord for the use of a residential property. In the United States, rent is typically paid monthly and covers the right to occupy a house, apartment, condo, or room. A <strong>lease</strong> is the legal contract that formalizes the rental arrangement, defining the rent amount, payment schedule, lease duration, security deposit terms, and rules both parties agree to follow.</p>

<h3>The Renting Process in the U.S.</h3>
<p>Finding and securing a rental varies dramatically by market. In rural areas, it's often as simple as spotting a "For Rent" sign. In competitive urban markets like New York, San Francisco, or Seattle, the process is intense — listings disappear within hours, and applicants race to submit applications.</p>
<p>The typical process involves:</p>
<ol>
<li><strong>Search</strong> — Use listing sites (Zillow, Apartments.com, Craigslist), real estate agents, or local networks</li>
<li><strong>View the property</strong> — Inspect the unit, test appliances, check water pressure, look for damage</li>
<li><strong>Submit an application</strong> — Personal info, income verification (pay stubs, tax returns), employment history, references</li>
<li><strong>Background check</strong> — Landlords typically check credit score, criminal history, and eviction records (application fees of $25-$75 cover this)</li>
<li><strong>Sign the lease</strong> — Review all terms carefully, paying special attention to early termination clauses, pet policies, and renewal terms</li>
<li><strong>Pay move-in costs</strong> — First month's rent, security deposit (1-2 months), and sometimes last month's rent</li>
</ol>

<h3>Rent vs. Buy: When Does Each Make Sense?</h3>
<p>The decision to rent or buy depends on your financial situation, lifestyle, and local market conditions:</p>
<ul>
<li><strong>Rent when:</strong> You plan to stay less than 5 years, can't afford a 10-20% down payment, value flexibility and mobility, or the local market is overpriced relative to rents</li>
<li><strong>Buy when:</strong> You plan to stay 5+ years, have a stable employment situation, can afford a down payment and closing costs, and local home prices are reasonable compared to rents</li>
</ul>
<p>The <strong>5% Rule</strong> provides a quick comparison: if annual rent is less than 5% of a comparable home's purchase price, renting is likely the better financial choice. For example, if a home costs $300,000, the threshold is $15,000/year ($1,250/month). If you can rent a comparable place for $1,100/month, renting wins.</p>

<h3>Important Considerations When Renting</h3>
<p>Beyond the monthly rent amount, consider these factors:</p>
<ul>
<li><strong>Hidden costs:</strong> Security deposits, application fees, renter's insurance, pet deposits ($200-$500), parking fees, and utility setup charges</li>
<li><strong>Location:</strong> Proximity to work, school districts, public transportation, grocery stores, and safety/crime rates</li>
<li><strong>Quality:</strong> Building age, appliance condition, HVAC system, insulation quality, and available amenities (gym, pool, laundry)</li>
<li><strong>Size:</strong> Bedrooms, bathrooms, closet space, and storage. Measure your furniture before signing</li>
<li><strong>Landlord reputation:</strong> Online reviews, response time for maintenance requests, and history of rent increases</li>
</ul>

<h3>8 Ways to Reduce Your Rent Costs</h3>
<ol>
<li><strong>Get a roommate</strong> — Shared two-bedroom apartments are roughly 30% cheaper per person than one-bedrooms. Use friend networks or roommate-matching services</li>
<li><strong>Negotiate your lease</strong> — Ask for lower rent in exchange for a longer lease, upfront payment, or handling minor maintenance. The worst they can say is no</li>
<li><strong>Time your move</strong> — Rents are lowest during winter months (November-February) when demand drops. Avoid moving during peak summer months</li>
<li><strong>Look beyond downtown</strong> — Moving 10-15 minutes farther from the city center can save 20-30% on rent while still providing reasonable commute times</li>
<li><strong>Offer maintenance skills</strong> — Some landlords reduce rent for tenants who handle basic maintenance, yard work, or property management duties</li>
<li><strong>Consider unconventional options</strong> — Basement apartments, house-sitting, live-in aide positions, or co-living spaces can dramatically reduce costs</li>
<li><strong>Apply for housing assistance</strong> — HUD rental assistance and Section 8 vouchers subsidize rent for qualifying low-income households. Waiting lists can be long (2-5 years), but the savings are substantial — rent is capped at 30% of income</li>
<li><strong>Use rent-specific credit cards</strong> — Some credit cards offer 2-3% cashback on rent payments, effectively reducing your rent cost by hundreds per year</li>
</ol>

<h3>Practical Renting Tips</h3>
<ul>
<li><strong>Document everything</strong> — Take photos/video of the unit at move-in. Create a detailed condition report and have the landlord sign it. This protects your security deposit</li>
<li><strong>Get renter's insurance</strong> — For $15-$30/month, it protects your personal property against theft, fire, and water damage. Landlord insurance does NOT cover your belongings</li>
<li><strong>Read the full lease</strong> — Pay attention to early termination fees, rent increase caps, guest policies, and subletting rules</li>
<li><strong>Check cell reception</strong> before signing — poor signal is difficult to fix and affects daily life</li>
<li><strong>Call utility companies</strong> — They can provide average monthly bills for the specific unit, so you know true total costs before committing</li>
<li><strong>Keep the unit clean</strong> — Repairs beyond normal wear and tear will be charged against your security deposit at move-out</li>
<li><strong>Build a good relationship with your landlord</strong> — Timely payments and respectful property treatment often lead to smaller rent increases and faster maintenance response</li>
</ul>
`,
    },
    "debt-ratio-calculator": {
        subtitle: "Calculate your debt-to-income (DTI) ratio and see if you qualify for Conventional, FHA, or VA mortgages. Visualize front-end and back-end ratios with a detailed debt breakdown.",
        explanation: {
            heading: "What Is Debt-to-Income (DTI) Ratio?",
            paragraphs: [
                "Debt-to-income ratio (DTI) is the percentage of your gross monthly income that goes toward monthly debt payments. It's the single most important metric lenders use to determine how much you can borrow. If your gross monthly income is $7,083 and your total monthly debts are $2,350, your DTI is 33.2%. The lower your DTI, the better your financial health and borrowing capacity.",
                "There are two types of DTI. The front-end ratio (also called the mortgage-to-income ratio) only considers housing costs — mortgage or rent, property taxes, insurance, and HOA fees. The back-end ratio includes ALL recurring monthly debts: housing costs plus car loans, student loans, credit card minimums, child support, and any other debt obligations. Lenders primarily use the back-end ratio.",
                "DTI is different from the credit utilization ratio, which measures how much of your available credit you're using. Credit utilization (outstanding credit card balances ÷ total credit limit) directly impacts your credit score. DTI measures debt payments vs income and does NOT appear on your credit report — but both ratios matter for mortgage qualification.",
            ],
            highlight: "With $85K income ($7,083/mo gross): $1,500 housing + $850 other debts = $2,350 total. Front-end DTI: 21.2% (✅ under 28%). Back-end DTI: 33.2% (✅ under 36%). You'd qualify for Conventional, FHA, AND VA loans.",
        },
        faq: [
            { question: "What is a good DTI ratio?", answer: "≤ 20% = Excellent (strong borrowing power), 21-35% = Good (most lenders approve easily), 36-43% = Fair (may qualify for FHA but not conventional), 44-50% = Poor (limited options), > 50% = Critical (unlikely to get approved). For best mortgage rates, aim for under 36%." },
            { question: "What is front-end vs back-end DTI?", answer: "Front-end DTI = housing costs only ÷ gross income (includes mortgage/rent, taxes, insurance, HOA). Back-end DTI = ALL debts ÷ gross income (housing + car + student + credit cards + other). Conventional loans require ≤ 28% front-end AND ≤ 36% back-end." },
            { question: "What DTI do I need for a mortgage?", answer: "Conventional loans: ≤ 28% front-end, ≤ 36% back-end (the 28/36 rule). FHA loans: ≤ 31% front-end, ≤ 43% back-end. VA loans: ≤ 41% back-end (no strict front-end limit). Some lenders allow higher DTI with compensating factors like excellent credit or large savings." },
            { question: "What is credit utilization and how is it different from DTI?", answer: "Credit utilization = total credit card balances ÷ total credit limits. It impacts your credit SCORE (keep under 30%, ideally under 10%). DTI = total debt payments ÷ gross income. It impacts your borrowing CAPACITY. Both are important but measured differently: utilization is about outstanding balances; DTI is about monthly payment obligations." },
            { question: "How can I lower my DTI quickly?", answer: "Fastest methods: (1) Pay off credit cards entirely to eliminate minimum payments, (2) Refinance loans to lower monthly payments (extend term), (3) Avoid taking on new debt, (4) Increase income (overtime, side jobs, raises). Paying off a $300/month car loan instantly drops your DTI by ~4% on $85K income." },
            { question: "Does DTI affect my credit score?", answer: "No, DTI does not directly appear on your credit report or impact your credit score. However, high DTI often correlates with high credit utilization, which DOES hurt your score. Lenders check DTI separately during loan applications — it's a behind-the-scenes metric." },
        ],
        steps: [
            { label: "Calculate gross monthly income", formula: "$85,000 ÷ 12", result: "$7,083/month" },
            { label: "Calculate front-end DTI", formula: "$1,500 housing ÷ $7,083", result: "21.2% (≤ 28% ✅)" },
            { label: "Sum all monthly debts", formula: "$1,500 + $350 + $300 + $200", result: "$2,350 total monthly debt" },
            { label: "Calculate back-end DTI", formula: "$2,350 ÷ $7,083", result: "33.2% (≤ 36% ✅)" },
        ],
        comparison: [
            { title: "Conventional (28/36)", value: "Strictest", detail: "Front ≤ 28% | Back ≤ 36% | Best rates" },
            { title: "FHA (31/43)", value: "Moderate", detail: "Front ≤ 31% | Back ≤ 43% | Lower barrier", isWinner: false },
            { title: "VA (41)", value: "Most Flexible", detail: "No front limit | Back ≤ 41% | Veterans only", isWinner: true },
        ],
        insight: { icon: "📊", title: "DTI vs. Credit Utilization", text: "These are often confused but serve different purposes. DTI (monthly payments ÷ income) determines how much you can BORROW. Credit utilization (balances ÷ limits) determines your credit SCORE. You can have a low DTI but high utilization (e.g., high balances but low minimum payments) or vice versa. For mortgage approval, you need BOTH: DTI under 36-43% AND credit utilization under 30%." },
        contentHTML: `
<h3>Front-End Ratio: Housing Costs Only</h3>
<p>The front-end debt ratio measures how much of your gross monthly income goes to housing costs. This includes:</p>
<ul>
<li>Mortgage principal and interest (or rent payment)</li>
<li>Property taxes</li>
<li>Homeowner's insurance</li>
<li>HOA or condo fees</li>
<li>PMI (Private Mortgage Insurance) if applicable</li>
</ul>
<p><strong>Formula:</strong> Front-End DTI = (Total Monthly Housing Costs ÷ Gross Monthly Income) × 100</p>
<p>The standard maximum for conventional mortgage qualification is <strong>28%</strong>. On $7,083 monthly income, that means housing costs must stay below $1,983.</p>

<h3>Back-End Ratio: All Monthly Debts</h3>
<p>The back-end ratio is the comprehensive debt measurement. It includes everything in the front-end ratio plus ALL other recurring monthly debt obligations:</p>
<ul>
<li>Car loans and leases</li>
<li>Student loan payments</li>
<li>Credit card minimum payments</li>
<li>Personal loans</li>
<li>Child support and alimony</li>
<li>Any other documented recurring debt</li>
</ul>
<p><strong>Formula:</strong> Back-End DTI = (Total Monthly Debt Payments ÷ Gross Monthly Income) × 100</p>
<p>The conventional standard maximum is <strong>36%</strong>, though many lenders today accept 43-45% with compensating factors.</p>

<h3>Mortgage Qualification Thresholds</h3>
<p>Different loan programs have different DTI requirements:</p>
<table><tr><th>Loan Type</th><th>Front-End Max</th><th>Back-End Max</th><th>Notes</th></tr>
<tr><td>Conventional</td><td>28%</td><td>36%</td><td>Standard; some lenders allow 45-50%</td></tr>
<tr><td>FHA</td><td>31%</td><td>43%</td><td>Government-insured; more flexible</td></tr>
<tr><td>VA</td><td>No limit</td><td>41%</td><td>Veterans only; no front-end check</td></tr>
<tr><td>USDA</td><td>29%</td><td>41%</td><td>Rural areas; income limits apply</td></tr></table>
<p>Important: These are <em>guidelines</em>, not hard rules. Lenders may approve higher DTI with strong compensating factors such as excellent credit (740+), significant cash reserves (6+ months), or a large down payment (20%+).</p>

<h3>Credit Utilization Ratio</h3>
<p>Often discussed alongside DTI, the credit utilization ratio works differently. It measures your outstanding credit card balances as a percentage of your total credit limit:</p>
<p><strong>Formula:</strong> Credit Utilization = (Total Credit Card Balances ÷ Total Credit Limits) × 100</p>
<p>Unlike DTI, credit utilization <strong>directly impacts your credit score</strong> through credit bureaus. Keep utilization under 30% for a good score; under 10% for an excellent score. A person with $2,000 balance on $10,000 total limits has 20% utilization — healthy. The same person with $8,000 balance has 80% — which will significantly lower their credit score.</p>

<h3>DTI Health Benchmarks</h3>
<ul>
<li><strong>≤ 20% — Excellent:</strong> Strong financial health. Lenders will offer best terms and rates. Ample room for savings, investments, and emergencies.</li>
<li><strong>21-35% — Good:</strong> Manageable debt level. Most lenders approve easily. This is where the majority of financially healthy Americans fall.</li>
<li><strong>36-43% — Fair:</strong> Approaching conventional limits. May qualify for FHA but not conventional. Consider paying down debt before major loan applications.</li>
<li><strong>44-50% — Poor:</strong> Half or more of income goes to debt. Limited borrowing options and high financial stress. Debt consolidation may help.</li>
<li><strong>> 50% — Critical:</strong> Unsustainable. Seek credit counseling, explore debt management plans, or consider bankruptcy as a last resort.</li>
</ul>

<h3>5 Strategies to Lower Your DTI</h3>
<ol>
<li><strong>Pay off credit cards</strong> — Eliminating a $200/month minimum payment drops DTI by ~2.8% on $85K income. Target highest-rate cards first (avalanche method) or smallest balances (snowball method)</li>
<li><strong>Refinance existing loans</strong> — Extending a car loan from 3 to 5 years lowers the monthly payment (and therefore DTI) even though you'll pay more total interest</li>
<li><strong>Increase income</strong> — A $10,000 raise reduces DTI by approximately 3-4 percentage points on a $2,350/month debt load</li>
<li><strong>Avoid new debt</strong> — Each new loan application and balance increases your DTI. Freeze credit card spending and pay cash during the months before a mortgage application</li>
<li><strong>Consolidate debt</strong> — Combining multiple high-rate debts into a single lower-rate loan can reduce total monthly payments significantly</li>
</ol>

<h3>Beyond Mortgages: DTI in Personal Finance</h3>
<p>While DTI is primarily used for mortgage qualification, it's also a powerful personal finance tool. Track your DTI monthly to monitor financial health. If it's trending upward, you're taking on debt faster than income is growing — a warning sign. Many financial advisors recommend keeping total DTI under 33% (one-third of income) as a general rule, with housing under 25% for comfortable living.</p>
`,
    },
    "down-payment-calculator": {
        subtitle: "Calculate your down payment, closing costs, total upfront cash needed, and monthly payment with PMI analysis. Compare 5%, 10%, and 20% down payment scenarios side by side.",
        explanation: {
            heading: "How Much Down Payment Do I Need?",
            paragraphs: [
                "A down payment is the upfront cash you pay when purchasing a home. For a $350,000 home, a 20% down payment is $70,000 while an FHA-minimum of 3.5% is just $12,250. The down payment amount directly affects your loan size, monthly payment, interest rate, and whether you'll pay Private Mortgage Insurance (PMI). Conventional loans typically require 5-20% down, FHA requires 3.5%, and VA/USDA loans offer 0% down options.",
                "Beyond the down payment, you'll need cash for closing costs — typically 2-5% of the purchase price. For a $350,000 home, that's $7,000-$17,500 covering appraisal fees, title insurance, attorney fees, origination charges, and prepaid taxes/insurance. Total upfront cash needed = down payment + closing costs, so a 20% down purchase requires roughly 23% of the home price in cash.",
                "If your down payment is less than 20% on a conventional loan, you'll pay PMI — typically 0.3-1.5% of the loan amount annually. On a $332,500 loan (5% down on $350K), PMI costs roughly $83-$416/month. PMI is automatically removed when you reach 20% equity, which can take 5-10 years depending on appreciation and payments.",
            ],
            highlight: "$350K home with 20% down: $70,000 down + $10,500 closing (3%) = $80,500 upfront. Loan: $280,000. Monthly P&I at 6.5%: $1,770. No PMI needed. Compared to 5% down: only $17,500 down but $111/month extra in PMI.",
        },
        faq: [
            { question: "What is the minimum down payment for a house?", answer: "Conventional: 3-5% minimum (Fannie Mae/Freddie Mac programs). FHA: 3.5% with credit score ≥ 580, or 10% with score 500-579. VA: 0% for eligible veterans and active military. USDA: 0% for rural properties meeting income requirements. The 20% guideline is to avoid PMI, not a minimum requirement." },
            { question: "What is PMI and how much does it cost?", answer: "Private Mortgage Insurance protects the lender if you default. It's required when the down payment is less than 20% on conventional loans. PMI costs 0.3-1.5% of the loan annually ($83-$416/month on a $332K loan). It's automatically cancelled when you reach 20% equity (80% LTV) or you can request removal at 20%." },
            { question: "What are typical closing costs?", answer: "Closing costs are 2-5% of the home price and include: appraisal ($300-$600), home inspection ($300-$500), title search & insurance ($500-$2,000), attorney fees ($500-$1,500), loan origination (0.5-1% of loan), recording fees ($50-$250), and prepaid taxes & insurance (2-6 months). Some are negotiable." },
            { question: "Can I use gift money or my 401(k) for a down payment?", answer: "Yes to both. FHA loans allow 100% of the down payment as a gift from family with a gift letter. You can also borrow from your 401(k) — up to $50,000 or 50% of the balance, whichever is less. Roth IRA contributions can be withdrawn tax-free, and first-time buyers can withdraw up to $10,000 in earnings penalty-free." },
            { question: "Is it better to put 20% down or less?", answer: "20% avoids PMI (saving $100-$400/month), gets better rates, and means lower monthly payments. However, putting all your savings into a down payment leaves no emergency buffer. Many financial advisors recommend 10-15% down as a good compromise — lower PMI cost than 5% but more financial flexibility than 20%." },
            { question: "Are there down payment assistance programs?", answer: "Yes. Federal: FHA (3.5%), VA (0%), USDA (0%). State/local: Most states offer DPA grants or forgivable loans for first-time buyers — check HUD.gov. Employer programs, community land trusts, and nonprofit organizations like Habitat for Humanity also provide assistance. Many programs require homebuyer education courses." },
        ],
        steps: [
            { label: "Determine home price", formula: "$350,000 purchase price", result: "$350,000" },
            { label: "Calculate down payment", formula: "$350,000 × 20%", result: "$70,000 down payment" },
            { label: "Calculate closing costs", formula: "$350,000 × 3%", result: "$10,500 closing costs" },
            { label: "Total upfront cash needed", formula: "$70,000 + $10,500", result: "$80,500 total cash at closing" },
        ],
        comparison: [
            { title: "5% Down ($17,500)", value: "+PMI +Higher Payment", detail: "Upfront: $28K | Monthly: $2,215 (with PMI)" },
            { title: "10% Down ($35,000)", value: "+PMI +Moderate", detail: "Upfront: $45.5K | Monthly: $2,101 (with PMI)" },
            { title: "20% Down ($70,000)", value: "No PMI | Best Rate", detail: "Upfront: $80.5K | Monthly: $1,770", isWinner: true },
        ],
        insight: { icon: "💡", title: "The Opportunity Cost of 20% Down", text: "Putting 20% down on a $350K home means tying up $70,000 in home equity — money that could earn 7-10% annually in the stock market. A 5% down payment of $17,500 frees up $52,500 for investing. Even with PMI, the investment returns may exceed PMI costs. Run the numbers for your situation: if PMI is $111/month ($1,332/year) but investing $52K earns 8% ($4,200/year), keeping a smaller down payment could be financially smarter." },
        contentHTML: `
<h3>What Is a Down Payment?</h3>
<p>A down payment is the upfront portion of a home's purchase price that the buyer pays in cash. The remainder is financed through a mortgage loan. For example, on a $350,000 home with a 20% down payment ($70,000), the buyer borrows $280,000. The down payment amount signals financial stability to lenders and directly impacts the loan terms, interest rate, and monthly payment.</p>

<h3>Understanding Closing Costs</h3>
<p>Beyond the down payment, buyers face closing costs of 2-5% of the purchase price. These include:</p>
<ul>
<li><strong>Loan origination fee:</strong> 0.5-1% of the loan amount — the lender's processing charge</li>
<li><strong>Appraisal:</strong> $300-$600 — confirms the home's market value</li>
<li><strong>Home inspection:</strong> $300-$500 — identifies potential issues before purchase</li>
<li><strong>Title search & insurance:</strong> $500-$2,000 — verifies legal ownership and protects against title disputes</li>
<li><strong>Attorney/escrow fees:</strong> $500-$1,500 — handles legal paperwork and fund transfers</li>
<li><strong>Prepaid taxes & insurance:</strong> 2-6 months — held in escrow by the lender</li>
<li><strong>Recording fees:</strong> $50-$250 — county charge to record the new deed</li>
</ul>
<p>Some closing costs are negotiable. Sellers may agree to pay a portion (seller concessions), and some lenders offer "no-closing-cost" loans in exchange for a slightly higher interest rate.</p>

<h3>Down Payment Requirements by Loan Type</h3>
<table><tr><th>Loan Type</th><th>Min Down</th><th>PMI/MIP</th><th>Special Requirements</th></tr>
<tr><td>Conventional</td><td>3-5%</td><td>Yes, until 20% equity</td><td>Credit score 620+; Fannie Mae HomeReady allows 3%</td></tr>
<tr><td>FHA</td><td>3.5%</td><td>1.75% upfront MIP + 0.85%/yr</td><td>Credit score 580+; MIP for life of loan unless refinanced</td></tr>
<tr><td>VA</td><td>0%</td><td>No PMI; funding fee 1.25-3.3%</td><td>Veterans, active military, eligible spouses only</td></tr>
<tr><td>USDA</td><td>0%</td><td>1% upfront + 0.35%/yr</td><td>Rural areas; income must be ≤ 115% of area median</td></tr></table>

<h3>Large vs. Small Down Payment: Pros and Cons</h3>
<p><strong>Benefits of a larger down payment (15-20%+):</strong></p>
<ul>
<li>Eliminates PMI — saving $100-$400/month on typical loans</li>
<li>Lower monthly payments and less total interest paid</li>
<li>Better interest rates — lenders offer 0.125-0.25% lower rates for 20% down</li>
<li>Stronger offer in competitive markets — sellers prefer well-funded buyers</li>
<li>Immediate equity cushion protects against home value declines</li>
</ul>
<p><strong>Benefits of a smaller down payment (3-10%):</strong></p>
<ul>
<li>Enter homeownership sooner — don't wait years to save 20%</li>
<li>Preserve cash for emergencies, renovations, or investments</li>
<li>Home appreciation benefits you regardless of down payment size</li>
<li>Investment opportunity cost — uncommitted funds can earn returns elsewhere</li>
</ul>

<h3>5 Sources of Down Payment Funds</h3>
<ol>
<li><strong>Personal savings</strong> — The most common source. High-yield savings accounts and CDs provide safe growth. Automate monthly transfers to a dedicated "home fund" account. At $1,000/month, you'd save $36,000 in 3 years</li>
<li><strong>Piggyback loans (80-10-10)</strong> — Two mortgages: 80% first mortgage + 10% second mortgage (HELOC) + 10% down. Avoids PMI without 20% cash. The second loan typically has a higher rate but lower total cost than PMI</li>
<li><strong>Down payment assistance programs</strong> — Federal (FHA 3.5%, VA/USDA 0%), state housing finance agencies, and local government grants. Many provide forgivable loans that require no repayment if you stay in the home 5+ years. Check HUD.gov for programs in your area</li>
<li><strong>Gift funds</strong> — FHA allows 100% of the down payment as a gift from family. Conventional loans also accept gifts with a formal gift letter stating no repayment is required. The donor typically needs to provide bank statements proving the funds</li>
<li><strong>Retirement accounts</strong> — Roth IRA contributions (not earnings) can be withdrawn anytime without penalty. First-time buyers can withdraw up to $10,000 in earnings penalty-free. 401(k) loans allow borrowing up to $50,000 repaid over 5 years — but this reduces retirement savings growth</li>
</ol>
`,
    },
    "apr-calculator": {
        subtitle: "Calculate the true Annual Percentage Rate (APR) of any loan including all fees, points, and charges. Compare the real cost of loans from different lenders side by side.",
        explanation: {
            heading: "What Is APR and Why Does It Matter?",
            paragraphs: [
                "APR (Annual Percentage Rate) is the all-inclusive annual cost of a loan expressed as a percentage. Unlike the interest rate, which only reflects the cost of borrowing the principal, APR includes additional fees like origination charges, discount points, broker fees, and mortgage insurance. A loan advertised at 6.5% interest could have an APR of 6.8% or higher once fees are factored in.",
                "In the United States, the Truth in Lending Act (TILA) requires all lenders to disclose the APR so borrowers can compare the true cost of loans across different lenders on an apples-to-apples basis. Without APR disclosure, a lender could advertise a low rate while charging excessive fees, making the loan more expensive overall.",
                "The APR is calculated using a present value formula that accounts for when fees are paid (upfront vs financed) and how they compound. Fees rolled into the loan balance increase your monthly payment and accrue interest. Upfront fees reduce your net proceeds — the cash you actually receive. Both raise the effective cost above the stated interest rate.",
            ],
            highlight: "Example: $300,000 loan at 6.5% with $6,500 in fees. Stated rate: 6.5%. Real APR: 6.72%. Over 30 years, those fees add $9,400 to total cost beyond what the stated rate suggests.",
        },
        faq: [
            { question: "What is APR?", answer: "APR (Annual Percentage Rate) is the true annual cost of a loan including interest AND all mandatory fees expressed as a percentage. It's always equal to or higher than the stated interest rate. Lenders in the US must disclose APR under the Truth in Lending Act (TILA)." },
            { question: "What's the difference between APR and interest rate?", answer: "Interest rate is the cost of borrowing the principal only. APR includes interest rate PLUS fees (origination, points, broker, mortgage insurance). A 6.5% interest rate with 1% origination fee has an APR around 6.6-6.7%. Always compare APR, not just interest rates." },
            { question: "What's the difference between APR and APY?", answer: "APR = nominal annual rate (does not account for compounding). APY = effective annual rate (accounts for compounding). A 10% APR compounded monthly = 10.47% APY. Banks advertise APR for loans (looks lower) and APY for savings accounts (looks higher)." },
            { question: "Which fees are included in mortgage APR?", answer: "Included: origination fees, discount points, broker fees, mortgage insurance, application fee, processing fee, underwriting fee, certain closing costs. NOT included: appraisal fees, title insurance, survey fees, pre-paid items (taxes/insurance escrow), builder warranties, recording fees." },
            { question: "What is fixed APR vs variable APR?", answer: "Fixed APR stays constant for the loan's life — good for locking in low rates. Variable APR changes with a market index (like the Federal Funds Rate) plus a margin — starts lower but can rise. Variable APRs also include a credit-based margin determined by your creditworthiness." },
            { question: "How should I use APR to compare loans?", answer: "Compare APRs from at least 3-4 lenders for the same loan amount and term. Lower APR = lower total cost. But also consider: if you'll pay off early, focus on low upfront fees. If keeping the full term, APR is the best comparison metric." },
        ],
        steps: [
            { label: "Loan details", formula: "$300,000 at 6.5% for 30 years", result: "Monthly P&I: $1,896" },
            { label: "Add all fees", formula: "$1,500 compounded + $2,000 financed + $3,000 upfront", result: "$6,500 total fees" },
            { label: "Calculate effective loan", formula: "$300,000 + $1,500 + $2,000 = $303,500", result: "New monthly: $1,918" },
            { label: "Solve for real APR", formula: "Newton-Raphson: PV($1,918, r, 360) = $297,000", result: "Real APR: 6.72%" },
        ],
        comparison: [
            { title: "Lender A: Low APR", value: "6.60% APR", detail: "$4,000 fees | $686K total cost", isWinner: true },
            { title: "Lender B: Low Fees", value: "6.75% APR", detail: "$2,000 fees | $694K total cost" },
            { title: "Lender C: Balance", value: "6.68% APR", detail: "$3,000 fees | $690K total cost" },
        ],
        insight: { icon: "\u26a0\ufe0f", title: "APR Limitation: Early Payoff", text: "APR assumes you keep the loan for its full term. If you pay off a 30-year mortgage in 7 years (average in the US), upfront fees have a much larger impact than APR suggests. A loan with 6.5% APR and $8,000 in fees is MORE expensive over 7 years than a loan with 6.75% APR and $2,000 in fees — even though the first has a lower APR." },
        contentHTML: `
<h3>What Is APR?</h3>
<p>The Annual Percentage Rate (APR) represents the true annual cost of borrowing money. It combines the interest rate with mandatory fees and charges, expressing the total cost as a single annualized percentage. This standardized metric exists because of the Truth in Lending Act (TILA), which requires US lenders to disclose APR so consumers can make informed comparisons between loan offers.</p>
<p>Without APR, a lender could advertise a 5.5% interest rate while charging $15,000 in fees, making it more expensive than a competitor's 6.0% rate with $2,000 in fees. APR levels the playing field by folding all costs into one number.</p>

<h3>Fees Included vs Excluded in Mortgage APR</h3>
<p><strong>Fees typically INCLUDED in APR:</strong></p>
<ul>
<li>Loan origination fee (0.5-1% of loan amount)</li>
<li>Discount points (each point = 1% of loan, buys down rate by ~0.25%)</li>
<li>Mortgage broker fees</li>
<li>Private Mortgage Insurance (PMI) premiums</li>
<li>Application and processing fees</li>
<li>Underwriting fees</li>
<li>Certain closing costs</li>
</ul>
<p><strong>Fees typically NOT included in APR:</strong></p>
<ul>
<li>Appraisal fees ($300-$600)</li>
<li>Title search and title insurance</li>
<li>Survey fees</li>
<li>Pre-paid items (taxes, insurance escrow)</li>
<li>Builder warranties</li>
<li>Home inspection fees</li>
<li>Recording fees</li>
</ul>

<h3>APR vs Interest Rate vs APY</h3>
<table><tr><th>Term</th><th>What It Measures</th><th>Includes Fees?</th><th>Includes Compounding?</th></tr>
<tr><td>Interest Rate</td><td>Cost of borrowing principal only</td><td>No</td><td>No</td></tr>
<tr><td>APR</td><td>Annual cost including fees</td><td>Yes</td><td>No (simple)</td></tr>
<tr><td>APY/EAR</td><td>Effective annual rate with compounding</td><td>Varies</td><td>Yes</td></tr></table>
<p><strong>Conversion formula:</strong> APY = (1 + APR/n)<sup>n</sup> \u2212 1, where n = number of compounding periods per year. Example: 10% APR compounded monthly = (1 + 0.10/12)<sup>12</sup> \u2212 1 = 10.47% APY.</p>

<h3>5 Types of APR</h3>
<ol>
<li><strong>Fixed APR</strong> \u2014 Rate stays constant for the loan\u2019s duration. Offers predictability and protection from rate increases</li>
<li><strong>Variable APR</strong> \u2014 Fluctuates with a market index (Prime Rate, Federal Funds Rate) plus a lender margin. Starts lower but creates payment uncertainty</li>
<li><strong>Introductory (Promotional) APR</strong> \u2014 Temporarily reduced rate (often 0%) on credit cards for 12-21 months. Reverts to standard APR after the promotional period</li>
<li><strong>Penalty APR</strong> \u2014 Higher rate triggered by missed payments, typically 25-29.99%. Can apply to existing balances on credit cards</li>
<li><strong>Cash Advance APR</strong> \u2014 Rate for credit card cash withdrawals, usually 3-5% higher than purchase APR with no grace period</li>
</ol>

<h3>Limitations of APR</h3>
<ul>
<li><strong>Assumes full-term payoff</strong> \u2014 APR spreads upfront fees over the entire loan term. If you pay off early, those fees have a much larger effective impact</li>
<li><strong>Doesn\u2019t capture all costs</strong> \u2014 Appraisal, title insurance, inspection, and escrow fees are excluded from mortgage APR</li>
<li><strong>Variable rate uncertainty</strong> \u2014 For variable APR loans, the disclosed APR is based on current index rates and may change significantly</li>
<li><strong>Different calculation methods</strong> \u2014 Slight differences in how lenders include or exclude certain fees can make comparisons imperfect</li>
</ul>
`,
    },
    "home-equity-loan-calculator": {
        subtitle: "Calculate home equity loan payments, total costs, and maximum borrowing power based on your home value, mortgage balance, and LTV ratio.",
        explanation: {
            heading: "What Is a Home Equity Loan?",
            paragraphs: [
                "A home equity loan (also called a second mortgage) lets you borrow a lump sum using your home as collateral. You receive the full amount upfront and repay it over a fixed term with fixed monthly payments at a fixed interest rate. Because your home secures the loan, interest rates are typically lower than credit cards (15-25%) or personal loans (10-15%), making it an efficient way to access large sums.",
                "Lenders limit how much you can borrow based on your Loan-to-Value (LTV) ratio. Most lenders set the maximum combined LTV at 80%, meaning your existing mortgage plus the home equity loan cannot exceed 80% of your home's appraised value. Some lenders allow up to 85-90% LTV for borrowers with excellent credit (750+).",
                "Home equity loans are best for one-time, large expenses where you know the exact amount needed — major home renovations, debt consolidation, medical bills, or education costs. For ongoing or uncertain expenses, a HELOC (Home Equity Line of Credit) offers more flexibility.",
            ],
            highlight: "Example: Home worth $500,000 with $250,000 mortgage balance. At 80% LTV: ($500,000 × 80%) − $250,000 = $150,000 maximum home equity loan. At 8.5% for 15 years, monthly payment would be $1,477.",
        },
        faq: [
            { question: "How much can I borrow with a home equity loan?", answer: "Most lenders let you borrow up to 80% of your home's value minus your existing mortgage balance. Example: $400,000 home with $200,000 mortgage → max loan = ($400,000 × 80%) − $200,000 = $120,000. Some lenders allow up to 85-90% LTV with excellent credit." },
            { question: "What is the difference between a home equity loan and a HELOC?", answer: "Home equity loan = lump sum, fixed rate, fixed payments. HELOC = revolving credit line, variable rate, draw as needed during a 5-10 year draw period. HEL is better for one-time expenses; HELOC is better for ongoing costs like home remodeling over time." },
            { question: "Are home equity loan interest payments tax deductible?", answer: "Under the Tax Cuts and Jobs Act (2017), home equity loan interest is only deductible if the loan is used to buy, build, or substantially improve the home that secures the loan. Interest on HEL used for debt consolidation, education, or other purposes is NOT deductible." },
            { question: "What credit score do I need for a home equity loan?", answer: "Most lenders require a minimum credit score of 620-680. For the best rates (under 8%), you typically need 740+. Below 620 may not qualify. Lenders also check DTI ratio (ideally under 43%) and require adequate home equity (at least 15-20%)." },
            { question: "What are the closing costs on a home equity loan?", answer: "Closing costs typically range from 2-5% of the loan amount and may include: appraisal fee ($300-$600), origination fee (0.5-1%), title search ($100-$250), recording fees, and attorney fees. Some lenders offer no-closing-cost loans in exchange for a higher interest rate." },
            { question: "Can I lose my home with a home equity loan?", answer: "Yes. A home equity loan uses your home as collateral. If you fail to make payments, the lender can foreclose on your property. This is why financial advisors strongly warn against using home equity for non-essential expenses, vacations, or speculative investments." },
        ],
        steps: [
            { label: "Determine home equity", formula: "$500,000 (home value) − $250,000 (mortgage)", result: "Equity: $250,000 (50%)" },
            { label: "Calculate max borrowable", formula: "$500,000 × 80% LTV − $250,000 mortgage", result: "Max loan: $150,000" },
            { label: "Monthly payment", formula: "PMT(8.5%/12, 180 months, $100,000)", result: "$985/month" },
            { label: "Total cost", formula: "$985 × 180 + $3,000 closing costs", result: "$180,300 total" },
        ],
        comparison: [
            { title: "Home Equity Loan", value: "8.5% fixed", detail: "Lump sum | Fixed payment | 15-year term", isWinner: true },
            { title: "HELOC", value: "7.5% variable", detail: "Draw as needed | Rate can change | 10+20 yr" },
            { title: "Cash-Out Refinance", value: "6.8% fixed", detail: "Replaces mortgage | Closing costs 2-6%" },
        ],
        insight: { icon: "\u26a0\ufe0f", title: "Risk Warning: Your Home Is Collateral", text: "A home equity loan puts your homeownership at risk. If you can't make payments, the lender can foreclose. Never borrow against your home for non-essential expenses, speculative investments, or vacations. Only use home equity for value-building purposes like home improvements (which can increase property value), strategic debt consolidation (replacing 20%+ credit card rates), or essential large expenses." },
        contentHTML: `
<h3>How Home Equity Loans Work</h3>
<p>A home equity loan is a second mortgage that lets you borrow against the equity you've built in your home. Equity = Home Value − Mortgage Balance. If your home is worth $500,000 and you owe $250,000, you have $250,000 in equity (50%). Lenders typically let you borrow up to 80% of your home's value (combined with your existing mortgage), meaning you could access up to $150,000.</p>
<p>Unlike a HELOC (Home Equity Line of Credit), a home equity loan gives you the full amount as a lump sum with a fixed interest rate and fixed monthly payments for the life of the loan — typically 5 to 30 years.</p>

<h3>LTV Formula and Qualification</h3>
<p><strong>Max Loan = (Home Value × Max LTV%) − Existing Mortgage Balance</strong></p>
<table><tr><th>Requirement</th><th>Typical Range</th><th>Best Rate Threshold</th></tr>
<tr><td>Credit Score</td><td>620-680 minimum</td><td>740+ for best rates</td></tr>
<tr><td>Combined LTV</td><td>80% maximum</td><td>70% or less</td></tr>
<tr><td>Debt-to-Income (DTI)</td><td>43% maximum</td><td>36% or less</td></tr>
<tr><td>Home Equity</td><td>15-20% minimum</td><td>30%+ preferred</td></tr></table>

<h3>Costs of a Home Equity Loan</h3>
<p><strong>Upfront/Closing Costs (2-5% of loan):</strong></p>
<ul>
<li>Appraisal fee: $300-$600</li>
<li>Origination fee: 0.5-1% of loan amount</li>
<li>Title search and insurance: $100-$400</li>
<li>Recording fees: $25-$250</li>
<li>Attorney/notary fees: varies by state</li>
</ul>
<p><strong>Ongoing costs:</strong> Fixed monthly payments (principal + interest). At the beginning of the loan, most of each payment goes to interest. Over time, the principal portion increases — standard amortization.</p>

<h3>5 Common Uses of Home Equity Loans</h3>
<ol>
<li><strong>Major home improvements</strong> — Kitchen remodel ($25K-$75K), roof replacement ($8K-$15K), additions. May increase home value and qualify for tax-deductible interest</li>
<li><strong>Debt consolidation</strong> — Replace 15-25% credit card rates with 8-10% HEL rate. Can save thousands in interest. But converts unsecured debt to secured (home at risk)</li>
<li><strong>Education costs</strong> — College tuition when federal student loans are insufficient. Compare HEL rates vs private student loan rates</li>
<li><strong>Medical expenses</strong> — Large medical bills, elective procedures not covered by insurance</li>
<li><strong>Emergency large expenses</strong> — Major car repair, unexpected home damage not covered by insurance</li>
</ol>

<h3>Home Equity Loan vs HELOC vs Cash-Out Refinance</h3>
<table><tr><th></th><th>Home Equity Loan</th><th>HELOC</th><th>Cash-Out Refinance</th></tr>
<tr><td>Type</td><td>Installment (lump sum)</td><td>Revolving credit line</td><td>New primary mortgage</td></tr>
<tr><td>Rate</td><td>Fixed (8-10%)</td><td>Variable (7-9%)</td><td>Fixed or variable (6-8%)</td></tr>
<tr><td>Payment</td><td>Fixed monthly</td><td>Interest-only during draw</td><td>Fixed monthly</td></tr>
<tr><td>Closing Costs</td><td>2-5%</td><td>0-2%</td><td>2-6%</td></tr>
<tr><td>Tax Deductible</td><td>If for home improvement</td><td>If for home improvement</td><td>All mortgage interest (up to $750K)</td></tr>
<tr><td>Risk</td><td>Second lien on home</td><td>Second lien on home</td><td>Replaces existing mortgage</td></tr>
<tr><td>Best for</td><td>One-time large known expense</td><td>Ongoing/uncertain costs</td><td>Lower rate + need cash</td></tr></table>

<h3>Tax Deductibility Rules (Post-2017)</h3>
<p>Under the Tax Cuts and Jobs Act, home equity loan interest is only deductible when the loan proceeds are used to <strong>buy, build, or substantially improve</strong> the home securing the loan. The combined mortgage + HEL balance must not exceed $750,000 ($375,000 if married filing separately). Interest on home equity loans used for debt consolidation, education, medical bills, or other purposes is <strong>not tax deductible</strong>.</p>
`,
    },
    "heloc-calculator": {
        subtitle: "Calculate HELOC payments across draw and repayment periods, estimate your maximum credit line, and compare costs with home equity loans and cash-out refinancing.",
        explanation: {
            heading: "What Is a HELOC (Home Equity Line of Credit)?",
            paragraphs: [
                "A HELOC is a revolving line of credit secured by your home, similar to a credit card but with much lower interest rates. Unlike a home equity loan that gives you a lump sum, a HELOC lets you draw funds as needed up to your credit limit during a draw period (typically 5-10 years). You only pay interest on the amount you've actually borrowed, not the full credit line.",
                "HELOCs have two distinct phases: the draw period (5-10 years) where you make interest-only payments and can borrow/repay/reborrow, and the repayment period (10-20 years) where you can no longer borrow and must pay both principal and interest. This structure makes HELOCs ideal for ongoing expenses like home renovations over time or college tuition payments.",
                "The biggest risk with HELOCs is the variable interest rate. Your rate is tied to an index (usually the Prime Rate) plus a margin. If the Prime Rate rises from 5.5% to 8%, your HELOC rate rises the same amount. Additionally, the payment shock when transitioning from interest-only (draw period) to P&I payments (repayment period) can be significant.",
            ],
            highlight: "Example: $100,000 HELOC at 8.25%. During draw period: $687/mo (interest-only). When repayment starts at 9% for 20 years: $900/mo (P&I). That's a 31% payment increase — plan for it.",
        },
        faq: [
            { question: "How does a HELOC work?", answer: "A HELOC has two phases: (1) Draw period (5-10 years) — borrow up to your limit as needed, make interest-only payments, can repay and reborrow. (2) Repayment period (10-20 years) — no more borrowing, pay principal + interest monthly until balance is zero. Total term is typically 20-30 years." },
            { question: "What's the difference between a HELOC and home equity loan?", answer: "HELOC = revolving credit line, variable rate, draw as needed, interest-only during draw period. Home equity loan = lump sum, fixed rate, fixed P&I payments from day one. HELOC is better for ongoing/uncertain costs; HEL is better for one-time known expenses." },
            { question: "What is HELOC payment shock?", answer: "Payment shock occurs when the draw period ends and repayment begins. During draw period, you pay interest-only (e.g., $687/mo on $100K at 8.25%). At repayment, you pay P&I (e.g., $900/mo at 9% for 20 years) — a potential 30%+ increase. If rates also rose during the draw period, the shock can be even larger." },
            { question: "Are HELOC interest payments tax deductible?", answer: "Under the Tax Cuts and Jobs Act (2017), HELOC interest is only tax deductible if funds are used to buy, build, or substantially improve the home securing the HELOC. Interest on HELOC funds used for debt consolidation, education, or other purposes is NOT deductible. Combined mortgage + HELOC balance must not exceed $750K." },
            { question: "What credit score do I need for a HELOC?", answer: "Most lenders require 620-680 minimum. For the best rates (under 7%), you need 740+. Lenders also check DTI (under 43%), home equity (at least 15-20%), and employment history. Some lenders cap HELOCs at $1 million." },
            { question: "Can I freeze or reduce my HELOC?", answer: "Lenders can freeze or reduce your HELOC credit line if your home value drops significantly, your financial situation changes, or you miss payments. During the 2008 crisis, many lenders froze HELOCs. This is a risk unique to HELOCs vs home equity loans." },
        ],
        steps: [
            { label: "Determine credit limit", formula: "$500,000 home × 85% LTV − $250,000 mortgage", result: "HELOC limit: $175,000" },
            { label: "Draw period payment", formula: "$100,000 drawn × (8.25% / 12)", result: "$687/mo (interest-only)" },
            { label: "Repayment period payment", formula: "PMT(9%/12, 240 months, $100,000)", result: "$900/mo (P&I)" },
            { label: "Total cost over 30 years", formula: "$687×120 + $900×240 + $1,500 closing + $50×30 annual", result: "$300,940 total" },
        ],
        comparison: [
            { title: "HELOC", value: "8.25% variable", detail: "Draw as needed | Interest-only initially | 10+20 yr", isWinner: true },
            { title: "Home Equity Loan", value: "8.5% fixed", detail: "Lump sum | Fixed P&I | 15 yr" },
            { title: "Cash-Out Refinance", value: "6.8% fixed", detail: "Replaces mortgage | Full closing costs" },
        ],
        insight: { icon: "\u26a0\ufe0f", title: "Payment Shock Warning", text: "The transition from interest-only payments (draw period) to full P&I payments (repayment period) can increase your monthly payment by 30-50% or more. If rates have also risen during the draw period, the shock is compounded. Always calculate your repayment period payment at a rate 2-3% higher than today's rate to stress-test affordability." },
        contentHTML: `
<h3>How a HELOC Works: Two Phases</h3>
<p>A HELOC operates in two distinct phases, each with different rules and payment structures:</p>
<table><tr><th></th><th>Draw Period</th><th>Repayment Period</th></tr>
<tr><td>Duration</td><td>5-10 years (typically 10)</td><td>10-20 years (typically 20)</td></tr>
<tr><td>Borrowing</td><td>Draw up to limit, repay, reborrow</td><td>No new draws allowed</td></tr>
<tr><td>Payment</td><td>Interest-only (minimum)</td><td>Principal + Interest</td></tr>
<tr><td>Rate</td><td>Variable (Prime + margin)</td><td>Variable (Prime + margin)</td></tr>
<tr><td>Balance</td><td>Can stay flat or grow</td><td>Must reach $0 by end</td></tr></table>

<h3>HELOC Interest Rate Structure</h3>
<p>HELOC rates are variable and typically calculated as: <strong>HELOC Rate = Prime Rate + Margin</strong>. The Prime Rate (currently ~8.5% as of 2024) is set by major banks and moves with the Federal Funds Rate. The margin (0.5-2%) is set by the lender based on your creditworthiness. If the Fed raises rates by 0.25%, your HELOC rate increases 0.25%.</p>
<p>Most HELOCs have rate caps: a <strong>lifetime cap</strong> (maximum rate ever, typically 18-21%), a <strong>periodic cap</strong> (max increase per period, typically 2% per year), and sometimes a <strong>floor</strong> (minimum rate, often the initial rate).</p>

<h3>Costs of a HELOC</h3>
<p><strong>Upfront costs (1-5% of credit limit):</strong></p>
<ul>
<li>Appraisal fee: $300-$600</li>
<li>Application fee: $0-$500</li>
<li>Title search: $100-$250</li>
<li>Origination fee: 0-1% (many lenders waive this)</li>
</ul>
<p><strong>Ongoing costs:</strong></p>
<ul>
<li>Annual fee: $25-$100/year (some lenders waive)</li>
<li>Transaction fees: $0-$25 per draw (rare)</li>
<li>Early termination fee: $300-$500 if closed within 2-3 years</li>
<li>Inactivity fee: some lenders charge if you don't use the line</li>
</ul>

<h3>HELOC vs Home Equity Loan vs Cash-Out Refinance</h3>
<table><tr><th></th><th>HELOC</th><th>Home Equity Loan</th><th>Cash-Out Refi</th></tr>
<tr><td>Disbursement</td><td>Draw as needed</td><td>One-time lump sum</td><td>One-time lump sum</td></tr>
<tr><td>Rate</td><td>Variable (7-9%)</td><td>Fixed (8-10%)</td><td>Fixed (6-8%)</td></tr>
<tr><td>Payment</td><td>Interest-only then P&I</td><td>Fixed P&I from start</td><td>Fixed P&I from start</td></tr>
<tr><td>Closing costs</td><td>0-2% (often waived)</td><td>2-5%</td><td>2-6%</td></tr>
<tr><td>Flexibility</td><td>High (draw/repay/redraw)</td><td>None (fixed amount)</td><td>None (fixed amount)</td></tr>
<tr><td>Risk</td><td>Variable rate + payment shock</td><td>Predictable payments</td><td>Replaces existing mortgage</td></tr>
<tr><td>Best for</td><td>Ongoing/uncertain expenses</td><td>One-time known expenses</td><td>Low rates + need cash</td></tr></table>

<h3>5 Smart Uses for a HELOC</h3>
<ol>
<li><strong>Phased home renovations</strong> \u2014 Draw funds as each phase of renovation starts, pay interest only on amount used</li>
<li><strong>Education costs</strong> \u2014 Draw tuition payments semester by semester instead of borrowing full amount upfront</li>
<li><strong>Emergency fund backup</strong> \u2014 Open a HELOC as standby credit (no cost if unused) for unexpected large expenses</li>
<li><strong>Bridge financing</strong> \u2014 Use HELOC to fund down payment on new home before selling current home</li>
<li><strong>Business startup costs</strong> \u2014 Draw operating capital as needed during early business phase (high risk \u2014 your home is collateral)</li>
</ol>
`,
    },
    "va-mortgage-calculator": {
        subtitle: "Calculate VA loan payments with automatic funding fee calculation, PITI breakdown, and side-by-side comparison with conventional and FHA mortgages.",
        explanation: {
            heading: "What Is a VA Loan?",
            paragraphs: [
                "A VA loan is a mortgage guaranteed by the U.S. Department of Veterans Affairs, available to veterans, active-duty service members, National Guard members, reservists, and eligible surviving spouses. The VA doesn't lend money directly \u2014 private lenders issue the loans, and the VA guarantees a portion, which reduces lender risk and enables better terms.",
                "The defining feature of VA loans is the 0% down payment requirement \u2014 one of only a few mortgage programs in the US that allows this. VA loans also have no private mortgage insurance (PMI), no prepayment penalties, and typically lower interest rates than conventional mortgages. Instead of PMI, borrowers pay a one-time VA funding fee (0-3.3% of the loan).",
                "To qualify, you need a Certificate of Eligibility (COE) proving your military service. The VA has no minimum credit score, but most lenders require 620+. VA loans can only be used for primary residences \u2014 not investment properties or vacation homes.",
            ],
            highlight: "Example: $350,000 home with 0% down at 6.25% for 30 years. VA funding fee (first use): 2.15% = $7,525. Total loan: $357,525. Monthly PITI: ~$2,594. Same home conventional (5% down): ~$2,612/mo including PMI.",
        },
        faq: [
            { question: "Who qualifies for a VA loan?", answer: "Veterans with honorable discharge (DD 214), active-duty service members (90+ days), National Guard/Reservists (6+ years or 90 days active duty during wartime), and surviving spouses of veterans who died in service or from service-connected disability. You need a Certificate of Eligibility (COE) from the VA." },
            { question: "What is the VA funding fee?", answer: "A one-time fee paid to the VA to support the program. First-time use: 2.15% with 0% down, 1.5% with 5%+ down, 1.25% with 10%+ down. Subsequent use: 3.3% with 0% down. The fee is waived for veterans with 10%+ service-connected disability, Purple Heart recipients, and surviving spouses." },
            { question: "Is there a VA loan limit?", answer: "For veterans with full entitlement, there is NO loan limit \u2014 the VA will guarantee any amount (but the lender may have their own limits). For veterans with partial entitlement (e.g., existing VA loan), county loan limits apply (conforming limit: $766,550 in 2024, higher in high-cost areas)." },
            { question: "Can I use a VA loan more than once?", answer: "Yes. VA loan benefits are reusable. You can have multiple VA loans simultaneously if you have remaining entitlement. When you sell a home and pay off the VA loan, your full entitlement is restored. The IRRRL (Interest Rate Reduction Refinance Loan) also lets you refinance an existing VA loan." },
            { question: "Do VA loans require PMI?", answer: "No. VA loans never require private mortgage insurance (PMI), regardless of down payment. This is one of the biggest financial advantages \u2014 conventional loans require PMI until you reach 20% equity, costing $100-$300+/month on a typical loan." },
            { question: "What are the downsides of VA loans?", answer: "VA funding fee (2.15-3.3% for 0% down), can only buy primary residence, not all sellers/lenders work with VA, more paperwork at closing, VA appraisal requirements are stricter (property must meet Minimum Property Requirements), and cannot be used for fixer-uppers or investment properties." },
        ],
        steps: [
            { label: "Home price & down payment", formula: "$350,000 home \u00d7 0% down", result: "Loan base: $350,000" },
            { label: "VA funding fee", formula: "$350,000 \u00d7 2.15% (first use, 0% down)", result: "Fee: $7,525" },
            { label: "Total loan amount", formula: "$350,000 + $7,525 (fee financed)", result: "$357,525" },
            { label: "Monthly PITI", formula: "P&I + tax/12 + insurance/12", result: "$2,594/month" },
        ],
        comparison: [
            { title: "VA Loan (0% down)", value: "$2,594/mo", detail: "No PMI | 2.15% funding fee | 0% down", isWinner: true },
            { title: "Conventional (5% down)", value: "$2,612/mo", detail: "PMI required | No funding fee | 5% down" },
            { title: "FHA (3.5% down)", value: "$2,580/mo", detail: "MIP for life | 1.75% upfront | 3.5% down" },
        ],
        insight: { icon: "\ud83c\udf96\ufe0f", title: "VA Funding Fee: The Key Decision Factor", text: "The VA funding fee is the main cost unique to VA loans. For first-time use with 0% down, it's 2.15% ($7,525 on $350K). But you save $150-$300/month by avoiding PMI. Break-even: ~25-50 months. For subsequent use with 0% down, the fee jumps to 3.3% ($11,550) \u2014 consider making 5%+ down to reduce it to 1.5%. Veterans with 10%+ disability pay $0 in funding fees." },
        contentHTML: `
<h3>VA Loan Eligibility</h3>
<p>VA loans are available to those who have served the United States military. Eligibility requires a Certificate of Eligibility (COE) from the VA, which verifies your military service status:</p>
<table><tr><th>Service Type</th><th>Minimum Service Required</th></tr>
<tr><td>Active duty</td><td>90 consecutive days during wartime, or 181 days during peacetime</td></tr>
<tr><td>Post-9/11 service</td><td>90 days active duty</td></tr>
<tr><td>National Guard/Reserves</td><td>6 years, or 90 days active duty during wartime</td></tr>
<tr><td>Surviving spouse</td><td>Spouse died in service or from service-connected disability</td></tr></table>
<p>Honorable discharge is required (DD 214 document). Dishonorable discharge disqualifies applicants.</p>

<h3>VA Funding Fee Structure</h3>
<table><tr><th>Down Payment</th><th>First Use</th><th>Subsequent Use</th></tr>
<tr><td>Less than 5%</td><td>2.15%</td><td>3.30%</td></tr>
<tr><td>5% to 9.99%</td><td>1.50%</td><td>1.50%</td></tr>
<tr><td>10% or more</td><td>1.25%</td><td>1.25%</td></tr></table>
<p><strong>Fee exemptions:</strong> Veterans with 10%+ service-connected disability, Purple Heart recipients (active duty), and surviving spouses of veterans who died from service-connected conditions.</p>
<p><strong>Other VA funding fee rates:</strong> IRRRL (Interest Rate Reduction Refinance): 0.50%. Loan assumptions: 0.50%. Manufactured home loans (not permanently affixed): 1.00%.</p>

<h3>VA Loan Pros and Cons</h3>
<p><strong>Pros:</strong></p>
<ul>
<li>0% down payment required \u2014 no savings needed for down payment</li>
<li>No PMI ever, regardless of down payment amount</li>
<li>Lower interest rates than conventional mortgages (typically 0.25-0.5% lower)</li>
<li>No prepayment penalties \u2014 pay off anytime without fees</li>
<li>Sellers can pay up to 4% of loan amount toward closing costs</li>
<li>VA appraisal protects buyers from overpaying</li>
<li>Benefits are reusable \u2014 can have multiple VA loans</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>VA funding fee (2.15-3.3% for 0% down) adds to loan cost</li>
<li>Primary residence only \u2014 no investment properties or vacation homes</li>
<li>Not all sellers/lenders work with VA loans</li>
<li>Stricter appraisal: property must meet VA Minimum Property Requirements (MPR)</li>
<li>Cannot use for fixer-uppers or homes needing significant repairs</li>
<li>More paperwork and potentially longer closing times</li>
</ul>

<h3>VA Loan vs Conventional vs FHA</h3>
<table><tr><th></th><th>VA Loan</th><th>Conventional</th><th>FHA</th></tr>
<tr><td>Down Payment</td><td>0%</td><td>5-20%</td><td>3.5%</td></tr>
<tr><td>PMI/MIP</td><td>None</td><td>Required until 20% equity</td><td>Required for life of loan</td></tr>
<tr><td>Funding/Guarantee Fee</td><td>0-3.3%</td><td>None</td><td>1.75% upfront + 0.85%/yr</td></tr>
<tr><td>Credit Score</td><td>No VA min (lenders: 620+)</td><td>620-680+</td><td>580+ (3.5% down)</td></tr>
<tr><td>Loan Limits</td><td>None (full entitlement)</td><td>$766,550 conforming</td><td>$498,257 \u2013 $1,149,825</td></tr>
<tr><td>Prepayment Penalty</td><td>None</td><td>Varies</td><td>None</td></tr>
<tr><td>Occupancy</td><td>Primary only</td><td>Any</td><td>Primary only</td></tr></table>
`,
    },
    "fha-loan-calculator": {
        subtitle: "Calculate FHA loan payments with automatic MIP (mortgage insurance premium) calculation, PITI breakdown, and side-by-side comparison with conventional and VA mortgages.",
        explanation: {
            heading: "What Is an FHA Loan?",
            paragraphs: [
                "An FHA loan is a mortgage insured by the Federal Housing Administration (FHA), a government agency established in 1934 after the Great Depression. The FHA doesn't lend money directly \u2014 it insures loans made by approved lenders, reducing their risk and enabling them to offer mortgages to borrowers who might not qualify for conventional loans.",
                "FHA loans are famous for their low down payment requirement (3.5% with a credit score of 580+, or 10% with 500-579). They also have more flexible debt-to-income (DTI) ratio requirements than conventional loans. The trade-off is mandatory mortgage insurance premiums (MIP): a 1.75% upfront fee plus annual MIP of 0.15-1.05% depending on loan term, LTV, and amount.",
                "The biggest drawback of FHA loans is that annual MIP is typically required for the entire life of the loan if you put less than 10% down. With 10%+ down, MIP is cancelled after 11 years. This makes FHA loans more expensive long-term than conventional loans, where PMI drops off at 20% equity.",
            ],
            highlight: "Example: $350,000 home with 3.5% down ($12,250). Loan: $337,750. Upfront MIP: $5,911 (financed). Annual MIP: 0.55% = $155/mo. Total monthly PITI+MIP: ~$2,631. Over 30 years, total MIP cost: ~$61,600.",
        },
        faq: [
            { question: "What credit score do I need for an FHA loan?", answer: "580+ for 3.5% down payment. 500-579 for 10% down payment. Below 500 does not qualify. These are FHA minimums \u2014 some lenders may require higher scores (620-640)." },
            { question: "How does FHA mortgage insurance (MIP) work?", answer: "Two parts: (1) Upfront MIP = 1.75% of loan amount, usually financed into the loan. (2) Annual MIP = 0.15-1.05% of loan balance per year, paid monthly. If down payment is less than 10%, MIP is required for the life of the loan. With 10%+ down, MIP drops after 11 years." },
            { question: "Can I remove FHA mortgage insurance?", answer: "Only if you put 10%+ down \u2014 then MIP is cancelled after 11 years. With less than 10% down, the only way to remove MIP is to refinance into a conventional loan once you have 20%+ equity. This is a common strategy for FHA borrowers." },
            { question: "What are FHA loan limits?", answer: "FHA loan limits vary by county. In 2024, the floor is $498,257 for low-cost areas and the ceiling is $1,149,825 for high-cost areas. Check HUD's website for your specific county limit." },
            { question: "What is an FHA 203(k) loan?", answer: "An FHA 203(k) loan lets you finance both the purchase and renovation of a home in one mortgage. Minimum $5,000 in improvements, must be completed within 6 months. There's also a Streamlined 203(k) for smaller projects under $35,000." },
            { question: "Is an FHA loan better than conventional?", answer: "FHA is better for: credit scores under 680, down payments under 10%, high DTI ratios. Conventional is better for: credit 700+, 20%+ down (no PMI), or if you plan to keep the loan long-term (FHA MIP for life vs PMI that drops at 20%). Compare total costs over your expected time in the home." },
        ],
        steps: [
            { label: "Home price & down payment", formula: "$350,000 \u00d7 3.5% = $12,250 down", result: "Loan: $337,750" },
            { label: "Upfront MIP (financed)", formula: "$337,750 \u00d7 1.75%", result: "$5,911 \u2192 Total loan: $343,661" },
            { label: "Annual MIP", formula: "$337,750 \u00d7 0.55% / 12", result: "$155/month" },
            { label: "Monthly PITI + MIP", formula: "P&I + tax + insurance + MIP", result: "$2,631/month" },
        ],
        comparison: [
            { title: "FHA (3.5% down)", value: "$2,631/mo", detail: "Low credit OK | MIP for life | 3.5% down", isWinner: true },
            { title: "Conventional (5% down)", value: "$2,595/mo", detail: "620+ credit | PMI drops at 20% | 5% down" },
            { title: "VA (0% down)", value: "$2,594/mo", detail: "Veterans only | No PMI | 0% down" },
        ],
        insight: { icon: "\ud83c\udfe6", title: "FHA MIP: The Hidden Long-Term Cost", text: "With less than 10% down, FHA annual MIP is required for the ENTIRE life of the loan. On a $337,750 loan at 0.55%, that's $155/month or $55,800 over 30 years \u2014 on top of the $5,911 upfront MIP. Strategy: use FHA to get into a home, then refinance to conventional once you have 20% equity to eliminate the ongoing insurance cost." },
        contentHTML: `
<h3>FHA Loan Basics</h3>
<p>FHA loans are government-insured mortgages designed to make homeownership accessible to borrowers with lower credit scores and smaller down payments. The FHA (Federal Housing Administration), part of HUD (Department of Housing and Urban Development), insures these loans \u2014 it doesn't lend money directly. This insurance protects lenders if borrowers default, enabling them to offer more favorable terms.</p>

<h3>FHA Mortgage Insurance Premiums (MIP)</h3>
<p>FHA loans require two types of mortgage insurance:</p>
<p><strong>1. Upfront MIP (UFMIP):</strong> 1.75% of the base loan amount, typically financed into the loan. This is the same for all FHA borrowers regardless of credit score or down payment.</p>
<p><strong>2. Annual MIP:</strong> Varies based on loan term, LTV ratio, and loan amount. Paid monthly as part of your mortgage payment.</p>
<h4>Annual MIP Rates \u2014 Loan Term > 15 Years</h4>
<table><tr><th>Base Loan Amount</th><th>LTV \u2264 90%</th><th>LTV 90.01-95%</th><th>LTV > 95%</th></tr>
<tr><td>\u2264 $726,200</td><td>0.50%</td><td>0.55%</td><td>0.55%</td></tr>
<tr><td>> $726,200</td><td>0.70%</td><td>0.75%</td><td>0.75%</td></tr></table>
<h4>Annual MIP Rates \u2014 Loan Term \u2264 15 Years</h4>
<table><tr><th>Base Loan Amount</th><th>LTV \u2264 78%</th><th>LTV 78.01-90%</th><th>LTV > 90%</th></tr>
<tr><td>\u2264 $726,200</td><td>0.15%</td><td>0.15%</td><td>0.40%</td></tr>
<tr><td>> $726,200</td><td>0.15%</td><td>0.40%</td><td>0.65%</td></tr></table>
<p><strong>MIP cancellation:</strong> If you put 10%+ down (LTV \u2264 90%), annual MIP is cancelled after 11 years. If you put less than 10% down, MIP is required for the <strong>entire life of the loan</strong>.</p>

<h3>FHA Loan Pros and Cons</h3>
<p><strong>Pros:</strong></p>
<ul>
<li>Low down payment: 3.5% with 580+ credit score</li>
<li>Low credit score acceptance: 500+ can qualify</li>
<li>No prepayment penalties</li>
<li>Flexible DTI ratios: up to 43% back-end (57% with compensating factors)</li>
<li>Seller can contribute up to 6% of price toward closing costs</li>
<li>Assumable loans \u2014 buyer can take over seller's FHA loan</li>
</ul>
<p><strong>Cons:</strong></p>
<ul>
<li>MIP for life of loan (if less than 10% down) \u2014 expensive long-term</li>
<li>Upfront MIP (1.75%) adds to loan balance</li>
<li>Lower loan limits than conventional ($498,257-$1,149,825)</li>
<li>Property must meet FHA minimum standards (health and safety)</li>
<li>FHA stigma \u2014 some sellers prefer conventional offers</li>
</ul>

<h3>FHA 203(k) Renovation Loans</h3>
<p>The FHA 203(k) program lets borrowers finance both a home purchase and renovation costs in one loan. Two types:</p>
<ul>
<li><strong>Standard 203(k):</strong> For major renovations ($5,000+ minimum, no maximum). Requires HUD-approved consultant. Improvements must be completed within 6 months.</li>
<li><strong>Streamlined 203(k):</strong> For minor repairs and improvements under $35,000. Simpler process, no consultant required.</li>
</ul>
<p>Both types carry the same MIP requirements as regular FHA loans.</p>
`,
    },
    "rental-property-calculator": {
        subtitle: "Analyze rental property investments with cash flow projections, NOI, cap rate, cash-on-cash return, and investment rule screening (1% rule, 50% rule, GRM).",
        explanation: {
            heading: "What Is Rental Property Investing?",
            paragraphs: [
                "Rental property investing involves purchasing real estate to generate income through tenant rent payments and long-term property appreciation. Unlike stocks or bonds, rental properties provide tangible assets with monthly cash flow, tax advantages, and the ability to use leverage (mortgages) to amplify returns.",
                "The key to profitable rental property investing is running the numbers before purchasing. You need to analyze: Net Operating Income (NOI = rental income minus operating expenses), Cap Rate (NOI / purchase price), Cash-on-Cash Return (annual cash flow / total cash invested), and monthly cash flow (NOI minus mortgage payments).",
                "Operating expenses typically run 40-50% of gross rental income (the 50% Rule). These include property taxes, insurance, maintenance (budget 10% of rent), property management (8-12% if hired), vacancy (5-10%), and other costs. The mortgage payment comes out of the remaining 50%.",
            ],
            highlight: "Example: $300,000 property with 20% down ($60,000). Rent $2,000/mo. Expenses ~$9,600/yr. NOI: $13,200/yr. Mortgage: $11,960/yr. Cash flow: $1,240/yr ($103/mo). Cap rate: 4.4%. Cash-on-cash: 2.1%.",
        },
        faq: [
            { question: "What is a good cap rate for rental property?", answer: "Generally, 5-10% is considered good. 4-5% is typical in expensive markets (NYC, SF). 8-12% is possible in lower-cost markets but may come with higher risk. Cap rate = NOI / Purchase Price. A higher cap rate means higher return but often higher risk." },
            { question: "What is the 1% rule in real estate?", answer: "Monthly rent should be at least 1% of the purchase price. Example: $300,000 property should rent for $3,000+/month. Properties meeting this rule are more likely to cash flow positively. In expensive markets, 0.5-0.8% is common. In affordable markets, 1-2% is achievable." },
            { question: "What is cash-on-cash return?", answer: "Annual pre-tax cash flow divided by total cash invested. Example: $1,240 annual cash flow / $60,000 down payment = 2.1%. Target 8%+ for a good investment. This metric shows the actual return on your out-of-pocket investment, accounting for leverage." },
            { question: "How much should I budget for maintenance?", answer: "Budget 1-2% of property value per year, or 10% of monthly rent. Older properties (50+ years) may need 15-20%. Common expenses: HVAC ($5K-$10K), roof ($8K-$15K), water heater ($1K-$2K), appliances ($500-$2K each). Having a reserve fund is critical." },
            { question: "Should I hire a property manager?", answer: "Property management typically costs 8-12% of monthly rent. Worth it if: you own 3+ properties, live far from the property, don't want tenant calls, or your time is worth more than the management fee. Self-managing saves $2,400-$3,600/year on a $2,000/month rental." },
            { question: "What are the tax benefits of rental property?", answer: "Key benefits: (1) Depreciation \u2014 deduct ~3.6% of building value annually for 27.5 years, even if the property appreciates. (2) Expense deductions \u2014 mortgage interest, repairs, insurance, taxes, management fees. (3) 1031 Exchange \u2014 defer capital gains by reinvesting proceeds into a like-kind property." },
        ],
        steps: [
            { label: "Calculate gross income", formula: "$2,000 rent \u00d7 12 months", result: "Gross: $24,000/yr" },
            { label: "Subtract vacancy & expenses", formula: "$24,000 \u2212 $1,200 vacancy \u2212 $9,600 expenses", result: "NOI: $13,200" },
            { label: "Subtract mortgage", formula: "$13,200 \u2212 $1,597/mo \u00d7 12", result: "Cash flow: -$5,964/yr" },
            { label: "Calculate returns", formula: "Cap rate = NOI/Price, CoC = CF/Cash invested", result: "Cap: 4.4%, CoC: varies" },
        ],
        comparison: [
            { title: "Rental Property", value: "4-10% cap rate", detail: "Active income | Leverage | Tax benefits", isWinner: true },
            { title: "REITs", value: "4-8% yield", detail: "Passive | Liquid | Diversified" },
            { title: "House Flipping", value: "10-20% per flip", detail: "Active | Short-term | Higher risk" },
        ],
        insight: { icon: "\ud83d\udcca", title: "The Numbers Don't Lie", text: "Most rental property failures come from not running the numbers properly before purchasing. Always stress-test: What if vacancy is 10% instead of 5%? What if a $10K repair hits in year 1? What if interest rates rise when you refinance? If the deal still works under pessimistic assumptions, it's likely a solid investment." },
        contentHTML: `
<h3>Key Rental Property Metrics</h3>
<table><tr><th>Metric</th><th>Formula</th><th>Good Target</th><th>What It Tells You</th></tr>
<tr><td>Cap Rate</td><td>NOI / Purchase Price</td><td>5-10%</td><td>Return before financing</td></tr>
<tr><td>Cash-on-Cash</td><td>Annual Cash Flow / Cash Invested</td><td>8%+</td><td>Return on your actual cash</td></tr>
<tr><td>NOI</td><td>Effective Income \u2212 Operating Expenses</td><td>Positive</td><td>Property profitability before mortgage</td></tr>
<tr><td>GRM</td><td>Price / Gross Annual Rent</td><td>\u2264 15x</td><td>Quick price-to-rent comparison</td></tr></table>

<h3>Quick Screening Rules</h3>
<ul>
<li><strong>1% Rule:</strong> Monthly rent \u2265 1% of purchase price. $300K property \u2192 needs \u2265 $3,000/month rent</li>
<li><strong>50% Rule:</strong> Operating expenses \u2248 50% of gross income. The other 50% covers mortgage + profit</li>
<li><strong>70% Rule (flipping):</strong> Purchase price \u2264 70% of After-Repair Value (ARV) minus repair costs</li>
<li><strong>2% Rule:</strong> More aggressive version of 1% rule. Harder to find but excellent cash flow</li>
</ul>

<h3>Operating Expense Breakdown</h3>
<p>Typical operating expenses for a rental property run 40-50% of gross rental income:</p>
<table><tr><th>Expense</th><th>Typical %</th><th>Example ($2K/mo rent)</th></tr>
<tr><td>Property Tax</td><td>Varies by location</td><td>$3,600/yr</td></tr>
<tr><td>Insurance</td><td>~5%</td><td>$1,200/yr</td></tr>
<tr><td>Maintenance/Repairs</td><td>10%</td><td>$2,400/yr</td></tr>
<tr><td>Property Management</td><td>8-12%</td><td>$2,400/yr</td></tr>
<tr><td>Vacancy</td><td>5-10%</td><td>$1,200/yr</td></tr>
<tr><td>HOA (if applicable)</td><td>Varies</td><td>$0-$500/mo</td></tr>
<tr><td><strong>Total</strong></td><td><strong>40-50%</strong></td><td><strong>$10,800+/yr</strong></td></tr></table>

<h3>Tax Benefits of Rental Property</h3>
<ul>
<li><strong>Depreciation:</strong> Deduct the building value (not land) over 27.5 years. On a $300K property with $240K building value, that's $8,727/year in paper losses \u2014 reducing taxable income even if the property appreciates</li>
<li><strong>Expense deductions:</strong> Mortgage interest, property taxes, insurance, repairs, management fees, travel to property, and professional services are all deductible</li>
<li><strong>1031 Exchange:</strong> Defer capital gains taxes by reinvesting sale proceeds into a like-kind property within 180 days</li>
<li><strong>Pass-through deduction:</strong> Rental income may qualify for the 20% Qualified Business Income (QBI) deduction</li>
</ul>

<h3>Other Real Estate Investment Options</h3>
<table><tr><th></th><th>Rental Property</th><th>REITs</th><th>House Flipping</th><th>Wholesaling</th></tr>
<tr><td>Capital Needed</td><td>High ($50K+)</td><td>Low ($100+)</td><td>Medium ($30K+)</td><td>Low ($0-$5K)</td></tr>
<tr><td>Time Commitment</td><td>Medium-High</td><td>None (passive)</td><td>High</td><td>High</td></tr>
<tr><td>Cash Flow</td><td>Monthly rent</td><td>Quarterly dividends</td><td>One-time profit</td><td>One-time fee</td></tr>
<tr><td>Appreciation</td><td>Yes</td><td>Yes (share price)</td><td>No (sold quickly)</td><td>No</td></tr>
<tr><td>Tax Benefits</td><td>Excellent</td><td>Good</td><td>Ordinary income</td><td>Ordinary income</td></tr>
<tr><td>Liquidity</td><td>Very low</td><td>High</td><td>Medium</td><td>High</td></tr></table>
`,
    },

    "apy-calculator": {
        subtitle: "Calculate the Annual Percentage Yield (APY) from any nominal interest rate and compounding frequency — compare savings accounts and CDs side by side.",
        contentHTML: `<h2>What Is APY (Annual Percentage Yield)?</h2><p>Annual Percentage Yield (APY) measures the <strong>real rate of return</strong> on a deposit or investment after accounting for the effect of <strong>compounding interest</strong>. Unlike the nominal interest rate (APR), APY includes how frequently interest is added to your balance throughout the year.</p><p>Banks, credit unions, and online savings platforms in the United States are <strong>required by the Truth in Savings Act (TISA)</strong> to disclose the APY on every deposit product, making it the most reliable number for comparing savings accounts, money market accounts, and certificates of deposit.</p><h3>APY vs. APR — What's the Difference?</h3><p>APR states the <em>flat</em> interest rate without compounding. APY converts that rate into the <em>effective</em> yearly return by factoring in how often interest compounds. The more frequently interest compounds, the higher the APY relative to the APR.</p><h3>How to Calculate APY</h3><p>The formula is: <strong>APY = (1 + r/n)<sup>n</sup> − 1</strong>, where <em>r</em> is the nominal rate and <em>n</em> is the number of compounding periods per year.</p><h3>Worked Example</h3><p>A savings account offers 5.00% APR compounded daily (n = 365):</p><ul><li>APY = (1 + 0.05/365)<sup>365</sup> − 1 = <strong>5.127%</strong></li><li>On $10,000, you earn $512.67 in one year instead of $500</li></ul><h3>Why APY Matters for Savers</h3><p>High-yield savings accounts in the US currently advertise APYs between <strong>4.00% and 5.25%</strong>. Even a 0.25% APY difference on $50,000 equals $125 more per year.</p>`,
        faq: [
            { question: "What is a good APY for a savings account in 2025?", answer: "Competitive high-yield savings accounts offer APYs between 4.00% and 5.25%. Traditional banks typically offer 0.01%–0.10%." },
            { question: "How does compounding frequency affect APY?", answer: "The more often interest compounds, the higher the APY. 5% APR compounded daily gives 5.127% APY, while monthly gives 5.116% APY." },
            { question: "Is APY the same as interest rate?", answer: "No. APR is nominal rate before compounding. APY is the effective annual rate after compounding. APY is always ≥ the stated rate." },
            { question: "Is APY guaranteed?", answer: "For CDs, APY is locked for the term. For savings accounts, APY is variable and the bank can change it at any time." },
        ],
    },
    "apr-to-apy-calculator": {
        subtitle: "Convert between APR and APY instantly. See how compounding frequency impacts the effective interest rate on loans and savings.",
        contentHTML: `<h2>APR vs APY — What's the Real Difference?</h2>
<p>APR (Annual Percentage Rate) and APY (Annual Percentage Yield) are two ways to express interest rates — but they tell very different stories. Understanding the difference can literally save you thousands of dollars when comparing loans and savings products.</p>

<p><strong>APR</strong> represents the nominal interest rate for a year without accounting for compounding within the year. <strong>APY</strong> includes the effect of compounding — how often interest is calculated and added to your balance. For borrowers, APR understates the true cost; APY shows the real cost.</p>

<h3>The Conversion Formula</h3>
<div class="explanation__highlight">
<strong>APY = (1 + APR/n)^n − 1</strong><br/><br/>
Where n = number of compounding periods per year<br/>
(Daily = 365, Monthly = 12, Quarterly = 4, Semi-annually = 2, Annually = 1)<br/><br/>
<strong>Example:</strong> 12% APR compounded monthly:<br/>
APY = (1 + 0.12/12)^12 − 1 = (1.01)^12 − 1 = 1.1268 − 1 = <strong>12.68% APY</strong>
</div>

<h3>APR vs APY Comparison Table</h3>
<table><thead><tr><th>APR</th><th>Compounding</th><th>APY</th><th>Difference</th></tr></thead><tbody>
<tr><td>5%</td><td>Monthly</td><td>5.116%</td><td>+0.116%</td></tr>
<tr><td>6%</td><td>Monthly</td><td>6.168%</td><td>+0.168%</td></tr>
<tr><td>8%</td><td>Monthly</td><td>8.300%</td><td>+0.300%</td></tr>
<tr><td>10%</td><td>Daily</td><td>10.516%</td><td>+0.516%</td></tr>
<tr><td>12%</td><td>Monthly</td><td>12.683%</td><td>+0.683%</td></tr>
<tr><td>18%</td><td>Monthly</td><td>19.562%</td><td>+1.562%</td></tr>
<tr><td>20%</td><td>Daily</td><td>22.134%</td><td>+2.134%</td></tr>
<tr><td>25%</td><td>Daily</td><td>28.400%</td><td>+3.400%</td></tr>
</tbody></table>

<h3>Which to Use When?</h3>
<ul>
<li><strong>Shopping for a loan?</strong> Compare using APY — it shows the true cost. A credit card advertising "15% APR (monthly compounding)" actually costs you 16.08% APY</li>
<li><strong>Shopping for savings?</strong> Banks advertise APY (the higher number). Compare savings accounts and CDs using APY for apples-to-apples comparison</li>
<li><strong>Mortgages:</strong> The federally mandated APR for mortgages includes fees — making it higher than the note rate. The effective monthly rate (APY equivalent) further adjusts for compounding</li>
</ul>

<h3>Credit Card APR — The Real Story</h3>
<p>Credit cards typically compound daily. A card stated as 20% APR compounds daily at 20%/365 = 0.0548%/day. The true annual cost:</p>
<div class="explanation__highlight">APY = (1 + 0.20/365)^365 − 1 = <strong>22.13%</strong><br/>On a $5,000 balance carried for a full year: interest cost = $1,107 (not $1,000 as APR implies)</div>

<h3>References</h3>
<ul>
<li>Federal Reserve — Truth in Lending Act (TILA) / Regulation Z</li>
<li>Federal Truth in Savings Act (TISA) — requires banks to disclose APY</li>
<li>Consumer Financial Protection Bureau (CFPB) — consumerfinance.gov</li>
</ul>`,
        faq: [
            { question: "Why is APY always higher than APR?", answer: "APY accounts for compounding — earning interest on interest. With annual compounding, APR equals APY." },
            { question: "When should I use APR vs. APY?", answer: "Use APR for loans (mortgages, car loans). Use APY for savings products (savings accounts, CDs)." },
            { question: "Does the formula change for continuous compounding?", answer: "Yes. For continuous compounding, APY = e^APR − 1, giving the maximum possible APY for any APR." },
        ],
    },
    "simple-interest-calculator": {
        subtitle: "Calculate simple interest using I = P × r × t. Find interest earned or owed on loans, bonds, and short-term investments without compounding.",
        contentHTML: `<h2>What Is Simple Interest?</h2><p>Simple interest is charged only on the <strong>original principal</strong>. Formula: <strong>I = P × r × t</strong>.</p><h3>Where Simple Interest Is Used</h3><ul><li><strong>Auto loans</strong> — many US car loans use simple interest</li><li><strong>US Treasury bonds</strong> — T-bills use a form of simple interest</li><li><strong>Student loans</strong> — interest accrues simply during deferment</li></ul><h3>Worked Example</h3><p>$5,000 at 6% for 2.5 years:</p><ul><li>I = $5,000 × 0.06 × 2.5 = <strong>$750</strong></li><li>Total returned: <strong>$5,750</strong></li></ul><h3>Simple vs. Compound Interest</h3><p>$10,000 at 5% for 10 years: simple earns $5,000; monthly compound earns $6,470 — a <strong>$1,470 difference</strong>.</p>`,
        faq: [
            { question: "What is the simple interest formula?", answer: "I = P × r × t. Rate is a decimal (5% = 0.05), time is in years." },
            { question: "Do banks use simple or compound interest?", answer: "Most US savings accounts and CDs use compound. Simple interest is common in auto loans and Treasury bonds." },
            { question: "Is simple interest better for borrowers?", answer: "Yes — you pay less total interest than with compound interest on the same loan." },
        ],
    },
    "compound-interest-calculator": {
        subtitle: "See the power of compound interest with contributions and multiple compounding frequencies. Plan for retirement, college savings, or any goal.",
        contentHTML: `<h2>What Is Compound Interest?</h2><p>Compound interest is <strong>interest on principal plus accumulated interest</strong>. It creates exponential growth.</p><h3>Formula</h3><p><strong>A = P(1 + r/n)<sup>nt</sup></strong></p><h3>Compounding Frequency Matters</h3><table><tr><th>Frequency</th><th>$10,000 at 7% for 20yr</th></tr><tr><td>Annually</td><td>$38,697</td></tr><tr><td>Monthly</td><td>$39,827</td></tr><tr><td>Daily</td><td>$40,252</td></tr></table><h3>Worked Example</h3><p>$10,000 at 7% monthly + $200/mo for 20 years = <strong>$144,806</strong></p><h3>Start Early</h3><p>Investing at 25 vs. 35 can result in <strong>twice the balance</strong> at 65.</p>`,
        faq: [
            { question: "What is the Rule of 72?", answer: "Years to Double ≈ 72 / Rate. At 8%, money doubles in ~9 years." },
            { question: "How much does $10,000 grow in 30 years at 7%?", answer: "Compounded annually: $76,123. Monthly: $81,165. With $200/mo: $323,183." },
            { question: "Can compound interest work against me?", answer: "Yes — credit card debt at 22% APR with minimum payments takes 24 years and costs $8,609 in interest on $5,000." },
        ],
    },
    "daily-compound-interest-calculator": {
        subtitle: "Calculate daily compound interest on savings accounts, money market funds, and high-yield accounts. See how daily compounding accelerates growth.",
        contentHTML: `<h2>What is Daily Compound Interest?</h2>
<p>Daily compound interest is interest calculated and added to your balance <strong>every single day</strong> — 365 times per year. Each day, you earn interest not just on your original principal, but on all the interest previously earned. Over time, this compounding effect creates exponential growth that far exceeds simple interest or even monthly compounding.</p>

<h3>The Daily Compound Interest Formula</h3>
<div class="explanation__highlight">
<strong>A = P × (1 + r/365)^(365 × t)</strong><br/><br/>
A = Final amount | P = Principal | r = Annual interest rate (decimal) | t = Time in years<br/><br/>
<strong>Example:</strong> $10,000 at 5% annual rate, compounded daily, for 10 years:<br/>
A = $10,000 × (1 + 0.05/365)^3,650 = $10,000 × 1.6487 = <strong>$16,487</strong><br/>
Interest earned: $6,487 (vs $5,000 with simple interest — 30% more)
</div>

<h3>Daily vs Monthly vs Annual Compounding</h3>
<table><thead><tr><th>Compounding Frequency</th><th>$10,000 at 5% after 10 years</th><th>Effective APY</th></tr></thead><tbody>
<tr><td>Annual</td><td>$16,288.95</td><td>5.000%</td></tr>
<tr><td>Quarterly</td><td>$16,436.19</td><td>5.095%</td></tr>
<tr><td>Monthly</td><td>$16,470.09</td><td>5.116%</td></tr>
<tr><td><strong>Daily</strong></td><td><strong>$16,487.21</strong></td><td><strong>5.127%</strong></td></tr>
<tr><td>Continuous</td><td>$16,487.21</td><td>5.127%</td></tr>
</tbody></table>
<p>The difference between daily and monthly compounding is small for savings accounts, but on large balances or long time horizons, even basis-point differences become meaningful.</p>

<h3>Where Daily Compounding Matters Most</h3>
<ul>
<li><strong>Credit cards:</strong> Most US credit cards compound daily. A 20% APR card has an effective APY of 22.13% — costing you significantly more than the headline rate suggests</li>
<li><strong>High-yield savings accounts and CDs:</strong> Most premium savings accounts and online banks use daily compounding, giving you a slight edge over traditional monthly-compounding accounts</li>
<li><strong>Money market accounts:</strong> Typically compound daily, making it important to compare APY (which accounts for compounding) rather than APR</li>
<li><strong>Margin and brokerage loans:</strong> Typically compound daily — can erode returns significantly if positions are held long-term</li>
</ul>

<h3>The Rule of 72 — Quick Doubling Time Estimate</h3>
<p>Divide 72 by your interest rate to estimate how many years it takes to double your money:</p>
<ul>
<li>5% rate → 72/5 = <strong>~14.4 years</strong> to double</li>
<li>7% rate → 72/7 = <strong>~10.3 years</strong></li>
<li>10% rate → 72/10 = <strong>~7.2 years</strong></li>
<li>12% rate → 72/12 = <strong>~6 years</strong></li>
</ul>

<h3>References</h3>
<ul>
<li>Federal Reserve — Truth in Lending Act: compounding disclosure requirements</li>
<li>Federal Truth in Savings Act — APY calculation mandate (12 CFR Part 1030)</li>
</ul>`,
        faq: [
            { question: "Do high-yield savings accounts compound daily?", answer: "Most online HYSAs compound daily and credit monthly. Marcus, Ally, and Discover all use daily compounding." },
            { question: "Is daily compounding really better?", answer: "Yes, but marginally. On $10,000 at 5%, daily earns ~$5.50 more/year than monthly." },
            { question: "Does my credit card compound daily?", answer: "Yes — DPR = APR/365. This is why CC debt grows so quickly." },
        ],
    },
    "interest-calculator": {
        subtitle: "Calculate interest earned or paid on any amount — supports both simple and compound interest with flexible compounding options.",
        contentHTML: `<h2>Simple Interest vs Compound Interest — Choosing the Right Formula</h2>
<p>Interest calculations are at the heart of every loan, savings account, and investment decision. The two fundamental methods — <strong>simple interest</strong> and <strong>compound interest</strong> — produce dramatically different outcomes over time. Understanding which applies to your situation determines how you calculate costs and returns accurately.</p>

<h3>Simple Interest Formula</h3>
<div class="explanation__highlight">
<strong>I = P × r × t</strong>&nbsp;&nbsp; (Interest = Principal × Rate × Time)<br/>
<strong>A = P + I = P × (1 + r × t)</strong><br/><br/>
<strong>Example:</strong> $5,000 at 6% per year for 3 years:<br/>
I = $5,000 × 0.06 × 3 = <strong>$900</strong><br/>
Total amount = $5,000 + $900 = <strong>$5,900</strong>
</div>

<h3>Compound Interest Formula</h3>
<div class="explanation__highlight">
<strong>A = P × (1 + r/n)^(n×t)</strong><br/><br/>
A = Amount | P = Principal | r = Annual rate | n = Compounding periods/year | t = Years<br/><br/>
<strong>Example:</strong> $5,000 at 6% compounded monthly for 3 years:<br/>
A = $5,000 × (1 + 0.06/12)^36 = $5,000 × 1.19668 = <strong>$5,983</strong><br/>
Interest = $5,983 − $5,000 = <strong>$983</strong> (vs $900 simple — 9.2% more)
</div>

<h3>Where Each Method Applies in Real Life</h3>
<table><thead><tr><th>Financial Product</th><th>Interest Method</th><th>Notes</th></tr></thead><tbody>
<tr><td>Personal loans (India)</td><td>Reducing balance (compound)</td><td>EMI structure</td></tr>
<tr><td>Fixed deposits</td><td>Compound (quarterly)</td><td>TDS deducted on interest at source</td></tr>
<tr><td>Savings accounts</td><td>Compound (quarterly or monthly)</td><td>Interest credited to account</td></tr>
<tr><td>Microfinance loans</td><td>Often flat (simple)</td><td>Watch for flat vs reducing rate difference</td></tr>
<tr><td>US mortgages</td><td>Monthly compound (amortized)</td><td>30-day interest accrual cycle</td></tr>
<tr><td>US savings/CDs</td><td>Daily compound</td><td>APY standardizes comparisons</td></tr>
<tr><td>Government bonds (US)</td><td>Semi-annual simple</td><td>Coupon paid every 6 months</td></tr>
</tbody></table>

<h3>The Flat Rate vs Reducing Balance Trap</h3>
<p>Many lenders in India (especially for vehicle and consumer durables loans) quote a <strong>flat rate</strong> that looks low but is actually very expensive:</p>
<div class="explanation__highlight">
<strong>Flat rate:</strong> Interest calculated on the original principal for the entire tenure<br/>
<strong>Reducing balance:</strong> Interest calculated on outstanding amount each month (standard EMI)<br/><br/>
<strong>Flat 8% ≈ Reducing 14.5-15%</strong> — nearly double the effective cost!<br/><br/>
₹5L loan, 48 months:<br/>
Flat 8%: Total interest = ₹5L × 8% × 4 = ₹1,60,000<br/>
Reducing 8%: Total interest = ₹85,000 (nearly half)
</div>

<h3>Inflation-Adjusted Real Returns</h3>
<p>Nominal interest rate doesn't account for inflation. To find the <strong>real interest rate</strong> (purchasing power growth):</p>
<div class="explanation__highlight"><strong>Real Rate ≈ Nominal Rate − Inflation Rate</strong><br/>If your FD earns 6.8% and inflation is 5.1%, your real return is just <strong>1.7%</strong></div>

<h3>References</h3>
<ul>
<li>Reserve Bank of India — Master Direction on Interest Rate Policy</li>
<li>Securities and Exchange Board of India (SEBI) — Investment return disclosure standards</li>
<li>Federal Reserve — Consumer protection and disclosure rules</li>
</ul>`,
        faq: [
            { question: "How much interest will I earn on $10,000?", answer: "At 5% APY compounded monthly for 1 year: ~$512. At a traditional bank 0.05%: just $5." },
            { question: "Is interest taxable?", answer: "Yes — savings interest is taxed as ordinary income. Banks issue 1099-INT for interest exceeding $10/year." },
        ],
    },
    "interest-rate-calc": {
        subtitle: "Reverse-calculate the hidden interest rate from known principal, final amount, and time period.",
        contentHTML: `<h2>How to Calculate the Interest Rate on a Loan</h2>
<p>Sometimes you know your loan amount, monthly payment, and tenure — but need to find the <strong>effective annual interest rate</strong>. This reverse calculation is essential when evaluating loan offers, understanding true credit card costs, or auditing a lender's quoted rate. This calculator uses iterative numerical methods (binary search) to solve the interest rate equation accurately.</p>

<h3>The Mathematics of Rate Discovery</h3>
<p>The standard EMI formula is:</p>
<div class="explanation__highlight">
<strong>EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)</strong><br/><br/>
Where P = Principal, r = monthly rate, n = months<br/><br/>
Finding 'r' given EMI, P, and n has no closed-form algebraic solution — it requires iterative approximation (Newton-Raphson or binary search).
</div>

<h3>Step-by-Step: Finding the Rate</h3>
<p>Our calculator solves this iteratively with 100+ iterations for accuracy within ±0.001%. Here's the manual approach:</p>
<ol>
<li><strong>Start with a guess:</strong> Try r = EMI × n / P / n (flat rate approximation)</li>
<li><strong>Calculate EMI from your guess:</strong> Apply the EMI formula</li>
<li><strong>Compare to actual EMI:</strong> If calculated EMI &gt; actual, rate is too high; if lower, rate is too low</li>
<li><strong>Bisect and repeat:</strong> Narrow the range with each iteration until convergence</li>
</ol>

<h3>Flat Rate vs Reducing Balance — The Hidden Cost</h3>
<table><thead><tr><th>Quoted Rate</th><th>Type</th><th>Effective Reducing Rate</th><th>You Really Pay</th></tr></thead><tbody>
<tr><td>8% flat</td><td>Flat</td><td>~14.5%</td><td>81% more than stated</td></tr>
<tr><td>10% flat</td><td>Flat</td><td>~18.2%</td><td>82% more than stated</td></tr>
<tr><td>12% flat</td><td>Flat</td><td>~21.5%</td><td>79% more than stated</td></tr>
<tr><td>8% reducing</td><td>Reducing</td><td>8.00%</td><td>Accurate</td></tr>
</tbody></table>
<div class="explanation__highlight"><strong>Real example:</strong> Car dealer quotes "8% flat, 48 months" on ₹5L loan → EMI = ₹14,583.<br/>Plug this EMI into our rate calculator → Effective reducing rate = <strong>14.8%</strong>, not 8%.</div>

<h3>APR (Annual Percentage Rate) — The US Standard</h3>
<p>In the United States, the Truth in Lending Act (TILA) requires lenders to disclose the <strong>Annual Percentage Rate (APR)</strong> — which includes both the interest rate AND lender fees (origination fees, points, broker fees). This makes APR a better apples-to-apples comparison than the quoted note rate:</p>
<ul>
<li><strong>Mortgage note rate 6.5% + 1% origination fee → APR ≈ 6.75%</strong></li>
<li>When comparing mortgages: always compare APRs, not note rates</li>
<li>For short-term loans held less than the full term, the APR is less useful — calculate your total cost instead</li>
</ul>

<h3>Credit Card Effective Rate</h3>
<p>Credit card APR uses daily compounding, making the effective cost higher.</p>
<div class="explanation__highlight">Credit card at 20% APR (daily compounding):<br/>Daily rate = 20%/365 = 0.0548%<br/>Effective APY = (1 + 0.20/365)^365 − 1 = <strong>22.13%</strong><br/>On $5,000 balance for 1 year: True interest cost = $1,107 (not $1,000)</div>

<h3>References</h3>
<ul>
<li>Truth in Lending Act (TILA) — Regulation Z, 12 CFR Part 1026</li>
<li>Reserve Bank of India — Circular on Fair Practice Code for Lenders</li>
<li>Consumer Financial Protection Bureau (CFPB) — Rate comparison tools</li>
</ul>`,
        faq: [
            { question: "Why are simple and compound rates different?", answer: "Compound rate accounts for reinvested interest and is always lower because compounding accelerates growth." },
            { question: "Can I find my loan's real rate?", answer: "Yes — enter loan amount, total repaid, and time period to calculate the effective annual rate." },
        ],
    },
    "cd-calculator": {
        subtitle: "Calculate Certificate of Deposit earnings at maturity. Compare rates, terms, and compounding for FDIC-insured investments.",
        contentHTML: `<h2>What is a Certificate of Deposit (CD)?</h2>
<p>A Certificate of Deposit (CD) is a federally insured time-deposit savings product offered by banks and credit unions. You deposit a fixed amount for a <strong>specified term</strong> (3 months to 5 years), and the bank pays you a guaranteed fixed interest rate. At maturity, you receive your principal plus all earned interest. CDs are among the safest investments available — FDIC-insured up to $250,000 per depositor per bank.</p>

<h3>CD Interest Calculation</h3>
<p>Most CDs compound interest either daily or monthly. The final value is calculated using:</p>
<div class="explanation__highlight">
<strong>A = P × (1 + r/n)^(n×t)</strong><br/><br/>
A = Final amount | P = Principal | r = Annual rate | n = Compounding periods/year | t = Time in years<br/><br/>
<strong>Example:</strong> $10,000 at 4.8% APY, compounded daily, 12-month CD:<br/>
A = $10,000 × (1 + 0.048/365)^365 = $10,000 × 1.04918 = <strong>$10,491.80</strong>
</div>

<h3>Current CD Rate Comparison (2024)</h3>
<table><thead><tr><th>Term</th><th>National Average APY</th><th>Best Available APY</th></tr></thead><tbody>
<tr><td>3 months</td><td>1.60%</td><td>5.25% (online banks)</td></tr>
<tr><td>6 months</td><td>2.00%</td><td>5.35%</td></tr>
<tr><td>1 year</td><td>1.80%</td><td>5.15%</td></tr>
<tr><td>2 years</td><td>1.50%</td><td>4.70%</td></tr>
<tr><td>5 years</td><td>1.40%</td><td>4.30%</td></tr>
</tbody></table>
<p><em>National averages per FDIC. Best rates from top online banks and credit unions. Rates change frequently.</em></p>

<h3>CD Strategies to Maximize Returns</h3>
<p><strong>CD Ladder:</strong> Divide your investment across multiple CD terms to balance yield and liquidity. Example: $20,000 split into 1-year, 2-year, 3-year, 4-year, and 5-year CDs of $4,000 each. As each CD matures annually, reinvest at whatever rate is best at that time.</p>
<p><strong>CD Barbell:</strong> Split funds between short-term (3-6 month) and long-term (4-5 year) CDs. Short-term CDs provide flexibility; long-term CDs capture higher yields.</p>
<p><strong>No-Penalty CDs:</strong> Offer slightly lower rates (typically 0.3-0.5% less) but allow early withdrawal without penalty — useful when rates are expected to rise.</p>

<h3>Early Withdrawal Penalties</h3>
<p>Breaking a CD before maturity incurs penalties, typically expressed in months of interest:</p>
<ul>
<li><strong>3-month CD:</strong> ~30-60 days interest penalty</li>
<li><strong>1-year CD:</strong> ~90-150 days interest penalty</li>
<li><strong>3-5 year CD:</strong> ~150-365 days interest penalty</li>
</ul>
<p>Even with a penalty, withdrawing early from a CD can sometimes be worth it if you can reinvest at a significantly higher rate. Our calculator helps you compare the break-even.</p>

<h3>CDs vs High-Yield Savings vs Treasury Bills</h3>
<table><thead><tr><th>Feature</th><th>CD</th><th>High-Yield Savings</th><th>T-Bill (6-month)</th></tr></thead><tbody>
<tr><td>Rate (2024)</td><td>4.5–5.35%</td><td>4.5–5.1%</td><td>~5.2%</td></tr>
<tr><td>FDIC/NCUA insured</td><td>✅ Up to $250K</td><td>✅ Up to $250K</td><td>✅ US govt-backed</td></tr>
<tr><td>Liquidity</td><td>Locked in (penalty)</td><td>Anytime</td><td>At maturity (or sell)</td></tr>
<tr><td>State tax</td><td>Taxable</td><td>Taxable</td><td>State tax exempt</td></tr>
<tr><td>Rate changes</td><td>Fixed — locked in</td><td>Variable — can drop</td><td>Fixed until maturity</td></tr>
</tbody></table>

<h3>References</h3>
<ul>
<li>FDIC — Certificate of Deposit rules and insurance limits — fdic.gov</li>
<li>Federal Reserve Economic Data (FRED) — CD rate history</li>
<li>National Credit Union Administration (NCUA) — credit union CD insurance</li>
</ul>`,
        faq: [
            { question: "Are CDs safe?", answer: "Yes — FDIC insured up to $250,000 per depositor per bank." },
            { question: "What is a good CD rate in 2025?", answer: "Top rates: 4.25%–5.00% APY for 1-year terms. Online banks offer the highest." },
            { question: "Do I pay taxes on CD interest?", answer: "Yes — taxed as ordinary income in the year earned. Banks report via 1099-INT." },
            { question: "What is a CD ladder?", answer: "Split money across multiple CD terms. As each matures, reinvest for regular cash access with higher rates." },
        ],
    },
    "credit-card-interest-calculator": {
        subtitle: "Calculate how much interest you pay on credit card balances. See daily periodic rate, monthly charges, and the true cost of minimum payments.",
        contentHTML: `<h2>How Credit Card Interest Works</h2><p>Credit card interest uses the <strong>daily periodic rate (DPR)</strong> method. APR / 365 = DPR, applied to your average daily balance. Interest <strong>compounds daily</strong>.</p><h3>Example: 22% APR on $5,000</h3><p>DPR = 0.0603%. Daily interest: $3.01. With 2% minimum payments:</p><ul><li>Payoff time: <strong>24 years</strong></li><li>Total interest: <strong>$8,609</strong></li></ul><h3>Average US Credit Card APR (2025)</h3><p>Approximately <strong>20.7% to 24.6%</strong>. Rewards cards have higher rates.</p>`,
        faq: [
            { question: "How is credit card interest calculated?", answer: "Interest = Avg Daily Balance × DPR × Days. DPR = APR/365. Compounds daily." },
            { question: "Can I negotiate a lower APR?", answer: "Yes — issuers often reduce rates 1–5% for customers with good payment history." },
            { question: "What is a balance transfer?", answer: "Moves debt to a 0% intro APR card (12–21 months). Transfer fee: 3–5%." },
        ],
    },
    "credit-card-payoff-calculator": {
        subtitle: "Calculate how long to pay off credit card debt and the total interest cost. Find the optimal monthly payment to become debt-free faster.",
        contentHTML: `<h2>How to Pay Off Credit Card Debt Faster</h2><p>Pay <strong>more than the minimum</strong>. Small increases dramatically reduce payoff time.</p><h3>$5,000 at 22% APR — Payment Impact</h3><table><tr><th>Payment</th><th>Payoff Time</th><th>Total Interest</th></tr><tr><td>$100 (min)</td><td>9yr 3mo</td><td>$6,121</td></tr><tr><td>$200</td><td>2yr 8mo</td><td>$1,459</td></tr><tr><td>$350</td><td>1yr 4mo</td><td>$755</td></tr><tr><td>$500</td><td>11mo</td><td>$514</td></tr></table><h3>Strategies</h3><ul><li><strong>Avalanche</strong> — highest rate first (saves most)</li><li><strong>Snowball</strong> — smallest balance first (momentum)</li><li><strong>Balance Transfer</strong> — 0% intro APR card</li></ul>`,
        faq: [
            { question: "Fastest way to pay off CC debt?", answer: "Aggressive payments + balance transfer to 0% APR card. Avalanche method targets highest rate first." },
            { question: "Should I use savings to pay off CC debt?", answer: "Usually yes if savings earns 4–5% but card charges 22%. Keep $1,000 emergency fund, direct rest to debt." },
            { question: "Will paying off my card hurt my credit score?", answer: "No — it almost always improves your score by reducing credit utilization." },
        ],
    },
    "future-value-calculator": {
        subtitle: "Calculate the future value of investments with regular contributions and compound interest. Plan for retirement, college funds, or any goal.",
        contentHTML: `<h2>What Is Future Value?</h2><p>Future Value (FV) projects what your money will be worth at a specific future date.</p><h3>Formula</h3><p>Lump sum: <strong>FV = PV × (1 + r/n)<sup>nt</sup></strong></p><p>With contributions: add <strong>PMT × [(1 + r/n)<sup>nt</sup> − 1] / (r/n)</strong></p><h3>Retirement Planning</h3><p>$500/month at 7% from age 25:</p><ul><li>Age 45: <strong>$264,012</strong></li><li>Age 55: <strong>$610,453</strong></li><li>Age 65: <strong>$1,312,689</strong></li></ul>`,
        faq: [
            { question: "How much should I save for retirement?", answer: "10–15% of gross income. Fidelity: 1× salary by 30, 3× by 40, 6× by 50, 10× by 67." },
            { question: "What rate of return to assume?", answer: "Stocks: 7% after inflation (10% nominal, S&P 500 historical). Bonds: 3–5%. Blended: 6–8%." },
        ],
    },
    "present-value-calculator": {
        subtitle: "Calculate the present value of future cash flows. Discount future money to today's dollars using the time value of money.",
        contentHTML: `<h2>What Is Present Value?</h2><p>PV is the current worth of a future sum, discounted at a specific rate. <strong>A dollar today > a dollar tomorrow</strong> because today's can be invested.</p><h3>Formula</h3><p>Lump sum: <strong>PV = FV / (1 + r)<sup>n</sup></strong></p><h3>Applications</h3><ul><li>Lottery: lump sum vs. annual payments</li><li>Pension buyouts</li><li>Business valuation</li></ul><h3>Example</h3><p>$100,000 in 10 years at 7%: PV = <strong>$50,835</strong></p>`,
        faq: [
            { question: "Why is a dollar today worth more?", answer: "It can be invested. $1 at 7% = $1.07 in one year. This is the time value of money." },
            { question: "What discount rate to use?", answer: "Alternative investment return of similar risk. Low-risk: Treasury ~4.5%. Stocks: 7–10%." },
        ],
    },
    "rule-of-72-calculator": {
        subtitle: "Use the Rule of 72 to quickly estimate doubling time — or what rate you need to double in a specific timeframe.",
        contentHTML: `<h2>What Is the Rule of 72?</h2><p>Mental math shortcut: <strong>Years to Double ≈ 72 / Rate</strong>. Accurate for rates between 2% and 15%.</p><h3>Quick Reference</h3><table><tr><th>Rate</th><th>Rule of 72</th><th>Exact</th></tr><tr><td>3%</td><td>24.0yr</td><td>23.4yr</td></tr><tr><td>5%</td><td>14.4yr</td><td>14.2yr</td></tr><tr><td>7%</td><td>10.3yr</td><td>10.2yr</td></tr><tr><td>10%</td><td>7.2yr</td><td>7.3yr</td></tr><tr><td>12%</td><td>6.0yr</td><td>6.1yr</td></tr></table><h3>Reverse</h3><p>Double in 5 years? Rate ≈ 72/5 = <strong>14.4%</strong></p><h3>Practical</h3><ul><li>S&P 500 ~10%: doubles every <strong>7.2yr</strong></li><li>Inflation 3%: costs double every <strong>24yr</strong></li></ul>`,
        faq: [
            { question: "How accurate is the Rule of 72?", answer: "Very accurate for 2–15%. At 7%, estimates 10.3yr; exact is 10.24yr (<1% error)." },
            { question: "Can it be used for debt?", answer: "Yes — at 22% APR, debt doubles in 72/22 ≈ 3.3 years if unpaid." },
        ],
    },
    "student-loan-payoff-calculator": {
        subtitle: "Plan your student loan payoff with custom payments and extra contributions. Compare against the standard 10-year plan.",
        contentHTML: `<h2>Student Loan Debt in America</h2><p>Total US student debt: <strong>$1.77 trillion</strong> across 43 million borrowers. Average: <strong>$37,000</strong>.</p><h3>Federal Repayment Plans</h3><ul><li><strong>Standard</strong> — 10 years, fixed; lowest interest</li><li><strong>Graduated</strong> — starts low, increases every 2 years</li><li><strong>Income-Driven (IDR)</strong> — SAVE, REPAYE, PAYE, IBR</li><li><strong>Extended</strong> — up to 25 years</li></ul><h3>Extra Payment Impact</h3><p>$35,000 at 5.5% + $100/mo extra:</p><ul><li>Standard: 120mo, $5,123 interest</li><li>With extra: 83mo, $3,337 interest</li><li>Savings: <strong>$1,786 + 37 months earlier</strong></li></ul><h3>PSLF</h3><p>Federal forgiveness after 120 qualifying payments for public service workers.</p>`,
        faq: [
            { question: "Pay off loans or invest?", answer: "Compare loan rate to expected returns. Many split: 401(k) match first, then loans." },
            { question: "What is the SAVE plan?", answer: "Caps payments at 5–10% of discretionary income. Forgiveness after 20–25 years." },
            { question: "Can student loans be discharged in bankruptcy?", answer: "Difficult but possible via 'undue hardship' test. Recent policy has eased this somewhat." },
        ],
    },
    "mortgage-calculator": {
        subtitle: "Calculate your monthly PITI mortgage payment — principal, interest, property taxes, homeowner's insurance, and PMI. See a full 30-year amortization schedule and total loan cost.",
        explanation: {
            heading: "How Mortgage Payments Are Calculated — The PITI Formula",
            paragraphs: [
                "A mortgage payment consists of four components known as PITI: Principal, Interest, Taxes, and Insurance. The core calculation uses the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n − 1], where M is the monthly payment, P is the loan principal (home price minus down payment), r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments (loan term in years × 12). This formula ensures each payment reduces your loan balance while covering accrued interest — a process called amortization.",
                "Property taxes are typically collected by the lender monthly and held in an escrow account, then paid to local government annually. Property tax rates vary enormously by state: New Jersey averages 2.23% annually while Hawaii averages 0.32%. On a $400,000 home, that difference is $7,640/year — adding $637/month to your payment in New Jersey vs. $107/month in Hawaii. Homeowner's insurance averages $1,300–$2,400/year ($108–$200/month) but varies by location, home size, and coverage level.",
                "Private Mortgage Insurance (PMI) is required on conventional loans when your down payment is less than 20%. PMI costs 0.3%–1.5% of the loan amount annually, with the exact rate determined by your credit score, loan-to-value ratio, and lender policy. On a $350,000 loan, PMI of 0.8% adds $2,800/year ($233/month). PMI is automatically cancelled when your loan balance reaches 78% of the original home value, or you can request removal at 80% equity under the Homeowners Protection Act.",
            ],
            highlight: "$400,000 home, 20% down ($80,000), 6.5% rate, 30 years: Monthly P&I = $2,023. Add taxes (1.2%) = $400/mo + insurance = $150/mo. Total PITI = $2,573/month. Total cost over 30 years: $925,080 — you pay $525,080 in interest and overhead beyond the $400,000 home price.",
        },
        faq: [
            { question: "What is PITI in a mortgage payment?", answer: "PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a monthly mortgage payment. Principal reduces your loan balance. Interest is the lender's charge, calculated on the outstanding balance. Taxes are your property tax, collected monthly in escrow and paid annually. Insurance includes homeowner's insurance (mandatory) and PMI (required if down payment < 20%)." },
            { question: "How do I calculate my monthly mortgage payment?", answer: "Use the formula M = P × [r(1+r)^n] / [(1+r)^n − 1], where P = loan amount, r = monthly rate (annual rate ÷ 12), n = number of payments (years × 12). For a $320,000 loan at 6.5% for 30 years: r = 0.065/12 = 0.005417, n = 360, M = $2,023/month for P&I only (before taxes and insurance)." },
            { question: "What is a good interest rate for a 30-year mortgage in 2026?", answer: "As of 2026, 30-year fixed mortgage rates range from 6.0% to 7.5% for qualified borrowers with 20% down and a 740+ credit score. Rates below 6.5% are considered competitive in the current environment. Your rate depends on credit score, loan-to-value ratio, loan type, and market conditions at closing." },
            { question: "How much does PMI cost on a mortgage?", answer: "PMI costs 0.3%–1.5% of the loan amount annually. On a $300,000 mortgage, that's $900–$4,500/year ($75–$375/month). The exact rate depends on your credit score (higher score = lower PMI), down payment percentage, and lender. PMI is automatically cancelled when your balance reaches 78% of the original home value." },
            { question: "What is the difference between a 15-year and 30-year mortgage?", answer: "On a $300,000 loan at 6.5%: 30-year payment = $1,896/month with total interest = $382,633. 15-year payment = $2,613/month with total interest = $170,178 — saving $212,455 in interest. The 15-year has 38% higher monthly payments but saves 56% on total interest. The 30-year provides cash flow flexibility; the 15-year builds equity faster." },
            { question: "Should I pay points to lower my mortgage rate?", answer: "One point = 1% of the loan amount and typically reduces the rate by 0.25%. On a $300,000 loan, one point costs $3,000 and saves $50/month. Break-even = $3,000 ÷ $50 = 60 months (5 years). If you stay in the home longer than the break-even period, paying points makes financial sense." },
            { question: "How much house can I afford on my salary?", answer: "The 28/36 rule: housing costs (PITI) should not exceed 28% of gross monthly income, and total debts (housing + car + student loans + credit cards) should not exceed 36%. On $90,000/year ($7,500/month): max housing payment = $2,100. At 6.5% for 30 years, that supports approximately $330,000 in loan (or $413,000 home with 20% down)." },
            { question: "What is an ARM vs. a fixed-rate mortgage?", answer: "A fixed-rate mortgage keeps the same interest rate for the entire loan term. An adjustable-rate mortgage (ARM) has a fixed period (3, 5, 7, or 10 years) then adjusts annually based on a benchmark index (like SOFR) plus a margin. ARMs start with lower rates — a 5/1 ARM at 5.75% vs. 6.5% fixed saves $125/month initially, but adds risk of rate increases after year 5." },
            { question: "What credit score do I need to qualify for a mortgage?", answer: "Conventional loans require a minimum 620 credit score (but 740+ gets the best rates). FHA loans accept 580 with 3.5% down (or 500 with 10% down). VA loans have no official minimum but most lenders require 580–620. Each 20-point credit score improvement can reduce your rate by 0.1–0.2%, saving $15,000–$30,000 over 30 years on a $350,000 loan." },
            { question: "How does a down payment affect my mortgage payment?", answer: "A larger down payment reduces your loan amount, eliminates PMI (at 20%+), and may qualify you for a better rate. On a $400,000 home: 5% down ($20,000) → $380,000 loan + PMI ~$237/month. 20% down ($80,000) → $320,000 loan, no PMI. The difference in monthly payment: ~$600/month ($7,200/year). Over 30 years: $86,000+ savings from the larger down payment." },
            { question: "What are closing costs on a mortgage?", answer: "Closing costs are 2%–5% of the loan amount, paid at loan settlement. They include: origination fee (0.5–1%), appraisal ($300–$500), title insurance ($700–$1,500), attorney fees (if required by state), prepaid taxes and insurance, and recording fees. On a $350,000 loan: closing costs of 3% = $10,500. Many lenders offer 'no closing cost' mortgages that roll costs into the rate." },
            { question: "What happens if I miss a mortgage payment?", answer: "Most lenders have a 15-day grace period with no penalty. After 15 days, a late fee (typically 3–5% of the payment) is charged. After 30 days, the delinquency is reported to credit bureaus (significant score damage). After 90+ days of missed payments, lenders may begin foreclosure proceedings. During hardship, contact your lender immediately for forbearance or modification options." },
            { question: "Is it better to rent or buy a home in 2026?", answer: "The 5% Rule: if annual rent is less than 5% of the home price, renting may be more financially efficient. At $400,000 home value: 5% = $20,000/year ($1,667/month). If you can rent a comparable home for less than $1,667/month, renting may make sense. Additional factors: how long you plan to stay (breakeven typically 3–5 years), local market appreciation, and the opportunity cost of the down payment." },
            { question: "What is mortgage refinancing and when does it make sense?", answer: "Refinancing replaces your current mortgage with a new loan, typically to get a lower rate, change the term, or access equity (cash-out refinance). It makes sense when: (1) rates drop 0.75–1%+ below your current rate, (2) you plan to stay long enough to recoup closing costs (typically 24–36 months), or (3) you want to switch from ARM to fixed. Closing costs of 2–5% mean the monthly savings must be significant enough to break even." },
            { question: "How does property tax affect my mortgage payment?", answer: "Property taxes are collected by lenders monthly (1/12 of the annual tax bill) and held in escrow until the annual payment is due. Tax rates vary by state: NJ (2.23%) adds $556/month on a $300K home. TX (1.60%) adds $400/month. CA (0.75%) adds $188/month. FL (0.80%) adds $200/month. High property taxes significantly increase PITI beyond just principal and interest." },
        ],
        steps: [
            { label: "Determine loan amount", formula: "Home price $400,000 − Down payment $80,000 (20%)", result: "Loan amount: $320,000" },
            { label: "Calculate monthly P&I", formula: "M = $320,000 × [0.005417 × 1.005417^360] / [1.005417^360 − 1]", result: "Monthly P&I: $2,023" },
            { label: "Add escrow (taxes + insurance)", formula: "Property tax $400K × 1.2% ÷ 12 = $400 | Insurance = $150/mo", result: "Escrow: $550/month" },
            { label: "Total PITI payment", formula: "$2,023 + $550", result: "Monthly PITI: $2,573" },
        ],
        comparison: [
            { title: "30-Year Fixed", value: "$2,023/mo P&I", detail: "Total interest: $408,808 | Lower payment, maximum flexibility" },
            { title: "15-Year Fixed", value: "$2,789/mo P&I", detail: "Total interest: $182,020 | Saves $226,788 in interest!", isWinner: true },
        ],
        insight: { icon: "🏠", title: "The Real Cost of a Mortgage", text: "On a $400,000 home with 20% down at 6.5%, you borrow $320,000 but repay $728,808 over 30 years — paying $408,808 in interest alone. That's 128% of the original loan amount in interest. This is why making extra payments in the first 10 years is transformative: extra payments in Year 1 save 3–5× more interest than the same payments in Year 20, because they eliminate years of compounding interest." },
        contentHTML: `
<h3>The Amortization Formula — How Your Mortgage Balance Shrinks</h3>
<p>Mortgage amortization uses the formula <strong>M = P × [r(1+r)^n] / [(1+r)^n − 1]</strong> to calculate a fixed monthly payment that fully retires the loan over the term. Each payment is applied first to the accrued interest for the month, with the remainder reducing principal.</p>
<p>On a $320,000 loan at 6.5% for 30 years:</p>
<ul>
<li><strong>Month 1:</strong> $1,733 interest + $290 principal (86% interest)</li>
<li><strong>Month 60 (Year 5):</strong> $1,664 interest + $359 principal</li>
<li><strong>Month 180 (Year 15):</strong> $1,468 interest + $555 principal</li>
<li><strong>Month 300 (Year 25):</strong> $886 interest + $1,137 principal</li>
<li><strong>Month 360 (Final):</strong> $11 interest + $2,012 principal</li>
</ul>
<p>This front-loading is why early prepayments are so powerful — every extra dollar paid in the first 5 years eliminates 3–5× its value in future interest.</p>

<h3>PMI: What It Costs and When It Goes Away</h3>
<p>Private Mortgage Insurance protects the lender (not you) if you default with less than 20% equity. Key facts:</p>
<ul>
<li><strong>Cost:</strong> 0.3%–1.5% of original loan amount annually. At 0.8% on a $350,000 loan: $233/month.</li>
<li><strong>Credit score impact:</strong> 760+ score → 0.3% PMI. 680 score → 0.8% PMI. 620 score → 1.2% PMI.</li>
<li><strong>Automatic cancellation:</strong> At 78% LTV (per Homeowners Protection Act of 1998).</li>
<li><strong>Requested cancellation:</strong> At 80% LTV with a good payment history and property appraisal.</li>
<li><strong>FHA MIP:</strong> Different from PMI — required for the life of the loan if down payment < 10%.</li>
</ul>

<h3>Understanding Mortgage Rate Factors</h3>
<p>Your mortgage rate is determined by multiple factors layered on top of the base rate set by bond market conditions:</p>
<ul>
<li><strong>Credit score:</strong> 740+ = lowest rates. Each 20-point drop typically adds 0.1–0.25% to your rate.</li>
<li><strong>Loan-to-value (LTV):</strong> Higher LTV = higher rate. 95% LTV pays 0.25–0.5% more than 80% LTV.</li>
<li><strong>Loan type:</strong> Conventional, FHA, VA, and USDA each have different rate structures.</li>
<li><strong>Loan size:</strong> Conforming loans (≤$766,550) get better rates than jumbo loans.</li>
<li><strong>Loan term:</strong> 15-year rates are typically 0.5–0.75% lower than 30-year rates.</li>
<li><strong>Points:</strong> You can pay points upfront (1 point = 1% of loan) to permanently lower the rate.</li>
</ul>

<h3>30-Year vs. 15-Year Mortgage: A Complete Comparison</h3>
<table><thead><tr><th>Factor</th><th>30-Year Fixed</th><th>15-Year Fixed</th></tr></thead><tbody>
<tr><td>Interest rate (typical)</td><td>6.50%</td><td>5.75%</td></tr>
<tr><td>Monthly P&I ($320K loan)</td><td>$2,023</td><td>$2,659</td></tr>
<tr><td>Total interest paid</td><td>$408,808</td><td>$158,574</td></tr>
<tr><td>Interest savings</td><td>—</td><td>$250,234</td></tr>
<tr><td>Equity at year 5</td><td>$17,200</td><td>$59,000</td></tr>
<tr><td>Best for</td><td>Cash flow priority</td><td>Wealth building</td></tr>
</tbody></table>

<h3>How Extra Payments Accelerate Mortgage Payoff</h3>
<p>On a $320,000 mortgage at 6.5% (30 years, $2,023/month):</p>
<ul>
<li>Extra <strong>$100/month:</strong> Pays off 4.5 years early, saves <strong>$52,000</strong> in interest</li>
<li>Extra <strong>$300/month:</strong> Pays off 8 years early, saves <strong>$117,000</strong> in interest</li>
<li>Extra <strong>$500/month:</strong> Pays off 10 years early, saves <strong>$158,000</strong> in interest</li>
<li><strong>Biweekly payments</strong> (half payment every 2 weeks): Pays off 4–5 years early, saves $56,000+</li>
</ul>
`,
    },
    "personal-loan-emi": {
        subtitle: "Calculate your personal loan EMI, total interest payable, and generate a complete amortization schedule. Compare loan amounts, tenures, and rates side by side.",
        explanation: {
            heading: "How Personal Loan EMI Is Calculated",
            paragraphs: [
                "Personal loan EMI (Equated Monthly Installment) is calculated using the reducing balance method: EMI = P × r × (1+r)^n / [(1+r)^n − 1], where P is the principal (loan amount), r is the monthly interest rate (annual rate ÷ 12), and n is the loan tenure in months. Unlike flat-rate loans — where interest is calculated on the original principal throughout — reducing balance means each monthly payment reduces your outstanding principal, so interest decreases over time. This is the standard method used by all major banks and NBFCs in India (HDFC Bank, SBI, ICICI Bank, Axis Bank) and personal loan platforms globally.",
                "The total interest you pay on a personal loan is dramatically affected by three factors: loan amount, interest rate, and tenure. On a ₹5 lakh loan at 14% p.a.: a 3-year tenure gives EMI = ₹17,087 with total interest of ₹1,15,132. The same loan at 5 years gives EMI = ₹11,634 but total interest = ₹1,98,040 — ₹82,908 more just for the lower monthly payment. This is the core trade-off: longer tenure = lower EMI but much higher total cost.",
                "Processing fees significantly affect the true cost of personal loans. Most lenders charge 1%–3% of the loan amount as a processing fee deducted upfront. On a ₹5 lakh loan at 1.5% processing fee: ₹7,500 is deducted before you receive the funds, meaning you pay interest on ₹5,00,000 but receive only ₹4,92,500. The effective APR is higher than the stated interest rate. Always compare loans using the effective APR (inclusive of all fees), not just the stated interest rate.",
            ],
            highlight: "₹5 lakh personal loan at 14% p.a. for 3 years: EMI = ₹17,087/month. Total amount payable = ₹6,15,132. Total interest = ₹1,15,132 (23% of the loan amount). With a 1% processing fee (₹5,000), your actual disbursement is ₹4,95,000 but you repay ₹6,15,132.",
        },
        faq: [
            { question: "What is EMI and how is it calculated?", answer: "EMI (Equated Monthly Installment) is a fixed monthly payment paid to repay a loan. Formula: EMI = P × r × (1+r)^n / [(1+r)^n − 1]. Where P = principal, r = monthly interest rate (annual rate ÷ 12), n = tenure in months. Example: ₹3 lakh at 12% for 24 months → r = 0.01, EMI = 3,00,000 × 0.01 × 1.01^24 / (1.01^24 − 1) = ₹14,089/month." },
            { question: "What factors determine personal loan interest rates?", answer: "Key factors: (1) CIBIL score — 750+ qualifies for best rates (10–14%); 650–749 = 15–20%; below 650 = high risk or rejection. (2) Income — higher income means lower rate. (3) Employment type — salaried employees at established companies get better rates than self-employed. (4) Employer category — top-tier employers (FAANG, PSUs, MNCs) get preferential rates. (5) Existing relationship with lender — salary account holders often get 0.5–1% lower rates." },
            { question: "What is the maximum personal loan amount I can get?", answer: "Maximum personal loan amounts depend on income. HDFC Bank: up to ₹40 lakh. SBI: up to ₹20 lakh. ICICI Bank: up to ₹50 lakh. The standard formula is: maximum EMI ≤ 40–50% of net monthly income. If your take-home salary is ₹60,000/month, maximum EMI = ₹24,000–₹30,000. At 14% for 3 years, this supports a loan of ₹7–8.4 lakh." },
            { question: "How does loan tenure affect EMI and total interest?", answer: "Longer tenure = lower EMI but higher total interest. On ₹5 lakh at 14%: 1-year tenure = ₹44,933 EMI, ₹39,196 total interest. 3-year tenure = ₹17,087 EMI, ₹1,15,132 total interest. 5-year tenure = ₹11,634 EMI, ₹1,98,040 total interest. The 5-year option costs ₹82,908 more than the 3-year option just for a ₹5,453 lower monthly payment." },
            { question: "What is the difference between flat rate and reducing rate interest?", answer: "Flat rate calculates interest on the original principal throughout the tenure. Reducing rate calculates interest on the outstanding (reducing) balance each month. A 10% flat rate is approximately equivalent to 18–19% reducing rate. Banks and RBI-regulated lenders must use the reducing balance method. Always compare loans using the reducing rate (or Effective Annual Rate) for accurate comparison." },
            { question: "How can I reduce my personal loan EMI?", answer: "Three strategies: (1) Negotiate a lower interest rate — a 1% reduction on ₹5 lakh for 3 years saves ₹7,500+ in total interest. (2) Extend the tenure — increasing from 3 to 5 years drops EMI by ₹5,453 but costs ₹82,908 more in total interest. (3) Make a partial prepayment — a ₹1 lakh prepayment in month 6 on a ₹5 lakh loan saves ₹30,000+ in interest and reduces tenure by ~1 year." },
            { question: "What is a personal loan prepayment penalty?", answer: "Most lenders charge a prepayment penalty of 2–5% of the outstanding loan amount if you repay before the end of the tenure. Some lenders allow prepayment after 12 EMIs without penalty. As per RBI guidelines (2023), for floating-rate personal loans, lenders cannot charge prepayment penalties. For fixed-rate loans, penalties may apply — check your loan agreement." },
            { question: "How does a personal loan affect my CIBIL score?", answer: "Short-term: a hard inquiry (−5 to −10 points) occurs when you apply. Taking the loan adds a new credit account, which can temporarily reduce average account age. Long-term (6–12 months): consistently paying EMIs on time significantly improves your score (+40–80 points). Personal loans diversify your credit mix (installment credit), which is positive for CIBIL. Missed EMIs cause severe score damage (−80 to −150 points per missed payment)." },
            { question: "Can I get a personal loan without a salary slip?", answer: "Yes, but options are limited. Self-employed individuals can use ITR (last 2 years), bank statements (6 months), and business financial statements. Freelancers can use Form 16, GST returns, and client contracts. NBFCs and fintech lenders (MoneyTap, PaySense, Navi) have more flexible documentation requirements than traditional banks. Interest rates for non-salaried borrowers are typically 2–5% higher." },
            { question: "What is the minimum CIBIL score for a personal loan?", answer: "Most banks require 700+ for personal loan approval at good rates. 750+ qualifies for the best rates (10–14% p.a.). 650–699 = possible approval at 18–24% p.a. Below 650 = most banks reject; some NBFCs may approve at 28–36% p.a. Improving your CIBIL score from 650 to 750 before applying can save ₹40,000+ in interest on a ₹5 lakh loan." },
            { question: "What documents are required for a personal loan?", answer: "Standard documents: Identity proof (Aadhaar, PAN, passport), address proof (Aadhaar, utility bill, rental agreement), income proof (last 3 months salary slips + 6 months bank statements for salaried; ITR last 2 years + bank statements for self-employed), and employment proof (offer letter, employee ID). Processing time: digital lenders (1–3 days), banks (3–7 days)." },
            { question: "Is personal loan interest tax deductible in India?", answer: "Personal loan interest is NOT tax-deductible under any standard income tax provision. However, there are exceptions: if the personal loan is used for home renovation (Section 24(b) — up to ₹30,000 deduction), business investment (Schedule BP deduction), or education loan (Section 80E — but must be an actual education loan). For tax efficiency, use a home loan (Section 24 deduction of up to ₹2 lakh) or education loan instead of a personal loan." },
            { question: "What is the personal loan interest rate at SBI, HDFC, and ICICI Bank?", answer: "Current rates (2026): SBI Personal Loan — 11.15%–15.30% p.a. (salary account holders get lower). HDFC Bank — 10.50%–24.00% p.a. (pre-approved offers start at 10.50%). ICICI Bank — 10.65%–16.00% p.a. Axis Bank — 11.25%–22.00% p.a. Bajaj Finserv — 13.00%–26.00% p.a. Rates vary based on CIBIL score, income, and existing relationship with the bank." },
            { question: "How do I check my personal loan eligibility online?", answer: "Online eligibility check: (1) Use the bank's EMI/eligibility calculator (monthly EMI should be ≤ 40–50% of net salary). (2) Check your CIBIL score — free from CIBIL.com, Experian India, or CRIF High Mark. (3) Use our Personal Loan EMI Calculator to find the maximum loan amount your income supports at your target rate. (4) Apply with pre-approved banks first — they do a soft inquiry, not a hard inquiry, protecting your CIBIL score." },
        ],
        steps: [
            { label: "Determine loan amount", formula: "Net monthly salary ₹60,000 × 50% maximum EMI ratio", result: "Maximum EMI: ₹30,000/month" },
            { label: "Identify rate and tenure", formula: "14% p.a. (reducing balance) for 3 years (36 months)", result: "Monthly rate r = 14/12/100 = 0.01167" },
            { label: "Calculate EMI", formula: "EMI = P × r × (1+r)^36 / [(1+r)^36 − 1]", result: "On ₹5L loan: EMI = ₹17,087" },
            { label: "Calculate total cost", formula: "₹17,087 × 36 months", result: "Total repayment: ₹6,15,132 | Interest: ₹1,15,132" },
        ],
        comparison: [
            { title: "3-Year Tenure", value: "₹17,087/mo", detail: "Total interest: ₹1,15,132 | Faster payoff, lower total cost" },
            { title: "5-Year Tenure", value: "₹11,634/mo", detail: "Total interest: ₹1,98,040 | Saves ₹5,453/mo but costs ₹82,908 more", isWinner: false },
        ],
        insight: { icon: "💳", title: "The EMI-to-Income Trap", text: "Banks approve loans up to 50% of net income in EMIs — but financial advisors recommend keeping all EMIs (home loan + car + personal) below 40% of net income. If you earn ₹60,000/month, a ₹17,087 personal EMI plus a ₹12,000 car EMI already uses 48% of income — leaving almost no buffer for emergencies. Reserve personal loans for high-return investments, emergencies, or debt consolidation. Using personal loans for vacations or gadgets is the costliest financing option available to consumers." },
        contentHTML: `
<h3>Personal Loan vs. Other Loan Types — When to Choose Each</h3>
<table><thead><tr><th>Loan Type</th><th>Rate (2026)</th><th>Amount</th><th>Collateral</th><th>Best For</th></tr></thead><tbody>
<tr><td>Personal Loan</td><td>10.5–24%</td><td>Up to ₹50L</td><td>None</td><td>Medical emergency, wedding, debt consolidation</td></tr>
<tr><td>Home Loan</td><td>8.5–9.5%</td><td>Up to ₹10 Cr</td><td>Property</td><td>Buying real estate; tax-deductible interest</td></tr>
<tr><td>Gold Loan</td><td>8–15%</td><td>Up to ₹1 Cr</td><td>Gold</td><td>Short-term cash need with gold as collateral</td></tr>
<tr><td>Loan vs. Credit Card</td><td>10.5% vs. 36–48%</td><td>—</td><td>None</td><td>Personal loan always beats credit card EMIs</td></tr>
<tr><td>Education Loan</td><td>8–12%</td><td>Up to ₹75L</td><td>Co-applicant</td><td>Higher education; Section 80E tax benefit</td></tr>
</tbody></table>

<h3>Smart Prepayment Strategy — When and How Much to Prepay</h3>
<p>Prepaying a personal loan reduces your outstanding principal, which reduces future interest. The optimal time to prepay is in the <strong>first half of the tenure</strong> when interest constitutes the majority of each EMI.</p>
<p>On a ₹5 lakh loan at 14% for 3 years:</p>
<ul>
<li>Prepaying ₹1 lakh in <strong>Month 3:</strong> Saves ₹34,500 in interest, reduces tenure by 10 months</li>
<li>Prepaying ₹1 lakh in <strong>Month 18</strong> (halfway): Saves ₹17,200 in interest, reduces tenure by 6 months</li>
<li>Prepaying ₹1 lakh in <strong>Month 30:</strong> Saves only ₹5,800 — much less effective</li>
</ul>
<p>Check for prepayment charges (2–5% of outstanding amount). If the penalty exceeds the interest saved, prepayment is not worthwhile.</p>

<h3>Balance Transfer — How to Reduce Your Rate Mid-Loan</h3>
<p>A personal loan balance transfer moves your outstanding principal to a new lender at a lower interest rate. It makes sense when: (1) the new rate is at least 2% lower, (2) you have significant tenure remaining, and (3) balance transfer fees + new processing fee are less than total interest savings.</p>
<p>Example: ₹3 lakh outstanding at 20% with 24 months remaining. Transfer to 14%: new EMI = ₹14,423 (vs. ₹15,286). Monthly saving = ₹863. Over 24 months: ₹20,712 saved. If transfer costs ₹5,000 (fees), net saving = ₹15,712.</p>
`,
    },
};

export default async function CalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getAllCalculators().find((c) => c.slug === calculator);
    if (!calc) return notFound();

    // Check if this is an EMI calculator (has variants for programmatic pages)
    const variants = getVariants(calc.id);
    const isEMI = variants.length > 0;
    const hasCalculator = calc.defaults && calc.sliderRanges; // Always show calculator if it has config
    const content = HUB_CONTENT[calc.id];

    const pageUrl = canonicalUrl(`/loan-calculators/${calc.slug}`);
    const schemas: Array<object | undefined> = [
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Loan Calculators", url: canonicalUrl("/loan-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl, "USD", "FinanceApplication"),
    ];
    if (content?.faq && content.faq.length > 0) {
        schemas.push(faqSchema(content.faq));
    }
    const schemaData = JSON.stringify(schemas.filter(Boolean));

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-calculator"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Loan Calculators", href: "/loan-calculators" },
                    { label: calc.title.replace(" Calculator", "") },
                ]}
            />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>{calc.title}</h1>
            {content && (
                <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                    {content.subtitle}
                </p>
            )}
            <AuthorBadge categoryKey="loan" />

            <div className="layout-2col">
                <div className="layout-2col__main">
                    {hasCalculator && (
                        <>
                            {calc.calcType && LOAN_TOOL_TYPES.includes(calc.calcType) ? (
                                <LoanToolsCore calcType={calc.calcType} defaults={calc.defaults} sliderRanges={calc.sliderRanges} />
                            ) : (
                                <CalculatorCore
                                    defaults={calc.defaults}
                                    sliderRanges={calc.sliderRanges}
                                    loanTypeId={calc.id}
                                />
                            )}


                            {/* Popular amounts grid — only for calculators with variants */}
                            {isEMI && (
                                <section style={{ marginTop: "var(--s-8)" }}>
                                    <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                                        Popular {calc.title.replace(" Calculator", "")} Amounts
                                    </h2>
                                    <div className="popular-amounts__grid">
                                        {variants.map((v) => (
                                            <Link
                                                key={v.slug}
                                                href={`/loan-calculators/${calc.slug}/${v.slug}`}
                                                className="popular-amounts__card"
                                            >
                                                <span className="popular-amounts__label">
                                                    {amountToLabel(v.amount)}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    {content && (
                        <>
                            {content.steps && (
                                <StepByStep
                                    title={`How ${calc.title.replace(" Calculator", "")} is Calculated`}
                                    steps={content.steps}
                                />
                            )}

                            {content.comparison && (
                                <section style={{ marginTop: "var(--s-6)" }}>
                                    <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>
                                        Rate Comparison
                                    </h2>
                                    <ComparisonCallout
                                        options={content.comparison as [typeof content.comparison[0], typeof content.comparison[0]]}
                                    />
                                </section>
                            )}

                            {content.insight && (
                                <InsightBox icon={content.insight.icon} title={content.insight.title}>
                                    {content.insight.text}
                                </InsightBox>
                            )}

                            <DynamicExplanation
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            <FAQAccordion title={`${calc.title} FAQ`} items={content.faq ?? []} />

                            {CIBIL_FAQS[calc.id] && (
                                <FAQAccordion
                                    title={`CIBIL Score for ${content.explanation?.heading?.replace('Understanding ', '') ?? calc.title} — FAQ`}
                                    items={CIBIL_FAQS[calc.id]}
                                />
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

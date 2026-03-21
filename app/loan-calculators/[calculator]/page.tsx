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
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { amountToLabel } from "@/lib/slug";
import { CIBIL_FAQS } from "@/lib/cibilConfig";
import RelatedCalculators from "@/components/shared/RelatedCalculators";
import GuideCTA from "@/components/shared/GuideCTA";
import GlossaryChip from "@/components/shared/GlossaryChip";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

// Pre-render only loan calculator hub pages at build time
export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("loan");
    return calcs.map((c) => ({ calculator: c.slug }));
}

// Dynamic metadata per calculator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getAllCalculators().find((c) => c.slug === calculator);
    if (!calc) return {};
    const url = canonicalUrl(`/loan-calculators/${calc.slug}`);
    return {
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: url },
    };
}

// Hub page content per calculator type
const LOAN_TOOL_TYPES = ["mortgage","debtConsolidation","loanAffordability","loanInterestRate","loanPayoff","loanAmortization","ltv","balloonLoan","arm","fixedVsVariable","extraPayment","refinance","mortgageRefinance","rentAffordability","debtRatio","downPayment","aprCalc","homeEquity","heloc","vaMortgage","fhaLoan","rentalProperty","apyCalc","aprToApy","simpleInterest","compoundInterest","dailyCompoundInterest","interestCalc","interestRateCalc","cdCalc","creditCardInterest","creditCardPayoff","futureValue","presentValue","ruleOf72","studentLoanPayoff"];

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    contentHTML?: string;
    faq: { question: string; answer: string }[];
    steps?: { label: string; formula?: string; result: string }[];
    comparison?: { title: string; value: string; detail: string; isWinner?: boolean }[];
    insight?: { icon: string; title: string; text: string };
}> = {
    "car-loan-emi": {
        subtitle: "Calculate your monthly car loan payment. Adjust amount, interest rate, and tenure — results update instantly.",
        explanation: {
            heading: "Understanding Car Loan EMI",
            paragraphs: [
                "A car loan EMI depends on three factors: the principal amount you borrow, the annual interest rate offered by your bank, and the repayment tenure. Most car loans in India range from 7–12% for new cars and 14–18% for used cars.",
                "Always negotiate the interest rate before signing. Even a 0.25% reduction on a ₹5 Lakh loan over 5 years saves approximately ₹800 in total interest. Check pre-approved offers from your existing bank first — they're typically 1–2% lower than walk-in rates.",
            ],
            highlight: "Key insight: A ₹5 Lakh car loan at 8.5% for 5 years costs you ₹1,14,620 in total interest — that's 23% of the loan amount.",
        },
        faq: [
            { question: "What is the current car loan interest rate?", answer: "Car loan rates in India range from 7.5% (SBI, Bank of Baroda) to 12% (NBFCs). Your rate depends on credit score, car type (new/used), and loan amount." },
            { question: "How is car loan EMI calculated?", answer: "Using the reducing balance formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly rate, and n is tenure in months." },
            { question: "Does prepaying my car loan reduce the EMI?", answer: "Prepayment reduces your outstanding principal, which can either reduce your EMI amount or shorten your loan tenure. Most banks allow zero-penalty prepayment." },
        ],
        steps: [
            { label: "Convert annual rate to monthly", formula: "r = 8.5% ÷ 12 = 0.00708", result: "Monthly rate: 0.708%" },
            { label: "Calculate (1+r)^n", formula: "(1 + 0.00708)^60 = 1.526", result: "Compounding factor: 1.526" },
            { label: "Apply EMI formula", formula: "EMI = 5,00,000 × 0.00708 × 1.526 ÷ (1.526 - 1)", result: "Monthly EMI: ₹10,243" },
            { label: "Calculate total interest", formula: "(₹10,243 × 60) − ₹5,00,000", result: "Total interest: ₹1,14,580" },
        ],
        comparison: [
            { title: "SBI Car Loan", value: "₹10,122/mo", detail: "8.25% p.a. | 5 yrs | Total interest: ₹1,07,320", isWinner: true },
            { title: "HDFC Bank Car Loan", value: "₹10,364/mo", detail: "8.75% p.a. | 5 yrs | Total interest: ₹1,21,840" },
        ],
        insight: { icon: "💰", title: "Save on Car Loan Interest", text: "Pre-approved offers from your existing bank are typically 1-2% cheaper. A ₹5L loan at 8.25% instead of 9.5% saves ₹9,240 in interest over 5 years. Always compare 3-4 lenders before signing." },
    },
    "home-loan-emi": {
        subtitle: "Plan your dream home with accurate EMI calculations. Adjust loan amount, interest rate, and tenure to find the right fit.",
        explanation: {
            heading: "Understanding Home Loan EMI",
            paragraphs: [
                "Home loans are the longest-tenure loans — up to 30 years. Even a small rate difference compounds dramatically. A 0.5% rate increase on ₹50 Lakh over 20 years adds ₹6.5 Lakh in total interest.",
                "Key decision: Fixed vs floating rate. Floating rates are currently 8–9% and track RBI repo rate changes. Fixed rates are 1–2% higher but provide certainty. Most borrowers in India choose floating rates.",
            ],
            highlight: "On a ₹50 Lakh home loan for 20 years at 8.5%, your total interest is ₹53.1 Lakh — more than the loan itself. Consider shorter tenure if affordable.",
        },
        faq: [
            { question: "What is the current home loan interest rate?", answer: "Home loan rates range from 8.25% (SBI) to 10% (NBFCs). Rates are linked to repo rate and change periodically." },
            { question: "Should I choose fixed or floating rate?", answer: "Floating rate is typically 1-2% cheaper. Choose fixed only if you expect rates to rise significantly. Most Indian home loans are floating." },
            { question: "Is there any tax benefit on home loan?", answer: "Yes. Principal up to ₹1.5L under Section 80C and interest up to ₹2L under Section 24(b) are deductible. Joint loans double the benefit." },
        ],
        steps: [
            { label: "Loan amount after down payment", formula: "₹75L property × 80% LTV", result: "Loan: ₹60,00,000" },
            { label: "Monthly interest rate", formula: "r = 8.5% ÷ 12 = 0.00708", result: "Monthly rate: 0.708%" },
            { label: "EMI calculation (20 yr)", formula: "EMI = 60L × 0.00708 × (1.00708)^240 ÷ ((1.00708)^240 − 1)", result: "Monthly EMI: ₹52,069" },
            { label: "Total cost over 20 years", formula: "₹52,069 × 240 months", result: "Total paid: ₹1,24,96,560 (Interest: ₹64,96,560)" },
        ],
        comparison: [
            { title: "20-Year Tenure", value: "₹52,069/mo", detail: "Total interest: ₹64.97L — lower EMI, higher cost" },
            { title: "15-Year Tenure", value: "₹59,075/mo", detail: "Total interest: ₹46.33L — saves ₹18.64L!", isWinner: true },
        ],
        insight: { icon: "🏠", title: "Home Loan Tax Benefit", text: "Claim up to ₹3.5L tax deduction annually: ₹1.5L on principal (80C) + ₹2L on interest (24b). Joint loan with spouse doubles this to ₹7L. Over 20 years, this saves ₹15-25L in taxes depending on your bracket." },
    },
    "personal-loan-emi": {
        subtitle: "Estimate your monthly personal loan EMI instantly. Compare rates and find the most affordable option.",
        explanation: {
            heading: "Understanding Personal Loan EMI",
            paragraphs: [
                "Personal loans are unsecured — no collateral needed — but charge 10–24% interest depending on credit score and lender. The loan amount, rate, and tenure determine your EMI.",
                "Before taking a personal loan, check alternatives: loan against FD (6-7%), loan against mutual funds (9-10.5%), or credit card EMI conversion. These are 2-5% cheaper than standard personal loans.",
            ],
            highlight: "Credit score matters most for personal loans. 750+ gets you 10.5-12%. Below 700 means 16-24%. Improving your score by 50 points can save lakhs in interest.",
        },
        faq: [
            { question: "What is the minimum credit score for personal loan?", answer: "Most banks require 700+. Some NBFCs accept 650+ but at much higher rates (16-22%). 750+ gets the best rates." },
            { question: "Can I prepay a personal loan?", answer: "Yes, but most banks charge 2-5% foreclosure penalty. RBI mandates zero penalty for floating rate loans. Check your agreement." },
        ],
    },
    "education-loan-emi": {
        subtitle: "Plan your education financing with EMI calculations. Includes moratorium period considerations.",
        explanation: {
            heading: "Understanding Education Loan EMI",
            paragraphs: [
                "Education loans have unique features: moratorium period (course duration + 6-12 months), lower rates for meritorious students, and Section 80E tax deduction on interest — no upper limit.",
                "For study abroad, check SBI Scholar Loan, Credila, and HDFC Credila. Rates range from 8-12%. Collateral-free loans are available up to ₹7.5 Lakh. Above this, banks require security.",
            ],
            highlight: "Section 80E allows unlimited interest deduction on education loans — no cap unlike home loans. This benefit lasts for 8 years from when you start repaying.",
        },
        faq: [
            { question: "What is the moratorium period?", answer: "The grace period during which you don't pay EMI — typically course duration + 6-12 months. Interest still accrues during this period." },
            { question: "Is collateral required for education loan?", answer: "No collateral up to ₹7.5 Lakh. Above this, banks require property, FD, or LIC policy as security." },
        ],
    },
    "bike-loan-emi": {
        subtitle: "Calculate your two-wheeler EMI in seconds. Find the best deal for your dream bike.",
        explanation: {
            heading: "Understanding Bike Loan EMI",
            paragraphs: [
                "Bike loans typically range from 8-15% for new two-wheelers and 15-20% for used ones. Tenure is shorter than car loans — usually 1-4 years. Down payment of 10-30% is required.",
                "For electric scooters, check for additional subsidies. State and central government incentives can reduce the effective cost by ₹20,000-50,000. EV-specific financing is available at lower rates.",
            ],
            highlight: "Dealer financing is often 1-2% more expensive than direct bank loans. Always check your bank's personal/two-wheeler loan rates before accepting the dealer's offer.",
        },
        faq: [
            { question: "What is the minimum down payment?", answer: "Most lenders require 10-30% down payment. Zero down payment offers exist but come with higher EMI and interest rates." },
            { question: "Can I get EV subsidy on bike loan?", answer: "FAME II subsidy of ₹15,000-22,000 applies to eligible electric scooters. State subsidies vary. Check the manufacturer's website for eligible models." },
        ],
    },
    "business-loan-emi": {
        subtitle: "Calculate MSME and business term loan EMIs. Covers working capital and expansion financing.",
        explanation: {
            heading: "Understanding Business Loan EMI",
            paragraphs: [
                "Business loans range from 11-18% depending on business vintage, turnover, and credit profile. Mudra loans under PMMY offer up to ₹10 Lakh at subsidized rates. CGTSME provides collateral-free guarantee.",
                "Key decision: Term loan vs overdraft (OD). Term loans have fixed EMI — good for asset purchase. OD facilities charge interest only on utilized amount — ideal for working capital needs.",
            ],
            highlight: "Mudra loans offer up to ₹10 Lakh without collateral through PMMY. SHISHU (up to ₹50K), KISHOR (up to ₹5L), TARUN (up to ₹10L) — interest rates start at 8.5%.",
        },
        faq: [
            { question: "What is Mudra Loan?", answer: "PMMY Mudra loans are government-backed loans up to ₹10 Lakh for small businesses. No collateral required. Available through all banks and NBFCs." },
            { question: "Are business loan EMIs tax deductible?", answer: "The interest component is fully deductible as business expense. Principal repayment is not tax deductible but the borrowed amount is used for business purposes." },
        ],
    },
    "loan-comparison": {
        subtitle: "Compare two loan scenarios side-by-side. Calculate how differences in interest rates, tenures, and loan amounts impact your EMIs and total interest generated.",
        explanation: {
            heading: "Why You Should Always Compare Loans",
            paragraphs: [
                "Taking a home loan, personal loan, or car loan without comparing multiple lenders is a costly mistake. Even a fractional difference in an interest rate—such as selecting a 9% rate instead of an 8.5% rate on a 20-year home loan—can ultimately cost you lakhs of rupees in extra interest overhead over the life of the loan.",
                "Beyond just interest rates, it is vital to compare loan tenures. While opting for a 30-year home loan will result in a lower and more comfortable monthly EMI, the total interest paid to the bank will be astronomically higher. By comparing a 20-year term against a 15-year term using this calculator, you can visually clearly see exactly how much money you save by slightly increasing your EMI commitment.",
                "Additionally, borrowers must evaluate processing fees, pre-closure charges, and down payment requirements across different banks before finalizing an offer. A loan with a lower interest rate but exorbitant processing fees (like 2% of the loan amount + GST) might effectively be more expensive in the short run than a loan with a slightly higher rate but zero processing fees."
            ],
            highlight: "Financial Wisdom: On a ₹50 Lakh loan for 20 years, an interest rate of 8.5% costs ₹43,400 monthly. If a competitor offers 8.25%, your EMI drops to ₹42,600. It seems minor, but it totals ₹1.92 Lakhs in guaranteed savings over the 20 years!"
        },
        faq: [
            { question: "How does a longer tenure affect my loan?", answer: "A longer tenure reduces your monthly EMI, making it easier on your current cash flow. However, it significantly increases the total amount of interest you end up paying to the bank over the entire lifespan of the loan." },
            { question: "Can I use this to compare different banks?", answer: "Absolutely. Input the loan amount, the interest rate offered by Bank A, and compare it with Bank B. The calculator will explicitly outline the monthly EMI difference and total interest savings." },
            { question: "Is a flat parity rate better than a reducing balance?", answer: "No. Flat interest rates appear lower but are exceptionally expensive because you continue to pay interest on the original starting principal throughout the loan's life. Reducing balance rates adjust downward as you repay the principal, saving you massive amounts." },
            { question: "When should I execute a balance transfer to a different bank?", answer: "You should consider a balance loan transfer when the new bank offers an interest rate that is at least 0.50% to 0.75% lower, and the calculated long-term interest savings exceed the upfront processing fees required to switch." }
        ],
        steps: [
            { label: "Determine Loan Profiles", formula: "Find the exact details for Loan Scenario A and Loan Scenario B", result: "Gather Principal, Rate, and Tenure" },
            { label: "Input Specifications", formula: "Set the parameters in the dual-column slider UI", result: "Instant side-by-side computation" },
            { label: "Analyze Variance", formula: "Difference = Total Interest A — Total Interest B", result: "Highlight of exact cost savings" },
            { label: "Factor Associated Fees", formula: "Add processing and administrative charges", result: "Real-world effective cost comparison" }
        ],
        insight: { icon: "⚖️", title: "Balance Transfer Reality Check", text: "When evaluating a home loan balance transfer, always use a loan comparison tool to ensure the long-term interest savings over the remaining tenure actually surpass the 0.5% - 1% processing fee the new bank will charge to take over your loan." }
    },
    "prepayment": {
        subtitle: "Analyze how partial prepayments (part-payments) dramatically shrink your total loan tenure and eliminate massive interest blocks.",
        explanation: {
            heading: "The Mathematical Power of Loan Prepayment",
            paragraphs: [
                "Prepayment, often referred to as part-payment or making a lumpsum deposit, is mathematically the most effective financial strategy you can use to crush your debt early. Whenever you make a prepayment outside your standard EMI cycle, 100% of that extra cash injection directly attacks the outstanding principal balance. By shrinking the principal, the subsequent interest calculated on the remaining balance immediately plunges.",
                "In India, as per RBI guidelines, all floating-rate term loans for individual borrowers—such as standard home loans—carry absolutely zero prepayment penalties. This means you can deposit annual bonuses, tax refunds, or matured FDs straight into your loan account with no hidden fees attached.",
                "The timing of a prepayment fundamentally decides its power. Because loans operate on an amortization schedule where the initial years are heavily skewed toward interest recovery, making large prepayments during the first 1-5 years of a 20-year loan yields exponentially higher savings than making identical prepayments during the final 5 years. Always prioritize prepaying high-interest unsecured debt (like personal loans at 14%) before low-interest tax-shielded debt (like home loans at 8.5%)."
            ],
            highlight: "The Magic Trick: For a standard 20-year home loan, if you deposit just one extra EMI per year towards the principal, you will completely close the loan 4 entire years earlier, wiping out massive segments of the amortization schedule."
        },
        faq: [
            { question: "Will the bank charge a penalty for prepaying?", answer: "According to strict RBI mandates, banks cannot charge any foreclosure, pre-closure, or part-payment penalties on floating rate loans taken by individual borrowers. Fixed-rate loans and business loans may still carry a 2-4% penalty." },
            { question: "Does prepayment lower my EMI or reduce my tenure?", answer: "By default, banks apply part-payments to reduce your total remaining loan tenure while keeping your existing monthly EMI strictly identical. Alternatively, you can actively request the bank to lower your running EMI while keeping the tenure unchanged, though reducing tenure saves far more interest." },
            { question: "When is the absolute best time to prepay a loan?", answer: "The most impactful time to prepay is as early in the loan cycle as humanly possible. Because of how reducing balance amortization works, early prepayments wipe out principal balances before they have a chance to generate decades of compound interest." },
            { question: "Should I invest in mutual funds or prepay my home loan?", answer: "This is a classic question. If your home loan is at 8.5% (effective rate 6.5% considering Section 24b tax benefits) and you expect your diversified equity portfolio to yield 12%+, the math favors investing. However, prepaying guarantees a risk-free 8.5% return, making it the superior choice for conservative individuals." }
        ],
        steps: [
            { label: "Understand Base Liability", formula: "Log existing loan principal, interest rate, and current remaining tenure.", result: "Establishes baseline total interest." },
            { label: "Factor Lumpsum Injection", formula: "Determine the exact amount of the one-time prepayment (e.g., a ₹1 Lakh bonus).", result: "Subtract injection directly from Principal." },
            { label: "Recalculate Amortization", formula: "Simulate the remaining tenure using the newly reduced Principal balance.", result: "Instantly updates the new schedule." },
            { label: "Quantify Total Savings", formula: "Baseline Interest Liability — New Adjusted Interest Liability", result: "Actual Rupee amount saved by prepaying." }
        ],
        insight: { icon: "🔥", title: "Early Prepayment Advantage", text: "Prepaying ₹2 Lakhs in year 2 of a 20-year loan is exponentially more effective at reducing total interest overhead than prepaying that exact same ₹2 Lakhs in year 15. The underlying mathematical structure of EMI amortization guarantees that early interventions are geometrically rewarded." }
    },
    "loan-eligibility": {
        subtitle: "Find out how much loan you're eligible for based on your monthly income, existing EMIs, interest rate, and tenure. Loan eligibility in India depends on several financial factors — this calculator estimates your maximum borrowing capacity using standard bank formulas.",
        explanation: {
            heading: "How Loan Eligibility Is Calculated in India",
            paragraphs: [
                "Loan eligibility in India is determined by a combination of your monthly or annual income, existing financial obligations (EMIs you're already paying), the proposed interest rate, and the loan tenure. Banks and NBFCs in India typically use a metric called FOIR (Fixed Obligation to Income Ratio) — this is the percentage of your monthly income that goes toward loan repayments. Most lenders cap FOIR at 50-60%, meaning your total EMIs (existing + proposed) should not exceed 50-60% of your net monthly income.",
                "For salaried individuals, banks consider gross monthly salary minus statutory deductions (PF, professional tax, TDS). For self-employed borrowers, eligibility is based on ITR-filed income averaged over the last 2-3 years. Self-employed professionals (doctors, CAs, architects) typically get 1.5-2× higher eligibility than self-employed businesspersons due to perceived income stability.",
                "Beyond income, your CIBIL score plays a critical role. A score of 750+ not only improves approval chances but can increase your eligible loan amount by 10-20% because banks feel confident lending more to creditworthy borrowers. Additionally, joint loans (husband-wife or parent-child) combine both applicants' incomes, significantly increasing eligibility — this is particularly useful for home loans where the property value exceeds a single borrower's capacity.",
                "It's important to understand that gross eligibility (what you can borrow) and net eligibility (what you should borrow) are different. Financial advisors recommend keeping total EMIs below 35-40% of income, not 50-60%, to maintain a comfortable debt-to-income ratio and emergency buffer.",
            ],
            highlight: "Rule of thumb: Your maximum loan eligibility is approximately 60× your monthly take-home salary for a 20-year tenure at 8.5%. For example, a ₹1 Lakh/month salary makes you eligible for approximately ₹60 Lakh home loan. Reducing existing EMIs by ₹10,000 can increase eligibility by ₹8-12 Lakh.",
        },
        faq: [
            { question: "How is loan eligibility calculated?", answer: "Banks use the FOIR (Fixed Obligation to Income Ratio) method. They take your net monthly income, subtract existing EMIs, and calculate the maximum new EMI you can afford (typically 50-60% of income). This EMI is then reverse-calculated using the interest rate and tenure to determine the maximum loan amount." },
            { question: "What is FOIR and how does it affect eligibility?", answer: "FOIR (Fixed Obligation to Income Ratio) is the percentage of your income going toward EMIs. Banks cap this at 50-60%. If your salary is ₹1 Lakh and existing EMIs are ₹20K, your available capacity is ₹30-40K/month for new EMI. Lower existing obligations = higher eligibility." },
            { question: "Does CIBIL score affect loan eligibility amount?", answer: "Yes, significantly. A CIBIL score of 750+ can increase your eligible amount by 10-20%. Some banks offer preferential treatment for 800+ scores, including higher loan-to-value ratios and lower interest rates, both of which increase the total amount you can borrow." },
            { question: "How to increase loan eligibility in India?", answer: "1) Close existing loans and credit card dues. 2) Add a co-applicant (spouse/parent) to combine incomes. 3) Choose a longer tenure. 4) Improve your CIBIL score above 750. 5) Include variable income (bonuses, rental income) in your application. 6) Reduce credit card utilisation below 30%." },
            { question: "What salary is needed for a ₹50 Lakh home loan?", answer: "At 8.5% for 20 years, the EMI is ~₹43,400. With a 50% FOIR limit, you need ₹86,800/month minimum income (assuming no other EMIs). With existing EMIs of ₹15K, you'd need ~₹1,17,000/month. Joint applications can reduce the required individual income." },
            { question: "Is loan eligibility different for salaried and self-employed?", answer: "Yes. Salaried individuals get eligibility based on payslip income. Self-employed eligibility uses ITR-filed income (average of last 2-3 years). Self-employed borrowers typically need 20-30% higher documented income for the same loan amount due to perceived income variability." },
            { question: "Can I check loan eligibility for multiple loan types?", answer: "Yes. Home loan eligibility is highest (longest tenure = lower EMI = more borrowing). Personal loan eligibility is lower (shorter tenure, higher rate). Car/bike loan eligibility depends on vehicle value. Use this calculator with different rates and tenures to compare across loan types." },
        ],
        steps: [
            { label: "Calculate available EMI capacity", formula: "Net income ₹1,00,000 × 50% FOIR = ₹50,000 — Existing EMIs ₹15,000", result: "Available for new EMI: ₹35,000/month" },
            { label: "Convert to monthly interest rate", formula: "8.5% ÷ 12 = 0.00708", result: "Monthly rate: 0.708%" },
            { label: "Reverse-calculate max loan amount", formula: "₹35,000 × [(1.00708)^240 − 1] ÷ [0.00708 × (1.00708)^240]", result: "Max eligible: ₹33,67,000 (20 yrs at 8.5%)" },
            { label: "Factor in LTV and down payment", formula: "Home: 80-90% LTV → You need 10-20% down payment", result: "₹33.67L loan + ₹4.2-8.4L down = ₹38-42L property" },
        ],
        comparison: [
            { title: "20-Year Tenure", value: "₹33.67L eligible", detail: "EMI: ₹35,000/mo | Rate: 8.5% | Lower EMI, more borrowing", isWinner: true },
            { title: "10-Year Tenure", value: "₹22.80L eligible", detail: "EMI: ₹35,000/mo | Rate: 8.5% | Higher EMI burden, less borrowing" },
        ],
        insight: { icon: "💡", title: "Eligibility Maximisation Tip", text: "Close credit card revolving balances and small personal loans before applying. Every ₹10,000 reduction in existing EMIs increases your home loan eligibility by ₹8-12 Lakh. A joint application with your spouse can nearly double your eligible amount." },
    },
    "bank-emi-calculator": {
        subtitle: "A universal, high-precision EMI calculator bridging all consumer banking products. Accurately forecast your monthly installments for personal, vehicle, durable, or gold loans.",
        explanation: {
            heading: "The Comprehensive Guide to Bank EMIs and Amortization Logistics",
            paragraphs: [
                "An Equated Monthly Installment (EMI) is the foundational construct of modern consumer finance. It represents a standardized, fixed payment made by a borrower to a lending institution on a designated date each calendar month. The primary utility of the EMI structure is its predictability; it enables borrowers to systematically budget their cash flows while amortizing a substantial debt obligation over an extended period. The EMI amount integrates two distinct components: the principal repayment (the actual capital borrowed) and the interest payment (the cost of borrowing the capital). The continuous, monthly payment of these EMIs ensures that the loan is comprehensively liquidated by the termination of the agreed-upon tenure.",
                "The mathematical behavior of an EMI follows a reducing balance amortization schedule. In the preliminary phases of your loan tenure, a significantly disproportionate percentage of your monthly EMI is allocated toward servicing the interest overhead, because the outstanding principal balance remains high. Conversely, only a fractional segment of the EMI contributes to chipping away at the principal. As the months progress and the principal is incrementally diminished, the interest burden proportionally decreases. Consequently, in the terminal years of the loan, the structural ratio flips: the overwhelming majority of your EMI is directed toward principal repayment. Understanding this pivotal non-linear curve is crucial for borrowers contemplating loan foreclosure or balance transfers.",
                "Deploying a universal Bank EMI calculator empowers consumers with absolute financial transparency prior to initiating formal discussions with a direct sales agent or branch manager. Lenders frequently obfuscate the true cost of credit by blending upfront processing fees, documentation charges, and flat-rate calculations into the proposal. By independently calculating the Reducing Balance EMI based solely on the disbursed principal and the annualized interest rate, borrowers can accurately identify the effective Annual Percentage Rate (APR). Whether evaluating an unsecured personal loan, a collateralized gold loan, or retail financing for consumer durables, maintaining clarity on the exact monthly outflow and the cumulative interest total is an absolute prerequisite for sound personal financial management."
            ],
            highlight: "Amortization Strategy: If you aggressively prepay your loan during the first 25% of its tenure, you capture exponential interest savings by directly severing the principal before the bulk of the interest is accrued. Prepaying during the final 25% of the tenure yields negligible interest savings, as the remaining EMIs consist almost entirely of principal.",
        },
        faq: [
            { question: "What is the exact mathematical algorithm used by banks to compute the EMI?", answer: "Banks utilize the universal reducing balance amortization equation: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1). In this algorithm, 'P' signifies the total disbursed principal loan amount, 'r' denotes the rate of interest calculated strictly on a monthly basis (i.e., Annual Rate / 12 / 100), and 'n' indicates the comprehensive loan tenure expressed in total months." },
            { question: "Under what specific circumstances will my bank alter my monthly EMI?", answer: "If you have secured a floating rate loan (which is standard for home and education loans), the bank will modify your repayment structure when the Reserve Bank of India (RBI) implements changes to the macroeconomic Repo Rate. Typically, banks prefer to extend the loan tenure while keeping the EMI constant to avoid inflating your monthly budget. However, if extending the tenure breaches the maximum allowable age limit (usually 60 or 65 years), the bank is forced to strictly elevate the EMI amount." },
            { question: "How does a 'Flat Rate' loan fundamentally differ from a 'Reducing Balance' loan?", answer: "This is a critical distinction. In a Reducing Balance structure, interest is calculated solely on the outstanding principal left for that specific month. In a Flat Rate structure (commonly seen in two-wheeler loans or microfinance), the interest is calculated on the original starting principal for the entire duration of the loan. A 10% Flat Rate is mathematically equivalent to an excruciating 17-18% Reducing Balance rate." },
            { question: "Is it financially prudent to utilize a Credit Card EMI conversion instead of taking a dedicated bank loan?", answer: "Credit card EMI conversion is highly convenient but notoriously expensive. While it eliminates the documentation friction inherent in processing a fresh personal loan, the interest rates applied to post-purchase EMI conversions typically hover between 15% and 18% per annum, often coupled with a non-refundable upfront processing fee. For larger funding requirements, a dedicated personal loan or overdraft facility is almost universally more cost-efficient." }
        ],
    },
    "mortgage-calculator": {
        subtitle: "Calculate your full monthly mortgage payment including principal, interest, property tax, insurance, PMI, and HOA. See your amortization schedule and total cost of homeownership.",
        explanation: {
            heading: "How Mortgage Payments Work in the U.S.",
            paragraphs: [
                "Your monthly mortgage payment has up to five components, often called PITI+: Principal (paying down the loan balance), Interest (the cost of borrowing), Taxes (property tax escrowed monthly), Insurance (homeowner's insurance), and optional PMI/HOA fees. The principal and interest portion is calculated using the standard amortization formula — M = P × r(1+r)^n / ((1+r)^n − 1) — which keeps your payment fixed while gradually shifting the balance from interest-heavy to principal-heavy over time.",
                "The 20% down payment threshold is one of the most important numbers in home buying. Putting less than 20% down triggers Private Mortgage Insurance (PMI), which costs 0.3%–1.5% of the loan amount annually — that's $80–$400/month on a $320,000 loan. PMI automatically drops off when your equity reaches 22%. If you can't reach 20%, consider lender-paid PMI (built into a slightly higher rate) or FHA loans (3.5% down, but with mortgage insurance for the life of the loan).",
                "Choosing between a 15-year and 30-year mortgage is a major decision. A 30-year loan on $320,000 at 6.5% costs $2,023/month but $408,185 in total interest. The same loan at 15 years costs $2,789/month (+$766) but only $181,984 in total interest — saving you $226,201. If you can afford the higher payment, the 15-year option builds equity faster and saves massively on interest.",
            ],
            highlight: "$400K home, 20% down ($80K), 6.5% rate, 30 years → Monthly P&I: $2,023 | Property Tax: $400 | Insurance: $125 | Total: ~$2,548/mo. Total interest over 30 years: $408,185 — more than the original loan amount.",
        },
        faq: [
            { question: "How much house can I afford?", answer: "Follow the 28/36 rule: your total housing payment (mortgage + taxes + insurance) should not exceed 28% of gross monthly income, and total debt payments should stay under 36%. On a $7,000/month gross income, aim for a max housing payment of ~$1,960." },
            { question: "What is PMI and when can I remove it?", answer: "Private Mortgage Insurance (PMI) protects the lender when your down payment is less than 20%. It typically costs 0.3%–1.5% of the loan amount per year. You can request removal at 20% equity and it's automatically cancelled at 22% equity. Refinancing is another way to drop PMI once you've built enough equity." },
            { question: "Should I choose a 15-year or 30-year mortgage?", answer: "A 30-year mortgage gives you lower monthly payments and more budget flexibility. A 15-year mortgage has a higher monthly payment but dramatically lower total interest — you could save $150K–$250K on a typical loan. If you can comfortably afford the 15-year payment, it's almost always the smarter financial choice." },
            { question: "Fixed-rate or adjustable-rate mortgage (ARM)?", answer: "Fixed-rate offers payment certainty for the full term — ideal if you plan to stay 10+ years. ARMs (like 5/1 ARM) start 0.5–1.5% lower but adjust after the intro period. Choose an ARM only if you plan to sell or refinance before the adjustment date." },
            { question: "What are typical closing costs?", answer: "Closing costs run 2%–5% of the home purchase price. On a $400,000 home, expect $8,000–$20,000 covering appraisal, title insurance, attorney fees, origination fees, and prepaid taxes/insurance. Some costs are negotiable, and sellers sometimes contribute toward closing costs." },
            { question: "How does property tax affect my payment?", answer: "Property tax is typically 0.5%–2.5% of your home's assessed value, depending on your state and county. On a $400,000 home at 1.2%, that's $4,800/year or $400/month added to your mortgage payment. This is usually escrowed by your lender and included in your monthly payment." },
        ],
        steps: [
            { label: "Calculate loan amount", formula: "$400,000 home − $80,000 down (20%)", result: "Loan: $320,000" },
            { label: "Monthly interest rate", formula: "r = 6.5% ÷ 12 = 0.005417", result: "Monthly rate: 0.5417%" },
            { label: "P&I payment (30yr)", formula: "M = $320K × 0.005417 × (1.005417)^360 ÷ ((1.005417)^360 − 1)", result: "P&I: $2,023/mo" },
            { label: "Add taxes + insurance", formula: "$2,023 + $400 (tax) + $125 (insurance) + $0 (no PMI)", result: "Total: $2,548/mo" },
        ],
        comparison: [
            { title: "30-Year Fixed", value: "$2,023/mo", detail: "6.5% rate | Total interest: $408,185 | Lower payment, higher total cost" },
            { title: "15-Year Fixed", value: "$2,789/mo", detail: "5.9% rate | Total interest: $181,984 | Saves $226,201!", isWinner: true },
        ],
        insight: { icon: "🏠", title: "20% Down Payment Strategy", text: "Putting 20% down on a $400K home ($80K) eliminates PMI, saving $133–$400/month. If it takes you 2 years to save the extra down payment, calculate whether the PMI payments during that time exceed the savings. Sometimes buying sooner with 10% down and refinancing later is cheaper than waiting." },
    },
    "debt-consolidation-calculator": {
        subtitle: "Compare the total cost of your existing debts against a single consolidated loan. See monthly payment reduction and total interest savings.",
        contentHTML: `<h3>When Does Debt Consolidation Make Sense?</h3><p>Debt consolidation works best when the consolidated loan rate is significantly lower than your weighted average current rate. It simplifies multiple payments into one, reduces total interest, and can lower your monthly cash outflow.</p><ul><li><strong>Best for:</strong> High-interest credit card debt (18-24%) consolidated into a personal loan (8-12%)</li><li><strong>Risky if:</strong> You continue accumulating new debt after consolidating</li><li><strong>Consider:</strong> Balance transfer cards with 0% intro APR for debts under $15K</li></ul>`,
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
        contentHTML: `<h3>The Mathematics of Extra Payments</h3><p>When you make an extra payment, 100% goes to principal reduction. This creates a compounding benefit: less principal → less interest next month → more of your regular EMI goes to principal → loan shrinks faster.</p><ul><li><strong>₹5,000 extra/month</strong> on a ₹50L loan at 9% for 20 years saves <strong>₹13.5L in interest</strong> and finishes <strong>5 years early</strong></li><li><strong>One-time ₹5L prepayment</strong> in year 2 of the same loan saves <strong>₹8.2L in interest</strong></li></ul>`,
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
        contentHTML: `<h2>What Is the Difference Between APR and APY?</h2><p>APR and APY are two ways to express interest rates. <strong>APR</strong> represents borrowing cost <em>without</em> compounding. <strong>APY</strong> reflects <em>actual</em> return after compounding.</p><h3>APR to APY Formula</h3><p><strong>APY = (1 + APR/n)<sup>n</sup> − 1</strong></p><h3>APY to APR Formula</h3><p><strong>APR = n × [(1 + APY)<sup>1/n</sup> − 1]</strong></p><h3>Worked Example</h3><p>Convert 6% APR with monthly compounding to APY:</p><ul><li>APY = (1 + 0.06/12)<sup>12</sup> − 1 = <strong>6.168%</strong></li></ul><h3>When Does This Matter?</h3><p>Lenders advertise the lower APR; banks advertise the higher APY. Converting between them helps you see through marketing.</p>`,
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
        contentHTML: `<h2>What Is Daily Compound Interest?</h2><p>Interest calculated and added <strong>every day</strong> — 365 times/year. Each day earns interest on the new, slightly larger balance.</p><h3>Formula</h3><p><strong>A = P × (1 + r/365)<sup>365t</sup></strong></p><h3>Who Uses Daily Compounding?</h3><ul><li>High-yield savings accounts</li><li>Money market accounts</li><li>Credit cards (compounds against you)</li><li>Premium CDs</li></ul><h3>Daily vs. Monthly Compounding</h3><p>$50,000 at 5% for 5 years: Daily = $64,080; Monthly = $64,031. Difference: <strong>$49</strong>.</p>`,
        faq: [
            { question: "Do high-yield savings accounts compound daily?", answer: "Most online HYSAs compound daily and credit monthly. Marcus, Ally, and Discover all use daily compounding." },
            { question: "Is daily compounding really better?", answer: "Yes, but marginally. On $10,000 at 5%, daily earns ~$5.50 more/year than monthly." },
            { question: "Does my credit card compound daily?", answer: "Yes — DPR = APR/365. This is why CC debt grows so quickly." },
        ],
    },
    "interest-calculator": {
        subtitle: "Calculate interest earned or paid on any amount — supports both simple and compound interest with flexible compounding options.",
        contentHTML: `<h2>How to Calculate Interest</h2><p>This calculator supports both <strong>simple interest</strong> (I = P × r × t) and <strong>compound interest</strong> (A = P × (1 + r/n)<sup>nt</sup>).</p><h3>Types of Interest</h3><ul><li><strong>Simple</strong> — charged on principal only</li><li><strong>Compound</strong> — charged on principal + accumulated interest</li></ul><h3>How Banks Calculate Interest</h3><p>US banks use the <strong>daily balance method</strong>: interest calculated daily, summed at month-end.</p><h3>Interest Rate Environment</h3><p>The Federal Reserve's funds rate influences all consumer rates. Higher Fed rates = better savings APYs but costlier loans.</p>`,
        faq: [
            { question: "How much interest will I earn on $10,000?", answer: "At 5% APY compounded monthly for 1 year: ~$512. At a traditional bank 0.05%: just $5." },
            { question: "Is interest taxable?", answer: "Yes — savings interest is taxed as ordinary income. Banks issue 1099-INT for interest exceeding $10/year." },
        ],
    },
    "interest-rate-calc": {
        subtitle: "Reverse-calculate the hidden interest rate from known principal, final amount, and time period.",
        contentHTML: `<h2>How to Find the Interest Rate</h2><p>This calculator <strong>reverse-engineers</strong> the rate using both simple and compound interest formulas.</p><h3>Simple Rate: r = (A − P) / (P × t)</h3><h3>Compound Rate: r = (A/P)<sup>1/t</sup> − 1</h3><h3>Worked Example</h3><p>Investment grew from $8,000 to $12,500 in 4 years:</p><ul><li>Simple rate: <strong>14.06%/year</strong></li><li>Compound rate: <strong>11.82%/year</strong></li></ul>`,
        faq: [
            { question: "Why are simple and compound rates different?", answer: "Compound rate accounts for reinvested interest and is always lower because compounding accelerates growth." },
            { question: "Can I find my loan's real rate?", answer: "Yes — enter loan amount, total repaid, and time period to calculate the effective annual rate." },
        ],
    },
    "cd-calculator": {
        subtitle: "Calculate Certificate of Deposit earnings at maturity. Compare rates, terms, and compounding for FDIC-insured investments.",
        contentHTML: `<h2>What Is a Certificate of Deposit (CD)?</h2><p>A CD is a <strong>time-bound savings product</strong> with a guaranteed fixed rate. Deposit for a set term (3 months to 5 years), earn higher rates than savings accounts.</p><h3>Why CDs Are Popular</h3><ul><li><strong>FDIC insured</strong> up to $250,000</li><li><strong>Guaranteed rate</strong> — unaffected by market drops</li><li><strong>Higher than savings</strong> — typically 0.5–1% more APY</li></ul><h3>CD Laddering</h3><p>Split deposits across multiple terms. As each matures, reinvest or use the cash — balancing liquidity with higher rates.</p><h3>Worked Example</h3><p>$25,000 in 2-year CD at 4.75% daily:</p><ul><li>APY: <strong>4.866%</strong></li><li>Maturity: <strong>$27,471</strong></li><li>Interest: <strong>$2,471</strong></li></ul>`,
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
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Loan Calculators", url: canonicalUrl("/loan-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

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
                            <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />

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

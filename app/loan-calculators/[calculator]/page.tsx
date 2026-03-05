// Dynamic Hub Page — /loan-calculators/[calculator]/ (Server Component)
// Handles all 6 EMI calculator hubs + 3 utility tools via one route

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CalculatorCore from "@/components/calculator/CalculatorCore";
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
        title: `${calc.title} — Calculate Your Monthly Loan Payment`,
        description: calc.description,
        alternates: { canonical: url },
    };
}

// Hub page content per calculator type
const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
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

            <div className="layout-2col">
                <div className="layout-2col__main">
                    {hasCalculator && (
                        <>
                            <CalculatorCore
                                defaults={calc.defaults}
                                sliderRanges={calc.sliderRanges}
                                loanTypeId={calc.id}
                            />


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
                                heading={content.explanation.heading}
                                paragraphs={content.explanation.paragraphs}
                                highlight={content.explanation.highlight}
                            />
                            <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />

                            {CIBIL_FAQS[calc.id] && (
                                <FAQAccordion
                                    title={`CIBIL Score for ${content.explanation.heading.replace('Understanding ', '')} — FAQ`}
                                    items={CIBIL_FAQS[calc.id]}
                                />
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

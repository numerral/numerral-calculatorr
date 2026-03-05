// Dynamic Hub — /investment-calculators/[calculator]/
// Each investment calculator gets its own hub page with calculator + explanation + FAQ

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import InvestmentCalculatorCore from "@/components/calculator/InvestmentCalculatorCore";
import DynamicExplanation from "@/components/shared/DynamicExplanation";
import FAQAccordion from "@/components/shared/FAQAccordion";
import TrendingCalculations from "@/components/shared/TrendingCalculations";
import { getCalculatorsByCategory } from "@/lib/data";
import { canonicalUrl, breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface PageProps {
    params: Promise<{ calculator: string }>;
}

export async function generateStaticParams() {
    const calcs = getCalculatorsByCategory("invest");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("invest").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: `${calc.title} — Free Investment Calculator India`,
        description: calc.description,
        alternates: { canonical: canonicalUrl(`/investment-calculators/${calc.slug}`) },
    };
}

// Hub content per investment calculator
const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation: { heading: string; paragraphs: string[]; highlight: string };
    faq: { question: string; answer: string }[];
}> = {
    "sip-calculator": {
        subtitle: "Calculate your SIP returns with expected annual growth rate. See how monthly investments compound over time.",
        explanation: {
            heading: "Understanding SIP Returns",
            paragraphs: [
                "Systematic Investment Plan (SIP) lets you invest a fixed amount monthly in mutual funds. The power of SIP lies in rupee cost averaging — you buy more units when prices are low and fewer when high, reducing your average cost over time.",
                "Most equity mutual fund SIPs have historically returned 12-15% annually over 10+ year periods. However, returns are not guaranteed and depend on market conditions. Diversify across large-cap, mid-cap, and index funds for optimal risk-adjusted returns.",
            ],
            highlight: "₹5,000/month SIP at 12% return for 20 years → ₹49.9 Lakhs. Start 5 years earlier and the same SIP grows to ₹1.05 Crores. Time is the biggest factor in wealth creation.",
        },
        faq: [
            { question: "What is the minimum SIP amount?", answer: "Most mutual funds allow SIPs starting at ₹500/month. Some AMCs offer ₹100 SIPs for select schemes." },
            { question: "Can I stop or pause my SIP?", answer: "Yes, SIPs can be paused or stopped anytime without penalties. Your existing investments remain and continue to grow." },
            { question: "SIP vs lumpsum — which is better?", answer: "SIP is better for regular income earners (rupee cost averaging reduces timing risk). Lumpsum works when you have a large amount and markets are at reasonable valuations." },
            { question: "Are SIP returns taxable?", answer: "Yes. Equity SIP gains are taxed at 12.5% (LTCG above ₹1.25 Lakh) for holding > 1 year, and 20% for short-term gains." },
        ],
    },
    "fd-calculator": {
        subtitle: "Calculate fixed deposit maturity value with quarterly compounding. Know exactly how much your FD will earn.",
        explanation: {
            heading: "Understanding Fixed Deposits",
            paragraphs: [
                "Fixed deposits are India's most popular savings instrument — they offer guaranteed returns with zero market risk. Banks compound interest quarterly, which means your earned interest also earns interest every quarter.",
                "Senior citizens get an additional 0.25-0.50% interest rate. Tax-saver FDs (5-year lock-in) qualify for Section 80C deduction up to ₹1.5 Lakh. However, FD interest is fully taxable — TDS is deducted at 10% if interest exceeds ₹40,000/year (₹50,000 for seniors).",
            ],
            highlight: "₹1 Lakh FD at 7% for 5 years matures to ₹1,41,478 with quarterly compounding — that's ₹41,478 in interest earnings with zero risk.",
        },
        faq: [
            { question: "Which bank offers the highest FD rate?", answer: "Small finance banks offer 7-8.5%. Among major banks, SBI offers 6.5-7%, HDFC 6.6-7.25%. Compare rates before investing." },
            { question: "Can I break my FD early?", answer: "Yes. Premature withdrawal incurs a 0.5-1% penalty on the applicable rate. Some banks allow partial withdrawal without breaking the entire FD." },
            { question: "Is FD interest taxable?", answer: "Yes, fully taxable as per your income slab. TDS is deducted at 10% if interest exceeds ₹40,000/year. Submit Form 15G/15H if your total income is below taxable limit." },
        ],
    },
    "rd-calculator": {
        subtitle: "Estimate your recurring deposit maturity amount. Perfect for building a savings habit with monthly contributions.",
        explanation: {
            heading: "Understanding Recurring Deposits",
            paragraphs: [
                "Recurring Deposits combine the discipline of monthly saving with the safety of fixed returns. You commit to depositing a fixed amount every month, and the bank compounds interest quarterly.",
                "RD rates are typically 0.25-0.50% lower than FD rates at the same bank. The effective yield is lower than FD because your deposits are spread over time (earlier deposits earn more interest than later ones).",
            ],
            highlight: "₹5,000/month RD at 6.5% for 5 years matures to approximately ₹3,55,000 — your total deposit of ₹3,00,000 earns about ₹55,000 in interest.",
        },
        faq: [
            { question: "What happens if I miss an RD installment?", answer: "A penalty of ₹1-2 per ₹100 of installment is charged. If you miss 3+ consecutive installments, the bank may close the RD prematurely." },
            { question: "Can I get a loan against my RD?", answer: "Yes, most banks offer up to 90% of the RD value as a loan at 1-2% above the RD rate. This is cheaper than a personal loan." },
        ],
    },
    "ppf-calculator": {
        subtitle: "Calculate your PPF maturity value with annual compounding. Tax-free returns under Section 80C.",
        explanation: {
            heading: "Understanding PPF",
            paragraphs: [
                "Public Provident Fund is a government-backed, tax-exempt savings scheme. It offers EEE (Exempt-Exempt-Exempt) status — contribution qualifies for 80C, interest is tax-free, and maturity is also tax-free.",
                "PPF has a 15-year lock-in with extensions in 5-year blocks. The current rate is 7.1% (reviewed quarterly by government). You can invest ₹500 to ₹1,50,000 per year. Partial withdrawal is allowed from 7th year onwards.",
            ],
            highlight: "₹1.5 Lakh/year in PPF at 7.1% for 15 years = ₹40.68 Lakhs — completely tax-free. This is one of the highest risk-free, tax-free returns available in India.",
        },
        faq: [
            { question: "What is the current PPF interest rate?", answer: "7.1% per annum (as of 2024-25). The rate is reviewed quarterly by the government and has historically ranged from 7-8.7%." },
            { question: "Can I extend PPF after 15 years?", answer: "Yes, in blocks of 5 years, with or without fresh contributions. Extended PPF continues to earn interest at the prevailing rate." },
            { question: "Can I have multiple PPF accounts?", answer: "No, only one PPF account per person. A second account (if opened unknowingly) will only earn post office savings rate." },
        ],
    },
    "nps-calculator": {
        subtitle: "Plan your retirement corpus with NPS. Estimate your monthly pension based on contribution and expected returns.",
        explanation: {
            heading: "Understanding NPS",
            paragraphs: [
                "National Pension System is a market-linked retirement scheme regulated by PFRDA. You can invest in equity (up to 75%), corporate bonds, and government securities. NPS offers additional tax benefit of ₹50,000 under Section 80CCD(1B), over and above the ₹1.5L limit of 80C.",
                "At retirement (60), you must use 40% of the corpus to buy an annuity (pension). The remaining 60% can be withdrawn tax-free (up to ₹60L). Annuity rates currently range from 5-7% depending on the insurance company and pension option chosen.",
            ],
            highlight: "₹5,000/month NPS from age 30 to 60, at 10% return → ₹1.13 Crore corpus. 60% lump sum of ₹67.8 Lakh (tax-free) + annuity from remaining ₹45.2 Lakh for lifetime pension.",
        },
        faq: [
            { question: "Is NPS better than PPF?", answer: "NPS potentially gives higher returns (market-linked, 8-12%) vs PPF (7.1% fixed). However, NPS has partial lock-in (40% annuity) and withdrawals are partially taxable." },
            { question: "Can I withdraw from NPS before 60?", answer: "Partial withdrawal of up to 25% is allowed after 3 years for specific reasons (illness, education, home purchase). Premature exit requires 80% annuity purchase." },
        ],
    },
    "mutual-fund-returns": {
        subtitle: "Calculate lumpsum investment returns in mutual funds. Compare growth across different return scenarios.",
        explanation: {
            heading: "Understanding Mutual Fund Returns",
            paragraphs: [
                "Lumpsum mutual fund investment means putting a large amount at once, as opposed to SIP. This works best when you have surplus cash and markets are at reasonable valuations.",
                "Historically, equity mutual funds have returned 12-15% CAGR over 10+ years. Debt funds return 6-8%. Index funds like Nifty 50 have returned 12.2% CAGR over the last 20 years. Always look at rolling returns, not point-to-point, for a realistic expectation.",
            ],
            highlight: "₹1 Lakh lumpsum in Nifty 50 index fund 10 years ago would be worth approximately ₹3.2 Lakhs today — a 12.2% CAGR with zero effort.",
        },
        faq: [
            { question: "Should I invest lumpsum or SIP?", answer: "If you have a large amount, lumpsum works when markets are reasonably valued. If unsure about timing, split into 6-12 monthly STP installments to reduce timing risk." },
            { question: "What type of mutual fund should I choose?", answer: "For beginners: Nifty 50 or Nifty Next 50 index funds. For moderate risk: flexi-cap. For aggressive: mid-cap or small-cap. Always match fund type to your risk appetite and time horizon." },
        ],
    },
};

export default async function InvestmentCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("invest").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id];

    const pageUrl = canonicalUrl(`/investment-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Investment Calculators", url: canonicalUrl("/investment-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-invest-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Investment Calculators", href: "/investment-calculators" },
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
                    <InvestmentCalculatorCore
                        defaults={calc.defaults}
                        sliderRanges={calc.sliderRanges}
                        calcType={calc.calcType || "lumpsum"}
                        labels={
                            ["sip", "rd", "nps"].includes(calc.calcType || "")
                                ? { amountLabel: "Monthly Investment (₹)" }
                                : calc.calcType === "ppf"
                                    ? { amountLabel: "Yearly Investment (₹)" }
                                    : undefined
                        }
                    />

                    {content && (
                        <>
                            <DynamicExplanation
                                heading={content.explanation.heading}
                                paragraphs={content.explanation.paragraphs}
                                highlight={content.explanation.highlight}
                            />
                            <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />
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

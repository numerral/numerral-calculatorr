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
        title: `${calc.title}`,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/investment-calculators/${calc.slug}`) },
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
}> = {
    "lumpsum-calculator": {
        subtitle: "Calculate the future value of a one-time investment with compound interest over a chosen time period.",
        explanation: {
            heading: "How Lumpsum Investment Returns Are Calculated",
            paragraphs: [
                "A lumpsum investment involves putting a fixed amount of money into an investment at a single point in time. Unlike SIP where you invest monthly, in lumpsum investing all your capital works from day one. The returns compound annually (or quarterly, depending on the fund), and the growth is exponential rather than linear.",
                "The formula used is: A = P \u00d7 (1 + r)^n, where P is your principal, r is the annual rate of return (as a decimal), and n is the number of years. Our calculator handles all three of these variables and shows you both the maturity amount and the total profit.",
            ],
            highlight: "\u20b95 Lakhs invested in an equity mutual fund for 15 years at 13% CAGR grows to approximately \u20b928.5 Lakhs \u2014 a 5.7x return on your initial investment.",
        },
        faq: [
            { question: "When is lumpsum better than SIP?", answer: "Lumpsum investing at market lows can significantly outperform SIP in the medium term. Use lumpsum for windfalls like bonuses, inheritance, or proceeds from selling an asset. SIP is better for regular monthly income with no large capital available." },
            { question: "How is lumpsum return taxed in India?", answer: "If redeemed after 1 year, equity mutual fund lumpsum gains are taxed as LTCG at 12.5% beyond \u20b91.25 lakhs. Within 1 year, STCG at 20%. For debt funds, gains are taxed at applicable income slab rate regardless of holding period." },
        ],
    },
    "sip-calculator": {
        subtitle: "Find out how much wealth your monthly SIP can build over time, factoring in compounding and your chosen return rate.",
        explanation: {
            heading: "How SIP Compounding Works",
            paragraphs: [
                "A Systematic Investment Plan (SIP) is a method of investing a fixed amount in a mutual fund scheme at regular intervals \u2014 typically monthly. Each SIP instalment buys a certain number of units at the prevailing NAV. When markets fall, the same amount buys more units; when they rise, fewer. This naturally lowers your average cost per unit over time \u2014 a principle called Rupee Cost Averaging.",
                "The key difference from lumpsum investing is that each instalment compounds from a different start date. Your 12th month's SIP has only 11 months of compounding, while your first month's SIP compounds for the full year. Our calculator aggregates the future value of all these individual investments to show your total wealth created.",
            ],
            highlight: "\u20b910,000/month SIP for 20 years at 12% CAGR = Total invested: \u20b924 lakhs | Wealth created: \u20b999.9 lakhs. Compounding nearly quadruples your invested amount.",
        },
        faq: [
            { question: "What is the ideal SIP amount to invest?", answer: "A common rule of thumb is to invest at least 20\u201330% of your monthly take-home salary in SIPs. Ideally, increase your SIP by 10\u201315% every year (a Step-Up SIP) to offset lifestyle inflation and accelerate wealth creation." },
            { question: "Can I stop or modify my SIP midway?", answer: "Yes. SIPs are flexible \u2014 you can pause, reduce, increase, or stop them with no exit penalty in most funds. However, stopping a SIP early significantly impacts your final corpus due to losing years of compounding." },
            { question: "Which mutual fund category is best for SIP?", answer: "For long-term SIPs (10+ years), diversified large-cap or flexi-cap equity funds are recommended for stability with good returns. For aggressive wealth creation with a 15+ year horizon, mid-cap funds can outperform. Always choose a fund with a consistent 5-year track record and low expense ratio." },
            { question: "How does Rupee Cost Averaging benefit SIP investors?", answer: "Rupee Cost Averaging means you buy more units when markets fall (lower NAV) and fewer when markets rise (higher NAV). Over time, this automatically lowers your average purchase cost compared to investing a lumpsum at a single price point. It removes the stress of timing the market." },
        ],
    },
    "ppf-calculator": {
        subtitle: "Calculate the maturity amount of your Public Provident Fund (PPF) investment based on your annual contribution and remaining tenure.",
        explanation: {
            heading: "Understanding PPF Returns and Tax Benefits",
            paragraphs: [
                "PPF (Public Provident Fund) is a government-backed, guaranteed savings scheme with a lock-in period of 15 years (extendable in 5-year blocks). The current interest rate is 7.1% per annum, compounded annually and credited on 31st March each year. The minimum annual deposit is \u20b9500 and the maximum is \u20b91.5 lakhs per financial year. You can make deposits in up to 12 instalments across the year.",
                "PPF enjoys full EEE (Exempt-Exempt-Exempt) tax status \u2014 the only savings instrument in India with this triple benefit. Contributions up to \u20b91.5 lakhs per year qualify for Section 80C deduction, interest earned is completely tax-free every year, and the entire maturity amount is tax-free. This makes PPF one of the most tax-efficient long-term debt instruments available to Indian investors.",
            ],
            highlight: "\u20b91.5 lakhs invested in PPF every year for 15 years at 7.1% compounds to approximately \u20b940.68 lakhs \u2014 with zero tax on the entire corpus. The effective post-tax return beats most taxable debt instruments by 2\u20133% for investors in the 30% tax bracket.",
        },
        faq: [
            { question: "Can I withdraw PPF before the 15-year maturity?", answer: "Partial withdrawals are permitted from the 7th year onwards \u2014 up to 50% of the balance at the end of the 4th year or the previous year, whichever is lower. Full premature closure is allowed after 5 years only under specific conditions: life-threatening illness, higher education, or change in residency status. A 1% interest rate penalty applies." },
            { question: "Should I choose PPF over ELSS for tax saving under Section 80C?", answer: "PPF is risk-free and guarantees 7.1% (government-set rate). ELSS carries equity market risk but has historically delivered 12\u201315% CAGR over 10+ years, with a 3-year lock-in. For long horizons (10+ years), ELSS creates significantly more wealth. PPF suits conservative investors prioritizing capital safety over maximizing returns." },
            { question: "Can I open a PPF account in my child's name?", answer: "Yes. You can open a PPF account for a minor child and contribute to it from your own PPF limit of \u20b91.5 lakhs per year combined (your account + child's account combined cannot exceed \u20b91.5 lakhs total). This is a powerful long-term wealth building tool for children's education and marriage goals." },
            { question: "What is the PPF interest rate history and when does the government revise it?", answer: "The PPF interest rate is set by the Ministry of Finance and revised quarterly along with other small savings scheme rates. It was 8% till 2020, then cut to 7.1% and has remained there since. Historically PPF has always offered 7\u20138% \u2014 safe, guaranteed, and fully tax-free." },
        ],
    },
    "fd-calculator": {
        subtitle: "Calculate exact maturity value and total interest on your Fixed Deposit across different compounding frequencies.",
        explanation: {
            heading: "How Fixed Deposit Interest is Calculated",
            paragraphs: [
                "Fixed Deposits (FDs) are time-bound deposits that earn a predetermined interest rate for the duration of the tenure. The interest can be compounded quarterly, half-yearly, or annually, depending on the bank. Quarterly compounding gives a slightly higher effective return than the nominal rate \u2014 this difference is measured by the Effective Annual Rate (EAR).",
                "The formula is: A = P \u00d7 (1 + r/n)^(n\u00d7t), where P = principal, r = annual rate, n = compounding frequency, t = time in years. Tax-Saver FDs (with 5-year lock-in) qualify for Section 80C deduction up to \u20b91.5 lakhs, but the interest earned is fully taxable at your income slab rate.",
            ],
            highlight: "\u20b92 lakhs in an FD at 7% for 5 years (quarterly compounding) grows to \u20b92.83 lakhs \u2014 earning \u20b983,000 in interest. TDS of 10% is deducted by the bank; actual post-tax return depends on your income slab.",
        },
        faq: [
            { question: "Is FD interest taxable in India?", answer: "Yes. FD interest is added to your total income and taxed at your applicable income tax slab rate. Banks deduct TDS at 10% if annual interest exceeds \u20b940,000 (\u20b950,000 for senior citizens). Submit Form 15G/15H if your total income is below the taxable limit to avoid TDS deduction." },
            { question: "Which bank offers the best FD interest rates in 2025?", answer: "Small finance banks like Unity Small Finance Bank, ESAF, and AU Small Finance Bank typically offer 8\u20139% on FDs. Among major banks, IDFC First and Yes Bank offer competitive rates. Senior citizens get an additional 0.25\u20130.5% on most bank FDs. Always verify DICGC insurance coverage (\u20b95 lakh per bank) when choosing smaller banks." },
            { question: "What is the difference between cumulative and non-cumulative FD?", answer: "Cumulative FD reinvests the interest back into the principal every compounding period \u2014 you receive the total maturity amount at the end. Non-cumulative (or interest-payout) FD pays interest monthly, quarterly, or annually. Cumulative FDs build more wealth due to compounding; non-cumulative FDs suit retirees who need regular income." },
            { question: "Can I break an FD before maturity?", answer: "Yes, most FDs allow premature withdrawal with a penalty of 0.5\u20131% lower interest rate than the contracted rate. Some banks waive premature withdrawal penalties for senior citizens. Liquid funds or ultra-short debt funds can be a better alternative when you need liquidity, as they don't penalize early exits." },
        ],
    },
    "mutual-fund-returns": {
        subtitle: "See how a mutual fund investment grows over time and compare performance across short, medium, and long-term horizons.",
        explanation: {
            heading: "How Mutual Fund Returns Are Measured",
            paragraphs: [
                "Mutual fund returns are typically measured using CAGR (Compound Annual Growth Rate) for lumpsum investments and XIRR (Extended Internal Rate of Return) for SIPs, where cash flows occur at different points in time. CAGR shows the consistent annual growth rate that would turn the initial investment into the final value, as if growing at a constant rate every year.",
                "The absolute return is straightforward: ((Maturity Value - Invested Amount) / Invested Amount) \u00d7 100. But for comparing funds over different time periods, CAGR is far more meaningful because it normalizes the time variable. A fund that turned \u20b91 lakh into \u20b92 lakhs has 100% absolute return \u2014 but whether that's good or bad depends entirely on whether it took 3 years or 15 years.",
            ],
            highlight: "A fund that doubled your money in 5 years delivered a 14.87% CAGR. A fund that tripled it in 8 years delivered a 14.65% CAGR \u2014 very similar! Time-adjusting returns reveals the true pace of wealth creation.",
        },
        faq: [
            { question: "What is a good CAGR for mutual funds in India?", answer: "Large-cap equity funds: 10\u201313% long-term CAGR is considered good. Mid-cap and small-cap funds: 14\u201318% over long periods, but with higher volatility. Debt funds: 6\u20138% CAGR. Any equity fund consistently delivering 15%+ CAGR over 10+ years is considered an exceptional performer. Always compare against the category benchmark, not absolute numbers." },
            { question: "What is the difference between absolute return and CAGR?", answer: "Absolute return measures total profit or loss without considering time. CAGR shows the annualized rate, making comparisons across different holding periods fair. A 50% absolute return over 10 years is only a 4.1% CAGR \u2014 well below inflation. Always use CAGR for investments held longer than 1 year." },
            { question: "How is mutual fund expense ratio different from exit load?", answer: "The expense ratio is an annual fee (typically 0.1\u20132% of AUM) charged by the AMC for managing the fund. It's deducted from the NAV daily and reduces your effective return. Exit load is a one-time penalty charged if you redeem before a specific period (usually 1 year for equity funds, typically 1% of redemption amount). Direct plans have lower expense ratios than regular plans." },
            { question: "What is SEBI's risk-o-meter for mutual funds?", answer: "SEBI mandates all mutual funds to display a risk-o-meter rating: Low, Low to Moderate, Moderate, Moderately High, High, or Very High. Overnight and liquid funds are Low; equity small-cap funds are Very High. Always match the risk label to your own risk tolerance and investment horizon before investing." },
        ],
    },
    "savings-interest": {
        subtitle: "Calculate interest earned on your savings account balance. Find out how much your idle savings are actually generating for you.",
        explanation: {
            heading: "How Savings Account Interest Works in India",
            paragraphs: [
                "A savings account interest rate in India typically ranges from 2.5% to 7% per annum, depending on the bank and your balance. Most private sector and public sector banks in India calculate savings account interest on the daily closing balance method \u2014 meaning interest accrues every day based on your end-of-day balance, even though it is credited to your account quarterly (March, June, September, December).",
                "Understanding how your savings account earns interest helps you make smarter decisions. Keeping \u20b91 lakh in a regular savings account at 3.5% earns only \u20b93,500/year \u2014 which barely beats inflation on an after-tax basis. Sweeping excess savings into FDs, liquid funds, or arbitrage funds can meaningfully improve your short-term money returns without adding significant risk.",
            ],
            highlight: "\u20b91 lakh in a regular savings account at 3.5% earns \u20b93,500 per year before tax. The same amount in a small finance bank savings account at 6% earns \u20b96,000 \u2014 a 71% increase in interest income from a simple account switch.",
        },
        faq: [
            { question: "Which bank offers the highest savings account interest rate in 2025?", answer: "Small finance banks typically offer the highest rates: AU Small Finance Bank (7%), ESAF Small Finance Bank (7%), Equitas Small Finance Bank (7%). Among major banks, Kotak Mahindra Bank offers 3.5\u20134% on higher balances. Payments banks like Airtel and FINO offer 2.5\u20134%. Savings interest is DICGC-insured up to \u20b95 lakhs per bank." },
            { question: "Is savings account interest taxable?", answer: "Yes. Savings account interest is taxable as 'Income from Other Sources'. However, Section 80TTA provides a deduction of up to \u20b910,000 per year on savings account interest for individuals below 60. Senior citizens get a higher deduction of up to \u20b950,000 under Section 80TTB (covering both savings and FD interest)." },
            { question: "What is a sweep-in FD and how does it improve returns?", answer: "A sweep-in (or auto-sweep) FD automatically transfers excess balance above a threshold (e.g., anything above \u20b925,000) from your savings account into an FD, earning higher FD interest rates. If you withdraw, the FD is broken in reverse order. This gives you FD-level returns on idle money with full liquidity \u2014 one of the smartest features offered by most major banks." },
            { question: "How do I maximize returns on short-term idle money?", answer: "For money needed within 3 months: keep in a high-interest savings account or liquid mutual fund (5\u20137%). For 3\u201312 months: FD or short-term debt funds. For 12\u201336 months: ultra-short or money market funds. Liquid funds are particularly tax-efficient for those in the 30% bracket as they can generate returns with lower day-to-day tax friction than savings interest." },
        ],
    },
    "deposit-maturity": {
        subtitle: "Find out the exact maturity amount and total interest for any fixed deposit or lump sum investment over any tenure.",
        explanation: {
            heading: "How Deposit Maturity Amount is Calculated",
            paragraphs: [
                "The deposit maturity calculator computes how much your invested principal will grow to by the end of the deposit tenure, based on the interest rate and compounding frequency. For cumulative deposits (where interest is not paid out periodically), the formula is: Maturity Amount = Principal \u00d7 (1 + r/n)^(n\u00d7t), where r is the annual interest rate, n is the compounding periods per year, and t is the tenure in years.",
                "The difference between your maturity amount and the principal deposited is your total interest earned. This calculator is useful for planning across multiple deposit types: bank FDs, company FDs, post office time deposits (POTD), National Savings Certificate (NSC), and Kisan Vikas Patra (KVP) \u2014 all of which are essentially fixed-term deposit instruments with different rates, tenures, and tax treatments.",
            ],
            highlight: "\u20b95 lakhs in a bank FD at 7.5% for 5 years with quarterly compounding matures to \u20b97.22 lakhs \u2014 total interest earned: \u20b92.22 lakhs. Choosing quarterly vs annual compounding alone adds an extra \u20b96,000+ in interest on this amount.",
        },
        faq: [
            { question: "What is the difference between quarterly and annual compounding on FDs?", answer: "With annual compounding, interest is calculated once per year. With quarterly compounding, interest is calculated 4 times per year and each quarter's interest earns further interest. For a \u20b91 lakh deposit at 7%, annual compounding gives \u20b97,000 at year-end. Quarterly compounding gives \u20b97,186 \u2014 a small but compounding difference that grows significantly over 5\u201310 years." },
            { question: "Are post office time deposits better than bank FDs?", answer: "Post office time deposits (POTD) are backed by the Government of India \u2014 zero default risk. The 5-year POTD qualifies for Section 80C deduction up to \u20b91.5 lakhs. Current rates: 1-year (6.9%), 2-year (7%), 3-year (7.1%), 5-year (7.5%). These are competitive with, or often better than, major bank FD rates with sovereign safety guarantee." },
            { question: "What is National Savings Certificate (NSC) and how does it compare to FD?", answer: "NSC is a 5-year, government-backed savings certificate paying 7.7% (current rate) compounded annually but paid at maturity. Investment qualifies for Section 80C deduction. Unlike FD, NSC interest is auto-reinvested each year and also qualifies for 80C deduction in subsequent years. This makes NSC highly tax-efficient for investors in the 30% tax bracket." },
            { question: "How does Kisan Vikas Patra (KVP) work?", answer: "KVP doubles your investment in a fixed period determined by the current interest rate. At the current 7.5% rate, KVP doubles money in approximately 115 months (9 years 7 months). It is available at post offices and major bank branches, with no maximum deposit limit. KVP is not eligible for Section 80C deduction but offers guaranteed government-backed returns." },
        ],
    },
    "rd-calculator": {
        subtitle: "Calculate the maturity amount of your Recurring Deposit by entering monthly installment amount, interest rate, and tenure.",
        explanation: {
            heading: "How Recurring Deposit Interest is Calculated",
            paragraphs: [
                "A Recurring Deposit (RD) allows you to deposit a fixed amount every month for a predetermined period. Banks compound the interest quarterly, meaning each deposit earns interest from the date of deposit to the maturity date. The calculation is similar to summing the future value of multiple FDs starting at different months.",
                "RD is essentially a disciplined savings tool for people who do not have a lumpsum to invest but can commit a fixed amount monthly. At maturity, you receive the total principal plus accumulated interest. RD rates are similar to FD rates for the same tenure and are taxed the same way \u2014 as ordinary income at your slab rate. TDS applies if annual interest exceeds \u20b940,000.",
            ],
            highlight: "\u20b95,000/month RD for 3 years at 7% interest = Total invested: \u20b91.8 lakhs | Maturity amount: \u20b92.00 lakhs | Interest earned: \u20b920,132",
        },
        faq: [
            { question: "Can I close an RD before maturity?", answer: "Yes, most banks allow premature closure of an RD, typically with a 0.5\u20131% lower interest rate penalty than the contracted rate. Some banks enforce a minimum lock-in period of 3 months before allowing premature closure. Online RDs through savings accounts are often more flexible." },
            { question: "Is RD better than SIP for monthly savings?", answer: "RD offers guaranteed, risk-free returns (currently 6.5\u20137% for most banks) \u2014 ideal for capital protection goals with a 1\u20133 year horizon (home down payment, emergency fund, vacation). SIP in equity mutual funds targets 12\u201314% CAGR over 7+ years but involves market risk. Match the instrument to your timeline and purpose." },
            { question: "Is RD interest taxable?", answer: "Yes. RD interest is fully taxable at your income slab rate, similar to FD interest. Banks deduct TDS at 10% if total interest (FD + RD combined) from a single branch exceeds \u20b940,000 in a financial year. Submit Form 15G/15H to avoid TDS if your total income is below the taxable threshold." },
            { question: "How is RD different from SIP in a debt mutual fund?", answer: "Both involve regular monthly investments, but RD gives guaranteed returns at a fixed rate while debt mutual funds give market-linked returns that vary. Debt funds are generally more tax-efficient for investors in higher slabs (gains taxed at slab but with indexation for older investments) and offer higher liquidity. RD is simpler and completely risk-free." },
        ],
    },
    "nps-calculator": {
        subtitle: "Estimate your National Pension System (NPS) corpus at retirement and the monthly pension you can expect.",
        explanation: {
            heading: "Understanding NPS Returns and Pension Calculation",
            paragraphs: [
                "The National Pension System (NPS) is a government-regulated, long-term retirement savings scheme open to all Indian citizens between 18 and 70. You can choose your asset allocation across equity (Tier 1, up to 75% till age 50), corporate bonds, government bonds, and alternative assets. The returns are market-linked and vary based on your chosen mix and the Pension Fund Manager (PFM) selected.",
                "At retirement (age 60), you must use at least 40% of the corpus to purchase an annuity from an empanelled life insurance company, which provides your monthly pension. The remaining 60% can be withdrawn as a lump sum \u2014 completely tax-free. The annuity amount depends on the annuity rate from the insurer at the time of vesting.",
            ],
            highlight: "\u20b95,000/month NPS contribution from age 30 to 60 at an assumed 10% return = Final corpus of approximately \u20b91.13 Crores. Using 40% for annuity at 5.5% annuity rate gives approximately \u20b920,600/month lifetime pension.",
        },
        faq: [
            { question: "What are the tax benefits of NPS in India?", answer: "NPS contributions qualify for deduction under Section 80CCD(1) within the \u20b91.5 lakh 80C limit. Additionally, \u20b950,000 exclusively under Section 80CCD(1B) \u2014 over and above the 80C limit, saving \u20b915,600 additional tax for someone in the 30% bracket. Employer contributions up to 10% of basic+DA are deductible under 80CCD(2) with no upper cap." },
            { question: "Can I withdraw from NPS before retirement at 60?", answer: "Partial withdrawals up to 25% of own contributions are allowed after 3 years for specific purposes: children's higher education, marriage, purchase or construction of residential house, critical illness treatment. Premature exit before 60 requires investing 80% of the corpus in an annuity, with only 20% as a tax-free lump sum." },
            { question: "Which NPS fund manager gives the best returns?", answer: "Equity (E scheme) funds managed by SBI Pension Funds, HDFC Pension, and ICICI Pru Pension have historically delivered 12\u201315% CAGR over 10+ years in the equity portion. The G (Government Securities) and C (Corporate Bond) schemes deliver 7\u20138%. Younger investors (below 40) benefit from maximum equity allocation (75%) in the auto or active choice." },
            { question: "What is the difference between NPS Tier 1 and Tier 2?", answer: "NPS Tier 1 is a mandatory retirement account with lock-in till age 60 \u2014 it gets all the tax benefits. Tier 2 is a voluntary savings account with no lock-in and can be withdrawn anytime, but offers NO tax deduction benefits (except for government employees under certain conditions). Tier 2 acts like a flexible debt fund with lower expense ratios." },
        ],
    },
    "cagr": {
        subtitle: "Calculate the Compound Annual Growth Rate of any investment — or find the return rate needed to reach a financial target.",
        explanation: {
            heading: "Understanding CAGR — The Most Useful Investment Metric",
            paragraphs: [
                "CAGR (Compound Annual Growth Rate) is the single most important metric for comparing investment performance across different time periods. It expresses the consistent annual growth rate that an investment would have needed to grow from its beginning value to its ending value, assuming profits are reinvested.",
                "For example, if you invested ₹1 lakh in a fund in 2016 and it grew to ₹3.17 lakhs by 2024 (8 years), the CAGR is: (3.17/1)^(1/8) − 1 = 15.46% per year. This single number allows you to meaningfully compare against any other investment — whether it is an FD, real estate, or another fund.",
            ],
            highlight: "The Nifty 50 TRI has delivered approximately 14% CAGR over the last 20 years (2004–2024). This benchmark helps you evaluate whether your equity fund manager is adding real value through active stock picking.",
        },
        faq: [
            { question: "What is a good CAGR for investments in India?", answer: "As of current market conditions: Inflation is ~6%, so any investment below 6% CAGR loses real value. FDs offer ~7%. PPF offers ~7.1%. A good equity fund CAGR is 12%+ over 10 years. A great one is 15%+. Real estate varies significantly by location and timing." },
            { question: "How is CAGR different from XIRR?", answer: "CAGR is used for single investment (lumpsum) with a single start and end point. XIRR is used when there are multiple cash inflows and outflows at different dates — like monthly SIPs, or systematic withdrawals. For SIP performance, always use XIRR, not CAGR." },
        ],
    },
    "step-up-sip": {
        subtitle: "See how your wealth grows when you increase your monthly SIP amount by a fixed percentage each year.",
        explanation: {
            heading: "The Power of Step-Up SIP",
            paragraphs: [
                "A Step-Up SIP (also called a Top-Up SIP) is a smart variant where you automatically increase your SIP amount by a fixed percentage each year. For example, if you start with ₹10,000/month and step up by 10% annually, your SIP becomes ₹11,000 in Year 2, ₹12,100 in Year 3, and so on.",
                "This strategy aligns naturally with annual salary increments. As your income grows, your investments grow proportionally, dramatically accelerating wealth creation without significantly straining your current budget. The additional compounding from the stepped-up amounts can create substantially more wealth than a flat SIP over long periods.",
            ],
            highlight: "₹10,000/month flat SIP at 12% for 20 years = ₹94 Lakhs | Same SIP with 10% annual step-up = ₹1.89 Crores — that is double the wealth from the same discipline, just growing the amount systematically.",
        },
        faq: [
            { question: "Is Step-Up SIP available in all mutual funds?", answer: "Most major AMCs (Asset Management Companies) now offer built-in Step-Up SIP functionality through their apps and websites. You can set the step-up as a percentage (e.g., 10% annual increase) or a fixed rupee amount each year." },
            { question: "What step-up % should I choose?", answer: "Match it to your expected annual salary growth rate. If you expect 10-15% annual increments, a 10-15% step-up SIP is financially comfortable. Even a modest 5-10% annual step-up makes a dramatic difference over a 15+ year period." },
        ],
    },
    "goal": {
        subtitle: "Find out how much you need to invest monthly or as a lumpsum to reach a specific financial goal by a target date.",
        explanation: {
            heading: "How the Goal Planning Calculator Works",
            paragraphs: [
                "The goal planning calculator works backward from your target. You specify the target amount, the timeline, and the expected rate of return — and the calculator tells you exactly how much you need to invest today (or monthly) to reach that goal on time.",
                "This is the reverse engineering approach to financial planning. Whether your goal is funding a child's education in 15 years, a home down payment in 5 years, or a world tour in 3 years — knowing the monthly SIP or lumpsum requirement turns a vague aspiration into a concrete, actionable savings target.",
            ],
            highlight: "Goal: ₹50 Lakhs for child's college education in 15 years. Expected return: 12% CAGR. Required monthly SIP: ₹9,970. Start now — waiting just 2 years increases the required SIP to ₹13,370.",
        },
        faq: [
            { question: "Should I adjust for inflation in goal planning?", answer: "Yes — always inflate your goal amount. If an MBA costs ₹25 lakhs today, in 15 years at 8% education inflation it will cost approximately ₹79 lakhs. Plan for the future inflated cost, not today's price, to avoid a shortfall." },
            { question: "What if I cannot afford the required monthly investment?", answer: "You have three levers: (1) Extend your timeline, (2) Reduce the target amount, or (3) Accept a higher investment return (implying riskier assets). Our calculator helps you model all three scenarios quickly." },
        ],
    },
    "swp": {
        subtitle: "Calculate how long your investment corpus will last when you make regular monthly withdrawals through Systematic Withdrawal Plan.",
        explanation: {
            heading: "Understanding Systematic Withdrawal Plans (SWP)",
            paragraphs: [
                "A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund corpus every month — the mirror image of a SIP. The remaining corpus continues to earn returns, extending how long your money lasts. SWP is popularly used by retirees to create a steady monthly income stream from a lumpsum corpus.",
                "The key variable is the relationship between your withdrawal rate and your portfolio growth rate. If your portfolio earns 9% annually and you withdraw 7% annually, your corpus will actually grow over time. If you withdraw more than the portfolio earns, the corpus will shrink at a calculated rate.",
            ],
            highlight: "₹1 Crore corpus at 8% returns with ₹50,000/month SWP: The corpus lasts approximately 43+ years. At ₹70,000/month withdrawal, this drops to about 22 years. Small increases in the withdrawal amount significantly impact corpus longevity.",
        },
        faq: [
            { question: "Is SWP income taxable?", answer: "Only the gains portion of each SWP withdrawal is taxable, not the principal. For equity funds, if each withdrawal is from units held 12+ months, the gain component is taxed at LTCG rates (12.5% above ₹1.25 lakhs). This makes SWP significantly more tax-efficient than interest income from FDs (which is taxed at full slab rates)." },
            { question: "How do I decide the right SWP amount for retirement?", answer: "A common guideline: Limit withdrawals to 3-4% of your corpus annually (the Safe Withdrawal Rate). This gives your portfolio a high probability of lasting 25-30 years. Withdrawing 6%+ significantly increases the risk of outliving your money." },
        ],
    },
    "inflation": {
        subtitle: "See how inflation reduces the purchasing power of your money over time, and how much future income you will need.",
        explanation: {
            heading: "How Inflation Erodes Purchasing Power",
            paragraphs: [
                "Inflation is the steady rise in prices over time. It means ₹100 today will buy less next year. Our inflation calculator shows you exactly how much any amount of money will be worth in purchasing power after a specified number of years at a given inflation rate.",
                "High inflation is particularly damaging for fixed-income earners, retirees, and anyone holding large amounts of idle cash. If you hold ₹10 lakhs in a savings account earning 3.5% while inflation runs at 6%, you are effectively losing about 2.5% of your purchasing power every year — over 25 years, that is a massive erosion of real wealth.",
            ],
            highlight: "₹1 lakh today at 6% inflation will have the purchasing power of only ₹17,411 after 25 years. That ₹83,000 in purchasing power has quietly disappeared — not from your bank account, but from what your money can actually buy.",
        },
        faq: [
            { question: "What is the current inflation rate in India?", answer: "India's CPI (Consumer Price Index) inflation has ranged between 4% and 7% in recent years, with RBI targeting a 4% medium-term inflation rate. Food inflation and fuel price fluctuations frequently push overall CPI higher in the short term." },
            { question: "Which investments best protect against inflation?", answer: "Equities (12-15% long-term CAGR) and Real Estate historically beat India's 5-6% inflation. Gold provides moderate inflation protection over very long periods. REITs, Sovereign Gold Bonds, and inflation-linked bonds are emerging alternatives. Fixed deposits and savings accounts often fail to beat inflation on an after-tax basis." },
        ],
    },
    "returns-percent": {
        subtitle: "Calculate the absolute return percentage from any investment by entering your purchase price and current or sale value.",
        explanation: {
            heading: "Calculating Absolute Returns",
            paragraphs: [
                "The absolute return (also called the simple return or point-to-point return) is the most basic measure of investment performance. It measures the total percentage gain or loss from your original investment, without factoring in the time taken.",
                "Formula: Absolute Return = ((Ending Value - Beginning Value) / Beginning Value) x 100. Though simple, absolute return is useful for short-term evaluations where time normalization is not needed.",
            ],
            highlight: "Bought at ₹1,200, current value ₹1,800: Absolute return = (600 / 1200) x 100 = 50%. However, if this took 5 years, the CAGR is only 8.4% — not as impressive when you consider the time value of money.",
        },
        faq: [
            { question: "When should I use absolute return vs CAGR?", answer: "Use absolute return for holding periods under 1 year, or when comparing two investments over the exact same time period. Always use CAGR for investments held beyond 1 year when comparing performance across different periods or funds." },
            { question: "Does absolute return include dividends?", answer: "Standard absolute return only measures price change. For a complete picture, use Total Return, which includes dividends or distributions received during the holding period. Our Stock Return Calculator computes total return including dividends." },
        ],
    },
    "retirement-corpus": {
        subtitle: "Calculate the exact corpus you need to retire comfortably — based on your current expenses, inflation, and retirement timeline.",
        contentHTML: `
            <h3>What is a Retirement Corpus?</h3>
            <p>A <strong>retirement corpus</strong> is the total amount of money you need to have saved and invested on the day you retire — large enough to fund your lifestyle for the rest of your life without needing to work again. It is not an arbitrary number; it is a precise calculation based on your current expenses, expected inflation, years in retirement, and the returns your corpus will generate while you withdraw from it.</p>
            <p>Most people either guess at this number or seriously underestimate it. The result? Running out of money in their 70s or 80s when earning capacity is gone. This calculator removes all guesswork by computing your exact retirement number from first principles.</p>

            <h3>Why Most Retirement Plans Fall Short</h3>
            <p>There are two financial forces quietly working against every retirement plan — and most people do not account for both of them properly:</p>
            <ul>
                <li><strong>Inflation:</strong> If your current lifestyle costs ₹60,000 per month today, a sustained 6% annual inflation rate means that same lifestyle will cost approximately ₹2.6 lakhs per month in 25 years. Your retirement corpus must generate this inflated income — not today's lower amount.</li>
                <li><strong>Longer life expectancy:</strong> With improving healthcare in India, planning for a 25 to 30 year retirement after age 60 is now the recommended standard. A retirement fund must sustain you to age 85 or beyond, comfortably.</li>
            </ul>

            <h3>How the Retirement Corpus is Calculated</h3>
            <p>Our calculator works in three steps:</p>
            <ol>
                <li><strong>Step 1 — Inflation-adjust your expenses:</strong> Your current monthly expenses are projected forward to your retirement date using compound inflation. If you plan to retire in 25 years with ₹60,000/month expenses today at 6% inflation, your first-year retirement expense will be approximately ₹2.57 lakhs/month — or ₹30.8 lakhs/year.</li>
                <li><strong>Step 2 — Apply the Safe Withdrawal Rate:</strong> Based on the globally studied 4% Rule (from the Trinity Study), a diversified portfolio can sustain 4% annual withdrawals indefinitely, adjusted for inflation. This means you need a corpus equal to 25 times your first-year retirement expense.</li>
                <li><strong>Step 3 — Compute the target corpus:</strong> For the above example — ₹30.8 lakhs annual expense x 25 = <strong>₹7.7 Crores required retirement corpus.</strong></li>
            </ol>

            <div class="explanation__highlight">
                <strong>Healthcare inflation is a hidden multiplier:</strong> While general CPI inflation in India averages 5 to 6%, medical inflation consistently runs at 12 to 14%. A serious illness in retirement can cost ₹10 to 25 lakhs in a single hospitalization. Your retirement plan must include a standalone health insurance policy (base + super top-up) of at least ₹1 Crore coverage to protect your corpus from medical emergencies.
            </div>

            <h3>How Much Should You Save Monthly to Build This Corpus?</h3>
            <p>Once you know your target corpus, the next question is: how much do you need to invest each month to reach it? That depends on your investment timeline (years until retirement), the expected annual return on your investments during accumulation, and whether you are making lump-sum investments, monthly SIPs, or a combination.</p>
            <p>As a rough benchmark: To build ₹5 Crores in 25 years at a 12% annual return (typical long-term equity fund return), you need to invest approximately ₹25,000 per month via SIP. Use our SIP Calculator alongside this tool for a complete retirement roadmap.</p>
        `,
        faq: [
            { question: "At what age should I start planning for retirement?", answer: "The earlier the better. Starting at 25 versus 35 provides 10 additional years of compounding, which can double the final corpus for the same monthly investment amount. Even ₹5,000/month started at 25 creates significantly more wealth than ₹15,000/month started at 40." },
            { question: "Should I use the 4% withdrawal rate for India-based retirement planning?", answer: "The 4% rule was derived from US market data. Indian financial planners often recommend a 3 to 3.5% withdrawal rate for more conservative planning, given India's higher inflation volatility. A 3.5% rate means building 28x your annual expenses instead of 25x." },
            { question: "Does the retirement corpus include my EPF and NPS?", answer: "Yes — your EPF balance, NPS corpus, and any existing investments should be subtracted from the required corpus to find your actual savings gap. Include only liquid, market-accessible assets that you can actually withdraw during retirement." },
            { question: "How much does healthcare inflation affect the retirement corpus?", answer: "Medical inflation in India runs at 12 to 14% annually — more than double general CPI. A serious illness can cost ₹10 to ₹25 lakhs in a single hospitalization. Always maintain a high-value health insurance policy (base + super top-up of ₹1 Crore+) to protect your retirement corpus." },
        ],
    },
    "fire-calculator": {
        subtitle: "Calculate your FIRE number — the exact portfolio size needed to retire early and live entirely off passive investment income.",
        contentHTML: `
            <h3>What is the FIRE Movement?</h3>
            <p><strong>FIRE</strong> stands for <strong>Financial Independence, Retire Early</strong>. It is a personal finance philosophy built around one powerful idea: if you save and invest aggressively enough, you can reach a point where your investment returns permanently cover all your living costs. At that point, working becomes a choice — not a necessity.</p>
            <p>FIRE is not about being a millionaire. It is about the relationship between your portfolio size and your spending. Someone who needs ₹5 lakhs per year to live comfortably needs a much smaller FIRE corpus than someone spending ₹25 lakhs per year — regardless of income.</p>

            <h3>The FIRE Number: What Is It and How Is It Calculated?</h3>
            <p>Your <strong>FIRE Number</strong> is the total investment portfolio you need to sustain your lifestyle forever — without depleting the principal. It is based on the <strong>4% Safe Withdrawal Rate</strong>, studied extensively in personal finance research (Trinity Study, William Bengen's work on sequence-of-return risk).</p>
            <p>Formula: <strong>FIRE Number = Annual Expenses x 25</strong> — so annual expenses of ₹12 lakhs means a FIRE Number of ₹3 Crores.</p>

            <h3>Different Types of FIRE</h3>
            <ol>
                <li><strong>LeanFIRE:</strong> Extreme frugality. Retire with a minimal corpus covering only basic expenses. Typically requires 15x to 20x annual expenses.</li>
                <li><strong>Standard FIRE:</strong> Build 25x your current annual expenses and retire at whatever age you achieve that number, maintaining your current lifestyle.</li>
                <li><strong>FatFIRE:</strong> Accumulate a large corpus to retire in comfort — frequent travel, premium experiences, no lifestyle compromises. Often requires 35x to 50x expenses or more.</li>
                <li><strong>BaristaFIRE:</strong> Reach a partial FIRE number, then switch to a low-stress part-time job. Your investment portfolio handles most expenses; the job covers healthcare and extras.</li>
                <li><strong>CoastFIRE:</strong> You have invested enough that compounding alone will grow your portfolio to your full FIRE number by your target retirement age. You only need to earn enough for current living expenses.</li>
            </ol>

            <div class="explanation__highlight">
                <strong>India-specific FIRE consideration:</strong> Medical inflation at 12 to 14% annually can rapidly erode retirement funds. Every FIRE planner in India must have comprehensive health insurance (base + super top-up totaling ₹1 to ₹2 Crore) as a non-negotiable component of their plan — before quitting full-time employment.
            </div>

            <h3>How to Reach Your FIRE Number Faster</h3>
            <p>The single most powerful variable in your FIRE timeline is your <strong>savings rate</strong> — what percentage of your income you invest each month. A higher savings rate means you accumulate faster and simultaneously need a smaller FIRE target (because you prove you can live on less).</p>
            <p>At a 50% savings rate, most people can reach FIRE in 15 to 17 years. At a 70% savings rate, it can happen in under 10 years — regardless of income level.</p>
        `,
        faq: [
            { question: "Is the 4% Rule safe in India given higher inflation?", answer: "Many Indian FIRE practitioners use a more conservative 3 to 3.5% withdrawal rate, implying a corpus of 28x to 33x annual expenses. This provides a larger buffer against India's higher inflation volatility and rising medical costs compared to the US where the 4% rule was derived." },
            { question: "What investment approach should a FIRE investor use in India?", answer: "During accumulation, a high-equity allocation (80%+ in diversified equity mutual funds) maximizes growth. After reaching FIRE, most practitioners gradually shift toward a 60:40 equity-to-debt ratio to balance growth with stability during the withdrawal phase and reduce sequence-of-return risk." },
            { question: "How do I account for EPF, NPS, and Gratuity in FIRE planning?", answer: "These locked-in benefits typically mature at or after age 58 to 60. Pure FIRE before 50 often requires building an entirely separate, liquid investment portfolio — EPF and NPS are supplementary corpus that activates later in retirement, not immediately accessible." },
            { question: "What is the biggest risk after achieving FIRE?", answer: "Sequence-of-return risk — experiencing a severe bear market (e.g., a 30%+ crash like 2008 or Covid) in the first 2 to 3 years of retirement. Withdrawing from a sharply declining portfolio permanently destroys capital. Build a 2 to 3-year cash buffer outside your equity portfolio before quitting." },
        ],
    },
    "stock-return": {
        subtitle: "Calculate your total return from a stock investment by combining capital gains and dividends received over your holding period.",
        contentHTML: `
            <h3>What is Total Stock Return?</h3>
            <p><strong>Total stock return</strong> is the complete performance measure of a stock investment, combining two sources: (1) the change in share price (capital appreciation or loss) and (2) dividends paid by the company during your holding period. Looking at only one of these gives an incomplete picture of investment performance.</p>
            <p>This is why the <strong>Nifty 50 TRI (Total Returns Index)</strong> consistently outperforms the standard Nifty 50 Price Return index — the TRI includes dividend reinvestment, which the price index ignores. Over 15 to 20-year periods, dividends can account for 15 to 25% of total equity market returns.</p>

            <h3>The Two Components of Stock Returns</h3>
            <ol>
                <li><strong>Capital Gain (or Loss):</strong> The difference between your purchase price and sale price. If you bought 100 shares of Infosys at ₹1,200 and sold at ₹1,800, your capital gain is ₹60,000 (₹600 x 100 shares). This is the most visible part of stock returns, but not always the largest contributor over long holding periods.</li>
                <li><strong>Dividends Received:</strong> Cash payments made by the company from its profits — typically quarterly or annually. A stock paying ₹20 per share annually, held for 10 years, adds ₹200 per share in dividends regardless of price movement. These cash flows are particularly valuable during flat or bear markets when price appreciation is minimal.</li>
            </ol>

            <div class="explanation__highlight">
                <strong>Total Return Formula:</strong> Total Return (%) = [(Capital Gain + Total Dividends Received) / Initial Investment] x 100
            </div>

            <h3>Why Including Dividends Changes Everything</h3>
            <p>Consider ITC shares: Bought ₹1 lakh worth in 2014 at approximately ₹360 per share. By 2024, the price was around ₹475 — a price return of roughly 32% over 10 years, or about 2.8% CAGR per year. That seems underwhelming for a decade of holding.</p>
            <p>But ITC paid substantial dividends throughout — averaging around ₹10 to ₹14 per share annually. Over 10 years, a significant portion of the original investment was returned through dividends. When dividends are included and reinvested, the total return is meaningfully higher than the price-only figure suggests. This is exactly why serious investors always evaluate total return, not just price change.</p>

            <h3>Taxation of Stock Returns in India (FY 2024-25)</h3>
            <ul>
                <li><strong>Short-Term Capital Gains (STCG):</strong> Equity held under 12 months — taxed at 20%</li>
                <li><strong>Long-Term Capital Gains (LTCG):</strong> Equity held 12+ months — tax-free up to ₹1.25 lakhs; gains above that taxed at 12.5% without indexation</li>
                <li><strong>Dividends:</strong> Added to your total income and taxed at your applicable income slab rate — which can be up to 30% for high earners</li>
            </ul>

            <h3>Total Return vs CAGR: What is the Difference?</h3>
            <p>Total return gives the absolute percentage gain over the entire holding period. CAGR expresses the same gain as an annualized rate, making it easier to compare investments held for different durations. A 100% total return over 10 years is only a 7.2% CAGR — in line with average FD returns. A 300% total return over 10 years equals a 14.9% CAGR, which is genuinely excellent equity performance.</p>
        `,
        faq: [
            { question: "Should I include brokerage and STT charges in my return calculation?", answer: "Yes, for the most accurate net return. Brokerage, STT (Securities Transaction Tax), and SEBI charges reduce your effective gain. For most retail investors using discount brokers, total transaction costs are small (0.05 to 0.1%) but worth including for long-term return accuracy." },
            { question: "How do I handle bonus shares or stock splits in total return calculations?", answer: "A bonus issue or stock split does not change your overall position value immediately — it just increases the number of shares at a proportionally lower price. For return calculations, use the adjusted cost basis (cost per share after adjusting for splits and bonuses) for accurate results." },
            { question: "What is a good total return benchmark for Indian stocks?", answer: "The Nifty 50 TRI has delivered approximately 13 to 15% CAGR over 15+ year periods. Any stock investment consistently beating this on a risk-adjusted basis represents genuine alpha over the market index." },
            { question: "Why does the Nifty 50 TRI outperform the Nifty 50?", answer: "The Nifty 50 Price Return index only tracks stock price changes. The Nifty 50 TRI (Total Returns Index) also includes dividends reinvested, giving a complete picture of returns. Over long periods, dividends contribute 15 to 25% of total equity market returns — a significant difference." },
        ],
    },
    "dividend-yield": {
        subtitle: "Calculate the dividend yield of any stock — how much annual income you earn as a percentage of your share purchase price.",
        contentHTML: `
            <h3>What is Dividend Yield?</h3>
            <p><strong>Dividend yield</strong> measures how much annual income a company pays its shareholders relative to its current share price. It is expressed as a percentage and tells you the direct cash return you earn simply by holding a stock — independent of whether the share price goes up or down.</p>
            <p>Think of it like the interest rate on a savings account, but for stocks. A ₹500 stock that pays ₹20 in annual dividends has a dividend yield of 4% (20 / 500 = 0.04 = 4%). If you invest ₹5 lakhs in this stock, you receive ₹20,000 per year in dividend income — regardless of short-term price movements in the market.</p>

            <h3>The Dividend Yield Formula</h3>
            <div class="explanation__highlight">
                <strong>Dividend Yield (%) = (Annual Dividend Per Share / Current Share Price) x 100</strong><br/>
                Example: Coal India at ₹450 with ₹36 annual dividend = (36 / 450) x 100 = 8% yield — higher than most FD rates.
            </div>

            <h3>Who Should Pay Attention to Dividend Yield?</h3>
            <ul>
                <li><strong>Retirees and income investors:</strong> Who need regular cash flow from their portfolio without selling shares. High-dividend stocks in sectors like utilities, PSU banks, FMCG, and energy can generate a steady income stream that complements pension or NPS income.</li>
                <li><strong>Value investors:</strong> Who use dividend yield as one signal of valuation. A low price relative to dividends paid can sometimes indicate an undervalued stock with a disciplined management team.</li>
                <li><strong>Tax-conscious investors:</strong> Dividends are taxed as income in India at your applicable slab rate. For investors in the 10 to 20% tax bracket, high-yield stocks can be highly efficient. For those in the 30% bracket, LTCG-focused investing is more tax-efficient.</li>
            </ul>

            <h3>The Dividend Yield Trap: A Common Investing Mistake</h3>
            <p>A very high dividend yield is often a warning sign rather than a reward. Here is why:</p>
            <ul>
                <li><strong>Falling price inflates yield:</strong> If a company's stock crashes from ₹1,000 to ₹400 because the business is deteriorating, historical dividends of ₹50 per share push the yield from 5% to 12.5% — making it look attractively high when the fundamentals are worsening.</li>
                <li><strong>Unsustainable payouts:</strong> Check the Dividend Payout Ratio (dividends divided by net profit). If a company pays 90%+ of earnings as dividends, it retains almost nothing for growth, debt repayment, or handling downturns. The healthy, sustainable range is generally 30 to 60%.</li>
                <li><strong>Dividend cuts risk:</strong> Companies can and do reduce or eliminate dividends during financial stress. Always verify 5+ years of consistent payout history before relying on dividend income.</li>
            </ul>

            <h3>Yield on Cost — The Long-Term Investor's Hidden Superpower</h3>
            <p>While dividend yield fluctuates daily with the share price, long-term investors benefit from <strong>Yield on Cost (YOC)</strong> — the yield based on what you originally paid, not the current market price.</p>
            <p>If you bought a quality stock at ₹100 per share 10 years ago, and it now pays ₹20 per share annually, your personal Yield on Cost is 20% — even if the stock's current market yield is only 4% (because the price has risen to ₹500). Patient dividend investors build extraordinary income yields that are invisible to new buyers but deeply valuable to long-term holders.</p>
        `,
        faq: [
            { question: "Are dividends in India taxable?", answer: "Yes. Since 2020, dividends are added to the investor's total income and taxed at their applicable income tax slab rate. TDS at 10% is deducted by the company if total dividends received exceed ₹5,000 in a financial year. For investors in the 30% tax bracket, this makes dividends relatively tax-inefficient compared to LTCG on equity." },
            { question: "What is a good dividend yield for Indian stocks?", answer: "Nifty 50 stocks typically yield 1 to 2%. PSU stocks, utilities, and mature FMCG companies often offer 3 to 8% yields. A dividend yield above 6% in a fundamentally strong company with a consistent payout history can represent good value. Yields above 10% warrant serious investigation into payout sustainability." },
            { question: "How do I find high dividend yield stocks in India?", answer: "Screen for high-dividend stocks using NSE/BSE stock screeners, Money Control, or Screener.in by filtering on dividend yield percentage and payout consistency. Always cross-check with 5-year payout history, Payout Ratio, EPS trend, and debt levels before investing for income." },
            { question: "What is the difference between dividend yield and dividend growth investing?", answer: "Dividend yield focuses on current income — the payout relative to today's price. Dividend growth investing focuses on companies that consistently increase their dividend every year. A 2% yielder growing at 15% annually will double its payout in 5 years, outpacing a static high-yield stock over a 10+ year horizon." },
        ],
    },
    "crypto-profit-calculator": {
        subtitle: "Calculate your cryptocurrency investment profit or loss — enter buy price, sell price, investment amount, and trading fees to see net profit, ROI, and total exit value.",
        contentHTML: `
            <h3>How Crypto Profit is Calculated</h3>
            <p>The crypto profit calculator works in three simple steps:</p>
            <ol>
                <li><strong>Coins Purchased:</strong> Your investment amount divided by the buy price gives the number of coins you acquired. Example: $1,000 ÷ $50,000/BTC = 0.02 BTC.</li>
                <li><strong>Gross Exit Value:</strong> Coins purchased × sell price. If BTC rises to $65,000: 0.02 × $65,000 = $1,300.</li>
                <li><strong>Net Profit/Loss:</strong> Gross exit − exit fee − total invested (investment + investment fee). $1,300 − $0 − $1,000 = <strong>$300 profit (+30% ROI)</strong>.</li>
            </ol>

            <h3>Understanding Trading Fees</h3>
            <p>Most cryptocurrency exchanges charge <strong>0.1% to 0.5%</strong> per trade. This applies both when buying and selling:</p>
            <ul>
                <li><strong>Maker fees:</strong> 0.02%–0.10% on limit orders (you provide liquidity)</li>
                <li><strong>Taker fees:</strong> 0.04%–0.20% on market orders (you take liquidity)</li>
                <li><strong>Spread:</strong> The hidden cost — the difference between bid and ask price, typically 0.1%–1% on most exchanges</li>
                <li><strong>Network/Gas fees:</strong> Charged for on-chain transactions (withdrawals to wallets), varies by blockchain</li>
            </ul>

            <div class="explanation__highlight">
                <strong>Pro tip:</strong> On a $10,000 trade at 0.1% maker fee, you pay $10 per side — $20 round trip. On a $10,000 trade at 0.5% taker fee, you pay $50 per side — $100 round trip. Fee differences compound dramatically for active traders.
            </div>

            <h3>Crypto Investment Tax Implications</h3>
            <p>In most jurisdictions, cryptocurrency gains are subject to capital gains tax:</p>
            <ul>
                <li><strong>Short-term gains:</strong> Crypto held less than 1 year (2 years in some countries) — taxed at ordinary income rates</li>
                <li><strong>Long-term gains:</strong> Crypto held over 1 year — typically taxed at a lower rate (15–20% in the US, 30% flat in India)</li>
                <li><strong>India specific:</strong> From April 2022, all crypto gains are taxed at a flat 30% + 4% cess, with no deductions except cost of acquisition. 1% TDS applies on all crypto sales above ₹10,000.</li>
            </ul>
        `,
        faq: [
            { question: "How do I calculate profit on Bitcoin?", answer: "Divide your investment by the buy price to get BTC amount. Multiply BTC amount by the sell price. Subtract your original investment and any fees. Example: $5,000 invested at $50,000/BTC = 0.1 BTC. Sold at $70,000: 0.1 × $70,000 = $7,000. Profit = $7,000 − $5,000 = $2,000 (40% ROI)." },
            { question: "What fees should I include in the calculation?", answer: "Include exchange trading fees (0.1-0.5% per trade), withdrawal fees (varies by coin, typically $1-$30), and any spread costs. For accurate results, add your buy-side fee as 'Investment Fee' and your sell-side fee as 'Exit Fee' in the calculator." },
            { question: "Is crypto profit taxable?", answer: "Yes, in most countries. The US taxes crypto as property — short-term gains at income rates, long-term at 15-20%. India taxes all crypto gains at a flat 30% with no loss offset. The UK allows a £3,000 annual capital gains exemption. Always consult a local tax professional." },
            { question: "Should I use dollar-cost averaging for crypto?", answer: "DCA (buying fixed amounts at regular intervals) reduces the risk of buying at a peak. Studies show DCA outperforms lump-sum investing in highly volatile assets like crypto approximately 60% of the time. It's especially effective for Bitcoin and Ethereum over multi-year horizons." },
        ],
    },
};

export default async function InvestmentCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("invest").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

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
                                heading={content.explanation?.heading}
                                paragraphs={content.explanation?.paragraphs}
                                highlight={content.explanation?.highlight}
                                contentHTML={content.contentHTML}
                            />
                            {content.faq && <FAQAccordion title={`${calc.title} FAQ`} items={content.faq} />}
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

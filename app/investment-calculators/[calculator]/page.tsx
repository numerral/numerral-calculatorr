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
    "lumpsum": {
        subtitle: "Calculate the future value of a one-time investment with compound interest over a chosen time period.",
        explanation: {
            heading: "How Lumpsum Investment Returns Are Calculated",
            paragraphs: [
                "A lumpsum investment involves putting a fixed amount of money into an investment at a single point in time. Unlike SIP where you invest monthly, in lumpsum investing all your capital works from day one. The returns compound annually (or quarterly, depending on the fund), and the growth is exponential rather than linear.",
                "The formula used is: A = P × (1 + r)^n, where P is your principal, r is the annual rate of return (as a decimal), and n is the number of years. Our calculator handles all three of these variables and shows you both the maturity amount and the total profit.",
            ],
            highlight: "₹5 Lakhs invested in an equity mutual fund for 15 years at 13% CAGR grows to approximately ₹28.5 Lakhs — a 5.7x return on your initial investment.",
        },
        faq: [
            { question: "When is lumpsum better than SIP?", answer: "Lumpsum investing at market lows can significantly outperform SIP in the medium term. Use lumpsum for windfalls like bonuses, inheritance, or proceeds from selling an asset. SIP is better for regular monthly income with no large capital available." },
            { question: "How is lumpsum return taxed in India?", answer: "If redeemed after 1 year, equity mutual fund lumpsum gains are taxed as LTCG at 12.5% beyond ₹1.25 lakhs. Within 1 year, STCG at 20%. For debt funds, gains are taxed at applicable income slab rate regardless of holding period." },
        ],
    },
    "sip": {
        subtitle: "Find out how much wealth your monthly SIP can build over time, factoring in compounding and your chosen return rate.",
        explanation: {
            heading: "How SIP Compounding Works",
            paragraphs: [
                "A Systematic Investment Plan (SIP) is a method of investing a fixed amount in a mutual fund scheme at regular intervals — typically monthly. Each SIP instalment buys a certain number of units at the prevailing NAV. When markets fall, the same amount buys more units; when they rise, fewer. This naturally lowers your average cost per unit over time — a principle called Rupee Cost Averaging.",
                "The key difference from lumpsum investing is that each instalment compounds from a different start date. Your 12th month's SIP has only 11 months of compounding, while your first month's SIP compounds for the full year. Our calculator aggregates the future value of all these individual investments to show your total wealth created.",
            ],
            highlight: "₹10,000/month SIP for 20 years at 12% CAGR = Total invested: ₹24 lakhs | Wealth created: ₹99.9 lakhs. Compounding nearly quadruples your invested amount.",
        },
        faq: [
            { question: "What is the ideal SIP amount to invest?", answer: "A common rule of thumb is to invest at least 20-30% of your monthly take-home salary in SIPs. Ideally, increase your SIP by 10-15% every year (a Step-Up SIP) to offset lifestyle inflation and accelerate wealth creation." },
            { question: "Can I stop or modify my SIP midway?", answer: "Yes. SIPs are flexible — you can pause, reduce, increase, or stop them with no exit penalty in most funds. However, stopping a SIP early significantly impacts your final corpus due to losing years of compounding." },
        ],
    },
    "ppf": {
        subtitle: "Calculate the maturity amount of your Public Provident Fund (PPF) investment based on your annual contribution and remaining tenure.",
        explanation: {
            heading: "Understanding PPF Returns",
            paragraphs: [
                "PPF (Public Provident Fund) is a government-backed, guaranteed savings scheme with a lock-in period of 15 years (extendable in 5-year blocks). The current interest rate is 7.1% per annum, compounded annually. The minimum annual investment is ₹500, and the maximum is ₹1.5 lakhs per financial year.",
                "PPF enjoys EEE (Exempt-Exempt-Exempt) tax status — meaning contributions up to ₹1.5 lakhs per year qualify for Section 80C deduction, the interest earned is tax-free, and the maturity amount is also completely tax-free. This makes PPF one of the most tax-efficient long-term debt instruments in India.",
            ],
            highlight: "₹1.5 lakhs invested in PPF every year for 15 years at 7.1% compounds to approximately ₹40.68 lakhs — with zero tax on the entire corpus.",
        },
        faq: [
            { question: "Can I withdraw PPF before the 15-year maturity?", answer: "Partial withdrawals are permitted from the 7th year onwards (up to 50% of the balance at the end of the 4th year). Full premature closure is only allowed under specific conditions like life-threatening medical emergencies and higher education needs, with a 1% interest rate penalty." },
            { question: "Should I choose PPF over ELSS for tax saving?", answer: "PPF is risk-free and guarantees returns. ELSS carries equity market risk but has historically delivered 12-15% CAGR vs PPF's 7.1%. For long horizons (10+ years), ELSS typically creates significantly more wealth. PPF is ideal for risk-averse investors who prioritize capital safety." },
        ],
    },
    "fd": {
        subtitle: "Calculate exact maturity value and total interest on your Fixed Deposit across different compounding frequencies.",
        explanation: {
            heading: "How Fixed Deposit Interest is Calculated",
            paragraphs: [
                "Fixed Deposits (FDs) are time-bound deposits that earn a predetermined interest rate for the duration of the tenure. The interest can be compounded quarterly, half-yearly, or annually, depending on the bank. Quarterly compounding gives a slightly higher effective return than the nominal rate — this difference is measured by the Effective Annual Rate (EAR).",
                "The formula is: A = P × (1 + r/n)^(n×t), where P = principal, r = annual rate, n = compounding frequency, t = time in years. Tax-Saver FDs (with 5-year lock-in) qualify for Section 80C deduction up to ₹1.5 lakhs, but the interest earned is fully taxable at your income slab rate.",
            ],
            highlight: "₹2 lakhs in an FD at 7% for 5 years (quarterly compounding) grows to ₹2.83 lakhs — earning ₹83,000 in interest. TDS of 10% is deducted by the bank; actual post-tax return depends on your income slab.",
        },
        faq: [
            { question: "Is FD interest taxable in India?", answer: "Yes. FD interest is added to your total income and taxed at your applicable income tax slab rate. Banks deduct TDS at 10% if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). Form 15G/15H can be submitted to avoid TDS if your total income is below the taxable limit." },
            { question: "Which is currently better — FD or debt mutual fund?", answer: "After the 2023 tax change, debt mutual funds are taxed at income slab rate (same as FD). FD offers guaranteed returns with no market risk. Debt funds offer better flexibility, liquidity, and potentially higher post-expense returns. For 3+ year investments, some debt fund categories may offer marginal advantages in specific tax scenarios." },
        ],
    },
    "mf-returns": {
        subtitle: "See how a mutual fund investment grows over time and compare performance across short, medium, and long-term horizons.",
        explanation: {
            heading: "How Mutual Fund Returns Are Measured",
            paragraphs: [
                "Mutual fund returns are typically measured using CAGR (Compound Annual Growth Rate) for lumpsum investments and XIRR (Extended Internal Rate of Return) for SIPs, where cash flows occur at different points in time. CAGR shows the effective annual growth rate that represents the overall performance as if it were a steady year-over-year return.",
                "The absolute return is straightforward: ((Maturity Value - Invested Amount) / Invested Amount) × 100. But for comparing funds over different time periods, CAGR is more meaningful because it normalizes the time variable.",
            ],
            highlight: "A fund that doubled your money in 5 years delivered a 14.87% CAGR. A fund that tripled it in 8 years delivered a 14.65% CAGR — very similar! Time-adjusting returns reveals the true pace of wealth creation.",
        },
        faq: [
            { question: "What is a good CAGR for mutual funds in India?", answer: "Large-cap equity funds: 10–13% long-term CAGR is considered good. Mid-cap and small-cap funds: 14–18% over long periods, but with higher volatility. Debt funds: 6–8% CAGR. Any equity fund consistently delivering 15%+ CAGR over 10+ years is considered an exceptional performer." },
            { question: "What is the difference between absolute return and CAGR?", answer: "Absolute return measures total profit or loss without considering time. CAGR shows the annualized rate, making comparisons across different holding periods fair. A 50% absolute return over 10 years is only a 4.1% CAGR — well below inflation." },
        ],
    },
    "rd": {
        subtitle: "Calculate the maturity amount of your Recurring Deposit by entering monthly installment amount, interest rate, and tenure.",
        explanation: {
            heading: "How Recurring Deposit Interest is Calculated",
            paragraphs: [
                "A Recurring Deposit (RD) allows you to deposit a fixed amount every month for a predetermined period. Banks compound the interest quarterly, meaning each deposit earns interest from the date of deposit to the maturity date. The calculation is similar to summing the future value of multiple FDs of different durations.",
                "RD is essentially a disciplined savings tool for people who do not have a lumpsum to invest. At maturity, you receive the total principal plus accumulated interest. RD rates are similar to FD rates for the same tenure and are taxed the same way — as ordinary income at your slab rate.",
            ],
            highlight: "₹5,000/month RD for 3 years at 7% interest = Total invested: ₹1.8 lakhs | Maturity amount: ₹2.00 lakhs | Interest earned: ₹20,132",
        },
        faq: [
            { question: "Can I close an RD before maturity?", answer: "Yes, most banks allow premature closure of an RD, but with a penalty — typically 0.5% to 1% lower interest rate than the original contracted rate. Some banks also have a minimum lock-in period (often 3 months) before premature closure is permitted." },
            { question: "Is RD better than SIP for monthly savings?", answer: "RD offers guaranteed, risk-free returns, ideal for capital protection goals (home down payment in 2 years, emergency fund). SIP invests in market-linked mutual funds — higher potential returns over 5+ years but with market volatility. Choose based on your timeline and risk appetite." },
        ],
    },
    "nps": {
        subtitle: "Estimate your National Pension System (NPS) corpus at retirement and the monthly pension you can expect.",
        explanation: {
            heading: "Understanding NPS Returns and Pension Calculation",
            paragraphs: [
                "The National Pension System (NPS) is a government-regulated, long-term retirement savings scheme open to all Indian citizens between 18 and 60. You can choose your asset allocation across equity (Tier 1, up to 75%), corporate bonds, government bonds, and alternative assets. The returns are market-linked and vary based on your chosen mix.",
                "At retirement (age 60), you must use at least 40% of the corpus to purchase an annuity (which provides your monthly pension). The remaining 60% can be withdrawn as a lump sum — tax-free. The annuity amount depends on the annuity rate from the insurance company at the time of purchase.",
            ],
            highlight: "₹5,000/month NPS contribution from age 30 to 60 at an assumed 10% return = Final corpus of approximately ₹1.13 Crores. Using 40% for annuity at 5.5% annuity rate gives approximately ₹20,600/month pension.",
        },
        faq: [
            { question: "What are the tax benefits of NPS?", answer: "NPS contributions qualify for deduction under Section 80CCD(1) within the ₹1.5 lakh 80C limit, plus an additional ₹50,000 exclusively under Section 80CCD(1B). Employer contributions up to 10% of basic + DA are deductible under 80CCD(2). The 60% lump sum withdrawal at retirement is completely tax-free." },
            { question: "Can I withdraw from NPS before retirement?", answer: "Partial withdrawals (up to 25% of own contributions) are allowed after 3 years for specific purposes: higher education, marriage of children, purchase or construction of a home, or treatment of critical illness. Premature exit before 60 requires investing 80% of the corpus in an annuity." },
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
    }
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

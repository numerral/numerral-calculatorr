// Dynamic Hub — /business-calculators/[calculator]/
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BusinessCalculatorCore from "@/components/calculator/BusinessCalculatorCore";
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
    const calcs = getCalculatorsByCategory("business");
    return calcs.map((c) => ({ calculator: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("business").find((c) => c.slug === calculator);
    if (!calc) return {};
    return {
        title: calc.title,
        description: calc.description,
        keywords: calc.keywords ? calc.keywords.split(", ") : undefined,
        alternates: { canonical: canonicalUrl(`/business-calculators/${calc.slug}`) },
    };
}

const HUB_CONTENT: Record<string, {
    subtitle: string;
    explanation?: { heading: string; paragraphs: string[]; highlight: string };
    faq?: { question: string; answer: string }[];
    contentHTML?: string;
}> = {
    "enterprise-value-calculator": {
        subtitle: "Calculate the total economic value of a business by combining market capitalization, debt, and cash positions.",
        explanation: {
            heading: "What Is Enterprise Value and Why Does It Matter?",
            paragraphs: [
                "Enterprise Value (EV) is the most comprehensive measure of a company's total value. Unlike market capitalization — which only reflects the equity portion — EV tells you the theoretical takeover price: what an acquirer would pay for the entire business, including assuming all debts and receiving all cash on the balance sheet.",
                "The formula is: EV = Market Capitalization + Total Debt − Cash & Cash Equivalents. EV is used as the denominator in key valuation multiples like EV/EBITDA, EV/Revenue, and EV/EBIT. These multiples allow fair comparisons between companies with different capital structures — a company with heavy debt and one with no debt can be compared on equal footing.",
            ],
            highlight: "A company with $50M market cap, $20M debt, and $5M cash has an EV of $65M. If EBITDA is $10M, the EV/EBITDA multiple is 6.5× — generally considered attractive for a profitable, stable business.",
        },
        faq: [
            { question: "Why is Enterprise Value better than Market Cap for valuation?", answer: "Market cap only values the equity. Two companies with identical market caps can have vastly different EVs if one carries significant debt. EV captures the full picture — an acquirer must pay off existing debt (increasing cost) but also receives the company's cash (reducing cost). This makes EV multiples the standard for M&A and cross-company comparisons." },
            { question: "What is a good EV/EBITDA multiple?", answer: "It varies by industry. Tech companies typically trade at 15–25× EV/EBITDA, while manufacturing and utilities trade at 6–10×. A lower multiple relative to industry peers can signal undervaluation. Always compare within the same sector and consider growth rate, margin quality, and competitive moat." },
            { question: "Should I include minority interest and preferred stock in EV?", answer: "In a full EV calculation, yes. The complete formula is: EV = Market Cap + Total Debt + Minority Interest + Preferred Equity − Cash. However, for most practical purposes, the simplified version (Market Cap + Debt − Cash) captures 95%+ of the value and is what most investors use." },
        ],
    },
    "ebitda-calculator": {
        subtitle: "Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization — the most widely used measure of operating cash flow.",
        explanation: {
            heading: "Understanding EBITDA — The Universal Profitability Metric",
            paragraphs: [
                "EBITDA strips out financing decisions (interest), tax jurisdictions (taxes), and accounting choices (depreciation and amortization) to reveal a company's core operating profitability. This makes it the most commonly used metric for comparing companies across industries, capital structures, and geographies.",
                "The formula is: EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization. EBITDA margin (EBITDA ÷ Revenue × 100) benchmarks operating efficiency. Software companies often have 30–50% EBITDA margins, while retail operates at 5–15%. Higher margins indicate stronger pricing power and operational leverage.",
            ],
            highlight: "A company with $500K net income, $50K interest, $150K taxes, $80K depreciation, and $20K amortization has EBITDA of $800K. On $2M revenue, that is a 40% EBITDA margin — excellent by most standards.",
        },
        faq: [
            { question: "Is EBITDA the same as cash flow?", answer: "No. EBITDA is a proxy for operating cash flow, but it ignores working capital changes, capital expenditures, and other real cash outflows. Free Cash Flow (FCF) is more accurate for understanding actual cash generation. EBITDA can overstate a company's financial health if CapEx requirements are high." },
            { question: "Why do some investors dislike EBITDA?", answer: "Warren Buffett famously criticized EBITDA because it ignores capital expenditure — money a business must spend to maintain operations. A capital-intensive business with high EBITDA but massive CapEx may actually generate little free cash. Always pair EBITDA analysis with CapEx and working capital data." },
        ],
    },
    "ebit-calculator": {
        subtitle: "Calculate Earnings Before Interest and Taxes (Operating Income) — the profit a company generates from its core operations.",
        explanation: {
            heading: "EBIT: Measuring True Operating Performance",
            paragraphs: [
                "EBIT (Earnings Before Interest and Taxes) measures the profit generated by a company's core business operations, after accounting for the cost of goods sold and operating expenses — but before the effects of financing decisions (interest) and tax jurisdictions.",
                "Unlike EBITDA, EBIT includes depreciation and amortization, making it a more conservative measure. EBIT is particularly useful for comparing companies where depreciation represents a real economic cost — such as manufacturing, transportation, and capital-heavy industries. EBIT margin (EBIT ÷ Revenue) is a key indicator of operational efficiency.",
            ],
            highlight: "Revenue $2M − COGS $800K − Operating Expenses $500K = EBIT of $700K (35% EBIT margin). This company generates $0.35 of operating profit for every $1 of revenue — strong for most industries.",
        },
        faq: [
            { question: "When should I use EBIT vs EBITDA?", answer: "Use EBIT when depreciation is a meaningful economic cost (e.g., manufacturing, airlines, real estate). Use EBITDA when comparing companies with different CapEx profiles or when D&A reflects accounting choices rather than real cash costs. EBITDA is more common in private equity and M&A; EBIT is preferred in fundamental analysis." },
            { question: "What is a good EBIT margin?", answer: "EBIT margins vary widely by industry: Software/SaaS 20–40%, Financial Services 20–35%, Consumer Goods 10–20%, Retail 3–10%, Manufacturing 8–15%. Compare within the same industry for meaningful benchmarks." },
        ],
    },
    "wacc-calculator": {
        subtitle: "Calculate the Weighted Average Cost of Capital — the minimum return a company must earn to satisfy all capital providers.",
        explanation: {
            heading: "WACC: The Foundation of Discounted Cash Flow Valuation",
            paragraphs: [
                "WACC (Weighted Average Cost of Capital) represents the blended cost of financing a company's operations through both debt and equity. It is the discount rate used in Discounted Cash Flow (DCF) models — the most rigorous method for intrinsic valuation of businesses and projects.",
                "The formula is: WACC = (E/V × Re) + (D/V × Rd × (1−T)), where E = equity value, D = debt value, V = total value (E+D), Re = cost of equity, Rd = cost of debt, and T = corporate tax rate. The tax shield on debt (1−T factor) reflects that interest payments are tax-deductible, making debt inherently cheaper than equity on an after-tax basis.",
            ],
            highlight: "70% equity at 12% cost + 30% debt at 6% cost × (1 − 25% tax) = WACC of 9.75%. Any project returning above 9.75% creates value for shareholders; anything below destroys it.",
        },
        faq: [
            { question: "Why is WACC important for DCF valuation?", answer: "In a DCF model, future cash flows are discounted back to present value using WACC as the discount rate. A lower WACC increases the present value of future cash flows (higher valuation), and vice versa. Even a 1% change in WACC can swing a DCF valuation by 10–20% — making accurate WACC estimation critical." },
            { question: "How do I estimate cost of equity?", answer: "The most common method is the Capital Asset Pricing Model (CAPM): Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium. Use the 10-year government bond yield as the risk-free rate, the stock's beta for systematic risk, and a historical equity risk premium (typically 5–7% for developed markets)." },
        ],
    },
    "cap-rate-calculator": {
        subtitle: "Calculate the capitalization rate for real estate investments — the annual return you earn relative to the property's total value.",
        explanation: {
            heading: "Cap Rate: The Fundamental Real Estate Investment Metric",
            paragraphs: [
                "The Capitalization Rate (Cap Rate) is the single most important metric in commercial real estate investing. It expresses the property's annual net operating income (NOI) as a percentage of its current market value or purchase price. Cap Rate = NOI ÷ Property Value × 100.",
                "A higher cap rate indicates higher yield but often implies higher risk (e.g., secondary markets, older properties, shorter lease terms). Lower cap rates typically signal prime locations with stable, long-term tenants. Cap rates allow instant comparison between properties of different sizes, prices, and locations — normalizing everything to a yield percentage.",
            ],
            highlight: "$120K annual NOI on a $1.5M property = 8% Cap Rate. This means you earn 8 cents of net operating income for every dollar invested — before financing costs and taxes. The same NOI on a $2M property drops to 6% Cap Rate.",
        },
        faq: [
            { question: "What is a good cap rate for real estate?", answer: "Cap rates vary by location, property type, and market conditions. Class A urban office: 4–6%. Suburban retail: 6–8%. Industrial/warehouse: 5–7%. Multifamily residential: 4–7%. Rural/secondary market properties: 8–12%. Higher cap rates offer more income but often come with more risk and management intensity." },
            { question: "How is NOI different from rental income?", answer: "NOI = Gross Rental Income − Operating Expenses (property taxes, insurance, maintenance, management fees, vacancy losses). NOI does NOT deduct mortgage payments, income tax, or depreciation. It represents the property's operating profitability independent of how it's financed." },
        ],
    },
    "roi-calculator": {
        subtitle: "Calculate Return on Investment — the simplest and most universal metric for evaluating the profitability of any investment or business decision.",
        explanation: {
            heading: "ROI: The Universal Performance Measure",
            paragraphs: [
                "Return on Investment (ROI) measures the percentage gain or loss on an investment relative to its cost. The formula is: ROI = (Net Profit ÷ Investment Cost) × 100. A positive ROI means the investment generated more than it cost; a negative ROI means it lost money.",
                "ROI is universally applicable — it works for stocks, real estate, business projects, marketing campaigns, education, and any other capital allocation decision. The key limitation is that basic ROI does not account for the time dimension. A 50% ROI in 1 year is vastly better than 50% ROI over 10 years. For time-adjusted comparisons, use annualized ROI or CAGR.",
            ],
            highlight: "Invested $100K, returned $150K → ROI = 50%. But context matters: 50% in 6 months = exceptional (100% annualized). 50% over 5 years = 8.4% CAGR — merely average for equity markets.",
        },
        faq: [
            { question: "What is a good ROI?", answer: "It depends on the asset class and risk taken. Stock market average: 8–12% annually. Real estate: 8–15% (including appreciation). Business investments: 15–25%+ to compensate for higher risk and illiquidity. Risk-free (government bonds): 3–5%. Always compare ROI to the risk-free rate and relevant benchmarks." },
            { question: "How is ROI different from ROE?", answer: "ROI measures return on total investment cost. ROE (Return on Equity) measures return on shareholders' equity specifically. A company can have high ROE by using debt leverage while having modest ROI on total capital. ROE is more relevant for stock investors; ROI is broader and applies to any investment." },
        ],
    },
    "cost-of-equity-calculator": {
        subtitle: "Calculate the Cost of Equity using the Capital Asset Pricing Model (CAPM) — the return equity investors require to compensate for risk.",
        explanation: {
            heading: "Cost of Equity: What Shareholders Demand",
            paragraphs: [
                "The Cost of Equity represents the minimum annual return that equity investors expect for bearing the risk of owning a company's stock. It is a critical input for WACC calculation and DCF valuation. Unlike debt, equity has no contractual interest rate — the 'cost' is implicit, based on market expectations.",
                "The most widely used model is CAPM: Cost of Equity = Risk-Free Rate + Beta × (Expected Market Return − Risk-Free Rate). The risk-free rate is typically the 10-year government bond yield. Beta measures the stock's sensitivity to market movements. The equity risk premium (Rm − Rf) represents the extra return investors demand for holding stocks over risk-free bonds.",
            ],
            highlight: "Risk-Free Rate 4.5% + Beta 1.2 × (Market Return 10% − 4.5%) = Cost of Equity of 11.1%. This stock must earn at least 11.1% annually to satisfy investors — anything less means the stock is likely overvalued.",
        },
        faq: [
            { question: "Where do I find a company's beta?", answer: "Financial data providers (Yahoo Finance, Bloomberg, Reuters) publish beta for publicly traded stocks. Beta is calculated by regressing the stock's historical returns against market returns (usually over 2–5 years of monthly data). A beta of 1.0 means the stock moves in line with the market; above 1.0 indicates higher volatility." },
            { question: "What equity risk premium should I use?", answer: "The historical equity risk premium for developed markets like the US is approximately 5–7%. For emerging markets, add a country risk premium (2–6% depending on political and economic stability). Professor Aswath Damodaran publishes regularly updated equity risk premiums by country — widely regarded as the gold standard." },
        ],
    },
    "roas-calculator": {
        subtitle: "Calculate Return on Ad Spend — how much revenue your advertising generates for every dollar invested in marketing.",
        explanation: {
            heading: "ROAS: Measuring Advertising Efficiency",
            paragraphs: [
                "ROAS (Return on Ad Spend) is the fundamental metric for evaluating advertising performance. It answers one critical question: for every dollar spent on advertising, how many dollars of revenue does it generate? ROAS = Revenue from Ads ÷ Ad Spend.",
                "A ROAS of 5× means every $1 in ad spend generates $5 in revenue. However, ROAS alone doesn't tell you if you're profitable — you must also consider product costs, fulfillment, and overhead. A 5× ROAS with 60% gross margins yields $3 in gross profit per $1 spent — healthy. The same 5× ROAS with 20% margins yields only $1 — barely breaking even.",
            ],
            highlight: "$50K revenue from $10K ad spend = 5× ROAS. After 50% gross margin, your actual profit from ads is $15K — a 150% return on your marketing investment.",
        },
        faq: [
            { question: "What ROAS should I target?", answer: "Minimum viable ROAS depends on your margins. If gross margin is 70%, you need at least 1.4× ROAS to break even. For 40% margins, you need 2.5×. Most e-commerce businesses target 4–8× ROAS for profitability. SaaS companies may accept lower ROAS (2–4×) because customer lifetime value (LTV) exceeds the initial acquisition cost." },
            { question: "How is ROAS different from ROI?", answer: "ROAS measures revenue generated per ad dollar — it's a top-line metric. ROI measures profit generated per investment dollar — it's a bottom-line metric. A 5× ROAS doesn't mean 400% ROI, because ROAS doesn't account for product costs, fulfillment, or overhead. Always calculate true ROI alongside ROAS for complete marketing performance evaluation." },
        ],
    },
    "beta-calculator": {
        subtitle: "Calculate stock beta — a measure of how much a stock's price moves relative to the overall market, indicating its systematic risk.",
        explanation: {
            heading: "Understanding Beta: Systematic Risk in Portfolio Theory",
            paragraphs: [
                "Beta (β) measures a stock's sensitivity to market movements. A beta of 1.0 means the stock moves in lockstep with the market. A beta of 1.5 means the stock is 50% more volatile — when the market rises 10%, the stock tends to rise 15%, and when the market falls 10%, the stock tends to fall 15%.",
                "Beta is a cornerstone of Modern Portfolio Theory and the Capital Asset Pricing Model (CAPM). It captures systematic risk — the portion of a stock's risk that cannot be diversified away. Low-beta stocks (utilities, consumer staples) provide stability; high-beta stocks (tech, biotech) offer higher potential returns with greater risk.",
            ],
            highlight: "Stock return 15% when market returned 10% → Implied Beta = 1.5. This stock amplifies market moves by 50%. In a bull market, this is rewarding; in a bear market, losses are magnified equally.",
        },
        faq: [
            { question: "What is a good beta for a stock?", answer: "It depends on your risk tolerance and investment strategy. Defensive investors prefer β < 1.0 (lower volatility). Growth investors accept β > 1.0 for higher return potential. β = 0 means the asset is uncorrelated with the market (e.g., some commodities, cash). Negative beta (very rare) means the asset moves inversely to the market." },
            { question: "Can beta change over time?", answer: "Yes. Beta is estimated from historical data and can shift as a company's business model, leverage, or market environment changes. A startup transitioning to profitability may see its beta decrease. A company taking on significant debt may see its equity beta increase (levered beta effect)." },
        ],
    },
    "cash-back-calculator": {
        subtitle: "Calculate the cash back rewards on any purchase — see how much you save and your effective price after rebates.",
        explanation: {
            heading: "Maximizing Cash Back Rewards",
            paragraphs: [
                "Cash back is a straightforward savings mechanism: a percentage of your purchase amount is returned to you as a rebate. Credit card programs, retailer loyalty schemes, and cashback apps offer rewards ranging from 1% to 10%+ depending on the category and program.",
                "The effective cost of any purchase = Original Price × (1 − Cash Back Rate/100). Over a year, disciplined cash back usage on everyday spending can add up to hundreds or thousands of dollars in savings — essentially a permanent discount on everything you buy.",
            ],
            highlight: "$5,000 purchase with 5% cash back = $250 returned, effective cost $4,750. Over $50,000 annual spending at an average 3% cash back rate, you save $1,500/year — free money from purchases you'd make anyway.",
        },
        faq: [
            { question: "How do I maximize cash back rewards?", answer: "Use category-specific cards (5% on groceries, gas, dining). Stack credit card cash back with retailer loyalty programs and cashback apps (Rakuten, Ibotta). Pay the full balance monthly to avoid interest charges that would exceed rewards. Some premium cards offer 2–3% flat cash back on all spending." },
            { question: "Is cash back taxable?", answer: "In the United States, cash back from credit card purchases is generally considered a discount or rebate, not taxable income. However, cash back from bank account sign-up bonuses or referral programs may be considered taxable income. Consult a tax professional for your specific situation." },
        ],
    },
    "current-ratio-calculator": {
        subtitle: "Calculate the current ratio — the most widely used measure of a company's ability to pay short-term obligations with short-term assets.",
        explanation: {
            heading: "Current Ratio: Assessing Short-Term Financial Health",
            paragraphs: [
                "The Current Ratio is a liquidity metric that measures whether a company has enough short-term assets (cash, receivables, inventory) to cover its short-term liabilities (accounts payable, short-term debt, accrued expenses). Current Ratio = Current Assets ÷ Current Liabilities.",
                "A ratio above 1.0 means the company can cover all current obligations; below 1.0 signals potential liquidity problems. However, an extremely high current ratio (above 3×) may indicate the company is not efficiently deploying its assets — excess cash sitting idle instead of being reinvested for growth.",
            ],
            highlight: "$500K current assets ÷ $300K current liabilities = 1.67× current ratio. This business comfortably covers its short-term obligations with 67% surplus working capital — healthy and sustainable.",
        },
        faq: [
            { question: "What is a healthy current ratio?", answer: "Generally, 1.5× to 3× is considered healthy. Below 1.0 is a red flag (potential insolvency risk). Between 1.0 and 1.5 is adequate but tight. Above 3× may signal inefficiency. However, optimal ratios vary by industry — retail and fast-food companies often operate successfully at 0.8–1.2× due to fast inventory turnover." },
            { question: "What is the difference between current ratio and quick ratio?", answer: "The quick ratio (acid-test ratio) excludes inventory from current assets: Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities. It is a stricter measure of liquidity because inventory may not be quickly convertible to cash. A company with a 2.0× current ratio but a 0.5× quick ratio has most of its current assets tied up in inventory." },
        ],
    },
    "net-worth-calculator": {
        subtitle: "Calculate personal or business net worth — the difference between total assets owned and total liabilities owed.",
        explanation: {
            heading: "Net Worth: The True Measure of Financial Position",
            paragraphs: [
                "Net worth is the most fundamental financial metric for both individuals and businesses. It answers a simple question: if you sold everything you owned and paid off every debt, what would be left? Net Worth = Total Assets − Total Liabilities.",
                "For individuals, assets include savings accounts, investments, real estate equity, retirement accounts, and valuable property. Liabilities include mortgages, student loans, car loans, credit card debt, and any other obligations. Tracking net worth over time is the single best way to measure financial progress — more meaningful than income alone.",
            ],
            highlight: "$5M in assets − $2M in liabilities = $3M net worth with a 40% debt-to-asset ratio. Reducing debt by $500K or growing assets by $500K both increase net worth equally — but reducing high-interest debt often provides the higher risk-adjusted return.",
        },
        faq: [
            { question: "What is a good net worth by age?", answer: "A common rule of thumb: your net worth should equal your annual income × (age ÷ 10). A 30-year-old earning $60K should target $180K; a 40-year-old earning $100K should target $400K. These are guidelines — actual targets depend on career stage, lifestyle, and financial goals." },
            { question: "Should I include my home in net worth?", answer: "Yes, but be realistic about the value (use current market value, not purchase price or aspirational value) and subtract the outstanding mortgage balance. Some financial planners calculate both 'total net worth' (including home) and 'investable net worth' (excluding primary residence) for a clearer picture of liquid wealth." },
        ],
    },
    "opportunity-cost-calculator": {
        subtitle: "Calculate the opportunity cost of choosing one option over another — the value of the next-best alternative you give up.",
        explanation: {
            heading: "Opportunity Cost: The Economics of Every Decision",
            paragraphs: [
                "Opportunity cost is one of the most powerful concepts in economics and finance. Every decision has a cost — not just the money you spend, but the return you forgo by not choosing the next-best alternative. Opportunity Cost = Return on Best Alternative − Return on Chosen Option.",
                "This concept applies everywhere: investing in stocks vs. bonds, spending money vs. saving it, choosing one career over another, or allocating marketing budget to Channel A vs. Channel B. The most successful investors and business leaders consistently think in terms of opportunity cost — not just 'is this a good investment?' but 'is this the BEST use of my capital?'",
            ],
            highlight: "Choosing an 8% return when a 12% alternative exists = 4% opportunity cost. On a $1M investment, that's $40,000/year — the invisible price of a suboptimal decision.",
        },
        faq: [
            { question: "How does opportunity cost apply to personal finance?", answer: "Every dollar you spend has an opportunity cost: the returns it could have earned if invested. $5 daily coffee × 365 days = $1,825/year. Invested at 10% for 20 years, that becomes approximately $115,000. Opportunity cost helps you evaluate spending decisions not just by their price, but by their long-term wealth impact." },
            { question: "Can opportunity cost be zero?", answer: "Only if you've chosen the absolute best available option — there is no better alternative. In practice, this is rare because information is imperfect and alternatives are numerous. The goal isn't to eliminate opportunity cost entirely, but to minimize it by systematically evaluating alternatives before committing capital." },
        ],
    },
};

export default async function BusinessCalculatorHubPage({ params }: PageProps) {
    const { calculator } = await params;
    const calc = getCalculatorsByCategory("business").find((c) => c.slug === calculator);
    if (!calc) return notFound();

    const content = HUB_CONTENT[calc.id] ?? HUB_CONTENT[calc.slug];

    const pageUrl = canonicalUrl(`/business-calculators/${calc.slug}`);
    const schemaData = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Business Calculators", url: canonicalUrl("/business-calculators") },
            { name: calc.title },
        ]),
        webAppSchema(calc.title, pageUrl),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-business-calc"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schemaData }}
            />

            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Business Calculators", href: "/business-calculators" },
                    { label: calc.title.replace(" Calculator", "").replace(" (CAPM)", "") },
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
                    <BusinessCalculatorCore calcType={calc.calcType || "roi"} />

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

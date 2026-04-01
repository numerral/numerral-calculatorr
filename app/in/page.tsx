// India Hub Page — /in/
// Premium hub with India-themed styling

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";
import { buildCountryAlternates } from "@/lib/geo-seo";
import "../ksa/ksa.css";
import "./in.css";

export const metadata: Metadata = {
    title: "India Calculators — Free Financial & Utility Tools for India",
    description: "Free India-specific calculators: Fuel Cost, EMI, GST, HRA, Tax, and more. Accurate, step-by-step, based on Indian tax laws, RBI guidelines, and government regulations.",
    alternates: {
        canonical: canonicalUrl("/in"),
        languages: {
            "en-SA": "https://www.numerral.com/ksa",
            "en-AE": "https://www.numerral.com/uae",
            "en-IN": "https://www.numerral.com/in",
            "x-default": "https://www.numerral.com/in",
        }
    },
};

const IN_CALCULATORS = [
    {
        title: "Home Loan EMI Calculator",
        slug: "home-loan-calculator",
        icon: "🏠",
        tag: "Finance & Loans",
        description: "Calculate monthly EMI, total interest, and amortization schedule. Check loan eligibility, prepayment savings, and compare SBI, HDFC, ICICI interest rates.",
    },
    {
        title: "Personal Loan EMI Calculator",
        slug: "personal-loan-calculator",
        icon: "💳",
        tag: "Finance & Loans",
        description: "Calculate personal loan EMI, check eligibility, compare bank rates, and see how prepayment saves money. CIBIL score guide and RBI prepayment rules included.",
    },
    {
        title: "Car Loan EMI Calculator",
        slug: "car-loan-calculator",
        icon: "🚗",
        tag: "Finance & Loans",
        description: "Calculate car loan EMI with down payment, compare new vs used car rates, check eligibility, and see prepayment savings. 10 bank rates, CIBIL guide, and popular car examples.",
    },
    {
        title: "Fuel Cost Calculator",
        slug: "fuel-cost-calculator",
        icon: "⛽",
        tag: "Auto & Travel",
        description: "Calculate petrol, diesel, and CNG costs for daily commutes and road trips. City-wise fuel prices, mileage data for 20+ popular cars, and cost comparison.",
    },
    {
        title: "Age Calculator",
        slug: "age-calculator",
        icon: "🎂",
        tag: "Everyday Tools",
        description: "Calculate exact age in years, months, days. Track India legal milestones — voting, driving, marriage, senior citizen, retirement. Compare ages and birthday countdown.",
    },
    {
        title: "PPF Calculator",
        slug: "ppf-calculator",
        icon: "📊",
        tag: "Savings & Tax",
        description: "Calculate PPF maturity amount at 7.1% interest rate. Compare deposit timing strategies, plan 5-year extensions, and understand Section 80C tax benefits with EEE status.",
    },
    {
        title: "BMI Calculator",
        slug: "bmi-calculator",
        icon: "🏋️",
        tag: "Health & Wellness",
        description: "Calculate BMI with Asian-Indian cutoffs (Overweight ≥23, Obese ≥25). Dual WHO vs Indian categories, ideal weight range, and waist-to-height ratio for abdominal obesity check.",
    },
    {
        title: "SIP Calculator",
        slug: "sip-calculator",
        icon: "📈",
        tag: "Investment & Wealth",
        description: "Calculate mutual fund SIP returns with step-up comparison, lumpsum, goal planning & inflation-adjusted modes. Includes 2026 LTCG/STCG tax guide, SEBI categories, ELSS tax saving guide, Direct vs Regular comparison, and SIP vs PPF vs FD.",
    },
    {
        title: "Human Life Value (HLV) Calculator",
        slug: "hlv-calculator",
        icon: "🛡️",
        tag: "Insurance & Protection",
        description: "Calculate required life insurance cover using Income Replacement, Need-Based, and Quick Estimate methods. Includes IRDAI FY25 data, MWP Act guide, age-based multiplier table, term vs ULIP comparison, and Section 80C tax benefits.",
    },
    {
        title: "Compound Interest Calculator",
        slug: "compound-interest-calculator",
        icon: "📊",
        tag: "Savings & Investment",
        description: "Calculate compound interest with 4 modes: Lump Sum, Recurring SIP, FD Comparison (SBI/HDFC/ICICI/PPF/NSC/SCSS rates), and Cost of Delay. Includes compounding frequency selector, Rule of 72, CI vs SI table, and Section 80C tax guide.",
    },
    {
        title: "Pension Calculator",
        slug: "pension-calculator",
        icon: "🏦",
        tag: "Retirement & Pension",
        description: "Plan your retirement with 4 modes: Retirement Corpus Planner, NPS Calculator (80CCD tax benefits), EPS/EPFO Pension (formula with early/deferred), and Annuity Income Estimator. NPS vs EPF vs PPF, OPS vs NPS, and healthcare cost planning.",
    },
    {
        title: "Income Tax Calculator",
        slug: "income-tax-calculator",
        icon: "🧾",
        tag: "Tax & Filing",
        description: "Calculate income tax for FY 2025-26 with 3 modes: New Regime (Budget 2025, ₹12L tax-free), Old Regime (80C/80D/HRA/24b), and side-by-side Regime Comparison. Includes slab breakdown, surcharge, 87A rebate, advance tax dates, and ITR form guide.",
    },
    {
        title: "Crorepati Calculator",
        slug: "crorepati-calculator",
        icon: "💰",
        tag: "Wealth Creation",
        description: "Plan your path to ₹1 Crore+ with 4 modes: Goal Planner (SIP + Lump Sum with inflation toggle), Step-Up SIP (annual increase projection), Cost of Delay (impact of starting late), and Milestone Tracker (₹25L to ₹10Cr timeline). Includes Rule of 72, investment comparison, and tax guide.",
    },
    {
        title: "Lumpsum Calculator",
        slug: "lumpsum-calculator",
        icon: "📊",
        tag: "Investment",
        description: "Calculate one-time mutual fund investment returns with 4 modes: Returns Estimator (compounding frequency, inflation & LTCG tax toggles), Lump Sum vs SIP comparison, STP Strategy Planner (Liquid→Equity), and Goal-Based Reverse Calculator. Covers CAGR, return types, and asset comparison.",
    },
    {
        title: "SSY Calculator",
        slug: "sukanya-samriddhi-yojana-calculator",
        icon: "🎀",
        tag: "Girl Child Savings",
        description: "Sukanya Samriddhi Yojana Calculator with 4 modes: Maturity Estimator (21-year growth schedule, inflation toggle), Partial Withdrawal Simulator (50% at 18), SSY vs PPF vs FD comparison, and Goal-Based Reverse. Current rate 8.2%, EEE tax-free, Section 80C.",
    },
    {
        title: "SWP Calculator",
        slug: "swp-calculator",
        icon: "💸",
        tag: "Retirement Income",
        description: "Systematic Withdrawal Plan Calculator with 4 modes: Withdrawal Planner (month-by-month depletion, inflation toggle), SWP vs FD Income comparison, Corpus Required reverse calculator, and Safe Withdrawal Rate Finder (India-adapted 2.5-3.5% SWR).",
    },
    {
        title: "XIRR Calculator",
        slug: "xirr-calculator",
        icon: "📊",
        tag: "Investment Analytics",
        description: "XIRR Calculator with 4 modes: True XIRR (custom date + amount rows, Newton-Raphson solver), SIP XIRR Quick (vs CAGR), XIRR vs CAGR vs Absolute Return comparison, and What-If Analyser (target XIRR reverse solver).",
    },
    {
        title: "FIDE Rating Calculator",
        slug: "fide-rating-calculator",
        icon: "♟️",
        tag: "Chess",
        description: "FIDE Elo Rating Calculator with 4 modes: Elo Calculator (multi-game tournament, K-factor 10/20/40, round-by-round breakdown), Performance Rating (TPR), Title Progress Tracker (GM/IM/FM/CM), and Win Probability (expected score table).",
    },
    {
        title: "Body Fat Calculator",
        slug: "body-fat-calculator",
        icon: "📏",
        tag: "Health & Fitness",
        description: "Body Fat Calculator with 4 modes: US Navy Method (gender-aware, neck/waist/hip), BMI-Based Estimate (Deurenberg formula), Body Fat Category Reference (age-wise tables), and Lean Body Mass Target Weight Planner.",
    },
    {
        title: "Fixed Deposit (FD) Calculator",
        slug: "fd-calculator",
        icon: "🏦",
        tag: "Savings & Investment",
        description: "FD interest calculator with 4 modes: Maturity Calculator (cumulative/non-cumulative, year-by-year breakdown), Bank Rate Comparison (SBI/HDFC/ICICI/Axis/BOB + 7 more), TDS & Tax Impact (Form 15G/15H, post-tax return), and FD vs PPF/SCSS/MF comparison.",
    },
    {
        title: "Position Size Calculator",
        slug: "position-size-calculator",
        icon: "📊",
        tag: "Trading & Risk",
        description: "Calculate optimal trade size with 4 modes: Basic Position Sizer (% risk model with STT/GST cost toggle), F&O Lot Calculator (NSE 2026 lot sizes for Nifty, Bank Nifty, FinNifty), Risk-Reward Analyser, and Kelly Criterion. Includes loss recovery table and SEBI regulations.",
    },

    // ─── Salary & Payroll (India-specific) ───
    {
        title: "Salary After Tax Calculator",
        slug: "salary-after-tax-calculator",
        icon: "💰",
        tag: "Salary & Payroll",
        description: "Calculate net take-home salary after income tax, EPF, professional tax for FY 2025-26. Old vs New Regime comparison, CTC breakdown, and monthly in-hand calculation.",
    },
    {
        title: "In-Hand Salary Calculator",
        slug: "in-hand-salary-calculator",
        icon: "🏧",
        tag: "Salary & Payroll",
        description: "Find your exact monthly bank credit. Detailed CTC to in-hand breakdown with EPF, professional tax, TDS deductions under Old and New Regime.",
    },
    {
        title: "CTC to Take Home Calculator",
        slug: "ctc-to-take-home-calculator",
        icon: "📋",
        tag: "Salary & Payroll",
        description: "Deconstruct your CTC package — see how much goes to EPF, gratuity, taxes, and your actual take-home pay. Compare job offers and plan your budget.",
    },
    {
        title: "HRA Calculator",
        slug: "hra-calculator",
        icon: "🏠",
        tag: "Salary & Tax",
        description: "Calculate HRA tax exemption under Section 10(13A). 3-rule system for metro vs non-metro, rent-to-parents strategy, and Old vs New Regime impact.",
    },
    {
        title: "Gratuity Calculator",
        slug: "gratuity-calculator",
        icon: "🎖️",
        tag: "Salary & Benefits",
        description: "Estimate gratuity payout under the Payment of Gratuity Act, 1972. 15/26 formula, 5-year eligibility, and tax exemption up to ₹25 Lakhs.",
    },
    {
        title: "Bonus Calculator",
        slug: "bonus-calculator",
        icon: "🎁",
        tag: "Salary & Benefits",
        description: "Calculate statutory bonus under the Payment of Bonus Act, 1965. Eligibility check, ₹7,000 salary cap, 8.33% minimum to 20% maximum calculation.",
    },

    // ─── Tax (India-specific) ───
    {
        title: "GST Calculator",
        slug: "gst-calculator",
        icon: "🧾",
        tag: "Tax & Compliance",
        description: "Calculate GST for all slab rates — 5%, 12%, 18%, 28%. Add or remove GST, reverse calculation, and HSN code reference for Indian goods and services.",
    },
    {
        title: "HRA Exemption Calculator",
        slug: "hra-exemption-calculator",
        icon: "🏘️",
        tag: "Tax & Deductions",
        description: "Calculate HRA exemption under Section 10(13A) of the Income Tax Act. Three-rule formula, metro vs non-metro classification, and annual tax savings.",
    },
    {
        title: "TDS Calculator",
        slug: "tds-calculator",
        icon: "📑",
        tag: "Tax & Compliance",
        description: "Calculate TDS deductions on salary, interest, rent, professional fees. Section-wise breakdowns with Form 16, 16A, 26AS reference and TDS return deadlines.",
    },
    {
        title: "Capital Gains Tax Calculator",
        slug: "capital-gains-tax-calculator",
        icon: "📈",
        tag: "Tax & Investment",
        description: "Calculate LTCG and STCG tax on equity, mutual funds, property, and gold. Includes indexation benefit, Section 54 exemptions, and FY 2025-26 rates.",
    },
    {
        title: "Professional Tax Calculator",
        slug: "professional-tax-calculator",
        icon: "🏛️",
        tag: "Tax & Compliance",
        description: "Calculate state-wise professional tax deductions across Maharashtra, Karnataka, West Bengal, Telangana, and more. Monthly and annual breakdown with slab rates.",
    },

    // ─── Investment (India-specific) ───
    {
        title: "RD Calculator",
        slug: "rd-calculator",
        icon: "🏦",
        tag: "Savings & Investment",
        description: "Calculate Recurring Deposit maturity amount. Compare RD rates across SBI, HDFC, ICICI, and Post Office. Quarterly compounding with TDS impact and premature withdrawal rules.",
    },
    {
        title: "NPS Calculator",
        slug: "nps-calculator",
        icon: "🏛️",
        tag: "Retirement & Pension",
        description: "NPS Calculator with 4 modes: Corpus & Pension Estimator (Active/Auto Choice LC75/LC50/LC25), 80CCD Tax Benefit Calculator (Old vs New Regime), NPS vs PPF vs ELSS vs MF comparison, and Annuity Planner. Covers 2026 withdrawal rules (80:20), employer 80CCD(2), Tier I vs II, and PFM comparison.",
    },
    {
        title: "Professional Tax Calculator",
        slug: "professional-tax-calculator",
        icon: "🏛️",
        tag: "Salary & Tax",
        description: "Professional Tax Calculator with 4 modes: State-wise PT Calculator (18 states with slab tables, Maharashtra gender exemption), Annual PT & Section 16(iii) Tax Impact, Cross-State PT Comparison, and Employer PTRC/PTEC Compliance Dashboard. Covers Article 276 ₹2,500 cap, February adjustment, exemptions, penalties, and self-employed PT registration.",
    },
    {
        title: "Capital Gains Tax Calculator",
        slug: "capital-gains-tax-calculator",
        icon: "📈",
        tag: "Investment & Tax",
        description: "Capital Gains Tax Calculator with 4 modes: CG Tax Calculator (9 asset types — equity, MF, property, gold, crypto, bonds), Asset Tax Comparison, Section 54/54EC/54F Exemption Planner, and Tax Loss Harvesting Optimiser. Post-Budget 2024 rules: 12.5% LTCG, 20% STCG equity, indexation removal, ₹1.25L exemption, grandfathering, CII table, and 30% VDA flat tax.",
    },
    {
        title: "TDS Calculator",
        slug: "tds-calculator",
        icon: "📋",
        tag: "Tax & Compliance",
        description: "TDS Calculator with 4 modes: Section-wise TDS Calculator (23+ sections including 194A, 194C, 194H, 194I, 194IA, 194J, 194S, 194T with PAN/No-PAN impact), Complete Rate Chart with filters, Penalty & Interest Calculator (Sec 201/234E/271H), and Filing Calendar with Form 24Q/26Q/27Q due dates. Covers FY 2025-26 rates and new Section 194T for partner payments.",
    },
    {
        title: "GST Calculator",
        slug: "gst-calculator",
        icon: "🧾",
        tag: "Tax & Compliance",
        description: "GST Calculator with 4 modes: Add/Remove GST (exclusive & inclusive) with CGST+SGST vs IGST split across all 8 slabs, Category-wise Rate Chart with HSN/SAC codes for 30+ items, ITC Calculator with blocked credit (Sec 17(5)) and net cash liability, and Return Calendar (GSTR-1/3B/9/CMP-08 with QRMP scheme). Covers GST 2.0 reforms, 40% sin goods rate, and compensation cess abolition.",
    },
    {
        title: "HRA Exemption Calculator",
        slug: "hra-exemption-calculator",
        icon: "🏠",
        tag: "Tax & Compliance",
        description: "HRA Exemption Calculator with 4 modes: HRA Exemption (3-rule formula under Section 10(13A) — Actual HRA, 50/40% of Basic+DA, Rent−10% of Salary), Old vs New Regime comparison, Rent to Parents strategy with net family savings, and Rent Optimiser. Covers 8 metro cities, landlord PAN rules, Form 12BB, Section 80GG for non-HRA recipients.",
    },
    {
        title: "Mutual Fund Returns Calculator",
        slug: "mutual-fund-returns-calculator",
        icon: "📊",
        tag: "Investment & Wealth",
        description: "Mutual Fund Returns Calculator with 4 modes: Returns Calculator (Lump Sum + SIP with inflation & exit load), Lump Sum vs SIP vs STP comparison, LTCG/STCG Tax Impact Analyser by SEBI category, and Goal Reverse Planner. Covers CAGR, XIRR, direct vs regular expense ratio, and 2026 tax rules.",
    },
    {
        title: "Retirement Corpus Calculator",
        slug: "retirement-corpus-calculator",
        icon: "🛡️",
        tag: "Retirement Planning",
        description: "Retirement Corpus Calculator with 4 modes: Corpus Needed (healthcare inflation 14% modelling), NPS+EPF+PPF pension stack, Post-Retirement Income Planner (SCSS 8.2%, SWP, bucket strategy), and Readiness Score. Covers Section 80C/80CCD tax benefits, EPS-95 pension formula, city-wise expense benchmarks, and SWP vs annuity comparison.",
    },
    {
        title: "FIRE Calculator",
        slug: "fire-calculator",
        icon: "🔥",
        tag: "Financial Independence",
        description: "FIRE Calculator with 4 modes: FIRE Number (Lean/Standard/Fat with India-adapted 3.5% SWR), Coast FIRE, Barista FIRE, and Readiness Scorecard. Includes SIP bridge calculator, city-wise FIRE targets, bucket withdrawal strategy, NPS/EPF/PPF stack, and healthcare cost planning.",
    },

    // ─── Loans (India-specific) ───
    {
        title: "Education Loan Calculator",
        slug: "education-loan-calculator",
        icon: "🎓",
        tag: "Finance & Loans",
        description: "Education Loan EMI Calculator with 4 modes: EMI with Moratorium Impact, Loan Eligibility, Section 80E Tax Benefit Calculator, and India vs Abroad Cost Comparison. 7-bank rate comparison (SBI, BoB, PNB, Canara, Axis, ICICI, HDFC Credila), PM-Vidyalakshmi & CSIS subsidy guide, collateral rules, and course-wise EMI examples.",
    },
    {
        title: "Bike Loan Calculator",
        slug: "bike-loan-calculator",
        icon: "🏍️",
        tag: "Finance & Loans",
        description: "Calculate two-wheeler loan EMI with 4 modes: EMI Calculator (model presets), Loan Eligibility, Prepayment Impact, and Bank vs NBFC comparison. 12+ lender rates (SBI, HDFC, Bajaj Finance, TVS Credit), model-wise EMI (Activa to RE Classic), PM E-DRIVE EV subsidy guide, RBI 2025 prepayment rules, and insurance guide.",
    },
    {
        title: "Business Loan Calculator",
        slug: "business-loan-calculator",
        icon: "🏢",
        tag: "Finance & Loans",
        description: "Calculate business loan EMI with 4 modes: EMI Calculator (with tax benefit), Loan Eligibility, Prepayment Impact (with tax analysis), and Secured vs Unsecured comparison. 13+ lender rates (SBI, HDFC, Bajaj Finserv, Lendingkart), Mudra PMMY, CGTMSE ₹10Cr guide, PMEGP subsidy, RBI April 2026 ₹20L collateral-free mandate, and Section 36(1)(iii) tax deduction.",
    },
    {
        title: "Loan Eligibility Calculator",
        slug: "loan-eligibility-calculator",
        icon: "✅",
        tag: "Finance & Loans",
        description: "Check your loan eligibility based on income, CIBIL score, existing EMIs, and age. Covers home loan, personal loan, and car loan with bank-specific criteria.",
    },
];
export default function IndiaPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "India Calculators" },
            ]} />

            <div className="in-hero">
                <div className="in-hero__flag">🇮🇳</div>
                <h1 className="in-hero__title">India Calculators</h1>
                <p className="in-hero__subtitle">
                    Free calculators designed for India — based on Indian tax laws, RBI guidelines, IRDAI regulations, and government policies. All calculations in ₹ INR.
                </p>
                <div className="in-hero__stats">
                    <div className="in-hero__stat">
                        <span className="in-hero__stat-num">{IN_CALCULATORS.length}</span>
                        <span className="in-hero__stat-label">Calculators</span>
                    </div>
                    <div className="in-hero__stat">
                        <span className="in-hero__stat-num">200+</span>
                        <span className="in-hero__stat-label">FAQs</span>
                    </div>
                    <div className="in-hero__stat">
                        <span className="in-hero__stat-num">100%</span>
                        <span className="in-hero__stat-label">Free</span>
                    </div>
                </div>
            </div>

            <div className="in-grid">
                {IN_CALCULATORS.map((calc) => (
                    <Link key={calc.slug} href={`/in/${calc.slug}`} className="in-card">
                        <div className="in-card__icon">{calc.icon}</div>
                        <div className="in-card__body">
                            <div className="in-card__tag">{calc.tag}</div>
                            <h2 className="in-card__title">{calc.title}</h2>
                            <p className="in-card__desc">{calc.description}</p>
                        </div>
                        <div className="in-card__arrow">→</div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

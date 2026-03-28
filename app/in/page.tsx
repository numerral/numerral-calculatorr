// India Hub Page — /in/
// Premium hub with India-themed styling

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";
import "../ksa/ksa.css";
import "./in.css";

export const metadata: Metadata = {
    title: "India Calculators — Free Financial & Utility Tools for India",
    description: "Free India-specific calculators: Fuel Cost, EMI, GST, HRA, Tax, and more. Accurate, step-by-step, based on Indian tax laws, RBI guidelines, and government regulations.",
    alternates: { canonical: canonicalUrl("/in") },
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
        description: "Calculate mutual fund SIP returns with step-up comparison, lumpsum, goal planning & inflation-adjusted modes. Includes 2026 LTCG/STCG tax guide, SEBI categories, and ELSS vs PPF vs FD comparison.",
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
                        <span className="in-hero__stat-num">15+</span>
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

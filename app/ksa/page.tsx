// KSA Hub Page — /ksa/
// Premium hub with Saudi-themed styling

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";
import "./ksa.css";

export const metadata: Metadata = {
    title: "KSA Calculators — Saudi Arabia Tools",
    description: "Free KSA-specific calculators: End of Service Benefit (EOSB), GOSI, Salary, Overtime, Leave, Home Loan, Car Loan, and VAT. Accurate, step-by-step, based on Saudi regulations.",
    alternates: { canonical: canonicalUrl("/ksa") },
};

const KSA_CALCULATORS = [
    {
        title: "End of Service Benefit Calculator",
        slug: "end-of-service-calculator",
        icon: "🏢",
        tag: "Labor Law",
        description: "Calculate your EOSB under Saudi Labor Law Articles 84, 85, and 87. Covers termination, resignation, and special cases.",
    },
    {
        title: "GOSI Calculator",
        slug: "gosi-calculator",
        icon: "🏛️",
        tag: "Social Insurance",
        description: "Calculate your GOSI contributions — Annuities, SANED, and Occupational Hazards — for Saudi and non-Saudi employees.",
    },
    {
        title: "VAT Calculator (15%)",
        slug: "vat-calculator",
        icon: "🧾",
        tag: "Tax",
        description: "Add or remove 15% VAT for Saudi Arabia. ZATCA-compliant formulas for VAT-inclusive and VAT-exclusive prices.",
    },
    {
        title: "Salary Calculator",
        slug: "salary-calculator",
        icon: "💰",
        tag: "Payroll",
        description: "Calculate your net take-home salary. No income tax — only GOSI deduction. Supports Saudi nationals and expatriates.",
    },
    {
        title: "Overtime Calculator",
        slug: "overtime-calculator",
        icon: "⏱️",
        tag: "Labor Law",
        description: "Calculate overtime pay under Article 107. 150% rate for weekdays, weekends, and holidays. Ramadan hours supported.",
    },
    {
        title: "Annual Leave Calculator",
        slug: "annual-leave-calculator",
        icon: "🏖️",
        tag: "Labor Law",
        description: "Calculate leave entitlement, leave pay, and encashment. 21 days under 5 years, 30 days for 5+ years of service.",
    },
    {
        title: "Home Loan Calculator",
        slug: "home-loan-calculator",
        icon: "🏠",
        tag: "Financing",
        description: "Calculate monthly mortgage payment. Sharia-compliant Murabaha, Ijara, and Musharaka with SAMA DTI check.",
    },
    {
        title: "Car Loan Calculator",
        slug: "car-loan-calculator",
        icon: "🚗",
        tag: "Financing",
        description: "Calculate monthly car installment. Murabaha and Ijara with SAMA 60-month limit and bank comparison.",
    },
    {
        title: "Savings Goal Calculator",
        slug: "savings-goal-calculator",
        icon: "🏦",
        tag: "Savings",
        description: "Plan your savings in SAR. Calculate time to goal or monthly needed for Hajj, emergency fund, home, and more.",
    },
    {
        title: "Rent Affordability Calculator",
        slug: "rent-affordability-calculator",
        icon: "🏘️",
        tag: "Housing",
        description: "Find how much rent you can afford by city. Includes housing allowance, GOSI, Ejar costs, and property matching.",
    },
    {
        title: "Iqama Renewal Cost Calculator",
        slug: "iqama-renewal-calculator",
        icon: "📋",
        tag: "Immigration",
        description: "Calculate total Iqama renewal cost — base fee, work permit, dependent levy, insurance, visa, and penalties.",
    },
];

export default function KSAPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators" },
            ]} />

            <div className="ksa-hero">
                <div className="ksa-hero__flag">🇸🇦</div>
                <h1 className="ksa-hero__title">KSA Calculators</h1>
                <p className="ksa-hero__subtitle">
                    Free calculators designed for Saudi Arabia — based on Saudi Labor Law, GOSI regulations, SAMA rules, and ZATCA guidelines.
                </p>
                <div className="ksa-hero__stats">
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">{KSA_CALCULATORS.length}</span>
                        <span className="ksa-hero__stat-label">Calculators</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">120+</span>
                        <span className="ksa-hero__stat-label">FAQs</span>
                    </div>
                    <div className="ksa-hero__stat">
                        <span className="ksa-hero__stat-num">100%</span>
                        <span className="ksa-hero__stat-label">Free</span>
                    </div>
                </div>
            </div>

            <div className="ksa-grid">
                {KSA_CALCULATORS.map((calc) => (
                    <Link key={calc.slug} href={`/ksa/${calc.slug}`} className="ksa-card">
                        <div className="ksa-card__icon">{calc.icon}</div>
                        <div className="ksa-card__body">
                            <div className="ksa-card__tag">{calc.tag}</div>
                            <h2 className="ksa-card__title">{calc.title}</h2>
                            <p className="ksa-card__desc">{calc.description}</p>
                        </div>
                        <div className="ksa-card__arrow">→</div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

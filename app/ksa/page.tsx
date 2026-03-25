// KSA Hub Page — /ksa/
// Lists all KSA-specific calculators

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "KSA Calculators — Saudi Arabia Tools",
    description: "Free KSA-specific calculators: End of Service Benefit (EOSB), Saudi Labor Law tools, and more. Accurate, step-by-step, and based on Saudi regulations.",
    alternates: { canonical: canonicalUrl("/ksa") },
};

const KSA_CALCULATORS = [
    {
        title: "End of Service Benefit Calculator",
        slug: "end-of-service-calculator",
        icon: "🏢",
        description: "Calculate your EOSB under Saudi Labor Law Articles 84, 85, and 87. Covers termination, resignation, and special cases with step-by-step breakdown.",
    },
    {
        title: "GOSI Calculator",
        slug: "gosi-calculator",
        icon: "🏛️",
        description: "Calculate your GOSI social insurance contributions — Annuities, SANED, and Occupational Hazards — for Saudi and non-Saudi employees. Based on 2025 rates.",
    },
    {
        title: "VAT Calculator (15%)",
        slug: "vat-calculator",
        icon: "🧾",
        description: "Add or remove 15% VAT for Saudi Arabia. Calculate VAT-inclusive and VAT-exclusive prices with ZATCA-compliant formulas.",
    },
    {
        title: "Salary Calculator",
        slug: "salary-calculator",
        icon: "💰",
        description: "Calculate your net take-home salary in Saudi Arabia. No income tax — only GOSI deduction. Supports Saudi nationals and expatriates.",
    },
    {
        title: "Overtime Calculator",
        slug: "overtime-calculator",
        icon: "⏱️",
        description: "Calculate your overtime pay under Saudi Labor Law Article 107. 150% rate for weekdays, weekends, and holidays. Supports Ramadan hours.",
    },
    {
        title: "Annual Leave Calculator",
        slug: "annual-leave-calculator",
        icon: "🏖️",
        description: "Calculate your annual leave entitlement, leave pay, and encashment value. 21 days under 5 years, 30 days for 5+ years of service.",
    },
    {
        title: "Home Loan Calculator",
        slug: "home-loan-calculator",
        icon: "🏠",
        description: "Calculate your monthly mortgage payment in Saudi Arabia. Sharia-compliant Murabaha, Ijara, and Musharaka with SAMA DTI check.",
    },
    {
        title: "Car Loan Calculator",
        slug: "car-loan-calculator",
        icon: "🚗",
        description: "Calculate your monthly car installment in Saudi Arabia. Murabaha and Ijara with SAMA 60-month limit and bank comparison.",
    },
];


export default function KSAPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "KSA Calculators" },
            ]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-2)" }}>🇸🇦 KSA Calculators</h1>
            <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)" }}>
                Free calculators designed for Saudi Arabia. Based on Saudi Labor Law, GOSI regulations, and KSA-specific rules.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--s-4)" }}>
                {KSA_CALCULATORS.map((calc) => (
                    <Link
                        key={calc.slug}
                        href={`/ksa/${calc.slug}`}
                        className="calc-card"
                        style={{ display: "block", padding: "var(--s-4)", textDecoration: "none", color: "inherit", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                    >
                        <div style={{ fontSize: "2rem", marginBottom: "var(--s-2)" }}>{calc.icon}</div>
                        <h2 className="t-h3" style={{ marginBottom: "var(--s-1)" }}>{calc.title}</h2>
                        <p className="t-body text-muted" style={{ fontSize: "0.9rem" }}>{calc.description}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}

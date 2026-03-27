// UAE Hub Page — /uae/
// Premium hub with UAE-themed styling

import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";
import "../ksa/ksa.css";
import "./uae.css";

export const metadata: Metadata = {
    title: "UAE Calculators — United Arab Emirates Tools",
    description: "Free UAE-specific calculators: Mortgage, Rent, Salary, Gratuity, VAT, and more. Accurate, step-by-step, based on CBUAE regulations and UAE Federal Law.",
    alternates: { canonical: canonicalUrl("/uae") },
};

const UAE_CALCULATORS = [
    {
        title: "Mortgage Calculator",
        slug: "mortgage-calculator",
        icon: "🏠",
        tag: "Property",
        description: "Calculate your monthly mortgage payment in the UAE. Covers conventional and Islamic financing, CBUAE LTV rules, DLD fees, and DBR check.",
    },
    {
        title: "Gratuity Calculator",
        slug: "gratuity-calculator",
        icon: "💼",
        tag: "Employment",
        description: "Calculate your end-of-service gratuity in the UAE. Covers private sector, domestic workers, part-time, DIFC DEWS, and ADGM. Based on Federal Decree-Law 33/2021.",
    },
    {
        title: "VAT Calculator",
        slug: "vat-calculator",
        icon: "🧾",
        tag: "Tax",
        description: "Add or remove 5% UAE VAT, estimate tourist refunds, and manage bulk invoices. Covers standard-rated, zero-rated, and exempt supplies.",
    },
    {
        title: "RERA Rental Increase Calculator",
        slug: "rera-rental-calculator",
        icon: "📊",
        tag: "Property",
        description: "Calculate the maximum legal rent increase in Dubai and Abu Dhabi. Based on RERA Smart Rental Index, Decree No. 43/2013 tiers, and Abu Dhabi's 5% cap.",
    },
    {
        title: "Salary Calculator",
        slug: "salary-calculator",
        icon: "💰",
        tag: "Employment",
        description: "Calculate your UAE salary breakdown: gross to net, GPSSA pension, overtime pay, and unemployment insurance. Covers both expat and Emirati salaries.",
    },
    {
        title: "Gold Price Calculator",
        slug: "gold-calculator",
        icon: "✨",
        tag: "Finance",
        description: "Calculate gold jewellery prices: karat selection, making charges, VAT, and buyback estimation. Includes ESMA hallmark guide and Gold Souk tips.",
    },
    {
        title: "DEWA Bill Calculator",
        slug: "dewa-calculator",
        icon: "⚡",
        tag: "Utilities",
        description: "Calculate your monthly DEWA electricity and water bill with 2025 slab tariffs. Includes fuel surcharge, sewerage fee, housing fee, and 5% VAT.",
    },
];

export default function UAEPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Breadcrumb items={[
                { label: "Home", href: "/" },
                { label: "UAE Calculators" },
            ]} />

            <div className="uae-hero">
                <div className="uae-hero__flag">🇦🇪</div>
                <h1 className="uae-hero__title">UAE Calculators</h1>
                <p className="uae-hero__subtitle">
                    Free calculators designed for the United Arab Emirates — based on CBUAE regulations, UAE Federal Law, DLD guidelines, and local banking rules.
                </p>
                <div className="uae-hero__stats">
                    <div className="uae-hero__stat">
                        <span className="uae-hero__stat-num">{UAE_CALCULATORS.length}</span>
                        <span className="uae-hero__stat-label">Calculators</span>
                    </div>
                    <div className="uae-hero__stat">
                        <span className="uae-hero__stat-num">105+</span>
                        <span className="uae-hero__stat-label">FAQs</span>
                    </div>
                    <div className="uae-hero__stat">
                        <span className="uae-hero__stat-num">100%</span>
                        <span className="uae-hero__stat-label">Free</span>
                    </div>
                </div>
            </div>

            <div className="uae-grid">
                {UAE_CALCULATORS.map((calc) => (
                    <Link key={calc.slug} href={`/uae/${calc.slug}`} className="uae-card">
                        <div className="uae-card__icon">{calc.icon}</div>
                        <div className="uae-card__body">
                            <div className="uae-card__tag">{calc.tag}</div>
                            <h2 className="uae-card__title">{calc.title}</h2>
                            <p className="uae-card__desc">{calc.description}</p>
                        </div>
                        <div className="uae-card__arrow">→</div>
                    </Link>
                ))}
            </div>
        </main>
    );
}

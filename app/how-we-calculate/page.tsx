// How We Calculate — /how-we-calculate/
// User-friendly version of methodology — explains the "what" more than the "how"

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL, TOTAL_CALCULATORS, TOTAL_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
    title: "How We Calculate — Numerral's Approach to Accuracy",
    description:
        "Understand how Numerral's calculators work. Learn about the formulas, assumptions, and standards behind our loan, health, construction, and electrical calculators.",
    alternates: { canonical: canonicalUrl("/how-we-calculate") },
};

export default function HowWeCalculatePage() {
    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "How We Calculate" },
        ]),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Script
                id="schema-how-we-calculate"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How We Calculate" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>How We Calculate</h1>
            <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-8)" }}>
                A clear, jargon-free explanation of how our {TOTAL_CALCULATORS}+ calculators across {TOTAL_CATEGORIES} categories produce their results.
            </p>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>The Short Answer</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Every Numerral calculator uses <strong>the same standard formulas</strong> that banks, hospitals, engineers, and financial professionals use in their daily work. We don&apos;t invent formulas — we implement established ones with precision and verify the results against official sources.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>By Category</h2>

                <div style={{ display: "grid", gap: "var(--s-4)" }}>
                    {[
                        {
                            icon: "💰",
                            title: "Loan & Finance Calculators",
                            items: [
                                "Loan EMI uses the reducing balance method (the same formula your bank uses)",
                                "Compound interest follows the standard A = P(1 + r/n)^(nt) formula",
                                "Tax calculations use the latest official tax brackets and deduction rules",
                                "Investment projections use time-value-of-money principles (PV, FV, annuity)",
                            ],
                        },
                        {
                            icon: "🏗️",
                            title: "Construction Calculators",
                            items: [
                                "Material quantities use manufacturer-rated coverage rates",
                                "Waste factors (5–15%) are included for realistic estimates",
                                "All measurements follow NIST exact conversion standards",
                                "Calculations reference NEC, IRC, and ASTM standards where applicable",
                            ],
                        },
                        {
                            icon: "🏥",
                            title: "Health Calculators",
                            items: [
                                "BMR uses the Mifflin-St Jeor equation (most accurate per nutrition research)",
                                "Body fat uses the US Navy circumference method (validated formula)",
                                "Blood pressure categories follow AHA/ACC 2017 clinical guidelines",
                                "All health formulas cite published, peer-reviewed medical research",
                            ],
                        },
                        {
                            icon: "⚡",
                            title: "Electrical Calculators",
                            items: [
                                "Conversions use Ohm's Law and standard AC/DC power equations",
                                "Wire sizing follows NEC ampacity tables",
                                "Energy costs use published utility rates from the US EIA",
                                "Three-phase calculations use the standard √3 × V × I × PF formula",
                            ],
                        },
                    ].map((cat) => (
                        <div key={cat.title} className="calc-card" style={{ textAlign: "left" }}>
                            <h3 className="t-h3" style={{ marginBottom: "var(--s-2)" }}>
                                <span style={{ marginRight: "var(--s-2)" }}>{cat.icon}</span>{cat.title}
                            </h3>
                            <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 1.9, margin: 0 }}>
                                {cat.items.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Key Principles</h2>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 2 }}>
                    <li><strong>Standard formulas only</strong> — We use the same math that professionals use. No proprietary or experimental formulas.</li>
                    <li><strong>Verified against official sources</strong> — Every result is checked against known benchmark values and government calculators where available.</li>
                    <li><strong>Client-side processing</strong> — All calculations happen in your browser. Nothing is sent to our servers. Your data stays private.</li>
                    <li><strong>Estimates, not guarantees</strong> — Real-world results may vary due to fees, policies, rounding, and individual circumstances. Always verify important decisions with a qualified professional.</li>
                    <li><strong>Continuously updated</strong> — Tax rates, regulatory changes, and formula updates are applied within 48 hours of official announcements.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Assumptions We Make</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Most calculators have implicit assumptions. Here are the common ones:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 2 }}>
                    <li><strong>Loan calculators:</strong> Assume fixed interest rate for the full term, no prepayments or fees unless explicitly modeled.</li>
                    <li><strong>Investment calculators:</strong> Assume consistent contribution and return rate — actual market returns will vary.</li>
                    <li><strong>Health calculators:</strong> Use population-level estimates — individual metabolic rates and body composition can vary ±10–15%.</li>
                    <li><strong>Construction calculators:</strong> Include standard waste factors — actual waste depends on skill level, site conditions, and material cuts.</li>
                    <li><strong>Electrical calculators:</strong> Assume standard conditions (ambient temperature, copper conductors, standard insulation) unless otherwise specified.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Want the Technical Details?</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    For a deeper dive into our formula sources, verification process, and data governance:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", lineHeight: 2 }}>
                    <li><Link href="/methodology" style={{ color: "var(--n-primary)", fontWeight: 600 }}>Our Methodology</Link> — Detailed technical documentation of our formula selection, data sources, and verification process</li>
                    <li><Link href="/editorial-policy" style={{ color: "var(--n-primary)", fontWeight: 600 }}>Editorial Policy</Link> — Our three-tier editorial review process and accuracy standards</li>
                    <li><Link href="/contact" style={{ color: "var(--n-primary)", fontWeight: 600 }}>Contact Us</Link> — Report a calculation error or ask questions about our approach</li>
                </ul>
            </section>
        </main>
    );
}

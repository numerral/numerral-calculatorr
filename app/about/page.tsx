import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "About Numerral — India's Smartest Calculator Platform",
    description:
        "Learn about Numerral — a free, privacy-first calculator platform serving millions of Indians with accurate loan, investment, tax, and utility calculators.",
    alternates: { canonical: canonicalUrl("/about") },
};

export default function AboutPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>About Numerral</h1>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Our Mission</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Numerral exists to make financial calculations <strong>accessible, instant, and accurate</strong> for every Indian. Whether you&apos;re planning a home loan, estimating your income tax, or calculating SIP returns — we provide free, privacy-first tools that work on any device.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>What We Offer</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    {[
                        { icon: "🏦", title: "9 Loan Calculators", desc: "EMI, eligibility, prepayment analysis" },
                        { icon: "📈", title: "6 Investment Calculators", desc: "SIP, FD, RD, PPF, NPS, mutual funds" },
                        { icon: "🧾", title: "6 Tax Calculators", desc: "Income tax, GST, HRA, TDS, capital gains" },
                        { icon: "⚡", title: "6 Utility Calculators", desc: "Age, percentage, BMI, interest, discount" },
                    ].map((item) => (
                        <div key={item.title} className="calc-card" style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "var(--s-2)" }}>{item.icon}</span>
                            <h3 className="t-h4" style={{ marginBottom: "var(--s-1)" }}>{item.title}</h3>
                            <p className="t-body-sm text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Why Choose Numerral?</h2>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 2 }}>
                    <li><strong>100% Free</strong> — No hidden fees, no paywalls, no registration required</li>
                    <li><strong>Privacy First</strong> — All calculations happen in your browser, we don&apos;t store your data</li>
                    <li><strong>India-Focused</strong> — Tax slabs, bank rates, and regulatory rules are India-specific</li>
                    <li><strong>Instant Results</strong> — Real-time calculations as you adjust inputs, no page reloads</li>
                    <li><strong>Mobile Friendly</strong> — Responsive design works perfectly on phones and tablets</li>
                    <li><strong>Dark Mode</strong> — Easy on the eyes, day and night</li>
                </ul>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Our Commitment to Accuracy</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Every calculator is built using standard financial formulas and verified against official sources. Loan EMIs use the reducing balance method, tax calculations follow the latest Indian tax slabs, and investment returns account for proper compounding.
                </p>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    While our estimates are highly accurate, they should not be considered as financial advice. Actual values may vary based on lender policies, market conditions, and individual circumstances. Always consult a qualified financial advisor for important decisions.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Contact Us</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    Have a suggestion, found a bug, or want to collaborate? We&apos;d love to hear from you.
                </p>
                <p className="t-body" style={{ lineHeight: 1.7, marginTop: "var(--s-3)" }}>
                    📧 <strong>contact@numerral.com</strong>
                </p>
            </section>
        </main>
    );
}

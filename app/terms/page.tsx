import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Terms & Conditions — Numerral",
    description:
        "Terms and conditions for using Numerral's free online calculators. Read our usage policy, disclaimers, and intellectual property terms.",
    alternates: { canonical: canonicalUrl("/terms") },
};

export default function TermsPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>Terms &amp; Conditions</h1>
            <p className="t-body-sm text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Last updated: March 4, 2026
            </p>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>1. Acceptance of Terms</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    By accessing and using Numerral (&quot;the Website&quot;), you accept and agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use our services.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>2. Description of Service</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Numerral provides free online financial calculators, including but not limited to loan EMI calculators, investment return calculators, tax estimators, and utility calculators. All calculations are for informational and educational purposes only.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>3. Disclaimer of Accuracy</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    While we strive for accuracy, the calculator results are <strong>estimates only</strong> and should not be treated as financial, tax, or legal advice. Actual values may vary based on lender policies, regulatory changes, and individual circumstances. Always consult a qualified financial advisor before making financial decisions.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>4. Intellectual Property</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    All content on this website — including text, graphics, design, code, and calculator logic — is the property of Numerral and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our written consent.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>5. User Conduct</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    You agree to use the Website only for lawful purposes. You may not attempt to reverse-engineer, scrape, or overload our servers. Automated access is prohibited without explicit written permission.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>6. Limitation of Liability</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Numerral shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our calculators. This includes, but is not limited to, financial losses based on calculator outputs.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>7. Third-Party Links</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    The Website may contain links to third-party sites. We are not responsible for the content, privacy practices, or accuracy of external websites. You access third-party links at your own risk.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>8. Modifications</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Website constitutes acceptance of any modifications.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>9. Contact</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    If you have questions about these terms, please reach out to us at <strong>contact@numerral.com</strong>.
                </p>
            </section>
        </main>
    );
}

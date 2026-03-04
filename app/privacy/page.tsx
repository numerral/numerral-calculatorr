import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Privacy Policy — Numerral",
    description:
        "Numerral's privacy policy. Learn how we handle your data, what we collect, and how we protect your privacy.",
    alternates: { canonical: canonicalUrl("/privacy") },
};

export default function PrivacyPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>Privacy Policy</h1>
            <p className="t-body-sm text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Last updated: March 4, 2026
            </p>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>1. Information We Collect</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Numerral is designed with privacy in mind. <strong>We do not require registration or collect personal information</strong> to use our calculators. All calculations are performed client-side in your browser — no data is sent to our servers.
                </p>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We may collect anonymized, non-personal data through analytics tools, including:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 1.8, marginBottom: "var(--s-4)" }}>
                    <li>Pages visited and time spent</li>
                    <li>Browser type, device type, and operating system</li>
                    <li>Approximate geographic location (country/city level)</li>
                    <li>Referring URL and search terms</li>
                </ul>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>2. How We Use Information</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Any analytics data collected is used solely to:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 1.8, marginBottom: "var(--s-4)" }}>
                    <li>Improve calculator accuracy and user experience</li>
                    <li>Understand which calculators are most popular</li>
                    <li>Fix bugs and optimize website performance</li>
                    <li>Plan new features and content</li>
                </ul>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>3. Cookies</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We use cookies to remember your preferences (such as dark/light mode) and for analytics purposes. You can manage your cookie preferences through your browser settings or our <a href="/cookie-policy" style={{ color: "var(--n-primary)" }}>Cookie Policy</a> page.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>4. Third-Party Services</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We may use third-party analytics services (such as Google Analytics) that collect anonymized usage data. These services have their own privacy policies. We do not sell, rent, or share any data with advertisers or other third parties.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>5. Data Security</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We implement industry-standard security measures to protect our website. Since we don&apos;t collect personal data, there is minimal risk of data breaches affecting individual users. All connections to Numerral are encrypted via HTTPS.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>6. Children&apos;s Privacy</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Numerral does not knowingly collect personal information from children under 13. Our calculators are designed for general educational use.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>7. Your Rights</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Since we don&apos;t collect personal data, there is typically no personal information to access, correct, or delete. If you have concerns, you can contact us at <strong>contact@numerral.com</strong>.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>8. Changes to This Policy</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    We may update this policy periodically. Changes will be posted on this page with an updated date. Your continued use of Numerral constitutes acceptance of any changes.
                </p>
            </section>
        </main>
    );
}

import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Cookie Policy — Numerral",
    description:
        "Learn about the cookies used on Numerral, their purposes, and how to manage your cookie preferences.",
    alternates: { canonical: canonicalUrl("/cookie-policy") },
};

export default function CookiePolicyPage() {
    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>Cookie Policy</h1>
            <p className="t-body-sm text-muted" style={{ marginBottom: "var(--s-8)" }}>
                Last updated: March 4, 2026
            </p>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>What Are Cookies?</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Cookies We Use</h2>

                <table className="calc-table" style={{ marginTop: "var(--s-4)" }}>
                    <thead>
                        <tr>
                            <th>Cookie</th>
                            <th>Purpose</th>
                            <th>Duration</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>theme</td>
                            <td>Remembers your light/dark mode preference</td>
                            <td>1 year</td>
                            <td>Essential</td>
                        </tr>
                        <tr>
                            <td>cookie_consent</td>
                            <td>Stores your cookie consent preference</td>
                            <td>1 year</td>
                            <td>Essential</td>
                        </tr>
                        <tr>
                            <td>_ga</td>
                            <td>Google Analytics — distinguishes unique visitors</td>
                            <td>2 years</td>
                            <td>Analytics</td>
                        </tr>
                        <tr>
                            <td>_ga_*</td>
                            <td>Google Analytics — maintains session state</td>
                            <td>2 years</td>
                            <td>Analytics</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Essential Cookies</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    These cookies are necessary for the website to function properly. They enable core functionality such as theme preferences and cannot be disabled without affecting your experience.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Analytics Cookies</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We use Google Analytics to understand how visitors interact with our website. This helps us improve our calculators and content. Analytics data is anonymized and aggregated — we cannot identify individual users.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Managing Cookies</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    You can control and manage cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 1.8, marginBottom: "var(--s-4)" }}>
                    <li>View which cookies are stored and delete them individually</li>
                    <li>Block third-party cookies</li>
                    <li>Block cookies from specific sites</li>
                    <li>Block all cookies</li>
                    <li>Delete all cookies when you close the browser</li>
                </ul>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    Note: Blocking essential cookies may affect the functionality of the website, such as your theme preference not being saved.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Contact</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    If you have questions about our use of cookies, please contact us at <strong>contact@numerral.com</strong>.
                </p>
            </section>
        </main>
    );
}

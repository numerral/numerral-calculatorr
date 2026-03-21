// Contact — /contact/
// Professional contact page with structured data

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Contact Us — Numerral",
    description:
        "Get in touch with the Numerral team. Report calculator errors, suggest new features, request partnerships, or ask questions about our methodology.",
    alternates: { canonical: canonicalUrl("/contact") },
};

export default function ContactPage() {
    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Contact Us" },
        ]),
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)", maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
            <Script
                id="schema-contact"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />

            <h1 className="t-h1" style={{ marginBottom: "var(--s-3)" }}>Contact Us</h1>
            <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-8)" }}>
                We&apos;d love to hear from you — whether it&apos;s a bug report, feature request, partnership inquiry, or just feedback on our tools.
            </p>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>📧 Email</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    For all inquiries, reach us at:
                </p>
                <p style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "var(--s-4)" }}>
                    <a href="mailto:contact@numerral.com" style={{ color: "var(--n-primary)" }}>contact@numerral.com</a>
                </p>
                <p className="t-body-sm text-muted">
                    We aim to respond to all emails within 24–48 hours during business days.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-4)" }}>How Can We Help?</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    {[
                        {
                            icon: "🐛",
                            title: "Report a Bug or Error",
                            desc: "Found an incorrect calculation or broken feature? Please include the calculator name, your inputs, the result, and the expected result.",
                        },
                        {
                            icon: "💡",
                            title: "Suggest a Calculator",
                            desc: "Have an idea for a new calculator we should build? Tell us what you need and we'll consider adding it to our roadmap.",
                        },
                        {
                            icon: "🤝",
                            title: "Partnership & Business",
                            desc: "Interested in content partnerships, API licensing, white-label solutions, or advertising opportunities? Let's talk.",
                        },
                        {
                            icon: "📰",
                            title: "Press & Media",
                            desc: "Media inquiries, data citation requests, or interview requests — we're happy to help journalists and researchers.",
                        },
                    ].map((item) => (
                        <div key={item.title} className="calc-card" style={{ textAlign: "left" }}>
                            <span style={{ fontSize: "2rem", display: "block", marginBottom: "var(--s-2)" }}>{item.icon}</span>
                            <h3 className="t-h4" style={{ marginBottom: "var(--s-1)" }}>{item.title}</h3>
                            <p className="t-body-sm text-muted">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ marginBottom: "var(--s-8)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Accuracy Concerns</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                    We take calculator accuracy extremely seriously. If you believe any calculator produces an incorrect result, please email us with:
                </p>
                <ul style={{ paddingLeft: "var(--s-6)", color: "var(--n-text-secondary)", lineHeight: 2 }}>
                    <li>The <strong>calculator name</strong> and URL</li>
                    <li>The <strong>inputs</strong> you entered</li>
                    <li>The <strong>result</strong> you received</li>
                    <li>The <strong>expected result</strong> and your source</li>
                </ul>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginTop: "var(--s-3)" }}>
                    We investigate every accuracy report within 24 hours and publish corrections promptly. Read more about our standards on our{" "}
                    <Link href="/methodology" style={{ color: "var(--n-primary)", fontWeight: 600 }}>Methodology</Link> and{" "}
                    <Link href="/editorial-policy" style={{ color: "var(--n-primary)", fontWeight: 600 }}>Editorial Policy</Link> pages.
                </p>
            </section>

            <section style={{ marginBottom: "var(--s-12)" }}>
                <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Response Times</h2>
                <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)" }}>
                    We respond to most inquiries within <strong>24–48 hours</strong>. Accuracy error reports are prioritized and investigated within <strong>24 hours</strong>. During peak periods, response times may be slightly longer.
                </p>
            </section>
        </main>
    );
}

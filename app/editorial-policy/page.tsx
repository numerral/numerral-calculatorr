// Editorial Policy — /editorial-policy/
// Explains the multi-tier review process, accuracy standards, and editorial independence

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Editorial Policy — How Numerral Ensures Accuracy & Trust",
    description:
        "Learn how Numerral's editorial team writes, reviews, and fact-checks every calculator and financial guide. Our three-tier process ensures accuracy, transparency, and editorial independence.",
    alternates: { canonical: canonicalUrl("/editorial-policy") },
};

export default function EditorialPolicyPage() {
    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Editorial Policy" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Editorial Policy — How Numerral Ensures Accuracy & Trust",
            description: "Numerral's three-tier editorial process: written by subject-matter experts, reviewed by financial and science professionals, fact-checked against primary sources.",
            url: canonicalUrl("/editorial-policy"),
            publisher: {
                "@type": "Organization",
                name: "Numerral",
                url: SITE_URL,
            },
            mainEntity: {
                "@type": "Article",
                headline: "Editorial Policy",
                author: { "@type": "Organization", name: "Numerral Editorial Team" },
            },
        },
    ]);

    return (
        <main className="container" style={{ paddingTop: "var(--s-4)" }}>
            <Script
                id="schema-editorial"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Editorial Policy" }]} />

            <div className="editorial-content">
                <h1 className="t-h1" style={{ marginBottom: "var(--s-6)" }}>
                    Editorial Policy
                </h1>

                <p>
                    At Numerral, accuracy is not optional — it is our founding principle. Every calculator, formula,
                    financial explanation, and data point on this platform goes through a rigorous multi-tier editorial
                    process before reaching you. We believe users making financial decisions deserve tools they can
                    trust completely.
                </p>

                <h2>Our Three-Tier Editorial Process</h2>
                <p>
                    Every piece of content on Numerral passes through three independent layers of review. This is the
                    same standard used by leading financial publications, adapted specifically for calculator platforms.
                </p>

                <div className="editorial-process-flow">
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">1</div>
                        <h4>Written by Experts</h4>
                        <p>
                            Calculator logic, formulas, and explanations are created by financial content specialists
                            with domain expertise and years of experience in financial journalism.
                        </p>
                    </div>
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">2</div>
                        <h4>Reviewed by Professionals</h4>
                        <p>
                            All content is reviewed by qualified domain experts — including CFA
                            charterholders, Ph.D. scientists, and accredited engineers — who verify
                            technical accuracy, formula correctness, and factual integrity.
                        </p>
                    </div>
                    <div className="editorial-process-step">
                        <div className="editorial-process-step__number">3</div>
                        <h4>Fact-Checked Against Sources</h4>
                        <p>
                            A dedicated fact checker cross-references every data point, tax rate, regulation,
                            and formula against authoritative primary sources before publication.
                        </p>
                    </div>
                </div>

                <h2>How Calculator Accuracy is Verified</h2>
                <p>
                    Our calculators are not just interfaces with formulas — they are carefully engineered financial tools.
                    Every calculator undergoes the following verification:
                </p>
                <ul>
                    <li><strong>Formula validation:</strong> Mathematical formulas are verified against standard financial textbooks, government publications, and regulatory circulars (RBI, SEBI, Income Tax Act).</li>
                    <li><strong>Benchmark testing:</strong> Calculator outputs are tested against known benchmark values and cross-checked with official government calculators where available.</li>
                    <li><strong>Edge case handling:</strong> Extreme inputs, zero values, and boundary conditions are tested to ensure calculators handle all scenarios gracefully.</li>
                    <li><strong>Regulatory updates:</strong> Tax slabs, interest rates, and government scheme details are updated promptly when official announcements are made, with source citations.</li>
                </ul>

                <h2>Our Sources</h2>
                <p>
                    We rely exclusively on authoritative primary sources for all financial data and regulatory information:
                </p>
                <ul>
                    <li><strong>Reserve Bank of India (RBI)</strong> — Master circulars, base rates, lending guidelines</li>
                    <li><strong>Securities and Exchange Board of India (SEBI)</strong> — Mutual fund regulations, market data</li>
                    <li><strong>Income Tax Department, India</strong> — Tax slabs, deductions, exemptions, budget announcements</li>
                    <li><strong>Ministry of Finance</strong> — Budget documents, small savings scheme rates</li>
                    <li><strong>NIST (National Institute of Standards and Technology)</strong> — Physical constants, SI units, scientific reference values</li>
                    <li><strong>NFPA 70 (National Electrical Code)</strong> — Electrical wiring, circuit sizing, safety standards</li>
                    <li><strong>U.S. Energy Information Administration (EIA)</strong> — Electricity rates, energy consumption data</li>
                    <li><strong>U.S. EPA</strong> — Environmental and fuel economy standards</li>
                    <li><strong>Standard financial textbooks</strong> — CFA curriculum, Brealey-Myers (Corporate Finance), Bodie-Kane-Marcus (Investments)</li>
                    <li><strong>Standard physics and engineering references</strong> — Halliday, Resnick &amp; Krane; Serway &amp; Jewett; Sadiku &amp; Alexander</li>
                    <li><strong>Peer-reviewed research</strong> — Health calculator formulas from published medical and nutrition research</li>
                </ul>

                <div className="editorial-highlight">
                    <p>
                        <strong>What we never do:</strong> Numerral does not accept payment to feature, promote, or bias any
                        calculator result in favor of any financial product, lender, or institution. Our calculators are
                        independent tools — not lead-generation mechanisms.
                    </p>
                </div>

                <h2>Update and Correction Policy</h2>
                <p>
                    Financial regulations, tax rates, and government schemes change. We monitor these changes and update
                    affected calculators within 48 hours of an official announcement. All calculator pages display the
                    &quot;Updated&quot; date in the author attribution section so users can verify currency.
                </p>
                <p>
                    If you find an error in any calculator or content on Numerral, please report it to{" "}
                    <strong>contact@numerral.com</strong>. We take factual accuracy extremely seriously and will
                    investigate and correct any verified error within 24 hours, with full transparency.
                </p>

                <h2>Our Editorial Team</h2>
                <p>
                    Our team comprises qualified financial professionals with real-world experience in investment
                    management, audit, financial reporting, and content creation. Every team member&apos;s credentials
                    and background are publicly listed on their profile pages.
                </p>
                <p>
                    <Link href="/authors" style={{ fontWeight: 600 }}>
                        Meet Our Editorial Team →
                    </Link>
                </p>

                <h2>Editorial Independence</h2>
                <p>
                    Numerral is an independent platform. We do not receive compensation from any financial institution,
                    bank, or fund house. Our revenue comes from advertising, and advertising has zero influence on
                    calculator formulas, results, or editorial content. The editorial team operates independently of
                    any commercial considerations.
                </p>
                <p>
                    We believe that trust is the foundation of a useful financial tool. Every decision in our editorial
                    process is made with one question in mind: <em>&quot;Does this serve the user's best interest?&quot;</em>
                </p>
            </div>
        </main>
    );
}

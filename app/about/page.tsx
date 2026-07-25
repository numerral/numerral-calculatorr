import type { Metadata } from "next";
// Server Component — no 'use client' needed; hover effects handled via CSS
import Link from "next/link";
import Script from "next/script";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { canonicalUrl, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { getAllAuthors } from "@/data/authors";

export const metadata: Metadata = {
    title: "About Numerral — Free Calculator Platform for Finance, Health & More",
    description:
        "Learn about Numerral — a free, privacy-first calculator platform with 617+ tools for finance, health, tax, math, and construction. Meet our editorial team and learn how we ensure accuracy.",
    alternates: { canonical: canonicalUrl("/about") },
};

const STATS = [
    { value: "617+", label: "Free Calculators" },
    { value: "22",   label: "Categories" },
    { value: "4",    label: "Countries" },
    { value: "6",    label: "Languages" },
    { value: "0",    label: "Data Collected" },
    { value: "100%", label: "Free, Forever" },
];

const VALUES = [
    {
        icon: "🎯",
        title: "Accuracy First",
        desc: "Every formula is peer-reviewed against authoritative sources — RBI circulars, SEBI regulations, WHO standards, NIST constants, and standard financial textbooks. We don't publish a calculator until it's verified.",
    },
    {
        icon: "🔒",
        title: "Privacy by Design",
        desc: "All calculations run entirely in your browser using JavaScript. We never transmit your inputs to a server, never store your financial data, and never require you to create an account. What you calculate stays with you.",
    },
    {
        icon: "🌍",
        title: "Globally Accessible",
        desc: "Numerral is built for the world. We offer country-specific tools for the US, India, UAE, and Saudi Arabia — with local tax laws, currencies, and financial regulations built in. Available in 6 languages.",
    },
    {
        icon: "📖",
        title: "Radical Transparency",
        desc: "We show you the formula. Every calculator displays the exact mathematical equation used, step-by-step worked examples, and real-world context — not just a bare output number.",
    },
    {
        icon: "⚡",
        title: "Speed & Simplicity",
        desc: "Results appear as you type — no loading screens, no page reloads, no wait. We obsess over user experience so that getting the answer you need takes under 10 seconds from landing on any page.",
    },
    {
        icon: "🆓",
        title: "Always Free",
        desc: "Numerral has been free since day one and always will be. We believe access to accurate financial tools is a right, not a premium feature. No paywalls. No freemium tiers. No hidden costs.",
    },
];

const MILESTONES = [
    { year: "2023", event: "Numerral founded with a core set of 30 Indian finance calculators" },
    { year: "2024", event: "Expanded to 200+ calculators across finance, health, tax, and math" },
    { year: "2024", event: "Launched country-specific tools for UAE and Saudi Arabia" },
    { year: "2025", event: "Added multilingual support: Arabic, German, Indonesian, Turkish" },
    { year: "2025", event: "Crossed 500+ calculators including construction and EV categories" },
    { year: "2026", event: "Reached 617+ calculators — one of the largest free calculator platforms globally" },
];

const CATEGORIES = [
    { icon: "🏦", name: "Finance & Loans",      count: "60+",  desc: "Mortgage, EMI, compound interest, loan affordability" },
    { icon: "📈", name: "Investment",            count: "25+",  desc: "SIP, FD, RD, PPF, NPS, retirement planning" },
    { icon: "🧾", name: "Tax",                   count: "40+",  desc: "Income tax, GST, HRA exemption, TDS, capital gains" },
    { icon: "❤️", name: "Health & Fitness",      count: "30+",  desc: "BMI, TDEE, calorie deficit, ideal weight, body fat" },
    { icon: "🔨", name: "Construction",          count: "150+", desc: "Concrete, lumber, roofing, flooring, masonry materials" },
    { icon: "📐", name: "Math & Science",        count: "20+",  desc: "Percentage, algebra, geometry, physics, chemistry" },
    { icon: "⚡",  name: "EV & Automotive",       count: "35+",  desc: "EV range, charging cost, fuel savings, car loan" },
    { icon: "🔄", name: "Unit Conversions",      count: "54+",  desc: "Volume, weight, length, cooking, temperature" },
    { icon: "💼", name: "Salary & Business",     count: "20+",  desc: "CTC to take-home, GST, profit margin, business loan" },
];

const ROLE_COLORS: Record<string, string> = {
    Writer:        "background: rgba(99,102,241,0.12); color: #818cf8;",
    Reviewer:      "background: rgba(16,185,129,0.12); color: #34d399;",
    "Fact Checker": "background: rgba(245,158,11,0.12); color: #fbbf24;",
    Editor:        "background: rgba(236,72,153,0.12); color: #f472b6;",
};

export default function AboutPage() {
    const authors = getAllAuthors();

    const schema = JSON.stringify([
        breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "About Numerral" },
        ]),
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            description:
                "Numerral is a free online calculator platform with 617+ tools for finance, health, tax, construction, and everyday decisions. Serving users in the US, India, UAE, and Saudi Arabia.",
            foundingDate: "2023",
            contactPoint: {
                "@type": "ContactPoint",
                email: "contact@numerral.com",
                contactType: "customer support",
            },
            sameAs: [
                "https://www.numerral.com",
            ],
        },
    ]);

    return (
        <main style={{ paddingBottom: "var(--s-16)" }}>
            <Script
                id="schema-about"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: schema }}
            />

            {/* ── Hero Banner ─────────────────────────────────── */}
            <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(79,70,229,0.04) 100%)",
                borderBottom: "1px solid var(--n-border)",
                paddingTop: "var(--s-8)",
                paddingBottom: "var(--s-10)",
                marginBottom: "var(--s-10)",
            }}>
                <div className="container" style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>
                    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} />

                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "var(--s-2)",
                        background: "rgba(99,102,241,0.1)", color: "#818cf8",
                        padding: "4px 14px", borderRadius: "999px", fontSize: "0.8rem",
                        fontWeight: 600, marginBottom: "var(--s-4)", letterSpacing: "0.05em",
                    }}>
                        <span>🧮</span> About Numerral
                    </div>

                    <h1 className="t-h1" style={{ marginBottom: "var(--s-4)", lineHeight: 1.2 }}>
                        Making Accurate Calculations{" "}
                        <span style={{ color: "#818cf8" }}>Accessible to Everyone</span>
                    </h1>

                    <p className="t-body" style={{ lineHeight: 1.8, color: "var(--n-text-secondary)", marginBottom: "var(--s-6)", fontSize: "1.05rem" }}>
                        Numerral is a free, privacy-first calculator platform built for real-life decisions. Whether you&apos;re
                        planning a mortgage, calculating your income tax, tracking your BMI, or estimating construction
                        material costs — we provide instant, accurate, and fully transparent tools. No sign-ups.
                        No data collection. No paywalls. Just answers.
                    </p>

                    <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
                        <Link href="/loan-calculators" className="btn-premium" style={{ fontSize: "0.9rem", padding: "10px 22px" }}>
                            Explore Calculators →
                        </Link>
                        <Link href="/editorial-policy" className="btn-premium btn-premium--outline" style={{ fontSize: "0.9rem", padding: "10px 22px" }}>
                            Editorial Policy
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ maxWidth: "var(--w-narrow)", margin: "0 auto" }}>

                {/* ── Platform Stats ───────────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-label="Platform statistics">
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                        gap: "var(--s-3)",
                    }}>
                        {STATS.map((s) => (
                            <div key={s.label} style={{
                                background: "var(--n-surface)",
                                border: "1px solid var(--n-border)",
                                borderRadius: "var(--r-lg)",
                                padding: "var(--s-4)",
                                textAlign: "center",
                            }}>
                                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#818cf8", marginBottom: "4px" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--n-text-secondary)", fontWeight: 500 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Our Story ────────────────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="story-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Our Story</span>
                    </div>
                    <h2 id="story-heading" className="t-h2" style={{ marginBottom: "var(--s-5)" }}>
                        Why We Built Numerral
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
                        <p className="t-body" style={{ lineHeight: 1.85, color: "var(--n-text-secondary)" }}>
                            Numerral was founded in 2023 with a straightforward observation: most online calculator tools
                            give you a number without helping you understand it. You enter your loan amount, you get an
                            EMI back — but you don&apos;t see the formula, you don&apos;t understand why the number is what it is,
                            and you have no idea if it&apos;s reasonable for your situation.
                        </p>
                        <p className="t-body" style={{ lineHeight: 1.85, color: "var(--n-text-secondary)" }}>
                            We believed people deserve better. Financial decisions — buying a home, planning for
                            retirement, filing taxes, managing debt — are among the most consequential choices people
                            make. Opaque tools that just spit out numbers aren&apos;t good enough for decisions of that magnitude.
                        </p>
                        <p className="t-body" style={{ lineHeight: 1.85, color: "var(--n-text-secondary)" }}>
                            So we built Numerral: a platform where every calculator shows the underlying formula,
                            explains each component, provides step-by-step worked examples with real numbers, and
                            gives you contextual insights to help you actually act on the result. From a starting
                            set of 30 Indian finance calculators, we&apos;ve grown to over 617 tools across 22 categories,
                            serving users in 4 countries and 6 languages.
                        </p>
                    </div>

                    {/* Timeline */}
                    <div style={{
                        marginTop: "var(--s-8)",
                        padding: "var(--s-6)",
                        background: "var(--n-surface)",
                        border: "1px solid var(--n-border)",
                        borderRadius: "var(--r-xl)",
                    }}>
                        <h3 className="t-h4" style={{ marginBottom: "var(--s-5)" }}>Our Journey</h3>
                        <div style={{ position: "relative" }}>
                            {MILESTONES.map((m, i) => (
                                <div key={i} style={{
                                    display: "flex", gap: "var(--s-4)",
                                    paddingBottom: i < MILESTONES.length - 1 ? "var(--s-5)" : 0,
                                    position: "relative",
                                }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "24px" }}>
                                        <div style={{
                                            width: "24px", height: "24px", borderRadius: "50%",
                                            background: "#818cf8", display: "flex", alignItems: "center",
                                            justifyContent: "center", flexShrink: 0, zIndex: 1,
                                        }}>
                                            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "white" }} />
                                        </div>
                                        {i < MILESTONES.length - 1 && (
                                            <div style={{ width: "2px", flex: 1, background: "var(--n-border)", marginTop: "4px" }} />
                                        )}
                                    </div>
                                    <div style={{ paddingBottom: "var(--s-1)" }}>
                                        <span style={{
                                            fontSize: "0.75rem", fontWeight: 700, color: "#818cf8",
                                            textTransform: "uppercase", letterSpacing: "0.05em",
                                        }}>{m.year}</span>
                                        <p className="t-body-sm" style={{ color: "var(--n-text-secondary)", marginTop: "2px", lineHeight: 1.6 }}>
                                            {m.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Our Values ───────────────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="values-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>What We Stand For</span>
                    </div>
                    <h2 id="values-heading" className="t-h2" style={{ marginBottom: "var(--s-6)" }}>Our Core Values</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--s-4)" }}>
                        {VALUES.map((v) => (
                            <div key={v.title} style={{
                                background: "var(--n-surface)",
                                border: "1px solid var(--n-border)",
                                borderRadius: "var(--r-xl)",
                                padding: "var(--s-5)",
                            }}>
                                <span style={{ fontSize: "1.8rem", display: "block", marginBottom: "var(--s-3)" }}>{v.icon}</span>
                                <h3 className="t-h4" style={{ marginBottom: "var(--s-2)" }}>{v.title}</h3>
                                <p className="t-body-sm" style={{ lineHeight: 1.75, color: "var(--n-text-secondary)" }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Meet the Team ────────────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="team-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>The People Behind Numerral</span>
                    </div>
                    <h2 id="team-heading" className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Meet Our Team</h2>
                    <p className="t-body" style={{ color: "var(--n-text-secondary)", lineHeight: 1.7, marginBottom: "var(--s-7)" }}>
                        Numerral&apos;s calculators and content are created and validated by a team of qualified financial
                        professionals, chartered accountants, and subject-matter experts — not algorithms. Every page
                        goes through a three-step process: written by a specialist, reviewed by a qualified professional,
                        and fact-checked against primary authoritative sources.
                    </p>

                    <style>{`
                        .about-team-card {
                            display: block;
                            text-decoration: none;
                            background: var(--n-surface);
                            border: 1px solid var(--n-border);
                            border-radius: var(--r-xl);
                            padding: var(--s-6);
                            transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
                        }
                        .about-team-card:hover {
                            border-color: #818cf8;
                            transform: translateY(-2px);
                            box-shadow: 0 8px 24px rgba(99,102,241,0.12);
                        }
                        .about-contact-card {
                            display: block;
                            text-decoration: none;
                            background: var(--n-surface);
                            border: 1px solid var(--n-border);
                            border-radius: var(--r-xl);
                            padding: var(--s-5);
                            transition: border-color 0.2s;
                        }
                        .about-contact-card:hover {
                            border-color: #818cf8;
                        }
                    `}</style>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--s-5)" }}>
                        {authors.map((author) => (
                            <Link
                                key={author.slug}
                                href={`/authors/${author.slug}`}
                                className="about-team-card"
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: "72px", height: "72px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #818cf8, #4f46e5)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "1.6rem", fontWeight: 700, color: "white",
                                    marginBottom: "var(--s-4)", flexShrink: 0,
                                }}>
                                    {author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                </div>

                                {/* Role Badge */}
                                <span style={{
                                    display: "inline-block",
                                    padding: "3px 10px",
                                    borderRadius: "999px",
                                    fontSize: "0.72rem",
                                    fontWeight: 600,
                                    marginBottom: "var(--s-2)",
                                    ...(ROLE_COLORS[author.role]
                                        ? Object.fromEntries(
                                            ROLE_COLORS[author.role].split(";")
                                                .filter(Boolean)
                                                .map((s) => {
                                                    const [k, v] = s.split(":").map((x) => x.trim());
                                                    const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
                                                    return [key, v];
                                                })
                                          )
                                        : {}),
                                }}>
                                    {author.role}
                                </span>

                                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "4px", color: "var(--n-text)" }}>
                                    {author.name}
                                </h3>
                                <p style={{ fontSize: "0.82rem", color: "var(--n-text-secondary)", marginBottom: "var(--s-3)", lineHeight: 1.4 }}>
                                    {author.title}
                                </p>
                                <p style={{ fontSize: "0.82rem", color: "var(--n-text-secondary)", marginBottom: "var(--s-3)", lineHeight: 1.4 }}>
                                    📍 {author.location}
                                </p>

                                {/* Expertise Tags */}
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                    {author.expertise.slice(0, 3).map((tag) => (
                                        <span key={tag} style={{
                                            fontSize: "0.7rem", fontWeight: 500,
                                            background: "var(--n-bg)",
                                            border: "1px solid var(--n-border)",
                                            borderRadius: "999px",
                                            padding: "2px 8px",
                                            color: "var(--n-text-secondary)",
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Education */}
                                <div style={{ marginTop: "var(--s-3)", paddingTop: "var(--s-3)", borderTop: "1px solid var(--n-border)" }}>
                                    <p style={{ fontSize: "0.72rem", color: "var(--n-text-secondary)", lineHeight: 1.6 }}>
                                        🎓 {author.education[0]}
                                    </p>
                                </div>

                                <p style={{ marginTop: "var(--s-3)", fontSize: "0.78rem", color: "#818cf8", fontWeight: 600 }}>
                                    View Profile →
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div style={{ marginTop: "var(--s-5)", textAlign: "center" }}>
                        <Link
                            href="/authors"
                            className="btn-premium btn-premium--outline"
                            style={{ fontSize: "0.9rem", padding: "10px 24px" }}
                        >
                            View Full Team Profiles →
                        </Link>
                    </div>
                </section>

                {/* ── Editorial Process ────────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="editorial-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>How We Work</span>
                    </div>
                    <h2 id="editorial-heading" className="t-h2" style={{ marginBottom: "var(--s-3)" }}>
                        Our Editorial &amp; Accuracy Process
                    </h2>
                    <p className="t-body" style={{ color: "var(--n-text-secondary)", lineHeight: 1.7, marginBottom: "var(--s-7)" }}>
                        Every calculator and piece of content on Numerral goes through a rigorous three-stage verification
                        process before it reaches you. We treat calculator accuracy with the same seriousness as a financial
                        publication — because for many users, these numbers inform real, high-stakes decisions.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--s-4)" }}>
                        {[
                            {
                                step: "01",
                                icon: "✍️",
                                title: "Written by Specialists",
                                desc: "Calculators and explanations are built by finance specialists and subject-matter experts with relevant degrees and professional experience in the topic area.",
                            },
                            {
                                step: "02",
                                icon: "🔬",
                                title: "Reviewed by Professionals",
                                desc: "A qualified professional (CFA, CA, PhD) independently reviews the formula, methodology, and all explanatory content for technical correctness.",
                            },
                            {
                                step: "03",
                                icon: "✅",
                                title: "Fact-Checked Against Sources",
                                desc: "A dedicated fact-checker verifies every data point, tax rate, regulation, and numerical example against primary authoritative sources before publication.",
                            },
                            {
                                step: "04",
                                icon: "🔄",
                                title: "Regularly Updated",
                                desc: "Tax slabs, interest rates, and regulatory references are reviewed and updated after every government announcement, RBI policy change, or budget revision.",
                            },
                        ].map((p) => (
                            <div key={p.step} style={{
                                background: "var(--n-surface)",
                                border: "1px solid var(--n-border)",
                                borderRadius: "var(--r-xl)",
                                padding: "var(--s-5)",
                                position: "relative",
                            }}>
                                <span style={{
                                    position: "absolute", top: "var(--s-4)", right: "var(--s-4)",
                                    fontSize: "1.5rem", fontWeight: 800, color: "var(--n-border)",
                                    lineHeight: 1,
                                }}>{p.step}</span>
                                <span style={{ fontSize: "1.8rem", display: "block", marginBottom: "var(--s-3)" }}>{p.icon}</span>
                                <h3 className="t-h4" style={{ marginBottom: "var(--s-2)" }}>{p.title}</h3>
                                <p className="t-body-sm" style={{ color: "var(--n-text-secondary)", lineHeight: 1.7 }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "var(--s-5)", textAlign: "center" }}>
                        <Link href="/editorial-policy" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#818cf8" }}>
                            Read our full Editorial Policy →
                        </Link>
                    </div>
                </section>

                {/* ── Calculator Categories ────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="categories-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>What We Cover</span>
                    </div>
                    <h2 id="categories-heading" className="t-h2" style={{ marginBottom: "var(--s-6)" }}>617+ Calculators Across 22 Categories</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--s-3)" }}>
                        {CATEGORIES.map((cat) => (
                            <div key={cat.name} style={{
                                display: "flex", gap: "var(--s-3)", alignItems: "flex-start",
                                background: "var(--n-surface)",
                                border: "1px solid var(--n-border)",
                                borderRadius: "var(--r-lg)",
                                padding: "var(--s-4)",
                            }}>
                                <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{cat.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "2px", color: "var(--n-text)" }}>
                                        {cat.name}
                                        <span style={{ marginLeft: "6px", fontSize: "0.75rem", color: "#818cf8", fontWeight: 600 }}>{cat.count}</span>
                                    </div>
                                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-secondary)", lineHeight: 1.5 }}>{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Accuracy Commitment ──────────────────────── */}
                <section style={{ marginBottom: "var(--s-14)" }} aria-labelledby="accuracy-heading">
                    <div style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(79,70,229,0.03) 100%)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "var(--r-xl)",
                        padding: "var(--s-8)",
                    }}>
                        <h2 id="accuracy-heading" className="t-h3" style={{ marginBottom: "var(--s-4)" }}>
                            🎯 Our Commitment to Accuracy
                        </h2>
                        <p className="t-body" style={{ lineHeight: 1.85, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                            Every calculator on Numerral is built using standard, peer-reviewed financial and scientific
                            formulas. Loan EMIs use the reducing balance amortization method. Tax calculations reflect
                            the most current government-published tax slabs and deduction limits. Investment calculators
                            use compound interest formulas validated against standard actuarial practice. Physics and
                            chemistry constants are sourced from NIST reference values.
                        </p>
                        <p className="t-body" style={{ lineHeight: 1.85, color: "var(--n-text-secondary)", marginBottom: "var(--s-4)" }}>
                            Our calculators are cross-validated against professional-grade tools and verified by
                            qualified reviewers — including CFA Charterholders, Chartered Accountants, and PhD-level
                            subject matter experts — before publication.
                        </p>
                        <p className="t-body-sm" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", fontStyle: "italic" }}>
                            <strong>Important disclaimer:</strong> While our calculators strive for the highest accuracy,
                            results are estimates for informational purposes only and should not be considered financial,
                            legal, or medical advice. Actual values may differ based on lender policies, market
                            conditions, individual circumstances, and regulatory changes. Always consult a qualified
                            professional before making major financial decisions.
                        </p>
                    </div>
                </section>

                {/* ── Contact ──────────────────────────────────── */}
                <section style={{ marginBottom: "var(--s-6)" }} aria-labelledby="contact-heading">
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                        <span style={{ width: "4px", height: "24px", background: "#818cf8", borderRadius: "2px", display: "block" }} />
                        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Get in Touch</span>
                    </div>
                    <h2 id="contact-heading" className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Contact Us</h2>
                    <p className="t-body" style={{ lineHeight: 1.7, color: "var(--n-text-secondary)", marginBottom: "var(--s-6)" }}>
                        Have a suggestion for a new calculator? Found a bug or inaccuracy? Want to collaborate,
                        advertise, or discuss a partnership? We&apos;d love to hear from you. Our team typically
                        responds within 1–2 business days.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--s-4)" }}>
                        {[
                            { icon: "📧", label: "General Inquiries", value: "contact@numerral.com", href: "mailto:contact@numerral.com" },
                            { icon: "🐛", label: "Report an Error", value: "Use our Contact Page", href: "/contact" },
                            { icon: "💼", label: "Advertising & Media", value: "contact@numerral.com", href: "mailto:contact@numerral.com" },
                        ].map((c) => (
                            <a
                                key={c.label}
                                href={c.href}
                                className="about-contact-card"
                            >
                                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "var(--s-2)" }}>{c.icon}</span>
                                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#818cf8", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</p>
                                <p style={{ fontSize: "0.88rem", color: "var(--n-text)", fontWeight: 500 }}>{c.value}</p>
                            </a>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}

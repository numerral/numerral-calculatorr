// Homepage — / (Server Component)

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CategoryGrid from "@/components/shared/CategoryGrid";
import { getCalculatorsByCategory, type CalculatorDef } from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Online Calculators — Loan, Investment, Tax & More | ${SITE_NAME}`,
  description:
    "India's smartest calculator platform. 50+ free calculators for loan EMI, SIP returns, income tax, and more. Calculate instantly with Numerral.",
  alternates: { canonical: canonicalUrl("/") },
};

const websiteSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export default function HomePage() {
  const loanCalcs = getCalculatorsByCategory("loan");

  return (
    <main>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteSchema }}
      />

      {/* Hero */}
      <section className="hero container">
        <h1 className="t-display hero__title">
          Free Online{" "}
          <span className="text-gradient">Calculators</span>
        </h1>
        <p className="hero__subtitle">
          Loan EMI, SIP returns, income tax — calculate anything instantly.
          Trusted by 1M+ users across India.
        </p>
      </section>

      {/* Explore by Category */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore by Category</h2>
        <CategoryGrid />
      </section>

      {/* Popular Calculators */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Popular Calculators</h2>
        <div className="calc-index-grid">
          {loanCalcs.slice(0, 6).map((calc: CalculatorDef) => (
            <Link
              key={calc.id}
              href={`/${calc.categorySlug}/${calc.slug}`}
              className="calc-index-card"
            >
              <span className="calc-index-card__icon">{calc.icon}</span>
              <div className="calc-index-card__body">
                <h3>{calc.title}</h3>
                <p>{calc.description}</p>
                <span className="calc-index-card__stars">
                  {"★".repeat(calc.stars)}{"☆".repeat(5 - calc.stars)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container section--sm" style={{ textAlign: "center" }}>
        <h2 className="t-h2" style={{ marginBottom: "var(--s-8)" }}>How It Works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-8)", maxWidth: "800px", marginInline: "auto" }}>
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "var(--s-3)" }}>📊</div>
            <h3 className="t-h4" style={{ marginBottom: "var(--s-2)" }}>Enter Details</h3>
            <p className="t-body-sm text-muted">Loan amount, interest rate, tenure — adjust sliders or type directly.</p>
          </div>
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "var(--s-3)" }}>⚡</div>
            <h3 className="t-h4" style={{ marginBottom: "var(--s-2)" }}>Instant Results</h3>
            <p className="t-body-sm text-muted">EMI, total interest, and comparisons compute live as you adjust.</p>
          </div>
          <div>
            <div style={{ fontSize: "2rem", marginBottom: "var(--s-3)" }}>✅</div>
            <h3 className="t-h4" style={{ marginBottom: "var(--s-2)" }}>Decide Smarter</h3>
            <p className="t-body-sm text-muted">Compare scenarios, share results, and make informed financial choices.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

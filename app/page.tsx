// Homepage — / (Server Component)
// 10-Section Authority Structure for Topical SEO

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import CategoryGrid from "@/components/shared/CategoryGrid";
import FAQAccordion from "@/components/shared/FAQAccordion";
import {
  getCalculatorsByCategory,
  getAllGuides,
  getAllGlossaryTerms,
  getTrendingItems,
  type CalculatorDef,
  type GuideDef,
} from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Online Calculators — Loan, Investment, Tax & More | ${SITE_NAME}`,
  description:
    "India's smartest calculator platform. 50+ free calculators for loan EMI, SIP returns, income tax, and more. Instant, accurate, and trusted by 1M+ users.",
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

const orgSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "India's smartest financial calculator platform — instant EMI, SIP, tax, and investment calculations.",
  sameAs: [],
});

const homepageFaqs = [
  { question: "What is Numerral?", answer: "Numerral is India's smartest financial calculator platform. It provides 50+ free calculators for loan EMI, investment returns, income tax, and everyday utilities — all with instant, accurate results." },
  { question: "Are the calculators on Numerral free?", answer: "Yes, all calculators on Numerral are 100% free to use. There are no hidden charges, sign-ups, or limits on usage." },
  { question: "How accurate are Numerral's financial calculators?", answer: "Our calculators use the same standard financial formulas used by banks and financial institutions — such as the reducing balance EMI formula, compound interest formula, and Income Tax Act slabs for FY 2025-26." },
  { question: "Can I use Numerral on mobile?", answer: "Absolutely. Numerral is fully responsive and works on all devices — smartphones, tablets, and desktops. No app download required." },
  { question: "What types of calculators does Numerral offer?", answer: "Numerral offers Loan Calculators (Car, Home, Personal, Education, Bike EMI), Investment Calculators (SIP, FD, RD, PPF, NPS, Mutual Fund), Tax Calculators (Income Tax, GST, HRA, TDS, Capital Gains), and Utility Calculators (Age, Percentage, Compound Interest, BMI, and more)." },
  { question: "How is EMI calculated?", answer: "EMI is calculated using the reducing balance formula: EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P is principal, r is monthly interest rate, and n is number of months. Our calculator computes this instantly as you adjust inputs." },
  { question: "Does Numerral store my financial data?", answer: "No. All calculations happen in your browser. We do not collect, store, or share any financial data you enter into our calculators." },
];

const knowledgeTopics = [
  { icon: "📐", title: "What is EMI?", desc: "Equated Monthly Instalment — the fixed payment you make to repay a loan over time, combining both principal and interest.", link: "/glossary/emi" },
  { icon: "📈", title: "Compound Interest vs Simple Interest", desc: "Compound interest grows exponentially by earning interest on interest, while simple interest is calculated only on the original principal.", link: "/glossary/compound-interest" },
  { icon: "🏦", title: "How SIP Returns Work", desc: "Systematic Investment Plans use rupee-cost averaging — you invest a fixed amount monthly, buying more units when prices are low.", link: "/glossary/sip" },
  { icon: "🧾", title: "Income Tax Slabs (FY 2025-26)", desc: "India's new tax regime offers lower rates with fewer deductions, while the old regime allows Section 80C, HRA, and other exemptions.", link: "/guides/income-tax-guide-fy-2025-26" },
  { icon: "💰", title: "What is CAGR?", desc: "Compound Annual Growth Rate measures how much an investment grows per year on average, smoothing out volatility over time.", link: "/glossary/cagr" },
  { icon: "🏠", title: "Fixed vs Floating Interest Rate", desc: "Fixed rates stay constant throughout the tenure; floating rates change with RBI's repo rate, affecting your EMI periodically.", link: "/guides/home-loan-guide-2026" },
];

const whyNumerralFeatures = [
  { icon: "⚡", title: "Instant Calculations", desc: "Results update in real-time as you adjust sliders. No page reloads, no delays." },
  { icon: "🔒", title: "100% Private", desc: "All calculations happen in your browser. We never store your financial data." },
  { icon: "🎯", title: "Bank-Grade Accuracy", desc: "Same reducing balance, compound interest, and tax slab formulas used by banks and CAs." },
  { icon: "📱", title: "Works Everywhere", desc: "Fully responsive on all devices — smartphones, tablets, and desktops. No app needed." },
  { icon: "📚", title: "Learn While You Calculate", desc: "Every calculator includes step-by-step breakdowns, formulas, FAQs, and financial guides." },
  { icon: "🇮🇳", title: "Built for India", desc: "Tax slabs, GST rules, EPF, NPS, PPF — all calculators reflect Indian financial regulations." },
  { icon: "✅", title: "Financial Formulas Verified", desc: "Numerral calculators use industry-standard financial formulas used by banks and financial institutions for EMI, compound interest, and tax estimation." },
];

export default function HomePage() {
  const loanCalcs = getCalculatorsByCategory("loan");
  const investCalcs = getCalculatorsByCategory("invest");
  const allCalcs = [...loanCalcs, ...investCalcs];
  const popularCalcs = allCalcs.slice(0, 6);
  const guides = getAllGuides();
  const glossary = getAllGlossaryTerms();
  const trending = getTrendingItems();

  return (
    <main>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteSchema }}
      />
      <Script
        id="schema-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: orgSchema }}
      />

      {/* ─── 1. HERO SECTION ─── */}
      <section className="hero container">
        <h1 className="t-display hero__title">
          India&apos;s Smartest{" "}
          <span className="text-gradient">Financial Calculators</span>
        </h1>
        <p className="hero__subtitle">
          50+ free calculators for loan EMI, SIP returns, income tax, and everyday math.
          Instant results, bank-grade accuracy — trusted by 1M+ users across India.
        </p>
        <p className="t-body text-muted" style={{ maxWidth: "780px", marginTop: "var(--s-4)", lineHeight: 1.8, textAlign: "center", marginInline: "auto" }}>
          Numerral provides free financial calculators that help individuals estimate loan EMIs, investment returns, tax liabilities, and financial planning scenarios. These calculators use standard financial formulas such as compound interest, amortization schedules, and tax computation models to generate accurate results instantly.
        </p>
      </section>

      {/* ─── 2. CATEGORY NAVIGATION ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Explore by Category</h2>
        <CategoryGrid />
      </section>

      {/* ─── 3. POPULAR CALCULATORS ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>Popular Calculators</h2>
        <div className="calc-index-grid">
          {popularCalcs.map((calc: CalculatorDef) => (
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

      {/* ─── TOP FINANCIAL CALCULATIONS (Semantic Text Block) ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-3)" }}>Top Financial Calculations in India</h2>
        <p className="t-body text-muted" style={{ maxWidth: "780px", lineHeight: 1.8 }}>
          Millions of Indians rely on financial calculators to estimate loan repayments, investment growth, and tax liabilities. Whether calculating a home loan EMI, estimating SIP returns, or evaluating compound interest, accurate financial calculations help individuals make informed financial decisions. Numerral&apos;s calculators cover the most common financial scenarios — from comparing fixed vs floating interest rates to projecting retirement corpus through NPS and PPF investments.
        </p>
      </section>

      {/* ─── 4. FINANCIAL CALCULATION KNOWLEDGE ─── */}
      <section className="hp-knowledge container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-2)" }}>Financial Calculation Knowledge</h2>
        <p className="t-body text-muted" style={{ marginBottom: "var(--s-6)", maxWidth: "640px" }}>
          Understanding the math behind your money — from EMI formulas to tax slabs and investment returns.
        </p>
        <div className="hp-knowledge__grid">
          {knowledgeTopics.map((topic) => (
            <Link key={topic.title} href={topic.link} className="hp-knowledge__card">
              <span className="hp-knowledge__icon">{topic.icon}</span>
              <div>
                <h3 className="hp-knowledge__title">{topic.title}</h3>
                <p className="hp-knowledge__desc">{topic.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 5. HOW FINANCIAL CALCULATIONS WORK ─── */}
      <section className="hp-how-it-works container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-8)", textAlign: "center" }}>How Financial Calculations Work</h2>
        <div className="hp-how-it-works__grid">
          <div className="hp-how-it-works__step">
            <div className="hp-how-it-works__num">1</div>
            <h3 className="t-h4">Enter Your Details</h3>
            <p className="t-body-sm text-muted">Loan amount, interest rate, tenure, income — adjust sliders or type directly into any calculator.</p>
          </div>
          <div className="hp-how-it-works__step">
            <div className="hp-how-it-works__num">2</div>
            <h3 className="t-h4">Instant Computation</h3>
            <p className="t-body-sm text-muted">Our engine applies standard financial formulas — reducing balance EMI, compound interest, tax slabs — instantly.</p>
          </div>
          <div className="hp-how-it-works__step">
            <div className="hp-how-it-works__num">3</div>
            <h3 className="t-h4">Compare & Decide</h3>
            <p className="t-body-sm text-muted">See breakdowns, comparison tables, and charts. Compare scenarios side by side to make informed financial decisions.</p>
          </div>
        </div>
      </section>

      {/* ─── 6. FEATURED FINANCIAL GUIDES ─── */}
      <section className="container section--sm">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-5)" }}>
          <h2 className="t-h2">Featured Financial Guides</h2>
          <Link href="/guides" className="hp-view-all">View All Guides →</Link>
        </div>
        <div className="hp-guides__grid">
          {guides.slice(0, 4).map((guide: GuideDef) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="hp-guide-card">
              <div className="hp-guide-card__img">
                <Image
                  src={`/images/guides/${guide.slug}.png`}
                  alt={guide.title}
                  width={400}
                  height={220}
                  style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "var(--r-md) var(--r-md) 0 0" }}
                />
              </div>
              <div className="hp-guide-card__body">
                <span className="hp-guide-card__category">{guide.category}</span>
                <h3 className="hp-guide-card__title">{guide.title}</h3>
                <p className="hp-guide-card__desc">{guide.description.slice(0, 100)}…</p>
                <span className="hp-guide-card__meta">📖 {guide.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 7. GLOSSARY HIGHLIGHTS ─── */}
      <section className="hp-glossary container section--sm">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-5)" }}>
          <div>
            <h2 className="t-h2">Financial Glossary</h2>
            <p className="t-body-sm text-muted" style={{ marginTop: "var(--s-1)" }}>100+ financial terms explained simply</p>
          </div>
          <Link href="/glossary" className="hp-view-all">Browse Full Glossary →</Link>
        </div>
        <div className="hp-glossary__grid">
          {glossary.slice(0, 12).map((term) => (
            <Link key={term.slug} href={`/glossary/${term.slug}`} className="hp-glossary__chip">
              <span className="hp-glossary__term">{term.term}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 8. TRENDING CALCULATORS ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)" }}>🔥 Trending Calculators</h2>
        <div className="hp-trending__grid">
          {trending.map((item) => (
            <Link key={item.name} href={item.href} className="hp-trending__card">
              <span className="hp-trending__arrow">→</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 9. WHY USE NUMERRAL ─── */}
      <section className="hp-why container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-2)", textAlign: "center" }}>Why 1M+ Indians Trust Numerral</h2>
        <p className="t-body text-muted" style={{ textAlign: "center", marginBottom: "var(--s-8)", maxWidth: "600px", marginInline: "auto" }}>
          Accurate, private, and built for India — here&apos;s what sets us apart.
        </p>
        <div className="hp-why__grid">
          {whyNumerralFeatures.map((f) => (
            <div key={f.title} className="hp-why__card">
              <span className="hp-why__icon">{f.icon}</span>
              <h3 className="hp-why__title">{f.title}</h3>
              <p className="hp-why__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 10. FAQs ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)", textAlign: "center" }}>Frequently Asked Questions</h2>
        <div style={{ maxWidth: "760px", marginInline: "auto" }}>
          <FAQAccordion title="About Numerral" items={homepageFaqs} />
        </div>
      </section>
    </main>
  );
}

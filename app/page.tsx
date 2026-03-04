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
          Numerral provides free financial calculators that help individuals estimate loan EMIs,
          investment returns, tax liabilities, and financial planning scenarios. These calculators
          use standard financial formulas such as compound interest, amortization schedules, and
          tax computation models to generate accurate results instantly.
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

      {/* ─── TOP FINANCIAL CALCULATIONS (Semantic Rich Section) ─── */}
      <section className="hp-top-calcs container section--sm">
        <div className="hp-top-calcs__inner">
          <h2 className="t-h2">Top Financial Calculations in India</h2>
          <p className="hp-top-calcs__intro">
            Millions of Indians rely on financial calculators to estimate loan repayments, investment growth, and tax liabilities.
            Accurate financial calculations help individuals make informed decisions about their money.
          </p>
          <div className="hp-top-calcs__grid">
            <div className="hp-top-calcs__item">
              <div className="hp-top-calcs__icon-box hp-top-calcs__icon-box--blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </div>
              <div>
                <strong>Loan EMI Calculations</strong>
                <p>Home loan, car loan, and personal loan EMI estimation using reducing balance method</p>
              </div>
            </div>
            <div className="hp-top-calcs__item">
              <div className="hp-top-calcs__icon-box hp-top-calcs__icon-box--green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <div>
                <strong>SIP &amp; Investment Returns</strong>
                <p>Mutual fund SIP projections, FD maturity, PPF corpus, and compound interest growth</p>
              </div>
            </div>
            <div className="hp-top-calcs__item">
              <div className="hp-top-calcs__icon-box hp-top-calcs__icon-box--amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <div>
                <strong>Income Tax &amp; GST</strong>
                <p>Old vs new regime comparison, HRA exemption, TDS refund, and GST calculations</p>
              </div>
            </div>
            <div className="hp-top-calcs__item">
              <div className="hp-top-calcs__icon-box hp-top-calcs__icon-box--purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <div>
                <strong>Financial Comparisons</strong>
                <p>Fixed vs floating rates, SIP vs FD, rent vs buy, and loan vs cash purchase analysis</p>
              </div>
            </div>
          </div>
          <div className="hp-top-calcs__footer">
            <p className="hp-top-calcs__cta">
              Numerral&apos;s calculators cover the most common financial scenarios — from comparing interest rates to projecting retirement corpus through NPS and PPF investments.
            </p>
            <Link href="/loan-calculators" className="hp-top-calcs__link">
              Explore All Calculators →
            </Link>
          </div>
        </div>
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

        {/* Formula Verified — Full-width trust banner */}
        <div className="hp-formula-banner">
          <div className="hp-formula-banner__icon">🛡️</div>
          <div className="hp-formula-banner__content">
            <h3 className="hp-formula-banner__title">Financial Formulas Verified</h3>
            <p className="hp-formula-banner__text">
              Every Numerral calculator uses <strong>industry-standard financial formulas</strong> verified against bank calculations.
              Our EMI calculator uses the reducing balance method, investment tools use compound interest formulas, and tax calculators follow
              the latest Income Tax Act slabs — the same models used by <strong>leading banks, CAs, and financial institutions</strong> across India.
            </p>
            <div className="hp-formula-banner__badges">
              <span className="hp-formula-badge">✓ Reducing Balance EMI</span>
              <span className="hp-formula-badge">✓ Compound Interest (A=P(1+r/n)ⁿᵗ)</span>
              <span className="hp-formula-badge">✓ FY 2025-26 Tax Slabs</span>
              <span className="hp-formula-badge">✓ RBI-Linked Rates</span>
            </div>
          </div>
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

// Homepage — / (Server Component)
// Redesigned 7-Section Layout — Inch Calculator Inspired

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import HomeSearchBar from "@/components/shared/HomeSearchBar";
import FAQAccordion from "@/components/shared/FAQAccordion";
import {
  getAllCalculators,
  getCalculatorsByCategory,
  getAllCategories,
  type CalculatorDef,
  type CategoryDef,
} from "@/lib/data";
import { canonicalUrl } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Free Online Calculators — Loan, Investment, Tax & More | ${SITE_NAME}`,
  description:
    "India's smartest calculator platform. 50+ free online calculators for loan EMI, SIP returns, income tax, and more. Instant results, bank-grade accuracy.",
  keywords:
    "finance calculators, online financial calculators, free finance tools, loan calculator, SIP calculator, tax calculator India",
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
  description:
    "India's smartest financial calculator platform — instant EMI, SIP, tax, and investment calculations.",
  sameAs: [],
});

const homepageFaqs = [
  {
    question: "What is Numerral?",
    answer:
      "Numerral is India's smartest financial calculator platform. It provides 50+ free calculators for loan EMI, investment returns, income tax, and everyday utilities — all with instant, accurate results.",
  },
  {
    question: "Are the calculators on Numerral free?",
    answer:
      "Yes, all calculators on Numerral are 100% free to use. There are no hidden charges, sign-ups, or limits on usage.",
  },
  {
    question: "How accurate are Numerral's financial calculators?",
    answer:
      "Our calculators use the same standard financial formulas used by banks and financial institutions — such as the reducing balance EMI formula, compound interest formula, and Income Tax Act slabs for FY 2025-26.",
  },
  {
    question: "Can I use Numerral on mobile?",
    answer:
      "Absolutely. Numerral is fully responsive and works on all devices — smartphones, tablets, and desktops. No app download required.",
  },
  {
    question: "What types of calculators does Numerral offer?",
    answer:
      "Numerral offers Loan Calculators (Car, Home, Personal, Education, Bike EMI), Investment Calculators (SIP, FD, RD, PPF, NPS, Mutual Fund), Tax Calculators (Income Tax, GST, HRA, TDS, Capital Gains), Salary Calculators, Business Calculators, and Utility Calculators (Age, Percentage, Compound Interest, BMI, and more).",
  },
  {
    question: "How is EMI calculated?",
    answer:
      "EMI is calculated using the reducing balance formula: EMI = P × r × (1+r)^n / ((1+r)^n – 1), where P is principal, r is monthly interest rate, and n is number of months.",
  },
  {
    question: "Does Numerral store my financial data?",
    answer:
      "No. All calculations happen in your browser. We do not collect, store, or share any financial data you enter into our calculators.",
  },
];

const trustBrands = [
  "Economic Times",
  "Mint",
  "Business Standard",
  "NDTV Profit",
  "MoneyControl",
  "The Hindu",
];

export default function HomePage() {
  const allCalcs = getAllCalculators();
  const categories = getAllCategories();

  // For the search bar — pass serializable data
  const searchCalcs = allCalcs.map((c) => ({
    title: c.title,
    slug: c.slug,
    categorySlug: c.categorySlug,
    icon: c.icon,
    description: c.description,
  }));

  // Featured calculator
  const featuredCalc = allCalcs.find((c) => c.id === "home-loan-emi") || allCalcs[0];

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

      {/* ─── 1. SEARCH HERO ─── */}
      <section className="hp-hero">
        <div className="hp-hero__inner container">
          <h1 className="hp-hero__title">
            Find Your <span className="text-gradient">Calculator</span>
          </h1>
          <p className="hp-hero__subtitle">
            Explore <strong>50+ free calculators</strong> designed to help solve everyday problems quickly and easily.
          </p>
          <HomeSearchBar calculators={searchCalcs} />
        </div>
      </section>

      {/* ─── 2. CATEGORY ICON GRID ─── */}
      <section className="hp-categories container">
        <div className="hp-categories__grid">
          {categories.map((cat: CategoryDef) => (
            <Link key={cat.key} href={cat.href} className="hp-categories__tile">
              <span className="hp-categories__tile-icon">{cat.icon}</span>
              <span className="hp-categories__tile-label">{cat.name.replace(" Calculators", "")}</span>
            </Link>
          ))}
        </div>
        <div className="hp-categories__cta">
          <Link href="/loan-calculators" className="btn-premium btn-premium--primary">
            Explore All Calculators
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ─── 3. TRUST BAR ─── */}
      <section className="hp-trust">
        <div className="hp-trust__inner container">
          <p className="hp-trust__label">Featured In</p>
          <div className="hp-trust__logos">
            {trustBrands.map((brand) => (
              <span key={brand} className="hp-trust__brand">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. FEATURED CALCULATOR ─── */}
      <section className="hp-featured container">
        <div className="hp-featured__inner">
          <div className="hp-featured__badge">FEATURED CALCULATOR</div>
          <h2 className="hp-featured__title">{featuredCalc.icon} {featuredCalc.title}</h2>
          <p className="hp-featured__desc">{featuredCalc.description}</p>
          <Link
            href={`/${featuredCalc.categorySlug}/${featuredCalc.slug}`}
            className="btn-premium btn-premium--primary"
          >
            Open Calculator →
          </Link>
        </div>
      </section>

      {/* ─── 5. ABOUT NUMERRAL ─── */}
      <section className="hp-about container">
        <h2 className="hp-about__title">About Numerral</h2>
        <div className="hp-about__content">
          <p>
            Numerral provides free, accurate, and instant financial calculators trusted by millions of users across India.
            Our tools use the same standard financial formulas used by banks and financial institutions — including
            reducing balance EMI, compound interest, and the latest FY 2025-26 income tax slabs.
          </p>
          <p>
            All calculations happen locally in your browser. We never store, collect, or share your financial data.
            Whether you&apos;re planning a home loan, estimating SIP returns, computing income tax, or converting units — 
            Numerral provides precise results instantly on any device with no sign-up required.
          </p>
        </div>
        <div className="hp-about__features">
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">⚡</span>
            <div>
              <strong>Instant Results</strong>
              <p>Real-time calculations as you adjust inputs. No page reloads.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">🔒</span>
            <div>
              <strong>100% Private</strong>
              <p>All computations run in your browser. Zero data stored.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">🎯</span>
            <div>
              <strong>Bank-Grade Accuracy</strong>
              <p>Same formulas used by banks, CAs, and financial institutions.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">📱</span>
            <div>
              <strong>Works Everywhere</strong>
              <p>Fully responsive on mobile, tablet, and desktop. No app needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. POPULAR CALCULATORS BY CATEGORY ─── */}
      <section className="hp-popular container">
        <h2 className="hp-popular__heading">Popular Calculators</h2>
        <p className="hp-popular__subheading">
          Choose a category below to find calculators for loans, investments, tax, and more.
        </p>

        <div className="hp-popular__categories">
          {categories.map((cat: CategoryDef) => {
            const calcs = getCalculatorsByCategory(cat.key);
            return (
              <div key={cat.key} className="hp-popular__cat-block">
                <div className="hp-popular__cat-header">
                  <span className="hp-popular__cat-icon">{cat.icon}</span>
                  <h3 className="hp-popular__cat-title">{cat.name}</h3>
                </div>
                <ul className="hp-popular__list">
                  {calcs.slice(0, 5).map((calc: CalculatorDef) => (
                    <li key={calc.id}>
                      <Link
                        href={`/${calc.categorySlug}/${calc.slug}`}
                        className="hp-popular__link"
                      >
                        <span className="hp-popular__link-icon">{calc.icon}</span>
                        <span className="hp-popular__link-title">{calc.title}</span>
                        <span className="hp-popular__link-arrow">›</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={cat.href} className="hp-popular__see-all">
                  See all {cat.name} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 7. FAQs ─── */}
      <section className="container section--sm">
        <h2 className="t-h2" style={{ marginBottom: "var(--s-5)", textAlign: "center" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ maxWidth: "760px", marginInline: "auto" }}>
          <FAQAccordion title="About Numerral" items={homepageFaqs} />
        </div>
      </section>
    </main>
  );
}

// Homepage — / (Server Component)
// Redesigned 7-Section Layout — Universal Calculator Platform

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
  title: `346+ Free Online Calculators — Finance, Construction, Health & More | ${SITE_NAME}`,
  description:
    "Numerral offers 346+ free online calculators across finance, construction, health, EV, and everyday math. Instant results, transparent formulas, zero data collection. Available in 6 languages.",
  keywords:
    "online calculators, free calculators, loan EMI calculator, SIP calculator, construction calculator, BMI calculator, EV calculator, tax calculator, health calculator, financial calculator, compound interest calculator, mortgage calculator",
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
    "Free online calculator platform with 346+ tools covering loan EMI, investment returns, income tax, construction material estimation, health metrics, EV cost analysis, and everyday math. Available in 6 languages.",
  sameAs: [],
});

const homepageFaqs = [
  {
    question: "What is Numerral?",
    answer:
      "Numerral is a free online calculator platform with 346+ calculators across 10 categories — including finance (loan EMI, SIP, FD, tax), construction (concrete, lumber, roofing, flooring), health (BMI, TDEE, calories, body fat), electric vehicles (charging cost, range, TCO), and everyday utility tools. All calculators produce instant results using standard, transparent formulas.",
  },
  {
    question: "How many calculators does Numerral have?",
    answer:
      "Numerral currently offers 346+ calculators organized into 10 categories: Loan Calculators (23), Investment Calculators (17), Tax Calculators (8), Utility Calculators (8), Salary Calculators (6), Business Calculators (13), Time & Date Calculators (15), Construction Calculators (162), EV Calculators (22), and Health Calculators (72). New calculators are added regularly.",
  },
  {
    question: "Are all calculators on Numerral free to use?",
    answer:
      "Yes. Every calculator on Numerral is 100% free with no sign-up, no account required, and no usage limits. There are no hidden fees or premium tiers.",
  },
  {
    question: "What formulas do Numerral calculators use?",
    answer:
      "Each calculator uses industry-standard formulas. Loan EMI calculators use the reducing balance amortization formula. Investment calculators use compound interest and XIRR. Health calculators use peer-reviewed equations such as Mifflin-St Jeor for BMR and the standard BMI formula (weight in kg ÷ height in m²). Construction calculators use material estimation formulas based on dimensional analysis and industry waste factors.",
  },
  {
    question: "Does Numerral store my data?",
    answer:
      "No. All calculations run entirely in your browser using client-side JavaScript. Numerral does not collect, store, transmit, or share any data you enter into any calculator. There are no cookies tracking your inputs.",
  },
  {
    question: "What languages is Numerral available in?",
    answer:
      "Numerral is available in 6 languages: English, Arabic (العربية), Chinese (中文), German (Deutsch), Indonesian (Bahasa Indonesia), and Turkish (Türkçe). Each version is fully localized with native-language content and culturally relevant calculator configurations.",
  },
  {
    question: "Can I use Numerral on my phone?",
    answer:
      "Yes. Numerral is a fully responsive web application that works on smartphones, tablets, and desktops. No app download required — open numerral.com in any modern browser to access all 346+ calculators instantly.",
  },
  {
    question: "How accurate are the construction calculators?",
    answer:
      "Numerral's 162 construction calculators use standard material estimation formulas with configurable waste factors. They cover concrete volume, lumber board feet, roofing squares, flooring coverage, drywall sheets, paint area, gravel tonnage, insulation R-value, and 150+ other building project types. Results match industry estimating practices used by contractors and builders.",
  },
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

  // Total calculator count
  const totalCalcs = allCalcs.length;

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
            Explore <strong>{totalCalcs}+ free calculators</strong> for finance, construction, health, electric vehicles, and everyday math — instant results, zero sign-up.
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

      {/* ─── 3. PLATFORM STATS ─── */}
      <section className="hp-trust">
        <div className="hp-trust__inner container">
          <div className="hp-trust__logos">
            <span className="hp-trust__brand"><strong>{totalCalcs}+</strong> Calculators</span>
            <span className="hp-trust__brand"><strong>10</strong> Categories</span>
            <span className="hp-trust__brand"><strong>6</strong> Languages</span>
            <span className="hp-trust__brand"><strong>0</strong> Data Collected</span>
            <span className="hp-trust__brand"><strong>100%</strong> Free</span>
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
            Numerral is a free online calculator platform offering {totalCalcs}+ tools across 10 specialized categories.
            Our finance calculators use the reducing balance EMI formula, compound interest computation, XIRR for 
            irregular cash flows, and current FY 2025-26 Indian income tax slabs. Construction calculators cover 
            material estimation for concrete volume, lumber board feet, roofing squares, flooring coverage, 
            insulation R-value, and 150+ building project types with configurable waste factors.
          </p>
          <p>
            Health calculators compute BMI, basal metabolic rate (BMR) via Mifflin-St Jeor and Harris-Benedict 
            equations, total daily energy expenditure (TDEE), body fat percentage, macro distribution, calorie 
            targets, and pregnancy due dates. EV calculators compare electric vs. gasoline total cost of ownership, 
            estimate per-kWh charging costs, project battery degradation, and calculate fuel savings over time. 
            Every calculation runs in your browser — Numerral collects zero user data.
          </p>
        </div>
        <div className="hp-about__features">
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">⚡</span>
            <div>
              <strong>Instant Results</strong>
              <p>Real-time calculations as you adjust inputs. No page reloads or server round-trips.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">🔒</span>
            <div>
              <strong>100% Private</strong>
              <p>All computation runs client-side in your browser. Zero data stored or transmitted.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">🎯</span>
            <div>
              <strong>Transparent Formulas</strong>
              <p>Every calculator uses documented, standard formulas — the same used by professionals in each field.</p>
            </div>
          </div>
          <div className="hp-about__feature">
            <span className="hp-about__feature-icon">🌐</span>
            <div>
              <strong>Available in 6 Languages</strong>
              <p>Fully localized in English, Arabic, Chinese, German, Indonesian, and Turkish.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. POPULAR CALCULATORS BY CATEGORY ─── */}
      <section className="hp-popular container">
        <h2 className="hp-popular__heading">Popular Calculators</h2>
        <p className="hp-popular__subheading">
          Browse {totalCalcs}+ calculators across finance, construction, health, EV, and everyday math.
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

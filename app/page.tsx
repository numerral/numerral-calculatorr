// Homepage — / (Server Component)
// Premium World-Class Redesign — Numerral Calculator Platform
// Sections: Hero · Stats · Popular · Categories · Country Layer · Trending · Trust · How It Works · FAQ · Deep Link

import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import CalcIcon from "@/components/shared/CalcIcon";
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
import { SITE_NAME, SITE_URL, TOTAL_CALCULATORS, TOTAL_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${TOTAL_CALCULATORS}+ Free Online Calculators — Finance, Tax, Health & More | ${SITE_NAME}`,
  description:
    `Numerral offers ${TOTAL_CALCULATORS}+ free online calculators for mortgage, salary, BMI, tax, retirement, and more. Accurate formulas, instant results, zero sign-up. Available for US, India, UAE, and Saudi Arabia.`,
  keywords:
    "free online calculators, mortgage calculator, salary calculator, BMI calculator, retirement calculator, sales tax calculator, percentage calculator, loan calculator, finance calculator",
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
  description: `Free online calculator platform with ${TOTAL_CALCULATORS}+ tools covering mortgage, loans, income tax, health, retirement, and everyday math. Available in 6 languages across US, India, UAE, and Saudi Arabia.`,
  sameAs: [],
});

// ─── US-Priority Popular Calculators ───
const US_POPULAR = [
  { icon: "mortgage", title: "Mortgage Calculator", href: "/loan-calculators/mortgage-calculator", desc: "Estimate monthly payments, total interest & amortization schedule", tag: "Most Used" },
  { icon: "emi", title: "EMI Calculator", href: "/in/home-loan-calculator", desc: "Loan EMI with full amortization breakdown & prepayment insights", tag: "Trending" },
  { icon: "bmi", title: "BMI Calculator", href: "/health-calculators/bmi-calculator", desc: "Body Mass Index using WHO categories with health interpretation", tag: "Health" },
  { icon: "salary", title: "Salary Calculator", href: "/in/in-hand-salary-calculator", desc: "Gross to net pay with full tax & deduction breakdown", tag: "Popular" },
  { icon: "retirement", title: "Retirement Calculator", href: "/in/retirement-corpus-calculator", desc: "Build your retirement corpus with year-by-year projections", tag: "Finance" },
  { icon: "loan", title: "Loan Calculator", href: "/loan-calculators/personal-loan-emi", desc: "Any loan type — personal, auto, student — with full breakdown", tag: "Popular" },
  { icon: "age", title: "Age Calculator", href: "/utility-calculators/age-calculator", desc: "Exact age in years, months, and days with milestone tracking", tag: "Everyday" },
  { icon: "percentage", title: "Percentage Calculator", href: "/math-calculators/percentage-calculator", desc: "5 modes: percent of, change, increase, decrease & reverse", tag: "Math" },
];


// ─── Category Cards ───
const CATEGORY_CARDS = [
  { icon: "finance", title: "Finance Calculators", desc: "Mortgage, loans, compound interest & more", href: "/loan-calculators", count: "60+", accent: "indigo" },
  { icon: "tax", title: "Tax Calculators", desc: "Income tax, sales tax, VAT & deductions", href: "/tax-calculators", count: "40+", accent: "purple" },
  { icon: "health", title: "Health Calculators", desc: "BMI, TDEE, calories, ideal weight & more", href: "/health-calculators", count: "30+", accent: "rose" },
  { icon: "construction", title: "Construction Calculators", desc: "Concrete, lumber, roofing & materials", href: "/construction-calculators", count: "150+", accent: "amber" },
  { icon: "math", title: "Math Calculators", desc: "Percentage, ratios, algebra & geometry", href: "/math-calculators", count: "20+", accent: "teal" },
  { icon: "investment", title: "Investment Calculators", desc: "SIP, compound interest, retirement & goals", href: "/investment-calculators", count: "25+", accent: "emerald" },
  { icon: "ev", title: "EV Calculators", desc: "Charging cost, range, savings & TCO", href: "/ev-calculators", count: "15+", accent: "cyan" },
  { icon: "automotive", title: "Automotive Calculators", desc: "Car loan, fuel cost, depreciation & more", href: "/automotive-calculators", count: "20+", accent: "blue" },
];

// ─── Country Discovery ───
const COUNTRIES = [
  {
    flag: "🇺🇸", name: "United States", code: "us", href: "/",
    label: "US Priority",
    tools: ["Mortgage Calculator", "Sales Tax Calculator", "Retirement Calculator", "Salary Calculator"],
    color: "blue",
  },
  {
    flag: "🇮🇳", name: "India", code: "in", href: "/in",
    label: "India – ₹ INR",
    tools: ["EMI Calculator", "GST Calculator", "Income Tax (FY26)", "SIP Calculator"],
    color: "saffron",
  },
  {
    flag: "🇦🇪", name: "UAE", code: "ae", href: "/uae",
    label: "UAE – AED",
    tools: ["VAT Calculator", "Salary Calculator", "Gratuity Calculator", "Loan Calculator"],
    color: "green",
  },
  {
    flag: "🇸🇦", name: "Saudi Arabia", code: "sa", href: "/ksa",
    label: "KSA – SAR",
    tools: ["Zakat Calculator", "End of Service", "GOSI Calculator", "Salary Calculator"],
    color: "gold",
  },
];

// ─── Trending Calculators ───
const TRENDING = [
  { icon: "mortgage", title: "Mortgage Calculator", href: "/loan-calculators/mortgage-calculator", tag: "Most Used" },
  { icon: "compound-interest", title: "Compound Interest Calculator", href: "/utility-calculators/compound-interest-calculator", tag: "Finance" },
  { icon: "bmi", title: "BMI Calculator", href: "/health-calculators/bmi-calculator", tag: "Health" },
  { icon: "sales-tax", title: "Sales Tax Calculator", href: "/tax-calculators/income-tax-calculator", tag: "Trending" },
  { icon: "salary", title: "Salary Calculator", href: "/in/in-hand-salary-calculator", tag: "Popular" },
  { icon: "age", title: "Age Calculator", href: "/utility-calculators/age-calculator", tag: "Everyday" },
  { icon: "retirement", title: "Retirement Calculator", href: "/in/retirement-corpus-calculator", tag: "Planning" },
  { icon: "ev", title: "EV Cost Calculator", href: "/ev-calculators/ev-cost-per-mile-calculator", tag: "Trending" },
];


// ─── Trust features ───
const TRUST_FEATURES = [
  { icon: "verified",   color: "indigo",  title: "Verified Formulas",    desc: "Every calculator uses peer-reviewed, industry-standard formulas. Results match professional-grade financial and scientific tools." },
  { icon: "private",   color: "violet",  title: "100% Private",          desc: "All calculations run in your browser. Zero data collected, stored, or transmitted — ever. No account needed." },
  { icon: "instant",   color: "amber",   title: "Instant Results",       desc: "Real-time answers as you type. No page reloads, no loading spinners, no waiting. Results in under a second." },
  { icon: "users",     color: "teal",    title: "Used by 1M+ Users",     desc: "Trusted by over a million monthly users for mortgage, EMI, health, and tax calculations. Completely free, forever." },
  { icon: "globe",     color: "blue",    title: "Country-Aware Logic",   desc: "Tools adapt to local tax laws, regulations, and currencies — US, India (₹), UAE (AED), and Saudi Arabia (SAR)." },
  { icon: "graduation",color: "emerald", title: "Accurate & Tested",     desc: "Results are cross-validated against CFA, NISM, and WHO standards. What you see matches real-world professional calculations." },
];

// ─── How It Works steps ───
const HOW_STEPS = [
  { num: "01", title: "Find Your Calculator", desc: "Search or browse 500+ tools across finance, health, math, and everyday use. Find any tool in under 5 seconds.",    icon: "search"    },
  { num: "02", title: "Enter Your Values",    desc: "Type in your numbers — intuitive inputs, smart defaults, and presets make it instant. No manual formula needed.",      icon: "pen"       },
  { num: "03", title: "Get Instant Answers",  desc: "Results appear as you type. See full breakdowns, step-by-step logic, and charts — not just a bare number.",           icon: "chart"     },
  { num: "04", title: "Make Better Decisions",desc: "Each result includes real-life context, decision insights, and links to related tools so you can go deeper.",          icon: "lightbulb" },
];

// ─── Differentiators ───
const DIFFERENTIATORS = [
  {
    icon: "formula",
    title: "Shows the Formula",
    desc: "Every calculator shows the exact formula used. You're not trusting a black box — you see the math behind every result.",
    highlight: "Transparent by design",
  },
  {
    icon: "steps",
    title: "Step-by-Step Breakdown",
    desc: "Complex calculations are broken into readable steps. See how each component contributes to the final number.",
    highlight: "Education built in",
  },
  {
    icon: "examples",
    title: "Real-Life Examples",
    desc: "Every calculator comes with worked examples using realistic scenarios — not abstract numbers. Immediately usable.",
    highlight: "Context, not just results",
  },
  {
    icon: "insights",
    title: "Decision Insights",
    desc: "Beyond the result, Numerral tells you what it means — is this EMI too high? Is this BMI healthy? What should you do next?",
    highlight: "Calculator → Advisor",
  },
];

// ─── Homepage FAQs ───
const homepageFaqs = [
  {
    question: "What is Numerral?",
    answer: `Numerral is a free online calculator platform with ${TOTAL_CALCULATORS}+ calculators across ${TOTAL_CATEGORIES} categories — covering finance (mortgage, loans, retirement), tax (income tax, sales tax, VAT), health (BMI, TDEE, calories), construction (concrete, lumber, roofing), and everyday math. All calculators produce instant results using standard, transparent formulas.`,
  },
  {
    question: "Are Numerral calculators accurate?",
    answer: "Yes. Each calculator uses industry-standard formulas verified against professional references. Loan calculators use the reducing balance amortization formula. Health calculators use peer-reviewed equations like Mifflin-St Jeor for BMR and the WHO BMI formula. Tax calculators reflect current US federal rates and state-specific rules.",
  },
  {
    question: "Can I use Numerral for country-specific calculations?",
    answer: "Absolutely. Numerral has dedicated calculator hubs for India (/in), UAE (/uae), and Saudi Arabia (/ksa). Each hub uses local tax laws, currencies, and regulatory frameworks — such as Indian income tax slabs for FY 2025-26, UAE VAT at 5%, and KSA Zakat and GOSI rules.",
  },
  {
    question: "Which calculators are most popular on Numerral?",
    answer: "The most-used calculators are: Mortgage Calculator, Car Loan Calculator, Salary Calculator, BMI Calculator, Compound Interest Calculator, Retirement Calculator, Age Calculator, and Percentage Calculator. For India users: EMI Calculator, GST Calculator, SIP Calculator, and Income Tax Calculator.",
  },
  {
    question: "Are all calculators on Numerral free?",
    answer: "Yes — 100% free, with no account required, no usage limits, and no hidden fees. There are no premium plans or paywalls. Every calculator on numerral.com is free to use as many times as you need.",
  },
  {
    question: "Does Numerral store my data?",
    answer: "No. All calculations run entirely in your browser using client-side JavaScript. Numerral does not collect, store, transmit, or share any data you enter into any calculator. There are no server round-trips for calculations.",
  },
  {
    question: "What languages is Numerral available in?",
    answer: "Numerral is available in 6 languages: English, Arabic (العربية), Chinese (中文), German (Deutsch), Indonesian (Bahasa Indonesia), and Turkish (Türkçe). Each version is fully localized with native-language content.",
  },
];

// ─── Quick access chips ───
const QUICK_CHIPS = [
  { label: "EMI Calculator", href: "/in/home-loan-calculator" },
  { label: "BMI Calculator", href: "/health-calculators/bmi-calculator" },
  { label: "Loan Calculator", href: "/loan-calculators/personal-loan-emi" },
  { label: "Mortgage", href: "/loan-calculators/mortgage-calculator" },
  { label: "Salary", href: "/in/in-hand-salary-calculator" },
  { label: "Retirement", href: "/in/retirement-corpus-calculator" },
  { label: "Age Calculator", href: "/utility-calculators/age-calculator" },
  { label: "Percentage", href: "/math-calculators/percentage-calculator" },
];

export default function HomePage() {
  const allCalcs = getAllCalculators();
  const categories = getAllCategories();

  const searchCalcs = allCalcs.map((c) => ({
    title: c.title,
    slug: c.slug,
    categorySlug: c.categorySlug,
    icon: c.icon,
    description: c.description,
  }));

  const totalCalcs = allCalcs.length;

  return (
    <main className="hp-main">
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

      {/* ═══════════════════════════════════
          1. HERO SECTION
          ═══════════════════════════════════ */}
      <section className="hp-hero" aria-label="Search calculators">
        <div className="hp-hero__bg-dots" aria-hidden="true" />
        <div className="hp-hero__bg-glow" aria-hidden="true" />
        <div className="hp-hero__inner container">

          <div className="hp-hero__badge">
            <span className="hp-hero__badge-dot" />
            Verified Formulas · Instant Results · 100% Free · No Sign-Up
          </div>

          <h1 className="hp-hero__title">
            Smart Calculators for{" "}
            <span className="hp-hero__title-gradient">Real-Life Decisions</span>
          </h1>

          <p className="hp-hero__subtitle">
            Calculate, Understand, and Decide Better with Numerral.
            {totalCalcs}+ free tools for finance, health, tax, and everyday decisions — results in seconds.
          </p>

          <div className="hp-hero__search-wrap">
            <HomeSearchBar calculators={searchCalcs} />
          </div>

          <nav className="hp-hero__chips" aria-label="Quick calculator access">
            {QUICK_CHIPS.map((chip) => (
              <Link key={chip.href} href={chip.href} className="hp-hero__chip">
                {chip.label}
              </Link>
            ))}
          </nav>

          <div className="hp-hero__countries">
            <span className="hp-hero__countries-label">Available for:</span>
            <Link href="/" className="hp-hero__country-pill hp-hero__country-pill--active">🇺🇸 USA</Link>
            <Link href="/in" className="hp-hero__country-pill">🇮🇳 India</Link>
            <Link href="/uae" className="hp-hero__country-pill">🇦🇪 UAE</Link>
            <Link href="/ksa" className="hp-hero__country-pill">🇸🇦 Saudi Arabia</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          2. PLATFORM STATS BAR
          ═══════════════════════════════════ */}
      <section className="hp-stats" aria-label="Platform statistics">
        <div className="hp-stats__inner container">
          <div className="hp-stats__item">
            <span className="hp-stats__num">{totalCalcs}+</span>
            <span className="hp-stats__label">Calculators</span>
          </div>
          <div className="hp-stats__divider" aria-hidden="true" />
          <div className="hp-stats__item">
            <span className="hp-stats__num">{categories.length}</span>
            <span className="hp-stats__label">Categories</span>
          </div>
          <div className="hp-stats__divider" aria-hidden="true" />
          <div className="hp-stats__item">
            <span className="hp-stats__num">4</span>
            <span className="hp-stats__label">Countries</span>
          </div>
          <div className="hp-stats__divider" aria-hidden="true" />
          <div className="hp-stats__item">
            <span className="hp-stats__num">6</span>
            <span className="hp-stats__label">Languages</span>
          </div>
          <div className="hp-stats__divider" aria-hidden="true" />
          <div className="hp-stats__item">
            <span className="hp-stats__num">0</span>
            <span className="hp-stats__label">Data Collected</span>
          </div>
          <div className="hp-stats__divider" aria-hidden="true" />
          <div className="hp-stats__item">
            <span className="hp-stats__num">100%</span>
            <span className="hp-stats__label">Free</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          3. POPULAR CALCULATORS (US-first)
          ═══════════════════════════════════ */}
      <section className="hp-popular section" aria-labelledby="popular-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Start Calculating</div>
            <h2 id="popular-heading" className="hp-section-title">
              Featured Calculators
            </h2>
            <p className="hp-section-subtitle">
              The most-used tools on Numerral. Built for accuracy, designed for clarity.
            </p>
          </div>

          <div className="hp-calc-grid" role="list">
            {US_POPULAR.map((calc) => (
              <Link key={calc.href} href={calc.href} className="hp-calc-card" role="listitem">
                <div className="hp-calc-card__header">
                  <span className="hp-calc-card__icon"><CalcIcon name={calc.icon} size={24} /></span>
                  <span className={`hp-calc-card__tag hp-calc-card__tag--${calc.tag === "Most Used" ? "primary" : calc.tag === "Trending" ? "trending" : "default"}`}>
                    {calc.tag}
                  </span>
                </div>
                <h3 className="hp-calc-card__title">{calc.title}</h3>
                <p className="hp-calc-card__desc">{calc.desc}</p>
                <span className="hp-calc-card__cta">
                  Open Calculator
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="hp-section-cta">
            <Link href="/loan-calculators" className="btn-premium btn-premium--outline">
              Browse All Calculators
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          4. CATEGORY EXPLORATION
          ═══════════════════════════════════ */}
      <section className="hp-categories section hp-categories--alt" aria-labelledby="categories-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Explore by Topic</div>
            <h2 id="categories-heading" className="hp-section-title">
              Calculator Categories
            </h2>
            <p className="hp-section-subtitle">
              Deep, organized clusters of tools — each category is a complete ecosystem.
            </p>
          </div>

          <div className="hp-cat-grid" role="list">
            {CATEGORY_CARDS.map((cat) => (
              <Link key={cat.href} href={cat.href} className={`hp-cat-card hp-cat-card--${cat.accent}`} role="listitem">
                <div className="hp-cat-card__icon-wrap">
                  <span className="hp-cat-card__icon"><CalcIcon name={cat.icon} size={26} /></span>
                </div>
                <div className="hp-cat-card__body">
                  <h3 className="hp-cat-card__title">{cat.title}</h3>
                  <p className="hp-cat-card__desc">{cat.desc}</p>
                  <span className="hp-cat-card__count">{cat.count} tools</span>
                </div>
                <span className="hp-cat-card__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          5. COUNTRY DISCOVERY LAYER
          ═══════════════════════════════════ */}
      <section className="hp-countries section" aria-labelledby="countries-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Localized Calculators</div>
            <h2 id="countries-heading" className="hp-section-title">
              Built for Your Country
            </h2>
            <p className="hp-section-subtitle">
              Country-specific tools that use local tax laws, currencies, and regulations — not generic approximations.
            </p>
          </div>

          <div className="hp-country-grid" role="list">
            {COUNTRIES.map((country) => (
              <Link key={country.code} href={country.href} className={`hp-country-card hp-country-card--${country.color}`} role="listitem">
                <div className="hp-country-card__header">
                  <span className="hp-country-card__flag">{country.flag}</span>
                  <div>
                    <div className="hp-country-card__name">{country.name}</div>
                    <div className="hp-country-card__label">{country.label}</div>
                  </div>
                </div>
                <ul className="hp-country-card__tools" aria-label={`Popular tools in ${country.name}`}>
                  {country.tools.map((tool) => (
                    <li key={tool} className="hp-country-card__tool">
                      <span className="hp-country-card__tool-dot" aria-hidden="true" />
                      {tool}
                    </li>
                  ))}
                </ul>
                <span className="hp-country-card__cta">
                  Explore {country.name} Tools →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          6. TRENDING / HIGH-INTENT MODULE
          ═══════════════════════════════════ */}
      <section className="hp-trending section hp-trending--alt" aria-labelledby="trending-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">What's Popular</div>
            <h2 id="trending-heading" className="hp-section-title">
              Trending Right Now
            </h2>
            <p className="hp-section-subtitle">
              The calculators users open most — sorted by real-world utility and search intent.
            </p>
          </div>

          <div className="hp-trending-grid" role="list">
            {TRENDING.map((item, i) => (
              <Link key={item.href} href={item.href} className="hp-trending-card" role="listitem">
                <span className="hp-trending-card__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="hp-trending-card__icon"><CalcIcon name={item.icon} size={20} /></span>
                <div className="hp-trending-card__body">
                  <span className="hp-trending-card__title">{item.title}</span>
                  <span className={`hp-trending-card__tag hp-trending-card__tag--${item.tag === "Most Used" ? "top" : "default"}`}>
                    {item.tag}
                  </span>
                </div>
                <span className="hp-trending-card__arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          7. TRUST / WHY NUMERRAL
          ═══════════════════════════════════ */}
      <section className="hp-trust section" aria-labelledby="trust-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Why Numerral</div>
            <h2 id="trust-heading" className="hp-section-title">
              Trusted by 1M+ Users Worldwide
            </h2>
            <p className="hp-section-subtitle">
              Verified formulas. Instant results. Accurate, tested calculations — for every real-life decision.
            </p>
          </div>

          <div className="hp-trust-grid" role="list">
            {TRUST_FEATURES.map((feat) => (
              <div key={feat.title} className={`hp-trust-card hp-trust-card--${feat.color}`} role="listitem">
                <span className="hp-trust-card__icon">
                  <CalcIcon name={feat.icon} size={22} strokeWidth={1.75} />
                </span>
                <h3 className="hp-trust-card__title">{feat.title}</h3>
                <p className="hp-trust-card__desc">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          8. HOW NUMERRAL WORKS
          ═══════════════════════════════════ */}
      <section className="hp-how section hp-how--alt" aria-labelledby="how-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Simple by Design</div>
            <h2 id="how-heading" className="hp-section-title">
              How Numerral Works
            </h2>
            <p className="hp-section-subtitle">
              From search to answer in under 10 seconds — with the context to actually make a decision.
            </p>
          </div>

          <div className="hp-how-grid" role="list">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="hp-how-step" role="listitem">
                <div className="hp-how-step__num-wrap">
                  <span className="hp-how-step__icon">
                    <CalcIcon name={step.icon} size={24} strokeWidth={1.75} />
                  </span>
                  <span className="hp-how-step__num">{step.num}</span>
                </div>
                <h3 className="hp-how-step__title">{step.title}</h3>
                <p className="hp-how-step__desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          8b. DIFFERENTIATION — WHY BETTER
          ═══════════════════════════════════ */}
      <section className="hp-diff section" aria-labelledby="diff-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">The Numerral Difference</div>
            <h2 id="diff-heading" className="hp-section-title">
              More Than Just a Calculator
            </h2>
            <p className="hp-section-subtitle">
              Other sites give you a number. Numerral gives you understanding.
            </p>
          </div>

          <div className="hp-diff-grid" role="list">
            {DIFFERENTIATORS.map((d) => (
              <div key={d.title} className="hp-diff-card" role="listitem">
                <div className="hp-diff-card__icon-wrap">
                  <span className="hp-diff-card__icon">
                    <CalcIcon name={d.icon} size={22} strokeWidth={1.75} />
                  </span>
                </div>
                <div className="hp-diff-card__body">
                  <span className="hp-diff-card__highlight">{d.highlight}</span>
                  <h3 className="hp-diff-card__title">{d.title}</h3>
                  <p className="hp-diff-card__desc">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hp-diff__vs">
            <div className="hp-diff__vs-inner">
              <div className="hp-diff__vs-col hp-diff__vs-col--other">
                <div className="hp-diff__vs-label">Other Calculator Sites</div>
                <ul className="hp-diff__vs-list">
                  {["Bare number output","No formula shown","No step breakdown","Ad-heavy UI","No real-life examples"].map(t => (
                    <li key={t} className="hp-diff__vs-item hp-diff__vs-item--bad">
                      <CalcIcon name="bad" size={15} strokeWidth={2} />{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hp-diff__vs-divider" aria-hidden="true">vs</div>
              <div className="hp-diff__vs-col hp-diff__vs-col--numerral">
                <div className="hp-diff__vs-label">Numerral</div>
                <ul className="hp-diff__vs-list">
                  {["Full formula + explanation","Step-by-step breakdown","Real-life worked examples","Clean, ad-free first fold","Decision insights included"].map(t => (
                    <li key={t} className="hp-diff__vs-item hp-diff__vs-item--good">
                      <CalcIcon name="good" size={15} strokeWidth={2} />{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          9. FAQ SECTION
          ═══════════════════════════════════ */}
      <section className="hp-faq section" aria-labelledby="faq-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Common Questions</div>
            <h2 id="faq-heading" className="hp-section-title">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="hp-faq__inner">
            <FAQAccordion title="About Numerral" items={homepageFaqs} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          10. DEEP LINK / DISCOVERY SECTION
          ═══════════════════════════════════ */}
      <section className="hp-deeplink section hp-deeplink--alt" aria-labelledby="deeplink-heading">
        <div className="container">
          <div className="hp-section-header">
            <div className="hp-section-label">Explore Everything</div>
            <h2 id="deeplink-heading" className="hp-section-title">
              All Calculator Categories
            </h2>
            <p className="hp-section-subtitle">
              Browse every tool across all categories — finance, health, tax, math, construction, and more.
            </p>
          </div>

          <div className="hp-deeplink-grid" role="list">
            {categories.map((cat: CategoryDef) => {
              const calcs = getCalculatorsByCategory(cat.key);
              return (
                <div key={cat.key} className="hp-deeplink-block" role="listitem">
                  <Link href={cat.href} className="hp-deeplink-block__header">
                    <span className="hp-deeplink-block__icon">{cat.icon}</span>
                    <span className="hp-deeplink-block__name">{cat.name}</span>
                    <span className="hp-deeplink-block__arrow" aria-hidden="true">→</span>
                  </Link>
                  <ul className="hp-deeplink-block__list" aria-label={`${cat.name} tools`}>
                    {calcs.slice(0, 5).map((calc: CalculatorDef) => (
                      <li key={calc.id}>
                        <Link
                          href={`/${calc.categorySlug}/${calc.slug}`}
                          className="hp-deeplink-link"
                        >
                          <span className="hp-deeplink-link__icon">{calc.icon}</span>
                          <span className="hp-deeplink-link__title">{calc.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {calcs.length > 5 && (
                    <Link href={cat.href} className="hp-deeplink-block__more">
                      +{calcs.length - 5} more {cat.name.toLowerCase()} →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hp-deeplink__cta-row">
            <Link href="/loan-calculators" className="btn-premium btn-premium--primary">
              Browse All {totalCalcs}+ Calculators
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/site-map" className="btn-premium btn-premium--ghost">
              View Full Site Map
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

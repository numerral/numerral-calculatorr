// Typed getters for JSON data files
//
// All data is read from JSON at import time (static, works with SSG).
// Each getter returns typed objects ready for component consumption.

import { type CalculatorDefaults, type SliderRanges, type FAQItem, type CategoryKey, type TrendingItem } from "./types";
import { amountToLabel } from "./slug";

// ---- Raw JSON imports ----

import calculatorsJson from "@/data/calculators.json";
import variantsJson from "@/data/variants.json";
import pagesJson from "@/data/pages.json";
import investPagesJson from "@/data/invest_pages.json";
import taxPagesJson from "@/data/tax_pages.json";
import seoTemplatesJson from "@/data/seo_templates.json";
import faqsJson from "@/data/faqs.json";
import categoriesJson from "@/data/categories.json";
import footerLinksJson from "@/data/footer_links.json";
import trendingJson from "@/data/trending.json";
import guidesJson from "@/data/guides.json";

// ---- Types (reflecting JSON shape) ----

export interface CalculatorDef {
    id: string;
    category: string;
    title: string;
    slug: string;
    categorySlug: string;
    icon: string;
    description: string;
    stars: number;
    defaults: CalculatorDefaults;
    sliderRanges: SliderRanges;
    calcType?: string;
    keywords?: string;
}

export interface VariantEntry {
    slug: string;
    amount: number;
}

export interface PageEntry {
    calculatorId: string;
    slug: string;
    amount: number;
    rate: number;
    tenure: number;
    emi: number;
    totalInterest: number;
    totalPayable: number;
    isIndexable: boolean;
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq: { question: string; answer: string }[];
}

export interface InvestPageEntry {
    calculatorId: string;
    slug: string;
    amount: number;
    rate: number;
    tenure: number;
    maturity: number;
    totalInvested: number;
    estimatedReturns: number;
    isIndexable: boolean;
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq: { question: string; answer: string }[];
}

export interface TaxPageEntry {
    calculatorId: string;
    slug: string;
    calcType: string;
    variantParam: number | string;
    isIndexable: boolean;
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight: string;
    };
    faq: { question: string; answer: string }[];
}

export interface SeoTemplate {
    title: string;
    description: string;
    h1: string;
    subtitle: string;
    explanation_heading: string;
    explanation_paragraphs: string[];
    explanation_highlight: string;
}

export interface FaqSet {
    generic: FAQItem[];
    amount_specific: FAQItem[];
}

export interface CategoryDef {
    key: CategoryKey;
    icon: string;
    name: string;
    description: string;
    count: number;
    href: string;
}

export interface FooterLink {
    label: string;
    href: string;
}

// ---- Typed casts ----

const calculators = calculatorsJson as CalculatorDef[];
const variants = variantsJson as Record<string, VariantEntry[]>;
const pages = pagesJson as PageEntry[];
const investPages = investPagesJson as InvestPageEntry[];
const taxPages = taxPagesJson as TaxPageEntry[];
const seoTemplates = seoTemplatesJson as Record<string, SeoTemplate>;
const faqs = faqsJson as Record<string, FaqSet>;
const categories = categoriesJson as CategoryDef[];
const footerLinks = footerLinksJson as Record<string, FooterLink[]>;
const trending = trendingJson as TrendingItem[];

// ---- Calculator getters ----

/** Get all calculator definitions. */
export function getAllCalculators(): CalculatorDef[] {
    return calculators;
}

/** Get calculators filtered by category. */
export function getCalculatorsByCategory(category: string): CalculatorDef[] {
    return calculators.filter((c) => c.category === category);
}

/** Get a single calculator by its ID. */
export function getCalculatorById(id: string): CalculatorDef | undefined {
    return calculators.find((c) => c.id === id);
}

// ---- Variant getters ----

/** Get all variant slugs for a calculator type. */
export function getVariants(calculatorId: string): VariantEntry[] {
    return variants[calculatorId] ?? [];
}

// ---- Page getters ----

/** Get all page entries from pages_first_50. */
export function getAllPages(): PageEntry[] {
    return pages;
}

/** Get pages for a specific calculator type. */
export function getPagesByCalculator(calculatorId: string): PageEntry[] {
    return pages.filter((p) => p.calculatorId === calculatorId);
}

/** Get a specific page entry by calculatorId + slug. */
export function getPageEntry(
    calculatorId: string,
    slug: string
): PageEntry | undefined {
    return pages.find(
        (p) => p.calculatorId === calculatorId && p.slug === slug
    );
}

/** Get only indexable pages (for sitemap). */
export function getIndexablePages(): PageEntry[] {
    return pages.filter((p) => p.isIndexable);
}

// ---- Investment Page getters ----

/** Get all investment page entries. */
export function getAllInvestPages(): InvestPageEntry[] {
    return investPages;
}

/** Get investment pages for a specific calculator type. */
export function getInvestPagesByCalculator(calculatorId: string): InvestPageEntry[] {
    return investPages.filter((p) => p.calculatorId === calculatorId);
}

/** Get a specific investment page entry by calculatorId + slug. */
export function getInvestPageEntry(
    calculatorId: string,
    slug: string
): InvestPageEntry | undefined {
    return investPages.find(
        (p) => p.calculatorId === calculatorId && p.slug === slug
    );
}

// ---- Tax Page getters ----

/** Get all tax page entries. */
export function getAllTaxPages(): TaxPageEntry[] {
    return taxPages;
}

/** Get tax pages for a specific calculator type. */
export function getTaxPagesByCalculator(calculatorId: string): TaxPageEntry[] {
    return taxPages.filter((p) => p.calculatorId === calculatorId);
}

/** Get a specific tax page entry by calculatorId + slug. */
export function getTaxPageEntry(
    calculatorId: string,
    slug: string
): TaxPageEntry | undefined {
    return taxPages.find(
        (p) => p.calculatorId === calculatorId && p.slug === slug
    );
}

// ---- Category getters ----

/** Get all categories. */
export function getAllCategories(): CategoryDef[] {
    return categories;
}

/** Get categories, optionally excluding some by key. */
export function getCategories(exclude: CategoryKey[] = []): CategoryDef[] {
    if (exclude.length === 0) return categories;
    return categories.filter((c) => !exclude.includes(c.key));
}

// ---- Footer getters ----

/** Get footer links grouped by category key. */
export function getFooterLinks(): Record<string, FooterLink[]> {
    return footerLinks;
}

// ---- Trending getters ----

/** Get trending calculator items. */
export function getTrendingItems(): TrendingItem[] {
    return trending;
}

// ---- SEO getters ----

/** Get the SEO template for a calculator type. */
export function getSeoTemplate(calculatorId: string): SeoTemplate | undefined {
    return seoTemplates[calculatorId];
}

// ---- FAQ getters ----

/** Get FAQ items for a calculator type, with templates filled. */
export function getFaqs(
    calculatorId: string,
    vars?: Record<string, string>
): { generic: FAQItem[]; amountSpecific: FAQItem[] } {
    const set = faqs[calculatorId];
    if (!set) return { generic: [], amountSpecific: [] };

    const fill = (items: FAQItem[]): FAQItem[] =>
        vars
            ? items.map((item) => ({
                question: fillTemplate(item.question, vars),
                answer: fillTemplate(item.answer, vars),
            }))
            : items;

    return {
        generic: set.generic,
        amountSpecific: fill(set.amount_specific),
    };
}

/** Get related amount items for a calculator (used by RelatedCalculations). */
export function getRelatedAmounts(
    calculatorId: string
): { label: string; slug: string }[] {
    return getVariants(calculatorId).map((v) => ({
        label: amountToLabel(v.amount),
        slug: v.slug,
    }));
}

// ---- Template filler ----

/**
 * Replace {{key}} placeholders in a string with values from a vars map.
 */
export function fillTemplate(
    template: string,
    vars: Record<string, string>
): string {
    return template.replace(
        /\{\{(\w+)\}\}/g,
        (_, key: string) => vars[key] ?? `{{${key}}}`
    );
}

/**
 * Build the full template variable map for a page entry.
 */
export function buildTemplateVars(page: PageEntry): Record<string, string> {
    return {
        amount_label: amountToLabel(page.amount),
        amount: page.amount.toLocaleString("en-IN"),
        rate: page.rate.toString(),
        tenure_months: page.tenure.toString(),
        tenure_years: (page.tenure / 12).toFixed(0),
    };
}

// ---- Guide types & getters ----

interface GuideSection {
    heading: string;
    content: string;
}

export interface GuideDef {
    slug: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    readTime: string;
    relatedCalculators: string[];
    sections: GuideSection[];
    faq: { question: string; answer: string }[];
}

const guides = guidesJson as GuideDef[];

/** Get all guides. */
export function getAllGuides(): GuideDef[] {
    return guides;
}

/** Get a guide by slug. */
export function getGuideBySlug(slug: string): GuideDef | undefined {
    return guides.find((g) => g.slug === slug);
}

/** Get guides for a category. */
export function getGuidesByCategory(category: string): GuideDef[] {
    return guides.filter((g) => g.category === category);
}

// ---- Glossary types & getters ----

import glossaryJson from "@/data/glossary.json";

export interface GlossaryTerm {
    term: string;
    slug: string;
    definition: string;
    formula?: string;
    category: string;
    related: string[];
}

const glossary = glossaryJson as GlossaryTerm[];

/** Get all glossary terms. */
export function getAllGlossaryTerms(): GlossaryTerm[] {
    return glossary;
}

/** Get a glossary term by slug. */
export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
    return glossary.find((t) => t.slug === slug);
}

/** Get glossary terms by category. */
export function getGlossaryTermsByCategory(category: string): GlossaryTerm[] {
    return glossary.filter((t) => t.category === category);
}


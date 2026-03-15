// Numerral — Shared Type Definitions

// ---- Calculator Types ----

export interface CalculatorDefaults {
    amount: number;
    rate: number;
    tenure: number;
}

export interface EMIResult {
    emi: number;
    totalInterest: number;
    totalPayable: number;
}

export interface SliderRanges {
    amount: { min: number; max: number; step: number };
    rate: { min: number; max: number; step: number };
    tenure: { min: number; max: number; step: number };
}

// ---- Component Props ----

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export type CategoryKey = "loan" | "invest" | "tax" | "salary" | "utility" | "business" | "time" | "construction" | "ev";

export interface RelatedItem {
    label: string;
    slug: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface TrendingItem {
    name: string;
    href: string;
}

// ---- Page Data ----

export interface CalculatorPageData {
    slug: string;
    amount: number;
    title: string;
    metaDescription: string;
    h1: string;
    subtitle: string;
    isIndexable: boolean;
    canonicalUrl: string;
    defaults: CalculatorDefaults;
    explanation: {
        heading: string;
        paragraphs: string[];
        highlight?: string;
    };
    faq: FAQItem[];
    relatedItems: RelatedItem[];
    activeSlug: string;
}

export interface CategoryData {
    key: CategoryKey;
    icon: string;
    name: string;
    description: string;
    count: number;
    href: string;
}

export interface CalculatorIndexItem {
    icon: string;
    title: string;
    description: string;
    stars: string;
    href: string;
}

// International SEO — Geo-targeting constants, hreflang mappings, and helpers
// Centralizes all country-specific SEO signals for KSA, UAE, India, and global/US pages.

import { SITE_URL } from "./constants";

// ─── Country codes and locale constants ───

export type CountryCode = "SA" | "AE" | "IN" | "US";

export interface CountryGeoConfig {
    /** ISO 3166-1 alpha-2 country code */
    code: CountryCode;
    /** BCP 47 language tag for hreflang (e.g., "en-SA") */
    hreflang: string;
    /** Open Graph locale (e.g., "en_SA") */
    ogLocale: string;
    /** Currency code for schema.org offers */
    currency: string;
    /** URL path prefix (e.g., "/ksa") */
    pathPrefix: string;
    /** geo.region meta tag value (ISO 3166-1 alpha-2) */
    geoRegion: string;
    /** Label for the hub */
    label: string;
}

export const GEO_CONFIG: Record<CountryCode, CountryGeoConfig> = {
    SA: {
        code: "SA",
        hreflang: "en-SA",
        ogLocale: "en_SA",
        currency: "SAR",
        pathPrefix: "/ksa",
        geoRegion: "SA",
        label: "Saudi Arabia",
    },
    AE: {
        code: "AE",
        hreflang: "en-AE",
        ogLocale: "en_AE",
        currency: "AED",
        pathPrefix: "/uae",
        geoRegion: "AE",
        label: "United Arab Emirates",
    },
    IN: {
        code: "IN",
        hreflang: "en-IN",
        ogLocale: "en_IN",
        currency: "INR",
        pathPrefix: "/in",
        geoRegion: "IN",
        label: "India",
    },
    US: {
        code: "US",
        hreflang: "en-US",
        ogLocale: "en_US",
        currency: "USD",
        pathPrefix: "",
        geoRegion: "US",
        label: "United States",
    },
};

// ─── Cross-country equivalent page mapping ───
// Maps a calculator slug to the country paths where equivalents exist.
// Used to generate hreflang alternate links.

interface CrossCountryMapping {
    slug: string;
    countries: {
        country: CountryCode;
        path: string;
    }[];
}

export const CROSS_COUNTRY_PAGES: CrossCountryMapping[] = [
    {
        slug: "salary-calculator",
        countries: [
            { country: "SA", path: "/ksa/salary-calculator" },
            { country: "AE", path: "/uae/salary-calculator" },
        ],
    },
    {
        slug: "vat-calculator",
        countries: [
            { country: "SA", path: "/ksa/vat-calculator" },
            { country: "AE", path: "/uae/vat-calculator" },
        ],
    },
    {
        slug: "car-loan-calculator",
        countries: [
            { country: "SA", path: "/ksa/car-loan-calculator" },
            { country: "AE", path: "/uae/car-loan-calculator" },
            { country: "IN", path: "/in/car-loan-calculator" },
        ],
    },
    {
        slug: "personal-loan-calculator",
        countries: [
            { country: "SA", path: "/ksa/personal-loan-calculator" },
            { country: "IN", path: "/in/personal-loan-calculator" },
        ],
    },
    {
        slug: "home-loan-calculator",
        countries: [
            { country: "SA", path: "/ksa/home-loan-calculator" },
            { country: "IN", path: "/in/home-loan-calculator" },
        ],
    },
    {
        slug: "rent-affordability-calculator",
        countries: [
            { country: "SA", path: "/ksa/rent-affordability-calculator" },
            { country: "AE", path: "/uae/rent-affordability-calculator" },
        ],
    },
];

// ─── Inventory of ALL country-specific pages for sitemap ───

export const KSA_PAGES = [
    "annual-leave-calculator",
    "calorie-calculator",
    "car-loan-calculator",
    "commercial-registration-calculator",
    "dependent-levy-calculator",
    "end-of-service-calculator",
    "gosi-calculator",
    "home-loan-calculator",
    "iqama-renewal-calculator",
    "overtime-calculator",
    "personal-loan-calculator",
    "rent-affordability-calculator",
    "salary-calculator",
    "saudization-calculator",
    "savings-goal-calculator",
    "vat-calculator",
    "zakat-calculator",
];

export const UAE_PAGES = [
    "addc-bill-calculator",
    "car-loan-calculator",
    "currency-converter",
    "dewa-calculator",
    "ejari-tenancy-calculator",
    "gold-calculator",
    "gratuity-calculator",
    "mobile-plan-calculator",
    "mortgage-calculator",
    "parking-cost-calculator",
    "rera-rental-calculator",
    "rent-affordability-calculator",
    "salary-calculator",
    "traffic-fine-calculator",
    "vat-calculator",
    "visa-cost-calculator",
];

export const IN_PAGES = [
    "age-calculator",
    "bmi-calculator",
    "body-fat-calculator",
    "car-loan-calculator",
    "compound-interest-calculator",
    "crorepati-calculator",
    "fd-calculator",
    "fide-rating-calculator",
    "fuel-cost-calculator",
    "hlv-calculator",
    "home-loan-calculator",
    "income-tax-calculator",
    "lumpsum-calculator",
    "pension-calculator",
    "personal-loan-calculator",
    "position-size-calculator",
    "ppf-calculator",
    "sip-calculator",
    "sukanya-samriddhi-yojana-calculator",
    "swp-calculator",
    "xirr-calculator",
];

// ─── Helper: build hreflang alternates for Next.js metadata ───

/**
 * Build hreflang alternates for a country-specific page.
 * If the page has cross-country equivalents, all alternates are included.
 * Always includes a self-referencing hreflang.
 *
 * @param countryCode — the country this page targets (e.g., "SA")
 * @param pagePath — the full path (e.g., "/ksa/salary-calculator")
 * @param slug — the calculator slug (e.g., "salary-calculator")
 * @returns — object suitable for Next.js metadata.alternates.languages
 *
 * @example
 * buildHreflangAlternates("SA", "/ksa/salary-calculator", "salary-calculator")
 * → { "en-SA": "https://www.numerral.com/ksa/salary-calculator",
 *     "en-AE": "https://www.numerral.com/uae/salary-calculator",
 *     "x-default": "https://www.numerral.com/ksa/salary-calculator" }
 */
export function buildHreflangAlternates(
    countryCode: CountryCode,
    pagePath: string,
    slug: string
): Record<string, string> {
    const mapping = CROSS_COUNTRY_PAGES.find((m) => m.slug === slug);
    const selfUrl = `${SITE_URL}${pagePath}`;
    const selfHreflang = GEO_CONFIG[countryCode].hreflang;

    if (mapping) {
        // Page has cross-country equivalents — list all
        const languages: Record<string, string> = {};
        for (const entry of mapping.countries) {
            languages[GEO_CONFIG[entry.country].hreflang] = `${SITE_URL}${entry.path}`;
        }
        // x-default points to the first entry (or self)
        languages["x-default"] = selfUrl;
        return languages;
    }

    // Unique page — self-referencing hreflang only
    return {
        [selfHreflang]: selfUrl,
        "x-default": selfUrl,
    };
}

/**
 * Build complete alternates object for Next.js metadata, including canonical + languages.
 */
export function buildCountryAlternates(
    countryCode: CountryCode,
    pagePath: string,
    slug: string
) {
    return {
        canonical: `${SITE_URL}${pagePath}`,
        languages: buildHreflangAlternates(countryCode, pagePath, slug),
    };
}

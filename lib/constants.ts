// Site-wide constants

export const SITE_NAME = "Numerral";
export const SITE_TAGLINE = "Free online calculator platform";
export const SITE_URL = "https://www.numerral.com";

export const DEFAULT_SLIDER_RANGES = {
    amount: { min: 50000, max: 10000000, step: 50000 },
    rate: { min: 1, max: 30, step: 0.1 },
    tenure: { min: 6, max: 360, step: 6 },
};

// ─── Auto-computed counts (single source of truth) ───
// These are computed at import time from actual data files.
import calculatorsJson from "@/data/calculators.json";
import categoriesJson from "@/data/categories.json";

/** Total number of calculators from calculators.json */
export const TOTAL_CALCULATORS = (calculatorsJson as unknown[]).length;

/** Total number of top-level categories from categories.json */
export const TOTAL_CATEGORIES = (categoriesJson as unknown[]).length;

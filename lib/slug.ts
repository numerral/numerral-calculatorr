// Slug parser — converts URL slugs to numeric values
//
// Patterns supported:
//   "5-lakh"              → 500000
//   "1-5-lakh"            → 150000
//   "2-crore"             → 20000000
//   "1-5-crore"           → 15000000
//   "5-lakh-60-months"    → { amount: 500000, tenure: 60 }
//   "5-lakh-9-percent"    → { amount: 500000, rate: 9 }
//   "5-lakh-9-percent-60-months" → { amount: 500000, rate: 9, tenure: 60 }

export interface ParsedSlug {
    amount: number;
    amountLabel: string;
    tenure?: number;
    rate?: number;
}

/**
 * Parse an amountSlug like "5-lakh" → { amount: 500000, amountLabel: "₹5 Lakh" }
 * Returns null if the slug is completely unparseable.
 */
export function parseSlug(slug: string): ParsedSlug | null {
    let remaining = slug;
    let amount: number | null = null;
    let amountLabel = "";
    let tenure: number | undefined;
    let rate: number | undefined;

    // 1. Try to extract amount (lakh / crore)
    const lakhMatch = remaining.match(/^(\d+(?:-\d+)?)-lakh/);
    const croreMatch = remaining.match(/^(\d+(?:-\d+)?)-crore/);

    if (lakhMatch) {
        const numStr = lakhMatch[1].replace("-", ".");
        const num = parseFloat(numStr);
        amount = num * 100000;
        amountLabel = `₹${numStr.replace(".", ".")} Lakh`;
        remaining = remaining.slice(lakhMatch[0].length);
    } else if (croreMatch) {
        const numStr = croreMatch[1].replace("-", ".");
        const num = parseFloat(numStr);
        amount = num * 10000000;
        amountLabel = `₹${numStr.replace(".", ".")} Crore`;
        remaining = remaining.slice(croreMatch[0].length);
    }

    if (amount === null) return null;

    // 2. Try to extract tenure (-60-months)
    const tenureMatch = remaining.match(/-(\d+)-months/);
    if (tenureMatch) {
        tenure = parseInt(tenureMatch[1]);
        remaining = remaining.replace(tenureMatch[0], "");
    }

    // 3. Try to extract rate (-9-percent or -8-5-percent)
    const rateMatch = remaining.match(/-(\d+(?:-\d+)?)-percent/);
    if (rateMatch) {
        rate = parseFloat(rateMatch[1].replace("-", "."));
        remaining = remaining.replace(rateMatch[0], "");
    }

    // Fix label formatting
    amountLabel = amountLabel.replace(/\./, ".");

    return { amount, amountLabel, tenure, rate };
}

/**
 * Format a number as a human-readable Indian amount label.
 * 500000 → "₹5 Lakh", 10000000 → "₹1 Crore"
 */
export function amountToLabel(amount: number): string {
    if (amount >= 10000000) {
        const crore = amount / 10000000;
        return `₹${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`;
    }
    const lakh = amount / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)} Lakh`;
}

/**
 * Convert a numeric amount to a slug.
 * 500000 → "5-lakh", 1500000 → "15-lakh", 10000000 → "1-crore"
 */
export function amountToSlug(amount: number): string {
    if (amount >= 10000000) {
        const crore = amount / 10000000;
        const str = crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1);
        return `${str.replace(".", "-")}-crore`;
    }
    const lakh = amount / 100000;
    const str = lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1);
    return `${str.replace(".", "-")}-lakh`;
}

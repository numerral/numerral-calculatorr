// Tax Calculator Formulas — India FY 2025-26
// Income Tax, GST, HRA, TDS, Capital Gains, Professional Tax

// ════════════════════════════════════════════════
// 1. INCOME TAX (Old & New Regime)
// ════════════════════════════════════════════════

export interface IncomeTaxInput {
    annualIncome: number;
    regime: "old" | "new";
    deductions80C: number;   // max 1,50,000
    deductions80D: number;   // health insurance
    deductionHRA: number;    // HRA exemption
    otherDeductions: number; // 80G, 80E, etc.
}

export interface TaxSlabDetail {
    slab: string;
    rate: number;
    taxableIncome: number;
    tax: number;
}

export interface IncomeTaxResult {
    grossIncome: number;
    totalDeductions: number;
    taxableIncome: number;
    incomeTax: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
    slabs: TaxSlabDetail[];
    regime: string;
}

// New Regime FY 2025-26 (Budget 2025 — ₹12L exempt with rebate)
const NEW_SLABS = [
    { min: 0, max: 400000, rate: 0 },
    { min: 400000, max: 800000, rate: 5 },
    { min: 800000, max: 1200000, rate: 10 },
    { min: 1200000, max: 1600000, rate: 15 },
    { min: 1600000, max: 2000000, rate: 20 },
    { min: 2000000, max: 2400000, rate: 25 },
    { min: 2400000, max: Infinity, rate: 30 },
];

// Old Regime
const OLD_SLABS = [
    { min: 0, max: 250000, rate: 0 },
    { min: 250000, max: 500000, rate: 5 },
    { min: 500000, max: 1000000, rate: 20 },
    { min: 1000000, max: Infinity, rate: 30 },
];

function slabLabel(min: number, max: number): string {
    const fmtL = (n: number) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1)} Cr`;
        if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)} L`;
        return `₹${n.toLocaleString("en-IN")}`;
    };
    if (max === Infinity) return `Above ${fmtL(min)}`;
    return `${fmtL(min)} – ${fmtL(max)}`;
}

function calculateSlabTax(taxableIncome: number, slabs: typeof NEW_SLABS): { tax: number; details: TaxSlabDetail[] } {
    let remaining = taxableIncome;
    let totalTax = 0;
    const details: TaxSlabDetail[] = [];

    for (const slab of slabs) {
        const slabWidth = slab.max === Infinity ? remaining : slab.max - slab.min;
        const taxable = Math.min(Math.max(remaining, 0), slabWidth);
        const tax = Math.round(taxable * slab.rate / 100);
        details.push({
            slab: slabLabel(slab.min, slab.max),
            rate: slab.rate,
            taxableIncome: taxable,
            tax,
        });
        totalTax += tax;
        remaining -= taxable;
        if (remaining <= 0) break;
    }

    return { tax: totalTax, details };
}

function calculateSurcharge(income: number, tax: number): number {
    if (income > 50000000) return Math.round(tax * 0.37);
    if (income > 20000000) return Math.round(tax * 0.25);
    if (income > 10000000) return Math.round(tax * 0.15);
    if (income > 5000000) return Math.round(tax * 0.10);
    return 0;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
    const {
        annualIncome,
        regime,
        deductions80C = 0,
        deductions80D = 0,
        deductionHRA = 0,
        otherDeductions = 0,
    } = input;

    // Standard deduction
    const stdDeduction = 75000; // Both regimes FY 2025-26

    let totalDeductions: number;
    if (regime === "old") {
        totalDeductions = stdDeduction +
            Math.min(deductions80C, 150000) +
            deductions80D +
            deductionHRA +
            otherDeductions;
    } else {
        // New regime: only standard deduction, no other deductions
        totalDeductions = stdDeduction;
    }

    const taxableIncome = Math.max(annualIncome - totalDeductions, 0);
    const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
    const { tax: incomeTax, details } = calculateSlabTax(taxableIncome, slabs);

    // Rebate u/s 87A
    let taxAfterRebate = incomeTax;
    if (regime === "new" && taxableIncome <= 1200000) {
        taxAfterRebate = 0; // Full rebate under new regime up to ₹12L
    } else if (regime === "old" && taxableIncome <= 500000) {
        taxAfterRebate = Math.max(incomeTax - 12500, 0);
    }

    const surcharge = calculateSurcharge(annualIncome, taxAfterRebate);
    const cess = Math.round((taxAfterRebate + surcharge) * 0.04);
    const totalTax = taxAfterRebate + surcharge + cess;

    return {
        grossIncome: annualIncome,
        totalDeductions,
        taxableIncome,
        incomeTax: taxAfterRebate,
        surcharge,
        cess,
        totalTax,
        effectiveRate: annualIncome > 0 ? Math.round((totalTax / annualIncome) * 10000) / 100 : 0,
        slabs: details,
        regime: regime === "new" ? "New Regime" : "Old Regime",
    };
}


// ════════════════════════════════════════════════
// 2. GST CALCULATOR
// ════════════════════════════════════════════════

export interface GSTInput {
    amount: number;
    rate: number;      // 5, 12, 18, or 28
    mode: "exclusive" | "inclusive";
    supplyType: "intra" | "inter"; // intra-state (CGST+SGST) or inter-state (IGST)
}

export interface GSTResult {
    baseAmount: number;
    gstAmount: number;
    totalAmount: number;
    cgst: number;
    sgst: number;
    igst: number;
    rate: number;
    mode: string;
}

export function calculateGST(input: GSTInput): GSTResult {
    const { amount, rate, mode, supplyType = "intra" } = input;

    let baseAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (mode === "exclusive") {
        baseAmount = amount;
        gstAmount = Math.round(amount * rate / 100);
        totalAmount = baseAmount + gstAmount;
    } else {
        totalAmount = amount;
        baseAmount = Math.round(amount * 100 / (100 + rate));
        gstAmount = totalAmount - baseAmount;
    }

    const cgst = supplyType === "intra" ? Math.round(gstAmount / 2) : 0;
    const sgst = supplyType === "intra" ? gstAmount - cgst : 0;
    const igst = supplyType === "inter" ? gstAmount : 0;

    return {
        baseAmount,
        gstAmount,
        totalAmount,
        cgst,
        sgst,
        igst,
        rate,
        mode: mode === "exclusive" ? "GST Exclusive" : "GST Inclusive",
    };
}


// ════════════════════════════════════════════════
// 3. HRA EXEMPTION CALCULATOR
// ════════════════════════════════════════════════

export interface HRAInput {
    basicSalary: number;  // annual
    hraReceived: number;  // annual
    rentPaid: number;     // annual
    isMetro: boolean;     // Delhi, Mumbai, Kolkata, Chennai
}

export interface HRAResult {
    actualHRA: number;
    percentOfBasic: number;  // 50% or 40%
    rentMinus10: number;
    exemption: number;
    taxableHRA: number;
    rule: string;
}

export function calculateHRA(input: HRAInput): HRAResult {
    const { basicSalary, hraReceived, rentPaid, isMetro } = input;

    const actualHRA = hraReceived;
    const percentOfBasic = isMetro
        ? Math.round(basicSalary * 0.50)
        : Math.round(basicSalary * 0.40);
    const rentMinus10 = Math.max(rentPaid - Math.round(basicSalary * 0.10), 0);

    const exemption = Math.min(actualHRA, percentOfBasic, rentMinus10);
    const taxableHRA = Math.max(hraReceived - exemption, 0);

    let rule: string;
    if (exemption === actualHRA) rule = "Actual HRA received";
    else if (exemption === percentOfBasic) rule = isMetro ? "50% of Basic Salary" : "40% of Basic Salary";
    else rule = "Rent paid minus 10% of Basic";

    return {
        actualHRA,
        percentOfBasic,
        rentMinus10,
        exemption,
        taxableHRA,
        rule,
    };
}


// ════════════════════════════════════════════════
// 4. TDS CALCULATOR
// ════════════════════════════════════════════════

export type TDSIncomeType =
    | "salary"
    | "interest"
    | "rent"
    | "professional"
    | "property-sale"
    | "lottery"
    | "commission";

export interface TDSInput {
    incomeType: TDSIncomeType;
    amount: number;
    hasPAN: boolean;
}

export interface TDSResult {
    incomeType: string;
    amount: number;
    tdsRate: number;
    tdsAmount: number;
    netAmount: number;
    section: string;
    threshold: number;
}

const TDS_RATES: Record<TDSIncomeType, { rate: number; noPanRate: number; section: string; label: string; threshold: number }> = {
    salary: { rate: 10, noPanRate: 20, section: "192", label: "Salary", threshold: 250000 },
    interest: { rate: 10, noPanRate: 20, section: "194A", label: "Interest Income", threshold: 40000 },
    rent: { rate: 10, noPanRate: 20, section: "194I", label: "Rent Payment", threshold: 240000 },
    professional: { rate: 10, noPanRate: 20, section: "194J", label: "Professional Fees", threshold: 30000 },
    "property-sale": { rate: 1, noPanRate: 20, section: "194IA", label: "Property Sale", threshold: 5000000 },
    lottery: { rate: 30, noPanRate: 30, section: "194B", label: "Lottery / Game Show", threshold: 10000 },
    commission: { rate: 5, noPanRate: 20, section: "194H", label: "Commission / Brokerage", threshold: 15000 },
};

export function calculateTDS(input: TDSInput): TDSResult {
    const { incomeType, amount, hasPAN } = input;
    const config = TDS_RATES[incomeType];

    const rate = hasPAN ? config.rate : config.noPanRate;
    const taxable = amount > config.threshold ? amount : 0;
    const tdsAmount = Math.round(taxable * rate / 100);

    return {
        incomeType: config.label,
        amount,
        tdsRate: rate,
        tdsAmount,
        netAmount: amount - tdsAmount,
        section: `Section ${config.section}`,
        threshold: config.threshold,
    };
}


// ════════════════════════════════════════════════
// 5. CAPITAL GAINS TAX
// ════════════════════════════════════════════════

export type AssetType = "equity" | "debt-mf" | "property" | "gold";

export interface CapitalGainsInput {
    purchasePrice: number;
    salePrice: number;
    holdingMonths: number;
    assetType: AssetType;
    purchaseYear?: number; // for indexation (property/gold)
    saleYear?: number;
}

export interface CapitalGainsResult {
    purchasePrice: number;
    salePrice: number;
    capitalGain: number;
    isLongTerm: boolean;
    gainType: string;
    taxRate: number;
    exemption: number;
    taxableGain: number;
    taxAmount: number;
    cess: number;
    totalTax: number;
    holdingPeriod: string;
}

// Long-term thresholds (months)
const LT_THRESHOLD: Record<AssetType, number> = {
    equity: 12,
    "debt-mf": 24,
    property: 24,
    gold: 24,
};

// STCG / LTCG rates
const CG_RATES: Record<AssetType, { stcg: number; ltcg: number; ltcgExemption: number }> = {
    equity: { stcg: 20, ltcg: 12.5, ltcgExemption: 125000 },
    "debt-mf": { stcg: 30, ltcg: 12.5, ltcgExemption: 0 },  // slab rate simplified
    property: { stcg: 30, ltcg: 12.5, ltcgExemption: 0 },
    gold: { stcg: 30, ltcg: 12.5, ltcgExemption: 0 },
};

const ASSET_LABELS: Record<AssetType, string> = {
    equity: "Stocks / Equity MF",
    "debt-mf": "Debt Mutual Funds",
    property: "Real Estate",
    gold: "Gold / Gold ETF",
};

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
    const { purchasePrice, salePrice, holdingMonths, assetType } = input;

    const capitalGain = salePrice - purchasePrice;
    const isLongTerm = holdingMonths >= LT_THRESHOLD[assetType];
    const rates = CG_RATES[assetType];

    const taxRate = isLongTerm ? rates.ltcg : rates.stcg;
    const exemption = isLongTerm ? rates.ltcgExemption : 0;
    const taxableGain = Math.max(capitalGain - exemption, 0);
    const taxAmount = capitalGain > 0 ? Math.round(taxableGain * taxRate / 100) : 0;
    const cess = Math.round(taxAmount * 0.04);

    const yrs = Math.floor(holdingMonths / 12);
    const mos = holdingMonths % 12;
    const holdingPeriod = yrs > 0 ? `${yrs} yr${yrs > 1 ? "s" : ""}${mos > 0 ? ` ${mos} mo` : ""}` : `${mos} mo`;

    return {
        purchasePrice,
        salePrice,
        capitalGain,
        isLongTerm,
        gainType: isLongTerm ? "Long-Term Capital Gain (LTCG)" : "Short-Term Capital Gain (STCG)",
        taxRate,
        exemption,
        taxableGain,
        taxAmount,
        cess,
        totalTax: taxAmount + cess,
        holdingPeriod,
    };
}


// ════════════════════════════════════════════════
// 6. PROFESSIONAL TAX
// ════════════════════════════════════════════════

export interface ProfessionalTaxInput {
    state: string;
    monthlySalary: number;
}

export interface ProfessionalTaxResult {
    state: string;
    monthlySalary: number;
    monthlyPT: number;
    annualPT: number;
    slab: string;
}

// Simplified state-wise PT slabs (major states)
interface PTSlab { min: number; max: number; tax: number }
const PT_SLABS: Record<string, PTSlab[]> = {
    maharashtra: [
        { min: 0, max: 7500, tax: 0 },
        { min: 7501, max: 10000, tax: 175 },
        { min: 10001, max: Infinity, tax: 200 },  // ₹300 for Feb
    ],
    karnataka: [
        { min: 0, max: 15000, tax: 0 },
        { min: 15001, max: 25000, tax: 200 },
        { min: 25001, max: Infinity, tax: 200 },
    ],
    "west-bengal": [
        { min: 0, max: 10000, tax: 0 },
        { min: 10001, max: 15000, tax: 110 },
        { min: 15001, max: 25000, tax: 130 },
        { min: 25001, max: 40000, tax: 150 },
        { min: 40001, max: Infinity, tax: 200 },
    ],
    "andhra-pradesh": [
        { min: 0, max: 15000, tax: 0 },
        { min: 15001, max: 20000, tax: 150 },
        { min: 20001, max: Infinity, tax: 200 },
    ],
    telangana: [
        { min: 0, max: 15000, tax: 0 },
        { min: 15001, max: 20000, tax: 150 },
        { min: 20001, max: Infinity, tax: 200 },
    ],
    "tamil-nadu": [
        { min: 0, max: 21000, tax: 0 },
        { min: 21001, max: 30000, tax: 135 },
        { min: 30001, max: 45000, tax: 315 },
        { min: 45001, max: 60000, tax: 690 },
        { min: 60001, max: 75000, tax: 1025 },
        { min: 75001, max: Infinity, tax: 1250 },
    ],
    gujarat: [
        { min: 0, max: 5999, tax: 0 },
        { min: 6000, max: 8999, tax: 80 },
        { min: 9000, max: 11999, tax: 150 },
        { min: 12000, max: Infinity, tax: 200 },
    ],
    "madhya-pradesh": [
        { min: 0, max: 18750, tax: 0 },
        { min: 18751, max: 25000, tax: 125 },
        { min: 25001, max: Infinity, tax: 208 },
    ],
    kerala: [
        { min: 0, max: 11999, tax: 0 },
        { min: 12000, max: 17999, tax: 120 },
        { min: 18000, max: 29999, tax: 180 },
        { min: 30000, max: Infinity, tax: 250 },
    ],
    odisha: [
        { min: 0, max: 13304, tax: 0 },
        { min: 13305, max: 25000, tax: 125 },
        { min: 25001, max: Infinity, tax: 200 },
    ],
};

export const PT_STATES = [
    { value: "maharashtra", label: "Maharashtra" },
    { value: "karnataka", label: "Karnataka" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "telangana", label: "Telangana" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "gujarat", label: "Gujarat" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "kerala", label: "Kerala" },
    { value: "odisha", label: "Odisha" },
];

export function calculateProfessionalTax(input: ProfessionalTaxInput): ProfessionalTaxResult {
    const { state, monthlySalary } = input;
    const slabs = PT_SLABS[state] || PT_SLABS.maharashtra;

    let monthlyPT = 0;
    let slabLabel = "₹0";

    for (const slab of slabs) {
        if (monthlySalary >= slab.min && monthlySalary <= slab.max) {
            monthlyPT = slab.tax;
            slabLabel = slab.max === Infinity
                ? `Above ₹${slab.min.toLocaleString("en-IN")}`
                : `₹${slab.min.toLocaleString("en-IN")} – ₹${slab.max.toLocaleString("en-IN")}`;
            break;
        }
    }

    return {
        state: PT_STATES.find(s => s.value === state)?.label || state,
        monthlySalary,
        monthlyPT,
        annualPT: monthlyPT * 12,
        slab: slabLabel,
    };
}

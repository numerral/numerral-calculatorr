// Investment Calculator Formulas
//
// SIP: FV = P × [((1+r)^n - 1) / r] × (1+r)
// FD:  FV = P × (1 + r/4)^(4*t)   (quarterly compounding)
// RD:  FV = P × [((1+r)^n - 1) / r] × (1+r)  (similar to SIP with quarterly compounding)
// PPF: Annual compounding with yearly contribution
// NPS: Monthly SIP with expected returns
// Lumpsum: FV = P × (1+r)^t

export interface InvestmentInput {
    /** Monthly/yearly contribution or lumpsum amount in ₹ */
    amount: number;
    /** Expected annual return rate in % */
    rate: number;
    /** Tenure in months */
    tenure: number;
}

export interface InvestmentResult {
    /** Total amount invested */
    totalInvested: number;
    /** Estimated returns (wealth gained) */
    estimatedReturns: number;
    /** Maturity value (invested + returns) */
    maturityValue: number;
    /** Invested as % of maturity */
    investedPercent: number;
    /** Returns as % of maturity */
    returnsPercent: number;
    /** Effective annual yield / XIRR approximation */
    effectiveYield: number;
}

// ── SIP Calculator ──
// Monthly contribution → future value
export function calculateSIP(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    const monthlyRate = rate / 12 / 100;
    const n = tenure; // months
    const fv = amount * (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = amount * n;
    const estimatedReturns = fv - totalInvested;

    return buildResult(totalInvested, estimatedReturns, fv, rate);
}

// ── FD Calculator ──
// Lumpsum with quarterly compounding
export function calculateFD(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    const years = tenure / 12;
    const quarterlyRate = rate / 4 / 100;
    const quarters = Math.round(years * 4);
    const fv = amount * Math.pow(1 + quarterlyRate, quarters);
    const estimatedReturns = fv - amount;

    return buildResult(amount, estimatedReturns, fv, rate);
}

// ── RD Calculator ──
// Monthly contribution with quarterly compounding
export function calculateRD(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    const quarterlyRate = rate / 4 / 100;
    const quarters = Math.round(tenure / 3);
    let fv = 0;

    // Each month's deposit earns compound interest for remaining quarters
    for (let month = 1; month <= tenure; month++) {
        const remainingQuarters = Math.round((tenure - month + 1) / 3);
        fv += amount * Math.pow(1 + quarterlyRate, remainingQuarters);
    }

    const totalInvested = amount * tenure;
    const estimatedReturns = fv - totalInvested;

    return buildResult(totalInvested, estimatedReturns, fv, rate);
}

// ── PPF Calculator ──
// Annual contribution, annual compounding, 15-year lock-in
export function calculatePPF(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    const years = tenure / 12;
    const annualRate = rate / 100;
    let balance = 0;

    for (let y = 1; y <= years; y++) {
        balance = (balance + amount) * (1 + annualRate);
    }

    const totalInvested = amount * years;
    const estimatedReturns = balance - totalInvested;

    return buildResult(totalInvested, estimatedReturns, balance, rate);
}

// ── NPS Calculator ──
// Monthly SIP into NPS (same as SIP formula)
export function calculateNPS(input: InvestmentInput): InvestmentResult {
    return calculateSIP(input); // Same formula, different context
}

// ── Lumpsum / Mutual Fund Returns ──
// One-time investment with annual compounding
export function calculateLumpsum(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    const years = tenure / 12;
    const annualRate = rate / 100;
    const fv = amount * Math.pow(1 + annualRate, years);
    const estimatedReturns = fv - amount;

    return buildResult(amount, estimatedReturns, fv, rate);
}

// ── Dispatcher ──
export function calculateInvestment(
    calcType: string,
    input: InvestmentInput
): InvestmentResult {
    switch (calcType) {
        case "sip": return calculateSIP(input);
        case "fd": return calculateFD(input);
        case "rd": return calculateRD(input);
        case "ppf": return calculatePPF(input);
        case "nps": return calculateNPS(input);
        case "lumpsum": return calculateLumpsum(input);
        default: return calculateLumpsum(input);
    }
}

// ── Comparison Scenarios ──
export function calculateInvestmentComparison(
    calcType: string,
    input: InvestmentInput
) {
    const base = calculateInvestment(calcType, input);
    const plusRate = calculateInvestment(calcType, { ...input, rate: input.rate + 2 });
    const plusTenure = calculateInvestment(calcType, { ...input, tenure: input.tenure + 60 });

    return {
        base: { label: "Your plan", ...base },
        plusRate: {
            label: `+2% Returns (${(input.rate + 2).toFixed(1)}%)`,
            ...plusRate,
            returnsDiff: plusRate.maturityValue - base.maturityValue,
        },
        plusTenure: {
            label: `+5 Years (${Math.round((input.tenure + 60) / 12)}yr)`,
            ...plusTenure,
            returnsDiff: plusTenure.maturityValue - base.maturityValue,
        },
    };
}

// ── Helpers ──
function zeroResult(): InvestmentResult {
    return { totalInvested: 0, estimatedReturns: 0, maturityValue: 0, investedPercent: 0, returnsPercent: 0, effectiveYield: 0 };
}

function buildResult(invested: number, returns: number, maturity: number, rate: number): InvestmentResult {
    const investedPercent = maturity > 0 ? Math.round((invested / maturity) * 100) : 0;
    return {
        totalInvested: Math.round(invested),
        estimatedReturns: Math.round(returns),
        maturityValue: Math.round(maturity),
        investedPercent,
        returnsPercent: 100 - investedPercent,
        effectiveYield: parseFloat(((returns / invested) * 100).toFixed(1)),
    };
}

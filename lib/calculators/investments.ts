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

// ── Savings Interest Calculator ──
// Daily or Monthly compounding on a base balance + regular deposits
// For simplicity in UI, we use monthly compounding.
export function calculateSavingsInterest(input: InvestmentInput): InvestmentResult {
    const { amount, rate, tenure } = input;
    if (amount <= 0 || rate <= 0 || tenure <= 0) return zeroResult();

    // Standard savings account: compound monthly.
    const monthlyRate = rate / 12 / 100;
    const months = Math.round(tenure);

    // Future value of an initial lumpsum + future value of regular monthly deposits.
    // Assuming UI "amount" corresponds to an initial balance for Savings Interest.
    let balance = amount;
    for (let m = 1; m <= months; m++) {
        balance = balance * (1 + monthlyRate);
    }

    const estimatedReturns = balance - amount;

    return buildResult(amount, estimatedReturns, balance, rate);
}

// ── Deposit Maturity Calculator ──
export function calculateDepositMaturity(input: InvestmentInput): InvestmentResult {
    return calculateFD(input); // FD calculation handles lumpsum deposit maturity
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
        case "savings": return calculateSavingsInterest(input);
        case "maturity": return calculateDepositMaturity(input);
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

// ── Retirement / FIRE ──
export interface RetirementInput {
    currentAge: number;
    retirementAge: number;
    monthlyExpense: number;
    inflationRate: number;
    safeWithdrawalRate: number; // usually 4%
}

export interface RetirementResult {
    yearsToRetire: number;
    futureMonthlyExpense: number;
    corpusRequired: number;
}

export function calculateRetirementCorpus(input: RetirementInput): RetirementResult {
    const years = input.retirementAge - input.currentAge;
    if (years <= 0) {
        return {
            yearsToRetire: 0,
            futureMonthlyExpense: input.monthlyExpense,
            corpusRequired: input.monthlyExpense * 12 * (100 / input.safeWithdrawalRate)
        };
    }

    const futureMonthly = input.monthlyExpense * Math.pow(1 + input.inflationRate / 100, years);
    const futureAnnual = futureMonthly * 12;
    const corpus = futureAnnual * (100 / input.safeWithdrawalRate);

    return {
        yearsToRetire: years,
        futureMonthlyExpense: Math.round(futureMonthly),
        corpusRequired: Math.round(corpus)
    };
}

export function calculateFIRE(monthlyExpense: number, safeWithdrawalRate: number = 4): number {
    const annualExpense = monthlyExpense * 12;
    return Math.round(annualExpense * (100 / safeWithdrawalRate));
}

// ── Stock Return ──
export interface StockInput {
    buyPrice: number;
    sellPrice: number;
    quantity: number;
    dividendsReceived: number;
}
export interface StockResult {
    totalInvestment: number;
    totalValue: number;
    capitalGains: number;
    totalReturnPercent: number;
}
export function calculateStockReturn(input: StockInput): StockResult {
    const invested = input.buyPrice * input.quantity;
    const finalValue = input.sellPrice * input.quantity;
    const capitalGains = finalValue - invested;
    const totalReturn = capitalGains + input.dividendsReceived;
    const totalReturnPercent = invested > 0 ? (totalReturn / invested) * 100 : 0;

    return {
        totalInvestment: invested,
        totalValue: finalValue + input.dividendsReceived,
        capitalGains: capitalGains,
        totalReturnPercent: Math.round(totalReturnPercent * 100) / 100
    };
}

// ── Dividend Yield ──
export function calculateDividendYield(annualDividend: number, sharePrice: number): number {
    return sharePrice > 0 ? Math.round((annualDividend / sharePrice) * 10000) / 100 : 0;
}

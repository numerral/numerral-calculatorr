// Car Loan EMI — domain-specific calculator
//
// Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
//   P = principal loan amount
//   r = monthly interest rate (annual / 12 / 100)
//   n = tenure in months

export interface CarLoanInput {
    /** Loan amount in ₹ */
    amount: number;
    /** Annual interest rate in % (e.g. 8.5) */
    rate: number;
    /** Loan tenure in months */
    tenure: number;
}

export interface CarLoanResult {
    /** Monthly EMI in ₹ (rounded) */
    emi: number;
    /** Total interest payable over full tenure (rounded) */
    totalInterest: number;
    /** Total amount payable = principal + interest (rounded) */
    totalPayable: number;
    /** Principal as % of total payable */
    principalPercent: number;
    /** Interest as % of total payable */
    interestPercent: number;
    /** Interest-to-principal ratio (e.g. 22.9 means interest is 22.9% of principal) */
    interestRatio: number;
}

/**
 * Calculate car loan EMI and derived breakdowns.
 *
 * Returns zeroed result if any input is invalid (≤ 0).
 */
export function calculateCarLoanEmi(input: CarLoanInput): CarLoanResult {
    const { amount, rate, tenure } = input;

    if (amount <= 0 || rate <= 0 || tenure <= 0) {
        return {
            emi: 0,
            totalInterest: 0,
            totalPayable: 0,
            principalPercent: 0,
            interestPercent: 0,
            interestRatio: 0,
        };
    }

    const r = rate / 12 / 100; // monthly rate
    const n = tenure;           // months
    const emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - amount;
    const principalPercent = Math.round((amount / totalPayable) * 100);
    const interestPercent = 100 - principalPercent;
    const interestRatio = parseFloat(
        ((totalInterest / amount) * 100).toFixed(1)
    );

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable),
        principalPercent,
        interestPercent,
        interestRatio,
    };
}

/**
 * Generate comparison scenarios against a base calculation.
 * Returns base + 2 alternate scenarios.
 */
export function calculateComparison(input: CarLoanInput) {
    const base = calculateCarLoanEmi(input);
    const plusRate = calculateCarLoanEmi({
        ...input,
        rate: input.rate + 1,
    });
    const plusTenure = calculateCarLoanEmi({
        ...input,
        tenure: input.tenure + 12,
    });

    return {
        base: { label: "Your plan", ...base },
        plusRate: {
            label: `+1% Interest (${(input.rate + 1).toFixed(1)}%)`,
            ...plusRate,
            emiDiff: plusRate.emi - base.emi,
            interestDiff: plusRate.totalInterest - base.totalInterest,
        },
        plusTenure: {
            label: `+12 Months (${input.tenure + 12}mo)`,
            ...plusTenure,
            emiDiff: plusTenure.emi - base.emi,
            interestDiff: plusTenure.totalInterest - base.totalInterest,
        },
    };
}

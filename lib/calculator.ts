// EMI calculation utility

import { type EMIResult } from "./types";

export function calculateEMI(
    principal: number,
    annualRate: number,
    tenureMonths: number
): EMIResult {
    if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
        return { emi: 0, totalInterest: 0, totalPayable: 0 };
    }

    const r = annualRate / 12 / 100;
    const n = tenureMonths;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - principal;

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayable: Math.round(totalPayable),
    };
}

export function formatINR(num: number): string {
    return "₹" + num.toLocaleString("en-IN");
}

// Salary Calculator Engine — India FY 2025-26
// Salary After Tax, In-Hand Salary, CTC Breakdown, Gratuity, Bonus

import { calculateIncomeTax, type IncomeTaxResult } from "./taxes";

// ════════════════════════════════════════════════
// SHARED TYPES
// ════════════════════════════════════════════════

export interface SalaryBreakdown {
    // Income
    ctcAnnual: number;
    ctcMonthly: number;
    basicAnnual: number;
    basicMonthly: number;
    hraAnnual: number;
    hraMonthly: number;
    specialAllowanceAnnual: number;
    specialAllowanceMonthly: number;

    // Employer contributions (part of CTC, not in-hand)
    epfEmployerAnnual: number;
    epfEmployerMonthly: number;
    gratuityAnnual: number;
    gratuityMonthly: number;

    // Gross salary (CTC minus employer contributions)
    grossAnnual: number;
    grossMonthly: number;

    // Employee deductions
    epfEmployeeAnnual: number;
    epfEmployeeMonthly: number;
    professionalTaxAnnual: number;
    professionalTaxMonthly: number;
    incomeTaxAnnual: number;
    incomeTaxMonthly: number;

    // Total deductions
    totalDeductionsAnnual: number;
    totalDeductionsMonthly: number;

    // Net take-home
    netAnnual: number;
    netMonthly: number;

    // Tax details
    taxResult: IncomeTaxResult;
    regime: "old" | "new";
}

export interface GratuityResult {
    lastDrawnSalary: number;
    yearsOfService: number;
    gratuityAmount: number;
    isEligible: boolean;
    formula: string;
    taxExempt: number;
    taxable: number;
}

export interface BonusResult {
    basicSalary: number;
    bonusType: string;
    bonusPercentage: number;
    bonusAmount: number;
    statutoryMinimum: number;
    statutoryMaximum: number;
    effectiveBonus: number;
}


// ════════════════════════════════════════════════
// 1. SALARY AFTER TAX / CTC TO IN-HAND
// ════════════════════════════════════════════════

export interface SalaryInput {
    ctcAnnual: number;
    basicPercent: number;        // typically 40-50% of CTC
    hraPercent: number;          // typically 40-50% of basic
    epfIncluded: boolean;        // whether EPF is part of CTC
    regime: "old" | "new";
    deductions80C: number;       // for old regime
    deductions80D: number;       // for old regime
    rentPaidAnnual: number;      // for HRA exemption calc
    isMetro: boolean;            // for HRA (50% vs 40%)
}

const EPF_CAP_MONTHLY = 15000; // EPF on max basic of ₹15,000/month

export function calculateSalaryBreakdown(input: SalaryInput): SalaryBreakdown {
    const {
        ctcAnnual,
        basicPercent = 40,
        hraPercent = 50,
        epfIncluded = true,
        regime = "new",
        deductions80C = 0,
        deductions80D = 0,
        rentPaidAnnual = 0,
        isMetro = false,
    } = input;

    // 1. Basic salary
    const basicAnnual = Math.round(ctcAnnual * basicPercent / 100);
    const basicMonthly = Math.round(basicAnnual / 12);

    // 2. HRA
    const hraAnnual = Math.round(basicAnnual * hraPercent / 100);
    const hraMonthly = Math.round(hraAnnual / 12);

    // 3. EPF — employer contribution (12% of basic, capped at ₹15,000 basic)
    const epfBasicMonthly = Math.min(basicMonthly, EPF_CAP_MONTHLY);
    const epfEmployerMonthly = Math.round(epfBasicMonthly * 0.12);
    const epfEmployerAnnual = epfEmployerMonthly * 12;

    // 4. EPF — employee contribution (same as employer)
    const epfEmployeeMonthly = epfEmployerMonthly;
    const epfEmployeeAnnual = epfEmployeeMonthly * 12;

    // 5. Gratuity component in CTC (4.81% of basic)
    const gratuityAnnual = Math.round(basicAnnual * 4.81 / 100);
    const gratuityMonthly = Math.round(gratuityAnnual / 12);

    // 6. Special allowance = CTC - Basic - HRA - Employer EPF - Gratuity
    const employerCosts = epfIncluded ? (epfEmployerAnnual + gratuityAnnual) : gratuityAnnual;
    const specialAllowanceAnnual = Math.max(ctcAnnual - basicAnnual - hraAnnual - employerCosts, 0);
    const specialAllowanceMonthly = Math.round(specialAllowanceAnnual / 12);

    // 7. Gross salary (what employee sees before deductions)
    const grossAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual;
    const grossMonthly = Math.round(grossAnnual / 12);

    // 8. HRA exemption (for old regime tax calculation)
    let hraExemption = 0;
    if (regime === "old" && rentPaidAnnual > 0) {
        const actualHRA = hraAnnual;
        const percentOfBasic = isMetro ? basicAnnual * 0.50 : basicAnnual * 0.40;
        const rentMinus10 = Math.max(rentPaidAnnual - basicAnnual * 0.10, 0);
        hraExemption = Math.min(actualHRA, percentOfBasic, rentMinus10);
    }

    // 9. Income tax calculation
    const taxResult = calculateIncomeTax({
        annualIncome: grossAnnual,
        regime,
        deductions80C: regime === "old" ? Math.min(deductions80C + epfEmployeeAnnual, 150000) : 0,
        deductions80D: regime === "old" ? deductions80D : 0,
        deductionHRA: regime === "old" ? hraExemption : 0,
        otherDeductions: 0,
    });

    const incomeTaxAnnual = taxResult.totalTax;
    const incomeTaxMonthly = Math.round(incomeTaxAnnual / 12);

    // 10. Professional Tax (rough average ₹200/month — 11 months + ₹300 for Feb in MH)
    const professionalTaxMonthly = 200;
    const professionalTaxAnnual = 2400;

    // 11. Total deductions
    const totalDeductionsAnnual = epfEmployeeAnnual + professionalTaxAnnual + incomeTaxAnnual;
    const totalDeductionsMonthly = Math.round(totalDeductionsAnnual / 12);

    // 12. Net take-home
    const netAnnual = grossAnnual - totalDeductionsAnnual;
    const netMonthly = Math.round(netAnnual / 12);

    return {
        ctcAnnual,
        ctcMonthly: Math.round(ctcAnnual / 12),
        basicAnnual,
        basicMonthly,
        hraAnnual,
        hraMonthly,
        specialAllowanceAnnual,
        specialAllowanceMonthly,
        epfEmployerAnnual,
        epfEmployerMonthly,
        gratuityAnnual,
        gratuityMonthly,
        grossAnnual,
        grossMonthly,
        epfEmployeeAnnual,
        epfEmployeeMonthly,
        professionalTaxAnnual,
        professionalTaxMonthly,
        incomeTaxAnnual,
        incomeTaxMonthly,
        totalDeductionsAnnual,
        totalDeductionsMonthly,
        netAnnual,
        netMonthly,
        taxResult,
        regime,
    };
}


// ════════════════════════════════════════════════
// 2. GRATUITY CALCULATOR
// ════════════════════════════════════════════════

export function calculateGratuity(lastDrawnSalary: number, yearsOfService: number): GratuityResult {
    // Gratuity = Last Drawn Salary × 15/26 × Years of Service
    // "Last Drawn Salary" = Basic + DA
    // Eligible after 5 years of continuous service
    const isEligible = yearsOfService >= 5;
    const gratuityAmount = Math.round(lastDrawnSalary * 15 / 26 * yearsOfService);
    const formula = `₹${lastDrawnSalary.toLocaleString("en-IN")} × 15/26 × ${yearsOfService}`;

    // Tax exemption: minimum of (actual gratuity, ₹25 lakh, formula amount)
    const taxExemptLimit = 2500000; // ₹25 Lakh as per current rules
    const taxExempt = Math.min(gratuityAmount, taxExemptLimit);
    const taxable = Math.max(gratuityAmount - taxExempt, 0);

    return {
        lastDrawnSalary,
        yearsOfService,
        gratuityAmount,
        isEligible,
        formula,
        taxExempt,
        taxable,
    };
}


// ════════════════════════════════════════════════
// 3. BONUS CALCULATOR
// ════════════════════════════════════════════════

export function calculateBonus(
    basicMonthly: number,
    bonusPercent: number = 8.33,
): BonusResult {
    // Payment of Bonus Act: 8.33% to 20% of salary
    // Salary cap for bonus calculation: ₹21,000/month
    // Minimum bonus: 8.33%, Maximum: 20%
    const salaryCap = 21000;
    const effectiveBasic = Math.min(basicMonthly, salaryCap);
    const statutoryMinimum = Math.round(effectiveBasic * 8.33 / 100);
    const statutoryMaximum = Math.round(effectiveBasic * 20 / 100);

    const clampedPercent = Math.max(8.33, Math.min(bonusPercent, 20));
    const bonusMonthly = Math.round(effectiveBasic * clampedPercent / 100);
    const bonusAmount = bonusMonthly * 12;

    return {
        basicSalary: basicMonthly,
        bonusType: clampedPercent === 8.33 ? "Statutory Minimum" : "Custom",
        bonusPercentage: clampedPercent,
        bonusAmount,
        statutoryMinimum: statutoryMinimum * 12,
        statutoryMaximum: statutoryMaximum * 12,
        effectiveBonus: bonusAmount,
    };
}

/**
 * Utility calculator formulas
 * Age, Percentage, Compound Interest, Simple Interest, BMI, Discount
 */

// ─── AGE CALCULATOR ───

export interface AgeResult {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalMonths: number;
    totalWeeks: number;
    nextBirthday: number; // days until
}

export function calculateAge(
    birthDate: Date,
    toDate: Date = new Date()
): AgeResult {
    const birth = new Date(birthDate);
    const to = new Date(toDate);

    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const totalDays = Math.floor(
        (to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);

    // Next birthday
    let nextBday = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= to) {
        nextBday = new Date(to.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const nextBirthday = Math.ceil(
        (nextBday.getTime() - to.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { years, months, days, totalDays, totalMonths, totalWeeks, nextBirthday };
}

// ─── PERCENTAGE CALCULATOR ───

export interface PercentageResult {
    result: number;
    formula: string;
}

/** X% of Y */
export function percentOf(percent: number, value: number): PercentageResult {
    const result = (percent / 100) * value;
    return { result, formula: `${percent}% of ${value} = ${result}` };
}

/** X is what % of Y */
export function whatPercent(x: number, y: number): PercentageResult {
    const result = y !== 0 ? (x / y) * 100 : 0;
    return { result, formula: `${x} is ${result.toFixed(2)}% of ${y}` };
}

/** Percentage change from A to B */
export function percentChange(from: number, to: number): PercentageResult {
    const result = from !== 0 ? ((to - from) / from) * 100 : 0;
    const direction = result >= 0 ? "increase" : "decrease";
    return {
        result,
        formula: `${Math.abs(result).toFixed(2)}% ${direction} from ${from} to ${to}`,
    };
}

/** Percentage increase */
export function percentIncrease(value: number, percent: number): PercentageResult {
    const increase = (percent / 100) * value;
    const result = value + increase;
    return { result, formula: `${value} + ${percent}% = ${result}` };
}

/** Percentage decrease */
export function percentDecrease(value: number, percent: number): PercentageResult {
    const decrease = (percent / 100) * value;
    const result = value - decrease;
    return { result, formula: `${value} − ${percent}% = ${result}` };
}

// ─── COMPOUND INTEREST CALCULATOR ───

export interface CompoundInterestResult {
    principal: number;
    totalInterest: number;
    maturityAmount: number;
    effectiveRate: number;
    yearlyBreakdown: { year: number; principal: number; interest: number; balance: number }[];
}

export function calculateCompoundInterest(
    principal: number,
    annualRate: number,
    tenureMonths: number,
    compoundingFrequency: number = 12 // 1=yearly, 4=quarterly, 12=monthly, 365=daily
): CompoundInterestResult {
    const r = annualRate / 100;
    const n = compoundingFrequency;
    const t = tenureMonths / 12;
    const maturityAmount = Math.round(principal * Math.pow(1 + r / n, n * t));
    const totalInterest = maturityAmount - principal;
    const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

    const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = [];
    const totalYears = Math.ceil(tenureMonths / 12);
    for (let y = 1; y <= totalYears; y++) {
        const months = Math.min(y * 12, tenureMonths);
        const tY = months / 12;
        const balance = Math.round(principal * Math.pow(1 + r / n, n * tY));
        const interest = balance - principal;
        yearlyBreakdown.push({ year: y, principal, interest, balance });
    }

    return { principal, totalInterest, maturityAmount, effectiveRate, yearlyBreakdown };
}

// ─── SIMPLE INTEREST CALCULATOR ───

export interface SimpleInterestResult {
    principal: number;
    totalInterest: number;
    maturityAmount: number;
    monthlyInterest: number;
}

export function calculateSimpleInterest(
    principal: number,
    annualRate: number,
    tenureMonths: number
): SimpleInterestResult {
    const totalInterest = Math.round(
        (principal * annualRate * tenureMonths) / (100 * 12)
    );
    const maturityAmount = principal + totalInterest;
    const monthlyInterest = tenureMonths > 0 ? Math.round(totalInterest / tenureMonths) : 0;

    return { principal, totalInterest, maturityAmount, monthlyInterest };
}

// ─── BMI CALCULATOR ───

export type BMICategory =
    | "Severely Underweight"
    | "Underweight"
    | "Normal"
    | "Overweight"
    | "Obese Class I"
    | "Obese Class II"
    | "Obese Class III";

export interface BMIResult {
    bmi: number;
    category: BMICategory;
    healthyWeightRange: { min: number; max: number };
    color: string;
}

export function calculateBMI(weightKg: number, heightCm: number): BMIResult {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let category: BMICategory;
    let color: string;
    if (bmi < 16) { category = "Severely Underweight"; color = "#e74c3c"; }
    else if (bmi < 18.5) { category = "Underweight"; color = "#f39c12"; }
    else if (bmi < 25) { category = "Normal"; color = "#27ae60"; }
    else if (bmi < 30) { category = "Overweight"; color = "#f39c12"; }
    else if (bmi < 35) { category = "Obese Class I"; color = "#e67e22"; }
    else if (bmi < 40) { category = "Obese Class II"; color = "#e74c3c"; }
    else { category = "Obese Class III"; color = "#c0392b"; }

    // Healthy weight range (BMI 18.5 - 24.9) for the given height
    const healthyWeightRange = {
        min: Math.round(18.5 * heightM * heightM * 10) / 10,
        max: Math.round(24.9 * heightM * heightM * 10) / 10,
    };

    return { bmi: Math.round(bmi * 10) / 10, category, healthyWeightRange, color };
}

// ─── DISCOUNT CALCULATOR ───

export interface DiscountResult {
    originalPrice: number;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    savedPercent: number;
}

export function calculateDiscount(
    originalPrice: number,
    discountPercent: number,
    extraDiscountPercent: number = 0
): DiscountResult {
    const firstDiscount = Math.round(originalPrice * discountPercent / 100);
    const afterFirst = originalPrice - firstDiscount;
    const secondDiscount = Math.round(afterFirst * extraDiscountPercent / 100);
    const finalPrice = afterFirst - secondDiscount;
    const totalDiscount = firstDiscount + secondDiscount;
    const savedPercent = originalPrice > 0
        ? Math.round((totalDiscount / originalPrice) * 10000) / 100
        : 0;

    return {
        originalPrice,
        discountPercent: savedPercent,
        discountAmount: totalDiscount,
        finalPrice,
        savedPercent,
    };
}

// ComparisonTable — child of CalculatorCore (inherits client boundary)
// DO NOT add "use client" here — CalculatorCore is the boundary.
// Receives live-updating values from CalculatorCore state.

import {
    type CarLoanInput,
    calculateComparison,
} from "@/lib/calculators/carLoanEmi";

interface ComparisonTableProps {
    input: CarLoanInput;
    locale?: "en" | "ar";
}

function fmtCurrency(num: number, locale: "en" | "ar"): string {
    if (locale === "ar") return num.toLocaleString("ar-SA") + " ر.س";
    return "₹" + num.toLocaleString("en-IN");
}

const L = {
    en: { metric: "Metric", emi: "Monthly EMI", interest: "Total Interest", payable: "Total Payable" },
    ar: { metric: "المقارنة", emi: "القسط الشهري", interest: "إجمالي الأرباح", payable: "إجمالي المسدد" },
};

function DiffBadge({ value, locale }: { value: number; locale: "en" | "ar" }) {
    if (value === 0) return null;
    const isUp = value > 0;
    return (
        <span className={isUp ? "diff-up" : "diff-down"}>
            {isUp ? "↑" : "↓"} {fmtCurrency(Math.abs(value), locale)}
        </span>
    );
}

export default function ComparisonTable({ input, locale = "en" }: ComparisonTableProps) {
    const { base, plusRate, plusTenure } = calculateComparison(input);
    const t = L[locale];
    const fmt = (n: number) => fmtCurrency(n, locale);

    return (
        <div className="comparison-table-wrap">
            <table className="comparison-table">
                <thead>
                    <tr>
                        <th>{t.metric}</th>
                        <th>{base.label}</th>
                        <th>{plusRate.label}</th>
                        <th>{plusTenure.label}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{t.emi}</td>
                        <td>{fmt(base.emi)}</td>
                        <td>
                            {fmt(plusRate.emi)}{" "}
                            <DiffBadge value={plusRate.emiDiff} locale={locale} />
                        </td>
                        <td>
                            {fmt(plusTenure.emi)}{" "}
                            <DiffBadge value={plusTenure.emiDiff} locale={locale} />
                        </td>
                    </tr>
                    <tr>
                        <td>{t.interest}</td>
                        <td>{fmt(base.totalInterest)}</td>
                        <td>
                            {fmt(plusRate.totalInterest)}{" "}
                            <DiffBadge value={plusRate.interestDiff} locale={locale} />
                        </td>
                        <td>
                            {fmt(plusTenure.totalInterest)}{" "}
                            <DiffBadge value={plusTenure.interestDiff} locale={locale} />
                        </td>
                    </tr>
                    <tr>
                        <td>{t.payable}</td>
                        <td>{fmt(base.totalPayable)}</td>
                        <td>{fmt(plusRate.totalPayable)}</td>
                        <td>{fmt(plusTenure.totalPayable)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

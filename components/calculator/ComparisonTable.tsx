// ComparisonTable — child of CalculatorCore (inherits client boundary)
// DO NOT add "use client" here — CalculatorCore is the boundary.
// Receives live-updating values from CalculatorCore state.

import {
    type CarLoanInput,
    calculateComparison,
} from "@/lib/calculators/carLoanEmi";

interface ComparisonTableProps {
    input: CarLoanInput;
}

function formatINR(num: number): string {
    return "₹" + num.toLocaleString("en-IN");
}

function DiffBadge({ value }: { value: number }) {
    if (value === 0) return null;
    const isUp = value > 0;
    return (
        <span className={isUp ? "diff-up" : "diff-down"}>
            {isUp ? "↑" : "↓"} {formatINR(Math.abs(value))}
        </span>
    );
}

export default function ComparisonTable({ input }: ComparisonTableProps) {
    const { base, plusRate, plusTenure } = calculateComparison(input);

    return (
        <div className="comparison-table-wrap">
            <table className="comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>{base.label}</th>
                        <th>{plusRate.label}</th>
                        <th>{plusTenure.label}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Monthly EMI</td>
                        <td>{formatINR(base.emi)}</td>
                        <td>
                            {formatINR(plusRate.emi)}{" "}
                            <DiffBadge value={plusRate.emiDiff} />
                        </td>
                        <td>
                            {formatINR(plusTenure.emi)}{" "}
                            <DiffBadge value={plusTenure.emiDiff} />
                        </td>
                    </tr>
                    <tr>
                        <td>Total Interest</td>
                        <td>{formatINR(base.totalInterest)}</td>
                        <td>
                            {formatINR(plusRate.totalInterest)}{" "}
                            <DiffBadge value={plusRate.interestDiff} />
                        </td>
                        <td>
                            {formatINR(plusTenure.totalInterest)}{" "}
                            <DiffBadge value={plusTenure.interestDiff} />
                        </td>
                    </tr>
                    <tr>
                        <td>Total Payable</td>
                        <td>{formatINR(base.totalPayable)}</td>
                        <td>{formatINR(plusRate.totalPayable)}</td>
                        <td>{formatINR(plusTenure.totalPayable)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

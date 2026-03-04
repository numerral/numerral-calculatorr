// ResultCard — child of CalculatorCore (inherits client boundary)
// DO NOT add "use client" here — CalculatorCore is the boundary.

import { type CarLoanResult } from "@/lib/calculators/carLoanEmi";

interface ResultCardProps {
    result: CarLoanResult;
    principal: number;
}

function formatINR(num: number): string {
    return "₹" + num.toLocaleString("en-IN");
}

export default function ResultCard({ result, principal }: ResultCardProps) {
    const handleCopy = () => {
        const text = [
            `EMI: ${formatINR(result.emi)}`,
            `Principal: ${formatINR(principal)}`,
            `Total Interest: ${formatINR(result.totalInterest)}`,
            `Total Payable: ${formatINR(result.totalPayable)}`,
        ].join(" | ");
        navigator.clipboard.writeText(text);
    };

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="calc-result" aria-live="polite">
            <p className="calc-result__label">Your Monthly EMI</p>
            <p className="calc-result__emi">{formatINR(result.emi)}</p>

            {/* Stat trio */}
            <div className="calc-result__stats">
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">Principal</p>
                    <p className="calc-result__stat-value">{formatINR(principal)}</p>
                </div>
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">Total Interest</p>
                    <p className="calc-result__stat-value">
                        {formatINR(result.totalInterest)}
                    </p>
                </div>
                <div className="calc-result__stat">
                    <p className="calc-result__stat-label">Total Payable</p>
                    <p className="calc-result__stat-value">
                        {formatINR(result.totalPayable)}
                    </p>
                </div>
            </div>

            {/* Text-only breakdown (no chart) */}
            <div className="calc-result__breakdown">
                <p className="calc-result__breakdown-title">Breakdown</p>
                <p className="calc-result__breakdown-line">
                    Principal: {formatINR(principal)} ({result.principalPercent}%)
                </p>
                <p className="calc-result__breakdown-line">
                    Interest: {formatINR(result.totalInterest)} (
                    {result.interestPercent}%)
                </p>
                <p className="calc-result__breakdown-line">
                    Interest-to-Principal: {result.interestRatio}%
                </p>
            </div>

            {/* Actions */}
            <div className="calc-result__actions">
                <button className="btn btn--ghost" onClick={handleCopy}>
                    📋 Copy
                </button>
                <button className="btn btn--ghost" onClick={handleShare}>
                    📤 Share
                </button>
            </div>
        </div>
    );
}

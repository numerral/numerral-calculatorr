// InvestmentCalculatorCore — Client component for investment calculators
// Different UI from EMI: shows Invested, Returns, Maturity Value
"use client";

import { useState, useMemo } from "react";
import { calculateInvestment, calculateInvestmentComparison, type InvestmentResult } from "@/lib/calculators/investments";

interface InvestmentCalculatorCoreProps {
    defaults: { amount: number; rate: number; tenure: number };
    sliderRanges?: {
        amount: { min: number; max: number; step: number };
        rate: { min: number; max: number; step: number };
        tenure: { min: number; max: number; step: number };
    };
    calcType: string;
    labels?: {
        amountLabel?: string;
        rateLabel?: string;
        tenureLabel?: string;
    };
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

export default function InvestmentCalculatorCore({
    defaults,
    sliderRanges = {
        amount: { min: 500, max: 100000, step: 500 },
        rate: { min: 1, max: 30, step: 0.5 },
        tenure: { min: 12, max: 360, step: 12 },
    },
    calcType,
    labels = {},
}: InvestmentCalculatorCoreProps) {
    const [amount, setAmount] = useState(defaults.amount);
    const [rate, setRate] = useState(defaults.rate);
    const [tenure, setTenure] = useState(defaults.tenure);

    const amountLabel = labels.amountLabel || (["sip", "rd", "nps"].includes(calcType) ? "Monthly Investment" : "Investment Amount");
    const rateLabel = labels.rateLabel || "Expected Return Rate (p.a.)";
    const tenureLabel = labels.tenureLabel || "Time Period";

    const result: InvestmentResult = useMemo(
        () => calculateInvestment(calcType, { amount, rate, tenure }),
        [amount, rate, tenure, calcType]
    );

    const comparison = useMemo(
        () => calculateInvestmentComparison(calcType, { amount, rate, tenure }),
        [amount, rate, tenure, calcType]
    );

    return (
        <div>
            {/* Input Panel */}
            <div className="calc-input-panel">
                {/* Amount */}
                <div className="calc-field">
                    <label className="calc-field__label">
                        <span className="calc-field__label-icon">₹</span>
                        {amountLabel}
                    </label>
                    <input
                        type="range"
                        className="calc-field__slider"
                        min={sliderRanges.amount.min}
                        max={sliderRanges.amount.max}
                        step={sliderRanges.amount.step}
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <input
                        type="text"
                        className="calc-field__input"
                        value={amount.toLocaleString("en-IN")}
                        onChange={(e) => {
                            const parsed = parseInt(e.target.value.replace(/,/g, ""));
                            if (!isNaN(parsed)) setAmount(parsed);
                        }}
                        inputMode="numeric"
                    />
                </div>

                {/* Rate */}
                <div className="calc-field">
                    <label className="calc-field__label">
                        <span className="calc-field__label-icon">%</span>
                        {rateLabel}
                    </label>
                    <input
                        type="range"
                        className="calc-field__slider"
                        min={sliderRanges.rate.min}
                        max={sliderRanges.rate.max}
                        step={sliderRanges.rate.step}
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                    />
                    <input
                        type="text"
                        className="calc-field__input"
                        value={rate}
                        onChange={(e) => {
                            const parsed = parseFloat(e.target.value);
                            if (!isNaN(parsed)) setRate(parsed);
                        }}
                        inputMode="decimal"
                    />
                </div>

                {/* Tenure */}
                <div className="calc-field">
                    <label className="calc-field__label">
                        <span className="calc-field__label-icon">📅</span>
                        {tenureLabel}
                    </label>
                    <input
                        type="range"
                        className="calc-field__slider"
                        min={sliderRanges.tenure.min}
                        max={sliderRanges.tenure.max}
                        step={sliderRanges.tenure.step}
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                            type="text"
                            className="calc-field__input"
                            value={tenure}
                            inputMode="numeric"
                            onChange={(e) => {
                                const parsed = parseInt(e.target.value);
                                if (!isNaN(parsed)) setTenure(parsed);
                            }}
                            style={{ flex: 1 }}
                        />
                        <span className="t-body-sm text-muted" style={{ whiteSpace: "nowrap" }}>
                            months ({(tenure / 12).toFixed(1)} years)
                        </span>
                    </div>
                </div>
            </div>

            {/* Result Card */}
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Maturity Value</p>
                <p className="calc-result__emi">{formatINR(result.maturityValue)}</p>

                <div className="calc-result__stats">
                    <div className="calc-result__stat">
                        <p className="calc-result__stat-label">Total Invested</p>
                        <p className="calc-result__stat-value">{formatINR(result.totalInvested)}</p>
                    </div>
                    <div className="calc-result__stat">
                        <p className="calc-result__stat-label">Est. Returns</p>
                        <p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>
                            {formatINR(result.estimatedReturns)}
                        </p>
                    </div>
                    <div className="calc-result__stat">
                        <p className="calc-result__stat-label">Wealth Gain</p>
                        <p className="calc-result__stat-value">{result.effectiveYield}%</p>
                    </div>
                </div>

                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Breakdown</p>
                    <p className="calc-result__breakdown-line">
                        Invested: {formatINR(result.totalInvested)} ({result.investedPercent}%)
                    </p>
                    <p className="calc-result__breakdown-line">
                        Returns: {formatINR(result.estimatedReturns)} ({result.returnsPercent}%)
                    </p>
                </div>

                <div className="calc-result__actions">
                    <button
                        className="btn btn--ghost"
                        onClick={() => {
                            const text = `Maturity: ${formatINR(result.maturityValue)} | Invested: ${formatINR(result.totalInvested)} | Returns: ${formatINR(result.estimatedReturns)}`;
                            navigator.clipboard.writeText(text);
                        }}
                    >
                        📋 Copy
                    </button>
                    <button
                        className="btn btn--ghost"
                        onClick={() => {
                            if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
                        }}
                    >
                        📤 Share
                    </button>
                </div>
            </div>

            {/* Comparison Table */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Scenario Comparison</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>{comparison.base.label}</th>
                                <th>{comparison.plusRate.label}</th>
                                <th>{comparison.plusTenure.label}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Invested</td>
                                <td>{formatINR(comparison.base.totalInvested)}</td>
                                <td>{formatINR(comparison.plusRate.totalInvested)}</td>
                                <td>{formatINR(comparison.plusTenure.totalInvested)}</td>
                            </tr>
                            <tr>
                                <td>Maturity Value</td>
                                <td>{formatINR(comparison.base.maturityValue)}</td>
                                <td>
                                    {formatINR(comparison.plusRate.maturityValue)}{" "}
                                    <span className="diff-negative">↑ {formatINR(comparison.plusRate.returnsDiff)}</span>
                                </td>
                                <td>
                                    {formatINR(comparison.plusTenure.maturityValue)}{" "}
                                    <span className="diff-negative">↑ {formatINR(comparison.plusTenure.returnsDiff)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>Est. Returns</td>
                                <td>{formatINR(comparison.base.estimatedReturns)}</td>
                                <td>{formatINR(comparison.plusRate.estimatedReturns)}</td>
                                <td>{formatINR(comparison.plusTenure.estimatedReturns)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

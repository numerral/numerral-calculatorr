// InvestmentCalculatorCore — Client component for investment calculators
// Different UI from EMI: shows Invested, Returns, Maturity Value
"use client";

import { useState, useMemo } from "react";
import {
    calculateInvestment,
    calculateInvestmentComparison,
    calculateRetirementCorpus,
    calculateFIRE,
    calculateStockReturn,
    calculateDividendYield,
    type InvestmentResult
} from "@/lib/calculators/investments";
import InvestmentGrowthChart from "./InvestmentGrowthChart";

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

    if (calcType === "retirement") return <RetirementCalc defaults={defaults} sliderRanges={sliderRanges} />;
    if (calcType === "fire") return <FireCalc defaults={defaults} sliderRanges={sliderRanges} />;
    if (calcType === "stockReturn") return <StockReturnCalc defaults={defaults} sliderRanges={sliderRanges} />;
    if (calcType === "dividendYield") return <DividendYieldCalc defaults={defaults} sliderRanges={sliderRanges} />;

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

            <InvestmentGrowthChart
                totalInvested={result.totalInvested}
                estimatedReturns={result.estimatedReturns}
                maturityValue={result.maturityValue}
                monthlyAmount={amount}
                rate={rate}
                tenureMonths={tenure}
                calcType={calcType}
            />

            {/* Comparison Table */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Investment Scenario Comparison</h3>
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

// ─── Retirement Calculator ───
function RetirementCalc({ defaults, sliderRanges }: any) {
    const [currentAge, setCurrentAge] = useState(30);
    const [retirementAge, setRetirementAge] = useState(60);
    const [monthlyExpense, setMonthlyExpense] = useState(defaults.amount || 50000);
    const [inflationRate, setInflationRate] = useState(defaults.rate || 6);

    const result = useMemo(() => calculateRetirementCorpus({
        currentAge, retirementAge, monthlyExpense, inflationRate, safeWithdrawalRate: 4
    }), [currentAge, retirementAge, monthlyExpense, inflationRate]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label">👤 CURRENT AGE</label>
                    <input type="range" className="calc-field__slider" min={18} max={60} step={1} value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">🏖️ TARGET RETIREMENT AGE</label>
                    <input type="range" className="calc-field__slider" min={40} max={70} step={1} value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">₹ CURRENT MONTHLY EXPENSES</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.amount.min} max={sliderRanges.amount.max} step={sliderRanges.amount.step} value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">📉 EXPECTED INFLATION (%)</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.rate.min} max={sliderRanges.rate.max} step={sliderRanges.rate.step} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-6)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">RETIREMENT CORPUS REQUIRED</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {formatINR(result.corpusRequired)}
                </p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                    You have <strong>{result.yearsToRetire} years</strong> until retirement.
                    Due to {inflationRate}% expected inflation, your future monthly expenses will be <strong>{formatINR(result.futureMonthlyExpense)} / month</strong>.
                </p>
            </div>
        </div>
    );
}

// ─── FIRE Calculator ───
function FireCalc({ defaults, sliderRanges }: any) {
    const [monthlyExpense, setMonthlyExpense] = useState(defaults.amount || 60000);
    const [swr, setSwr] = useState(defaults.rate || 4);

    const result = useMemo(() => calculateFIRE(monthlyExpense, swr), [monthlyExpense, swr]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label">₹ CURRENT MONTHLY EXPENSES</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.amount.min} max={sliderRanges.amount.max} step={sliderRanges.amount.step} value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">🛡️ SAFE WITHDRAWAL RATE (%)</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.rate.min} max={sliderRanges.rate.max} step={sliderRanges.rate.step} value={swr} onChange={(e) => setSwr(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={swr} onChange={(e) => setSwr(Number(e.target.value))} />
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-6)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">TARGET FIRE NUMBER</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {formatINR(result)}
                </p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                    Based on the {swr}% safe withdrawal rule, you need {formatINR(result)} invested into income-producing assets to safely cover {formatINR(monthlyExpense * 12)} / year indefinitely.
                </p>
            </div>
        </div>
    );
}

// ─── Stock Return Calculator ───
function StockReturnCalc({ defaults, sliderRanges }: any) {
    const [buyPrice, setBuyPrice] = useState(defaults.amount || 1000);
    const [sellPrice, setSellPrice] = useState(defaults.rate || 1500);
    const [quantity, setQuantity] = useState(100);
    const [dividends, setDividends] = useState(defaults.tenure || 50);

    const result = useMemo(() => calculateStockReturn({ buyPrice, sellPrice, quantity, dividendsReceived: dividends }), [buyPrice, sellPrice, quantity, dividends]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label">₹ BUY PRICE (PER SHARE)</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.amount.min} max={sliderRanges.amount.max} step={sliderRanges.amount.step} value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">₹ CURRENT / SELL PRICE</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.rate.min} max={sliderRanges.rate.max} step={sliderRanges.rate.step} value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">📦 QUANTITY (SHARES)</label>
                    <input type="range" className="calc-field__slider" min={1} max={5000} step={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">💸 TOTAL DIVIDENDS RECEIVED</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.tenure.min} max={sliderRanges.tenure.max} step={sliderRanges.tenure.step} value={dividends} onChange={(e) => setDividends(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={dividends} onChange={(e) => setDividends(Number(e.target.value))} />
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-6)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">TOTAL RETURN PERCENTAGE</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {result.totalReturnPercent.toFixed(2)}%
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-4)" }}>
                    <div><p className="calc-field__label">INVESTED</p><p style={{ fontWeight: 700, color: "var(--n-text)" }}>{formatINR(result.totalInvestment)}</p></div>
                    <div><p className="calc-field__label">CAPITAL GAINS</p><p style={{ fontWeight: 700, color: "var(--n-success)" }}>{formatINR(result.capitalGains)}</p></div>
                    <div><p className="calc-field__label">FINAL VALUE</p><p style={{ fontWeight: 700, color: "var(--n-primary)" }}>{formatINR(result.totalValue)}</p></div>
                </div>
            </div>
        </div>
    );
}

// ─── Dividend Yield Calculator ───
function DividendYieldCalc({ defaults, sliderRanges }: any) {
    const [annualDividend, setAnnualDividend] = useState(defaults.amount || 25);
    const [sharePrice, setSharePrice] = useState(defaults.rate || 800);

    const yieldPercent = useMemo(() => calculateDividendYield(annualDividend, sharePrice), [annualDividend, sharePrice]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label">💸 ANNUAL DIVIDEND PER SHARE</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.amount.min} max={sliderRanges.amount.max} step={sliderRanges.amount.step} value={annualDividend} onChange={(e) => setAnnualDividend(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={annualDividend} onChange={(e) => setAnnualDividend(Number(e.target.value))} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label">₹ CURRENT SHARE PRICE</label>
                    <input type="range" className="calc-field__slider" min={sliderRanges.rate.min} max={sliderRanges.rate.max} step={sliderRanges.rate.step} value={sharePrice} onChange={(e) => setSharePrice(Number(e.target.value))} />
                    <input type="number" className="calc-field__input" value={sharePrice} onChange={(e) => setSharePrice(Number(e.target.value))} />
                </div>
            </div>

            <div className="calc-card" style={{ marginTop: "var(--s-6)", background: "var(--n-surface-alt)" }}>
                <p className="calc-field__label">DIVIDEND YIELD</p>
                <p style={{ fontSize: "var(--t-h1)", fontWeight: 700, color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    {yieldPercent.toFixed(2)}%
                </p>
                <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)" }}>
                    You are earning an annualized cash return of {yieldPercent.toFixed(2)}% on your investment size, irrespective of the core capital appreciation.
                </p>
            </div>
        </div>
    );
}

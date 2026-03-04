// TaxCalculatorCore — Client component for all tax calculators
// Dynamic form-based UI per calcType (income-tax, gst, hra, tds, capital-gains, professional-tax)
"use client";

import { useState, useMemo } from "react";
import {
    calculateIncomeTax,
    calculateGST,
    calculateHRA,
    calculateTDS,
    calculateCapitalGains,
    calculateProfessionalTax,
    PT_STATES,
    type IncomeTaxResult,
    type GSTResult,
    type HRAResult,
    type TDSResult,
    type CapitalGainsResult,
    type ProfessionalTaxResult,
    type TDSIncomeType,
    type AssetType,
} from "@/lib/calculators/taxes";

interface TaxCalculatorCoreProps {
    calcType: string;
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

/* ── Income Tax ── */
function IncomeTaxForm() {
    const [income, setIncome] = useState(1000000);
    const [regime, setRegime] = useState<"old" | "new">("new");
    const [ded80C, setDed80C] = useState(150000);
    const [ded80D, setDed80D] = useState(25000);
    const [dedHRA, setDedHRA] = useState(0);
    const [dedOther, setDedOther] = useState(0);

    const result: IncomeTaxResult = useMemo(
        () => calculateIncomeTax({ annualIncome: income, regime, deductions80C: ded80C, deductions80D: ded80D, deductionHRA: dedHRA, otherDeductions: dedOther }),
        [income, regime, ded80C, ded80D, dedHRA, dedOther]
    );
    const other = useMemo(
        () => calculateIncomeTax({ annualIncome: income, regime: regime === "new" ? "old" : "new", deductions80C: ded80C, deductions80D: ded80D, deductionHRA: dedHRA, otherDeductions: dedOther }),
        [income, regime, ded80C, ded80D, dedHRA, dedOther]
    );

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Annual Income</label>
                    <input type="range" className="calc-field__slider" min={0} max={50000000} step={50000} value={income} onChange={e => setIncome(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={income.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setIncome(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Tax Regime</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${regime === "new" ? " active" : ""}`} onClick={() => setRegime("new")}>New Regime</button>
                        <button className={`tax-toggle__btn${regime === "old" ? " active" : ""}`} onClick={() => setRegime("old")}>Old Regime</button>
                    </div>
                </div>
                {regime === "old" && (<>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏦</span>80C (max ₹1.5L)</label>
                        <input type="text" className="calc-field__input" value={ded80C.toLocaleString("en-IN")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setDed80C(Math.min(v, 150000)); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏥</span>80D (Health Insurance)</label>
                        <input type="text" className="calc-field__input" value={ded80D.toLocaleString("en-IN")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setDed80D(v); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>HRA Exemption</label>
                        <input type="text" className="calc-field__input" value={dedHRA.toLocaleString("en-IN")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setDedHRA(v); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">📝</span>Other (80G, 80E…)</label>
                        <input type="text" className="calc-field__input" value={dedOther.toLocaleString("en-IN")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setDedOther(v); }} />
                    </div>
                </>)}
            </div>

            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Total Tax ({result.regime})</p>
                <p className="calc-result__emi">{formatINR(result.totalTax)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Taxable Income</p><p className="calc-result__stat-value">{formatINR(result.taxableIncome)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Effective Rate</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{result.effectiveRate}%</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Deductions</p><p className="calc-result__stat-value">{formatINR(result.totalDeductions)}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Breakdown</p>
                    <p className="calc-result__breakdown-line">Income Tax: {formatINR(result.incomeTax)}</p>
                    {result.surcharge > 0 && <p className="calc-result__breakdown-line">Surcharge: {formatINR(result.surcharge)}</p>}
                    <p className="calc-result__breakdown-line">Cess (4%): {formatINR(result.cess)}</p>
                </div>
            </div>

            {/* Slab table */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Slab Breakdown</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead><tr><th>Slab</th><th>Rate</th><th>Taxable</th><th>Tax</th></tr></thead>
                        <tbody>{result.slabs.map((s, i) => <tr key={i}><td>{s.slab}</td><td>{s.rate}%</td><td>{formatINR(s.taxableIncome)}</td><td>{formatINR(s.tax)}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>

            {/* Regime comparison */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Old vs New Regime</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead><tr><th>Metric</th><th>{result.regime}</th><th>{other.regime}</th></tr></thead>
                        <tbody>
                            <tr><td>Taxable Income</td><td>{formatINR(result.taxableIncome)}</td><td>{formatINR(other.taxableIncome)}</td></tr>
                            <tr><td>Income Tax</td><td>{formatINR(result.incomeTax)}</td><td>{formatINR(other.incomeTax)}</td></tr>
                            <tr><td>Cess</td><td>{formatINR(result.cess)}</td><td>{formatINR(other.cess)}</td></tr>
                            <tr>
                                <td><strong>Total Tax</strong></td>
                                <td style={result.totalTax <= other.totalTax ? { color: "var(--n-success)" } : undefined}><strong>{formatINR(result.totalTax)}</strong>{result.totalTax < other.totalTax && " ✓"}</td>
                                <td style={other.totalTax <= result.totalTax ? { color: "var(--n-success)" } : undefined}><strong>{formatINR(other.totalTax)}</strong>{other.totalTax < result.totalTax && " ✓"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {result.totalTax !== other.totalTax && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-success)", fontWeight: 600 }}>
                        💡 Save {formatINR(Math.abs(result.totalTax - other.totalTax))} with {result.totalTax < other.totalTax ? result.regime : other.regime}.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── GST ── */
function GSTForm() {
    const [amount, setAmount] = useState(10000);
    const [rate, setRate] = useState(18);
    const [mode, setMode] = useState<"exclusive" | "inclusive">("exclusive");
    const [supplyType, setSupplyType] = useState<"intra" | "inter">("intra");

    const result: GSTResult = useMemo(() => calculateGST({ amount, rate, mode, supplyType }), [amount, rate, mode, supplyType]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Amount</label>
                    <input type="text" className="calc-field__input" value={amount.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setAmount(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">%</span>GST Rate</label>
                    <div className="tax-toggle">
                        {[5, 12, 18, 28].map(r => <button key={r} className={`tax-toggle__btn${rate === r ? " active" : ""}`} onClick={() => setRate(r)}>{r}%</button>)}
                    </div>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Tax Mode</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${mode === "exclusive" ? " active" : ""}`} onClick={() => setMode("exclusive")}>Exclusive</button>
                        <button className={`tax-toggle__btn${mode === "inclusive" ? " active" : ""}`} onClick={() => setMode("inclusive")}>Inclusive</button>
                    </div>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">🔄</span>Supply Type</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${supplyType === "intra" ? " active" : ""}`} onClick={() => setSupplyType("intra")}>CGST+SGST</button>
                        <button className={`tax-toggle__btn${supplyType === "inter" ? " active" : ""}`} onClick={() => setSupplyType("inter")}>IGST</button>
                    </div>
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Total Amount ({result.mode})</p>
                <p className="calc-result__emi">{formatINR(result.totalAmount)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Base Amount</p><p className="calc-result__stat-value">{formatINR(result.baseAmount)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">GST ({rate}%)</p><p className="calc-result__stat-value" style={{ color: "var(--n-warning)" }}>{formatINR(result.gstAmount)}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">GST Split</p>
                    {supplyType === "intra" ? (<>
                        <p className="calc-result__breakdown-line">CGST ({rate / 2}%): {formatINR(result.cgst)}</p>
                        <p className="calc-result__breakdown-line">SGST ({rate / 2}%): {formatINR(result.sgst)}</p>
                    </>) : (
                        <p className="calc-result__breakdown-line">IGST ({rate}%): {formatINR(result.igst)}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── HRA ── */
function HRAForm() {
    const [basic, setBasic] = useState(600000);
    const [hra, setHra] = useState(300000);
    const [rent, setRent] = useState(240000);
    const [isMetro, setIsMetro] = useState(true);

    const result: HRAResult = useMemo(() => calculateHRA({ basicSalary: basic, hraReceived: hra, rentPaid: rent, isMetro }), [basic, hra, rent, isMetro]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Basic Salary (Annual)</label>
                    <input type="range" className="calc-field__slider" min={0} max={10000000} step={5000} value={basic} onChange={e => setBasic(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={basic.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setBasic(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>HRA Received (Annual)</label>
                    <input type="text" className="calc-field__input" value={hra.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setHra(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Rent Paid (Annual)</label>
                    <input type="text" className="calc-field__input" value={rent.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setRent(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">🏙️</span>City Type</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${isMetro ? " active" : ""}`} onClick={() => setIsMetro(true)}>Metro (50%)</button>
                        <button className={`tax-toggle__btn${!isMetro ? " active" : ""}`} onClick={() => setIsMetro(false)}>Non-Metro (40%)</button>
                    </div>
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">HRA Exemption</p>
                <p className="calc-result__emi">{formatINR(result.exemption)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Taxable HRA</p><p className="calc-result__stat-value" style={{ color: "var(--n-warning)" }}>{formatINR(result.taxableHRA)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Rule Applied</p><p className="calc-result__stat-value" style={{ fontSize: "0.85rem" }}>{result.rule}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Three-Rule Comparison</p>
                    <p className="calc-result__breakdown-line" style={result.exemption === result.actualHRA ? { color: "var(--n-success)", fontWeight: 600 } : undefined}>
                        1. Actual HRA: {formatINR(result.actualHRA)} {result.exemption === result.actualHRA && "← Lowest"}
                    </p>
                    <p className="calc-result__breakdown-line" style={result.exemption === result.percentOfBasic ? { color: "var(--n-success)", fontWeight: 600 } : undefined}>
                        2. {isMetro ? "50%" : "40%"} of Basic: {formatINR(result.percentOfBasic)} {result.exemption === result.percentOfBasic && "← Lowest"}
                    </p>
                    <p className="calc-result__breakdown-line" style={result.exemption === result.rentMinus10 ? { color: "var(--n-success)", fontWeight: 600 } : undefined}>
                        3. Rent − 10% Basic: {formatINR(result.rentMinus10)} {result.exemption === result.rentMinus10 && "← Lowest"}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── TDS ── */
const TDS_OPTIONS: { value: TDSIncomeType; label: string }[] = [
    { value: "salary", label: "Salary" },
    { value: "interest", label: "Interest Income" },
    { value: "rent", label: "Rent Payment" },
    { value: "professional", label: "Professional Fees" },
    { value: "property-sale", label: "Property Sale" },
    { value: "lottery", label: "Lottery / Game Show" },
    { value: "commission", label: "Commission / Brokerage" },
];

function TDSForm() {
    const [incomeType, setIncomeType] = useState<TDSIncomeType>("salary");
    const [amount, setAmount] = useState(500000);
    const [hasPAN, setHasPAN] = useState(true);

    const result: TDSResult = useMemo(() => calculateTDS({ incomeType, amount, hasPAN }), [incomeType, amount, hasPAN]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Income Type</label>
                    <select className="calc-field__select" value={incomeType} onChange={e => setIncomeType(e.target.value as TDSIncomeType)}>
                        {TDS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Amount</label>
                    <input type="text" className="calc-field__input" value={amount.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setAmount(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">🪪</span>PAN Status</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${hasPAN ? " active" : ""}`} onClick={() => setHasPAN(true)}>PAN Available</button>
                        <button className={`tax-toggle__btn${!hasPAN ? " active" : ""}`} onClick={() => setHasPAN(false)}>No PAN</button>
                    </div>
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">TDS Amount ({result.section})</p>
                <p className="calc-result__emi">{formatINR(result.tdsAmount)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Net Amount</p><p className="calc-result__stat-value">{formatINR(result.netAmount)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">TDS Rate</p><p className="calc-result__stat-value" style={{ color: "var(--n-warning)" }}>{result.tdsRate}%</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Threshold</p><p className="calc-result__stat-value">{formatINR(result.threshold)}</p></div>
                </div>
                {amount <= result.threshold && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-success)", fontWeight: 600 }}>
                        ✅ Below TDS threshold of {formatINR(result.threshold)} — no TDS applicable.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── Capital Gains ── */
const ASSET_OPTIONS: { value: AssetType; label: string }[] = [
    { value: "equity", label: "Stocks / Equity MF" },
    { value: "debt-mf", label: "Debt Mutual Funds" },
    { value: "property", label: "Real Estate" },
    { value: "gold", label: "Gold / Gold ETF" },
];

function CapitalGainsForm() {
    const [purchasePrice, setPurchasePrice] = useState(500000);
    const [salePrice, setSalePrice] = useState(800000);
    const [holdingMonths, setHoldingMonths] = useState(18);
    const [assetType, setAssetType] = useState<AssetType>("equity");

    const result: CapitalGainsResult = useMemo(
        () => calculateCapitalGains({ purchasePrice, salePrice, holdingMonths, assetType }),
        [purchasePrice, salePrice, holdingMonths, assetType]
    );

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Asset Type</label>
                    <select className="calc-field__select" value={assetType} onChange={e => setAssetType(e.target.value as AssetType)}>
                        {ASSET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Purchase Price</label>
                    <input type="text" className="calc-field__input" value={purchasePrice.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setPurchasePrice(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Sale Price</label>
                    <input type="text" className="calc-field__input" value={salePrice.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setSalePrice(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📅</span>Holding Period (Months)</label>
                    <input type="range" className="calc-field__slider" min={1} max={120} step={1} value={holdingMonths} onChange={e => setHoldingMonths(+e.target.value)} />
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input type="text" className="calc-field__input" value={holdingMonths} style={{ flex: 1 }} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setHoldingMonths(v); }} />
                        <span className="t-body-sm text-muted">{result.holdingPeriod}</span>
                    </div>
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">{result.gainType}</p>
                <p className="calc-result__emi" style={{ color: result.capitalGain >= 0 ? "var(--n-success)" : "var(--n-error)" }}>
                    {result.capitalGain >= 0 ? "+" : ""}{formatINR(result.capitalGain)}
                </p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Tax Rate</p><p className="calc-result__stat-value">{result.taxRate}%</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Tax Amount</p><p className="calc-result__stat-value" style={{ color: "var(--n-warning)" }}>{formatINR(result.totalTax)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Net Gain</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{formatINR(Math.max(result.capitalGain - result.totalTax, 0))}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Breakdown</p>
                    <p className="calc-result__breakdown-line">Capital Gain: {formatINR(result.capitalGain)}</p>
                    {result.exemption > 0 && <p className="calc-result__breakdown-line">Exemption: −{formatINR(result.exemption)}</p>}
                    <p className="calc-result__breakdown-line">Taxable: {formatINR(result.taxableGain)}</p>
                    <p className="calc-result__breakdown-line">Tax ({result.taxRate}%): {formatINR(result.taxAmount)}</p>
                    <p className="calc-result__breakdown-line">Cess (4%): {formatINR(result.cess)}</p>
                </div>
            </div>
        </div>
    );
}

/* ── Professional Tax ── */
function ProfessionalTaxForm() {
    const [state, setState] = useState("maharashtra");
    const [salary, setSalary] = useState(50000);

    const result: ProfessionalTaxResult = useMemo(() => calculateProfessionalTax({ state, monthlySalary: salary }), [state, salary]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📍</span>State</label>
                    <select className="calc-field__select" value={state} onChange={e => setState(e.target.value)}>
                        {PT_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Monthly Salary</label>
                    <input type="range" className="calc-field__slider" min={0} max={500000} step={1000} value={salary} onChange={e => setSalary(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={salary.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setSalary(v); }} />
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Monthly Professional Tax — {result.state}</p>
                <p className="calc-result__emi">{formatINR(result.monthlyPT)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Annual PT</p><p className="calc-result__stat-value">{formatINR(result.annualPT)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Slab</p><p className="calc-result__stat-value" style={{ fontSize: "0.85rem" }}>{result.slab}</p></div>
                </div>
                {result.monthlyPT === 0 && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-success)", fontWeight: 600 }}>
                        ✅ Below PT threshold in {result.state} — no tax.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── Dispatcher ── */
export default function TaxCalculatorCore({ calcType }: TaxCalculatorCoreProps) {
    switch (calcType) {
        case "income-tax": return <IncomeTaxForm />;
        case "gst": return <GSTForm />;
        case "hra": return <HRAForm />;
        case "tds": return <TDSForm />;
        case "capital-gains": return <CapitalGainsForm />;
        case "professional-tax": return <ProfessionalTaxForm />;
        default: return <p>Calculator not found.</p>;
    }
}

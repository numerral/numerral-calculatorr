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
    calculateUSIncomeTax,
    PT_STATES,
    type IncomeTaxResult,
    type GSTResult,
    type HRAResult,
    type TDSResult,
    type CapitalGainsResult,
    type ProfessionalTaxResult,
    type TDSIncomeType,
    type AssetType,
    type USFilingStatus,
    type USIncomeTaxResult,
} from "@/lib/calculators/taxes";

interface TaxCalculatorCoreProps {
    calcType: string;
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

function formatUSD(num: number): string {
    if (num >= 1000000) return "$" + (num / 1000000).toFixed(2) + "M";
    return "$" + Math.round(num).toLocaleString("en-US");
}

/* ── US Income Tax ── */
function USIncomeTaxForm() {
    const [filing, setFiling] = useState<USFilingStatus>("single");
    const [wages, setWages] = useState(75000);
    const [withheld, setWithheld] = useState(8000);
    const [interest, setInterest] = useState(0);
    const [stGains, setStGains] = useState(0);
    const [ltGains, setLtGains] = useState(0);
    const [otherIncome, setOtherIncome] = useState(0);
    const [dependents, setDependents] = useState(0);
    const [dedType, setDedType] = useState<"standard" | "itemized">("standard");
    const [mortgage, setMortgage] = useState(0);
    const [charity, setCharity] = useState(0);
    const [salt, setSalt] = useState(0);
    const [medical, setMedical] = useState(0);

    const result: USIncomeTaxResult = useMemo(
        () => calculateUSIncomeTax({
            filingStatus: filing, wages, federalWithheld: withheld,
            interestIncome: interest, shortTermGains: stGains, longTermGains: ltGains,
            otherIncome, numDependents: dependents, deductionType: dedType,
            mortgageInterest: mortgage, charitableDonations: charity,
            saltDeduction: salt, medicalExpenses: medical,
        }),
        [filing, wages, withheld, interest, stGains, ltGains, otherIncome, dependents, dedType, mortgage, charity, salt, medical]
    );

    const isRefund = result.refundOrOwed >= 0;

    return (
        <div>
            <div className="calc-input-panel">
                {/* Filing Status */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Filing Status</label>
                    <div className="tax-toggle" style={{ flexWrap: "wrap" }}>
                        {([
                            ["single", "Single"],
                            ["mfj", "Married Filing Jointly"],
                            ["hoh", "Head of Household"],
                            ["mfs", "Married Filing Separately"],
                        ] as [USFilingStatus, string][]).map(([val, lbl]) => (
                            <button key={val} className={`tax-toggle__btn${filing === val ? " active" : ""}`}
                                onClick={() => setFiling(val)} style={{ fontSize: "0.82rem" }}>{lbl}</button>
                        ))}
                    </div>
                </div>

                {/* Annual Wages */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">💵</span>Annual Wages (W-2)</label>
                    <input type="range" className="calc-field__slider" min={0} max={1000000} step={1000} value={wages} onChange={e => setWages(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={wages.toLocaleString("en-US")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setWages(v); }} />
                </div>

                {/* Federal Tax Withheld */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">🏛️</span>Federal Tax Withheld</label>
                    <input type="text" className="calc-field__input" value={withheld.toLocaleString("en-US")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setWithheld(v); }} />
                </div>

                {/* Other Income section */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📈</span>Interest Income</label>
                    <input type="text" className="calc-field__input" value={interest.toLocaleString("en-US")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setInterest(v); }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div className="calc-field">
                        <label className="calc-field__label" style={{ fontSize: "0.82rem" }}><span className="calc-field__label-icon">📊</span>Short-Term Gains</label>
                        <input type="text" className="calc-field__input" value={stGains.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setStGains(v); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label" style={{ fontSize: "0.82rem" }}><span className="calc-field__label-icon">📊</span>Long-Term Gains</label>
                        <input type="text" className="calc-field__input" value={ltGains.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setLtGains(v); }} />
                    </div>
                </div>

                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">💰</span>Other Income</label>
                    <input type="text" className="calc-field__input" value={otherIncome.toLocaleString("en-US")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setOtherIncome(v); }} />
                </div>

                {/* Dependents */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">👶</span>Dependents Under 17</label>
                    <input type="text" className="calc-field__input" value={dependents} inputMode="numeric" style={{ maxWidth: "100px" }}
                        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setDependents(Math.max(0, v)); }} />
                </div>

                {/* Deduction Type */}
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📝</span>Deduction Type</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${dedType === "standard" ? " active" : ""}`} onClick={() => setDedType("standard")}>
                            Standard ({formatUSD(result.standardDeduction)})
                        </button>
                        <button className={`tax-toggle__btn${dedType === "itemized" ? " active" : ""}`} onClick={() => setDedType("itemized")}>
                            Itemized
                        </button>
                    </div>
                </div>

                {/* Itemized Deduction Fields */}
                {dedType === "itemized" && (<>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Mortgage Interest</label>
                        <input type="text" className="calc-field__input" value={mortgage.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setMortgage(v); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">❤️</span>Charitable Donations</label>
                        <input type="text" className="calc-field__input" value={charity.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setCharity(v); }} />
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏛️</span>State & Local Tax (SALT)</label>
                        <input type="text" className="calc-field__input" value={salt.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setSalt(v); }} />
                        <span className="t-body-sm text-muted" style={{ marginTop: "4px", fontSize: "0.75rem" }}>Capped at $40,000</span>
                    </div>
                    <div className="calc-field">
                        <label className="calc-field__label"><span className="calc-field__label-icon">🏥</span>Medical Expenses</label>
                        <input type="text" className="calc-field__input" value={medical.toLocaleString("en-US")} inputMode="numeric"
                            onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setMedical(v); }} />
                        <span className="t-body-sm text-muted" style={{ marginTop: "4px", fontSize: "0.75rem" }}>Only amounts exceeding 7.5% of AGI</span>
                    </div>
                </>)}
            </div>

            {/* Results */}
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">{isRefund ? "Estimated Refund" : "Estimated Amount Owed"}</p>
                <p className="calc-result__emi" style={{ color: isRefund ? "var(--n-success)" : "var(--n-error)" }}>
                    {isRefund ? "+" : "−"}{formatUSD(Math.abs(result.refundOrOwed))}
                </p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Federal Tax</p><p className="calc-result__stat-value">{formatUSD(result.taxAfterCredits)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Effective Rate</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{result.effectiveRate}%</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Marginal Rate</p><p className="calc-result__stat-value">{result.marginalRate}%</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Tax Breakdown</p>
                    <p className="calc-result__breakdown-line">Gross Income: {formatUSD(result.grossIncome)}</p>
                    <p className="calc-result__breakdown-line">{result.deductionType}: −{formatUSD(result.deductionAmount)}</p>
                    <p className="calc-result__breakdown-line">Taxable Income: {formatUSD(result.taxableIncome)}</p>
                    <p className="calc-result__breakdown-line">Income Tax: {formatUSD(result.ordinaryTax)}</p>
                    {result.ltcgTax > 0 && <p className="calc-result__breakdown-line">LTCG Tax: {formatUSD(result.ltcgTax)}</p>}
                    {result.childTaxCredit > 0 && <p className="calc-result__breakdown-line">Child Tax Credit: −{formatUSD(result.childTaxCredit)}</p>}
                    <p className="calc-result__breakdown-line" style={{ fontWeight: 600 }}>Federal Tax: {formatUSD(result.taxAfterCredits)}</p>
                </div>
                <div className="calc-result__breakdown" style={{ marginTop: "var(--s-3)" }}>
                    <p className="calc-result__breakdown-title">FICA (Payroll Tax)</p>
                    <p className="calc-result__breakdown-line">Social Security (6.2%): {formatUSD(result.socialSecurity)}</p>
                    <p className="calc-result__breakdown-line">Medicare (1.45%): {formatUSD(result.medicare)}</p>
                    <p className="calc-result__breakdown-line" style={{ fontWeight: 600 }}>Total FICA: {formatUSD(result.totalFICA)}</p>
                </div>
                <p className="t-body-sm" style={{ marginTop: "var(--s-3)", fontWeight: 600 }}>
                    Total Tax Burden: {formatUSD(result.totalTax)} ({result.grossIncome > 0 ? Math.round((result.totalTax / result.grossIncome) * 10000) / 100 : 0}% of income)
                </p>
            </div>

            {/* Federal Tax Bracket Table */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>2025 Tax Bracket Breakdown — {result.filingStatus}</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead><tr><th>Bracket</th><th>Rate</th><th>Taxable</th><th>Tax</th></tr></thead>
                        <tbody>{result.brackets.map((b, i) => (
                            <tr key={i}>
                                <td>{b.bracket}</td>
                                <td>{b.rate}%</td>
                                <td>{formatUSD(b.taxableInBracket)}</td>
                                <td>{formatUSD(b.tax)}</td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </div>

            {/* Standard vs Itemized comparison */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Standard vs Itemized Deduction</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead><tr><th>Deduction</th><th>Amount</th></tr></thead>
                        <tbody>
                            <tr style={dedType === "standard" ? { fontWeight: 600 } : undefined}>
                                <td>Standard Deduction</td>
                                <td>{formatUSD(result.standardDeduction)}{dedType === "standard" && " ✓"}</td>
                            </tr>
                            <tr style={dedType === "itemized" ? { fontWeight: 600 } : undefined}>
                                <td>Itemized Total</td>
                                <td>{formatUSD(result.itemizedTotal)}{dedType === "itemized" && " ✓"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {result.standardDeduction > result.itemizedTotal && dedType === "itemized" && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-warning)", fontWeight: 600 }}>
                        💡 Standard deduction ({formatUSD(result.standardDeduction)}) is higher — consider switching for {formatUSD(result.standardDeduction - result.itemizedTotal)} more in deductions.
                    </p>
                )}
                {result.itemizedTotal > result.standardDeduction && dedType === "standard" && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-success)", fontWeight: 600 }}>
                        💡 Your itemized deductions ({formatUSD(result.itemizedTotal)}) exceed the standard — consider itemizing to save {formatUSD(result.itemizedTotal - result.standardDeduction)}.
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
        case "income-tax": return <USIncomeTaxForm />;
        case "gst": return <GSTForm />;
        case "hra": return <HRAForm />;
        case "tds": return <TDSForm />;
        case "capital-gains": return <CapitalGainsForm />;
        case "professional-tax": return <ProfessionalTaxForm />;
        default: return <p>Calculator not found.</p>;
    }
}

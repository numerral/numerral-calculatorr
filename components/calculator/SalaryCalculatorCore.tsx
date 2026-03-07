// SalaryCalculatorCore — Client component for all salary calculators
// Dynamic form-based UI per calcType
"use client";

import { useState, useMemo } from "react";
import {
    calculateSalaryBreakdown,
    calculateGratuity,
    calculateBonus,
    type SalaryBreakdown,
    type GratuityResult,
    type BonusResult,
} from "@/lib/calculators/salaryCalculations";

interface SalaryCalculatorCoreProps {
    calcType: string;
}

function formatINR(num: number): string {
    if (num >= 10000000) return "₹" + (num / 10000000).toFixed(2) + " Cr";
    if (num >= 100000) return "₹" + (num / 100000).toFixed(2) + " L";
    return "₹" + num.toLocaleString("en-IN");
}

/* ── Shared Component: Stacked Bar Chart for Salary Breakdown ── */
function SalaryStackedBar({ breakdown, isMonthly }: { breakdown: SalaryBreakdown, isMonthly: boolean }) {
    const total = isMonthly ? breakdown.ctcMonthly : breakdown.ctcAnnual;
    const net = isMonthly ? breakdown.netMonthly : breakdown.netAnnual;
    const tax = isMonthly ? breakdown.incomeTaxMonthly : breakdown.incomeTaxAnnual;
    const pf = isMonthly ? (breakdown.epfEmployeeMonthly + breakdown.epfEmployerMonthly + breakdown.gratuityMonthly) : (breakdown.epfEmployeeAnnual + breakdown.epfEmployerAnnual + breakdown.gratuityAnnual);
    const pt = isMonthly ? breakdown.professionalTaxMonthly : breakdown.professionalTaxAnnual;

    // Percentages for the bar
    const netPct = Math.max((net / total) * 100, 0);
    const taxPct = Math.max((tax / total) * 100, 0);
    const pfPct = Math.max((pf / total) * 100, 0);
    const ptPct = Math.max((pt / total) * 100, 0);

    return (
        <div style={{ marginTop: "var(--s-6)", marginBottom: "var(--s-6)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--s-2)", fontSize: "var(--t-body-sm)", fontWeight: 600 }}>
                <span style={{ color: "var(--n-success)" }}>In-Hand ({netPct.toFixed(1)}%)</span>
                <span style={{ color: "var(--n-text-secondary)" }}>Deductions & PF ({(100 - netPct).toFixed(1)}%)</span>
            </div>
            {/* The Stacked Bar */}
            <div style={{ height: "24px", width: "100%", display: "flex", borderRadius: "12px", overflow: "hidden", backgroundColor: "var(--n-surface-alt)" }}>
                <div style={{ width: `${netPct}%`, backgroundColor: "var(--n-success)", transition: "width 0.3s ease" }} title={`In-Hand: ${formatINR(net)}`} />
                <div style={{ width: `${taxPct}%`, backgroundColor: "var(--n-error)", transition: "width 0.3s ease", opacity: 0.85 }} title={`Income Tax: ${formatINR(tax)}`} />
                <div style={{ width: `${pfPct}%`, backgroundColor: "var(--n-primary)", transition: "width 0.3s ease", opacity: 0.7 }} title={`EPF & Gratuity: ${formatINR(pf)}`} />
                <div style={{ width: `${ptPct}%`, backgroundColor: "var(--n-warning)", transition: "width 0.3s ease" }} title={`Prof Tax: ${formatINR(pt)}`} />
            </div>
            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-4)", marginTop: "var(--s-3)", fontSize: "13px", color: "var(--n-text-secondary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--n-success)" }}></span> Take Home</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--n-error)", opacity: 0.85 }}></span> Income Tax</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "var(--n-primary)", opacity: 0.7 }}></span> EPF+Gratuity</span>
            </div>
        </div>
    );
}

/* ── Core Salary Forms (CTC, After Tax, In Hand) ── */
// These 3 share the exact same underlying logic, just presented slightly differently
function FullSalaryForm({ mode }: { mode: "ctc" | "in-hand" | "after-tax" }) {
    const [ctc, setCtc] = useState(1200000);
    const [basicPct, setBasicPct] = useState(50);
    const [hraPct, setHraPct] = useState(50);
    const [regime, setRegime] = useState<"old" | "new">("new");
    const [isMonthlyView, setIsMonthlyView] = useState(true);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [ded80C, setDed80C] = useState(150000); // Only for old regime
    const [rentPaid, setRentPaid] = useState(240000); // For HRA exemption in old regime
    const [isMetro, setIsMetro] = useState(true);

    const result: SalaryBreakdown = useMemo(
        () => calculateSalaryBreakdown({
            ctcAnnual: ctc,
            basicPercent: basicPct,
            hraPercent: hraPct,
            epfIncluded: true,
            regime,
            deductions80C: ded80C,
            deductions80D: 25000,
            rentPaidAnnual: rentPaid,
            isMetro
        }),
        [ctc, basicPct, hraPct, regime, ded80C, rentPaid, isMetro]
    );

    const otherRegime: SalaryBreakdown = useMemo(
        () => calculateSalaryBreakdown({
            ctcAnnual: ctc,
            basicPercent: basicPct,
            hraPercent: hraPct,
            epfIncluded: true,
            regime: regime === "new" ? "old" : "new",
            deductions80C: ded80C,
            deductions80D: 25000,
            rentPaidAnnual: rentPaid,
            isMetro
        }),
        [ctc, basicPct, hraPct, regime, ded80C, rentPaid, isMetro]
    );

    return (
        <div>
            {/* View Toggle (Monthly vs Annual) - Placed outside the panel for high visibility */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--s-3)" }}>
                <div className="tax-toggle" style={{ width: "auto" }}>
                    <button className={`tax-toggle__btn${isMonthlyView ? " active" : ""}`} onClick={() => setIsMonthlyView(true)}>Monthly View</button>
                    <button className={`tax-toggle__btn${!isMonthlyView ? " active" : ""}`} onClick={() => setIsMonthlyView(false)}>Annual View</button>
                </div>
            </div>

            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Total CTC (Annual)</label>
                    <input type="range" className="calc-field__slider" min={200000} max={50000000} step={50000} value={ctc} onChange={e => setCtc(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={ctc.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setCtc(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">📋</span>Tax Regime</label>
                    <div className="tax-toggle">
                        <button className={`tax-toggle__btn${regime === "new" ? " active" : ""}`} onClick={() => setRegime("new")}>New Regime</button>
                        <button className={`tax-toggle__btn${regime === "old" ? " active" : ""}`} onClick={() => setRegime("old")}>Old Regime</button>
                    </div>
                </div>

                <div className="calc-field" style={{ gridColumn: "1 / -1" }}>
                    <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ background: "none", border: "none", color: "var(--n-primary)", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
                        {showAdvanced ? "Hide Advanced Options ▴" : "Show Advanced Options (80C, Rent, CTC Structure) ▾"}
                    </button>
                </div>

                {showAdvanced && (
                    <>
                        <div className="calc-field">
                            <label className="calc-field__label"><span className="calc-field__label-icon">%</span>Basic Salary (% of CTC)</label>
                            <input type="range" className="calc-field__slider" min={10} max={60} step={1} value={basicPct} onChange={e => setBasicPct(+e.target.value)} />
                            <input type="text" className="calc-field__input" value={basicPct} onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setBasicPct(Math.min(v, 100)); }} />
                        </div>
                        <div className="calc-field">
                            <label className="calc-field__label"><span className="calc-field__label-icon">%</span>HRA (% of Basic)</label>
                            <div className="tax-toggle">
                                <button className={`tax-toggle__btn${hraPct === 50 ? " active" : ""}`} onClick={() => setHraPct(50)}>50% (Metro)</button>
                                <button className={`tax-toggle__btn${hraPct === 40 ? " active" : ""}`} onClick={() => setHraPct(40)}>40% (Non-Metro)</button>
                            </div>
                        </div>
                        {regime === "old" && (
                            <>
                                <div className="calc-field">
                                    <label className="calc-field__label"><span className="calc-field__label-icon">🏠</span>Rent Paid (Annual)</label>
                                    <input type="text" className="calc-field__input" value={rentPaid.toLocaleString("en-IN")} inputMode="numeric"
                                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setRentPaid(v); }} />
                                </div>
                                <div className="calc-field">
                                    <label className="calc-field__label"><span className="calc-field__label-icon">🏙️</span>City for Rent</label>
                                    <div className="tax-toggle">
                                        <button className={`tax-toggle__btn${isMetro ? " active" : ""}`} onClick={() => setIsMetro(true)}>Metro</button>
                                        <button className={`tax-toggle__btn${!isMetro ? " active" : ""}`} onClick={() => setIsMetro(false)}>Non-Metro</button>
                                    </div>
                                </div>
                                <div className="calc-field" style={{ gridColumn: "1 / -1" }}>
                                    <label className="calc-field__label"><span className="calc-field__label-icon">🏦</span>80C Deductions (ELSS, PPF, LIC)</label>
                                    <input type="text" className="calc-field__input" value={ded80C.toLocaleString("en-IN")} inputMode="numeric"
                                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setDed80C(Math.min(v, 150000)); }} />
                                    <p className="t-body-sm text-muted" style={{ marginTop: "4px" }}>Note: Your employee EPF contribution ({formatINR(result.epfEmployeeAnnual)}/yr) is auto-added to 80C.</p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">{isMonthlyView ? "In-Hand Salary (Monthly)" : "Net Take Home (Annual)"}</p>
                <p className="calc-result__emi">{formatINR(isMonthlyView ? result.netMonthly : result.netAnnual)}</p>

                <SalaryStackedBar breakdown={result} isMonthly={isMonthlyView} />

                <div className="calc-result__stats" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div className="calc-result__stat">
                        <p className="calc-result__stat-label">Gross Salary</p>
                        <p className="calc-result__stat-value">{formatINR(isMonthlyView ? result.grossMonthly : result.grossAnnual)}</p>
                    </div>
                    <div className="calc-result__stat">
                        <p className="calc-result__stat-label">Total Deductions</p>
                        <p className="calc-result__stat-value" style={{ color: "var(--n-error)" }}>{formatINR(isMonthlyView ? result.totalDeductionsMonthly : result.totalDeductionsAnnual)}</p>
                    </div>
                </div>

                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Salary Components ({isMonthlyView ? "Monthly" : "Annual"})</p>
                    <p className="calc-result__breakdown-line">Basic Salary: {formatINR(isMonthlyView ? result.basicMonthly : result.basicAnnual)}</p>
                    <p className="calc-result__breakdown-line">HRA: {formatINR(isMonthlyView ? result.hraMonthly : result.hraAnnual)}</p>
                    <p className="calc-result__breakdown-line">Special Allowance: {formatINR(isMonthlyView ? result.specialAllowanceMonthly : result.specialAllowanceAnnual)}</p>
                    <div style={{ margin: "var(--s-3) 0", borderTop: "1px dashed rgba(255,255,255,0.2)" }}></div>
                    <p className="calc-result__breakdown-title" style={{ marginTop: 0 }}>Deductions</p>
                    <p className="calc-result__breakdown-line" style={{ color: "var(--n-error)" }}>Income Tax: −{formatINR(isMonthlyView ? result.incomeTaxMonthly : result.incomeTaxAnnual)}</p>
                    <p className="calc-result__breakdown-line" style={{ color: "var(--n-error)" }}>EPF (Employee): −{formatINR(isMonthlyView ? result.epfEmployeeMonthly : result.epfEmployeeAnnual)}</p>
                    <p className="calc-result__breakdown-line" style={{ color: "var(--n-error)" }}>Professional Tax: −{formatINR(isMonthlyView ? result.professionalTaxMonthly : result.professionalTaxAnnual)}</p>
                    <div style={{ margin: "var(--s-3) 0", borderTop: "1px dashed rgba(255,255,255,0.2)" }}></div>
                    <p className="calc-result__breakdown-title" style={{ marginTop: 0, color: "var(--n-text-muted)" }}>Hidden Employer Costs (Part of CTC, not in hand)</p>
                    <p className="calc-result__breakdown-line">EPF (Employer): {formatINR(isMonthlyView ? result.epfEmployerMonthly : result.epfEmployerAnnual)}</p>
                    <p className="calc-result__breakdown-line">Gratuity Configured: {formatINR(isMonthlyView ? result.gratuityMonthly : result.gratuityAnnual)}</p>
                </div>
            </div>

            {/* Regime comparison */}
            <div style={{ marginTop: "var(--s-6)" }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)" }}>Tax Impact: Old vs New Regime</h3>
                <div style={{ overflowX: "auto" }}>
                    <table className="comparison-table">
                        <thead><tr><th>Metric (Annual)</th><th>{result.regime === "new" ? "New Regime" : "Old Regime"}</th><th>{otherRegime.regime === "new" ? "New Regime" : "Old Regime"}</th></tr></thead>
                        <tbody>
                            <tr><td>Taxable Income</td><td>{formatINR(result.taxResult.taxableIncome)}</td><td>{formatINR(otherRegime.taxResult.taxableIncome)}</td></tr>
                            <tr><td>Income Tax (Total)</td><td>{formatINR(result.incomeTaxAnnual)}</td><td>{formatINR(otherRegime.incomeTaxAnnual)}</td></tr>
                            <tr>
                                <td><strong>In-Hand Salary</strong></td>
                                <td style={result.netAnnual >= otherRegime.netAnnual ? { color: "var(--n-success)" } : undefined}><strong>{formatINR(result.netAnnual)}</strong>{result.netAnnual > otherRegime.netAnnual && " ✓"}</td>
                                <td style={otherRegime.netAnnual >= result.netAnnual ? { color: "var(--n-success)" } : undefined}><strong>{formatINR(otherRegime.netAnnual)}</strong>{otherRegime.netAnnual > result.netAnnual && " ✓"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {result.netAnnual !== otherRegime.netAnnual && (
                    <p className="t-body-sm" style={{ marginTop: "var(--s-3)", color: "var(--n-success)", fontWeight: 600 }}>
                        💡 You take home {formatINR(Math.abs(result.netAnnual - otherRegime.netAnnual))} more per year with the {result.netAnnual > otherRegime.netAnnual ? result.regime : otherRegime.regime} regime.
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── Gratuity ── */
function GratuityForm() {
    const [salary, setSalary] = useState(50000);
    const [years, setYears] = useState(5);

    const result: GratuityResult = useMemo(() => calculateGratuity(salary, years), [salary, years]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Last Drawn Salary (Basic + DA)</label>
                    <input type="range" className="calc-field__slider" min={10000} max={1000000} step={5000} value={salary} onChange={e => setSalary(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={salary.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setSalary(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">⏳</span>Years of Service</label>
                    <input type="range" className="calc-field__slider" min={1} max={40} step={1} value={years} onChange={e => setYears(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={years} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value); if (!isNaN(v)) setYears(v); }} />
                    {years < 5 && <p className="t-body-sm" style={{ color: "var(--n-error)", marginTop: "4px" }}>Requires 5+ years for eligibility.</p>}
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Gratuity Amount</p>
                <p className="calc-result__emi" style={{ color: result.isEligible ? "var(--n-text)" : "var(--n-error)" }}>
                    {result.isEligible ? formatINR(result.gratuityAmount) : "Not Eligible"}
                </p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Tax Exempt</p><p className="calc-result__stat-value" style={{ color: "var(--n-success)" }}>{formatINR(result.taxExempt)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Taxable</p><p className="calc-result__stat-value" style={result.taxable > 0 ? { color: "var(--n-error)" } : undefined}>{formatINR(result.taxable)}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Calculation Formula</p>
                    <p className="calc-result__breakdown-line" style={{ fontSize: "1rem", fontFamily: "var(--font-mono)" }}>{result.formula}</p>
                    <p className="t-body-sm text-muted" style={{ marginTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: "12px" }}>
                        Note: Gratuity up to ₹25 Lakh is tax-exempt. Amount above ₹25 Lakh is added to your taxable income.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── Bonus ── */
function BonusForm() {
    const [salary, setSalary] = useState(30000);
    const [bonusPct, setBonusPct] = useState(8.33);

    const result: BonusResult = useMemo(() => calculateBonus(salary, bonusPct), [salary, bonusPct]);

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">₹</span>Monthly Basic Salary</label>
                    <input type="range" className="calc-field__slider" min={5000} max={100000} step={1000} value={salary} onChange={e => setSalary(+e.target.value)} />
                    <input type="text" className="calc-field__input" value={salary.toLocaleString("en-IN")} inputMode="numeric"
                        onChange={e => { const v = parseInt(e.target.value.replace(/,/g, "")); if (!isNaN(v)) setSalary(v); }} />
                </div>
                <div className="calc-field">
                    <label className="calc-field__label"><span className="calc-field__label-icon">%</span>Bonus Percentage</label>
                    <input type="range" className="calc-field__slider" min={8.33} max={20} step={0.01} value={bonusPct} onChange={e => setBonusPct(+e.target.value)} />
                    <div style={{ display: "flex", gap: "12px" }}>
                        <button className="calc-field__input" style={{ flex: 1, backgroundColor: bonusPct === 8.33 ? "var(--n-surface-alt)" : undefined }} onClick={() => setBonusPct(8.33)}>Min (8.33%)</button>
                        <button className="calc-field__input" style={{ flex: 1, backgroundColor: bonusPct === 20 ? "var(--n-surface-alt)" : undefined }} onClick={() => setBonusPct(20)}>Max (20%)</button>
                        <input type="text" className="calc-field__input" value={bonusPct} style={{ flex: 1 }}
                            onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setBonusPct(v); }} />
                    </div>
                </div>
            </div>
            <div className="calc-result" aria-live="polite">
                <p className="calc-result__label">Annual Bonus Amount</p>
                <p className="calc-result__emi">{formatINR(result.effectiveBonus)}</p>
                <div className="calc-result__stats">
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Statutory Minimum</p><p className="calc-result__stat-value">{formatINR(result.statutoryMinimum)}</p></div>
                    <div className="calc-result__stat"><p className="calc-result__stat-label">Statutory Maximum</p><p className="calc-result__stat-value">{formatINR(result.statutoryMaximum)}</p></div>
                </div>
                <div className="calc-result__breakdown">
                    <p className="calc-result__breakdown-title">Calculation Details</p>
                    <p className="calc-result__breakdown-line">Effective Salary Cap: {formatINR(Math.min(salary, 21000))} / mo</p>
                    <p className="calc-result__breakdown-line">Bonus Rate: {result.bonusPercentage}%</p>
                    <p className="t-body-sm text-muted" style={{ marginTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.2)", paddingTop: "12px", lineHeight: 1.5 }}>
                        As per the Payment of Bonus Act, the basic salary for bonus calculation is capped at ₹21,000 per month. Even if your basic salary is higher, the bonus is calculated on ₹21,000.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ── Dispatcher ── */
export default function SalaryCalculatorCore({ calcType }: SalaryCalculatorCoreProps) {
    switch (calcType) {
        // The core 3 tools use the same rich UI
        case "salary-after-tax":
        case "in-hand-salary":
        case "ctc-to-take-home":
        // HRA is closely related to salary breakdown so we use the full form here too, 
        // with old regime forced or highlight HRA
        case "hra-salary":
            return <FullSalaryForm mode={calcType as any} />;
        case "gratuity":
            return <GratuityForm />;
        case "bonus":
            return <BonusForm />;
        default:
            return <p>Salary Calculator not found.</p>;
    }
}

"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmt = (n: number) => n.toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtInt = (n: number) => n.toLocaleString("en-SA", { maximumFractionDigits: 0 });
const p = (v: string) => { const n = parseFloat(v); return isNaN(n) || n < 0 ? 0 : n; };

/* ── Sub-components ── */
function InputField({ label, value, onChange, unit, placeholder, step, min, max }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string; step?: number; min?: number; max?: number;
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
            <input type="number" className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min ?? 0} max={max} step={step || 1} placeholder={placeholder || "0"} />
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
    return (
        <div className="con-input">
            <label className="con-input__label">{label}</label>
            <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
        </div>
    );
}

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (
        <div className="con-result-row" style={highlight ? { background: "rgba(0,80,140,0.06)", borderRadius: 6, padding: "12px 0", margin: "4px 0" } : warn ? { background: "rgba(200,60,0,0.06)", borderRadius: 6, padding: "12px 0", margin: "4px 0" } : {}}>
            <span className="con-result-row__label" style={highlight ? { fontWeight: 700, color: "var(--n-text)" } : warn ? { fontWeight: 700, color: "#c83c00" } : {}}>{label}</span>
            <span className="con-result-row__value" style={highlight ? { fontSize: "1.1rem", color: "#00508c" } : warn ? { color: "#c83c00" } : {}}>{value}</span>
        </div>
    );
}

/* ── PMT function (standard annuity formula) ── */
function calcPMT(principal: number, annualRate: number, months: number): number {
    if (months <= 0 || principal <= 0) return 0;
    if (annualRate <= 0) return principal / months;
    const r = annualRate / 100 / 12;
    return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/* ── Amortization row type ── */
interface AmortRow { month: number; payment: number; principal: number; profit: number; balance: number; }

function buildAmortization(principal: number, annualRate: number, months: number, emi: number): AmortRow[] {
    const rows: AmortRow[] = [];
    let balance = principal;
    const r = annualRate / 100 / 12;
    for (let m = 1; m <= months; m++) {
        const profit = annualRate > 0 ? balance * r : 0;
        const prinPart = emi - profit;
        balance = Math.max(balance - prinPart, 0);
        rows.push({ month: m, payment: emi, principal: prinPart, profit, balance });
    }
    return rows;
}

/* ── Main Component ── */
export default function PersonalLoanCalculatorCore() {
    const [amount, setAmount] = useState("100000");
    const [rate, setRate] = useState("5");
    const [tenure, setTenure] = useState("60");
    const [salary, setSalary] = useState("");
    const [existingEMI, setExistingEMI] = useState("0");
    const [feeRate, setFeeRate] = useState("1");
    const [includeVAT, setIncludeVAT] = useState(true);
    const [borrowerType, setBorrowerType] = useState<"employee" | "retiree">("employee");
    const [showAmort, setShowAmort] = useState(false);

    const result = useMemo(() => {
        const principal = p(amount);
        const apr = p(rate);
        const months = Math.min(Math.max(Math.round(p(tenure)), 1), 60);
        const monthlySalary = p(salary);
        const existingObl = p(existingEMI);
        const feePercent = Math.min(p(feeRate), 1); // SAMA caps at 1%

        // EMI
        const emi = calcPMT(principal, apr, months);
        const totalRepayment = emi * months;
        const totalProfit = totalRepayment - principal;

        // Processing fee
        const rawFee = principal * (feePercent / 100);
        const processingFee = Math.min(rawFee, 5000); // SAMA cap: SAR 5,000
        const vatOnFee = includeVAT ? processingFee * 0.15 : 0;
        const totalFee = processingFee + vatOnFee;

        // Effective cost
        const effectiveCost = totalProfit + totalFee;

        // SAMA DBR check
        const dbrLimit = borrowerType === "employee" ? 0.3333 : 0.25;
        const dbrLimitPct = borrowerType === "employee" ? "33.33%" : "25%";
        const totalMonthlyObl = emi + existingObl;
        const maxAllowedEMI = monthlySalary > 0 ? monthlySalary * dbrLimit : 0;
        const remainingForEMI = Math.max(maxAllowedEMI - existingObl, 0);
        const withinDBR = monthlySalary <= 0 || totalMonthlyObl <= maxAllowedEMI;

        // Max affordable loan at this rate
        const maxAffordableLoan = remainingForEMI > 0 && apr > 0
            ? (() => {
                const r = apr / 100 / 12;
                return remainingForEMI * (Math.pow(1 + r, months) - 1) / (r * Math.pow(1 + r, months));
            })()
            : remainingForEMI * months;

        // Amortization
        const amortization = buildAmortization(principal, apr, months, emi);

        return {
            emi, totalRepayment, totalProfit, months,
            processingFee, vatOnFee, totalFee, effectiveCost,
            dbrLimit, dbrLimitPct, totalMonthlyObl, maxAllowedEMI, remainingForEMI, withinDBR,
            maxAffordableLoan,
            amortization,
        };
    }, [amount, rate, tenure, salary, existingEMI, feeRate, includeVAT, borrowerType]);

    return (
        <div className="con-calc" style={{ maxWidth: 720 }}>
            <div className="con-calc__header">
                <h2 className="con-calc__title">حاسبة التمويل الشخصي — Personal Loan EMI Calculator</h2>
                <p className="con-calc__desc">Calculate your monthly installment, total cost, and SAMA DBR compliance for personal finance in Saudi Arabia.</p>
            </div>

            <div className="con-calc__body" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
                {/* Loan Details */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>📋 Finance Details</p>
                    <InputField label="Finance Amount" value={amount} onChange={setAmount} unit="SAR" placeholder="100000" step={1000} />
                    <InputField label="Annual Profit Rate (APR)" value={rate} onChange={setRate} unit="%" placeholder="5" step={0.01} />
                    <SelectField label="Tenure" value={tenure} onChange={setTenure} options={[
                        { value: "12", label: "12 months (1 year)" },
                        { value: "24", label: "24 months (2 years)" },
                        { value: "36", label: "36 months (3 years)" },
                        { value: "48", label: "48 months (4 years)" },
                        { value: "60", label: "60 months (5 years — SAMA max)" },
                    ]} />
                </div>

                {/* SAMA DBR Check */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>🏛️ SAMA DBR Compliance Check</p>
                    <InputField label="Monthly Gross Salary" value={salary} onChange={setSalary} unit="SAR" placeholder="Optional" />
                    <InputField label="Existing Monthly Installments" value={existingEMI} onChange={setExistingEMI} unit="SAR" placeholder="0" />
                    <SelectField label="Borrower Type" value={borrowerType} onChange={(v) => setBorrowerType(v as "employee" | "retiree")} options={[
                        { value: "employee", label: "Employee (33.33% DBR limit)" },
                        { value: "retiree", label: "Retiree (25% DBR limit)" },
                    ]} />
                </div>

                {/* Fees */}
                <div style={{ padding: "var(--s-3) var(--s-4)", background: "var(--n-surface)", border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "var(--s-3)", color: "var(--n-text)" }}>💳 Processing Fees</p>
                    <InputField label="Processing Fee Rate" value={feeRate} onChange={setFeeRate} unit="%" placeholder="1" step={0.1} max={1} />
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--n-text-secondary)", cursor: "pointer", marginTop: "var(--s-2)" }}>
                        <input type="checkbox" checked={includeVAT} onChange={(e) => setIncludeVAT(e.target.checked)} />
                        Add 15% VAT on processing fee
                    </label>
                    <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                        SAMA caps processing fees at 1% of finance amount or SAR 5,000 — whichever is lower.
                    </p>
                </div>
            </div>

            {/* ── Results ── */}
            <div className="con-calc__results" style={{ marginTop: "var(--s-5)" }}>
                <h4>EMI Breakdown</h4>

                {/* Main EMI */}
                <div style={{
                    textAlign: "center", padding: "var(--s-5)",
                    background: "linear-gradient(135deg, rgba(0,80,140,0.06) 0%, rgba(0,80,140,0.02) 100%)",
                    borderRadius: "var(--r-md)", border: "1px solid rgba(0,80,140,0.12)", marginBottom: "var(--s-4)",
                }}>
                    <p style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginBottom: "var(--s-2)" }}>Monthly Installment (EMI)</p>
                    <p style={{ fontSize: "2rem", fontWeight: 800, color: "#00508c", letterSpacing: "-1px" }}>SAR {fmt(result.emi)}</p>
                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                        for {result.months} months at {rate}% APR
                    </p>
                </div>

                <ResultRow label="Finance Amount" value={`SAR ${fmt(p(amount))}`} />
                <ResultRow label="Total Repayment" value={`SAR ${fmt(result.totalRepayment)}`} />
                <ResultRow label="Total Profit Cost" value={`SAR ${fmt(result.totalProfit)}`} />
                <div style={{ height: 1, background: "var(--n-border)", margin: "var(--s-3) 0" }} />

                <ResultRow label="Processing Fee" value={`SAR ${fmt(result.processingFee)}`} />
                {includeVAT && <ResultRow label="VAT on Fee (15%)" value={`SAR ${fmt(result.vatOnFee)}`} />}
                <ResultRow label="Total Fees" value={`SAR ${fmt(result.totalFee)}`} />
                <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-3) 0" }} />
                <ResultRow label="Effective Total Cost (Profit + Fees)" value={`SAR ${fmt(result.effectiveCost)}`} highlight />

                {/* SAMA DBR Check */}
                {p(salary) > 0 && (
                    <>
                        <div style={{ height: 2, background: "var(--n-border)", margin: "var(--s-4) 0 var(--s-3)" }} />
                        <h4>SAMA DBR Compliance</h4>
                        <ResultRow label="Monthly Salary" value={`SAR ${fmt(p(salary))}`} />
                        <ResultRow label={`Max Deduction (${result.dbrLimitPct})`} value={`SAR ${fmt(result.maxAllowedEMI)}`} />
                        <ResultRow label="Existing Obligations" value={`SAR ${fmt(p(existingEMI))}`} />
                        <ResultRow label="New EMI" value={`SAR ${fmt(result.emi)}`} />
                        <ResultRow label="Total Monthly Obligations" value={`SAR ${fmt(result.totalMonthlyObl)}`} />
                        <ResultRow
                            label="SAMA DBR Status"
                            value={result.withinDBR ? `✅ Within ${result.dbrLimitPct} limit` : `❌ Exceeds ${result.dbrLimitPct} limit by SAR ${fmt(result.totalMonthlyObl - result.maxAllowedEMI)}`}
                            highlight={result.withinDBR}
                            warn={!result.withinDBR}
                        />
                        {result.remainingForEMI > 0 && (
                            <ResultRow label="Max Affordable Loan (at this rate)" value={`SAR ${fmtInt(result.maxAffordableLoan)}`} />
                        )}
                    </>
                )}

                {/* Amortization Toggle */}
                <div style={{ marginTop: "var(--s-5)" }}>
                    <button
                        onClick={() => setShowAmort(!showAmort)}
                        type="button"
                        style={{
                            width: "100%", padding: "var(--s-3)", background: "var(--n-surface)",
                            border: "1px solid var(--n-border)", borderRadius: "var(--r-sm)",
                            cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, color: "var(--n-text)",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}
                    >
                        📊 {showAmort ? "Hide" : "Show"} Amortization Schedule
                    </button>

                    {showAmort && (
                        <div style={{ overflowX: "auto", marginTop: "var(--s-3)" }}>
                            <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "var(--n-surface)", borderBottom: "2px solid var(--n-border)" }}>
                                        <th style={{ padding: "8px 6px", textAlign: "left" }}>Month</th>
                                        <th style={{ padding: "8px 6px", textAlign: "right" }}>Payment</th>
                                        <th style={{ padding: "8px 6px", textAlign: "right" }}>Principal</th>
                                        <th style={{ padding: "8px 6px", textAlign: "right" }}>Profit</th>
                                        <th style={{ padding: "8px 6px", textAlign: "right" }}>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.amortization.map((r) => (
                                        <tr key={r.month} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                            <td style={{ padding: "6px" }}>{r.month}</td>
                                            <td style={{ padding: "6px", textAlign: "right" }}>{fmt(r.payment)}</td>
                                            <td style={{ padding: "6px", textAlign: "right" }}>{fmt(r.principal)}</td>
                                            <td style={{ padding: "6px", textAlign: "right" }}>{fmt(r.profit)}</td>
                                            <td style={{ padding: "6px", textAlign: "right" }}>{fmt(r.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

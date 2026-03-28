"use client";

import { useState, useCallback, useMemo } from "react";

/* ── Indian number formatting (₹1,23,456) ── */
function formatINR(n: number): string {
    if (isNaN(n) || !isFinite(n)) return "₹0";
    const isNeg = n < 0;
    const abs = Math.abs(Math.round(n * 100) / 100);
    const [intPart, decPart] = abs.toFixed(2).split(".");
    let formatted = "";
    if (intPart.length <= 3) {
        formatted = intPart;
    } else {
        const last3 = intPart.slice(-3);
        const rest = intPart.slice(0, -3);
        const pairs: string[] = [];
        for (let i = rest.length; i > 0; i -= 2) {
            pairs.unshift(rest.slice(Math.max(0, i - 2), i));
        }
        formatted = pairs.join(",") + "," + last3;
    }
    return (isNeg ? "-" : "") + "₹" + formatted + (decPart !== "00" ? "." + decPart : "");
}

function formatINRFull(n: number): string {
    if (isNaN(n) || !isFinite(n)) return "₹0";
    const abs = Math.abs(n);
    if (abs >= 1_00_00_000) return formatINR(n / 1_00_00_000).replace("₹", "₹") + " Cr";
    if (abs >= 1_00_000) return formatINR(n / 1_00_000).replace("₹", "₹") + " Lakh";
    return formatINR(n);
}

function lakhLabel(n: number): string {
    if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(2).replace(/\.?0+$/, "") + " Crore";
    if (n >= 1_00_000) return (n / 1_00_000).toFixed(2).replace(/\.?0+$/, "") + " Lakh";
    return n.toLocaleString("en-IN");
}

type CalcMode = "emi" | "eligibility" | "prepay" | "afford";

/* ── EMI formula ── */
function calcEMI(P: number, annualRate: number, tenureYears: number): number {
    if (P <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
    const R = annualRate / 12 / 100;
    const N = tenureYears * 12;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

/* ── Amortization schedule ── */
interface AmortRow { year: number; principal: number; interest: number; balance: number; }
function calcAmortization(P: number, annualRate: number, tenureYears: number): AmortRow[] {
    const R = annualRate / 12 / 100;
    const N = tenureYears * 12;
    const emi = calcEMI(P, annualRate, tenureYears);
    if (emi <= 0) return [];
    let balance = P;
    const rows: AmortRow[] = [];
    for (let yr = 1; yr <= tenureYears; yr++) {
        let yearPrincipal = 0, yearInterest = 0;
        const months = Math.min(12, N - (yr - 1) * 12);
        for (let m = 0; m < months; m++) {
            const intPart = balance * R;
            const prinPart = emi - intPart;
            yearInterest += intPart;
            yearPrincipal += prinPart;
            balance -= prinPart;
        }
        if (balance < 0) balance = 0;
        rows.push({ year: yr, principal: yearPrincipal, interest: yearInterest, balance });
    }
    return rows;
}

export default function HomeLoanCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("emi");

    /* Mode 1: EMI Calculator */
    const [loanAmt, setLoanAmt] = useState(50_00_000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [showAmort, setShowAmort] = useState(false);

    /* Mode 2: Eligibility */
    const [monthlyIncome, setMonthlyIncome] = useState(1_00_000);
    const [existingEMI, setExistingEMI] = useState(0);
    const [eligRate, setEligRate] = useState(8.5);
    const [eligTenure, setEligTenure] = useState(20);

    /* Mode 3: Prepayment */
    const [prepayAmt, setPrepayAmt] = useState(50_00_000);
    const [prepayRate, setPrepayRate] = useState(8.5);
    const [prepayTenure, setPrepayTenure] = useState(20);
    const [lumpSum, setLumpSum] = useState(5_00_000);
    const [prepayYear, setPrepayYear] = useState(3);

    /* Mode 4: Affordability */
    const [monthlyBudget, setMonthlyBudget] = useState(40_000);
    const [affordRate, setAffordRate] = useState(8.5);
    const [affordTenure, setAffordTenure] = useState(20);

    /* ── EMI Results ── */
    const emiResult = useMemo(() => {
        const emi = calcEMI(loanAmt, rate, tenure);
        const totalAmt = emi * tenure * 12;
        const totalInt = totalAmt - loanAmt;
        const principalPct = (loanAmt / totalAmt) * 100;
        const interestPct = (totalInt / totalAmt) * 100;
        return { emi, totalAmt, totalInt, principalPct, interestPct };
    }, [loanAmt, rate, tenure]);

    const amortRows = useMemo(() => {
        if (!showAmort) return [];
        return calcAmortization(loanAmt, rate, tenure);
    }, [loanAmt, rate, tenure, showAmort]);

    /* ── Eligibility Results ── */
    const eligResult = useMemo(() => {
        const maxEMI = (monthlyIncome * 0.5) - existingEMI; // 50% FOIR
        if (maxEMI <= 0) return null;
        const R = eligRate / 12 / 100;
        const N = eligTenure * 12;
        const maxLoan = maxEMI * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
        const prop80 = maxLoan / 0.80; // 80% LTV
        const prop75 = maxLoan / 0.75;
        return { maxEMI, maxLoan, prop80, prop75 };
    }, [monthlyIncome, existingEMI, eligRate, eligTenure]);

    /* ── Prepayment Results ── */
    const prepayResult = useMemo(() => {
        const origEMI = calcEMI(prepayAmt, prepayRate, prepayTenure);
        const origTotal = origEMI * prepayTenure * 12;
        const origInt = origTotal - prepayAmt;

        // After prepayment at year X
        const R = prepayRate / 12 / 100;
        let balance = prepayAmt;
        const monthsBeforePrepay = prepayYear * 12;
        let intPaidBefore = 0;
        for (let m = 0; m < monthsBeforePrepay; m++) {
            const intPart = balance * R;
            intPaidBefore += intPart;
            balance -= (origEMI - intPart);
        }
        balance -= lumpSum;
        if (balance < 0) balance = 0;

        // New tenure with same EMI
        let newMonths = 0;
        let intPaidAfter = 0;
        let bal = balance;
        while (bal > 0 && newMonths < 360) {
            const intPart = bal * R;
            intPaidAfter += intPart;
            bal -= (origEMI - intPart);
            newMonths++;
        }
        const newTotalMonths = monthsBeforePrepay + newMonths;
        const newTotalInt = intPaidBefore + intPaidAfter;
        const interestSaved = origInt - newTotalInt - lumpSum;
        const tenureSaved = (prepayTenure * 12) - newTotalMonths;

        return { origEMI, origInt, origTotal, newTotalMonths, newTotalInt, interestSaved: Math.max(0, interestSaved), tenureSaved: Math.max(0, tenureSaved), balanceAtPrepay: balance + lumpSum };
    }, [prepayAmt, prepayRate, prepayTenure, lumpSum, prepayYear]);

    /* ── Affordability Results ── */
    const affordResult = useMemo(() => {
        const R = affordRate / 12 / 100;
        const N = affordTenure * 12;
        const maxLoan = monthlyBudget * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
        return {
            maxLoan, prop80: maxLoan / 0.80, prop85: maxLoan / 0.85, prop90: maxLoan / 0.90,
            totalPay: monthlyBudget * N, totalInt: (monthlyBudget * N) - maxLoan,
        };
    }, [monthlyBudget, affordRate, affordTenure]);

    const tabStyle = (m: CalcMode) => mode === m
        ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" }
        : {};

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🏠 Home Loan EMI Calculator</h3>

            {/* Mode Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([
                    ["emi", "EMI Calculator"],
                    ["eligibility", "Loan Eligibility"],
                    ["prepay", "Prepayment Impact"],
                    ["afford", "Affordability"],
                ] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ═══════ MODE: EMI ═══════ */}
            {mode === "emi" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Loan Amount <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={loanAmt} onChange={(e) => setLoanAmt(+e.target.value)} min={100000} step={100000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(loanAmt)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={rate} onChange={(e) => setRate(+e.target.value)} min={1} max={20} step={0.1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={tenure} onChange={(e) => setTenure(+e.target.value)} min={1} max={30} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {[5, 10, 15, 20, 25, 30].map((y) => (
                            <button key={y} className="calc-tab-btn" onClick={() => setTenure(y)} style={tenure === y ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>
                                {y} Years
                            </button>
                        ))}
                    </div>

                    {emiResult.emi > 0 && (
                        <div className="con-calc__results">
                            <h4>EMI Results</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Monthly EMI</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.25rem" }}>{formatINR(emiResult.emi)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Principal Amount</span><span className="con-result-row__value">{formatINR(loanAmt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Interest</span><span className="con-result-row__value">{formatINR(emiResult.totalInt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Amount Payable</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.totalAmt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Interest as % of Total</span><span className="con-result-row__value">{emiResult.interestPct.toFixed(1)}%</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Formula:</strong> EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]<br />
                                = [{lakhLabel(loanAmt)} × {(rate / 12 / 100).toFixed(6)} × (1+{(rate / 12 / 100).toFixed(6)})<sup>{tenure * 12}</sup>] / [(1+{(rate / 12 / 100).toFixed(6)})<sup>{tenure * 12}</sup> − 1] = <strong>{formatINR(emiResult.emi)}</strong>
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <button className="calc-tab-btn" onClick={() => setShowAmort(!showAmort)} style={{ background: showAmort ? "#d4620a" : undefined, color: showAmort ? "#fff" : undefined, borderColor: showAmort ? "#d4620a" : undefined }}>
                                    {showAmort ? "Hide" : "Show"} Amortization Schedule
                                </button>
                            </div>
                            {showAmort && amortRows.length > 0 && (
                                <div style={{ overflowX: "auto", marginTop: "12px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                        <thead>
                                            <tr style={{ background: "#d4620a", color: "#fff" }}>
                                                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Year</th>
                                                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Principal Paid</th>
                                                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Interest Paid</th>
                                                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {amortRows.map((r) => (
                                                <tr key={r.year} style={r.year % 2 === 0 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                    <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.year}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.principal)}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.interest)}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{formatINR(r.balance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: ELIGIBILITY ═══════ */}
            {mode === "eligibility" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Monthly Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={monthlyIncome} onChange={(e) => setMonthlyIncome(+e.target.value)} min={10000} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(monthlyIncome)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Existing Monthly EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={existingEMI} onChange={(e) => setExistingEMI(+e.target.value)} min={0} step={1000} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={eligRate} onChange={(e) => setEligRate(+e.target.value)} min={1} max={20} step={0.1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={eligTenure} onChange={(e) => setEligTenure(+e.target.value)} min={1} max={30} />
                        </div>
                    </div>
                    {eligResult && (
                        <div className="con-calc__results">
                            <h4>Eligibility Results</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Max Affordable EMI (50% FOIR)</span><span className="con-result-row__value">{formatINR(eligResult.maxEMI)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Amount</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(eligResult.maxLoan)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Property You Can Afford (80% LTV)</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(eligResult.prop80)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Property You Can Afford (75% LTV)</span><span className="con-result-row__value">{formatINR(eligResult.prop75)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>FOIR Rule:</strong> Banks typically allow max 50% of your gross monthly income towards all EMIs combined. With {formatINR(monthlyIncome)} income and {formatINR(existingEMI)} existing EMIs, your available EMI capacity is <strong>{formatINR(eligResult.maxEMI)}/month</strong>.
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: PREPAYMENT ═══════ */}
            {mode === "prepay" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Loan Amount <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={prepayAmt} onChange={(e) => setPrepayAmt(+e.target.value)} min={100000} step={100000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(prepayAmt)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={prepayRate} onChange={(e) => setPrepayRate(+e.target.value)} min={1} max={20} step={0.1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={prepayTenure} onChange={(e) => setPrepayTenure(+e.target.value)} min={1} max={30} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Lump-Sum Prepayment <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={lumpSum} onChange={(e) => setLumpSum(+e.target.value)} min={0} step={50000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(lumpSum)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Prepayment After <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={prepayYear} onChange={(e) => setPrepayYear(+e.target.value)} min={1} max={prepayTenure - 1} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Prepayment Impact Analysis</h4>
                        <div className="con-result-row"><span className="con-result-row__label">Original Monthly EMI</span><span className="con-result-row__value">{formatINR(prepayResult.origEMI)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Original Total Interest</span><span className="con-result-row__value">{formatINR(prepayResult.origInt)}</span></div>

                        <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>After Prepaying {formatINR(lumpSum)} in Year {prepayYear}</div>
                        </div>

                        <div className="con-result-row"><span className="con-result-row__label">New Total Interest</span><span className="con-result-row__value">{formatINR(prepayResult.newTotalInt)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Interest Saved</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(prepayResult.interestSaved)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">New Tenure</span><span className="con-result-row__value">{Math.floor(prepayResult.newTotalMonths / 12)} yrs {prepayResult.newTotalMonths % 12} mo</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Tenure Reduced By</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>{Math.floor(prepayResult.tenureSaved / 12)} yrs {prepayResult.tenureSaved % 12} mo</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Key Insight:</strong> A one-time prepayment of {formatINR(lumpSum)} in Year {prepayYear} saves you <strong>{formatINR(prepayResult.interestSaved)}</strong> in interest and shortens your loan by <strong>{Math.floor(prepayResult.tenureSaved / 12)} years {prepayResult.tenureSaved % 12} months</strong>. Earlier prepayments save more because the outstanding balance is higher.
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: AFFORDABILITY ═══════ */}
            {mode === "afford" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Monthly Budget for EMI <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={monthlyBudget} onChange={(e) => setMonthlyBudget(+e.target.value)} min={5000} step={5000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={affordRate} onChange={(e) => setAffordRate(+e.target.value)} min={1} max={20} step={0.1} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={affordTenure} onChange={(e) => setAffordTenure(+e.target.value)} min={1} max={30} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>What Can You Afford?</h4>
                        <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Amount</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.2rem" }}>{formatINR(affordResult.maxLoan)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Total You Will Pay</span><span className="con-result-row__value">{formatINR(affordResult.totalPay)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Total Interest</span><span className="con-result-row__value">{formatINR(affordResult.totalInt)}</span></div>

                        <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Property Price You Can Afford</div>
                        </div>

                        <div className="con-result-row"><span className="con-result-row__label">With 10% Down Payment</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(affordResult.prop90)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">With 15% Down Payment</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(affordResult.prop85)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">With 20% Down Payment</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(affordResult.prop80)}</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>How it works:</strong> If you can comfortably pay {formatINR(monthlyBudget)}/month as EMI at {affordRate}% for {affordTenure} years, you can borrow up to <strong>{formatINR(affordResult.maxLoan)}</strong>. With a 20% down payment, the property you can target is worth <strong>{formatINR(affordResult.prop80)}</strong>.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

"use client";

import { useState, useMemo } from "react";

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

function lakhLabel(n: number): string {
    if (n >= 1_00_00_000) return (n / 1_00_00_000).toFixed(2).replace(/\.?0+$/, "") + " Crore";
    if (n >= 1_00_000) return (n / 1_00_000).toFixed(2).replace(/\.?0+$/, "") + " Lakh";
    return n.toLocaleString("en-IN");
}

type CalcMode = "emi" | "eligibility" | "prepay" | "compare";

function calcEMI(P: number, annualRate: number, tenureMonths: number): number {
    if (P <= 0 || annualRate <= 0 || tenureMonths <= 0) return 0;
    const R = annualRate / 12 / 100;
    const N = tenureMonths;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

interface AmortRow { year: number; principal: number; interest: number; balance: number; }
function calcAmortization(P: number, annualRate: number, tenureMonths: number): AmortRow[] {
    const R = annualRate / 12 / 100;
    const emi = calcEMI(P, annualRate, tenureMonths);
    if (emi <= 0) return [];
    let balance = P;
    const rows: AmortRow[] = [];
    const totalYears = Math.ceil(tenureMonths / 12);
    for (let yr = 1; yr <= totalYears; yr++) {
        let yearPrincipal = 0, yearInterest = 0;
        const months = Math.min(12, tenureMonths - (yr - 1) * 12);
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

export default function BusinessLoanCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("emi");

    /* Mode 1: EMI */
    const [loanAmount, setLoanAmount] = useState(10_00_000);
    const [rate, setRate] = useState(14);
    const [tenureYrs, setTenureYrs] = useState(5);
    const [showAmort, setShowAmort] = useState(false);

    /* Mode 2: Eligibility */
    const [monthlyRevenue, setMonthlyRevenue] = useState(2_00_000);
    const [existingEMI, setExistingEMI] = useState(0);
    const [eligRate, setEligRate] = useState(14);
    const [eligTenure, setEligTenure] = useState(5);

    /* Mode 3: Prepayment */
    const [prepayLoan, setPrepayLoan] = useState(10_00_000);
    const [prepayRate, setPrepayRate] = useState(14);
    const [prepayTenure, setPrepayTenure] = useState(5);
    const [lumpSum, setLumpSum] = useState(2_00_000);
    const [prepayMonth, setPrepayMonth] = useState(12);

    /* Mode 4: Secured vs Unsecured */
    const [cmpAmount, setCmpAmount] = useState(20_00_000);
    const [securedRate, setSecuredRate] = useState(10);
    const [unsecuredRate, setUnsecuredRate] = useState(16);
    const [securedTenure, setSecuredTenure] = useState(7);
    const [unsecuredTenure, setUnsecuredTenure] = useState(5);

    /* ── Amount presets ── */
    const amountPresets = [
        { label: "₹5 Lakh", value: 5_00_000 },
        { label: "₹10 Lakh", value: 10_00_000 },
        { label: "₹20 Lakh", value: 20_00_000 },
        { label: "₹50 Lakh", value: 50_00_000 },
        { label: "₹1 Crore", value: 1_00_00_000 },
    ];

    /* ── EMI Results ── */
    const emiResult = useMemo(() => {
        const N = tenureYrs * 12;
        const emi = calcEMI(loanAmount, rate, N);
        const totalAmt = emi * N;
        const totalInt = totalAmt - loanAmount;
        const taxSaving30 = totalInt * 0.30;
        const effectiveInt = totalInt - taxSaving30;
        const effectiveRate = rate * 0.70;
        return { emi, totalAmt, totalInt, taxSaving30, effectiveInt, effectiveRate };
    }, [loanAmount, rate, tenureYrs]);

    const amortRows = useMemo(() => {
        if (!showAmort) return [];
        return calcAmortization(loanAmount, rate, tenureYrs * 12);
    }, [loanAmount, rate, tenureYrs, showAmort]);

    /* ── Eligibility Results ── */
    const eligResult = useMemo(() => {
        const maxEMI = (monthlyRevenue * 0.40) - existingEMI;
        if (maxEMI <= 0) return null;
        const R = eligRate / 12 / 100;
        const N = eligTenure * 12;
        const maxLoan = maxEMI * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
        return { maxEMI, maxLoan, mudraEligible: maxLoan >= 50000, cgtmseEligible: maxLoan >= 100000 };
    }, [monthlyRevenue, existingEMI, eligRate, eligTenure]);

    /* ── Prepayment Results ── */
    const prepayResult = useMemo(() => {
        const N = prepayTenure * 12;
        const origEMI = calcEMI(prepayLoan, prepayRate, N);
        const origTotal = origEMI * N;
        const origInt = origTotal - prepayLoan;
        const R = prepayRate / 12 / 100;
        let balance = prepayLoan;
        let intPaidBefore = 0;
        for (let m = 0; m < prepayMonth; m++) {
            const intPart = balance * R;
            intPaidBefore += intPart;
            balance -= (origEMI - intPart);
        }
        balance -= lumpSum;
        if (balance < 0) balance = 0;
        let newMonths = 0;
        let intPaidAfter = 0;
        let bal = balance;
        while (bal > 1 && newMonths < 600) {
            const intPart = bal * R;
            intPaidAfter += intPart;
            bal -= (origEMI - intPart);
            newMonths++;
        }
        const newTotalMonths = prepayMonth + newMonths;
        const newTotalInt = intPaidBefore + intPaidAfter;
        const interestSaved = origInt - newTotalInt - lumpSum;
        const tenureSaved = N - newTotalMonths;
        const taxSavingLost = Math.max(0, interestSaved) * 0.30;
        const netSaving = Math.max(0, interestSaved) - taxSavingLost;
        return { origEMI, origInt, newTotalMonths, newTotalInt, interestSaved: Math.max(0, interestSaved), tenureSaved: Math.max(0, tenureSaved), taxSavingLost, netSaving };
    }, [prepayLoan, prepayRate, prepayTenure, lumpSum, prepayMonth]);

    /* ── Secured vs Unsecured Results ── */
    const cmpResult = useMemo(() => {
        const N1 = securedTenure * 12, N2 = unsecuredTenure * 12;
        const emi1 = calcEMI(cmpAmount, securedRate, N1);
        const emi2 = calcEMI(cmpAmount, unsecuredRate, N2);
        const total1 = emi1 * N1, total2 = emi2 * N2;
        const int1 = total1 - cmpAmount, int2 = total2 - cmpAmount;
        return { emi1, emi2, total1, total2, int1, int2, diff: Math.abs(int1 - int2), taxSaving1: int1 * 0.30, taxSaving2: int2 * 0.30 };
    }, [cmpAmount, securedRate, unsecuredRate, securedTenure, unsecuredTenure]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle = { padding: "10px 12px", fontWeight: 600 as const, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🏢 Business Loan EMI Calculator</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["emi", "EMI Calculator"], ["eligibility", "Loan Eligibility"], ["prepay", "Prepayment Impact"], ["compare", "Secured vs Unsecured"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: EMI ═══════ */}
            {mode === "emi" && (
                <>
                    <div style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Select Amount</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {amountPresets.map((a) => (
                                <button key={a.value} className="calc-tab-btn" onClick={() => setLoanAmount(a.value)} style={loanAmount === a.value ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.75rem" } : { fontSize: "0.75rem" }}>{a.label}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Loan Amount <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} min={50000} step={50000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(loanAmount)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={rate} onChange={(e) => setRate(+e.target.value)} min={5} max={40} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={tenureYrs} onChange={(e) => setTenureYrs(+e.target.value)} min={1} max={10} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {[1, 2, 3, 5, 7].map((y) => (
                            <button key={y} className="calc-tab-btn" onClick={() => setTenureYrs(y)} style={tenureYrs === y ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>{y} Year{y > 1 ? "s" : ""}</button>
                        ))}
                    </div>

                    {emiResult.emi > 0 && (
                        <div className="con-calc__results">
                            <h4>EMI Results</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Loan Amount</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(loanAmount)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Monthly EMI</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.25rem" }}>{formatINR(emiResult.emi)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Interest</span><span className="con-result-row__value">{formatINR(emiResult.totalInt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Amount Payable</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.totalAmt)}</span></div>

                            <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "#16a34a" }}>💰 Tax Benefit (Section 36(1)(iii))</div>
                            </div>
                            <div className="con-result-row"><span className="con-result-row__label">Tax Saving @30% Slab</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>{formatINR(emiResult.taxSaving30)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Effective Interest Cost</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.effectiveInt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Effective Interest Rate</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800 }}>{emiResult.effectiveRate.toFixed(1)}% p.a.</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Tax Advantage:</strong> All business loan interest is 100% deductible under Section 36(1)(iii). At 30% tax bracket, your {rate}% loan effectively costs only <strong>{emiResult.effectiveRate.toFixed(1)}%</strong> — saving <strong>{formatINR(emiResult.taxSaving30)}</strong> over the loan tenure.
                            </div>

                            <div style={{ marginTop: "16px" }}>
                                <button className="calc-tab-btn" onClick={() => setShowAmort(!showAmort)} style={{ background: showAmort ? "#d4620a" : undefined, color: showAmort ? "#fff" : undefined, borderColor: showAmort ? "#d4620a" : undefined }}>
                                    {showAmort ? "Hide" : "Show"} Amortization Schedule
                                </button>
                            </div>
                            {showAmort && amortRows.length > 0 && (
                                <div style={{ overflowX: "auto", marginTop: "12px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                        <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                            <th style={{ ...thStyle, textAlign: "left" }}>Year</th>
                                            <th style={{ ...thStyle, textAlign: "right" }}>Principal Paid</th>
                                            <th style={{ ...thStyle, textAlign: "right" }}>Interest Paid</th>
                                            <th style={{ ...thStyle, textAlign: "right" }}>Tax Saving @30%</th>
                                            <th style={{ ...thStyle, textAlign: "right" }}>Balance</th>
                                        </tr></thead>
                                        <tbody>{amortRows.map((r) => (
                                            <tr key={r.year} style={r.year % 2 === 0 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.year}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.principal)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.interest)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", color: "#16a34a" }}>{formatINR(r.interest * 0.30)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{formatINR(r.balance)}</td>
                                            </tr>
                                        ))}</tbody>
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
                            <label className="con-input__label">Monthly Business Revenue <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(+e.target.value)} min={10000} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(monthlyRevenue)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Existing Monthly EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={existingEMI} onChange={(e) => setExistingEMI(+e.target.value)} min={0} step={1000} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={eligRate} onChange={(e) => setEligRate(+e.target.value)} min={5} max={30} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={eligTenure} onChange={(e) => setEligTenure(+e.target.value)} min={1} max={10} />
                        </div>
                    </div>

                    {eligResult && (
                        <div className="con-calc__results">
                            <h4>Business Loan Eligibility</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Max EMI Capacity (40% of Revenue)</span><span className="con-result-row__value">{formatINR(eligResult.maxEMI)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Amount</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(eligResult.maxLoan)}</span></div>

                            <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Government Scheme Eligibility</div>
                            </div>
                            <div className="con-result-row"><span className="con-result-row__label">Mudra PMMY Eligible</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{eligResult.mudraEligible ? "✅ Yes (up to ₹20L)" : "⚠️ Revenue too low"}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">CGTMSE Collateral-Free</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{eligResult.cgtmseEligible ? "✅ Up to ₹10 Crore" : "⚠️ Explore Mudra first"}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">RBI Mandatory Collateral-Free</span><span className="con-result-row__value" style={{ fontWeight: 700, color: "#16a34a" }}>✅ Up to ₹20 Lakh (Apr 2026)</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>DSCR Rule:</strong> Lenders typically allow 30–40% of net business revenue towards EMI obligations. With {formatINR(monthlyRevenue)} monthly revenue, your max EMI capacity is <strong>{formatINR(eligResult.maxEMI)}</strong>. At {eligRate}% for {eligTenure} years, you can borrow up to <strong>{formatINR(eligResult.maxLoan)}</strong>. Actual eligibility also depends on CIBIL score (700+), business vintage (2+ years), and documentation quality.
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
                            <input type="number" className="con-input__field" value={prepayLoan} onChange={(e) => setPrepayLoan(+e.target.value)} min={50000} step={50000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(prepayLoan)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={prepayRate} onChange={(e) => setPrepayRate(+e.target.value)} min={5} max={30} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={prepayTenure} onChange={(e) => setPrepayTenure(+e.target.value)} min={1} max={10} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Lump-Sum Prepayment <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={lumpSum} onChange={(e) => setLumpSum(+e.target.value)} min={0} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(lumpSum)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Prepayment After <span className="con-input__unit">(Months)</span></label>
                            <input type="number" className="con-input__field" value={prepayMonth} onChange={(e) => setPrepayMonth(+e.target.value)} min={1} max={prepayTenure * 12 - 1} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Prepayment Impact Analysis</h4>
                        <div className="con-result-row"><span className="con-result-row__label">Original Monthly EMI</span><span className="con-result-row__value">{formatINR(prepayResult.origEMI)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Original Total Interest</span><span className="con-result-row__value">{formatINR(prepayResult.origInt)}</span></div>
                        <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>After Prepaying {formatINR(lumpSum)} at Month {prepayMonth}</div>
                        </div>
                        <div className="con-result-row"><span className="con-result-row__label">Interest Saved</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(prepayResult.interestSaved)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Tenure Reduced By</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>{Math.floor(prepayResult.tenureSaved / 12)} yrs {prepayResult.tenureSaved % 12} mo</span></div>

                        <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "#d4620a" }}>⚠️ Tax Impact of Prepayment</div>
                        </div>
                        <div className="con-result-row"><span className="con-result-row__label">Tax Deduction Lost @30%</span><span className="con-result-row__value" style={{ color: "#d4620a" }}>{formatINR(prepayResult.taxSavingLost)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Net Effective Saving</span><span className="con-result-row__value" style={{ fontWeight: 800, fontSize: "1.1rem" }}>{formatINR(prepayResult.netSaving)}</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Business Loan Prepayment Warning:</strong> Unlike personal loans, prepaying a business loan also reduces your tax deduction. You save {formatINR(prepayResult.interestSaved)} in interest, but lose {formatINR(prepayResult.taxSavingLost)} in tax benefits — net saving is <strong>{formatINR(prepayResult.netSaving)}</strong>. For MSE floating-rate loans, RBI prohibits prepayment penalties (Jan 2026).
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: SECURED vs UNSECURED ═══════ */}
            {mode === "compare" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Loan Amount <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={cmpAmount} onChange={(e) => setCmpAmount(+e.target.value)} min={50000} step={50000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(cmpAmount)}</div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ padding: "16px", border: "2px solid #16a34a", borderRadius: "12px", background: "rgba(22,163,74,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#16a34a", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>🔒 Secured (LAP/Collateral)</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Rate <span className="con-input__unit">(% p.a.)</span></label>
                                <input type="number" className="con-input__field" value={securedRate} onChange={(e) => setSecuredRate(+e.target.value)} min={5} max={20} step={0.01} />
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                                <input type="number" className="con-input__field" value={securedTenure} onChange={(e) => setSecuredTenure(+e.target.value)} min={1} max={15} />
                            </div>
                        </div>
                        <div style={{ padding: "16px", border: "2px solid #d4620a", borderRadius: "12px", background: "rgba(212,98,10,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#d4620a", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>🔓 Unsecured (No Collateral)</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Rate <span className="con-input__unit">(% p.a.)</span></label>
                                <input type="number" className="con-input__field" value={unsecuredRate} onChange={(e) => setUnsecuredRate(+e.target.value)} min={5} max={40} step={0.01} />
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                                <input type="number" className="con-input__field" value={unsecuredTenure} onChange={(e) => setUnsecuredTenure(+e.target.value)} min={1} max={10} />
                            </div>
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Secured vs Unsecured Business Loan</h4>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                    <th style={{ ...thStyle, textAlign: "left" }}>Parameter</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>🔒 Secured ({securedRate}%, {securedTenure}yr)</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>🔓 Unsecured ({unsecuredRate}%, {unsecuredTenure}yr)</th>
                                </tr></thead>
                                <tbody>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Monthly EMI</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.emi1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.emi2)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Interest</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.int1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.int2)}</td></tr>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Tax Saving @30%</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", color: "#16a34a" }}>{formatINR(cmpResult.taxSaving1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", color: "#16a34a" }}>{formatINR(cmpResult.taxSaving2)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Cost</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(cmpResult.total1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(cmpResult.total2)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Key Insight:</strong> The unsecured loan costs <strong>{formatINR(cmpResult.diff)} more in interest</strong>. On {formatINR(cmpAmount)}, secured (LAP) at {securedRate}% saves significantly vs unsecured at {unsecuredRate}%. However, secured loans risk your property on default. For loans under ₹20 Lakh, the new RBI mandate (April 2026) means banks must offer collateral-free loans — so you get the speed of unsecured with potentially better rates.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

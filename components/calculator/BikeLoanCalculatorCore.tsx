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

export default function BikeLoanCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("emi");

    /* Mode 1: EMI */
    const [bikePrice, setBikePrice] = useState(1_00_000);
    const [downPct, setDownPct] = useState(10);
    const [rate, setRate] = useState(12);
    const [tenureYrs, setTenureYrs] = useState(3);
    const [showAmort, setShowAmort] = useState(false);

    /* Mode 2: Eligibility */
    const [monthlySalary, setMonthlySalary] = useState(25_000);
    const [existingEMI, setExistingEMI] = useState(0);
    const [eligRate, setEligRate] = useState(12);
    const [eligTenure, setEligTenure] = useState(3);

    /* Mode 3: Prepayment */
    const [prepayLoan, setPrepayLoan] = useState(80_000);
    const [prepayRate, setPrepayRate] = useState(12);
    const [prepayTenure, setPrepayTenure] = useState(3);
    const [lumpSum, setLumpSum] = useState(20_000);
    const [prepayMonth, setPrepayMonth] = useState(6);

    /* Mode 4: Bank vs NBFC */
    const [cmpPrice, setCmpPrice] = useState(1_00_000);
    const [cmpDown, setCmpDown] = useState(10);
    const [bankRate, setBankRate] = useState(10.5);
    const [nbfcRate, setNbfcRate] = useState(15);
    const [bankTenure, setBankTenure] = useState(3);
    const [nbfcTenure, setNbfcTenure] = useState(3);

    /* ── Model presets ── */
    const bikePresets = [
        { label: "Honda Activa 6G", price: 90_000 },
        { label: "Hero Splendor+", price: 88_000 },
        { label: "TVS Jupiter 125", price: 95_000 },
        { label: "TVS Apache 160", price: 1_40_000 },
        { label: "RE Hunter 350", price: 1_75_000 },
        { label: "RE Classic 350", price: 2_30_000 },
    ];

    /* ── EMI Results ── */
    const emiResult = useMemo(() => {
        const downAmt = bikePrice * (downPct / 100);
        const loanAmt = bikePrice - downAmt;
        const N = tenureYrs * 12;
        const emi = calcEMI(loanAmt, rate, N);
        const totalAmt = emi * N;
        const totalInt = totalAmt - loanAmt;
        return { downAmt, loanAmt, emi, totalAmt, totalInt, interestPct: (totalInt / totalAmt) * 100 };
    }, [bikePrice, downPct, rate, tenureYrs]);

    const amortRows = useMemo(() => {
        if (!showAmort) return [];
        const loanAmt = bikePrice - bikePrice * (downPct / 100);
        return calcAmortization(loanAmt, rate, tenureYrs * 12);
    }, [bikePrice, downPct, rate, tenureYrs, showAmort]);

    /* ── Eligibility Results ── */
    const eligResult = useMemo(() => {
        const maxEMI = (monthlySalary * 0.50) - existingEMI;
        if (maxEMI <= 0) return null;
        const R = eligRate / 12 / 100;
        const N = eligTenure * 12;
        const maxLoan = maxEMI * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
        return { maxEMI, maxLoan, maxBike90: maxLoan / 0.90, maxBike80: maxLoan / 0.80 };
    }, [monthlySalary, existingEMI, eligRate, eligTenure]);

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
        while (bal > 1 && newMonths < 360) {
            const intPart = bal * R;
            intPaidAfter += intPart;
            bal -= (origEMI - intPart);
            newMonths++;
        }
        const newTotalMonths = prepayMonth + newMonths;
        const newTotalInt = intPaidBefore + intPaidAfter;
        const interestSaved = origInt - newTotalInt - lumpSum;
        const tenureSaved = N - newTotalMonths;
        return { origEMI, origInt, newTotalMonths, newTotalInt, interestSaved: Math.max(0, interestSaved), tenureSaved: Math.max(0, tenureSaved) };
    }, [prepayLoan, prepayRate, prepayTenure, lumpSum, prepayMonth]);

    /* ── Bank vs NBFC Results ── */
    const cmpResult = useMemo(() => {
        const downAmt = cmpPrice * (cmpDown / 100);
        const loanAmt = cmpPrice - downAmt;
        const N1 = bankTenure * 12, N2 = nbfcTenure * 12;
        const emi1 = calcEMI(loanAmt, bankRate, N1);
        const emi2 = calcEMI(loanAmt, nbfcRate, N2);
        const total1 = emi1 * N1, total2 = emi2 * N2;
        const int1 = total1 - loanAmt, int2 = total2 - loanAmt;
        return { loanAmt, emi1, emi2, total1, total2, int1, int2, diff: Math.abs(int1 - int2) };
    }, [cmpPrice, cmpDown, bankRate, nbfcRate, bankTenure, nbfcTenure]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle = { padding: "10px 12px", fontWeight: 600 as const, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🏍️ Bike Loan EMI Calculator</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["emi", "EMI Calculator"], ["eligibility", "Loan Eligibility"], ["prepay", "Prepayment Impact"], ["compare", "Bank vs NBFC"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: EMI ═══════ */}
            {mode === "emi" && (
                <>
                    <div style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Select Model</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {bikePresets.map((b) => (
                                <button key={b.label} className="calc-tab-btn" onClick={() => setBikePrice(b.price)} style={bikePrice === b.price ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.75rem" } : { fontSize: "0.75rem" }}>{b.label}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Bike On-Road Price <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={bikePrice} onChange={(e) => setBikePrice(+e.target.value)} min={20000} step={5000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(bikePrice)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Down Payment <span className="con-input__unit">(%)</span></label>
                            <input type="number" className="con-input__field" value={downPct} onChange={(e) => setDownPct(+e.target.value)} min={0} max={100} step={5} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{formatINR(bikePrice * (downPct / 100))}</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {[0, 10, 15, 20].map((p) => (
                            <button key={p} className="calc-tab-btn" onClick={() => setDownPct(p)} style={downPct === p ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>{p}% Down</button>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={rate} onChange={(e) => setRate(+e.target.value)} min={5} max={30} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={tenureYrs} onChange={(e) => setTenureYrs(+e.target.value)} min={1} max={5} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {[1, 2, 3, 4, 5].map((y) => (
                            <button key={y} className="calc-tab-btn" onClick={() => setTenureYrs(y)} style={tenureYrs === y ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>{y} Year{y > 1 ? "s" : ""}</button>
                        ))}
                    </div>

                    {emiResult.emi > 0 && (
                        <div className="con-calc__results">
                            <h4>EMI Results</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Bike On-Road Price</span><span className="con-result-row__value">{formatINR(bikePrice)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Down Payment ({downPct}%)</span><span className="con-result-row__value">{formatINR(emiResult.downAmt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Loan Amount</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.loanAmt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Monthly EMI</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.25rem" }}>{formatINR(emiResult.emi)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Interest</span><span className="con-result-row__value">{formatINR(emiResult.totalInt)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Amount Payable</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.totalAmt)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Formula:</strong> EMI = [P × R × (1+R)<sup>N</sup>] / [(1+R)<sup>N</sup> − 1]<br />
                                P = {formatINR(emiResult.loanAmt)}, R = {(rate / 12 / 100).toFixed(6)}, N = {tenureYrs * 12} months → EMI = <strong>{formatINR(emiResult.emi)}</strong>
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
                                            <th style={{ ...thStyle, textAlign: "right" }}>Balance</th>
                                        </tr></thead>
                                        <tbody>{amortRows.map((r) => (
                                            <tr key={r.year} style={r.year % 2 === 0 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.year}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.principal)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.interest)}</td>
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
                            <label className="con-input__label">Monthly Net Salary <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={monthlySalary} onChange={(e) => setMonthlySalary(+e.target.value)} min={5000} step={5000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(monthlySalary)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Existing Monthly EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={existingEMI} onChange={(e) => setExistingEMI(+e.target.value)} min={0} step={500} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={eligRate} onChange={(e) => setEligRate(+e.target.value)} min={5} max={30} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={eligTenure} onChange={(e) => setEligTenure(+e.target.value)} min={1} max={5} />
                        </div>
                    </div>

                    {eligResult && (
                        <div className="con-calc__results">
                            <h4>Bike Loan Eligibility</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Max EMI Capacity (50% FOIR)</span><span className="con-result-row__value">{formatINR(eligResult.maxEMI)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Amount</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(eligResult.maxLoan)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Max Bike Price (10% down / 90% LTV)</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(eligResult.maxBike90)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Max Bike Price (20% down / 80% LTV)</span><span className="con-result-row__value">{formatINR(eligResult.maxBike80)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>FOIR Rule:</strong> Most lenders allow max 50% of net income towards all EMIs. With {formatINR(monthlySalary)} salary, your max new EMI is <strong>{formatINR(eligResult.maxEMI)}</strong>. At {eligRate}% for {eligTenure} years, you can borrow <strong>{formatINR(eligResult.maxLoan)}</strong>. With 10% down payment, you can afford a two-wheeler up to <strong>{formatINR(eligResult.maxBike90)}</strong> on-road.
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
                            <input type="number" className="con-input__field" value={prepayLoan} onChange={(e) => setPrepayLoan(+e.target.value)} min={10000} step={5000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(prepayLoan)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={prepayRate} onChange={(e) => setPrepayRate(+e.target.value)} min={5} max={30} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={prepayTenure} onChange={(e) => setPrepayTenure(+e.target.value)} min={1} max={5} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Lump-Sum Prepayment <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={lumpSum} onChange={(e) => setLumpSum(+e.target.value)} min={0} step={5000} />
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
                        <div className="con-result-row"><span className="con-result-row__label">New Total Interest</span><span className="con-result-row__value">{formatINR(prepayResult.newTotalInt)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Interest Saved</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(prepayResult.interestSaved)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">New Tenure</span><span className="con-result-row__value">{Math.floor(prepayResult.newTotalMonths / 12)} yrs {prepayResult.newTotalMonths % 12} mo</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Tenure Reduced By</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>{Math.floor(prepayResult.tenureSaved / 12)} yrs {prepayResult.tenureSaved % 12} mo</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>RBI Rule (Jan 2026):</strong> Under the new Pre-Payment Charges Directions 2025, banks and NBFCs cannot charge prepayment or foreclosure penalty on <strong>floating-rate bike loans</strong> for individual borrowers. For fixed-rate loans, charges must be disclosed in the Key Fact Statement (KFS). Most two-wheeler loans are fixed rate — check your agreement.
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: BANK vs NBFC ═══════ */}
            {mode === "compare" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Bike Price <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={cmpPrice} onChange={(e) => setCmpPrice(+e.target.value)} min={20000} step={5000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(cmpPrice)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Down Payment <span className="con-input__unit">(%)</span></label>
                            <input type="number" className="con-input__field" value={cmpDown} onChange={(e) => setCmpDown(+e.target.value)} min={0} max={50} step={5} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{formatINR(cmpPrice * (cmpDown / 100))}</div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ padding: "16px", border: "2px solid #16a34a", borderRadius: "12px", background: "rgba(22,163,74,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#16a34a", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>🏦 Bank Loan (SBI/HDFC)</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                                <input type="number" className="con-input__field" value={bankRate} onChange={(e) => setBankRate(+e.target.value)} min={5} max={20} step={0.01} />
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                                <input type="number" className="con-input__field" value={bankTenure} onChange={(e) => setBankTenure(+e.target.value)} min={1} max={5} />
                            </div>
                        </div>
                        <div style={{ padding: "16px", border: "2px solid #d4620a", borderRadius: "12px", background: "rgba(212,98,10,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#d4620a", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>⚡ NBFC (Bajaj/TVS Credit)</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                                <input type="number" className="con-input__field" value={nbfcRate} onChange={(e) => setNbfcRate(+e.target.value)} min={5} max={30} step={0.01} />
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                                <input type="number" className="con-input__field" value={nbfcTenure} onChange={(e) => setNbfcTenure(+e.target.value)} min={1} max={5} />
                            </div>
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Bank vs NBFC Comparison</h4>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                    <th style={{ ...thStyle, textAlign: "left" }}>Parameter</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>🏦 Bank ({bankRate}%, {bankTenure}yr)</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>⚡ NBFC ({nbfcRate}%, {nbfcTenure}yr)</th>
                                </tr></thead>
                                <tbody>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Loan Amount</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.loanAmt)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.loanAmt)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Monthly EMI</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.emi1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.emi2)}</td></tr>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Interest</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.int1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(cmpResult.int2)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Cost</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(cmpResult.total1)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(cmpResult.total2)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Key Insight:</strong> The NBFC loan at {nbfcRate}% costs <strong>{formatINR(cmpResult.diff)} more in interest</strong> than the bank loan at {bankRate}%. NBFCs process loans in 15 minutes at the showroom, but banks save you money. For savings above ₹2,000–₹3,000 on the total loan, the bank route is worth the extra paperwork.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

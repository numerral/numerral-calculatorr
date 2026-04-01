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
    if (n >= 1_00_00_000) return "₹" + (n / 1_00_00_000).toFixed(2).replace(/\.?0+$/, "") + " Cr";
    if (n >= 1_00_000) return "₹" + (n / 1_00_000).toFixed(2).replace(/\.?0+$/, "") + " L";
    return formatINR(n);
}

type CalcMode = "emi" | "eligibility" | "tax80e" | "compare";

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

export default function EducationLoanCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("emi");

    /* ═══ Mode 1: EMI with Moratorium ═══ */
    const [loanAmt, setLoanAmt] = useState(10_00_000);
    const [rate, setRate] = useState(8.5);
    const [tenureYrs, setTenureYrs] = useState(7);
    const [moratoriumYrs, setMoratoriumYrs] = useState(4);
    const [showAmort, setShowAmort] = useState(false);

    /* ═══ Mode 2: Eligibility ═══ */
    const [coAppIncome, setCoAppIncome] = useState(50_000);
    const [existingEMI, setExistingEMI] = useState(0);
    const [eligRate, setEligRate] = useState(8.5);
    const [eligTenure, setEligTenure] = useState(10);
    const [eligCourse, setEligCourse] = useState<"domestic" | "abroad">("domestic");

    /* ═══ Mode 3: Section 80E ═══ */
    const [annualInterest, setAnnualInterest] = useState(1_20_000);
    const [taxBracket, setTaxBracket] = useState(30);
    const [claimYears, setClaimYears] = useState(8);

    /* ═══ Mode 4: India vs Abroad ═══ */
    const [indiaFee, setIndiaFee] = useState(20_00_000);
    const [abroadFee, setAbroadFee] = useState(45_00_000);
    const [indiaLiving, setIndiaLiving] = useState(15_000);
    const [abroadLiving, setAbroadLiving] = useState(80_000);
    const [courseDuration, setCourseDuration] = useState(2);
    const [cmpRate, setCmpRate] = useState(8.5);
    const [cmpTenure, setCmpTenure] = useState(10);

    /* ── Course presets ── */
    const coursePresets = [
        { label: "B.Tech (India)", amt: 10_00_000, r: 8.5, m: 5 },
        { label: "MBA (IIM)", amt: 25_00_000, r: 9.0, m: 3 },
        { label: "MBBS (India)", amt: 30_00_000, r: 8.5, m: 6 },
        { label: "MS (USA)", amt: 40_00_000, r: 10.5, m: 3 },
        { label: "MBA (UK/US)", amt: 60_00_000, r: 10.5, m: 2 },
        { label: "M.Tech (India)", amt: 8_00_000, r: 8.5, m: 3 },
    ];

    /* ── Bank presets ── */
    const bankPresets = [
        { label: "SBI", r: 8.50 },
        { label: "BoB", r: 8.15 },
        { label: "PNB", r: 8.55 },
        { label: "Canara", r: 8.65 },
        { label: "Axis", r: 12.0 },
        { label: "HDFC Credila", r: 10.5 },
    ];

    /* ═══ EMI + Moratorium Results ═══ */
    const emiResult = useMemo(() => {
        const moratoriumMonths = moratoriumYrs * 12;
        const monthlyRate = rate / 12 / 100;
        // Simple interest during moratorium (accrues but not compounded monthly for education loans)
        const moratoriumInterest = loanAmt * (rate / 100) * moratoriumYrs;
        // Effective principal at repayment start (moratorium interest capitalized)
        const effectivePrincipal = loanAmt + moratoriumInterest;
        const repayMonths = tenureYrs * 12;
        const emi = calcEMI(effectivePrincipal, rate, repayMonths);
        const totalPaid = emi * repayMonths;
        const totalInterest = totalPaid - loanAmt; // Total interest = moratorium interest + repayment interest
        const repaymentInterest = totalPaid - effectivePrincipal;
        // Section 80E yearly deduction (interest component of EMI in first year of repayment)
        const firstYearInterest = effectivePrincipal * (rate / 100); // approximate
        return {
            moratoriumInterest,
            effectivePrincipal,
            emi,
            totalPaid,
            totalInterest,
            repaymentInterest,
            moratoriumMonths,
            repayMonths,
            firstYearInterest,
        };
    }, [loanAmt, rate, tenureYrs, moratoriumYrs]);

    const amortRows = useMemo(() => {
        if (!showAmort) return [];
        return calcAmortization(emiResult.effectivePrincipal, rate, tenureYrs * 12);
    }, [emiResult.effectivePrincipal, rate, tenureYrs, showAmort]);

    /* ═══ Eligibility Results ═══ */
    const eligResult = useMemo(() => {
        const maxEMI = (coAppIncome * 0.50) - existingEMI;
        if (maxEMI <= 0) return null;
        const R = eligRate / 12 / 100;
        const N = eligTenure * 12;
        const maxLoan = maxEMI * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
        const collateralFree = eligCourse === "domestic" ? 7_50_000 : 7_50_000;
        const needsCollateral = maxLoan > collateralFree;
        const marginPct = eligCourse === "domestic" ? 5 : 15;
        return { maxEMI, maxLoan, collateralFree, needsCollateral, marginPct };
    }, [coAppIncome, existingEMI, eligRate, eligTenure, eligCourse]);

    /* ═══ Section 80E Results ═══ */
    const taxResult = useMemo(() => {
        const yearlyDeduction = annualInterest;
        const yearlySaving = yearlyDeduction * (taxBracket / 100);
        const totalSaving = yearlySaving * claimYears;
        const cessRate = 0.04; // 4% cess
        const yearlySavingWithCess = yearlySaving * (1 + cessRate);
        const totalSavingWithCess = yearlySavingWithCess * claimYears;
        // Effective interest rate after tax benefit
        const effectiveRate = rate * (1 - taxBracket / 100);
        return {
            yearlyDeduction,
            yearlySaving,
            yearlySavingWithCess,
            totalSaving,
            totalSavingWithCess,
            effectiveRate,
            claimYears,
        };
    }, [annualInterest, taxBracket, claimYears, rate]);

    /* ═══ India vs Abroad Results ═══ */
    const compareResult = useMemo(() => {
        const indiaTotalCost = indiaFee + (indiaLiving * 12 * courseDuration);
        const abroadTotalCost = abroadFee + (abroadLiving * 12 * courseDuration);
        const indiaLoanNeeded = Math.max(0, indiaTotalCost * 0.90); // 10% margin
        const abroadLoanNeeded = Math.max(0, abroadTotalCost * 0.85); // 15% margin abroad
        const indiaEMI = calcEMI(indiaLoanNeeded, cmpRate, cmpTenure * 12);
        const abroadEMI = calcEMI(abroadLoanNeeded, cmpRate + 2, cmpTenure * 12); // abroad usually +2%
        const indiaTotal = indiaEMI * cmpTenure * 12;
        const abroadTotal = abroadEMI * cmpTenure * 12;
        const indiaInterest = indiaTotal - indiaLoanNeeded;
        const abroadInterest = abroadTotal - abroadLoanNeeded;
        return {
            indiaTotalCost,
            abroadTotalCost,
            indiaLoanNeeded,
            abroadLoanNeeded,
            indiaEMI,
            abroadEMI,
            indiaTotal,
            abroadTotal,
            indiaInterest,
            abroadInterest,
            costDiff: abroadTotalCost - indiaTotalCost,
        };
    }, [indiaFee, abroadFee, indiaLiving, abroadLiving, courseDuration, cmpRate, cmpTenure]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle = { padding: "10px 12px", fontWeight: 600 as const, fontSize: "0.75rem", textTransform: "uppercase" as const, letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🎓 Education Loan EMI Calculator</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "-8px 0 16px", lineHeight: 1.5 }}>
                India-adapted moratorium handling • Section 80E tax calculator • 7 bank rates • India vs Abroad comparison
            </p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["emi", "🎓 EMI + Moratorium"], ["eligibility", "✅ Eligibility"], ["tax80e", "🧾 Section 80E Tax"], ["compare", "🌍 India vs Abroad"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE 1: EMI + MORATORIUM ═══════ */}
            {mode === "emi" && (
                <>
                    {/* Course presets */}
                    <div style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Select Course</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {coursePresets.map((c) => (
                                <button key={c.label} className="calc-tab-btn" onClick={() => { setLoanAmt(c.amt); setRate(c.r); setMoratoriumYrs(c.m); }} style={loanAmt === c.amt ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.75rem" } : { fontSize: "0.75rem" }}>{c.label}</button>
                            ))}
                        </div>
                    </div>
                    {/* Bank rate presets */}
                    <div style={{ marginBottom: "14px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Bank Interest Rate</div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {bankPresets.map((b) => (
                                <button key={b.label} className="calc-tab-btn" onClick={() => setRate(b.r)} style={rate === b.r ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.75rem" } : { fontSize: "0.75rem" }}>{b.label} ({b.r}%)</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Loan Amount <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={loanAmt} onChange={(e) => setLoanAmt(+e.target.value)} min={50000} step={50000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(loanAmt)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={rate} onChange={(e) => setRate(+e.target.value)} min={5} max={18} step={0.01} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Moratorium Period <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={moratoriumYrs} onChange={(e) => setMoratoriumYrs(+e.target.value)} min={0} max={7} />
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Course duration + 6–12 months grace</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Repayment Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={tenureYrs} onChange={(e) => setTenureYrs(+e.target.value)} min={1} max={15} />
                        </div>
                    </div>

                    {emiResult.emi > 0 && (
                        <div className="con-calc__results">
                            <h4>EMI Results — With Moratorium Impact</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Original Loan Amount</span><span className="con-result-row__value">{formatINR(loanAmt)}</span></div>

                            {moratoriumYrs > 0 && (
                                <>
                                    <div style={{ margin: "12px 0 8px", borderTop: "1px dashed var(--border)", paddingTop: "10px" }}>
                                        <div style={{ fontSize: "0.78rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", color: "#dc2626" }}>⚠ Moratorium Period ({moratoriumYrs} years)</div>
                                    </div>
                                    <div className="con-result-row"><span className="con-result-row__label">Interest During Moratorium</span><span className="con-result-row__value" style={{ color: "#dc2626", fontWeight: 700 }}>{formatINR(emiResult.moratoriumInterest)}</span></div>
                                    <div className="con-result-row"><span className="con-result-row__label">Effective Loan After Moratorium</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.effectivePrincipal)}</span></div>
                                </>
                            )}

                            <div style={{ margin: "12px 0 8px", borderTop: "1px dashed var(--border)", paddingTop: "10px" }}>
                                <div style={{ fontSize: "0.78rem", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px", color: "var(--text-muted)" }}>Repayment Phase ({tenureYrs} years)</div>
                            </div>
                            <div className="con-result-row"><span className="con-result-row__label">Monthly EMI</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.25rem" }}>{formatINR(emiResult.emi)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Interest During Repayment</span><span className="con-result-row__value">{formatINR(emiResult.repaymentInterest)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Interest (Moratorium + Repayment)</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.totalInterest)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Amount Payable</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(emiResult.totalPaid)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Section 80E Tip:</strong> Your approximate first-year interest deduction is <strong>{formatINR(emiResult.firstYearInterest)}</strong>. At 30% tax bracket, this saves ~<strong>{formatINR(emiResult.firstYearInterest * 0.30)}</strong>/year in taxes. Use the <strong>Section 80E Tax</strong> tab for detailed year-wise analysis.
                            </div>

                            {moratoriumYrs > 0 && (
                                <div className="explanation__highlight" style={{ marginTop: "12px", fontSize: "0.85rem", borderLeft: "4px solid #dc2626" }}>
                                    <strong>⚠ Moratorium Alert:</strong> During {moratoriumYrs} years of moratorium, <strong>{formatINR(emiResult.moratoriumInterest)}</strong> in interest accumulates and gets added to your principal. Your {lakhLabel(loanAmt)} loan effectively becomes <strong>{lakhLabel(emiResult.effectivePrincipal)}</strong>. Consider paying at least the interest during moratorium to save <strong>{formatINR(emiResult.moratoriumInterest)}</strong>.
                                </div>
                            )}

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

            {/* ═══════ MODE 2: ELIGIBILITY ═══════ */}
            {mode === "eligibility" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Co-Applicant Monthly Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={coAppIncome} onChange={(e) => setCoAppIncome(+e.target.value)} min={10000} step={5000} />
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Parent/guardian monthly income</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Existing Monthly EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={existingEMI} onChange={(e) => setExistingEMI(+e.target.value)} min={0} step={500} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={eligRate} onChange={(e) => setEligRate(+e.target.value)} min={5} max={16} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Repayment Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={eligTenure} onChange={(e) => setEligTenure(+e.target.value)} min={1} max={15} />
                        </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Course Type</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="calc-tab-btn" onClick={() => setEligCourse("domestic")} style={eligCourse === "domestic" ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {}}>🇮🇳 Studies in India</button>
                            <button className="calc-tab-btn" onClick={() => setEligCourse("abroad")} style={eligCourse === "abroad" ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {}}>🌍 Studies Abroad</button>
                        </div>
                    </div>

                    {eligResult && (
                        <div className="con-calc__results">
                            <h4>Education Loan Eligibility</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Max EMI Capacity (50% FOIR)</span><span className="con-result-row__value">{formatINR(eligResult.maxEMI)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Eligible Loan</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{lakhLabel(eligResult.maxLoan)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Collateral-Free Limit (IBA Standard)</span><span className="con-result-row__value">{formatINR(eligResult.collateralFree)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Collateral Required?</span><span className="con-result-row__value" style={{ fontWeight: 700, color: eligResult.needsCollateral ? "#dc2626" : "#16a34a" }}>{eligResult.needsCollateral ? "Yes — Loan exceeds ₹7.5L" : "No — Under ₹7.5L limit"}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Margin Money ({eligResult.marginPct}%)</span><span className="con-result-row__value">{formatINR(eligResult.maxLoan * eligResult.marginPct / 100)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>IBA Guidelines:</strong> Loans up to ₹7.5 Lakh are collateral-free. For premier institutions (IIT, IIM, NIT, AIIMS), many banks offer enhanced collateral-free limits up to <strong>₹20L–₹50L</strong>. Margin money: {eligCourse === "domestic" ? "5% for domestic" : "15% for studies abroad"} courses (nil for loans up to ₹4L).
                            </div>

                            <div className="explanation__highlight" style={{ marginTop: "12px", fontSize: "0.85rem" }}>
                                <strong>PM-Vidyalakshmi:</strong> If your family income is ≤₹8 Lakh/year, you may be eligible for <strong>3% interest subvention</strong> on loans up to ₹10L at 860+ Quality Higher Education Institutions. Check eligibility at <strong>pmvidyalakshmi.in</strong>.
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE 3: SECTION 80E TAX BENEFIT ═══════ */}
            {mode === "tax80e" && (
                <>
                    <div className="explanation__highlight" style={{ marginBottom: "16px", fontSize: "0.85rem" }}>
                        <strong>Important:</strong> Section 80E deduction is available <strong>only under the Old Tax Regime</strong>. Under the New Tax Regime (default from FY 2024-25), this deduction is NOT available. There is <strong>no upper limit</strong> on the deduction amount — the entire interest paid is deductible.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Annual Interest Paid <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={annualInterest} onChange={(e) => setAnnualInterest(+e.target.value)} min={0} step={10000} />
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Interest portion of EMIs paid in a financial year</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Claim Duration <span className="con-input__unit">(Years, max 8)</span></label>
                            <input type="number" className="con-input__field" value={claimYears} onChange={(e) => setClaimYears(Math.min(8, +e.target.value))} min={1} max={8} />
                        </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Your Tax Bracket (Old Regime)</div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {[{ label: "5% (₹2.5L–₹5L)", pct: 5 }, { label: "20% (₹5L–₹10L)", pct: 20 }, { label: "30% (Above ₹10L)", pct: 30 }].map((t) => (
                                <button key={t.pct} className="calc-tab-btn" onClick={() => setTaxBracket(t.pct)} style={taxBracket === t.pct ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>{t.label}</button>
                            ))}
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Section 80E Tax Savings</h4>
                        <div className="con-result-row"><span className="con-result-row__label">Annual Interest Deduction (80E)</span><span className="con-result-row__value">{formatINR(taxResult.yearlyDeduction)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Yearly Tax Saving (at {taxBracket}%)</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(taxResult.yearlySaving)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Yearly Saving incl. 4% Cess</span><span className="con-result-row__value">{formatINR(taxResult.yearlySavingWithCess)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Total Saving Over {claimYears} Years</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(taxResult.totalSavingWithCess)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Effective Interest Rate After 80E</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>{taxResult.effectiveRate.toFixed(2)}%</span></div>

                        {/* Year-wise breakdown */}
                        <div style={{ overflowX: "auto", marginTop: "16px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                    <th style={{ ...thStyle, textAlign: "left" }}>Year</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>Interest Paid</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>Tax Saved</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>Cumulative Saving</th>
                                </tr></thead>
                                <tbody>{Array.from({ length: claimYears }, (_, i) => (
                                    <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                        <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Year {i + 1}</td>
                                        <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(annualInterest)}</td>
                                        <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", color: "#16a34a", fontWeight: 600 }}>{formatINR(taxResult.yearlySavingWithCess)}</td>
                                        <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(taxResult.yearlySavingWithCess * (i + 1))}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Who Can Claim:</strong> Only <strong>individuals</strong> (not HUFs or companies) who took the loan for higher education of self, spouse, children, or a student for whom they are legal guardian. The loan must be from a recognised financial institution or approved charitable institution. <strong>Principal repayment is NOT deductible</strong> under 80E — only interest.
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE 4: INDIA vs ABROAD ═══════ */}
            {mode === "compare" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ padding: "16px", border: "2px solid #f97316", borderRadius: "12px", background: "rgba(249,115,22,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#f97316", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>🇮🇳 Study in India</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Total Course Fee <span className="con-input__unit">(₹)</span></label>
                                <input type="number" className="con-input__field" value={indiaFee} onChange={(e) => setIndiaFee(+e.target.value)} min={100000} step={100000} />
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(indiaFee)}</div>
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Monthly Living Expenses <span className="con-input__unit">(₹)</span></label>
                                <input type="number" className="con-input__field" value={indiaLiving} onChange={(e) => setIndiaLiving(+e.target.value)} min={5000} step={5000} />
                            </div>
                        </div>
                        <div style={{ padding: "16px", border: "2px solid #3b82f6", borderRadius: "12px", background: "rgba(59,130,246,0.03)" }}>
                            <div style={{ fontWeight: 700, marginBottom: "12px", color: "#3b82f6", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>🌍 Study Abroad</div>
                            <div className="con-input" style={{ marginBottom: "8px" }}>
                                <label className="con-input__label">Total Course Fee <span className="con-input__unit">(₹)</span></label>
                                <input type="number" className="con-input__field" value={abroadFee} onChange={(e) => setAbroadFee(+e.target.value)} min={100000} step={100000} />
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(abroadFee)}</div>
                            </div>
                            <div className="con-input">
                                <label className="con-input__label">Monthly Living Expenses <span className="con-input__unit">(₹)</span></label>
                                <input type="number" className="con-input__field" value={abroadLiving} onChange={(e) => setAbroadLiving(+e.target.value)} min={10000} step={10000} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Course Duration <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={courseDuration} onChange={(e) => setCourseDuration(+e.target.value)} min={1} max={6} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">India Loan Rate <span className="con-input__unit">(% p.a.)</span></label>
                            <input type="number" className="con-input__field" value={cmpRate} onChange={(e) => setCmpRate(+e.target.value)} min={5} max={18} step={0.01} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Repayment Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={cmpTenure} onChange={(e) => setCmpTenure(+e.target.value)} min={1} max={15} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>India vs Abroad — Cost & Loan Comparison</h4>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                    <th style={{ ...thStyle, textAlign: "left" }}>Parameter</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>🇮🇳 India</th>
                                    <th style={{ ...thStyle, textAlign: "right" }}>🌍 Abroad</th>
                                </tr></thead>
                                <tbody>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Course Fee</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(indiaFee)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(abroadFee)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Living Cost ({courseDuration} yrs)</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(indiaLiving * 12 * courseDuration)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(abroadLiving * 12 * courseDuration)}</td></tr>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>Total Education Cost</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{lakhLabel(compareResult.indiaTotalCost)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{lakhLabel(compareResult.abroadTotalCost)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Loan Needed (after margin)</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(compareResult.indiaLoanNeeded)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(compareResult.abroadLoanNeeded)}</td></tr>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Interest Rate</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{cmpRate}%</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{(cmpRate + 2).toFixed(1)}%</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Monthly EMI</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(compareResult.indiaEMI)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{formatINR(compareResult.abroadEMI)}</td></tr>
                                    <tr><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>Total Interest Paid</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(compareResult.indiaInterest)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{lakhLabel(compareResult.abroadInterest)}</td></tr>
                                    <tr style={{ background: "rgba(255,153,51,0.03)" }}><td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>Total Repayment</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{lakhLabel(compareResult.indiaTotal)}</td><td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 700 }}>{lakhLabel(compareResult.abroadTotal)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Cost Difference:</strong> Studying abroad costs <strong>{lakhLabel(compareResult.costDiff)} more</strong> in total education expenses. However, the higher starting salary abroad (typically 3–5× Indian starting salary) can lead to a faster loan payoff. Consider using our <a href="/in/xirr-calculator" style={{ color: "#d4620a", fontWeight: 600 }}>XIRR Calculator</a> to compute the true ROI of your education investment.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

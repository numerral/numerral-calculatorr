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

/* ── Max loan from EMI capacity ── */
function maxLoanFromEMI(maxEMI: number, annualRate: number, tenureYears: number): number {
    if (maxEMI <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
    const R = annualRate / 12 / 100;
    const N = tenureYears * 12;
    return maxEMI * (Math.pow(1 + R, N) - 1) / (R * Math.pow(1 + R, N));
}

/* ── EMI from loan ── */
function calcEMI(P: number, annualRate: number, tenureYears: number): number {
    if (P <= 0 || annualRate <= 0 || tenureYears <= 0) return 0;
    const R = annualRate / 12 / 100;
    const N = tenureYears * 12;
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
}

/* ── Bank data ── */
const BANKS = [
    { name: "SBI", rate: 8.50, minIncome: 25000, maxAge: 70, procFee: "₹2,000–₹10,000", maxTenure: 30, label: "State Bank of India" },
    { name: "HDFC Bank", rate: 8.75, minIncome: 10000, maxAge: 65, procFee: "Up to 0.5%", maxTenure: 30, label: "HDFC Bank" },
    { name: "ICICI Bank", rate: 8.75, minIncome: 25000, maxAge: 65, procFee: "Up to 0.5%", maxTenure: 30, label: "ICICI Bank" },
    { name: "Bank of Baroda", rate: 8.40, minIncome: 15000, maxAge: 70, procFee: "₹8,500 flat", maxTenure: 30, label: "Bank of Baroda" },
    { name: "PNB", rate: 8.45, minIncome: 15000, maxAge: 70, procFee: "Up to 0.35%", maxTenure: 30, label: "Punjab National Bank" },
    { name: "Kotak", rate: 8.70, minIncome: 20000, maxAge: 65, procFee: "Up to 0.5%", maxTenure: 25, label: "Kotak Mahindra Bank" },
    { name: "Axis Bank", rate: 8.75, minIncome: 15000, maxAge: 70, procFee: "Up to 1%", maxTenure: 30, label: "Axis Bank" },
    { name: "Custom", rate: 8.50, minIncome: 0, maxAge: 70, procFee: "–", maxTenure: 30, label: "Custom Rate" },
];

/* ── CIBIL rate adjustments ── */
function rateForCIBIL(baseRate: number, score: number): number {
    if (score >= 800) return baseRate - 0.1;
    if (score >= 750) return baseRate;
    if (score >= 700) return baseRate + 0.35;
    if (score >= 650) return baseRate + 0.75;
    return baseRate + 1.5; // Below 650
}

/* ── LTV by RBI rules ── */
function getLTV(loanAmt: number): { ltv: number; downPct: number; label: string } {
    if (loanAmt <= 30_00_000) return { ltv: 0.90, downPct: 10, label: "Up to ₹30L → 90% LTV" };
    if (loanAmt <= 75_00_000) return { ltv: 0.80, downPct: 20, label: "₹30L–₹75L → 80% LTV" };
    return { ltv: 0.75, downPct: 25, label: "Above ₹75L → 75% LTV" };
}

type CalcMode = "income" | "property" | "cibil" | "coapplicant";

export default function HomeLoanEligibilityCore() {
    const [mode, setMode] = useState<CalcMode>("income");
    const [bankIdx, setBankIdx] = useState(0);

    /* Mode 1: Income-Based */
    const [income, setIncome] = useState(1_00_000);
    const [existingEMI, setExistingEMI] = useState(0);
    const [tenure, setTenure] = useState(20);
    const [customRate, setCustomRate] = useState(8.5);
    const [foirPct, setFoirPct] = useState(50);

    /* Mode 2: Property Value */
    const [propValue, setPropValue] = useState(80_00_000);
    const [propTenure, setPropTenure] = useState(20);

    /* Mode 3: CIBIL */
    const [cibilScore, setCibilScore] = useState(750);
    const [cibilIncome, setCibilIncome] = useState(1_00_000);
    const [cibilExistEMI, setCibilExistEMI] = useState(0);
    const [cibilTenure, setCibilTenure] = useState(20);

    /* Mode 4: Co-Applicant */
    const [primaryIncome, setPrimaryIncome] = useState(80_000);
    const [coIncome, setCoIncome] = useState(50_000);
    const [coExistEMI, setCoExistEMI] = useState(0);
    const [coTenure, setCoTenure] = useState(20);

    const currentBank = BANKS[bankIdx];
    const effectiveRate = bankIdx === BANKS.length - 1 ? customRate : currentBank.rate;

    /* ═══ MODE 1: Income-Based Results ═══ */
    const incomeResult = useMemo(() => {
        const maxEMI = (income * foirPct / 100) - existingEMI;
        if (maxEMI <= 0) return null;
        const maxLoan = maxLoanFromEMI(maxEMI, effectiveRate, tenure);
        const totalAmount = maxEMI * tenure * 12;
        const totalInterest = totalAmount - maxLoan;
        const ltv = getLTV(maxLoan);
        const maxProperty = maxLoan / ltv.ltv;
        const downPayment = maxProperty - maxLoan;
        const foirUsed = ((existingEMI + maxEMI) / income) * 100;
        return { maxEMI, maxLoan, totalAmount, totalInterest, maxProperty, downPayment, ltv, foirUsed };
    }, [income, existingEMI, tenure, effectiveRate, foirPct]);

    /* ═══ MODE 2: Property Value Results ═══ */
    const propResult = useMemo(() => {
        const ltv = getLTV(propValue);
        const loanAmt = propValue * ltv.ltv;
        const downPayment = propValue - loanAmt;
        const emi = calcEMI(loanAmt, effectiveRate, propTenure);
        const totalAmount = emi * propTenure * 12;
        const totalInterest = totalAmount - loanAmt;
        const requiredIncome50 = (emi / 0.50);
        const requiredIncome40 = (emi / 0.40);
        return { loanAmt, downPayment, emi, totalAmount, totalInterest, requiredIncome50, requiredIncome40, ltv };
    }, [propValue, effectiveRate, propTenure]);

    /* ═══ MODE 3: CIBIL Impact Results ═══ */
    const cibilResult = useMemo(() => {
        const scores = [800, 750, 700, 650, 600];
        const maxEMI = (cibilIncome * 0.50) - cibilExistEMI;
        if (maxEMI <= 0) return null;
        const rows = scores.map(s => {
            const adjRate = rateForCIBIL(effectiveRate, s);
            const loan = maxLoanFromEMI(maxEMI, adjRate, cibilTenure);
            const emi = calcEMI(loan, adjRate, cibilTenure);
            const totalInt = (emi * cibilTenure * 12) - loan;
            return { score: s, rate: adjRate, loan, emi, totalInt };
        });
        const userRate = rateForCIBIL(effectiveRate, cibilScore);
        const userLoan = maxLoanFromEMI(maxEMI, userRate, cibilTenure);
        const userEMI = calcEMI(userLoan, userRate, cibilTenure);
        const bestLoan = rows[0].loan;
        const diff = bestLoan - userLoan;
        return { rows, userRate, userLoan, userEMI, maxEMI, diff, bestLoan };
    }, [cibilIncome, cibilExistEMI, effectiveRate, cibilTenure, cibilScore]);

    /* ═══ MODE 4: Co-Applicant Results ═══ */
    const coResult = useMemo(() => {
        // Solo
        const soloMaxEMI = (primaryIncome * 0.50) - coExistEMI;
        const soloLoan = soloMaxEMI > 0 ? maxLoanFromEMI(soloMaxEMI, effectiveRate, coTenure) : 0;
        // Combined
        const combinedIncome = primaryIncome + coIncome;
        const combinedMaxEMI = (combinedIncome * 0.50) - coExistEMI;
        const combinedLoan = combinedMaxEMI > 0 ? maxLoanFromEMI(combinedMaxEMI, effectiveRate, coTenure) : 0;
        const boost = soloLoan > 0 ? ((combinedLoan - soloLoan) / soloLoan * 100) : 0;
        const soloLTV = getLTV(soloLoan);
        const combLTV = getLTV(combinedLoan);
        return {
            soloMaxEMI, soloLoan, soloProperty: soloLoan / soloLTV.ltv,
            combinedMaxEMI, combinedLoan, combinedProperty: combinedLoan / combLTV.ltv,
            boost, soloLTV, combLTV,
        };
    }, [primaryIncome, coIncome, coExistEMI, effectiveRate, coTenure]);

    const tabStyle = (m: CalcMode) => mode === m
        ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" }
        : {};

    /* ── FOIR Gauge helper ── */
    const FoirGauge = ({ pct }: { pct: number }) => {
        const clampedPct = Math.min(pct, 100);
        const color = clampedPct <= 40 ? "#16a34a" : clampedPct <= 50 ? "#d4620a" : "#dc2626";
        const label = clampedPct <= 40 ? "Healthy" : clampedPct <= 50 ? "Moderate" : "High Risk";
        return (
            <div style={{ marginTop: "12px", marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 600, marginBottom: "4px" }}>
                    <span>FOIR: {clampedPct.toFixed(1)}%</span>
                    <span style={{ color }}>{label}</span>
                </div>
                <div style={{ width: "100%", height: "10px", borderRadius: "5px", background: "var(--surface-2, #2a2a2a)", overflow: "hidden" }}>
                    <div style={{ width: `${clampedPct}%`, height: "100%", borderRadius: "5px", background: `linear-gradient(90deg, #16a34a, ${color})`, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    <span>0%</span><span>40%</span><span>50%</span><span>60%</span><span>100%</span>
                </div>
            </div>
        );
    };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">🏠 Home Loan Eligibility Calculator</h3>

            {/* Mode Tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([
                    ["income", "💰 Income-Based"],
                    ["property", "🏘️ Property Check"],
                    ["cibil", "📊 CIBIL Impact"],
                    ["coapplicant", "👥 Co-Applicant"],
                ] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Bank Selector (shared) */}
            <div style={{ display: "grid", gridTemplateColumns: bankIdx === BANKS.length - 1 ? "1fr 1fr" : "1fr", gap: "12px", marginBottom: "16px" }}>
                <div className="con-input">
                    <label className="con-input__label">Select Bank</label>
                    <select className="con-input__field" value={bankIdx} onChange={(e) => setBankIdx(+e.target.value)}>
                        {BANKS.map((b, i) => (
                            <option key={i} value={i}>{b.label} {i < BANKS.length - 1 ? `(${b.rate}%)` : ""}</option>
                        ))}
                    </select>
                </div>
                {bankIdx === BANKS.length - 1 && (
                    <div className="con-input">
                        <label className="con-input__label">Interest Rate <span className="con-input__unit">(% p.a.)</span></label>
                        <input type="number" className="con-input__field" value={customRate} onChange={(e) => setCustomRate(+e.target.value)} min={5} max={18} step={0.1} />
                    </div>
                )}
            </div>

            {/* ═══════ MODE 1: INCOME-BASED ═══════ */}
            {mode === "income" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Monthly Gross Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={income} onChange={(e) => setIncome(+e.target.value)} min={10000} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(income)} /month</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Existing Monthly EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={existingEMI} onChange={(e) => setExistingEMI(+e.target.value)} min={0} step={1000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Car, personal, credit card EMIs</div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Desired Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={tenure} onChange={(e) => setTenure(+e.target.value)} min={5} max={30} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">FOIR Limit <span className="con-input__unit">(%)</span></label>
                            <select className="con-input__field" value={foirPct} onChange={(e) => setFoirPct(+e.target.value)}>
                                <option value={40}>Conservative (40%)</option>
                                <option value={50}>Standard (50%)</option>
                                <option value={55}>Aggressive (55%)</option>
                                <option value={60}>Maximum (60%)</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {[10, 15, 20, 25, 30].map((y) => (
                            <button key={y} className="calc-tab-btn" onClick={() => setTenure(y)} style={tenure === y ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>
                                {y} Years
                            </button>
                        ))}
                    </div>

                    {incomeResult && (
                        <div className="con-calc__results">
                            <h4>Your Home Loan Eligibility</h4>
                            <FoirGauge pct={incomeResult.foirUsed} />
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Affordable EMI ({foirPct}% FOIR)</span><span className="con-result-row__value">{formatINR(incomeResult.maxEMI)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Eligible</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.25rem" }}>{formatINR(incomeResult.maxLoan)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Total Interest Cost</span><span className="con-result-row__value">{formatINR(incomeResult.totalInterest)}</span></div>

                            <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                                <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Property You Can Buy</div>
                            </div>

                            <div className="con-result-row"><span className="con-result-row__label">RBI LTV Applied</span><span className="con-result-row__value">{incomeResult.ltv.label}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Max Property Value</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(incomeResult.maxProperty)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Min Down Payment ({incomeResult.ltv.downPct}%)</span><span className="con-result-row__value">{formatINR(incomeResult.downPayment)}</span></div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>How we calculated:</strong> With {formatINR(income)} monthly income and {foirPct}% FOIR cap, your max EMI capacity is {formatINR(income * foirPct / 100)}. After deducting existing EMIs of {formatINR(existingEMI)}, available EMI = <strong>{formatINR(incomeResult.maxEMI)}/month</strong>. At {effectiveRate}% for {tenure} years, this supports a loan of <strong>{formatINR(incomeResult.maxLoan)}</strong>.
                            </div>
                        </div>
                    )}
                    {!incomeResult && existingEMI > 0 && (
                        <div className="explanation__highlight" style={{ background: "rgba(220,38,38,0.1)", borderColor: "#dc2626" }}>
                            <strong>⚠️ FOIR Exceeded:</strong> Your existing EMIs of {formatINR(existingEMI)} already exceed {foirPct}% of your income ({formatINR(income * foirPct / 100)}). Clear existing loans or increase your income to become eligible.
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE 2: PROPERTY VALUE CHECK ═══════ */}
            {mode === "property" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Property Value <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={propValue} onChange={(e) => setPropValue(+e.target.value)} min={500000} step={100000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(propValue)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Loan Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={propTenure} onChange={(e) => setPropTenure(+e.target.value)} min={5} max={30} />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                        {[30_00_000, 50_00_000, 75_00_000, 1_00_00_000, 1_50_00_000, 2_00_00_000].map((v) => (
                            <button key={v} className="calc-tab-btn" onClick={() => setPropValue(v)} style={propValue === v ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a", fontSize: "0.78rem" } : { fontSize: "0.78rem" }}>
                                ₹{lakhLabel(v)}
                            </button>
                        ))}
                    </div>

                    <div className="con-calc__results">
                        <h4>What You Need for This Property</h4>
                        <div className="con-result-row"><span className="con-result-row__label">Property Value</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(propValue)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">RBI LTV Applied</span><span className="con-result-row__value">{propResult.ltv.label}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Maximum Loan Amount</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(propResult.loanAmt)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Down Payment Required ({propResult.ltv.downPct}%)</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(propResult.downPayment)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Monthly EMI</span><span className="con-result-row__value" style={{ fontWeight: 700 }}>{formatINR(propResult.emi)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Total Interest Over {propTenure} Years</span><span className="con-result-row__value">{formatINR(propResult.totalInterest)}</span></div>

                        <div style={{ margin: "12px 0", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", fontWeight: 700, marginBottom: "8px", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Minimum Income Required</div>
                        </div>

                        <div className="con-result-row"><span className="con-result-row__label">At 50% FOIR (Standard)</span><span className="con-result-row__value" style={{ fontWeight: 700, color: "#16a34a" }}>{formatINR(propResult.requiredIncome50)} /month</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">At 40% FOIR (Conservative)</span><span className="con-result-row__value">{formatINR(propResult.requiredIncome40)} /month</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Key Insight:</strong> For a {formatINR(propValue)} property, you need a minimum down payment of <strong>{formatINR(propResult.downPayment)}</strong> and a monthly income of at least <strong>{formatINR(propResult.requiredIncome50)}</strong> (assuming no existing EMIs). Your monthly EMI will be <strong>{formatINR(propResult.emi)}</strong> at {effectiveRate}% for {propTenure} years.
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE 3: CIBIL IMPACT ═══════ */}
            {mode === "cibil" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Your CIBIL Score</label>
                            <input type="number" className="con-input__field" value={cibilScore} onChange={(e) => setCibilScore(+e.target.value)} min={300} max={900} step={10} />
                            <div style={{ fontSize: "0.75rem", color: cibilScore >= 750 ? "#16a34a" : cibilScore >= 700 ? "#d4620a" : "#dc2626", marginTop: "4px", fontWeight: 600 }}>
                                {cibilScore >= 800 ? "Excellent" : cibilScore >= 750 ? "Good" : cibilScore >= 700 ? "Fair" : cibilScore >= 650 ? "Below Average" : "Poor"}
                            </div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Monthly Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={cibilIncome} onChange={(e) => setCibilIncome(+e.target.value)} min={10000} step={10000} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Existing EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={cibilExistEMI} onChange={(e) => setCibilExistEMI(+e.target.value)} min={0} step={1000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={cibilTenure} onChange={(e) => setCibilTenure(+e.target.value)} min={5} max={30} />
                        </div>
                    </div>

                    {cibilResult && (
                        <div className="con-calc__results">
                            <h4>CIBIL Score Impact on Eligibility</h4>
                            <div className="con-result-row"><span className="con-result-row__label">Your Score: {cibilScore}</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 700 }}>Rate: {cibilResult.userRate.toFixed(2)}%</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Your Eligible Loan</span><span className="con-result-row__value" style={{ color: "#d4620a", fontWeight: 800, fontSize: "1.15rem" }}>{formatINR(cibilResult.userLoan)}</span></div>
                            {cibilResult.diff > 0 && (
                                <div className="con-result-row"><span className="con-result-row__label">Extra Eligible with 800+ Score</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>+{formatINR(cibilResult.diff)}</span></div>
                            )}

                            <div style={{ overflowX: "auto", marginTop: "16px" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead>
                                        <tr style={{ background: "#d4620a", color: "#fff" }}>
                                            <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>CIBIL Score</th>
                                            <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Interest Rate</th>
                                            <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Max Loan</th>
                                            <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Monthly EMI</th>
                                            <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase" }}>Total Interest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cibilResult.rows.map((r) => (
                                            <tr key={r.score} style={r.score === (cibilScore >= 800 ? 800 : cibilScore >= 750 ? 750 : cibilScore >= 700 ? 700 : cibilScore >= 650 ? 650 : 600) ? { background: "rgba(212,98,10,0.1)", fontWeight: 700 } : r.score % 100 === 0 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.score}+</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{r.rate.toFixed(2)}%</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{formatINR(r.loan)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.emi)}</td>
                                                <td style={{ padding: "8px 12px", textAlign: "right", borderBottom: "1px solid var(--border)" }}>{formatINR(r.totalInt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                                <strong>Key Insight:</strong> With a CIBIL score of 800+ vs 650, you can borrow <strong>{formatINR(cibilResult.rows[0].loan - cibilResult.rows[3].loan)} MORE</strong> and save <strong>{formatINR(cibilResult.rows[3].totalInt - cibilResult.rows[0].totalInt)}</strong> in total interest. Improving your score from {cibilScore} to 800+ could unlock an additional <strong>{formatINR(cibilResult.diff)}</strong> in loan amount.
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE 4: CO-APPLICANT ═══════ */}
            {mode === "coapplicant" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Your Monthly Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={primaryIncome} onChange={(e) => setPrimaryIncome(+e.target.value)} min={10000} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>{lakhLabel(primaryIncome)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Co-Applicant Income <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={coIncome} onChange={(e) => setCoIncome(+e.target.value)} min={0} step={10000} />
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Spouse, parent, or sibling</div>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Combined Existing EMIs <span className="con-input__unit">(₹)</span></label>
                            <input type="number" className="con-input__field" value={coExistEMI} onChange={(e) => setCoExistEMI(+e.target.value)} min={0} step={1000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Desired Tenure <span className="con-input__unit">(Years)</span></label>
                            <input type="number" className="con-input__field" value={coTenure} onChange={(e) => setCoTenure(+e.target.value)} min={5} max={30} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>Solo vs Co-Applicant Comparison</h4>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                            <div style={{ padding: "16px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-1, #1a1a1a)" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", letterSpacing: "0.5px" }}>Solo Application</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary, #fff)" }}>{formatINR(coResult.soloLoan)}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Max EMI: {formatINR(coResult.soloMaxEMI)}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Property: {formatINR(coResult.soloProperty)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "10px", border: "2px solid #d4620a", background: "rgba(212,98,10,0.05)" }}>
                                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#d4620a", marginBottom: "8px", letterSpacing: "0.5px" }}>With Co-Applicant ✓</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#d4620a" }}>{formatINR(coResult.combinedLoan)}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>Max EMI: {formatINR(coResult.combinedMaxEMI)}</div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Property: {formatINR(coResult.combinedProperty)}</div>
                            </div>
                        </div>

                        <div className="con-result-row">
                            <span className="con-result-row__label">Eligibility Boost</span>
                            <span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 800, fontSize: "1.15rem" }}>+{coResult.boost.toFixed(1)}%</span>
                        </div>
                        <div className="con-result-row">
                            <span className="con-result-row__label">Additional Loan Unlocked</span>
                            <span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>+{formatINR(coResult.combinedLoan - coResult.soloLoan)}</span>
                        </div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Pro Tip:</strong> Adding a co-applicant with {formatINR(coIncome)} monthly income boosts your loan eligibility by <strong>{coResult.boost.toFixed(1)}%</strong> — from {formatINR(coResult.soloLoan)} to <strong>{formatINR(coResult.combinedLoan)}</strong>. If the co-applicant is a <strong>female</strong>, many banks offer an additional 0.05% interest concession, and you may save 1–2% on stamp duty in states like Delhi, Rajasthan, and UP.
                        </div>
                    </div>
                </>
            )}

            {/* Bank Info Card */}
            {bankIdx < BANKS.length - 1 && (
                <div style={{ marginTop: "16px", padding: "14px 18px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--surface-1, #1a1a1a)", fontSize: "0.82rem" }}>
                    <div style={{ fontWeight: 700, marginBottom: "6px" }}>📋 {currentBank.label} — Eligibility Snapshot</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", color: "var(--text-muted)" }}>
                        <span>Interest Rate: <strong style={{ color: "var(--text-primary, #fff)" }}>{currentBank.rate}% p.a.</strong></span>
                        <span>Max Age: <strong style={{ color: "var(--text-primary, #fff)" }}>{currentBank.maxAge} years</strong></span>
                        <span>Min Income: <strong style={{ color: "var(--text-primary, #fff)" }}>{formatINR(currentBank.minIncome)}/mo</strong></span>
                        <span>Processing Fee: <strong style={{ color: "var(--text-primary, #fff)" }}>{currentBank.procFee}</strong></span>
                        <span>Max Tenure: <strong style={{ color: "var(--text-primary, #fff)" }}>{currentBank.maxTenure} years</strong></span>
                    </div>
                </div>
            )}
        </div>
    );
}

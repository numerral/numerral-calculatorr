"use client";
import { useState } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const pv = (rate: number, nper: number, pmt: number): number => {
    if (rate === 0) return pmt * nper;
    const r = rate / 100;
    return pmt * ((1 - Math.pow(1 + r, -nper)) / r);
};

type Mode = "income" | "needs" | "quick";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "income", icon: "📊", label: "Income Replacement" },
    { key: "needs", icon: "🎯", label: "Need-Based" },
    { key: "quick", icon: "⚡", label: "Quick Estimate" },
];

/* ─── Sub: Slider Row ─── */
function SliderRow({ label, value, set, min, max, step, suffix }: {
    label: string; value: number; set: (v: number) => void;
    min: number; max: number; step: number; suffix?: string;
}) {
    return (
        <div style={{ marginBottom: "var(--s-4)" }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginBottom: 4, fontSize: "0.92rem" }}>
                <span>{label}</span>
                <span style={{ color: "var(--c-primary)" }}>{suffix === "%" ? `${value}%` : suffix === "yrs" ? `${value} yrs` : suffix === "num" ? `${value}` : fmt(value)}</span>
            </label>
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                <span>{suffix === "%" ? `${min}%` : suffix === "yrs" ? `${min} yrs` : suffix === "num" ? `${min}` : fmt(min)}</span>
                <span>{suffix === "%" ? `${max}%` : suffix === "yrs" ? `${max} yrs` : suffix === "num" ? `${max}` : fmt(max)}</span>
            </div>
        </div>
    );
}

/* ─── Sub: Number Field ─── */
function NumField({ label, value, set, prefix }: {
    label: string; value: number; set: (v: number) => void; prefix?: string;
}) {
    return (
        <div style={{ marginBottom: "var(--s-3)" }}>
            <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 4 }}>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {prefix && <span style={{ fontWeight: 600, color: "var(--c-text-muted)" }}>{prefix}</span>}
                <input type="number" value={value || ""} onChange={e => set(Number(e.target.value) || 0)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--c-border)", borderRadius: 8, fontSize: "0.95rem" }} />
            </div>
        </div>
    );
}

/* ═══════════ MODE 1: INCOME REPLACEMENT ═══════════ */
function IncomeMode() {
    const [age, setAge] = useState(30);
    const [retAge, setRetAge] = useState(60);
    const [income, setIncome] = useState(12_00_000);
    const [expenses, setExpenses] = useState(3_00_000);
    const [inflation, setInflation] = useState(6);
    const [returnRate, setReturnRate] = useState(8);
    const [existingCover, setExistingCover] = useState(0);
    const [existingSavings, setExistingSavings] = useState(0);

    const years = Math.max(retAge - age, 1);
    const netContribution = Math.max(income - expenses, 0);
    const realRate = ((1 + returnRate / 100) / (1 + inflation / 100) - 1) * 100;
    const requiredCorpus = pv(realRate, years, netContribution);
    const gap = Math.max(requiredCorpus - existingCover - existingSavings, 0);

    const assessment = gap <= 0 ? "adequate" : gap < requiredCorpus * 0.3 ? "moderate" : "underinsured";
    const assessColor = assessment === "adequate" ? "#16a34a" : assessment === "moderate" ? "#d97706" : "#dc2626";
    const assessLabel = assessment === "adequate" ? "✅ Adequately Covered" : assessment === "moderate" ? "⚠️ Moderate Gap" : "🚨 Significantly Underinsured";

    return (
        <>
            <SliderRow label="Current Age" value={age} set={setAge} min={18} max={65} step={1} suffix="yrs" />
            <SliderRow label="Planned Retirement Age" value={retAge} set={setRetAge} min={40} max={75} step={1} suffix="yrs" />
            <SliderRow label="Annual Income" value={income} set={setIncome} min={1_00_000} max={5_00_00_000} step={50_000} />
            <SliderRow label="Annual Personal Expenses" value={expenses} set={setExpenses} min={0} max={3_00_00_000} step={25_000} />
            <SliderRow label="Expected Inflation Rate" value={inflation} set={setInflation} min={3} max={12} step={0.5} suffix="%" />
            <SliderRow label="Expected Investment Return" value={returnRate} set={setReturnRate} min={4} max={15} step={0.5} suffix="%" />
            <SliderRow label="Existing Life Insurance Cover" value={existingCover} set={setExistingCover} min={0} max={10_00_00_000} step={1_00_000} />
            <SliderRow label="Existing Savings & Investments" value={existingSavings} set={setExistingSavings} min={0} max={10_00_00_000} step={1_00_000} />

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>Required Life Cover</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--c-text)" }}>{fmt(requiredCorpus)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--c-text-muted)", marginTop: 4 }}>Total PV of future income contribution</div>
                </div>

                {(existingCover > 0 || existingSavings > 0) && (
                    <div style={{ marginTop: "var(--s-4)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: assessColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Insurance Gap</div>
                        <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: assessColor }}>{fmt(gap)}</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: assessColor, marginTop: 4 }}>{assessLabel}</div>
                    </div>
                )}

                <table style={{ width: "100%", marginTop: "var(--s-4)", fontSize: "0.88rem" }}>
                    <tbody>
                        <tr><td style={{ padding: "6px 0", color: "var(--c-text-muted)" }}>Working Years Remaining</td><td style={{ textAlign: "right", fontWeight: 600 }}>{years} years</td></tr>
                        <tr><td style={{ padding: "6px 0", color: "var(--c-text-muted)" }}>Net Annual Contribution to Family</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(netContribution)}/yr</td></tr>
                        <tr><td style={{ padding: "6px 0", color: "var(--c-text-muted)" }}>Real Discount Rate (Return − Inflation)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{realRate.toFixed(2)}%</td></tr>
                        <tr><td style={{ padding: "6px 0", color: "var(--c-text-muted)" }}>Existing Cover + Savings</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(existingCover + existingSavings)}</td></tr>
                    </tbody>
                </table>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--c-bg)", borderRadius: 8, fontSize: "0.82rem", color: "var(--c-text-muted)" }}>
                    <strong>Formula:</strong> PV = Net Annual Contribution × [(1 − (1 + r)<sup>−n</sup>) / r], where r = real discount rate, n = working years
                </div>
            </div>
        </>
    );
}

/* ═══════════ MODE 2: NEED-BASED ═══════════ */
function NeedsMode() {
    const [homeLoan, setHomeLoan] = useState(25_00_000);
    const [carLoan, setCarLoan] = useState(0);
    const [personalLoan, setPersonalLoan] = useState(0);
    const [creditCard, setCreditCard] = useState(0);
    const [eduFund, setEduFund] = useState(20_00_000);
    const [marriageFund, setMarriageFund] = useState(15_00_000);
    const [annualHousehold, setAnnualHousehold] = useState(6_00_000);
    const [yearsExpenses, setYearsExpenses] = useState(20);
    const [emergency, setEmergency] = useState(3_00_000);
    const [existingCover, setExistingCover] = useState(0);
    const [existingSavings, setExistingSavings] = useState(5_00_000);
    const [inflation, setInflation] = useState(6);

    const totalLoans = homeLoan + carLoan + personalLoan + creditCard;
    const totalGoals = eduFund + marriageFund;
    const livingCorpus = annualHousehold * yearsExpenses * (1 + inflation / 100 * yearsExpenses / 2); // simplified inflation adjustment
    const totalNeeds = totalLoans + totalGoals + livingCorpus + emergency;
    const existingTotal = existingCover + existingSavings;
    const gap = Math.max(totalNeeds - existingTotal, 0);

    const assessment = gap <= 0 ? "adequate" : gap < totalNeeds * 0.3 ? "moderate" : "underinsured";
    const assessColor = assessment === "adequate" ? "#16a34a" : assessment === "moderate" ? "#d97706" : "#dc2626";
    const assessLabel = assessment === "adequate" ? "✅ Adequately Covered" : assessment === "moderate" ? "⚠️ Moderate Gap — Consider Top-up" : "🚨 Significant Gap — Urgent Action Needed";

    return (
        <>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "var(--s-3)", color: "var(--c-primary)" }}>Outstanding Liabilities</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 var(--s-3)" }}>
                <NumField label="Home Loan (₹)" value={homeLoan} set={setHomeLoan} prefix="₹" />
                <NumField label="Car Loan (₹)" value={carLoan} set={setCarLoan} prefix="₹" />
                <NumField label="Personal Loan (₹)" value={personalLoan} set={setPersonalLoan} prefix="₹" />
                <NumField label="Credit Card Debt (₹)" value={creditCard} set={setCreditCard} prefix="₹" />
            </div>

            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "var(--s-4) 0 var(--s-3)", color: "var(--c-primary)" }}>Future Financial Goals</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 var(--s-3)" }}>
                <NumField label="Children's Education (₹)" value={eduFund} set={setEduFund} prefix="₹" />
                <NumField label="Children's Marriage (₹)" value={marriageFund} set={setMarriageFund} prefix="₹" />
            </div>

            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "var(--s-4) 0 var(--s-3)", color: "var(--c-primary)" }}>Living Expenses & Emergency</h4>
            <NumField label="Annual Household Expenses (₹)" value={annualHousehold} set={setAnnualHousehold} prefix="₹" />
            <SliderRow label="Years of Expenses to Cover" value={yearsExpenses} set={setYearsExpenses} min={5} max={40} step={1} suffix="yrs" />
            <NumField label="Emergency Fund (₹)" value={emergency} set={setEmergency} prefix="₹" />
            <SliderRow label="Expected Inflation Rate" value={inflation} set={setInflation} min={3} max={12} step={0.5} suffix="%" />

            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "var(--s-4) 0 var(--s-3)", color: "var(--c-primary)" }}>Existing Coverage & Assets</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 var(--s-3)" }}>
                <NumField label="Existing Life Cover (₹)" value={existingCover} set={setExistingCover} prefix="₹" />
                <NumField label="Savings & Investments (₹)" value={existingSavings} set={setExistingSavings} prefix="₹" />
            </div>

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: assessColor, textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>Insurance Gap Analysis</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: assessColor }}>{fmt(gap)}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: assessColor, marginTop: 4 }}>{assessLabel}</div>
                </div>

                <table style={{ width: "100%", marginTop: "var(--s-4)", fontSize: "0.88rem" }}>
                    <tbody>
                        <tr style={{ borderBottom: "1px solid var(--c-border)" }}><td style={{ padding: "8px 0", fontWeight: 600 }}>Total Liabilities</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(totalLoans)}</td></tr>
                        <tr style={{ borderBottom: "1px solid var(--c-border)" }}><td style={{ padding: "8px 0", fontWeight: 600 }}>Future Goals (Education + Marriage)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(totalGoals)}</td></tr>
                        <tr style={{ borderBottom: "1px solid var(--c-border)" }}><td style={{ padding: "8px 0", fontWeight: 600 }}>Living Expenses Corpus ({yearsExpenses} yrs, inflation-adj.)</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(livingCorpus)}</td></tr>
                        <tr style={{ borderBottom: "1px solid var(--c-border)" }}><td style={{ padding: "8px 0", fontWeight: 600 }}>Emergency Fund</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(emergency)}</td></tr>
                        <tr style={{ borderBottom: "2px solid var(--c-primary)" }}><td style={{ padding: "8px 0", fontWeight: 700 }}>Total Requirement</td><td style={{ textAlign: "right", fontWeight: 700, color: "var(--c-primary)" }}>{fmt(totalNeeds)}</td></tr>
                        <tr><td style={{ padding: "8px 0", fontWeight: 600 }}>Less: Existing Cover + Savings</td><td style={{ textAlign: "right", fontWeight: 600, color: "#16a34a" }}>− {fmt(existingTotal)}</td></tr>
                        <tr style={{ borderTop: "2px solid " + assessColor }}><td style={{ padding: "8px 0", fontWeight: 700 }}>Additional Cover Needed</td><td style={{ textAlign: "right", fontWeight: 700, color: assessColor }}>{fmt(gap)}</td></tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════════ MODE 3: QUICK ESTIMATE ═══════════ */
const AGE_GROUPS = [
    { label: "20–30 years", min: 20, max: 30, multiplier: 20, multiplierHigh: 25 },
    { label: "30–40 years", min: 30, max: 40, multiplier: 15, multiplierHigh: 20 },
    { label: "40–50 years", min: 40, max: 50, multiplier: 10, multiplierHigh: 15 },
    { label: "50–60 years", min: 50, max: 60, multiplier: 8, multiplierHigh: 10 },
];

function QuickMode() {
    const [income, setIncome] = useState(12_00_000);
    const [ageGroup, setAgeGroup] = useState(1);
    const [dependents, setDependents] = useState(2);
    const [loans, setLoans] = useState(25_00_000);

    const group = AGE_GROUPS[ageGroup];
    const depBonus = dependents >= 3 ? 3 : dependents >= 2 ? 2 : dependents >= 1 ? 1 : 0;
    const effectiveMultiplier = group.multiplier + depBonus;
    const recommended = income * effectiveMultiplier + loans;

    const compare10 = income * 10 + loans;
    const compare15 = income * 15 + loans;
    const compare20 = income * 20 + loans;

    return (
        <>
            <SliderRow label="Annual Income" value={income} set={setIncome} min={1_00_000} max={5_00_00_000} step={50_000} />

            <div style={{ marginBottom: "var(--s-4)" }}>
                <label style={{ fontWeight: 600, fontSize: "0.92rem", display: "block", marginBottom: 8 }}>Age Group</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                    {AGE_GROUPS.map((g, i) => (
                        <button key={i} onClick={() => setAgeGroup(i)}
                            style={{
                                padding: "10px 8px", borderRadius: 8, border: i === ageGroup ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                                background: i === ageGroup ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                                fontWeight: i === ageGroup ? 700 : 500, fontSize: "0.82rem", cursor: "pointer",
                                color: i === ageGroup ? "var(--c-primary)" : "var(--c-text)",
                            }}>
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            <SliderRow label="Number of Dependents" value={dependents} set={setDependents} min={0} max={5} step={1} suffix="num" />
            <SliderRow label="Outstanding Loans (Total)" value={loans} set={setLoans} min={0} max={5_00_00_000} step={1_00_000} />

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-5)", marginTop: "var(--s-4)" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>Recommended Life Cover</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--c-text)" }}>{fmt(recommended)}</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--c-text-muted)", marginTop: 4 }}>{effectiveMultiplier}× annual income + outstanding loans</div>
                </div>

                <div style={{ marginTop: "var(--s-3)", padding: "10px 14px", background: "var(--c-bg)", borderRadius: 8, fontSize: "0.82rem", color: "var(--c-text-muted)" }}>
                    <strong>Based on:</strong> Age group {group.label} → base {group.multiplier}×{depBonus > 0 ? ` + ${depBonus}× for ${dependents} dependents` : ""} = {effectiveMultiplier}× multiplier
                </div>

                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginTop: "var(--s-4)", marginBottom: "var(--s-2)" }}>Coverage Comparison</h4>
                <table style={{ width: "100%", fontSize: "0.88rem" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 0" }}>Multiplier</th>
                        <th style={{ textAlign: "right", padding: "8px 0" }}>Cover Amount</th>
                        <th style={{ textAlign: "center", padding: "8px 0" }}>Suitability</th>
                    </tr></thead>
                    <tbody>
                        <tr><td style={{ padding: "6px 0" }}>10× Income + Loans</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(compare10)}</td><td style={{ textAlign: "center", color: "#d97706" }}>⚠️ Minimum</td></tr>
                        <tr><td style={{ padding: "6px 0" }}>15× Income + Loans</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(compare15)}</td><td style={{ textAlign: "center", color: "#2563eb" }}>🔵 Moderate</td></tr>
                        <tr><td style={{ padding: "6px 0" }}>20× Income + Loans</td><td style={{ textAlign: "right", fontWeight: 600 }}>{fmt(compare20)}</td><td style={{ textAlign: "center", color: "#16a34a" }}>✅ Comprehensive</td></tr>
                        <tr style={{ background: "var(--c-primary-bg, #e8f0fe)" }}><td style={{ padding: "6px 0", fontWeight: 700 }}>{effectiveMultiplier}× (Recommended)</td><td style={{ textAlign: "right", fontWeight: 700, color: "var(--c-primary)" }}>{fmt(recommended)}</td><td style={{ textAlign: "center", fontWeight: 700 }}>⭐ Best Fit</td></tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function HLVCalculatorIndiaCore() {
    const [mode, setMode] = useState<Mode>("income");

    return (
        <div style={{ background: "var(--c-card-bg, #fff)", borderRadius: 16, border: "1px solid var(--c-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--c-border)", background: "linear-gradient(135deg, var(--c-primary-bg, #e8f0fe), var(--c-surface))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🛡️ Human Life Value Calculator</h2>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid var(--c-border)", overflow: "auto" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                        style={{
                            flex: 1, padding: "12px 8px", border: "none", cursor: "pointer",
                            borderBottom: mode === m.key ? "3px solid var(--c-primary)" : "3px solid transparent",
                            background: mode === m.key ? "var(--c-primary-bg, #e8f0fe)" : "transparent",
                            fontWeight: mode === m.key ? 700 : 500, fontSize: "0.85rem",
                            color: mode === m.key ? "var(--c-primary)" : "var(--c-text-muted)",
                            whiteSpace: "nowrap",
                        }}>
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: "var(--s-5)" }}>
                {mode === "income" && <IncomeMode />}
                {mode === "needs" && <NeedsMode />}
                {mode === "quick" && <QuickMode />}
            </div>
        </div>
    );
}

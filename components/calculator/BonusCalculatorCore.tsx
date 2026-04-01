"use client";
import { useState } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

type Mode = "calculator" | "employer" | "compliance" | "surplus";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "Bonus Calculator" },
    { key: "employer", icon: "🏢", label: "Employer Cost" },
    { key: "compliance", icon: "📋", label: "Compliance Guide" },
    { key: "surplus", icon: "📊", label: "Surplus Calculator" },
];

function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "" ? `${value.toLocaleString("en-IN")}` : fmt(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min || 0} max={max || 50000} step={step || 500} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

/* ═══════ MODE 1: STATUTORY BONUS CALCULATOR ═══════ */
function CalculatorMode() {
    const [basicDA, setBasicDA] = useState(15000);
    const [bonusRate, setBonusRate] = useState(8.33);
    const [daysWorked, setDaysWorked] = useState(365);
    const [totalDays, setTotalDays] = useState(365);

    const SALARY_CEILING = 21000;
    const CALC_CEILING = 7000;
    const isEligible = basicDA <= SALARY_CEILING;
    const calcBase = Math.min(basicDA, CALC_CEILING);
    const annualBase = calcBase * 12;
    const proportionFactor = daysWorked / totalDays;
    const bonusAmount = isEligible ? Math.round(annualBase * (bonusRate / 100) * proportionFactor) : 0;
    const monthlyBonus = isEligible ? Math.round(bonusAmount / 12) : 0;
    const minBonus = isEligible ? Math.round(annualBase * 0.0833 * proportionFactor) : 0;
    const maxBonus = isEligible ? Math.round(annualBase * 0.20 * proportionFactor) : 0;

    return (
        <>
            {!isEligible && (
                <div style={{ background: "#fee2e2", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                    <strong style={{ color: "#dc2626" }}>⚠️ Not Eligible:</strong> Salary (Basic + DA) exceeds ₹21,000/month ceiling. Statutory bonus under Payment of Bonus Act does not apply.
                </div>
            )}

            <InputRow label="Basic + DA (Monthly)" value={basicDA} set={setBasicDA} max={30000} step={500} min={1000}
                hint={`Eligibility ceiling: ₹21,000/month. Calculation ceiling: ₹7,000/month. ${basicDA > CALC_CEILING ? `Bonus calculated on ₹7,000 (not ₹${basicDA.toLocaleString("en-IN")})` : "Bonus calculated on actual salary"}`} />

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Bonus Rate</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {[8.33, 10, 12, 15, 18, 20].map(r => (
                        <button key={r} onClick={() => setBonusRate(r)} style={{
                            padding: "8px 16px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: bonusRate === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: bonusRate === r ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: bonusRate === r ? 700 : 500,
                            color: bonusRate === r ? "var(--n-primary)" : "var(--n-text)",
                        }}>{r}%</button>
                    ))}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 4 }}>Minimum: 8.33% (mandatory) | Maximum: 20% (based on allocable surplus)</div>
            </div>

            <InputRow label="Days Worked" value={daysWorked} set={setDaysWorked} max={366} step={1} min={1} suffix=""
                hint={`Must work ≥ 30 days for eligibility. ${daysWorked < 30 ? "⚠️ Below 30-day threshold!" : `Proportionate: ${(proportionFactor * 100).toFixed(1)}%`}`} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isEligible ? "#16a34a" : "#dc2626", textTransform: "uppercase", letterSpacing: 1 }}>
                        Annual Statutory Bonus
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: isEligible ? "#16a34a" : "#dc2626" }}>
                        {isEligible ? fmt(bonusAmount) : "Not Eligible"}
                    </div>
                    {isEligible && <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>Monthly equivalent: {fmt(monthlyBonus)}</div>}
                </div>
                {isEligible && (
                    <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                        <tbody>
                            {[
                                ["Basic + DA (Monthly)", fmt(basicDA)],
                                ["Calculation Base", fmt(calcBase) + "/month"],
                                ["Annual Base (12 months)", fmt(annualBase)],
                                [`Bonus @ ${bonusRate}%`, fmt(bonusAmount)],
                                [`Proportionate Factor`, `${daysWorked}/${totalDays} (${(proportionFactor * 100).toFixed(1)}%)`],
                                ["Minimum Bonus (8.33%)", fmt(minBonus)],
                                ["Maximum Bonus (20%)", fmt(maxBonus)],
                            ].map(([l, v], i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                    <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                    <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i === 3 ? 700 : 500, color: i === 3 ? "#16a34a" : undefined }}>{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: EMPLOYER COST ESTIMATOR ═══════ */
function EmployerMode() {
    const [numEmployees, setNumEmployees] = useState(50);
    const [avgBasicDA, setAvgBasicDA] = useState(12000);
    const [bonusRate, setBonusRate] = useState(8.33);

    const calcBase = Math.min(avgBasicDA, 7000);
    const perEmployeeAnnual = Math.round(calcBase * 12 * (bonusRate / 100));
    const totalCost = perEmployeeAnnual * numEmployees;
    const monthlyProvision = Math.round(totalCost / 12);

    return (
        <>
            <div style={{ background: "#dbeafe", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                <strong>💡 For Employers:</strong> This estimates total bonus liability for your workforce. Provision monthly to avoid cash-flow strain at payment time.
            </div>

            <InputRow label="Number of Eligible Employees" value={numEmployees} set={setNumEmployees} max={1000} step={1} min={1} suffix="" />
            <InputRow label="Average Basic + DA (Monthly)" value={avgBasicDA} set={setAvgBasicDA} max={21000} step={500} min={1000} />

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 4 }}>Bonus Rate</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {[8.33, 10, 12, 15, 18, 20].map(r => (
                        <button key={r} onClick={() => setBonusRate(r)} style={{
                            padding: "6px 14px", borderRadius: 6, fontSize: "0.8rem", cursor: "pointer",
                            border: bonusRate === r ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: bonusRate === r ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: bonusRate === r ? 700 : 500, color: bonusRate === r ? "var(--n-primary)" : "var(--n-text)",
                        }}>{r}%</button>
                    ))}
                </div>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 1 }}>Total Annual Bonus Liability</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>{fmt(totalCost)}</div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Eligible Employees", `${numEmployees}`],
                            ["Avg Basic + DA", fmt(avgBasicDA) + "/month"],
                            ["Calculation Base (capped)", fmt(calcBase) + "/month"],
                            [`Per Employee Bonus @ ${bonusRate}%`, fmt(perEmployeeAnnual) + "/year"],
                            ["Total Annual Liability", fmt(totalCost)],
                            ["Monthly Provision Required", fmt(monthlyProvision)],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 4 ? 700 : 500 }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MODE 3: COMPLIANCE GUIDE ═══════ */
function ComplianceMode() {
    const sections = [
        { title: "📋 Applicability", items: [
            { rule: "Establishment Type", detail: "Every factory + every establishment with ≥20 employees on any day" },
            { rule: "Persistence", detail: "Once covered, remains covered even if headcount drops below 20" },
            { rule: "Salary Ceiling (Eligibility)", detail: "Basic + DA ≤ ₹21,000/month" },
            { rule: "Minimum Service", detail: "At least 30 working days in the accounting year" },
            { rule: "Calculation Ceiling", detail: "₹7,000/month or minimum wage (whichever is higher)" },
        ]},
        { title: "💰 Bonus Rates", items: [
            { rule: "Minimum Bonus", detail: "8.33% of salary or ₹100, whichever is higher — mandatory even in loss years" },
            { rule: "Maximum Bonus", detail: "20% of salary — when allocable surplus permits" },
            { rule: "New Establishment", detail: "Exempt for first 5 years if no profit (Section 16)" },
        ]},
        { title: "📅 Payment Timeline", items: [
            { rule: "Payment Deadline", detail: "Within 8 months from close of the accounting year" },
            { rule: "Ex-gratia Adjustment", detail: "Custom/ex-gratia bonus can be set off against statutory bonus" },
            { rule: "Records to Maintain", detail: "Form A (computation of allocable surplus), Form B (set on/set off), Form C (bonus paid), Form D (annual return)" },
        ]},
        { title: "❌ Disqualification", items: [
            { rule: "Fraud", detail: "Employee engaged in fraud → disqualified" },
            { rule: "Violence", detail: "Riotous/violent behaviour on premises → disqualified" },
            { rule: "Theft/Sabotage", detail: "Theft, misappropriation, or sabotage → disqualified" },
            { rule: "Deduction", detail: "If misconduct causes financial loss, employer can deduct from bonus" },
        ]},
        { title: "⚖️ Penalties (Non-Compliance)", items: [
            { rule: "Non-payment of Bonus", detail: "Imprisonment up to 6 months, fine up to ₹1,000, or both" },
            { rule: "Contravention of Act", detail: "Imprisonment up to 6 months, fine up to ₹1,000, or both" },
            { rule: "Annual Return (Form D)", detail: "Must be filed with Labour Department" },
        ]},
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
            {sections.map((sec, i) => (
                <div key={i}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--n-primary)", marginBottom: 8 }}>{sec.title}</div>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)", background: "var(--n-surface-alt)" }}>
                                <th style={{ textAlign: "left", padding: "6px" }}>Rule / Section</th>
                                <th style={{ textAlign: "left", padding: "6px" }}>Detail</th>
                            </tr></thead>
                            <tbody>
                                {sec.items.map((item, j) => (
                                    <tr key={j} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "6px", fontWeight: 600 }}>{item.rule}</td>
                                        <td style={{ padding: "6px" }}>{item.detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════ MODE 4: ALLOCABLE SURPLUS CALCULATOR ═══════ */
function SurplusMode() {
    const [grossProfit, setGrossProfit] = useState(5000000);
    const [depreciation, setDepreciation] = useState(500000);
    const [directTax, setDirectTax] = useState(800000);
    const [isCompany, setIsCompany] = useState(true);
    const [totalWages, setTotalWages] = useState(2000000);

    const availableSurplus = Math.max(0, grossProfit - depreciation - directTax);
    const allocablePercent = isCompany ? 67 : 60;
    const allocableSurplus = Math.round(availableSurplus * allocablePercent / 100);
    const minBonusNeeded = Math.round(totalWages * 0.0833);
    const maxBonusPossible = Math.round(totalWages * 0.20);
    const bonusPayable = Math.min(maxBonusPossible, Math.max(minBonusNeeded, allocableSurplus));
    const bonusPercent = totalWages > 0 ? ((bonusPayable / totalWages) * 100).toFixed(2) : "0";
    const setOn = allocableSurplus > maxBonusPossible ? allocableSurplus - maxBonusPossible : 0;
    const setOff = allocableSurplus < minBonusNeeded ? minBonusNeeded - allocableSurplus : 0;

    return (
        <>
            <div style={{ background: "#dbeafe", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                <strong>📊 For Employers:</strong> Compute allocable surplus to determine the actual bonus percentage (between 8.33% and 20%) based on your establishment&apos;s profitability.
            </div>

            <InputRow label="Gross Profit" value={grossProfit} set={setGrossProfit} max={5_00_00_000} step={100000} min={0} />
            <InputRow label="Depreciation (Prior Charge)" value={depreciation} set={setDepreciation} max={2_00_00_000} step={50000} min={0} />
            <InputRow label="Direct Tax Payable" value={directTax} set={setDirectTax} max={2_00_00_000} step={50000} min={0} />
            <InputRow label="Total Eligible Wages (Annual)" value={totalWages} set={setTotalWages} max={5_00_00_000} step={50000} min={10000}
                hint="Sum of all eligible employees' annual Basic + DA (capped at ₹7,000/month each)" />

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsCompany(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isCompany ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: isCompany ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: isCompany ? 700 : 500, color: isCompany ? "var(--n-primary)" : "var(--n-text)",
                }}>🏢 Company (67%)</button>
                <button onClick={() => setIsCompany(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isCompany ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isCompany ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isCompany ? 700 : 500, color: !isCompany ? "var(--n-primary)" : "var(--n-text)",
                }}>🏪 Other Establishment (60%)</button>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>Bonus Payable ({bonusPercent}%)</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>{fmt(bonusPayable)}</div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Gross Profit", fmt(grossProfit)],
                            ["Less: Depreciation", `-${fmt(depreciation)}`],
                            ["Less: Direct Tax", `-${fmt(directTax)}`],
                            ["Available Surplus", fmt(availableSurplus)],
                            [`Allocable Surplus (${allocablePercent}%)`, fmt(allocableSurplus)],
                            ["Minimum Bonus (8.33%)", fmt(minBonusNeeded)],
                            ["Maximum Bonus (20%)", fmt(maxBonusPossible)],
                            ["Bonus Payable", fmt(bonusPayable)],
                            ...(setOn > 0 ? [["Set On (carried forward 4 yrs)", fmt(setOn)]] : []),
                            ...(setOff > 0 ? [["Set Off (deficit carried forward)", fmt(setOff)]] : []),
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i === 7 ? 700 : 500, color: i === 7 ? "#16a34a" : i >= 8 ? "#b45309" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function BonusCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🎁 Statutory Bonus Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Payment of Bonus Act, 1965 • 8.33%–20% • ₹7,000 ceiling • Surplus calculation</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 110, padding: "12px 8px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                        color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: "var(--s-5)" }}>
                {mode === "calculator" && <CalculatorMode />}
                {mode === "employer" && <EmployerMode />}
                {mode === "compliance" && <ComplianceMode />}
                {mode === "surplus" && <SurplusMode />}
            </div>
        </div>
    );
}

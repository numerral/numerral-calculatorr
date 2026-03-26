"use client";
import { useState, useMemo } from "react";

const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

function ResultRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (<div className="con-result-row"><span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value">{value}{unit ? <span className="con-result-row__unit"> {unit}</span> : null}</span></div>);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder }: {
    label: string; value: number | string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string;
}) {
    return (<div className="con-input"><label className="con-input__label">{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input type={typeof value === "string" ? "text" : "number"} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
    return (<div className="con-input"><label className="con-input__label">{label}</label>
        <select className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ── EOSB Calculation Logic (Saudi Labor Law Articles 84, 85, 87) ── */
function calculateEOSB(monthlyWage: number, years: number, months: number, days: number, reason: string) {
    const totalYears = years + months / 12 + days / 365;
    if (totalYears <= 0 || monthlyWage <= 0) return null;

    // Article 84: Progressive rate calculation
    // First 5 years: half month's wage per year
    // After 5 years: full month's wage per year
    const first5 = Math.min(totalYears, 5);
    const after5 = Math.max(totalYears - 5, 0);
    const eosbFirst5 = first5 * (monthlyWage / 2);
    const eosbAfter5 = after5 * monthlyWage;
    const fullEOSB = eosbFirst5 + eosbAfter5;

    // Article 85: Resignation entitlement fraction
    let fraction = 1; // Default: full entitlement (termination, end of contract)
    let fractionLabel = "Full (100%)";
    let fractionReason = "Employer termination or end of contract — full entitlement";

    if (reason === "resignation") {
        if (totalYears < 2) {
            fraction = 0;
            fractionLabel = "None (0%)";
            fractionReason = "Resignation with less than 2 years of service — no entitlement (Article 85)";
        } else if (totalYears < 5) {
            fraction = 1 / 3;
            fractionLabel = "One-third (⅓)";
            fractionReason = "Resignation with 2–5 years of service — ⅓ entitlement (Article 85)";
        } else if (totalYears < 10) {
            fraction = 2 / 3;
            fractionLabel = "Two-thirds (⅔)";
            fractionReason = "Resignation with 5–10 years of service — ⅔ entitlement (Article 85)";
        } else {
            fraction = 1;
            fractionLabel = "Full (100%)";
            fractionReason = "Resignation with 10+ years of service — full entitlement (Article 85)";
        }
    } else if (reason === "force_majeure" || reason === "marriage" || reason === "childbirth") {
        fraction = 1;
        fractionLabel = "Full (100%)";
        fractionReason = reason === "force_majeure"
            ? "Force majeure — full entitlement (Article 87)"
            : reason === "marriage"
                ? "Female worker ending contract within 6 months of marriage — full entitlement (Article 87)"
                : "Female worker ending contract within 3 months of childbirth — full entitlement (Article 87)";
    } else if (reason === "article80") {
        fraction = 0;
        fractionLabel = "Forfeited (0%)";
        fractionReason = "Termination for gross misconduct under Article 80 — no entitlement";
    }

    const finalPayout = fullEOSB * fraction;

    const steps = [
        `Monthly Wage: SAR ${fmt(monthlyWage)}`,
        `Service Duration: ${years} year(s), ${months} month(s), ${days} day(s) = ${fmt(totalYears, 4)} years`,
        `First 5 years rate: SAR ${fmt(monthlyWage)} / 2 = SAR ${fmt(monthlyWage / 2)} per year`,
        `EOSB for first ${fmt(first5, 4)} years: ${fmt(first5, 4)} × SAR ${fmt(monthlyWage / 2)} = SAR ${fmt(eosbFirst5)}`,
        ...(after5 > 0 ? [
            `After 5 years rate: SAR ${fmt(monthlyWage)} per year`,
            `EOSB for remaining ${fmt(after5, 4)} years: ${fmt(after5, 4)} × SAR ${fmt(monthlyWage)} = SAR ${fmt(eosbAfter5)}`,
        ] : []),
        `Full EOSB (Article 84): SAR ${fmt(eosbFirst5)} + SAR ${fmt(eosbAfter5)} = SAR ${fmt(fullEOSB)}`,
        `Entitlement: ${fractionLabel}`,
        fractionReason,
        `Final Payout: SAR ${fmt(fullEOSB)} × ${fraction === 1 ? "1" : fraction === 0 ? "0" : fraction === 1/3 ? "⅓" : "⅔"} = SAR ${fmt(finalPayout)}`,
    ];

    return { fullEOSB, fraction, fractionLabel, fractionReason, finalPayout, totalYears, steps, eosbFirst5, eosbAfter5 };
}

/* ── Main EOSB Calculator ── */
function EOSBCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Quick Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏢 End of Service Benefit Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <EOSBCalculatorTab />}
        {tab === 1 && <EOSBReferenceTab />}
    </div>);
}

function EOSBCalculatorTab() {
    const [wage, setWage] = useState("10000");
    const [reason, setReason] = useState("termination");
    const [years, setYears] = useState("7");
    const [months, setMonths] = useState("0");
    const [days, setDays] = useState("0");

    const r = useMemo(() => {
        return calculateEOSB(parseFloat(wage) || 0, parseInt(years) || 0, parseInt(months) || 0, parseInt(days) || 0, reason);
    }, [wage, reason, years, months, days]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Monthly Wage" value={wage} onChange={setWage} unit="SAR" placeholder="e.g. 10000" />
            <SelectField label="Reason for End of Service" value={reason} onChange={setReason} options={[
                { value: "termination", label: "Employer Termination" },
                { value: "end_of_contract", label: "End of Contract" },
                { value: "resignation", label: "Resignation" },
                { value: "force_majeure", label: "Force Majeure" },
                { value: "marriage", label: "Marriage (Female Worker)" },
                { value: "childbirth", label: "Childbirth (Female Worker)" },
                { value: "article80", label: "Termination — Article 80 (Misconduct)" },
            ]} />
            <InputField label="Years of Service" value={years} onChange={setYears} min={0} max={50} placeholder="Years" />
            <InputField label="Months" value={months} onChange={setMonths} min={0} max={11} placeholder="Months" />
            <InputField label="Days" value={days} onChange={setDays} min={0} max={30} placeholder="Days" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Result</h4>
            <ResultRow label="Full EOSB (Art. 84)" value={`SAR ${fmt(r.fullEOSB)}`} />
            <ResultRow label="Entitlement" value={r.fractionLabel} />
            <ResultRow label="Final Payout" value={`SAR ${fmt(r.finalPayout)}`} />
            <h4>Step‑by‑Step Breakdown</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ This calculator provides estimates based on the Saudi Labor Law. It is not legal advice. Consult the Ministry of Human Resources and Social Development (HRSD) for official guidance.
            </div>
        </div>}
    </div>);
}

function EOSBReferenceTab() {
    return (<div className="con-calc__results">
        <h4>Article 85 — Resignation Entitlement Tiers</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Service Duration</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>Entitlement</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Description</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Less than 2 years", "0%", "No entitlement upon resignation"],
                        ["2 to less than 5 years", "⅓ (33.3%)", "One-third of the full EOSB"],
                        ["5 to less than 10 years", "⅔ (66.7%)", "Two-thirds of the full EOSB"],
                        ["10 years or more", "100%", "Full EOSB — same as termination"],
                    ].map(([dur, ent, desc], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "6px 12px" }}>{dur}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center", fontWeight: 700 }}>{ent}</td>
                            <td style={{ padding: "6px 12px", fontSize: "0.8rem" }}>{desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Article 84 — EOSB Rate Table</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Period</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>Rate</th>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Formula</th>
                </tr></thead>
                <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 12px" }}>First 5 years</td>
                        <td style={{ padding: "6px 12px", textAlign: "center", fontWeight: 700 }}>½ month</td>
                        <td style={{ padding: "6px 12px", fontSize: "0.8rem" }}>Monthly Wage ÷ 2 × Years</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "6px 12px" }}>After 5 years</td>
                        <td style={{ padding: "6px 12px", textAlign: "center", fontWeight: 700 }}>1 month</td>
                        <td style={{ padding: "6px 12px", fontSize: "0.8rem" }}>Monthly Wage × Years</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Common Salary → EOSB Lookup (Termination, Full Entitlement)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--border)" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Monthly Wage</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>3 Years</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>5 Years</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>7 Years</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>10 Years</th>
                    <th style={{ padding: "8px 12px", textAlign: "center" }}>15 Years</th>
                </tr></thead>
                <tbody>
                    {[5000, 8000, 10000, 15000, 20000, 25000, 30000].map((w) => {
                        const calc = (y: number) => {
                            const f5 = Math.min(y, 5) * (w / 2);
                            const a5 = Math.max(y - 5, 0) * w;
                            return `SAR ${(f5 + a5).toLocaleString()}`;
                        };
                        return (<tr key={w} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td style={{ padding: "6px 12px", fontWeight: 600 }}>SAR {w.toLocaleString()}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center" }}>{calc(3)}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center" }}>{calc(5)}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center" }}>{calc(7)}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center" }}>{calc(10)}</td>
                            <td style={{ padding: "6px 12px", textAlign: "center" }}>{calc(15)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── GOSI Calculation Logic (Saudi Social Insurance) ── */
const GOSI_RATES = {
    saudi: {
        employee: { pension: 0.09, saned: 0.0075, hazards: 0, total: 0.0975 },
        employer: { pension: 0.09, saned: 0.0075, hazards: 0.02, total: 0.1175 },
    },
    nonSaudi: {
        employee: { pension: 0, saned: 0, hazards: 0, total: 0 },
        employer: { pension: 0, saned: 0, hazards: 0.02, total: 0.02 },
    },
};
const GOSI_CAP = 45000;
const GOSI_FLOOR = 1500;

function GOSICalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Contribution Table"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏛️ GOSI Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <GOSICalculatorTab />}
        {tab === 1 && <GOSIContributionTab />}
    </div>);
}

function GOSICalculatorTab() {
    const [basic, setBasic] = useState("8000");
    const [housing, setHousing] = useState("2000");
    const [nationality, setNationality] = useState("saudi");

    const r = useMemo(() => {
        const b = parseFloat(basic) || 0;
        const h = parseFloat(housing) || 0;
        const grossBase = b + h;
        if (grossBase <= 0) return null;
        const contributable = Math.min(Math.max(grossBase, GOSI_FLOOR), GOSI_CAP);
        const rates = nationality === "saudi" ? GOSI_RATES.saudi : GOSI_RATES.nonSaudi;

        const empPension = contributable * rates.employee.pension;
        const empSaned = contributable * rates.employee.saned;
        const empHazards = contributable * rates.employee.hazards;
        const empTotal = contributable * rates.employee.total;

        const errPension = contributable * rates.employer.pension;
        const errSaned = contributable * rates.employer.saned;
        const errHazards = contributable * rates.employer.hazards;
        const errTotal = contributable * rates.employer.total;

        const totalContribution = empTotal + errTotal;
        const netSalary = grossBase - empTotal;

        return {
            grossBase, contributable, nationality,
            empPension, empSaned, empHazards, empTotal,
            errPension, errSaned, errHazards, errTotal,
            totalContribution, netSalary,
            steps: [
                `Basic Salary: SAR ${fmt(b)}`,
                `Housing Allowance: SAR ${fmt(h)}`,
                `Gross Contributable Base: SAR ${fmt(b)} + SAR ${fmt(h)} = SAR ${fmt(grossBase)}`,
                contributable !== grossBase ? `Capped/Floored at: SAR ${fmt(contributable)} (limits: ${fmt(GOSI_FLOOR, 0)}–${fmt(GOSI_CAP, 0)})` : `Within GOSI limits (SAR ${fmt(GOSI_FLOOR, 0)}–${fmt(GOSI_CAP, 0)})`,
                `Employee Rate: ${(rates.employee.total * 100).toFixed(2)}% → SAR ${fmt(empTotal)}`,
                `Employer Rate: ${(rates.employer.total * 100).toFixed(2)}% → SAR ${fmt(errTotal)}`,
                `Total Monthly GOSI: SAR ${fmt(totalContribution)}`,
                `Net Salary (after employee GOSI): SAR ${fmt(grossBase)} − SAR ${fmt(empTotal)} = SAR ${fmt(netSalary)}`,
            ],
        };
    }, [basic, housing, nationality]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Basic Salary" value={basic} onChange={setBasic} unit="SAR" placeholder="e.g. 8000" />
            <InputField label="Housing Allowance" value={housing} onChange={setHousing} unit="SAR" placeholder="e.g. 2000" />
            <SelectField label="Nationality" value={nationality} onChange={setNationality} options={[
                { value: "saudi", label: "Saudi National" },
                { value: "nonSaudi", label: "Non-Saudi (Expatriate)" },
            ]} />
        </div>
        {r && <div className="con-calc__results">
            <h4>Monthly Contributions</h4>
            <ResultRow label="Employee Contribution" value={`SAR ${fmt(r.empTotal)}`} />
            <ResultRow label="Employer Contribution" value={`SAR ${fmt(r.errTotal)}`} />
            <ResultRow label="Total GOSI" value={`SAR ${fmt(r.totalContribution)}`} />
            <ResultRow label="Net Salary (after GOSI)" value={`SAR ${fmt(r.netSalary)}`} />

            {r.nationality === "saudi" && <>
                <h4>Component Breakdown — Employee</h4>
                <ResultRow label="Annuities (Pension) 9%" value={`SAR ${fmt(r.empPension)}`} />
                <ResultRow label="SANED (Unemployment) 0.75%" value={`SAR ${fmt(r.empSaned)}`} />
                <ResultRow label="Occupational Hazards 0%" value={`SAR 0.00`} />
                <h4>Component Breakdown — Employer</h4>
                <ResultRow label="Annuities (Pension) 9%" value={`SAR ${fmt(r.errPension)}`} />
                <ResultRow label="SANED (Unemployment) 0.75%" value={`SAR ${fmt(r.errSaned)}`} />
                <ResultRow label="Occupational Hazards 2%" value={`SAR ${fmt(r.errHazards)}`} />
            </>}

            {r.nationality !== "saudi" && <>
                <h4>Component Breakdown</h4>
                <ResultRow label="Employee — All Components" value={`SAR 0.00 (not applicable)`} />
                <ResultRow label="Employer — Occupational Hazards 2%" value={`SAR ${fmt(r.errHazards)}`} />
            </>}

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ Based on GOSI 2025 rates. New subscribers (post July 3, 2024) may have +0.5%/year gradual increases. Consult gosi.gov.sa for official rates.
            </div>
        </div>}
    </div>);
}

function GOSIContributionTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };
    return (<div className="con-calc__results">
        <h4>GOSI Contribution Rates — Saudi vs Non-Saudi</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Component</th>
                    <th style={th}>Saudi Employee</th>
                    <th style={th}>Saudi Employer</th>
                    <th style={th}>Non-Saudi Employee</th>
                    <th style={th}>Non-Saudi Employer</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Annuities (Pension)", "9%", "9%", "—", "—"],
                        ["SANED (Unemployment)", "0.75%", "0.75%", "—", "—"],
                        ["Occupational Hazards", "—", "2%", "—", "2%"],
                        ["Total", "9.75%", "11.75%", "0%", "2%"],
                    ].map(([comp, se, sr, ne, nr], i) => (
                        <tr key={i} style={{ ...b, ...(i === 3 ? { fontWeight: 700 } : {}) }}>
                            <td style={tl}>{comp}</td><td style={td}>{se}</td><td style={td}>{sr}</td><td style={td}>{ne}</td><td style={td}>{nr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Salary → Monthly GOSI Lookup (Saudi National)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Base Salary (Basic+Housing)</th>
                    <th style={th}>Employee (9.75%)</th>
                    <th style={th}>Employer (11.75%)</th>
                    <th style={th}>Total GOSI</th>
                    <th style={th}>Net Salary</th>
                </tr></thead>
                <tbody>
                    {[3000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 45000].map((s) => {
                        const c = Math.min(Math.max(s, GOSI_FLOOR), GOSI_CAP);
                        const emp = c * 0.0975; const err = c * 0.1175;
                        return (<tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(emp)}</td>
                            <td style={td}>SAR {fmt(err)}</td>
                            <td style={td}>SAR {fmt(emp + err)}</td>
                            <td style={{ ...td, fontWeight: 600 }}>SAR {fmt(s - emp)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Salary → Monthly GOSI Lookup (Non-Saudi)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Base Salary</th>
                    <th style={th}>Employee (0%)</th>
                    <th style={th}>Employer (2%)</th>
                    <th style={th}>Net Salary</th>
                </tr></thead>
                <tbody>
                    {[3000, 5000, 8000, 10000, 15000, 20000, 30000].map((s) => {
                        const c = Math.min(Math.max(s, GOSI_FLOOR), GOSI_CAP);
                        return (<tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={td}>SAR 0.00</td>
                            <td style={td}>SAR {fmt(c * 0.02)}</td>
                            <td style={{ ...td, fontWeight: 600 }}>SAR {fmt(s)} (no deduction)</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Savings Goal Calculator ── */
const SAVINGS_GOALS = [
    { value: "emergency", label: "🛡️ Emergency Fund", amount: 30000 },
    { value: "hajj", label: "🕋 Hajj", amount: 8000 },
    { value: "umrah", label: "🕌 Umrah", amount: 4000 },
    { value: "wedding", label: "💍 Wedding", amount: 100000 },
    { value: "car", label: "🚗 Car Down Payment", amount: 20000 },
    { value: "home", label: "🏠 Home Down Payment", amount: 150000 },
    { value: "education", label: "🎓 Education Abroad", amount: 200000 },
    { value: "custom", label: "✏️ Custom Goal", amount: 50000 },
];

function SavingsGoalCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Quick Reference"];

    const [mode, setMode] = useState<"time" | "monthly">("time");
    const [goal, setGoal] = useState("emergency");
    const [target, setTarget] = useState(30000);
    const [current, setCurrent] = useState(0);
    const [monthly, setMonthly] = useState(2000);
    const [rate, setRate] = useState(4.0);
    const [compounding, setCompounding] = useState("monthly");
    const [timeframe, setTimeframe] = useState(24);

    const handleGoalChange = (v: string) => {
        setGoal(v);
        const found = SAVINGS_GOALS.find((g) => g.value === v);
        if (found) setTarget(found.amount);
    };

    const result = useMemo(() => {
        const remaining = Math.max(target - current, 0);
        if (remaining <= 0) return { months: 0, totalContrib: 0, totalProfit: 0, finalBalance: current, steps: ["Goal already reached!"] };

        const periodsPerYear = compounding === "monthly" ? 12 : compounding === "quarterly" ? 4 : 1;
        const r = rate / 100 / periodsPerYear;

        if (mode === "time") {
            // Calculate months to reach goal
            if (monthly <= 0) return null;
            let balance = current;
            let totalContrib = 0;
            let monthCount = 0;
            const maxMonths = 600; // 50 yrs cap
            while (balance < target && monthCount < maxMonths) {
                monthCount++;
                balance += monthly;
                totalContrib += monthly;
                // Apply compounding at appropriate intervals
                if (compounding === "monthly") {
                    balance *= (1 + r);
                } else if (compounding === "quarterly" && monthCount % 3 === 0) {
                    balance *= (1 + r);
                } else if (compounding === "annually" && monthCount % 12 === 0) {
                    balance *= (1 + r);
                }
            }
            const totalProfit = balance - current - totalContrib;
            const years = Math.floor(monthCount / 12);
            const remMonths = monthCount % 12;
            const timeLabel = years > 0 ? `${years} year${years > 1 ? "s" : ""}${remMonths > 0 ? ` ${remMonths} month${remMonths > 1 ? "s" : ""}` : ""}` : `${remMonths} month${remMonths > 1 ? "s" : ""}`;
            const steps = [
                `Target: SAR ${fmt(target, 0)}`,
                `Current savings: SAR ${fmt(current, 0)}`,
                `Remaining to save: SAR ${fmt(remaining, 0)}`,
                `Monthly deposit: SAR ${fmt(monthly, 0)}`,
                `Annual profit rate: ${fmt(rate, 1)}% (${compounding})`,
                `Time to goal: ${timeLabel} (${monthCount} months)`,
                `Total contributions: SAR ${fmt(totalContrib)}`,
                `Profit earned: SAR ${fmt(totalProfit)}`,
                `Final balance: SAR ${fmt(balance)}`,
            ];
            return { months: monthCount, totalContrib, totalProfit, finalBalance: balance, timeLabel, steps };
        } else {
            // Calculate monthly needed for given timeframe
            if (timeframe <= 0) return null;
            // FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
            // target = current × (1+r)^n + PMT × [((1+r)^n - 1) / r]
            // PMT = (target - current × (1+r)^n) / [((1+r)^n - 1) / r]
            const n = compounding === "monthly" ? timeframe : compounding === "quarterly" ? timeframe / 3 : timeframe / 12;
            const fvCurrent = current * Math.pow(1 + r, n);
            const needFromPMT = target - fvCurrent;
            let neededMonthly: number;
            if (r === 0) {
                neededMonthly = needFromPMT / timeframe;
            } else {
                const annuityFactor = (Math.pow(1 + r, n) - 1) / r;
                const pmtPerPeriod = needFromPMT / annuityFactor;
                // Convert period payment to monthly
                if (compounding === "monthly") neededMonthly = pmtPerPeriod;
                else if (compounding === "quarterly") neededMonthly = pmtPerPeriod / 3;
                else neededMonthly = pmtPerPeriod / 12;
            }
            neededMonthly = Math.max(neededMonthly, 0);
            const totalContrib = neededMonthly * timeframe;
            const totalProfit = target - current - totalContrib;
            const years = Math.floor(timeframe / 12);
            const remMonths = timeframe % 12;
            const timeLabel = years > 0 ? `${years} year${years > 1 ? "s" : ""}${remMonths > 0 ? ` ${remMonths} month${remMonths > 1 ? "s" : ""}` : ""}` : `${remMonths} month${remMonths > 1 ? "s" : ""}`;
            const steps = [
                `Target: SAR ${fmt(target, 0)}`,
                `Current savings: SAR ${fmt(current, 0)}`,
                `Remaining to save: SAR ${fmt(remaining, 0)}`,
                `Timeframe: ${timeLabel} (${timeframe} months)`,
                `Annual profit rate: ${fmt(rate, 1)}% (${compounding})`,
                `Required monthly savings: SAR ${fmt(neededMonthly)}`,
                `Total contributions: SAR ${fmt(totalContrib)}`,
                `Estimated profit: SAR ${fmt(Math.max(totalProfit, 0))}`,
            ];
            return { months: timeframe, totalContrib, totalProfit: Math.max(totalProfit, 0), finalBalance: target, neededMonthly, timeLabel, steps };
        }
    }, [target, current, monthly, rate, compounding, mode, timeframe]);

    const progress = result ? Math.min((current / target) * 100, 100) : 0;

    return (<div className="con-calc">
        <h3 className="con-calc__title">🏦 Savings Goal Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => (<button key={t} onClick={() => setTab(i)}
                style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: tab === i ? 700 : 500, background: tab === i ? "var(--primary, var(--n-primary))" : "transparent", color: tab === i ? "#fff" : "var(--text-muted, var(--n-text-muted))", border: tab === i ? "none" : "1px solid var(--border, var(--n-border))", cursor: "pointer" }}>{t}</button>))}
        </div>

        {tab === 0 && <>
            {/* Mode Toggle */}
            <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-4)" }}>
                <button onClick={() => setMode("time")} style={{ flex: 1, padding: "8px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: mode === "time" ? 700 : 500, background: mode === "time" ? "rgba(0,106,60,0.1)" : "transparent", color: mode === "time" ? "#006a3c" : "var(--text-muted, var(--n-text-muted))", border: `1px solid ${mode === "time" ? "#006a3c" : "var(--border, var(--n-border))"}`, cursor: "pointer" }}>⏱️ Time to Goal</button>
                <button onClick={() => setMode("monthly")} style={{ flex: 1, padding: "8px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: mode === "monthly" ? 700 : 500, background: mode === "monthly" ? "rgba(0,106,60,0.1)" : "transparent", color: mode === "monthly" ? "#006a3c" : "var(--text-muted, var(--n-text-muted))", border: `1px solid ${mode === "monthly" ? "#006a3c" : "var(--border, var(--n-border))"}`, cursor: "pointer" }}>💰 Monthly Needed</button>
            </div>

            <SelectField label="Savings Goal" value={goal} onChange={handleGoalChange} options={SAVINGS_GOALS.map((g) => ({ value: g.value, label: g.label }))} />
            <InputField label="Target Amount" value={target} onChange={(v) => setTarget(Number(v))} unit="SAR" min={0} />
            <InputField label="Current Savings" value={current} onChange={(v) => setCurrent(Number(v))} unit="SAR" min={0} />
            {mode === "time" && <InputField label="Monthly Contribution" value={monthly} onChange={(v) => setMonthly(Number(v))} unit="SAR" min={0} />}
            {mode === "monthly" && <InputField label="Timeframe" value={timeframe} onChange={(v) => setTimeframe(Number(v))} unit="months" min={1} max={600} />}
            <InputField label="Annual Profit Rate" value={rate} onChange={(v) => setRate(Number(v))} unit="%" min={0} max={30} step={0.1} />
            <SelectField label="Compounding" value={compounding} onChange={setCompounding} options={[{ value: "monthly", label: "Monthly" }, { value: "quarterly", label: "Quarterly" }, { value: "annually", label: "Annually" }]} />

            {/* Progress Bar */}
            <div style={{ margin: "var(--s-4) 0 var(--s-2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                    <span>Goal Progress</span>
                    <span style={{ fontWeight: 700, color: "#006a3c" }}>{fmt(progress, 1)}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--border, var(--n-border))" }}>
                    <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #006a3c, #00a85a)", width: `${progress}%`, transition: "width 0.3s ease" }} />
                </div>
            </div>

            {result && <div className="con-calc__results" style={{ marginTop: "var(--s-3)" }}>
                <h4>Results</h4>
                {mode === "time" && result.months !== undefined && (
                    <ResultRow label="Time to Reach Goal" value={(result as any).timeLabel || `${result.months} months`} />
                )}
                {mode === "monthly" && (result as any).neededMonthly !== undefined && (
                    <ResultRow label="Required Monthly Savings" value={`SAR ${fmt((result as any).neededMonthly)}`} />
                )}
                <ResultRow label="Total Contributions" value={`SAR ${fmt(result.totalContrib)}`} />
                <ResultRow label="Profit Earned" value={`SAR ${fmt(result.totalProfit)}`} />
                <ResultRow label="Final Balance" value={`SAR ${fmt(result.finalBalance)}`} />

                <h4 style={{ marginTop: "var(--s-3)" }}>Calculation Steps</h4>
                {result.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            </div>}
        </>}

        {tab === 1 && <SavingsReferenceTab />}
    </div>);
}

function SavingsReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>KSA Savings Goal Presets</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Goal</th>
                    <th style={th}>Typical Amount (SAR)</th>
                    <th style={th}>Suggested Timeframe</th>
                </tr></thead>
                <tbody>
                    {[
                        ["🛡️ Emergency Fund", "15,000–60,000", "6–12 months"],
                        ["🕋 Hajj", "3,000–12,000", "1–3 years"],
                        ["🕌 Umrah", "2,000–8,000", "6–12 months"],
                        ["💍 Wedding", "50,000–200,000+", "2–5 years"],
                        ["🚗 Car Down Payment", "6,000–40,000", "1–2 years"],
                        ["🏠 Home Down Payment", "50,000–300,000", "3–10 years"],
                        ["🎓 Education Abroad", "100,000–500,000", "5–10 years"],
                        ["💼 Business Startup", "50,000–500,000", "2–5 years"],
                    ].map(([goal, amount, time], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{goal}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{amount}</td>
                            <td style={td}>{time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>50/30/20 Budget Rule for KSA</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>% of Income</th>
                    <th style={{ ...th, textAlign: "left" }}>KSA Examples</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Needs</td><td style={{ ...td, fontWeight: 700 }}>50%</td><td style={tl}>Rent, food, utilities, transport, Iqama fees</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Wants</td><td style={{ ...td, fontWeight: 700 }}>30%</td><td style={tl}>Dining out, entertainment, travel, shopping</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Savings & Debt</td><td style={{ ...td, fontWeight: 700 }}>20%</td><td style={tl}>Emergency fund, Hajj savings, investments, Murabaha deposits</td></tr>
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Saudi Bank Profit Rates (Indicative — 2025/2026)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Bank</th>
                    <th style={{ ...th, textAlign: "left" }}>Product</th>
                    <th style={th}>Rate</th>
                </tr></thead>
                <tbody>
                    {[
                        ["meem", "Murabaha Deposit (90-day)", "Up to 5.14%"],
                        ["Al Rajhi", "Savings Account", "Variable"],
                        ["Riyad Bank", "Savings (Mudarabah)", "Competitive"],
                        ["SNB (AlAhli)", "Khayrat / Murabaha", "Variable"],
                        ["SAB", "Wafer Account", "Competitive"],
                        ["Alinma", "Savings Account", "~3.0%"],
                        ["Sah Sukuk", "Government-backed", "Fixed per issue"],
                    ].map(([bank, product, rate], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{bank}</td>
                            <td style={tl}>{product}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{rate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>SAMA Policy Rates (Feb 2026)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Rate</th>
                    <th style={th}>Current</th>
                    <th style={{ ...th, textAlign: "left" }}>Impact on Savings</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Repo Rate</td><td style={{ ...td, fontWeight: 700 }}>4.25%</td><td style={tl}>Higher = better savings returns</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Reverse Repo</td><td style={{ ...td, fontWeight: 700 }}>3.75%</td><td style={tl}>Floor for bank deposit rates</td></tr>
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Rent Affordability Calculator (KSA) ── */
const CITY_RENT_DATA: Record<string, { label: string; studio: number[]; br1: number[]; br2: number[]; br3: number[]; villa: number[] }> = {
    riyadh: { label: "Riyadh", studio: [1700, 3800], br1: [2500, 4800], br2: [3400, 6800], br3: [4000, 7500], villa: [15000, 19000] },
    jeddah: { label: "Jeddah", studio: [2200, 3400], br1: [2000, 4000], br2: [3200, 5500], br3: [5000, 12000], villa: [8000, 17000] },
    dammam: { label: "Dammam/Khobar", studio: [1500, 2800], br1: [1800, 3500], br2: [2500, 4500], br3: [3000, 5000], villa: [5000, 10000] },
    makkah: { label: "Makkah", studio: [1200, 2500], br1: [1500, 3000], br2: [2000, 4000], br3: [2500, 6000], villa: [6000, 12000] },
    madinah: { label: "Madinah", studio: [1000, 2000], br1: [1000, 2500], br2: [1500, 3000], br3: [2000, 4000], villa: [4000, 8000] },
};

const PROPERTY_TYPES = [
    { value: "studio", label: "Studio" },
    { value: "br1", label: "1-Bedroom" },
    { value: "br2", label: "2-Bedroom" },
    { value: "br3", label: "3-Bedroom" },
    { value: "villa", label: "Villa" },
];

function RentAffordabilityCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Quick Reference"];

    const [income, setIncome] = useState(10000);
    const [allowance, setAllowance] = useState(0);
    const [city, setCity] = useState("riyadh");
    const [propType, setPropType] = useState("br2");
    const [rule, setRule] = useState(30);
    const [debts, setDebts] = useState(0);
    const [isGosi, setIsGosi] = useState("no");

    const result = useMemo(() => {
        if (income <= 0) return null;
        const gosiDeduction = isGosi === "yes" ? income * 0.0975 : 0;
        const netIncome = income - gosiDeduction;
        const totalIncome = netIncome + allowance;
        const maxRent = totalIncome * (rule / 100);
        const remaining = totalIncome - maxRent;
        const dti = totalIncome > 0 ? ((maxRent + debts) / totalIncome) * 100 : 0;

        // City match
        const cityData = CITY_RENT_DATA[city];
        const propKey = propType as keyof typeof cityData;
        const rentRange = cityData[propKey] as number[];
        const avgCityRent = (rentRange[0] + rentRange[1]) / 2;
        const canAfford = maxRent >= rentRange[0];
        const comfortableAfford = maxRent >= avgCityRent;

        // Annual cost breakdown
        const annualRent = maxRent * 12;
        const agentFee = annualRent * 0.05;
        const securityDeposit = maxRent * 2;
        const monthlyUtilities = 450;
        const annualUtilities = monthlyUtilities * 12;
        const totalFirstYear = annualRent + agentFee + securityDeposit + annualUtilities;

        // Find affordable property types
        const affordableTypes = PROPERTY_TYPES.filter((pt) => {
            const key = pt.value as keyof typeof cityData;
            const range = cityData[key] as number[];
            return maxRent >= range[0];
        });

        return {
            gosiDeduction, netIncome, totalIncome, maxRent, remaining, dti,
            rentRange, avgCityRent, canAfford, comfortableAfford,
            annualRent, agentFee, securityDeposit, monthlyUtilities, annualUtilities, totalFirstYear,
            affordableTypes, cityLabel: cityData.label,
        };
    }, [income, allowance, city, propType, rule, debts, isGosi]);

    return (<div className="con-calc">
        <h3 className="con-calc__title">🏘️ Rent Affordability Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => (<button key={t} onClick={() => setTab(i)}
                style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "0.82rem", fontWeight: tab === i ? 700 : 500, background: tab === i ? "var(--primary, var(--n-primary))" : "transparent", color: tab === i ? "#fff" : "var(--text-muted, var(--n-text-muted))", border: tab === i ? "none" : "1px solid var(--border, var(--n-border))", cursor: "pointer" }}>{t}</button>))}
        </div>

        {tab === 0 && <>
            <InputField label="Monthly Salary" value={income} onChange={(v) => setIncome(Number(v))} unit="SAR" min={0} />
            <InputField label="Housing Allowance (if separate)" value={allowance} onChange={(v) => setAllowance(Number(v))} unit="SAR" min={0} />
            <SelectField label="GOSI Deduction" value={isGosi} onChange={setIsGosi} options={[{ value: "no", label: "No (Expat)" }, { value: "yes", label: "Yes — Saudi (9.75%)" }]} />
            <SelectField label="City" value={city} onChange={setCity} options={Object.entries(CITY_RENT_DATA).map(([k, v]) => ({ value: k, label: v.label }))} />
            <SelectField label="Property Type" value={propType} onChange={setPropType} options={PROPERTY_TYPES} />
            <InputField label="Affordability Rule" value={rule} onChange={(v) => setRule(Number(v))} unit="% of income" min={10} max={60} step={5} />
            <InputField label="Monthly Debts (car loan, etc.)" value={debts} onChange={(v) => setDebts(Number(v))} unit="SAR" min={0} />

            {result && <div className="con-calc__results" style={{ marginTop: "var(--s-3)" }}>
                <h4>Affordability Results</h4>
                {result.gosiDeduction > 0 && <ResultRow label="GOSI Deduction (9.75%)" value={`SAR ${fmt(result.gosiDeduction)}`} />}
                <ResultRow label="Net Income (after GOSI)" value={`SAR ${fmt(result.netIncome)}`} />
                {result.totalIncome !== result.netIncome && <ResultRow label="Total (+ Housing Allowance)" value={`SAR ${fmt(result.totalIncome)}`} />}
                <ResultRow label={`Maximum Rent (${rule}% rule)`} value={`SAR ${fmt(result.maxRent)}`} />
                <ResultRow label="Remaining After Rent" value={`SAR ${fmt(result.remaining)}`} />
                <ResultRow label="Debt-to-Income Ratio" value={`${fmt(result.dti, 1)}%`} />

                <h4 style={{ marginTop: "var(--s-3)" }}>City Rent Match — {result.cityLabel}</h4>
                <ResultRow label={`${PROPERTY_TYPES.find(p => p.value === propType)?.label} Range`} value={`SAR ${fmt(result.rentRange[0], 0)} – ${fmt(result.rentRange[1], 0)}/mo`} />
                <ResultRow label="Average" value={`SAR ${fmt(result.avgCityRent, 0)}/mo`} />
                <ResultRow label="Can You Afford Entry Level?" value={result.canAfford ? "✅ Yes" : "❌ No — over budget"} />
                <ResultRow label="Comfortable at Average?" value={result.comfortableAfford ? "✅ Yes" : "⚠️ Stretch — consider smaller unit"} />

                {result.affordableTypes.length > 0 && <>
                    <h4 style={{ marginTop: "var(--s-3)" }}>Affordable Property Types in {result.cityLabel}</h4>
                    {result.affordableTypes.map((pt) => {
                        const key = pt.value as keyof typeof CITY_RENT_DATA.riyadh;
                        const range = (CITY_RENT_DATA[city][key] as number[]);
                        return <ResultRow key={pt.value} label={pt.label} value={`SAR ${fmt(range[0], 0)} – ${fmt(range[1], 0)}/mo`} />;
                    })}
                </>}

                <h4 style={{ marginTop: "var(--s-3)" }}>First Year Cost Breakdown</h4>
                <ResultRow label="Annual Rent (12 months)" value={`SAR ${fmt(result.annualRent, 0)}`} />
                <ResultRow label="Agent Fee (5% of annual)" value={`SAR ${fmt(result.agentFee, 0)}`} />
                <ResultRow label="Security Deposit (~2 months)" value={`SAR ${fmt(result.securityDeposit, 0)}`} />
                <ResultRow label="Est. Utilities (12 months)" value={`SAR ${fmt(result.annualUtilities, 0)}`} />
                <ResultRow label="Total First Year Cost" value={`SAR ${fmt(result.totalFirstYear, 0)}`} />
            </div>}
        </>}

        {tab === 1 && <RentReferenceTab />}
    </div>);
}

function RentReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>Average Monthly Rent by City (SAR — 2025/2026)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>City</th>
                    <th style={th}>Studio</th>
                    <th style={th}>1-BR</th>
                    <th style={th}>2-BR</th>
                    <th style={th}>3-BR</th>
                    <th style={th}>Villa</th>
                </tr></thead>
                <tbody>
                    {Object.entries(CITY_RENT_DATA).map(([key, c]) => (
                        <tr key={key} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{c.label}</td>
                            <td style={td}>{c.studio[0].toLocaleString()}–{c.studio[1].toLocaleString()}</td>
                            <td style={td}>{c.br1[0].toLocaleString()}–{c.br1[1].toLocaleString()}</td>
                            <td style={td}>{c.br2[0].toLocaleString()}–{c.br2[1].toLocaleString()}</td>
                            <td style={td}>{c.br3[0].toLocaleString()}–{c.br3[1].toLocaleString()}</td>
                            <td style={td}>{c.villa[0].toLocaleString()}–{c.villa[1].toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Affordability Benchmarks</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Salary (SAR)</th>
                    <th style={th}>25% Rule</th>
                    <th style={th}>30% Rule</th>
                    <th style={th}>35% Rule</th>
                    <th style={th}>40% Rule</th>
                </tr></thead>
                <tbody>
                    {[5000, 7000, 10000, 15000, 20000, 30000].map((s) => (
                        <tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmt(s * 0.25, 0)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{fmt(s * 0.30, 0)}</td>
                            <td style={td}>{fmt(s * 0.35, 0)}</td>
                            <td style={td}>{fmt(s * 0.40, 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Ejar Rental Checklist</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Step</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {[
                        ["1. Valid Iqama/ID", "Must have valid residence permit (expats) or national ID"],
                        ["2. Ejar Registration", "Contract MUST be registered on Ejar platform"],
                        ["3. Payment via SADAD", "Rent via Mada or SADAD (biller 153) since Jan 2024"],
                        ["4. Security Deposit", "Held by Ejar as neutral party — returned after inspection"],
                        ["5. Agent Fee", "Typically 5% of annual rent — paid once at signing"],
                        ["6. 60-Day Notice", "Required before contract non-renewal"],
                        ["7. Riyadh Freeze", "5-year rent freeze — no increases above 0–2% (since Sep 2025)"],
                    ].map(([step, detail], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{step}</td>
                            <td style={tl}>{detail}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

export default function KSACalculatorCore({ calcType }: { calcType: string }) {
    if (calcType === "eosb") return <EOSBCalc />;
    if (calcType === "gosi") return <GOSICalc />;
    if (calcType === "vat") return <VATCalc />;
    if (calcType === "salary") return <SalaryCalc />;
    if (calcType === "overtime") return <OvertimeCalc />;
    if (calcType === "leave") return <LeaveCalc />;
    if (calcType === "homeloan") return <HomeLoanCalc />;
    if (calcType === "carloan") return <CarLoanCalc />;
    if (calcType === "savings") return <SavingsGoalCalc />;
    if (calcType === "rent") return <RentAffordabilityCalc />;
    return <p>Calculator not found: {calcType}</p>;
}

/* ── Car Loan Calculator (Saudi Auto Financing) ── */
function CarLoanCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🚗 Car Loan Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CarLoanCalcTab />}
        {tab === 1 && <CarLoanRefTab />}
    </div>);
}

function CarLoanCalcTab() {
    const [price, setPrice] = useState("120000");
    const [downPct, setDownPct] = useState("10");
    const [rate, setRate] = useState("4.5");
    const [tenure, setTenure] = useState("60");
    const [salary, setSalary] = useState("");

    const r = useMemo(() => {
        const p = parseFloat(price) || 0;
        const dp = parseFloat(downPct) || 0;
        const ar = parseFloat(rate) || 0;
        const t = parseFloat(tenure) || 0;
        const sal = parseFloat(salary) || 0;
        if (p <= 0 || ar <= 0 || t <= 0) return null;

        const downPayment = p * (dp / 100);
        const loanAmount = p - downPayment;
        const mr = ar / 100 / 12;
        const monthly = loanAmount * (mr * Math.pow(1 + mr, t)) / (Math.pow(1 + mr, t) - 1);
        const totalCost = monthly * t;
        const totalProfit = totalCost - loanAmount;
        const dti = sal > 0 ? (monthly / sal) * 100 : 0;

        return {
            p, downPayment, loanAmount, ar, t, monthly, totalCost, totalProfit, dti, sal,
            steps: [
                `Vehicle Price: SAR ${fmt(p)}`,
                `Down Payment (${dp}%): SAR ${fmt(downPayment)}`,
                `Financing Amount: SAR ${fmt(p)} − SAR ${fmt(downPayment)} = SAR ${fmt(loanAmount)}`,
                `Annual Profit Rate (APR): ${ar}%`,
                `Monthly Rate: ${ar}% ÷ 12 = ${fmt(ar / 12)}%`,
                `Tenure: ${t} months${t > 60 ? " ⚠️ EXCEEDS SAMA 60-month limit" : ""}`,
                `Monthly Installment: SAR ${fmt(monthly)}`,
                `Total Cost: SAR ${fmt(monthly)} × ${t} months = SAR ${fmt(totalCost)}`,
                `Total Profit Paid: SAR ${fmt(totalCost)} − SAR ${fmt(loanAmount)} = SAR ${fmt(totalProfit)}`,
                ...(sal > 0 ? [`DTI Ratio: SAR ${fmt(monthly)} ÷ SAR ${fmt(sal)} = ${fmt(dti)}% ${dti > 50 ? "⚠️ Above recommended 50%" : "✅ Within recommended 50%"}`] : []),
            ],
        };
    }, [price, downPct, rate, tenure, salary]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Vehicle Price" value={price} onChange={setPrice} unit="SAR" placeholder="e.g. 120000" />
            <InputField label="Down Payment" value={downPct} onChange={setDownPct} unit="%" placeholder="e.g. 10" />
            <InputField label="Annual Profit Rate (APR)" value={rate} onChange={setRate} unit="%" placeholder="e.g. 4.5" />
            <InputField label="Financing Tenure (months, max 60)" value={tenure} onChange={setTenure} unit="months" placeholder="e.g. 60" />
            <InputField label="Monthly Net Salary (optional, for DTI)" value={salary} onChange={setSalary} unit="SAR" placeholder="e.g. 8000" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Car Financing Summary</h4>
            <ResultRow label="Down Payment" value={`SAR ${fmt(r.downPayment)}`} />
            <ResultRow label="Financing Amount" value={`SAR ${fmt(r.loanAmount)}`} />
            <ResultRow label="Monthly Installment" value={`SAR ${fmt(r.monthly)}`} />
            <ResultRow label="Total Cost (over tenure)" value={`SAR ${fmt(r.totalCost)}`} />
            <ResultRow label="Total Profit Paid" value={`SAR ${fmt(r.totalProfit)}`} />
            {r.sal > 0 && <ResultRow label="DTI Ratio" value={`${fmt(r.dti)}% ${r.dti > 50 ? "⚠️ High" : "✅ OK"}`} />}

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ SAMA limits non-real-estate financing to 60 months max. Comprehensive insurance is mandatory. DTI recommended ≤50%. Actual bank offers may vary based on credit score & salary.
            </div>
        </div>}
    </div>);
}

function CarLoanRefTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    const providers = [
        ["Al Rajhi Bank", "~3.99%", "0–10%", "Up to 60 months", "Murabaha / Ijara"],
        ["Saudi National Bank (SNB)", "~4.25%", "10–20%", "Up to 60 months", "Murabaha / Ijara"],
        ["Bank Albilad", "~4.50%", "10%", "Up to 60 months", "Murabaha"],
        ["Abdul Latif Jameel (ALJ)", "~4.75%", "10–20%", "12–60 months", "Murabaha / Ijara"],
        ["Emirates NBD", "~5.51%", "20%", "Up to 60 months", "Murabaha"],
        ["Tasheel Finance", "~5.00%", "15–20%", "Up to 60 months", "Murabaha"],
    ];

    const cars = [60000, 80000, 100000, 120000, 150000, 200000, 300000];

    return (<div className="con-calc__results">
        <h4>Saudi Auto Financing Providers (Indicative 2025)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Provider</th>
                    <th style={th}>APR (New)</th>
                    <th style={th}>Down Payment</th>
                    <th style={th}>Max Tenure</th>
                    <th style={th}>Product</th>
                </tr></thead>
                <tbody>
                    {providers.map(([name, apr, dp, tenure, product], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{name}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{apr}</td>
                            <td style={td}>{dp}</td>
                            <td style={td}>{tenure}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{product}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Monthly Payment by Car Price (10% down, 4.5% APR, 60 months)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Car Price</th>
                    <th style={th}>Down (10%)</th>
                    <th style={th}>Financed</th>
                    <th style={th}>Monthly</th>
                    <th style={th}>Total Profit</th>
                </tr></thead>
                <tbody>
                    {cars.map((p) => {
                        const dp = p * 0.1; const loan = p - dp;
                        const mr = 0.045 / 12; const n = 60;
                        const m = loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
                        const profit = (m * n) - loan;
                        return (<tr key={p} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {p.toLocaleString()}</td>
                            <td style={td}>SAR {dp.toLocaleString()}</td>
                            <td style={td}>SAR {loan.toLocaleString()}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(m)}</td>
                            <td style={td}>SAR {fmt(profit)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>New vs Used Vehicle Rates</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Feature</th>
                    <th style={th}>New Vehicle</th>
                    <th style={th}>Used Vehicle</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Typical APR", "3.5–5.5%", "4–7%"],
                        ["Max Tenure", "60 months", "48–60 months"],
                        ["Down Payment", "0–20%", "10–30%"],
                        ["Insurance", "Comprehensive (mandatory)", "Comprehensive (mandatory)"],
                        ["Max Age Limit", "Current year models", "Typically 5–7 years old"],
                    ].map(([feat, newV, usedV], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{feat}</td>
                            <td style={td}>{newV}</td>
                            <td style={td}>{usedV}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Home Loan Calculator (Sharia-Compliant Financing) ── */
function HomeLoanCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏠 Home Loan Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <HomeLoanCalcTab />}
        {tab === 1 && <HomeLoanRefTab />}
    </div>);
}

function HomeLoanCalcTab() {
    const [price, setPrice] = useState("1000000");
    const [downPct, setDownPct] = useState("10");
    const [rate, setRate] = useState("5.5");
    const [tenure, setTenure] = useState("25");
    const [salary, setSalary] = useState("");

    const r = useMemo(() => {
        const p = parseFloat(price) || 0;
        const dp = parseFloat(downPct) || 0;
        const ar = parseFloat(rate) || 0;
        const t = parseFloat(tenure) || 0;
        const sal = parseFloat(salary) || 0;
        if (p <= 0 || ar <= 0 || t <= 0) return null;

        const downPayment = p * (dp / 100);
        const loanAmount = p - downPayment;
        const mr = ar / 100 / 12;
        const n = t * 12;
        const monthly = loanAmount * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
        const totalCost = monthly * n;
        const totalProfit = totalCost - loanAmount;
        const dti = sal > 0 ? (monthly / sal) * 100 : 0;

        return {
            p, downPayment, loanAmount, ar, t, monthly, totalCost, totalProfit, dti, sal,
            steps: [
                `Property Price: SAR ${fmt(p)}`,
                `Down Payment (${dp}%): SAR ${fmt(downPayment)}`,
                `Financing Amount: SAR ${fmt(p)} − SAR ${fmt(downPayment)} = SAR ${fmt(loanAmount)}`,
                `Annual Profit Rate (APR): ${ar}%`,
                `Monthly Rate: ${ar}% ÷ 12 = ${fmt(ar / 12)}%`,
                `Tenure: ${t} years (${n} months)`,
                `Monthly Payment: SAR ${fmt(monthly)}`,
                `Total Cost: SAR ${fmt(monthly)} × ${n} months = SAR ${fmt(totalCost)}`,
                `Total Profit Paid: SAR ${fmt(totalCost)} − SAR ${fmt(loanAmount)} = SAR ${fmt(totalProfit)}`,
                ...(sal > 0 ? [`DTI Ratio: SAR ${fmt(monthly)} ÷ SAR ${fmt(sal)} = ${fmt(dti)}% ${dti > 65 ? "⚠️ EXCEEDS 65% SAMA limit" : "✅ Within 65% SAMA limit"}`] : []),
            ],
        };
    }, [price, downPct, rate, tenure, salary]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Property Price" value={price} onChange={setPrice} unit="SAR" placeholder="e.g. 1000000" />
            <InputField label="Down Payment" value={downPct} onChange={setDownPct} unit="%" placeholder="e.g. 10" />
            <InputField label="Annual Profit Rate (APR)" value={rate} onChange={setRate} unit="%" placeholder="e.g. 5.5" />
            <InputField label="Financing Tenure" value={tenure} onChange={setTenure} unit="years" placeholder="e.g. 25" />
            <InputField label="Monthly Net Salary (optional, for DTI)" value={salary} onChange={setSalary} unit="SAR" placeholder="e.g. 15000" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Financing Summary</h4>
            <ResultRow label="Down Payment" value={`SAR ${fmt(r.downPayment)}`} />
            <ResultRow label="Financing Amount" value={`SAR ${fmt(r.loanAmount)}`} />
            <ResultRow label="Monthly Payment" value={`SAR ${fmt(r.monthly)}`} />
            <ResultRow label="Total Cost (over tenure)" value={`SAR ${fmt(r.totalCost)}`} />
            <ResultRow label="Total Profit Paid" value={`SAR ${fmt(r.totalProfit)}`} />
            {r.sal > 0 && <ResultRow label="DTI Ratio" value={`${fmt(r.dti)}% ${r.dti > 65 ? "⚠️ Over SAMA limit" : "✅ OK"}`} />}

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ This is Sharia-compliant financing estimation. Uses standard amortization with "profit rate" instead of interest. Actual bank offers may vary. SAMA limits: DTI ≤ 65%, minimum 10% down (first home), 30% down (second home).
            </div>
        </div>}
    </div>);
}

function HomeLoanRefTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    const banks = [
        ["Al Rajhi Bank", "~5.50%", "Murabaha / Ijara", "Up to 30 years"],
        ["Saudi National Bank (SNB)", "~5.75%", "Murabaha / Ijara", "Up to 25 years"],
        ["Riyad Bank", "~5.60%", "Murabaha / Ijara", "Up to 30 years"],
        ["SAB (HSBC Saudi)", "~5.80%", "Murabaha / Ijara", "Up to 25 years"],
        ["Emirates NBD", "~7.22%", "Murabaha", "Up to 20 years"],
        ["Banque Saudi Fransi", "~5.90%", "Murabaha / Ijara", "Up to 25 years"],
        ["Arab National Bank", "~5.75%", "Murabaha / Ijara", "Up to 25 years"],
        ["Alinma Bank", "~5.65%", "Murabaha / Musharaka", "Up to 30 years"],
    ];

    const prices = [500000, 750000, 1000000, 1500000, 2000000, 3000000];

    return (<div className="con-calc__results">
        <h4>Saudi Bank Home Financing Rates (Indicative 2025)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Bank</th>
                    <th style={th}>APR</th>
                    <th style={th}>Product</th>
                    <th style={th}>Max Tenure</th>
                </tr></thead>
                <tbody>
                    {banks.map(([name, apr, product, tenure], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{name}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{apr}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{product}</td>
                            <td style={td}>{tenure}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Monthly Payment by Property Price (10% down, 5.5% APR, 25yr)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Property Price</th>
                    <th style={th}>Down (10%)</th>
                    <th style={th}>Loan Amount</th>
                    <th style={th}>Monthly Payment</th>
                    <th style={th}>Min Salary (65% DTI)</th>
                </tr></thead>
                <tbody>
                    {prices.map((p) => {
                        const dp = p * 0.1; const loan = p - dp;
                        const mr = 0.055 / 12; const n = 300;
                        const m = loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
                        const minSal = m / 0.65;
                        return (<tr key={p} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {p.toLocaleString()}</td>
                            <td style={td}>SAR {dp.toLocaleString()}</td>
                            <td style={td}>SAR {loan.toLocaleString()}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(m)}</td>
                            <td style={td}>SAR {fmt(minSal)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Down Payment Rules (SAMA)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Scenario</th>
                    <th style={th}>Min Down Payment</th>
                    <th style={th}>Max LTV</th>
                </tr></thead>
                <tbody>
                    {[
                        ["First Home (Saudi)", "10%", "90%"],
                        ["Second Home", "30%", "70%"],
                        ["Expat (typical)", "20–30%", "70–80%"],
                        ["Off-Plan Property", "Varies (10–20%)", "—"],
                    ].map(([scenario, dp, ltv], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{scenario}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{dp}</td>
                            <td style={td}>{ltv}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Annual Leave Calculator (Articles 109-113) ── */
function LeaveCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 All Leave Types"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🏖️ Annual Leave Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <LeaveCalcTab />}
        {tab === 1 && <LeaveRefTab />}
    </div>);
}

function LeaveCalcTab() {
    const [salary, setSalary] = useState("10000");
    const [years, setYears] = useState("3");
    const [usedDays, setUsedDays] = useState("0");

    const r = useMemo(() => {
        const s = parseFloat(salary) || 0;
        const y = parseFloat(years) || 0;
        const ud = parseFloat(usedDays) || 0;
        if (s <= 0) return null;

        const entitlement = y >= 5 ? 30 : 21;
        const accrualRate = y >= 5 ? 2.5 : 1.75;
        const dailyRate = s / 30;
        const remaining = Math.max(entitlement - ud, 0);
        const leavePay = entitlement * dailyRate;
        const encashmentValue = remaining * dailyRate;

        // Pro-rata for partial year
        const fullMonths = Math.floor((y % 1) * 12);
        const proRataDays = fullMonths > 0 ? Math.round(accrualRate * fullMonths * 10) / 10 : 0;

        return {
            s, y, ud, entitlement, accrualRate, dailyRate, remaining,
            leavePay, encashmentValue, proRataDays,
            steps: [
                `Monthly Salary (actual wage): SAR ${fmt(s)}`,
                `Years of Service: ${y} years`,
                `Leave Entitlement: ${entitlement} days/year (${y >= 5 ? "5+ years — Article 109" : "less than 5 years — Article 109"})`,
                `Accrual Rate: ${accrualRate} days per month`,
                `Daily Rate: SAR ${fmt(s)} ÷ 30 = SAR ${fmt(dailyRate)}`,
                `Days Used This Year: ${ud} days`,
                `Remaining Balance: ${entitlement} − ${ud} = ${remaining} days`,
                `Full Leave Pay Value: ${entitlement} days × SAR ${fmt(dailyRate)} = SAR ${fmt(leavePay)}`,
                `Encashment Value (unused): ${remaining} days × SAR ${fmt(dailyRate)} = SAR ${fmt(encashmentValue)}`,
            ],
        };
    }, [salary, years, usedDays]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Monthly Salary (actual wage)" value={salary} onChange={setSalary} unit="SAR" placeholder="e.g. 10000" />
            <InputField label="Years of Service" value={years} onChange={setYears} unit="years" placeholder="e.g. 3" />
            <InputField label="Leave Days Used This Year" value={usedDays} onChange={setUsedDays} unit="days" placeholder="e.g. 0" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Annual Leave Summary</h4>
            <ResultRow label="Leave Entitlement" value={`${r.entitlement} days/year`} />
            <ResultRow label="Accrual Rate" value={`${r.accrualRate} days/month`} />
            <ResultRow label="Days Used" value={`${r.ud} days`} />
            <ResultRow label="Remaining Balance" value={`${r.remaining} days`} />

            <h4>Leave Pay</h4>
            <ResultRow label="Daily Rate" value={`SAR ${fmt(r.dailyRate)}`} />
            <ResultRow label="Full Leave Pay (all days)" value={`SAR ${fmt(r.leavePay)}`} />
            <ResultRow label="Encashment Value (unused)" value={`SAR ${fmt(r.encashmentValue)}`} />

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ Based on Saudi Labor Law Article 109. Leave pay is calculated on "actual wage" (basic + all regular allowances). Unused leave is encashed at termination (Article 111). Employees cannot forfeit leave for cash during service.
            </div>
        </div>}
    </div>);
}

function LeaveRefTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    const leaves = [
        ["Annual Leave (<5yr)", "21 days", "Full pay", "Art 109"],
        ["Annual Leave (5+yr)", "30 days", "Full pay", "Art 109"],
        ["Sick Leave", "120 days", "30d full + 60d 75% + 30d unpaid", "Art 117"],
        ["Marriage Leave", "5 days", "Full pay", "Art 113"],
        ["Paternity Leave", "3 days", "Full pay (within 7 days of birth)", "Art 113"],
        ["Bereavement (spouse/parent/child)", "5 days", "Full pay", "Art 113"],
        ["Bereavement (sibling)", "3 days", "Full pay (2025 amendment)", "Art 113"],
        ["Maternity Leave", "10 weeks", "Full pay (6wk post-birth mandatory)", "Art 151"],
        ["Hajj Leave", "10–15 days", "Full pay (once, after 2yr service)", "Art 114"],
        ["Iddah (Muslim widow)", "4 months 10 days", "Full pay", "Art 160"],
        ["Study/Exam Leave", "Exam days", "Full pay (if employer approved enrollment)", "Art 115"],
        ["Unpaid Leave", "By agreement", "Unpaid (>20d suspends contract)", "Custom"],
    ];

    return (<div className="con-calc__results">
        <h4>All Saudi Leave Types — Complete Reference</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Leave Type</th>
                    <th style={th}>Duration</th>
                    <th style={{ ...th, textAlign: "left" }}>Pay</th>
                    <th style={th}>Legal Basis</th>
                </tr></thead>
                <tbody>
                    {leaves.map(([type, dur, pay, art], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{type}</td>
                            <td style={{ ...td, fontWeight: 700, whiteSpace: "nowrap" }}>{dur}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{pay}</td>
                            <td style={{ ...td, fontSize: "0.8rem", whiteSpace: "nowrap" }}>{art}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Salary → Leave Pay Lookup</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Monthly Salary</th>
                    <th style={th}>Daily Rate</th>
                    <th style={th}>21-Day Leave Pay</th>
                    <th style={th}>30-Day Leave Pay</th>
                </tr></thead>
                <tbody>
                    {[4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000].map((s) => {
                        const dr = s / 30;
                        return (<tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(dr)}</td>
                            <td style={td}>SAR {fmt(dr * 21)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(dr * 30)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Overtime Calculator (Saudi Labor Law Article 107) ── */
const OT_MULTIPLIER = 1.5;

function OvertimeCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">⏱️ Overtime Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <OvertimeCalcTab />}
        {tab === 1 && <OvertimeRefTab />}
    </div>);
}

function OvertimeCalcTab() {
    const [salary, setSalary] = useState("6000");
    const [dailyHours, setDailyHours] = useState("8");
    const [otHours, setOtHours] = useState("10");
    const [otType, setOtType] = useState("weekday");

    const r = useMemo(() => {
        const s = parseFloat(salary) || 0;
        const dh = parseFloat(dailyHours) || 8;
        const oh = parseFloat(otHours) || 0;
        if (s <= 0 || oh <= 0) return null;

        const hourlyRate = s / 30 / dh;
        const otRate = hourlyRate * OT_MULTIPLIER;
        const otPay = otRate * oh;
        const totalPay = s + otPay;

        return {
            salary: s, dailyHours: dh, otHours: oh, otType,
            hourlyRate, otRate, otPay, totalPay,
            steps: [
                `Monthly Basic Salary: SAR ${fmt(s)}`,
                `Daily Working Hours: ${dh} hours${dh === 6 ? " (Ramadan — Muslim employees)" : ""}`,
                `Hourly Rate: SAR ${fmt(s)} ÷ 30 days ÷ ${dh} hours = SAR ${fmt(hourlyRate)}`,
                `Overtime Rate (150%): SAR ${fmt(hourlyRate)} × 1.5 = SAR ${fmt(otRate)}`,
                `Overtime Type: ${otType === "weekday" ? "Weekday (beyond normal hours)" : otType === "weekend" ? "Weekend (rest day)" : "Public Holiday"} — all at 150%`,
                `Overtime Hours This Month: ${oh} hours`,
                `Overtime Pay: SAR ${fmt(otRate)} × ${oh} = SAR ${fmt(otPay)}`,
                `Total Monthly Pay: SAR ${fmt(s)} + SAR ${fmt(otPay)} = SAR ${fmt(totalPay)}`,
            ],
        };
    }, [salary, dailyHours, otHours, otType]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Monthly Basic Salary" value={salary} onChange={setSalary} unit="SAR" placeholder="e.g. 6000" />
            <SelectField label="Daily Working Hours" value={dailyHours} onChange={setDailyHours} options={[
                { value: "8", label: "8 hours (Normal)" },
                { value: "6", label: "6 hours (Ramadan — Muslim)" },
                { value: "9", label: "9 hours (Extended — Article 99)" },
                { value: "7", label: "7 hours (Hazardous — Article 99)" },
            ]} />
            <InputField label="Overtime Hours (this month)" value={otHours} onChange={setOtHours} unit="hours" placeholder="e.g. 10" />
            <SelectField label="Overtime Type" value={otType} onChange={setOtType} options={[
                { value: "weekday", label: "Weekday (beyond normal hours)" },
                { value: "weekend", label: "Weekend / Rest Day" },
                { value: "holiday", label: "Public Holiday" },
            ]} />
        </div>
        {r && <div className="con-calc__results">
            <h4>Overtime Pay Summary</h4>
            <ResultRow label="Normal Hourly Rate" value={`SAR ${fmt(r.hourlyRate)}`} />
            <ResultRow label="Overtime Rate (150%)" value={`SAR ${fmt(r.otRate)}`} />
            <ResultRow label="Overtime Pay" value={`SAR ${fmt(r.otPay)}`} />
            <ResultRow label="Total Monthly Pay" value={`SAR ${fmt(r.totalPay)}`} />

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ Based on Saudi Labor Law Article 107. All overtime types (weekday, weekend, holiday) are paid at 150%. Overtime is calculated on basic salary only. Max 720 OT hours/year without consent.
            </div>
        </div>}
    </div>);
}

function OvertimeRefTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };
    const salaries = [3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000, 25000];

    return (<div className="con-calc__results">
        <h4>Salary → Overtime Rate Lookup (Normal — 8hr/day)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Monthly Salary</th>
                    <th style={th}>Hourly Rate</th>
                    <th style={th}>OT Rate (150%)</th>
                    <th style={th}>10 OT Hours</th>
                    <th style={th}>20 OT Hours</th>
                </tr></thead>
                <tbody>
                    {salaries.map((s) => {
                        const hr = s / 30 / 8; const ot = hr * 1.5;
                        return (<tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(hr)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(ot)}</td>
                            <td style={td}>SAR {fmt(ot * 10)}</td>
                            <td style={td}>SAR {fmt(ot * 20)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Salary → Overtime Rate Lookup (Ramadan — 6hr/day)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Monthly Salary</th>
                    <th style={th}>Hourly Rate</th>
                    <th style={th}>OT Rate (150%)</th>
                    <th style={th}>10 OT Hours</th>
                    <th style={th}>20 OT Hours</th>
                </tr></thead>
                <tbody>
                    {salaries.map((s) => {
                        const hr = s / 30 / 6; const ot = hr * 1.5;
                        return (<tr key={s} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {s.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(hr)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(ot)}</td>
                            <td style={td}>SAR {fmt(ot * 10)}</td>
                            <td style={td}>SAR {fmt(ot * 20)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Saudi Labor Law — Working Hours Summary</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Article</th>
                    <th style={{ ...th, textAlign: "left" }}>Rule</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Art 98", "Normal: 8hr/day, 48hr/week. Ramadan (Muslim): 6hr/day, 36hr/week"],
                        ["Art 99", "Extended: 9hr for non-continuous work. Reduced: 7hr for hazardous jobs"],
                        ["Art 101", "Max 5 continuous hours without 30-min break. Max 12hr/day at workplace"],
                        ["Art 106", "Exceptions: Inventory, budgets, emergencies (max 30 days/year)"],
                        ["Art 107", "Overtime at 150%. Weekend/holiday = all overtime. Compensatory leave allowed"],
                    ].map(([art, rule], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 700, whiteSpace: "nowrap" }}>{art}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{rule}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── Salary Calculator (KSA — No Income Tax) ── */
function SalaryCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Gross-to-Net", "📊 Salary Table"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">💰 Salary Calculator (KSA)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <SalaryGrossToNetTab />}
        {tab === 1 && <SalaryTableTab />}
    </div>);
}

function SalaryGrossToNetTab() {
    const [basic, setBasic] = useState("8000");
    const [housing, setHousing] = useState("2500");
    const [transport, setTransport] = useState("800");
    const [other, setOther] = useState("0");
    const [nationality, setNationality] = useState("saudi");

    const r = useMemo(() => {
        const b = parseFloat(basic) || 0;
        const h = parseFloat(housing) || 0;
        const t = parseFloat(transport) || 0;
        const o = parseFloat(other) || 0;
        const grossSalary = b + h + t + o;
        if (grossSalary <= 0) return null;

        const gosiBase = b + h; // Only basic + housing
        const contributable = Math.min(Math.max(gosiBase, GOSI_FLOOR), GOSI_CAP);
        const isSaudi = nationality === "saudi";

        const empRate = isSaudi ? GOSI_RATES.saudi.employee.total : 0;
        const errRate = isSaudi ? GOSI_RATES.saudi.employer.total : GOSI_RATES.nonSaudi.employer.total;

        const empGOSI = contributable * empRate;
        const errGOSI = contributable * errRate;
        const netSalary = grossSalary - empGOSI;
        const totalEmployerCost = grossSalary + errGOSI;

        return {
            b, h, t, o, grossSalary, gosiBase, contributable, isSaudi,
            empGOSI, errGOSI, netSalary, totalEmployerCost, empRate, errRate,
            steps: [
                `Basic Salary: SAR ${fmt(b)}`,
                `Housing Allowance: SAR ${fmt(h)}`,
                `Transport Allowance: SAR ${fmt(t)}`,
                ...(o > 0 ? [`Other Allowances: SAR ${fmt(o)}`] : []),
                `Gross Salary: SAR ${fmt(grossSalary)}`,
                `GOSI Base (Basic + Housing): SAR ${fmt(gosiBase)}`,
                contributable !== gosiBase
                    ? `GOSI Base ${contributable < gosiBase ? "capped" : "floored"} at: SAR ${fmt(contributable)}`
                    : `GOSI Base within limits (SAR ${fmt(GOSI_FLOOR, 0)}–${fmt(GOSI_CAP, 0)})`,
                `Income Tax: SAR 0.00 (Saudi Arabia has no personal income tax)`,
                `Employee GOSI (${(empRate * 100).toFixed(2)}%): SAR ${fmt(empGOSI)}`,
                `Net Salary: SAR ${fmt(grossSalary)} − SAR ${fmt(empGOSI)} = SAR ${fmt(netSalary)}`,
                `Employer GOSI (${(errRate * 100).toFixed(2)}%): SAR ${fmt(errGOSI)}`,
                `Total Employer Cost: SAR ${fmt(grossSalary)} + SAR ${fmt(errGOSI)} = SAR ${fmt(totalEmployerCost)}`,
            ],
        };
    }, [basic, housing, transport, other, nationality]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Basic Salary" value={basic} onChange={setBasic} unit="SAR" placeholder="e.g. 8000" />
            <InputField label="Housing Allowance" value={housing} onChange={setHousing} unit="SAR" placeholder="e.g. 2500" />
            <InputField label="Transport Allowance" value={transport} onChange={setTransport} unit="SAR" placeholder="e.g. 800" />
            <InputField label="Other Allowances" value={other} onChange={setOther} unit="SAR" placeholder="e.g. 500" />
            <SelectField label="Nationality" value={nationality} onChange={setNationality} options={[
                { value: "saudi", label: "Saudi National" },
                { value: "nonSaudi", label: "Non-Saudi (Expatriate)" },
            ]} />
        </div>
        {r && <div className="con-calc__results">
            <h4>Monthly Salary Summary</h4>
            <ResultRow label="Gross Salary" value={`SAR ${fmt(r.grossSalary)}`} />
            <ResultRow label="Income Tax" value="SAR 0.00 (no income tax)" />
            <ResultRow label="Employee GOSI Deduction" value={`SAR ${fmt(r.empGOSI)}`} />
            <ResultRow label="Net Salary (Take-Home)" value={`SAR ${fmt(r.netSalary)}`} />

            <h4>Employer Cost</h4>
            <ResultRow label="Employer GOSI" value={`SAR ${fmt(r.errGOSI)}`} />
            <ResultRow label="Total Employer Cost" value={`SAR ${fmt(r.totalEmployerCost)}`} />

            <h4>Annual Summary</h4>
            <ResultRow label="Annual Gross" value={`SAR ${fmt(r.grossSalary * 12)}`} />
            <ResultRow label="Annual Net" value={`SAR ${fmt(r.netSalary * 12)}`} />
            <ResultRow label="Annual GOSI (Employee)" value={`SAR ${fmt(r.empGOSI * 12)}`} />

            <h4>Step‑by‑Step</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ Saudi Arabia has no personal income tax. GOSI is the only mandatory payroll deduction. Rates based on 2025 GOSI schedule.
            </div>
        </div>}
    </div>);
}

function SalaryTableTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    // Standard package: 60% basic, 25% housing, 10% transport, 5% other
    const packages = [4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000];

    return (<div className="con-calc__results">
        <h4>Saudi National — Salary → Net Pay Lookup</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--s-2)" }}>
            Assumes standard package: 60% basic, 25% housing, 10% transport, 5% other
        </p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Total Package</th>
                    <th style={th}>Basic (60%)</th>
                    <th style={th}>Housing (25%)</th>
                    <th style={th}>GOSI Base</th>
                    <th style={th}>GOSI Deduction</th>
                    <th style={th}>Net Salary</th>
                </tr></thead>
                <tbody>
                    {packages.map((pkg) => {
                        const bas = pkg * 0.6;
                        const hou = pkg * 0.25;
                        const gosiBase = Math.min(bas + hou, GOSI_CAP);
                        const gosi = gosiBase * 0.0975;
                        const net = pkg - gosi;
                        return (<tr key={pkg} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {pkg.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(bas)}</td>
                            <td style={td}>SAR {fmt(hou)}</td>
                            <td style={td}>SAR {fmt(gosiBase)}</td>
                            <td style={td}>SAR {fmt(gosi)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(net)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Non-Saudi (Expatriate) — Salary → Net Pay</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "var(--s-2)" }}>
            No GOSI deduction from employee — net salary equals gross salary
        </p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Total Package</th>
                    <th style={th}>Employee GOSI</th>
                    <th style={th}>Net Salary</th>
                    <th style={th}>Employer Hazards (2%)</th>
                </tr></thead>
                <tbody>
                    {packages.map((pkg) => {
                        const bas = pkg * 0.6;
                        const hou = pkg * 0.25;
                        const gosiBase = Math.min(bas + hou, GOSI_CAP);
                        return (<tr key={pkg} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {pkg.toLocaleString()}</td>
                            <td style={td}>SAR 0.00</td>
                            <td style={{ ...td, fontWeight: 700 }}>SAR {fmt(pkg)}</td>
                            <td style={td}>SAR {fmt(gosiBase * 0.02)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>Typical Salary Package Structure</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Component</th>
                    <th style={th}>Typical Range</th>
                    <th style={{ ...th, textAlign: "left" }}>Notes</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Basic Salary", "40–60%", "Foundation for GOSI & EOSB calculations"],
                        ["Housing Allowance", "25–35%", "Included in GOSI base; may be actual housing instead"],
                        ["Transport Allowance", "5–10%", "NOT included in GOSI base"],
                        ["Food/Meal Allowance", "0–5%", "Optional; NOT in GOSI base"],
                        ["Phone/Internet", "0–3%", "Optional; NOT in GOSI base"],
                        ["Annual Bonus", "Varies", "Performance-based; NOT in GOSI base"],
                    ].map(([comp, range, notes], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{comp}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{range}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

/* ── VAT Calculator (Saudi Arabia 15%) ── */
const VAT_RATE = 0.15;

function VATCalc() {
    const [tab, setTab] = useState(0);
    const tabs = ["➕ Add VAT", "➖ Remove VAT", "📊 Quick Reference"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">🧾 VAT Calculator (KSA — 15%)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <VATAddTab />}
        {tab === 1 && <VATRemoveTab />}
        {tab === 2 && <VATReferenceTab />}
    </div>);
}

function VATAddTab() {
    const [price, setPrice] = useState("1000");

    const r = useMemo(() => {
        const p = parseFloat(price) || 0;
        if (p <= 0) return null;
        const vatAmount = p * VAT_RATE;
        const totalIncl = p + vatAmount;
        return {
            priceExcl: p, vatAmount, totalIncl,
            steps: [
                `Price (excl. VAT): SAR ${fmt(p)}`,
                `VAT Rate: 15%`,
                `VAT Amount: SAR ${fmt(p)} × 0.15 = SAR ${fmt(vatAmount)}`,
                `Total (incl. VAT): SAR ${fmt(p)} + SAR ${fmt(vatAmount)} = SAR ${fmt(totalIncl)}`,
            ],
        };
    }, [price]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Price (excluding VAT)" value={price} onChange={setPrice} unit="SAR" placeholder="e.g. 1000" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Result — Add 15% VAT</h4>
            <ResultRow label="Price (excl. VAT)" value={`SAR ${fmt(r.priceExcl)}`} />
            <ResultRow label="VAT Amount (15%)" value={`SAR ${fmt(r.vatAmount)}`} />
            <ResultRow label="Total (incl. VAT)" value={`SAR ${fmt(r.totalIncl)}`} />
            <h4>Calculation</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
        </div>}
    </div>);
}

function VATRemoveTab() {
    const [price, setPrice] = useState("1150");

    const r = useMemo(() => {
        const p = parseFloat(price) || 0;
        if (p <= 0) return null;
        const priceExcl = p / (1 + VAT_RATE);
        const vatAmount = p - priceExcl;
        return {
            totalIncl: p, priceExcl, vatAmount,
            steps: [
                `Total Price (incl. VAT): SAR ${fmt(p)}`,
                `VAT Rate: 15%`,
                `Original Price: SAR ${fmt(p)} ÷ 1.15 = SAR ${fmt(priceExcl)}`,
                `VAT Component: SAR ${fmt(p)} − SAR ${fmt(priceExcl)} = SAR ${fmt(vatAmount)}`,
            ],
        };
    }, [price]);

    return (<div>
        <div className="con-calc__inputs">
            <InputField label="Price (including VAT)" value={price} onChange={setPrice} unit="SAR" placeholder="e.g. 1150" />
        </div>
        {r && <div className="con-calc__results">
            <h4>Result — Remove 15% VAT</h4>
            <ResultRow label="Original Price (excl. VAT)" value={`SAR ${fmt(r.priceExcl)}`} />
            <ResultRow label="VAT Component (15%)" value={`SAR ${fmt(r.vatAmount)}`} />
            <ResultRow label="Total (incl. VAT)" value={`SAR ${fmt(r.totalIncl)}`} />
            <h4>Calculation</h4>
            {r.steps.map((s, i) => <ResultRow key={i} label={`Step ${i + 1}`} value={s} />)}
        </div>}
    </div>);
}

function VATReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        <h4>Common Price → VAT Lookup</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Price (excl. VAT)</th>
                    <th style={th}>VAT (15%)</th>
                    <th style={th}>Total (incl. VAT)</th>
                </tr></thead>
                <tbody>
                    {[50, 100, 200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000].map((p) => (
                        <tr key={p} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>SAR {p.toLocaleString()}</td>
                            <td style={td}>SAR {fmt(p * 0.15)}</td>
                            <td style={{ ...td, fontWeight: 600 }}>SAR {fmt(p * 1.15)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>VAT Classification Summary</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>Rate</th>
                    <th style={{ ...th, textAlign: "left" }}>Examples</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Standard Rated", "15%", "Most goods & services, electronics, clothing, restaurants, fuel"],
                        ["Zero-Rated", "0%", "Exports, international transport, qualifying medicines, 99%+ precious metals"],
                        ["Exempt", "N/A", "Financial services, residential leasing, local passenger transport"],
                    ].map(([cat, rate, ex], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{cat}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{rate}</td>
                            <td style={{ ...tl, fontSize: "0.8rem" }}>{ex}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <h4 style={{ marginTop: "var(--s-4)" }}>VAT Registration Thresholds</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Type</th>
                    <th style={th}>Threshold</th>
                    <th style={{ ...th, textAlign: "left" }}>Requirement</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Mandatory</td><td style={{ ...td, fontWeight: 700 }}>SAR 375,000</td><td style={tl}>Annual taxable supplies exceed this amount</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Voluntary</td><td style={{ ...td, fontWeight: 700 }}>SAR 187,500</td><td style={tl}>Annual supplies exceed this — optional registration</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Non-Resident</td><td style={{ ...td, fontWeight: 700 }}>SAR 0</td><td style={tl}>Must register regardless of turnover</td></tr>
                </tbody>
            </table>
        </div>
    </div>);
}

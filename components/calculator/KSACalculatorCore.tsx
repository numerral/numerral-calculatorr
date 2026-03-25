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

export default function KSACalculatorCore({ calcType }: { calcType: string }) {
    if (calcType === "eosb") return <EOSBCalc />;
    if (calcType === "gosi") return <GOSICalc />;
    if (calcType === "vat") return <VATCalc />;
    if (calcType === "salary") return <SalaryCalc />;
    return <p>Calculator not found: {calcType}</p>;
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

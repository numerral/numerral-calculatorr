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

export default function KSACalculatorCore({ calcType }: { calcType: string }) {
    if (calcType === "eosb") return <EOSBCalc />;
    return <p>Calculator not found: {calcType}</p>;
}

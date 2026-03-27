"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;

function ResultRow({ label, value, highlight, warn }: { label: string; value: string; highlight?: boolean; warn?: boolean }) {
    return (<div className="con-result-row" style={highlight ? { background: "rgba(0,150,57,0.06)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : warn ? { background: "rgba(234,179,8,0.08)", borderRadius: 6, padding: "11px 8px", margin: "2px -8px" } : undefined}>
        <span className="con-result-row__label">{label}</span>
        <span className="con-result-row__value" style={highlight ? { color: "#009639", fontWeight: 800, fontSize: "1.1rem" } : warn ? { color: "#b45309", fontWeight: 700 } : undefined}>{value}</span>
    </div>);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder, id, type }: {
    label: string; value: string; onChange: (v: string) => void; unit?: string; min?: number; max?: number; step?: number; placeholder?: string; id?: string; type?: string;
}) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}{unit ? <span className="con-input__unit"> ({unit})</span> : null}</label>
        <input id={id} type={type || "number"} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)} min={min} max={max} step={step || 1} placeholder={placeholder} /></div>);
}

function SelectField({ label, value, onChange, options, id }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; id?: string }) {
    return (<div className="con-input"><label className="con-input__label" htmlFor={id}>{label}</label>
        <select id={id} className="con-input__field" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>);
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAESalaryCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["💰 Salary Breakdown", "⏰ Overtime", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">💼 UAE Salary Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <SalaryTab />}
        {tab === 1 && <OvertimeTab />}
        {tab === 2 && <ReferenceTab />}
    </div>);
}

/* ── Salary Breakdown Tab ── */
function SalaryTab() {
    const [workerType, setWorkerType] = useState("expat");
    const [grossSalary, setGrossSalary] = useState("15000");
    const [basicPercent, setBasicPercent] = useState("60");
    const [housingAllowance, setHousingAllowance] = useState("");
    const [transportAllowance, setTransportAllowance] = useState("");
    const [otherAllowance, setOtherAllowance] = useState("");
    const [gpssaType, setGpssaType] = useState("new"); // "old" = 5%, "new" = 11%
    const [inputMode, setInputMode] = useState("percentage"); // "percentage" or "manual"

    const result = useMemo(() => {
        const gross = parseFloat(grossSalary) || 0;
        if (gross <= 0) return null;

        let basic: number;
        let housing: number;
        let transport: number;
        let other: number;

        if (inputMode === "percentage") {
            const bp = parseFloat(basicPercent) || 60;
            basic = gross * (bp / 100);
            housing = gross * 0.25;
            transport = gross * 0.10;
            other = gross - basic - housing - transport;
        } else {
            basic = gross * ((parseFloat(basicPercent) || 60) / 100);
            housing = parseFloat(housingAllowance) || 0;
            transport = parseFloat(transportAllowance) || 0;
            other = parseFloat(otherAllowance) || 0;
            // Recalculate basic as remainder if manual
            const totalAllowances = housing + transport + other;
            basic = gross - totalAllowances;
            if (basic < 0) basic = 0;
        }

        // Deductions
        let pensionDeduction = 0;
        let pensionLabel = "";
        if (workerType === "emirati") {
            const rate = gpssaType === "old" ? 0.05 : 0.11;
            const cap = 70000; // AED 70K cap for private sector
            const pensionable = Math.min(basic, cap);
            pensionDeduction = pensionable * rate;
            pensionLabel = gpssaType === "old" ? "GPSSA Pension (5%)" : "GPSSA Pension (11%)";
        }

        // Unemployment insurance
        const unemploymentInsurance = gross > 16000 ? 10 : 5;

        const totalDeductions = pensionDeduction + unemploymentInsurance;
        const netSalary = gross - totalDeductions;

        return {
            gross,
            basic,
            housing,
            transport,
            other,
            pensionDeduction,
            pensionLabel,
            unemploymentInsurance,
            totalDeductions,
            netSalary,
            annual: netSalary * 12,
            daily: netSalary / 30,
            hourly: netSalary / 30 / 8,
            gratuityBase: basic, // For gratuity reference
        };
    }, [grossSalary, basicPercent, housingAllowance, transportAllowance, otherAllowance, workerType, gpssaType, inputMode]);

    return (<div>
        <div className="con-calc__inputs">
            {/* Worker type toggle */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[
                    { v: "expat", l: "🌍 Expatriate" },
                    { v: "emirati", l: "🇦🇪 UAE National" },
                ].map((w) => (
                    <button key={w.v} onClick={() => setWorkerType(w.v)}
                        className={`calc-tab-btn${workerType === w.v ? " calc-tab-btn--active" : ""}`}
                        style={{ fontSize: "0.85rem", padding: "6px 14px" }}>{w.l}</button>
                ))}
            </div>

            {workerType === "expat" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🌍 <strong>No income tax</strong> in the UAE. Your gross salary is nearly equal to your net salary, minus only unemployment insurance (AED {parseFloat(grossSalary) > 16000 ? "10" : "5"}/month).
            </div>}
            {workerType === "emirati" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🇦🇪 UAE nationals have <strong>GPSSA/ADPF pension deductions</strong> from basic salary. No income tax. Select your joining date to determine the correct rate.
            </div>}

            <InputField id="uae-gross" label="Monthly Gross Salary" value={grossSalary} onChange={setGrossSalary} unit="AED/month" min={0} placeholder="e.g. 15000" />

            <div style={{ display: "flex", gap: 8, marginBottom: 8, marginTop: 8 }}>
                {[
                    { v: "percentage", l: "% Split" },
                    { v: "manual", l: "Manual Entry" },
                ].map((m) => (
                    <button key={m.v} onClick={() => setInputMode(m.v)}
                        style={{ fontSize: "0.78rem", padding: "4px 10px", background: inputMode === m.v ? "var(--accent)" : "transparent", color: inputMode === m.v ? "white" : "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer" }}>{m.l}</button>
                ))}
            </div>

            {inputMode === "percentage" ? (
                <InputField id="uae-basic-pct" label="Basic Salary %" value={basicPercent} onChange={setBasicPercent} unit="%" min={40} max={100} placeholder="60" />
            ) : (
                <>
                    <InputField id="uae-housing" label="Housing Allowance" value={housingAllowance} onChange={setHousingAllowance} unit="AED" min={0} placeholder="e.g. 3750" />
                    <InputField id="uae-transport" label="Transport Allowance" value={transportAllowance} onChange={setTransportAllowance} unit="AED" min={0} placeholder="e.g. 1500" />
                    <InputField id="uae-other" label="Other Allowances" value={otherAllowance} onChange={setOtherAllowance} unit="AED" min={0} placeholder="e.g. 750" />
                </>
            )}

            {workerType === "emirati" && (
                <SelectField id="uae-gpssa" label="GPSSA Joining Date" value={gpssaType} onChange={setGpssaType} options={[
                    { value: "old", label: "Before October 31, 2023 (5% rate)" },
                    { value: "new", label: "On/After October 31, 2023 (11% rate)" },
                ]} />
            )}
        </div>

        {/* Results */}
        {result && <div className="con-calc__results">
            <h4>Salary Breakdown</h4>

            {/* Components */}
            <div style={{ marginBottom: "var(--s-3)" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Salary Components</p>
                <ResultRow label="Basic Salary" value={fmtAED(result.basic, 2)} />
                <ResultRow label="Housing Allowance" value={fmtAED(result.housing, 2)} />
                <ResultRow label="Transport Allowance" value={fmtAED(result.transport, 2)} />
                {result.other > 0 && <ResultRow label="Other Allowances" value={fmtAED(result.other, 2)} />}
                <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6 }}>
                    <ResultRow label="Gross Monthly Salary" value={fmtAED(result.gross, 2)} />
                </div>
            </div>

            {/* Deductions */}
            <div style={{ marginBottom: "var(--s-3)" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Deductions</p>
                {workerType === "emirati" && result.pensionDeduction > 0 && (
                    <ResultRow label={result.pensionLabel} value={`− ${fmtAED(result.pensionDeduction, 2)}`} warn />
                )}
                <ResultRow label="Unemployment Insurance" value={`− ${fmtAED(result.unemploymentInsurance, 2)}`} />
                <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6 }}>
                    <ResultRow label="Total Deductions" value={`− ${fmtAED(result.totalDeductions, 2)}`} warn />
                </div>
            </div>

            {/* Net Take-Home */}
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: "var(--s-3)" }}>
                <ResultRow label="Net Monthly Take-Home" value={fmtAED(result.netSalary, 2)} highlight />
                <ResultRow label="Net Annual Salary" value={fmtAED(result.annual, 2)} />
                <ResultRow label="Daily Rate (30 days)" value={fmtAED(result.daily, 2)} />
                <ResultRow label="Hourly Rate (8 hrs/day)" value={fmtAED(result.hourly, 2)} />
            </div>

            {/* Gratuity note */}
            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem" }}>
                💡 <strong>Gratuity calculation note:</strong> Your end-of-service gratuity is based on <strong>basic salary only</strong> ({fmtAED(result.gratuityBase, 2)}/month). Use our <a href="/uae/gratuity-calculator" style={{ color: "#009639", textDecoration: "underline" }}>UAE Gratuity Calculator</a> for a detailed estimate.
            </div>

            {workerType === "emirati" && <div style={{ marginTop: 8, padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.82rem" }}>
                ⚠️ Employer also contributes <strong>{gpssaType === "old" ? "12.5%" : "15%"}</strong> to GPSSA on your behalf. For Abu Dhabi nationals, ADPF rates may differ. Pensionable salary capped at AED 70,000/month (private sector).
            </div>}
        </div>}
    </div>);
}

/* ── Overtime Tab ── */
function OvertimeTab() {
    const [basicSalary, setBasicSalary] = useState("9000");
    const [otHours, setOtHours] = useState("10");
    const [otType, setOtType] = useState("normal");

    const result = useMemo(() => {
        const basic = parseFloat(basicSalary) || 0;
        const hours = parseFloat(otHours) || 0;
        if (basic <= 0 || hours <= 0) return null;

        const hourlyBasic = basic / 30 / 8;
        let multiplier: number;
        let label: string;

        if (otType === "normal") {
            multiplier = 1.25;
            label = "Normal Overtime (125%)";
        } else if (otType === "night") {
            multiplier = 1.50;
            label = "Night Overtime 9PM–4AM (150%)";
        } else {
            multiplier = 1.50;
            label = "Friday/Holiday Overtime (150%)";
        }

        const otRate = hourlyBasic * multiplier;
        const totalOT = otRate * hours;

        return {
            hourlyBasic,
            multiplier,
            label,
            otRate,
            hours,
            totalOT,
        };
    }, [basicSalary, otHours, otType]);

    return (<div>
        <div className="con-calc__inputs">
            <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ⏰ Overtime is calculated on <strong>basic salary only</strong> (not gross). Formula: Basic ÷ 30 ÷ 8 × multiplier × hours. Max 2 hours OT per day per UAE Labour Law Article 19.
            </div>
            <InputField id="ot-basic" label="Monthly Basic Salary" value={basicSalary} onChange={setBasicSalary} unit="AED" min={0} placeholder="e.g. 9000" />
            <InputField id="ot-hours" label="Overtime Hours" value={otHours} onChange={setOtHours} min={0} max={60} placeholder="e.g. 10" />
            <SelectField id="ot-type" label="Overtime Type" value={otType} onChange={setOtType} options={[
                { value: "normal", label: "Normal OT — Weekday (125%)" },
                { value: "night", label: "Night OT — 9PM to 4AM (150%)" },
                { value: "friday", label: "Friday / Public Holiday (150%)" },
            ]} />
        </div>

        {result && <div className="con-calc__results">
            <h4>Overtime Calculation</h4>
            <ResultRow label="Hourly Basic Rate" value={`${fmtAED(result.hourlyBasic, 2)}/hr`} />
            <ResultRow label="Formula" value={`${fmtAED(result.hourlyBasic, 2)} ÷ hr × ${result.multiplier}x = ${fmtAED(result.otRate, 2)}/hr`} />
            <ResultRow label={result.label} value={`${fmtAED(result.otRate, 2)}/hr`} />
            <ResultRow label={`Total OT (${result.hours} hours)`} value={fmtAED(result.totalOT, 2)} highlight />

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ UAE Labour Law (Article 19): Maximum 2 hours overtime per day. Employee may work on Friday with day-in-lieu or 150% pay. Exemptions: senior management, maritime, oil &amp; gas.
            </div>
        </div>}
    </div>);
}

/* ══════════════════════════════════════════════════
   REFERENCE TAB
   ══════════════════════════════════════════════════ */
function ReferenceTab() {
    const ts = { width: "100%", fontSize: "0.85rem", borderCollapse: "collapse" as const };
    const th = { padding: "8px 12px", textAlign: "center" as const };
    const td = { padding: "6px 12px", textAlign: "center" as const };
    const tl = { ...td, textAlign: "left" as const };
    const b = { borderBottom: "1px solid var(--border)" };
    const bh = { borderBottom: "2px solid var(--border)" };

    return (<div className="con-calc__results">
        {/* Salary Components */}
        <h4>Typical UAE Salary Structure</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Component</th>
                    <th style={th}>% of Gross</th>
                    <th style={{ ...th, textAlign: "left" }}>Notes</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Basic Salary", "50–60%", "Base for gratuity, overtime, and pension calculations"],
                        ["Housing Allowance", "20–30%", "Cash, company-provided, or reimbursement"],
                        ["Transport Allowance", "5–10%", "Commuting costs — some provide company car instead"],
                        ["Other Allowances", "5–15%", "Food, phone, education, COLA, etc."],
                    ] as string[][]).map(([c, pct, note], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{c}</td><td style={{ ...td, fontWeight: 700 }}>{pct}</td><td style={tl}>{note}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* GPSSA Pension */}
        <h4 style={{ marginTop: "var(--s-4)" }}>GPSSA/ADPF Pension Rates (UAE Nationals Only)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>Employee</th>
                    <th style={th}>Employer</th>
                    <th style={th}>Government</th>
                    <th style={th}>Total</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Joined before Oct 31, 2023</td><td style={{ ...td, fontWeight: 700 }}>5%</td><td style={td}>12.5%</td><td style={td}>2.5%</td><td style={{ ...td, fontWeight: 700 }}>20%</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Joined on/after Oct 31, 2023</td><td style={{ ...td, fontWeight: 700, color: "#dc2626" }}>11%</td><td style={td}>15%</td><td style={td}>—</td><td style={{ ...td, fontWeight: 700 }}>26%</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Abu Dhabi (ADPF, existing)</td><td style={{ ...td, fontWeight: 700 }}>5%</td><td style={td}>15%</td><td style={td}>6%</td><td style={{ ...td, fontWeight: 700 }}>26%</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Abu Dhabi (ADPF, new after Dec 2023)</td><td style={{ ...td, fontWeight: 700, color: "#dc2626" }}>11%</td><td style={td}>15%</td><td style={td}>—</td><td style={{ ...td, fontWeight: 700 }}>26%</td></tr>
                </tbody>
            </table>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>Private sector cap: AED 70,000/month. Government sector cap: AED 100,000./month.</div>
        </div>

        {/* MOHRE Salary Guidelines */}
        <h4 style={{ marginTop: "var(--s-4)" }}>MOHRE Salary Guidelines by Skill Level</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>Qualification</th>
                    <th style={th}>Min Salary Guideline</th>
                    <th style={{ ...th, textAlign: "left" }}>Examples</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Level 1 (Skilled)", "Bachelor's or higher", "AED 12,000–15,000", "Managers, engineers, doctors"],
                        ["Level 2 (Skilled)", "Diploma", "AED 5,000–8,000", "Technicians, architects, developers"],
                        ["Level 3 (Skilled)", "High school", "AED 4,000–5,000", "Sales, admin, customer service"],
                        ["Level 4-5 (Semi-skilled)", "Vocational", "AED 2,500–4,000", "Machine operators, drivers"],
                        ["Level 6-9 (Unskilled)", "None required", "AED 1,200–1,500", "Laborers, cleaners, helpers"],
                    ] as string[][]).map(([cat, qual, min, ex], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{cat}</td><td style={td}>{qual}</td><td style={{ ...td, fontWeight: 700 }}>{min}</td><td style={tl}>{ex}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Leave Entitlements */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Leave Entitlements — UAE Labour Law</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Leave Type</th>
                    <th style={th}>Entitlement</th>
                    <th style={{ ...th, textAlign: "left" }}>Conditions</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Annual Leave", "30 calendar days", "After 1 year; 2 days/month for 6–12 months"],
                        ["Sick Leave", "90 days/year", "Full pay 15 days, half pay 30 days, unpaid 45 days"],
                        ["Maternity Leave", "60 days", "Full pay 45 days, half pay 15 days. 45 extra unpaid. Must have 1+ year service"],
                        ["Paternity Leave", "5 working days", "Within 6 months of birth"],
                        ["Bereavement Leave", "3–5 days", "5 days (spouse), 3 days (other relatives)"],
                        ["Hajj Leave", "30 days unpaid", "Once during employment, for Muslim employees"],
                        ["Study Leave", "10 working days", "For UAE national employees after 2+ years"],
                        ["National Service", "As required", "For UAE national males — salary maintained"],
                        ["Public Holidays", "~14 days/year", "Paid — New Year, Eid, National Day, etc."],
                    ] as string[][]).map(([type, entitlement, cond], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{type}</td><td style={{ ...td, fontWeight: 700 }}>{entitlement}</td><td style={tl}>{cond}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Overtime Rates */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Overtime Rates</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Type</th>
                    <th style={th}>Rate</th>
                    <th style={{ ...th, textAlign: "left" }}>Details</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Normal Weekday OT", "125% of basic hourly", "During regular hours — max 2 hrs/day"],
                        ["Night OT (9PM–4AM)", "150% of basic hourly", "Night shift premium applies"],
                        ["Friday / Public Holiday", "150% of basic hourly", "Or day off in lieu + 50% pay"],
                    ] as string[][]).map(([type, rate, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{type}</td><td style={{ ...td, fontWeight: 700, color: "#009639" }}>{rate}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>OT formula: (Basic Salary ÷ 30 ÷ 8) × multiplier × hours. Exempt: senior management, maritime.</div>
        </div>

        {/* WPS Rules */}
        <h4 style={{ marginTop: "var(--s-4)" }}>WPS Compliance Rules</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Rule</th>
                    <th style={{ ...th, textAlign: "left" }}>Detail</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Payment method", "Must pay via WPS (electronic transfer)"],
                        ["Due date", "One day after contractual payday"],
                        ["Late threshold", "After 15 days past due date"],
                        ["Minimum coverage", "At least 90% of staff paid each month"],
                        ["New employee registration", "Within 30 days of joining"],
                        ["Domestic workers", "Included in WPS since April 1, 2025"],
                        ["Non-compliance", "Fines, work permit suspension, legal action"],
                    ] as string[][]).map(([rule, detail], i) => (
                        <tr key={i} style={b}><td style={{ ...tl, fontWeight: 600 }}>{rule}</td><td style={tl}>{detail}</td></tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

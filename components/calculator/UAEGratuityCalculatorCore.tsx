"use client";
import { useState, useMemo } from "react";

/* ── Helpers ── */
const fmtAED = (n: number, d = 0) => `AED ${n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d })}`;
const fmt = (n: number, d = 2) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

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

/* ── Service period calculation ── */
function calcServicePeriod(start: string, end: string) {
    if (!start || !end) return null;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e <= s) return null;
    const diffMs = e.getTime() - s.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // Calculate years, months, remaining days
    let years = e.getFullYear() - s.getFullYear();
    let months = e.getMonth() - s.getMonth();
    let days = e.getDate() - s.getDate();
    if (days < 0) { months--; const prev = new Date(e.getFullYear(), e.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalYears = totalDays / 365.25;
    return { years, months, days, totalDays, totalYears };
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════ */
export default function UAEGratuityCalculatorCore() {
    const [tab, setTab] = useState(0);
    const tabs = ["🧮 Calculator", "📋 Reference Tables"];
    return (<div className="con-calc">
        <h3 className="con-calc__title">💼 UAE Gratuity Calculator</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-1)", marginBottom: "var(--s-3)" }}>
            {tabs.map((t, i) => <button key={i} onClick={() => setTab(i)} className={`calc-tab-btn${tab === i ? " calc-tab-btn--active" : ""}`}>{t}</button>)}
        </div>
        {tab === 0 && <CalculatorTab />}
        {tab === 1 && <ReferenceTab />}
    </div>);
}

/* ── Calculator Tab ── */
function CalculatorTab() {
    const [category, setCategory] = useState("private");
    const [basicSalary, setBasicSalary] = useState("10000");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [partTimeHours, setPartTimeHours] = useState("20");
    const [fullTimeHours, setFullTimeHours] = useState("48");

    const result = useMemo(() => {
        const salary = parseFloat(basicSalary) || 0;
        if (salary <= 0) return null;
        const sp = calcServicePeriod(startDate, endDate);
        if (!sp) return null;
        if (sp.totalYears < 1) return { eligible: false, sp, salary, category, reason: "Minimum 1 year of continuous service required" };

        const dailyWage = salary / 30;
        const twoYearCap = salary * 24; // 2 years = 24 months

        let gratuity = 0;
        const steps: { label: string; value: string; note?: string }[] = [];

        steps.push({ label: "Total Service Period", value: `${sp.years} years, ${sp.months} months, ${sp.days} days` });
        steps.push({ label: "Service in Years (decimal)", value: fmt(sp.totalYears, 4) });
        steps.push({ label: "Basic Monthly Salary", value: fmtAED(salary) });
        steps.push({ label: "Daily Wage (Salary ÷ 30)", value: fmtAED(dailyWage, 2) });

        if (category === "domestic") {
            // Domestic workers: 14 days per year
            gratuity = 14 * dailyWage * sp.totalYears;
            steps.push({ label: "Formula", value: "14 days × daily wage × years", note: "Federal Decree-Law No. 9 of 2022" });
            steps.push({ label: "Gratuity (14 × " + fmtAED(dailyWage, 2) + " × " + fmt(sp.totalYears, 2) + ")", value: fmtAED(gratuity) });
        } else if (category === "difc") {
            // DIFC DEWS — contribution-based
            const rate5 = 0.0583;
            const rate5plus = 0.0833;
            const monthlyContrib5 = salary * rate5;
            const monthlyContrib5plus = salary * rate5plus;
            const yearsUnder5 = Math.min(sp.totalYears, 5);
            const yearsOver5 = Math.max(sp.totalYears - 5, 0);
            const totalContrib = (monthlyContrib5 * yearsUnder5 * 12) + (monthlyContrib5plus * yearsOver5 * 12);
            gratuity = totalContrib;
            steps.push({ label: "DIFC DEWS Model", value: "Defined contribution (not lump sum)", note: "DEWS Plan — effective Feb 2020" });
            steps.push({ label: "Monthly Contribution (≤ 5 years)", value: `${fmtAED(monthlyContrib5)} (5.83% of basic)` });
            if (yearsOver5 > 0) steps.push({ label: "Monthly Contribution (> 5 years)", value: `${fmtAED(monthlyContrib5plus)} (8.33% of basic)` });
            steps.push({ label: "Total Employer Contributions (est.)", value: fmtAED(totalContrib), note: "Actual amount depends on investment returns" });
        } else {
            // Private sector, ADGM, or Part-time — standard 21/30-day formula
            const yearsFirst5 = Math.min(sp.totalYears, 5);
            const yearsAfter5 = Math.max(sp.totalYears - 5, 0);
            const gratFirst5 = 21 * dailyWage * yearsFirst5;
            const gratAfter5 = 30 * dailyWage * yearsAfter5;
            gratuity = gratFirst5 + gratAfter5;

            steps.push({ label: "Gratuity for first 5 years", value: `21 × ${fmtAED(dailyWage, 2)} × ${fmt(yearsFirst5, 2)} = ${fmtAED(gratFirst5)}` });
            if (yearsAfter5 > 0) {
                steps.push({ label: "Gratuity beyond 5 years", value: `30 × ${fmtAED(dailyWage, 2)} × ${fmt(yearsAfter5, 2)} = ${fmtAED(gratAfter5)}` });
            }
            steps.push({ label: "Sub-total", value: fmtAED(gratuity) });

            // Part-time pro-rata
            if (category === "parttime") {
                const ptH = parseFloat(partTimeHours) || 20;
                const ftH = parseFloat(fullTimeHours) || 48;
                const ratio = ptH / ftH;
                const fullGratuity = gratuity;
                gratuity = gratuity * ratio;
                steps.push({ label: "Part-Time Ratio", value: `${ptH}hrs ÷ ${ftH}hrs = ${fmt(ratio * 100, 1)}%` });
                steps.push({ label: "Adjusted Gratuity", value: `${fmtAED(fullGratuity)} × ${fmt(ratio * 100, 1)}% = ${fmtAED(gratuity)}` });
            }
        }

        // Cap check (not applied to DIFC DEWS)
        let capped = false;
        if (category !== "difc") {
            if (gratuity > twoYearCap) {
                capped = true;
                steps.push({ label: "2-Year Salary Cap", value: `${fmtAED(twoYearCap)} — gratuity exceeds cap`, note: "Capped per Article 51, Federal Decree-Law 33/2021" });
                gratuity = twoYearCap;
            } else {
                steps.push({ label: "2-Year Salary Cap Check", value: `${fmtAED(gratuity)} < ${fmtAED(twoYearCap)} ✅ Within limit` });
            }
        }

        // ADGM note
        if (category === "adgm") {
            steps.push({ label: "ADGM Note", value: "Check if employer uses optional savings scheme (effective April 2025)", note: "Employment Regulations 2024" });
        }

        return { eligible: true, sp, salary, category, gratuity, steps, capped, twoYearCap, dailyWage };
    }, [category, basicSalary, startDate, endDate, partTimeHours, fullTimeHours]);

    return (<div>
        <div className="con-calc__inputs">
            <SelectField id="uae-grat-category" label="Worker Category" value={category} onChange={setCategory} options={[
                { value: "private", label: "🏢 Private Sector Employee" },
                { value: "domestic", label: "🏠 Domestic Worker" },
                { value: "parttime", label: "⏰ Part-Time Employee" },
                { value: "difc", label: "🏦 DIFC Employee (DEWS)" },
                { value: "adgm", label: "🏢 ADGM Employee" },
            ]} />

            {category === "private" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                📋 Standard UAE Labour Law — Federal Decree-Law No. 33 of 2021. All contracts are now fixed-term (limited). Full gratuity for both resignation and termination.
            </div>}
            {category === "domestic" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏠 Governed by Federal Decree-Law No. 9 of 2022. Gratuity is 14 days&apos; basic salary per completed year of service.
            </div>}
            {category === "parttime" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                ⏰ Gratuity is calculated using the standard 21/30-day formula, then adjusted pro-rata based on working hours vs full-time equivalent.
            </div>}
            {category === "difc" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏦 DIFC replaced traditional gratuity with the DEWS (Employee Workplace Savings) plan since Feb 2020. Employers make monthly contributions to a regulated investment fund.
            </div>}
            {category === "adgm" && <div style={{ padding: "8px 12px", background: "rgba(0,150,57,0.06)", borderRadius: 8, fontSize: "0.82rem", marginBottom: 8 }}>
                🏢 ADGM follows standard UAE gratuity rules. New Employment Regulations 2024 (effective April 2025) introduce an optional savings scheme alternative.
            </div>}

            <InputField id="uae-grat-salary" label="Basic Monthly Salary" value={basicSalary} onChange={setBasicSalary} unit="AED" min={0} placeholder="e.g. 10000" />
            <InputField id="uae-grat-start" label="Employment Start Date" value={startDate} onChange={setStartDate} type="date" />
            <InputField id="uae-grat-end" label="Employment End Date" value={endDate} onChange={setEndDate} type="date" />

            {category === "parttime" && <>
                <InputField id="uae-grat-pt-hours" label="Your Weekly Working Hours" value={partTimeHours} onChange={setPartTimeHours} unit="hours/week" min={1} max={48} placeholder="e.g. 20" />
                <InputField id="uae-grat-ft-hours" label="Full-Time Equivalent Hours" value={fullTimeHours} onChange={setFullTimeHours} unit="hours/week" min={1} max={60} placeholder="e.g. 48" />
            </>}
        </div>

        {result && !result.eligible && <div className="con-calc__results">
            <div style={{ padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: 8, textAlign: "center" }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>⚠️</span>
                <strong>Not Eligible for Gratuity</strong>
                <p style={{ margin: "8px 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{result.reason}</p>
                {result.sp && <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>Service: {result.sp.years} years, {result.sp.months} months, {result.sp.days} days ({fmt(result.sp.totalYears, 2)} years)</p>}
            </div>
        </div>}

        {result && result.eligible && result.steps && <div className="con-calc__results">
            <h4>Step-by-Step Breakdown</h4>
            {result.steps.map((s: { label: string; value: string; note?: string }, i: number) => (
                <div key={i}>
                    <ResultRow label={s.label} value={s.value} />
                    {s.note && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", paddingLeft: 8, marginTop: -4, marginBottom: 6, fontStyle: "italic" }}>ℹ️ {s.note}</div>}
                </div>
            ))}

            <div style={{ borderTop: "2px solid var(--border)", marginTop: "var(--s-3)", paddingTop: "var(--s-3)" }}>
                <ResultRow
                    label={category === "difc" ? "Estimated DEWS Payout (excluding returns)" : "Final Gratuity Amount"}
                    value={fmtAED(result.gratuity as number)}
                    highlight
                />
                {result.capped && <ResultRow label="⚠️ Capped at 2 years' salary" value={fmtAED(result.twoYearCap as number)} warn />}
            </div>

            <div style={{ marginTop: "var(--s-3)", padding: "var(--s-3)", background: "rgba(234,179,8,0.08)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                ⚠️ This calculator provides estimates based on UAE Federal Decree-Law No. 33 of 2021. Gratuity is calculated on last basic salary only (excludes housing, transport, bonuses). Employer must pay within 14 days of contract end. For disputes, contact MoHRE or seek legal advice.
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
        {/* Gratuity Formula by Category */}
        <h4>Gratuity Calculation by Worker Category</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Category</th>
                    <th style={th}>Formula</th>
                    <th style={th}>Cap</th>
                    <th style={{ ...th, textAlign: "left" }}>Legal Basis</th>
                </tr></thead>
                <tbody>
                    {([
                        ["🏢 Private Sector", "21 days/yr (first 5) + 30 days/yr (after 5)", "2 years' salary", "Federal Decree-Law 33/2021"],
                        ["🏠 Domestic Worker", "14 days/yr for each year", "2 years' salary", "Federal Decree-Law 9/2022"],
                        ["⏰ Part-Time", "Standard formula × (PT hours ÷ FT hours)", "2 years' salary", "Decree-Law 33/2021, Art. 18"],
                        ["🏦 DIFC (DEWS)", "5.83% basic (≤5yr) / 8.33% (>5yr) monthly", "N/A — investment returns", "DIFC Employment Law No. 2/2019"],
                        ["🏢 ADGM", "Standard formula (or savings scheme)", "2 years' salary", "Employment Regs 2024"],
                    ] as string[][]).map(([cat, formula, cap, law], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{cat}</td>
                            <td style={td}>{formula}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{cap}</td>
                            <td style={tl}>{law}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* DIFC DEWS Contribution Rates */}
        <h4 style={{ marginTop: "var(--s-4)" }}>DIFC DEWS Monthly Contribution Rates</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Service Period</th>
                    <th style={th}>Employer Rate</th>
                    <th style={th}>Monthly (AED 10K salary)</th>
                    <th style={th}>Annual (AED 10K salary)</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>First 5 years</td><td style={{ ...td, fontWeight: 700 }}>5.83%</td><td style={td}>AED 583</td><td style={td}>AED 6,996</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>After 5 years</td><td style={{ ...td, fontWeight: 700 }}>8.33%</td><td style={td}>AED 833</td><td style={td}>AED 9,996</td></tr>
                </tbody>
            </table>
        </div>

        {/* Quick Gratuity Lookup */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Quick Gratuity Lookup — Private Sector (AED)</h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>Standard 21/30-day formula. Basic salary only.</p>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Basic Salary</th>
                    <th style={th}>3 Years</th>
                    <th style={th}>5 Years</th>
                    <th style={th}>7 Years</th>
                    <th style={th}>10 Years</th>
                    <th style={th}>15 Years</th>
                </tr></thead>
                <tbody>
                    {[5000, 8000, 10000, 15000, 20000, 30000, 50000].map((sal) => {
                        const dw = sal / 30;
                        const g = (y: number) => {
                            const f5 = Math.min(y, 5) * 21 * dw;
                            const a5 = Math.max(y - 5, 0) * 30 * dw;
                            const total = f5 + a5;
                            const cap = sal * 24;
                            return fmtAED(Math.min(total, cap));
                        };
                        return (<tr key={sal} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{fmtAED(sal)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{g(3)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{g(5)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{g(7)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{g(10)}</td>
                            <td style={{ ...td, fontWeight: 700 }}>{g(15)}</td>
                        </tr>);
                    })}
                </tbody>
            </table>
        </div>

        {/* Voluntary Savings Scheme */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Voluntary Savings Scheme Rates (Cabinet Resolution 96/2023)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Detail</th>
                    <th style={th}>≤ 5 Years Service</th>
                    <th style={th}>&gt; 5 Years Service</th>
                </tr></thead>
                <tbody>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Employer Monthly Contribution</td><td style={{ ...td, fontWeight: 700 }}>5.83% of basic</td><td style={{ ...td, fontWeight: 700 }}>8.33% of basic</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Employee Voluntary (max)</td><td style={td} colSpan={2}>Up to 25% of annual salary</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Applicability</td><td style={td} colSpan={2}>Private sector + most free zones (except DIFC & ADGM)</td></tr>
                    <tr style={b}><td style={{ ...tl, fontWeight: 600 }}>Status</td><td style={td} colSpan={2}>Voluntary — employer chooses to participate</td></tr>
                </tbody>
            </table>
        </div>

        {/* Key Legal Articles */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Key Legal Articles — Federal Decree-Law No. 33 of 2021</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Article</th>
                    <th style={{ ...th, textAlign: "left" }}>Subject</th>
                    <th style={{ ...th, textAlign: "left" }}>Key Provision</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Art. 51", "Gratuity Entitlement", "All employees completing 1+ year entitled to end-of-service gratuity"],
                        ["Art. 51(2)", "21-Day Rule", "21 days' basic salary for each year of first 5 years"],
                        ["Art. 51(3)", "30-Day Rule", "30 days' basic salary for each year beyond 5 years"],
                        ["Art. 51(4)", "2-Year Cap", "Total gratuity shall not exceed 2 years' remuneration"],
                        ["Art. 51(5)", "Pro-Rata", "Fractional years calculated proportionately"],
                        ["Art. 44", "Gross Misconduct", "Grounds for summary dismissal — gratuity NOT forfeited automatically"],
                        ["Art. 8", "Contract Types", "All contracts are now fixed-term (limited) — max 3 years, renewable"],
                        ["Art. 18", "Part-Time Workers", "Entitled to gratuity pro-rata based on working hours"],
                        ["Art. 54", "Payment Timeline", "All dues within 14 days of contract end"],
                    ] as string[][]).map(([art, subject, provision], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 700 }}>{art}</td>
                            <td style={{ ...tl, fontWeight: 600 }}>{subject}</td>
                            <td style={tl}>{provision}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Old Law vs New Law */}
        <h4 style={{ marginTop: "var(--s-4)" }}>Old Law vs New Law (2022+)</h4>
        <div style={{ overflowX: "auto" }}>
            <table style={ts}>
                <thead><tr style={bh}>
                    <th style={{ ...th, textAlign: "left" }}>Aspect</th>
                    <th style={th}>Old Law (Federal Law No. 8/1980)</th>
                    <th style={th}>New Law (Decree-Law 33/2021)</th>
                </tr></thead>
                <tbody>
                    {([
                        ["Contract Types", "Limited + Unlimited", "All Limited (fixed-term), max 3 years"],
                        ["Resignation (Unlimited, 1–3 yrs)", "1/3 of gratuity", "Full gratuity"],
                        ["Resignation (Unlimited, 3–5 yrs)", "2/3 of gratuity", "Full gratuity"],
                        ["Resignation (Unlimited, 5+ yrs)", "Full gratuity", "Full gratuity"],
                        ["Misconduct Dismissal", "Total forfeiture", "Gratuity retained (except by court order)"],
                        ["Part-Time Workers", "Not covered", "Pro-rata gratuity based on hours"],
                        ["Savings Alternative", "None", "Voluntary savings scheme available"],
                    ] as string[][]).map(([aspect, old, newLaw], i) => (
                        <tr key={i} style={b}>
                            <td style={{ ...tl, fontWeight: 600 }}>{aspect}</td>
                            <td style={td}>{old}</td>
                            <td style={{ ...td, fontWeight: 600 }}>{newLaw}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>);
}

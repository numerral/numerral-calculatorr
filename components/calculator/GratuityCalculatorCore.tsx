"use client";
import { useState } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

type Mode = "calculator" | "tax" | "employer" | "guide";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "Gratuity Calculator" },
    { key: "tax", icon: "🧾", label: "Tax Exemption" },
    { key: "employer", icon: "🏢", label: "Employer Liability" },
    { key: "guide", icon: "📋", label: "Eligibility Guide" },
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

/* ═══════ MODE 1: GRATUITY CALCULATOR ═══════ */
function CalculatorMode() {
    const [lastSalary, setLastSalary] = useState(50000);
    const [years, setYears] = useState(10);
    const [months, setMonths] = useState(0);
    const [isCovered, setIsCovered] = useState(true);

    const effectiveYears = months > 6 ? years + 1 : years;
    const gratuity = isCovered
        ? Math.round((lastSalary * 15 * effectiveYears) / 26)
        : Math.round((lastSalary * 15 * effectiveYears) / 30);
    const taxExemptLimit = 2500000; // ₹25 lakh for govt, ₹20 lakh private
    const coveredExempt = Math.min(gratuity, isCovered ? 2000000 : 2000000);
    const taxable = Math.max(0, gratuity - coveredExempt);

    return (
        <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsCovered(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isCovered ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: isCovered ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: isCovered ? 700 : 500, color: isCovered ? "var(--n-primary)" : "var(--n-text)",
                }}>✅ Covered under Act (÷26)</button>
                <button onClick={() => setIsCovered(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isCovered ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isCovered ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isCovered ? 700 : 500, color: !isCovered ? "var(--n-primary)" : "var(--n-text)",
                }}>🏪 Not Covered (÷30)</button>
            </div>

            <InputRow label="Last Drawn Salary (Basic + DA)" value={lastSalary} set={setLastSalary} max={500000} step={1000} min={5000}
                hint={isCovered ? "Basic + DA only (excludes HRA, allowances). Divisor = 26 days/month" : "Average salary of last 10 months. Divisor = 30 days/month"} />
            <InputRow label="Years of Service" value={years} set={setYears} max={40} step={1} min={0} suffix=""
                hint={`Minimum 5 years required (waived for death/disability). ${years < 5 ? "⚠️ Below 5-year threshold!" : ""}`} />
            <InputRow label="Additional Months" value={months} set={setMonths} max={11} step={1} min={0} suffix=""
                hint={`Months > 6 are rounded UP to next year. ${months > 6 ? `Effective: ${effectiveYears} years` : `Effective: ${effectiveYears} years`}`} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>
                        Gratuity Amount
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>
                        {fmt(gratuity)}
                    </div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Last Drawn Salary (Basic + DA)", fmt(lastSalary) + "/month"],
                            ["Service", `${years} years ${months} months`],
                            ["Effective Years (rounded)", `${effectiveYears} years`],
                            ["Formula", isCovered ? `(${fmt(lastSalary)} × 15 × ${effectiveYears}) ÷ 26` : `(${fmt(lastSalary)} × 15 × ${effectiveYears}) ÷ 30`],
                            ["Gratuity Amount", fmt(gratuity)],
                            ["Tax-Exempt (max)", fmt(coveredExempt)],
                            ["Taxable Gratuity", fmt(taxable)],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i === 4 ? 700 : 500, color: i === 4 ? "#16a34a" : i === 6 && taxable > 0 ? "#dc2626" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MODE 2: TAX EXEMPTION CALCULATOR ═══════ */
function TaxMode() {
    const [empType, setEmpType] = useState<"govt" | "pvt_covered" | "pvt_not">("pvt_covered");
    const [actualGratuity, setActualGratuity] = useState(800000);
    const [lastSalary, setLastSalary] = useState(50000);
    const [years, setYears] = useState(10);
    const [avgSalary10, setAvgSalary10] = useState(48000);

    const LIMIT = 2000000;
    let formulaGratuity = 0;
    let exempt = 0;
    let taxable = 0;

    if (empType === "govt") {
        exempt = actualGratuity;
        taxable = 0;
    } else if (empType === "pvt_covered") {
        formulaGratuity = Math.round((lastSalary * 15 * years) / 26);
        exempt = Math.min(actualGratuity, LIMIT, formulaGratuity);
        taxable = Math.max(0, actualGratuity - exempt);
    } else {
        formulaGratuity = Math.round((avgSalary10 * years) / 2);
        exempt = Math.min(actualGratuity, LIMIT, formulaGratuity);
        taxable = Math.max(0, actualGratuity - exempt);
    }

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.82rem", display: "block", marginBottom: 6 }}>Employee Type</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {([
                        ["govt", "🏛️ Government"],
                        ["pvt_covered", "🏢 Private (Covered)"],
                        ["pvt_not", "🏪 Private (Not Covered)"],
                    ] as const).map(([k, l]) => (
                        <button key={k} onClick={() => setEmpType(k)} style={{
                            flex: 1, minWidth: 100, padding: "8px 12px", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer",
                            border: empType === k ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: empType === k ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: empType === k ? 700 : 500, color: empType === k ? "var(--n-primary)" : "var(--n-text)",
                        }}>{l}</button>
                    ))}
                </div>
            </div>

            {empType === "govt" && (
                <div style={{ background: "#dcfce7", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                    <strong>🏛️ Government Employees:</strong> Gratuity is <strong>100% tax-exempt</strong> under Section 10(10)(i). No limit.
                </div>
            )}

            <InputRow label="Actual Gratuity Received" value={actualGratuity} set={setActualGratuity} max={5000000} step={10000} min={10000} />
            {empType !== "govt" && (
                <>
                    <InputRow label="Years of Service" value={years} set={setYears} max={40} step={1} min={1} suffix="" />
                    {empType === "pvt_covered" && (
                        <InputRow label="Last Drawn Salary (Basic + DA)" value={lastSalary} set={setLastSalary} max={500000} step={1000} min={5000} />
                    )}
                    {empType === "pvt_not" && (
                        <InputRow label="Average Salary (last 10 months)" value={avgSalary10} set={setAvgSalary10} max={500000} step={1000} min={5000}
                            hint="Half-month's average salary × years of service" />
                    )}
                </>
            )}

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: taxable > 0 ? "#dc2626" : "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>
                        {taxable > 0 ? "Taxable Gratuity" : "100% Tax-Exempt"}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: taxable > 0 ? "#dc2626" : "#16a34a" }}>
                        {taxable > 0 ? fmt(taxable) : fmt(exempt)}
                    </div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Actual Gratuity Received", fmt(actualGratuity)],
                            ...(empType !== "govt" ? [
                                ["Formula-based Gratuity", fmt(formulaGratuity)],
                                ["Section 10(10) Limit", fmt(LIMIT)],
                            ] : []),
                            ["Tax-Exempt Amount", fmt(exempt)],
                            ["Taxable Amount", fmt(taxable)],
                        ].map(([l, v], i, arr) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i === arr.length - 1 ? 700 : 500, color: i === arr.length - 1 && taxable > 0 ? "#dc2626" : i === arr.length - 2 ? "#16a34a" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {empType !== "govt" && (
                    <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 8 }}>
                        Exempt = LEAST of: (1) Actual gratuity, (2) ₹20 lakh limit, (3) Formula amount. Excess is taxable as &ldquo;Income from Salary&rdquo;.
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 3: EMPLOYER LIABILITY ═══════ */
function EmployerMode() {
    const [numEmployees, setNumEmployees] = useState(50);
    const [avgSalary, setAvgSalary] = useState(35000);
    const [avgYears, setAvgYears] = useState(8);

    const perEmployee = Math.round((avgSalary * 15 * avgYears) / 26);
    const totalLiability = perEmployee * numEmployees;
    const annualProvision = Math.round(totalLiability / avgYears);
    const monthlyProvision = Math.round(annualProvision / 12);

    return (
        <>
            <div style={{ background: "#dbeafe", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                <strong>💡 For Employers:</strong> Provision for gratuity as per AS-15 / Ind AS-19. Actuarial valuation required annually for establishments with 10+ employees.
            </div>

            <InputRow label="Number of Employees" value={numEmployees} set={setNumEmployees} max={1000} step={1} min={1} suffix="" />
            <InputRow label="Average Basic + DA (Monthly)" value={avgSalary} set={setAvgSalary} max={200000} step={1000} min={5000} />
            <InputRow label="Average Years of Service" value={avgYears} set={setAvgYears} max={30} step={1} min={1} suffix="" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: 1 }}>Total Gratuity Liability</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>{fmt(totalLiability)}</div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Employees", `${numEmployees}`],
                            ["Avg Basic + DA", fmt(avgSalary) + "/month"],
                            ["Avg Service", `${avgYears} years`],
                            ["Per Employee Gratuity", fmt(perEmployee)],
                            ["Total Liability", fmt(totalLiability)],
                            ["Annual Provision", fmt(annualProvision)],
                            ["Monthly Provision", fmt(monthlyProvision)],
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

/* ═══════ MODE 4: ELIGIBILITY GUIDE ═══════ */
function GuideMode() {
    const sections = [
        { title: "📋 Applicability (10+ Employees)", items: [
            { rule: "Factories", detail: "Every factory regardless of employee count" },
            { rule: "Other Establishments", detail: "Shops, mines, oilfields, plantations, ports, railways with 10+ employees in preceding 12 months" },
            { rule: "Persistence", detail: "Once applicable, continues even if count drops below 10" },
        ]},
        { title: "✅ Eligibility (5 Years)", items: [
            { rule: "Continuous Service", detail: "Minimum 5 years with the same employer" },
            { rule: "240-Day Rule", detail: "If 240 days worked in the 5th year (6-day week), the 5 years are deemed completed" },
            { rule: "190-Day Rule", detail: "If establishment works 5 days/week, 190 days in the 5th year qualifies" },
            { rule: "Death/Disability", detail: "5-year rule waived — gratuity payable to nominee/legal heir" },
            { rule: "All Employee Types", detail: "Manual, clerical, supervisory — all eligible (no salary ceiling)" },
        ]},
        { title: "💰 Gratuity Formula", items: [
            { rule: "Covered (÷26)", detail: "Gratuity = (Last Drawn Basic+DA × 15 × Years) ÷ 26" },
            { rule: "Not Covered (÷30)", detail: "Gratuity = (Last Drawn Basic+DA × 15 × Years) ÷ 30" },
            { rule: "Rounding", detail: "Months > 6 rounded UP to next year (e.g., 7Y 8M = 8Y)" },
            { rule: "Maximum", detail: "No statutory cap on gratuity amount (₹20L is only for tax exemption)" },
        ]},
        { title: "🧾 Tax Exemption — Section 10(10)", items: [
            { rule: "Government Employee", detail: "100% tax-exempt — no limit" },
            { rule: "Private (Covered)", detail: "Least of: Actual, ₹20 lakh, or Formula amount" },
            { rule: "Private (Not Covered)", detail: "Least of: Actual, ₹20 lakh, or Half-month avg salary × years" },
            { rule: "Lifetime Limit", detail: "₹20 lakh is a LIFETIME limit across all employers" },
        ]},
        { title: "❌ Forfeiture — Section 4(6)", items: [
            { rule: "Damage/Loss", detail: "Willful omission/negligence causing employer's property loss → forfeiture to extent of loss" },
            { rule: "Misconduct", detail: "Riotous/disorderly conduct, violence, moral turpitude → full/partial forfeiture" },
            { rule: "Due Process", detail: "Show-cause notice + opportunity to be heard is mandatory before forfeiture" },
        ]},
        { title: "📅 Payment Timeline", items: [
            { rule: "Employer's Obligation", detail: "Pay gratuity within 30 days of it becoming payable" },
            { rule: "Interest on Delay", detail: "If delayed beyond 30 days, simple interest at 10% per annum" },
            { rule: "Nomination", detail: "Employee must nominate beneficiary (Form F). Updated on marriage or change" },
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
                                <th style={{ textAlign: "left", padding: "6px" }}>Rule</th>
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

/* ═══════ MAIN EXPORT ═══════ */
export default function GratuityCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏆 Gratuity Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Payment of Gratuity Act, 1972 • 15/26 formula • Tax exemption Sec 10(10) • ₹20L limit</div>
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
                {mode === "tax" && <TaxMode />}
                {mode === "employer" && <EmployerMode />}
                {mode === "guide" && <GuideMode />}
            </div>
        </div>
    );
}

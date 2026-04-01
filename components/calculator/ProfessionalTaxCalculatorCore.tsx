"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─── STATE SLAB DATABASE ─── */
type SlabEntry = { min: number; max: number; tax: number };
type StateData = {
    name: string; code: string; slabs: SlabEntry[];
    febAdj?: boolean; genderExemption?: boolean; halfYearly?: boolean;
    notes?: string;
};

const STATES: StateData[] = [
    {
        name: "Maharashtra", code: "MH",
        slabs: [
            { min: 0, max: 7500, tax: 0 },
            { min: 7501, max: 10000, tax: 175 },
            { min: 10001, max: 9999999, tax: 200 },
        ],
        febAdj: true, genderExemption: true,
        notes: "Women earning ≤ ₹25,000/month are exempt. ₹300 deducted in February to reach ₹2,500 annual cap."
    },
    {
        name: "Karnataka", code: "KA",
        slabs: [
            { min: 0, max: 15000, tax: 0 },
            { min: 15001, max: 25000, tax: 150 },
            { min: 25001, max: 9999999, tax: 200 },
        ],
        febAdj: true,
        notes: "₹300 deducted in February to reach ₹2,500 annual cap."
    },
    {
        name: "West Bengal", code: "WB",
        slabs: [
            { min: 0, max: 10000, tax: 0 },
            { min: 10001, max: 15000, tax: 110 },
            { min: 15001, max: 25000, tax: 130 },
            { min: 25001, max: 40000, tax: 150 },
            { min: 40001, max: 9999999, tax: 200 },
        ],
        notes: "Tiered slabs with 5 brackets."
    },
    {
        name: "Gujarat", code: "GJ",
        slabs: [
            { min: 0, max: 12000, tax: 0 },
            { min: 12001, max: 9999999, tax: 200 },
        ],
        notes: "Simple two-slab structure. Nil below ₹12,000."
    },
    {
        name: "Andhra Pradesh", code: "AP",
        slabs: [
            { min: 0, max: 15000, tax: 0 },
            { min: 15001, max: 20000, tax: 150 },
            { min: 20001, max: 9999999, tax: 200 },
        ],
        notes: "Three-slab structure based on monthly salary."
    },
    {
        name: "Telangana", code: "TS",
        slabs: [
            { min: 0, max: 15000, tax: 0 },
            { min: 15001, max: 20000, tax: 150 },
            { min: 20001, max: 9999999, tax: 200 },
        ],
        notes: "Same structure as Andhra Pradesh post-bifurcation."
    },
    {
        name: "Tamil Nadu", code: "TN",
        slabs: [
            { min: 0, max: 21000, tax: 0 },
            { min: 21001, max: 30000, tax: 135 },
            { min: 30001, max: 45000, tax: 315 },
            { min: 45001, max: 60000, tax: 690 },
            { min: 60001, max: 75000, tax: 1025 },
            { min: 75001, max: 9999999, tax: 1250 },
        ],
        halfYearly: true,
        notes: "Calculated on HALF-YEARLY basis. Amounts shown are per half-year."
    },
    {
        name: "Kerala", code: "KL",
        slabs: [
            { min: 0, max: 11999, tax: 0 },
            { min: 12000, max: 17999, tax: 120 },
            { min: 18000, max: 24999, tax: 180 },
            { min: 25000, max: 29999, tax: 300 },
            { min: 30000, max: 34999, tax: 450 },
            { min: 35000, max: 39999, tax: 600 },
            { min: 40000, max: 49999, tax: 750 },
            { min: 50000, max: 59999, tax: 1000 },
            { min: 60000, max: 9999999, tax: 1250 },
        ],
        halfYearly: true,
        notes: "Calculated on HALF-YEARLY basis. 9 detailed brackets."
    },
    {
        name: "Madhya Pradesh", code: "MP",
        slabs: [
            { min: 0, max: 18750, tax: 0 },
            { min: 18751, max: 25000, tax: 125 },
            { min: 25001, max: 33333, tax: 167 },
            { min: 33334, max: 9999999, tax: 208 },
        ],
        notes: "Calculated on monthly basis. Annual cap ₹2,500."
    },
    {
        name: "Odisha", code: "OD",
        slabs: [
            { min: 0, max: 16000, tax: 0 },
            { min: 16001, max: 25000, tax: 150 },
            { min: 25001, max: 9999999, tax: 200 },
        ],
        notes: "Three-slab structure."
    },
    {
        name: "Assam", code: "AS",
        slabs: [
            { min: 0, max: 10000, tax: 0 },
            { min: 10001, max: 15000, tax: 150 },
            { min: 15001, max: 25000, tax: 180 },
            { min: 25001, max: 9999999, tax: 208 },
        ],
        notes: "Four-slab structure. Annual cap ₹2,500."
    },
    {
        name: "Meghalaya", code: "ML",
        slabs: [
            { min: 0, max: 12500, tax: 0 },
            { min: 12501, max: 16666, tax: 125 },
            { min: 16667, max: 9999999, tax: 208 },
        ],
        notes: "Three-slab structure."
    },
    {
        name: "Jharkhand", code: "JH",
        slabs: [
            { min: 0, max: 25000, tax: 0 },
            { min: 25001, max: 41666, tax: 100 },
            { min: 41667, max: 66666, tax: 150 },
            { min: 66667, max: 9999999, tax: 200 },
        ],
        notes: "Higher exemption threshold at ₹25,000."
    },
    {
        name: "Bihar", code: "BR",
        slabs: [
            { min: 0, max: 25000, tax: 0 },
            { min: 25001, max: 50000, tax: 100 },
            { min: 50001, max: 75000, tax: 150 },
            { min: 75001, max: 100000, tax: 183 },
            { min: 100001, max: 9999999, tax: 208 },
        ],
        notes: "Five-slab structure with higher exemption threshold."
    },
    {
        name: "Sikkim", code: "SK",
        slabs: [
            { min: 0, max: 20000, tax: 0 },
            { min: 20001, max: 30000, tax: 125 },
            { min: 30001, max: 40000, tax: 150 },
            { min: 40001, max: 9999999, tax: 200 },
        ],
        notes: "Four-slab structure."
    },
    {
        name: "Tripura", code: "TR",
        slabs: [
            { min: 0, max: 10000, tax: 0 },
            { min: 10001, max: 15000, tax: 100 },
            { min: 15001, max: 25000, tax: 150 },
            { min: 25001, max: 9999999, tax: 208 },
        ],
        notes: "Four-slab structure."
    },
    {
        name: "Chhattisgarh", code: "CG",
        slabs: [
            { min: 0, max: 12500, tax: 0 },
            { min: 12501, max: 18750, tax: 125 },
            { min: 18751, max: 9999999, tax: 208 },
        ],
        notes: "Three-slab structure."
    },
    {
        name: "Puducherry", code: "PY",
        slabs: [
            { min: 0, max: 10000, tax: 0 },
            { min: 10001, max: 9999999, tax: 200 },
        ],
        notes: "Simple two-slab structure, similar to Gujarat."
    },
];

const NO_PT_STATES = [
    "Delhi", "Haryana", "Rajasthan", "Uttar Pradesh", "Punjab", "Uttarakhand",
    "Himachal Pradesh", "Goa", "Jammu & Kashmir", "Arunachal Pradesh",
    "Chandigarh", "Ladakh", "Lakshadweep", "Andaman & Nicobar Islands",
    "Dadra & Nagar Haveli and Daman & Diu"
];

function getPT(state: StateData, salary: number, gender: "male" | "female"): number {
    // Maharashtra female exemption
    if (state.code === "MH" && gender === "female" && salary <= 25000) return 0;
    for (const s of state.slabs) {
        if (salary >= s.min && salary <= s.max) return s.tax;
    }
    return 0;
}

/* ─── Shared Input ─── */
function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : fmt(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min || 0} max={max || 50_00_000} step={step || 5000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

type Mode = "state" | "annual" | "compare" | "employer";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "state", icon: "🏛️", label: "State-wise PT" },
    { key: "annual", icon: "📋", label: "Annual & Tax Impact" },
    { key: "compare", icon: "⚖️", label: "Compare States" },
    { key: "employer", icon: "🧾", label: "Employer Compliance" },
];

/* ═══════ MODE 1: STATE-WISE PT CALCULATOR ═══════ */
function StateMode() {
    const [stateIdx, setStateIdx] = useState(0);
    const [salary, setSalary] = useState(35000);
    const [gender, setGender] = useState<"male" | "female">("male");

    const state = STATES[stateIdx];
    const result = useMemo(() => {
        const monthlyPT = getPT(state, salary, gender);
        let annualPT: number;
        if (state.halfYearly) {
            annualPT = monthlyPT * 2; // already half-yearly
        } else if (state.febAdj) {
            annualPT = Math.min(monthlyPT * 11 + Math.min(monthlyPT + 100, 300), 2500);
        } else {
            annualPT = Math.min(monthlyPT * 12, 2500);
        }
        const febAmount = state.febAdj ? Math.min(monthlyPT + 100, 300) : monthlyPT;
        return { monthlyPT, annualPT, febAmount };
    }, [state, salary, gender]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Select State</label>
                <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.88rem", background: "var(--n-surface)", color: "var(--n-text)" }}>
                    {STATES.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
                </select>
            </div>

            <InputRow label="Monthly Gross Salary" value={salary} set={setSalary} max={5_00_000} step={1000} min={5000}
                hint="Your gross monthly salary before any deductions" />

            {state.genderExemption && (
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Gender</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {(["male", "female"] as const).map(g => (
                            <button key={g} onClick={() => setGender(g)} style={{
                                flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.85rem", cursor: "pointer",
                                border: gender === g ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                background: gender === g ? "var(--n-primary-light)" : "var(--n-surface)",
                                fontWeight: gender === g ? 700 : 500, color: gender === g ? "var(--n-primary)" : "var(--n-text)",
                            }}>{g === "male" ? "👨 Male" : "👩 Female"}</button>
                        ))}
                    </div>
                    {gender === "female" && salary <= 25000 && state.code === "MH" && (
                        <div style={{ fontSize: "0.78rem", color: "#16a34a", marginTop: 4, fontWeight: 600 }}>
                            ✅ Women earning ≤ ₹25,000/month are exempt from PT in Maharashtra
                        </div>
                    )}
                </div>
            )}

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        Monthly Professional Tax — {state.name}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                        {state.halfYearly ? `${fmt(result.monthlyPT)}/half-yr` : `${fmt(result.monthlyPT)}/month`}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>Annual Total: <strong>{fmt(result.annualPT)}</strong></div>
                </div>

                {state.febAdj && result.monthlyPT > 0 && (
                    <div style={{ background: "var(--n-gold-light)", borderRadius: 8, padding: "8px 12px", marginBottom: "var(--s-3)", fontSize: "0.78rem" }}>
                        <strong style={{ color: "#78350f" }}>📋 February Adjustment:</strong>{" "}
                        <span style={{ color: "#78350f" }}>{fmt(result.febAmount)} will be deducted in February (instead of {fmt(result.monthlyPT)}) to reach the ₹2,500 annual cap.</span>
                    </div>
                )}

                {/* State Slab Table */}
                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, color: "var(--n-primary)" }}>
                    📊 {state.name} PT Slab Table {state.halfYearly ? "(Half-Yearly)" : "(Monthly)"}
                </div>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>{state.halfYearly ? "Half-Yearly" : "Monthly"} Salary</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>PT Amount</th>
                    </tr></thead>
                    <tbody>
                        {state.slabs.map((s, i) => {
                            const isActive = salary >= s.min && salary <= s.max;
                            return (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: isActive ? "var(--n-primary-light)" : "" }}>
                                    <td style={{ padding: "6px 4px", fontWeight: isActive ? 700 : 400 }}>
                                        {s.max >= 9999999 ? `Above ${fmt(s.min)}` : `${fmt(s.min)} – ${fmt(s.max)}`}
                                        {isActive && " ← You"}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: s.tax === 0 ? "#16a34a" : undefined }}>
                                        {s.tax === 0 ? "Nil" : fmt(s.tax)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {state.notes && (
                    <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 8, padding: "6px 10px", background: "var(--n-surface)", borderRadius: 6 }}>
                        <strong>Note:</strong> {state.notes}
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: ANNUAL PT & TAX IMPACT ═══════ */
function AnnualMode() {
    const [salary, setSalary] = useState(50000);
    const [stateIdx, setStateIdx] = useState(0);
    const [taxBracket, setTaxBracket] = useState(20);

    const state = STATES[stateIdx];
    const result = useMemo(() => {
        const monthlyPT = getPT(state, salary, "male");
        let annualPT: number;
        if (state.halfYearly) {
            annualPT = monthlyPT * 2;
        } else if (state.febAdj) {
            annualPT = Math.min(monthlyPT * 11 + Math.min(monthlyPT + 100, 300), 2500);
        } else {
            annualPT = Math.min(monthlyPT * 12, 2500);
        }

        // Section 16(iii) deduction
        const taxSaving = annualPT * (taxBracket / 100) * 1.04; // including 4% cess
        const effectivePT = annualPT - taxSaving;

        // Annual salary impact
        const annualSalary = salary * 12;
        const ptPercent = annualSalary > 0 ? (annualPT / annualSalary) * 100 : 0;

        return { monthlyPT, annualPT, taxSaving, effectivePT, annualSalary, ptPercent };
    }, [salary, stateIdx, taxBracket]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Select State</label>
                <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.88rem", background: "var(--n-surface)", color: "var(--n-text)" }}>
                    {STATES.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
                </select>
            </div>
            <InputRow label="Monthly Gross Salary" value={salary} set={setSalary} max={5_00_000} step={1000} min={5000} />
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Income Tax Bracket</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {[5, 10, 15, 20, 30].map(b => (
                        <button key={b} onClick={() => setTaxBracket(b)} style={{
                            flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: taxBracket === b ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: taxBracket === b ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: taxBracket === b ? 700 : 500, color: taxBracket === b ? "var(--n-primary)" : "var(--n-text)",
                        }}>{b}%</button>
                    ))}
                </div>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    📋 Annual PT & Income Tax Impact — {state.name}
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Annual Gross Salary", fmt(result.annualSalary), undefined],
                            ["Monthly PT Deduction", fmt(result.monthlyPT), undefined],
                            ["Annual PT Paid", fmt(result.annualPT), "var(--n-primary)"],
                            ["PT as % of Salary", `${result.ptPercent.toFixed(2)}%`, "var(--n-text-muted)"],
                        ].map(([l, v, c], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700, color: c as string || undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 14, marginTop: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>
                        Section 16(iii) Tax Saving
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Tax Saved (at {taxBracket}% + cess)</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#16a34a" }}>{fmt(result.taxSaving)}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Effective PT Cost</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{fmt(result.effectivePT)}</div>
                        </div>
                    </div>
                </div>

                <div style={{ background: "var(--n-primary-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "var(--n-primary)" }}>💡 Key Insight:</strong>{" "}
                    <span style={{ color: "var(--n-primary)" }}>Professional Tax of {fmt(result.annualPT)}/year is fully deductible under Section 16(iii) of the Income Tax Act. At the {taxBracket}% slab, this saves you {fmt(result.taxSaving)} in income tax — reducing the effective PT cost to just {fmt(result.effectivePT)}.</span>
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 3: COMPARE STATES ═══════ */
function CompareMode() {
    const [salary, setSalary] = useState(40000);

    const comparison = useMemo(() => {
        return STATES.map(s => {
            const monthly = getPT(s, salary, "male");
            let annual: number;
            if (s.halfYearly) { annual = monthly * 2; }
            else if (s.febAdj) { annual = Math.min(monthly * 11 + Math.min(monthly + 100, 300), 2500); }
            else { annual = Math.min(monthly * 12, 2500); }
            return { name: s.name, code: s.code, monthly, annual, halfYearly: s.halfYearly };
        }).sort((a, b) => b.annual - a.annual);
    }, [salary]);

    const maxAnnual = Math.max(...comparison.map(c => c.annual));

    return (
        <>
            <InputRow label="Monthly Gross Salary" value={salary} set={setSalary} max={5_00_000} step={1000} min={5000}
                hint="See how PT varies across states for your salary level" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    ⚖️ Professional Tax at {fmt(salary)}/month — All States
                </div>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "6px 4px" }}>State</th>
                            <th style={{ textAlign: "right", padding: "6px 4px" }}>Monthly PT</th>
                            <th style={{ textAlign: "right", padding: "6px 4px" }}>Annual PT</th>
                            <th style={{ textAlign: "left", padding: "6px 4px", width: "30%" }}></th>
                        </tr></thead>
                        <tbody>
                            {comparison.map((c, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)", background: i === 0 ? "#fef2f2" : c.annual === 0 ? "#f0fdf4" : "" }}>
                                    <td style={{ padding: "6px 4px", fontWeight: i === 0 ? 700 : 400 }}>{c.name}</td>
                                    <td style={{ textAlign: "right", padding: "6px 4px" }}>
                                        {c.monthly === 0 ? <span style={{ color: "#16a34a" }}>Nil</span> : `${fmt(c.monthly)}${c.halfYearly ? "/half-yr" : ""}`}
                                    </td>
                                    <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>
                                        {c.annual === 0 ? <span style={{ color: "#16a34a", fontWeight: 700 }}>₹0</span> : fmt(c.annual)}
                                    </td>
                                    <td style={{ padding: "6px 4px" }}>
                                        <div style={{ height: 6, borderRadius: 3, background: "var(--n-border)", overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: maxAnnual > 0 ? `${(c.annual / maxAnnual) * 100}%` : "0%", background: c.annual === 0 ? "#16a34a" : i === 0 ? "#dc2626" : "var(--n-primary)", borderRadius: 3 }} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: "10px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong>🚫 States with NO Professional Tax:</strong>{" "}
                    <span style={{ color: "var(--n-text-muted)" }}>{NO_PT_STATES.join(", ")}</span>
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 4: EMPLOYER COMPLIANCE ═══════ */
function EmployerMode() {
    const [stateIdx, setStateIdx] = useState(0);
    const [employees, setEmployees] = useState(50);
    const [avgSalary, setAvgSalary] = useState(35000);

    const state = STATES[stateIdx];
    const result = useMemo(() => {
        const ptPerEmp = getPT(state, avgSalary, "male");
        const monthlyLiability = ptPerEmp * employees;
        let annualLiability: number;
        if (state.halfYearly) { annualLiability = ptPerEmp * 2 * employees; }
        else { annualLiability = Math.min(ptPerEmp * 12, 2500) * employees; }

        const lateInterest = monthlyLiability * 0.0125; // 1.25% per month
        const penalty = Math.max(monthlyLiability * 0.10, 1000);

        return { ptPerEmp, monthlyLiability, annualLiability, lateInterest, penalty };
    }, [stateIdx, employees, avgSalary]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Select State</label>
                <select value={stateIdx} onChange={e => setStateIdx(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--n-border)", fontSize: "0.88rem", background: "var(--n-surface)", color: "var(--n-text)" }}>
                    {STATES.map((s, i) => <option key={i} value={i}>{s.name}</option>)}
                </select>
            </div>
            <InputRow label="Number of Employees" value={employees} set={setEmployees} max={1000} step={1} min={1} suffix="yr"
                hint="Total salaried employees in this state" />
            <InputRow label="Average Monthly Salary" value={avgSalary} set={setAvgSalary} max={3_00_000} step={1000} min={5000} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--n-primary)", marginBottom: "var(--s-3)" }}>
                    🧾 Employer PT Compliance — {state.name}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                    {[
                        ["PT per Employee/month", fmt(result.ptPerEmp)],
                        ["Total Monthly Liability", fmt(result.monthlyLiability)],
                        ["Total Annual Liability", fmt(result.annualLiability)],
                        [`For ${employees} Employees`, `${employees} staff`],
                    ].map(([l, v], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: i === 2 ? "var(--n-primary)" : undefined }}>{v}</div>
                        </div>
                    ))}
                </div>

                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>📋 PTRC vs PTEC</div>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Feature</th>
                        <th style={{ textAlign: "center", padding: "6px 4px" }}>PTRC (Employer)</th>
                        <th style={{ textAlign: "center", padding: "6px 4px" }}>PTEC (Self)</th>
                    </tr></thead>
                    <tbody>
                        {[
                            ["Who needs it?", "Employers deducting PT from employees", "Self-employed, directors, partners"],
                            ["Registration", "Within 30 days of hiring", "Within 30 days of starting business"],
                            ["Filing", "Monthly (if >20 employees) or Annual", "Annual payment"],
                            ["Due Date", "15th of following month", "30th June each year"],
                        ].map(([f, ptrc, ptec], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "6px 4px", fontWeight: 600 }}>{f}</td>
                                <td style={{ textAlign: "center", padding: "6px 4px" }}>{ptrc}</td>
                                <td style={{ textAlign: "center", padding: "6px 4px" }}>{ptec}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px 12px", fontSize: "0.78rem" }}>
                    <strong style={{ color: "#dc2626" }}>⚠️ Penalties for Non-Compliance:</strong>
                    <div style={{ marginTop: 4, color: "#7f1d1d" }}>
                        • Late payment interest: ~1.25%/month on outstanding ({fmt(result.lateInterest)}/month)<br />
                        • Non-filing penalty: 10% of tax or ₹1,000+ ({fmt(result.penalty)})<br />
                        • Late registration: ₹5/day until registration completed
                    </div>
                </div>
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function ProfessionalTaxCalculatorCore() {
    const [mode, setMode] = useState<Mode>("state");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏛️ Professional Tax Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>State-wise slabs • Section 16(iii) deduction • Cross-state comparison • Employer compliance</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--n-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 120, padding: "12px 8px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--n-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--n-primary-light)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                        color: mode === m.key ? "var(--n-primary)" : "var(--n-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: "var(--s-5)" }}>
                {mode === "state" && <StateMode />}
                {mode === "annual" && <AnnualMode />}
                {mode === "compare" && <CompareMode />}
                {mode === "employer" && <EmployerMode />}
            </div>
        </div>
    );
}

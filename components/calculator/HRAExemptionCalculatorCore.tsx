"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/* ─── Metro city list (expanded from Budget 2026) ─── */
const METRO_CITIES = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad"];
const NON_METRO_EXAMPLES = ["Jaipur", "Lucknow", "Chandigarh", "Indore", "Nagpur", "Patna", "Bhopal", "Kochi", "Coimbatore"];

/* ─── Shared Input ─── */
function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : fmt(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min || 0} max={max || 10_00_000} step={step || 1000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

type Mode = "calculator" | "regime" | "rent_parents" | "optimiser";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "calculator", icon: "🧮", label: "HRA Exemption" },
    { key: "regime", icon: "⚖️", label: "Old vs New Regime" },
    { key: "rent_parents", icon: "👨‍👩‍👧", label: "Rent to Parents" },
    { key: "optimiser", icon: "📈", label: "Rent Optimiser" },
];

/* Formula: HRA exempt = MIN(actual HRA, 50/40% of basic, rent-10% of basic) */
function calcHRA(basic: number, hra: number, rent: number, isMetro: boolean) {
    const pctOfBasic = isMetro ? 0.5 : 0.4;
    const rule1 = hra; // Actual HRA received
    const rule2 = basic * pctOfBasic; // 50% or 40% of Basic+DA
    const rule3 = Math.max(0, rent - basic * 0.1); // Rent paid − 10% of salary
    const exempt = Math.min(rule1, rule2, rule3);
    const taxable = Math.max(0, hra - exempt);
    return { rule1, rule2, rule3, exempt, taxable };
}

/* ═══════ MODE 1: HRA EXEMPTION CALCULATOR ═══════ */
function CalculatorMode() {
    const [basic, setBasic] = useState(600000);
    const [da, setDA] = useState(0);
    const [hra, setHRA] = useState(300000);
    const [rentAnnual, setRentAnnual] = useState(180000);
    const [isMetro, setIsMetro] = useState(true);

    const salary = basic + da;
    const result = calcHRA(salary, hra, rentAnnual, isMetro);
    const monthlyRent = Math.round(rentAnnual / 12);

    return (
        <>
            <InputRow label="Basic Salary (Annual)" value={basic} set={setBasic} max={30_00_000} step={10000} min={100000}
                hint="Your basic pay as per salary slip" />
            <InputRow label="Dearness Allowance (Annual)" value={da} set={setDA} max={10_00_000} step={5000}
                hint="DA forms part of salary for HRA. Set 0 if not applicable" />
            <InputRow label="HRA Received (Annual)" value={hra} set={setHRA} max={20_00_000} step={5000} min={0}
                hint="House Rent Allowance as per salary slip" />
            <InputRow label="Rent Paid (Annual)" value={rentAnnual} set={setRentAnnual} max={25_00_000} step={5000} min={0}
                hint={`Monthly rent: ${fmt(monthlyRent)}. Must have rent receipts.`} />

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsMetro(true)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: isMetro ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: isMetro ? 700 : 500, color: isMetro ? "var(--n-primary)" : "var(--n-text)",
                }}>🏙️ Metro (50%)</button>
                <button onClick={() => setIsMetro(false)} style={{
                    flex: 1, padding: "10px 8px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                    border: !isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                    background: !isMetro ? "var(--n-primary-light)" : "var(--n-surface)",
                    fontWeight: !isMetro ? 700 : 500, color: !isMetro ? "var(--n-primary)" : "var(--n-text)",
                }}>🏘️ Non-Metro (40%)</button>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        HRA Exemption under Section 10(13A)
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>
                        {fmt(result.exempt)}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>Tax-Free HRA per year</div>
                </div>

                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", marginBottom: 6 }}>Three-Rule Comparison</div>
                {[
                    { label: "Rule 1: Actual HRA received", val: result.rule1, isMin: result.exempt === result.rule1 },
                    { label: `Rule 2: ${isMetro ? "50%" : "40%"} of Basic + DA`, val: result.rule2, isMin: result.exempt === result.rule2 },
                    { label: "Rule 3: Rent − 10% of Salary", val: result.rule3, isMin: result.exempt === result.rule3 },
                ].map((r, i) => (
                    <div key={i} style={{
                        display: "flex", justifyContent: "space-between", padding: "8px 10px", borderRadius: 6, marginBottom: 4,
                        background: r.isMin ? "#f0fdf4" : "var(--n-surface)",
                        border: r.isMin ? "1px solid #16a34a" : "1px solid var(--n-border)",
                    }}>
                        <span style={{ fontSize: "0.8rem", color: r.isMin ? "#16a34a" : "var(--n-text-muted)", fontWeight: r.isMin ? 700 : 500 }}>
                            {r.isMin ? "✅ " : ""}{r.label}
                        </span>
                        <span style={{ fontWeight: 700, fontFamily: "var(--font-mono, monospace)", fontSize: "0.82rem", color: r.isMin ? "#16a34a" : "var(--n-text)" }}>{fmt(r.val)}</span>
                    </div>
                ))}

                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", marginTop: "var(--s-3)" }}>
                    <tbody>
                        {[
                            ["Salary (Basic + DA)", fmt(salary)],
                            ["Total HRA Received", fmt(hra)],
                            ["Total Rent Paid", fmt(rentAnnual)],
                            ["HRA Exempt (Tax-Free)", fmt(result.exempt)],
                            ["HRA Taxable (Added to Income)", fmt(result.taxable)],
                            ["Tax Saved (approx. @ 30%)", fmt(result.exempt * 0.312)],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 3 ? 700 : 500, color: i === 3 ? "#16a34a" : i === 4 ? "#dc2626" : i === 5 ? "#2563eb" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {rentAnnual > 100000 && (
                    <div style={{ background: "#fffbeb", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                        <strong style={{ color: "#b45309" }}>📋 Compliance:</strong> Your annual rent exceeds ₹1,00,000. You MUST provide your landlord&apos;s PAN to claim HRA exemption.
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: OLD VS NEW REGIME ═══════ */
function RegimeMode() {
    const [grossSalary, setGrossSalary] = useState(1500000);
    const [basic, setBasic] = useState(600000);
    const [hra, setHRA] = useState(300000);
    const [rentAnnual, setRentAnnual] = useState(240000);
    const [isMetro, setIsMetro] = useState(true);
    const [sec80C, setSec80C] = useState(150000);
    const [sec80D, setSec80D] = useState(25000);
    const [homeLoan, setHomeLoan] = useState(0);

    const hraResult = calcHRA(basic, hra, rentAnnual, isMetro);

    // Old regime
    const oldStdDeduction = 50000;
    const oldDeductions = sec80C + sec80D + hraResult.exempt + homeLoan + oldStdDeduction;
    const oldTaxableIncome = Math.max(0, grossSalary - oldDeductions);

    // New regime
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, grossSalary - newStdDeduction);

    // Simplified tax calc (approximate)
    function calcTax(income: number, regime: "old" | "new"): number {
        if (regime === "new") {
            if (income <= 400000) return 0;
            let tax = 0;
            const slabs = [[400000, 0], [400000, 0.05], [400000, 0.10], [400000, 0.15], [400000, 0.20], [400000, 0.25], [Infinity, 0.30]];
            let remaining = income;
            for (const [width, rate] of slabs) {
                const chunk = Math.min(remaining, width);
                tax += chunk * rate;
                remaining -= chunk;
                if (remaining <= 0) break;
            }
            if (income <= 1200000) tax = Math.max(0, tax - 60000); // 87A rebate
            return tax * 1.04; // cess
        } else {
            if (income <= 250000) return 0;
            let tax = 0;
            const slabs = [[250000, 0], [250000, 0.05], [500000, 0.20], [Infinity, 0.30]];
            let remaining = income;
            for (const [width, rate] of slabs) {
                const chunk = Math.min(remaining, width);
                tax += chunk * rate;
                remaining -= chunk;
                if (remaining <= 0) break;
            }
            if (income <= 500000) tax = Math.max(0, tax - 12500); // 87A rebate
            return tax * 1.04; // cess
        }
    }

    const oldTax = calcTax(oldTaxableIncome, "old");
    const newTax = calcTax(newTaxableIncome, "new");
    const savings = newTax - oldTax;

    return (
        <>
            <InputRow label="Gross Salary (Annual)" value={grossSalary} set={setGrossSalary} max={50_00_000} step={25000} min={300000} />
            <InputRow label="Basic Salary (Annual)" value={basic} set={setBasic} max={30_00_000} step={10000} min={100000} />
            <InputRow label="HRA Received (Annual)" value={hra} set={setHRA} max={20_00_000} step={5000} />
            <InputRow label="Rent Paid (Annual)" value={rentAnnual} set={setRentAnnual} max={25_00_000} step={5000} />
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsMetro(true)} style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer", border: isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: isMetro ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: isMetro ? 700 : 500, color: isMetro ? "var(--n-primary)" : "var(--n-text)" }}>Metro (50%)</button>
                <button onClick={() => setIsMetro(false)} style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer", border: !isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: !isMetro ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: !isMetro ? 700 : 500, color: !isMetro ? "var(--n-primary)" : "var(--n-text)" }}>Non-Metro (40%)</button>
            </div>
            <InputRow label="Section 80C (PF/PPF/ELSS/LIC)" value={sec80C} set={setSec80C} max={150000} step={5000} hint="Max ₹1.5L" />
            <InputRow label="Section 80D (Health Insurance)" value={sec80D} set={setSec80D} max={100000} step={5000} hint="Self ₹25K + Parents ₹25K (₹50K if sr.)" />
            <InputRow label="Home Loan Interest (Sec 24b)" value={homeLoan} set={setHomeLoan} max={200000} step={10000} hint="Max ₹2L for self-occupied" />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "var(--s-3)", textAlign: "center", border: savings > 0 ? "2px solid #16a34a" : "1px solid var(--n-border)" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>Old Regime</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmt(oldTax)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Total Deductions: {fmt(oldDeductions)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>HRA Exempt: {fmt(hraResult.exempt)}</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: "var(--s-3)", textAlign: "center", border: savings <= 0 ? "2px solid #2563eb" : "1px solid var(--n-border)" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>New Regime</div>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmt(newTax)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>Std Deduction: {fmt(newStdDeduction)}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>No HRA / 80C / 80D</div>
                    </div>
                </div>
                <div style={{ textAlign: "center", padding: "var(--s-3) 0", marginTop: "var(--s-2)" }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: savings > 0 ? "#16a34a" : "#2563eb" }}>
                        {savings > 0 ? `✅ Old Regime saves you ${fmt(savings)}` : savings < 0 ? `✅ New Regime saves you ${fmt(-savings)}` : "Both regimes result in same tax"}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                        HRA exemption value: {fmt(hraResult.exempt)} — {savings > 0 ? "HRA is making old regime win!" : "HRA alone cannot offset new regime benefits"}
                    </div>
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 3: RENT TO PARENTS ═══════ */
function RentParentsMode() {
    const [basic, setBasic] = useState(600000);
    const [hra, setHRA] = useState(300000);
    const [parentTaxBracket, setParentTaxBracket] = useState(0);

    const annualRent = basic * 0.4; // Optimal rent
    const isMetro = true; // typically
    const result = calcHRA(basic, hra, annualRent, isMetro);
    const yourTaxSaved = result.exempt * 0.312; // 30% + cess
    const parentTaxOnRent = annualRent * (parentTaxBracket / 100);
    const netFamilySavings = yourTaxSaved - parentTaxOnRent;

    return (
        <>
            <div style={{ background: "#f0f9ff", border: "1px solid #3b82f6", borderRadius: 10, padding: "12px 14px", marginBottom: 14, fontSize: "0.82rem" }}>
                <strong style={{ color: "#2563eb" }}>💡 Strategy:</strong> If you live with your parents who own the house, you can pay rent to them and claim HRA exemption. Your parents show it as rental income (often taxed at 0% if they&apos;re in the nil bracket or lower bracket).
            </div>
            <InputRow label="Basic Salary (Annual)" value={basic} set={setBasic} max={30_00_000} step={10000} min={100000} />
            <InputRow label="HRA Received (Annual)" value={hra} set={setHRA} max={20_00_000} step={5000} />

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 6 }}>Parent&apos;s Tax Bracket</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {[{ label: "Nil (0%)", val: 0 }, { label: "5%", val: 5 }, { label: "20%", val: 20 }, { label: "30%", val: 30 }].map(b => (
                        <button key={b.val} onClick={() => setParentTaxBracket(b.val)} style={{
                            flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer",
                            border: parentTaxBracket === b.val ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: parentTaxBracket === b.val ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: parentTaxBracket === b.val ? 700 : 500,
                            color: parentTaxBracket === b.val ? "var(--n-primary)" : "var(--n-text)",
                        }}>{b.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>
                        Net Family Tax Savings
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: netFamilySavings > 0 ? "#16a34a" : "#dc2626" }}>
                        {fmt(netFamilySavings)}
                    </div>
                </div>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Optimal Rent to Parents (40% of Basic)", fmt(annualRent)],
                            ["Monthly Rent Payment", fmt(annualRent / 12)],
                            ["HRA Exemption Claimed", fmt(result.exempt)],
                            ["Your Tax Saved (30% bracket + cess)", fmt(yourTaxSaved)],
                            ["Parent's Tax on Rental Income", `-${fmt(parentTaxOnRent)}`],
                            ["Net Family Savings", fmt(netFamilySavings)],
                        ].map(([l, v], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "8px 4px", color: "var(--n-text-muted)" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: i >= 3 ? 700 : 500, color: i === 5 ? "#16a34a" : i === 4 ? "#dc2626" : i === 3 ? "#2563eb" : undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ background: "#fffbeb", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.78rem" }}>
                    <strong style={{ color: "#b45309" }}>📋 Requirements:</strong> (1) Valid rent agreement between you and parents. (2) Rent receipts with revenue stamp. (3) Parent must show rental income in their ITR. (4) Property must be owned by parent, not you. (5) Provide parent&apos;s PAN if rent &gt; ₹1L/year.
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 4: RENT OPTIMISER ═══════ */
function OptimiserMode() {
    const [basic, setBasic] = useState(600000);
    const [hra, setHRA] = useState(300000);
    const [isMetro, setIsMetro] = useState(true);

    const pct = isMetro ? 0.5 : 0.4;
    const rentLevels = Array.from({ length: 20 }, (_, i) => (i + 1) * 10000);
    const results = rentLevels.map(rent => {
        const r = calcHRA(basic, hra, rent, isMetro);
        return { rent, exempt: r.exempt, taxSaved: r.exempt * 0.312, marginalBenefit: 0 };
    });
    // Compute marginal benefit
    for (let i = 1; i < results.length; i++) {
        results[i].marginalBenefit = results[i].taxSaved - results[i - 1].taxSaved;
    }
    // Find optimal rent (where marginal benefit drops to ~0)
    const optimal = results.find((r, i) => i > 0 && results[i].exempt === results[i - 1].exempt) || results[results.length - 1];

    return (
        <>
            <InputRow label="Basic Salary (Annual)" value={basic} set={setBasic} max={30_00_000} step={10000} min={100000} />
            <InputRow label="HRA Received (Annual)" value={hra} set={setHRA} max={20_00_000} step={5000} />
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={() => setIsMetro(true)} style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer", border: isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: isMetro ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: isMetro ? 700 : 500, color: isMetro ? "var(--n-primary)" : "var(--n-text)" }}>Metro (50%)</button>
                <button onClick={() => setIsMetro(false)} style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: "0.8rem", cursor: "pointer", border: !isMetro ? "2px solid var(--n-primary)" : "1px solid var(--n-border)", background: !isMetro ? "var(--n-primary-light)" : "var(--n-surface)", fontWeight: !isMetro ? 700 : 500, color: !isMetro ? "var(--n-primary)" : "var(--n-text)" }}>Non-Metro (40%)</button>
            </div>

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        Optimal Annual Rent
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "var(--n-primary)" }}>
                        {fmt(optimal.rent)} <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>({fmt(optimal.rent / 12)}/month)</span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>Maximum HRA exemption: {fmt(optimal.exempt)} | Tax saved: {fmt(optimal.taxSaved)}</div>
                </div>

                <div style={{ fontSize: "0.78rem", fontWeight: 700, marginBottom: 6, color: "var(--n-primary)" }}>Rent vs Exemption Table</div>
                <div style={{ overflowX: "auto", maxHeight: 300 }}>
                    <table style={{ width: "100%", fontSize: "0.72rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)", position: "sticky", top: 0, background: "var(--n-surface-alt)" }}>
                            <th style={{ textAlign: "left", padding: "6px 3px" }}>Monthly Rent</th>
                            <th style={{ textAlign: "right", padding: "6px 3px" }}>Annual Rent</th>
                            <th style={{ textAlign: "right", padding: "6px 3px" }}>HRA Exempt</th>
                            <th style={{ textAlign: "right", padding: "6px 3px" }}>Tax Saved</th>
                        </tr></thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={i} style={{
                                    borderBottom: "1px solid var(--n-border)",
                                    background: r.rent === optimal.rent ? "#f0fdf4" : "",
                                    fontWeight: r.rent === optimal.rent ? 700 : 400,
                                }}>
                                    <td style={{ padding: "5px 3px" }}>{fmt(r.rent / 12)}</td>
                                    <td style={{ textAlign: "right", padding: "5px 3px" }}>{fmt(r.rent)}</td>
                                    <td style={{ textAlign: "right", padding: "5px 3px", color: "#16a34a" }}>{fmt(r.exempt)}</td>
                                    <td style={{ textAlign: "right", padding: "5px 3px", color: "#2563eb" }}>{fmt(r.taxSaved)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 8 }}>
                    🎯 Beyond {fmt(optimal.rent)}/year, additional rent does NOT increase your HRA exemption.
                </div>
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function HRAExemptionCalculatorCore() {
    const [mode, setMode] = useState<Mode>("calculator");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🏠 HRA Exemption Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Section 10(13A) • Rule 2A • Metro/Non-Metro • Old vs New Regime</div>
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
                {mode === "regime" && <RegimeMode />}
                {mode === "rent_parents" && <RentParentsMode />}
                {mode === "optimiser" && <OptimiserMode />}
            </div>
        </div>
    );
}

"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

type Mode = "new" | "old" | "compare";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "new", icon: "🆕", label: "New Regime" },
    { key: "old", icon: "📋", label: "Old Regime" },
    { key: "compare", icon: "⚖️", label: "Compare Regimes" },
];

/* ─── NEW REGIME SLABS FY 2025-26 ─── */
const NEW_SLABS = [
    { from: 0, to: 4_00_000, rate: 0 },
    { from: 4_00_000, to: 8_00_000, rate: 5 },
    { from: 8_00_000, to: 12_00_000, rate: 10 },
    { from: 12_00_000, to: 16_00_000, rate: 15 },
    { from: 16_00_000, to: 20_00_000, rate: 20 },
    { from: 20_00_000, to: 24_00_000, rate: 25 },
    { from: 24_00_000, to: Infinity, rate: 30 },
];

/* ─── OLD REGIME SLABS ─── */
const OLD_SLABS_BELOW60 = [
    { from: 0, to: 2_50_000, rate: 0 },
    { from: 2_50_000, to: 5_00_000, rate: 5 },
    { from: 5_00_000, to: 10_00_000, rate: 20 },
    { from: 10_00_000, to: Infinity, rate: 30 },
];
const OLD_SLABS_SENIOR = [
    { from: 0, to: 3_00_000, rate: 0 },
    { from: 3_00_000, to: 5_00_000, rate: 5 },
    { from: 5_00_000, to: 10_00_000, rate: 20 },
    { from: 10_00_000, to: Infinity, rate: 30 },
];
const OLD_SLABS_SUPER = [
    { from: 0, to: 5_00_000, rate: 0 },
    { from: 5_00_000, to: 10_00_000, rate: 20 },
    { from: 10_00_000, to: Infinity, rate: 30 },
];

function getOldSlabs(age: string) {
    if (age === "80+") return OLD_SLABS_SUPER;
    if (age === "60-80") return OLD_SLABS_SENIOR;
    return OLD_SLABS_BELOW60;
}

/* ─── Tax computation engine ─── */
function computeSlabTax(income: number, slabs: typeof NEW_SLABS) {
    let remaining = income;
    let totalTax = 0;
    const breakdown: { slab: string; taxableAmount: number; rate: number; tax: number }[] = [];
    for (const s of slabs) {
        const width = s.to === Infinity ? remaining : Math.min(s.to - s.from, remaining);
        if (width <= 0) break;
        const tax = width * s.rate / 100;
        breakdown.push({
            slab: s.to === Infinity ? `Above ${fmt(s.from)}` : `${fmt(s.from)} – ${fmt(s.to)}`,
            taxableAmount: width, rate: s.rate, tax,
        });
        totalTax += tax;
        remaining -= width;
    }
    return { totalTax, breakdown };
}

function computeSurcharge(taxableIncome: number, tax: number, isNewRegime: boolean) {
    if (taxableIncome <= 50_00_000) return 0;
    let rate = 0;
    if (isNewRegime) {
        if (taxableIncome > 5_00_00_000) rate = 25;
        else if (taxableIncome > 2_00_00_000) rate = 25;
        else if (taxableIncome > 1_00_00_000) rate = 15;
        else rate = 10;
    } else {
        if (taxableIncome > 5_00_00_000) rate = 37;
        else if (taxableIncome > 2_00_00_000) rate = 25;
        else if (taxableIncome > 1_00_00_000) rate = 15;
        else rate = 10;
    }
    return tax * rate / 100;
}

function computeFullTax(
    grossIncome: number,
    deductions: number,
    slabs: typeof NEW_SLABS,
    isNewRegime: boolean,
    standardDeduction: number,
) {
    const totalDeductions = deductions + standardDeduction;
    const taxableIncome = Math.max(grossIncome - totalDeductions, 0);
    const { totalTax: rawTax, breakdown } = computeSlabTax(taxableIncome, slabs);

    // 87A Rebate
    let rebate = 0;
    if (isNewRegime && taxableIncome <= 12_00_000) {
        rebate = Math.min(rawTax, 60_000);
    } else if (!isNewRegime && taxableIncome <= 5_00_000) {
        rebate = Math.min(rawTax, 12_500);
    }

    let taxAfterRebate = Math.max(rawTax - rebate, 0);

    // Marginal relief for new regime (income just above 12L)
    if (isNewRegime && taxableIncome > 12_00_000 && taxableIncome <= 12_75_000) {
        const excessIncome = taxableIncome - 12_00_000;
        if (taxAfterRebate > excessIncome) {
            taxAfterRebate = excessIncome;
        }
    }

    const surcharge = computeSurcharge(taxableIncome, taxAfterRebate, isNewRegime);
    const cess = (taxAfterRebate + surcharge) * 0.04;
    const totalTax = taxAfterRebate + surcharge + cess;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

    return {
        grossIncome, totalDeductions, taxableIncome, rawTax, rebate,
        taxAfterRebate, surcharge, cess, totalTax, effectiveRate,
        breakdown, monthlyTax: totalTax / 12, standardDeduction,
    };
}

/* ─── Sub: Input Row ─── */
function InputRow({ label, value, set, max, suffix, hint }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; suffix?: string; hint?: string;
}) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono, monospace)" }}>{fmt(value)}{suffix || ""}</span>
            </label>
            <input type="range" min={0} max={max || 50_00_000} step={5000} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

/* ─── Sub: Result Panel ─── */
function ResultPanel({ r, label }: { r: ReturnType<typeof computeFullTax>; label: string }) {
    return (
        <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)" }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-3)" }}>
                {label}
            </div>
            <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                    {r.totalTax < 1 ? "₹0 (No Tax)" : fmt(r.totalTax)}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>
                    Effective Rate: {pct(r.effectiveRate)} • Monthly TDS: {fmt(r.monthlyTax)}
                </div>
            </div>

            {/* Slab breakdown */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Slab</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Amount</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Rate</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Tax</th>
                    </tr></thead>
                    <tbody>
                        {r.breakdown.map((b, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                                <td style={{ padding: "5px 4px" }}>{b.slab}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px" }}>{fmt(b.taxableAmount)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px" }}>{b.rate}%</td>
                                <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 600 }}>{fmt(b.tax)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div style={{ background: "var(--c-bg)", borderRadius: 8, padding: "10px 12px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Gross Income</span><span style={{ fontWeight: 600 }}>{fmt(r.grossIncome)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Standard Deduction</span><span style={{ fontWeight: 600 }}>−{fmt(r.standardDeduction)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Other Deductions</span><span style={{ fontWeight: 600 }}>−{fmt(r.totalDeductions - r.standardDeduction)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderTop: "1px dashed var(--c-border)" }}>
                    <span style={{ fontWeight: 700 }}>Taxable Income</span><span style={{ fontWeight: 700 }}>{fmt(r.taxableIncome)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Tax on Income</span><span>{fmt(r.rawTax)}</span>
                </div>
                {r.rebate > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "#16a34a" }}>Less: Rebate u/s 87A</span><span style={{ color: "#16a34a", fontWeight: 600 }}>−{fmt(r.rebate)}</span>
                </div>}
                {r.surcharge > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Surcharge</span><span>{fmt(r.surcharge)}</span>
                </div>}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ color: "var(--c-text-muted)" }}>Health &amp; Education Cess (4%)</span><span>{fmt(r.cess)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderTop: "2px solid var(--c-border)", fontWeight: 800, fontSize: "1rem" }}>
                    <span>Total Tax Payable</span><span style={{ color: r.totalTax < 1 ? "#16a34a" : "var(--c-text)" }}>{r.totalTax < 1 ? "₹0" : fmt(r.totalTax)}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════ MODE 1: NEW REGIME ═══════════ */
function NewRegimeMode() {
    const [salary, setSalary] = useState(12_00_000);
    const [interest, setInterest] = useState(0);
    const [rental, setRental] = useState(0);
    const [other, setOther] = useState(0);
    const [empNPS, setEmpNPS] = useState(0);

    const result = useMemo(() => {
        const gross = salary + interest + rental + other;
        return computeFullTax(gross, empNPS, NEW_SLABS, true, 75_000);
    }, [salary, interest, rental, other, empNPS]);

    return (
        <>
            <InputRow label="Gross Salary Income" value={salary} set={setSalary} max={1_00_00_000} />
            <InputRow label="Income from Interest (FD, Savings)" value={interest} set={setInterest} max={10_00_000} />
            <InputRow label="Rental Income" value={rental} set={setRental} max={20_00_000} />
            <InputRow label="Other Income" value={other} set={setOther} max={10_00_000} />
            <InputRow label="Employer NPS — 80CCD(2)" value={empNPS} set={setEmpNPS} max={5_00_000}
                hint="Available in BOTH regimes — employer contribution up to 10% of Basic+DA" />
            <ResultPanel r={result} label="New Regime — FY 2025-26 (AY 2026-27)" />
        </>
    );
}

/* ═══════════ MODE 2: OLD REGIME ═══════════ */
function OldRegimeMode() {
    const [age, setAge] = useState<string>("0-60");
    const [salary, setSalary] = useState(12_00_000);
    const [interest, setInterest] = useState(0);
    const [rental, setRental] = useState(0);
    const [other, setOther] = useState(0);
    const [sec80C, setSec80C] = useState(1_50_000);
    const [sec80D, setSec80D] = useState(25_000);
    const [sec80DParents, setSec80DParents] = useState(25_000);
    const [sec80CCD1B, setSec80CCD1B] = useState(50_000);
    const [empNPS, setEmpNPS] = useState(0);
    const [hra, setHRA] = useState(0);
    const [homeLoan, setHomeLoan] = useState(0);
    const [sec80E, setSec80E] = useState(0);
    const [sec80TTA, setSec80TTA] = useState(10_000);

    const result = useMemo(() => {
        const gross = salary + interest + rental + other;
        const totalDed = Math.min(sec80C, 1_50_000) + Math.min(sec80D, age === "0-60" ? 25_000 : 50_000) +
            Math.min(sec80DParents, 50_000) + Math.min(sec80CCD1B, 50_000) + empNPS +
            hra + Math.min(homeLoan, 2_00_000) + sec80E + Math.min(sec80TTA, age === "80+" ? 50_000 : 10_000);
        return computeFullTax(gross, totalDed, getOldSlabs(age), false, 50_000);
    }, [salary, interest, rental, other, sec80C, sec80D, sec80DParents, sec80CCD1B, empNPS, hra, homeLoan, sec80E, sec80TTA, age]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Age Group</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {["0-60", "60-80", "80+"].map(a => (
                        <button key={a} onClick={() => setAge(a)} style={{
                            flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: age === a ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                            background: age === a ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                            fontWeight: age === a ? 700 : 500,
                            color: age === a ? "var(--c-primary)" : "var(--c-text)",
                        }}>
                            {a === "0-60" ? "Below 60" : a === "60-80" ? "Senior (60–80)" : "Super Senior (80+)"}
                        </button>
                    ))}
                </div>
            </div>

            <InputRow label="Gross Salary Income" value={salary} set={setSalary} max={1_00_00_000} />
            <InputRow label="Income from Interest" value={interest} set={setInterest} max={10_00_000} />
            <InputRow label="Rental Income" value={rental} set={setRental} max={20_00_000} />
            <InputRow label="Other Income" value={other} set={setOther} max={10_00_000} />

            <div style={{ padding: "12px 14px", background: "var(--c-surface)", borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 10 }}>📋 Deductions (Old Regime Only)</div>
                <InputRow label="Section 80C (PPF, ELSS, LIC, EPF)" value={sec80C} set={setSec80C} max={1_50_000} hint="Max ₹1,50,000" />
                <InputRow label="80D — Health Insurance (Self)" value={sec80D} set={setSec80D} max={50_000} hint={age === "0-60" ? "Max ₹25,000 (below 60)" : "Max ₹50,000 (senior)"} />
                <InputRow label="80D — Health Insurance (Parents)" value={sec80DParents} set={setSec80DParents} max={50_000} hint="₹25K if below 60, ₹50K if senior" />
                <InputRow label="80CCD(1B) — NPS (Additional ₹50K)" value={sec80CCD1B} set={setSec80CCD1B} max={50_000} />
                <InputRow label="Employer NPS — 80CCD(2)" value={empNPS} set={setEmpNPS} max={5_00_000} hint="Available in BOTH regimes" />
                <InputRow label="HRA Exemption" value={hra} set={setHRA} max={5_00_000} />
                <InputRow label="Home Loan Interest — Section 24(b)" value={homeLoan} set={setHomeLoan} max={2_00_000} hint="Max ₹2,00,000 for self-occupied" />
                <InputRow label="80E — Education Loan Interest" value={sec80E} set={setSec80E} max={5_00_000} hint="No upper limit" />
                <InputRow label="80TTA/80TTB — Savings Interest" value={sec80TTA} set={setSec80TTA} max={50_000} hint={age === "80+" ? "80TTB: Max ₹50,000 for super seniors" : "80TTA: Max ₹10,000"} />
            </div>

            <ResultPanel r={result} label={`Old Regime — FY 2025-26 (${age === "0-60" ? "Below 60" : age === "60-80" ? "Senior Citizen" : "Super Senior Citizen"})`} />
        </>
    );
}

/* ═══════════ MODE 3: COMPARE ═══════════ */
function CompareMode() {
    const [age, setAge] = useState<string>("0-60");
    const [salary, setSalary] = useState(15_00_000);
    const [interest, setInterest] = useState(0);
    const [rental, setRental] = useState(0);
    const [other, setOther] = useState(0);
    const [sec80C, setSec80C] = useState(1_50_000);
    const [sec80D, setSec80D] = useState(25_000);
    const [sec80DParents, setSec80DParents] = useState(25_000);
    const [sec80CCD1B, setSec80CCD1B] = useState(50_000);
    const [empNPS, setEmpNPS] = useState(0);
    const [hra, setHRA] = useState(0);
    const [homeLoan, setHomeLoan] = useState(0);
    const [sec80E, setSec80E] = useState(0);
    const [sec80TTA, setSec80TTA] = useState(10_000);

    const { newResult, oldResult, savings, better } = useMemo(() => {
        const gross = salary + interest + rental + other;
        const newR = computeFullTax(gross, empNPS, NEW_SLABS, true, 75_000);
        const totalOldDed = Math.min(sec80C, 1_50_000) + Math.min(sec80D, age === "0-60" ? 25_000 : 50_000) +
            Math.min(sec80DParents, 50_000) + Math.min(sec80CCD1B, 50_000) + empNPS +
            hra + Math.min(homeLoan, 2_00_000) + sec80E + Math.min(sec80TTA, age === "80+" ? 50_000 : 10_000);
        const oldR = computeFullTax(gross, totalOldDed, getOldSlabs(age), false, 50_000);
        const s = Math.abs(newR.totalTax - oldR.totalTax);
        const b = newR.totalTax <= oldR.totalTax ? "new" : "old";
        return { newResult: newR, oldResult: oldR, savings: s, better: b };
    }, [salary, interest, rental, other, sec80C, sec80D, sec80DParents, sec80CCD1B, empNPS, hra, homeLoan, sec80E, sec80TTA, age]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Age Group</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {["0-60", "60-80", "80+"].map(a => (
                        <button key={a} onClick={() => setAge(a)} style={{
                            flex: 1, padding: "10px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                            border: age === a ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                            background: age === a ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                            fontWeight: age === a ? 700 : 500, color: age === a ? "var(--c-primary)" : "var(--c-text)",
                        }}>{a === "0-60" ? "Below 60" : a === "60-80" ? "Senior (60–80)" : "Super Senior (80+)"}</button>
                    ))}
                </div>
            </div>

            <InputRow label="Gross Salary Income" value={salary} set={setSalary} max={1_00_00_000} />
            <InputRow label="Income from Interest" value={interest} set={setInterest} max={10_00_000} />
            <InputRow label="Rental Income" value={rental} set={setRental} max={20_00_000} />
            <InputRow label="Other Income" value={other} set={setOther} max={10_00_000} />

            <div style={{ padding: "12px 14px", background: "var(--c-surface)", borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: 10 }}>📋 Deductions (Applied to Old Regime)</div>
                <InputRow label="Section 80C" value={sec80C} set={setSec80C} max={1_50_000} />
                <InputRow label="80D — Self" value={sec80D} set={setSec80D} max={50_000} />
                <InputRow label="80D — Parents" value={sec80DParents} set={setSec80DParents} max={50_000} />
                <InputRow label="80CCD(1B) — NPS" value={sec80CCD1B} set={setSec80CCD1B} max={50_000} />
                <InputRow label="Employer NPS — 80CCD(2)" value={empNPS} set={setEmpNPS} max={5_00_000} />
                <InputRow label="HRA Exemption" value={hra} set={setHRA} max={5_00_000} />
                <InputRow label="Home Loan — 24(b)" value={homeLoan} set={setHomeLoan} max={2_00_000} />
                <InputRow label="80E — Education Loan" value={sec80E} set={setSec80E} max={5_00_000} />
                <InputRow label="80TTA/TTB" value={sec80TTA} set={setSec80TTA} max={50_000} />
            </div>

            {/* Winner banner */}
            <div style={{
                padding: "16px", borderRadius: 12, textAlign: "center", marginBottom: "var(--s-4)",
                background: better === "new" ? "#e8f0fe" : "#dcfce7",
                border: `2px solid ${better === "new" ? "var(--c-primary)" : "#16a34a"}`,
            }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: better === "new" ? "var(--c-primary)" : "#16a34a" }}>
                    {better === "new" ? "🆕 New Regime" : "📋 Old Regime"} saves you {fmt(savings)}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginTop: 4 }}>
                    New: {fmt(newResult.totalTax)} ({pct(newResult.effectiveRate)}) vs Old: {fmt(oldResult.totalTax)} ({pct(oldResult.effectiveRate)})
                </div>
            </div>

            {/* Side-by-side comparison table */}
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 4px" }}>Parameter</th>
                        <th style={{ textAlign: "right", padding: "8px 4px", color: better === "new" ? "var(--c-primary)" : undefined }}>🆕 New Regime</th>
                        <th style={{ textAlign: "right", padding: "8px 4px", color: better === "old" ? "#16a34a" : undefined }}>📋 Old Regime</th>
                    </tr></thead>
                    <tbody>
                        {[
                            ["Gross Income", fmt(newResult.grossIncome), fmt(oldResult.grossIncome)],
                            ["Standard Deduction", fmt(75_000), fmt(50_000)],
                            ["Other Deductions", fmt(0), fmt(oldResult.totalDeductions - 50_000)],
                            ["Taxable Income", fmt(newResult.taxableIncome), fmt(oldResult.taxableIncome)],
                            ["Tax on Income", fmt(newResult.rawTax), fmt(oldResult.rawTax)],
                            ["Rebate u/s 87A", `−${fmt(newResult.rebate)}`, `−${fmt(oldResult.rebate)}`],
                            ["Surcharge", fmt(newResult.surcharge), fmt(oldResult.surcharge)],
                            ["Cess (4%)", fmt(newResult.cess), fmt(oldResult.cess)],
                        ].map(([l, n, o], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                                <td style={{ padding: "6px 4px" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{n}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{o}</td>
                            </tr>
                        ))}
                        <tr style={{ borderTop: "2px solid var(--c-border)", fontWeight: 800, fontSize: "0.95rem" }}>
                            <td style={{ padding: "8px 4px" }}>Total Tax Payable</td>
                            <td style={{ textAlign: "right", padding: "8px 4px", color: better === "new" ? "var(--c-primary)" : undefined }}>
                                {better === "new" ? "⭐ " : ""}{fmt(newResult.totalTax)}
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 4px", color: better === "old" ? "#16a34a" : undefined }}>
                                {better === "old" ? "⭐ " : ""}{fmt(oldResult.totalTax)}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: "6px 4px", color: "var(--c-text-muted)" }}>Effective Rate</td>
                            <td style={{ textAlign: "right", padding: "6px 4px" }}>{pct(newResult.effectiveRate)}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px" }}>{pct(oldResult.effectiveRate)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: "6px 4px", color: "var(--c-text-muted)" }}>Monthly TDS</td>
                            <td style={{ textAlign: "right", padding: "6px 4px" }}>{fmt(newResult.monthlyTax)}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px" }}>{fmt(oldResult.monthlyTax)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function IncomeTaxIndiaCore() {
    const [mode, setMode] = useState<Mode>("new");

    return (
        <div style={{ background: "var(--c-card-bg, #fff)", borderRadius: 16, border: "1px solid var(--c-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--c-border)", background: "linear-gradient(135deg, var(--c-primary-bg, #e8f0fe), var(--c-surface))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🧾 Income Tax Calculator — FY 2025-26</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--c-text-muted)", marginTop: 4 }}>Budget 2025 • New slabs • ₹12L tax-free • ₹75K standard deduction</div>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid var(--c-border)" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                        style={{
                            flex: 1, padding: "12px 8px", border: "none", cursor: "pointer",
                            borderBottom: mode === m.key ? "3px solid var(--c-primary)" : "3px solid transparent",
                            background: mode === m.key ? "var(--c-primary-bg, #e8f0fe)" : "transparent",
                            fontWeight: mode === m.key ? 700 : 500, fontSize: "0.85rem",
                            color: mode === m.key ? "var(--c-primary)" : "var(--c-text-muted)",
                        }}>
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: "var(--s-5)" }}>
                {mode === "new" && <NewRegimeMode />}
                {mode === "old" && <OldRegimeMode />}
                {mode === "compare" && <CompareMode />}
            </div>
        </div>
    );
}

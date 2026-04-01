"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

type Mode = "fire" | "coast" | "barista" | "readiness";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "fire", icon: "🔥", label: "FIRE Number" },
    { key: "coast", icon: "🏖️", label: "Coast FIRE" },
    { key: "barista", icon: "☕", label: "Barista FIRE" },
    { key: "readiness", icon: "📊", label: "Readiness Score" },
];

function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : suffix === "mo" ? `${value} months` : suffix === "/10" ? `${value}/10` : fmtCr(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min ?? 0} max={max ?? 100} step={step ?? 1} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--n-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

function ResultBox({ label, value, color, sub }: { label: string; value: string; color?: string; sub?: string }) {
    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{label}</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: color || undefined, fontFamily: "var(--font-mono, monospace)" }}>{value}</div>
            {sub && <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", marginTop: 2 }}>{sub}</div>}
        </div>
    );
}

/* ─── FIRE math helpers ─── */
function futureValue(pv: number, rate: number, years: number) {
    return pv * Math.pow(1 + rate / 100, years);
}

function sipFV(monthly: number, rate: number, years: number) {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return monthly * n;
    return monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

function sipNeeded(targetAmount: number, rate: number, years: number) {
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return targetAmount / n;
    return targetAmount / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

/* ═══════ MODE 1: FIRE NUMBER CALCULATOR ═══════ */
function FireNumberMode() {
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [currentAge, setCurrentAge] = useState(28);
    const [fireAge, setFireAge] = useState(45);
    const [inflation, setInflation] = useState(6);
    const [returnRate, setReturnRate] = useState(12);
    const [swr, setSwr] = useState(3.5);

    const result = useMemo(() => {
        const yearsToFire = fireAge - currentAge;
        if (yearsToFire <= 0) return null;
        const annualExpToday = monthlyExp * 12;
        const annualExpAtFire = futureValue(annualExpToday, inflation, yearsToFire);
        const monthlyExpAtFire = annualExpAtFire / 12;

        const leanMultiplier = 20;
        const standardMultiplier = Math.round(100 / swr);
        const conservativeMultiplier = 33;
        const fatMultiplier = 40;

        const leanFire = annualExpAtFire * leanMultiplier;
        const standardFire = annualExpAtFire * standardMultiplier;
        const conservativeFire = annualExpAtFire * conservativeMultiplier;
        const fatFire = annualExpAtFire * fatMultiplier;

        const sipLean = sipNeeded(leanFire, returnRate, yearsToFire);
        const sipStandard = sipNeeded(standardFire, returnRate, yearsToFire);
        const sipConservative = sipNeeded(conservativeFire, returnRate, yearsToFire);
        const sipFat = sipNeeded(fatFire, returnRate, yearsToFire);

        // Year-by-year projection for standard FIRE
        const yearlyProjection: { year: number; age: number; expenses: number; corpus: number; gap: number }[] = [];
        for (let y = 1; y <= yearsToFire; y++) {
            const expAtYear = futureValue(annualExpToday, inflation, y);
            const corpusAtYear = sipFV(sipStandard, returnRate, y);
            const targetAtYear = expAtYear * standardMultiplier;
            yearlyProjection.push({ year: y, age: currentAge + y, expenses: expAtYear, corpus: corpusAtYear, gap: targetAtYear - corpusAtYear });
        }

        return {
            yearsToFire, annualExpToday, annualExpAtFire, monthlyExpAtFire,
            leanFire, standardFire, conservativeFire, fatFire,
            sipLean, sipStandard, sipConservative, sipFat,
            standardMultiplier, yearlyProjection,
        };
    }, [monthlyExp, currentAge, fireAge, inflation, returnRate, swr]);

    const SWR_PRESETS = [
        { l: "3%", v: 3, desc: "Very Safe" }, { l: "3.5%", v: 3.5, desc: "India Recommended" },
        { l: "4%", v: 4, desc: "Global Standard" }, { l: "5%", v: 5, desc: "Aggressive" },
    ];

    return (
        <>
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} hint="Your current total monthly household expenses" />
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={55} step={1} suffix="yr" min={18} />
            <InputRow label="Target FIRE Age" value={fireAge} set={setFireAge} max={60} step={1} suffix="yr" min={currentAge + 1} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} hint="India CPI: ~5-7%. Use 6% for most planning." />
            <InputRow label="Expected Return (pre-retirement)" value={returnRate} set={setReturnRate} max={18} step={0.5} suffix="%" min={6} hint="Equity SIP: 12%, Balanced: 10%, Debt: 7%" />

            <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: 6 }}>Safe Withdrawal Rate (SWR)</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {SWR_PRESETS.map(p => (
                        <button key={p.v} onClick={() => setSwr(p.v)} style={{
                            padding: "8px 14px", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer",
                            border: swr === p.v ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: swr === p.v ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: swr === p.v ? 700 : 500, color: swr === p.v ? "var(--n-primary)" : "var(--n-text)",
                        }}>{p.l} <span style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>({p.desc})</span></button>
                    ))}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                    🇮🇳 India experts recommend 3–3.5% SWR (not the US 4% rule) due to higher inflation and medical costs.
                </div>
            </div>

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>
                            Your Monthly Expenses at Age {fireAge}
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#dc2626" }}>
                            {fmt(Math.round(result.monthlyExpAtFire))}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)" }}>
                            Today&apos;s {fmt(monthlyExp)} → {fmt(Math.round(result.monthlyExpAtFire))} at {inflation}% inflation over {result.yearsToFire} years
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, marginBottom: "var(--s-3)" }}>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>🥬 Lean FIRE (20×)</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#16a34a", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.leanFire)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>SIP: {fmt(Math.round(result.sipLean))}/mo</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "2px solid var(--n-primary)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-primary)", fontWeight: 700 }}>🔥 FIRE ({result.standardMultiplier}× — {swr}% SWR)</div>
                            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--n-primary)", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.standardFire)}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-primary)", fontWeight: 600 }}>SIP: {fmt(Math.round(result.sipStandard))}/mo</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>🛡️ Conservative (33×)</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#d97706", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.conservativeFire)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>SIP: {fmt(Math.round(result.sipConservative))}/mo</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid var(--n-border)" }}>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)", fontWeight: 600 }}>👑 Fat FIRE (40×)</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#7c3aed", fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.fatFire)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>SIP: {fmt(Math.round(result.sipFat))}/mo</div>
                        </div>
                    </div>

                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginBottom: "var(--s-3)" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>💡 Key Insight:</strong>
                        <span style={{ color: "#78350f" }}> To reach standard FIRE by age {fireAge}, invest <strong>{fmt(Math.round(result.sipStandard))}/month</strong> via SIP at {returnRate}% expected return. That&apos;s <strong>{((result.sipStandard / monthlyExp) * 100).toFixed(0)}% of your current monthly expenses</strong> as investment.</span>
                    </div>

                    <details style={{ marginTop: "var(--s-2)" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📅 Year-by-Year Projection ({result.standardMultiplier}× Standard FIRE)</summary>
                        <div style={{ overflowX: "auto", marginTop: 8, maxHeight: 350, overflow: "auto" }}>
                            <table style={{ width: "100%", fontSize: "0.72rem", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid var(--n-border)", position: "sticky", top: 0, background: "var(--n-surface-alt)" }}>
                                    <th style={{ textAlign: "left", padding: "5px 3px" }}>Year</th>
                                    <th style={{ textAlign: "left", padding: "5px 3px" }}>Age</th>
                                    <th style={{ textAlign: "right", padding: "5px 3px" }}>Annual Expenses</th>
                                    <th style={{ textAlign: "right", padding: "5px 3px" }}>SIP Corpus</th>
                                    <th style={{ textAlign: "right", padding: "5px 3px" }}>Gap to Target</th>
                                </tr></thead>
                                <tbody>
                                    {result.yearlyProjection.map(row => (
                                        <tr key={row.year} style={{ borderBottom: "1px solid var(--n-border)", background: row.gap <= 0 ? "#f0fdf4" : undefined }}>
                                            <td style={{ padding: "4px 3px" }}>Yr {row.year}</td>
                                            <td style={{ padding: "4px 3px" }}>{row.age}</td>
                                            <td style={{ textAlign: "right", padding: "4px 3px" }}>{fmtCr(row.expenses)}</td>
                                            <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600, color: "#16a34a" }}>{fmtCr(row.corpus)}</td>
                                            <td style={{ textAlign: "right", padding: "4px 3px", color: row.gap > 0 ? "#dc2626" : "#16a34a" }}>
                                                {row.gap > 0 ? `−${fmtCr(row.gap)}` : "✅ Target Met"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 2: COAST FIRE ═══════ */
function CoastFireMode() {
    const [currentAge, setCurrentAge] = useState(28);
    const [retireAge, setRetireAge] = useState(55);
    const [currentInv, setCurrentInv] = useState(10_00_000);
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [inflation, setInflation] = useState(6);
    const [growthRate, setGrowthRate] = useState(12);

    const result = useMemo(() => {
        const yearsToRetire = retireAge - currentAge;
        if (yearsToRetire <= 0) return null;
        const annualExpAtRetire = futureValue(monthlyExp * 12, inflation, yearsToRetire);
        const fireTarget = annualExpAtRetire * 30; // 30× conservative for India

        // Coast FIRE = amount needed NOW so it grows to fireTarget by retirement
        const coastFireNumber = fireTarget / Math.pow(1 + growthRate / 100, yearsToRetire);

        const hasReachedCoast = currentInv >= coastFireNumber;
        const gap = coastFireNumber - currentInv;
        const projectedCorpus = futureValue(currentInv, growthRate, yearsToRetire);

        // If not reached, how much monthly SIP to close gap?
        const sipToCloseGap = gap > 0 ? sipNeeded(gap, growthRate, Math.min(yearsToRetire, 5)) : 0;

        return {
            yearsToRetire, annualExpAtRetire, fireTarget, coastFireNumber,
            hasReachedCoast, gap, projectedCorpus, sipToCloseGap,
        };
    }, [currentAge, retireAge, currentInv, monthlyExp, inflation, growthRate]);

    return (
        <>
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={50} suffix="yr" min={18} />
            <InputRow label="Traditional Retirement Age" value={retireAge} set={setRetireAge} max={65} suffix="yr" min={currentAge + 5} />
            <InputRow label="Current Investments" value={currentInv} set={setCurrentInv} max={5_00_00_000} step={1_00_000} min={0} hint="Total invested corpus: MF + NPS + PPF + EPF + FD" />
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />
            <InputRow label="Expected Growth Rate" value={growthRate} set={setGrowthRate} max={18} step={0.5} suffix="%" min={6} hint="Equity heavy: 12%, Balanced: 10%, Conservative: 8%" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{
                        background: result.hasReachedCoast ? "#f0fdf4" : "#fef2f2",
                        border: result.hasReachedCoast ? "2px solid #22c55e" : "2px solid #ef4444",
                        borderRadius: 10, padding: 16, textAlign: "center", marginBottom: "var(--s-3)",
                    }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: result.hasReachedCoast ? "#16a34a" : "#dc2626" }}>
                            {result.hasReachedCoast ? "🎉 You've Reached Coast FIRE!" : "📈 Not Yet — Keep Investing"}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                            {result.hasReachedCoast
                                ? "Your current investments will grow to your FIRE target by retirement — you can stop saving for retirement and work for today's expenses only!"
                                : `You need ${fmtCr(result.gap)} more in current investments to reach Coast FIRE.`}
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <ResultBox label="Coast FIRE Number" value={fmtCr(result.coastFireNumber)} color="var(--n-primary)" sub="Amount needed TODAY" />
                        <ResultBox label="Your Current Investments" value={fmtCr(currentInv)} color={result.hasReachedCoast ? "#16a34a" : "#dc2626"} />
                        <ResultBox label="FIRE Target (30× at retirement)" value={fmtCr(result.fireTarget)} sub={`At age ${retireAge}`} />
                        <ResultBox label="Projected Corpus" value={fmtCr(result.projectedCorpus)} color="#16a34a" sub={`${fmtCr(currentInv)} growing at ${growthRate}%`} />
                    </div>

                    {!result.hasReachedCoast && result.sipToCloseGap > 0 && (
                        <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                            <strong style={{ color: "var(--n-primary)" }}>💡 To reach Coast FIRE in 5 years:</strong>
                            <span style={{ color: "var(--n-text)" }}> Invest <strong>{fmt(Math.round(result.sipToCloseGap))}/month</strong> via SIP at {growthRate}% to close the {fmtCr(result.gap)} gap. After that, you can stop retirement savings.</span>
                        </div>
                    )}

                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginTop: "var(--s-3)" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>🏖️ What is Coast FIRE?</strong>
                        <span style={{ color: "#78350f" }}> Once you&apos;ve saved enough that compounding alone will grow your corpus to your FIRE target by traditional retirement age, you&apos;ve reached Coast FIRE. You no longer NEED to save — just earn enough to cover day-to-day expenses.</span>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 3: BARISTA FIRE ═══════ */
function BaristaFireMode() {
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [currentInv, setCurrentInv] = useState(30_00_000);
    const [growthRate, setGrowthRate] = useState(10);
    const [inflation, setInflation] = useState(6);
    const [partTimeIncome, setPartTimeIncome] = useState(20_000);
    const [fireAge, setFireAge] = useState(40);
    const [currentAge, setCurrentAge] = useState(28);

    const result = useMemo(() => {
        const yearsToFire = fireAge - currentAge;
        if (yearsToFire <= 0) return null;

        const annualExpAtFire = futureValue(monthlyExp * 12, inflation, yearsToFire);
        const monthlyExpAtFire = annualExpAtFire / 12;

        // Full FIRE (no part-time): 30× annual expenses
        const fullFireCorpus = annualExpAtFire * 30;

        // Barista FIRE: reduce annual withdrawal need by part-time income
        const annualPartTime = futureValue(partTimeIncome * 12, inflation * 0.5, yearsToFire); // part-time income grows slower
        const netAnnualNeed = Math.max(0, annualExpAtFire - annualPartTime);
        const baristaCorpus = netAnnualNeed * 30;

        const savings = fullFireCorpus - baristaCorpus;
        const coveragePct = (annualPartTime / annualExpAtFire) * 100;

        // SIP needed for each
        const sipFull = sipNeeded(fullFireCorpus - futureValue(currentInv, growthRate, yearsToFire), growthRate, yearsToFire);
        const sipBarista = sipNeeded(Math.max(0, baristaCorpus - futureValue(currentInv, growthRate, yearsToFire)), growthRate, yearsToFire);

        return {
            yearsToFire, annualExpAtFire, monthlyExpAtFire, annualPartTime,
            fullFireCorpus, baristaCorpus, savings, coveragePct,
            netAnnualNeed, sipFull: Math.max(0, sipFull), sipBarista: Math.max(0, sipBarista),
        };
    }, [monthlyExp, currentInv, growthRate, inflation, partTimeIncome, fireAge, currentAge]);

    return (
        <>
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} />
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={50} suffix="yr" min={18} />
            <InputRow label="Target Barista FIRE Age" value={fireAge} set={setFireAge} max={55} suffix="yr" min={currentAge + 1} />
            <InputRow label="Current Investments" value={currentInv} set={setCurrentInv} max={5_00_00_000} step={1_00_000} min={0} />
            <InputRow label="Part-Time/Freelance Income (today)" value={partTimeIncome} set={setPartTimeIncome} max={2_00_000} step={5_000} min={0}
                hint="Freelancing, consulting, teaching, YouTube, blog — any expected income" />
            <InputRow label="Expected Growth Rate" value={growthRate} set={setGrowthRate} max={15} step={0.5} suffix="%" min={6} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ background: "#f0fdf4", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: "var(--s-3)", border: "2px solid #22c55e" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#16a34a" }}>
                            ☕ Barista FIRE saves you {fmtCr(result.savings)}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                            Part-time income covers <strong>{result.coveragePct.toFixed(0)}%</strong> of your expenses, reducing your required corpus significantly.
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "1px solid #ef4444" }}>
                            <div style={{ fontSize: "0.68rem", color: "#dc2626", fontWeight: 600 }}>Without Part-Time (Full FIRE)</div>
                            <div style={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.fullFireCorpus)}</div>
                            <div style={{ fontSize: "0.68rem", color: "var(--n-text-muted)" }}>SIP: {fmt(Math.round(result.sipFull))}/mo</div>
                        </div>
                        <div style={{ background: "var(--n-surface)", borderRadius: 8, padding: 12, textAlign: "center", border: "2px solid #22c55e" }}>
                            <div style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700 }}>☕ With Part-Time (Barista FIRE)</div>
                            <div style={{ fontSize: "1.15rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: "#16a34a" }}>{fmtCr(result.baristaCorpus)}</div>
                            <div style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 600 }}>SIP: {fmt(Math.round(result.sipBarista))}/mo</div>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <ResultBox label="Monthly Expenses at FIRE" value={fmt(Math.round(result.monthlyExpAtFire))} color="#dc2626" />
                        <ResultBox label="Part-Time Income (at FIRE)" value={fmt(Math.round(result.annualPartTime / 12))} color="#16a34a" />
                        <ResultBox label="Net Monthly from Corpus" value={fmt(Math.round(result.netAnnualNeed / 12))} color="var(--n-primary)" />
                    </div>

                    <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginTop: "var(--s-3)" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>☕ India Barista FIRE Ideas:</strong>
                        <span style={{ color: "#78350f" }}> Freelance consulting, online tutoring (Unacademy, Vedantu), content creation (YouTube, blogging), part-time teaching, photography, or running a small home-based business. The gig economy in India makes Barista FIRE increasingly viable.</span>
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 4: FIRE READINESS SCORECARD ═══════ */
function ReadinessMode() {
    const [monthlyExp, setMonthlyExp] = useState(50_000);
    const [currentAge, setCurrentAge] = useState(28);
    const [fireAge, setFireAge] = useState(45);
    const [totalInv, setTotalInv] = useState(15_00_000);
    const [monthlySIP, setMonthlySIP] = useState(25_000);
    const [returnRate, setReturnRate] = useState(12);
    const [inflation, setInflation] = useState(6);
    const [healthInsurance, setHealthInsurance] = useState(5);
    const [emergencyMonths, setEmergencyMonths] = useState(3);
    const [termInsurance, setTermInsurance] = useState(5);

    const result = useMemo(() => {
        const yearsToFire = fireAge - currentAge;
        if (yearsToFire <= 0) return null;

        const annualExpAtFire = futureValue(monthlyExp * 12, inflation, yearsToFire);
        const requiredCorpus = annualExpAtFire * 30; // 30× conservative India

        const projectedFromExisting = futureValue(totalInv, returnRate, yearsToFire);
        const projectedFromSIP = sipFV(monthlySIP, returnRate, yearsToFire);
        const projectedTotal = projectedFromExisting + projectedFromSIP;
        const gap = requiredCorpus - projectedTotal;
        const fundedPct = Math.min(100, (projectedTotal / requiredCorpus) * 100);

        // Score calculation (0-100)
        let score = 0;
        // 40 points for corpus funded %
        score += Math.min(40, (fundedPct / 100) * 40);
        // 15 points for savings rate (SIP as % of expenses)
        const savingsRate = (monthlySIP / monthlyExp) * 100;
        score += Math.min(15, (savingsRate / 50) * 15);
        // 15 points for health insurance
        score += Math.min(15, (healthInsurance / 10) * 15);
        // 15 points for emergency fund
        score += Math.min(15, (emergencyMonths / 6) * 15);
        // 15 points for term insurance
        score += Math.min(15, (termInsurance / 10) * 15);

        score = Math.round(score);

        const additionalSIP = gap > 0 ? sipNeeded(gap, returnRate, yearsToFire) : 0;

        // Timeline: when will they reach each FIRE type?
        const fireTimelines: { type: string; multiplier: number; years: number | null }[] = [];
        for (const [type, mult] of [["Lean (20×)", 20], ["Standard (29×)", 29], ["Conservative (33×)", 33], ["Fat (40×)", 40]] as [string, number][]) {
            const target = annualExpAtFire * mult;
            // Binary search for years
            let found: number | null = null;
            for (let y = 1; y <= 50; y++) {
                const proj = futureValue(totalInv, returnRate, y) + sipFV(monthlySIP, returnRate, y);
                const targetAtY = futureValue(monthlyExp * 12, inflation, y) * mult;
                if (proj >= targetAtY) { found = y; break; }
            }
            fireTimelines.push({ type, multiplier: mult, years: found });
        }

        const scoreColor = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : score >= 40 ? "#ea580c" : "#dc2626";
        const scoreLabel = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs Work" : "Critical";

        return {
            yearsToFire, requiredCorpus, projectedTotal, gap, fundedPct,
            score, scoreColor, scoreLabel, additionalSIP, savingsRate,
            fireTimelines,
        };
    }, [monthlyExp, currentAge, fireAge, totalInv, monthlySIP, returnRate, inflation, healthInsurance, emergencyMonths, termInsurance]);

    return (
        <>
            <InputRow label="Monthly Expenses (today)" value={monthlyExp} set={setMonthlyExp} max={5_00_000} step={5_000} min={10_000} />
            <InputRow label="Current Age" value={currentAge} set={setCurrentAge} max={50} suffix="yr" min={18} />
            <InputRow label="Target FIRE Age" value={fireAge} set={setFireAge} max={60} suffix="yr" min={currentAge + 1} />
            <InputRow label="Total Current Investments" value={totalInv} set={setTotalInv} max={10_00_00_000} step={1_00_000} min={0} hint="MF + NPS + PPF + EPF + FD + Stocks" />
            <InputRow label="Current Monthly SIP" value={monthlySIP} set={setMonthlySIP} max={5_00_000} step={5_000} min={0} />
            <InputRow label="Expected Return" value={returnRate} set={setReturnRate} max={18} step={0.5} suffix="%" min={6} />
            <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />

            <div style={{ fontSize: "0.88rem", fontWeight: 700, marginBottom: 8, marginTop: 12 }}>Risk Protection Check</div>
            <InputRow label="Health Insurance Cover" value={healthInsurance} set={setHealthInsurance} max={10} suffix="/10" min={0}
                hint="0 = none, 5 = ₹10L cover, 10 = ₹50L+ super top-up" />
            <InputRow label="Emergency Fund" value={emergencyMonths} set={setEmergencyMonths} max={12} suffix="mo" min={0}
                hint="Months of expenses in liquid savings" />
            <InputRow label="Term Insurance" value={termInsurance} set={setTermInsurance} max={10} suffix="/10" min={0}
                hint="0 = none, 5 = basic cover, 10 = 15-20× income cover" />

            {result && (
                <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                    {/* Readiness Score */}
                    <div style={{ textAlign: "center", marginBottom: "var(--s-4)" }}>
                        <div style={{
                            width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
                            border: `6px solid ${result.scoreColor}`, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: result.scoreColor, lineHeight: 1 }}>{result.score}</div>
                            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: result.scoreColor }}>{result.scoreLabel}</div>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginTop: 8 }}>FIRE Readiness Score</div>
                    </div>

                    {/* Corpus Analysis */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        <ResultBox label="Required Corpus (30×)" value={fmtCr(result.requiredCorpus)} sub={`At age ${fireAge}`} />
                        <ResultBox label="Projected Corpus" value={fmtCr(result.projectedTotal)}
                            color={result.gap <= 0 ? "#16a34a" : "#dc2626"}
                            sub={`${result.fundedPct.toFixed(0)}% funded`} />
                    </div>

                    {result.gap > 0 && (
                        <div style={{ background: "#fef2f2", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem", marginBottom: "var(--s-3)", border: "1px solid #fca5a5" }}>
                            <strong style={{ color: "#dc2626" }}>⚠️ Gap: {fmtCr(result.gap)}</strong>
                            <span style={{ color: "#7f1d1d" }}> — Increase your SIP by <strong>{fmt(Math.round(result.additionalSIP))}/month</strong> to close this gap by age {fireAge}.</span>
                        </div>
                    )}

                    {/* FIRE Timelines */}
                    <div style={{ marginBottom: "var(--s-3)" }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>⏳ When Will You Reach FIRE?</div>
                        <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                <th style={{ textAlign: "left", padding: "6px 4px" }}>FIRE Type</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>Years from Now</th>
                                <th style={{ textAlign: "right", padding: "6px 4px" }}>At Age</th>
                            </tr></thead>
                            <tbody>
                                {result.fireTimelines.map((t, i) => (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                        <td style={{ padding: "5px 4px", fontWeight: 600 }}>{t.type}</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "var(--font-mono, monospace)" }}>
                                            {t.years !== null ? `${t.years} years` : "50+ years"}
                                        </td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, color: t.years !== null && currentAge + t.years <= fireAge ? "#16a34a" : "#dc2626" }}>
                                            {t.years !== null ? currentAge + t.years : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Action Items */}
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8 }}>✅ Action Checklist</div>
                    <div style={{ fontSize: "0.82rem" }}>
                        {[
                            { check: result.savingsRate >= 30, text: `Savings rate: ${result.savingsRate.toFixed(0)}% of expenses (target: ≥30%)` },
                            { check: healthInsurance >= 5, text: `Health insurance: ${healthInsurance >= 5 ? "Adequate" : "₹10L+ cover with super top-up needed"}` },
                            { check: emergencyMonths >= 6, text: `Emergency fund: ${emergencyMonths} months (target: 6 months)` },
                            { check: termInsurance >= 5, text: `Term insurance: ${termInsurance >= 5 ? "Adequate" : "Get 15-20× annual income cover"}` },
                            { check: result.gap <= 0, text: result.gap <= 0 ? "On track to reach FIRE target" : `Increase SIP by ${fmt(Math.round(result.additionalSIP))}/mo` },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: "6px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ color: item.check ? "#16a34a" : "#dc2626", fontSize: "1rem" }}>{item.check ? "✅" : "❌"}</span>
                                <span style={{ color: item.check ? "var(--n-text)" : "#dc2626" }}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function FIRECalculatorIndiaCore() {
    const [mode, setMode] = useState<Mode>("fire");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, #fef3c7, #fde68a, var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🔥 FIRE Calculator — Financial Independence, Retire Early</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>India-adapted SWR • SIP bridge calculator • NPS/EPF/PPF integration • Healthcare planning</div>
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
                {mode === "fire" && <FireNumberMode />}
                {mode === "coast" && <CoastFireMode />}
                {mode === "barista" && <BaristaFireMode />}
                {mode === "readiness" && <ReadinessMode />}
            </div>
        </div>
    );
}

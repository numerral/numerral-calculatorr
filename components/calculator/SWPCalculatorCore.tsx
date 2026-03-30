"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

type Mode = "planner" | "compare" | "corpus" | "saferate";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "planner", icon: "💸", label: "Withdrawal Planner" },
    { key: "compare", icon: "⚖️", label: "SWP vs FD" },
    { key: "corpus", icon: "🎯", label: "Corpus Required" },
    { key: "saferate", icon: "🛡️", label: "Safe Rate Finder" },
];

function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : fmtCr(value);
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

/* ─── SWP math: month-by-month depletion ─── */
function swpCalc(corpus: number, monthlyW: number, rate: number, years: number, inflationRate: number = 0) {
    const monthlyRate = rate / 100 / 12;
    const inflMonthly = inflationRate / 100 / 12;
    const totalMonths = years * 12;
    const schedule: { month: number; withdrawal: number; interest: number; balance: number }[] = [];
    let balance = corpus;
    let totalWithdrawn = 0;
    let currentW = monthlyW;
    let depletionMonth = -1;

    for (let m = 1; m <= totalMonths; m++) {
        if (inflationRate > 0 && m > 1 && (m - 1) % 12 === 0) {
            currentW = currentW * (1 + inflationRate / 100);
        }
        const interest = balance * monthlyRate;
        balance += interest;
        const actualW = Math.min(currentW, balance);
        balance -= actualW;
        totalWithdrawn += actualW;
        schedule.push({ month: m, withdrawal: Math.round(actualW), interest: Math.round(interest), balance: Math.round(balance) });
        if (balance <= 0 && depletionMonth === -1) {
            depletionMonth = m;
            break;
        }
    }
    return { totalWithdrawn, finalCorpus: Math.max(0, Math.round(balance)), depletionMonth, schedule };
}

/* ═══════ MODE 1: WITHDRAWAL PLANNER ═══════ */
function PlannerMode() {
    const [corpus, setCorpus] = useState(50_00_000);
    const [monthly, setMonthly] = useState(50_000);
    const [rate, setRate] = useState(8);
    const [years, setYears] = useState(20);
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState(6);

    const result = useMemo(() => swpCalc(corpus, monthly, rate, years, showInflation ? inflation : 0), [corpus, monthly, rate, years, showInflation, inflation]);
    const depleted = result.depletionMonth > 0;

    return (
        <>
            <InputRow label="Initial Corpus" value={corpus} set={setCorpus} max={5_00_00_000} step={1_00_000} min={5_00_000} />
            <InputRow label="Monthly Withdrawal" value={monthly} set={setMonthly} max={5_00_000} step={5_000} min={5_000} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={15} step={0.5} suffix="%" min={4} hint="Hybrid/BAF funds: 8-10%, Debt: 6-7%, Equity: 10-12%" />
            <InputRow label="Withdrawal Duration" value={years} set={setYears} max={40} step={1} suffix="yr" min={5} />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <input type="checkbox" id="swpInfl" checked={showInflation} onChange={e => setShowInflation(e.target.checked)} />
                <label htmlFor="swpInfl" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Increase withdrawal annually (inflation)</label>
            </div>
            {showInflation && <InputRow label="Annual Increase" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />}

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                {depleted && (
                    <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px 14px", marginBottom: "var(--s-3)", border: "1px solid #fca5a5" }}>
                        <strong style={{ color: "#dc2626" }}>⚠️ Corpus Depletes in {Math.ceil(result.depletionMonth / 12)} years ({result.depletionMonth} months)</strong>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-danger)", marginTop: 4 }}>Reduce withdrawal or increase return rate to sustain for {years} years.</div>
                    </div>
                )}
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: depleted ? "#dc2626" : "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        {depleted ? "Corpus Exhausted" : "Final Corpus After " + years + " Years"}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.finalCorpus)}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                        ["Initial Corpus", fmtCr(corpus), undefined],
                        ["Total Withdrawn", fmtCr(result.totalWithdrawn), "#16a34a"],
                        ["Withdrawal Rate", `${((monthly * 12 / corpus) * 100).toFixed(1)}%/yr`, "var(--n-primary)"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                        </div>
                    ))}
                </div>

                <details style={{ marginTop: "var(--s-3)" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📅 Month-by-Month Schedule</summary>
                    <div style={{ overflowX: "auto", marginTop: 8, maxHeight: 350, overflow: "auto" }}>
                        <table style={{ width: "100%", fontSize: "0.72rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--n-border)", position: "sticky", top: 0, background: "var(--n-surface-alt)" }}>
                                <th style={{ textAlign: "left", padding: "5px 3px" }}>Month</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Withdrawal</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Interest</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Balance</th>
                            </tr></thead>
                            <tbody>
                                {result.schedule.filter((_, i) => i < 24 || i % 12 === 11 || i === result.schedule.length - 1).map(s => (
                                    <tr key={s.month} style={{ borderBottom: "1px solid var(--n-border)", background: s.balance <= 0 ? "#fef2f2" : undefined }}>
                                        <td style={{ padding: "4px 3px" }}>Mo {s.month}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", color: "#dc2626" }}>−{fmt(s.withdrawal)}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", color: "#16a34a" }}>+{fmt(s.interest)}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600 }}>{fmtCr(s.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            </div>
        </>
    );
}

/* ═══════ MODE 2: SWP vs FD INCOME ═══════ */
function CompareMode() {
    const [corpus, setCorpus] = useState(50_00_000);
    const [monthly, setMonthly] = useState(40_000);
    const [years, setYears] = useState(15);

    const swpRate = 9, fdRate = 7, fdPostTax = 4.9;
    const swpResult = useMemo(() => swpCalc(corpus, monthly, swpRate, years), [corpus, monthly, years]);
    const fdResult = useMemo(() => swpCalc(corpus, monthly, fdPostTax, years), [corpus, monthly, years]);

    const swpDepleted = swpResult.depletionMonth > 0;
    const fdDepleted = fdResult.depletionMonth > 0;

    return (
        <>
            <InputRow label="Initial Corpus" value={corpus} set={setCorpus} max={5_00_00_000} step={1_00_000} min={5_00_000} />
            <InputRow label="Monthly Withdrawal" value={monthly} set={setMonthly} max={5_00_000} step={5_000} min={5_000} />
            <InputRow label="Duration" value={years} set={setYears} max={30} step={1} suffix="yr" min={5} />

            <div style={{ padding: 16, borderRadius: 12, textAlign: "center", marginBottom: "var(--s-3)", background: "#f0fdf4", border: "2px solid #22c55e" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#16a34a" }}>
                    💸 SWP preserves {fmtCr(swpResult.finalCorpus - fdResult.finalCorpus)} more corpus than FD
                </div>
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Parameter</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", color: "var(--n-primary)" }}>💸 SWP (Hybrid MF)</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>🏦 FD (Post-Tax)</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Return Rate", `${swpRate}% (pre-tax)`, `${fdRate}% gross (${fdPostTax}% post-tax)`],
                        ["Initial Corpus", fmtCr(corpus), fmtCr(corpus)],
                        ["Monthly Withdrawal", fmt(monthly), fmt(monthly)],
                        ["Total Withdrawn", fmtCr(swpResult.totalWithdrawn), fmtCr(fdResult.totalWithdrawn)],
                        ["Remaining Corpus", swpDepleted ? `Depleted (Mo ${swpResult.depletionMonth})` : fmtCr(swpResult.finalCorpus), fdDepleted ? `Depleted (Mo ${fdResult.depletionMonth})` : fmtCr(fdResult.finalCorpus)],
                        ["Tax on Gains", "LTCG 12.5% (only on gains)", "Slab rate on ALL interest"],
                        ["TDS", "None", "Yes (if interest > ₹50K sr. citizen)"],
                    ].map(([l, s, f], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                            <td style={{ padding: "6px 4px" }}>{l}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: "var(--n-primary)" }}>{s}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{f}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: "var(--n-gold-light)", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--n-gold-text)" }}>💡 Why SWP wins:</strong>
                <span style={{ color: "#78350f" }}> SWP is tax-efficient because each withdrawal is part capital return + part gain. Only the gain portion is taxed. FD interest is 100% taxable at your slab rate. For 30% bracket, FD effective rate drops to ~4.9%.</span>
            </div>
        </>
    );
}

/* ═══════ MODE 3: CORPUS REQUIRED ═══════ */
function CorpusMode() {
    const [monthlyNeed, setMonthlyNeed] = useState(50_000);
    const [years, setYears] = useState(25);
    const [rate, setRate] = useState(8);

    const result = useMemo(() => {
        // Binary search for corpus
        let lo = monthlyNeed * 12, hi = monthlyNeed * 12 * years * 3;
        for (let i = 0; i < 60; i++) {
            const mid = (lo + hi) / 2;
            const r = swpCalc(mid, monthlyNeed, rate, years);
            if (r.depletionMonth > 0 || r.finalCorpus < 0) lo = mid; else hi = mid;
        }
        const requiredCorpus = Math.ceil(hi / 1_00_000) * 1_00_000;
        const annualRate = ((monthlyNeed * 12) / requiredCorpus * 100).toFixed(1);
        return { requiredCorpus, annualRate };
    }, [monthlyNeed, years, rate]);

    const PRESETS = [
        { l: "₹25K/mo", v: 25_000 }, { l: "₹50K/mo", v: 50_000 },
        { l: "₹75K/mo", v: 75_000 }, { l: "₹1L/mo", v: 1_00_000 },
        { l: "₹1.5L/mo", v: 1_50_000 },
    ];

    return (
        <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {PRESETS.map(p => (
                    <button key={p.v} onClick={() => setMonthlyNeed(p.v)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: monthlyNeed === p.v ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: monthlyNeed === p.v ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: monthlyNeed === p.v ? 700 : 500, color: monthlyNeed === p.v ? "var(--n-primary)" : "var(--n-text)",
                    }}>{p.l}</button>
                ))}
            </div>
            <InputRow label="Desired Monthly Income" value={monthlyNeed} set={setMonthlyNeed} max={3_00_000} step={5_000} min={10_000} />
            <InputRow label="Duration Needed" value={years} set={setYears} max={40} step={1} suffix="yr" min={10} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={15} step={0.5} suffix="%" min={4} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Required Initial Corpus</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "8px 0" }}>{fmtCr(result.requiredCorpus)}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>
                    to withdraw <strong>{fmt(monthlyNeed)}/month</strong> for <strong>{years} years</strong> at {rate}% return
                </div>
                <div style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 700, marginTop: 8 }}>
                    Initial withdrawal rate: {result.annualRate}% per year
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 4: SAFE WITHDRAWAL RATE ═══════ */
function SafeRateMode() {
    const [corpus, setCorpus] = useState(1_00_00_000);
    const [years, setYears] = useState(30);
    const [rate, setRate] = useState(9);

    const result = useMemo(() => {
        // Binary search for max safe monthly withdrawal
        let lo = 1_000, hi = corpus / 12;
        for (let i = 0; i < 60; i++) {
            const mid = (lo + hi) / 2;
            const r = swpCalc(corpus, mid, rate, years);
            if (r.depletionMonth > 0) hi = mid; else lo = mid;
        }
        const safeMonthly = Math.floor(lo / 1_000) * 1_000;
        const safeAnnualRate = ((safeMonthly * 12) / corpus * 100).toFixed(1);
        return { safeMonthly, safeAnnualRate };
    }, [corpus, years, rate]);

    const indiaNote = parseFloat(result.safeAnnualRate) <= 3.5 ? "Conservative" : parseFloat(result.safeAnnualRate) <= 5 ? "Moderate" : "Aggressive";

    return (
        <>
            <InputRow label="Retirement Corpus" value={corpus} set={setCorpus} max={10_00_00_000} step={5_00_000} min={10_00_000} />
            <InputRow label="Required Duration" value={years} set={setYears} max={40} step={5} suffix="yr" min={15} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={15} step={0.5} suffix="%" min={4} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Maximum Safe Monthly Withdrawal</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "8px 0" }}>{fmt(result.safeMonthly)}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>
                    from {fmtCr(corpus)} corpus for {years} years at {rate}% return
                </div>
                <div style={{
                    fontSize: "1.1rem", fontWeight: 800, marginTop: 12,
                    color: indiaNote === "Conservative" ? "#16a34a" : indiaNote === "Moderate" ? "#d97706" : "#dc2626",
                }}>
                    Safe Withdrawal Rate: {result.safeAnnualRate}%/year — {indiaNote}
                </div>
            </div>

            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--n-primary)" }}>🇮🇳 India Context:</strong>
                <span style={{ color: "var(--n-text)" }}> The US &ldquo;4% rule&rdquo; doesn&rsquo;t directly apply in India due to higher inflation (6% vs 2%). Indian financial planners recommend <strong>2.5–3.5% initial withdrawal rate</strong> for a 30-year retirement horizon. Our calculator finds your exact safe rate based on your corpus, return expectations, and duration.</span>
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", marginTop: "var(--s-3)" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "6px 4px" }}>SWR</th>
                    <th style={{ textAlign: "left", padding: "6px 4px" }}>Risk Level</th>
                    <th style={{ textAlign: "left", padding: "6px 4px" }}>Best For</th>
                </tr></thead>
                <tbody>
                    {[
                        ["2.0–2.5%", "Very Safe", "35+ year horizon, conservative"],
                        ["2.5–3.5%", "Recommended", "25–30 year retirement, balanced"],
                        ["3.5–5.0%", "Moderate Risk", "15–20 years, aggressive returns"],
                        ["5.0%+", "High Risk", "Short duration only, equity heavy"],
                    ].map(([r, l, b], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                            <td style={{ padding: "5px 4px", fontWeight: 700 }}>{r}</td>
                            <td style={{ padding: "5px 4px" }}>{l}</td>
                            <td style={{ padding: "5px 4px", fontSize: "0.78rem", color: "var(--n-text-muted)" }}>{b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

/* ═══════ MAIN ═══════ */
export default function SWPCalculatorCore() {
    const [mode, setMode] = useState<Mode>("planner");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, #dbeafe, var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>💸 SWP Calculator — Systematic Withdrawal Plan</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>Regular income from mutual fund corpus • Retirement planning • Tax-efficient withdrawals</div>
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
                {mode === "planner" && <PlannerMode />}
                {mode === "compare" && <CompareMode />}
                {mode === "corpus" && <CorpusMode />}
                {mode === "saferate" && <SafeRateMode />}
            </div>
        </div>
    );
}

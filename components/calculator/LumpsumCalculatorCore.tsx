"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

type Mode = "returns" | "vssip" | "stp" | "goal";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "returns", icon: "📊", label: "Returns Estimator" },
    { key: "vssip", icon: "⚖️", label: "Lump Sum vs SIP" },
    { key: "stp", icon: "🔄", label: "STP Planner" },
    { key: "goal", icon: "🎯", label: "Goal Reverse" },
];

/* ─── Math ─── */
function compoundGrowth(p: number, r: number, t: number, n: number) {
    return p * Math.pow(1 + r / (100 * n), n * t);
}
function sipFV(monthly: number, r: number, months: number) {
    const rm = r / 12 / 100;
    if (rm === 0) return monthly * months;
    return monthly * ((Math.pow(1 + rm, months) - 1) / rm) * (1 + rm);
}

function InputRow({ label, value, set, max, step, suffix, hint, min }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string; min?: number;
}) {
    const display = suffix === "%" ? `${value}%` : suffix === "yr" ? `${value} yrs` : suffix === "mo" ? `${value} months` : fmtCr(value);
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

/* ═══════ MODE 1: RETURNS ESTIMATOR ═══════ */
function ReturnsMode() {
    const [principal, setPrincipal] = useState(5_00_000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [freq, setFreq] = useState(1);
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState(6);
    const [showTax, setShowTax] = useState(false);

    const result = useMemo(() => {
        const maturity = compoundGrowth(principal, rate, years, freq);
        const returns = maturity - principal;
        const cagr = (Math.pow(maturity / principal, 1 / years) - 1) * 100;
        const realValue = showInflation ? maturity / Math.pow(1 + inflation / 100, years) : maturity;
        const ltcgGain = Math.max(returns - 1_25_000, 0);
        const taxAmount = showTax ? ltcgGain * 0.125 : 0;
        const postTax = maturity - taxAmount;

        // Year-by-year breakdown
        const schedule: { year: number; value: number; gain: number }[] = [];
        for (let y = 1; y <= Math.min(years, 30); y++) {
            const v = compoundGrowth(principal, rate, y, freq);
            schedule.push({ year: y, value: v, gain: v - principal });
        }
        return { maturity, returns, cagr, realValue, taxAmount, postTax, schedule };
    }, [principal, rate, years, freq, showInflation, inflation, showTax]);

    const FREQS = [
        { label: "Yearly", value: 1 }, { label: "Half-Yearly", value: 2 },
        { label: "Quarterly", value: 4 }, { label: "Monthly", value: 12 },
    ];

    return (
        <>
            <InputRow label="Investment Amount" value={principal} set={setPrincipal} max={10_00_00_000} step={10_000} min={1000} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={30} step={0.5} suffix="%" min={1} />
            <InputRow label="Time Period" value={years} set={setYears} max={40} step={1} suffix="yr" min={1} />

            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Compounding Frequency</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {FREQS.map(f => (
                        <button key={f.value} onClick={() => setFreq(f.value)} style={{
                            flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.78rem", cursor: "pointer",
                            border: freq === f.value ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: freq === f.value ? "var(--n-primary-light)" : "var(--n-surface)",
                            fontWeight: freq === f.value ? 700 : 500, color: freq === f.value ? "var(--n-primary)" : "var(--n-text)",
                        }}>{f.label}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={showInflation} onChange={e => setShowInflation(e.target.checked)} /> Inflation adjust
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={showTax} onChange={e => setShowTax(e.target.checked)} /> Show LTCG tax
                </label>
            </div>
            {showInflation && <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={12} step={0.5} suffix="%" min={1} />}

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Maturity Value</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(showTax ? result.postTax : result.maturity)}</div>
                    {showTax && <div style={{ fontSize: "0.78rem", color: "#dc2626" }}>LTCG Tax (12.5%): −{fmt(result.taxAmount)}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                        ["Invested", fmtCr(principal), undefined],
                        ["Returns", fmtCr(result.returns), "#16a34a"],
                        ["CAGR", `${result.cagr.toFixed(2)}%`, "var(--n-primary)"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                        </div>
                    ))}
                </div>
                {showInflation && (
                    <div style={{ background: "var(--n-gold-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>Real Value:</strong> <span style={{ color: "#78350f" }}>{fmtCr(result.realValue)} in today&rsquo;s purchasing power</span>
                    </div>
                )}

                {/* Year-by-year breakdown */}
                {result.schedule.length > 0 && (
                    <details style={{ marginTop: "var(--s-3)" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📅 Year-by-Year Growth Schedule</summary>
                        <div style={{ overflowX: "auto", marginTop: 8 }}>
                            <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                    <th style={{ textAlign: "left", padding: "6px 4px" }}>Year</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Value</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Total Gain</th>
                                </tr></thead>
                                <tbody>
                                    {result.schedule.map(s => (
                                        <tr key={s.year} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                            <td style={{ padding: "5px 4px" }}>Year {s.year}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 600 }}>{fmtCr(s.value)}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", color: "#16a34a" }}>+{fmtCr(s.gain)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                )}
            </div>
        </>
    );
}

/* ═══════ MODE 2: LUMP SUM vs SIP ═══════ */
function VsSipMode() {
    const [total, setTotal] = useState(6_00_000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const result = useMemo(() => {
        const lumpVal = compoundGrowth(total, rate, years, 1);
        const monthlySIP = total / (years * 12);
        const sipVal = sipFV(monthlySIP, rate, years * 12);
        return {
            lumpVal, sipVal, monthlySIP,
            lumpReturn: lumpVal - total, sipReturn: sipVal - total,
            better: lumpVal >= sipVal ? "lump" : "sip",
            diff: Math.abs(lumpVal - sipVal),
        };
    }, [total, rate, years]);

    return (
        <>
            <InputRow label="Total Amount to Invest" value={total} set={setTotal} max={5_00_00_000} step={10_000} min={10_000} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={25} step={0.5} suffix="%" min={1} />
            <InputRow label="Time Period" value={years} set={setYears} max={30} step={1} suffix="yr" min={1} />

            <div style={{
                padding: 16, borderRadius: 12, textAlign: "center", marginBottom: "var(--s-3)",
                background: result.better === "lump" ? "var(--n-primary-light)" : "var(--n-success-light)",
                border: `2px solid ${result.better === "lump" ? "var(--n-primary)" : "#16a34a"}`,
            }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: result.better === "lump" ? "var(--n-primary)" : "#16a34a" }}>
                    {result.better === "lump" ? "📊 Lump Sum" : "📈 SIP"} generates {fmtCr(result.diff)} more
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>
                    (at constant {rate}% — in volatile markets, SIP often wins via rupee cost averaging)
                </div>
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Parameter</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>📊 Lump Sum</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>📈 SIP</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Investment", fmt(total), `${fmt(result.monthlySIP)}/mo × ${years * 12} months`],
                        ["Total Invested", fmtCr(total), fmtCr(total)],
                        ["Maturity Value", fmtCr(result.lumpVal), fmtCr(result.sipVal)],
                        ["Wealth Gained", fmtCr(result.lumpReturn), fmtCr(result.sipReturn)],
                    ].map(([l, a, b], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                            <td style={{ padding: "6px 4px" }}>{l}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: result.better === "lump" ? "var(--n-primary)" : undefined }}>{a}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: result.better === "sip" ? "#16a34a" : undefined }}>{b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--n-primary)" }}>⚖️ Important:</strong> At a constant return rate, lump sum always wins because the full amount compounds from day 1. However, in real volatile markets, SIP often outperforms because of <strong>rupee cost averaging</strong>. Best strategy: Deploy via <strong>STP</strong> (see STP Planner tab).
            </div>
        </>
    );
}

/* ═══════ MODE 3: STP PLANNER ═══════ */
function STPMode() {
    const [lump, setLump] = useState(10_00_000);
    const [sourceRate, setSourceRate] = useState(7);
    const [targetRate, setTargetRate] = useState(12);
    const [stpMonths, setStpMonths] = useState(6);
    const [totalYears, setTotalYears] = useState(10);

    const result = useMemo(() => {
        // Direct lump sum into equity
        const directVal = compoundGrowth(lump, targetRate, totalYears, 1);

        // STP: park in liquid, transfer monthly
        const monthlyTransfer = lump / stpMonths;
        const sourceRm = sourceRate / 12 / 100;
        const targetRm = targetRate / 12 / 100;
        let sourceBalance = lump;
        let targetBalance = 0;
        const totalMonths = totalYears * 12;

        for (let m = 1; m <= totalMonths; m++) {
            if (m <= stpMonths && sourceBalance > 0) {
                sourceBalance = sourceBalance * (1 + sourceRm) - monthlyTransfer;
                if (sourceBalance < 0) sourceBalance = 0;
                targetBalance = (targetBalance + monthlyTransfer) * (1 + targetRm);
            } else {
                sourceBalance = sourceBalance * (1 + sourceRm);
                targetBalance = targetBalance * (1 + targetRm);
            }
        }
        const stpTotal = sourceBalance + targetBalance;

        return { directVal, stpTotal, diff: directVal - stpTotal };
    }, [lump, sourceRate, targetRate, stpMonths, totalYears]);

    return (
        <>
            <InputRow label="Lump Sum Amount" value={lump} set={setLump} max={5_00_00_000} step={50_000} min={50_000} />
            <InputRow label="Source Fund Return (Liquid/Debt)" value={sourceRate} set={setSourceRate} max={10} step={0.5} suffix="%" min={3} />
            <InputRow label="Target Fund Return (Equity)" value={targetRate} set={setTargetRate} max={25} step={0.5} suffix="%" min={5} />
            <InputRow label="STP Transfer Period" value={stpMonths} set={setStpMonths} max={24} step={1} suffix="mo" min={3} />
            <InputRow label="Total Investment Horizon" value={totalYears} set={setTotalYears} max={30} step={1} suffix="yr" min={1} />

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Strategy</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Final Value</th>
                </tr></thead>
                <tbody>
                    <tr style={{ borderBottom: "1px solid var(--n-border)" }}>
                        <td style={{ padding: "6px 4px" }}>📊 Direct Lump Sum → Equity</td>
                        <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>{fmtCr(result.directVal)}</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--n-border)" }}>
                        <td style={{ padding: "6px 4px" }}>🔄 STP ({stpMonths} months: Liquid → Equity)</td>
                        <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>{fmtCr(result.stpTotal)}</td>
                    </tr>
                    <tr style={{ borderTop: "2px solid var(--n-border)" }}>
                        <td style={{ padding: "6px 4px", fontWeight: 700 }}>Difference</td>
                        <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700, color: result.diff > 0 ? "var(--n-primary)" : "#16a34a" }}>
                            {result.diff > 0 ? `Direct wins by ${fmtCr(result.diff)}` : `STP wins by ${fmtCr(Math.abs(result.diff))}`}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--n-primary)" }}>🔄 STP Insight:</strong> While direct lump sum often gives higher absolute returns (full compound from day 1), STP reduces <strong>sequence-of-returns risk</strong>. If markets drop 15% right after your lump sum, STP protects you. STP is recommended when markets are near all-time highs or you&rsquo;re investing a windfall.
            </div>
        </>
    );
}

/* ═══════ MODE 4: GOAL REVERSE ═══════ */
function GoalMode() {
    const [target, setTarget] = useState(1_00_00_000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(12);

    const result = useMemo(() => {
        const required = target / Math.pow(1 + rate / 100, years);
        const multiple = target / required;
        return { required, multiple };
    }, [target, years, rate]);

    const PRESETS = [
        { l: "₹25L", v: 25_00_000 }, { l: "₹50L", v: 50_00_000 },
        { l: "₹1 Cr", v: 1_00_00_000 }, { l: "₹5 Cr", v: 5_00_00_000 }, { l: "₹10 Cr", v: 10_00_00_000 },
    ];

    return (
        <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {PRESETS.map(p => (
                    <button key={p.v} onClick={() => setTarget(p.v)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: target === p.v ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: target === p.v ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: target === p.v ? 700 : 500, color: target === p.v ? "var(--n-primary)" : "var(--n-text)",
                    }}>{p.l}</button>
                ))}
            </div>
            <InputRow label="Target Amount" value={target} set={setTarget} max={50_00_00_000} step={25_00_000} min={1_00_000} />
            <InputRow label="Time Horizon" value={years} set={setYears} max={40} step={1} suffix="yr" min={1} />
            <InputRow label="Expected Return" value={rate} set={setRate} max={25} step={0.5} suffix="%" min={1} />

            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Invest Today
                </div>
                <div style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "8px 0" }}>{fmtCr(result.required)}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--n-text-muted)" }}>
                    to get <strong>{fmtCr(target)}</strong> in <strong>{years} years</strong> at {rate}% return
                </div>
                <div style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 700, marginTop: 8 }}>
                    Your money multiplies {result.multiple.toFixed(1)}× in {years} years
                </div>
            </div>
        </>
    );
}

/* ═══════ MAIN ═══════ */
export default function LumpsumCalculatorCore() {
    const [mode, setMode] = useState<Mode>("returns");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📊 Lumpsum Calculator</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>One-time investment returns • Lump Sum vs SIP • STP Strategy • Goal Reverse</div>
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
                {mode === "returns" && <ReturnsMode />}
                {mode === "vssip" && <VsSipMode />}
                {mode === "stp" && <STPMode />}
                {mode === "goal" && <GoalMode />}
            </div>
        </div>
    );
}

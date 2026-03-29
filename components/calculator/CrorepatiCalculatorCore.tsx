"use client";
import { useState, useMemo } from "react";

/* ─── helpers ─── */
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};
const pct = (n: number) => `${n.toFixed(1)}%`;

type Mode = "goal" | "stepup" | "delay" | "milestone";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "goal", icon: "🎯", label: "Goal Planner" },
    { key: "stepup", icon: "📈", label: "Step-Up SIP" },
    { key: "delay", icon: "⏳", label: "Cost of Delay" },
    { key: "milestone", icon: "🏆", label: "Milestone Tracker" },
];

/* ─── SIP/compounding math ─── */
function futureValueSIP(monthly: number, rate: number, months: number): number {
    const r = rate / 12 / 100;
    if (r === 0) return monthly * months;
    return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}
function futureValueLump(lump: number, rate: number, months: number): number {
    return lump * Math.pow(1 + rate / 12 / 100, months);
}
function monthsToGoal(monthly: number, lump: number, rate: number, goal: number): number {
    if (monthly <= 0 && lump <= 0) return Infinity;
    for (let m = 1; m <= 1200; m++) {
        const v = futureValueSIP(monthly, rate, m) + futureValueLump(lump, rate, m);
        if (v >= goal) return m;
    }
    return Infinity;
}
function futureValueStepUpSIP(startMonthly: number, stepUpPct: number, rate: number, months: number): number {
    let total = 0;
    const r = rate / 12 / 100;
    let currentSIP = startMonthly;
    for (let m = 0; m < months; m++) {
        if (m > 0 && m % 12 === 0) currentSIP *= (1 + stepUpPct / 100);
        total = (total + currentSIP) * (1 + r);
    }
    return total;
}
function monthsToGoalStepUp(startMonthly: number, stepUpPct: number, rate: number, goal: number): number {
    if (startMonthly <= 0) return Infinity;
    let total = 0;
    const r = rate / 12 / 100;
    let currentSIP = startMonthly;
    for (let m = 1; m <= 1200; m++) {
        if (m > 1 && (m - 1) % 12 === 0) currentSIP *= (1 + stepUpPct / 100);
        total = (total + currentSIP) * (1 + r);
        if (total >= goal) return m;
    }
    return Infinity;
}

/* ─── Sub: Input Row ─── */
function InputRow({ label, value, set, max, step, suffix, hint }: {
    label: string; value: number; set: (v: number) => void;
    max?: number; step?: number; suffix?: string; hint?: string;
}) {
    const displayVal = suffix === "%" ? `${value}%` : fmtCr(value);
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono, monospace)" }}>{displayVal}</span>
            </label>
            <input type="range" min={0} max={max || 50_00_000} step={step || 5000} value={value}
                onChange={e => set(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

function formatDuration(months: number) {
    if (months === Infinity || months > 1200) return "100+ years";
    const y = Math.floor(months / 12);
    const m = months % 12;
    return m > 0 ? `${y} yrs ${m} months` : `${y} years`;
}

/* ─── Goal presets ─── */
const GOAL_PRESETS = [
    { label: "₹25L", value: 25_00_000 },
    { label: "₹50L", value: 50_00_000 },
    { label: "₹1 Cr", value: 1_00_00_000 },
    { label: "₹5 Cr", value: 5_00_00_000 },
    { label: "₹10 Cr", value: 10_00_00_000 },
];

/* ═══════════ MODE 1: GOAL PLANNER ═══════════ */
function GoalPlannerMode() {
    const [sip, setSip] = useState(10_000);
    const [lump, setLump] = useState(0);
    const [goal, setGoal] = useState(1_00_00_000);
    const [rate, setRate] = useState(12);
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState(6);

    const result = useMemo(() => {
        const months = monthsToGoal(sip, lump, rate, goal);
        const totalInvested = sip * months + lump;
        const wealthGained = goal - totalInvested;
        const realValue = showInflation ? goal / Math.pow(1 + inflation / 100, months / 12) : goal;
        return { months, totalInvested, wealthGained, realValue };
    }, [sip, lump, goal, rate, showInflation, inflation]);

    return (
        <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {GOAL_PRESETS.map(p => (
                    <button key={p.value} onClick={() => setGoal(p.value)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: goal === p.value ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                        background: goal === p.value ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                        fontWeight: goal === p.value ? 700 : 500, color: goal === p.value ? "var(--c-primary)" : "var(--c-text)",
                    }}>{p.label}</button>
                ))}
            </div>
            <InputRow label="Target Corpus" value={goal} set={setGoal} max={50_00_00_000} step={25_00_000} />
            <InputRow label="Monthly SIP" value={sip} set={setSip} max={10_00_000} step={1000} />
            <InputRow label="One-Time Lump Sum" value={lump} set={setLump} max={5_00_00_000} step={50_000} />
            <InputRow label="Expected Annual Return" value={rate} set={setRate} max={20} step={0.5} suffix="%" />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <input type="checkbox" id="inflToggle" checked={showInflation} onChange={e => setShowInflation(e.target.checked)} />
                <label htmlFor="inflToggle" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Show inflation-adjusted value</label>
            </div>
            {showInflation && <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={12} step={0.5} suffix="%" />}

            {/* Results */}
            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-2)" }}>
                    Time to reach {fmtCr(goal)}
                </div>
                <div style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", marginBottom: "var(--s-2)" }}>
                    {formatDuration(result.months)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-3)", marginTop: "var(--s-3)" }}>
                    <div style={{ background: "var(--c-bg)", borderRadius: 8, padding: "10px" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>Total Invested</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{fmtCr(result.totalInvested)}</div>
                    </div>
                    <div style={{ background: "var(--c-bg)", borderRadius: 8, padding: "10px" }}>
                        <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>Wealth Gained</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#16a34a" }}>{fmtCr(result.wealthGained)}</div>
                    </div>
                </div>
                {showInflation && (
                    <div style={{ background: "#fef3c7", borderRadius: 8, padding: "10px 14px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                        <div style={{ fontWeight: 700, color: "#92400e" }}>⚠️ Inflation-Adjusted Value</div>
                        <div style={{ color: "#78350f" }}>
                            {fmtCr(goal)} in {formatDuration(result.months)} = <strong>{fmtCr(result.realValue)}</strong> in today&rsquo;s money
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════════ MODE 2: STEP-UP SIP ═══════════ */
function StepUpMode() {
    const [sip, setSip] = useState(10_000);
    const [stepUp, setStepUp] = useState(10);
    const [rate, setRate] = useState(12);
    const [goal, setGoal] = useState(1_00_00_000);

    const result = useMemo(() => {
        const flatMonths = monthsToGoal(sip, 0, rate, goal);
        const stepMonths = monthsToGoalStepUp(sip, stepUp, rate, goal);
        const flatInvested = sip * flatMonths;
        // Calculate step-up invested
        let stepInvested = 0;
        let cur = sip;
        for (let m = 1; m <= stepMonths; m++) {
            if (m > 1 && (m - 1) % 12 === 0) cur *= (1 + stepUp / 100);
            stepInvested += cur;
        }
        const savedMonths = flatMonths - stepMonths;
        return { flatMonths, stepMonths, flatInvested, stepInvested, savedMonths };
    }, [sip, stepUp, rate, goal]);

    return (
        <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {GOAL_PRESETS.map(p => (
                    <button key={p.value} onClick={() => setGoal(p.value)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: goal === p.value ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                        background: goal === p.value ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                        fontWeight: goal === p.value ? 700 : 500, color: goal === p.value ? "var(--c-primary)" : "var(--c-text)",
                    }}>{p.label}</button>
                ))}
            </div>
            <InputRow label="Starting Monthly SIP" value={sip} set={setSip} max={5_00_000} step={1000} />
            <InputRow label="Annual Step-Up" value={stepUp} set={setStepUp} max={30} step={1} suffix="%" hint="Increase SIP by this % every year" />
            <InputRow label="Expected Return" value={rate} set={setRate} max={20} step={0.5} suffix="%" />
            <InputRow label="Target Corpus" value={goal} set={setGoal} max={50_00_00_000} step={25_00_000} />

            {/* Comparison */}
            <div style={{ background: result.savedMonths > 0 ? "#dcfce7" : "var(--c-surface)", border: `2px solid ${result.savedMonths > 0 ? "#16a34a" : "var(--c-border)"}`, borderRadius: 12, padding: "16px", textAlign: "center", marginBottom: "var(--s-3)" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: result.savedMonths > 0 ? "#16a34a" : "var(--c-text)" }}>
                    📈 Step-Up SIP saves you {formatDuration(result.savedMonths)}!
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 4px" }}>Parameter</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>Flat SIP</th>
                        <th style={{ textAlign: "right", padding: "8px 4px", color: "#16a34a" }}>Step-Up SIP ({stepUp}%)</th>
                    </tr></thead>
                    <tbody>
                        {[
                            ["Starting SIP", fmt(sip), fmt(sip)],
                            ["Time to Goal", formatDuration(result.flatMonths), formatDuration(result.stepMonths)],
                            ["Total Invested", fmtCr(result.flatInvested), fmtCr(result.stepInvested)],
                            ["Target Corpus", fmtCr(goal), fmtCr(goal)],
                        ].map(([l, f, s], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                                <td style={{ padding: "6px 4px" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px" }}>{f}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: "#16a34a" }}>{s}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════════ MODE 3: COST OF DELAY ═══════════ */
function CostOfDelayMode() {
    const [sip, setSip] = useState(10_000);
    const [rate, setRate] = useState(12);
    const [goal, setGoal] = useState(1_00_00_000);
    const DELAYS = [0, 1, 2, 3, 5, 10];

    const results = useMemo(() => {
        return DELAYS.map(d => {
            const m = monthsToGoal(sip, 0, rate, goal);
            const totalTime = m + d * 12;
            // How much more SIP needed if delayed by d years but want to finish at same age
            let reqSip = sip;
            if (d > 0 && m !== Infinity) {
                const targetMonths = Math.max(m - d * 12, 12);
                // binary search for required SIP
                let lo = sip, hi = 50_00_000;
                for (let iter = 0; iter < 50; iter++) {
                    const mid = (lo + hi) / 2;
                    const v = futureValueSIP(mid, rate, targetMonths);
                    if (v >= goal) hi = mid; else lo = mid;
                }
                reqSip = Math.ceil(hi);
            }
            return { delay: d, months: m, totalTime, reqSip, extraSip: reqSip - sip };
        });
    }, [sip, rate, goal]);

    return (
        <>
            <InputRow label="Monthly SIP" value={sip} set={setSip} max={5_00_000} step={1000} />
            <InputRow label="Expected Return" value={rate} set={setRate} max={20} step={0.5} suffix="%" />
            <InputRow label="Target Corpus" value={goal} set={setGoal} max={50_00_00_000} step={25_00_000} />

            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px 4px" }}>Delay</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>Time to Goal</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>SIP Needed (same timeline)</th>
                        <th style={{ textAlign: "right", padding: "8px 4px" }}>Extra SIP/month</th>
                    </tr></thead>
                    <tbody>
                        {results.map((r, i) => (
                            <tr key={i} style={{
                                borderBottom: "1px solid var(--c-border)",
                                background: i === 0 ? "#dcfce7" : i >= 4 ? "#fef2f2" : undefined,
                            }}>
                                <td style={{ padding: "6px 4px", fontWeight: i === 0 ? 700 : 400 }}>
                                    {r.delay === 0 ? "🟢 Start Now" : `⏳ ${r.delay} year${r.delay > 1 ? "s" : ""} late`}
                                </td>
                                <td style={{ textAlign: "right", padding: "6px 4px" }}>
                                    {r.delay === 0 ? formatDuration(r.months) : formatDuration(r.months + r.delay * 12)}
                                </td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{fmt(r.reqSip)}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", color: r.extraSip > 0 ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
                                    {r.extraSip > 0 ? `+${fmt(r.extraSip)}` : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {results[0].months !== Infinity && (
                <div style={{ background: "#fef3c7", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                    <strong style={{ color: "#92400e" }}>💡 Key Insight:</strong>
                    <span style={{ color: "#78350f" }}> Delaying by just 5 years requires <strong>{fmt(results[4]?.extraSip || 0)}/month extra</strong> to reach the same goal in the same timeframe. Start today!</span>
                </div>
            )}
        </>
    );
}

/* ═══════════ MODE 4: MILESTONE TRACKER ═══════════ */
function MilestoneMode() {
    const [sip, setSip] = useState(15_000);
    const [lump, setLump] = useState(0);
    const [rate, setRate] = useState(12);

    const MILESTONES = [25_00_000, 50_00_000, 1_00_00_000, 2_00_00_000, 5_00_00_000, 10_00_00_000];

    const results = useMemo(() => {
        return MILESTONES.map(target => {
            const m = monthsToGoal(sip, lump, rate, target);
            const invested = sip * m + lump;
            const gained = target - invested;
            return { target, months: m, invested, gained };
        });
    }, [sip, lump, rate]);

    return (
        <>
            <InputRow label="Monthly SIP" value={sip} set={setSip} max={10_00_000} step={1000} />
            <InputRow label="One-Time Lump Sum" value={lump} set={setLump} max={5_00_00_000} step={50_000} />
            <InputRow label="Expected Return" value={rate} set={setRate} max={20} step={0.5} suffix="%" />

            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1, marginBottom: "var(--s-2)" }}>
                🏆 Your Wealth Milestones
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {results.map((r, i) => {
                    const prevMonths = i > 0 ? results[i - 1].months : 0;
                    const gap = r.months - prevMonths;
                    return (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "var(--c-surface)", borderRadius: 10, padding: "12px 16px",
                            borderLeft: `4px solid ${r.months <= 240 ? "#16a34a" : r.months <= 480 ? "#f59e0b" : "#dc2626"}`,
                        }}>
                            <div style={{ minWidth: 80, fontWeight: 800, fontSize: "1rem" }}>{fmtCr(r.target)}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{formatDuration(r.months)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>
                                    Invested: {fmtCr(r.invested)} • Gained: {fmtCr(r.gained)}
                                    {i > 0 && gap > 0 && ` • Gap from prev: ${formatDuration(gap)}`}
                                </div>
                            </div>
                            <div style={{ fontSize: "1.2rem" }}>
                                {r.months <= 120 ? "🔥" : r.months <= 240 ? "✅" : r.months <= 480 ? "⏳" : "🐢"}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ background: "#e8f0fe", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--c-primary)" }}>📊 Notice the Pattern:</strong>
                <span style={{ color: "var(--c-text)" }}> Each successive crore takes <em>less</em> time than the previous one. That&rsquo;s the power of compounding — your first ₹1 Cr is the hardest, the next ones come faster!</span>
            </div>
        </>
    );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function CrorepatiCalculatorCore() {
    const [mode, setMode] = useState<Mode>("goal");

    return (
        <div style={{ background: "var(--c-card-bg, #fff)", borderRadius: 16, border: "1px solid var(--c-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--c-border)", background: "linear-gradient(135deg, var(--c-primary-bg, #e8f0fe), var(--c-surface))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>💰 Crorepati Calculator</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--c-text-muted)", marginTop: 4 }}>Plan your path to ₹1 Crore and beyond • SIP • Step-Up • Delay Analysis • Milestones</div>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid var(--c-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                        style={{
                            flex: 1, minWidth: 120, padding: "12px 8px", border: "none", cursor: "pointer",
                            borderBottom: mode === m.key ? "3px solid var(--c-primary)" : "3px solid transparent",
                            background: mode === m.key ? "var(--c-primary-bg, #e8f0fe)" : "transparent",
                            fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                            color: mode === m.key ? "var(--c-primary)" : "var(--c-text-muted)",
                        }}>
                        {m.icon} {m.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: "var(--s-5)" }}>
                {mode === "goal" && <GoalPlannerMode />}
                {mode === "stepup" && <StepUpMode />}
                {mode === "delay" && <CostOfDelayMode />}
                {mode === "milestone" && <MilestoneMode />}
            </div>
        </div>
    );
}

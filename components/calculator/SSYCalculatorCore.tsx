"use client";
import { useState, useMemo } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

type Mode = "maturity" | "withdrawal" | "compare" | "goal";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "maturity", icon: "🎀", label: "Maturity Estimator" },
    { key: "withdrawal", icon: "📚", label: "Withdrawal Sim" },
    { key: "compare", icon: "⚖️", label: "SSY vs PPF vs FD" },
    { key: "goal", icon: "🎯", label: "Goal Reverse" },
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
                <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono, monospace)" }}>{display}</span>
            </label>
            <input type="range" min={min ?? 0} max={max ?? 1_50_000} step={step ?? 1000} value={value}
                onChange={e => set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            {hint && <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)", marginTop: 2 }}>{hint}</div>}
        </div>
    );
}

/* ─── SSY math: 15 yrs deposit, 21 yrs maturity ─── */
function ssyCalc(yearly: number, rate: number, withdrawAt18: boolean) {
    const r = rate / 100;
    const schedule: { year: number; deposit: number; openBal: number; interest: number; closeBal: number }[] = [];
    let balance = 0;
    let totalDeposit = 0;
    let withdrawnAmount = 0;
    const maturityYear = 21;

    for (let y = 1; y <= maturityYear; y++) {
        const deposit = y <= 15 ? yearly : 0;
        totalDeposit += deposit;
        const openBal = balance + deposit;
        const interest = openBal * r;
        let closeBal = openBal + interest;

        if (withdrawAt18 && y === 18) {
            withdrawnAmount = closeBal * 0.5;
            closeBal -= withdrawnAmount;
        }

        schedule.push({ year: y, deposit, openBal, interest, closeBal });
        balance = closeBal;
    }

    return {
        totalDeposit, totalInterest: balance - totalDeposit + withdrawnAmount,
        maturityValue: balance, withdrawnAmount, schedule,
    };
}

/* ═══════ MODE 1: MATURITY ESTIMATOR ═══════ */
function MaturityMode() {
    const [yearly, setYearly] = useState(1_50_000);
    const [age, setAge] = useState(3);
    const [rate, setRate] = useState(8.2);
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState(6);

    const result = useMemo(() => ssyCalc(yearly, rate, false), [yearly, rate]);
    const maturityAge = age + 21;
    const maturityYear = new Date().getFullYear() + (21 - 0);
    const realValue = showInflation ? result.maturityValue / Math.pow(1 + inflation / 100, 21) : result.maturityValue;

    return (
        <>
            <InputRow label="Yearly Deposit" value={yearly} set={setYearly} max={1_50_000} step={5_000} min={250} hint="Min ₹250, Max ₹1,50,000 per year" />
            <InputRow label="Girl's Current Age" value={age} set={setAge} max={10} step={1} suffix="yr" min={0} />
            <InputRow label="SSY Interest Rate" value={rate} set={setRate} max={9.5} step={0.1} suffix="%" min={7} hint="Current rate: 8.2% (Q1 FY 2026-27)" />

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <input type="checkbox" id="ssyInfl" checked={showInflation} onChange={e => setShowInflation(e.target.checked)} />
                <label htmlFor="ssyInfl" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Show inflation-adjusted value</label>
            </div>
            {showInflation && <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={10} step={0.5} suffix="%" min={3} />}

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Maturity Value (Year 21)</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.maturityValue)}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--c-text-muted)" }}>Girl&rsquo;s age at maturity: <strong>{maturityAge} years</strong></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                        ["Total Deposited", fmtCr(result.totalDeposit), undefined],
                        ["Interest Earned", fmtCr(result.totalInterest), "#16a34a"],
                        ["CAGR Effective", `${rate}%`, "var(--c-primary)"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--c-bg)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                        </div>
                    ))}
                </div>
                {showInflation && (
                    <div style={{ background: "#fef3c7", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                        <strong style={{ color: "#92400e" }}>Real Value:</strong> <span style={{ color: "#78350f" }}>{fmtCr(realValue)} in today&rsquo;s purchasing power</span>
                    </div>
                )}

                <details style={{ marginTop: "var(--s-3)" }}>
                    <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--c-primary)" }}>📅 21-Year Growth Schedule</summary>
                    <div style={{ overflowX: "auto", marginTop: 8 }}>
                        <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                            <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                                <th style={{ textAlign: "left", padding: "5px 3px" }}>Year</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Deposit</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Interest</th>
                                <th style={{ textAlign: "right", padding: "5px 3px" }}>Balance</th>
                            </tr></thead>
                            <tbody>
                                {result.schedule.map(s => (
                                    <tr key={s.year} style={{ borderBottom: "1px solid var(--c-border)", background: s.year > 15 ? "#f0fdf4" : undefined }}>
                                        <td style={{ padding: "4px 3px" }}>Yr {s.year} {s.year > 15 ? "★" : ""}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px" }}>{s.deposit > 0 ? fmt(s.deposit) : "—"}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", color: "#16a34a" }}>{fmt(s.interest)}</td>
                                        <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600 }}>{fmtCr(s.closeBal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)", marginTop: 4 }}>★ Years 16–21: No deposit required, interest continues to accrue</div>
                    </div>
                </details>
            </div>
        </>
    );
}

/* ═══════ MODE 2: PARTIAL WITHDRAWAL SIMULATOR ═══════ */
function WithdrawalMode() {
    const [yearly, setYearly] = useState(1_50_000);
    const [rate, setRate] = useState(8.2);

    const noWithdraw = useMemo(() => ssyCalc(yearly, rate, false), [yearly, rate]);
    const withWithdraw = useMemo(() => ssyCalc(yearly, rate, true), [yearly, rate]);

    return (
        <>
            <InputRow label="Yearly Deposit" value={yearly} set={setYearly} max={1_50_000} step={5_000} min={250} />
            <InputRow label="SSY Interest Rate" value={rate} set={setRate} max={9.5} step={0.1} suffix="%" min={7} />

            <div style={{ background: "#e8f0fe", borderRadius: 12, padding: 16, marginBottom: "var(--s-3)" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--c-primary)", marginBottom: 8 }}>📚 Partial Withdrawal at Age 18 (for Higher Education)</div>
                <div style={{ fontSize: "0.82rem", color: "var(--c-text)" }}>
                    SSY allows withdrawal of up to <strong>50% of the balance</strong> when the girl turns 18 for higher education expenses.
                </div>
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Parameter</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>No Withdrawal</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", color: "#7c3aed" }}>50% at Year 18</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Total Deposited", fmtCr(noWithdraw.totalDeposit), fmtCr(withWithdraw.totalDeposit)],
                        ["Withdrawn at 18", "—", fmtCr(withWithdraw.withdrawnAmount)],
                        ["Maturity (Yr 21)", fmtCr(noWithdraw.maturityValue), fmtCr(withWithdraw.maturityValue)],
                        ["Total Received", fmtCr(noWithdraw.maturityValue), fmtCr(withWithdraw.maturityValue + withWithdraw.withdrawnAmount)],
                    ].map(([l, a, b], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                            <td style={{ padding: "6px 4px" }}>{l}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{a}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: "#7c3aed" }}>{b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: "#fef3c7", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "#92400e" }}>💡 Impact:</strong>
                <span style={{ color: "#78350f" }}> Withdrawing 50% at year 18 reduces maturity by {fmtCr(noWithdraw.maturityValue - withWithdraw.maturityValue)}, but you receive {fmtCr(withWithdraw.withdrawnAmount)} for education. Total payout across both = {fmtCr(withWithdraw.maturityValue + withWithdraw.withdrawnAmount)}.</span>
            </div>
        </>
    );
}

/* ═══════ MODE 3: SSY vs PPF vs FD ═══════ */
function CompareMode() {
    const [yearly, setYearly] = useState(1_50_000);

    const ssyRate = 8.2, ppfRate = 7.1, fdRate = 7.0, fdPostTax = 4.9;
    const ssyResult = useMemo(() => ssyCalc(yearly, ssyRate, false), [yearly]);
    const ppfResult = useMemo(() => {
        let bal = 0;
        for (let y = 1; y <= 15; y++) bal = (bal + yearly) * (1 + ppfRate / 100);
        return bal;
    }, [yearly]);
    const fdResult = useMemo(() => {
        let bal = 0;
        for (let y = 1; y <= 15; y++) bal = (bal + yearly) * (1 + fdPostTax / 100);
        return bal;
    }, [yearly]);

    const totalInvested = yearly * 15;

    return (
        <>
            <InputRow label="Annual Investment" value={yearly} set={setYearly} max={1_50_000} step={5_000} min={250} hint="Same amount invested in each instrument for 15 years" />

            <div style={{
                padding: 16, borderRadius: 12, textAlign: "center", marginBottom: "var(--s-3)",
                background: "#ffe4e6", border: "2px solid #f43f5e",
            }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#e11d48" }}>
                    🎀 SSY wins by {fmtCr(ssyResult.maturityValue - ppfResult)} over PPF (21-yr maturity)
                </div>
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Feature</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", color: "#e11d48" }}>🎀 SSY</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>📗 PPF</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>🏦 FD</th>
                </tr></thead>
                <tbody>
                    {[
                        ["Interest Rate", `${ssyRate}%`, `${ppfRate}%`, `${fdRate}% (${fdPostTax}% post-tax)`],
                        ["Total Invested", fmtCr(totalInvested), fmtCr(totalInvested), fmtCr(totalInvested)],
                        ["Maturity Value", fmtCr(ssyResult.maturityValue), fmtCr(ppfResult), fmtCr(fdResult)],
                        ["Total Returns", fmtCr(ssyResult.maturityValue - totalInvested), fmtCr(ppfResult - totalInvested), fmtCr(fdResult - totalInvested)],
                        ["Tax Status", "EEE (100% tax-free)", "EEE (100% tax-free)", "Interest taxed at slab"],
                        ["Lock-in", "21 years", "15 years", "Flexible"],
                        ["Risk", "Zero (Govt)", "Zero (Govt)", "Zero (Insured to ₹5L)"],
                    ].map(([l, s, p, f], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                            <td style={{ padding: "6px 4px" }}>{l}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: "#e11d48" }}>{s}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{p}</td>
                            <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600 }}>{f}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

/* ═══════ MODE 4: GOAL REVERSE ═══════ */
function GoalMode() {
    const [target, setTarget] = useState(50_00_000);
    const [rate, setRate] = useState(8.2);
    const [age, setAge] = useState(3);

    const result = useMemo(() => {
        // Binary search for yearly deposit
        let lo = 250, hi = 1_50_000;
        for (let i = 0; i < 50; i++) {
            const mid = (lo + hi) / 2;
            const r = ssyCalc(mid, rate, false);
            if (r.maturityValue >= target) hi = mid; else lo = mid;
        }
        const requiredYearly = Math.ceil(hi);
        const requiredMonthly = Math.ceil(requiredYearly / 12);
        const achievable = requiredYearly <= 1_50_000;
        return { requiredYearly, requiredMonthly, achievable };
    }, [target, rate, age]);

    const PRESETS = [
        { l: "₹25L", v: 25_00_000 }, { l: "₹50L", v: 50_00_000 },
        { l: "₹75L", v: 75_00_000 }, { l: "₹1 Cr", v: 1_00_00_000 },
    ];

    return (
        <>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {PRESETS.map(p => (
                    <button key={p.v} onClick={() => setTarget(p.v)} style={{
                        padding: "8px 14px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                        border: target === p.v ? "2px solid var(--c-primary)" : "1px solid var(--c-border)",
                        background: target === p.v ? "var(--c-primary-bg, #e8f0fe)" : "var(--c-bg)",
                        fontWeight: target === p.v ? 700 : 500, color: target === p.v ? "var(--c-primary)" : "var(--c-text)",
                    }}>{p.l}</button>
                ))}
            </div>
            <InputRow label="Target Maturity Amount" value={target} set={setTarget} max={1_50_00_000} step={1_00_000} min={5_00_000} />
            <InputRow label="SSY Interest Rate" value={rate} set={setRate} max={9.5} step={0.1} suffix="%" min={7} />
            <InputRow label="Girl's Current Age" value={age} set={setAge} max={10} step={1} suffix="yr" min={0} />

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                    Required Yearly Deposit
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "8px 0" }}>
                    {result.achievable ? fmt(result.requiredYearly) : "Exceeds ₹1.5L limit"}
                </div>
                {result.achievable ? (
                    <>
                        <div style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>
                            ≈ {fmt(result.requiredMonthly)}/month for 15 years → <strong>{fmtCr(target)}</strong> at maturity
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#16a34a", fontWeight: 700, marginTop: 8 }}>
                            Girl will be {age + 21} years old at maturity ✅
                        </div>
                    </>
                ) : (
                    <div style={{ background: "#fef2f2", borderRadius: 8, padding: "10px 14px", marginTop: 8, fontSize: "0.82rem", color: "#dc2626" }}>
                        <strong>⚠️ Target exceeds SSY limit.</strong> Max annual deposit is ₹1,50,000. At {rate}%, the maximum maturity is approximately {fmtCr(ssyCalc(1_50_000, rate, false).maturityValue)}. Consider supplementing with <a href="/in/sip-calculator" style={{ color: "#2563eb" }}>SIP</a> or <a href="/in/ppf-calculator" style={{ color: "#2563eb" }}>PPF</a>.
                    </div>
                )}
            </div>
        </>
    );
}

/* ═══════ MAIN ═══════ */
export default function SSYCalculatorCore() {
    const [mode, setMode] = useState<Mode>("maturity");

    return (
        <div style={{ background: "var(--c-card-bg, #fff)", borderRadius: 16, border: "1px solid var(--c-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--c-border)", background: "linear-gradient(135deg, #ffe4e6, var(--c-surface))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>🎀 Sukanya Samriddhi Yojana Calculator</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--c-text-muted)", marginTop: 4 }}>Girl child savings • 8.2% EEE tax-free • 21-year maturity • Govt guaranteed</div>
            </div>
            <div style={{ display: "flex", borderBottom: "1px solid var(--c-border)", flexWrap: "wrap" }}>
                {MODES.map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        flex: 1, minWidth: 120, padding: "12px 8px", border: "none", cursor: "pointer",
                        borderBottom: mode === m.key ? "3px solid var(--c-primary)" : "3px solid transparent",
                        background: mode === m.key ? "var(--c-primary-bg, #e8f0fe)" : "transparent",
                        fontWeight: mode === m.key ? 700 : 500, fontSize: "0.82rem",
                        color: mode === m.key ? "var(--c-primary)" : "var(--c-text-muted)",
                    }}>{m.icon} {m.label}</button>
                ))}
            </div>
            <div style={{ padding: "var(--s-5)" }}>
                {mode === "maturity" && <MaturityMode />}
                {mode === "withdrawal" && <WithdrawalMode />}
                {mode === "compare" && <CompareMode />}
                {mode === "goal" && <GoalMode />}
            </div>
        </div>
    );
}

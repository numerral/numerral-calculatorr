"use client";

import { useState, useMemo } from "react";

type CalcMode = "sip" | "lumpsum" | "goal" | "inflation";

function fmt(n: number): string {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtLakh(n: number): string {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${fmt(n)}`;
}

const PRESETS = [1000, 5000, 10000, 25000, 50000];

export default function SIPCalculatorIndiaCore() {
    const [mode, setMode] = useState<CalcMode>("sip");

    /* Mode 1: SIP */
    const [monthly, setMonthly] = useState(10000);
    const [returnRate, setReturnRate] = useState(12);
    const [years, setYears] = useState(15);
    const [stepUp, setStepUp] = useState(10);

    /* Mode 2: Lumpsum */
    const [lsAmount, setLsAmount] = useState(500000);
    const [lsReturn, setLsReturn] = useState(12);
    const [lsYears, setLsYears] = useState(15);

    /* Mode 3: Goal */
    const [goalTarget, setGoalTarget] = useState(10000000);
    const [goalReturn, setGoalReturn] = useState(12);
    const [goalYears, setGoalYears] = useState(15);

    /* Mode 4: Inflation */
    const [infMonthly, setInfMonthly] = useState(10000);
    const [infReturn, setInfReturn] = useState(12);
    const [infYears, setInfYears] = useState(20);
    const [infRate, setInfRate] = useState(6);

    /* ── SIP Calc ── */
    const sipResult = useMemo(() => {
        const r = returnRate / 100 / 12;
        const n = years * 12;
        // Fixed SIP
        const fvFixed = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const investedFixed = monthly * n;

        // Step-up SIP (year-by-year)
        const rows: { year: number; monthlySIP: number; invested: number; interest: number; balance: number }[] = [];
        let balance = 0;
        let totalInvested = 0;
        let currentMonthly = monthly;
        for (let y = 1; y <= years; y++) {
            const yearInvested = currentMonthly * 12;
            let yearBalance = balance;
            for (let m = 0; m < 12; m++) {
                yearBalance = (yearBalance + currentMonthly) * (1 + r);
            }
            const yearInterest = yearBalance - balance - yearInvested;
            totalInvested += yearInvested;
            balance = yearBalance;
            rows.push({ year: y, monthlySIP: Math.round(currentMonthly), invested: Math.round(totalInvested), interest: Math.round(balance - totalInvested), balance: Math.round(balance) });
            currentMonthly = Math.round(currentMonthly * (1 + stepUp / 100));
        }
        const stepUpWealth = Math.round(balance - totalInvested);
        const advantage = Math.round(balance) - Math.round(fvFixed);

        return {
            fixedFV: Math.round(fvFixed),
            fixedInvested: investedFixed,
            fixedGain: Math.round(fvFixed) - investedFixed,
            stepUpFV: Math.round(balance),
            stepUpInvested: Math.round(totalInvested),
            stepUpGain: stepUpWealth,
            advantage,
            rows,
        };
    }, [monthly, returnRate, years, stepUp]);

    /* ── Lumpsum ── */
    const lsResult = useMemo(() => {
        const fv = lsAmount * Math.pow(1 + lsReturn / 100, lsYears);
        return { fv: Math.round(fv), gain: Math.round(fv) - lsAmount, invested: lsAmount };
    }, [lsAmount, lsReturn, lsYears]);

    /* ── Goal ── */
    const goalResult = useMemo(() => {
        const r = goalReturn / 100 / 12;
        const n = goalYears * 12;
        const sip = goalTarget / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        return { requiredSIP: Math.round(sip), totalInvested: Math.round(sip) * n, target: goalTarget };
    }, [goalTarget, goalReturn, goalYears]);

    /* ── Inflation ── */
    const infResult = useMemo(() => {
        const r = infReturn / 100 / 12;
        const n = infYears * 12;
        const nominalFV = infMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const realFV = nominalFV / Math.pow(1 + infRate / 100, infYears);
        const invested = infMonthly * n;
        return { nominal: Math.round(nominalFV), real: Math.round(realFV), invested, purchasingPowerLoss: Math.round(nominalFV - realFV) };
    }, [infMonthly, infReturn, infYears, infRate]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">📈 SIP Calculator India</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["sip", "SIP Calculator"], ["lumpsum", "💰 Lumpsum"], ["goal", "🎯 Goal Planning"], ["inflation", "📉 Inflation-Adjusted"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: SIP ═══════ */}
            {mode === "sip" && (
                <>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {PRESETS.map((p) => (
                            <button key={p} className="calc-tab-btn" onClick={() => setMonthly(p)}
                                style={monthly === p ? { background: "rgba(212,98,10,0.1)", borderColor: "#d4620a", color: "#d4620a", fontWeight: 700, fontSize: "0.78rem", padding: "4px 10px" } : { fontSize: "0.78rem", padding: "4px 10px" }}>
                                ₹{p >= 1000 ? `${p / 1000}K` : p}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Monthly SIP (₹)</label>
                            <input type="number" className="con-input__field" value={monthly} onChange={(e) => setMonthly(Math.max(500, Number(e.target.value)))} min={500} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Expected Return (% p.a.)</label>
                            <input type="number" className="con-input__field" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} step={0.5} min={1} max={30} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Duration (Years)</label>
                            <input type="number" className="con-input__field" value={years} onChange={(e) => setYears(Math.max(1, Number(e.target.value)))} min={1} max={40} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Annual Step-up (%)</label>
                            <input type="number" className="con-input__field" value={stepUp} onChange={(e) => setStepUp(Math.max(0, Number(e.target.value)))} min={0} max={50} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>0% = Fixed SIP</div>
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>SIP Maturity Comparison</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Fixed SIP (₹{fmt(monthly)}/mo)</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{fmtLakh(sipResult.fixedFV)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Invested: ₹{fmt(sipResult.fixedInvested)} · Gain: ₹{fmt(sipResult.fixedGain)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid #16a34a", background: "rgba(22,163,74,0.03)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#16a34a", fontWeight: 700, marginBottom: "4px" }}>🏆 Step-up SIP (+{stepUp}%/yr)</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>{fmtLakh(sipResult.stepUpFV)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Invested: ₹{fmt(sipResult.stepUpInvested)} · Gain: ₹{fmt(sipResult.stepUpGain)}</div>
                            </div>
                        </div>
                        {stepUp > 0 && (
                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
                                💡 <strong>Step-up advantage:</strong> By increasing your SIP by {stepUp}% annually, you earn <strong>₹{fmt(sipResult.advantage)} more</strong> than a fixed SIP. That&apos;s {((sipResult.advantage / sipResult.fixedFV) * 100).toFixed(0)}% extra wealth from the same starting amount!
                            </div>
                        )}
                        <details>
                            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px", color: "#d4620a" }}>📊 Year-by-Year Breakdown (Step-up SIP)</summary>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "center" }}>Yr</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Monthly SIP</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Total Invested</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Interest</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Balance</th>
                                    </tr></thead>
                                    <tbody>
                                        {sipResult.rows.map((r, i) => (
                                            <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "center", fontWeight: 700 }}>{r.year}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>₹{fmt(r.monthlySIP)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#16a34a" }}>₹{fmt(r.invested)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#3b82f6" }}>₹{fmt(r.interest)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontWeight: 700 }}>₹{fmt(r.balance)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </div>
                </>
            )}

            {/* ═══════ MODE: LUMPSUM ═══════ */}
            {mode === "lumpsum" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Investment Amount (₹)</label>
                            <input type="number" className="con-input__field" value={lsAmount} onChange={(e) => setLsAmount(Number(e.target.value))} min={1000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Expected Return (% p.a.)</label>
                            <input type="number" className="con-input__field" value={lsReturn} onChange={(e) => setLsReturn(Number(e.target.value))} step={0.5} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Duration (Years)</label>
                            <input type="number" className="con-input__field" value={lsYears} onChange={(e) => setLsYears(Math.max(1, Number(e.target.value)))} min={1} max={40} />
                        </div>
                    </div>
                    <div className="con-calc__results">
                        <h4>💰 Lumpsum Investment Result</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Invested</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>{fmtLakh(lsResult.invested)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Wealth Gained</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#3b82f6" }}>{fmtLakh(lsResult.gain)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(212,98,10,0.05)", border: "1px solid rgba(212,98,10,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Maturity Value</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d4620a" }}>{fmtLakh(lsResult.fv)}</div>
                            </div>
                        </div>
                        <div className="con-result-row"><span className="con-result-row__label">Growth Multiple</span><span className="con-result-row__value">{(lsResult.fv / lsResult.invested).toFixed(1)}x</span></div>
                        <div className="explanation__highlight" style={{ fontSize: "0.85rem" }}>
                            <strong>Formula:</strong> FV = P × (1 + r)<sup>n</sup> = ₹{fmt(lsResult.invested)} × (1 + {lsReturn}%)<sup>{lsYears}</sup> = <strong>{fmtLakh(lsResult.fv)}</strong>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: GOAL ═══════ */}
            {mode === "goal" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Target Amount (₹)</label>
                            <input type="number" className="con-input__field" value={goalTarget} onChange={(e) => setGoalTarget(Number(e.target.value))} min={10000} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>e.g. ₹1 Crore = 1,00,00,000</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Expected Return (% p.a.)</label>
                            <input type="number" className="con-input__field" value={goalReturn} onChange={(e) => setGoalReturn(Number(e.target.value))} step={0.5} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Duration (Years)</label>
                            <input type="number" className="con-input__field" value={goalYears} onChange={(e) => setGoalYears(Math.max(1, Number(e.target.value)))} min={1} max={40} />
                        </div>
                    </div>
                    <div className="con-calc__results">
                        <h4>🎯 Required Monthly SIP</h4>
                        <div style={{ textAlign: "center", padding: "20px 0", marginBottom: "16px" }}>
                            <div style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>To reach {fmtLakh(goalTarget)} in {goalYears} years</div>
                            <div style={{ fontSize: "3rem", fontWeight: 800, color: "#d4620a", letterSpacing: "-2px" }}>₹{fmt(goalResult.requiredSIP)}<span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-muted)" }}>/month</span></div>
                        </div>
                        <div className="con-result-row"><span className="con-result-row__label">Total You Will Invest</span><span className="con-result-row__value">₹{fmt(goalResult.totalInvested)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Wealth Gained (returns)</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>₹{fmt(goalTarget - goalResult.totalInvested)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Expected Return</span><span className="con-result-row__value">{goalReturn}% p.a.</span></div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: INFLATION ═══════ */}
            {mode === "inflation" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Monthly SIP (₹)</label>
                            <input type="number" className="con-input__field" value={infMonthly} onChange={(e) => setInfMonthly(Number(e.target.value))} min={500} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Expected Return (%)</label>
                            <input type="number" className="con-input__field" value={infReturn} onChange={(e) => setInfReturn(Number(e.target.value))} step={0.5} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Duration (Years)</label>
                            <input type="number" className="con-input__field" value={infYears} onChange={(e) => setInfYears(Math.max(1, Number(e.target.value)))} min={1} max={40} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Inflation Rate (%)</label>
                            <input type="number" className="con-input__field" value={infRate} onChange={(e) => setInfRate(Number(e.target.value))} step={0.5} min={0} max={15} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>India avg: 5–6%</div>
                        </div>
                    </div>
                    <div className="con-calc__results">
                        <h4>📉 Inflation-Adjusted Returns</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Nominal Value (in {infYears} years)</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{fmtLakh(infResult.nominal)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>At {infReturn}% return rate</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid #f59e0b", background: "rgba(245,158,11,0.03)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#f59e0b", fontWeight: 700, marginBottom: "4px" }}>⚠️ Real Value (today&apos;s money)</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f59e0b" }}>{fmtLakh(infResult.real)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>After {infRate}% inflation</div>
                            </div>
                        </div>
                        <div className="con-result-row"><span className="con-result-row__label">Total Invested</span><span className="con-result-row__value">₹{fmt(infResult.invested)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Purchasing Power Loss</span><span className="con-result-row__value" style={{ color: "#ef4444", fontWeight: 700 }}>₹{fmt(infResult.purchasingPowerLoss)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">Real Return Rate</span><span className="con-result-row__value">{((1 + infReturn / 100) / (1 + infRate / 100) * 100 - 100).toFixed(1)}% p.a.</span></div>
                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Why this matters:</strong> Your SIP will be worth {fmtLakh(infResult.nominal)} in {infYears} years, but that money will only buy goods worth <strong>{fmtLakh(infResult.real)} in today&apos;s prices</strong>. At {infRate}% inflation, your {fmtLakh(infResult.nominal)} future corpus has the purchasing power of just {fmtLakh(infResult.real)} today. This is why equity SIPs (12–15% returns) beat inflation better than FDs (6–7%).
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

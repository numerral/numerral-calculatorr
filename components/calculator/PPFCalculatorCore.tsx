"use client";

import { useState, useMemo } from "react";

type CalcMode = "maturity" | "strategy" | "extension";

function fmt(n: number): string {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmtLakh(n: number): string {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${fmt(n)}`;
}

const PRESETS = [500, 50000, 100000, 150000];

export default function PPFCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("maturity");

    /* Mode 1: Maturity */
    const [annual, setAnnual] = useState(150000);
    const [rate, setRate] = useState(7.1);
    const [tenure, setTenure] = useState(15);

    /* Mode 2: Strategy */
    const [stAnnual, setStAnnual] = useState(150000);
    const [stRate, setStRate] = useState(7.1);

    /* Mode 3: Extension */
    const [extBalance, setExtBalance] = useState(4068209);
    const [extBlocks, setExtBlocks] = useState(1);
    const [extContrib, setExtContrib] = useState(true);
    const [extAnnual, setExtAnnual] = useState(150000);
    const [extRate, setExtRate] = useState(7.1);

    /* ── Maturity Calc ── */
    const maturityResult = useMemo(() => {
        const r = rate / 100;
        const rows: { year: number; opening: number; deposit: number; interest: number; closing: number }[] = [];
        let balance = 0;
        for (let y = 1; y <= tenure; y++) {
            const opening = balance;
            const deposit = annual;
            const interest = Math.round((opening + deposit) * r);
            const closing = opening + deposit + interest;
            rows.push({ year: y, opening, deposit, interest, closing });
            balance = closing;
        }
        const totalDeposit = annual * tenure;
        const totalInterest = balance - totalDeposit;
        return { rows, totalDeposit, totalInterest, maturity: balance };
    }, [annual, rate, tenure]);

    /* ── Strategy Calc ── */
    const strategyResult = useMemo(() => {
        const r = stRate / 100;
        const monthlyR = r / 12;

        // Scenario A: Lump sum on April 5 (earns interest for all 12 months)
        let balA = 0;
        for (let y = 1; y <= 15; y++) {
            balA = (balA + stAnnual) * (1 + r);
        }

        // Scenario B: Monthly installments (average 6.5 months of interest per year)
        let balB = 0;
        const monthlyAmt = stAnnual / 12;
        for (let y = 1; y <= 15; y++) {
            let yearBal = balB;
            for (let m = 0; m < 12; m++) {
                yearBal += monthlyAmt;
                yearBal *= (1 + monthlyR);
            }
            balB = yearBal;
        }

        // Scenario C: Lump sum in March (only ~1 month interest in that year)
        let balC = 0;
        for (let y = 1; y <= 15; y++) {
            const interest = Math.round(balC * r);
            balC = balC + interest + stAnnual;
        }

        const advantage = Math.round(balA - balB);
        const advantageVsMarch = Math.round(balA - balC);

        return {
            lumpApril: Math.round(balA),
            monthlySIP: Math.round(balB),
            lumpMarch: Math.round(balC),
            advantage,
            advantageVsMarch,
            totalDeposit: stAnnual * 15,
        };
    }, [stAnnual, stRate]);

    /* ── Extension Calc ── */
    const extensionResult = useMemo(() => {
        const r = extRate / 100;
        const totalYears = extBlocks * 5;
        const rows: { year: number; opening: number; deposit: number; interest: number; closing: number }[] = [];
        let balance = extBalance;
        for (let y = 1; y <= totalYears; y++) {
            const opening = balance;
            const deposit = extContrib ? extAnnual : 0;
            const interest = Math.round((opening + deposit) * r);
            const closing = opening + deposit + interest;
            rows.push({ year: y, opening, deposit, interest, closing });
            balance = closing;
        }
        const totalDeposit = extContrib ? extAnnual * totalYears : 0;
        const totalInterest = balance - extBalance - totalDeposit;
        return { rows, totalDeposit, totalInterest, finalBalance: balance };
    }, [extBalance, extBlocks, extContrib, extAnnual, extRate]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};
    const thStyle: React.CSSProperties = { padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">📊 PPF Calculator India</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["maturity", "Maturity Calculator"], ["strategy", "💡 Investment Strategy"], ["extension", "📅 Extension Planner"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: MATURITY ═══════ */}
            {mode === "maturity" && (
                <>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {PRESETS.map((p) => (
                            <button key={p} className="calc-tab-btn" onClick={() => setAnnual(p)}
                                style={annual === p ? { background: "rgba(212,98,10,0.1)", borderColor: "#d4620a", color: "#d4620a", fontWeight: 700, fontSize: "0.78rem", padding: "4px 10px" } : { fontSize: "0.78rem", padding: "4px 10px" }}>
                                {p >= 100000 ? `₹${p / 100000}L` : `₹${fmt(p)}`}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Annual Investment (₹)</label>
                            <input type="number" className="con-input__field" value={annual} onChange={(e) => setAnnual(Math.min(150000, Math.max(500, Number(e.target.value))))} min={500} max={150000} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Min ₹500 · Max ₹1,50,000</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate (% p.a.)</label>
                            <input type="number" className="con-input__field" value={rate} onChange={(e) => setRate(Number(e.target.value))} step={0.1} min={1} max={15} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Current: 7.1% (Q1 2026)</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Tenure (Years)</label>
                            <input type="number" className="con-input__field" value={tenure} onChange={(e) => setTenure(Math.max(15, Number(e.target.value)))} min={15} max={50} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Min 15 years (5yr extensions)</div>
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>PPF Maturity Summary</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Total Invested</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>{fmtLakh(maturityResult.totalDeposit)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Interest Earned</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#3b82f6" }}>{fmtLakh(maturityResult.totalInterest)}</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(212,98,10,0.05)", border: "1px solid rgba(212,98,10,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600, marginBottom: "4px" }}>Maturity Value</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d4620a" }}>{fmtLakh(maturityResult.maturity)}</div>
                            </div>
                        </div>

                        <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
                            💰 You invest <strong>₹{fmt(maturityResult.totalDeposit)}</strong> over {tenure} years and earn <strong>₹{fmt(maturityResult.totalInterest)}</strong> in tax-free interest. Your money grows by <strong>{((maturityResult.totalInterest / maturityResult.totalDeposit) * 100).toFixed(0)}%</strong> — all completely exempt under EEE status.
                        </div>

                        <details>
                            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px", color: "#d4620a" }}>📊 Year-by-Year Breakdown ({tenure} years)</summary>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "center" }}>Year</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Opening</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Deposit</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Interest</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Closing</th>
                                    </tr></thead>
                                    <tbody>
                                        {maturityResult.rows.map((r, i) => (
                                            <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "center", fontWeight: 700 }}>{r.year}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>₹{fmt(r.opening)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#16a34a" }}>₹{fmt(r.deposit)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#3b82f6" }}>₹{fmt(r.interest)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontWeight: 700 }}>₹{fmt(r.closing)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </div>
                </>
            )}

            {/* ═══════ MODE: STRATEGY ═══════ */}
            {mode === "strategy" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Annual Investment (₹)</label>
                            <input type="number" className="con-input__field" value={stAnnual} onChange={(e) => setStAnnual(Math.min(150000, Math.max(500, Number(e.target.value))))} min={500} max={150000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate (% p.a.)</label>
                            <input type="number" className="con-input__field" value={stRate} onChange={(e) => setStRate(Number(e.target.value))} step={0.1} />
                        </div>
                    </div>

                    <div className="con-calc__results">
                        <h4>💡 Deposit Timing Strategy — 15 Year PPF</h4>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid #16a34a", background: "rgba(22,163,74,0.03)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#16a34a", fontWeight: 700, marginBottom: "4px" }}>🏆 Best: Lump Sum April 5</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>{fmtLakh(strategyResult.lumpApril)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Full 12 months interest</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Monthly Installments</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{fmtLakh(strategyResult.monthlySIP)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>~6.5 months avg interest</div>
                            </div>
                            <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid #ef4444", background: "rgba(239,68,68,0.03)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#ef4444", fontWeight: 700, marginBottom: "4px" }}>❌ Worst: Lump Sum March</div>
                                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>{fmtLakh(strategyResult.lumpMarch)}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>Only ~1 month interest</div>
                            </div>
                        </div>

                        <div className="con-result-row"><span className="con-result-row__label">Total Invested (15 years)</span><span className="con-result-row__value">₹{fmt(strategyResult.totalDeposit)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">🏆 April lump sum advantage vs monthly</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>+₹{fmt(strategyResult.advantage)}</span></div>
                        <div className="con-result-row"><span className="con-result-row__label">🏆 April lump sum advantage vs March deposit</span><span className="con-result-row__value" style={{ color: "#16a34a", fontWeight: 700 }}>+₹{fmt(strategyResult.advantageVsMarch)}</span></div>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>The "5th of Month" Rule:</strong> PPF interest is calculated on the <strong>lowest balance between the 5th and the last day of each month</strong>. If you deposit your entire annual contribution on <strong>April 5</strong> (start of the financial year), your money earns interest for <strong>all 12 months</strong>. Depositing the same amount in March means only ~1 month of interest for that year. Over 15 years, this timing can create a difference of <strong>₹{fmt(strategyResult.advantageVsMarch)}</strong>.
                        </div>
                    </div>
                </>
            )}

            {/* ═══════ MODE: EXTENSION ═══════ */}
            {mode === "extension" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Current PPF Balance (₹)</label>
                            <input type="number" className="con-input__field" value={extBalance} onChange={(e) => setExtBalance(Number(e.target.value))} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Extension Blocks (5yr each)</label>
                            <select className="con-input__field" value={extBlocks} onChange={(e) => setExtBlocks(Number(e.target.value))}>
                                <option value={1}>1 block (5 years)</option>
                                <option value={2}>2 blocks (10 years)</option>
                                <option value={3}>3 blocks (15 years)</option>
                                <option value={4}>4 blocks (20 years)</option>
                            </select>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Interest Rate (% p.a.)</label>
                            <input type="number" className="con-input__field" value={extRate} onChange={(e) => setExtRate(Number(e.target.value))} step={0.1} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                        <button className="calc-tab-btn" style={extContrib ? { background: "rgba(22,163,74,0.1)", borderColor: "#16a34a", color: "#16a34a", fontWeight: 700 } : {}} onClick={() => setExtContrib(true)}>✅ With Contributions</button>
                        <button className="calc-tab-btn" style={!extContrib ? { background: "rgba(212,98,10,0.1)", borderColor: "#d4620a", color: "#d4620a", fontWeight: 700 } : {}} onClick={() => setExtContrib(false)}>⏸ Without Contributions</button>
                    </div>

                    {extContrib && (
                        <div className="con-input" style={{ maxWidth: "300px", marginBottom: "16px" }}>
                            <label className="con-input__label">Annual Contribution (₹)</label>
                            <input type="number" className="con-input__field" value={extAnnual} onChange={(e) => setExtAnnual(Math.min(150000, Number(e.target.value)))} max={150000} />
                        </div>
                    )}

                    <div className="con-calc__results">
                        <h4>📅 PPF Extension — {extBlocks * 5} Years Post Maturity</h4>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                            <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(156,163,175,0.06)", border: "1px solid var(--border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Starting Balance</div>
                                <div style={{ fontSize: "1rem", fontWeight: 800 }}>{fmtLakh(extBalance)}</div>
                            </div>
                            <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>New Deposits</div>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#16a34a" }}>{fmtLakh(extensionResult.totalDeposit)}</div>
                            </div>
                            <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Interest Earned</div>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#3b82f6" }}>{fmtLakh(extensionResult.totalInterest)}</div>
                            </div>
                            <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(212,98,10,0.05)", border: "1px solid rgba(212,98,10,0.2)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>Final Balance</div>
                                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#d4620a" }}>{fmtLakh(extensionResult.finalBalance)}</div>
                            </div>
                        </div>

                        <details>
                            <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px", color: "#d4620a" }}>📊 Year-by-Year Extension Breakdown</summary>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                    <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                        <th style={{ ...thStyle, textAlign: "center" }}>Yr</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Opening</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Deposit</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Interest</th>
                                        <th style={{ ...thStyle, textAlign: "right" }}>Closing</th>
                                    </tr></thead>
                                    <tbody>
                                        {extensionResult.rows.map((r, i) => (
                                            <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "center", fontWeight: 700 }}>{r.year}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>₹{fmt(r.opening)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#16a34a" }}>₹{fmt(r.deposit)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", color: "#3b82f6" }}>₹{fmt(r.interest)}</td>
                                                <td style={{ padding: "6px 10px", borderBottom: "1px solid var(--border)", textAlign: "right", fontWeight: 700 }}>₹{fmt(r.closing)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>

                        <div className="explanation__highlight" style={{ marginTop: "16px", fontSize: "0.85rem" }}>
                            <strong>Extension Rules:</strong> After 15-year maturity, you can extend your PPF in <strong>5-year blocks indefinitely</strong>. To continue contributing, submit <strong>Form H</strong> to your bank/post office within 1 year of maturity. Without Form H, the account earns interest on the existing balance but you <strong>cannot deposit new money</strong>.
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

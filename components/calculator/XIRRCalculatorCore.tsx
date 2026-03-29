"use client";
import { useState, useMemo, useCallback } from "react";

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};
const toISO = (d: Date) => d.toISOString().slice(0, 10);

type Mode = "true" | "sip" | "compare" | "whatif";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "true", icon: "📊", label: "True XIRR" },
    { key: "sip", icon: "📅", label: "SIP XIRR" },
    { key: "compare", icon: "⚖️", label: "XIRR vs CAGR" },
    { key: "whatif", icon: "🎯", label: "What-If" },
];

/* ─── Newton-Raphson XIRR Solver ─── */
function calcXIRR(cashflows: { date: Date; amount: number }[], guess = 0.1): number | null {
    if (cashflows.length < 2) return null;
    const d0 = cashflows[0].date.getTime();
    const daysIn = (d: Date) => (d.getTime() - d0) / (365.25 * 86400000);

    let rate = guess;
    for (let iter = 0; iter < 200; iter++) {
        let npv = 0, dnpv = 0;
        for (const cf of cashflows) {
            const t = daysIn(cf.date);
            const factor = Math.pow(1 + rate, t);
            npv += cf.amount / factor;
            if (t !== 0) dnpv -= (t * cf.amount) / (factor * (1 + rate));
        }
        if (Math.abs(npv) < 1e-6) return rate;
        if (Math.abs(dnpv) < 1e-12) break;
        const newRate = rate - npv / dnpv;
        if (Math.abs(newRate - rate) < 1e-9) return newRate;
        rate = newRate;
        if (rate < -0.99 || rate > 100) break;
    }
    // Retry with different guesses
    for (const g of [-0.5, 0.0, 0.5, 1.0, 2.0]) {
        if (g === guess) continue;
        let r = g;
        for (let iter = 0; iter < 200; iter++) {
            let npv = 0, dnpv = 0;
            for (const cf of cashflows) {
                const t = daysIn(cf.date);
                const factor = Math.pow(1 + r, t);
                npv += cf.amount / factor;
                if (t !== 0) dnpv -= (t * cf.amount) / (factor * (1 + r));
            }
            if (Math.abs(npv) < 1e-6) return r;
            if (Math.abs(dnpv) < 1e-12) break;
            const newR = r - npv / dnpv;
            if (Math.abs(newR - r) < 1e-9) return newR;
            r = newR;
            if (r < -0.99 || r > 100) break;
        }
    }
    return null;
}

function calcCAGR(initial: number, final: number, years: number): number | null {
    if (initial <= 0 || years <= 0) return null;
    return Math.pow(final / initial, 1 / years) - 1;
}

interface CashFlowRow { id: number; date: string; amount: number }

function makeSIPRows(): CashFlowRow[] {
    const now = new Date();
    const rows: CashFlowRow[] = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 10);
        rows.push({ id: i + 1, date: toISO(d), amount: -10000 });
    }
    rows.push({ id: 13, date: toISO(now), amount: 135000 }); // current value
    return rows;
}

/* ═══════ MODE 1: TRUE XIRR ═══════ */
function TrueXIRRMode() {
    const [rows, setRows] = useState<CashFlowRow[]>(makeSIPRows);
    const [nextId, setNextId] = useState(14);

    const addRow = useCallback(() => {
        setRows(r => [...r, { id: nextId, date: toISO(new Date()), amount: 0 }]);
        setNextId(n => n + 1);
    }, [nextId]);
    const removeRow = useCallback((id: number) => setRows(r => r.filter(x => x.id !== id)), []);
    const updateRow = useCallback((id: number, field: "date" | "amount", val: string) => {
        setRows(r => r.map(x => x.id === id ? { ...x, [field]: field === "amount" ? parseFloat(val) || 0 : val } : x));
    }, []);

    const result = useMemo(() => {
        const cfs = rows.filter(r => r.amount !== 0).map(r => ({ date: new Date(r.date), amount: r.amount }));
        const hasNeg = cfs.some(c => c.amount < 0);
        const hasPos = cfs.some(c => c.amount > 0);
        if (!hasNeg || !hasPos || cfs.length < 2) return null;
        const xirr = calcXIRR(cfs);
        const totalInvested = cfs.filter(c => c.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
        const totalReturned = cfs.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0);
        return { xirr, totalInvested, totalReturned, gain: totalReturned - totalInvested };
    }, [rows]);

    return (
        <>
            <div style={{ fontSize: "0.78rem", color: "var(--c-text-muted)", marginBottom: 12 }}>
                Enter investments as <strong>negative</strong> (−) amounts and redemptions/current value as <strong>positive</strong> (+).
                The last row should be today&rsquo;s date with your current portfolio value.
            </div>
            <div style={{ overflowX: "auto", maxHeight: 380, overflow: "auto", marginBottom: 14 }}>
                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--c-border)", position: "sticky", top: 0, background: "var(--c-surface)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px", width: "40%" }}>Date</th>
                        <th style={{ textAlign: "right", padding: "6px 4px", width: "45%" }}>Amount (₹)</th>
                        <th style={{ textAlign: "center", padding: "6px 4px", width: "15%" }}></th>
                    </tr></thead>
                    <tbody>
                        {rows.map(r => (
                            <tr key={r.id} style={{ borderBottom: "1px solid var(--c-border)", background: r.amount < 0 ? "#fef2f2" : r.amount > 0 ? "#f0fdf4" : undefined }}>
                                <td style={{ padding: "4px" }}>
                                    <input type="date" value={r.date} onChange={e => updateRow(r.id, "date", e.target.value)}
                                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--c-border)", fontSize: "0.82rem" }} />
                                </td>
                                <td style={{ padding: "4px" }}>
                                    <input type="number" value={r.amount} onChange={e => updateRow(r.id, "amount", e.target.value)}
                                        style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid var(--c-border)", fontSize: "0.82rem", textAlign: "right",
                                            color: r.amount < 0 ? "#dc2626" : r.amount > 0 ? "#16a34a" : undefined }} />
                                </td>
                                <td style={{ textAlign: "center", padding: "4px" }}>
                                    {rows.length > 2 && <button onClick={() => removeRow(r.id)} style={{
                                        border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: "0.78rem"
                                    }}>✕</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addRow} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px dashed var(--c-primary)", background: "var(--c-primary-bg, #e8f0fe)",
                color: "var(--c-primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", marginBottom: 14, width: "100%"
            }}>+ Add Cash Flow Row</button>

            {result && result.xirr !== null && (
                <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: (result.xirr >= 0 ? "#16a34a" : "#dc2626"), textTransform: "uppercase", letterSpacing: 1 }}>
                            Your XIRR (Annualized Return)
                        </div>
                        <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", color: (result.xirr >= 0 ? "#16a34a" : "#dc2626") }}>
                            {(result.xirr * 100).toFixed(2)}%
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        {[
                            ["Total Invested", fmtCr(result.totalInvested), undefined],
                            ["Current Value", fmtCr(result.totalReturned), "#16a34a"],
                            [result.gain >= 0 ? "Gain" : "Loss", fmtCr(Math.abs(result.gain)), result.gain >= 0 ? "#16a34a" : "#dc2626"],
                        ].map(([l, v, c], i) => (
                            <div key={i} style={{ background: "var(--c-bg)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>{l}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {result && result.xirr === null && (
                <div style={{ background: "#fef2f2", padding: 14, borderRadius: 10, fontSize: "0.82rem", color: "#991b1b" }}>
                    Could not converge. Check that you have at least one negative (investment) and one positive (current value) amount.
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 2: SIP XIRR ═══════ */
function SIPXIRRMode() {
    const [sipAmt, setSipAmt] = useState(10000);
    const [months, setMonths] = useState(24);
    const [currentVal, setCurrentVal] = useState(280000);

    const result = useMemo(() => {
        const now = new Date();
        const cfs: { date: Date; amount: number }[] = [];
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 10);
            cfs.push({ date: d, amount: -sipAmt });
        }
        cfs.push({ date: now, amount: currentVal });
        const xirr = calcXIRR(cfs);
        const totalInvested = sipAmt * months;
        const years = months / 12;
        const cagr = calcCAGR(totalInvested, currentVal, years);
        return { xirr, cagr, totalInvested, currentVal, gain: currentVal - totalInvested };
    }, [sipAmt, months, currentVal]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Monthly SIP Amount</span>
                    <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{fmt(sipAmt)}</span>
                </label>
                <input type="range" min={1000} max={100000} step={1000} value={sipAmt} onChange={e => setSipAmt(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>SIP Duration</span>
                    <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{months} months ({(months / 12).toFixed(1)} yrs)</span>
                </label>
                <input type="range" min={3} max={120} step={1} value={months} onChange={e => setMonths(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Current Portfolio Value</span>
                    <span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{fmtCr(currentVal)}</span>
                </label>
                <input type="range" min={sipAmt} max={sipAmt * months * 3} step={sipAmt} value={currentVal} onChange={e => setCurrentVal(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>

            {result.xirr !== null && (
                <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)" }}>
                    <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1 }}>SIP XIRR (True Return)</div>
                        <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--font-mono)", color: result.xirr >= 0 ? "#16a34a" : "#dc2626" }}>
                            {(result.xirr * 100).toFixed(2)}%
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "var(--s-3)" }}>
                        {[
                            ["Total Invested", fmtCr(result.totalInvested), undefined],
                            ["Current Value", fmtCr(result.currentVal), "#16a34a"],
                            ["Gain", fmtCr(Math.abs(result.gain)), result.gain >= 0 ? "#16a34a" : "#dc2626"],
                        ].map(([l, v, c], i) => (
                            <div key={i} style={{ background: "var(--c-bg)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                                <div style={{ fontSize: "0.72rem", color: "var(--c-text-muted)" }}>{l}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                            </div>
                        ))}
                    </div>
                    {result.cagr !== null && (
                        <div style={{ background: "#fef3c7", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                            <strong style={{ color: "#92400e" }}>💡 CAGR (point-to-point) would show: {(result.cagr * 100).toFixed(2)}%</strong>
                            <div style={{ color: "#78350f", marginTop: 4 }}>CAGR ignores that your money entered at different times. XIRR accounts for each SIP installment&rsquo;s actual holding period, giving a more accurate picture.</div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

/* ═══════ MODE 3: XIRR vs CAGR ═══════ */
function CompareMode() {
    const [sipAmt, setSipAmt] = useState(10000);
    const [months, setMonths] = useState(36);
    const [currentVal, setCurrentVal] = useState(450000);

    const result = useMemo(() => {
        const now = new Date();
        const cfs: { date: Date; amount: number }[] = [];
        for (let i = months - 1; i >= 0; i--) {
            cfs.push({ date: new Date(now.getFullYear(), now.getMonth() - i, 10), amount: -sipAmt });
        }
        cfs.push({ date: now, amount: currentVal });
        const xirr = calcXIRR(cfs);
        const totalInvested = sipAmt * months;
        const years = months / 12;
        const cagr = calcCAGR(totalInvested, currentVal, years);
        const absReturn = totalInvested > 0 ? ((currentVal - totalInvested) / totalInvested) * 100 : 0;
        return { xirr, cagr, totalInvested, absReturn, years };
    }, [sipAmt, months, currentVal]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Monthly SIP</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{fmt(sipAmt)}</span>
                </label>
                <input type="range" min={1000} max={100000} step={1000} value={sipAmt} onChange={e => setSipAmt(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Duration</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{months} months</span>
                </label>
                <input type="range" min={6} max={120} step={1} value={months} onChange={e => setMonths(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Current Value</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{fmtCr(currentVal)}</span>
                </label>
                <input type="range" min={sipAmt} max={sipAmt * months * 3} step={sipAmt} value={currentVal} onChange={e => setCurrentVal(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--c-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Metric</th>
                    <th style={{ textAlign: "center", padding: "8px 4px" }}>Value</th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Best For</th>
                </tr></thead>
                <tbody>
                    {[
                        ["📊 XIRR", result.xirr !== null ? `${(result.xirr * 100).toFixed(2)}%` : "N/A", "SIPs, irregular investments, accurate timing"],
                        ["📈 CAGR", result.cagr !== null ? `${(result.cagr * 100).toFixed(2)}%` : "N/A", "Lump sum, point-to-point growth"],
                        ["💰 Absolute Return", `${result.absReturn.toFixed(2)}%`, "Quick snapshot, not annualized"],
                    ].map(([m, v, b], i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--c-border)" }}>
                            <td style={{ padding: "8px 4px", fontWeight: 700 }}>{m}</td>
                            <td style={{ textAlign: "center", padding: "8px 4px", fontWeight: 700, fontSize: "1.1rem", color: "var(--c-primary)" }}>{v}</td>
                            <td style={{ padding: "8px 4px", fontSize: "0.78rem", color: "var(--c-text-muted)" }}>{b}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: "#e8f0fe", borderRadius: 10, padding: "12px 16px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--c-primary)" }}>Why are they different?</strong>
                <div style={{ color: "var(--c-text)", marginTop: 4 }}>
                    CAGR treats your ₹{fmtCr(result.totalInvested)} as if it was all invested on day 1. In reality, your last SIP installment has only been invested for 1 month.
                    XIRR correctly weights each installment by its actual holding period — making it the <strong>gold standard for SIP return measurement</strong>.
                </div>
            </div>
        </>
    );
}

/* ═══════ MODE 4: WHAT-IF ═══════ */
function WhatIfMode() {
    const [sipAmt, setSipAmt] = useState(10000);
    const [months, setMonths] = useState(24);
    const [targetXIRR, setTargetXIRR] = useState(15);

    const result = useMemo(() => {
        const now = new Date();
        const cfs: { date: Date; amount: number }[] = [];
        for (let i = months - 1; i >= 0; i--) {
            cfs.push({ date: new Date(now.getFullYear(), now.getMonth() - i, 10), amount: -sipAmt });
        }
        const totalInvested = sipAmt * months;
        // Binary search for required value
        let lo = totalInvested * 0.5, hi = totalInvested * 5;
        for (let iter = 0; iter < 80; iter++) {
            const mid = (lo + hi) / 2;
            const testCfs = [...cfs, { date: now, amount: mid }];
            const x = calcXIRR(testCfs);
            if (x === null) { lo = mid; continue; }
            if (x * 100 < targetXIRR) lo = mid; else hi = mid;
        }
        const requiredVal = Math.round((lo + hi) / 2);
        const testCfs = [...cfs, { date: now, amount: requiredVal }];
        const actualXIRR = calcXIRR(testCfs);
        return { requiredVal, totalInvested, gain: requiredVal - totalInvested, actualXIRR };
    }, [sipAmt, months, targetXIRR]);

    return (
        <>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Monthly SIP</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{fmt(sipAmt)}</span>
                </label>
                <input type="range" min={1000} max={100000} step={1000} value={sipAmt} onChange={e => setSipAmt(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>SIP Duration</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{months} months</span>
                </label>
                <input type="range" min={3} max={120} step={1} value={months} onChange={e => setMonths(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
                <label style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.88rem", marginBottom: 4 }}>
                    <span>Target XIRR</span><span style={{ color: "var(--c-primary)", fontFamily: "var(--font-mono)" }}>{targetXIRR}%</span>
                </label>
                <input type="range" min={5} max={50} step={1} value={targetXIRR} onChange={e => setTargetXIRR(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--c-primary)" }} />
            </div>

            <div style={{ background: "var(--c-surface)", borderRadius: 12, padding: "var(--s-4)", textAlign: "center" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--c-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Required Portfolio Value for {targetXIRR}% XIRR</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono)", margin: "8px 0" }}>{fmtCr(result.requiredVal)}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>
                    After {months} months of {fmt(sipAmt)}/month SIP (Total invested: {fmtCr(result.totalInvested)})
                </div>
                <div style={{ fontSize: "0.85rem", color: result.gain >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700, marginTop: 8 }}>
                    Required gain: {fmtCr(Math.abs(result.gain))} ({result.totalInvested > 0 ? ((result.gain / result.totalInvested) * 100).toFixed(1) : 0}% absolute return)
                </div>
            </div>
        </>
    );
}

/* ═══════ MAIN ═══════ */
export default function XIRRCalculatorCore() {
    const [mode, setMode] = useState<Mode>("true");

    return (
        <div style={{ background: "var(--c-card-bg, #fff)", borderRadius: 16, border: "1px solid var(--c-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--c-border)", background: "linear-gradient(135deg, #dbeafe, var(--c-surface))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📊 XIRR Calculator — Extended Internal Rate of Return</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--c-text-muted)", marginTop: 4 }}>True annualized return for SIP, irregular investments &amp; portfolios • Newton-Raphson solver</div>
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
                {mode === "true" && <TrueXIRRMode />}
                {mode === "sip" && <SIPXIRRMode />}
                {mode === "compare" && <CompareMode />}
                {mode === "whatif" && <WhatIfMode />}
            </div>
        </div>
    );
}

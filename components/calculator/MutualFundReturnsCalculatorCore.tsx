"use client";
import { useState, useMemo } from "react";

/* ─── Formatters ─── */
const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtCr = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    return fmt(n);
};

/* ─── Math ─── */
function compoundGrowth(p: number, r: number, t: number, n: number) {
    return p * Math.pow(1 + r / (100 * n), n * t);
}
function sipFV(monthly: number, r: number, months: number) {
    const rm = r / 12 / 100;
    if (rm === 0) return monthly * months;
    return monthly * ((Math.pow(1 + rm, months) - 1) / rm) * (1 + rm);
}

/* ─── Modes ─── */
type Mode = "returns" | "vssip" | "tax" | "goal";
const MODES: { key: Mode; icon: string; label: string }[] = [
    { key: "returns", icon: "📊", label: "Returns Calculator" },
    { key: "vssip", icon: "⚖️", label: "Lump Sum vs SIP" },
    { key: "tax", icon: "🧾", label: "Tax Impact" },
    { key: "goal", icon: "🎯", label: "Goal Reverse" },
];

/* ─── Shared Input Row ─── */
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

/* ═══════ MODE 1: RETURNS CALCULATOR ═══════ */
function ReturnsMode() {
    const [investType, setInvestType] = useState<"lumpsum" | "sip">("lumpsum");
    const [principal, setPrincipal] = useState(5_00_000);
    const [sipAmount, setSipAmount] = useState(10_000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [freq, setFreq] = useState(1);
    const [showInflation, setShowInflation] = useState(false);
    const [inflation, setInflation] = useState(6);
    const [showTax, setShowTax] = useState(false);
    const [showExitLoad, setShowExitLoad] = useState(false);
    const [exitLoadPct, setExitLoadPct] = useState(1);

    const result = useMemo(() => {
        let maturity: number, totalInvested: number;
        if (investType === "lumpsum") {
            maturity = compoundGrowth(principal, rate, years, freq);
            totalInvested = principal;
        } else {
            maturity = sipFV(sipAmount, rate, years * 12);
            totalInvested = sipAmount * years * 12;
        }
        const returns = maturity - totalInvested;
        const cagr = investType === "lumpsum"
            ? (Math.pow(maturity / totalInvested, 1 / years) - 1) * 100
            : rate; // For SIP, the input rate IS the XIRR approximation
        const absoluteReturn = (returns / totalInvested) * 100;
        const realValue = showInflation ? maturity / Math.pow(1 + inflation / 100, years) : maturity;

        // Tax calculation (equity fund assumed for Mode 1)
        const ltcgGain = Math.max(returns - 1_25_000, 0);
        const taxAmount = showTax ? ltcgGain * 0.125 : 0;

        // Exit load
        const exitLoadAmt = showExitLoad ? maturity * (exitLoadPct / 100) : 0;
        const postDeductions = maturity - taxAmount - exitLoadAmt;

        // Year-by-year schedule
        const schedule: { year: number; value: number; invested: number; gain: number }[] = [];
        for (let y = 1; y <= Math.min(years, 30); y++) {
            let v: number, inv: number;
            if (investType === "lumpsum") {
                v = compoundGrowth(principal, rate, y, freq);
                inv = principal;
            } else {
                v = sipFV(sipAmount, rate, y * 12);
                inv = sipAmount * y * 12;
            }
            schedule.push({ year: y, value: v, invested: inv, gain: v - inv });
        }

        return { maturity, totalInvested, returns, cagr, absoluteReturn, realValue, taxAmount, exitLoadAmt, postDeductions, schedule };
    }, [investType, principal, sipAmount, rate, years, freq, showInflation, inflation, showTax, showExitLoad, exitLoadPct]);

    const FREQS = [
        { label: "Yearly", value: 1 }, { label: "Half-Yearly", value: 2 },
        { label: "Quarterly", value: 4 }, { label: "Monthly", value: 12 },
    ];

    return (
        <>
            {/* Investment Type Toggle */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {(["lumpsum", "sip"] as const).map(t => (
                    <button key={t} onClick={() => setInvestType(t)} style={{
                        flex: 1, padding: "10px 12px", borderRadius: 8, fontSize: "0.88rem", cursor: "pointer",
                        border: investType === t ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                        background: investType === t ? "var(--n-primary-light)" : "var(--n-surface)",
                        fontWeight: investType === t ? 700 : 500, color: investType === t ? "var(--n-primary)" : "var(--n-text)",
                    }}>{t === "lumpsum" ? "📊 Lump Sum" : "📈 SIP (Monthly)"}</button>
                ))}
            </div>

            {investType === "lumpsum" ? (
                <>
                    <InputRow label="Investment Amount" value={principal} set={setPrincipal} max={10_00_00_000} step={10_000} min={1000} />
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
                </>
            ) : (
                <InputRow label="Monthly SIP Amount" value={sipAmount} set={setSipAmount} max={5_00_000} step={500} min={500}
                    hint="Regular monthly investment via SIP" />
            )}

            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={30} step={0.5} suffix="%" min={1}
                hint="Equity: 10–14%, Balanced: 8–10%, Debt: 6–8%" />
            <InputRow label="Time Period" value={years} set={setYears} max={40} step={1} suffix="yr" min={1} />

            {/* Toggles */}
            <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={showInflation} onChange={e => setShowInflation(e.target.checked)} /> Inflation adjust
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={showTax} onChange={e => setShowTax(e.target.checked)} /> LTCG Tax (12.5%)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}>
                    <input type="checkbox" checked={showExitLoad} onChange={e => setShowExitLoad(e.target.checked)} /> Exit Load
                </label>
            </div>
            {showInflation && <InputRow label="Expected Inflation" value={inflation} set={setInflation} max={12} step={0.5} suffix="%" min={1} />}
            {showExitLoad && <InputRow label="Exit Load %" value={exitLoadPct} set={setExitLoadPct} max={3} step={0.25} suffix="%" min={0.25}
                hint="Typical equity fund: 1% if redeemed within 1 year" />}

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>
                        {(showTax || showExitLoad) ? "Net Maturity Value" : "Total Maturity Value"}
                    </div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>
                        {fmtCr((showTax || showExitLoad) ? result.postDeductions : result.maturity)}
                    </div>
                    {showTax && <div style={{ fontSize: "0.78rem", color: "#dc2626" }}>LTCG Tax (12.5%): −{fmt(result.taxAmount)} (₹1.25L exempt)</div>}
                    {showExitLoad && <div style={{ fontSize: "0.78rem", color: "#dc2626" }}>Exit Load ({exitLoadPct}%): −{fmt(result.exitLoadAmt)}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    {[
                        ["Invested", fmtCr(result.totalInvested), undefined],
                        ["Returns", fmtCr(result.returns), "#16a34a"],
                        [investType === "lumpsum" ? "CAGR" : "XIRR ≈", `${result.cagr.toFixed(2)}%`, "var(--n-primary)"],
                        ["Absolute", `${result.absoluteReturn.toFixed(1)}%`, "#7c3aed"],
                    ].map(([l, v, c], i) => (
                        <div key={i} style={{ background: "var(--n-surface)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                            <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{l}</div>
                            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: c as string || undefined }}>{v}</div>
                        </div>
                    ))}
                </div>
                {showInflation && (
                    <div style={{ background: "var(--n-gold-light)", borderRadius: 8, padding: "8px 12px", marginTop: "var(--s-3)", fontSize: "0.82rem" }}>
                        <strong style={{ color: "var(--n-gold-text)" }}>Real Value:</strong>{" "}
                        <span style={{ color: "#78350f" }}>{fmtCr(result.realValue)} in today&rsquo;s purchasing power (at {inflation}% inflation)</span>
                    </div>
                )}

                {/* Year-by-year schedule */}
                {result.schedule.length > 0 && (
                    <details style={{ marginTop: "var(--s-3)" }}>
                        <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", color: "var(--n-primary)" }}>📅 Year-by-Year Growth Schedule</summary>
                        <div style={{ overflowX: "auto", marginTop: 8 }}>
                            <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                                    <th style={{ textAlign: "left", padding: "6px 4px" }}>Year</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Invested</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Value</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Gain</th>
                                </tr></thead>
                                <tbody>
                                    {result.schedule.map(s => (
                                        <tr key={s.year} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                            <td style={{ padding: "5px 4px" }}>Year {s.year}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px" }}>{fmtCr(s.invested)}</td>
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
        const stpMonths = 6;
        const stpMonthly = total / stpMonths;
        const sourceRm = 7 / 12 / 100;
        const targetRm = rate / 12 / 100;
        let srcBal = total, tgtBal = 0;
        for (let m = 1; m <= years * 12; m++) {
            if (m <= stpMonths && srcBal > 0) {
                srcBal = srcBal * (1 + sourceRm) - stpMonthly;
                if (srcBal < 0) srcBal = 0;
                tgtBal = (tgtBal + stpMonthly) * (1 + targetRm);
            } else {
                srcBal = srcBal * (1 + sourceRm);
                tgtBal = tgtBal * (1 + targetRm);
            }
        }
        const stpVal = srcBal + tgtBal;

        return {
            lumpVal, sipVal, stpVal, monthlySIP, stpMonthly,
            lumpReturn: lumpVal - total, sipReturn: sipVal - total, stpReturn: stpVal - total,
        };
    }, [total, rate, years]);

    const strategies = [
        { name: "📊 Lump Sum", desc: "Full amount invested day 1", maturity: result.lumpVal, returns: result.lumpReturn, risk: "High (timing risk)" },
        { name: "📈 SIP", desc: `${fmt(result.monthlySIP)}/mo × ${years * 12} months`, maturity: result.sipVal, returns: result.sipReturn, risk: "Low (rupee cost avg)" },
        { name: "🔄 STP (6-month)", desc: `Liquid → Equity over 6 months`, maturity: result.stpVal, returns: result.stpReturn, risk: "Moderate (best of both)" },
    ];
    const best = strategies.reduce((a, b) => a.maturity > b.maturity ? a : b);

    return (
        <>
            <InputRow label="Total Amount to Invest" value={total} set={setTotal} max={5_00_00_000} step={10_000} min={10_000} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={25} step={0.5} suffix="%" min={1}
                hint="Equity: 10–14%, Balanced: 8–10%, Debt: 6–8%" />
            <InputRow label="Investment Horizon" value={years} set={setYears} max={30} step={1} suffix="yr" min={1} />

            <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse", marginBottom: "var(--s-3)" }}>
                <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Strategy</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Maturity</th>
                    <th style={{ textAlign: "right", padding: "8px 4px" }}>Returns</th>
                    <th style={{ textAlign: "left", padding: "8px 4px" }}>Risk</th>
                </tr></thead>
                <tbody>
                    {strategies.map((s, i) => (
                        <tr key={i} style={{
                            borderBottom: "1px solid var(--n-border)",
                            background: s.maturity === best.maturity ? "var(--n-primary-light)" : "",
                        }}>
                            <td style={{ padding: "8px 4px" }}>
                                <div style={{ fontWeight: 700 }}>{s.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--n-text-muted)" }}>{s.desc}</div>
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 4px", fontWeight: 700, color: s.maturity === best.maturity ? "var(--n-primary)" : undefined }}>
                                {fmtCr(s.maturity)}
                            </td>
                            <td style={{ textAlign: "right", padding: "8px 4px", color: "#16a34a", fontWeight: 600 }}>+{fmtCr(s.returns)}</td>
                            <td style={{ padding: "8px 4px", fontSize: "0.75rem" }}>{s.risk}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ background: "var(--n-primary-light)", borderRadius: 10, padding: "12px 16px", fontSize: "0.82rem" }}>
                <strong style={{ color: "var(--n-primary)" }}>⚖️ Key Insight:</strong> At a constant {rate}% return, <strong>lump sum always wins</strong> because the full amount compounds from day 1. However, in real volatile markets, <strong>SIP often outperforms</strong> via <strong>rupee cost averaging</strong>. The <strong>STP (Systematic Transfer Plan)</strong> combines safety with growth — park in liquid fund first, then transfer to equity monthly over 6 months. STP is ideal when markets are near all-time highs.
            </div>
        </>
    );
}

/* ═══════ MODE 3: TAX IMPACT ANALYSER ═══════ */
type FundCategory = "equity" | "debt" | "hybrid_eq" | "hybrid_debt" | "elss";
const FUND_CATEGORIES: { key: FundCategory; label: string; desc: string }[] = [
    { key: "equity", label: "Equity Fund", desc: "≥65% domestic equity (Large Cap, Mid Cap, Small Cap, Flexi Cap, Index)" },
    { key: "hybrid_eq", label: "Aggressive Hybrid", desc: "≥65% equity (Balanced Advantage, Aggressive Hybrid)" },
    { key: "hybrid_debt", label: "Conservative Hybrid", desc: "<65% equity (Debt-oriented hybrid, Arbitrage)" },
    { key: "debt", label: "Debt Fund", desc: "<35% equity (Liquid, Short Duration, Gilt, Corporate Bond)" },
    { key: "elss", label: "ELSS (Tax Saver)", desc: "Equity + 80C deduction, 3-year lock-in" },
];

function TaxMode() {
    const [amount, setAmount] = useState(5_00_000);
    const [rate, setRate] = useState(12);
    const [holdMonths, setHoldMonths] = useState(18);
    const [category, setCategory] = useState<FundCategory>("equity");
    const [taxBracket, setTaxBracket] = useState(30);

    const result = useMemo(() => {
        const years = holdMonths / 12;
        const maturity = compoundGrowth(amount, rate, years, 1);
        const gains = maturity - amount;
        const exitLoad = holdMonths <= 12 && category !== "debt" ? maturity * 0.01 : 0;

        // Determine tax treatment
        let taxType: "STCG" | "LTCG" | "SLAB";
        let taxRate: number;
        let exemption = 0;
        let lockInMonths = 0;

        if (category === "equity" || category === "hybrid_eq" || category === "elss") {
            lockInMonths = category === "elss" ? 36 : 0;
            if (holdMonths <= 12) {
                taxType = "STCG";
                taxRate = 20;
            } else {
                taxType = "LTCG";
                taxRate = 12.5;
                exemption = 1_25_000;
            }
        } else if (category === "debt") {
            taxType = "SLAB";
            taxRate = taxBracket;
            exemption = 0;
        } else {
            // hybrid_debt — treated as other (>24 months for LTCG)
            if (holdMonths <= 24) {
                taxType = "SLAB";
                taxRate = taxBracket;
            } else {
                taxType = "LTCG";
                taxRate = 12.5;
                exemption = 0;
            }
        }

        const taxableGain = taxType === "LTCG" ? Math.max(gains - exemption, 0) : gains;
        const taxAmount = Math.max(taxableGain * (taxRate / 100), 0);
        const cess = taxAmount * 0.04;
        const totalTax = taxAmount + cess;
        const netValue = maturity - totalTax - exitLoad;
        const effectiveReturn = (Math.pow(netValue / amount, 1 / years) - 1) * 100;

        // Section 80C benefit for ELSS
        const sec80cSaving = category === "elss" ? Math.min(amount, 1_50_000) * (taxBracket / 100) * 1.04 : 0;

        return { maturity, gains, exitLoad, taxType, taxRate, exemption, taxableGain, totalTax, netValue, effectiveReturn, holdMonths, lockInMonths, sec80cSaving };
    }, [amount, rate, holdMonths, category, taxBracket]);

    return (
        <>
            <InputRow label="Investment Amount" value={amount} set={setAmount} max={1_00_00_000} step={10_000} min={1000} />
            <InputRow label="Expected Return (p.a.)" value={rate} set={setRate} max={25} step={0.5} suffix="%" min={1} />
            <InputRow label="Holding Period" value={holdMonths} set={setHoldMonths} max={120} step={1} suffix="mo" min={1}
                hint={`= ${(holdMonths / 12).toFixed(1)} years`} />

            {/* Fund Category */}
            <div style={{ marginBottom: 14 }}>
                <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>SEBI Fund Category</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {FUND_CATEGORIES.map(c => (
                        <button key={c.key} onClick={() => setCategory(c.key)} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 12px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                            border: category === c.key ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                            background: category === c.key ? "var(--n-primary-light)" : "var(--n-surface)",
                        }}>
                            <div>
                                <div style={{ fontWeight: category === c.key ? 700 : 500, fontSize: "0.85rem", color: category === c.key ? "var(--n-primary)" : "var(--n-text)" }}>{c.label}</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)" }}>{c.desc}</div>
                            </div>
                            {category === c.key && <span style={{ color: "var(--n-primary)", fontWeight: 700 }}>✓</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tax bracket for debt/hybrid_debt */}
            {(category === "debt" || category === "hybrid_debt") && (
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontWeight: 600, fontSize: "0.88rem", display: "block", marginBottom: 8 }}>Your Income Tax Bracket</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        {[5, 10, 15, 20, 30].map(b => (
                            <button key={b} onClick={() => setTaxBracket(b)} style={{
                                flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: "0.82rem", cursor: "pointer",
                                border: taxBracket === b ? "2px solid var(--n-primary)" : "1px solid var(--n-border)",
                                background: taxBracket === b ? "var(--n-primary-light)" : "var(--n-surface)",
                                fontWeight: taxBracket === b ? 700 : 500, color: taxBracket === b ? "var(--n-primary)" : "var(--n-text)",
                            }}>{b}%</button>
                        ))}
                    </div>
                </div>
            )}

            {/* Results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                {result.lockInMonths > 0 && holdMonths < result.lockInMonths && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: "var(--s-3)", fontSize: "0.82rem", color: "#dc2626" }}>
                        ⚠️ ELSS has a <strong>3-year mandatory lock-in</strong>. You cannot redeem before {result.lockInMonths} months.
                    </div>
                )}

                <div style={{ textAlign: "center", marginBottom: "var(--s-3)" }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Net After-Tax Value</div>
                    <div style={{ fontSize: "2.2rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)" }}>{fmtCr(result.netValue)}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)" }}>
                        Effective Post-Tax CAGR: <strong style={{ color: "var(--n-primary)" }}>{result.effectiveReturn.toFixed(2)}%</strong> (vs {rate}% pre-tax)
                    </div>
                </div>

                <table style={{ width: "100%", fontSize: "0.82rem", borderCollapse: "collapse" }}>
                    <tbody>
                        {[
                            ["Gross Maturity", fmtCr(result.maturity), ""],
                            ["Capital Gains", fmtCr(result.gains), "#16a34a"],
                            ["Tax Type", `${result.taxType} @ ${result.taxRate}%`, "var(--n-primary)"],
                            ...(result.exemption > 0 ? [["LTCG Exemption", fmt(result.exemption), "#16a34a"]] : []),
                            ["Taxable Gain", fmtCr(result.taxableGain), ""],
                            ["Tax + 4% Cess", `−${fmt(result.totalTax)}`, "#dc2626"],
                            ...(result.exitLoad > 0 ? [["Exit Load (1%)", `−${fmt(result.exitLoad)}`, "#dc2626"]] : []),
                            ...(result.sec80cSaving > 0 ? [["Section 80C Saving", `+${fmt(result.sec80cSaving)}`, "#16a34a"]] : []),
                        ].map(([l, v, c], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "6px 4px" }}>{l}</td>
                                <td style={{ textAlign: "right", padding: "6px 4px", fontWeight: 600, color: c as string || undefined }}>{v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Comparative tax table */}
                <div style={{ marginTop: "var(--s-3)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, color: "var(--n-primary)" }}>📋 Tax Comparison Across Fund Types</div>
                    <table style={{ width: "100%", fontSize: "0.75rem", borderCollapse: "collapse" }}>
                        <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                            <th style={{ textAlign: "left", padding: "6px 4px" }}>Fund Type</th>
                            <th style={{ textAlign: "center", padding: "6px 4px" }}>STCG</th>
                            <th style={{ textAlign: "center", padding: "6px 4px" }}>LTCG</th>
                            <th style={{ textAlign: "center", padding: "6px 4px" }}>LTCG Threshold</th>
                        </tr></thead>
                        <tbody>
                            {[
                                ["Equity (≥65%)", "20% (<12mo)", "12.5% (>12mo)", "₹1.25L exempt"],
                                ["Debt (<35%)", "Slab rate", "Slab rate", "No exemption"],
                                ["Hybrid (≥65% eq)", "20% (<12mo)", "12.5% (>12mo)", "₹1.25L exempt"],
                                ["Hybrid (<65% eq)", "Slab (<24mo)", "12.5% (>24mo)", "No exemption"],
                                ["ELSS (80C)", "N/A (3yr lock)", "12.5% (>36mo)", "₹1.25L exempt"],
                            ].map(([fund, stcg, ltcg, thresh], i) => (
                                <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                    <td style={{ padding: "5px 4px", fontWeight: 600 }}>{fund}</td>
                                    <td style={{ textAlign: "center", padding: "5px 4px" }}>{stcg}</td>
                                    <td style={{ textAlign: "center", padding: "5px 4px" }}>{ltcg}</td>
                                    <td style={{ textAlign: "center", padding: "5px 4px" }}>{thresh}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
        const lumpsumNeeded = target / Math.pow(1 + rate / 100, years);
        const rm = rate / 12 / 100;
        const sipNeeded = target * rm / ((Math.pow(1 + rm, years * 12) - 1) * (1 + rm));
        const multiple = target / lumpsumNeeded;

        // Benchmark comparison
        const benchmarks = [
            { name: "Equity (12%)", lump: target / Math.pow(1.12, years), sip: target * (0.12 / 12 / 100) / ((Math.pow(1 + 0.12 / 12 / 100, years * 12) - 1) * (1 + 0.12 / 12 / 100)) },
            { name: "Balanced (10%)", lump: target / Math.pow(1.10, years), sip: target * (0.10 / 12 / 100) / ((Math.pow(1 + 0.10 / 12 / 100, years * 12) - 1) * (1 + 0.10 / 12 / 100)) },
            { name: "Debt (7%)", lump: target / Math.pow(1.07, years), sip: target * (0.07 / 12 / 100) / ((Math.pow(1 + 0.07 / 12 / 100, years * 12) - 1) * (1 + 0.07 / 12 / 100)) },
            { name: "FD (6.5%)", lump: target / Math.pow(1.065, years), sip: target * (0.065 / 12 / 100) / ((Math.pow(1 + 0.065 / 12 / 100, years * 12) - 1) * (1 + 0.065 / 12 / 100)) },
        ];
        return { lumpsumNeeded, sipNeeded, multiple, benchmarks };
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
            <InputRow label="Expected Return" value={rate} set={setRate} max={25} step={0.5} suffix="%" min={1}
                hint="Equity: 10–14%, Balanced: 8–10%, Debt: 6–8%" />

            {/* Primary results */}
            <div style={{ background: "var(--n-surface-alt)", borderRadius: 12, padding: "var(--s-4)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "var(--s-3)" }}>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--n-primary)", textTransform: "uppercase", letterSpacing: 1 }}>Lump Sum Today</div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "6px 0" }}>{fmtCr(result.lumpsumNeeded)}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)" }}>One-time investment</div>
                    </div>
                    <div style={{ background: "var(--n-surface)", borderRadius: 10, padding: 16, textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>Monthly SIP</div>
                        <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "var(--font-mono, monospace)", margin: "6px 0", color: "#16a34a" }}>{fmt(result.sipNeeded)}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--n-text-muted)" }}>For {years} years</div>
                    </div>
                </div>
                <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#16a34a", fontWeight: 700, marginBottom: "var(--s-3)" }}>
                    Money multiplies {result.multiple.toFixed(1)}x in {years} years at {rate}%
                </div>

                {/* Benchmark comparison */}
                <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: 8, color: "var(--n-primary)" }}>📋 Investment Required by Asset Class</div>
                <table style={{ width: "100%", fontSize: "0.78rem", borderCollapse: "collapse" }}>
                    <thead><tr style={{ borderBottom: "2px solid var(--n-border)" }}>
                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Asset Class</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Lump Sum</th>
                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Monthly SIP</th>
                    </tr></thead>
                    <tbody>
                        {result.benchmarks.map((b, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid var(--n-border)" }}>
                                <td style={{ padding: "5px 4px", fontWeight: 600 }}>{b.name}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px" }}>{fmtCr(b.lump)}</td>
                                <td style={{ textAlign: "right", padding: "5px 4px" }}>{fmt(b.sip)}/mo</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

/* ═══════ MAIN EXPORT ═══════ */
export default function MutualFundReturnsCalculatorCore() {
    const [mode, setMode] = useState<Mode>("returns");

    return (
        <div style={{ background: "var(--n-surface)", borderRadius: 16, border: "1px solid var(--n-border)", overflow: "hidden", marginBottom: "var(--s-6)" }}>
            <div style={{ padding: "var(--s-4) var(--s-5)", borderBottom: "1px solid var(--n-border)", background: "linear-gradient(135deg, var(--n-primary-light), var(--n-surface-alt))" }}>
                <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>📊 Mutual Fund Returns Calculator — India 2026</h2>
                <div style={{ fontSize: "0.82rem", color: "var(--n-text-muted)", marginTop: 4 }}>CAGR &amp; XIRR returns • Lump Sum vs SIP • LTCG/STCG tax impact • Goal reverse planner</div>
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
                {mode === "tax" && <TaxMode />}
                {mode === "goal" && <GoalMode />}
            </div>
        </div>
    );
}

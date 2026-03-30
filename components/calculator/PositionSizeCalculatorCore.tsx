"use client";

import { useState, useMemo } from "react";

type CalcMode = "basic" | "fno" | "rr" | "kelly";

function fmt(n: number): string {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
function fmt2(n: number): string {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

const CAPITAL_PRESETS = [100000, 200000, 500000, 1000000, 2500000];

interface FnoIndex {
    label: string;
    lotSize: number;
    approxPrice: number;
}

const FNO_INDICES: FnoIndex[] = [
    { label: "Nifty 50", lotSize: 65, approxPrice: 24000 },
    { label: "Bank Nifty", lotSize: 30, approxPrice: 50000 },
    { label: "Nifty Financial Services", lotSize: 60, approxPrice: 26000 },
    { label: "Nifty Midcap Select", lotSize: 120, approxPrice: 12500 },
    { label: "Nifty Next 50", lotSize: 25, approxPrice: 70000 },
    { label: "BSE Sensex", lotSize: 20, approxPrice: 78000 },
    { label: "Stock F&O (Custom)", lotSize: 1, approxPrice: 500 },
];

export default function PositionSizeCalculatorCore() {
    const [mode, setMode] = useState<CalcMode>("basic");

    /* ── Mode 1: Basic ── */
    const [capital, setCapital] = useState(500000);
    const [riskPct, setRiskPct] = useState(1);
    const [entryPrice, setEntryPrice] = useState(1000);
    const [stopLoss, setStopLoss] = useState(950);
    const [showCosts, setShowCosts] = useState(false);
    const [tradeType, setTradeType] = useState<"delivery" | "intraday">("intraday");

    /* ── Mode 2: F&O ── */
    const [fnoIdx, setFnoIdx] = useState(0);
    const [fnoCapital, setFnoCapital] = useState(1000000);
    const [fnoRiskPct, setFnoRiskPct] = useState(1);
    const [fnoEntry, setFnoEntry] = useState(24000);
    const [fnoSL, setFnoSL] = useState(23800);
    const [customLot, setCustomLot] = useState(50);

    /* ── Mode 3: Risk-Reward ── */
    const [rrEntry, setRrEntry] = useState(1000);
    const [rrSL, setRrSL] = useState(950);
    const [rrTarget, setRrTarget] = useState(1100);
    const [rrCapital, setRrCapital] = useState(500000);
    const [rrRiskPct, setRrRiskPct] = useState(1);

    /* ── Mode 4: Kelly ── */
    const [winRate, setWinRate] = useState(55);
    const [avgWin, setAvgWin] = useState(3);
    const [avgLoss, setAvgLoss] = useState(1.5);
    const [kellyCapital, setKellyCapital] = useState(500000);
    const [kellyEntry, setKellyEntry] = useState(1000);

    /* ═══════ BASIC CALC ═══════ */
    const basicResult = useMemo(() => {
        const riskAmount = capital * (riskPct / 100);
        const riskPerShare = Math.abs(entryPrice - stopLoss);
        if (riskPerShare === 0) return null;
        const shares = Math.floor(riskAmount / riskPerShare);
        if (shares <= 0) return null;
        const investmentAmount = shares * entryPrice;
        const potentialRisk = shares * riskPerShare;
        const capitalUtil = (investmentAmount / capital) * 100;

        // Trading costs calculation
        let sttBuy = 0, sttSell = 0, gst = 0, sebiCharge = 0, stampDuty = 0;
        const brokerage = 40; // flat ₹20 per order × 2 sides (typical discount broker)
        if (tradeType === "delivery") {
            sttBuy = investmentAmount * 0.001;
            sttSell = investmentAmount * 0.001;
            stampDuty = investmentAmount * 0.00015;
        } else {
            sttSell = investmentAmount * 0.00025;
            stampDuty = investmentAmount * 0.00003;
        }
        sebiCharge = (investmentAmount / 10000000) * 10; // ₹10 per crore
        gst = (brokerage + sebiCharge) * 0.18;
        const totalCosts = sttBuy + sttSell + gst + sebiCharge + stampDuty + brokerage;

        return {
            shares,
            investmentAmount,
            potentialRisk,
            riskPerShare,
            capitalUtil: Math.min(capitalUtil, 100),
            riskAmount,
            costs: { sttBuy, sttSell, gst, sebiCharge, stampDuty, brokerage, total: totalCosts },
        };
    }, [capital, riskPct, entryPrice, stopLoss, tradeType]);

    /* ═══════ F&O CALC ═══════ */
    const fnoResult = useMemo(() => {
        const idx = FNO_INDICES[fnoIdx];
        const lotSize = fnoIdx === 6 ? customLot : idx.lotSize;
        const riskAmount = fnoCapital * (fnoRiskPct / 100);
        const riskPerUnit = Math.abs(fnoEntry - fnoSL);
        if (riskPerUnit === 0 || lotSize === 0) return null;
        const riskPerLot = riskPerUnit * lotSize;
        const lots = Math.floor(riskAmount / riskPerLot);
        if (lots <= 0) return null;
        const totalQty = lots * lotSize;
        const investmentValue = totalQty * fnoEntry;
        const actualRisk = lots * riskPerLot;
        const approxMargin = investmentValue * 0.15; // ~15% margin for futures

        return {
            lots,
            lotSize,
            totalQty,
            investmentValue,
            actualRisk,
            riskPerLot,
            riskPerUnit,
            approxMargin,
            indexLabel: idx.label,
        };
    }, [fnoIdx, fnoCapital, fnoRiskPct, fnoEntry, fnoSL, customLot]);

    /* ═══════ RISK-REWARD CALC ═══════ */
    const rrResult = useMemo(() => {
        const riskPerShare = Math.abs(rrEntry - rrSL);
        const rewardPerShare = Math.abs(rrTarget - rrEntry);
        if (riskPerShare === 0) return null;
        const ratio = rewardPerShare / riskPerShare;
        const riskAmount = rrCapital * (rrRiskPct / 100);
        const shares = Math.floor(riskAmount / riskPerShare);
        if (shares <= 0) return null;
        const potentialProfit = shares * rewardPerShare;
        const potentialLoss = shares * riskPerShare;
        const investmentAmount = shares * rrEntry;
        // Required win rate for breakeven at this RR ratio
        const reqWinRate = ratio > 0 ? (1 / (1 + ratio)) * 100 : 100;

        let ratingLabel = "Poor";
        let ratingColor = "#ef4444";
        if (ratio >= 3) { ratingLabel = "Excellent"; ratingColor = "#16a34a"; }
        else if (ratio >= 2) { ratingLabel = "Good"; ratingColor = "#3b82f6"; }
        else if (ratio >= 1) { ratingLabel = "Fair"; ratingColor = "#f59e0b"; }

        return {
            ratio,
            shares,
            potentialProfit,
            potentialLoss,
            investmentAmount,
            reqWinRate,
            ratingLabel,
            ratingColor,
            riskPerShare,
            rewardPerShare,
        };
    }, [rrEntry, rrSL, rrTarget, rrCapital, rrRiskPct]);

    /* ═══════ KELLY CALC ═══════ */
    const kellyResult = useMemo(() => {
        const p = winRate / 100;
        const q = 1 - p;
        const b = avgWin / avgLoss;
        if (b === 0) return null;
        const kellyPct = ((p * b - q) / b) * 100;
        const halfKelly = kellyPct / 2;
        const quarterKelly = kellyPct / 4;

        const fullStake = kellyCapital * (Math.max(0, kellyPct) / 100);
        const halfStake = kellyCapital * (Math.max(0, halfKelly) / 100);
        const quarterStake = kellyCapital * (Math.max(0, quarterKelly) / 100);

        const fullShares = kellyEntry > 0 ? Math.floor(fullStake / kellyEntry) : 0;
        const halfShares = kellyEntry > 0 ? Math.floor(halfStake / kellyEntry) : 0;
        const quarterShares = kellyEntry > 0 ? Math.floor(quarterStake / kellyEntry) : 0;

        return {
            kellyPct: Math.max(0, kellyPct),
            halfKelly: Math.max(0, halfKelly),
            quarterKelly: Math.max(0, quarterKelly),
            fullStake,
            halfStake,
            quarterStake,
            fullShares,
            halfShares,
            quarterShares,
            isNegative: kellyPct < 0,
        };
    }, [winRate, avgWin, avgLoss, kellyCapital, kellyEntry]);

    const tabStyle = (m: CalcMode) => mode === m ? { background: "#d4620a", color: "#fff", borderColor: "#d4620a" } : {};

    const riskLevelColor = (pct: number) => {
        if (pct <= 1) return "#16a34a";
        if (pct <= 2) return "#3b82f6";
        if (pct <= 5) return "#f59e0b";
        return "#ef4444";
    };

    const riskLevelLabel = (pct: number) => {
        if (pct <= 1) return "Conservative";
        if (pct <= 2) return "Moderate";
        if (pct <= 5) return "Aggressive";
        return "Very High Risk";
    };

    return (
        <div className="con-calc" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 className="con-calc__title">📊 Position Size Calculator — India</h3>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                {([["basic", "📐 Basic Position Sizer"], ["fno", "📈 F&O Lot Calculator"], ["rr", "🎯 Risk-Reward Analyser"], ["kelly", "🧮 Kelly Criterion"]] as [CalcMode, string][]).map(([m, label]) => (
                    <button key={m} className="calc-tab-btn" onClick={() => setMode(m)} style={tabStyle(m)}>{label}</button>
                ))}
            </div>

            {/* ═══════ MODE: BASIC ═══════ */}
            {mode === "basic" && (
                <>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {CAPITAL_PRESETS.map((p) => (
                            <button key={p} className="calc-tab-btn" onClick={() => setCapital(p)}
                                style={capital === p ? { background: "rgba(212,98,10,0.1)", borderColor: "#d4620a", color: "#d4620a", fontWeight: 700, fontSize: "0.78rem", padding: "4px 10px" } : { fontSize: "0.78rem", padding: "4px 10px" }}>
                                ₹{p >= 100000 ? `${p / 100000}L` : fmt(p)}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Total Capital (₹)</label>
                            <input type="number" className="con-input__field" value={capital} onChange={(e) => setCapital(Math.max(1000, Number(e.target.value)))} min={1000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Risk per Trade (%)</label>
                            <input type="number" className="con-input__field" value={riskPct} onChange={(e) => setRiskPct(Math.max(0.1, Math.min(100, Number(e.target.value))))} step={0.5} min={0.1} max={100} />
                            <div style={{ fontSize: "0.7rem", color: riskLevelColor(riskPct), marginTop: "2px", fontWeight: 600 }}>{riskLevelLabel(riskPct)}</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Entry Price (₹)</label>
                            <input type="number" className="con-input__field" value={entryPrice} onChange={(e) => setEntryPrice(Math.max(0.01, Number(e.target.value)))} min={0.01} step={0.05} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Stop-Loss Price (₹)</label>
                            <input type="number" className="con-input__field" value={stopLoss} onChange={(e) => setStopLoss(Math.max(0.01, Number(e.target.value)))} min={0.01} step={0.05} />
                        </div>
                    </div>

                    {basicResult && (
                        <div className="con-calc__results">
                            <h4>Position Size Result</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(22,163,74,0.05)", border: "2px solid rgba(22,163,74,0.3)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Shares to Buy</div>
                                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>{fmt(basicResult.shares)}</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(212,98,10,0.05)", border: "1px solid rgba(212,98,10,0.2)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Investment Amount</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d4620a" }}>₹{fmt(basicResult.investmentAmount)}</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Potential Risk</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>₹{fmt(basicResult.potentialRisk)}</div>
                                </div>
                            </div>

                            <div className="con-result-row"><span className="con-result-row__label">Risk Amount (from capital)</span><span className="con-result-row__value" style={{ color: "#ef4444" }}>₹{fmt(basicResult.riskAmount)} ({riskPct}%)</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Risk per Share</span><span className="con-result-row__value">₹{fmt2(basicResult.riskPerShare)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Capital Utilisation</span><span className="con-result-row__value">{basicResult.capitalUtil.toFixed(1)}%</span></div>

                            {/* Risk Level Bar */}
                            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
                                <div style={{ fontSize: "0.72rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-muted)" }}>RISK LEVEL</div>
                                <div style={{ height: 10, borderRadius: 5, background: "linear-gradient(90deg, #16a34a 0%, #16a34a 20%, #3b82f6 20%, #3b82f6 40%, #f59e0b 40%, #f59e0b 60%, #ef4444 60%, #ef4444 100%)", position: "relative" }}>
                                    <div style={{
                                        position: "absolute", top: -3, width: 6, height: 16, background: "#fff", borderRadius: 3,
                                        border: "2px solid #333", left: `${Math.min(riskPct * 10, 98)}%`, transition: "left 0.3s ease",
                                    }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "4px" }}>
                                    <span>Conservative (≤1%)</span><span>Moderate (1–2%)</span><span>Aggressive (2–5%)</span><span>High (&gt;5%)</span>
                                </div>
                            </div>

                            {/* Trading Costs Toggle */}
                            <div style={{ marginTop: "16px" }}>
                                <button className="calc-tab-btn" onClick={() => setShowCosts(!showCosts)}
                                    style={{ fontSize: "0.78rem", padding: "6px 12px", background: showCosts ? "rgba(212,98,10,0.1)" : undefined, borderColor: showCosts ? "#d4620a" : undefined, color: showCosts ? "#d4620a" : undefined }}>
                                    {showCosts ? "▾" : "▸"} Trading Cost Breakdown (STT, GST, SEBI)
                                </button>
                                {showCosts && (
                                    <div style={{ marginTop: "10px", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.82rem" }}>
                                        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                                            {(["delivery", "intraday"] as const).map((t) => (
                                                <button key={t} className="calc-tab-btn" onClick={() => setTradeType(t)}
                                                    style={tradeType === t ? { background: "rgba(212,98,10,0.1)", borderColor: "#d4620a", color: "#d4620a", fontWeight: 700, fontSize: "0.75rem", padding: "3px 10px" } : { fontSize: "0.75rem", padding: "3px 10px" }}>
                                                    {t === "delivery" ? "Delivery" : "Intraday"}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="con-result-row"><span className="con-result-row__label">STT (Buy side)</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.sttBuy)}</span></div>
                                        <div className="con-result-row"><span className="con-result-row__label">STT (Sell side)</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.sttSell)}</span></div>
                                        <div className="con-result-row"><span className="con-result-row__label">Brokerage (₹20 × 2)</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.brokerage)}</span></div>
                                        <div className="con-result-row"><span className="con-result-row__label">GST (18% on brokerage + SEBI)</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.gst)}</span></div>
                                        <div className="con-result-row"><span className="con-result-row__label">SEBI Turnover Charges</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.sebiCharge)}</span></div>
                                        <div className="con-result-row"><span className="con-result-row__label">Stamp Duty</span><span className="con-result-row__value">₹{fmt2(basicResult.costs.stampDuty)}</span></div>
                                        <div className="con-result-row" style={{ borderTop: "2px solid var(--border)", paddingTop: "8px", marginTop: "4px" }}>
                                            <span className="con-result-row__label" style={{ fontWeight: 700 }}>Total Trading Costs</span>
                                            <span className="con-result-row__value" style={{ fontWeight: 700, color: "#ef4444" }}>₹{fmt2(basicResult.costs.total)}</span>
                                        </div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                                            Costs as % of risk: <strong>{basicResult.potentialRisk > 0 ? ((basicResult.costs.total / basicResult.potentialRisk) * 100).toFixed(2) : 0}%</strong>. Based on discount broker (₹20/order). STT rates effective April 2026.
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginTop: "16px" }}>
                                <strong>Formula:</strong> Shares = Risk Amount ÷ Risk per Share = ₹{fmt(basicResult.riskAmount)} ÷ ₹{fmt2(basicResult.riskPerShare)} = <strong>{fmt(basicResult.shares)} shares</strong>.
                                Your ₹{fmt(capital)} capital at {riskPct}% risk means you can lose a maximum of ₹{fmt(basicResult.riskAmount)} on this trade.
                            </div>
                        </div>
                    )}
                    {!basicResult && entryPrice > 0 && stopLoss > 0 && (
                        <div className="explanation__highlight" style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                            ⚠️ Entry price and stop-loss cannot be the same. The risk per share must be greater than zero.
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: F&O LOT CALCULATOR ═══════ */}
            {mode === "fno" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Index / Segment</label>
                            <select className="con-input__field" value={fnoIdx} onChange={(e) => {
                                const i = Number(e.target.value);
                                setFnoIdx(i);
                                if (i < 6) { setFnoEntry(FNO_INDICES[i].approxPrice); setFnoSL(Math.round(FNO_INDICES[i].approxPrice * 0.99)); }
                            }}>
                                {FNO_INDICES.map((idx, i) => (
                                    <option key={i} value={i}>{idx.label} {i < 6 ? `(Lot: ${idx.lotSize})` : ""}</option>
                                ))}
                            </select>
                        </div>
                        {fnoIdx === 6 && (
                            <div className="con-input">
                                <label className="con-input__label">Custom Lot Size</label>
                                <input type="number" className="con-input__field" value={customLot} onChange={(e) => setCustomLot(Math.max(1, Number(e.target.value)))} min={1} />
                            </div>
                        )}
                        <div className="con-input">
                            <label className="con-input__label">Trading Capital (₹)</label>
                            <input type="number" className="con-input__field" value={fnoCapital} onChange={(e) => setFnoCapital(Math.max(10000, Number(e.target.value)))} min={10000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Risk per Trade (%)</label>
                            <input type="number" className="con-input__field" value={fnoRiskPct} onChange={(e) => setFnoRiskPct(Math.max(0.1, Math.min(100, Number(e.target.value))))} step={0.5} min={0.1} max={100} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Entry Price (₹)</label>
                            <input type="number" className="con-input__field" value={fnoEntry} onChange={(e) => setFnoEntry(Math.max(1, Number(e.target.value)))} min={1} step={0.05} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Stop-Loss Price (₹)</label>
                            <input type="number" className="con-input__field" value={fnoSL} onChange={(e) => setFnoSL(Math.max(1, Number(e.target.value)))} min={1} step={0.05} />
                        </div>
                    </div>

                    {fnoResult && (
                        <div className="con-calc__results">
                            <h4>📈 F&O Position Size — {fnoResult.indexLabel}</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(22,163,74,0.05)", border: "2px solid rgba(22,163,74,0.3)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Lots to Trade</div>
                                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#16a34a" }}>{fnoResult.lots}</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{fmt(fnoResult.totalQty)} units</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(212,98,10,0.05)", border: "1px solid rgba(212,98,10,0.2)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Contract Value</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#d4620a" }}>₹{fmt(fnoResult.investmentValue)}</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Actual Risk</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>₹{fmt(fnoResult.actualRisk)}</div>
                                </div>
                            </div>
                            <div className="con-result-row"><span className="con-result-row__label">Lot Size</span><span className="con-result-row__value">{fnoResult.lotSize} units/lot</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Risk per Lot</span><span className="con-result-row__value">₹{fmt(fnoResult.riskPerLot)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Risk per Unit</span><span className="con-result-row__value">₹{fmt2(fnoResult.riskPerUnit)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Approx. Margin Required (Futures)</span><span className="con-result-row__value">₹{fmt(fnoResult.approxMargin)}</span></div>

                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginTop: "16px" }}>
                                <strong>F&O Note:</strong> Futures and Options on NSE must be traded in fixed lot sizes mandated by the exchange. You cannot buy partial lots.
                                At {fnoRiskPct}% risk on ₹{fmt(fnoCapital)} capital, your risk amount is ₹{fmt(fnoCapital * fnoRiskPct / 100)}.
                                Each lot risks ₹{fmt(fnoResult.riskPerLot)}, so you can trade <strong>{fnoResult.lots} lot{fnoResult.lots > 1 ? "s" : ""}</strong>.
                            </div>

                            {/* NSE Lot Sizes Reference */}
                            <details style={{ marginTop: "12px" }}>
                                <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", marginBottom: "8px", color: "#d4620a" }}>📋 NSE F&O Lot Sizes — January 2026</summary>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                                        <thead><tr style={{ background: "#d4620a", color: "#fff" }}>
                                            <th style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", textAlign: "left" }}>Index</th>
                                            <th style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Lot Size</th>
                                            <th style={{ padding: "10px 12px", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", textAlign: "right" }}>Approx. Value</th>
                                        </tr></thead>
                                        <tbody>
                                            {FNO_INDICES.slice(0, 6).map((idx, i) => (
                                                <tr key={i} style={i % 2 === 1 ? { background: "rgba(255,153,51,0.03)" } : {}}>
                                                    <td style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)", fontWeight: fnoIdx === i ? 700 : 400 }}>{idx.label}</td>
                                                    <td style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>{idx.lotSize}</td>
                                                    <td style={{ padding: "6px 12px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>₹{fmt(idx.lotSize * idx.approxPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px" }}>
                                    SEBI mandates contract values between ₹15–20L at introduction. Stock F&O lot sizes vary — check NSE circulars for the current lot size file.
                                </div>
                            </details>
                        </div>
                    )}
                    {!fnoResult && fnoEntry > 0 && fnoSL > 0 && fnoEntry !== fnoSL && (
                        <div className="explanation__highlight" style={{ fontSize: "0.85rem", color: "#f59e0b" }}>
                            ⚠️ Your risk amount (₹{fmt(fnoCapital * fnoRiskPct / 100)}) is less than the risk per lot (₹{fmt(Math.abs(fnoEntry - fnoSL) * (fnoIdx === 6 ? customLot : FNO_INDICES[fnoIdx].lotSize))}). Increase capital, increase risk %, or reduce stop-loss distance.
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: RISK-REWARD ═══════ */}
            {mode === "rr" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Entry Price (₹)</label>
                            <input type="number" className="con-input__field" value={rrEntry} onChange={(e) => setRrEntry(Math.max(0.01, Number(e.target.value)))} min={0.01} step={0.05} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Stop-Loss (₹)</label>
                            <input type="number" className="con-input__field" value={rrSL} onChange={(e) => setRrSL(Math.max(0.01, Number(e.target.value)))} min={0.01} step={0.05} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Target Price (₹)</label>
                            <input type="number" className="con-input__field" value={rrTarget} onChange={(e) => setRrTarget(Math.max(0.01, Number(e.target.value)))} min={0.01} step={0.05} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Capital (₹)</label>
                            <input type="number" className="con-input__field" value={rrCapital} onChange={(e) => setRrCapital(Math.max(1000, Number(e.target.value)))} min={1000} />
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Risk (%)</label>
                            <input type="number" className="con-input__field" value={rrRiskPct} onChange={(e) => setRrRiskPct(Math.max(0.1, Math.min(100, Number(e.target.value))))} step={0.5} min={0.1} max={100} />
                        </div>
                    </div>

                    {rrResult && (
                        <div className="con-calc__results">
                            <h4>🎯 Risk-Reward Analysis</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "20px", borderRadius: "12px", border: `2px solid ${rrResult.ratingColor}`, textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Risk-Reward Ratio</div>
                                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: rrResult.ratingColor }}>1 : {rrResult.ratio.toFixed(1)}</div>
                                    <div style={{
                                        display: "inline-block", marginTop: "6px", padding: "3px 12px", borderRadius: "20px",
                                        background: rrResult.ratingColor, color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                                    }}>{rrResult.ratingLabel}</div>
                                </div>
                                <div style={{ padding: "20px", borderRadius: "12px", border: "1px solid var(--border)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700, marginBottom: "4px" }}>Shares to Buy</div>
                                    <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#16a34a" }}>{fmt(rrResult.shares)}</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>Invest ₹{fmt(rrResult.investmentAmount)}</div>
                                </div>
                            </div>

                            {/* Risk vs Reward Visual Bar */}
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", height: "28px" }}>
                                    <div style={{ flex: 1, background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 700, minWidth: "60px" }}>
                                        Risk: ₹{fmt(rrResult.potentialLoss)}
                                    </div>
                                    <div style={{ flex: rrResult.ratio, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.72rem", fontWeight: 700, minWidth: "80px" }}>
                                        Reward: ₹{fmt(rrResult.potentialProfit)}
                                    </div>
                                </div>
                            </div>

                            <div className="con-result-row"><span className="con-result-row__label">Risk per Share</span><span className="con-result-row__value">₹{fmt2(rrResult.riskPerShare)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Reward per Share</span><span className="con-result-row__value" style={{ color: "#16a34a" }}>₹{fmt2(rrResult.rewardPerShare)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Required Win Rate for Breakeven</span><span className="con-result-row__value">{rrResult.reqWinRate.toFixed(1)}%</span></div>

                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginTop: "16px" }}>
                                <strong>Insight:</strong> With a {rrResult.ratio.toFixed(1)}:1 risk-reward ratio, you only need to win <strong>{rrResult.reqWinRate.toFixed(0)}%</strong> of your trades to break even.
                                If you have a win rate above {rrResult.reqWinRate.toFixed(0)}%, this trade setup is statistically profitable over many trades.
                                {rrResult.ratio >= 2 ? " ✅ This is a favourable setup — most professional traders aim for 1:2 or better." : rrResult.ratio >= 1 ? " ⚠️ Acceptable, but aim for 1:2 or better for better risk management." : " ❌ Below 1:1 — the risk is greater than the reward. Consider widening your target or tightening your stop-loss."}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════ MODE: KELLY CRITERION ═══════ */}
            {mode === "kelly" && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Win Rate (%)</label>
                            <input type="number" className="con-input__field" value={winRate} onChange={(e) => setWinRate(Math.max(1, Math.min(99, Number(e.target.value))))} min={1} max={99} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Your historical win %</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Avg Win (% or ₹)</label>
                            <input type="number" className="con-input__field" value={avgWin} onChange={(e) => setAvgWin(Math.max(0.1, Number(e.target.value)))} step={0.5} min={0.1} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Avg profit per winning trade</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Avg Loss (% or ₹)</label>
                            <input type="number" className="con-input__field" value={avgLoss} onChange={(e) => setAvgLoss(Math.max(0.1, Number(e.target.value)))} step={0.5} min={0.1} />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>Avg loss per losing trade</div>
                        </div>
                        <div className="con-input">
                            <label className="con-input__label">Total Capital (₹)</label>
                            <input type="number" className="con-input__field" value={kellyCapital} onChange={(e) => setKellyCapital(Math.max(1000, Number(e.target.value)))} min={1000} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "16px", maxWidth: "250px" }}>
                        <div className="con-input">
                            <label className="con-input__label">Stock Price (₹) — for shares calc</label>
                            <input type="number" className="con-input__field" value={kellyEntry} onChange={(e) => setKellyEntry(Math.max(1, Number(e.target.value)))} min={1} step={0.05} />
                        </div>
                    </div>

                    {kellyResult && !kellyResult.isNegative && (
                        <div className="con-calc__results">
                            <h4>🧮 Kelly Criterion Result</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.03)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#ef4444", fontWeight: 700, marginBottom: "4px" }}>⚠️ Full Kelly</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ef4444" }}>{kellyResult.kellyPct.toFixed(1)}%</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>₹{fmt(kellyResult.fullStake)} · {fmt(kellyResult.fullShares)} shares</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "2px solid rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.03)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#3b82f6", fontWeight: 700, marginBottom: "4px" }}>✅ Half Kelly (Recommended)</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#3b82f6" }}>{kellyResult.halfKelly.toFixed(1)}%</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>₹{fmt(kellyResult.halfStake)} · {fmt(kellyResult.halfShares)} shares</div>
                                </div>
                                <div style={{ padding: "16px", borderRadius: "12px", border: "1px solid rgba(22,163,74,0.2)", background: "rgba(22,163,74,0.03)", textAlign: "center" }}>
                                    <div style={{ fontSize: "0.68rem", textTransform: "uppercase", color: "#16a34a", fontWeight: 700, marginBottom: "4px" }}>🛡️ Quarter Kelly (Safe)</div>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>{kellyResult.quarterKelly.toFixed(1)}%</div>
                                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>₹{fmt(kellyResult.quarterStake)} · {fmt(kellyResult.quarterShares)} shares</div>
                                </div>
                            </div>

                            <div className="con-result-row"><span className="con-result-row__label">Win-Loss Ratio (b)</span><span className="con-result-row__value">{(avgWin / avgLoss).toFixed(2)}</span></div>
                            <div className="con-result-row"><span className="con-result-row__label">Kelly Formula</span><span className="con-result-row__value">f* = (p×b − q) / b</span></div>

                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", marginTop: "16px" }}>
                                <strong>⚠️ Important:</strong> Full Kelly is mathematically optimal for maximum long-term growth, but it causes <strong>extreme drawdowns</strong> in practice.
                                Most professional traders use <strong>Half Kelly (50%)</strong> or <strong>Quarter Kelly (25%)</strong> for smoother returns. Never use full Kelly on live capital.
                                The Kelly Criterion assumes your win rate and payoff estimates are accurate — if they&apos;re uncertain, use Quarter Kelly.
                            </div>
                        </div>
                    )}
                    {kellyResult && kellyResult.isNegative && (
                        <div className="con-calc__results">
                            <div className="explanation__highlight" style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                                <strong>❌ Negative Edge:</strong> The Kelly Criterion suggests <strong>0% allocation</strong> for this strategy.
                                A win rate of {winRate}% with a {(avgWin / avgLoss).toFixed(1)}:1 win-loss ratio does not have a positive expected value.
                                You should <strong>not trade this strategy</strong> — improve your win rate or win-loss ratio first.
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

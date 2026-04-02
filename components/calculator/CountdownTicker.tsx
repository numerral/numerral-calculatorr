"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTickerProps {
    targetDate?: Date;
    label?: string;
    showInputs?: boolean;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function CountdownTicker({ targetDate: initialTarget, label, showInputs = true }: CountdownTickerProps) {
    const [target, setTarget] = useState<Date | null>(initialTarget ?? null);
    const [diff, setDiff] = useState<{ d: number; h: number; m: number; s: number; total: number } | null>(null);
    const [dateVal, setDateVal] = useState("");
    const [timeVal, setTimeVal] = useState("");
    const [started, setStarted] = useState(!!initialTarget);

    const compute = useCallback(() => {
        if (!target) return;
        const now = new Date();
        const ms = target.getTime() - now.getTime();
        if (ms <= 0) { setDiff({ d: 0, h: 0, m: 0, s: 0, total: 0 }); return; }
        const totalSec = Math.floor(ms / 1000);
        const d = Math.floor(totalSec / 86400);
        const h = Math.floor((totalSec % 86400) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        setDiff({ d, h, m, s, total: totalSec });
    }, [target]);

    useEffect(() => {
        if (!started || !target) return;
        compute();
        const id = setInterval(compute, 1000);
        return () => clearInterval(id);
    }, [started, target, compute]);

    const handleStart = () => {
        if (!dateVal) return;
        const t = timeVal || "00:00";
        const d = new Date(`${dateVal}T${t}`);
        if (isNaN(d.getTime())) return;
        setTarget(d);
        setStarted(true);
    };

    const boxStyle: React.CSSProperties = {
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "var(--n-surface-alt)", borderRadius: "var(--r-md)",
        padding: "var(--s-4) var(--s-5)", minWidth: 80, flex: 1,
    };
    const numStyle: React.CSSProperties = {
        fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 800,
        fontVariantNumeric: "tabular-nums", lineHeight: 1, color: "var(--n-primary)",
    };
    const lblStyle: React.CSSProperties = {
        fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)",
        textTransform: "uppercase", letterSpacing: "0.05em",
    };

    return (
        <div>
            {/* Input form */}
            {showInputs && (
                <div style={{
                    display: "flex", gap: "var(--s-3)", flexWrap: "wrap", alignItems: "flex-end",
                    marginBottom: "var(--s-5)", padding: "var(--s-4)", borderRadius: "var(--r-md)",
                    background: "var(--n-surface-alt)",
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-1)" }}>
                        <label htmlFor="cd-date" style={{ fontSize: "var(--t-body-sm)", fontWeight: 600 }}>Date</label>
                        <input id="cd-date" type="date" value={dateVal} onChange={(e) => setDateVal(e.target.value)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-sm)", border: "1px solid var(--n-border)", fontSize: "var(--t-body)" }}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-1)" }}>
                        <label htmlFor="cd-time" style={{ fontSize: "var(--t-body-sm)", fontWeight: 600 }}>Time <span style={{ fontWeight: 400, color: "var(--n-text-muted)" }}>(optional)</span></label>
                        <input id="cd-time" type="time" value={timeVal} onChange={(e) => setTimeVal(e.target.value)}
                            style={{ padding: "var(--s-2) var(--s-3)", borderRadius: "var(--r-sm)", border: "1px solid var(--n-border)", fontSize: "var(--t-body)" }}
                        />
                    </div>
                    <button onClick={handleStart} style={{
                        padding: "var(--s-2) var(--s-5)", borderRadius: "var(--r-sm)",
                        background: "var(--n-primary)", color: "#fff", fontWeight: 700,
                        border: "none", fontSize: "var(--t-body)", cursor: "pointer",
                    }}>
                        ⏱️ Start Countdown
                    </button>
                </div>
            )}

            {/* Label */}
            {label && (
                <p style={{ textAlign: "center", fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>
                    {label}
                </p>
            )}

            {/* Ticker display */}
            <div style={{
                display: "flex", gap: "var(--s-3)", justifyContent: "center",
                marginBottom: started ? "var(--s-2)" : 0,
            }}>
                <div style={boxStyle}><span style={numStyle}>{diff ? pad(diff.d) : "--"}</span><span style={lblStyle}>Days</span></div>
                <div style={boxStyle}><span style={numStyle}>{diff ? pad(diff.h) : "--"}</span><span style={lblStyle}>Hours</span></div>
                <div style={boxStyle}><span style={numStyle}>{diff ? pad(diff.m) : "--"}</span><span style={lblStyle}>Minutes</span></div>
                <div style={boxStyle}><span style={numStyle}>{diff ? pad(diff.s) : "--"}</span><span style={lblStyle}>Seconds</span></div>
            </div>

            {/* Status */}
            {diff && diff.total === 0 && (
                <p style={{ textAlign: "center", fontWeight: 700, color: "var(--n-success, #16a34a)", marginTop: "var(--s-3)", fontSize: "var(--t-h3)" }}>
                    🎉 The countdown has finished!
                </p>
            )}
        </div>
    );
}

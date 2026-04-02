"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function fmt(ms: number) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return { h, m, s, cs, display: `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}` };
}

export default function StopwatchComponent() {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const startTime = useRef(0);
    const rafRef = useRef<number | null>(null);
    const accum = useRef(0);

    const tick = useCallback(() => {
        const now = performance.now();
        setElapsed(accum.current + (now - startTime.current));
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        if (running) {
            startTime.current = performance.now();
            rafRef.current = requestAnimationFrame(tick);
        }
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [running, tick]);

    const handleStart = () => { setRunning(true); };
    const handleStop = () => { accum.current = elapsed; setRunning(false); };
    const handleLap = () => { setLaps((prev) => [elapsed, ...prev]); };
    const handleReset = () => { setRunning(false); setElapsed(0); accum.current = 0; setLaps([]); };

    const { display } = fmt(elapsed);

    const btnBase: React.CSSProperties = {
        padding: "var(--s-2) var(--s-5)", borderRadius: "var(--r-sm)",
        border: "none", fontWeight: 700, fontSize: "var(--t-body)", cursor: "pointer",
    };

    return (
        <div>
            {/* Display */}
            <div style={{ textAlign: "center", marginBottom: "var(--s-5)" }}>
                <span style={{
                    fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 800,
                    fontVariantNumeric: "tabular-nums", lineHeight: 1, color: "var(--n-primary)",
                    fontFamily: "monospace",
                }}>
                    {display}
                </span>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--s-5)" }}>
                {!running && elapsed === 0 && <button onClick={handleStart} style={{ ...btnBase, background: "var(--n-primary)", color: "#fff" }}>▶ Start</button>}
                {running && <button onClick={handleStop} style={{ ...btnBase, background: "var(--n-danger, #dc2626)", color: "#fff" }}>⏹ Stop</button>}
                {running && <button onClick={handleLap} style={{ ...btnBase, background: "var(--n-surface-alt)", color: "var(--n-text)" }}>🏁 Lap</button>}
                {!running && elapsed > 0 && <button onClick={handleStart} style={{ ...btnBase, background: "var(--n-primary)", color: "#fff" }}>▶ Resume</button>}
                {!running && elapsed > 0 && <button onClick={handleReset} style={{ ...btnBase, background: "var(--n-surface-alt)", color: "var(--n-text)" }}>↺ Reset</button>}
            </div>

            {/* Laps */}
            {laps.length > 0 && (
                <div style={{ maxHeight: 300, overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={{ textAlign: "left", padding: "var(--s-2) var(--s-3)", borderBottom: "1px solid var(--n-border)", fontSize: "var(--t-body-sm)" }}>Lap</th>
                            <th style={{ textAlign: "right", padding: "var(--s-2) var(--s-3)", borderBottom: "1px solid var(--n-border)", fontSize: "var(--t-body-sm)" }}>Split</th>
                            <th style={{ textAlign: "right", padding: "var(--s-2) var(--s-3)", borderBottom: "1px solid var(--n-border)", fontSize: "var(--t-body-sm)" }}>Total</th>
                        </tr></thead>
                        <tbody>
                            {laps.map((lapTime, i) => {
                                const prev = laps[i + 1] || 0;
                                const split = lapTime - prev;
                                return (
                                    <tr key={i} style={{ background: i % 2 === 0 ? "var(--n-surface-alt)" : "transparent" }}>
                                        <td style={{ padding: "var(--s-2) var(--s-3)", fontWeight: 600 }}>#{laps.length - i}</td>
                                        <td style={{ padding: "var(--s-2) var(--s-3)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(split).display}</td>
                                        <td style={{ padding: "var(--s-2) var(--s-3)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(lapTime).display}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

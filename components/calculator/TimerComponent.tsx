"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TimerComponentProps {
    initialHours?: number;
    initialMinutes?: number;
    initialSeconds?: number;
    autoStart?: boolean;
    label?: string;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function TimerComponent({ initialHours = 0, initialMinutes = 0, initialSeconds = 0, autoStart = false, label }: TimerComponentProps) {
    const totalInit = initialHours * 3600 + initialMinutes * 60 + initialSeconds;
    const [hours, setHours] = useState(initialHours);
    const [minutes, setMinutes] = useState(initialMinutes);
    const [seconds, setSeconds] = useState(initialSeconds);
    const [remaining, setRemaining] = useState(totalInit);
    const [running, setRunning] = useState(autoStart);
    const [started, setStarted] = useState(autoStart);
    const [finished, setFinished] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdHmFi4yMi4eCeXBpc3yEi46NjIqGf3Zuc3yFi46NjImFfnVrb3mDi46OjYqGf3VsbnqDi4+OjYuHgXdtb3qDi4+OjYuHgHZscXuEjI+PjYuHgHZscHuFjJCPjouHf3Zrb3mDi4+OjYuHgHZscHuEjI+PjYuHf3Zrb3mDi4+OjYuHgHZscHuEjI+PjYuHf3Zrb3mDi4+OjYuHgHZscXuEjI+PjYuHgHZscHuEjI+PjYuHf3Zrb3mDi4+OjYuHgHZscXuEjI+PjYuHgHZscHuEjI+PjYuH");
        }
    }, []);

    const tickDown = useCallback(() => {
        setRemaining((prev) => {
            if (prev <= 1) {
                setRunning(false);
                setFinished(true);
                if (audioRef.current) { try { audioRef.current.play(); } catch {} }
                return 0;
            }
            return prev - 1;
        });
    }, []);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(tickDown, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, tickDown]);

    const handleStart = () => {
        const total = hours * 3600 + minutes * 60 + seconds;
        if (total <= 0) return;
        setRemaining(total);
        setRunning(true);
        setStarted(true);
        setFinished(false);
    };

    const handlePause = () => setRunning(false);
    const handleResume = () => { if (remaining > 0) { setRunning(true); setFinished(false); } };
    const handleReset = () => {
        setRunning(false);
        setStarted(false);
        setFinished(false);
        setRemaining(totalInit);
        setHours(initialHours);
        setMinutes(initialMinutes);
        setSeconds(initialSeconds);
    };

    const dispH = Math.floor(remaining / 3600);
    const dispM = Math.floor((remaining % 3600) / 60);
    const dispS = remaining % 60;

    const boxStyle: React.CSSProperties = {
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "var(--n-surface-alt)", borderRadius: "var(--r-md)",
        padding: "var(--s-4) var(--s-5)", minWidth: 80, flex: 1,
    };
    const numStyle: React.CSSProperties = {
        fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800,
        fontVariantNumeric: "tabular-nums", lineHeight: 1,
        color: finished ? "var(--n-success, #16a34a)" : "var(--n-primary)",
    };
    const lblStyle: React.CSSProperties = {
        fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)",
        textTransform: "uppercase", letterSpacing: "0.05em",
    };
    const btnBase: React.CSSProperties = {
        padding: "var(--s-2) var(--s-5)", borderRadius: "var(--r-sm)",
        border: "none", fontWeight: 700, fontSize: "var(--t-body)", cursor: "pointer",
    };

    return (
        <div>
            {label && <p style={{ textAlign: "center", fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginBottom: "var(--s-3)" }}>{label}</p>}

            {/* Input form — shown when not started */}
            {!started && !autoStart && (
                <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--s-4)", padding: "var(--s-4)", borderRadius: "var(--r-md)", background: "var(--n-surface-alt)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}>
                        <label style={{ fontSize: "var(--t-body-sm)", fontWeight: 600 }}>Hours</label>
                        <input type="number" min={0} max={99} value={hours} onChange={(e) => setHours(Math.max(0, +e.target.value))}
                            style={{ width: 70, textAlign: "center", padding: "var(--s-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--n-border)", fontSize: "var(--t-body)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}>
                        <label style={{ fontSize: "var(--t-body-sm)", fontWeight: 600 }}>Minutes</label>
                        <input type="number" min={0} max={59} value={minutes} onChange={(e) => setMinutes(Math.min(59, Math.max(0, +e.target.value)))}
                            style={{ width: 70, textAlign: "center", padding: "var(--s-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--n-border)", fontSize: "var(--t-body)" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-1)" }}>
                        <label style={{ fontSize: "var(--t-body-sm)", fontWeight: 600 }}>Seconds</label>
                        <input type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(Math.min(59, Math.max(0, +e.target.value)))}
                            style={{ width: 70, textAlign: "center", padding: "var(--s-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--n-border)", fontSize: "var(--t-body)" }} />
                    </div>
                </div>
            )}

            {/* Display */}
            <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", marginBottom: "var(--s-4)" }}>
                <div style={boxStyle}><span style={numStyle}>{pad(dispH)}</span><span style={lblStyle}>Hours</span></div>
                <div style={boxStyle}><span style={numStyle}>{pad(dispM)}</span><span style={lblStyle}>Minutes</span></div>
                <div style={boxStyle}><span style={numStyle}>{pad(dispS)}</span><span style={lblStyle}>Seconds</span></div>
            </div>

            {finished && <p style={{ textAlign: "center", fontWeight: 700, color: "var(--n-success, #16a34a)", fontSize: "var(--t-h3)", marginBottom: "var(--s-3)" }}>⏰ Time&apos;s up!</p>}

            {/* Controls */}
            <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", flexWrap: "wrap" }}>
                {!started && <button onClick={handleStart} style={{ ...btnBase, background: "var(--n-primary)", color: "#fff" }}>▶ Start</button>}
                {started && running && <button onClick={handlePause} style={{ ...btnBase, background: "var(--n-warning, #f59e0b)", color: "#fff" }}>⏸ Pause</button>}
                {started && !running && !finished && <button onClick={handleResume} style={{ ...btnBase, background: "var(--n-primary)", color: "#fff" }}>▶ Resume</button>}
                {started && <button onClick={handleReset} style={{ ...btnBase, background: "var(--n-surface-alt)", color: "var(--n-text)" }}>↺ Reset</button>}
            </div>
        </div>
    );
}

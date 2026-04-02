"use client";

import { useState, useEffect } from "react";

export default function DigitalClockWidget() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!time) return <div style={{ textAlign: "center", padding: "var(--s-5)" }}>Loading clock…</div>;

    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const pad = (n: number) => n.toString().padStart(2, "0");

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateStr = time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)", fontWeight: 800, fontFamily: "monospace", fontVariantNumeric: "tabular-nums", color: "var(--n-primary)", lineHeight: 1.1 }}>
                {pad(h12)}:{pad(m)}:{pad(s)} <span style={{ fontSize: "0.5em", color: "var(--n-text-muted)" }}>{ampm}</span>
            </div>
            <p style={{ fontSize: "var(--t-body)", marginTop: "var(--s-3)" }}>{dateStr}</p>
            <p style={{ fontSize: "var(--t-body-sm)", color: "var(--n-text-muted)", marginTop: "var(--s-1)" }}>24-hour: {pad(h)}:{pad(m)}:{pad(s)} • {tz}</p>
        </div>
    );
}

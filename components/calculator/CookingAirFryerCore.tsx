"use client";

import { useState } from "react";

export default function CookingAirFryerCore() {
    const [tempF, setTempF] = useState<number>(400);
    const [timeMin, setTimeMin] = useState<number>(20);

    const airFryerTemp = Math.max(0, tempF - 25);
    const airFryerTime = Math.max(1, Math.round(timeMin * 0.8));

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
                
                {/* Temp Input */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Conventional Oven Temperature</label>
                        <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{tempF}°F</span>
                    </div>
                    <div className="input-with-label" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input 
                            type="range" 
                            className="range-slider flex-1" 
                            min={200} max={500} step={5} 
                            value={tempF} 
                            onChange={(e) => setTempF(Number(e.target.value))} 
                        />
                        <input 
                            type="number" 
                            className="input-field" 
                            style={{ width: "90px" }}
                            min={200} max={500} 
                            value={tempF} 
                            onChange={(e) => setTempF(Number(e.target.value))} 
                        />
                    </div>
                </div>

                {/* Time Input */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Conventional Oven Time</label>
                        <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{timeMin} mins</span>
                    </div>
                    <div className="input-with-label" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input 
                            type="range" 
                            className="range-slider flex-1" 
                            min={1} max={180} step={1} 
                            value={timeMin} 
                            onChange={(e) => setTimeMin(Number(e.target.value))} 
                        />
                        <input 
                            type="number" 
                            className="input-field" 
                            style={{ width: "90px" }}
                            min={1} max={180} 
                            value={timeMin} 
                            onChange={(e) => setTimeMin(Number(e.target.value))} 
                        />
                    </div>
                </div>

            </div>

            {/* Results Panel */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)",
                border: "1px solid var(--n-border)",
                borderRadius: "var(--r-xl)", // Numerral styles
                padding: "var(--s-6)",
                marginTop: "var(--s-6)"
            }}>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-4)", color: "var(--primary-color)" }}>
                    Air Fryer Instructions
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div className="result-card" style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.875rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Temperature</div>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--n-text)" }}>{airFryerTemp}°F</div>
                    </div>
                    
                    <div className="result-card" style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.875rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Time</div>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--n-text)" }}>{airFryerTime} <span style={{ fontSize: "1rem" }}>mins</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

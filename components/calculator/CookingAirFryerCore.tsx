"use client";

import { useState, useMemo } from "react";

/* ── Conversion helpers ── */
function fToC(f: number): number { return Math.round((f - 32) * 5 / 9); }
function cToF(c: number): number { return Math.round(c * 9 / 5 + 32); }

export default function CookingAirFryerCore() {
    const [unit, setUnit] = useState<"F" | "C">("F");
    const [tempInput, setTempInput] = useState<number>(400); // always stored in °F internally
    const [timeMin, setTimeMin] = useState<number>(20);

    // Air fryer conversion: -25°F, ×0.8 time
    const ovenTempF = unit === "F" ? tempInput : cToF(tempInput);
    const airFryerTempF = Math.max(0, ovenTempF - 25);
    const airFryerTime = Math.max(1, Math.round(timeMin * 0.8));
    const timeSaved = timeMin - airFryerTime;

    // Display values
    const displayOvenTemp = unit === "F" ? ovenTempF : fToC(ovenTempF);
    const displayAirFryerTemp = unit === "F" ? airFryerTempF : fToC(airFryerTempF);

    // Dual display (always show both)
    const dualOvenTemp = unit === "F" 
        ? `${ovenTempF}°F (${fToC(ovenTempF)}°C)` 
        : `${fToC(ovenTempF)}°C (${ovenTempF}°F)`;
    const dualAirFryerTemp = unit === "F" 
        ? `${airFryerTempF}°F (${fToC(airFryerTempF)}°C)` 
        : `${fToC(airFryerTempF)}°C (${airFryerTempF}°F)`;

    const sliderMin = unit === "F" ? 200 : 93;
    const sliderMax = unit === "F" ? 500 : 260;
    const sliderStep = unit === "F" ? 5 : 5;

    const presets = unit === "F" 
        ? [325, 350, 375, 400, 425, 450] 
        : [165, 175, 190, 200, 220, 230];

    const applyPreset = (val: number) => {
        setTempInput(val);
    };

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>

                {/* Unit Toggle */}
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-1)" }}>
                    <button
                        onClick={() => { setUnit("F"); setTempInput(unit === "C" ? cToF(tempInput) : tempInput); }}
                        className={unit === "F" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        °F Fahrenheit
                    </button>
                    <button
                        onClick={() => { setUnit("C"); setTempInput(unit === "F" ? fToC(tempInput) : tempInput); }}
                        className={unit === "C" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        °C Celsius
                    </button>
                </div>

                {/* Temperature Input */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Conventional Oven Temperature</label>
                        <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{tempInput}°{unit}</span>
                    </div>
                    <div className="input-with-label" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input 
                            type="range" 
                            className="range-slider flex-1" 
                            min={sliderMin} max={sliderMax} step={sliderStep} 
                            value={tempInput} 
                            onChange={(e) => setTempInput(Number(e.target.value))} 
                        />
                        <input 
                            type="number" 
                            className="input-field" 
                            style={{ width: "90px" }}
                            min={sliderMin} max={sliderMax} 
                            value={tempInput} 
                            onChange={(e) => setTempInput(Number(e.target.value))} 
                        />
                    </div>
                    {/* Temperature Presets */}
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {presets.map(p => (
                            <button
                                key={p}
                                onClick={() => applyPreset(p)}
                                style={{
                                    padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600,
                                    borderRadius: "20px", border: "1px solid var(--n-border)",
                                    background: tempInput === p ? "var(--primary-color)" : "var(--n-surface)",
                                    color: tempInput === p ? "white" : "var(--n-text-secondary)",
                                    cursor: "pointer", transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => { if (tempInput !== p) { e.currentTarget.style.borderColor = "var(--primary-color)"; e.currentTarget.style.color = "var(--primary-color)"; }}}
                                onMouseLeave={(e) => { if (tempInput !== p) { e.currentTarget.style.borderColor = "var(--n-border)"; e.currentTarget.style.color = "var(--n-text-secondary)"; }}}
                            >
                                {p}°{unit}
                            </button>
                        ))}
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
                border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)",
                padding: "var(--s-6)",
                marginTop: "var(--s-6)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
                    <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: 0 }}>
                        Air Fryer Instructions
                    </h3>
                    <span style={{ background: "var(--primary-color)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                        −25° · −20% time
                    </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                    <div className="result-card" style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Temperature</div>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--n-text)" }}>
                            {displayAirFryerTemp}°{unit}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                            {unit === "F" ? `${fToC(airFryerTempF)}°C` : `${airFryerTempF}°F`}
                        </div>
                    </div>
                    
                    <div className="result-card" style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Time</div>
                        <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--n-text)" }}>{airFryerTime} <span style={{ fontSize: "1rem" }}>mins</span></div>
                        <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                            {timeSaved} min saved
                        </div>
                    </div>
                </div>

                {/* Conversion Summary */}
                <div style={{
                    marginTop: "var(--s-4)", padding: "var(--s-3)",
                    background: "var(--n-bg)", borderRadius: "var(--r-md)",
                    border: "1px solid var(--n-border)", fontSize: "0.875rem",
                    lineHeight: 1.6
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--n-text-muted)" }}>Oven Setting:</span>
                        <strong>{dualOvenTemp} for {timeMin} min</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--n-text-muted)" }}>Air Fryer Setting:</span>
                        <strong style={{ color: "var(--primary-color)" }}>{dualAirFryerTemp} for {airFryerTime} min</strong>
                    </div>
                </div>
            </div>
        </div>
    );
}

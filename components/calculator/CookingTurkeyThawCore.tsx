"use client";

import React, { useState, useMemo } from "react";

type Unit = "lbs" | "kg";

const QUICK_WEIGHTS_LBS = [8, 12, 15, 18, 20, 24];
const QUICK_WEIGHTS_KG  = [4, 5, 7, 8, 9, 11];

export default function CookingTurkeyThawCore() {
    const [weight, setWeight] = useState<number>(15);
    const [unit, setUnit] = useState<Unit>("lbs");
    const [cookDate, setCookDate] = useState<string>("");

    const weightLbs = unit === "kg" ? weight * 2.20462 : weight;

    const results = useMemo(() => {
        // Fridge: 24 hours per 4.5 lbs
        const fridgeHours = weightLbs * (24 / 4.5);
        const fridgeDays = Math.ceil(fridgeHours / 24);
        const fridgeDaysExact = fridgeHours / 24;
        const fridgeDaysWhole = Math.floor(fridgeDaysExact);
        const fridgeRemHours = Math.round((fridgeDaysExact - fridgeDaysWhole) * 24);

        // Cold Water: 30 mins per lb
        const waterMinutes = weightLbs * 30;
        const waterHours = Math.floor(waterMinutes / 60);
        const waterRemMins = Math.round(waterMinutes % 60);
        const waterChanges = Math.ceil(waterMinutes / 30);

        // Microwave: 6 mins per lb
        const microMinutes = Math.round(weightLbs * 6);
        const microHours = Math.floor(microMinutes / 60);
        const microRemMins = microMinutes % 60;
        const microFeasible = weightLbs <= 14;

        // Start thawing date (fridge method)
        let startDate: string | null = null;
        if (cookDate) {
            const cook = new Date(cookDate + "T12:00:00");
            if (!isNaN(cook.getTime())) {
                const start = new Date(cook);
                start.setDate(start.getDate() - fridgeDays);
                startDate = start.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
            }
        }

        return {
            fridgeTime: fridgeDaysWhole > 0
                ? `${fridgeDaysWhole} day${fridgeDaysWhole !== 1 ? "s" : ""}${fridgeRemHours > 0 ? `, ${fridgeRemHours} hrs` : ""}`
                : `${Math.round(fridgeHours)} hrs`,
            fridgeDays,
            waterTime: `${waterHours} hrs${waterRemMins > 0 ? `, ${waterRemMins} min` : ""}`,
            waterChanges,
            microTime: microHours > 0
                ? `${microHours} hr${microHours !== 1 ? "s" : ""}${microRemMins > 0 ? `, ${microRemMins} min` : ""}`
                : `${microRemMins} min`,
            microFeasible,
            startDate,
        };
    }, [weightLbs, cookDate]);

    const quickWeights = unit === "lbs" ? QUICK_WEIGHTS_LBS : QUICK_WEIGHTS_KG;

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>

                {/* ── Weight Input ── */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Frozen Turkey Weight</label>
                        <div style={{ display: "flex", gap: "4px", background: "var(--n-bg)", borderRadius: "20px", padding: "3px" }}>
                            {(["lbs", "kg"] as Unit[]).map(u => (
                                <button key={u} onClick={() => {
                                    if (u !== unit) {
                                        setWeight(u === "kg" ? Math.round(weight / 2.20462 * 10) / 10 : Math.round(weight * 2.20462));
                                        setUnit(u);
                                    }
                                }} style={{
                                    padding: "4px 12px", fontSize: "0.75rem", fontWeight: 600,
                                    borderRadius: "16px", border: "none",
                                    background: unit === u ? "var(--primary-color)" : "transparent",
                                    color: unit === u ? "white" : "var(--n-text-secondary)",
                                    cursor: "pointer", transition: "all 0.2s",
                                }}>{u}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                            type="range" className="range-slider" style={{ flex: 1 }}
                            min={unit === "lbs" ? 4 : 2} max={unit === "lbs" ? 30 : 14}
                            step={unit === "lbs" ? 1 : 0.5} value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                        />
                        <input
                            type="number" className="input-field" style={{ width: "80px" }}
                            min={1} max={50} step={unit === "lbs" ? 1 : 0.5} value={weight}
                            onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {quickWeights.map(w => (
                            <button key={w} onClick={() => setWeight(w)} style={{
                                padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600,
                                borderRadius: "20px", border: "1px solid var(--n-border)",
                                background: weight === w ? "var(--primary-color)" : "var(--n-surface)",
                                color: weight === w ? "white" : "var(--n-text-secondary)",
                                cursor: "pointer", transition: "all 0.2s",
                            }}>{w} {unit}</button>
                        ))}
                    </div>
                </div>

                {/* ── Cook Date Planner ── */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>
                        🦃 When Are You Cooking?
                    </label>
                    <p style={{ fontSize: "0.78rem", color: "var(--n-text-muted)", marginBottom: "var(--s-3)", lineHeight: 1.5 }}>
                        Optional — set your cook date and we&apos;ll tell you exactly when to start thawing.
                    </p>
                    <input
                        type="date" className="input-field"
                        value={cookDate}
                        onChange={(e) => setCookDate(e.target.value)}
                        style={{ maxWidth: "260px" }}
                    />
                    {results.startDate && (
                        <div style={{
                            marginTop: "var(--s-3)", padding: "var(--s-4)",
                            background: "#FFF8E1", borderRadius: "var(--r-md)",
                            border: "2px solid #FFD54F",
                        }}>
                            <div style={{ fontSize: "0.78rem", color: "#6D4C00", fontWeight: 600, marginBottom: "var(--s-1)" }}>
                                📅 Start thawing in the fridge on:
                            </div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#4E3600", lineHeight: 1.3 }}>
                                {results.startDate}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#8D6E00", marginTop: "var(--s-2)" }}>
                                That&apos;s {results.fridgeDays} day{results.fridgeDays !== 1 ? "s" : ""} of fridge thawing for a {weight} {unit} turkey.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Results Panel — 3 Method Cards ═══ */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)", border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)", padding: "var(--s-6)", marginTop: "var(--s-6)"
            }}>
                <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: "0 0 var(--s-4) 0" }}>
                    Thawing Time Estimates
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--s-4)" }}>

                    {/* ❄️ Refrigerator */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: "2px solid #06B6D4", textAlign: "center", position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: "60px", height: "60px",
                            background: "linear-gradient(135deg, transparent 50%, #ECFEFF 50%)", zIndex: 0,
                        }} />
                        <div style={{ fontSize: "2rem", marginBottom: "var(--s-2)" }}>❄️</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-1)" }}>Refrigerator</div>
                        <span style={{
                            display: "inline-block", padding: "2px 10px", borderRadius: "12px",
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
                            background: "#DCFCE7", color: "#166534", marginBottom: "var(--s-3)",
                        }}>RECOMMENDED</span>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", lineHeight: 1.5, marginBottom: "var(--s-4)" }}>
                            Safe, slow thawing at 40°F. Turkey stays safe 1–2 days after thawing.
                        </p>
                        <div style={{ fontSize: "0.65rem", color: "#06B6D4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Time Required
                        </div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--n-text)" }}>
                            {results.fridgeTime}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>24 hrs per 4–5 lbs</div>
                    </div>

                    {/* 🚰 Cold Water */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: "2px solid #3B82F6", textAlign: "center", position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: "60px", height: "60px",
                            background: "linear-gradient(135deg, transparent 50%, #EFF6FF 50%)", zIndex: 0,
                        }} />
                        <div style={{ fontSize: "2rem", marginBottom: "var(--s-2)" }}>🚰</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-1)" }}>Cold Water</div>
                        <span style={{
                            display: "inline-block", padding: "2px 10px", borderRadius: "12px",
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
                            background: "#FEF3C7", color: "#92400E", marginBottom: "var(--s-3)",
                        }}>EMERGENCY</span>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", lineHeight: 1.5, marginBottom: "var(--s-4)" }}>
                            Submerge in cold water. Change every 30 min. Cook immediately.
                        </p>
                        <div style={{ fontSize: "0.65rem", color: "#3B82F6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Time Required
                        </div>
                        <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--n-text)" }}>
                            {results.waterTime}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>
                            30 min/lb · <strong style={{ color: "#3B82F6" }}>{results.waterChanges} water changes</strong>
                        </div>
                    </div>

                    {/* 📡 Microwave */}
                    <div style={{
                        background: "var(--n-bg)", padding: "var(--s-5)", borderRadius: "var(--r-lg)",
                        border: `2px solid ${results.microFeasible ? "#8B5CF6" : "#EF4444"}`,
                        textAlign: "center", position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, right: 0, width: "60px", height: "60px",
                            background: `linear-gradient(135deg, transparent 50%, ${results.microFeasible ? "#F5F3FF" : "#FEF2F2"} 50%)`, zIndex: 0,
                        }} />
                        <div style={{ fontSize: "2rem", marginBottom: "var(--s-2)" }}>📡</div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--n-text)", marginBottom: "var(--s-1)" }}>Microwave</div>
                        <span style={{
                            display: "inline-block", padding: "2px 10px", borderRadius: "12px",
                            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em",
                            background: results.microFeasible ? "#F3E8FF" : "#FEE2E2",
                            color: results.microFeasible ? "#6B21A8" : "#991B1B",
                            marginBottom: "var(--s-3)",
                        }}>{results.microFeasible ? "LAST RESORT" : "TOO LARGE"}</span>
                        <p style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", lineHeight: 1.5, marginBottom: "var(--s-4)" }}>
                            {results.microFeasible
                                ? "Defrost setting, rotate frequently. Cook immediately after."
                                : `A ${Math.round(weightLbs)} lb turkey won't fit in most microwaves.`
                            }
                        </p>
                        <div style={{ fontSize: "0.65rem", color: results.microFeasible ? "#8B5CF6" : "#EF4444", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--s-1)" }}>
                            Time Required
                        </div>
                        <div style={{
                            fontSize: "1.75rem", fontWeight: 800,
                            color: results.microFeasible ? "var(--n-text)" : "var(--n-text-muted)",
                            textDecoration: results.microFeasible ? "none" : "line-through",
                        }}>
                            {results.microTime}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--n-text-muted)", marginTop: "var(--s-2)" }}>6 min/lb on defrost</div>
                    </div>
                </div>

                <p style={{ marginTop: "var(--s-4)", fontSize: "0.75rem", color: "var(--n-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
                    All thawing times are USDA estimates. Always verify internal temperature with a meat thermometer before cooking.
                </p>
            </div>
        </div>
    );
}

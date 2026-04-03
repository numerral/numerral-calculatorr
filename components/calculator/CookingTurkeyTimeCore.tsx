"use client";

import React, { useState, useMemo } from "react";

type CookMethod = "oven" | "deepfry" | "convection" | "smoked" | "spatchcock";
type Unit = "lbs" | "kg";

const METHODS: { val: CookMethod; icon: string; label: string }[] = [
    { val: "oven", icon: "🔥", label: "Oven (325°F)" },
    { val: "deepfry", icon: "🍳", label: "Deep Fried" },
    { val: "convection", icon: "🌀", label: "Convection" },
    { val: "smoked", icon: "💨", label: "Smoked" },
    { val: "spatchcock", icon: "🍗", label: "Spatchcock" },
];

function formatTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = Math.round(totalMinutes % 60);
    if (h === 0) return `${m} min`;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function CookingTurkeyTimeCore() {
    const [weight, setWeight] = useState<number>(15);
    const [unit, setUnit] = useState<Unit>("lbs");
    const [method, setMethod] = useState<CookMethod>("oven");
    const [isStuffed, setIsStuffed] = useState<boolean>(false);

    const weightLbs = unit === "kg" ? weight * 2.2046 : weight;

    const results = useMemo(() => {
        const w = weightLbs;
        let minMin = 0, maxMin = 0;
        let temp = "", tempNote = "", methodNote = "", safetyTip = "";

        switch (method) {
            case "oven": {
                const minR = isStuffed ? 15 : 13;
                const maxR = isStuffed ? 18 : 15;
                minMin = w * minR;
                maxMin = w * maxR;
                temp = "325°F (163°C)";
                tempNote = isStuffed
                    ? "Stuffed — stuffing center must also reach 165°F"
                    : "Unstuffed — standard USDA roasting";
                methodNote = "Place turkey breast-side up on a rack in a shallow roasting pan. Tent with foil if skin browns too quickly.";
                break;
            }
            case "deepfry": {
                // Paula Deen formula: (lbs × 3) + 5 minutes
                minMin = (w * 3) + 5;
                maxMin = (w * 3.5) + 5;
                temp = "350°F (177°C) oil";
                tempNote = "Peanut or canola oil — monitor with clip-on thermometer";
                methodNote = "Turkey MUST be fully thawed and patted dry. Never stuff a deep-fried turkey. Keep fire extinguisher ready.";
                safetyTip = "⚠️ Deep fry OUTDOORS only, on a flat surface, away from structures. Never leave unattended.";
                break;
            }
            case "convection": {
                // 25% faster than conventional, temp 25°F lower
                const minR = isStuffed ? 11 : 10;
                const maxR = isStuffed ? 14 : 12;
                minMin = w * minR;
                maxMin = w * maxR;
                temp = "300°F (149°C)";
                tempNote = isStuffed
                    ? "Stuffed — convection fan circulates heat more evenly"
                    : "Unstuffed — ~25% faster than conventional oven";
                methodNote = "Convection ovens circulate hot air, browning skin more evenly. Check 30–45 min earlier than conventional recipes.";
                break;
            }
            case "smoked": {
                // 25-30 min per pound at 225-250°F
                minMin = w * 25;
                maxMin = w * 30;
                temp = "225–250°F (107–121°C)";
                tempNote = "Low and slow — use hickory, apple, or cherry wood chips";
                methodNote = "Maintain consistent smoker temperature. The turkey must pass through the USDA danger zone (40–140°F) within 4 hours.";
                safetyTip = "💡 Brine the turkey 24 hours before smoking for maximum moisture retention.";
                break;
            }
            case "spatchcock": {
                // 6-10 min per pound at 425-450°F
                minMin = w * 6;
                maxMin = w * 10;
                temp = "425–450°F (218–232°C)";
                tempNote = "High heat — remove backbone and flatten bird";
                methodNote = "Spatchcocking cuts cooking time by 40–50%. The flattened bird cooks more evenly with crispier skin all around.";
                break;
            }
        }

        return {
            minTime: formatTime(minMin),
            maxTime: formatTime(maxMin),
            minMinutes: Math.round(minMin),
            maxMinutes: Math.round(maxMin),
            temp,
            tempNote,
            methodNote,
            safetyTip,
            targetInternal: "165°F (74°C)",
        };
    }, [weightLbs, method, isStuffed]);

    const showStuffedToggle = method === "oven" || method === "convection";

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>

                {/* Weight Input */}
                <div className="input-group">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                        <label className="input-label">Turkey Weight</label>
                        <div style={{ display: "flex", gap: "4px", background: "var(--n-bg)", borderRadius: "20px", padding: "3px" }}>
                            {(["lbs", "kg"] as Unit[]).map(u => (
                                <button key={u} onClick={() => setUnit(u)} style={{
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
                        <input type="range" className="range-slider" style={{ flex: 1 }} min={unit === "lbs" ? 4 : 2} max={unit === "lbs" ? 30 : 14} step={unit === "lbs" ? 1 : 0.5} value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                        <input type="number" className="input-field" style={{ width: "80px" }} min={1} max={50} step={0.5} value={weight} onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))} />
                    </div>
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {(unit === "lbs" ? [8, 12, 15, 18, 20, 24] : [4, 5, 7, 8, 9, 11]).map(p => (
                            <button key={p} onClick={() => setWeight(p)} style={{
                                padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600,
                                borderRadius: "20px", border: "1px solid var(--n-border)",
                                background: weight === p ? "var(--primary-color)" : "var(--n-surface)",
                                color: weight === p ? "white" : "var(--n-text-secondary)",
                                cursor: "pointer", transition: "all 0.2s",
                            }}>{p} {unit}</button>
                        ))}
                    </div>
                </div>

                {/* Cooking Method */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Cooking Method</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "var(--s-2)" }}>
                        {METHODS.map(opt => (
                            <button key={opt.val} onClick={() => setMethod(opt.val)}
                                className={method === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                style={{ padding: "0.5rem 0.75rem", fontSize: "0.78rem", borderRadius: "var(--r-md)", textAlign: "center" }}>
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stuffed Toggle (oven + convection only) */}
                {showStuffedToggle && (
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Preparation</label>
                        <div style={{ display: "flex", gap: "var(--s-2)" }}>
                            {[
                                { val: false, label: "Unstuffed" },
                                { val: true, label: "Stuffed" },
                            ].map(opt => (
                                <button key={String(opt.val)} onClick={() => setIsStuffed(opt.val)}
                                    className={isStuffed === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ═══ Results Panel ═══ */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)", border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)", padding: "var(--s-6)", marginTop: "var(--s-6)"
            }}>
                <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: "0 0 var(--s-4) 0" }}>
                    Cooking Time Estimate
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--s-4)" }}>
                    <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Cook Temp</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--n-text)" }}>{results.temp.split(" ")[0]}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{results.temp.includes("(") ? results.temp.substring(results.temp.indexOf("(")) : ""}</div>
                    </div>
                    <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "2px solid var(--primary-color)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--primary-color)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Estimated Time</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary-color)" }}>{results.minTime} – {results.maxTime}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{results.minMinutes}–{results.maxMinutes} minutes total</div>
                    </div>
                    <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Safe Internal Temp</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#16a34a" }}>{results.targetInternal}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>Thigh + breast + stuffing</div>
                    </div>
                </div>

                {/* Method Note */}
                <div style={{
                    marginTop: "var(--s-4)", padding: "var(--s-3)",
                    background: "var(--n-bg)", borderRadius: "var(--r-md)",
                    border: "1px solid var(--n-border)", fontSize: "0.85rem", color: "var(--n-text-secondary)", lineHeight: 1.6
                }}>
                    <strong style={{ color: "var(--n-text)" }}>{results.tempNote}</strong>
                    <br />{results.methodNote}
                </div>

                {/* Safety Warning */}
                {results.safetyTip && (
                    <div style={{
                        marginTop: "var(--s-3)", padding: "var(--s-3)",
                        background: method === "deepfry" ? "#FFF3CD" : "#D1ECF1",
                        borderRadius: "var(--r-md)",
                        border: `1px solid ${method === "deepfry" ? "#FFECB5" : "#BEE5EB"}`,
                        fontSize: "0.85rem",
                        color: method === "deepfry" ? "#664D03" : "#0C5460",
                        lineHeight: 1.6
                    }}>
                        {results.safetyTip}
                    </div>
                )}

                <p style={{ marginTop: "var(--s-3)", fontSize: "0.78rem", color: "var(--n-text-muted)", textAlign: "center" }}>
                    Always use a meat thermometer — insert into the thickest part of the thigh, avoiding the bone.
                    {isStuffed && showStuffedToggle && <strong> The center of the stuffing must also reach 165°F.</strong>}
                </p>
            </div>
        </div>
    );
}

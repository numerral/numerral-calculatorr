"use client";

import React, { useState, useMemo } from "react";

type PanShape = "round" | "square" | "rectangle";
type Mode = "servings" | "converter";
type PortionType = "party" | "wedding";
type CakeShape = "round" | "square" | "sheet";

/* ── Serving data tables ── */
const ROUND_SERVINGS: Record<string, { wedding: number; party: number }> = {
    "6":  { wedding: 11,  party: 6 },
    "8":  { wedding: 20,  party: 10 },
    "9":  { wedding: 27,  party: 14 },
    "10": { wedding: 38,  party: 19 },
    "12": { wedding: 56,  party: 28 },
    "14": { wedding: 64,  party: 32 },
    "16": { wedding: 72,  party: 36 },
};

const SQUARE_SERVINGS: Record<string, { wedding: number; party: number }> = {
    "6":  { wedding: 18,  party: 8 },
    "8":  { wedding: 32,  party: 16 },
    "9":  { wedding: 40,  party: 20 },
    "10": { wedding: 50,  party: 24 },
    "12": { wedding: 72,  party: 36 },
    "14": { wedding: 98,  party: 48 },
    "16": { wedding: 128, party: 64 },
};

const SHEET_SERVINGS: Record<string, { wedding: number; party: number; label: string }> = {
    "quarter": { wedding: 45,  party: 22, label: 'Quarter Sheet (9"×13")' },
    "half":    { wedding: 75,  party: 45, label: 'Half Sheet (13"×18")' },
    "full":    { wedding: 130, party: 75, label: 'Full Sheet (18"×26")' },
};

export default function CookingCakeCore() {
    const [mode, setMode] = useState<Mode>("servings");

    /* ── Servings Mode State ── */
    const [guests, setGuests] = useState<number>(50);
    const [portionType, setPortionType] = useState<PortionType>("party");
    const [cakeShape, setCakeShape] = useState<CakeShape>("round");
    const [cakeSize, setCakeSize] = useState<string>("10");
    const [sheetSize, setSheetSize] = useState<string>("quarter");

    /* ── Converter Mode State ── */
    const [originalShape, setOriginalShape] = useState<PanShape>("round");
    const [originalDim1, setOriginalDim1] = useState<number>(8);
    const [originalDim2, setOriginalDim2] = useState<number>(8);
    const [desiredShape, setDesiredShape] = useState<PanShape>("rectangle");
    const [desiredDim1, setDesiredDim1] = useState<number>(9);
    const [desiredDim2, setDesiredDim2] = useState<number>(13);

    /* ── Area calculation ── */
    const calculateArea = (shape: PanShape, d1: number, d2: number) => {
        if (shape === "round") return Math.PI * Math.pow(d1 / 2, 2);
        if (shape === "square") return d1 * d1;
        if (shape === "rectangle") return d1 * d2;
        return 1;
    };

    /* ── Servings Mode Result ── */
    const servingsResult = useMemo(() => {
        let servingsPerCake = 0;
        let sizeLabel = "";

        if (cakeShape === "round") {
            const data = ROUND_SERVINGS[cakeSize];
            servingsPerCake = portionType === "wedding" ? data.wedding : data.party;
            sizeLabel = `${cakeSize}" Round`;
        } else if (cakeShape === "square") {
            const data = SQUARE_SERVINGS[cakeSize];
            servingsPerCake = portionType === "wedding" ? data.wedding : data.party;
            sizeLabel = `${cakeSize}" Square`;
        } else {
            const data = SHEET_SERVINGS[sheetSize];
            servingsPerCake = portionType === "wedding" ? data.wedding : data.party;
            sizeLabel = data.label;
        }

        const cakesNeeded = Math.ceil(guests / servingsPerCake);
        const totalServings = cakesNeeded * servingsPerCake;
        const leftover = totalServings - guests;

        return { servingsPerCake, cakesNeeded, totalServings, leftover, sizeLabel };
    }, [guests, portionType, cakeShape, cakeSize, sheetSize]);

    /* ── Converter Mode Result ── */
    const converterResult = useMemo(() => {
        const originalArea = calculateArea(originalShape, originalDim1, originalDim2);
        const desiredArea = calculateArea(desiredShape, desiredDim1, desiredDim2);
        const scaleFactor = desiredArea / originalArea;
        return {
            originalArea: originalArea.toFixed(1),
            desiredArea: desiredArea.toFixed(1),
            scaleFactor: scaleFactor.toFixed(2),
        };
    }, [originalShape, originalDim1, originalDim2, desiredShape, desiredDim1, desiredDim2]);

    const sizesForShape = cakeShape === "round" ? Object.keys(ROUND_SERVINGS) : Object.keys(SQUARE_SERVINGS);

    return (
        <div className="calculator-engine">
            {/* Mode Toggle */}
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-1)" }}>
                    <button
                        onClick={() => setMode("servings")}
                        className={mode === "servings" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        🎂 How Many Servings?
                    </button>
                    <button
                        onClick={() => setMode("converter")}
                        className={mode === "converter" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        📐 Pan Converter
                    </button>
                </div>

                {mode === "servings" ? (
                    <>
                        {/* Guests Input */}
                        <div className="input-group">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-2)" }}>
                                <label className="input-label">Number of Guests</label>
                                <span className="input-value" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{guests}</span>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                <input type="range" className="range-slider" style={{ flex: 1 }} min={1} max={500} step={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                                <input type="number" className="input-field" style={{ width: "90px" }} min={1} max={1000} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
                            </div>
                            {/* Guest presets */}
                            <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                                {[25, 50, 75, 100, 150, 200].map(p => (
                                    <button key={p} onClick={() => setGuests(p)} style={{
                                        padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600,
                                        borderRadius: "20px", border: "1px solid var(--n-border)",
                                        background: guests === p ? "var(--primary-color)" : "var(--n-surface)",
                                        color: guests === p ? "white" : "var(--n-text-secondary)",
                                        cursor: "pointer", transition: "all 0.2s",
                                    }}>{p} guests</button>
                                ))}
                            </div>
                        </div>

                        {/* Portion Type */}
                        <div className="input-group">
                            <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Portion Size</label>
                            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                                <button onClick={() => setPortionType("party")}
                                    className={portionType === "party" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                    🎉 Party (2"×2")
                                </button>
                                <button onClick={() => setPortionType("wedding")}
                                    className={portionType === "wedding" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                    💍 Wedding (1"×2")
                                </button>
                            </div>
                        </div>

                        {/* Cake Shape */}
                        <div className="input-group">
                            <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>Cake Shape</label>
                            <div style={{ display: "flex", gap: "var(--s-2)" }}>
                                {[
                                    { val: "round" as CakeShape, icon: "⭕", label: "Round" },
                                    { val: "square" as CakeShape, icon: "⬜", label: "Square" },
                                    { val: "sheet" as CakeShape, icon: "📋", label: "Sheet" },
                                ].map(opt => (
                                    <button key={opt.val} onClick={() => { setCakeShape(opt.val); if (opt.val !== "sheet") setCakeSize("10"); }}
                                        className={cakeShape === opt.val ? "btn-premium" : "btn-premium btn-premium--secondary"}
                                        style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--r-md)", flex: 1 }}>
                                        {opt.icon} {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="input-group">
                            <label className="input-label" style={{ marginBottom: "var(--s-2)" }}>
                                {cakeShape === "sheet" ? "Sheet Size" : "Cake Size"}
                            </label>
                            {cakeShape === "sheet" ? (
                                <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                                    {Object.entries(SHEET_SERVINGS).map(([key, val]) => (
                                        <button key={key} onClick={() => setSheetSize(key)} style={{
                                            padding: "6px 14px", fontSize: "0.78rem", fontWeight: 600,
                                            borderRadius: "20px", border: "1px solid var(--n-border)",
                                            background: sheetSize === key ? "var(--primary-color)" : "var(--n-surface)",
                                            color: sheetSize === key ? "white" : "var(--n-text-secondary)",
                                            cursor: "pointer", transition: "all 0.2s",
                                        }}>{val.label}</button>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
                                    {sizesForShape.map(s => (
                                        <button key={s} onClick={() => setCakeSize(s)} style={{
                                            padding: "6px 14px", fontSize: "0.78rem", fontWeight: 600,
                                            borderRadius: "20px", border: "1px solid var(--n-border)",
                                            background: cakeSize === s ? "var(--primary-color)" : "var(--n-surface)",
                                            color: cakeSize === s ? "white" : "var(--n-text-secondary)",
                                            cursor: "pointer", transition: "all 0.2s",
                                        }}>{s}"</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* ── Pan Converter Mode ── */
                    <>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                            {/* Original Pan */}
                            <div style={{ background: "var(--n-surface)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "var(--s-3)" }}>
                                    ① Original Pan
                                </div>
                                <div className="input-group" style={{ marginBottom: "var(--s-3)" }}>
                                    <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>Shape</label>
                                    <select value={originalShape} onChange={(e) => setOriginalShape(e.target.value as PanShape)} className="input-field" style={{ width: "100%" }}>
                                        <option value="round">Round Pan</option>
                                        <option value="square">Square Pan</option>
                                        <option value="rectangle">Rectangular / Sheet Pan</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>
                                            {originalShape === "round" ? "Diameter (in)" : originalShape === "square" ? "Side (in)" : "Length (in)"}
                                        </label>
                                        <input type="number" min="1" step="0.5" value={originalDim1} onChange={(e) => setOriginalDim1(parseFloat(e.target.value) || 1)} className="input-field" style={{ width: "100%" }} />
                                    </div>
                                    {originalShape === "rectangle" && (
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>Width (in)</label>
                                            <input type="number" min="1" step="0.5" value={originalDim2} onChange={(e) => setOriginalDim2(parseFloat(e.target.value) || 1)} className="input-field" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Desired Pan */}
                            <div style={{ background: "var(--n-surface)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, marginBottom: "var(--s-3)" }}>
                                    ② Desired Pan
                                </div>
                                <div className="input-group" style={{ marginBottom: "var(--s-3)" }}>
                                    <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>Shape</label>
                                    <select value={desiredShape} onChange={(e) => setDesiredShape(e.target.value as PanShape)} className="input-field" style={{ width: "100%" }}>
                                        <option value="round">Round Pan</option>
                                        <option value="square">Square Pan</option>
                                        <option value="rectangle">Rectangular / Sheet Pan</option>
                                    </select>
                                </div>
                                <div style={{ display: "flex", gap: "var(--s-2)" }}>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>
                                            {desiredShape === "round" ? "Diameter (in)" : desiredShape === "square" ? "Side (in)" : "Length (in)"}
                                        </label>
                                        <input type="number" min="1" step="0.5" value={desiredDim1} onChange={(e) => setDesiredDim1(parseFloat(e.target.value) || 1)} className="input-field" style={{ width: "100%" }} />
                                    </div>
                                    {desiredShape === "rectangle" && (
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label className="input-label" style={{ fontSize: "0.8rem", marginBottom: "4px" }}>Width (in)</label>
                                            <input type="number" min="1" step="0.5" value={desiredDim2} onChange={(e) => setDesiredDim2(parseFloat(e.target.value) || 1)} className="input-field" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ═══ Results Panel ═══ */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)", border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)", padding: "var(--s-6)", marginTop: "var(--s-6)"
            }}>
                {mode === "servings" ? (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
                            <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: 0 }}>
                                Cake Estimate
                            </h3>
                            <span style={{ background: "var(--primary-color)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                                {portionType === "wedding" ? '1"×2" slices' : '2"×2" slices'}
                            </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                            <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Cakes Needed</div>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--n-text)" }}>{servingsResult.cakesNeeded}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{servingsResult.sizeLabel}</div>
                            </div>
                            <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Total Servings</div>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--n-text)" }}>{servingsResult.totalServings}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>{servingsResult.leftover} extra portions</div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: "var(--s-4)", padding: "var(--s-3)",
                            background: "var(--n-bg)", borderRadius: "var(--r-md)",
                            border: "1px solid var(--n-border)", fontSize: "0.875rem", lineHeight: 1.6
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--n-text-muted)" }}>Servings per cake:</span>
                                <strong>{servingsResult.servingsPerCake} ({portionType} portions)</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--n-text-muted)" }}>For {guests} guests:</span>
                                <strong style={{ color: "var(--primary-color)" }}>{servingsResult.cakesNeeded} × {servingsResult.sizeLabel}</strong>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
                            <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: 0 }}>
                                Recipe Multiplier
                            </h3>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                            <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Multiply By</div>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--primary-color)" }}>{converterResult.scaleFactor}×</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>every ingredient</div>
                            </div>
                            <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)", textAlign: "center" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginBottom: "var(--s-1)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Area Change</div>
                                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--n-text)" }}>
                                    {((parseFloat(converterResult.scaleFactor) - 1) * 100).toFixed(0)}%
                                </div>
                                <div style={{ fontSize: "0.8rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                                    {parseFloat(converterResult.scaleFactor) > 1 ? "larger" : "smaller"}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: "var(--s-4)", padding: "var(--s-3)",
                            background: "var(--n-bg)", borderRadius: "var(--r-md)",
                            border: "1px solid var(--n-border)", fontSize: "0.875rem", lineHeight: 1.6
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--n-text-muted)" }}>Original pan area:</span>
                                <strong>{converterResult.originalArea} sq in</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--n-text-muted)" }}>Desired pan area:</span>
                                <strong style={{ color: "var(--primary-color)" }}>{converterResult.desiredArea} sq in</strong>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

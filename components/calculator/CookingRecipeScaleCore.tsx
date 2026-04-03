"use client";

import { useState, useMemo } from "react";

/* ── Fraction parser: accepts "1/2", "2/3", "1 1/2" (mixed), or plain numbers ── */
function parseFraction(input: string): number {
    const s = input.trim();
    if (!s) return NaN;

    // Mixed number: "1 1/2"
    const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixed) return parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);

    // Simple fraction: "1/2"
    const frac = s.match(/^(\d+)\/(\d+)$/);
    if (frac) return parseInt(frac[1]) / parseInt(frac[2]);

    // Decimal / whole number
    return parseFloat(s);
}

/* ── Smart unit conversion: 24 tsp → "½ cup" ── */
const UNIT_CHAINS: Record<string, { next: string; factor: number }[]> = {
    tsp:  [{ next: "tbsp", factor: 3 }, { next: "cup", factor: 48 }],
    tbsp: [{ next: "cup", factor: 16 }],
    cup:  [{ next: "pint", factor: 2 }, { next: "quart", factor: 4 }],
    "fl oz": [{ next: "cup", factor: 8 }],
    oz:   [{ next: "lb", factor: 16 }],
    g:    [{ next: "kg", factor: 1000 }],
    mL:   [{ next: "L", factor: 1000 }],
    ml:   [{ next: "L", factor: 1000 }],
};

function smartConvert(value: number, unit: string): { value: number; unit: string } {
    const key = unit.toLowerCase().replace(/\.$/, "");
    const chain = UNIT_CHAINS[key];
    if (!chain) return { value, unit };

    for (const step of chain) {
        if (value >= step.factor) {
            return { value: value / step.factor, unit: step.next };
        }
    }
    return { value, unit };
}

/* ── Pretty fraction formatter ── */
const FRACTION_MAP: [number, string][] = [
    [0.125, "⅛"], [0.25, "¼"], [0.333, "⅓"], [0.375, "⅜"],
    [0.5, "½"], [0.625, "⅝"], [0.667, "⅔"], [0.75, "¾"], [0.875, "⅞"],
];

function formatPretty(n: number): string {
    if (Number.isInteger(n)) return n.toString();
    const whole = Math.floor(n);
    const remainder = n - whole;

    // Try to match common fractions (within tolerance)
    for (const [dec, sym] of FRACTION_MAP) {
        if (Math.abs(remainder - dec) < 0.02) {
            return whole > 0 ? `${whole} ${sym}` : sym;
        }
    }
    // Fall back to 2-decimal
    return n.toFixed(2);
}

/* ── Unit options ── */
const UNIT_OPTIONS = [
    "tsp", "tbsp", "cup", "fl oz", "oz", "lb",
    "g", "kg", "mL", "L", "pinch", "dash", "each", ""
];

interface Ingredient {
    id: string;
    qty: string;
    unit: string;
    name: string;
}

export default function CookingRecipeScaleCore() {
    // Mode: "portions" (yields) or "scale" (direct multiplier)
    const [mode, setMode] = useState<"portions" | "scale">("portions");

    // Portions mode state
    const [originalYield, setOriginalYield] = useState<number>(4);
    const [desiredYield, setDesiredYield] = useState<number>(10);

    // Scale mode state
    const [directScale, setDirectScale] = useState<string>("2");

    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: "1", qty: "2", unit: "cup", name: "All-purpose flour" },
        { id: "2", qty: "1", unit: "tsp", name: "Baking soda" },
        { id: "3", qty: "1/2", unit: "tsp", name: "Salt" },
        { id: "4", qty: "1", unit: "cup", name: "Butter, softened" },
        { id: "5", qty: "3/4", unit: "cup", name: "Granulated sugar" },
        { id: "6", qty: "2", unit: "each", name: "Eggs" },
    ]);

    const multiplier = useMemo(() => {
        if (mode === "scale") {
            const parsed = parseFraction(directScale);
            return isNaN(parsed) ? 1 : parsed;
        }
        return desiredYield / (originalYield || 1);
    }, [mode, directScale, desiredYield, originalYield]);

    const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
        setIngredients(ingredients.map(ing =>
            ing.id === id ? { ...ing, [field]: value } : ing
        ));
    };

    const addIngredientRow = () => {
        setIngredients([...ingredients, { id: Math.random().toString(), qty: "1", unit: "", name: "" }]);
    };

    const removeIngredient = (id: string) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter(ing => ing.id !== id));
        }
    };

    const formatScaled = (qtyStr: string, unit: string) => {
        const parsed = parseFraction(qtyStr);
        if (isNaN(parsed)) return { display: "—", unit };
        const scaled = parsed * multiplier;
        const converted = smartConvert(scaled, unit);
        return { display: formatPretty(converted.value), unit: converted.unit };
    };

    const applyPreset = (factor: number) => {
        if (mode === "scale") {
            setDirectScale(factor.toString());
        } else {
            setDesiredYield(Math.round(originalYield * factor));
        }
    };

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>

                {/* Mode Tabs */}
                <div style={{ display: "flex", gap: "var(--s-2)", marginBottom: "var(--s-2)" }}>
                    <button
                        onClick={() => setMode("portions")}
                        className={mode === "portions" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        Convert by Portions
                    </button>
                    <button
                        onClick={() => setMode("scale")}
                        className={mode === "scale" ? "btn-premium" : "btn-premium btn-premium--secondary"}
                        style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem", borderRadius: "var(--r-md)" }}
                    >
                        Convert by Scale
                    </button>
                </div>

                {/* Configuration Panel */}
                <div style={{ background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)" }}>
                    {mode === "portions" ? (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)" }}>
                            <div className="input-group">
                                <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block" }}>Original Servings</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={originalYield}
                                    min={1}
                                    onChange={(e) => setOriginalYield(Number(e.target.value))}
                                />
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>Recipe&apos;s original yield</div>
                            </div>
                            <div className="input-group">
                                <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block", color: "var(--primary-color)" }}>Desired Servings</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={desiredYield}
                                    min={1}
                                    style={{ borderColor: "var(--primary-color)" }}
                                    onChange={(e) => setDesiredYield(Number(e.target.value))}
                                />
                                <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                                    Conversion factor: <strong>{multiplier.toFixed(2)}×</strong>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="input-group">
                            <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block" }}>Scale Factor (Multiplier)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={directScale}
                                placeholder="e.g. 2, 0.5, 1/2, 3"
                                style={{ maxWidth: "200px", borderColor: "var(--primary-color)" }}
                                onChange={(e) => setDirectScale(e.target.value)}
                            />
                            <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                                Enter a number, decimal, or fraction (e.g., 1/2). Multiplier: <strong>{multiplier.toFixed(2)}×</strong>
                            </div>
                        </div>
                    )}

                    {/* Preset Buttons */}
                    <div style={{ display: "flex", gap: "var(--s-2)", marginTop: "var(--s-3)", flexWrap: "wrap" }}>
                        {[
                            { label: "½×", factor: 0.5 },
                            { label: "2×", factor: 2 },
                            { label: "3×", factor: 3 },
                            { label: "4×", factor: 4 },
                        ].map(p => (
                            <button
                                key={p.label}
                                onClick={() => applyPreset(p.factor)}
                                style={{
                                    padding: "6px 14px", fontSize: "0.8rem", fontWeight: 600,
                                    borderRadius: "20px", border: "1px solid var(--n-border)",
                                    background: "var(--n-surface)", color: "var(--n-text-secondary)",
                                    cursor: "pointer", transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; e.currentTarget.style.color = "var(--primary-color)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--n-border)"; e.currentTarget.style.color = "var(--n-text-secondary)"; }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ingredient Builder */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-3)" }}>
                        <h3 className="t-h3">Recipe Ingredients</h3>
                        <button onClick={addIngredientRow} className="btn-premium btn-premium--secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                            + Add Ingredient
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                        {/* Header Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "90px 100px 1fr 30px", gap: "8px", padding: "0 8px" }}>
                            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Qty</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unit</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingredient</span>
                            <span></span>
                        </div>

                        {/* Input Rows */}
                        {ingredients.map((ing) => (
                            <div key={ing.id} style={{ display: "grid", gridTemplateColumns: "90px 100px 1fr 30px", gap: "8px", alignItems: "center" }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ padding: "8px" }}
                                    value={ing.qty}
                                    placeholder="1/2"
                                    onChange={(e) => updateIngredient(ing.id, "qty", e.target.value)}
                                />
                                <select
                                    className="input-field"
                                    style={{ padding: "8px", appearance: "auto" }}
                                    value={ing.unit}
                                    onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                                >
                                    {UNIT_OPTIONS.map(u => (
                                        <option key={u} value={u}>{u || "—"}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ padding: "8px" }}
                                    placeholder="e.g. Flour, Sugar..."
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                                />
                                <button
                                    onClick={() => removeIngredient(ing.id)}
                                    style={{ background: "transparent", border: "none", color: "var(--error-color)", cursor: "pointer", padding: "4px", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Remove ingredient"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Scaled Results Panel */}
            <div className="calculator-engine__results" style={{
                background: "var(--n-surface)",
                border: "1px solid var(--primary-color)",
                borderRadius: "var(--r-xl)",
                padding: "var(--s-6)",
                marginTop: "var(--s-6)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--s-4)" }}>
                    <h3 className="t-h3" style={{ color: "var(--primary-color)", margin: 0 }}>
                        Scaled Recipe
                    </h3>
                    <span style={{ background: "var(--primary-color)", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                        {multiplier.toFixed(2)}× · {mode === "portions" ? `Makes ${desiredYield}` : `Factor ${multiplier.toFixed(1)}`}
                    </span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {ingredients.map((ing, idx) => {
                        const result = formatScaled(ing.qty, ing.unit);
                        return (
                            <li key={`res-${ing.id}`} style={{
                                padding: "var(--s-3) 0",
                                borderBottom: idx === ingredients.length - 1 ? "none" : "1px solid var(--n-border)",
                                display: "flex",
                                alignItems: "baseline",
                                gap: "8px"
                            }}>
                                <strong style={{ fontSize: "1.25rem", color: "var(--n-text)", minWidth: "70px" }}>{result.display}</strong>
                                <span style={{ color: "var(--n-text-muted)", fontStyle: "italic", minWidth: "50px" }}>{result.unit}</span>
                                <span style={{ fontSize: "1.125rem", fontWeight: 500 }}>{ing.name || "—"}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

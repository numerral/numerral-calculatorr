"use client";

import { useState } from "react";

interface Ingredient {
    id: string;
    qty: string;
    unit: string;
    name: string;
}

export default function CookingRecipeScaleCore() {
    const [originalYield, setOriginalYield] = useState<number>(4);
    const [desiredYield, setDesiredYield] = useState<number>(10);
    
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: "1", qty: "2", unit: "cups", name: "All-purpose flour" },
        { id: "2", qty: "1", unit: "tsp", name: "Baking soda" },
        { id: "3", qty: "0.5", unit: "tsp", name: "Salt" },
        { id: "4", qty: "1", unit: "cup", name: "Butter, softened" },
    ]);

    const multiplier = desiredYield / (originalYield || 1);

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

    // Helper to format scaled quantities elegantly (avoid 0.33333333333)
    const formatScaled = (qtyStr: string) => {
        const parsed = parseFloat(qtyStr);
        if (isNaN(parsed)) return "—";
        const scaled = parsed * multiplier;
        return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(2);
    };

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-6)" }}>
                
                {/* Yield Configuration */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-4)", background: "var(--n-bg)", padding: "var(--s-4)", borderRadius: "var(--r-md)", border: "1px solid var(--n-border)" }}>
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block" }}>Original Recipe Yield</label>
                        <input 
                            type="number" 
                            className="input-field" 
                            value={originalYield} 
                            min={1}
                            onChange={(e) => setOriginalYield(Number(e.target.value))} 
                        />
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>Servings, cookies, etc.</div>
                    </div>
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block", color: "var(--primary-color)" }}>Desired Yield</label>
                        <input 
                            type="number" 
                            className="input-field" 
                            value={desiredYield} 
                            min={1}
                            style={{ borderColor: "var(--primary-color)" }}
                            onChange={(e) => setDesiredYield(Number(e.target.value))} 
                        />
                        <div style={{ fontSize: "0.75rem", color: "var(--n-text-muted)", marginTop: "4px" }}>
                            Multiplier: <strong>{multiplier.toFixed(2)}x</strong>
                        </div>
                    </div>
                </div>

                {/* Recipe Builder */}
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--s-3)" }}>
                        <h3 className="t-h3">Recipe Ingredients</h3>
                        <button onClick={addIngredientRow} className="btn-premium btn-premium--secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                            + Add Item
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)" }}>
                        {/* Header Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "80px 100px 1fr 30px", gap: "8px", padding: "0 8px" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase" }}>Qty</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase" }}>Unit</span>
                            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--n-text-muted)", textTransform: "uppercase" }}>Ingredient</span>
                            <span></span>
                        </div>

                        {/* Input Rows */}
                        {ingredients.map((ing) => (
                            <div key={ing.id} style={{ display: "grid", gridTemplateColumns: "80px 100px 1fr 30px", gap: "8px", alignItems: "center" }}>
                                <input 
                                    type="number" 
                                    className="input-field" 
                                    style={{ padding: "8px" }}
                                    value={ing.qty} 
                                    step="any"
                                    onChange={(e) => updateIngredient(ing.id, "qty", e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ padding: "8px" }}
                                    placeholder="cup, tsp..."
                                    value={ing.unit} 
                                    onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    style={{ padding: "8px" }}
                                    placeholder="Flour"
                                    value={ing.name} 
                                    onChange={(e) => updateIngredient(ing.id, "name", e.target.value)} 
                                />
                                <button 
                                    onClick={() => removeIngredient(ing.id)}
                                    style={{ background: "transparent", border: "none", color: "var(--error-color)", cursor: "pointer", padding: "4px", fontSize: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    title="Remove row"
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
                    <span style={{ background: "var(--primary-color)", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700 }}>
                        Makes {desiredYield}
                    </span>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {ingredients.map((ing, idx) => (
                        <li key={`res-${ing.id}`} style={{ 
                            padding: "var(--s-3) 0", 
                            borderBottom: idx === ingredients.length - 1 ? "none" : "1px solid var(--n-border)",
                            display: "flex",
                            alignItems: "baseline",
                            gap: "8px"
                        }}>
                            <strong style={{ fontSize: "1.25rem", color: "var(--n-text)", minWidth: "60px" }}>{formatScaled(ing.qty)}</strong>
                            <span style={{ color: "var(--n-text-muted)", fontStyle: "italic", minWidth: "60px" }}>{ing.unit}</span>
                            <span style={{ fontSize: "1.125rem", fontWeight: 500 }}>{ing.name || "—"}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
